---
phase: 18-static-verifier-modularization
plan: 01
generated_by: gsd-execute-plan
lifecycle_mode: yolo
phase_lifecycle_id: 18-2026-06-16T00-44-32
generated_at: 2026-06-16T01:28:14Z
subsystem: verification
tags:
  - static-verification
  - writing
  - metadata
  - json-ld
  - vitest

requires:
  - phase: 17-writing-verification-and-release-contract
    provides: Writing route release evidence and static verifier success wording
provides:
  - Thin `scripts/verify-static.ts` CLI entrypoint for the existing `verify:static` script
  - Focused static verifier modules for route text, HTML, metadata/JSON-LD, output files, sitemap, assets, and robots checks
  - Import-safe Vitest coverage for helper seams, derived route coverage, unsafe hrefs, remote srcset guards, and static verifier summary wording
affects:
  - v1.3 release gate
  - static verifier maintainability
  - writing route verification
  - project detail verification

tech-stack:
  added: []
  patterns:
    - "Thin CLI entrypoint delegates to an import-safe runner guarded by import.meta.main."
    - "Generated-output reads stay inside explicit verifier functions, not module scope."
    - "Route, writing, project, metadata, sitemap, and robots expectations remain helper-derived from src/domain/*."

key-files:
  created:
    - .planning/phases/18-static-verifier-modularization/18-01-SUMMARY.md
    - .planning/phases/18-static-verifier-modularization/18-REVIEW.md
    - scripts/verify-static/types.ts
    - scripts/verify-static/config.ts
    - scripts/verify-static/html-assertions.ts
    - scripts/verify-static/output.ts
    - scripts/verify-static/expected-route-text.ts
    - scripts/verify-static/route-html-verifier.ts
    - scripts/verify-static/metadata-jsonld-verifier.ts
    - scripts/verify-static/sitemap-assets-verifier.ts
    - scripts/verify-static/run-static-verification.ts
    - scripts/verify-static.test.ts
  modified:
    - scripts/verify-static.ts

key-decisions:
  - "Kept `scripts/verify-static.ts` as the unchanged package-script entrypoint and reduced it to a five-line CLI shim."
  - "Moved verifier ownership by concern rather than by phase history so future writing/project assertions have local homes."
  - "Preserved helper-derived route/content/metadata coverage and avoided copied writing or project route fixture lists."
  - "Fixed the remote visual asset guard to catch mixed local/remote `img` and `source` `srcset` candidates."

patterns-established:
  - "Use `staticVerificationSummary()` as the single source for release evidence wording that includes `writing route coverage`."
  - "Keep output traversal helpers dependency-free and explicit about static output roots."
  - "Unit-test pure/import-safe verifier seams, while proving generated output through `bun run build`, `bun run verify:static`, and `bun run verify`."

requirements-completed:
  - MAINT-01
duration: 16 min
completed: 2026-06-16
---

# Phase 18 Plan 01: Static Verifier Modularization Summary

**Static verifier split into import-safe concern modules while preserving generated-output release coverage**

## Performance

- **Duration:** 16 min
- **Started:** 2026-06-16T01:12:00Z
- **Completed:** 2026-06-16T01:28:14Z
- **Tasks:** 3
- **Files modified:** 13

## Accomplishments

- Reduced `scripts/verify-static.ts` from 1,180 lines to a five-line CLI entrypoint that only imports and calls `runStaticVerification()` behind `if (import.meta.main)`.
- Split static verification into focused repo-owned TypeScript modules for contracts, config, HTML assertions, output traversal, expected route text, route HTML checks, metadata/JSON-LD checks, sitemap/assets/robots checks, and orchestration.
- Preserved helper-derived writing and project route coverage from `src/domain/*` helpers without copied slug or route fixture lists.
- Added focused Vitest coverage for import-safe helpers, derived route coverage, unsafe href guards, remote `srcset` visual asset guards, and exact `writing route coverage` evidence wording.
- Ran standard GSD code review; the first warning was fixed and the final review is clean.

## Task Commits

Task implementation commits were intentionally deferred to the wrapper-owned final commit/push gate so no implementation commit is created unless phase verification and lifecycle checks pass.

1. **Task 1: Create import-safe verifier contracts, utilities, and tests** - pending wrapper final commit
1. **Task 2: Extract route, writing, project, metadata, JSON-LD, sitemap, assets, and robots verifiers** - pending wrapper final commit
1. **Task 3: Thin the CLI entrypoint and prove the full release gate** - pending wrapper final commit

