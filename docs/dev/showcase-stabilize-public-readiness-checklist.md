# Showcase Site — Stabilize / Public-Readiness Cleanup Checklist

## Step 1 — Netlify Forms Migration

- [ ] Confirm current branch.
- [ ] Confirm current HEAD.
- [ ] Confirm working tree is clean/expected.
- [ ] Confirm current contact form behavior.
- [ ] Confirm current fields.
- [ ] Keep SendGrid path intact as rollback insurance.
- [ ] Confirm Netlify Forms is enabled/available for the site.
- [ ] Add Netlify-detectable static form definition.
- [ ] Add stable form name.
- [ ] Add hidden `form-name` field.
- [ ] Add matching field names.
- [ ] Add/use Netlify-native spam protection.
- [ ] Convert active React submit path to URL-encoded Netlify Forms POST.
- [ ] Preserve controlled inputs.
- [ ] Preserve loading UX.
- [ ] Preserve success UX.
- [ ] Preserve useful error handling.
- [ ] Run local build.
- [ ] Deploy via normal Netlify workflow.
- [ ] Confirm Netlify detects the form.
- [ ] Send real test submission.
- [ ] Confirm submission is stored.
- [ ] Confirm all fields are correct.
- [ ] Confirm native notification is configured.
- [ ] Confirm notification arrives.
- [ ] Confirm spam protection is active.
- [ ] Confirm active form no longer calls SendGrid.

### Step 1 Gate
- [ ] **Netlify Forms replacement is proven before SendGrid removal.**

---

## Step 2 — Remove SendGrid

- [ ] Delete legacy SendGrid contact function if unused.
- [ ] Remove `@sendgrid/mail`.
- [ ] Check whether `dotenv` is used elsewhere.
- [ ] Remove `dotenv` only if truly unused.
- [ ] Remove tracked `SENDGRID_API_KEY` references.
- [ ] Remove stale SendGrid-specific docs/instructions.
- [ ] Search repo for `sendgrid`.
- [ ] Search repo for `SENDGRID_API_KEY`.
- [ ] Search repo for `/.netlify/functions/contact`.
- [ ] Update lockfile normally.
- [ ] Run build/tests/checks.
- [ ] Re-test deployed Netlify Forms flow.
- [ ] Confirm app no longer depends on SendGrid.
- [ ] Remove obsolete local SendGrid credential without exposing it.
- [ ] Delete local env file only if no longer needed.
- [ ] Revoke/delete obsolete SendGrid API key.

### Step 2 Gate
- [ ] **No active SendGrid dependency, code path, tracked reference, or live obsolete credential remains.**

---

## Step 3 — Re-run Security / Public-Readiness Checks

### Repository state
- [ ] `git fetch --prune`
- [ ] `git status -sb`
- [ ] Confirm expected branch.
- [ ] Confirm HEAD.
- [ ] Confirm local branch is current enough with remote.

### Tracked secret review
- [ ] Scan tracked files for credentials/secrets.
- [ ] Confirm no tracked `.env`.
- [ ] Confirm no tracked private-key material.
- [ ] Confirm no tracked SendGrid credential reference.
- [ ] Confirm protected local secret-bearing files remain ignored/untracked.
- [ ] Do not read protected secret-bearing file contents.

### Git history
- [ ] Re-check reachable history for `.env`.
- [ ] Re-check reachable history for credential material.
- [ ] Re-check reachable history for private keys.
- [ ] Inspect relevant remote branches/tags where practical.
- [ ] Clearly distinguish ignored-local vs tracked-current vs tracked-history findings.

### Dependency/config sanity
- [ ] Run appropriate dependency/security checks.
- [ ] Review concrete actionable findings.
- [ ] Avoid unrelated dependency modernization.

### Step 3 Gate
- [ ] **No confirmed security blocker remains in tracked content or reviewed history.**

---

## Step 4 — Manual Public-Repository Review

### Personal information
- [ ] Review public email/contact information.
- [ ] Review usernames/profile links.
- [ ] Confirm all personal details are intentionally public.

### Infrastructure metadata
- [ ] Review API Gateway identifiers.
- [ ] Review Lambda names.
- [ ] Review AWS account/infrastructure identifiers.
- [ ] Review deployment/baseline metadata.
- [ ] Keep public configuration that is intentionally useful.
- [ ] Remove only concrete security/privacy/operational concerns.

### Documentation
- [ ] Review `docs/`.
- [ ] Review operational notes.
- [ ] Review setup/migration notes.
- [ ] Review AI-agent instruction files.
- [ ] Remove stale/misleading/private/unsafe junk.
- [ ] Keep useful technical depth.
- [ ] Do not over-clean merely for appearance.

### Assets / licensing
- [ ] Review images.
- [ ] Review icons.
- [ ] Review fonts.
- [ ] Review screenshots.
- [ ] Review copied/third-party assets.
- [ ] Confirm redistribution rights/appropriateness.

### Public-repo hygiene
- [ ] Review README.
- [ ] Review repo setup instructions.
- [ ] Review dead links.
- [ ] Remove generated audit trash/temporary artifacts.
- [ ] Remove obviously obsolete public-facing notes/config where appropriate.

### Step 4 Gate
- [ ] **Everything remaining is intentionally acceptable for public visibility.**

---

## Step 5 — Final Publication-Readiness Verification

### Git
- [ ] `git fetch --prune`
- [ ] `git status -sb`
- [ ] Confirm expected branch.
- [ ] Confirm current HEAD.
- [ ] Confirm branch is current with remote.
- [ ] Confirm no unexpected staged/untracked files.
- [ ] Confirm no secret-bearing file is staged/tracked.

### Build/runtime
- [ ] Run normal validation.
- [ ] Confirm production build succeeds.
- [ ] Confirm deployed site works.
- [ ] Re-test contact form.
- [ ] Re-test Netlify notification.
- [ ] Re-check spam protection.
- [ ] Check major public routes.
- [ ] Check auth/private routes as appropriate.
- [ ] Check AWS-backed features as appropriate.

### Security
- [ ] Final tracked-file secret scan.
- [ ] Final history sanity check.
- [ ] Confirm obsolete SendGrid key is revoked/deleted.
- [ ] Confirm no security/audit artifact contains secret material.

### Public-review confirmation
- [ ] Personal information decision confirmed.
- [ ] Infrastructure metadata decision confirmed.
- [ ] Third-party asset/licensing review confirmed.
- [ ] Documentation review confirmed.

### Final Gate
- [ ] **Repository is deliberately judged safe and appropriate to make public.**
- [ ] Repository visibility change remains a separate explicit action.

---

# Overall Completion

- [ ] Step 1 complete — Netlify Forms migration.
- [ ] Step 2 complete — SendGrid fully removed/retired.
- [ ] Step 3 complete — security/public-readiness checks passed.
- [ ] Step 4 complete — manual public-repo review passed.
- [ ] Step 5 complete — final publication-readiness verification passed.

## Scope Guardrails

- [ ] No CRA → Vite work in this phase.
- [ ] No Plinth-specific preparation.
- [ ] No redesign.
- [ ] No broad architectural cleanup.
- [ ] No unnecessary abstractions.
- [ ] No broad dependency modernization.
- [ ] No auth/AWS refactor without concrete need.
- [ ] No history rewrite without explicit approval.
- [ ] No GitHub visibility change before final approval.

**Guiding principle:** Stabilize what is independently justified; do not pre-adapt the site for Plinth.
