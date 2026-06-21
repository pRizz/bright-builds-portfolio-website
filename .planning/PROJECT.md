# Bright Builds Portfolio Website

## What This Is

This is a performant, statically generated portfolio website for Peter Ryszkiewicz that showcases a curated view of Peter's GitHub work, writing, technical identity, durable technical themes, and ways to collaborate. It should feel like a polished successor to the current Bright Builds site: fun, reactive, and experimental, while replacing template content with accurate project and profile substance.

The site is for technical peers, OSS collaborators, founder-adjacent builders, and people interested in Peter's work across AI, Bitcoin, open systems, developer tooling, and practical web/software experiments.

## Core Value

Help visitors quickly understand what Peter builds, why it matters, and which projects are worth exploring or collaborating on.

## Current State

v1.0 shipped the SolidStart static shell, curated project/profile registry, dark-primary visual system, route and SEO helpers, restrained motion, static GitHub metadata enrichment, and aggregate release verification.

v1.1 shipped repeatable browser and accessibility release checks, release-readiness documentation, helper-surface cleanup, and explicit clean-builder Playwright Chromium provisioning.

v1.2 shipped selected project story pages with typed detail data, deterministic `/projects/{slug}` routes, route-specific metadata, SoftwareSourceCode JSON-LD, sitemap coverage, and release checks.

v1.3 shipped the Writing & Notes Surface: typed checked-in writing data, public `/writing` and `/writing/{slug}` static routes, project-writing cross-links, helper-derived metadata, BlogPosting and ItemList JSON-LD, sitemap coverage, static social-preview fallback verification, explicit writing route release coverage, and modular static verification helpers.

v1.4 shipped on 2026-06-20 as the Theme Paths & Collaboration Surface milestone. The site now has typed checked-in theme domain data, public `/themes` and `/themes/{slug}` static routes, theme proof points, related project and writing links, helper-derived collaboration actions, reciprocal theme links on project and writing detail pages, route metadata, structured data, sitemap inclusion/exclusion, static social-preview fallback checks, browser coverage, and explicit theme route release evidence.

The current release is verified by `bun run install:browser && bun run verify` on clean builders. The aggregate gate covers formatting, Biome checks, TypeScript, Vitest, curated-content validation, no visitor-runtime GitHub usage, project helper surface imports, visual-system guards, production build, browser checks, writing/project/theme route coverage, static output verification over `.output/public`, and final release verification through `bun run verify:release`. Automated release evidence labels cover only local checks that actually run; Cloudflare/static deployment, preview, post-deploy, and external-link smoke checks remain manual release checklist obligations.

## Current Milestone: v1.5 Static Shareability & Freshness

**Goal:** Make every project, writing, and theme route share cleanly with deterministic static social preview assets and keep public-facing metadata fresh without runtime services.

**Target features:**

- Route-derived social image data for project, writing, and theme surfaces.
- Deterministic static raster social preview generation with no server endpoints or runtime image generation.
- Metadata wiring so each public route references the correct static preview asset.
- Non-flaky freshness/report automation for reviewed GitHub metadata, primary links, and generated media where it can run without weakening the static deployment contract.
- Release verification that proves generated images, route metadata, static output, and evidence labels are truthful.

## Requirements

### Validated

- [x] v1.0 established the static portfolio foundation, curated content model, identity/project/about/contact surfaces, dark-primary visual layer, restrained motion helpers, optional checked-in GitHub metadata enrichment, SEO assets, and aggregate release verification.
- [x] v1.1 turned browser/accessibility evidence, deploy assumptions, helper-surface rules, and clean-builder browser provisioning into repeatable release gates.
- [x] v1.2 added selected project detail story routes with project-specific metadata, JSON-LD, sitemap coverage, route navigation, and release verification.
- [x] v1.3 added a static writing surface with validated writing data, public writing routes, project-writing relationships, writing metadata/JSON-LD, sitemap coverage, release checks, and modular static verification.
- [x] [Phase 19] v1.4 establishes typed theme domain data, public theme helper contracts, selected-project/public-writing relationship resolution, and curation-gate validation for unknown, unsupported, hidden, or unpublished references.
- [x] [Phase 20] v1.4 gives visitors dark-primary static `/themes` and `/themes/{slug}` routes that synthesize public theme records, proof points, related projects, and related writing, with helper-derived prerendering, non-leaking fallback behavior, and automated static/browser verification.
- [x] [Phase 21] v1.4 gives visitors theme-aware collaboration paths and reciprocal project/writing theme links without weakening the static deployment model or making OpenLinks the primary call to action.
- [x] [Phase 22] v1.4 gives theme routes route-specific metadata, structured data, sitemap coverage, and checked-in static social-preview fallback verification.
- [x] [Phase 23] v1.4 gives theme routes explicit static, browser, release-readiness, evidence-label, and aggregate verification coverage.

### Active

- [ ] [v1.5] Public project, writing, and theme routes can use deterministic static social preview images derived from curated route data.
- [ ] [v1.5] Crawlers and social previews can read route-specific metadata that points to the correct static preview image without dynamic Open Graph endpoints.
- [ ] [v1.5] Maintainers can run freshness checks or reviewed reports for selected metadata, primary links, and generated media without introducing visitor-runtime fetches or flaky release gates.
- [ ] [v1.5] Release verification proves social image assets, metadata references, generated static output, and evidence labels without overclaiming hosted or manual checks.

