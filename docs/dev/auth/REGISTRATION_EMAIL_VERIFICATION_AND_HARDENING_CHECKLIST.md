# Registration Email Verification + Hardening Checklist

Purpose: execute the next registration phase after baseline/P0 work, focused on verified-account onboarding and remaining resilience controls.

## Why This Is Separate
- `REGISTRATION_HARDENING_CHECKLIST.md` is a minimum-safety baseline checklist.
- This checklist is the next implementation phase for email verification and remaining P1/P2 hardening items.

## Scope for This Phase
- Add email verification for new accounts.
- Allow login for unverified accounts and encourage verification in-app.
- Complete remaining registration hardening items that were deferred.

## Phase A: Data + Contract Preparation
- [x] Add/confirm user attributes on creation: `emailVerified`, `tokenVersion`, `passwordChangedAt`, `updatedAt`.
  - Implemented in registration lambda source for new registrations.
- [x] Define verification token storage model (recommended: dedicated table with TTL + single-use semantics).
- [x] Define API contracts and stable error codes for:
  - `POST /register` (returns verification-pending state)
  - `POST /verify-email` (token consume)
  - optional `POST /resend-verification`
- [x] Document login behavior for unverified users (current policy: allow login, show dismissible in-app verification guidance, and gate future sensitive actions only).
  - See Phase A spec: `REGISTRATION_EMAIL_VERIFICATION_PHASE_A_SPEC.md`.

## Phase B: Backend Implementation
- Status note: initial backend scaffolds exist in `lambda-functions/showcaseVerifyEmail/` and `lambda-functions/showcaseResendVerification/`; API route wiring + deploy validation still pending.
- [x] Update registration lambda to create unverified users by default (`emailVerified=false`).
- [x] Generate single-use verification token and persist hash + expiry metadata.
- [x] Send verification email via SES with verification link.
- [ ] Implement verify-email endpoint to consume token and set `emailVerified=true`.
- [ ] Add resend-verification path with cooldown/rate limiting.
- [ ] Ensure all responses are enumeration-safe and non-sensitive.

## Phase C: Frontend UX
- [ ] Show post-registration "check your email" confirmation state.
- [ ] Add verification landing page/route to process verification link.
- [x] Add resend verification UI with cooldown messaging.
  - Implemented as a dismissible global banner for logged-in users with `emailVerified=false`.
- [x] Handle login attempt for unverified users with clear next-step guidance.
  - Login remains allowed; guidance is shown in the same dismissible banner.

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
- [ ] Login before verification -> allowed; verification guidance banner is shown.
- [ ] Verify with valid token -> success, token becomes unusable.
- [ ] Reuse same verification token -> rejected.
- [ ] Expired token -> rejected; resend flow issues new token.
- [ ] Rate limiting triggers on repeated resend/register attempts.
- [ ] Post-verification login succeeds.

## Done Criteria
- [ ] Unverified accounts are guided to verify (without hard-blocking baseline login during current phase).
- [ ] Verification flow is reliable (send, consume, resend) and abuse-resistant.
- [ ] Deferred resilience items (PITR/backups + baseline alerting) are addressed or explicitly deferred with rationale.
- [ ] Runbook/evidence entry added after production-like validation.
