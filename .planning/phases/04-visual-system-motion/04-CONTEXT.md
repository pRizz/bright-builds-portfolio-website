---
generated_by: gsd-discuss-phase
lifecycle_mode: yolo
phase_lifecycle_id: 4-2026-05-26T17-22-53
generated_at: 2026-05-26T17:24:32.941Z
---

# Phase 4: Visual System & Motion - Context

**Gathered:** 2026-05-26
**Status:** Ready for planning
**Mode:** Yolo

<domain>

## Phase Boundary

Phase 4 upgrades the Phase 3 static portfolio surfaces into a polished Bright Builds-inspired visual and interaction system. The work should improve visual hierarchy, responsive stability, accessible motion fallbacks, and restrained reactive effects around non-essential surfaces without changing the curated content model, adding runtime GitHub calls, creating a CMS, or taking on release-wide GitHub enrichment.

This phase may adjust route markup, shared styles, local UI helpers, static visual assets, and focused browser verification. It should not add backend services, analytics, search/filtering, per-project routes, per-project OG generation, or heavy 3D/WebGPU scenes.

</domain>

<decisions>

## Implementation Decisions

### Bright Builds Visual Language

- **D-01:** Keep the site dark-primary and identity-first. The visual upgrade should feel like a polished successor to Bright Builds: crisp, technical, high-contrast, playful in small touches, and grounded in Peter's actual project narrative.
- **D-02:** Avoid generic designer-template motifs, fake portfolio case-study styling, decorative gradient orbs, one-note purple/slate palettes, and oversized marketing composition. Use restrained color contrast across emerald/cyan/neutrals with small secondary accents only where they improve scanning.
- **D-03:** Use visual assets in the real product surface. Prefer existing checked-in Bright Builds/OpenGraph assets or new local bitmap/project-mark assets over stock imagery. Any decorative asset must be non-blocking, local, optimized, and not obscure the content.
- **D-04:** Keep OpenLinks low-intrusion. Visual polish may refine footer/about/contact/profile treatment, but OpenLinks stays a visible identity link and sameAs signal, not the primary CTA or repeated hero promotion.

### Motion and Reactivity

- **D-05:** Motion should be restrained and content-supportive: short hover/focus transitions, subtle project-card lift or border response, optional pointer-reactive highlight fields, and route-stable ambient details are in scope.
- **D-06:** Avoid heavy simulation, autoplay distraction, scroll-jacking, and motion that changes layout. No Matter.js/Rapier/Three.js/WebGPU unless planning proves a tiny isolated effect is necessary; default to CSS and small local Solid utilities.
- **D-07:** All non-essential motion must disable or collapse under `prefers-reduced-motion: reduce`. The reduced-motion behavior must be verified in a real browser and should preserve the existing `:root *` cascade approach unless a cleaner local adapter proves it.
- **D-08:** Hidden-tab, low-power, and mobile constraints matter. Pointer listeners, timers, animation frames, observers, and effects must clean up on unmount and avoid work when the page is inactive or motion is reduced.

### Layout Stability and Responsive Interaction

- **D-09:** Prioritize stable desktop and mobile layouts over novelty. Cards, counters, tool surfaces, nav rows, labels, chips, and buttons need fixed or constrained dimensions where dynamic text could cause shifts.
- **D-10:** Verify no incoherent text overlap, no horizontal overflow, and readable contrast on desktop, 390px mobile, and 320px mobile dark rendering. Hover-only affordances must have keyboard/touch equivalents.
- **D-11:** Preserve semantic static HTML and meaningful content before hydration. Visual wrappers should not hide headings, route copy, anchors, contact links, or structured data.

### Adapters and Boundaries

- **D-12:** Keep domain modules pure. Motion state, pointer handling, visual-system helpers, and Mystic/local UI adapters belong in UI-focused modules or route/component layers, never in `src/domain/*`.
- **D-13:** Prefer local adapters over leaking UI-library internals. If Mystic UI primitives are useful and compatible, wrap them through project-owned components or style helpers; do not deep-import unsupported Mystic workspace paths.
- **D-14:** Add focused tests for pure visual configuration or utility decisions when they exist, and rely on browser/static verification for actual layout, reduced-motion, focus, and contrast behavior.

### the agent's Discretion

- The agent may choose exact component names, CSS class names, animation durations, and easing values if they satisfy the accessibility and dark-primary constraints.
- The agent may decide whether to introduce a small visual-system data module, local Solid component primitives, or CSS-only utilities based on what removes duplication.
- The agent may choose the exact visible visual asset treatment, provided it is local, optimized, content-aligned, and verified on desktop and mobile.
- The agent may broaden `scripts/verify-static.ts` or add a new browser verification script if that gives a reliable regression guard without bloating routine checks.

</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Planning

- `.planning/PROJECT.md` - project vision, constraints, key decisions, and Bright Builds motion/style intent.
- `.planning/REQUIREMENTS.md` - Phase 4 requirements `EXP-05`, `MOTION-01`, `MOTION-02`, `MOTION-03`, `MOTION-04`, and `MOTION-05`.
- `.planning/ROADMAP.md` - Phase 4 goal and success criteria.
- `.planning/STATE.md` - current project state and prior decisions.

### Prior Phase Context

