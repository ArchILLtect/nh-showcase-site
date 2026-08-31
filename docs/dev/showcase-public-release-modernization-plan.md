# Showcase Site — Public-Release Modernization Plan

## Purpose

Prepare the Showcase Site to become a public professional repository while modernizing only what is independently justified.

The site should remain representative of a normal, organically evolved external React site so it can later serve as a realistic Plinth migration baseline.

## Guiding principle

> **Modernize what is independently justified; stabilize what is necessary for public release; do not pre-shape the site for Plinth.**

---

# Locked Work Order

```text
0. Repository governance / CI                  ✅ COMPLETE
1. CRA → Vite foundation migration             ✅ COMPLETE
2. Netlify Forms migration                     ✅ COMPLETE
3. Remove SendGrid + retire credential         ✅ COMPLETE
4. Targeted post-Vite modernization review     ✅ COMPLETE
5. Re-run security / public-readiness audit    ✅ COMPLETE
6. Manual public-repository review              ✅ COMPLETE
7. Final publication verification
8. Change repository visibility to public
9. Continue TreeMark / later product work
```

---

# Step 0 — Repository Governance Baseline

**Complete.**

---

# Step 1 — CRA → Vite Foundation Migration

## Status

**Complete.**

The CRA baseline was captured on Node 24, the app was migrated to Vite, the production build passed, CI remained green, Netlify successfully deployed the Vite `dist/` output, and the migration PR was merged.

---

# Step 2 — Netlify Forms Migration

## Status

**Complete.**

Netlify Forms was proven end-to-end with build-time form detection, URL-encoded `POST /`, expected field storage, honeypot protection, native Netlify email notification, preserved contact-page UX, and no invocation of the legacy SendGrid Function.

---

# Step 3 — Remove SendGrid + Retire Credential

## Status

**Complete.**

Completed:

- deleted the legacy contact Netlify Function;
- removed `@sendgrid/mail`;
- removed root `dotenv`;
- removed stale active SendGrid instructions/config;
- removed the obsolete local SendGrid credential without exposing it;
- re-verified Netlify Forms after cleanup and merge;
- explicitly deleted the provider-side SendGrid API key.

## Exit gate

> **No active SendGrid code path, dependency, tracked active reference, local credential, or provider-side API key remains.**

**Passed.**

---

# Step 4 — Targeted Post-Vite Modernization Review

## Goal

Catch obvious foundation-era leftovers without turning this phase into a broad refactor.

## Status

**Complete.**

The Vite/Netlify production foundation is sound. Repository/backend hygiene, focused foundation/tooling cleanup, and active public-facing guidance updates are complete. Root and backend clean installs/audits passed, both audits report zero vulnerabilities, the Vite production build passed, and the Netlify Forms blueprint and SPA redirect remain present.

### Approved repository/backend hygiene

- stop tracking `backend/node_modules`;
- ignore nested `node_modules`;
- remove unused backend `bcrypt`, `mongoose`, and `pg`;
- patch Express within its current major version;
- regenerate/audit the backend dependency tree to zero vulnerabilities.

### Approved foundation/tooling cleanup

- remove dead CRA `reportWebVitals` / `web-vitals`;
- remove unused `eslint-config-prettier` if reconfirmed unused;
- update stale GitHub Actions majors while preserving current CI behavior;
- refresh stale Browserslist data;
- remove unused Tailwind `hero-pattern`.

### Approved active guidance/public presentation

- update `.github/copilot-instructions.md` to current Vite-era behavior;
- repair the public README;
- correct the future-facing GitHub-card implementation plan, especially stale CRA references and unsafe browser-token guidance.

### Explicitly deferred

- frontend Vitest / Testing Library suite;
- ESLint parser/rule repair and CI lint gating;
- route-level code splitting;
- long-term decision on the optional Express backend stub.

## Decision rule

Only implement an item now if it is:

1. a real security/stability problem;
2. visibly misleading or unprofessional for a public portfolio repo; or
3. cheap and clearly justified independently of Plinth.

Use the dedicated post-Vite review plan/checklist for execution details.

## Exit gate

> **No obvious foundation-era leftovers materially hurt stability, correctness, repository hygiene, or professional presentation.**

**Passed.** Required GitHub Actions CI, the Netlify deploy preview, and redirect processing were confirmed successful for PR #4 with no pending or failing checks.

---

# Step 5 — Re-run Security / Public-Readiness Audit

## Status

**Complete.**

## Goal

Verify that the modernized/stabilized tracked repository and reviewed Git history are safe for public visibility.

## Work

