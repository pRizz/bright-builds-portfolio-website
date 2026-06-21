# Stack Research: v1.5 Static Shareability & Freshness

**Project:** Bright Builds Portfolio Website
**Milestone:** v1.5 Static Shareability & Freshness
**Researched:** 2026-06-21
**Scope:** Stack additions or changes for deterministic static social preview generation, route metadata wiring, reviewed freshness reports, and truthful release verification.
**Overall confidence:** HIGH for metadata/report architecture, MEDIUM-HIGH for the recommended renderer dependency.

## Recommendation

Add one focused dev dependency for raster generation:

```bash
bun add -d @resvg/resvg-js@2.6.2
```

Keep everything else in repo-owned Bun/TypeScript scripts and pure domain helpers. Do not add a dynamic OG endpoint, serverless function, CMS, link-checking crawler, Python script, Puppeteer stack, or general image-processing pipeline.

Recommended approach:

| Area | Recommendation | Dependency Change | Confidence | Why |
| --- | --- | --- | --- | --- |
| Social image source data | Add a route-derived `src/domain/social-images.ts` helper | None | HIGH | Project, writing, theme, and top-level route helpers already exist; social image metadata should be another pure projection over those registries. |
| Raster image generation | Generate SVG templates in TypeScript and rasterize them with `@resvg/resvg-js@2.6.2` | Add dev dependency | MEDIUM-HIGH | `resvg-js` is purpose-built for SVG to PNG, supports custom fonts, can run directly in Bun, and avoids browser screenshot nondeterminism. |
| Font determinism | Commit one licensed TTF/OTF/WOFF font asset plus its license; use `loadSystemFonts: false` | Add checked-in asset, not npm dep | HIGH | Do not rely on host fonts or remote font fetches. Inter is a good default if the project wants a neutral UI face, but pin by checked-in file and license, not by Google Fonts at generation time. |
| Metadata wiring | Extend existing `SocialImageMetadata` and `metadataForRoute` / `metadataForProject` / `metadataForWritingEntry` / `metadataForTheme` | None | HIGH | Current `src/domain/seo.ts` already owns canonical OG/Twitter fields; v1.5 should replace the fallback-only image helper with route-specific image helpers. |
| Static image output | Write generated PNGs under `public/social/` using stable route-derived paths | None | HIGH | The SolidStart build already copies `public/` into `.output/public`; checked-in generated assets preserve the static deployment contract. |
| Generation manifest | Write a deterministic manifest with route, asset path, dimensions, source hash, byte length, and SHA-256 | None | HIGH | Lets verification prove images match current route data without timestamps or visitor-runtime work. |
| Freshness reports | Add Bun/TypeScript report scripts using `node:fs`, `node:crypto`, and native `fetch` only | None | HIGH | Existing repo rules prefer Bun/TS scripts; reports can be deterministic offline by default and optional-network when explicitly requested. |
| GitHub metadata refresh | Keep native `fetch`; add conditional-request support if the sync/report script is touched | None | MEDIUM-HIGH | GitHub documents ETag/Last-Modified conditional requests and the current repo already has a native REST sync script. Octokit is unnecessary for this narrow refresh/report surface. |
| Link freshness | Keep live external checks manual or explicit optional report mode | None | HIGH | Existing release policy intentionally avoids live external-link checks in the aggregate gate. Do not make `bun run verify` depend on third-party availability. |
| Release verification | Extend existing static and release verifiers; do not add a new test runner | None | HIGH | `scripts/verify-static/*` and `scripts/verify-release.ts` already scan generated HTML, metadata, assets, budgets, and truthful evidence labels. |

The most important stack decision is to treat generated social previews as static build artifacts, not as runtime behavior. The generator may use a dev dependency, but visitor routes should only reference checked-in files already present in `.output/public`.

## Stack Options

### Recommended: TypeScript SVG Template + `@resvg/resvg-js`

Use a repo-owned SVG template and render it to PNG with `@resvg/resvg-js@2.6.2`.

Why this is the right fit:

