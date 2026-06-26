# Technology Stack

**Project:** Bright Builds Portfolio Website
**Milestone:** v1.6 Content Discovery & Feeds
**Researched:** 2026-06-26
**Scope:** Stack additions or changes for static topic/tag discovery, checked-in-content search/filtering, static feed output, related-work navigation, generic-route social preview polish, and verification.
**Overall confidence:** HIGH

## Recommendation

No new npm/Bun dependency is needed for v1.6.

Use the existing SolidStart, SolidJS, Bun, TypeScript, Tailwind, Mystic UI, `@solidjs/meta`, `@resvg/resvg-js`, Vitest, Playwright, and axe stack already pinned in `package.json`. The v1.6 work should add repo-owned TypeScript domain helpers and extend existing static generation and verification scripts.

The main stack change is structural, not dependency-based:

- Add pure domain projections for discovery labels, lightweight search documents, related-work records, and feed items.
- Add static discovery routes to the existing `prerenderRoutes` and `sitemapRoutes` registry.
- Generate a static Atom feed from checked-in writing data through the existing static metadata generation path.
- Extend the existing social preview target model to cover generic public routes where differentiated cards are useful.
- Extend the current Vitest, Playwright, static-output, release, and no-runtime-network verification surfaces.

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| SolidStart | `@solidjs/start@1.3.2` from `package.json` | Static prerendered route shell | Existing `app.config.ts` already uses `server.preset: "static"` and a domain-derived prerender route list. Discovery routes should join that same list instead of introducing a second static generation mechanism. |
| SolidJS | `solid-js@1.9.13` from `package.json` | Interactive search/filter UI | Solid signals, `createMemo`, and URL-bound state are enough for a small checked-in content corpus. No search UI package is justified. |
| Solid Router | `@solidjs/router@0.16.1` from `package.json` | Route params for discovery detail pages | Existing project, writing, and theme detail routes already use the SolidStart route model. Use the same pattern for `/topics/[slug]`, `/tags/[slug]`, or a single `/discover/[slug]` family. |
| Solid Meta | `@solidjs/meta@0.29.4` from `package.json` | Metadata and feed autodiscovery links | Existing routes already render canonical, Open Graph, Twitter, and asset links. Add `<link rel="alternate" type="application/atom+xml" href="/feed.xml">` through the same head path. |
| TypeScript domain modules | `typescript@6.0.3` from `package.json` | Discovery, search, feed, and related-work projections | The existing app keeps content rules as pure data-in/data-out helpers. v1.6 should continue that pattern for testability and to avoid framework-heavy content logic. |
| Bun scripts | `packageManager: "bun@1.3.14"` from `package.json` | Static file generation and verification entrypoints | Existing scripts already generate metadata, social previews, freshness reports, and verification output. Extend them rather than adding another runner. |

### Database

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Checked-in typed registries | No package required | Source of truth for projects, writing, themes, labels, feed items, and search documents | The project explicitly rejects runtime content fetches and CMS/admin scope for v1.6. Keep `src/domain/projects.ts`, `src/domain/writing.ts`, and `src/domain/themes.ts` authoritative. |
| Browser storage | No package required | Not recommended for v1.6 | Search/filter state should be shareable through URL query params. Local storage would add stale state and privacy noise without improving discovery. |

### Infrastructure

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Static route registry | No package required | Add discovery pages to prerender and sitemap outputs | `src/domain/routes.ts` already feeds SolidStart prerendering, sitemap generation, static verification, and browser coverage. Discovery route helpers should be derived there. |
| Static XML generation | No package required | Write `public/feed.xml` | Feed XML is small enough to generate with a repo-owned escape helper and deterministic tests. Add it to `scripts/generate-static-metadata.ts` or a tiny sibling script called by that entrypoint. |
| Static social preview generation | Existing `@resvg/resvg-js@2.6.2` from `package.json` | Generate generic-route preview PNGs | The dependency is already present for v1.5 social previews. Extend `src/domain/social-previews.ts`; do not add a dynamic OG endpoint or a new image pipeline. |
| Static output verification | Existing repo scripts | Prove discovery routes, feed output, metadata, generated assets, and no hidden content leaks | Extend `scripts/verify-static/*` and `scripts/verify-release.ts` instead of adding validators that duplicate route knowledge. |
| Browser/a11y verification | Existing `@playwright/test@1.60.0` and `@axe-core/playwright@4.11.3` from `package.json` | Verify filter controls, mobile/dark layout, keyboard focus, axe, and no unwanted network behavior | The milestone adds interactive controls and more routes. Existing browser coverage is the right verification surface. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Mystic UI | `github:pRizz/mystic-ui#d36017757708ed01ef2b3b47beb14f294726411c` from `package.json` | Existing Solid/Tailwind component primitives | Reuse only where existing route UI patterns already do. Do not add another component library for search chips, tabs, or cards. |
| Tailwind CSS | `tailwindcss@3.4.19` from `package.json` | Dark-primary discovery, filter, and related-work UI | Existing repo guidance requires dark-first surfaces. Keep controls in local classes and Tailwind utilities already covered by visual-system checks. |
| Vitest | `vitest@4.1.7` from `package.json` | Pure helper tests | Use for discovery normalization, slug uniqueness, search scoring/filtering, feed XML escaping, related-work resolution, and social preview target selection. |
| Playwright | `@playwright/test@1.60.0` from `package.json` | Real browser checks | Use for search/filter interactions, URL query state, keyboard focus, mobile/desktop layout, feed parse smoke checks via browser `DOMParser`, and no runtime content/network fetch assertions. |
| Biome | `@biomejs/biome@2.4.15` from `package.json` | Formatting and linting | Existing `bun run verify` already includes formatting and Biome checks. No ESLint or formatter change is needed. |

