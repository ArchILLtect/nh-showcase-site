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
