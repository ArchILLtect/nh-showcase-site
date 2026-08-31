
## TOP Priorities

- [ ] Mobile layout issue: Clicking the X button on the mobile menu doesn't close the menu. (P0), it attempts to but fails and the menu reopens immediately. This is a critical bug that needs to be fixed as soon as possible.


- [ ] Implement GitHub repository cards without exposing a client-side token.
- [ ] Make a DB for JSON files and implement it across the site to make it easier to add new items and maintain existing ones.
- [ ] Add missing certs from Coursera and codefinity, etc.
- [ ] Add Dean's List letters to achievements page.

- [ ] Add server-side validation and duplicate prevention to registration Lambda to fix critical bugs and security issues in current flow (P0).
- [ ] Define safe, SSAF-aligned modernization plan for auth/API architecture to enable future improvements without risking current stability (P1).
- [ ] Implement email verification flow and account recovery features to meet basic auth hardening standards (P2).
- [ ] Add structured logging, monitoring, and alerting to auth flows to improve observability and incident response.
- [ ] Conduct thorough inventory and documentation of current auth-related assets and contracts to inform modernization design and migration strategy.
- [ ] Execute safe, staged rollout of auth improvements with rollback plans and monitoring gates to minimize risk during changes.
- [ ] Publish comprehensive documentation of current state, baseline findings, hardening checklist, and modernization plan to ensure team alignment and future maintainability.
- [ ] Add new auth-related AWS resources (Lambdas, DynamoDB indexes, IAM policies) with careful naming and ownership documentation to prevent future confusion and ensure clear responsibility.
- [ ] Add automated tests for auth flows (registration, login, recovery) covering success paths, validation errors, duplicate attempts, and edge cases to prevent regressions and ensure contract stability.

- [ ] Catch up on my blogs and add them to the site.
  - [ ] Add a new entry for writing and publishing blog posts about my projects, learning experiences, and insights in software development, web technologies, and related topics and add them to the blog section of the site.


## Auth / Account Recovery
- [ ] Add email confirmation during account creation (send verification email + require confirmation before account activation/login).
- [ ] Deferred (cost-aware): Add SES deliverability monitoring + alerting (CloudWatch alarms for Bounce/Complaint + SNS notifications) and a short incident runbook.

## Deferred: Auth/API Modernization (SSAF alignment)

### Goal
- [ ] Define modernization objective: migrate legacy auth/API patterns to a consistent SSAF-aligned architecture without disrupting in-progress feature delivery.

### Phase 1: Discovery + Inventory
- [ ] Inventory all current auth-related AWS assets (API Gateway routes/stages, Lambda functions, DynamoDB tables/indexes, IAM roles, CloudWatch log groups, secrets/env vars).
- [ ] Document current contracts for `/login`, `/register`, `/tracking` (request/response payloads, status codes, error formats).
- [ ] Capture current naming issues (generic names, inconsistent prefixes, obsolete route/version naming) and define target naming standard.

### Phase 2: Target Design (SSAF foundation)
- [ ] Define SSAF auth domain boundaries (identity, registration, login/session, recovery, telemetry).
- [ ] Define target API versioning strategy (e.g., `/v1/auth/*`) and deprecation plan for legacy routes.
- [ ] Define unified error model (machine-readable `code`, user-safe `message`, trace/correlation id).
- [ ] Define canonical user schema (normalized email, username rules, role, tokenVersion, emailVerified, passwordChangedAt, created/updated timestamps).

### Phase 3: Safe Migration Plan
- [ ] Choose migration approach: side-by-side APIs (preferred) vs in-place replacement.
- [ ] Create compatibility matrix: old client behavior vs new API behavior.
- [ ] Define data migration/backfill tasks for user records (normalization, new attributes, index support).
- [ ] Define rollback plan per milestone (routes, Lambda alias/version, table/index changes).

### Phase 4: Implementation (separate effort)
- [ ] Build new SSAF-aligned auth endpoints and wire to dedicated Lambda handlers.
- [ ] Add server-side validation hardening and duplicate-prevention safeguards.
- [ ] Add structured logging/metrics/alerts and baseline dashboards.
- [ ] Add automated tests for auth happy paths, error paths, and migration compatibility.

### Phase 5: Cutover + Cleanup
- [ ] Run staged cutover (dev -> staging -> production) with monitoring gates.
- [ ] Deprecate legacy API routes and remove obsolete Lambda code after validation window.
- [ ] Rename/refactor remaining generic identifiers for long-term maintainability.
- [ ] Publish final architecture notes so future updates follow SSAF conventions.

## TTD



## Deferred engineering decisions

- [ ] Choose and introduce an automated frontend test strategy.
- [ ] Repair ESLint and decide whether to enforce it in CI.
- [ ] Evaluate route-level code splitting if bundle size becomes a practical concern.
- [ ] Decide whether the optional local Express stub should remain in the repository.
- [ ] Consider narrowing wildcard Lambda CORS during later auth hardening.
- [ ] Regenerate and reintroduce repository structure documentation through TreeMark when useful.

## Asset maintenance

- [ ] Replace outdated logo or brand artwork with current official versions when appropriate.
- [ ] Continue sourcing new or replacement technology/service logos from official brand, press, or asset sources when available.
- [ ] If an official downloadable asset is unavailable, document the source used and confirm that the displayed mark accurately represents the official logo without implying endorsement.
- [ ] Preserve presentation normalization only where it does not distort or materially alter the mark.