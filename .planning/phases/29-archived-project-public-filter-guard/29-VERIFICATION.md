---
phase: 29-archived-project-public-filter-guard
verified: 2026-06-23T03:06:49Z
status: passed
score: 7/7 must-haves verified
generated_by: gsd-verifier
lifecycle_mode: yolo
phase_lifecycle_id: 29-2026-06-23T02-40-50
generated_at: 2026-06-23T03:06:49Z
lifecycle_validated: true
overrides_applied: 0
---

# Phase 29: Archived Project Public Filter Guard Verification Report

**Phase Goal:** Archived project records cannot become public project detail or social preview targets, and regression tests guard the public-only filter contract.
**Verified:** 2026-06-23T03:06:49Z
**Status:** passed
**Re-verification:** No - initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|---|---|---|
| 1 | Archived public-looking project fixtures are excluded from `projectDetailPageProjects()`, `projectDetailRoutes()`, `maybeProjectDetailPageProjectBySlug()`, and `socialPreviewTargets()`. | VERIFIED | `isProjectDetailPageProject()` calls the shared public predicate before allowing detail projects in `src/domain/projects.ts:635-640`; `projectDetailRoutes()` derives from `projectDetailPageProjects()` at `src/domain/projects.ts:578-581`; selected-looking archived fixtures in `src/domain/project-detail-routes.test.ts:101-140` produce only `/projects/visible-detail` and resolve to `null`; social preview tests exclude both archived fixture paths at `src/domain/social-previews.test.ts:59-67` and `src/domain/social-previews.test.ts:123-136`. |
| 2 | Archived project records with `status: "archived"` cannot appear in public project index, selected project detail route, or social preview target output. | VERIFIED | `isPublicProjectIndexProject()` rejects `project.status !== "archived"` at `src/domain/projects.ts:624-631`; route tests include `archived-status-detail` at `src/domain/project-detail-routes.test.ts:101-106`; public-surface tests include `archived-status-public-placement` and keep it in hidden/excluded output at `src/domain/portfolio-surfaces.test.ts:131-172`; social preview target tests assert `not.toContain(projectDetailPath(archivedStatusProject))` at `src/domain/social-previews.test.ts:135`. |
| 3 | Archived project records with `maturity: "archived"` cannot appear in public project index, selected project detail route, or social preview target output. | VERIFIED | `isPublicProjectIndexProject()` rejects `project.maturity !== "archived"` at `src/domain/projects.ts:624-631`; route tests include `archived-maturity-detail` at `src/domain/project-detail-routes.test.ts:107-112`; public-surface tests include `archived-maturity-public-placement` and keep it in hidden/excluded output at `src/domain/portfolio-surfaces.test.ts:140-172`; social preview target tests assert `not.toContain(projectDetailPath(archivedMaturityProject))` at `src/domain/social-previews.test.ts:136`. |
| 4 | `projectDetailPageProjects()`, `projectDetailRoutes()`, `maybeProjectDetailPageProjectBySlug()`, `visibleProjects()`, and `hiddenExcludedProjects()` share the same public project predicate. | VERIFIED | `visibleProjects()` delegates to `publicProjectIndexProjects()` at `src/domain/projects.ts:510-519`; `hiddenExcludedProjects()` negates the same predicate at `src/domain/projects.ts:522-525`; `projectDetailPageProjects()` filters through `isProjectDetailPageProject()` at `src/domain/projects.ts:537-540`; `isProjectDetailPageProject()` calls `isPublicProjectIndexProject(project)` at `src/domain/projects.ts:635-637`; slug resolution and route derivation then reuse `projectDetailPageProjects()` at `src/domain/projects.ts:543-547` and `src/domain/projects.ts:578-581`. |
| 5 | `socialPreviewTargets({ projects })` derives project targets through `projectDetailPageProjects()` and has no parallel archived-project guard. | VERIFIED | `socialPreviewTargets()` calls `projectDetailPageProjects(sources.projects)` at `src/domain/social-previews.ts:104-113`; `rg -n 'archived|status\s*(===|!==)\s*"archived"|maturity\s*(===|!==)\s*"archived"' src/domain/social-previews.ts` returned no matches, confirming no duplicate archive guard in `src/domain/social-previews.ts`. |
| 6 | Project detail, portfolio surface, and social preview tests cover archived project filtering with selected-looking archived fixtures. | VERIFIED | `src/domain/project-detail-routes.test.ts:83-140` covers archived detail fixtures and slug lookup; `src/domain/portfolio-surfaces.test.ts:92-173` covers visible versus hidden/excluded public surfaces; `src/domain/social-previews.test.ts:35-136` covers social preview target filtering. `makeProjectStory()` defaults are selected-looking (`placement: "home"`, `tier: "flagship"`, `includeInProjectIndex: true`, non-empty `detail`) at `src/domain/social-previews.test.ts:414-446`. |
| 7 | Targeted verification proves the public-only filter guard and social preview/release contracts still pass, and generated social preview assets remain clean. | VERIFIED | Fresh run passed: targeted Vitest reported 3 files and 32 tests passed; `bun run verify:social-previews` verified 13 deterministic PNGs/manifest entries; `bun run verify:static` verified 16 prerendered routes plus metadata/JSON-LD/social manifest/assets/sitemap/robots; `bun run verify:release` passed with generated social preview PNG total `736.0 KB`; aggregate `bun run verify` passed with format/check/typecheck, 249 Vitest tests, curation/runtime/helper/visual/social checks, build, 83 Playwright passes with 19 skips, static verification, and release verification. `git status --short public/social/generated` returned no output before and after verification. |

