# Registration Email Verification + Hardening Checklist

Purpose: execute the next registration phase after baseline/P0 work, focused on verified-account onboarding and remaining resilience controls.

## Why This Is Separate
- `REGISTRATION_HARDENING_CHECKLIST.md` is a minimum-safety baseline checklist.
- This checklist is the next implementation phase for email verification and remaining P1/P2 hardening items.

## Scope for This Phase
- Add email verification for new accounts.
- Gate login/access for unverified accounts.
- Complete remaining registration hardening items that were deferred.

## Phase A: Data + Contract Preparation
- [ ] Add/confirm user attributes on creation: `emailVerified`, `tokenVersion`, `passwordChangedAt`, `updatedAt`.
- [ ] Define verification token storage model (recommended: dedicated table with TTL + single-use semantics).
- [ ] Define API contracts and stable error codes for:
  - `POST /register` (returns verification-pending state)
  - `POST /verify-email` (token consume)
  - optional `POST /resend-verification`
- [ ] Document login behavior for unverified users (recommended: block login with safe `EMAIL_NOT_VERIFIED` response).

## Phase B: Backend Implementation
- [ ] Update registration lambda to create unverified users by default (`emailVerified=false`).
- [ ] Generate single-use verification token and persist hash + expiry metadata.
- [ ] Send verification email via SES with verification link.
- [ ] Implement verify-email endpoint to consume token and set `emailVerified=true`.
- [ ] Add resend-verification path with cooldown/rate limiting.
- [ ] Ensure all responses are enumeration-safe and non-sensitive.

## Phase C: Frontend UX
- [ ] Show post-registration "check your email" confirmation state.
- [ ] Add verification landing page/route to process verification link.
- [ ] Add resend verification UI with cooldown messaging.
- [ ] Handle login attempt for unverified users with clear next-step guidance.

## Phase D: Security + Abuse Controls
- [ ] Add per-IP and per-identifier throttling for register + resend verification.
- [ ] Keep tokens hashed at rest and single-use with short TTL.
- [ ] Add structured logs for verification lifecycle events (`sent`, `consumed`, `expired`, `rate_limited`).
- [ ] Ensure no raw token values appear in logs.

## Phase E: Ops Resilience
- [ ] Enable PITR (or scheduled backups) for auth-critical tables.
- [ ] Set/verify cost-aware CloudWatch retention for registration/verification log groups.
- [ ] Add minimal alerts for registration/verification failure spikes (cost-aware baseline).

## Validation Checklist
- [ ] Register new user -> account created unverified + verification email sent.
- [ ] Login before verification -> blocked with expected response.
- [ ] Verify with valid token -> success, token becomes unusable.
- [ ] Reuse same verification token -> rejected.
- [ ] Expired token -> rejected; resend flow issues new token.
- [ ] Rate limiting triggers on repeated resend/register attempts.
- [ ] Post-verification login succeeds.

## Done Criteria
- [ ] Unverified accounts cannot authenticate as fully active users.
- [ ] Verification flow is reliable (send, consume, resend) and abuse-resistant.
- [ ] Deferred resilience items (PITR/backups + baseline alerting) are addressed or explicitly deferred with rationale.
- [ ] Runbook/evidence entry added after production-like validation.
