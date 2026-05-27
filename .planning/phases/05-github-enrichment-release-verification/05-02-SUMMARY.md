---
phase: 05-github-enrichment-release-verification
plan: 02
subsystem: github-metadata-ui-verification
tags: [github-metadata, static-snapshot, solidjs, dark-ui, verification]

requires:
  - phase: 05-github-enrichment-release-verification
    provides: Plan 05-01 GitHub metadata domain contract and empty snapshot fallback
  - phase: 03-portfolio-surfaces-seo
    provides: Static route generation, SEO metadata, sitemap, robots, and OpenLinks placement
provides:
  - Native Bun GitHub metadata sync script using REST and optional local token
  - Refreshed checked-in GitHub metadata snapshot with available/unavailable records
  - Compact dark-primary metadata rows and optional homepage links in project cards
  - Static output verification for pre-hydration GitHub enrichment
affects: [github-enrichment-release-verification, project-cards, static-verification]

tech-stack:
  added: []
  patterns:
    - Native Bun fetch for manual GitHub REST snapshot refresh
    - Generated snapshot remains checked in and formatted through repo Biome
    - Route cards render optional metadata only from pure domain helpers
    - Static verifier binds generated HTML back to pure metadata helpers before hydration

key-files:
  created:
    - scripts/sync-github-metadata.ts
    - scripts/sync-github-metadata.test.ts
  modified:
    - package.json
    - src/domain/github-metadata.snapshot.json
    - src/domain/github-metadata.ts
    - src/domain/github-metadata.test.ts
    - src/routes/index.tsx
    - src/routes/projects.tsx
    - src/styles/app.css
    - scripts/verify-static.ts

key-decisions:
  - "GitHub metadata sync uses native fetch against REST repository and topics endpoints with redirect: manual so moved repositories become unavailable records."
  - "Project cards render metadata as static text-only dl chips after authored copy/story content and before curated labels/links."
  - "The sync script formats the generated snapshot through the existing Biome binary so refresh output passes repo format checks without a second manual step."

patterns-established:
  - "Unavailable metadata stays in the snapshot for tooling visibility but renders as no visitor-facing row."
  - "GitHub homepage URLs append only through maybeGitHubHomepageLinkForProject, preserving curated repo/live/docs links."
  - "Static verification now checks generated home and projects HTML for metadata fact values before hydration."

requirements-completed: [GH-02, GH-03, GH-04, VER-01, VER-02, VER-03, VER-04]
generated_by: gsd-execute-plan
lifecycle_mode: yolo
phase_lifecycle_id: 5-2026-05-27T11-26-21
generated_at: 2026-05-27T12:48:54Z

duration: 16min
completed: 2026-05-27
---

# Phase 05 Plan 02: GitHub Metadata Sync and Static Enrichment Summary

**Native GitHub REST snapshot refresh with compact static project-card enrichment and pre-hydration verification**

## Performance

- **Duration:** 16 min
- **Started:** 2026-05-27T12:32:09Z
- **Completed:** 2026-05-27T12:48:54Z
- **Tasks:** 3
- **Files modified:** 10

## Accomplishments

- Added `scripts/sync-github-metadata.ts` with native fetch, optional `GITHUB_METADATA_TOKEN`, manual redirect handling, topics pagination, stable snapshot writing, and strict mode.
- Populated `src/domain/github-metadata.snapshot.json` with 8 available repositories and 1 explicit unavailable record for `btc-vanity-address-finder` 404.
- Rendered dark-primary GitHub metadata rows on home and projects cards only when snapshot metadata is available.
- Added optional non-duplicate metadata homepage links while preserving curated `repo`, `live`, and `docs` links.
- Extended `scripts/verify-static.ts` so generated HTML must contain metadata rows/facts before hydration and must omit metadata maintenance/error copy.

## Task Commits

Each task was committed atomically, with the TDD task using RED/GREEN commits:

1. **Task 1 RED: Sync-script tests** - `60f3aa4` (test)
2. **Task 1 GREEN: Native metadata sync** - `82bd3a9` (feat)
3. **Task 2: Metadata card rendering** - `677b0d3` (feat)
4. **Task 3: Static enrichment verification** - `5d2d582` (feat)
5. **Plan-level snapshot refresh** - `d21bef0` (chore)

## Files Created/Modified

- `scripts/sync-github-metadata.ts` - Native Bun GitHub REST sync script and exported pure helpers.
- `scripts/sync-github-metadata.test.ts` - Pagination, repository mapping, error mapping, and direct-repo selection tests.
- `package.json` - Added `sync:github-metadata` and `sync:github-metadata:strict`.
- `src/domain/github-metadata.snapshot.json` - Refreshed checked-in metadata snapshot.
- `src/domain/github-metadata.ts` - Narrowed JSON import typing for populated discriminated snapshot records.
- `src/domain/github-metadata.test.ts` - Updated snapshot contract test for populated data.
- `src/routes/index.tsx` - Added home card metadata rows and optional metadata homepage links.
- `src/routes/projects.tsx` - Added project-index metadata rows and optional metadata homepage links.
- `src/styles/app.css` - Added compact dark-primary metadata row/chip classes.
- `scripts/verify-static.ts` - Added pre-hydration metadata and maintenance-copy assertions.

