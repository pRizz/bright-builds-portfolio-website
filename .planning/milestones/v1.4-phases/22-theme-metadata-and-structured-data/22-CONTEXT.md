---
generated_by: gsd-discuss-phase
lifecycle_mode: yolo
phase_lifecycle_id: 22-2026-06-18T01-09-47
generated_at: 2026-06-18T01:11:51.199Z
---

# Phase 22: Theme Metadata and Structured Data - Context

**Gathered:** 2026-06-18
**Status:** Ready for planning
**Mode:** Yolo

<domain>

## Phase Boundary

Phase 22 makes the existing `/themes` index and public `/themes/{slug}` detail routes discoverable through helper-derived static metadata, structured data, sitemap inclusion, and the checked-in static social preview fallback.

This phase should add route-specific theme metadata, theme JSON-LD, sitemap coverage, and static verification for those outputs. It should not add Phase 23 browser release-suite expansion, release-readiness evidence labels, hosted/live assertions, dynamic Open Graph routes, runtime image generation, runtime content fetches, live external-link checks, CMS/admin tooling, search, filters, analytics, newsletter, or comments.

</domain>

<decisions>

## Implementation Decisions

### Theme Metadata Contract

- **D-01:** Keep metadata derivation in pure domain helpers in `src/domain/seo.ts`, parallel to `metadataForProject()` and `metadataForWritingEntry()`.
- **D-02:** Add a theme detail metadata helper that accepts a `PublicThemeEntry` and derives title, description, canonical URL, Open Graph, and Twitter metadata from `theme.title`, `theme.summary`, `themeDetailPath(theme)`, and `peterProfile.canonicalOrigin`.
- **D-03:** Theme detail Open Graph type should remain `website`, not `article`, because theme pages are curated collection paths rather than dated writing entries.
- **D-04:** The `/themes` index should keep route-level metadata through `metadataForRoute(routeByPath("/themes"))`; detail pages should use the new theme-specific helper.
- **D-05:** Unknown or non-public theme fallback head output should stay generic and non-leaking. It may include a fallback title/description pointing visitors back to `/themes`, but it must not echo the requested slug or private theme data.

### Structured Data Shape

- **D-06:** Add static JSON-LD helpers for theme surfaces in `src/domain/seo.ts` instead of assembling JSON-LD directly inside route components.
- **D-07:** Represent the `/themes` index as an ordered `ItemList` of public theme detail pages derived from `publicThemeEntries()` and `themeDetailPath()`.
- **D-08:** Represent each public theme detail route as a `CollectionPage`-style JSON-LD object with the theme name, summary, canonical URL, checked-in social image, creator identity, proof points, collaboration angle, related selected projects, and related public writing.
- **D-09:** Reuse `personJsonLd()` for creator/author identity so OpenLinks remains present through `Person.sameAs` metadata without adding new visible OpenLinks promotion.
- **D-10:** Related project and writing entries in theme JSON-LD must be derived through existing helper relationships, not by copying route component state or duplicating project/writing authored copy manually.

### Sitemap and Social Preview Fallback

- **D-11:** Update `sitemapRoutes` to include `/themes` and every public `themeDetailRoutes()` value.
- **D-12:** Keep sitemap generation helper-derived. Hidden, draft, unsupported, archived, unknown, or otherwise non-public theme routes must remain excluded because `themeDetailRoutes()` only returns public theme routes.
- **D-13:** Continue using the checked-in `/social/bright-builds-og.png` fallback for theme index and detail metadata. Do not add dynamic image generation, server endpoints, network fetches, or per-theme image files in this phase.
- **D-14:** Preserve `robotsTxt()` and the existing `scripts/generate-static-metadata.ts` ownership model; the generator should still write sitemap and robots from pure helper output.

### Static Verification Boundary

