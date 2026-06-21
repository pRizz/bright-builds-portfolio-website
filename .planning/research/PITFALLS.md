# Domain Pitfalls: v1.5 Static Shareability & Freshness

## Context

**Project:** Bright Builds Portfolio Website
**Milestone focus:** Deterministic static social preview assets and non-runtime freshness evidence for project, writing, and theme routes
**Researched:** 2026-06-21
**Overall confidence:** HIGH for repo-specific implementation risks; MEDIUM for exact external crawler behavior because platform validators and docs can change independently.

v1.5 is a follow-on to a mature static portfolio, not a greenfield SEO pass. The repo already has typed project, writing, and theme domain helpers; `prerenderRoutes` and `sitemapRoutes`; static metadata helpers in `src/domain/seo.ts`; checked-in `public/social/bright-builds-og.png`; modular generated-output verification under `scripts/verify-static/`; and a release gate of `bun run install:browser && bun run verify`.

The current social-preview contract is intentionally simple: every route gets `https://www.brightbuilds.us/social/bright-builds-og.png`, the file is a checked-in 1200x630 PNG, `verify:static` asserts metadata fields and local asset presence, and `verify:release` enforces one hard-coded social image budget. v1.5 should replace that one-image contract with a route-derived static image contract, not add a parallel ad hoc list of image files.

Freshness is already scoped carefully. GitHub metadata is advisory, checked in, and currently synced at `2026-05-27T12:48:17.905Z`; the project started v1.5 on 2026-06-21. The sync script may fetch GitHub, but the aggregate verifier does not run it. Existing release-readiness policy keeps third-party link reachability manual because live services can rate-limit, block automation, or be unavailable outside this repo.

Source notes that materially informed this file:

- Repo instructions: `AGENTS.md`, `AGENTS.bright-builds.md`, `standards/core/verification.md`, and `standards/languages/typescript-javascript.md`.
- Project evidence: `.planning/PROJECT.md`, `.planning/RETROSPECTIVE.md`, `.planning/milestones/v1.4-REQUIREMENTS.md`, `src/domain/seo.ts`, `scripts/verify-static.ts`, and `scripts/verify-release.ts`.
- Official Open Graph protocol: https://ogp.me/ confirms basic `og:title`, `og:type`, `og:image`, `og:url` tags and structured `og:image:width`, `og:image:height`, and `og:image:alt`.
- GitHub REST API rate-limit docs: https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api confirm unauthenticated request limits, 403/429 rate-limit behavior, and secondary rate limits. This supports keeping live GitHub checks out of deterministic local release gates.
- Meta sharing docs were discoverable at https://developers.facebook.com/docs/sharing/webmasters/images/, but direct fetches returned live-service friction during research. Treat Meta/X/LinkedIn preview validators as manual release smoke checks, not local proof.

## Critical Pitfalls

### Pitfall 1: Dynamic OG or Server Creep

**Recommended phase:** Phase 25 - Deterministic Static Image Generation

**What goes wrong:** The implementation adds a dynamic Open Graph image endpoint, server route, edge function, runtime image renderer, remote screenshot service, or visitor-runtime `fetch()` path because dynamic OG examples are common in other frameworks.

**Warning signs:**

- New files appear under `src/routes/api`, `src/routes/og`, or equivalent server-only routing surfaces.
- Metadata points at `/api/og?...`, a third-party URL, or an image URL that does not exist in `.output/public`.
- `verify` or route rendering imports `node:fs`, `@octokit/*`, image-generation services, or secret-backed clients from visitor-facing code.
- Release docs start referring to server functions, edge rendering, or hosted image generation.

**Consequences:**

- The Cloudflare/static deployment contract is weakened; `.output/public` is no longer the whole product.
- Crawlers depend on a server path that the local release gate does not prove.
- Token, rate-limit, cold-start, cache, and hosted-function failures enter a site that is supposed to be deterministic and static.

**Prevention:**

