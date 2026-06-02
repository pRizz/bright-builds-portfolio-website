---
generated_by: gsd-discuss-phase
lifecycle_mode: yolo
phase_lifecycle_id: 10-2026-06-02T20-30-24
generated_at: 2026-06-02T20:52:13Z
---

# Phase 10: Project Detail Route Foundation - Context

**Gathered:** 2026-06-02
**Status:** Ready for planning
**Mode:** Yolo

<domain>

## Phase Boundary

This phase establishes the data, route, and prerender foundation for selected project detail pages. It must let maintainers author selected project detail content, derive stable `/projects/{slug}` paths, prerender those paths, and prove selected/unselected behavior through tests.

This phase does not complete the polished detail-page UI, home/project-index navigation changes, project-specific JSON-LD, sitemap route inclusion, or release-readiness documentation updates. Those remain mapped to Phases 11, 12, and 13.

</domain>

<decisions>

## Implementation Decisions

### Detail Selection

- **D-01:** Select detail pages from typed curated project data, not from route filesystem scanning or raw GitHub metadata.
- **D-02:** Use public flagship projects with authored `detail` content as the selected detail-page set for Phase 10.
- **D-03:** Keep supporting, lab, archive, hidden, excluded, and no-detail projects out of generated detail routes until maintainers intentionally promote them.

### Routing

- **D-04:** Add deterministic `projectDetailPath()` and `projectDetailRoutes()` helpers to the functional core.
- **D-05:** Include selected project detail routes in SolidStart prerender output through `prerenderRoutes`.
- **D-06:** Move the project index route to `src/routes/projects/index.tsx` so `src/routes/projects/[slug].tsx` can own nested detail routes.

### Metadata and Verification

- **D-07:** Add initial `metadataForProject()` derivation because Phase 10 requires metadata derivation tests, but do not claim Phase 12 structured-data or sitemap work.
- **D-08:** Update static/release verification so generated detail pages are covered for shell semantics, body content, route-specific metadata, budgets, forbidden GitHub runtime residue, browser axe, and dark layout.
- **D-09:** Explicitly defer project-specific JSON-LD checks on `/projects/:slug` in the release verifier until Phase 12, where `META-02` owns that requirement.

</decisions>

<canonical_refs>

## Canonical References

### Phase Scope

- `.planning/ROADMAP.md` - Phase 10 goal, requirements, dependencies, and success criteria.
- `.planning/REQUIREMENTS.md` - `ROUTE-01`, `ROUTE-02`, `ROUTE-03`, `ROUTE-04`, `STORY-01`, and `VERIFY-01`.
- `.planning/STATE.md` - Active v1.2 milestone state.

### Repo and Standards Guidance

- `AGENTS.md` - Dark-primary UI, GSD workflow, and repo-local verification guidance.
- `AGENTS.bright-builds.md` - Bright Builds plan-first, functional-core, verification, testing, and TypeScript guidance.
- `standards-overrides.md` - No active repo-specific standards overrides.
- Bright Builds canonical standards at commit `05f8d7a6c9c2e157ec4f922a05273e72dab97676`, especially verification and testing guidance.

### Existing Code

- `src/domain/projects.ts` - Curated project registry and selector helpers.
- `src/domain/routes.ts` - Route registry and prerender list.
- `src/domain/seo.ts` - Route metadata, JSON-LD, sitemap, and robots helpers.
- `src/routes/projects/index.tsx` - Existing project index route after nested route move.
- `scripts/verify-static.ts` - Static output verifier.
- `scripts/verify-release.ts` - Release output verifier.
- `tests/browser-release.playwright.ts` - Browser release checks over prerendered routes.

</canonical_refs>

<code_context>

## Existing Code Insights

- The project registry is already the source of truth for curated project copy, placement, links, and helper selectors.
- `routeByPath()` intentionally only knows top-level site routes; detail routes need their own project-specific helpers.
- SolidStart nested routing requires the project index to live at `projects/index.tsx` when a sibling `[slug].tsx` route exists.
- Static verification and release verification enumerate generated HTML, so adding detail routes requires route-aware assertions instead of relying on top-level route defaults.

</code_context>

<deferred>

## Deferred Ideas

- Switch home/project-index cards from anchor links to detail route links in Phase 11.
- Add project-specific JSON-LD and sitemap entries in Phase 12.
- Update release documentation and broader route coverage descriptions in Phase 13.

</deferred>

---

*Phase: 10-project-detail-route-foundation*
*Context gathered: 2026-06-02*
