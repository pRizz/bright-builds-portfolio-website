---
generated_by: gsd-discuss-phase
lifecycle_mode: yolo
phase_lifecycle_id: 25-2026-06-21T16-03-23
generated_at: 2026-06-21T16:05:18.226Z
---

# Phase 25: Deterministic Static Image Generation - Context

**Gathered:** 2026-06-21
**Status:** Ready for planning
**Mode:** Yolo

<domain>
## Phase Boundary

Generate deterministic 1200x630 PNG social preview assets and a timestamp-free manifest for every `socialPreviewTargets()` record from Phase 24. This phase owns the local renderer, checked-in templates/assets, generated files under the managed static asset directory, and check-mode verification. Metadata wiring, JSON-LD wiring, freshness reports, and broader release evidence updates remain later v1.5 phases.

</domain>

<decisions>
## Implementation Decisions

### Renderer and Template Inputs
- **D-01:** Use a Bun/TypeScript generator script, expected as `scripts/generate-social-previews.ts`, rather than a browser screenshot workflow, dynamic OG endpoint, Python script, hosted service, or visitor-runtime generator.
- **D-02:** Add `@resvg/resvg-js@2.6.2` as the narrow SVG-to-PNG dev dependency recommended by the milestone research.
- **D-03:** Render repo-owned SVG templates to PNG with deterministic template data from `socialPreviewTargets()`.
- **D-04:** Template inputs must be checked in and local. Do not fetch remote images, remote fonts, screenshots, current time, randomness, secrets, runtime services, or host fonts.
- **D-05:** Keep the visual system dark-primary, readable at thumbnail size, and route-aware without adding OpenLinks prominence beyond route-specific OpenLinks content.

### Generated Asset Ownership
- **D-06:** Generated PNGs must write only under `public/social/generated/` using the asset paths already returned by the Phase 24 social preview contract.
- **D-07:** Managed cleanup may remove stale files inside `public/social/generated/` but must never delete or overwrite `public/social/bright-builds-og.png`, icons, sitemap, robots, or unrelated public assets.
- **D-08:** Generated route-family paths and source fingerprints remain helper-derived. Do not add a hand-authored route-to-image map or copied route array.
- **D-09:** Generated PNG files should be checked in so static deploys serve already-reviewed assets and do not rasterize at visitor runtime.

### Manifest and Check Mode
- **D-10:** Write a timestamp-free manifest, expected under `public/social/generated/`, with route path, asset path, dimensions, byte size, source fingerprint, and SHA-256 file checksum for every generated preview.
- **D-11:** The manifest should be deterministically sorted by route or asset path so repeated generation produces stable diffs.
- **D-12:** Add a check mode, expected as `bun run verify:social-previews`, that fails for missing images, stale fingerprints, wrong dimensions, oversized files, blank images, orphaned managed PNGs, manifest drift, and non-deterministic regeneration.
- **D-13:** Add or reuse unit tests for pure manifest/check logic. Keep filesystem and rasterization in a thin script shell.

### Integration With Existing Verification
- **D-14:** Add package scripts for `generate:social-previews` and `verify:social-previews`.
- **D-15:** Wire deterministic social preview verification into the aggregate `bun run verify` before production build.
- **D-16:** Reuse `validateSocialPreviewTargets()` before rendering so data-contract failures stop generation early.
- **D-17:** Keep Phase 26 metadata wiring out of scope. Existing route metadata may still point at the fallback until the next phase changes it.

### the agent's Discretion
- Exact SVG composition, helper names, manifest filename, finding code names, and layout math are delegated to implementation as long as the output is deterministic, readable, local, and covered by tests.
- A contact sheet or review artifact is optional only if it stays cheap and does not distract from the required manifest/check mode.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Scope
- `.planning/ROADMAP.md` - Phase 25 goal, dependency on Phase 24, requirements, and success criteria.
- `.planning/REQUIREMENTS.md` - IMAGE-01 through IMAGE-05 acceptance requirements and v1.5 out-of-scope boundaries.
- `.planning/phases/24-social-image-data-contract/24-CONTEXT.md` - Locked route coverage, asset path, fingerprint, validation, and fallback decisions from Phase 24.
- `.planning/phases/24-social-image-data-contract/24-01-SUMMARY.md` - Implemented Phase 24 helper surface and next-phase readiness.

