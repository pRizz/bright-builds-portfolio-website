# Phase 19: Theme Domain Foundation - Research

**Researched:** 2026-06-16
**Domain:** Curated static TypeScript theme registry, selector helpers, relationship validation, and curation gate integration
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

All content in this section is copied from `.planning/phases/19-theme-domain-foundation/19-CONTEXT.md`. [VERIFIED: 19-CONTEXT.md]

### Locked Decisions

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

### Deferred Ideas (OUT OF SCOPE)

## Deferred Ideas

- `/themes` index and `/themes/{slug}` route rendering belong to Phase 20.
- Theme-aware project/writing cross-links and collaboration panels belong to Phase 21.
- Theme route metadata, structured data, sitemap inclusion, and social preview fallback behavior belong to Phase 22.
- Theme static/browser/release verification and release-readiness evidence labels belong to Phase 23.
- Search, filters, tag archives, CMS/admin, comments/newsletter, analytics, live external-link reachability, runtime content fetches, and dynamic OG images remain future or out of scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| THEME-01 | Maintainer can define curated theme paths with slug, title, summary, audience, proof points, collaboration angle, related project slugs, and related writing slugs in typed checked-in data. [VERIFIED: .planning/REQUIREMENTS.md] | Add `src/domain/themes.ts` with exported theme types, `curatedThemes`, non-empty tuples where useful, and checked-in authored records. [VERIFIED: 19-CONTEXT.md; VERIFIED: src/domain/projects.ts; VERIFIED: src/domain/writing.ts] |
| THEME-02 | Maintainer can ask theme helpers for public theme entries, stable `/themes/{slug}` paths, and ordered theme lists without adding runtime APIs, CMS, MDX, parser pipelines, or external content dependencies. [VERIFIED: .planning/REQUIREMENTS.md] | Add public selectors, `maybePublicThemeEntryBySlug()`, `themeDetailPath()`, and `themeDetailRoutes()` that filter and sort through the public theme selector. [VERIFIED: 19-CONTEXT.md; VERIFIED: src/domain/writing.ts; VERIFIED: src/domain/projects.ts] |
| THEME-03 | Unit and curation tests fail for duplicate or invalid theme slugs, missing required fields, unsupported theme status, unknown project slugs, unknown writing slugs, hidden project references, or unpublished writing references. [VERIFIED: .planning/REQUIREMENTS.md] | Add `src/domain/theme-validation.ts`, validation tests, helper tests, and `scripts/verify-curation.ts` aggregation beside existing project and writing validators. [VERIFIED: 19-CONTEXT.md; VERIFIED: src/domain/project-validation.ts; VERIFIED: src/domain/writing-validation.ts; VERIFIED: scripts/verify-curation.ts] |
| THEME-04 | Theme model decisions keep the existing project and writing registries authoritative instead of duplicating authored project or writing content inside theme records. [VERIFIED: .planning/REQUIREMENTS.md] | Store only slug relationships on theme records and resolve display records through `maybeProjectDetailPageProjectBySlug()` and `maybePublicWritingEntryBySlug()`. [VERIFIED: 19-CONTEXT.md; VERIFIED: src/domain/projects.ts; VERIFIED: src/domain/writing.ts] |
</phase_requirements>

## Project Constraints (from AGENTS.md)

- Use `AGENTS.md` as the repo-local instruction entrypoint; it exists and was read before this research was completed. [VERIFIED: AGENTS.md]
- Read `AGENTS.bright-builds.md`, `standards-overrides.md`, `standards/index.md`, and the relevant architecture, code-shape, testing, verification, and TypeScript/JavaScript standards before plan or implementation work. [VERIFIED: AGENTS.md; VERIFIED: AGENTS.bright-builds.md; VERIFIED: standards-overrides.md; VERIFIED: standards/index.md]
- `standards-overrides.md` contains only the placeholder override table, so no active local standards exception changes Phase 19 planning. [VERIFIED: standards-overrides.md]
- Keep the portfolio dark-primary for user-facing UI, but Phase 19 should not add route files or visible UI. [VERIFIED: AGENTS.md; VERIFIED: 19-CONTEXT.md]
- Use GSD planning artifacts and commit planning docs as part of repo history; `commit_docs` is `true` for Phase 19. [VERIFIED: AGENTS.md; VERIFIED: .planning/config.json; VERIFIED: gsd init output]
- This TypeScript/JavaScript repo uses Bun scripts and a pinned `packageManager` field, so Phase 19 verification should use repo-owned Bun commands. [VERIFIED: package.json; CITED: standards/languages/typescript-javascript.md]
- Keep domain logic as pure data-in/data-out functions with framework, filesystem, and runtime effects outside the domain module. [CITED: standards/core/architecture.md; CITED: standards/languages/typescript-javascript.md]
- Use `maybe...` naming for nullable lookup helpers and nullish internal values. [VERIFIED: AGENTS.bright-builds.md; CITED: standards/core/code-shape.md; CITED: standards/languages/typescript-javascript.md]
- Pure business/domain logic must have focused unit tests with clear Arrange, Act, Assert structure. [CITED: standards/core/testing.md]
- Run relevant repo-native verification before committing changed work. [VERIFIED: AGENTS.bright-builds.md; CITED: standards/core/verification.md]
- Do not add new Python scripts to this Bun-friendly TypeScript repository. [CITED: standards/languages/typescript-javascript.md]
- No project-local skills were found under `.claude/skills` or `.agents/skills`. [VERIFIED: `find .claude/skills .agents/skills -maxdepth 2 -name SKILL.md -print`]

## Summary

Phase 19 should implement the theme domain as a local sibling to the existing project and writing domains: typed checked-in records, pure public selectors, nullable lookup, stable `/themes/{slug}` path helpers, relationship resolution, validation, and curation script aggregation. [VERIFIED: 19-CONTEXT.md; VERIFIED: src/domain/projects.ts; VERIFIED: src/domain/writing.ts; VERIFIED: scripts/verify-curation.ts] The closest implementation model is the completed writing domain from Phase 14, because it already validates slug-only relationships to selected project detail pages, exposes public helper contracts, and participates in the aggregate curation gate. [VERIFIED: src/domain/writing.ts; VERIFIED: src/domain/writing-validation.ts; VERIFIED: src/domain/writing.test.ts; VERIFIED: src/domain/writing-validation.test.ts]

