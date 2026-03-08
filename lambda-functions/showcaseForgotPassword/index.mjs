import AWS from "aws-sdk";
import crypto from "crypto";

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const ses = new AWS.SES();
const USERS_TABLE_NAME = process.env.USERS_TABLE_NAME || "Users";
const RESET_TOKENS_TABLE_NAME = process.env.RESET_TOKENS_TABLE_NAME || "PasswordResetTokens";
const RESET_TOKEN_TTL_MINUTES = Number(process.env.RESET_TOKEN_TTL_MINUTES || "15");
const TOKEN_HASH_PEPPER = process.env.TOKEN_HASH_PEPPER || "";
const RETURN_RESET_TOKEN_FOR_TESTING = process.env.RETURN_RESET_TOKEN_FOR_TESTING === "true";
const GENERIC_FORGOT_PASSWORD_MESSAGE = "If account details are valid, password reset instructions were sent.";
const PASSWORD_RESET_FROM_EMAIL = process.env.PASSWORD_RESET_FROM_EMAIL || "";
const PASSWORD_RESET_REPLY_TO = process.env.PASSWORD_RESET_REPLY_TO || "";
const RESET_URL_BASE = process.env.RESET_URL_BASE || "";

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

const extractIpAddress = (event) => {
  const forwardedFor = event?.headers?.["x-forwarded-for"] || event?.headers?.["X-Forwarded-For"];
  if (typeof forwardedFor === "string" && forwardedFor.length > 0) {
    return forwardedFor.split(",")[0].trim();
  }

  return event?.requestContext?.http?.sourceIp || "unknown";
};

const hashResetTokenSecret = (tokenSecret) =>
  crypto.createHash("sha256").update(`${tokenSecret}${TOKEN_HASH_PEPPER}`).digest("hex");

const genericForgotPasswordResponse = () =>
  jsonResponse(200, {
    message: GENERIC_FORGOT_PASSWORD_MESSAGE,
  });

const buildResetUrl = (resetToken) => {
  if (!RESET_URL_BASE) {
    return "";
  }

  const separator = RESET_URL_BASE.includes("?") ? "&" : "?";
  return `${RESET_URL_BASE}${separator}token=${encodeURIComponent(resetToken)}`;
};

const sendPasswordResetEmail = async ({ toEmail, username, resetToken, expiresMinutes }) => {
  if (!PASSWORD_RESET_FROM_EMAIL || !RESET_URL_BASE) {
    console.warn(
      "Forgot password email send skipped: missing PASSWORD_RESET_FROM_EMAIL or RESET_URL_BASE",
    );
    return;
  }

  const resetUrl = buildResetUrl(resetToken);
  const params = {
    Source: PASSWORD_RESET_FROM_EMAIL,
    Destination: {
      ToAddresses: [toEmail],
    },
    Message: {
      Subject: {
        Data: "Password reset request",
        Charset: "UTF-8",
      },
      Body: {
        Text: {
          Data: `Hi ${username},\n\nWe received a request to reset your password. Use the link below to set a new password:\n${resetUrl}\n\nThis link expires in ${expiresMinutes} minutes. If you did not request this, you can ignore this email.`,
          Charset: "UTF-8",
        },
        Html: {
          Data: `<p>Hi ${username},</p><p>We received a request to reset your password. Use the link below to set a new password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>This link expires in ${expiresMinutes} minutes. If you did not request this, you can ignore this email.</p>`,
          Charset: "UTF-8",
        },
      },
    },
  };

  if (PASSWORD_RESET_REPLY_TO) {
    params.ReplyToAddresses = [PASSWORD_RESET_REPLY_TO];
  }

  await ses.sendEmail(params).promise();
};

export const handler = async (event) => {
  if (event?.requestContext?.http?.method === "OPTIONS") {
    return jsonResponse(200, { message: "OK" });
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
  const email = typeof parsedBody.email === "string" ? parsedBody.email.trim().toLowerCase() : "";

  if (!username || !email) {
    return genericForgotPasswordResponse();
  }

  try {
    const userLookup = await dynamoDB
      .get({
        TableName: USERS_TABLE_NAME,
        Key: { username },
      })
      .promise();

    const user = userLookup?.Item;
    const storedEmail = typeof user?.email === "string" ? user.email.trim().toLowerCase() : "";

    if (!user || storedEmail !== email) {
      return genericForgotPasswordResponse();
    }

    const tokenSecret = crypto.randomBytes(32).toString("base64url");
    const tokenId = crypto.randomUUID();
    const tokenHash = hashResetTokenSecret(tokenSecret);
    const resetToken = `${tokenId}.${tokenSecret}`;
    const createdAt = new Date();
    const expiresAt = Math.floor(createdAt.getTime() / 1000) + RESET_TOKEN_TTL_MINUTES * 60;

    await dynamoDB
      .put({
        TableName: RESET_TOKENS_TABLE_NAME,
        Item: {
          tokenId,
          userId: username,
          username,
          emailNormalized: email,
          tokenHash,
          status: "active",
          createdAt: createdAt.toISOString(),
          expiresAt,
          requestIp: extractIpAddress(event),
          requestUserAgent: event?.headers?.["user-agent"] || event?.headers?.["User-Agent"] || "unknown",
        },
        ConditionExpression: "attribute_not_exists(tokenId)",
      })
      .promise();

    await sendPasswordResetEmail({
      toEmail: email,
      username,
      resetToken,
      expiresMinutes: RESET_TOKEN_TTL_MINUTES,
    });

    if (RETURN_RESET_TOKEN_FOR_TESTING) {
      return jsonResponse(200, {
        message: GENERIC_FORGOT_PASSWORD_MESSAGE,
        token: resetToken,
        tokenId,
      });
    }

    return genericForgotPasswordResponse();
  } catch (error) {
    console.error("Forgot password error:", error);
    return jsonResponse(500, {
      code: "INTERNAL_ERROR",
      message: "Error processing forgot password request",
    });
  }
};
