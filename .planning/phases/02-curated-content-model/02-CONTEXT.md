---
generated_by: gsd-discuss-phase
lifecycle_mode: yolo
phase_lifecycle_id: 2-2026-05-25T23-28-02
generated_at: 2026-05-25T23:35:00.330Z
---

# Phase 2: Curated Content Model - Context

**Gathered:** 2026-05-25
**Status:** Ready for planning
**Mode:** Yolo

<domain>

## Phase Boundary

Phase 2 delivers the authoritative checked-in content model for the portfolio: typed
project/profile/site data, curation taxonomy, validation rules, and static/no-runtime-GitHub
guards. The output should prove curated content is editorially selected and can feed later
portfolio surfaces without mirroring every public GitHub repo.

This phase does not build the final visual project pages, full SEO/social metadata surfaces,
motion layer, optional GitHub metadata refresh tooling, or release verification suite. Those
belong to later phases.

</domain>

<decisions>

## Implementation Decisions

### Registry taxonomy and data shape

- **D-01:** Model publishable work as curated project stories, not raw GitHub repositories. A
  project story may have one or more source links and aliases.
- **D-02:** Use a type-first TypeScript registry with discriminated placement or curation state
  instead of adding a schema/parser dependency in Phase 2.
- **D-03:** The registry must carry explicit placement/curation tier, source type, maturity,
  inclusion flags, display order, themes, tags, role, useful links, status, authored one-line
  copy, and curation reason.
- **D-04:** Make flagship/home placement a stricter state than supporting/lab/archive placement.
  Flagship records must not be representable as vague repo stubs.
- **D-05:** Keep GitHub-derived fields advisory and optional. GitHub metadata may enrich a
  curated record later, but it cannot decide placement, ordering, or whether a project is
  flagship.

### Validation and invalid-state prevention

- **D-06:** Implement pure validation functions that return structured errors and warnings,
  then cover those rules with Vitest.
- **D-07:** Treat missing flagship/home authored copy, curation reason, useful links,
  original-work status, or maturity/status as hard validation errors.
- **D-08:** Treat forks, repros, playgrounds, generated/profile/support repos, unreviewed
  prototypes, and archived work as excluded from flagship/home by default unless explicitly
  promoted with a documented reason.
- **D-09:** Warnings are acceptable for lower-tier review signals, but `bun run verify` should
  fail on hard curation errors.
- **D-10:** Do not add Zod or another parser for the checked-in TypeScript registry in this
  phase. Reserve schema parsing for future boundary inputs such as optional GitHub snapshots.

### Initial curated set

- **D-11:** Include the named Phase 2 review set as explicit project-story records: OpenLinks,
  Free The World, Win3Bitco.in / Open Bitcoin Web Miner, Open Bitcoin, opencode-cloud,
  Zeckendorf, Mystic UI, and selected supporting experiments.
- **D-12:** Represent aliases carefully: `open-links` is the OpenLinks source repo, and
  `open-bitcoin-web-miner` is the concrete repo behind Win3Bitco.in / Open Bitcoin Web Miner.
  Do not invent a `pRizz/open-bitcoin` repo unless a real source link exists.
- **D-13:** Mystic UI may be included as strategically important even though GitHub marks the
  repo as a fork; that promotion requires an explicit curation reason.
- **D-14:** The initial registry should provide enough authored copy and review metadata for
  later pages to select 4-6 flagship presentations, while keeping noisier public repos hidden,
  archived, or lab/supporting by default.

### Static GitHub boundary

- **D-15:** Visitor-critical portfolio content must render from checked-in TypeScript data or
  checked-in static snapshots, never from live browser/runtime GitHub API calls.
- **D-16:** Add a source/runtime guard that allows normal GitHub links but blocks visitor-path
  GitHub API mechanisms such as `fetch` to `api.github.com`, GitHub GraphQL endpoints,
  `@octokit/*`, and browser-exposed GitHub token names in `src/`.
- **D-17:** Extend static verification so generated HTML proves key curated registry/profile
  content exists before hydration.
- **D-18:** Leave optional GitHub metadata refresh scripts and richer snapshots to Phase 5.

### OpenLinks identity presence

- **D-19:** Keep OpenLinks low-intrusion and discoverable. It belongs as a curated project story
  and identity link, with visible footer/about/contact/profile placement and metadata only
  where existing surfaces support it cleanly.
- **D-20:** Do not let OpenLinks displace the Bright Builds portfolio brand or become repetitive
  in nearby UI surfaces.