- It adds one narrow dev dependency for the only hard part: producing PNG files.
- It keeps the template inspectable and diffable as TypeScript/SVG, not hidden in a browser route.
- It supports custom font files and can disable system fonts, which is important for reproducible text layout.
- It avoids a dynamic OG endpoint and does not require a server during deployment.
- It works with Bun according to the `resvg-js` README.

Recommended scripts:

```json
{
  "scripts": {
    "generate:social-previews": "bun run scripts/generate-social-previews.ts",
    "verify:social-previews": "bun run scripts/verify-social-previews.ts",
    "report:freshness": "bun run scripts/report-freshness.ts",
    "report:freshness:live": "bun run scripts/report-freshness.ts --live"
  }
}
```

Recommended output paths:

```text
public/social/bright-builds-og.png
public/social/projects/index.png
public/social/projects/{slug}.png
public/social/writing/index.png
public/social/writing/{slug}.png
public/social/themes/index.png
public/social/themes/{slug}.png
src/domain/social-images.generated.json
```

Keep the current fallback `bright-builds-og.png` for home/about/contact and for defensive fallback behavior. Generate route-specific images for `/projects`, selected project detail routes, `/writing`, public writing detail routes, `/themes`, and public theme detail routes.

### Viable Fallback: Existing Playwright Screenshot Generation

Playwright can produce screenshots with a fixed viewport and disabled animations, and the repo already depends on `@playwright/test@1.60.0`. Use this only if the team decides that zero new dependencies matters more than pixel determinism.

Tradeoffs:

- Pros: no new npm package; can render real browser HTML/CSS.
- Cons: screenshots can vary by browser version, operating system, font stack, antialiasing, and viewport defaults unless the environment is tightly pinned.
- Role in v1.5: keep Playwright for browser/release verification, not as the primary image generator.

### Not Recommended First: Satori + `@resvg/resvg-js`

`satori@0.26.0` is useful for JSX-like HTML/CSS to SVG. It is not the first choice here.

Why not:

- It adds another layout engine and another dependency to a Solid repo.
- It accepts React-like object trees or its own JSX runtime, not Solid components.
- Its CSS support is intentionally limited and its README says it does not guarantee a 100 percent browser match.
- It requires explicit font data and currently does not support WOFF2.

Use Satori later only if the handwritten SVG template becomes genuinely brittle.

### Not Recommended: `@vercel/og`

`@vercel/og@0.11.1` is optimized for dynamic image generation through Vercel functions and `ImageResponse`. That conflicts with this milestone's explicit static-only constraint.

Why not:

- It points the architecture toward API routes/functions.
- It is more aligned with Vercel/Next dynamic OG workflows than SolidStart static output.
- It would weaken the no-server-endpoint decision even if run locally at build time.

### Not Recommended: Sharp

`sharp@0.35.2` supports Bun through Node-API and can process SVG/PNG, but it is broader than this project needs.

Why not:

- It is a general image processing stack around libvips.
- The v1.5 need is narrow SVG to PNG generation from controlled templates.
- `resvg-js` has a smaller conceptual surface for this exact job.

### Not Recommended for Release Gates: Linkinator or Similar Crawlers

`linkinator@7.6.1` and similar tools can crawl built HTML, but they should not enter `bun run verify` for v1.5.

Why not:

- Live external checks are network-dependent and will create false release blockers.
- The repo already separates external-link policy coverage from manual live checks.
- Native `fetch` is enough for an explicit optional freshness report mode.

## Integration Points

### Domain Helpers

Add a pure route-derived helper, likely `src/domain/social-images.ts`.

Recommended types:

```typescript
export type SocialImageKind = "fallback" | "project" | "writing" | "theme" | "collection";

export type SocialImageDefinition = {
  id: string;
  kind: SocialImageKind;
  route: string;
  assetPath: string;
  title: string;
  summary: string;
  eyebrow: string;
  tags: readonly string[];
  alt: string;
};
```

This helper should derive definitions from existing sources:

- `siteRoutes` for `/projects`, `/writing`, and `/themes`
- `projectDetailPageProjects()` and `projectDetailPath(project)`
- `publicWritingEntries()` and `writingDetailPath(entry)`
- `publicThemeEntries()` and `themeDetailPath(theme)`

