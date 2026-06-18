---
phase: 22-theme-metadata-and-structured-data
plan: 01
subsystem: seo
tags: [themes, metadata, structured-data, sitemap, static-verification]

requires:
  - phase: 19-theme-domain-foundation
    provides: typed public theme registry, public theme route helpers, and project/writing relationship resolvers
  - phase: 20-theme-routes-and-dark-ui
    provides: prerendered public theme index and detail routes
  - phase: 21-collaboration-pathways-and-cross-links
    provides: helper-derived theme project, writing, and collaboration relationships
provides:
  - route-specific theme detail metadata helper
  - theme index ItemList JSON-LD helper
  - theme detail CollectionPage JSON-LD helper
  - public theme sitemap inclusion
  - static verification for theme metadata, JSON-LD, sitemap inclusion, sitemap exclusions, and social image fallback
affects: [theme-routes, seo-domain, static-metadata-generation, release-verification]

tech-stack:
  added: []
  patterns:
    - pure domain metadata projection over checked-in theme, project, writing, and profile data
    - static verifier assertions derived from the same public route helpers used by generated output

key-files:
  created:
    - .planning/phases/22-theme-metadata-and-structured-data/22-01-SUMMARY.md
    - .planning/phases/22-theme-metadata-and-structured-data/22-VERIFICATION.md
  modified:
    - src/domain/seo.ts
    - src/domain/routes.ts
    - src/routes/themes/index.tsx
    - src/routes/themes/[slug].tsx
    - scripts/verify-static/metadata-jsonld-verifier.ts
    - scripts/verify-static/sitemap-assets-verifier.ts
    - scripts/verify-static.test.ts
    - public/sitemap.xml

key-decisions:
  - "Theme metadata stays in src/domain/seo.ts so route components consume a shared helper contract rather than duplicating head-tag values."
  - "Theme structured data uses CollectionPage and ItemList shapes derived from public theme helpers, related selected projects, public writing, and profile identity data."
  - "Theme sitemap coverage is helper-derived and excludes non-public and unknown theme routes."
  - "Theme social metadata reuses the checked-in social/bright-builds-og.png fallback and avoids dynamic image generation."

patterns-established:
  - "Theme metadata and JSON-LD are pure helper outputs consumed by static routes and static verification."
  - "Static verification owns crawler-facing regressions for theme routes before release-contract evidence changes in Phase 23."

requirements-completed: [META-01, META-02, META-03, META-04]
generated_by: gsd-execute-plan-inline-fallback
lifecycle_mode: yolo
phase_lifecycle_id: 22-2026-06-18T01-09-47
generated_at: 2026-06-18T01:32:04Z

duration: 20 min
completed: 2026-06-18
---

# Phase 22 Plan 01: Theme Metadata and Structured Data Summary

**Theme routes now expose static crawler metadata, structured data, sitemap entries, and social-preview fallback verification.**

## Performance

- **Duration:** 20 min
- **Completed:** 2026-06-18T01:32:04Z
- **Tasks:** 3
- **Files modified:** 17

## Accomplishments

- Added theme metadata, theme ItemList JSON-LD, and theme CollectionPage JSON-LD helpers in `src/domain/seo.ts`.
- Wired `/themes` and public `/themes/{slug}` route head output to static title, description, canonical, OG, Twitter, asset links, and JSON-LD.
- Added `/themes`, `/themes/agentic-engineering`, and `/themes/open-identity` to generated sitemap output.
- Extended static verification so generated theme HTML and sitemap output fail when metadata, JSON-LD, public-only inclusion, unknown-route exclusion, or social fallback behavior regresses.

## Task Commits

Inline fallback execution completed all planned tasks in the final phase implementation commit.

## Files Created/Modified

- `src/domain/seo.ts` - Exports `metadataForTheme()`, `themeItemListJsonLd()`, and `themeCollectionPageJsonLd()`.
- `src/domain/routes.ts` - Includes public theme detail routes in `sitemapRoutes`.
- `src/routes/themes/index.tsx` - Emits theme ItemList JSON-LD alongside existing Person JSON-LD.
- `src/routes/themes/[slug].tsx` - Emits public theme detail head metadata and CollectionPage JSON-LD, with generic fallback metadata for unknown/non-public slugs.
- `scripts/verify-static/metadata-jsonld-verifier.ts` - Verifies theme route metadata, theme index ItemList JSON-LD, and theme detail CollectionPage JSON-LD.
- `scripts/verify-static/sitemap-assets-verifier.ts` - Verifies public theme sitemap entries and rejects unknown/non-public theme sitemap leakage.
- `scripts/verify-static.test.ts` - Covers new verifier helper exports and expected theme route coverage.
- `public/sitemap.xml` - Regenerated with theme index and public theme detail routes.

## Decisions Made

- Kept OpenLinks exposure through existing profile `Person.sameAs` JSON-LD and the already-visible low-intrusion identity surfaces, not as a new dominant theme CTA.
- Kept fallback metadata generic for unknown theme slugs so route params are not echoed into crawler-visible metadata.
- Deferred release-readiness label/doc expansion to Phase 23, where the aggregate release contract is explicitly scoped.

## Deviations from Plan

- The original executor subagent path stalled in this runtime, so the plan was executed inline as the documented fallback. All planned tasks, acceptance checks, summary, verification, lifecycle validation, and final commit/push gates were preserved.

## Issues Encountered

- `tests/theme-detail-route.test.tsx` needed `MetaProvider` wrapping after theme detail started rendering head metadata through `@solidjs/meta`.
- Existing sitemap expectation tests needed updates to include the newly public theme routes.

## Known Stubs

None. The implementation uses checked-in curated theme, project, writing, and profile data; no placeholder, runtime fetch, token, dynamic OG route, or release-readiness evidence label was introduced.

## Verification

- `bun run test src/domain/writing-metadata.test.ts && bun run typecheck` passed.
- `bun run test src/domain/theme-routes.test.ts && bun run generate:static-metadata && bun run build` passed.
- `bun run test scripts/verify-static.test.ts && bun run build && bun run verify:static` passed.
- `bun run check && bun run typecheck && bun run test` passed.
- `bun run verify` passed with 83 Playwright checks, 19 intended reduced-motion layout skips, and static verification for 16 prerendered routes, metadata, JSON-LD, writing route coverage, assets, sitemap, and robots.

## User Setup Required

None.

## Next Phase Readiness

Phase 23 can now expand the release contract around theme coverage using real automated metadata, JSON-LD, sitemap, accessibility, keyboard, dark-layout, reduced-motion, and aggregate verification evidence.

## Self-Check: PASSED

- Found `.planning/phases/22-theme-metadata-and-structured-data/22-01-SUMMARY.md`.
- Found `.planning/phases/22-theme-metadata-and-structured-data/22-VERIFICATION.md`.
- Found theme metadata helpers in `src/domain/seo.ts`.
- Found theme metadata route wiring in `src/routes/themes/[slug].tsx`.
- Found theme sitemap verification in `scripts/verify-static/sitemap-assets-verifier.ts`.

---
*Phase: 22-theme-metadata-and-structured-data*
*Completed: 2026-06-18*