### the agent's Discretion

- The agent may choose exact TypeScript file boundaries as long as pure curation logic remains
  testable without DOM, network, or Solid runtime dependencies.
- The agent may choose exact validation issue names and selector helper names, provided errors
  and warnings are structured enough for tests and scripts to assert.
- The agent may choose which supporting experiments to include beyond the named set, but must
  keep the selection explicitly reviewed and must not surface every public repo.

</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Planning

- `.planning/PROJECT.md` - project vision, constraints, key decisions, and evolution rules.
- `.planning/REQUIREMENTS.md` - Phase 2 requirements `CUR-01`, `CUR-02`, `CUR-03`, `CUR-05`,
  and `GH-01`.
- `.planning/ROADMAP.md` - Phase 2 goal and success criteria.
- `.planning/STATE.md` - current project state and prior decisions.

### Prior Phase Context

- `.planning/phases/01-static-app-foundation-ui-shell/01-CONTEXT.md` - pure core, static
  foundation, tooling, and Mystic setup decisions.
- `.planning/phases/01.1-dark-primary-visual-rule-and-shell-refactor/01.1-CONTEXT.md` -
  dark-primary rule and visual scope boundary.

### Existing Source

- `src/domain/projects.ts` - current seed project registry and `featuredProjects` selector.
- `src/domain/profile.ts` - profile identity links and OpenLinks sameAs behavior.
- `src/domain/seo.ts` - pure metadata derivation patterns.
- `src/domain/foundation.test.ts` - current Vitest structure and Arrange/Act/Assert style.
- `scripts/verify-static.ts` - static output proof to extend for curated content.

### Instructions and Standards

- `AGENTS.md` - repo-local dark-primary guidance, Bright Builds rules, and GSD enforcement.
- `AGENTS.bright-builds.md` - Bright Builds workflow defaults and OpenLinks owner guidance.
- `standards-overrides.md` - repo-specific exceptions file.

</canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- `src/domain/projects.ts`: already uses `as const satisfies` for typed records and a pure
  featured selector; Phase 2 should evolve this into the authoritative curated registry.
- `src/domain/profile.ts`: already models profile links and `maybeRel`; OpenLinks can stay a
  visible identity link while project records add a richer OpenLinks project story.
- `scripts/verify-static.ts`: already walks generated HTML and can assert route content; extend
  it rather than adding a heavier browser suite in this phase.
- `src/domain/foundation.test.ts`: establishes Vitest tests with explicit Arrange/Act/Assert
  sections for pure domain behavior.

### Established Patterns

- Pure domain modules live under `src/domain/` and should not depend on DOM, network, or Solid
  runtime behavior.
- Bun scripts are the repo-native verification surface; `bun run verify` is the aggregate gate.
- The site is dark-primary by repo rule, but Phase 2 is primarily content/model work and should
  avoid visual-system scope creep.

### Integration Points

- Existing routes currently read `featuredProjects()` and `projectSeeds`; these consumers should
  remain compatible or be updated to use new selectors from the curated registry.
- Static verification should continue to run after `bun run build` and inspect generated HTML.
- Optional future GitHub metadata can attach to the model through static snapshot/advisory fields
  without changing the curated source of truth.

</code_context>

<specifics>

## Specific Ideas

- Current public GitHub facts checked during discussion: `pRizz/free-the-world`,
  `pRizz/open-links`, `pRizz/open-bitcoin-web-miner`, `pRizz/opencode-cloud`, and
  `pRizz/zeckendorf` appear as original public repos; `pRizz/mystic-ui` appears as a fork but is
  strategically important for this portfolio stack.
- The registry should support project names that differ from repo names, such as OpenLinks
  (`open-links`) and Win3Bitco.in / Open Bitcoin Web Miner (`open-bitcoin-web-miner`).
- Use no live visitor GitHub API calls in Phase 2. Any `gh`/GitHub research done during planning
  is developer-side context only and must not become runtime behavior.

</specifics>

<deferred>

## Deferred Ideas

- Zod/schema parsing for JSON, Markdown, or generated snapshot boundary inputs.
- Optional GitHub metadata refresh, pagination, token-safe environment handling, and checked-in
  snapshot generation.
- Playwright network-denial tests for GitHub API calls.
- Search/filtering across a larger project archive.
- Per-project OG image generation and richer project detail pages.

</deferred>

---

*Phase: 02-curated-content-model*
*Context gathered: 2026-05-25*
