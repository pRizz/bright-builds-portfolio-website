<!-- bright-builds-rules-managed:begin -->

# Bright Builds Rules

`AGENTS.md` is the entrypoint for repo-local instructions, not the complete Bright Builds Rules specification.

This managed block is owned upstream by `bright-builds-rules`. If this block needs a fix, open an upstream PR or issue instead of editing the managed text in a downstream repo. Keep downstream-specific instructions outside this managed block.

Before plan, review, implementation, or audit work:

1. Read the repo-local instructions in `AGENTS.md`, including any `## Repo-Local Guidance` section and any instructions outside this managed block.
1. Read `AGENTS.bright-builds.md`.
1. Read `standards-overrides.md` when present.
1. Read the pinned canonical standards pages relevant to the task.
1. If you have not done that yet, stop and load those sources before continuing.

Use this routing map when deciding what to load next:

- For repo-specific commands, prerequisites, generated-file ownership, CI-only suites, or recurring workflow facts, use the local `AGENTS.md`, especially `## Repo-Local Guidance`.
- For the Bright Builds default workflow and high-signal cross-cutting rules used in most tasks, use `AGENTS.bright-builds.md`.
- For deliberate repo-specific exceptions to the Bright Builds defaults, use `standards-overrides.md`.
- To choose the right pinned canonical standards page, start with the Bright Builds entrypoint `standards/index.md`.
- For business-logic structure, domain modeling, and functional-core versus imperative-shell decisions, use the canonical page `standards/core/architecture.md`.
- For control flow, naming, function/file size, and readability rules, use the canonical page `standards/core/code-shape.md`.
- For sync, bootstrap, and pre-commit verification rules, use the canonical page `standards/core/verification.md`.
- For unit-test expectations, use the canonical page `standards/core/testing.md`.
- For Rust or TypeScript/JavaScript-specific rules, use the matching canonical page under `standards/languages/`.
- Keep recurring repo-specific workflow facts, commands, and links in a `## Repo-Local Guidance` section elsewhere in this file.
- Record deliberate repo-specific exceptions and override decisions in `standards-overrides.md`.
- If instructions elsewhere in `AGENTS.md` conflict with `AGENTS.bright-builds.md`, follow the repo-local instructions and treat them as an explicit local exception.

<!-- bright-builds-rules-managed:end -->

<!-- GSD:project-start source:PROJECT.md -->

## Project

**Bright Builds Portfolio Website**

This is a performant, statically generated portfolio website for Peter Ryszkiewicz that showcases a curated view of Peter's GitHub work, writing, technical identity, and ways to collaborate. It should feel like a more polished successor to the current Bright Builds site: fun, reactive, and experimental, while replacing template content with accurate project and profile substance.

The site is for technical peers, OSS collaborators, founder-adjacent builders, and people interested in Peter's work across AI, Bitcoin, open systems, developer tooling, and practical web/software experiments.

**Core Value:** Help visitors quickly understand what Peter builds, why it matters, and which projects are worth exploring or collaborating on.

### Constraints

- **Tech stack**: Use SolidJS / SolidStart-style static generation or the closest stable SolidJS static build path - the site should be fast, SEO-friendly, and simple to deploy as static output.
- **UI library**: Prefer Mystic UI for SolidJS components and styling primitives where compatible - it is locally owned and aligned with the Bright Builds TypeScript/SolidJS standard.
- **Dependency pinning**: Pin `pRizz/mystic-ui` to an exact GitHub commit SHA when adopted - the fork is not an npm-published package contract.
- **Content quality**: Curate and write original project copy - do not trust placeholder template content or automatically surface every repo.
- **Performance**: Physics effects must degrade cleanly for reduced motion, low-power devices, and mobile viewports.
- **Accessibility**: Interactive and motion-heavy elements need keyboard, reduced-motion, contrast, and text layout checks.
- **SEO**: Pages need meaningful metadata, structured project content, canonical links, Open Graph/Twitter card basics, sitemap/robots where appropriate, and human-readable project pages or anchors.
- **Workflow**: Use GSD planning artifacts and commit planning docs as part of the repo history.

<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->

## Technology Stack

## Recommendation

