---
phase: 10-project-detail-route-foundation
plan: 01
subsystem: routing
tags: [solidstart, static-generation, projects, seo, verification]

requires:
  - phase: 09-clean-builder-release-gate-closure
    provides: "Clean aggregate release gate and static output verification baseline"
provides:
  - "Typed project detail story data for selected curated projects"
  - "Deterministic /projects/{slug} route helpers and prerender inclusion"
  - "Static project detail route foundation"
  - "Focused route eligibility, exclusion, and metadata derivation tests"
affects: [project-registry, routing, static-generation, release-verification]

tech-stack:
  added: []
  patterns:
    - "Keep project detail route selection in the curated project functional core"
    - "Use SolidStart nested routes with projects/index.tsx and projects/[slug].tsx"
    - "Keep Phase 12 JSON-LD and sitemap work explicitly deferred"

key-files:
  created:
    - src/domain/project-detail-routes.test.ts
    - src/routes/projects/[slug].tsx
    - .planning/phases/10-project-detail-route-foundation/10-01-SUMMARY.md
  modified:
    - src/domain/projects.ts
    - src/domain/routes.ts
    - src/domain/seo.ts
    - src/routes/projects/index.tsx
    - src/domain/foundation.test.ts
    - src/domain/portfolio-surfaces.test.ts
    - scripts/verify-static.ts
    - scripts/verify-release.ts
    - scripts/verify-release.test.ts

key-decisions:
  - "Select detail routes through authored typed project detail data instead of mirroring all public projects."
  - "Keep existing project index anchor links until Phase 11 owns navigation changes."
  - "Add initial project metadata derivation for tests while leaving JSON-LD and sitemap inclusion to Phase 12."
  - "Keep release verification active for new detail HTML but defer project-specific JSON-LD failures until Phase 12."

patterns-established:
  - "projectDetailPageProjects() is the public selector for currently selected detail-page projects."
  - "projectDetailRoutes() is the route source consumed by static prerender and verification."
  - "Project detail route checks must avoid falling back to top-level routeByPath() metadata."

requirements-completed: [ROUTE-01, ROUTE-02, ROUTE-03, ROUTE-04, STORY-01, VERIFY-01]
generated_by: gsd-execute-plan
lifecycle_mode: yolo
phase_lifecycle_id: 10-2026-06-02T20-30-24
generated_at: 2026-06-02T20:52:13Z

duration: 22min
completed: 2026-06-02
---

# Phase 10: Project Detail Route Foundation Summary

**Selected curated projects now have typed detail story data, deterministic `/projects/{slug}` paths, and prerendered static route foundations.**

## Performance

- **Duration:** 22 min
- **Started:** 2026-06-02T20:30:24Z
- **Completed:** 2026-06-02T20:52:13Z
- **Tasks:** 3 completed
- **Files modified:** 12

## Accomplishments

- Added typed `detail` story content for selected flagship projects: OpenLinks, Free The World, Win3Bitco.in, opencode-cloud, Zeckendorf, and Mystic UI.
- Added supported helpers for detail selection, lookup, route path derivation, and prerender route derivation.
- Added `/projects/[slug]` route rendering selected project intro, technical shape, problem, approach, why it matters, current status, proof points, collaboration angle, project index link, and project action links.
- Moved the project index route to `src/routes/projects/index.tsx` so SolidStart can prerender nested detail routes correctly.
- Added project detail eligibility, route derivation, exclusion, and metadata derivation tests.
- Updated static and release verification for the expanded 10-route static output.

## Files Created/Modified

- `src/domain/projects.ts` - Adds `ProjectDetailStory`, selected detail data, and route helper exports.
- `src/domain/routes.ts` - Adds selected detail routes to `prerenderRoutes`.
- `src/domain/seo.ts` - Adds `metadataForProject()` and detail-aware project ItemList URLs.
- `src/routes/projects/index.tsx` - Keeps the existing project index as the nested index route.
- `src/routes/projects/[slug].tsx` - Adds the selected project detail route foundation and safe fallback.
- `src/domain/project-detail-routes.test.ts` - Covers selected slugs, excluded slugs, route derivation, lookup, and project metadata.
- `src/domain/foundation.test.ts` and `src/domain/portfolio-surfaces.test.ts` - Update route and helper surface expectations.
- `scripts/verify-static.ts` - Verifies detail route body text and project metadata without top-level route fallback.
- `scripts/verify-release.ts` and `scripts/verify-release.test.ts` - Keep release checks active while deferring project-specific JSON-LD failures for Phase 12 detail routes.

## Verification

- `bun run format`
- `bun run verify:static` - passed after route-aware static verifier update.
- `bun run verify` - passed.
  - Biome format/check passed over 48 files.
  - `tsc --noEmit` passed.
  - Vitest passed: 10 files, 84 tests.
  - Build prerendered 10 routes, including six selected project detail routes.
  - Playwright passed: 53 browser checks, 13 expected reduced-motion skips.
  - Static verification passed across 10 prerendered routes.
  - Release verification passed across 10 route HTML files and 27 text assets.

## Decisions Made

- Chose flagship projects with authored `detail` content as the Phase 10 selected detail-page set.
- Kept `projectAnchorHref()` unchanged because Phase 11 owns home/project-index navigation updates.
- Added initial route-specific project metadata derivation to satisfy Phase 10 metadata derivation tests, but left full `META-01` through `META-04` completion to Phase 12.
- Made release verification phase-aware for detail JSON-LD so Phase 10 can ship route foundations without prematurely marking `META-02` complete.

## Deviations from Plan

- Added a small release verifier exception for project detail JSON-LD after the full gate exposed that the previous release semantic checker treated every new HTML file as a fully metadata-complete release page.

## Issues Encountered

- SolidStart rendered the project index for `/projects/{slug}` until the index route moved from `src/routes/projects.tsx` to `src/routes/projects/index.tsx`.
- `verify:static` initially expected project index JSON-LD URLs to remain hash anchors for selected projects; it now expects detail URLs for selected projects and anchors for unselected public projects.
- `verify:release` initially failed detail routes for missing JSON-LD; that requirement remains explicitly owned by Phase 12.

## User Setup Required

None.

## Next Phase Readiness

Phase 11 can now build richer project story UI and navigation on top of typed selected detail projects and prerendered `/projects/{slug}` routes.

---

*Phase: 10-project-detail-route-foundation*
*Completed: 2026-06-02*
