# Lambda Functions (In-Repo)

This folder contains the current source-of-truth code for deployed Lambda functions used by the showcase site.

## Structure
- `showcaseRegistration/` - registration Lambda source
- `showcaseLogin/` - login Lambda source
- `showcaseVerifyEmail/` - verify-email Lambda source
- `showcaseResendVerification/` - resend-verification Lambda source
- `showcaseForgotPassword/` - forgot-password Lambda source
- `showcaseResetPassword/` - reset-password Lambda source
- `showcaseSessionValidate/` - session validation Lambda source (`tokenVersion` stale-session check)
- `archive/` - historical snapshots (optional, typically ignored from git)

## Conventions
- Keep only source code and lockfiles in git.
- Do not commit build artifacts (`*.zip`) or `node_modules`.
- Keep rollback/deployment notes in docs.

## Deploy Workflow (Manual)
1. `cd` into target function folder.
2. Run `npm ci`.
3. Include `package.json`, `package-lock.json`, all top-level `.mjs` source modules, and `node_modules` when required by the function.
4. Update Lambda code in AWS (`showcaseRegistration`, `showcaseLogin`, `showcaseVerifyEmail`, `showcaseResendVerification`, `showcaseForgotPassword`, `showcaseResetPassword`, or `showcaseSessionValidate`).
5. Publish a new Lambda version.
6. Verify alias and API Gateway integration still point to the expected function/alias (prefer `prod` alias over fixed version ARN).
7. Run smoke tests for success and failure cases.

## CORS Policy

The auth handlers return CORS headers only for browser requests from these origins:

- `https://nickhanson.me`
- `https://www.nickhanson.me`
- Netlify deploy previews matching `https://deploy-preview-<number>--resonant-ganache-9efedd.netlify.app`

Requests without an `Origin` header retain the existing `*` response for Lambda-console and non-browser checks. An unrecognized browser origin receives no `Access-Control-Allow-Origin` header, so the browser blocks cross-origin access.

Deployment and verification (2026-11-04): all seven auth Lambda functions were updated and their `prod` aliases now target the published versions; auth API routes use those aliases. API Gateway CORS allows the production domains and the exact preview origin `https://deploy-preview-6--resonant-ganache-9efedd.netlify.app`. The approved preview preflight returned 204 with the requested CORS headers; an unapproved origin received no `Access-Control-Allow-Origin`. Basic invalid-input and missing-session smoke cases returned their expected 400/401 responses. Update API Gateway CORS if a different preview origin must be tested. Route-specific CORS ownership remains an open follow-up in [GitHub issue #7](https://github.com/ArchILLtect/nh-showcase-site/issues/7).

## Deploy Workflow (Scripted)
Use the helper script from repo root to archive source and build the deployment zip. It includes all top-level `.mjs` modules (not only `index.mjs`) and aborts if `npm ci` fails:

```powershell
./scripts/package-lambda.ps1 -FunctionName showcaseRegistration
```

Optional (also installs dependencies before zipping):

```powershell
./scripts/package-lambda.ps1 -FunctionName showcaseForgotPassword -InstallDependencies
```

## Config Baseline Export (JSON)
Use this command from repo root to capture a sanitized machine-readable baseline bundle for DynamoDB, API Gateway, Lambda, and IAM config:

```powershell
npm run export:auth-baseline
```

Notes:
- Writes to `docs/dev/auth/baselines/<yyyy-mm-dd>-registration-config-exports/`.
- Lambda environment variable values are exported as `__REDACTED__`.
- Includes `export.manifest.json` with captured file list and any failures.

Notes:
- Archive snapshot is written to `lambda-functions/archive/<functionName>/<timestamp>/`.
- Deployable zip is written to `lambda-functions/<functionName>.zip`.
- Ensure required env vars are configured before publish (for recovery: `USERS_TABLE_NAME`, `RESET_TOKENS_TABLE_NAME`, `RESET_TOKEN_TTL_MINUTES`, `TOKEN_HASH_PEPPER`, `RETURN_RESET_TOKEN_FOR_TESTING`, `PASSWORD_RESET_FROM_EMAIL`, `RESET_URL_BASE`, optional `PASSWORD_RESET_REPLY_TO`, optional `PASSWORD_CHANGE_SUPPORT_EMAIL`).
- Ensure email verification env vars are configured before publish:
	- `EMAIL_VERIFICATION_TOKENS_TABLE_NAME`, `EMAIL_VERIFY_TOKEN_HASH_PEPPER`, `EMAIL_VERIFY_TOKEN_TTL_MINUTES`, `EMAIL_VERIFY_URL_BASE`
	- `EMAIL_VERIFICATION_FROM_EMAIL`, optional `EMAIL_VERIFICATION_REPLY_TO`
- For resend verification limiter (optional):
	- `EMAIL_VERIFY_RATE_LIMITS_TABLE_NAME`
	- `RESEND_PER_IP_MAX_ATTEMPTS`, `RESEND_PER_IP_WINDOW_SECONDS`, `RESEND_PER_ACCOUNT_MAX_ATTEMPTS`, `RESEND_PER_ACCOUNT_WINDOW_SECONDS`, `RESEND_ACCOUNT_COOLDOWN_SECONDS`
- For registration limiter (optional, recommended):
	- `EMAIL_VERIFY_RATE_LIMITS_TABLE_NAME`
	- `REGISTER_PER_IP_MAX_ATTEMPTS`, `REGISTER_PER_IP_WINDOW_SECONDS`
	- `REGISTER_PER_EMAIL_MAX_ATTEMPTS`, `REGISTER_PER_EMAIL_WINDOW_SECONDS`, `REGISTER_EMAIL_COOLDOWN_SECONDS`
- Rate limiting (optional, recommended):
	- `RESET_RATE_LIMITS_TABLE_NAME` (DynamoDB table with PK `key` and TTL `expiresAt`)
	- Forgot flow: `FORGOT_PER_IP_MAX_ATTEMPTS`, `FORGOT_PER_IP_WINDOW_SECONDS`, `FORGOT_PER_ACCOUNT_MAX_ATTEMPTS`, `FORGOT_PER_ACCOUNT_WINDOW_SECONDS`, `FORGOT_ACCOUNT_COOLDOWN_SECONDS`
	- Reset flow: `RESET_PER_IP_MAX_ATTEMPTS`, `RESET_PER_IP_WINDOW_SECONDS`
- Ensure auth/session env vars are configured for login/session validation (`USERS_TABLE_NAME`, `JWT_SECRET`, optional `JWT_EXPIRES_IN`).

## Rollback Workflow
1. Revert API Gateway integration/alias to previous known-good Lambda version.
2. Re-run smoke tests.
3. Record rollback reason and timestamp in baseline docs.
