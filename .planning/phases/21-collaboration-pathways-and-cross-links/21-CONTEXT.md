---
generated_by: gsd-discuss-phase
lifecycle_mode: yolo
phase_lifecycle_id: 21-2026-06-17T22-54-40
generated_at: 2026-06-17T22:54:40.939Z
---

# Phase 21: Collaboration Pathways and Cross-Links - Context

**Gathered:** 2026-06-17
**Status:** Ready for planning
**Mode:** Yolo

<domain>

## Phase Boundary

Phase 21 turns the Phase 19 theme relationships and Phase 20 theme routes into practical collaboration pathways. Visitors should be able to move from theme detail pages into selected project stories, public writing, reviewed source/live surfaces, and clear next actions. Project and writing detail pages should also expose related theme links where those links clarify the content graph.

This phase should add helper-derived collaboration links and reciprocal theme links only. It should not add Phase 22 metadata, JSON-LD, sitemap, Open Graph/Twitter, or social-preview behavior, and it should not add Phase 23 release-contract labels, broad release documentation, live external-link reachability checks, search/filtering, CMS/admin tooling, analytics, newsletter, comments, or runtime content fetches.

</domain>

<decisions>

## Implementation Decisions

### Theme Collaboration Panels

- **D-01:** Add a collaboration starting-point panel to public theme detail pages. The panel should use each theme's `collaborationAngle`, related selected project records, public writing records, and existing curated project/profile links to explain how a visitor can inspect or engage with the work.
- **D-02:** The panel should be a compact action surface, not a marketing hero or primary OpenLinks CTA. Recommended order: theme-specific collaboration angle, related project story links, reviewed source/live links when available, related writing links, and a low-intrusion identity/contact fallback only when useful.
- **D-03:** Prefer existing reviewed project link data and existing GitHub metadata helpers over new external-link fields. Do not introduce unreviewed URL sources, live-reachability claims, dynamic network checks, or token-dependent runtime behavior.
- **D-04:** Use concise action labels that describe the destination, such as `Project story`, `Source`, `Live surface`, `Read note`, `Read essay`, or `Contact path`. Avoid vague labels such as `Learn more` when a more specific label is available.

### Helper-Derived Relationship Graph

- **D-05:** Add pure domain helpers for theme relationship lookups instead of hand-filtering records inside route components. Helpers should answer "which public themes reference this project?" and "which public themes reference this writing entry?" from `curatedThemes`.
- **D-06:** Reciprocal helpers must return only public theme entries and should preserve theme display order. They should defensively return an empty list for unreferenced records without leaking draft, hidden, unsupported, or archived themes.
- **D-07:** Keep project and writing registries authoritative. Theme links may reference project and writing records, but must not duplicate authored project or writing copy beyond small labels and summaries already available through existing helpers.

### Project and Writing Cross-Links

- **D-08:** Add related theme links to selected project detail pages when public themes reference that project. Place them as a secondary panel near existing related writing/project facts, so the project narrative remains primary.
- **D-09:** Add related theme links to public writing detail pages when public themes reference that writing entry. Place them after the article body and related projects, so the writing remains primary.
- **D-10:** Cross-links should use stable `themeDetailPath()` links, existing dark-primary link/list styling, and short theme title/summary text. Do not add related theme links to broad index cards, homepage project cards, or navigation in this phase.

### OpenLinks Placement

- **D-11:** Preserve OpenLinks as a low-intrusion identity hub. The existing footer/profile/contact metadata placement is already the default placement; Phase 21 should not make OpenLinks the primary theme CTA.
- **D-12:** The `open-identity` theme may naturally include OpenLinks as a related project and reviewed live/source surface, but general theme collaboration panels should prioritize the theme's related projects, writing, and GitHub/source surfaces first.
- **D-13:** If the implementation introduces any new visible OpenLinks link, it must use the existing profile data where practical and include appropriate `rel="me noopener noreferrer"` semantics. Prefer not adding a duplicate OpenLinks link when the existing footer/contact placement already satisfies discoverability.

