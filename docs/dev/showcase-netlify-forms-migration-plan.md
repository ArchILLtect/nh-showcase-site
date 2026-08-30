# Showcase Site — Netlify Forms Migration Plan

## Purpose
Replace the current SendGrid-backed contact flow with Netlify Forms directly, while preserving the existing contact-page UX and avoiding unrelated cleanup.

This is part of the **Stabilize / Public-Readiness Cleanup** phase.

## Scope

### In scope
- Convert the React contact form to Netlify Forms.
- Preserve current loading, success, validation, and controlled-input behavior.
- Ensure Netlify can detect the React-rendered form during deploy.
- Use Netlify-native spam protection.
- Verify capture + notification on a deployed build.
- Only after verification: remove SendGrid code, dependency, config references, local credential, and revoke/delete the obsolete key.

### Out of scope
- CRA → Vite.
- Plinth preparation.
- General refactors or redesign.
- Broad dependency upgrades.
- Auth/AWS changes.
- Repository visibility changes.

## Current flow

```text
Contact.jsx
→ POST /.netlify/functions/contact
→ netlify/functions/contact.js
→ @sendgrid/mail
→ SendGrid
→ email
```

## Target flow

```text
Contact.jsx
→ URL-encoded POST to Netlify Forms
→ Netlify submission storage
→ Netlify-native notification
```

## Key Netlify constraint
Because the form is rendered by React, Netlify's build-time parser also needs a detectable static HTML form definition with matching field names. The visible React form must include a stable form name and hidden `form-name` field, and AJAX submissions must be URL-encoded rather than JSON.

No protected secret-bearing file needs to be read for this migration.

---

## Phase 1 — Baseline
- Confirm branch, HEAD, and working-tree state.
- Confirm current form fields/UX.
- Confirm SendGrid path remains untouched as rollback insurance.
- Confirm Netlify form detection is enabled.
- Choose where the hidden static Netlify form definition will live under CRA.

**Gate:** current behavior understood; no unrelated changes needed.

## Phase 2 — Add Netlify form detection
- Add hidden static form definition:
  - `name="contact"`
  - `method="POST"`
  - `data-netlify="true"` (or equivalent)
  - matching `name`, `email`, `message` fields
  - honeypot field/config if used
- Build locally and confirm success.

**Gate:** deployable output contains a Netlify-detectable form.

## Phase 3 — Convert `Contact.jsx`
- Give visible form `name="contact"`.
- Add hidden `form-name=contact`.
- Add honeypot field if configured.
- Replace JSON POST to the Netlify Function with URL-encoded POST to the site.
- Preserve spinner, success state, controlled inputs, and error handling.
- Build and regression-check locally.

**Gate:** React UX preserved; active submit path is Netlify-compatible.

## Phase 4 — Deploy and prove Netlify Forms
- Deploy via normal Netlify preview/deploy workflow.
- Confirm Netlify detects `contact`.
- Confirm spam protection/honeypot recognition.
- Submit a real test.
- Confirm:
  - submission appears in Netlify;
  - all fields are correct;
  - success UX works;
  - old SendGrid function is not called.
- Configure/confirm Netlify form notification.
- Test notification delivery.

**HARD GATE:** Do not remove SendGrid until all required deployed checks pass.

## Phase 5 — Remove legacy SendGrid path
- Delete `netlify/functions/contact.js` if nothing else uses it.
- Remove `@sendgrid/mail`.
- Check whether `dotenv` is used elsewhere; remove only if truly unused.
- Remove tracked `SENDGRID_API_KEY` references and obsolete SendGrid docs/instructions.
- Search for stale references:
  - `sendgrid`
  - `SENDGRID_API_KEY`
  - `/.netlify/functions/contact`
- Update lockfile normally.
- Run build/tests/checks.

**Gate:** no runtime or tracked-code dependency on SendGrid remains.

## Phase 6 — Retire credential
- Remove obsolete local SendGrid credential without displaying/copying it.
- Delete the env file only if it is no longer needed for anything else.
- Revoke/delete the obsolete SendGrid API key.

**Security rule:** never reproduce or preserve the credential, even partially.

## Phase 7 — Final verification
- Re-test deployed contact form.
- Confirm submission capture, notification, and spam protection.
- Confirm expected Git diff only.
- Confirm no secret-bearing files are tracked/staged.
- Create a clean checkpoint/commit when ready.
- Return to remaining public-release-readiness work.

## Guardrails
- No CRA → Vite work here.
- No Plinth-specific preparation.
- No broad cleanup.
- No unrelated dependency upgrades.
- No auth/AWS changes unless directly required.
- Keep each meaningful change reviewable and reversible until verified.
