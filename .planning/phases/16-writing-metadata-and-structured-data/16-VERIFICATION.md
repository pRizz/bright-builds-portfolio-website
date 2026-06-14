---
phase: 16-writing-metadata-and-structured-data
verified: 2026-06-14T16:09:33Z
status: passed
score: 10/10 must-haves verified
generated_by: gsd-verifier
lifecycle_mode: yolo
phase_lifecycle_id: 16-2026-06-14T15-12-27
generated_at: 2026-06-14T16:09:33Z
lifecycle_validated: true
overrides_applied: 0
---

# Phase 16: Writing Metadata and Structured Data Verification Report

**Phase Goal:** Writing routes are discoverable as static pages with metadata, structured data, sitemap behavior, and social-preview fallback derived from writing helpers.  
**Verified:** 2026-06-14T16:09:33Z  
**Status:** passed  
**Re-verification:** No - initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | `/writing` and public `/writing/{slug}` pages expose route-specific title, description, canonical URL, Open Graph, and Twitter metadata. | VERIFIED | `bun run build` prerendered `/writing` plus both public detail routes. Direct generated HTML checks found `/writing` website metadata and both detail pages with entry-specific titles, descriptions, canonicals, `og:type="article"`, and `twitter:card="summary_large_image"`. `bun run verify:static` passed. |
| 2 | Writing metadata decisions are pure helper outputs, not copied route-component literals. | VERIFIED | `metadataForWritingEntry()` in `src/domain/seo.ts` derives title, summary description, canonical URL, article metadata, Twitter metadata, and social image from `PublicWritingEntry`, `Profile`, and `writingDetailPath()`. Routes consume helper outputs. |
| 3 | Each public writing detail entry has helper-derived title, summary description, canonical URL, article Open Graph fields, Twitter fields, and the checked-in social fallback. | VERIFIED | `src/routes/writing/[slug].tsx` calls `metadataForWritingEntry(entry)` and renders canonical, OG, Twitter, article date/tag, and fallback image tags. `scripts/verify-static.ts` asserts the same against generated HTML. |
| 4 | Writing detail JSON-LD is a static `BlogPosting` object derived from `PublicWritingEntry` and `personJsonLd()`. | VERIFIED | `writingBlogPostingJsonLd()` returns `BlogPosting` with headline, description, canonical URL, image, author/creator from `personJsonLd(profile)`, optional dates, keywords/about, and article body. Generated detail HTML contains `BlogPosting` JSON-LD with `https://openlinks.us/` in `sameAs`. |
| 5 | The writing index JSON-LD is an `ItemList` in the same order as `publicWritingEntries()`. | VERIFIED | `writingItemListJsonLd(writingEntries)` is rendered on `/writing`; focused tests verify fixture order and public filtering; generated `/writing/index.html` contains ordered `ItemList` entries for both public writing paths. |
| 6 | Generated `/writing` HTML exposes route metadata and `ItemList` JSON-LD before hydration. | VERIFIED | `.output/public/writing/index.html` contains the head metadata, Person JSON-LD, and writing `ItemList` before `window.manifest`. |
| 7 | Every generated public `/writing/{slug}` page exposes entry-specific metadata, article fields, Twitter fields, and `BlogPosting` JSON-LD before hydration. | VERIFIED | `.output/public/writing/agentic-engineering-workflows/index.html` and `.output/public/writing/portable-identity-and-owned-surfaces/index.html` contain entry-specific metadata and `BlogPosting` scripts before hydration. |
| 8 | Sitemap output includes `/writing` and public writing detail routes while excluding non-public and unknown writing paths. | VERIFIED | `public/sitemap.xml` and `.output/public/sitemap.xml` include `/writing/agentic-engineering-workflows` and `/writing/portable-identity-and-owned-surfaces`; generated output has no unknown/draft/hidden/archived writing directories. Unit tests cover draft/hidden/archived fixture exclusion through `writingDetailRoutes()` and `sitemapXml()`. |
| 9 | Writing routes use the checked-in static social preview fallback and no runtime image generation path. | VERIFIED | `public/social/bright-builds-og.png` is a checked-in 1200x630 PNG. Metadata helpers use `socialImageForProfile()` and generated HTML references `https://www.brightbuilds.us/social/bright-builds-og.png`. Pattern scan found no runtime image endpoint or fetch path in the changed scope. |
| 10 | Unknown writing slug fallback stays non-leaking and does not reveal requested or unpublished slugs. | VERIFIED | `src/routes/writing/[slug].tsx` gates detail data through `maybePublicWritingEntryBySlug(params.slug ?? "")`; fallback copy is fixed and does not echo `params.slug`. Static verifier asserts no `/writing/unknown-writing-slug` output and checks fallback source copy. |