Do not duplicate project, writing, or theme copy in the image registry. It should project from authoritative registries.

### SEO Metadata

Change `src/domain/seo.ts` from one fallback-only `socialImageForProfile()` helper to route-specific image selection.

Recommended behavior:

- `metadataForProject(project)` references `/social/projects/{slug}.png`.
- `metadataForWritingEntry(entry)` references `/social/writing/{slug}.png`.
- `metadataForTheme(theme)` references `/social/themes/{slug}.png`.
- `metadataForRoute(route)` uses `/social/projects/index.png`, `/social/writing/index.png`, or `/social/themes/index.png` for those index routes and keeps the fallback for home/about/contact.
- JSON-LD `image` values use the same social image URL as page metadata.

Extend `SocialImageMetadata` if useful:

```typescript
export type SocialImageMetadata = {
  url: string;
  width: number;
  height: number;
  alt: string;
  type: "image/png";
};
```

Then render `og:image:type` along with existing width, height, and alt fields. Open Graph supports image type, width, height, and alt; the current metadata already handles all but type.

### Generator Script

Add `scripts/generate-social-previews.ts`.

Recommended behavior:

- Read social image definitions from the domain helper.
- Build deterministic SVG strings with escaped text, fixed 1200 x 630 dimensions, fixed colors, no dates, no randomness, no remote assets, and no external CSS.
- Use checked-in fonts via `font.fontFiles` and set `loadSystemFonts: false`.
- Render PNGs with `@resvg/resvg-js`.
- Write all generated images to `public/social/`.
- Write `src/domain/social-images.generated.json` with sorted entries and no timestamp.
- Include SHA-256 and source hash values so check mode can detect stale assets.

Do not fetch fonts, logos, screenshots, avatars, repository images, or live pages during generation. If a visual mark is needed, use existing checked-in local assets or SVG primitives.

### Freshness Reports

Add `scripts/report-freshness.ts` with an offline default.

Offline report should check:

- GitHub metadata snapshot age from `src/domain/github-metadata.snapshot.json`.
- Whether selected repository links still have snapshot entries.
- Whether unavailable GitHub metadata records need review.
- Whether generated social preview definitions match generated assets and manifest hashes.
- Whether route metadata points to existing generated images.
- Whether primary external links are covered by existing external-link policies.
- Whether release-readiness docs claim only checks that actually run.

Optional `--live` mode may check:

- Primary external links with native `fetch`, short timeout, low concurrency, and HEAD-to-GET fallback.
- GitHub repository metadata through the existing REST API path.
- Redirect targets for curated primary links.

Keep `--live` out of `bun run verify`. If live mode writes a report, label it as a manual/review report rather than automated release evidence.

### GitHub Metadata Sync

Do not add Octokit for v1.5. The current `scripts/sync-github-metadata.ts` already uses native `fetch` and typed snapshot data.

If the sync script is touched, improve it with:

- Explicit `User-Agent`.
- Conditional `If-None-Match` / `If-Modified-Since` support.
- Captured `ETag` / `Last-Modified` in a script-owned cache or report artifact.
- Current `X-GitHub-Api-Version: 2026-03-10`, which GitHub documents as available.

Do not expose GitHub tokens through `VITE_`, `PUBLIC_`, or `SOLID_PUBLIC_` prefixes. Preserve the current visitor-runtime GitHub ban.

### Static Verification

Update the existing verifier instead of adding a second static verifier.

Expected changes:

- `scripts/verify-static/metadata-jsonld-verifier.ts`: replace the hardcoded `social/bright-builds-og.png` assertion with route-derived expected image paths.
- `scripts/verify-static/sitemap-assets-verifier.ts`: iterate all expected social PNGs, assert file existence, assert 1200 x 630 PNG dimensions, and detect stale extra generated assets if they are not intentionally kept.
- `scripts/verify-static/run-static-verification.ts`: update summary text to mention route-specific social images.
- Tests: update existing metadata tests that currently assert fallback reuse for project, writing, and theme detail routes.

### Release Verification

Update `scripts/verify-release.ts`.

Expected changes:

