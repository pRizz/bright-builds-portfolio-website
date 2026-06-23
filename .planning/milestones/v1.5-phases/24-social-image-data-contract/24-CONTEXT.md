---
generated_by: gsd-discuss-phase
lifecycle_mode: yolo
phase_lifecycle_id: 24-2026-06-21T14-01-05
generated_at: 2026-06-21T14:02:37.233Z
---

# Phase 24: Social Image Data Contract - Context

**Gathered:** 2026-06-21
**Status:** Ready for planning
**Mode:** Yolo

<domain>
## Phase Boundary

Create one pure, route-derived social preview contract for the shareable project, writing, and theme route families. This phase defines target derivation, data shape, path/fingerprint rules, validation, and generic-route fallback behavior only. Raster generation, metadata wiring, freshness reports, and release-gate integration remain in later v1.5 phases.

</domain>

<decisions>
## Implementation Decisions

### Route Coverage and Public Filtering
- **D-01:** Add a pure domain module, expected as `src/domain/social-previews.ts`, as the single source of truth for v1.5 share targets.
- **D-02:** The target helper must cover `/projects`, every `projectDetailRoutes()` selected detail route, `/writing`, every `writingDetailRoutes()` public detail route, `/themes`, and every `themeDetailRoutes()` public detail route.
- **D-03:** Target derivation must compose existing helpers instead of duplicating route arrays: `routeByPath` or `siteRoutes` for route-family index records, `projectDetailPageProjects` and `projectDetailPath` for selected project detail pages, `publicWritingEntries` and `writingDetailPath` for writing, and `publicThemeEntries` and `themeDetailPath` for themes.
- **D-04:** Hidden, draft, unsupported, archived, excluded, unselected, no-detail, and otherwise non-public records must be filtered by the existing public helpers. The social preview module should not invent broader visibility rules.

### Target Shape
- **D-05:** Expose a typed `SocialPreviewTarget`-style record with route path, local asset path, title, description, route kind or kicker, labels, route-specific alt text, dimensions, and stable source fingerprint.
- **D-06:** Use explicit route kinds for the contract, expected as `projects-index`, `project`, `writing-index`, `writing`, `themes-index`, and `theme`. Unsupported kinds should fail validation.
- **D-07:** Keep labels short and route-derived. Project targets can use themes/tags/status, writing targets can use kind/topics/tags, theme targets can use audience/proof-point framing, and index targets can use route labels from `siteRoutes`.
- **D-08:** Alt text must be route-specific and descriptive enough to stand on its own in metadata. It must not reuse one generic portfolio fallback string for covered routes.

### Asset Paths and Fingerprints
- **D-09:** Covered-route asset paths should be local, absolute web paths under `/social/generated/`, grouped by route family, for example `/social/generated/projects/openlinks-{digest}.png`, `/social/generated/writing/{slug}-{digest}.png`, and `/social/generated/themes/{slug}-{digest}.png`.
- **D-10:** Use a short deterministic digest derived from the route source payload for cache busting and drift detection. The same source data should produce the same fingerprint and path, while title/description/label/alt changes should change the fingerprint.
- **D-11:** The fingerprint payload should be stable and sorted before hashing so target output does not depend on object insertion order or runtime randomness.
- **D-12:** This phase should not write PNGs or manifests. It should only define the expected paths and fingerprints that Phase 25 will generate from.

### Text Budgets and Validation
- **D-13:** Validation should reject duplicate route paths, duplicate asset paths, missing required text, unsupported route kinds, non-local or non-generated asset paths for covered targets, unsafe path characters, wrong dimensions, and text that exceeds template budgets.
- **D-14:** Use conservative template budgets in the domain contract now so generation cannot silently crop later: non-empty title, description, kicker, labels, and alt text; bounded labels; bounded description; bounded title; and a maximum unbroken-token length to catch impossible wrapping.
- **D-15:** Keep dimensions fixed at 1200x630 for every covered target unless a later implementation phase discovers a compelling crawler/template reason and updates all metadata and verification together.
- **D-16:** Validation should return structured findings suitable for unit tests and future report/verifier consumption, rather than throwing from normal list helpers.

### Fallback Behavior
- **D-17:** Generic routes outside the Phase 24 target set, including `/`, `/about`, `/contact`, unknown route fallbacks, and future non-covered generic routes, keep the checked-in fallback `/social/bright-builds-og.png`.
- **D-18:** The contract may expose a named fallback social image value for later SEO integration, but fallback routes should not be included in the route-specific target list.
- **D-19:** OpenLinks remains low-intrusion identity context. Only OpenLinks-specific routes should produce OpenLinks-specific labels or copy; the generic fallback and unrelated route targets should keep Bright Builds/Peter Ryszkiewicz as the primary brand.

