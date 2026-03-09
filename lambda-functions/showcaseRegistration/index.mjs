import AWS from "aws-sdk";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const ses = new AWS.SES();
const TABLE_NAME = process.env.USERS_TABLE_NAME || "Users";
const EMAIL_VERIFICATION_TOKENS_TABLE_NAME =
  process.env.EMAIL_VERIFICATION_TOKENS_TABLE_NAME || "EmailVerificationTokens";
const EMAIL_VERIFY_RATE_LIMITS_TABLE_NAME = process.env.EMAIL_VERIFY_RATE_LIMITS_TABLE_NAME || "";
const EMAIL_VERIFY_TOKEN_TTL_MINUTES = Number(process.env.EMAIL_VERIFY_TOKEN_TTL_MINUTES || "30");
const EMAIL_VERIFY_TOKEN_HASH_PEPPER = process.env.EMAIL_VERIFY_TOKEN_HASH_PEPPER || "";
const EMAIL_VERIFY_URL_BASE = process.env.EMAIL_VERIFY_URL_BASE || "";
const EMAIL_VERIFICATION_FROM_EMAIL = process.env.EMAIL_VERIFICATION_FROM_EMAIL || "";
const EMAIL_VERIFICATION_REPLY_TO = process.env.EMAIL_VERIFICATION_REPLY_TO || "";
const REGISTER_PER_IP_MAX_ATTEMPTS = Number(process.env.REGISTER_PER_IP_MAX_ATTEMPTS || "10");
const REGISTER_PER_IP_WINDOW_SECONDS = Number(process.env.REGISTER_PER_IP_WINDOW_SECONDS || "900");
const REGISTER_PER_EMAIL_MAX_ATTEMPTS = Number(process.env.REGISTER_PER_EMAIL_MAX_ATTEMPTS || "5");
const REGISTER_PER_EMAIL_WINDOW_SECONDS = Number(process.env.REGISTER_PER_EMAIL_WINDOW_SECONDS || "3600");
const REGISTER_EMAIL_COOLDOWN_SECONDS = Number(process.env.REGISTER_EMAIL_COOLDOWN_SECONDS || "60");
const USERNAME_REGEX = /^[A-Za-z0-9_-]{3,32}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
const ENABLE_INTERNAL_ERROR_TEST = process.env.ENABLE_INTERNAL_ERROR_TEST === "true";

const jsonResponse = (statusCode, payload) => ({
  statusCode,
  body: JSON.stringify(payload),
});