- Generate raster images from a Bun/TypeScript build-time script that writes checked-in static files under `public/social/`.
- Keep image data in pure domain helpers and keep the renderer as an imperative shell.
- Do not add API routes, server functions, dynamic OG endpoints, remote image services, or visitor-runtime fetches for social previews.
- Extend `verify:no-github-runtime`, generated-output forbidden scans, and release-readiness docs to reject dynamic OG/server residue.

**Detection:**

- `bun run build && bun run verify:static && bun run verify:release` proves every metadata image URL maps to a local file in `.output/public`.
- `rg -n "api/og|server\\$|createServer|fetch\\(|@octokit|GITHUB_TOKEN" src scripts tests docs` has no visitor-runtime social-image hits.
- Built output contains no remote `<img src>`, `srcset`, or CSS `url(https://...)` visual assets.

### Pitfall 2: Duplicated Route and Image Lists

**Recommended phase:** Phase 24 - Social Image Data Contract

**What goes wrong:** Project, writing, theme, generator, metadata, sitemap, browser tests, and release verifiers each maintain their own route-to-image arrays. A route can render and be shareable while its image, metadata, or verification entry silently drifts.

**Warning signs:**

- Hard-coded route arrays such as `["/projects/openlinks", "/writing/..."]` appear in the image generator or static verifier beyond representative smoke tests.
- Image paths are hand-authored in route components instead of derived by helpers.
- `metadataForProject`, `metadataForWritingEntry`, and `metadataForTheme` build social image paths differently.
- Adding a public theme/writing/project route requires editing multiple social image lists.

**Consequences:**

- Some public routes keep the fallback image while others get route-specific assets.
- Hidden or unsupported records can leak into generated image files.
- Verification passes the copied list instead of the route family actually shipped in `prerenderRoutes`.

**Prevention:**

- Add one route-derived social image helper surface, for example `socialPreviewEntries()`, composed from `projectDetailRoutes()`, `writingDetailRoutes()`, `themeDetailRoutes()`, and top-level `siteRoutes` as needed.
- Make each entry carry route path, stable asset path, title text, supporting text, kind, alt text, width, and height.
- Use the same helper in the generator, `src/domain/seo.ts`, static verification, budget checks, and release docs.
- Keep route helpers as source of truth; do not duplicate selected project, published writing, or public theme slug lists.

**Detection:**

- Unit tests assert the social image entry route set equals the intended public project, writing, and theme route helpers.
- Static verification asserts every public route metadata image is present in the social image entry set.
- Code review finds only representative smoke routes hard-coded; the full coverage path is helper-derived.

### Pitfall 3: Metadata References Drift From Generated Assets

**Recommended phase:** Phase 26 - Metadata Wiring and Static References

**What goes wrong:** Static images are generated, but route metadata still points at the old fallback, a wrong slug path, a relative URL, a non-canonical origin, or an image that was not emitted to `.output/public`.

**Warning signs:**

- `assertMetadataImageMapsToLocalAsset()` stays hard-coded to `social/bright-builds-og.png`.
- Route components calculate `<Meta property="og:image">` independently from `src/domain/seo.ts`.
- `twitter:image`, `og:image`, and JSON-LD `image` point to different files without a documented reason.
- Metadata image URLs are relative paths or use a non-canonical origin.

**Consequences:**

- Social sharing is inconsistent across crawlers even though local route rendering works.
- The release gate can claim route-specific social images while crawlers still receive the fallback.
- Cache invalidation becomes guesswork because a route's image URL does not identify the intended asset.

**Prevention:**

- Extend `SocialImageMetadata` and `socialImageForProfile` into route-aware helpers that return absolute canonical URLs and local asset paths.
- Wire `metadataForProject`, `metadataForWritingEntry`, and `metadataForTheme` through the route-derived social image helper.
- Keep `og:image`, `twitter:image`, and JSON-LD `image` aligned unless a specific crawler requirement is documented.
- Use stable deterministic paths such as `social/projects/{slug}.png`, `social/writing/{slug}.png`, and `social/themes/{slug}.png`.

