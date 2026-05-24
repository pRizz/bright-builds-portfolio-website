# Phase 1: Static App Foundation & UI Shell - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-05-24
**Phase:** 1 - Static App Foundation & UI Shell
**Mode:** Yolo
**Areas discussed:** Foundation shape, tooling, styling and UI library, pure core

---

## Foundation Shape

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal SolidStart static shell | Proves SolidStart route prerendering, metadata root, and app structure without final UX scope. | yes |
| Plain Vite SPA | Simpler setup but weaker static SEO proof. | |
| Astro/Solid hybrid | Strong static story but does not match the requested SolidJS-first stack. | |

**User's choice:** Auto-selected recommended default.
**Notes:** Project brief requested SolidJS, static generation, SEO, and Mystic UI compatibility.

---

## Tooling

| Option | Description | Selected |
|--------|-------------|----------|
| Bun + Biome + TypeScript + Vitest + static-output check | Matches Bright Builds TS guidance and proves Phase 1 requirements locally. | yes |
| npm/pnpm + ESLint + Vitest | Common, but not the preferred greenfield repo default. | |
| Minimal scripts only | Faster scaffold, but fails Phase 1 verification expectations. | |

**User's choice:** Auto-selected recommended default.
**Notes:** Phase 1 explicitly requires documented run/build/typecheck/format/lint/test scripts.

---

## Styling and UI Library

| Option | Description | Selected |
|--------|-------------|----------|
| Tailwind 3 with pinned Mystic UI | Follows Mystic UI consumer docs and Bright Builds standards. | yes |
| Tailwind 4 | Current Tailwind line, but Mystic UI support is not the researched consumer path. | |
| No Mystic UI until later | Simpler, but Phase 1 success criteria asks to prove pinned Mystic setup. | |

**User's choice:** Auto-selected recommended default.
**Notes:** Mystic UI is adopted minimally in Phase 1 to avoid coupling domain code to UI-library details.

---

## Pure Core

| Option | Description | Selected |
|--------|-------------|----------|
| Pure route/profile/project/SEO modules with unit tests | Directly satisfies `FOUND-04` and Bright Builds architecture guidance. | yes |
| Put data directly in route components | Faster initially but hides business decisions inside UI shell code. | |
| Defer tests | Would leave the functional-core pattern unproven. | |

**User's choice:** Auto-selected recommended default.
**Notes:** Tests should focus on deterministic route, project, profile, and metadata derivation.

## the agent's Discretion

- Exact file names and minimal route content.
- Exact package versions if install/build verification proves researched versions incompatible.

## Deferred Ideas

- Final content model, portfolio surfaces, motion, GitHub enrichment, and release checks remain in later phases.
