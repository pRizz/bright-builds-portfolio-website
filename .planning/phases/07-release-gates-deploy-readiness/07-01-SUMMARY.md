---
phase: 07-release-gates-deploy-readiness
plan: 01
subsystem: release-readiness
generated_by: gsd-execute-plan
lifecycle_mode: yolo
phase_lifecycle_id: 7-2026-05-31T22-21-18
generated_at: 2026-05-31T22:28:14.697Z
tags: [release, deployment, external-links, verification]
requirements-completed: [GATE-02, GATE-03, REL-01, REL-02]
key_files_created: [docs/release-readiness.md, scripts/release-readiness.ts, scripts/release-readiness.test.ts]
key_files_modified: [README.md, scripts/verify-release.ts, scripts/verify-release.test.ts]
duration: 7min
completed: 2026-05-31
---

# Phase 7: Release Gates & Deploy Readiness Summary

**The release gate now has a checked release-readiness contract covering static metadata, browser/a11y, performance budgets, external-link policy, Cloudflare Pages deployment assumptions, and preview/deploy smoke checks.**

## Performance

- **Duration:** 7 min
- **Tasks:** 3 completed
- **Files modified:** 10

## Accomplishments

- Added `scripts/release-readiness.ts` with pure external-link policy checks, sensitive query-key rejection, release-readiness document validation, and evidence labels.
- Added `scripts/release-readiness.test.ts` with focused behavior tests for covered links, uncovered origins, non-HTTPS links, token-safe diagnostics, and document contract checks.
- Integrated release-readiness findings and evidence labels into `scripts/verify-release.ts`.
- Added `docs/release-readiness.md` with Cloudflare Pages/static deployment settings, external-link policy, preview checklist, production checklist, and token-safety guidance.
- Updated `README.md` to call out `verify:browser`, release-readiness verification, and the release-readiness document.

## Task Commits

The wrapper-level strict git gate commits this phase after clean verification, so task-level commits were intentionally deferred until all checks passed.

1. **Task 1: Add release-readiness policy helpers and tests** - pending final wrapper commit
2. **Task 2: Integrate release-readiness checks and docs** - pending final wrapper commit
3. **Task 3: Run full verification and document completion** - pending final wrapper commit

## Files Created/Modified

- `scripts/release-readiness.ts` - Release policy helpers for external links, document facts, and release evidence labels.
- `scripts/release-readiness.test.ts` - Unit tests for release-readiness policy behavior and document contract.
- `docs/release-readiness.md` - Checked release contract and Cloudflare/static deployment checklist.
- `scripts/verify-release.ts` - Integrates release-readiness policy/document findings and labels.
- `scripts/verify-release.test.ts` - Updates release evidence label assertions.
- `README.md` - Points maintainers to the release-readiness contract and browser gate.

## Decisions Made

- Keep `bun run verify` as the single aggregate release command.
- Keep live external-link reachability manual and deterministic local verification policy-based.
- Treat static output budgets as the local v1.1 performance/best-practices gate.
- Check deployment assumptions through a required release-readiness document instead of relying on dashboard memory.

## Deviations from Plan

None - plan executed as written.

## Issues Encountered

- Initial focused tests exposed an ordering assertion mismatch and a case-sensitive document phrase mismatch. Both were fixed before aggregate verification.

## Verification

- `bun run test -- scripts/release-readiness.test.ts scripts/verify-release.test.ts` passed.
- `bun run typecheck` passed.
- `bun run check` passed.
- `bun run build && bun run verify:release` passed.
- `bun run verify` passed: 8 Vitest files, 69 tests, 23 Playwright checks passed, 7 expected project skips.

## Next Phase Readiness

Phase 8 can now clean up the curated data helper surface with the full release gate protecting static output, browser behavior, metadata, external-link policy, and deployment documentation.

***

*Phase: 07-release-gates-deploy-readiness*
*Completed: 2026-05-31*
