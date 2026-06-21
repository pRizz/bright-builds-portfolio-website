---
phase: 22
slug: theme-metadata-and-structured-data
status: complete
generated_by: gsd-phase-researcher-inline-fallback
lifecycle_mode: yolo
phase_lifecycle_id: 22-2026-06-18T01-09-47
generated_at: 2026-06-18T01:20:00Z
---

# Phase 22 Research: Theme Metadata and Structured Data

## RESEARCH COMPLETE

## Scope Question

What needs to be known to plan Phase 22 well?

Phase 22 should extend the existing static metadata architecture for theme routes. The implementation should stay inside pure domain helpers, route head rendering, sitemap generation, and static verification. It should not add dynamic OG images, server endpoints, live external-link checks, release evidence labels, or broad browser release expansion.

## Existing Architecture

### Metadata Helpers

`src/domain/seo.ts` is the correct owner for page metadata and JSON-LD helpers:

- `metadataForRoute(route, profile)` handles top-level route metadata.
- `metadataForProject(project, profile)` handles selected project detail routes.
- `metadataForWritingEntry(entry, profile)` handles public writing detail routes.
- `personJsonLd(profile)` includes `profileSameAsLinks(profile)`, including OpenLinks.
- `projectItemListJsonLd()`, `projectJsonLd()`, `writingItemListJsonLd()`, and `writingBlogPostingJsonLd()` establish the local structured-data pattern.
- `sitemapXml(paths, profile)` and `robotsTxt(profile)` own generated static metadata files.
- `jsonLdScriptContent(value)` is already available for safe script tag serialization.

The phase should add theme equivalents here instead of building JSON-LD directly in route files.

### Theme Domain Helpers

`src/domain/themes.ts` already provides the data needed for theme metadata:

- `publicThemeEntries()`
- `maybePublicThemeEntryBySlug()`
- `themeDetailPath()`
- `themeDetailRoutes()`
- `relatedProjectDetailPageProjectsForTheme()`
- `relatedWritingEntriesForTheme()`
- `collaborationActionsForTheme()`

Those helpers keep relationships public-only and helper-derived, so metadata and JSON-LD should consume them rather than copying slugs or route component state.

### Routes

`src/routes/themes/index.tsx` already renders top-level route metadata and Person JSON-LD. Phase 22 should replace or supplement the index JSON-LD with a theme `ItemList` while keeping route-level title, description, canonical, OG, Twitter, and asset link rendering.

`src/routes/themes/[slug].tsx` currently renders visible page content only. It needs:

- Generic fallback metadata for unknown or non-public slugs.
- Public theme detail metadata from a new SEO helper.
- JSON-LD script output from a new theme detail helper.
- No slug echo in fallback head or body.

### Sitemap Generation

`src/domain/routes.ts` currently includes theme routes in `prerenderRoutes` but excludes `/themes` and theme detail routes from `sitemapRoutes`. Phase 22 should add `/themes` and public `themeDetailRoutes()` to `sitemapRoutes`.

`scripts/generate-static-metadata.ts` already writes `public/sitemap.xml` and `public/robots.txt` from pure helpers. After `sitemapRoutes` changes, rerun `bun run generate:static-metadata`.

### Static Verification

`scripts/verify-static/metadata-jsonld-verifier.ts` has a current Phase 20 skip:

```ts
if (maybeTheme) {
  return;
}
```

Phase 22 should remove that skip and assert theme detail metadata plus theme JSON-LD. It should also assert theme index `ItemList` JSON-LD.

`scripts/verify-static/sitemap-assets-verifier.ts` already checks theme detail output exists and unknown theme output is absent. It should add sitemap inclusion for `/themes` and public theme detail routes while rejecting unknown or non-public theme routes.

## Recommended Plan Shape

Use one plan with three implementation tasks:

1. Add theme metadata and JSON-LD helpers in `src/domain/seo.ts` with focused tests.
2. Wire theme routes and sitemap generation to those helpers.
3. Extend static verification to assert theme metadata, JSON-LD, sitemap inclusion/exclusion, and social fallback reuse.

This should be a single wave because route rendering and static verifier expectations must agree on the same helper output.

## Structured Data Recommendation

Use:

- `ItemList` for `/themes`.
- `CollectionPage` for each public theme detail route.

`CollectionPage` should include:

- `@context`
- `@type`
- `name`
- `description`
- `url`
- `mainEntityOfPage`
- `image`
- `creator`
- `about`
- `keywords`
- `hasPart`
- `mentions`

`hasPart` can hold related `SoftwareSourceCode` and `BlogPosting` summary objects. `mentions` can hold proof points and collaboration angle text. This stays schema.org-compatible and avoids representing theme pages as dated articles.

## Verification Strategy

Run targeted checks first:

- `bun run test src/domain/writing-metadata.test.ts src/domain/theme-routes.test.ts scripts/verify-static.test.ts`
- `bun run generate:static-metadata`
- `bun run build`
- `bun run verify:static`

Then run the aggregate gate before phase verification:

- `bun run verify`

## Risks and Mitigations

| Risk | Mitigation |
| --- | --- |
| Hidden or unsupported theme routes appear in sitemap | Derive sitemap from `themeDetailRoutes()` and add negative tests/assertions for unknown/non-public routes. |
| Theme detail pages keep generic head metadata | Add `metadataForTheme()` and static verifier assertions for every public detail route. |
| JSON-LD duplicates or drifts from route helpers | Build JSON-LD from `publicThemeEntries()`, `relatedProjectDetailPageProjectsForTheme()`, and `relatedWritingEntriesForTheme()`. |
| OpenLinks becomes over-promoted | Reuse `personJsonLd()` sameAs only; do not add new visible OpenLinks route CTAs. |
| Dynamic OG or runtime image generation sneaks in | Reuse `social/bright-builds-og.png` and keep static verifier's local asset mapping checks. |

## Files to Plan Against

- `src/domain/seo.ts`
- `src/domain/routes.ts`
- `src/routes/themes/index.tsx`
- `src/routes/themes/[slug].tsx`
- `src/domain/writing-metadata.test.ts`
- `src/domain/theme-routes.test.ts`
- `scripts/generate-static-metadata.ts`
- `scripts/verify-static/metadata-jsonld-verifier.ts`
- `scripts/verify-static/sitemap-assets-verifier.ts`
- `scripts/verify-static.test.ts`
- `public/sitemap.xml`

