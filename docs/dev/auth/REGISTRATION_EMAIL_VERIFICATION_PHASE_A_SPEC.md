# Registration Email Verification — Phase A Spec

Last updated: 2026-03-08

Purpose: lock the data model, API contracts, and AWS configuration requirements before implementing verification endpoints.

## Scope
- Registration creates users as unverified by default.
- Verification email contains single-use token link.
- Verification endpoint consumes token and marks account verified.
- Optional resend endpoint issues a fresh token with cooldown and safe response behavior.

## Compatibility Policy
- Existing/legacy users without `emailVerified` are treated as verified (`true`) during rollout.
- New registrations are created with `emailVerified=false`.
- Login block applies only when `emailVerified === false`.

## Data Model

### `Users` table (new/confirmed attributes)
- `emailVerified` (boolean)
- `tokenVersion` (number)
- `passwordChangedAt` (ISO string)
- `updatedAt` (ISO string)

### New table: `EmailVerificationTokens`
Recommended attributes:
- `tokenId` (PK)
- `username`
- `emailNormalized`
- `tokenHash` (SHA-256 hash with pepper; raw token never stored)
- `status` (`active | used | expired | revoked`)
- `createdAt` (ISO string)
- `expiresAt` (epoch seconds, TTL)
- `usedAt` (ISO string, nullable)
- `requestIp`, `requestUserAgent`
- `consumedIp`, `consumedUserAgent`

Recommended TTL attribute: `expiresAt`

## Token Strategy
- Token format: `<tokenId>.<tokenSecret>`
- Entropy: token secret generated via CSPRNG (>= 32 bytes)
- Storage: hash only (`sha256(tokenSecret + EMAIL_VERIFY_TOKEN_HASH_PEPPER)`)
- TTL: 15–30 minutes (default 30 for verification is acceptable)
- Single-use: consume once, reject on reuse/expiry

Verification URL shape:
- `${EMAIL_VERIFY_URL_BASE}?token=<tokenId.tokenSecret>`

## API Contracts

### 1) `POST /register`
Request (unchanged core fields):
```json
{
  "username": "new_user",
  "email": "user@example.com",
  "password": "StrongPass123"
}
```

Success response (backward compatible):
```json
{
  "message": "User registered successfully",
  "verificationRequired": true
}
```

Error responses:
- `400 VALIDATION_ERROR`
- `409 USERNAME_EXISTS`
- `500 INTERNAL_ERROR`

Behavior:
- Create user with `emailVerified=false`.
- Issue verification token + send verification email.
- Keep success shape backward compatible (`message`) while adding `verificationRequired`.

### 2) `POST /verify-email`
Request:
```json
{
  "token": "tokenId.tokenSecret"
}
```

Success response:
```json
{
  "message": "Email verified successfully"
}
```

Error responses:
- `400 VALIDATION_ERROR` (missing/invalid token format)
- `400 INVALID_OR_EXPIRED_VERIFICATION_TOKEN`
- `500 INTERNAL_ERROR`

Behavior:
- Validate token format/hash/status/expiry.
- Mark token `used` and set `usedAt`.
- Update user: `emailVerified=true`, `updatedAt=<now>`.

### 3) `POST /resend-verification` (optional but recommended)
Request:
```json
{
  "username": "new_user",
  "email": "user@example.com"
}
```

Response (always generic `200`):
```json
{
  "message": "If account details are valid, verification instructions were sent."
}
```

Behavior:
- Account-scoped check (`username + email`) to match current identity policy.
- If already verified, still return generic `200` with no extra disclosure.
- Apply cooldown/rate limits and keep response enumeration-safe.

## Login Behavior for Unverified Users
- On login, after credential match:
  - If `user.emailVerified === false`: return `403 EMAIL_NOT_VERIFIED`.
  - If `emailVerified` is missing (legacy account), treat as verified during rollout.

Suggested response:
```json
{
  "code": "EMAIL_NOT_VERIFIED",
  "message": "Please verify your email before logging in."
}
```

## Lambda Environment Variables

### `showcaseRegistration`
- `USERS_TABLE_NAME`
- `EMAIL_VERIFICATION_TOKENS_TABLE_NAME`
- `EMAIL_VERIFY_TOKEN_TTL_MINUTES`
- `EMAIL_VERIFY_TOKEN_HASH_PEPPER`
- `EMAIL_VERIFY_URL_BASE`
- `EMAIL_VERIFICATION_FROM_EMAIL` (or fallback to existing sender env)
- `EMAIL_VERIFICATION_REPLY_TO` (optional)

### `showcaseVerifyEmail` (new)
- `USERS_TABLE_NAME`
- `EMAIL_VERIFICATION_TOKENS_TABLE_NAME`
- `EMAIL_VERIFY_TOKEN_HASH_PEPPER`

### `showcaseResendVerification` (new, optional)
- `USERS_TABLE_NAME`
- `EMAIL_VERIFICATION_TOKENS_TABLE_NAME`
- `EMAIL_VERIFY_TOKEN_TTL_MINUTES`
- `EMAIL_VERIFY_TOKEN_HASH_PEPPER`
- `EMAIL_VERIFY_URL_BASE`
- `EMAIL_VERIFICATION_FROM_EMAIL`
- `EMAIL_VERIFICATION_REPLY_TO` (optional)
- Optional limiter vars/table for resend abuse controls

## IAM Requirements (Least Privilege)

### `showcaseRegistration`
- DynamoDB:
  - `dynamodb:PutItem` on `Users`
  - `dynamodb:PutItem` on `EmailVerificationTokens`
- SES:
  - `ses:SendEmail`
  - `ses:SendRawEmail`

### `showcaseVerifyEmail`
- DynamoDB:
  - `dynamodb:GetItem` on `EmailVerificationTokens`
  - `dynamodb:UpdateItem` on `EmailVerificationTokens`
  - `dynamodb:UpdateItem` on `Users`
  - Prefer `dynamodb:TransactWriteItems` if token consume + user update are performed atomically

### `showcaseResendVerification` (optional)
- DynamoDB:
  - `dynamodb:GetItem` on `Users`
  - `dynamodb:PutItem` on `EmailVerificationTokens`
  - limiter table read/write actions if enabled
- SES:
  - `ses:SendEmail`
  - `ses:SendRawEmail`

## Rollout Notes
- Start with legacy-compatible login behavior (missing `emailVerified` treated as verified).
- Enforce verification only for newly created accounts first.
- After migration/backfill decision, optionally tighten behavior for old accounts.

## Phase A Exit Criteria
- Data model and token table contract are finalized.
- API contracts and error codes are frozen for implementation.
- Env var list and IAM permissions are documented per Lambda.
- Legacy-account behavior is explicitly defined.
