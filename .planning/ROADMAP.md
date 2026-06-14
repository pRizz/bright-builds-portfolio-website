# Roadmap: Bright Builds Portfolio Website

## Milestones

- ✅ **v1.0 MVP** — Phases 1-5 shipped 2026-05-27. Archive: [v1.0-ROADMAP.md](milestones/v1.0-ROADMAP.md). Audit: [v1.0-MILESTONE-AUDIT.md](milestones/v1.0-MILESTONE-AUDIT.md).
- ✅ **v1.1 Release Confidence** — Phases 6-9 shipped 2026-06-01. Archive: [v1.1-ROADMAP.md](milestones/v1.1-ROADMAP.md). Audit: [v1.1-MILESTONE-AUDIT.md](milestones/v1.1-MILESTONE-AUDIT.md).
- ✅ **v1.2 Project Story Pages** — Phases 10-13 shipped 2026-06-03. Archive: [v1.2-ROADMAP.md](milestones/v1.2-ROADMAP.md). Audit: [v1.2-MILESTONE-AUDIT.md](milestones/v1.2-MILESTONE-AUDIT.md).
- 🚧 **v1.3 Writing & Notes Surface** — Phases 14-17 active. Goal: give visitors a curated, static way to read Peter's technical thinking and move between notes and related projects.

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1-5) — SHIPPED 2026-05-27</summary>

- [x] Phase 1: Static App Foundation & UI Shell — 2/2 plans, completed 2026-05-24
- [x] Phase 01.1: Dark-Primary Visual Rule and Shell Refactor — 1/1 plan, completed 2026-05-25
- [x] Phase 2: Curated Content Model — 2/2 plans, completed 2026-05-26
- [x] Phase 3: Portfolio Surfaces & SEO — 3/3 plans, completed 2026-05-26
- [x] Phase 4: Visual System & Motion — 3/3 plans, completed 2026-05-26
- [x] Phase 5: GitHub Enrichment & Release Verification — 3/3 plans, completed 2026-05-27

</details>

<details>
<summary>✅ v1.1 Release Confidence (Phases 6-9) — SHIPPED 2026-06-01</summary>

- [x] Phase 6: Browser & Accessibility Release Automation — 1/1 plan, completed 2026-05-31
- [x] Phase 7: Release Gates & Deploy Readiness — 1/1 plan, completed 2026-05-31
- [x] Phase 8: Content Helper Surface Cleanup — 1/1 plan, completed 2026-05-31
- [x] Phase 9: Clean Builder Release Gate Closure — 1/1 plan, completed 2026-06-01

</details>

<details>
<summary>✅ v1.2 Project Story Pages (Phases 10-13) — SHIPPED 2026-06-03</summary>

- [x] Phase 10: Project Detail Route Foundation — 1/1 plan, completed 2026-06-02
- [x] Phase 11: Project Story Page UI — 1/1 plan, completed 2026-06-02
- [x] Phase 12: Project Metadata & Sharing — 1/1 plan, completed 2026-06-02
- [x] Phase 13: Project Page Release Coverage — 1/1 plan, completed 2026-06-03

</details>

<details open>
<summary>v1.3 Writing & Notes Surface (Phases 14-17) — ACTIVE</summary>

- [x] **Phase 14: Writing Domain Foundation** - Maintainers can define validated writing entries, public route helpers, and project relationships from typed checked-in data.
- [x] **Phase 15: Writing Routes and Dark UI** - Visitors can browse writing, read public note pages, and move between notes and related project stories in the dark-primary interface. (completed 2026-06-13)
- [ ] **Phase 16: Writing Metadata and Structured Data** - Writing routes expose static route-specific metadata, JSON-LD, sitemap entries, and social-preview fallback behavior.
- [ ] **Phase 17: Writing Verification and Release Contract** - Automated verification and release-readiness checks prove the writing surface in the aggregate release gate.

</details>

## Phase Details

### Phase 14: Writing Domain Foundation

**Goal**: Maintainers can define curated writing and notes as validated static domain data that downstream routes, metadata, and verification can trust.
**Depends on**: Phase 13
**Requirements**: WRITE-01, WRITE-02, WRITE-03, WRITE-04, LINK-01, LINK-03
**Success Criteria** (what must be TRUE):

1. Maintainer can add a writing or note entry with title, summary, date or status, tags or topics, body content, slug, and optional related project slugs in a typed checked-in registry without adding runtime APIs, CMS, MDX, or external content dependencies.
1. Maintainer can ask writing helpers for public entries and stable `/writing/{slug}` paths while hidden or draft records stay excluded from public selectors.
1. Unit and curation tests fail for duplicate or invalid slugs, missing required fields, draft/public filtering mistakes, and related project slugs that are unknown, hidden, or unsupported.

**Plans**: 2/2 complete

### Phase 15: Writing Routes and Dark UI

**Goal**: Visitors can browse and read public writing routes, then move between notes and selected project stories without runtime data dependencies.
**Depends on**: Phase 14
**Requirements**: ROUTE-01, ROUTE-02, ROUTE-03, ROUTE-04, READ-01, READ-02, READ-03, LINK-02
**Success Criteria** (what must be TRUE):

