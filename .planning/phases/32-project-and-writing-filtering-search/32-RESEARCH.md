# Phase 32: Project and Writing Filtering/Search - Research

**Researched:** 2026-07-03
**Domain:** SolidStart static-first in-page filtering, deterministic content search, accessible dark-primary controls
**Confidence:** HIGH

<user_constraints>

## User Constraints (from CONTEXT.md)

The following locked decisions, discretion areas, and deferred ideas are copied from `.planning/phases/32-project-and-writing-filtering-search/32-CONTEXT.md`. [VERIFIED: `.planning/phases/32-project-and-writing-filtering-search/32-CONTEXT.md`]

### Locked Decisions

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

### Deferred Ideas (OUT OF SCOPE)

- Query-param, hash, or persistent shareable filter state belongs to a later phase if it is deliberately scoped.
- Fuzzy search, typo tolerance, autocomplete, local search indexes, hosted search, semantic search, or AI search belong to future work if the corpus grows enough to justify them.
- Static writing-first feed output and feed autodiscovery belong to Phase 33.
- Centralized related-work ranking and panels belong to Phase 34.
- Generic and topic social preview assets belong to Phase 35.
- Milestone-wide release evidence expansion belongs to Phase 36.

</user_constraints>

## Project Constraints (from AGENTS.md)

- Use `AGENTS.md` as the repo-local instruction entrypoint, read `AGENTS.bright-builds.md`, read `standards-overrides.md`, and load task-relevant standards before planning or implementation. [VERIFIED: `AGENTS.md`] [VERIFIED: `AGENTS.bright-builds.md`] [VERIFIED: `standards/index.md`]
- The site is dark-primary; new user-facing UI should use dark surfaces, accessible text contrast, visible focus, and desktop/mobile dark visual verification. [VERIFIED: `AGENTS.md`] [VERIFIED: `standards/core/frontend-ui.md`]
- Treat light-first utilities such as `bg-white`, `bg-stone-50`, and `text-zinc-950` as exceptions needing a local reason. [VERIFIED: `AGENTS.md`]
- Keep business logic in pure data-in/data-out TypeScript helpers, with framework/DOM work as the shell. [VERIFIED: `standards/core/architecture.md`] [VERIFIED: `standards/languages/typescript-javascript.md`]
- Use shallow control flow and `maybe...` naming for nullable or optional internal values. [VERIFIED: `standards/core/code-shape.md`] [VERIFIED: `standards/languages/typescript-javascript.md`]
- Unit tests for pure business logic are mandatory, focused on one concern, and should use Arrange, Act, Assert comments when structure is non-trivial. [VERIFIED: `standards/core/testing.md`]
- Use repo-owned Bun scripts and do not add new Python automation in this Bun-friendly TypeScript repository. [VERIFIED: `standards/languages/typescript-javascript.md`] [VERIFIED: `package.json`]
- Prefer repo-owned verification commands, and run relevant verification before commit; aggregate `bun run verify` is the phase gate required by Phase 32. [VERIFIED: `standards/core/verification.md`] [VERIFIED: `package.json`] [VERIFIED: `.planning/phases/32-project-and-writing-filtering-search/32-CONTEXT.md`]
- Keep Markdown body separators away from standalone `---`; use headings or `***` after frontmatter because GSD Markdown parsers treat standalone `---` specially. [VERIFIED: `AGENTS.md`]
- Preserve OpenLinks as a low-intrusion identity surface in footer/profile/metadata-style areas; do not add aggressive or primary OpenLinks promotion to project/writing filter surfaces. [VERIFIED: `AGENTS.bright-builds.md`] [VERIFIED: `/Users/peterryszkiewicz/.codex/skills/openlinks-identity-presence/SKILL.md`] [VERIFIED: `.planning/PROJECT.md`]
- `standards-overrides.md` contains only the placeholder table and no active local exception for this phase. [VERIFIED: `standards-overrides.md`]
- No project-local skill indexes were found under `.claude/skills/` or `.agents/skills/`. [VERIFIED: `find .claude/skills .agents/skills -maxdepth 2 -name SKILL.md`]

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FIND-01 | Visitor can filter or search the public project index by meaningful public labels, status, tier, or source metadata without visitor-runtime content fetches. [VERIFIED: `.planning/REQUIREMENTS.md`] | Use `publicContentReferences()` for safe searchable fields and `publicProjectIndexProjects()` for route card records; keep filters in memory and do not add runtime fetches. [VERIFIED: `src/domain/topics.ts`] [VERIFIED: `src/domain/projects.ts`] [VERIFIED: `scripts/verify-no-github-runtime.ts`] |
| FIND-02 | Visitor can filter or search the public writing index by kind, topic, tag, or date-related labels without visitor-runtime content fetches. [VERIFIED: `.planning/REQUIREMENTS.md`] | Use `publicWritingEntries()` and writing references from `publicContentReferences()`; derive date labels only from `maybePublishedOn` and `maybeUpdatedOn`. [VERIFIED: `src/domain/writing.ts`] [VERIFIED: `src/domain/topics.ts`] |
| FIND-03 | Project and writing discovery surfaces render useful default public content in static HTML before hydration. [VERIFIED: `.planning/REQUIREMENTS.md`] | Keep module-scope default lists and static card rendering; extend static verification that reads built `.output/public` pre-hydration HTML. [VERIFIED: `src/routes/projects/index.tsx`] [VERIFIED: `src/routes/writing/index.tsx`] [VERIFIED: `scripts/verify-static/route-html-verifier.ts`] |
| FIND-04 | Filter/search controls expose labels, result counts, empty state, reset behavior, keyboard access, visible focus, dark readability, and mobile text wrapping. [VERIFIED: `.planning/REQUIREMENTS.md`] | Use native `input`, `label`, `fieldset`, `legend`, checkbox/select/button controls, `aria-live="polite"` or `role="status"` for counts, and extend Playwright axe/layout/focus coverage. [CITED: `https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/search`] [CITED: `https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/fieldset`] [CITED: `https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-live`] [VERIFIED: `tests/browser-release.playwright.ts`] |
| FIND-05 | Filter/search state avoids crawlable faceted URL explosion; durable sharing happens through canonical topic routes unless a later phase explicitly scopes query-param sharing. [VERIFIED: `.planning/REQUIREMENTS.md`] | Do not use query params, hash state, sitemap additions, or canonical changes; rely on Phase 31 topic routes and existing sitemap/canonical verification. [VERIFIED: `.planning/phases/32-project-and-writing-filtering-search/32-CONTEXT.md`] [VERIFIED: `src/domain/routes.ts`] [VERIFIED: `scripts/verify-static/sitemap-assets-verifier.ts`] [CITED: `https://developers.google.com/crawling/docs/faceted-navigation`] |