**Detection:**

- `verify:static` checks `og:image`, width, height, alt, `twitter:image`, `twitter:image:alt`, and JSON-LD image for every public route.
- Metadata URL origin equals `peterProfile.canonicalOrigin`.
- Every metadata image URL maps to a checked-in output asset with expected dimensions.

### Pitfall 4: Generated Asset Churn and Non-Determinism

**Recommended phase:** Phase 25 - Deterministic Static Image Generation

**What goes wrong:** The generator rewrites PNG bytes on every run, produces different output across machines, embeds timestamps, uses random IDs, depends on host fonts, or captures browser screenshots whose antialiasing varies by OS.

**Warning signs:**

- Running the generator twice produces a git diff.
- Image files include generated-at timestamps, build IDs, random seeds, or unsorted data.
- The generator writes all images even when route data is unchanged.
- CI fails on image diffs that cannot be reproduced locally.

**Consequences:**

- The repo gets noisy binary churn and hard-to-review diffs.
- Release verification becomes unstable even when content has not changed.
- Maintainers lose trust in generated assets and bypass the generator.

**Prevention:**

- Make image inputs deterministic: sorted routes, normalized text, checked-in fonts/assets, fixed viewport/dimensions, fixed color tokens, and no clock/randomness in image content.
- Prefer a TS/Bun script aligned with repo standards; do not add Python automation for convenience.
- Write files only when content changes.
- Add a manifest or text-layer spec that can be reviewed without visually diffing every PNG.
- Keep generated social images checked in if the release artifact must be inspectable without runtime generation.

**Detection:**

- A deterministic check runs generator twice and expects no diff.
- `verify:static` and `verify:release` assert dimensions and budgets for every generated social image.
- PR review includes a generated contact sheet or manifest diff so binary changes are reviewable.

### Pitfall 5: Social Image Accessibility and Readability Regressions

**Recommended phase:** Phase 25 for template design; Phase 28 for verification coverage

**What goes wrong:** The route-specific images look visually rich but have tiny text, low contrast, cramped safe areas, cropped titles, illegible project names, or generic alt text. The dark-primary site looks polished while shared cards feel inaccessible or off-brand.

**Warning signs:**

- Long writing titles or theme names are placed directly into a fixed-size template without clamping or fallback copy.
- Image alt text repeats the site-wide fallback instead of describing the route-specific card.
- The design relies on subtle dark-on-dark contrast, dense text, or small labels below social-card thumbnail scale.
- Route titles with slashes, code names, or long words overflow the 1200x630 template.

**Consequences:**

- Shared links look unfinished or unreadable on high-density/mobile previews.
- Assistive metadata is less useful than the visible route title and description.
- The site violates its own dark-primary contrast/readability standard at the discovery edge.

**Prevention:**

- Define social image text rules: title length budget, optional subtitle, route kind label, safe margins, minimum font sizes, and high-contrast foreground/background pairs.
- Derive `og:image:alt` and `twitter:image:alt` from route-specific title and summary, not from the old global fallback.
- Keep the image brand centered on Bright Builds / Peter / pRizz; avoid decorative density that competes with the route content.
- Include stress fixtures: longest project name, longest writing title, longest theme title, and an OpenLinks-specific route.

**Detection:**

- Generate a review contact sheet covering every project, writing, and theme image.
- Static verification checks non-empty route-specific alt text and width/height.
- Browser or script-level checks confirm the contact sheet has no clipped/overflowing text if the chosen renderer exposes text boxes; otherwise require manual visual review as a named release checklist item.

### Pitfall 6: Flaky Live-Network Gates

**Recommended phase:** Phase 27 - Freshness Reports and Reviewed Snapshot Policy; Phase 28 - Verification and Release Contract