1. Visitor can reach `/writing` from the site navigation and see only public writing entries in curated or reverse-chronological order.
1. Visitor can open static `/writing/{slug}` detail pages for every public writing entry and understand each entry's main idea, context, relevance, and body content before hydration.
1. Hidden, draft, archived-only, unpublished, or missing writing slugs do not expose private content or create public detail pages.
1. Visitor can move from a writing detail page to related selected project stories, and selected project detail pages can show related writing derived from writing data.
1. Writing index and detail pages remain readable in the dark-primary interface on desktop and mobile, with accessible headings and stable text wrapping for long titles, links, and note content.

**Plans**: 4/4 plans complete
Plans:
- [x] 15-01-PLAN.md — Route/domain contracts, project-to-writing lookup, and writing link href safety.
- [x] 15-02-PLAN.md — Public writing index and detail routes with dark-primary reading UI.
- [x] 15-03-PLAN.md — Related writing panel on selected project detail pages.
- [x] 15-04-PLAN.md — Static output, browser, and visual verification evidence for writing routes.
**UI hint**: yes

### Phase 16: Writing Metadata and Structured Data

**Goal**: Writing routes are discoverable as static pages with metadata, structured data, sitemap behavior, and social-preview fallback derived from writing helpers.
**Depends on**: Phase 15
**Requirements**: META-01, META-02, META-03, META-04
**Success Criteria** (what must be TRUE):

1. Crawlers and social previews can read route-specific title, description, canonical URL, Open Graph, and Twitter metadata for `/writing` and each public writing detail route.
1. Writing detail routes render static `BlogPosting` JSON-LD and the writing index renders static collection or `ItemList` JSON-LD before hydration.
1. Generated sitemap output includes `/writing` and every public writing detail route while excluding hidden, draft, archived-only, or otherwise unpublished writing routes.
1. Writing routes use the checked-in static social preview fallback or documented deterministic support without adding runtime image generation or server endpoints.

**Plans**: TBD

### Phase 17: Writing Verification and Release Contract

**Goal**: The release gate proves writing routes, metadata, cross-links, accessibility coverage, and release evidence without overclaiming manual or hosted checks.
**Depends on**: Phase 16
**Requirements**: VERIFY-01, VERIFY-02, VERIFY-03, VERIFY-04
**Success Criteria** (what must be TRUE):

1. Static verification checks generated writing HTML for expected content, metadata, JSON-LD, sitemap inclusion and exclusion, related-project links, and forbidden runtime API residue.
1. Browser release checks include writing routes for axe, dark desktop and mobile readability, keyboard reachability, and reduced-motion behavior where relevant.
1. Release-readiness docs and checks identify writing route coverage as part of `bun run install:browser && bun run verify`.
1. The aggregate `bun run verify` gate includes writing coverage, and release evidence labels name only automated writing checks that actually run.

**Plans**: TBD

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
| --- | --- | --- | --- | --- |
| 1. Static App Foundation & UI Shell | v1.0 | 2/2 | Complete | 2026-05-24 |
| 01.1. Dark-Primary Visual Rule and Shell Refactor | v1.0 | 1/1 | Complete | 2026-05-25 |
| 2. Curated Content Model | v1.0 | 2/2 | Complete | 2026-05-26 |
| 3. Portfolio Surfaces & SEO | v1.0 | 3/3 | Complete | 2026-05-26 |
| 4. Visual System & Motion | v1.0 | 3/3 | Complete | 2026-05-26 |
| 5. GitHub Enrichment & Release Verification | v1.0 | 3/3 | Complete | 2026-05-27 |
| 6. Browser & Accessibility Release Automation | v1.1 | 1/1 | Complete | 2026-05-31 |
| 7. Release Gates & Deploy Readiness | v1.1 | 1/1 | Complete | 2026-05-31 |
| 8. Content Helper Surface Cleanup | v1.1 | 1/1 | Complete | 2026-05-31 |
| 9. Clean Builder Release Gate Closure | v1.1 | 1/1 | Complete | 2026-06-01 |
| 10. Project Detail Route Foundation | v1.2 | 1/1 | Complete | 2026-06-02 |
| 11. Project Story Page UI | v1.2 | 1/1 | Complete | 2026-06-02 |
| 12. Project Metadata & Sharing | v1.2 | 1/1 | Complete | 2026-06-02 |
| 13. Project Page Release Coverage | v1.2 | 1/1 | Complete | 2026-06-03 |
| 14. Writing Domain Foundation | v1.3 | 2/2 | Complete    | 2026-06-03 |
| 15. Writing Routes and Dark UI | v1.3 | 4/4 | Complete    | 2026-06-13 |
| 16. Writing Metadata and Structured Data | v1.3 | 2/2 | Complete    | 2026-06-14 |
| 17. Writing Verification and Release Contract | v1.3 | 0/TBD | Not started | - |

## Next

v1.3 is active. Run `/gsd-discuss-phase 16` to start Phase 16: Writing Metadata and Structured Data.
