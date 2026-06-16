---
generated_by: gsd-discuss-phase
lifecycle_mode: yolo
phase_lifecycle_id: 16-2026-06-14T15-12-27
generated_at: 2026-06-14T15:14:48.471Z
---

# Phase 16: Writing Metadata and Structured Data - Context

**Gathered:** 2026-06-14
**Status:** Ready for planning
**Mode:** Yolo

<domain>

## Phase Boundary

Phase 16 makes the already-built writing routes discoverable to crawlers and social previews. `/writing` and every public `/writing/{slug}` route should emit route-specific head metadata, static structured data, sitemap coverage, and the existing static social image fallback from pure writing and SEO helpers.

This phase should not expand browser/release-readiness evidence labels, add release docs, create dynamic Open Graph image routes, add RSS/search/tag archive behavior, introduce Markdown/MDX/CMS/runtime content fetching, or duplicate metadata logic inside route components. Phase 17 owns release-gate and evidence expansion after this metadata behavior exists.

</domain>

<decisions>

## Implementation Decisions

### Metadata Source Of Truth

- **D-01:** Put writing metadata decisions in pure SEO/domain helpers, not in copied route-component literals. Route components should render helper-derived values, matching the existing `metadataForRoute`, `metadataForProject`, `projectJsonLd`, and `sitemapXml` pattern.
- **D-02:** Keep `/writing` as a top-level collection page with route-specific title, description, canonical URL, Open Graph, and Twitter metadata. Existing `siteRoutes` copy can remain the source for the index when it stays specific enough.
- **D-03:** Add writing-detail metadata derived from each `PublicWritingEntry`: title from the entry title, description from `entry.summary`, canonical from `writingDetailPath(entry)`, and shared social image metadata from the checked-in fallback image.

### Social And Article Metadata

- **D-04:** Detail pages should use article-flavored social metadata where supported: `og:type="article"`, published/modified time when `maybePublishedOn` or `maybeUpdatedOn` exists, and article tags/topics from the writing entry.
- **D-05:** Twitter metadata can stay `summary_large_image` with the same static image fallback. Do not generate per-writing images in Phase 16.
- **D-06:** Use the existing checked-in `/social/bright-builds-og.png` fallback for both the index and detail pages unless planning proves a deterministic static asset already exists. Do not add a server endpoint or runtime image generation.

### Structured Data

- **D-07:** Add a pure `BlogPosting` JSON-LD helper for writing detail pages. It should include headline/title, description, canonical URL, author/creator from `personJsonLd`, optional published/modified dates, keywords from topics and tags, and enough article body/about text to describe the note without overclaiming unsupported publisher or comment/feed features.
- **D-08:** Add a pure writing-index `ItemList` or collection JSON-LD helper for `/writing`, with `ListItem` entries pointing to public writing detail URLs in the same order as `publicWritingEntries()`.
- **D-09:** Render JSON-LD before hydration through Solid route heads, using `jsonLdScriptContent` for escaping just like existing structured data.

### Sitemap Behavior

- **D-10:** Keep sitemap coverage route-derived through `prerenderRoutes` and `sitemapXml()` instead of hard-coding writing slugs in the generator.
- **D-11:** Public writing detail routes should enter sitemap output through `writingDetailRoutes()`. Draft, hidden, archived-only, unpublished, and unknown writing paths must stay excluded because public helpers filter them out before route derivation.

### OpenLinks Identity Presence

- **D-12:** Preserve OpenLinks as a subtle identity signal through existing visible footer/about/contact links and `Person.sameAs` metadata. Writing JSON-LD should reuse `personJsonLd()` so OpenLinks remains in the author identity graph without adding a new writing-page CTA.
- **D-13:** Do not add duplicate OpenLinks header/footer placements or make OpenLinks the main writing-route call to action.

### Verification Boundary

- **D-14:** Add focused unit coverage for pure writing metadata, JSON-LD, and sitemap helper behavior in Phase 16.
- **D-15:** Build/static generation can be used to prove generated head output while implementing, but Phase 17 owns broad release verifier expansion, browser release labels, release-readiness docs, and aggregate evidence naming.
- **D-16:** Keep static verification changes narrow if needed to prove Phase 16 behavior; do not add Phase 17 release-contract wording or overclaim full release-gate coverage before Phase 17.

### the agent's Discretion

- The planner may choose exact helper names and type names, provided nullable values use existing `maybe...` naming and public route components stay thin.
- The planner may choose `BlogPosting` only rather than splitting notes into `TechArticle`, unless existing content data gains a strong reason to distinguish schemas.
- The planner may decide whether `/writing` needs a new `writingItemListJsonLd()` helper or a more general list helper, as long as public writing order and canonical URLs remain domain-derived.

</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Milestone Scope

- `.planning/ROADMAP.md` - Phase 16 goal, requirements, success criteria, dependency on Phase 15, and Phase 17 boundary.
- `.planning/REQUIREMENTS.md` - META-01 through META-04 requirements and out-of-scope exclusions for dynamic OG/server work, feeds, search, CMS, MDX, and runtime content fetches.
- `.planning/PROJECT.md` - Static portfolio constraints, Bright Builds identity, v1.3 milestone context, and OpenLinks identity placement decision.
- `AGENTS.md` - Repo-local dark-primary, Bright Builds workflow, GSD artifact, and UI verification requirements.
- `AGENTS.bright-builds.md` - Bright Builds baseline workflow, TypeScript, verification, testing, and OpenLinks guidance.
- `standards-overrides.md` - No active local exceptions beyond the placeholder table.