## Recommended Repo Additions

### Discovery Domain

Add `src/domain/discovery.ts`.

Responsibilities:

- Normalize labels from `ProjectStory.themes`, `ProjectStory.tags`, `WritingEntry.topics`, `WritingEntry.tags`, and public `ThemeRecord` titles.
- Produce canonical slugs with duplicate detection.
- Produce discovery page records with counts and related public projects, writing, and themes.
- Keep hidden, draft, archived, unsupported, and excluded records out by using existing public selectors.
- Export route helpers such as `discoveryIndexPath()`, `discoveryDetailPath(record)`, and `discoveryDetailRoutes()`.

Recommended route shape:

```text
/discover
/discover/{slug}
```

Use one route family unless the product really needs separate `/topics` and `/tags` URLs. A single route avoids taxonomy bikeshedding and lets labels from projects, writing, and themes converge cleanly.

### Search and Filtering

Add `src/domain/search.ts`.

Responsibilities:

- Build a small in-memory search document list from public projects, public writing, and public themes.
- Normalize query strings with lowercasing, whitespace compaction, punctuation stripping, and simple token matching.
- Weight title/name, one-line/summary, topics/themes/tags, and related-work labels.
- Return typed result records that link to existing routes or anchors.
- Keep URL query state as the persistence layer using `URLSearchParams`.

No Fuse, Lunr, Pagefind, Algolia, Meilisearch, or generated search-index dependency is justified for this corpus. Add one only after the checked-in content grows large enough that simple deterministic matching creates measurable UX or bundle-size problems.

### Feed Generation

Add `src/domain/feeds.ts`.

Recommendation:

- Generate Atom 1.0 at `/feed.xml` for public writing entries first.
- Use writing entries only in v1.6 because they already have `maybePublishedOn` and `maybeUpdatedOn`.
- Do not include projects or themes in the feed until those records gain an explicit public updated/published date field.
- Use canonical IDs based on route URLs, not random IDs.
- Escape XML through a tested local helper.
- Add feed autodiscovery metadata on public pages.

Atom is the better first feed format here because it has a clear `id` and `updated` model for static authored entries. If roadmap or user language requires an RSS-labeled endpoint, derive `/rss.xml` from the same `FeedItem` projection later. That still should not require a package.

### Related Work

Add or centralize `src/domain/related-work.ts` if the implementation starts duplicating relationship logic across routes.

Responsibilities:

- Resolve public project, writing, theme, and discovery-label relationships from existing registries.
- Deduplicate related links by route/href.
- Preserve public eligibility gates from existing selectors.
- Prefer authored relationships from `ThemeRecord.relatedProjectSlugs`, `ThemeRecord.relatedWritingSlugs`, and `WritingEntry.relatedProjectSlugs` over fuzzy tag matches.
- Use tag/topic/theme overlap as a secondary fallback only when it produces useful, explainable navigation.

### Generic Route Social Previews

Extend `src/domain/social-previews.ts`.

Recommended changes:

- Add route kinds for selected generic routes, likely `home`, `about`, and `contact`.
- Add a `generic` asset family or equivalent stable path family under `public/social/generated/`.
- Keep `SOCIAL_PREVIEW_FALLBACK_IMAGE` for unknown-slug and defensive fallback metadata.
- Let `metadataForRoute()` keep using `maybeSocialPreviewTargetForRoutePath()` so route metadata updates through the existing helper contract.

