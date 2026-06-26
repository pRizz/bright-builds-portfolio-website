# Project Research Summary

**Project:** Bright Builds Portfolio Website
**Milestone:** v1.6 Content Discovery & Feeds
**Domain:** Static-first portfolio content discovery, lightweight search/filtering, syndication, related-work navigation, and generic-route sharing polish
**Researched:** 2026-06-26
**Synthesized:** 2026-06-26
**Confidence:** HIGH for local architecture, stack, and verification direction; MEDIUM-HIGH for external feed-reader and social crawler behavior until manual hosted smoke checks run.

## Executive Summary

v1.6 should make the now-substantial Bright Builds corpus navigable by idea, not only by content type. Experts would build this as a static content-discovery layer over the existing curated project, writing, and theme registries: normalize public labels into crawlable topic routes, progressively enhance static lists with local filtering/search, publish a deterministic writing-first feed, and add related-work paths that help visitors continue from one project, note, or theme into the rest of the corpus.

The recommended approach is structural, not dependency-driven. Add no new packages. Extend the current SolidStart, SolidJS, TypeScript, Tailwind/Mystic-compatible UI, `@solidjs/meta`, `@resvg/resvg-js`, Vitest, Playwright, axe, and Bun script stack with repo-owned domain helpers: discovery, content search, feeds, related work, and expanded social-preview targets. Public route helpers should remain the source of truth for prerendering, sitemap, metadata, static verification, browser checks, and release evidence.

The largest risks are drift and overreach: a second content index leaking draft/archived records, topic routes or feed files that work in dev but are missing from static output, client-only search that hides content from crawlers or keyboard users, invalid or unstable feed XML, noisy related-work recommendations, and release evidence that overclaims hosted or live-network validation. Mitigate these by deriving from existing public selectors, using `/topics` as the static discovery route family, rendering useful default content before hydration, generating a writing-first static feed from dated writing records only, ranking explicit relationships before shared-label fallbacks, and extending local verification before updating release-readiness labels.

## Key Findings

### Recommended Stack

v1.6 needs no new dependencies. The current Bun/SolidStart/TypeScript/Tailwind/Mystic-compatible stack is enough for static topic routes, local filtering/search, feed generation, related-work graphing, and generic-route social previews. The work should add pure domain modules plus thin Solid route shells and Bun script integration, not a search package, CMS, XML library, dynamic OG endpoint, API route, or runtime content service.

**Core technologies:**
- SolidStart and SolidJS: static prerendered route shell plus small interactive controls for filtering/search.
- TypeScript domain modules: pure data-in/data-out projections for discovery topics, search documents, feed items, and related-work records.
- Existing route/SEO/social-preview helpers: shared source for prerender routes, sitemap entries, metadata, JSON-LD, social images, static verifiers, and browser coverage.
- Bun scripts: static metadata/feed/social-preview generation and verification entrypoints.
- Tailwind/Mystic-compatible dark UI: dark-primary controls and route surfaces consistent with repo guidance.
- Vitest, Playwright, axe, and release verifiers: prove pure behavior, static output, keyboard/mobile/dark accessibility, no runtime network creep, and truthful release evidence.

**Critical version requirements:** Keep existing pinned versions from `package.json`; do not change `package.json` or `bun.lock` for v1.6 unless implementation proves a concrete gap. Mystic UI remains pinned to `github:pRizz/mystic-ui#d36017757708ed01ef2b3b47beb14f294726411c`.

### Expected Features

**Must have (table stakes):**
- Canonical discovery term registry derived from public projects, writing, and themes.
- Static `/topics` index and `/topics/{slug}` pages with metadata, JSON-LD, sitemap coverage, social preview coverage, and static output verification.
- Topic-linked chips on existing public surfaces where labels are canonical and public.
- Project and writing filtering/search over checked-in data, with no visitor-runtime fetches.
- Accessible filter state, result feedback, keyboard support, clear/reset behavior, no mobile text overlap, and full default static content before hydration.
- Writing-first static feed at `/feed.xml` or `/writing/feed.xml`, with feed autodiscovery and visible feed links.
- Centralized related-work helper with reason labels and compact next-step panels.
- Generic-route and topic-route social preview polish through the existing generated-preview pipeline.
- Local verification/release evidence that proves only deterministic local facts.

**Should have (differentiators):**
- A "start with a theme/topic" discovery hub that groups Peter's work by idea.
- Related-work reason labels such as shared topic, related writing, or theme path.
- "Continue exploring" next-step rails on detail pages.
- Topic-aware feed model that can support future JSON Feed or topic feeds without reworking the data shape.
- Maintainer-facing preview gallery only if it reuses the existing social-preview review pattern cheaply.

