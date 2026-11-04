# Showcase API CORS Inventory

Last verified: 2026-11-04 (AWS deployment and limited live smoke check; `us-east-2`).

This note maps browser-facing API calls in this repository to the AWS API Gateway resources currently serving them. AWS configuration is not yet defined by infrastructure-as-code in this repository; these findings are a point-in-time inventory, not a deployment recipe.

## Current API surfaces

| Client call | API | Gateway configuration | Backend |
| --- | --- | --- | --- |
| Auth flows (`src/config/api.js`) | HTTP API `ShowcaseRegisterAPI` (`u7fyurbrjc`) | Native API-level CORS allows `https://nickhanson.me`, `https://www.nickhanson.me`, `https://deploy-preview-6--resonant-ganache-9efedd.netlify.app`, and `https://deploy-preview-9--resonant-ganache-9efedd.netlify.app`, and `https://deploy-preview-10--resonant-ganache-9efedd.netlify.app`; methods `POST`; headers `content-type`, `authorization`. | Auth Lambdas. Native HTTP API CORS applies across the API and API Gateway ignores integration CORS headers when it is enabled. |
| Visit logging (`src/utils/visitTracker.js`) | REST API `ssaf-analytics-visitManager` (`9hxx3na0o7`), stage `dev` | Root `OPTIONS` mock response is configured with `Access-Control-Allow-Origin: *`. | Root `POST` invokes the source-controlled `ssaf-analytics-trackVisit` handler; the function remains reserved-concurrency `0`. |
| Visit log dashboard (`src/components/VisitLogsDashboard.jsx`) | REST API `showcaseAnalytics` (`ldlg09zoq7`), stage `dev` | Root `OPTIONS` and `/admin` `OPTIONS` mock responses are configured with `Access-Control-Allow-Origin: *`. | Root `POST` invokes source-controlled `ssaf-analytics-getUserVisits`; `/admin` `GET` invokes source-controlled `ssaf-analytics-getAllVisits`. Both remain reserved-concurrency `0`. |

The HTTP API also has a `POST /tracking` route to `ssaf-analytics-getUserVisits`, but searches of the current frontend source found no call to that route. Confirm whether it is still used by another client before changing or removing it.

The initial deployed packages were found to lack server-side authorization and used wildcard response CORS. Remediation packages are now deployed. API Gateway methods still report `authorizationType: NONE` and `apiKeyRequired: false`; security therefore depends on the deployed Lambda handlers enforcing bearer-session validation and role checks. Keep all three analytics functions paused until authenticated personal/admin smoke tests are completed.

The historical `getAllVisits` package scanned the full visit-log table, and the historical `getUserVisits` package trusted caller-provided IP filters. These records include visitor IP, user agent, path, and timestamp. The deployed remediation derives per-user scope from the session validator and requires an admin role for full-site reads. No analytics data endpoint was invoked during the remediation smoke check.

The historical visit-logging package accepted client-provided `ip`, `userAgent`, and `path` without validation/rate limiting, and its error response omitted CORS headers. The deployed source now derives IP and user-agent from API Gateway request metadata; rate limiting and explicit error-response CORS remain follow-up work.

## Temporary containment

On 2026-11-04, reserved concurrency was set to `0` for `ssaf-analytics-trackVisit`, `ssaf-analytics-getUserVisits`, and `ssaf-analytics-getAllVisits`; read-back confirmed all three settings. Their prior reserved-concurrency setting was unset, and inspection found no event-source mappings or Lambda Function URLs. This blocks all three functions, including every API Gateway route to the two read handlers, while preserving their code, routes, and stored data. Visit collection and dashboard reads remain unavailable pending valid authenticated-session testing and an explicit decision to restore concurrency.

## Remediation deployed; analytics traffic remains paused

Source for all three analytics handlers is now maintained under `lambda-functions/ssaf-analytics-*`. Personal visits require a valid bearer token and use `knownIps` returned by the existing server-side session validator, so caller-supplied IP filters cannot select another account's records. The all-visits scan requires a server-validated `admin` role. The session validator response now includes the authenticated account's `knownIps` for that purpose. Visit ingestion uses the API Gateway source IP and user-agent headers rather than client-provided identity fields. Browser clients send their bearer token and do not persist visit records in local storage.

Deployment readback in `us-east-2` confirmed `showcaseSessionValidate:prod` targets version `4`, all three analytics functions have the remediation code deployed, and all three remain at reserved concurrency `0`. The HTTP API CORS allowlist includes the exact preview-9 origin. A missing-token session-validation request from preview-9 returned 401 with the expected CORS header, and its POST preflight returned 204. No valid personal-session or admin-session analytics request was tested, so the data endpoints remain disabled. REST API mock `OPTIONS` responses still use wildcard CORS; this is a separate tracked hardening item.

API Gateway routes still have no gateway authorizer; the deployed Lambda handlers must remain the authorization boundary. Do not restore concurrency until valid personal and admin requests have been safely tested and the remaining CORS behavior has been reviewed. When restoration is approved, the prior concurrency setting was unset, so remove the temporary reserved-concurrency setting with `DeleteFunctionConcurrency` rather than assigning an arbitrary limit.

## Live preflight verification

Historical REST API `OPTIONS` requests to the visit logger root (`POST`), dashboard root (`POST`), and dashboard `/admin` (`GET`) from production and an untrusted origin returned HTTP 200 with `Access-Control-Allow-Origin: *`. After the remediation deployment, the preview-9 HTTP API preflight for session validation returned 204 with the expected allow-origin/method/header values. A no-token session-validation POST returned 401 and the expected allow-origin header. No analytics data was requested; authenticated personal/admin cases remain unverified.

## Safe follow-up

1. Keep the auth HTTP API's native CORS allowlist explicit and shared across its routes unless a real route needs a different origin policy. HTTP API native CORS is API-wide; per-route policies require moving CORS handling to each integration or separating APIs.
2. Complete authenticated personal-user and administrator smoke tests for the deployed analytics readers before restoring their concurrency.
3. Keep the analytics Lambda code source-controlled in this repository and document each AWS deployment.
4. Replace wildcard preflight origins on both REST APIs with individually approved origins, and make each Lambda-proxy response use the same explicit origin policy.
5. Verify actual requests from production, the approved preview, and an unapproved origin. Treat CORS as browser policy, not as authorization.
6. Add validation/rate limiting to public visit ingestion and ensure error responses include the intended CORS headers.
7. Decide whether the HTTP API's `/tracking` route is still needed and document its owner.

## References

- [AWS: Configure CORS for HTTP APIs](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-cors.html)
- [AWS SAM: CORS configuration and proxy integrations](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-api-corsconfiguration.html)
- [GitHub issue #7](https://github.com/ArchILLtect/nh-showcase-site/issues/7)
