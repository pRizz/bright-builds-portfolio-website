# Feature Research: v1.5 Static Shareability & Freshness

**Milestone:** v1.5 Static Shareability & Freshness
**Researched:** 2026-06-21
**Scope:** Expected behavior for route-derived social image data, deterministic static raster social images, metadata references, freshness reports, and release verification for project, writing, and theme route families.
**Overall confidence:** HIGH for local feature scope and repo integration; MEDIUM for exact third-party crawler rendering because social platforms can vary and cache aggressively.

## Executive Recommendation

Build v1.5 as a static shareability pipeline plus maintainer-facing freshness reports. The core product behavior is simple: every public project, writing, and theme route should have a route-specific static raster preview image, and the generated HTML should point crawlers at that asset through existing metadata helpers. The maintainer behavior is equally important: when curated data, GitHub metadata snapshots, primary links, or generated media drift, the repo should make that visible without adding runtime services or flaky network-dependent release gates.

Use the existing helper-derived route model as the source of truth. Project detail routes, writing index/detail routes, and theme index/detail routes already flow from typed domain registries into prerendering, metadata, sitemap, browser checks, and release evidence. v1.5 should extend that same pattern with a pure social-preview data layer that returns one share image contract per public route. Do not add a second route list, hand-maintained asset map, or image-specific content registry unless a tiny optional copy override is needed to keep text fitting inside the image template.

Generate committed or build-verified PNG assets from deterministic local templates, with stable filenames such as `/social/projects/{slug}.png`, `/social/writing/{slug}.png`, `/social/themes/{slug}.png`, and route-family index images. Keep the existing `/social/bright-builds-og.png` as the fallback for home/about/contact and as a safety net. The generated images should be 1200x630, dark-primary, readable at thumbnail size, and small enough to stay under the existing release image budget pattern.

Freshness should be reported with clear severity, not overclaimed. Local deterministic checks can block release when route metadata points to a missing image, an image has the wrong dimensions, a generated image is stale relative to its route data fingerprint, or evidence labels name checks that no longer run. Network-dependent checks such as live external-link reachability or current GitHub API state should remain manual, scheduled, or report-only unless a later milestone deliberately accepts the flake surface.

Evidence basis: the Open Graph protocol expects `og:title`, `og:type`, `og:image`, `og:url`, and supports structured image width, height, type, and alt fields (`https://ogp.me/`). Mastodon preview cards are generated from OpenGraph tags (`https://docs.joinmastodon.org/entities/PreviewCard/`). GitHub documents REST API rate limits, reinforcing that network-backed metadata checks should not silently become visitor-runtime dependencies (`https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api?apiVersion=2026-03-10`). Playwright can save screenshots to files, which keeps a local raster-generation path available without a new service (`https://playwright.dev/docs/screenshots`).

## Table Stakes

Features users and maintainers should expect. Missing these would make v1.5 feel incomplete or weaken the static release contract.

