# Showcase Site — Netlify Forms Migration Checklist

## 1. Baseline
- [ ] Confirm current branch.
- [ ] Confirm current HEAD.
- [ ] Confirm working tree is clean/expected.
- [ ] Confirm current form fields and UX.
- [ ] Keep SendGrid path untouched as rollback insurance.
- [ ] Confirm Netlify Forms/form detection is enabled.
- [ ] Choose hidden static-form location for CRA/React detection.

## 2. Netlify Detection
- [ ] Add hidden static form definition.
- [ ] Use `name="contact"`.
- [ ] Add `method="POST"`.
- [ ] Add `data-netlify="true"` or equivalent.
- [ ] Add matching `name`, `email`, `message` fields.
- [ ] Add honeypot field/config if used.
- [ ] Run local build.
- [ ] Confirm build succeeds.
- [ ] Confirm form definition survives into deployable output.

## 3. React Form Conversion
- [ ] Add `name="contact"` to visible form.
- [ ] Add hidden `form-name` input.
- [ ] Add matching honeypot field if configured.
- [ ] Replace JSON function POST with URL-encoded Netlify Forms POST.
- [ ] Remove `/.netlify/functions/contact` from the active submit path.
- [ ] Preserve controlled inputs.
- [ ] Preserve loading spinner/state.
- [ ] Preserve inline success state.
- [ ] Preserve useful error handling.
- [ ] Run local build.
- [ ] Confirm no new browser/build errors.

## 4. Netlify Preview Verification
- [ ] Deploy via normal Netlify workflow.
- [ ] Confirm Netlify detects `contact`.
- [ ] Confirm spam protection/honeypot is recognized.
- [ ] Send a real test submission.
- [ ] Confirm submission appears in Netlify Forms.
- [ ] Confirm name/email/message fields are correct.
- [ ] Confirm page success UX.
- [ ] Confirm old SendGrid function is not called.
- [ ] Configure/confirm native Netlify notification.
- [ ] Confirm notification arrives.

### Hard Gate
- [ ] **Do not remove SendGrid until every required deployed check above passes.**

## 5. Remove SendGrid
- [ ] Delete legacy `netlify/functions/contact.js` if unused.
- [ ] Remove `@sendgrid/mail`.
- [ ] Check whether `dotenv` is used elsewhere.
- [ ] Remove `dotenv` only if truly unused.
- [ ] Remove tracked `SENDGRID_API_KEY` references.
- [ ] Remove obsolete SendGrid-specific docs/instructions.
- [ ] Search repo for `sendgrid`.
- [ ] Search repo for `SENDGRID_API_KEY`.
- [ ] Search repo for `/.netlify/functions/contact`.
- [ ] Update lockfile normally.
- [ ] Run build/tests/checks.

## 6. Retire Credential
- [ ] Confirm app no longer depends on SendGrid.
- [ ] Remove obsolete local credential without displaying/copying it.
- [ ] Delete local env file only if no longer needed.
- [ ] Revoke/delete obsolete SendGrid API key.
- [ ] Do not preserve any secret prefix/suffix/value in notes or reports.

## 7. Final Verification
- [ ] Re-test deployed contact form.
- [ ] Confirm Netlify submission capture.
- [ ] Confirm Netlify notification.
- [ ] Confirm spam protection.
- [ ] Confirm no active SendGrid code path remains.
- [ ] Confirm expected Git diff only.
- [ ] Confirm no secret-bearing file is tracked/staged.
- [ ] Commit/checkpoint when satisfied.
- [ ] Return to remaining public-release-readiness checks.

## Scope Guardrails
- [ ] No CRA → Vite work.
- [ ] No Plinth-specific preparation.
- [ ] No broad architecture cleanup.
- [ ] No unrelated dependency upgrades.
- [ ] No auth/AWS changes unless directly required.
- [ ] No repository visibility change in this task.
