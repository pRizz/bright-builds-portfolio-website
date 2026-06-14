# Phase 16: Writing Metadata and Structured Data - Research

**Researched:** 2026-06-14 [VERIFIED: system current_date]
**Domain:** SolidStart static route metadata, Schema.org JSON-LD, Open Graph article metadata, and route-derived sitemap generation [VERIFIED: .planning/phases/16-writing-metadata-and-structured-data/16-CONTEXT.md; CITED: docs.solidjs.com/solid-start/building-your-application/head-and-metadata; CITED: schema.org/BlogPosting]
**Confidence:** HIGH [VERIFIED: codebase inspection; CITED: official SolidStart, Schema.org, Google Search Central, Open Graph, and sitemaps.org docs]

<user_constraints>
## User Constraints (from CONTEXT.md)

Copied verbatim from `.planning/phases/16-writing-metadata-and-structured-data/16-CONTEXT.md`. [VERIFIED: .planning/phases/16-writing-metadata-and-structured-data/16-CONTEXT.md]

### Locked Decisions

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

### Deferred Ideas (OUT OF SCOPE)

## Deferred Ideas

- Phase 17 owns static verifier expansion for generated metadata/JSON-LD/sitemap assertions, browser release coverage labels, release-readiness docs, and aggregate evidence naming.
- Future phases may add deterministic per-writing raster OG images, RSS/Atom feeds, search, tag archive pages, comments, newsletter capture, CMS/admin, MDX ingestion, or runtime content integrations.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| META-01 | `/writing` and each writing detail route have route-specific title, description, canonical URL, Open Graph, and Twitter metadata derived from writing and profile data. [VERIFIED: .planning/REQUIREMENTS.md] | Use `@solidjs/meta` route-local `Title`, `Meta`, and `Link` tags, with values generated by pure helpers in `src/domain/seo.ts`. [CITED: docs.solidjs.com/solid-start/building-your-application/head-and-metadata; VERIFIED: src/domain/seo.ts; VERIFIED: src/routes/writing/index.tsx; VERIFIED: src/routes/writing/[slug].tsx] |
| META-02 | Writing detail routes render static `BlogPosting` JSON-LD and the writing index renders appropriate collection or `ItemList` JSON-LD before hydration. [VERIFIED: .planning/REQUIREMENTS.md] | Add pure `writingBlogPostingJsonLd()` and `writingItemListJsonLd()` helpers, serialize with `jsonLdScriptContent()`, and render scripts from route heads before hydration. [CITED: schema.org/BlogPosting; CITED: schema.org/ItemList; VERIFIED: src/domain/seo.ts; VERIFIED: src/routes/projects/index.tsx] |
| META-03 | Generated sitemap output includes public writing routes and excludes draft or hidden writing routes. [VERIFIED: .planning/REQUIREMENTS.md] | Keep `sitemapXml()` fed by `prerenderRoutes`, which already appends `writingDetailRoutes()` after Phase 15; add unit coverage that public routes appear and non-public fixtures stay absent. [VERIFIED: src/domain/routes.ts; VERIFIED: src/domain/writing.ts; VERIFIED: public/sitemap.xml; CITED: developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap] |
| META-04 | Writing routes use the checked-in static social preview fallback or documented deterministic support without runtime image generation. [VERIFIED: .planning/REQUIREMENTS.md] | Reuse `socialImageForProfile()` through existing metadata helpers; `public/social/bright-builds-og.png` is a checked-in 1200x630 PNG. [VERIFIED: src/domain/seo.ts; VERIFIED: file public/social/bright-builds-og.png] |
</phase_requirements>

## Project Constraints (from AGENTS.md)

- Read `AGENTS.md`, `AGENTS.bright-builds.md`, `standards-overrides.md`, and applicable pinned canonical standards before planning, review, implementation, or audit work. [VERIFIED: AGENTS.md; VERIFIED: AGENTS.bright-builds.md]
- Apply repo-local guidance first when it is stricter than Bright Builds defaults. [VERIFIED: AGENTS.md; VERIFIED: AGENTS.bright-builds.md]
- Keep user-facing UI dark-primary by default; light-first classes need a clear local reason. [VERIFIED: AGENTS.md]
- UI changes require desktop and mobile dark rendering, contrast/readability, and text-overlap checks. [VERIFIED: AGENTS.md]
- Use SolidJS / SolidStart-style static generation and keep the site fast, SEO-friendly, and static-deployable. [VERIFIED: AGENTS.md]
- Prefer Mystic UI for compatible SolidJS components, but Phase 16 is metadata/domain work and does not need new UI library usage. [VERIFIED: AGENTS.md; VERIFIED: phase scope in 16-CONTEXT.md]
- Curated checked-in content is preferred; placeholder or automatically mirrored content is not acceptable. [VERIFIED: AGENTS.md; VERIFIED: .planning/REQUIREMENTS.md]
- Pages need meaningful metadata, structured content, canonical links, Open Graph/Twitter basics, sitemap/robots behavior, and human-readable project or writing pages. [VERIFIED: AGENTS.md; VERIFIED: .planning/REQUIREMENTS.md]
- GSD artifacts are part of this repo workflow, but this run must not create git commits or push because the user explicitly constrained the wrapper to commit later. [VERIFIED: AGENTS.md; VERIFIED: user prompt additional_context]
- TypeScript/JavaScript work should use Bun, existing lock files, `maybe...` nullable naming, early returns, repo-owned scripts, and repo-native verification. [VERIFIED: AGENTS.md; CITED: raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/languages/typescript-javascript.md]
- Unit tests for pure/business logic must be focused and clearly arranged as Arrange, Act, Assert unless the structure is trivial. [VERIFIED: AGENTS.md; CITED: raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/testing.md]
- No active standards overrides exist beyond the placeholder table in `standards-overrides.md`. [VERIFIED: standards-overrides.md]
- No project-specific skills were found in `.claude/skills/` or `.agents/skills/`. [VERIFIED: find .claude/skills .agents/skills -maxdepth 2 -type f -name SKILL.md]

## Summary

Phase 16 should extend the existing SEO/domain helper surface rather than introduce a new metadata framework or content pipeline. [VERIFIED: src/domain/seo.ts; VERIFIED: .planning/phases/16-writing-metadata-and-structured-data/16-CONTEXT.md] SolidStart supports route-specific head tags through `@solidjs/meta`, and this repo already renders `Title`, `Meta`, canonical links, Open Graph, Twitter tags, asset links, and JSON-LD scripts from helper-derived values. [CITED: docs.solidjs.com/solid-start/building-your-application/head-and-metadata; VERIFIED: src/routes/projects/[slug].tsx; VERIFIED: src/routes/writing/index.tsx]

