# Requirements: Bright Builds Portfolio Website v1.4

**Defined:** 2026-06-16
**Milestone:** v1.4 Theme Paths & Collaboration Surface
**Core Value:** Help visitors quickly understand what Peter builds, why it matters, and which projects are worth exploring or collaborating on.

## v1.4 Requirements

Requirements for the theme paths and collaboration milestone. Each requirement maps to exactly one roadmap phase.

### Theme Model

- [ ] **THEME-01**: Maintainer can define curated theme paths with slug, title, summary, audience, proof points, collaboration angle, related project slugs, and related writing slugs in typed checked-in data.
- [ ] **THEME-02**: Maintainer can ask theme helpers for public theme entries, stable `/themes/{slug}` paths, and ordered theme lists without adding runtime APIs, CMS, MDX, parser pipelines, or external content dependencies.
- [ ] **THEME-03**: Unit and curation tests fail for duplicate or invalid theme slugs, missing required fields, unsupported theme status, unknown project slugs, unknown writing slugs, hidden project references, or unpublished writing references.
- [ ] **THEME-04**: Theme model decisions keep the existing project and writing registries authoritative instead of duplicating authored project or writing content inside theme records.

### Theme Routes

- [ ] **ROUTE-01**: Visitor can open a stable `/themes` index listing public theme paths as curated entry points into Peter's work.
- [ ] **ROUTE-02**: Visitor can open stable `/themes/{slug}` static detail routes for every public theme path.
- [ ] **ROUTE-03**: Clean static builds prerender `/themes` and every public theme detail route before hydration.
- [ ] **ROUTE-04**: Hidden, unsupported, or invalid theme records do not create public detail pages or leak private content through fallback routes.

### Synthesis Experience

- [ ] **SYNTH-01**: Visitor can understand each theme's main idea, why it matters, representative proof points, and connection to Peter's projects and writing from the static theme detail page.
- [x] **SYNTH-02**: Visitor can move from theme detail pages to related selected project stories and public writing entries using helper-derived relationships.
- [x] **SYNTH-03**: Project and writing surfaces can show related theme links where those links clarify the existing content graph without overwhelming the primary project or writing narrative.
- [ ] **SYNTH-04**: Theme index and detail pages preserve the dark-primary responsive interface, accessible headings, readable text hierarchy, keyboard reachability, and stable text wrapping on desktop and mobile.

### Collaboration Pathways

- [x] **COLLAB-01**: Visitor can identify a useful collaboration starting point for each theme, including reviewed source links, live surfaces, relevant writing, and practical next actions when available.
- [x] **COLLAB-02**: Theme collaboration panels use existing curated project, writing, profile, GitHub, and OpenLinks data instead of introducing unreviewed external-link sources or live reachability claims.
- [x] **COLLAB-03**: OpenLinks remains a low-intrusion identity hub in footer, profile, contact, or metadata surfaces and does not become the primary theme CTA unless explicitly requested later.

### Metadata and Discovery

- [ ] **META-01**: `/themes` and each public theme detail route have route-specific title, description, canonical URL, Open Graph, and Twitter metadata derived from theme and profile data.
- [ ] **META-02**: Theme index and detail routes render static structured data before hydration using helper-derived theme, project, writing, and profile relationships.
- [ ] **META-03**: Generated sitemap output includes `/themes` and every public theme detail route while excluding hidden, unsupported, or invalid theme routes.
- [ ] **META-04**: Theme routes use the checked-in static social preview fallback or deterministic static support without runtime image generation or server endpoints.

### Verification

- [ ] **VERIFY-01**: Static verification checks generated theme HTML for expected content, metadata, structured data, sitemap inclusion and exclusion, related project links, related writing links, collaboration links, and forbidden runtime API residue.
- [x] **VERIFY-02**: Browser release checks include theme routes for axe, dark desktop and mobile layout, keyboard reachability, reduced-motion behavior where relevant, and text-overlap risk.
- [x] **VERIFY-03**: Release-readiness docs and checks identify theme route coverage as part of `bun run install:browser && bun run verify`.
- [x] **VERIFY-04**: The aggregate `bun run verify` gate passes with theme routes included and release evidence labels name only automated theme coverage that actually runs.

