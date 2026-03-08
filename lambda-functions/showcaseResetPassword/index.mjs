import AWS from "aws-sdk";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const ses = new AWS.SES();
const USERS_TABLE_NAME = process.env.USERS_TABLE_NAME || "Users";
const RESET_TOKENS_TABLE_NAME = process.env.RESET_TOKENS_TABLE_NAME || "PasswordResetTokens";
const RESET_RATE_LIMITS_TABLE_NAME = process.env.RESET_RATE_LIMITS_TABLE_NAME || "";
const TOKEN_HASH_PEPPER = process.env.TOKEN_HASH_PEPPER || "";
const MIN_PASSWORD_LENGTH = 8;
const RESET_PER_IP_MAX_ATTEMPTS = Number(process.env.RESET_PER_IP_MAX_ATTEMPTS || "10");
const RESET_PER_IP_WINDOW_SECONDS = Number(process.env.RESET_PER_IP_WINDOW_SECONDS || "900");
const PASSWORD_RESET_FROM_EMAIL = process.env.PASSWORD_RESET_FROM_EMAIL || "";
const PASSWORD_RESET_REPLY_TO = process.env.PASSWORD_RESET_REPLY_TO || "";
const PASSWORD_CHANGE_SUPPORT_EMAIL = process.env.PASSWORD_CHANGE_SUPPORT_EMAIL || "";

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

const parseCompositeResetToken = (token) => {
  const tokenParts = token.split(".");
  if (tokenParts.length !== 2) {
    return null;
  }

  const tokenId = tokenParts[0]?.trim();
  const tokenSecret = tokenParts[1]?.trim();

  if (!tokenId || !tokenSecret) {
    return null;
  }

  return { tokenId, tokenSecret };
};