## Recommended Stack

| Area | Recommendation | Version / Pin | Confidence | Why |
| --- | --- | --- | --- | --- |
| Package manager | Bun | `packageManager: "bun@1.3.14"`; commit `bun.lock` | HIGH | Bright Builds TS standard prefers Bun for greenfield standalone TS projects. Bun supports `bun.lock`, `bun ci`, GitHub dependencies, and Cloudflare Pages can pin Bun via `BUN_VERSION`. |
| Runtime compatibility | Keep Node available for tool compatibility | Cloudflare default Node `22.16.0` is sufficient for Vite 8; set `NODE_VERSION` only if needed | MEDIUM | Vite 8 requires Node `20.19+` or `22.12+`; Bun can run the app scripts, but some ecosystem CLIs still assume Node. |
| App framework | SolidStart with SolidJS | `@solidjs/start@1.3.2`, `solid-js@1.9.13`, `@solidjs/router@0.16.1` | HIGH for framework, MEDIUM for pure static output | SolidStart is the official Solid meta-framework and documents SSG through route pre-rendering. Verify generated output during implementation because SolidStart is Nitro/Vinxi-based, not a plain Vite SPA. |
| Bundler | Vite through SolidStart/Vinxi | `vite@8.0.14`, `vite-plugin-solid@2.11.12`, `vinxi@0.5.11` | HIGH | SolidStart uses Vinxi, which combines Vite and Nitro. Avoid hand-rolled prerender tooling unless SolidStart output fails the static-host proof. |
| Language | TypeScript strict mode | `typescript@6.0.3`; `@types/bun@1.3.14` | MEDIUM | Current registry version is TS 6.0.3. Use strict settings, but keep Mystic's required `skipLibCheck: true` while the GitHub package ships source. |
| Styling | Tailwind CSS 3.x | `tailwindcss@3.4.19`, `postcss@8.5.15`, `autoprefixer@10.5.0` | HIGH | Mystic UI's supported consumer path is Vite + SolidJS + Tailwind 3.x. Do not adopt Tailwind 4 until Mystic explicitly supports it. |
| Dark mode | Class/selector-based dark mode | Tailwind `darkMode: "selector"`; toggle `.dark` on `document.documentElement` | HIGH | Mystic expects `.dark` on the root element. Tailwind 3.4 replaced the old `class` strategy name with `selector`, while preserving the `.dark` class behavior. |
| UI components | Mystic UI, selectively | `mystic-ui@github:pRizz/mystic-ui#d36017757708ed01ef2b3b47beb14f294726411c` | HIGH | This is the current `pRizz/mystic-ui` `main` SHA as of research. Use `withMysticUI`, import `mystic-ui/tailwind/theme.css` from the app stylesheet, and avoid Panda/deep workspace imports. |
| Local UI utilities | Small class/icon helpers | `clsx@2.1.1`, `tailwind-merge@3.6.0`, `lucide-solid@1.16.0` | MEDIUM-HIGH | Useful for local component composition and icon buttons without adding another UI kit. Add only when code actually needs them. |
| Motion | CSS + Mystic first, vanilla Motion for custom effects | `motion@12.40.0` only if custom JS animation is needed | MEDIUM-HIGH | Motion's vanilla JS API supports spring/keyframe animations and remains framework-agnostic. Keep effects transform/opacity-first and reduced-motion aware. |
| Reactive springs | Optional Solid primitive behind a wrapper | `@solid-primitives/spring@0.1.2` only if a Solid signal spring is simpler than Motion | LOW-MEDIUM | Solid Primitives lists `spring` as Stage 0. Use cautiously, behind a tiny repo-owned adapter, and do not make it core infrastructure. |
| Content source | Typed local content registry | `src/data/projects.ts`, `src/data/profile.ts`, `src/data/routes.ts` | HIGH | The portfolio must curate repositories rather than mirror all public GitHub repos. A typed registry keeps authored copy, ordering, tags, and SEO stable. |
| GitHub metadata | Manual/build-time sync script, no runtime API calls | `@octokit/graphql@9.0.3`, `zod@4.4.3` as dev/script deps | HIGH | Use GitHub GraphQL for selected repo metadata snapshots only. Validate API output with Zod and write a checked-in/generated snapshot so deploys are not rate-limit dependent. |
| SEO metadata | Solid meta plus static generated files | `@solidjs/meta@0.29.4`; repo-owned sitemap/robots script | HIGH | SolidStart does not ship metadata by default; `@solidjs/meta` is the documented path. Generate canonical tags, OG/Twitter tags, JSON-LD, `sitemap.xml`, and `robots.txt` from the same route registry. |
| OpenLinks identity | Low-intrusion footer/about link plus metadata | Visible link to `https://openlinks.us/`, `rel="me noopener noreferrer"`, optional JSON-LD `Person.sameAs` | HIGH | Bright Builds owner guidance and OpenLinks skill both prefer visible footer/about/profile placement first, metadata second. Keep the site brand primary. |
| Formatting/lint | Biome | `@biomejs/biome@2.4.15` | MEDIUM-HIGH | Biome covers JS/TS/JSX/TSX/CSS/JSON formatting and linting quickly. Pair with `tsc --noEmit` because Biome is not a substitute for typechecking. |
| Unit/component tests | Vitest + Solid testing utilities | `vitest@4.1.7`, `@solidjs/testing-library@0.8.10`, `happy-dom@20.9.0` | MEDIUM-HIGH | Vitest is Vite-powered and fits Solid/Vite projects. Use it mainly for pure data transforms, route/SEO generation, and focused component behavior. |
| Browser/accessibility tests | Playwright + axe | `@playwright/test@1.60.0`, `@axe-core/playwright@4.11.3` | HIGH | Required for motion/reduced-motion, responsive layout, keyboard/focus, generated metadata, and accessibility checks that unit tests cannot prove. |
| Performance budgets | Lighthouse CI | `@lhci/cli@0.15.1` | MEDIUM-HIGH | Use as a CI/per-release guard for static pages. Keep thresholds realistic but enforce SEO, accessibility, best-practices, and performance budgets. |
| Deployment | Cloudflare Pages | Build command `bun ci && bun run build`; output `dist`; set `BUN_VERSION=1.3.14` | MEDIUM-HIGH | Cloudflare Pages documents SolidStart support, Bun/Node build-image pinning, preview deployments, and Bun cache support. Verify the actual SolidStart prerender output before locking dashboard settings. |

