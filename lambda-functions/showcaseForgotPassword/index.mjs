import AWS from "aws-sdk";
import crypto from "crypto";

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const ses = new AWS.SES();
const USERS_TABLE_NAME = process.env.USERS_TABLE_NAME || "Users";
const RESET_TOKENS_TABLE_NAME = process.env.RESET_TOKENS_TABLE_NAME || "PasswordResetTokens";
const RESET_RATE_LIMITS_TABLE_NAME = process.env.RESET_RATE_LIMITS_TABLE_NAME || "";
const RESET_TOKEN_TTL_MINUTES = Number(process.env.RESET_TOKEN_TTL_MINUTES || "15");
const TOKEN_HASH_PEPPER = process.env.TOKEN_HASH_PEPPER || "";
const RETURN_RESET_TOKEN_FOR_TESTING = process.env.RETURN_RESET_TOKEN_FOR_TESTING === "true";
const FORGOT_PER_IP_MAX_ATTEMPTS = Number(process.env.FORGOT_PER_IP_MAX_ATTEMPTS || "5");
const FORGOT_PER_IP_WINDOW_SECONDS = Number(process.env.FORGOT_PER_IP_WINDOW_SECONDS || "900");
const FORGOT_PER_ACCOUNT_MAX_ATTEMPTS = Number(process.env.FORGOT_PER_ACCOUNT_MAX_ATTEMPTS || "3");
const FORGOT_PER_ACCOUNT_WINDOW_SECONDS = Number(process.env.FORGOT_PER_ACCOUNT_WINDOW_SECONDS || "3600");
const FORGOT_ACCOUNT_COOLDOWN_SECONDS = Number(process.env.FORGOT_ACCOUNT_COOLDOWN_SECONDS || "60");
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

const safeNumber = (value, fallback) =>
  Number.isFinite(Number(value)) ? Number(value) : fallback;

const checkAndRecordRateLimit = async ({ key, windowSeconds, maxAttempts, cooldownSeconds = 0 }) => {
  if (!RESET_RATE_LIMITS_TABLE_NAME || !key) {
    return { allowed: true };
  }

  const normalizedWindowSeconds = safeNumber(windowSeconds, 900);
  const normalizedMaxAttempts = safeNumber(maxAttempts, 5);
  const normalizedCooldownSeconds = safeNumber(cooldownSeconds, 0);
  const now = Math.floor(Date.now() / 1000);

  try {
    const currentRecord = await dynamoDB
      .get({
        TableName: RESET_RATE_LIMITS_TABLE_NAME,
        Key: { key },
      })
      .promise();

    const item = currentRecord?.Item || null;
    const previousCount = typeof item?.count === "number" ? item.count : 0;
    const previousWindowStart = typeof item?.windowStart === "number" ? item.windowStart : 0;
    const previousLastAttemptAt = typeof item?.lastAttemptAt === "number" ? item.lastAttemptAt : 0;
    const withinWindow = previousWindowStart > 0 && now - previousWindowStart < normalizedWindowSeconds;

    if (
      normalizedCooldownSeconds > 0 &&
      previousLastAttemptAt > 0 &&
      now - previousLastAttemptAt < normalizedCooldownSeconds
    ) {
      return { allowed: false, reason: "cooldown" };
    }

    if (withinWindow && previousCount >= normalizedMaxAttempts) {
      return { allowed: false, reason: "rate_limit" };
    }

    const nextWindowStart = withinWindow ? previousWindowStart : now;
    const nextCount = withinWindow ? previousCount + 1 : 1;
    const expiresAt = nextWindowStart + normalizedWindowSeconds + 300;

    await dynamoDB
      .put({
        TableName: RESET_RATE_LIMITS_TABLE_NAME,
        Item: {
          key,
          count: nextCount,
          windowStart: nextWindowStart,
          lastAttemptAt: now,
          expiresAt,
          updatedAt: new Date(now * 1000).toISOString(),
        },
      })
      .promise();

    return { allowed: true };
  } catch (error) {
    console.error("Forgot password rate-limit check failed (fail-open):", error);
    return { allowed: true };
  }
};

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
  const requestIp = extractIpAddress(event);

  if (!username || !email) {
    return genericForgotPasswordResponse();
  }

  const perIpResult = await checkAndRecordRateLimit({
    key: `forgot:ip:${requestIp}`,
    windowSeconds: FORGOT_PER_IP_WINDOW_SECONDS,
    maxAttempts: FORGOT_PER_IP_MAX_ATTEMPTS,
  });
  if (!perIpResult.allowed) {
    return genericForgotPasswordResponse();
  }

  const normalizedAccountKey = `forgot:account:${username.toLowerCase()}#${email}`;
  const perAccountResult = await checkAndRecordRateLimit({
    key: normalizedAccountKey,
    windowSeconds: FORGOT_PER_ACCOUNT_WINDOW_SECONDS,
    maxAttempts: FORGOT_PER_ACCOUNT_MAX_ATTEMPTS,
    cooldownSeconds: FORGOT_ACCOUNT_COOLDOWN_SECONDS,
  });
  if (!perAccountResult.allowed) {
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
          requestIp,
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
