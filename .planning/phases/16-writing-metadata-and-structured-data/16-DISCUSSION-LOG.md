# Phase 16: Writing Metadata and Structured Data - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md -- this log preserves the alternatives considered.

**Date:** 2026-06-14T15:14:48.471Z
**Phase:** 16-Writing Metadata and Structured Data
**Mode:** Yolo
**Areas discussed:** Metadata source of truth, Social and article metadata, Structured data, Sitemap behavior, OpenLinks identity presence, Verification boundary

---

## Metadata Source Of Truth

| Option | Description | Selected |
|--------|-------------|----------|
| Pure SEO helpers | Extend `src/domain/seo.ts` and keep route components as render shells. | yes |
| Route-local literals | Put per-writing metadata directly in route components. | |
| Generated static file only | Generate metadata externally without typed helper coverage. | |

**User's choice:** Auto-selected pure SEO helpers.
**Notes:** This matches prior project metadata work and keeps Phase 16 aligned with functional-core guidance.

---

## Social And Article Metadata

| Option | Description | Selected |
|--------|-------------|----------|
| Article detail metadata with static fallback image | Use entry-derived title/description/canonical, `og:type="article"`, optional article date/tag fields, and the checked-in social image. | yes |
| Website metadata everywhere | Keep all writing pages as generic `website` metadata. | |
| Per-entry generated images | Add richer social images now. | |

**User's choice:** Auto-selected article detail metadata with static fallback image.
**Notes:** Richer deterministic OG images remain future scope; dynamic image routes are explicitly excluded.

---

## Structured Data

| Option | Description | Selected |
|--------|-------------|----------|
| `BlogPosting` detail plus index `ItemList` | Derive schema from public writing helpers, person identity, canonical URLs, dates, topics, and tags. | yes |
| `TechArticle`/schema split | Use different schemas by note kind. | |
| No writing JSON-LD | Leave structured data for a future release. | |

**User's choice:** Auto-selected `BlogPosting` detail plus index `ItemList`.
**Notes:** This satisfies META-02 without over-modeling the small curated writing set.

---

## Sitemap Behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Route-derived sitemap | Continue deriving sitemap output from `prerenderRoutes`, which includes `writingDetailRoutes()`. | yes |
| Hard-coded writing sitemap list | Add writing slugs directly in the generator. | |
| Manual public XML edits only | Update `public/sitemap.xml` without helper coverage. | |

**User's choice:** Auto-selected route-derived sitemap.
**Notes:** Public/draft exclusion should remain a property of writing public helpers.

---

## OpenLinks Identity Presence

| Option | Description | Selected |
|--------|-------------|----------|
| Reuse `personJsonLd()` identity graph | Keep OpenLinks in `sameAs` and avoid new writing-page promotion. | yes |
| Add writing page CTA | Add an OpenLinks CTA to writing pages. | |
| Metadata-only replacement | Replace visible identity surfaces with metadata hints only. | |

**User's choice:** Auto-selected reuse of `personJsonLd()`.
**Notes:** This follows the OpenLinks skill's subtle placement bias and keeps Bright Builds/writing primary.

---

## Verification Boundary

| Option | Description | Selected |
|--------|-------------|----------|
| Focused Phase 16 tests plus build/static proof | Cover pure metadata/schema/sitemap helpers now and leave release-contract expansion to Phase 17. | yes |
| Full release gate expansion now | Update browser/release-readiness/evidence labels in this phase. | |
| No tests until Phase 17 | Implement metadata without focused unit coverage. | |

**User's choice:** Auto-selected focused Phase 16 tests plus build/static proof.
**Notes:** Phase 17 owns broad release evidence and aggregate gate wording.

---

## the agent's Discretion

- Exact helper and type names may be chosen during planning.
- The planner may choose one `BlogPosting` helper for both notes and essays.
- The planner may decide whether `/writing` uses a dedicated `writingItemListJsonLd()` helper or a more general collection helper.

## Deferred Ideas

- Deterministic per-writing OG images.
- RSS/Atom, search, tag archives, comments, newsletter, CMS/admin, MDX, or runtime content integrations.
- Phase 17 release-readiness docs, browser release labels, and aggregate evidence naming.
