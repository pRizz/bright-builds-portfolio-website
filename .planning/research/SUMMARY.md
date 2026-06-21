# v1.5 Research Summary: Static Shareability & Freshness

**Project:** Bright Builds Portfolio Website
**Milestone:** v1.5 Static Shareability & Freshness
**Researched:** 2026-06-21
**Synthesized:** 2026-06-21
**Confidence:** HIGH for repo architecture and local verification shape; MEDIUM-HIGH for renderer dependency behavior until clean-builder verification proves it.

## Executive Recommendation

Build v1.5 as a deterministic static shareability pipeline plus maintainer-facing freshness evidence. Every public project, writing, and theme route should derive a social preview contract from existing route/domain helpers, generate a static 1200x630 PNG asset before release, and point Open Graph, Twitter, and JSON-LD image metadata at that local asset in prerendered HTML. Keep `/social/bright-builds-og.png` as the fallback for home/about/contact and future generic routes.

The milestone should not add runtime services. No dynamic OG endpoint, API route, serverless function, live GitHub visitor fetch, CMS, public freshness dashboard, or live external-link release gate belongs in v1.5. Freshness belongs in deterministic reports over checked-in data and generated media, with optional live checks only as explicit manual/report commands outside `bun run verify`.

The safest architecture is the existing Bright Builds pattern: functional core, imperative shell. Add one pure route-derived social preview target layer, reuse it from metadata, generation, freshness reporting, static verification, and release evidence, then keep Bun scripts as thin filesystem/rendering shells. OpenLinks should remain low-intrusion identity context through existing profile/footer/about/metadata surfaces; generic social cards should brand Bright Builds, Peter Ryszkiewicz/pRizz, and the specific route content, not OpenLinks.

## Stack Additions

- Add `@resvg/resvg-js@2.6.2` as the single new dev dependency for SVG-to-PNG raster generation. It is narrower and more deterministic than browser screenshots, Sharp, Satori, or `@vercel/og`.
- Commit one licensed local font file and license. Load only checked-in fonts with `loadSystemFonts: false`; do not fetch Google Fonts or rely on host fonts.
- Keep generator, verifier, and freshness tooling in Bun/TypeScript scripts. Do not add Python scripts, Puppeteer stacks, server endpoints, link crawlers, or CMS/runtime services.
- Prefer route-derived generated paths under `public/social/generated/` with a source digest in the filename, such as `/social/generated/projects/openlinks-{digest}.png`. The digest gives crawler cache busting when route copy changes while preserving deterministic static assets.
- Generate a timestamp-free manifest containing route path, asset path, dimensions, byte size, source digest, and file SHA-256.
- Keep GitHub metadata refresh on the existing native `fetch` script path. If touched, improve conditional requests and headers; do not add Octokit for this milestone.
- Add scripts shaped around:
  - `generate:social-previews`
  - `verify:social-previews`
  - `freshness:report`
  - optional `freshness:report:live` or equivalent manual live mode, not wired into aggregate verification.

## Feature Table Stakes

- Helper-derived route inventory for `/projects`, every selected project detail route, `/writing`, every public writing route, `/themes`, and every public theme route. Hidden, draft, unsupported, archived, and unselected records must not produce public social assets.
- Pure social image contracts that include route path, asset path, title, description, route kind/kicker, labels, alt text, dimensions, and stable source fingerprint. Avoid copied route lists and image-only content registries.
- Deterministic PNG generation with no network access, secrets, clocks, randomness, remote fonts, remote images, screenshot services, or runtime crawler dependency.
- Route-specific metadata for project, writing, theme, and route-family index pages. `og:image`, `twitter:image`, JSON-LD `image`, dimensions, alt text, and `og:image:type` should resolve to the same canonical local asset.
- Static fallback preservation for non-v1.5 routes so home/about/contact still share cleanly.
- Generated media verification that fails on missing files, wrong dimensions, stale source digests, orphaned managed assets, oversized PNGs, blank output, duplicate paths, or metadata pointing to a missing local file.
- Offline freshness report that summarizes generated-media drift, GitHub snapshot age/unavailable records, primary link policy coverage, HTTPS issues, manual smoke targets, and evidence-label truthfulness.
- Severity buckets: `release blocker`, `needs review`, and `manual smoke`. Only deterministic local blockers belong in automated release gates.
- Release docs and evidence labels that say exactly what ran locally. Hosted crawler debuggers, Cloudflare preview/deploy checks, post-deploy smoke, live link reachability, and live GitHub currency remain manual unless a later milestone deliberately accepts that flake surface.