### Out of Scope

- Building a raw GitHub profile mirror for all public repositories - too much noise, many repos are forks, prototypes, repros, or playgrounds.
- Copying the current Bright Builds template content verbatim - the existing site is unfinished and includes non-authoritative placeholder content.
- Creating a full CMS or admin UI in v1 - curated data files are enough for a personal static portfolio.
- Heavy 3D scenes or motion that materially harms performance, accessibility, or mobile usability - physics should feel fun, not expensive.
- Migrating or deeply refactoring Mystic UI during the first portfolio pass unless a blocking consumer bug appears.
- Adding backend services, authentication, dashboards, analytics pipelines, comments, newsletters, dynamic Open Graph endpoints, or live external-link reachability automation in v1 - static delivery remains the target.
- Prominent OpenLinks promotion in theme navigation or primary CTAs - OpenLinks stays discoverable as a low-intrusion identity hub while Bright Builds, projects, writing, and collaboration context remain primary.

## Context

Peter's public GitHub profile presents him as an agentic engineer in Chicago building free, open source, decentralized tools across AI, Bitcoin, and the web. The profile highlights themes around user ownership, open coordination, open systems, Bitcoin, AI, and practical software that expands agency.

The GitHub account has many public repositories, including actively updated original projects, forks, reproductions, templates, playgrounds, and older experiments. The portfolio treats GitHub as source material, not as an unfiltered truth source. Curated checked-in project, writing, and theme registries are authoritative for visitor-facing content.

The current site at `https://www.brightbuilds.us/` gives useful style signals: bold identity-first layout, kinetic/reactive feel, high-contrast portfolio energy, and a willingness to be playful. It also contains obvious template residue, including placeholder selected works, designer-oriented copy, and inaccurate experience entries. Those pieces must not be treated as requirements.

Mystic UI is owned by Peter and is the preferred SolidJS component source for this stack when it fits. Its README describes a Vite + SolidJS + Tailwind consumer path, source-shipped components, Tailwind setup helpers, class-based dark mode, `solid-js@^1.9.8`, and the need to pin the GitHub dependency to an exact commit SHA. At initialization, the latest inspected `pRizz/mystic-ui` main commit was `d36017757708ed01ef2b3b47beb14f294726411c` from 2026-03-24.

Bright Builds repo instructions require the Bright Builds Rules workflow, including plan-first work for non-trivial changes, evidence-based verification, append-only planning/task artifacts, functional-core/imperative-shell architecture, repo-native verification, TypeScript/JavaScript guidance, and use of the OpenLinks identity-presence skill for website profile/footer/metadata surfaces owned by `pRizz`.

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
| Curated showcase over raw GitHub mirror | Peter has many public repos, including forks, prototypes, repros, and playgrounds; unfiltered mirroring would weaken the portfolio. | Checked-in project, writing, and theme registries stay authoritative for visitor-facing content. |
| Static SolidJS portfolio with Mystic UI where practical | The site needs fast static output, SEO, and reuse of owned SolidJS/Tailwind components. | SolidStart, Tailwind, dark-primary classes, and selective Mystic-compatible primitives remain the default stack. |
| OpenLinks gets subtle identity placement | OpenLinks is useful identity infrastructure but should not displace the portfolio brand or project/story CTAs. | Footer/profile/contact/metadata surfaces preserve OpenLinks while theme collaboration panels keep Bright Builds, projects, writing, and source links primary. |
| GitHub metadata stays advisory and static | Optional repository metadata should add useful facts without becoming a live dependency or curation authority. | Direct-repo snapshots enrich checked-in curated records, and release gates block visitor-runtime GitHub usage. |
| Domain route helpers drive generated surfaces | Duplicated route lists create drift across rendering, sitemap, metadata, browser checks, and static verification. | Project, writing, and theme route helpers drive prerendering, sitemap output, browser coverage, and release checks. |
| Writing comes after project story depth | Project pages explain the work; writing explains the thinking behind it. | v1.3 shipped a curated static writing surface with project cross-links and release coverage. |
| Theme paths synthesize existing surfaces | Projects and writing are strong individually; visitors need a durable path into the work by theme and collaboration angle. | v1.4 shipped static theme paths over existing project and writing registries while deferring CMS/admin, analytics, dynamic OG, and runtime content fetches. |
| Theme collaboration actions stay helper-derived | Collaboration CTAs must not introduce unreviewed external-link sources or live reachability claims. | Theme panels derive reviewed source, live, writing, GitHub, and OpenLinks actions from existing curated data. |
| Release evidence labels stay truthful | Automated labels should name only local checks that actually run. | Theme route coverage is named in static/browser/release evidence; preview, deployed, external-link, and hosted checks remain manual release checklist items. |
| Static social previews over dynamic OG endpoints | Project, writing, and theme routes now have stable helper-derived content; share assets can be generated deterministically without adding server behavior. | v1.5 scopes static raster social previews and metadata wiring while keeping the static deployment model intact. |
| Freshness reports before live release gates | Broken-link and metadata freshness automation is useful, but live external checks can be flaky and network-dependent. | v1.5 may add reviewed reports or scheduled/manual checks, but local release evidence must not claim hosted or live-network verification unless it actually runs reliably. |

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

*Last updated: 2026-06-21 after starting v1.5 milestone*
