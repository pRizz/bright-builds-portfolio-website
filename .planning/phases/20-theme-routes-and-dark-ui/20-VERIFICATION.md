---
phase: 20-theme-routes-and-dark-ui
verified: 2026-06-17T18:29:57Z
status: passed
score: 4/4 must-haves verified
generated_by: gsd-verifier
lifecycle_mode: yolo
phase_lifecycle_id: 20-2026-06-17T16-16-59
generated_at: 2026-06-17T18:29:57Z
lifecycle_validated: true
overrides_applied: 0
deferred:
  - truth: "Theme collaboration panels, practical next-action CTAs, and theme-aware project/writing cross-links are not part of Phase 20."
    addressed_in: "Phase 21"
    evidence: "Phase 21 goal: Visitors can move from theme paths into related projects, writing, and useful collaboration starting points."
  - truth: "Route-specific theme detail metadata, structured data, sitemap inclusion, and social-preview fallback are not part of Phase 20."
    addressed_in: "Phase 22"
    evidence: "Phase 22 success criteria cover route-specific metadata, JSON-LD, sitemap behavior, and static social preview fallback."
  - truth: "Aggregate release evidence labels and release-readiness documentation are not part of Phase 20."
    addressed_in: "Phase 23"
    evidence: "Phase 23 success criteria cover automated release gate proof and release evidence labels."
---

# Phase 20: Theme Routes and Dark UI Verification Report

**Phase Goal:** Visitors can browse and read static theme routes that synthesize Peter's work in the established dark-primary interface.
**Verified:** 2026-06-17T18:29:57Z
**Status:** passed
**Re-verification:** No - initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Visitor can open `/themes` and see public theme paths presented as curated entry points into Peter's work. | VERIFIED | `src/domain/routes.ts:67-78` registers `/themes`; `src/routes/themes/index.tsx:23-26` loads route metadata and `publicThemeEntries()`; `src/routes/themes/index.tsx:85-115` renders helper-derived cards with `themeDetailPath()` links and `Explore theme`. Generated `.output/public/themes/index.html` exists and contains both public themes. |
| 2 | Visitor can open stable `/themes/{slug}` static detail pages for every public theme path and understand each theme's main idea, why it matters, proof points, and project/writing connections before hydration. | VERIFIED | `src/domain/themes.ts:98-101` derives public detail routes from `publicThemeEntries()`; `src/routes/themes/[slug].tsx:14-22` gates by slug; `src/routes/themes/[slug].tsx:47-88` renders main idea, audience, proof points, and related panels; `src/routes/themes/[slug].tsx:94-148` links related project and writing records. Static route HTML checks passed for `/themes`, `/themes/agentic-engineering`, and `/themes/open-identity`. |
| 3 | Clean static builds prerender `/themes` and every public theme detail route, while hidden, unsupported, or invalid theme records do not create public pages or leak private content through fallback routes. | VERIFIED | `app.config.ts:7-10` uses explicit `routes: [...prerenderRoutes]` with `crawlLinks: false`; `src/domain/routes.ts:93-98` appends `themeDetailRoutes()`; `src/routes/themes/[slug].tsx:25-37` has one generic fallback that does not echo the slug. `bun run verify` prerendered 16 routes including both theme detail pages, and targeted checks confirmed `/themes/unknown-theme-slug` output is absent. |
| 4 | Theme index and detail pages preserve the dark-primary responsive interface with accessible headings, readable text hierarchy, keyboard reachability, and stable text wrapping on desktop and mobile. | VERIFIED | Theme routes use existing dark classes in `src/routes/themes/index.tsx:64-115` and `src/routes/themes/[slug].tsx:27-148`; CSS wrapping/reduced-motion guards are in `src/styles/app.css:70`, `331`, `384`, `594-616`, `669-708`. `tests/browser-release.playwright.ts:61-91` runs axe and desktop/mobile dark layout checks over every `prerenderRoutes` route; `tests/browser-release.playwright.ts:93-238` verifies keyboard and reduced-motion coverage for theme routes. |

**Score:** 4/4 truths verified

### Deferred Items

