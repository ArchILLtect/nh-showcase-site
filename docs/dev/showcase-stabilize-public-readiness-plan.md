# Showcase Site — Stabilize / Public-Readiness Cleanup Plan

## Purpose

Complete the remaining stabilization and public-release-readiness work for the Showcase Site before the separate CRA → Vite modernization phase.

This plan intentionally stops short of:
- modernizing the app architecture for Plinth;
- broad refactoring;
- redesign;
- CRA → Vite migration;
- unrelated dependency upgrades;
- repository visibility changes before all readiness gates pass.

The goal is to make the existing site **safe, stable, and deliberately reviewable as a public repository**, while preserving its current architecture as a realistic future Plinth migration baseline.

---

# Step 1 — Migrate Contact Flow to Netlify Forms

## Goal

Replace the current SendGrid-backed contact submission flow with Netlify Forms directly.

## Current flow

```text
Contact.jsx
→ /.netlify/functions/contact
→ SendGrid
→ email
```

## Target flow

```text
Contact.jsx
→ Netlify Forms
→ Netlify submission storage
→ Netlify-native notification
```

## Work

- Confirm branch, HEAD, and working-tree state.
- Confirm current contact form behavior and fields.
- Keep the existing SendGrid path intact as rollback insurance.
- Add Netlify-detectable form markup for the React/CRA build.
- Convert the React form submission to Netlify-compatible URL-encoded POST.
- Preserve the current UX:
  - controlled inputs;
  - loading state/spinner;
  - success state;
  - useful error handling.
- Enable/use Netlify-native spam protection.
- Deploy through the normal Netlify workflow.
- Confirm Netlify detects the form.
- Send a real test submission.
- Confirm:
  - correct field capture;
  - Netlify submission storage;
  - native notification delivery;
  - spam protection;
  - old SendGrid function is no longer used by the active form.

## Hard gate

Do not remove SendGrid until the deployed Netlify Forms replacement is proven.

## Detailed sub-plan

Use the separate:
- `showcase-netlify-forms-migration-plan.md`
- `showcase-netlify-forms-migration-checklist.md`

for the detailed implementation path.

---

# Step 2 — Remove the Legacy SendGrid Integration

## Goal

Remove the now-obsolete provider-specific contact backend and retire its credential.

## Work

- Delete the legacy contact Netlify Function if nothing else uses it.
- Remove `@sendgrid/mail`.
- Check whether `dotenv` has any legitimate remaining use.
- Remove `dotenv` only if it is truly unused.
- Remove tracked references to:
  - SendGrid;
  - `SENDGRID_API_KEY`;
  - the old `/.netlify/functions/contact` path.
- Update package lockfile normally.
- Run project build/tests/checks.
- Confirm deployed contact flow still works after cleanup.
- Remove the obsolete local SendGrid credential without displaying or copying it.
- Delete the local secret-bearing env file only if it is no longer needed for anything else.
- Revoke/delete the obsolete SendGrid API key at the provider.

## Security handling

Never preserve the credential itself, even partially, in:
- reports;
- chat;
- logs;
- comments;
- screenshots;
- documentation;
- patches.

## Exit gate

- Netlify Forms is the only active contact path.
- No runtime dependency on SendGrid remains.
- No tracked SendGrid credential references remain.
- The obsolete credential has been retired.

---

# Step 3 — Re-run Security / Public-Readiness Checks

## Goal

Verify that current tracked content and reachable history are free of secret exposure and other concrete blockers.

## Work

### Repository state

- Confirm current branch.
- Confirm HEAD.
- Run/follow equivalent of:
  - `git fetch --prune`
  - `git status -sb`
- Confirm expected working-tree state.

### Secret review

- Scan tracked files for likely secrets/credentials.
- Search for:
  - `SENDGRID_API_KEY`;
  - `sendgrid`;
  - private-key material;
  - credential-like config;
  - accidentally tracked env files.
- Confirm secret-bearing local files are ignored and untracked.
- Do not inspect protected secret-bearing file contents.

### History review

- Re-check reachable Git history for:
  - historical `.env` tracking;
  - removed credentials;
  - private keys;
  - secret-bearing configuration.