### Milestone Research
- `.planning/research/SUMMARY.md` - Recommended v1.5 architecture, dependency choice, phase 25 deliverables, and watch-outs.
- `.planning/research/STACK.md` - `@resvg/resvg-js@2.6.2` recommendation, rejected alternatives, manifest fields, and generator verification notes.
- `.planning/research/FEATURES.md` - Feature expectations for deterministic raster assets, manifest, and check mode.
- `.planning/research/ARCHITECTURE.md` - Functional-core/imperative-shell integration points, managed output directory, and future metadata wiring boundaries.
- `.planning/research/PITFALLS.md` - Nondeterministic asset, duplicated route list, dynamic OG, bloat, and reviewability pitfalls.

### Existing Code Contracts
- `src/domain/social-previews.ts` - Source of truth for social preview targets, dimensions, generated asset paths, fingerprints, fallback image, and validation findings.
- `src/domain/social-previews.test.ts` - Existing route coverage, public filtering, target shape, fallback behavior, fingerprint, and validation test patterns.
- `scripts/verify-static/output.ts` - Existing PNG dimension parsing helper and static output file assertions.
- `scripts/verify-static/sitemap-assets-verifier.ts` - Existing fallback social image and public asset verification surface.
- `scripts/verify-release.ts` - Existing release budget pattern for social PNG assets.
- `package.json` - Existing Bun scripts and aggregate `verify` entrypoint.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `socialPreviewTargets()` returns every covered route target with route path, asset path, dimensions, title, description, labels, alt text, and source fingerprint.
- `validateSocialPreviewTargets()` already reports invalid target data and should run before rendering.
- `SOCIAL_PREVIEW_DIMENSIONS` fixes every generated preview at 1200x630.
- `SOCIAL_PREVIEW_FALLBACK_IMAGE` preserves the existing fallback and should remain outside managed cleanup.
- `assertPngDimensions()` in `scripts/verify-static/output.ts` can inform PNG dimension checks for generated assets.

### Established Patterns
- Domain logic is pure and covered by Vitest; scripts are thin Bun/TypeScript shells.
- Verification scripts return explicit errors and favor helper-derived expectations over copied route arrays.
- Tests use Arrange, Act, Assert comments for non-trivial cases.
- Static assets under `public/` are copied into `.output/public` by the SolidStart build.

### Integration Points
- Add generator/check logic near `scripts/` and keep pure manifest/check helpers testable.
- Add generated files under `public/social/generated/`.
- Update `package.json` scripts and `bun.lock` for the new renderer dependency.
- Later phases will consume the generated manifest and asset paths for metadata, freshness, and release evidence.

</code_context>

<specifics>
## Specific Ideas

- Prefer a compact SVG template with route kind/kicker, title, description, short labels, and Bright Builds/Peter identity cues.
- The generated manifest diff should be useful in code review without requiring manual binary inspection for every change.
- The check mode should be strict enough that running generation twice on the same checkout produces no git diff.

</specifics>

<deferred>
## Deferred Ideas

- Route-specific Open Graph, Twitter, and JSON-LD metadata wiring is Phase 26.
- Freshness reports over generated media and curated data are Phase 27.
- Expanded release-readiness documentation, release evidence labels, and aggregate static metadata verification are Phase 28 unless needed as a narrow Phase 25 script hook.
- Public gallery/review UI for social cards is future work unless a cheap local-only artifact falls out naturally.

</deferred>

---

*Phase: 25-deterministic-static-image-generation*
*Context gathered: 2026-06-21*