| # | Item | Addressed In | Evidence |
|---|------|--------------|----------|
| 1 | Collaboration panels and cross-links beyond route-local related cards. | Phase 21 | Roadmap Phase 21 owns collaboration pathways and cross-links. |
| 2 | Theme detail metadata, JSON-LD, sitemap inclusion, and social-preview fallback. | Phase 22 | Roadmap Phase 22 owns metadata and structured data. Phase 20 explicitly keeps theme URLs out of `sitemapRoutes`. |
| 3 | Release evidence labels and release-readiness documentation. | Phase 23 | Roadmap Phase 23 owns the aggregate release contract. |

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/domain/routes.ts` | Themes route, helper-derived prerender, separate sitemap source | VERIFIED | `/themes` route at lines 67-78; `themeDetailRoutes()` in `prerenderRoutes` at lines 93-98; `sitemapRoutes` excludes themes at lines 100-104. |
| `src/domain/seo.ts` | `sitemapXml()` defaults to `sitemapRoutes` | VERIFIED | `sitemapRoutes` imported at line 10; `sitemapXml(paths = sitemapRoutes)` at lines 332-333. |
| `src/domain/theme-routes.test.ts` | Route and sitemap boundary tests | VERIFIED | Tests assert route registration, nav order, prerender composition, and sitemap exclusion at lines 13-78. |
| `src/domain/portfolio-surfaces.test.ts` | Default sitemap behavior excludes themes | VERIFIED | Manual verification resolved the gsd-tools literal-pattern false negative: test calls `sitemapXml(undefined, peterProfile)` at line 301 and asserts theme URLs are absent at lines 320-324. |
| `src/routes/themes/index.tsx` | `/themes` public theme card grid | VERIFIED | Uses `publicThemeEntries()`, helper-derived labels, dark-primary card classes, and real anchors at lines 23-115. |
| `src/routes/themes/[slug].tsx` | Gated detail route and fallback | VERIFIED | Uses `maybePublicThemeEntryBySlug(params.slug ?? "")` at line 16, generic fallback at lines 25-37, and helper-derived related panels at lines 40-148. |
| `scripts/verify-static/*` | Theme static route verification | VERIFIED | Expected text is helper-derived in `expected-route-text.ts:112-118` and `270-295`; generated output coverage and unknown-route absence are in `sitemap-assets-verifier.ts:127-159`. |
| `tests/theme-detail-route.test.tsx` | Public detail and fallback render test | VERIFIED | SSR render tests assert public content and non-leaking unknown fallback at lines 14-74. |
| `tests/browser-release.playwright.ts` | Theme accessibility, layout, keyboard, reduced-motion checks | VERIFIED | Theme routes are included through the `prerenderRoutes` loop at lines 61-91; route-specific keyboard and reduced-motion checks are at lines 121-238 and helper selection at lines 275-309. |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `src/domain/routes.ts` | `src/domain/themes.ts` | `themeDetailRoutes()` | WIRED | Import at `routes.ts:2`; usage at `routes.ts:97`. |
| `app.config.ts` | `src/domain/routes.ts` | `routes: [...prerenderRoutes]`, `crawlLinks: false` | WIRED | Static preset with explicit routes at `app.config.ts:4-10`. |
| `src/domain/seo.ts` | `src/domain/routes.ts` | `sitemapRoutes` default | WIRED | Import at `seo.ts:10`, default at `seo.ts:332-333`. |
| `src/routes/themes/index.tsx` | `src/domain/themes.ts` | `publicThemeEntries()`, `themeDetailPath()` | WIRED | Data source at `index.tsx:25`, links at `index.tsx:90` and `108`. |
| `src/routes/themes/[slug].tsx` | `src/domain/themes.ts` | public gate and relationship helpers | WIRED | Public lookup at line 16; related project/writing helpers at lines 42-43. |
| `src/routes/themes/[slug].tsx` | project/writing route helpers | `projectDetailPath()`, `writingDetailPath()` | WIRED | Related links at lines 108 and 138. |
| `scripts/verify-static/expected-route-text.ts` | theme helpers | expected generated HTML text | WIRED | `maybeThemeForDetailRoute()` at lines 200-207; detail expected text at lines 270-295. |
| `tests/browser-release.playwright.ts` | `src/domain/routes.ts` | `for (const route of prerenderRoutes)` | WIRED | Manual verification resolved the gsd-tools regex false negative: loop exists at line 61 and covers axe/layout for all prerendered routes. |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| `src/routes/themes/index.tsx` | `themes` | `publicThemeEntries()` -> `curatedThemes` | Yes, two public themes from `src/domain/themes.ts:42-79` | FLOWING |
| `src/routes/themes/[slug].tsx` | `theme` | `useParams()` -> `maybePublicThemeEntryBySlug()` -> public selector | Yes, only public records resolve; unknown slugs return `null` | FLOWING |
| `src/routes/themes/[slug].tsx` | `relatedProjects`, `relatedWriting` | `relatedProjectDetailPageProjectsForTheme()` and `relatedWritingEntriesForTheme()` | Yes, resolves existing selected project and public writing records | FLOWING |
| `app.config.ts` static routes | `prerenderRoutes` | `siteRoutes`, `projectDetailRoutes()`, `writingDetailRoutes()`, `themeDetailRoutes()` | Yes, build prerendered 16 routes including `/themes` and both public theme details | FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Aggregate repo verification | `bun run verify` | Passed: format/check/typecheck, 177 tests, curation/runtime/visual guards, build, 83 Playwright passes with expected project-scoped skips, and static verification. | PASS |
| Route helper contract | Bun import of `navigationRoutes`, `publicThemeEntries()`, `themeDetailRoutes()`, `prerenderRoutes`, `sitemapRoutes` | Navigation is Home/About/Projects/Writing/Themes/Contact; public theme routes are `/themes/agentic-engineering` and `/themes/open-identity`; prerender includes themes; sitemap does not. | PASS |
| Static output files | `test -f .output/public/themes/index.html`, public detail file checks, and unknown-route absence check | `/themes` and both public details exist; `/themes/unknown-theme-slug` does not. | PASS |
| Theme route HTML verifier | Bun `assertRouteHtml()` loop over theme routes | Passed for `/themes`, `/themes/agentic-engineering`, `/themes/open-identity`. | PASS |
| Exact theme sitemap exclusion | `rg "<loc>https://www.brightbuilds.us/themes...` in `sitemap.xml` | No exact theme index or theme detail URLs found. | PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| ROUTE-01 | 20-01, 20-02 | Stable `/themes` index listing public theme paths. | SATISFIED | Route registry, UI route, generated HTML, and browser checks verified. |
| ROUTE-02 | 20-02 | Stable `/themes/{slug}` static detail routes for every public theme. | SATISFIED | `themeDetailRoutes()` and build output verified both public detail pages. |
| ROUTE-03 | 20-01, 20-03 | Clean static builds prerender theme routes before hydration. | SATISFIED | `bun run verify` build prerendered 16 routes, including theme routes; static HTML checks passed. |
| ROUTE-04 | 20-01, 20-02, 20-03 | Hidden, unsupported, invalid records do not create public pages or leak content. | SATISFIED | Public selectors only, generic fallback render test, source fallback verifier, and unknown static output absence check passed. |
| SYNTH-01 | 20-02, 20-03 | Theme detail explains idea, why it matters, proof points, and project/writing connections. | SATISFIED | Detail route renders summary, audience, proof points, related project cards, and related writing cards from helper-resolved data. |
| SYNTH-04 | 20-02, 20-04 | Dark-primary responsive interface, headings, hierarchy, keyboard, wrapping. | SATISFIED | Existing dark classes and CSS guards are used; Playwright axe, desktop/mobile layout, keyboard, and reduced-motion checks passed. |

No orphaned Phase 20 requirements found. Later SYNTH/COLLAB/META/VERIFY requirements are mapped to Phases 21-23.

### Test Quality Audit

| Test File | Linked Req | Active | Skipped | Circular | Assertion Level | Verdict |
|-----------|------------|--------|---------|----------|-----------------|---------|
| `src/domain/theme-routes.test.ts` | ROUTE-01, ROUTE-03, ROUTE-04 | 3 | 0 | No | Value | PASS |
| `tests/theme-detail-route.test.tsx` | ROUTE-02, ROUTE-04, SYNTH-01 | 2 | 0 | No | Rendered value and forbidden text | PASS |
| `scripts/verify-static.test.ts` plus `scripts/verify-static/*` | ROUTE-03, ROUTE-04, SYNTH-01 | 13 helper tests in suite | 0 | No | Value and generated-output verifier callable | PASS |
| `tests/browser-release.playwright.ts` | SYNTH-04 | 83 passed browser checks in aggregate run | 19 project-scoped skips | No | Behavioral | PASS |

Disabled-test scan found only Playwright `test.skip()` calls that scope layout checks to desktop/mobile projects, keyboard checks away from reduced-motion, and reduced-motion checks to the reduced-motion project. Those are active coverage partitioning, not disabled requirement tests. `writeFileSync` appears only in a temporary unsafe-asset fixture in `scripts/verify-static.test.ts`, not as a baseline generator. Expected static text is intentionally derived from public domain helpers and compared against built HTML, matching the helper-derived route contract.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| None | - | No blocker stub, placeholder, TODO/FIXME, empty handler, console-only implementation, light-first theme class, runtime fetch, schema, Prisma, search/filter UI, or Phase 21/22/23 overclaim found in Phase 20 files. | - | - |

Benign scan matches were reviewed: helper functions return `null` or `[]` for unmatched route parsing, and Playwright uses project-scoped `test.skip()` to partition coverage.

### Human Verification Required

None. The Phase 20 dark UI, keyboard, reduced-motion, axe, desktop/mobile layout, text-overlap, generated HTML, and static route behaviors were all covered by automated checks.

### Gaps Summary

No gaps found. Phase 20 achieved its route/UI goal. The only unimplemented theme concerns are explicitly deferred to later roadmap phases and are not Phase 20 failures.

---

_Verified: 2026-06-17T18:29:57Z_
_Verifier: the agent (gsd-verifier)_
