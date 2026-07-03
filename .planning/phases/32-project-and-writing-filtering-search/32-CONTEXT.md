---
generated_by: gsd-discuss-phase
lifecycle_mode: yolo
phase_lifecycle_id: 32-2026-07-03T01-12-38
generated_at: 2026-07-03T01:12:38.240Z
---

# Phase 32: Project and Writing Filtering/Search - Context

**Gathered:** 2026-07-03
**Status:** Ready for planning
**Mode:** Yolo

<domain>

## Phase Boundary

Phase 32 adds accessible in-page search and filtering to the public project and writing index pages. Visitors should be able to narrow checked-in public projects by meaningful labels, status, tier, or source metadata, and narrow public writing by kind, topic, tag, or date-related labels. The default public project and writing content must remain useful in static HTML before hydration.

This phase should not add visitor-runtime content fetches, hosted/semantic/AI search, query-param sharing, crawled faceted route combinations, CMS/admin behavior, feed output, related-work panels, generated social previews, or milestone-wide release evidence expansion. Durable sharing remains through canonical topic routes until a later phase explicitly scopes another sharing model.

</domain>

<decisions>

## Implementation Decisions

### Deterministic Search and Filter Model

- **D-01:** Build a shared pure search/filter helper over the Phase 30 `PublicContentReference` envelope instead of adding a search dependency or duplicating search logic in route components.
- **D-02:** Keep matching deterministic and explainable: normalize case, punctuation, and whitespace; match against safe public fields only; use explicit weights for title, summary, canonical topics, source labels, and public facets; preserve stable display-order tie breaks.
- **D-03:** Do not add Fuse, MiniSearch, hosted search, semantic search, typo tolerance, autocomplete, or search indexing dependencies in this phase. The current corpus favors transparent narrowing over fuzzy relevance.
- **D-04:** Route components may adapt filtered public references back to project and writing card records, but public eligibility, canonical topic matching, normalization, and scoring should live in tested domain code.
- **D-05:** Search/filter helpers must not index hidden, draft, archived, excluded, unsupported, or internal-only fields. They should compose `publicContentReferences()`, `publicProjectIndexProjects()`, and `publicWritingEntries()` rather than raw curated registries.

### Project Index Facets and Results

- **D-06:** Project filters should expose canonical topics plus visitor-friendly tier, public status, and humanized source-type facets. `placement` remains a presentation grouping, not a primary filter.
- **D-07:** Project results should preserve the existing Flagship, Supporting, Lab / Prototype, Writing, and Archive section model for default static content. Filtered results may hide empty sections or render one clear empty state, but should not redesign the page as a flat curation workbench.
- **D-08:** Source-type facets are useful only with readable labels such as `Original`, `Fork / promoted work`, `Prototype / playground`, or equivalent implementation-chosen copy. Avoid leaking internal taxonomy names that do not help visitors.
- **D-09:** Topic labels must continue to resolve through the Phase 31 canonical topic contract. Do not fabricate topic routes or filter identities by slugifying raw labels.
- **D-10:** Project result counts should distinguish visible results from total public results, and reset should restore the original public grouped page state.

### Writing Index Facets and Results

- **D-11:** Writing filters should expose kind, canonical topics, raw public tags, and deterministic date-related labels such as published year or updated year when the date exists.
- **D-12:** Keep the faceted writing controls above the existing writing cards rather than introducing a desktop facet rail or a new card layout. The current corpus is small, but the model should scale as writing grows.
- **D-13:** Writing results should preserve the current note/essay cards, related-project count copy, topic chips, and `Read note` / `Read essay` actions.
- **D-14:** Date labels should come from checked-in `maybePublishedOn` or `maybeUpdatedOn` values only. Do not invent freshness, recency, or update claims.
- **D-15:** Writing reset should restore the original `publicWritingEntries()` order and default static card set.

### In-Page Control Behavior

- **D-16:** Use native, visibly labeled controls in a compact dark-primary control surface: a search input plus grouped facet controls with accessible names, result counts, and an explicit reset button.
- **D-17:** Keep filter state in memory for Phase 32. Do not write query params, crawlable faceted URLs, hash state, localStorage, or sessionStorage.
- **D-18:** Result count updates should be screen-reader discoverable, such as a polite status region, without adding noisy announcements for every unrelated page interaction.
- **D-19:** Empty states should explain that no public project or writing entry matches the current filters and offer reset as the clear next step. Do not imply hidden content exists.
- **D-20:** Controls must support keyboard access, visible focus, adequate touch targets, dark readability, and mobile wrapping without text overlap. Prefer fieldsets, labels, buttons, and checkboxes/selects before custom ARIA patterns.

