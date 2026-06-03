# Architecture Research: v1.3 Writing & Notes Surface

**Milestone:** v1.3 Writing & Notes Surface
**Researched:** 2026-06-03
**Scope:** Integration points and build order for a curated static writing/notes surface.
**Overall confidence:** HIGH

## Current Architecture to Preserve

The existing portfolio already has the right shape for writing:

- `src/domain/projects.ts` owns checked-in curated data plus pure selectors/path helpers.
- `src/domain/routes.ts` owns top-level route metadata and `prerenderRoutes`.
- `src/domain/seo.ts` owns route metadata, JSON-LD, sitemap, and robots helpers.
- Solid route files are thin rendering shells over domain helpers.
- `app.config.ts` already prerenders from `prerenderRoutes`, so new static routes should enter through that list rather than local config duplication.
- `scripts/generate-static-metadata.ts`, `scripts/verify-static.ts`, `scripts/verify-release.ts`, and `tests/browser-release.playwright.ts` consume domain route/SEO helpers as the release contract.

The v1.3 writing surface should copy this pattern instead of adding a CMS, runtime content loader, Markdown/MDX pipeline, or route list maintained by hand.

## Recommended Architecture

Add writing as a sibling domain surface, not as a subtype of projects. Projects and writing are different content types with different metadata, but they should share the same static route, SEO, and verification machinery.

The source of truth for bidirectional project/note links should live once on writing entries as `relatedProjectSlugs`. Project pages can derive related notes by filtering writing entries by project slug. Writing pages can derive project links by resolving those slugs through the existing project helpers. Do not store duplicate note IDs on project records in v1.3; duplicated relationships will drift.

### Component Boundaries

| Component | Status | Responsibility | Communicates With |
| --- | --- | --- | --- |
| `src/domain/writing.ts` | New | Typed checked-in writing registry, entry selectors, path helpers, related-project selectors | Type-only project slug/type surface; route, SEO, UI, tests, verifiers |
| `src/domain/writing-validation.ts` | New if validation grows beyond a few assertions | Validate slug uniqueness, published-entry content, related project slugs, hidden/draft exclusions | `src/domain/writing.ts`, `src/domain/projects.ts`, `scripts/verify-curation.ts` |
| `src/domain/routes.ts` | Modified | Add `/writing` top-level route and append `writingDetailRoutes()` to `prerenderRoutes` | `app.config.ts`, layout nav, static/release/browser verifiers |
| `src/domain/seo.ts` | Modified | Add writing metadata, Article JSON-LD, writing index ItemList JSON-LD, and sitemap coverage through `prerenderRoutes` | writing routes, generator, static verifier, unit tests |
| `src/routes/writing/index.tsx` | New | Static writing index shell rendered from published writing entries | `writing.ts`, `routes.ts`, `seo.ts`, shared styles/components |
| `src/routes/writing/[slug].tsx` | New | Static note/detail shell rendered from one published entry | `writing.ts`, `projects.ts`, `seo.ts` |
| `src/routes/projects/[slug].tsx` | Modified | Add related writing panel for selected project stories | `writingEntriesForProject()` |
| `src/routes/index.tsx` | Modified only if discovery needs more than nav | Optional small writing teaser/latest note section | `publishedWritingEntries()` |
| `src/components/SiteLayout.tsx` | No source change expected | Navigation should update automatically if `/writing` is a nav route | `navigationRoutes` |
| `app.config.ts` | No source change expected | Already consumes `prerenderRoutes` | `src/domain/routes.ts` |
| `scripts/generate-static-metadata.ts` | No source change expected | Sitemap/robots update automatically after `sitemapXml()` sees writing routes | `src/domain/seo.ts` |

## Writing Domain Shape

Use typed data first. A simple, dependency-light model is enough for v1.3:

```ts
export type WritingKind = "note" | "essay";
export type WritingStatus = "published" | "hidden";

export type WritingBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "list"; items: readonly [string, ...string[]] };

export type WritingSection = {
  heading: string;
  blocks: readonly [WritingBlock, ...WritingBlock[]];
};

export type WritingEntry = {
  slug: string;
  title: string;
  summary: string;
  kind: WritingKind;
  status: WritingStatus;
  publishedOn: string;
  maybeUpdatedOn?: string;
  displayOrder: number;
  themes: readonly string[];
  tags: readonly string[];
  relatedProjectSlugs: readonly string[];
  sections: readonly [WritingSection, ...WritingSection[]];
};
```