### Prior Phase Decisions

- `.planning/phases/14-writing-domain-foundation/14-CONTEXT.md` - Writing registry, public helper, related-project, validation, and later-phase metadata boundaries.
- `.planning/phases/15-writing-routes-and-dark-ui/15-CONTEXT.md` - Route/UI decisions and explicit deferral of writing detail metadata, JSON-LD, sitemap discovery, and social sharing polish to Phase 16.
- `.planning/research/SUMMARY.md` - v1.3 research summary for writing metadata and structured data scope, including `BlogPosting`, `ItemList`, sitemap coverage, and static social fallback reuse.

### Existing Code

- `src/domain/seo.ts` - Existing metadata, social image, JSON-LD escaping, `personJsonLd`, project JSON-LD, sitemap, and robots helpers to extend.
- `src/domain/writing.ts` - `PublicWritingEntry`, `publicWritingEntries`, `maybePublicWritingEntryBySlug`, `writingDetailPath`, and `writingDetailRoutes` source data/helper surface.
- `src/domain/routes.ts` - `siteRoutes`, `/writing`, and `prerenderRoutes` route derivation that already includes public writing detail routes.
- `src/routes/writing/index.tsx` - Current writing index head rendering and body route shell.
- `src/routes/writing/[slug].tsx` - Current writing detail route shell that should switch to helper-derived metadata and JSON-LD.
- `scripts/generate-static-metadata.ts` - Static sitemap/robots generation path that should continue deriving sitemap output from `sitemapXml()`.

### Standards And Identity Guidance

- Bright Builds canonical standards `standards/core/architecture.md` - Keep business metadata/JSON-LD decisions in pure data-in/data-out helpers.
- Bright Builds canonical standards `standards/core/code-shape.md` - Use shallow control flow and `maybe...` naming for nullable values.
- Bright Builds canonical standards `standards/core/testing.md` - Unit test pure metadata and schema helpers with focused Arrange/Act/Assert tests.
- Bright Builds canonical standards `standards/core/verification.md` - Run repo-native verification before committing and prefer aggregate/owned commands when available.
- Bright Builds canonical standards `standards/languages/typescript-javascript.md` - Keep TypeScript business logic pure and use Bun/repo scripts.
- `openlinks-identity-presence` skill - Preserve subtle visible OpenLinks placement and metadata hints through `Person.sameAs` without repetitive promotion.

</canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- `metadataForRoute()` and `metadataForProject()` already define the metadata object shape and static social image fallback.
- `personJsonLd()` already includes profile identity and OpenLinks-aware `sameAs` links for structured data.
- `jsonLdScriptContent()` is the existing safe JSON-LD script serialization helper.
- `sitemapXml()` already emits XML from `prerenderRoutes`, and `prerenderRoutes` already appends `writingDetailRoutes()`.
- `writingDetailPath()` and `writingDetailRoutes()` are the public writing URL source of truth.

### Established Patterns

- Domain metadata helpers live in `src/domain/seo.ts`; route components consume them and render `<Title>`, `<Meta>`, canonical links, assets, and JSON-LD scripts.
- Route lists and sitemap paths derive from domain helpers rather than manually duplicated arrays.
- Static social preview currently uses one checked-in image for the portfolio and project detail pages.
- OpenLinks identity is already low-intrusion through visible profile/contact surfaces and profile metadata.

### Integration Points

- `src/routes/writing/index.tsx` should render writing-index JSON-LD in addition to its current metadata.
- `src/routes/writing/[slug].tsx` should compute detail metadata from the selected entry and render article metadata/JSON-LD when the entry exists.
- `src/domain/seo.ts` is the likely place for writing metadata and schema helper types/functions.
- Unit tests should likely sit near existing `src/domain/*` tests and cover pure helper behavior before route/static checks depend on it.
- `public/sitemap.xml` may need regeneration through `bun run generate:static-metadata` if route-derived sitemap output changes.

</code_context>

<specifics>

## Specific Ideas

- Prefer `BlogPosting` for both notes and essays in v1.3; avoid a taxonomy-heavy schema split until the writing set is larger.
- Article metadata should make dates/tags available when the typed registry has them, but missing optional dates should not break metadata generation.
- The index `ItemList` should follow curated public writing order so social/discovery data matches the visible list.
- Static social fallback reuse is a deliberate product choice, not a placeholder gap.

</specifics>

<deferred>

## Deferred Ideas

- Phase 17 owns static verifier expansion for generated metadata/JSON-LD/sitemap assertions, browser release coverage labels, release-readiness docs, and aggregate evidence naming.
- Future phases may add deterministic per-writing raster OG images, RSS/Atom feeds, search, tag archive pages, comments, newsletter capture, CMS/admin, MDX ingestion, or runtime content integrations.

</deferred>

---

*Phase: 16-writing-metadata-and-structured-data*
*Context gathered: 2026-06-14*
