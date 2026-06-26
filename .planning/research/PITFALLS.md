# Domain Pitfalls

**Domain:** v1.6 Content Discovery & Feeds for Bright Builds Portfolio Website
**Researched:** 2026-06-26
**Overall confidence:** HIGH for repo-specific static-output and verification risks; MEDIUM for exact external feed reader and social crawler behavior.

Local guidance materially used: `.planning/PROJECT.md`, `.planning/MILESTONES.md`, `AGENTS.md`, `AGENTS.bright-builds.md`, `standards/core/frontend-ui.md`, `standards/core/verification.md`, `standards/core/architecture.md`, `standards/core/testing.md`, `standards/core/operability.md`, and `standards/languages/typescript-javascript.md`.

v1.6 is not a greenfield discovery build. The app already has typed checked-in project, writing, theme, route, SEO, and social-preview helpers; `app.config.ts` has `crawlLinks: false` with explicit `prerenderRoutes`; release verification already proves static HTML, metadata, JSON-LD, social preview assets, sitemap, robots, dark/mobile/browser behavior, and no visitor-runtime GitHub usage. New discovery, filtering/search, feeds, related-work paths, and generic-route preview polish should extend those helper-derived contracts rather than add another content authority.

Likely roadmap phases referenced below:

1. **Content Discovery Foundation** - typed public-content index, taxonomy normalization, discovery route/feed target helpers.
2. **Static Discovery UI And Filtering** - dark-primary discovery/topic routes plus lightweight client filtering/search over checked-in content.
3. **Static Feed Generation And Autodiscovery** - RSS or Atom XML, feed links, sitemap/robots/static asset integration.
4. **Related-Work Graph** - stronger project/writing/theme/contact journeys derived from public content relationships.
5. **Generic-Route Preview Polish** - home/about/contact/generic route-specific social preview data and assets.
6. **Verification And Release Contract** - unit/static/browser/release checks and truthful release evidence labels.

## Critical Pitfalls

Mistakes that cause rewrites or major issues.

### Pitfall 1: Discovery Index Forks The Public Content Contract

**Likely roadmap phase:** Content Discovery Foundation

**What goes wrong:** Discovery creates its own arrays of projects, writing, themes, tags, routes, or feed items instead of deriving from existing public selectors and route helpers.

**Why it happens:** Search/filter and feed examples often start with a new "content index" file, which feels convenient until it becomes a second source of truth.

**Consequences:** Draft, hidden, unsupported, archived, or unselected records can leak into discovery pages or feeds; public routes can be omitted from search; and future content edits require multiple coordinated updates.

**Prevention:** Build one pure public-content discovery helper that consumes `publicProjectIndexProjects()`, `projectDetailPageProjects()`, `publicWritingEntries()`, `publicThemeEntries()`, `siteRoutes`, `prerenderRoutes`, and existing relationship helpers. Model record type, route path, canonical URL, title, summary, topics/tags/themes, date fields, and source registry in one typed union.

**Detection:** Unit tests compare discovery records, topic pages, search records, feed entries, sitemap routes, and social preview targets against the existing public route helpers. Curation validation rejects hidden/draft/archived records, duplicate route paths, duplicate taxonomy slugs, empty labels, and unsupported content kinds.

**Verification checks:** `bun run test`, `bun run verify:curation`, and `bun run verify:static` should fail if a public route has no discovery/feed coverage or if a private record appears in a public discovery surface.

### Pitfall 2: Static Discovery Routes Or Feed Files Are Not Actually Emitted

**Likely roadmap phase:** Content Discovery Foundation; Static Feed Generation And Autodiscovery

**What goes wrong:** Topic routes, filtered landing pages, `/feed.xml`, `/atom.xml`, or generated discovery assets are linked in the UI but absent from `.output/public`.

**Why it happens:** This repo intentionally sets `crawlLinks: false`; SolidStart prerendering only emits configured routes unless crawling is enabled. Static files also need to be generated or copied before static verification can prove them.