### Static and SEO Safety

- **D-21:** `/projects` and `/writing` must still render useful public default content in static HTML before hydration. Hydrated filtering should progressively enhance that content rather than replace it with a blank client-only shell.
- **D-22:** Canonical metadata and sitemap behavior should stay unchanged for `/projects` and `/writing`; filter state should not create additional sitemap routes or canonical URLs.
- **D-23:** Topic chips remain the durable sharing path for topic-specific journeys. Filter UI can point visitors to topic routes where useful, but should not compete with canonical topic pages as shareable destinations.

### Verification Strategy

- **D-24:** Keep Phase 32 verification layered. Plan 32-01 should prove the pure search/filter model with focused Vitest tests before UI wiring.
- **D-25:** Plan 32-02 should prove project index controls, static defaults, counts, reset, empty states, and no hidden-content leaks with focused route/static/browser checks.
- **D-26:** Plan 32-03 should prove writing index controls plus keyboard, mobile dark rendering, axe, reduced-motion, reset, result counts, empty states, and text-overlap risks through the existing Playwright browser release patterns.
- **D-27:** Run the repo-owned aggregate verification after implementation: `bun run verify`. Use narrower scripts during development where useful, but do not mark the phase passed until aggregate verification is clean.

### the agent's Discretion

- Exact helper names, facet label copy, score weights, control component boundaries, and CSS class names are delegated to implementation as long as the behavior above is preserved and covered by tests.
- The planner may choose whether the shared search/filter helper lives in `src/domain/content-search.ts`, `src/domain/discovery-search.ts`, or another clear domain module.
- The planner may choose checkbox groups, select controls, or compact button toggles when they meet the accessibility, focus, wrapping, and dark-readability requirements.

</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Scope

- `.planning/ROADMAP.md` - Phase 32 goal, FIND-01 through FIND-05 requirement mapping, plan split, dependencies, and later-phase boundaries.
- `.planning/REQUIREMENTS.md` - Filtering/search requirements, static-first constraints, and v1.6 out-of-scope exclusions.
- `.planning/PROJECT.md` - Current v1.6 state, curated checked-in content authority, static deployment constraints, and OpenLinks low-intrusion decision.
- `.planning/STATE.md` - Current phase position and recent Phase 30/31 decisions affecting search/filter work.
- `.planning/phases/30-content-discovery-foundation/30-CONTEXT.md` - Locked public topic/reference contract, non-leaking lookup behavior, and search/filter deferral.
- `.planning/phases/31-static-topic-routes/31-CONTEXT.md` - Locked topic route, chip, metadata, fallback, and browser verification decisions.
- `.planning/phases/31-static-topic-routes/31-01-SUMMARY.md` - Implemented static topic route helper surface and route patterns.
- `.planning/phases/31-static-topic-routes/31-02-SUMMARY.md` - Implemented safe topic chip component and metadata/JSON-LD patterns.
- `.planning/phases/31-static-topic-routes/31-03-SUMMARY.md` - Implemented static, sitemap, browser, and release verification patterns for topic routes.
- `AGENTS.md` - Repo-local dark-primary UI guidance, Bright Builds workflow requirements, and GSD artifact requirements.
- `AGENTS.bright-builds.md` - Bright Builds baseline workflow, TypeScript, verification, testing, frontend, code-shape, and OpenLinks guidance.
- `standards-overrides.md` - No active local exceptions beyond the placeholder table.

### Existing Domain and UI Contracts

- `src/domain/topics.ts` - `PublicContentReference`, canonical topic helpers, public references, nullable public topic lookup, and deterministic sorting.
- `src/domain/projects.ts` - Public project selectors, project status/tier/source fields, grouped project helpers, route helpers, and hidden/archive exclusion.
- `src/domain/writing.ts` - Public writing selectors, kind/date/topic/tag fields, nullable lookup, route helpers, and related-project helpers.
- `src/components/TopicChip.tsx` - Safe topic chip behavior that links only through canonical topic resolution.
- `src/routes/projects/index.tsx` - Existing project index sections, cards, metadata rows, topic chips, hidden/excluded notice, and page metadata pattern.
- `src/routes/writing/index.tsx` - Existing writing index cards, kind/date labels, topic chips, related project count, and page metadata pattern.
- `src/styles/app.css` - Dark-primary surfaces, chips, input-adjacent visual patterns, focus-visible states, responsive wrapping, and reduced-motion rules.
- `src/domain/routes.ts` - Site route registry, prerender routes, sitemap routes, and route metadata source.
- `src/domain/seo.ts` - Route metadata, ItemList JSON-LD, Person sameAs, fallback image, and static metadata helper patterns.

