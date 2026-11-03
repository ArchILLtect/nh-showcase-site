import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getLoggedInUser,
  logout,
  validateSessionWithServer,
} from "./auth";

const createMemoryStorage = () => {
  const values = new Map();

  return {
    getItem: (key) => values.get(key) ?? null,
    removeItem: (key) => values.delete(key),
    setItem: (key, value) => values.set(key, String(value)),
  };
};

const createToken = (payload) => {
  const encodedPayload = btoa(JSON.stringify(payload))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return `header.${encodedPayload}.signature`;
};

const seedSession = () => {
  const user = {
    username: "test-user",
    role: "user",
    tokenVersion: 1,
    emailVerified: false,
  };

  localStorage.setItem(
    "authToken",
    createToken({
      exp: Math.floor(Date.now() / 1000) + 60,
      tokenVersion: user.tokenVersion,
    }),
  );
  localStorage.setItem("userData", JSON.stringify(user));
};

describe("validateSessionWithServer", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", createMemoryStorage());
    vi.stubGlobal("fetch", vi.fn());
    vi.spyOn(console, "warn").mockImplementation(() => {});
    logout();
    seedSession();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("ends the browser session when the validation endpoint returns an error", async () => {
    fetch.mockResolvedValue({ ok: false, status: 503 });

    await expect(validateSessionWithServer()).resolves.toBe(false);
    expect(localStorage.getItem("authToken")).toBeNull();
    expect(localStorage.getItem("userData")).toBeNull();
  });

  it("ends the browser session when session validation cannot reach the server", async () => {
    fetch.mockRejectedValue(new Error("Network unavailable"));

    await expect(validateSessionWithServer()).resolves.toBe(false);
    expect(localStorage.getItem("authToken")).toBeNull();
    expect(localStorage.getItem("userData")).toBeNull();
  });

  it("keeps a confirmed session and refreshes the stored user data", async () => {
    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        valid: true,
        user: { emailVerified: true, role: "admin", tokenVersion: 1 },
      }),
    });

    await expect(validateSessionWithServer()).resolves.toBe(true);
    expect(getLoggedInUser()).toMatchObject({
      username: "test-user",
      emailVerified: true,
      role: "admin",
    });
  });
});
