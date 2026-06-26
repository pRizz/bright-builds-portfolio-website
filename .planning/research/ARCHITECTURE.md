# Architecture Patterns

**Domain:** Static SolidStart portfolio content discovery, feeds, filtering, and related-work navigation
**Project:** Bright Builds Portfolio Website
**Milestone:** v1.6 Content Discovery & Feeds
**Researched:** 2026-06-26
**Overall confidence:** HIGH for local architecture integration, MEDIUM for feed-reader compatibility until generated XML is validated with a feed validator or real reader.

Local guidance and standards materially used: `AGENTS.md` repo-local dark-primary/static guidance, `AGENTS.bright-builds.md`, `standards/core/architecture.md`, `standards/core/frontend-ui.md`, `standards/core/verification.md`, `standards/languages/typescript-javascript.md`, `.planning/PROJECT.md`, `.planning/MILESTONES.md`, `package.json`, `src/domain/*`, `src/routes/*`, `scripts/verify-static/*`, `scripts/verify-release.ts`, and `tests/browser-release.playwright.ts`.

## Recommended Architecture

Keep v1.6 as an extension of the existing functional-core / imperative-shell architecture:

```text
checked-in project, writing, theme, route, and profile registries
        |
        v
public selectors and pure route helpers
        |
        +--> discovery graph helpers
        +--> search/filter helpers
        +--> related-work helpers
        +--> feed helpers
        +--> social-preview target helpers
        |
        v
SolidStart route shells and Bun static generators
        |
        v
public generated XML/assets + prerendered .output/public HTML
        |
        v
static verifier, browser verifier, release verifier, release-readiness evidence
```

The main architectural move is to add a pure discovery graph over the existing public selectors. That graph should become the shared source for topic/tag pages, filter chips, lightweight search documents, related-work recommendations, feed item links, sitemap coverage, and static verification expectations. Do not add a CMS, runtime API, external search service, dynamic feed endpoint, dynamic Open Graph endpoint, or visitor-runtime JSON fetch.

Recommended public route and file choices:

| Surface | Recommendation | Why |
| --- | --- | --- |
| Topic/tag discovery | Add `/topics` and `/topics/{slug}` | One route family covers project themes, project tags, writing topics, writing tags, and public theme titles without colliding with existing `/themes/{slug}` story pages. |
| Filtering/search | Add in-page controls on `/projects`, `/writing`, `/themes`, and `/topics` backed by imported checked-in data | Keeps content in the static bundle, avoids runtime fetches, and preserves full static fallback content before interaction. |
| Feeds | Generate Atom XML at `/feed.xml` and `/writing/feed.xml` from public writing entries first | Writing already has dates. Do not synthesize feed dates for project/theme records until a checked-in `siteUpdates` registry exists. |
| Related work | Add a cross-content related-work helper that ranks explicit relationships first, shared discovery labels second | Reuses existing theme and writing relationships while avoiding opaque AI/embedding similarity. |
| Generic-route social previews | Extend `src/domain/social-previews.ts` to cover `home`, `about`, `contact`, and new topic routes after route inventory is stable | Metadata already looks up route-specific targets by path, so this belongs in the social-preview target layer, not route components. |

### Component Boundaries

