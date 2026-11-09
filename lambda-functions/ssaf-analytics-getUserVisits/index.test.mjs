import test from "node:test";
import assert from "node:assert/strict";
import { createHandler } from "./index.mjs";

const event = (authorization) => ({ headers: { origin: "https://nickhanson.me", ...(authorization ? { authorization } : {}) } });

test("rejects missing bearer token without validating a session", async () => {
  const handler = createHandler({ fetchFn: () => assert.fail("must not call validator") });
  const result = await handler(event());
  assert.equal(result.statusCode, 401);
  assert.equal(result.headers["Access-Control-Allow-Origin"], "https://nickhanson.me");
});

test("omits CORS permission for an unapproved Netlify preview", async () => {
  const handler = createHandler({ fetchFn: () => assert.fail("must not call validator") });
  const result = await handler({ headers: { origin: "https://deploy-preview-12--resonant-ganache-9efedd.netlify.app" } });
  assert.equal(result.statusCode, 403);
  assert.equal(result.headers["Access-Control-Allow-Origin"], undefined);
});

test("uses only server-validated known IPs for personal visits", async () => {
  let scanInput;
  const handler = createHandler({
    fetchFn: async (_url, options) => {
      assert.equal(options.headers.Authorization, "Bearer valid-token");
      return { ok: true, status: 200, json: async () => ({ valid: true, user: { username: "nick", knownIps: [{ ip: "203.0.113.8" }] } }) };
    },
    getDocumentClient: () => ({ scan: (input) => { scanInput = input; return { promise: async () => ({ Items: [{ ip: "203.0.113.8" }] }) }; } }),
  });
  const request = event("Bearer valid-token");
  request.body = JSON.stringify({ knownIps: ["198.51.100.77"] });
  const result = await handler(request);
  assert.equal(result.statusCode, 200);
  assert.equal(scanInput.ExpressionAttributeValues[":ip0"], "203.0.113.8");
  assert.equal(Object.values(scanInput.ExpressionAttributeValues).includes("198.51.100.77"), false);
});

test("fails closed when session validation is unavailable", async () => {
  const handler = createHandler({ fetchFn: async () => { throw new Error("offline"); } });
  const result = await handler(event("Bearer token"));
  assert.equal(result.statusCode, 503);
});

test("allows the current PR preview origin", async () => {
  const origin = "https://deploy-preview-17--resonant-ganache-9efedd.netlify.app";
  const result = await createHandler({ fetchFn: () => assert.fail("missing token should stop first") })(
    { headers: { origin } },
  );
  assert.equal(result.statusCode, 401);
  assert.equal(result.headers["Access-Control-Allow-Origin"], origin);
});
