# Account Recovery Implementation Checklist

Use this as the execution checklist for password reset/account recovery rollout.

Marker legend:
- `[YOU]` = Action that typically requires your AWS/infra/domain/production access.

## Planning
- [x] Confirm recovery entry point (`username`, `email`, or both).
	- Locked: `username + email` (account-scoped recovery with email reuse allowed).
	- Definition details:
		- Accepted input(s): `<username and email>`
		- Normalization rules: `<username trim, email trim+lowercase>`
		- Handling for unknown email: `<same generic response>`
- [x] Define reset token TTL (recommended: 15–30 minutes).
	- Locked: `15 minutes`.
	- Definition details:
		- TTL value: `<15 minutes>`
		- Re-request cooldown: `<e.g., 60s>`
		- Max requests per window: `<e.g., 3/hour/account, 5/15min/IP>`
- [x] Document/confirm existing policy is reused for reset.
	- Locked: same backend policy as registration (`min 8`, upper/lower/number).
	- Definition details:
		- Minimum length: `<8>`
		- Complexity requirements: `<uppercase + lowercase + number>`
		- Reuse restrictions: `<not yet enforced>`
		- Validation error contract (code/message): `<VALIDATION_ERROR + explicit message>`
		- Backend is source of truth: `<confirmed yes>`
- [x] Confirm success/failure UX copy (generic forgot-password response).
	- Locked generic response: `If an account exists, password reset instructions were sent.`
	- Definition details:
		- Response status for forgot-password: `<always 200>`
		- UI success banner text: `<...>`
		- Error copy for rate-limit/temporary failure: `<...>`
- [x] Define session invalidation strategy (`tokenVersion` recommended).
	- Locked: increment `tokenVersion` on password reset and reject stale token versions.
	- Definition details:
		- When `tokenVersion` increments: `<on successful password reset>`
		- Where version is checked: `<auth middleware/API gateway/lambda>`
		- Behavior for stale tokens: `<force re-login / 401>`
		- Cross-device logout behavior: `<all active sessions invalidated>`

## Backend
- [x] Create/deploy Lambda functions for forgot/reset handlers.
	- Created/deployed: `showcaseForgotPassword`, `showcaseResetPassword` (non-stub).
- [x] Create API Gateway routes for reset endpoints.
	- Created: `POST /forgot-password`, `POST /reset-password` on `ShowcaseRegisterAPI`.
- [x] Attach API Gateway integrations for reset endpoints.
	- Attached Lambda integrations for both new routes.
- [x] Configure IAM permissions and environment variables/secrets for recovery flows.
	- Configured env vars on both Lambdas (`USERS_TABLE_NAME`, `RESET_TOKENS_TABLE_NAME`, `RESET_TOKEN_TTL_MINUTES`, `TOKEN_HASH_PEPPER`, `RETURN_RESET_TOKEN_FOR_TESTING`).
	- IAM validated for current flow (`GetItem`/`PutItem` on forgot path, `GetItem`/`UpdateItem` on reset path).
- [x] Add `POST /forgot-password` endpoint.
	- Implemented behavior: account-scoped lookup (`username + email`) + enumeration-safe generic `200` response.
- [x] Add `POST /reset-password` endpoint.
	- Implemented behavior: token validation/consume + password update + `tokenVersion` increment.
- [x] Add secure token generation utility (CSPRNG).
- [x] Store only hashed reset tokens.
- [x] Mark tokens single-use and enforce expiry.
- [x] Update password hash and `passwordChangedAt` on reset.
- [x] Invalidate active sessions/tokens after reset.
	- Implemented via `POST /session/validate` + protected-route server validation using JWT `tokenVersion` checks.
- [x] Add per-IP and per-identifier rate limiting.
	- Implemented and validated with DynamoDB table `PasswordResetRateLimits` (`key` PK, TTL `expiresAt`) and lambda env/IAM wiring.

## Data Layer (DynamoDB)
- [x] Add user attributes: `passwordChangedAt`, `tokenVersion`.
	- Applied lazily on successful reset (`passwordChangedAt`, `updatedAt`, `tokenVersion = if_not_exists + 1`).
- [x] Create `PasswordResetTokens` table with TTL.
	- Table created with PK `tokenId`; TTL enabled on `expiresAt`.
- [x] Add index(es) required for user-based token cleanup.
	- Not required for v1 tokenId-based consume flow.
- [x] Add cleanup policy for stale/expired records.
	- DynamoDB TTL on `expiresAt` is active.

## Email
- [x] Implement forgot-password template with reset link and expiry note.
	- Implemented in forgot Lambda using AWS SES payload (`subject/text/html`) and `RESET_URL_BASE?token=<tokenId.tokenSecret>`.
- [x] Implement password-changed confirmation email.
	- Implemented in reset Lambda via SES (`Your password was changed`) with support instruction/contact.
- [x] Verify SES sender/domain identity and production access.
	- Verified sender identity and granted SES production access in `us-east-2`.
- [x] Configure email provider env vars in Lambda (`PASSWORD_RESET_FROM_EMAIL`, `RESET_URL_BASE`, optional `PASSWORD_RESET_REPLY_TO`).
	- Configured and validated via successful forgot-password email delivery.
- [ ] Add monitoring for bounces/complaints.
	- Deferred (cost-aware) as optional follow-up.

## Frontend (React)
- [x] Add `Forgot password?` link on login page.
- [x] Create `/forgot-password` page and form.
- [x] Create `/reset-password` page and form.
- [x] Add token parsing + invalid/expired token UX.
- [x] Add password strength guidance and confirmation checks.
	- Reset page now shows live password policy guidance; confirmation checks are enforced.
