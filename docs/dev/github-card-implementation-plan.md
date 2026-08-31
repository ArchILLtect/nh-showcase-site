# GitHub Profile + Repo Cards Plan

Implement a dedicated GitHub page that shows one profile card (GitHub user API) and multiple repository cards (GitHub repo API) using reusable React components that match existing Tailwind, loading, and telemetry patterns.

## Steps
1. Phase 1 — Define data contract and page scope
   1. Confirm route and nav label for dedicated section (`/github` recommended).
   2. Define props/contracts for `GHProfileCard` (username) and `GHRepoCard` (owner/repo), including fields: name, description, stars, language, last updated, open issues, external link.
   3. Set repo list source to `public/data/githubRepos.json`.
2. Phase 2 — Add API config and fetch utilities (*blocks Phase 3*)
   1. Centralize non-secret GitHub API constants under `src/constants/` (for example, a public base URL or intentionally client-visible `VITE_*` setting).
   2. Add fetch helpers in `src/api/` for `getGitHubUser(username)` and `getGitHubRepo(fullName)` with normalized errors.
   3. Add optional client cache (TTL) to reduce repeat requests/rate-limit risk.
3. Phase 3 — Build reusable UI components (*parallelizable after Phase 2 step 2*)
   1. Create `GHProfileCard` with loading/error/success states.
   2. Create `GHRepoCard` with metadata row and “View Repo” action.
   3. Match existing Tailwind dark-mode and card conventions.
4. Phase 4 — Compose page and wire routing/nav (*depends on Phases 2-3*)
   1. Create new page in `src/pages/` to render profile card + mapped repo cards.
   2. Apply `usePageTitle(...)` and `trackVisit()` conventions.
   3. Add route in `src/App.jsx` and desktop/mobile nav entry in `NavBar`.
5. Phase 5 — Hardening and UX polish
   1. Handle API limits and non-200 responses with user-facing fallback copy.
   2. Keep 500ms minimum spinner-delay pattern where applicable.
   3. Verify accessibility basics for headings/links/focus.
6. Phase 6 — Verification and docs
   1. Validate loading/success/error states.
   2. Run focused manual loading/success/error checks and `npm run build`; no automated frontend test command currently exists.
   3. Update TODO/docs for GitHub API integration and any intentionally public client configuration.

## Relevant Files
- `src/App.jsx` — route registration
- `src/components/NavBar.jsx` — nav links
- `src/components/SubMenu.jsx` — optional grouped nav updates
- `src/pages/` (new `GitHub.jsx` or `GitHubPage.jsx`) — page composition
- `src/components/` (new `GHProfileCard.jsx`, `GHRepoCard.jsx`) — reusable cards
- `src/api/` (new `githubApi.js`) — API calls and normalization
- `src/constants/` (new `api.js` or `github.js`) — constants/env wiring
- `public/data/` (new `githubRepos.json`) — repo list
- `TODO.md` and optional `README.md` — docs update

## Verification
1. Route/nav checks for page accessibility.
2. Functional checks for profile + repo card fields.
3. Error-path checks (invalid username/repo + rate limit).
4. UX checks for loading/dark-mode consistency.
5. Production-build and focused manual smoke checks for the frontend.

## Decisions
- Included: dedicated page, profile + repo APIs, all requested MVP fields, reusable components.
- Excluded: backend proxy, GraphQL migration, advanced sorting/filtering/pagination, redesign.

## Further Considerations
1. Auth strategy: prefer unauthenticated public GitHub API access for this browser-delivered feature. Do not place a GitHub token or any other secret in `VITE_*` configuration because those values are bundled into client code. If authenticated API access becomes necessary, introduce a server-side boundary that retains the token and exposes only the required response data.
2. Repo list source: JSON (recommended) vs hardcoded vs remote CMS.
3. Cache scope: no cache vs session TTL (recommended) vs persistent local cache.