| Component | Responsibility | Communicates With |
| --- | --- | --- |
| `src/domain/projects.ts` | Existing checked-in project registry, public project selectors, project paths, project href selection | Discovery, related work, search, SEO, sitemap, static verification |
| `src/domain/writing.ts` | Existing checked-in writing registry, published-only selectors, writing paths, project relationships | Discovery, feeds, related work, search, SEO, sitemap, static verification |
| `src/domain/themes.ts` | Existing checked-in theme registry, public theme selectors, theme paths, collaboration actions | Discovery, related work, search, SEO, sitemap, static verification |
| `src/domain/routes.ts` | Top-level route registry, `prerenderRoutes`, `sitemapRoutes`, navigation routes | `app.config.ts`, sitemap generation, browser checks, static verifier |
| `src/domain/discovery.ts` (new) | Normalize labels, build public topic records, map topic routes to related projects/writing/themes | Routes, search, related work, SEO, sitemap, curation checks, static verifier |
| `src/domain/content-search.ts` (new) | Build static search documents and pure filter/search scoring | Route UI shells, unit tests, browser interaction checks |
| `src/domain/related-work.ts` (new) | Return capped related projects/writing/themes/topics with reason labels | Project detail, writing detail, theme detail, topic detail routes |
| `src/domain/feeds.ts` (new) | Build feed item records and serialize valid escaped Atom XML | `scripts/generate-static-metadata.ts`, feed verifier |
| `src/domain/seo.ts` | Existing metadata, sitemap, robots, JSON-LD helpers; add topic metadata, topic JSON-LD, feed alternate link data | Route heads, static metadata generation, static verifier |
| `src/domain/social-previews.ts` | Existing generated social target contract; add site-route and topic targets | SEO image lookup, social preview generator, static verifier, release budgets |
| `src/routes/*` | Thin Solid shells that render helper-derived content and progressive controls | Domain helpers only; no content fetches or ad hoc selection rules |
| `scripts/generate-static-metadata.ts` | Imperative shell for sitemap, robots, and feed XML files in `public/` | `seo.ts`, `feeds.ts`, filesystem |
| `scripts/generate-social-previews.ts` | Existing imperative shell for generated PNGs and manifest | `social-previews.ts`, renderer, filesystem |
| `scripts/verify-static/*` | Generated-output assertions for route HTML, metadata, JSON-LD, sitemap, robots, feeds, assets | Domain helpers and `.output/public` |
| `tests/browser-release.playwright.ts` | Browser/a11y/layout checks over `prerenderRoutes`; add focused filter/search interaction coverage | Built static site and domain-derived representative routes |

### Data Flow

Static discovery route flow:

```text
publicProjectIndexProjects()
+ publicWritingEntries()
+ publicThemeEntries()
        |
        v
discoveryTopics()
  - normalized slug
  - canonical label
  - source label kinds: project-theme, project-tag, writing-topic, writing-tag, theme
  - related project/writing/theme refs with helper-derived hrefs
        |
        +--> topicDetailRoutes() -> prerenderRoutes -> app.config.ts
        +--> sitemapRoutes -> sitemapXml()
        +--> topic route components
        +--> expectedRoutes and static verifier
        +--> socialPreviewTargets()
```

Filtering/search flow:

```text
public content selectors
        |
        v
searchDocuments()
  - id, kind, title, summary, href, labels, date/order
        |
        v
filterSearchDocuments(input)
  - query tokens
  - selected kind
  - selected topic/tag slug
        |
        v
Solid route shell with imported data and client-side signals
```

Feed flow:

```text
publicWritingEntries()
        |
        v
writingFeedItems()
        |
        v
atomFeedXml()
        |
        v
scripts/generate-static-metadata.ts writes public/feed.xml and public/writing/feed.xml
        |
        v
bun run build copies XML into .output/public
        |
        v
verify-static checks XML exists, equals helper output, is escaped, and links only public routes
```

Related-work flow:

```text
selected content node
        |
        v
explicit relationships
  - writing.relatedProjectSlugs
  - theme.relatedProjectSlugs
  - theme.relatedWritingSlugs
        |
        v
label relationships from discoveryTopics()
        |
        v
capped related-work model with reason labels and helper-derived hrefs
```

### Modified vs New Modules

New modules:

| File | Purpose |
| --- | --- |
| `src/domain/discovery.ts` | Pure topic/tag discovery model, label normalization, route helpers, related public content refs. |
| `src/domain/discovery.test.ts` | Public-only coverage, deterministic sorting, slug normalization, duplicate/collision behavior, route helper coverage. |
| `src/domain/content-search.ts` | Pure search document creation, query tokenization, kind/topic filters, deterministic scoring. |
| `src/domain/content-search.test.ts` | Query, filter, no-result, ordering, and public-only regression tests. |
| `src/domain/related-work.ts` | Cross-content related-work graph with explicit-first and shared-label fallback ranking. |
| `src/domain/related-work.test.ts` | Related project/writing/theme/topic coverage, no hidden content leaks, reason labels, caps. |
| `src/domain/feeds.ts` | Feed item derivation, Atom XML serialization, XML escaping, stable feed IDs. |
| `src/domain/feeds.test.ts` | Feed item ordering, date handling, escaping, public-only output, root/writing feed equivalence if root aliases writing. |
| `src/routes/topics/index.tsx` | Static topic index route with dark-primary topic cards and counts. |
| `src/routes/topics/[slug].tsx` | Static topic detail route with related projects, writing, themes, and fallback behavior. |
| `scripts/verify-static/feed-verifier.ts` | Static output feed assertions for `.output/public/feed.xml` and `.output/public/writing/feed.xml`. |

