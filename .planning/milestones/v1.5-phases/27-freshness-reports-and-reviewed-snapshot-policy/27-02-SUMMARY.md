---
phase: 27-freshness-reports-and-reviewed-snapshot-policy
plan: 02
subsystem: release
tags: [release-readiness, freshness-report, manual-smoke, static-evidence, typescript]

requires:
  - phase: 27-freshness-reports-and-reviewed-snapshot-policy
    provides: Offline freshness report command and grouped advisory findings from Plan 27-01
provides:
  - Release-readiness documentation for when to run `bun run report:freshness`
  - Documented boundary between reviewed static evidence and live/manual smoke checks
  - Tests proving `bun run verify` excludes report, live, hosted, sync, and network command strings
affects: [release-readiness, cloudflare-release-process, future-live-smoke-checks]

tech-stack:
  added: []
  patterns:
    - Release docs facts are enforced through `requiredReleaseReadinessDocumentFacts`.
    - Aggregate verify script exclusions are asserted in release-readiness tests.
    - OpenLinks remains documented as an external-link policy/manual smoke origin, not a primary CTA.

key-files:
  created:
    - .planning/phases/27-freshness-reports-and-reviewed-snapshot-policy/27-02-SUMMARY.md
  modified:
    - docs/release-readiness.md
    - scripts/release-readiness.ts
    - scripts/release-readiness.test.ts

key-decisions:
  - "Placed freshness guidance after Static Output so maintainers see `bun run build` before the offline report command."
  - "Required exact language that the report does not prove live GitHub state, live external-link reachability, or hosted social crawler validation."
  - "Kept `verify` deterministic by asserting it excludes report/live/hosted/sync/network command strings."

patterns-established:
  - "Release-readiness doc facts can enforce advisory-command boundaries without making advisory commands hard gates."
  - "Future live smoke checks should be explicit maintainer actions, not hidden additions to the aggregate verifier."

requirements-completed: [FRESH-01, FRESH-04, FRESH-05]
generated_by: gsd-execute-plan
lifecycle_mode: yolo
phase_lifecycle_id: 27-2026-06-22T11-58-43
generated_at: 2026-06-22T12:48:46Z

duration: 10 min
completed: 2026-06-22
---

# Phase 27 Plan 02: Freshness Policy Documentation Summary

**Release-readiness freshness guidance with tested reviewed-static and live/manual smoke boundaries**

## Performance

- **Duration:** 10 min
- **Started:** 2026-06-22T12:38:30Z
- **Completed:** 2026-06-22T12:48:46Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Added a `## Freshness Reports` release-readiness section with the exact `bun run report:freshness` command.
- Documented that the report is reviewed static evidence and does not prove current live GitHub state, crawl live external links, or run hosted social crawler validation.
- Added required document facts for the command, reviewed-static boundary, live/manual boundaries, social crawler boundary, and manual smoke severity.
- Extended aggregate script tests to prove `verify` excludes freshness report, live, hosted, sync, and network command strings.

## Task Commits

Each task was committed atomically:

1. **Tasks 1-2: Freshness report docs and aggregate verify boundary tests** - `4687012` (docs)

## Files Created/Modified

- `docs/release-readiness.md` - Adds freshness report instructions and static-vs-live boundary language.
- `scripts/release-readiness.ts` - Adds required release-readiness facts for the freshness report policy.
- `scripts/release-readiness.test.ts` - Adds document-contract and aggregate verify exclusion assertions.

## Decisions Made

- Kept the freshness report outside the primary release gate while still documenting it as reviewed static evidence.
- Kept OpenLinks language low-intrusion and limited to external-link policy/manual smoke context.
- Asserted `report:freshness` exists while separately asserting it is excluded from `verify`.

## Deviations from Plan

None - plan executed as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Verification

- `bun run test scripts/release-readiness.test.ts` - passed.
- `bun run test scripts/release-readiness.test.ts scripts/freshness/freshness.test.ts scripts/social-previews/social-previews.test.ts` - passed.
- `bun run typecheck` - passed.
- `bun run check` - passed.
- `bun run test` - passed with 236 tests.

## Known Stubs

None.

## Threat Flags

None. This plan changed release docs and local tests only; it introduced no live checks, credentials, endpoints, or artifact writes.

## Next Phase Readiness

Phase 27 implementation and policy docs are complete pending final phase verification and lifecycle state updates.

## Self-Check: PASSED

- Found summary file: `.planning/phases/27-freshness-reports-and-reviewed-snapshot-policy/27-02-SUMMARY.md`
- Found task commit: `4687012`
- Found `## Freshness Reports` in `docs/release-readiness.md`

---
*Phase: 27-freshness-reports-and-reviewed-snapshot-policy*
*Completed: 2026-06-22*
