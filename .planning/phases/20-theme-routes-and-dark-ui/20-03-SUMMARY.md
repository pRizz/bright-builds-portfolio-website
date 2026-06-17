---
phase: 20-theme-routes-and-dark-ui
plan: 03
subsystem: static-verification
tags: [solidstart, themes, static-output, vitest, sitemap-boundary]

requires:
  - phase: 20-theme-routes-and-dark-ui
    provides: /themes route registry entry and dark public theme routes from 20-01 and 20-02
provides:
  - Focused server-render tests for public theme detail and generic fallback states
  - Helper-derived static verifier expected text for /themes and public /themes/{slug} pages
  - Static output coverage for public theme detail HTML and unknown theme route absence
  - Explicit Phase 22 metadata and JSON-LD skip for theme detail routes
affects: [20-theme-routes-and-dark-ui, 22-theme-metadata-and-structured-data, static-verification]

tech-stack:
  added: []
  patterns:
    - "Vitest route component tests use the existing vite-plugin-solid SSR transform without DOM environment dependencies."
    - "Theme static verifier expectations derive from public theme and relationship helpers."
    - "Theme detail metadata checks are explicitly skipped until Phase 22 while body HTML remains verified."

key-files:
  created:
    - tests/theme-detail-route.test.tsx
    - vitest.config.ts
  modified:
    - package.json
    - tsconfig.json
    - scripts/verify-static.test.ts
    - scripts/verify-static/config.ts
    - scripts/verify-static/expected-route-text.ts
    - scripts/verify-static/metadata-jsonld-verifier.ts
    - scripts/verify-static/sitemap-assets-verifier.ts
    - src/domain/routes.ts
    - src/domain/theme-routes.test.ts
    - src/routes/themes/index.tsx

key-decisions:
  - "Use the existing vite-plugin-solid dependency to let Vitest import Solid route components for SSR render tests, without adding jsdom, happy-dom, Testing Library, or new dependencies."
  - "Keep theme detail routes out of Phase 20 metadata and JSON-LD assertions while still verifying generated route body content."
  - "Keep sitemap verification on sitemapXml() defaults so theme route sitemap inclusion remains deferred to Phase 22."

patterns-established:
  - "Route render tests mock @solidjs/router useParams and render actual Solid route components with renderToString()."
  - "Static verifier helpers resolve theme routes through maybePublicThemeEntryBySlug() and relationship helpers rather than copied slug arrays."
  - "Unknown theme output checks mirror writing-route non-output checks with routeHtmlCandidates()."

requirements-completed: [ROUTE-03, ROUTE-04, SYNTH-01]
generated_by: gsd-execute-plan
lifecycle_mode: yolo
phase_lifecycle_id: 20-2026-06-17T16-16-59
generated_at: 2026-06-17T17:57:27Z

duration: 11 min
completed: 2026-06-17
---

# Phase 20 Plan 03: Theme Static Output Verification Summary

**Theme route render coverage plus helper-derived static verification for public theme HTML and unknown-route absence**

## Performance

- **Duration:** 11 min
- **Started:** 2026-06-17T17:46:03Z
- **Completed:** 2026-06-17T17:57:27Z
- **Tasks:** 2
- **Files modified:** 12

## Accomplishments

- Added `tests/theme-detail-route.test.tsx` to render `/themes/{slug}` with mocked params and prove public theme detail content plus non-leaking unknown fallback behavior.
- Added a minimal `vitest.config.ts` Solid SSR transform so route component tests can import TSX route files without DOM test dependencies.
- Extended static verifier expected text for `/themes` and public theme detail routes from `publicThemeEntries()`, `maybePublicThemeEntryBySlug()`, `themeDetailPath()`, and relationship helpers.
- Added theme detail generated-output coverage, unknown theme route absence checks, and source-level fallback guard checks.
- Added an explicit Phase 22 metadata/JSON-LD boundary skip for theme detail routes while preserving `/themes` top-level metadata checks and the Phase 20 sitemap boundary.

## Task Commits

This plan used TDD where the task shape allowed it:

1. **Task 1: Add focused theme detail render tests for public and fallback states** - `ce479e2` (test)
2. **Task 2 RED: Add failing theme static verifier coverage** - `28645d8` (test)
3. **Task 2 GREEN: Verify theme static route output** - `b094526` (feat)

## Files Created/Modified

- `tests/theme-detail-route.test.tsx` - Renders the actual theme detail route with mocked params and asserts public/fallback behavior.
- `vitest.config.ts` - Adds Solid SSR transform support for Vitest route component imports.
- `package.json` - Includes `vitest.config.ts` in repo format, lint, and check surfaces.
- `tsconfig.json` - Includes `vitest.config.ts` in typechecking.
- `scripts/verify-static.test.ts` - Adds theme helper-derived expected text coverage and callable verifier export checks.
- `scripts/verify-static/config.ts` - Adds the theme detail route source path for fallback source checks.
- `scripts/verify-static/expected-route-text.ts` - Adds theme index/detail expected text helpers.
- `scripts/verify-static/metadata-jsonld-verifier.ts` - Skips theme detail metadata/JSON-LD assertions until Phase 22.
- `scripts/verify-static/sitemap-assets-verifier.ts` - Adds generated theme detail coverage, unknown output absence, and fallback source checks.
- `src/domain/routes.ts` and `src/domain/theme-routes.test.ts` - Align `/themes` static check text with the generated route lead.
- `src/routes/themes/index.tsx` - Uses a raw apostrophe in the lead so static body text matches verifier expectations.

