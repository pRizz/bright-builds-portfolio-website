---
generated_by: gsd-discuss-phase
lifecycle_mode: yolo
phase_lifecycle_id: 26-2026-06-21T21-29-16
generated_at: 2026-06-21T21:31:28.459Z
---

# Phase 26: Metadata Wiring and Static References - Context

**Gathered:** 2026-06-21
**Status:** Ready for planning
**Mode:** Yolo

<domain>
## Phase Boundary

Wire project, writing, theme, and covered route-family index metadata to the deterministic static social preview assets generated from the Phase 24/25 contract. This phase owns helper-derived Open Graph, Twitter, and JSON-LD image selection plus static verification updates for those metadata references. It must keep home, about, contact, and other generic routes on the existing fallback image. Freshness reports and broader release contract expansion remain later v1.5 phases.

</domain>

<decisions>
## Implementation Decisions

### Metadata Image Resolution
- **D-01:** Add or refactor a pure SEO/domain helper so covered route paths resolve through `maybeSocialPreviewTargetForRoutePath()` and generic routes resolve through `SOCIAL_PREVIEW_FALLBACK_IMAGE`.
- **D-02:** Covered route-family indexes are `/projects`, `/writing`, and `/themes`; covered detail routes are selected project detail routes, public writing detail routes, and public theme detail routes from the existing helper-derived route sets.
- **D-03:** Metadata image URLs must be canonical absolute URLs built from `profile.canonicalOrigin` plus the helper-derived asset path. Route files must continue to consume domain metadata helpers rather than hard-code generated image paths.
- **D-04:** Keep home, about, contact, not-found/fallback surfaces, and future generic routes outside the Phase 24 target set on `/social/bright-builds-og.png`.
- **D-05:** Preserve the OpenLinks identity posture already emitted through profile links and `Person.sameAs`. Do not make OpenLinks a primary brand in generic social images or metadata.

### Open Graph and Twitter Output
- **D-06:** For every covered route, `openGraph.image` and `twitter.image` must point to the same route-specific generated image metadata.
- **D-07:** Emit `og:image:type` as `image/png` for both generated social previews and the fallback image, alongside the existing `og:image`, width, height, and alt tags.
- **D-08:** Use route-specific alt text from the social preview contract for covered routes; use the fallback alt text for generic routes.
- **D-09:** Keep the existing `summary_large_image` Twitter card behavior.

### Structured Data Image Parity
- **D-10:** Add `image` to project detail `SoftwareSourceCode` JSON-LD and set it to the same route-specific asset used by the page's Open Graph and Twitter metadata.
- **D-11:** Update writing `BlogPosting` JSON-LD and writing item-list entries to use the same route-specific image asset as writing metadata.
- **D-12:** Update theme `CollectionPage` JSON-LD to use the same route-specific image asset as theme metadata.
- **D-13:** Route-family index ItemList JSON-LD can remain focused on linked items unless a field already has an image contract; the required JSON-LD parity applies to project, writing, and theme detail records.

### Static Verification
- **D-14:** Update static metadata verification to accept and require generated local assets for covered routes while still requiring the fallback for generic routes.
- **D-15:** Static verification should assert generated image paths map to checked-in output assets, preserve canonical origin checks, and verify JSON-LD image parity for project, writing, and theme detail routes.
- **D-16:** Tests should prove metadata selection, fallback preservation, JSON-LD image parity, and `og:image:type` output without duplicating route-to-asset maps.

