# Phase 14: Writing Domain Foundation - Research

**Researched:** 2026-06-03
**Domain:** Curated static TypeScript writing registry and validation
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

All content in this section is copied from `.planning/phases/14-writing-domain-foundation/14-CONTEXT.md`. [VERIFIED: 14-CONTEXT.md]

### Locked Decisions

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

### Deferred Ideas (OUT OF SCOPE)

## Deferred Ideas

- `/writing` index and `/writing/{slug}` route rendering belong to Phase 15.
- Project detail pages displaying related writing links belong to Phase 15.
- Writing route metadata, `BlogPosting` JSON-LD, sitemap inclusion, and social-preview fallback behavior belong to Phase 16.
- Static output, browser, release-readiness, and aggregate gate expansion belong to Phase 17.
- RSS/Atom, search, tag archives, comments, newsletter, CMS/admin, MDX, and dynamic OG images remain future or out of scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| WRITE-01 | Maintainer can define curated writing or note entries in a typed checked-in registry without adding runtime APIs, CMS, MDX, or external content dependencies. [VERIFIED: .planning/REQUIREMENTS.md] | Add `src/domain/writing.ts` with exported types and `curatedWriting` data; do not add content dependencies. [VERIFIED: 14-CONTEXT.md; VERIFIED: package.json] |
| WRITE-02 | Maintainer can mark writing entries as published or hidden/draft so only selected public entries create public static routes. [VERIFIED: .planning/REQUIREMENTS.md] | Add status-based public selectors and `writingDetailRoutes()` that filters non-public entries. [VERIFIED: 14-CONTEXT.md; VERIFIED: src/domain/projects.ts] |
| WRITE-03 | Maintainer can author entry title, summary, date or status, tags or topics, body sections or blocks, and optional related project slugs in a structure that validation can verify. [VERIFIED: .planning/REQUIREMENTS.md] | Use a typed `WritingEntry` shape and a validation module for required fields, body blocks, slug shape, and relationships. [VERIFIED: 14-CONTEXT.md; VERIFIED: src/domain/project-validation.ts] |
| WRITE-04 | Unit tests cover writing eligibility, slug and path derivation, public/draft exclusion, required field validation, and related project slug integrity. [VERIFIED: .planning/REQUIREMENTS.md] | Add focused Vitest coverage mirroring `project-validation.test.ts` and `project-detail-routes.test.ts`. [VERIFIED: src/domain/project-validation.test.ts; VERIFIED: src/domain/project-detail-routes.test.ts] |
| LINK-01 | Writing entries can reference related selected project slugs through typed data. [VERIFIED: .planning/REQUIREMENTS.md] | Store `relatedProjectSlugs` on writing entries and resolve them through selected project detail helpers. [VERIFIED: 14-CONTEXT.md; VERIFIED: src/domain/projects.ts] |
| LINK-03 | Verification fails when a writing entry references an unknown, hidden, or unsupported project slug. [VERIFIED: .planning/REQUIREMENTS.md] | Validate related slugs with `maybeProjectDetailPageProjectBySlug()` rather than public index helpers. [VERIFIED: 14-CONTEXT.md; VERIFIED: src/domain/projects.ts] |
</phase_requirements>

## Project Constraints (from AGENTS.md)

- Use `AGENTS.md` as the repo-local instruction entrypoint; it exists and was read. [VERIFIED: AGENTS.md]
- Read `AGENTS.bright-builds.md`, `standards-overrides.md`, and relevant canonical standards before planning or implementation. [VERIFIED: AGENTS.md; VERIFIED: AGENTS.bright-builds.md]
- Keep portfolio UI dark-primary; Phase 14 has no UI work, but later writing UI must verify desktop and mobile dark rendering, contrast/readability, and text-overlap. [VERIFIED: AGENTS.md]
- Use GSD planning artifacts and commit planning docs as repo history. [VERIFIED: AGENTS.md]
- Do not directly mutate `STATE.md` or `ROADMAP.md` as part of this research; those are upstream planning state files for the workflow. [VERIFIED: user prompt; VERIFIED: .planning/STATE.md; VERIFIED: .planning/ROADMAP.md]
- TypeScript/JavaScript repo work should use the established package manager and scripts; this repo uses Bun scripts and `bun.lock`. [VERIFIED: package.json; VERIFIED: bun.lock; CITED: Bright Builds TypeScript/JavaScript standard]
- Keep business logic as data-in/data-out functions and push framework/runtime work into thin shells. [CITED: Bright Builds architecture standard; CITED: Bright Builds TypeScript/JavaScript standard]
- Prefer tagged unions, stronger domain types, and parser/validation boundaries where they make invalid states harder to create. [CITED: Bright Builds architecture standard; CITED: Bright Builds TypeScript/JavaScript standard]
- Use `maybe...` names for nullish internal functions, locals, params, and optional/nullish fields when absence is a normal success path. [VERIFIED: AGENTS.bright-builds.md; CITED: Bright Builds code-shape standard; CITED: Bright Builds TypeScript/JavaScript standard]
- Pure business/domain logic must have unit tests, and unit tests should isolate one concern with clear Arrange/Act/Assert sections. [VERIFIED: AGENTS.bright-builds.md; CITED: Bright Builds testing standard]
- Run relevant repo-native verification before committing changed work. [VERIFIED: AGENTS.bright-builds.md; CITED: Bright Builds verification standard]
- No project skills exist under `.claude/skills` or `.agents/skills` in this checkout. [VERIFIED: `find .claude .agents -maxdepth 3 -type f -name SKILL.md -print`]

