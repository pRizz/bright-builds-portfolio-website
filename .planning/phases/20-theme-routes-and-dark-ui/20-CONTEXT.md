---
generated_by: gsd-discuss-phase
lifecycle_mode: yolo
phase_lifecycle_id: 20-2026-06-17T16-16-59
generated_at: 2026-06-17T16:16:59.817Z
---

# Phase 20: Theme Routes and Dark UI - Context

**Gathered:** 2026-06-17
**Status:** Ready for planning
**Mode:** Yolo

<domain>

## Phase Boundary

Phase 20 turns the Phase 19 theme domain layer into visitor-facing static route surfaces. Visitors should be able to open `/themes`, choose from public theme paths, open each public `/themes/{slug}` detail page, and understand the theme's main idea, audience, proof points, and connection to existing selected project stories and public writing before hydration.

This phase should wire route registration, prerender coverage, route components, non-leaking fallback behavior, and dark-primary responsive UI. It should not build Phase 21 collaboration pathways or theme-aware links on project/writing pages, should not add Phase 22 theme metadata/JSON-LD/sitemap/social-preview contracts, and should not add Phase 23 release-contract or browser-suite expansion beyond verification directly needed for this route/UI work.

</domain>

<decisions>

## Implementation Decisions

### Theme Index Presentation

- **D-01:** Build `/themes` as a responsive card-grid index, not a dense link list or grouped guide. Use `publicThemeEntries()` as the only source of public theme records and `themeDetailPath()` for every detail link.
- **D-02:** Keep index cards as curated entry points with the theme title, summary, audience, a small set of helper-derived relationship counts or labels, and a descriptive "Explore theme" style link. Avoid turning cards into mini detail pages or duplicating related project/writing copy.
- **D-03:** Add a `Themes` navigation route if needed by the existing `siteRoutes`/`navigationRoutes` pattern. Keep the label short and consistent with the existing Home/About/Projects/Writing/Contact nav.

### Theme Detail Synthesis

- **D-04:** Build each `/themes/{slug}` page as a theme-specific hybrid hub: a `page-intro` for the main idea, focused sections for why the theme matters/audience/proof points, and related project/writing cards resolved from Phase 19 helpers.
- **D-05:** Related projects and writing must render display content from existing project and writing records through `relatedProjectDetailPageProjectsForTheme()` and `relatedWritingEntriesForTheme()`. Do not denormalize or copy project/writing descriptions into theme route components.
- **D-06:** Do not add Phase 21 collaboration panels, new external action sources, or primary OpenLinks CTAs in this phase. Treat `collaborationAngle` as reserved context for the next phase unless the planner finds a clearly non-CTA, low-prominence note is required to explain the theme.
- **D-07:** Keep the detail page semantic: one H1, descriptive section headings, card/list structures with real anchors, and no whole-card click traps that weaken link text or keyboard behavior.

### Static Route and Fallback Safety

- **D-08:** Use the domain allowlist approach. Import `themeDetailRoutes()` into `src/domain/routes.ts` and include `/themes` plus every public theme detail route in `prerenderRoutes`.
- **D-09:** Keep `crawlLinks: false`; do not switch to crawler-derived prerendering. Generated static routes should come from pure helper output, not from whatever links happen to render in the DOM.
- **D-10:** Gate detail route rendering with `maybePublicThemeEntryBySlug()`. Unknown, draft, hidden, unsupported, archived, or otherwise non-public slugs should all get the same generic fallback.
- **D-11:** The fallback must not echo the raw slug, status, private registry fields, or any content from non-public theme records. It should direct visitors back to `/themes`.

### Dark Responsive UI

- **D-12:** Reuse the existing dark-primary visual system first: `page-intro`, `page-title`, `lead`, `visual-surface`, `interactive-surface`, `reactive-card`, `theme-card`, `project-anchor-card`, `surface-card`, `chip`, `tier-pill`, `label-row`, `link-list`, and related writing/project grid patterns.
- **D-13:** Add only small route-specific CSS when existing classes cannot provide stable grid/layout behavior. Do not introduce new UI dependencies, new motion libraries, or a broad visual-system refactor.
- **D-14:** Preserve the existing reduced-motion/coarse-pointer/mobile guards. Any hover/focus treatment must degrade cleanly under `prefers-reduced-motion`, coarse pointer, and mobile viewport conditions.
- **D-15:** The implementation must explicitly protect text wrapping and readability on desktop and mobile dark rendering. Long titles, proof points, chips, and links should not overflow or overlap.