**Consequences:** Local navigation may work in dev, but deployed static output returns missing files; crawlers and feed readers see 404s; sitemap entries point at nonexistent routes.

**Prevention:** Add discovery route helpers and feed asset paths to the same route/static metadata generation contract that already drives `prerenderRoutes`, sitemap, social previews, and static verification. Prefer explicit route lists over enabling broad link crawling unless the milestone deliberately changes the static-output model.

**Detection:** Static verification checks every expected discovery route HTML file, every feed file, sitemap inclusion/exclusion, canonical URLs, no unexpected HTML routes, and local asset presence under `.output/public`.

**Verification checks:** `bun run build && bun run verify:static && bun run verify:release` must prove discovery routes and feed files exist in the production artifact, not only in source helpers.

### Pitfall 3: Visitor-Runtime Network, CMS, Or Search-Service Creep

**Likely roadmap phase:** Static Discovery UI And Filtering

**What goes wrong:** Filtering/search fetches GitHub, a hosted search provider, a CMS endpoint, live freshness data, or a generated JSON index at visitor runtime.

**Why it happens:** Search products often default to hosted indexes, runtime JSON fetches, or API-backed freshness. That conflicts with this portfolio's static, checked-in content model.

**Consequences:** The site gains runtime failure modes, rate-limit exposure, privacy leakage, and release checks that cannot prove the visitor experience offline. It also violates the explicit v1.6 constraint against visitor-runtime GitHub/network fetches.

**Prevention:** Keep search/filter data in static HTML, imported TypeScript data, or a generated same-build artifact that is copied and verified as part of the static output. Do not add Algolia, Meilisearch, GitHub runtime calls, CMS/admin/editor surfaces, live external-link checks, or feed-reader APIs in v1.6.

**Detection:** Built-output scans reject `api.github.com`, GitHub GraphQL, token-like values, hosted search domains, CMS SDKs, and visitor-facing `fetch()` paths for content discovery. Browser tests can block external network requests while visiting discovery and filter/search flows.

**Verification checks:** Extend `verify:no-github-runtime`, `verify:static`, `verify:release`, and Playwright network assertions so discovery pages still render useful content with no third-party content requests.

### Pitfall 4: Search/Filter UI Hides Content From Crawlers Or Keyboard Users

**Likely roadmap phase:** Static Discovery UI And Filtering

**What goes wrong:** Discovery becomes a client-only app shell: static HTML contains an empty results container, filters require JavaScript to show anything, controls lack labels or keyboard behavior, and no-results states are unclear.

**Why it happens:** Client-side filtering is easy to wire with signals, but it can accidentally replace the static content experience instead of progressively enhancing it.

**Consequences:** No-JS visitors, crawlers, and assistive technology receive a weak or empty page. Keyboard users can get trapped in chip controls, lose focus when results update, or miss changed result counts.

**Prevention:** Render the default public result set in static HTML first. Use native form controls where possible, label every search input/filter group, keep clear/reset controls reachable, preserve focus during filtering, and make result counts and no-results states understandable without relying on animation or color alone.

**Detection:** Static HTML assertions confirm representative project, writing, and theme titles exist before hydration. Browser checks cover desktop and mobile dark layout, keyboard tab order, focus visibility, no overflow/overlap, reduced motion, axe violations, result count behavior, clear/reset behavior, and no-results behavior.

**Verification checks:** Add Playwright coverage for `/discover` or equivalent, topic pages, filtered states, search input, chip/segmented controls, and mobile wrapping. Keep axe and layout checks over all generated discovery routes.

### Pitfall 5: Feed XML Is Valid-Looking But Semantically Unstable

**Likely roadmap phase:** Static Feed Generation And Autodiscovery

**What goes wrong:** RSS/Atom files are generated with missing required fields, relative links, unstable GUIDs/IDs, wrong date formats, unescaped XML, duplicate entries, unpublished content, or build-time timestamps that change on every run.

**Why it happens:** Feeds are simple XML, but feed readers depend heavily on stable identity and dates. Casual string templates often skip parser validation and identity rules.