No new image dependency is needed. The current `@resvg/resvg-js` pipeline is already the stack surface for generated previews.

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Discovery routes | Repo-owned domain helper plus SolidStart prerender routes | Separate static site generator or plugin | Existing SolidStart prerendering already works and is verified. A second generator would duplicate route knowledge. |
| Search | Pure TypeScript search documents and Solid state | Fuse, Lunr, Pagefind, hosted search | The corpus is small, checked in, and public. A dependency adds weight and verification surface before it solves a real problem. |
| Filter state | URL query params with `URLSearchParams` | Local storage or session storage | Query params are shareable, testable, and do not create stale hidden UI state. |
| Feed format | Atom 1.0 `/feed.xml` | RSS 2.0 first | RSS is familiar, but Atom's required `id` and `updated` fields fit deterministic static writing entries better. RSS can be generated later from the same model if needed. |
| Feed generator | Local XML builder | `feed`, RSS, or XML builder package | Feed XML is small and stable. A local builder plus tests is simpler than adding a package for a handful of elements. |
| Feed validation | Static assertions plus Playwright `DOMParser` smoke check | New XML parser dependency | Existing Playwright can parse XML in a browser context, and static assertions can verify required Atom fields. No parser dependency is justified yet. |
| Related work | Typed resolver over existing registries | Fuzzy recommendation engine | Related navigation must stay explainable and curated. Fuzzy matching can be a fallback, not the core stack. |
| Generic social previews | Extend current `@resvg/resvg-js` generator | Dynamic OG endpoint | The project is static-only. Dynamic OG endpoints add server behavior and deployment complexity. |
| Content management | Existing TypeScript registries | CMS, MDX pipeline, Contentlayer | v1.6 is discovery over existing checked-in content, not an authoring workflow milestone. |
| UI controls | Local Solid/Tailwind/Mystic-compatible controls | New component library or icon package | Search inputs, chips, segmented filters, and cards are straightforward in the existing design system. |

## Installation

No package installation is required.

```bash
# No dependency changes for v1.6 stack work.
# Do not run bun add for search, feeds, XML, routing, or UI controls unless implementation proves a concrete gap.

bun run generate:static-metadata
bun run generate:social-previews
bun run verify
```

If implementation adds only TypeScript helpers, routes, styles, tests, and generated static files, `package.json` and `bun.lock` should remain unchanged.

## Verification Commands to Plan

Use the existing aggregate gate:

```bash
bun run verify
```

Extend the gate coverage rather than adding a new test runner.

Required v1.6 verification additions:

- Discovery helper tests for label normalization, slug uniqueness, public eligibility, route generation, and sitemap inclusion.
- Search helper tests for query normalization, filter combinations, result ordering, empty states, and no hidden/draft/archived content leaks.
- Related-work tests for reciprocal project-writing-theme navigation and deduplication.
- Feed tests for XML escaping, required Atom fields, stable ordering, dates, canonical links, and exclusion of undated projects/themes.
- Static verification that `.output/public/feed.xml` exists and equals the domain-generated feed.
- Static verification that discovery routes are prerendered, included in `sitemap.xml`, and absent for unsupported labels.
- Social preview tests and static verification for generic route generated PNG references.
- Browser checks for desktop and mobile dark rendering, filter/search keyboard use, URL query state, no text overlap, axe, and no visitor-runtime content fetches.
- Release verification that budgets still pass after any added search/discovery client code.

## Sources

Local sources:

- `.planning/PROJECT.md`
- `package.json`
- `AGENTS.md`
- `AGENTS.bright-builds.md`
- `standards/core/frontend-ui.md`
- `standards/languages/typescript-javascript.md`
- `standards/core/verification.md`
- `app.config.ts`
- `src/domain/routes.ts`
- `src/domain/projects.ts`
- `src/domain/writing.ts`
- `src/domain/themes.ts`
- `src/domain/seo.ts`
- `src/domain/social-previews.ts`
- `scripts/generate-static-metadata.ts`
- `scripts/verify-static/*`
- `scripts/verify-release.ts`
- `tests/browser-release.playwright.ts`

Official/current sources:

- SolidStart route prerendering: `https://docs.solidjs.com/solid-start/building-your-application/route-prerendering`
- SolidStart head and metadata: `https://docs.solidjs.com/solid-start/building-your-application/head-and-metadata`
- Atom Syndication Format RFC 4287: `https://datatracker.ietf.org/doc/html/rfc4287`
- RSS 2.0 specification: `https://www.rssboard.org/rss-specification`
- MDN `URLSearchParams`: `https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams`

## Open Questions / Verify During Implementation

- Decide whether the public route should be `/discover`, `/topics`, or `/tags`. Stack recommendation is `/discover` because the source labels span projects, writing, and themes.
- Decide whether v1.6 needs only a writing feed or a broader site-updates feed. Stack recommendation is writing-only until projects and themes have explicit public date fields.
- Confirm generated generic social previews are worth the added PNG count for home/about/contact. If a route's preview would be generic copy with no distinct sharing value, keep the fallback.
- Watch the existing client JS release budget after adding search/filter UI. If the budget moves meaningfully, keep the search projection smaller before considering a search library.
