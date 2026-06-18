# Roadmap: Bright Builds Portfolio Website

## Milestones

- 🚧 **v1.4 Theme Paths & Collaboration Surface** — Phases 19-23 in progress. Goal: help visitors explore Peter's work by durable themes and move from those themes into relevant projects, writing, proof points, and collaboration paths.

## Archived Milestones

Prior milestone phase details are archived. This active roadmap covers v1.4 only.

<details>
<summary>v1.3 Writing & Notes Surface - shipped 2026-06-16</summary>

**Phases:** 14-18
**Archive:** [v1.3-ROADMAP.md](milestones/v1.3-ROADMAP.md)
**Audit:** [v1.3-MILESTONE-AUDIT.md](milestones/v1.3-MILESTONE-AUDIT.md)

**Summary:** v1.3 added typed writing data, static `/writing` and `/writing/{slug}` routes, project-writing cross-links, writing metadata and JSON-LD, sitemap coverage, release verification, and modular static verification helpers.

</details>

<details>
<summary>v1.2 Project Story Pages - shipped 2026-06-03</summary>

**Phases:** 10-13
**Archive:** [v1.2-ROADMAP.md](milestones/v1.2-ROADMAP.md)
**Audit:** [v1.2-MILESTONE-AUDIT.md](milestones/v1.2-MILESTONE-AUDIT.md)

**Summary:** v1.2 added selected project detail story routes, readable project narratives, detail-aware navigation, route metadata, SoftwareSourceCode JSON-LD, sitemap coverage, and release checks for project pages.

</details>

<details>
<summary>v1.1 Release Confidence - shipped 2026-06-01</summary>

**Phases:** 6-9
**Archive:** [v1.1-ROADMAP.md](milestones/v1.1-ROADMAP.md)
**Audit:** [v1.1-MILESTONE-AUDIT.md](milestones/v1.1-MILESTONE-AUDIT.md)

**Summary:** v1.1 converted browser and accessibility evidence into repeatable release checks, documented the release-readiness contract, cleaned up curated helper exports, and closed the clean-builder browser provisioning gate.

</details>

<details>
<summary>v1.0 MVP - shipped 2026-05-27</summary>

**Phases:** 1-5 plus Phase 01.1
**Archive:** [v1.0-ROADMAP.md](milestones/v1.0-ROADMAP.md)
**Audit:** [v1.0-MILESTONE-AUDIT.md](milestones/v1.0-MILESTONE-AUDIT.md)

**Summary:** v1.0 established the SolidStart static shell, dark-primary visual system, curated project registry, route and SEO helpers, motion constraints, checked-in GitHub metadata enrichment, and aggregate release verification.

</details>

## Current Milestone

**v1.4 Theme Paths & Collaboration Surface**

**Milestone Goal:** Help visitors explore Peter's work by durable themes and move from those themes into relevant projects, writing, proof points, and collaboration paths.

**Granularity:** coarse
**Requirement Coverage:** 23/23 v1.4 requirements mapped exactly once to Phases 19-23.

## Phases

**Phase Numbering:**

- Integer phases are planned milestone work.
- Decimal phases are urgent insertions created after planning.
- v1.4 continues after Phase 18 and starts at Phase 19.

- [x] **Phase 19: Theme Domain Foundation** - Maintainers can define validated theme paths from typed checked-in data and existing project/writing registries. (completed 2026-06-16)
- [x] **Phase 20: Theme Routes and Dark UI** - Visitors can browse static theme index and detail pages in the dark-primary interface. (completed 2026-06-17)
- [x] **Phase 21: Collaboration Pathways and Cross-Links** - Visitors can move from themes into related projects, writing, and practical collaboration entry points. (completed 2026-06-18)
- [x] **Phase 22: Theme Metadata and Structured Data** - Theme routes are discoverable through static metadata, structured data, sitemap entries, and social-preview fallback behavior. (completed 2026-06-18)
- [x] **Phase 23: Theme Verification and Release Contract** - Automated checks prove theme route coverage in the aggregate release gate without overclaiming manual or hosted evidence. (completed 2026-06-18)

