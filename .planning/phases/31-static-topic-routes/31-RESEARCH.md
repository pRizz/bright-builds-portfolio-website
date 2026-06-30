---
generated_by: gsd-phase-researcher
lifecycle_mode: yolo
phase_lifecycle_id: 31-2026-06-30T22-33-56
generated_at: 2026-06-30T22:47:12.000Z
---

# Phase 31: Static Topic Routes - Research

**Researched:** 2026-06-30
**Domain:** SolidStart static routes, topic discovery, helper-derived metadata, static verification
**Confidence:** HIGH

<user_constraints>

## Locked Decisions

Source: [VERIFIED: `.planning/phases/31-static-topic-routes/31-CONTEXT.md`]

- Build both `/topics` and `/topics/{slug}` from `publicTopics()` before hydration.
- Link public label chips only when labels resolve through `maybeTopicRecordForLabel()`; unsupported labels remain inert.
- Keep topic pages dark-primary and consistent with existing project, writing, and theme route surfaces.
- Add helper-derived topic metadata, JSON-LD, prerender routes, sitemap routes, static verification, and browser coverage.
- Use non-leaking fallback behavior for unknown or unsupported topic slugs.
- Keep OpenLinks as the existing low-intrusion footer/profile/metadata identity surface, not a topic-page CTA.

## Project Constraints

- Repo-local UI defaults to dark mode, with desktop and mobile dark visual verification for UI changes. [VERIFIED: `AGENTS.md`]
- Bright Builds standards require repo-native verification before commit, focused unit tests for pure logic, shallow control flow, and `maybe...` naming for nullable internal values. [VERIFIED: `AGENTS.bright-builds.md`] [VERIFIED: `standards/core/verification.md`] [VERIFIED: `standards/core/testing.md`] [VERIFIED: `standards/core/code-shape.md`]
- TypeScript/Solid work should keep business logic in pure data-in/data-out helpers and use Bun/repo scripts. [VERIFIED: `standards/languages/typescript-javascript.md`]
- The public open-source identity rule is already satisfied by footer OpenLinks placement and Person sameAs JSON-LD; topic pages should not add repeated promotion. [VERIFIED: `src/components/SiteLayout.tsx`] [VERIFIED: `src/domain/seo.ts`]

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
| --- | --- | --- |
| DISC-01 | Visitor can browse a canonical public topic index at `/topics` derived from public projects, writing, and themes. | Extend `src/domain/routes.ts`, add `src/routes/topics/index.tsx`, and render `publicTopics()` statically. |
| DISC-02 | Visitor can open each canonical public topic page at `/topics/{slug}` and see related public projects, writing, and theme paths. | Add `src/routes/topics/[slug].tsx` backed by `maybePublicTopicBySlug()` and `publicContentReferencesForTopic()`. |
| DISC-03 | Public label chips on project, writing, theme, and topic surfaces link to canonical topic pages only when a validated public topic exists. | Add a topic-chip helper/component using `maybeTopicRecordForLabel()` and use it on existing route chip rows. |
| DISC-05 | Topic routes include canonical metadata, structured data, sitemap entries, social image references, and static HTML output that crawlers can read. | Extend `seo.ts`, `routes.ts`, `scripts/verify-static/*`, and route/unit tests. |

</phase_requirements>

## Summary

Phase 31 is a route and verification phase over the Phase 30 topic contract. The existing codebase already has the needed patterns: route lists derive from domain helpers, Solid route files render metadata/JSON-LD through `@solidjs/meta`, static verification checks pre-hydration HTML and metadata in `.output/public`, and browser release checks iterate over `prerenderRoutes`.

The lowest-risk implementation is three plan slices that mirror the roadmap:

1. Add topic route helpers, route registry entries, and dark-primary `/topics` index/detail pages.
2. Add topic-chip linking helpers across existing public surfaces and helper-derived topic metadata/JSON-LD.
3. Extend sitemap, static output, fallback-source, social-image-reference, and browser verification.

No new packages are needed. No visitor-runtime content fetches are needed.

## Standard Stack

| Surface | Existing Pattern | Phase 31 Use |
| --- | --- | --- |
| SolidStart static routing | `app.config.ts` passes `prerenderRoutes` to Vinxi static prerendering. | Add `/topics` and topic detail paths to `prerenderRoutes`. |
| Route registry | `siteRoutes`, `projectDetailRoutes()`, `writingDetailRoutes()`, and `themeDetailRoutes()` compose route lists. | Add a `topics` top-level `SiteRoute` and `topicDetailRoutes()`. |
| Domain topic helpers | `src/domain/topics.ts` exports canonical topics, references, paths, and nullable lookup helpers. | Consume directly; do not duplicate visibility rules in routes. |
| Metadata | `metadataForRoute()`, `metadataForFallbackPage()`, and detail metadata helpers return `PageMetadata`. | Add `metadataForTopic()` and topic ItemList/CollectionPage JSON-LD helpers. |
| Static verification | `scripts/verify-static/expected-route-text.ts`, `metadata-jsonld-verifier.ts`, and `sitemap-assets-verifier.ts`. | Add topic route expected text, metadata/JSON-LD checks, sitemap coverage, unknown route exclusion, and fallback source checks. |
| Browser coverage | `tests/browser-release.playwright.ts` loops over `prerenderRoutes` for axe/layout and uses representative route helpers for keyboard/reduced-motion. | Topic routes automatically join axe/layout through `prerenderRoutes`; add representative topic focus/reduced-motion coverage where needed. |

