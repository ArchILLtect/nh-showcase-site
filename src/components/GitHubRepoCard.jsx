import React from "react";
import PropTypes from "prop-types";

const formatUpdatedDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Recently updated"
    : `Updated ${new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date)}`;
};

const GitHubRepoCard = ({ repository }) => (
  <article className="flex h-full flex-col rounded-lg border border-gray-600 bg-gray-800 p-5 text-gray-100 shadow-md transition-shadow hover:shadow-lg hover:shadow-blue-900/30">
    <h2 className="mb-2 break-words text-xl font-bold text-blue-200">{repository.name}</h2>
    <p className="mb-5 flex-1 text-gray-300">
      {repository.description || "A public project repository."}
    </p>
    <dl className="mb-5 grid grid-cols-2 gap-3 text-sm text-gray-300">
      <div>
        <dt className="text-gray-400">Language</dt>
        <dd>{repository.language || "Not specified"}</dd>
      </div>
      <div>
        <dt className="text-gray-400">Stars</dt>
        <dd>{repository.stargazers_count}</dd>
      </div>
      <div>
        <dt className="text-gray-400">Open issues</dt>
        <dd>{repository.open_issues_count}</dd>
      </div>
      <div>
        <dt className="text-gray-400">Activity</dt>
        <dd>{formatUpdatedDate(repository.updated_at)}</dd>
      </div>
    </dl>
    <a
      href={repository.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-11 w-fit items-center rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
    >
      View repository
    </a>
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