The implementation should add pure helpers for writing detail metadata, article social fields, `BlogPosting` JSON-LD, and writing index `ItemList` JSON-LD. [VERIFIED: .planning/phases/16-writing-metadata-and-structured-data/16-CONTEXT.md; CITED: schema.org/BlogPosting; CITED: schema.org/ItemList] The sitemap path is already structurally correct after Phase 15 because `prerenderRoutes` imports `writingDetailRoutes()` and `sitemapXml()` consumes `prerenderRoutes`; Phase 16 should add helper-level tests that lock this behavior without hard-coded slug duplication. [VERIFIED: src/domain/routes.ts; VERIFIED: src/domain/seo.ts; VERIFIED: src/domain/writing.ts; VERIFIED: public/sitemap.xml]

OpenLinks should stay subtle: writing JSON-LD should reuse `personJsonLd()` so the existing `Person.sameAs` identity graph includes `https://openlinks.us/`, and the route UI should not add another OpenLinks CTA. [VERIFIED: src/domain/profile.ts; VERIFIED: src/domain/seo.ts; VERIFIED: .planning/phases/16-writing-metadata-and-structured-data/16-CONTEXT.md; VERIFIED: /Users/peterryszkiewicz/.codex/skills/openlinks-identity-presence/SKILL.md]

**Primary recommendation:** Add writing metadata and JSON-LD as pure functions in `src/domain/seo.ts`, wire `src/routes/writing/index.tsx` and `src/routes/writing/[slug].tsx` to those helpers, reuse `/social/bright-builds-og.png`, and verify with focused Vitest plus targeted build/static checks only where needed. [VERIFIED: src/domain/seo.ts; VERIFIED: src/routes/writing/index.tsx; VERIFIED: src/routes/writing/[slug].tsx; VERIFIED: public/social/bright-builds-og.png; VERIFIED: .planning/phases/16-writing-metadata-and-structured-data/16-CONTEXT.md]

## Standard Stack

### Core

