# Release Readiness

This repo ships as a static SolidStart portfolio. The release contract is intentionally local, deterministic, and token-safe.

## Primary Release Gate

Run the aggregate gate before shipping:

```bash
bun run verify
```

On a clean local machine or static builder where Playwright Chromium is not already provisioned, install the browser dependency explicitly before the aggregate gate:

```bash
bun run install:browser && bun run verify
```

This primary release gate includes project detail route coverage for selected `/projects/{slug}` pages, writing route coverage for `/writing` plus public `/writing/{slug}` pages, and theme route coverage for `/themes` plus public `/themes/{slug}` pages. The project detail route coverage contract combines project detail metadata, JSON-LD, and sitemap coverage with project detail axe, layout, representative keyboard, and representative reduced-motion coverage. The writing route coverage contract combines writing metadata, JSON-LD, sitemap, related-project link, and forbidden runtime residue coverage with writing axe, layout, representative keyboard, and representative reduced-motion coverage. The theme route coverage contract combines theme metadata, JSON-LD, sitemap, related project links, related writing links, collaboration links, and forbidden runtime residue coverage with theme axe, desktop/mobile dark layout, representative keyboard, and representative reduced-motion coverage.

The aggregate gate includes:

- `bun run format:check`
- `bun run check`
- `bun run typecheck`
- `bun run test`
- `bun run verify:curation`
- `bun run verify:no-github-runtime`
- `bun run verify:project-helper-surface`
- `bun run verify:visual-system`
- `bun run verify:social-previews`
- `bun run build`
- `bun run verify:browser`
- `bun run verify:static`
- `bun run verify:release`

## Static Output

Create the release artifact with:

```bash
bun run build
```

The static host must serve `.output/public` as the site root. That directory contains prerendered route HTML, `_build/` assets, local icons, the social preview image, `robots.txt`, and `sitemap.xml`.
Selected project detail routes, public writing routes, `/themes`, and public theme detail routes are part of the static artifact. Project detail routes are covered by project detail metadata, JSON-LD, and sitemap coverage. Writing routes are covered by writing metadata, JSON-LD, sitemap, related-project link, and forbidden runtime residue coverage. Theme routes are covered by theme metadata, JSON-LD, sitemap, related project links, related writing links, collaboration links, and forbidden runtime residue coverage.

## Social Preview Assets

Generate route-specific static social preview PNGs after curated project, writing, or theme route data changes:

```bash
bun run generate:social-previews
```

`generate:social-previews` writes reviewed checked-in PNGs under `public/social/generated/` and `public/social/generated/manifest.json`. The generated manifest records each covered project, writing, and theme route image so route metadata and JSON-LD can stay helper-derived.

Verify generated images and the checked-in manifest without writing files:

```bash
bun run verify:social-previews
```

`verify:social-previews` is read-only check mode and runs before `bun run build` inside `bun run verify`. This keeps stale generated PNGs or manifest drift from producing fresh static HTML.

`bun run verify:static` checks generated HTML social image metadata, Twitter image parity, JSON-LD image parity, local PNG existence, image dimensions, and `.output/public/social/generated/manifest.json` consistency against the copied static artifact.

`bun run verify:release` enforces the 250 KiB per-image social preview budget and the 1 MiB generated social preview PNG total budget. The release budget output includes the exact label `generated social preview PNG total`.

### Manual social-card smoke check

After preview or production deployment, maintainers manually inspect social cards for representative project, writing, and theme URLs. These checks are explicit manual release work: hosted social-card validation, current live GitHub state, live external-link reachability, and preview/production smoke checks are not part of `bun run verify`.

## Freshness Reports

After creating `.output/public`, run the offline freshness report when reviewing generated evidence:

```bash
bun run report:freshness
```

The freshness report is reviewed static evidence for generated media drift, GitHub snapshot age and unavailable records, external-link policy findings, and release smoke prompts. It reads checked-in curated data, `src/domain/github-metadata.snapshot.json`, generated social preview files and `public/social/generated/manifest.json`, and built `.output/public` HTML. If `.output/public` is missing, run `bun run build` first.

The report does not prove current live GitHub state, does not crawl live external links, and does not run hosted social crawler validation. Those checks remain manual smoke work or explicit maintainer review outside the offline report. Current live GitHub state belongs to manual smoke or an explicit maintainer sync/review outside the report. The report keeps findings grouped as `release blocker`, `needs review`, and `manual smoke`; only deterministic local blockers fail local release gates. `needs review` and `manual smoke` findings are review prompts, not hidden hard release gates.

OpenLinks remains identity/external-link policy context and is not a primary route CTA or brand replacement.

## Automated Gates

### SEO and Static Metadata

`bun run verify:static` checks route titles, descriptions, canonical links, Open Graph and Twitter metadata, local social image fields, sitemap, robots, JSON-LD, generated static assets, dark root HTML, and forbidden template/runtime residue. It includes project detail metadata, JSON-LD, and sitemap coverage for selected project detail routes. It also includes writing metadata, JSON-LD, sitemap, related-project link, and forbidden runtime residue coverage for `/writing` and public writing detail routes. Theme static coverage includes theme metadata, JSON-LD, sitemap, related project links, related writing links, collaboration links, and forbidden runtime residue coverage for `/themes` and public theme detail routes.

### Browser and Accessibility