### Metadata Boundary

- **D-16:** Phase 20 may add the minimal route registry fields needed for the `/themes` index to fit existing app routing/navigation patterns. Full route-specific theme metadata, Open Graph/Twitter tags, JSON-LD, sitemap behavior, and social-preview verification belong to Phase 22.
- **D-17:** Do not claim hosted/live or release-contract coverage in this phase. Verification should prove the new route/UI behavior introduced here, and later phases will expand release evidence.

### the agent's Discretion

- The planner may decide whether theme route card rendering should live directly in route files or in a small local component, as long as the abstraction is justified by repeated markup and stays within the existing Solid/Tailwind style.
- The planner may choose exact copy for index/deep-link labels, fallback copy, and section labels, provided the copy is concise, original, dark-primary, and avoids placeholder/template language.
- The planner may decide whether to add focused tests around `prerenderRoutes`, route helper inclusion, rendered fallback text, static build output, or component behavior, but the tests must be tied to Phase 20 requirements rather than Phase 22/23 metadata/release scope.

</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Milestone Scope

- `.planning/ROADMAP.md` - Phase 20 goal, ROUTE-01 through ROUTE-04, SYNTH-01, SYNTH-04, and later-phase boundaries.
- `.planning/REQUIREMENTS.md` - Theme route and synthesis requirements plus out-of-scope exclusions for search, CMS, runtime content fetches, prominent OpenLinks promotion, dynamic OG, and live external link automation.
- `.planning/PROJECT.md` - v1.4 milestone context, current static release gate facts, theme path intent, and OpenLinks placement decision.
- `.planning/STATE.md` - Current milestone and phase continuity state. Note that some body text still references Phase 19, but `gsd-tools` and ROADMAP select Phase 20.

### Prior Phase Decisions

- `.planning/phases/19-theme-domain-foundation/19-CONTEXT.md` - Locked theme domain decisions, supported helper surface, relationship resolution, validation boundaries, and later-phase deferrals.
- `.planning/phases/19-theme-domain-foundation/19-01-SUMMARY.md` - Phase 19 implementation summary if present. If missing, use Phase 19 source files and context as the source of truth.

### Existing Route and Domain Patterns

- `src/domain/themes.ts` - Public theme selectors, nullable lookup, detail path/routes, and related project/writing helpers that Phase 20 must consume.
- `src/domain/routes.ts` - Current site route registry and `prerenderRoutes` source imported by `app.config.ts`.
- `app.config.ts` - SolidStart static preset with explicit prerender route list and `crawlLinks: false`.
- `src/routes/writing/index.tsx` - Closest index route pattern for responsive dark cards and helper-derived records.
- `src/routes/writing/[slug].tsx` - Closest public detail fallback pattern and related-content route pattern.
- `src/routes/projects/[slug].tsx` - Existing detail hub pattern, related writing panel, project actions boundary, and dark panel structure.
- `src/components/SiteLayout.tsx` - Current navigation and footer/OpenLinks placement.
- `src/styles/app.css` - Dark-primary surfaces, theme-card classes, responsive grids, reduced-motion/coarse-pointer guards, wrapping rules, and focus states.

### Standards And Skills

- `AGENTS.md` - Repo-local dark-primary guidance and visual verification requirement for desktop/mobile dark rendering.
- `AGENTS.bright-builds.md` - Bright Builds baseline workflow, TypeScript, verification, testing, code-shape, operability, and OpenLinks guidance.
- `standards/core/architecture.md` - Keep domain decisions pure and route shells thin.
- `standards/core/code-shape.md` - Use shallow control flow and `maybe...` names for nullable values.
- `standards/core/testing.md` - Unit test pure/decision logic with focused Arrange/Act/Assert tests.
- `standards/core/verification.md` - Use repo-native verification before commit and prefer aggregate/owned commands.
- `standards/languages/typescript-javascript.md` - Keep TypeScript route/domain logic data-in/data-out where practical and avoid new Python automation.
- `openlinks-identity-presence` skill - Keep OpenLinks low-intrusion in footer/profile/contact/metadata surfaces and do not make it the primary theme CTA.

