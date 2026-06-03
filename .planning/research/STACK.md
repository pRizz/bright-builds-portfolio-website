# Stack Research: v1.3 Writing & Notes Surface

**Milestone:** v1.3 Writing & Notes Surface
**Researched:** 2026-06-03
**Scope:** Stack additions or changes needed to add curated static writing and note routes to the existing SolidStart portfolio.
**Overall confidence:** HIGH

## Recommendation

Do not add dependencies for v1.3.

Use the current SolidStart static stack and add a repo-owned typed writing domain surface. The existing project already proves static route generation, route metadata, JSON-LD, sitemap/robots generation, dark-primary UI verification, browser checks, and release verification. Writing should follow the same pattern instead of adding Markdown/MDX, a CMS, runtime fetches, or a new content pipeline.

## Recommended Stack Approach

| Area | Recommendation | Dependency Change | Confidence | Why |
| --- | --- | --- | --- | --- |
| Content source | Add `src/domain/writing.ts` with a checked-in typed registry | None | HIGH | Existing project content is curated TypeScript. Writing needs curation, cross-links, metadata, and static routes more than authoring ergonomics. |
| Content format | Structured TypeScript records with typed body blocks | None | HIGH | Keeps validation, route derivation, sitemap, and JSON-LD in pure helpers. Avoids parser/plugin risk for a small curated v1.3 surface. |
| Static routes | Add `/writing` and `/writing/{slug}` through route helpers included in `prerenderRoutes` | None | HIGH | `app.config.ts` already imports `prerenderRoutes`; route pre-rendering is the official SolidStart SSG path. |
| Metadata | Extend `src/domain/seo.ts` with writing metadata and JSON-LD helpers | None | HIGH | `@solidjs/meta` is already installed and SolidStart docs recommend it for route-specific head metadata. |
| Structured data | Use `ItemList` for `/writing`; use `BlogPosting` by default for notes/essays and `TechArticle` only for explicitly technical/procedural entries | None | MEDIUM-HIGH | Schema.org supports all three types; a per-entry schema type avoids overstating every note as procedural. |
| Cross-links | Store `relatedProjectSlugs` on writing entries and derive project-page related notes from the writing registry | None | HIGH | This keeps writing as the source of truth for note relationships and avoids duplicating bidirectional links in two registries. |
| Verification | Extend current Vitest, static, browser, and release verifiers | None | HIGH | The existing aggregate gate already covers the right surfaces; writing only needs new route expectations and release-readiness labels. |

## Content Format Decision

Use TypeScript, not Markdown or MDX, for v1.3.

Recommended shape:

```typescript
export type WritingKind = "note" | "essay" | "technical-note";
export type WritingSchemaType = "BlogPosting" | "TechArticle";

export type WritingBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "bullets"; items: readonly [string, ...string[]] }
  | { kind: "code"; language: string; code: string };

export type WritingEntry = {
  slug: string;
  title: string;
  kind: WritingKind;
  schemaType: WritingSchemaType;
  summary: string;
  publishedAt: string;
  maybeUpdatedAt?: string;
  tags: readonly string[];
  relatedProjectSlugs: readonly string[];
  body: readonly [WritingBlock, ...WritingBlock[]];
};
```

This gives roadmap phases concrete validation targets:

- unique slugs
- stable `/writing/{slug}` paths
- non-empty title, summary, date, tags, and body
- valid `relatedProjectSlugs`
- metadata descriptions derived from `summary`
- JSON-LD derived from registry fields

If long-form authoring becomes painful later, add Markdown/MDX in a future content-operations milestone after v1.3 proves the public surface. Do not pay that cost before the first curated notes route set exists.

## Route and Static Generation Implications

Add route helpers in the writing domain:

- `writingIndexPath()`: returns `/writing` or a constant `"/writing"`
- `writingEntryPath(entry)`: returns `/writing/${entry.slug}`
- `writingEntryRoutes()`: returns all published writing entry paths
- `publishedWritingEntries()`: sorted public entries
- `maybeWritingEntryBySlug(slug)`
- `writingEntriesForProjectSlug(projectSlug)`

Then update `src/domain/routes.ts` so `prerenderRoutes` includes:

```typescript
[
  ...siteRoutes.map((route) => route.path),
  ...projectDetailRoutes(),
  ...writingEntryRoutes(),
]
```

Add `/writing` to `siteRoutes` as a normal top-level route. Keep `crawlLinks: false` in `app.config.ts`; the route list should remain explicit and testable.

Expected route files:

- `src/routes/writing/index.tsx`
- `src/routes/writing/[slug].tsx`

