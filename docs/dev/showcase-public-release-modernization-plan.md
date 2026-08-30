# Showcase Site — Public-Release Modernization Plan

## Purpose

Prepare the Showcase Site to become a public professional repository while modernizing only what is independently justified.

The site should remain representative of a normal, organically evolved external React site so it can later serve as a realistic Plinth migration baseline.

## Guiding principle

> **Modernize what is independently justified; stabilize what is necessary for public release; do not pre-shape the site for Plinth.**

This means:

- modernize deprecated or visibly stale foundations;
- fix real security/stability issues;
- remove unnecessary secret-bearing integrations;
- keep the repository professionally presentable;
- do **not** add architectural layers, adapters, or content normalization merely to make future Plinth migration easier.

---

# Locked Work Order

```text
0. Repository governance / CI                  ✅ COMPLETE
1. CRA → Vite foundation migration
2. Netlify Forms migration
3. Remove SendGrid + retire credential
4. Targeted post-Vite modernization review
5. Re-run security / public-readiness audit
6. Manual public-repository review
7. Final publication verification
8. Change repository visibility to public
9. Continue TreeMark / later product work
```

## Why Vite now comes before Netlify Forms

The earlier sequence placed the Netlify Forms migration first.

That would work technically, but it creates avoidable transitional work because the CRA implementation relies on CRA's HTML/build structure, particularly `public/index.html`.

Since CRA → Vite is already independently justified before public release, the cleaner sequence is:

```text
CRA
→ Vite
→ stabilize Vite
→ implement Netlify Forms once against final build structure
```

This avoids:

- implementing static Netlify form detection in CRA and then moving/reworking it in Vite;
- validating the contact form against two build systems;
- immediately making the CRA-specific migration documentation stale.

---

# Step 0 — Repository Governance Baseline

## Goal

Protect `main` before substantial modernization/public-release work.

## Required state

- basic CI workflow exists;
- CI installs dependencies, runs tests, and builds;
- the temporary no-tests state is allowed honestly;
- CI is green;
- `main` ruleset is active;
- pull requests are required before merging;
- required status check is enabled;
- force pushes are blocked;
- branch deletion is restricted.

## Status

**Complete.**

---

# Step 1 — CRA → Vite Foundation Migration

## Goal

Replace deprecated Create React App tooling with Vite while preserving existing application behavior.

## In scope

- remove `react-scripts`;
- add Vite and React plugin/config;
- replace CRA HTML shell with Vite root `index.html`;
- update React entry point as required;
- update package scripts;
- migrate CRA-specific environment-variable references if present;
- resolve `%PUBLIC_URL%` usage;
- verify public/static asset behavior;
- verify Tailwind/PostCSS compatibility;
- preserve React Router behavior;
- preserve SPA redirects;
- preserve Netlify Functions;
- update Netlify publish output from `build/` to `dist/` where needed;
- update CI as required by Vite;
- make only migration-required test-runner changes.

## Out of scope unless technically required

- React major-version upgrade;
- React Router redesign;
- Tailwind major-version upgrade;
- auth refactor;
- AWS redesign;
- UI redesign;
- broad dependency modernization;
- service/repository layers;
- content normalization;
- Plinth adapters;
- TreeMark landing-page implementation.

## Validation

Prove existing behavior survives:

- home page;
- projects;
- contact page;
- routing and direct-route refreshes;
- login/register;
- authenticated/private routes;
- admin functionality;
- blog/static data;
- dark mode;
- visit tracking;
- AWS calls;
- Netlify Functions;
- responsive behavior;
- production build;
- Netlify deploy preview.

## Exit gate

> **Vite foundation is stable and existing application behavior is preserved.**

## Status

**Functionally complete.** The CRA baseline was captured on Node 24, the Vite production build and CI pass, and the corrected Netlify configuration produces a successful deploy preview from `dist/`. Targeted validation covered public and direct routes, authentication and protected access, blog content, contact-page rendering, dark-mode persistence, responsive navigation, payments, and recovery/verification rendering.

The legacy contact form was deliberately not submitted during this phase so the SendGrid-backed path was not exercised unnecessarily. Form submission validation remains part of Step 2. The migration PR is open; merging it is the only remaining Step 1 administrative action.

---

# Step 2 — Netlify Forms Migration

## Goal

Replace the SendGrid-backed contact submission flow with Netlify Forms directly, now against the stable Vite foundation.

## Work

- confirm current form UX and fields;
- keep SendGrid path intact as rollback insurance;
- confirm Netlify Forms availability;
- add Netlify-detectable static form markup to HTML emitted by the Vite build;
- convert React form submission to URL-encoded Netlify Forms POST;
- preserve controlled inputs, loading state, success state, and useful error handling;
- use Netlify-native spam protection;
- deploy preview;
- confirm form detection;
- submit a real test;
- confirm storage, field values, notification, spam protection, and visible UX.

## Hard gate

> **Do not remove SendGrid until the deployed Netlify Forms replacement is proven.**

Use the dedicated Netlify Forms plan/checklist for detailed execution.

---

# Step 3 — Remove SendGrid + Retire Credential