Prefer `sections` over Markdown/MDX for v1.3. The site needs curated static notes, not a content platform. This keeps rendering deterministic, testable, and typechecked with the rest of the Solid/Bun surface.

Recommended helper exports:

- `curatedWritingEntries`
- `publishedWritingEntries(entries = curatedWritingEntries)`
- `maybePublishedWritingEntryBySlug(slug, entries = curatedWritingEntries)`
- `writingDetailPath(entry)`
- `writingDetailRoutes(entries = curatedWritingEntries)`
- `writingEntriesForProject(project, entries = curatedWritingEntries)`
- `relatedProjectsForWriting(entry, projects = publicProjectIndexProjects())`
- `writingLinkDisplayLabel(entry)` only if route UI needs a stable label helper

If implementation can expose a literal project slug union cheaply, add this to `src/domain/projects.ts`:

```ts
export type CuratedProjectSlug = (typeof curatedProjects)[number]["slug"];
```

Then `relatedProjectSlugs` can be typed as `readonly CuratedProjectSlug[]`. If that type becomes awkward, keep `string[]` and enforce the invariant in `writing-validation.ts` plus `verify:curation`.

## Route and Prerender Wiring

Modify `src/domain/routes.ts` as the only prerender wiring point:

```ts
import { projectDetailRoutes } from "./projects";
import { writingDetailRoutes } from "./writing";

export type RouteId = "home" | "about" | "projects" | "writing" | "contact";

export const siteRoutes = [
  // existing routes...
  {
    id: "writing",
    path: "/writing",
    label: "Writing",
    title: "Writing and Notes | Peter Ryszkiewicz",
    description: "Curated notes and essays from Peter Ryszkiewicz on AI, Bitcoin, open systems, developer tooling, and practical software.",
    heading: "Writing and Notes",
    staticCheckText: "Curated notes connect Peter's technical thinking to the projects behind it.",
    nav: true,
  },
] as const satisfies readonly SiteRoute[];

export const prerenderRoutes = [
  ...siteRoutes.map((route) => route.path),
  ...projectDetailRoutes(),
  ...writingDetailRoutes(),
];
```

Do not update `app.config.ts` with explicit writing paths. Its current `routes: [...prerenderRoutes]` contract is the correct integration point.

## SEO, JSON-LD, and Sitemap Wiring

Keep all metadata derivation in `src/domain/seo.ts`:

- Reuse `metadataForRoute(route)` for `/writing`.
- Add `metadataForWritingEntry(entry, profile)` for `/writing/{slug}`.
- Widen `PageMetadata.openGraph.type` from only `"website"` to `"website" | "article"` if writing detail pages use OG article metadata.
- Add `writingItemListJsonLd(entries, profile)` for `/writing`.
- Add `writingEntryJsonLd(entry, relatedProjects, profile)` using schema.org `Article`.
- Keep social image fallback on `/social/bright-builds-og.png` unless a later milestone explicitly adds per-note static OG images.
- Let `sitemapXml()` continue to default to `prerenderRoutes`; do not add writing-specific sitemap branching.

Writing Article JSON-LD should include:

- canonical `url`
- `headline`
- `description`
- `datePublished`
- `dateModified` when `maybeUpdatedOn` exists, otherwise `publishedOn`
- `author: personJsonLd(profile)`
- `keywords` from themes/tags
- `about` with related project names, themes, tags, and section headings

## Cross-Link Strategy

Relationship ownership:

1. Writing entries own `relatedProjectSlugs`.
2. Project detail pages call `writingEntriesForProject(selectedProject())`.
3. Writing detail pages call `relatedProjectsForWriting(selectedEntry())`.
4. Links to projects should use `projectStoryHref(project)`, so selected projects go to `/projects/{slug}` and unselected public projects go to `/projects#slug`.
5. Hidden/excluded projects should not be linkable from public writing unless a future explicit exception is added.

Recommended UI placements:

- On `/writing`: show entry cards with title, kind, date, summary, tags/themes, and related project chips/links.
- On `/writing/{slug}`: show note body first, then related projects as a supporting panel.
- On `/projects/{slug}`: add a "Related writing" panel in the aside or after the main story. Render nothing if there are no related notes.
- On `/`: rely on nav first. Add a compact writing teaser only after the index/detail routes and verification are stable.

## Verification Integration

### Unit Tests

