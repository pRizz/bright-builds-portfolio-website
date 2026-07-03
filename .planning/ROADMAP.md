# Roadmap: Bright Builds Portfolio Website

## Milestones

- [ ] **v1.6 Content Discovery & Feeds** - Phases 30-36 active as of 2026-06-26. Static topic discovery, project/writing filtering, writing-first feed output, related-work navigation, generic/topic share polish, and release evidence.
- [x] **v1.5 Static Shareability & Freshness** - Phases 24-29 shipped 2026-06-23. Archive: [v1.5-ROADMAP.md](milestones/v1.5-ROADMAP.md). Audit: [v1.5-MILESTONE-AUDIT.md](milestones/v1.5-MILESTONE-AUDIT.md). Phase Artifacts: [v1.5-phases/](milestones/v1.5-phases/).
- [x] **v1.4 Theme Paths & Collaboration Surface** - Phases 19-23 shipped 2026-06-20. Archive: [v1.4-ROADMAP.md](milestones/v1.4-ROADMAP.md). Audit: [v1.4-MILESTONE-AUDIT.md](milestones/v1.4-MILESTONE-AUDIT.md).
- [x] **v1.3 Writing & Notes Surface** - Phases 14-18 shipped 2026-06-16. Archive: [v1.3-ROADMAP.md](milestones/v1.3-ROADMAP.md). Audit: [v1.3-MILESTONE-AUDIT.md](milestones/v1.3-MILESTONE-AUDIT.md).
- [x] **v1.2 Project Story Pages** - Phases 10-13 shipped 2026-06-03. Archive: [v1.2-ROADMAP.md](milestones/v1.2-ROADMAP.md). Audit: [v1.2-MILESTONE-AUDIT.md](milestones/v1.2-MILESTONE-AUDIT.md).
- [x] **v1.1 Release Confidence** - Phases 6-9 shipped 2026-06-01. Archive: [v1.1-ROADMAP.md](milestones/v1.1-ROADMAP.md). Audit: [v1.1-MILESTONE-AUDIT.md](milestones/v1.1-MILESTONE-AUDIT.md).
- [x] **v1.0 MVP** - Phases 1-5 plus Phase 01.1 shipped 2026-05-27. Archive: [v1.0-ROADMAP.md](milestones/v1.0-ROADMAP.md). Audit: [v1.0-MILESTONE-AUDIT.md](milestones/v1.0-MILESTONE-AUDIT.md).

## Current Planning

### v1.6 Content Discovery & Feeds

**Milestone Goal:** Help visitors navigate the now-substantial project, writing, and theme corpus through static discovery paths, lightweight search/filtering, syndication, and stronger related-work journeys without weakening the static deployment model.

**Granularity:** Standard
**Coverage:** 27/27 v1.6 requirements mapped exactly once to Phases 30-36
**Phase range:** 30-36
**Total phases:** 7
**Total plans:** 16
**Scope guard:** Static-first only. No CMS/admin, visitor-runtime content APIs, hosted search, dynamic OG/feed endpoints, or live-network verification gates.

## Active Phases

See `## Phases`, `## Phase Details`, and `## Progress` below for the active v1.6 milestone.

## Phases

**Phase Numbering:**

- Integer phases are planned milestone work.
- Decimal phases are urgent insertions created after planning.
- v1.6 continues after Phase 29 and starts at Phase 30.

- [ ] **Phase 30: Content Discovery Foundation** - Establish one public-only topic eligibility and reference contract for discovery, routes, filtering, feeds, related work, and previews.
- [ ] **Phase 31: Static Topic Routes** - Give visitors canonical static `/topics` and `/topics/{slug}` pages with safe label links, metadata, sitemap coverage, and fallback behavior.
- [ ] **Phase 32: Project and Writing Filtering/Search** - Add accessible dark-primary project and writing filtering/search over checked-in content without runtime content fetches.
- [ ] **Phase 33: Writing-First Static Feed** - Publish a deterministic static writing-first feed with autodiscovery and visible low-intrusion subscription links.
- [ ] **Phase 34: Centralized Related-Work Graph** - Add explainable related-work journeys across project, writing, theme, and topic pages from one shared resolver.
- [ ] **Phase 35: Generic and Topic Social Preview Polish** - Extend the existing deterministic social-preview contract to valuable generic and topic routes while preserving fallback behavior.
- [ ] **Phase 36: Verification and Release Evidence Contract** - Prove the v1.6 static discovery/feed contract through local checks and truthful release evidence.

