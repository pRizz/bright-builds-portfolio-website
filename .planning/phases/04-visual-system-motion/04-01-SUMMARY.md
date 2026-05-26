---
phase: 04-visual-system-motion
plan: 01
subsystem: visual-system
tags: [solidjs, tailwind, dark-ui, responsive-layout, openlinks, local-assets]

requires:
  - phase: 03-portfolio-surfaces-seo
    provides: "Static portfolio routes, route metadata, JSON-LD, public SEO assets, stable project anchors, and low-intrusion OpenLinks placement."
provides:
  - "Shared dark-primary visual primitives for route stages, local brand material, surfaces, links, cards, chips, focus states, and reduced-motion-compatible transitions."
  - "Home route with decorative local Bright Builds brand material and preserved identity-first content, Browse projects CTA, Now building panel, metadata, and JSON-LD."
  - "Projects, about, and contact surfaces using stable responsive visual primitives while preserving project anchors, profile links, and route semantics."
affects: [04-02-motion, 04-03-verification, phase-5-release-verification, static-verification]

tech-stack:
  added: []
  patterns:
    - "CSS-first visual system in `src/styles/app.css`; no runtime motion libraries or domain-module UI concerns."
    - "Decorative local image treatment uses `/social/bright-builds-og.png` as low-opacity background material with `aria-hidden` route markup."
    - "Interactive surfaces pair hover and keyboard focus states through shared classes with stable dimensions and text wrapping."

key-files:
  created: []
  modified:
    - src/styles/app.css
    - src/components/SiteLayout.tsx
    - src/routes/index.tsx
    - src/routes/projects.tsx
    - src/routes/about.tsx
    - src/routes/contact.tsx

key-decisions:
  - "Keep Phase 04 Plan 01 CSS-first: no new dependencies, runtime motion libraries, 3D, physics, WebGPU, remote assets, or `src/domain/*` changes."
  - "Use the checked-in Bright Builds social image only as subtle brand material behind live semantic home content, not as a literal screenshot card."
  - "Preserve OpenLinks as low-intrusion footer/about/contact identity placement while keeping Bright Builds, GitHub, and project CTAs primary."

patterns-established:
  - "`visual-stage`, `visual-surface`, `interactive-surface`, `surface-link`, and `brand-material` are the shared Phase 04 visual hooks."
  - "Cards, chips, labels, links, nav, and footer copy use constrained grids, `min-width: 0`, and `overflow-wrap: anywhere` for narrow viewport stability."
  - "Task verification keeps visual-system work in route/component/CSS layers and validates no forbidden runtime motion dependencies were added."

requirements:
  - EXP-05
  - MOTION-01
  - MOTION-05
requirements-completed:
  - EXP-05
  - MOTION-01
  - MOTION-05
generated_by: gsd-execute-plan
lifecycle_mode: yolo
phase_lifecycle_id: 4-2026-05-26T17-22-53
generated_at: 2026-05-26T18:28:22Z

duration: 9min
completed: 2026-05-26
---

# Phase 04 Plan 01: Visual System Primitives Summary

**Dark-primary Bright Builds visual primitives with local brand material, stable responsive surfaces, and preserved Phase 03 route semantics**

## Performance

- **Duration:** 9 min
- **Started:** 2026-05-26T18:19:29Z
- **Completed:** 2026-05-26T18:28:22Z
- **Tasks:** 3
- **Files modified:** 6

## Accomplishments

- Added shared Phase 04 CSS hooks for route composition, low-opacity local brand material, visual/interactive surfaces, surface links, wrapping chips, stable grids, focus rings, and reduced-motion-compatible transitions.
- Updated the home route so the first viewport keeps live identity copy, the `Browse projects` CTA, and the `Now building` panel while adding an `aria-hidden` local brand-material treatment.
- Applied shared visual primitives to the layout footer/header, home story cards, project cards, about theme cards, and contact cards without changing route metadata, JSON-LD, project anchors, OpenLinks placement, or domain modules.

## Task Commits

Each task was committed atomically:

1. **Task 1: Establish dark-primary visual primitives and local brand material** - `3feb905` (feat)
2. **Task 2: Apply the visual shell to layout and home surfaces** - `73a8d9c` (feat)
3. **Task 3: Stabilize project, about, and contact responsive surfaces** - `bdc42f2` (feat)

**Plan metadata:** committed separately after summary and state updates.

## Files Created/Modified

