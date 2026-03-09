# Minimum Safe Registration Hardening Checklist

Purpose: secure the current registration path quickly (without full architecture refactor) before broader SSAF modernization.

## Baseline Objective
- Prevent bad input, duplicate-account collisions, and unsafe error behavior.
- Keep current UX working while strengthening backend guarantees.
- Add observability so future auth changes are measurable and safer.

## P0 (Do First)
- [ ] Enforce strict server-side input validation for `username`, `email`, `password`.
- [ ] Normalize email (`trim`, lowercase) before lookup/write.
- [ ] Enforce duplicate protection with conditional writes (prevent overwrite of existing user item).
- [ ] Return safe, consistent error responses (no stack traces/internal details).
- [ ] Enforce password policy in Lambda (frontend checks are UX only).
- [ ] Add request correlation id and structured logs for register attempts.

## P1 (Next)
- [ ] Define and document account identity policy (`username` unique; email reuse allowed).
- [ ] Add account creation metadata: `emailVerified`, `tokenVersion`, `passwordChangedAt`, `updatedAt`.
- [ ] Add rate limiting and abuse controls (per IP + per identifier).
- [ ] Add robust CORS + JSON response headers for all outcomes.
- [ ] Add integration tests for success, duplicate, invalid input, and throttled paths.

## P2 (Soon After)
- [ ] Add email verification flow and gate account activation/login on verification.
- [ ] Add monitoring/alerts for registration error spikes and unusual signup patterns.
- [ ] Add dead-letter/error handling strategy for async notification failures.
- [ ] Add staged rollout toggles and rollback guidance.

## Validation Rules (Suggested Starter)
- Username:
  - [ ] Length 3–32
  - [ ] Allowed chars: letters, numbers, `_`, `-`
  - [ ] Reject leading/trailing spaces
- Email:
  - [ ] RFC-safe format check + lowercase canonicalization
  - [ ] Max length guard
- Password:
  - [ ] Minimum length (recommend 12)
  - [ ] At least 1 uppercase, 1 lowercase, 1 number, 1 symbol
  - [ ] Reject common weak passwords

## Error Contract (Suggested)
- [ ] `400` invalid input with stable machine code (e.g., `VALIDATION_ERROR`).
- [ ] `409` duplicate username conflict (`USERNAME_EXISTS`).
- [ ] `429` throttled (`RATE_LIMITED`).
- [ ] `500` generic internal error (`INTERNAL_ERROR`) with no sensitive details.

## DynamoDB Checks
- [ ] Confirm key schema supports chosen identity policy (`username` unique, email reusable).
- [ ] Confirm condition expressions are used in writes.
- [ ] Confirm table/index naming and ownership documentation exists.
- [ ] Confirm TTL usage (if applicable) and backup/PITR settings.

## Done Criteria
- [ ] Duplicate registration attempts no longer overwrite existing users.
- [ ] Invalid payloads are rejected consistently with safe errors.
- [ ] Logs support debugging without exposing secrets.
- [ ] Registration flow still works end-to-end in current UI.
