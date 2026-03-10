# Account Recovery Operating Procedures (Support/Admin)

Last updated: 2026-03-10

Purpose: provide a concise, repeatable runbook for support/admin handling of forgot-password and reset-password issues in production.

## Scope
- Applies to account recovery flow (`/forgot-password`, `/reset-password`).
- Covers triage, verification checks, incident handling, and escalation.
- Uses current policy: account-scoped lookup (`username + email`) and enumeration-safe responses.

## Support Intake Template
Collect the following before troubleshooting:
- Reported issue type: no email / invalid-expired link / rate-limited / post-reset login issue.
- Username and email used in request.
- Approximate request time (UTC).
- Client context (browser/device/network/VPN if relevant).
- Any screenshot or exact API/UI message.

## Standard Triage Paths
### 1) "I didn't get the reset email"
1. Confirm user checked spam/junk and waited cooldown window.
2. Confirm user retried once with correct `username + email` pair.
3. Check CloudWatch for recent events:
   - `FORGOT_PASSWORD_EMAIL_SENT`
   - `FORGOT_PASSWORD_RATE_LIMITED`
4. If rate-limited, advise waiting the configured cooldown/window.
5. If no send event appears, escalate to auth ops with request timestamp and account details.

### 2) "Reset link is invalid or expired"
1. Explain links are single-use and time-limited by design.
2. Ask user to request a fresh link and use newest email only.
3. Confirm logs show token rejection event (expired/used).
4. If repeated failures continue with fresh links, escalate with request IDs.

### 3) "I was logged out after reset"
1. Confirm behavior is expected (session invalidation on password reset).
2. Ask user to log in again with the new password.
3. If login fails, route to login troubleshooting (username/password mismatch, account lockout, etc.).

### 4) "I did not request this"
1. Instruct user to reset password immediately.
2. Provide support contact from `PASSWORD_CHANGE_SUPPORT_EMAIL` policy.
3. Escalate as security incident if suspicious pattern repeats.

## Admin Verification Checklist (Console)
- Lambda logs:
  - `showcaseForgotPassword`
  - `showcaseResetPassword`
  - `showcaseSessionValidate`
- API responses:
  - Forgot endpoint remains generic (`200` always).
  - Reset endpoint enforces token validity/single-use.
- DynamoDB spot checks:
  - `PasswordResetTokens` status transitions (`active` -> `used`)
  - `PasswordResetRateLimits` counters increment on abuse/cooldown paths.

## Escalation Criteria
Escalate to engineering when any apply:
- Repeated valid requests show no corresponding email-send events.
- Sudden increase in token validation failures without user misuse.
- Reset success occurs but sessions are not invalidated.
- Error rate spikes persist beyond one cooldown window.

## Incident Response (Recovery Feature)
1. Capture timeline (UTC), affected users, sample request IDs.
2. Validate latest deployed Lambda versions/aliases.
3. If needed, execute rollback path from `ACCOUNT_RECOVERY_CHECKLIST.md`.
4. Re-test 5-minute quick validation runbook before closing incident.
5. Record incident summary and corrective action in team notes.

## Operational Cadence
- Weekly: review reset success/failure trend and top error patterns.
- Monthly: review support tickets for UX/rate-limit tuning opportunities.
- Quarterly: verify runbook accuracy against current env vars/routes.

## Related Docs
- `ACCOUNT_RECOVERY_CHECKLIST.md`
- `ACCOUNT_RECOVERY_IMPLEMENTATION.md`
- `AUTH_OVERVIEW.md`