## Summary

Phase 14 should add a pure TypeScript writing domain as a sibling to the existing project domain, not a blog engine or route/UI feature. [VERIFIED: 14-CONTEXT.md; VERIFIED: .planning/ROADMAP.md] The closest local pattern is `src/domain/projects.ts`, which combines exported domain types, a checked-in curated registry, public selectors, nullable `maybe...` lookup helpers, detail-path helpers, and route-list helpers. [VERIFIED: src/domain/projects.ts; VERIFIED: src/domain/project-detail-routes.test.ts]

The planner should create `src/domain/writing.ts`, `src/domain/writing-validation.ts`, and focused Vitest tests, then extend `scripts/verify-curation.ts` so writing validation participates in the existing curation gate. [VERIFIED: scripts/verify-curation.ts; VERIFIED: package.json] The planner should not wire writing routes into global `prerenderRoutes`, create Solid route files, add metadata/JSON-LD/sitemap behavior, or expand browser/static/release verification in Phase 14 because those surfaces are assigned to Phases 15-17. [VERIFIED: 14-CONTEXT.md; VERIFIED: .planning/ROADMAP.md]

**Primary recommendation:** Build a repo-owned typed writing registry with status-filtered public selectors, `/writing/{slug}` path helpers, selected-project relationship validation, and curation/unit tests; add no new dependencies. [VERIFIED: 14-CONTEXT.md; VERIFIED: package.json; VERIFIED: .planning/research/SUMMARY.md]

## Standard Stack

### Core

| Library / Surface | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| TypeScript | `6.0.3` pinned in `package.json`; latest `6.0.3` on npm, modified `2026-04-16T23:38:28.092Z`. [VERIFIED: package.json; VERIFIED: npm registry] | Typed domain records, exported helper contracts, and compile-time checking. [VERIFIED: tsconfig.json; CITED: Bright Builds TypeScript/JavaScript standard] | The repo already uses strict TypeScript with `noEmit`, `isolatedModules`, and Bun/Solid types. [VERIFIED: tsconfig.json] |
| Bun scripts | `packageManager: bun@1.3.14`; local executable is `1.3.9`. [VERIFIED: package.json; VERIFIED: `bun --version`] | Run Vitest, curation verification, typecheck, and repo scripts. [VERIFIED: package.json] | The repo-standard command surface is Bun. [VERIFIED: package.json; CITED: Bright Builds TypeScript/JavaScript standard] |
| Vitest | `4.1.7` pinned; latest `4.1.8` on npm, modified `2026-06-01T09:45:01.761Z`. [VERIFIED: package.json; VERIFIED: npm registry] | Unit tests for pure writing selectors and validation. [VERIFIED: src/domain/project-validation.test.ts; VERIFIED: src/domain/project-detail-routes.test.ts] | Existing domain tests already run through Vitest and passed in this session. [VERIFIED: `bun run test src/domain/project-validation.test.ts src/domain/project-detail-routes.test.ts src/domain/foundation.test.ts scripts/project-helper-surface.test.ts`] |
| Biome | `2.4.15` pinned; latest `2.4.16` on npm, modified `2026-05-27T13:41:35.665Z`. [VERIFIED: package.json; VERIFIED: npm registry] | Format and lint TS/TSX/scripts/tests. [VERIFIED: package.json; VERIFIED: biome.json] | Existing `format`, `format:check`, `lint`, and `check` scripts use Biome. [VERIFIED: package.json] |
| Existing project domain helpers | Local source, no package version. [VERIFIED: src/domain/projects.ts] | Validate `relatedProjectSlugs` against selected public project detail pages. [VERIFIED: 14-CONTEXT.md; VERIFIED: src/domain/projects.ts] | `maybeProjectDetailPageProjectBySlug()` rejects unselected public projects and hidden/excluded records through the selected-detail helper path. [VERIFIED: src/domain/project-detail-routes.test.ts] |

### Supporting

