---
generated_by: gsd-discuss-phase
lifecycle_mode: yolo
phase_lifecycle_id: 19-2026-06-16T14-47-46
generated_at: 2026-06-16T14:48:45.850Z
---

# Phase 19: Theme Domain Foundation - Context

**Gathered:** 2026-06-16
**Status:** Ready for planning
**Mode:** Yolo

<domain>

## Phase Boundary

Phase 19 establishes the trusted theme domain layer for v1.4. Maintainers should be able to define curated theme paths in checked-in TypeScript data, derive stable public theme paths, filter unsupported or hidden theme records out of public selectors, and validate related selected-project and public-writing slugs before routes, UI, metadata, collaboration panels, sitemap behavior, or release checks depend on that data.

This phase should not build `/themes` pages, add theme navigation, change project or writing UI, add JSON-LD or sitemap coverage, update browser release checks, add collaboration panels, introduce search/filtering, add CMS/admin behavior, add Markdown/MDX parsing, or fetch content at runtime. Those surfaces belong to later v1.4 phases or future work.

</domain>

<decisions>

## Implementation Decisions

### Theme Registry Shape

- **D-01:** Add a repo-owned theme domain surface under `src/domain`, modeled after the existing project and writing registry style: explicit exported types, a checked-in `curatedThemes` registry, pure selector helpers, and no visitor-runtime data dependencies.
- **D-02:** Use a lean typed `ThemeRecord` shape with `slug`, `title`, `summary`, `status`, `displayOrder`, `audience`, non-empty `proofPoints`, `collaborationAngle`, `relatedProjectSlugs`, and `relatedWritingSlugs`.
- **D-03:** Keep theme copy theme-specific. Theme records may describe the theme's audience, proof points, and collaboration angle, but must not duplicate authored project or writing display copy that already belongs to `curatedProjects` or `curatedWriting`.
- **D-04:** Do not add evidence-annotated relation objects, denormalized page models, Markdown/MDX content, external schemas, or a CMS-like content layer in this phase. Slug arrays are enough for Phase 19.

### Public Eligibility and Paths

- **D-05:** Expose helper contracts parallel to the established project/writing surfaces: public theme selection, nullable lookup by slug using `maybe...` naming, `themeDetailPath()`, and `themeDetailRoutes()`.
- **D-06:** Public selectors should include only explicitly public/supported theme records sorted by `displayOrder`. Hidden, draft, unsupported, archived-only, or otherwise non-public theme records must stay out of public selectors and future route derivation.
- **D-07:** Stable detail paths should use `/themes/{slug}` even before route files exist. Phase 20 can consume `themeDetailRoutes()` for prerendering without copying slugs.
- **D-08:** Add a supported helper surface test so stale names such as `themeSeeds`, `featuredThemes`, or ad hoc route arrays do not become accidental public API.

### Relationship Resolution

- **D-09:** Store project and writing relationships on theme records as slug arrays only. Resolve display records through existing project and writing helpers.
- **D-10:** Related projects must resolve to selected public project detail pages, not merely any public project index record. Unknown, hidden, excluded, unselected, or unsupported project slugs should fail validation.
- **D-11:** Related writing must resolve to public writing entries. Unknown, draft, hidden, archived, or otherwise unpublished writing slugs should fail validation.
- **D-12:** Public relationship helpers should defensively return only resolved public records even though validation is expected to fail invalid relationships. This prevents hidden content leaks if a caller uses helpers before running curation checks.

### Validation and Curation Gate

- **D-13:** Add a theme-local validation module rather than a new dependency or a shared abstraction refactor. Match the structured issue style already used by project and writing validation.
- **D-14:** Validation should fail for duplicate theme slugs, malformed slugs, duplicate display orders, unsupported public status, missing title, summary, audience, proof points, collaboration angle, related project slugs, and related writing slugs.
- **D-15:** Relationship validation should distinguish unsupported project references from unpublished writing references clearly enough that maintainers can fix the right registry or theme record.
- **D-16:** Wire theme validation into `scripts/verify-curation.ts` beside project and writing validation. Error output should identify theme records with a `theme/` or `themes/` prefix so curation failures are easy to scan.

### Testing Boundary

- **D-17:** Add focused Vitest coverage for theme registry completeness, public filtering, display ordering, nullable lookup behavior, path/route derivation, relationship resolution, validation issue codes, and checked-in registry validity.
- **D-18:** Do not expand static output, browser, metadata, sitemap, release-readiness, or aggregate evidence labels beyond the curation gate in this phase. Later phases own those surfaces after routes exist.

### the agent's Discretion

- The planner and executor may choose exact type names, status labels, and helper names as long as they follow existing domain naming, maybe-prefixed nullable lookups, public selector behavior, and supported-export tests.
- The initial seed theme entries may be small and authored specifically to exercise the domain model, provided they are accurate, not placeholder/template content, and connect existing selected project detail pages with public writing entries.
- The validator may choose exact issue-code names as long as they are precise, stable, and covered by tests.

</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Milestone Scope

- `.planning/ROADMAP.md` - Phase 19 goal, THEME-01 through THEME-04 success criteria, dependencies, and later-phase boundaries.
- `.planning/REQUIREMENTS.md` - v1.4 theme model requirements plus out-of-scope exclusions for CMS, Markdown/MDX, runtime content fetches, search, filters, analytics, dynamic OG, and prominent OpenLinks promotion.
- `.planning/PROJECT.md` - v1.4 milestone context, static portfolio constraints, curated-content decisions, current release gate facts, and OpenLinks placement decision.
- `AGENTS.md` - Repo-local dark-primary guidance, Bright Builds workflow requirements, and GSD artifact requirements.
- `AGENTS.bright-builds.md` - Bright Builds baseline workflow, TypeScript, verification, testing, code-shape, and OpenLinks guidance.
- `standards-overrides.md` - No active local exceptions beyond the placeholder table.