The planner should not add Solid route files, `src/domain/routes.ts` integration, metadata, JSON-LD, sitemap output, browser checks, release-readiness labels, CMS/MDX/parser infrastructure, or runtime fetches in this phase. [VERIFIED: 19-CONTEXT.md; VERIFIED: .planning/ROADMAP.md; VERIFIED: .planning/REQUIREMENTS.md] Those surfaces are assigned to Phases 20 through 23, while Phase 19's durable output is a trusted domain contract that later phases can consume. [VERIFIED: .planning/ROADMAP.md; VERIFIED: 19-CONTEXT.md]

**Primary recommendation:** Add `src/domain/themes.ts`, `src/domain/theme-validation.ts`, focused Vitest tests, and theme aggregation in `scripts/verify-curation.ts`; use existing TypeScript, Bun, Vitest, Biome, project helpers, and writing helpers with no new dependencies. [VERIFIED: 19-CONTEXT.md; VERIFIED: package.json; VERIFIED: src/domain/projects.ts; VERIFIED: src/domain/writing.ts; VERIFIED: scripts/verify-curation.ts]

## Standard Stack

### Core

| Library / Surface | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| TypeScript | `6.0.3` pinned in `package.json`; npm registry reports `6.0.3` modified `2026-04-16T23:38:28.092Z`. [VERIFIED: package.json; VERIFIED: npm registry] | Typed theme records, exported helper contracts, and strict compile-time checks. [VERIFIED: tsconfig.json] | Existing domain registries are TypeScript modules using `as const satisfies readonly ...[]`. [VERIFIED: src/domain/projects.ts; VERIFIED: src/domain/writing.ts] |
| Bun scripts | Project pin is `bun@1.3.14`; local executable is `1.3.9`. [VERIFIED: package.json; VERIFIED: `bun --version`] | Run Vitest, curation verification, typecheck, and aggregate repo scripts. [VERIFIED: package.json] | The repo's package manager and script runner are Bun, and the TypeScript/JavaScript standard prefers Bun for Bun-friendly repos. [VERIFIED: package.json; CITED: standards/languages/typescript-javascript.md] |
| Vitest | `4.1.7` pinned in `package.json`; npm registry reports latest `4.1.9` modified `2026-06-15T08:53:15.265Z`. [VERIFIED: package.json; VERIFIED: npm registry] | Unit tests for pure theme selectors, relationship helpers, and validation issue codes. [VERIFIED: src/domain/writing.test.ts; VERIFIED: src/domain/writing-validation.test.ts] | Existing domain tests already use Vitest and the focused current-domain test run passed with 51 tests. [VERIFIED: `bun run test src/domain/writing.test.ts src/domain/writing-validation.test.ts src/domain/project-validation.test.ts scripts/project-helper-surface.test.ts`] |
| Biome | `2.4.15` pinned in `package.json`; npm registry reports latest `2.5.0` modified `2026-06-12T12:07:00.520Z`. [VERIFIED: package.json; VERIFIED: npm registry] | Format and lint TypeScript source, scripts, and tests. [VERIFIED: package.json; VERIFIED: biome.json] | Existing `format:check`, `check`, and `verify` scripts use Biome over `src`, `scripts`, and `tests`. [VERIFIED: package.json; VERIFIED: biome.json] |
| Project domain helpers | Local source, no package version. [VERIFIED: src/domain/projects.ts] | Validate and resolve related project slugs to selected public detail pages. [VERIFIED: 19-CONTEXT.md; VERIFIED: src/domain/projects.ts] | `maybeProjectDetailPageProjectBySlug()` is the existing selected-detail eligibility boundary. [VERIFIED: src/domain/projects.ts; VERIFIED: src/domain/writing-validation.ts] |
| Writing domain helpers | Local source, no package version. [VERIFIED: src/domain/writing.ts] | Validate and resolve related writing slugs to public writing entries. [VERIFIED: 19-CONTEXT.md; VERIFIED: src/domain/writing.ts] | `maybePublicWritingEntryBySlug()` is the existing public-writing eligibility boundary. [VERIFIED: src/domain/writing.ts] |

### Supporting

| Library / Surface | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `scripts/verify-curation.ts` | Local script. [VERIFIED: scripts/verify-curation.ts] | Aggregate project, writing, and theme validation into the existing curation gate. [VERIFIED: package.json; VERIFIED: 19-CONTEXT.md] | Extend after `validateThemeRegistry()` exists; prefix theme output with `theme/` or `themes/`. [VERIFIED: 19-CONTEXT.md; VERIFIED: scripts/verify-curation.ts] |
| `src/domain/project-validation.ts` pattern | Local source. [VERIFIED: src/domain/project-validation.ts] | Structured curation issue shape with severity, code, slug, and message. [VERIFIED: src/domain/project-validation.ts] | Mirror for theme validation rather than adding a shared abstraction in this phase. [VERIFIED: 19-CONTEXT.md] |
| `src/domain/writing-validation.ts` pattern | Local source. [VERIFIED: src/domain/writing-validation.ts] | Cross-registry relationship validation using maybe-prefixed lookup helpers. [VERIFIED: src/domain/writing-validation.ts] | Reuse the pattern for theme-to-project and theme-to-writing relationships. [VERIFIED: 19-CONTEXT.md; VERIFIED: src/domain/writing-validation.ts] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Typed checked-in `curatedThemes` registry. [VERIFIED: 19-CONTEXT.md] | CMS, admin UI, Markdown, MDX, Contentlayer, external feeds, or runtime content fetches. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: 19-CONTEXT.md] | Explicitly out of scope and adds parser/runtime/publishing surface the phase rejects. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: 19-CONTEXT.md] |
| Theme-local validator. [VERIFIED: 19-CONTEXT.md] | Zod, Valibot, JSON Schema, or a shared curation framework. [VERIFIED: package.json; VERIFIED: 19-CONTEXT.md] | No schema dependency is installed, theme invariants are simple, and the locked decision rejects a shared refactor for this phase. [VERIFIED: package.json; VERIFIED: 19-CONTEXT.md] |
| Authored stable slugs plus validation. [VERIFIED: src/domain/projects.ts; VERIFIED: src/domain/writing.ts; VERIFIED: 19-CONTEXT.md] | Runtime title-to-slug generation or a `slugify` package. [VERIFIED: package.json] | Existing project and writing paths interpolate authored slugs directly, and no slug generation package is installed. [VERIFIED: src/domain/projects.ts; VERIFIED: src/domain/writing.ts; VERIFIED: package.json] |
| Slug-only theme relationships. [VERIFIED: 19-CONTEXT.md] | Denormalized project/writing cards, evidence-annotated relation objects, or bidirectional theme arrays on project/writing records. [VERIFIED: 19-CONTEXT.md] | The user explicitly rejected those models for Phase 19 because project and writing registries must stay authoritative. [VERIFIED: 19-CONTEXT.md; VERIFIED: .planning/REQUIREMENTS.md] |

