# Architecture Research: v1.5 Static Shareability & Freshness

**Milestone:** v1.5 Static Shareability & Freshness
**Researched:** 2026-06-21
**Scope:** How route-derived social preview generation, metadata wiring, freshness reports, and verification should integrate with the existing static portfolio architecture.
**Overall confidence:** HIGH

Local guidance and standards materially used: `AGENTS.md`, `AGENTS.bright-builds.md`, `standards/core/architecture.md`, `standards/core/verification.md`, `standards/languages/typescript-javascript.md`, and the OpenLinks identity-presence guidance. The key constraints are functional core / imperative shell, Bun-owned TypeScript automation, deterministic static output, truthful release evidence labels, and low-intrusion OpenLinks identity metadata.

## Current Architecture Fit

The existing architecture is already the right base for v1.5:

- Domain modules own curated, checked-in source data and pure selectors:
  - `src/domain/projects.ts` for selected project stories and `/projects/{slug}` paths.
  - `src/domain/writing.ts` for public writing entries and `/writing/{slug}` paths.
  - `src/domain/themes.ts` for public theme records and `/themes/{slug}` paths.
  - `src/domain/routes.ts` for top-level route definitions, `prerenderRoutes`, `sitemapRoutes`, and navigation routes.
- `src/domain/seo.ts` owns pure metadata, JSON-LD, sitemap, and robots derivation. It currently uses one fallback image, `/social/bright-builds-og.png`, for every Open Graph, Twitter, BlogPosting, and CollectionPage image.
- Solid route files are thin shells over helpers. They already render whatever `PageMetadata.openGraph.image` and `PageMetadata.twitter.image` provide, so most v1.5 metadata work belongs in domain helpers rather than route components.
- Bun scripts are the imperative shell:
  - `scripts/generate-static-metadata.ts` writes static sitemap and robots files from pure helpers.
  - `scripts/sync-github-metadata.ts` fetches GitHub data into a checked-in snapshot, with no visitor-runtime dependency.
  - `scripts/verify-static.ts` and its `scripts/verify-static/*` modules verify generated `.output/public` HTML, assets, metadata, JSON-LD, sitemap, and forbidden runtime residue.
  - `scripts/verify-release.ts` scans emitted output generically for budgets, links, semantic structure, forbidden tokens/runtime GitHub residue, remote visual assets, and evidence label truthfulness.

v1.5 should extend these seams instead of adding a dynamic Open Graph endpoint, page screenshot service, visitor-runtime GitHub fetch, CMS, or hand-maintained route list.

The main current mismatch is the singleton social image assumption. `src/domain/seo.ts`, `scripts/verify-static/metadata-jsonld-verifier.ts`, `scripts/verify-static/sitemap-assets-verifier.ts`, and `scripts/verify-release.ts` all know about `social/bright-builds-og.png`. v1.5 should replace that singleton assumption with a pure social preview manifest that is derived from the same route helpers as prerendering and sitemap generation.

Recommended architecture decision:

Use a new route-derived social preview target layer. Metadata helpers, image generation, freshness reporting, and verification all consume that layer. Do not let the renderer, filesystem, or clock leak into the domain module.

## Proposed Data Flow

Recommended data flow:

```text
curated project/writing/theme data
+ top-level siteRoutes
+ GitHub metadata snapshot where already checked in
        |
        v
src/domain/social-previews.ts
  - derives shareable route targets
  - derives preview titles, descriptions, labels, alt text
  - derives deterministic public asset paths
  - derives content digests for cache freshness
        |
        +---------------------------+
        |                           |
        v                           v
src/domain/seo.ts              scripts/generate-social-previews.ts
  - PageMetadata.image           - renders PNGs from pure targets
  - JSON-LD image                - writes only managed public/social files
  - canonical social URLs        - no network, clock, remote fonts, or randomness
        |                           |
        v                           v
Solid route head tags          public/social/generated/*
        |                           |
        +-------------+-------------+
                      |
                      v
vinxi/SolidStart build -> .output/public
                      |
                      v
verify-static + verify-release
  - route metadata references expected local assets
  - assets exist, are PNG, 1200x630, non-empty, and budgeted
  - no dynamic OG endpoint or visitor-runtime GitHub/API residue
```