| Category | Feature | User/Maintainer Value | Complexity | Testable Behavior |
| --- | --- | --- | --- | --- |
| Route inventory | Helper-derived public share route list | Every public project, writing, and theme URL gets share coverage without copied route fixtures. | Medium | Unit tests prove the share route list equals `/projects`, all project detail routes, `/writing`, all public writing detail routes, `/themes`, and all public theme detail routes; hidden/draft/unsupported records are absent. |
| Route inventory | Existing fallback preserved | Home/about/contact and any future generic route still share cleanly before route-specific images exist. | Low | Metadata for non-v1.5 routes still references `/social/bright-builds-og.png`; release checks keep verifying fallback existence and dimensions. |
| Social data | Pure route-derived social image contracts | Maintainers can inspect exactly what text and asset path each route will use. | Medium | A pure helper returns route path, image path, title, eyebrow, short description, optional labels, alt text, dimensions, and a stable data fingerprint for every covered route. |
| Social data | Content fit constraints | Generated images stay readable and do not silently crop important titles or summaries. | Medium | Validation rejects empty titles, empty alt text, overlong unbreakable strings, unsupported route kinds, duplicate image paths, and missing required route data. |
| Social data | Minimal optional overrides | Maintainers can fix a bad preview without duplicating normal page copy. | Low | Optional social title/summary overrides are allowed only on the route's existing authoritative record or a tiny co-located map; tests prove the default path derives from project/writing/theme data. |
| Raster assets | Deterministic PNG generation | Social previews are stable, reviewable, and deploy as static files. | Medium | `bun run generate:social-images` or equivalent writes the same PNG bytes for unchanged inputs, with no network access, runtime endpoint, secrets, or crawler dependency. |
| Raster assets | Stable file layout | Crawlers and cached previews see durable URLs while maintainers can find assets quickly. | Low | Generated files live under route-family paths such as `public/social/projects/openlinks.png`; paths are slug-derived and collision-checked. |
| Raster assets | Image manifest | Maintainers can tell whether generated media matches current route data. | Medium | A generated manifest records route path, image path, dimensions, byte size, and data fingerprint; verification fails when manifest entries or files are missing or stale. |
| Raster assets | Dark-primary template quality | Preview cards visually match the site and remain readable in feed thumbnails. | Medium | Browser or image checks prove 1200x630 dimensions, nonblank output, readable text bounds, no obvious overflow, and file size within the release budget. |
| Metadata | Route metadata references correct image | Shared links show route-specific previews instead of a generic fallback. | Medium | `metadataForProject`, `metadataForWritingEntry`, `metadataForTheme`, and index-route metadata resolve to the route-specific image URL; static HTML contains matching OG/Twitter image tags. |
| Metadata | Absolute canonical image URLs | Social crawlers receive usable image URLs without JavaScript. | Low | Generated HTML uses `https://www.brightbuilds.us/social/...png` through `PageMetadata`, not relative URLs or runtime-computed values. |
| Metadata | Image alt text and dimensions | Metadata is more accessible and crawler-friendly. | Low | Static verifier checks `og:image`, `og:image:width`, `og:image:height`, `og:image:alt`, `twitter:image`, and `twitter:image:alt` for every covered route. Add `og:image:type` if the metadata model is touched. |
| Metadata | JSON-LD image consistency | Structured data does not point at the stale fallback while route metadata points elsewhere. | Medium | Project, writing, and theme JSON-LD image fields use the same route-specific social image URL as the route metadata. |
| Freshness | Generated media drift report | Maintainers see which preview assets need regeneration after content changes. | Medium | A report or verifier lists missing, stale, oversized, wrong-dimension, or orphaned social images by route. Local deterministic drift can fail release. |
| Freshness | GitHub metadata freshness report | Public GitHub facts stay reviewed without live visitor fetches. | Medium | A report reads `github-metadata.snapshot.json`, lists synced age, unavailable repos, rate-limited entries, stale pushed dates, and projects without direct repo metadata. It does not call GitHub unless explicitly running the existing sync command. |
| Freshness | Primary link review report | Maintainers can review public link health policy without flaky live checks. | Medium | A report lists all primary external origins, policy coverage, HTTPS violations, sensitive query keys, duplicate homepage links, and manual smoke-check targets. Live reachability stays manual/report-only. |
| Freshness | Clear severity buckets | Reports distinguish blockers from maintenance reminders. | Low | Output groups findings as `release blocker`, `needs review`, and `manual smoke`; automated evidence labels include only release blockers actually enforced by `bun run verify`. |
| Release | Static output verification | The production artifact proves the share contract before hydration. | Medium | `verify:static` checks every generated route HTML for route-specific social image metadata, JSON-LD image consistency, sitemap coverage, and local asset existence in `.output/public`. |
| Release | Release evidence stays truthful | The release summary remains useful and does not claim hosted checks. | Low | `verify:release` labels include social image generation/static metadata coverage only if those checks run locally; Cloudflare, preview, post-deploy, and live-link checks remain manual labels. |
| Release | Documentation names maintainer flow | Future releases can refresh and verify share assets without reverse-engineering scripts. | Low | Release-readiness docs explain when to run image generation, GitHub metadata sync/reporting, freshness reports, and the clean-builder `bun run install:browser && bun run verify` path. |

## Differentiators

Features that make the shareability/freshness milestone feel specific to this portfolio rather than a generic SEO pass. These are valuable, but they should remain subordinate to the table-stakes contract.

