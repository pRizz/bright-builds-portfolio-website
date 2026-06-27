---
generated_by: gsd-discuss-phase
lifecycle_mode: yolo
phase_lifecycle_id: 30-2026-06-27T00-01-15
generated_at: 2026-06-27T00:01:15.464Z
---

# Phase 30: Content Discovery Foundation - Context

**Gathered:** 2026-06-26
**Status:** Ready for planning
**Mode:** Yolo

<domain>

## Phase Boundary

Phase 30 establishes the trusted content discovery foundation for v1.6. Maintainers should have one pure, public-only topic and reference contract that derives canonical topic eligibility, safe public content references, topic paths, and non-leaking lookup behavior from checked-in project, writing, and theme registries before routes, filters/search, feeds, related work, or social previews consume discovery data.

This phase should not build `/topics` pages, add linked label chips, add filtering/search UI, generate RSS or Atom output, rank related-work panels, generate generic/topic preview assets, expand browser checks, or update release-readiness evidence labels. Those surfaces belong to Phases 31-36.

</domain>

<decisions>

## Implementation Decisions

### Topic Identity and Normalization

- **D-01:** Add an explicit canonical topic contract, expected as a small `TopicRecord`-style registry plus alias/label matching helpers, instead of deriving route identities directly from raw project themes/tags, writing topics/tags, or theme titles.
- **D-02:** Canonical topic slugs should be lowercase hyphenated stable URL identifiers. Display labels should preserve authored casing for visitor-facing copy, such as `AI`, `SolidJS`, and `Open web`.
- **D-03:** Raw source labels from public project themes/tags, writing topics/tags, and public theme records should normalize through the canonical topic contract. Unknown labels should not automatically become public topic routes.
- **D-04:** Topic identity must remain distinct from theme pages. Public theme records can contribute topic labels and references, but themes are narrative paths and should not become the only topic authority.
- **D-05:** Canonical topic ordering should be deterministic and curated enough for later `/topics` and filter surfaces. Exact display ordering can be explicit in the topic registry or derived from a stable public reference count plus label sort if that keeps the helper simpler.

### Public Content Reference Contract

- **D-06:** Expose a discriminated `PublicContentReference`-style envelope for public projects, writing, and themes rather than passing full registry records to downstream discovery consumers.
- **D-07:** The envelope should expose only safe shared fields needed by later phases: `kind`, `slug`, `title`, `summary`, `canonicalPath`, normalized canonical topics, original public labels where useful, deterministic `displayOrder`, and optional safe facets such as writing kind/date or project status/source type.
- **D-08:** Public references must compose existing public selectors and path helpers: `publicProjectIndexProjects()` or selected detail helpers where appropriate, `publicWritingEntries()`, `publicThemeEntries()`, `projectStoryHref()` or detail paths, `writingDetailPath()`, and `themeDetailPath()`.
- **D-09:** Downstream phases may add per-consumer payload builders for feeds, related work, or social previews only when those surfaces need stricter shapes. Phase 30 should make the common public reference contract strong enough that consumers do not re-implement visibility checks.

### Non-Leaking Lookup and Fallback Behavior

- **D-10:** Visitor-facing lookup helpers should follow the repo's existing `maybe...` naming and return `null` for unknown, malformed, private, draft, hidden, archived, unsupported, or otherwise non-public topics/references.
- **D-11:** Public helper return values must not let visitor-facing routes distinguish "unknown" from "hidden" or "archived." Detailed reasons belong only in curation validation findings and tests.
- **D-12:** Do not create generic fallback topic objects for unknown topic slugs. Later route work should be able to render a non-leaking not-found/fallback surface from `null`, not a synthetic public topic.
- **D-13:** Internal curation checks may fail fast or return detailed structured findings, but runtime public helpers should stay pure and side-effect free.

### Validation and Curation Gate

