# Changelog

All notable project changes are recorded here.

## Unreleased

### Authentication

- End browser sessions when server-side session validation cannot be confirmed instead of trusting locally stored session state.
- Centralized public auth API configuration behind `VITE_AUTH_API_BASE_URL` while preserving the current endpoint as the default.
- Deployed the auth Lambda updates to their `prod` aliases and verified the API Gateway routes, trusted-origin preflight behavior, and basic invalid-input/session smoke cases.

### Security

- Updated the production dependency lockfile to remediate the audited `follow-redirects` and `source-map-js` findings.
- Replaced wildcard browser CORS responses in all authentication Lambdas with production-domain and Netlify deploy-preview allowlisting; unknown browser origins are rejected.
- Restricted API Gateway CORS to the production domains and the supplied Netlify preview origin. Broader route-specific CORS ownership remains tracked in [issue #7](https://github.com/ArchILLtect/nh-showcase-site/issues/7).

### Tooling

- Restored JSX-aware ESLint parsing and added `npm run lint`.
- Added linting to the GitHub Actions quality gate before the production build.
- Added a Vitest regression suite and test gate to GitHub Actions.
- Updated the Lambda packaging helper to archive and package all top-level `.mjs` modules, and to stop if dependency installation fails.

### Navigation

- Kept the mobile navigation header and close toggle above the menu backdrop to prevent the backdrop from intercepting close taps.
