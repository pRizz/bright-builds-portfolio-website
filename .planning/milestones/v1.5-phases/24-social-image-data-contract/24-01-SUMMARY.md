---
phase: 24-social-image-data-contract
plan: 01
subsystem: domain
tags: [social-previews, static-shareability, domain-contract, vitest]

# Dependency graph
requires:
  - phase: 23-verification-and-release-readiness
    provides: verified project, writing, and theme static route surfaces
provides:
  - Pure social preview target inventory for project, writing, and theme share routes
  - Fallback social image contract for generic routes
  - Stable 12-character source fingerprints and generated asset paths
  - Structured social preview validation findings
affects: [25-deterministic-static-image-generation, 26-metadata-wiring-and-static-references, 28-verification-and-release-contract]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Functional-core social preview contract
    - SHA-256 source-payload fingerprints
    - Finding-returning validation helpers

key-files:
  created:
    - src/domain/social-previews.ts
    - src/domain/social-previews.test.ts
  modified: []

key-decisions:
  - "Social preview targets derive from existing public project, writing, theme, and route helpers."
  - "Generated social asset paths use SHA-256 source fingerprints truncated to 12 lowercase hex characters."
  - "Generic routes stay on the fallback social image and are excluded from route-specific targets."
  - "Validation returns structured findings instead of throwing from normal target listing."

patterns-established:
  - "Target derivation order: /projects, selected project details, /writing, public writing details, /themes, public theme details."
  - "Validation findings use stable codes for duplicates, path safety, dimensions, text budgets, and unsupported route kinds."

requirements-completed: [SHARE-01, SHARE-02, SHARE-03, SHARE-04, SHARE-05]
generated_by: gsd-execute-plan
lifecycle_mode: yolo
phase_lifecycle_id: 24-2026-06-21T14-01-05
generated_at: 2026-06-21T14:45:20Z

# Metrics
duration: 11 min
completed: 2026-06-21
---

# Phase 24 Plan 01: Social Image Data Contract Summary

**Route-derived social preview contract with fallback data, 12-character SHA-256 fingerprints, and structured validation findings**

## Performance

- **Duration:** 11 min
- **Started:** 2026-06-21T14:33:43Z
- **Completed:** 2026-06-21T14:45:20Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Added `socialPreviewTargets()` for `/projects`, selected project detail routes, `/writing`, public writing detail routes, `/themes`, and public theme detail routes.
- Added `SOCIAL_PREVIEW_FALLBACK_IMAGE`, fixed 1200x630 dimensions, text budgets, generated local asset paths, and stable source fingerprints.
- Added validation findings for duplicate routes/assets, missing text, unsupported kinds, non-local/non-generated/unsafe asset paths, wrong dimensions, and text budget failures.

## Task Commits

Each task was committed atomically:

1. **Task 1: Add failing tests for the social preview contract** - `0759651` (test)
2. **Task 2: Implement pure target derivation, fallback data, fingerprints, and validation** - `dc17fad` (feat)

_Note: Task 1 is the TDD RED commit; Task 2 is the GREEN implementation commit._

## Files Created/Modified

- `src/domain/social-previews.ts` - Pure target derivation, fallback image data, source fingerprinting, route lookup, and validation findings.
- `src/domain/social-previews.test.ts` - Vitest coverage for route coverage, public filtering, target shape, fallback behavior, fingerprint stability, and validation codes.

## Decisions Made

- Social preview targets compose existing public selectors instead of copying route or slug arrays.
- Generated asset paths stay under `/social/generated/{projects|writing|themes}/` and include a source-derived 12-character fingerprint.
- Fallback behavior is explicit data, while `/`, `/about`, `/contact`, and unknown routes return `null` from route-specific lookup.
- Validation is separate from target listing and returns structured findings for future generator, metadata, and verifier consumers.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Phase 25 can consume `socialPreviewTargets()` and `validateSocialPreviewTargets()` as the single source of truth for deterministic static image generation and manifest checks.

## Self-Check: PASSED

- Found `src/domain/social-previews.ts`
- Found `src/domain/social-previews.test.ts`
- Found `.planning/phases/24-social-image-data-contract/24-01-SUMMARY.md`
- Found task commit `0759651`
- Found task commit `dc17fad`

---
*Phase: 24-social-image-data-contract*
*Completed: 2026-06-21*
