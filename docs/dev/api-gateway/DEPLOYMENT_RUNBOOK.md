# API Gateway deployment and rollback runbook

## Purpose and safety boundary

The Showcase APIs are currently managed directly in API Gateway, not by CloudFormation, SAM, or CDK. This runbook and the dated OpenAPI exports make the currently working API shape reviewable and recoverable without introducing a risky IaC ownership migration.

The JSON files in [baselines/2026-11-09](baselines/2026-11-09/) are read-only snapshots from AWS. They are not an instruction to deploy immediately. They include account-specific API IDs and Lambda integration ARNs (resource identifiers, not credentials). Never commit AWS access keys, session tokens, passwords, or user records.

API Gateway exports capture route/method/integration definitions and REST preflight templates; stage deployment settings are separate and recorded in `baseline-manifest.json`. The HTTP API has separate `$default` and `prod` stage exports: at capture, `$default` included preview 17, but `prod` was still on its earlier November 5 deployment. Do not reimport the `prod` export as the current API definition.

The auth HTTP API export has only the seven active route integrations. AWS also reported seven unreferenced integration objects; they were not deleted and are intentionally excluded from the effective route definition.

No live AWS configuration was changed while creating this baseline.

## Current topology (us-east-2)

| API | Stage(s) | Active routes and integrations | Deployment behavior |
| --- | --- | --- | --- |
| HTTP `ShowcaseRegisterAPI` (`u7fyurbrjc`) | `$default`, `prod` | `POST /register` → `showcaseRegistration:prod`; `POST /login` → `showcaseLogin:prod`; `POST /session/validate` → `showcaseSessionValidate:prod`; `POST /forgot-password` → `showcaseForgotPassword:prod`; `POST /reset-password` → `showcaseResetPassword:prod`; `POST /verify-email` → `showcaseVerifyEmail:prod`; `POST /resend-verification` → `showcaseResendVerification:prod`. | `$default` auto-deploys. `prod` is manual-deploy and had not been redeployed with preview 17 at capture. |
| REST `ssaf-analytics-visitManager` (`9hxx3na0o7`) | `dev` | `OPTIONS /` → MOCK; `POST /` → `ssaf-analytics-trackVisit`. | REST changes require a new deployment associated with `dev`. Root POST throttle is 5 requests/second, burst 10. |
| REST `showcaseAnalytics` (`ldlg09zoq7`) | `dev` | `OPTIONS /` → MOCK; `POST /` → `ssaf-analytics-getUserVisits`; `OPTIONS /admin` → MOCK; `GET /admin` → `ssaf-analytics-getAllVisits`. | REST changes require a new deployment associated with `dev`; no stage method throttle is currently configured. |

API Gateway authorization is `NONE` for these routes. Analytics reads rely on the Lambda handlers to validate the bearer session and admin role; preserve that behavior. CORS is not authorization.

## CORS and throttling invariants

The current exact browser-origin allowlist on the live `$default` stage and the analytics REST stages is:

- `https://nickhanson.me`
- `https://www.nickhanson.me`
- `https://deploy-preview-6--resonant-ganache-9efedd.netlify.app`
- `https://deploy-preview-9--resonant-ganache-9efedd.netlify.app`
- `https://deploy-preview-10--resonant-ganache-9efedd.netlify.app`
- `https://deploy-preview-17--resonant-ganache-9efedd.netlify.app`

The `prod` HTTP API stage export at capture had the same production domains and previews 6, 9, and 10, but not preview 17. Production remains allowlisted there. That stage difference is recorded, not an error to fix automatically.

- HTTP API CORS is API-wide: methods `POST`; headers `content-type`, `authorization`; credentials disabled.
- REST APIs use `OPTIONS` MOCK integrations that echo only an exact approved origin and set `Vary: Origin`. Their Lambda proxy integrations independently enforce the same allowlist.
- When an approved origin changes, update the relevant HTTP API CORS configuration, REST API mock templates, and all three analytics Lambda allowlists together. Do not add wildcard origins.
- The writer REST stage setting is the root POST method only (`~1/POST` in the exported stage settings): rate 5, burst 10. This is aggregate best-effort throttling, not per-IP rate limiting.

