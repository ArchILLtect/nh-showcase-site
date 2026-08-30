# Kickoff Prompt — Modernize the Showcase Site Foundation (CRA → Vite)

I want to begin a focused modernization phase for my personal showcase/portfolio site.

## Project context

This repository is my personal developer showcase site. It is a production React application and is intended to represent my current development work to hiring managers, potential clients, collaborators, and other developers.

The site is currently built on:

- React
- Create React App (CRA) / `react-scripts`
- Tailwind CSS
- React Router
- Netlify hosting
- Netlify Functions for some server-side behavior
- AWS API Gateway/Lambda integrations for some application features
- an optional local Express stub for development

Create React App is now deprecated, and I do not want a deprecated build foundation to remain underneath my primary developer showcase.

I want to migrate the application from CRA to Vite while preserving the existing application behavior as much as practical.

This is a foundation migration, not a redesign or broad refactor.

---

## Current larger project context

I am separately completing a public-release-readiness cleanup for this repository before making it public on GitHub.

That work includes:

- migrating the contact flow away from SendGrid to a Netlify-native approach;
- removing the no-longer-needed SendGrid dependency/credential;
- rechecking repository/public-release readiness.

Do not automatically absorb that work into this modernization phase unless something directly affects the CRA → Vite migration.

TreeMark landing-page work will also be added to this showcase site later, but not until the foundation migration is complete and verified.

Desired order:

```text
public-readiness cleanup
→ CRA → Vite foundation migration
→ verify production stability
→ TreeMark landing-page work
```

---

## Primary goal

Migrate the existing showcase site from Create React App to Vite without unnecessarily rewriting the application.

Target conceptual change:

```text
React + CRA + Tailwind + React Router + Netlify
                    ↓
React + Vite + Tailwind + React Router + Netlify
```

The existing React components, routes, styles, application logic, auth behavior, AWS integrations, and Netlify behavior should remain intact unless a change is actually required for Vite compatibility.

---

## Scope discipline

For this phase, do not bundle unrelated modernization work into the CRA → Vite migration.

Do not automatically combine this with:

- a React major-version upgrade;
- React Router modernization;
- Tailwind major-version migration;
- auth refactoring;
- AWS architecture changes;
- redesign/UI cleanup;
- general dependency upgrades;
- codebase-wide cleanup;
- TreeMark page implementation;
- unrelated accessibility changes;
- unrelated test rewrites.

If one of those becomes technically necessary to complete the Vite migration correctly, surface it explicitly before proceeding. Otherwise, record it as follow-up work.

Goal:

```text
current app works
→ replace CRA tooling with Vite
→ prove current app still works
→ checkpoint/commit
→ consider other modernization separately
```

---

## Security boundary

This repository has explicit agent instructions regarding secrets.

Do not open, read, print, quote, summarize, inspect, or otherwise access protected secret-bearing files such as:

- `.env`
- `.env.local`
- `.env.*.local`
- private-key/certificate files
- other known credential stores

The presence or Git status of such files may be checked without reading their contents.

If a secret is unexpectedly encountered somewhere that should not contain one:

- do not reproduce it;
- do not copy it into chat, reports, logs, patches, comments, or files;
- identify only safe metadata such as file path, variable name, provider/type, and commit/location where relevant;
- treat it as potentially exposed and tell me.

Do not perform credential rotation, history rewriting, repository visibility changes, or other destructive/external actions without explicit approval.

---

## Repository grounding

Before relying on repository state:

1. Confirm the current branch.
2. Confirm the current HEAD commit.
3. Check Git status.
4. Confirm the local checkout is current enough with its configured remote to perform the migration safely.

Do not rely on stale workspace/session metadata.

The checked-out repository and Git history are the source of truth.

---

## First task: inspection and migration planning only

Do not implement anything yet.

Start by inspecting the repository and producing a migration assessment.

Identify exactly what in this project depends on CRA behavior and what must change for Vite.

Inspect, where relevant:

- `package.json` and `react-scripts`;
- npm scripts;
- current React entry point;
- `public/index.html`;
- `public/` asset usage;
- Tailwind configuration;
- PostCSS configuration;
- React Router setup;
- environment-variable usage;
- `process.env.REACT_APP_*` usage;
- `%PUBLIC_URL%` usage;
- Webpack/CRA-specific assumptions;
- SVG/import behavior;
- service-worker/reportWebVitals remnants if present;
- CRA/Jest testing assumptions;
- the CRA `proxy` configuration;
- the optional Express development stub;
- Netlify build configuration;
- Netlify Functions;
- SPA redirects;
- build output assumptions (`build/` vs Vite `dist/`);
- hardcoded paths that could behave differently under Vite;
- dependencies that may currently be supplied indirectly by CRA/react-scripts;
- deployment assumptions that could be affected by the migration.

Do not inspect protected secret-bearing files to evaluate environment variables. Inspect source references and variable names only.

---

## Expected migration shape

I expect the likely migration to include some variation of:

- remove `react-scripts`;
- add `vite`;
- add `@vitejs/plugin-react`;
- add/update `vite.config.*`;
- move/replace CRA `public/index.html` with Vite root `index.html`;
- update the React application entry point as needed;
- replace CRA scripts with Vite equivalents;
- migrate `process.env.REACT_APP_*` references to Vite-compatible configuration where needed;
- preserve or correct public asset paths;
- verify Tailwind/PostCSS integration;
- account for local proxy behavior if still required;
- change Netlify publish output from `build/` to `dist/`;
- preserve SPA fallback routing;
- preserve Netlify Functions behavior;
- verify all runtime integrations.

Do not assume every item above is required. Confirm against the actual repository.

---

## Validation expectations

This is a production showcase site, so success is not merely “Vite starts.”

The migration must eventually verify major existing behaviors, including where applicable:

- home page;
- projects;
- contact page;
- routing and direct-route refreshes;
- login/register;
- authenticated/private routes;
- admin functionality;
- blog functionality;
- static JSON/data loading;
- dark mode;
- visit tracking;
- AWS API calls;
- Netlify Functions;
- responsive layout;
- production build;
- Netlify preview deployment;
- production deployment behavior.

Use the repository’s existing validation tooling where available.

Do not weaken validation simply to make the migration pass.

---

## Git/workflow expectations

I prefer deliberate, reviewable implementation.

For this migration:

- recommend an appropriate branch or worktree strategy;
- use a checkpoint before substantial migration edits;
- keep changes narrowly scoped;
- make changes incrementally;
- validate as we go;
- do not commit or push unless I explicitly ask;
- do not deploy until I explicitly approve it;
- do not rewrite Git history.

I want to review meaningful changes before they are treated as complete.

---

## Deliverable for this first response

For the first response, give me:

1. Current-state assessment
   - what is CRA-specific;
   - what looks straightforward;
   - what looks potentially risky.

2. Exact migration surface
   - files/configuration likely to change;
   - CRA assumptions that must be removed or adapted.

3. Proposed phased implementation plan
   - small, reviewable steps;
   - validation checkpoint after each meaningful step.

4. Regression checklist
   - what must be proven before we call the migration successful.

5. Risks / unknowns
   - anything that could make the migration more complex than expected.

6. Estimated time to completion
   - best case;
   - realistic case;
   - worst reasonable case based on the actual repository.

7. Recommended first implementation step
   - but do not execute it yet.

Keep the migration focused on CRA → Vite foundation modernization.

Do not modify files until I review and approve the plan.
