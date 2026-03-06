# Registration P0 Implementation Playbook

Purpose: execute the first hardening change safely on the current `showcaseRegistration` Lambda.

## Scope
This playbook covers only the P0 safety patch:
- Server-side validation
- Input normalization
- Conditional write to prevent overwrite
- Stable error contract
- Backward-compatible success response

Out of scope:
- New DynamoDB indexes or table redesign
- Email uniqueness model redesign
- Full IAM least-privilege refactor

## Future Items (Post-P0)
- [ ] Add DynamoDB index/table strategy to enforce email uniqueness at data-layer level.
- [ ] Implement full email uniqueness model redesign and migration/backfill plan.
- [ ] Replace broad IAM access with least-privilege, table-scoped policy set.

## Preconditions
- [x] Baseline completed in `docs/baselines/2026-03-04-registration/BASELINE_SUMMARY.md`
- [x] Rollback target identified (current Lambda version ARN/number documented before deploy)
- [x] Test account data available for duplicate/invalid test cases (known existing username + throwaway new username/email + invalid input payloads prepared) via `docs/baselines/2026-03-04-registration/REGISTRATION_TEST_DATA.md`

## Implementation Steps

### Step 1: Add validation + normalization
Update Lambda logic to:
- Parse body safely
- Require `username`, `email`, `password`
- Enforce basic checks:
  - `username` length/allowed chars
  - email format
  - password minimum length/complexity (use current policy)
- Normalize inputs:
  - `username = username.trim()`
  - `email = email.trim().toLowerCase()`

Acceptance:
- Invalid input returns `400` with a stable error code/message.

### Step 2: Add duplicate overwrite protection (username)
Replace unconditional `put` with conditional write:
- Use `ConditionExpression: attribute_not_exists(username)`

Handle DynamoDB condition failure:
- Return `409` with stable conflict message/code.

Acceptance:
- Existing username no longer overwrites prior user item.

### Step 3: Keep success contract compatible
On success keep:
- HTTP `201`
- Body containing success message (`User registered successfully`)

Acceptance:
- Existing frontend register flow continues working without code change.

### Step 4: Harden error handling
- Map known validation/conflict/internal failures to stable response codes.
- Avoid leaking stack traces/internal details in response.
- Keep error details in logs only.

Suggested contract:
- `400` -> `VALIDATION_ERROR`
- `409` -> `USERNAME_EXISTS`
- `500` -> `INTERNAL_ERROR`

Acceptance:
- Error responses are deterministic and safe.

### Step 5: Deploy safely
- Publish/update Lambda code.
- Create/publish Lambda version after verification.
- Ensure API Gateway route still points to expected function/version/alias.

Acceptance:
- Deployment complete with no route/integration drift.

## Test Matrix (Smoke + Edge)

### Positive
- [x] New unique username + valid email/password -> `201`

### Negative: Validation
- [x] Missing username -> `400`
- [x] Invalid email format -> `400`
- [x] Weak password -> `400`
- [x] Extra unexpected fields do not break handler

### Negative: Conflict
- [x] Existing username -> `409` and no overwrite

### Failure Safety
- [x] Simulated internal exception -> `500` generic response
- [x] No sensitive data exposed in response body

#### Temporary failure-safety test toggle (safe procedure)
Use this only to validate the `500` contract, then turn it back off.

1. In Lambda environment variables, set `ENABLE_INTERNAL_ERROR_TEST=true`.
2. Deploy/publish and make sure API Gateway uses this updated version/alias.
3. Send a valid registration payload that includes `"__simulateInternalError": true`.
4. Verify response is HTTP `500` with generic body:
  - `{"code":"INTERNAL_ERROR","message":"Error registering user"}`
5. Verify response body does not include stack traces, AWS internals, or secrets.
6. Remove or set `ENABLE_INTERNAL_ERROR_TEST=false`.
7. Re-deploy/publish and rerun a normal success payload to confirm `201` path still works.

## Rollback Procedure
1. Revert API integration/alias to previous Lambda version.
2. Re-run known-good registration test.
3. Confirm no schema/index changes were made (P0 does not require them).
4. Document incident + root cause in baseline notes.

## Deliverables
- [x] Updated Lambda source for P0 safety patch
- [x] Test evidence (request/response captures)
- [x] Deployment record (version + timestamp)
- [x] Updated baseline notes with outcomes

## Exit Criteria
- No silent overwrite on duplicate username.
- Validation failures return `400` (not generic `500`).
- Success behavior remains compatible with current frontend.
- Internal errors remain generic and safe.
