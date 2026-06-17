---
phase: 20-theme-routes-and-dark-ui
plan: 04
subsystem: browser-verification
tags: [playwright, themes, accessibility, keyboard, reduced-motion]

requires:
  - phase: 20-theme-routes-and-dark-ui
    provides: Public theme route UI from 20-02 and static output coverage from 20-03
provides:
  - Helper-derived theme route keyboard browser coverage
  - Theme index and representative theme detail reduced-motion browser coverage
  - Existing prerender-route axe and desktop/mobile dark layout coverage for theme routes
affects: [20-theme-routes-and-dark-ui, 23-theme-verification-and-release-contract]

tech-stack:
  added: []
  patterns:
    - "Browser representatives for theme coverage derive from publicThemeEntries() and themeDetailRoutes()."
    - "Phase 20 browser evidence stays in existing Playwright checks without release-readiness labels."

key-files:
  created: []
  modified:
    - tests/browser-release.playwright.ts

key-decisions:
  - "Use public theme helpers to select one representative theme detail route, related project route, and related writing route for browser focus checks."
  - "Preserve the existing prerenderRoutes axe/layout loops and avoid Phase 23 release-readiness wording or evidence-label changes."

patterns-established:
  - "Keyboard browser coverage follows the existing home -> index -> detail route pattern for new route families."
  - "Reduced-motion coverage adds changed route surfaces to the existing representative route list."

requirements-completed: [SYNTH-04]
generated_by: gsd-execute-plan
lifecycle_mode: yolo
phase_lifecycle_id: 20-2026-06-17T16-16-59
generated_at: 2026-06-17T18:03:42Z

duration: 3 min
completed: 2026-06-17
---

# Phase 20 Plan 04: Theme Browser Route Coverage Summary

**Helper-derived Playwright coverage for theme keyboard focus and reduced-motion route checks**

## Performance

- **Duration:** 3 min
- **Started:** 2026-06-17T18:00:51Z
- **Completed:** 2026-06-17T18:03:42Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments

- Added theme helper imports to `tests/browser-release.playwright.ts` for public theme entries, detail routes, related selected projects, and related public writing.
- Extended keyboard focus coverage to assert focus reaches the Themes nav item, a public theme detail route from `/themes`, the Back to themes link, a related project detail route, and a related writing route.
- Extended reduced-motion browser coverage to include `/themes` and one representative public theme detail route.
- Left the existing `prerenderRoutes` axe and desktop/mobile dark layout loops unchanged, so `/themes` and public theme details remain covered through the route registry.

## Task Commits

Each task was committed atomically:

1. **Task 1: Extend browser keyboard and reduced-motion checks to theme routes** - `0099eec` (test)

## Files Created/Modified

- `tests/browser-release.playwright.ts` - Adds helper-derived theme representative route selection and Playwright assertions for keyboard focus plus reduced-motion behavior.

## Decisions Made

- Chose helper-derived representative theme routes instead of copied slugs, matching the Phase 19 domain contract and the existing project/writing browser helper pattern.
- Kept Phase 23 release-readiness documents, evidence labels, metadata helpers, JSON-LD helpers, sitemap assertions, OpenLinks placement, schema files, and package scripts untouched.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- One acceptance guard command was rerun because `status` is a read-only zsh variable. The rerun used a neutral variable name and the implementation was unchanged.
- `.planning/config.json` remained modified from the shared orchestration context and was intentionally left unstaged.

## Verification

- `bun run format` - passed; no fixes applied.
- Acceptance `rg` checks passed for theme helper imports/usages, keyboard coverage, representative helper functions, reduced-motion route additions, and the negative Phase 23 scope guard.
- `bun run check` - passed.
- `bun run typecheck` - passed.
- `bun run test` - passed, 18 test files and 176 tests.
- `bun run build` - passed and prerendered 16 routes, including `/themes`, `/themes/agentic-engineering`, and `/themes/open-identity`.
- `bun run verify:browser` - passed with 83 passed and 19 skipped; output included axe and desktop/mobile dark layout coverage for `/themes` and both public theme detail routes.

## Known Stubs

None - stub scan found only local test accumulator arrays, not UI stubs or mock data.

## Threat Flags

None - changes stayed within planned browser verification code and introduced no new network endpoint, auth path, file access pattern, schema change, metadata surface, or release evidence claim.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Phase 20 browser route coverage is complete. Later release-contract work can consume the passing browser checks without this plan adding Phase 23 release-readiness labels or hosted/live claims.

## Self-Check: PASSED

- Found `tests/browser-release.playwright.ts`.
- Found `.planning/phases/20-theme-routes-and-dark-ui/20-04-SUMMARY.md`.
- Found task commit `0099eec`.

---
*Phase: 20-theme-routes-and-dark-ui*
*Completed: 2026-06-17*