**Consequences:** Feed readers duplicate old entries, miss updates, show malformed text, reject the feed, or expose draft/hidden content. Deterministic release checks become noisy if the feed changes only because the clock moved.

**Prevention:** Choose one primary feed format for v1.6, preferably RSS 2.0 for broad compatibility unless Atom is explicitly preferred. Generate feed XML from pure typed entries, with absolute canonical URLs, stable GUIDs/IDs based on route URLs, valid publication/update dates from checked-in content, escaped text, and deterministic ordering. Do not use current build time as item identity or as the only freshness signal.

**Detection:** Unit tests parse the generated XML and assert required channel/feed fields, required entry fields, unique IDs/GUIDs, absolute links, no private records, stable output for unchanged input, date format validity, and escaped special characters. Static verification confirms the feed file exists in `.output/public`.

**Verification checks:** Add `verify:feeds` or equivalent to `bun run verify` before build if feed generation must be current, then have `verify:static` inspect the built feed artifact.

### Pitfall 6: Feed Autodiscovery And SEO Assets Drift

**Likely roadmap phase:** Static Feed Generation And Autodiscovery

**What goes wrong:** The feed file exists, but pages do not expose `<link rel="alternate" type="application/rss+xml">`; the sitemap omits discovery routes; feed links use non-canonical origins; or robots/sitemap/feed metadata disagree.

**Why it happens:** Feed generation is often implemented as a separate script after page metadata is already done.

**Consequences:** Feed readers and crawlers have to guess feed location, search engines see incomplete route coverage, and maintainers cannot tell which generated files are authoritative.

**Prevention:** Add feed metadata to the same `PageMetadata`/head rendering path used for SEO. Generate sitemap and feed links from shared route/feed helpers. Keep canonical origin from `peterProfile.canonicalOrigin`.

**Detection:** Static verification checks feed autodiscovery tags on home and writing/discovery pages, absolute feed URLs, feed file existence, sitemap route coverage, and absence of stale feed paths.

**Verification checks:** `verify:static` should inspect `<link rel="alternate" type="application/rss+xml" ...>`, generated XML files, sitemap entries, and canonical URL consistency.

### Pitfall 7: Related-Work Graph Becomes Noisy, Circular, Or Leaky

**Likely roadmap phase:** Related-Work Graph

**What goes wrong:** Related-work sections are derived from loose tag matching and create self-links, repetitive links, irrelevant loops, hidden content leaks, or every route linking to OpenLinks/contact by default.

**Why it happens:** "Related content" can look like a ranking problem, but the corpus is small and curated. Over-automation creates more noise than navigation value.

**Consequences:** Visitors lose the curated story, important project/writing/theme paths are buried, and OpenLinks can become over-promoted despite the low-intrusion identity decision.

**Prevention:** Use explicit relationships first, then limited helper-derived fallbacks with caps, reason labels, and stable ordering. Filter through public selectors, reject self-links, deduplicate by route, and keep OpenLinks/contact fallback behavior narrow.

**Detection:** Unit tests prove no self-links, no hidden/draft/archived records, max related item counts, deterministic ordering, reciprocal links where intended, and meaningful fallback behavior. Browser checks prove keyboard focus reaches related-work links on representative routes.

**Verification checks:** Extend relationship tests and Playwright keyboard coverage for project, writing, theme, topic/discovery, and contact paths.

### Pitfall 8: Generic-Route Social Preview Polish Breaks The Existing Preview Contract

**Likely roadmap phase:** Generic-Route Preview Polish

**What goes wrong:** Home/about/contact/generic preview images are added by hard-coding metadata paths, overwriting existing generated social previews, dropping fallback behavior for unknown routes, or omitting manifest/static verifier coverage.

**Why it happens:** Generic pages feel small enough to patch directly in route components, but v1.5 already established a route-derived social-preview target and manifest contract.

**Consequences:** Some pages share with stale or missing images; `og:image`, `twitter:image`, and JSON-LD image fields drift; generated image budgets and manifest freshness no longer cover the whole sharing surface.