## Decisions Made

- Used the already pinned `vite-plugin-solid` for Vitest route imports instead of adding a DOM environment or test-library dependency.
- Kept theme route metadata and JSON-LD assertions deferred, documented by a dedicated `maybeThemeForDetailRoute()` skip.
- Preserved Plan 20-01 sitemap behavior by relying on `sitemapXml()` defaults and not adding theme sitemap coverage assertions.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added Solid SSR transform support for route render tests**
- **Found during:** Task 1 (Add focused theme detail render tests for public and fallback states)
- **Issue:** Vitest could not parse the new TSX route render test or import the existing `src/routes/themes/[slug].tsx` route component because the repo had no Vitest Solid transform config.
- **Fix:** Added `vitest.config.ts` using the existing `vite-plugin-solid` dependency with SSR transform support, then included that config in existing format, check, lint, and typecheck surfaces.
- **Files modified:** `vitest.config.ts`, `package.json`, `tsconfig.json`
- **Verification:** `bun run test tests/theme-detail-route.test.tsx`, `bun run check`, `bun run typecheck`, `bun run test`, and `bun run build` passed.
- **Committed in:** `ce479e2`

**2. [Rule 1 - Bug] Aligned `/themes` static check text with generated route body text**
- **Found during:** Task 2 (Add theme route expected text and fallback/static-output safety checks)
- **Issue:** `verify:static` correctly failed because the `/themes` route registry `staticCheckText` did not match the generated route lead, and the route source encoded the apostrophe as `&apos;`, preventing exact static body verification.
- **Fix:** Updated the `/themes` route registry static check text and focused test to match the UI lead, and changed the route lead source to use a normal apostrophe so generated HTML contains the expected text.
- **Files modified:** `src/domain/routes.ts`, `src/domain/theme-routes.test.ts`, `src/routes/themes/index.tsx`
- **Verification:** `bun run test scripts/verify-static.test.ts tests/theme-detail-route.test.tsx src/domain/theme-routes.test.ts`, `bun run build && bun run verify:static`, and the theme-only route HTML snippet passed.
- **Committed in:** `b094526`

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 bug)
**Impact on plan:** Both fixes were required to make the planned route render and generated static HTML verification executable. No new dependencies, DOM test environment, theme metadata helpers, JSON-LD helpers, sitemap theme coverage, browser labels, release docs, schema changes, or dynamic Open Graph routes were added.

## Issues Encountered

- Task 1 did not produce a behavioral RED failure because Plan 20-02 had already implemented the public and fallback route behavior. The initial failure was test infrastructure parsing, fixed under Rule 3, then the test-only task was committed after passing.
- Task 2 RED failed as expected on missing theme static verifier helpers and exports before the GREEN implementation.
- `.planning/config.json` remained modified with `_auto_chain_active: true` from the shared orchestration context and was intentionally left unstaged.

## Verification

- `bun run test tests/theme-detail-route.test.tsx` - passed, 2 tests.
- `bun run test scripts/verify-static.test.ts` - RED failed as expected before implementation on missing theme helpers/exports.
- `bun run test scripts/verify-static.test.ts tests/theme-detail-route.test.tsx` - passed, 13 tests.
- `bun run test scripts/verify-static.test.ts tests/theme-detail-route.test.tsx src/domain/theme-routes.test.ts` - passed, 16 tests.
- `bun run format` - passed; Biome formatted one verifier file during implementation.
- `bun run check` - passed.
- `bun run typecheck` - passed.
- `bun run test` - passed, 18 test files and 176 tests.
- `bun run build && bun run verify:static` - passed, prerendered and verified 16 routes.
- Theme-only `assertRouteHtml()` Bun snippet - passed for `/themes` and public `/themes/{slug}` routes.
- Unknown theme `assertNoPrerenderedThemeRoute()` Bun snippet - passed.
- Task acceptance `rg`, `test -f`, and negative Phase 22 scope guards passed.

## Known Stubs

None.

## Threat Flags

None - changes stayed within planned static route verification, route render tests, and helper-derived public theme output checks.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Plan 20-04 can consume verified static theme output. Theme-specific metadata, JSON-LD, sitemap inclusion, release-readiness documentation, release evidence labels, and browser-suite expansion remain deferred to later phases.

## Self-Check: PASSED

- Found `.planning/phases/20-theme-routes-and-dark-ui/20-03-SUMMARY.md`.
- Found task commit `ce479e2`.
- Found task commit `28645d8`.
- Found task commit `b094526`.

---
*Phase: 20-theme-routes-and-dark-ui*
*Completed: 2026-06-17*
