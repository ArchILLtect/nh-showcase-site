# Phase 10 — TreeMark Landing Page (Showcase Site Execution Plan)

Status: **In Progress**

Implementation repository: **`ArchILLtect/nh-showcase-site`**  
Source project: **TreeMark**  
Canonical route: **`/projects/treemark`**  
Primary production deliverable: **https://nickhanson.me/projects/treemark**

## Purpose

Execute TreeMark Phase 10 inside the Showcase Site repository.

The TreeMark repository remains the source project and authoritative product/release record. This repository owns the landing-page implementation, site integration, responsive/accessibility behavior, SEO/social metadata, and the real-world dogfooding of TreeMark against the Showcase Site itself.

The existing TreeMark Phase 10 planning documents remain the higher-level project record. This document is the implementation-facing execution plan for work performed in `nh-showcase-site`.

---

## Goal

Create and launch a polished public TreeMark landing page that:

- explains what TreeMark is quickly;
- demonstrates why it is useful;
- gives developers an immediate installation path;
- links clearly to npm, GitHub, and the v1.0.0 release;
- uses real TreeMark output and product visuals;
- integrates naturally with the existing Showcase Site;
- dogfoods TreeMark by using it to document this repository's structure.

Phase 10 should answer:

> Can a developer land on the TreeMark project page, understand the product quickly, see what it does, install it correctly, and reach the npm/GitHub sources without needing to decipher the repository first?

The page should present TreeMark as a real released developer tool, not as a school/demo-only project.

---

# 10A — Showcase-Site Baseline and TreeMark Dogfooding

Before building the landing page:

1. confirm the repository is public and production is stable;
2. create the Phase 10 implementation branch;
3. run the published TreeMark CLI against `nh-showcase-site`;
4. use TreeMark's README-oriented update workflow to regenerate repository structure documentation in `readme.md`;
5. review the generated tree for usefulness, scope, and readability;
6. treat the Showcase Site as a real-world TreeMark usage example.

The previous hand-maintained `docs/FILE_STRUCTURE.md` was intentionally removed during public-release cleanup because it was stale. It should not be manually reconstructed.

Instead, repository structure documentation should be reintroduced through TreeMark.

This creates a genuine dogfooding story:

> TreeMark is used to document the structure of the site that hosts TreeMark's own landing page.

Do not hand-maintain a duplicate structure document unless a later need independently justifies one.

---

# 10B — Page Architecture and Content Plan

Lock the page structure before implementation.

Recommended content hierarchy:

1. Hero / product identity
2. What TreeMark does
3. Core capabilities
4. Quick install
5. CLI examples
6. Output examples / screenshots
7. Why TreeMark exists / use cases
8. Release / platform support
9. Project links
10. Final CTA

The exact section order may change during implementation, but the page should remain concise enough to scan quickly.

Reuse existing Showcase Site patterns where they fit. Do not create unnecessary page-specific architecture.

---

# 10C — Hero and Product Positioning

Create a strong first-screen presentation.

Include:

- TreeMark name and branding;
- concise product description;
- one clear install or GitHub CTA;
- a secondary npm/GitHub link as appropriate;
- visual identity consistent with the TreeMark README/banner;
- language that emphasizes:
  - deterministic directory-tree generation;
  - Markdown-friendly output;
  - safe synchronization;
  - CI freshness checking.

Avoid presenting TreeMark as a generic filesystem browser.

---

# 10D — Installation and Quick Start

Provide a clear installation path using the published scoped package:

```bash
npm install --global @nickhansonsr/treemark
```

Show the installed CLI command separately:

```bash
treemark --help
```

Include at least one minimal working example:

```bash
treemark .
```

Optionally include one or two representative advanced examples:

```bash
treemark ./docs --format ascii
treemark . --update README.md
treemark . --update README.md --check
```

Keep the landing-page examples representative rather than exhaustive. The TreeMark README remains the detailed CLI reference.

---

# 10E — Feature Demonstration

Represent the released v1.0.0 capability set accurately.

Core feature callouts should cover:

- Markdown directory trees;
- ASCII directory trees;
- `--output`;
- safe marked-region synchronization with `--update`;
- no-write freshness verification with `--check`;
- exit codes suitable for automation / CI;
- repeatable ignore patterns;
- maximum depth;
- cross-platform support;
- Node.js 22+ requirement.

Do not advertise deferred capabilities as released.

---

# 10F — Visual Evidence

Use real TreeMark output wherever possible.

Preferred visual assets:

- existing TreeMark README banner;
- real CLI screenshots;
- marker/synchronization screenshots;
- a compact Markdown-tree example;
- optional before/after synchronization example;
- the Showcase Site README structure output generated by TreeMark.

Requirements:

- visuals should demonstrate the actual product rather than act as decoration only;
- screenshots should remain readable at common desktop widths;
- images should have meaningful alt text;
- avoid redundant screenshots that repeat the same information;
- optimize assets appropriately for web delivery.

