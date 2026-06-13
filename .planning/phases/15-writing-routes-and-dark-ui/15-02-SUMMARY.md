---
phase: 15-writing-routes-and-dark-ui
plan: 02
subsystem: writing-ui
tags: [solidstart, writing, routes, dark-ui, responsive-css]

requires:
  - phase: 15-writing-routes-and-dark-ui
    provides: /writing route registry data, public writing detail prerender paths, and writing helper contracts from 15-01
provides:
  - "/writing index route rendering public writing entries in helper order"
  - "/writing/{slug} detail route rendering typed body sections and related selected projects"
  - "Non-leaking unknown writing slug fallback"
  - "Focused dark-primary writing layout and readability CSS"
affects:
  - 16-writing-metadata-and-structured-data
  - 17-writing-verification-and-release-contract

tech-stack:
  added: []
  patterns:
    - "Thin SolidStart writing routes over typed writing domain helpers"
    - "Direct WritingBodyBlock JSX rendering without parser or runtime content dependency"
    - "Writing-specific CSS constrained to the existing @layer components dark-primary system"

key-files:
  created:
    - .planning/phases/15-writing-routes-and-dark-ui/15-02-SUMMARY.md
    - src/routes/writing/index.tsx
    - src/routes/writing/[slug].tsx
  modified:
    - src/styles/app.css
    - src/domain/foundation.test.ts
    - src/domain/portfolio-surfaces.test.ts

key-decisions:
  - "Writing detail pages render typed sections directly and defer writing-specific metadata, JSON-LD, and sitemap assertions to later plans."
  - "Related writing-to-project links use relatedProjectDetailPageProjects(entry) and projectDetailPath(project) rather than duplicating relationship state."
  - "Writing date labels format checked-in ISO dates in UTC so local timezone offsets cannot shift published dates."
  - "OpenLinks identity placement stays in existing footer/profile surfaces; the Writing nav item is normal portfolio navigation, not identity promotion."

patterns-established:
  - "Route components keep fallback copy non-leaking by resolving slugs only through maybePublicWritingEntryBySlug(params.slug ?? \"\")."
  - "External writing link blocks get target and rel only when href starts with https://; internal and anchor links stay same-tab."
  - "Writing page grids use repeat(auto-fit, minmax(min(100%, ...), 1fr)) plus min-width and overflow-wrap guards."

requirements-completed:
  - ROUTE-01
  - ROUTE-02
  - READ-01
  - READ-02
  - READ-03
generated_by: gsd-execute-plan
lifecycle_mode: yolo
phase_lifecycle_id: 15-2026-06-13T16-56-50
generated_at: 2026-06-13T17:58:51Z

duration: 10 min
completed: 2026-06-13
---

# Phase 15 Plan 02: Writing Route UI Summary

**Static writing index and detail routes with direct typed body rendering and dark-primary readability CSS**

## Performance

- **Duration:** 10 min
- **Started:** 2026-06-13T17:48:49Z
- **Completed:** 2026-06-13T17:58:51Z
- **Tasks:** 3
- **Files modified:** 6

## Accomplishments

- Added `/writing` with route metadata, public writing cards in `publicWritingEntries()` order, topic/tag chips, related project counts, and empty-state copy.
- Added `/writing/{slug}` with `maybePublicWritingEntryBySlug(params.slug ?? "")`, non-leaking fallback copy, typed body block rendering, safe external link handling, and related project detail links.
- Added focused writing CSS for responsive grids, readable 16px/1.5 body copy, wrapped chips/links/body text, and max-width article layout.
- Verified desktop and mobile dark rendering through the in-app browser on `/writing` and `/writing/agentic-engineering-workflows`.

## Task Commits

Each task was committed atomically:

1. **Task 1: Create the /writing index route** - `d02bdc1` (feat)
2. **Task 2: Create the /writing/{slug} detail route** - `bf21007` (feat)
3. **Task 3: Add focused writing readability CSS** - `5e7e268` (style)

## Files Created/Modified

