# Kickoff Prompt — Modernize the Showcase Site Foundation (CRA → Vite)

I want to begin a focused CRA → Vite modernization of my production personal showcase site.

## Current project direction

The repository is being prepared to become public and is my professional developer showcase.

The locked order is now:

```text
repository governance / CI        ✅ complete
→ CRA → Vite
→ Netlify Forms migration
→ remove SendGrid + retire credential
→ targeted post-Vite review
→ security/public-readiness audit
→ manual public-repo review
→ final verification
→ make repository public
```

CRA → Vite now happens **before** the Netlify Forms migration because implementing Netlify's build-time form detection in CRA immediately before replacing the CRA build/HTML structure would create avoidable rework.

## Primary goal

Replace Create React App / `react-scripts` with Vite while preserving existing application behavior.

This is a **foundation migration**, not a redesign or broad refactor.

## Important future-Plinth constraint

This site will later be used as a realistic migration baseline for Plinth.

Do **not** prepare it for Plinth.

Specifically, do not:

- add service/repository layers merely for architectural cleanliness;
- normalize content for CMS ingestion;
- add Plinth adapters;
- reorganize the application around a future Plinth schema;
- restructure components solely to make future migration easier.

Modernize only what is independently justified.

## Scope discipline

Do not automatically combine this migration with:

- React major-version upgrades;
- React Router redesign;
- Tailwind major-version upgrades;
- auth refactoring;
- AWS redesign;
- broad dependency upgrades;
- Netlify Forms implementation;
- SendGrid removal;
- TreeMark page implementation;
- UI redesign;
- general codebase cleanup.

If something outside the scope becomes technically required for Vite compatibility, surface it explicitly before proceeding.

## Security boundary

Follow repository secret-handling instructions.

Do not open, read, print, quote, summarize, or inspect protected secret-bearing files.

Inspect source references and variable names only.

## Repository grounding

Before relying on repository state:

1. Confirm current branch.
2. Confirm current HEAD.
3. Confirm Git status.
4. Confirm checkout is current enough with remote.

The checked-out repository and Git history are the source of truth.

## First task — inspection and migration planning only

**Do not modify files yet.**

Inspect the current repository and identify exactly what depends on CRA behavior.

Review, where relevant:

- `package.json`;
- `react-scripts`;
- npm scripts;
- current React entry point;
- CRA `public/index.html`;
- `%PUBLIC_URL%`;
- public/static assets;
- environment-variable references;
- Tailwind config;
- PostCSS config;
- React Router setup;
- CRA proxy behavior;
- optional local Express stub;
- test/Jest remnants;
- Netlify config;
- Netlify Functions;
- SPA redirects;
- CI workflow;
- build output assumptions (`build/` vs `dist/`);
- dependencies currently supplied indirectly by CRA.

## Deliverable for the first response

Return:

1. **Current-state assessment**
   - CRA-specific pieces;
   - straightforward migration areas;
   - risky/uncertain areas.

2. **Exact migration surface**
   - files/config likely to change;
   - CRA assumptions to remove/adapt.

3. **Phased implementation plan**
   - small, reviewable steps;
   - validation checkpoint after each step.

4. **Regression checklist**
   - what must be proven before migration is complete.

5. **Risks / unknowns**

6. **Estimated time to completion**
   - best case;
   - realistic case;
   - worst reasonable case.

7. **Recommended first implementation step**
   - but do not execute it yet.

Do not implement until I review and approve the plan.
