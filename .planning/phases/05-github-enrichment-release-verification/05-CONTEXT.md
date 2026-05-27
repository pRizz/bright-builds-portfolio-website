---
generated_by: gsd-discuss-phase
lifecycle_mode: yolo
phase_lifecycle_id: 5-2026-05-27T11-26-21
generated_at: 2026-05-27T11:27:35.371Z
---

# Phase 5: GitHub Enrichment & Release Verification - Context

**Gathered:** 2026-05-27
**Status:** Ready for planning
**Mode:** Yolo

<domain>

## Phase Boundary

Phase 5 adds optional, static GitHub metadata enrichment for already-curated project stories and proves the production site is ready to release. The phase must not turn the portfolio into a raw GitHub mirror, must not add any runtime browser GitHub API dependency, and must not expose token names or token values in production output.

</domain>

<decisions>

## Implementation Decisions

### Static GitHub Metadata Contract

- **D-01:** GitHub metadata is advisory enrichment attached to curated records, not a source of truth. Authored copy, curation tier, ordering, inclusion, and flagship placement remain controlled by `src/domain/projects.ts`.
- **D-02:** Use a checked-in static snapshot as the runtime data source. The optional refresh path may fetch GitHub metadata at manual/build-prep time, but the built visitor experience must work from checked-in data when GitHub is unavailable.
- **D-03:** Prefer native Bun/TypeScript `fetch` for the sync script instead of adding Octokit or another dependency unless implementation proves the native API path is insufficient.
- **D-04:** Snapshot data should include only public repository metadata needed by the UI: stars, forks, primary language, topics, pushed date, archived/fork/template flags, homepage URL, repository URL, and sync timestamp/status.
- **D-05:** Missing, private, moved, or rate-limited repositories should not break the site. The snapshot should represent unavailable metadata explicitly enough for scripts to report it, while route rendering simply omits unavailable enrichment.

### Enrichment Presentation

- **D-06:** Show GitHub metadata only as secondary project-card context where it improves scanning. Do not let stars, forks, topics, or pushed dates displace problem/approach/why-it-matters copy.
- **D-07:** Keep metadata labels compact and dark-primary. They should inherit the existing chip/surface/link visual language and must not introduce a light-first exception.
- **D-08:** Homepage URLs from GitHub metadata can enrich a project only when they are present and non-empty; they must not replace curated `live`, `docs`, or `repo` links.
- **D-09:** Topic/language data may be displayed or used in verification, but curated themes and tags remain the meaningful portfolio taxonomy.

### Token and Runtime Safety

- **D-10:** Sync scripts may read server/local environment variables, but no visitor-bundled `src/` code may read token variables or import GitHub API clients.
- **D-11:** Public token names such as `VITE_*GITHUB*TOKEN`, `PUBLIC_*GITHUB*TOKEN`, and `SOLID_PUBLIC_*GITHUB*TOKEN` are forbidden in source paths that can influence the frontend bundle and in generated production output.
- **D-12:** Release verification should scan built HTML, JS, CSS, and static assets for forbidden GitHub API endpoints, GitHub client libraries, token names, and token-like output.
- **D-13:** Planning and docs may explain which non-public environment variable the sync script accepts, but must not include token values or encourage browser-exposed token prefixes.

### Release Verification Surface

- **D-14:** Add a repo-owned release verification entrypoint that composes existing checks rather than hand-maintaining an untracked release checklist.
- **D-15:** Release checks should cover pure unit behavior, curation validity, no runtime GitHub API dependency, static output metadata, token safety, reduced-motion/static visual invariants, primary internal links/anchors, static asset locality, basic accessibility semantics, and practical performance/SEO budgets.
- **D-16:** Keep routine verification dependency-light. Prefer Bun scripts and static-output checks already aligned with `bun run verify`; browser evidence may use local browser automation in verification notes when needed, but do not add Playwright, axe, or Lighthouse dependencies unless the plan proves they are necessary and maintainable.
- **D-17:** Browser and accessibility claims should be evidence-based. At minimum, Phase 5 verification must run the production build and release verifier, and it should record any manual/browser evidence that cannot be encoded safely in a routine script.

### Documentation and Release Readiness

- **D-18:** Update project docs with local setup, build/release commands, deployment assumptions, curation maintenance rules, and the optional GitHub metadata refresh flow.
- **D-19:** Documentation should preserve the existing static/no-runtime-GitHub boundary and explain that enrichment is optional.
- **D-20:** Fix any small planning-drift found while completing Phase 5 when it is directly related to release readiness, such as the Phase 4 `2/3` vs `3/3` roadmap mismatch.

### the agent's Discretion

- The agent may choose exact file names and helper boundaries for the snapshot/parser/sync implementation, provided pure domain behavior stays under `src/domain/` and side-effecting fetch/write behavior stays in `scripts/`.
- The agent may choose the exact project-card metadata layout as long as it stays secondary, dark-primary, responsive, and static before hydration.
- The agent may choose practical release budgets and accessibility heuristics based on the current static output, then document residual risks where a heavier external suite would be needed later.

</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Planning

- `.planning/PROJECT.md` - project vision, constraints, key decisions, and static portfolio scope.
- `.planning/REQUIREMENTS.md` - Phase 5 requirements `GH-02`, `GH-03`, `GH-04`, `VER-01`, `VER-02`, `VER-03`, `VER-04`, and `VER-05`.
- `.planning/ROADMAP.md` - Phase 5 goal and success criteria.
- `.planning/STATE.md` - current project state, prior decisions, and release-readiness notes.

