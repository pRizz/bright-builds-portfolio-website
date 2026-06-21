# Roadmap: Bright Builds Portfolio Website

## Milestones

- [ ] **v1.5 Static Shareability & Freshness** - Phases 24-28 active. Deterministic static social preview assets, metadata wiring, freshness reports, and truthful release verification.
- [x] **v1.4 Theme Paths & Collaboration Surface** - Phases 19-23 shipped 2026-06-20. Archive: [v1.4-ROADMAP.md](milestones/v1.4-ROADMAP.md). Audit: [v1.4-MILESTONE-AUDIT.md](milestones/v1.4-MILESTONE-AUDIT.md).
- [x] **v1.3 Writing & Notes Surface** - Phases 14-18 shipped 2026-06-16. Archive: [v1.3-ROADMAP.md](milestones/v1.3-ROADMAP.md). Audit: [v1.3-MILESTONE-AUDIT.md](milestones/v1.3-MILESTONE-AUDIT.md).
- [x] **v1.2 Project Story Pages** - Phases 10-13 shipped 2026-06-03. Archive: [v1.2-ROADMAP.md](milestones/v1.2-ROADMAP.md). Audit: [v1.2-MILESTONE-AUDIT.md](milestones/v1.2-MILESTONE-AUDIT.md).
- [x] **v1.1 Release Confidence** - Phases 6-9 shipped 2026-06-01. Archive: [v1.1-ROADMAP.md](milestones/v1.1-ROADMAP.md). Audit: [v1.1-MILESTONE-AUDIT.md](milestones/v1.1-MILESTONE-AUDIT.md).
- [x] **v1.0 MVP** - Phases 1-5 plus Phase 01.1 shipped 2026-05-27. Archive: [v1.0-ROADMAP.md](milestones/v1.0-ROADMAP.md). Audit: [v1.0-MILESTONE-AUDIT.md](milestones/v1.0-MILESTONE-AUDIT.md).

## Current Planning

### v1.5 Static Shareability & Freshness

**Milestone Goal:** Make every project, writing, and theme route share cleanly with deterministic static social preview assets and keep public-facing metadata fresh without runtime services.

**Granularity:** Coarse
**Coverage:** 25/25 v1.5 requirements mapped

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions after planning

- [x] **Phase 24: Social Image Data Contract** - Define the route-derived social preview target contract, public filtering, validation rules, and fallback behavior. (completed 2026-06-21)
- [x] **Phase 25: Deterministic Static Image Generation** - Generate and verify deterministic 1200x630 PNG social preview assets and manifests from the contract. (completed 2026-06-21)
- [ ] **Phase 26: Metadata Wiring and Static References** - Wire project, writing, theme, and index metadata to the generated static preview assets.
- [ ] **Phase 27: Freshness Reports and Reviewed Snapshot Policy** - Add offline freshness reporting and reviewed snapshot policy without runtime mutation or live release gates.
- [ ] **Phase 28: Verification and Release Contract** - Expand aggregate verification, static output checks, release evidence, budgets, and release-readiness docs.

## Phase Details

### Phase 24: Social Image Data Contract
**Goal**: Maintainers have one pure route-derived contract for every public project, writing, and theme social preview target, with explicit fallback behavior for generic routes.
**Depends on**: Phase 23
**Requirements**: SHARE-01, SHARE-02, SHARE-03, SHARE-04, SHARE-05
**Success Criteria** (what must be TRUE):
  1. Maintainer can list all public share targets for `/projects`, selected project detail routes, `/writing`, public writing detail routes, `/themes`, and public theme detail routes from one pure helper.
  2. Hidden, draft, unsupported, archived, unselected, and otherwise non-public records do not produce public social preview targets.
  3. Each target exposes route path, local asset path, title, description, route kind or kicker, labels, route-specific alt text, dimensions, and stable source fingerprint.
  4. Social preview validation rejects duplicate routes or assets, missing text, unsafe or non-local paths, unsupported kinds, and text that cannot fit the template rules while generic routes keep the fallback social image.
**Plans**: 1 plan
Plans:
- [x] 24-01-PLAN.md — Add the pure social preview target contract, fallback value, fingerprints, validation findings, and focused domain tests.

### Phase 25: Deterministic Static Image Generation
**Goal**: Maintainers can deterministically generate and verify static PNG social preview assets from the social preview contract.
**Depends on**: Phase 24
**Requirements**: IMAGE-01, IMAGE-02, IMAGE-03, IMAGE-04, IMAGE-05
**Success Criteria** (what must be TRUE):
  1. Maintainer can run a Bun/TypeScript command that generates a 1200x630 PNG for every social preview target.
  2. Generated images use checked-in templates, fonts, and local assets without network fetches, runtime services, host fonts, timestamps, randomness, secrets, or visitor-runtime code.
  3. Generated assets and the timestamp-free manifest stay confined to the managed static asset directory without deleting or overwriting the fallback social image or unrelated public assets.
  4. Image generation check mode fails for missing, stale, wrong-dimension, oversized, blank, orphaned, or non-deterministically regenerated social preview assets.
