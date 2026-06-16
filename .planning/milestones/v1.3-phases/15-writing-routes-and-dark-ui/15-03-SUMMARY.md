---
phase: 15-writing-routes-and-dark-ui
plan: 03
subsystem: writing-ui
tags: [solidstart, writing, project-detail, dark-ui]

requires:
  - phase: 15-writing-routes-and-dark-ui
    provides: public writing helper contracts from 15-01 and writing routes/styles from 15-02
provides:
  - "Selected project detail pages conditionally render related public writing"
  - "Project-to-writing links derive from publicWritingEntriesForProject(project)"
  - "Related writing cards include title, kind/date metadata, summary, and Read note/Read essay links"
affects:
  - 16-writing-metadata-and-structured-data
  - 17-writing-verification-and-release-contract

tech-stack:
  added: []
  patterns:
    - "Project detail UI derives related writing from the writing registry instead of reciprocal project fields"
    - "Project aside panels reuse existing dark-primary project-detail-panel, surface-card, chip, and link-list classes"

key-files:
  created:
    - .planning/phases/15-writing-routes-and-dark-ui/15-03-SUMMARY.md
  modified:
    - src/routes/projects/[slug].tsx

key-decisions:
  - "Related writing remains a one-way derivation from public writing entries; project records stay unchanged."
  - "The project detail panel reuses local writing date/action label helpers to match the writing route copy contract without adding CSS."

patterns-established:
  - "Project detail cross-links can use small route-local panel components over pure domain selector helpers."

requirements-completed:
  - READ-03
  - LINK-02
generated_by: gsd-execute-plan
lifecycle_mode: yolo
phase_lifecycle_id: 15-2026-06-13T16-56-50
generated_at: 2026-06-13T18:06:40Z

duration: 8 min
completed: 2026-06-13
---

# Phase 15 Plan 03: Project Detail Related Writing Summary

**Selected project detail pages now show public related writing from the writing registry without adding reciprocal project fields**

## Performance

- **Duration:** 8 min
- **Started:** 2026-06-13T17:59:00Z
- **Completed:** 2026-06-13T18:06:40Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments

- Added `RelatedWritingPanel` to selected project detail pages after Project actions.
- Derived related entries with `publicWritingEntriesForProject(selectedProject())`.
- Rendered related writing cards with title, `Note`/`Essay` and published/updated date metadata, summary, and `Read note`/`Read essay` links.
- Preserved project records without adding `relatedWriting` or `relatedWritingSlugs` fields.

## Task Commits

Each task was committed atomically:

1. **Task 1: Render related writing on selected project details** - `b94757b` (feat)

## Files Created/Modified

- `.planning/phases/15-writing-routes-and-dark-ui/15-03-SUMMARY.md` - Execution summary and self-check record.
- `src/routes/projects/[slug].tsx` - Adds the conditional related writing panel and route-local writing label/date helpers.

## Decisions Made

- Kept relationship ownership in `src/domain/writing.ts` and consumed `publicWritingEntriesForProject(project)` from the route component.
- Reused existing dark-primary panel/card/link/chip classes instead of adding CSS for this narrow aside panel.
- Kept Phase 16 metadata scope untouched despite a broader browser verifier issue on writing detail titles.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- `bun run check` initially reported Biome import ordering in `src/routes/projects/[slug].tsx`; the import block was sorted and `bun run check` then passed.
- A full `bun run verify:browser` attempt failed on existing `/writing/{slug}` pages because those writing detail routes do not yet render non-empty document titles. This was not caused by the project detail panel change and is deferred to the writing metadata scope. Targeted desktop/mobile axe and dark-layout checks for `/projects/openlinks`, `/projects/free-the-world`, and `/projects/opencode-cloud` passed.

## Known Stubs

None - stub scan found no UI-facing placeholders, TODO/FIXME markers, or hardcoded empty/mock related-writing data in the modified route file.

## Authentication Gates

None.

## Verification

- Acceptance `rg` checks - passed for required imports/usages, conditional panel, labels, aside insertion, and absence of reciprocal project fields.
- `bun run format:check` - passed.
- `bun run check` - passed after sorting imports.
- `bun run test` - passed, 123 tests.
- `bun run typecheck` - passed.
- `bun run build` - passed, prerendered 13 routes.
- `bunx playwright test --config playwright.config.ts --project=chromium-desktop --project=chromium-mobile --grep '(axe has no violations|dark layout has no overflow).*\\/projects\\/(openlinks|free-the-world|opencode-cloud)'` - passed, 12 targeted project-detail browser checks.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Ready for 15-04. Selected project detail pages can now send visitors onward to related public writing, and Phase 16 can address writing-specific detail metadata without changing the relationship source.

## Self-Check: PASSED

- Found modified route file `src/routes/projects/[slug].tsx`.
- Found summary file `.planning/phases/15-writing-routes-and-dark-ui/15-03-SUMMARY.md`.
- Found task commit `b94757b`.
- Confirmed `.planning/config.json`, `.planning/STATE.md`, `.planning/ROADMAP.md`, and `.planning/REQUIREMENTS.md` were not staged or committed by this executor.

---
*Phase: 15-writing-routes-and-dark-ui*
*Completed: 2026-06-13*
