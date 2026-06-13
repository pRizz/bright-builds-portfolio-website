---
phase: 15-writing-routes-and-dark-ui
verified: 2026-06-13T18:52:44Z
status: passed
score: "10/10 must-haves verified"
generated_by: gsd-verifier
lifecycle_mode: yolo
phase_lifecycle_id: 15-2026-06-13T16-56-50
generated_at: 2026-06-13T18:52:44Z
lifecycle_validated: true
overrides_applied: 0
deferred:
  - truth: "Full writing route-specific metadata, BlogPosting or ItemList JSON-LD, sitemap discovery assertions, and social preview fallback polish"
    addressed_in: "Phase 16"
    evidence: "Phase 16 goal and success criteria explicitly cover writing metadata, structured data, sitemap behavior, and social-preview fallback."
  - truth: "Release-readiness docs, evidence labels, aggregate release contract updates, and expanded browser release coverage labels"
    addressed_in: "Phase 17"
    evidence: "Phase 17 goal and success criteria explicitly cover release gate proof, browser coverage, release docs, aggregate verify coverage, and evidence labels."
---

# Phase 15: Writing Routes and Dark UI Verification Report

**Phase Goal:** Visitors can browse and read public writing routes, then move between notes and selected project stories without runtime data dependencies.
**Verified:** 2026-06-13T18:52:44Z
**Status:** passed
**Re-verification:** No - initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Visitor can reach `/writing` from site navigation and see public writing entries in helper order. | ✓ VERIFIED | `src/domain/routes.ts:54-64` defines `/writing`; `SiteLayout.tsx:22-32` renders `navigationRoutes`; `bun -e` showed nav order `Home, About, Projects, Writing, Contact` and public slugs in display order. |
| 2 | Static prerender data and output include `/writing` and every public `/writing/{slug}` route. | ✓ VERIFIED | `src/domain/routes.ts:80-84` composes `...writingDetailRoutes()`; `app.config.ts:5-10` passes `prerenderRoutes`; `.output/public/writing/*/index.html` contains the index and both public detail pages. |
| 3 | Writing detail pages render title, summary, metadata, sections, and body content before hydration. | ✓ VERIFIED | `src/routes/writing/[slug].tsx:57-114` renders article data from `PublicWritingEntry`; `scripts/verify-static.ts:188-204` asserts expected text in `preHydrationBody()`, and `bun run verify:static` passed. |
| 4 | Hidden, draft, archived, unpublished, unknown, or missing writing slugs do not expose private content or create public detail pages. | ✓ VERIFIED | `publicWritingEntries()` filters `status === "published"` at `src/domain/writing.ts:112-122`; `writingDetailRoutes()` derives only public routes at `src/domain/writing.ts:129-132`; static verifier checks non-public and unknown output absence at `scripts/verify-static.ts:913-929` and `scripts/verify-static.ts:1052-1060`. |
| 5 | Unknown writing slugs have a non-leaking Browse writing fallback in the route component. | ✓ VERIFIED | `src/routes/writing/[slug].tsx:25-44` resolves only `maybePublicWritingEntryBySlug(params.slug ?? "")` and fallback copy does not echo the requested slug. |
| 6 | Writing detail pages link onward to related selected project stories. | ✓ VERIFIED | `src/routes/writing/[slug].tsx:54-112` derives `relatedProjectDetailPageProjects(entry)` and links each item with `projectDetailPath(project)`. |
| 7 | Selected project detail pages show related writing derived from writing data, with no reciprocal project fields. | ✓ VERIFIED | `src/routes/projects/[slug].tsx:265-300` uses `publicWritingEntriesForProject(props.project)` and `writingDetailPath(entry)`; `src/domain/writing.ts:145-151` filters public writing by `relatedProjectSlugs.includes(project.slug)`. |
| 8 | Related writing cards show title, kind/date metadata, summary, and Read note or Read essay links. | ✓ VERIFIED | `src/routes/projects/[slug].tsx:280-292` renders title, metadata chips, summary, and action link labels from route-local helpers. |
| 9 | Writing pages remain readable in the dark-primary interface on desktop/mobile with accessible headings and stable wrapping. | ✓ VERIFIED | `src/styles/app.css:324-368` defines writing grids and wrapping; no light-first class matches were found; Playwright route-derived axe/layout checks passed for `/writing` and both writing detail routes. |
| 10 | Verification proves static/browser coverage without taking Phase 16 metadata/JSON-LD or Phase 17 release-label scope. | ✓ VERIFIED | `scripts/verify-static.ts:259-323` asserts writing index/detail content; `tests/browser-release.playwright.ts:48-79` loops over `prerenderRoutes`; `bun run verify` passed. Phase 16/17 work remains deferred below. |

