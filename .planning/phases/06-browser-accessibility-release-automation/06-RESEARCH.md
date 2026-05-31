---
generated_by: gsd-plan-phase
lifecycle_mode: yolo
phase_lifecycle_id: 6-2026-05-31T21-25-37
generated_at: 2026-05-31T21:25:32.082Z
status: complete
---

# Phase 6: Browser & Accessibility Release Automation - Research

## Research Complete

Phase 6 should add a small Playwright-based release check surface that serves `.output/public`, navigates every prerendered route, and asserts the browser-observable behaviors that static verification cannot prove.

## Existing System

- The app already builds static output through SolidStart/Vinxi with `server.preset: "static"` and prerenders routes from `src/domain/routes.ts`.
- `bun run verify` already performs format, lint, typecheck, unit tests, curation checks, no-runtime-GitHub checks, visual-system static checks, build, static checks, and release checks.
- `scripts/verify-release.ts` already catches static accessibility signals such as missing image alt text, focus-visible CSS hooks, reduced-motion CSS output, and interactive motion surface hooks.
- `src/components/ReactiveSurface.tsx` gates pointer motion with `prefers-reduced-motion`, pointer type, viewport size, visibility, and save-data conditions.

## Recommended Technical Approach

1. Add a Bun static server script that serves `.output/public` with SPA-style route fallback to `route/index.html` and correct MIME types for emitted assets.
2. Add `@playwright/test` and `@axe-core/playwright` as dev dependencies, using the versions already documented in the repo stack contract.
3. Add `playwright.config.ts` with Chromium desktop, mobile, and reduced-motion projects.
4. Add one focused browser-release spec that:
   - imports `prerenderRoutes` from `src/domain/routes.ts`,
   - checks `.dark` root and no horizontal overflow on desktop/mobile,
   - checks obvious text/control overlap via DOM geometry,
   - runs axe scans per route,
   - verifies keyboard focus reaches primary navigation, project links, and collaboration/contact paths,
   - verifies reduced-motion removes hover transforms and disables pointer-driven CSS variable updates.
5. Add `bun run verify:browser` after `bun run build` in the aggregate verify command.

## Validation Architecture

- Primary validation command: `bun run verify:browser`.
- Aggregate validation command: `bun run verify`.
- Required build precondition: `.output/public` exists from `bun run build`; the static server should fail with a clear error when the directory is absent.
- Browser route source of truth: `src/domain/routes.ts`.
- Browser failure diagnostics should include route, Playwright project, and a concise finding label.

## Risks and Mitigations

- **False-positive overlap findings:** Limit overlap detection to visible text and interactive targets, ignore ancestor/descendant relationships, and allow a small tolerance.
- **Browser binary availability:** Use standard Playwright install behavior and document any local `playwright install` need through command failure output rather than adding a bespoke installer.
- **Static server drift:** Keep the server simple and repo-owned; do not introduce a general server dependency for one release check.
- **Phase creep into Phase 7:** Do not add Lighthouse, external-link reachability, Cloudflare checklist, or the full aggregate release gate in this phase.

## Planning Notes

- This phase can be one executable plan because the dependency and write set are cohesive: dependency/config/script/test updates plus release command integration.
- No human setup should be required.
- The plan must cover BROW-01, BROW-02, BROW-03, BROW-04, and GATE-01.
