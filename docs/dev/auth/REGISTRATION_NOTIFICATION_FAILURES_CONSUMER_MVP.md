# Registration Notification Failures Consumer (MVP)

Last updated: 2026-03-09

Purpose: define a minimal, low-cost consumer for `registration-notification-failures` SQS messages emitted by `showcaseRegistration` when post-create verification notification setup fails.

## Scope (MVP)
- Consume failure-intent messages from SQS.
- Record structured logs for each message.
- Optional retry mode: re-attempt verification token + email for still-unverified users.
- Keep initial implementation simple and safe.

## Producer Message Shape
Current producer sends JSON payload:
- `type` = `register_verification_email_failed`
- `username`
- `email`
- `requestId`
- `errorCode`
- `createdAt`

## Deployment Shape
- New Lambda: `showcaseRegistrationNotificationFailureConsumer`
- Trigger: SQS event source mapping from queue `registration-notification-failures`
- Batch size: `1` to `5` (start with `1`)
- Max batching window: `0` to `5` seconds

## MVP Mode A (Observe-Only)
Recommended first step for learning + low risk.

Behavior:
1. Parse SQS message body.
2. Validate required fields (`type`, `username`, `email`).
3. Emit structured log `REGISTRATION_NOTIFICATION_FAILURE_CONSUMED`.
4. Return success so message is removed from queue.

Pros:
- Very low complexity.
- Immediate visibility into real failure intents.

## MVP Mode B (Retry Verification Dispatch)
Enable after Mode A is stable.

Behavior:
1. Load user by `username` from `Users`.
2. If user not found or already `emailVerified=true`, log + ack.
3. Create fresh verification token row in `EmailVerificationTokens`.
4. Send SES verification email.
5. Log `REGISTRATION_NOTIFICATION_RETRY_SUCCEEDED` on success.
6. On retry failure, throw error to keep message for re-drive/DLQ handling.

## Suggested Environment Variables
- `USERS_TABLE_NAME`
- `EMAIL_VERIFICATION_TOKENS_TABLE_NAME`
- `EMAIL_VERIFY_TOKEN_TTL_MINUTES`
- `EMAIL_VERIFY_TOKEN_HASH_PEPPER`
- `EMAIL_VERIFY_URL_BASE`
- `EMAIL_VERIFICATION_FROM_EMAIL`
- `EMAIL_VERIFICATION_REPLY_TO` (optional)
- `NOTIFICATION_RETRY_MODE` (`observe` or `retry`)

## IAM (Consumer Lambda)
Observe-only mode:
- CloudWatch Logs write permissions

Retry mode additional permissions:
- DynamoDB: `GetItem` on `Users`
- DynamoDB: `PutItem` on `EmailVerificationTokens`
- SES: `SendEmail`, `SendRawEmail`

SQS event source mapping typically handles receive/delete using the Lambda service integration.

## Queue / DLQ Recommendations
- Keep source queue as Standard.
- Add DLQ for consumer failures after basic validation is done.
- Start with `maxReceiveCount=5` for redrive.

## 10-Minute Console Execution Plan
1. Create consumer Lambda from existing Node.js runtime.
2. Add SQS trigger from `registration-notification-failures`.
3. Set `NOTIFICATION_RETRY_MODE=observe`.
4. Invoke one controlled producer failure (from rollout guide).
5. Confirm consumer log event `REGISTRATION_NOTIFICATION_FAILURE_CONSUMED`.
6. Optionally move to `retry` mode in a low-traffic window.

## Rollback
- Disable SQS trigger on consumer Lambda.
- Keep producer queueing enabled for later replay, or disable producer queue URL env var.
