import AWS from "aws-sdk";
import jwt from "jsonwebtoken";

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const USERS_TABLE_NAME = process.env.USERS_TABLE_NAME || "Users";
const JWT_SECRET = process.env.JWT_SECRET || "";

const jsonResponse = (statusCode, payload) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  },
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