</phase_requirements>

## Summary

Phase 32 should be planned as progressive enhancement over the existing static project and writing indexes. [VERIFIED: `src/routes/projects/index.tsx`] [VERIFIED: `src/routes/writing/index.tsx`] The public content model already has the safe envelope this phase needs: `PublicContentReference` contains `kind`, `slug`, `title`, `summary`, `canonicalPath`, `canonicalTopics`, `sourceLabels`, `displayOrder`, and narrow public facets for project status/source type and writing kind/date. [VERIFIED: `src/domain/topics.ts`]

**Primary recommendation:** Add one pure search/filter domain module, then wire project and writing route components to Solid signals/memos while preserving static default card markup before hydration. [VERIFIED: `.planning/phases/32-project-and-writing-filtering-search/32-CONTEXT.md`] [CITED: `https://docs.solidjs.com/reference/basic-reactivity/create-signal`] [CITED: `https://docs.solidjs.com/reference/basic-reactivity/create-memo`]

No search dependency should be added in this phase. [VERIFIED: `.planning/phases/32-project-and-writing-filtering-search/32-CONTEXT.md`] The current checked-in corpus is 10 public projects, 2 public writing entries, 2 public themes, and 13 public topics, which is small enough for deterministic in-memory filtering over checked-in arrays. [VERIFIED: `bun --eval publicProjectIndexProjects/publicWritingEntries/publicContentReferences/publicTopics count audit`]

## Standard Stack

### Core

| Library / Surface | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Repo-owned TypeScript domain module, recommended `src/domain/content-search.ts` | New local file | Query normalization, field extraction, facet derivation, scoring, sorting, and result envelopes. [VERIFIED: `.planning/phases/32-project-and-writing-filtering-search/32-CONTEXT.md`] | Bright Builds architecture requires business logic as pure data-in/data-out helpers, and Phase 32 requires tested domain search/filter logic before UI wiring. [VERIFIED: `standards/core/architecture.md`] [VERIFIED: `.planning/phases/32-project-and-writing-filtering-search/32-CONTEXT.md`] |
| `PublicContentReference` from `src/domain/topics.ts` | Existing local type | Shared safe searchable envelope for public project and writing references. [VERIFIED: `src/domain/topics.ts`] | It composes public selectors and excludes hidden, draft, archived, excluded, unsupported, and internal-only fields. [VERIFIED: `src/domain/topics.ts`] [VERIFIED: `src/domain/topics.test.ts`] |
| SolidJS | Repo pin `1.9.13`; registry latest observed `1.9.14`; pin published `2026-05-15T17:36:58.458Z`. [VERIFIED: `package.json`] [VERIFIED: npm registry] | Local filter state through `createSignal()`, derived result state through `createMemo()`, and list rendering through `<For>`. [CITED: `https://docs.solidjs.com/reference/basic-reactivity/create-signal`] [CITED: `https://docs.solidjs.com/reference/basic-reactivity/create-memo`] [CITED: `https://docs.solidjs.com/reference/components/for`] | The repo already uses Solid route components and imports `For` and `Show` from `solid-js`. [VERIFIED: `src/routes/projects/index.tsx`] [VERIFIED: `src/routes/writing/index.tsx`] |
| SolidStart / Vinxi static preset | `@solidjs/start@1.3.2`, `vinxi@0.5.11`; both match registry latest observed. [VERIFIED: `package.json`] [VERIFIED: npm registry] | Preserve static output for `/projects` and `/writing`; no new routes are required for filter state. [VERIFIED: `app.config.ts`] | SolidStart route prerendering produces static HTML during build and is suited to content-rich SEO pages. [CITED: `https://docs.solidjs.com/solid-start/building-your-application/route-prerendering`] |
| `@solidjs/meta` | Repo pin `0.29.4`; registry latest observed `0.29.4`; pin published `2024-05-15T15:14:56.977Z`. [VERIFIED: `package.json`] [VERIFIED: npm registry] | Keep existing title, canonical, OG/Twitter, and JSON-LD patterns unchanged on `/projects` and `/writing`. [VERIFIED: `src/routes/projects/index.tsx`] [VERIFIED: `src/routes/writing/index.tsx`] | SolidStart docs point to `@solidjs/meta` for route-specific head metadata, and this repo already uses it. [CITED: `https://docs.solidjs.com/solid-start/building-your-application/head-and-metadata`] [VERIFIED: `src/routes/projects/index.tsx`] |
| Bun scripts | `packageManager: bun@1.3.14`; local Bun `1.3.9`. [VERIFIED: `package.json`] [VERIFIED: `bun --version`] | Run tests, static build, browser checks, and aggregate verification. [VERIFIED: `package.json`] | Repo-owned scripts define the verification contract and Phase 32 requires `bun run verify` before phase completion. [VERIFIED: `package.json`] [VERIFIED: `.planning/phases/32-project-and-writing-filtering-search/32-CONTEXT.md`] |