const validatePayload = ({ username, email, password }) => {
  if (!username || !email || !password) {
    return "username, email, and password are required";
  }

  if (!USERNAME_REGEX.test(username)) {
    return "username must be 3-32 chars and only include letters, numbers, underscores, or dashes";
  }

  if (!EMAIL_REGEX.test(email)) {
    return "email format is invalid";
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return `password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);

  if (!hasUpper || !hasLower || !hasNumber) {
    return "password must include uppercase, lowercase, and a number";
  }

  return null;
};

const extractIpAddress = (event) => {
  const forwardedFor = event?.headers?.["x-forwarded-for"] || event?.headers?.["X-Forwarded-For"];
  if (typeof forwardedFor === "string" && forwardedFor.length > 0) {
    return forwardedFor.split(",")[0].trim();
  }

  return event?.requestContext?.http?.sourceIp || "unknown";
};

const hashForLog = (value) =>
  crypto.createHash("sha256").update(String(value || "")).digest("hex").slice(0, 12);

const safeNumber = (value, fallback) =>
  Number.isFinite(Number(value)) ? Number(value) : fallback;

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
    console.error("Registration rate-limit check failed (fail-open):", error);
    return { allowed: true };
  }
};

const hashTokenSecret = (tokenSecret) =>
  crypto
    .createHash("sha256")
    .update(`${tokenSecret}${EMAIL_VERIFY_TOKEN_HASH_PEPPER}`)
    .digest("hex");

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
      "Registration verification email skipped: missing EMAIL_VERIFICATION_FROM_EMAIL or EMAIL_VERIFY_URL_BASE",
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

export const handler = async (event) => {
  let parsedBody;

  try {
    parsedBody = JSON.parse(event.body || "{}");
  } catch (error) {
    return jsonResponse(400, {
      code: "VALIDATION_ERROR",
      message: "Invalid JSON request body",
    });
  }

  const username = typeof parsedBody.username === "string" ? parsedBody.username.trim() : "";
  const email = typeof parsedBody.email === "string" ? parsedBody.email.trim().toLowerCase() : "";
  const password = typeof parsedBody.password === "string" ? parsedBody.password : "";

  const validationError = validatePayload({ username, email, password });
  if (validationError) {
    return jsonResponse(400, {
      code: "VALIDATION_ERROR",
      message: validationError,
    });
  }

  const requestIp = extractIpAddress(event);
  const requestId = event?.requestContext?.requestId || "unknown";

  const perIpResult = await checkAndRecordRateLimit({
    key: `register:ip:${requestIp}`,
    windowSeconds: REGISTER_PER_IP_WINDOW_SECONDS,
    maxAttempts: REGISTER_PER_IP_MAX_ATTEMPTS,
  });
  if (!perIpResult.allowed) {
    console.info(
      JSON.stringify({
        event: "REGISTER_RATE_LIMITED",
        scope: "ip",
        reason: perIpResult.reason || "unknown",
        requestId,
        ipHash: hashForLog(requestIp),
      }),
    );
    return jsonResponse(429, {
      code: "RATE_LIMITED",
      message: "Too many registration attempts. Please try again shortly.",
    });
  }

  const normalizedEmailKey = `register:email:${email}`;
  const perEmailResult = await checkAndRecordRateLimit({
    key: normalizedEmailKey,
    windowSeconds: REGISTER_PER_EMAIL_WINDOW_SECONDS,
    maxAttempts: REGISTER_PER_EMAIL_MAX_ATTEMPTS,
    cooldownSeconds: REGISTER_EMAIL_COOLDOWN_SECONDS,
  });
  if (!perEmailResult.allowed) {
    console.info(
      JSON.stringify({
        event: "REGISTER_RATE_LIMITED",
        scope: "email",
        reason: perEmailResult.reason || "unknown",
        requestId,
        emailHash: hashForLog(normalizedEmailKey),
      }),
    );
    return jsonResponse(429, {
      code: "RATE_LIMITED",
      message: "Too many registration attempts. Please try again shortly.",
    });
  }

  let userCreated = false;

  try {
    if (ENABLE_INTERNAL_ERROR_TEST && parsedBody.__simulateInternalError === true) {
      throw new Error("Simulated internal error for testing");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const createdAt = new Date().toISOString();

    const putParams = {
      TableName: TABLE_NAME,
      Item: {
        username,
        password: hashedPassword,
        email,
        createdAt,
        updatedAt: createdAt,
        passwordChangedAt: createdAt,
        tokenVersion: 1,
        emailVerified: false,
        role: "user",
      },
      ConditionExpression: "attribute_not_exists(username)",
    };

    await dynamoDB.put(putParams).promise();
    userCreated = true;

    let verificationEmailSent = false;
    try {
      const tokenSecret = crypto.randomBytes(32).toString("base64url");
      const tokenId = crypto.randomUUID();
      const tokenHash = hashTokenSecret(tokenSecret);
      const verifyToken = `${tokenId}.${tokenSecret}`;
      const createdAtDate = new Date();
      const expiresAt = Math.floor(createdAtDate.getTime() / 1000) + EMAIL_VERIFY_TOKEN_TTL_MINUTES * 60;

      await dynamoDB
        .put({
          TableName: EMAIL_VERIFICATION_TOKENS_TABLE_NAME,
          Item: {
            tokenId,
            username,
            emailNormalized: email,
            tokenHash,
            status: "active",
            createdAt: createdAtDate.toISOString(),
            expiresAt,
            requestIp:
              event?.headers?.["x-forwarded-for"]?.split(",")?.[0]?.trim() ||
              event?.requestContext?.http?.sourceIp ||
              "unknown",
            requestUserAgent:
              event?.headers?.["user-agent"] || event?.headers?.["User-Agent"] || "unknown",
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

      verificationEmailSent = true;
    } catch (verificationError) {
      console.error("Post-registration verification setup failed:", verificationError);
    }

    return jsonResponse(201, {
      message: verificationEmailSent
        ? "User registered successfully. Please verify your email."
        : "User registered successfully. Verification email could not be sent right now.",
      verificationPending: true,
      verificationEmailSent,
    });
  } catch (error) {
    if (error?.code === "ConditionalCheckFailedException") {
      return jsonResponse(409, {
        code: "USERNAME_EXISTS",
        message: "Username already exists",
      });
    }

    if (userCreated) {
      console.error("Registration completed with post-create failure:", error);
      return jsonResponse(201, {
        message: "User registered successfully. Verification email could not be sent right now.",
        verificationPending: true,
        verificationEmailSent: false,
      });
    }

    console.error("Registration error:", error);
    return jsonResponse(500, {
      code: "INTERNAL_ERROR",
      message: "Error registering user",
    });
  }
};