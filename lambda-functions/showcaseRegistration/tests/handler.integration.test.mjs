import test from "node:test";
import assert from "node:assert/strict";
import AWS from "aws-sdk";

const originalDocClientGet = AWS.DynamoDB.DocumentClient.prototype.get;
const originalDocClientPut = AWS.DynamoDB.DocumentClient.prototype.put;
const originalSesSendEmail = AWS.SES.prototype.sendEmail;
const originalSqsSendMessage = AWS.SQS.prototype.sendMessage;
const originalConsoleInfo = console.info;
const originalConsoleError = console.error;

let mockState = {
  calls: {
    get: [],
    put: [],
    sendEmail: [],
    sendMessage: [],
    infoLogs: [],
    errorLogs: [],
  },
  onGet: async () => ({}),
  onPut: async () => ({}),
  onSendEmail: async () => ({}),
  onSendMessage: async () => ({}),
};

const setMockState = (overrides = {}) => {
  mockState = {
    calls: {
      get: [],
      put: [],
      sendEmail: [],
      sendMessage: [],
      infoLogs: [],
      errorLogs: [],
    },
    onGet: async () => ({}),
    onPut: async () => ({}),
    onSendEmail: async () => ({}),
    onSendMessage: async () => ({}),
    ...overrides,
  };
};

console.info = (...args) => {
  mockState.calls.infoLogs.push(args);
};

console.error = (...args) => {
  mockState.calls.errorLogs.push(args);
};

AWS.DynamoDB.DocumentClient.prototype.get = function mockGet(params) {
  mockState.calls.get.push(params);
  return {
    promise: () => mockState.onGet(params),
  };
};

AWS.DynamoDB.DocumentClient.prototype.put = function mockPut(params) {
  mockState.calls.put.push(params);
  return {
    promise: () => mockState.onPut(params),
  };
};

AWS.SES.prototype.sendEmail = function mockSendEmail(params) {
  mockState.calls.sendEmail.push(params);
  return {
    promise: () => mockState.onSendEmail(params),
  };
};

AWS.SQS.prototype.sendMessage = function mockSendMessage(params) {
  mockState.calls.sendMessage.push(params);
  return {
    promise: () => mockState.onSendMessage(params),
  };
};

const originalEnv = { ...process.env };

const applyBaseEnv = () => {
  process.env.USERS_TABLE_NAME = "Users";
  process.env.EMAIL_VERIFICATION_TOKENS_TABLE_NAME = "EmailVerificationTokens";
  process.env.EMAIL_VERIFY_TOKEN_TTL_MINUTES = "30";
  process.env.EMAIL_VERIFY_TOKEN_HASH_PEPPER = "pepper-value";
  process.env.EMAIL_VERIFY_URL_BASE = "https://nickhanson.me/verify-email";
  process.env.EMAIL_VERIFICATION_FROM_EMAIL = "noreply@nickhanson.me";
  process.env.EMAIL_VERIFICATION_REPLY_TO = "nick@nickhanson.me";
  process.env.ENABLE_INTERNAL_ERROR_TEST = "false";
  delete process.env.EMAIL_VERIFY_RATE_LIMITS_TABLE_NAME;
  delete process.env.REGISTRATION_VERIFICATION_EMAIL_MODE;
  delete process.env.REGISTRATION_VERIFICATION_EMAIL_CANARY_PERCENT;
  delete process.env.REGISTRATION_NOTIFICATION_FAILURES_QUEUE_URL;
};

const loadHandler = async () => {
  const modulePath = `../index.mjs?test=${Date.now()}-${Math.random()}`;
  const module = await import(modulePath);
  return module.handler;
};

const parseBody = (result) => JSON.parse(result.body);

test.after(() => {
  process.env = originalEnv;
  AWS.DynamoDB.DocumentClient.prototype.get = originalDocClientGet;
  AWS.DynamoDB.DocumentClient.prototype.put = originalDocClientPut;
  AWS.SES.prototype.sendEmail = originalSesSendEmail;
  AWS.SQS.prototype.sendMessage = originalSqsSendMessage;
  console.info = originalConsoleInfo;
  console.error = originalConsoleError;
});

