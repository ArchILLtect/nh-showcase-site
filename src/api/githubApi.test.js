import { describe, expect, it, vi } from "vitest";
import {
  getGitHubProfile,
  getGitHubRepositoryNames,
  getGitHubRepositories,
} from "./githubApi";

const jsonResponse = (data, options = {}) => ({
  ok: options.ok ?? true,
  status: options.status ?? 200,
  headers: { get: vi.fn(() => options.rateLimitRemaining ?? null) },
  json: vi.fn().mockResolvedValue(data),
});

describe("GitHub public API helpers", () => {
  it("requests public data without sending credentials or a token", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse({ login: "ArchILLtect" }));

    await expect(getGitHubProfile("ArchILLtect", fetchImpl)).resolves.toEqual({ login: "ArchILLtect" });
    expect(fetchImpl).toHaveBeenCalledWith(
      "https://api.github.com/users/ArchILLtect",
      { headers: { Accept: "application/vnd.github+json" } },
    );
  });

  it("omits forks and archived repositories and caps the portfolio list", async () => {
    const repositories = [
      { id: 1, full_name: "ArchILLtect/project-1", fork: false, archived: false },
      { id: 2, full_name: "ArchILLtect/forked-project", fork: true, archived: false },
      { id: 3, full_name: "ArchILLtect/archived-project", fork: false, archived: true },
      ...Array.from({ length: 13 }, (_, index) => ({
        id: index + 4,
        full_name: `ArchILLtect/project-${index + 2}`,
        fork: false,
        archived: false,
      })),
    ];
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse(repositories));

    const allowedNames = [
      "ArchILLtect/project-1",
      ...Array.from({ length: 13 }, (_, index) => `ArchILLtect/project-${index + 2}`),
      "ArchILLtect/forked-project",
      "ArchILLtect/archived-project",
    ];
    const result = await getGitHubRepositories("ArchILLtect", allowedNames, fetchImpl);

    expect(result).toHaveLength(12);
    expect(result.some((repository) => repository.id === 2 || repository.id === 3)).toBe(false);
  });

  it("derives curated personal repositories from project links only", () => {
    const projects = [
      { github: "https://github.com/ArchILLtect/treemark" },
      { github: "https://github.com/SomeoneElse/repo" },
      { github: "https://github.com/ArchILLtect/API_Interface/tree/main/D%26D_API_5e" },
      { github: "https://example.com/not-github" },
      { github: "invalid-url" },
      {},
    ];

    expect(getGitHubRepositoryNames(projects, "ArchILLtect")).toEqual([
      "ArchILLtect/treemark",
      "ArchILLtect/API_Interface",
    ]);
  });

  it("returns a clear message when GitHub rate-limits the request", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      jsonResponse({}, { ok: false, status: 403, rateLimitRemaining: "0" }),
    );

    await expect(getGitHubProfile("ArchILLtect", fetchImpl)).rejects.toThrow(/rate limit/i);
  });
});
