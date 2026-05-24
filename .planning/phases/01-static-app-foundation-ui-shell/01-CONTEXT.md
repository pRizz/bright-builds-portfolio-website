---
generated_by: gsd-discuss-phase
lifecycle_mode: yolo
phase_lifecycle_id: 01-2026-05-24T18-46-59
generated_at: 2026-05-24T18:46:59.134Z
---

# Phase 1: Static App Foundation & UI Shell - Context

**Gathered:** 2026-05-24
**Status:** Ready for planning
**Mode:** Yolo

<domain>

## Phase Boundary

Phase 1 delivers the project foundation only: a runnable SolidJS / SolidStart static-first app shell, Bun-based tooling scripts, Tailwind 3 and pinned Mystic UI setup, base static routes, metadata root, and pure TypeScript seams for route, project, profile, and SEO derivation.

This phase does not build the final portfolio content model, full visual polish, motion effects, optional GitHub enrichment, or production release verification. Those belong to later phases.

</domain>

<decisions>

## Implementation Decisions

### Foundation Shape

- **D-01:** Use a minimal SolidStart app rather than a plain Vite SPA so static prerender and route-level metadata are proven from the beginning.
- **D-02:** Configure explicit prerender routes for `/`, `/about`, `/projects`, and `/contact`; do not depend only on link crawling.
- **D-03:** Keep the initial routes intentionally simple and semantic. They should prove static rendering and navigation, not attempt final portfolio copy or design polish.

### Tooling

- **D-04:** Use Bun as the package manager/script runner and expose scripts for `dev`, `build`, `start`, `format`, `format:check`, `lint`, `check`, `typecheck`, `test`, and `verify`.
- **D-05:** Use Biome for formatting/lint checking, TypeScript for type safety, Vitest for pure module tests, and a custom static-output check for prerender proof.
- **D-06:** Keep verification local and deterministic for Phase 1. Browser, axe, and Lighthouse checks are planned later after UI surfaces exist.

### Styling and UI Library

- **D-07:** Use Tailwind CSS 3.x because Mystic UI's documented consumer path is Tailwind 3.
- **D-08:** Pin Mystic UI to `pRizz/mystic-ui#d36017757708ed01ef2b3b47beb14f294726411c`.
- **D-09:** Wire Mystic UI through the documented Tailwind setup and theme CSS, but use it minimally in Phase 1. Local components should hide UI-library details from domain code.

### Pure Core

- **D-10:** Put route definitions, project/profile seed data, and SEO metadata derivation in pure TypeScript modules with no DOM, network, or Solid runtime dependency.
- **D-11:** Include unit tests for route generation, featured project ordering, profile links, and SEO metadata so Phase 1 proves the functional-core pattern.
- **D-12:** Use `maybe...` names for nullable/optional internal values when they appear in pure modules.

### the agent's Discretion

- The agent may choose exact file names and minimal placeholder route content as long as the phase requirements and acceptance criteria remain satisfied.
- The agent may adapt exact package versions if install/build verification proves a researched version is incompatible, but any deviation must be documented in the phase summary.

</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Planning

- `.planning/PROJECT.md` - project vision, constraints, key decisions, and evolution rules.
- `.planning/REQUIREMENTS.md` - Phase 1 requirements `FOUND-01` through `FOUND-04`.
- `.planning/ROADMAP.md` - Phase 1 goal and success criteria.
- `.planning/STATE.md` - current project state.

### Research

- `.planning/research/SUMMARY.md` - stack, curation, architecture, and risk summary.
- `.planning/research/STACK.md` - specific stack/version recommendations and verification commands.
- `.planning/research/ARCHITECTURE.md` - module boundaries, static route shape, and pure core guidance.
- `.planning/research/PITFALLS.md` - risks around static output, Mystic UI drift, and weak verification.

### Instructions and Standards

- `AGENTS.md` - root repo instructions, Bright Builds rules, GSD workflow enforcement, and generated project stack notes.
- `AGENTS.bright-builds.md` - Bright Builds workflow defaults and owner-specific OpenLinks guidance.
- `standards-overrides.md` - local exceptions file.

</canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- No implementation code exists yet. The repo currently contains planning files, repository instructions, README/license, and Bright Builds automation scripts.

### Established Patterns

- Planning artifacts are committed and tracked through GSD.
- Bright Builds standards require functional core / imperative shell, typed invariants, early returns, `maybe` naming for optional internals, and relevant verification before commit.
- The repo currently has no package manager lockfile, no package scripts, no source directory, and no test runner.

### Integration Points

- New app code should start at the repo root with SolidStart configuration, source files under `src/`, and verification scripts under `scripts/`.
- Phase artifacts should live under `.planning/phases/01-static-app-foundation-ui-shell/`.

</code_context>

<specifics>

## Specific Ideas

- Phase 1 should prove the static stack and pure seams, not the final portfolio UX.
- Mystic UI should be present and pinned, but local wrappers should keep later replacement or fixes isolated.
- The static-output proof should inspect generated HTML files for the base routes after `bun run build`.

</specifics>

<deferred>

## Deferred Ideas

- Final curated project registry and flagship copy belong to Phase 2.
- Full portfolio surfaces and SEO/social polish belong to Phase 3.
- Reactive physics and visual polish belong to Phase 4.
- Optional GitHub metadata sync and release verification belong to Phase 5.

</deferred>

---

*Phase: 01-static-app-foundation-ui-shell*
*Context gathered: 2026-05-24*
