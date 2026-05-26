# Phase 03: Portfolio Surfaces & SEO - Research

**Researched:** 2026-05-26 [VERIFIED: environment_context]
**Domain:** SolidStart static portfolio surfaces, curated content rendering, static SEO metadata, structured data, and public assets [VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-CONTEXT.md]
**Confidence:** HIGH [VERIFIED: local source audit][CITED: docs.solidjs.com/solid-start/building-your-application/head-and-metadata][CITED: docs.solidjs.com/solid-start/building-your-application/route-prerendering]

<user_constraints>
## User Constraints (from CONTEXT.md)

The following constraints are copied from `.planning/phases/03-portfolio-surfaces-seo/03-CONTEXT.md`; provenance for this block is [VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-CONTEXT.md].

### Locked Decisions

## Implementation Decisions

### Identity and Narrative Surfaces

- **D-01:** Make the home page identity-first: Peter Ryszkiewicz / pRizz, Bright Builds, and
  the focus on AI, Bitcoin, open systems, developer tooling, and practical experiments should be
  visible in the first content block.
- **D-02:** Use authored profile data as the source for headline, summary, focus areas, and
  collaboration links. Do not introduce generic skill bars, fake experience entries, or copied
  Bright Builds template copy.
- **D-03:** The about surface should explain the connective themes across agentic engineering,
  open source, Bitcoin/decentralized systems, web tooling, and creative experiments with concise
  editorial copy rather than a resume-style page.
- **D-04:** Keep the current dark-primary rule. New UI should use shared dark-first classes and
  avoid light-first utility exceptions unless a specific element requires them.

### Project Story Presentation

- **D-05:** Use the Phase 2 curated registry as the authoritative source for project surfaces.
  Home should feature 4-6 flagship stories; `/projects` should separate flagship, supporting,
  lab/prototype, archive, and hidden/excluded work through placement and labels.
- **D-06:** Each flagship presentation should show problem, approach, role, status/maturity,
  why-it-matters copy, themes/tags, and useful links when the registry has enough data.
- **D-07:** Use stable project anchors on `/projects` in Phase 3 instead of creating separate
  per-project routes. The anchor URL format should be `/projects#${project.slug}` and each
  anchor target needs a meaningful heading and metadata text. Separate project routes can be
  reconsidered after richer detail copy or per-project OG images are ready.
- **D-08:** Include a concise current-focus surface for active bets such as OpenLinks, Free The
  World, Win3Bitco.in / Open Bitcoin Web Miner, Open Bitcoin, and opencode-cloud when content is
  available from the registry. Keep it editorial and useful, not a raw repo mirror.

### Collaboration and OpenLinks Identity

- **D-09:** Make contact/collaboration paths easy to find through the contact route and footer,
  prioritizing GitHub and OpenLinks while keeping Bright Builds as the host brand.
- **D-10:** Follow the OpenLinks identity-presence guidance in subtle/standard mode: visible
  footer/about/contact placement first, `rel="me noopener noreferrer"` on self-owned identity
  links, and JSON-LD `Person.sameAs` where the site already emits structured data.
- **D-11:** Do not make OpenLinks the primary site CTA or repeat it aggressively in nearby
  surfaces. It should read as Peter's identity hub and a featured project, not as the whole
  portfolio brand.

### Static SEO and Metadata

- **D-12:** Keep metadata derivation in pure TypeScript modules. Route titles, descriptions,
  canonical URLs, Open Graph basics, Twitter card basics, JSON-LD, sitemap entries, and robots
  output should derive from route/profile/project data rather than duplicated literals in every
  route component.
- **D-13:** Emit JSON-LD for Peter as a `Person`, and add project structured data or an
  `ItemList` for curated project surfaces where enough data exists.
- **D-14:** Add `sitemap.xml`, `robots.txt`, favicon/touch/icon assets, and one useful static
  social preview asset for the current site. Keep Phase 3 to one strong preview asset; per-project
  OG generation belongs to a later phase.
- **D-15:** Extend static verification so generated HTML proves route-specific metadata and
  meaningful identity/project content exist before hydration.

### the agent's Discretion

- Exact route component boundaries, local component names, CSS class names, and helper names are
  up to the agent as long as pure domain modules stay framework-free.
- The agent may decide whether the flagship and current-focus presentations are separate
  components or route-local sections.
- The agent may choose the exact social preview asset implementation, provided it is checked in,
  referenced by metadata, and works in static output.
- The agent may add focused unit tests and static verification checks where they give the best
  regression protection for Phase 3.

### Deferred Ideas (OUT OF SCOPE)

## Deferred Ideas

