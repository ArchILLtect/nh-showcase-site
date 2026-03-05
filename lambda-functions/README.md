# Lambda Functions (In-Repo)

This folder contains the current source-of-truth code for deployed Lambda functions used by the showcase site.

## Structure
- `showcaseRegistration/` - registration Lambda source
- `showcaseLogin/` - login Lambda source
- `archive/` - historical snapshots (optional, typically ignored from git)

## Conventions
- Keep only source code and lockfiles in git.
- Do not commit build artifacts (`*.zip`) or `node_modules`.
- Keep rollback/deployment notes in docs.

## Deploy Workflow (Manual)
1. `cd` into target function folder.
2. Run `npm ci`.
3. Zip only needed files (`index.mjs`, `package.json`, `package-lock.json`, and `node_modules` if required for runtime packaging process).
4. Update Lambda code in AWS (`showcaseRegistration` or `showcaseLogin`).
5. Publish a new Lambda version.
6. Verify API Gateway integration still points to the expected function/version/alias.
7. Run smoke tests for success and failure cases.

## Deploy Workflow (Scripted)
Use the helper script from repo root to archive current source and build the deployment zip:

```powershell
./scripts/package-lambda.ps1 -FunctionName showcaseRegistration
```

Optional (also installs dependencies before zipping):

```powershell
./scripts/package-lambda.ps1 -FunctionName showcaseRegistration -InstallDependencies
```

Notes:
- Archive snapshot is written to `lambda-functions/archive/<functionName>/<timestamp>/`.
- Deployable zip is written to `lambda-functions/<functionName>.zip`.

## Rollback Workflow
1. Revert API Gateway integration/alias to previous known-good Lambda version.
2. Re-run smoke tests.
3. Record rollback reason and timestamp in baseline docs.
