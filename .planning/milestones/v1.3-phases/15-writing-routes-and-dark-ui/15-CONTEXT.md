---
generated_by: gsd-discuss-phase
lifecycle_mode: yolo
phase_lifecycle_id: 15-2026-06-13T16-56-50
generated_at: 2026-06-13T16:59:39.498Z
---

# Phase 15 Context: Writing Routes and Dark UI

## Phase Brief

Visitors can browse and read public writing routes, then move between notes and selected project stories without runtime data dependencies.

## Requirements

- ROUTE-01: Visitor can open a stable `/writing` index listing public writing entries in curated or reverse-chronological order.
- ROUTE-02: Visitor can open stable `/writing/{slug}` static detail routes for every public writing entry.
- ROUTE-03: Clean static builds prerender `/writing` and every public writing detail route before hydration.
- ROUTE-04: Hidden, draft, archived-only, or otherwise unpublished writing entries do not create public detail pages.
- READ-01: Visitor can understand each writing entry's main idea, context, and relevance from the static detail page.
- READ-02: Writing index and detail pages preserve dark-primary responsive layout, accessible headings, readable body text, and stable text layout on desktop and mobile.
- READ-03: Writing detail pages provide clear paths back to the writing index and onward to related projects when relationships exist.
- LINK-02: Project detail pages can display related writing links derived from writing data without duplicating relationship data on project records.

## Relevant Existing Context

- Phase 14 created the typed writing registry and pure helper surface in `src/domain/writing.ts`.
- Existing helper surface includes `publicWritingEntries`, `maybePublicWritingEntryBySlug`, `writingDetailPath`, `writingDetailRoutes`, and `relatedProjectDetailPageProjects`.
- Existing validation already rejects malformed writing entries and unsupported related project slugs.
- `src/domain/routes.ts` currently knows top-level site routes and project detail prerender routes, but not writing routes.
- `src/components/SiteLayout.tsx` renders primary navigation from `navigationRoutes`, so adding a nav route should stay data-driven.
- `src/routes/projects/[slug].tsx` owns project detail pages and is the correct place to show related writing derived from writing data.
- `src/styles/app.css` contains the dark-primary shell, surfaces, chips, link lists, responsive grids, and reduced-motion guards to reuse for the writing surface.
- `scripts/verify-static.ts` derives expected static routes from `prerenderRoutes`, so writing route inclusion can become a build-time proof without hard-coded route lists.

## Auto-Selected Decisions

### Route Surface

- Add `/writing` as a first-class top-level route and primary navigation item.
- Add static writing detail pages at `/writing/{slug}` for public writing entries only.
- Derive writing detail prerender paths from `writingDetailRoutes()` instead of duplicating slugs.
- Keep draft, hidden, archived-only, unpublished, and unknown slugs out of generated public detail pages.
- Unknown writing slugs should render a non-leaking not-found state with a path back to `/writing`.

### Writing Index

- Use `publicWritingEntries()` as the source of truth and preserve the curated `displayOrder` from the writing domain helper.
- Make the first viewport the actual writing list, not a marketing landing page.
- Show title, summary, kind, publication/update date where available, topics, tags, and related project count or link hint.
- Do not add search, tag archives, pagination, RSS, comments, CMS, newsletter signup, or MDX parsing in this phase.

### Writing Detail

- Render the typed body blocks directly from `sections`; do not introduce a Markdown parser.
- Use accessible article structure with headings, readable body text, stable text wrapping, and dark-first surfaces.
- Include a clear "Back to writing" path.
- Link to related selected project detail pages through `relatedProjectDetailPageProjects(entry)`.
- Keep reading content stable and low-motion; any reactive surface treatment should be limited to cards and non-essential affordances.

### Project Cross-Links

- Add project-to-writing cross-links by deriving relationships from the writing registry, not by adding reciprocal fields to project records.
- Show a related writing section on selected project detail pages only when public writing references that project.
- Keep the project index focused on project grouping; no project index writing badges are required in this phase.

### SEO And Release Boundary

- It is acceptable for `/writing` to use the existing route metadata pattern.
- Full writing detail metadata, JSON-LD, sitemap-specific assertions, and richer social discovery belong to Phase 16.
- Browser release gate expansion and release evidence label changes belong to Phase 17.
- This phase should still prove static generation and dark UI behavior for the new routes.

## Implementation Guidance

- Prefer small pure helpers in `src/domain/writing.ts` for route and cross-link derivation.
- Update `src/domain/routes.ts` so route, nav, and prerender data stay centralized.
- Add route files under `src/routes/writing/`.
- Reuse existing CSS classes where possible, adding writing-specific classes only for layout/readability needs.
- Keep new CSS dark-primary and avoid light-first utilities.
- Avoid nested cards; use cards only for repeated writing/project/link items.
- Preserve text wrapping with `min-width: 0`, `overflow-wrap: anywhere`, and responsive grid constraints where needed.

## Verification Guidance

- Add focused unit tests for route derivation and project-to-writing helper behavior.
- Build the static output and verify `/writing` plus each public detail route appears before hydration.
- Run the project type/lint/test/build/verify commands required by the repo.
- Because this is UI work, visually inspect desktop and mobile dark rendering for `/writing` and one writing detail page.
- Verify no text overlap, unreadable contrast, or unstable long-link layout is introduced.

## Deferred Work

- Phase 16: writing-specific detail metadata, JSON-LD, sitemap discovery requirements, and social sharing polish.
- Phase 17: browser release suite expansion, reduced-motion route coverage labels, release readiness evidence, and aggregate verification contract updates.
- Future only: RSS, search, tag archive pages, newsletter capture, comments, CMS/admin, MDX ingestion, dynamic OG images, and runtime GitHub/API calls.