### Supporting

| Library / Surface | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Vitest | Repo pin `4.1.7`; registry latest observed `4.1.9`; pin published `2026-05-20T07:19:42.142Z`. [VERIFIED: `package.json`] [VERIFIED: npm registry] | Unit-test pure query normalization, scoring, facet derivation, public filtering, and sort tie-breaks. [VERIFIED: `src/domain/topics.test.ts`] | Use in Plan 32-01 before UI wiring. [VERIFIED: `.planning/phases/32-project-and-writing-filtering-search/32-CONTEXT.md`] |
| Playwright | Repo pin `@playwright/test@1.60.0`; registry latest observed `1.61.1`; pin published `2026-05-11T19:09:45.394Z`; local CLI reports `Version 1.60.0`. [VERIFIED: `package.json`] [VERIFIED: npm registry] [VERIFIED: `./node_modules/.bin/playwright --version`] | Browser verification for axe, keyboard focus, dark desktop/mobile layout, reduced motion, result counts, reset, and empty states. [VERIFIED: `tests/browser-release.playwright.ts`] | Use in Plans 32-02 and 32-03 after route UI exists. [VERIFIED: `.planning/phases/32-project-and-writing-filtering-search/32-CONTEXT.md`] |
| `@axe-core/playwright` | Repo pin `4.11.3`; registry latest observed `4.12.1`; pin published `2026-04-30T11:05:25.824Z`. [VERIFIED: `package.json`] [VERIFIED: npm registry] | Automated accessibility scans for each prerendered route. [VERIFIED: `tests/browser-release.playwright.ts`] | Extend existing browser release checks rather than adding another accessibility runner. [VERIFIED: `tests/browser-release.playwright.ts`] |
| Biome | Repo pin `2.4.15`; registry latest observed `2.5.2`; pin published `2026-05-09T17:08:10.962Z`. [VERIFIED: `package.json`] [VERIFIED: npm registry] | Format/lint changed TypeScript, TSX, CSS, scripts, and tests. [VERIFIED: `package.json`] | Use through existing `bun run format:check`, `bun run check`, or aggregate `bun run verify`. [VERIFIED: `package.json`] |
| Tailwind CSS | Repo pin `3.4.19`; registry latest observed `4.3.2`; pin published `2025-12-10T18:40:42.410Z`. [VERIFIED: `package.json`] [VERIFIED: npm registry] | Add dark-first control classes in `src/styles/app.css` while preserving existing chip/card/focus patterns. [VERIFIED: `src/styles/app.css`] | Use existing Tailwind 3.x setup; do not upgrade styling stack in this phase. [VERIFIED: `AGENTS.md`] [VERIFIED: `package.json`] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Pure repo-owned deterministic helper | Fuse, MiniSearch, hosted search, semantic search, typo tolerance, autocomplete, or local index dependency | Locked out of scope for Phase 32; the corpus is small and the user chose transparent narrowing. [VERIFIED: `.planning/phases/32-project-and-writing-filtering-search/32-CONTEXT.md`] |
| In-memory Solid state | Query params, URL hash, `localStorage`, or `sessionStorage` | Locked out of scope because faceted URL state can create crawl/index risk and sharing belongs to canonical topic routes. [VERIFIED: `.planning/phases/32-project-and-writing-filtering-search/32-CONTEXT.md`] [CITED: `https://developers.google.com/crawling/docs/faceted-navigation`] |
| Native labeled form controls | Custom ARIA widgets for chips/toggles | Native search inputs, labels, fieldsets, checkboxes, and buttons cover the required interactions with less keyboard/ARIA risk. [VERIFIED: `.planning/phases/32-project-and-writing-filtering-search/32-CONTEXT.md`] [CITED: `https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/search`] [CITED: `https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/fieldset`] [CITED: `https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/`] |
| Flat search-results workbench | Existing grouped project sections and writing card list | Phase 32 requires preserving project grouping and current writing cards; filtered results may hide empty groups or show one empty state. [VERIFIED: `.planning/phases/32-project-and-writing-filtering-search/32-CONTEXT.md`] [VERIFIED: `src/routes/projects/index.tsx`] [VERIFIED: `src/routes/writing/index.tsx`] |

**Installation:**
```bash
# No new packages for Phase 32.
```

**Version verification:** Recommended packages are existing repo dependencies, not new installs; registry versions and publish dates above were checked through `npm view` and `https://registry.npmjs.org/` during this research. [VERIFIED: npm registry] [VERIFIED: `package.json`]

## Architecture Patterns

### Recommended Project Structure

```text
src/domain/
├── content-search.ts              # pure query/facet/search model over PublicContentReference
├── content-search.test.ts         # focused Vitest coverage for normalization, facets, scoring, eligibility
├── topics.ts                      # existing safe PublicContentReference and canonical topic contract
├── projects.ts                    # existing public project selectors and grouping helpers
└── writing.ts                     # existing public writing selectors and route helpers

src/components/
└── DiscoveryFilterControls.tsx    # optional shared control shell if route-local duplication grows

src/routes/
├── projects/index.tsx             # project controls plus grouped filtered project rendering
└── writing/index.tsx              # writing controls plus filtered writing card rendering

src/styles/
└── app.css                        # dark-primary control surface, wrapping, touch targets, focus states
```

This structure keeps scoring and eligibility in the domain layer while route components stay responsible for Solid state, labels, and rendering. [VERIFIED: `standards/core/architecture.md`] [VERIFIED: `src/routes/projects/index.tsx`] [VERIFIED: `src/routes/writing/index.tsx`]

### Pattern 1: Pure Filter Model Over Public References

