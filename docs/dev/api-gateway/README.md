# API Gateway configuration baseline

This folder records the current browser-facing API Gateway state and the manual change process for the Showcase site.

- [Deployment and rollback runbook](DEPLOYMENT_RUNBOOK.md)
- [Live configuration snapshot, 2026-11-09 UTC](baselines/2026-11-09/README.md)
- [API/CORS inventory](../API_CORS_INVENTORY.md)

The chosen approach is versioned exports plus an operational runbook—not a CloudFormation/CDK migration. This captures routes, integrations, CORS, stages, and throttling without taking ownership of existing AWS resources. No live AWS configuration was modified for this work.

AWS resource identifiers and Lambda ARNs appear in the snapshots; they are configuration identifiers, not credentials. The HTTP API snapshot includes stage-specific exports for `$default` and `prod`. At capture, `$default` had preview 17 but `prod` did not; production origins are allowed in both. AWS also reported seven unreferenced auth integrations; they were not deleted and are excluded from the active-route snapshot.

