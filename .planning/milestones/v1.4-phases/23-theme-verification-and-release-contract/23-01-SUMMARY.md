---
phase: 23-theme-verification-and-release-contract
plan: 01
subsystem: verification
tags: [release-readiness, theme-routes, static-verification, browser-verification]

requires:
  - phase: 22-theme-metadata-and-structured-data
    provides: helper-derived theme metadata, JSON-LD, sitemap, and static verification coverage
  - phase: 21-collaboration-pathways-and-cross-links
    provides: helper-derived theme collaboration links and browser coverage
provides:
  - aggregate verify script ordering with release verification last
  - theme release-readiness document facts and helper-derived representative theme smoke route
  - automated release evidence label for theme route coverage
  - release documentation for clean-builder theme coverage
affects: [release-gate, theme-routes, release-documentation, evidence-labels]

tech-stack:
  added: []
  patterns:
    - helper-derived representative theme route selection in release-readiness checks
    - release-readiness docs mirrored by required document facts and fixture-removal tests
    - non-mutating aggregate verify script ending in release verification

key-files:
  created:
    - .planning/phases/23-theme-verification-and-release-contract/23-01-SUMMARY.md
  modified:
    - package.json
    - scripts/release-readiness.ts
    - scripts/release-readiness.test.ts
    - scripts/verify-release.test.ts
    - docs/release-readiness.md
    - README.md
    - CONTRIBUTING.md

key-decisions:
  - "Run `bun run verify:release` last in the aggregate `bun run verify` gate without adding browser installation or metadata generation to the aggregate script."
  - "Use `themeDetailRoutes()[0]` for the representative theme smoke route in executable release-readiness checks."
  - "Limit automated release evidence wording to `theme route coverage` and keep manual external-link, preview, post-deploy, and hosted checks as checklist prose."

patterns-established:
  - "Theme release facts are required by `releaseReadinessDocumentFindings()` and tested through removal fixtures."
  - "Docs name clean-builder verification as `bun run install:browser && bun run verify` while keeping `verify` non-mutating."

requirements-completed: [VERIFY-02, VERIFY-03, VERIFY-04]
generated_by: gsd-execute-plan
lifecycle_mode: yolo
phase_lifecycle_id: 23-2026-06-18T04-28-20
generated_at: 2026-06-18T05:22:05Z

duration: 6 min
completed: 2026-06-18
---

# Phase 23 Plan 01: Theme Release Contract Summary

**Theme route coverage is now enforced in release-readiness checks, automated evidence labels, docs, and the aggregate verify gate.**

## Performance

- **Duration:** 6 min
- **Started:** 2026-06-18T05:16:05Z
- **Completed:** 2026-06-18T05:22:05Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments

- Added TDD coverage for missing theme release-readiness facts, helper-derived representative theme smoke route, evidence label ordering, and aggregate verify script composition.
- Updated `package.json` so `bun run verify` remains non-mutating and ends with `bun run verify:static && bun run verify:release`.
- Added theme route, static, browser, and smoke-route required facts to `releaseReadinessDocumentFindings()`.
- Added `theme route coverage` to `releaseReadinessEvidenceLabels()` and `releaseEvidenceLabels()` immediately after `writing route coverage`.
- Updated release-readiness docs, README, and CONTRIBUTING so clean builders use `bun run install:browser && bun run verify` with theme coverage included.

## Task Commits

Each task was committed atomically:

1. **Task 1 RED: Add failing tests for theme release contract** - `3f87172` (test)
2. **Task 1 GREEN: Implement theme release contract facts** - `8e263a2` (feat)
3. **Task 2: Document theme release coverage** - `2663175` (docs)

**Plan metadata:** committed separately after summary self-check.

## Files Created/Modified