### the agent's Discretion
- Exact TypeScript type names, helper names, finding-code names, and budget constants are delegated to implementation as long as they remain clear, exported where tests need them, and aligned with existing `maybe` naming and functional-core patterns.
- Exact digest length is delegated to implementation, with a preference for a short readable hex digest that is long enough to avoid practical collisions in this small route set.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Scope
- `.planning/ROADMAP.md` — Phase 24 goal, requirements, dependencies, and success criteria.
- `.planning/REQUIREMENTS.md` — SHARE-01 through SHARE-05 acceptance requirements.
- `.planning/research/SUMMARY.md` — v1.5 architecture direction, stack additions, watch outs, and Phase 24 recommendation.
- `.planning/research/FEATURES.md` — Route-derived social image data behavior, validation, and fallback expectations.
- `.planning/research/ARCHITECTURE.md` — Functional-core social preview layer recommendation and integration points.

### Existing Domain Contracts
- `src/domain/projects.ts` — Curated project visibility, selected detail pages, project detail paths, and project detail routes.
- `src/domain/writing.ts` — Public writing visibility, writing detail paths, and writing detail routes.
- `src/domain/themes.ts` — Public theme visibility, theme detail paths, and theme detail routes.
- `src/domain/routes.ts` — Top-level site route records, route lookup, prerender route composition, and sitemap route composition.
- `src/domain/seo.ts` — Current fallback social image metadata model and later metadata integration surface.

### Existing Verification Context
- `src/domain/project-detail-routes.test.ts` — Project detail route selection, public filtering, and current fallback metadata expectations.
- `src/domain/writing.test.ts` — Writing public filtering and route derivation patterns.
- `src/domain/themes.test.ts` — Theme public filtering and route derivation patterns.
- `src/domain/writing-metadata.test.ts` — Writing/theme metadata and JSON-LD image expectations to update in later phases.
- `scripts/verify-static/metadata-jsonld-verifier.ts` — Static metadata asset mapping that later phases will extend beyond the fallback.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `projectDetailPageProjects`, `projectDetailPath`, and `projectDetailRoutes` already encode the selected project detail route contract and exclude unselected public projects such as `/projects/open-bitcoin`.
- `publicWritingEntries`, `writingDetailPath`, and `writingDetailRoutes` already encode published-only writing routes.
- `publicThemeEntries`, `themeDetailPath`, and `themeDetailRoutes` already encode public-only theme routes and exclude draft, hidden, unsupported, and archived themes.
- `routeByPath`, `siteRoutes`, `prerenderRoutes`, and `sitemapRoutes` already show the route-helper pattern expected for index and generated static route coverage.
- `SocialImageMetadata` and the fallback `socialImageForProfile` pattern in `src/domain/seo.ts` show the metadata shape that later phases will make route-aware.

### Established Patterns
- Domain helpers are pure data-in/data-out functions with optional fixture arrays in tests.
- Visibility filtering belongs in existing public helper functions, while downstream helpers compose those helpers.
- Tests use Vitest with Arrange/Act/Assert comments and focused behavior cases.
- Route and metadata verification prefer helper-derived expected values over hard-coded route arrays.

### Integration Points
- Phase 24 should add unit tests near the domain layer, likely `src/domain/social-previews.test.ts`.
- Later Phase 25 generation scripts should consume this contract instead of deriving paths independently.
- Later Phase 26 metadata wiring should resolve covered route images from this contract and use the fallback for generic routes.
- Later static and release verifiers should consume this contract/manifest rather than maintaining separate slug fixtures.

</code_context>

<specifics>
## Specific Ideas

- Keep the module boring and testable: no filesystem access, no runtime network access, no date calls, no image rendering, and no Solid/SolidStart imports.
- Prefer route-family grouping and digest-backed file names over a hand-authored route-to-image map.
- Treat fallback behavior as explicit contract data so later metadata work does not accidentally force route-specific generated images onto generic pages.

</specifics>

<deferred>
## Deferred Ideas

- Rendering SVG/PNG previews, adding `@resvg/resvg-js`, writing generated assets, and creating the image manifest are Phase 25 work.
- Wiring Open Graph, Twitter, and JSON-LD image references to generated assets is Phase 26 work.
- Freshness reports and reviewed snapshot policy are Phase 27 work.
- Aggregate release verification and release-readiness documentation updates are Phase 28 work.

</deferred>

---

*Phase: 24-social-image-data-contract*
*Context gathered: 2026-06-21*
