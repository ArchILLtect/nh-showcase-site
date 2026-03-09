# Auth Docs Index

Central index for authentication and account recovery documentation.

## Account Recovery Status (2026-03-09)
- Core recovery flow is implemented and validated end-to-end (forgot, reset, single-use token, stale-session invalidation).
- SES sending is operational in production mode for reset and password-changed emails.
- Abuse controls are enabled (per-IP/per-account limits + cooldown) with structured CloudWatch logs.
- SES bounce/complaint alerting is intentionally deferred as a cost-aware optional follow-up.

## Registration Verification Status (2026-03-09)
- Phase A is complete and validated end-to-end (`register -> resend -> verify -> UI reflects verified state`).
- Soft enforcement is active: unverified users can log in and are guided via dismissible banner + resend action.
- `/verify-email` frontend route is live and consumes verification tokens.
- Registration validation constraints are enforced and documented: email max length `254`; password min `8` with upper/lower/number/symbol; common weak passwords rejected.
- Queue-backed notification-failure fallback was validated via controlled failure test and restore test; evidence captured in `REGISTRATION_ROLLOUT_AND_ROLLBACK_GUIDE.md`.
- Post-rollout baseline refresh evidence captured in `baselines/2026-03-04-registration/` with 2026-03-09 validation updates.
- Deferred resilience acceptance note is recorded in `REGISTRATION_EMAIL_VERIFICATION_AND_HARDENING_CHECKLIST.md` under "Deferred Resilience Acceptance (2026-03-09)".
- Next focus: remaining hardening checklist items (registration-side throttling parity, PITR/backups, cost-aware alerting).

## Core Auth
- [Auth Quick Overview](../../AUTH_OVERVIEW.md)
  - Root-level summary of active auth architecture, controls, env vars, and operations status.
- [Custom Auth Flow](../../../README.md)
  - Existing login/register overview, localStorage keys, and role-based route behavior.

## Account Recovery (New)
- [Account Recovery Implementation](./ACCOUNT_RECOVERY_IMPLEMENTATION.md)
  - End-to-end flow, API contracts, data model updates, security controls, rollout, and acceptance criteria.
- [Account Recovery Legacy Concerns](./ACCOUNT_RECOVERY_LEGACY.md)
  - Migration risks, compatibility concerns, and mitigation strategy.
- [Account Recovery Checklist](./ACCOUNT_RECOVERY_CHECKLIST.md)
  - Step-by-step checklist for planning, implementation, rollout, and post-launch review.
- [Account Recovery Account-Scoped Playbook](./ACCOUNT_RECOVERY_ACCOUNT_SCOPED_PLAYBOOK.md)
  - Concrete implementation guide for `username + email` recovery targeting when emails can be shared.
- [Account Recovery SES Setup Guide](./ACCOUNT_RECOVERY_SES_SETUP.md)
  - SES onboarding, IAM policy, env vars, and validation steps for forgot-password delivery.

## Registration Hardening
- [Minimum Safe Registration Hardening Checklist](./REGISTRATION_HARDENING_CHECKLIST.md)
  - Practical checklist to secure the current registration Lambda/API path before larger SSAF modernization.
- [Registration Email Verification + Hardening Checklist](./REGISTRATION_EMAIL_VERIFICATION_AND_HARDENING_CHECKLIST.md)
  - Next-phase execution checklist focused on email verification rollout and remaining deferred registration hardening items.
- [Registration Email Verification Phase A Spec](./REGISTRATION_EMAIL_VERIFICATION_PHASE_A_SPEC.md)
  - Locked data model, API contracts, token strategy, and Lambda env/IAM requirements for implementation.
- [Registration Rollout Toggles + Rollback Guide](./REGISTRATION_ROLLOUT_AND_ROLLBACK_GUIDE.md)
  - Low-cost staged rollout controls (`on|off|canary`) and fast rollback steps for registration verification dispatch.
- [Registration Notification Failures Consumer (MVP)](./REGISTRATION_NOTIFICATION_FAILURES_CONSUMER_MVP.md)
  - Minimal SQS consumer blueprint for failure-intent messages with observe-first and retry modes.
- [Registration Baseline Capture Checklist](./REGISTRATION_BASELINE_CAPTURE_CHECKLIST.md)
  - Step-by-step AWS config capture checklist (DynamoDB/API Gateway/Lambda/IAM/logs) before hardening changes.