**Prevention:** Extend the existing `socialPreviewTargets()` model with generic route kinds or a separate helper that feeds the same manifest, renderer, metadata, static verifier, and release budget checks. Preserve `metadataForFallbackPage()` and `SOCIAL_PREVIEW_FALLBACK_IMAGE` for unknown slugs and true fallback routes.

**Detection:** Static verification asserts every covered generic route has the expected route-specific image, dimensions, MIME type, alt text, manifest entry, and local asset mapping. Unknown/fallback routes still use the fallback image.

**Verification checks:** `verify:social-previews`, `verify:static`, `verify:release`, and metadata unit tests must cover home, about, contact, and any new generic share targets.

### Pitfall 9: Release Evidence Labels Overclaim External Reality

**Likely roadmap phase:** Verification And Release Contract

**What goes wrong:** Release output claims "feed readers verified", "social cards verified", "external links checked", "hosted deployment validated", or "GitHub freshness verified" when the aggregate gate only ran local static checks.

**Why it happens:** v1.6 adds surfaces that naturally invite external validation, but live readers, crawlers, and external links are intentionally out of scope for automated local release gates.

**Consequences:** Release notes become untrustworthy, maintainers skip manual smoke obligations, and future debugging starts from false evidence.

**Prevention:** Evidence labels must describe only checks included in `bun run verify`. Use wording such as "local feed XML generated and parsed", "static feed file emitted", "local metadata/feed autodiscovery verified", and keep hosted feed-reader, social-card, Cloudflare, and live external-link checks in manual release checklist sections.

**Detection:** Release-readiness tests assert every automated label maps to an actual script/check and that manual/network obligations remain named separately.

**Verification checks:** Extend `scripts/release-readiness.test.ts`, `scripts/verify-release.test.ts`, and release-readiness docs to prevent overclaiming.

## Moderate Pitfalls

### Pitfall 1: Taxonomy Slugs Collide Or Dilute The Curation

**What goes wrong:** Topics, themes, tags, aliases, statuses, and route labels are normalized inconsistently, creating duplicate pages such as `open-web` and `Open web`, or thin pages with one weakly related item.

**Prevention:** Add a taxonomy normalizer with explicit display label, slug, source fields, and minimum public-content rules. Prefer curated high-signal topics over publishing every raw tag as a route.

**Verification checks:** Unit tests reject duplicate normalized slugs, empty labels, unsafe slug characters, unstable ordering, and topic pages below the accepted public-content threshold unless explicitly allowed.

### Pitfall 2: Search Ranking Implies More Precision Than The Data Supports

**What goes wrong:** Lightweight search ranks results as if it were a mature search engine, making weaker tag hits outrank flagship projects or exact title matches.

**Prevention:** Keep ranking transparent and simple: exact title/alias, curated topic/theme, then summary/tag matches. Show grouped results by content type or priority rather than a mysterious score when the corpus is small.

**Verification checks:** Unit tests cover exact title, alias, topic, tag, no-results, and stable ordering cases.

### Pitfall 3: Search State Is Not Shareable Or Resettable

**What goes wrong:** Users cannot link to a topic/filter state, browser back/forward loses state, or clearing filters leaves stale counts/results.

**Prevention:** Use route paths for durable topics and query parameters only for lightweight search/filter state when needed. Provide clear reset behavior and ensure default static content is useful without any query.

**Verification checks:** Browser tests cover direct navigation to topic/filter URLs, back/forward, clear/reset, and no-results states on desktop and mobile.

### Pitfall 4: Feed Scope Is Too Broad For The Evidence Available

**What goes wrong:** A "site updates" feed includes projects/themes without reliable publication/update dates or claims release freshness that curated records do not support.

**Prevention:** Start with a writing feed if writing has the cleanest date model. Add site-update feed entries only when projects/themes have truthful checked-in `publishedOn`/`updatedOn`-style evidence or an explicit curated changelog source.

