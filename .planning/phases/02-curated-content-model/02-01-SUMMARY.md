---
phase: 02-curated-content-model
plan: 01
subsystem: content-model
tags: [typescript, solidstart, vitest, curation, dark-mode]
requires:
  - phase: 01-static-app-foundation-ui-shell
    provides: Pure route/profile/project/SEO modules and static verification
  - phase: 01.1-dark-primary-visual-rule-and-shell-refactor
    provides: Dark-primary route shell and visual verification baseline
provides:
  - Typed curated project-story registry with reviewed Phase 2 records
  - Pure curation validation with hard errors and warnings
  - Current home and projects routes rendering from curated selectors
affects: [phase-3-portfolio-surfaces-seo, phase-5-github-enrichment-release-verification]
tech-stack:
  added: []
  patterns: [type-first-content-registry, pure-validation-functions, curated-route-selectors]
key-files:
  created: [src/domain/project-validation.ts, src/domain/project-validation.test.ts]
  modified:
    [
      src/domain/projects.ts,
      src/domain/foundation.test.ts,
      src/routes/index.tsx,
      src/routes/projects.tsx,
    ]
key-decisions:
  - "Use checked-in ProjectStory records as the authoritative project source, with GitHub links stored as reviewed links rather than generated repo identity."
  - "Keep curation validation pure and framework-free so flagship validity can be unit tested without Solid or network access."
  - "Render current routes from selectors only, leaving visual polish and project-detail surfaces to later phases."
patterns-established:
  - "Project routes call homeProjects, visibleProjects, and primaryProjectLink instead of reading raw repo fields."
  - "Curation rules return structured issue objects with stable codes for tests and future scripts."
requirements-completed: [CUR-01, CUR-02, CUR-03, CUR-05]
generated_by: gsd-execute-plan
lifecycle_mode: yolo
phase_lifecycle_id: 2-2026-05-25T23-28-02
generated_at: 2026-05-26T00:24:02Z
duration: 13min
completed: 2026-05-26
---

# Phase 02 Plan 01: Curated Content Model Summary

**Typed curated project stories with pure flagship validation and selector-driven route rendering**

## Performance

- **Duration:** 13 min
- **Started:** 2026-05-26T00:11:18Z
- **Completed:** 2026-05-26T00:24:02Z
- **Tasks:** 3
- **Files modified:** 6

## Accomplishments

- Replaced Phase 1 seed records with `ProjectStory` records for OpenLinks, Free The World, Win3Bitco.in / Open Bitcoin Web Miner, Open Bitcoin, opencode-cloud, Zeckendorf, Mystic UI, and selected supporting/lab projects.
- Added corrected OpenLinks and Win3Bitco.in source links and explicit Mystic UI promoted-fork status.
- Added pure validation for flagship hard errors, non-home warnings, duplicate display order, and checked-in registry validity.
- Updated `/` and `/projects` to render from `homeProjects`, `visibleProjects`, and `primaryProjectLink` while keeping the dark-first shell classes.

## Task Commits

1. **Task 1: Replace seed records with typed curated project stories**
   - `42563cf` test: add failing tests for curated project stories
   - `8a936ce` feat: implement curated project story registry
2. **Task 2: Add pure curation validation with hard errors and warnings**
   - `a4e6e01` test: add failing tests for curation validation
   - `663a4fc` feat: add pure project curation validation
3. **Task 3: Render curated selectors from current routes**
   - `0e3ca73` feat: render routes from curated project selectors

## Files Created/Modified

- `src/domain/projects.ts` - Curated project-story types, records, links, selectors, and primary-link helper.
- `src/domain/project-validation.ts` - Pure validation API returning structured errors and warnings.
- `src/domain/project-validation.test.ts` - Vitest coverage for flagship hard errors, non-home warnings, and registry validity.
- `src/domain/foundation.test.ts` - Updated foundation tests for curated selector ordering and corrected source links.
- `src/routes/index.tsx` - Home route now renders home project stories with authored copy and primary links.
- `src/routes/projects.tsx` - Project index now renders visible curated stories with role, status, maturity, tier, themes, tags, and primary links.

## Decisions Made

- Kept OpenLinks as one curated project card plus the existing footer identity link, matching the low-intrusion OpenLinks placement guidance.
- Treated `ProjectStory.links` as the reviewed source of project link truth and removed temporary raw `repo`, `href`, and `summary` compatibility fields after the route migration.
- Kept validation data-in/data-out and separate from route components so future scripts can reuse the same issue codes.

## Verification

- `bun run test -- src/domain/foundation.test.ts` failed in the Task 1 RED step as expected, then passed after implementation.
- `bun run test -- src/domain/project-validation.test.ts src/domain/foundation.test.ts` failed in the Task 2 RED step as expected, then passed after implementation.
- `bun run typecheck && bun run test` passed for Task 3.
- `bun run verify` passed.
- Browser verification ran against `http://localhost:3000/` and `/projects` in dark mode at desktop `1440x1000` and mobile `390x844`.
- Browser checks found dark root class/background, no horizontal overflow, no clipped text, no sibling overlap, no console errors/warnings/issues, and exactly one `OpenLinks` project-card heading on each checked route.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Kept Task 1 typecheck passing before route migration**
- **Found during:** Task 1 (Replace seed records with typed curated project stories)
- **Issue:** Replacing the old seed record shape before Task 3 would leave existing route consumers reading raw `repo`, `href`, and `summary` fields.
- **Fix:** Temporarily preserved route compatibility in the Task 1 registry implementation, then removed those raw fields once Task 3 migrated routes to `primaryProjectLink` and authored story fields.
- **Files modified:** `src/domain/projects.ts`, `src/routes/index.tsx`, `src/routes/projects.tsx`
- **Verification:** `bun run typecheck`, `bun run test`, and final `bun run verify` passed.
- **Committed in:** `8a936ce` and removed in `0e3ca73`

**Total deviations:** 1 auto-fixed (1 blocking).
**Impact on plan:** The final implementation matches the target curated model and selector-based route contract; no scope was added.

## Issues Encountered

None beyond the auto-fixed compatibility staging described above.

## User Setup Required

None - no external service configuration required.

## Known Stubs

None. Stub scan only found intentional empty arrays in test/helper initialization and validation issue accumulation.

## Next Phase Readiness

Phase 2 Plan 02 can build on the curated model to add the planned static/no-runtime-GitHub guards and static content verification without changing the route visual system.

## Self-Check: PASSED

- Verified all created and modified files listed in this summary exist.
- Verified task commits `42563cf`, `8a936ce`, `a4e6e01`, `663a4fc`, and `0e3ca73` exist in git history.
- Confirmed only `.planning/phases/02-curated-content-model/02-01-SUMMARY.md` remained untracked before the metadata commit.

---
*Phase: 02-curated-content-model*
*Completed: 2026-05-26*