| Library / Surface | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `scripts/verify-curation.ts` | Local script. [VERIFIED: scripts/verify-curation.ts] | Runnable curation gate for project registry today and writing registry after Phase 14. [VERIFIED: package.json; VERIFIED: scripts/verify-curation.ts] | Extend only after `validateWritingRegistry()` exists. [VERIFIED: 14-CONTEXT.md] |
| `src/domain/project-validation.ts` pattern | Local source. [VERIFIED: src/domain/project-validation.ts] | Structured issue pattern with `severity`, `code`, `slug`, and `message`. [VERIFIED: src/domain/project-validation.ts] | Mirror the shape for writing so script output and tests stay readable. [VERIFIED: 14-CONTEXT.md] |
| `@solidjs/start` / SolidStart | `1.3.2` pinned; latest `1.3.2` on npm, modified `2026-02-24T21:13:42.737Z`. [VERIFIED: package.json; VERIFIED: npm registry] | Downstream static route rendering in Phase 15. [VERIFIED: app.config.ts; VERIFIED: .planning/ROADMAP.md] | Do not touch route files or global prerender wiring in Phase 14. [VERIFIED: 14-CONTEXT.md] |
| `solid-js` | `1.9.13` pinned; latest `1.9.13` on npm, modified `2026-05-19T17:38:41.300Z`. [VERIFIED: package.json; VERIFIED: npm registry] | Downstream rendering for typed blocks in later UI. [VERIFIED: package.json; VERIFIED: src/routes/projects/[slug].tsx] | Mention only as future consumer; Phase 14 stays pure domain code. [VERIFIED: 14-CONTEXT.md] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Typed `curatedWriting` registry. [VERIFIED: 14-CONTEXT.md] | Markdown, MDX, Contentlayer, CMS, external feeds, runtime fetches. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: 14-CONTEXT.md] | Explicitly out of scope for v1.3 and adds parser/runtime/publishing surface this phase is meant to avoid. [VERIFIED: .planning/REQUIREMENTS.md] |
| Repo-owned validation helpers. [VERIFIED: src/domain/project-validation.ts] | Zod or another schema package. [VERIFIED: package.json] | No schema dependency is currently installed, and Phase 14 invariants are simple enough for pure TS validators. [VERIFIED: package.json; VERIFIED: 14-CONTEXT.md] |
| Manual slug validation with a local regex. [VERIFIED: src/domain/projects.ts] | `slugify` package. [VERIFIED: package.json] | Existing slugs are authored stable URL segments, not generated from titles, so generation is unnecessary. [VERIFIED: src/domain/projects.ts; VERIFIED: src/domain/project-detail-routes.test.ts] |
| Writing-owned `relatedProjectSlugs`. [VERIFIED: 14-CONTEXT.md] | Duplicated `relatedWritingSlugs` on project records. [VERIFIED: 14-CONTEXT.md] | Duplicated relationship data can drift, and the user decision explicitly rejects it. [VERIFIED: 14-CONTEXT.md] |

**Installation:**

```bash
# No package install is required for Phase 14.
# Use the existing repo scripts from package.json.
```

**Version verification:** Package versions above were checked against `package.json` and `npm view` on 2026-06-03. [VERIFIED: package.json; VERIFIED: npm registry] `vitest` and `@biomejs/biome` have newer patch releases than the current pins, but this phase should not upgrade them because no dependency change is required. [VERIFIED: npm registry; VERIFIED: 14-CONTEXT.md]

## Architecture Patterns

### Recommended Project Structure

```text
src/domain/
|-- projects.ts                  # Existing project registry and selected detail helpers [VERIFIED: src/domain/projects.ts]
|-- project-validation.ts        # Existing project curation issue pattern [VERIFIED: src/domain/project-validation.ts]
|-- writing.ts                   # New writing types, curated registry, public selectors, path helpers [VERIFIED: 14-CONTEXT.md]
|-- writing-validation.ts        # New writing curation validation and assertion helpers [VERIFIED: 14-CONTEXT.md]
|-- writing.test.ts              # New unit tests for selector/path/relationship behavior [VERIFIED: .planning/REQUIREMENTS.md]
|-- writing-validation.test.ts   # New unit tests for validation issue codes and registry guard [VERIFIED: .planning/REQUIREMENTS.md]
scripts/
|-- verify-curation.ts           # Extend to run both project and writing validation [VERIFIED: scripts/verify-curation.ts]
```

Do not add `src/routes/writing/*`, do not add `/writing` to `siteRoutes`, and do not append writing detail paths to global `prerenderRoutes` in Phase 14. [VERIFIED: 14-CONTEXT.md; VERIFIED: .planning/ROADMAP.md] `writingDetailRoutes()` can exist as a domain helper that later phases consume. [VERIFIED: 14-CONTEXT.md]

### Pattern 1: Sibling Domain Registry

**What:** Add a `src/domain/writing.ts` module that owns writing types, `curatedWriting`, public selectors, nullable lookup, detail path derivation, and selected-project relationship helpers. [VERIFIED: 14-CONTEXT.md; VERIFIED: src/domain/projects.ts]

**When to use:** Use this pattern for all Phase 14 writing data and helper contracts. [VERIFIED: .planning/ROADMAP.md]

**Example:**

```ts
// Source: Local pattern from src/domain/projects.ts and Phase 14 decisions.
export type WritingStatus = "published" | "draft" | "hidden" | "archived";
export type WritingKind = "note" | "essay";

export type WritingBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "list"; items: readonly [string, ...string[]] }
  | { kind: "callout"; text: string };

export type WritingSection = {
  heading: string;
  blocks: readonly [WritingBlock, ...WritingBlock[]];
};

export type WritingEntry = {
  slug: string;
  title: string;
  summary: string;
  status: WritingStatus;
  kind: WritingKind;
  maybePublishedOn?: string;
  maybeUpdatedOn?: string;
  displayOrder: number;
  topics: readonly [string, ...string[]];
  tags: readonly string[];
  relatedProjectSlugs: readonly string[];
  sections: readonly [WritingSection, ...WritingSection[]];
};
```

The exact status labels above are a recommendation, not a locked user decision. [ASSUMED]