## Phase Details

### Phase 30: Content Discovery Foundation
**Goal**: Maintainers have one public-only topic and reference foundation that prevents hidden content leaks before routes, filters, feeds, related work, or previews consume discovery data.
**Depends on**: Phase 29
**Requirements**: DISC-04
**Success Criteria** (what must be TRUE):
  1. Maintainer can derive canonical topic eligibility and public content references from one pure helper instead of maintaining separate discovery indexes.
  2. Unknown, private, draft, archived, or unsupported topic inputs produce non-leaking fallback behavior and never expose hidden project, writing, or theme records.
  3. Duplicate topic slugs, colliding labels, unsupported sources, and hidden references fail curation or unit checks before static routes are generated.
  4. Downstream route, filter, feed, related-work, and preview helpers can consume the same public topic/reference contract without adding visitor-runtime content fetches.
**Plans**: 1 plan
Plans:
- [x] 30-01-PLAN.md - Add canonical topic eligibility, public references, route helpers, validation findings, and focused tests.

### Phase 31: Static Topic Routes
**Goal**: Visitors can browse canonical static topic pages that connect public projects, writing, and themes through safe labels and crawler-readable metadata.
**Depends on**: Phase 30
**Requirements**: DISC-01, DISC-02, DISC-03, DISC-05
**Success Criteria** (what must be TRUE):
  1. Visitor can browse `/topics` and see canonical public topics derived from public projects, writing, and themes before hydration.
  2. Visitor can open `/topics/{slug}` for every public topic and see related public projects, writing, and theme paths before hydration.
  3. Public label chips on project, writing, theme, and topic pages link only to validated canonical topic pages.
  4. Topic pages expose canonical title, description, structured data, sitemap entries, social image references, and static HTML that crawlers can read.
  5. Unknown or unsupported topic routes use non-leaking fallback behavior and do not reveal hidden content.
**Plans**: 3 plans
Plans:
- [x] 31-01-PLAN.md - Add topic route registry, prerender wiring, and dark-primary `/topics` index/detail pages.
- [x] 31-02-PLAN.md - Add safe topic-linked chips across public surfaces and helper-derived topic metadata.
- [x] 31-03-PLAN.md - Add topic sitemap, static output, social-reference, and unknown-topic fallback verification.
**UI hint**: yes

### Phase 32: Project and Writing Filtering/Search
**Goal**: Visitors can narrow project and writing index pages with accessible in-page controls while the default public content remains static and crawlable.
**Depends on**: Phase 31
**Requirements**: FIND-01, FIND-02, FIND-03, FIND-04, FIND-05
**Success Criteria** (what must be TRUE):
  1. Visitor can filter or search the public project index by meaningful public labels, status, tier, or source metadata without visitor-runtime content fetches.
  2. Visitor can filter or search the public writing index by kind, topic, tag, or date-related labels without visitor-runtime content fetches.
  3. Project and writing index pages render useful default public content in static HTML before hydration.
  4. Filter/search controls expose labels, result counts, empty state, reset behavior, keyboard access, visible focus, dark readability, and mobile text wrapping.
  5. Filter/search state avoids crawlable faceted URL explosion; durable sharing remains through canonical topic routes unless a later phase scopes query-param sharing.
**Plans**: 3 plans
Plans:
- [x] 32-01-PLAN.md - Add deterministic content-search/filter model, query normalization, scoring, and tests.
- [x] 32-02-PLAN.md - Add project index filtering/search UI with static defaults, counts, reset, and empty states.
- [x] 32-03-PLAN.md - Add writing index filtering/search UI plus keyboard, mobile, dark, and browser coverage.
**UI hint**: yes