Social preview targets should be pure records, not generated image files:

```ts
export type SocialPreviewSurface = "site" | "project" | "writing" | "theme";

export type SocialPreviewTarget = {
  surface: SocialPreviewSurface;
  routePath: string;
  assetPath: string;
  title: string;
  description: string;
  kicker: string;
  labels: readonly string[];
  imageAlt: string;
  sourceDigest: string;
};
```

The target list should include:

- `/projects`
- every `projectDetailRoutes()` route
- `/writing`
- every `writingDetailRoutes()` route
- `/themes`
- every `themeDetailRoutes()` route

Home, about, and contact can keep the existing fallback image unless a later phase explicitly scopes route-specific images for all top-level routes. The v1.5 goal is strongest for project, writing, and theme share routes.

Use deterministic digest-backed asset paths for content routes, for example:

```text
/social/generated/projects/index-{digest}.png
/social/generated/projects/openlinks-{digest}.png
/social/generated/writing/agentic-engineering-workflows-{digest}.png
/social/generated/themes/agentic-engineering-{digest}.png
```

The digest should be computed from normalized preview source data, not from file bytes, current time, git commit, or environment. This gives social crawlers a new image URL when curated route copy changes while keeping output deterministic. The generator should clean only its managed `public/social/generated/` directory before writing the current manifest so stale images do not linger silently.

Metadata wiring should flow through existing `PageMetadata`:

- Keep `SocialImageMetadata` as the object passed to Open Graph and Twitter tags.
- Add pure helpers such as `socialImageForRoutePath(routePath, profile)` or `socialPreviewImageForTarget(target, profile)`.
- Update `metadataForRoute`, `metadataForProject`, `metadataForWritingEntry`, and `metadataForTheme` to select the expected target image.
- Update `writingBlogPostingItemJsonLd` and `themeCollectionPageJsonLd` to use the same image URL as the route metadata, not a separate fallback helper.
- Keep route components largely unchanged because they already render `metadata.openGraph.image` and `metadata.twitter.image`.

Freshness reports should follow the same architecture:

```text
checked-in snapshot/data + generated social target manifest + injected asOf date
        |
        v
src/domain/freshness.ts
  - pure findings and report model
        |
        v
scripts/generate-freshness-report.ts
  - writes maintainer report
  - optional strict exit code
  - no visitor-runtime dependency
```

The freshness report should be maintainer-facing, not public page copy. It can classify:

- GitHub metadata snapshot age from `gitHubMetadataSnapshot.syncedAt`.
- unavailable repository metadata records.
- repositories with stale or missing `pushedAt`.
- primary curated links that lack external-link policy coverage.
- non-HTTPS primary links.
- expected social preview targets without generated assets.
- generated social assets whose digest no longer matches current route-derived preview data.

Keep live external-link reachability out of the default aggregate release gate. If live checks are added, make them an explicit manual or scheduled command with honest labels such as `freshness:links:network`, not a default `bun run verify` dependency.

## New/Modified Files

New files:

| File | Purpose |
| --- | --- |
| `src/domain/social-previews.ts` | Pure target derivation for project, writing, and theme social images. Owns route path, title, description, labels, alt text, deterministic digest, and public asset path. |
| `src/domain/social-previews.test.ts` | Unit tests for route coverage, public-only filtering, unique asset paths, deterministic digests, and no fallback image for shareable content routes. |
| `scripts/social-previews/render-preview.ts` | Pure renderer input/template layer. Escapes text, clamps long titles, chooses colors/tags, and stays independent from filesystem and clocks. |
| `scripts/generate-social-previews.ts` | Imperative Bun shell that renders 1200x630 PNGs into `public/social/generated/` from `socialPreviewTargets()`. Should support `--check` for drift detection. |
| `scripts/social-previews.test.ts` | Script-level tests for import safety, deterministic render inputs, longest-title fixtures, and `--check` behavior where practical. |
| `src/domain/freshness.ts` | Pure maintainer freshness report model and findings over GitHub snapshot, curated links, route targets, and generated media manifest. Accepts `asOf` as input. |
| `src/domain/freshness.test.ts` | Unit tests for snapshot age, unavailable metadata, generated media drift, and non-HTTPS/policy findings without network access. |
| `scripts/generate-freshness-report.ts` | Explicit maintainer command that writes a reviewed report from pure freshness findings. Optional `--strict` can fail on selected deterministic findings. |
| `scripts/verify-static/social-preview-assets-verifier.ts` | Static output verifier for expected route social image assets, dimensions, local canonical metadata mapping, and managed generated directory behavior. |