| Feature | Value Proposition | Complexity | Recommendation |
| --- | --- | --- | --- |
| Route-family image templates | Project, writing, and theme previews can communicate different intent at thumbnail size. | Medium | Build now if it fits one generator: projects show "Project Story" plus project name/status/themes; writing shows note/essay title, date, and topics; themes show theme title, audience/proof-point framing, and related work count. |
| Share preview review gallery | Maintainers can review all generated cards visually in one static local artifact. | Medium | Build if cheap after the generator exists; keep it out of public navigation and out of visitor-facing routes. |
| Data fingerprints in manifest | Freshness issues become explainable: "this image was generated from old route data." | Medium | Build now; it is the simplest robust way to prove images match source data. |
| Image text-fit audit | Prevents long project names or writing titles from creating broken cards. | Medium | Build now as deterministic validation; visual screenshot comparison can remain later if it adds flake. |
| Freshness trend report | Maintainers can see whether GitHub metadata and primary links are aging before release pressure. | Low-Medium | Build as report-only; do not make age alone a hard release failure unless the threshold is explicitly accepted later. |
| Social image checksum evidence | Release output can prove generated media did not change unexpectedly between source and `.output/public`. | Medium | Build if the manifest is already present; compare public source assets and built output by path/size/hash. |
| Manual smoke checklist seeded from data | Release docs can list the exact external links and representative routes to smoke-check. | Low | Build now by deriving checklist rows from existing profile/project/theme data and freshness reports. |

## Anti-Features

Features to explicitly not build in v1.5.

| Anti-Feature | Why Avoid | What to Do Instead |
| --- | --- | --- |
| Dynamic Open Graph endpoints | Adds server/runtime behavior and contradicts the static deployment contract. | Generate PNG files before release and serve them as static assets. |
| Runtime image generation in visitor paths | Makes social previews depend on code execution after deploy and can fail for crawlers. | Metadata should point at already-existing `/social/...png` assets. |
| CMS/admin/editor workflow | v1.5 is about shareability and freshness, not content operations. | Keep curated project, writing, and theme registries checked in. |
| Comments, newsletter, reactions, webmentions, analytics, or subscriptions | Adds product and moderation scope unrelated to static previews. | Use existing contact, project, and collaboration links. |
| Search/filter/tag archive pages | Discovery expansion is outside this milestone and would dilute the shareability work. | Keep route-family indexes and current sitemap coverage. |
| Live external-link release gates | Network checks are flaky and third-party availability should not block deterministic local release verification. | Produce report/manual smoke targets; keep live reachability manual or scheduled. |
| Raw GitHub mirror or runtime GitHub fetches | The portfolio already treats GitHub metadata as advisory and static. | Use the existing snapshot sync and report on snapshot age/status. |
| Per-platform crawler chasing as a release gate | X, Mastodon, Bluesky, LinkedIn, Facebook, and chat apps cache and crop differently. | Optimize standard OG/Twitter metadata and verify static HTML/assets locally; keep platform debuggers manual. |
| Hand-edited route PNGs | Manual binary editing will drift from route data and becomes untestable. | Generate from route data and allow only small text overrides in typed data when needed. |
| Public "freshness dashboard" route | A visitor-facing dashboard would turn maintenance state into product UI. | Keep freshness reports in scripts, release docs, or planning evidence. |
| OpenLinks prominence changes | v1.5 should not change the portfolio CTA hierarchy. | Preserve existing low-intrusion OpenLinks metadata/footer/profile behavior. |
| Time-based aggregate failures for GitHub age alone | A release gate that flips from passing to failing solely because the clock moved can be disruptive. | Report age and unavailable metadata; fail only on deterministic local inconsistency or explicit strict mode. |

## Requirement Categories

Use these categories when turning the research into v1.5 roadmap requirements.

### SHARE: Route-Derived Social Image Data

- Add a pure social image domain contract derived from existing project, writing, theme, route, and profile helpers.
- Covered routes should include `/projects`, every selected project detail route, `/writing`, every public writing detail route, `/themes`, and every public theme detail route.
- Non-covered routes should continue using the checked-in fallback social image.
- Each social image record should include `routePath`, `imagePath`, `title`, `description`, `eyebrow` or route kind, optional labels, `alt`, `width`, `height`, and a stable `dataFingerprint`.
- Validation should reject duplicate paths, missing route records, hidden/draft/unsupported content, empty text, non-local asset paths, unsafe characters, and text that cannot fit the template.
- Tests should prove the social route inventory updates automatically when public project/writing/theme route helpers change.

### IMAGE: Deterministic Static Raster Assets

