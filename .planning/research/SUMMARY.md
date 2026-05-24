# Research Summary

**Project:** Bright Builds Portfolio Website\
**Synthesized:** 2026-05-24\
**Sources:** `STACK.md`, `FEATURES.md`, `ARCHITECTURE.md`, `PITFALLS.md`

## Key Findings

**Stack:** Use SolidStart / SolidJS 1.x as a static-first site, Bun as the package manager, TypeScript strict mode, Tailwind CSS 3.x, and Mystic UI pinned to `pRizz/mystic-ui#d36017757708ed01ef2b3b47beb14f294726411c`. Keep `@solidjs/meta`, generated sitemap/robots, Biome, TypeScript checks, Vitest, Playwright, axe, and Lighthouse-style verification in scope.

**Content model:** The portfolio should be powered by a manually curated, typed project registry. Authored project copy, display order, curation tier, source type, maturity, inclusion flags, and exclusion reasons are authoritative. GitHub metadata can enrich curated entries, but it must not decide flagship placement by itself.

**Table stakes:** The first release needs identity-first positioning, 4-6 flagship projects, project story/detail surfaces, repo curation rules, contact/identity links, about/themes narrative, SEO/social metadata, responsive performance, accessibility, and reduced-motion support.

**Differentiators:** Use restrained reactive physics, a project constellation/theme view, "now building" context, transparent curation badges, a small experiments lab, and low-intrusion OpenLinks identity placement. These should support the narrative rather than becoming the product.

**Architecture:** Keep curation, route derivation, and SEO metadata in pure TypeScript modules. Keep Solid routes, browser motion, build-time GitHub ingestion, sitemap writing, and generated snapshots as imperative shells. The site must render meaningful static HTML without runtime GitHub calls.

**Watch out for:** Do not copy unfinished Bright Builds template content, build a raw GitHub mirror, depend on live GitHub API calls, leak build tokens into frontend code, ship client-only SEO content, let motion harm accessibility/performance, or use an unpinned Mystic UI dependency.

## Recommended Build Order

1. Scaffold the static SolidStart app with Bun, TypeScript, Tailwind 3, base routes, metadata root, and Mystic UI pinned but minimally used.
1. Build the project/profile/site content registry, pure curation selectors, route derivation, and SEO derivation with unit tests.
1. Render semantic static pages for home, project index/detail, about, contact, footer/OpenLinks placement, and project cards without relying on motion.
1. Add SEO/static output assets and verification: route metadata, JSON-LD, sitemap, robots, canonical URLs, built HTML inspection.
1. Add Mystic UI visual polish through local adapters where it improves the design.
1. Add reactive physics as progressive enhancement with reduced-motion, mobile, viewport, cleanup, and performance gates.
1. Run release validation across build, typecheck, tests, accessibility, SEO, responsive screenshots, links, and performance budgets.

## Initial Curation Direction

Flagship candidates to review first:

- `open-links` - identity/open-web product and OpenLinks story.
- `free-the-world` - decentralized/open systems narrative.
- `open-bitcoin-web-miner` / Win3Bitco.in - Bitcoin and experimental web.
- Open Bitcoin - current roadmap / now-building Bitcoin work if enough substance is available.
- `opencode-cloud` - agentic/devtooling relevance.
- `zeckendorf` plus related `zeckendorf-webapp` / `zeckendorf-spiral` artifacts as one project story.

Supporting candidates:

- `mystic-ui`
- `SVG-Navigator---Chrome-Extension`
- `nanocurrency-node`
- `top-revenue-per-employee`
- `free-open-distilled-models`
- `open-emoji-picker`
- `av-denoiser`
- `bitcoin-bond-proposal`
- `simple-market-maker`
- `my-tooling-opinions`

Default exclusions:

- Forks without a specific original contribution story.
- Repros, playgrounds, sandboxes, and alpha-debug repos.
- Generated/profile/support repos such as `github-stats`, `pRizz`, and `open-links-sites`.
- Unreviewed repos with no meaningful README, live/demo URL, or authored one-line explanation.

## Roadmap Implications

- Phase 1 should establish the app/tooling foundation and static rendering proof.
- Phase 2 should lock the content schema, curated project registry, curation validation, and flagship list.
- Phase 3 should build the semantic site surfaces and SEO output from that registry.
- Phase 4 should add visual system polish, Mystic UI integration, and motion gates.
- Phase 5 should add optional GitHub metadata enrichment and release verification if it has not already landed earlier.

## Open Verification Items

- Confirm the current SolidStart scaffold scripts, output directory, and static route output before deployment settings are finalized.
- Confirm local Bun version versus planned pinned version during scaffold work.
- Verify the selected Mystic components build cleanly from the pinned GitHub SHA without unsupported deep imports.
- Decide during implementation whether flagship projects get separate `/projects/:slug` routes or strong home-page anchors plus a project index.
- Verify production HTML contains useful content and metadata without client hydration or GitHub availability.