**What:** Build a data-in/data-out helper that accepts public references, a normalized search query, selected facet IDs, and a desired kind, then returns sorted visible references plus count metadata. [VERIFIED: `.planning/phases/32-project-and-writing-filtering-search/32-CONTEXT.md`]

**When to use:** Use this for project and writing filtering before adapting results back to card records in route components. [VERIFIED: `.planning/phases/32-project-and-writing-filtering-search/32-CONTEXT.md`]

**Example:**
```ts
// Source: existing PublicContentReference contract in src/domain/topics.ts.
// Recommendation: exact names are implementation discretion from 32-CONTEXT.md.
import type { PublicContentReference } from "./topics";

export type ContentSearchInput = {
  references: readonly PublicContentReference[];
  query: string;
  selectedFacetIds: readonly string[];
  kind: "project" | "writing";
};

export function filteredContentReferences(input: ContentSearchInput) {
  const queryTokens = normalizedQueryTokens(input.query);

  return input.references
    .filter((reference) => reference.kind === input.kind)
    .map((reference) => scoredReference(reference, queryTokens, input.selectedFacetIds))
    .filter((result) => result.visible)
    .sort(contentSearchResultOrder);
}
```

### Pattern 2: Route Components Use Solid Signals and Memos as the Shell

**What:** Use `createSignal()` for query/facet state and `createMemo()` for derived filtered results; keep default lists available so SSR/static HTML renders useful content before hydration. [CITED: `https://docs.solidjs.com/reference/basic-reactivity/create-signal`] [CITED: `https://docs.solidjs.com/reference/basic-reactivity/create-memo`] [VERIFIED: `src/routes/projects/index.tsx`] [VERIFIED: `src/routes/writing/index.tsx`]

**When to use:** Use in `/projects` and `/writing` route components after the pure helper is tested. [VERIFIED: `.planning/phases/32-project-and-writing-filtering-search/32-CONTEXT.md`]

**Example:**
```tsx
// Source: Solid createSignal/createMemo docs and current route component pattern.
const [query, setQuery] = createSignal("");
const [selectedFacetIds, setSelectedFacetIds] = createSignal<readonly string[]>([]);

const visibleReferences = createMemo(() =>
  filteredContentReferences({
    references: publicReferences,
    query: query(),
    selectedFacetIds: selectedFacetIds(),
    kind: "project",
  }),
);
```

### Pattern 3: Native Control Groups

**What:** Render a search input with a visible label, grouped facets in fieldsets with legends, result-count status text, and an explicit reset button. [VERIFIED: `.planning/phases/32-project-and-writing-filtering-search/32-CONTEXT.md`] [CITED: `https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/fieldset`] [CITED: `https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/search`]

**When to use:** Use native controls for both `/projects` and `/writing` unless implementation proves a select is materially clearer for a facet group. [VERIFIED: `.planning/phases/32-project-and-writing-filtering-search/32-CONTEXT.md`]

**Example:**
```tsx
// Source: MDN input search and fieldset semantics.
<section class="filter-surface visual-surface" aria-labelledby="project-filters-heading">
  <h2 id="project-filters-heading" class="section-title">Narrow projects</h2>
  <label class="filter-label" for="project-search">Search public projects</label>
  <input
    id="project-search"
    class="filter-input"
    type="search"
    value={query()}
    onInput={(event) => setQuery(event.currentTarget.value)}
  />
  <fieldset class="filter-group">
    <legend>Topics</legend>
    {/* checkbox options */}
  </fieldset>
  <p role="status" aria-live="polite">{visibleCount()} of {totalCount()} public projects</p>
  <button type="button" onClick={resetFilters}>Reset filters</button>
</section>
```

### Pattern 4: Static Defaults Stay Verifiable

**What:** The static verifier currently reads `preHydrationBody(html)` from built `.output/public` files and checks expected route text before hydration. [VERIFIED: `scripts/verify-static/route-html-verifier.ts`]

**When to use:** Extend expected route text for controls and default result-count copy only after UI exists; do not make static verification depend on hydrated filter state. [VERIFIED: `scripts/verify-static/expected-route-text.ts`] [VERIFIED: `.planning/phases/32-project-and-writing-filtering-search/32-CONTEXT.md`]

### Anti-Patterns to Avoid

- **Reading raw curated registries in search helpers:** This bypasses public eligibility selectors and can leak hidden/draft/archived/excluded content. [VERIFIED: `src/domain/topics.ts`] [VERIFIED: `src/domain/topics.test.ts`]
- **Slugifying raw labels into facet/topic IDs:** Phase 31 locked canonical topic resolution through `maybeTopicRecordForLabel()` and safe topic chips. [VERIFIED: `.planning/phases/31-static-topic-routes/31-CONTEXT.md`] [VERIFIED: `src/components/TopicChip.tsx`]
- **Using URL query or hash state:** Phase 32 explicitly keeps state in memory, and Google documents crawl risk for faceted URL combinations. [VERIFIED: `.planning/phases/32-project-and-writing-filtering-search/32-CONTEXT.md`] [CITED: `https://developers.google.com/crawling/docs/faceted-navigation`]
- **Replacing default static cards with a client-only empty shell:** FIND-03 requires useful default static content before hydration. [VERIFIED: `.planning/REQUIREMENTS.md`] [VERIFIED: `src/routes/projects/index.tsx`] [VERIFIED: `src/routes/writing/index.tsx`]
- **Relying only on placeholder text as a search label:** MDN documents that unlabeled search fields can confuse screen reader users; use a visible label or explicit accessible name. [CITED: `https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/search`]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Fuzzy relevance/search indexing | Fuse-like scoring, typo tolerance, autocomplete, or generated search index | A small deterministic helper over `PublicContentReference` | Fuzzy/index dependencies are out of scope, and the current corpus is small. [VERIFIED: `.planning/phases/32-project-and-writing-filtering-search/32-CONTEXT.md`] [VERIFIED: `bun --eval public corpus count audit`] |
| Accessibility primitives | Custom checkbox/toggle roles and keyboard handlers | Native `input type="search"`, checkboxes/selects, `button`, `label`, `fieldset`, and `legend` | Native controls cover keyboard and accessible names with less risk than custom ARIA widgets. [CITED: `https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/search`] [CITED: `https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/fieldset`] [CITED: `https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/`] |
| Public eligibility | Per-route hidden/draft/archived checks | `publicContentReferences()`, `publicProjectIndexProjects()`, and `publicWritingEntries()` | Existing selectors already centralize public eligibility and tests prove hidden-content exclusion. [VERIFIED: `src/domain/topics.ts`] [VERIFIED: `src/domain/projects.ts`] [VERIFIED: `src/domain/writing.ts`] [VERIFIED: `src/domain/topics.test.ts`] |
| Faceted share URLs | Query-param or path-based filter combinations | Canonical topic routes and in-memory filters | Google documents overcrawling and slower discovery risks for large faceted URL spaces. [CITED: `https://developers.google.com/crawling/docs/faceted-navigation`] |
| Browser validation harness | A separate E2E suite | Extend `tests/browser-release.playwright.ts` | The existing browser suite already runs axe, dark layout, keyboard focus, and reduced-motion checks. [VERIFIED: `tests/browser-release.playwright.ts`] |

