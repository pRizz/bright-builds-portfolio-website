---
generated_by: gsd-discuss-phase
lifecycle_mode: yolo
phase_lifecycle_id: 12-2026-06-02T21-19-24
generated_at: 2026-06-02T21:20:49Z
---

# Phase 12: Project Metadata & Sharing - Context

**Gathered:** 2026-06-02
**Status:** Ready for planning
**Mode:** Yolo

<domain>

## Phase Boundary

This phase completes the metadata and sharing contract for selected project detail routes. It must make route-specific title, description, canonical, Open Graph, Twitter, project JSON-LD, sitemap coverage, and deterministic social preview support first-class for every selected `/projects/{slug}` page.

This phase does not add broader release documentation, browser route coverage expansion, or clean-builder release contract updates. Those remain mapped to Phase 13.

</domain>

<decisions>

## Implementation Decisions

### Project Metadata

- **D-01:** Keep curated project data as the source of truth for project detail metadata; do not derive visitor-facing metadata from runtime GitHub calls or route filesystem scanning.
- **D-02:** Keep `metadataForProject()` pure and project-specific, deriving title, description, canonical URL, Open Graph, and Twitter fields from selected project records and the canonical profile origin.
- **D-03:** Preserve route head rendering in `src/routes/projects/[slug].tsx`, but extend it only as needed for project JSON-LD and social-preview metadata. Avoid a broad shared head-component refactor unless planning proves the duplication is the main risk.

### Structured Data

- **D-04:** Add a dedicated project JSON-LD helper for selected detail pages, suitable for static software/project pages and emitted before hydration.
- **D-05:** Model each project detail JSON-LD around the selected project's name, one-line description, canonical detail URL, direct project links, source links, tags/themes, and authored project story facts when the schema supports them cleanly.
- **D-06:** Preserve Peter/OpenLinks identity discoverability through existing profile `sameAs` data in author/creator metadata where appropriate, without adding a repeated visible OpenLinks CTA to project detail pages.

### Sitemap and Sharing Assets

- **D-07:** Make sitemap generation include all prerendered selected project detail routes by default and continue excluding hidden, excluded, archived-only, or unselected projects.
- **D-08:** Treat the current checked-in `public/social/bright-builds-og.png` as the deterministic static fallback for project detail social previews unless a cheap project-specific static asset path already exists.
- **D-09:** Document and verify the static fallback explicitly so Phase 12 satisfies `META-04` without adding dynamic OG image endpoints or manual per-project raster editing.

### Verification

- **D-10:** Add focused unit coverage for project JSON-LD, project metadata, sitemap inclusion, and selected/unselected project exclusion behavior.
- **D-11:** Extend static output verification to assert project detail JSON-LD, project detail metadata, sitemap entries, selected route inclusion, unselected route exclusion, and social preview asset mapping.
- **D-12:** Remove the temporary release-verifier exception that allowed project detail routes to skip JSON-LD once project detail JSON-LD is emitted.

### the agent's Discretion

- The agent may choose exact helper names and schema fields that best match the existing `src/domain/seo.ts` style, provided the helpers stay pure and tests prove the generated output.
- The agent may keep the current shared fallback image for all project routes or introduce deterministic local project-specific image paths only if it can do so without new runtime rendering, visual churn, or asset-generation complexity.

</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Scope

- `.planning/ROADMAP.md` - Phase 12 goal, dependencies, and success criteria.
- `.planning/REQUIREMENTS.md` - `META-01`, `META-02`, `META-03`, and `META-04`.
- `.planning/STATE.md` - Active v1.2 milestone state and Phase 12 readiness.
- `.planning/phases/10-project-detail-route-foundation/10-CONTEXT.md` - Detail route selection, initial metadata derivation, and Phase 12 deferrals.
- `.planning/phases/10-project-detail-route-foundation/10-01-SUMMARY.md` - Existing route helpers, metadata test baseline, and temporary JSON-LD release verifier exception.
- `.planning/phases/11-project-story-page-ui/11-CONTEXT.md` - Project story UI boundary and deferred metadata/sharing work.
- `.planning/phases/11-project-story-page-ui/11-01-SUMMARY.md` - Current project detail route UI and verification state.

### Repo and Standards Guidance

- `AGENTS.md` - Dark-primary UI defaults, GSD workflow enforcement, and visual verification expectations.
- `AGENTS.bright-builds.md` - Bright Builds functional-core, TypeScript, verification, testing, and OpenLinks identity guidance.
- `standards-overrides.md` - No active local standards overrides.
- Bright Builds canonical standards at commit `05f8d7a6c9c2e157ec4f922a05273e72dab97676`, especially architecture, code shape, verification, testing, and TypeScript/JavaScript guidance.

### Existing Code

- `src/domain/projects.ts` - Curated project registry, selected detail page helpers, and project route helpers.
- `src/domain/seo.ts` - Existing route metadata, project metadata, Person JSON-LD, project ItemList JSON-LD, sitemap, robots, and social image helpers.
- `src/domain/profile.ts` - Canonical origin and `sameAs` identity links, including OpenLinks.
- `src/domain/project-detail-routes.test.ts` - Existing selected route and project metadata tests.
- `src/domain/portfolio-surfaces.test.ts` - Existing SEO, JSON-LD, sitemap, and social preview unit coverage.
- `src/routes/projects/[slug].tsx` - Project detail head metadata and page rendering.
- `scripts/generate-static-metadata.ts` - Static sitemap and robots generator.
- `scripts/verify-static.ts` - Static output verifier for route metadata, JSON-LD, assets, sitemap, and forbidden runtime residue.
- `scripts/verify-release.ts` - Release semantic verifier with the current project-detail JSON-LD exception to remove.

</canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- `projectDetailPageProjects()`, `projectDetailPath()`, `projectDetailRoutes()`, and `maybeProjectDetailPageProjectBySlug()` already identify the selected detail routes that Phase 12 must cover.
- `metadataForProject()` already derives project-specific title, description, canonical URL, Open Graph, and Twitter records from curated project data.
- `personJsonLd()`, `projectItemListJsonLd()`, `jsonLdScriptContent()`, `sitemapXml()`, and `robotsTxt()` already provide the pure SEO helper style to extend.

### Established Patterns

- SEO logic lives in `src/domain/seo.ts` as pure helpers, while route files render Solid head tags and JSON-LD scripts.
- Static verification compares generated output against pure helper output rather than duplicating expected strings manually.
- Tests use Arrange, Act, Assert sections and focused behavior-level assertions.

### Integration Points

- `src/routes/projects/[slug].tsx` should emit project detail JSON-LD with `jsonLdScriptContent()` near the existing project head metadata.
- `scripts/generate-static-metadata.ts` and static output checks should use the same sitemap helper default route set so checked-in `public/sitemap.xml` cannot drift from selected detail routes.
- `scripts/verify-release.ts` should require JSON-LD on project detail routes after this phase instead of treating those routes as foundation-only exceptions.

</code_context>

<specifics>

## Specific Ideas

- Prefer a documented static social preview fallback over dynamic OG image routes for this milestone.
- Keep OpenLinks identity subtle: existing footer/about/contact/profile metadata is enough visually, while project structured data may reference profile `sameAs` where it fits the schema.

</specifics>

<deferred>

## Deferred Ideas

- Rich per-project raster Open Graph image generation remains future requirement `OG-01`.
- Visitor-visible social previews that vary by project theme remain future requirement `OG-02`.
- Release-readiness documentation and browser/reduced-motion route coverage expansion remain Phase 13.

</deferred>

---

*Phase: 12-project-metadata-sharing*
*Context gathered: 2026-06-02*