**Plans**: 3 plans
Plans:
- [x] 25-01-PLAN.md — Add renderer dependency, checked-in font inputs, pure helper core, and focused helper tests.
- [x] 25-02-PLAN.md — Add generator/check CLI, package scripts, and aggregate verify ordering.
- [x] 25-03-PLAN.md — Generate and verify checked-in social preview PNG and manifest outputs.

### Phase 26: Metadata Wiring and Static References
**Goal**: Crawlers and social previews read route-specific static image metadata for covered routes while generic routes continue to use the fallback image.
**Depends on**: Phase 25
**Requirements**: META-01, META-02, META-03, META-04, META-05
**Success Criteria** (what must be TRUE):
  1. Project, writing, theme, and route-family index metadata select social preview assets from the same helper used by the generator.
  2. Generated HTML exposes absolute canonical `og:image`, `og:image:type`, `og:image:width`, `og:image:height`, `og:image:alt`, `twitter:image`, and `twitter:image:alt` values for every covered share route before hydration.
  3. Project, writing, and theme JSON-LD `image` values match the route-specific Open Graph and Twitter social image asset.
  4. Home, about, contact, and other generic routes continue to use the checked-in fallback image, and metadata remains helper-derived rather than hard-coded in route files.
**Plans**: 2 plans
Plans:
- [x] 26-01-PLAN.md — Add route-aware social image metadata resolver and JSON-LD parity tests.
- [ ] 26-02-PLAN.md — Render MIME social image tags and verify static generated asset references.

### Phase 27: Freshness Reports and Reviewed Snapshot Policy
**Goal**: Maintainers can review offline freshness evidence without mutating source data or weakening the static release contract.
**Depends on**: Phase 26
**Requirements**: FRESH-01, FRESH-02, FRESH-03, FRESH-04, FRESH-05
**Success Criteria** (what must be TRUE):
  1. Maintainer can run an offline freshness report summarizing generated media drift, GitHub metadata snapshot age and unavailable records, primary link policy coverage, HTTPS issues, and manual smoke targets.
  2. Freshness findings are grouped into `release blocker`, `needs review`, and `manual smoke` severities.
  3. Freshness reports do not mutate curated project, writing, theme, profile, GitHub metadata, or generated social preview source data.
  4. Optional live freshness checks, if present, run only through explicit maintainer commands outside `bun run verify`.
  5. Freshness documentation distinguishes reviewed static evidence from hosted crawler validation, live external-link reachability, and current live GitHub state.
**Plans**: TBD

### Phase 28: Verification and Release Contract
**Goal**: The local release gate proves the static social preview, metadata, freshness, and evidence contracts without overclaiming manual or live-network checks.
**Depends on**: Phase 27
**Requirements**: VERIFY-01, VERIFY-02, VERIFY-03, VERIFY-04, VERIFY-05
**Success Criteria** (what must be TRUE):
  1. Unit tests cover social preview target derivation, public-only filtering, path uniqueness, fingerprint stability, manifest freshness checks, metadata image selection, JSON-LD image parity, and offline freshness finding classification.
  2. `bun run verify` includes deterministic social preview verification before production build and still avoids dynamic Open Graph endpoints, server functions, visitor-runtime GitHub fetches, and live external-link release gates.
  3. Static output verification checks every covered route's generated HTML, social image metadata, JSON-LD image field, local asset existence, dimensions, manifest consistency, and forbidden runtime residue.
  4. Release verification enforces per-image and total social preview asset budgets and reports only automated evidence labels that actually run locally.
  5. Release-readiness docs explain the generation, verification, freshness report, and manual social-card smoke-check flow while preserving the clean-builder release command `bun run install:browser && bun run verify`.
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 24 -> 25 -> 26 -> 27 -> 28

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 24. Social Image Data Contract | v1.5 | 1/1 | Complete   | 2026-06-21 |
| 25. Deterministic Static Image Generation | v1.5 | 3/3 | Complete    | 2026-06-21 |
| 26. Metadata Wiring and Static References | v1.5 | 1/2 | In Progress|  |
| 27. Freshness Reports and Reviewed Snapshot Policy | v1.5 | 0/TBD | Not started | - |
| 28. Verification and Release Contract | v1.5 | 0/TBD | Not started | - |

## Archived Milestones

<details open>
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

Run `/gsd-plan-phase 24` to plan the Social Image Data Contract phase.