### Pattern 2: Public Selectors and Maybe Lookup

**What:** Public selectors should filter by a single eligibility predicate, sort by `displayOrder`, and expose `maybe...BySlug()` for nullable lookup. [VERIFIED: 14-CONTEXT.md; VERIFIED: src/domain/projects.ts]

**When to use:** Use this for `publicWritingEntries()`, `maybePublicWritingEntryBySlug()`, `writingDetailPath()`, and `writingDetailRoutes()`. [VERIFIED: 14-CONTEXT.md]

**Example:**

```ts
// Source: Local pattern from projectDetailPageProjects(), maybeProjectDetailPageProjectBySlug(),
// projectDetailPath(), and projectDetailRoutes() in src/domain/projects.ts.
export function publicWritingEntries(
  entries: readonly WritingEntry[] = curatedWriting,
): readonly WritingEntry[] {
  return sortWriting(entries.filter(isPublicWritingEntry));
}

export function maybePublicWritingEntryBySlug(
  slug: string,
  entries: readonly WritingEntry[] = curatedWriting,
): WritingEntry | null {
  return publicWritingEntries(entries).find((entry) => entry.slug === slug) ?? null;
}

export function writingDetailPath(entry: Pick<WritingEntry, "slug">): string {
  return `/writing/${entry.slug}`;
}

export function writingDetailRoutes(
  entries: readonly WritingEntry[] = curatedWriting,
): readonly string[] {
  return publicWritingEntries(entries).map(writingDetailPath);
}

function isPublicWritingEntry(entry: WritingEntry): boolean {
  return entry.status === "published";
}

function sortWriting<TEntry extends WritingEntry>(entries: readonly TEntry[]): readonly TEntry[] {
  return [...entries].sort((left, right) => left.displayOrder - right.displayOrder);
}
```

### Pattern 3: Selected Project Relationship Resolution

**What:** Validate and resolve writing relationships through `maybeProjectDetailPageProjectBySlug()` so writing links target selected project detail pages only. [VERIFIED: 14-CONTEXT.md; VERIFIED: src/domain/projects.ts; VERIFIED: src/domain/project-detail-routes.test.ts]

**When to use:** Use this in writing validation and in `relatedProjectsForWriting()`. [VERIFIED: 14-CONTEXT.md]

**Example:**

```ts
// Source: Local selected-project helper pattern from src/domain/projects.ts.
import type { ProjectDetailPageProject, ProjectStory } from "./projects";
import { curatedProjects, maybeProjectDetailPageProjectBySlug } from "./projects";

export function relatedProjectsForWriting(
  entry: WritingEntry,
  projects: readonly ProjectStory[] = curatedProjects,
): readonly ProjectDetailPageProject[] {
  return entry.relatedProjectSlugs.flatMap((slug) => {
    const maybeProject = maybeProjectDetailPageProjectBySlug(slug, projects);
    return maybeProject ? [maybeProject] : [];
  });
}
```

### Pattern 4: Structured Writing Validation

**What:** Add `WritingCurationIssue` objects with structured `severity`, `code`, `slug`, and `message`, then return split `issues`, `errors`, and `warnings`. [VERIFIED: src/domain/project-validation.ts; VERIFIED: 14-CONTEXT.md]

**When to use:** Use this for duplicate slugs, invalid slug shape, required field checks, body checks, public selector checks, and related project slug integrity. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: 14-CONTEXT.md]

**Example:**

```ts
// Source: Local pattern from src/domain/project-validation.ts.
export type WritingCurationErrorCode =
  | "duplicate_writing_slug"
  | "invalid_writing_slug"
  | "public_writing_missing_title"
  | "public_writing_missing_summary"
  | "public_writing_missing_body"
  | "public_writing_missing_date"
  | "public_writing_invalid_related_project";

export type WritingCurationIssue = {
  severity: "error";
  code: WritingCurationErrorCode;
  slug: string;
  message: string;
  maybeRelatedProjectSlug?: string;
};
```

### Anti-Patterns to Avoid