### Phase 33: Writing-First Static Feed
**Goal**: Subscribers and feed readers can consume a deterministic static writing-first feed while site pages expose low-intrusion subscription affordances.
**Depends on**: Phase 32
**Requirements**: FEED-01, FEED-02, FEED-03, FEED-04, FEED-05
**Success Criteria** (what must be TRUE):
  1. Visitor or feed reader can request a valid static writing-first RSS feed at `/feed.xml`.
  2. Feed entries use stable canonical IDs, absolute links, checked-in dates, public categories, summaries, and deterministic ordering.
  3. Feed generation excludes draft, hidden, archived, undated, unsupported, or invented project/theme update records.
  4. Home and writing pages expose feed autodiscovery metadata and a visible low-intrusion feed link.
  5. Feed generation is deterministic, local, and does not mutate source data unexpectedly during ordinary build or verification.
**Plans**: 2 plans
Plans:
- [x] 33-01-PLAN.md - Add writing feed item model, RSS serialization, escaping, ordering, and tests.
- [x] 33-02-PLAN.md - Add static `/feed.xml` output, autodiscovery links, visible feed links, and static verification.
**UI hint**: yes

### Phase 34: Centralized Related-Work Graph
**Goal**: Visitors can continue from project, writing, theme, and topic detail pages into explainable related work without noisy or hidden-content links.
**Depends on**: Phase 33
**Requirements**: REL-01, REL-02, REL-03, REL-04
**Success Criteria** (what must be TRUE):
  1. Visitor sees related-work panels across project, writing, theme, and topic detail pages.
  2. Related-work items are selected through explicit relationships first, then capped shared-topic fallbacks when useful.
  3. Each related-work item includes a concise reason label and deterministic ordering.
  4. Related-work logic rejects self-links, duplicate links, hidden content, draft content, archived content, and noisy OpenLinks/contact fallback overuse.
**Plans**: 2 plans
Plans:
- [ ] 34-01-PLAN.md - Add centralized related-work resolver, explicit-first ranking, shared-topic fallback, dedupe, and tests.
- [ ] 34-02-PLAN.md - Add related-work panels to project, writing, theme, and topic pages with static and browser coverage.
**UI hint**: yes

### Phase 35: Generic and Topic Social Preview Polish
**Goal**: Valuable generic and topic pages can share with deterministic route-specific social previews while unknown or low-value routes keep the existing fallback image.
**Depends on**: Phase 34
**Requirements**: PREV-01, PREV-02, PREV-03
**Success Criteria** (what must be TRUE):
  1. Covered generic public pages, including home, about, contact, `/topics`, and stable topic routes, can use deterministic route-specific social preview assets when distinct previews add sharing value.
  2. Generic and topic preview metadata, manifest entries, MIME and dimension checks, JSON-LD image fields, and static verifier expectations remain derived from shared helpers.
  3. Unknown, fallback, or low-value routes continue using the checked-in fallback social image without breaking the existing preview contract.
  4. Maintainer can regenerate and check generic/topic preview assets without adding dynamic Open Graph endpoints, dynamic feed endpoints, runtime services, network fetches, or hard-coded route image paths.
**Plans**: 2 plans
Plans:
- [ ] 35-01-PLAN.md - Extend social preview target helpers for generic and topic routes while preserving fallback selection.
- [ ] 35-02-PLAN.md - Generate/check generic and topic preview assets with helper-derived metadata, manifest, and static verifier coverage.
**UI hint**: yes

### Phase 36: Verification and Release Evidence Contract
**Goal**: The local release gate proves v1.6 discovery, filtering, feed, related-work, preview, and static-output behavior without overclaiming hosted or live-network checks.
**Depends on**: Phase 35
**Requirements**: VER-01, VER-02, VER-03, VER-04, VER-05
**Success Criteria** (what must be TRUE):
  1. Unit and curation tests prove discovery labels, slug collisions, public eligibility, search/filter behavior, feed XML, related-work graph behavior, and social-preview target selection.
  2. Static verification proves topic routes, feed files, metadata, JSON-LD, sitemap entries, feed autodiscovery, generated preview assets, and hidden-content exclusion in `.output/public`.
  3. Browser verification covers desktop and mobile dark rendering, keyboard and focus behavior, result count/reset/empty states, axe checks, reduced motion, and text-overlap risks for discovery/filter pages.
  4. Release verification covers new static routes, feed output, generated assets, release budgets, and absence of visitor-runtime GitHub, CMS, search-service, or content API fetches.
  5. Release-readiness docs and evidence labels describe only automated local checks, leaving hosted feed-reader, social-card, Cloudflare deploy, live external-link, and manual preview checks as manual smoke items.