- Replace the single `socialOgImageBytes` budget with per-image and total social image budgets.
- Scan all `social/**/*.png` files that are referenced by route metadata.
- Verify no generated HTML points to missing social images.
- Add evidence label `static social previews` only if the verifier checks generated assets and route metadata references.
- Keep live social crawler/debugger validation out of automated labels.

Suggested budgets:

| Budget | Suggested Limit | Reason |
| --- | --- | --- |
| One social PNG | 250 KB | Matches the current fallback budget and keeps cards crawler-friendly. |
| Total generated social images | 4 MB | Enough for a curated portfolio route set without hiding runaway assets. |
| Route HTML | Keep current 75 KB | Social image metadata should not materially inflate HTML. |

### Release Docs

Update `docs/release-readiness.md` and `scripts/release-readiness.ts` facts after implementation.

The documentation should say:

- `bun run verify:static` checks route-specific social metadata and local generated images.
- `bun run verify:release` checks social preview budgets and metadata references.
- Optional live freshness reports are manual/review evidence, not aggregate release gates.
- Meta Sharing Debugger and other hosted preview tools remain manual post-deploy checks if needed.

## Risks

### Native Renderer Compatibility

`@resvg/resvg-js` uses native prebuilt packages. Its README says it runs directly in Bun, but this still needs clean-builder verification after adoption.

Mitigation:

- Pin `@resvg/resvg-js@2.6.2`.
- Run `bun install` on a clean checkout.
- Add `bun run verify:social-previews` to the aggregate gate.
- Keep generated PNGs checked in so static deploys do not require runtime rasterization.

### Font Drift

Host fonts will make generated images non-deterministic.

Mitigation:

- Commit the font file and license.
- Load only checked-in font files.
- Disable system font loading.
- Do not fetch Google Fonts or any remote font source during generation.

### SVG Text Layout Bugs

Handwritten SVG means the project owns wrapping, clamping, and escaping.

Mitigation:

- Keep social card copy short and derive it from existing route summaries.
- Unit test line splitting and escaping as pure functions.
- Clamp title and summary lines with explicit fallback text.
- Add browser/static visual spot checks for at least one project, writing, and theme image after generation.

### Social Crawler Cache Staleness

Local verification can prove metadata and assets, but it cannot prove Facebook, X, Slack, Discord, or LinkedIn have refreshed their scraper caches.

Mitigation:

- Do not claim crawler validation in automated evidence labels.
- Use manual debugger/scrape-again tools only in release checklists.
- If cache busting becomes a real problem, move from stable route-derived filenames to content-hashed filenames backed by the generated manifest.

### Live Link Flakiness

External links can fail because of rate limits, bot defenses, transient outages, redirects, or local network state.

Mitigation:

- Keep live link checks out of `bun run verify`.
- Make live checks explicit with `report:freshness:live`.
- Keep the default freshness report offline and deterministic.

### Stale Generated Assets

Route data can change without regenerating images.

Mitigation:

- Store source hashes in `social-images.generated.json`.
- Make `verify:social-previews` fail when source hashes or file hashes differ.
- Keep generation output sorted and timestamp-free to avoid noisy churn.

### Overclaiming Release Evidence

The repo already has a policy of truthful evidence labels. v1.5 can easily overclaim "freshness" or "social preview validation" if network/manual checks are blurred into local checks.

Mitigation:

- Use labels like `static social previews` and `freshness report contract`.
- Avoid labels like `social crawler verified`, `external links live`, or `GitHub metadata current` unless the specific check ran and passed.

## Source Notes

### Local Sources Read

- `.planning/PROJECT.md`
- `.planning/MILESTONES.md`
- `.planning/milestones/v1.4-REQUIREMENTS.md`
- `package.json`
- `src/domain/seo.ts`
- `src/domain/routes.ts`
- `scripts/verify-static.ts`
- `scripts/verify-release.ts`
- `scripts/verify-static/*`
- `scripts/release-readiness.ts`
- `scripts/sync-github-metadata.ts`
- `src/domain/github-metadata.ts`
- `AGENTS.md`
- `AGENTS.bright-builds.md`
- `standards-overrides.md`
- `standards/index.md`
- `standards/core/architecture.md`
- `standards/core/code-shape.md`
- `standards/core/testing.md`
- `standards/core/verification.md`
- `standards/languages/typescript-javascript.md`

