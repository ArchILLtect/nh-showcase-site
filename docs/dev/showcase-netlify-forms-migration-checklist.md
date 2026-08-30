# Showcase Site — Netlify Forms Migration Checklist

## Preconditions

- [x] CRA → Vite migration is merged.
- [x] Vite production/deploy preview is stable.
- [x] Branch created from current `main`.
- [x] Working tree clean/expected.

## Detection

- [x] Confirm Netlify Forms availability.
- [x] Confirm static detectable form location in Vite output.
- [x] Add form name `contact`.
- [x] Add matching `name`, `email`, `message` fields.
- [x] Add Netlify-native spam/honeypot configuration.
- [x] Build.
- [x] Confirm static form markup survives into deployable output.

## React Form

- [x] Add `name="contact"`.
- [x] Add hidden `form-name`.
- [x] Add matching honeypot field if needed.
- [x] Replace JSON function POST with URL-encoded Netlify Forms POST.
- [x] Preserve controlled inputs.
- [x] Preserve loading UX.
- [x] Preserve success UX.
- [x] Preserve useful error handling.
- [x] Run local validation.

## Deployed Proof

- [x] Deploy preview.
- [x] Confirm Netlify detects form.
- [x] Send real submission.
- [x] Confirm storage.
- [x] Confirm all fields.
- [x] Confirm success UX.
- [x] Configure/confirm native notification.
- [x] Confirm notification arrives.
- [x] Confirm spam protection.
- [x] Confirm old SendGrid path is not used.

### Hard Gate

- [x] **Do not remove SendGrid before deployed proof passes.**

## SendGrid Removal

- [x] Delete legacy function if unused.
- [x] Remove `@sendgrid/mail`.
- [x] Check `dotenv`.
- [x] Remove `dotenv` only if unused.
- [x] Remove tracked SendGrid/API-key/old-path references from active code and configuration.
- [x] Update lockfile.
- [ ] Run CI/Vite build.
- [ ] Re-test deployed form.

## Credential Retirement

- [x] Confirm app no longer needs SendGrid.
- [ ] Remove obsolete local credential without viewing/copying it.
- [ ] Delete env file only if otherwise unnecessary.
- [ ] Revoke/delete provider-side SendGrid key.

## Final

- [x] Search tracked repo for stale SendGrid references and classify intentional historical records.
- [ ] Confirm no secret-bearing staged/tracked file.
- [ ] Open PR.
- [ ] Required CI passes.
- [ ] Merge.
