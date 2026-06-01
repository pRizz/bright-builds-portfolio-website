# Architecture Research: v1.2 Project Story Pages

**Milestone:** v1.2 Project Story Pages
**Researched:** 2026-06-01
**Scope:** How static project detail pages should integrate with the existing portfolio architecture.

## Current Architecture

The portfolio already has the right shape for v1.2:

- `src/domain/projects.ts` owns curated project records and selector helpers.
- `src/domain/routes.ts` owns static site routes and `prerenderRoutes`.
- `src/domain/seo.ts` owns metadata, JSON-LD, sitemap, and robots helpers.
- Solid route files render pages from pure domain data.
- `app.config.ts` prerenders routes from `prerenderRoutes`.
- Verification scripts inspect generated `.output/public` and source modules.

## Recommended Integration

### 1. Derive Public Project Detail Routes

Add pure route helpers that derive project detail paths from curated project records selected for public detail pages.

Suggested shape:

- Add an inclusion flag or selector such as `includeProjectDetailPage`.
- Add `projectDetailPath(project)` returning `/projects/{slug}`.
- Add `projectDetailRoutes()` and include them in `prerenderRoutes`.
- Keep `/projects` as the index page.

### 2. Extend Project Story Data

Extend `ProjectStory` only where the existing `story` fields are too thin for a detail page.

Useful detail fields:

- `summary` or `intro`
- `technicalShape`
- `collaborationAngle`
- `proofPoints` or `highlights`
- `nextSteps` or `statusNote`

Keep fields typed and validated. Avoid moving content to markdown until there is a concrete editing pain.

### 3. Add a Project Detail Route

Use SolidStart file routing to add a project detail route, likely `src/routes/projects/[slug].tsx`.

The route should:

- Resolve only public detail projects.
- Render meaningful static HTML for selected project pages.
- Preserve dark-primary shell and existing design primitives.
- Provide source/live/docs links with safe external-link behavior.
- Provide index/back navigation without relying on client-only routing.

### 4. Add Project Metadata Helpers

Add pure helpers in `src/domain/seo.ts`:

- `metadataForProject(project, profile)`
- `projectJsonLd(project, profile)`
- project-aware sitemap URL generation
- project social image metadata fallback

Update existing item-list URLs from `/projects#slug` to detail pages for projects with detail routes.

### 5. Update Verification as the Contract

The verification surface should expand with the routes:

- `verify-static` checks each project route exists and includes required story text and metadata.
- Playwright browser release checks iterate all `prerenderRoutes`, so adding project routes there should automatically add axe/layout coverage.
- Release budgets should remain route-aware and avoid making total budgets too fragile as more static pages are added.
- Project helper surface guard should allow any new documented selector exports.

## Suggested Build Order

1. Add typed route/content/metadata helpers and tests.
2. Render project detail pages and update home/index navigation.
3. Add project-specific social/sitemap/static verification coverage.
4. Fold project routes into browser/release verification and docs.