**Plans**: 3 plans
Plans:
- [ ] 36-01-PLAN.md - Expand unit, curation, static-output, and aggregate verification for v1.6 surfaces.
- [ ] 36-02-PLAN.md - Expand browser release coverage for discovery/filter dark UI, keyboard, axe, reduced motion, and text overlap.
- [ ] 36-03-PLAN.md - Update release evidence labels, release-readiness docs, budgets, and manual smoke boundaries.
**UI hint**: yes

## Progress

**Execution Order:** Phase 30 -> Phase 31 -> Phase 32 -> Phase 33 -> Phase 34 -> Phase 35 -> Phase 36

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 30. Content Discovery Foundation | v1.6 | 1/1 | Complete    | 2026-06-27 |
| 31. Static Topic Routes | v1.6 | 3/3 | Complete    | 2026-07-02 |
| 32. Project and Writing Filtering/Search | v1.6 | 3/3 | Complete    | 2026-07-03 |
| 33. Writing-First Static Feed | v1.6 | 2/2 | Complete    | 2026-07-03 |
| 34. Centralized Related-Work Graph | v1.6 | 0/2 | Not started | - |
| 35. Generic and Topic Social Preview Polish | v1.6 | 0/2 | Not started | - |
| 36. Verification and Release Evidence Contract | v1.6 | 0/3 | Not started | - |

## Requirement Coverage

| Requirement | Phase |
|-------------|-------|
| DISC-01 | Phase 31 |
| DISC-02 | Phase 31 |
| DISC-03 | Phase 31 |
| DISC-04 | Phase 30 |
| DISC-05 | Phase 31 |
| FIND-01 | Phase 32 |
| FIND-02 | Phase 32 |
| FIND-03 | Phase 32 |
| FIND-04 | Phase 32 |
| FIND-05 | Phase 32 |
| FEED-01 | Phase 33 |
| FEED-02 | Phase 33 |
| FEED-03 | Phase 33 |
| FEED-04 | Phase 33 |
| FEED-05 | Phase 33 |
| REL-01 | Phase 34 |
| REL-02 | Phase 34 |
| REL-03 | Phase 34 |
| REL-04 | Phase 34 |
| PREV-01 | Phase 35 |
| PREV-02 | Phase 35 |
| PREV-03 | Phase 35 |
| VER-01 | Phase 36 |
| VER-02 | Phase 36 |
| VER-03 | Phase 36 |
| VER-04 | Phase 36 |
| VER-05 | Phase 36 |

**Coverage:** 27/27 v1.6 requirements mapped. No orphaned or duplicate requirement mappings.

## Archived Milestones

<details open>
<summary>v1.5 Static Shareability & Freshness - shipped 2026-06-23</summary>

**Phases:** 24-29
**Plans:** 12
**Requirements:** 25/25 satisfied
**Archive:** [v1.5-ROADMAP.md](milestones/v1.5-ROADMAP.md)
**Requirements Archive:** [v1.5-REQUIREMENTS.md](milestones/v1.5-REQUIREMENTS.md)
**Audit:** [v1.5-MILESTONE-AUDIT.md](milestones/v1.5-MILESTONE-AUDIT.md)
**Phase Artifacts:** [v1.5-phases/](milestones/v1.5-phases/)

**Summary:** v1.5 added deterministic static social preview data, PNG generation, route metadata wiring, offline freshness reporting, truthful release verification, and archived-project public-filter gap closure.

</details>

