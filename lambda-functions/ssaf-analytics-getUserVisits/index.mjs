const SESSION_VALIDATION_URL = "https://u7fyurbrjc.execute-api.us-east-2.amazonaws.com/session/validate";
const TABLE_NAME = "ssaf-analytics-site-visit-logs";

const allowedOrigin = (origin) =>
  !origin || origin === "https://nickhanson.me" || origin === "https://www.nickhanson.me" ||
  /^https:\/\/deploy-preview-\d+--resonant-ganache-9efedd\.netlify\.app$/.test(origin);

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

  const token = getBearerToken(event);
  if (!token) return response(event, 401, { code: "UNAUTHORIZED", message: "Missing bearer token" });

  let session;
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
  } catch {
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
    const dynamo = getDocumentClient ? getDocumentClient() : await (async () => {
      const { default: AWS } = await import("aws-sdk");
      return new AWS.DynamoDB.DocumentClient();
    })();
    const names = { "#ip": "ip" };
    const values = {};
    const placeholders = ips.map((ip, index) => {
      values[`:ip${index}`] = ip;
      return `:ip${index}`;
    });
    const items = [];
    let ExclusiveStartKey;
    do {
      const page = await dynamo.scan({
        TableName: TABLE_NAME,
        FilterExpression: `#ip IN (${placeholders.join(", ")})`,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
        ExclusiveStartKey,
      }).promise();
      items.push(...(page.Items || []));
      ExclusiveStartKey = page.LastEvaluatedKey;
    } while (ExclusiveStartKey);
    return response(event, 200, items);
  } catch (error) {
    console.error("Visit-log query failed", error?.message || "unknown error");
    return response(event, 500, { code: "INTERNAL_ERROR", message: "Unable to load visit logs" });
  }
};

export const handler = createHandler();