**Verification checks:** Feed tests reject entries without stable dates, canonical routes, public status, and deterministic IDs.

### Pitfall 5: Generated Discovery Or Feed Artifacts Mutate During Build

**What goes wrong:** `bun run build` silently writes feed/search/index files, changing the worktree or producing different output than review saw.

**Prevention:** Use explicit generate and check commands. If generated files are committed, `--check` must compare current inputs against committed output. If generated at build time, static verification must prove the generated artifact exactly matches pure helper output.

**Verification checks:** `git status --short` stays clean after check commands, and `verify` fails on stale generated artifacts.

### Pitfall 6: Bundle And HTML Budgets Creep From Search Helpers

**What goes wrong:** A fuzzy-search library, large JSON index, or duplicated result cards pushes JS/HTML/CSS over release budgets.

**Prevention:** Use simple local matching first; avoid adding search dependencies until the corpus justifies them. Keep indexed fields small and avoid duplicating full writing body text into client payloads.

**Verification checks:** `verify:release` budget reports cover route HTML, total JS, total CSS, and any generated search/feed assets.

### Pitfall 7: Dark-Primary Discovery Controls Become A One-Note Or Low-Contrast Palette

**What goes wrong:** Filter chips, selected states, empty states, and result cards reuse one dark-blue/purple treatment with weak contrast or unclear state differences.

**Prevention:** Use existing dark-first shell/surface/text/link/chip/focus classes, vary state colors intentionally, and avoid light-first utility classes unless locally justified.

**Verification checks:** Visual-system guard plus desktop/mobile Playwright layout checks review contrast, wrapping, focus rings, selected/unselected states, and text overlap.

### Pitfall 8: Feed And Page Metadata Disagree On Canonical Dates

**What goes wrong:** `lastmod`, RSS `pubDate`, Atom `updated`, article metadata, and visible page dates tell different stories.

**Prevention:** Derive all public dates from typed content fields. If a record lacks an update date, do not invent one from build time; either omit optional update fields or add reviewed content evidence.

**Verification checks:** Unit/static tests compare feed dates, article metadata, JSON-LD dates, sitemap `lastmod` if used, and visible date text where present.

### Pitfall 9: OpenLinks Becomes A Discovery CTA Instead Of Identity Context

**What goes wrong:** Discovery pages, related-work cards, feeds, or generic previews push OpenLinks as the main call to action for unrelated content.

**Prevention:** Keep OpenLinks in footer/profile/contact/metadata identity surfaces and route-specific contexts where it is genuinely relevant. Bright Builds, project stories, writing, themes, and collaboration context remain primary.

**Verification checks:** Content review and static assertions ensure OpenLinks appears where expected but does not dominate non-identity route descriptions, related-work defaults, or social image copy.

## Minor Pitfalls

### Pitfall 1: Empty States Sound Like Errors

**What goes wrong:** No-results copy implies content is missing or broken.

**Prevention:** Use concise copy that names the current filter/search and offers a reset path.

### Pitfall 2: Case, Hyphen, And Alias Matching Feels Arbitrary

**What goes wrong:** Searches for `open links`, `OpenLinks`, `open-links`, or `pRizz` behave inconsistently.

**Prevention:** Normalize case, whitespace, hyphens, and aliases in the pure search helper.

### Pitfall 3: Discovery Pages Overuse Card Chrome

**What goes wrong:** The page becomes a grid of nested cards and decorative surfaces instead of a scannable portfolio index.

**Prevention:** Keep sections unframed or full-width bands; reserve cards for repeated result items and keep border radii restrained.

### Pitfall 4: Feed Descriptions Leak Too Much HTML

**What goes wrong:** Feed item descriptions include unescaped HTML, route-only UI copy, or overly long body excerpts.

**Prevention:** Start with escaped plain summaries from curated records; add richer content later only with parser-backed tests.

### Pitfall 5: Generic Social Images Use Overlong Route Copy

**What goes wrong:** Home/about/contact preview cards crop names, summaries, or collaboration copy.

