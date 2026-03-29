
## TOP Priorities
- [ ] Github API implementation. STARTED.
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



## Completed:

### Create a "project" entry for my PDP from Ent. Java to showcase that video.

- [x] Structure
- [x] Description
- [x] Move new "Videos" section under projects
- [x] Create a new Videos component
- [x] Add PDP to videos.json
- [x] Move current PDP links into an actual card item in "Videos" section
- [x] Add new CodeForge Presentation to showcase site
- [x] Convert to Windows 11
- [x] Switch to new version of TaskMaster


## Completed Items
- [x] Create a page for future projects that I intend to work on and add it to the navbar.
  - [x] Add a new entry for creating my FamHub app to connect with family members, share updates, and coordinate events with features like user authentication, real-time and video chat, and a shared calendar.
  - [x] Add a new entry for creating (an) npm package(s) for React components and utilities--specifically any helpers I have that are and/or could be reusable across projects (e.g., auth utilities, API clients, custom hooks).
  - [x] Add a new entry for creating an app to manage my projects, tasks, and learning goals with features like user authentication, database-backed storage, and a clean UI to track progress and organize my work.
  - [x] Add a new entry for creating a RiffTrax collection app to catalog and share my favorite movie riffing commentaries, including features like user ratings, reviews, and a searchable database of riffs. Later adding a discussion forum for fans to connect and share their thoughts on riffs and movies.
  - [x] Add a new entry for creating a Media Tracker app to manage movie, TV, and book collections with features like tracking what I've watched/read, rating and reviewing items, and generating recommendations based on my preferences. This app will also have a Chrome extension that is injected into every movie/TV/book page for Chrome search results to allow quick adding of items to my collection and rating them on the spot. It will also utilize the TMDB API to fetch metadata and cover art for movies and TV shows, and the Google Books API for books.
  - [x] Add a new entry for creating a YouTube channel to share my learning journey, project details/updates, tutorials, and insights in software development and related topics with the broader community.
