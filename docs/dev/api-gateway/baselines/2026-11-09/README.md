# Live API Gateway snapshot — 2026-11-09 UTC

Read-only exports and stage configuration captured from AWS in `us-east-2`.

- `auth-http-api-default.oas30.json`: active HTTP API routes and the `$default` deployment's CORS policy.
- `auth-http-api-prod.oas30.json`: routes and CORS policy in the manually deployed `prod` stage at capture.
- `analytics-writer-rest-api.oas30.json`: REST writer routes, Lambda integration, and OPTIONS VTL.
- `analytics-readers-rest-api.oas30.json`: REST reader routes, Lambda integrations, and OPTIONS VTL.
- `baseline-manifest.json`: route map, API identifiers, per-stage deployment settings, and the writer throttle.

At capture, `$default` included Netlify preview 17 and had been updated on November 9 UTC. `prod` was last updated on November 5 and did not include preview 17; production origins are allowed in both. This distinction is intentional in the baseline.

This is an observed baseline, not an automated deployment artifact. It contains no access keys, session tokens, passwords, or user data. Lambda ARNs contain the AWS account ID, an infrastructure identifier.

The auth HTTP API has seven active routes but AWS reports fourteen integration objects. The stage-specific OpenAPI exports include the effective active routes; seven unreferenced integration objects were omitted and were not removed from AWS. Investigate them separately before any cleanup or IaC import.

