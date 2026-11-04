import AWS from "aws-sdk";
import jwt from "jsonwebtoken";

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const USERS_TABLE_NAME = process.env.USERS_TABLE_NAME || "Users";
const JWT_SECRET = process.env.JWT_SECRET || "";

const ALLOWED_CORS_ORIGINS = new Set([
  "https://nickhanson.me",
  "https://www.nickhanson.me",
]);
const NETLIFY_DEPLOY_PREVIEW_ORIGIN =
  /^https:\/\/deploy-preview-\d+--resonant-ganache-9efedd\.netlify\.app$/;

const getCorsHeaders = (event) => {
  const origin = event?.headers?.origin || event?.headers?.Origin || "";
  const isAllowedOrigin =
    !origin || ALLOWED_CORS_ORIGINS.has(origin) || NETLIFY_DEPLOY_PREVIEW_ORIGIN.test(origin);

  return {
    "Content-Type": "application/json",
    ...(isAllowedOrigin ? { "Access-Control-Allow-Origin": origin || "*" } : {}),
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    ...(origin ? { Vary: "Origin" } : {}),
  };
};

const createJsonResponse = (event, statusCode, payload) => ({
  statusCode,
  headers: getCorsHeaders(event),
  body: JSON.stringify(payload),
});

const getBearerToken = (authorizationHeader) => {
  if (typeof authorizationHeader !== "string") {
    return "";
  }

  const [scheme, token] = authorizationHeader.trim().split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return "";
  }

  return token;
};

export const handler = async (event) => {
  const jsonResponse = (statusCode, payload) => createJsonResponse(event, statusCode, payload);

  if (event?.requestContext?.http?.method === "OPTIONS") {
    return jsonResponse(200, { message: "OK" });
  }

  if (!JWT_SECRET) {
    console.error("Missing JWT_SECRET environment variable");
    return jsonResponse(500, {
      code: "INTERNAL_ERROR",
      message: "Session validation unavailable",
    });
  }

  const authorizationHeader =
    event?.headers?.authorization || event?.headers?.Authorization || "";
  const token = getBearerToken(authorizationHeader);

  if (!token) {
    return jsonResponse(401, {
      code: "UNAUTHORIZED",
      message: "Missing bearer token",
    });
  }

  let claims;
  try {
    claims = jwt.verify(token, JWT_SECRET);
  } catch {
    return jsonResponse(401, {
      code: "UNAUTHORIZED",
      message: "Invalid or expired token",
    });
  }

  const username = typeof claims?.sub === "string" ? claims.sub : "";
  if (!username) {
    return jsonResponse(401, {
      code: "UNAUTHORIZED",
      message: "Invalid token subject",
    });
  }

  try {
    const userResult = await dynamoDB
      .get({
        TableName: USERS_TABLE_NAME,
        Key: { username },
      })
      .promise();

    const user = userResult?.Item;
    if (!user) {
      return jsonResponse(401, {
        code: "UNAUTHORIZED",
        message: "Account not found",
      });
    }

    const currentTokenVersion = Number.isInteger(user.tokenVersion)
      ? user.tokenVersion
      : 0;
    const claimTokenVersion = Number.isInteger(claims.tokenVersion)
      ? claims.tokenVersion
      : 0;

    if (claimTokenVersion !== currentTokenVersion) {
      return jsonResponse(401, {
        code: "SESSION_STALE",
        message: "Session is no longer valid",
      });
    }

    return jsonResponse(200, {
      valid: true,
      user: {
        username,
        role: typeof user.role === "string" ? user.role : "user",
        tokenVersion: currentTokenVersion,
        emailVerified:
          typeof user.emailVerified === "boolean" ? user.emailVerified : true,
        passwordChangedAt: user.passwordChangedAt || null,
      },
    });
  } catch (error) {
    console.error("Session validation error:", error);
    return jsonResponse(500, {
      code: "INTERNAL_ERROR",
      message: "Session validation failed",
    });
  }
};
