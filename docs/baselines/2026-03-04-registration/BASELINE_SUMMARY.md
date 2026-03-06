# Registration Baseline Summary (2026-03-04)

Use this file to summarize current-state findings before registration hardening work.

## Scope
- Stack area: Registration (`/register`) for showcase auth flow.
- Region: `us-east-2`
- API: `ShowcaseRegisterAPI` (`u7fyurbrjc`)
- Lambda: `showcaseRegistration`
- Table: `Users`

## Environment Snapshot
- AWS account / profile: `NickHansonSr - 010928199012`
- Date/time captured: `2026-03-04`
- Captured by: Nick Hanson

## DynamoDB Findings
- Key schema: partition key `username (String)`; no sort key.
- GSIs/LSIs: no global secondary indexes configured (`0` shown); no local secondary indexes visible/configured.
- TTL status: `Off`.
- PITR status: `Off`.
- Stream status: DynamoDB Streams `Off`; Kinesis data stream integration `Off`.
- Noted constraints/risks: table is `On-demand` and `Active`; encryption uses `AWS owned key`; deletion protection `Off`; resource-based policy `Not active`; no active alarms; no tags; no recent exports; no GSIs configured; PITR `Off`; on-demand backups `0`. Key architectural risk: with only `username` as primary key and no email index/constraint, email uniqueness is not enforced at the table level.

## API Gateway Findings
- Routes discovered: `POST /login`, `POST /register`, `POST /tracking`.
- `/register` integration details: Lambda integration to `showcaseRegistration (us-east-2)`; payload format version `2.0 (interpreted response format)`; API Gateway timeout `30000 ms`; request/response parameter mappings `not configured`.
- Stage + deployment mode: stage `$default`; invoke URL `https://u7fyurbrjc.execute-api.us-east-2.amazonaws.com`; automatic deployment `enabled`; no stage variables configured.
- CORS + throttling posture: CORS is configured with `POST` allowed method, `content-type` and `authorization` allowed headers, `Access-Control-Allow-Credentials = NO`, and `Access-Control-Max-Age = 0`; allow-origin appears configured (likely `*`) in screenshot. Stage throttling for `$default`: no route-specific overrides configured; default route throttling `Burst = not configured`, `Rate = not configured`; account-level throttling `Burst = 5000`, `Rate = 10000`.

## Lambda Findings
- Runtime/handler: `Node.js 22.x`, handler `index.handler`, architecture `x86_64`; runtime update mode `Auto`; package size `14.1 MB`; no Lambda layers configured.
- Timeout/memory: timeout `3 seconds`; memory `128 MB`; ephemeral storage `512 MB`; SnapStart `None`.
- Env vars (sanitized): none configured (`0` environment variables).
- IAM role posture (least privilege?): execution role `showcaseRegistration-role-7avd1hce`; trigger is API Gateway `ShowcaseRegisterAPI` (`/register`). Role currently includes `AmazonDynamoDBFullAccess` (broad access, not least-privilege). Resource-based Lambda policy allows `apigateway.amazonaws.com` invoke permission.
- Logging posture: CloudWatch log group `/aws/lambda/showcaseRegistration` exists; retention is `Never expire`; metric filters `0`; subscription filters `0`; no explicit alarms shown. Invocation/runtime report lines are present in log streams.

## Functional Contract Baseline
### Success case
- Request sample: `POST /register` with JSON body from frontend including at least `username`, `password`, `email` (frontend currently also sends `confirmPassword` and `role`, but Lambda only uses `username/password/email`).
- Response sample: HTTP `201` with body `{"message":"User registered successfully"}`.

### Failure cases
- Validation failure behavior: no explicit validation branch exists in Lambda; malformed/missing inputs generally fall through to runtime/DB errors and return generic HTTP `500` with `{"message":"Error registering user"}`.
- Duplicate account behavior: no duplicate guard on write (`dynamoDB.put` without condition); existing `username` key can be overwritten and still return success (`201`).
- Internal error behavior: Lambda logs raw error via `console.error(error)` and returns generic HTTP `500` with `{"message":"Error registering user"}`.

## Data Quality Snapshot
- Username uniqueness in practice: effectively unique at table level (partition key is `username`); duplicates by username cannot coexist as separate items.
- Email uniqueness in practice: not unique (multiple records appear to share the same email; no email index/constraint exists).
- Casing/normalization anomalies: username and email normalization are not enforced by backend (no trim/lowercase logic), so mixed-case/format drift is possible.
- Missing/legacy attributes: user items are inconsistent beyond core fields (e.g., optional `knownIps` present for some items and absent for others); no baseline auth-hardening fields like `emailVerified`, `tokenVersion`, or `passwordChangedAt`.

