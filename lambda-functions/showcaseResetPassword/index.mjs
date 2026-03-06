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

  return jsonResponse(501, {
    code: "NOT_IMPLEMENTED",
    message: "Reset password logic is not implemented yet",
    stub: true,
  });
};
