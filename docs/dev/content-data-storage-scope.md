# Showcase Site Content Data and Storage — Scope

**Status:** Discovery/scoping only. No database choice, provisioning, migration, or implementation is authorized by this document.

## Why scope this

The TODO asks for a database for JSON-backed site content to make additions and maintenance easier. That is a goal, not yet a demonstrated requirement for every file. This scope separates content that is currently deployed as static files from content already served by AWS, and defines a small decision gate before any migration.

## Current sources found in the repository

| Content | Current source / consumers | Initial assessment |
| --- | --- | --- |
| Projects | `public/data/projects.json`; projects page and home featured-project component | Structured records edited infrequently; good candidate for a first migration only if browser/admin editing is a real need. |
| Future projects | `public/data/futureProjects.json`; future-projects page | Static planning content; likely keep in source control unless editing demand justifies a shared editor. |
| Certificates and badges | `public/data/certificates.json`, `public/data/badges.json`; certificates page | Metadata is structured, but certificate images remain files. Keep the binary assets in static/object storage. |
| About sections and supporting Markdown | `public/data/sections.json`, `public/data/sections/*.md`; About page | Mixed structured metadata and Markdown files; moving records alone does not move/host the referenced content assets. |
| Skills and processes | `public/data/skills.json`, `public/data/processes.json`; skills section | Small mostly-static lists; likely source-controlled unless a content editor is a concrete goal. |
| Videos | Projects page reads `data/videos.json` | Confirm the expected file/source and whether the section is still used before including it in a migration. |
| Blog metadata and article bodies | Blog page calls an existing API; article bodies are fetched by filename from S3. The create-post UI calls the existing blog API. | Already uses AWS-backed persistence/storage. Do not duplicate or migrate it as part of the static-JSON effort without a separately scoped reason. |

The inventory is based on frontend references and checked-in data paths; it is not yet a complete audit of every Lambda, DynamoDB table, S3 bucket, IAM policy, deployment setting, or admin contract.

## Candidate outcomes

Before selecting a database, decide which outcome is actually wanted:

1. **Easier edits by the site owner:** an authenticated admin interface for selected public content, including validation, preview, publish, and rollback.
2. **Less duplication in site content:** a shared source for data currently repeated or imported from different JSON files.
3. **Runtime querying:** filtering/search that static assets cannot reasonably support.

If the only goal is simpler edits to small infrequently changed lists, keeping JSON in Git may remain the lowest-risk fit. A database adds access control, backups, migration, operational cost, and a write surface; it is not automatically easier to maintain.

## Bounded first-phase candidate (not approved for implementation)

If discovery confirms that admin editing is the priority, evaluate only the Projects catalog first:

- read: public project cards continue to work when the database is unavailable (define an explicit cache/fallback policy);
- write: authenticated admin-only create/update/archive operations, with server-side validation and audit history;
- schema: title, description, technology list, image path, optional demo/repository/detail links, featured flag, status, and ordering;
- media: keep images as static files or object storage; persist references, not blobs;
- migration: import current `projects.json`, compare record counts/content, cut over behind a tested rollback path;
- acceptance: owner can edit and preview a project without a code deploy, public visitors only read published records, and failed writes cannot corrupt the current catalog.

Do not include authentication/user records, analytics/visit logs, blog migration, all other JSON files, or Plinth-specific schema design in this first phase.

## Decision gate before implementation

Record and approve:

- the primary user outcome and who edits content;
- which collections actually need runtime editing and why;
- the least-complex storage option and expected ongoing cost/backup ownership;
- the authorization model and admin publishing workflow;
- availability behavior, caching, migration, rollback, and recovery expectations;
- whether existing AWS blog storage should remain independent;
- a measured success criterion that would justify adding this operational surface.

Until those are decided, keep this work at scope/design level and do not provision a database or change data access paths.
