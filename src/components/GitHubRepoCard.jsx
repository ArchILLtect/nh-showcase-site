import React from "react";
import PropTypes from "prop-types";

const formatUpdatedDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Recently updated"
    : `Updated ${new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date)}`;
};

const GitHubRepoCard = ({ repository }) => (
  <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-600 bg-gray-800 text-gray-100 shadow-md transition duration-200 hover:-translate-y-1 hover:border-blue-400/70 hover:shadow-xl hover:shadow-blue-950/30">
    <div className="h-1 bg-gradient-to-r from-cyan-300 via-blue-500 to-indigo-500 opacity-80 transition-opacity group-hover:opacity-100" />
    <div className="flex flex-1 flex-col p-5">
    <div className="mb-2 flex items-start justify-between gap-3">
      <h3 className="break-words text-xl font-bold text-blue-100">{repository.name}</h3>
      {repository.language && (
        <span className="shrink-0 rounded-full border border-gray-600 bg-gray-900/50 px-2.5 py-1 text-xs font-medium text-cyan-100">
          {repository.language}
        </span>
      )}
    </div>
    <p className="mb-5 flex-1 leading-6 text-gray-300">
      {repository.description || "A public project repository."}
    </p>
    <dl className="mb-5 grid grid-cols-2 gap-3 border-y border-gray-700 py-4 text-sm text-gray-300">
      <div>
        <dt className="text-gray-400">Stars</dt>
        <dd className="font-semibold text-gray-100">{repository.stargazers_count}</dd>
      </div>
      <div>
        <dt className="text-gray-400">Open issues</dt>
        <dd className="font-semibold text-gray-100">{repository.open_issues_count}</dd>
      </div>
      <div className="col-span-2">
        <dt className="text-gray-400">Activity</dt>
        <dd className="font-medium text-gray-200">{formatUpdatedDate(repository.updated_at)}</dd>
      </div>
    </dl>
    <a
      href={repository.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-11 w-fit items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
    >
      View repository <span aria-hidden="true">↗</span>
    </a>
    </div>
  </article>
);

GitHubRepoCard.propTypes = {
  repository: PropTypes.shape({
    description: PropTypes.string,
    html_url: PropTypes.string.isRequired,
    language: PropTypes.string,
    name: PropTypes.string.isRequired,
    open_issues_count: PropTypes.number.isRequired,
    stargazers_count: PropTypes.number.isRequired,
    updated_at: PropTypes.string.isRequired,
  }).isRequired,
};

export default GitHubRepoCard;
