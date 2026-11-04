const SESSION_VALIDATION_URL = "https://u7fyurbrjc.execute-api.us-east-2.amazonaws.com/session/validate";
const TABLE_NAME = "ssaf-analytics-site-visit-logs";

const allowedOrigin = (origin) =>
  !origin || origin === "https://nickhanson.me" || origin === "https://www.nickhanson.me" ||
  /^https:\/\/deploy-preview-\d+--resonant-ganache-9efedd\.netlify\.app$/.test(origin);

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
  const token = getBearerToken(event);
  if (!token) return response(event, 401, { code: "UNAUTHORIZED", message: "Missing bearer token" });

  try {
    const validation = await fetchFn(SESSION_VALIDATION_URL, {
      method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: "{}", signal: AbortSignal.timeout(5000),
    });
    if (validation.status === 401) return response(event, 401, { code: "UNAUTHORIZED", message: "Invalid or expired session" });
    if (!validation.ok) throw new Error("Session validator unavailable");
    const session = await validation.json();
    if (session?.valid !== true) return response(event, 401, { code: "UNAUTHORIZED", message: "Invalid session" });
    if (session?.user?.role !== "admin") return response(event, 403, { code: "FORBIDDEN", message: "Administrator access required" });

    const dynamo = getDocumentClient ? getDocumentClient() : await (async () => {
      const { default: AWS } = await import("aws-sdk");
      return new AWS.DynamoDB.DocumentClient();
    })();
    const items = [];
    let ExclusiveStartKey;
    do {
      const page = await dynamo.scan({ TableName: TABLE_NAME, ExclusiveStartKey }).promise();
      items.push(...(page.Items || []));
      ExclusiveStartKey = page.LastEvaluatedKey;
    } while (ExclusiveStartKey);
    return response(event, 200, items);
  } catch (error) {
    console.error("All visit-log query failed", error?.message || "unknown error");
    return response(event, 503, { code: "SERVICE_UNAVAILABLE", message: "Unable to load all visit logs" });
  }
};

export const handler = createHandler();
