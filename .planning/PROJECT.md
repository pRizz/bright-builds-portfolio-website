# Bright Builds Portfolio Website

## What This Is

This is a performant, statically generated portfolio website for Peter Ryszkiewicz that showcases a curated view of Peter's GitHub work, writing, technical identity, and ways to collaborate. It should feel like a more polished successor to the current Bright Builds site: fun, reactive, and experimental, while replacing template content with accurate project and profile substance.

The site is for technical peers, OSS collaborators, founder-adjacent builders, and people interested in Peter's work across AI, Bitcoin, open systems, developer tooling, and practical web/software experiments.

## Core Value

Help visitors quickly understand what Peter builds, why it matters, and which projects are worth exploring or collaborating on.

## Current State

v1.2 shipped on 2026-06-03 as the Project Story Pages milestone. Selected flagship projects now have typed detail-page story data, deterministic `/projects/{slug}` routes, prerendered static HTML, readable narrative pages, route-specific metadata, SoftwareSourceCode JSON-LD, sitemap coverage, and explicit project-detail release coverage across static, browser, and release-readiness checks.

v1.3 Phase 17 completed on 2026-06-14. The site now has a typed checked-in writing registry, public `/writing` and `/writing/{slug}` static routes, selected-project writing cross-links, helper-derived route metadata, BlogPosting and ItemList JSON-LD, sitemap coverage, static social preview fallback verification, and explicit writing route release coverage across browser, static, release-readiness, release-label, and aggregate clean-builder gates.

v1.3 Phase 18 completed on 2026-06-16. The static verifier now keeps its existing `verify:static` CLI contract through a thin entrypoint while route text, generated HTML, metadata/JSON-LD, sitemap, robots, asset, and forbidden-output assertions live in focused import-safe TypeScript modules with targeted regression coverage.

The current release is verified by `bun run install:browser && bun run verify` on clean builders. The aggregate gate covers formatting, Biome checks, TypeScript, Vitest, curated-content validation, no visitor-runtime GitHub usage, project helper surface imports, visual-system guards, production build, browser checks, writing and project route coverage, static output verification, and release verification over `.output/public`.

## Current Milestone: v1.3 Writing & Notes Surface

**Goal:** Give visitors a curated, static way to read Peter's technical thinking and move between notes and related projects.

**Target features:**

- Typed checked-in writing/notes registry with curated entries.
- `/writing` index plus static `/writing/{slug}` note routes.
- Bidirectional project/note links so project pages can point to related writing and notes can point back to related projects.
- Route-specific metadata, JSON-LD, sitemap coverage, and release verification for writing routes.
- Dark-primary responsive UI with browser/accessibility/reduced-motion coverage in the aggregate gate.

## Requirements

### Validated

