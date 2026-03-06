# Registration P1 IAM Console Click Path (5-Minute Runbook)

Purpose: execute least-privilege IAM tightening for `showcaseRegistration` using AWS Console only.

## Target
- Role: `showcaseRegistration-role-7avd1hce`
- Table: `Users`
- Region: `us-east-2`
- Account: `010928199012`

## Step A — Create scoped managed policy
1. Open AWS Console -> IAM -> Policies.
2. Click Create policy.
3. Select JSON tab.
4. Paste:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowPutItemOnUsersTable",
      "Effect": "Allow",
      "Action": ["dynamodb:PutItem"],
      "Resource": "arn:aws:dynamodb:us-east-2:010928199012:table/Users"
    }
  ]
}
```

5. Click Next.
6. Policy name: `showcaseRegistration-DynamoDBPutItem-Users`.
7. Click Create policy.

## Step B — Attach new policy to Lambda execution role
1. IAM -> Roles -> open `showcaseRegistration-role-7avd1hce`.
2. In Permissions policies, click Add permissions -> Attach policies.
3. Search and select `showcaseRegistration-DynamoDBPutItem-Users`.
4. Click Add permissions.
5. Confirm `AWSLambdaBasicExecutionRole` is still attached.
6. Keep `AmazonDynamoDBFullAccess` attached for now (temporary).

## Step C — Transitional validation (with both policies attached)
Run registration smoke tests:
- Valid new username -> `201`
- Duplicate username -> `409`
- Missing required field -> `400`

If all pass, continue.

## Step D — Remove broad DynamoDB policy
1. IAM -> Roles -> `showcaseRegistration-role-7avd1hce`.
2. In Permissions policies, select `AmazonDynamoDBFullAccess`.
3. Click Remove.
4. Confirm it is detached.

## Step E — Final validation after least-privilege cutover
Re-run the same smoke tests:
- Valid new username -> `201`
- Duplicate username -> `409`
- Missing required field -> `400`

Also verify CloudWatch logs still appear:
- Lambda -> `showcaseRegistration` -> Monitor -> View logs in CloudWatch.

## Step F — Version/alias pinning
1. Try Lambda -> `showcaseRegistration` -> Versions -> Publish new version.
2. If AWS reports no unpublished changes, treat this as expected for IAM-only updates and keep current validated alias mapping.
3. If a new version is published, update Aliases -> `prod` to that version.
4. Run one live `/register` request and confirm `201`.

## Rollback (if AccessDenied appears)
1. Re-attach `AmazonDynamoDBFullAccess` to `showcaseRegistration-role-7avd1hce`.
2. Confirm registration returns `201` again.
3. Inspect CloudWatch logs for denied action/resource and adjust scoped policy.

## Evidence to log
Record outputs in:
- `docs/baselines/2026-03-04-registration/RAW_OUTPUTS.md`
- `docs/baselines/2026-03-04-registration/BASELINE_SUMMARY.md`
