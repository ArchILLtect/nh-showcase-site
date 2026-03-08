# Lambda Functions (In-Repo)

This folder contains the current source-of-truth code for deployed Lambda functions used by the showcase site.

## Structure
- `showcaseRegistration/` - registration Lambda source
- `showcaseLogin/` - login Lambda source
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
3. Zip only needed files (`index.mjs`, `package.json`, `package-lock.json`, and `node_modules` if required for runtime packaging process).
4. Update Lambda code in AWS (`showcaseRegistration`, `showcaseLogin`, `showcaseForgotPassword`, `showcaseResetPassword`, or `showcaseSessionValidate`).
5. Publish a new Lambda version.
6. Verify alias and API Gateway integration still point to the expected function/alias (prefer `prod` alias over fixed version ARN).
7. Run smoke tests for success and failure cases.

## Deploy Workflow (Scripted)
Use the helper script from repo root to archive current source and build the deployment zip:

```powershell
./scripts/package-lambda.ps1 -FunctionName showcaseRegistration
```

Optional (also installs dependencies before zipping):

```powershell
./scripts/package-lambda.ps1 -FunctionName showcaseForgotPassword -InstallDependencies
```

Notes:
- Archive snapshot is written to `lambda-functions/archive/<functionName>/<timestamp>/`.
- Deployable zip is written to `lambda-functions/<functionName>.zip`.
- Ensure required env vars are configured before publish (for recovery: `USERS_TABLE_NAME`, `RESET_TOKENS_TABLE_NAME`, `RESET_TOKEN_TTL_MINUTES`, `TOKEN_HASH_PEPPER`, `RETURN_RESET_TOKEN_FOR_TESTING`, `PASSWORD_RESET_FROM_EMAIL`, `RESET_URL_BASE`, optional `PASSWORD_RESET_REPLY_TO`, optional `PASSWORD_CHANGE_SUPPORT_EMAIL`).
- Ensure auth/session env vars are configured for login/session validation (`USERS_TABLE_NAME`, `JWT_SECRET`, optional `JWT_EXPIRES_IN`).

## Rollback Workflow
1. Revert API Gateway integration/alias to previous known-good Lambda version.
2. Re-run smoke tests.
3. Record rollback reason and timestamp in baseline docs.