| Library / Surface | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@solidjs/start` | Repo pin `1.3.2`; npm latest `1.3.2`, modified `2026-06-12T03:26:07.637Z`. [VERIFIED: package.json; VERIFIED: npm view @solidjs/start version time.modified] | Static SolidStart app and route prerendering. [VERIFIED: app.config.ts; CITED: docs.solidjs.com/solid-start/building-your-application/route-prerendering] | Existing framework; route prerendering is the documented SSG path. [VERIFIED: package.json; CITED: docs.solidjs.com/solid-start/building-your-application/route-prerendering] |
| `@solidjs/meta` | Repo pin `0.29.4`; npm latest `0.29.4`, modified `2026-03-17T19:41:59.132Z`. [VERIFIED: package.json; VERIFIED: npm view @solidjs/meta version time.modified] | Route-local `<Title>`, `<Meta>`, and `<Link>` head output. [VERIFIED: src/routes/writing/index.tsx; CITED: docs.solidjs.com/solid-start/building-your-application/head-and-metadata] | SolidStart docs identify `@solidjs/meta` as the library for custom document head content. [CITED: docs.solidjs.com/solid-start/building-your-application/head-and-metadata] |
| `solid-js` | Repo pin `1.9.13`; npm latest `1.9.13`, modified `2026-05-19T17:38:41.300Z`. [VERIFIED: package.json; VERIFIED: npm view solid-js version time.modified] | Route rendering and control flow through `Show` and `For`. [VERIFIED: src/routes/writing/index.tsx; VERIFIED: src/routes/writing/[slug].tsx] | Existing app runtime; no new rendering dependency is needed for metadata work. [VERIFIED: package.json; VERIFIED: src/routes/writing/index.tsx] |
| `src/domain/seo.ts` | Repo-owned module. [VERIFIED: src/domain/seo.ts] | Metadata, social image, JSON-LD, sitemap, and robots helpers. [VERIFIED: src/domain/seo.ts] | Existing pure helper surface already owns `metadataForRoute`, `metadataForProject`, `personJsonLd`, `projectJsonLd`, `jsonLdScriptContent`, and `sitemapXml`. [VERIFIED: src/domain/seo.ts] |
| `src/domain/writing.ts` | Repo-owned module. [VERIFIED: src/domain/writing.ts] | Public writing entries, nullable slug lookup, writing detail paths, detail routes, and project relationships. [VERIFIED: src/domain/writing.ts] | Existing Phase 14/15 source of truth for public writing eligibility and route derivation. [VERIFIED: .planning/phases/14-writing-domain-foundation/14-CONTEXT.md; VERIFIED: .planning/phases/15-writing-routes-and-dark-ui/15-CONTEXT.md; VERIFIED: src/domain/writing.ts] |
| Schema.org `BlogPosting` and `ItemList` | Schema.org V30.0 page footer for `ListItem`; `BlogPosting` canonical URL verified. [CITED: schema.org/ListItem; CITED: schema.org/BlogPosting] | Structured data vocabulary for writing details and the writing index. [CITED: schema.org/BlogPosting; CITED: schema.org/ItemList] | Google Search Central supports `Article`, `NewsArticle`, and `BlogPosting` article objects, and Schema.org documents `ItemList` JSON-LD with `itemListElement`. [CITED: developers.google.com/search/docs/appearance/structured-data/article; CITED: schema.org/ItemList] |
| Static social preview asset | `public/social/bright-builds-og.png`, 1200x630 PNG. [VERIFIED: file public/social/bright-builds-og.png] | Shared Open Graph and Twitter image fallback. [VERIFIED: src/domain/seo.ts; VERIFIED: public/social/bright-builds-og.png] | Existing helper already maps metadata images to the checked-in fallback and static verifier checks fallback dimensions. [VERIFIED: src/domain/seo.ts; VERIFIED: scripts/verify-static.ts] |

### Supporting

| Library / Tool | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Bun | `packageManager` pin `bun@1.3.14`; local `bun --version` is `1.3.9`. [VERIFIED: package.json; VERIFIED: bun --version] | Run scripts, tests, and builds. [VERIFIED: package.json] | Use existing `bun run test`, `bun run typecheck`, `bun run build`, and static metadata generation commands; upgrade local Bun only if version drift causes failures. [VERIFIED: package.json; VERIFIED: environment audit] |
| TypeScript | Repo pin `6.0.3`; npm latest `6.0.3`, modified `2026-04-16T23:38:28.092Z`. [VERIFIED: package.json; VERIFIED: npm view typescript version time.modified] | Type-check helper shapes and route imports. [VERIFIED: package.json; VERIFIED: tsconfig.json] | Use `bun run typecheck` after helper and route changes. [VERIFIED: package.json] |
| Vitest | Repo pin `4.1.7`; npm latest `4.1.8`, modified `2026-06-12T12:57:21.700Z`. [VERIFIED: package.json; VERIFIED: npm view vitest version time.modified] | Unit tests for pure metadata, JSON-LD, and sitemap helper behavior. [VERIFIED: src/domain/portfolio-surfaces.test.ts; VERIFIED: src/domain/project-detail-routes.test.ts; VERIFIED: src/domain/writing.test.ts] | Add focused tests near existing domain tests; do not update Vitest as part of this phase unless the repo independently chooses dependency maintenance. [VERIFIED: package.json; VERIFIED: .planning/phases/16-writing-metadata-and-structured-data/16-CONTEXT.md] |
| Biome | Repo pin `2.4.15`; npm latest `2.5.0`, modified `2026-06-12T12:07:00.520Z`. [VERIFIED: package.json; VERIFIED: npm view @biomejs/biome version time.modified] | Formatting and linting. [VERIFIED: package.json] | Use repo scripts; do not add ESLint or formatter tooling for this phase. [VERIFIED: package.json; VERIFIED: standards/languages/typescript-javascript.md via Bright Builds raw docs] |
| Playwright / axe | `@playwright/test` repo pin and npm latest `1.60.0`; `@axe-core/playwright` repo pin and npm latest `4.11.3`. [VERIFIED: package.json; VERIFIED: npm view @playwright/test version time.modified; VERIFIED: npm view @axe-core/playwright version time.modified] | Browser accessibility and visual release verification. [VERIFIED: tests/browser-release.playwright.ts; VERIFIED: package.json] | Phase 16 should not expand broad browser release labels because Phase 17 owns that surface; use only if a narrow implementation proof is needed. [VERIFIED: .planning/phases/16-writing-metadata-and-structured-data/16-CONTEXT.md] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Pure helpers in `src/domain/seo.ts` | Route-component metadata literals. | Rejected because locked decision D-01 requires helper-derived metadata and existing project metadata helpers already centralize this behavior. [VERIFIED: .planning/phases/16-writing-metadata-and-structured-data/16-CONTEXT.md; VERIFIED: src/domain/seo.ts] |
| Schema.org plain object types owned by repo | `schema-dts` or another schema typing package. | Not recommended because existing JSON-LD helpers are typed locally, Phase 16 needs a small fixed schema surface, and no new dependency is needed. [VERIFIED: src/domain/seo.ts; VERIFIED: package.json; VERIFIED: .planning/REQUIREMENTS.md] |
| Checked-in fallback social image | Dynamic OG image endpoint or per-writing image generation. | Rejected because META-04 and decisions D-05/D-06 exclude runtime image generation and server endpoints. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: .planning/phases/16-writing-metadata-and-structured-data/16-CONTEXT.md] |
| Route-derived sitemap through `prerenderRoutes` | Hard-coded writing slug list inside `sitemapXml()` or `scripts/generate-static-metadata.ts`. | Rejected because decisions D-10/D-11 require route-derived sitemap coverage and public helpers already filter non-public writing. [VERIFIED: src/domain/routes.ts; VERIFIED: src/domain/writing.ts; VERIFIED: scripts/generate-static-metadata.ts; VERIFIED: 16-CONTEXT.md] |
| Typed checked-in writing registry | MDX, CMS, RSS import, or runtime content fetch. | Rejected by v1.3 requirements and out-of-scope table. [VERIFIED: .planning/REQUIREMENTS.md] |

**Installation:**

```bash
# No new packages for Phase 16. [VERIFIED: package.json; VERIFIED: 16-CONTEXT.md]
bun run test
```

**Version verification:** Core package pins and npm registry versions were checked with `npm view [package] version time.modified` on 2026-06-14. [VERIFIED: npm view @solidjs/start version time.modified; VERIFIED: npm view @solidjs/meta version time.modified; VERIFIED: npm view solid-js version time.modified; VERIFIED: npm view typescript version time.modified; VERIFIED: npm view vitest version time.modified; VERIFIED: npm view @biomejs/biome version time.modified; VERIFIED: npm view vite version time.modified; VERIFIED: npm view @playwright/test version time.modified; VERIFIED: npm view @axe-core/playwright version time.modified]

## Architecture Patterns

### Recommended Project Structure

```text
src/
├── domain/
│   ├── seo.ts                  # Extend with writing metadata and JSON-LD helpers. [VERIFIED: src/domain/seo.ts]
│   ├── writing.ts              # Existing public writing route/data source. [VERIFIED: src/domain/writing.ts]
│   └── *metadata*.test.ts      # Add focused Vitest coverage in an existing or new domain test file. [VERIFIED: src/domain/portfolio-surfaces.test.ts; VERIFIED: src/domain/project-detail-routes.test.ts]
├── routes/
│   └── writing/
│       ├── index.tsx           # Render writing index metadata and ItemList JSON-LD from helpers. [VERIFIED: src/routes/writing/index.tsx]
│       └── [slug].tsx          # Render detail metadata, article OG tags, and BlogPosting JSON-LD from helpers. [VERIFIED: src/routes/writing/[slug].tsx]
scripts/
└── generate-static-metadata.ts # Keep sitemap/robots generation helper-derived. [VERIFIED: scripts/generate-static-metadata.ts]
public/
├── sitemap.xml                 # Regenerate only if helper output changes. [VERIFIED: public/sitemap.xml]
└── social/bright-builds-og.png # Existing fallback share image. [VERIFIED: file public/social/bright-builds-og.png]
```

### Pattern 1: Pure Metadata Helpers

**What:** Add `metadataForWritingEntry(entry, profile)` and optionally `metadataForWritingIndex(route, profile)` to `src/domain/seo.ts`; detail metadata should derive title from `entry.title`, description from `entry.summary`, canonical from `writingDetailPath(entry)`, and image from `socialImageForProfile(profile)`. [VERIFIED: 16-CONTEXT.md; VERIFIED: src/domain/seo.ts; VERIFIED: src/domain/writing.ts]

**When to use:** Use this for every public writing detail route and for `/writing` if the route metadata needs a named helper beyond `metadataForRoute(routeByPath("/writing"))`. [VERIFIED: src/routes/writing/index.tsx; VERIFIED: 16-CONTEXT.md]

**Example:**

```typescript
// Source: local helper pattern in src/domain/seo.ts and writing path helpers. [VERIFIED: src/domain/seo.ts; VERIFIED: src/domain/writing.ts]
export function metadataForWritingEntry(
  entry: PublicWritingEntry,
  profile: Profile = peterProfile,
): PageMetadata {
  const canonical = `${profile.canonicalOrigin}${writingDetailPath(entry)}`;
  const title = `${entry.title} | Writing | Bright Builds`;
  const description = entry.summary;
  const socialImage = socialImageForProfile(profile);

  return {
    title,
    description,
    canonical,
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
      image: socialImage,
      article: {
        maybePublishedTime: entry.maybePublishedOn,
        maybeModifiedTime: entry.maybeUpdatedOn,
        tags: [...entry.topics, ...entry.tags],
      },
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      image: socialImage,
    },
  };
}
```

### Pattern 2: Article Metadata Rendering From Helper Output

**What:** Render `og:type="article"` and `article:*` tags only when helper output says the page is article-flavored. [VERIFIED: 16-CONTEXT.md; CITED: ogp.me]

**When to use:** Use in `src/routes/writing/[slug].tsx` for public entries; keep the fallback route minimal and non-public. [VERIFIED: src/routes/writing/[slug].tsx]

**Example:**

```tsx
// Source: @solidjs/meta route-local tags and Open Graph article properties. [CITED: docs.solidjs.com/solid-start/building-your-application/head-and-metadata; CITED: ogp.me]
<Meta property="og:type" content={metadata.openGraph.type} />
<Show when={metadata.openGraph.article?.maybePublishedTime}>
  {(publishedTime) => <Meta property="article:published_time" content={publishedTime()} />}