### the agent's Discretion
- Exact helper names and small type reshapes are delegated to implementation as long as the result stays pure, route-helper-derived, and compatible with existing route components.
- Whether to centralize repeated head tag rendering is delegated to implementation; prefer a focused helper only if it reduces real duplication without expanding scope.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Scope
- `.planning/ROADMAP.md` - Phase 26 goal, dependency on Phase 25, requirements, and success criteria.
- `.planning/REQUIREMENTS.md` - META-01 through META-05 acceptance requirements and v1.5 out-of-scope boundaries.
- `.planning/phases/24-social-image-data-contract/24-CONTEXT.md` - Locked social preview target coverage, fallback behavior, route kind, asset path, and alt text decisions.
- `.planning/phases/24-social-image-data-contract/24-01-SUMMARY.md` - Implemented social preview helper surface and validation behavior.
- `.planning/phases/25-deterministic-static-image-generation/25-CONTEXT.md` - Locked generator, manifest, and verification boundaries.
- `.planning/phases/25-deterministic-static-image-generation/25-03-SUMMARY.md` - Generated asset and manifest completion details.

### Existing Code Contracts
- `src/domain/social-previews.ts` - Source of truth for route-specific social preview targets, fallback image data, dimensions, asset paths, and `maybeSocialPreviewTargetForRoutePath()`.
- `src/domain/seo.ts` - Current metadata and JSON-LD helper surface that must become route-image-aware.
- `src/domain/project-detail-routes.test.ts` - Project detail metadata and JSON-LD behavior expectations.
- `src/domain/writing-metadata.test.ts` - Writing and theme metadata, JSON-LD, and fallback expectations to update.
- `src/domain/foundation.test.ts` - Route metadata and profile identity coverage.
- `scripts/verify-static/metadata-jsonld-verifier.ts` - Static HTML metadata and JSON-LD verification surface to update for generated assets.
- `public/social/generated/manifest.json` - Generated social preview manifest from Phase 25.
- `package.json` - Existing aggregate verification order and `verify:social-previews` script.

### Identity Guidance
- `AGENTS.bright-builds.md` - Owner-specific OpenLinks identity rule for metadata surfaces.
- `AGENTS.md` - Repo-local dark-primary and static portfolio constraints.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `maybeSocialPreviewTargetForRoutePath()` already returns a route-specific target or `null`.
- `SOCIAL_PREVIEW_FALLBACK_IMAGE` already exposes fallback asset path, alt text, and dimensions.
- `metadataForRoute`, `metadataForProject`, `metadataForWritingEntry`, and `metadataForTheme` are the current helper entrypoints consumed by route files.
- `projectJsonLd`, `writingBlogPostingJsonLd`, `writingItemListJsonLd`, and `themeCollectionPageJsonLd` are the JSON-LD surfaces that need image parity.
- `assertMetadataImageMapsToLocalAsset()` currently enforces fallback-only image URLs and is the key static verification update point.

### Established Patterns
- Domain metadata helpers are pure and consume profile/domain records directly.
- Route components already render metadata before page content through `@solidjs/meta`.
- Static verification derives expected metadata from the same domain helpers that route components use.
- Tests use Vitest with Arrange, Act, Assert comments for non-trivial cases.

### Integration Points
- Update `src/domain/seo.ts` first so route components pick up generated images without route-level hard-coding.
- Add focused domain tests for route-specific metadata and fallback behavior before or alongside implementation.
- Update static verifier expectations after domain metadata changes so `bun run verify:static` checks generated HTML against the new contract.

</code_context>

<specifics>
## Specific Ideas

- Prefer one small image-selection helper that accepts a route path and profile, returns a `SocialImageMetadata`, and hides fallback-vs-generated branching from callers.
- Use route paths already computed by `projectDetailPath`, `writingDetailPath`, and `themeDetailPath` to avoid duplicate route strings.
- Treat `og:image:type` as a tiny head-tag addition across existing route heads rather than a new metadata subsystem unless implementation reveals a clean local abstraction.

</specifics>

<deferred>
## Deferred Ideas

- Freshness reports over generated media, metadata snapshot age, HTTPS policy, and manual smoke targets remain Phase 27.
- Aggregate static output expansion, evidence labels, budgets, and release-readiness documentation remain Phase 28 unless a narrow test update is needed to keep Phase 26 verification truthful.
- Route-specific previews for home, about, contact, and other generic routes remain future work.

</deferred>

---

*Phase: 26-metadata-wiring-and-static-references*
*Context gathered: 2026-06-21*
