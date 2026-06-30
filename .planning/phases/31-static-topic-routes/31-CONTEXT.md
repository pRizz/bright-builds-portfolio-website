---
generated_by: gsd-discuss-phase
lifecycle_mode: yolo
phase_lifecycle_id: 31-2026-06-30T22-33-56
generated_at: 2026-06-30T22:33:56.035Z
---

# Phase 31: Static Topic Routes - Context

**Gathered:** 2026-06-30
**Status:** Ready for planning
**Mode:** Yolo

<domain>

## Phase Boundary

Phase 31 turns the Phase 30 public topic/reference contract into crawler-readable visitor surfaces. Visitors should be able to browse `/topics`, open every canonical public `/topics/{slug}` page, follow validated topic chips from public project, writing, theme, and topic surfaces, and receive non-leaking fallback behavior for unknown or unsupported topic slugs.

This phase should add route, metadata, sitemap, static-output, and targeted browser coverage for topic pages. It should not add project/writing filtering or search controls, feed output, centralized related-work ranking, generated topic social preview assets, release-evidence copy expansion, CMS/admin behavior, or visitor-runtime content fetches. Those remain later v1.6 phases.

</domain>

<decisions>

## Implementation Decisions

### Topic Route Shape and Layout

- **D-01:** Add `/topics` as a top-level static discovery route that lists all `publicTopics()` before hydration in the existing dark-primary index-card style.
- **D-02:** Add `/topics/{slug}` as canonical static topic detail routes for every public topic returned by `publicTopics()`.
- **D-03:** Topic index cards should show the canonical topic label, a concise topic summary, counts for public projects/writing/themes, and a link to the topic detail route.
- **D-04:** Topic detail pages should show the canonical label, a non-leaking summary, grouped public references by kind, and each reference's title, summary, canonical path, and kind-specific facets where already safe.
- **D-05:** Use existing `visual-surface`, `project-anchor-card`, `theme-grid`, `writing-related-grid`, `.chip`, `.tier-pill`, and `ReactiveSurface` patterns rather than introducing a new visual system.

### Topic Linking Across Public Surfaces

- **D-06:** Public label chips on project index/detail, writing index/detail, theme index/detail, and topic detail surfaces should become links only when `maybeTopicRecordForLabel(label)` resolves to a canonical topic.
- **D-07:** Unsupported labels should remain inert chips with the same visual weight, so visitor-facing UI does not reveal whether a label is unknown, hidden, unsupported, or deferred.
- **D-08:** Introduce a small local route/component helper for topic chips if it prevents copy/paste, but keep it simple and compatible with the existing route files.
- **D-09:** Linked chips should use ordinary anchor semantics, visible focus, adequate touch targets, and the existing dark chip palette; no faceted query URLs are in scope.

### Metadata, Structured Data, and Static Discovery

- **D-10:** Add helper-derived topic metadata in `src/domain/seo.ts`, including title, description, canonical URL, OG/Twitter fields, and fallback social image selection through the existing metadata helper contract.
- **D-11:** Add JSON-LD for `/topics` as an `ItemList` of topic `CollectionPage` entries and for `/topics/{slug}` as a `CollectionPage` with `hasPart` entries for public project, writing, and theme references.
- **D-12:** Extend `src/domain/routes.ts` with a `topics` top-level route plus helper-derived topic detail routes in `prerenderRoutes` and `sitemapRoutes`.
- **D-13:** Add sitemap coverage for `/topics` and every public topic detail route, while excluding unknown or unsupported topic routes.
- **D-14:** Topic social image references should keep the current fallback image unless Phase 35 later adds generated generic/topic preview assets.

### Fallback and Hidden-Content Safety

- **D-15:** Unknown, malformed, unsupported, unreferenced, private, draft, hidden, archived, or otherwise non-public topic slugs should render one non-leaking fallback page with fallback metadata canonicalized to `/topics`.
- **D-16:** The fallback should say only that no public topic is available and invite visitors back to `/topics`; it must not distinguish unknown topics from hidden or unsupported ones.
- **D-17:** Static output verification should assert that unknown topic routes are not prerendered and that static HTML for topic pages contains only public references.

### Verification and Browser Coverage

- **D-18:** Add focused unit tests for topic route helpers, topic metadata, topic JSON-LD, and safe topic-chip link decisions.
- **D-19:** Extend static verification expected-route text, metadata/JSON-LD assertions, sitemap coverage, and fallback-source checks for topic routes.
- **D-20:** Extend browser release coverage so `/topics` and a representative topic detail route receive axe, dark desktop/mobile layout, keyboard focus, and reduced-motion checks through the existing route loop.
- **D-21:** Run the repo-owned aggregate verification after implementation: `bun run verify`, with focused checks during development as useful.