## Goal

Remove the obsolete provider-specific contact backend after Netlify Forms is proven.

## Work

- remove legacy contact Netlify Function if unused;
- remove `@sendgrid/mail`;
- remove `dotenv` only if no legitimate use remains;
- remove tracked SendGrid/API-key/old-endpoint references;
- update lockfile;
- run CI/Vite build;
- re-test deployed form;
- remove obsolete local credential without displaying/copying it;
- revoke/delete obsolete provider-side API key.

## Exit gate

> **No active SendGrid code path, dependency, tracked reference, or obsolete live credential remains.**

---

# Step 4 — Targeted Post-Vite Modernization Review

## Goal

Catch obvious foundation-era leftovers without turning this phase into a broad refactor.

This is a review phase, not permission for architecture cleanup.

## Review candidates

- stale CRA files/dependencies;
- CI action-version warnings;
- obsolete package scripts/config;
- test strategy after Vite;
- high-severity dependency issues;
- docs made stale by the migration;
- build/deploy assumptions that still reference CRA;
- obviously misleading public-facing technical notes.

## Decision rule

Only implement an item now if it is:

1. a real security/stability problem;
2. visibly misleading or unprofessional for a public portfolio repo; or
3. cheap and clearly justified independently of Plinth.

Do **not** add layers/separation of concerns solely for architectural neatness.

## Exit gate

> **No obvious foundation-era leftovers materially hurt stability or professional presentation.**

Use the dedicated post-Vite review plan/checklist.

---

# Step 5 — Re-run Security / Public-Readiness Audit

## Goal

Verify that the modernized/stabilized tracked repository and reviewed Git history are safe for public visibility.

## Work

- `git fetch --prune`;
- `git status -sb`;
- confirm branch/HEAD;
- tracked-file secret scan;
- reachable-history secret scan;
- relevant remote branch/tag review where practical;
- confirm protected local secret-bearing files are ignored/untracked without reading them;
- dependency/config sanity checks;
- confirm no generated security/audit artifact contains secret material.

## Exit gate

> **No confirmed security blocker remains.**

---

# Step 6 — Manual Public-Repository Review

## Goal

Review information that may be technically safe but undesirable, unnecessary, or legally questionable to expose publicly.

## Areas

### Personal / contact information

Confirm that all visible:

- email addresses;
- usernames;
- profile links;
- portfolio metadata;

are intentionally public.

### Infrastructure metadata

Review:

- API Gateway identifiers;
- Lambda names;
- AWS account/infrastructure identifiers;
- deployment notes;
- baseline/export documentation.

Public configuration is not automatically a secret. Keep useful technical depth where appropriate.

### Documentation

Review:

- `docs/`;
- setup notes;
- migration notes;
- operational notes;
- AI-agent instructions;
- historical technical records.

Remove only stale, misleading, private, unsafe, or genuinely unhelpful material.

### Assets / licensing

Review:

- images;
- icons;
- fonts;
- screenshots;
- copied/third-party assets.

Confirm public redistribution is appropriate.

### Public-repo hygiene

Review:

- README;
- repo description;
- setup instructions;
- dead links;
- temporary/generated artifacts.

## Exit gate

> **Everything remaining is intentionally acceptable for public visibility.**

---

# Step 7 — Final Publication Verification

## Goal

Perform one final pre-publication pass.

## Final checks

### Git

- `git fetch --prune`;
- `git status -sb`;
- confirm expected branch/HEAD;
- confirm no unexpected staged/untracked files;
- confirm no secret-bearing file is staged/tracked.

### CI / build / runtime

- required CI green;
- production Vite build succeeds;
- deployed site works;
- contact form works;
- Netlify notification works;
- spam protection works;
- major public routes work;
- auth/private routes work as appropriate;
- AWS-backed features work as appropriate.

### Security

- final tracked-file secret scan;
- final history sanity check;
- obsolete SendGrid credential retired;
- no security/audit artifact contains secret material.

### Public-review confirmation

- personal-info decision confirmed;
- infrastructure-metadata decision confirmed;
- asset/licensing decision confirmed;
- documentation decision confirmed.

## Exit gate

> **Repository is deliberately judged safe and appropriate to make public.**

---

# Step 8 — Repository Visibility Change

Changing the GitHub repository from private to public is a separate explicit manual action.

Do not automate it as part of another task.

---

# Step 9 — Continue Product Work

After public release:

- continue TreeMark landing-page work;
- evaluate additional modernization independently;
- later, when Plinth reaches the appropriate PoC/MVP stage, migrate this site **without Plinth-specific pre-preparation**;
- use the migration effort/results as baseline data for real-world Plinth migration complexity.

---

# Scope Guardrails

Do not use this sequence to:

- add service/repository layers merely for architectural neatness;
- normalize content for future CMS ingestion;
- add Plinth adapters;
- broadly redesign the application;
- broadly refactor auth/AWS;
- chase every dependency upgrade;
- rewrite Git history without a confirmed need and explicit approval.

The goal is a site that is modern enough to be professionally healthy while still organically representative of a normal outside site.