- [x] [Phase 2] Project content now has an authoritative typed curated registry for flagship, supporting, lab, concept, hidden, and archived work, with authored copy, curation reasons, reviewed links, and selector helpers.
- [x] [Phase 2] Runtime-critical portfolio content renders from checked-in data, and aggregate verification blocks curation errors plus visitor-path GitHub API or token usage before build.
- [x] [Phase 3] Visitors can identify Peter Ryszkiewicz / pRizz, Bright Builds, current focus areas, curated project groups, about themes, and GitHub/OpenLinks/Bright Builds contact paths from prerendered static routes.
- [x] [Phase 3] Route-specific metadata, JSON-LD, sitemap, robots, icon assets, and a checked-in social preview image are generated or verified from pure helpers before hydration.
- [x] [Phase 4] The portfolio has a polished dark-primary Bright Builds visual layer using local brand material, stable responsive surfaces, and no unfinished template residue.
- [x] [Phase 4] Restrained reactive motion is isolated to UI-layer helpers, gated for reduced motion/coarse pointer/small viewport/hidden tab/save-data, and verified for cleanup and domain purity.
- [x] [Phase 5] Curated records can optionally render static GitHub metadata from direct repository links and a checked-in snapshot without overriding authored copy or introducing visitor-runtime GitHub dependencies.
- [x] [Phase 5] Release readiness is proven by aggregate checks for unit behavior, static output, accessibility hooks, reduced motion, token safety, browser-flow evidence, documentation, and deployment assumptions.
- [x] [Phase 6] v1.1 turns recorded browser/accessibility evidence into repeatable release verification for the shipped static portfolio surfaces.
- [x] [Phase 7] v1.1 defines a release-readiness contract for accessibility, SEO, performance, external links, and Cloudflare/static deployment assumptions.
- [x] [Phase 8] v1.1 removes stale seed-era helper exports and guards runtime/build-time source against reintroducing undocumented project helper dependencies.
- [x] [Phase 9] v1.1 closes the clean-builder release gate by documenting and checking explicit Playwright Chromium provisioning before aggregate verification.
- [x] [Phase 10] v1.2 establishes selected project detail route foundations from typed curated data, prerenders six stable `/projects/{slug}` routes, and verifies eligibility, exclusions, and initial metadata derivation.
- [x] [Phase 11] v1.2 turns selected project detail routes into readable story pages with narrative sections, proof points, GitHub facts, action links, and detail-aware home/project-index navigation.
- [x] [Phase 12] v1.2 gives selected project detail routes route-specific metadata, SoftwareSourceCode JSON-LD, sitemap coverage, and a deterministic checked-in social preview fallback.
- [x] [Phase 13] v1.2 makes project detail route coverage explicit across static verification, browser release checks, release-readiness docs, release evidence labels, and the aggregate clean-builder gate.
- [x] [Phase 14] v1.3 establishes validated writing domain data, public writing helper contracts, selected-project related-writing integrity, and curation-gate coverage without runtime content dependencies.
- [x] [Phase 15] v1.3 gives visitors dark-primary static `/writing` index and `/writing/{slug}` detail routes with authored entries, related project links, fallback behavior, responsive dark UI, and route-derived prerendering.
- [x] [Phase 16] v1.3 gives writing routes helper-derived static metadata, BlogPosting/ItemList JSON-LD, route-derived sitemap coverage, and checked-in social-preview fallback verification without runtime image generation.
- [x] [Phase 17] v1.3 gives writing routes explicit release verification and release-contract coverage across aggregate gates, browser evidence, static checks, release-readiness docs, and truthful automated evidence labels.
- [x] [Phase 18] v1.3 splits static verification into focused repo-owned TypeScript modules while preserving `verify:static`, helper-derived writing/project/generated-output coverage, and the aggregate release gate.

### Active

- [ ] [Future] Decide whether richer project-specific raster Open Graph images or content operations should follow after the writing surface.
- [ ] [Future] Evaluate whether large release verifier modules need a maintenance split before the next release-gate expansion.

### Out of Scope

- Building a raw GitHub profile mirror for all public repositories - too much noise, many repos are forks, prototypes, repros, or playgrounds.
- Copying the current Bright Builds template content verbatim - the existing site is unfinished and includes non-authoritative placeholder content.
- Creating a full CMS or admin UI in v1 - curated data files are enough for a personal static portfolio.
- Heavy 3D scenes or motion that materially harms performance, accessibility, or mobile usability - physics should feel fun, not expensive.
- Migrating or deeply refactoring Mystic UI during the first portfolio pass unless a blocking consumer bug appears.
- Adding backend services, authentication, dashboards, or analytics pipelines in v1 - static delivery is the target.

## Context

Peter's public GitHub profile presents him as an agentic engineer in Chicago building free, open source, decentralized tools across AI, Bitcoin, and the web. The profile already highlights themes around user ownership, open coordination, open systems, Bitcoin, AI, and practical software that expands agency.

The GitHub account currently has many public repositories, including actively updated original projects, forks, reproductions, templates, playgrounds, and old experiments. The portfolio should treat GitHub as source material, not as an unfiltered truth source. The first pass should use an explicit curated project registry with room for GitHub-derived metadata.

The current site at `https://www.brightbuilds.us/` gives useful style signals: bold identity-first layout, kinetic/reactive feel, high-contrast portfolio energy, and a willingness to be playful. It also contains obvious template residue, including placeholder selected works, designer-oriented copy, and inaccurate experience entries. Those pieces must not be treated as requirements.

