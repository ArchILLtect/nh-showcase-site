# Changelog

All notable project changes are recorded here.

## Unreleased

### Security

- Updated the production dependency lockfile to remediate the audited `follow-redirects` and `source-map-js` findings.

### Tooling

- Restored JSX-aware ESLint parsing and added `npm run lint`.
- Added linting to the GitHub Actions quality gate before the production build.
