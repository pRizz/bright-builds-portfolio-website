# Phase 12: Project Metadata & Sharing - Research

**Researched:** 2026-06-02
**Domain:** SolidStart static metadata, curated project structured data, sitemap generation, deterministic social previews
**Confidence:** HIGH

<user_constraints>

## User Constraints (from CONTEXT.md)

The following decisions come from `.planning/phases/12-project-metadata-sharing/12-CONTEXT.md`.

### Project Metadata

- Keep curated project data as the source of truth for project detail metadata; do not derive visitor-facing metadata from runtime GitHub calls or route filesystem scanning.
- Keep `metadataForProject()` pure and project-specific, deriving title, description, canonical URL, Open Graph, and Twitter fields from selected project records and the canonical profile origin.
- Preserve route head rendering in `src/routes/projects/[slug].tsx`, extending it only as needed for project JSON-LD and social-preview metadata.

### Structured Data

- Add a dedicated project JSON-LD helper for selected detail pages and emit it before hydration.
- Model project detail JSON-LD from selected project name, one-line description, canonical detail URL, direct links, source links, tags/themes, and authored story facts where the schema supports them cleanly.
- Preserve Peter/OpenLinks identity discoverability through existing profile `sameAs` data in author/creator metadata where appropriate.

### Sitemap and Sharing Assets

- Make sitemap generation include all prerendered selected project detail routes by default and continue excluding hidden, excluded, archived-only, or unselected projects.
- Treat `public/social/bright-builds-og.png` as the deterministic static fallback unless a cheap project-specific static asset path already exists.
- Document and verify the static fallback explicitly; do not add dynamic OG image endpoints or manual per-project raster editing.

### Verification

- Add focused unit coverage for project JSON-LD, project metadata, sitemap inclusion, and selected/unselected project exclusion behavior.
- Extend static output verification for project detail JSON-LD, metadata, sitemap entries, selected route inclusion, unselected route exclusion, and social preview asset mapping.
- Remove the temporary release-verifier exception that allowed project detail routes to skip JSON-LD.

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| META-01 | Each project detail route has route-specific title, description, canonical URL, Open Graph, and Twitter metadata derived from curated project data. | `metadataForProject()` already derives these values; Phase 12 should harden the tests and static verifier around every selected detail route. |
| META-02 | Each project detail route renders project-specific JSON-LD suitable for static software/project pages. | Add a pure `projectJsonLd()`-style helper in `src/domain/seo.ts` and render it from `src/routes/projects/[slug].tsx` through `jsonLdScriptContent()`. |
| META-03 | Generated sitemap output includes every selected project detail route and excludes unselected projects. | `prerenderRoutes` already combines top-level routes and `projectDetailRoutes()`; make `sitemapXml()` default to the same route source instead of requiring tests or callers to pass an expanded list. |
| META-04 | Project detail routes have deterministic project-specific social preview support or a documented static fallback that does not require runtime rendering. | The checked-in `public/social/bright-builds-og.png` is already validated as a local 1200x630 image; document and assert it as the project-detail static fallback. |

</phase_requirements>

## Summary

Phase 12 is a pure-helper and generated-output verification phase. The project already has the route foundation, selected project detail data, page head metadata, and a static social preview image. The missing piece is making project detail JSON-LD and sitemap coverage first-class, then removing the temporary release verifier exception for detail routes without expanding Phase 13 release documentation scope.

**Primary recommendation:** implement one focused plan that extends `src/domain/seo.ts`, `src/routes/projects/[slug].tsx`, unit tests, `scripts/generate-static-metadata.ts`, `scripts/verify-static.ts`, and `scripts/verify-release.ts`. No dependency changes are needed.

## Existing Code Findings

### Project Data and Routes

- `src/domain/projects.ts` owns the authoritative curated registry and selected detail route helpers: `projectDetailPageProjects()`, `projectDetailPath()`, `projectDetailRoutes()`, `projectStoryHref()`, and `maybeProjectDetailPageProjectBySlug()`.
- Selected detail routes are currently six flagship projects: OpenLinks, Free The World, Win3Bitco.in, opencode-cloud, Zeckendorf, and Mystic UI.
- `src/domain/routes.ts` already defines `prerenderRoutes` as top-level site routes plus `projectDetailRoutes()`.

### Metadata Helpers

- `src/domain/seo.ts` already has pure helper patterns for `metadataForRoute()`, `metadataForProject()`, `personJsonLd()`, `projectItemListJsonLd()`, `sitemapXml()`, `robotsTxt()`, and `jsonLdScriptContent()`.
- `metadataForProject()` uses `project.oneLine`, `projectDetailPath(project)`, and the canonical profile origin. This satisfies the shape needed by `META-01`, but tests should prove all selected detail projects get complete values.
- `projectItemListJsonLd()` already uses `SoftwareSourceCode` items for project index JSON-LD and switches selected projects from hash anchors to detail URLs.

### Project Detail Route Rendering

- `src/routes/projects/[slug].tsx` renders Solid head tags for project metadata through `@solidjs/meta`.
- The route does not currently emit project detail JSON-LD. Add one `script type="application/ld+json"` in the selected-project branch using a pure helper and `jsonLdScriptContent()`.
- The not-found fallback should not emit project-specific metadata or JSON-LD for unselected slugs.