## Phase Details

### Phase 19: Theme Domain Foundation

**Goal**: Maintainers can define curated theme paths as validated static domain data that composes existing project and writing records.
**Depends on**: Phase 18
**Requirements**: THEME-01, THEME-02, THEME-03, THEME-04
**Success Criteria** (what must be TRUE):

1. Maintainer can add a theme path with slug, title, summary, audience, proof points, collaboration angle, related project slugs, and related writing slugs in typed checked-in data without adding runtime APIs, CMS, MDX, parser pipelines, or external content dependencies.
1. Maintainer can ask theme helpers for public theme entries, stable `/themes/{slug}` paths, and ordered theme lists while hidden or unsupported theme records stay out of public selectors.
1. Unit and curation checks fail for duplicate or invalid theme slugs, missing required fields, unsupported theme status, unknown project slugs, unknown writing slugs, hidden project references, and unpublished writing references.
1. Theme records keep project and writing registries authoritative by resolving display content from existing project and writing data instead of duplicating authored project or writing copy.

**Plans**: 1 plan
Plans:
- [x] 19-01-PLAN.md — Theme domain registry, helper contracts, validation, and curation gate wiring

**UI hint**: yes

### Phase 20: Theme Routes and Dark UI

**Goal**: Visitors can browse and read static theme routes that synthesize Peter's work in the established dark-primary interface.
**Depends on**: Phase 19
**Requirements**: ROUTE-01, ROUTE-02, ROUTE-03, ROUTE-04, SYNTH-01, SYNTH-04
**Success Criteria** (what must be TRUE):

1. Visitor can open `/themes` and see public theme paths presented as curated entry points into Peter's work.
1. Visitor can open stable `/themes/{slug}` static detail pages for every public theme path and understand each theme's main idea, why it matters, representative proof points, and connection to Peter's projects and writing before hydration.
1. Clean static builds prerender `/themes` and every public theme detail route, while hidden, unsupported, or invalid theme records do not create public pages or leak private content through fallback routes.
1. Theme index and detail pages preserve the dark-primary responsive interface with accessible headings, readable text hierarchy, keyboard reachability, and stable text wrapping on desktop and mobile.

**Plans**: 4 plans
Plans:
- [x] 20-01-PLAN.md — Theme route registry, navigation, and helper-derived prerender contract
- [x] 20-02-PLAN.md — Dark-primary `/themes` index and gated theme detail route UI
- [x] 20-03-PLAN.md — Static output verification and generated metadata consistency for theme routes
- [x] 20-04-PLAN.md — Focused browser keyboard and reduced-motion coverage for theme routes
**UI hint**: yes

### Phase 21: Collaboration Pathways and Cross-Links

**Goal**: Visitors can move from theme paths into related projects, writing, and useful collaboration starting points without making identity links the primary call to action.
**Depends on**: Phase 20
**Requirements**: SYNTH-02, SYNTH-03, COLLAB-01, COLLAB-02, COLLAB-03
**Success Criteria** (what must be TRUE):

1. Visitor can move from theme detail pages to related selected project stories and public writing entries through helper-derived relationships.
1. Visitor can find related theme links on project and writing surfaces when those links clarify the content graph without overwhelming the primary project or writing narrative.
1. Visitor can identify a useful collaboration starting point for each theme, including reviewed source links, live surfaces, relevant writing, and practical next actions when available.
1. Theme collaboration panels use existing curated project, writing, profile, GitHub, and OpenLinks data without introducing unreviewed external-link sources or live reachability claims.
1. OpenLinks remains discoverable as a low-intrusion identity hub in footer, profile, contact, or metadata surfaces and does not become the primary theme CTA.

