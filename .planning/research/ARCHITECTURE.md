# Architecture Patterns

**Domain:** Static SolidJS portfolio site\
**Project:** Bright Builds Portfolio Website\
**Researched:** 2026-05-24\
**Overall confidence:** HIGH for SolidStart/static architecture and Bright Builds rules; MEDIUM for Mystic UI details because it is a source-shipped GitHub dependency rather than a stable npm package.

## Recommendation

Build a static-first SolidStart site with a functional core for portfolio curation, route derivation, and SEO metadata, plus thin imperative shells for Solid routes, build-time GitHub fetching, generated files, and browser-only physics. Do not add a backend service in v1. The runtime site should render useful content and metadata from checked-in data, with optional build-time GitHub snapshots layered in when available.

Recommended shape:

```text
curated registry + profile data
  -> pure catalog/SEO/route derivation
  -> SolidStart file routes and static prerender route list
  -> presentational Solid components
  -> optional client-only Mystic/physics enhancement shells
```

The first implementation phase should establish the scaffold, content registry, pure derivation modules, and route/metadata contract before visual polish. Mystic UI and physics should be added after the static content path is already accessible, tested, and SEO-valid.

## Component And Module Boundaries

| Boundary | Suggested Path | Responsibility | Must Not Do |
| --- | --- | --- | --- |
| App shell | `src/app.tsx`, `src/routes/(site).tsx` | Router, suspense root, `MetaProvider`, shared layout slots | Fetch GitHub, curate projects, run physics |
| Page routes | `src/routes/index.tsx`, `src/routes/projects/index.tsx`, `src/routes/projects/[slug].tsx`, `src/routes/about.tsx` | Compose sections and route-specific metadata from catalog queries | Re-implement sorting/filtering rules inline |
| Content registry | `src/content/projects.ts`, `src/content/profile.ts`, `src/content/site.ts` | Checked-in source of truth for curated projects, profile links, copy, canonical URLs | Mirror every GitHub repo automatically |
| Generated snapshots | `src/content/generated/github-repos.json` or `src/content/generated/github-repos.ts` | Optional build-time GitHub metadata cache | Become required for runtime rendering |
| Domain core | `src/domain/projects.ts`, `src/domain/seo.ts`, `src/domain/routes.ts` | Pure data-in/data-out validation, project catalog building, route list, Open Graph/JSON-LD metadata | Touch DOM, call network, depend on Solid components |
| UI primitives | `src/components/ui/*`, `src/components/layout/*` | Stable local component API, accessibility defaults, layout primitives | Leak Mystic UI dependency details everywhere |
| Mystic adapters | `src/components/mystic/*` | Narrow wrappers around selected Mystic components | Become the domain model or only rendering path |
| Project UI | `src/components/project/*` | Cards, grids, filters, detail headers, tag lists | Decide which projects are flagship |
| SEO UI | `src/components/seo/PageMeta.tsx`, `src/components/seo/StructuredData.tsx` | Render metadata derived by `src/domain/seo.ts` | Create metadata ad hoc from route props |
| Motion shell | `src/motion/*`, `src/components/effects/*` | Browser-only animation/physics setup, cleanup, reduced-motion gates | Mutate content state or block static rendering |
| Build scripts | `scripts/fetch-github-repos.ts`, `scripts/write-sitemap.ts` | Imperative build-time I/O around pure domain functions | Contain curation rules that routes cannot test |

## Content Registry Shape

Use a typed registry that makes curation explicit and lets GitHub metadata enrich, not decide, what appears.

```ts
type ProjectTier = "flagship" | "selected" | "lab" | "archive";

type ProjectSource =
  | { kind: "github"; owner: "pRizz"; repo: string }
  | { kind: "external"; href: string; label: string }
  | { kind: "unpublished"; note: string };

type ProjectEntry = {
  slug: string;
  title: string;
  tier: ProjectTier;
  rank: number;
  summary: string;
  narrative: string;
  tags: readonly string[];
  themes: readonly ("ai" | "bitcoin" | "open-systems" | "developer-tools" | "creative")[];
  source: ProjectSource;
  links: readonly { label: string; href: string; kind: "repo" | "demo" | "docs" | "article" }[];
  media?: { src: string; alt: string; aspectRatio: string };
  detailPage: boolean;
};
```

Pure derivation functions should produce:

