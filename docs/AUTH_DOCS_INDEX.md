# Auth Docs Index

Central index for authentication and account recovery documentation.

## Core Auth
- [Custom Auth Flow](../README.md)
  - Existing login/register overview, localStorage keys, and role-based route behavior.

## Account Recovery (New)
- [Implementation Plan](./ACCOUNT_RECOVERY_IMPLEMENTATION.md)
  - End-to-end flow, API contracts, data model updates, security controls, rollout, and acceptance criteria.
- [Legacy Concerns](./ACCOUNT_RECOVERY_LEGACY.md)
  - Migration risks, compatibility concerns, and mitigation strategy.
- [Execution Checklist](./ACCOUNT_RECOVERY_CHECKLIST.md)
  - Step-by-step checklist for planning, implementation, rollout, and post-launch review.

## Registration Hardening
- [Minimum Safe Registration Hardening Checklist](./REGISTRATION_HARDENING_CHECKLIST.md)
  - Practical checklist to secure the current registration Lambda/API path before larger SSAF modernization.
- [Registration Baseline Capture Checklist](./REGISTRATION_BASELINE_CAPTURE_CHECKLIST.md)
  - Step-by-step AWS config capture checklist (DynamoDB/API Gateway/Lambda/IAM/logs) before hardening changes.

## Project Structure Reference
- [File Structure](./FILE_STRUCTURE.md)
  - High-level layout of frontend/backend folders and key files.

## Suggested Reading Order
1. [Custom Auth Flow](../README.md)
2. [Implementation Plan](./ACCOUNT_RECOVERY_IMPLEMENTATION.md)
3. [Legacy Concerns](./ACCOUNT_RECOVERY_LEGACY.md)
4. [Execution Checklist](./ACCOUNT_RECOVERY_CHECKLIST.md)
5. [Minimum Safe Registration Hardening Checklist](./REGISTRATION_HARDENING_CHECKLIST.md)
6. [Registration Baseline Capture Checklist](./REGISTRATION_BASELINE_CAPTURE_CHECKLIST.md)
