# Requirements: Bright Builds Portfolio Website v1.2

**Defined:** 2026-06-01
**Milestone:** v1.2 Project Story Pages
**Core Value:** Help visitors quickly understand what Peter builds, why it matters, and which projects are worth exploring or collaborating on.

## v1.2 Requirements

### Project Routes

- [x] **ROUTE-01**: Visitor can open a stable `/projects/{slug}` detail route for each curated project selected for detail-page treatment.
- [x] **ROUTE-02**: Maintainer can control which curated projects receive public detail pages through a typed data field or selector.
- [x] **ROUTE-03**: Clean static builds prerender HTML for every selected project detail route before hydration.
- [x] **ROUTE-04**: Hidden, excluded, archived-only, or otherwise unselected projects do not create public detail pages.

### Project Story Content

- [x] **STORY-01**: Maintainer can author detail-page content for selected projects covering intro, technical shape, proof points, current status, and collaboration angle.
- [x] **STORY-02**: Visitor can understand each selected project's problem, approach, why it matters, technical shape, and current status from the static detail page.
- [x] **STORY-03**: Visitor can access source, live, docs, related, and GitHub snapshot facts from a detail page without those facts replacing authored narrative.
- [x] **STORY-04**: Project detail pages preserve the dark-primary visual system with accessible headings, readable text, labeled link groups, and stable responsive layout.

### Project Metadata

- [ ] **META-01**: Each project detail route has route-specific title, description, canonical URL, Open Graph, and Twitter metadata derived from curated project data.
- [ ] **META-02**: Each project detail route renders project-specific JSON-LD suitable for static software/project pages.
- [ ] **META-03**: Generated sitemap output includes every selected project detail route and excludes unselected projects.
- [ ] **META-04**: Project detail routes have deterministic project-specific social preview support or a documented static fallback that does not require runtime rendering.

### Navigation

- [x] **NAV-01**: Home featured project cards link visitors to project detail routes for selected projects.
- [x] **NAV-02**: The project index remains a scannable overview while linking selected projects to their detail routes.
- [x] **NAV-03**: Each project detail page gives visitors clear paths back to the project index and onward to primary project actions.

### Verification

- [x] **VERIFY-01**: Unit tests cover project detail eligibility, route derivation, metadata derivation, and unselected-project exclusions.
- [ ] **VERIFY-02**: Static verification checks generated project detail HTML for expected story text, metadata, JSON-LD, sitemap inclusion, and forbidden runtime GitHub residue.
- [ ] **VERIFY-03**: Browser release checks include project detail routes for axe, dark desktop/mobile layout, keyboard reachability, and reduced-motion behavior.
- [ ] **VERIFY-04**: Release-readiness documentation and checks identify project detail route coverage as part of `bun run install:browser && bun run verify`.

## Future Requirements

Deferred to future milestones. Tracked but not in the current roadmap.

### Writing

- **WRITE-01**: Visitor can browse a dedicated writing or notes surface.
- **WRITE-02**: Maintainer can connect project pages to related notes or essays.

### Social Images

- **OG-01**: Maintainer can generate richer project-specific raster Open Graph images from templates.
- **OG-02**: Visitor-visible social previews can vary by project theme without manual image editing.

### Content Operations

- **CMS-01**: Maintainer can edit portfolio content through a CMS or admin UI.
- **CMS-02**: Maintainer can preview unpublished project stories before static release.

## Out of Scope

| Feature | Reason |
| --- | --- |
| Detail pages for every public GitHub repository | v1.2 is curated story depth, not a raw repo mirror. |
| Runtime GitHub API calls from visitor pages | Existing static and token-safety constraints remain valid. |
| Dynamic OG image/server endpoints | Static deployment remains the release target for this milestone. |
| Dedicated writing or notes surface | Valuable, but project story depth is the approved next focus. |
| CMS/admin/editor tooling | Typed checked-in content is enough for the current portfolio scale. |
| Major Mystic UI or visual-system refactor | v1.2 should extend the existing dark-primary system, not replace it. |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
| --- | --- | --- |
| ROUTE-01 | Phase 10 | Complete |
| ROUTE-02 | Phase 10 | Complete |
| ROUTE-03 | Phase 10 | Complete |
| ROUTE-04 | Phase 10 | Complete |
| STORY-01 | Phase 10 | Complete |
| STORY-02 | Phase 11 | Complete |
| STORY-03 | Phase 11 | Complete |
| STORY-04 | Phase 11 | Complete |
| META-01 | Phase 12 | Pending |
| META-02 | Phase 12 | Pending |
| META-03 | Phase 12 | Pending |
| META-04 | Phase 12 | Pending |
| NAV-01 | Phase 11 | Complete |
| NAV-02 | Phase 11 | Complete |
| NAV-03 | Phase 11 | Complete |
| VERIFY-01 | Phase 10 | Complete |
| VERIFY-02 | Phase 13 | Pending |
| VERIFY-03 | Phase 13 | Pending |
| VERIFY-04 | Phase 13 | Pending |

**Coverage:**

- v1.2 requirements: 19 total
- Mapped to phases: 19
- Unmapped: 0

---

*Requirements defined: 2026-06-01*
*Last updated: 2026-06-02 after Phase 11 completion*
