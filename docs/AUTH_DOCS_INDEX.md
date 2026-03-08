# Auth Docs Index

Central index for authentication and account recovery documentation.

## Core Auth
- [Custom Auth Flow](../README.md)
  - Existing login/register overview, localStorage keys, and role-based route behavior.

## Account Recovery (New)
  - End-to-end flow, API contracts, data model updates, security controls, rollout, and acceptance criteria.
  - Migration risks, compatibility concerns, and mitigation strategy.
  - Step-by-step checklist for planning, implementation, rollout, and post-launch review.
  - Concrete implementation guide for `username + email` recovery targeting when emails can be shared.
- [Account Recovery SES Setup Guide](./ACCOUNT_RECOVERY_SES_SETUP.md)

## Registration Hardening
- [Minimum Safe Registration Hardening Checklist](./REGISTRATION_HARDENING_CHECKLIST.md)
  - Practical checklist to secure the current registration Lambda/API path before larger SSAF modernization.
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
14. [Account Recovery SES Setup Guide](./ACCOUNT_RECOVERY_SES_SETUP.md)
  - Step-by-step implementation/ops checklist aligned to reused-email registration behavior.

## Lambda Source Management
- [Lambda In-Repo Migration Checklist](./LAMBDA_MIGRATION_CHECKLIST.md)
  - Checklist to keep Lambda source in-repo with safe deploy/rollback hygiene.
- [Lambda Functions Folder README](../lambda-functions/README.md)
  - Structure and manual deploy/rollback workflow for current Lambda source folders.

## Project Structure Reference
- [File Structure](./FILE_STRUCTURE.md)
  - High-level layout of frontend/backend folders and key files.

## Suggested Reading Order
1. [Custom Auth Flow](../README.md)
2. [Implementation Plan](./ACCOUNT_RECOVERY_IMPLEMENTATION.md)
3. [Legacy Concerns](./ACCOUNT_RECOVERY_LEGACY.md)
4. [Execution Checklist](./ACCOUNT_RECOVERY_CHECKLIST.md)
5. [Account-Scoped Recovery Playbook (Email Reuse Allowed)](./ACCOUNT_RECOVERY_ACCOUNT_SCOPED_PLAYBOOK.md)
6. [Minimum Safe Registration Hardening Checklist](./REGISTRATION_HARDENING_CHECKLIST.md)
7. [Registration Baseline Capture Checklist](./REGISTRATION_BASELINE_CAPTURE_CHECKLIST.md)
8. [Registration P0 Implementation Playbook](./REGISTRATION_P0_IMPLEMENTATION_PLAYBOOK.md)
9. [Registration P1 IAM Least-Privilege Playbook](./REGISTRATION_P1_IAM_LEAST_PRIVILEGE_PLAYBOOK.md)
10. [Registration P1 IAM Console Click Path](./REGISTRATION_P1_IAM_CONSOLE_CLICKPATH.md)
11. [Registration P1 Email Identity Policy (Reuse Allowed)](./REGISTRATION_P1_EMAIL_UNIQUENESS_STRATEGY.md)
12. [Registration P1 Email Policy Alignment Playbook](./REGISTRATION_P1_EMAIL_UNIQUENESS_IMPLEMENTATION_PLAYBOOK.md)
13. [Lambda In-Repo Migration Checklist](./LAMBDA_MIGRATION_CHECKLIST.md)