<details>
<summary>v1.4 Theme Paths & Collaboration Surface - shipped 2026-06-20</summary>

**Phases:** 19-23
**Plans:** 12
**Requirements:** 23/23 satisfied
**Archive:** [v1.4-ROADMAP.md](milestones/v1.4-ROADMAP.md)
**Requirements Archive:** [v1.4-REQUIREMENTS.md](milestones/v1.4-REQUIREMENTS.md)
**Audit:** [v1.4-MILESTONE-AUDIT.md](milestones/v1.4-MILESTONE-AUDIT.md)
**Phase Artifacts:** [v1.4-phases/](milestones/v1.4-phases/)

**Summary:** v1.4 added curated theme paths, static `/themes` and `/themes/{slug}` routes, theme-aware collaboration actions, reciprocal project/writing theme links, route metadata and JSON-LD, sitemap coverage, social-preview fallback verification, browser coverage, and explicit release-readiness evidence for theme routes.

</details>

<details>
<summary>v1.3 Writing & Notes Surface - shipped 2026-06-16</summary>

**Phases:** 14-18
**Plans:** 10
**Requirements:** 23/23 satisfied
**Archive:** [v1.3-ROADMAP.md](milestones/v1.3-ROADMAP.md)
**Requirements Archive:** [v1.3-REQUIREMENTS.md](milestones/v1.3-REQUIREMENTS.md)
**Audit:** [v1.3-MILESTONE-AUDIT.md](milestones/v1.3-MILESTONE-AUDIT.md)
**Phase Artifacts:** [v1.3-phases/](milestones/v1.3-phases/)

**Summary:** v1.3 added typed writing data, static `/writing` and `/writing/{slug}` routes, project-writing cross-links, writing metadata and JSON-LD, sitemap coverage, release verification, and modular static verification helpers.

</details>

<details>
<summary>v1.2 Project Story Pages - shipped 2026-06-03</summary>

**Phases:** 10-13
**Plans:** 4
**Requirements:** 19/19 satisfied
**Archive:** [v1.2-ROADMAP.md](milestones/v1.2-ROADMAP.md)
**Requirements Archive:** [v1.2-REQUIREMENTS.md](milestones/v1.2-REQUIREMENTS.md)
**Audit:** [v1.2-MILESTONE-AUDIT.md](milestones/v1.2-MILESTONE-AUDIT.md)

**Summary:** v1.2 added selected project detail story routes, readable project narratives, detail-aware navigation, route metadata, SoftwareSourceCode JSON-LD, sitemap coverage, and release checks for project pages.

</details>

<details>
<summary>v1.1 Release Confidence - shipped 2026-06-01</summary>

**Phases:** 6-9
**Plans:** 4
**Requirements:** 15/15 satisfied
**Archive:** [v1.1-ROADMAP.md](milestones/v1.1-ROADMAP.md)
**Requirements Archive:** [v1.1-REQUIREMENTS.md](milestones/v1.1-REQUIREMENTS.md)
**Audit:** [v1.1-MILESTONE-AUDIT.md](milestones/v1.1-MILESTONE-AUDIT.md)

**Summary:** v1.1 converted browser and accessibility evidence into repeatable release checks, documented the release-readiness contract, cleaned up curated helper exports, and closed the clean-builder browser provisioning gate.

</details>

<details>
<summary>v1.0 MVP - shipped 2026-05-27</summary>

**Phases:** 1-5 plus Phase 01.1
**Plans:** 14
**Requirements:** 38/38 satisfied
**Archive:** [v1.0-ROADMAP.md](milestones/v1.0-ROADMAP.md)
**Requirements Archive:** [v1.0-REQUIREMENTS.md](milestones/v1.0-REQUIREMENTS.md)
**Audit:** [v1.0-MILESTONE-AUDIT.md](milestones/v1.0-MILESTONE-AUDIT.md)

**Summary:** v1.0 established the SolidStart static shell, dark-primary visual system, curated project registry, route and SEO helpers, motion constraints, checked-in GitHub metadata enrichment, and aggregate release verification.

</details>

## Next

Execute Phase 33: `Writing-First Static Feed`.
