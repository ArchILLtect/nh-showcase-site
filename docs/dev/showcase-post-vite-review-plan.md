# Showcase Site — Targeted Post-Vite Modernization Review Plan

## Purpose

Perform a narrow review after the CRA → Vite migration and before the final public-readiness audit.

The goal is to catch obvious foundation-era leftovers without turning the project into a broad refactor or pre-adapting it for Plinth.

## Guiding rule

Only fix an item in this phase if it is:

1. a real security/stability problem;
2. visibly misleading or unprofessional for a public portfolio repo; or
3. cheap and clearly justified independently of Plinth.

## Review Areas

### 1. CRA leftovers

Check for:

- `react-scripts`;
- `cra-template`;
- stale CRA scripts;
- CRA-only test scaffolding;
- `%PUBLIC_URL%`;
- `REACT_APP_*` references;
- CRA-specific README/setup text;
- old `build/` output assumptions.

### 2. CI / GitHub Actions

Review:

- action-version deprecation warnings;
- Node runtime warnings;
- stale commands tied to CRA;
- whether Vite build/test commands are correctly enforced.

Do not add complex CI merely for appearance.

### 3. Test strategy

After Vite, decide whether to:

- leave CI in an honest no-tests-allowed state temporarily; or
- add a small meaningful Vitest/Testing Library smoke suite.

If tests are added, prefer real current behavior such as:

- app/router smoke render;
- contact-page state behavior;
- auth guard behavior;
- small utility tests.

Do not recreate boilerplate tests merely to claim test coverage.

### 4. Dependencies

Review:

- high-severity vulnerabilities;
- dependencies left behind by CRA;
- packages that are clearly unused after migration.

Do not broadly upgrade dependencies unless independently justified.

### 5. Netlify / deploy configuration

Check:

- `dist/` publish assumptions;
- SPA redirects;
- Functions path;
- stale CRA deployment notes;
- environment-variable naming/documentation affected by Vite.

### 6. Documentation

Update docs that became inaccurate because of the Vite migration.

Do not rewrite historical documentation merely to make everything look freshly authored.

### 7. Public presentation sanity

Flag only obvious issues such as:

- technical docs claiming CRA is still current;
- obsolete setup instructions;
- misleading package/build notes;
- generated temporary files that should not ship publicly.

## Explicitly Out of Scope

Do not:

- add service/repository layers;
- normalize content;
- redesign components;
- refactor auth/AWS without a concrete need;
- add Plinth adapters;
- reorganize around future CMS schemas;
- perform broad style cleanup.

## Exit Gate

> **No obvious foundation-era leftovers materially hurt stability, correctness, or professional presentation.**
