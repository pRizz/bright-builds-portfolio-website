# Project Research Summary

**Project:** Bright Builds Portfolio Website
**Milestone:** v1.3 Writing & Notes Surface
**Domain:** Curated static writing and notes routes for an existing SolidStart portfolio
**Researched:** 2026-06-03
**Synthesized:** 2026-06-03
**Confidence:** HIGH

## Executive Summary

v1.3 should add a curated writing and notes surface, not a generic blog engine. The site already has the right architecture from v1.2: typed checked-in domain data, explicit static route helpers, pure SEO/JSON-LD helpers, generated sitemap/robots, dark-primary Solid routes, and a clean-builder gate of `bun run install:browser && bun run verify`. Writing should extend that pattern as a sibling content domain.

The recommended approach is no new dependencies. Add a repo-owned typed writing registry, static `/writing` and `/writing/{slug}` routes, and make `relatedProjectSlugs` on writing entries the single source of truth for project/note relationships. Route metadata, `BlogPosting` JSON-LD, writing index `ItemList` JSON-LD, sitemap coverage, static HTML checks, browser checks, and release evidence should all derive from the same writing helpers.

The main risks are content drift, prerender holes, broken project cross-links, SEO/schema mismatch, and overbuilding. Mitigate them by building domain helpers before UI, rendering thin route shells from those helpers, keeping all writing content checked in, and explicitly deferring CMS, MDX, RSS, search, comments, dynamic OG images, and runtime content/API calls.

## Key Findings

### Recommended Stack

The stack research is clear: v1.3 needs stack discipline, not stack expansion. Keep SolidStart, SolidJS, Tailwind 3.x, Mystic UI where useful, TypeScript strict mode, Biome, Vitest, Playwright/axe, Lighthouse CI, and Cloudflare Pages as already established. Do not add Markdown/MDX, Contentlayer, a CMS client, syntax highlighter, RSS generator, search indexer, date/slug package, or dynamic OG infrastructure for this milestone.

**Core technologies:**

- SolidStart prerendering: static `/writing` and `/writing/{slug}` output through `prerenderRoutes`.
- TypeScript domain registry: checked-in writing entries with typed fields, body blocks, status, dates, tags/themes, and `relatedProjectSlugs`.
- Existing SEO helpers: route-specific metadata, canonical URLs, OG/Twitter tags, `BlogPosting` JSON-LD, index `ItemList` JSON-LD, and sitemap output.
- Existing verification stack: Vitest for pure helpers, static HTML verification for `.output/public`, Playwright/axe for browser behavior, and release verification for final artifact checks.

**Critical stack requirements:**

- No dependency changes unless implementation exposes a concrete incompatibility.
- Keep writing content and relationships in repo-owned TypeScript, checked into git.
- Keep all public writing routes static and listed explicitly through helper-derived `prerenderRoutes`.
- Reuse the existing static social preview fallback; no per-note dynamic OG endpoint in v1.3.

### Expected Features

v1.3 table stakes are a small public writing graph with deterministic static routes and verified discovery metadata. Missing any of these will make the surface feel incomplete or weaken the release contract.

**Must have:**

- Typed checked-in writing registry with public/hidden or public/draft filtering.
- Stable unique slugs, deterministic order, title, summary, published date, tags/themes, and non-empty body blocks.
- `relatedProjectSlugs` on writing entries, validated against public project records.
- `/writing` top-level route in navigation with scannable note cards and at least one public entry.
- Static `/writing/{slug}` detail pages with H1, summary, date, author identity, tags/themes, body content, back path, and related project links.
- Missing/hidden/draft slug fallback that does not leak private or placeholder content.
- Project-to-note panels on selected project detail pages derived from writing entries.
- Route-specific metadata, canonical URLs, OG/Twitter fields, `BlogPosting` JSON-LD, `/writing` `ItemList` JSON-LD, and sitemap coverage.
- Unit, curation, static, browser, and release verification in the existing aggregate gate.

**Should have:**

- Theme-forward grouping or labels so a small writing set feels intentional.
- A short note framing field such as context, takeaway, or kind when it helps distinguish field notes, essays, and technical notes.
- Related project/action panels that move readers toward project stories or source inspection without turning note pages into marketing pages.
- Cross-link integrity tests for both directions: note-to-project and project-to-note.

**Defer:**

- CMS/admin editing, authentication, database-backed content, comments, likes, reactions, webmentions, and newsletter forms.
- Markdown, MDX, Contentlayer, Astro collections, syntax highlighting dependencies, or parser pipelines.
- RSS/Atom feeds, search, pagination, tag archive pages, project-index note-count badges, and auto-imported README/Gist/repo notes.
- Dynamic OG image endpoints, per-note raster generation, runtime GitHub/API/Gist/Notion/Substack fetches, and token-dependent content sources.

### Architecture Approach

Add writing as a sibling domain surface to projects. Keep business logic in pure TypeScript helpers and keep Solid routes as thin rendering shells. The writing registry should own content and relationship intent; route helpers, SEO helpers, sitemap generation, static verifiers, browser tests, and project-page panels should consume that domain surface instead of duplicating route lists or note metadata.

