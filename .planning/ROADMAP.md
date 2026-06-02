# Roadmap: Bright Builds Portfolio Website

## Milestones

- ✅ **v1.0 MVP** — Phases 1-5 shipped 2026-05-27. Archive: [v1.0-ROADMAP.md](milestones/v1.0-ROADMAP.md). Audit: [v1.0-MILESTONE-AUDIT.md](milestones/v1.0-MILESTONE-AUDIT.md).
- ✅ **v1.1 Release Confidence** — Phases 6-9 shipped 2026-06-01. Archive: [v1.1-ROADMAP.md](milestones/v1.1-ROADMAP.md). Audit: [v1.1-MILESTONE-AUDIT.md](milestones/v1.1-MILESTONE-AUDIT.md).
- ◻ **v1.2 Project Story Pages** — Active milestone. Goal: turn curated project cards into deep, shareable static project pages with stronger narrative, metadata, and collaboration paths.

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

### v1.2 Project Story Pages

**Milestone Goal:** Turn curated project cards into deep, shareable static project pages with stronger narrative, metadata, and collaboration paths.

- [x] **Phase 10: Project Detail Route Foundation** — Maintainers can select project detail pages from curated data and prerender stable static routes for them. Completed 2026-06-02.
- [x] **Phase 11: Project Story Page UI** — Visitors can read selected project detail pages with authored narrative, project facts, and clear project actions. Completed 2026-06-02.
- [x] **Phase 12: Project Metadata & Sharing** — Project detail routes have specific metadata, structured data, sitemap coverage, and deterministic social preview support. (completed 2026-06-02)
- [ ] **Phase 13: Project Page Release Coverage** — The clean-builder release gate verifies project detail routes across static output, browser behavior, and release documentation.

## Phase Details

### Phase 10: Project Detail Route Foundation

**Goal:** Maintainers can select project detail pages from curated data and prerender stable static routes for them.
**Depends on:** Phase 9
**Requirements:** ROUTE-01, ROUTE-02, ROUTE-03, ROUTE-04, STORY-01, VERIFY-01
**Success Criteria** (what must be TRUE):

1. Maintainer can mark or derive selected curated projects for public detail-page treatment through typed data.
1. Maintainer can derive `/projects/{slug}` paths for selected projects without exposing hidden or unselected projects.
1. Static prerender configuration includes selected project detail routes.
1. Unit tests prove project eligibility, route derivation, exclusion behavior, and initial metadata inputs.

**Plans:** 1/1 complete
- [x] `10-01-PLAN.md` — Project detail route data and prerender foundation
**UI hint:** no

### Phase 11: Project Story Page UI

**Goal:** Visitors can read selected project detail pages with authored narrative, project facts, and clear project actions.
**Depends on:** Phase 10
**Requirements:** STORY-02, STORY-03, STORY-04, NAV-01, NAV-02, NAV-03
**Success Criteria** (what must be TRUE):

1. Visitor can open each selected project detail page and understand the project's problem, approach, technical shape, status, and why it matters.
1. Visitor can reach source, live, docs, related, and snapshot facts without those facts replacing the authored story.
1. Home and project-index cards link naturally into detail pages while preserving the scannable `/projects` overview.
1. Project detail pages provide clear back-to-index and onward project action paths.
1. Detail pages preserve dark-primary responsive layout, readable text, accessible headings, and labeled link groups.

**Plans:** 1/1 complete
- [x] `11-01-PLAN.md` — Project story page UI and navigation
**UI hint:** yes

### Phase 12: Project Metadata & Sharing

**Goal:** Project detail routes have specific metadata, structured data, sitemap coverage, and deterministic social preview support.
**Depends on:** Phase 11
**Requirements:** META-01, META-02, META-03, META-04
**Success Criteria** (what must be TRUE):

1. Each project detail route has title, description, canonical URL, Open Graph, and Twitter metadata derived from curated project data.
1. Each project detail route renders appropriate project-specific JSON-LD before hydration.
1. Generated sitemap output includes selected project detail routes and excludes unselected projects.
1. Project detail routes use deterministic project-specific social preview support or a documented static fallback without runtime rendering.

**Plans:** 1/1 plans complete
- [ ] `12-01-PLAN.md` — Project metadata, structured data, sitemap, social preview fallback, and verifier coverage
**UI hint:** no

### Phase 13: Project Page Release Coverage

**Goal:** The clean-builder release gate verifies project detail routes across static output, browser behavior, and release documentation.
**Depends on:** Phase 12
**Requirements:** VERIFY-02, VERIFY-03, VERIFY-04
**Success Criteria** (what must be TRUE):

1. Static verification checks generated project detail HTML for expected story text, metadata, JSON-LD, sitemap inclusion, and forbidden runtime GitHub residue.
1. Browser release checks include project detail routes for axe, dark desktop/mobile layout, keyboard reachability, and reduced-motion behavior.
1. Release-readiness docs and checks identify project detail route coverage as part of `bun run install:browser && bun run verify`.
1. The aggregate release gate passes from a clean-builder path with project detail routes included.

**Plans:** TBD
**UI hint:** no

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
| 12. Project Metadata & Sharing | v1.2 | 1/1 | Complete   | 2026-06-02 |
| 13. Project Page Release Coverage | v1.2 | 0/TBD | Not Started | - |

## Next

Start Phase 12 with `/gsd-discuss-phase 12` or `/gsd-plan-phase 12`.
