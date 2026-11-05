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
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      ...(allowedOrigin(origin) ? { "Access-Control-Allow-Origin": origin || "*" } : {}),
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      ...(origin ? { Vary: "Origin" } : {}),
    },
    body: JSON.stringify(payload),
  };
};

const getBearerToken = (event) => {
  const value = event?.headers?.authorization || event?.headers?.Authorization || "";
  return /^Bearer\s+(.+)$/i.exec(value.trim())?.[1] || "";
};

export const createHandler = ({ fetchFn = fetch, getDocumentClient } = {}) => async (event) => {
  if (event?.httpMethod === "OPTIONS" || event?.requestContext?.http?.method === "OPTIONS") return response(event, 200, { message: "OK" });
  const origin = event?.headers?.origin || event?.headers?.Origin || "";
  if (!allowedOrigin(origin)) return response(event, 403, { code: "FORBIDDEN", message: "Origin not allowed" });

  const token = getBearerToken(event);
  if (!token) return response(event, 401, { code: "UNAUTHORIZED", message: "Missing bearer token" });

  const validationStartedAt = Date.now();
  try {
    const validation = await fetchFn(SESSION_VALIDATION_URL, {
      method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: "{}", signal: AbortSignal.timeout(5000),
    });
    if (validation.status === 401) return response(event, 401, { code: "UNAUTHORIZED", message: "Invalid or expired session" });
    if (!validation.ok) throw new Error("Session validator unavailable");
    const session = await validation.json();
    console.info("Analytics session validation completed", {
      status: validation.status,
      elapsedMs: Date.now() - validationStartedAt,
    });
    if (session?.valid !== true) return response(event, 401, { code: "UNAUTHORIZED", message: "Invalid session" });
    if (session?.user?.role !== "admin") return response(event, 403, { code: "FORBIDDEN", message: "Administrator access required" });

    const dynamo = getDocumentClient ? getDocumentClient() : dynamoClient;
    console.info("Analytics DynamoDB client ready");
    const items = [];
    let ExclusiveStartKey;
    let pageNumber = 0;
    do {
      pageNumber += 1;
      const scanStartedAt = Date.now();
      console.info("Starting all-visits scan", { pageNumber });
      const page = await scanPage(dynamo, { TableName: TABLE_NAME, ExclusiveStartKey });
      console.info("All-visits scan completed", {
        pageNumber,
        elapsedMs: Date.now() - scanStartedAt,
        itemCount: page.Items?.length || 0,
      });
      items.push(...(page.Items || []));
      ExclusiveStartKey = page.LastEvaluatedKey;
    } while (ExclusiveStartKey);
    return response(event, 200, items);
  } catch (error) {
    console.error("All visit-log query failed", {
      name: error?.name,
      code: error?.code,
      statusCode: error?.$metadata?.httpStatusCode || error?.statusCode,
      requestId: error?.$metadata?.requestId || error?.requestId,
      message: error?.message || "unknown error",
    });
    return response(event, 503, { code: "SERVICE_UNAVAILABLE", message: "Unable to load all visit logs" });
  }
};

export const handler = createHandler();
