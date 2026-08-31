# Registration P1 IAM Least-Privilege Playbook

Purpose: replace broad DynamoDB permissions on `showcaseRegistration` Lambda with a table-scoped policy required by the current registration flow.

## Scope
This playbook only tightens DynamoDB access for registration Lambda.

In scope:
- Remove dependency on `AmazonDynamoDBFullAccess` for registration path.
- Grant only `dynamodb:PutItem` on the `Users` table.
- Validate registration success and duplicate behavior still work.

Out of scope:
- Login Lambda IAM changes.
- DynamoDB schema redesign or email-uniqueness redesign.
- CloudWatch retention/alerting changes.

## Current Context
- Region: `us-east-2`
- Account: `010928199012`
- Lambda function: `showcaseRegistration`
- Execution role: `showcaseRegistration-role-7avd1hce`
- DynamoDB table: `Users`

## Exact Policy JSON (Customer Managed Policy)
Create a managed policy named: `showcaseRegistration-DynamoDBPutItem-Users`

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowPutItemOnUsersTable",
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem"
      ],
      "Resource": "arn:aws:dynamodb:us-east-2:010928199012:table/Users"
    }
  ]
}
```

Note:
- Keep CloudWatch logging permissions in place (typically from `AWSLambdaBasicExecutionRole`), or Lambda logging will fail.

## Console Rollout Steps (Safe Order)
1. Open IAM role `showcaseRegistration-role-7avd1hce`.
2. Confirm `AWSLambdaBasicExecutionRole` remains attached.
3. Create and attach managed policy `showcaseRegistration-DynamoDBPutItem-Users` using JSON above.
4. Keep `AmazonDynamoDBFullAccess` attached temporarily for this transition step.
5. Run smoke tests:
   - Valid new registration -> `201`
   - Existing username -> `409`
   - Missing username -> `400`
6. If tests pass, detach `AmazonDynamoDBFullAccess` from this role.
7. Run the same smoke tests again.
8. Publish a new Lambda version if AWS reports unpublished Lambda changes; for IAM-only changes, keep existing validated alias mapping.

## AWS CLI Alternative
If you prefer CLI, create policy and attach:

```bash
aws iam create-policy \
  --policy-name showcaseRegistration-DynamoDBPutItem-Users \
  --policy-document file://policy-registration-putitem-users.json

aws iam attach-role-policy \
  --role-name showcaseRegistration-role-7avd1hce \
  --policy-arn arn:aws:iam::010928199012:policy/showcaseRegistration-DynamoDBPutItem-Users
```

After validation, remove broad access:

```bash
aws iam detach-role-policy \
  --role-name showcaseRegistration-role-7avd1hce \
  --policy-arn arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess
```

## Validation Checklist
- [x] `showcaseRegistration-role-7avd1hce` has table-scoped policy attached.
- [x] `AmazonDynamoDBFullAccess` detached from `showcaseRegistration-role-7avd1hce`.
- [x] Registration success path still returns `201`.
- [x] Duplicate username still returns `409`.
- [x] Validation failure still returns `400`.
- [x] CloudWatch logs still appear for registration invocations.

## Rollback
If registration fails after detaching broad policy:
1. Re-attach `AmazonDynamoDBFullAccess` to `showcaseRegistration-role-7avd1hce`.
2. Re-run one known-good registration test.
3. Inspect CloudWatch logs for `AccessDenied` details.
4. Correct table ARN/action scope and retest.

## Evidence to Record
Capture outcomes in:
- `docs/dev/auth/baselines/2026-03-04-registration/RAW_OUTPUTS.md`
- `docs/dev/auth/baselines/2026-03-04-registration/BASELINE_SUMMARY.md`