### Dark UI and Accessibility

- **D-14:** Reuse the current dark-primary surfaces: `project-detail-panel`, `visual-surface`, `link-list`, `surface-link`, `chip`, `tier-pill`, and existing theme/project/writing card patterns. Add only narrow CSS when needed for stable layout.
- **D-15:** Avoid building decorative cards inside other cards for new collaboration UI. Prefer compact grouped link rows or lists inside panels so the new surfaces remain scan-friendly and do not add nested visual noise.
- **D-16:** Keep keyboard reachability, descriptive link text, focus visibility, reduced-motion behavior, and desktop/mobile dark text wrapping explicit in verification.

### Verification Boundary

- **D-17:** Add focused unit tests for reciprocal theme helpers and any collaboration-link assembly helpers.
- **D-18:** Add route/component/static tests proving public theme detail pages expose collaboration pathways, project detail pages expose related theme links, and writing detail pages expose related theme links.
- **D-19:** Run visual/browser verification for desktop and mobile dark rendering on at least one theme detail route plus representative project and writing detail surfaces affected by the new links. Keep Phase 22/23 metadata and release-contract assertions out of this phase.

### the agent's Discretion

- The planner may decide exact helper names, link grouping structure, and panel placement as long as helpers stay pure, nullable values use `maybe...` names, and route components remain thin shells.
- The planner may choose whether collaboration action assembly lives in `src/domain/themes.ts` or a small adjacent module, provided it stays data-in/data-out and is covered by focused tests.
- The executor may choose exact section headings and CTA labels, provided they are destination-specific, concise, dark-primary, and do not over-promote OpenLinks.

</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Milestone Scope

- `.planning/ROADMAP.md` - Phase 21 goal, SYNTH-02, SYNTH-03, COLLAB-01 through COLLAB-03, dependencies, and later-phase boundaries.
- `.planning/REQUIREMENTS.md` - v1.4 synthesis and collaboration requirements plus out-of-scope exclusions for runtime content fetches, live external-link reachability, search/filtering, CMS/admin, dynamic OG, analytics, newsletter, and prominent OpenLinks promotion.
- `.planning/PROJECT.md` - v1.4 milestone context, static portfolio constraints, curated-content decisions, release gate facts, and OpenLinks placement decision.
- `.planning/STATE.md` - Current phase continuity and recent Phase 20 completion context.

### Prior Phase Decisions

- `.planning/phases/19-theme-domain-foundation/19-CONTEXT.md` - Theme registry, public selectors, route helpers, slug-only relationships, and validation boundaries.
- `.planning/phases/20-theme-routes-and-dark-ui/20-CONTEXT.md` - Theme route UI decisions, collaboration deferral, route/fallback safety, and dark-primary route patterns.

### Existing Code Patterns

- `src/domain/themes.ts` - Public theme selectors, theme path helpers, and related project/writing resolution helpers to extend.
- `src/domain/projects.ts` - Selected project detail eligibility, project link records, `projectDetailPath()`, and `projectLinkDisplayLabel()`.
- `src/domain/writing.ts` - Public writing selectors, `writingDetailPath()`, related project helpers, and writing kind data.
- `src/domain/github-metadata.ts` - Checked-in GitHub metadata helpers and homepage link derivation already used on project detail pages.
- `src/domain/profile.ts` - Profile links, OpenLinks identity link, and `profileSameAsLinks()` identity data.
- `src/routes/themes/[slug].tsx` - Theme detail route and current related project/writing panels.
- `src/routes/projects/[slug].tsx` - Project detail route, project actions panel, GitHub facts, and related writing panel.
- `src/routes/writing/[slug].tsx` - Writing detail route, related project section, and detail metadata/fallback pattern.
- `src/components/SiteLayout.tsx` - Existing footer OpenLinks placement with `rel="me noopener noreferrer"`.
- `src/styles/app.css` - Dark-primary panel, link-list, chip, tier-pill, responsive grid, focus, wrapping, and reduced-motion patterns.

