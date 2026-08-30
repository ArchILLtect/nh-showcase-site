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
4. Targeted post-Vite modernization review     🔄 IN PROGRESS
5. Re-run security / public-readiness audit
6. Manual public-repository review
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

**Review complete; approved FIX NOW implementation in progress.**

The Vite/Netlify production foundation is sound.

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

Pending implementation/validation.

---

# Step 5 — Re-run Security / Public-Readiness Audit

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

## Exit gate

> **No confirmed security blocker remains.**

---

# Step 6 — Manual Public-Repository Review

Review intentional personal/contact information, infrastructure metadata, documentation, assets/licensing, README/setup instructions, dead links, and temporary/generated artifacts.

## Exit gate

> **Everything remaining is intentionally acceptable for public visibility.**

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
