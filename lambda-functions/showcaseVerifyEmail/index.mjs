import AWS from "aws-sdk";
import crypto from "crypto";

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const USERS_TABLE_NAME = process.env.USERS_TABLE_NAME || "Users";
const EMAIL_VERIFICATION_TOKENS_TABLE_NAME =
  process.env.EMAIL_VERIFICATION_TOKENS_TABLE_NAME || "EmailVerificationTokens";
const EMAIL_VERIFY_TOKEN_HASH_PEPPER = process.env.EMAIL_VERIFY_TOKEN_HASH_PEPPER || "";

const hashForLog = (value) =>
  crypto.createHash("sha256").update(String(value || "")).digest("hex").slice(0, 12);

const logEvent = (payload) => {
  console.info(JSON.stringify(payload));
};

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

const parseCompositeToken = (token) => {
  if (typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const tokenId = parts[0]?.trim();
  const tokenSecret = parts[1]?.trim();
  if (!tokenId || !tokenSecret) return null;

  return { tokenId, tokenSecret };
};

const hashTokenSecret = (tokenSecret) =>
  crypto
    .createHash("sha256")
    .update(`${tokenSecret}${EMAIL_VERIFY_TOKEN_HASH_PEPPER}`)
    .digest("hex");

const invalidTokenResponse = () =>
  jsonResponse(400, {
    code: "INVALID_OR_EXPIRED_VERIFICATION_TOKEN",
    message: "Verification token is invalid or expired",
  });

export const handler = async (event) => {
  if (event?.requestContext?.http?.method === "OPTIONS") {
    return jsonResponse(200, { message: "OK" });
  }

  const requestId = event?.requestContext?.requestId || "unknown";

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
  if (!token) {
    logEvent({
      event: "EMAIL_VERIFICATION_TOKEN_REJECTED",
      reason: "missing_token",
      requestId,
    });
    return jsonResponse(400, {
      code: "VALIDATION_ERROR",
      message: "token is required",
    });
  }

  const tokenParts = parseCompositeToken(token);
  if (!tokenParts) {
    logEvent({
      event: "EMAIL_VERIFICATION_TOKEN_REJECTED",
      reason: "invalid_format",
      requestId,
    });
    return invalidTokenResponse();
  }

  const { tokenId, tokenSecret } = tokenParts;
  const tokenHash = hashTokenSecret(tokenSecret);
  const nowEpochSeconds = Math.floor(Date.now() / 1000);
  const nowIso = new Date().toISOString();
  const requestIp =
    event?.headers?.["x-forwarded-for"]?.split(",")?.[0]?.trim() ||
    event?.requestContext?.http?.sourceIp ||
    "unknown";
  const requestUserAgent =
    event?.headers?.["user-agent"] || event?.headers?.["User-Agent"] || "unknown";

  try {
    const tokenRecordResult = await dynamoDB
      .get({
        TableName: EMAIL_VERIFICATION_TOKENS_TABLE_NAME,
        Key: { tokenId },
      })
      .promise();

    const tokenRecord = tokenRecordResult?.Item;
    if (!tokenRecord) {
      logEvent({
        event: "EMAIL_VERIFICATION_TOKEN_REJECTED",
        reason: "token_not_found",
        requestId,
        tokenIdHash: hashForLog(tokenId),
      });
      return invalidTokenResponse();
    }

    const username = typeof tokenRecord.username === "string" ? tokenRecord.username : "";
    const tokenIsActive = tokenRecord.status === "active";
    const tokenIsExpired =
      typeof tokenRecord.expiresAt !== "number" || tokenRecord.expiresAt <= nowEpochSeconds;
    const tokenMatches = tokenRecord.tokenHash === tokenHash;

    if (!username || !tokenIsActive || tokenIsExpired || !tokenMatches) {
      logEvent({
        event: "EMAIL_VERIFICATION_TOKEN_REJECTED",
        reason: tokenIsExpired
          ? "expired"
          : !tokenMatches
            ? "hash_mismatch"
            : !tokenIsActive
              ? "not_active"
              : "invalid_record",
        requestId,
        tokenIdHash: hashForLog(tokenId),
        accountHash: hashForLog(`${username.toLowerCase()}#${tokenRecord.emailNormalized || ""}`),
      });
      return invalidTokenResponse();
    }

    await dynamoDB
      .update({
        TableName: EMAIL_VERIFICATION_TOKENS_TABLE_NAME,
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
          ":consumedUserAgent": requestUserAgent,
          ":active": "active",
          ":tokenHash": tokenHash,
          ":nowEpochSeconds": nowEpochSeconds,
        },
      })
      .promise();

    await dynamoDB
      .update({
        TableName: USERS_TABLE_NAME,
        Key: { username },
        UpdateExpression: "SET emailVerified = :true, updatedAt = :updatedAt",
        ConditionExpression: "attribute_exists(username)",
        ExpressionAttributeValues: {
          ":true": true,
          ":updatedAt": nowIso,
        },
      })
      .promise();

    logEvent({
      event: "EMAIL_VERIFICATION_TOKEN_CONSUMED",
      requestId,
      tokenIdHash: hashForLog(tokenId),
      accountHash: hashForLog(`${username.toLowerCase()}#${tokenRecord.emailNormalized || ""}`),
    });

    return jsonResponse(200, {
      message: "Email verified successfully",
    });
  } catch (error) {
    if (error?.code === "ConditionalCheckFailedException") {
      logEvent({
        event: "EMAIL_VERIFICATION_TOKEN_REJECTED",
        reason: "already_consumed_or_expired",
        requestId,
        tokenIdHash: hashForLog(tokenId),
      });
      return invalidTokenResponse();
    }

    console.error("Verify email error:", error);
    return jsonResponse(500, {
      code: "INTERNAL_ERROR",
      message: "Error verifying email",
    });
  }
};
