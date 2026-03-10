# Registration Baseline Capture Checklist

Purpose: capture a reliable “before” snapshot of the current registration stack so hardening changes are safe, testable, and reversible.

## Post-Rollout Capture Pass (2026-03-09)
- This checklist has been reused as a **post-rollout baseline refresh** after registration verification/hardening Phase A.
- Evidence was captured via Lambda/API tests, CloudWatch logs, DynamoDB table checks, and linked baseline docs under `docs/dev/auth/baselines/2026-03-04-registration/`.
- Use this snapshot as the new known-good checkpoint before the next hardening phase.

## Outputs to Produce
- [x] A timestamped baseline notes file with key findings.
- [x] JSON exports for DynamoDB/API/Lambda config.
	- Captured on 2026-03-10 to `docs/dev/auth/baselines/2026-03-10-registration-config-exports/` (sanitized Lambda env values; `export.manifest.json` shows `failures: []`).
	- Re-run command: `npm run export:auth-baseline`
- [x] Example request/response payloads for registration success and failure.
- [x] Screenshots of key AWS console pages (optional but useful).

## Prerequisites
- [x] AWS CLI configured for correct account/profile/region.
- [x] Region confirmed as `us-east-2`.
- [x] Permissions to read DynamoDB, API Gateway, Lambda, IAM, CloudWatch.

## 1) Confirm Identity and Region
Run:
```bash
aws sts get-caller-identity
aws configure get region
```
Capture:
- [x] Account ID and active principal.
- [x] Active region.

## 2) DynamoDB Table Baseline (`Users`)
Run:
```bash
aws dynamodb describe-table --table-name Users --region us-east-2 > users-table.describe.json
aws dynamodb describe-continuous-backups --table-name Users --region us-east-2 > users-table.backups.json
aws dynamodb describe-time-to-live --table-name Users --region us-east-2 > users-table.ttl.json
```
Capture:
- [x] Key schema (partition/sort key).
- [x] Attribute definitions.
- [x] GSIs/LSIs and projections.
- [x] Billing mode and throughput config.
- [x] Stream settings.
- [x] PITR status.
- [x] TTL status.
- [x] Encryption/KMS details.

## 3) API Gateway Baseline (`ShowcaseRegisterAPI`)
For HTTP API (v2), run:
```bash
aws apigatewayv2 get-apis --region us-east-2 > apigw.apis.json
aws apigatewayv2 get-routes --api-id u7fyurbrjc --region us-east-2 > apigw.routes.json
aws apigatewayv2 get-integrations --api-id u7fyurbrjc --region us-east-2 > apigw.integrations.json
aws apigatewayv2 get-stages --api-id u7fyurbrjc --region us-east-2 > apigw.stages.json
```
Capture:
- [x] Route list and methods (`/register`, `/login`, `/tracking`).
- [x] Integration target Lambda ARN and payload format version.
- [x] Stage settings and auto-deploy status.
- [x] CORS config.
- [x] Throttling/rate limit settings.

## 4) Lambda Baseline (`showcaseRegistration`)
Run:
```bash
aws lambda get-function --function-name showcaseRegistration --region us-east-2 > lambda.register.get-function.json
aws lambda get-function-configuration --function-name showcaseRegistration --region us-east-2 > lambda.register.config.json
aws lambda get-policy --function-name showcaseRegistration --region us-east-2 > lambda.register.policy.json
```
Capture:
- [x] Runtime and architecture.
- [x] Handler name.
- [x] Timeout and memory.
- [x] Environment variables (sanitize secrets before sharing).
- [x] Execution role ARN.
- [x] API Gateway invoke permission statement.

## 5) IAM + Permissions Baseline
Run:
```bash
aws iam get-role --role-name <lambda-execution-role-name> > iam.lambda-role.json
aws iam list-attached-role-policies --role-name <lambda-execution-role-name> > iam.lambda-role.attached-policies.json
aws iam list-role-policies --role-name <lambda-execution-role-name> > iam.lambda-role.inline-policies.json
```
Capture:
- [x] Role trust policy.
- [x] Attached policies and inline policies.
- [x] Confirmation Lambda has least-privilege for DynamoDB + logs.

## 6) CloudWatch Logging Baseline
Run:
```bash
aws logs describe-log-groups --log-group-name-prefix /aws/lambda/showcaseRegistration --region us-east-2 > logs.register.log-groups.json
aws logs describe-metric-filters --log-group-name /aws/lambda/showcaseRegistration --region us-east-2 > logs.register.metric-filters.json
```
Capture:
- [x] Log group retention policy.
- [x] Existing metric filters/alerts.
- [x] Any recurring error patterns in recent logs.

## 7) Functional Contract Baseline (Registration)
Collect from frontend + API behavior:
- [x] Request body example (valid).
- [x] Success response (`201`, response body).
- [x] Validation failure response (if any current behavior).
- [x] Duplicate user behavior (current response/status).
- [x] Unexpected server error behavior.

Suggested manual test set:
- [x] Valid new registration.
- [x] Existing username/email registration.
- [x] Invalid email format.
- [x] Empty password.
- [ ] Extremely long username/email/password.

## 8) Data Quality Snapshot (Users Table)
From DynamoDB console or scan sample:
- [x] Confirm whether username and email are unique in practice.
- [x] Note mixed casing/normalization issues.
- [x] Note missing attributes on older records.
- [x] Identify legacy anomalies to preserve or migrate.

## 9) Save Baseline Bundle
- [x] Store all exported JSON + notes in a dated folder (example: `docs/baselines/2026-03-04-registration/`).
- [x] Add a short summary markdown with findings and risks.
- [x] Record “go/no-go” notes for first hardening change.

## Minimum “Ready for Hardening” Criteria
- [x] You know exact table key/index constraints.
- [x] You know exact API route/integration behavior.
- [x] You know exact Lambda runtime/config/permissions.
- [x] You have at least one successful and one failing registration sample.
- [x] You documented current duplicate-account behavior.
