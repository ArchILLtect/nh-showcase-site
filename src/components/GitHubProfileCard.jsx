import React from "react";
import PropTypes from "prop-types";

const GitHubProfileCard = ({ profile }) => (
  <section className="mx-auto mb-10 flex max-w-3xl flex-col items-center gap-5 rounded-lg border border-gray-600 bg-gray-800 p-6 text-center text-gray-100 shadow-lg sm:flex-row sm:text-left">
    <img
      src={profile.avatar_url}
      alt={`${profile.login} GitHub avatar`}
      className="h-24 w-24 rounded-full border-2 border-blue-400"
      width="96"
      height="96"
    />
    <div className="min-w-0 flex-1">
      <h2 className="text-2xl font-bold">{profile.name || profile.login}</h2>
      <p className="mb-2 text-blue-200">@{profile.login}</p>
      <p className="mb-3 text-gray-300">{profile.bio || "Public projects and open-source work."}</p>
      <p className="text-sm text-gray-300">
        <span className="mr-4">{profile.public_repos} public repositories</span>
        <span>{profile.followers} followers</span>
      </p>
    </div>
    <a
      href={profile.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-11 items-center rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
    >
      View Profile
    </a>
  </section>
);

GitHubProfileCard.propTypes = {
  profile: PropTypes.shape({
    avatar_url: PropTypes.string.isRequired,
    bio: PropTypes.string,
    followers: PropTypes.number.isRequired,
    html_url: PropTypes.string.isRequired,
    login: PropTypes.string.isRequired,
    name: PropTypes.string,
    public_repos: PropTypes.number.isRequired,
  }).isRequired,
};

export default GitHubProfileCard;