### OpenLinks and Product Chrome

- **D-22:** Preserve the existing footer OpenLinks profile link and Person JSON-LD sameAs behavior as the low-intrusion identity surface.
- **D-23:** Topic pages should keep Bright Builds, topics, projects, writing, and themes primary; do not add new prominent OpenLinks promotion inside topic cards or topic CTAs.

### the agent's Discretion

- Exact component boundaries, helper names, and route copy are delegated to implementation as long as route lists remain helper-derived, nullable helpers use `maybe...` where applicable, and public helper logic stays pure.
- The planner may decide whether topic chip rendering is a standalone component or a local function reused across route files.
- The planner may decide the concise topic summary wording as long as it is derived from canonical topic labels and public reference counts, not invented hidden context.
- The planner may choose the smallest practical browser-check addition because the existing `prerenderRoutes` loop will automatically cover most route accessibility and layout checks once topic routes are in the route registry.

</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Scope

- `.planning/ROADMAP.md` - Phase 31 goal, DISC-01/DISC-02/DISC-03/DISC-05 mapping, success criteria, plan split, and later-phase boundaries.
- `.planning/REQUIREMENTS.md` - v1.6 discovery requirements, static-first constraints, and out-of-scope exclusions.
- `.planning/PROJECT.md` - Current v1.6 state, curated-content authority, static deployment constraints, and OpenLinks low-intrusion decision.
- `.planning/phases/30-content-discovery-foundation/30-CONTEXT.md` - Locked topic/reference decisions, non-leaking lookup behavior, and Phase 31 deferrals.
- `.planning/phases/30-content-discovery-foundation/30-01-SUMMARY.md` - Implemented Phase 30 helper surface and verification evidence.
- `AGENTS.md` - Repo-local dark-primary UI guidance, Bright Builds workflow requirements, and GSD artifact requirements.
- `AGENTS.bright-builds.md` - Bright Builds baseline workflow, TypeScript, verification, testing, frontend, code-shape, and OpenLinks guidance.
- `standards-overrides.md` - No active local exceptions beyond the placeholder table.

### Existing Domain and Route Contracts

- `src/domain/topics.ts` - Canonical topics, `publicTopics()`, `maybePublicTopicBySlug()`, `maybeTopicRecordForLabel()`, `topicDetailPath()`, and public topic reference helpers.
- `src/domain/topic-validation.ts` - Validator-only topic/reference diagnostics that public route helpers must not expose.
- `src/domain/routes.ts` - Site route registry, prerender route composition, sitemap route composition, and fallback route lookup style.
- `src/domain/seo.ts` - Existing metadata, sitemap, Person, ItemList, project, writing, and theme JSON-LD helper patterns.
- `src/domain/projects.ts` - Public project selectors, project route helpers, public label sources, and selected detail page behavior.
- `src/domain/writing.ts` - Public writing selectors, nullable lookup, writing route helpers, topics/tags, and related project helpers.
- `src/domain/themes.ts` - Public theme selectors, nullable lookup, theme route helpers, and project/writing relationship helpers.
- `src/domain/social-previews.ts` - Existing fallback social image contract and helper-derived route image selection.

### Existing UI, Verification, and Browser Patterns

- `src/routes/projects/index.tsx` - Project index layout, label chips, route metadata, and JSON-LD rendering pattern.
- `src/routes/projects/[slug].tsx` - Detail fallback metadata pattern, project facts chips, and related writing/theme panel patterns.
- `src/routes/writing/index.tsx` - Writing index layout and topic/tag chip pattern.
- `src/routes/writing/[slug].tsx` - Writing detail fallback, article metadata, and topic/tag detail chip pattern.
- `src/routes/themes/index.tsx` - Theme index card pattern and relationship count chips.
- `src/routes/themes/[slug].tsx` - Theme detail fallback, metadata helper use, related projects/writing panels, and collaboration panel scope.
- `src/components/SiteLayout.tsx` - Header/footer navigation and existing low-intrusion OpenLinks footer placement.
- `src/styles/app.css` - Dark-primary surfaces, chips, link focus, responsive grids, and reduced-motion rules.
- `scripts/verify-static/expected-route-text.ts` - Static expected text route resolver to extend with topic route output.
- `scripts/verify-static/metadata-jsonld-verifier.ts` - Route metadata, JSON-LD, and social image verification helpers to extend for topics.
- `scripts/verify-static/sitemap-assets-verifier.ts` - Sitemap, no-prerendered-unknown-route, and fallback-source verification patterns.
- `tests/browser-release.playwright.ts` - Axe, dark desktop/mobile layout, keyboard focus, and reduced-motion browser checks.

