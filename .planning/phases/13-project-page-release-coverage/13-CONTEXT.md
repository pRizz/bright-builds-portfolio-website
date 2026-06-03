---
generated_by: gsd-discuss-phase
lifecycle_mode: yolo
phase_lifecycle_id: 13-2026-06-03T01-38-02
generated_at: 2026-06-03T01:40:37Z
---

# Phase 13: Project Page Release Coverage - Context

**Gathered:** 2026-06-03
**Status:** Ready for planning
**Mode:** Yolo

<domain>

## Phase Boundary

This phase completes release coverage for selected project detail routes after the Phase 12 metadata and sharing contract. The clean-builder path must prove project detail route coverage through static output checks, browser release behavior checks, and release-readiness documentation/checks.

This phase does not add new project detail UI, new selected projects, new metadata fields, runtime GitHub behavior, or project-specific raster social images. Phase 12 already implemented project metadata, JSON-LD, sitemap coverage, and the deterministic social preview fallback; Phase 13 should widen release evidence around that existing surface.

</domain>

<decisions>

## Implementation Decisions

### Static Release Coverage

- **D-01:** Keep `projectDetailRoutes()` / `prerenderRoutes` as the canonical source for selected project detail route coverage. Do not introduce a second manually maintained project route list in release checks.
- **D-02:** Preserve the Phase 12 static verifier behavior that checks generated project detail HTML for story text, project metadata, project JSON-LD, sitemap inclusion, local social preview mapping, and forbidden runtime GitHub/template residue.
- **D-03:** If static verification needs changes, make them explicit regression guards around the existing generated HTML contract rather than new production behavior.

### Browser Release Coverage

- **D-04:** Extend browser release checks so selected project detail routes are visibly included in axe coverage, desktop and mobile dark layout overflow/overlap checks, keyboard reachability, and reduced-motion behavior.
- **D-05:** Use representative selected detail routes from `projectDetailRoutes()` for browser-only checks that would be too expensive or redundant across every project, while keeping route selection derived from the project registry.
- **D-06:** Keep dark-primary expectations strict: browser layout checks must continue to assert the root `.dark` class, no horizontal overflow, and no obvious text/control overlap on desktop and mobile.
- **D-07:** Keyboard coverage must prove a user can reach at least one selected project detail route from the release-critical navigation flow and can reach release-critical links on a project detail page, including the project index/back path and project action links.
- **D-08:** Reduced-motion coverage should exercise a project detail route as well as the home route so project-page interactive surfaces do not regain decorative hover or pointer motion when `prefers-reduced-motion: reduce` is active.

### Release Readiness Documentation and Evidence

- **D-09:** `docs/release-readiness.md` must explicitly name project detail route coverage in the aggregate release gate and the clean-builder command sequence `bun run install:browser && bun run verify`.
- **D-10:** Release-readiness checks should fail if the documentation stops mentioning project detail route coverage, including static metadata/JSON-LD/sitemap coverage and browser axe/layout/keyboard/reduced-motion coverage.
- **D-11:** Release evidence labels emitted by `bun run verify:release` should include project detail route coverage so release output communicates that the clean-builder gate covered this surface.
- **D-12:** Preview and production smoke-check guidance should include at least one selected `/projects/{slug}` route, not only `/projects` anchors.

### Clean-Builder Gate

- **D-13:** Keep `bun run verify` as the aggregate release gate and `bun run install:browser && bun run verify` as the clean-builder command sequence.
- **D-14:** Do not introduce network-dependent browser/link checks into local release verification. External links remain policy-checked locally and smoke-checked manually per existing release-readiness guidance.
- **D-15:** Verification for this phase must include the repo-native aggregate gate after implementation; focused tests are useful during execution but not sufficient for final completion.

### the agent's Discretion

- The agent may choose the exact representative detail route for browser checks, but it should come from `projectDetailRoutes()` and should fail loudly if no project detail routes are selected.
- The agent may split release-readiness helpers or browser helper functions if it reduces duplication or keeps files below the Bright Builds refactor triggers without broad unrelated rewrites.

</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Scope

- `.planning/ROADMAP.md` - Phase 13 goal, dependency on Phase 12, and success criteria.
- `.planning/REQUIREMENTS.md` - `VERIFY-02`, `VERIFY-03`, and `VERIFY-04`.
- `.planning/STATE.md` - Current v1.2 milestone state and prior phase history.
- `.planning/phases/12-project-metadata-sharing/12-CONTEXT.md` - Phase 12 decisions that Phase 13 must preserve.
- `.planning/phases/12-project-metadata-sharing/12-01-SUMMARY.md` - Phase 12 implementation summary and next-phase readiness.
- `.planning/phases/12-project-metadata-sharing/12-VERIFICATION.md` - Evidence that project metadata, JSON-LD, sitemap, and static release checks already pass.