Modified modules:

| File | Required change |
| --- | --- |
| `src/domain/routes.ts` | Add `topics` top-level route and include `topicDetailRoutes()` in `prerenderRoutes` and `sitemapRoutes`. |
| `src/domain/seo.ts` | Add metadata/JSON-LD for topic index/detail routes, feed alternate link data, and sitemap coverage through `sitemapRoutes`. |
| `src/domain/social-previews.ts` | Add route kinds and asset families for site routes and topics; include home/about/contact and topic routes in target derivation. |
| `src/domain/project-validation.ts`, `writing-validation.ts`, `theme-validation.ts`, or a new discovery validator | Add or route through discovery validation for label slug collisions, empty labels, reserved topic slugs, and public-only refs. Prefer a new discovery validator if this logic spans all registries. |
| `scripts/verify-curation.ts` | Include discovery validation findings once topic slugs become public routes. |
| `scripts/generate-static-metadata.ts` | Write Atom feed XML files alongside sitemap and robots. Add check mode only if implementation wants stale generated files to fail before build. |
| `scripts/verify-static/expected-route-text.ts` | Add topic index/detail expected text derived from `discoveryTopics()`, not copied topic slugs. |
| `scripts/verify-static/metadata-jsonld-verifier.ts` | Assert topic route metadata/JSON-LD and feed alternate links where rendered. |
| `scripts/verify-static/sitemap-assets-verifier.ts` | Assert topic sitemap coverage, feed file presence/equality, and non-public topic exclusions. |
| `scripts/verify-static/run-static-verification.ts` | Update summary only after feed/discovery checks run. |
| `scripts/verify-release.ts` | Ensure feed XML is included in text scans, internal links from topic pages resolve, and generated social previews stay budgeted. |
| `scripts/release-readiness.ts` and `docs/release-readiness.md` | Add facts only for automated checks that actually run: discovery route coverage, feed file checks, search/filter browser coverage, generic-route social preview assets if implemented. |
| `tests/browser-release.playwright.ts` | Existing `prerenderRoutes` loop covers new pages automatically; add representative keyboard/search/filter checks. |
| `package.json` | No new dependency needed. Add scripts only if a feed/static-metadata check mode is created. |
| `src/routes/projects/index.tsx`, `src/routes/writing/index.tsx`, `src/routes/themes/index.tsx` | Add progressive filter/search controls using pure helpers. Keep full static content visible by default. |
| `src/routes/projects/[slug].tsx`, `src/routes/writing/[slug].tsx`, `src/routes/themes/[slug].tsx` | Replace or augment existing related panels with `related-work.ts` output where it improves journeys. |

### Safest Build Order

1. **Discovery core first**
   - Add `src/domain/discovery.ts` and tests.
   - Prove topics derive only from `publicProjectIndexProjects()`, `publicWritingEntries()`, and `publicThemeEntries()`.
   - Add validation for normalized slug collisions and reserved slugs before adding public routes.

2. **Static topic routes second**
   - Add `/topics` and `/topics/{slug}` routes.
   - Extend `src/domain/routes.ts`, sitemap generation, metadata, JSON-LD, expected static text, and static verifier coverage in the same phase.
   - This is the highest-dependency step because search, related work, sitemap, social previews, and browser checks can all reuse topic routes.

3. **Filtering/search third**
   - Add pure search/filter helpers and unit tests before UI controls.
   - Then wire controls into route shells with imported checked-in data, no fetches, and full static fallback lists.
   - Add one focused browser check for keyboard interaction, result counts, mobile dark layout, and no overlap.

