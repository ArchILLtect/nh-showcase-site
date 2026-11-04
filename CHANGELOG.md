# Changelog

All notable project changes are recorded here.

## Unreleased

### Certificates and portfolio content

- Recovered seven unique Codefinity credentials from archived 2023 certificate images: six completed courses and the **Becoming a Web Developer** track.
- Added original certificate PNG assets and recorded the historical completion dates and certificate IDs in `public/data/certificates.json`.
- Featured the completed track separately on the Certificates page; certificate verification links now appear only when a real `certUrl` exists.
- Kept **Advanced CSS Techniques** as the canonical CSS course title. The separately downloaded **CSS Layout, Effects, and Sass** image was an identical certificate, not an eighth credential.
- Preserved all five existing Coursera credentials. This change is pending PR review, CI and preview verification; it has not yet been deployed to production.

### Analytics security and reliability

- Added source-controlled analytics Lambda handlers with server-side session validation, user-bound personal visit filters, and admin-only full-site reads.
- Changed visit ingestion to use API Gateway's source IP and user-agent headers instead of client-submitted identity or a third-party IP lookup.
- Added authenticated browser requests and removed persistent browser caching of analytics records.
- Migrated all analytics Lambdas to AWS SDK v3; the visit writer now bounds DynamoDB request time and logs safe progress/error metadata.
- The browser tracker now treats non-2xx responses as failures and only applies its cooldown after a successful write.
- Deployed the analytics readers and visit writer with no reserved-concurrency cap; API Gateway CORS behavior was verified for the allowed site and preview origins.

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
