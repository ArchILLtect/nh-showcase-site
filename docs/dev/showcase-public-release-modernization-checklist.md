# Showcase Site — Public-Release Modernization Checklist

## Step 0 — Repository Governance Baseline

- [x] Basic CI added.
- [x] CI install/build run is green.
- [x] `main` ruleset active.
- [x] Pull request required before merge.
- [x] Required `Build` status check enabled.
- [x] Force pushes blocked.
- [x] Branch deletion restricted.
- [x] Clean working tree before modernization branch.

---

## Step 1 — CRA → Vite Foundation Migration

- [x] Create dedicated branch: `chore/migrate-cra-to-vite`.
- [x] Inventory CRA-specific files/config/dependencies.
- [x] Confirm current runtime baseline.
- [x] Add Vite + React plugin/config.
- [x] Replace CRA HTML shell with Vite root `index.html`.
- [x] Update React entry point as required.
- [x] Replace `react-scripts` package scripts.
- [x] Resolve `%PUBLIC_URL%` usage.
- [x] Resolve CRA env references if present (none used by the frontend).
- [x] Verify public/static asset paths.
- [x] Verify Tailwind/PostCSS.
- [x] Verify local proxy/dev assumptions.
- [x] Update Netlify publish directory to `dist` where required.
- [x] Preserve SPA redirects.
- [x] Preserve Netlify Functions configuration and deployment.
- [x] Update CI for Vite and the current no-tests state.
- [x] Run local validation.
- [x] Deploy preview.
- [x] Regression-test major public routes.
- [x] Test direct-route refreshes.
- [x] Test login/register/private/admin routes as appropriate.
- [x] Test blog/static data.
- [x] Test dark mode.
- [x] Test tracking.
- [x] Test AWS calls.
- [x] Test responsive behavior.
- [x] Confirm production build.
- [x] Open PR.
- [x] Required CI passes.
- [ ] Merge Vite migration.

Contact-page rendering was verified without submitting the legacy SendGrid-backed form. Live form submission is intentionally deferred to Step 2, where Netlify Forms will be implemented and proven before SendGrid retirement.

### Step 1 Gate
- [x] **Vite foundation is stable and existing app behavior is preserved.**

---

## Step 2 — Netlify Forms Migration

- [ ] Create Netlify Forms branch from modernized `main`.
- [ ] Confirm contact form behavior/fields.
- [ ] Keep SendGrid path as rollback insurance.
- [ ] Confirm Netlify Forms availability.
- [ ] Confirm static detectable form location in Vite output.
- [ ] Add static Netlify-detectable form markup.
- [ ] Add stable form name.
- [ ] Add hidden `form-name`.
- [ ] Add matching fields.
- [ ] Add Netlify-native spam protection.
- [ ] Convert active submit path to URL-encoded Netlify Forms POST.
- [ ] Preserve controlled-input UX.
- [ ] Preserve loading UX.
- [ ] Preserve success UX.
- [ ] Preserve useful error handling.
- [ ] Run local build.
- [ ] Deploy preview.
- [ ] Confirm Netlify detects form.
- [ ] Send real test.
- [ ] Confirm submission storage.
- [ ] Confirm fields.
- [ ] Confirm notification.
- [ ] Confirm spam protection.
- [ ] Confirm old SendGrid path is not used.

### Step 2 Gate
- [ ] **Netlify Forms is proven before SendGrid removal.**

---

## Step 3 — Remove SendGrid + Retire Credential

- [ ] Delete legacy contact function if unused.
- [ ] Remove `@sendgrid/mail`.
- [ ] Check remaining `dotenv` usage.
- [ ] Remove `dotenv` only if unused.
- [ ] Remove tracked `SENDGRID_API_KEY` references.
- [ ] Remove stale SendGrid docs/instructions.
- [ ] Search for `sendgrid`.
- [ ] Search for `SENDGRID_API_KEY`.
- [ ] Search for old contact-function path.
- [ ] Update lockfile.
- [ ] Run CI/Vite build.
- [ ] Re-test deployed form.
- [ ] Remove obsolete local credential without exposing it.
- [ ] Delete env file only if otherwise unnecessary.
- [ ] Revoke/delete obsolete SendGrid key.

### Step 3 Gate
- [ ] **SendGrid is completely retired.**

---

## Step 4 — Targeted Post-Vite Modernization Review

- [ ] Review stale CRA files/dependencies.
- [ ] Review CI action-version warnings.
- [ ] Review obsolete package scripts/config.
- [ ] Review test strategy after Vite.
- [ ] Review high-severity dependency issues.
- [ ] Review docs made stale by Vite.
- [ ] Review build/deploy notes for CRA assumptions.
- [ ] Decide whether a small real smoke-test suite is worthwhile.
- [ ] Do not add architectural layers solely for neatness.
- [ ] Do not prep for Plinth.

### Step 4 Gate
- [ ] **No obvious foundation-era leftovers materially hurt stability or professional presentation.**

---

## Step 5 — Security / Public-Readiness Audit

- [ ] `git fetch --prune`
- [ ] `git status -sb`
- [ ] Confirm expected branch/HEAD.
- [ ] Scan tracked files for secrets.
- [ ] Confirm no tracked env file.
- [ ] Confirm no tracked private-key material.
- [ ] Re-check Git history for credentials.
- [ ] Review relevant remote branches/tags.
- [ ] Confirm protected local secret files ignored/untracked without reading them.
- [ ] Run dependency/config sanity checks.
- [ ] Confirm no security/audit artifact contains secret material.

### Step 5 Gate
- [ ] **No confirmed security blocker remains.**

---

## Step 6 — Manual Public-Repository Review

- [ ] Review intentional personal/contact information.
- [ ] Review AWS/API/Lambda/infrastructure metadata.
- [ ] Review docs and operational notes.
- [ ] Review AI-agent instructions.
- [ ] Review images/icons/fonts/screenshots.
- [ ] Confirm redistribution/licensing appropriateness.
- [ ] Review README/setup instructions.
- [ ] Review dead links.
- [ ] Remove stale generated/temp artifacts.
- [ ] Keep useful engineering depth.
- [ ] Avoid presentation-only over-cleaning.

### Step 6 Gate
- [ ] **Everything remaining is intentionally acceptable for public visibility.**

---

## Step 7 — Final Publication Verification

- [ ] `git fetch --prune`
- [ ] `git status -sb`
- [ ] Confirm expected branch/current HEAD.
- [ ] Confirm required CI green.
- [ ] Confirm production Vite build.
- [ ] Confirm deployed site.
- [ ] Re-test contact form.
- [ ] Re-test notification.
- [ ] Re-check spam protection.
- [ ] Check major public routes.
- [ ] Check auth/private routes.
- [ ] Check AWS-backed features.
- [ ] Final tracked-file secret scan.
- [ ] Final history sanity check.
- [ ] Confirm SendGrid key retired.
- [ ] Confirm personal-info decision.
- [ ] Confirm infrastructure decision.
- [ ] Confirm licensing/assets decision.
- [ ] Confirm docs decision.
- [ ] Explicitly judge repository ready.

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
