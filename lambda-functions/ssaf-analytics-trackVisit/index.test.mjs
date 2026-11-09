import test from "node:test";
import assert from "node:assert/strict";
import { createHandler } from "./index.mjs";

test("records the gateway source IP and ignores client-supplied identity", async () => {
  let saved;
  const handler = createHandler({
    now: () => "2026-11-04T12:00:00.000Z", id: () => "generated-id",
    getDocumentClient: () => ({ send: async (command) => { saved = command.input.Item; return {}; } }),
  });
  const result = await handler({
    body: JSON.stringify({ ip: "192.0.2.99", userAgent: "spoof", path: "/dashboard" }),
    headers: { origin: "https://nickhanson.me", "user-agent": "browser" },
    requestContext: { identity: { sourceIp: "203.0.113.4" } },
  });
  assert.equal(result.statusCode, 201);
  assert.equal(result.headers["Access-Control-Allow-Origin"], "https://nickhanson.me");
  assert.deepEqual(saved, { visitId: "generated-id", ip: "203.0.113.4", userAgent: "browser", path: "/dashboard", timestamp: "2026-11-04T12:00:00.000Z" });
});

test("rejects an unapproved Netlify preview origin", async () => {
  const handler = createHandler({ getDocumentClient: () => assert.fail("must not write") });
  const result = await handler({ headers: { origin: "https://deploy-preview-12--resonant-ganache-9efedd.netlify.app" }, body: "{}" });
  assert.equal(result.statusCode, 403);
  assert.equal(result.headers["Access-Control-Allow-Origin"], undefined);
});

test("returns a server error when DynamoDB rejects a visit write", async () => {
  const handler = createHandler({
    getDocumentClient: () => ({ send: async () => { throw new Error("write failed"); } }),
  });
  const result = await handler({
    body: JSON.stringify({ path: "/dashboard" }),
    headers: { origin: "https://nickhanson.me" },
    requestContext: { identity: { sourceIp: "203.0.113.4" } },
  });
  assert.equal(result.statusCode, 500);
  assert.equal(JSON.parse(result.body).code, "INTERNAL_ERROR");
});

test("allows the current PR preview origin", async () => {
  const origin = "https://deploy-preview-17--resonant-ganache-9efedd.netlify.app";
  const handler = createHandler({ getDocumentClient: () => ({ send: async () => ({}) }) });
  const result = await handler({ headers: { origin }, body: JSON.stringify({ path: "/preview-check" }) });
  assert.equal(result.statusCode, 201);
  assert.equal(result.headers["Access-Control-Allow-Origin"], origin);
});