**Key insight:** Build one simple deterministic filter domain model, but do not build infrastructure around it. [VERIFIED: `.planning/phases/32-project-and-writing-filtering-search/32-CONTEXT.md`] The complexity in this phase is public eligibility, static-first behavior, accessibility, and SEO safety, not search algorithm sophistication. [VERIFIED: `.planning/REQUIREMENTS.md`] [VERIFIED: `src/domain/topics.ts`] [CITED: `https://developers.google.com/crawling/docs/faceted-navigation`]

## Common Pitfalls

### Pitfall 1: Hidden Content Leaks Through Raw Data

**What goes wrong:** A route or helper reads `curatedProjects`, `curatedWriting`, or raw labels directly and accidentally includes hidden, archived, draft, excluded, or unsupported records. [VERIFIED: `src/domain/projects.ts`] [VERIFIED: `src/domain/writing.ts`] [VERIFIED: `src/domain/topics.test.ts`]

**Why it happens:** Route-level filtering duplicates eligibility logic that already exists in public selectors. [VERIFIED: `src/domain/projects.ts`] [VERIFIED: `src/domain/writing.ts`]

**How to avoid:** Compose `publicContentReferences()`, `publicProjectIndexProjects()`, and `publicWritingEntries()` only. [VERIFIED: `.planning/phases/32-project-and-writing-filtering-search/32-CONTEXT.md`] [VERIFIED: `src/domain/topics.ts`]

**Warning signs:** New imports from raw registries in route search code, tests that assert internal-only fields, or helper results containing diagnostic fields such as `reason`, `hidden`, or `draft`. [VERIFIED: `src/domain/topics.test.ts`]

### Pitfall 2: Faceted URL Explosion

**What goes wrong:** Filter state lands in query params, hash fragments, sitemap entries, canonical URLs, or route paths. [VERIFIED: `.planning/phases/32-project-and-writing-filtering-search/32-CONTEXT.md`]

**Why it happens:** Shareable filters are tempting, but Phase 32 delegates durable sharing to topic routes. [VERIFIED: `.planning/phases/32-project-and-writing-filtering-search/32-CONTEXT.md`]

**How to avoid:** Keep filter state in Solid signals only, do not use `location.search`, `URLSearchParams`, hash state, `localStorage`, or `sessionStorage`, and keep `src/domain/routes.ts` unchanged except unrelated route helpers. [VERIFIED: source scan for state APIs] [VERIFIED: `src/domain/routes.ts`]

**Warning signs:** Source hits for `location.search`, `URLSearchParams`, `localStorage`, `sessionStorage`, or new `/projects?...` static verifier expectations. [VERIFIED: source scan for state APIs]

### Pitfall 3: Client-Only Result Shell

**What goes wrong:** Static HTML contains controls but no useful public cards until hydration. [VERIFIED: `.planning/REQUIREMENTS.md`]

**Why it happens:** Implementing filtering as an all-client search app can replace the existing module-scope default lists. [VERIFIED: `src/routes/projects/index.tsx`] [VERIFIED: `src/routes/writing/index.tsx`]

**How to avoid:** Render the default public project and writing cards from the existing selectors, then let hydrated state narrow those same records. [VERIFIED: `src/routes/projects/index.tsx`] [VERIFIED: `src/routes/writing/index.tsx`] [CITED: `https://docs.solidjs.com/solid-start/building-your-application/route-prerendering`]

**Warning signs:** Static verifier failures on default project/writing titles, route text moving behind `onMount`, or `.output/public` missing default cards. [VERIFIED: `scripts/verify-static/expected-route-text.ts`] [VERIFIED: `scripts/verify-static/route-html-verifier.ts`]

### Pitfall 4: Accessibility Regressions From Custom Controls

**What goes wrong:** Controls lack visible labels, keyboard access, result count announcements, focus indicators, or mobile wrapping. [VERIFIED: `.planning/REQUIREMENTS.md`] [VERIFIED: `.planning/phases/32-project-and-writing-filtering-search/32-CONTEXT.md`]

**Why it happens:** Chip-like buttons can look compact while losing semantics and keyboard expectations. [CITED: `https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/`]

**How to avoid:** Use native controls, visible labels, fieldsets/legends, `aria-live="polite"` or `role="status"`, and existing focus-visible ring patterns. [CITED: `https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/search`] [CITED: `https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/fieldset`] [CITED: `https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-live`] [VERIFIED: `src/styles/app.css`]

