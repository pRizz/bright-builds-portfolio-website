---
generated_by: gsd-plan-phase
lifecycle_mode: yolo
phase_lifecycle_id: 01-2026-05-24T18-46-59
generated_at: 2026-05-24T18:52:00.000Z
status: complete
---

# Phase 1 Research: Static App Foundation & UI Shell

## Objective

Research what is needed to plan and implement Phase 1 cleanly: a runnable static-first SolidStart shell, Bun tooling, Tailwind 3, pinned Mystic UI integration, pure derivation modules, and verification scripts.

## Key Findings

### SolidStart Static Shell

- SolidStart uses `app.config.ts` with `defineConfig` from `@solidjs/start/config`.
- Route prerendering is configured under `server.prerender.routes`.
- Phase 1 should explicitly list current indexable routes: `/`, `/about`, `/projects`, and `/contact`.
- Verification must inspect generated output after `bun run build`, because a dev server can hide static-output problems.

### Tooling

- Bun is the package manager/script runner.
- Biome can handle formatting and lint/check commands for TS/TSX/JSON/CSS surfaces.
- TypeScript should use strict mode with `skipLibCheck: true` because Mystic UI is a source-shipped GitHub package.
- Vitest is appropriate for pure domain modules and does not require DOM for Phase 1 tests.
- A small repo-owned script should verify generated static files rather than relying on manual inspection.

### Tailwind and Mystic UI

- Mystic UI should be pinned to `pRizz/mystic-ui#d36017757708ed01ef2b3b47beb14f294726411c`.
- The supported consumer path imports `withMysticUI` from `mystic-ui/tailwind/setup` and `mystic-ui/tailwind/theme.css` from CSS.
- Use Tailwind CSS 3.x and class/selector-based dark mode.
- Keep Mystic use minimal in Phase 1; prove the dependency and CSS path without building final design polish.

### Pure Core

- Route, profile, project, and SEO data should live outside route components.
- Functions that derive nav routes, prerender routes, featured project lists, page metadata, and structured data can be unit tested with plain objects.
- Optional values should use `maybe...` names internally when nullish.

## Validation Architecture

Phase 1 validation should prove:

- `bun run format:check` exits 0.
- `bun run check` exits 0.
- `bun run typecheck` exits 0.
- `bun run test` exits 0.
- `bun run build` exits 0.
- `bun run verify:static` confirms generated HTML exists for `/`, `/about`, `/projects`, and `/contact`.
- Tests cover route derivation, profile links, featured project selection, and SEO metadata derivation.

## Implementation Risks

- **Dependency incompatibility:** researched package versions may not install together. If that happens, keep the SolidStart scaffold's compatible versions and document the reason.
- **Static output location drift:** SolidStart/Nitro output paths can change. The static verification script should search common output roots instead of assuming one exact directory.
- **Mystic UI import drift:** only use README-supported import paths and keep the dependency pinned.
- **False SEO proof:** static verification should inspect generated HTML files, not just successful hydration.

## Planning Recommendation

Use two executable plans:

1. Scaffold the app/tooling/static shell and verify the package scripts exist.
2. Add pure domain modules, unit tests, static-output verification, and run the complete Phase 1 check suite.

The plans should execute sequentially because both touch package/tooling and verification scripts.
