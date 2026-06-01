# Stack Research: v1.2 Project Story Pages

**Milestone:** v1.2 Project Story Pages
**Researched:** 2026-06-01
**Scope:** Stack additions or changes needed to add static per-project story pages to the existing Bright Builds portfolio.

## Recommendation

No new production dependency is needed for v1.2.

Use the existing SolidStart static stack:

- SolidStart static prerender through `app.config.ts`.
- Typed route derivation in `src/domain/routes.ts`.
- Curated project data and selectors in `src/domain/projects.ts`.
- SEO, JSON-LD, sitemap, and social metadata helpers in `src/domain/seo.ts`.
- Generated sitemap/robots through `scripts/generate-static-metadata.ts`.
- Existing verification gates: `bun run install:browser && bun run verify`.

## Likely Stack Touchpoints

| Area | Existing Surface | v1.2 Use |
| --- | --- | --- |
| Routes | `src/routes/projects.tsx`, `src/domain/routes.ts`, `app.config.ts` | Add static project detail routes derived from selected curated project slugs. |
| Content | `src/domain/projects.ts` | Extend project story data with detail-page fields instead of adding a CMS. |
| SEO | `src/domain/seo.ts` | Add project-specific metadata, project JSON-LD, canonical URLs, and sitemap entries. |
| Static assets | `public/social/bright-builds-og.png` | Add deterministic project social image/card support if it can stay static and checked. |
| Verification | `scripts/verify-static.ts`, `tests/browser-release.playwright.ts`, `scripts/verify-release.ts` | Ensure new project routes are prerendered, readable, accessible, and covered by budgets. |

## Dependency Guidance

- Prefer CSS/HTML static project cards for project-specific social previews before adding image-generation tooling.
- If static raster OG generation becomes necessary, keep it as a build-time script and checked output, not a runtime endpoint.
- Do not introduce CMS, MDX, server routes, database storage, analytics, or dynamic OG rendering in v1.2.
- Keep project content authored in TypeScript so existing validation and selectors stay useful.

## Version Notes

The repo already pins the relevant framework stack:

- `@solidjs/start@1.3.2`
- `solid-js@1.9.13`
- `@solidjs/router@0.16.1`
- `@solidjs/meta@0.29.4`
- `bun@1.3.14`
- `tailwindcss@3.4.19`
- `@playwright/test@1.60.0`

No current v1.2 requirement needs a version change.