const validatePasswordPolicy = (newPassword) => {
  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    return `password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }

  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);

  if (!hasUpper || !hasLower || !hasNumber) {
    return "password must include uppercase, lowercase, and a number";
  }

  return null;
};

const invalidResetTokenResponse = () =>
  jsonResponse(400, {
    code: "INVALID_OR_EXPIRED_TOKEN",
    message: "Reset token is invalid or expired",
  });

const rateLimitedResetResponse = () =>
  jsonResponse(429, {
    code: "RATE_LIMITED",
    message: "Too many reset attempts. Please try again later.",
  });

const safeNumber = (value, fallback) =>
  Number.isFinite(Number(value)) ? Number(value) : fallback;

const checkAndRecordRateLimit = async ({ key, windowSeconds, maxAttempts }) => {
  if (!RESET_RATE_LIMITS_TABLE_NAME || !key) {
    return { allowed: true };
  }

  const normalizedWindowSeconds = safeNumber(windowSeconds, 900);
  const normalizedMaxAttempts = safeNumber(maxAttempts, 10);
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
    const withinWindow = previousWindowStart > 0 && now - previousWindowStart < normalizedWindowSeconds;

    if (withinWindow && previousCount >= normalizedMaxAttempts) {
      return { allowed: false };
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
    console.error("Reset password rate-limit check failed (fail-open):", error);
    return { allowed: true };
  }
};

const sendPasswordChangedConfirmationEmail = async ({ toEmail, username, changedAtIso }) => {
  if (!toEmail || !PASSWORD_RESET_FROM_EMAIL) {
    console.warn(
      "Password-changed email send skipped: missing recipient email or PASSWORD_RESET_FROM_EMAIL",
    );
    return;
  }

  const supportLine = PASSWORD_CHANGE_SUPPORT_EMAIL
    ? `If you did not make this change, contact support immediately at ${PASSWORD_CHANGE_SUPPORT_EMAIL}.`
    : "If you did not make this change, contact support immediately.";

  const params = {
    Source: PASSWORD_RESET_FROM_EMAIL,
    Destination: {
      ToAddresses: [toEmail],
    },
    Message: {
      Subject: {
        Data: "Your password was changed",
        Charset: "UTF-8",
      },
      Body: {
        Text: {
          Data: `Hi ${username},\n\nYour account password was changed on ${changedAtIso}.\n\n${supportLine}\n\nIf this was you, no further action is needed.`,
          Charset: "UTF-8",
        },
        Html: {
          Data: `<p>Hi ${username},</p><p>Your account password was changed on ${changedAtIso}.</p><p>${supportLine}</p><p>If this was you, no further action is needed.</p>`,
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

  const token = typeof parsedBody.token === "string" ? parsedBody.token.trim() : "";
  const newPassword = typeof parsedBody.newPassword === "string" ? parsedBody.newPassword : "";
  const confirmPassword = typeof parsedBody.confirmPassword === "string" ? parsedBody.confirmPassword : "";
  const requestIp = extractIpAddress(event);

  const perIpResult = await checkAndRecordRateLimit({
    key: `reset:ip:${requestIp}`,
    windowSeconds: RESET_PER_IP_WINDOW_SECONDS,
    maxAttempts: RESET_PER_IP_MAX_ATTEMPTS,
  });
  if (!perIpResult.allowed) {
    return rateLimitedResetResponse();
  }

  if (!token || !newPassword || !confirmPassword) {
    return jsonResponse(400, {
      code: "VALIDATION_ERROR",
      message: "token, newPassword, and confirmPassword are required",
    });
  }

  if (newPassword !== confirmPassword) {
    return jsonResponse(400, {
      code: "VALIDATION_ERROR",
      message: "newPassword and confirmPassword must match",
    });
  }

  const passwordPolicyError = validatePasswordPolicy(newPassword);
  if (passwordPolicyError) {
    return jsonResponse(400, {
      code: "VALIDATION_ERROR",
      message: passwordPolicyError,
    });
  }

  const tokenParts = parseCompositeResetToken(token);
  if (!tokenParts) {
    return invalidResetTokenResponse();
  }

  const { tokenId, tokenSecret } = tokenParts;
  const tokenHash = hashResetTokenSecret(tokenSecret);
  const nowEpochSeconds = Math.floor(Date.now() / 1000);

  try {
    const tokenRecordResult = await dynamoDB
      .get({
        TableName: RESET_TOKENS_TABLE_NAME,
        Key: { tokenId },
      })
      .promise();

    const tokenRecord = tokenRecordResult?.Item;
    if (!tokenRecord) {
      return invalidResetTokenResponse();
    }

    const username =
      typeof tokenRecord.username === "string"
        ? tokenRecord.username
        : typeof tokenRecord.userId === "string"
          ? tokenRecord.userId
          : "";

    if (!username) {
      return invalidResetTokenResponse();
    }

    const tokenIsExpired =
      typeof tokenRecord.expiresAt !== "number" || tokenRecord.expiresAt <= nowEpochSeconds;
    const tokenIsActive = tokenRecord.status === "active";
    const tokenMatches = tokenRecord.tokenHash === tokenHash;

    if (!tokenIsActive || tokenIsExpired || !tokenMatches) {
      return invalidResetTokenResponse();
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const nowIso = new Date().toISOString();

    await dynamoDB
      .transactWrite({
        TransactItems: [
          {
            Update: {
              TableName: RESET_TOKENS_TABLE_NAME,
              Key: { tokenId },
              UpdateExpression:
                "SET #status = :used, usedAt = :usedAt, consumedIp = :consumedIp, consumedUserAgent = :consumedUserAgent",
              ConditionExpression: "#status = :active AND tokenHash = :tokenHash AND expiresAt > :nowEpochSeconds",
              ExpressionAttributeNames: {
                "#status": "status",
              },
              ExpressionAttributeValues: {
                ":used": "used",
                ":usedAt": nowIso,
                ":consumedIp": requestIp,
                ":consumedUserAgent":
                  event?.headers?.["user-agent"] || event?.headers?.["User-Agent"] || "unknown",
                ":active": "active",
                ":tokenHash": tokenHash,
                ":nowEpochSeconds": nowEpochSeconds,
              },
            },
          },
          {
            Update: {
              TableName: USERS_TABLE_NAME,
              Key: { username },
              UpdateExpression:
                "SET #password = :password, passwordChangedAt = :passwordChangedAt, updatedAt = :updatedAt, tokenVersion = if_not_exists(tokenVersion, :zero) + :inc",
              ConditionExpression: "attribute_exists(username)",
              ExpressionAttributeNames: {
                "#password": "password",
              },
              ExpressionAttributeValues: {
                ":password": hashedPassword,
                ":passwordChangedAt": nowIso,
                ":updatedAt": nowIso,
                ":zero": 0,
                ":inc": 1,
              },
            },
          },
        ],
      })
      .promise();

    const recipientEmail =
      typeof tokenRecord.emailNormalized === "string" ? tokenRecord.emailNormalized : "";

    try {
      await sendPasswordChangedConfirmationEmail({
        toEmail: recipientEmail,
        username,
        changedAtIso: nowIso,
      });
    } catch (emailError) {
      console.error("Password-changed confirmation email error:", emailError);
    }

    return jsonResponse(200, {
      message: "Password reset successful",
    });
  } catch (error) {
    if (error?.code === "TransactionCanceledException" || error?.code === "ConditionalCheckFailedException") {
      return invalidResetTokenResponse();
    }

    console.error("Reset password error:", error);
    return jsonResponse(500, {
      code: "INTERNAL_ERROR",
      message: "Error resetting password",
    });
  }
};
