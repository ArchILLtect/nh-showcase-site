# Showcase Site — Netlify Forms Migration Plan

## Purpose

Replace the SendGrid-backed contact flow with Netlify Forms directly **after CRA → Vite modernization is complete and merged**.

This order avoids implementing Netlify form detection against CRA's `public/index.html` immediately before replacing the CRA HTML/build structure.

## Status

**Netlify Forms proven; application cleanup complete.** The deployed `contact` form is detected, stores submissions with the expected fields, applies honeypot protection, sends native notifications, and receives the React form's URL-encoded `POST /`. The legacy Function was not invoked during verification and has now been deleted; `@sendgrid/mail`, root `dotenv`, and the obsolete Netlify Functions configuration were removed.

Manual deletion of the local credential and provider-side SendGrid key revocation remain pending and are intentionally outside the repository cleanup.

## Preconditions

- CRA → Vite migration is complete.
- Vite production build succeeds.
- Vite deploy preview is stable.
- Current `main` contains the Vite foundation.
- A dedicated Netlify Forms branch is created from current `main`.

## Scope

### In scope

- preserve existing React contact UX;
- add Netlify-detectable static form markup to HTML emitted by Vite;
- submit URL-encoded form data directly to Netlify Forms;
- use Netlify-native spam protection;
- verify deployed capture and notification;
- remove SendGrid only after replacement is proven.

### Out of scope

- CRA → Vite;
- Plinth preparation;
- service/repository layers;
- general architectural refactoring;
- redesign;
- broad dependency upgrades;
- auth/AWS changes.

## Historical flow before migration

```text
Contact.jsx
→ legacy Netlify Function
→ SendGrid
→ email
```

## Target flow

```text
Contact.jsx
→ Netlify Forms
→ Netlify submission storage
→ Netlify-native notification
```

## Detection rule

Because the visible form is React-rendered, Netlify must receive a static detectable form definition in HTML emitted by the Vite build.

Confirm the exact Vite HTML location before implementation. The Vite root `index.html` is the expected candidate if it is confirmed to be part of deployed output.

No secret-bearing file needs to be read for this migration.

---

## Phase 1 — Baseline

- confirm Vite migration is merged/stable;
- confirm branch/HEAD/clean working tree;
- confirm form fields/UX;
- keep SendGrid rollback path intact;
- confirm Netlify Forms availability;
- confirm exact static-form location in Vite output.

## Phase 2 — Detection markup

- add stable `contact` form definition;
- add matching `name`, `email`, `message` fields;
- add honeypot/spam configuration;
- build;
- verify markup survives into deployable output.

## Phase 3 — React submission

- add visible form name;
- add hidden `form-name`;
- add honeypot field if required;
- replace JSON function POST with URL-encoded Netlify Forms POST;
- preserve controlled inputs/loading/success/errors;
- build/validate.

## Phase 4 — Deploy proof

- deploy preview;
- confirm Netlify detects `contact`;
- submit real test;
- confirm storage/fields/success UX;
- configure/confirm native notification;
- confirm notification arrives;
- confirm spam protection;
- confirm legacy SendGrid path is not used.

### Hard gate

> **Do not remove SendGrid until deployed proof passes.**

## Phase 5 — Remove SendGrid

- delete unused legacy function;
- remove `@sendgrid/mail`;
- remove `dotenv` only if otherwise unused;
- remove tracked SendGrid/API-key/old-path references;
- update lockfile;
- run CI/Vite build;
- re-test deployed form.

## Phase 6 — Retire credential

- remove obsolete local credential without viewing/copying it;
- delete env file only if otherwise unnecessary;
- revoke/delete provider-side key.

## Phase 7 — Final verification

- re-test capture/notification/spam;
- confirm expected diff;
- confirm no secret-bearing tracked/staged file;
- open PR;
- required CI passes;
- merge.
