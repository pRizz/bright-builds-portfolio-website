# Requirements: Bright Builds Portfolio Website v1.6 Content Discovery & Feeds

**Defined:** 2026-06-26
**Core Value:** Help visitors quickly understand what Peter builds, why it matters, and which projects are worth exploring or collaborating on.

## v1 Requirements

Requirements for v1.6. Each requirement maps to exactly one roadmap phase.

### Discovery

- [x] **DISC-01**: Visitor can browse a canonical public topic index at `/topics` derived from public projects, writing, and themes.
- [x] **DISC-02**: Visitor can open each canonical public topic page at `/topics/{slug}` and see related public projects, writing, and theme paths.
- [x] **DISC-03**: Public label chips on project, writing, theme, and topic surfaces link to canonical topic pages only when a validated public topic exists.
- [x] **DISC-04**: Unknown, private, draft, archived, or unsupported topic inputs do not expose hidden content and use non-leaking fallback behavior.
- [x] **DISC-05**: Topic routes include canonical metadata, structured data, sitemap entries, social image references, and static HTML output that crawlers can read.

### Filtering and Search

- [ ] **FIND-01**: Visitor can filter or search the public project index by meaningful public labels, status, tier, or source metadata without visitor-runtime content fetches.
- [ ] **FIND-02**: Visitor can filter or search the public writing index by kind, topic, tag, or date-related labels without visitor-runtime content fetches.
- [ ] **FIND-03**: Project and writing discovery surfaces render useful default public content in static HTML before hydration.
- [ ] **FIND-04**: Filter/search controls expose labels, result counts, empty state, reset behavior, keyboard access, visible focus, dark readability, and mobile text wrapping.
- [ ] **FIND-05**: Filter/search state avoids crawlable faceted URL explosion; durable sharing happens through canonical topic routes unless a later phase explicitly scopes query-param sharing.

### Feeds

- [ ] **FEED-01**: Visitor or feed reader can subscribe to a valid static writing-first feed at `/feed.xml`.
- [ ] **FEED-02**: Feed entries use stable canonical IDs, absolute links, checked-in dates, public categories, summaries, and deterministic ordering.
- [ ] **FEED-03**: Feed generation excludes draft, hidden, archived, undated, unsupported, or invented project/theme update records.
- [ ] **FEED-04**: Home and writing surfaces expose feed autodiscovery metadata and a visible low-intrusion feed link.
- [ ] **FEED-05**: Feed generation is deterministic, local, and does not mutate source data unexpectedly during ordinary build or verification.

### Related Work

- [ ] **REL-01**: Visitor sees stronger related-work panels across project, writing, theme, and topic detail pages.
- [ ] **REL-02**: Related-work items are selected through explicit relationships first, then capped shared-topic fallbacks when useful.
- [ ] **REL-03**: Related-work items include concise reason labels and deterministic ordering.
- [ ] **REL-04**: Related-work logic rejects self-links, duplicate links, hidden content, draft content, archived content, and noisy OpenLinks/contact fallback overuse.

### Social Previews

- [ ] **PREV-01**: Covered generic public pages, including home, about, contact, and stable topic routes, can use deterministic route-specific social preview assets when distinct previews add sharing value.
- [ ] **PREV-02**: Generic and topic preview metadata, manifest entries, MIME and dimension checks, JSON-LD image fields, and static verifier expectations remain derived from shared helpers.
- [ ] **PREV-03**: Unknown, fallback, or low-value routes continue using the checked-in fallback social image without breaking the existing preview contract.

### Verification and Release Evidence

- [ ] **VER-01**: Unit and curation tests prove discovery labels, slug collisions, public eligibility, search/filter behavior, feed XML, related-work graph behavior, and social-preview target selection.
- [ ] **VER-02**: Static verification proves topic routes, feed files, metadata, JSON-LD, sitemap entries, feed autodiscovery, generated preview assets, and hidden-content exclusion in `.output/public`.
- [ ] **VER-03**: Browser verification covers desktop and mobile dark rendering, keyboard and focus behavior, result count/reset/empty states, axe checks, reduced motion, and text-overlap risks for discovery/filter surfaces.
- [ ] **VER-04**: Release verification covers new static routes, feed output, generated assets, release budgets, and absence of visitor-runtime GitHub, CMS, search-service, or content API fetches.
- [ ] **VER-05**: Release-readiness docs and evidence labels describe only automated local checks, leaving hosted feed-reader, social-card, Cloudflare deploy, live external-link, and manual preview checks as manual smoke items.

