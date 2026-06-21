---
phase: 20-theme-routes-and-dark-ui
plan: 01
subsystem: route-registry
tags: [solidstart, routes, sitemap, themes, vitest]

requires:
  - phase: 19-theme-domain-foundation
    provides: public theme helper contracts, including themeDetailRoutes()
provides:
  - Themes top-level site route and navigation entry
  - Helper-derived public theme detail prerender route inclusion
  - Phase 20 sitemap route source excluding theme paths until Phase 22
affects: [20-theme-routes-and-dark-ui, 22-theme-metadata-and-structured-data]

tech-stack:
  added: []
  patterns:
    - "Split static prerender routes from public sitemap routes with sitemapRoutes"
    - "Route registry includes theme paths through themeDetailRoutes() rather than copied slug arrays"

key-files:
  created:
    - src/domain/theme-routes.test.ts
  modified:
    - src/domain/routes.ts
    - src/domain/seo.ts
    - src/domain/foundation.test.ts
    - src/domain/portfolio-surfaces.test.ts
    - src/domain/writing.test.ts

key-decisions:
  - "Keep /themes and public /themes/{slug} in SolidStart prerender data while excluding theme paths from sitemapXml() by default."
  - "Use the existing Phase 19 themeDetailRoutes() helper as the only source for theme detail route strings."

patterns-established:
  - "Phase-boundary route splits use exported route arrays instead of changing generator call sites."
  - "Navigation order assertions include Themes between Writing and Contact."

requirements-completed: [ROUTE-01, ROUTE-03, ROUTE-04]
generated_by: gsd-execute-plan
lifecycle_mode: yolo
phase_lifecycle_id: 20-2026-06-17T16-16-59
generated_at: 2026-06-17T17:28:09Z

duration: 4 min
completed: 2026-06-17
---

# Phase 20 Plan 01: Theme Route Registry and Sitemap Boundary Summary

**Helper-derived theme prerender routes with a separate Phase 20 sitemap route boundary**

## Performance

- **Duration:** 4 min
- **Started:** 2026-06-17T17:24:14Z
- **Completed:** 2026-06-17T17:28:09Z
- **Tasks:** 1
- **Files modified:** 6

## Accomplishments

- Added `/themes` as a normal top-level route labeled `Themes`, with navigation order `Home`, `About`, `Projects`, `Writing`, `Themes`, `Contact`.
- Appended public theme detail routes to `prerenderRoutes` through `themeDetailRoutes()`.
- Added `sitemapRoutes` and changed `sitemapXml()` defaults so `/themes` and `/themes/{slug}` remain out of sitemap output until Phase 22.
- Added focused route-boundary tests and updated existing exact route/sitemap expectations.

## Task Commits

This TDD task produced separate RED and GREEN commits:

1. **RED: Add failing theme route boundary tests** - `01b601a` (test)
2. **GREEN: Add theme route prerender boundary** - `80ffb41` (feat)

## Files Created/Modified

- `src/domain/theme-routes.test.ts` - Focused tests for `/themes`, navigation order, prerender composition, and sitemap exclusion.
- `src/domain/routes.ts` - Adds the Themes site route, appends `themeDetailRoutes()` to `prerenderRoutes`, and exports `sitemapRoutes`.
- `src/domain/seo.ts` - Defaults `sitemapXml()` to `sitemapRoutes`.
- `src/domain/foundation.test.ts` - Updates aggregate route composition coverage for theme prerender and sitemap routes.
- `src/domain/portfolio-surfaces.test.ts` - Verifies default sitemap XML uses `sitemapRoutes` and excludes theme paths.
- `src/domain/writing.test.ts` - Updates the directly related primary navigation order expectation.

## Decisions Made

- Followed the plan's Phase 20 boundary: theme HTML routes are prerendered, but theme sitemap exposure stays deferred to Phase 22.
- Preserved `app.config.ts` `crawlLinks: false`; no crawler-derived route discovery was introduced.
- Preserved low-intrusion OpenLinks behavior; no theme route CTA or identity-promotion changes were added.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Updated stale writing navigation expectation**
- **Found during:** Task 1 full test verification
- **Issue:** `src/domain/writing.test.ts` still expected primary navigation to be `Home, About, Projects, Writing, Contact`, which no longer matches the planned Themes route insertion.
- **Fix:** Updated the expectation and test name to include `Themes` between `Writing` and `Contact`.
- **Files modified:** `src/domain/writing.test.ts`
- **Verification:** `bun run test` passed with 173 tests.
- **Committed in:** `80ffb41`

***

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Directly related test expectation fix only. No production scope expansion and no Phase 21/22/23 work added.

## Issues Encountered

- The TDD RED run failed as expected because `/themes`, `themeDetailRoutes()` prerender inclusion, and `sitemapRoutes` were not implemented yet.
- Full unit tests initially exposed the stale writing navigation assertion; it was fixed as a directly caused test update.

## Verification

- `bun run test src/domain/theme-routes.test.ts src/domain/foundation.test.ts src/domain/portfolio-surfaces.test.ts` - passed, 24 tests.
- `bun run test src/domain/theme-routes.test.ts src/domain/foundation.test.ts src/domain/portfolio-surfaces.test.ts src/domain/writing.test.ts` - passed, 37 tests.
- `bun run test` - passed, 173 tests.
- `bun run typecheck` - passed.
- `bun run check` - passed.
- `bun run build` - passed and prerendered `/themes`, `/themes/agentic-engineering`, and `/themes/open-identity`.
- Acceptance `rg` checks passed, including the negative Phase 22 scope guard.

## Known Stubs

None.

## Threat Flags

None - changes stayed within the planned static route registry, sitemap route source, and test surfaces.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Plan 20-02 can consume the route registry output to build `/themes` and public theme detail UI. Theme metadata, structured data, and sitemap exposure remain deferred to Phase 22.

## Self-Check: PASSED

- Found `src/domain/theme-routes.test.ts`.
- Found `.planning/phases/20-theme-routes-and-dark-ui/20-01-SUMMARY.md`.
- Found task commit `01b601a`.
- Found task commit `80ffb41`.

***
*Phase: 20-theme-routes-and-dark-ui*
*Completed: 2026-06-17*