- [Registration P0 Implementation Playbook](./REGISTRATION_P0_IMPLEMENTATION_PLAYBOOK.md)
  - Step-by-step execution guide for the first registration hardening patch.
- [Registration P1 IAM Least-Privilege Playbook](./REGISTRATION_P1_IAM_LEAST_PRIVILEGE_PLAYBOOK.md)
  - Exact IAM policy JSON and safe rollout sequence to replace broad DynamoDB access for registration Lambda.
- [Registration P1 IAM Console Click Path](./REGISTRATION_P1_IAM_CONSOLE_CLICKPATH.md)
  - Fast, step-by-step AWS Console procedure to apply least-privilege IAM changes safely.
- [Registration P1 Email Identity Policy (Reuse Allowed)](./REGISTRATION_P1_EMAIL_UNIQUENESS_STRATEGY.md)
  - Documents final policy choice: username is unique and multiple accounts may share an email.
- [Registration P1 Email Policy Alignment Playbook](./REGISTRATION_P1_EMAIL_UNIQUENESS_IMPLEMENTATION_PLAYBOOK.md)
  - Step-by-step implementation/ops checklist aligned to reused-email registration behavior.

## Lambda Source Management
- [Lambda In-Repo Migration Checklist](../LAMBDA_MIGRATION_CHECKLIST.md)
  - Checklist to keep Lambda source in-repo with safe deploy/rollback hygiene.
- [Lambda Functions Folder README](../../../lambda-functions/README.md)
  - Structure and manual deploy/rollback workflow for current Lambda source folders.

## Project Structure Reference
- [File Structure](../../FILE_STRUCTURE.md)
  - High-level layout of frontend/backend folders and key files.

## Suggested Reading Order
1. [Auth Quick Overview](../../AUTH_OVERVIEW.md)
2. [Custom Auth Flow](../../../README.md)
3. [Implementation Plan](./ACCOUNT_RECOVERY_IMPLEMENTATION.md)
4. [Legacy Concerns](./ACCOUNT_RECOVERY_LEGACY.md)
5. [Execution Checklist](./ACCOUNT_RECOVERY_CHECKLIST.md)
6. [Account-Scoped Recovery Playbook (Email Reuse Allowed)](./ACCOUNT_RECOVERY_ACCOUNT_SCOPED_PLAYBOOK.md)
7. [Minimum Safe Registration Hardening Checklist](./REGISTRATION_HARDENING_CHECKLIST.md)
8. [Registration Email Verification + Hardening Checklist](./REGISTRATION_EMAIL_VERIFICATION_AND_HARDENING_CHECKLIST.md)
9. [Registration Email Verification Phase A Spec](./REGISTRATION_EMAIL_VERIFICATION_PHASE_A_SPEC.md)
10. [Registration Rollout Toggles + Rollback Guide](./REGISTRATION_ROLLOUT_AND_ROLLBACK_GUIDE.md)
11. [Registration Notification Failures Consumer (MVP)](./REGISTRATION_NOTIFICATION_FAILURES_CONSUMER_MVP.md)
12. [Registration Baseline Capture Checklist](./REGISTRATION_BASELINE_CAPTURE_CHECKLIST.md)
13. [Registration P0 Implementation Playbook](./REGISTRATION_P0_IMPLEMENTATION_PLAYBOOK.md)
14. [Registration P1 IAM Least-Privilege Playbook](./REGISTRATION_P1_IAM_LEAST_PRIVILEGE_PLAYBOOK.md)
15. [Registration P1 IAM Console Click Path](./REGISTRATION_P1_IAM_CONSOLE_CLICKPATH.md)
16. [Registration P1 Email Identity Policy (Reuse Allowed)](./REGISTRATION_P1_EMAIL_UNIQUENESS_STRATEGY.md)
17. [Registration P1 Email Policy Alignment Playbook](./REGISTRATION_P1_EMAIL_UNIQUENESS_IMPLEMENTATION_PLAYBOOK.md)
18. [Lambda In-Repo Migration Checklist](../LAMBDA_MIGRATION_CHECKLIST.md)
19. [Account Recovery SES Setup Guide](./ACCOUNT_RECOVERY_SES_SETUP.md)
