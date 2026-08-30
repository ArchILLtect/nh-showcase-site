# Showcase Site — Targeted Post-Vite Modernization Review Plan

## Purpose

Perform a narrow post-Vite cleanup before the final public-readiness audit.

The review itself is complete. The remaining work is to implement only the approved findings that materially improve repository hygiene, security/stability, or public professional presentation.

The goal remains to catch foundation-era leftovers without turning the project into a broad refactor or pre-adapting it for Plinth.

## Guiding rule

Only fix an item in this phase if it is:

1. a real security/stability problem;
2. visibly misleading or unprofessional for a public portfolio repo; or
3. cheap and clearly justified independently of Plinth.

## Current Status

**Review and approved Batch A/B/C implementation complete locally; final external validation pending.**

The Vite/Netlify production foundation is sound. Tracked backend dependencies were removed, both npm projects now audit cleanly, approved foundation residue was removed, and active public-facing guidance now reflects the Vite-era application. The Step 4 exit gate remains pending until the committed documentation batch passes required CI and its Netlify deploy preview, if applicable.

---

# Approved FIX NOW Items

## 1. Repository / backend hygiene

### Remove tracked backend dependencies

Approved action:

- change ignore coverage so nested npm dependency directories are ignored, preferably with `**/node_modules/`;
- remove tracked `backend/node_modules/**` from Git;
- preserve `backend/package.json`, `backend/package-lock.json`, and `backend/server.js`.

### Repair backend dependency tree

`backend/server.js` imports only Express. The declared `bcrypt`, `mongoose`, and `pg` dependencies are unused by the stub.

Approved action:

- remove unused `bcrypt`, `mongoose`, and `pg`;
- update Express within major version 4 to a patched compatible release;
- regenerate `backend/package-lock.json`;
- run `npm ci` and `npm audit` from `backend/`;
- require backend audit = 0 before this item is complete.

Do not redesign, expand, or migrate the backend.

---

## 2. Foundation/tooling residue

### Remove CRA web-vitals residue

Approved action:

- remove the unused `reportWebVitals()` call from `src/main.jsx`;
- delete `src/reportWebVitals.js`;
- remove the root `web-vitals` dependency;
- update the root lockfile.

### Remove unused `eslint-config-prettier`

Approved action:

- remove only `eslint-config-prettier` if implementation-time inspection still confirms it is unreferenced;
- update the root lockfile.

Do not use this as an ESLint modernization pass.

### Refresh GitHub Actions majors

Approved action:

- update `actions/checkout` and `actions/setup-node` to their current stable supported major versions at implementation time;
- preserve Node 24, npm caching, `npm ci`, the production build gate, and the existing pull-request workflow behavior.

Do not redesign CI.

### Refresh Browserslist data

Approved action:

- run the targeted Browserslist / `caniuse-lite` database updater;
- retain only the resulting targeted package/lockfile changes;
- do not turn this into broad dependency modernization.

### Remove unused Tailwind `hero-pattern`

Approved action:

- remove only the unused `hero-pattern` configuration entry;
- do not change assets or UI.

---

## 3. Active guidance and public-facing documentation

### Update `.github/copilot-instructions.md`

Correct active post-migration claims including:

- `src/App.jsx` instead of `src/App.js`;
- Vite development behavior instead of CRA;
- current Vite scripts;
- `dist/` output instead of `build/`;
- honest current no-frontend-tests state;
- removal of stale CRA proxy/Jest assumptions.

Do not broadly rewrite unrelated guidance.

### Repair the public README

Minimum content:

- project purpose;
- current stack;
- Node 24 prerequisite;
- `npm install`;
- `npm run dev`;
- `npm run build`;
- `npm run preview`;
- `dist/` deployment output;
- Netlify Forms contact flow;
- honest statement that no automated frontend test suite currently exists;
- preserve or link the useful authentication-flow explanation.

### Correct `docs/dev/github-card-implementation-plan.md`

Correct:

- stale `src/App.js` references;
- old CRA validation commands;
- `REACT_APP_*` references.

