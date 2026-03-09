# Raw Capture Outputs (2026-03-04, refreshed 2026-03-09)

Paste command outputs here (or reference exported JSON files in this folder).

## AWS Identity
```text
Profile/account in use at capture time:
- AWS account/profile: NickHansonSr - 010928199012
- Region: us-east-2
- Capture date: 2026-03-04
```

## DynamoDB
```text
Table: Users
- Key schema: username (String) partition key; no sort key
- GSIs/LSIs: none configured
- Billing mode: on-demand
- PITR: Off
- TTL: Off
- Streams: Off
- Encryption: AWS owned key
- Deletion protection: Off
- Backups shown: none on-demand at capture time
```

## API Gateway
```text
API: ShowcaseRegisterAPI (u7fyurbrjc)
- Routes: POST /login, POST /register, POST /tracking
- Stage: $default (auto-deploy enabled)
- Invoke URL: https://u7fyurbrjc.execute-api.us-east-2.amazonaws.com
- /register integration: Lambda showcaseRegistration, payload format 2.0, timeout 30000 ms
- CORS: POST allowed; headers include content-type, authorization
- Stage throttling overrides: not configured
- Account throttling: burst 5000, rate 10000
```

## Lambda
```text
Function: showcaseRegistration
- Runtime: Node.js 22.x
- Handler: index.handler
- Architecture: x86_64
- Memory: 128 MB
- Timeout: 3 s
- Ephemeral storage: 512 MB
- Layers: none
- Env vars: none configured at baseline capture
- Runtime update mode: Auto
```

## IAM
```text
Execution role: showcaseRegistration-role-7avd1hce

Baseline posture at capture:
- Managed policy attached: AmazonDynamoDBFullAccess (broad)
- Logging policy: AWSLambdaBasicExecutionRole
- Lambda resource policy allows API Gateway invoke

Recorded later in same baseline runbook:
- P1 IAM cutover completed
- Attached custom least-privilege PutItem policy for Users table
- Detached AmazonDynamoDBFullAccess
```

## CloudWatch Logs
```text
Log group: /aws/lambda/showcaseRegistration
- Retention at baseline capture: Never expire
- Metric filters: 0
- Subscription filters: 0
- Invocation/runtime report lines present

Recorded later in project hardening:
- Auth/recovery log retention standardized to 2 weeks
```

## Functional Test Notes
```text
See "2026-03-04 Registration smoke results (user-run)" section below for captured outcomes and response examples.
```

### 2026-03-09 post-rollout verification and throttling validation

- Registration success, throttling, and verification lifecycle were revalidated end-to-end.
- Registration throttling now returns `429 RATE_LIMITED` and emits `REGISTER_RATE_LIMITED` structured logs.
- Verification token lifecycle now includes validated single-use and expiry enforcement.

### 2026-03-04 Registration smoke results (user-run)

```text
1) Valid new registration -> 201 (success, as before)

2) Duplicate username -> 409
	body: {"code":"USERNAME_EXISTS","message":"Username already exists"}

3) Missing required field(s) -> 400
	body: {"code":"VALIDATION_ERROR","message":"username, email, and password are required"}

4) Invalid email format -> 400
	body: {"code":"VALIDATION_ERROR","message":"email format is invalid"}

5) Weak password -> 400
	body: {"code":"VALIDATION_ERROR","message":"password must be at least 8 characters"}

6) Extra fields + nested object test (initial attempts) -> 400
	body: {"code":"VALIDATION_ERROR","message":"Invalid JSON request body"}
	note: caused by malformed JSON in Lambda Console test event body string (payload format issue, not nested object rejection).

6b) Extra fields + nested object test (rerun with corrected Lambda Console format) -> 201
	body: {"message":"User registered successfully"}
	note: confirms nested objects/extra fields are safely handled by current P0 handler.

7) Temporary internal error simulation -> 500
	body: {"code":"INTERNAL_ERROR","message":"Error registering user"}
	note: verified generic internal error contract; no sensitive details returned in response body.

8) Post-simulation cleanup -> complete
	action: test toggle disabled for production, new version published, alias prod pointed to version 3.
	verification: normal registration test returned 201 with body {"message":"User registered successfully"}.

9) P1 IAM least-privilege cutover -> complete
	action: attached `showcaseRegistration-DynamoDBPutItem-Users`; detached `AmazonDynamoDBFullAccess`; kept `AWSLambdaBasicExecutionRole` attached.
	verification after detach: valid registration -> 201, duplicate username -> 409, missing required fields -> 400.
	CloudWatch monitor/log tables: recent invocations present, no failed invocation entries observed.
	version note: IAM-only change produced no publishable Lambda version delta (expected behavior).
	live app path: registration and login both succeeded after IAM cutover.

10) Email policy realignment cleanup -> complete
	action: reverted registration to username-only uniqueness (email reuse allowed), deleted `UserEmailIndex` table, and narrowed custom policy back to `dynamodb:PutItem` on `Users` only.
	verification: new username + reused email -> 201; duplicate username -> 409 `USERNAME_EXISTS`; invalid email -> 400 `VALIDATION_ERROR`.
	logging check: CloudWatch logging policy remains attached and logs continue to appear.
```