- `package.json` - Runs release verification last in the aggregate `verify` script.
- `scripts/release-readiness.ts` - Requires theme release-readiness facts and emits `theme route coverage`.
- `scripts/release-readiness.test.ts` - Guards theme doc facts, representative smoke route, evidence labels, and aggregate verify composition.
- `scripts/verify-release.test.ts` - Expects `theme route coverage` in release evidence labels while preserving anti-overclaim assertions.
- `docs/release-readiness.md` - Documents theme route/static/browser coverage and theme smoke routes in release guidance.
- `README.md` - Names clean-builder verification and theme route coverage in the release check overview.
- `CONTRIBUTING.md` - Directs contributors to the clean-builder aggregate verification path.

## Decisions Made

- Kept `bun run install:browser` outside `bun run verify`, matching the clean-builder prerequisite decision.
- Kept `generate:static-metadata` outside `bun run verify` so stale generated output remains visible as a verification failure.
- Used `themeDetailRoutes()[0]` in executable release-readiness code instead of hard-coding `/themes/agentic-engineering` outside docs/checklist prose.
- Kept manual external-link smoke checks, preview deployment checks, post-deploy checks, and hosted audits out of automated evidence labels.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added minimal release-readiness doc facts during Task 1**
- **Found during:** Task 1 GREEN verification
- **Issue:** Once `releaseReadinessDocumentFindings()` required theme facts, the existing "accepts the checked-in release-readiness document" test failed until `docs/release-readiness.md` contained those exact facts.
- **Fix:** Added the required theme facts and representative theme smoke route to `docs/release-readiness.md` in the Task 1 GREEN commit, then completed the broader docs wording in Task 2.
- **Files modified:** `docs/release-readiness.md`
- **Verification:** `bun run test scripts/release-readiness.test.ts scripts/verify-release.test.ts && bun run typecheck`
- **Committed in:** `8e263a2`

**Total deviations:** 1 auto-fixed blocking issue.
**Impact on plan:** The change was required for the code-owned document guard to pass and stayed within Plan 23-01 files and intent.

## Issues Encountered

- The Task 1 GREEN verification initially failed because the checked-in release-readiness document did not yet contain the new required theme facts. This was resolved by the Rule 3 fix above.

## Known Stubs

None. Stub scan found only local test fixtures and accumulator arrays (`alt=""` image fixture and `const findings: ReleaseFinding[] = []`), not visitor-facing placeholder data or UI-fed empty data.

## Verification

- RED proof: `bun run test scripts/release-readiness.test.ts scripts/verify-release.test.ts` failed with 7 expected failures for missing theme facts, missing evidence label, and missing aggregate `verify:release` tail.
- Task 1 GREEN: `bun run test scripts/release-readiness.test.ts scripts/verify-release.test.ts && bun run typecheck` passed.
- Task 1 acceptance checks passed for exact verify script ordering, required theme strings, `themeDetailRoutes`, and anti-overclaim assertions.
- Task 1 Biome check passed: `bun run check`.
- Task 2: `bun run test scripts/release-readiness.test.ts && bun run typecheck` passed.
- Task 2 acceptance checks passed for required docs strings and negative overclaim guards; negative `rg` checks returned no matches.
- Task 2 Biome check passed: `bun run check`.
- Plan-level verification passed: `bun run test scripts/release-readiness.test.ts scripts/verify-release.test.ts && bun run typecheck && bun run build && bun run verify:release`.
- Fresh build prerendered 16 routes including `/themes`, `/themes/agentic-engineering`, and `/themes/open-identity`.
- `bun run verify:release` passed and printed `theme route coverage` in release evidence labels.
- Local Bun used for evidence: `1.3.9`. The repo pin remains `bun@1.3.14`; no version mismatch failure occurred.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Plan 23-02 can now update static verifier theme route coverage evidence wording on top of a truthful aggregate release gate and release-readiness contract.

## Self-Check: PASSED

- Found `.planning/phases/23-theme-verification-and-release-contract/23-01-SUMMARY.md`.
- Found all key modified files: `package.json`, release-readiness scripts/tests, release docs, README, and CONTRIBUTING.
- Found task commits `3f87172`, `8e263a2`, and `2663175` in git history.

---
*Phase: 23-theme-verification-and-release-contract*
*Completed: 2026-06-18*