- [x] Add success redirect to login.
	- Reset success state now auto-redirects to login after a short delay (with fallback login link).

## Security & Abuse Prevention
- [x] Ensure forgot-password endpoint does not reveal account existence.
- [x] Ensure no raw tokens/passwords are logged.
	- `RETURN_RESET_TOKEN_FOR_TESTING` set back to `false` for normal operation.
- [x] Add audit events for request, issue, consume, and failure states.
	- Structured recovery logs added and validated (including rate-limited, email-sent, and request-rejected events).
- [ ] Add anomaly alerts for spikes in reset activity.
	- Deferred (cost-aware) as optional follow-up.
- [x] Add cooldown to repeated requests per account.

## Testing
- [x] Unit tests for token generation/hash/expiry/single-use behavior.
	- Added node test coverage for reset token hash determinism, composite token parsing, expiry checks, and single-use/token-status validity logic.
- [x] Integration tests for forgot/reset endpoints.
	- Manual Lambda/API tests validated happy-path and invalid/expired token behavior.
- [x] E2E tests for happy path and failure states.
	- Manual end-to-end verification completed (forgot email delivery, reset success, login with new password, reused token rejected).
- [x] Verify old sessions fail immediately after reset.
	- Validated with separate browser sessions: old session redirected to login after password reset.
- [x] Verify rate limits and abuse controls trigger as expected.
	- Validated with repeated forgot-password attempts: initial send allowed, then account cooldown and per-IP rate limit enforced.

## Rollout
- [x] Deploy backend and data changes first.
- [x] Validate in dev/staging with test accounts.
- [x] Enable frontend UI in staged rollout.
	- Minimal forgot/reset pages and routes are implemented and active.
- [x] Monitor metrics/logs after release.
	- CloudWatch validation completed for latest deployed version; retention set to 2 weeks.
- [x] Prepare rollback plan and support FAQ.
	- Rollback plan (fast path):
		1. Repoint API Gateway route integrations to last known-good alias/version for `showcaseForgotPassword`, `showcaseResetPassword`, and `showcaseSessionValidate`.
		2. Verify Lambda alias `prod` targets expected version(s).
		3. Run quick validation: forgot request generic `200`, reset success, old token reuse blocked.
		4. If issue is email-related only, keep reset flow active and temporarily disable SES send path by removing sender env var while investigation continues.
		5. Log incident timestamp, changed resources, rollback target versions, and outcome in this checklist evidence table.
	- Support FAQ (user-facing triage):
		- "I didn’t get a reset email." -> Confirm spam/junk, wait cooldown window, retry once, then verify account username+email match.
		- "Reset link says invalid/expired." -> Request a fresh link; old or already-used links are intentionally rejected.
		- "I was logged out after reset." -> Expected security behavior from session invalidation; sign in again with new password.
		- "I did not request this." -> Immediately reset password again and contact support using `PASSWORD_CHANGE_SUPPORT_EMAIL` guidance.

## Post-Launch
- [ ] Review reset success/failure rates weekly.
- [ ] Tune rate limits and UX based on observed behavior.
- [ ] Resolve legacy account edge cases discovered in production.
- [ ] Document final operating procedures for support/admin use.
- [x] Document final operating procedures for support/admin use.
	- Added support/admin runbook: `ACCOUNT_RECOVERY_OPERATING_PROCEDURES.md`.
- [ ] (Optional) Enable SES bounce/complaint alarms + notification channel when cost budget allows.

## Quick Validation Runbook (5 Minutes)
Use this after deploys or config changes.

1. Trigger forgot-password once for a known account (`username + email`).
	- Expected: API returns generic `200` message.
	- Expected: one reset email received.

2. Repeat forgot-password rapidly (same account/client).
	- Expected: API still returns generic `200`.
	- Expected: no additional email during cooldown.
	- Expected logs: `FORGOT_PASSWORD_RATE_LIMITED` (account and/or ip scope).

3. Complete reset from received link.
	- Expected: `POST /reset-password` returns `200`.
	- Expected: password-changed confirmation email received.

4. Verify token/session invalidation.
	- Reuse same reset token: expected `400 INVALID_OR_EXPIRED_TOKEN`.
	- Try old logged-in session: expected forced re-login via `POST /session/validate` failure.

5. Confirm observability and retention.
	- CloudWatch logs show `FORGOT_PASSWORD_EMAIL_SENT` and rate-limit events for current lambda version.
	- `PasswordResetRateLimits` table shows recent limiter keys/counters.
	- Log group retention remains set to 2 weeks.

### Evidence Log Template (Copy/Paste)
Use one row per validation run.

| Date/Time (UTC) | Environment | Lambda Version(s) | Forgot Email Sent | Rate Limit Observed | Reset Success | Token Reuse Blocked | Old Session Invalidated | Notes |
|---|---|---|---|---|---|---|---|---|
| YYYY-MM-DD HH:MM | prod/staging | forgot:vX reset:vY session:vZ | yes/no | yes/no (`account`/`ip`) | yes/no | yes/no | yes/no | requestId(s), links, anomalies |
| 2026-03-08 | prod-like manual validation | forgot:prod reset:prod session:prod | yes | yes (`account` + `ip`) | yes | yes | yes | User-confirmed full flow success after latest reset deployment; CloudWatch + DynamoDB limiter signals observed. |
