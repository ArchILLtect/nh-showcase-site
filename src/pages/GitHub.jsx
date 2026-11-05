import React, { useEffect, useState } from "react";
import GitHubProfileCard from "../components/GitHubProfileCard";
import GitHubRepoCard from "../components/GitHubRepoCard";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  getGitHubProfile,
  getGitHubRepositoryNames,
  getGitHubRepositories,
} from "../api/githubApi";
import { usePageTitle } from "../hooks/usePageTitle";
import { trackVisit } from "../utils/visitTracker";

const GITHUB_USERNAME = "ArchILLtect";

const GitHub = () => {
  usePageTitle("GitHub Projects");

  const [profile, setProfile] = useState(null);
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [repositoriesError, setRepositoriesError] = useState("");

  useEffect(() => {
    trackVisit();
  }, []);

  useEffect(() => {
    let isMounted = true;
    const startedAt = Date.now();

    const getPortfolioRepositories = async () => {
      const response = await fetch("/data/projects.json");
      if (!response.ok) {
        throw new Error("The portfolio repository list could not be loaded.");
      }

      const projects = await response.json();
      const repositoryNames = getGitHubRepositoryNames(projects, GITHUB_USERNAME);
      return getGitHubRepositories(GITHUB_USERNAME, repositoryNames);
    };

    Promise.allSettled([
      getGitHubProfile(GITHUB_USERNAME),
      getPortfolioRepositories(),
    ]).then((results) => {
      if (!isMounted) return;

      const [profileResult, repositoriesResult] = results;
      if (profileResult.status === "fulfilled") {
        setProfile(profileResult.value);
      } else {
        setProfileError(profileResult.reason?.message || "GitHub profile could not be loaded.");
      }

      if (repositoriesResult.status === "fulfilled") {
        setRepositories(repositoriesResult.value);
      } else {
        setRepositoriesError(repositoriesResult.reason?.message || "Repositories could not be loaded.");
      }

      const remainingDelay = Math.max(0, 500 - (Date.now() - startedAt));
      window.setTimeout(() => {
        if (isMounted) setLoading(false);
      }, remainingDelay);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="mx-auto mb-32 max-w-6xl px-4 py-8 sm:px-8">
      <header className="mb-8 text-center">
        <h1 className="mb-3 text-4xl font-bold text-gray-800 dark:text-gray-100">GitHub Projects</h1>
        <p className="mx-auto max-w-3xl text-gray-700 dark:text-gray-300">
          Explore public repositories and the work behind them. Project details are loaded from GitHub’s public API.
        </p>
      </header>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {profile ? (
            <GitHubProfileCard profile={profile} />
          ) : (
            <p role="alert" className="mb-8 text-center text-red-600 dark:text-red-400">{profileError}</p>
          )}

          <section aria-labelledby="repositories-heading">
            <h2 id="repositories-heading" className="mb-5 text-2xl font-bold text-gray-800 dark:text-gray-100">
              Public repositories
            </h2>
            {repositoriesError ? (
              <p role="alert" className="rounded bg-red-100 p-4 text-red-800 dark:bg-red-950 dark:text-red-200">
                {repositoriesError}
              </p>
            ) : repositories.length ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {repositories.map((repository) => (
                  <GitHubRepoCard key={repository.id} repository={repository} />
                ))}
              </div>
            ) : (
              <p className="text-gray-700 dark:text-gray-300">No public repositories are available to display.</p>
            )}
          </section>
          <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            GitHub’s unauthenticated API has a public rate limit. If it is reached, this page will recover when the limit resets.
          </p>
        </>
      )}
    </main>
  );
};

export default GitHub;
