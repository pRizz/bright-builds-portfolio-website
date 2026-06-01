# Roadmap: Bright Builds Portfolio Website

## Milestones

- ✅ **v1.0 MVP** — Phases 1-5 shipped 2026-05-27. Archive: [v1.0-ROADMAP.md](milestones/v1.0-ROADMAP.md). Audit: [v1.0-MILESTONE-AUDIT.md](milestones/v1.0-MILESTONE-AUDIT.md).
- ✅ **v1.1 Release Confidence** — Phases 6-9 completed 2026-06-01; Phase 9 closed the clean-builder release gate gaps found in the milestone audit.

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

### ✅ v1.1 Release Confidence (Gap Closure)

**Milestone Goal:** Turn the shipped v1.0 portfolio into a repeatable, deploy-ready release by hardening browser, accessibility, SEO, performance, external-link, deployment, and content-helper verification before expanding product scope.

- [x] **Phase 6: Browser & Accessibility Release Automation** - Maintainers can run repeatable browser and accessibility checks against the static portfolio surfaces. (completed 2026-05-31)
- [x] **Phase 7: Release Gates & Deploy Readiness** - Maintainers have one release contract covering SEO, performance, external links, and Cloudflare/static deployment assumptions. (completed 2026-05-31)
- [x] **Phase 8: Content Helper Surface Cleanup** - Maintainers can rely on intentional curated-data APIs without seed-era helper ambiguity. (completed 2026-05-31)
- [x] **Phase 9: Clean Builder Release Gate Closure** - Maintainers can run the aggregate release gate from clean builder environments with documented browser provisioning and complete gate documentation. (completed 2026-06-01)

## Phase Details

### Phase 6: Browser & Accessibility Release Automation

**Goal**: Maintainers can run repeatable browser and accessibility release checks against the shipped static portfolio surfaces.
**Depends on**: Phase 5
**Requirements**: BROW-02, BROW-03, BROW-04, GATE-01
**Gap Closure Note**: BROW-01 moved to Phase 9 after the v1.1 milestone audit found clean-builder browser provisioning was not documented or scripted.
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
**Requirements**: GATE-02, GATE-03, REL-01, REL-02
**Gap Closure Note**: GATE-04, REL-03, and REL-04 moved to Phase 9 after the v1.1 milestone audit found the clean-builder release path incomplete.
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

**Plans**: 1 plan

Plans:
- [x] 08-01-PLAN.md — Clean documented project helper exports and add the helper-surface import guard

### Phase 9: Clean Builder Release Gate Closure

**Goal**: Maintainers can run the aggregate release gate from clean builder environments with documented Playwright browser provisioning and complete release gate documentation.
**Depends on**: Phase 8
**Requirements**: BROW-01, GATE-04, REL-03, REL-04
**Gap Closure**: Closes gaps from `.planning/v1.1-MILESTONE-AUDIT.md`.
**Success Criteria** (what must be TRUE):

1. Maintainer can identify and run the browser provisioning step required before `bun run verify` on a clean builder.
1. Release-readiness documentation explains how Playwright/Chromium is provisioned for local and Cloudflare/static release verification.
1. The aggregate release gate documentation names `verify:project-helper-surface` as part of `bun run verify`.
1. Release-readiness checks or focused tests fail if the clean-builder browser provisioning and helper-surface guard facts are omitted from the release contract.

**Plans**: 1/1 plans complete

Plans:
- [x] 09-01-PLAN.md — Close clean-builder browser provisioning and release gate documentation gaps

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Static App Foundation & UI Shell | v1.0 | 2/2 | Complete | 2026-05-24 |
| 01.1. Dark-Primary Visual Rule and Shell Refactor | v1.0 | 1/1 | Complete | 2026-05-25 |
| 2. Curated Content Model | v1.0 | 2/2 | Complete | 2026-05-26 |
| 3. Portfolio Surfaces & SEO | v1.0 | 3/3 | Complete | 2026-05-26 |
| 4. Visual System & Motion | v1.0 | 3/3 | Complete | 2026-05-26 |
| 5. GitHub Enrichment & Release Verification | v1.0 | 3/3 | Complete | 2026-05-27 |
| 6. Browser & Accessibility Release Automation | v1.1 | 1/1 | Complete    | 2026-05-31 |
| 7. Release Gates & Deploy Readiness | v1.1 | 1/1 | Complete   | 2026-05-31 |
| 8. Content Helper Surface Cleanup | v1.1 | 1/1 | Complete   | 2026-05-31 |
| 9. Clean Builder Release Gate Closure | v1.1 | 1/1 | Complete | 2026-06-01 |

## Next

Run the v1.1 milestone audit again, then complete the milestone with `/gsd-complete-milestone`.
