---
phase: 08-content-helper-surface-cleanup
plan: 01
subsystem: content-data
tags: [curated-projects, verification, typescript, static-portfolio]

requires:
  - phase: 07-release-gates-deploy-readiness
    provides: "Aggregate release verification contract through bun run verify"
provides:
  - "Documented curated project registry and supported selector export surface"
  - "Legacy project helper exports removed from runtime-facing domain module"
  - "TypeScript AST import guard for forbidden project helper imports and re-exports"
  - "Aggregate verify wiring for the helper-surface guard"
affects: [curated-project-data, release-verification, runtime-routes]

tech-stack:
  added: []
  patterns:
    - "Functional-core TypeScript AST scanner with CLI-only filesystem traversal"
    - "Export-surface regression tests for domain module API cleanup"

key-files:
  created:
    - scripts/verify-project-helper-surface.ts
    - scripts/project-helper-surface.test.ts
  modified:
    - src/domain/projects.ts
    - src/domain/foundation.test.ts
    - package.json

key-decisions:
  - "Treat curatedProjects as the authoritative checked-in registry and selector functions as the supported maintainer API."
  - "Remove projectSeeds, primaryProjectLink, and featuredProjects instead of documenting stale compatibility aliases."
  - "Enforce the helper surface with a repo-owned TypeScript AST verifier wired into bun run verify."

patterns-established:
  - "Verifier scripts expose pure scanner functions and keep filesystem traversal, logging, and exit behavior in the import.meta.main CLI shell."
  - "Runtime and build-time source must use named supported selectors from src/domain/projects instead of namespace imports or legacy helper aliases."

requirements-completed: [DATA-01, DATA-02, DATA-03]
generated_by: gsd-execute-plan
lifecycle_mode: yolo
phase_lifecycle_id: 8-2026-05-31T23-03-14
generated_at: 2026-05-31T23:35:20Z

duration: 7min
completed: 2026-05-31
---

# Phase 08 Plan 01: Content Helper Surface Cleanup Summary

**Curated project data now has a documented selector API, no seed-era helper exports, and a checked AST import guard in the aggregate release gate.**

## Performance

- **Duration:** 7 min
- **Started:** 2026-05-31T23:28:13Z
- **Completed:** 2026-05-31T23:35:20Z
- **Tasks:** 3 completed
- **Files modified:** 5

## Accomplishments

- Documented the maintainer-facing project data surface next to `curatedProjects`.
- Removed `projectSeeds`, `primaryProjectLink`, and `featuredProjects` from `src/domain/projects.ts`.
- Added export-surface coverage proving supported selectors exist and legacy helper names are absent.
- Added a dependency-free TypeScript AST guard that blocks forbidden named imports, aliased imports, namespace imports, and re-exports from `src/domain/projects`.
- Wired `verify:project-helper-surface` into `bun run verify` immediately after `verify:no-github-runtime`.

## Task Commits

Each task was committed atomically. TDD tasks include RED and GREEN commits.

1. **Task 1: Remove legacy helper exports and document supported selectors**
   - `824290c` test: add project helper export-surface regression
   - `4a1c8b3` feat: remove legacy project helper exports
   - `fa015d6` style: organize project surface test imports
2. **Task 2: Add project helper import-surface guard**
   - `5225740` test: add project helper import guard contract
   - `12138db` feat: add project helper import-surface guard
   - `9919b31` style: format project helper guard files
3. **Task 3: Wire helper-surface guard into aggregate verification**
   - `7acd82b` chore: wire project helper guard into verify

## Files Created/Modified

- `src/domain/projects.ts` - Documents the supported selector surface and removes legacy helper exports.
- `src/domain/foundation.test.ts` - Adds export-surface regression coverage while preserving home project ordering coverage.
- `scripts/verify-project-helper-surface.ts` - Adds the TypeScript AST helper-surface import guard.
- `scripts/project-helper-surface.test.ts` - Tests allowed imports, forbidden imports, aliases, namespace imports, re-exports, and excluded paths.
- `package.json` - Adds `verify:project-helper-surface` and wires it into aggregate `verify`.

