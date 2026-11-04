import AWS from "aws-sdk";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.USERS_TABLE_NAME || "Users";
const JWT_SECRET = process.env.JWT_SECRET || "";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

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

export const handler = async (event) => {
  const jsonResponse = (statusCode, payload) => createJsonResponse(event, statusCode, payload);

  if (event?.requestContext?.http?.method === "OPTIONS") {
    return jsonResponse(200, { message: "OK" });
  }

  if (!JWT_SECRET) {
    console.error("Missing JWT_SECRET environment variable");
    return jsonResponse(500, {
      code: "INTERNAL_ERROR",
      message: "Error logging in",
    });
  }

  let parsedBody;
  try {
    parsedBody = JSON.parse(event?.body || "{}");
  } catch {
    return jsonResponse(400, {
      code: "VALIDATION_ERROR",
      message: "Invalid JSON request body",
    });
  }

  const username = typeof parsedBody.username === "string" ? parsedBody.username.trim() : "";
  const password = typeof parsedBody.password === "string" ? parsedBody.password : "";

  if (!username || !password) {
    return jsonResponse(400, {
      code: "VALIDATION_ERROR",
      message: "username and password are required",
    });
  }

  try {
    const result = await dynamoDB
      .get({
        TableName: TABLE_NAME,
        Key: { username },
      })
      .promise();

    const user = result?.Item;
    if (!user) {
      return jsonResponse(401, {
        code: "INVALID_CREDENTIALS",
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password || "");
    if (!isMatch) {
      return jsonResponse(401, {
        code: "INVALID_CREDENTIALS",
        message: "Invalid credentials",
      });
    }

    const tokenVersion = Number.isInteger(user.tokenVersion) ? user.tokenVersion : 0;
    const role = typeof user.role === "string" ? user.role : "user";
    const emailVerified =
      typeof user.emailVerified === "boolean" ? user.emailVerified : true;

    const token = jwt.sign(
      {
        sub: username,
        username,
        role,
        tokenVersion,
        emailVerified,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    return jsonResponse(200, {
      token,
      user: {
        username,
        role,
        email: user.email || "",
        knownIps: Array.isArray(user.knownIps) ? user.knownIps : [],
        tokenVersion,
        emailVerified,
        passwordChangedAt: user.passwordChangedAt || null,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return jsonResponse(500, {
      code: "INTERNAL_ERROR",
      message: "Error logging in",
    });
  }
};
