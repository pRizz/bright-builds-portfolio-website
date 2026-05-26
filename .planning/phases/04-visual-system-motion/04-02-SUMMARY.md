---
phase: 04-visual-system-motion
plan: 02
subsystem: visual-system-motion
tags: [solidjs, tailwind, motion-gates, reduced-motion, accessibility, cleanup]

requires:
  - phase: 04-visual-system-motion
    plan: 01
    provides: "Dark-primary visual primitives, local brand material, stable route surfaces, and Phase 03 semantic/SEO contract preservation."
provides:
  - "Deterministic pure decorative-motion gate for reduced motion, pointer, viewport, visibility, and save-data capability checks."
  - "Cleanup-safe Solid ReactiveSurface helper that owns optional pointer CSS custom property updates behind the pure gate."
  - "Restrained reactive-card CSS and route wiring for home focus/story surfaces and project cards without domain-module coupling."
affects: [04-03-verification, phase-5-release-verification, visual-system, accessibility]

tech-stack:
  added: []
  patterns:
    - "Pure UI helper in src/components/visual-motion.ts remains data-in/data-out and unit tested."
    - "ReactiveSurface is the only Solid lifecycle shell for Phase 04 motion and cleans up listener/RAF work."
    - "Route layers opt into non-essential reactive polish by wrapping existing semantic content without changing anchors or metadata."

key-files:
  created:
    - src/components/visual-motion.ts
    - src/components/visual-motion.test.ts
    - src/components/ReactiveSurface.tsx
  modified:
    - src/styles/app.css
    - src/routes/index.tsx
    - src/routes/projects.tsx

key-decisions:
  - "Keep motion UI-only: no src/domain/* changes, no new dependencies, no runtime animation library, no physics/3D/WebGPU, and no route/page transitions."
  - "Gate decorative pointer work at mount with the pure helper before adding listeners or RAF work."
  - "Use route-level ReactiveSurface wrappers around non-essential surface groups so static content and focus order remain intact."
  - "Preserve low-intrusion OpenLinks placement from Phase 03/Plan 01; no new OpenLinks promotion was added."

patterns-established:
  - "`canRunDecorativeMotion` is the deterministic capability gate for any future non-essential visual motion."
  - "`ReactiveSurface` owns browser capability reads, pointermove, visibilitychange, RAF writes, and cleanup in one UI-focused module."
  - "`.reactive-card` pairs pointer-capable hover polish with focus-within/focus-visible and reduced/coarse/small viewport fallbacks."

requirements:
  - EXP-05
  - MOTION-02
  - MOTION-03
  - MOTION-04
  - MOTION-05
requirements-completed:
  - EXP-05
  - MOTION-02
  - MOTION-03
  - MOTION-04
  - MOTION-05
generated_by: gsd-execute-plan
lifecycle_mode: yolo
phase_lifecycle_id: 4-2026-05-26T17-22-53
generated_at: 2026-05-26T18:40:16Z

duration: 7min
completed: 2026-05-26
---

# Phase 04 Plan 02: Reactive Motion Gates Summary

**Pure reduced-motion capability gates plus a cleanup-safe Solid pointer surface for restrained project/card polish**

## Performance

- **Duration:** 7 min
- **Started:** 2026-05-26T18:33:05Z
- **Completed:** 2026-05-26T18:40:16Z
- **Tasks:** 3
- **Files modified:** 6

## Accomplishments

- Added `canRunDecorativeMotion` and exact media-query constants with Vitest coverage for reduced motion, fine pointer, viewport, visibility, and save-data conditions.
- Added `ReactiveSurface` as the single Phase 04 Solid motion shell, with capability reads in `onMount`, one pointer listener, one visibility listener, one pending RAF handle, and `onCleanup` removal/cancelation.
- Added `.reactive-surface` and `.reactive-card` CSS with low-opacity pointer highlights, max `translateY(-2px)` card lift, keyboard focus parity, and reduced-motion/coarse-pointer/small-viewport fallbacks.
- Wired non-essential home current-focus, home story, and project-card groups through route-layer wrappers while preserving native anchors, metadata, JSON-LD, OpenLinks footer placement, and domain selectors.

## Task Commits

Each implementation task was committed atomically:

1. **Task 1: Add pure decorative-motion gates** - `ad9b4cd` (feat)
2. **Task 2: Create the single cleanup-safe ReactiveSurface helper** - `1820184` (feat)
3. **Task 3: Wire restrained reactive states to non-essential surfaces** - `e618af6` (feat)

**Plan metadata:** committed separately after summary and state updates.

## Files Created/Modified