- **Global prerender integration in Phase 14:** Adding writing paths to `src/domain/routes.ts` before route files exist moves Phase 15 work into Phase 14. [VERIFIED: 14-CONTEXT.md; VERIFIED: .planning/ROADMAP.md]
- **Markdown/MDX parser pipeline:** v1.3 explicitly excludes Markdown, MDX, Contentlayer, parser pipelines, CMS/admin, and runtime content fetches. [VERIFIED: .planning/REQUIREMENTS.md]
- **Loose `body: string` or raw HTML:** A single unstructured body string cannot validate blocks/sections as requested and makes later rendering less predictable. [VERIFIED: WRITE-03 in .planning/REQUIREMENTS.md; VERIFIED: 14-CONTEXT.md]
- **Relationship duplication:** Do not add related-writing arrays to project records during this phase. [VERIFIED: 14-CONTEXT.md]
- **Validating related projects against `publicProjectIndexProjects()` only:** That would allow public but unsupported project anchors; the user decision requires selected project detail pages. [VERIFIED: 14-CONTEXT.md; VERIFIED: src/domain/project-detail-routes.test.ts]
- **Silent validation skips:** `verify:curation` should exit non-zero for writing errors once writing validation exists. [VERIFIED: scripts/verify-curation.ts; VERIFIED: 14-CONTEXT.md]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Content publishing pipeline | Markdown/MDX importer, CMS client, external feed reader, runtime fetcher. [VERIFIED: .planning/REQUIREMENTS.md] | Typed checked-in `curatedWriting` records. [VERIFIED: 14-CONTEXT.md] | The milestone explicitly values deterministic static output and excludes content pipelines. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: 14-CONTEXT.md] |
| Route exposure | Manual duplicated arrays of public writing paths in tests, routes, and scripts. [VERIFIED: src/domain/routes.ts; VERIFIED: src/domain/project-detail-routes.test.ts] | `writingDetailRoutes()` derived from public writing selectors. [VERIFIED: src/domain/projects.ts; VERIFIED: 14-CONTEXT.md] | Local project routes already derive path lists from domain helpers. [VERIFIED: src/domain/projects.ts; VERIFIED: src/domain/routes.ts] |
| Relationship graph | Bidirectional stored relationships on writing and projects. [VERIFIED: 14-CONTEXT.md] | `relatedProjectSlugs` on writing entries plus resolver/filter helpers. [VERIFIED: 14-CONTEXT.md] | One source of truth avoids drift and matches the locked user decision. [VERIFIED: 14-CONTEXT.md] |
| Curation CLI framework | New validation runner or new script stack. [VERIFIED: scripts/verify-curation.ts; VERIFIED: package.json] | Extend `scripts/verify-curation.ts` after writing validation exists. [VERIFIED: 14-CONTEXT.md] | The repo already has a curation verification script and aggregate `verify` chain. [VERIFIED: package.json] |
| Slug generation | Runtime title-to-slug generation. [VERIFIED: src/domain/projects.ts] | Authored stable slugs plus validation. [VERIFIED: src/domain/projects.ts; VERIFIED: 14-CONTEXT.md] | Existing project slugs are authored URL segments and route helpers interpolate them directly. [VERIFIED: src/domain/projects.ts; VERIFIED: src/domain/project-detail-routes.test.ts] |

**Key insight:** Phase 14 is about making future route/UI/metadata work trustworthy, so the value is in a small domain contract and strict validation rather than a generalized content system. [VERIFIED: 14-CONTEXT.md; VERIFIED: .planning/ROADMAP.md]

## Common Pitfalls

### Pitfall 1: Accidentally Starting Phase 15

**What goes wrong:** The plan wires `/writing` into `siteRoutes`, `prerenderRoutes`, Solid route files, sitemap checks, or browser checks before route rendering exists. [VERIFIED: .planning/ROADMAP.md; VERIFIED: 14-CONTEXT.md]

**Why it happens:** `projectDetailRoutes()` currently feeds `prerenderRoutes`, so it is tempting to connect writing routes immediately. [VERIFIED: src/domain/routes.ts; VERIFIED: app.config.ts]

**How to avoid:** Add `writingDetailRoutes()` as a domain helper but leave global route registry and route files for Phase 15. [VERIFIED: 14-CONTEXT.md]

**Warning signs:** Edits to `src/routes/writing/*`, `src/domain/routes.ts`, `src/domain/seo.ts`, `scripts/verify-static.ts`, `tests/browser-release.playwright.ts`, or `docs/release-readiness.md` appear in the Phase 14 plan. [VERIFIED: 14-CONTEXT.md; VERIFIED: .planning/ROADMAP.md]

### Pitfall 2: Related Projects Validate Too Broadly

**What goes wrong:** A writing entry references `open-bitcoin` or another public index project that does not have a selected detail page. [VERIFIED: src/domain/project-detail-routes.test.ts]

**Why it happens:** `publicProjectIndexProjects()` and `maybeProjectDetailPageProjectBySlug()` answer different eligibility questions. [VERIFIED: src/domain/projects.ts]

**How to avoid:** Validate related project slugs with `maybeProjectDetailPageProjectBySlug()` and fail unknown, hidden, excluded, unselected, or unsupported slugs. [VERIFIED: 14-CONTEXT.md; VERIFIED: src/domain/projects.ts]

**Warning signs:** Validation imports `publicProjectIndexProjects()` but not `maybeProjectDetailPageProjectBySlug()`. [VERIFIED: src/domain/projects.ts]

### Pitfall 3: Hidden/Draft Entries Leak Through Helpers

**What goes wrong:** `writingDetailRoutes()` or `maybePublicWritingEntryBySlug()` returns draft/hidden/archived entries. [VERIFIED: 14-CONTEXT.md]

**Why it happens:** Helpers operate directly on `curatedWriting` instead of a single public selector. [VERIFIED: src/domain/projects.ts]

**How to avoid:** Route all public path and lookup helpers through `publicWritingEntries()`. [VERIFIED: src/domain/projects.ts; VERIFIED: 14-CONTEXT.md]

**Warning signs:** `writingDetailRoutes()` uses `entries.map(writingDetailPath)` without filtering first. [VERIFIED: src/domain/projects.ts pattern]

### Pitfall 4: Validation Error Shape Drifts

**What goes wrong:** Writing validators throw ad hoc strings or errors that scripts cannot format by code/slug/message. [VERIFIED: 14-CONTEXT.md]