- `buildProjectCatalog(projects, maybeGithubSnapshot)` with duplicate slug checks, tier ordering, and hidden/noisy repo filtering.
- `featuredProjects(catalog)` for the home page.
- `projectsByTheme(catalog)` for tag or narrative sections.
- `projectRoutes(catalog)` for prerender and sitemap generation.
- `metadataForProject(project, siteProfile)` for title, description, canonical URL, Open Graph, and JSON-LD.

Keep optional values visibly named with `maybe...` in internal code, matching Bright Builds TypeScript guidance.

## Data Flow Direction

1. **Author input:** edit checked-in content files for project copy, rank, tags, links, and images.
1. **Build-time shell:** optionally fetch public GitHub repo metadata into a generated snapshot. This is a convenience layer only.
1. **Pure core:** parse registry and snapshot into a `ProjectCatalog`, derive routes, metadata, structured data, and display groups.
1. **Routes:** import catalog selectors and pass already-derived view models into sections.
1. **Components:** render semantic HTML first, then style with local primitives and Mystic adapters.
1. **Effects:** client-only motion reads DOM/pointer/visibility state and writes isolated transforms; it does not feed back into catalog or route state.

No runtime browser call should be required to GitHub for the portfolio to show complete content.

## Route And Page Structure

Use SolidStart file routes and prerender them as static HTML.

```text
src/routes/
  (site).tsx                 shared layout for public pages
  index.tsx                  identity, flagship projects, themes, contact CTA
  projects/
    index.tsx                full curated project index
    [slug].tsx               detail pages for flagship/selected projects
  about.tsx                  profile narrative, work themes, OpenLinks placement
  contact.tsx                collaboration links or redirect-style contact page
  [...404].tsx               not found page
```

Recommended routing rules:

- Generate project detail pages only for `detailPage: true`; keep low-signal labs/prototypes as cards unless they strengthen the narrative.
- Use an explicit prerender route list derived from the catalog for deterministic static output. `crawlLinks: true` is acceptable as a backup smoke path, not the only source of truth.
- Use the same route list for `sitemap.xml` so the prerender contract and SEO discovery cannot drift.
- Keep `robots.txt`, favicons, social images, and other metadata files under `public/` when stable URLs matter.

## SEO And Identity Metadata

Place `@solidjs/meta` at the app root and render route-level metadata through a small `PageMeta` component that accepts a derived metadata object.

Metadata minimums:

- Stable `<title>` and description per route.
- Canonical link for every indexable route.
- Open Graph and Twitter card basics.
- JSON-LD `Person` for Peter and `SoftwareSourceCode` or `CreativeWork` entries for flagship projects when enough data exists.
- `sitemap.xml` and `robots.txt` generated or maintained from the same route registry.

OpenLinks should be low-intrusion: visible footer/about/contact placement first, optional `rel="me"` and JSON-LD `sameAs` only when they match the visible link. Do not make OpenLinks the primary brand or main CTA.

## Mystic UI Integration Boundary

Use Mystic UI selectively after the base content and route contract exists.

Recommended integration:

- Pin `github:pRizz/mystic-ui#d36017757708ed01ef2b3b47beb14f294726411c`.
- Use the Tailwind component surface only.
- Keep Tailwind CSS 3.x for the first pass because Mystic's README documents that consumer path.
- Import `mystic-ui/tailwind/theme.css` from the app stylesheet.
- Use class-based dark mode with `.dark` on `document.documentElement`.
- Wrap Mystic components in local adapters so replacement or bug workarounds stay localized.

Do not deep-import workspace internals such as `@mystic-ui/tailwind`; treat the README-exported package paths as the contract.

## Animation And Physics Boundaries

Physics should be progressive enhancement, not architecture. Recommended shell:

```text
components/effects/PhysicsLayer.tsx
  -> onMount browser setup
  -> prefers-reduced-motion / pointer / viewport gates
  -> requestAnimationFrame loop
  -> onCleanup cancel frame and remove listeners
```

Rules:

- Render static decorative or layout-equivalent fallback content before JS runs.
- Disable or simplify for `prefers-reduced-motion: reduce`, coarse pointers, small mobile viewports, hidden tabs, and offscreen sections.
- Use `IntersectionObserver` to start/stop section-local effects and the Page Visibility API to pause global loops.
- Drive JS animation with `requestAnimationFrame` timestamps; avoid fixed-frame assumptions.
- Keep transforms isolated to decorative nodes or non-layout-affecting wrappers to avoid cumulative layout shift.
- Keyboard, text selection, links, and project cards must remain usable with physics disabled.

## Suggested Build Order

