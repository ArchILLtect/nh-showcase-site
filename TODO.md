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