</Show>
<For each={metadata.openGraph.article?.tags ?? []}>
  {(tag) => <Meta property="article:tag" content={tag} />}
</For>
```

### Pattern 3: `BlogPosting` JSON-LD Helper

**What:** Create a pure helper that emits `BlogPosting` JSON-LD using `headline`, `name`, `description`, `url`, `mainEntityOfPage`, `author`, `creator`, optional dates, image fallback, keywords, `about`, and text body. [VERIFIED: 16-CONTEXT.md; CITED: schema.org/BlogPosting; CITED: developers.google.com/search/docs/appearance/structured-data/article]

**When to use:** Use only for public writing detail pages after `maybePublicWritingEntryBySlug()` returns an entry. [VERIFIED: src/domain/writing.ts; VERIFIED: src/routes/writing/[slug].tsx]

**Example:**

```typescript
// Source: Schema.org BlogPosting and existing personJsonLd/jsonLdScriptContent pattern. [CITED: schema.org/BlogPosting; VERIFIED: src/domain/seo.ts]
export function writingBlogPostingJsonLd(
  entry: PublicWritingEntry,
  profile: Profile = peterProfile,
): WritingBlogPostingJsonLd {
  const url = `${profile.canonicalOrigin}${writingDetailPath(entry)}`;

  return removeUndefinedProperties({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: entry.title,
    name: entry.title,
    description: entry.summary,
    url,
    mainEntityOfPage: url,
    image: socialImageForProfile(profile).url,
    author: personJsonLd(profile),
    creator: personJsonLd(profile),
    datePublished: entry.maybePublishedOn,
    dateModified: entry.maybeUpdatedOn,
    keywords: [...entry.topics, ...entry.tags].join(", "),
    about: [...entry.topics, ...entry.tags],
    articleBody: writingArticleBodyText(entry),
  });
}
```

### Pattern 4: Writing Index `ItemList` JSON-LD Helper

**What:** Add `writingItemListJsonLd(entries = publicWritingEntries(), profile = peterProfile)` returning `ItemList` with ordered `ListItem` values pointing to canonical writing detail URLs. [VERIFIED: 16-CONTEXT.md; VERIFIED: src/domain/writing.ts; CITED: schema.org/ItemList; CITED: schema.org/ListItem]

**When to use:** Use on `/writing` next to existing `personJsonLd()` script, matching the projects index route pattern. [VERIFIED: src/routes/projects/index.tsx; VERIFIED: src/routes/writing/index.tsx]

**Example:**

```typescript
// Source: existing projectItemListJsonLd pattern and Schema.org ListItem JSON-LD examples. [VERIFIED: src/domain/seo.ts; CITED: schema.org/ItemList; CITED: schema.org/ListItem]
export function writingItemListJsonLd(
  entries: readonly PublicWritingEntry[] = publicWritingEntries(),
  profile: Profile = peterProfile,
): WritingItemListJsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: entries.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "BlogPosting",
        headline: entry.title,
        description: entry.summary,
        url: `${profile.canonicalOrigin}${writingDetailPath(entry)}`,
      },
    })),
  };
}
```

### Pattern 5: Route-Derived Sitemap Coverage

**What:** Leave `sitemapXml()` route-derived through its default `paths = prerenderRoutes`, and test the writing routes through `writingDetailRoutes()`. [VERIFIED: src/domain/seo.ts; VERIFIED: src/domain/routes.ts; VERIFIED: src/domain/writing.ts]

**When to use:** Use for META-03; do not add a writing-specific sitemap path list. [VERIFIED: 16-CONTEXT.md]

**Example:**

```typescript
// Source: current sitemapXml default and writingDetailRoutes helper. [VERIFIED: src/domain/seo.ts; VERIFIED: src/domain/writing.ts]
it("includes public writing routes and excludes non-public writing routes in sitemap XML", () => {
  // Arrange
  const entries = [
    makeWritingEntry({ slug: "public-note", status: "published" }),
    makeWritingEntry({ slug: "draft-note", status: "draft" }),
  ];
  const paths = ["/writing", ...writingDetailRoutes(entries)];

  // Act
  const sitemap = sitemapXml(paths, peterProfile);

  // Assert
  expect(sitemap).toContain("https://www.brightbuilds.us/writing/public-note");
  expect(sitemap).not.toContain("draft-note");
});
```

### Anti-Patterns to Avoid

- **Metadata literals in route components:** This would duplicate title/canonical/description logic and violate D-01. [VERIFIED: 16-CONTEXT.md]
- **Hard-coded writing slugs in sitemap generation:** This would bypass public helper filtering and violate D-10/D-11. [VERIFIED: 16-CONTEXT.md; VERIFIED: src/domain/routes.ts; VERIFIED: src/domain/writing.ts]
- **Direct `JSON.stringify()` in route script tags:** Existing code uses `jsonLdScriptContent()` to escape `<`, and tests already cover that helper. [VERIFIED: src/domain/seo.ts; VERIFIED: src/domain/portfolio-surfaces.test.ts; VERIFIED: src/domain/project-detail-routes.test.ts]
- **Dynamic OG image endpoint:** Dynamic/server image generation is explicitly out of scope for v1.3 and Phase 16. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: 16-CONTEXT.md]
- **Schema overclaiming:** Do not add publisher, comments, feed, aggregate rating, paywall, or CMS properties unless the content surface truly supports them. [VERIFIED: 16-CONTEXT.md; CITED: schema.org/BlogPosting]
- **OpenLinks repetition:** Do not add another writing-page OpenLinks CTA because the phase decision keeps OpenLinks subtle through existing visible links and `Person.sameAs`. [VERIFIED: 16-CONTEXT.md; VERIFIED: /Users/peterryszkiewicz/.codex/skills/openlinks-identity-presence/SKILL.md; VERIFIED: src/domain/profile.ts]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| JSON-LD script escaping | A new JSON escaping routine or raw `JSON.stringify()` in route components. [VERIFIED: src/domain/seo.ts] | `jsonLdScriptContent()`. [VERIFIED: src/domain/seo.ts] | Existing helper replaces `<` and tests already prove the safety behavior. [VERIFIED: src/domain/portfolio-surfaces.test.ts; VERIFIED: src/domain/project-detail-routes.test.ts] |
| Writing detail URL derivation | Template strings like `` `/writing/${entry.slug}` `` outside the domain helper. [VERIFIED: src/domain/writing.ts] | `writingDetailPath(entry)`. [VERIFIED: src/domain/writing.ts] | Public URLs stay consistent across metadata, JSON-LD, routes, and sitemap. [VERIFIED: src/domain/writing.ts; VERIFIED: src/domain/routes.ts] |
| Public route selection | Filtering statuses inside route components or sitemap code. [VERIFIED: src/domain/writing.ts; VERIFIED: src/routes/writing/[slug].tsx] | `publicWritingEntries()`, `maybePublicWritingEntryBySlug()`, and `writingDetailRoutes()`. [VERIFIED: src/domain/writing.ts] | Draft, hidden, archived, and unknown entries stay excluded before route derivation. [VERIFIED: src/domain/writing.ts; VERIFIED: src/domain/writing.test.ts] |
| Structured data vocabulary | A generic schema abstraction or third-party schema package. [VERIFIED: package.json] | Small local `BlogPosting` and `ItemList` types in `src/domain/seo.ts`. [VERIFIED: src/domain/seo.ts; CITED: schema.org/BlogPosting; CITED: schema.org/ItemList] | Phase 16 has a small fixed schema surface and existing project JSON-LD helpers are locally typed. [VERIFIED: src/domain/seo.ts; VERIFIED: 16-CONTEXT.md] |
| Social image handling | Per-writing image generation, server endpoints, remote image lookup, or runtime rendering. [VERIFIED: .planning/REQUIREMENTS.md] | Existing checked-in `/social/bright-builds-og.png` fallback. [VERIFIED: public/social/bright-builds-og.png; VERIFIED: src/domain/seo.ts] | META-04 and D-05/D-06 require static fallback behavior without runtime image generation. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: 16-CONTEXT.md] |
| Sitemap output | A new sitemap generator for writing. [VERIFIED: scripts/generate-static-metadata.ts] | Existing `sitemapXml()` plus `scripts/generate-static-metadata.ts`. [VERIFIED: src/domain/seo.ts; VERIFIED: scripts/generate-static-metadata.ts] | Google expects absolute URLs in sitemaps, and the existing helper already emits profile-origin absolute URLs. [VERIFIED: src/domain/seo.ts; CITED: developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap] |

**Key insight:** The hard part is keeping metadata, JSON-LD, static routes, and sitemap URLs derived from the same public writing helpers; custom one-off code in any one layer creates drift and draft-leak risk. [VERIFIED: src/domain/writing.ts; VERIFIED: src/domain/routes.ts; VERIFIED: src/domain/seo.ts; VERIFIED: 16-CONTEXT.md]

## Common Pitfalls

### Pitfall 1: Detail Routes Keep Generic or Literal Metadata

**What goes wrong:** `/writing/{slug}` keeps a hard-coded title/description or only renders the entry summary without canonical, Open Graph, Twitter, and article fields. [VERIFIED: current src/routes/writing/[slug].tsx]

**Why it happens:** Writing detail currently computes `const title = \`${entry.title} | Writing | Bright Builds\`` in the route instead of using a domain metadata helper. [VERIFIED: src/routes/writing/[slug].tsx]

