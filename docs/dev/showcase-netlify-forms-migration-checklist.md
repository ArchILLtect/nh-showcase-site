# Showcase Site — Netlify Forms Migration Checklist

## Preconditions

- [ ] CRA → Vite migration is merged.
- [ ] Vite production/deploy preview is stable.
- [ ] Branch created from current `main`.
- [ ] Working tree clean/expected.

## Detection

- [ ] Confirm Netlify Forms availability.
- [ ] Confirm static detectable form location in Vite output.
- [ ] Add form name `contact`.
- [ ] Add matching `name`, `email`, `message` fields.
- [ ] Add Netlify-native spam/honeypot configuration.
- [ ] Build.
- [ ] Confirm static form markup survives into deployable output.

## React Form

- [ ] Add `name="contact"`.
- [ ] Add hidden `form-name`.
- [ ] Add matching honeypot field if needed.
- [ ] Replace JSON function POST with URL-encoded Netlify Forms POST.
- [ ] Preserve controlled inputs.
- [ ] Preserve loading UX.
- [ ] Preserve success UX.
- [ ] Preserve useful error handling.
- [ ] Run local validation.

## Deployed Proof

- [ ] Deploy preview.
- [ ] Confirm Netlify detects form.
- [ ] Send real submission.
- [ ] Confirm storage.
- [ ] Confirm all fields.
- [ ] Confirm success UX.
- [ ] Configure/confirm native notification.
- [ ] Confirm notification arrives.
- [ ] Confirm spam protection.
- [ ] Confirm old SendGrid path is not used.

### Hard Gate

- [ ] **Do not remove SendGrid before deployed proof passes.**

## SendGrid Removal

- [ ] Delete legacy function if unused.
- [ ] Remove `@sendgrid/mail`.
- [ ] Check `dotenv`.
- [ ] Remove `dotenv` only if unused.
- [ ] Remove tracked SendGrid/API-key/old-path references.
- [ ] Update lockfile.
- [ ] Run CI/Vite build.
- [ ] Re-test deployed form.

## Credential Retirement

- [ ] Confirm app no longer needs SendGrid.
- [ ] Remove obsolete local credential without viewing/copying it.
- [ ] Delete env file only if otherwise unnecessary.
- [ ] Revoke/delete provider-side SendGrid key.

## Final

- [ ] Search tracked repo for stale SendGrid references.
- [ ] Confirm no secret-bearing staged/tracked file.
- [ ] Open PR.
- [ ] Required CI passes.
- [ ] Merge.