**Score:** 7/7 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|---|---|---|---|
| `src/domain/projects.ts` | Shared public project predicate used by public, detail, route, and hidden/excluded selectors. | VERIFIED | Exists and substantive. `gsd-tools verify artifacts` passed. Contains archived status and maturity guards at lines 630-631 and routes all required selectors through the shared predicate. |
| `src/domain/project-detail-routes.test.ts` | Regression tests for archived selected-looking project detail fixtures. | VERIFIED | Exists and substantive. `gsd-tools verify artifacts` passed. Contains `archived-status-detail`, `archived-maturity-detail`, route assertion `["/projects/visible-detail"]`, and `maybeProjectDetailPageProjectBySlug()` null checks. |
| `src/domain/portfolio-surfaces.test.ts` | Regression tests that archived projects are hidden/excluded public-surface records. | VERIFIED | Exists and substantive. `gsd-tools verify artifacts` passed. Covers visible output `["public-supporting"]` and hidden/excluded archived status and maturity records in display order. |
| `src/domain/social-previews.test.ts` | Regression tests that archived selected-looking fixtures do not become social preview target routes. | VERIFIED | Exists and substantive. `gsd-tools verify artifacts` passed. Covers archived status and maturity fixture paths and keeps expected route output limited to public project/writing/theme targets. |
| `src/domain/social-previews.ts` | Downstream social preview derivation remains helper-derived, without duplicated archive visibility logic. | VERIFIED | Inspected as a key linked artifact. Calls `projectDetailPageProjects(sources.projects)` at line 107. Duplicate guard grep over this file returned no matches. |

### Key Link Verification