**Installation:**

```bash
# No install is required for Phase 19.
# Use the existing repo scripts from package.json.
```

**Version verification:** TypeScript, Vitest, Biome, and `@types/bun` versions were checked with `npm view` on 2026-06-16. [VERIFIED: npm registry] Vitest and Biome have newer registry versions than the current pins, but Phase 19 should not upgrade dependencies because the implementation needs no new library surface. [VERIFIED: npm registry; VERIFIED: package.json; VERIFIED: 19-CONTEXT.md]

## Architecture Patterns

### Recommended Project Structure

```text
src/domain/
|-- projects.ts                   # Existing selected project detail helpers. [VERIFIED: src/domain/projects.ts]
|-- writing.ts                    # Existing public writing helpers. [VERIFIED: src/domain/writing.ts]
|-- themes.ts                     # New theme types, registry, selectors, path helpers, relation helpers. [VERIFIED: 19-CONTEXT.md]
|-- theme-validation.ts           # New theme curation validation and assertion helpers. [VERIFIED: 19-CONTEXT.md]
|-- themes.test.ts                # New selector, route-helper, relationship, and helper-surface tests. [VERIFIED: 19-CONTEXT.md]
|-- theme-validation.test.ts      # New issue-code and checked-in registry validation tests. [VERIFIED: 19-CONTEXT.md]
scripts/
|-- verify-curation.ts            # Extend to include theme validation. [VERIFIED: scripts/verify-curation.ts; VERIFIED: 19-CONTEXT.md]
```

Do not add `src/routes/themes/*`, do not add `/themes` to `siteRoutes`, do not append `themeDetailRoutes()` to global `prerenderRoutes`, and do not update static/browser/release verification in Phase 19. [VERIFIED: 19-CONTEXT.md; VERIFIED: .planning/ROADMAP.md; VERIFIED: src/domain/routes.ts]

### Pattern 1: Lean Theme Registry

**What:** Add `src/domain/themes.ts` with exported types, `curatedThemes`, status-filtered public selectors, stable theme detail path helpers, and slug-only relationship helpers. [VERIFIED: 19-CONTEXT.md; VERIFIED: src/domain/writing.ts]

**When to use:** Use for all Phase 19 theme data and helper contracts. [VERIFIED: .planning/ROADMAP.md; VERIFIED: .planning/REQUIREMENTS.md]

**Example:**

```ts
// Source: adapted from src/domain/writing.ts and Phase 19 decisions.
export type ThemeStatus = "public" | "draft" | "hidden" | "unsupported" | "archived";

export type ThemeRecord = {
  slug: string;
  title: string;
  summary: string;
  status: ThemeStatus;
  displayOrder: number;
  audience: string;
  proofPoints: readonly [string, ...string[]];
  collaborationAngle: string;
  relatedProjectSlugs: readonly [string, ...string[]];
  relatedWritingSlugs: readonly [string, ...string[]];
};

export type PublicThemeRecord = ThemeRecord & {
  status: "public";
};
```

The exact status labels above are a recommendation based on the user-delegated discretion, not a locked decision. [ASSUMED]

### Pattern 2: Public Selector as the Eligibility Boundary

**What:** Public theme lookup, route derivation, and ordered lists should all flow through one selector that filters `status === "public"` and sorts by `displayOrder`. [VERIFIED: 19-CONTEXT.md; VERIFIED: src/domain/writing.ts; VERIFIED: src/domain/projects.ts]

**When to use:** Use for `publicThemeEntries()`, `maybePublicThemeEntryBySlug()`, and `themeDetailRoutes()`. [VERIFIED: 19-CONTEXT.md]

**Example:**

```ts
// Source: adapted from publicWritingEntries(), maybePublicWritingEntryBySlug(),
// writingDetailPath(), and writingDetailRoutes() in src/domain/writing.ts.
export function publicThemeEntries(
  themes: readonly ThemeRecord[] = curatedThemes,
): readonly PublicThemeRecord[] {
  return sortThemes(themes.filter(isPublicThemeRecord));
}

export function maybePublicThemeEntryBySlug(
  slug: string,
  themes: readonly ThemeRecord[] = curatedThemes,
): PublicThemeRecord | null {
  return publicThemeEntries(themes).find((theme) => theme.slug === slug) ?? null;
}

export function themeDetailPath(theme: Pick<ThemeRecord, "slug">): string {
  return `/themes/${theme.slug}`;
}

export function themeDetailRoutes(
  themes: readonly ThemeRecord[] = curatedThemes,
): readonly string[] {
  return publicThemeEntries(themes).map(themeDetailPath);
}
```

### Pattern 3: Defensive Relationship Resolution

**What:** Theme display helpers should flat-map slug arrays through existing public lookup helpers and silently omit unresolved records, while validation separately fails invalid relationships. [VERIFIED: 19-CONTEXT.md; VERIFIED: src/domain/writing.ts; VERIFIED: src/domain/writing-validation.ts]

