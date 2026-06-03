---
phase: 14-writing-domain-foundation
plan: 01
subsystem: domain
tags: [writing-domain, typescript, vitest, static-content]

requires:
  - phase: 10-project-detail-route-foundation
    provides: "Selected project detail helpers and maybeProjectDetailPageProjectBySlug()"
provides:
  - "Typed checked-in writing registry with two authored public entries"
  - "Pure public writing selectors, nullable lookup, detail path, and route-list helpers"
  - "Selected project detail relationship resolver for related writing records"
affects: [15-writing-routes-and-dark-ui, 16-writing-metadata-and-structured-data, 17-writing-verification-and-release-contract]

tech-stack:
  added: []
  patterns:
    - "Pure domain registry modeled after src/domain/projects.ts"
    - "TDD RED/GREEN commits for writing domain behavior"

key-files:
  created:
    - src/domain/writing.ts
    - src/domain/writing.test.ts
  modified: []

key-decisions:
  - "Writing content stays in a checked-in TypeScript registry with no runtime loader, CMS, MDX, feed, parser, or fetch dependency."
  - "Only status: published entries are exposed through public writing selectors and route helpers."
  - "Related writing project slugs resolve through selected project detail eligibility, not the broader public project index."

patterns-established:
  - "Writing helpers route public lookup and routes through publicWritingEntries() to avoid draft, hidden, or archived leakage."
  - "Writing entries own relatedProjectSlugs; project records remain unchanged."

requirements-completed: [WRITE-01, WRITE-02, WRITE-03, WRITE-04, LINK-01]
generated_by: gsd-execute-plan
lifecycle_mode: yolo
phase_lifecycle_id: 14-2026-06-03T13-56-52
generated_at: 2026-06-03T14:23:46Z

duration: 4 min
completed: 2026-06-03
---

# Phase 14 Plan 01: Writing Domain Foundation Summary

**Typed writing registry with published-only selectors, `/writing/{slug}` path helpers, and selected-project relationship resolution**

## Performance

- **Duration:** 4 min
- **Started:** 2026-06-03T14:19:08Z
- **Completed:** 2026-06-03T14:23:46Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Added `src/domain/writing.ts` with exported writing status, kind, block, section, entry, and public-entry types.
- Authored exactly two checked-in public writing entries: `agentic-engineering-workflows` and `portable-identity-and-owned-surfaces`.
- Added public helpers for deterministic published-entry selection, nullable slug lookup, writing detail path derivation, route list derivation, and selected project detail relationships.
- Added focused Vitest coverage for registry shape, export surface, public filtering, path derivation, nullable lookup, non-public exclusion, and related project resolution.

## Task Commits

Each task was committed atomically. TDD tasks produced RED and GREEN commits:

1. **Task 1: Create writing registry types and authored seed entries**
   - `f606411` test(14-01): add failing tests for writing registry
   - `f4a7ab2` feat(14-01): create writing registry
2. **Task 2: Add public writing selectors, paths, nullable lookup, and selected-project resolver**
   - `719238f` test(14-01): add failing tests for writing helpers
   - `62f5e1e` feat(14-01): add public writing helpers

## Files Created/Modified

- `src/domain/writing.ts` - Writing entry types, authored registry, public selectors, path helpers, and selected-project relationship resolver.
- `src/domain/writing.test.ts` - Vitest coverage for registry shape, public helper behavior, nullable lookup, route derivation, export surface, and relationship filtering.

## Decisions Made

- Followed the plan's static TypeScript registry approach instead of adding a content pipeline or runtime dependency.
- Kept writing route exposure as a domain-only helper; no global route registry, Solid route file, sitemap, metadata, JSON-LD, browser, release, RSS, search, CMS, MDX, or package changes were made.
- Used `maybePublicWritingEntryBySlug()` for the nullable public lookup surface, matching Bright Builds maybe-naming guidance and existing project helper style.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed impossible tuple-length comparisons in the registry test**

- **Found during:** Task 1 (Create writing registry types and authored seed entries)
- **Issue:** `bun run typecheck` flagged direct `entry.topics.length === 0` and `entry.sections.length === 0` comparisons because the checked-in registry's tuple literals are statically non-empty.
- **Fix:** Changed the test to compute explicit completeness booleans and assert the expected complete shape.
- **Files modified:** `src/domain/writing.test.ts`
- **Verification:** `bun run typecheck`, `bun run test src/domain/writing.test.ts`, and `bun run test` passed.
- **Committed in:** `f4a7ab2`

---

**Total deviations:** 1 auto-fixed (Rule 1 bug)
**Impact on plan:** No scope change. The fix kept the planned behavior test while making the suite typecheck cleanly.

## Issues Encountered

- The TDD RED commits intentionally failed before implementation:
  - Task 1 failed because `src/domain/writing.ts` did not exist yet.
  - Task 2 failed because the public helper exports did not exist yet.
- A pre-existing `.planning/config.json` change (`workflow._auto_chain_active: true`) was present at execution start and remains unstaged and uncommitted. This plan did not update `STATE.md` or `ROADMAP.md` because the orchestrator owns those writes after phase verification.

## Verification

Passed:

- `bun run test src/domain/writing.test.ts`
- `bun run typecheck`
- `bun run format`
- `bun run lint`
- `bun run build`
- `bun run test`

## Known Stubs

None.

## Threat Flags

None. The plan added only pure checked-in domain data and helper functions. It did not introduce network endpoints, authentication paths, file access patterns, schema changes, raw HTML, runtime fetches, or content parser execution.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Phase 15 can consume `publicWritingEntries()`, `maybePublicWritingEntryBySlug()`, `writingDetailPath()`, `writingDetailRoutes()`, and `relatedProjectDetailPageProjects()` to build `/writing` routes and dark-primary UI. Draft, hidden, and archived writing entries remain excluded from public helper output.

## Self-Check: PASSED

- Found `src/domain/writing.ts`.
- Found `src/domain/writing.test.ts`.
- Found `.planning/phases/14-writing-domain-foundation/14-01-SUMMARY.md`.
- Found task commits `f606411`, `f4a7ab2`, `719238f`, and `62f5e1e`.

*Phase: 14-writing-domain-foundation*
*Completed: 2026-06-03*
