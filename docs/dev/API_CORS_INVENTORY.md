# Showcase API CORS Inventory

Last verified: 2026-11-04 (read-only AWS configuration review)

This note maps browser-facing API calls in this repository to the AWS API Gateway resources currently serving them. AWS configuration is not yet defined by infrastructure-as-code in this repository; these findings are a point-in-time inventory, not a deployment recipe.

## Current API surfaces

| Client call | API | Gateway configuration | Backend |
| --- | --- | --- | --- |
| Auth flows (`src/config/api.js`) | HTTP API `ShowcaseRegisterAPI` (`u7fyurbrjc`) | Native API-level CORS allows `https://nickhanson.me`, `https://www.nickhanson.me`, and `https://deploy-preview-6--resonant-ganache-9efedd.netlify.app`; methods `POST`; headers `content-type`, `authorization`. | Auth Lambdas. Native HTTP API CORS applies across the API and API Gateway ignores integration CORS headers when it is enabled. |
| Visit logging (`src/utils/visitTracker.js`) | REST API `ssaf-analytics-visitManager` (`9hxx3na0o7`), stage `dev` | Root `OPTIONS` mock response is configured with `Access-Control-Allow-Origin: *`. | Root `POST` invokes `ssaf-analytics-trackVisit`. Its source is not present in this repository. |
| Visit log dashboard (`src/components/VisitLogsDashboard.jsx`) | REST API `showcaseAnalytics` (`ldlg09zoq7`), stage `dev` | Root `OPTIONS` and `/admin` `OPTIONS` mock responses are configured with `Access-Control-Allow-Origin: *`. | Root `POST` invokes `ssaf-analytics-getUserVisits`; `/admin` `GET` invokes `ssaf-analytics-getAllVisits`. Their sources are not present in this repository. |

The HTTP API also has a `POST /tracking` route to `ssaf-analytics-getUserVisits`, but searches of the current frontend source found no call to that route. Confirm whether it is still used by another client before changing or removing it.

For REST Lambda-proxy integrations, AWS requires the backend response to supply CORS headers. The APIs also expose wildcard header mappings in their current method/integration configuration, but that alone does not establish the runtime CORS header returned by the Lambda proxy. The analytics Lambda source and actual POST/GET response behavior still need to be brought under review.

## Live preflight verification

Read-only `OPTIONS` requests were sent on 2026-11-04 to the visit logger root (`POST`), dashboard root (`POST`), and dashboard `/admin` (`GET`) using both `https://nickhanson.me` and `https://untrusted.example` as the `Origin`. All six returned HTTP 200 with `Access-Control-Allow-Origin: *`. No POST/GET integration was invoked, so actual Lambda-proxy response headers have not been verified.

## Safe follow-up

1. Keep the auth HTTP API's native CORS allowlist explicit and shared across its routes unless a real route needs a different origin policy. HTTP API native CORS is API-wide; per-route policies require moving CORS handling to each integration or separating APIs.
2. Establish source/deployment ownership for the three analytics Lambdas before changing their proxy responses.
3. Replace wildcard preflight origins on both REST APIs with individually approved origins, and make each Lambda-proxy response use the same explicit origin policy.
4. Verify preflight and actual requests from production, an approved preview, and an unapproved origin. Treat CORS as browser policy, not as authorization; verify server-side authorization independently for analytics data.
5. Decide whether the HTTP API's `/tracking` route is still needed and document its owner.

## References

- [AWS: Configure CORS for HTTP APIs](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-cors.html)
- [AWS SAM: CORS configuration and proxy integrations](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-api-corsconfiguration.html)
- [GitHub issue #7](https://github.com/ArchILLtect/nh-showcase-site/issues/7)
