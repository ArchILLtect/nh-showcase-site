
## TOP Priorities
- [ ] Create a page for future projects that I intend to work on and add it to the navbar.
  - [ ] Add a new entry for creating (an) npm package(s) for React components and utilities--specifically any helpers I have that are and/or could be reusable across projects (e.g., auth utilities, API clients, custom hooks).
  - [ ] Add a new entry for creating (a) YouTube channel(s) to share knowledge, tutorials, and project walkthroughs related to my work and learning journey.

- [ ] Catch up on my blogs and add them to the site.
  - [ ] Add a new entry for writing and publishing blog posts about my projects, learning experiences, and insights in software development, web technologies, and related topics and add them to the blog section of the site.


- [ ] Add server-side validation and duplicate prevention to registration Lambda to fix critical bugs and security issues in current flow (P0).
- [ ] Define safe, SSAF-aligned modernization plan for auth/API architecture to enable future improvements without risking current stability (P1).
- [ ] Implement email verification flow and account recovery features to meet basic auth hardening standards (P2).
- [ ] Add structured logging, monitoring, and alerting to auth flows to improve observability and incident response.
- [ ] Conduct thorough inventory and documentation of current auth-related assets and contracts to inform modernization design and migration strategy.
- [ ] Execute safe, staged rollout of auth improvements with rollback plans and monitoring gates to minimize risk during changes.
- [ ] Publish comprehensive documentation of current state, baseline findings, hardening checklist, and modernization plan to ensure team alignment and future maintainability.
- [ ] Add new auth-related AWS resources (Lambdas, DynamoDB indexes, IAM policies) with careful naming and ownership documentation to prevent future confusion and ensure clear responsibility.
- [ ] Add automated tests for auth flows (registration, login, recovery) covering success paths, validation errors, duplicate attempts, and edge cases to prevent regressions and ensure contract stability.




## Auth / Account Recovery
- [ ] Add email confirmation during account creation (send verification email + require confirmation before account activation/login).

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

### Create a "project" entry for my PDP from Ent. Java to showcase that video.

- [x] Structure
- [x] Description
- [x] Move new "Videos" section under projects
- [x] Create a new Videos component
- [x] Add PDP to videos.json
- [x] Move current PDP links into an actual card item in "Videos" section
- [x] Add new CodeForge Presentation to showcase site
- [x] Convert to Windows 11
- [ ] Switch to new version of TaskMaster
- [ ] Github API implementation.
- [ ] Make a DB for projects
- [ ] Add missing certs from Coursera and codefinity, etc.
- [ ] Add Dean's List letters to achievements page.
