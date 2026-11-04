import { randomUUID } from "node:crypto";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

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

console.info("Visit writer AWS SDK v3 modules loaded");

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
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST,OPTIONS",
      ...(origin ? { Vary: "Origin" } : {}),
    },
    body: JSON.stringify(payload),
  };
};

export const createHandler = ({ getDocumentClient, now = () => new Date().toISOString(), id = randomUUID } = {}) => async (event) => {
  if (event?.httpMethod === "OPTIONS" || event?.requestContext?.http?.method === "OPTIONS") return response(event, 200, { message: "OK" });
  const origin = event?.headers?.origin || event?.headers?.Origin || "";
  if (!allowedOrigin(origin)) return response(event, 403, { code: "FORBIDDEN", message: "Origin not allowed" });

  let input;
  try {
    if (typeof event?.body === "string" && event.body.length > 4096) {
      return response(event, 413, { code: "PAYLOAD_TOO_LARGE", message: "Visit payload is too large" });
    }
    input = JSON.parse(event?.body || "{}");
  } catch {
    return response(event, 400, { code: "INVALID_REQUEST", message: "Invalid JSON body" });
  }
  const path = typeof input.path === "string" && input.path.startsWith("/") ? input.path.slice(0, 500) : "/";
  const ip = event?.requestContext?.http?.sourceIp || event?.requestContext?.identity?.sourceIp || "unknown";
  const headers = event?.headers || {};
  const userAgent = (headers["user-agent"] || headers["User-Agent"] || "").slice(0, 1000);

  try {
    const dynamo = getDocumentClient ? getDocumentClient() : dynamoClient;
    const startedAt = Date.now();
    console.info("Visit recording started", { path });
    await dynamo.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: { visitId: id(), ip, userAgent, path, timestamp: now() },
    }));
    console.info("Visit recording completed", { elapsedMs: Date.now() - startedAt });
    return response(event, 201, { ok: true });
  } catch (error) {
    console.error("Visit recording failed", {
      name: error?.name || "UnknownError",
      message: error?.message || "unknown error",
      httpStatusCode: error?.$metadata?.httpStatusCode,
      requestId: error?.$metadata?.requestId,
    });
    return response(event, 500, { code: "INTERNAL_ERROR", message: "Unable to record visit" });
  }
};

export const handler = createHandler();
