---
phase: 21-collaboration-pathways-and-cross-links
plan: 01
subsystem: domain
tags: [themes, collaboration, reciprocal-links, typescript, solidstart]

requires:
  - phase: 19-theme-domain-foundation
    provides: typed theme registry, public theme helpers, and selected project/public writing relationship resolvers
  - phase: 20-theme-routes-and-dark-ui
    provides: public theme route surfaces that will consume collaboration and reciprocal link helpers
provides:
  - reciprocal public theme helpers for selected project detail pages
  - reciprocal public theme helpers for public writing detail pages
  - typed theme collaboration action assembly from project stories, reviewed source/live links, writing links, and contact fallback
  - focused helper tests for public-only filtering, action ordering, OpenLinks posture, rel safety, and contact fallback
affects: [theme-routes, project-detail-routes, writing-detail-routes, collaboration-ui, release-verification]

tech-stack:
  added: []
  patterns:
    - pure domain helper projection over checked-in theme, project, writing, and GitHub metadata registries
    - destination-specific collaboration action objects with explicit external rel data

key-files:
  created:
    - .planning/phases/21-collaboration-pathways-and-cross-links/21-01-SUMMARY.md
  modified:
    - src/domain/themes.ts
    - src/domain/themes.test.ts

key-decisions:
  - "Reciprocal theme lookup is derived through publicThemeEntries() so draft, hidden, unsupported, and archived themes cannot leak into public cross-links."
  - "Theme collaboration actions are assembled as pure domain data from selected project stories, reviewed project links, checked-in GitHub homepage metadata, public writing, and an internal /contact fallback."
  - "OpenLinks is not added as a generic theme CTA; it appears only when sourced through the related OpenLinks project live surface."

patterns-established:
  - "Theme relationship helpers answer route questions without route-local filtering."
  - "Theme collaboration actions carry kind, label, href, external, maybeRel, maybeProjectSlug, and maybeWritingSlug for thin route rendering."

requirements-completed: [SYNTH-02, SYNTH-03, COLLAB-01, COLLAB-02, COLLAB-03]
generated_by: gsd-execute-plan
lifecycle_mode: yolo
phase_lifecycle_id: 21-2026-06-17T22-54-40
generated_at: 2026-06-17T23:39:00Z

duration: 7 min
completed: 2026-06-17
---

# Phase 21 Plan 01: Collaboration Pathways Domain Contract Summary

**Pure theme relationship and collaboration action helpers for downstream route surfaces**

## Performance

- **Duration:** 7 min
- **Started:** 2026-06-17T23:31:44Z
- **Completed:** 2026-06-17T23:39:00Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Added `publicThemeEntriesForProject()` and `publicThemeEntriesForWritingEntry()` so project and writing routes can ask for related public themes without filtering in route components.
- Added `ThemeCollaborationAction` and `collaborationActionsForTheme()` to assemble project story, source, live surface, writing, and contact fallback actions from existing checked-in helper/data surfaces.
- Expanded `src/domain/themes.test.ts` to cover public-only reciprocal lookup, display order, empty reciprocal results, action ordering, exact labels, external rel data, OpenLinks posture, contact fallback, and href deduplication.

## Task Commits

TDD tasks produced RED and GREEN commits:

1. **Task 1 RED: Reciprocal helper tests** - `0b38247` (test)
2. **Task 1 GREEN: Reciprocal public theme helpers** - `999e0fe` (feat)
3. **Task 2 RED: Collaboration action tests** - `e3747e7` (test)
4. **Task 2 GREEN: Collaboration action assembly** - `e0b945f` (feat)

**Plan metadata:** committed separately after summary self-check.

## Files Created/Modified

- `src/domain/themes.ts` - Exports reciprocal public theme helpers, collaboration action types, and pure collaboration action assembly.
- `src/domain/themes.test.ts` - Adds focused helper and action tests using Arrange/Act/Assert structure.
- `.planning/phases/21-collaboration-pathways-and-cross-links/21-01-SUMMARY.md` - Records execution outcome and verification evidence.

## Decisions Made

- Kept collaboration assembly in `src/domain/themes.ts` because it stays tightly coupled to theme relationship helpers and remains pure data-in/data-out logic.
- Used `/contact` as the only fallback when no project story, source/live, or writing actions resolve.
- Treated OpenLinks as a project-sourced live surface only for the `open-identity` relationship, not as a global profile CTA.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- Biome required import ordering in `src/domain/themes.ts` after adding the GitHub metadata helper import. The import order was fixed and `bun run check` passed before commit.

## Known Stubs

None - no placeholder data, TODOs, UI-fed empty stubs, or mock-only runtime data were introduced. The stub scan matched only local test/helper defaults and a local accumulator array, not user-facing stub output.

## Verification

- Task 1 RED: `bun run test src/domain/themes.test.ts` failed as expected on missing reciprocal helper exports/functions.
- Task 1 GREEN: `bun run test src/domain/themes.test.ts`, `bun run typecheck`, `bun run check`, and `bun run build` passed.
- Task 1 acceptance `rg` checks passed for reciprocal helper exports, supported export assertions, and focused reciprocal tests.
- Task 2 RED: `bun run test src/domain/themes.test.ts` failed as expected on missing collaboration action export/function.
- Task 2 GREEN: `bun run test src/domain/themes.test.ts`, `bun run typecheck`, `bun run check`, and `bun run build` passed.
- Task 2 acceptance `rg` checks passed for exported action types/helper, GitHub homepage helper usage, exact labels, focused action tests, and the negative runtime fetch/token/reachability guard.
- Plan-level verification: `bun run test src/domain/themes.test.ts && bun run typecheck` passed.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Plan 21-02 can render collaboration panels on theme detail routes and related theme panels on project/writing detail routes by consuming these pure helpers without adding route-local relationship logic, runtime fetches, new URL registries, or prominent OpenLinks promotion.

## Self-Check: PASSED

- Found `.planning/phases/21-collaboration-pathways-and-cross-links/21-01-SUMMARY.md`.
- Found `src/domain/themes.ts`.
- Found `src/domain/themes.test.ts`.
- Found task commits `0b38247`, `999e0fe`, `e3747e7`, and `e0b945f` in git history.

---
*Phase: 21-collaboration-pathways-and-cross-links*
*Completed: 2026-06-17*