Modified files:

| File | Change |
| --- | --- |
| `src/domain/seo.ts` | Replace the global fallback-only `socialImageForProfile` path with route-aware social preview lookup. Ensure PageMetadata and JSON-LD image fields use the same expected asset. |
| `src/domain/routes.ts` | No required route list change if `social-previews.ts` imports existing helpers. Add a helper only if the route contract needs a named `shareableRoutes` export. |
| `scripts/verify-static/metadata-jsonld-verifier.ts` | Replace `assetPath !== "social/bright-builds-og.png"` with expected social preview lookup by route. Assert metadata and JSON-LD images match the route target. |
| `scripts/verify-static/sitemap-assets-verifier.ts` | Replace singleton PNG check with iteration over expected social preview assets. Keep fallback checks for `social/bright-builds-og.png` if non-content routes still use it. |
| `scripts/verify-static/run-static-verification.ts` | Update summary wording to include static social preview assets. Keep route count derived from `expectedRoutes`. |
| `scripts/verify-static.test.ts` | Update import-safe helper coverage and expected summary wording. Add route-derived social target checks. |
| `scripts/verify-release.ts` | Budget all referenced social PNGs, not only `social/bright-builds-og.png`. Keep no remote visual assets and no dynamic endpoint assumptions. Add evidence labels only for checks actually performed. |
| `scripts/verify-release.test.ts` | Update budget report and evidence label tests for multiple social preview assets. Assert labels do not claim live link or hosted social-card validation. |
| `scripts/release-readiness.ts` | Add required documentation facts for static social preview generation, route metadata image references, generated media verification, and freshness report scope. |
| `docs/release-readiness.md` | Document generated social preview assets, check/update commands, manual social-card preview checks, and freshness report boundaries. |
| `package.json` | Add scripts such as `generate:social-previews`, `verify:social-previews`, and `freshness:report`. Wire deterministic social preview verification before build in `verify`. |
| `src/domain/portfolio-surfaces.test.ts` | Update top-level route metadata expectations for project/writing/theme index images where route-specific images apply. |
| `src/domain/project-detail-routes.test.ts` | Update project detail metadata tests to expect project-specific social images. |
| `src/domain/writing-metadata.test.ts` | Update writing and theme metadata/JSON-LD tests to expect route-specific social images. |
| `public/social/generated/*` | Managed generated PNG outputs. Commit these if the repo wants static builders to copy reviewed assets without requiring local regeneration first. |

No source change expected:

| File | Reason |
| --- | --- |
| `app.config.ts` | It already prerenders `prerenderRoutes`; social assets are static files copied from `public/`. |
| `src/routes/*` | Existing routes render metadata image fields generically. Avoid touching route components unless adding a shared head component becomes necessary. |
| `scripts/sync-github-metadata.ts` | Keep GitHub snapshot sync separate from freshness reporting. Do not mix network sync with local release verification. |
| `src/components/SiteLayout.tsx` | Share assets and freshness reports should not affect layout or navigation. |

## Build Order

Recommended implementation order:

1. Add `src/domain/social-previews.ts` with target derivation from existing route helpers.
   - Start with public project detail routes, public writing detail routes, public theme detail routes, and the three index routes: `/projects`, `/writing`, `/themes`.
   - Add unit tests that prove the target list is derived from helpers and excludes draft, hidden, archived, unsupported, and unselected records.

2. Update `src/domain/seo.ts` to use the social preview target layer.
   - Keep `PageMetadata` shape stable if possible.
   - Ensure Open Graph, Twitter, BlogPosting, and CollectionPage image fields all reference the same expected route asset.
   - Update metadata unit tests before adding the renderer. This confirms the data contract independently of PNG generation.

