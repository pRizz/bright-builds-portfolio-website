# Phase 26: Metadata Wiring and Static References - Research

**Researched:** 2026-06-21
**Domain:** SolidStart static SEO metadata, Open Graph/Twitter image tags, JSON-LD image parity, and static output verification
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

Source for this locked constraints block: [VERIFIED: .planning/phases/26-metadata-wiring-and-static-references/26-CONTEXT.md]

### Locked Decisions

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

### Deferred Ideas (OUT OF SCOPE)
- Freshness reports over generated media, metadata snapshot age, HTTPS policy, and manual smoke targets remain Phase 27.
- Aggregate static output expansion, evidence labels, budgets, and release-readiness documentation remain Phase 28 unless a narrow test update is needed to keep Phase 26 verification truthful.
- Route-specific previews for home, about, contact, and other generic routes remain future work.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| META-01 | Project, writing, theme, and route-family index metadata select route-specific social preview images from the same social preview helper used by the generator. | Use a pure `seo.ts` image resolver around `maybeSocialPreviewTargetForRoutePath()` and `SOCIAL_PREVIEW_FALLBACK_IMAGE`. [VERIFIED: src/domain/social-previews.ts] [VERIFIED: src/domain/seo.ts] |
| META-02 | Generated HTML exposes absolute canonical `og:image`, `og:image:type`, `og:image:width`, `og:image:height`, `og:image:alt`, `twitter:image`, and `twitter:image:alt` values for every covered share route before hydration. | Extend `SocialImageMetadata` with a PNG MIME value and add one `og:image:type` tag beside existing image tags in route heads. [VERIFIED: src/domain/seo.ts] [CITED: https://ogp.me/] |
| META-03 | Project, writing, and theme JSON-LD `image` values use the same route-specific social preview asset as the corresponding Open Graph and Twitter metadata. | Reuse the same route-path image resolver inside `projectJsonLd`, `writingBlogPostingItemJsonLd`, and `themeCollectionPageJsonLd`. [VERIFIED: src/domain/seo.ts] [CITED: https://schema.org/image] |
| META-04 | Home, about, contact, and other generic routes continue to use the checked-in fallback social image until a future milestone deliberately scopes route-specific images for them. | Keep `metadataForRoute` fallback behavior for routes where `maybeSocialPreviewTargetForRoutePath(route.path)` returns `null`. [VERIFIED: src/domain/social-previews.test.ts] [VERIFIED: src/domain/routes.ts] |
| META-05 | Route components do not hard-code social image metadata; metadata and structured data continue to derive from domain helpers. | Keep route components consuming `PageMetadata` and JSON-LD helpers; only add rendering of helper-derived `og:image:type`. [VERIFIED: src/routes/projects/index.tsx] [VERIFIED: src/routes/writing/index.tsx] [VERIFIED: src/routes/themes/[slug].tsx] |
</phase_requirements>

## Project Constraints (from AGENTS.md)

- Use `AGENTS.md` as the repo-local instruction entrypoint, then `AGENTS.bright-builds.md`, `standards-overrides.md`, and relevant pages under `standards/` before planning or implementation. [VERIFIED: AGENTS.md] [VERIFIED: AGENTS.bright-builds.md]
- Keep Bright Builds repo-specific generated-file and verification facts in local guidance instead of editing managed Bright Builds Rules text. [VERIFIED: AGENTS.md] [VERIFIED: AGENTS.bright-builds.md]
- Follow functional-core / imperative-shell structure: business decisions should live in pure data-in/data-out functions and framework or filesystem work should stay in thin shells. [VERIFIED: standards/core/architecture.md] [VERIFIED: standards/languages/typescript-javascript.md]
- Unit-test pure domain logic, keep tests focused on one concern, and use Arrange/Act/Assert comments for non-trivial tests. [VERIFIED: standards/core/testing.md] [VERIFIED: standards/languages/typescript-javascript.md]
- Prefer Bun as the established TypeScript script surface and do not add Python scripts for repo-owned automation. [VERIFIED: standards/languages/typescript-javascript.md] [VERIFIED: package.json]
- Run repo-native verification before committing changed code; the aggregate gate is `bun run verify`. [VERIFIED: standards/core/verification.md] [VERIFIED: package.json]
- Preserve the dark-primary site posture; this phase is metadata-only unless implementation unexpectedly touches rendered UI. [VERIFIED: AGENTS.md] [VERIFIED: .planning/phases/26-metadata-wiring-and-static-references/26-CONTEXT.md]
- Preserve OpenLinks as low-intrusion identity metadata through `Person.sameAs` and visible/profile links; do not promote OpenLinks as the primary Bright Builds brand in generic metadata. [VERIFIED: AGENTS.bright-builds.md] [CITED: /Users/peterryszkiewicz/.codex/skills/openlinks-identity-presence/SKILL.md]
- No project-local skills exist under `.claude/skills/` or `.agents/skills/`. [VERIFIED: find .claude/skills .agents/skills]
- `workflow.nyquist_validation` is `false`, so the research omits the Validation Architecture section. [VERIFIED: .planning/config.json]
- `security_enforcement` is absent from `.planning/config.json`; per GSD defaults, include the Security Domain section. [VERIFIED: .planning/config.json]

## Summary

Phase 26 should be planned as a narrow domain-helper wiring phase, not as a route refactor or a metadata subsystem rewrite. [VERIFIED: .planning/phases/26-metadata-wiring-and-static-references/26-CONTEXT.md] The existing social preview contract already exposes `maybeSocialPreviewTargetForRoutePath()`, route-specific asset paths, dimensions, alt text, and the fallback image contract. [VERIFIED: src/domain/social-previews.ts] The existing SEO helper surface already centralizes route, project, writing, theme, and JSON-LD metadata enough that route files can pick up most behavior without hard-coded image paths. [VERIFIED: src/domain/seo.ts] [VERIFIED: src/routes/projects/[slug].tsx] [VERIFIED: src/routes/writing/[slug].tsx]

The highest-leverage implementation is one pure helper in `src/domain/seo.ts` that takes a route path and profile, resolves a `SocialImageMetadata` from `maybeSocialPreviewTargetForRoutePath()`, and falls back to `SOCIAL_PREVIEW_FALLBACK_IMAGE`. [VERIFIED: src/domain/social-previews.ts] That helper should return absolute canonical URLs, dimensions, alt text, and a PNG MIME type for `og:image:type`. [VERIFIED: .planning/phases/26-metadata-wiring-and-static-references/26-CONTEXT.md] [CITED: https://ogp.me/] Use that same helper in `metadataForRoute`, `metadataForProject`, `metadataForWritingEntry`, `metadataForTheme`, `projectJsonLd`, `writingBlogPostingItemJsonLd`, and `themeCollectionPageJsonLd`. [VERIFIED: src/domain/seo.ts]

Static verification should become route-aware instead of fallback-only. [VERIFIED: scripts/verify-static/metadata-jsonld-verifier.ts] It should check canonical origin, expected generated-or-fallback asset path for each route, local output file existence, PNG dimensions, `og:image:type`, Twitter parity, and JSON-LD image parity for detail records. [VERIFIED: scripts/verify-static/output.ts] [VERIFIED: .planning/phases/26-metadata-wiring-and-static-references/26-CONTEXT.md]

**Primary recommendation:** Plan one domain-first wave for `seo.ts` plus focused unit tests, then one route/static-verifier wave for `og:image:type` rendering and generated HTML verification. [VERIFIED: src/domain/seo.ts] [VERIFIED: scripts/verify-static/metadata-jsonld-verifier.ts]

## Standard Stack

### Core
| Library / Module | Version | Purpose | Why Standard |
|------------------|---------|---------|--------------|
| `@solidjs/meta` | `0.29.4` pinned; npm latest `0.29.4` modified 2026-03-17 | Render route `<Title>`, `<Meta>`, and `<Link>` tags | SolidStart docs recommend `@solidjs/meta` for head metadata, and current route files already use it. [VERIFIED: package.json] [VERIFIED: npm registry] [CITED: https://docs.solidjs.com/solid-start/building-your-application/head-and-metadata] |
| `@solidjs/start` / SolidStart | `1.3.2` pinned; npm latest `1.3.2` modified 2026-06-12 | Static app framework and prerendered HTML output | Existing build and route components are SolidStart-based; no phase requirement needs framework changes. [VERIFIED: package.json] [VERIFIED: npm registry] [CITED: https://docs.solidjs.com/solid-start/building-your-application/head-and-metadata] |
| `solid-js` | `1.9.13` pinned; npm latest `1.9.13` modified 2026-05-19 | Component rendering and `Show`/`For` route head patterns | Existing route files use Solid components and control flow; keep the current stack. [VERIFIED: package.json] [VERIFIED: npm registry] |
| `src/domain/social-previews.ts` | repo module | Source of truth for covered routes, generated asset paths, fallback, dimensions, and alt text | Phase 24/25 made this helper the generator contract; Phase 26 must reuse it. [VERIFIED: src/domain/social-previews.ts] [VERIFIED: .planning/phases/24-social-image-data-contract/24-01-SUMMARY.md] |
| `src/domain/seo.ts` | repo module | Source of truth for page metadata, canonical URLs, social image metadata, and JSON-LD | Current route files consume this helper surface; Phase 26 should change this layer first. [VERIFIED: src/domain/seo.ts] [VERIFIED: .planning/phases/26-metadata-wiring-and-static-references/26-CONTEXT.md] |
| `public/social/generated/manifest.json` | version `1`, 13 entries | Checked-in generated preview inventory from Phase 25 | Generated files already exist for every current social preview target. [VERIFIED: public/social/generated/manifest.json] [VERIFIED: .planning/phases/25-deterministic-static-image-generation/25-03-SUMMARY.md] |

### Supporting
| Library / Tool | Version | Purpose | When to Use |
|----------------|---------|---------|-------------|
| Bun | `packageManager: bun@1.3.14`; local `bun --version` is `1.3.9` | Run scripts, tests, build, and verification | Use existing `bun run` scripts; only upgrade local Bun if verification fails because of the version mismatch. [VERIFIED: package.json] [VERIFIED: local command] |
| TypeScript | `6.0.3` pinned; npm latest `6.0.3` modified 2026-06-18 | Type-check metadata and JSON-LD helper shape changes | Run `bun run typecheck` after changing helper return types. [VERIFIED: package.json] [VERIFIED: npm registry] |
| Vitest | `4.1.7` pinned; npm latest `4.1.9` modified 2026-06-15 | Unit-test pure helper behavior | Use focused domain and verifier tests; do not upgrade for this phase. [VERIFIED: package.json] [VERIFIED: npm registry] |
| Biome | `2.4.15` pinned; npm latest `2.5.0` modified 2026-06-12 | Format/lint TS and TSX changes | Use existing `bun run format:check` and `bun run check`; do not update dependency pins for metadata wiring. [VERIFIED: package.json] [VERIFIED: npm registry] |
| `@resvg/resvg-js` | `2.6.2` pinned; npm latest `2.6.2` modified 2026-01-28 | Existing deterministic image generation check path | Phase 26 should not render images, but `verify:social-previews` remains part of aggregate verification. [VERIFIED: package.json] [VERIFIED: npm registry] |
| Playwright | `@playwright/test@1.60.0` pinned; npm latest `1.61.0` modified 2026-06-21 | Existing browser verification in aggregate gate | Phase 26 does not need new browser tests unless implementation touches visible UI. [VERIFIED: package.json] [VERIFIED: npm registry] |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Pure `seo.ts` route-path resolver | Hard-coded route-to-image map in route files | Reject: violates META-05 and duplicates Phase 24 route helpers. [VERIFIED: .planning/REQUIREMENTS.md] [VERIFIED: src/domain/social-previews.ts] |
| Existing `@solidjs/meta` route head rendering | New metadata library or head manager | Reject: SolidStart docs and current route files already use `@solidjs/meta`; new dependency adds no value. [VERIFIED: package.json] [CITED: https://docs.solidjs.com/solid-start/building-your-application/head-and-metadata] |
| JSON-LD `image` as URL string | Full `ImageObject` with width/height | Use URL string now: Schema.org accepts URL for `image`, and existing repo JSON-LD uses compact URL strings. [CITED: https://schema.org/image] [VERIFIED: src/domain/seo.ts] |
| Static generated PNG files | Dynamic OG endpoint or hosted screenshot service | Reject: v1.5 explicitly excludes dynamic OG endpoints, server functions, and remote image generation. [VERIFIED: .planning/REQUIREMENTS.md] |

**Installation:**
```bash
# No new packages are needed for Phase 26.
```
[VERIFIED: package.json] [VERIFIED: .planning/phases/26-metadata-wiring-and-static-references/26-CONTEXT.md]

**Version verification:** package versions above were checked with `npm view <package> version time.modified --json` on 2026-06-21. [VERIFIED: npm registry]

## Architecture Patterns

### Recommended Project Structure
```text
src/domain/
├── seo.ts                         # add route-aware social image resolver and JSON-LD parity
├── social-previews.ts             # existing source of truth for covered routes and fallback
├── project-detail-routes.test.ts  # update project metadata/JSON-LD tests
├── writing-metadata.test.ts       # update writing/theme metadata and JSON-LD tests
└── foundation.test.ts             # preserve generic route fallback coverage

src/routes/
├── projects/                      # add helper-derived og:image:type tag where metadata is rendered
├── writing/                       # add helper-derived og:image:type tag where metadata is rendered
├── themes/                        # add helper-derived og:image:type tag where metadata is rendered
├── index.tsx                      # preserve fallback metadata for home
├── about.tsx                      # preserve fallback metadata for about
└── contact.tsx                    # preserve fallback metadata for contact

scripts/verify-static/
├── metadata-jsonld-verifier.ts    # make metadata image checks route-aware
└── output.ts                      # reuse PNG existence/dimension helpers
```
[VERIFIED: src/domain/seo.ts] [VERIFIED: scripts/verify-static/metadata-jsonld-verifier.ts] [VERIFIED: scripts/verify-static/output.ts]

### Pattern 1: Pure Route-Path Social Image Resolver
**What:** Add a pure helper in `seo.ts` that turns a route path plus profile into one complete `SocialImageMetadata` record. [VERIFIED: src/domain/seo.ts] [VERIFIED: src/domain/social-previews.ts]

**When to use:** Use it anywhere metadata or JSON-LD needs the share image for a known route path. [VERIFIED: .planning/phases/26-metadata-wiring-and-static-references/26-CONTEXT.md]

**Example:**
```typescript
// Source: src/domain/social-previews.ts and Phase 26 D-01 through D-08.
function socialImageForRoutePath(routePath: string, profile: Profile): SocialImageMetadata {
  const maybeTarget = maybeSocialPreviewTargetForRoutePath(routePath);
  const image = maybeTarget ?? SOCIAL_PREVIEW_FALLBACK_IMAGE;

  return {
    url: `${profile.canonicalOrigin}${image.assetPath}`,
    width: image.dimensions.width,
    height: image.dimensions.height,
    alt: image.alt,
    mimeType: "image/png",
  };
}
```
[VERIFIED: src/domain/social-previews.ts] [VERIFIED: .planning/phases/26-metadata-wiring-and-static-references/26-CONTEXT.md] [CITED: https://ogp.me/]

### Pattern 2: Metadata Entry Points Pass Their Canonical Route Path
**What:** Keep the four existing metadata entrypoints, but compute social image metadata from the route path they already know. [VERIFIED: src/domain/seo.ts]

**When to use:** Use this pattern for `metadataForRoute`, `metadataForProject`, `metadataForWritingEntry`, and `metadataForTheme`. [VERIFIED: src/domain/seo.ts]

**Example:**
```typescript
// Source: src/domain/seo.ts and src/domain/social-previews.ts.
export function metadataForProject(
  project: ProjectStory,
  profile: Profile = peterProfile,
): PageMetadata {
  const routePath = projectDetailPath(project);
  const canonical = `${profile.canonicalOrigin}${routePath}`;
  const title = `${project.name} | Project Story | Bright Builds`;
  const description = project.oneLine;
  const socialImage = socialImageForRoutePath(routePath, profile);

  return {
    title,
    description,
    canonical,
    openGraph: { title, description, url: canonical, type: "website", image: socialImage },
    twitter: { card: "summary_large_image", title, description, image: socialImage },
  };
}
```
[VERIFIED: src/domain/seo.ts] [VERIFIED: src/domain/projects.ts]

### Pattern 3: JSON-LD Image Parity Reuses the Same Resolver
**What:** Detail JSON-LD helpers should resolve the same route path and assign `image` to `socialImageForRoutePath(routePath, profile).url`. [VERIFIED: src/domain/seo.ts] [VERIFIED: .planning/phases/26-metadata-wiring-and-static-references/26-CONTEXT.md]

**When to use:** Use for project detail `SoftwareSourceCode`, writing detail/item `BlogPosting`, and theme detail `CollectionPage`. [VERIFIED: src/domain/seo.ts]

**Example:**
```typescript
// Source: src/domain/seo.ts and Schema.org image property.
export function themeCollectionPageJsonLd(
  theme: PublicThemeEntry,
  profile: Profile = peterProfile,
): ThemeCollectionPageJsonLd {
  const routePath = themeDetailPath(theme);
  const canonical = `${profile.canonicalOrigin}${routePath}`;

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: theme.title,
    description: theme.summary,
    url: canonical,
    mainEntityOfPage: canonical,
    image: socialImageForRoutePath(routePath, profile).url,
    creator: personJsonLd(profile),
    // existing fields preserved
  };
}
```
[VERIFIED: src/domain/seo.ts] [CITED: https://schema.org/CollectionPage] [CITED: https://schema.org/image]

### Pattern 4: Existing Route Head Blocks Render One More Helper-Derived Tag
**What:** Keep route components consuming `PageMetadata`; add `<Meta property="og:image:type" content={metadata.openGraph.image.mimeType} />` next to existing `og:image` tags. [VERIFIED: src/routes/projects/index.tsx] [VERIFIED: src/routes/writing/index.tsx] [VERIFIED: src/routes/themes/[slug].tsx]

**When to use:** Use in every route head surface that already renders `og:image`, including generic routes, indexes, and detail routes. [VERIFIED: src/routes/index.tsx] [VERIFIED: src/routes/about.tsx] [VERIFIED: src/routes/contact.tsx]

**Example:**
```tsx
// Source: existing route head pattern plus Open Graph structured image properties.
<Meta property="og:image" content={metadata.openGraph.image.url} />
<Meta property="og:image:type" content={metadata.openGraph.image.mimeType} />
<Meta property="og:image:width" content={metadata.openGraph.image.width.toString()} />
<Meta property="og:image:height" content={metadata.openGraph.image.height.toString()} />
<Meta property="og:image:alt" content={metadata.openGraph.image.alt} />
```
[VERIFIED: src/routes/index.tsx] [CITED: https://ogp.me/]

### Anti-Patterns to Avoid
- **Hard-coded generated paths in route files:** Duplicates the social preview contract and violates META-05. [VERIFIED: .planning/REQUIREMENTS.md] [VERIFIED: src/domain/social-previews.ts]
- **Fallback-only static verifier:** Current `assertMetadataImageMapsToLocalAsset()` rejects generated assets, so leaving it unchanged would make Phase 26 fail static verification. [VERIFIED: scripts/verify-static/metadata-jsonld-verifier.ts]
- **Separate JSON-LD image selection:** JSON-LD image URLs must come from the same route resolver as OG/Twitter to prove parity. [VERIFIED: .planning/phases/26-metadata-wiring-and-static-references/26-CONTEXT.md]
- **Full metadata component refactor before domain behavior is proven:** The existing route blocks work; broad centralization is optional and should only happen if it reduces duplicated edits without changing semantics. [VERIFIED: src/routes/projects/index.tsx] [VERIFIED: .planning/phases/26-metadata-wiring-and-static-references/26-CONTEXT.md]
- **Manifest/checksum enforcement expansion in Phase 26:** Generated manifest freshness is already covered by `verify:social-previews`; broader asset budget and release evidence expansion belongs to Phase 28. [VERIFIED: package.json] [VERIFIED: .planning/REQUIREMENTS.md]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Covered route inventory | A copied route array or slug map | `socialPreviewTargets()` and `maybeSocialPreviewTargetForRoutePath()` | Existing helpers already filter selected/public project, writing, and theme routes. [VERIFIED: src/domain/social-previews.ts] |
| Generic image fallback | Another fallback constant in `seo.ts` | `SOCIAL_PREVIEW_FALLBACK_IMAGE` | Phase 24 made fallback image data explicit and tested. [VERIFIED: src/domain/social-previews.ts] [VERIFIED: src/domain/social-previews.test.ts] |
| Absolute image URL building | Inline string concatenation in route files | A pure `seo.ts` helper using `profile.canonicalOrigin` | Phase 26 requires canonical absolute URLs and no route-level hard-coding. [VERIFIED: .planning/phases/26-metadata-wiring-and-static-references/26-CONTEXT.md] |
| JSON-LD escaping | Manual script escaping | Existing `jsonLdScriptContent()` | Existing helper already escapes `<` for safe script content. [VERIFIED: src/domain/seo.ts] [VERIFIED: src/domain/writing-metadata.test.ts] |
| Static asset validation | Custom ad hoc filesystem checks inside route tests | Existing `scripts/verify-static/output.ts` helpers | The verifier already has output-file and PNG dimension helpers. [VERIFIED: scripts/verify-static/output.ts] |
| Social image generation during metadata wiring | Runtime renderer, browser screenshot, dynamic OG endpoint | Checked-in Phase 25 generated PNGs | v1.5 excludes runtime/dynamic image generation. [VERIFIED: .planning/REQUIREMENTS.md] [VERIFIED: public/social/generated/manifest.json] |

**Key insight:** The hard part is not generating or discovering images; Phase 24/25 already solved that. [VERIFIED: .planning/phases/24-social-image-data-contract/24-01-SUMMARY.md] [VERIFIED: .planning/phases/25-deterministic-static-image-generation/25-03-SUMMARY.md] The Phase 26 risk is drift between metadata, JSON-LD, static HTML, and generated assets, so every plan task should pull expected values from the same domain helper. [VERIFIED: .planning/phases/26-metadata-wiring-and-static-references/26-CONTEXT.md]

## Common Pitfalls

### Pitfall 1: Covered Index Routes Accidentally Stay on the Fallback
**What goes wrong:** `/projects`, `/writing`, and `/themes` continue to use `/social/bright-builds-og.png` even though they are covered social preview targets. [VERIFIED: src/domain/routes.ts] [VERIFIED: src/domain/social-previews.test.ts]
**Why it happens:** `metadataForRoute()` currently calls fallback-only `socialImageForProfile(profile)`. [VERIFIED: src/domain/seo.ts]
**How to avoid:** Pass `route.path` into the route-aware resolver inside `metadataForRoute()`. [VERIFIED: src/domain/seo.ts] [VERIFIED: src/domain/social-previews.ts]
**Warning signs:** Unit tests for `/projects`, `/writing`, or `/themes` still expect `bright-builds-og.png`. [VERIFIED: src/domain/writing-metadata.test.ts] [VERIFIED: src/domain/portfolio-surfaces.test.ts]

### Pitfall 2: Detail Metadata Changes but JSON-LD Keeps the Fallback
**What goes wrong:** Open Graph and Twitter image URLs become route-specific while `BlogPosting`, `CollectionPage`, or `SoftwareSourceCode` JSON-LD image values remain fallback or missing. [VERIFIED: src/domain/seo.ts]
**Why it happens:** Writing and theme JSON-LD currently call `socialImageForProfile(profile).url`, while project JSON-LD currently has no `image` field. [VERIFIED: src/domain/seo.ts]
**How to avoid:** Change JSON-LD helpers in the same task as metadata image selection and assert parity in unit tests. [VERIFIED: .planning/phases/26-metadata-wiring-and-static-references/26-CONTEXT.md]
**Warning signs:** `projectJsonLd()` type still lacks `image`, or tests only inspect metadata objects and not JSON-LD. [VERIFIED: src/domain/seo.ts] [VERIFIED: src/domain/project-detail-routes.test.ts]

### Pitfall 3: `og:image:type` Is Added In Some Routes Only
**What goes wrong:** Covered routes pass but generic routes or fallback not-found surfaces miss `og:image:type`. [VERIFIED: src/routes/index.tsx] [VERIFIED: src/routes/themes/[slug].tsx]
**Why it happens:** Head rendering is duplicated across route files. [VERIFIED: rg metadata output over src/routes]
**How to avoid:** Either add the tag mechanically to every existing image block or introduce a small metadata-head component only if the implementation keeps behavior unchanged. [VERIFIED: .planning/phases/26-metadata-wiring-and-static-references/26-CONTEXT.md]
**Warning signs:** Static verifier checks `og:image:type` on detail routes but not home/about/contact. [VERIFIED: scripts/verify-static/metadata-jsonld-verifier.ts]

### Pitfall 4: Static Verifier Still Assumes Fallback-Only Images
**What goes wrong:** `bun run verify:static` fails after metadata correctly points to `/social/generated/...`. [VERIFIED: scripts/verify-static/metadata-jsonld-verifier.ts]
**Why it happens:** `assertMetadataImageMapsToLocalAsset()` currently throws unless the path is exactly `social/bright-builds-og.png`. [VERIFIED: scripts/verify-static/metadata-jsonld-verifier.ts]
**How to avoid:** Make the assertion route-aware: for covered routes require the exact `maybeSocialPreviewTargetForRoutePath(path)?.assetPath`; for generic routes require `SOCIAL_PREVIEW_FALLBACK_IMAGE.assetPath`. [VERIFIED: src/domain/social-previews.ts]
**Warning signs:** The verifier takes only `imageUrl` and not `routePath`, or does not inspect `maybeSocialPreviewTargetForRoutePath(path)`. [VERIFIED: scripts/verify-static/metadata-jsonld-verifier.ts]

### Pitfall 5: Absolute URL and Local Asset Checks Diverge
**What goes wrong:** Metadata uses a valid local path but not the canonical origin, or uses a canonical URL that does not map to a built asset. [VERIFIED: scripts/verify-static/metadata-jsonld-verifier.ts]
**Why it happens:** URL construction and filesystem mapping are separate concerns. [VERIFIED: src/domain/seo.ts] [VERIFIED: scripts/verify-static/output.ts]
**How to avoid:** Keep `profile.canonicalOrigin` construction inside `seo.ts` and keep `new URL(imageUrl).origin === peterProfile.canonicalOrigin` in static verification. [VERIFIED: src/domain/seo.ts] [VERIFIED: scripts/verify-static/metadata-jsonld-verifier.ts]
**Warning signs:** Tests compare path suffixes only and do not assert origin. [VERIFIED: scripts/verify-static/metadata-jsonld-verifier.ts]

## Code Examples

Verified patterns from official and local sources:

### Social Image Resolver
```typescript
// Source: src/domain/social-previews.ts, src/domain/seo.ts.
function socialImageForRoutePath(routePath: string, profile: Profile): SocialImageMetadata {
  const maybeTarget = maybeSocialPreviewTargetForRoutePath(routePath);
  const image = maybeTarget ?? SOCIAL_PREVIEW_FALLBACK_IMAGE;

  return {
    url: `${profile.canonicalOrigin}${image.assetPath}`,
    width: image.dimensions.width,
    height: image.dimensions.height,
    alt: image.alt,
    mimeType: "image/png",
  };
}
```
[VERIFIED: src/domain/social-previews.ts] [VERIFIED: src/domain/seo.ts]

### Project JSON-LD Image Parity
```typescript
// Source: src/domain/seo.ts and Schema.org image property.
export function projectJsonLd(
  project: ProjectDetailPageProject,
  profile: Profile = peterProfile,
): ProjectJsonLd {
  const routePath = projectDetailPath(project);
  const canonical = `${profile.canonicalOrigin}${routePath}`;

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.name,
    description: project.oneLine,
    url: canonical,
    image: socialImageForRoutePath(routePath, profile).url,
    sameAs: project.links.map((link) => link.href),
    creator: personJsonLd(profile),
    // existing fields preserved
  };
}
```
[VERIFIED: src/domain/seo.ts] [CITED: https://schema.org/SoftwareSourceCode] [CITED: https://schema.org/image]

### Route-Aware Static Image Assertion
```typescript
// Source: scripts/verify-static/metadata-jsonld-verifier.ts and scripts/verify-static/output.ts.
function assertMetadataImageMapsToLocalAsset(
  outputRoot: string,
  routePath: string,
  imageUrl: string,
): void {
  const url = new URL(imageUrl);

  if (url.origin !== peterProfile.canonicalOrigin) {
    throw new Error(`Metadata image URL is not canonical: ${imageUrl}`);
  }

  const maybeTarget = maybeSocialPreviewTargetForRoutePath(routePath);
  const expectedImage = maybeTarget ?? SOCIAL_PREVIEW_FALLBACK_IMAGE;

  if (url.pathname !== expectedImage.assetPath) {
    throw new Error(`Metadata image URL ${imageUrl} does not match ${routePath}.`);
  }

  const outputAssetPath = expectedImage.assetPath.replace(/^\//, "");
  assertPngDimensions(
    outputRoot,
    outputAssetPath,
    expectedImage.dimensions.width,
    expectedImage.dimensions.height,
  );
}
```
[VERIFIED: scripts/verify-static/metadata-jsonld-verifier.ts] [VERIFIED: scripts/verify-static/output.ts] [VERIFIED: src/domain/social-previews.ts]

### JSON-LD Parity Assertion Shape
```typescript
// Source: scripts/verify-static/metadata-jsonld-verifier.ts.
function assertThemeCollectionPageJsonLd(theme: PublicThemeEntry, html: string): void {
  const expectedJsonLd = themeCollectionPageJsonLd(theme);
  const expectedImageUrl = metadataForTheme(theme).openGraph.image.url;

  assertJsonLdContains(html, [
    "CollectionPage",
    expectedJsonLd.url,
    expectedImageUrl,
  ]);
}
```
[VERIFIED: scripts/verify-static/metadata-jsonld-verifier.ts] [VERIFIED: src/domain/seo.ts]

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Every route uses `/social/bright-builds-og.png` through `socialImageForProfile()` | Covered project, writing, theme, and family index routes should resolve generated assets through `maybeSocialPreviewTargetForRoutePath()` | Phase 26 scope on 2026-06-21 | Metadata becomes route-specific without route-level hard-coding. [VERIFIED: src/domain/seo.ts] [VERIFIED: .planning/phases/26-metadata-wiring-and-static-references/26-CONTEXT.md] |
| No generated social preview files existed | 13 checked-in 1200x630 PNGs plus manifest exist under `public/social/generated/` | Phase 25 completed 2026-06-21 | Static metadata can now point at reviewed local assets. [VERIFIED: public/social/generated/manifest.json] [VERIFIED: .planning/phases/25-deterministic-static-image-generation/25-03-SUMMARY.md] |
| Project detail JSON-LD omitted `image` | Project detail JSON-LD should include route-specific social image URL | Phase 26 requirement | Project structured data reaches parity with OG/Twitter detail metadata. [VERIFIED: src/domain/seo.ts] [VERIFIED: .planning/REQUIREMENTS.md] |
| Static metadata verifier enforced fallback-only assets | Static verifier should branch by route coverage and verify local generated-or-fallback PNG assets | Phase 26 requirement | `verify:static` can prove route-specific images while preserving generic fallback behavior. [VERIFIED: scripts/verify-static/metadata-jsonld-verifier.ts] [VERIFIED: .planning/phases/26-metadata-wiring-and-static-references/26-CONTEXT.md] |

**Deprecated/outdated:**
- `socialImageForProfile(profile)` as the only image selector is now outdated for covered routes; keep fallback behavior but route it through a path-aware helper. [VERIFIED: src/domain/seo.ts] [VERIFIED: src/domain/social-previews.ts]
- Fallback-only metadata tests are outdated for `/projects`, `/writing`, `/themes`, and public detail routes; keep fallback tests for `/`, `/about`, `/contact`, and unknown/fallback surfaces. [VERIFIED: src/domain/writing-metadata.test.ts] [VERIFIED: src/domain/social-previews.test.ts]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `Valid until: 2026-07-21 for local architecture decisions; package latest-version notes should be refreshed after 2026-06-28 if planning is delayed.` | Metadata | Planner may treat package freshness as stable for too long; refresh npm checks if planning is delayed. |

## Open Questions

1. **Should route head rendering be centralized in Phase 26?**
   - What we know: Route files duplicate the same metadata block and need `og:image:type` added consistently. [VERIFIED: src/routes/index.tsx] [VERIFIED: src/routes/projects/index.tsx] [VERIFIED: src/routes/writing/[slug].tsx]
   - What's unclear: The phase context delegates centralization and says to prefer a focused helper only if it reduces real duplication without expanding scope. [VERIFIED: .planning/phases/26-metadata-wiring-and-static-references/26-CONTEXT.md]
   - Recommendation: Plan domain behavior first; add a tiny metadata-head component only if the implementation task can keep it mechanical and covered by static verification. [VERIFIED: standards/core/architecture.md] [VERIFIED: .planning/phases/26-metadata-wiring-and-static-references/26-CONTEXT.md]

2. **Should Phase 26 read the generated manifest during static verification?**
   - What we know: `verify:social-previews` already checks manifest drift, fingerprints, dimensions, checksums, orphaned files, and deterministic rendering. [VERIFIED: scripts/social-previews/check.ts] [VERIFIED: package.json]
   - What's unclear: Phase 26 D-15 requires mapping generated image paths to checked-in output assets, while Phase 28 owns broader manifest consistency and release evidence expansion. [VERIFIED: .planning/phases/26-metadata-wiring-and-static-references/26-CONTEXT.md] [VERIFIED: .planning/ROADMAP.md]
   - Recommendation: In Phase 26, static verification should assert exact helper-derived route path, canonical origin, file existence, and PNG dimensions; leave checksum/budget/evidence expansion to Phase 28 unless implementation finds a narrow manifest read is simpler. [VERIFIED: scripts/verify-static/output.ts] [VERIFIED: .planning/REQUIREMENTS.md]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Bun | `bun run test`, `bun run build`, `bun run verify` | yes | local `1.3.9`; `packageManager` pin `1.3.14` | Use local Bun unless verification fails due version mismatch; then upgrade to the package pin. [VERIFIED: local command] [VERIFIED: package.json] |
| Node.js | npm registry checks and ecosystem CLIs | yes | `v24.13.0` | None needed. [VERIFIED: local command] |
| npm | version verification | yes | `11.6.2` | None needed. [VERIFIED: local command] |
| Installed dependencies | Typecheck/test/build scripts | yes | `node_modules` present | Run `bun install` only if a script reports missing packages. [VERIFIED: local command] |
| Fallback social PNG | Generic route metadata | yes | `public/social/bright-builds-og.png` present | Blocking if missing; no fallback should be invented. [VERIFIED: local command] [VERIFIED: src/domain/social-previews.ts] |
| Generated social PNGs | Covered route metadata | yes | 13 PNG files present | Blocking if missing; run `bun run generate:social-previews` and `bun run verify:social-previews`. [VERIFIED: local command] [VERIFIED: public/social/generated/manifest.json] |
| Generated manifest | Asset inventory and future verifier expansion | yes | manifest `version: 1`, 13 entries | Use `verify:social-previews` for manifest freshness. [VERIFIED: public/social/generated/manifest.json] [VERIFIED: package.json] |

**Missing dependencies with no fallback:**
- None found for the research/planning surface. [VERIFIED: local command]

**Missing dependencies with fallback:**
- Local Bun is older than the packageManager pin; fallback is to proceed with local Bun for this metadata-only plan and upgrade only if repo scripts fail for version-specific reasons. [VERIFIED: local command] [VERIFIED: package.json]

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | No authentication surfaces are in Phase 26 scope. [VERIFIED: .planning/REQUIREMENTS.md] |
| V3 Session Management | no | No session or cookie surfaces are in Phase 26 scope. [VERIFIED: .planning/REQUIREMENTS.md] |
| V4 Access Control | no | Covered routes are already public-route helper outputs; Phase 26 must not broaden visibility. [VERIFIED: src/domain/social-previews.ts] [VERIFIED: .planning/phases/26-metadata-wiring-and-static-references/26-CONTEXT.md] |
| V5 Input Validation | yes | Use existing route-path helpers, canonical URL parsing, local asset path checks, and HTML/JSON-LD escaping helpers. [VERIFIED: src/domain/social-previews.ts] [VERIFIED: scripts/verify-static/metadata-jsonld-verifier.ts] [VERIFIED: scripts/verify-static/html-assertions.ts] |
| V6 Cryptography | no | No cryptographic changes are required; Phase 25 already owns SHA-256 fingerprints/checksums. [VERIFIED: scripts/social-previews/manifest.ts] [VERIFIED: .planning/phases/25-deterministic-static-image-generation/25-03-SUMMARY.md] |

### Known Threat Patterns for Static Metadata Wiring

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Metadata image points to remote or non-canonical URL | Spoofing / Information disclosure | Static verifier should reject non-`peterProfile.canonicalOrigin` image URLs. [VERIFIED: scripts/verify-static/metadata-jsonld-verifier.ts] |
| Generated asset path escapes managed local directory | Tampering | Social preview validation already rejects non-local, non-generated, and unsafe paths. [VERIFIED: src/domain/social-previews.ts] |
| JSON-LD script receives unescaped `<` content | Cross-site scripting | Continue using `jsonLdScriptContent()` for all JSON-LD script bodies. [VERIFIED: src/domain/seo.ts] [VERIFIED: src/domain/writing-metadata.test.ts] |
| Draft/hidden records get route-specific social metadata | Information disclosure | Continue deriving covered routes from existing public selectors through `socialPreviewTargets()`. [VERIFIED: src/domain/social-previews.ts] [VERIFIED: src/domain/social-previews.test.ts] |
| Metadata verifier checks full HTML but not pre-hydration output | Repudiation / test gap | Static verification should search the prerendered HTML before the hydration manifest script for required metadata tags. [VERIFIED: scripts/verify-static/html-assertions.ts] [VERIFIED: .planning/REQUIREMENTS.md] |

## Sources

### Primary (HIGH confidence)
- `.planning/phases/26-metadata-wiring-and-static-references/26-CONTEXT.md` - locked metadata wiring decisions, JSON-LD parity scope, static verification scope, and deferred ideas.
- `.planning/REQUIREMENTS.md` - META-01 through META-05 and v1.5 exclusions.
- `.planning/ROADMAP.md` - Phase 26 goal, dependency, and success criteria.
- `.planning/phases/24-social-image-data-contract/24-CONTEXT.md` and `24-01-SUMMARY.md` - social preview helper contract, fallback behavior, route coverage, and validation behavior.
- `.planning/phases/25-deterministic-static-image-generation/25-CONTEXT.md` and `25-03-SUMMARY.md` - generated asset/manifest ownership and completed output.
- `src/domain/social-previews.ts` and `src/domain/social-previews.test.ts` - covered route helper, fallback image, dimensions, alt text, and validation behavior.
- `src/domain/seo.ts` - current metadata and JSON-LD helper surface.
- `scripts/verify-static/metadata-jsonld-verifier.ts` and `scripts/verify-static/output.ts` - static metadata verification and local PNG file checks.
- `public/social/generated/manifest.json` - generated route asset inventory.
- `package.json` - existing scripts and pinned package versions.
- `AGENTS.md`, `AGENTS.bright-builds.md`, `standards/core/*.md`, and `standards/languages/typescript-javascript.md` - repo and Bright Builds workflow, architecture, testing, verification, and TypeScript rules.
- npm registry checks - current package versions and modified dates for core/supporting packages.
- Open Graph protocol: `https://ogp.me/` - `og:image` structured properties including type, width, height, and alt.
- SolidStart/Solid Meta docs: `https://docs.solidjs.com/solid-start/building-your-application/head-and-metadata`, `https://docs.solidjs.com/solid-meta`, `https://docs.solidjs.com/solid-meta/reference/meta/meta` - route metadata and `Meta` behavior.
- Schema.org: `https://schema.org/image`, `https://schema.org/SoftwareSourceCode`, `https://schema.org/BlogPosting`, `https://schema.org/CollectionPage` - `image` property support and relevant types.

### Secondary (MEDIUM confidence)
- The SEO Framework Twitter/X card guide: `https://kb.theseoframework.com/kb/twitter-cards-and-x-sharing/` - current secondary reference for `twitter:image` and `twitter:image:alt`; local Phase 26 requirements remain the authoritative source for Twitter tags in this project. [CITED: https://kb.theseoframework.com/kb/twitter-cards-and-x-sharing/] [VERIFIED: .planning/REQUIREMENTS.md]
- X developer card URLs were checked and redirected to the current general X docs overview, so they were not used as authoritative card-tag evidence. [CITED: https://docs.x.com/overview]

### Tertiary (LOW confidence)
- None used for recommendations.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - package pins, npm registry versions, and local code usage were verified. [VERIFIED: package.json] [VERIFIED: npm registry]
- Architecture: HIGH - implementation shape follows existing domain helper and route rendering patterns. [VERIFIED: src/domain/seo.ts] [VERIFIED: src/routes/projects/index.tsx] [VERIFIED: standards/core/architecture.md]
- Pitfalls: HIGH - each pitfall maps to an existing stale fallback behavior, verifier assumption, or locked Phase 26 requirement. [VERIFIED: src/domain/seo.ts] [VERIFIED: scripts/verify-static/metadata-jsonld-verifier.ts] [VERIFIED: .planning/phases/26-metadata-wiring-and-static-references/26-CONTEXT.md]

**Research date:** 2026-06-21
**Valid until:** 2026-07-21 for local architecture decisions; package latest-version notes should be refreshed after 2026-06-28 if planning is delayed. [VERIFIED: npm registry] [ASSUMED]
