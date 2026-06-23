---
phase: 27-freshness-reports-and-reviewed-snapshot-policy
plan: 01
subsystem: release
tags: [freshness-report, social-previews, github-metadata, static-output, typescript]

requires:
  - phase: 24-social-image-data-contract
    provides: Social preview target registry and validation contract
  - phase: 25-deterministic-static-image-generation
    provides: Checked-in generated social preview PNGs and manifest
  - phase: 26-metadata-wiring-and-static-references
    provides: Static output metadata and release verification contracts
provides:
  - Read-only `bun run report:freshness` command for offline release evidence review
  - Freshness severity taxonomy with `release blocker`, `needs review`, and `manual smoke`
  - Parsed GitHub metadata snapshot freshness findings for stale or unavailable records
  - Shared social preview check-input builder used by generator check mode and report mode
affects: [release-readiness, social-preview-verification, github-metadata-review]

tech-stack:
  added: []
  patterns:
    - Read-only report shells compose pure freshness adapters and set exit codes from severity.
    - Boundary JSON is parsed before domain use instead of trusted by cast.
    - Generator check mode shares deterministic read-only input construction with advisory reports.

key-files:
  created:
    - scripts/freshness/report.ts
    - scripts/freshness/github-snapshot.ts
    - scripts/freshness/social-previews.ts
    - scripts/freshness/static-output.ts
    - scripts/freshness/freshness.test.ts
    - scripts/social-previews/check-input.ts
    - scripts/generate-freshness-report.ts
  modified:
    - scripts/generate-social-previews.ts
    - package.json

key-decisions:
  - "Kept `report:freshness` advisory and excluded from `bun run verify` so `needs review` and `manual smoke` do not become hidden hard gates."
  - "Reused existing social preview, external-link, and static-output evidence instead of adding live network checks."
  - "Mapped generated media and external-link policy defects to `release blocker`; GitHub snapshot age/unavailable records to `needs review`; live state to `manual smoke`."

patterns-established:
  - "`FreshnessFinding` carries severity, area, code, message, and optional source-specific metadata for grouped reporting."
  - "`scripts/social-previews/check-input.ts` owns read-only manifest, PNG metadata, render hash, and orphan-file inputs."
  - "`readStaticOutputRoutesForFreshness()` returns a freshness blocker instead of throwing when `.output/public` is absent."

requirements-completed: [FRESH-01, FRESH-02, FRESH-03, FRESH-04]
generated_by: gsd-execute-plan
lifecycle_mode: yolo
phase_lifecycle_id: 27-2026-06-22T11-58-43
generated_at: 2026-06-22T12:48:46Z

duration: 29 min
completed: 2026-06-22
---

# Phase 27 Plan 01: Offline Freshness Report Summary

**Read-only freshness report for generated media, GitHub snapshot review, static output policy, and manual smoke prompts**

## Performance

- **Duration:** 29 min
- **Started:** 2026-06-22T12:19:30Z
- **Completed:** 2026-06-22T12:48:46Z
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments

- Added pure freshness report helpers with the locked `release blocker`, `needs review`, and `manual smoke` severity order.
- Added runtime parsing for `src/domain/github-metadata.snapshot.json`, including stale snapshot and unavailable repository findings.
- Extracted read-only social preview check input construction so generator check mode and the freshness report share the same deterministic evidence.
- Added `bun run report:freshness` as an offline advisory command that exits nonzero only for `release blocker` findings.

## Task Commits

Each task was committed atomically:

1. **Tasks 1-2: Freshness helpers, adapters, CLI, and package script** - `26a6e37` (feat)

## Files Created/Modified

- `scripts/freshness/report.ts` - Severity taxonomy, grouped formatting, release-finding mapping, and blocker exit predicate.
- `scripts/freshness/github-snapshot.ts` - Parsed GitHub metadata snapshot boundary and snapshot freshness findings.
- `scripts/freshness/social-previews.ts` - Social preview check finding to freshness finding mapper.
- `scripts/freshness/static-output.ts` - Read-only `.output/public` route loader and missing-output blocker.
- `scripts/freshness/freshness.test.ts` - Coverage for severity mapping, snapshot policy, static output, read-only shell, and verify exclusion.
- `scripts/social-previews/check-input.ts` - Shared deterministic social preview check input builder.
- `scripts/generate-freshness-report.ts` - Thin Bun report shell.
- `scripts/generate-social-previews.ts` - Uses the shared read-only check input builder in check mode.
- `package.json` - Adds `report:freshness` without changing `verify`.

## Decisions Made

- Kept report output on stdout only; no report artifact is written.
- Kept live GitHub state, hosted social crawler validation, external-link reachability, and preview/production route checks as `manual smoke`.
- Kept `sync:github-metadata` separate from report generation so maintainers explicitly own snapshot refresh.

## Deviations from Plan

None - plan executed as written.

## Issues Encountered

- Biome requested import organization and formatting on new TypeScript files; fixed with `bun run format` and small import-only edits.
- Initial manual-smoke output repeated code labels in messages; tightened the messages before committing.

## User Setup Required

None - no external service configuration required.

## Verification

- `bun run test scripts/freshness/freshness.test.ts` - passed.
- `bun run test scripts/freshness/freshness.test.ts scripts/social-previews/social-previews.test.ts` - passed.
- `bun run build` - passed and generated `.output/public`.
- `bun run report:freshness` - passed, printed all severity groups, and exited 0 with one `needs review` GitHub unavailable-record finding.
- `bun run typecheck` - passed.
- `bun run check` - passed.
- `bun run test` - passed with 236 tests.

## Known Stubs

None.

## Threat Flags

None. The report reads local checked-in/generated evidence and does not add network requests, scheduled jobs, generated artifact writes, or token access.

## Next Phase Readiness

Ready for Plan 27-02 to document the reviewed-static versus live/manual boundary and guard aggregate verification against accidental report/live coupling.

## Self-Check: PASSED

- Found summary file: `.planning/phases/27-freshness-reports-and-reviewed-snapshot-policy/27-01-SUMMARY.md`
- Found task commit: `26a6e37`
- Found `report:freshness` script in `package.json`

---
*Phase: 27-freshness-reports-and-reviewed-snapshot-policy*
*Completed: 2026-06-22*
