---
phase: 29-archived-project-public-filter-guard
plan: 01
subsystem: domain
tags: [projects, social-previews, public-filtering, vitest]

# Dependency graph
requires:
  - phase: 24-social-image-data-contract
    provides: helper-derived social preview targets and public filtering contract
  - phase: 28-verification-and-release-contract
    provides: aggregate social preview, static, release, and full verification gates
provides:
  - Archived project status and maturity exclusion in the shared public project selector
  - Project detail route regression coverage for selected-looking archived project fixtures
  - Social preview target regression coverage for archived project status and maturity fixtures
  - Verification evidence closing SHARE-02, VERIFY-01, INT-01, and FLOW-01
affects: [social-previews, project-detail-routes, static-shareability, milestone-audit]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Shared selector-level visibility filtering
    - Helper-derived social preview target regression coverage

key-files:
  created:
    - .planning/phases/29-archived-project-public-filter-guard/29-01-SUMMARY.md
  modified:
    - src/domain/projects.ts
    - src/domain/project-detail-routes.test.ts
    - src/domain/portfolio-surfaces.test.ts
    - src/domain/social-previews.test.ts

key-decisions:
  - "Archived project status and archived project maturity are non-public at the shared project selector layer."
  - "Social preview target derivation remains downstream of projectDetailPageProjects(); no parallel archived-project guard was added to social-previews.ts."
  - "Generated social preview PNGs and manifest entries stayed unchanged because the default curated target set did not change."

patterns-established:
  - "Fixture coverage for public filtering should include selected-looking records where only the excluded field differs."
  - "Visibility fixes should land at the shared domain selector before downstream route, metadata, and generated asset helpers."

requirements-completed: [SHARE-02, VERIFY-01]
generated_by: gsd-execute-plan
lifecycle_mode: yolo
phase_lifecycle_id: 29-2026-06-23T02-40-50
generated_at: 2026-06-23T02:58:46Z

# Metrics
duration: 7 min
completed: 2026-06-23
---

# Phase 29: Archived Project Public Filter Guard Summary

**Archived project records are now rejected by the shared public project selector before they can become detail routes or social preview targets.**

## Performance

- **Duration:** 7 min
- **Started:** 2026-06-23T02:51:00Z
- **Completed:** 2026-06-23T02:58:46Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Added archived project `status` and archived project `maturity` exclusions to `isPublicProjectIndexProject()`.
- Added selected-looking archived project fixtures to project detail route, portfolio surface, and social preview target tests.
- Proved `socialPreviewTargets({ projects })` still inherits visibility from `projectDetailPageProjects()` without a duplicate archived-project guard.
- Verified generated social preview assets stayed stable: `bun run verify:social-previews` reported 13 deterministic PNGs and manifest entries, and `git status --short public/social/generated` had no output.
- Closed the audit gap IDs `SHARE-02`, `VERIFY-01`, `INT-01`, and `FLOW-01`.

## Task Commits

Each task was committed atomically:

1. **Task 1: Tighten the shared public project selector** - `6ce1380` (fix)
2. **Task 2: Guard the social preview target flow and release checks** - `019cea7` (test)

**Plan metadata:** `21ed7f1` (docs)

## Files Created/Modified

- `src/domain/projects.ts` - Rejects archived project status and maturity in the shared public project predicate.
- `src/domain/project-detail-routes.test.ts` - Verifies selected-looking archived projects do not become detail routes or slug-resolved detail records.
- `src/domain/portfolio-surfaces.test.ts` - Verifies archived project records are excluded from visible project surfaces and included in hidden/excluded records.
- `src/domain/social-previews.test.ts` - Verifies archived selected-looking projects do not create social preview target routes.
- `.planning/phases/29-archived-project-public-filter-guard/29-01-SUMMARY.md` - Records execution outcome and verification evidence.

## Decisions Made

- Keep archived project filtering in `src/domain/projects.ts` so detail routes, visible project surfaces, and social previews share one public selector.
- Do not regenerate social preview assets because the default curated target set remained unchanged.

## Deviations from Plan

None - plan executed exactly as written.

**Total deviations:** 0 auto-fixed.
**Impact on plan:** No scope change.

## Issues Encountered

None.

## Verification

Passed:

```bash
bun run test src/domain/project-detail-routes.test.ts src/domain/social-previews.test.ts src/domain/portfolio-surfaces.test.ts
bun run verify:social-previews
bun run verify:static
bun run verify:release
bun run verify
git status --short public/social/generated
```

Evidence:

- Targeted Vitest command: 3 files passed, 32 tests passed.
- `bun run verify:social-previews`: verified 13 deterministic social preview PNGs and manifest entries.
- `bun run verify:static`: verified 16 prerendered routes plus metadata, JSON-LD, social preview manifest, assets, sitemap, and robots.
- `bun run verify:release`: release verification passed with generated social preview PNG total `736.0 KB`.
- `bun run verify`: format, Biome check, TypeScript, 249 Vitest tests, curation, runtime GitHub guard, helper-surface guard, visual-system guard, social-preview check, build, browser checks, static verification, and release verification passed.
- `git status --short public/social/generated`: no output.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Phase 29 is ready for phase-level verification. The milestone audit blocker is addressed in code and tests; remaining work is to run the GSD verifier, mark requirements and roadmap state complete if verification passes, then finalize the strict push gate.

## Self-Check: PASSED

- Key files modified by the plan exist on disk.
- Task commits `6ce1380` and `019cea7` exist in git history.
- Summary names `SHARE-02`, `VERIFY-01`, `INT-01`, and `FLOW-01`.
- No generated social preview assets changed.

---
*Phase: 29-archived-project-public-filter-guard*
*Completed: 2026-06-23*