- `src/routes/writing/index.tsx` - Public writing index route with route metadata, card list, related counts, and empty state.
- `src/routes/writing/[slug].tsx` - Public writing detail route with non-leaking fallback, typed body renderer, and related project links.
- `src/styles/app.css` - Writing list, card, article, body, section, callout, and related-project grid CSS.
- `src/domain/foundation.test.ts` - Updates prerender route expectation to include writing detail routes.
- `src/domain/portfolio-surfaces.test.ts` - Updates sitemap route expectation to include writing detail routes.

## Decisions Made

- Followed the existing project route metadata pattern only for `/writing`; writing detail metadata remains deferred to Phase 16.
- Rendered writing body blocks from typed registry data as JSX text nodes, avoiding `innerHTML`, Markdown, MDX, parsers, and runtime fetches.
- Kept related project links conditional on `relatedProjectDetailPageProjects(entry).length > 0`.
- Used existing shared dark-first shell, surface, chip, link, focus, and reduced-motion behavior rather than adding a separate writing design system.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Updated stale route expectation tests**
- **Found during:** Task 1 (Create the /writing index route)
- **Issue:** Broader pre-commit verification with `bun run test` failed because existing route/sitemap tests still expected only top-level and project detail prerender routes even though 15-01 had already added `/writing` and writing detail routes to `prerenderRoutes`.
- **Fix:** Updated `src/domain/foundation.test.ts` and `src/domain/portfolio-surfaces.test.ts` to derive expected writing detail paths from `writingDetailRoutes()`.
- **Files modified:** `src/domain/foundation.test.ts`, `src/domain/portfolio-surfaces.test.ts`
- **Verification:** `bun run test` passed with 123 tests.
- **Committed in:** `d02bdc1`

**2. [Rule 1 - Bug] Kept published date labels in UTC**
- **Found during:** Task 2 (Create the /writing/{slug} detail route)
- **Issue:** Formatting checked-in `YYYY-MM-DD` writing dates through local time could shift the visible published date by one day in non-UTC timezones.
- **Fix:** Added `timeZone: "UTC"` to writing date formatters in index and detail routes.
- **Files modified:** `src/routes/writing/index.tsx`, `src/routes/writing/[slug].tsx`
- **Verification:** Browser verification showed `Published June 3, 2026` on desktop and mobile.
- **Committed in:** `bf21007`

---

**Total deviations:** 2 auto-fixed (1 blocking verification fix, 1 display bug fix)
**Impact on plan:** Both fixes were narrow correctness/verification adjustments. No architectural change or feature scope expansion.

## Issues Encountered

None beyond the auto-fixed deviations above.

## Known Stubs

None - stub scan found no UI-facing placeholders, TODO/FIXME markers, or hardcoded empty values in modified writing route/style files.

## Authentication Gates

None.

## Verification

- `bun run format:check` - passed
- `bun run check` - passed
- `bun run test` - passed, 123 tests
- `bun run typecheck` - passed
- `bun run build` - passed, prerendered 13 routes including `/writing`, `/writing/agentic-engineering-workflows`, and `/writing/portable-identity-and-owned-surfaces`
- Task acceptance `rg` guards - passed for required copy/helper usage and prohibited runtime fetch/parser/light-first utility patterns
- Browser visual verification - passed for desktop `/writing`, desktop detail, mobile `/writing`, and mobile detail: dark root active, no page-level horizontal overflow, readable text/chips/links, and no visible text/control overlap

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Ready for the next Phase 15 plan. Writing route UI now consumes the 15-01 domain contracts, and Phase 16 can add writing-specific metadata/structured data without changing the route body rendering model.

## Self-Check: PASSED

- Found summary file `.planning/phases/15-writing-routes-and-dark-ui/15-02-SUMMARY.md`.
- Found created route files `src/routes/writing/index.tsx` and `src/routes/writing/[slug].tsx`.
- Found task commits `d02bdc1`, `bf21007`, and `5e7e268`.
- Confirmed shared tracking files were not modified by this executor; only orchestrator-owned `.planning/config.json` remains dirty.

---
*Phase: 15-writing-routes-and-dark-ui*
*Completed: 2026-06-13*
