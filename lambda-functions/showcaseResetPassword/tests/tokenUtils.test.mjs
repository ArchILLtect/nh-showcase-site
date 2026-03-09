import test from "node:test";
import assert from "node:assert/strict";
import {
  hashResetTokenSecret,
  isTokenExpired,
  isTokenUsable,
  parseCompositeResetToken,
} from "../tokenUtils.mjs";

test("hashResetTokenSecret returns deterministic hash for same input", () => {
  const tokenSecret = "secret-value";
  const pepper = "pepper-123";

  const first = hashResetTokenSecret(tokenSecret, pepper);
  const second = hashResetTokenSecret(tokenSecret, pepper);

  assert.equal(first, second);
  assert.equal(first.length, 64);
});

test("hashResetTokenSecret changes when pepper changes", () => {
  const tokenSecret = "secret-value";
  const hashOne = hashResetTokenSecret(tokenSecret, "pepper-a");
  const hashTwo = hashResetTokenSecret(tokenSecret, "pepper-b");

  assert.notEqual(hashOne, hashTwo);
});

test("parseCompositeResetToken parses valid token", () => {
  const parsed = parseCompositeResetToken("token-id.token-secret");

  assert.deepEqual(parsed, {
    tokenId: "token-id",
    tokenSecret: "token-secret",
  });
});

test("parseCompositeResetToken rejects invalid format", () => {
  assert.equal(parseCompositeResetToken("just-one-part"), null);
  assert.equal(parseCompositeResetToken("too.many.parts.here"), null);
  assert.equal(parseCompositeResetToken("."), null);
});

test("isTokenExpired returns true when expiresAt is missing or elapsed", () => {
  const now = 1_700_000_000;

  assert.equal(isTokenExpired(undefined, now), true);
  assert.equal(isTokenExpired(now, now), true);
  assert.equal(isTokenExpired(now - 1, now), true);
  assert.equal(isTokenExpired(now + 1, now), false);
});

test("isTokenUsable accepts only active, unexpired, matching hash tokens", () => {
  const now = 1_700_000_000;
  const candidateHash = "abc123";

  const usable = isTokenUsable({
    status: "active",
    expiresAt: now + 60,
    storedTokenHash: "abc123",
    candidateTokenHash: candidateHash,
    nowEpochSeconds: now,
  });
  assert.equal(usable, true);

  const usedToken = isTokenUsable({
    status: "used",
    expiresAt: now + 60,
    storedTokenHash: "abc123",
    candidateTokenHash: candidateHash,
    nowEpochSeconds: now,
  });
  assert.equal(usedToken, false);

  const expiredToken = isTokenUsable({
    status: "active",
    expiresAt: now - 1,
    storedTokenHash: "abc123",
    candidateTokenHash: candidateHash,
    nowEpochSeconds: now,
  });
  assert.equal(expiredToken, false);

  const mismatchedHash = isTokenUsable({
    status: "active",
    expiresAt: now + 60,
    storedTokenHash: "different",
    candidateTokenHash: candidateHash,
    nowEpochSeconds: now,
  });
  assert.equal(mismatchedHash, false);
});
