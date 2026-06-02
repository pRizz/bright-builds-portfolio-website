# Bright Builds Portfolio Website

## What This Is

This is a performant, statically generated portfolio website for Peter Ryszkiewicz that showcases a curated view of Peter's GitHub work, writing, technical identity, and ways to collaborate. It should feel like a more polished successor to the current Bright Builds site: fun, reactive, and experimental, while replacing template content with accurate project and profile substance.

The site is for technical peers, OSS collaborators, founder-adjacent builders, and people interested in Peter's work across AI, Bitcoin, open systems, developer tooling, and practical web/software experiments.

## Core Value

Help visitors quickly understand what Peter builds, why it matters, and which projects are worth exploring or collaborating on.

## Current State

v1.1 shipped on 2026-06-01 as a release-confidence pass over the v1.0 static SolidStart portfolio. The site now has repeatable browser/accessibility automation, explicit clean-builder release/deploy readiness gates, and an intentional curated project helper surface with guardrails against seed-era helper imports.

Phase 10 of v1.2 completed on 2026-06-02. Selected flagship projects now have typed detail-page story data, deterministic `/projects/{slug}` route helpers, and prerendered static route foundations while unselected projects stay excluded.

Phase 11 of v1.2 completed on 2026-06-02. Selected project cards now link into readable project story pages with authored narrative, proof points, GitHub snapshot facts, and clear project actions.

Phase 12 of v1.2 completed on 2026-06-02. Selected project detail routes now have route-specific metadata, SoftwareSourceCode JSON-LD, sitemap coverage, and deterministic static social preview fallback verification.

The current release is verified by `bun run install:browser && bun run verify` on clean builders. The aggregate gate covers formatting, Biome checks, TypeScript, Vitest, curated-content validation, no visitor-runtime GitHub usage, project helper surface imports, visual-system guards, production build, browser checks, static output verification, and release verification over `.output/public`.

## Current Milestone: v1.2 Project Story Pages

**Goal:** Turn curated project cards into deep, shareable static project pages with stronger narrative, metadata, and collaboration paths.

**Target features:**

- Per-project static routes for selected flagship and supporting projects.
- Rich project storytelling covering problem, why it matters, technical shape, current status, links, and collaboration angle.
- Route-specific SEO, JSON-LD, sitemap entries, canonical metadata, and project-specific Open Graph image/card support.
- Home and project-index navigation that moves visitors naturally from overview cards to project detail pages.
- Verification that project pages remain static, dark-primary, accessible, no-overlap, and covered by the existing clean-builder release gate.

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

### Active

- [ ] [v1.2] Existing release verification covers the new project routes for static output, accessibility, visual layout, and deploy readiness.

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

v1.0 shipped with 6 phases, 14 plans, 40 recorded tasks, 38 completed requirements, and milestone audit status `tech_debt` with no functional blockers. v1.1 shipped with 4 phases, 4 plans, 13 recorded tasks, 15 completed requirements, and milestone audit status `passed`. v1.2 starts from the approved Project Story Pages scope, prioritizing deeper project narratives before a separate writing surface or CMS/admin tooling.

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

*Last updated: 2026-06-02 after Phase 12 completion*
