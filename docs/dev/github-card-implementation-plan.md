# GitHub Profile and Repository Cards

## Implemented behavior

The `/github` page displays the public `ArchILLtect` profile and up to 12 recent, non-fork, non-archived public repositories that are also linked from `public/data/projects.json`. This keeps the cards focused on portfolio work rather than every public repository. Each repository card shows its description, primary language, stars, open issues, last update date, and a link to GitHub. The page is available from the Projects menu on desktop and mobile.

## Data and security boundary

- The browser calls `https://api.github.com/users/{username}` and the public user-repositories endpoint, then filters that response against the portfolio's existing repository links.
- These endpoints return public information and do not require authentication. Requests contain no token, `Authorization` header, credential, or `VITE_*` secret.
- Profile/repository data and the GitHub username are public by design; no private repositories or account data are requested.
- GitHub's unauthenticated API is rate-limited. Errors are surfaced in the UI with a retry-later explanation; the page does not fall back to hardcoded claims.
- If authenticated/private data or higher API limits are ever required, that is a separate design decision requiring a server-side boundary and secret storage. Never place a GitHub token in browser code or a `VITE_*` variable.

## Verification

- Unit tests cover the public request shape, repository filtering/limit, and rate-limit messaging.
- Run `npm test`, `npm run lint`, and `npm run build`.
- Manual smoke check: open `/github` at desktop and mobile widths; verify the profile and repository links, keyboard focus, and the unavailable/rate-limited fallback.
