# Showcase Site — Targeted Post-Vite Modernization Review Checklist

## Review Status

- [x] Complete targeted read-only post-Vite review.
- [x] Classify findings as FIX NOW / DEFER / NO ACTION.
- [x] Confirm Vite/Netlify production foundation is sound.
- [x] Confirm root `npm audit` is green at review baseline.
- [x] Identify separate backend npm dependency tree.
- [ ] Complete approved FIX NOW implementation.
- [ ] Pass Step 4 exit gate.

---

# Batch A — Repository / Backend Hygiene

## Tracked dependencies

- [ ] Change ignore coverage so nested `node_modules` directories are ignored.
- [ ] Remove tracked `backend/node_modules/**`.
- [ ] Confirm `backend/package.json`, `backend/package-lock.json`, and `backend/server.js` remain.
- [ ] Confirm no `node_modules` directory remains tracked anywhere in the repo.

## Backend dependency cleanup

- [ ] Reconfirm `backend/server.js` imports only Express.
- [ ] Remove unused `bcrypt`.
- [ ] Remove unused `mongoose`.
- [ ] Remove unused `pg`.
- [ ] Update Express within major version 4 to a patched compatible release.
- [ ] Regenerate `backend/package-lock.json`.
- [ ] Run `npm ci` from `backend/`.
- [ ] Run `npm audit` from `backend/`.
- [ ] Confirm backend audit reports 0 vulnerabilities.

### Batch A Checkpoint

- [ ] Nested dependency directories are ignored and not tracked.
- [ ] Optional backend stub still installs/runs as intended.
- [ ] Backend dependency tree is clean.

---

# Batch B — Foundation / Tooling Cleanup

## CRA residue

- [ ] Remove unused `reportWebVitals()` call from `src/main.jsx`.
- [ ] Delete `src/reportWebVitals.js`.
- [ ] Remove root `web-vitals` dependency.
- [ ] Regenerate/update root lockfile.

## Unused tooling dependency

- [ ] Reconfirm `eslint-config-prettier` is unreferenced.
- [ ] Remove `eslint-config-prettier`.
- [ ] Do not perform broader ESLint changes.

## GitHub Actions

- [ ] Check current stable supported major for `actions/checkout`.
- [ ] Check current stable supported major for `actions/setup-node`.
- [ ] Update only those action references.
- [ ] Preserve Node 24.
- [ ] Preserve npm cache.
- [ ] Preserve `npm ci`.
- [ ] Preserve production build gate.
- [ ] Confirm required status check remains healthy.

## Browserslist

- [ ] Run targeted Browserslist / `caniuse-lite` database refresh.
- [ ] Review resulting package/lockfile changes.
- [ ] Keep only targeted updater changes.
- [ ] Confirm stale Browserslist warning is resolved or document why it remains.

## Tailwind

- [ ] Remove unused `hero-pattern` entry only.
- [ ] Confirm no source usage existed.
- [ ] Confirm no visual/asset change results.

### Batch B Checkpoint

- [ ] Run root `npm ci`.
- [ ] Run root `npm audit`.
- [ ] Confirm root audit reports 0 vulnerabilities.
- [ ] Run `npm run build`.
- [ ] Confirm Vite production output remains healthy.
- [ ] Confirm Netlify Forms blueprint remains in `dist/index.html`.
- [ ] Confirm `dist/_redirects` remains present.

---

# Batch C — Active Guidance / Public-Facing Documentation

## Copilot instructions

- [ ] Update stale `src/App.js` references.
- [ ] Remove stale CRA dev-server/proxy claims.
- [ ] Document current Vite scripts.
- [ ] Document `dist/` output.
- [ ] Document honest current no-frontend-tests state.
- [ ] Avoid unrelated instruction rewrites.

## README

- [ ] Add project purpose.
- [ ] Add current stack.
- [ ] Document Node 24 prerequisite.
- [ ] Document `npm install`.
- [ ] Document `npm run dev`.
- [ ] Document `npm run build`.
- [ ] Document `npm run preview`.
- [ ] Document `dist/` deployment output.
- [ ] Document Netlify Forms contact flow.
- [ ] State honestly that no automated frontend test suite currently exists.
- [ ] Preserve or link existing authentication-flow documentation.

## GitHub-card plan

- [ ] Update stale `src/App.js` reference.
- [ ] Replace obsolete CRA validation commands.
- [ ] Remove/rework `REACT_APP_GITHUB_TOKEN` recommendation.
- [ ] Do not recommend a browser-exposed GitHub secret.
- [ ] Use `VITE_*` terminology only for intentionally public/client-visible configuration.

### Batch C Checkpoint

- [ ] Active docs/guidance accurately describe the Vite-era application.
- [ ] Historical migration records remain intentionally historical.
- [ ] No current documentation casually recommends client-side secret exposure.

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

- [ ] `npm ci`
- [ ] `npm audit`
- [ ] Root audit = 0 vulnerabilities.
- [ ] `npm run build`

## Backend

- [ ] `npm ci` from `backend/`
- [ ] `npm audit` from `backend/`
- [ ] Backend audit = 0 vulnerabilities.

## Repository / deployment

- [ ] No tracked `node_modules`.
- [ ] No stale active CRA guidance.
- [ ] GitHub Actions changes validated.
- [ ] Netlify Forms blueprint still present.
- [ ] `dist/_redirects` still present.
- [ ] `git diff --check`.
- [ ] Required CI green.
- [ ] Netlify deploy preview green if applicable.
- [ ] Update master modernization docs with Step 4 completion.

### Exit Gate

- [ ] **No obvious foundation-era leftovers materially hurt stability, correctness, repository hygiene, or professional presentation.**