## Before making a change

1. Confirm the target API ID and stage from this document and the live console. Do not rely only on a copied URL.
2. Confirm the current AWS identity and region:
   ```powershell
   aws sts get-caller-identity
   aws configure get region
   ```
   Use `us-east-2`; stop if the account is not the Showcase account.
3. Capture fresh exports and stage settings **before** editing. The committed baseline is a reference point, not necessarily the latest configuration:
   ```powershell
   $dir = "docs/dev/api-gateway/baselines/YYYY-MM-DD"
   New-Item -ItemType Directory -Force $dir | Out-Null

   aws apigatewayv2 export-api "$dir/auth-http-api-default.oas30.json" --api-id u7fyurbrjc --output-type JSON --specification OAS30 --include-extensions --stage-name '$default'
   aws apigatewayv2 export-api "$dir/auth-http-api-prod.oas30.json" --api-id u7fyurbrjc --output-type JSON --specification OAS30 --include-extensions --stage-name prod

   aws apigateway get-export "$dir/analytics-writer-rest-api.oas30.json" --rest-api-id 9hxx3na0o7 --stage-name dev --export-type oas30 --parameters extensions=integrations --accepts application/json
   aws apigateway get-export "$dir/analytics-readers-rest-api.oas30.json" --rest-api-id ldlg09zoq7 --stage-name dev --export-type oas30 --parameters extensions=integrations --accepts application/json

   aws apigatewayv2 get-api --api-id u7fyurbrjc | Set-Content -Encoding utf8 "$dir/auth-http-api.json"
   aws apigatewayv2 get-stages --api-id u7fyurbrjc | Set-Content -Encoding utf8 "$dir/auth-http-stages.json"
   aws apigateway get-rest-api --rest-api-id 9hxx3na0o7 | Set-Content -Encoding utf8 "$dir/analytics-writer-api.json"
   aws apigateway get-stage --rest-api-id 9hxx3na0o7 --stage-name dev | Set-Content -Encoding utf8 "$dir/analytics-writer-stage.json"
   aws apigateway get-rest-api --rest-api-id ldlg09zoq7 | Set-Content -Encoding utf8 "$dir/analytics-readers-api.json"
   aws apigateway get-stage --rest-api-id ldlg09zoq7 --stage-name dev | Set-Content -Encoding utf8 "$dir/analytics-readers-stage.json"
   ```
   The export commands take the output filename as a positional argument and save the definition there.
4. Compare the fresh export to the committed baseline. Explain every route, integration, CORS, or stage-setting difference in the change review. Keep the pre-change export as the rollback copy; do not replace the dated committed baseline until the new configuration has been verified.
5. For any CORS origin change, run the relevant Lambda tests and deploy Lambda code before relying on the API Gateway response. The Lambda allowlist and Gateway allowlist must agree.

## Deployment procedure

Make the smallest change in the appropriate API and stage; do not make unrelated API or Lambda changes in the same release.

### HTTP API

- Review the current API definition and the intended stage definition. The latest `$default` export is the source for the active API configuration; the `prod` export is a record of what that manual stage had deployed at capture.
- Apply a reviewed route/CORS update to API `u7fyurbrjc`. For a full, reviewed OpenAPI update, use `aws apigatewayv2 reimport-api --api-id u7fyurbrjc --body file://<REVIEWED_DEFINITION.json> --fail-on-warnings`. For a CORS-only change, update the API-level policy and preserve the exact allowlist, `POST`, `content-type`, `authorization`, and `AllowCredentials: false`.
- `$default` auto-deploys. Do not deploy to `prod` merely to sync a preview origin. For an intended production release, create a deployment only after reviewing the diff:
  ```powershell
  aws apigatewayv2 create-deployment --api-id u7fyurbrjc --stage-name prod --description "Reviewed Showcase API change"
  ```