### Repo and Standards Guidance

- `AGENTS.md` - Dark-primary UI defaults, visual verification requirements, and GSD workflow enforcement.
- `AGENTS.bright-builds.md` - Bright Builds workflow, TypeScript, testing, verification, and OpenLinks guidance.
- `standards-overrides.md` - No active local exceptions beyond placeholder rows.
- `bright-builds-rules.audit.md` - Pinned standards commit `05f8d7a6c9c2e157ec4f922a05273e72dab97676`.
- Bright Builds canonical standards at commit `05f8d7a6c9c2e157ec4f922a05273e72dab97676`: `standards/index.md`, `standards/core/architecture.md`, `standards/core/code-shape.md`, `standards/core/verification.md`, `standards/core/testing.md`, `standards/core/operability.md`, and `standards/languages/typescript-javascript.md`.

### Existing Code

- `src/domain/projects.ts` - Curated project registry, selected detail page helpers, and `projectDetailRoutes()`.
- `src/domain/routes.ts` - `prerenderRoutes` composition from top-level routes and selected project detail routes.
- `src/domain/project-detail-routes.test.ts` - Existing route selection, metadata, sitemap, and JSON-LD unit coverage.
- `src/routes/projects/[slug].tsx` - Project detail page markup, metadata, JSON-LD, back link, and project action links.
- `scripts/verify-static.ts` - Static output verifier for route HTML, metadata, JSON-LD, sitemap, assets, and forbidden residue.
- `scripts/verify-release.ts` - Release semantic, budget, forbidden output, accessibility evidence, and release-readiness check entrypoint.
- `scripts/release-readiness.ts` - Release external-link policy, documentation fact checks, and release evidence labels.
- `scripts/release-readiness.test.ts` - Unit tests for release-readiness document facts and evidence labels.
- `scripts/verify-release.test.ts` - Unit tests for release verifier semantics and evidence labels.
- `tests/browser-release.playwright.ts` - Playwright/axe release suite for route accessibility, dark layout checks, keyboard reachability, and reduced-motion behavior.
- `docs/release-readiness.md` - Release gate, clean-builder, Cloudflare Pages, preview, production, and manual smoke-check guidance.
- `package.json` - Aggregate `verify` and clean browser install scripts.

</canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- `projectDetailRoutes()` returns the six selected detail paths: `/projects/openlinks`, `/projects/free-the-world`, `/projects/win3bitcoin`, `/projects/opencode-cloud`, `/projects/zeckendorf`, and `/projects/mystic-ui`.
- `prerenderRoutes` already includes those detail paths, and the existing browser suite loops over all `prerenderRoutes` for axe and layout checks.
- `scripts/verify-static.ts` already asserts project detail story text, metadata, JSON-LD, sitemap inclusion/exclusion, local social preview mapping, and forbidden runtime GitHub/template residue.
- `scripts/release-readiness.ts` centralizes document-required facts and evidence labels, which is the right place to make release docs/checks fail when project detail coverage is no longer named.

### Established Patterns

- Release checks are deterministic and local; live external links are covered by policy and manual smoke-check documentation rather than network-dependent automation.
- Tests use focused Arrange, Act, Assert sections.
- Pure helper functions in `scripts/release-readiness.ts`, `scripts/verify-release.ts`, and domain modules are unit-tested with Vitest; browser-only behavior lives in Playwright.
- Dark-primary rendering is mandatory for UI checks, and existing browser layout findings already check `.dark`, horizontal overflow, and obvious overlap.

### Integration Points

- `tests/browser-release.playwright.ts` should extend keyboard and reduced-motion coverage for representative selected detail routes without duplicating static checks.
- `scripts/release-readiness.ts` should add required document facts and evidence labels for project detail route coverage.
- `docs/release-readiness.md` should name project detail route coverage in automated gates and preview/production smoke checks.
- `scripts/release-readiness.test.ts` and `scripts/verify-release.test.ts` should pin the new release-readiness contract.

</code_context>

<specifics>

## Specific Ideas

- Prefer deriving representative browser project route coverage from `projectDetailRoutes()[0]` or a small helper that intentionally selects a stable representative route.
- Keep static route coverage exhaustive across selected project detail routes through `expectedRoutes` and `projectDetailRoutes()`.
- Keep OpenLinks placement unchanged unless a touched release doc needs to mention that OpenLinks links remain part of the external-link smoke check.

</specifics>

<deferred>

## Deferred Ideas

- Project-specific raster Open Graph image generation remains deferred to future `OG-01` / `OG-02` style work.
- Browser-provider hosted audits or Lighthouse CI remain optional extra evidence, not required local release gates for this phase.
- Additional project detail routes for supporting/lab/archive projects remain out of scope; route selection stays flagship/detail-authored only.

</deferred>

---

*Phase: 13-project-page-release-coverage*
*Context gathered: 2026-06-03*