- Git baseline;
- tracked-file secret scan;
- reachable-history secret scan;
- remote branch/tag review where practical;
- confirm protected local secret-bearing files are ignored/untracked without reading them;
- dependency/config sanity checks across each npm project;
- confirm no generated security/audit artifact contains secret material.

## Result

- current branch/upstream state was clean and synchronized;
- no high-confidence credential, private-key, bearer-token, embedded-URL credential, or client-visible Vite secret pattern was found in tracked content;
- no protected environment/private-key file was found in reachable history;
- historical SendGrid material was limited to retired code/dependency identifiers and migration records, with no SendGrid credential shape detected;
- the local protected `.env` remained ignored/untracked and was not inspected;
- root and backend `npm audit` each reported zero vulnerabilities;
- current Vite, Netlify, CI, and server-side environment-variable usage showed no publication blocker;
- the ignored local `audit-report.json` remained untracked.

### Review later

- reconsider wildcard Lambda CORS origins during a focused auth-hardening pass;
- reconfirm that opt-in reset-token/internal-error testing flags are disabled during final deployment verification.

Neither follow-up is a confirmed public-release security blocker.

## Exit gate

> **No confirmed security blocker remains.**

**Passed.** Proceed to Step 6 for the separate manual review of intentional public information, infrastructure metadata, documentation, assets/licensing, and generated artifacts.

---

# Step 6 — Manual Public-Repository Review

Review intentional personal/contact information, infrastructure metadata, documentation, assets/licensing, README/setup instructions, dead links, and temporary/generated artifacts.

## Decision and remediation status

- The unrelated personal email in registration test data was replaced with a synthetic placeholder.
- AWS baseline exports retain their architecture and security relationships while unique account, IAM, API, role, policy, and other opaque deployment identifiers are represented by deterministic placeholders.
- The repository remains source-visible for portfolio and review purposes but all rights are reserved; no general reuse or redistribution license is granted. Stray backend and Lambda `ISC` metadata was reconciled to `UNLICENSED`.
- Ordinary employment and résumé history is intentionally retained, including the approved Forest Products Laboratory, Memorial Veterans Hospital, WECC, shipment-performance, and CQC production-statistic references.
- SameBoat, Cosmic DB, and Bullpen Report are first-party projects and are intentionally retained.
- First-party, AI-generated, and expressly authorized artwork is intentionally retained. Coursera certificate images are intentionally retained.
- The D&D and altered RiffTrax uses are consciously retained as owner-accepted, very-low-risk portfolio uses.
- Technology/service/stack logos were reviewed and accepted for public release: they originated from official brand assets, and local changes were limited to proportional scaling, cropping, and surrounding-area normalization without intentional redesign, recoloring, or distortion of the marks.
- Credly badge images were reviewed and accepted for public release: they represent credentials earned by the owner and are paired with their public Credly verification links.
- Deleting the obsolete `docs/FILE_STRUCTURE.md` is accepted. Structure documentation may later be regenerated and reintroduced through TreeMark rather than manually rebuilding the stale document.
- The historical `nickhansonsr@gmail.com` occurrence was reviewed and accepted.
- Historical AWS account and API identifiers were reviewed and accepted as non-secret historical metadata.
- No Git history rewrite is authorized at this time. A history rewrite may be reconsidered only if later auditing discovers actual secrets or private information.
- Wildcard Lambda CORS remains deferred to later auth hardening.
- Production configuration was manually confirmed in AWS: `showcaseForgotPassword` has `RETURN_RESET_TOKEN_FOR_TESTING=false`, and `showcaseRegistration` has `ENABLE_INTERNAL_ERROR_TEST=false`.

Step 6 is complete. Step 7 — Final Publication Verification — is next and has not yet begun.

## Exit gate

> **Passed: everything remaining is intentionally acceptable for public visibility.**

---

# Step 7 — Final Publication Verification

Confirm Git state, required CI, Vite production build/deployment, contact form/notification/spam protection, major routes, auth/private routes, AWS-backed features, final secret/history sanity, and all public-review decisions.

## Exit gate

> **Repository is deliberately judged safe and appropriate to make public.**

---

# Step 8 — Repository Visibility Change

Changing the GitHub repository from private to public is a separate explicit manual action.

---

# Step 9 — Continue Product Work

After public release:

- continue TreeMark landing-page work;
- evaluate additional modernization independently;
- later migrate this site into Plinth without Plinth-specific pre-preparation;
- use the migration effort/results as baseline data.

---

# Scope Guardrails

Do not use this sequence to add architectural layers, normalize content for Plinth, broadly redesign the app, broadly refactor auth/AWS, chase every dependency upgrade, or rewrite Git history without a confirmed need and explicit approval.