## Risk Summary (Before Changes)
- High: potential silent overwrite of existing user records by username due to unconditional `put`; lack of server-side validation; no email uniqueness enforcement.
- Medium: broad Lambda IAM policy (`AmazonDynamoDBFullAccess`), no PITR/backups, and no TTL/streaming/audit structure for auth events.
- Low: minimal observability posture (basic logs only, no metric filters/alerts) and cost-related log retention setting (`Never expire`) that can be improved without major architecture changes.

## First Hardening Change Decision
- Recommended first change: implement a **Registration P0 Safety Patch** in the existing `showcaseRegistration` Lambda without changing API routes/table design yet:
	- add strict server-side input validation (username/email/password required, length/format checks);
	- normalize input (`trim`, lowercase email);
	- prevent overwrite with conditional write on username (`attribute_not_exists(username)`);
	- return stable safe errors (`400` validation, `409` username exists, `500` internal);
	- keep current response shape compatible for success path (`201` + message).
- Why first: this closes the highest immediate risks (silent overwrite, weak validation, inconsistent errors) with the smallest blast radius and no new AWS resources, while preserving current app flow during ongoing feature work.
- Rollback plan: publish new Lambda version, test, then if issues appear, revert API integration/alias to previous Lambda version; no DynamoDB schema/index changes in this first patch, so rollback is low friction.
- Execution playbook: see [../../REGISTRATION_P0_IMPLEMENTATION_PLAYBOOK.md](../../REGISTRATION_P0_IMPLEMENTATION_PLAYBOOK.md) for implementation and test sequence.

### Prioritized Hardening Actions (from baseline)

#### P0 (implement now)
- [x] Add server-side validation in registration Lambda for `username`, `email`, and `password` (required + format/length checks).
- [x] Normalize inbound data before persistence (`username` trim, `email` trim + lowercase).
- [x] Replace unconditional DynamoDB `put` with conditional write to prevent username overwrite (`attribute_not_exists(username)`).
- [x] Return stable, safe API errors (`400` validation, `409` duplicate username, `500` internal) with non-sensitive messages.
- [x] Keep successful response backward-compatible (`201` + success message) so current frontend does not break.
- [x] Publish Lambda version and smoke test valid + invalid + duplicate registration paths.

#### P1 (next short phase)
- [x] Tighten IAM from `AmazonDynamoDBFullAccess` to least-privilege table-scoped actions required by registration.
- [ ] Add `emailVerified`, `tokenVersion`, `passwordChangedAt`, and `updatedAt` fields for forward compatibility.
- [x] Define email identity policy (`username` unique, email reuse allowed) via [../../REGISTRATION_P1_EMAIL_UNIQUENESS_STRATEGY.md](../../REGISTRATION_P1_EMAIL_UNIQUENESS_STRATEGY.md).
- [ ] Enable basic data resilience controls (at minimum PITR and/or scheduled backups).
- [ ] Set CloudWatch log retention to cost-aware period (e.g., 7–14 days) and add minimal alerting for registration failures.

## Sign-off
- Ready for hardening: `yes`
- Notes: baseline is sufficient for P0 Lambda hardening patch; next data improvements (email identity policy alignment, PITR/backups, least-privilege IAM) can follow in later phases.
- P0 closure update (2026-03-06): failure-safety simulation validated (`500` generic), test toggle cleanup completed, production alias `prod` confirmed on Lambda version `3`, and normal registration path reconfirmed with `201`.
- P1 IAM closure update (2026-03-06): registration role moved to least-privilege (`dynamodb:PutItem` on `Users` table), `AmazonDynamoDBFullAccess` removed, post-cutover tests remained green (`201/409/400`), and CloudWatch invocation visibility remained healthy.
- Policy decision update (2026-03-06): email reuse is intentionally allowed; registration remains username-unique.
- Next execution step: align verification/recovery design to account-scoped flows (`username + email`) using [../../REGISTRATION_P1_EMAIL_UNIQUENESS_IMPLEMENTATION_PLAYBOOK.md](../../REGISTRATION_P1_EMAIL_UNIQUENESS_IMPLEMENTATION_PLAYBOOK.md).
- Cleanup closure update (2026-03-06): optional `UserEmailIndex` table removed, custom registration IAM narrowed to `Users` table only, and post-cleanup smoke tests remained green (`201` reused-email success, `409 USERNAME_EXISTS`, `400 VALIDATION_ERROR`).
- Next auth execution playbook: implement account-scoped recovery (`username + email`) via [../../ACCOUNT_RECOVERY_ACCOUNT_SCOPED_PLAYBOOK.md](../../ACCOUNT_RECOVERY_ACCOUNT_SCOPED_PLAYBOOK.md).