### Prior Phase Decisions

- `.planning/milestones/v1.3-phases/14-writing-domain-foundation/14-CONTEXT.md` - Writing registry, public helper, related-project, validation, and no-runtime-content decisions to mirror for themes.
- `.planning/milestones/v1.3-phases/15-writing-routes-and-dark-ui/15-CONTEXT.md` - Route/UI boundaries and helper-derived static route decisions that Phase 20 will consume later.
- `.planning/milestones/v1.3-phases/16-writing-metadata-and-structured-data/16-CONTEXT.md` - Metadata/JSON-LD deferral pattern and pure helper ownership for later theme metadata.
- `.planning/milestones/v1.3-phases/17-writing-verification-and-release-contract/17-CONTEXT.md` - Release-contract boundary and evidence-label restraint for later theme verification work.
- `.planning/milestones/v1.3-phases/18-static-verifier-modularization/18-CONTEXT.md` - Static verifier modularization decisions and generated-output ownership boundaries.

### Existing Domain Patterns

- `src/domain/projects.ts` - Authoritative typed project registry, selected detail-page eligibility, public selectors, nullable lookup naming, route path derivation, and supported helper surface comment.
- `src/domain/writing.ts` - Authoritative writing registry, public selector helpers, related selected-project resolution, nullable lookup naming, and route helper contracts.
- `src/domain/project-validation.ts` - Structured curation issue pattern for project data.
- `src/domain/writing-validation.ts` - Structured validation issue pattern for cross-registry relationships, dates, duplicate slugs, and body/link validation.
- `src/domain/writing.test.ts` - Supported helper surface, public filtering, nullable lookup, route derivation, and relationship helper tests.
- `src/domain/writing-validation.test.ts` - Arrange/Act/Assert validation tests for issue codes and relationship failures.
- `scripts/verify-curation.ts` - Existing curation verification script that should aggregate theme validation beside project and writing validation.

### Standards And Skills

- `standards/core/architecture.md` - Keep domain decisions in pure data-in/data-out helpers.
- `standards/core/code-shape.md` - Use shallow control flow and `maybe...` naming for nullable values.
- `standards/core/testing.md` - Unit test pure theme logic with focused Arrange/Act/Assert tests.
- `standards/core/verification.md` - Run repo-native checks before commit and prefer aggregate/owned commands.
- `standards/languages/typescript-javascript.md` - Keep TypeScript domain logic pure, use Bun/repo scripts, and avoid new Python automation.
- `openlinks-identity-presence` skill - Preserve subtle visible OpenLinks placement and metadata hints; Phase 19 should not add new OpenLinks promotion.

</canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- `curatedProjects`, `projectDetailPageProjects()`, `maybeProjectDetailPageProjectBySlug()`, `projectDetailPath()`, and `projectDetailRoutes()` provide the model for project relationship eligibility and route helpers.
- `curatedWriting`, `publicWritingEntries()`, `maybePublicWritingEntryBySlug()`, `writingDetailPath()`, and `writingDetailRoutes()` provide the closest theme helper surface pattern.
- `relatedProjectDetailPageProjects()` shows how slug-only relations can resolve selected project detail records while silently filtering unresolved values for display helpers.
- `validateWritingRegistry()` shows the most relevant structured validation pattern for duplicate slugs, malformed slugs, missing fields, and cross-registry relationship failures.

### Established Patterns

- Domain data lives in `src/domain` as typed checked-in arrays with `as const satisfies readonly ...[]`.
- Public route exposure is derived from domain helpers and later imported into `src/domain/routes.ts`.
- Tests use Arrange, Act, Assert comments for non-trivial unit cases.
- Curation validation is a repo-owned script included in the aggregate `bun run verify` gate.
- The project avoids runtime GitHub/content dependencies on visitor paths and treats checked-in curated data as authoritative.

### Integration Points

- Phase 19 should primarily touch `src/domain/themes.ts`, `src/domain/theme-validation.ts`, focused unit tests, and `scripts/verify-curation.ts`.
- Phase 20 will likely consume theme helper output from `src/domain/routes.ts` and route files.
- Phase 21 will likely consume related project/writing helper output for collaboration pathways and cross-links.
- Phase 22 will likely consume theme route and relationship helpers for metadata, structured data, and sitemap output.
- Phase 23 will likely expand static/browser/release verification once theme routes and collaboration paths actually exist.

</code_context>

<specifics>

## Specific Ideas

- Treat themes as curated paths through existing work, not a second source of project or writing truth.
- Seed themes should likely reflect the already named v1.4 target paths: agentic engineering, open identity/open web, Bitcoin/open systems, and web tooling or SolidJS design-system work.
- Relationship arrays should preserve authorial ordering so future route pages can present the most relevant project/writing examples first.
- Keep OpenLinks discoverable through existing profile/footer/contact/metadata surfaces; theme domain data can reference the OpenLinks project where relevant without making OpenLinks the primary theme CTA.

</specifics>

<deferred>

## Deferred Ideas

- `/themes` index and `/themes/{slug}` route rendering belong to Phase 20.
- Theme-aware project/writing cross-links and collaboration panels belong to Phase 21.
- Theme route metadata, structured data, sitemap inclusion, and social preview fallback behavior belong to Phase 22.
- Theme static/browser/release verification and release-readiness evidence labels belong to Phase 23.
- Search, filters, tag archives, CMS/admin, comments/newsletter, analytics, live external-link reachability, runtime content fetches, and dynamic OG images remain future or out of scope.

</deferred>

---

*Phase: 19-theme-domain-foundation*
*Context gathered: 2026-06-16*