- `src/components/visual-motion.ts` - Pure capability gate and exact media-query strings for decorative motion eligibility.
- `src/components/visual-motion.test.ts` - Focused Vitest coverage for enabled and disabled gate states plus exact query strings.
- `src/components/ReactiveSurface.tsx` - Solid lifecycle shell for gated pointer CSS variable writes and cleanup.
- `src/styles/app.css` - Reactive surface/card visual hooks, focus parity, and reduced/coarse/small viewport fallbacks.
- `src/routes/index.tsx` - Home route wrappers and reactive-card classes for current-focus and featured story surfaces.
- `src/routes/projects.tsx` - Project section wrapper and reactive-card class for project anchor cards.

## Decisions Made

- Followed the plan's no-dependency motion approach: no package changes, no runtime animation library, no physics/3D/WebGPU, no route/page transitions, no persistent timers, and no observers.
- Kept all motion logic in `src/components/*`, CSS, and route components. `src/domain/*` remains free of UI, DOM, Solid lifecycle, and motion imports.
- Used the OpenLinks identity-presence guidance only as a preservation constraint; the existing low-intrusion footer/about/contact/metadata contract remains unchanged.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Sorted the ReactiveSurface Solid import**
- **Found during:** Task 2 (Create the single cleanup-safe ReactiveSurface helper)
- **Issue:** `bun run check` failed because Biome required sorted imported names from `solid-js`.
- **Fix:** Reordered the import to `import { type JSX, onCleanup, onMount } from "solid-js";`.
- **Files modified:** `src/components/ReactiveSurface.tsx`
- **Verification:** Re-ran `bun run format:check && bun run check && bun run typecheck && bun run test -- src/components/visual-motion.test.ts`.
- **Committed in:** `1820184`

### Instruction-Driven Adjustments

**1. TDD RED commit was not created**
- **Reason:** The plan marked Task 1 `tdd="true"`, and the RED test failed as expected with `Cannot find module './visual-motion'`. Repo pre-commit rules require passing applicable checks before any commit, so the intentionally failing RED state was not committed.
- **Preserved evidence:** The failing RED command was run before implementation, then the helper was added and committed after checks passed.

---

**Total deviations:** 1 auto-fixed blocking issue; 1 instruction-driven TDD commit adjustment.
**Impact on plan:** Behavior and scope stayed aligned with the plan. The only code fix was formatting/import order; the TDD adjustment avoided committing a known failing state.

## Issues Encountered

- `vinxi build` continues to warn that `/social/bright-builds-og.png` will resolve at runtime. This warning was already documented in Plan 01, and build plus static verification passed.
- Local Bun is `1.3.9` while `packageManager` pins `bun@1.3.14`; `bun install --frozen-lockfile` checked 675 installs with no changes.

## Verification

- RED signal: `bun run test -- src/components/visual-motion.test.ts` failed before implementation because `./visual-motion` did not exist.
- Task 1: `bun run test -- src/components/visual-motion.test.ts && bun run typecheck` passed (`1` file, `7` tests), then repo pre-commit checks passed: `bun run format:check && bun run check && bun run typecheck && bun run test && bun run build`.
- Task 2: acceptance greps passed for lifecycle gates, cleanup paths, forbidden timers/observers/runtime libraries, CSS fallbacks, and lift/scale limits. After the import-order fix, `bun run format:check && bun run check && bun run typecheck && bun run test -- src/components/visual-motion.test.ts` passed, followed by the broader pre-commit gate.
- Task 3: acceptance greps passed for route-layer `ReactiveSurface` wiring, CSS hover/focus/device fallbacks, no domain motion coupling, no package motion dependencies, and preserved Phase 03/OpenLinks/static contract strings.
- Task 3 specified gate passed: `bun run format:check && bun run check && bun run typecheck && bun run test && bun run build && bun run verify:static`.
- Final aggregate gate passed: `bun run verify` completed format check, Biome check, typecheck, Vitest (`4` files, `38` tests), curation verification, no-runtime-GitHub verification, production build, and static verification.

## Known Stubs

None. Stub scan found no placeholder/TODO/FIXME/coming-soon/unavailable UI copy or hardcoded empty UI data in files touched by this plan. Matches for `= null` were the intentional internal `maybeFrame` RAF-handle state, not UI stubs.

## Threat Flags

None. New browser capability and pointer-event surfaces match the plan threat model, are UI-only, send no data over the network, and do not mutate content, hrefs, domain values, or layout dimensions.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Phase 04 Plan 03 can verify browser behavior for reduced motion, keyboard/focus parity, mobile viewports, overlap/overflow, and cleanup evidence against the route wiring added here.

## Self-Check: PASSED

- Verified summary and all created source files exist.
- Verified task commits exist in git history: `ad9b4cd`, `1820184`, and `e618af6`.
- Verified required lifecycle fields and copied requirement IDs are present in summary frontmatter.

***
*Phase: 04-visual-system-motion*
*Completed: 2026-05-26*
