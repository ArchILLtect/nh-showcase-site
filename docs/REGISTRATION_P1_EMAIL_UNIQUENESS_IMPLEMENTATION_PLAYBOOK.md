# Registration P1 Email Policy Alignment Playbook (Reuse Allowed)

Purpose: align implementation and operations with the final policy that allows multiple accounts per email while keeping registration hardened.

## Scope
In scope:
- Keep username as unique identifier.
- Keep server-side email validation and normalization.
- Ensure registration allows reused emails.
- Align IAM to only required resources/actions for current behavior.
- Define next steps for account-scoped verification/recovery.

Out of scope:
- Enforcing unique email at registration.
- Transactional dual-table writes for email locking.

## Current Target Behavior
- New username + reused email -> `201`
- Existing username -> `409` with `USERNAME_EXISTS`
- Invalid/missing fields -> `400` with `VALIDATION_ERROR`

## Step 1 — Confirm Lambda behavior
In [lambda-functions/showcaseRegistration/index.mjs](../lambda-functions/showcaseRegistration/index.mjs):
- Registration write should be a single conditional put to `Users`.
- Do not block duplicate emails.
- Keep safe `400/409/500` response contract.

## Step 2 — IAM alignment for current behavior
Current registration role policy can be narrowed to the `Users` table only.

Use this policy JSON for registration write path:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowRegistrationPutUsersOnly",
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem"
      ],
      "Resource": [
        "arn:aws:dynamodb:us-east-2:010928199012:table/Users"
      ]
    }
  ]
}
```

Keep CloudWatch logging policy attached (`AWSLambdaBasicExecutionRole` equivalent).

## Step 3 — Optional cleanup decision for `UserEmailIndex`
Choose one:
- Keep table for future features (verification/recovery support), or
- Decommission table if not needed.

Either choice is valid for current behavior since registration no longer depends on it.

## Step 4 — Deploy and verify
1. Package/deploy current Lambda code.
2. Run Lambda console and live `/register` tests.
3. Publish version and move alias after validation.

### Required smoke tests
- New username + new email -> `201`
- New username + reused existing email -> `201`
- Existing username + any email -> `409`
- Missing required fields -> `400`
- Invalid email format -> `400`

## Step 5 — Verification/recovery design follow-up
For future email verification and password reset:
- Use account-scoped flow (`username + email`) when email can map to multiple accounts.
- Require username in recovery submission.
- Add per-IP and per-email throttling controls.

## Evidence to record
Capture outcomes in:
- `docs/baselines/2026-03-04-registration/RAW_OUTPUTS.md`
- `docs/baselines/2026-03-04-registration/BASELINE_SUMMARY.md`

## Exit Criteria
- Registration allows reused emails and remains stable.
- Username uniqueness remains enforced.
- IAM is scoped to current behavior (no unnecessary table dependency).
- Docs and runbooks reflect the final email policy decision.