**Plans**: 2 plans
Plans:
- [x] 23-01-PLAN.md - Aggregate release-readiness contract, theme evidence labels, docs, and verify ordering
- [x] 23-02-PLAN.md - Static verifier theme route coverage evidence wording
**UI hint**: yes

### Phase 22: Theme Metadata and Structured Data

**Goal**: Theme routes are discoverable through static metadata, structured data, sitemap behavior, and social-preview fallback derived from theme helpers.
**Depends on**: Phase 21
**Requirements**: META-01, META-02, META-03, META-04
**Success Criteria** (what must be TRUE):

1. Crawlers and social previews can read route-specific title, description, canonical URL, Open Graph, and Twitter metadata for `/themes` and every public theme detail route.
1. Theme index and detail routes render static structured data before hydration using helper-derived theme, project, writing, and profile relationships.
1. Generated sitemap output includes `/themes` and every public theme detail route while excluding hidden, unsupported, or invalid theme routes.
1. Theme routes use the checked-in static social preview fallback or deterministic static support without runtime image generation or server endpoints.

**Plans**: TBD
**UI hint**: yes

### Phase 23: Theme Verification and Release Contract

**Goal**: The release gate proves theme routes, metadata, cross-links, collaboration paths, and accessibility coverage through automated checks that actually run.
**Depends on**: Phase 22
**Requirements**: VERIFY-01, VERIFY-02, VERIFY-03, VERIFY-04
**Success Criteria** (what must be TRUE):

1. Static verification checks generated theme HTML for expected content, metadata, structured data, sitemap inclusion and exclusion, related project links, related writing links, collaboration links, and forbidden runtime API residue.
1. Browser release checks include theme routes for axe, dark desktop and mobile layout, keyboard reachability, reduced-motion behavior where relevant, and text-overlap risk.
1. Release-readiness docs and checks identify theme route coverage as part of `bun run install:browser && bun run verify`.
1. The aggregate `bun run verify` gate passes with theme routes included, and release evidence labels name only automated theme coverage that actually runs.

**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:** Phase 19 -> Phase 20 -> Phase 21 -> Phase 22 -> Phase 23

| Phase | Milestone | Plans Complete | Status | Completed |
| --- | --- | --- | --- | --- |
| 19. Theme Domain Foundation | v1.4 | 1/1 | Complete    | 2026-06-16 |
| 20. Theme Routes and Dark UI | v1.4 | 4/4 | Complete    | 2026-06-17 |
| 21. Collaboration Pathways and Cross-Links | v1.4 | 4/4 | Complete    | 2026-06-18 |
| 22. Theme Metadata and Structured Data | v1.4 | 1/1 | Complete    | 2026-06-18 |
| 23. Theme Verification and Release Contract | v1.4 | 2/2 | Complete   | 2026-06-18 |

## Requirement Coverage

| Requirement | Phase |
| --- | --- |
| THEME-01 | Phase 19 |
| THEME-02 | Phase 19 |
| THEME-03 | Phase 19 |
| THEME-04 | Phase 19 |
| ROUTE-01 | Phase 20 |
| ROUTE-02 | Phase 20 |
| ROUTE-03 | Phase 20 |
| ROUTE-04 | Phase 20 |
| SYNTH-01 | Phase 20 |
| SYNTH-04 | Phase 20 |
| SYNTH-02 | Phase 21 |
| SYNTH-03 | Phase 21 |
| COLLAB-01 | Phase 21 |
| COLLAB-02 | Phase 21 |
| COLLAB-03 | Phase 21 |
| META-01 | Phase 22 |
| META-02 | Phase 22 |
| META-03 | Phase 22 |
| META-04 | Phase 22 |
| VERIFY-01 | Phase 23 |
| VERIFY-02 | Phase 23 |
| VERIFY-03 | Phase 23 |
| VERIFY-04 | Phase 23 |

**Coverage:** 23/23 v1.4 requirements mapped. No orphaned or duplicate requirement mappings.

## Next

Run `/gsd-discuss-phase 19` or `/gsd-plan-phase 19`.
