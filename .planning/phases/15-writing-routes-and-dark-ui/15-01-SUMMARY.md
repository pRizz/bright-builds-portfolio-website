---
phase: 15-writing-routes-and-dark-ui
plan: 01
subsystem: domain-routing
tags: [solidstart, routes, writing, vitest, validation]

requires:
  - phase: 14-writing-domain-foundation
    provides: validated writing registry, public writing selectors, detail path helpers, and selected-project relationship contracts
provides:
  - "/writing top-level route registry data and primary navigation placement"
  - "Public writing detail prerender route inclusion from writingDetailRoutes()"
  - "publicWritingEntriesForProject(project) derived from public writing relationships"
  - "unsafe_link_href validation for authored writing link blocks"
affects:
  - 15-writing-routes-and-dark-ui
  - 16-writing-metadata-and-structured-data
  - 17-writing-verification-and-release-contract

tech-stack:
  added: []
  patterns:
    - "Pure domain helpers for writing route and project relationship contracts"
    - "TDD coverage for writing route registry and curation validation behavior"

key-files:
  created:
    - .planning/phases/15-writing-routes-and-dark-ui/15-01-SUMMARY.md
  modified:
    - src/domain/writing.ts
    - src/domain/writing.test.ts
    - src/domain/writing-validation.ts
    - src/domain/writing-validation.test.ts
    - src/domain/routes.ts

key-decisions:
  - "Project-related writing derives from public writing registry data through relatedProjectSlugs, not reciprocal project fields."
  - "Writing link blocks allow only internal paths, same-page anchors, and HTTPS URLs before UI routes consume authored hrefs."
  - "/writing and writing detail prerender data stay centralized in the route registry and writingDetailRoutes()."

patterns-established:
  - "Route exposure tests assert routeByPath(), navigationRoutes, and prerenderRoutes from one writing-focused suite."
  - "Writing validation treats unsafe link protocols as curation errors while preserving existing required-content checks."

requirements-completed:
  - ROUTE-01
  - ROUTE-02
  - ROUTE-03
  - ROUTE-04
  - LINK-02
generated_by: gsd-execute-plan
lifecycle_mode: yolo
phase_lifecycle_id: 15-2026-06-13T16-56-50
generated_at: 2026-06-13T17:43:48Z

duration: 6 min
completed: 2026-06-13
---

# Phase 15 Plan 01: Route Domain Contracts Summary

**Writing route registry contracts with public project cross-links and unsafe authored-link validation**

## Performance

- **Duration:** 6 min
- **Started:** 2026-06-13T17:37:17Z
- **Completed:** 2026-06-13T17:43:48Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments

- Added `publicWritingEntriesForProject(project)` so project detail pages can derive related writing from public writing data only.
- Added `unsafe_link_href` curation validation for writing link body blocks, allowing only `#`, safe `/` paths, and `https://` URLs.
- Added `/writing` as a first-class route/nav entry after Projects and before Contact.
- Included `/writing` and every `writingDetailRoutes()` result in `prerenderRoutes`.
- Added focused Vitest coverage for project-to-writing lookup, unsafe/safe link hrefs, route lookup, nav order, and prerender route inclusion.

## Task Commits

Each task was committed atomically:

1. **Task 1: Add project-to-writing lookup and link href validation**
   - `e694d6e` test: add failing writing relationship and link validation tests
   - `18d7e8d` feat: add writing relationship helper and link validation
2. **Task 2: Add /writing to route, nav, and prerender data**
   - `5e5f112` test: add failing writing route registry tests
   - `ff66998` feat: add writing route registry data

_Note: TDD tasks produced separate RED and GREEN commits._

## Files Created/Modified

- `.planning/phases/15-writing-routes-and-dark-ui/15-01-SUMMARY.md` - Execution summary and self-check record.
- `src/domain/writing.ts` - Adds `publicWritingEntriesForProject(project)` and updates supported helper documentation.
- `src/domain/writing.test.ts` - Covers project-to-writing lookup plus `/writing` route/nav/prerender contracts.
- `src/domain/writing-validation.ts` - Adds `unsafe_link_href` validation for authored link blocks.
- `src/domain/writing-validation.test.ts` - Covers unsafe and safe writing link href cases.
- `src/domain/routes.ts` - Adds `/writing` route metadata, primary nav placement, and writing detail prerender routes.

## Decisions Made

- Project cross-links are one-way from writing data: project pages can ask the writing registry for related public entries, but project records do not gain reciprocal writing fields.
- Authored writing links are validated with a simple allow-list instead of adding a parser or dependency.
- Route static data now includes writing detail paths by composing `writingDetailRoutes()` instead of duplicating slugs.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## Known Stubs

None - stub scan found no UI-facing placeholders or mock data in modified runtime files. Matches in tests were local fixture/default accumulator patterns, not public rendering stubs.

## Authentication Gates

None.

## Verification

- `bun run format:check` - passed
- `bun run check` - passed
- `bun run test src/domain/writing.test.ts src/domain/writing-validation.test.ts` - passed, 28 tests
- `bun run typecheck` - passed
- `bun run build` - passed, prerendered 13 routes including `/writing` and both public writing detail routes

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Ready for 15-02. Downstream route UI can consume `/writing`, `writingDetailRoutes()`, and `publicWritingEntriesForProject(project)` without adding relationship fields or unsafe href handling in route components.

## Self-Check: PASSED

- Found summary file and all modified source/test files.
- Found task commits `e694d6e`, `18d7e8d`, `5e5f112`, and `ff66998`.
- Confirmed no shared tracking files are included in the plan summary.

---
*Phase: 15-writing-routes-and-dark-ui*
*Completed: 2026-06-13*