## Mystic UI Setup Contract

- Pin `mystic-ui` to an exact GitHub commit SHA, not `main`.
- Keep `solid-js` on the stable 1.x line; do not adopt Solid 2 beta until Mystic and SolidStart compatibility is explicitly verified.
- Keep `skipLibCheck: true` while Mystic ships source-only components.
- Do not use Panda components or deep imports such as workspace package paths; the README says those are not exported for package consumers.

## Data and Content Shape

## Verification Commands to Plan

- Generated HTML exists for `/`, project routes or anchors, and not-found behavior.
- Route-specific title, description, canonical, OG/Twitter tags, and JSON-LD render in static HTML.
- `prefers-reduced-motion: reduce` disables non-essential motion.
- Mobile and desktop layouts have no overlapping text or controls.
- Keyboard focus and axe checks pass on the home, project, and contact/about surfaces.

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
| --- | --- | --- | --- |
| Static framework | SolidStart SSG | Astro + Solid islands | Strong static story, but adds another framework shell and does not match the requested SolidJS/Mystic-first stack. Reconsider only if SolidStart static output blocks deployment. |
| App shell | SolidStart | Plain Solid + Vite SPA | Fast and simple, but weaker SEO/static metadata unless a custom prerender layer is added. |
| Package manager | Bun | pnpm | pnpm is reliable, but Bright Builds TS standards prefer Bun for new standalone TS projects and SolidStart supports `bun create solid`. |
| Styling | Tailwind 3.x | Tailwind 4.x | Tailwind 4 is current, but Mystic's supported consumer contract is Tailwind 3.x. |
| UI library | Mystic UI selectively | Kobalte, Ark UI, DaisyUI, Flowbite | Useful libraries, but they add a second design system. Use only if Mystic/local components cannot cover an accessibility-critical primitive. |
| Motion | CSS + Mystic + vanilla Motion | GSAP | Powerful, but unnecessary for restrained portfolio motion and larger/licensing tradeoffs than this project needs. |
| Physics | Tiny spring/motion helpers | Matter.js, Rapier, Three.js | Heavy and likely to overpower portfolio content. The requirement is reactive motion, not a simulation/game. |
| GitHub data | Curated registry + optional metadata snapshot | Runtime GitHub API mirror | Runtime API calls hurt performance, introduce rate-limit failure modes, and undermine the curated portfolio narrative. |
| SEO assets | `@solidjs/meta` + repo-owned generator | Dynamic OG image/API endpoint | Static site should not need a server path for social images in v1. Generate static assets if needed. |
| Linting | Biome + `tsc` | ESLint + `eslint-plugin-solid` | ESLint has Solid-specific rules, but adds config/dependency surface. Add it later only if Solid reactivity bugs appear that Biome/TypeScript/tests miss. |
| Deployment | Cloudflare Pages | GitHub Pages | GitHub Pages is fine for simple static files but weaker for preview deployments, build caching, environment pinning, and future edge/function escape hatches. |

