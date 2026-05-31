# Requirements: Bright Builds Portfolio Website

**Defined:** 2026-05-31
**Milestone:** v1.1 Release Confidence
**Core Value:** Help visitors quickly understand what Peter builds, why it matters, and which projects are worth exploring or collaborating on.

## v1.1 Requirements

Requirements for the Release Confidence milestone. Each requirement must map to exactly one roadmap phase.

### Browser Release Automation

- [ ] **BROW-01**: Maintainer can run checked-in browser release checks against the built static portfolio without relying on ad hoc recorded evidence.
- [ ] **BROW-02**: Maintainer can verify desktop and mobile dark-primary rendering for core portfolio surfaces with no obvious text overlap, control overlap, or horizontal overflow.
- [ ] **BROW-03**: Maintainer can verify reduced-motion browser behavior disables nonessential UI motion while preserving readable static content.
- [ ] **BROW-04**: Maintainer can verify keyboard/focus access for primary navigation, project links, and collaboration/contact paths.

### Accessibility, SEO, and Performance Gates

- [ ] **GATE-01**: Maintainer can run accessibility checks over the core static portfolio surfaces with failures reported clearly in release verification.
- [ ] **GATE-02**: Maintainer can run SEO/static metadata release checks that cover route titles, descriptions, canonical links, Open Graph/Twitter basics, sitemap, robots, and JSON-LD.
- [ ] **GATE-03**: Maintainer can run a realistic performance and best-practices gate, or a documented local equivalent, before release.
- [ ] **GATE-04**: Maintainer can run one aggregate release verification command that includes the new repeatable browser, accessibility, SEO, performance, and existing static checks.

### External Links and Deployment Readiness

- [ ] **REL-01**: Maintainer can follow an explicit policy for validating external-link reachability, including whether checks are automated or manual and why.
- [ ] **REL-02**: Maintainer can validate external links without leaking tokens, depending on fragile third-party behavior, or blocking release on intentionally allowed unreachable links.
- [ ] **REL-03**: Maintainer can verify Cloudflare Pages/static deployment assumptions from checked-in documentation, including build command, output directory, package/runtime pins, and environment expectations.
- [ ] **REL-04**: Maintainer can use a checked-in preview/deploy checklist that covers pre-deploy build output and post-deploy smoke checks.

### Content Helper Surface

- [ ] **DATA-01**: Maintainer can tell whether seed-era helpers such as `projectSeeds` and `primaryProjectLink` are intentional exported fixtures or removable implementation leftovers.
- [ ] **DATA-02**: Maintainer can rely on tests or import checks proving runtime portfolio surfaces use intentional curated project selector APIs instead of orphaned helper exports.
- [ ] **DATA-03**: Maintainer can update curated project data without reintroducing undocumented seed-era helper dependencies.

## Future Requirements

Deferred until the release-confidence contract is in place.

### Project Depth

- **DEPTH-01**: Visitor can open richer per-project pages with route-specific project storytelling and metadata.
- **DEPTH-02**: Visitor can browse a dedicated writing or notes surface.
- **DEPTH-03**: Visitor can share project-specific static Open Graph images beyond the current default social preview.

## Out of Scope

Explicitly excluded from v1.1 to keep the milestone focused on confidence, not product expansion.

| Feature | Reason |
|---------|--------|
| New content-heavy portfolio sections | Adds product scope before release gates are trustworthy. |
| Blog, CMS, or admin workflows | Not needed to harden the shipped static portfolio release path. |
| Runtime analytics or backend services | Conflicts with the static, dependency-light release confidence goal. |
| More motion, physics, or visual novelty | v1.1 should prove the existing experience is robust before adding more visual surface area. |
| Raw GitHub profile mirroring | Still conflicts with the curated portfolio model validated in v1.0. |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| BROW-01 | Phase 6 | Pending |
| BROW-02 | Phase 6 | Pending |
| BROW-03 | Phase 6 | Pending |
| BROW-04 | Phase 6 | Pending |
| GATE-01 | Phase 6 | Pending |
| GATE-02 | Phase 7 | Pending |
| GATE-03 | Phase 7 | Pending |
| GATE-04 | Phase 7 | Pending |
| REL-01 | Phase 7 | Pending |
| REL-02 | Phase 7 | Pending |
| REL-03 | Phase 7 | Pending |
| REL-04 | Phase 7 | Pending |
| DATA-01 | Phase 8 | Pending |
| DATA-02 | Phase 8 | Pending |
| DATA-03 | Phase 8 | Pending |

**Coverage:**

- v1.1 requirements: 15 total
- Mapped to phases: 15
- Unmapped: 0

______________________________________________________________________

*Requirements defined: 2026-05-31*
*Last updated: 2026-05-31 after initial definition*