**Warning signs:** Axe violations, controls skipped by tabbing, missing `for`/`id` label pairs, or mobile layout findings in Playwright. [VERIFIED: `tests/browser-release.playwright.ts`]

### Pitfall 5: Search Ranking Feels Arbitrary

**What goes wrong:** Results reorder unpredictably or less relevant records outrank exact title/topic matches. [VERIFIED: `.planning/phases/32-project-and-writing-filtering-search/32-CONTEXT.md`]

**Why it happens:** Ad hoc string `includes()` checks lose field weight and stable tie-break rules. [VERIFIED: `.planning/phases/32-project-and-writing-filtering-search/32-CONTEXT.md`]

**How to avoid:** Normalize query tokens once, score explicit public fields with documented weights, and tie-break by existing `displayOrder`, kind, and slug. [VERIFIED: `.planning/phases/32-project-and-writing-filtering-search/32-CONTEXT.md`] [VERIFIED: `src/domain/topics.ts`]

**Warning signs:** Tests do not cover case/punctuation/whitespace normalization, score ordering, or equal-score display order. [VERIFIED: `standards/core/testing.md`]

## Code Examples

Verified patterns from official and local sources:

### Query Normalization

```ts
// Source: Phase 32 deterministic matching decision; similar punctuation normalization exists in normalizeTopicLabelKey().
export function normalizedQueryTokens(query: string): readonly string[] {
  return query
    .trim()
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}
```

The normalization shape above is compatible with the existing topic label key approach, which trims, lowercases, strips apostrophes, normalizes non-alphanumeric runs, and removes empty boundaries. [VERIFIED: `src/domain/topics.ts`]

### Public Facet IDs

```ts
// Source: Phase 31 canonical topic contract and Phase 32 facet decisions.
export type ContentFacet =
  | { kind: "topic"; id: `topic:${string}`; label: string }
  | { kind: "project-tier"; id: `project-tier:${string}`; label: string }
  | { kind: "project-status"; id: `project-status:${string}`; label: string }
  | { kind: "project-source"; id: `project-source:${string}`; label: string }
  | { kind: "writing-kind"; id: `writing-kind:${string}`; label: string }
  | { kind: "writing-tag"; id: `writing-tag:${string}`; label: string }
  | { kind: "writing-year"; id: `writing-year:${string}`; label: string };
```

Facet IDs should use canonical topic slugs and explicit facet prefixes instead of raw label slugification. [VERIFIED: `.planning/phases/32-project-and-writing-filtering-search/32-CONTEXT.md`] [VERIFIED: `src/domain/topics.ts`]

### Solid Derived Results

```tsx
// Source: Solid createSignal/createMemo docs and current route rendering style.
const [query, setQuery] = createSignal("");
const [selectedFacetIds, setSelectedFacetIds] = createSignal<readonly string[]>([]);

const projectSearchResults = createMemo(() =>
  filteredContentReferences({
    references: publicReferences,
    kind: "project",
    query: query(),
    selectedFacetIds: selectedFacetIds(),
  }),
);
```

Solid docs define `createSignal()` as a getter/setter reactive primitive and `createMemo()` as a memoized derived accessor that re-executes when dependencies change. [CITED: `https://docs.solidjs.com/reference/basic-reactivity/create-signal`] [CITED: `https://docs.solidjs.com/reference/basic-reactivity/create-memo`]

### Polite Result Count Status

```tsx
// Source: MDN aria-live guidance and Phase 32 result-count decision.
<p class="filter-status" role="status" aria-live="polite">
  {visibleCount()} of {totalCount()} public projects shown
</p>
```

MDN describes `aria-live="polite"` as notifying assistive technology users at the next graceful opportunity rather than interrupting the current task. [CITED: `https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-live`]

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Raw labels became route/filter identities through slugification | Canonical topic registry and `maybeTopicRecordForLabel()` resolve public topic identity | Phase 30/31, completed 2026-06-27 through 2026-07-02 [VERIFIED: `.planning/STATE.md`] [VERIFIED: `.planning/phases/30-content-discovery-foundation/30-01-SUMMARY.md`] [VERIFIED: `.planning/phases/31-static-topic-routes/31-02-SUMMARY.md`] | Filters must use canonical topic slugs and safe topic chips; unsupported labels stay inert. [VERIFIED: `src/components/TopicChip.tsx`] |
| Route/components owned visibility checks | Public selectors and `PublicContentReference` own public eligibility | Phase 30, completed 2026-06-27 [VERIFIED: `.planning/phases/30-content-discovery-foundation/30-01-SUMMARY.md`] | Search/filter helpers should compose public selectors and avoid raw registries. [VERIFIED: `src/domain/topics.ts`] |
| Static route checks trusted source code | Static verification reads built `.output/public` HTML before hydration | Existing release pattern before Phase 32 [VERIFIED: `scripts/verify-static/route-html-verifier.ts`] | FIND-03 should be proven from build output, not just route source. [VERIFIED: `.planning/REQUIREMENTS.md`] |
| Shareability through faceted URLs | Durable sharing through canonical topic routes, local filters in memory | Phase 31 topic routes completed 2026-07-02; Phase 32 locks in-memory filters [VERIFIED: `.planning/phases/31-static-topic-routes/31-03-SUMMARY.md`] [VERIFIED: `.planning/phases/32-project-and-writing-filtering-search/32-CONTEXT.md`] | Avoids crawlable faceted URL combinations and preserves sitemap/canonical behavior. [CITED: `https://developers.google.com/crawling/docs/faceted-navigation`] |

**Deprecated/outdated for this phase:**