## Architecture Patterns

### Pattern 1: Helper-Derived Route Lists

`src/domain/routes.ts` should remain the single source for top-level and generated route lists. This already feeds `app.config.ts`, `sitemapXml()`, static verification, and browser release checks.

Recommended additions:

- `RouteId` includes `"topics"`.
- `siteRoutes` includes a `/topics` route with dark-primary discovery copy.
- `topicDetailRoutes()` is exported from `src/domain/topics.ts` or composed in `routes.ts` from `publicTopics().map(topicDetailPath)`.
- `prerenderRoutes` and `sitemapRoutes` append topic detail routes after top-level routes and existing detail routes.

### Pattern 2: Topic UI Uses Existing Card and Chip Classes

Use existing route styles instead of adding a new visual layer:

- Index: `.page-intro`, `.lead`, `ReactiveSurface`, `.theme-grid`, `.theme-card` or `.project-anchor-card`.
- Detail: `.project-detail-layout`, `.project-detail-story`, `.project-detail-aside`, `.writing-related-grid`, `.surface-card`.
- Labels: `.label-row`, `.chip`, `.tier-pill`, `.surface-link`.

This keeps the dark/mobile layout guard useful and avoids one-off CSS.

### Pattern 3: Linked Chips Are a Rendering Concern, Not a New Data Source

The chip helper should accept authored labels and use `maybeTopicRecordForLabel(label)` to decide rendering:

- Resolved topic: render an `<a>` to `topicDetailPath(topic)` using chip-compatible classes and visible focus.
- Unresolved topic: render a plain chip.

The helper should not expose diagnostic reasons and should not fabricate topic paths from raw labels.

### Pattern 4: Topic Metadata Mirrors Existing Detail Helpers

`metadataForTopic(topic, profile)` should:

- canonicalize to `${profile.canonicalOrigin}${topic.canonicalPath}`,
- use a route-specific topic title such as `${topic.label} | Topics | Bright Builds`,
- derive description from public reference counts and label,
- use existing fallback social image behavior until Phase 35 adds generated topic preview assets.

Topic JSON-LD should mirror current `ThemeCollectionPageJsonLd` patterns:

- `/topics`: `ItemList` of `CollectionPage` entries.
- `/topics/{slug}`: `CollectionPage` with `hasPart` entries for public project, writing, and theme references.

### Pattern 5: Verification Extends Existing Checkpoints

Static verification should assert:

- `/topics` and every topic detail route exist in `.output/public`.
- Pre-hydration body includes topic labels, counts, reference titles, summaries, and canonical links.
- Topic metadata and JSON-LD match helper output.
- Sitemap includes `/topics` and all public topic details.
- Unknown topic routes are not prerendered.
- Topic fallback source uses `metadataForFallbackPage()` and does not expose hidden-content reasons.

## Implementation Risks

| Risk | Mitigation |
| --- | --- |
| Topic routes drift from the Phase 30 public contract. | Consume `publicTopics()` and `maybePublicTopicBySlug()` directly; do not read raw registries from route files. |
| Label chip linking creates unsupported routes. | Use `maybeTopicRecordForLabel()` before linking; inert fallback for unresolved labels. |
| Metadata helper changes break existing static verification. | Add focused unit tests before broad static checks and keep fallback image behavior unchanged. |
| Browser route loop grows and slows verification. | Route-loop coverage is intentional; add only one representative topic to custom keyboard/reduced-motion checks. |
| Topic pages visually crowd cards on mobile. | Reuse existing responsive grid classes and verify dark desktop/mobile layout through Playwright. |

## Verification Plan

Run focused checks while implementing:

```bash
bun run test src/domain/topic-routes.test.ts src/domain/writing-metadata.test.ts
bun run typecheck
bun run verify:static
bun run verify:browser
```

Before commit/push, run:

```bash
bun run verify
```

Expected aggregate coverage:

- format and Biome checks,
- TypeScript typecheck,
- Vitest unit tests,
- curation validation including Phase 30 topics,
- no visitor-runtime GitHub usage,
- visual-system guard,
- social-preview check with fallback topic image references,
- production build,
- browser release checks,
- static verification,
- release verification.

## Planning Recommendation

Keep the three roadmap plan files:

- `31-01-PLAN.md`: route registry, topic route helpers if needed, `/topics` index, `/topics/{slug}` detail UI, and focused route/UI tests.
- `31-02-PLAN.md`: topic chip helper/linking across project/writing/theme/topic surfaces plus topic metadata and JSON-LD helpers/tests.
- `31-03-PLAN.md`: static/sitemap/browser verification and unknown-topic fallback-source checks.

</phase_research>

## RESEARCH COMPLETE
