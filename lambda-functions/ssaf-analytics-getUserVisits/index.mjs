import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const SESSION_VALIDATION_URL = "https://u7fyurbrjc.execute-api.us-east-2.amazonaws.com/session/validate";
const TABLE_NAME = "ssaf-analytics-site-visit-logs";
const DYNAMODB_REQUEST_TIMEOUT_MS = 1500;
const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-2",
  maxAttempts: 1,
  requestHandler: {
    connectionTimeout: DYNAMODB_REQUEST_TIMEOUT_MS,
    requestTimeout: DYNAMODB_REQUEST_TIMEOUT_MS,
  },
}));

console.info("Analytics AWS SDK v3 modules loaded");

const scanPage = (client, params) =>
  typeof client.scan === "function"
    ? client.scan(params).promise()
    : client.send(new ScanCommand(params));

const ALLOWED_ORIGINS = new Set([
  "https://nickhanson.me",
  "https://www.nickhanson.me",
  "https://deploy-preview-6--resonant-ganache-9efedd.netlify.app",
  "https://deploy-preview-9--resonant-ganache-9efedd.netlify.app",
  "https://deploy-preview-10--resonant-ganache-9efedd.netlify.app",
]);

const allowedOrigin = (origin) => !origin || ALLOWED_ORIGINS.has(origin);

const response = (event, statusCode, payload) => {
  const origin = event?.headers?.origin || event?.headers?.Origin || "";
  const allowed = allowedOrigin(origin);
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      ...(allowed ? { "Access-Control-Allow-Origin": origin || "*" } : {}),
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
      "Access-Control-Allow-Methods": "POST,OPTIONS",
      ...(origin ? { Vary: "Origin" } : {}),
    },
    body: JSON.stringify(payload),
  };
};

const getBearerToken = (event) => {
  const value = event?.headers?.authorization || event?.headers?.Authorization || "";
  const match = /^Bearer\s+(.+)$/i.exec(value.trim());
  return match?.[1] || "";
};

export const createHandler = ({ fetchFn = fetch, getDocumentClient } = {}) => async (event) => {
  if (event?.httpMethod === "OPTIONS" || event?.requestContext?.http?.method === "OPTIONS") {
    return response(event, 200, { message: "OK" });
  }

  const origin = event?.headers?.origin || event?.headers?.Origin || "";
  if (!allowedOrigin(origin)) return response(event, 403, { code: "FORBIDDEN", message: "Origin not allowed" });

  const token = getBearerToken(event);
  if (!token) return response(event, 401, { code: "UNAUTHORIZED", message: "Missing bearer token" });

  let session;
  const validationStartedAt = Date.now();
  try {
    const validation = await fetchFn(SESSION_VALIDATION_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: "{}",
      signal: AbortSignal.timeout(5000),
    });
    if (validation.status === 401) return response(event, 401, { code: "UNAUTHORIZED", message: "Invalid or expired session" });
    if (!validation.ok) throw new Error("Session validator unavailable");
    session = await validation.json();
    console.info("Analytics session validation completed", {
      status: validation.status,
      elapsedMs: Date.now() - validationStartedAt,
    });
  } catch {
    console.error("Analytics session validation failed", {
      elapsedMs: Date.now() - validationStartedAt,
    });
    return response(event, 503, { code: "AUTH_UNAVAILABLE", message: "Session validation unavailable" });
  }

  if (session?.valid !== true || typeof session?.user?.username !== "string") {
    return response(event, 401, { code: "UNAUTHORIZED", message: "Invalid session" });
  }

  const ips = [...new Set((Array.isArray(session.user.knownIps) ? session.user.knownIps : [])
    .map((entry) => typeof entry?.ip === "string" ? entry.ip : "")
    .filter(Boolean))].slice(0, 100);
  if (ips.length === 0) return response(event, 200, []);

  try {
    const dynamo = getDocumentClient ? getDocumentClient() : dynamoClient;
    console.info("Analytics DynamoDB client ready");
    const names = { "#ip": "ip" };
    const values = {};
    const placeholders = ips.map((ip, index) => {
      values[`:ip${index}`] = ip;
      return `:ip${index}`;
    });
    const items = [];
    let ExclusiveStartKey;
    let pageNumber = 0;
    do {
      pageNumber += 1;
      const scanStartedAt = Date.now();
      console.info("Starting personal visit-log scan", { pageNumber });
      const page = await scanPage(dynamo, {
        TableName: TABLE_NAME,
        FilterExpression: `#ip IN (${placeholders.join(", ")})`,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
        ExclusiveStartKey,
      });
      console.info("Personal visit-log scan completed", {
        pageNumber,
        elapsedMs: Date.now() - scanStartedAt,
        itemCount: page.Items?.length || 0,
      });
      items.push(...(page.Items || []));
      ExclusiveStartKey = page.LastEvaluatedKey;
    } while (ExclusiveStartKey);
    return response(event, 200, items);
  } catch (error) {
    console.error("Visit-log query failed", {
      name: error?.name,
      code: error?.code,
      statusCode: error?.$metadata?.httpStatusCode || error?.statusCode,
      requestId: error?.$metadata?.requestId || error?.requestId,
      message: error?.message || "unknown error",
    });
    return response(event, 500, { code: "INTERNAL_ERROR", message: "Unable to load visit logs" });
  }
};

export const handler = createHandler();