## Architecture Direction

Create one route-derived domain layer, likely `src/domain/social-previews.ts`, as the source of truth for shareable route targets. It should compose existing project, writing, theme, and route helpers, derive public asset paths and source digests, and expose typed records that can be consumed by SEO helpers, generation scripts, freshness reports, static verifiers, release verifiers, and docs.

Keep rendering and reporting as thin imperative shells:

- `src/domain/social-previews.ts` owns pure target derivation, path conventions, text/alt rules, public filtering, and source digests.
- `src/domain/seo.ts` becomes route-aware and maps project, writing, theme, and index metadata to expected social preview assets.
- `scripts/generate-social-previews.ts` renders deterministic SVG templates to PNG files and writes the manifest under managed generated paths only.
- `src/domain/freshness.ts` owns pure report findings over checked-in snapshots, curated links, social preview targets, and generated manifests, with `asOf` injected.
- `scripts/generate-freshness-report.ts` writes maintainer reports. Default mode is offline and deterministic; live mode is explicit and report-only.
- `scripts/verify-static/*` and `scripts/verify-release.ts` should consume the same helper/manifest rather than hard-coding social image routes.

The main current architectural mismatch is the singleton fallback assumption around `social/bright-builds-og.png`. v1.5 should replace that assumption with route-aware expected image lookup while keeping the fallback as a real checked-in safety net for generic routes.

## Watch Outs

- Dynamic OG/server creep: reject API routes, edge functions, runtime renderers, `/api/og`, visitor-runtime `fetch()`, and metadata images that do not exist in `.output/public`.
- Duplicated route/image lists: the generator, metadata helpers, sitemap/static checks, and release verification must not maintain separate slug arrays.
- Metadata drift: `og:image`, `twitter:image`, and JSON-LD `image` must agree and map to canonical local files in static output.
- Non-deterministic assets: avoid host fonts, timestamps, random IDs, unsorted data, browser screenshot antialiasing, and rewriting PNGs when bytes are unchanged.
- Readability and accessibility: social cards need dark-primary contrast, safe margins, title/summary clamping, route-specific alt text, and stress fixtures for long project, writing, and theme titles.
- Flaky live gates: live GitHub sync, external-link crawls, social-platform validators, and hosted crawler checks must stay out of `bun run verify`.
- Freshness reports becoming content authority: reports may write report artifacts, not mutate curated project, writing, or theme records based on live service state.
- OpenLinks over-promotion: keep OpenLinks as identity context and allow route-specific OpenLinks copy only where OpenLinks is genuinely central.
- Asset bloat: enforce per-image and total social PNG budgets in release verification.
- Release overclaiming: evidence labels should say `static social previews` or `freshness report contract`, not `social platforms validated`, `external links live`, or `GitHub metadata current`.

## Recommended Phases

### Phase 24: Social Image Data Contract

**Rationale:** Every later phase needs one answer to "which social image belongs to this public route?"

**Delivers:** Route-derived `SocialPreviewTarget` records, deterministic path/digest rules, title/summary/label/alt constraints, fallback behavior, public-only filtering, OpenLinks allowlist rules, and unit tests that compare target routes to existing project/writing/theme helpers.

**Avoids:** Duplicated route lists, hidden content leakage, copied metadata strings, image-only content registries, and generic OpenLinks promotion.

**Research flag:** Standard local pattern. Planning should focus on exact field names, path convention, and text budgets rather than external research.

### Phase 25: Deterministic Static Image Generation