## v2 Requirements

Deferred to a future release. Tracked but not in the current roadmap.

### Feed Expansion

- **FTR-01**: Site can publish a JSON Feed companion derived from the same checked-in feed item model.
- **FTR-02**: Site can publish topic-specific feeds once there is enough dated topic content to justify the extra routes.
- **FTR-03**: Site can publish project, theme, or site-update feed entries once explicit dated update records exist.

### Search and Publishing

- **FTR-04**: Site can add a full-text search index if the corpus grows beyond simple local filtering.
- **FTR-05**: Maintainer can manage content through a CMS, admin, or editor workflow after static content discovery matures.
- **FTR-06**: Release automation can run live hosted feed-reader, social-card, deploy, and external-link checks if a later milestone accepts live-network gate risk.

## Out of Scope

Explicit exclusions for v1.6.

| Feature | Reason |
|---------|--------|
| CMS, admin, or editor workflow | v1.6 should improve checked-in static content discovery before changing publishing operations. |
| Hosted, semantic, or AI search | The corpus is small enough for local static filtering, and hosted search would add runtime dependency and privacy concerns. |
| Visitor-runtime content APIs or GitHub fetches | Runtime content fetches weaken static deployment, performance, and deterministic verification. |
| Runtime feed endpoints or dynamic Open Graph endpoints | v1.6 should keep feeds and social previews deterministic static assets. |
| Crawled faceted route combinations | Canonical topic pages satisfy durable sharing without creating duplicate/thin crawl surfaces. |
| Raw GitHub repository mirror | Curated project and writing copy remains the source of truth for portfolio narrative quality. |
| Newsletter, comments, analytics, WebSub, or webmentions | These add product and moderation scope beyond content discovery and syndication. |
| Heavy graph visualization | Related-work navigation should stay compact and content-first. |
| Prominent OpenLinks promotion | OpenLinks remains a subtle identity surface, not the primary discovery CTA. |

## Traceability

Traceability maps each v1.6 requirement to exactly one roadmap phase.

| Requirement | Phase | Status |
|-------------|-------|--------|
| DISC-01 | Phase 31 | Complete |
| DISC-02 | Phase 31 | Complete |
| DISC-03 | Phase 31 | Complete |
| DISC-04 | Phase 30 | Complete |
| DISC-05 | Phase 31 | Complete |
| FIND-01 | Phase 32 | Pending |
| FIND-02 | Phase 32 | Pending |
| FIND-03 | Phase 32 | Pending |
| FIND-04 | Phase 32 | Pending |
| FIND-05 | Phase 32 | Pending |
| FEED-01 | Phase 33 | Pending |
| FEED-02 | Phase 33 | Pending |
| FEED-03 | Phase 33 | Pending |
| FEED-04 | Phase 33 | Pending |
| FEED-05 | Phase 33 | Pending |
| REL-01 | Phase 34 | Pending |
| REL-02 | Phase 34 | Pending |
| REL-03 | Phase 34 | Pending |
| REL-04 | Phase 34 | Pending |
| PREV-01 | Phase 35 | Pending |
| PREV-02 | Phase 35 | Pending |
| PREV-03 | Phase 35 | Pending |
| VER-01 | Phase 36 | Pending |
| VER-02 | Phase 36 | Pending |
| VER-03 | Phase 36 | Pending |
| VER-04 | Phase 36 | Pending |
| VER-05 | Phase 36 | Pending |

**Coverage:**
- v1 requirements: 27 total
- Mapped to phases: 27
- Unmapped: 0
- Duplicate mappings: 0

---
*Requirements defined: 2026-06-26*
*Last updated: 2026-06-27 after Phase 30 completion*