**What goes wrong:** The aggregate release gate starts running live GitHub sync, link crawls, Meta/X/LinkedIn validators, or remote image fetches. The site then fails release because third-party services rate-limit, require login, return bot defenses, or temporarily disagree with local state.

**Warning signs:**

- `bun run verify` starts calling `sync:github-metadata:strict`, a live link crawler, or a social-card validator.
- `scripts/verify-release.ts` gains network `fetch()` calls.
- Release evidence labels claim hosted crawler validation or live link reachability.
- Failures mention HTTP 403, 429, DNS, TLS, regional blocking, or preview-deployment propagation.

**Consequences:**

- Deterministic local release evidence becomes flaky and environment-dependent.
- Maintainers bypass release checks or add broad exception handling.
- Automated labels overclaim what was actually proven.

**Prevention:**

- Keep live checks in an explicit report command, not the aggregate local gate.
- Let `verify` validate report shape, route coverage, and truthfulness, but not re-fetch third-party services.
- Keep external social debugger checks in manual preview/production smoke docs.
- Make any freshness report degrade to warnings for live failures and never mutate curated visitor-facing copy automatically.

**Detection:**

- `bun run verify` can run with network unavailable after dependencies and browser are installed.
- `rg -n "fetch\\(|https://|sync:github-metadata:strict" scripts/verify-* package.json` finds no live release-gate network path except static policy strings.
- `releaseEvidenceLabels()` names local static checks only.

### Pitfall 7: Stale Metadata Snapshots Masquerading as Freshness

**Recommended phase:** Phase 27 - Freshness Reports and Reviewed Snapshot Policy

**What goes wrong:** The GitHub snapshot remains old, unavailable repositories stay unresolved, project homepage links drift, or generated images include stale public facts while the release docs claim metadata freshness.

**Warning signs:**

- `src/domain/github-metadata.snapshot.json` `syncedAt` ages without a reviewed report.
- Social images include stars, forks, pushed dates, or topic labels sourced from GitHub metadata.
- `No GitHub metadata yet` or `GitHub metadata refresh failed` appears in generated output.
- A freshness report exists but does not list `syncedAt`, unavailable records, direct repo targets, primary links, and review status.

**Consequences:**

- Visitors see out-of-date "Updated" facts or stale project signals.
- The release gate can truthfully prove static output while public-facing facts decay.
- Maintainers cannot tell whether stale data is intentional curation or forgotten automation.

**Prevention:**

- Treat GitHub metadata as advisory and separate from authored project, writing, and theme copy.
- Add a checked-in freshness report that summarizes snapshot age, unavailable records, primary external origins, generated image coverage, and maintainer review status.
- Do not use live GitHub facts in social images unless the image clearly remains valid when the snapshot is old.
- Keep `sync:github-metadata` manual or scheduled; do not let it silently rewrite curated content.

**Detection:**

- Report validation checks every direct repo target appears in the snapshot/report.
- Static verification continues to block visitor-facing maintenance-error copy.
- Release-readiness docs distinguish "reviewed static freshness report" from "live metadata verified today."

### Pitfall 8: OpenLinks Over-Promotion

**Recommended phase:** Phase 24 for data rules; Phase 25/26 for image and metadata templates; Phase 28 for guards

**What goes wrong:** Route images, metadata, or freshness reports turn OpenLinks into the primary CTA for unrelated project, writing, or theme shares. This conflicts with the established repo decision that OpenLinks is low-intrusion identity context.

**Warning signs:**

- Social image templates put OpenLinks branding, logo, or CTA copy on every route.
- Metadata descriptions emphasize OpenLinks for non-OpenLinks routes.
- Theme collaboration or share-card text adds a generic "OpenLinks profile" action.
- JSON-LD or `sameAs` repeats OpenLinks beyond the existing profile identity placement.

**Consequences:**

- Bright Builds, Peter's work, projects, writing, and collaboration context become secondary to identity plumbing.
- Existing theme-collaboration decisions regress.
- Shared route previews feel like ads for OpenLinks instead of accurate previews of the page.