test("register success returns 201 and verificationEmailSent=true", async () => {
  applyBaseEnv();
  setMockState();

  const handler = await loadHandler();
  const result = await handler({
    body: JSON.stringify({
      username: "integration_user_success",
      email: "integration-success@example.com",
      password: "StrongPass123!",
    }),
    headers: {
      "x-forwarded-for": "203.0.113.10",
      "user-agent": "NodeTest/1.0",
    },
    requestContext: {
      requestId: "req-success",
      http: {
        sourceIp: "203.0.113.10",
      },
    },
  });

  assert.equal(result.statusCode, 201);
  assert.equal(result.headers["Content-Type"], "application/json");
  assert.equal(result.headers["Access-Control-Allow-Origin"], "*");

  const payload = parseBody(result);
  assert.equal(payload.verificationPending, true);
  assert.equal(payload.verificationEmailSent, true);

  const userPutCall = mockState.calls.put.find((call) => call.TableName === "Users");
  assert.ok(userPutCall);
  assert.equal(userPutCall.ConditionExpression, "attribute_not_exists(username)");

  const tokenPutCall = mockState.calls.put.find(
    (call) => call.TableName === "EmailVerificationTokens",
  );
  assert.ok(tokenPutCall);

  assert.equal(mockState.calls.sendEmail.length, 1);

  const successLogCall = mockState.calls.infoLogs
    .map((entry) => entry[0])
    .find((entry) => typeof entry === "string" && entry.includes("REGISTER_SUCCEEDED"));
  assert.ok(successLogCall);

  const successLog = JSON.parse(successLogCall);
  assert.equal(successLog.event, "REGISTER_SUCCEEDED");
  assert.equal(successLog.requestId, "req-success");
  assert.equal(successLog.verificationEmailSent, true);
  assert.ok(typeof successLog.accountHash === "string" && successLog.accountHash.length > 0);
  assert.ok(typeof successLog.ipHash === "string" && successLog.ipHash.length > 0);
});

test("duplicate username returns 409 USERNAME_EXISTS", async () => {
  applyBaseEnv();
  setMockState({
    onPut: async (params) => {
      if (params.TableName === "Users") {
        const duplicateError = new Error("duplicate");
        duplicateError.code = "ConditionalCheckFailedException";
        throw duplicateError;
      }
      return {};
    },
  });

  const handler = await loadHandler();
  const result = await handler({
    body: JSON.stringify({
      username: "existing_user",
      email: "existing@example.com",
      password: "StrongPass123!",
    }),
    requestContext: {
      requestId: "req-duplicate",
      http: { sourceIp: "203.0.113.20" },
    },
  });

  assert.equal(result.statusCode, 409);
  const payload = parseBody(result);
  assert.equal(payload.code, "USERNAME_EXISTS");
  assert.equal(payload.message, "Username already exists");
});

test("invalid payload returns 400 VALIDATION_ERROR", async () => {
  applyBaseEnv();
  setMockState();

  const handler = await loadHandler();
  const result = await handler({
    body: JSON.stringify({
      email: "missing-username@example.com",
      password: "StrongPass123!",
    }),
    requestContext: {
      requestId: "req-invalid",
      http: { sourceIp: "203.0.113.30" },
    },
  });

  assert.equal(result.statusCode, 400);
  const payload = parseBody(result);
  assert.equal(payload.code, "VALIDATION_ERROR");
  assert.equal(payload.message, "username, email, and password are required");
  assert.equal(mockState.calls.put.length, 0);
});

test("throttled request returns 429 RATE_LIMITED", async () => {
  applyBaseEnv();
  process.env.EMAIL_VERIFY_RATE_LIMITS_TABLE_NAME = "EmailVerificationRateLimits";

  setMockState({
    onGet: async (params) => {
      if (params.TableName === "EmailVerificationRateLimits") {
        const nowEpochSeconds = Math.floor(Date.now() / 1000);
        return {
          Item: {
            count: 10,
            windowStart: nowEpochSeconds - 10,
            lastAttemptAt: nowEpochSeconds - 10,
          },
        };
      }
      return {};
    },
  });

  const handler = await loadHandler();
  const result = await handler({
    body: JSON.stringify({
      username: "throttle_user",
      email: "throttle@example.com",
      password: "StrongPass123!",
    }),
    headers: {
      "x-forwarded-for": "203.0.113.40",
    },
    requestContext: {
      requestId: "req-throttle",
      http: { sourceIp: "203.0.113.40" },
    },
  });

  assert.equal(result.statusCode, 429);
  const payload = parseBody(result);
  assert.equal(payload.code, "RATE_LIMITED");
  assert.equal(payload.message, "Too many registration attempts. Please try again shortly.");

  const usersPutCall = mockState.calls.put.find((call) => call.TableName === "Users");
  assert.equal(usersPutCall, undefined);
});

test("OPTIONS preflight returns 200 with CORS headers", async () => {
  applyBaseEnv();
  setMockState();

  const handler = await loadHandler();
  const result = await handler({
    requestContext: {
      http: {
        method: "OPTIONS",
      },
    },
  });

  assert.equal(result.statusCode, 200);
  assert.equal(result.headers["Content-Type"], "application/json");
  assert.equal(result.headers["Access-Control-Allow-Origin"], "*");
  assert.equal(result.headers["Access-Control-Allow-Methods"], "POST, OPTIONS");

  const payload = parseBody(result);
  assert.equal(payload.message, "OK");
});