4. **Related-work graph fourth**
   - Add `related-work.ts` after discovery labels exist.
   - Replace duplicated route-local relationship decisions gradually, starting with project/writing/theme detail panels.
   - Keep explicit relationships higher-ranked than shared-label suggestions.

5. **Feeds fifth**
   - Add `feeds.ts` and generated Atom XML files.
   - Write feeds from `scripts/generate-static-metadata.ts` or a thin feed generator called by that script.
   - Verify copied `.output/public` feed XML after build. Root `/feed.xml` can alias the writing feed until a dated `siteUpdates` registry exists.

6. **Generic and topic social previews sixth**
   - Extend `socialPreviewTargets()` only after the route inventory settles, so generated PNG churn happens once.
   - Add asset family support for `/social/generated/site/*` and `/social/generated/topics/*`.
   - Update social-preview checks, static metadata assertions, and release budgets together.

7. **Release evidence last**
   - Update `release-readiness.ts`, `docs/release-readiness.md`, and evidence labels only after static/browser/release checks prove the new coverage.
   - Keep hosted feed-reader checks, hosted social-card checks, Cloudflare preview, and live external-link smoke checks manual unless a deterministic local check actually exists.

## Patterns to Follow

### Pattern 1: Public Selector Input Boundary

**What:** Discovery, search, feeds, and related work should accept already-public selector output. They should not reimplement visibility rules.

**When:** Any feature exposes a cross-content list or route.

**Example:**

```typescript
export type DiscoverySources = {
  projects: readonly ProjectStory[];
  writingEntries: readonly PublicWritingEntry[];
  themes: readonly PublicThemeEntry[];
};

export function discoveryTopics(
  sources: DiscoverySources = {
    projects: publicProjectIndexProjects(),
    writingEntries: publicWritingEntries(),
    themes: publicThemeEntries(),
  },
): readonly DiscoveryTopic[] {
  return buildTopicsFromPublicSources(sources);
}
```

This keeps archived projects, draft writing, and hidden themes out of discovery by construction.

### Pattern 2: Helper-Derived Route Families

**What:** Topic routes should be derived from the same helper used by rendering, sitemap, static verification, and browser checks.

**When:** Adding `/topics/{slug}` routes or any future static discovery route family.

**Example:**

```typescript
export function topicDetailPath(topic: Pick<DiscoveryTopic, "slug">): string {
  return `/topics/${topic.slug}`;
}

export function topicDetailRoutes(
  topics: readonly DiscoveryTopic[] = discoveryTopics(),
): readonly string[] {
  return topics.map(topicDetailPath);
}
```

Then `src/domain/routes.ts` should include `...topicDetailRoutes()` in both `prerenderRoutes` and `sitemapRoutes`.

### Pattern 3: Feed XML as Generated Static Metadata

**What:** Feed files should be generated into `public/` from pure helpers and copied by the static build, like sitemap and robots.

**When:** Adding `/feed.xml`, `/writing/feed.xml`, or future feed files.

**Example:**

```typescript
export function writingFeedItems(
  entries: readonly PublicWritingEntry[] = publicWritingEntries(),
): readonly FeedItem[] {
  return entries
    .filter((entry) => entry.maybePublishedOn || entry.maybeUpdatedOn)
    .map(feedItemForWritingEntry)
    .sort((left, right) => right.updated.localeCompare(left.updated));
}
```

Do not create a Solid route that returns XML unless SolidStart static output for non-HTML routes is explicitly proven and verified. Static public XML is simpler and matches the current generator pattern.

### Pattern 4: Progressive Search Controls

**What:** Route pages should render all public content statically, then use Solid signals for client-side filtering over imported data.

**When:** Adding search inputs, segmented kind filters, topic chips, or query-param-driven filtering.

**Example:**

```typescript
const [query, setQuery] = createSignal("");
const [selectedKind, setSelectedKind] = createSignal<ContentKind | "all">("all");

const results = () =>
  filterSearchDocuments(searchDocuments(), {
    query: query(),
    kind: selectedKind(),
  });
```

The UI shell may be interactive, but the search index must come from checked-in domain helpers, not a visitor-runtime fetch.