Add focused tests for pure writing behavior:

- `src/domain/writing-routes.test.ts` or `src/domain/writing.test.ts`
  - selects only published entries
  - derives `/writing/{slug}` paths in display order
  - includes writing detail routes in `prerenderRoutes`
  - resolves `maybePublishedWritingEntryBySlug`
  - derives project/note cross-links without duplicate relationship data
  - excludes hidden/draft entries from routes and sitemap
- Extend `src/domain/foundation.test.ts`
  - expected top-level route set includes `/writing`
  - expected `prerenderRoutes` includes `...writingDetailRoutes()`
- Extend `src/domain/portfolio-surfaces.test.ts`
  - sitemap covers writing index/detail routes
  - writing metadata and JSON-LD use canonical origin and safe JSON serialization

### Static Verification

Modify `scripts/verify-static.ts`:

- Import writing selectors, path helpers, and SEO helpers.
- Add a `maybeWritingForDetailRoute(route)` branch parallel to `maybeProjectForDetailRoute(route)`.
- Add expected static body text for `/writing` and `/writing/{slug}`.
- Assert `metadataForWritingEntry()` for detail pages.
- Assert `writingEntryJsonLd()` for detail pages and `writingItemListJsonLd()` for `/writing`.
- Add sitemap checks for every `writingDetailRoutes()` entry and for excluding hidden/draft notes.
- Assert related project links and related writing links appear in generated HTML before hydration.

### Browser Release Checks

Modify `tests/browser-release.playwright.ts`:

- The axe/layout loop already covers every `prerenderRoutes` entry, so writing pages become covered once routes are wired.
- Add a representative writing detail route helper from `writingDetailRoutes()`.
- Update keyboard coverage to require focus reaches `/writing`, one writing detail route, and at least one project/writing cross-link.
- Add `/writing` or a representative writing detail route to reduced-motion coverage if writing cards use `ReactiveSurface` or hover transforms.

### Release Verification

`scripts/verify-release.ts` should mostly work automatically because it scans emitted route HTML, internal links, external links, budgets, semantics, accessibility hooks, and forbidden built-output patterns.

Modify adjacent release helpers only where the contract is explicit:

- `scripts/release-readiness.ts`: add required facts/evidence labels for writing route coverage if release docs remain part of the gate.
- `docs/release-readiness.md`: implementation phase should document writing static, browser, sitemap, metadata, and cross-link coverage if the verifier requires it.
- External-link policy only needs changes if writing entries introduce new external origins.
- Route HTML budget can stay per-route unless writing pages exceed the current 75 KB threshold; prefer trimming content or splitting long notes before raising budgets.

### Curation Verification

Extend `scripts/verify-curation.ts` only if project relationships cannot be made compile-time safe. The guard should fail on:

- duplicate writing slugs
- published entries without body sections
- published entries missing title/summary/date
- related project slugs that do not resolve to public project index records
- hidden entries appearing in `writingDetailRoutes()`

## File Plan

### New Files

| File | Purpose |
| --- | --- |
| `src/domain/writing.ts` | Writing registry, types, selectors, path helpers, cross-link helpers |
| `src/domain/writing-validation.ts` | Optional pure validation for writing curation and related project slugs |
| `src/domain/writing.test.ts` or `src/domain/writing-routes.test.ts` | Unit coverage for route derivation, published filtering, and cross-links |
| `src/routes/writing/index.tsx` | `/writing` static index route |
| `src/routes/writing/[slug].tsx` | `/writing/{slug}` static note route |

### Modified Files

| File | Change |
| --- | --- |
| `src/domain/projects.ts` | Optional `CuratedProjectSlug` type export; no duplicated note relationships |
| `src/domain/routes.ts` | Add `/writing`; append `writingDetailRoutes()` to `prerenderRoutes` |
| `src/domain/seo.ts` | Add writing metadata, Article JSON-LD, writing ItemList JSON-LD; maybe widen OG type |
| `src/routes/projects/[slug].tsx` | Render related writing panel from writing helpers |
| `src/routes/index.tsx` | Optional concise writing discovery section after route/verification foundation |
| `src/domain/foundation.test.ts` | Update expected route/prerender set |
| `src/domain/portfolio-surfaces.test.ts` | Add writing sitemap/metadata/JSON-LD assertions |
| `scripts/verify-curation.ts` | Add writing validation if not fully type-enforced |
| `scripts/verify-static.ts` | Add writing route, metadata, JSON-LD, sitemap, and cross-link checks |
| `scripts/release-readiness.ts` | Add writing release facts/evidence labels if docs remain required by `verify:release` |
| `scripts/release-readiness.test.ts` | Update required release-readiness fact tests if helper changes |
| `tests/browser-release.playwright.ts` | Add writing keyboard/reduced-motion representative coverage |
| `public/sitemap.xml` | Regenerated by `bun run generate:static-metadata` after route wiring |

