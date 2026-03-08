# Account Recovery Account-Scoped Playbook (Email Reuse Allowed)

Purpose: implement forgot/reset flows safely when multiple accounts may share the same email.

## Policy Context
- Registration is username-unique.
- Multiple accounts can use the same email.
- Recovery and verification must target a single account without ambiguity.

## Core Rule
Use account-scoped identity for recovery:
- Require both `username` and `email` for recovery request.
- Proceed only when both values match the same user record.

## API Contract

### POST `/forgot-password`
Request:
```json
{
  "username": "example_user",
  "email": "user@example.com"
}
```

Response (always 200):
```json
{
  "message": "If account details are valid, password reset instructions were sent."
}
```

Behavior:
- Normalize `username` (`trim`) and `email` (`trim().toLowerCase()`).
- Lookup user by `username` and compare normalized email.
- If match: issue reset token (email send wiring is a separate pending step).
- If no match: return same generic response.

### POST `/reset-password`
Request:
```json
{
  "token": "opaque_token",
  "newPassword": "NewPassword123!",
  "confirmPassword": "NewPassword123!"
}
```

Response:
- `200` success
- `400` validation failure
- `400` expired/used token (`INVALID_OR_EXPIRED_TOKEN`)

## Data/Token Requirements
- Keep `tokenVersion` on user record; increment on successful reset.
- Store only token hashes (never raw token).
- TTL: 15 minutes (as previously decided).
- Single-use reset tokens only.

## UX Requirements
- Forgot-password form requires `username` and `email` fields.
- Show generic success message regardless of match.
- Reset form remains token + new password + confirm password.

## Abuse Controls
- Rate limit by IP and by username.
- Add cooldown per `(username,email)` pair.
- Keep generic responses to reduce account-enumeration risk.

## Session Invalidation
- On successful reset:
  - Update password hash.
  - Set `passwordChangedAt`.
  - Increment `tokenVersion`.
- Existing sessions become invalid only when auth middleware/token checks enforce stale `tokenVersion` rejection (pending).

## Rollout Steps
1. Update backend endpoint validation and lookup logic to require `username + email`.
2. Update frontend forgot-password form to submit both fields.
3. Deploy with feature flag (optional) and run smoke tests.
4. Monitor reset success/failure and abuse metrics.

## Required Smoke Tests
- Reused/expired/invalid token -> `400 INVALID_OR_EXPIRED_TOKEN`.

## Exit Criteria
- Recovery remains enumeration-safe.
- Recovery always targets exactly one account.
- Email reuse policy does not create recovery ambiguity.