### Pattern 5: Explicit-First Related Work

**What:** Related-work helpers should rank explicit curated relationships before label overlap.

**When:** Project, writing, theme, and topic detail pages show "related" cards.

**Example ranking:**

1. Direct writing-to-project and theme-to-project/theme-to-writing references.
2. Shared public theme entry.
3. Shared discovery topic/tag labels.
4. Display-order tie-breaker from the underlying public selector.

This keeps recommendations explainable and prevents generic tag overlap from overpowering authored curation.

## Anti-Patterns to Avoid

### Anti-Pattern 1: Runtime Content Fetches

**What:** Fetching `/content.json`, GitHub, a CMS, or search data in the visitor browser.

**Why bad:** It weakens the static deployment model and creates new failure modes that current no-runtime-GitHub and static-output checks are designed to prevent.

**Instead:** Import checked-in registries into route modules and pure helpers. If a future corpus is too large for the JS bundle, generate static route pages first and research a no-runtime-fetch alternative deliberately.

### Anti-Pattern 2: Duplicate Route Inventories

**What:** Hand-maintaining topic slugs in route files, sitemap code, tests, and browser checks.

**Why bad:** The static verifier already rejects unexpected routes and depends on `prerenderRoutes`; copied route lists will drift.

**Instead:** Add topic route helpers and consume them everywhere.

### Anti-Pattern 3: Treating Tags as Trusted Slugs

**What:** Using raw labels such as `Open web`, `open-web`, or `AI` directly as route segments.

**Why bad:** Labels are authored display text, not route-safe IDs. Case, punctuation, duplicate display labels, and reserved words can create collisions.

**Instead:** Normalize once in `discovery.ts`, validate collisions in curation, and expose one canonical label per slug.

### Anti-Pattern 4: Opaque Similarity

**What:** AI-generated related links, embedding search, or fuzzy similarity without explicit reasons.

**Why bad:** The site is curated and evidence-oriented. Opaque recommendations can surface weak or misleading connections.

**Instead:** Use explicit relationships and shared labels with visible reason labels.

### Anti-Pattern 5: Invented Feed Dates

**What:** Creating feed entries for projects or themes without durable published/updated dates.

**Why bad:** Feeds are chronological contracts. Synthetic dates make subscribers and release evidence less trustworthy.

**Instead:** Start with public writing entries. Add a checked-in `siteUpdates` registry if site-wide updates become a real requirement.

### Anti-Pattern 6: Evidence Labels Before Evidence

**What:** Adding release labels that claim feed validity, discovery coverage, search accessibility, or generic social previews before verifiers actually check them.

**Why bad:** Existing project guidance explicitly keeps release evidence truthful.

**Instead:** Update labels and docs after the relevant unit/static/browser/release checks exist and pass.

## Verification Integration Points

| Area | Integration point | Required proof |
| --- | --- | --- |
| Curation | `scripts/verify-curation.ts` | Discovery labels normalize safely, reserved topic slugs are rejected, and public routes cannot include hidden/draft/archived records. |
| Unit tests | `src/domain/discovery.test.ts`, `content-search.test.ts`, `related-work.test.ts`, `feeds.test.ts`, `social-previews.test.ts` | Pure behavior is deterministic and public-only before route UI is touched. |
| Prerendering | `src/domain/routes.ts` and `app.config.ts` | `/topics` and every `topicDetailRoutes()` path are included in `prerenderRoutes`; no hand-maintained lists. |
| Sitemap | `sitemapXml()` and `scripts/verify-static/sitemap-assets-verifier.ts` | Topic routes are included; hidden/draft/unknown topic routes are excluded. |
| Metadata/JSON-LD | `src/domain/seo.ts` and `scripts/verify-static/metadata-jsonld-verifier.ts` | Topic pages have title, description, canonical, OG/Twitter images, and structured data. |
| Feed XML | `src/domain/feeds.ts`, `scripts/generate-static-metadata.ts`, `feed-verifier.ts` | `/feed.xml` and `/writing/feed.xml` exist in `.output/public`, equal helper output, escape XML, and link only public routes. |
| Search/filter UI | `tests/browser-release.playwright.ts` | Representative search/filter controls are keyboard reachable, update visible results, preserve dark mobile layout, and avoid text overlap. |
| Related work | Static verifier expected text and release internal-link scan | Related links appear on representative detail pages and resolve to existing routes or anchors. |
| Social previews | `src/domain/social-previews.ts`, `scripts/generate-social-previews.ts --check`, static metadata verifier, release budget scanner | Home/about/contact/topic routes map to generated PNGs with manifest entries, dimensions, byte budgets, and metadata parity. |
| No runtime fetches | `scripts/verify-no-github-runtime.ts`, static forbidden patterns, browser checks | No visitor-runtime GitHub/API/CMS/search fetches are introduced. |
| Release docs | `scripts/release-readiness.ts`, `docs/release-readiness.md`, `scripts/verify-release.test.ts` | Automated labels name only local checks; hosted feed-reader/social-card/deploy smoke checks remain manual unless automated. |