**Score:** 10/10 truths verified

### Deferred Items

Items not yet met but explicitly addressed in later milestone phases.

| # | Item | Addressed In | Evidence |
|---|------|-------------|----------|
| 1 | Full writing-specific metadata, `BlogPosting`/`ItemList` JSON-LD, sitemap discovery assertions, and social-preview fallback polish. | Phase 16 | ROADMAP Phase 16 success criteria cover route metadata, JSON-LD, sitemap inclusion/exclusion, and static social preview fallback. |
| 2 | Release-readiness docs, evidence labels, expanded browser release coverage labels, and aggregate release contract wording. | Phase 17 | ROADMAP Phase 17 success criteria cover release gate proof, browser checks, release docs, aggregate `bun run verify`, and evidence labels. |

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/domain/writing.ts` | Public selectors, detail routes, project-to-writing helper | ✓ VERIFIED | Exists, substantive, exported helpers verified by tests; data source is checked-in `curatedWriting`. |
| `src/domain/writing-validation.ts` | Unsafe writing link href validation | ✓ VERIFIED | `unsafe_link_href` is defined and enforced for link blocks with an internal/anchor/HTTPS allow-list. |
| `src/domain/routes.ts` | `/writing` route and writing detail prerender inclusion | ✓ VERIFIED | Route, nav order, and `...writingDetailRoutes()` are present. |
| `src/domain/writing.test.ts` | Route/helper unit coverage | ✓ VERIFIED | Active tests cover public filtering, nav order, prerender inclusion, and project-to-writing helper behavior. |
| `src/domain/writing-validation.test.ts` | Link/date/curation validation coverage | ✓ VERIFIED | Active tests cover unsafe protocols, safe hrefs, invalid dates, required fields, and related project integrity. |
| `src/routes/writing/index.tsx` | `/writing` index UI | ✓ VERIFIED | Renders metadata, intro copy, public entries, chips, related counts, and action links from helpers. |
| `src/routes/writing/[slug].tsx` | Public detail UI and fallback | ✓ VERIFIED | Resolves public slugs, renders typed blocks, links related projects, and renders non-leaking fallback. |
| `src/routes/projects/[slug].tsx` | Related writing panel | ✓ VERIFIED | Conditional panel derives related writing from writing data and renders required card content. |
| `src/styles/app.css` | Writing layout/readability classes | ✓ VERIFIED | Writing-specific CSS has responsive grid constraints, dark-primary styling, and overflow wrapping. |
| `scripts/verify-static.ts` | Static output assertions | ✓ VERIFIED | Asserts writing index/detail content, related links, unsafe href absence, generated route coverage, and unknown route absence. |
| `tests/browser-release.playwright.ts` | Route-derived browser checks | ✓ VERIFIED | Loops over `prerenderRoutes` for axe and dark desktop/mobile layout; reduced-motion check remains route-scoped by design. |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `SiteLayout.tsx` | `src/domain/routes.ts` | `navigationRoutes` | ✓ WIRED | `SiteLayout.tsx:24-32` renders route labels/paths; `/writing` is in `siteRoutes`. |
| `app.config.ts` | `src/domain/routes.ts` | `routes: [...prerenderRoutes]` | ✓ WIRED | Static build consumes route registry directly. |
| `src/domain/routes.ts` | `src/domain/writing.ts` | `writingDetailRoutes()` | ✓ WIRED | `src/domain/routes.ts:1-3` imports writing routes and `:80-84` includes them. |
| `src/routes/writing/index.tsx` | `src/domain/writing.ts` | `publicWritingEntries()`, `writingDetailPath(entry)` | ✓ WIRED | Index route renders helper data and links to detail paths. |
| `src/routes/writing/[slug].tsx` | `src/domain/writing.ts` | `maybePublicWritingEntryBySlug(params.slug ?? "")` | ✓ WIRED | Detail route cannot render draft/hidden records because lookup is public-only. |
| `src/routes/writing/[slug].tsx` | `src/domain/projects.ts` | `relatedProjectDetailPageProjects(entry)`, `projectDetailPath(project)` | ✓ WIRED | Writing detail pages link to selected project stories. |
| `src/routes/projects/[slug].tsx` | `src/domain/writing.ts` | `publicWritingEntriesForProject(project)`, `writingDetailPath(entry)` | ✓ WIRED | Project detail pages derive related public writing without project record fields. |
| `scripts/verify-static.ts` | `src/domain/writing.ts` | `maybeWritingForDetailRoute`, `publicWritingEntries`, `writingDetailRoutes` | ✓ WIRED | Static verifier branches writing detail checks before top-level route assertions. |
| `tests/browser-release.playwright.ts` | `src/domain/routes.ts` | `for (const route of prerenderRoutes)` | ✓ WIRED | Manual check verified the route-derived loop at `tests/browser-release.playwright.ts:48-79`; gsd key-link tool false-negative was pattern escaping only. |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| `src/routes/writing/index.tsx` | `writingEntries` | `publicWritingEntries()` -> `curatedWriting` | Yes, two checked-in published entries | ✓ FLOWING |
| `src/routes/writing/[slug].tsx` | `entry()` | `params.slug` -> `maybePublicWritingEntryBySlug()` -> `curatedWriting` | Yes, public-only entry or fallback | ✓ FLOWING |
| `src/routes/writing/[slug].tsx` | `relatedProjects` | `relatedProjectDetailPageProjects(entry)` -> selected project helpers | Yes, selected project stories only | ✓ FLOWING |
| `src/routes/projects/[slug].tsx` | `relatedWriting()` | `publicWritingEntriesForProject(project)` -> public writing registry | Yes, public writing filtered by project slug | ✓ FLOWING |
| `scripts/verify-static.ts` | `expectedRoutes` | `prerenderRoutes` -> route helpers | Yes, 13 generated static routes | ✓ FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Aggregate verification gate | `bun run verify` | Passed: format, check, typecheck, 12 Vitest files/127 tests, curation/runtime guards, visual-system guard, build, browser, static, release. | ✓ PASS |
| Route/nav helper data | `bun -e 'import ...; console.log(...)'` | Nav order includes Writing; writing routes are `/writing`, `/writing/agentic-engineering-workflows`, `/writing/portable-identity-and-owned-surfaces`. | ✓ PASS |
| Static output exists | `find .output/public/writing -maxdepth 3 -type f -name index.html` | Found index plus both public writing detail HTML files. | ✓ PASS |
| Unknown route not generated | `test -e .output/public/writing/unknown-writing-slug/index.html` | Exit 1 as expected; no unknown static detail output. | ✓ PASS |
| Browser coverage loop | `rg -n 'for \(const route of prerenderRoutes\)' tests/browser-release.playwright.ts` | Found route-derived browser loop at line 49. | ✓ PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| ROUTE-01 | 15-01, 15-02, 15-04 | Visitor can open stable `/writing` index listing public writing entries in curated or reverse-chronological order. | ✓ SATISFIED | `/writing` route/nav present; index renders `publicWritingEntries()` in helper order. |
| ROUTE-02 | 15-01, 15-02, 15-04 | Visitor can open stable `/writing/{slug}` static detail routes for every public writing entry. | ✓ SATISFIED | `writingDetailRoutes()` derives both public routes; build prerendered both. |
| ROUTE-03 | 15-01, 15-04 | Clean static builds prerender `/writing` and every public writing detail route before hydration. | ✓ SATISFIED | `app.config.ts` consumes `prerenderRoutes`; `bun run verify:static` checks pre-hydration body content. |
| ROUTE-04 | 15-01, 15-04 | Hidden, draft, archived-only, or otherwise unpublished writing entries do not create public detail pages. | ✓ SATISFIED | Public helper filter excludes non-published entries; static verifier checks non-public entries if present and unknown sentinel route. |
| READ-01 | 15-02, 15-04 | Visitor can understand each writing entry's main idea, context, and relevance from static detail page. | ✓ SATISFIED | Detail pages render title, summary, date, topics/tags, sections, paragraph/list/callout/link blocks. |
| READ-02 | 15-02, 15-04 | Writing index/detail pages preserve dark-primary responsive layout, accessible headings, readable text, stable layout. | ✓ SATISFIED | CSS wrapping/grid rules present; Playwright axe and dark layout checks passed desktop/mobile. |
| READ-03 | 15-02, 15-03, 15-04 | Writing detail pages provide paths back to index and onward to related projects. | ✓ SATISFIED | Detail route renders `Back to writing`; related project cards link to `projectDetailPath(project)`. |
| LINK-02 | 15-01, 15-03, 15-04 | Project detail pages display related writing links derived from writing data without duplicating relationship data. | ✓ SATISFIED | `publicWritingEntriesForProject()` derives relationships from `curatedWriting`; no reciprocal project fields were added. |

### Test Quality Audit

| Test File | Linked Req | Active | Skipped | Circular | Assertion Level | Verdict |
|-----------|------------|--------|---------|----------|-----------------|---------|
| `src/domain/writing.test.ts` | ROUTE-01, ROUTE-02, ROUTE-03, ROUTE-04, LINK-02 | Yes | 0 | No writes/generation found | Value/behavioral helper assertions | ✓ PASS |
| `src/domain/writing-validation.test.ts` | ROUTE-04, link safety plan must-have | Yes | 0 | No writes/generation found | Value assertions on error codes/messages | ✓ PASS |
| `src/domain/foundation.test.ts` | ROUTE-03 | Yes | 0 | No writes/generation found | Exact route array assertions | ✓ PASS |
| `src/domain/portfolio-surfaces.test.ts` | ROUTE-03, sitemap side effects | Yes | 0 | No writes/generation found | Exact helper/sitemap assertions | ✓ PASS |
| `tests/browser-release.playwright.ts` | READ-02, Plan 15-04 browser coverage | Yes | 3 scoped `test.skip` guards | No writes/generation found | Axe/layout/keyboard/reduced-motion behavioral assertions | ✓ PASS |

Disabled tests on requirements: 0 blocking. The three `test.skip` calls are project-scoped guards so each browser behavior runs only on the intended Playwright project.

Circular patterns detected: 0 in requirement-linked tests.

Insufficient assertions: 0 blocking. Static and unit tests assert values/content, not only existence.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `scripts/verify-static.ts` | file | 1074 lines, above Bright Builds file-size refactor trigger | ℹ️ Info | Existing verifier has grown large; code review marked this future refactor risk, not a Phase 15 goal blocker. |

No blocker anti-patterns were found. Stub scan matches were expected guard-return branches, verifier forbidden-pattern definitions, scoped Playwright skips, or `console.log` summary output in a CLI verifier. No TODO/FIXME placeholders, runtime fetches, unsafe generated hrefs, prohibited parser/content dependencies, or light-first UI classes were found in Phase 15 runtime files.

### Human Verification Required

None remaining. The phase includes checked browser evidence in `15-04-SUMMARY.md`, and the current `bun run verify` rerun passed route-derived axe and dark layout checks across desktop/mobile plus reduced-motion coverage.

### Gaps Summary

No gaps found. Phase 15 achieves the goal: visitors can browse public writing, read public static detail routes before hydration, avoid non-public writing exposure, move between writing and selected project stories, and use the dark-primary responsive UI without runtime data dependencies.

## Verification Metadata

**Verification approach:** Goal-backward verification from ROADMAP success criteria, merged with plan frontmatter must-haves.

**Must-haves source:** ROADMAP Phase 15 success criteria plus `15-01` through `15-04` PLAN frontmatter, deduplicated into 10 observable truths.

**Lifecycle provenance:** Validated. CONTEXT, all PLAN files, and all SUMMARY files share `lifecycle_mode: yolo` and `phase_lifecycle_id: 15-2026-06-13T16-56-50`.

**Automated checks:** `bun run verify` passed end-to-end during verification.

**Human checks required:** 0 remaining.

**Disconfirmation pass:** Checked for partial Phase 16/17 scope creep, misleading skipped Playwright tests, unknown-route exposure, unsafe href output, and hardcoded empty data. No blocking gaps found; Phase 16/17 items are explicitly deferred.

---
*Verified: 2026-06-13T18:52:44Z*
*Verifier: the agent (gsd-verifier)*