**Defer (v2+):**
- CMS/admin/editor workflows, raw GitHub mirroring, hosted/full-text/semantic search, embeddings or AI recommendations, runtime content fetches, runtime feed endpoints, dynamic OG endpoints, crawled faceted route combinations, per-topic feeds, newsletter/comments/analytics/webmentions, heavy graph visualizations, and live-network freshness gates in `bun run verify`.

### Architecture Approach

Keep the existing functional-core / imperative-shell architecture. Public selectors and route helpers should feed pure domain projections; route components and scripts should remain thin shells that render or write those projections. The architecture should make illegal public states hard to represent: discovery, search, feeds, related work, sitemap, social previews, and static verification all derive from the same public route/content contracts.

**Major components:**
1. `src/domain/discovery.ts` - normalize canonical topic labels, slugs, source kinds, counts, public references, and topic route helpers.
2. `src/domain/content-search.ts` - build small static search documents and deterministic filter/search scoring for projects, writing, themes, and topics.
3. `src/domain/feeds.ts` - derive dated public writing feed items and serialize escaped, deterministic feed XML.
4. `src/domain/related-work.ts` - resolve explicit project/writing/theme relationships first, then capped shared-label fallbacks with reason labels.
5. `src/domain/routes.ts` and `src/domain/seo.ts` - include topic routes, feed alternate links, metadata, JSON-LD, sitemap, and canonical URL integration.
6. `src/domain/social-previews.ts` - extend the existing generated-preview target contract to home, about, contact, and topic routes while preserving fallback behavior.
7. `scripts/generate-static-metadata.ts`, `scripts/verify-static/*`, `scripts/verify-release.ts`, and `tests/browser-release.playwright.ts` - generate and prove feed files, topic output, metadata, accessibility, budgets, and evidence labels.

### Critical Pitfalls

1. **Discovery forks the public content contract** - derive from existing public selectors and route helpers; add validation/tests for hidden/draft/archived leakage, duplicate slugs, duplicate routes, and unsupported content kinds.
2. **Static routes or feed files are linked but not emitted** - add topic routes to `prerenderRoutes` and `sitemapRoutes`; write feed XML through static metadata generation; verify artifacts under `.output/public`.
3. **Runtime service creep enters filtering/search** - reject hosted search, CMS, GitHub runtime calls, visitor-facing content `fetch()`, and generated JSON indexes unless explicitly researched later.
4. **Search/filter UI hides content or blocks keyboard users** - render the default public corpus in static HTML first; progressively enhance with native controls, labels, result counts, no-results copy, reset behavior, focus visibility, and mobile wrapping checks.
5. **Feed XML is unstable or semantically invalid** - use stable route-based IDs/GUIDs, absolute canonical URLs, checked-in writing dates, escaped summaries, deterministic sorting, and tests for duplicate/private/undated entries.
6. **Related work becomes noisy or leaky** - rank curated relationships before shared labels, cap results, reject self-links, deduplicate by route, and keep OpenLinks as identity context rather than a default discovery CTA.
7. **Release evidence overclaims external reality** - automated labels should say local feed XML generated/parsed, static routes emitted, metadata verified, and browser/a11y checks passed; hosted feed-reader, social-card, Cloudflare, and live-link checks stay manual.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Content Discovery Foundation

**Rationale:** Every downstream feature depends on one canonical public-content/topic model. This must land before routes, filters, related work, feeds, or topic social previews.

**Delivers:** `discovery.ts`, canonical label normalization, topic slug validation, public-only references, topic route helpers, curation checks, and unit tests.

**Addresses:** Canonical discovery term registry; hidden-content exclusion; reusable route/feed/search/topic foundations.

**Avoids:** Forked content indexes, raw tag slugs, taxonomy collisions, hidden/draft/archived leakage, duplicated route inventories.

### Phase 2: Static Topic Routes

**Rationale:** Crawlable topic pages should be the durable discovery surface before client filtering/search is added. This creates the route family that sitemap, metadata, related work, social previews, and static verification can share.

**Delivers:** `/topics`, `/topics/{slug}`, topic index/detail rendering, topic metadata, JSON-LD, sitemap/prerender inclusion, linked chips on public surfaces where safe, expected-route static text, and unknown-topic fallback behavior.

**Addresses:** Static topic/tag discovery, topic-linked labels, discovery metadata and structured data.