---

# 10G — Product Links and Trust Signals

Provide clear links to official TreeMark surfaces:

- npm package: `@nickhansonsr/treemark`;
- GitHub repository: `https://github.com/ArchILLtect/treemark`;
- GitHub Release: `TreeMark v1.0.0`;
- project homepage route itself;
- issue tracker where useful.

Useful trust signals may include:

- v1.0.0 released;
- MIT licensed;
- Windows / macOS / Linux;
- Node.js 22+;
- package available publicly on npm;
- CI-tested across supported OS / Node combinations.

Do not add unsupported claims.

---

# 10H — Showcase-Site Integration

Implement the page in this repository.

The page should:

- use the existing routing architecture;
- fit the site's established layout/navigation conventions;
- remain responsive;
- preserve site-wide accessibility patterns;
- avoid introducing unnecessary one-off architecture;
- reuse existing shared components where appropriate;
- remain maintainable as TreeMark evolves.

If TreeMark already has a project card or portfolio entry, update its CTA so it resolves to `/projects/treemark`.

Do not pre-shape this site for Plinth.

Guiding rule:

> **Modernize what is independently justified; stabilize what is necessary; do not add architecture merely to ease a future Plinth migration.**

---

# 10I — Accessibility and Responsive Verification

Verify:

- semantic heading order;
- keyboard navigation;
- visible link/button focus states;
- image alt text;
- readable contrast;
- no critical information conveyed by color alone;
- desktop, tablet, and mobile layouts;
- no horizontal overflow;
- code blocks remain readable on narrow screens;
- reduced-motion behavior if animation is introduced.

---

# 10J — SEO and Social Metadata

Set project-page metadata appropriate to the Showcase Site stack.

Include as supported by the site:

- page title;
- meta description;
- canonical URL;
- Open Graph title;
- Open Graph description;
- Open Graph/social image;
- route discoverability through sitemap/navigation where applicable.

Canonical public URL:

`https://nickhanson.me/projects/treemark`

---

# 10K — Verification and Launch

Before considering Phase 10 complete:

- run the Showcase Site's existing quality gates;
- verify the route locally;
- verify preview deployment;
- verify production deployment;
- verify external npm and GitHub links;
- verify install-command spelling;
- verify screenshots and image loading;
- verify mobile/desktop behavior;
- verify HTTPS;
- verify existing site routes were not regressed;
- verify the npm `homepage` URL resolves successfully;
- perform a final content proofread.

If a live interaction causes external side effects, do not perform it automatically without explicit owner approval.

---

# Repository Boundaries

## Showcase Site repo owns

- Phase 10 implementation tracking;
- README TreeMark dogfooding / generated structure section;
- `/projects/treemark` route implementation;
- page components;
- styling;
- responsive behavior;
- accessibility;
- page-specific metadata;
- site navigation/project-card integration;
- optimized landing-page assets;
- preview/production verification.

## TreeMark repo owns

- CLI/package implementation;
- authoritative README and CLI reference;
- product contract;
- release documentation;
- npm/GitHub metadata;
- optional README link back to the landing page;
- Phase 10 project-management closure;
- final broader MVP-complete status.

Do not duplicate TreeMark runtime code into the Showcase Site.

If Phase 10 exposes a genuine TreeMark CLI bug or product defect, track/fix that in the TreeMark repo rather than patching around it here.

---

# Definition of Done

Phase 10 is complete when:

1. TreeMark has been used against `nh-showcase-site` to regenerate/update the repository structure section in `readme.md`.
2. The generated README structure is useful and accurate enough for ongoing real-world use.
3. `https://nickhanson.me/projects/treemark` is live in production.
4. The page clearly explains what TreeMark is and why it is useful.
5. The scoped npm install command is correct.
6. The `treemark` executable is clearly distinguished from the npm package name.
7. The page demonstrates the released v1.0.0 feature set accurately.
8. npm, GitHub, and release links work.
9. Real TreeMark output or screenshots are included.
10. The page is responsive and accessible.
11. SEO/social metadata is configured appropriately.
12. Existing Showcase Site project navigation/cards link to the route where appropriate.
13. Production deployment succeeds without regressions.
14. The npm `homepage` URL resolves to the live landing page.
15. Any TreeMark-repo coordination/docs touch-ups are completed.
16. Phase 10 is marked **Complete** in TreeMark project management.
17. TreeMark's broader MVP delivery is considered complete.

---

# Scope Guardrails

Do not use Phase 10 to:

- broadly refactor the Showcase Site;
- redesign unrelated pages;
- add Plinth-specific adapters or architecture;
- duplicate TreeMark runtime logic;
- add unsupported TreeMark features;
- turn the landing page into a full CLI reference;
- manually recreate stale structure documentation that TreeMark itself can generate.

Phase 10 should stay focused on dogfooding, product presentation, integration, accessibility, metadata, and launch.