**Rationale:** Once route targets are stable, generation can be a pure projection from source data into reviewed static assets.

**Delivers:** `@resvg/resvg-js@2.6.2`, checked-in font asset/license, SVG template renderer, `generate:social-previews`, `verify:social-previews`, generated PNGs, manifest/check mode, managed cleanup for `public/social/generated/`, and a contact sheet or equivalent review artifact if cheap.

**Avoids:** Dynamic OG endpoints, browser screenshot nondeterminism, host font drift, binary churn, text clipping, and unsafe cleanup of the fallback image or unrelated public assets.

**Research flag:** Needs implementation validation on a clean builder because `resvg-js` uses native prebuilt packages. Also validate long-title layout with real route data.

### Phase 26: Metadata Wiring and Static References

**Rationale:** Metadata should reference generated paths only after the path contract and generated assets exist.

**Delivers:** Route-aware `src/domain/seo.ts`, project/writing/theme/index social image selection, `og:image:type`, JSON-LD image parity, updated metadata tests, and static HTML checks that prove canonical image URLs map to local `.output/public` files.

**Avoids:** Fallback reuse on shareable content routes, relative image URLs, non-canonical origins, mismatched OG/Twitter/JSON-LD images, and route component metadata drift.

**Research flag:** Standard local SEO/static verification pattern. Skip additional research unless implementation exposes a SolidStart metadata edge case.

### Phase 27: Freshness Reports and Reviewed Snapshot Policy

**Rationale:** Freshness becomes useful only after generated media and metadata references exist for the report to inspect.

**Delivers:** Offline freshness findings over generated media, GitHub snapshot age/unavailable records, primary link policy coverage, HTTPS/query issues, manual smoke targets, reviewed status, and optional explicit live report mode outside aggregate verification.

**Avoids:** Live-network release failures, visitor-runtime GitHub fetches, reports mutating curated content, public maintenance dashboards, and claims that metadata is live-current when only checked-in snapshots were reviewed.

**Research flag:** Standard local reporting pattern. Deeper research is unnecessary unless the project later wants scheduled live checks or platform-specific crawler automation.

### Phase 28: Verification and Release Contract

**Rationale:** The milestone is only complete when the local release gate proves the implemented static contract without overclaiming hosted/manual checks.

**Delivers:** `verify:social-previews` in the aggregate gate before build, expanded `verify:static`, expanded `verify:release`, per-image and total social PNG budgets, release-readiness docs/facts, truthful evidence labels, and a manual social-card smoke checklist for one project, one writing route, and one theme route.

**Avoids:** Verifier bloat, representative-route-only coverage, manual checks mislabeled as automated evidence, live external-link gates, hosted crawler claims, and stale generated media in clean-builder releases.

**Research flag:** Mostly standard local verifier work. Use targeted codebase research only if static verifier modules become too large or need a split.

## Deferred/Out of Scope

- Dynamic Open Graph endpoints, `@vercel/og`, API routes, edge/serverless functions, runtime image generation, remote screenshot services, and visitor-runtime image/data fetches.
- Live external-link release gates, social-platform debugger automation, hosted crawler validation, and live GitHub freshness inside `bun run verify`.
- CMS/admin/editor workflows, authentication, databases, public freshness dashboards, analytics pipelines, comments, newsletters, reactions, webmentions, subscriptions, search/filter/tag archives, RSS, or pagination.
- Raw GitHub mirroring, auto-surfacing every public repo, live GitHub facts in visitor paths, and automated mutation of curated project/writing/theme records from freshness reports.
- Hand-edited route PNGs or manually maintained route-to-image maps.
- More prominent OpenLinks branding or primary CTA changes. Keep OpenLinks discoverable as low-intrusion identity context and use OpenLinks-specific social-card copy only for routes where OpenLinks is actually the subject.
- New broad image-processing, crawler, browser-rendering, or Python automation stacks. The only recommended dependency addition is the narrow SVG-to-PNG renderer.

---

*Ready for roadmap: yes*