- Add a local generator that renders all social image records into static PNG files under `public/social/`.
- The generator should be deterministic, network-free, token-free, and safe to rerun.
- The output should use the existing 1200x630 dimensions unless implementation discovers a compelling crawler or template reason to change; if dimensions change, update all metadata and release checks together.
- Generate a manifest that maps every covered route to its asset path, dimensions, byte size, and data fingerprint.
- Verification should fail for missing images, wrong dimensions, oversized files, stale fingerprints, orphaned generated images, blank images, or image paths not represented in the manifest.
- Generated assets should be reviewable in git or reproducible during release without mutating the production build unexpectedly. Prefer an explicit generation command before build over hidden build-time writes.

### META: Metadata And Structured Data References

- Extend `SocialImageMetadata` or related helpers so route-specific images are first-class metadata values.
- Project, writing, and theme metadata helpers should select route-specific images; generic route metadata should keep the fallback unless route-family index images are added for `/projects`, `/writing`, and `/themes`.
- Generated HTML should include route-specific `og:image`, `og:image:width`, `og:image:height`, `og:image:alt`, `twitter:image`, and `twitter:image:alt` values before hydration.
- Add `og:image:type` for generated PNGs when touching the metadata model; it is cheap and aligns with Open Graph structured image fields.
- Project, writing, and theme JSON-LD image fields should reference the same route-specific asset as OG/Twitter metadata.
- Metadata tests should assert absolute canonical image URLs and local asset mapping in `.output/public`.

### FRESH: Maintainer Freshness Reports

- Add a report command that summarizes public-facing metadata freshness without changing visitor runtime behavior.
- Generated media findings should be deterministic and release-blocking when stale, missing, orphaned, wrong-dimension, oversized, or inconsistent with route metadata.
- GitHub metadata findings should read the checked-in snapshot and report synced age, unavailable entries, rate-limit results, moved/missing repos, archived/template/fork flags, and reviewed homepage link additions. Do not call GitHub from the report unless an explicit sync mode is requested.
- Primary link findings should reuse the existing external-link policy shape and list HTTPS violations, uncovered origins, sensitive query keys, required primary links, duplicate homepage links, and manual smoke targets.
- Report output should separate `release blocker`, `needs review`, and `manual smoke` findings.
- Strict network-backed freshness can exist as an explicit maintainer command, but it should not be added to `bun run verify` unless the project later accepts live-network release gating.

### VERIFY: Release Verification And Evidence Labels

- Extend unit tests for social image data selection, path generation, manifest generation, stale detection, metadata selection, and JSON-LD image selection.
- Extend static verification to inspect built HTML and `.output/public` assets for every covered route.
- Extend release verification budgets from one fallback image to the route-specific generated social image set. Budget by per-image size and total social image bytes.
- Extend release-readiness docs and tests to mention the image generation command, manifest/freshness report, and route-family social image coverage.
- Update automated evidence labels only for checks included in `bun run verify`; keep preview deployment, hosted crawler debuggers, post-deploy smoke, and live external-link checks in the manual checklist.
- Keep the clean-builder release path truthful: if generated images must exist before `bun run verify`, docs and verification should say so explicitly.

## MVP Recommendation

Prioritize:

1. **SHARE:** Add pure route-derived social image records and validation for project, writing, and theme route families.
2. **IMAGE:** Generate deterministic 1200x630 PNG assets and a manifest under `public/social/`.
3. **META:** Wire metadata and JSON-LD image references to the generated assets.
4. **VERIFY:** Extend unit, static, release, and release-readiness checks so route metadata, image assets, manifest freshness, dimensions, budgets, and evidence labels are proven locally.
5. **FRESH:** Add a maintainer freshness report for generated media, GitHub metadata snapshots, and primary links, with deterministic blockers separated from manual/network review items.

Defer:

- Public freshness dashboards, CMS/admin, comments, newsletter, search/filter/tag archive pages, dynamic OG endpoints, runtime image generation, raw GitHub mirroring, visitor-runtime GitHub calls, live external-link release gates, platform-specific crawler debugger automation, and more prominent OpenLinks surfaces.

Recommended v1.5 phase shape:

1. **Social image data contract** - creates the helper-derived route inventory, social image records, validation, and unit tests. This should happen first because image generation, metadata, and verification all need one source of truth.
2. **Static raster generation** - adds the generator, manifest, committed/static assets, and deterministic asset checks.
3. **Metadata wiring** - updates OG/Twitter/JSON-LD references and generated static metadata verification.
4. **Freshness reporting and release evidence** - adds the maintainer report, docs, release-readiness tests, budget checks, and truthful evidence labels.