test("post-create verification failure still returns 201 with verificationEmailSent=false", async () => {
  applyBaseEnv();
  setMockState({
    onPut: async (params) => {
      if (params.TableName === "EmailVerificationTokens") {
        throw new Error("token write failed");
      }
      return {};
    },
  });

  const handler = await loadHandler();
  const result = await handler({
    body: JSON.stringify({
      username: "post_create_fallback_user",
      email: "fallback@example.com",
      password: "StrongPass123!",
    }),
    requestContext: {
      requestId: "req-post-create-fallback",
      http: { sourceIp: "203.0.113.50" },
    },
  });

  assert.equal(result.statusCode, 201);
  const payload = parseBody(result);
  assert.equal(payload.verificationPending, true);
  assert.equal(payload.verificationEmailSent, false);
  assert.equal(
    payload.message,
    "User registered successfully. Verification email could not be sent right now.",
  );

  const usersPutCall = mockState.calls.put.find((call) => call.TableName === "Users");
  assert.ok(usersPutCall);
  assert.equal(mockState.calls.sendEmail.length, 0);
});

test("verification dispatch mode off skips token generation and email send", async () => {
  applyBaseEnv();
  process.env.REGISTRATION_VERIFICATION_EMAIL_MODE = "off";
  setMockState();

  const handler = await loadHandler();
  const result = await handler({
    body: JSON.stringify({
      username: "rollout_off_user",
      email: "rollout-off@example.com",
      password: "StrongPass123!",
    }),
    requestContext: {
      requestId: "req-rollout-off",
      http: { sourceIp: "203.0.113.55" },
    },
  });

  assert.equal(result.statusCode, 201);
  const payload = parseBody(result);
  assert.equal(payload.verificationPending, true);
  assert.equal(payload.verificationEmailSent, false);

  const tokenPutCall = mockState.calls.put.find(
    (call) => call.TableName === "EmailVerificationTokens",
  );
  assert.equal(tokenPutCall, undefined);
  assert.equal(mockState.calls.sendEmail.length, 0);
});

test("post-create verification failure enqueues notification intent when queue configured", async () => {
  applyBaseEnv();
  process.env.REGISTRATION_NOTIFICATION_FAILURES_QUEUE_URL =
    "https://sqs.us-east-2.amazonaws.com/010928199012/registration-notification-failures";

  setMockState({
    onPut: async (params) => {
      if (params.TableName === "EmailVerificationTokens") {
        throw new Error("token write failed");
      }
      return {};
    },
  });

  const handler = await loadHandler();
  const result = await handler({
    body: JSON.stringify({
      username: "queue_fallback_user",
      email: "queue-fallback@example.com",
      password: "StrongPass123!",
    }),
    requestContext: {
      requestId: "req-queue-fallback",
      http: { sourceIp: "203.0.113.56" },
    },
  });

  assert.equal(result.statusCode, 201);
  const payload = parseBody(result);
  assert.equal(payload.verificationPending, true);
  assert.equal(payload.verificationEmailSent, false);

  assert.equal(mockState.calls.sendMessage.length, 1);
  assert.equal(
    mockState.calls.sendMessage[0].QueueUrl,
    "https://sqs.us-east-2.amazonaws.com/010928199012/registration-notification-failures",
  );
});

test("password without symbol returns 400 VALIDATION_ERROR", async () => {
  applyBaseEnv();
  setMockState();

  const handler = await loadHandler();
  const result = await handler({
    body: JSON.stringify({
      username: "no_symbol_user",
      email: "no-symbol@example.com",
      password: "StrongPass123",
    }),
    requestContext: {
      requestId: "req-no-symbol",
      http: { sourceIp: "203.0.113.60" },
    },
  });

  assert.equal(result.statusCode, 400);
  const payload = parseBody(result);
  assert.equal(payload.code, "VALIDATION_ERROR");
  assert.equal(payload.message, "password must include uppercase, lowercase, a number, and a symbol");
});

test("common weak password returns 400 VALIDATION_ERROR", async () => {
  applyBaseEnv();
  setMockState();

  const handler = await loadHandler();
  const result = await handler({
    body: JSON.stringify({
      username: "weak_password_user",
      email: "weak-password@example.com",
      password: "Password123!",
    }),
    requestContext: {
      requestId: "req-weak-password",
      http: { sourceIp: "203.0.113.62" },
    },
  });

  assert.equal(result.statusCode, 400);
  const payload = parseBody(result);
  assert.equal(payload.code, "VALIDATION_ERROR");
  assert.equal(payload.message, "password is too common; choose a stronger password");
});

test("email longer than 254 chars returns 400 VALIDATION_ERROR", async () => {
  applyBaseEnv();
  setMockState();

  const localPart = "a".repeat(249);
  const longEmail = `${localPart}@x.com`;

  const handler = await loadHandler();
  const result = await handler({
    body: JSON.stringify({
      username: "long_email_user",
      email: longEmail,
      password: "StrongPass123!",
    }),
    requestContext: {
      requestId: "req-long-email",
      http: { sourceIp: "203.0.113.61" },
    },
  });

  assert.equal(result.statusCode, 400);
  const payload = parseBody(result);
  assert.equal(payload.code, "VALIDATION_ERROR");
  assert.equal(payload.message, "email must be at most 254 characters");
});
