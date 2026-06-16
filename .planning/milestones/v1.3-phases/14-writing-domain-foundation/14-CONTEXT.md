---
generated_by: gsd-discuss-phase
lifecycle_mode: yolo
phase_lifecycle_id: 14-2026-06-03T13-56-52
generated_at: 2026-06-03T13:56:52.315Z
---

# Phase 14: Writing Domain Foundation - Context

**Gathered:** 2026-06-03
**Status:** Ready for planning
**Mode:** Yolo

<domain>

## Phase Boundary

Phase 14 establishes the trusted writing domain layer for v1.3. Maintainers should be able to define curated writing and note entries in checked-in TypeScript data, derive stable public writing paths, exclude draft or hidden content from public selectors, and validate related selected-project slugs before any route, UI, metadata, sitemap, or release-contract work depends on that data.

This phase should not build `/writing` pages, project-page related-writing UI, JSON-LD, sitemap behavior, browser checks, RSS, search, CMS/admin flows, Markdown/MDX parsing, or runtime content fetching. Those are explicitly later phases or future work.

</domain>

<decisions>

## Implementation Decisions

### Writing Registry Shape

- **D-01:** Add a repo-owned writing domain surface under `src/domain`, modeled after the existing project registry style: explicit exported types, a checked-in `curatedWriting` registry, pure selector helpers, and no visitor-runtime data dependencies.
- **D-02:** Use authored typed records rather than Markdown, MDX, Contentlayer, CMS data, external feeds, or generated runtime fetches. v1.3 values deterministic static output over a publishing pipeline.
- **D-03:** Include enough fields for downstream phases without overbuilding: `slug`, `title`, `summary`, `status`, optional date-style display metadata, tags/topics, body sections or blocks, display ordering, and optional related selected-project slugs.

### Public Eligibility and Paths

- **D-04:** Public writing routes should derive only from entries explicitly eligible for publication. Draft, hidden, archived-only, or otherwise unpublished records must stay out of public selectors and route helper output.
- **D-05:** Provide stable helper names for downstream use, similar to project helpers: public entry selection, nullable lookup by slug using `maybe...` naming, route path derivation, and route list derivation.
- **D-06:** Sorting can be deterministic and curated-first. If a date is present, downstream routes may choose reverse chronological display, but Phase 14 should keep ordering explicit enough that tests do not depend on incidental array order.

### Body Content Model

- **D-07:** Represent writing bodies as typed blocks or sections that can render later without parsing external markup. Keep the model simple: headings, paragraphs, lists, callouts, or link references only when needed by the seed entries.
- **D-08:** Avoid building a generic blog engine. The body model should support the initial curated notes and remain easy to validate, not anticipate every future publishing feature.

### Project Relationships

- **D-09:** Store writing-to-project relationships on writing records as related project slugs. Do not duplicate related-writing arrays on project records in this phase.
- **D-10:** Related projects must resolve to selected public project detail pages, not merely any public project index record. This keeps Phase 15 project cross-links aligned with existing `/projects/{slug}` story pages and avoids linking writing to unsupported anchors as if they were story pages.
- **D-11:** Related project validation should fail for unknown, hidden, excluded, unselected, or unsupported project slugs.

### Validation and Tests

- **D-12:** Add pure validation helpers and Vitest coverage for duplicate/invalid slugs, missing title or summary, missing body content, public/draft filtering mistakes, path derivation, nullable lookup behavior, and related project slug integrity.
- **D-13:** Keep validation errors structured enough for scripts or tests to explain failures by code, slug, and message, matching the existing project curation validation pattern.
- **D-14:** Update the curation verification surface only if Phase 14 creates a runnable guard for writing validation. Do not expand browser, static HTML, sitemap, or release-readiness checks until later phases own those surfaces.

### the agent's Discretion

- The planner and executor may choose exact helper names and block type names as long as they stay consistent with existing domain naming, maybe-prefixed nullable lookups, and the supported-export style used by `src/domain/projects.ts`.
- The initial seed writing entries may be minimal and authored specifically to exercise the domain model, provided they avoid template residue and do not claim routes/UI that later phases have not built yet.

</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Milestone Scope

