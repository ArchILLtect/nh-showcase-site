import AWS from "aws-sdk";
import crypto from "crypto";

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const ses = new AWS.SES();
const USERS_TABLE_NAME = process.env.USERS_TABLE_NAME || "Users";
const EMAIL_VERIFICATION_TOKENS_TABLE_NAME =
  process.env.EMAIL_VERIFICATION_TOKENS_TABLE_NAME || "EmailVerificationTokens";
const EMAIL_VERIFY_TOKEN_TTL_MINUTES = Number(process.env.EMAIL_VERIFY_TOKEN_TTL_MINUTES || "30");
const EMAIL_VERIFY_TOKEN_HASH_PEPPER = process.env.EMAIL_VERIFY_TOKEN_HASH_PEPPER || "";
const EMAIL_VERIFY_URL_BASE = process.env.EMAIL_VERIFY_URL_BASE || "";
const EMAIL_VERIFICATION_FROM_EMAIL = process.env.EMAIL_VERIFICATION_FROM_EMAIL || "";
const EMAIL_VERIFICATION_REPLY_TO = process.env.EMAIL_VERIFICATION_REPLY_TO || "";
const EMAIL_VERIFY_RATE_LIMITS_TABLE_NAME = process.env.EMAIL_VERIFY_RATE_LIMITS_TABLE_NAME || "";
const RESEND_PER_IP_MAX_ATTEMPTS = Number(process.env.RESEND_PER_IP_MAX_ATTEMPTS || "5");
const RESEND_PER_IP_WINDOW_SECONDS = Number(process.env.RESEND_PER_IP_WINDOW_SECONDS || "900");
const RESEND_PER_ACCOUNT_MAX_ATTEMPTS = Number(process.env.RESEND_PER_ACCOUNT_MAX_ATTEMPTS || "3");
const RESEND_PER_ACCOUNT_WINDOW_SECONDS = Number(process.env.RESEND_PER_ACCOUNT_WINDOW_SECONDS || "3600");
const RESEND_ACCOUNT_COOLDOWN_SECONDS = Number(process.env.RESEND_ACCOUNT_COOLDOWN_SECONDS || "60");
const GENERIC_MESSAGE = "If account details are valid, verification instructions were sent.";

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

const genericResponse = () =>
  jsonResponse(200, {
    message: GENERIC_MESSAGE,
  });

const safeNumber = (value, fallback) =>
  Number.isFinite(Number(value)) ? Number(value) : fallback;

const hashForLog = (value) =>
  crypto.createHash("sha256").update(String(value || "")).digest("hex").slice(0, 12);

const extractIpAddress = (event) => {
  const forwardedFor = event?.headers?.["x-forwarded-for"] || event?.headers?.["X-Forwarded-For"];
  if (typeof forwardedFor === "string" && forwardedFor.length > 0) {
    return forwardedFor.split(",")[0].trim();
  }

  return event?.requestContext?.http?.sourceIp || "unknown";
};