**When to use:** Use for theme-to-project and theme-to-writing display helpers that later UI phases can call without leaking hidden content. [VERIFIED: 19-CONTEXT.md]

**Example:**

```ts
// Source: adapted from relatedProjectDetailPageProjects() in src/domain/writing.ts.
export function themeRelatedProjectDetailPageProjects(
  theme: Pick<ThemeRecord, "relatedProjectSlugs">,
  projects: readonly ProjectStory[] = curatedProjects,
): readonly ProjectDetailPageProject[] {
  return theme.relatedProjectSlugs.flatMap((slug) => {
    const maybeProject = maybeProjectDetailPageProjectBySlug(slug, projects);
    return maybeProject ? [maybeProject] : [];
  });
}

export function themeRelatedPublicWritingEntries(
  theme: Pick<ThemeRecord, "relatedWritingSlugs">,
  entries: readonly WritingEntry[] = curatedWriting,
): readonly PublicWritingEntry[] {
  return theme.relatedWritingSlugs.flatMap((slug) => {
    const maybeEntry = maybePublicWritingEntryBySlug(slug, entries);
    return maybeEntry ? [maybeEntry] : [];
  });
}
```

The relationship helper names above are recommended to avoid ambiguous imports with `writing.ts`, where `relatedProjectDetailPageProjects()` already exists. [VERIFIED: src/domain/writing.ts; ASSUMED]

### Pattern 4: Theme-Local Validation Module

**What:** Create `src/domain/theme-validation.ts` with structured issue types, per-record validation, whole-registry validation, error/warning selectors, and an assertion helper. [VERIFIED: 19-CONTEXT.md; VERIFIED: src/domain/project-validation.ts; VERIFIED: src/domain/writing-validation.ts]

**When to use:** Use for unit tests and `scripts/verify-curation.ts`; keep script-level formatting out of the validator. [VERIFIED: scripts/verify-curation.ts; VERIFIED: src/domain/writing-validation.ts]

**Example:**

```ts
// Source: adapted from src/domain/writing-validation.ts.
export type ThemeCurationErrorCode =
  | "duplicate_slug"
  | "invalid_slug"
  | "duplicate_display_order"
  | "unsupported_theme_status"
  | "missing_title"
  | "missing_summary"
  | "missing_audience"
  | "missing_proof_points"
  | "missing_collaboration_angle"
  | "missing_related_projects"
  | "missing_related_writing"
  | "unsupported_related_project"
  | "unpublished_related_writing";

export type ThemeCurationIssue = {
  severity: "error" | "warning";
  code: ThemeCurationErrorCode;
  slug: string;
  message: string;
  maybeRelatedProjectSlug?: string;
  maybeRelatedWritingSlug?: string;
};
```

The exact issue-code names above are recommended, and the user delegated final naming to the planner/executor as long as codes are precise, stable, and tested. [VERIFIED: 19-CONTEXT.md; ASSUMED]

### Anti-Patterns to Avoid

- **Starting Phase 20 early:** Theme domain helpers may expose `/themes/{slug}` strings, but Phase 19 should not create route files, global prerender wiring, navigation, UI, metadata, JSON-LD, sitemap entries, browser checks, or release labels. [VERIFIED: 19-CONTEXT.md; VERIFIED: .planning/ROADMAP.md]
- **Validating projects through public index helpers:** Related projects must resolve through `maybeProjectDetailPageProjectBySlug()`, not `publicProjectIndexProjects()`, because public index records can still lack selected detail routes. [VERIFIED: 19-CONTEXT.md; VERIFIED: src/domain/projects.ts; VERIFIED: src/domain/writing-validation.ts]
- **Validating writing through raw registry lookups:** Related writing must resolve through `maybePublicWritingEntryBySlug()`, not `curatedWriting.find()`, because draft, hidden, and archived entries are non-public. [VERIFIED: 19-CONTEXT.md; VERIFIED: src/domain/writing.ts]
- **Duplicating project or writing copy into themes:** Theme records can author theme-specific audience, proof points, and collaboration angle, but project/writing display content must remain in the existing registries. [VERIFIED: 19-CONTEXT.md; VERIFIED: .planning/REQUIREMENTS.md]
- **Creating shared validation abstractions now:** The locked decision is a theme-local validation module rather than a shared curation refactor. [VERIFIED: 19-CONTEXT.md]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Public theme route list | Ad hoc arrays copied into route config, tests, and future scripts. [VERIFIED: 19-CONTEXT.md] | `themeDetailRoutes()` derived from `publicThemeEntries()`. [VERIFIED: 19-CONTEXT.md; VERIFIED: src/domain/writing.ts] | Existing project and writing route helpers derive route paths from domain selectors. [VERIFIED: src/domain/projects.ts; VERIFIED: src/domain/writing.ts; VERIFIED: src/domain/routes.ts] |
| Project relationship eligibility | A custom scan of `curatedProjects` or public index records. [VERIFIED: src/domain/projects.ts] | `maybeProjectDetailPageProjectBySlug()`. [VERIFIED: src/domain/projects.ts; VERIFIED: 19-CONTEXT.md] | The selected detail-page helper already encodes the stricter public detail-route boundary. [VERIFIED: src/domain/projects.ts; VERIFIED: src/domain/writing-validation.ts] |
| Writing relationship eligibility | A custom scan of `curatedWriting`. [VERIFIED: src/domain/writing.ts] | `maybePublicWritingEntryBySlug()`. [VERIFIED: src/domain/writing.ts; VERIFIED: 19-CONTEXT.md] | The public writing helper already excludes draft, hidden, and archived records. [VERIFIED: src/domain/writing.ts] |
| Theme schema framework | New Zod/JSON Schema/Valibot dependency or a generic content validator. [VERIFIED: package.json; VERIFIED: 19-CONTEXT.md] | Theme-local pure TypeScript validator. [VERIFIED: 19-CONTEXT.md; VERIFIED: src/domain/writing-validation.ts] | No new dependency is needed, and the user rejected a shared validation refactor for this phase. [VERIFIED: package.json; VERIFIED: 19-CONTEXT.md] |
| Content pipeline | CMS, MDX, parser, feed, runtime fetch, or file-glob content system. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: 19-CONTEXT.md] | Checked-in TypeScript records. [VERIFIED: 19-CONTEXT.md] | v1.4 exclusions explicitly keep theme paths static and deterministic. [VERIFIED: .planning/REQUIREMENTS.md] |
| Display copy source of truth | Denormalized project/writing display copy inside theme records. [VERIFIED: 19-CONTEXT.md] | Slug arrays plus resolver helpers. [VERIFIED: 19-CONTEXT.md; VERIFIED: src/domain/projects.ts; VERIFIED: src/domain/writing.ts] | THEME-04 requires project and writing registries to remain authoritative. [VERIFIED: .planning/REQUIREMENTS.md] |

