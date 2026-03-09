# Registration Rollout Toggles + Rollback Guide

Last updated: 2026-03-09

Purpose: provide low-cost staged rollout and rollback controls for registration verification email dispatch.

## Toggle Controls (Lambda Env Vars)
- `REGISTRATION_VERIFICATION_EMAIL_MODE`
  - `on` (default): normal behavior; issue token and attempt SES send for all new registrations.
  - `off`: skip token/email dispatch entirely; registration still succeeds with `verificationPending=true` and `verificationEmailSent=false`.
  - `canary`: deterministic percentage rollout based on account hash.
- `REGISTRATION_VERIFICATION_EMAIL_CANARY_PERCENT`
  - Used only when mode is `canary`.
  - Range `0-100` (values outside range are clamped).
  - Example: `10` means ~10% of accounts attempt token/email dispatch.

## Async Notification Failure Strategy (Low-Cost)
- `REGISTRATION_NOTIFICATION_FAILURES_QUEUE_URL` (optional)
  - If set, post-create verification notification failures enqueue a retry intent message to SQS.
  - If unset, behavior remains fail-open with structured logs only.
- Queue payload intent type: `register_verification_email_failed`.
- Recommended queue setup:
  - Standard SQS queue with default SSE enabled.
  - Optional DLQ redrive policy for repeated consumer failures.

## Cost Notes
- Env-var toggles (`on/off/canary`) are effectively no incremental AWS cost.
- Optional SQS fallback is usage-based and typically very low cost at current expected auth volume.
- Keep queue disabled until needed by leaving `REGISTRATION_NOTIFICATION_FAILURES_QUEUE_URL` unset.

## Minimal Env Var Sets (Copy/Paste)

### Dev / Safe validation (no new service cost)
- `REGISTRATION_VERIFICATION_EMAIL_MODE=off`
- `REGISTRATION_VERIFICATION_EMAIL_CANARY_PERCENT=0`
- `REGISTRATION_NOTIFICATION_FAILURES_QUEUE_URL=` (leave empty/unset)

Result:
- Registration continues working.
- No verification token/email dispatch attempts.
- No SQS usage/cost.

### Prod rollout (low-cost canary)
Phase 1:
- `REGISTRATION_VERIFICATION_EMAIL_MODE=canary`
- `REGISTRATION_VERIFICATION_EMAIL_CANARY_PERCENT=5`
- `REGISTRATION_NOTIFICATION_FAILURES_QUEUE_URL=` (leave empty/unset initially)

Phase 2 (after stable logs):
- raise canary to `25`, then `50`, then `100`

Phase 3 (steady state):
- `REGISTRATION_VERIFICATION_EMAIL_MODE=on`
- `REGISTRATION_VERIFICATION_EMAIL_CANARY_PERCENT=100`

Optional resilience upgrade (still low cost):
- Set `REGISTRATION_NOTIFICATION_FAILURES_QUEUE_URL=https://sqs.us-east-2.amazonaws.com/<account-id>/registration-notification-failures`

## Rollout Sequence (Safe + Cheap)
1. Start with `REGISTRATION_VERIFICATION_EMAIL_MODE=off` after deploying new lambda version.
2. Move to `canary` with `REGISTRATION_VERIFICATION_EMAIL_CANARY_PERCENT=5`.
3. Validate logs and user outcomes.
4. Increase to `25`, then `50`, then `100`.
5. Switch mode to `on` after stable behavior is confirmed.

## Fast Rollback
1. Immediate mitigation: set `REGISTRATION_VERIFICATION_EMAIL_MODE=off` and deploy config.
2. If needed, repoint API Gateway integration to last known-good Lambda alias/version.
3. Confirm baseline behavior:
   - Registration returns `201`.
   - User is created with `emailVerified=false`.
   - No token/email dispatch attempts while mode is `off`.
4. Review CloudWatch structured events:
   - `REGISTER_VERIFICATION_SKIPPED`
   - `REGISTER_VERIFICATION_POST_CREATE_FAILED`
   - `REGISTER_NOTIFICATION_FAILURE_ENQUEUED` / `REGISTER_NOTIFICATION_FAILURE_ENQUEUE_FAILED`

## Minimum IAM Additions (Only If Queue Enabled)
- For `showcaseRegistration` role, add:
  - `sqs:SendMessage` on the queue ARN referenced by `REGISTRATION_NOTIFICATION_FAILURES_QUEUE_URL`.

Policy statement (attach to existing lambda role policy):

```json
{
  "Sid": "AllowRegistrationNotificationFailureQueueSend",
  "Effect": "Allow",
  "Action": [
    "sqs:SendMessage"
  ],
  "Resource": "arn:aws:sqs:us-east-2:010928199012:registration-notification-failures"
}
```

Notes:
- Keep this statement out until queue URL is configured.
- If you later add a consumer lambda, scope its receive/delete permissions separately on the same queue.

## Next Version Description (Canary 5%)
Use this when publishing the next lambda version after moving from `off` to `canary` at 5%:

Registration canary rollout (5%): verification dispatch mode set to canary, stricter registration validation active (email max 254, password complexity + weak-password rejection), optional SQS failure-intent path retained.

Short variant:

Registration canary 5% enabled; strict email/password validation and weak-password rejection active; optional SQS failure-intent fallback retained.

## AWS Console 5-Minute Runbook (Env + IAM)
Goal: move safely from `off` to `canary` 5% with least privilege and minimal cost.

### Step 1: Update Lambda environment variables (2 minutes)
1. Open AWS Console -> Lambda -> Functions -> `showcaseRegistration`.
2. Select Configuration -> Environment variables -> Edit.
3. Set:
  - `REGISTRATION_VERIFICATION_EMAIL_MODE` = `canary`
  - `REGISTRATION_VERIFICATION_EMAIL_CANARY_PERCENT` = `5`
  - `REGISTRATION_NOTIFICATION_FAILURES_QUEUE_URL` = empty/unset (for no new SQS cost in this phase)