**Prevention:** Apply the existing social preview text budgets and longest-text fixtures to generic route targets.

### Pitfall 6: Sorting Changes Between Locales Or Runtimes

**What goes wrong:** Topic/results/feed order changes across machines because locale-sensitive sorting is implicit.

**Prevention:** Use explicit display order, route path tie-breakers, and deterministic comparison helpers.

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation | Verification Checks |
| --- | --- | --- | --- |
| Content Discovery Foundation | Forked public content model; hidden/draft/archive leakage; taxonomy slug collisions | One pure typed discovery index derived from existing selectors and route helpers | Unit equality tests against route helpers; curation validation; duplicate slug/path rejection |
| Static Discovery UI And Filtering | Client-only results; inaccessible filters; runtime network search; mobile overflow | SSR full default results, progressive enhancement, native controls, no third-party content fetches | Static HTML assertions; Playwright desktop/mobile/keyboard/reduced-motion/axe; network request guard |
| Static Feed Generation And Autodiscovery | Invalid RSS/Atom XML; unstable GUIDs; missing feed files; no autodiscovery links | Pure deterministic feed helper; stable canonical IDs; escaped XML; generated feed asset checked into static output | XML parser tests; unique ID/date tests; static output file checks; `<link rel="alternate">` assertions |
| Related-Work Graph | Noisy tag-only links; self-links; loops; OpenLinks over-promotion | Explicit relationships first, capped helper-derived fallbacks, public selector filters, reason labels | Unit graph invariants; browser focus coverage; content review for CTA hierarchy |
| Generic-Route Preview Polish | Hard-coded image paths; fallback broken; manifest/budget drift | Extend existing social preview target/manifest contract and preserve fallback page metadata | Social preview generator check; metadata/JSON-LD/static asset assertions; release image budgets |
| Verification And Release Contract | Evidence labels claim live reader/social/link/deploy checks that did not run | Automated labels name local checks only; manual hosted/network smoke stays separate | Release-readiness tests; verify-release label mapping; docs distinguish local vs manual evidence |

## Sources

- Local project context and constraints: `.planning/PROJECT.md`, `.planning/MILESTONES.md`, `AGENTS.md`, `AGENTS.bright-builds.md`, `standards/core/frontend-ui.md`, `standards/core/verification.md`.
- Local architecture inspected: `app.config.ts`, `src/domain/routes.ts`, `src/domain/seo.ts`, `src/domain/social-previews.ts`, `src/domain/projects.ts`, `src/domain/writing.ts`, `src/domain/themes.ts`, `scripts/verify-static/*`, `scripts/verify-release.ts`, `tests/browser-release.playwright.ts`.
- SolidStart route prerendering docs: `https://docs.solidjs.com/solid-start/building-your-application/route-prerendering` (HIGH confidence for explicit routes/crawlLinks/static HTML behavior).
- SolidStart head and metadata docs: `https://docs.solidjs.com/solid-start/building-your-application/head-and-metadata` (HIGH confidence for `@solidjs/meta` and route-specific metadata behavior).
- RSS 2.0 specification and autodiscovery: `https://www.rssboard.org/rss-specification`, `https://www.rssboard.org/rss-autodiscovery` (HIGH confidence for RSS channel/item/autodiscovery requirements).
- Atom Syndication Format RFC 4287: `https://www.rfc-editor.org/rfc/rfc4287` (HIGH confidence for Atom feed/entry identity and date requirements).
- Sitemaps protocol: `https://www.sitemaps.org/protocol.html` (HIGH confidence for sitemap XML, escaping, and URL-set requirements).
- Open Graph protocol: `https://ogp.me/` (HIGH confidence for core and structured image metadata expectations).
- WCAG 2.2: `https://www.w3.org/TR/WCAG22/` (HIGH confidence for keyboard, focus, reflow, target-size, and name/role/value accessibility concerns).
- GitHub REST API rate limits: `https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api` (HIGH confidence that live GitHub checks carry rate-limit/failure modes and should stay out of visitor/runtime paths).