### No Source Change Expected

| File | Reason |
| --- | --- |
| `app.config.ts` | Already prerenders `prerenderRoutes` |
| `scripts/generate-static-metadata.ts` | Already writes `sitemapXml()` and `robotsTxt()` |
| `src/components/SiteLayout.tsx` | Navigation consumes `navigationRoutes`; adding a nav route should surface Writing automatically |
| `scripts/verify-release.ts` | Generic emitted-HTML scanner should cover writing unless new explicit release facts are needed |

## Suggested Build Order

1. Add `src/domain/writing.ts` with a small seed registry, selectors, path helpers, and unit tests.
2. Add writing validation only for invariants TypeScript cannot enforce cleanly, then wire it into `verify:curation`.
3. Wire `/writing` and `writingDetailRoutes()` into `src/domain/routes.ts`; update foundation route tests.
4. Add SEO helpers for writing index/detail pages; update metadata, JSON-LD, and sitemap unit tests.
5. Build `src/routes/writing/index.tsx` and `src/routes/writing/[slug].tsx` as thin static shells over domain data.
6. Add related writing to `src/routes/projects/[slug].tsx`; use the writing registry as the single relationship source.
7. Expand `scripts/verify-static.ts` to prove writing HTML, metadata, JSON-LD, sitemap, and cross-links before hydration.
8. Expand Playwright keyboard/reduced-motion coverage and release-readiness facts for writing routes.
9. Regenerate static metadata, run production build, then run the aggregate release gate.

## Anti-Patterns to Avoid

- Do not introduce MDX, a CMS, filesystem content globbing, or runtime content loading for v1.3.
- Do not duplicate relationships in both project records and writing records.
- Do not add writing routes directly to `app.config.ts`; keep `prerenderRoutes` authoritative.
- Do not let hidden/draft entries enter prerender routes, sitemap, JSON-LD ItemList, or release checks.
- Do not add new external-link origins in note content without release policy coverage.
- Do not make project pages import a large writing UI component; keep cross-link rendering local and data-driven.

## Sources

- Local architecture and milestone context: `.planning/PROJECT.md`, `app.config.ts`, `src/domain/projects.ts`, `src/domain/routes.ts`, `src/domain/seo.ts`, `src/routes/projects/index.tsx`, `src/routes/projects/[slug].tsx`, `src/routes/index.tsx`, `scripts/verify-static.ts`, `scripts/verify-release.ts`, `tests/browser-release.playwright.ts`.
- Additional local integration points inspected: `src/components/SiteLayout.tsx`, `scripts/generate-static-metadata.ts`, `scripts/release-readiness.ts`, `src/domain/foundation.test.ts`, `src/domain/project-detail-routes.test.ts`, `src/domain/portfolio-surfaces.test.ts`.
- Bright Builds local guidance: `AGENTS.bright-builds.md`, `standards-overrides.md`.
- Pinned canonical standards loaded from Bright Builds Rules commit `05f8d7a6c9c2e157ec4f922a05273e72dab97676`: `standards/index.md`, `standards/core/architecture.md`, `standards/core/verification.md`, `standards/core/testing.md`, `standards/languages/typescript-javascript.md`.

## Confidence and Gaps

| Area | Confidence | Notes |
| --- | --- | --- |
| Domain integration | HIGH | Existing project detail architecture is directly reusable for writing. |
| Route/prerender wiring | HIGH | `app.config.ts` already delegates to `prerenderRoutes`; writing should only extend domain route helpers. |
| SEO/sitemap wiring | HIGH | Sitemap and robots already derive from pure SEO helpers and generated static files. |
| Browser/release verification | MEDIUM-HIGH | Existing loops cover `prerenderRoutes`, but keyboard/reduced-motion expectations need explicit writing representatives. |
| Content model depth | MEDIUM | Typed sections are enough for v1.3; if notes become long-form editorial content, a later milestone can re-evaluate Markdown/MDX. |