4. Click Save.

### Step 2: Publish a version (1 minute)
1. In `showcaseRegistration`, open Versions.
2. Click Publish new version.
3. Description: paste the "Next Version Description (Canary 5%)" text above.
4. Confirm publish.

### Step 3: IAM add/remove decision for SQS permission (1 minute)
Open IAM -> Roles -> `showcaseRegistration-role-7avd1hce` (or current execution role).

Path A (queue disabled; current low-cost mode):
1. Permissions tab -> open inline/managed policy containing Sid `AllowRegistrationNotificationFailureQueueSend`.
2. Remove that statement (or detach queue-specific policy).
3. Save policy.

Path B (queue enabled later):
1. Permissions tab -> Add permissions -> Create inline policy (or edit existing least-privilege policy).
2. Add statement:

```json
{
  "Sid": "AllowRegistrationNotificationFailureQueueSend",
  "Effect": "Allow",
  "Action": ["sqs:SendMessage"],
  "Resource": "arn:aws:sqs:us-east-2:010928199012:registration-notification-failures"
}
```

3. Save and confirm attached policy.

### Step 4: Quick verification (1 minute)
1. Run 3-5 registration attempts with valid data.
2. In CloudWatch Logs for `showcaseRegistration`, confirm expected mix of:
  - `REGISTER_SUCCEEDED` (some with `verificationEmailSent=true`)
  - `REGISTER_VERIFICATION_SKIPPED` (canary-disabled requests)
3. Confirm no spike in `REGISTER_VERIFICATION_POST_CREATE_FAILED`.

### Immediate rollback
1. Lambda -> `showcaseRegistration` -> Configuration -> Environment variables.
2. Set `REGISTRATION_VERIFICATION_EMAIL_MODE=off` and `REGISTRATION_VERIFICATION_EMAIL_CANARY_PERCENT=0`.
3. Save and re-test one registration.

## Enable `REGISTRATION_NOTIFICATION_FAILURES_QUEUE_URL` Now (Hands-On)
Goal: enable low-cost failure-intent queueing so post-create verification failures are captured for retry/inspection.

### Step 1: Create SQS queue (2 minutes)
1. AWS Console -> SQS -> Create queue.
2. Type: Standard.
3. Name: `registration-notification-failures`.
4. Keep defaults (SSE enabled).
5. Create queue and copy Queue URL + ARN.

### Step 2: Wire Lambda env var (1 minute)
1. AWS Console -> Lambda -> `showcaseRegistration` -> Configuration -> Environment variables -> Edit.
2. Set `REGISTRATION_NOTIFICATION_FAILURES_QUEUE_URL` to the copied Queue URL.
3. Save.

### Step 3: Add IAM permission (1 minute)
1. IAM -> Roles -> `showcaseRegistration-role-7avd1hce` (or current execution role).
2. Edit policy and ensure this statement exists with your queue ARN:

```json
{
  "Sid": "AllowRegistrationNotificationFailureQueueSend",
  "Effect": "Allow",
  "Action": ["sqs:SendMessage"],
  "Resource": "arn:aws:sqs:us-east-2:010928199012:registration-notification-failures"
}
```

3. Save policy.

### Step 4: Validate end-to-end (3-5 minutes)
Use a temporary, controlled failure to exercise queueing (recommended in low-traffic window):
1. Lambda -> `showcaseRegistration` -> Environment variables.
2. Temporarily change `EMAIL_VERIFICATION_TOKENS_TABLE_NAME` to a non-existent table name (for one test only).
3. Run one registration test event.
4. Expected results:
   - API response still `201` with `verificationEmailSent=false`.
   - CloudWatch logs include:
     - `REGISTER_VERIFICATION_POST_CREATE_FAILED`
     - `REGISTER_NOTIFICATION_FAILURE_ENQUEUED`
   - SQS queue depth increments by 1 message.
5. Immediately restore the correct `EMAIL_VERIFICATION_TOKENS_TABLE_NAME` value.

### Step 5: Return to normal operation
- Keep queue URL configured if you want ongoing fallback capture.
- Or remove `REGISTRATION_NOTIFICATION_FAILURES_QUEUE_URL` and IAM statement to return to logs-only mode.

Companion next step:
- For a minimal consumer implementation, follow `REGISTRATION_NOTIFICATION_FAILURES_CONSUMER_MVP.md`.

Safety note:
- Do not leave `EMAIL_VERIFICATION_TOKENS_TABLE_NAME` intentionally broken after validation.

## Validation Evidence Snapshot (2026-03-09)
- Controlled failure test (temporary bad `EMAIL_VERIFICATION_TOKENS_TABLE_NAME`):
  - Lambda response: `201` with `verificationEmailSent=false`.
  - Invocation request id: `30a52dcf-8f15-40e3-9c2d-92f4ba5e8085`.
  - Observed events:
    - `REGISTER_VERIFICATION_POST_CREATE_FAILED`
    - `REGISTER_NOTIFICATION_FAILURE_ENQUEUED`
    - `REGISTER_SUCCEEDED` with `verificationEmailSent=false`
- Restore test (real table name restored):
  - Lambda response: `201` with `verificationEmailSent=true`.
  - Invocation request id: `d8d17550-4429-49df-b4ca-eda02cd47e49`.
  - Observed event: `REGISTER_SUCCEEDED` with `verificationEmailSent=true` and `verificationDispatchMode=canary`.
  - Verification email delivery confirmed.

Result:
- Normal registration verification path and queue-backed fallback path were both validated successfully in the same deployment window.
