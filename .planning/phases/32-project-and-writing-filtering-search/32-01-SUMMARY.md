---
phase: 32-project-and-writing-filtering-search
plan: 01
subsystem: content-discovery
tags: [typescript, domain-model, search, facets, vitest]
requires:
  - phase: 30-content-discovery-foundation
    provides: Safe PublicContentReference envelopes and public content selectors
  - phase: 31-static-topic-routes
    provides: Canonical topic identity and safe topic route contracts
provides:
  - Safe project tier and writing updated-date fields on PublicContentReference
  - Pure deterministic project/writing content search helpers
  - Project and writing facet derivation over public references
  - Query normalization, explicit scoring weights, selected-facet matching, and stable ordering
affects:
  - 32-project-filtering-ui
  - 32-writing-filtering-ui
  - 33-feeds
  - 34-related-work
tech-stack:
  added: []
  patterns:
    - Pure data-in/data-out search model over PublicContentReference
    - Public facet IDs derived from canonical topics and safe checked-in labels
    - TDD RED/GREEN commits for deterministic search behavior
key-files:
  created:
    - src/domain/content-search.ts
    - src/domain/content-search.test.ts
  modified:
    - src/domain/topics.ts
    - src/domain/topics.test.ts
    - src/domain/topic-validation.test.ts
key-decisions:
  - "Search/filter behavior lives in src/domain/content-search.ts instead of route components or a search dependency."
  - "Facet state is modeled as public facet IDs with OR matching inside a group and AND matching across groups."
  - "Query scoring uses explicit weights and public-only fields from PublicContentReference."
patterns-established:
  - "Content search defaults to publicContentReferences() so route callers do not need raw curated registries."
  - "Writing year facets are emitted only from checked-in published or updated dates."
  - "Selected facet IDs are validated against derived public facets before matching."
requirements-completed: [FIND-01, FIND-02, FIND-05]
generated_by: gsd-execute-plan
lifecycle_mode: yolo
phase_lifecycle_id: 32-2026-07-03T01-12-38
generated_at: 2026-07-03T02:23:48Z
duration: 11 min
completed: 2026-07-03
---

# Phase 32 Plan 01: Project and Writing Search Domain Summary

**Public-only content search and facet model with deterministic normalization, scoring, and selected-facet matching.**

## Performance

- **Duration:** 11 min
- **Started:** 2026-07-03T02:13:45Z
- **Completed:** 2026-07-03T02:23:48Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- Extended `PublicContentReference` so public project references expose `projectTier` and public writing references expose checked-in `maybeUpdatedOn`.
- Added `src/domain/content-search.ts` with query normalization, public facet derivation, selected-facet matching, explicit scoring weights, result counts, and stable sorting.
- Added focused Vitest coverage for normalization, project facets, writing facets, visitor-facing source labels, OR/AND facet matching, score ordering, inactive defaults, and public-reference defaults.
- Kept the helper free of search dependencies, hosted search APIs, URL/query state, browser storage, and visitor-runtime content fetches.

## Task Commits

Each task was committed atomically, with TDD RED/GREEN commits where applicable:

1. **Task 1: Extend public reference facets safely**
   - `17299cd` test: add failing public reference facet coverage
   - `38eb2fd` feat: extend public reference facets
2. **Task 2: Add deterministic content search and facet helpers**
   - `1b0b637` test: add failing content search coverage
   - `d56e722` feat: add deterministic content search model

Additional auto-fix:

- `e43d253` fix: update public reference validation fixture

## Files Created/Modified

- `src/domain/content-search.ts` - Pure content search, facet grouping, query normalization, scoring, result-count, and sorting helpers.
- `src/domain/content-search.test.ts` - Regression coverage for the content search/facet contract.
- `src/domain/topics.ts` - Adds `projectTier` and `maybeUpdatedOn` to safe public reference envelopes.
- `src/domain/topics.test.ts` - Covers the newly exposed safe public fields.
- `src/domain/topic-validation.test.ts` - Updates a project reference fixture to include the required public tier field.

## Decisions Made

- Used `publicContentReferences()` as the default source for search and facet helpers so callers do not import raw curated registries.
- Kept topic facet IDs based on canonical topic slugs instead of slugifying raw labels.
- Used visitor-facing labels for project tier, status, source type, writing kind, writing tags, and writing years.
- Ignored unknown selected facet IDs by validating selections against the derived public facet set before matching.

## Verification

- `bun run test src/domain/topics.test.ts`
- `bun run test src/domain/content-search.test.ts src/domain/topics.test.ts`
- `bun run test src/domain/content-search.test.ts src/domain/topics.test.ts src/domain/topic-validation.test.ts`
- `bun run check`
- `bun run typecheck`
- `bun run test`
- `bun run build`
- Acceptance greps for required exports, weights, visitor-facing labels, safe reference fields, and forbidden search/state APIs all passed.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Updated project reference validation fixture**
- **Found during:** Task 2 (Add deterministic content search and facet helpers)
- **Issue:** After `projectTier` became a required project reference field, `src/domain/topic-validation.test.ts` still built a project reference fixture without it, causing `bun run typecheck` to fail.
- **Fix:** Added `projectTier: "flagship"` to the fixture so existing topic validation tests match the safe public reference envelope.
- **Files modified:** `src/domain/topic-validation.test.ts`
- **Verification:** `bun run test src/domain/content-search.test.ts src/domain/topics.test.ts src/domain/topic-validation.test.ts`, `bun run typecheck`
- **Committed in:** `e43d253`

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** The fix keeps existing validation tests compatible with the new public reference contract. No scope expansion.

## Issues Encountered

- `bun run typecheck` initially failed on the topic validation fixture described above; the fixture fix resolved it.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Plan 32-02 can wire project index controls to `contentFacetGroupsForKind("project")` and `searchContentReferences({ kind: "project" })` without duplicating public eligibility, topic resolution, scoring, or selected-facet logic.

Plan 32-03 can reuse the same helper for writing filters, including writing kind, canonical topics, raw public tags, and checked-in published/updated year facets.

## Self-Check: PASSED

- Found all created and modified plan files.
- Found all task and auto-fix commits: `17299cd`, `38eb2fd`, `1b0b637`, `e43d253`, `d56e722`.

***
*Phase: 32-project-and-writing-filtering-search*
*Completed: 2026-07-03*