- Confirm the `prod` stage points at the new deployment and verify allowed and unapproved-origin preflights.

### Analytics REST APIs

- Apply reviewed route, integration, or `OPTIONS` template changes to the intended API only. The exports contain the current Lambda proxy integrations and exact preflight VTL.
- Preserve the writer stage's root POST throttle (5 RPS / burst 10). Preserve Lambda-side session/admin authorization on the two read paths.
- Create a fresh deployment to `dev` after the API change:
  ```powershell
  aws apigateway create-deployment --rest-api-id 9hxx3na0o7 --stage-name dev --description "Reviewed visit-writer API change"
  aws apigateway create-deployment --rest-api-id ldlg09zoq7 --stage-name dev --description "Reviewed analytics-reader API change"
  ```
- REST deployments are snapshots; editing resources or methods alone does not publish them to the stage. Deploy one API at a time and verify before continuing.

### Verification

- Inspect the stage/deployment and compare its routes/integrations and method settings with the reviewed change.
- Send preflight requests from an approved and an unapproved origin. An approved preflight must echo the exact approved origin and include the expected methods/headers; an unapproved origin must not receive `Access-Control-Allow-Origin`.
- Verify a session-validation request with no token is rejected, and that authenticated User Tracking and All Tracking work using a real signed-in account.
- If testing the visit writer, remember a successful POST creates a real visit-log record. Use a deliberate, labeled smoke test and confirm it appears in the dashboard.
- Check Lambda CloudWatch logs for failures and check browser Network responses; do not treat a console “logged” message alone as proof of a successful write.

## Rollback

1. Before deploying, record each stage's current `deploymentId` from the fresh pre-change stage export. Keep the pre-change OpenAPI files and stage JSON in the review/incident record.
2. For a deployment-only regression, point the stage back to the recorded deployment:
   ```powershell
   aws apigateway update-stage --rest-api-id <API_ID> --stage-name dev --patch-operations "op=replace,path=/deploymentId,value=<PREVIOUS_DEPLOYMENT_ID>"
   aws apigatewayv2 update-stage --api-id u7fyurbrjc --stage-name prod --deployment-id <PREVIOUS_DEPLOYMENT_ID>
   ```
   Use the command matching that API type/stage. Do not point a stage at another API's deployment.
3. If the HTTP API definition itself must be restored, reimport the **pre-change latest/$default** export, not the older `prod` stage export:
   ```powershell
   aws apigatewayv2 reimport-api --api-id u7fyurbrjc --body file://<PRE_CHANGE_AUTH_DEFAULT_EXPORT.json> --fail-on-warnings
   ```
   The `$default` stage auto-deploys. Create a new `prod` deployment only if that rollback is intended to affect production.
4. If a REST API definition itself must be restored, import the pre-change full REST export to the **same** API after reviewing it, then redeploy:
   ```powershell
   aws apigateway put-rest-api --rest-api-id <API_ID> --mode overwrite --body file://<PRE_CHANGE_EXPORT.json>
   aws apigateway create-deployment --rest-api-id <API_ID> --stage-name dev --description "Rollback to reviewed pre-change API definition"
   ```
   `overwrite` can remove resources absent from the file; confirm it is a complete export for the intended API before running it. Reapply stage-level settings from the pre-change stage JSON, especially the writer throttle.
5. Repeat the verification steps above and record the rollback deployment IDs and outcome.

## Baseline refresh

After a change is deployed and verified, add a new dated snapshot directory using the capture commands above, update the manifest and inventory, and include the change/verification date in the changelog. Keep older snapshots as history. This is intentionally a reviewable, manually operated workflow; moving the APIs into full IaC would require a separate migration plan and explicit resource-ownership review.

