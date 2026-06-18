# Phase 22: Theme Metadata and Structured Data - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-06-18T01:11:51.199Z
**Phase:** 22 - Theme Metadata and Structured Data
**Mode:** Yolo
**Areas discussed:** Theme metadata contract, Structured data shape, Sitemap and social preview fallback, Static verification boundary

---

## Theme Metadata Contract

| Option | Description | Selected |
| --- | --- | --- |
| Pure SEO helper per theme | Add `metadataForTheme(...)` beside existing route/project/writing helpers; route components only render the result. | yes |
| Inline route metadata | Assemble theme metadata directly in `src/routes/themes/[slug].tsx`. | |
| Generic route metadata only | Reuse `/themes` metadata for every detail route. | |

**User's choice:** Auto-selected pure SEO helper per theme.
**Notes:** This matches the existing `metadataForProject()` and `metadataForWritingEntry()` pattern and keeps route shells thin.

---

## Structured Data Shape

| Option | Description | Selected |
| --- | --- | --- |
| ItemList index plus CollectionPage detail | Use ordered public theme items for `/themes` and helper-derived theme collection JSON-LD for detail routes. | yes |
| Person-only structured data | Keep the current index-level Person JSON-LD and skip theme-specific JSON-LD. | |
| Project/writing-only nested blobs | Reuse full project and writing JSON-LD objects without a theme-level page entity. | |

**User's choice:** Auto-selected ItemList index plus CollectionPage detail.
**Notes:** This satisfies META-02 while avoiding dated article semantics for theme pages.

---

## Sitemap and Social Preview Fallback

| Option | Description | Selected |
| --- | --- | --- |
| Helper-derived sitemap plus checked-in social fallback | Add `/themes` and public theme detail routes through `sitemapRoutes`, reuse `/social/bright-builds-og.png`. | yes |
| Dynamic social images | Add runtime or server-generated per-theme OG images. | |
| Manual sitemap route list | Copy theme slugs into sitemap generation manually. | |

**User's choice:** Auto-selected helper-derived sitemap plus checked-in social fallback.
**Notes:** This keeps static deployment, no-runtime-image, and public-only helper boundaries intact.

---

## Static Verification Boundary

| Option | Description | Selected |
| --- | --- | --- |
| Unit plus static verifier coverage | Test pure helpers and generated output metadata/JSON-LD/sitemap coverage in the existing static verifier. | yes |
| Browser release expansion now | Add browser release matrix and release-readiness evidence labels in this phase. | |
| Minimal domain tests only | Add metadata helper tests but skip generated HTML and sitemap assertions. | |

**User's choice:** Auto-selected unit plus static verifier coverage.
**Notes:** Phase 23 owns release-contract and broad browser evidence labels. Phase 22 should prove static metadata output without overclaiming release evidence.

---

## the agent's Discretion

- Exact exported JSON-LD type names.
- Whether detail JSON-LD nests related work as `hasPart`, `mentions`, or a small `ItemList`, provided it stays schema.org-compatible and helper-derived.
- Whether route head rendering duplication is extracted into a small local helper.

## Deferred Ideas

- Phase 23 release-contract evidence, release-readiness docs, and browser release-suite expansion.
- Future deterministic per-theme raster social images.