### Prior Phase Context

- `.planning/phases/02-curated-content-model/02-CONTEXT.md` - curated registry, validation, static GitHub boundary, and OpenLinks decisions.
- `.planning/phases/03-portfolio-surfaces-seo/03-CONTEXT.md` - portfolio routes, static SEO, structured data, assets, and no-runtime-GitHub decisions.
- `.planning/phases/04-visual-system-motion/04-CONTEXT.md` - dark-primary visual system, reduced-motion, motion cleanup, and verification decisions.
- `.planning/phases/04-visual-system-motion/04-03-SUMMARY.md` - current aggregate verification and browser evidence baseline.

### Existing Source

- `src/domain/projects.ts` - authoritative curated project registry and project selectors.
- `src/domain/project-validation.ts` - curation validation and invalid-state prevention patterns.
- `src/domain/seo.ts` - pure route metadata, sitemap, robots, and JSON-LD derivation.
- `src/routes/projects.tsx` - grouped project cards and stable project anchors where enrichment can render.
- `scripts/verify-curation.ts` - curation verification entrypoint.
- `scripts/verify-no-github-runtime.ts` - source guard for visitor-runtime GitHub API and token mechanisms.
- `scripts/verify-static.ts` - generated static HTML, metadata, asset, reduced-motion, and no-runtime-GitHub proof.
- `scripts/generate-static-metadata.ts` - checked-in static metadata generation pattern.
- `package.json` - Bun script surface and aggregate `verify` command.
- `README.md` and `CONTRIBUTING.md` - project docs to update for release readiness.

### Instructions and Standards

- `AGENTS.md` - repo-local dark-primary guidance, Bright Builds rules, GSD workflow enforcement, and generated stack notes.
- `AGENTS.bright-builds.md` - Bright Builds workflow defaults and owner-specific OpenLinks guidance.
- `standards-overrides.md` - repo-specific exceptions file.
- `/Users/peterryszkiewicz/Repos/coding-and-architecture-requirements/standards/index.md` - Bright Builds canonical standards entrypoint.
- `/Users/peterryszkiewicz/Repos/coding-and-architecture-requirements/standards/core/architecture.md` - functional core and boundary parsing expectations.
- `/Users/peterryszkiewicz/Repos/coding-and-architecture-requirements/standards/core/code-shape.md` - code shape, `maybe` naming, and script readability expectations.
- `/Users/peterryszkiewicz/Repos/coding-and-architecture-requirements/standards/core/verification.md` - sync-first and repo-native verification expectations.
- `/Users/peterryszkiewicz/Repos/coding-and-architecture-requirements/standards/core/testing.md` - unit testing expectations.
- `/Users/peterryszkiewicz/Repos/coding-and-architecture-requirements/standards/languages/typescript-javascript.md` - Bun, TypeScript, functional-core, and no-new-Python expectations.

</canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- `src/domain/projects.ts`: already exposes curated project stories with repo/live/docs links, stable slugs, placement, display order, curated tags/themes, and selectors. GitHub enrichment should key off these slugs and links without changing curation authority.
- `src/domain/project-validation.ts`: already shows pure validation with structured issue codes and `maybe` naming; metadata validation should follow this shape.
- `src/routes/projects.tsx`: project cards have compact metadata areas, chip rows, and link lists where optional repository stats can render without changing route semantics.
- `scripts/verify-no-github-runtime.ts`: existing source scanner can remain focused on `src/`; Phase 5 can add a built-output/token release scanner without weakening this guard.
- `scripts/verify-static.ts`: already verifies static route HTML, metadata, assets, reduced motion, remote asset blocking, and no-runtime-GitHub output checks after build.

### Established Patterns

- Pure data and derivation live in `src/domain/`; side effects and filesystem/network work live in `scripts/`.
- Static output under `.output/public` is the release proof surface after `bun run build`.
- Route components emit meaningful content, links, metadata, and JSON-LD before hydration.
- The repo uses Bun scripts and Biome/Vitest/TypeScript for routine verification; `bun run verify` is the aggregate gate.
- The UI is dark-primary by default and uses shared CSS classes in `src/styles/app.css` for cards, chips, links, focus states, and responsive stability.

### Integration Points

- Add a checked-in GitHub metadata snapshot module or data file that is imported only by pure domain helpers and route components.
- Add a sync script under `scripts/` that reads curated repo links, fetches public GitHub metadata, writes the snapshot, and exits cleanly when metadata is unavailable unless a strict mode is requested.
- Extend project-card rendering to call a pure metadata helper and render optional stats/chips.
- Add tests for metadata parsing, enrichment, unavailable fallback, and curated-authority boundaries.
- Add a release verifier script and wire it into the aggregate verification path after build/static checks.
- Update README/CONTRIBUTING with setup, build, deploy, curation, metadata refresh, and release commands.

</code_context>

<specifics>

## Specific Ideas

No user-specific references were provided during this yolo pass. Use standard, conservative release-readiness behavior aligned with the existing static portfolio architecture.

</specifics>

<deferred>

## Deferred Ideas

- Scheduled GitHub metadata refresh in CI remains v2 scope unless Phase 5 implementation finds a low-risk docs-only mention. Manual/local refresh is enough for v1.
- Per-project Open Graph image generation remains v2 scope.
- Heavy Playwright/axe/Lighthouse dependency adoption is deferred unless implementation proves the current static/release verifier cannot meet v1 release-readiness evidence.

</deferred>

---

*Phase: 05-github-enrichment-release-verification*
*Context gathered: 2026-05-27*