**Major components:**

1. `src/domain/writing.ts` - writing types, checked-in registry, selectors, path helpers, and cross-link helpers.
2. `src/domain/writing-validation.ts` - optional validation for invariants TypeScript cannot enforce cleanly.
3. `src/domain/routes.ts` - add `/writing` to `siteRoutes` and append `writingDetailRoutes()` to `prerenderRoutes`.
4. `src/domain/seo.ts` - writing index/detail metadata, `BlogPosting` JSON-LD, `ItemList` JSON-LD, and sitemap coverage through existing helpers.
5. `src/routes/writing/index.tsx` and `src/routes/writing/[slug].tsx` - static route shells rendered from writing helpers.
6. `src/routes/projects/[slug].tsx` - derived related writing panel for selected project stories.
7. Existing verifiers/tests - expand unit, static, browser, release-readiness, and release checks to include writing routes.

**Key patterns to preserve:**

- Functional core, imperative shell: domain helpers decide; routes and scripts render or verify.
- One relationship source: writing entries own `relatedProjectSlugs`; project pages derive related writing.
- One route source: `prerenderRoutes` remains the explicit static route contract.
- One metadata source: writing page metadata, JSON-LD URLs, and sitemap paths derive from route helpers.

### Critical Pitfalls

1. **Content drift from split writing sources** - avoid by making the typed writing registry the only source for titles, summaries, slugs, dates, body, metadata, routes, and project relationships.
2. **Route duplication and prerender holes** - avoid by adding `writingDetailRoutes()` before UI work and feeding `prerenderRoutes`, sitemap, static verification, and browser checks from the same helper.
3. **SEO, JSON-LD, and sitemap mismatch** - avoid with pure writing metadata/JSON-LD helpers and static verification that compares generated HTML against helper-derived expectations.
4. **Broken project/note link integrity** - avoid by storing only `relatedProjectSlugs` on writing entries, resolving project links through `projectStoryHref()`, and testing public-only relationships.
5. **Accidental runtime dependencies or server assumptions** - avoid runtime `fetch`, filesystem reads, GitHub/API clients, API routes, dynamic OG endpoints, remote images, and public token-like env usage in visitor paths.
6. **Dark-primary readability regressions** - avoid light-first templates, fixed-height article cards, mobile overflow, and untested code/long-link layouts.
7. **Release overclaiming and verifier bloat** - avoid claiming writing coverage before automation proves it, and split verifier logic if writing expansion makes existing scripts harder to maintain.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Writing Domain Foundation

**Rationale:** Content, route, relationship, and validation helpers prevent almost every downstream drift problem.
**Delivers:** `src/domain/writing.ts`, seed public entries, typed body model, public selectors, writing path helpers, `relatedProjectSlugs`, optional validation helper, and focused unit tests.
**Addresses:** Typed registry, public/hidden filtering, unique slugs, required fields, stable order, related project slugs, and cross-link integrity.
**Avoids:** Content drift, invalid relationships, uncurated content dumps, ambiguous dates, and accidental runtime content sources.

### Phase 2: Writing Routes and Dark UI

**Rationale:** UI should come after helper boundaries are stable so route components stay thin and link behavior does not get rewritten.
**Delivers:** `/writing` index, `/writing/{slug}` detail pages, top-level nav entry, missing-slug fallback, note cards, readable article layout, note-to-project links, and project-to-note panels on selected project stories.
**Uses:** Existing SolidStart route structure, dark-primary shell/classes, Mystic/local UI primitives where compatible, and project route helpers.
**Avoids:** Light-first article templates, mobile text overflow, keyboard gaps, hidden content leaks, and duplicated link strings.

### Phase 3: Writing Metadata and Structured Data

**Rationale:** Metadata should be added after final route and content helpers exist so canonical URLs, schema URLs, and sitemap paths stay aligned.
**Delivers:** `/writing` metadata, note detail metadata, OG/Twitter article fields where supported, `BlogPosting` JSON-LD for notes, `ItemList` JSON-LD for the index, sitemap coverage, and static social preview fallback reuse.
**Addresses:** Route-specific discovery, structured data, canonical links, sitemap inclusion, and hidden/draft exclusion.
**Avoids:** Generic page metadata, schema overclaiming, dynamic OG/server work, and metadata copied into route components.

### Phase 4: Writing Verification and Release Contract

**Rationale:** Verification should close the milestone only after routes, UI, metadata, and link graph behavior are real. Plan the verifier shape early to avoid bloated scripts.
**Delivers:** Expanded Vitest coverage, `verify:curation` writing checks, `verify:static` generated HTML/metadata/JSON-LD/sitemap checks, Playwright keyboard/axe/mobile/dark/reduced-motion coverage, release-readiness facts, and precise release evidence labels.
**Addresses:** Static/browser/release verification and clean-builder confidence through `bun run install:browser && bun run verify`.
**Avoids:** Release overclaiming, brittle exact-text duplication, missing route artifacts, runtime API regressions, and verifier maintenance debt.

