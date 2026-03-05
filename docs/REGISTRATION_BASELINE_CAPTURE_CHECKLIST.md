# Registration Baseline Capture Checklist

Purpose: capture a reliable “before” snapshot of the current registration stack so hardening changes are safe, testable, and reversible.

## Outputs to Produce
- [ ] A timestamped baseline notes file with key findings.
- [ ] JSON exports for DynamoDB/API/Lambda config.
- [ ] Example request/response payloads for registration success and failure.
- [ ] Screenshots of key AWS console pages (optional but useful).

## Prerequisites
- [ ] AWS CLI configured for correct account/profile/region.
- [ ] Region confirmed as `us-east-2`.
- [ ] Permissions to read DynamoDB, API Gateway, Lambda, IAM, CloudWatch.

## 1) Confirm Identity and Region
Run:
```bash
aws sts get-caller-identity
aws configure get region
```
Capture:
- [ ] Account ID and active principal.
- [ ] Active region.

## 2) DynamoDB Table Baseline (`Users`)
Run:
```bash
aws dynamodb describe-table --table-name Users --region us-east-2 > users-table.describe.json
aws dynamodb describe-continuous-backups --table-name Users --region us-east-2 > users-table.backups.json
aws dynamodb describe-time-to-live --table-name Users --region us-east-2 > users-table.ttl.json
```
Capture:
- [ ] Key schema (partition/sort key).
- [ ] Attribute definitions.
- [ ] GSIs/LSIs and projections.
- [ ] Billing mode and throughput config.
- [ ] Stream settings.
- [ ] PITR status.
- [ ] TTL status.
- [ ] Encryption/KMS details.

## 3) API Gateway Baseline (`ShowcaseRegisterAPI`)
For HTTP API (v2), run:
```bash
aws apigatewayv2 get-apis --region us-east-2 > apigw.apis.json
aws apigatewayv2 get-routes --api-id u7fyurbrjc --region us-east-2 > apigw.routes.json
aws apigatewayv2 get-integrations --api-id u7fyurbrjc --region us-east-2 > apigw.integrations.json
aws apigatewayv2 get-stages --api-id u7fyurbrjc --region us-east-2 > apigw.stages.json
```
Capture:
- [ ] Route list and methods (`/register`, `/login`, `/tracking`).
- [ ] Integration target Lambda ARN and payload format version.
- [ ] Stage settings and auto-deploy status.
- [ ] CORS config.
- [ ] Throttling/rate limit settings.

## 4) Lambda Baseline (`showcaseRegistration`)
Run:
```bash
aws lambda get-function --function-name showcaseRegistration --region us-east-2 > lambda.register.get-function.json
aws lambda get-function-configuration --function-name showcaseRegistration --region us-east-2 > lambda.register.config.json
aws lambda get-policy --function-name showcaseRegistration --region us-east-2 > lambda.register.policy.json
```
Capture:
- [ ] Runtime and architecture.
- [ ] Handler name.
- [ ] Timeout and memory.
- [ ] Environment variables (sanitize secrets before sharing).
- [ ] Execution role ARN.
- [ ] API Gateway invoke permission statement.

## 5) IAM + Permissions Baseline
Run:
```bash
aws iam get-role --role-name <lambda-execution-role-name> > iam.lambda-role.json
aws iam list-attached-role-policies --role-name <lambda-execution-role-name> > iam.lambda-role.attached-policies.json
aws iam list-role-policies --role-name <lambda-execution-role-name> > iam.lambda-role.inline-policies.json
```
Capture:
- [ ] Role trust policy.
- [ ] Attached policies and inline policies.
- [ ] Confirmation Lambda has least-privilege for DynamoDB + logs.

## 6) CloudWatch Logging Baseline
Run:
```bash
aws logs describe-log-groups --log-group-name-prefix /aws/lambda/showcaseRegistration --region us-east-2 > logs.register.log-groups.json
aws logs describe-metric-filters --log-group-name /aws/lambda/showcaseRegistration --region us-east-2 > logs.register.metric-filters.json
```
Capture:
- [ ] Log group retention policy.
- [ ] Existing metric filters/alerts.
- [ ] Any recurring error patterns in recent logs.

## 7) Functional Contract Baseline (Registration)
Collect from frontend + API behavior:
- [ ] Request body example (valid).
- [ ] Success response (`201`, response body).
- [ ] Validation failure response (if any current behavior).
- [ ] Duplicate user behavior (current response/status).
- [ ] Unexpected server error behavior.

Suggested manual test set:
- [ ] Valid new registration.
- [ ] Existing username/email registration.
- [ ] Invalid email format.
- [ ] Empty password.
- [ ] Extremely long username/email/password.

## 8) Data Quality Snapshot (Users Table)
From DynamoDB console or scan sample:
- [ ] Confirm whether username and email are unique in practice.
- [ ] Note mixed casing/normalization issues.
- [ ] Note missing attributes on older records.
- [ ] Identify legacy anomalies to preserve or migrate.

## 9) Save Baseline Bundle
- [ ] Store all exported JSON + notes in a dated folder (example: `docs/baselines/2026-03-04-registration/`).
- [ ] Add a short summary markdown with findings and risks.
- [ ] Record “go/no-go” notes for first hardening change.

## Minimum “Ready for Hardening” Criteria
- [ ] You know exact table key/index constraints.
- [ ] You know exact API route/integration behavior.
- [ ] You know exact Lambda runtime/config/permissions.
- [ ] You have at least one successful and one failing registration sample.
- [ ] You documented current duplicate-account behavior.
