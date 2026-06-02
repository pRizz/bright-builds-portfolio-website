---
phase: 12-project-metadata-sharing
plan: 01
subsystem: seo
tags: [solidstart, structured-data, sitemap, metadata, release-verification]

requires:
  - phase: 10-project-detail-route-foundation
    provides: selected project detail route helpers and prerender route foundations
  - phase: 11-project-story-page-ui
    provides: rendered project story pages for selected detail routes
provides:
  - Project-specific metadata, JSON-LD, sitemap coverage, and social preview verification for selected detail routes
  - Release and static verifiers that fail when project detail JSON-LD or sitemap coverage regresses
affects: [phase-13-project-page-release-coverage, seo, static-verification, release-verification]

tech-stack:
  added: []
  patterns:
    - Pure SEO helpers derive route metadata and structured data from curated project/profile records
    - Static/release verification compares built output against pure helper output

key-files:
  created:
    - .planning/phases/12-project-metadata-sharing/12-01-SUMMARY.md
  modified:
    - src/domain/seo.ts
    - src/domain/project-detail-routes.test.ts
    - src/domain/portfolio-surfaces.test.ts
    - src/routes/projects/[slug].tsx
    - public/sitemap.xml
    - scripts/verify-static.ts
    - scripts/verify-release.ts
    - scripts/verify-release.test.ts

key-decisions:
  - "Project structured data uses SoftwareSourceCode JSON-LD from curated project data and profile sameAs identity only."
  - "Sitemap generation defaults to prerendered route paths so selected detail pages are included without unselected records."
  - "Project detail social previews use the checked-in /social/bright-builds-og.png fallback rather than dynamic OG rendering."

patterns-established:
  - "Project JSON-LD: selected detail routes render projectJsonLd() through jsonLdScriptContent() before the article body."
  - "Verifier coverage: static output checks assert project metadata, JSON-LD, sitemap inclusion/exclusion, and local social preview mapping."

requirements-completed: [META-01, META-02, META-03, META-04]
generated_by: gsd-execute-plan
lifecycle_mode: yolo
phase_lifecycle_id: 12-2026-06-02T21-19-24
generated_at: 2026-06-02T22:05:08Z

duration: 17 min
completed: 2026-06-02
---

# Phase 12 Plan 01: Project Metadata & Sharing Summary

**Selected project detail routes now ship route-specific sharing metadata, SoftwareSourceCode JSON-LD, sitemap entries, and release checks backed by static curated data.**

## Performance

- **Duration:** 17 min
- **Started:** 2026-06-02T21:48:01Z
- **Completed:** 2026-06-02T22:05:08Z
- **Tasks:** 3
- **Files modified:** 8

## Accomplishments

- Added `projectJsonLd()` and path-based `sitemapXml()` defaults so selected project metadata and sitemap entries come from curated project routes.
- Rendered project-specific JSON-LD on selected `/projects/{slug}` pages before hydration and regenerated `public/sitemap.xml`.
- Removed the release verifier's project-detail JSON-LD exception and extended static verification for project metadata, JSON-LD, sitemap coverage, unselected-route exclusion, and local social preview mapping.

## Task Commits

Each task was committed atomically:

1. **Task 1 RED: Project metadata sharing tests** - `8032b14` (test)
2. **Task 1 GREEN: Pure project metadata helpers** - `ff4ea85` (feat)
3. **Task 2: Static project JSON-LD and sitemap output** - `8325b6f` (feat)
4. **Task 3 RED: Release JSON-LD regression tests** - `489b763` (test)
5. **Task 3 GREEN: Static and release verifier enforcement** - `21381ed` (feat)

_Note: TDD tasks produced separate RED and GREEN commits._

## Files Created/Modified

- `src/domain/seo.ts` - Added typed project JSON-LD and default sitemap generation from prerendered paths.
- `src/domain/project-detail-routes.test.ts` - Added project metadata, sitemap inclusion/exclusion, and safe JSON-LD serialization coverage.
- `src/domain/portfolio-surfaces.test.ts` - Added project JSON-LD identity/story coverage and updated sitemap helper usage.
- `src/routes/projects/[slug].tsx` - Renders project JSON-LD for selected project detail pages.
- `public/sitemap.xml` - Regenerated with selected project detail route URLs and without unselected detail URLs.
- `scripts/verify-static.ts` - Verifies project metadata, project JSON-LD, selected sitemap coverage, unselected sitemap exclusion, and local social preview mapping.
- `scripts/verify-release.ts` - Requires JSON-LD on every release route.
- `scripts/verify-release.test.ts` - Replaces the old project-detail JSON-LD deferral test with required/pass cases.

## Decisions Made

- Kept OpenLinks discoverability in structured metadata through existing profile sameAs data; no visible project-page OpenLinks CTA was added.
- Kept all project sharing data static and deterministic from checked-in curated records; no runtime GitHub/API calls, dynamic OG endpoint, or remote social assets were added.
- Used the existing checked-in `social/bright-builds-og.png` as the explicit project-detail social preview fallback for META-04.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## Authentication Gates

None.

## Known Stubs

None. Stub scan found only an intentional empty-alt image fixture inside `scripts/verify-release.test.ts` for accessibility failure coverage.

## Verification

Required sequence passed:

- `bun run format`
- `bun run check`
- `bun run typecheck`
- `bun run test -- src/domain/project-detail-routes.test.ts src/domain/portfolio-surfaces.test.ts scripts/verify-release.test.ts` (31 tests passed)
- `bun run generate:static-metadata`
- `bun run build`
- `bun run verify:static`
- `bun run verify:release`
- `bun run verify` (91 Vitest tests passed; Playwright reported 53 passed and 13 existing reduced-motion/layout skips)

## Threat Flags

None. No new network endpoints, auth paths, file access trust boundaries, schema changes, or runtime external asset dependencies were introduced.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Phase 12 metadata and sharing requirements are complete. Phase 13 can expand release/browser coverage around the now-enforced project detail metadata contract.

## Self-Check: PASSED

- Found summary file and key modified implementation files.
- Found task commits `8032b14`, `ff4ea85`, `8325b6f`, `489b763`, and `21381ed` in git history.
- Note: the initial `[slug].tsx` self-check command had an unquoted zsh glob in its echo text; rerun with quoted output found the file.

---
*Phase: 12-project-metadata-sharing*
*Completed: 2026-06-02*