## Decisions Made

- Removed all three seed-era helper exports instead of deprecating them because current source had no runtime or fixture consumer.
- Failed namespace imports from `src/domain/projects` to prevent bypassing the named selector surface.
- Kept the scanner dependency-free by using the existing `typescript` package and `ts.createSourceFile`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Applied Biome formatting to new guard files**
- **Found during:** Task 3 aggregate `bun run verify`
- **Issue:** `format:check` failed on the new guard test and verifier formatting.
- **Fix:** Ran Biome formatting on `scripts/project-helper-surface.test.ts` and `scripts/verify-project-helper-surface.ts`.
- **Files modified:** `scripts/project-helper-surface.test.ts`, `scripts/verify-project-helper-surface.ts`
- **Verification:** `bun run test -- scripts/project-helper-surface.test.ts`, `bun run verify:project-helper-surface`, and the final `bun run verify` passed.
- **Committed in:** `9919b31`

**2. [Rule 3 - Blocking] Organized project surface test imports**
- **Found during:** Task 3 aggregate `bun run verify`
- **Issue:** `bun run check` required Biome import ordering in `src/domain/foundation.test.ts`.
- **Fix:** Reordered the namespace import before the named import from `./projects`.
- **Files modified:** `src/domain/foundation.test.ts`
- **Verification:** `bun run test -- src/domain/foundation.test.ts src/domain/portfolio-surfaces.test.ts`, `bun run check`, and the final `bun run verify` passed.
- **Committed in:** `fa015d6`

---

**Total deviations:** 2 auto-fixed (2 blocking verification issues)
**Impact on plan:** Formatting-only fixes required for the repo-native verification gate. No scope expansion, dependency changes, visitor-facing copy changes, or route behavior changes.

## Issues Encountered

- Task 1 RED failed as expected because `projectSeeds`, `primaryProjectLink`, and `featuredProjects` were still exported.
- Task 2 RED failed as expected because `scripts/verify-project-helper-surface.ts` did not exist yet.
- Aggregate verification initially failed on Biome format/import-order checks introduced by the new files; both were fixed and committed before final verification.

## Verification

- `bun run test -- src/domain/foundation.test.ts src/domain/portfolio-surfaces.test.ts` passed.
- `bun run test -- scripts/project-helper-surface.test.ts` passed.
- `bun run scripts/verify-project-helper-surface.ts` passed.
- `bun run verify:project-helper-surface` passed.
- `bun run typecheck` passed.
- `bun run check` passed.
- `bun run verify` passed: 9 Vitest files, 75 tests, helper-surface guard, build, browser, static, and release verification all passed; Playwright reported 23 passed and 7 expected skips.

## Known Stubs

None - stub scan found no TODO, FIXME, placeholder, coming-soon, unavailable, or empty hardcoded UI data patterns in changed files.

## Threat Flags

None - the new filesystem-scanning verifier is the planned `verifier CLI -> local filesystem` surface from T-08-03, scoped to `src` and `scripts`, with no new network, auth, secret, backend, or runtime visitor surface.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Phase 8 is complete. The release gate now blocks future source drift back to legacy project helper imports while preserving the existing home/projects route behavior.

## Self-Check: PASSED

- Found summary file: `.planning/phases/08-content-helper-surface-cleanup/08-01-SUMMARY.md`
- Found created files: `scripts/verify-project-helper-surface.ts`, `scripts/project-helper-surface.test.ts`
- Found task commits: `824290c`, `4a1c8b3`, `5225740`, `12138db`, `9919b31`, `fa015d6`, `7acd82b`
- Confirmed required summary lifecycle fields and completed requirements are present.

---

*Phase: 08-content-helper-surface-cleanup*
*Completed: 2026-05-31*