- `.planning/phases/01-static-app-foundation-ui-shell/01-CONTEXT.md` - SolidStart, Bun, Tailwind, Mystic UI, and pure-core decisions.
- `.planning/phases/01.1-dark-primary-visual-rule-and-shell-refactor/01.1-CONTEXT.md` - dark-primary shell and visual-rule decisions.
- `.planning/phases/02-curated-content-model/02-CONTEXT.md` - curated registry, validation, static GitHub boundary, and OpenLinks decisions.
- `.planning/phases/03-portfolio-surfaces-seo/03-CONTEXT.md` - portfolio route, OpenLinks, SEO, static asset, and visual-polish deferral decisions.
- `.planning/phases/03-portfolio-surfaces-seo/03-VERIFICATION.md` - current verified Phase 3 behavior and residual visual verification context.

### Existing Source

- `src/components/SiteLayout.tsx` - shared nav, footer, OpenLinks footer placement, and shell structure.
- `src/routes/index.tsx` - identity-first home, current-focus panel, and flagship story cards.
- `src/routes/projects.tsx` - grouped project sections, stable anchors, and project cards.
- `src/routes/about.tsx` - editorial theme cards and about surface.
- `src/routes/contact.tsx` - collaboration cards and profile links.
- `src/styles/app.css` - current dark-first shared UI classes, responsive rules, and reduced-motion guard.
- `src/domain/projects.ts` - project selectors and content used by visual surfaces.
- `src/domain/profile.ts` - profile links and OpenLinks `rel="me"` data.
- `src/domain/routes.ts` and `src/domain/seo.ts` - route metadata contracts that visual wrappers must preserve.
- `public/social/bright-builds-og.png`, `public/favicon.svg`, `public/icon-192.png`, and `public/apple-touch-icon.png` - existing local visual/brand assets.
- `scripts/verify-static.ts` - current generated-output verification to preserve or extend.

### Instructions and Standards

- `AGENTS.md` - repo-local dark-primary guidance, Bright Builds rules, GSD workflow enforcement, and generated stack notes.
- `AGENTS.bright-builds.md` - Bright Builds workflow defaults, TS/Solid guidance, and owner-specific OpenLinks guidance.
- `standards-overrides.md` - repo-specific exceptions file.
- Bright Builds canonical standards at commit `05f8d7a6c9c2e157ec4f922a05273e72dab97676`: `standards/index.md`, `standards/core/architecture.md`, `standards/core/code-shape.md`, `standards/core/verification.md`, `standards/core/testing.md`, and `standards/languages/typescript-javascript.md`.
- `/Users/peterryszkiewicz/.codex/skills/openlinks-identity-presence/SKILL.md` - OpenLinks footer/about/contact/metadata placement rules.

</canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- `src/styles/app.css`: current shared shell, card, chip, link, focus, responsive, and reduced-motion classes are the main visual system surface to extend.
- `src/components/SiteLayout.tsx`: global shell and footer are the right place for low-intrusion identity polish and navigation stability fixes.
- `src/routes/index.tsx`: home has the highest visual-impact surface with identity copy, current focus, and six story cards.
- `src/routes/projects.tsx`: project grouping and anchors are the highest risk for card density, wrapping, and mobile text overlap.
- `public/social/bright-builds-og.png`: existing local bitmap brand asset can support a visible visual treatment if it is not merely repeated as a card screenshot.

### Established Patterns

- Solid route components stay thin and consume pure `src/domain/*` helpers.
- Shared visual primitives are class-based in `src/styles/app.css`; Tailwind is configured with selector dark mode and Mystic setup.
- The site currently uses CSS transitions and a global reduced-motion media query. No motion library is installed yet.
- `bun run verify` is the aggregate gate; browser smoke checks have been recorded manually in Phase 3 summaries but are not yet a first-class scripted check.

### Integration Points

- Motion helpers can attach to route-local cards, the home focus panel, or a shared visual-shell component without changing domain data.
- Browser verification should cover `/`, `/projects`, `/about`, and `/contact` in dark mode and reduced-motion mode.
- Any new static visual asset should live under `public/` and be referenced through stable route markup or CSS without breaking static output verification.

</code_context>

<specifics>

## Specific Ideas

- The desired feel is technical and alive: closer to a responsive command/workbench surface than a passive marketing page.
- Motion should be "felt" through restrained response and polish, not through a dominant animation centerpiece.
- Keep the current Phase 3 content hierarchy intact; Phase 4 makes it richer and more stable rather than rewriting the narrative.
- Use the existing Bright Builds social/brand asset as source material or inspiration if a visible asset is needed, but avoid simply pasting a social card into the page without adapting it to the layout.

</specifics>

<deferred>

## Deferred Ideas

- Heavy 3D, WebGPU, full physics simulations, constellation graphs, and advanced visual experiments remain future visual-expansion work unless a later phase explicitly scopes them.
- Per-project routes, per-project OG images, search/filtering, GitHub metadata refresh, and release-wide Lighthouse/a11y budgets stay in later phases.
- A full visual regression screenshot pipeline can be considered in Phase 5 release verification if Phase 4's focused browser checks are not enough.

</deferred>

***

*Phase: 04-visual-system-motion*
*Context gathered: 2026-05-26*
