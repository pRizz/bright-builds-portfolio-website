# Phase 04: Visual System & Motion - Research

**Researched:** 2026-05-26  
**Domain:** SolidStart static UI, Tailwind visual system, restrained browser motion, accessibility fallbacks  
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

All constraints in this block are copied from `04-CONTEXT.md`. [VERIFIED: .planning/phases/04-visual-system-motion/04-CONTEXT.md]

### Locked Decisions

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

### Deferred Ideas (OUT OF SCOPE)

- Heavy 3D, WebGPU, full physics simulations, constellation graphs, and advanced visual experiments remain future visual-expansion work unless a later phase explicitly scopes them.
- Per-project routes, per-project OG images, search/filtering, GitHub metadata refresh, and release-wide Lighthouse/a11y budgets stay in later phases.
- A full visual regression screenshot pipeline can be considered in Phase 5 release verification if Phase 4's focused browser checks are not enough.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| EXP-05 | Visitor can navigate the site on desktop and mobile without text overlap, layout jumps, or hover-only access to important content. [VERIFIED: .planning/REQUIREMENTS.md] | Use fixed/constrained card, nav, chip, and target dimensions in `src/styles/app.css`; verify desktop, 390px, and 320px dark rendering in a real browser. [VERIFIED: src/styles/app.css; VERIFIED: 04-UI-SPEC.md] |
| MOTION-01 | Visitor sees a polished visual design that takes gentle inspiration from `https://www.brightbuilds.us/` without copying its unfinished template content. [VERIFIED: .planning/REQUIREMENTS.md] | Extend the existing dark-first shell, local assets, and emerald/cyan/amber accents instead of replacing the route narrative. [VERIFIED: src/styles/app.css; VERIFIED: public/social/bright-builds-og.png; VERIFIED: 04-UI-SPEC.md] |
| MOTION-02 | Visitor can experience restrained reactive/physics effects around non-essential visual elements or project interactions on capable devices. [VERIFIED: .planning/REQUIREMENTS.md] | Use CSS transitions first and optional UI-only Solid pointer helpers gated to fine pointer, visible tab, non-reduced motion, and larger viewports. [CITED: https://docs.solidjs.com/reference/lifecycle/on-cleanup; CITED: https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilityState; CITED: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer] |
| MOTION-03 | Visitor with `prefers-reduced-motion: reduce`, keyboard navigation, coarse pointer, small viewport, hidden tab, or low-power conditions can still use the full site without non-essential motion. [VERIFIED: .planning/REQUIREMENTS.md] | Preserve the existing high-specificity reduced-motion cascade, add keyboard/touch-visible states, disable pointer-follow effects on coarse/small viewports, and pause work on hidden tabs. [VERIFIED: src/styles/app.css; CITED: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion; CITED: https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API] |
| MOTION-04 | Developer can verify motion cleanup so animation loops, listeners, and observers stop when routes/effects unmount or become inactive. [VERIFIED: .planning/REQUIREMENTS.md] | Place DOM listeners and animation frame cleanup in `onMount`/`onCleanup` UI helpers and add a focused code-inspection or unit-test guard for cleanup paths. [CITED: https://docs.solidjs.com/reference/lifecycle/on-cleanup; VERIFIED: standards/core/testing.md at commit 05f8d7a6c9c2e157ec4f922a05273e72dab97676] |
| MOTION-05 | The visual layer uses local adapters around Mystic UI or motion utilities so the domain model and core content do not depend on UI-library internals. [VERIFIED: .planning/REQUIREMENTS.md] | Keep `src/domain/*` free of DOM, Solid lifecycle, Mystic internals, pointer math, and animation state; put visual helpers in `src/components/*` or CSS. [VERIFIED: src/domain/projects.ts; VERIFIED: src/domain/seo.ts; VERIFIED: AGENTS.bright-builds.md] |
</phase_requirements>

## Summary

Phase 4 should remain a CSS-first SolidStart visual polish phase, not a motion-library or physics-engine phase. [VERIFIED: 04-CONTEXT.md; VERIFIED: 04-UI-SPEC.md] The current app already has SolidStart static routes, Tailwind selector dark mode, Mystic setup, local brand assets, route-specific metadata, and a high-specificity reduced-motion cascade. [VERIFIED: package.json; VERIFIED: tailwind.config.ts; VERIFIED: src/entry-server.tsx; VERIFIED: src/styles/app.css; VERIFIED: src/domain/seo.ts; VERIFIED: public/social/bright-builds-og.png]

The live Bright Builds site was inspected and is a Framer-published page with remote Framer assets, remote font assets, bundled motion scripts, and generic app-services metadata, so Phase 4 should borrow only restrained visual tone and not copy its content, dependency model, or template structure. [VERIFIED: curl https://www.brightbuilds.us/; VERIFIED: 04-CONTEXT.md; VERIFIED: 04-UI-SPEC.md]

The implementation plan should split visual polish from motion mechanics. [VERIFIED: 04-UI-SPEC.md] Put static visual tokens, card states, layout stability, and asset treatment in `src/styles/app.css`; add a small UI-only Solid helper only if pointer-reactive effects cannot stay CSS-only. [VERIFIED: src/styles/app.css; CITED: https://docs.solidjs.com/reference/lifecycle/on-cleanup] Domain modules should stay pure because existing route, project, profile, and SEO helpers are data-in/data-out TypeScript modules with unit tests. [VERIFIED: src/domain/projects.ts; VERIFIED: src/domain/profile.ts; VERIFIED: src/domain/seo.ts; VERIFIED: src/domain/project-validation.test.ts; VERIFIED: standards/core/architecture.md at commit 05f8d7a6c9c2e157ec4f922a05273e72dab97676]

**Primary recommendation:** Use the existing SolidStart, Tailwind 3.x, Mystic UI, Bun, Vitest, and static-verification stack; add no runtime animation dependency by default; implement any pointer reactivity as one local UI helper with `onCleanup`, `matchMedia`, visibility, coarse-pointer, and viewport gates. [VERIFIED: package.json; VERIFIED: npm view motion version; VERIFIED: npm view @solid-primitives/spring version; CITED: https://docs.solidjs.com/reference/lifecycle/on-cleanup; CITED: https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API]

## Project Constraints (from AGENTS.md)

- Read and follow `AGENTS.md`, `AGENTS.bright-builds.md`, `standards-overrides.md`, and the pinned Bright Builds standards pages before planning or implementation. [VERIFIED: AGENTS.md; VERIFIED: AGENTS.bright-builds.md]
- Use GSD workflow artifacts for repo edits unless the user explicitly bypasses GSD. [VERIFIED: AGENTS.md]
- Treat the site as dark-primary, keep `.dark` active on the root document, and treat light-first classes such as `bg-white`, `bg-stone-50`, and `text-zinc-950` as exceptions needing a local reason. [VERIFIED: AGENTS.md; VERIFIED: src/entry-server.tsx]
- Visual UI changes require desktop and mobile dark rendering checks for contrast, readability, and text overlap. [VERIFIED: AGENTS.md]
- Prefer functional core and imperative shell; keep business rules in pure data-in/data-out functions and isolate DOM, framework, and external effects in thin adapters. [VERIFIED: AGENTS.bright-builds.md; VERIFIED: standards/core/architecture.md at commit 05f8d7a6c9c2e157ec4f922a05273e72dab97676]
- Prefer early returns and shallow control flow; treat functions over roughly 161 lines and files over roughly 628 lines as refactor triggers. [VERIFIED: AGENTS.bright-builds.md; VERIFIED: standards/core/code-shape.md at commit 05f8d7a6c9c2e157ec4f922a05273e72dab97676]
- Prefix internal nullable or optional names with `maybe`, including TS locals, params, functions, and internal fields. [VERIFIED: AGENTS.bright-builds.md; VERIFIED: standards/languages/typescript-javascript.md at commit 05f8d7a6c9c2e157ec4f922a05273e72dab97676]
- Use Bun as the package/script surface for this standalone TS/Solid project and do not add new Python scripts for repo-owned automation. [VERIFIED: package.json; VERIFIED: standards/languages/typescript-javascript.md at commit 05f8d7a6c9c2e157ec4f922a05273e72dab97676]
- Prefer Mystic UI for SolidJS UI primitives, pin `pRizz/mystic-ui` to an exact GitHub SHA, and avoid unsupported deep workspace or Panda imports. [VERIFIED: package.json; VERIFIED: tailwind.config.ts; VERIFIED: git ls-remote https://github.com/pRizz/mystic-ui.git HEAD; VERIFIED: AGENTS.md]
- Unit-test pure code and business logic, keep each unit test focused on one concern, and use Arrange, Act, Assert comments unless the structure is unmistakable. [VERIFIED: standards/core/testing.md at commit 05f8d7a6c9c2e157ec4f922a05273e72dab97676]
- Prefer repo-owned verification entrypoints, especially `bun run verify`, before completing changed work. [VERIFIED: package.json; VERIFIED: standards/core/verification.md at commit 05f8d7a6c9c2e157ec4f922a05273e72dab97676]
- Keep OpenLinks low-intrusion: one visible footer/about/contact/profile identity placement plus metadata where supported, never the primary CTA or repeated hero promotion. [VERIFIED: AGENTS.bright-builds.md; VERIFIED: /Users/peterryszkiewicz/.codex/skills/openlinks-identity-presence/SKILL.md; VERIFIED: src/components/SiteLayout.tsx; VERIFIED: src/routes/about.tsx; VERIFIED: src/routes/contact.tsx]

## Standard Stack

### Core

| Library / Surface | Version | Purpose | Why Standard |
|-------------------|---------|---------|--------------|
| Bun | `packageManager: bun@1.3.14`; local CLI `1.3.9` | Package manager and script runner. [VERIFIED: package.json; VERIFIED: bun --version] | Repo and Bright Builds TS standards use Bun for this standalone TS/Solid project. [VERIFIED: AGENTS.md; VERIFIED: standards/languages/typescript-javascript.md at commit 05f8d7a6c9c2e157ec4f922a05273e72dab97676] |
| SolidStart | `@solidjs/start@1.3.2`, npm modified 2026-02-24 | Static-first Solid app framework and route shell. [VERIFIED: package.json; VERIFIED: npm view @solidjs/start version time.modified] | Existing `app.config.ts` uses SolidStart static preset and prerender routes from pure route data. [VERIFIED: app.config.ts; VERIFIED: src/domain/routes.ts] |
| SolidJS | `solid-js@1.9.13`, npm modified 2026-05-19 | Component runtime and lifecycle API. [VERIFIED: package.json; VERIFIED: npm view solid-js version time.modified] | Solid lifecycle APIs provide `onMount` and `onCleanup` for UI-only DOM listeners and animation cleanup. [CITED: https://docs.solidjs.com/reference/lifecycle/on-cleanup] |
| Tailwind CSS | Project-pinned `tailwindcss@3.4.19`; npm latest overall `4.3.0` | Utility CSS and component-layer styling. [VERIFIED: package.json; VERIFIED: npm view tailwindcss@3.4.19 version time.modified; VERIFIED: npm view tailwindcss version time.modified] | Mystic consumer setup and existing config are Tailwind 3.x with `darkMode: "selector"`. [VERIFIED: tailwind.config.ts; CITED: https://v3.tailwindcss.com/docs/dark-mode] |
| Mystic UI | `github:pRizz/mystic-ui#d36017757708ed01ef2b3b47beb14f294726411c`; repo HEAD matches the pinned SHA | Tailwind theme setup and optional Solid UI primitives. [VERIFIED: package.json; VERIFIED: git ls-remote https://github.com/pRizz/mystic-ui.git HEAD] | Existing config imports `withMysticUI` and CSS imports `mystic-ui/tailwind/theme.css`. [VERIFIED: tailwind.config.ts; VERIFIED: src/styles/app.css] |
| Local CSS visual primitives | `src/styles/app.css` | Shared shell, nav, cards, chips, links, focus states, and reduced-motion cascade. [VERIFIED: src/styles/app.css] | Current visual system already lives in Tailwind component-layer CSS; extending it avoids route duplication and new dependencies. [VERIFIED: src/styles/app.css; VERIFIED: src/routes/index.tsx; VERIFIED: src/routes/projects.tsx] |

### Supporting

| Library / Surface | Version | Purpose | When to Use |
|-------------------|---------|---------|-------------|
| Vitest | `vitest@4.1.7`, npm modified 2026-05-20 | Unit tests for pure visual configuration or utility decisions. [VERIFIED: package.json; VERIFIED: npm view vitest version time.modified] | Use only for non-trivial pure helpers such as motion gating decisions; browser layout and focus behavior still need browser checks. [VERIFIED: 04-UI-SPEC.md; VERIFIED: standards/core/testing.md at commit 05f8d7a6c9c2e157ec4f922a05273e72dab97676] |
| Existing static verifier | `scripts/verify-static.ts` | Generated HTML, route text, metadata, JSON-LD, sitemap, robots, and asset invariant checks. [VERIFIED: scripts/verify-static.ts] | Extend only for static HTML/asset invariants, not visual layout measurements. [VERIFIED: 04-UI-SPEC.md; VERIFIED: scripts/verify-static.ts] |
| Codex Browser / manual browser evidence | Session plugin available; no package install | Desktop/mobile/reduced-motion/keyboard visual verification. [VERIFIED: session plugin list; VERIFIED: 04-UI-SPEC.md] | Use for Phase 4 acceptance unless the planner intentionally adds a repo-owned browser script. [VERIFIED: 04-UI-SPEC.md] |
| Playwright | Not installed; npm latest `@playwright/test@1.60.0`, modified 2026-05-26 | Optional automated browser verification. [VERIFIED: package.json; VERIFIED: command -v playwright; VERIFIED: npm view @playwright/test version time.modified] | Defer broad automated browser/accessibility coverage to Phase 5 unless manual evidence proves insufficient for Phase 4. [VERIFIED: .planning/ROADMAP.md; VERIFIED: 04-UI-SPEC.md] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS/local Solid helper | `motion@12.40.0` | Do not add by default because Phase 4 needs restrained hover/focus and optional pointer highlights, not timeline orchestration. [VERIFIED: npm view motion version time.modified; VERIFIED: 04-CONTEXT.md; CITED: https://motion.dev/docs/animate] |
| CSS/local Solid helper | `@solid-primitives/spring@0.1.2` | Do not add by default because the UI spec allows CSS/local utilities and the primitive adds dependency surface for a narrow effect. [VERIFIED: npm view @solid-primitives/spring version time.modified; VERIFIED: 04-UI-SPEC.md] |
| Local 2D CSS highlight | GSAP, Matter.js, Three.js, Rapier, WebGPU | Out of scope because Phase 4 explicitly rejects heavy simulation, scroll-jacking, and 3D/WebGPU scenes. [VERIFIED: 04-CONTEXT.md; VERIFIED: 04-UI-SPEC.md; VERIFIED: npm view gsap version; VERIFIED: npm view matter-js version; VERIFIED: npm view three version] |
| Existing brand asset treatment | Remote stock imagery or remote image service | Do not use because assets must be local, optimized, non-blocking, and content-aligned. [VERIFIED: 04-CONTEXT.md; VERIFIED: 04-UI-SPEC.md; VERIFIED: public/social/bright-builds-og.png] |

**Installation:**

No package install is recommended for Phase 4 by default. [VERIFIED: package.json; VERIFIED: 04-CONTEXT.md; VERIFIED: 04-UI-SPEC.md]

```bash
# Default Phase 4 implementation path:
# no new dependencies

# Only if the planner intentionally adds automated browser checks in Phase 4:
bun add -d @playwright/test@1.60.0
```

**Version verification:** Package versions were verified with `npm view`, and Mystic's pinned SHA was verified with `git ls-remote`. [VERIFIED: npm view @solidjs/start version time.modified; VERIFIED: npm view solid-js version time.modified; VERIFIED: npm view tailwindcss@3.4.19 version time.modified; VERIFIED: npm view @playwright/test version time.modified; VERIFIED: git ls-remote https://github.com/pRizz/mystic-ui.git HEAD]

## Architecture Patterns

### Recommended Project Structure

```text
src/
├── components/
│   ├── SiteLayout.tsx              # Existing shell, footer, OpenLinks placement. [VERIFIED: src/components/SiteLayout.tsx]
│   ├── ReactiveSurface.tsx         # Add only if pointer-reactive behavior is implemented. [VERIFIED: 04-UI-SPEC.md]
│   └── visual-motion.ts            # Optional pure motion-gate config, unit-testable. [VERIFIED: standards/core/testing.md]
├── routes/
│   ├── index.tsx                   # Apply home visual asset and reactive surface. [VERIFIED: src/routes/index.tsx]
│   ├── projects.tsx                # Apply stable project-card visual states. [VERIFIED: src/routes/projects.tsx]
│   ├── about.tsx                   # Keep OpenLinks low-intrusion. [VERIFIED: src/routes/about.tsx]
│   └── contact.tsx                 # Preserve native link cards. [VERIFIED: src/routes/contact.tsx]
├── domain/
│   └── *.ts                        # No motion, DOM, Mystic internals, or pointer state. [VERIFIED: src/domain/projects.ts]
└── styles/
    └── app.css                     # Main visual-system and reduced-motion surface. [VERIFIED: src/styles/app.css]
scripts/
└── verify-static.ts                # Extend only for static asset/HTML invariants. [VERIFIED: scripts/verify-static.ts]
```

### Pattern 1: CSS-First Visual Primitives

**What:** Put stable dimensions, dark surfaces, focus rings, hover/focus transitions, chip wrapping, and asset treatment in `src/styles/app.css`. [VERIFIED: src/styles/app.css]  
**When to use:** Use for all non-interactive and simple interactive polish because existing route markup already references shared classes. [VERIFIED: src/routes/index.tsx; VERIFIED: src/routes/projects.tsx; VERIFIED: src/routes/about.tsx; VERIFIED: src/routes/contact.tsx]  
**Example:**

```css
/* Source: local visual contract and Tailwind component-layer pattern. [VERIFIED: 04-UI-SPEC.md; VERIFIED: src/styles/app.css] */
@layer components {
  .reactive-card {
    position: relative;
    overflow: hidden;
    border-radius: 8px;
    transition:
      transform 120ms ease-out,
      border-color 120ms ease-out,
      background-color 120ms ease-out,
      box-shadow 120ms ease-out;
  }

  .reactive-card:hover,
  .reactive-card:focus-within {
    transform: translateY(-2px);
  }
}

@media (prefers-reduced-motion: reduce), (pointer: coarse), (max-width: 640px) {
  .reactive-card:hover,
  .reactive-card:focus-within {
    transform: none;
  }
}
```

### Pattern 2: One UI-Only Reactive Surface Helper

**What:** If pointer-reactive highlights are added, implement one component or hook that owns DOM listeners, one RAF handle, and CSS custom property updates. [VERIFIED: 04-UI-SPEC.md]  
**When to use:** Use only around non-essential surfaces such as home project stories or project cards; never inside `src/domain/*`. [VERIFIED: 04-CONTEXT.md; VERIFIED: src/domain/projects.ts]  
**Example:**

```tsx
// Source: Solid lifecycle cleanup docs and Page Visibility API. [CITED: https://docs.solidjs.com/reference/lifecycle/on-cleanup; CITED: https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API]
import { onCleanup, onMount, type JSX } from "solid-js";

type ReactiveSurfaceProps = {
  children: JSX.Element;
};

export function ReactiveSurface(props: ReactiveSurfaceProps) {
  let maybeElement: HTMLDivElement | undefined;

  onMount(() => {
    const element = maybeElement;

    if (!element || !motionMayRun()) {
      return;
    }

    let maybeFrame: number | null = null;
    let pointerX = 0;
    let pointerY = 0;

    const cancelFrame = () => {
      if (maybeFrame === null) {
        return;
      }

      cancelAnimationFrame(maybeFrame);
      maybeFrame = null;
    };

    const flushPointer = () => {
      maybeFrame = null;
      element.style.setProperty("--pointer-x", `${pointerX}px`);
      element.style.setProperty("--pointer-y", `${pointerY}px`);
    };

    const schedulePointer = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;

      if (maybeFrame !== null || document.visibilityState !== "visible") {
        return;
      }

      maybeFrame = requestAnimationFrame(flushPointer);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible") {
        cancelFrame();
      }
    };

    element.addEventListener("pointermove", schedulePointer);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    onCleanup(() => {
      cancelFrame();
      element.removeEventListener("pointermove", schedulePointer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    });
  });

  return (
    <div
      ref={(element) => {
        maybeElement = element;
      }}
      class="reactive-surface"
    >
      {props.children}
    </div>
  );
}

function motionMayRun(): boolean {
  return (
    window.matchMedia("(prefers-reduced-motion: no-preference)").matches &&
    window.matchMedia("(pointer: fine)").matches &&
    window.matchMedia("(min-width: 641px)").matches &&
    document.visibilityState === "visible"
  );
}
```

### Pattern 3: Static Content First, Hydration Enhancement Second

**What:** Route headings, copy, project anchors, contact links, OpenLinks, metadata, JSON-LD, sitemap, robots, and local assets must remain present in generated HTML before hydration. [VERIFIED: scripts/verify-static.ts; VERIFIED: src/domain/seo.ts]  
**When to use:** Use for every visual wrapper and animation helper because SolidStart prerendered static output is already a project requirement. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: app.config.ts]  
**Example:**

```tsx
// Source: current route pattern. [VERIFIED: src/routes/projects.tsx]
<article id={props.project.slug} class="project-anchor-card reactive-card">
  <h3 class="card-title">
    <a class="project-anchor-link" href={`/projects#${props.project.slug}`}>
      {props.project.name}
    </a>
  </h3>
  <p class="card-copy">{props.project.oneLine}</p>
</article>
```

### Anti-Patterns to Avoid

- **Runtime motion in domain modules:** Domain files are pure content and SEO helpers, so DOM, timers, `matchMedia`, Mystic internals, and pointer state belong in UI files only. [VERIFIED: src/domain/projects.ts; VERIFIED: src/domain/seo.ts; VERIFIED: 04-CONTEXT.md]
- **Layout-affecting animation:** Do not animate width, height, margin, padding, grid tracks, text size, top, or left because the phase requires no layout jumps. [VERIFIED: 04-UI-SPEC.md]
- **Hover-only meaning:** Current links are native anchors; preserve keyboard and tap-visible affordances for all important actions. [VERIFIED: src/routes/index.tsx; VERIFIED: src/routes/projects.tsx; VERIFIED: src/routes/contact.tsx; VERIFIED: 04-UI-SPEC.md]
- **Literal OG-card paste:** The social PNG is a useful local brand source, but the UI spec rejects pasting it as a static card screenshot. [VERIFIED: public/social/bright-builds-og.png; VERIFIED: 04-UI-SPEC.md]
- **Deep Mystic imports:** Consumer code should use supported Mystic setup and project-owned adapters, not workspace internals. [VERIFIED: tailwind.config.ts; VERIFIED: package.json; VERIFIED: AGENTS.md]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Reduced-motion policy | A custom global JS motion switch | CSS `@media (prefers-reduced-motion: reduce)` plus `matchMedia` gate in the one optional UI helper. [VERIFIED: src/styles/app.css; CITED: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion] | The repo already has a high-specificity cascade, and browser media queries are the platform primitive. [VERIFIED: src/styles/app.css; CITED: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion] |
| Hidden-tab pause | A polling loop that checks page activity | `visibilitychange` and `document.visibilityState`. [CITED: https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API] | Page Visibility is the platform API for detecting whether page content is visible to the user. [CITED: https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API] |
| Pointer capability detection | User-agent sniffing | CSS/JS media queries for `pointer` and viewport gates. [CITED: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer] | Pointer media features describe whether the primary input is fine, coarse, or absent. [CITED: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer] |
| Physics/reactive card effects | A local physics engine, Matter.js, Rapier, Three.js, or WebGPU scene | CSS transforms, CSS variables, and one local Solid UI helper. [VERIFIED: 04-CONTEXT.md; VERIFIED: 04-UI-SPEC.md] | The phase requires restrained non-essential motion and explicitly defers heavy simulation. [VERIFIED: 04-CONTEXT.md; VERIFIED: 04-UI-SPEC.md] |
| Browser layout verification | A homegrown DOM emulator or static HTML parser for overlap | Real browser verification through Codex Browser/manual evidence, or Playwright only if automated checks are intentionally added. [VERIFIED: 04-UI-SPEC.md; VERIFIED: package.json; VERIFIED: command -v playwright] | Text overlap, focus order, media emulation, and hover/tap states are browser behaviors, not static string properties. [VERIFIED: 04-UI-SPEC.md; CITED: https://playwright.dev/docs/emulation] |
| OpenLinks promotion | Header takeover, repeated hero CTA, or overlay | Keep visible footer/about/contact/profile link plus `rel="me"`/sameAs where already supported. [VERIFIED: /Users/peterryszkiewicz/.codex/skills/openlinks-identity-presence/SKILL.md; VERIFIED: src/components/SiteLayout.tsx; VERIFIED: src/domain/seo.ts] | Bright Builds and OpenLinks rules require host brand and project CTA to remain primary. [VERIFIED: AGENTS.bright-builds.md; VERIFIED: 04-CONTEXT.md] |

**Key insight:** The hard problem is not animation capability; it is preventing subtle visual polish from breaking static content, route semantics, keyboard access, reduced motion, hidden-tab cleanup, and mobile layout stability. [VERIFIED: 04-UI-SPEC.md; VERIFIED: scripts/verify-static.ts]

## Common Pitfalls

### Pitfall 1: Reduced Motion Exists in CSS but JS Still Runs

**What goes wrong:** CSS transitions collapse, but pointer listeners, RAF callbacks, observers, or timers still do work. [VERIFIED: 04-CONTEXT.md; VERIFIED: 04-UI-SPEC.md]  
**Why it happens:** Developers often treat `prefers-reduced-motion` as CSS-only and forget JS-side gates. [ASSUMED]  
**How to avoid:** Gate JS helpers with `window.matchMedia("(prefers-reduced-motion: no-preference)")` and clean up with `onCleanup`. [CITED: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion; CITED: https://docs.solidjs.com/reference/lifecycle/on-cleanup]  
**Warning signs:** `requestAnimationFrame`, `setInterval`, `setTimeout`, `ResizeObserver`, or `addEventListener` appears without a nearby cleanup and motion gate. [VERIFIED: rg source audit]

### Pitfall 2: Pointer Highlights Cause Layout Reads Every Frame

**What goes wrong:** Effects become janky because layout reads and writes run inside the RAF callback. [ASSUMED]  
**Why it happens:** Pointer math often mixes `getBoundingClientRect()` and style writes in the same frame. [ASSUMED]  
**How to avoid:** Read geometry on setup or pointer enter, write CSS custom properties inside RAF, and animate transform/opacity/background/border/shadow only. [VERIFIED: 04-UI-SPEC.md; CITED: https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame]  
**Warning signs:** RAF callbacks call layout-reading APIs and then write styles in the same callback. [ASSUMED]

### Pitfall 3: Mobile Nav and Chips Overflow at 320px

**What goes wrong:** Long project titles, URLs, chips, and navigation rows can overflow or overlap on the narrowest required viewport. [VERIFIED: 04-UI-SPEC.md; VERIFIED: src/routes/projects.tsx; VERIFIED: src/styles/app.css]  
**Why it happens:** Current route content includes long names such as `Win3Bitco.in / Open Bitcoin Web Miner`, long URLs, and many chips. [VERIFIED: src/domain/projects.ts; VERIFIED: src/routes/projects.tsx]  
**How to avoid:** Preserve `overflow-wrap: anywhere` for long anchors/URLs, make nav/cards flex-wrap/grid stable, and verify at 390px and 320px. [VERIFIED: src/styles/app.css; VERIFIED: 04-UI-SPEC.md]  
**Warning signs:** Any new `whitespace-nowrap`, fixed pixel width, negative margins, or absolute-positioned label around project cards. [ASSUMED]

### Pitfall 4: Hover Affordance Has No Keyboard or Touch Equivalent

**What goes wrong:** Pointer users see card feedback, but keyboard and touch users cannot discover or activate the same content. [VERIFIED: 04-UI-SPEC.md]  
**Why it happens:** Visual polish sometimes targets only `:hover`. [ASSUMED]  
**How to avoid:** Pair hover states with `:focus-visible`, `:focus-within`, and native anchors/buttons; keep tap states meaningful without pointer-follow effects. [VERIFIED: src/styles/app.css; CITED: https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html]  
**Warning signs:** A visual state exists under `hover:` but not under focus or focus-within. [VERIFIED: rg source audit]

### Pitfall 5: Asset Treatment Obscures the Content

**What goes wrong:** The existing OG PNG becomes a large screenshot-like hero card that pushes live route content below the fold. [VERIFIED: public/social/bright-builds-og.png; VERIFIED: 04-UI-SPEC.md]  
**Why it happens:** The asset already contains Bright Builds text, so using it literally duplicates the live H1 and supporting copy. [VERIFIED: public/social/bright-builds-og.png; VERIFIED: src/routes/index.tsx]  
**How to avoid:** Use the asset as cropped texture, subtle brand material, or inspiration for local marks; mark decorative usage `aria-hidden="true"` or use CSS backgrounds. [VERIFIED: 04-UI-SPEC.md]  
**Warning signs:** The first viewport shows an image of the brand instead of live semantic headings and CTAs. [VERIFIED: 04-UI-SPEC.md]

## Code Examples

Verified patterns from official and local sources.

### Pure Motion Gate Helper

```ts
// Source: MDN media queries and Page Visibility API. [CITED: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion; CITED: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer; CITED: https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilityState]
export type MotionGateInput = {
  reducedMotion: boolean;
  coarsePointer: boolean;
  smallViewport: boolean;
  hiddenTab: boolean;
};

export function canRunDecorativeMotion(input: MotionGateInput): boolean {
  return (
    !input.reducedMotion &&
    !input.coarsePointer &&
    !input.smallViewport &&
    !input.hiddenTab
  );
}
```

### Solid Cleanup Shell

```tsx
// Source: Solid lifecycle cleanup docs. [CITED: https://docs.solidjs.com/reference/lifecycle/on-cleanup]
import { onCleanup, onMount } from "solid-js";

export function useDocumentVisibilityPause(onHidden: () => void) {
  onMount(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible") {
        onHidden();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    onCleanup(() => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    });
  });
}
```

### Browser Verification Matrix

```text
Routes: /, /projects, /about, /contact. [VERIFIED: src/domain/routes.ts]
Desktop: 1440x900 dark. [VERIFIED: 04-UI-SPEC.md]
Mobile: 390x844 and 320x844 dark. [VERIFIED: 04-UI-SPEC.md]
Reduced motion: emulate prefers-reduced-motion: reduce. [VERIFIED: 04-UI-SPEC.md; CITED: https://playwright.dev/docs/emulation]
Keyboard: tab through header, Browse projects CTA, project cards, footer, about OpenLinks, contact cards. [VERIFIED: 04-UI-SPEC.md; VERIFIED: src/routes/index.tsx; VERIFIED: src/routes/contact.tsx]
Checks: no console errors, no horizontal overflow, no text overlap, focus rings visible, non-essential motion disabled. [VERIFIED: 04-UI-SPEC.md]
```

## State of the Art

| Old Approach | Current Approach | When Changed / Source | Impact |
|--------------|------------------|------------------------|--------|
| Tailwind `darkMode: "class"` wording | Tailwind 3.4 documents `darkMode: "selector"` for class-driven dark mode. [CITED: https://v3.tailwindcss.com/docs/dark-mode] | Tailwind 3.4 docs and current project config. [VERIFIED: tailwind.config.ts; CITED: https://v3.tailwindcss.com/docs/dark-mode] | Keep existing selector dark mode and `.dark` root. [VERIFIED: src/entry-server.tsx] |
| Animation library first | CSS/platform primitives first, library only for complex orchestration. [VERIFIED: 04-CONTEXT.md; VERIFIED: 04-UI-SPEC.md] | Phase 4 locked decisions and approved UI spec. [VERIFIED: 04-CONTEXT.md; VERIFIED: 04-UI-SPEC.md] | Avoid adding `motion`, GSAP, physics, Three.js, or WebGPU for this phase. [VERIFIED: package.json; VERIFIED: npm view motion version; VERIFIED: npm view gsap version; VERIFIED: npm view three version] |
| Static string checks for all visual behavior | Static verifier for generated HTML/assets plus real browser checks for layout, reduced motion, and focus. [VERIFIED: scripts/verify-static.ts; VERIFIED: 04-UI-SPEC.md] | Phase 4 verification contract. [VERIFIED: 04-UI-SPEC.md] | Extend `scripts/verify-static.ts` only for static invariants; use browser evidence for visual behavior. [VERIFIED: scripts/verify-static.ts; VERIFIED: 04-UI-SPEC.md] |
| Always-on ambient loops | Event-driven pointer response with visibility and reduced-motion gates. [VERIFIED: 04-CONTEXT.md; CITED: https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API] | Page Visibility API and phase constraints. [VERIFIED: 04-CONTEXT.md; CITED: https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API] | Decorative work stops when hidden, reduced, coarse-pointer, or unmounted. [VERIFIED: 04-UI-SPEC.md] |

**Deprecated/outdated:**

- Do not use Tailwind 4 in this phase because the project and Mystic consumer contract are pinned to Tailwind 3.x. [VERIFIED: package.json; VERIFIED: tailwind.config.ts; VERIFIED: AGENTS.md; VERIFIED: npm view tailwindcss version time.modified]
- Do not add scroll-jacking, delayed content reveal, or animation-required reading because the approved UI spec rejects route/page motion that gates content comprehension. [VERIFIED: 04-UI-SPEC.md]
- Do not add a broad visual regression pipeline in Phase 4 because the roadmap defers release-wide verification to Phase 5. [VERIFIED: .planning/ROADMAP.md; VERIFIED: 04-CONTEXT.md]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Developers often miss JS-side reduced-motion gating when CSS reduced motion is already present. [ASSUMED] | Common Pitfalls | Planner may over-focus on CSS and under-plan cleanup verification. |
| A2 | Per-frame layout reads plus writes are a practical jank risk for pointer effects. [ASSUMED] | Common Pitfalls | Planner may need to add a browser performance smoke check if the effect becomes more complex. |
| A3 | There is no Phase 4 need for a direct low-power browser API; low-power support should come from conservative default work, reduced-motion/coarse-pointer/small-viewport/hidden-tab gates, and avoiding persistent ambient loops. [ASSUMED] | Summary / Architecture | If a reliable project-supported low-power signal is later required, the helper API should add that gate explicitly. |

## Open Questions

1. **Should Phase 4 add Playwright now or defer it to Phase 5?** [VERIFIED: package.json; VERIFIED: .planning/ROADMAP.md]
   - What we know: `@playwright/test` is not installed, broad browser/accessibility release checks are scoped to Phase 5, and Phase 4 UI spec allows focused browser/manual evidence. [VERIFIED: package.json; VERIFIED: command -v playwright; VERIFIED: .planning/ROADMAP.md; VERIFIED: 04-UI-SPEC.md]
   - What's unclear: Whether manual Browser evidence will be accepted as durable enough for Phase 4 verification. [ASSUMED]
   - Recommendation: Do not add Playwright in Phase 4 unless manual verification becomes unreliable; keep Phase 4 on Browser/manual evidence plus existing `bun run verify`. [VERIFIED: 04-UI-SPEC.md; VERIFIED: package.json]

2. **Should the pointer-reactive helper be component-based or CSS-only?** [VERIFIED: 04-UI-SPEC.md]
   - What we know: CSS hover/focus lift satisfies the minimum restrained motion contract, while pointer-follow highlights require DOM listeners and cleanup. [VERIFIED: 04-UI-SPEC.md; CITED: https://docs.solidjs.com/reference/lifecycle/on-cleanup]
   - What's unclear: Whether the visual design plan needs pointer-follow to feel sufficiently Bright Builds-inspired. [ASSUMED]
   - Recommendation: Plan CSS hover/focus polish first, then add one `ReactiveSurface` only if the visual pass still lacks a subtle reactive signal. [VERIFIED: 04-CONTEXT.md; VERIFIED: 04-UI-SPEC.md]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Bun CLI | Existing scripts and `bun run verify` | Yes | Local `1.3.9`; package pin `1.3.14` | Use local CLI for research/implementation, but note pin mismatch if a Bun-version-sensitive failure appears. [VERIFIED: bun --version; VERIFIED: package.json] |
| Node.js | npm version probes and ecosystem tools | Yes | `v24.13.0` | Bun remains primary script runner. [VERIFIED: node --version; VERIFIED: package.json] |
| npm | Registry version verification | Yes | `11.6.2` | Use package lock data and `bun` where registry checks are unnecessary. [VERIFIED: npm --version] |
| `sips` | Local image inspection/optimization option on macOS | Yes | `/usr/bin/sips` | Use existing PNG IHDR checks in `scripts/verify-static.ts` for dimensions. [VERIFIED: command -v sips; VERIFIED: scripts/verify-static.ts] |
| Playwright CLI | Optional automated browser verification | No | Not on PATH and not in `package.json` | Use Codex Browser/manual evidence for Phase 4 or add `@playwright/test@1.60.0` only if automation is explicitly planned. [VERIFIED: command -v playwright; VERIFIED: package.json; VERIFIED: npm view @playwright/test version time.modified] |
| Chrome/Chromium CLI | Optional local browser scripting | No | `chromium` and `google-chrome` not on PATH | Use Codex Browser plugin or install Playwright-managed browsers only if automation is added. [VERIFIED: command -v chromium; VERIFIED: command -v google-chrome] |

**Missing dependencies with no fallback:**

- None for the recommended default implementation path. [VERIFIED: package.json; VERIFIED: 04-UI-SPEC.md]

**Missing dependencies with fallback:**

- Playwright/Chrome CLI are missing, but Phase 4 can use focused Browser/manual verification and defer automated browser suites to Phase 5. [VERIFIED: command -v playwright; VERIFIED: command -v chromium; VERIFIED: .planning/ROADMAP.md; VERIFIED: 04-UI-SPEC.md]

## Validation Architecture

Skipped because `.planning/config.json` has `workflow.nyquist_validation` set to `false`. [VERIFIED: .planning/config.json]

## Security Domain

Security enforcement is enabled by default because `.planning/config.json` does not set `security_enforcement: false`. [VERIFIED: .planning/config.json]

The ASVS mapping below uses OWASP ASVS as web-application security-control guidance and narrows it to this phase's static public UI scope. [CITED: https://owasp.org/www-project-application-security-verification-standard/; VERIFIED: 04-CONTEXT.md]

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|------------------|
| V2 Authentication | No | Static portfolio has no authentication flow. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: src/routes/contact.tsx] |
| V3 Session Management | No | Static portfolio has no session state. [VERIFIED: package.json; VERIFIED: src/app.tsx] |
| V4 Access Control | No | Public routes are prerendered and indexable. [VERIFIED: app.config.ts; VERIFIED: src/domain/routes.ts] |
| V5 Input Validation | Yes | Keep route/content/SEO derivation in typed pure modules and preserve HTML/JSON-LD escaping. [VERIFIED: src/domain/projects.ts; VERIFIED: src/domain/seo.ts; VERIFIED: scripts/verify-static.ts] |
| V6 Cryptography | No | Phase 4 adds visual behavior only and no crypto operations. [VERIFIED: 04-CONTEXT.md; VERIFIED: .planning/REQUIREMENTS.md] |

### Known Threat Patterns for Static Solid/Tailwind UI

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| DOM or JSON-LD injection through route/project copy | Tampering | Keep generated metadata and JSON-LD sourced from typed local data; keep `jsonLdScriptContent` escaping `<`; preserve static verifier coverage. [VERIFIED: src/domain/seo.ts; VERIFIED: scripts/verify-static.ts] |
| Reverse tabnabbing from external links | Spoofing | Preserve `rel="noopener noreferrer"` on external targets and `rel="me"` only for identity links. [VERIFIED: src/routes/index.tsx; VERIFIED: src/routes/projects.tsx; VERIFIED: src/domain/profile.ts; VERIFIED: /Users/peterryszkiewicz/.codex/skills/openlinks-identity-presence/SKILL.md] |
| Supply-chain drift from UI/motion dependencies | Tampering | Keep Mystic pinned to an exact Git SHA and avoid adding motion dependencies unless the plan proves need. [VERIFIED: package.json; VERIFIED: git ls-remote https://github.com/pRizz/mystic-ui.git HEAD; VERIFIED: 04-CONTEXT.md] |
| Token exposure through accidental GitHub/runtime enrichment | Information Disclosure | Do not add runtime GitHub calls or `VITE_*` token surfaces; existing static verifier rejects GitHub token strings in output. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: scripts/verify-static.ts] |

## Sources

### Primary (HIGH Confidence)

- `AGENTS.md`, `AGENTS.bright-builds.md`, `standards-overrides.md` - repo-local rules, Bright Builds sidecar, and override state. [VERIFIED: local files]
- Bright Builds standards at commit `05f8d7a6c9c2e157ec4f922a05273e72dab97676` - architecture, code shape, verification, testing, and TS/JS standards. [VERIFIED: curl raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/...]
- `04-CONTEXT.md` and `04-UI-SPEC.md` - locked Phase 4 implementation and UI decisions. [VERIFIED: local files]
- `package.json`, `tailwind.config.ts`, `app.config.ts`, `tsconfig.json`, `src/styles/app.css`, route files, domain files, `scripts/verify-static.ts`, and local public assets. [VERIFIED: source inspection]
- Live Bright Builds reference page. [VERIFIED: curl https://www.brightbuilds.us/]
- npm registry version probes for `@solidjs/start`, `solid-js`, `@solidjs/router`, `@solidjs/meta`, `tailwindcss@3.4.19`, `@biomejs/biome`, `typescript`, `vite`, `vite-plugin-solid`, `vitest`, `@playwright/test`, `motion`, `@solid-primitives/spring`, `gsap`, `three`, and `matter-js`. [VERIFIED: npm view]
- Mystic UI pinned repo HEAD. [VERIFIED: git ls-remote https://github.com/pRizz/mystic-ui.git HEAD]
- Solid `onCleanup` lifecycle docs. [CITED: https://docs.solidjs.com/reference/lifecycle/on-cleanup]
- MDN Page Visibility API and `document.visibilityState`. [CITED: https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API; CITED: https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilityState]
- MDN `prefers-reduced-motion`, `pointer`, and `requestAnimationFrame` docs. [CITED: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion; CITED: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer; CITED: https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame]
- Tailwind v3 dark mode docs. [CITED: https://v3.tailwindcss.com/docs/dark-mode]
- OpenLinks identity presence skill. [VERIFIED: /Users/peterryszkiewicz/.codex/skills/openlinks-identity-presence/SKILL.md]

### Secondary (MEDIUM Confidence)

- Playwright emulation docs for viewport and reduced-motion checks if the planner adds automation. [CITED: https://playwright.dev/docs/emulation]
- W3C WCAG focus-visible and target-size guidance for focus and touch target expectations. [CITED: https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html; CITED: https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html]
- OWASP ASVS project page for web-application security-control guidance. [CITED: https://owasp.org/www-project-application-security-verification-standard/]

### Tertiary (LOW Confidence)

- Low-power handling recommendation is based on conservative implementation practice because no dedicated project-supported low-power browser signal was adopted for Phase 4. [ASSUMED]

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - all recommended packages and installed versions were verified from `package.json`, npm registry probes, and Mystic Git HEAD. [VERIFIED: package.json; VERIFIED: npm view; VERIFIED: git ls-remote https://github.com/pRizz/mystic-ui.git HEAD]
- Architecture: HIGH - source inspection and Bright Builds standards agree on CSS-first shared styling plus pure domain boundaries. [VERIFIED: src/styles/app.css; VERIFIED: src/domain/projects.ts; VERIFIED: standards/core/architecture.md at commit 05f8d7a6c9c2e157ec4f922a05273e72dab97676]
- Pitfalls: MEDIUM - cleanup/reduced-motion/layout risks are directly tied to phase requirements and source shape, while some performance-jank details are practical assumptions. [VERIFIED: 04-UI-SPEC.md; VERIFIED: rg source audit; ASSUMED]

**Research date:** 2026-05-26  
**Valid until:** 2026-06-25 for the no-new-dependency implementation path; recheck npm/browser-tool versions within 7 days if adding Playwright or any motion package. [ASSUMED]