**How to avoid:** Move title, description, canonical, social image, and article field decisions into `metadataForWritingEntry()`. [VERIFIED: 16-CONTEXT.md; VERIFIED: src/domain/seo.ts]

**Warning signs:** Tests assert only visible article body text and not helper-derived metadata fields. [VERIFIED: scripts/verify-static.ts; VERIFIED: src/domain/writing.test.ts]

### Pitfall 2: `og:type` Type Shape Blocks Article Metadata

**What goes wrong:** `PageMetadata.openGraph.type` currently only allows `"website"`, so adding `article` fields can trigger type churn. [VERIFIED: src/domain/seo.ts]

**Why it happens:** The existing metadata helpers were built for top-level pages and project pages before writing detail article metadata was in scope. [VERIFIED: src/domain/seo.ts; VERIFIED: .planning/phases/12-project-metadata-and-sharing if present not loaded; VERIFIED: .planning/STATE.md]

**How to avoid:** Widen the type to `"website" | "article"` and add an optional `article` metadata object with `maybePublishedTime`, `maybeModifiedTime`, and `tags`, or create a narrow writing metadata type that route code can render. [VERIFIED: 16-CONTEXT.md; CITED: ogp.me]

**Warning signs:** Route code special-cases `entry.maybePublishedOn` and `entry.tags` directly while helper output contains only generic fields. [VERIFIED: src/routes/writing/[slug].tsx; VERIFIED: 16-CONTEXT.md]

### Pitfall 3: Modified Date Overclaiming

**What goes wrong:** JSON-LD or Open Graph metadata emits `dateModified` / `article:modified_time` for entries that only have a published date. [VERIFIED: src/domain/writing.ts; CITED: schema.org/BlogPosting; CITED: ogp.me]

**Why it happens:** It is tempting to default `maybeUpdatedOn ?? maybePublishedOn`, but D-07 says dates are optional and the registry distinguishes published and updated fields. [VERIFIED: 16-CONTEXT.md; VERIFIED: src/domain/writing.ts]

**How to avoid:** Emit `datePublished` / `article:published_time` only when `maybePublishedOn` exists, and emit modified fields only when `maybeUpdatedOn` exists. [VERIFIED: src/domain/writing.ts; CITED: schema.org/BlogPosting; CITED: ogp.me]

**Warning signs:** Tests expect modified metadata for a fixture without `maybeUpdatedOn`. [VERIFIED: src/domain/writing.ts]

### Pitfall 4: JSON-LD Includes Unsupported Site Features

**What goes wrong:** `BlogPosting` claims comments, publisher details, feeds, ratings, paywalls, or CMS-like structures that the static writing surface does not provide. [VERIFIED: 16-CONTEXT.md; CITED: schema.org/BlogPosting]

**Why it happens:** Schema examples often include rich publisher/comment structures that are not required for this site. [CITED: schema.org/BlogPosting; CITED: developers.google.com/search/docs/appearance/structured-data/article]

**How to avoid:** Include only data backed by `PublicWritingEntry`, `personJsonLd()`, and the checked-in image fallback. [VERIFIED: src/domain/writing.ts; VERIFIED: src/domain/seo.ts; VERIFIED: public/social/bright-builds-og.png]

**Warning signs:** New JSON-LD fields have no source in `PublicWritingEntry`, `Profile`, or existing static assets. [VERIFIED: src/domain/writing.ts; VERIFIED: src/domain/profile.ts; VERIFIED: src/domain/seo.ts]

### Pitfall 5: Sitemap Tests Only Prove Current Seed Slugs

**What goes wrong:** A test checks only current slugs and fails to prove draft/hidden exclusion through helper behavior. [VERIFIED: public/sitemap.xml; VERIFIED: src/domain/writing.test.ts]

**Why it happens:** The current generated sitemap already includes two public writing routes, so a shallow snapshot can look sufficient. [VERIFIED: public/sitemap.xml]