### Advisor Research References

- SolidStart route prerendering: `https://docs.solidjs.com/solid-start/building-your-application/route-prerendering`
- Nitro prerender configuration: `https://nitro.build/config`
- Solid Router catch-all routes: `https://docs.solidjs.com/solid-router/concepts/catch-all`
- SolidStart `HttpStatusCode`: `https://docs.solidjs.com/solid-start/reference/server/http-status-code`
- Tailwind v3 dark mode and responsive design: `https://v3.tailwindcss.com/docs/dark-mode`, `https://v3.tailwindcss.com/docs/responsive-design`
- Reduced motion and accessible structure references: `https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion`, `https://www.w3.org/WAI/WCAG21/Understanding/reflow.html`, `https://www.w3.org/WAI/tutorials/page-structure/headings/`

</canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- `publicThemeEntries()`, `maybePublicThemeEntryBySlug()`, `themeDetailPath()`, and `themeDetailRoutes()` already provide the public route/data contract.
- `relatedProjectDetailPageProjectsForTheme()` and `relatedWritingEntriesForTheme()` already enforce relationship display through existing curated project/writing helpers.
- `ReactiveSurface` plus existing `.project-anchor-card`, `.theme-card`, `.surface-card`, `.label-row`, `.chip`, and `.tier-pill` classes can provide route UI without new dependencies.

### Established Patterns

- `src/domain/routes.ts` is the route registry and the static prerender source imported by `app.config.ts`.
- Existing detail routes use `useParams()` plus `maybe...BySlug()` gates and generic fallback sections for non-public records.
- Existing writing and project pages colocate route rendering with small local helper functions instead of broad component abstractions.
- The CSS is dark-primary, uses 8px radii, protects `overflow-wrap`, and disables reactive hover effects under reduced motion, coarse pointer, and small viewport media conditions.

### Integration Points

- Add a `/themes` route entry and theme route strings in `src/domain/routes.ts`.
- Add `src/routes/themes/index.tsx` for the index card grid.
- Add `src/routes/themes/[slug].tsx` for public detail pages and generic fallback behavior.
- Add small CSS selectors in `src/styles/app.css` only if existing grid/card classes are insufficient for theme route layout.
- Add or update focused tests and static/build checks for route inclusion, public-only route derivation, and non-leaking fallback behavior.

</code_context>

<specifics>

## Specific Ideas

- The `/themes` index should feel like a curated map into Peter's work, not a tag archive or search/filter page.
- The first public themes are `agentic-engineering` and `open-identity`; cards and detail pages should remain data-driven so future public themes appear automatically after validation.
- Related project cards should link to selected project detail pages when available. Related writing cards should link to public writing detail pages.
- Fallback copy can say "No public theme here" and "Browse theme paths" without exposing the requested slug.
- The existing OpenLinks footer link already satisfies subtle identity discoverability; Phase 20 should preserve it while keeping themes, projects, and writing primary.

</specifics>

<deferred>

## Deferred Ideas

- Theme collaboration panels, practical next-action CTAs, reviewed source/live-surface action grouping, and theme-aware project/writing cross-links belong to Phase 21.
- Route-specific theme metadata, JSON-LD, sitemap entries/exclusions, Open Graph/Twitter tags, and social-preview fallback verification belong to Phase 22.
- Browser release-suite expansion, release-readiness documentation, and automated evidence labels for theme coverage belong to Phase 23.
- Search, filters, tag archives, CMS/admin, comments/newsletter, analytics, live external-link reachability, runtime content fetches, and dynamic OG images remain future or out of scope.

</deferred>

---

*Phase: 20-theme-routes-and-dark-ui*
*Context gathered: 2026-06-17*