### Standards And Skills

- `AGENTS.md` - Repo-local dark-primary guidance and desktop/mobile visual verification requirement.
- `AGENTS.bright-builds.md` - Bright Builds workflow, TypeScript, testing, verification, code-shape, and OpenLinks guidance.
- `standards/core/architecture.md` - Keep relationship/collaboration decisions in pure data helpers and route shells thin.
- `standards/core/code-shape.md` - Use shallow control flow and `maybe...` names for nullable values.
- `standards/core/testing.md` - Unit test pure helper behavior with focused Arrange/Act/Assert tests.
- `standards/core/verification.md` - Run repo-native checks before commit and prefer aggregate/owned commands.
- `standards/languages/typescript-javascript.md` - Keep TypeScript logic data-in/data-out, use Bun/repo scripts, and avoid new Python automation.
- `openlinks-identity-presence` skill - Prefer footer/about/profile identity placement, visible link first, metadata second, and keep OpenLinks secondary to the host product brand.

</canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- `publicThemeEntries()`, `maybePublicThemeEntryBySlug()`, `themeDetailPath()`, and `relatedProjectDetailPageProjectsForTheme()` already provide most theme detail data.
- `relatedWritingEntriesForTheme()` already resolves theme writing relationships through the public writing registry.
- `ProjectStory.links`, `projectLinkDisplayLabel()`, and `maybeGitHubHomepageLinkForProject()` already expose reviewed source/live surfaces used in project action panels.
- `writingDetailPath()` and writing kind data already support specific writing action labels.
- `peterProfile.links` already includes GitHub, OpenLinks, and Bright Builds links with identity/contact semantics.

### Established Patterns

- Domain helpers live in `src/domain` and route components consume helper output instead of duplicating relationship logic.
- Project and writing detail routes use `useParams()` gates, generic fallbacks, semantic sections, and secondary related-content panels.
- The site is dark-primary with stable 8px radii, explicit focus rings, responsive grids, and reduced-motion/coarse-pointer guards.
- OpenLinks is already visible in the footer and profile data while the main brand and project/writing CTAs stay primary.

### Integration Points

- Extend `src/domain/themes.ts` with reciprocal theme helpers and any pure collaboration action helper.
- Update `src/routes/themes/[slug].tsx` to include a collaboration starting-point panel.
- Update `src/routes/projects/[slug].tsx` to show related themes for selected project detail pages.
- Update `src/routes/writing/[slug].tsx` to show related themes for public writing entries.
- Add focused tests in `src/domain/themes.test.ts` or a nearby test file, plus route/component/static tests where the repo already has coverage for theme routes.
- Add narrow CSS in `src/styles/app.css` only if existing panel/list classes do not handle the new collaboration layout cleanly.

</code_context>

<specifics>

## Specific Ideas

- Theme collaboration should feel like "where to start" for a collaborator: inspect this project story, read this note, view the source, try the live surface when one exists, then use existing contact/identity paths if they need more context.
- The `agentic-engineering` theme should point visitors toward `opencode-cloud`, `free-the-world`, and the agentic engineering writing note without claiming any live or hosted status beyond existing curated links.
- The `open-identity` theme can naturally include OpenLinks source/live links because OpenLinks is a related selected project, but OpenLinks should not become a generic primary CTA for every theme.
- Reciprocal project/writing theme links should be small context bridges, not a tag cloud or new discovery system.

</specifics>

<deferred>

## Deferred Ideas

- Theme metadata, JSON-LD, sitemap inclusion/exclusion, Open Graph/Twitter tags, and social-preview fallback behavior belong to Phase 22.
- Browser release-suite expansion, release-readiness documentation, aggregate evidence labels, and release-contract checks belong to Phase 23.
- Search, filters, tag archives, CMS/admin, comments/newsletter, analytics, live external-link reachability, runtime content fetches, and dynamic OG images remain future or out of scope.

</deferred>

---

*Phase: 21-collaboration-pathways-and-cross-links*
*Context gathered: 2026-06-17*