- **D-15:** Add focused Vitest coverage for theme detail metadata, theme structured data, theme sitemap inclusion/exclusion, and static social fallback reuse.
- **D-16:** Update the static verifier to assert theme detail metadata and JSON-LD instead of keeping the current Phase 20 skip for theme routes.
- **D-17:** Update sitemap verification to require `/themes` and public theme detail routes, and to reject unknown or non-public theme routes.
- **D-18:** Keep Phase 23 release-contract work out of this phase. Browser release matrix expansion, release-readiness docs, and evidence label changes should wait until Phase 23.

### the agent's Discretion

- The planner may choose exact TypeScript type names for theme JSON-LD helpers as long as they stay explicit, exported only when useful, and testable as pure data-in/data-out functions.
- The planner may decide whether theme detail JSON-LD uses `CollectionPage` alone or a small nested `ItemList` for related work, provided the output remains schema.org-compatible, static, and helper-derived.
- The executor may deduplicate repeated head-tag rendering through a small local helper only if it removes real duplication without broadening the visual/component system.

</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Milestone Scope

- `.planning/ROADMAP.md` - Phase 22 goal, META-01 through META-04 success criteria, dependency on Phase 21, and Phase 23 boundary.
- `.planning/REQUIREMENTS.md` - Metadata and discovery requirements plus v1.4 out-of-scope exclusions for dynamic OG routes, runtime fetches, live reachability, CMS/admin, analytics, newsletter, comments, search, and prominent OpenLinks promotion.
- `.planning/PROJECT.md` - v1.4 milestone context, static portfolio constraints, current release gate facts, curated-content decisions, and OpenLinks placement decision.
- `.planning/STATE.md` - Current phase continuity and recent Phase 21 completion context.

### Prior Phase Decisions

- `.planning/phases/19-theme-domain-foundation/19-CONTEXT.md` - Theme registry, public selectors, route helpers, relationship resolution, validation boundaries, and metadata deferral.
- `.planning/phases/20-theme-routes-and-dark-ui/20-CONTEXT.md` - Theme route UI, public-only route derivation, fallback safety, and Phase 22 metadata deferral.
- `.planning/phases/21-collaboration-pathways-and-cross-links/21-CONTEXT.md` - Collaboration helper relationships, OpenLinks low-intrusion boundary, and Phase 22 metadata/JSON-LD deferral.

### Existing Code Patterns

- `src/domain/seo.ts` - Existing route, project, writing metadata helpers; Person, ItemList, SoftwareSourceCode, BlogPosting JSON-LD helpers; sitemap/robots helpers; checked-in social fallback mapping.
- `src/domain/routes.ts` - `siteRoutes`, `prerenderRoutes`, and current `sitemapRoutes` boundary that Phase 22 should update.
- `src/domain/themes.ts` - Public theme selectors, route helpers, collaboration actions, and related project/writing resolution helpers.
- `src/routes/themes/index.tsx` - Existing `/themes` metadata and current Person JSON-LD head rendering.
- `src/routes/themes/[slug].tsx` - Theme detail route that currently needs route-specific head metadata and JSON-LD plus generic fallback head output.
- `src/routes/writing/[slug].tsx` - Closest detail-route pattern for metadata, article tags, JSON-LD script output, and fallback head handling.
- `scripts/generate-static-metadata.ts` - Repo-owned sitemap and robots generator that should remain a thin pure-helper caller.
- `scripts/verify-static/metadata-jsonld-verifier.ts` - Static metadata and JSON-LD assertions, including the current Phase 20 theme-detail skip to remove in this phase.
- `scripts/verify-static/sitemap-assets-verifier.ts` - Static sitemap, asset, robots, and route coverage verification to extend for theme sitemap coverage.
- `src/domain/writing-metadata.test.ts` - Closest unit-test pattern for metadata, JSON-LD, sitemap coverage, and social fallback reuse.
- `src/domain/theme-routes.test.ts` - Current route registry test with the Phase 20 sitemap exclusion expectation that Phase 22 should update.

### Standards And Skills

