# Showcase Site — Targeted Post-Vite Modernization Review Checklist

## Review Status

- [x] Complete targeted read-only post-Vite review.
- [x] Classify findings as FIX NOW / DEFER / NO ACTION.
- [x] Confirm Vite/Netlify production foundation is sound.
- [x] Confirm root `npm audit` is green at review baseline.
- [x] Identify separate backend npm dependency tree.
- [x] Complete approved FIX NOW implementation.
- [ ] Pass Step 4 exit gate.

---

# Batch A — Repository / Backend Hygiene

## Tracked dependencies

- [x] Change ignore coverage so nested `node_modules` directories are ignored.
- [x] Remove tracked `backend/node_modules/**`.
- [x] Confirm `backend/package.json`, `backend/package-lock.json`, and `backend/server.js` remain.
- [x] Confirm no `node_modules` directory remains tracked anywhere in the repo.

## Backend dependency cleanup

- [x] Reconfirm `backend/server.js` imports only Express.
- [x] Remove unused `bcrypt`.
- [x] Remove unused `mongoose`.
- [x] Remove unused `pg`.
- [x] Update Express within major version 4 to a patched compatible release.
- [x] Regenerate `backend/package-lock.json`.
- [x] Run `npm ci` from `backend/`.
- [x] Run `npm audit` from `backend/`.
- [x] Confirm backend audit reports 0 vulnerabilities.

### Batch A Checkpoint

- [x] Nested dependency directories are ignored and not tracked.
- [x] Optional backend stub still installs/runs as intended.
- [x] Backend dependency tree is clean.

---

# Batch B — Foundation / Tooling Cleanup

## CRA residue

- [x] Remove unused `reportWebVitals()` call from `src/main.jsx`.
- [x] Delete `src/reportWebVitals.js`.
- [x] Remove root `web-vitals` dependency.
- [x] Regenerate/update root lockfile.

## Unused tooling dependency

- [x] Reconfirm `eslint-config-prettier` is unreferenced.
- [x] Remove `eslint-config-prettier`.
- [x] Do not perform broader ESLint changes.

## GitHub Actions

- [x] Check current stable supported major for `actions/checkout`.
- [x] Check current stable supported major for `actions/setup-node`.
- [x] Update only those action references.
- [x] Preserve Node 24.
- [x] Preserve npm cache.
- [x] Preserve `npm ci`.
- [x] Preserve production build gate.
- [ ] Confirm required status check remains healthy.

## Browserslist

- [x] Run targeted Browserslist / `caniuse-lite` database refresh.
- [x] Review resulting package/lockfile changes.
- [x] Keep only targeted updater changes.
- [x] Confirm stale Browserslist warning is resolved or document why it remains.

## Tailwind

- [x] Remove unused `hero-pattern` entry only.
- [x] Confirm no source usage existed.
- [x] Confirm no visual/asset change results.

### Batch B Checkpoint

- [x] Run root `npm ci`.
- [x] Run root `npm audit`.
- [x] Confirm root audit reports 0 vulnerabilities.
- [x] Run `npm run build`.
- [x] Confirm Vite production output remains healthy.
- [x] Confirm Netlify Forms blueprint remains in `dist/index.html`.
- [x] Confirm `dist/_redirects` remains present.

---

# Batch C — Active Guidance / Public-Facing Documentation

## Copilot instructions

- [x] Update stale `src/App.js` references.
- [x] Remove stale CRA dev-server/proxy claims.
- [x] Document current Vite scripts.
- [x] Document `dist/` output.
- [x] Document honest current no-frontend-tests state.
- [x] Avoid unrelated instruction rewrites.

## README

- [x] Add project purpose.
- [x] Add current stack.
- [x] Document Node 24 prerequisite.
- [x] Document `npm install`.
- [x] Document `npm run dev`.
- [x] Document `npm run build`.
- [x] Document `npm run preview`.
- [x] Document `dist/` deployment output.
- [x] Document Netlify Forms contact flow.
- [x] State honestly that no automated frontend test suite currently exists.
- [x] Preserve or link existing authentication-flow documentation.

## GitHub-card plan

- [x] Update stale `src/App.js` reference.
- [x] Replace obsolete CRA validation commands.
- [x] Remove/rework `REACT_APP_GITHUB_TOKEN` recommendation.
- [x] Do not recommend a browser-exposed GitHub secret.
- [x] Use `VITE_*` terminology only for intentionally public/client-visible configuration.

### Batch C Checkpoint

- [x] Active docs/guidance accurately describe the Vite-era application.
- [x] Historical migration records remain intentionally historical.
- [x] No current documentation casually recommends client-side secret exposure.

---

# Explicitly Deferred

- [x] Defer frontend Vitest / Testing Library suite.
- [x] Record future high-value contact/auth/router tests.
- [x] Defer ESLint parser/rule repair and CI lint gate.
- [x] Defer route-level code splitting.
- [x] Defer long-term decision on optional backend stub.
- [x] Do not add architectural layers.
- [x] Do not prep for Plinth.
- [x] Do not broadly modernize dependencies.

---

# No Action / Intentionally Preserved

- [x] Vite React plugin configuration.
- [x] Root Vite `index.html`.
- [x] Tailwind source scanning.
- [x] PostCSS configuration.
- [x] Netlify `dist` publishing.
- [x] Netlify Node 24.
- [x] SPA redirect.
- [x] Netlify Forms implementation.
- [x] Historical migration documentation.
- [x] Harmless `/build` ignore rule.
- [x] Ignored/untracked local `audit-report.json`.

---

# Final Validation

## Root

- [x] `npm ci`
- [x] `npm audit`
- [x] Root audit = 0 vulnerabilities.
- [x] `npm run build`

## Backend

- [x] `npm ci` from `backend/`
- [x] `npm audit` from `backend/`
- [x] Backend audit = 0 vulnerabilities.

## Repository / deployment

- [x] No tracked `node_modules`.
- [x] No stale active CRA guidance.
- [x] GitHub Actions changes validated locally; required remote status check remains pending for the final documentation commit.
- [x] Netlify Forms blueprint still present.
- [x] `dist/_redirects` still present.
- [x] `git diff --check`.
- [ ] Required CI green.
- [ ] Netlify deploy preview green if applicable.
- [x] Update master modernization docs with the locally complete Step 4 state and pending external gates.

### Exit Gate

- [ ] **No obvious foundation-era leftovers materially hurt stability, correctness, repository hygiene, or professional presentation.**