## Decisions Made

- Used native Bun fetch instead of adding Octokit or GraphQL, matching the locked Phase 5 decision.
- Treated GitHub 404/403/redirect/error states as unavailable snapshot records so visitor rendering can omit them calmly.
- Kept OpenLinks placement unchanged; metadata homepage links are only project-level additions returned by the domain helper.
- Used browser evidence on built static output for UI checks instead of adding Playwright/axe/Lighthouse dependencies in this plan.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Updated stale empty snapshot test**
- **Found during:** Task 1 (Add native-fetch metadata sync script)
- **Issue:** `src/domain/github-metadata.test.ts` still asserted the Plan 05-01 intentionally empty snapshot after this plan populated it.
- **Fix:** Changed the test to validate schema, parseable `syncedAt`, non-empty repositories, and available/unavailable discriminants.
- **Files modified:** `src/domain/github-metadata.test.ts`
- **Verification:** `bun run test -- scripts/sync-github-metadata.test.ts src/domain/github-metadata.test.ts`
- **Committed in:** `82bd3a9`

**2. [Rule 3 - Blocking] Fixed TypeScript JSON discriminant widening**
- **Found during:** Task 1 (Add native-fetch metadata sync script)
- **Issue:** Populated JSON imports widened `status` to `string`, breaking `GitHubMetadataSnapshot` assignment during `bun run typecheck`.
- **Fix:** Added a narrow import-boundary assertion with a comment explaining that the sync script and tests own the checked-in JSON shape.
- **Files modified:** `src/domain/github-metadata.ts`
- **Verification:** `bun run typecheck`
- **Committed in:** `82bd3a9`

**3. [Rule 3 - Blocking] Made sync output pass repo formatting**
- **Found during:** Task 1 (Add native-fetch metadata sync script)
- **Issue:** `bun run sync:github-metadata` wrote valid JSON that Biome reformatted, causing `bun run format:check` to fail immediately after sync.
- **Fix:** The sync script formats the snapshot through the existing Biome binary before writing.
- **Files modified:** `scripts/sync-github-metadata.ts`
- **Verification:** `bun run sync:github-metadata && bun run format:check`
- **Committed in:** `82bd3a9`

***

**Total deviations:** 3 auto-fixed (1 bug, 2 blocking)
**Impact on plan:** All fixes were required for the planned populated snapshot, type safety, and verification workflow. No architecture changes or new dependencies were added.

## Issues Encountered

- `btc-vanity-address-finder` returned GitHub 404 during sync. This is represented as `status: "unavailable"` with reason `missing`, and visitor cards omit metadata for it as planned.
- Plan-level verification reran the sync command and refreshed the snapshot timestamp. The resulting source-data change was committed separately in `d21bef0`.
- `roadmap update-plan-progress` reported success but left the Phase 5 progress row unchanged; after rerunning it with both `05` and `5`, the row was narrowly corrected to `2/3 In Progress`.

## Known Stubs

None.

## Verification

- `bun run test -- scripts/sync-github-metadata.test.ts src/domain/github-metadata.test.ts && bun run sync:github-metadata && bun run verify:no-github-runtime && bun run typecheck`
- `bun run typecheck && bun run build`
- `bun run build && bun run verify:static && bun run verify:no-github-runtime`
- `bun run test -- scripts/sync-github-metadata.test.ts src/domain/github-metadata.test.ts && bun run sync:github-metadata && bun run verify:no-github-runtime && bun run typecheck && bun run build && bun run verify:static`
- Browser evidence on built static output at `http://127.0.0.1:4173/` and `/projects`: dark mode, desktop and 390px mobile, metadata row counts, no horizontal overflow, no clipped metadata chips, and no console warnings/errors.

## User Setup Required

None - no external service configuration required. `GITHUB_METADATA_TOKEN` is optional for higher GitHub API limits.

## Next Phase Readiness

Ready for Plan 05-03 release verification/docs work. GitHub enrichment is static, token-safe, visible only from checked-in snapshot data, and covered by generated-output verification.

## Self-Check: PASSED

- Verified created/modified files exist: `scripts/sync-github-metadata.ts`, `scripts/sync-github-metadata.test.ts`, `src/domain/github-metadata.snapshot.json`, route files, CSS, `scripts/verify-static.ts`, and this summary.
- Verified task and snapshot commits exist in git history: `60f3aa4`, `82bd3a9`, `677b0d3`, `5d2d582`, and `d21bef0`.
- Verified summary lifecycle metadata preserves `lifecycle_mode: yolo` and `phase_lifecycle_id: 5-2026-05-27T11-26-21`.

***
*Phase: 05-github-enrichment-release-verification*
*Completed: 2026-05-27*