**Key insight:** Phase 19 creates the trustworthy content graph that later route, UI, metadata, and release phases consume, so the highest-value work is a narrow domain contract with strict validation rather than a generalized publishing or routing system. [VERIFIED: 19-CONTEXT.md; VERIFIED: .planning/ROADMAP.md]

## Common Pitfalls

### Pitfall 1: Accidentally Building Theme Routes

**What goes wrong:** The plan adds `/themes` route files, `siteRoutes` entries, `prerenderRoutes` wiring, metadata helpers, sitemap assertions, Playwright checks, or release labels. [VERIFIED: 19-CONTEXT.md; VERIFIED: .planning/ROADMAP.md]

**Why it happens:** `projectDetailRoutes()` and `writingDetailRoutes()` currently feed downstream route and verification surfaces, so a route helper can be mistaken for route integration. [VERIFIED: src/domain/routes.ts; VERIFIED: src/domain/writing.test.ts]

**How to avoid:** Add `themeDetailRoutes()` in `themes.ts`, test it locally, and leave all global route, SEO, static, browser, and release integration for Phases 20 through 23. [VERIFIED: 19-CONTEXT.md; VERIFIED: .planning/ROADMAP.md]

**Warning signs:** The Phase 19 plan edits `src/routes`, `src/domain/routes.ts`, `src/domain/seo.ts`, `scripts/verify-static`, `tests/browser-release.playwright.ts`, or release-readiness files. [VERIFIED: 19-CONTEXT.md; VERIFIED: src/domain/routes.ts; VERIFIED: rg source search]

### Pitfall 2: Related Projects Validate Too Broadly

**What goes wrong:** A theme references `open-bitcoin`, `open-links-sites`, or another public index project that lacks a selected detail page, and validation incorrectly passes. [VERIFIED: src/domain/projects.ts]

**Why it happens:** `publicProjectIndexProjects()` and `maybeProjectDetailPageProjectBySlug()` encode different public eligibility boundaries. [VERIFIED: src/domain/projects.ts]

**How to avoid:** Validate theme `relatedProjectSlugs` exclusively with `maybeProjectDetailPageProjectBySlug()`. [VERIFIED: 19-CONTEXT.md; VERIFIED: src/domain/writing-validation.ts]

**Warning signs:** `theme-validation.ts` imports `publicProjectIndexProjects()` but not `maybeProjectDetailPageProjectBySlug()`. [VERIFIED: src/domain/projects.ts; VERIFIED: src/domain/writing-validation.ts]

### Pitfall 3: Unpublished Writing Leaks Through Theme Helpers

**What goes wrong:** A draft, hidden, archived, or unknown writing slug appears in a theme's public relationship helper output. [VERIFIED: 19-CONTEXT.md; VERIFIED: src/domain/writing.ts]

**Why it happens:** The helper scans `curatedWriting` directly rather than calling `maybePublicWritingEntryBySlug()`. [VERIFIED: src/domain/writing.ts]

**How to avoid:** Use `maybePublicWritingEntryBySlug()` in both relationship helpers and validation. [VERIFIED: 19-CONTEXT.md; VERIFIED: src/domain/writing.ts]

**Warning signs:** Theme relationship code uses `curatedWriting.find((entry) => entry.slug === slug)`. [VERIFIED: src/domain/writing.ts]

### Pitfall 4: Seed Themes Stretch Beyond Existing Public Writing

**What goes wrong:** The planner tries to seed every named v1.4 theme path even when a theme cannot honestly connect to an existing public writing entry. [VERIFIED: .planning/PROJECT.md; VERIFIED: src/domain/writing.ts]

**Why it happens:** v1.4 context names target paths around agentic engineering, open identity, Bitcoin/open systems, and web tooling, while the current public writing registry contains two published entries. [VERIFIED: .planning/PROJECT.md; VERIFIED: src/domain/writing.ts]

**How to avoid:** Seed only themes whose related selected project detail pages and public writing entries are accurate; use test fixtures for hidden/draft/unsupported coverage instead of forcing weak checked-in public records. [VERIFIED: 19-CONTEXT.md; VERIFIED: src/domain/projects.ts; VERIFIED: src/domain/writing.ts]

**Warning signs:** A checked-in public theme has `relatedWritingSlugs` only to satisfy validation, but the theme copy does not genuinely match that writing entry. [VERIFIED: 19-CONTEXT.md; ASSUMED]

### Pitfall 5: Validation Logic Moves Into the CLI

**What goes wrong:** `scripts/verify-curation.ts` grows theme-specific validation logic directly instead of formatting results from a pure validator. [VERIFIED: scripts/verify-curation.ts]

**Why it happens:** The curation script is the visible failure point, so it can attract domain rules during implementation. [VERIFIED: scripts/verify-curation.ts; VERIFIED: src/domain/writing-validation.ts]

**How to avoid:** Keep `validateThemeRegistry()` and `assertValidCuratedThemes()` in `src/domain/theme-validation.ts`; the CLI should aggregate, print, and exit only. [VERIFIED: src/domain/writing-validation.ts; VERIFIED: scripts/verify-curation.ts]

**Warning signs:** Theme issue-code checks appear in `scripts/verify-curation.ts` tests rather than `theme-validation.test.ts`. [VERIFIED: src/domain/writing-validation.test.ts; VERIFIED: scripts/verify-curation.ts]

## Code Examples

Verified patterns from local sources:

### Theme Registry and Helper Surface

```ts
// Source: adapted from src/domain/writing.ts and src/domain/projects.ts.
export const curatedThemes = [
  {
    slug: "agentic-engineering",
    title: "Agentic engineering",
    summary: "A theme path through inspectable AI-assisted development work.",
    status: "public",
    displayOrder: 10,
    audience: "Builders who want agentic workflows that stay reviewable.",
    proofPoints: [
      "Connects the opencode-cloud project to practical workflow notes.",
      "Uses existing selected project detail pages and public writing entries.",
    ],
    collaborationAngle:
      "Useful for collaborators interested in agent infrastructure and evidence-driven development.",
    relatedProjectSlugs: ["opencode-cloud", "free-the-world"],
    relatedWritingSlugs: ["agentic-engineering-workflows"],
  },
] as const satisfies readonly ThemeRecord[];
```

The seed content above is illustrative and must be replaced or reviewed during implementation so it remains accurate, non-placeholder, and theme-specific. [ASSUMED]

### Relationship Validation

```ts
// Source: adapted from relatedProjectIssues() in src/domain/writing-validation.ts.
function relatedProjectIssues(
  theme: ThemeRecord,
  projects: readonly ProjectStory[],
): readonly ThemeCurationIssue[] {
  return theme.relatedProjectSlugs.flatMap((slug) => {
    const maybeProject = maybeProjectDetailPageProjectBySlug(slug, projects);

    if (maybeProject) {
      return [];
    }

    return [
      error(
        theme,
        "unsupported_related_project",
        `Related project "${slug}" must resolve to a selected project detail page.`,
        { maybeRelatedProjectSlug: slug },
      ),
    ];
  });
}
```

### Curation Script Aggregation

```ts
// Source: adapted from scripts/verify-curation.ts.
const projectResult = validateProjectRegistry(curatedProjects);
const writingResult = validateWritingRegistry(curatedWriting);
const themeResult = validateThemeRegistry(curatedThemes);

for (const error of themeResult.errors) {
  console.error(`[curation error] theme/${error.slug}: ${error.code} - ${error.message}`);
}
```

### Supported Export Test

```ts
// Source: adapted from src/domain/writing.test.ts supported surface test.
const supportedExports = [
  "curatedThemes",
  "publicThemeEntries",
  "maybePublicThemeEntryBySlug",
  "themeDetailPath",
  "themeDetailRoutes",
  "themeRelatedProjectDetailPageProjects",
  "themeRelatedPublicWritingEntries",
];
const legacyExports = ["themeSeeds", "featuredThemes", "primaryTheme"];
```

The exact public helper names in this export test are recommended names; the locked requirement is a tested supported surface with maybe-prefixed nullable lookup and no stale helper aliases. [VERIFIED: 19-CONTEXT.md; ASSUMED]

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Separate project and writing surfaces with no theme synthesis layer. [VERIFIED: .planning/PROJECT.md; VERIFIED: .planning/STATE.md] | v1.4 starts by adding typed theme domain data that composes existing selected project and public writing records. [VERIFIED: .planning/ROADMAP.md; VERIFIED: .planning/REQUIREMENTS.md] | v1.4 roadmap and Phase 19 context were created on 2026-06-16. [VERIFIED: .planning/ROADMAP.md; VERIFIED: 19-CONTEXT.md] | Plans should create a domain foundation before route/UI/metadata/release surfaces. [VERIFIED: .planning/ROADMAP.md; VERIFIED: 19-CONTEXT.md] |
| Generic content pipeline or runtime content source for theme pages. [VERIFIED: .planning/REQUIREMENTS.md] | Checked-in TypeScript records with pure helper contracts. [VERIFIED: 19-CONTEXT.md] | Explicitly locked in Phase 19 context on 2026-06-16. [VERIFIED: 19-CONTEXT.md] | No CMS, MDX, parser, runtime fetch, or external schema dependency should enter the plan. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: 19-CONTEXT.md] |
| Duplicated project/writing display fragments in the theme layer. [VERIFIED: 19-CONTEXT.md] | Slug-only relationships resolved from existing authoritative registries. [VERIFIED: 19-CONTEXT.md; VERIFIED: src/domain/projects.ts; VERIFIED: src/domain/writing.ts] | Locked by THEME-04 and Phase 19 decisions. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: 19-CONTEXT.md] | Theme records should own theme-specific synthesis copy only. [VERIFIED: 19-CONTEXT.md] |
| Validation hidden in scripts. [VERIFIED: scripts/verify-curation.ts] | Pure validation modules returning structured issues, with scripts aggregating output. [VERIFIED: src/domain/project-validation.ts; VERIFIED: src/domain/writing-validation.ts; VERIFIED: scripts/verify-curation.ts] | Already established by project and writing domains before Phase 19. [VERIFIED: src/domain/project-validation.ts; VERIFIED: src/domain/writing-validation.ts] | Theme validation should be unit-testable without invoking a CLI. [CITED: standards/core/architecture.md; CITED: standards/core/testing.md] |

**Deprecated/outdated for this phase:**

- Markdown, MDX, Contentlayer, CMS/admin, parser pipelines, runtime content fetches, dynamic Open Graph routes, search, filters, analytics, comments/newsletter, and live external-link reachability automation are excluded from v1.4 or Phase 19. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: 19-CONTEXT.md]
- Route/UI/metadata/sitemap/browser/release integration for themes is out of Phase 19 and assigned to Phases 20 through 23. [VERIFIED: .planning/ROADMAP.md; VERIFIED: 19-CONTEXT.md]
- No current `curatedThemes`, `themeDetailPath`, `ThemeRecord`, `themeSeeds`, or `featuredThemes` source surface exists in `src`, `scripts`, or `tests`; only planning docs mention them today. [VERIFIED: `rg "curatedThemes|themeDetail|themeSeeds|featuredThemes|ThemeRecord|themes/" src scripts tests .planning -g '*.ts' -g '*.tsx' -g '*.md'`]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Recommended `ThemeStatus` labels are `public`, `draft`, `hidden`, `unsupported`, and `archived`. [ASSUMED] | Architecture Patterns | Low; the user delegated exact labels, and tests can lock whichever labels the planner chooses. |
| A2 | Recommended relationship helper names should include a `theme` prefix to avoid ambiguity with `writing.ts` helper exports. [ASSUMED] | Architecture Patterns | Low; helper semantics matter more than exact names, but imports are clearer with theme-specific names. |
| A3 | Illustrative seed theme copy should be replaced or reviewed before implementation. [ASSUMED] | Code Examples | Medium; inaccurate seed copy would violate content-quality constraints and THEME-04's source-of-truth boundary. |
| A4 | STRIDE classifications in Security Domain are threat-model labels inferred from the phase scope. [ASSUMED] | Security Domain | Low; mitigations are still grounded in verified phase requirements and local code patterns. |

