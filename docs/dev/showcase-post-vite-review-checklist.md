# Showcase Site — Targeted Post-Vite Modernization Review Checklist

## CRA leftovers

- [ ] Confirm `react-scripts` is gone.
- [ ] Confirm `cra-template` is removed if unused.
- [ ] Confirm no stale CRA package scripts.
- [ ] Confirm no stale CRA test scaffolding remains unless intentionally kept.
- [ ] Search for `%PUBLIC_URL%`.
- [ ] Search for `REACT_APP_`.
- [ ] Search docs for stale CRA setup instructions.
- [ ] Search config/docs for old `build/` output assumptions.

## CI / GitHub Actions

- [ ] Confirm CI uses Vite-compatible commands.
- [ ] Review action-version deprecation warnings.
- [ ] Review Node runtime warnings.
- [ ] Fix only warnings that are clearly actionable and worthwhile.
- [ ] Confirm required status check remains healthy.

## Test strategy

- [ ] Decide whether to keep no-tests-allowed temporarily or add real tests.
- [ ] If adding tests, prefer Vitest + Testing Library or other Vite-appropriate tooling.
- [ ] Add only meaningful current-behavior tests.
- [ ] Do not recreate CRA boilerplate tests.

## Dependencies

- [ ] Check for unused CRA-era dependencies.
- [ ] Review high-severity dependency findings.
- [ ] Remove clearly unused packages.
- [ ] Avoid broad version-chasing.

## Netlify / deploy

- [ ] Confirm `dist/` publish assumptions.
- [ ] Confirm SPA redirects.
- [ ] Confirm Netlify Functions path.
- [ ] Check for stale CRA deployment notes.
- [ ] Check Vite env naming/documentation.

## Documentation

- [ ] Update docs made inaccurate by Vite migration.
- [ ] Keep historical docs where still useful.
- [ ] Remove only stale/misleading/temp generated material.

## Public presentation sanity

- [ ] Confirm README reflects current build foundation.
- [ ] Confirm setup instructions are accurate.
- [ ] Confirm no obvious “CRA is current” statements remain.
- [ ] Confirm no temporary migration artifacts should be public.

## Scope protection

- [ ] No service/repository layering added for neatness.
- [ ] No content normalization for Plinth.
- [ ] No Plinth adapters.
- [ ] No redesign.
- [ ] No broad auth/AWS refactor.
- [ ] No broad dependency modernization.

### Exit Gate

- [ ] **No obvious foundation-era leftovers materially hurt stability or professional presentation.**
