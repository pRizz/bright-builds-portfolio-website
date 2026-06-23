---
phase: 25-deterministic-static-image-generation
plan: 03
subsystem: static-assets
tags: [social-preview, generated-assets, manifest, deterministic-output, release-gate]

requires:
  - phase: 25-deterministic-static-image-generation
    provides: Plan 25-02 generator/check CLI and package script wiring.
provides:
  - Checked-in generated social preview PNG assets for all current social preview targets.
  - Checked-in timestamp-free manifest for generated social preview assets.
  - Passing social preview, unit, build, browser, static, and release verification gates.
affects: [metadata-wiring, static-shareability, release-verification]

tech-stack:
  added: []
  patterns: ["checked-in generated media from deterministic CLI", "rerun-stable generated output", "aggregate verify before build"]

key-files:
  created:
    - public/social/generated/manifest.json
    - public/social/generated/projects/
    - public/social/generated/themes/
    - public/social/generated/writing/
  modified:
    - scripts/release-readiness.test.ts

key-decisions:
  - "Commit generated social preview PNGs and manifest under public/social/generated/ so the static build can serve them without visitor-runtime rendering."
  - "Keep the fallback social image outside generated ownership and verify it remains present after generation."
  - "Update release-readiness unit coverage so the aggregate verify script contract includes read-only social preview verification before build."

patterns-established:
  - "Generated social preview outputs are reviewed, checked in, and proven stable by generate/check/diff."
  - "Manifest asset paths must equal socialPreviewTargets() asset paths."
  - "Full repo verification now includes social preview checks before production build."

requirements-completed: [IMAGE-01, IMAGE-02, IMAGE-03, IMAGE-04, IMAGE-05]
generated_by: gsd-execute-plan
lifecycle_mode: yolo
phase_lifecycle_id: 25-2026-06-21T16-03-23
generated_at: 2026-06-21T17:05:31Z

duration: 14min
completed: 2026-06-21
---

# Phase 25 Plan 03 Summary

**Checked-in deterministic social preview PNGs and manifest with full repo verification passing**

## Performance

- **Duration:** 14 min
- **Started:** 2026-06-21T16:51:30Z
- **Completed:** 2026-06-21T17:05:31Z
- **Tasks:** 3
- **Files modified:** 15

## Accomplishments

- Generated and committed exactly 13 1200x630 social preview PNGs plus `public/social/generated/manifest.json`.
- Proved `verify:social-previews` passes, repeated generation is stable, and manifest paths equal `socialPreviewTargets()` output.
- Ran and passed the full aggregate `bun run verify` gate with social preview checks before build.

## Task Commits

Each task was committed atomically:

1. **Task 1: Generate managed PNG and manifest outputs** - `4a689ac` (feat)
2. **Task 2: Verify generated output determinism and asset confinement** - no code commit; verification-only task left the worktree clean
3. **Task 3: Run final Phase 25 verification gates** - `d3ad177` (test deviation fix)

**Plan metadata:** this docs commit

## Files Created/Modified

- `public/social/generated/manifest.json` - Sorted timestamp-free manifest for all generated previews.
- Project PNG outputs under `public/social/generated/projects/` - Projects index and project-detail social preview PNGs.
- Writing PNG outputs under `public/social/generated/writing/` - Writing index and writing-detail social preview PNGs.
- Theme PNG outputs under `public/social/generated/themes/` - Themes index and theme-detail social preview PNGs.
- `scripts/release-readiness.test.ts` - Updates aggregate verify script expectation to include read-only social preview verification before build.

## Decisions Made

- Generated outputs remain checked in under `public/social/generated/`, while the fallback `public/social/bright-builds-og.png` remains outside generated ownership.
- Kept Plan 25-03 source changes limited to a release-readiness test expectation because the full unit suite exposed a stale verification contract after Plan 25-02 changed `package.json`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Updated stale aggregate verify script test**
- **Found during:** Task 3 (Run final Phase 25 verification gates)
- **Issue:** `scripts/release-readiness.test.ts` expected the old aggregate `verify` script without `bun run verify:social-previews`, causing `bun run test` to fail after Plan 25-02 intentionally inserted the read-only social preview check before build.
- **Fix:** Updated the expected verify string and added an assertion that `bun run generate:social-previews` is not hidden inside aggregate verification.
- **Files modified:** `scripts/release-readiness.test.ts`
- **Verification:** `bun run test`, `bun run format:check`, `bun run check`, `bun run typecheck`, and `bun run verify` pass.
- **Committed in:** `d3ad177`

**Total deviations:** 1 auto-fixed (Rule 1 - Bug).
**Impact on plan:** The test update aligned release-readiness coverage with the intentional package script contract. No generated output ownership changed.

## Issues Encountered

- Full unit tests initially failed on the stale aggregate verify expectation; the deviation above resolved it.

## Verification

All of these checks passed:

```bash
bun run generate:social-previews
test -f public/social/generated/manifest.json
test "$(find public/social/generated -type f -name '*.png' | wc -l | tr -d ' ')" = "13"
bun -e 'const manifest = JSON.parse(await Bun.file("public/social/generated/manifest.json").text()); if (manifest.version !== 1 || manifest.entries.length !== 13) process.exit(1); for (const entry of manifest.entries) { if (!entry.routePath || !entry.assetPath || entry.dimensions.width !== 1200 || entry.dimensions.height !== 630 || !entry.byteSize || !/^[a-f0-9]{12}$/.test(entry.sourceFingerprint) || !/^[a-f0-9]{64}$/.test(entry.sha256)) process.exit(1); }'
bun run verify:social-previews
bun run generate:social-previews
bun run verify:social-previews
git diff --exit-code -- public/social/generated
bun -e 'import { socialPreviewTargets } from "./src/domain/social-previews.ts"; const manifest = JSON.parse(await Bun.file("public/social/generated/manifest.json").text()); const targetPaths = socialPreviewTargets().map((target) => target.assetPath).sort(); const manifestPaths = manifest.entries.map((entry) => entry.assetPath).sort(); if (JSON.stringify(targetPaths) !== JSON.stringify(manifestPaths)) process.exit(1);'
test -f public/social/bright-builds-og.png
bun run test scripts/social-previews/social-previews.test.ts
bun run format:check
bun run check
bun run typecheck
bun run test
bun run verify
```

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Phase 26 can now wire metadata to reviewed static generated social preview assets under `public/social/generated/`.

---
*Phase: 25-deterministic-static-image-generation*
*Completed: 2026-06-21*
