import test from "node:test";
import assert from "node:assert/strict";
import { createHandler } from "./index.mjs";

const event = (authorization) => ({ headers: { origin: "https://nickhanson.me", ...(authorization ? { authorization } : {}) } });

test("requires a bearer token", async () => {
  const result = await createHandler({ fetchFn: () => assert.fail("must not call validator") })(event());
  assert.equal(result.statusCode, 401);
  assert.equal(result.headers["Access-Control-Allow-Origin"], "https://nickhanson.me");
});

test("omits CORS permission for an unapproved Netlify preview", async () => {
  const result = await createHandler({ fetchFn: () => assert.fail("must not call validator") })(
    { headers: { origin: "https://deploy-preview-12--resonant-ganache-9efedd.netlify.app" } },
  );
  assert.equal(result.statusCode, 403);
  assert.equal(result.headers["Access-Control-Allow-Origin"], undefined);
});

test("forbids authenticated non-admin users", async () => {
  const handler = createHandler({ fetchFn: async () => ({ ok: true, status: 200, json: async () => ({ valid: true, user: { role: "user" } }) }), getDocumentClient: () => assert.fail("must not scan") });
  const result = await handler(event("Bearer user-token"));
  assert.equal(result.statusCode, 403);
});

test("allows admins and paginates the full scan", async () => {
  let calls = 0;
  const handler = createHandler({
    fetchFn: async () => ({ ok: true, status: 200, json: async () => ({ valid: true, user: { role: "admin" } }) }),
    getDocumentClient: () => ({ scan: ({ ExclusiveStartKey }) => ({ promise: async () => {
      calls += 1;
      return ExclusiveStartKey ? { Items: [{ visitId: "2" }] } : { Items: [{ visitId: "1" }], LastEvaluatedKey: { visitId: "1" } };
    } }) }),
  });
  const result = await handler(event("Bearer admin-token"));
  assert.equal(result.statusCode, 200);
  assert.equal(JSON.parse(result.body).length, 2);
  assert.equal(calls, 2);
});

test("allows the current PR preview origin", async () => {
  const origin = "https://deploy-preview-17--resonant-ganache-9efedd.netlify.app";
  const result = await createHandler({ fetchFn: () => assert.fail("missing token should stop first") })(
    { headers: { origin } },
  );
  assert.equal(result.statusCode, 401);
  assert.equal(result.headers["Access-Control-Allow-Origin"], origin);
});