The dynamic note route is acceptable only because every note route is included in `prerenderRoutes` and verified in `.output/public`.

## SEO and JSON-LD Implications

Extend `src/domain/seo.ts` with:

- `metadataForWritingEntry(entry, profile)`
- `writingItemListJsonLd(entries, profile)`
- `writingEntryJsonLd(entry, profile)`

Use the existing static social preview fallback for v1.3. Per-note OG images are content operations, not required stack.

The `/writing` page should render `ItemList` JSON-LD. Note pages should render `BlogPosting` for normal notes/essays and `TechArticle` only when the entry is genuinely a technical article, how-to, specification, or procedural troubleshooting note.

## Project Link Implications

Do not add `relatedWritingSlugs` to every project unless implementation proves it is necessary.

Preferred direction:

1. Writing entries declare `relatedProjectSlugs`.
2. Project detail pages call `writingEntriesForProjectSlug(project.slug)`.
3. Writing pages use existing project helpers such as `projectStoryHref(project)` for back-links.
4. Tests verify every related project slug resolves to a public project record.

This keeps project records focused on project curation and lets note relationships grow from the note registry.

## Verification Implications

Keep the aggregate gate:

```bash
bun run install:browser && bun run verify
```

Update existing verification rather than adding tools:

| Surface | v1.3 Verification |
| --- | --- |
| Unit tests | Cover writing slug uniqueness, route derivation, lookup helpers, valid related project slugs, metadata, JSON-LD, sitemap inclusion, and unpublished/draft exclusion if draft support exists. |
| `scripts/verify-curation.ts` | Add writing registry validation or call a small writing validation helper from the existing curation verifier. |
| `scripts/verify-static.ts` | Check `/writing` and every `/writing/{slug}` route for expected pre-hydration text, metadata, JSON-LD, sitemap coverage, forbidden placeholder copy, dark root, and no runtime GitHub/token residue. |
| `scripts/verify-release.ts` | Existing route scanning, semantic checks, internal-link checks, budgets, remote asset checks, and JSON-LD checks should cover writing once routes are prerendered. Add release evidence labels for writing route coverage. |
| Browser checks | Include writing index and at least one note route in keyboard, axe, dark desktop/mobile layout, and reduced-motion checks. If current tests already iterate `prerenderRoutes`, add a representative writing navigation assertion. |
| Static metadata generation | `scripts/generate-static-metadata.ts` should pick up writing routes through `sitemapXml()` once `prerenderRoutes` includes them. |

Watch route HTML budgets. Writing pages can exceed existing per-route budgets faster than project pages if body text grows. If needed, tune the budget after measuring generated `.output/public` sizes, not preemptively.

## What Not To Add

- No Markdown, MDX, Contentlayer, Astro content collections, or parser pipeline in v1.3.
- No CMS, admin UI, database, auth, comments, newsletter backend, or analytics stack.
- No runtime GitHub, Gist, Notion, Substack, RSS fetch, or token-dependent writing source.
- No dynamic OG image endpoint or per-note raster generation in v1.3.
- No syntax highlighting dependency. Render code blocks with semantic `<pre><code>` and CSS if needed.
- No date, slug, or reading-time package. Slugs and dates should be authored; reading time can be omitted or calculated with a tiny pure helper if the UI needs it.
- No dependency upgrades for SolidStart, Solid, Mystic UI, Tailwind, Playwright, Vitest, Biome, or TypeScript unless implementation exposes a concrete incompatibility.

## Sources

- Local project context: `.planning/PROJECT.md`, `.planning/MILESTONES.md`
- Current package stack: `package.json`
- Static route config: `app.config.ts`, `src/domain/routes.ts`
- Existing project/content/SEO helpers: `src/domain/projects.ts`, `src/domain/seo.ts`
- Existing release gates: `scripts/verify-static.ts`, `scripts/verify-release.ts`
- SolidStart route pre-rendering docs: `https://docs.solidjs.com/solid-start/building-your-application/route-prerendering`
- SolidStart head and metadata docs: `https://docs.solidjs.com/solid-start/building-your-application/head-and-metadata`
- Schema.org `BlogPosting`: `https://schema.org/BlogPosting`
- Schema.org `TechArticle`: `https://schema.org/TechArticle`
- Schema.org `ItemList`: `https://schema.org/ItemList`

## Open Questions for Roadmapping

- Decide whether v1.3 supports hidden/draft writing records or only checked-in published entries.
- Decide how much body block variety is needed in the first writing set; start with paragraphs, bullets, and optional code only.
- Decide whether `/projects` should keep its existing "Writing" project group once a dedicated `/writing` surface exists, or rename that group to avoid visitor confusion.