**Why it happens:** Validation is added quickly inside tests or scripts instead of as a pure domain helper. [VERIFIED: src/domain/project-validation.ts; VERIFIED: scripts/verify-curation.ts]

**How to avoid:** Mirror the existing `ProjectRegistryValidation` pattern and add `assertValidCuratedWriting()` for script use. [VERIFIED: src/domain/project-validation.ts]

**Warning signs:** `scripts/verify-curation.ts` contains most writing validation logic directly. [VERIFIED: scripts/verify-curation.ts]

### Pitfall 5: Overly Flexible Body Blocks

**What goes wrong:** The body model supports arbitrary HTML, embedded scripts, or broad untyped blobs before any renderer exists. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: 14-CONTEXT.md]

**Why it happens:** The phase is mistaken for a general blog engine. [VERIFIED: 14-CONTEXT.md]

**How to avoid:** Start with the block kinds needed by seed entries: paragraphs, lists, callouts, and simple link references only when needed. [VERIFIED: 14-CONTEXT.md]

**Warning signs:** New dependencies, `dangerouslySetInnerHTML`, MDX imports, file globs, syntax highlighters, or CMS/feed clients appear in the plan. [VERIFIED: package.json; VERIFIED: .planning/REQUIREMENTS.md]

## Code Examples

Verified patterns from local sources:

### Writing Registry and Public Helpers

```ts
// Source: src/domain/projects.ts helper pattern.
export const curatedWriting = [
  {
    slug: "agentic-engineering-notes",
    title: "Agentic engineering notes",
    summary: "A short note on practical AI-assisted engineering workflows.",
    status: "published",
    kind: "note",
    maybePublishedOn: "2026-06-03",
    displayOrder: 10,
    topics: ["Agentic engineering"],
    tags: ["ai", "developer-tools"],
    relatedProjectSlugs: ["opencode-cloud"],
    sections: [
      {
        heading: "Working thesis",
        blocks: [{ kind: "paragraph", text: "Keep the note body as typed content." }],
      },
    ],
  },
] as const satisfies readonly WritingEntry[];
```

Example seed copy above is illustrative and must be replaced with authored project-appropriate content during implementation. [ASSUMED]

### Writing Validation Entry Point

```ts
// Source: src/domain/project-validation.ts and scripts/verify-curation.ts pattern.
export type WritingRegistryValidation = {
  issues: readonly WritingCurationIssue[];
  errors: readonly WritingCurationIssue[];
  warnings: readonly WritingCurationIssue[];
};

export function validateWritingRegistry(
  entries: readonly WritingEntry[] = curatedWriting,
  projects: readonly ProjectStory[] = curatedProjects,
): WritingRegistryValidation {
  const issues = [
    ...duplicateSlugIssues(entries),
    ...entries.flatMap((entry) => validateWritingEntry(entry, projects)),
  ];

  return {
    issues,
    errors: issues.filter((issue) => issue.severity === "error"),
    warnings: issues.filter((issue) => issue.severity === "warning"),
  };
}
```

### Curation Script Integration

