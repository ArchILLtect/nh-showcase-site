# Minimum Safe Registration Hardening Checklist

Purpose: secure the current registration path quickly (without full architecture refactor) before broader SSAF modernization.

Status note (2026-03-09): this checklist has largely been completed by Phase A verification/hardening work. Remaining items are called out explicitly below.

## Baseline Objective
- Prevent bad input, duplicate-account collisions, and unsafe error behavior.
- Keep current UX working while strengthening backend guarantees.
- Add observability so future auth changes are measurable and safer.

## P0 (Do First)
- [x] Enforce strict server-side input validation for `username`, `email`, `password`.
- [x] Normalize email (`trim`, lowercase) before lookup/write.
- [x] Enforce duplicate protection with conditional writes (prevent overwrite of existing user item).
- [x] Return safe, consistent error responses (no stack traces/internal details).
- [x] Enforce password policy in Lambda (frontend checks are UX only).
- [x] Add request correlation id and structured logs for register attempts.
  - Structured log events now cover validation failures, duplicate conflicts, throttling, success, and internal failures with requestId and hashed identifiers.

## P1 (Next)
- [x] Define and document account identity policy (`username` unique; email reuse allowed).
- [x] Add account creation metadata: `emailVerified`, `tokenVersion`, `passwordChangedAt`, `updatedAt`.
- [x] Add rate limiting and abuse controls (per IP + per identifier).
- [x] Add robust CORS + JSON response headers for all outcomes.
- [x] Add integration tests for success, duplicate, invalid input, and throttled paths.
  - Implemented in `lambda-functions/showcaseRegistration/tests/handler.integration.test.mjs` using Node built-in test runner.

## P2 (Soon After)
- [x] Add email verification flow and gate account activation/login on verification.
  - Implemented verification flow; current policy intentionally keeps login soft-enforced (no hard block yet).
- [ ] Add monitoring/alerts for registration error spikes and unusual signup patterns.
  - Deferred (cost-aware) with explicit acceptance note in verification/hardening checklist.
- [ ] Add dead-letter/error handling strategy for async notification failures.
- [ ] Add staged rollout toggles and rollback guidance.

## Validation Rules (Suggested Starter)
- Username:
  - [x] Length 3–32
  - [x] Allowed chars: letters, numbers, `_`, `-`
  - [x] Reject leading/trailing spaces
- Email:
  - [x] RFC-safe format check + lowercase canonicalization
  - [ ] Max length guard
- Password:
  - [x] Minimum length (currently 8; consider 12 in next policy tightening)
  - [ ] At least 1 uppercase, 1 lowercase, 1 number, 1 symbol
  - [ ] Reject common weak passwords

## Error Contract (Suggested)
- [x] `400` invalid input with stable machine code (e.g., `VALIDATION_ERROR`).
- [x] `409` duplicate username conflict (`USERNAME_EXISTS`).
- [x] `429` throttled (`RATE_LIMITED`).
- [x] `500` generic internal error (`INTERNAL_ERROR`) with no sensitive details.

## DynamoDB Checks
- [x] Confirm key schema supports chosen identity policy (`username` unique, email reusable).
- [x] Confirm condition expressions are used in writes.
- [x] Confirm table/index naming and ownership documentation exists.
- [ ] Confirm TTL usage (if applicable) and backup/PITR settings.
  - Partial: TTL confirmed for verification/rate-limit tables; PITR/backup verification remains deferred (cost-aware).

## Done Criteria
- [x] Duplicate registration attempts no longer overwrite existing users.
- [x] Invalid payloads are rejected consistently with safe errors.
- [x] Logs support debugging without exposing secrets.
  - Registration logs use requestId plus hashed account/IP identifiers; no raw token/password values are emitted.
- [x] Registration flow still works end-to-end in current UI.
