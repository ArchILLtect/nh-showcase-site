# Registration P1 Email Identity Policy (Reuse Allowed)

Purpose: document the final registration identity policy now that email reuse is intentionally allowed.

## Decision Summary
- Username remains the unique account identifier.
- Multiple accounts may share the same email address.
- Email validation remains strict (format + normalization), but registration does not enforce unique email.

## Why This Policy Fits Current App Behavior
- Existing site flows and legacy data already tolerate shared emails.
- Minimizes migration risk and avoids forcing account merges.
- Preserves current UX while keeping P0 safety hardening intact.

## Security/UX Tradeoffs

### Pros
- Flexible for shared inbox scenarios.
- Lower migration friction with existing users.
- Avoids accidental lockout when old account ownership is unclear.

### Cons
- Verification/recovery flows are more complex.
- Higher abuse potential if one inbox can back multiple accounts.
- Support flows must disambiguate which account is being recovered.

## Required Guardrails (When Email Verification/Recovery Is Added)
- Make email actions account-scoped (`username + email`), not email-only.
- Require username in verification/resets where multiple accounts may match an email.
- Keep rate limits per IP and per email to reduce abuse.
- Use generic responses where needed to reduce account-enumeration risk.

## Registration Contract Under This Policy
- Success: `201` with `{"message":"User registered successfully"}`
- Duplicate username: `409` with `USERNAME_EXISTS`
- Validation error: `400` with `VALIDATION_ERROR`
- Internal error: `500` with `INTERNAL_ERROR`

No `EMAIL_EXISTS` conflict is expected under the current policy.

## Data Model Notes
- `Users` table remains keyed by `username`.
- Email is treated as a validated profile attribute, not a unique key.
- Any optional `UserEmailIndex` table is non-authoritative unless future policy changes.

## Recommendation to Execute Next
Proceed with account-scoped email verification/recovery planning and keep registration username-unique + email-reuse behavior unchanged.