`bun run verify:browser` runs the checked-in Playwright and axe suite against built `.output/public` output. It requires the Chromium browser installed by `bun run install:browser`, and it covers route accessibility scans, desktop and mobile dark-primary layout overflow/overlap checks, keyboard focus reachability, and reduced-motion behavior. It includes project detail axe and layout coverage for every selected project detail route, plus representative keyboard and reduced-motion checks for selected project detail navigation. It also includes writing axe and layout coverage for `/writing` and every public writing detail route, plus representative keyboard and reduced-motion checks for writing navigation and a public writing detail route. Theme browser coverage includes theme axe, desktop/mobile dark layout, representative keyboard, and representative reduced-motion coverage for `/themes`, public theme detail routes, and representative theme navigation paths.

### Performance and Best Practices

`bun run verify:release` enforces deterministic static output budgets as the local performance and best-practices equivalent for v1.1:

- route HTML budget
- total client JS budget
- total CSS budget
- social preview image budget
- one main landmark per route
- one h1 per route
- skip link presence
- image alt coverage
- focus and reduced-motion CSS hooks
- no remote runtime visual assets
- no visitor-runtime GitHub API or token-like output

Hosted Lighthouse or browser-provider audits may be useful extra evidence, but they are not required for the local release gate in this milestone.

## External-Link Policy

The local release gate does not crawl live third-party links. Live HTTP checks are intentionally manual because external destinations can rate-limit, block automation, require regional availability, or change independently of this static portfolio.

`bun run verify:release` checks external anchors by policy instead:

- external anchors must use HTTPS
- every generated external origin must be covered by the checked policy in `scripts/release-readiness.ts`
- primary GitHub and OpenLinks paths must remain present
- sensitive query keys such as token, secret, credential, key, api_key, and auth are rejected
- failure output reports only redacted origin/path plus sensitive key names

Covered manual-release origins:

- `https://github.com`
- `https://openlinks.us`
- `https://www.brightbuilds.us`
- `https://freetheworld.ai`
- `https://win3bitco.in`
- `https://prizz.github.io`

Manual external-link smoke check before release:

1. Open the production or preview home page.
1. Check the GitHub profile link.
1. Check the OpenLinks profile link.
1. Open at least one project source link from `/projects`.
1. Open each live project origin listed above when it appears in the current static output.
1. Treat third-party downtime as a release note or follow-up decision, not as a local verifier failure.

## Cloudflare Pages

Cloudflare Pages should serve the generated static artifact directly.

Recommended settings:

| Setting | Value |
| --- | --- |
| Build command | `bun run install:browser && bun run verify` |
| Output directory | `.output/public` |
| Package manager | `bun@1.3.14` |
| Bun environment variable | `BUN_VERSION=1.3.14` |
| Node environment variable | `NODE_VERSION=22.16.0` |

Use `bun run install:browser && bun run verify` as the clean-builder command sequence when the deployment should block on the full release gate. `bun run verify` remains the aggregate release gate once Chromium has been provisioned. Use `bun run build` only for emergency artifact generation after the full gate has already passed locally or in CI.
That clean-builder sequence includes project detail route coverage, writing route coverage, and theme route coverage before `.output/public` is accepted for deployment.

Environment expectations:

- No public GitHub token is required for visitor runtime.
- Optional GitHub metadata refresh uses local or server-side `GITHUB_METADATA_TOKEN` only.
- Do not use VITE\_, PUBLIC\_, or SOLID_PUBLIC\_ prefixes for GitHub tokens.
- Static deployment should not need backend secrets, authentication, or server functions.

## Preview Deployment Checklist

Before creating a preview deployment:

1. Run `bun run install:browser` on a clean builder or fresh local environment.
1. Run `bun run verify`.
1. Confirm `.output/public/index.html`, `.output/public/projects/index.html`, `.output/public/writing/index.html`, `.output/public/themes/index.html`, `.output/public/sitemap.xml`, and `.output/public/robots.txt` exist.
1. Confirm the preview deployment uses `.output/public`.
1. Confirm no token values are present in Cloudflare Pages public environment variables.

After the preview deployment is available:

1. Open `/`, `/about`, `/projects`, `/projects/openlinks`, `/writing`, `/writing/agentic-engineering-workflows`, `/themes`, `/themes/agentic-engineering`, and `/contact`.
1. Confirm the site renders dark-primary by default.
1. Confirm the project anchors on `/projects` work.
1. Run the Manual external-link smoke check.

Preview and production smoke checks include one selected project detail route, currently /projects/openlinks, one public writing detail route, currently /writing/agentic-engineering-workflows, and one public theme detail route, currently /themes/agentic-engineering.

## Production Deployment Checklist

Before production:

1. Confirm preview deployment smoke checks passed.
1. Confirm `bun run install:browser && bun run verify` passed on the exact commit being deployed in any clean-builder environment.
1. Confirm Cloudflare Pages build settings still match this document.
1. Confirm the selected project detail route `/projects/openlinks`, the public writing detail route `/writing/agentic-engineering-workflows`, and the public theme detail route `/themes/agentic-engineering` are included in the deployment smoke path.

Post-deploy smoke check:

Use this post-deploy smoke check after the production deployment:

1. Open `https://www.brightbuilds.us/`.
1. Open `https://www.brightbuilds.us/projects`.
1. Open `https://www.brightbuilds.us/projects/openlinks`.
1. Open `https://www.brightbuilds.us/writing`.
1. Open `https://www.brightbuilds.us/writing/agentic-engineering-workflows`.
1. Open `https://www.brightbuilds.us/themes`.
1. Open `https://www.brightbuilds.us/themes/agentic-engineering`.
1. Confirm `https://www.brightbuilds.us/sitemap.xml` and `https://www.brightbuilds.us/robots.txt` load.
1. Confirm GitHub and OpenLinks links remain reachable from the footer or contact surface.
