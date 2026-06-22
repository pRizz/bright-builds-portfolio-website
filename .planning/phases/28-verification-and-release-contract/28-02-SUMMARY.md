---
phase: 28-verification-and-release-contract
plan: 02
subsystem: verification
tags: [bun, typescript, vitest, release-verification, social-previews]
generated_by: gsd-execute-plan
lifecycle_mode: yolo
phase_lifecycle_id: 28-2026-06-22T15-45-43
generated_at: 2026-06-22T16:24:20Z

requires:
  - phase: 25-deterministic-static-image-generation
    provides: Deterministic generated social preview PNGs and shared per-image budget constant.
  - phase: 27-freshness-reports-and-reviewed-snapshot-policy
    provides: Local-only release evidence boundary and manual smoke separation.
provides:
  - Generated social preview PNG release budgets measured from `.output/public`.
  - Per-image and aggregate generated social preview budget findings.
  - Local-only automated release evidence label for generated preview budgets.
affects: [release-verification, social-previews, static-shareability]

tech-stack:
  added: []
  patterns:
    - Pure release budget helpers with thin CLI output.
    - Local-only evidence labels separated from hosted/live/manual release claims.

key-files:
  created:
    - .planning/phases/28-verification-and-release-contract/28-02-SUMMARY.md
  modified:
    - scripts/social-previews/config.ts
    - scripts/verify-release.ts
    - scripts/verify-release.test.ts

key-decisions:
  - "Use a shared 1 MiB total generated social preview PNG budget while preserving the existing 250 KiB per-image budget."
  - "Allow the required local label `generated social preview asset budgets` while continuing to forbid hosted, live, deploy, network, and validator claims."

patterns-established:
  - "Release budgets now report generated social preview PNGs individually and in aggregate from actual built output files."
  - "Evidence-label tests distinguish local social-preview budget evidence from manual or live preview/deploy claims."

requirements-completed: [VERIFY-01, VERIFY-02, VERIFY-04]

duration: 5 min
completed: 2026-06-22
---

# Phase 28 Plan 02: Generated Social Preview Release Budgets Summary

**Release verification now measures generated social preview PNG budgets from static output and reports truthful local evidence labels.**

## Performance

- **Duration:** 5 min
- **Started:** 2026-06-22T16:19:15Z
- **Completed:** 2026-06-22T16:24:20Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Added `maxTotalSocialPreviewPngBytes = 1024 * 1024` alongside the existing per-image social preview PNG budget.
- Extended release budget reporting with `generatedSocialPreviewPngBytes` and `totalGeneratedSocialPreviewPngBytes`.
- Added per-image and aggregate generated social preview budget violations and printed sorted generated PNG rows in `verify:release`.
- Added the automated evidence label `generated social preview asset budgets` without claiming hosted, live, deploy, network, or social-card validator checks.

## Task Commits

Each task was committed atomically:

1. **Task 1: Add generated social preview release budgets**
   - `314c1da` test: add failing tests for generated social preview budgets
   - `23145ee` feat: enforce generated social preview budgets
2. **Task 2: Keep release evidence labels local-only and automated**
   - `c419a56` test: add failing test for release evidence labels
   - `79e9f63` feat: label generated preview budget evidence

**Plan metadata:** pending summary commit

## Files Created/Modified

- `scripts/social-previews/config.ts` - Exports the 1 MiB total generated preview PNG budget.
- `scripts/verify-release.ts` - Measures generated preview PNGs from built output, emits budget findings, prints budget rows, and includes the local budget evidence label.
- `scripts/verify-release.test.ts` - Covers generated preview budget reporting, per-image and total violations, local evidence labels, and forbidden live/hosted label wording.
- `.planning/phases/28-verification-and-release-contract/28-02-SUMMARY.md` - Execution summary for this plan.

## Decisions Made

- Used shared social preview budget constants instead of duplicating numeric limits in the release verifier.
- Kept `release-readiness.ts` unchanged because it is outside this plan's owned write set; `verify-release.ts` inserts the generated-preview evidence label locally.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Reconciled contradictory `preview` label assertions**
- **Found during:** Task 2 (Keep release evidence labels local-only and automated)
- **Issue:** The plan required the exact label `generated social preview asset budgets` while also saying joined automated labels must not contain `preview`.
- **Fix:** The test allows `preview` only in the required local generated social preview budget label and continues to forbid hosted/live/manual terms such as `Cloudflare`, `deploy`, `hosted`, `network`, `live link`, `live external`, `current live GitHub`, and `social-card validator`.
- **Files modified:** `scripts/verify-release.test.ts`, `scripts/verify-release.ts`
- **Verification:** `bun run test scripts/verify-release.test.ts && bun run build && bun run verify:release`
- **Committed in:** `c419a56`, `79e9f63`

***

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Preserved the intended local-only evidence boundary while making the required social preview budget label testable.

## Issues Encountered

- Other concurrent executor changes appeared in `.planning/config.json` and `scripts/verify-static/*`; they were left unstaged and uncommitted by this plan.

## User Setup Required

None - no external service configuration required.

## Verification

Passed:

```bash
bun run test scripts/verify-release.test.ts
bun run build
bun run verify:release
```

The final `verify:release` output reported the fallback social image, 13 generated social preview PNG rows, and `generated social preview PNG total: 736.0 KB`.

## Next Phase Readiness

Plan 28-02 is complete and ready for the orchestrator to aggregate wave results. Shared state and roadmap updates were intentionally skipped per orchestrator instructions.

## Self-Check: PASSED

- Found `.planning/phases/28-verification-and-release-contract/28-02-SUMMARY.md`.
- Found task commits `314c1da`, `23145ee`, `c419a56`, and `79e9f63` in git history.

***
*Phase: 28-verification-and-release-contract*
*Completed: 2026-06-22*
