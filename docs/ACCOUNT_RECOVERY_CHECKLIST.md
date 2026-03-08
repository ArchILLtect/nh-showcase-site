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
- [x] [YOU] Create/deploy Lambda functions for forgot/reset handlers.
	- Created/deployed: `showcaseForgotPassword`, `showcaseResetPassword` (non-stub).
- [x] [YOU] Create API Gateway routes for reset endpoints.
	- Created: `POST /forgot-password`, `POST /reset-password` on `ShowcaseRegisterAPI`.
- [x] [YOU] Attach API Gateway integrations for reset endpoints.
	- Attached Lambda integrations for both new routes.
- [x] [YOU] Configure IAM permissions and environment variables/secrets for recovery flows.
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
- [ ] Add per-IP and per-identifier rate limiting.
	- Backend logic implemented in forgot/reset lambdas; pending AWS table/env/IAM enablement for `RESET_RATE_LIMITS_TABLE_NAME`.

## Data Layer (DynamoDB)
- [x] Add user attributes: `passwordChangedAt`, `tokenVersion`.
	- Applied lazily on successful reset (`passwordChangedAt`, `updatedAt`, `tokenVersion = if_not_exists + 1`).
- [x] [YOU] Create `PasswordResetTokens` table with TTL.
	- Table created with PK `tokenId`; TTL enabled on `expiresAt`.
- [x] [YOU] Add index(es) required for user-based token cleanup.
	- Not required for v1 tokenId-based consume flow.
- [x] [YOU] Add cleanup policy for stale/expired records.
	- DynamoDB TTL on `expiresAt` is active.

## Email
- [x] Implement forgot-password template with reset link and expiry note.
	- Implemented in forgot Lambda using AWS SES payload (`subject/text/html`) and `RESET_URL_BASE?token=<tokenId.tokenSecret>`.
- [x] Implement password-changed confirmation email.
	- Implemented in reset Lambda via SES (`Your password was changed`) with support instruction/contact.
- [x] [YOU] Verify SES sender/domain identity and production access.
	- Verified sender identity and granted SES production access in `us-east-2`.
- [x] [YOU] Configure email provider env vars in Lambda (`PASSWORD_RESET_FROM_EMAIL`, `RESET_URL_BASE`, optional `PASSWORD_RESET_REPLY_TO`).
	- Configured and validated via successful forgot-password email delivery.
- [ ] [YOU] Add monitoring for bounces/complaints.

## Frontend (React)
- [x] Add `Forgot password?` link on login page.
- [x] Create `/forgot-password` page and form.
- [x] Create `/reset-password` page and form.
- [x] Add token parsing + invalid/expired token UX.
- [ ] Add password strength guidance and confirmation checks.
	- Confirmation checks are implemented; explicit strength guidance UI is still pending.
- [ ] Add success redirect to login.
	- Success screen currently provides a login link (not automatic redirect).

## Security & Abuse Prevention
- [x] Ensure forgot-password endpoint does not reveal account existence.
- [x] Ensure no raw tokens/passwords are logged.
	- `RETURN_RESET_TOKEN_FOR_TESTING` set back to `false` for normal operation.
- [ ] Add audit events for request, issue, consume, and failure states.
- [ ] [YOU] Add anomaly alerts for spikes in reset activity.
- [ ] Add cooldown to repeated requests per account.

## Testing
- [ ] Unit tests for token generation/hash/expiry/single-use behavior.
- [x] Integration tests for forgot/reset endpoints.
	- Manual Lambda/API tests validated happy-path and invalid/expired token behavior.
- [x] E2E tests for happy path and failure states.
	- Manual end-to-end verification completed (forgot email delivery, reset success, login with new password, reused token rejected).
- [x] Verify old sessions fail immediately after reset.
	- Validated with separate browser sessions: old session redirected to login after password reset.
- [ ] Verify rate limits and abuse controls trigger as expected.
	- Pending after provisioning `RESET_RATE_LIMITS_TABLE_NAME` and smoke-testing throttle scenarios.

## Rollout
- [x] [YOU] Deploy backend and data changes first.
- [x] [YOU] Validate in dev/staging with test accounts.
- [x] Enable frontend UI in staged rollout.
	- Minimal forgot/reset pages and routes are implemented and active.
- [ ] [YOU] Monitor metrics/logs after release.
- [ ] Prepare rollback plan and support FAQ.

## Post-Launch
- [ ] Review reset success/failure rates weekly.
- [ ] Tune rate limits and UX based on observed behavior.
- [ ] Resolve legacy account edge cases discovered in production.
- [ ] Document final operating procedures for support/admin use.
