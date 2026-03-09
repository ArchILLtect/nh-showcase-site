# Lambda In-Repo Migration Checklist

Use this checklist when moving Lambda source into this repository and standardizing workflow.

## Migration Validation
- [x] Current Lambda source copied into repo under `lambda-functions/`.
- [ ] Confirm in-repo files exactly match currently deployed code (checksum or visual diff).
- [ ] Confirm runtime entrypoint names match deployment config (`index.handler` etc.).
- [ ] Confirm package manifests are present per function.

## Repo Hygiene
- [x] Add `.gitignore` patterns for:
  - function `node_modules`
  - zipped build artifacts (`*.zip`)
  - local archives if not tracked
- [ ] Ensure no secrets are in function source or package files.
- [ ] Ensure `.env` files are not used for deployed secrets.

## Deployment Safety
- [ ] Record current production Lambda version/ARN per function.
- [ ] Record API Gateway route -> Lambda mapping.
- [ ] Define rollback target for each function.
- [ ] Document deploy steps and smoke-test steps.

## Ongoing Maintenance
- [ ] Keep `archive/` external or ignored by git (recommended).
- [ ] Publish versions with notes after each deploy.
- [ ] Track hardening tasks in docs before non-trivial auth changes.
