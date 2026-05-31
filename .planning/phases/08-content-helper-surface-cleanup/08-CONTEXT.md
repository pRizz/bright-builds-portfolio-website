---
generated_by: gsd-discuss-phase
lifecycle_mode: yolo
phase_lifecycle_id: 8-2026-05-31T23-03-14
generated_at: 2026-05-31T23:03:14.542Z
---

# Phase 8: Content Helper Surface Cleanup - Context

**Gathered:** 2026-05-31
**Status:** Ready for planning
**Mode:** Yolo

<domain>
## Phase Boundary

Phase 8 makes the curated project data API intentional. It resolves seed-era helper ambiguity in `src/domain/projects.ts`, documents the supported selector surface for maintainers, and adds regression checks so visitor-facing portfolio routes do not depend on orphaned legacy helper exports.

This phase is cleanup and guardrails only. It should preserve existing project ordering, copy, metadata, route output, and GitHub enrichment behavior.

</domain>

<decisions>
## Implementation Decisions

### Helper Ownership
- **D-01:** Treat `curatedProjects` as the authoritative checked-in registry and selector functions such as `homeProjects`, `publicProjectIndexProjects`, `visibleProjects`, `hiddenExcludedProjects`, `currentFocusProjects`, `projectsByPlacement`, `writingProjects`, `projectAnchorHref`, and `projectLinkDisplayLabel` as the supported maintainer-facing API.
- **D-02:** Remove or deprecate seed-era aliases that add no meaning. `projectSeeds` should not remain a runtime-facing export unless a test fixture explicitly needs that legacy name, and current code does not show a fixture-only consumer.
- **D-03:** Replace ambiguous link helpers with an intentionally named selector if they are still useful. `primaryProjectLink` should either become a documented selector with explicit semantics or be replaced by a name that tells maintainers why the first link is selected.

### Runtime Guardrails
- **D-04:** Add an import-surface guard that fails if `src/routes/**/*.tsx`, `src/components/**/*.tsx`, or other visitor-runtime source imports `projectSeeds` or other legacy helper names from `src/domain/projects`.
- **D-05:** Keep build-time scripts allowed to import the authoritative registry and supported selector APIs, but they should not use seed-era aliases.
- **D-06:** Prefer a small repo-owned Bun/TypeScript verifier over a new dependency. The verifier should be deterministic, path-scoped, and wired into `bun run verify`.

### Maintainer Update Path
- **D-07:** Document the supported curated project selector API close to the data module or in an existing maintainer-facing document so future project data edits use the intentional surface.
- **D-08:** Add unit coverage for helper export behavior and import guard behavior. Tests should prove existing curated project behavior remains unchanged while seed-era helper dependencies are blocked.
- **D-09:** Keep runtime portfolio routes on selector APIs; do not broaden the public UI or add new project content in this phase.

### the agent's Discretion
- The exact replacement name for `primaryProjectLink`, if the implementation keeps a first-link selector.
- Whether the import guard lives in a new script or an existing verifier, as long as `bun run verify` fails on forbidden runtime imports.
- Whether documentation is a TSDoc block in `src/domain/projects.ts`, a short README section, or both, as long as maintainers can find the supported selector contract.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Scope
- `.planning/ROADMAP.md` — Phase 8 goal and success criteria.
- `.planning/REQUIREMENTS.md` — DATA-01, DATA-02, and DATA-03 definitions and traceability.
- `.planning/PROJECT.md` — Current milestone goal and seed-era helper cleanup target.
- `.planning/STATE.md` — Current v1.1 state after Phase 7 completion.

### Repo Instructions and Standards
- `AGENTS.md` — GSD workflow requirement plus repo-local dark-primary guidance.
- `AGENTS.bright-builds.md` — Bright Builds verification, TypeScript, and workflow defaults.
- `standards-overrides.md` — Local exceptions placeholder; no active Phase 8 exception.

### Existing Code and Verification Surfaces
- `src/domain/projects.ts` — Curated project registry, selector helpers, `projectSeeds`, and `primaryProjectLink`.
- `src/domain/foundation.test.ts` — Current curated project registry and selector compatibility tests.
- `src/domain/portfolio-surfaces.test.ts` — Current visitor-facing project selector and SEO behavior tests.
- `src/domain/project-validation.ts` — Existing curation validation rules.
- `src/domain/project-validation.test.ts` — Current curation validation coverage.
- `src/routes/index.tsx` — Home route runtime use of curated project selectors.
- `src/routes/projects.tsx` — Projects route runtime use of curated project selectors.
- `scripts/verify-curation.ts` — Existing curated registry verification command.
- `scripts/verify-no-github-runtime.ts` — Existing deterministic source-scan verifier pattern.
- `package.json` — Aggregate `bun run verify` contract.

### Prior Phase Context
- `.planning/phases/07-release-gates-deploy-readiness/07-CONTEXT.md` — Keeps `bun run verify` as the aggregate release command and avoids new fragile runtime checks.
- `.planning/phases/07-release-gates-deploy-readiness/07-VERIFICATION.md` — Confirms release-readiness gates are in place before helper cleanup.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/domain/projects.ts`: Already centralizes the registry, selector helpers, anchor generation, link labels, and sorting.
- `scripts/verify-no-github-runtime.ts`: Provides a simple recursive source scan pattern suitable for a no-legacy-helper runtime import guard.
- `src/domain/portfolio-surfaces.test.ts`: Already verifies public selector behavior and can host focused behavior assertions for helper cleanup.
- `package.json`: `bun run verify` already aggregates format, Biome, typecheck, tests, curation, no-runtime-GitHub, visual-system, build, browser, static, and release checks.

### Established Patterns
- Pure project data helpers live in `src/domain/projects.ts`.
- Unit tests use Vitest with Arrange, Act, Assert comments.
- Verifier scripts are dependency-free TypeScript run through Bun and print clear pass/fail evidence.
- Release confidence work should strengthen checks without changing visitor-facing content.

### Integration Points
- Update `src/domain/projects.ts` to remove or rename ambiguous helper exports while preserving selector behavior.
- Add or update tests under `src/domain/` for behavior and under `scripts/` for import guard behavior.
- Wire any new verifier into `package.json` and the aggregate `verify` script.

</code_context>

<specifics>
## Specific Ideas

- Prefer root-cause cleanup over documenting obviously stale aliases.
- Keep existing curated project behavior unchanged: flagship/home order, visible/hidden filtering, project anchor hrefs, writing grouping, and JSON-LD inputs should still match current tests.
- The import guard should target visitor-runtime source paths, not planning files or generated build output.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 08-content-helper-surface-cleanup*
*Context gathered: 2026-05-31*
