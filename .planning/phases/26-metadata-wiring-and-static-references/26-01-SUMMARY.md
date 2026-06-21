---
phase: 26-metadata-wiring-and-static-references
plan: 01
subsystem: seo
tags: [solidstart, metadata, social-previews, json-ld, typescript]

requires:
  - phase: 24-social-image-data-contract
    provides: Helper-derived social preview target contract and fallback image data
  - phase: 25-deterministic-static-image-generation
    provides: Checked-in deterministic generated social preview PNG assets
provides:
  - Route-aware social image metadata resolver for covered routes and generic fallback routes
  - JSON-LD image parity for project, writing, writing item-list, and theme detail records
  - Browser-safe deterministic source fingerprint hashing for social preview target helpers
affects: [phase-26-plan-02, static-metadata-verification, route-head-rendering]

tech-stack:
  added: []
  patterns:
    - Pure route-path metadata resolver in `src/domain/seo.ts`
    - Browser-safe domain hash utility for deterministic social preview fingerprints

key-files:
  created:
    - src/domain/sha256.ts
  modified:
    - src/domain/seo.ts
    - src/domain/social-previews.ts
    - src/domain/project-detail-routes.test.ts
    - src/domain/writing-metadata.test.ts
    - src/domain/portfolio-surfaces.test.ts
    - src/domain/foundation.test.ts

key-decisions:
  - "Keep social image selection centralized in `src/domain/seo.ts` through a pure route-path resolver."
  - "Preserve OpenLinks identity metadata posture by leaving `Person.sameAs` and profile identity helpers unchanged."
  - "Make social preview fingerprinting browser-safe so route metadata can consume the Phase 24 helper without client build failures."

patterns-established:
  - "Metadata helpers pass canonical route paths into `socialImageForRoutePath()` instead of hard-coding generated asset paths."
  - "JSON-LD detail image fields derive from the same social metadata resolver used for Open Graph and Twitter metadata."
  - "Social preview source fingerprints are computed through a reusable browser-safe SHA-256 utility."

requirements-completed: [META-01, META-03, META-04, META-05]
generated_by: gsd-execute-plan
lifecycle_mode: yolo
phase_lifecycle_id: 26-2026-06-21T21-29-16
generated_at: 2026-06-21T22:14:26Z

duration: 10 min
completed: 2026-06-21
---

# Phase 26 Plan 01: Route-Aware Metadata Image Wiring Summary

**Route-aware SEO image metadata with generated social previews, fallback preservation, and JSON-LD parity**

## Performance

- **Duration:** 10 min
- **Started:** 2026-06-21T22:04:31Z
- **Completed:** 2026-06-21T22:14:26Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments

- Added failing then passing domain tests for project, writing, theme, route-family index, and generic fallback social image metadata.
- Implemented `socialImageForRoutePath()` in `src/domain/seo.ts` so covered routes use generated previews and generic routes use `SOCIAL_PREVIEW_FALLBACK_IMAGE`.
- Added `mimeType: "image/png"` to social image metadata and made project, writing, writing item-list, and theme JSON-LD image values match metadata URLs.
- Kept route components free of generated asset paths or social-preview maps.

## Task Commits

1. **Task 1: Add failing domain tests for route-aware metadata and JSON-LD image parity** - `ea4e417` (test)
2. **Task 2: Implement route-aware social image metadata and JSON-LD parity** - `77ab1a6` (feat)
3. **Task 2 refactor: Split social preview hashing helper** - `2f150ad` (refactor)

## Files Created/Modified

- `src/domain/sha256.ts` - Browser-safe SHA-256 hex helper for deterministic social preview fingerprints.
- `src/domain/seo.ts` - Route-aware social image resolver, MIME metadata, and JSON-LD image parity.
- `src/domain/social-previews.ts` - Removed top-level `node:crypto` dependency from the helper consumed by route metadata.
- `src/domain/project-detail-routes.test.ts` - Project detail metadata and SoftwareSourceCode image parity coverage.
- `src/domain/writing-metadata.test.ts` - Writing/theme metadata and BlogPosting, ItemList, and CollectionPage parity coverage.
- `src/domain/portfolio-surfaces.test.ts` - Route-family index generated preview coverage and helper-derived route metadata checks.
- `src/domain/foundation.test.ts` - Generic route fallback social image regression coverage.

## Decisions Made

- Kept image selection in the domain layer, not in route files, so routes continue to consume metadata helpers.
- Used the Phase 24 social preview helper and fallback object as the only source for route-specific versus fallback image selection.
- Preserved OpenLinks as low-intrusion identity metadata; no OpenLinks branding or CTA changes were made.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Made social preview fingerprinting browser-safe**
- **Found during:** Task 2 (pre-commit production build)
- **Issue:** Importing `maybeSocialPreviewTargetForRoutePath()` into `seo.ts` pulled `src/domain/social-previews.ts` into the client bundle, where its top-level `node:crypto` import caused `bun run build` to fail.
- **Fix:** Replaced the Node-only hash dependency with a browser-safe SHA-256 helper and moved that helper into `src/domain/sha256.ts` to keep `social-previews.ts` focused.
- **Files modified:** `src/domain/social-previews.ts`, `src/domain/sha256.ts`
- **Verification:** Social preview unit tests passed, `bun run verify:social-previews` verified all 13 generated PNGs and manifest entries, and the full format/check/type/test/build sequence passed.
- **Committed in:** `77ab1a6`, `2f150ad`

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** The fix was required for the planned `seo.ts` import to work in SolidStart client builds. It preserved the existing social preview helper contract and generated asset fingerprints.

## Issues Encountered

- Biome import ordering failed after the RED/GREEN edits; fixed with Biome's safe organize-imports rewrite.
- The first production build failed on `node:crypto` in the client bundle; resolved by the Rule 3 deviation above.

## User Setup Required

None - no external service configuration required.

## Verification

- `bun run test src/domain/project-detail-routes.test.ts src/domain/writing-metadata.test.ts src/domain/portfolio-surfaces.test.ts src/domain/foundation.test.ts` - passed after implementation.
- `bun run typecheck` - passed.
- `bun run test src/domain/social-previews.test.ts scripts/social-previews/social-previews.test.ts` - passed after browser-safe hash fix.
- `bun run verify:social-previews` - passed.
- `bun run format:check && bun run check && bun run typecheck && bun run test && bun run build` - passed.
- `rg -n "/social/generated|maybeSocialPreviewTargetForRoutePath|SOCIAL_PREVIEW" src/routes` - no route-level generated asset path or social-preview helper usage found.

## Known Stubs

None. Stub scan found only intentional empty arrays/default object parameters in tests and domain helper internals, not UI-facing placeholder data.

## Threat Flags

None. No new network endpoint, auth path, file access boundary, or schema trust boundary was introduced.

## Next Phase Readiness

Ready for Plan 26-02 to render the new `mimeType` field in route heads and update static metadata verification against generated assets.

## Self-Check: PASSED

- Found summary file: `.planning/phases/26-metadata-wiring-and-static-references/26-01-SUMMARY.md`
- Found task commit: `ea4e417`
- Found task commit: `77ab1a6`
- Found refactor commit: `2f150ad`

***
*Phase: 26-metadata-wiring-and-static-references*
*Completed: 2026-06-21*