### Static Metadata Generation

- `scripts/generate-static-metadata.ts` writes `public/sitemap.xml` from `sitemapXml()` and `public/robots.txt` from `robotsTxt()`.
- `public/sitemap.xml` must be regenerated after `sitemapXml()` defaults change so checked-in static metadata includes selected project detail routes.

### Verification

- `src/domain/project-detail-routes.test.ts` and `src/domain/portfolio-surfaces.test.ts` are the right places for pure helper coverage.
- `scripts/verify-static.ts` already checks generated route HTML, head metadata, JSON-LD scripts on top-level routes, local social assets, sitemap equality, robots equality, and forbidden GitHub runtime residue.
- `scripts/verify-release.ts` currently exempts `/projects/{slug}` routes from the semantic JSON-LD requirement via `isProjectDetailFoundationRoute()`. Remove that exception once detail JSON-LD is emitted.

## Recommended Implementation Shape

### SEO Helper Additions

Add a project detail JSON-LD type and helper in `src/domain/seo.ts`. Keep the return value deterministic and serializable:

- `@context`: `https://schema.org`
- `@type`: use the same software/project vocabulary already used by the repo's `ProjectItemListJsonLd`, preferably `SoftwareSourceCode`.
- `name`: project name
- `description`: project one-line description
- `url`: canonical project detail URL
- `sameAs`: project links
- `keywords`: combined tags and themes
- `creator` or `author`: Peter profile identity with `sameAs`, preserving GitHub and OpenLinks identity links
- additional fields can include source code URL and programming language when available from checked-in project links or GitHub snapshot helpers, but avoid making GitHub snapshot availability required for schema validity.

Do not add a dependency for structured data generation. A typed object is enough and matches existing code.

### Sitemap Defaults

Change `sitemapXml()` so its default route list is `prerenderRoutes` or an equivalent route-path list, not only `siteRoutes`. Avoid creating fake `SiteRoute` objects for project paths in tests. A path-based helper such as `sitemapXml(paths: readonly string[] = prerenderRoutes, profile = peterProfile)` is simpler than keeping a `SiteRoute[]` signature for detail routes.

If changing the function signature, update existing tests and `scripts/generate-static-metadata.ts` together.

### Static Social Preview Fallback

Keep `public/social/bright-builds-og.png` as the deterministic static fallback for project detail routes. To make `META-04` explicit:

- Update metadata tests to assert every selected project uses a canonical local social image URL.
- Add a stable exported helper or explicit naming in `src/domain/seo.ts` only if it reduces duplication.
- Add a short note in the phase plan/summary rather than adding new visitor-facing UI text.

### Verification Updates

Unit tests should prove:

- `metadataForProject()` returns non-empty title/description/canonical/OG/Twitter for every selected project.
- project detail JSON-LD includes project name, description, canonical URL, project links, and profile identity links.
- `sitemapXml()` includes `projectDetailRoutes()` by default.
- unselected projects remain absent from `projectDetailRoutes()` and from default sitemap output.

Static verification should prove:

- every selected detail route includes project metadata head tags;
- every selected detail route includes JSON-LD script content with project name and canonical URL;
- sitemap output matches `sitemapXml()` and includes selected detail routes;
- the social image URL maps to a checked-in local output asset.

Release verification should require JSON-LD on project detail routes by removing the foundation-route exception.

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Circular import between `routes.ts` and `seo.ts` if `sitemapXml()` imports `prerenderRoutes`. | Prefer making `sitemapXml()` accept route paths and default from a small local helper only if it does not introduce a cycle; otherwise pass `prerenderRoutes` from generator/verifier/tests and document the call-site contract. |
| JSON-LD overclaims fields that are not authoritative. | Use only checked-in curated project fields and direct project links. Keep GitHub snapshot facts optional and out of required structured data. |
| Static fallback is seen as not project-specific enough. | The requirement allows a documented static fallback. Verify deterministic local asset mapping and leave richer per-project raster generation to future `OG-01`/`OG-02`. |
| Release verifier starts failing before route JSON-LD is added. | Sequence implementation so route JSON-LD lands before removing the exception. |

## Verification Strategy

Recommended commands:

1. `bun run format`
2. `bun run check`
3. `bun run typecheck`
4. `bun run test -- src/domain/project-detail-routes.test.ts src/domain/portfolio-surfaces.test.ts scripts/verify-release.test.ts`
5. `bun run generate:static-metadata`
6. `bun run build`
7. `bun run verify:static`
8. `bun run verify:release`
9. `bun run verify`

The final wrapper gate should use `bun run verify` before commit/push.

## Planning Recommendation

One plan is sufficient:

- Task 1: extend SEO helpers and unit tests for project metadata, project JSON-LD, sitemap route defaults, and social fallback.
- Task 2: render project JSON-LD on project detail routes and regenerate static metadata files.
- Task 3: update static and release verifiers, including removal of the project detail JSON-LD exception.
- Task 4: run focused verification and aggregate verification.

Splitting into multiple plans would add coordination overhead without useful parallelism because all changes touch the same SEO/static verification surface.

## RESEARCH COMPLETE