### Phase Ordering Rationale

- Domain first: every later phase needs stable selectors, paths, statuses, and relationship helpers.
- UI second: once route helpers exist, the writing routes and project cross-links can render without duplicating content authority.
- Metadata third: schema, canonical URLs, sitemap entries, and social metadata should derive from final route/content helpers.
- Verification last: the release gate should prove real generated artifacts and browser paths, not planned behavior.

### Research Flags

Phases likely needing deeper research during planning:

- **Phase 1:** Requirements discussion, not external research, should settle exact writing body block shape, note kinds, draft/hidden semantics, and whether code snippets are in v1.3.
- **Phase 4:** Targeted codebase research may be useful if expanding `scripts/verify-static.ts` requires a verifier split; the risk is local maintenance complexity, not external uncertainty.

Phases with standard patterns where `/gsd-research-phase` can usually be skipped:

- **Phase 2:** Existing project route and dark-primary UI patterns are already proven.
- **Phase 3:** Existing SEO/sitemap helpers plus Schema.org `BlogPosting`/`ItemList` patterns are well documented.
- **Most of Phase 4:** Existing static, browser, and release verifiers already provide the integration pattern; planning should focus on exact assertions and evidence labels.

## Explicit Out of Scope

- New dependencies for content, routing, SEO, search, feeds, dates, slugs, syntax highlighting, or social images.
- CMS, admin UI, database, auth, comments, likes, reactions, webmentions, newsletter backend, or analytics stack.
- Markdown, MDX, Contentlayer, Astro content collections, parser pipelines, or auto-imported external writing sources.
- RSS/Atom feeds, search, pagination, tag archive pages, and project-index note-count badges.
- Dynamic OG image endpoints, per-note raster generation, server routes for notes, or runtime content/API calls.
- Runtime GitHub, Gist, Notion, Substack, RSS, or token-dependent writing sources.
- Unfiltered mirroring of README files, issues, gists, repository notes, or every public repo artifact.
- Light-mode-first templates or motion-heavy article experiences that weaken dark readability, accessibility, or mobile layout.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Research is based on the current repo stack and existing verified v1.2 static patterns. Recommendation is conservative: no new dependencies. |
| Features | HIGH | Table stakes align across FEATURES, PROJECT scope, and existing project-detail release patterns. Search/RSS conventions are medium confidence but explicitly deferred. |
| Architecture | HIGH | The existing codebase already proves typed domain helpers, route derivation, SEO helpers, sitemap generation, and static/browser/release verification. |
| Pitfalls | HIGH | Pitfalls are grounded in local v1.2 integration patterns, existing verifier structure, and repo-local dark-primary/release guidance. |

**Overall confidence:** HIGH

### Gaps to Address

- Writing content shape: decide during requirements whether entries are notes, essays, technical notes, external references, or a mixed model.
- Draft semantics: decide whether v1.3 supports hidden/draft records or only checked-in published entries.
- Body block scope: start with paragraphs, lists/bullets, callouts/references, and optional plain code only if needed.
- Code snippets: if included, explicitly verify `pre`/`code` dark styling, wrapping/scroll behavior, mobile overflow, and static text output.
- Verifier split: if Phase 4 grows `scripts/verify-static.ts` materially, treat the split as part of the phase rather than unrelated cleanup.
- Project index writing group: decide whether the existing "Writing" project group should be renamed once `/writing` exists to avoid visitor confusion.

## Sources

### Primary (HIGH confidence)

- `.planning/research/STACK.md` - no-dependency stack recommendation, typed registry, static route, SEO, and verification implications.
- `.planning/research/FEATURES.md` - table stakes, differentiators, anti-features, and MVP recommendation.
- `.planning/research/ARCHITECTURE.md` - component boundaries, helper contracts, cross-link strategy, and build order.
- `.planning/research/PITFALLS.md` - critical pitfalls, phase-specific warnings, and roadmap implications.
- `.planning/PROJECT.md` - v1.3 scope, active requirements, constraints, and existing release gate.
- Local repo patterns referenced by the research: `src/domain/projects.ts`, `src/domain/routes.ts`, `src/domain/seo.ts`, `scripts/verify-static.ts`, `scripts/verify-release.ts`, `scripts/release-readiness.ts`, and `tests/browser-release.playwright.ts`.

### Secondary (MEDIUM-HIGH confidence)

- SolidStart route prerendering and metadata docs - official static route and `@solidjs/meta` behavior.
- Schema.org `BlogPosting`, `TechArticle`, and `ItemList` - structured data vocabulary for writing routes.
- Google Search Central Article structured data guidance - article metadata expectations.
- Bright Builds canonical standards at commit `05f8d7a6c9c2e157ec4f922a05273e72dab97676` - functional-core architecture, verification, testing, and TypeScript/JavaScript guidance.

### Tertiary (LOW confidence)

- None needed for v1.3 roadmap decisions. The safest plan is intentionally local and conservative.

---

*Research completed: 2026-06-03*
*Ready for roadmap: yes*