- Separate per-project routes and per-project Open Graph images.
- Search/filtering across a larger project archive.
- Optional GitHub metadata refresh, static snapshots, and token-safe sync tooling.
- Advanced Bright Builds reactive physics, motion cleanup checks, and visual-system polish.
- Full release browser/a11y/performance suite beyond the focused Phase 3 static and smoke checks.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| PROF-01 | Visitor can immediately identify Peter Ryszkiewicz / pRizz, the Bright Builds context, and the portfolio's focus on AI, Bitcoin, open systems, developer tooling, and practical experiments. [VERIFIED: .planning/REQUIREMENTS.md] | Use `peterProfile` plus `siteRoutes` for identity-first route copy and make the first home block include the required identity terms. [VERIFIED: src/domain/profile.ts][VERIFIED: src/domain/routes.ts][VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-UI-SPEC.md] |
| PROF-02 | Visitor can read an about/themes section that connects Peter's work across agentic engineering, open source, Bitcoin/decentralized systems, web tooling, and creative experiments. [VERIFIED: .planning/REQUIREMENTS.md] | Extend `/about` from profile focus areas into concise editorial theme sections, without adding resume-style content. [VERIFIED: src/routes/about.tsx][VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-CONTEXT.md] |
| PROF-03 | Visitor can find current collaboration/contact paths, including GitHub and a low-intrusion OpenLinks identity hub placement. [VERIFIED: .planning/REQUIREMENTS.md] | Continue rendering contact cards from `peterProfile.links`, preserve GitHub/OpenLinks priority, and keep OpenLinks visible but secondary. [VERIFIED: src/domain/profile.ts][VERIFIED: src/routes/contact.tsx][VERIFIED: /Users/peterryszkiewicz/.codex/skills/openlinks-identity-presence/SKILL.md] |
| PROF-04 | Visitor does not see unfinished template residue, fake case studies, generic skill bars, or inaccurate placeholder experience/content from the current Bright Builds site. [VERIFIED: .planning/REQUIREMENTS.md] | Add static verification for forbidden placeholder/template phrases and do not add fake metrics, skill bars, or copied template text. [VERIFIED: scripts/verify-static.ts][VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-UI-SPEC.md] |
| CUR-04 | Visitor can distinguish flagship, supporting, experiment/lab, writing, archived, and excluded/project-hidden work through clear data-driven labels or placement. [VERIFIED: .planning/REQUIREMENTS.md] | Group `/projects` by `ProjectPlacement`/`ProjectTier` selectors and render hidden/excluded only as counts or notes, not public cards. [VERIFIED: src/domain/projects.ts][VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-UI-SPEC.md] |
| EXP-01 | Visitor can browse 4-6 flagship project presentations with manually written problem, approach, role, status, key links, and why-it-matters copy. [VERIFIED: .planning/REQUIREMENTS.md] | `homeProjects()` returns six flagship stories today, but the registry lacks separate `problem`, `approach`, and `whyItMatters` fields, so planning must add display fields or derive route copy from existing authored fields without inventing unsupported claims. [VERIFIED: src/domain/projects.ts][VERIFIED: src/routes/index.tsx] |
| EXP-02 | Visitor can browse a project index or equivalent project surface that separates flagship/supporting work from lab/prototype/archive items. [VERIFIED: .planning/REQUIREMENTS.md] | Replace the current flat `visibleProjects()` list with ordered groups: Flagship, Supporting, Lab / Prototype, Archive. [VERIFIED: src/routes/projects.tsx][VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-UI-SPEC.md] |
| EXP-03 | Visitor can open project detail surfaces or stable project anchors with meaningful URLs, headings, metadata, links, and related project/writing context. [VERIFIED: .planning/REQUIREMENTS.md] | Use `/projects#${project.slug}` anchors on `article id={project.slug}` with heading text, `scroll-margin-top`, and internal links from home/current-focus surfaces. [VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-CONTEXT.md][VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-UI-SPEC.md] |
| EXP-04 | Visitor can discover a concise "now building" or current-focus surface for active bets such as OpenLinks, Free The World, Win3Bitco.in / Open Bitcoin Web Miner, Open Bitcoin, and opencode-cloud when content is ready. [VERIFIED: .planning/REQUIREMENTS.md] | Select current-focus records from the curated registry by slug/status and keep the surface editorial rather than a raw repo list. [VERIFIED: src/domain/projects.ts][VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-CONTEXT.md] |
| SEO-01 | Each indexable route has static, route-specific title, description, canonical URL, Open Graph basics, and Twitter card basics. [VERIFIED: .planning/REQUIREMENTS.md] | Extend `metadataForRoute` and route head usage so `/`, `/about`, `/projects`, and `/contact` all emit title, description, canonical, OG, Twitter, and image metadata in generated HTML. [VERIFIED: src/domain/seo.ts][VERIFIED: .output/public/*.html][CITED: docs.solidjs.com/solid-start/building-your-application/head-and-metadata] |
| SEO-02 | The site emits or maintains `sitemap.xml`, `robots.txt`, favicon/touch/icon assets, and at least one useful social preview image. [VERIFIED: .planning/REQUIREMENTS.md] | Put stable public assets under `public/` and generate or maintain `public/sitemap.xml` and `public/robots.txt` from route/profile data. [CITED: docs.solidjs.com/solid-start/building-your-application/static-assets][VERIFIED: src/domain/routes.ts][VERIFIED: src/domain/profile.ts] |
| SEO-03 | The site includes structured data for Peter as a `Person` and for flagship project detail surfaces where enough data exists. [VERIFIED: .planning/REQUIREMENTS.md] | Keep `personJsonLd()` and add a `/projects` `ItemList` JSON-LD derived from visible curated projects. [VERIFIED: src/domain/seo.ts][CITED: schema.org/Person][CITED: schema.org/ItemList][CITED: developers.google.com/search/docs/appearance/structured-data/intro-structured-data] |
| SEO-04 | Production build verification proves meaningful content and metadata exist in generated HTML before client hydration. [VERIFIED: .planning/REQUIREMENTS.md] | Extend `scripts/verify-static.ts` to assert route HTML, metadata tags, JSON-LD, anchors, public files, asset references, and forbidden residue after `bun run build`. [VERIFIED: scripts/verify-static.ts][VERIFIED: package.json][VERIFIED: bun run build output] |
| SEO-05 | OpenLinks appears as a visible identity link and, when cleanly supported, as `rel="me"` and/or JSON-LD `sameAs` metadata without becoming the primary portfolio brand. [VERIFIED: .planning/REQUIREMENTS.md] | Preserve visible footer/contact/about identity placement, `rel="me noopener noreferrer"` for self-owned identity links, and `Person.sameAs` inclusion. [VERIFIED: src/components/SiteLayout.tsx][VERIFIED: src/domain/profile.ts][VERIFIED: /Users/peterryszkiewicz/.codex/skills/openlinks-identity-presence/references/surface-patterns.md] |
</phase_requirements>

## Summary

Phase 3 should be planned as a data-driven rendering and static-output phase, not as a new stack or motion phase. [VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-CONTEXT.md][VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-UI-SPEC.md] The current app already has a SolidStart static preset, four prerendered routes, typed profile/project/route/SEO modules, and passing baseline unit/static checks. [VERIFIED: app.config.ts][VERIFIED: src/domain/*.ts][VERIFIED: bun run test][VERIFIED: bun run build][VERIFIED: bun run verify:static]

The main implementation work should extend existing pure domain helpers, then use thin Solid route components to render richer home/about/projects/contact surfaces and metadata. [VERIFIED: src/domain/seo.ts][VERIFIED: src/routes/index.tsx][CITED: /Users/peterryszkiewicz/Repos/coding-and-architecture-requirements/standards/core/architecture.md] `@solidjs/meta` remains the correct head-management path for route-specific title, meta, and canonical tags in SolidStart. [CITED: docs.solidjs.com/solid-start/building-your-application/head-and-metadata][VERIFIED: package.json]

The planner should allocate explicit work for static assets and verification because those are current gaps. [VERIFIED: rg static-output audit] The generated HTML currently proves route content and home metadata, but `/about`, `/projects`, and `/contact` do not yet emit full OG/Twitter metadata, no generated output contains `og:image`, `twitter:image`, `robots`, `sitemap`, favicon/touch icon links, `ItemList`, or `id="openlinks"` project anchors, and the current home CTA text is `View projects` instead of the UI contract's `Browse projects`. [VERIFIED: .output/public/*.html][VERIFIED: src/routes/index.tsx][VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-UI-SPEC.md]

**Primary recommendation:** Use the existing SolidStart + `@solidjs/meta` + pure `src/domain/*` stack, add deterministic public assets and sitemap/robots generation, group project surfaces from the curated registry, and extend `scripts/verify-static.ts` until every Phase 3 SEO/content promise is proven in `.output/public` before hydration. [VERIFIED: package.json][VERIFIED: src/domain/projects.ts][VERIFIED: scripts/verify-static.ts][CITED: docs.solidjs.com/solid-start/building-your-application/static-assets]

## Project Constraints (from AGENTS.md)

- `AGENTS.md` is the repo-local entrypoint, and Bright Builds sidecar guidance plus standards overrides and relevant canonical standards must be read before planning or implementation work. [VERIFIED: AGENTS.md][VERIFIED: AGENTS.bright-builds.md][VERIFIED: standards-overrides.md][VERIFIED: /Users/peterryszkiewicz/Repos/coding-and-architecture-requirements/standards/index.md]
- The portfolio is dark-primary, `.dark` should be active on the root document, and new UI should prefer shared dark-first classes. [VERIFIED: AGENTS.md][VERIFIED: src/styles/app.css][VERIFIED: .output/public/index.html]
- Light-first utility classes such as `bg-white`, `bg-stone-50`, and `text-zinc-950` require a clear local reason. [VERIFIED: AGENTS.md]
- UI changes require desktop and mobile dark-rendering checks, contrast/readability checks, and text-overlap checks. [VERIFIED: AGENTS.md][VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-UI-SPEC.md]
- GSD workflow enforcement says file-changing work should start through a GSD entry point unless the user explicitly bypasses it. [VERIFIED: AGENTS.md]
- The active JavaScript/TypeScript package manager is Bun, and `package.json` pins `packageManager` to `bun@1.3.14`. [VERIFIED: package.json]
- Bright Builds standards require functional-core/imperative-shell structure, pure business/domain logic, repo-native verification, and unit tests for pure/business logic. [VERIFIED: /Users/peterryszkiewicz/Repos/coding-and-architecture-requirements/standards/core/architecture.md][VERIFIED: /Users/peterryszkiewicz/Repos/coding-and-architecture-requirements/standards/core/testing.md][VERIFIED: /Users/peterryszkiewicz/Repos/coding-and-architecture-requirements/standards/core/verification.md]
- TypeScript/JavaScript standards prefer Bun for new standalone TS/JS work, Mystic UI for SolidJS UI-library choices, composition over inheritance, data-in/data-out business logic, and `maybe` naming for nullish internal values. [VERIFIED: /Users/peterryszkiewicz/Repos/coding-and-architecture-requirements/standards/languages/typescript-javascript.md]
- Owner-specific guidance requires the OpenLinks identity-presence skill for website chrome, about/profile/footer/contact, and metadata surfaces owned by `pRizz`; the placement should be low-intrusion and should not displace the host brand. [VERIFIED: AGENTS.bright-builds.md][VERIFIED: /Users/peterryszkiewicz/.codex/skills/openlinks-identity-presence/SKILL.md][VERIFIED: /Users/peterryszkiewicz/.codex/skills/openlinks-identity-presence/references/surface-patterns.md]
- No project-local `.claude/skills/` or `.agents/skills/` skill indexes were found during this research pass. [VERIFIED: find .claude/skills .agents/skills]

## Standard Stack

### Core

| Library / Tool | Version | Purpose | Why Standard |
|----------------|---------|---------|--------------|
| Bun | `packageManager` pin `1.3.14`; local CLI `1.3.9` | Package manager and script runner. [VERIFIED: package.json][VERIFIED: bun --version] | Existing repo scripts run through Bun, and Bright Builds TS guidance prefers Bun for this project shape. [VERIFIED: package.json][VERIFIED: /Users/peterryszkiewicz/Repos/coding-and-architecture-requirements/standards/languages/typescript-javascript.md] |
| SolidStart | `@solidjs/start@1.3.2`, published 2026-02-24 | Static-first meta-framework and build surface. [VERIFIED: package.json][VERIFIED: npm registry] | The project already uses SolidStart `defineConfig` with `server.preset: "static"` and explicit `prerender.routes`. [VERIFIED: app.config.ts][CITED: docs.solidjs.com/solid-start/building-your-application/route-prerendering][CITED: docs.solidjs.com/solid-start/reference/config/define-config] |
| SolidJS | `solid-js@1.9.13`, published 2026-05-15 | UI runtime. [VERIFIED: package.json][VERIFIED: npm registry] | Existing route and component code is Solid TSX. [VERIFIED: src/routes/index.tsx][VERIFIED: src/components/SiteLayout.tsx] |
| `@solidjs/meta` | `0.29.4`, published 2024-05-15 | Route head tags: `Title`, `Meta`, `Link`, and `MetaProvider`. [VERIFIED: package.json][VERIFIED: npm registry][VERIFIED: node_modules/@solidjs/meta/dist/index.d.ts] | SolidStart docs identify `@solidjs/meta` as the library for customizing route head content. [CITED: docs.solidjs.com/solid-start/building-your-application/head-and-metadata] |
| Tailwind CSS | `tailwindcss@3.4.19`, published 2025-12-10 | Dark-first utility styling and shared component classes. [VERIFIED: package.json][VERIFIED: npm registry] | Tailwind `darkMode: "selector"` is configured and maps to `.dark` in the HTML tree. [VERIFIED: tailwind.config.ts][CITED: v3.tailwindcss.com/docs/dark-mode] |
| Mystic UI | `github:pRizz/mystic-ui#d36017757708ed01ef2b3b47beb14f294726411c` | Theme and Solid-compatible styling primitives. [VERIFIED: package.json] | The repo imports Mystic theme CSS and uses `withMysticUI` in Tailwind config. [VERIFIED: src/styles/app.css][VERIFIED: tailwind.config.ts] |
| TypeScript | `typescript@6.0.3`, published 2026-04-16 | Static typing for domain helpers, route metadata, scripts, and tests. [VERIFIED: package.json][VERIFIED: npm registry] | `bun run typecheck` is part of the aggregate verify script. [VERIFIED: package.json] |

### Supporting

| Library / Tool | Version | Purpose | When to Use |
|----------------|---------|---------|-------------|
| Vitest | `4.1.7`, published 2026-05-20 | Unit tests for pure route/profile/project/SEO derivation. [VERIFIED: package.json][VERIFIED: npm registry] | Add focused tests for metadata images, `ItemList`, sitemap/robots text, project grouping, and current-focus selectors. [VERIFIED: src/domain/foundation.test.ts][VERIFIED: src/domain/project-validation.test.ts] |
| Biome | `@biomejs/biome@2.4.15`, published 2026-05-09 | Formatting and lint/check workflow. [VERIFIED: package.json][VERIFIED: npm registry] | Run `bun run format:check` and `bun run check` before implementation completion. [VERIFIED: package.json][VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-UI-SPEC.md] |
| ImageMagick | local `7.1.2-16` | Optional local generation and dimension verification for PNG social/icon assets. [VERIFIED: magick --version][VERIFIED: identify --version] | Use for one checked-in `1200x630` social preview and icon PNG generation if the implementation does not use a preexisting raster asset. [VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-UI-SPEC.md] |
| `sips` | macOS system tool available at `/usr/bin/sips` | Fallback raster image query/resize tool. [VERIFIED: command -v sips][VERIFIED: sips -h] | Use only as a local fallback for image conversion or inspection; do not make CI/build depend on it without documenting the host requirement. [VERIFIED: sips -h][VERIFIED: package.json] |
| SolidStart public directory | source path `public/` | Stable static asset paths such as `/robots.txt`, `/sitemap.xml`, `/favicon.svg`, `/icon-192.png`, `/apple-touch-icon.png`, and `/social/bright-builds-og.png`. [CITED: docs.solidjs.com/solid-start/building-your-application/static-assets] | Use for static metadata files and image assets because SolidStart serves public assets at paths relative to `public/`. [CITED: docs.solidjs.com/solid-start/building-your-application/static-assets] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Route-level `@solidjs/meta` tags | Custom DOM/head manipulation | Do not use custom head manipulation because SolidStart docs identify `@solidjs/meta` for route-specific metadata and the app already has `MetaProvider`. [CITED: docs.solidjs.com/solid-start/building-your-application/head-and-metadata][VERIFIED: src/app.tsx] |
| Static `/projects#slug` anchors | Separate per-project routes | Do not add per-project routes in Phase 3 because stable anchors are a locked decision and per-project routes/OG images are deferred. [VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-CONTEXT.md] |
| Checked-in/generated public assets | Dynamic OG image endpoint or server route | Do not add a server endpoint because Phase 3 targets static output and one checked-in preview asset. [VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-CONTEXT.md][CITED: docs.solidjs.com/solid-start/building-your-application/static-assets] |
| Curated registry selectors | Runtime GitHub API calls | Do not use runtime GitHub API calls because Phase 2 locked visitor-critical content to checked-in data and the no-runtime-GitHub guard exists. [VERIFIED: .planning/phases/02-curated-content-model/02-CONTEXT.md][VERIFIED: scripts/verify-no-github-runtime.ts] |
| Focused static/smoke checks | Full Playwright/axe/Lighthouse release suite | Do not add the full release browser/a11y/performance suite in Phase 3 because the user explicitly scoped that to later work. [VERIFIED: user additional_context][VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-CONTEXT.md] |

**Installation:**

No new npm packages are required for the recommended Phase 3 plan. [VERIFIED: package.json][VERIFIED: local source audit]

**Version verification:**

| Package | Verified Version | Published | Registry Source |
|---------|------------------|-----------|-----------------|
| `@solidjs/start` | `1.3.2` | 2026-02-24T21:13:42.558Z | [VERIFIED: npm registry] |
| `solid-js` | `1.9.13` | 2026-05-15T17:36:58.458Z | [VERIFIED: npm registry] |
| `@solidjs/meta` | `0.29.4` | 2024-05-15T15:14:56.977Z | [VERIFIED: npm registry] |
| `vinxi` | `0.5.11` | 2026-01-19T20:25:28.292Z | [VERIFIED: npm registry] |
| `tailwindcss` | `3.4.19` | 2025-12-10T18:40:42.410Z | [VERIFIED: npm registry] |
| `vitest` | `4.1.7` | 2026-05-20T07:19:42.142Z | [VERIFIED: npm registry] |
| `@biomejs/biome` | `2.4.15` | 2026-05-09T17:08:10.962Z | [VERIFIED: npm registry] |
| `typescript` | `6.0.3` | 2026-04-16T23:38:27.905Z | [VERIFIED: npm registry] |

## Architecture Patterns

### Recommended Project Structure

```text
public/                         # Static files served at root paths by SolidStart. [CITED: docs.solidjs.com/solid-start/building-your-application/static-assets]
  favicon.svg                   # Phase 3 favicon asset. [VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-UI-SPEC.md]
  icon-192.png                  # Phase 3 touch/icon asset. [VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-UI-SPEC.md]
  apple-touch-icon.png          # Phase 3 Apple touch icon. [VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-UI-SPEC.md]
  robots.txt                    # Generated or maintained from route/profile data. [VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-CONTEXT.md]
  sitemap.xml                   # Generated or maintained from siteRoutes/prerenderRoutes. [VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-UI-SPEC.md]
  social/
    bright-builds-og.png        # Single 1200x630 social preview image. [VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-UI-SPEC.md]
src/
  components/
    SiteLayout.tsx              # Header/footer shell and low-intrusion OpenLinks footer placement. [VERIFIED: src/components/SiteLayout.tsx]
    ProjectCard.tsx             # Recommended small local component if route files become crowded. [VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-UI-SPEC.md]
  domain/
    profile.ts                  # Peter identity, focus areas, links, and sameAs source. [VERIFIED: src/domain/profile.ts]
    projects.ts                 # Curated project stories and selectors. [VERIFIED: src/domain/projects.ts]
    routes.ts                   # Route registry and prerender route list. [VERIFIED: src/domain/routes.ts]
    seo.ts                      # Page metadata, JSON-LD, social image, sitemap/robots helpers. [VERIFIED: src/domain/seo.ts]
  routes/
    index.tsx                   # Identity-first home and flagship/current-focus surfaces. [VERIFIED: src/routes/index.tsx]
    about.tsx                   # Concise themes narrative. [VERIFIED: src/routes/about.tsx]
    projects.tsx                # Grouped project index and stable anchors. [VERIFIED: src/routes/projects.tsx]
    contact.tsx                 # Profile-link contact cards. [VERIFIED: src/routes/contact.tsx]
scripts/
  generate-static-metadata.ts   # Recommended deterministic public-file writer if sitemap/robots are generated. [VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-CONTEXT.md]
  verify-static.ts              # Static HTML, metadata, and public asset proof. [VERIFIED: scripts/verify-static.ts]
```

### Pattern 1: Pure Metadata Derivation, Thin Route Head

**What:** Keep route metadata, social preview image metadata, and JSON-LD construction in `src/domain/seo.ts`; route components should only call helpers and render tags. [VERIFIED: src/domain/seo.ts][CITED: /Users/peterryszkiewicz/Repos/coding-and-architecture-requirements/standards/core/architecture.md]

**When to use:** Use this pattern for every indexable route in Phase 3. [VERIFIED: .planning/REQUIREMENTS.md][VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-CONTEXT.md]

**Example:**

```tsx
// Source: SolidStart head docs and current repo metadata pattern.
// [CITED: docs.solidjs.com/solid-start/building-your-application/head-and-metadata]
// [VERIFIED: src/routes/index.tsx][VERIFIED: src/domain/seo.ts]
const route = routeByPath("/projects");
const metadata = metadataForRoute(route);

<Title>{metadata.title}</Title>
<Meta name="description" content={metadata.description} />
<HeadLink rel="canonical" href={metadata.canonical} />
<Meta property="og:title" content={metadata.openGraph.title} />
<Meta property="og:description" content={metadata.openGraph.description} />
<Meta property="og:url" content={metadata.openGraph.url} />
<Meta property="og:type" content={metadata.openGraph.type} />
<Meta property="og:image" content={metadata.openGraph.image.url} />
<Meta property="og:image:width" content={`${metadata.openGraph.image.width}`} />
<Meta property="og:image:height" content={`${metadata.openGraph.image.height}`} />
<Meta property="og:image:alt" content={metadata.openGraph.image.alt} />
<Meta name="twitter:card" content={metadata.twitter.card} />
<Meta name="twitter:title" content={metadata.twitter.title} />
<Meta name="twitter:description" content={metadata.twitter.description} />
<Meta name="twitter:image" content={metadata.twitter.image.url} />
<Meta name="twitter:image:alt" content={metadata.twitter.image.alt} />
```

### Pattern 2: Project Grouping from Registry Selectors

**What:** Group projects by placement/tier in route code or a pure selector; do not hard-code project names in the route. [VERIFIED: src/domain/projects.ts][VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-CONTEXT.md]

**When to use:** Use on `/projects` and current-focus/home surfaces. [VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-UI-SPEC.md]

**Example:**

```ts
// Source: existing registry taxonomy and selector pattern.
// [VERIFIED: src/domain/projects.ts]
const projectSections = [
  { label: "Flagship", projects: projectsByPlacement("home") },
  { label: "Supporting", projects: projectsByPlacement("supporting") },
  { label: "Lab / Prototype", projects: projectsByPlacement("lab") },
  { label: "Archive", projects: projectsByPlacement("archive") },
];
```

### Pattern 3: Static Public Files from Route/Profile Data

**What:** Generate or maintain `public/sitemap.xml` and `public/robots.txt` from `siteRoutes`, `prerenderRoutes`, and `peterProfile.canonicalOrigin`. [VERIFIED: src/domain/routes.ts][VERIFIED: src/domain/profile.ts][CITED: www.sitemaps.org/protocol.html][CITED: developers.google.com/crawling/docs/robots-txt/create-robots-txt]

**When to use:** Use before `vinxi build` if the files are generated during the build workflow, or keep generated files checked in and verify they match domain helpers. [VERIFIED: package.json][VERIFIED: bun run build output]

**Example:**

```ts
// Source: sitemaps.org XML protocol and existing route/profile registries.
// [CITED: www.sitemaps.org/protocol.html][VERIFIED: src/domain/routes.ts][VERIFIED: src/domain/profile.ts]
export function sitemapXml(routes = siteRoutes, profile = peterProfile): string {
  const urls = routes
    .map((route) => {
      const loc = `${profile.canonicalOrigin}${route.path === "/" ? "" : route.path}`;
      return `  <url><loc>${escapeXml(loc)}</loc></url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}
```

### Pattern 4: JSON-LD Mirrors Visible Content

**What:** Use `Person` JSON-LD for Peter and `ItemList` JSON-LD for the visible `/projects` list, but keep structured data aligned with visible page content. [VERIFIED: src/domain/seo.ts][CITED: schema.org/Person][CITED: schema.org/ItemList][CITED: developers.google.com/search/docs/appearance/structured-data/intro-structured-data]

**When to use:** Use on home/about/contact for `Person` where useful, and on `/projects` for the project list. [VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-CONTEXT.md]

**Example:**

```ts
// Source: Schema.org ItemList properties and Google structured-data guidance.
// [CITED: schema.org/ItemList][CITED: developers.google.com/search/docs/appearance/structured-data/intro-structured-data]
export function projectsItemListJsonLd(projects = visibleProjects(), profile = peterProfile) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    url: `${profile.canonicalOrigin}/projects`,
    numberOfItems: projects.length,
    itemListElement: projects.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${profile.canonicalOrigin}/projects#${project.slug}`,
      name: project.name,
      description: project.oneLine,
    })),
  };
}
```

### Anti-Patterns to Avoid

- **Duplicating metadata literals in each route:** Duplicated route title/description/OG/Twitter literals violate D-12 and make static verification brittle. [VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-CONTEXT.md]
- **Adding per-project routes now:** Per-project routes and per-project OG images are deferred and would expand scope beyond locked Phase 3 decisions. [VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-CONTEXT.md]
- **Rendering hidden/excluded records as public cards:** Hidden/excluded work should stay hidden or appear only as aggregate/editorial context. [VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-UI-SPEC.md]
- **Metadata-only OpenLinks promotion:** The OpenLinks skill prefers visible link first and metadata second. [VERIFIED: /Users/peterryszkiewicz/.codex/skills/openlinks-identity-presence/references/surface-patterns.md]
- **Build-time dependence on untracked local image tools:** ImageMagick is available locally, but package scripts do not currently declare it as a dependency, so checked-in PNG outputs should be verified rather than regenerated implicitly on every build unless the requirement is documented. [VERIFIED: magick --version][VERIFIED: package.json]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Route head management | Custom DOM/head mutation or string-injected head HTML | `@solidjs/meta` `Title`, `Meta`, and `Link` components | SolidStart docs recommend `@solidjs/meta`, and the app already wraps routes in `MetaProvider`. [CITED: docs.solidjs.com/solid-start/building-your-application/head-and-metadata][VERIFIED: src/app.tsx] |
| Project data and ordering | Route-local arrays of project names | `curatedProjects`, `homeProjects()`, `visibleProjects()`, `projectsByPlacement()` | Phase 2 made the curated registry authoritative and test-covered. [VERIFIED: src/domain/projects.ts][VERIFIED: src/domain/foundation.test.ts][VERIFIED: src/domain/project-validation.test.ts] |
| Sitemap and robots content | Manual host/path literals scattered across files | Pure helper using `siteRoutes`, `prerenderRoutes`, and `peterProfile.canonicalOrigin` | D-12 requires route/profile-derived metadata outputs, and sitemap URLs must use one host and entity-escaped values. [VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-CONTEXT.md][CITED: www.sitemaps.org/protocol.html] |
| Social image metadata | Per-route image literals | Shared social image metadata in `metadataForRoute()` | Phase 3 has one static social preview asset, not per-project images. [VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-UI-SPEC.md] |
| GitHub enrichment | Browser/runtime calls to GitHub API or Octokit | Checked-in curated registry only | Phase 5 owns optional GitHub enrichment, and `verify:no-github-runtime` blocks visitor-path GitHub API/token mechanisms. [VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-CONTEXT.md][VERIFIED: scripts/verify-no-github-runtime.ts] |
| Full browser release suite | New Playwright/axe/Lighthouse dependency set | Focused static checks plus manual/in-app browser smoke verification | User scope keeps Phase 4 motion and Phase 5 release-wide browser suite out of Phase 3. [VERIFIED: user additional_context][VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-CONTEXT.md] |

**Key insight:** The deceptively complex part of Phase 3 is not rendering cards; it is keeping static HTML, metadata, structured data, public files, OpenLinks identity hints, and verification all derived from the same trusted domain data. [VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-CONTEXT.md][VERIFIED: src/domain/*.ts][VERIFIED: scripts/verify-static.ts]

## Common Pitfalls

### Pitfall 1: Home-Only SEO Coverage

**What goes wrong:** `/` currently emits OG/Twitter tags and `Person` JSON-LD, while `/about`, `/projects`, and `/contact` currently emit only title, description, and canonical tags. [VERIFIED: .output/public/index.html][VERIFIED: .output/public/about/index.html][VERIFIED: .output/public/projects/index.html][VERIFIED: .output/public/contact/index.html]

**Why it happens:** Metadata tags are hand-written per route today, so routes can drift from `metadataForRoute()`. [VERIFIED: src/routes/index.tsx][VERIFIED: src/routes/about.tsx][VERIFIED: src/routes/projects.tsx][VERIFIED: src/routes/contact.tsx]

**How to avoid:** Add a shared route head component or helper-render pattern that consumes the complete `PageMetadata` shape for every indexable route. [CITED: docs.solidjs.com/solid-start/building-your-application/head-and-metadata][VERIFIED: src/domain/seo.ts]

**Warning signs:** Static HTML search does not find `og:image`, `twitter:image`, or `og:title` on every indexable route. [VERIFIED: rg static-output audit]

### Pitfall 2: Public Asset Path Drift

**What goes wrong:** Metadata can reference `/social/bright-builds-og.png`, `/favicon.svg`, `/icon-192.png`, or `/apple-touch-icon.png` before those assets exist in static output. [VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-UI-SPEC.md][VERIFIED: rg static-output audit]

**Why it happens:** SolidStart serves `public/` assets at root paths, but the repo currently has no `public/` files. [CITED: docs.solidjs.com/solid-start/building-your-application/static-assets][VERIFIED: find public]

**How to avoid:** Add checked-in assets under `public/` and extend `verify-static` to assert file existence, dimensions for the social PNG, and metadata references. [VERIFIED: scripts/verify-static.ts][VERIFIED: command -v identify]

**Warning signs:** `find .output/public` does not show `robots.txt`, `sitemap.xml`, `favicon.svg`, icon PNGs, or `social/bright-builds-og.png`. [VERIFIED: find .output/public]

### Pitfall 3: Anchor URLs Without Anchor Targets

**What goes wrong:** `/projects#openlinks` URLs are specified by the phase but current project cards do not have stable `id` attributes. [VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-CONTEXT.md][VERIFIED: rg static-output audit]

**Why it happens:** The current `/projects` route renders a flat list from `visibleProjects()` without using `project.slug` as the DOM target. [VERIFIED: src/routes/projects.tsx]

**How to avoid:** Render `article id={project.slug}` with a heading and `scroll-margin-top` so sticky header navigation does not cover anchored content. [VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-UI-SPEC.md]

**Warning signs:** `rg 'id="openlinks"' .output/public/projects/index.html` returns no match after build. [VERIFIED: rg static-output audit]

### Pitfall 4: UI Contract Drift From Existing CSS

**What goes wrong:** The current CSS uses `tracking-[0.12em]`, `text-4xl`, `sm:text-6xl`, `text-lg`, and `text-2xl`, while the Phase 3 UI spec restricts typography to 14px, 16px, 20px, and 36px with letter spacing `0`. [VERIFIED: src/styles/app.css][VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-UI-SPEC.md]

**Why it happens:** Phase 01.1 created a dark-first shell before the Phase 3 UI contract existed. [VERIFIED: .planning/STATE.md][VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-UI-SPEC.md]

**How to avoid:** Include a CSS pass in Phase 3 that aligns shared classes with the UI spec, especially eyebrow letter spacing, display heading size, lead text size, section heading size, chip/card radius, and minimum touch targets. [VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-UI-SPEC.md][VERIFIED: src/styles/app.css]

**Warning signs:** `rg 'tracking-|text-4xl|text-6xl|text-lg|text-2xl' src/styles/app.css` still finds Phase 3 surface classes after implementation. [VERIFIED: rg source audit]

### Pitfall 5: JSON-LD That Outruns Visible Content

**What goes wrong:** Structured data can describe projects, roles, or claims that are not visible on the page. [CITED: developers.google.com/search/docs/appearance/structured-data/intro-structured-data]

**Why it happens:** JSON-LD is easy to generate from data fields that route UI does not render. [VERIFIED: src/domain/projects.ts][VERIFIED: src/domain/seo.ts]

**How to avoid:** Build `Person` and `ItemList` from the same profile/project fields that route components visibly render, and verify JSON-LD names/URLs match the static body content. [VERIFIED: src/domain/profile.ts][VERIFIED: src/domain/projects.ts][CITED: schema.org/ItemList]

**Warning signs:** `ItemList.itemListElement` includes slugs that do not appear as `/projects` anchor IDs or visible headings. [VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-UI-SPEC.md]

### Pitfall 6: OpenLinks Over-Promotion

**What goes wrong:** OpenLinks can accidentally become the primary CTA or repeat across nearby surfaces. [VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-CONTEXT.md][VERIFIED: /Users/peterryszkiewicz/.codex/skills/openlinks-identity-presence/references/surface-patterns.md]

**Why it happens:** OpenLinks is both a flagship project and an identity hub in this site. [VERIFIED: src/domain/projects.ts][VERIFIED: src/domain/profile.ts]

**How to avoid:** Use one low-intrusion footer placement, contact/about identity placement where useful, and `Person.sameAs`; keep `Browse projects` as the home primary CTA. [VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-UI-SPEC.md][VERIFIED: /Users/peterryszkiewicz/.codex/skills/openlinks-identity-presence/references/surface-patterns.md]

**Warning signs:** OpenLinks appears in header/nav as a primary CTA or repeats multiple times near the footer/contact cards. [VERIFIED: /Users/peterryszkiewicz/.codex/skills/openlinks-identity-presence/references/surface-patterns.md]

## Code Examples

### Shared Route Metadata Shape

```ts
// Source: existing metadata helper plus Phase 3 UI SEO contract.
// [VERIFIED: src/domain/seo.ts][VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-UI-SPEC.md]
export type SocialImageMetadata = {
  url: string;
  width: 1200;
  height: 630;
  alt: string;
};

export type PageMetadata = {
  title: string;
  description: string;
  canonical: string;
  openGraph: {
    title: string;
    description: string;
    url: string;
    type: "website";
    image: SocialImageMetadata;
  };
  twitter: {
    card: "summary_large_image";
    title: string;
    description: string;
    image: SocialImageMetadata;
  };
};
```

### Safe Static File Assertions

```ts
// Source: existing verify-static script pattern.
// [VERIFIED: scripts/verify-static.ts]
function assertOutputFile(root: string, path: string): void {
  const maybePath = join(root, path);

  if (existsSync(maybePath)) {
    return;
  }

  throw new Error(`Missing static output file: ${path}`);
}
```

### OpenLinks Contact Link

```tsx
// Source: current contact route, profile link data, and OpenLinks skill.
// [VERIFIED: src/routes/contact.tsx][VERIFIED: src/domain/profile.ts]
// [VERIFIED: /Users/peterryszkiewicz/.codex/skills/openlinks-identity-presence/references/snippets.md]
<a class="contact-card" href={link.href} rel={link.maybeRel} target="_blank">
  <span class="contact-label">{link.label}</span>
  <span class="contact-url">{link.href}</span>
</a>
```

### Reduced Motion CSS Guard

```css
/* Source: Tailwind reduced-motion docs and Phase 3 reduced-motion contract. */
/* [CITED: v3.tailwindcss.com/docs/hover-focus-and-other-states] */
/* [VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-UI-SPEC.md] */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| SolidStart without metadata helper assumptions | Use `@solidjs/meta` for route-specific `Title`, `Meta`, and `Link` tags | SolidStart docs last updated 2026-04-28 for head/metadata page | Plan route metadata through `@solidjs/meta`, not custom head code. [CITED: docs.solidjs.com/solid-start/building-your-application/head-and-metadata] |
| Tailwind `darkMode: "class"` naming | Tailwind 3.4 uses `darkMode: "selector"` and applies `dark:` utilities when `.dark` is present earlier in the HTML tree | Tailwind docs say selector replaced class strategy in v3.4.1 | Keep `darkMode: "selector"` and `.dark` root. [CITED: v3.tailwindcss.com/docs/dark-mode][VERIFIED: tailwind.config.ts][VERIFIED: .output/public/index.html] |
| Dynamic/server metadata endpoints | Static public assets and prerendered HTML | Phase 3 context locks static output and one checked-in social preview asset | Put metadata files/assets in `public/` and verify `.output/public`. [VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-CONTEXT.md][CITED: docs.solidjs.com/solid-start/building-your-application/static-assets] |
| Raw GitHub mirror project pages | Curated checked-in registry and static selectors | Phase 2 completed 2026-05-26 | Use registry fields and selectors for public surfaces. [VERIFIED: .planning/STATE.md][VERIFIED: src/domain/projects.ts] |

**Deprecated/outdated:**

- Using floating `mystic-ui` branches is out of contract because this repo pins the GitHub dependency to an exact SHA. [VERIFIED: package.json][VERIFIED: AGENTS.md]
- Adding runtime GitHub API calls for visitor-critical content is out of contract because `verify:no-github-runtime` blocks those mechanisms in `src/`. [VERIFIED: scripts/verify-no-github-runtime.ts][VERIFIED: .planning/phases/02-curated-content-model/02-CONTEXT.md]
- Treating `/projects` as a flat list is insufficient for CUR-04 and EXP-02 because Phase 3 requires grouped flagship/supporting/lab/archive presentation. [VERIFIED: .planning/REQUIREMENTS.md][VERIFIED: src/routes/projects.tsx]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| - | No `[ASSUMED]` claims were intentionally used in this research. [VERIFIED: source/provenance review] | All sections | No user confirmation is needed for assumed claims because none are present. [VERIFIED: source/provenance review] |

## Open Questions

1. **Should the local Bun CLI be upgraded before Phase 3 execution?** [VERIFIED: package.json][VERIFIED: bun --version]
   - What we know: `package.json` pins `bun@1.3.14`, but the local CLI is `1.3.9`, and `bun run test`, `bun run build`, and `bun run verify:static` passed during research. [VERIFIED: package.json][VERIFIED: bun --version][VERIFIED: bun run test][VERIFIED: bun run build][VERIFIED: bun run verify:static]
   - What's unclear: Whether the executor should upgrade local Bun or continue with the available CLI for this phase. [VERIFIED: environment audit]
   - Recommendation: Plan with a note that local Bun is usable but below the pinned version; do not make the phase depend on Bun 1.3.14-only behavior unless the executor upgrades first. [VERIFIED: environment audit]
2. **Should static metadata files be generated on every build or checked in after generation?** [VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-CONTEXT.md]
   - What we know: D-12 says sitemap and robots output should derive from route/profile/project data, and SolidStart serves `public/` files at stable root paths. [VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-CONTEXT.md][CITED: docs.solidjs.com/solid-start/building-your-application/static-assets]
   - What's unclear: The repo does not yet have a `prepare:static` or asset generation script. [VERIFIED: package.json][VERIFIED: find public]
   - Recommendation: Add pure helper functions plus either a `scripts/generate-static-metadata.ts` command in the build path or static verification that fails when checked-in public files drift from helper output. [VERIFIED: package.json][VERIFIED: scripts/verify-static.ts]
3. **How should the social preview PNG be authored?** [VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-UI-SPEC.md]
   - What we know: The UI contract requires `/social/bright-builds-og.png` at 1200x630 with dark background and Peter/Bright Builds/focus copy, and ImageMagick is available locally. [VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-UI-SPEC.md][VERIFIED: magick --version]
   - What's unclear: CI availability for ImageMagick is not established by repo scripts. [VERIFIED: package.json]
   - Recommendation: Check in the PNG and verify dimensions with `identify` when available; avoid adding an npm image dependency unless the executor needs deterministic CI regeneration. [VERIFIED: identify --version][VERIFIED: package.json]
4. **Should the UI-SPEC checker sign-off block be reconciled?** [VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-UI-SPEC.md]
   - What we know: UI-SPEC front matter says `status: approved`, and the user prompt says the UI design contract is approved, but the final checker sign-off block still says `Approval: pending`. [VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-UI-SPEC.md][VERIFIED: user additional_context]
   - What's unclear: Whether the pending line is stale template residue or a deliberate unresolved sign-off. [VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-UI-SPEC.md]
   - Recommendation: Treat the UI contract as approved for planning because the prompt and front matter say approved; optionally fix the sign-off line in a docs cleanup task if the planner includes planning-artifact hygiene. [VERIFIED: user additional_context][VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-UI-SPEC.md]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Bun | Package scripts, tests, build, verification | yes | Local `1.3.9`; pinned `1.3.14` | Continue with local CLI for Phase 3 unless a Bun-version-specific failure appears; upgrade if exact pin enforcement is required. [VERIFIED: bun --version][VERIFIED: package.json] |
| Node.js | npm registry verification and ecosystem compatibility | yes | `v24.13.0` | None needed for research; Bun remains script runner. [VERIFIED: node --version][VERIFIED: package.json] |
| npm CLI / registry | Package version verification | yes | Registry queries succeeded | None needed. [VERIFIED: npm view commands] |
| ImageMagick `magick` / `identify` | Optional PNG generation and dimension verification | yes | `7.1.2-16` | Use checked-in PNG and `file`/manual inspection if ImageMagick is unavailable elsewhere. [VERIFIED: magick --version][VERIFIED: identify --version][VERIFIED: command -v file] |
| macOS `sips` | Optional image fallback | yes | System help available | Prefer ImageMagick for PNG dimension checks because `identify` is available. [VERIFIED: command -v sips][VERIFIED: sips -h][VERIFIED: identify --version] |
| SolidStart static output | Static HTML verification | yes | `.output/public` generated by `bun run build` | `scripts/verify-static.ts` also checks `dist`, but this repo currently builds `.output/public`. [VERIFIED: bun run build output][VERIFIED: scripts/verify-static.ts] |

**Missing dependencies with no fallback:**

- None found for the recommended Phase 3 plan. [VERIFIED: environment audit]

**Missing dependencies with fallback:**

- Exact local Bun `1.3.14` is missing, but local Bun `1.3.9` executed current tests/build/static verification successfully. [VERIFIED: bun --version][VERIFIED: package.json][VERIFIED: bun run test][VERIFIED: bun run build][VERIFIED: bun run verify:static]

## Security Domain

Security enforcement is enabled by default because `.planning/config.json` does not set `security_enforcement: false`. [VERIFIED: .planning/config.json]

### Applicable ASVS Categories

The current OWASP ASVS 5.0 taxonomy uses categories such as Encoding and Sanitization, Validation and Business Logic, Web Frontend Security, API and Web Service, Authentication, Session Management, Authorization, Cryptography, Secure Communication, and Configuration. [CITED: cornucopia.owasp.org/taxonomy/asvs-5.0]

| ASVS Category | Applies | Standard Control |
|---------------|---------|------------------|
| 01 Encoding and Sanitization | yes | Keep user-visible strings as Solid text nodes, avoid raw HTML, and escape XML in sitemap output. [VERIFIED: src/routes/*.tsx][CITED: www.sitemaps.org/protocol.html][CITED: cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html] |
| 02 Validation and Business Logic | yes | Keep project/SEO derivation in pure functions and unit tests. [VERIFIED: src/domain/project-validation.ts][VERIFIED: src/domain/foundation.test.ts][VERIFIED: /Users/peterryszkiewicz/Repos/coding-and-architecture-requirements/standards/core/testing.md] |
| 03 Web Frontend Security | yes | Use `rel="noopener noreferrer"` on external `_blank` links and keep OpenLinks `rel="me"` only for identity links. [VERIFIED: src/domain/profile.ts][CITED: developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/noopener][VERIFIED: /Users/peterryszkiewicz/.codex/skills/openlinks-identity-presence/references/snippets.md] |
| 04 API and Web Service | no | Phase 3 is a static public portfolio surface and does not add APIs. [VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-CONTEXT.md] |
| 06 Authentication | no | Phase 3 does not add auth. [VERIFIED: .planning/REQUIREMENTS.md][VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-CONTEXT.md] |
| 07 Session Management | no | Phase 3 does not add sessions. [VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-CONTEXT.md] |
| 08 Authorization | no | Phase 3 does not add protected resources or role-based behavior. [VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-CONTEXT.md] |
| 11 Cryptography | no | Phase 3 does not add cryptographic operations. [VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-CONTEXT.md] |
| 12 Secure Communication | partial | Use HTTPS canonical URLs from `peterProfile.canonicalOrigin`; deployment transport policy is outside Phase 3 code scope. [VERIFIED: src/domain/profile.ts][VERIFIED: .planning/phases/03-portfolio-surfaces-seo/03-CONTEXT.md] |
| 13 Configuration | yes | Keep public metadata paths deterministic and prevent browser-exposed GitHub token mechanisms. [VERIFIED: scripts/verify-no-github-runtime.ts][VERIFIED: scripts/verify-static.ts] |

### Known Threat Patterns for SolidStart Static Portfolio

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Structured data/script injection from project/profile strings | Tampering | Only use checked-in curated data, avoid raw HTML, and escape `<` in JSON-LD serialization helpers if any field can contain arbitrary markup-like text. [VERIFIED: src/domain/projects.ts][CITED: developers.google.com/search/docs/appearance/structured-data/intro-structured-data][CITED: cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html] |
| Reverse tabnabbing from external links | Spoofing | Keep `rel="noopener noreferrer"` on external `_blank` links. [CITED: developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/noopener][VERIFIED: src/domain/profile.ts] |
| Browser-exposed GitHub tokens or runtime API drift | Information Disclosure | Keep `verify:no-github-runtime` in `bun run verify` and do not add Octokit/API calls in `src/`. [VERIFIED: scripts/verify-no-github-runtime.ts][VERIFIED: package.json] |
| Incorrect canonical/sitemap host | Spoofing | Derive canonical URLs and sitemap locations from `peterProfile.canonicalOrigin`. [VERIFIED: src/domain/profile.ts][VERIFIED: src/domain/seo.ts][CITED: www.sitemaps.org/protocol.html] |
| Broken social/icon asset references | Tampering | Verify public files exist in `.output/public` and metadata references point to those exact paths. [VERIFIED: scripts/verify-static.ts][CITED: docs.solidjs.com/solid-start/building-your-application/static-assets] |

## Sources

### Primary (HIGH confidence)

- `.planning/phases/03-portfolio-surfaces-seo/03-CONTEXT.md` - locked Phase 3 decisions, discretion, deferred scope, OpenLinks and SEO constraints. [VERIFIED: file read]
- `.planning/phases/03-portfolio-surfaces-seo/03-UI-SPEC.md` - approved Phase 3 UI/SEO/social/verification contract. [VERIFIED: file read]
- `.planning/REQUIREMENTS.md` - Phase 3 requirement descriptions and traceability. [VERIFIED: file read]
- `.planning/ROADMAP.md` - Phase 3 goal and success criteria. [VERIFIED: file read]
- `.planning/STATE.md` - Phase status and prior decisions. [VERIFIED: file read]
- `AGENTS.md`, `AGENTS.bright-builds.md`, `standards-overrides.md`, and Bright Builds standards at commit `05f8d7a6c9c2e157ec4f922a05273e72dab97676` - repo and canonical workflow/architecture/testing/verification constraints. [VERIFIED: file read][VERIFIED: git rev-parse]
- `/Users/peterryszkiewicz/.codex/skills/openlinks-identity-presence/SKILL.md` and references - OpenLinks placement and metadata rules. [VERIFIED: file read]
- `package.json`, `app.config.ts`, `tailwind.config.ts`, `src/domain/*.ts`, `src/routes/*.tsx`, `src/components/SiteLayout.tsx`, `src/styles/app.css`, and `scripts/verify-static.ts` - current implementation patterns and gaps. [VERIFIED: file read]
- npm registry via `npm view` - current versions and publish times for pinned packages. [VERIFIED: npm registry]
- SolidStart docs: head and metadata, route prerendering, config, static assets. [CITED: docs.solidjs.com/solid-start/building-your-application/head-and-metadata][CITED: docs.solidjs.com/solid-start/building-your-application/route-prerendering][CITED: docs.solidjs.com/solid-start/reference/config/define-config][CITED: docs.solidjs.com/solid-start/building-your-application/static-assets]
- Tailwind v3 docs: dark mode selector and reduced-motion modifiers. [CITED: v3.tailwindcss.com/docs/dark-mode][CITED: v3.tailwindcss.com/docs/hover-focus-and-other-states]
- Schema.org and Google Search structured data docs. [CITED: schema.org/Person][CITED: schema.org/ItemList][CITED: developers.google.com/search/docs/appearance/structured-data/intro-structured-data]
- Sitemaps.org and Google robots.txt docs. [CITED: www.sitemaps.org/protocol.html][CITED: developers.google.com/crawling/docs/robots-txt/create-robots-txt]
- Open Graph protocol docs for `og:image` structured properties and `og:image:alt`. [CITED: ogp.me]
- OWASP ASVS 5.0 taxonomy, OWASP XSS cheat sheet, and MDN `rel="noopener"` docs for Phase 3 security guidance. [CITED: cornucopia.owasp.org/taxonomy/asvs-5.0][CITED: cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html][CITED: developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/noopener]

### Secondary (MEDIUM confidence)

- Build and static-output audits from local commands: `bun run test`, `bun run build`, `bun run verify:static`, `rg` over `.output/public`, and `find .output/public`. [VERIFIED: local command output]

### Tertiary (LOW confidence)

- None. [VERIFIED: source/provenance review]

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - package versions, scripts, and framework docs were verified against `package.json`, npm registry, and official docs. [VERIFIED: package.json][VERIFIED: npm registry][CITED: docs.solidjs.com/solid-start]
- Architecture: HIGH - current code already follows pure `src/domain/*` helpers with thin Solid route consumers, and Bright Builds standards require that pattern. [VERIFIED: src/domain/*.ts][VERIFIED: src/routes/*.tsx][VERIFIED: /Users/peterryszkiewicz/Repos/coding-and-architecture-requirements/standards/core/architecture.md]
- Pitfalls: HIGH - gaps were observed in current source and generated `.output/public` after a successful build. [VERIFIED: bun run build][VERIFIED: rg static-output audit]
- Static assets: HIGH - SolidStart public-directory behavior is documented, and current repo lacks public assets. [CITED: docs.solidjs.com/solid-start/building-your-application/static-assets][VERIFIED: find public]
- Security: MEDIUM-HIGH - Phase 3 security surface is small and static, but ASVS 5.0 categories were verified against current OWASP taxonomy rather than the older V2/V3/V4 naming in the generic template. [CITED: cornucopia.owasp.org/taxonomy/asvs-5.0][VERIFIED: .planning/config.json]

**Research date:** 2026-05-26 [VERIFIED: environment_context]
**Valid until:** 2026-06-25 for implementation patterns; re-check npm package versions, SolidStart docs, and ASVS taxonomy if planning happens after that date. [VERIFIED: npm registry][CITED: docs.solidjs.com/solid-start][CITED: cornucopia.owasp.org/taxonomy/asvs-5.0]