- Inspect remote branches/tags where practical and relevant.
- Distinguish clearly between:
  - local ignored secrets;
  - tracked current content;
  - historical tracked exposure.

### Dependency/config sanity

- Run appropriate dependency/security checks.
- Review only concrete actionable findings.
- Do not bundle broad upgrades into this phase unless required for safety.

## Exit gate

No confirmed secret or security blocker remains in tracked content or reviewed reachable history.

---

# Step 4 — Manual Public-Repository Review

## Goal

Review information that may be safe technically but undesirable, unnecessary, or legally questionable to expose publicly.

## Review areas

### Personal / contact information

- Confirm all personal contact details are intentionally public.
- Confirm usernames, emails, profile links, and portfolio metadata are intentional.
- Remove only information that should not be public.

### Infrastructure metadata

Review documented:
- API Gateway identifiers;
- Lambda names;
- AWS account/infrastructure identifiers;
- deployment notes;
- rollout/baseline files.

Decision rule:
- public configuration is not automatically secret;
- retain useful engineering documentation where it demonstrates technical depth;
- remove only details that create a concrete security/privacy/operational concern.

### Documentation

Review:
- `docs/`;
- operational notes;
- migration notes;
- old setup instructions;
- AI-agent instructions;
- historical technical records.

Keep useful engineering depth.
Remove:
- stale;
- misleading;
- private;
- obsolete;
- unsafe;
- embarrassing generated junk.

Do **not** over-clean merely for presentation.

### Assets / licensing / redistribution

Review:
- images;
- icons;
- fonts;
- screenshots;
- copied code/assets;
- third-party media.

Confirm that making the repo public does not accidentally redistribute material that should only be used on the deployed site or under restricted terms.

### Public-repo hygiene

Review:
- README;
- repo description;
- setup instructions;
- dead links;
- obviously obsolete scripts/config;
- generated audit artifacts;
- temporary notes/files.

Avoid broad refactoring.

## Exit gate

Everything remaining in the repository is intentionally acceptable for public visibility.

---

# Step 5 — Final Publication-Readiness Verification

## Goal

Perform one final, deliberate pre-publication pass before changing GitHub visibility.

## Final checks

### Git state

- `git fetch --prune`
- `git status -sb`
- Confirm expected branch.
- Confirm current HEAD.
- Confirm local branch is current with remote.
- Confirm no unexpected untracked/staged files.
- Confirm no secret-bearing file is staged/tracked.

### Build/runtime

- Run normal project validation.
- Confirm production build succeeds.
- Confirm deployed site works.
- Re-test:
  - contact form;
  - Netlify notification;
  - spam protection;
  - major public routes;
  - auth/private areas as appropriate;
  - AWS-backed features as appropriate.

### Security

- Final tracked-file secret scan.
- Final history sanity check.
- Confirm obsolete SendGrid credential has been revoked/deleted.
- Confirm no security report contains secret material.

### Public-review items

- Confirm personal info is intentional.
- Confirm infrastructure metadata decisions are intentional.
- Confirm third-party assets are acceptable for public redistribution.
- Confirm docs are acceptable as-is.

### Final decision

Only after all gates pass:
- decide whether to change the GitHub repository from private to public.

Repository visibility change is a separate explicit action and should not happen automatically.

---

# Overall Completion Criteria

The Stabilize / Public-Readiness Cleanup is complete when:

- Netlify Forms replaces SendGrid successfully.
- SendGrid code, dependency, and obsolete credential are removed.
- No confirmed tracked/historical secret exposure remains.
- Personal/infrastructure/documentation/asset review is complete.
- Build and deployed behavior are healthy.
- Git state is clean and current.
- The repository is deliberately judged safe and appropriate for public visibility.

---

# Scope Guardrails for the Entire Cleanup

Do not use this phase to:
- migrate CRA → Vite;
- prepare architecture for Plinth;
- redesign the site;
- introduce unnecessary abstractions;
- normalize content for future migration;
- broadly modernize dependencies;
- refactor auth/AWS without a concrete reason;
- rewrite Git history unless a confirmed historical secret requires an explicitly approved remediation;
- change repository visibility before final approval.

## Guiding principle

**Stabilize what is independently justified; do not pre-adapt the site for Plinth.**