## Scalability Considerations

| Concern | At current corpus | At 10K users | At 1M users |
| --- | --- | --- | --- |
| Topic route count | Dozens of generated pages are fine; derive all from helpers. | Static hosting handles traffic; watch build time and sitemap size. | Split sitemap only if route count grows substantially; still no backend needed. |
| Search/filter bundle | Importing public records into route bundles is acceptable. | Traffic does not change bundle size; monitor content growth. | If corpus grows large, research precomputed static indexes and partial hydration before adding runtime fetches. |
| Feed size | Include all public writing or cap at a documented count such as 25. | Feed traffic is static CDN traffic. | Keep feeds capped and cacheable; add archive pages instead of huge feeds. |
| Related-work graph | Compute at render/import time from small arrays. | No traffic impact after static build. | Precompute helper outputs during build only if corpus size makes route rendering slow. |
| Generated social previews | Existing manifest and budget checks scale to more PNGs if total budget is updated honestly. | Static assets cache well; generation time may grow. | Consider per-family budgets and generation caching, not dynamic OG endpoints. |
| Verification time | Full `bun run verify` remains appropriate. | Same local cost; traffic irrelevant. | If route count grows large, add affected-path modes while preserving a full release gate. |

## Sources

- `.planning/PROJECT.md` - v1.6 goals, current static architecture, constraints, and key decisions.
- `.planning/MILESTONES.md` - prior helper-derived route, metadata, social preview, and release verification patterns.
- `package.json` - Bun/SolidStart scripts and aggregate `bun run verify` ordering.
- `app.config.ts` - static preset and `prerenderRoutes` integration.
- `src/domain/projects.ts`, `src/domain/writing.ts`, `src/domain/themes.ts`, `src/domain/routes.ts`, `src/domain/seo.ts`, `src/domain/social-previews.ts` - current functional core and helper contracts.
- `src/routes/*` - current SolidStart route-shell pattern and metadata rendering.
- `scripts/generate-static-metadata.ts`, `scripts/generate-social-previews.ts`, `scripts/verify-static/*`, `scripts/verify-release.ts`, `scripts/release-readiness.ts` - imperative shell and verification integration points.
- `tests/browser-release.playwright.ts` - route-derived browser coverage and where focused search/filter checks should plug in.
- `standards/core/architecture.md`, `standards/core/frontend-ui.md`, `standards/core/verification.md`, `standards/languages/typescript-javascript.md` - functional core, dark-primary UI, repo-native verification, and Bun/TypeScript guidance.

## Open Questions

- Should `/feed.xml` alias the writing feed for v1.6, or should a small checked-in `siteUpdates` registry be introduced immediately for site-wide updates? Recommendation: alias writing first unless the roadmap explicitly needs project/theme update feed items.
- Should topic pages be included in primary navigation as `Topics`, or linked from existing project/writing/theme indexes only? Recommendation: add `Topics` to nav if the topic index has enough entries after discovery validation.
- Should search state be reflected in query parameters? Recommendation: start with in-page state; add query parameters only if shareable filtered views become a requirement.
- Should generic social previews include every top-level route or only home/about/contact? Recommendation: include home/about/contact plus topic routes after discovery lands; project/writing/theme indexes are already covered.