### Standards

- `standards/core/frontend-ui.md` - Dark default, public source/identity disclosure, and OpenLinks low-intrusion product chrome.
- `standards/core/architecture.md` - Keep route-supporting topic data transforms in pure helpers.
- `standards/core/code-shape.md` - Use shallow control flow and `maybe...` naming for nullable values.
- `standards/core/testing.md` - Unit test pure route/metadata/chip logic with focused Arrange/Act/Assert tests.
- `standards/core/verification.md` - Run repo-native checks before commit and prefer aggregate/owned commands.
- `standards/languages/typescript-javascript.md` - Keep TypeScript business logic pure, use Bun/repo scripts, and avoid new Python automation.

</canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- `publicTopics()`, `maybePublicTopicBySlug()`, `publicContentReferencesForTopic()`, `topicDetailPath()`, and `maybeTopicRecordForLabel()` in `src/domain/topics.ts` provide the public route, fallback, reference, and label-linking surface.
- `metadataForRoute()`, `metadataForFallbackPage()`, `metadataForProject()`, `metadataForWritingEntry()`, and `metadataForTheme()` provide the metadata helper pattern to extend for topic pages.
- `projectItemListJsonLd()`, `writingItemListJsonLd()`, `themeItemListJsonLd()`, and `themeCollectionPageJsonLd()` provide JSON-LD structures that can guide topic ItemList and CollectionPage output.
- Existing route files already use `.page-intro`, `.lead`, `.project-anchor-card`, `.surface-card`, `.theme-card`, `.label-row`, `.chip`, `.tier-pill`, `.surface-link`, and `ReactiveSurface`.
- `prerenderRoutes` already feeds browser release loops and static verification; adding topic routes there should give broad coverage automatically.

### Established Patterns

- Public route surfaces derive from domain helpers rather than duplicating raw registry visibility checks.
- Unknown detail routes render a non-leaking fallback page with `metadataForFallbackPage()` and a link back to the index route.
- Static verification checks both pre-hydration body text and metadata/JSON-LD in built `.output/public` HTML.
- Sitemap verification asserts public detail route inclusion and unknown/non-public route exclusion.
- Browser checks run axe for every prerendered route, dark desktop/mobile layout for every route, keyboard smoke paths for representative journeys, and reduced-motion checks for representative routes.
- The root document stays dark through `.dark`, and user-facing UI should avoid light-first utility classes unless there is a clear local reason.

### Integration Points

- Add topic route helpers to `src/domain/routes.ts` so SolidStart prerendering, sitemap generation, browser loops, and static verification share the same source.
- Add topic metadata/JSON-LD helpers to `src/domain/seo.ts` and cover them with focused tests.
- Add `src/routes/topics/index.tsx` and `src/routes/topics/[slug].tsx` using existing Solid route patterns.
- Update project, writing, theme, and topic route UI to render linked canonical topic chips only for labels that resolve through `maybeTopicRecordForLabel()`.
- Extend static verification and browser release checks after route helpers and UI are in place.

</code_context>

<specifics>

## Specific Ideas

- Treat `/topics` as a discovery map, not a replacement for `/themes`; topics are label-level navigation, while themes remain narrative paths.
- Keep card and chip density compact and scan-friendly so the topic pages feel like a practical discovery surface rather than a marketing landing page.
- Use count labels such as `3 projects`, `2 notes/essays`, and `1 theme path` to help visitors understand topic depth before opening details.
- Keep unknown-topic copy deliberately bland: no public topic here, browse topics.
- Preserve the existing footer OpenLinks profile link and sameAs metadata; do not add topic-specific OpenLinks CTAs.

</specifics>

<deferred>

## Deferred Ideas

- Project and writing filtering/search controls belong to Phase 32.
- Static writing-first feed output and feed autodiscovery belong to Phase 33.
- Centralized related-work ranking and panels belong to Phase 34.
- Generated generic/topic social preview assets and manifest entries belong to Phase 35.
- Release-readiness evidence label expansion and milestone-wide verification polish belong to Phase 36.

</deferred>

***

*Phase: 31-static-topic-routes*
*Context gathered: 2026-06-30*
