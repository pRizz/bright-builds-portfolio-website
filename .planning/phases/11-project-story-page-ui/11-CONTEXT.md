---
generated_by: gsd-discuss-phase
lifecycle_mode: yolo
phase_lifecycle_id: 11-2026-06-02T21-03-50
generated_at: 2026-06-02T21:14:32Z
---

# Phase 11: Project Story Page UI - Context

**Gathered:** 2026-06-02
**Status:** Ready for planning
**Mode:** Yolo

<domain>

## Phase Boundary

This phase turns the Phase 10 project detail route foundation into a readable project story experience. It must improve detail page layout, expose authored story sections, surface project links and GitHub snapshot facts, and route selected home/project-index cards into detail pages.

This phase does not complete project-specific JSON-LD, sitemap inclusion, social preview generation, or release-readiness documentation. Those remain mapped to Phases 12 and 13.

</domain>

<decisions>

## Implementation Decisions

### Navigation

- **D-01:** Add a `projectStoryHref()` helper so selected projects link to `/projects/{slug}` and unselected projects keep `/projects#slug`.
- **D-02:** Use `projectStoryHref()` in home focus rows, home story cards, and project index card titles/actions.
- **D-03:** Keep `projectAnchorHref()` stable for hash-anchor behavior and tests; Phase 11 should not remove project index anchors.

### Detail Page UI

- **D-04:** Split detail pages into a story column and a facts/actions column using existing dark visual surfaces.
- **D-05:** Keep authored narrative first: problem, approach, why it matters, technical shape, current status, and collaboration angle.
- **D-06:** Put proof points, GitHub snapshot facts, labels, and project actions in supporting panels so they do not replace the narrative.
- **D-07:** Use existing classes and small CSS additions rather than introducing a new component library or broad visual refactor.

### Verification

- **D-08:** Extend focused unit tests for selected/unselected project story hrefs.
- **D-09:** Extend static verification to assert selected detail links, richer detail page sections, action links, and detail GitHub metadata facts.
- **D-10:** Rely on existing Playwright browser release checks for desktop/mobile dark layout, overlap, axe, keyboard, and reduced-motion coverage across all prerendered routes.

</decisions>

<canonical_refs>

## Canonical References

- `.planning/ROADMAP.md` - Phase 11 goal and success criteria.
- `.planning/REQUIREMENTS.md` - Phase 11 requirements `STORY-02`, `STORY-03`, `STORY-04`, `NAV-01`, `NAV-02`, and `NAV-03`.
- `.planning/phases/10-project-detail-route-foundation/10-CONTEXT.md` - Phase 10 boundary and deferred metadata decisions.
- `AGENTS.md` - Dark-primary UI and visual verification requirements.
- `AGENTS.bright-builds.md` - Functional-core, TypeScript, test, and verification guidance.
- `standards-overrides.md` - No active local standards overrides.

</canonical_refs>

<code_context>

## Existing Code Insights

- `src/domain/projects.ts` owns project selectors and route helpers; a story-link helper belongs there.
- `src/routes/index.tsx` and `src/routes/projects/index.tsx` already render project cards and metadata rows.
- `src/routes/projects/[slug].tsx` already renders selected detail route content and can be expanded without changing route ownership.
- `src/styles/app.css` already contains dark surface, chip, link, card, story, and GitHub metadata classes.
- `scripts/verify-static.ts` already checks generated detail route text and metadata, so it is the right place to assert Phase 11 static body/link behavior.

</code_context>

<deferred>

## Deferred Ideas

- Add project-specific JSON-LD and sitemap route entries in Phase 12.
- Update release-readiness docs and aggregate route coverage descriptions in Phase 13.

</deferred>

---

*Phase: 11-project-story-page-ui*
*Context gathered: 2026-06-02*