### Primary / Current External Sources

- Open Graph protocol: `https://ogp.me/`
  - Confirms required `og:title`, `og:type`, `og:image`, `og:url`, plus structured image fields `og:image:type`, `og:image:width`, `og:image:height`, and `og:image:alt`.
- Meta image guidance: `https://developers.facebook.com/docs/sharing/webmasters/images/`
  - Recommends 1200 x 630 images for high-resolution sharing previews.
- `resvg-js` README: `https://github.com/thx/resvg-js`
  - Documents SVG to PNG support, custom fonts, `loadSystemFonts: false`, prebuilt native packages, and direct Bun compatibility.
- Satori README: `https://github.com/vercel/satori`
  - Documents JSX/object input, HTML/CSS subset, custom font requirements, and WOFF2 limitation.
- Vercel OG Image Generation docs: `https://vercel.com/docs/og-image-generation`
  - Documents dynamic/function-oriented `@vercel/og` usage, which is why it is not recommended for this static milestone.
- Sharp docs: `https://sharp.pixelplumbing.com/`
  - Confirms Sharp supports Bun and SVG/PNG processing, but its general image-processing scope is broader than this need.
- Playwright screenshot docs/API: `https://playwright.dev/docs/screenshots`, `https://playwright.dev/docs/api/class-page`
  - Confirms screenshot capture, fixed viewport behavior, clipping, PNG output, and disabled animations for screenshot repeatability.
- Bun runtime docs: `https://bun.com/docs/runtime`
  - Confirms Bun runs TypeScript files and package scripts directly.
- GitHub REST API versioning: `https://docs.github.com/en/rest/about-the-rest-api/api-versions`
  - Confirms `X-GitHub-Api-Version: 2026-03-10` is documented and supported.
- GitHub REST API best practices: `https://docs.github.com/en/rest/using-the-rest-api/best-practices-for-using-the-rest-api`
  - Confirms ETag/Last-Modified conditional requests and 304 behavior.
- GitHub REST API rate limits: `https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api?apiVersion=2026-03-10`
  - Confirms authenticated and unauthenticated rate-limit behavior and rate-limit headers.
- GitHub REST getting started: `https://docs.github.com/en/rest/using-the-rest-api/getting-started-with-the-rest-api?apiVersion=2026-03-10`
  - Confirms accepted headers and recommends a valid `User-Agent`.
- Inter font official/GitHub sources: `https://rsms.me/inter/`, `https://github.com/rsms/inter`
  - Inter is a reasonable checked-in font candidate because it is open source under the SIL Open Font License. The implementation still needs to commit the exact font file and license.

### Version Checks

Checked package versions through npm metadata on 2026-06-21:

| Package | Current Version Checked | Recommendation |
| --- | --- | --- |
| `@resvg/resvg-js` | `2.6.2` | Add as dev dependency. |
| `satori` | `0.26.0` | Do not add initially. |
| `@vercel/og` | `0.11.1` | Do not add. |
| `sharp` | `0.35.2` | Do not add initially. |
| `linkinator` | `7.6.1` | Do not add to release gate. |
| `playwright` | `1.61.0` latest, repo has `@playwright/test@1.60.0` | Keep existing Playwright for verification; no upgrade required for v1.5 research. |

## Roadmap Implications

Suggested phase order:

1. **Social image data contract** - Add route-derived definitions and metadata path helpers first so generation, SEO, and tests share one source.
2. **Static raster generation** - Add `@resvg/resvg-js`, checked-in font asset, generator, manifest, and check mode.
3. **Metadata wiring** - Point project, writing, theme, and collection route metadata/JSON-LD at generated images.
4. **Freshness reports** - Add offline report automation and optional live mode without entering the aggregate release gate.
5. **Release verification** - Extend static/release verifiers, budgets, evidence labels, and release-readiness docs.

This order prevents the image generator from inventing its own route list and keeps release verification grounded in the same helper contracts that route rendering and sitemap generation already use.