const checkAndRecordRateLimit = async ({ key, windowSeconds, maxAttempts, cooldownSeconds = 0 }) => {
  if (!EMAIL_VERIFY_RATE_LIMITS_TABLE_NAME || !key) {
    return { allowed: true };
  }

  const normalizedWindowSeconds = safeNumber(windowSeconds, 900);
  const normalizedMaxAttempts = safeNumber(maxAttempts, 5);
  const normalizedCooldownSeconds = safeNumber(cooldownSeconds, 0);
  const now = Math.floor(Date.now() / 1000);

  try {
    const currentRecord = await dynamoDB
      .get({
        TableName: EMAIL_VERIFY_RATE_LIMITS_TABLE_NAME,
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
        TableName: EMAIL_VERIFY_RATE_LIMITS_TABLE_NAME,
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
    console.error("Resend verification rate-limit check failed (fail-open):", error);
    return { allowed: true };
  }
};

const buildVerifyUrl = (verifyToken) => {
  if (!EMAIL_VERIFY_URL_BASE) {
    return "";
  }

  const separator = EMAIL_VERIFY_URL_BASE.includes("?") ? "&" : "?";
  return `${EMAIL_VERIFY_URL_BASE}${separator}token=${encodeURIComponent(verifyToken)}`;
};

const sendVerificationEmail = async ({ toEmail, username, verifyToken, expiresMinutes }) => {
  if (!EMAIL_VERIFICATION_FROM_EMAIL || !EMAIL_VERIFY_URL_BASE) {
    console.warn(
      "Verification email send skipped: missing EMAIL_VERIFICATION_FROM_EMAIL or EMAIL_VERIFY_URL_BASE",
    );
    return;
  }

  const verifyUrl = buildVerifyUrl(verifyToken);
  const params = {
    Source: EMAIL_VERIFICATION_FROM_EMAIL,
    Destination: {
      ToAddresses: [toEmail],
    },
    Message: {
      Subject: {
        Data: "Verify your email",
        Charset: "UTF-8",
      },
      Body: {
        Text: {
          Data: `Hi ${username},\n\nPlease verify your email using the link below:\n${verifyUrl}\n\nThis link expires in ${expiresMinutes} minutes. If you did not create this account, you can ignore this email.`,
          Charset: "UTF-8",
        },
        Html: {
          Data: `<p>Hi ${username},</p><p>Please verify your email using the link below:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p><p>This link expires in ${expiresMinutes} minutes. If you did not create this account, you can ignore this email.</p>`,
          Charset: "UTF-8",
        },
      },
    },
  };

  if (EMAIL_VERIFICATION_REPLY_TO) {
    params.ReplyToAddresses = [EMAIL_VERIFICATION_REPLY_TO];
  }

  await ses.sendEmail(params).promise();
};

const hashTokenSecret = (tokenSecret) =>
  crypto
    .createHash("sha256")
    .update(`${tokenSecret}${EMAIL_VERIFY_TOKEN_HASH_PEPPER}`)
    .digest("hex");

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
  const requestId = event?.requestContext?.requestId || "unknown";

  if (!username || !email) {
    return genericResponse();
  }

  const perIpResult = await checkAndRecordRateLimit({
    key: `verify_resend:ip:${requestIp}`,
    windowSeconds: RESEND_PER_IP_WINDOW_SECONDS,
    maxAttempts: RESEND_PER_IP_MAX_ATTEMPTS,
  });
  if (!perIpResult.allowed) {
    console.info(
      JSON.stringify({
        event: "EMAIL_VERIFICATION_RESEND_RATE_LIMITED",
        scope: "ip",
        reason: perIpResult.reason || "unknown",
        requestId,
        ipHash: hashForLog(requestIp),
      }),
    );
    return genericResponse();
  }

  const normalizedAccountKey = `verify_resend:account:${username.toLowerCase()}#${email}`;
  const perAccountResult = await checkAndRecordRateLimit({
    key: normalizedAccountKey,
    windowSeconds: RESEND_PER_ACCOUNT_WINDOW_SECONDS,
    maxAttempts: RESEND_PER_ACCOUNT_MAX_ATTEMPTS,
    cooldownSeconds: RESEND_ACCOUNT_COOLDOWN_SECONDS,
  });
  if (!perAccountResult.allowed) {
    console.info(
      JSON.stringify({
        event: "EMAIL_VERIFICATION_RESEND_RATE_LIMITED",
        scope: "account",
        reason: perAccountResult.reason || "unknown",
        requestId,
        accountHash: hashForLog(normalizedAccountKey),
      }),
    );
    return genericResponse();
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

    if (!user || storedEmail !== email || user.emailVerified === true) {
      return genericResponse();
    }

    const tokenSecret = crypto.randomBytes(32).toString("base64url");
    const tokenId = crypto.randomUUID();
    const tokenHash = hashTokenSecret(tokenSecret);
    const verifyToken = `${tokenId}.${tokenSecret}`;
    const createdAt = new Date();
    const expiresAt = Math.floor(createdAt.getTime() / 1000) + EMAIL_VERIFY_TOKEN_TTL_MINUTES * 60;

    await dynamoDB
      .put({
        TableName: EMAIL_VERIFICATION_TOKENS_TABLE_NAME,
        Item: {
          tokenId,
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

    await sendVerificationEmail({
      toEmail: email,
      username,
      verifyToken,
      expiresMinutes: EMAIL_VERIFY_TOKEN_TTL_MINUTES,
    });

    console.info(
      JSON.stringify({
        event: "EMAIL_VERIFICATION_RESENT",
        requestId,
        accountHash: hashForLog(normalizedAccountKey),
      }),
    );

    return genericResponse();
  } catch (error) {
    console.error("Resend verification error:", error);
    return jsonResponse(500, {
      code: "INTERNAL_ERROR",
      message: "Error resending verification",
    });
  }
};
