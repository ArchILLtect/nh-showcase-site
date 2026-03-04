# Account Recovery Implementation Plan

## Goal
Implement secure self-service password reset and account recovery for the existing custom auth stack (React frontend + AWS API Gateway/Lambda + DynamoDB), with backward compatibility and minimal disruption to current login/register flows.

## Scope
- Add forgot-password and reset-password user flows.
- Add backend endpoints and token lifecycle handling.
- Add email delivery for reset links.
- Invalidate existing sessions/tokens after successful reset.
- Add abuse protection, logging, and monitoring.

Out of scope (for initial release):
- MFA reset/recovery.
- Support-agent/admin-assisted manual account recovery workflows.
- Full account takeover remediation workflows.

## Current-State Assumptions
- Frontend stores `authToken` and `userData` in localStorage.
- Login and registration use API Gateway endpoints and Lambda handlers.
- User records are stored in DynamoDB.
- Passwords are hashed in backend Lambda logic.

## End-to-End User Flow
1. User clicks **Forgot password** on login page.
2. User submits username or email.
3. API responds with generic success message regardless of account existence.
4. If account exists, backend generates single-use reset token and sends email with secure link.
5. User opens reset link to frontend reset page.
6. Frontend submits token + new password.
7. Backend verifies token, applies password policy, updates password hash, revokes existing sessions, marks token used.
8. User sees success message and is redirected to login.
9. Confirmation email is sent to account email.

## API Design

### 1) POST `/forgot-password`
Request:
```json
{
  "identifier": "username_or_email"
}
```
Response (always 200):
```json
{
  "message": "If an account exists, password reset instructions were sent."
}
```
Behavior:
- Normalize identifier.
- Lookup matching user.
- If found, create single-use reset token record and send email.
- Always return generic response.

### 2) POST `/reset-password`
Request:
```json
{
  "token": "opaque_token_from_email",
  "newPassword": "newPassword123!",
  "confirmPassword": "newPassword123!"
}
```
Response:
- `200` success
- `400` invalid input/policy failure
- `410` expired/used token

Behavior:
- Validate token format.
- Hash incoming token and compare to stored hash.
- Reject if expired/used/revoked.
- Enforce password policy.
- Update user password hash + passwordChangedAt.
- Mark token used and invalidate active sessions.
- Send reset confirmation email.

### Optional: 3) GET `/reset-token-status`
- Used for improved UX to pre-check whether a token is valid before showing form.
- Not required for v1.

## Data Model Changes (DynamoDB)

### User item additions
- `passwordChangedAt` (ISO string)
- `tokenVersion` (number, default 1)
- `accountStatus` (optional; e.g., active/locked)

### New table: `PasswordResetTokens`
Suggested attributes:
- `tokenId` (PK)
- `userId`
- `tokenHash` (hash of the raw token; never store raw token)
- `expiresAt` (epoch TTL)
- `createdAt`
- `usedAt` (nullable)
- `requestIp`
- `requestUserAgent`
- `consumedIp`
- `consumedUserAgent`
- `status` (`active|used|expired|revoked`)

Indexes (recommended):
- GSI on `userId` for cleanup/revocation.

## Token and Link Strategy
- Generate cryptographically secure random token (>= 32 bytes entropy).
- Store only `SHA-256(token + serverPepper)` as `tokenHash`.
- Token validity: 15–30 minutes.
- Single-use only.
- Include token in URL query parameter:
  - `https://your-site/reset-password?token=<raw_token>`
- Avoid putting PII in the URL.

## Security Controls
- Uniform response message on forgot-password.
- Rate limiting:
  - Per IP (e.g., 5 requests / 15 minutes)
  - Per account identifier (e.g., 3 requests / hour)
- Add cooldown between reset requests per account.
- Password policy enforcement (length, complexity, breached-password check if available).
- Session invalidation after reset:
  - Increment `tokenVersion` in user record.
  - Reject tokens with stale version on future authenticated requests.
- Audit logs for all reset lifecycle events.
- Prevent token replay by strict single-use semantics.

## Email Requirements
Forgot-password email:
- Subject: `Password reset request`
- Include clear call-to-action reset link.
- Include expiration window.
- Include instruction if request was not initiated by user.

Password reset confirmation email:
- Subject: `Your password was changed`
- Include timestamp and high-level context.
- Include support/contact instruction if unauthorized.

## Frontend Requirements (React)

### Login page updates
- Add `Forgot password?` link to new route `/forgot-password`.

### New page: `/forgot-password`
- Single input for username/email.
- Always show generic success banner after submit.
- Include resend cooldown text.

### New page: `/reset-password`
- Read token from query param.
- New password + confirm password fields.
- Client-side policy feedback.
- Handle expired/invalid token states and redirect path.

## Backend/Lambda Requirements
- Add Lambda handlers for forgot/reset endpoints.
- Add shared utilities for token generation/hash/verification.
- Add session invalidation support (e.g., tokenVersion check).
- Add structured logs and correlation IDs.

## Rollout Plan
1. Deploy backend data model and endpoints (dark launch).
2. Validate via Postman/integration tests.
3. Add frontend routes and forms behind feature flag.
4. Enable email templates in production.
5. Turn on rate limits/alerts.
6. Gradual release and monitor.

## Acceptance Criteria
- User can request reset and receive email for valid account.
- Invalid/non-existent accounts receive same generic response.
- Reset link expires and cannot be reused.
- Password update succeeds and old sessions no longer work.
- Security events are logged and observable.
- Frontend provides clear UX for success/failure states.