Mystic UI is owned by Peter and is the preferred SolidJS component source for this stack when it fits. Its README describes a Vite + SolidJS + Tailwind consumer path, source-shipped components, Tailwind setup helpers, class-based dark mode, `solid-js@^1.9.8`, and the need to pin the GitHub dependency to an exact commit SHA. At initialization, the latest inspected `pRizz/mystic-ui` main commit was `d36017757708ed01ef2b3b47beb14f294726411c` from 2026-03-24.

Bright Builds repo instructions require the Bright Builds Rules workflow, including plan-first work for non-trivial changes, evidence-based verification, append-only planning/task artifacts, functional-core/imperative-shell architecture, repo-native verification, TypeScript/JavaScript guidance, and use of the OpenLinks identity-presence skill for website profile/footer/metadata surfaces owned by `pRizz`.

v1.0 shipped with 6 phases, 14 plans, 40 recorded tasks, 38 completed requirements, and milestone audit status `tech_debt` with no functional blockers. v1.1 shipped with 4 phases, 4 plans, 13 recorded tasks, 15 completed requirements, and milestone audit status `passed`. v1.2 shipped with 4 phases, 4 plans, 9 recorded tasks, 19 completed requirements, and milestone audit status `passed`.

v1.3 starts from the approved Writing & Notes Surface scope, prioritizing a small curated static writing layer before richer social-image generation or CMS/admin tooling.

## Constraints