## Source Notes

- SolidStart docs: overview, SSG support, route pre-rendering, metadata, config, and Cloudflare deployment: `https://docs.solidjs.com/solid-start`, `https://docs.solidjs.com/solid-start/building-your-application/route-prerendering`, `https://docs.solidjs.com/solid-start/building-your-application/head-and-metadata`, `https://docs.solidjs.com/solid-start/reference/config/define-config`, `https://developers.cloudflare.com/pages/framework-guides/deploy-a-solid-start-site/`
- Mystic UI README and current main SHA: `https://github.com/pRizz/mystic-ui`, `d36017757708ed01ef2b3b47beb14f294726411c`
- Bun package manager docs and release data: `https://bun.com/docs/pm/cli/install`, `https://bun.sh/docs/pm/lockfile`, `https://github.com/oven-sh/bun/releases/tag/bun-v1.3.14`
- Tailwind v3 docs: `https://v3.tailwindcss.com/docs/guides/vite`, `https://v3.tailwindcss.com/docs/dark-mode`
- Motion docs: `https://motion.dev/docs/animate`, `https://motion.dev/docs/gsap-vs-motion`
- Solid Primitives docs: `https://primitives.solidjs.community/`, `https://github.com/solidjs-community/solid-primitives`
- GitHub API rate-limit docs: `https://docs.github.com/en/graphql/overview/rate-limits-and-query-limits-for-the-graphql-api`, `https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api`
- Cloudflare Pages build image/cache docs: `https://developers.cloudflare.com/pages/configuration/build-image/`, `https://developers.cloudflare.com/pages/configuration/build-caching/`
- Verification docs: Biome `https://biomejs.dev/`, Vitest `https://main.vitest.dev/guide/`, Playwright `https://playwright.dev/docs/intro`, axe Playwright `https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright`, Lighthouse CI `https://googlechrome.github.io/lighthouse-ci/`

## Open Questions / Verify During Implementation

- Confirm the current SolidStart template's exact scripts and output directory; Cloudflare docs say `dist`, but implementation should prove generated static HTML files exist before dashboard settings are finalized.
- Confirm whether `typescript@6.0.3` works cleanly with SolidStart and pinned Mystic UI; if not, keep the scaffold's TypeScript version and document the reason.
- Local Bun was `1.3.9` during research while the latest GitHub release was `1.3.14`; decide whether to upgrade local tooling or pin CI to the available local version for the first scaffold.
- Verify Mystic components used in the design do not pull unsupported Panda/deep-import paths into the consumer app.
- Decide whether project pages are separate routes or sections on `/`; this affects the route registry, sitemap, metadata tests, and prerender list.
- Decide whether per-project OG images are worth static generation in v1; default to one strong static OG image unless sharing tests show a real gap.

<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->

## Conventions

Conventions not yet established. Will populate as patterns emerge during development.

<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->

## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.

<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->

## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, or `.github/skills/` with a `SKILL.md` index file.

<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->

## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:

- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.

<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->

## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.

<!-- GSD:profile-end -->
