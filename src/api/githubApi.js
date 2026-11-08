const API_BASE_URL = "https://api.github.com";
const API_HEADERS = { Accept: "application/vnd.github+json" };

const getJson = async (url, fetchImpl = fetch) => {
  const response = await fetchImpl(url, { headers: API_HEADERS });

  if (!response.ok) {
    if (response.status === 403 && response.headers?.get("x-ratelimit-remaining") === "0") {
      throw new Error("GitHub's public API rate limit was reached. Please try again later.");
    }
    if (response.status === 404) {
      throw new Error("The requested public GitHub profile or repositories could not be found.");
    }
    throw new Error(`GitHub's public API returned ${response.status}. Please try again later.`);
  }

  return response.json();
};

export const getGitHubProfile = (username, fetchImpl) =>
  getJson(`${API_BASE_URL}/users/${encodeURIComponent(username)}`, fetchImpl);

export const getGitHubRepositoryNames = (projects, username) => {
  if (!Array.isArray(projects)) return [];

  const expectedOwner = username.toLowerCase();
  return projects.flatMap((project) => {
    if (typeof project.github !== "string") return [];

    try {
      const url = new URL(project.github);
      const [owner, repository] = url.pathname.split("/").filter(Boolean);
      if (url.hostname !== "github.com" || owner?.toLowerCase() !== expectedOwner || !repository) {
        return [];
      }

      return [`${owner}/${repository.replace(/\.git$/i, "")}`];
    } catch {
      return [];
    }
  });
};

export const getGitHubRepositories = async (username, repositoryNames, fetchImpl) => {
  const repositories = await getJson(
    `${API_BASE_URL}/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=100`,
    fetchImpl,
  );

  if (!Array.isArray(repositories)) {
    throw new Error("GitHub returned an unexpected repository response.");
  }

  const selectedRepositories = new Set(repositoryNames.map((name) => name.toLowerCase()));
  return repositories
    .filter((repository) =>
      !repository.fork
      && !repository.archived
      && selectedRepositories.has(repository.full_name.toLowerCase()),
    )
    .slice(0, 12);
};
