---
phase: 26-metadata-wiring-and-static-references
plan: 02
subsystem: seo
tags: [solidstart, metadata, social-previews, json-ld, static-verification, typescript]

requires:
  - phase: 26-metadata-wiring-and-static-references
    provides: Route-aware social image metadata and JSON-LD image parity from Plan 26-01
  - phase: 25-deterministic-static-image-generation
    provides: Checked-in deterministic 1200x630 generated social preview PNG assets
provides:
  - Helper-derived `og:image:type` rendering across all route head surfaces
  - Route-aware static metadata image verification for generated and fallback social images
  - Local PNG dimension checks for accepted metadata image URLs
  - Detail JSON-LD image parity checks for project, writing, and theme records
affects: [static-metadata-verification, route-head-rendering, release-verification]

tech-stack:
  added: []
  patterns:
    - Route components render social image MIME metadata from `PageMetadata`
    - Static verifier maps route paths through `maybeSocialPreviewTargetForRoutePath()`
    - Verifier image checks reuse `assertPngDimensions()` for copied static output assets

key-files:
  created:
    - .planning/phases/26-metadata-wiring-and-static-references/26-02-SUMMARY.md
  modified:
    - src/routes/index.tsx
    - src/routes/about.tsx
    - src/routes/contact.tsx
    - src/routes/projects/index.tsx
    - src/routes/projects/[slug].tsx
    - src/routes/writing/index.tsx
    - src/routes/writing/[slug].tsx
    - src/routes/themes/index.tsx
    - src/routes/themes/[slug].tsx
    - scripts/verify-static/metadata-jsonld-verifier.ts
    - scripts/verify-static.test.ts

key-decisions:
  - "Kept route head changes mechanical instead of introducing a shared head component during metadata wiring."
  - "Kept static verification helper-derived and manifest-free; `verify:social-previews` remains the manifest/checksum owner."
  - "Preserved OpenLinks identity posture by leaving visible links and `Person.sameAs` metadata unchanged."

patterns-established:
  - "Route files may render `metadata.openGraph.image.mimeType`, but must not hard-code social image paths."
  - "Static metadata image assertions accept `(outputRoot, routePath, imageUrl)` so covered routes require generated assets and generic routes require fallback assets."
  - "Detail JSON-LD verifier checks include the helper-derived `image` value from the corresponding domain JSON-LD helper."

requirements-completed: [META-02, META-05]
generated_by: gsd-execute-plan
lifecycle_mode: yolo
phase_lifecycle_id: 26-2026-06-21T21-29-16
generated_at: 2026-06-21T22:25:20Z

duration: 7 min
completed: 2026-06-21
---

# Phase 26 Plan 02: Static Metadata Image Verification Summary

**Helper-derived social image MIME tags with route-aware static asset and JSON-LD parity verification**

## Performance

- **Duration:** 7 min
- **Started:** 2026-06-21T22:18:13Z
- **Completed:** 2026-06-21T22:25:20Z
- **Tasks:** 2
- **Files modified:** 11

## Accomplishments

- Added `og:image:type` rendering to all nine route head surfaces from `metadata.openGraph.image.mimeType`.
- Added RED/GREEN verifier coverage for generated social image acceptance, covered-route fallback rejection, and generic-route fallback preservation.
- Made static metadata verification route-aware using `maybeSocialPreviewTargetForRoutePath()` with `SOCIAL_PREVIEW_FALLBACK_IMAGE`.
- Added copied-output PNG dimension checks and JSON-LD detail image parity checks to `verify:static`.

## Task Commits

Each task was committed atomically:

1. **Task 1: Render helper-derived `og:image:type` in every route head** - `cab39a3` (feat)
2. **Task 2 RED: Add failing verifier tests for route-aware generated/fallback assets** - `34f093b` (test)
3. **Task 2 GREEN: Make static metadata verification route-aware for generated and fallback image assets** - `dbd0d69` (feat)

## Files Created/Modified

- `src/routes/index.tsx` - Renders helper-derived `og:image:type` for the home route fallback image.
- `src/routes/about.tsx` - Renders helper-derived `og:image:type` for the about route fallback image.
- `src/routes/contact.tsx` - Renders helper-derived `og:image:type` for the contact route fallback image.
- `src/routes/projects/index.tsx` - Renders helper-derived `og:image:type` for the generated projects index preview.
- `src/routes/projects/[slug].tsx` - Renders helper-derived `og:image:type` from the project detail metadata signal.
- `src/routes/writing/index.tsx` - Renders helper-derived `og:image:type` for the generated writing index preview.
- `src/routes/writing/[slug].tsx` - Renders helper-derived `og:image:type` for writing detail previews.
- `src/routes/themes/index.tsx` - Renders helper-derived `og:image:type` for the generated themes index preview.
- `src/routes/themes/[slug].tsx` - Renders helper-derived `og:image:type` for theme detail and fallback metadata.
- `scripts/verify-static/metadata-jsonld-verifier.ts` - Verifies `og:image:type`, route-correct image URLs, PNG dimensions, and JSON-LD image values.
- `scripts/verify-static.test.ts` - Adds import-safe route-aware image verifier tests with temp PNG output.

## Decisions Made

- Kept route edits small and explicit because the plan scoped identical `og:image:type` additions, not a head-rendering refactor.
- Used the social-preview domain helper and fallback object as the only expected image source in static verification.
- Left OpenLinks placement and identity metadata unchanged; this plan only preserves existing `Person.sameAs` checks.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- Biome requested one route tag and the RED test shim be formatted differently; both were fixed before their respective commits.
- The RED verifier test failed as intended with `Invalid URL` because the old verifier accepted only `(outputRoot, imageUrl)`.

## User Setup Required

None - no external service configuration required.

## Verification

- `bun run format:check` - passed before task commits and in aggregate verification.
- `bun run check` - passed before task commits and in aggregate verification.
- `bun run typecheck` - passed after both tasks.
- `bun run test scripts/verify-static.test.ts` - failed during RED, then passed after GREEN.
- `bun run test` - passed with 224 tests.
- `bun run build` - passed and prerendered 16 routes.
- `bun run verify:static` - passed and verified 16 prerendered routes, metadata, JSON-LD, assets, sitemap, and robots.
- `bun run verify` - passed, including browser release checks and release evidence.
- `rg -l 'property="og:image:type"' src/routes | sort | wc -l | tr -d ' '` - returned `9`.
- `rg -n 'property="og:image:type" content=\{[^}]*mimeType' src/routes` - showed all nine route tags derive from metadata.
- `rg -n '/social/(generated|bright-builds-og)' src/routes` - returned no matches.
- `rg -n 'summary_large_image' src/routes` - returned no matches.

## Known Stubs

None. Stub scan found no placeholder, TODO/FIXME, hardcoded empty UI data, or unwired mock-data patterns in the files changed by this plan.

## Threat Flags

None. The plan changed static metadata rendering and local verifier logic only; it introduced no new network endpoint, auth path, file-access trust boundary, or schema boundary.

## Next Phase Readiness

Phase 26 plan work is complete. Static output verification now proves route-correct canonical social image metadata and JSON-LD detail image parity for generated and fallback assets.

## Self-Check: PASSED

- Found summary file: `.planning/phases/26-metadata-wiring-and-static-references/26-02-SUMMARY.md`
- Found task commit: `cab39a3`
- Found RED test commit: `34f093b`
- Found GREEN implementation commit: `dbd0d69`

---
*Phase: 26-metadata-wiring-and-static-references*
*Completed: 2026-06-21*
