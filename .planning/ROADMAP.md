# Roadmap: Bright Builds Portfolio Website

## Overview

This roadmap moves from a reproducible static SolidJS foundation to an authoritative curated content model, then renders the portfolio as semantic static pages with SEO metadata before adding the restrained Bright Builds visual layer. Optional GitHub metadata enrichment comes last, after the static curated model and no-runtime-API guarantee are already true, followed by release verification.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Static App Foundation & UI Shell** - Establish the SolidJS static-first app, tooling scripts, Tailwind/Mystic setup, and pure-module seams. (completed 2026-05-24)
- [x] **Phase 01.1: Dark-Primary Visual Rule and Shell Refactor** (INSERTED) - Make dark-primary UI a repo rule and refactor the current shell before content-model work. (completed 2026-05-25)
- [ ] **Phase 2: Curated Content Model** - Make typed curated project/profile data the source of truth and prove the site is not a raw GitHub mirror.
- [ ] **Phase 3: Portfolio Surfaces & SEO** - Render identity, project, about, contact, OpenLinks, and metadata surfaces from the curated registry.
- [ ] **Phase 4: Visual System & Motion** - Apply the polished Bright Builds visual language, Mystic adapters, and restrained motion with accessibility gates.
- [ ] **Phase 5: GitHub Enrichment & Release Verification** - Add optional static GitHub metadata enrichment and prove the release is shippable.

## Phase Details

### Phase 1: Static App Foundation & UI Shell

**Goal**: Developer can run and verify a SolidJS static-first portfolio shell with the intended tooling, pinned styling stack, prerender proof, and testable pure-module boundaries.
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04
**Success Criteria** (what must be TRUE):

1. Developer can run documented Bun scripts for local dev, build, typecheck, format-check, lint/check, and tests.
1. Developer can prove the SolidJS/SolidStart app emits prerendered HTML for all current indexable base routes.
1. Developer can use Tailwind CSS 3.x with Mystic UI pinned to commit `d36017757708ed01ef2b3b47beb14f294726411c` through the supported consumer setup.
1. Developer can unit test route, project, profile, and SEO derivation modules without DOM, network, or framework runtime.

**Plans**: 2/2 plans complete
**UI hint**: yes

### Phase 01.1: Dark-Primary Visual Rule and Shell Refactor (INSERTED)

**Goal:** Developer can rely on a documented dark-primary site rule and visitors see the current shell as a polished dark-first experience before content-model work continues.
**Requirements**: DARK-01
**Depends on:** Phase 1
**Plans:** 1/1 plans complete
**UI hint**: yes
**Success Criteria** (what must be TRUE):

1. Repo-local guidance states the portfolio is dark-primary, `.dark` must be active by default, and light-first classes require justification.
1. The static document renders `<html class="dark">`, dark `color-scheme`, and dark browser theme color before user interaction.
1. Current home, about, projects, and contact routes use dark-first shared styling for shell, cards, links, chips, focus states, and text.
1. Developer can verify desktop and mobile dark rendering, contrast/readability, no obvious text overlap, and no console errors.

Plans:
- [x] 01.1-01-PLAN.md

### Phase 2: Curated Content Model

**Goal**: Developer has an authoritative typed registry for project/profile/site content, with validation rules that keep flagship placement curated and static content independent from live GitHub calls.
**Depends on**: Phase 01.1
**Requirements**: CUR-01, CUR-02, CUR-03, CUR-05, GH-01
**Success Criteria** (what must be TRUE):

1. Developer can define curated projects with explicit tier, source type, maturity, inclusion flags, display order, themes, tags, role, links, and authored one-line copy.
1. Developer is blocked or warned when home/flagship records lack authored copy, curation reason, original-work status, useful links, or maturity/status information.
1. Developer can keep forks, repros, playgrounds, generated/profile/support repos, and unreviewed prototypes out of flagship/home placement unless explicitly promoted with a documented reason.
1. Developer can maintain an initial curated set reviewing OpenLinks, Free The World, Win3Bitco.in / Open Bitcoin Web Miner, Open Bitcoin, opencode-cloud, Zeckendorf, Mystic UI, and selected supporting experiments without surfacing all public GitHub repos.
1. Visitor-critical portfolio content can render from checked-in registry or static snapshot data without any live browser GitHub API call.

**Plans**: TBD

### Phase 3: Portfolio Surfaces & SEO

**Goal**: Visitors can understand Peter's identity and current work, browse curated project surfaces, find collaboration paths, and receive meaningful static SEO/social metadata before hydration.
**Depends on**: Phase 2
**Requirements**: PROF-01, PROF-02, PROF-03, PROF-04, CUR-04, EXP-01, EXP-02, EXP-03, EXP-04, SEO-01, SEO-02, SEO-03, SEO-04, SEO-05
**Success Criteria** (what must be TRUE):

