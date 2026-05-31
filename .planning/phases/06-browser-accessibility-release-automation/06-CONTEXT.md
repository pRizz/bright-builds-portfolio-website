---
generated_by: gsd-discuss-phase
lifecycle_mode: yolo
phase_lifecycle_id: 6-2026-05-31T21-25-37
generated_at: 2026-05-31T21:25:32.082Z
---

# Phase 6: Browser & Accessibility Release Automation - Context

**Gathered:** 2026-05-31
**Status:** Ready for planning
**Mode:** Yolo

<domain>
## Phase Boundary

Phase 6 turns the existing manual/recorded browser and accessibility evidence into checked-in automation for the shipped static portfolio. The checks must run against built `.output/public` output, cover the core static routes in dark mode, verify reduced-motion behavior, prove keyboard reachability for primary routes and collaboration paths, and report accessibility failures clearly. It does not expand portfolio product scope, add new pages, or introduce new visual effects.

</domain>

<decisions>
## Implementation Decisions

### Browser Runner
- **D-01:** Use `@playwright/test` as the checked-in browser runner because this project already plans Playwright for browser/accessibility release checks and needs repeatable desktop/mobile evidence.
- **D-02:** Add a repo-owned Bun static server for `.output/public` so browser checks validate the actual static output without depending on a framework dev server or a third-party local server package.
- **D-03:** Add `bun run verify:browser` and include it in the aggregate `bun run verify` flow after `bun run build`, because the browser checks require built static HTML and assets.

### Route and Viewport Coverage
- **D-04:** Use `src/domain/routes.ts` as the route source so browser checks stay aligned with the prerender registry.
- **D-05:** Run the core browser checks on desktop and mobile Chromium projects with dark color scheme active.
- **D-06:** Treat `.dark` on the root document, no horizontal overflow, and no obvious text/control overlap as release-blocking layout conditions.

### Reduced Motion
- **D-07:** Add a reduced-motion Chromium project that emulates `prefers-reduced-motion: reduce`.
- **D-08:** Verify decorative motion is disabled by checking that hover transforms resolve to `none` and `ReactiveSurface` pointer CSS variables remain unchanged after pointer movement in reduced-motion mode.

### Keyboard and Accessibility
- **D-09:** Verify keyboard focus through real `Tab` traversal rather than only static DOM inspection.
- **D-10:** Require focus traversal to reach primary navigation routes, project links, and collaboration/contact paths.
- **D-11:** Use `@axe-core/playwright` for route-scoped accessibility checks and include violation summaries in failure output.

### the agent's Discretion
- The exact helper boundaries inside the Playwright spec.
- The exact overlap tolerance, as long as failures report route, viewport/project, and element labels clearly.
- The exact static server MIME map, as long as HTML, JS, CSS, SVG, XML, JSON, PNG, JPG/JPEG, WebP, ICO, and text assets are served correctly.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Scope
- `.planning/ROADMAP.md` — Phase 6 goal, requirements, and success criteria.
- `.planning/REQUIREMENTS.md` — BROW-01 through BROW-04 and GATE-01 requirement definitions.
- `.planning/STATE.md` — Current v1.1 milestone state and Phase 6 position.

### Repo Instructions and Standards
- `AGENTS.md` — Dark-primary repo guidance and visual verification requirements.
- `AGENTS.bright-builds.md` — Bright Builds workflow, verification, and TypeScript guidance.
- `standards-overrides.md` — Repo-local standards exceptions; currently no active Phase 6 exception.

### Existing Verification and UI Surfaces
- `package.json` — Existing Bun verification scripts and dependency policy.
- `app.config.ts` — Static SolidStart output and prerender route setup.
- `src/domain/routes.ts` — Route registry and prerender route source of truth.
- `src/components/SiteLayout.tsx` — Primary navigation, skip link, footer, and layout landmarks.
- `src/components/ReactiveSurface.tsx` — Decorative pointer-motion behavior that reduced-motion checks must cover.
- `src/styles/app.css` — Dark-primary, focus, layout, and reduced-motion CSS contract.
- `scripts/verify-release.ts` — Existing static release verifier and accessibility/focus evidence labels.
- `scripts/verify-static.ts` — Existing static HTML verification patterns.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/domain/routes.ts`: Provides `prerenderRoutes` and route metadata; browser checks should import it instead of duplicating route paths.
- `src/components/SiteLayout.tsx`: Provides the skip link, primary nav, footer OpenLinks path, and main landmark that keyboard checks should traverse.
- `scripts/verify-release.ts`: Already reports static accessibility evidence labels, budget checks, link checks, and forbidden output findings.
- `src/components/visual-motion.ts`: Existing pure motion gate already validates reduced-motion decisions at unit-test level; browser checks should prove emitted behavior.

### Established Patterns
- Verification scripts are TypeScript/Bun-first and live in `scripts/`.
- Static release checks run after `bun run build` and inspect `.output/public`.
- Tests use Vitest for pure functions and should include Arrange/Act/Assert comments.
- The site is dark-primary; `.dark` on the root document is not optional.

### Integration Points
- Add browser automation under a checked-in test surface and expose it through `package.json`.
- Add a static server script under `scripts/` so Playwright webServer can serve `.output/public`.
- Keep Phase 6 as release verification infrastructure; do not modify visitor-facing content unless a browser check exposes a real defect.

</code_context>

<specifics>
## Specific Ideas

- Browser evidence should be generated by commands maintainers can run locally and in CI.
- Failure output should name the route and condition so maintainers are not left interpreting screenshots or ad hoc logs.
- Prefer one focused browser-release spec over scattered test surfaces until Phase 7 defines the broader release gate contract.

</specifics>

<deferred>
## Deferred Ideas

- Lighthouse/performance and best-practices gates belong to Phase 7.
- External-link reachability policy belongs to Phase 7.
- Cloudflare Pages deployment readiness and aggregate release command expansion belong to Phase 7.
- Content helper API cleanup belongs to Phase 8.

</deferred>

---

*Phase: 06-browser-accessibility-release-automation*
*Context gathered: 2026-05-31*
