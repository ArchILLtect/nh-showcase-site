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
- [x] Lock registration validation constraints in spec + implementation:
  - email max length `254` (trim + lowercase normalization)
  - password requires upper/lower/number/symbol and rejects common weak passwords

## Phase B: Backend Implementation
- Status note: verification lambdas are deployed, API routes are wired, and end-to-end verification flow has been validated.
- [x] Update registration lambda to create unverified users by default (`emailVerified=false`).
- [x] Generate single-use verification token and persist hash + expiry metadata.
- [x] Send verification email via SES with verification link.
- [x] Implement verify-email endpoint to consume token and set `emailVerified=true`.
- [x] Add resend-verification path with cooldown/rate limiting.
- [x] Ensure all responses are enumeration-safe and non-sensitive.

## Phase C: Frontend UX
- [x] Show post-registration "check your email" confirmation state.
- [x] Add verification landing page/route to process verification link.
- [x] Add resend verification UI with cooldown messaging.
  - Implemented as a dismissible global banner for logged-in users with `emailVerified=false`.
- [x] Handle login attempt for unverified users with clear next-step guidance.
  - Login remains allowed; guidance is shown in the same dismissible banner.

## Phase D: Security + Abuse Controls
- [x] Add per-IP and per-identifier throttling for register + resend verification.
  - Resend verification throttling validated; registration throttling validated with 429 RATE_LIMITED response and REGISTER_RATE_LIMITED structured log event.
- [x] Keep tokens hashed at rest and single-use with short TTL.
  - Token secret hash-at-rest + single-use consume semantics are enforced in registration/resend/verify lambdas; TTL uses `expiresAt` with short-lived token windows.
- [x] Add structured logs for verification lifecycle events (`sent`, `consumed`, `expired`, `rate_limited`).
  - `sent`: `EMAIL_VERIFICATION_RESENT` and registration `REGISTER_SUCCEEDED` with `verificationEmailSent=true`.
  - `consumed`: `EMAIL_VERIFICATION_TOKEN_CONSUMED`.
  - `expired`: `EMAIL_VERIFICATION_TOKEN_REJECTED` with `reason=expired`.
  - `rate_limited`: `EMAIL_VERIFICATION_RESEND_RATE_LIMITED` and `REGISTER_RATE_LIMITED`.
- [x] Ensure no raw token values appear in logs.
  - Verification lifecycle logging records hashed identifiers only; no raw token secrets are emitted.

## Phase E: Ops Resilience
- [ ] Enable PITR (or scheduled backups) for auth-critical tables.
  - Deferred (cost-aware): backup/PITR storage costs accepted for later ops pass; see Deferred Resilience Acceptance.
- [ ] Set/verify cost-aware CloudWatch retention for registration/verification log groups.
  - Deferred (cost-aware): retention tuning/verification tracked as ops follow-up.
- [ ] Add minimal alerts for registration/verification failure spikes (cost-aware baseline).
  - Deferred (cost-aware): alarm creation and ongoing metric evaluation deferred by explicit acceptance decision.

### Deferred Resilience Acceptance (2026-03-09)
- Deferral decision: accepted for current phase close, with explicit follow-up in the next hardening cycle.
- Rationale:
  - Verification and abuse-control correctness are now validated end-to-end in production-like runs.
  - Remaining resilience work is operational hardening (not functional correctness blockers) and can be scheduled as a focused ops pass.
- Deferred items to carry forward:
  - PITR/backup verification for verification-specific tables.
  - CloudWatch retention verification for registration/verification log groups.
  - Minimal failure-spike alerting baseline.
- Acceptance guardrail: no further auth-surface expansion before these three items are reviewed and either implemented or re-deferred with updated rationale.

## Validation Checklist
- [x] Register new user -> account created unverified + verification email sent.
- [x] Login before verification -> allowed; verification guidance banner is shown.
- [x] Verify with valid token -> success, token becomes unusable.
- [x] Reuse same verification token -> rejected.
  - Confirmed in Lambda validation: first consume returned 200, second consume of same token returned 400 INVALID_OR_EXPIRED_VERIFICATION_TOKEN.
- [x] Expired token -> rejected; resend flow issues new token.
  - Confirmed in Lambda validation: short-TTL token returned 400 INVALID_OR_EXPIRED_VERIFICATION_TOKEN after expiry, resend produced a fresh token, and fresh-token verify returned 200 with `Users.emailVerified=true`.
  - 2026-03-10 validation: resend returned 200 (`EMAIL_VERIFICATION_RESENT`), then verify attempt after ~35 minutes returned 400 with `EMAIL_VERIFICATION_TOKEN_REJECTED` and `reason=expired`.
- [x] Rate limiting triggers on repeated resend/register attempts.
  - Confirmed in Lambda validation: repeated same registration identity returns 429 RATE_LIMITED.
- [x] Register with common weak password -> rejected with `400 VALIDATION_ERROR`.
- [x] Queue-backed post-create notification failure fallback works as designed.
  - Confirmed via controlled failure and restore tests (201 fail-open with `verificationEmailSent=false`, `REGISTER_NOTIFICATION_FAILURE_ENQUEUED`, then restored success with `verificationEmailSent=true`); see `REGISTRATION_ROLLOUT_AND_ROLLBACK_GUIDE.md` validation snapshot.
- [x] Post-verification login succeeds.

## Done Criteria
- [x] Unverified accounts are guided to verify (without hard-blocking baseline login during current phase).
- [x] Verification flow is reliable (send, consume, resend) and abuse-resistant.
- [x] Deferred resilience items (PITR/backups + baseline alerting) are addressed or explicitly deferred with rationale.
  - Deferred under "Deferred Resilience Acceptance (2026-03-09)" in this checklist.
- [x] Runbook/evidence entry added after production-like validation.
  - Evidence captured in baseline refresh artifacts under `docs/dev/auth/baselines/2026-03-04-registration/` (2026-03-09 updates).
