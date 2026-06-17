---
phase: 21-collaboration-pathways-and-cross-links
plan: 02
subsystem: ui
tags: [themes, collaboration, cross-links, solidstart, accessibility]

requires:
  - phase: 21-collaboration-pathways-and-cross-links
    provides: helper-derived theme collaboration action assembly from Plan 21-01
  - phase: 20-theme-routes-and-dark-ui
    provides: public dark-primary theme detail route layout and fallback behavior
provides:
  - compact collaboration starting-point panel on public theme detail pages
  - rel-safe helper-derived anchors for project stories, reviewed source/live links, and public writing
  - SSR assertions for public theme collaboration rendering and unknown-theme fallback safety
  - browser-test-compatible JSON snapshot import for GitHub metadata helpers
affects: [theme-detail-routes, collaboration-ui, browser-release-checks, phase-21-verification]

tech-stack:
  added: []
  patterns:
    - route components render pure domain collaboration action data without route-local filtering
    - external collaboration anchors bind target and rel from action safety fields

key-files:
  created:
    - .planning/phases/21-collaboration-pathways-and-cross-links/21-02-SUMMARY.md
  modified:
    - src/routes/themes/[slug].tsx
    - tests/theme-detail-route.test.tsx
    - src/domain/github-metadata.ts

key-decisions:
  - "Theme detail collaboration UI consumes `collaborationActionsForTheme(theme)` directly and keeps project/source/live/writing decisions in the domain helper."
  - "OpenLinks remains absent as a generic theme CTA; the route test explicitly guards against `OpenLinks profile` on the agentic-engineering theme route."
  - "The GitHub metadata JSON snapshot import now uses an ESM import attribute so Playwright's Node loader can evaluate helper-derived browser checks."

patterns-established:
  - "Theme collaboration panels live in the existing detail aside before related project and writing panels."
  - "SSR route tests assert both positive public collaboration links and negative fallback leakage text."

requirements-completed: [SYNTH-02, COLLAB-01, COLLAB-02, COLLAB-03]
generated_by: gsd-execute-plan
lifecycle_mode: yolo
phase_lifecycle_id: 21-2026-06-17T22-54-40
generated_at: 2026-06-17T23:49:20Z

duration: 7 min
completed: 2026-06-17
---

# Phase 21 Plan 02: Theme Collaboration Panel Summary

**Helper-derived theme collaboration panel with SSR coverage and browser-check-compatible metadata loading**

## Performance

- **Duration:** 7 min
- **Started:** 2026-06-17T23:42:41Z
- **Completed:** 2026-06-17T23:49:11Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Added `ThemeCollaborationPanel` to public theme detail pages before related project and writing panels.
- Rendered `Where to start`, each theme's `collaborationAngle`, and helper-derived project story, source, live surface, and writing anchors.
- Added SSR tests for public collaboration rendering, reviewed link hrefs, OpenLinks posture, and unknown-theme fallback safety.
- Fixed the JSON snapshot import shape needed for Playwright/Node browser verification of helper-derived theme routes.

## Task Commits

Each task was committed atomically:

1. **Task 1: Render the theme collaboration starting-point panel** - `c84f253` (feat)
2. **Task 2: Prove theme collaboration rendering and fallback safety** - `4984e89` (test)

Additional verification blocker fix:

3. **Browser verification compatibility** - `bb36904` (fix)

**Plan metadata:** committed separately after summary self-check.

## Files Created/Modified

- `src/routes/themes/[slug].tsx` - Imports `collaborationActionsForTheme()` and renders the collaboration starting-point panel with rel-safe anchors.
- `tests/theme-detail-route.test.tsx` - Covers public route collaboration SSR output and unknown fallback non-leakage.
- `src/domain/github-metadata.ts` - Adds the JSON import attribute required by Playwright's Node ESM loader.
- `.planning/phases/21-collaboration-pathways-and-cross-links/21-02-SUMMARY.md` - Records execution outcome and verification evidence.

## Decisions Made

- Kept route rendering thin: destination choice, hrefs, external flags, and rel values continue to come from the Phase 21 domain helper.
- Preserved OpenLinks as a secondary identity surface by not adding an `OpenLinks profile` action to the generic theme collaboration panel.
- Applied the minimal JSON import compatibility fix needed to let existing browser release tests import helper modules under current Node.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added JSON import attribute for browser verification**
- **Found during:** Final verification after Task 2
- **Issue:** `bun run verify:browser` failed before running tests with `TypeError: Module ".../github-metadata.snapshot.json" needs an import attribute of "type: json"`.
- **Fix:** Added `with { type: "json" }` to the checked-in GitHub metadata snapshot import.
- **Files modified:** `src/domain/github-metadata.ts`
- **Verification:** `bun run test src/domain/github-metadata.test.ts tests/theme-detail-route.test.tsx`, `bun run typecheck`, `bun run check`, `bun run build`, and `bun run verify:browser` passed.
- **Committed in:** `bb36904`

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** The fix was required to complete repo-local UI/browser verification and did not change collaboration behavior or add new runtime data sources.

## Issues Encountered

- Task 2 was marked TDD, but the specified SSR assertions passed immediately because Task 1 had already implemented the route behavior. No GREEN source change was needed after the test commit.
- Biome requested one JSX formatting adjustment in Task 1 before commit; `bun run check` passed after applying the formatter shape.

## Known Stubs

None - no placeholder text, TODO/FIXME markers, UI-fed empty data, or mock-only runtime data were introduced. The stub scan only matched a local accumulator array in `src/domain/github-metadata.ts`.

## Verification

- Task 1 acceptance `rg` checks passed for `collaborationActionsForTheme`, `ThemeCollaborationPanel`, `Collaboration starting points`, `Where to start`, `No collaboration paths yet`, external `target`, external `rel`, and the negative route-scope guard.
- Task 1 verification: `bun run typecheck`, `bun run check`, `bun run test tests/theme-detail-route.test.tsx`, and `bun run build` passed.
- Task 2 acceptance `rg` checks passed for the test name, public/fallback collaboration text assertions, `https://github.com/pRizz/opencode-cloud`, `href="/projects/opencode-cloud"`, `href="/writing/agentic-engineering-workflows"`, and the OpenLinks negative assertion.
- Task 2 verification: `bun run test tests/theme-detail-route.test.tsx && bun run typecheck` passed.
- Deviation verification: `bun run test src/domain/github-metadata.test.ts tests/theme-detail-route.test.tsx`, `bun run typecheck`, `bun run check`, `bun run build`, and `bun run verify:browser` passed.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Plan 21-03 can add reciprocal related-theme panels to project and writing detail routes using the already committed `publicThemeEntriesForProject()` and `publicThemeEntriesForWritingEntry()` helpers. Theme metadata, structured data, sitemap behavior, and release-contract wording remain deferred to Phases 22 and 23.

## Self-Check: PASSED

- Found `.planning/phases/21-collaboration-pathways-and-cross-links/21-02-SUMMARY.md`.
- Found `src/routes/themes/[slug].tsx`.
- Found `tests/theme-detail-route.test.tsx`.
- Found `src/domain/github-metadata.ts`.
- Found task commits `c84f253`, `4984e89`, and `bb36904` in git history.

---
*Phase: 21-collaboration-pathways-and-cross-links*
*Completed: 2026-06-17*
