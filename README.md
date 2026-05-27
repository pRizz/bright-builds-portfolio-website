# bright-builds-portfolio-website

<!-- bright-builds-rules-readme-badges:begin -->

<!-- Managed upstream by bright-builds-rules. If this badge block needs a fix, open an upstream PR or issue instead of editing the downstream managed block. Keep repo-local README content outside this managed badge block. -->

[![GitHub Stars](https://img.shields.io/github/stars/pRizz/bright-builds-portfolio-website)](https://github.com/pRizz/bright-builds-portfolio-website)
[![License](https://img.shields.io/github/license/pRizz/bright-builds-portfolio-website?style=flat-square)](./LICENSE)
[![TypeScript 6.0.3](https://img.shields.io/badge/TypeScript-6.0.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![SolidJS 1.9.13](https://img.shields.io/badge/SolidJS-1.9.13-2C4F7C?logo=solid&logoColor=white)](https://www.solidjs.com/)
[![Vite 8.0.14](https://img.shields.io/badge/Vite-8.0.14-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Bright Builds: Rules](https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/main/public/badges/bright-builds-rules-flat.svg)](https://github.com/bright-builds-llc/bright-builds-rules)
[![OpenLinks profile](https://img.shields.io/badge/OpenLinks-profile-0F172A)](https://openlinks.us/)

<!-- bright-builds-rules-readme-badges:end -->

## Development

This site is a SolidStart static-first portfolio using Bun, Tailwind CSS 3, and a pinned Mystic UI dependency.

### Local Setup

```bash
bun install
bun run dev
```

`bun run dev` starts the local SolidStart server for development.

### Build and Release Checks

Use the aggregate release gate before shipping:

```bash
bun run verify
```

The aggregate gate formats, checks, typechecks, tests, verifies curation, blocks visitor-runtime GitHub usage, checks the visual system, builds the production static output, verifies static prerendered routes, and then runs the release verifier.

Useful scripts:

- `bun run dev`: start the local SolidStart dev server.
- `bun run build`: create the production static build in `.output/public`.
- `bun run verify:static`: confirm the generated HTML exists for the current prerender routes.
- `bun run verify:release`: run the post-build release verifier over `.output/public`.
- `bun run typecheck`: run TypeScript without emitting files.
- `bun run format:check`: check formatting with Biome.
- `bun run check`: run Biome checks.
- `bun run test`: run Vitest unit tests for the pure foundation modules.

The direct release verifier expects `bun run build` and `bun run verify:static` to have already produced and checked `.output/public`.

### Static Deployment

The release artifact is `.output/public`. Deployment assumes a static host serves that directory as the site root, including prerendered route HTML, local icon/social assets, `robots.txt`, and `sitemap.xml`.

### Optional GitHub Metadata Refresh

GitHub metadata enrichment is advisory and checked in as a static snapshot. Refresh it only when curated direct repository links should pull updated public repository facts:

```bash
bun run sync:github-metadata
bun run sync:github-metadata:strict
```

The sync script can use an optional non-public `GITHUB_METADATA_TOKEN` for higher API limits. Do not expose token values in docs, source comments, or built output.