- `AGENTS.md` - Repo-local dark-primary guidance, GSD artifact requirements, and visual verification requirement for UI changes.
- `AGENTS.bright-builds.md` - Bright Builds workflow, TypeScript, testing, verification, code-shape, and OpenLinks guidance.
- `standards/core/architecture.md` - Keep metadata and JSON-LD decisions in pure helpers, with route components as thin shells.
- `standards/core/code-shape.md` - Use shallow control flow and `maybe...` names for nullable values.
- `standards/core/testing.md` - Unit test pure metadata and structured-data behavior with focused Arrange/Act/Assert tests.
- `standards/core/verification.md` - Use repo-native verification before commit and prefer aggregate/owned commands.
- `standards/languages/typescript-javascript.md` - Keep TypeScript helper logic data-in/data-out, use Bun/repo scripts, and avoid new Python automation.
- `openlinks-identity-presence` skill - Use metadata as a secondary identity hint only when the visible footer/profile placement already exists; do not make OpenLinks the primary theme CTA.

</canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- `metadataForRoute()`, `metadataForProject()`, and `metadataForWritingEntry()` already define the local `PageMetadata` contract and checked-in social-image fallback.
- `personJsonLd()` already includes `profileSameAsLinks()`, which contains the low-intrusion OpenLinks metadata hint.
- `projectItemListJsonLd()`, `projectJsonLd()`, `writingItemListJsonLd()`, and `writingBlogPostingJsonLd()` provide the closest structured-data patterns.
- `themeDetailPath()`, `themeDetailRoutes()`, `publicThemeEntries()`, `relatedProjectDetailPageProjectsForTheme()`, `relatedWritingEntriesForTheme()`, and `collaborationActionsForTheme()` provide the helper-derived theme data.
- `jsonLdScriptContent()` already safely serializes JSON-LD for inline script tags.

### Established Patterns

- Static route metadata lives in domain helpers, then route components render `<Title>`, `<Meta>`, canonical links, social tags, and JSON-LD scripts.
- Generated sitemap and robots files come from `scripts/generate-static-metadata.ts`, which calls pure helpers and writes checked-in `public/` files.
- Static verification checks generated HTML before hydration and verifies metadata images map to the local checked-in social preview fallback.
- Public route coverage should derive from helper output rather than crawler-discovered links or copied slug arrays.

### Integration Points

- Extend `src/domain/seo.ts` with theme metadata and theme JSON-LD helpers.
- Update `src/domain/routes.ts` so `sitemapRoutes` includes `/themes` and public theme detail routes.
- Update `src/routes/themes/index.tsx` to emit theme index structured data.
- Update `src/routes/themes/[slug].tsx` to emit theme detail metadata/JSON-LD and generic fallback metadata.
- Update focused unit tests and static verification modules for metadata, JSON-LD, sitemap coverage, and social fallback behavior.
- Regenerate `public/sitemap.xml` with `bun run generate:static-metadata`.

</code_context>

<specifics>

## Specific Ideas

- Theme metadata should describe the theme path itself, not re-market OpenLinks or duplicate project/writing body copy.
- The `open-identity` theme can naturally include OpenLinks in JSON-LD through its related project relationships and profile `sameAs`, but general theme metadata should keep Bright Builds, themes, projects, and writing primary.
- The theme index structured data should prove public ordering and public-only route derivation.
- The static verifier should become the primary proof for Phase 22; Phase 23 can later decide which browser/release-readiness labels to add.

</specifics>

<deferred>

## Deferred Ideas

- Browser release-suite expansion, release-readiness docs, and automated evidence labels for theme metadata coverage belong to Phase 23.
- Rich per-theme raster OG image generation belongs to future OG work, not this phase.
- Search, filters, tag archives, CMS/admin, comments/newsletter, analytics, live external-link reachability, runtime content fetches, and dynamic OG images remain future or out of scope.

</deferred>

---

*Phase: 22-theme-metadata-and-structured-data*
*Context gathered: 2026-06-18*
