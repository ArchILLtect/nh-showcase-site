# Changelog

All notable project changes are recorded here.

## Unreleased

### Authentication

- End browser sessions when server-side session validation cannot be confirmed instead of trusting locally stored session state.
- Centralized public auth API configuration behind `VITE_AUTH_API_BASE_URL` while preserving the current endpoint as the default.

### Security

- Updated the production dependency lockfile to remediate the audited `follow-redirects` and `source-map-js` findings.
- Replaced wildcard browser CORS responses in all authentication Lambdas with production-domain and Netlify deploy-preview allowlisting; unknown browser origins are rejected.

### Tooling

- Restored JSX-aware ESLint parsing and added `npm run lint`.
- Added linting to the GitHub Actions quality gate before the production build.
- Added a Vitest regression suite and test gate to GitHub Actions.