1. Visitor immediately identifies Peter Ryszkiewicz / pRizz, Bright Builds, and the portfolio focus on AI, Bitcoin, open systems, developer tooling, and practical experiments without seeing unfinished template residue.
1. Visitor can read an about/themes narrative and find current collaboration/contact paths, including GitHub and a low-intrusion OpenLinks identity hub placement.
1. Visitor can browse 4-6 flagship project presentations plus a project index or equivalent surface that clearly separates flagship/supporting work from lab, prototype, writing, archive, and hidden/excluded work.
1. Visitor can open meaningful project URLs or stable anchors with headings, metadata, links, related context, and a concise current-focus surface for active bets when content is ready.
1. Developer can inspect generated HTML and see route-specific titles, descriptions, canonical URLs, Open Graph/Twitter basics, JSON-LD, sitemap/robots, icon assets, and social preview support before client hydration.

**Plans**: TBD
**UI hint**: yes

### Phase 4: Visual System & Motion

**Goal**: Visitors get a polished Bright Builds-inspired experience with restrained reactive motion, stable responsive layouts, and full accessibility fallbacks.
**Depends on**: Phase 3
**Requirements**: EXP-05, MOTION-01, MOTION-02, MOTION-03, MOTION-04, MOTION-05
**Success Criteria** (what must be TRUE):

1. Visitor can navigate desktop and mobile layouts without text overlap, layout jumps, or hover-only access to important content.
1. Visitor sees a polished visual design inspired by the current Bright Builds tone and motion without copying unfinished template content.
1. Visitor on capable devices can experience restrained reactive/physics effects around non-essential visual elements or project interactions.
1. Visitor using reduced motion, keyboard navigation, coarse pointer, small viewport, hidden tab, or low-power conditions can still use the full site without non-essential motion.
1. Developer can verify animation loops, listeners, observers, Mystic UI usage, and motion utilities stay cleaned up and isolated from the domain/content model.

**Plans**: TBD
**UI hint**: yes

### Phase 5: GitHub Enrichment & Release Verification

**Goal**: Developer can optionally enrich curated records with static GitHub metadata and prove the production site is accessible, performant, SEO-valid, token-safe, documented, and ready to release.
**Depends on**: Phase 4
**Requirements**: GH-02, GH-03, GH-04, VER-01, VER-02, VER-03, VER-04, VER-05
**Success Criteria** (what must be TRUE):

1. Developer can optionally refresh GitHub metadata for curated repos at build/manual-sync time with pagination, token-safe environment handling, and static snapshot fallback.
1. Curated records can show stars, forks, language, topics, pushed date, archived/fork/template flags, and homepage URLs without overriding authored copy or curation decisions.
1. Build/release checks prove production bundles do not expose GitHub tokens or forbidden token names.
1. Developer can run release checks covering pure unit behavior, browser flows, accessibility, reduced motion, static output, no critical runtime GitHub dependency, performance/SEO, layout stability, and primary links.
1. Project docs record local setup, build/deploy assumptions, curation maintenance rules, and how to refresh GitHub metadata when the optional sync exists.

**Plans**: TBD

## Requirement Coverage

Mapped: 38/38 v1 requirements.
Unmapped: 0.
Duplicate mappings: 0.

| Phase | Requirements |
|-------|--------------|
| 1. Static App Foundation & UI Shell | FOUND-01, FOUND-02, FOUND-03, FOUND-04 |
| 01.1. Dark-Primary Visual Rule and Shell Refactor | DARK-01 |
| 2. Curated Content Model | CUR-01, CUR-02, CUR-03, CUR-05, GH-01 |
| 3. Portfolio Surfaces & SEO | PROF-01, PROF-02, PROF-03, PROF-04, CUR-04, EXP-01, EXP-02, EXP-03, EXP-04, SEO-01, SEO-02, SEO-03, SEO-04, SEO-05 |
| 4. Visual System & Motion | EXP-05, MOTION-01, MOTION-02, MOTION-03, MOTION-04, MOTION-05 |
| 5. GitHub Enrichment & Release Verification | GH-02, GH-03, GH-04, VER-01, VER-02, VER-03, VER-04, VER-05 |

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 01.1 -> 2 -> 3 -> 4 -> 5.

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Static App Foundation & UI Shell | 2/2 | Complete | 2026-05-24 |
| 01.1. Dark-Primary Visual Rule and Shell Refactor | 1/1 | Complete | 2026-05-25 |
| 2. Curated Content Model | 0/TBD | Not started | - |
| 3. Portfolio Surfaces & SEO | 0/TBD | Not started | - |
| 4. Visual System & Motion | 0/TBD | Not started | - |
| 5. GitHub Enrichment & Release Verification | 0/TBD | Not started | - |