**Avoids:** JavaScript-only discovery, crawlable faceted URL explosion, route-output drift.

### Phase 3: Project and Writing Filtering/Search

**Rationale:** Once canonical topics exist, filtering can reuse the same labels and public-content model. Keeping this after static routes ensures content remains useful without JavaScript.

**Delivers:** `content-search.ts`, deterministic query normalization/scoring, project index filters, writing index filters, visible counts, empty/reset states, keyboard support, URL/query behavior only if needed, and browser coverage over desktop/mobile dark UI.

**Addresses:** Project filtering, writing filtering, metadata quick search, accessible filter feedback.

**Avoids:** Runtime search services, hidden static content, inaccessible chip controls, stale local storage, full-text index scope creep.

### Phase 4: Writing-First Static Feed

**Rationale:** Feed generation needs stable dated entries. Writing has the cleanest date model today; projects and themes should not enter a feed until they gain explicit public publish/update evidence or a `siteUpdates` registry.

**Delivers:** `feeds.ts`, deterministic writing feed items, escaped XML, `/feed.xml` and/or `/writing/feed.xml`, feed autodiscovery metadata, visible feed link, static output checks, and tests for required fields, stable IDs, dates, ordering, categories, and public-only inclusion.

**Addresses:** Static syndication for writing, feed autodiscovery, local feed validation.

**Avoids:** Invented project/theme feed dates, runtime feed endpoints, invalid XML, duplicate feed-reader entries, stale generated artifacts.

**Format decision:** Use one primary v1.6 feed format. RSS 2.0 is the roadmap recommendation for broad reader expectation; keep the internal `FeedItem` model format-agnostic so Atom or JSON Feed can be derived later if explicitly needed.

### Phase 5: Centralized Related-Work Graph

**Rationale:** Related-work ranking becomes more useful after topic labels and routes exist. Building it after filters/feed prevents the graph from becoming the hidden content authority.

**Delivers:** `related-work.ts`, explicit-first relationship ranking, shared-label fallback, reason labels, result caps, dedupe/self-link prevention, detail-page next-step panels, and regression tests for public-only links and deterministic ordering.

**Addresses:** Stronger project-writing-theme-topic journeys, "continue exploring" rails, explainable recommendations.

**Avoids:** Noisy tag-only links, circular/self-links, hidden content leaks, OpenLinks over-promotion.

### Phase 6: Generic and Topic Social Preview Polish

**Rationale:** Generated image churn should happen after route inventory settles. Extending the existing preview contract then keeps metadata, JSON-LD, manifest, assets, and budgets aligned.

**Delivers:** Route-specific preview targets/assets for home, about, contact, `/topics`, and topic detail routes where distinct cards help sharing; manifest/static verifier coverage; metadata parity; fallback preservation.

**Addresses:** Generic-route/topic social previews, share-card polish, existing v1.5 preview contract extension.

**Avoids:** Hard-coded image paths, fallback breakage, stale manifests, oversized/generated asset drift, overlong route copy.

### Phase 7: Verification and Release Evidence Contract

**Rationale:** v1.6 is not done until local release gates prove the implemented static contract and release docs tell the truth about what was automated.

**Delivers:** Expanded `bun run verify` coverage for curation, unit tests, static output, metadata/JSON-LD, feed XML, social previews, no runtime network content fetches, browser dark/mobile/keyboard/a11y/layout checks, release budgets, release-readiness facts, and manual smoke checklist updates.

**Addresses:** Verification/release evidence contract; local automated proof without live-network claims.

**Avoids:** Evidence labels before evidence, flaky live gates, unverified generated files, hidden visitor-runtime dependencies.

### Phase Ordering Rationale

- Discovery foundation comes first because topics, filters, feeds, related work, sitemap, social previews, and verifiers must agree on public content eligibility and canonical labels.
- Static topic routes precede interactive filtering so the site stays crawlable, accessible, and useful without JavaScript.
- Filtering/search comes after routes because it is progressive enhancement over static content, not the discovery authority.
- Feeds follow public-content/date modeling; writing-only scope avoids inventing chronology for projects and themes.
- Related work follows topics so it can use curated relationships plus topic labels without becoming an opaque recommendation engine.
- Social preview polish follows route inventory to avoid repeated generated PNG churn and metadata drift.
- Verification/release evidence closes the milestone after concrete checks exist; docs and labels should never describe checks that did not run.

### Research Flags