**Prevention:**

- Keep global identity placement in footer/about/contact/profile/metadata `sameAs`.
- Use OpenLinks-specific social text only for the OpenLinks project, OpenLinks writing, or themes where OpenLinks is genuinely central.
- Brand generic cards as Bright Builds / Peter Ryszkiewicz / pRizz.
- Store image text layers in a reviewable spec so guards can inspect text without OCR.

**Detection:**

- Unit tests assert generic social image specs do not include OpenLinks CTA text except allowlisted OpenLinks routes.
- Existing theme tests continue to block generic OpenLinks profile actions for unrelated themes.
- Static verification keeps footer/profile OpenLinks discoverability but does not require OpenLinks dominance in every card.

### Pitfall 9: Freshness Reports Become Content Authority

**Recommended phase:** Phase 27 - Freshness Reports and Reviewed Snapshot Policy

**What goes wrong:** A report or sync script starts rewriting curated project records, route descriptions, social image copy, or public visibility based on live GitHub/link state.

**Warning signs:**

- Freshness tooling writes `src/domain/projects.ts`, `src/domain/writing.ts`, or `src/domain/themes.ts`.
- Unavailable GitHub metadata removes a route or hides a project from generated images.
- Report output is treated as a public content source instead of a maintenance artifact.
- Live homepage URLs overwrite reviewed curated links without human review.

**Consequences:**

- The portfolio becomes a raw external-data mirror, which earlier milestones explicitly rejected.
- Temporary external failures can change visitor-facing content.
- Authored copy and evidence drift apart.

**Prevention:**

- Freshness tooling should read curated data and snapshots, then write only report artifacts or explicit snapshot files.
- Keep curated visitor-facing data manual and reviewed.
- If a report finds drift, create a follow-up task or manual diff, not automatic public content mutation.
- Maintain protocol allowlists for any metadata-derived homepage link.

**Detection:**

- Script tests assert freshness commands do not write curated content files.
- Git diff after a report run changes only allowed report/snapshot outputs.
- Code review rejects report data imported by route components.

### Pitfall 10: Verification Bloat and Release Overclaiming

**Recommended phase:** Phase 28 - Verification and Release Contract

**What goes wrong:** Static verification grows by copy-pasting route-specific social assertions into existing files, while release evidence labels say "social previews verified" without proving actual route-image references, image files, metadata fields, and report truthfulness.

**Warning signs:**

- `scripts/verify-static/metadata-jsonld-verifier.ts` and `scripts/verify-release.ts` get many route-family conditionals instead of focused social-image helpers.
- Evidence labels claim Facebook/X/LinkedIn validation, live link checks, or hosted previews.
- Static verification checks only one representative route or only the old fallback path.
- Release-readiness docs mention freshness without a corresponding checked verifier.

**Consequences:**

- The release gate becomes harder to maintain and easier to weaken.
- Milestone audit can pass prose that is not backed by real local evidence.
- Future route families inherit another drift-prone verification surface.

**Prevention:**

- Add focused modules such as `scripts/verify-static/social-images-verifier.ts` and, if needed, `scripts/social-preview-report.ts`.
- Keep evidence labels narrow, for example "static social image asset references" and "freshness report structure", not "social platforms validated."
- Reuse helper-derived route sets and image manifests.
- Keep manual crawler checks in release docs, guarded as manual checklist facts rather than automated evidence.

**Detection:**

- `bun run verify:release` prints labels that match actual local checks.
- Tests cover release-readiness required facts for v1.5 without claiming live crawler results.
- File-size review catches verifier modules that cross the repo's readability triggers.

## Cross-Cutting Checks

Run or add checks that answer these questions before v1.5 is complete:

- **Static contract:** Does `.output/public` contain every route-specific social image referenced by generated HTML?
- **Route coverage:** Does the social image entry set equal the intended helper-derived project, writing, and theme route set?
- **Metadata parity:** For each public route, do `og:image`, `twitter:image`, JSON-LD `image`, canonical URL, width, height, and alt come from the same route metadata source?
- **No runtime creep:** Can `bun run verify` pass without visitor-runtime API calls, server endpoints, dynamic OG routes, or remote visual assets?
- **Determinism:** Does running the image generator twice on the same checkout produce no git diff?
- **Generated asset budget:** Are all generated PNGs 1200x630, under the chosen byte budget, and emitted through checked-in static assets?
- **Readable images:** Has a contact sheet or equivalent review surface checked long project names, writing titles, theme names, contrast, safe margins, and clipping?
- **Freshness truth:** Does the freshness report show snapshot age, unavailable records, primary link policy coverage, generated media coverage, and review status without claiming live verification?
- **No flaky gates:** Does the aggregate release gate avoid live GitHub sync, live link crawling, and social-platform debugger calls?
- **OpenLinks restraint:** Do generic social images and metadata keep Bright Builds/project/writing/theme content primary, with OpenLinks limited to established identity placements and genuinely relevant OpenLinks routes?
- **Release labels:** Do automated evidence labels name only checks that actually run locally?

Explicit quality-gate mapping:

| Required concern | Primary pitfall coverage | Primary phase |
| --- | --- | --- |
| Dynamic OG/server creep | Pitfall 1 | Phase 25 |
| Flaky live-network gates | Pitfall 6 | Phase 27 and Phase 28 |
| Duplicated route/image lists | Pitfall 2 | Phase 24 |
| Generated asset churn | Pitfall 4 | Phase 25 |
| OpenLinks over-promotion | Pitfall 8 | Phase 24, Phase 25, Phase 26, Phase 28 |
| Accessibility/readability of images | Pitfall 5 | Phase 25 and Phase 28 |
| Stale metadata snapshots | Pitfall 7 | Phase 27 |
| Metadata references | Pitfall 3 | Phase 26 |
| Freshness reports | Pitfall 7 and Pitfall 9 | Phase 27 |
| Verification truthfulness | Pitfall 10 | Phase 28 |

## Recommended Phase Ownership

| Phase | Recommended name | Owns | Success signal |
| --- | --- | --- | --- |
| Phase 24 | Social Image Data Contract | Route-derived social preview entries, path conventions, text/alt rules, OpenLinks allowlist, tests against project/writing/theme helpers | One typed helper surface can answer "which social image belongs to this public route?" without copied slug lists. |
| Phase 25 | Deterministic Static Image Generation | Bun/TypeScript generator, checked-in PNG assets, deterministic rendering, contact sheet/manifest, dimensions and budgets | Generated images exist for every target route, rerunning the generator is stable, and no server/dynamic OG path is introduced. |
| Phase 26 | Metadata Wiring and Static References | `src/domain/seo.ts` route-aware image metadata, route components, JSON-LD image fields, static output assertions | Every public route references the correct canonical local image in Open Graph, Twitter, and structured data. |
| Phase 27 | Freshness Reports and Reviewed Snapshot Policy | GitHub snapshot/report age, primary link policy report, generated-media freshness, manual review workflow, non-blocking live checks | Maintainers get actionable freshness evidence without adding live-network behavior to visitor routes or the aggregate release gate. |
| Phase 28 | Verification and Release Contract | `verify:static`, `verify:release`, browser/manual image review evidence, release-readiness docs, evidence labels, regression guards | `bun run install:browser && bun run verify` proves local static shareability and truthful freshness evidence without overclaiming hosted or platform-crawler checks. |

**Ordering rationale:** Phase 24 must come first because route-image identity is the source of truth. Phase 25 can then generate files from that contract. Phase 26 wires metadata to generated files only after paths are stable. Phase 27 should run after the image and metadata surfaces exist so freshness reports can include generated media. Phase 28 closes the loop by making the release gate and docs truthful for the actual implemented surfaces.