## Open Questions

1. **How many public seed themes should Phase 19 check in?**
   - What we know: v1.4 project context names target paths around agentic engineering, open identity, Bitcoin/open systems, and web tooling; current public writing contains `agentic-engineering-workflows` and `portable-identity-and-owned-surfaces`. [VERIFIED: .planning/PROJECT.md; VERIFIED: src/domain/writing.ts]
   - What's unclear: Whether every named target path can be made accurate now while also requiring at least one public writing relation per theme. [VERIFIED: 19-CONTEXT.md; VERIFIED: src/domain/writing.ts]
   - Recommendation: Prefer a small public seed set that accurately connects existing selected project detail pages with existing public writing, and cover hidden/draft/unsupported behavior with test fixtures rather than weak checked-in public records. [VERIFIED: 19-CONTEXT.md; ASSUMED]

2. **Should `relatedProjectSlugs` and `relatedWritingSlugs` be non-empty tuple types?**
   - What we know: Validation must fail when related project or writing slugs are missing. [VERIFIED: 19-CONTEXT.md; VERIFIED: .planning/REQUIREMENTS.md]
   - What's unclear: Whether the planner wants the type layer to make normal authoring non-empty or leave arrays loose and rely on validation. [VERIFIED: 19-CONTEXT.md]
   - Recommendation: Use non-empty tuple types for normal records and keep runtime validation for casts, tests, and future data drift. [CITED: standards/core/architecture.md; VERIFIED: src/domain/writing-validation.test.ts; ASSUMED]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Bun | Repo scripts, Vitest, curation verification. [VERIFIED: package.json] | Yes, but local version is behind project pin. [VERIFIED: `command -v bun`; VERIFIED: `bun --version`; VERIFIED: package.json] | Local `1.3.9`; project pin `1.3.14`. [VERIFIED: `bun --version`; VERIFIED: package.json] | Focused tests and curation verification passed locally; strict release work should prefer the pinned Bun version if version-sensitive failures appear. [VERIFIED: focused Vitest command; VERIFIED: `bun run verify:curation`] |
| Node | npm registry checks and ecosystem tooling compatibility. [VERIFIED: package.json] | Yes. [VERIFIED: `command -v node`; VERIFIED: `node --version`] | `v24.13.0`. [VERIFIED: `node --version`] | None needed for Phase 19 research or implementation. [VERIFIED: package.json] |
| npm | Version verification with `npm view`. [VERIFIED: npm registry] | Yes. [VERIFIED: `command -v npm`; VERIFIED: `npm --version`] | `11.6.2`. [VERIFIED: `npm --version`] | None needed. [VERIFIED: npm registry] |
| Vitest | Unit tests for domain helpers and validation. [VERIFIED: package.json] | Yes through `bun run test`. [VERIFIED: focused Vitest command] | Project pin `4.1.7`. [VERIFIED: package.json; VERIFIED: focused Vitest command] | None needed. [VERIFIED: focused Vitest command] |
| Curation verifier | Registry validity gate. [VERIFIED: package.json; VERIFIED: scripts/verify-curation.ts] | Yes. [VERIFIED: `bun run verify:curation`] | Local script. [VERIFIED: scripts/verify-curation.ts] | None needed. [VERIFIED: `bun run verify:curation`] |

**Missing dependencies with no fallback:**

- None found for Phase 19. [VERIFIED: environment probes]

**Missing dependencies with fallback:**

- Local Bun is older than the project pin, but focused Vitest and curation verification commands passed with the local executable. [VERIFIED: `bun --version`; VERIFIED: package.json; VERIFIED: focused Vitest command; VERIFIED: `bun run verify:curation`]

## Security Domain

Security enforcement is enabled by default because `.planning/config.json` does not set `security_enforcement` to `false`. [VERIFIED: .planning/config.json]

OWASP ASVS latest stable is 5.0.0 dated May 2025, and OWASP recommends version-qualified identifiers because ASVS identifiers can change between versions. [CITED: https://github.com/OWASP/ASVS; CITED: https://raw.githubusercontent.com/OWASP/ASVS/v5.0.0/5.0/docs_en/OWASP_Application_Security_Verification_Standard_5.0.0_en.csv]

### Applicable ASVS Categories

| ASVS 5.0 Category | Applies | Standard Control |
|-------------------|---------|-----------------|
| V1 Encoding and Sanitization | Limited. [CITED: OWASP ASVS 5.0.0 CSV; VERIFIED: 19-CONTEXT.md] | Keep theme content as plain typed strings and do not introduce Markdown/MDX/raw HTML/parser pipelines in this phase. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: 19-CONTEXT.md] |
| V2 Validation and Business Logic | Yes. [CITED: OWASP ASVS 5.0.0 CSV; VERIFIED: .planning/REQUIREMENTS.md] | Validate slug shape, uniqueness, status eligibility, required fields, display order uniqueness, and cross-registry relationships. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: 19-CONTEXT.md] |
| V3 Web Frontend Security | No direct Phase 19 UI work. [CITED: OWASP ASVS 5.0.0 CSV; VERIFIED: 19-CONTEXT.md] | Leave browser rendering controls to later route/UI phases and keep Phase 19 data safe for text rendering. [VERIFIED: 19-CONTEXT.md; VERIFIED: .planning/ROADMAP.md] |
| V4 API and Web Service | No. [CITED: OWASP ASVS 5.0.0 CSV; VERIFIED: .planning/REQUIREMENTS.md] | Do not add runtime APIs, external fetches, or server endpoints. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: 19-CONTEXT.md] |
| Authentication, Session, Authorization, and Cryptography surfaces | No for Phase 19. [VERIFIED: .planning/REQUIREMENTS.md] | No auth, session, access-control UI, credentials, encryption, or key material are in scope. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: 19-CONTEXT.md] |