- **D-14:** Add a topic/discovery validation module, expected as `src/domain/topic-validation.ts` or similar, with structured findings consistent with project, writing, theme, and social-preview validation patterns.
- **D-15:** Validation should fail for duplicate canonical topic slugs, duplicate or colliding labels/aliases, invalid slugs, empty labels, unsupported source kinds, public references with no canonical topic mapping, and topic references that resolve hidden, draft, archived, unsupported, unselected, or otherwise non-public records.
- **D-16:** Validation should distinguish curation mistakes clearly enough for maintainers to fix the correct topic, project, writing, or theme record, but those diagnostic reasons should not be part of visitor-facing lookup helpers.
- **D-17:** Wire discovery/topic validation into `scripts/verify-curation.ts` beside project, writing, and theme validation once the validator is stable.
- **D-18:** Add focused Vitest coverage for canonical topic derivation, alias normalization, label collision detection, public reference filtering, nullable lookup behavior, hidden-content exclusion, deterministic ordering, and checked-in registry validity.

### Phase Boundary and Deferrals

- **D-19:** Phase 30 should add pure domain helpers, curation validation, and unit tests only. It may include route-safe path helpers such as `topicDetailPath(topic)` so Phase 31 can consume them without duplicating URL rules.
- **D-20:** Defer actual `/topics` routes, static HTML, metadata, sitemap entries, linked chips, filtering/search controls, feed XML/autodiscovery, related-work ranking/panels, social-preview manifests/assets, browser checks, and release-evidence label updates to Phases 31-36.

### the agent's Discretion

- Exact TypeScript type names, helper names, issue-code names, and fixture builders are delegated to implementation as long as nullable lookups use `maybe...`, public helpers are pure data-in/data-out functions, and tests preserve Arrange/Act/Assert structure.
- The planner may decide whether canonical topics live in one `topics.ts` module or a `discovery.ts` module with topic exports, provided downstream consumers have one obvious import surface.
- The planner may choose a conservative initial canonical topic set derived from existing public labels, as long as every public source label is either mapped intentionally or rejected by validation with an actionable finding.

</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Scope

- `.planning/ROADMAP.md` - Phase 30 goal, DISC-04 requirement mapping, success criteria, dependencies, and later-phase boundaries.
- `.planning/REQUIREMENTS.md` - v1.6 discovery, filtering, feed, related-work, preview, and verification requirements plus static-first out-of-scope exclusions.
- `.planning/PROJECT.md` - v1.6 milestone context, curated-content authority, static deployment constraints, and OpenLinks low-intrusion decision.
- `AGENTS.md` - Repo-local dark-primary guidance, Bright Builds workflow requirements, and GSD artifact requirements.
- `AGENTS.bright-builds.md` - Bright Builds baseline workflow, TypeScript, verification, testing, code-shape, and OpenLinks guidance.
- `standards-overrides.md` - No active local exceptions beyond the placeholder table.

### Prior Phase Decisions

- `.planning/milestones/v1.3-phases/14-writing-domain-foundation/14-CONTEXT.md` - Writing registry, public helper, related-project, validation, and no-runtime-content decisions to mirror for discovery references.
- `.planning/milestones/v1.4-phases/19-theme-domain-foundation/19-CONTEXT.md` - Theme registry, relationship resolution, public helper, and curation-gate decisions to mirror for canonical topics.
- `.planning/milestones/v1.5-phases/24-social-image-data-contract/24-CONTEXT.md` - Social preview target derivation from existing public helpers and fallback behavior.
- `.planning/milestones/v1.5-phases/29-archived-project-public-filter-guard/29-CONTEXT.md` - Central public project predicate and archived-content leak prevention.

### Existing Domain Contracts

- `src/domain/projects.ts` - Curated project registry, public project predicate, selected detail pages, route helpers, themes/tags fields, and project path helpers.
- `src/domain/writing.ts` - Public writing registry, topics/tags fields, nullable lookup, route helpers, and related project resolution.
- `src/domain/themes.ts` - Public theme registry, public theme lookup, route helpers, and project/writing relationship resolution.
- `src/domain/routes.ts` - Site route registry, prerender route composition, sitemap route composition, and fallback route lookup style.
- `src/domain/social-previews.ts` - Pure target derivation from public project/writing/theme helpers, fallback social image contract, and structured validation pattern.
- `src/domain/project-validation.ts` - Existing project curation issue shape and registry validation pattern.
- `src/domain/writing-validation.ts` - Writing curation issue shape, duplicate slug validation, date validation, and selected-project relationship checks.
- `src/domain/theme-validation.ts` - Theme curation issue shape, duplicate slug/display-order validation, supported status validation, and public relationship checks.
- `scripts/verify-curation.ts` - Aggregate curation verification script to extend with topic/discovery validation.
- `package.json` - Repo-owned verification scripts, especially `test`, `verify:curation`, and aggregate `verify`.