### Verification Surfaces

- `package.json` - Repo-owned verification scripts, especially `test`, `verify:browser`, `verify:static`, `verify:release`, and aggregate `verify`.
- `tests/browser-release.playwright.ts` - Axe, dark desktop/mobile layout, keyboard focus, reduced-motion, topic-route, and overlap-check patterns to extend for filters.
- `scripts/verify-static/expected-route-text.ts` - Static expected-text route verification pattern for project and writing defaults.
- `scripts/verify-static/metadata-jsonld-verifier.ts` - Static metadata and JSON-LD verification pattern.
- `scripts/verify-static/sitemap-assets-verifier.ts` - Sitemap and unknown-route exclusion verification pattern.
- `scripts/verify-release.ts` - Release evidence and budget checks that should remain truthful and local.

### Standards

- `standards/core/frontend-ui.md` - Dark default, public source/identity disclosure, and OpenLinks low-intrusion product chrome.
- `standards/core/architecture.md` - Keep search/filter business logic in pure data-in/data-out helpers.
- `standards/core/code-shape.md` - Use shallow control flow and `maybe...` naming for nullable values.
- `standards/core/testing.md` - Unit test pure filtering/search logic with focused Arrange/Act/Assert tests.
- `standards/core/verification.md` - Run repo-native checks before commit and prefer aggregate/owned commands.
- `standards/languages/typescript-javascript.md` - Keep TypeScript business logic pure, use Bun/repo scripts, and avoid new Python automation.

</canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- `publicContentReferences()` in `src/domain/topics.ts` already produces safe project, writing, and theme reference envelopes with canonical topics and public facets.
- `publicProjectIndexProjects()`, `projectsByPlacement()`, `projectStoryHref()`, and `hiddenExcludedProjects()` in `src/domain/projects.ts` provide the project index source and grouping logic.
- `publicWritingEntries()`, `writingDetailPath()`, and `relatedProjectDetailPageProjects()` in `src/domain/writing.ts` provide the writing index source and current card facts.
- `TopicChipList` already renders canonical topic links without leaking unsupported labels.
- `ReactiveSurface`, `.project-anchor-card`, `.writing-card`, `.chip`, `.tier-pill`, `.visual-surface`, `.empty-state`, and `.surface-link` provide dark-first reusable UI patterns.

### Established Patterns

- Public route surfaces derive from domain helpers instead of duplicating raw registry visibility checks.
- Nullable public lookups use `maybe...` names and return `null`.
- Route components render static useful content before hydration and layer interactivity around the same checked-in domain data.
- Browser release coverage checks axe, dark layout on desktop/mobile, visible keyboard focus, reduced motion, and overlap risks.
- Static verification reads built `.output/public` HTML, not just source files.

### Integration Points

- Add a pure search/filter domain module and tests before changing route UI.
- Update `src/routes/projects/index.tsx` to render controls and filtered grouped project sections while preserving default static content.
- Update `src/routes/writing/index.tsx` to render controls and filtered writing cards while preserving default static content.
- Add shared CSS for search/filter controls to `src/styles/app.css` using existing dark-primary palette, focus, chip, and wrapping conventions.
- Extend browser and static verification after project and writing filtering UI exists.

</code_context>

<specifics>

## Specific Ideas

- Treat filtering as progressive enhancement, not as a client-only search app.
- Keep topic routes as the shareable/canonical path for topic discovery; filters are local page tools.
- Prefer a visible, explicit reset button over relying on browser-specific search input clear controls.
- Prefer one shared filtering vocabulary and scoring model so projects and writing feel related without forcing identical UI details.
- Preserve the compact, practical index feel from topic pages and avoid turning filters into a large dashboard.

</specifics>

<deferred>

## Deferred Ideas

- Query-param, hash, or persistent shareable filter state belongs to a later phase if it is deliberately scoped.
- Fuzzy search, typo tolerance, autocomplete, local search indexes, hosted search, semantic search, or AI search belong to future work if the corpus grows enough to justify them.
- Static writing-first feed output and feed autodiscovery belong to Phase 33.
- Centralized related-work ranking and panels belong to Phase 34.
- Generic and topic social preview assets belong to Phase 35.
- Milestone-wide release evidence expansion belongs to Phase 36.

</deferred>

***

*Phase: 32-project-and-writing-filtering-search*
*Context gathered: 2026-07-03*