- Fuse/MiniSearch/hosted/semantic search is out of scope until the corpus grows enough to justify it. [VERIFIED: `.planning/phases/32-project-and-writing-filtering-search/32-CONTEXT.md`]
- Query-param, hash, localStorage, and sessionStorage filter persistence is out of scope until a later phase deliberately scopes sharing. [VERIFIED: `.planning/phases/32-project-and-writing-filtering-search/32-CONTEXT.md`]
- Raw GitHub or CMS visitor-runtime content fetching remains out of scope and is guarded by repo verification. [VERIFIED: `.planning/REQUIREMENTS.md`] [VERIFIED: `scripts/verify-no-github-runtime.ts`]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|

All claims in this research were verified from repo files, command output, npm registry data, or cited official documentation; no assumed-claim tags are intentionally relied on. [VERIFIED: research command log]

## Open Questions

1. **Exact score weights**
   - What we know: Phase 32 requires explicit weights for title, summary, canonical topics, source labels, and public facets. [VERIFIED: `.planning/phases/32-project-and-writing-filtering-search/32-CONTEXT.md`]
   - What's unclear: The exact numeric weights are delegated to implementation. [VERIFIED: `.planning/phases/32-project-and-writing-filtering-search/32-CONTEXT.md`]
   - Recommendation: Start with title > canonical topic > public facet/source label > summary, and test ordering plus display-order tie breaks. [VERIFIED: `.planning/phases/32-project-and-writing-filtering-search/32-CONTEXT.md`]
2. **Control component boundary**
   - What we know: Both `/projects` and `/writing` need similar search/facet/count/reset behavior. [VERIFIED: `.planning/REQUIREMENTS.md`]
   - What's unclear: The exact shared component name and prop shape are delegated to implementation. [VERIFIED: `.planning/phases/32-project-and-writing-filtering-search/32-CONTEXT.md`]
   - Recommendation: Start route-local if duplication stays small; extract `DiscoveryFilterControls` only if project and writing controls duplicate non-trivial logic. [VERIFIED: `standards/core/code-shape.md`]
3. **Facet presentation**
   - What we know: Checkbox groups, selects, or compact button toggles are allowed if they meet accessibility, focus, wrapping, and dark readability requirements. [VERIFIED: `.planning/phases/32-project-and-writing-filtering-search/32-CONTEXT.md`]
   - What's unclear: The best presentation depends on actual facet count and mobile layout after implementation. [VERIFIED: current facet count audit]
   - Recommendation: Use checkboxes/fieldsets for topics and compact checkbox groups or selects for short enumerations, then prove no mobile overlap in Playwright. [CITED: `https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/fieldset`] [VERIFIED: `tests/browser-release.playwright.ts`]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Bun | Repo scripts, tests, build, verification | Yes | Local `1.3.9`; package manager declares `bun@1.3.14` | Use existing local Bun for planning/execution; do not add Bun-version-specific features in Phase 32. [VERIFIED: `bun --version`] [VERIFIED: `package.json`] |
| Node.js | npm registry probes and some ecosystem tooling | Yes | `v24.13.0` | Use Bun scripts for repo work; Node is available for tooling. [VERIFIED: `node --version`] |
| npm | Registry version checks | Yes | `11.6.2` | Not needed for repo execution except research/version probes. [VERIFIED: `npm --version`] |
| Playwright CLI | Browser release verification | Yes | `1.60.0` | Run `bun run install:browser` if a clean machine lacks browser binaries. [VERIFIED: `./node_modules/.bin/playwright --version`] [VERIFIED: `package.json`] |
| Playwright Chromium cache | Browser release verification | Yes | Multiple cached Chromium folders present | Fallback is `bun run install:browser`. [VERIFIED: `ls ~/Library/Caches/ms-playwright`] [VERIFIED: `package.json`] |
| Git | Research commit | Yes | Branch `main`; worktree has pre-existing `.planning/config.json` modification | Commit only `32-RESEARCH.md`; do not include unrelated config change. [VERIFIED: `git rev-parse --abbrev-ref HEAD`] [VERIFIED: `git status --short`] |

**Missing dependencies with no fallback:**

- None found for research/planning. [VERIFIED: environment audit commands]

**Missing dependencies with fallback:**

- Local Bun is older than the package manager declaration; this is not blocking for a no-dependency Phase 32 plan, but aggregate verification should be the authority before implementation is marked complete. [VERIFIED: `bun --version`] [VERIFIED: `package.json`] [VERIFIED: `.planning/phases/32-project-and-writing-filtering-search/32-CONTEXT.md`]

## Security Domain

Security enforcement is enabled by default because `.planning/config.json` does not explicitly set `security_enforcement: false`. [VERIFIED: `.planning/config.json`]

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | Phase 32 adds no authentication, credentials, or login/session flows. [VERIFIED: `.planning/REQUIREMENTS.md`] |
| V3 Session Management | No | Phase 32 keeps filter state in memory and does not use sessions, localStorage, or sessionStorage. [VERIFIED: `.planning/phases/32-project-and-writing-filtering-search/32-CONTEXT.md`] |
| V4 Access Control | Yes, for public-content visibility | Use `publicContentReferences()`, `publicProjectIndexProjects()`, and `publicWritingEntries()` as the public eligibility boundary. [VERIFIED: `src/domain/topics.ts`] [VERIFIED: `src/domain/projects.ts`] [VERIFIED: `src/domain/writing.ts`] |
| V5 Input Validation | Yes | Normalize query input as inert text, validate facet IDs against derived public facet sets, and never use query text as HTML or a URL route. [VERIFIED: `.planning/phases/32-project-and-writing-filtering-search/32-CONTEXT.md`] [VERIFIED: source scan for `innerHTML`] |
| V6 Cryptography | No | Phase 32 adds no secrets, crypto, token storage, or encryption/decryption behavior. [VERIFIED: `.planning/REQUIREMENTS.md`] |