### Standards

- `standards/core/architecture.md` - Keep discovery decisions in pure data-in/data-out helpers.
- `standards/core/code-shape.md` - Use shallow control flow and `maybe...` naming for nullable values.
- `standards/core/testing.md` - Unit test pure discovery logic with focused Arrange/Act/Assert tests.
- `standards/core/verification.md` - Run repo-native checks before commit and prefer aggregate/owned commands.
- `standards/languages/typescript-javascript.md` - Keep TypeScript domain logic pure, use Bun/repo scripts, and avoid new Python automation.

</canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- `isPublicProjectIndexProject()` in `src/domain/projects.ts` already centralizes archived, hidden, excluded, and index visibility for projects.
- `publicProjectIndexProjects()`, `projectDetailPageProjects()`, `projectStoryHref()`, and `projectDetailPath()` provide the project side of safe public references.
- `publicWritingEntries()`, `maybePublicWritingEntryBySlug()`, `writingDetailPath()`, and `writingDetailRoutes()` provide the writing side of safe public references.
- `publicThemeEntries()`, `maybePublicThemeEntryBySlug()`, `themeDetailPath()`, and `themeDetailRoutes()` provide the theme side of safe public references.
- `socialPreviewTargets()` shows the intended composition pattern: derive downstream targets from existing public selectors instead of maintaining a parallel visibility list.
- Existing validation modules return structured findings and can guide topic/discovery issue shapes.

### Established Patterns

- Domain data lives in `src/domain` as checked-in TypeScript records with pure selector helpers.
- Public route exposure is helper-derived and later imported into route, sitemap, static verification, and browser coverage.
- Nullable lookups use `maybe...` names and return `null` rather than throwing.
- Curation validation is included in the repo-owned `bun run verify:curation` and aggregate `bun run verify` gates.
- Tests use Vitest with Arrange, Act, Assert comments for non-trivial behavior.
- Visitor-facing code should not fetch GitHub, CMS, search-service, feed, or content data at runtime.

### Integration Points

- Phase 30 should primarily touch a new topic/discovery domain module, a validation module, focused unit tests, and `scripts/verify-curation.ts`.
- Phase 31 should consume canonical topic helpers for `/topics`, `/topics/{slug}`, topic metadata, sitemap inclusion, safe label chips, and unknown-topic fallback behavior.
- Phase 32 should consume public references and canonical topics for project and writing filtering/search without visitor-runtime fetches.
- Phase 33 should consume public references and canonical categories only after feed-specific entry rules are added.
- Phase 34 should consume public references and canonical topics for explicit-first, shared-topic fallback related work.
- Phase 35 should consume canonical topic targets only after preview target helpers are extended.
- Phase 36 should expand static, browser, release, and evidence-label verification after the route/UI/feed/preview surfaces exist.

</code_context>

<specifics>

## Specific Ideas

- Treat topics as a stable public discovery vocabulary, not a raw mirror of every authored tag string.
- Keep themes as richer narrative paths that can map to topics, but do not overload theme records as the only topic model.
- Prefer a small canonical topic registry that makes label collisions explicit before route generation.
- Preserve the Phase 29 lesson: public-content eligibility belongs at the selector/reference layer, not in each downstream route, feed, or preview consumer.
- Unknown and non-public inputs should be indistinguishable to public route helpers.

</specifics>

<deferred>

## Deferred Ideas

- `/topics` index and `/topics/{slug}` detail route rendering belong to Phase 31.
- Topic-linked chips across project, writing, theme, and topic pages belong to Phase 31.
- Topic metadata, structured data, sitemap coverage, and static HTML crawler verification belong to Phase 31.
- Project and writing filtering/search UI belongs to Phase 32.
- Static writing-first feed output and autodiscovery belong to Phase 33.
- Centralized related-work ranking and panels belong to Phase 34.
- Generic and topic social preview assets belong to Phase 35.
- Milestone-wide static/browser/release evidence expansion belongs to Phase 36.

</deferred>

---

*Phase: 30-content-discovery-foundation*
*Context gathered: 2026-06-26*
