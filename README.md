# bright-builds-portfolio-website

<!-- bright-builds-rules-readme-badges:begin -->

<!-- Managed upstream by bright-builds-rules. If this badge block needs a fix, open an upstream PR or issue instead of editing the downstream managed block. Keep repo-local README content outside this managed badge block. -->

[![GitHub Stars](https://img.shields.io/github/stars/pRizz/bright-builds-portfolio-website)](https://github.com/pRizz/bright-builds-portfolio-website)
[![License](https://img.shields.io/github/license/pRizz/bright-builds-portfolio-website?style=flat-square)](./LICENSE)
[![Bright Builds: Rules](https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/main/public/badges/bright-builds-rules-flat.svg)](https://github.com/bright-builds-llc/bright-builds-rules)
[![OpenLinks profile](https://img.shields.io/badge/OpenLinks-profile-0F172A)](https://openlinks.us/)

<!-- bright-builds-rules-readme-badges:end -->

## Development

This site is a SolidStart static-first portfolio foundation using Bun, Tailwind CSS 3, and a pinned Mystic UI dependency.

```bash
bun install
bun run dev
bun run verify
```

Useful scripts:

- `bun run dev`: start the local SolidStart dev server.
- `bun run build`: create the production static build.
- `bun run verify:static`: confirm the generated HTML exists for the current prerender routes.
- `bun run typecheck`: run TypeScript without emitting files.
- `bun run format:check`: check formatting with Biome.
- `bun run check`: run Biome checks.
- `bun run test`: run Vitest unit tests for the pure foundation modules.