3. Add the social preview renderer and generator.
   - Keep rendering input pure and testable.
   - Use local bundled fonts or system-independent renderer defaults only; do not fetch fonts or images.
   - Make `scripts/generate-social-previews.ts --check` compare expected generated assets against committed files or a temp render output.
   - Clean only `public/social/generated/`, never the whole `public/social/` directory.

4. Wire package scripts.
   - Add `generate:social-previews` for updating files.
   - Add `verify:social-previews` for deterministic drift checks.
   - Put `verify:social-previews` before `bun run build` in the aggregate `verify` script so `.output/public` never copies stale preview assets.

5. Extend static output verification.
   - Update metadata verifier to assert each route's `og:image`, `twitter:image`, and JSON-LD `image` map to the expected generated asset.
   - Update asset verifier to check every expected image exists in `.output/public`, is PNG, is 1200x630, and is not unexpectedly missing from the built output.
   - Keep `social/bright-builds-og.png` as a fallback asset check only for routes that still use it.

6. Extend release verification and documentation.
   - Budget generated social image assets individually and in aggregate if needed.
   - Add release evidence labels for static social preview assets only after `verify:static` and `verify:release` prove them.
   - Update release-readiness facts and docs so labels do not overclaim hosted, network, or social-crawler checks.

7. Add freshness report helpers and command.
   - Build `src/domain/freshness.ts` after social preview targets exist because media freshness should reuse the same target manifest.
   - Add `scripts/generate-freshness-report.ts` as an explicit maintainer command, not visitor runtime.
   - Keep network reachability checks optional and outside the default aggregate gate.

8. Run the full release path.
   - `bun run generate:social-previews`
   - `bun run verify:social-previews`
   - `bun run build`
   - `bun run verify:static`
   - `bun run verify:release`
   - Then the full `bun run verify` aggregate once scripts are wired.

Suggested script shape:

```json
{
  "generate:social-previews": "bun run scripts/generate-social-previews.ts",
  "verify:social-previews": "bun run scripts/generate-social-previews.ts --check",
  "freshness:report": "bun run scripts/generate-freshness-report.ts"
}
```

Do not add `freshness:report` to `verify` unless it is strictly deterministic and does not write files during check mode. Prefer an explicit release checklist step for reviewed freshness reports.

## Verification Strategy

Unit verification:

- `src/domain/social-previews.test.ts`
  - `socialPreviewTargets()` covers `/projects`, all selected project detail routes, `/writing`, all public writing routes, `/themes`, and all public theme routes.
  - targets are sorted deterministically.
  - asset paths are unique, local, under `social/generated/`, and derived from route plus digest.
  - digest is stable for identical source data and changes when title, description, labels, or route path changes.
  - hidden/draft/unselected project, writing, and theme records do not produce targets.
  - preview alt text is non-empty and specific to the route.

- Existing SEO tests
  - `metadataForProject(project)` references that project's expected preview image.
  - `metadataForWritingEntry(entry)` references that writing entry's expected preview image.
  - `metadataForTheme(theme)` references that theme's expected preview image.
  - `metadataForRoute(routeByPath("/projects" | "/writing" | "/themes"))` references index-specific preview images.
  - `twitter.image` equals `openGraph.image`.
  - JSON-LD image fields match the route metadata image URL.
  - fallback image remains valid for non-content routes if retained.

- `src/domain/freshness.test.ts`
  - findings are pure and accept `asOf` explicitly.
  - stale snapshot findings are deterministic.
  - unavailable GitHub metadata is reported without throwing.
  - missing social preview assets or digest drift is reported from target data.
  - external-link findings reuse or mirror release-readiness policy rules without live network calls.

Script verification:

- `scripts/generate-social-previews.ts`
  - import-safe when tested.
  - `--check` exits non-zero on asset drift.
  - no generated asset depends on current time, random values, remote fonts, remote images, network, or GitHub data beyond the checked-in snapshot.
  - managed cleanup cannot delete `public/social/bright-builds-og.png`, icons, sitemap, or robots.

- `scripts/verify-static/*`
  - route metadata image URLs must be canonical and local.
  - each metadata image URL must map to the expected route-derived asset.
  - every expected asset must exist in `.output/public`.
  - each expected PNG must be 1200x630.
  - generated static output must not include dynamic OG endpoint URLs, remote visual asset URLs, GitHub API URLs, public GitHub token names, or maintainer-only freshness error copy.