OWASP ASVS is the web application security verification standard used as the category reference for security controls. [CITED: `https://owasp.org/www-project-application-security-verification-standard/`]

### Known Threat Patterns for SolidStart Static Filtering

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Hidden-content disclosure through raw registry reads | Information Disclosure | Compose only public selectors and test hidden/draft/archived/excluded fixtures. [VERIFIED: `src/domain/topics.test.ts`] |
| Reflected DOM injection from query text | Tampering / Information Disclosure | Do not use `innerHTML`; keep query as text/state only and render through JSX text nodes or input values. [VERIFIED: source scan for `innerHTML`] |
| Crawl/index bloat from filter URLs | Denial of Service / Information Disclosure | Keep state in memory, avoid query/hash routes, and preserve sitemap/canonical behavior. [VERIFIED: `.planning/phases/32-project-and-writing-filtering-search/32-CONTEXT.md`] [CITED: `https://developers.google.com/crawling/docs/faceted-navigation`] |
| Runtime content API leakage | Information Disclosure | Keep all content checked in and local; rely on `verify:no-github-runtime` and static verification. [VERIFIED: `.planning/REQUIREMENTS.md`] [VERIFIED: `scripts/verify-no-github-runtime.ts`] |

## Sources

### Primary (HIGH confidence)

- `.planning/phases/32-project-and-writing-filtering-search/32-CONTEXT.md` - Locked Phase 32 decisions, scope boundaries, verification strategy, and integration points. [VERIFIED: file read]
- `.planning/REQUIREMENTS.md` - FIND-01 through FIND-05 and v1.6 out-of-scope exclusions. [VERIFIED: file read]
- `.planning/ROADMAP.md` - Phase 32 plan split and dependency on Phase 31. [VERIFIED: file read]
- `.planning/STATE.md` - Current phase status and Phase 30/31 completion context. [VERIFIED: file read]
- `.planning/PROJECT.md` - Static-first portfolio constraints, curated content authority, and OpenLinks low-intrusion decision. [VERIFIED: file read]
- `AGENTS.md`, `AGENTS.bright-builds.md`, `standards-overrides.md`, and relevant `standards/` pages - Repo workflow, dark-primary UI, architecture, testing, TypeScript, and verification rules. [VERIFIED: file read]
- `src/domain/topics.ts`, `src/domain/projects.ts`, `src/domain/writing.ts`, `src/components/TopicChip.tsx`, `src/routes/projects/index.tsx`, `src/routes/writing/index.tsx`, `src/styles/app.css` - Existing helper, route, chip, and style contracts. [VERIFIED: file read]
- `scripts/verify-static/*`, `scripts/verify-no-github-runtime.ts`, `tests/browser-release.playwright.ts`, `package.json`, `app.config.ts`, `playwright.config.ts`, `vitest.config.ts` - Static/browser/release verification and stack entrypoints. [VERIFIED: file read]
- npm registry probes for `solid-js`, `@solidjs/start`, `@solidjs/router`, `@solidjs/meta`, `vitest`, `@playwright/test`, `@axe-core/playwright`, `@biomejs/biome`, `typescript`, `tailwindcss`, `vite`, `vinxi`, and `vite-plugin-solid`. [VERIFIED: npm registry]

### Secondary (MEDIUM confidence)

- Solid docs for `createSignal`, `createMemo`, `<For>`, `<Show>`, route prerendering, and head/metadata. [CITED: `https://docs.solidjs.com/reference/basic-reactivity/create-signal`] [CITED: `https://docs.solidjs.com/reference/basic-reactivity/create-memo`] [CITED: `https://docs.solidjs.com/reference/components/for`] [CITED: `https://docs.solidjs.com/reference/components/show`] [CITED: `https://docs.solidjs.com/solid-start/building-your-application/route-prerendering`] [CITED: `https://docs.solidjs.com/solid-start/building-your-application/head-and-metadata`]
- MDN/W3C accessibility references for search inputs, fieldsets, live regions, checkbox behavior, and visible focus. [CITED: `https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/search`] [CITED: `https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/fieldset`] [CITED: `https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-live`] [CITED: `https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/`] [CITED: `https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html`]
- Google Search Central faceted navigation guidance for crawl-risk context. [CITED: `https://developers.google.com/crawling/docs/faceted-navigation`]
- OWASP ASVS project page for security verification-standard context. [CITED: `https://owasp.org/www-project-application-security-verification-standard/`]

### Tertiary (LOW confidence)

- None used. [VERIFIED: research source list]

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - Phase 32 adds no dependencies; stack comes from `package.json`, npm registry probes, and existing route/test configs. [VERIFIED: `package.json`] [VERIFIED: npm registry]
- Architecture: HIGH - Locked decisions and existing standards both require pure domain helpers with route components as shells. [VERIFIED: `.planning/phases/32-project-and-writing-filtering-search/32-CONTEXT.md`] [VERIFIED: `standards/core/architecture.md`]
- Pitfalls: HIGH - Hidden-content, static-output, browser, and no-runtime-fetch risks are already covered by local tests/verifiers that Phase 32 can extend. [VERIFIED: `src/domain/topics.test.ts`] [VERIFIED: `scripts/verify-static/route-html-verifier.ts`] [VERIFIED: `tests/browser-release.playwright.ts`] [VERIFIED: `scripts/verify-no-github-runtime.ts`]
- Accessibility: MEDIUM-HIGH - Official MDN/W3C guidance and existing Playwright/axe patterns are clear; final confidence depends on implementation screenshots/browser results. [CITED: `https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/search`] [CITED: `https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html`] [VERIFIED: `tests/browser-release.playwright.ts`]

**Research date:** 2026-07-03
**Valid until:** 2026-08-02 for repo architecture and Phase 32 planning; npm latest-version observations should be rechecked before dependency changes. [VERIFIED: npm registry]
