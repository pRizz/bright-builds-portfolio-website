# Research Summary

**Project:** Bright Builds Portfolio Website
**Milestone:** v1.2 Project Story Pages
**Synthesized:** 2026-06-01
**Sources:** `STACK.md`, `FEATURES.md`, `ARCHITECTURE.md`, `PITFALLS.md`

## Key Findings

**Stack additions:** None required. v1.2 should extend the existing SolidStart static architecture, typed curated project registry, pure SEO helpers, generated sitemap/robots, and Playwright/static/release verification gates.

**Feature table stakes:** Selected public projects need stable static detail routes, authored narratives, safe source/live links, route-specific metadata, structured data, sitemap coverage, social preview support, overview-to-detail navigation, and verification in the existing clean-builder release gate.

**Architecture:** Derive detail routes from curated project data. Keep project content, route derivation, metadata, JSON-LD, and sitemap behavior in pure TypeScript helpers. Use Solid route files as the rendering shell and keep generated `.output/public` as the proof surface.

**Watch out for:** Do not build a raw repo mirror, split content authority across unneeded formats, ship client-only SEO, reintroduce visitor-runtime GitHub calls, or add dynamic OG/server rendering in this milestone.

## Recommended Requirement Categories

- `ROUTE`: static project detail route derivation and prerender coverage.
- `STORY`: authored project narrative fields and detail-page rendering.
- `META`: project-specific metadata, JSON-LD, sitemap, and social preview support.
- `NAV`: home/project-index/detail navigation.
- `VERIFY`: static, browser, curation, and release verification coverage.

## Recommended Build Order

1. Add typed detail-route, content, and metadata helpers with tests.
2. Render selected project detail pages and update home/project index navigation.
3. Add project-specific sitemap, JSON-LD, and social preview support.
4. Expand static/browser/release verification and docs to include project detail routes.

## Deferred

- Dedicated writing or notes surface.
- CMS/admin tooling.
- Dynamic OG image endpoints.
- Detail pages for every public repository.
- Runtime GitHub API usage.
