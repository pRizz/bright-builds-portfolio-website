---
phase: 25-deterministic-static-image-generation
plan: 02
subsystem: static-assets
tags: [social-preview, generator, cli, verification, package-scripts]

requires:
  - phase: 25-deterministic-static-image-generation
    provides: Plan 25-01 deterministic renderer helpers, path guards, manifest helpers, and check finding core.
provides:
  - Bun/TypeScript social preview generator CLI with generate mode and read-only check mode.
  - Package scripts for explicit generation and aggregate verification.
  - Aggregate `bun run verify` ordering that checks social previews before production build.
affects: [generated-social-images, release-verification, static-build-gate]

tech-stack:
  added: []
  patterns: ["thin imperative CLI shell around pure helpers", "read-only check mode", "managed static asset cleanup"]

key-files:
  created:
    - scripts/generate-social-previews.ts
  modified:
    - package.json

key-decisions:
  - "Use one Bun/TypeScript CLI for generation and check mode rather than dynamic routes, browser screenshots, hosted services, or Python."
  - "Validate `socialPreviewTargets()` before rendering, writing, cleanup, or check comparisons."
  - "Wire `verify:social-previews` before `bun run build` in the aggregate verify gate."

patterns-established:
  - "Generate mode writes only differing PNG bytes and removes only orphan managed PNG files."
  - "Check mode renders twice, reads metadata, compares manifest and files, and reports structured social preview findings."
  - "Package scripts keep generation explicit while making check mode part of release verification."

requirements-completed: [IMAGE-01, IMAGE-03, IMAGE-04, IMAGE-05]
generated_by: gsd-execute-plan
lifecycle_mode: yolo
phase_lifecycle_id: 25-2026-06-21T16-03-23
generated_at: 2026-06-21T17:01:10Z

duration: 9min
completed: 2026-06-21
---

# Phase 25 Plan 02 Summary

**Bun social preview generator CLI with read-only freshness checks and aggregate verify wiring**

## Performance

- **Duration:** 9 min
- **Started:** 2026-06-21T16:52:00Z
- **Completed:** 2026-06-21T17:01:10Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Added `scripts/generate-social-previews.ts` with generate mode and `--check` mode around the pure Plan 25-01 helpers.
- Added `generate:social-previews` and `verify:social-previews` package scripts.
- Inserted `bun run verify:social-previews` before `bun run build` in the aggregate `bun run verify` script.

## Task Commits

Each task was committed atomically:

1. **Task 1: Add generator and read-only check CLI shell** - `f0bfe59` (feat)
2. **Task 2: Add package scripts and aggregate verify ordering** - `001cf0e` (chore)

**Plan metadata:** this docs commit

## Files Created/Modified

- `scripts/generate-social-previews.ts` - Renders social preview targets, writes managed PNGs/manifests in generate mode, and verifies generated outputs in read-only check mode.
- `package.json` - Exposes `generate:social-previews`, `verify:social-previews`, and adds social preview checks before production build in aggregate verification.

## Decisions Made

- Kept the CLI as an imperative shell over existing helper modules so target derivation, SVG rendering, manifest serialization, path guarding, and finding classification remain shared and testable.
- Made `--check` render each target twice and compare first/second hashes to catch nondeterministic output before the build gate.
- Left actual generated PNG and manifest outputs to Plan 25-03, which means `verify:social-previews` is expected to fail until those artifacts are generated and committed.

## Deviations from Plan

None - plan executed exactly as written.

**Total deviations:** 0 auto-fixed.
**Impact on plan:** None.

## Issues Encountered

- Biome required import organization in the new CLI; imports were reordered and `bun run check` passed.

## Verification

All of these checks passed:

```bash
bun run test scripts/social-previews/social-previews.test.ts
bun run typecheck
bun run check
bun -e 'const pkg = JSON.parse(await Bun.file("package.json").text()); if (pkg.scripts["generate:social-previews"] !== "bun run scripts/generate-social-previews.ts") process.exit(1); if (pkg.scripts["verify:social-previews"] !== "bun run scripts/generate-social-previews.ts --check") process.exit(1); if (!pkg.scripts.verify.includes("bun run verify:visual-system && bun run verify:social-previews && bun run build")) process.exit(1);'
rg -n 'socialPreviewTargets\\(|validateSocialPreviewTargets\\(' scripts/generate-social-previews.ts
rg -n 'generatedSocialPreviewFilePathForAssetPath|managedSocialPreviewPngFiles' scripts/generate-social-previews.ts
rg -n 'serializeSocialPreviewManifest|socialPreviewManifestForRenderedPreviews' scripts/generate-social-previews.ts
```

The forbidden source-pattern guard returned no matches for fetch calls, remote URLs, clocks, randomness, environment reads, dynamic OG/API routes, or route API imports. No metadata, docs, static verifier, release verifier, or test files changed by this plan.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

The CLI and package gate are ready for 25-03 to generate, verify, and commit `public/social/generated/` PNG and manifest outputs.

---
*Phase: 25-deterministic-static-image-generation*
*Completed: 2026-06-21*