**How to avoid:** Add a fixture-based test where `writingDetailRoutes()` receives public and non-public entries, and `sitemapXml()` is called with the derived public paths. [VERIFIED: src/domain/writing.ts; VERIFIED: src/domain/seo.ts]

**Warning signs:** The only sitemap assertion is `expect(sitemap).toContain("/writing/agentic-engineering-workflows")`. [VERIFIED: public/sitemap.xml]

### Pitfall 6: OpenLinks Gets Promoted Instead of Reused

**What goes wrong:** Writing pages add a new OpenLinks CTA even though existing visible footer/about/contact links and `Person.sameAs` already cover identity discovery. [VERIFIED: 16-CONTEXT.md; VERIFIED: src/domain/profile.ts; VERIFIED: scripts/verify-static.ts]

**Why it happens:** Metadata work touches identity graphs, which can be mistaken for a UI promotion task. [VERIFIED: AGENTS.bright-builds.md; VERIFIED: /Users/peterryszkiewicz/.codex/skills/openlinks-identity-presence/SKILL.md]

**How to avoid:** Use `personJsonLd()` for author/creator and avoid new OpenLinks body placement in writing routes. [VERIFIED: src/domain/seo.ts; VERIFIED: src/domain/profile.ts; VERIFIED: 16-CONTEXT.md]

**Warning signs:** A writing route adds a second visible OpenLinks link near article CTAs. [VERIFIED: /Users/peterryszkiewicz/.codex/skills/openlinks-identity-presence/references/surface-patterns.md]

## Code Examples

Verified patterns from local code and official sources. [VERIFIED: src/domain/seo.ts; CITED: docs.solidjs.com/solid-start/building-your-application/head-and-metadata; CITED: schema.org/BlogPosting]

### Writing Detail Head Rendering

```tsx
// Source: @solidjs/meta route-local metadata docs and existing project detail route pattern. [CITED: docs.solidjs.com/solid-start/building-your-application/head-and-metadata; VERIFIED: src/routes/projects/[slug].tsx]
function WritingArticle(props: { entry: PublicWritingEntry }) {
  const metadata = metadataForWritingEntry(props.entry);
  const jsonLd = writingBlogPostingJsonLd(props.entry);

  return (
    <article class="writing-article">
      <Title>{metadata.title}</Title>
      <Meta name="description" content={metadata.description} />
      <HeadLink rel="canonical" href={metadata.canonical} />
      <Meta property="og:title" content={metadata.openGraph.title} />
      <Meta property="og:type" content={metadata.openGraph.type} />
      <Meta property="og:url" content={metadata.openGraph.url} />
      <Meta name="twitter:card" content={metadata.twitter.card} />
      <script type="application/ld+json">{jsonLdScriptContent(jsonLd)}</script>
      {/* article body */}
    </article>
  );
}
```

### Safe Article Body Flattening

```typescript
// Source: existing typed writing block model. [VERIFIED: src/domain/writing.ts]
export function writingArticleBodyText(entry: PublicWritingEntry): string {
  return entry.sections
    .flatMap((section) => [
      section.heading,
      ...section.blocks.flatMap((block) => {
        if (block.kind === "paragraph" || block.kind === "callout") {
          return [block.text];
        }

        if (block.kind === "list") {
          return [...block.items];
        }

        return [block.label];
      }),
    ])
    .join("\n\n");
}
```

### OpenLinks Identity Reuse