- **Tech stack**: Use SolidJS / SolidStart-style static generation or the closest stable SolidJS static build path - the site should be fast, SEO-friendly, and simple to deploy as static output.
- **UI library**: Prefer Mystic UI for SolidJS components and styling primitives where compatible - it is locally owned and aligned with the Bright Builds TypeScript/SolidJS standard.
- **Dependency pinning**: Pin `pRizz/mystic-ui` to an exact GitHub commit SHA when adopted - the fork is not an npm-published package contract.
- **Content quality**: Curate and write original project copy - do not trust placeholder template content or automatically surface every repo.
- **Performance**: Physics effects must degrade cleanly for reduced motion, low-power devices, and mobile viewports.
- **Accessibility**: Interactive and motion-heavy elements need keyboard, reduced-motion, contrast, and text layout checks.
- **SEO**: Pages need meaningful metadata, structured project content, canonical links, Open Graph/Twitter card basics, sitemap/robots where appropriate, and human-readable project pages or anchors.
- **Workflow**: Use GSD planning artifacts and commit planning docs as part of the repo history.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Primary audience is collaborators and technical peers | The site should explain what Peter builds and invite collaboration around open-source, AI, Bitcoin, and open systems work. | Phase 3 validated identity, current-focus, project, about, and contact surfaces. |
| Curated showcase over raw GitHub mirror | Peter has many public repos, including forks, prototypes, repros, and playgrounds; unfiltered mirroring would weaken the portfolio. | Phase 2 validated a typed curated registry and no-runtime-GitHub guard. |
| Playful restraint for motion | Physics should echo the Bright Builds feel while keeping the site fast, readable, and accessible. | Phase 4 validated CSS-first visual polish plus a cleanup-safe UI-only reactive helper with accessibility fallbacks. |
| SolidJS static site with Mystic UI where practical | User requested SolidJS, static generation, SEO, and reuse of owned Mystic UI components. | Phase 1 established the SolidStart/Tailwind/Mystic static foundation; Phase 3 and 4 verified generated static output. |
| OpenLinks gets subtle identity placement | Repo-owner guidance requires OpenLinks identity presence on website profile/footer/metadata surfaces without displacing the portfolio brand. | Phase 3 and 4 preserve OpenLinks in footer/about/contact and metadata while keeping Bright Builds and project CTAs primary. |
| GitHub metadata stays advisory and static | Optional repository metadata should add useful facts without becoming a live dependency or curation authority. | Phase 5 validated a checked-in snapshot, direct-repo-only enrichment, safe homepage links, no runtime GitHub API calls, and token-safe release gates. |
| Release readiness is repo-native | A static portfolio release should be proven by repeatable local checks and recorded browser evidence rather than deployment-side assumptions. | Phase 5 validated aggregate `bun run verify`, static/release verifiers, documentation, and desktop/mobile/reduced-motion browser evidence. |
| Curated helper surface is intentional | Seed-era helper aliases made the data module's supported API ambiguous. | Phase 8 removed `projectSeeds`, `primaryProjectLink`, and `featuredProjects`, documented supported selectors, and added `verify:project-helper-surface` to `bun run verify`. |
| Clean builders provision browsers explicitly | Playwright browser binaries are an environment prerequisite and should not be hidden in broad lifecycle hooks. | Phase 9 added `bun run install:browser`, documented `bun run install:browser && bun run verify`, and guarded those facts in release-readiness tests. |
| Project pages come before a writing surface | The portfolio's core value is best improved next by explaining selected projects in depth before adding a broader notes/blog area. | v1.2 scopes deep project story routes, metadata, navigation, and verification while deferring writing/notes and CMS/admin features. |
| Detail route selection is typed and curated | v1.2 should deepen selected project stories without becoming a raw repo mirror or exposing hidden/unselected records. | Phase 10 added `detail` story data and `projectDetailPageProjects()` as the public selector for selected detail routes. |
| Story links prefer detail pages when available | Selected project cards should move visitors from overview to story depth without breaking anchors for unselected records. | Phase 11 added `projectStoryHref()` and uses it on home and project-index project links. |
| Project metadata stays static and curated | Project detail routes need sharing metadata without dynamic OG endpoints, runtime GitHub dependencies, or visible identity repetition. | Phase 12 added `projectJsonLd()`, default sitemap coverage for selected detail routes, and static social preview fallback verification while preserving OpenLinks through profile `sameAs` metadata. |
| Project detail release coverage derives from route helpers | Release checks should track selected project detail routes without duplicating route lists or claiming hosted/live checks. | Phase 13 derives representative browser checks from `projectDetailRoutes()`, keeps exhaustive axe/layout loops on `prerenderRoutes`, and adds release-readiness facts plus `project detail route coverage` evidence. |
| Writing comes after project story depth | Project pages now explain the work; the next core-value improvement is showing the thinking behind the work. | v1.3 scopes a curated static writing and notes surface with project cross-links while deferring CMS/admin and dynamic OG/server work. |
| Writing domain stays static and validated before routes | Downstream writing routes, metadata, and release checks need trustworthy data before UI consumes it. | Phase 14 adds `curatedWriting`, public writing selectors, related project resolution, structured validation, and `verify:curation` integration while deferring route/UI/metadata/release expansion to Phases 15-17. |
| Writing route UI stays dark-primary and static | Writing should extend the portfolio without adding CMS/runtime fetches or weakening the established dark design system. | Phase 15 adds the `/writing` index, public detail pages, related project cross-links, non-leaking fallback, and responsive dark UI checks. |
| Writing discovery metadata derives from helper contracts | Static writing pages need crawler/social metadata without route-level duplication, runtime image generation, or duplicated OpenLinks promotion. | Phase 16 adds `metadataForWritingEntry()`, `writingBlogPostingJsonLd()`, `writingItemListJsonLd()`, static verifier coverage, and social fallback reuse through profile/SEO helpers. |
| Writing release coverage stays local and truthful | The release contract should prove writing route coverage without claiming hosted audits, live-link crawling, or manual checks as automated evidence. | Phase 17 adds helper-derived writing browser checks, release-readiness document guards, exact primary identity link checks, `writing route coverage` evidence labels, and clean-builder aggregate verification. |
| Static verifier logic is modularized by concern | The v1.3 audit identified `scripts/verify-static.ts` as maintainability debt after writing and project coverage accumulated in one oversized file. | Phase 18 reduces the CLI to a thin entrypoint and moves output, route text, HTML, metadata/JSON-LD, sitemap/assets/robots, and residue checks into focused import-safe modules with targeted tests. |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):

1. Requirements invalidated? -> Move to Out of Scope with reason
1. Requirements validated? -> Move to Validated with phase reference
1. New requirements emerged? -> Add to Active
1. Decisions to log? -> Add to Key Decisions
1. "What This Is" still accurate? -> Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):

1. Full review of all sections
1. Core Value check - still the right priority?
1. Audit Out of Scope - reasons still valid?
1. Update Context with current state

______________________________________________________________________

*Last updated: 2026-06-16 after Phase 18 completion*
