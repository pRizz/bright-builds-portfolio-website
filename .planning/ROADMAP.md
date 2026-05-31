# Roadmap: Bright Builds Portfolio Website

## Milestones

- ✅ **v1.0 MVP** — Phases 1-5 shipped 2026-05-27. Archive: [v1.0-ROADMAP.md](milestones/v1.0-ROADMAP.md). Audit: [v1.0-MILESTONE-AUDIT.md](milestones/v1.0-MILESTONE-AUDIT.md).
- 🚧 **v1.1 Release Confidence** — Phases 6-8 planned to harden repeatable release verification, deploy readiness, and content-helper cleanup.

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

### 🚧 v1.1 Release Confidence (In Progress)

**Milestone Goal:** Turn the shipped v1.0 portfolio into a repeatable, deploy-ready release by hardening browser, accessibility, SEO, performance, external-link, deployment, and content-helper verification before expanding product scope.

- [ ] **Phase 6: Browser & Accessibility Release Automation** - Maintainers can run repeatable browser and accessibility checks against the static portfolio surfaces.
- [ ] **Phase 7: Release Gates & Deploy Readiness** - Maintainers have one release contract covering SEO, performance, external links, and Cloudflare/static deployment assumptions.
- [ ] **Phase 8: Content Helper Surface Cleanup** - Maintainers can rely on intentional curated-data APIs without seed-era helper ambiguity.

## Phase Details

### Phase 6: Browser & Accessibility Release Automation

**Goal**: Maintainers can run repeatable browser and accessibility release checks against the shipped static portfolio surfaces.
**Depends on**: Phase 5
**Requirements**: BROW-01, BROW-02, BROW-03, BROW-04, GATE-01
**Success Criteria** (what must be TRUE):

1. Maintainer can run checked-in browser release checks against built static output and get clear pass/fail evidence.
1. Maintainer can verify desktop and mobile dark-primary pages have no obvious text overlap, control overlap, or horizontal overflow.
1. Maintainer can verify reduced-motion mode disables nonessential UI motion while preserving readable static content.
1. Maintainer can verify keyboard focus reaches primary navigation, project links, and collaboration/contact paths.
1. Maintainer sees accessibility failures for core static surfaces reported clearly in release verification.

**Plans**: TBD
**UI hint**: yes

### Phase 7: Release Gates & Deploy Readiness

**Goal**: Maintainers can use one release-readiness contract for SEO, performance, external links, and Cloudflare/static deployment assumptions.
**Depends on**: Phase 6
**Requirements**: GATE-02, GATE-03, GATE-04, REL-01, REL-02, REL-03, REL-04
**Success Criteria** (what must be TRUE):

1. Maintainer can run SEO/static metadata checks that cover route titles, descriptions, canonical links, Open Graph/Twitter basics, sitemap, robots, and JSON-LD.
1. Maintainer can run a realistic performance and best-practices gate, or follow a documented local equivalent, before release.
1. Maintainer can validate external links through a documented policy that avoids token leakage, fragile third-party blocking, and false failures for allowed unreachable links.
1. Maintainer can verify Cloudflare Pages/static deployment assumptions from checked-in documentation covering build command, output directory, package/runtime pins, and environment expectations.
1. Maintainer can run one aggregate release verification command that includes the new browser, accessibility, SEO, performance, external-link, and existing static checks.

**Plans**: TBD

### Phase 8: Content Helper Surface Cleanup

**Goal**: Maintainers can treat curated project helper exports as an intentional data surface with guardrails against seed-era runtime dependencies.
**Depends on**: Phase 7
**Requirements**: DATA-01, DATA-02, DATA-03
**Success Criteria** (what must be TRUE):

1. Maintainer can tell whether seed-era helpers such as `projectSeeds` and `primaryProjectLink` are intentional exported fixtures or removed implementation leftovers.
1. Maintainer can update curated project data through documented selector APIs without reintroducing undocumented seed-era helper dependencies.
1. Maintainer gets test or import-check failures if runtime portfolio surfaces depend on orphaned seed-era helper exports.
1. Existing curated project behavior remains unchanged after helper cleanup or documentation.

**Plans**: TBD

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Static App Foundation & UI Shell | v1.0 | 2/2 | Complete | 2026-05-24 |
| 01.1. Dark-Primary Visual Rule and Shell Refactor | v1.0 | 1/1 | Complete | 2026-05-25 |
| 2. Curated Content Model | v1.0 | 2/2 | Complete | 2026-05-26 |
| 3. Portfolio Surfaces & SEO | v1.0 | 3/3 | Complete | 2026-05-26 |
| 4. Visual System & Motion | v1.0 | 3/3 | Complete | 2026-05-26 |
| 5. GitHub Enrichment & Release Verification | v1.0 | 3/3 | Complete | 2026-05-27 |
| 6. Browser & Accessibility Release Automation | v1.1 | 0/TBD | Not started | - |
| 7. Release Gates & Deploy Readiness | v1.1 | 0/TBD | Not started | - |
| 8. Content Helper Surface Cleanup | v1.1 | 0/TBD | Not started | - |

## Next

Plan Phase 6 with `/gsd-plan-phase 6`.
