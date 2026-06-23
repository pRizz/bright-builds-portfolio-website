---
generated_by: gsd-discuss-phase
lifecycle_mode: yolo
phase_lifecycle_id: 29-2026-06-23T02-40-50
generated_at: 2026-06-23T02:40:50.170Z
---

# Phase 29: Archived Project Public Filter Guard - Context

**Gathered:** 2026-06-23
**Status:** Ready for planning
**Mode:** Yolo

<domain>
## Phase Boundary

Close the v1.5 audit gap where archived project records can still flow through selected project detail routes and into generated social preview targets. This phase should tighten the public project/detail selector and add regression coverage for archived project fixtures. It should not add new social preview routes, image templates, metadata features, or release workflow capabilities.

</domain>

<decisions>
## Implementation Decisions

### Source Filter Contract
- **D-01:** Treat archived project `status` and archived project `maturity` as non-public for public project index and selected detail route helpers.
- **D-02:** Fix the filtering at the project selector layer in `src/domain/projects.ts`, so `projectDetailPageProjects()`, `projectDetailRoutes()`, `maybeProjectDetailPageProjectBySlug()`, `visibleProjects()`, and `hiddenExcludedProjects()` share the same public project definition.
- **D-03:** Do not add a separate archived-project guard inside `src/domain/social-previews.ts`; social previews should continue deriving project targets from `projectDetailPageProjects()` so there is one visibility contract.
- **D-04:** Preserve the existing selected public projects and default generated social preview target list. The current curated data is not expected to change generated PNGs or the manifest.

### Regression Coverage
- **D-05:** Add fixture coverage for a selected-looking flagship project with `status: "archived"` and authored detail data. It must be excluded from `projectDetailRoutes()` and `socialPreviewTargets()`.
- **D-06:** Add fixture coverage for a selected-looking flagship project with `maturity: "archived"` and authored detail data. It must be excluded from `projectDetailRoutes()` and `socialPreviewTargets()`.
- **D-07:** Strengthen existing public project surface tests so archived projects appear in `hiddenExcludedProjects()` and do not appear in visible/detail surfaces.
- **D-08:** Keep unit tests focused on behavior, with Arrange, Act, Assert sections in non-trivial tests.

### Downstream Flow
- **D-09:** The social preview target flow should stay helper-derived: `projectDetailPageProjects()` -> `socialPreviewTargets()` -> generator/manifest/metadata/static/release verification.
- **D-10:** If fixing the selector changes default generated assets, regenerate and verify them. If default curated project targets are unchanged, avoid unnecessary generated asset churn.
- **D-11:** Phase verification must explicitly reference the audit gap IDs `SHARE-02`, `VERIFY-01`, `INT-01`, and `FLOW-01`.

### the agent's Discretion
- Exact helper names are delegated to implementation, but prefer a small named predicate if it makes the archived exclusion easy to read and reuse.
- Exact test placement is delegated to implementation; prefer existing project detail and social preview contract tests over broad new suites.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Audit and Phase Scope
- `.planning/v1.5-MILESTONE-AUDIT.md` - Defines the archived project gap, affected requirements, integration path, and flow IDs.
- `.planning/ROADMAP.md` - Phase 29 goal, dependency on Phase 28, requirements, gap closure IDs, and success criteria.
- `.planning/REQUIREMENTS.md` - Reopened `SHARE-02` and `VERIFY-01` requirements plus v1.5 out-of-scope boundaries.
- `.planning/PROJECT.md` - Curated registry authority, static social preview constraints, and release verification posture.

### Prior v1.5 Decisions
- `.planning/phases/24-social-image-data-contract/24-CONTEXT.md` - Public filtering and social preview target derivation decisions.
- `.planning/phases/28-verification-and-release-contract/28-CONTEXT.md` - Unit coverage, static verification, release contract, and aggregate verification decisions.

### Existing Code Contracts
- `src/domain/projects.ts` - Public project, selected detail project, route, and link selector contract to tighten.
- `src/domain/project-detail-routes.test.ts` - Existing selected detail route and project metadata coverage.
- `src/domain/portfolio-surfaces.test.ts` - Existing visible/hidden/excluded public project surface coverage.
- `src/domain/social-previews.ts` - Project social preview target derivation through `projectDetailPageProjects()`.
- `src/domain/social-previews.test.ts` - Existing public-only social preview fixture coverage to extend.
- `scripts/verify-static.test.ts` - Static verifier comparison between project detail routes and social preview routes.
- `package.json` - Targeted and aggregate Bun verification scripts.

### Standards
- `AGENTS.md` - Repo-local GSD workflow and dark-primary/static portfolio guidance.
- `AGENTS.bright-builds.md` - Bright Builds workflow, verification, TypeScript, and OpenLinks guidance.
- `standards/core/architecture.md` - Functional-core preference for selector behavior.
- `standards/core/code-shape.md` - Early-return, clear naming, and small helper guidance.
- `standards/core/testing.md` - Unit-test and Arrange/Act/Assert expectations.
- `standards/core/verification.md` - Repo-native verification before commit.
- `standards/languages/typescript-javascript.md` - TypeScript helper, Bun, and test guidance.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `isPublicProjectIndexProject()` in `src/domain/projects.ts` is the central public project predicate and already feeds `publicProjectIndexProjects()`, `visibleProjects()`, and `hiddenExcludedProjects()`.
- `isProjectDetailPageProject()` builds selected detail eligibility on top of the public project predicate, making it the right path for rejecting archived selected-looking fixtures once the public predicate is corrected.
- `socialPreviewTargets()` already consumes `projectDetailPageProjects()` and should benefit from the selector fix without new social-preview-only visibility code.

### Established Patterns
- Project, writing, and theme domain helpers keep public filtering in pure data-in/data-out functions.
- Existing tests build local fixtures and assert derived route paths rather than hard-coding unrelated route maps.
- The v1.5 social preview contract intentionally composes route helpers instead of maintaining a parallel visibility list.

### Integration Points
- `projectDetailPageProjects()` feeds project routes, project metadata/JSON-LD, sitemap inclusion, browser route coverage, social preview targets, static verification, and release verification.
- `socialPreviewTargets({ projects })` accepts fixture sources, which makes archived project regression coverage cheap and focused.

</code_context>

<specifics>
## Specific Ideas

- The most direct bug fix is to reject `project.status === "archived"` and `project.maturity === "archived"` in the shared public project predicate.
- Add tests that fail on the exact audit scenario: an archived project that otherwise looks like a public flagship detail route.
- Keep the generated social image count stable unless curated data changes reveal an actual target list change.

</specifics>

<deferred>
## Deferred Ideas

None - discussion stayed within phase scope.

</deferred>

---

*Phase: 29-archived-project-public-filter-guard*
*Context gathered: 2026-06-23*