### Known Threat Patterns for Theme Domain Data

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Hidden, draft, archived, or unsupported themes appear in future public routes. [VERIFIED: 19-CONTEXT.md] | Information Disclosure. [ASSUMED] | Centralize public filtering in `publicThemeEntries()` and derive `themeDetailRoutes()` from that selector. [VERIFIED: 19-CONTEXT.md; VERIFIED: src/domain/writing.ts] |
| Theme routes use malformed or duplicate slugs. [VERIFIED: .planning/REQUIREMENTS.md] | Tampering / Spoofing. [ASSUMED] | Validate lowercase hyphenated slugs and duplicate slugs before curation passes. [VERIFIED: src/domain/writing-validation.ts; VERIFIED: 19-CONTEXT.md] |
| Theme relations expose hidden projects or unpublished writing. [VERIFIED: 19-CONTEXT.md] | Information Disclosure. [ASSUMED] | Resolve relationships through `maybeProjectDetailPageProjectBySlug()` and `maybePublicWritingEntryBySlug()`; validation fails unresolved relations. [VERIFIED: src/domain/projects.ts; VERIFIED: src/domain/writing.ts; VERIFIED: src/domain/writing-validation.ts] |
| Future renderers treat theme copy as executable markup. [VERIFIED: .planning/REQUIREMENTS.md] | Tampering / Information Disclosure. [ASSUMED] | Keep Phase 19 copy as typed plain strings and avoid Markdown/MDX/raw HTML/content parsers. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: 19-CONTEXT.md] |

## Sources

### Primary (HIGH confidence)

- `.planning/phases/19-theme-domain-foundation/19-CONTEXT.md` - locked decisions, phase boundary, helper expectations, validation scope, testing boundary, and deferred work. [VERIFIED: local file read]
- `.planning/ROADMAP.md` - Phase 19 goal, success criteria, dependencies, and Phase 20-23 ownership boundaries. [VERIFIED: local file read]
- `.planning/REQUIREMENTS.md` - THEME-01 through THEME-04 and v1.4 exclusions. [VERIFIED: local file read]
- `.planning/STATE.md` and `.planning/PROJECT.md` - milestone state, current project decisions, prior phase history, and v1.4 target context. [VERIFIED: local file read]
- `AGENTS.md`, `AGENTS.bright-builds.md`, `standards-overrides.md`, and `standards/index.md` - repo-local workflow constraints, Bright Builds baseline rules, and active override status. [VERIFIED: local file read]
- `standards/core/architecture.md`, `standards/core/code-shape.md`, `standards/core/testing.md`, `standards/core/verification.md`, and `standards/languages/typescript-javascript.md` - architecture, naming, test, verification, and TypeScript/Bun rules. [VERIFIED: local file read]
- `src/domain/projects.ts` - project registry, selected detail-page eligibility, nullable lookup naming, and path/route helpers. [VERIFIED: local file read]
- `src/domain/writing.ts` - public writing helpers, nullable lookup, route helpers, and relationship resolution pattern. [VERIFIED: local file read]
- `src/domain/project-validation.ts`, `src/domain/writing-validation.ts`, `src/domain/writing.test.ts`, `src/domain/writing-validation.test.ts`, and `src/domain/project-validation.test.ts` - curation issue patterns and existing domain test style. [VERIFIED: local file read]
- `scripts/verify-curation.ts` - current curation verification aggregation. [VERIFIED: local file read]
- `package.json`, `tsconfig.json`, and `biome.json` - existing package pins, scripts, TypeScript strictness, and formatting/linting setup. [VERIFIED: local file read]
- npm registry checks for `typescript`, `vitest`, `@biomejs/biome`, and `@types/bun`. [VERIFIED: npm registry]
- OWASP ASVS official project and v5.0.0 CSV for current ASVS version and category references. [CITED: https://github.com/OWASP/ASVS; CITED: https://raw.githubusercontent.com/OWASP/ASVS/v5.0.0/5.0/docs_en/OWASP_Application_Security_Verification_Standard_5.0.0_en.csv]

### Secondary (MEDIUM confidence)

- None needed; Phase 19 is constrained by local code and locked user decisions. [VERIFIED: 19-CONTEXT.md]

### Tertiary (LOW confidence)

- Recommended exact status labels, helper names, issue-code names, STRIDE labels, and illustrative seed content are marked in the Assumptions Log for planner review. [ASSUMED]

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - no new dependencies are recommended, and package/script versions were verified locally and through npm where relevant. [VERIFIED: package.json; VERIFIED: npm registry]
- Architecture: HIGH - the existing writing domain is a direct local analogue for theme registry, public selectors, relationship resolution, validation, and curation aggregation. [VERIFIED: src/domain/writing.ts; VERIFIED: src/domain/writing-validation.ts; VERIFIED: scripts/verify-curation.ts; VERIFIED: 19-CONTEXT.md]
- Pitfalls: HIGH - pitfalls come from explicit Phase 19 exclusions, existing route integration points, and relationship helper boundaries. [VERIFIED: 19-CONTEXT.md; VERIFIED: .planning/ROADMAP.md; VERIFIED: src/domain/routes.ts; VERIFIED: src/domain/writing-validation.ts]
- Security: MEDIUM-HIGH - ASVS category applicability is straightforward for a static domain-data phase, but STRIDE labels are inferred threat-model classifications. [VERIFIED: .planning/REQUIREMENTS.md; CITED: OWASP ASVS; ASSUMED]

**Research date:** 2026-06-16
**Valid until:** 2026-07-16 for local architecture guidance; re-check npm/tool versions before dependency or toolchain changes. [ASSUMED]