```ts
// Source: scripts/verify-curation.ts existing shape.
const projectResult = validateProjectRegistry(curatedProjects);
const writingResult = validateWritingRegistry(curatedWriting);
const errors = [...projectResult.errors, ...writingResult.errors];

for (const error of errors) {
  console.error(`[curation error] ${error.slug}: ${error.code} - ${error.message}`);
}

if (errors.length > 0) {
  process.exit(1);
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Mirrored blog/archive, external feeds, Markdown/MDX, CMS, or runtime content fetching. [VERIFIED: .planning/REQUIREMENTS.md] | Typed checked-in static writing data with pure helpers and validation. [VERIFIED: 14-CONTEXT.md] | v1.3 roadmap and context created on 2026-06-03. [VERIFIED: .planning/ROADMAP.md; VERIFIED: 14-CONTEXT.md] | Plans should prioritize deterministic static data and validation over publishing infrastructure. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: 14-CONTEXT.md] |
| Relationship data on both writing records and project records. [VERIFIED: 14-CONTEXT.md] | Writing entries own `relatedProjectSlugs`; project-side related writing is derived later. [VERIFIED: 14-CONTEXT.md] | Phase 14 context gathered on 2026-06-03. [VERIFIED: 14-CONTEXT.md] | Avoids relationship drift and keeps Phase 15 project UI derived from one data source. [VERIFIED: 14-CONTEXT.md] |
| Validation hidden in a script. [VERIFIED: scripts/verify-curation.ts] | Pure validation helpers with structured issues, called by tests and scripts. [VERIFIED: src/domain/project-validation.ts; VERIFIED: scripts/verify-curation.ts] | Existing project domain already uses this pattern. [VERIFIED: src/domain/project-validation.ts] | Writing validation should be testable without running a CLI. [CITED: Bright Builds architecture standard; CITED: Bright Builds testing standard] |

**Deprecated/outdated for this phase:**

- Markdown, MDX, Contentlayer, CMS/admin, parser pipelines, feeds, search, tag archives, comments, newsletters, dynamic OG images, and runtime content/API calls are out of scope for v1.3. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: 14-CONTEXT.md]
- Adding route/UI/metadata/sitemap/browser/release coverage in Phase 14 is out of phase and should be deferred to Phases 15-17. [VERIFIED: .planning/ROADMAP.md; VERIFIED: 14-CONTEXT.md]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | The exact status labels can be `published`, `draft`, `hidden`, and `archived`. [ASSUMED] | Architecture Patterns | Low; helper semantics are the important contract, but implementation may choose different labels if tests and selectors are clear. |
| A2 | The illustrative seed entry title/body in Code Examples is not final content. [ASSUMED] | Code Examples | Medium; implementation still needs real authored copy that does not read as placeholder. |

## Open Questions

1. **What seed writing entries should be checked in?** [VERIFIED: 14-CONTEXT.md]
   - What we know: The context permits minimal seed writing entries authored to exercise the model. [VERIFIED: 14-CONTEXT.md]
   - What's unclear: Exact title, summary, body content, and whether a hidden/draft seed should exist in `curatedWriting` or only in test fixtures. [ASSUMED]
   - Recommendation: Add at least one real public seed entry with related selected project slugs, and test hidden/draft behavior with fixtures unless there is a real hidden/draft entry worth checking in. [VERIFIED: 14-CONTEXT.md]
2. **Should invalid slug validation include only lowercase hyphenated URL segments?** [VERIFIED: src/domain/projects.ts]
   - What we know: Existing project slugs are lowercase URL-safe segments and route helpers interpolate slugs directly into `/projects/{slug}`. [VERIFIED: src/domain/projects.ts; VERIFIED: src/domain/project-detail-routes.test.ts]
   - What's unclear: The exact writing slug regex is not locked by the context. [VERIFIED: 14-CONTEXT.md]
   - Recommendation: Use `^[a-z0-9]+(?:-[a-z0-9]+)*$` for writing slugs unless the planner records a different rule. [ASSUMED]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Bun | Running repo scripts, Vitest, curation verification. [VERIFIED: package.json] | Yes, but local version is behind project pin. [VERIFIED: `bun --version`; VERIFIED: package.json] | Local `1.3.9`; project pin `1.3.14`. [VERIFIED: `bun --version`; VERIFIED: package.json] | Focused tests ran successfully on local `1.3.9`; planner should upgrade/switch to pinned Bun before strict release commits if required. [VERIFIED: focused Vitest command] |
| Node | Tool compatibility and npm registry checks. [VERIFIED: package.json] | Yes. [VERIFIED: `node --version`] | `v24.13.0`. [VERIFIED: `node --version`] | None needed for Phase 14. [VERIFIED: package.json] |
| Vitest | Unit tests. [VERIFIED: package.json] | Yes through `bun run test`. [VERIFIED: focused Vitest command] | `4.1.7`. [VERIFIED: focused Vitest command; VERIFIED: package.json] | None needed. [VERIFIED: focused Vitest command] |
| Curation verifier | Registry guard. [VERIFIED: scripts/verify-curation.ts] | Yes. [VERIFIED: `bun run verify:curation`] | Local script. [VERIFIED: scripts/verify-curation.ts] | None needed. [VERIFIED: package.json] |

**Missing dependencies with no fallback:**

- None found for Phase 14. [VERIFIED: environment probes]

**Missing dependencies with fallback:**

- Local Bun is older than the project pin; focused test and curation commands still ran successfully, but strict execution should prefer the pinned Bun version. [VERIFIED: `bun --version`; VERIFIED: package.json; VERIFIED: focused Vitest command; VERIFIED: `bun run verify:curation`]

## Security Domain

Security enforcement is enabled by default because `.planning/config.json` does not set `security_enforcement` to `false`. [VERIFIED: .planning/config.json]

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No for Phase 14. [VERIFIED: .planning/REQUIREMENTS.md; CITED: OWASP ASVS] | No auth, account, credential, or login surface is in scope. [VERIFIED: .planning/REQUIREMENTS.md] |
| V3 Session Management | No for Phase 14. [VERIFIED: .planning/REQUIREMENTS.md; CITED: OWASP ASVS] | No session lifecycle or cookie/session token behavior is in scope. [VERIFIED: .planning/REQUIREMENTS.md] |
| V4 Access Control | Limited. [CITED: OWASP ASVS] | Use public selectors that exclude draft/hidden/archived entries and tests that prove exclusion. [VERIFIED: 14-CONTEXT.md; VERIFIED: .planning/REQUIREMENTS.md] |
| V5 Validation, Sanitization and Encoding | Yes. [CITED: OWASP ASVS] | Validate slugs, required fields, body blocks, status eligibility, and related selected-project slugs. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: 14-CONTEXT.md] |
| V6 Stored Cryptography | No for Phase 14. [VERIFIED: .planning/REQUIREMENTS.md; CITED: OWASP ASVS] | No secrets, credentials, encryption, or key material are in scope. [VERIFIED: .planning/REQUIREMENTS.md] |
| V10 Malicious Code | Limited. [CITED: OWASP ASVS] | Do not add runtime content fetching, API clients, CMS clients, MDX execution, or arbitrary raw HTML content. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: 14-CONTEXT.md] |

### Known Threat Patterns for This Stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Draft/hidden writing leaks through public helpers. [VERIFIED: 14-CONTEXT.md] | Information Disclosure. [ASSUMED] | Centralize public filtering in `publicWritingEntries()` and test `writingDetailRoutes()` plus nullable lookup exclusion. [VERIFIED: src/domain/projects.ts; VERIFIED: 14-CONTEXT.md] |
| Slug path confusion or malformed static paths. [VERIFIED: .planning/REQUIREMENTS.md] | Tampering / Spoofing. [ASSUMED] | Validate unique lowercase URL-safe slugs and derive paths through `writingDetailPath()`. [VERIFIED: src/domain/projects.ts; VERIFIED: .planning/REQUIREMENTS.md] |
| Related writing links to hidden or unsupported projects. [VERIFIED: 14-CONTEXT.md] | Information Disclosure / Tampering. [ASSUMED] | Resolve relationships through `maybeProjectDetailPageProjectBySlug()` and fail validation on null. [VERIFIED: src/domain/projects.ts; VERIFIED: 14-CONTEXT.md] |
| Future renderer accidentally treats authored body as executable markup. [VERIFIED: .planning/REQUIREMENTS.md] | Tampering / Information Disclosure. [ASSUMED] | Use typed text blocks and avoid Markdown/MDX/raw HTML/runtime content fetches. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: 14-CONTEXT.md] |

## Sources

### Primary (HIGH confidence)

- `.planning/phases/14-writing-domain-foundation/14-CONTEXT.md` - locked decisions, phase boundary, helper expectations, validation scope, and deferred work. [VERIFIED: local file read]
- `.planning/REQUIREMENTS.md` - WRITE-01 through WRITE-04 and LINK-01/LINK-03 requirements, plus explicit out-of-scope list. [VERIFIED: local file read]
- `.planning/ROADMAP.md` - Phase 14 success criteria and Phases 15-17 boundaries. [VERIFIED: local file read]
- `.planning/STATE.md` - current milestone state and prior project-detail route decisions. [VERIFIED: local file read]
- `AGENTS.md`, `AGENTS.bright-builds.md`, `standards-overrides.md` - repo-local constraints, Bright Builds routing, and local override state. [VERIFIED: local file read]
- `src/domain/projects.ts` - typed registry, public selectors, nullable lookup naming, project detail path/route helpers, and selected-project eligibility. [VERIFIED: local file read]
- `src/domain/project-validation.ts` and `src/domain/project-validation.test.ts` - structured curation issue pattern and unit test style. [VERIFIED: local file read]
- `src/domain/project-detail-routes.test.ts`, `src/domain/foundation.test.ts`, and `src/domain/routes.ts` - route helper testing and global prerender route shape. [VERIFIED: local file read]
- `scripts/verify-curation.ts` - current curation verification entrypoint. [VERIFIED: local file read]
- `package.json`, `tsconfig.json`, and `biome.json` - existing scripts, package pins, TypeScript options, and formatting/linting setup. [VERIFIED: local file read]
- `.planning/research/SUMMARY.md` and `.planning/research/ARCHITECTURE.md` - prior milestone-level writing research, used only where it matches Phase 14 boundaries. [VERIFIED: local file read]

### Primary External (HIGH confidence)

- Bright Builds Rules standards at commit `05f8d7a6c9c2e157ec4f922a05273e72dab97676`: standards index, architecture, code shape, testing, verification, and TypeScript/JavaScript pages. [CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/index.md]
- OWASP ASVS project/developer-guide pages for ASVS category names and purpose. [CITED: https://owasp.org/www-project-application-security-verification-standard/; CITED: https://devguide.owasp.org/en/06-verification/01-guides/03-asvs/]
- npm registry version checks for `vitest`, `typescript`, `@biomejs/biome`, `@solidjs/start`, `solid-js`, and `@types/bun`. [VERIFIED: npm registry]

### Secondary (MEDIUM confidence)

- None needed for Phase 14; the phase is codebase-local and user decisions are specific. [VERIFIED: 14-CONTEXT.md]

### Tertiary (LOW confidence)

- The exact writing status enum labels and illustrative seed content are recommendations needing planner/user confirmation before implementation. [ASSUMED]

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - no new dependencies are recommended, and existing package/script versions were verified locally and against npm where relevant. [VERIFIED: package.json; VERIFIED: npm registry]
- Architecture: HIGH - existing project domain patterns directly map to the requested writing registry, helper, and validation surfaces. [VERIFIED: src/domain/projects.ts; VERIFIED: src/domain/project-validation.ts; VERIFIED: 14-CONTEXT.md]
- Pitfalls: HIGH - pitfalls are grounded in explicit phase boundaries and existing route/verification integration points. [VERIFIED: .planning/ROADMAP.md; VERIFIED: 14-CONTEXT.md; VERIFIED: src/domain/routes.ts; VERIFIED: scripts/verify-curation.ts]
- Security: MEDIUM-HIGH - ASVS category applicability is straightforward because Phase 14 has no auth/session/crypto/API surface, but STRIDE labels are threat-model inferences. [VERIFIED: .planning/REQUIREMENTS.md; CITED: OWASP ASVS; ASSUMED]

**Research date:** 2026-06-03
**Valid until:** 2026-07-03 for local architecture guidance; re-check npm/tool versions before dependency or toolchain changes. [ASSUMED]