Phases likely needing deeper research during planning:
- **None for the recommended v1.6 path:** the research found repo-local patterns and existing stack surfaces for every recommended phase.
- **Phase 4 only if scope changes:** deeper research is needed if the roadmap chooses a site-updates feed, multiple feed formats in v1.6, topic-specific feeds, or live feed-reader validation.
- **Phase 3 only if scope changes:** deeper research is needed if the project adds full-text, hosted, semantic, or large generated search indexes.

Phases with standard patterns (skip research-phase):
- **Phase 1:** pure domain helper and validation pattern already matches existing project/writing/theme helpers.
- **Phase 2:** helper-derived SolidStart static route, sitemap, SEO, and verifier pattern is already established.
- **Phase 3:** small Solid controls over imported checked-in data are standard local frontend work.
- **Phase 5:** explicit-first related content resolver is a pure domain pattern.
- **Phase 6:** v1.5 already established the generated social-preview manifest/metadata/static-verifier contract.
- **Phase 7:** existing aggregate verification and release-readiness patterns should be extended, not re-researched.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Research inspected current `package.json`, SolidStart static setup, route/static generation patterns, and official docs. Strong conclusion: no new dependencies. |
| Features | HIGH | Features align with `.planning/PROJECT.md` active v1.6 requirements, existing shipped milestones, and user-highlighted scope. |
| Architecture | HIGH | Recommended components directly extend existing functional-core/imperative-shell domain helpers, route registries, static metadata scripts, and verifiers. |
| Pitfalls | HIGH | Pitfalls are grounded in repo-specific static-output, route-helper, accessibility, and release-evidence patterns, with MEDIUM uncertainty only around external feed/social crawler behavior. |

**Overall confidence:** HIGH

### Gaps to Address

- **Topic route naming:** Use `/topics` for v1.6. STACK mentioned `/discover` as an option, but FEATURES, ARCHITECTURE, PITFALLS, PROJECT scope, and current orchestration highlight a static topics route family.
- **Feed format:** Research split between Atom and RSS. Roadmap recommendation is writing-first RSS 2.0 for broad reader expectation, with a format-agnostic `FeedItem` model and no second format unless explicitly scoped.
- **Feed path:** Decide whether `/feed.xml` aliases writing or whether `/writing/feed.xml` is canonical with `/feed.xml` as an alias. Recommendation: expose `/feed.xml` for discoverability and keep implementation writing-first.
- **Search state shareability:** Start with in-page state unless requirements explicitly need query-param sharing; durable sharing should happen through `/topics/{slug}`.
- **Generic preview coverage:** Include home/about/contact and topic routes only where differentiated cards add sharing value; preserve fallback images for unknown or low-value routes.
- **Manual hosted validation:** Feed-reader compatibility, hosted social-card previews, Cloudflare deploy checks, and live external links remain manual release checklist items unless a later milestone accepts live-network gate risk.

## Sources

### Primary (HIGH confidence)

- `.planning/PROJECT.md` - v1.6 goal, active requirements, constraints, current state, and key decisions.
- `.planning/research/STACK.md` - no-new-dependency stack recommendation and existing toolchain integration points.
- `.planning/research/FEATURES.md` - table stakes, differentiators, anti-features, dependencies, and MVP ordering.
- `.planning/research/ARCHITECTURE.md` - functional-core architecture, component boundaries, data flow, build order, and verification integration.
- `.planning/research/PITFALLS.md` - critical/moderate/minor pitfalls, phase warnings, prevention, and verification checks.
- `AGENTS.md`, `AGENTS.bright-builds.md`, `standards-overrides.md`, `standards/index.md`, `standards/core/architecture.md`, `standards/core/frontend-ui.md`, `standards/core/verification.md`, `standards/core/testing.md`, `standards/languages/typescript-javascript.md` - local Bright Builds workflow, dark-primary UI, functional-core, testing, and verification expectations.

### Secondary (MEDIUM-HIGH confidence)

- SolidStart prerendering and metadata docs - static route and head/metadata behavior.
- RSS 2.0 specification and RSS autodiscovery - feed channel/item/autodiscovery requirements.
- Atom RFC 4287 - feed identity/date model if Atom is chosen later.
- Sitemaps protocol, Open Graph protocol, Schema.org `ItemList`/`BreadcrumbList`, WCAG 2.2, WAI-ARIA APG, MDN `URLSearchParams`, and Google faceted-navigation guidance - metadata, accessibility, filter, and crawler constraints.

---
*Research completed: 2026-06-26*
*Ready for roadmap: yes*