Any future browser-exposed Vite variable uses `VITE_*`, but the plan should not casually recommend embedding a GitHub token in browser code. Prefer a non-secret/public API approach or a server-side boundary if authentication becomes necessary.

---

# Explicit DEFER Items

## Frontend test suite

Defer creating Vitest / Testing Library infrastructure during this cleanup.

Future high-value candidates:

1. `Contact.jsx` submission/success/failure behavior;
2. `PrivateRoute` guest redirect and authorized rendering;
3. authentication/session helper behavior;
4. a small router/direct-route smoke test.

## ESLint repair and CI gating

Defer parser repair, rule cleanup, a lint script, and CI lint gating. Handle later as a focused tooling task.

## Route-level code splitting

Defer route-level lazy loading until performance work is justified by measured need.

## Long-term backend-stub decision

Preserve the cleaned optional Express stub for now. Do not delete, expand, or reorganize it merely for architectural tidiness.

---

# NO ACTION Items

The following are already correct or intentionally preserved:

- Vite React plugin configuration;
- root Vite `index.html`;
- Tailwind source scanning;
- PostCSS configuration;
- Netlify `npm run build`;
- Netlify `dist` publishing;
- Netlify Node 24 configuration;
- SPA redirect;
- Netlify Forms implementation;
- absence of stale Netlify Functions configuration;
- historical migration documentation when clearly historical;
- harmless root `/build` ignore rule;
- ignored/untracked local `audit-report.json`.

---

# Implementation Sequence

## Batch A — Repository/backend hygiene

**Complete.**

1. Add nested `node_modules` ignore coverage.
2. Remove tracked `backend/node_modules`.
3. Remove unused backend dependencies.
4. Patch Express within major version 4.
5. Regenerate backend lockfile.
6. Require backend `npm audit` = 0.

### Batch A checkpoint

- `backend/node_modules` is untracked/ignored;
- backend `npm ci` succeeds;
- backend `npm audit` returns zero;
- backend stub remains otherwise unchanged.

## Batch B — Foundation/tooling cleanup

**Complete.**

1. Remove CRA `reportWebVitals` residue.
2. Remove `web-vitals`.
3. Remove unused `eslint-config-prettier` if reconfirmed unused.
4. Update GitHub Actions majors.
5. Refresh Browserslist data.
6. Remove unused Tailwind `hero-pattern`.

### Batch B checkpoint

- root `npm ci`;
- root `npm audit` = 0;
- `npm run build`;
- no unexpected package churn;
- Vite/Netlify configuration remains healthy.

## Batch C — Active guidance / public-facing docs

**Complete locally; awaiting final external validation.**

1. Update `.github/copilot-instructions.md`.
2. Repair `readme.md`.
3. Correct `docs/dev/github-card-implementation-plan.md`.
4. Update Step 4 and master modernization docs with final status.

### Batch C checkpoint

- active docs no longer claim CRA is current;
- current setup/build instructions are accurate;
- no browser-exposed secret/token pattern is recommended;
- historical docs remain historical.

---

# Final Validation

## Root project

- `npm ci`
- `npm audit`
- `npm run build`

## Backend project

- `npm ci` from `backend/`
- `npm audit` from `backend/`

## Repository

- confirm no tracked `node_modules`;
- confirm no stale active CRA claims;
- confirm GitHub Actions changes validate;
- confirm Netlify Forms blueprint remains present in build output;
- confirm `dist/_redirects` remains present;
- `git diff --check`;
- CI green;
- Netlify deploy preview green if applicable.

## Exit Gate

> **No obvious foundation-era leftovers materially hurt stability, correctness, repository hygiene, or professional presentation.**

Pending required CI and Netlify deploy-preview confirmation for the completed change set.

## Explicitly Out of Scope

Do not:

- add service/repository layers;
- normalize content;
- redesign components;
- refactor auth/AWS without a concrete need;
- add Plinth adapters;
- reorganize around future CMS schemas;
- perform broad style cleanup;
- perform broad dependency modernization;
- add a frontend test suite in this phase;
- repair/adopt ESLint as a CI gate in this phase;
- implement route-level code splitting in this phase.