## Future Requirements

Deferred beyond v1.4. Tracked here so theme paths stay focused on static synthesis and collaboration clarity.

### Social Images

- **OG-01**: Maintainer can generate richer project, writing, and theme raster Open Graph images from deterministic templates.
- **OG-02**: Visitor-visible social previews can vary by content theme without manual image editing.

### Content Operations

- **CMS-01**: Maintainer can draft, edit, and publish writing or theme copy through a CMS or admin surface.
- **CMS-02**: Maintainer can preview unpublished content before it is published to static output.

### Discovery Enhancements

- **DISC-FUTURE-01**: Visitor can search, filter, or browse tag archive pages if project, writing, or theme volume grows enough to require it.
- **DISC-FUTURE-02**: Visitor can subscribe to RSS, Atom, newsletter, or other update surfaces after there is a clear collaboration need.
- **DISC-FUTURE-03**: Maintainer can run live external-link reachability automation if release needs justify the network and flake surface.

## Out of Scope

Explicitly excluded from v1.4 to prevent scope creep.

| Feature | Reason |
| --- | --- |
| CMS, admin UI, database, auth-backed editor, or preview workflow | Typed checked-in content remains enough and preserves the static deployment model. |
| Markdown, MDX, Contentlayer, parser pipelines, or external content fetches | Theme paths can compose existing typed project and writing data without new content dependencies. |
| Search, filters, pagination, tag archive pages, or personalized recommendation flows | The goal is curated theme synthesis, not a generic discovery engine. |
| Comments, likes, reactions, webmentions, newsletter backend, or analytics stack | These add operational surface and are not required for theme-based collaboration clarity. |
| Dynamic Open Graph image routes, server endpoints, or runtime image generation | Static deployment remains the target; v1.4 can reuse the checked-in social preview fallback. |
| Runtime GitHub, Gist, Notion, Substack, RSS, or token-dependent content fetches | Visitor paths must stay static, deterministic, and token-safe. |
| Prominent OpenLinks promotion in theme navigation or primary CTAs | OpenLinks should stay discoverable as an identity hub while Bright Builds, projects, writing, and collaboration context remain primary. |
| Live external link reachability automation | Existing policy and static verification are sufficient unless a future release gate deliberately expands link checks. |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
| --- | --- | --- |
| THEME-01 | Phase 19 | Pending |
| THEME-02 | Phase 19 | Pending |
| THEME-03 | Phase 19 | Pending |
| THEME-04 | Phase 19 | Pending |
| ROUTE-01 | Phase 20 | Pending |
| ROUTE-02 | Phase 20 | Pending |
| ROUTE-03 | Phase 20 | Pending |
| ROUTE-04 | Phase 20 | Pending |
| SYNTH-01 | Phase 20 | Pending |
| SYNTH-04 | Phase 20 | Pending |
| SYNTH-02 | Phase 21 | Complete |
| SYNTH-03 | Phase 21 | Complete |
| COLLAB-01 | Phase 21 | Complete |
| COLLAB-02 | Phase 21 | Complete |
| COLLAB-03 | Phase 21 | Complete |
| META-01 | Phase 22 | Pending |
| META-02 | Phase 22 | Pending |
| META-03 | Phase 22 | Pending |
| META-04 | Phase 22 | Pending |
| VERIFY-01 | Phase 23 | Pending |
| VERIFY-02 | Phase 23 | Complete |
| VERIFY-03 | Phase 23 | Complete |
| VERIFY-04 | Phase 23 | Complete |

**Coverage:**

- v1.4 requirements: 23 total
- Mapped to phases: 23
- Unmapped: 0

______________________________________________________________________

*Requirements defined: 2026-06-16*
*Last updated: 2026-06-16 after v1.4 roadmap creation*