## Files Created/Modified

- `.planning/phases/18-static-verifier-modularization/18-01-SUMMARY.md` - Execution summary and verification evidence.
- `.planning/phases/18-static-verifier-modularization/18-REVIEW.md` - Standard-depth clean code review artifact.
- `scripts/verify-static.ts` - Thin CLI entrypoint for the existing `verify:static` package script.
- `scripts/verify-static/types.ts` - Shared verifier contracts.
- `scripts/verify-static/config.ts` - Static output constants, writing fallback source path, and generated-output forbidden patterns.
- `scripts/verify-static/html-assertions.ts` - Import-safe HTML, escaping, JSON-LD, and forbidden-text assertions.
- `scripts/verify-static/output.ts` - Static output traversal, route HTML resolution, file equality, and PNG dimension helpers.
- `scripts/verify-static/expected-route-text.ts` - Helper-derived route expected text and writing/project route classification.
- `scripts/verify-static/route-html-verifier.ts` - Shell, route body, GitHub metadata, and per-route forbidden-output assertions.
- `scripts/verify-static/metadata-jsonld-verifier.ts` - Route, project, writing metadata and JSON-LD assertions.
- `scripts/verify-static/sitemap-assets-verifier.ts` - Sitemap, robots, static asset, remote asset, reduced-motion, writing exclusion, and full-output residue checks.
- `scripts/verify-static/run-static-verification.ts` - Static verifier orchestration and success summary wording.
- `scripts/verify-static.test.ts` - Focused Vitest tests for pure/import-safe verifier seams.

## Decisions Made

- Kept the package-script contract unchanged: `verify:static` still runs `bun run scripts/verify-static.ts`.
- Kept generated-output I/O in explicit functions so Vitest can import verifier modules without requiring `.output/public`.
- Kept route, writing, project, metadata, JSON-LD, sitemap, and robots assertions derived from domain helpers to avoid content drift.
- Kept release-readiness docs, release labels, browser tests, package scripts, dependencies, OpenLinks placement, visitor routes, and content registries unchanged.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Remote `srcset` asset guard gap**

- **Found during:** Code review after Task 3
- **Issue:** The remote visual asset guard did not catch mixed local/remote `img srcset` candidates and only matched `source srcset` when a remote URL started the attribute value.
- **Fix:** Updated `assertNoRemoteRuntimeVisualAssets()` to scan full `img` and `source` `srcset` attribute values for remote candidates, then added a temp-file regression test.
- **Files modified:** `scripts/verify-static/sitemap-assets-verifier.ts`, `scripts/verify-static.test.ts`
- **Verification:** `bun run test scripts/verify-static.test.ts`, `bun run typecheck`, `bun run build`, `bun run verify:static`, clean re-review, and final `bun run verify`.
- **Committed in:** pending wrapper final commit

**Total deviations:** 1 auto-fixed bug
**Impact on plan:** Strengthened an existing site-wide remote visual asset assertion without changing visitor-facing behavior or release claims.

## Issues Encountered

None remaining. Biome import-order assists were applied before the final aggregate verification pass.

## Verification

- `bun run test scripts/verify-static.test.ts` - passed, 10 tests
- `bun run typecheck` - passed
- `bun run build` - passed, 13 routes prerendered
- `bun run verify:static` - passed and printed `Verified 13 prerendered routes, metadata, JSON-LD, writing route coverage, assets, sitemap, and robots in .output/public.`
- `bun run verify` - passed: format/check, typecheck, 151 Vitest tests, curation, GitHub runtime guard, project helper surface, visual system, build, Playwright browser release checks, static verifier, and release verifier
- Standard code review - clean after the remote `srcset` guard fix

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Phase 18 is ready for phase-level verification and milestone audit rerun. The static verifier is now below the Bright Builds large-file trigger as a thin entrypoint, and future writing/project assertion additions can land in focused modules.

## Self-Check: PASSED

- Confirmed `scripts/verify-static.ts` is five lines and delegates only through `runStaticVerification()`.
- Confirmed no module-level `.output/public` reads or `findStaticOutputRoot()` calls exist in verifier modules.
- Confirmed no package, release-readiness, browser-test, domain helper, content, SEO semantic, dependency, or OpenLinks placement files changed.
- Confirmed helper-derived writing/project coverage and the exact `writing route coverage` evidence wording are tested.
- Confirmed full aggregate verification passed after the review-driven bug fix.

*Phase: 18-static-verifier-modularization*
*Completed: 2026-06-16*
