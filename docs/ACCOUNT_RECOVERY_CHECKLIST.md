# Account Recovery Implementation Checklist

Use this as the execution checklist for password reset/account recovery rollout.

Marker legend:
- `[YOU]` = Action that typically requires your AWS/infra/domain/production access.

## Planning
- [x] Confirm recovery entry point (`username`, `email`, or both).
	- Locked: `email` only (all accounts require email).
	- Definition details:
		- Accepted input(s): `<email only>`
		- Normalization rules: `<trim/lowercase/etc.>`
		- Handling for unknown email: `<same generic response>`
- [x] Define reset token TTL (recommended: 15–30 minutes).
	- Locked: `15 minutes`.
	- Definition details:
		- TTL value: `<15 minutes>`
		- Re-request cooldown: `<e.g., 60s>`
		- Max requests per window: `<e.g., 3/hour/account, 5/15min/IP>`
- [ ] Document/confirm existing policy is reused for reset.
	- Definition details:
		- Minimum length: `<...>`
		- Complexity requirements: `<...>`
		- Reuse restrictions: `<...>`
		- Validation error contract (code/message): `<...>`
		- Backend is source of truth: `<confirmed yes/no>`
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
- [ ] [YOU] Create/deploy Lambda functions for forgot/reset handlers.
- [ ] [YOU] Create API Gateway routes/integrations for reset endpoints.
- [ ] [YOU] Configure IAM permissions and environment variables/secrets for recovery flows.
- [ ] Add `POST /forgot-password` endpoint.
- [ ] Add `POST /reset-password` endpoint.
- [ ] Add secure token generation utility (CSPRNG).
- [ ] Store only hashed reset tokens.
- [ ] Mark tokens single-use and enforce expiry.
- [ ] Update password hash and `passwordChangedAt` on reset.
- [ ] Invalidate active sessions/tokens after reset.
- [ ] Add per-IP and per-identifier rate limiting.

## Data Layer (DynamoDB)
- [ ] Add user attributes: `passwordChangedAt`, `tokenVersion`.
- [ ] [YOU] Create `PasswordResetTokens` table with TTL.
- [ ] [YOU] Add index(es) required for user-based token cleanup.
- [ ] [YOU] Add cleanup policy for stale/expired records.

## Email
- [ ] Implement forgot-password template with reset link and expiry note.
- [ ] Implement password-changed confirmation email.
- [ ] [YOU] Verify sender identity and domain auth (SPF/DKIM/DMARC).
- [ ] [YOU] Add monitoring for bounces/complaints.

## Frontend (React)
- [ ] Add `Forgot password?` link on login page.
- [ ] Create `/forgot-password` page and form.
- [ ] Create `/reset-password` page and form.
- [ ] Add token parsing + invalid/expired token UX.
- [ ] Add password strength guidance and confirmation checks.
- [ ] Add success redirect to login.

## Security & Abuse Prevention
- [ ] Ensure forgot-password endpoint does not reveal account existence.
- [ ] Ensure no raw tokens/passwords are logged.
- [ ] Add audit events for request, issue, consume, and failure states.
- [ ] [YOU] Add anomaly alerts for spikes in reset activity.
- [ ] Add cooldown to repeated requests per account.

## Testing
- [ ] Unit tests for token generation/hash/expiry/single-use behavior.
- [ ] Integration tests for forgot/reset endpoints.
- [ ] E2E tests for happy path and failure states.
- [ ] Verify old sessions fail immediately after reset.
- [ ] Verify rate limits and abuse controls trigger as expected.

## Rollout
- [ ] [YOU] Deploy backend and data changes first.
- [ ] [YOU] Validate in dev/staging with test accounts.
- [ ] Enable frontend UI in staged rollout.
- [ ] [YOU] Monitor metrics/logs after release.
- [ ] Prepare rollback plan and support FAQ.

## Post-Launch
- [ ] Review reset success/failure rates weekly.
- [ ] Tune rate limits and UX based on observed behavior.
- [ ] Resolve legacy account edge cases discovered in production.
- [ ] Document final operating procedures for support/admin use.