- `src/styles/app.css` - Shared visual-stage, brand-material, surface, link, grid, chip, focus, touch-target, wrapping, hover/focus, and reduced-motion-compatible primitives.
- `src/components/SiteLayout.tsx` - Header/nav/footer class hooks with the existing single `OpenLinks profile` footer identity link preserved.
- `src/routes/index.tsx` - Home visual composition with `aria-hidden` local brand material, polished CTA/focus rows/story cards, and preserved metadata/JSON-LD wiring.
- `src/routes/projects.tsx` - Project notices, empty state, stable anchor cards, and project links using shared visual primitives.
- `src/routes/about.tsx` - About OpenLinks identity link and theme cards using shared surface/focus treatment.
- `src/routes/contact.tsx` - Profile-derived contact cards using shared interactive surface treatment and wrapping URLs.

## Decisions Made

- Followed the CSS-first plan and did not add dependencies, runtime animation utilities, pointer listeners, timers, observers, or new UI helper modules.
- Kept all Phase 04 visual work out of `src/domain/*`; route components still consume existing pure project/profile/SEO helpers.
- Treated the Vite public asset warning for `url("/social/bright-builds-og.png")` as acceptable because the file is checked in under `public/`, build output and static verification passed, and the path resolves as a public asset at runtime.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Formatted the project route link markup**
- **Found during:** Task 3 (Stabilize project, about, and contact responsive surfaces)
- **Issue:** `bun run format:check` failed after adding the `surface-link` class to project links because Biome required multiline JSX attributes.
- **Fix:** Rewrapped the project link JSX without changing behavior.
- **Files modified:** `src/routes/projects.tsx`
- **Verification:** Re-ran `bun run format:check && bun run check && bun run typecheck && bun run test && bun run build && bun run verify:static`.
- **Committed in:** `bdc42f2`

---

**Total deviations:** 1 auto-fixed (1 blocking issue)
**Impact on plan:** Formatting fix only. No architecture change, dependency addition, domain change, or scope expansion.

## Issues Encountered

- `vinxi build` reports that `/social/bright-builds-og.png` remains unresolved at build time and will resolve at runtime. This is the expected public-asset behavior for the checked-in absolute path; all build and static verification gates passed.
- Browser screenshot capture timed out during the optional smoke pass. DOM-based browser checks completed, the temporary viewport override was reset, and the dev server was stopped.
- `roadmap update-plan-progress` reported success but left the Phase 4 `TBD` roadmap rows unchanged, so the Phase 4 plan count and progress table were updated directly in the final metadata changes.

## Verification

- Task acceptance greps passed for visual hooks, local asset references, forbidden visual motifs/classes, no runtime motion dependencies, home data wiring, OpenLinks footer placement, metadata/JSON-LD wiring, project anchors, text wrapping, focus primitives, about/contact copy, and no template/runtime-GitHub residue.
- Per-task gates passed after each task: `bun run format:check && bun run check && bun run typecheck && bun run test && bun run build && bun run verify:static`.
- Plan-level gate passed: `bun run format:check && bun run check && bun run typecheck && bun run build && bun run verify:static && bun run verify`.
- `bun run verify` passed: format, Biome check, typecheck, Vitest (`3` files, `31` tests), curation verifier, no-runtime-GitHub verifier, production build, and static verifier.
- Browser smoke pass at `http://127.0.0.1:3000/` covered `/`, `/projects`, `/about`, and `/contact` at default desktop, `390x844`, and `320x844`: `.dark` root present, body background `rgb(5, 6, 8)`, no horizontal overflow, no offscreen visible elements, no clipped visible text, no undersized visible link targets, no console issues, and home brand material visible.

## Known Stubs

None. Stub-pattern scan found no `TODO`, `FIXME`, placeholder copy, coming-soon copy, unavailable-data copy, hardcoded empty UI data, or unwired mock data in files touched by this plan.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Phase 04 Plan 02 can build any restrained motion/reactivity on top of the CSS hooks established here. Browser smoke used the in-app browser's default desktop viewport plus mobile overrides; the full Phase 04 visual verifier plan should still provide the planned 1440px screenshot-level evidence.

## Self-Check: PASSED

- Verified summary and all touched source files exist.
- Verified task commits exist in git history: `3feb905`, `73a8d9c`, and `bdc42f2`.
- Verified required lifecycle fields and copied requirement IDs are present in summary frontmatter.
- Verified the local dev server was stopped after browser checks.

***
*Phase: 04-visual-system-motion*
*Completed: 2026-05-26*
