---
phase: 28-verification-and-release-contract
plan: 01
subsystem: verification
tags: [static-verification, social-previews, metadata, json-ld, vitest]

# Dependency graph
requires:
  - phase: 26-metadata-wiring-and-static-references
    provides: route-aware social image metadata and JSON-LD parity
  - phase: 25-deterministic-static-image-generation
    provides: generated social preview PNG manifest contract
provides:
  - Manifest-aware static verification for covered social preview routes
  - Static verifier evidence wording for local manifest coverage
  - Import-safe tests proving helper-derived social preview route coverage
affects: [verify-static, social-previews, release-contract]

# Tech tracking
tech-stack:
  added: []
  patterns: [helper-derived static verification, manifest boundary parsing]

key-files:
  created:
    - .planning/phases/28-verification-and-release-contract/28-01-SUMMARY.md
  modified:
    - scripts/verify-static/metadata-jsonld-verifier.ts
    - scripts/verify-static/run-static-verification.ts
    - scripts/verify-static.test.ts

key-decisions:
  - "Covered social preview routes now require copied manifest entries that match helper-derived route path, asset path, dimensions, and source fingerprint."
  - "Generic fallback routes remain manifest-free and continue to validate only against the checked-in fallback image."
  - "Static verification evidence names social preview manifest coverage without claiming hosted, live-link, Cloudflare, or network checks."

patterns-established:
  - "Parse generated static artifacts at the verifier boundary, then compare them to domain helpers."
  - "Keep static route coverage derived from socialPreviewTargets() and expectedRoutes instead of copied route-to-image fixtures."

requirements-completed: [VERIFY-01, VERIFY-03]
generated_by: gsd-execute-plan
lifecycle_mode: yolo
phase_lifecycle_id: 28-2026-06-22T15-45-43
generated_at: 2026-06-22T16:25:04Z

# Metrics
duration: 5 min
completed: 2026-06-22
---

# Phase 28 Plan 01: Manifest-Aware Static Verification Summary

**Static verification now proves helper-covered social preview metadata agrees with copied generated manifest entries.**

## Performance

- **Duration:** 5 min
- **Started:** 2026-06-22T16:19:11Z
- **Completed:** 2026-06-22T16:25:04Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Added static-output manifest parsing for `social/generated/manifest.json`.
- Required covered route manifest entries to match helper-derived route path, asset path, dimensions, and source fingerprint.
- Preserved generic fallback image behavior without requiring generated manifest entries.
- Updated `verify:static` summary evidence to name local social preview manifest coverage.

## Task Commits

Each task was committed atomically:

1. **Task 1 RED: Add failing social manifest static verifier tests** - `ff8f6c3` (test)
2. **Task 1 GREEN: Verify generated social manifest entries** - `c80487d` (feat)
3. **Task 2 RED: Add failing static manifest evidence tests** - `f6dedd6` (test)
4. **Task 2 GREEN: Name manifest coverage in static verification** - `82d78d2` (feat)

## Files Created/Modified

- `scripts/verify-static/metadata-jsonld-verifier.ts` - Reads and validates copied generated manifest data for covered route image assertions.
- `scripts/verify-static/run-static-verification.ts` - Includes `social preview manifest` in local static verifier evidence wording.
- `scripts/verify-static.test.ts` - Covers valid, missing, and mismatched manifest behavior plus helper-derived social preview route coverage.
- `.planning/phases/28-verification-and-release-contract/28-01-SUMMARY.md` - Captures execution results for this plan.

## Decisions Made

- Manifest consistency is enforced only for `maybeSocialPreviewTargetForRoutePath(routePath)` hits.
- Manifest shape validation accepts numeric dimensions first, then route contract comparison reports dimension-field drift as a manifest mismatch.
- Static verification wording stays local-only and avoids hosted, live-link, Cloudflare, or network claims.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

The first green implementation treated wrong manifest dimensions as an invalid manifest shape instead of a field mismatch. This was corrected before commit so the verifier now reports the route and failing field as planned.

## User Setup Required

None - no external service configuration required.

## Verification

- `bun run test scripts/verify-static.test.ts` - passed
- `bun run build` - passed
- `bun run verify:static` - passed

## Known Stubs

None.

## Next Phase Readiness

Ready for the remaining Phase 28 release-contract plans. Shared `STATE.md`, `ROADMAP.md`, and requirements updates were intentionally left to the orchestrator.

## Self-Check: PASSED

- Summary file exists at `.planning/phases/28-verification-and-release-contract/28-01-SUMMARY.md`.
- Task commits exist: `ff8f6c3`, `c80487d`, `f6dedd6`, `82d78d2`.
- Key modified files exist: `scripts/verify-static/metadata-jsonld-verifier.ts`, `scripts/verify-static/run-static-verification.ts`, `scripts/verify-static.test.ts`.
- Stub scan found only test fixtures/default helper values and a normal null guard; no visitor-facing stubs were introduced.

---
*Phase: 28-verification-and-release-contract*
*Completed: 2026-06-22*
