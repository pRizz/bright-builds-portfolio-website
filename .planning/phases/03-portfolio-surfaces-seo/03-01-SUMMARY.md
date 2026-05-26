---
phase: 03-portfolio-surfaces-seo
plan: 01
subsystem: seo-domain
tags: [typescript, vitest, seo, json-ld, sitemap, robots, curated-content]

requires:
  - phase: 02-curated-content-model
    provides: Authoritative curated project registry, profile identity data, route registry, and no-runtime-GitHub guard.
provides:
  - Typed flagship project story details and current-focus selectors.
  - Pure route/social metadata, JSON-LD, sitemap, robots, and asset-link helpers.
  - Focused Vitest coverage for Phase 3 portfolio surface contracts.
affects: [03-02-portfolio-surfaces, 03-03-static-seo-assets, route-head-rendering, static-verification]

tech-stack:
  added: []
  patterns:
    - Pure data-in/data-out metadata derivation in `src/domain/seo.ts`.
    - Checked-in curated story details on `ProjectStory`.
    - Script-safe JSON-LD serialization with `<` escaping.

key-files:
  created:
    - src/domain/portfolio-surfaces.test.ts
  modified:
    - src/domain/projects.ts
    - src/domain/routes.ts
    - src/domain/seo.ts
    - src/domain/foundation.test.ts

key-decisions:
  - "Phase 3 portfolio story and SEO contracts remain pure TypeScript domain helpers with no Solid, DOM, filesystem, network, or GitHub runtime dependency."
  - "OpenLinks identity metadata derives from `profileSameAsLinks` so OpenLinks remains a sameAs identity hub beside GitHub, not the primary portfolio brand."
  - "Project deep links use stable `/projects#${slug}` anchors until richer per-project routes and social images are intentionally added later."

patterns-established:
  - "Portfolio story fields: `story.problem`, `story.approach`, and `story.whyItMatters` live on each curated project record."
  - "SEO helpers return complete metadata objects consumed by later route-head rendering instead of duplicating route literals in components."
  - "Crawler outputs derive from `siteRoutes`, `visibleProjects`, and `peterProfile.canonicalOrigin`."

requirements-completed: [EXP-01, EXP-04, SEO-01, SEO-02, SEO-03, SEO-05]
generated_by: gsd-execute-plan
lifecycle_mode: yolo
phase_lifecycle_id: 3-2026-05-26T10-37-25
generated_at: 2026-05-26T11:46:46Z

duration: 8min
completed: 2026-05-26
---

# Phase 03 Plan 01: Pure Portfolio Story and SEO Contracts Summary

**Typed project story details plus pure SEO, JSON-LD, sitemap, robots, and social metadata helpers for Phase 3 route surfaces.**

## Performance

- **Duration:** 8 min
- **Started:** 2026-05-26T11:39:01Z
- **Completed:** 2026-05-26T11:46:46Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- Added `ProjectStoryDetails` to every curated project and exact flagship problem/approach/why-it-matters copy for the six home stories.
- Added current-focus selection, `/projects#slug` anchor derivation, and visitor-facing project link label derivation.
- Extended route copy and pure SEO helpers for social image metadata, asset links, `Person` sameAs, project `ItemList`, sitemap XML, robots text, and JSON-LD script serialization.
- Added focused Vitest coverage for all new domain contracts and updated the existing foundation metadata assertion.

## Task Commits

Each task was committed atomically through TDD RED/GREEN commits:

1. **Task 1 RED: Add failing portfolio surface tests** - `537d500` (test)
2. **Task 1 GREEN: Add project story surface helpers** - `aebfd06` (feat)
3. **Task 2 RED: Add failing SEO helper tests** - `eea7829` (test)
4. **Task 2 GREEN: Add pure SEO metadata helpers** - `aafacce` (feat)

## Files Created/Modified

- `src/domain/portfolio-surfaces.test.ts` - Focused pure-domain tests for story details, current focus, anchors, social metadata, JSON-LD, sitemap, robots, and serialization.
- `src/domain/projects.ts` - Project story detail type/data plus current-focus, anchor, and display-label helpers.
- `src/domain/routes.ts` - Visitor-facing Phase 3 route titles, descriptions, headings, and static check text.
- `src/domain/seo.ts` - Complete pure metadata, asset link, JSON-LD, sitemap, robots, and script-safe serialization helpers.
- `src/domain/foundation.test.ts` - Updated baseline project-route metadata expectation to the new Phase 3 title.

## Decisions Made

- Kept all new contracts in `src/domain/*` as pure functions and typed data so route components can consume them without framework or I/O coupling.
- Used `profileSameAsLinks` for `Person.sameAs`, preserving the OpenLinks low-intrusion identity pattern.
- Kept one shared social preview metadata object for Phase 3; public asset creation and static route-head wiring remain ready for later Phase 3 plans.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Updated baseline metadata test after planned route-copy change**
- **Found during:** Task 2 (Extend pure SEO, structured data, sitemap, and robots helpers)
- **Issue:** `src/domain/foundation.test.ts` still asserted the old `/projects` title after the plan required `Curated Projects | Peter Ryszkiewicz`.
- **Fix:** Updated the assertion to the new route metadata contract.
- **Files modified:** `src/domain/foundation.test.ts`
- **Verification:** `bun run test -- src/domain/portfolio-surfaces.test.ts src/domain/foundation.test.ts && bun run typecheck`
- **Committed in:** `aafacce`

**2. [Rule 3 - Blocking] Organized imports after Biome check blocked completion**
- **Found during:** Task 2 pre-commit verification
- **Issue:** `bun run check` reported import ordering in `src/domain/portfolio-surfaces.test.ts`.
- **Fix:** Applied Biome's safe import organization.
- **Files modified:** `src/domain/portfolio-surfaces.test.ts`
- **Verification:** `bun run format:check && bun run check && bun run typecheck && bun run build && bun run test`
- **Committed in:** `aafacce`

***

**Total deviations:** 2 auto-fixed (1 bug, 1 blocking issue)
**Impact on plan:** Both fixes were directly caused by planned route/test changes. No architecture or scope change.

## Issues Encountered

None beyond the auto-fixed issues above.

## Verification

- `bun run test -- src/domain/portfolio-surfaces.test.ts && bun run typecheck`
- `bun run test -- src/domain/portfolio-surfaces.test.ts src/domain/foundation.test.ts && bun run typecheck`
- `bun run test -- src/domain/portfolio-surfaces.test.ts src/domain/foundation.test.ts && bun run typecheck && bun run verify:no-github-runtime`
- `bun run verify`
- Acceptance greps from both tasks, including no forbidden GitHub runtime/API/token matches.

## Known Stubs

None. Stub-pattern scan found no placeholder, TODO/FIXME, empty hardcoded UI data, or unwired mock data in files touched by this plan.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Phase 03 plan 02 can consume project story details, current-focus selectors, anchor helpers, route copy, metadata helpers, and JSON-LD helpers from `src/domain/*` without adding Solid, DOM, filesystem, network, or GitHub runtime dependencies.

## Self-Check: PASSED

- Verified summary and all created/modified files exist on disk.
- Verified task commits exist: `537d500`, `aebfd06`, `eea7829`, `aafacce`.

***
*Phase: 03-portfolio-surfaces-seo*
*Completed: 2026-05-26*