- `scripts/verify-release.ts`
  - budget all generated social preview assets, not just the old fallback.
  - keep route HTML, JS, and CSS budgets unchanged unless evidence shows a real need.
  - evidence labels should include static social preview asset coverage only after the release verifier actually checks those assets.
  - evidence labels must not include hosted social-card validation, live external-link checks, Cloudflare deployment, or network freshness checks unless those checks actually run in the command.

Browser verification:

- No browser route test is required just to prove Open Graph image tags; `.output/public` HTML checks are stronger and less flaky.
- Keep existing desktop/mobile dark layout, axe, keyboard, and reduced-motion route coverage.
- Add browser coverage only if visible UI changes are introduced while surfacing freshness status or social preview previews. The recommended v1.5 path keeps freshness reports out of visitor UI, so browser scope should stay mostly unchanged.

Manual release checks:

- Add a manual social-card smoke step to `docs/release-readiness.md` for at least one project, one writing route, and one theme route using the deployed or preview URL.
- Label it manual. Do not make local release evidence claim that social platforms fetched the image.
- Keep OpenLinks discoverable through existing footer/about/contact and JSON-LD `sameAs`; do not let generated social images make OpenLinks the primary brand for Bright Builds routes.

## Risks

| Risk | Why it matters | Mitigation |
| --- | --- | --- |
| Route/social target drift | Metadata, generated images, sitemap, and static verification can disagree if each keeps its own list. | Derive all social preview targets from `siteRoutes`, `projectDetailRoutes()`, `writingDetailRoutes()`, and `themeDetailRoutes()`. Ban hand-maintained social route arrays except as tests. |
| Singleton fallback assumption | Existing verifiers assume every route uses `social/bright-builds-og.png`. | Introduce route-aware expected image lookup and update all singleton checks together. Keep the fallback only for non-content routes. |
| Hidden or draft content leakage | Social previews are public files and metadata exposes them to crawlers. | Build targets only from public selectors. Unit-test draft/hidden/archived/unsupported/unselected exclusions. |
| Renderer nondeterminism | PNG output can drift across OS, renderer versions, fonts, or anti-aliasing settings. | Pin renderer dependency, bundle fonts if used, avoid browser screenshots, and make `--check` run on the clean builder before build. |
| Social crawler cache staleness | Stable image URLs can keep old previews alive after route copy changes. | Use route plus source digest in asset paths so metadata changes point crawlers at a new static URL. |
| Asset bloat | Per-route PNGs can grow quickly as routes expand. | Enforce per-image and aggregate social image budgets in `verify:release`; keep 1200x630 PNGs compressed and template-heavy, not photo-heavy. |
| Long title/label clipping | Project names like `Win3Bitco.in / Open Bitcoin Web Miner` can overflow preview cards. | Test longest known titles and clamp text in the pure renderer template. Prefer fewer labels over tiny unreadable text. |
| Escaping bugs in generated SVG/HTML templates | Curated copy can contain characters that break XML/SVG or metadata. | Centralize text escaping in the renderer/template module and test angle brackets, ampersands, quotes, and slashes. |
| Freshness checks becoming flaky gates | Live external links and GitHub API status can fail for reasons unrelated to the static site. | Keep network checks explicit/manual or scheduled. Default release gates should use checked-in snapshots, deterministic reports, and policy coverage. |
| Overclaiming release evidence | Current release labels intentionally exclude manual hosted checks. v1.5 could accidentally imply live crawler validation. | Update `releaseEvidenceLabels()` and release-readiness facts only for checks that run locally. Keep manual social-card and external-link smoke checks separate. |
| OpenLinks brand over-promotion | Generated route previews could accidentally center OpenLinks instead of Bright Builds route content. | Preserve OpenLinks as identity metadata and footer/about/contact discovery. Social previews should brand Bright Builds and the specific project, writing entry, or theme route. |
| Public maintenance copy leakage | Freshness reports may mention stale GitHub data or unavailable links. | Keep reports out of route rendering and keep existing forbidden-output checks for maintainer-only copy such as GitHub refresh failures. |