**Score:** 10/10 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/domain/seo.ts` | Writing metadata, `BlogPosting`, `ItemList`, sitemap, JSON-LD escaping, and social fallback helpers | VERIFIED | 405 lines; exports `metadataForWritingEntry`, `writingBlogPostingJsonLd`, `writingItemListJsonLd`; uses `personJsonLd(profile)`, `writingDetailPath()`, `publicWritingEntries()`, and `sitemapXml()`. |
| `src/domain/writing-metadata.test.ts` | Focused unit coverage for helper metadata, JSON-LD, escaping, social fallback, and sitemap behavior | VERIFIED | 314 lines; `bun run test src/domain/writing-metadata.test.ts` passed 9 tests. |
| `src/routes/writing/index.tsx` | `/writing` route head metadata and `ItemList` JSON-LD | VERIFIED | Renders `metadataForRoute(routeByPath("/writing"))`, static asset links, OG/Twitter tags, Person JSON-LD, and `writingItemListJsonLd(writingEntries)`. |
| `src/routes/writing/[slug].tsx` | Public detail route metadata, article fields, and `BlogPosting` JSON-LD | VERIFIED | Renders helper-derived metadata and `writingBlogPostingJsonLd(entry)` only after `maybePublicWritingEntryBySlug()` returns a public entry. |
| `scripts/verify-static.ts` | Generated-output assertions for writing metadata, JSON-LD, sitemap, and social fallback behavior | VERIFIED | Includes `assertMetadataForWritingEntry`, `assertWritingBlogPostingJsonLd`, and `assertSitemapWritingCoverage`; `bun run verify:static` passed. |
| `public/sitemap.xml` | Checked-in route-derived sitemap | VERIFIED | Includes `/writing` and both public writing detail URLs; no draft/hidden/archived/unknown writing URLs. |
| `.output/public/writing/**/index.html` | Generated static writing pages | VERIFIED | Build emitted `/writing`, `/writing/agentic-engineering-workflows`, and `/writing/portable-identity-and-owned-surfaces`; no unknown/non-public writing output found. |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `src/domain/seo.ts` | `src/domain/writing.ts` | `PublicWritingEntry`, `publicWritingEntries`, `writingDetailPath` | WIRED | Imports writing types/helpers and uses them in metadata, JSON-LD, ItemList, and sitemap-related tests. |
| `src/domain/seo.ts` | `src/domain/profile.ts` | `peterProfile`, `Profile`, `personJsonLd(profile)` | WIRED | `personJsonLd(profile)` is reused for writing author/creator identity and OpenLinks `sameAs`. |
| `src/domain/writing-metadata.test.ts` | `src/domain/seo.ts` | Metadata, JSON-LD, sitemap, and escaping helper imports | WIRED | Focused tests import and execute the Phase 16 helper surface. |
| `src/routes/writing/index.tsx` | `src/domain/seo.ts` | `metadataForRoute`, `personJsonLd`, `writingItemListJsonLd`, `jsonLdScriptContent` | WIRED | `/writing` renders helper-derived metadata and JSON-LD scripts. |
| `src/routes/writing/[slug].tsx` | `src/domain/seo.ts` | `metadataForWritingEntry`, `writingBlogPostingJsonLd`, `jsonLdScriptContent` | WIRED | Detail pages render helper-derived head tags and JSON-LD. |
| `scripts/generate-static-metadata.ts` | `src/domain/seo.ts` | `sitemapXml()` and `robotsTxt()` | WIRED | `bun run generate:static-metadata` rewrote checked-in `public/sitemap.xml` and `public/robots.txt` from helper output. |
| `app.config.ts` | `src/domain/routes.ts` | `prerenderRoutes` | WIRED | SolidStart static build prerenders route-derived public writing detail routes. |
| `scripts/verify-static.ts` | Generated `.output/public` | Metadata/JSON-LD/sitemap assertions | WIRED | `verify:static` validates generated writing HTML, sitemap, assets, robots, and exclusion behavior. |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| `metadataForWritingEntry(entry)` | `entry`, `profile` | `PublicWritingEntry` from `publicWritingEntries()` / `maybePublicWritingEntryBySlug()` and `peterProfile` | Yes - checked-in writing registry and profile data | FLOWING |
| `writingBlogPostingJsonLd(entry)` | `entry.sections`, `entry.topics`, `entry.tags`, identity | `PublicWritingEntry` plus `personJsonLd(profile)` | Yes - static article text, tags, dates, author identity | FLOWING |
| `writingItemListJsonLd(writingEntries)` | `writingEntries` | `publicWritingEntries()` | Yes - ordered public entries only | FLOWING |
| `public/sitemap.xml` and `.output/public/sitemap.xml` | `paths` | `sitemapXml(prerenderRoutes)` where `prerenderRoutes` includes `writingDetailRoutes()` | Yes - public writing routes from helper filtering | FLOWING |
| Generated social metadata | `metadata.openGraph.image`, `metadata.twitter.image` | `socialImageForProfile(profile)` and checked-in `public/social/bright-builds-og.png` | Yes - 1200x630 PNG verified | FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Focused writing metadata helper coverage | `bun run test src/domain/writing-metadata.test.ts` | 1 file / 9 tests passed | PASS |
| Full unit suite | `bun run test` | 13 files / 136 tests passed | PASS |
| TypeScript compile surface | `bun run typecheck` | `tsc --noEmit` passed | PASS |
| Formatting | `bun run format:check` | Biome checked 55 files, no fixes needed | PASS |
| Lint/check | `bun run check` | Biome checked 55 files, no fixes needed | PASS |
| Static metadata generation | `bun run generate:static-metadata` | Wrote `public/sitemap.xml` and `public/robots.txt` | PASS |
| Static production build | `bun run build` | Prerendered 13 routes, including `/writing` and both public writing details | PASS |
| Generated-output verification | `bun run verify:static` | Verified 13 prerendered routes, metadata, JSON-LD, assets, sitemap, and robots | PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| META-01 | 16-01 and 16-02 | `/writing` and each writing detail route have route-specific title, description, canonical URL, Open Graph, and Twitter metadata derived from writing and profile data. | SATISFIED | Helper tests pass; routes render helper metadata; generated HTML checks and `verify:static` confirm `/writing` and both public detail pages. |
| META-02 | 16-01 and 16-02 | Writing detail routes render static `BlogPosting` JSON-LD and the writing index renders collection or `ItemList` JSON-LD before hydration. | SATISFIED | `writingBlogPostingJsonLd()` and `writingItemListJsonLd()` are tested; generated HTML contains `BlogPosting` and `ItemList` scripts before `window.manifest`; `verify:static` passed. |
| META-03 | 16-01 and 16-02 | Generated sitemap output includes public writing routes and excludes draft or hidden writing routes. | SATISFIED | `sitemapXml()` derives from `prerenderRoutes`; `public/sitemap.xml` and `.output/public/sitemap.xml` include `/writing` and both public details; unit fixtures cover draft/hidden/archived exclusion; static verifier checks no unknown/non-public output. |
| META-04 | 16-01 and 16-02 | Writing routes use the checked-in static social preview fallback without runtime image generation. | SATISFIED | Metadata helper uses `socialImageForProfile()`; generated HTML references `/social/bright-builds-og.png`; `file public/social/bright-builds-og.png` reports 1200x630 PNG; static verifier asserts local asset mapping and dimensions. |

No Phase 16 requirement IDs were orphaned. `META-01`, `META-02`, `META-03`, and `META-04` appear in both plan frontmatters and in `.planning/REQUIREMENTS.md`.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| None | - | - | - | No blocker or warning anti-patterns found. Benign scan hits were nullable helper returns, negative assertions in tests, and static-verifier forbidden-pattern definitions. |

### Human Verification Required

None. This phase is metadata/static-discovery work, and the requirements were proven by focused unit tests, production build output, generated HTML/sitemap inspection, and `verify:static`.

### Gaps Summary

No gaps found. Phase 16 achieved its goal: writing routes are statically discoverable with helper-derived metadata, structured data, route-derived sitemap behavior, and the checked-in social-preview fallback.

## Verification Metadata

**Verification approach:** Goal-backward verification from roadmap success criteria plus plan frontmatter must-haves.  
**Must-haves source:** `.planning/ROADMAP.md`, `16-01-PLAN.md`, and `16-02-PLAN.md`.  
**Lifecycle provenance:** Validated. `16-CONTEXT.md`, both plans, and both summaries share `lifecycle_mode: yolo` and `phase_lifecycle_id: 16-2026-06-14T15-12-27`; this report uses the expected `gsd-verifier` provenance.  
**Relevant standards loaded:** `AGENTS.md`, `AGENTS.bright-builds.md`, `standards-overrides.md`, Bright Builds canonical architecture, code-shape, testing, verification, TypeScript/JavaScript standards, and OpenLinks surface guidance.  
**Previous verification:** None found.  
**Deferred items:** None. Phase 17 owns broader release-contract/browser labels, but no Phase 16 must-have is deferred.

---

_Verified: 2026-06-14T16:09:33Z_  
_Verifier: the agent (gsd-verifier)_
