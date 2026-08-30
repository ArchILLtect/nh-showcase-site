# AI coding agent guide for nh-showcase-site

React + Tailwind frontend with Netlify Forms for contact submissions and an optional Express stub. These are the entry points and conventions to ship fast here.

## Architecture & data flow

-   Router: `src/App.jsx` defines routes; `Layout` wraps pages to render `NavBar`/`Footer`.
-   Auth/roles: `PrivateRoute.jsx` gates routes using `roleHierarchy` (`constants/roles.js`) and auth helpers in `utils/auth.js` (localStorage: `authToken`, `userData`).
-   Data sources:
    -   Static JSON under `public/data/*.json` (e.g., `projects.json` via `fetch('data/projects.json')`).
    -   Netlify Forms handles `pages/Contact.jsx` submissions through a URL-encoded `POST /`; the static detection blueprint is in root `index.html`.
    -   AWS API Gateway Lambdas: blog create in `components/BlogEditor.jsx` (BLOG_API_ENDPOINT), visit logs in `utils/visitTracker.js` (VISIT_API_ENDPOINT), login in `pages/LoginPage.jsx` (API_BASE_URL).
-   Backend: `backend/server.js` is an optional local Express stub. The Vite frontend has no development proxy configured.

## Dev, build, deploy

-   Install: `npm install` (CI uses `npm ci`).
-   Run dev: `npm run dev` (or the equivalent `npm start` alias) starts Vite; Tailwind scans root `index.html` and `./src/**/*.{js,jsx,ts,tsx}`; dark mode is `class`.
-   Build/preview: `npm run build` emits `dist/`; use `npm run preview` to serve the production build locally.
-   Test: there is currently no automated frontend test suite or `npm test` script. The CI gate runs a clean install and production build.
-   Netlify: SPA routing via `public/_redirects`; Vite build/publish settings are in `netlify.toml`; contact submissions use Netlify Forms.

## Conventions & patterns

-   On-mount behaviors: pages often set `document.title` and call `trackVisit()` (see `HomePage.jsx`, `Projects.jsx`).
-   UX loading: enforce a minimum 500ms spinner using `Date.now()` + `setTimeout` in `finally` (see `Projects.jsx`, `Contact.jsx`).
-   Role checks: wrap with `<PrivateRoute requiredRole="user|admin">` and read `user.role` from `userData`.
-   Styling: Tailwind utilities with `dark:` variants; relies on a `class="dark"` on root/body (see `Layout.jsx`). Custom shadows in `tailwind.config.js` (`shadow-dark`).
-   Assets: Use root-relative paths to `public/` (e.g., `/images/...`, `icons/...`).

## External services & secrets

### Secret access boundary

Known secret-bearing local files are strictly out of bounds unless the user
explicitly requests access to a specific file for a specific task.

Do not open, read, search within, print, quote, summarize, copy, transform,
edit, or otherwise inspect the contents of:

- `.env`
- `.env.local`
- `.env.*.local`
- private-key or certificate files containing private material
- any other file explicitly identified as containing credentials or secrets

It is acceptable to determine that one of these files exists, whether Git
ignores/tracks it, and whether repository configuration protects it, without
reading its contents.

`.env.example` or other intentionally public placeholder files may be reviewed
when they contain placeholders rather than real credentials.

Do not access a protected secret-bearing file merely because the task is a
security audit, repository-readiness review, migration, debugging session, or
configuration review. Those tasks do not override this boundary.

### Secret handling if exposure is discovered elsewhere

If a secret is encountered unexpectedly in source code, documentation, Git
history, generated output, logs, configuration, or any other location that is
not supposed to contain secrets:

- Treat the value as potentially exposed.
- Never reproduce the value in chat or agent output.
- Never copy it into an audit report, Markdown document, code comment, issue,
  patch, log, temporary file, or other artifact.
- Never show a partial value or prefix/suffix merely to prove the finding.
- Report only safe identifying information:
  - file path;
  - line/location;
  - variable or field name;
  - provider or credential type;
  - relevant commit hash when applicable.
