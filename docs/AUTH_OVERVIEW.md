# Auth Overview (Current State)

Last updated: 2026-03-09

Purpose: provide one fast, root-level reference for the current authentication and account recovery system.

## What Is Live
- Custom auth stack is active (no third-party auth provider).
- Registration and login are working with DynamoDB-backed users.
- Registration now creates accounts as unverified and sends verification email tokens.
- Unverified users can still log in during current phase and see an in-app verification reminder with resend action.
- Verification landing route (`/verify-email`) is live and consumes verification tokens.
- Password recovery is fully implemented and validated end-to-end.
- Session invalidation after password reset is enforced.

## Auth Architecture
- Frontend: React routes/pages (`/login`, `/register`, `/forgot-password`, `/reset-password`).
- API: AWS API Gateway routes invoking Lambda handlers.
- Data: DynamoDB tables for users, reset tokens, and rate limits.
- Email: Amazon SES for reset and password-changed notifications.

## Key Endpoints
- `POST /register`
- `POST /verify-email`
- `POST /resend-verification`
- `POST /login`
- `POST /forgot-password`
- `POST /reset-password`
- `POST /session/validate`

## Core Security Controls
- Forgot-password responses are enumeration-safe (generic success response).
- Reset tokens are single-use, short-lived, and hash-at-rest.
- Password reset increments `tokenVersion` to invalidate stale sessions.
- Protected routes call server-side session validation (`/session/validate`).
- Abuse controls are enabled (per-account cooldown + per-account/per-IP limits).
- Structured CloudWatch logs are in place for recovery events.

## DynamoDB/Auth Data
- Users table: includes `password`, `role`, `tokenVersion`, `passwordChangedAt`, `updatedAt`.
- `EmailVerificationTokens`: verification token lifecycle records with TTL (`expiresAt`).
- `EmailVerificationRateLimits`: resend limiter counters with TTL (`expiresAt`).
- `PasswordResetTokens`: token lifecycle records with TTL (`expiresAt`).
- `PasswordResetRateLimits`: limiter counters with TTL (`expiresAt`).

## Required Lambda Environment Variables (Auth/Recovery)
- Shared/auth: `USERS_TABLE_NAME`, `JWT_SECRET`, optional `JWT_EXPIRES_IN`
- Verification: `EMAIL_VERIFICATION_TOKENS_TABLE_NAME`, `EMAIL_VERIFY_TOKEN_TTL_MINUTES`, `EMAIL_VERIFY_TOKEN_HASH_PEPPER`, `EMAIL_VERIFY_URL_BASE`, `EMAIL_VERIFICATION_FROM_EMAIL`, optional `EMAIL_VERIFICATION_REPLY_TO`
- Verification limits (optional): `EMAIL_VERIFY_RATE_LIMITS_TABLE_NAME` + resend limiter tuning vars
- Forgot/reset tokens: `RESET_TOKENS_TABLE_NAME`, `RESET_TOKEN_TTL_MINUTES`, `TOKEN_HASH_PEPPER`
- Email: `PASSWORD_RESET_FROM_EMAIL`, `RESET_URL_BASE`, optional `PASSWORD_RESET_REPLY_TO`, optional `PASSWORD_CHANGE_SUPPORT_EMAIL`
- Limiting: `RESET_RATE_LIMITS_TABLE_NAME` plus forgot/reset limiter tuning vars

## Operations Snapshot
- SES sender identity verified and production access granted in `us-east-2`.
- CloudWatch retention set to 2 weeks for related log groups.
- Registration verification flow validated: register -> resend -> verify token consume -> verified state reflected in UI.
- Recovery flow validated: email send, reset success, reused-token rejection, stale-session invalidation, limiter triggers.
- Deferred (cost-aware): SES bounce/complaint alarm automation.

## Rollback & Support (Quick Reference)
Fast rollback path:
1. Repoint API Gateway route integrations to last known-good alias/version for `showcaseForgotPassword`, `showcaseResetPassword`, and `showcaseSessionValidate`.
2. Verify Lambda alias `prod` targets expected version(s).
3. Run quick validation: forgot request generic `200`, reset success, old token reuse blocked.
4. If issue is email-only, keep reset flow active and temporarily disable SES send path by removing sender env var while investigating.
5. Log incident timestamp, changed resources, rollback target versions, and outcome in recovery evidence logs.

Support triage quick answers:
- "I didn’t get a reset email." -> Check spam/junk, wait cooldown, retry once, then verify username+email match.
- "Reset link is invalid/expired." -> Request a new link; old/used links are intentionally rejected.
- "I was logged out after reset." -> Expected security behavior from session invalidation; log in again with new password.
- "I did not request this." -> Reset password again immediately and contact support per `PASSWORD_CHANGE_SUPPORT_EMAIL` guidance.

## Fast Validation
Use the runbook and evidence table in:
- [dev/auth/ACCOUNT_RECOVERY_CHECKLIST.md](dev/auth/ACCOUNT_RECOVERY_CHECKLIST.md)

Detailed rollback/support runbook:
- [dev/auth/ACCOUNT_RECOVERY_CHECKLIST.md](dev/auth/ACCOUNT_RECOVERY_CHECKLIST.md)

## Where Detailed Docs Live
- Auth docs index: [dev/auth/AUTH_DOCS_INDEX.md](dev/auth/AUTH_DOCS_INDEX.md)
- Next up (registration email verification + hardening): [dev/auth/REGISTRATION_EMAIL_VERIFICATION_AND_HARDENING_CHECKLIST.md](dev/auth/REGISTRATION_EMAIL_VERIFICATION_AND_HARDENING_CHECKLIST.md)
- Phase A implementation spec (contracts + env/IAM): [dev/auth/REGISTRATION_EMAIL_VERIFICATION_PHASE_A_SPEC.md](dev/auth/REGISTRATION_EMAIL_VERIFICATION_PHASE_A_SPEC.md)
- Account recovery checklist: [dev/auth/ACCOUNT_RECOVERY_CHECKLIST.md](dev/auth/ACCOUNT_RECOVERY_CHECKLIST.md)
- Lambda migration checklist: [dev/LAMBDA_MIGRATION_CHECKLIST.md](dev/LAMBDA_MIGRATION_CHECKLIST.md)
- Lambda source/deploy workflow: [../lambda-functions/README.md](../lambda-functions/README.md)