| From | To | Via | Status | Details |
|---|---|---|---|---|
| `src/domain/projects.ts` | `projectDetailPageProjects()` | `isProjectDetailPageProject(project)` calls `isPublicProjectIndexProject(project)`. | VERIFIED | Manual trace: `projectDetailPageProjects()` filters through `isProjectDetailPageProject()` at lines 537-540; `isProjectDetailPageProject()` calls `isPublicProjectIndexProject(project)` at lines 635-637. `gsd-tools verify key-links` produced a false negative for this escaped pattern, so manual evidence is authoritative. |
| `src/domain/projects.ts` | `visibleProjects()` and `hiddenExcludedProjects()` | `publicProjectIndexProjects(projects)` and negated `isPublicProjectIndexProject(project)`. | VERIFIED | `visibleProjects()` delegates to `publicProjectIndexProjects()` at lines 510-513; `publicProjectIndexProjects()` filters with `isPublicProjectIndexProject` at lines 516-519; `hiddenExcludedProjects()` negates the same predicate at lines 522-525. `gsd-tools verify key-links` verified this link. |
| `src/domain/social-previews.ts` | `src/domain/projects.ts` | `socialPreviewTargets()` calls `projectDetailPageProjects(sources.projects)`. | VERIFIED | Manual trace: `socialPreviewTargets()` calls `projectDetailPageProjects(sources.projects)` at `src/domain/social-previews.ts:104-107` and maps that filtered list into project targets at lines 111-113. `gsd-tools verify key-links` produced a false negative for this escaped pattern, so manual evidence is authoritative. |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|---|---|---|---|---|
| `src/domain/projects.ts` | `projects` | Caller-supplied project arrays or `curatedProjects`; public output flows through `projects.filter(isPublicProjectIndexProject)`. | Yes | FLOWING - archived status/maturity are rejected before visible, hidden/excluded, detail, route, and slug helpers derive outputs. |
| `src/domain/social-previews.ts` | `projects` | `socialPreviewTargets({ projects })` passes `sources.projects` to `projectDetailPageProjects()` before `projects.map(targetForProject)`. | Yes | FLOWING - social previews consume the already-filtered detail project list instead of hardcoded empty data or duplicate visibility logic. |
| `src/domain/project-detail-routes.test.ts` | `fixtureProjects` | Local selected-looking archived fixtures copied from `curatedProjects[0]` with only archived status/maturity changed. | Yes | FLOWING - assertions prove archived fixtures do not reach detail route output or slug lookup. |
| `src/domain/social-previews.test.ts` | `projects` fixture array | Local selected-looking fixture helper with non-empty detail data and public defaults, overridden only for archived status/maturity. | Yes | FLOWING - assertions prove archived fixtures do not reach social preview route output. |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|---|---|---|---|
| Archived filter regression tests pass. | `bun run test src/domain/project-detail-routes.test.ts src/domain/social-previews.test.ts src/domain/portfolio-surfaces.test.ts` | 3 files passed, 32 tests passed. | PASS |
| Social preview generated assets are current. | `bun run verify:social-previews` | Verified 13 deterministic social preview PNGs and manifest entries. | PASS |
| Static output remains consistent with route helpers and generated assets. | `bun run verify:static` | Verified 16 prerendered routes, metadata, JSON-LD, writing/theme route coverage, social preview manifest, assets, sitemap, and robots in `.output/public`. | PASS |
| Release contract remains valid. | `bun run verify:release` | Release verification passed; generated social preview PNG total was `736.0 KB`. | PASS |
| Aggregate repo gate passes. | `bun run verify` | Format/check/typecheck, 249 Vitest tests, curation/runtime/helper/visual/social checks, build, Playwright browser checks, static verification, and release verification passed. | PASS |
| Generated social preview assets stay clean. | `git status --short public/social/generated` | No output before verification; no output after verification. | PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|---|---|---|---|---|
| SHARE-02 | `29-01-PLAN.md` | Hidden, draft, unsupported, archived, unselected, or otherwise non-public project, writing, and theme records do not create public social preview targets. | SATISFIED | Phase 29 closes the archived-project gap identified in the milestone audit. `isPublicProjectIndexProject()` now rejects archived status and maturity; `socialPreviewTargets()` continues to consume `projectDetailPageProjects()`; social preview tests exclude selected-looking archived project fixtures while preserving public writing/theme targets. |
| VERIFY-01 | `29-01-PLAN.md` | Unit tests cover social preview target derivation, public-only filtering, path uniqueness, fingerprint stability, manifest freshness checks, metadata image selection, JSON-LD image parity, and offline freshness finding classification. | SATISFIED | Phase 29 adds the missing archived-project public-only filtering coverage in project detail, portfolio surface, and social preview tests. Aggregate `bun run verify` passed 249 Vitest tests plus the social/static/release verification gates, confirming the broader VERIFY-01 coverage remains intact. |

No orphaned Phase 29 requirements were found. `.planning/REQUIREMENTS.md` maps only `SHARE-02` and `VERIFY-01` to Phase 29, and both are claimed by the PLAN frontmatter and verified above.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|---|---|---|---|---|
| None | - | - | - | No blocker anti-patterns found. Grep matches were normal validation helper empty returns/local accumulators in `src/domain/social-previews.ts`, not user-visible stubs or disconnected data. |

### Human Verification Required

None. This phase changes pure domain filtering and regression coverage; the relevant behavior is covered by automated unit, static, release, generated asset, and aggregate verification.

### Gaps Summary

No gaps found. The archived project filter now lives at the shared project selector layer, downstream social previews remain helper-derived without a duplicate archive guard, selected-looking archived fixtures are excluded from detail and social targets, and generated social preview assets stayed unchanged.

### Guidance Loaded

Repo-local guidance and Bright Builds standards materially used: `AGENTS.md`, `AGENTS.bright-builds.md`, `standards-overrides.md`, `standards/core/testing.md`, `standards/core/verification.md`, and `standards/languages/typescript-javascript.md`. No project skills were found under `.claude/skills/` or `.agents/skills/`.

---

_Verified: 2026-06-23T03:06:49Z_
_Verifier: the agent (gsd-verifier)_