- Stop actions that could further propagate the value.
- Tell the user that the credential may require rotation or revocation.
- Do not rotate/revoke credentials, delete source content, rewrite Git history,
  or change external services without explicit approval.

A security audit must report the existence and location of a secret without
collecting or reproducing the secret as evidence.

### Public configuration is not a secret

Browser-facing endpoints and other values necessarily shipped to client-side
code should be treated as public configuration, not protected secrets.

AWS API Gateway endpoints used by the frontend are currently hardcoded in
project source. Their URLs are not credentials. If those endpoints are touched
during related implementation work, prefer centralizing public configuration
rather than treating endpoint URLs as secret material.

Authentication, authorization, validation, rate limiting, and backend security
must not depend on those endpoint URLs remaining unknown.

## Extend safely

-   New page: add under `src/pages/`, import and route in `App.jsx` inside the existing `Layout`.
-   Protected view: wrap element in `<PrivateRoute requiredRole="admin">`.
-   New function: `netlify/functions/<name>.js` exporting `handler(event)`; call from UI at `/.netlify/functions/<name>`.
-   Data-driven content: put JSON in `public/data/` and fetch via relative path.

## Lambda function workflow (project-specific)

-   Current active AWS Lambda source code lives in-repo under `lambda-functions/<functionName>/` (for example: `lambda-functions/showcaseRegistration/`, `lambda-functions/showcaseLogin/`).
-   Before replacing or rewriting a Lambda function, first archive the current source snapshot under `lambda-functions/archive/<functionName>/<date-or-version>/`.
-   Keep archive snapshots for rollback/reference, but keep active code in `lambda-functions/<functionName>/` so changes are versioned with the app.
-   The deployment zip artifact stored in `lambda-functions/` (for example `showcaseRegistration.zip`) is the same artifact uploaded to AWS Lambda.
-   Do not commit `node_modules` for Lambda folders. Keep only source + `package.json` + lockfile in git; zip artifacts and archive folders are ignored via `.gitignore`.
-   When deploying Lambda updates, record the current deployed Lambda version/ARN first so rollback target is always known.

### AWS config baseline export automation

-   Use `npm run export:auth-baseline` from repo root to capture a machine-readable snapshot of current AWS auth config.
-   Export output is written to `docs/dev/auth/baselines/<yyyy-mm-dd>-registration-config-exports/`.
-   Captures include DynamoDB table config, API Gateway routes/integrations/stages, Lambda config/policies, and IAM role policy snapshots (for the auth registration/verification Lambdas).
-   Lambda environment variable values and Lambda code download URLs are sanitized in exported files.

When to run:

-   Before a risky auth/Lambda rollout (pre-change baseline).
-   After deployment and smoke tests (post-change confirmation).
-   Before finalizing hardening checklist/docs evidence for a milestone.
-   During incident triage when comparing current state to last known-good baseline.

Suggested operating cadence:

-   Standard changes: run once per milestone.
-   High-risk auth changes: run both pre-deploy and post-deploy.

## Gotchas

-   Keep SPA redirect: `/* /index.html 200` in `public/_redirects`.
-   `visitTracker` performs cross-origin calls (ipify + API); never block UI—follow its try/catch and cooldown keys per-path.
-   Don’t bypass `utils/auth.js`; keep role names in sync with `constants/roles.js`.

## Key files

-   Routing/UI shell: `src/App.jsx`, `components/Layout.jsx`, `components/NavBar.jsx`
-   Auth/roles: `components/PrivateRoute.jsx`, `utils/auth.js`, `constants/roles.js`
-   Data/flows: `components/BlogEditor.jsx`, `pages/Projects.jsx`, `pages/Contact.jsx`
-   Telemetry: `utils/visitTracker.js`
-   Netlify deployment/forms: `index.html`, `pages/Contact.jsx`, `netlify.toml`, `public/_redirects`
