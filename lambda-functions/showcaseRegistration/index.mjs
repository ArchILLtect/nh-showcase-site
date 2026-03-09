import AWS from "aws-sdk";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const ses = new AWS.SES();
const TABLE_NAME = process.env.USERS_TABLE_NAME || "Users";
const EMAIL_VERIFICATION_TOKENS_TABLE_NAME =
  process.env.EMAIL_VERIFICATION_TOKENS_TABLE_NAME || "EmailVerificationTokens";
const EMAIL_VERIFY_TOKEN_TTL_MINUTES = Number(process.env.EMAIL_VERIFY_TOKEN_TTL_MINUTES || "30");
const EMAIL_VERIFY_TOKEN_HASH_PEPPER = process.env.EMAIL_VERIFY_TOKEN_HASH_PEPPER || "";
const EMAIL_VERIFY_URL_BASE = process.env.EMAIL_VERIFY_URL_BASE || "";
const EMAIL_VERIFICATION_FROM_EMAIL = process.env.EMAIL_VERIFICATION_FROM_EMAIL || "";
const EMAIL_VERIFICATION_REPLY_TO = process.env.EMAIL_VERIFICATION_REPLY_TO || "";
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

    return jsonResponse(201, {
      message: "User registered successfully. Please verify your email.",
      verificationPending: true,
    });
  } catch (error) {
    if (error?.code === "ConditionalCheckFailedException") {
      return jsonResponse(409, {
        code: "USERNAME_EXISTS",
        message: "Username already exists",
      });
    }

    console.error("Registration error:", error);
    return jsonResponse(500, {
      code: "INTERNAL_ERROR",
      message: "Error registering user",
    });
  }
};