```typescript
// Source: OpenLinks guidance and existing Person JSON-LD helper. [VERIFIED: /Users/peterryszkiewicz/.codex/skills/openlinks-identity-presence/SKILL.md; VERIFIED: src/domain/seo.ts; VERIFIED: src/domain/profile.ts]
const author = personJsonLd(peterProfile);

expect(author.sameAs).toEqual(
  expect.arrayContaining(["https://github.com/pRizz", "https://openlinks.us/"]),
);
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Client-only or post-hydration metadata. | SolidStart prerendered route pages with route-local `@solidjs/meta` tags. [CITED: docs.solidjs.com/solid-start/building-your-application/head-and-metadata; CITED: docs.solidjs.com/solid-start/building-your-application/route-prerendering] | Existing project stack before Phase 16. [VERIFIED: package.json; VERIFIED: app.config.ts] | Crawlers can read static head output before hydration. [CITED: docs.solidjs.com/solid-start/building-your-application/route-prerendering; VERIFIED: scripts/verify-static.ts] |
| Generic page `og:type="website"` for all pages. | Use `og:type="article"` and `article:*` metadata for writing detail routes. [VERIFIED: 16-CONTEXT.md; CITED: ogp.me] | Phase 16 scope. [VERIFIED: .planning/ROADMAP.md] | Social parsers get article date/tag semantics when entry data supports them. [CITED: ogp.me; VERIFIED: src/domain/writing.ts] |
| Unstructured writing page content only. | `BlogPosting` JSON-LD for detail pages and `ItemList` JSON-LD for `/writing`. [VERIFIED: 16-CONTEXT.md; CITED: schema.org/BlogPosting; CITED: schema.org/ItemList] | Phase 16 scope. [VERIFIED: .planning/ROADMAP.md] | Search engines receive explicit article/list entities derived from public writing data. [CITED: developers.google.com/search/docs/appearance/structured-data/article; CITED: schema.org/ItemList] |
| Hard-coded sitemap lists. | `sitemapXml()` from `prerenderRoutes`, where writing details come from `writingDetailRoutes()`. [VERIFIED: src/domain/seo.ts; VERIFIED: src/domain/routes.ts; VERIFIED: src/domain/writing.ts] | Already established by Phase 15 route work. [VERIFIED: .planning/phases/15-writing-routes-and-dark-ui/15-CONTEXT.md; VERIFIED: public/sitemap.xml] | Public/draft filtering happens before route and sitemap derivation. [VERIFIED: src/domain/writing.ts; VERIFIED: src/domain/writing.test.ts] |

**Deprecated/outdated:**

- Adding Markdown/MDX/CMS/RSS/search/tag archives in this phase is out of scope for v1.3 metadata requirements. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: 16-CONTEXT.md]
- Adding dynamic Open Graph image routes or runtime image generation in this phase is out of scope for META-04. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: 16-CONTEXT.md]
- Treating OpenLinks as a writing-route CTA is contrary to the OpenLinks subtle-placement decision for this phase. [VERIFIED: 16-CONTEXT.md; VERIFIED: /Users/peterryszkiewicz/.codex/skills/openlinks-identity-presence/SKILL.md]

## Assumptions Log

> List all claims tagged `[ASSUMED]` in this research. The planner and discuss-phase use this section to identify decisions that need user confirmation before execution.

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | STRIDE labels in the Security Domain threat table are researcher-applied classifications rather than tool-verified labels. [ASSUMED] | Security Domain | Low; mitigations are still backed by code and requirements, but a security reviewer could relabel the STRIDE categories. [VERIFIED: src/domain/seo.ts; VERIFIED: .planning/REQUIREMENTS.md] |
| A2 | A 30-day validity window is reasonable for this static metadata research when no dependency update is planned. [ASSUMED] | Metadata | Low; planner should re-check npm/doc versions if implementation is delayed or dependency updates are included. [VERIFIED: npm view outputs] |

## Open Questions (RESOLVED)

1. **Should the implementation widen `PageMetadata` or add a writing-specific metadata type?** [VERIFIED: src/domain/seo.ts; VERIFIED: 16-CONTEXT.md]
   - What we know: `PageMetadata.openGraph.type` currently accepts only `"website"`, and Phase 16 needs `article` for writing detail pages. [VERIFIED: src/domain/seo.ts; VERIFIED: 16-CONTEXT.md]
   - What's unclear: The planner can choose the exact helper/type names under the agent's discretion. [VERIFIED: 16-CONTEXT.md]
   - Recommendation: Widen `PageMetadata.openGraph.type` to `"website" | "article"` and add an optional `article` object if the change stays small; otherwise add a narrow `WritingPageMetadata` type consumed only by writing routes. [VERIFIED: src/domain/seo.ts; VERIFIED: 16-CONTEXT.md]
   - RESOLVED: Phase 16 plans choose to widen `PageMetadata.openGraph.type` to `"website" | "article"` and add an optional `article` object so existing route/project metadata helpers keep one shared metadata shape.

2. **Should Phase 16 update `scripts/verify-static.ts` at all?** [VERIFIED: 16-CONTEXT.md; VERIFIED: scripts/verify-static.ts]
   - What we know: D-14 requires focused unit coverage, while D-15/D-16 reserve broad release verifier expansion for Phase 17. [VERIFIED: 16-CONTEXT.md]
   - What's unclear: A small static assertion may be useful to prove generated head output while implementing. [VERIFIED: scripts/verify-static.ts; VERIFIED: 16-CONTEXT.md]
   - Recommendation: Plan Vitest helper tests as required work; allow only narrow static assertions if implementation needs generated-output proof, and leave release evidence labels and broad verifier expansion to Phase 17. [VERIFIED: 16-CONTEXT.md]
   - RESOLVED: Phase 16 plans include only narrow `scripts/verify-static.ts` assertions for generated writing metadata, JSON-LD, sitemap inclusion/exclusion, and static social fallback behavior. Phase 17 still owns release labels, release-readiness docs, browser-release expansion, and aggregate release-contract wording.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Bun | Repo scripts and tests. [VERIFIED: package.json] | Yes, but local version drifts from package pin. [VERIFIED: bun --version; VERIFIED: package.json] | Local `1.3.9`; package pin `1.3.14`. [VERIFIED: bun --version; VERIFIED: package.json] | Use existing Bun unless scripts fail; if failure is version-specific, upgrade local Bun to the package pin before implementation verification. [VERIFIED: environment audit; VERIFIED: package.json] |
| Node.js | npm registry checks and ecosystem CLIs. [VERIFIED: node --version; VERIFIED: npm --version] | Yes. [VERIFIED: node --version] | `v24.13.0`. [VERIFIED: node --version] | None needed for research; repo scripts should still run through Bun. [VERIFIED: package.json] |
| npm | Package version verification. [VERIFIED: npm --version] | Yes. [VERIFIED: npm --version] | `11.6.2`. [VERIFIED: npm --version] | Not required for implementation if using Bun and existing lockfile. [VERIFIED: package.json] |
| Static social image | META-04 fallback. [VERIFIED: .planning/REQUIREMENTS.md] | Yes. [VERIFIED: file public/social/bright-builds-og.png] | PNG 1200x630. [VERIFIED: file public/social/bright-builds-og.png] | None needed; do not add dynamic image generation. [VERIFIED: 16-CONTEXT.md] |
| Browser automation | Optional narrow proof; broad coverage deferred. [VERIFIED: 16-CONTEXT.md; VERIFIED: package.json] | Package pinned; browser binary availability not probed in this research because Phase 16 does not require broad browser work. [VERIFIED: package.json; VERIFIED: 16-CONTEXT.md] | `@playwright/test@1.60.0`. [VERIFIED: package.json; VERIFIED: npm view @playwright/test version time.modified] | If a browser proof is needed, run `bun run install:browser` before `bun run verify:browser`. [VERIFIED: package.json] |

**Missing dependencies with no fallback:**

- None found for required Phase 16 helper, route, unit-test, and build work. [VERIFIED: environment audit; VERIFIED: package.json]

**Missing dependencies with fallback:**

- Local Bun version is behind the package pin; fallback is to keep using local Bun unless verification fails, then upgrade to `bun@1.3.14`. [VERIFIED: bun --version; VERIFIED: package.json]

## Security Domain

Security enforcement is enabled by default because `.planning/config.json` does not set `security_enforcement` to `false`. [VERIFIED: .planning/config.json]

OWASP ASVS latest stable is 5.0.0 according to the official OWASP project page and OWASP/ASVS GitHub result. [CITED: owasp.org/www-project-application-security-verification-standard; CITED: github.com/OWASP/ASVS] The GSD template uses older category labels, so the table maps the relevant control concepts for this static metadata phase. [VERIFIED: GSD researcher output template]

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| Authentication | No. [VERIFIED: src/routes/writing/index.tsx; VERIFIED: src/routes/writing/[slug].tsx; VERIFIED: .planning/REQUIREMENTS.md] | No auth/session state is introduced by Phase 16. [VERIFIED: .planning/REQUIREMENTS.md] |
| Session Management | No. [VERIFIED: src/routes/writing/index.tsx; VERIFIED: src/routes/writing/[slug].tsx] | Keep metadata helpers pure and static; do not add server/session behavior. [VERIFIED: 16-CONTEXT.md; VERIFIED: package.json] |
| Access Control | Low applicability. [VERIFIED: src/domain/writing.ts; VERIFIED: .planning/REQUIREMENTS.md] | Public exposure is controlled by `publicWritingEntries()`, `maybePublicWritingEntryBySlug()`, and `writingDetailRoutes()` filtering non-public statuses. [VERIFIED: src/domain/writing.ts; VERIFIED: src/domain/writing.test.ts] |
| Encoding / Input Validation | Yes. [VERIFIED: src/domain/seo.ts; VERIFIED: src/domain/writing.ts] | Use typed writing entries, slug/path helpers, Solid head rendering, `jsonLdScriptContent()`, and tests for safe JSON-LD serialization. [VERIFIED: src/domain/writing.ts; VERIFIED: src/domain/seo.ts; VERIFIED: src/domain/portfolio-surfaces.test.ts] |
| Cryptography | No. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: src/domain/seo.ts] | Do not add cryptographic code or token-dependent runtime content fetching. [VERIFIED: .planning/REQUIREMENTS.md] |

### Known Threat Patterns for SolidStart Static Metadata

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| JSON-LD script breakout through `<script>`-like content in titles or body text. [VERIFIED: src/domain/seo.ts; VERIFIED: src/domain/writing.ts] | Tampering / Information Disclosure. [ASSUMED] | Serialize all JSON-LD through `jsonLdScriptContent()` and keep tests asserting `<` is escaped. [VERIFIED: src/domain/seo.ts; VERIFIED: src/domain/portfolio-surfaces.test.ts; VERIFIED: src/domain/project-detail-routes.test.ts] |
| Draft or hidden writing URLs leak into generated sitemap or JSON-LD lists. [VERIFIED: src/domain/writing.ts; VERIFIED: .planning/REQUIREMENTS.md] | Information Disclosure. [ASSUMED] | Derive list metadata and sitemap paths from `publicWritingEntries()` and `writingDetailRoutes()`, not raw `curatedWriting`. [VERIFIED: src/domain/writing.ts; VERIFIED: 16-CONTEXT.md] |
| Metadata identity graph contradicts visible identity surfaces. [VERIFIED: src/domain/profile.ts; VERIFIED: scripts/verify-static.ts] | Spoofing / Repudiation. [ASSUMED] | Reuse `personJsonLd()` so author identity and OpenLinks `sameAs` remain centralized. [VERIFIED: src/domain/seo.ts; VERIFIED: src/domain/profile.ts; VERIFIED: openlinks-identity-presence skill] |
| Runtime content or image fetch introduces token/secrets exposure into visitor paths. [VERIFIED: .planning/REQUIREMENTS.md] | Information Disclosure. [ASSUMED] | Keep writing content checked in, use static social fallback, and avoid runtime APIs/server endpoints. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: public/social/bright-builds-og.png] |

## Sources

### Primary (HIGH confidence)

- `.planning/phases/16-writing-metadata-and-structured-data/16-CONTEXT.md` - phase boundary, locked decisions, OpenLinks placement, verification boundary. [VERIFIED: file read]
- `.planning/REQUIREMENTS.md` - META-01 through META-04 and v1.3 out-of-scope exclusions. [VERIFIED: file read]
- `.planning/ROADMAP.md` - Phase 16 scope, success criteria, dependency on Phase 15, and Phase 17 boundary. [VERIFIED: file read]
- `AGENTS.md`, `AGENTS.bright-builds.md`, `standards-overrides.md` - repo-local workflow, dark-primary guidance, Bright Builds standard routing, and lack of local overrides. [VERIFIED: file read]
- `src/domain/seo.ts` - current metadata, social image, JSON-LD, sitemap, robots helpers. [VERIFIED: codebase read]
- `src/domain/writing.ts` - current public writing data/helpers and route derivation. [VERIFIED: codebase read]
- `src/domain/routes.ts` and `app.config.ts` - prerender route derivation and SolidStart static preset. [VERIFIED: codebase read]
- `src/routes/writing/index.tsx` and `src/routes/writing/[slug].tsx` - current writing route head/body behavior. [VERIFIED: codebase read]
- `src/domain/portfolio-surfaces.test.ts`, `src/domain/project-detail-routes.test.ts`, `src/domain/writing.test.ts`, `scripts/verify-static.ts` - existing test and verifier patterns. [VERIFIED: codebase read]
- Official SolidStart docs for head metadata, route prerendering, and `defineConfig`. [CITED: docs.solidjs.com/solid-start/building-your-application/head-and-metadata; CITED: docs.solidjs.com/solid-start/building-your-application/route-prerendering; CITED: docs.solidjs.com/solid-start/reference/config/define-config]
- Schema.org docs for `BlogPosting`, `ItemList`, and `ListItem`. [CITED: schema.org/BlogPosting; CITED: schema.org/ItemList; CITED: schema.org/ListItem]
- Google Search Central docs for Article structured data, canonical URLs, and sitemap best practices. [CITED: developers.google.com/search/docs/appearance/structured-data/article; CITED: developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls; CITED: developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap]
- Open Graph protocol docs for `og:type`, structured image fields, and article properties. [CITED: ogp.me]
- sitemaps.org protocol docs for XML sitemap structure, UTF-8 encoding, entity escaping, `<loc>`, and single-host expectation. [CITED: sitemaps.org/protocol.html]
- OpenLinks identity skill and references for subtle placement and metadata-first constraints. [VERIFIED: /Users/peterryszkiewicz/.codex/skills/openlinks-identity-presence/SKILL.md; VERIFIED: /Users/peterryszkiewicz/.codex/skills/openlinks-identity-presence/references/surface-patterns.md]
- Bright Builds pinned standards raw files for architecture, code shape, testing, verification, and TypeScript/JavaScript guidance. [CITED: raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/architecture.md; CITED: raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/code-shape.md; CITED: raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/testing.md; CITED: raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/verification.md; CITED: raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/languages/typescript-javascript.md]
- npm registry version checks for current package versions and modification timestamps. [VERIFIED: npm view outputs]

### Secondary (MEDIUM confidence)

- OWASP ASVS project page and GitHub result for latest stable ASVS 5.0.0. [CITED: owasp.org/www-project-application-security-verification-standard; CITED: github.com/OWASP/ASVS]
- DigitalOcean Twitter Cards / Open Graph tutorial was inspected as secondary context only; Phase 16 relies on existing repo decisions for Twitter `summary_large_image` rather than adding new Twitter/X behavior. [CITED: www.digitalocean.com/community/tutorials/how-to-add-twitter-card-and-open-graph-social-metadata-to-your-webpage-with-html; VERIFIED: 16-CONTEXT.md]

### Tertiary (LOW confidence)

- None needed for implementation decisions. [VERIFIED: source hierarchy used in this research]

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - no new dependencies are needed, package pins were read from `package.json`, and relevant versions were checked against npm. [VERIFIED: package.json; VERIFIED: npm view outputs]
- Architecture: HIGH - existing project metadata, JSON-LD, sitemap, writing route, and test patterns are already present in the codebase. [VERIFIED: src/domain/seo.ts; VERIFIED: src/domain/writing.ts; VERIFIED: src/domain/routes.ts; VERIFIED: src/routes/projects/[slug].tsx; VERIFIED: src/routes/writing/index.tsx; VERIFIED: src/routes/writing/[slug].tsx]
- Pitfalls: HIGH - pitfalls are grounded in current code gaps and locked Phase 16 decisions. [VERIFIED: src/routes/writing/[slug].tsx; VERIFIED: 16-CONTEXT.md]
- External docs: HIGH - SolidStart, Schema.org, Google Search Central, Open Graph, sitemaps.org, and OWASP pages were checked directly. [CITED: docs.solidjs.com; CITED: schema.org; CITED: developers.google.com; CITED: ogp.me; CITED: sitemaps.org; CITED: owasp.org]

**Research date:** 2026-06-14 [VERIFIED: system current_date]
**Valid until:** 2026-07-14 for repo-local implementation patterns; re-check npm/package docs if dependency updates are planned before implementation. [VERIFIED: npm view outputs; ASSUMED]
