import AWS from "aws-sdk";
import bcrypt from "bcryptjs";

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "Users";
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
    return jsonResponse(201, { message: "User registered successfully" });
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