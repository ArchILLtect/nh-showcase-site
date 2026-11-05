import React from "react";
import PropTypes from "prop-types";

const GitHubProfileCard = ({ profile }) => (
  <section className="mx-auto mb-12 flex max-w-4xl flex-col items-center gap-5 rounded-xl border border-gray-600 bg-gradient-to-br from-gray-800 to-slate-900 p-6 text-center text-gray-100 shadow-xl shadow-slate-950/20 sm:flex-row sm:p-7 sm:text-left">
    <img
      src={profile.avatar_url}
      alt={`${profile.login} GitHub avatar`}
      className="h-24 w-24 shrink-0 rounded-full border-2 border-cyan-300 object-cover shadow-lg shadow-cyan-950/40"
      width="96"
      height="96"
    />
    <div className="min-w-0 flex-1">
      <h2 className="text-2xl font-bold">{profile.name || profile.login}</h2>
      <p className="mb-2 text-cyan-200">@{profile.login}</p>
      <p className="mb-4 leading-6 text-gray-300">{profile.bio || "Public projects and open-source work."}</p>
      <p className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-sm text-gray-300 sm:justify-start">
        <span><strong className="text-white">{profile.public_repos}</strong> public repositories</span>
        <span><strong className="text-white">{profile.followers}</strong> followers</span>
      </p>
    </div>
    <a
      href={profile.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg border border-blue-400/40 bg-blue-600 px-5 py-2 font-semibold text-white transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
    >
      View GitHub profile <span aria-hidden="true">↗</span>
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