1. **Scaffold and tooling** - SolidStart, TypeScript, Bun scripts, Tailwind 3, Mystic dependency pinned but minimally used, base routes, `MetaProvider`, static prerender config.
1. **Content model and pure core** - project/profile/site registries, parsers, catalog selectors, route derivation, SEO derivation, unit tests.
1. **Static pages and components** - semantic layout, project cards, project detail route, about/contact/footer with OpenLinks link, no physics dependency.
1. **SEO/static output** - canonical metadata, social metadata, JSON-LD, sitemap, robots, social image assets, prerender verification.
1. **Mystic visual layer** - replace or wrap local primitives where Mystic improves the design without breaking accessibility or bundle size.
1. **Motion and physics** - add client-only effects with reduced-motion, viewport, cleanup, and performance gates.
1. **Polish and validation** - cross-viewport screenshots, keyboard/a11y checks, performance budget checks, broken link checks, route metadata snapshot checks.

This order minimizes rework: content and metadata decisions become stable before visual effects create coupling pressure.

## Testing And Verification Implications

Unit test the pure core first:

- Duplicate slug rejection and route generation.
- Featured project ordering by tier/rank.
- GitHub snapshot merge behavior for missing, archived, forked, or stale repos.
- Metadata derivation for home, project index, project detail, about, and contact routes.
- JSON-LD shape from registry data.

Build and integration checks:

- Typecheck with strict TypeScript.
- Production static build must pass and emit expected routes.
- Generated `sitemap.xml` must match `projectRoutes(catalog)` plus static pages.
- Prerendered HTML should contain meaningful content, title, description, canonical URL, and Open Graph tags without waiting for client fetches.
- Verify no runtime network request to GitHub is needed for page content.

Browser/a11y checks:

- Keyboard traversal through nav, project cards, filters, footer, and contact links.
- Reduced-motion emulation proves physics does not start and Mystic animations do not obscure content.
- Mobile and desktop screenshots verify no text overlap, no content hidden behind effects, and stable card dimensions.
- Performance smoke: bundle size, no hydration errors, no long-running physics loop after route change/unmount.

## Scalability Considerations

| Concern | At v1 static site | At larger portfolio | Avoid |
| --- | --- | --- | --- |
| Project count | Checked-in registry and cards | Add generated indexes/search data from same registry | CMS/admin UI before content pain exists |
| GitHub metadata | Optional build-time snapshot | Scheduled refresh in CI with committed diff review | Runtime browser token or backend dependency |
| Routes | Explicit static list | Generated route manifest and sitemap | Hand-maintained project routes in multiple files |
| Motion | Section-local client effects | Shared motion scheduler with budgets | Always-on global physics loops |
| SEO | Route metadata from pure functions | Snapshot tests and richer structured data | Per-route ad hoc metadata strings |

## Sources

- Local project context: `.planning/PROJECT.md`, `.planning/config.json`.
- Repo guidance: `AGENTS.md`, `AGENTS.bright-builds.md`, `standards-overrides.md`.
- Bright Builds standards, pinned commit `05f8d7a6c9c2e157ec4f922a05273e72dab97676`:
  - https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/index.md
  - https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/architecture.md
  - https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/testing.md
  - https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/verification.md
  - https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/languages/typescript-javascript.md
- SolidStart overview, routing, route prerendering, static assets, and Solid Meta:
  - https://docs.solidjs.com/solid-start
  - https://docs.solidjs.com/solid-start/building-your-application/routing
  - https://docs.solidjs.com/solid-start/building-your-application/route-prerendering
  - https://docs.solidjs.com/solid-start/building-your-application/static-assets
  - https://docs.solidjs.com/solid-meta/reference/meta/metaprovider
- Solid lifecycle docs for browser-only shells:
  - https://docs.solidjs.com/reference/lifecycle/on-mount
  - https://docs.solidjs.com/reference/lifecycle/on-cleanup
- Mystic UI README and verified main SHA:
  - https://github.com/pRizz/mystic-ui
  - `d36017757708ed01ef2b3b47beb14f294726411c` from `git ls-remote https://github.com/pRizz/mystic-ui.git refs/heads/main`
- Tailwind/Solid v3 setup:
  - https://docs.solidjs.com/guides/styling-components/tailwind-v3
- GitHub public repository metadata:
  - https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#list-repositories-for-a-user
  - https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api
- SEO and crawler files:
  - https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
  - https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
  - https://developers.google.com/search/reference/robots_txt
- Web animation/performance primitives:
  - https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
  - https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame
  - https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver
  - https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
