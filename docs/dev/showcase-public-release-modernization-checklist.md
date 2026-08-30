# Showcase Site — Public-Release Modernization Checklist

## Step 0 — Repository Governance Baseline

- [x] Governance / CI baseline complete.

---

## Step 1 — CRA → Vite Foundation Migration

- [x] CRA → Vite migration complete.
- [x] CI/build/deploy validation complete.
- [x] Migration PR merged.
- [x] Vite live in production.

### Step 1 Gate
- [x] **Vite foundation is stable and existing app behavior is preserved.**

---

## Step 2 — Netlify Forms Migration

- [x] Netlify Forms implementation complete.
- [x] Deploy proof complete.
- [x] Native notification complete.
- [x] Legacy Function confirmed unused.

### Step 2 Gate
- [x] **Netlify Forms is proven before SendGrid removal.**

---

## Step 3 — Remove SendGrid + Retire Credential

- [x] Delete legacy contact Function.
- [x] Remove `@sendgrid/mail`.
- [x] Remove unused root `dotenv`.
- [x] Remove stale active SendGrid guidance.
- [x] Update lockfile.
- [x] Root audit/build/CI green.
- [x] Re-test deployed Netlify Form.
- [x] Remove obsolete local SendGrid credential without exposing it.
- [x] Delete provider-side SendGrid API key.
- [x] Confirm no active SendGrid runtime path remains.

### Step 3 Gate
- [x] **SendGrid is completely retired.**

---

## Step 4 — Targeted Post-Vite Modernization Review

### Review
- [x] Complete stale CRA/dependency review.
- [x] Review CI action versions.
- [x] Review test strategy.
- [x] Review root and backend dependency/security state.
- [x] Review docs/public presentation.
- [x] Review build warnings.
- [x] Classify FIX NOW / DEFER / NO ACTION.
- [x] Preserve no-Plinth-prep scope.

### Batch A — Repository / Backend Hygiene
- [ ] Ignore nested `node_modules`.
- [ ] Remove tracked `backend/node_modules`.
- [ ] Remove unused backend `bcrypt`.
- [ ] Remove unused backend `mongoose`.
- [ ] Remove unused backend `pg`.
- [ ] Patch Express within major version 4.
- [ ] Regenerate backend lockfile.
- [ ] Backend `npm ci`.
- [ ] Backend `npm audit` = 0.
- [ ] Confirm no tracked `node_modules`.

### Batch B — Foundation / Tooling Cleanup
- [ ] Remove `reportWebVitals()` call.
- [ ] Delete `src/reportWebVitals.js`.
- [ ] Remove `web-vitals`.
- [ ] Reconfirm/remove unused `eslint-config-prettier`.
- [ ] Update `actions/checkout` to current stable supported major.
- [ ] Update `actions/setup-node` to current stable supported major.
- [ ] Preserve Node 24 / npm cache / `npm ci` / build gate.
- [ ] Refresh Browserslist data.
- [ ] Remove unused Tailwind `hero-pattern`.
- [ ] Root `npm ci`.
- [ ] Root `npm audit` = 0.
- [ ] `npm run build`.

### Batch C — Active Guidance / Public Presentation
- [ ] Update `.github/copilot-instructions.md` to current Vite-era behavior.
- [ ] Repair public README.
- [ ] Correct GitHub-card implementation plan.
- [ ] Remove unsafe/stale browser-token recommendation.
- [ ] Preserve useful historical documentation.

### Explicitly Deferred
- [x] Frontend Vitest / Testing Library suite.
- [x] ESLint parser/rule repair and CI lint gate.
- [x] Route-level code splitting.
- [x] Long-term backend-stub decision.
- [x] No architectural layering for neatness.
- [x] No Plinth preparation.
- [x] No broad dependency modernization.

### Step 4 Final Validation
- [ ] Root `npm ci`.
- [ ] Root `npm audit` = 0.
- [ ] Root `npm run build`.
- [ ] Backend `npm ci`.
- [ ] Backend `npm audit` = 0.
- [ ] No tracked `node_modules`.
- [ ] Netlify Forms blueprint still present.
- [ ] `dist/_redirects` still present.
- [ ] `git diff --check`.
- [ ] Required CI green.
- [ ] Netlify deploy preview green if applicable.
- [ ] Update Step 4 docs with completion state.

### Step 4 Gate
- [ ] **No obvious foundation-era leftovers materially hurt stability, correctness, repository hygiene, or professional presentation.**

---

## Step 5 — Security / Public-Readiness Audit

- [ ] Git baseline.
- [ ] Scan tracked files for secrets.
- [ ] Confirm no tracked env/private-key material.
- [ ] Re-check Git history for credentials.
- [ ] Review relevant remote branches/tags.
- [ ] Confirm protected local secret files ignored/untracked without reading them.
- [ ] Run dependency/config sanity checks across all npm projects.
- [ ] Confirm no security/audit artifact contains secret material.

### Step 5 Gate
- [ ] **No confirmed security blocker remains.**

---

## Step 6 — Manual Public-Repository Review

- [ ] Personal/contact information.
- [ ] Infrastructure metadata.
- [ ] Docs/agent instructions.
- [ ] Assets/licensing.
- [ ] README/setup/dead links.
- [ ] Generated/temp artifacts.

### Step 6 Gate
- [ ] **Everything remaining is intentionally acceptable for public visibility.**

---

## Step 7 — Final Publication Verification

- [ ] Git baseline/current HEAD.
- [ ] Required CI green.
- [ ] Production Vite build/deploy.
- [ ] Contact form + notification + spam protection.
- [ ] Major/auth/private/AWS-backed functionality.
- [ ] Final tracked-file/history secret sanity.
- [ ] Confirm SendGrid key remains retired.
- [ ] Confirm public-review decisions.

### Step 7 Gate
- [ ] **Repository is safe and appropriate to make public.**

---

## Step 8 — Visibility Change

- [ ] Change GitHub repository visibility from private to public manually.

---

## Step 9 — Post-Public Work

- [ ] Proceed with TreeMark landing page when ready.
- [ ] Evaluate additional modernization independently.
- [ ] Preserve site as a realistic future Plinth migration baseline.
