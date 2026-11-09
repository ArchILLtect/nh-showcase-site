# Showcase API CORS Inventory

Last verified: 2026-11-08 (`us-east-2`; includes analytics CORS and route configuration checks).

This is a point-in-time inventory of browser-facing API Gateway resources used by this repository. AWS configuration is not yet defined by infrastructure-as-code here; do not treat this document as a deployment recipe.

## Current API surfaces

| Client call | API | Gateway configuration | Backend |
| --- | --- | --- | --- |
| Auth flows (`src/config/api.js`) | HTTP API `ShowcaseRegisterAPI` (`u7fyurbrjc`) | Native API-level CORS allows `https://nickhanson.me`, `https://www.nickhanson.me`, and the exact Netlify origins `https://deploy-preview-6--resonant-ganache-9efedd.netlify.app`, `https://deploy-preview-9--resonant-ganache-9efedd.netlify.app`, and `https://deploy-preview-10--resonant-ganache-9efedd.netlify.app`, and `https://deploy-preview-17--resonant-ganache-9efedd.netlify.app`; methods `POST`; headers `content-type`, `authorization`. This is an API-wide policy. | Auth Lambdas. With native HTTP API CORS enabled, API Gateway applies the configured policy and ignores integration CORS headers. |
| Visit logging (`src/utils/visitTracker.js`) | REST API `ssaf-analytics-visitManager` (`9hxx3na0o7`), stage `dev` | Root `OPTIONS` mock response echoes only an exact approved origin; approved responses include `Vary: Origin`. Unapproved origins receive no `Access-Control-Allow-Origin`. | Root `POST` invokes source-controlled `ssaf-analytics-trackVisit`. |
| Visit log dashboard (`src/components/VisitLogsDashboard.jsx`) | REST API `showcaseAnalytics` (`ldlg09zoq7`), stage `dev` | Root `OPTIONS` and `/admin` `OPTIONS` mock responses echo only exact approved origins; approved responses include `Vary: Origin`. Unapproved origins receive no `Access-Control-Allow-Origin`. | Root `POST` invokes source-controlled `ssaf-analytics-getUserVisits`; `/admin` `GET` invokes source-controlled `ssaf-analytics-getAllVisits`. |

The historical auth API baseline documents a discovered `POST /tracking` route, but does not identify a caller or intended use. No current frontend or backend source references the route. It was removed from the API configuration on 2026-11-05 and both `$default` and `prod` stages now point to a deployment whose exported routes omit it. Historical baseline files are retained as snapshots, not current configuration.

## Authorization and analytics runtime

The analytics API Gateway methods report `authorizationType: NONE` and `apiKeyRequired: false`; the Lambda handlers are therefore the authorization boundary for reads. The personal-visits handler validates the bearer session and scopes results using the authenticated user's `knownIps`; the all-visits handler requires a server-validated `admin` role. The browser's dashboard route guard is not a substitute for those checks.

The visit writer records the source IP and user agent from API Gateway request metadata rather than trusting client-submitted values. The three analytics handlers are maintained under `lambda-functions/ssaf-analytics-*` and use AWS SDK v3. Do not set reserved concurrency to `0` as a pause mechanism: it disables every invocation and can produce API Gateway 5xx responses. Leave the setting unconfigured unless an intentional concurrency cap is needed.

On 2026-11-04, successful visit writes were confirmed in DynamoDB and in the writer's CloudWatch success logs; the dashboard subsequently displayed the new rows. This verifies the deployed path used for that smoke test, not every possible origin or API route.

## CORS findings and follow-up

The REST API mock preflights and Lambda proxy responses use an exact allowlist: the production domains and Netlify previews 6, 9, 10, and 17. Unapproved browser origins are rejected by the analytics Lambdas and do not receive `Access-Control-Allow-Origin`; approved dynamic origin responses include `Vary: Origin`. Preview-17 API Gateway `OPTIONS` tests returned 200 with the exact origin and `Vary: Origin` on all three routes, and deployed Lambda code hashes matched the packaged artifacts. CORS remains browser policy, not authorization; Lambda session and role checks remain essential. The public visit API root `POST` now has API Gateway stage throttling at 5 requests/second with a burst limit of 10. This is an aggregate, best-effort cap for that method, not a per-IP limiter; per-IP controls can be considered separately if abuse appears.

The auth HTTP API allowlist is shared across its routes. On 2026-11-04, preview-9 session validation preflight returned 204 and a missing-token request returned 401 with the expected allow-origin header. The recorded allowlist contained the production domains and preview-6, preview-9, preview-10, and preview-17. Add a preview origin deliberately when needed; do not assume arbitrary deploy-preview URLs are allowed.

The REST API configuration is manually managed and is not represented by infrastructure-as-code in this repository. When adding a preview, add it deliberately to both the REST API mock preflight mapping templates and the three analytics Lambda allowlists; the auth HTTP API policy is independently managed. Verify the deployed stage after API Gateway deployments. Treat CORS as browser policy, never as a replacement for server-side authorization.

## References

- [AWS: Configure CORS for HTTP APIs](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-cors.html)
- [AWS SAM: CORS configuration and proxy integrations](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-api-corsconfiguration.html)
- [GitHub issue #7](https://github.com/ArchILLtect/nh-showcase-site/issues/7)