- `.planning/ROADMAP.md` - Phase 14 goal, requirements, success criteria, dependencies, and later-phase boundaries.
- `.planning/REQUIREMENTS.md` - v1.3 WRITE and LINK requirements mapped to Phase 14 plus out-of-scope exclusions for CMS, Markdown/MDX, feeds, search, comments, dynamic OG, and runtime content fetches.
- `.planning/PROJECT.md` - Project identity, v1.3 milestone context, current key decisions, and static/curated portfolio constraints.
- `AGENTS.md` - Repo-local dark-primary, Bright Builds workflow, and GSD artifact requirements.
- `AGENTS.bright-builds.md` - Bright Builds baseline workflow, TypeScript, verification, testing, and OpenLinks guidance.
- `standards-overrides.md` - No active local exceptions beyond the placeholder table.

### Existing Domain Patterns

- `src/domain/projects.ts` - Authoritative typed project registry, public selector helpers, nullable lookup naming, detail route eligibility, route path derivation, and supported helper surface comment.
- `src/domain/project-validation.ts` - Structured validation issue shape and registry validation pattern.
- `src/domain/project-validation.test.ts` - Focused curation tests using Arrange/Act/Assert comments.
- `src/domain/project-detail-routes.test.ts` - Detail-route eligibility, path derivation, nullable lookup, and sitemap metadata test examples.
- `src/domain/foundation.test.ts` - Supported project helper surface guard and core route registry expectations.
- `src/domain/routes.ts` - Current prerender route registry shape and how project detail routes enter static route derivation.
- `src/domain/seo.ts` - Static metadata and JSON-LD helper style that later writing metadata work will likely extend.
- `scripts/verify-curation.ts` - Existing curation verification command that may be extended when writing validation has a stable surface.

</canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- `curatedProjects` in `src/domain/projects.ts` provides the closest registry pattern: checked-in authored records, explicit types, pure selectors, and stable route helpers.
- `maybeProjectDetailPageProjectBySlug()` already encodes the repo's nullable lookup style and should guide writing lookup names.
- `projectDetailPageProjects()`, `projectDetailPath()`, and `projectDetailRoutes()` show how eligibility and path derivation are separated from route rendering.
- `validateProjectRegistry()` and `CurationIssue` show a useful structured validation pattern for writing curation errors.

### Established Patterns

- Domain logic is pure TypeScript in `src/domain`, tested by Vitest before any route or browser layer depends on it.
- Tests use Arrange, Act, Assert comments for non-trivial unit cases.
- Public route exposure is derived from domain helpers and then imported into `src/domain/routes.ts`.
- Existing helper surfaces are guarded by tests and a script so stale helper exports do not become accidental API.

### Integration Points

- Phase 14 should primarily touch `src/domain/*`, focused unit tests, and possibly `scripts/verify-curation.ts`.
- Phase 15 will likely consume public writing helpers from route files and navigation.
- Phase 16 will likely consume writing path, metadata, and body helpers from `src/domain/seo.ts` and static metadata scripts.
- Phase 17 will likely expand browser/static/release verification once writing routes actually exist.

</code_context>

<specifics>

## Specific Ideas

- Treat writing as a curated project-adjacent graph, not a mirrored blog archive.
- Prefer selected project detail pages as the relationship target so related writing can connect to project stories visitors can actually open as first-class pages.
- Keep first-pass content small and purposeful; validation and helper contracts matter more in Phase 14 than visual presentation.
- Do not add OpenLinks repetition while building writing data. Existing profile/footer/metadata identity placement remains sufficient unless later UI surfaces naturally need it.

</specifics>

<deferred>

## Deferred Ideas

- `/writing` index and `/writing/{slug}` route rendering belong to Phase 15.
- Project detail pages displaying related writing links belong to Phase 15.
- Writing route metadata, `BlogPosting` JSON-LD, sitemap inclusion, and social-preview fallback behavior belong to Phase 16.
- Static output, browser, release-readiness, and aggregate gate expansion belong to Phase 17.
- RSS/Atom, search, tag archives, comments, newsletter, CMS/admin, MDX, and dynamic OG images remain future or out of scope.

</deferred>

---

*Phase: 14-writing-domain-foundation*
*Context gathered: 2026-06-03*
