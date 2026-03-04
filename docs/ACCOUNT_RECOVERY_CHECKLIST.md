# Account Recovery Implementation Checklist

Use this as the execution checklist for password reset/account recovery rollout.

## Planning
- [ ] Confirm recovery entry point (`username`, `email`, or both).
- [ ] Define reset token TTL (recommended: 15–30 minutes).
- [ ] Define password policy and validation errors.
- [ ] Confirm success/failure UX copy (generic forgot-password response).
- [ ] Define session invalidation strategy (`tokenVersion` recommended).

## Backend
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
- [ ] Create `PasswordResetTokens` table with TTL.
- [ ] Add index(es) required for user-based token cleanup.
- [ ] Add cleanup policy for stale/expired records.

## Email
- [ ] Implement forgot-password template with reset link and expiry note.
- [ ] Implement password-changed confirmation email.
- [ ] Verify sender identity and domain auth (SPF/DKIM/DMARC).
- [ ] Add monitoring for bounces/complaints.

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
- [ ] Add anomaly alerts for spikes in reset activity.
- [ ] Add cooldown to repeated requests per account.

## Testing
- [ ] Unit tests for token generation/hash/expiry/single-use behavior.
- [ ] Integration tests for forgot/reset endpoints.
- [ ] E2E tests for happy path and failure states.
- [ ] Verify old sessions fail immediately after reset.
- [ ] Verify rate limits and abuse controls trigger as expected.

## Rollout
- [ ] Deploy backend and data changes first.
- [ ] Validate in dev/staging with test accounts.
- [ ] Enable frontend UI in staged rollout.
- [ ] Monitor metrics/logs after release.
- [ ] Prepare rollback plan and support FAQ.

## Post-Launch
- [ ] Review reset success/failure rates weekly.
- [ ] Tune rate limits and UX based on observed behavior.
- [ ] Resolve legacy account edge cases discovered in production.
- [ ] Document final operating procedures for support/admin use.
