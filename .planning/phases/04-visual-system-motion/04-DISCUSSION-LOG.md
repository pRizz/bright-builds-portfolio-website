# Phase 4: Visual System & Motion - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-26T17:24:32.941Z
**Phase:** 04-visual-system-motion
**Mode:** Yolo
**Areas discussed:** Bright Builds visual language, motion and reactivity, layout stability, accessibility fallbacks, adapters and boundaries

***

## Bright Builds Visual Language

| Option | Description | Selected |
|--------|-------------|----------|
| Polished technical dark-primary system | Improve hierarchy and visual depth while keeping content primary and dark rendering consistent. | yes |
| Marketing-style hero rewrite | Recompose the site into a landing page with large decorative hero treatment. | |
| Minimal static cleanup only | Keep the page mostly unchanged and only tune spacing/colors. | |

**User's choice:** Polished technical dark-primary system.
**Notes:** Auto-selected because the roadmap asks for a Bright Builds-inspired polished visual design while repo guidance requires dark-primary rendering, no template residue, and visual verification.

***

## Motion and Reactivity

| Option | Description | Selected |
|--------|-------------|----------|
| Restrained CSS/local Solid motion | Use subtle hover/focus/card response, optional pointer-reactive highlights, cleanup-aware local helpers, and reduced-motion fallbacks. | yes |
| Heavy physics or 3D scene | Add simulation/3D/WebGPU as a dominant visual feature. | |
| No motion beyond current transitions | Keep the existing transition layer and skip reactive polish. | |

**User's choice:** Restrained CSS/local Solid motion.
**Notes:** Auto-selected because Phase 4 asks for restrained reactive/physics effects but the project constraints reject motion that harms performance, accessibility, or mobile usability.

***

## Layout Stability

| Option | Description | Selected |
|--------|-------------|----------|
| Stability-first responsive polish | Add constrained dimensions, wrapping rules, touch targets, and mobile/desktop overlap checks. | yes |
| Desktop-first polish | Optimize the wide-screen look first and handle mobile later. | |
| Motion-first polish | Let animated behavior drive the layout and tune stability after. | |

**User's choice:** Stability-first responsive polish.
**Notes:** Auto-selected because `EXP-05` requires no text overlap, layout jumps, or hover-only access on desktop and mobile.

***

## Accessibility Fallbacks

| Option | Description | Selected |
|--------|-------------|----------|
| Verify reduced motion, keyboard, contrast, mobile, hidden-tab cleanup | Treat accessibility and reduced-motion checks as part of implementation, not a later release-only concern. | yes |
| Only rely on static build checks | Keep Phase 4 verification to `bun run verify`. | |
| Defer accessibility to Phase 5 | Leave all a11y verification to release checks. | |

**User's choice:** Verify reduced motion, keyboard, contrast, mobile, hidden-tab cleanup.
**Notes:** Auto-selected because `MOTION-03` and `MOTION-04` are Phase 4 requirements.

***

## Adapters and Boundaries

| Option | Description | Selected |
|--------|-------------|----------|
| Local UI/motion adapters | Keep domain modules pure and wrap Mystic/motion decisions behind project-owned UI helpers. | yes |
| Direct route-specific one-offs everywhere | Implement each visual behavior inline in route files. | |
| UI library internals in domain data | Let visual-library constraints shape core content models. | |

**User's choice:** Local UI/motion adapters.
**Notes:** Auto-selected because `MOTION-05` requires motion/UI utilities to stay isolated from the domain/content model.

## the agent's Discretion

- Exact class names, component boundaries, durations, easing, and asset treatment.
- Whether verification is implemented as an extension to `verify-static` or a separate focused browser script.
- Whether Mystic UI primitives are used directly, wrapped, or skipped based on compatibility.

## Deferred Ideas

- Heavy 3D/WebGPU/physics scenes.
- Per-project routes, per-project OG images, search/filtering, and GitHub metadata refresh.
- Full release visual-regression and Lighthouse/accessibility budget suite.
