# Raw Capture Outputs (2026-03-04)

Paste command outputs here (or reference exported JSON files in this folder).

## AWS Identity
```text
<aws sts get-caller-identity output>
```

## DynamoDB
```text
<describe-table / backups / ttl key excerpts>
```

## API Gateway
```text
<get-routes / get-integrations / get-stages excerpts>
```

## Lambda
```text
<get-function / get-function-configuration / get-policy excerpts>
```

## IAM
```text
<role + policies excerpts>
```

## CloudWatch Logs
```text
<log group + metric filters excerpts>
```

## Functional Test Notes
```text
<manual test request/response snapshots>
```

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

7) Temporary internal error simulation (pending)
	expected body: {"code":"INTERNAL_ERROR","message":"Error registering user"}
	note: run only while ENABLE_INTERNAL_ERROR_TEST=true, then disable and reverify normal 201 path.
```
