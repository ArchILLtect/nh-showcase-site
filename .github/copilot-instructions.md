# AI coding agent guide for nh-showcase-site

React (CRA) + Tailwind frontend with Netlify Functions for server-side tasks and an optional Express stub. These are the entry points and conventions to ship fast here.

## Architecture & data flow

-   Router: `src/App.js` defines routes; `Layout` wraps pages to render `NavBar`/`Footer`.
-   Auth/roles: `PrivateRoute.jsx` gates routes using `roleHierarchy` (`constants/roles.js`) and auth helpers in `utils/auth.js` (localStorage: `authToken`, `userData`).
-   Data sources:
    -   Static JSON under `public/data/*.json` (e.g., `projects.json` via `fetch('data/projects.json')`).
    -   Netlify Function `netlify/functions/contact.js` (SendGrid email) called at `/.netlify/functions/contact`.
    -   AWS API Gateway Lambdas: blog create in `components/BlogEditor.jsx` (BLOG_API_ENDPOINT), visit logs in `utils/visitTracker.js` (VISIT_API_ENDPOINT), login in `pages/LoginPage.jsx` (API_BASE_URL).
-   Backend: `backend/server.js` is a local Express stub. CRA `proxy` points to `http://localhost:5000`.

## Dev, build, deploy

-   Run dev: `npm start` (CRA on 3000; Tailwind scans `./src/**/*.{js,jsx,ts,tsx}`; dark mode is `class`).
-   Build: `npm run build` → `build/` (checked-in snapshot exists).
-   Test: CRA/Jest scaffold only (`npm test`). Add tests near changed code when you introduce logic.
-   Netlify: SPA routing via `public/_redirects`; functions folder set by `netlify.toml` (`netlify/functions`).

## Conventions & patterns

-   On-mount behaviors: pages often set `document.title` and call `trackVisit()` (see `HomePage.jsx`, `Projects.jsx`).
-   UX loading: enforce a minimum 500ms spinner using `Date.now()` + `setTimeout` in `finally` (see `Projects.jsx`, `Contact.jsx`).
-   Role checks: wrap with `<PrivateRoute requiredRole="user|admin">` and read `user.role` from `userData`.
-   Styling: Tailwind utilities with `dark:` variants; relies on a `class="dark"` on root/body (see `Layout.jsx`). Custom shadows in `tailwind.config.js` (`shadow-dark`).
-   Assets: Use root-relative paths to `public/` (e.g., `/images/...`, `icons/...`).

## External services & secrets

-   SendGrid: `SENDGRID_API_KEY` for `contact.js` (dotenv for local). Do not commit secrets.
-   AWS Gateways: Endpoints are hardcoded in `BlogEditor.jsx`, `visitTracker.js`, and `LoginPage.jsx`. If you touch them, centralize in a config and prefer `process.env.REACT_APP_*`.

## Extend safely

-   New page: add under `src/pages/`, import and route in `App.js` inside the existing `Layout`.
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

-   Routing/UI shell: `src/App.js`, `components/Layout.jsx`, `components/NavBar.jsx`
-   Auth/roles: `components/PrivateRoute.jsx`, `utils/auth.js`, `constants/roles.js`
-   Data/flows: `components/BlogEditor.jsx`, `pages/Projects.jsx`, `pages/Contact.jsx`
-   Telemetry: `utils/visitTracker.js`
-   Serverless: `netlify/functions/contact.js`, `netlify.toml`, `public/_redirects`
