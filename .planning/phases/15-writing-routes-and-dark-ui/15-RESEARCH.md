# Phase 15: Writing Routes and Dark UI - Research

**Researched:** 2026-06-13 [VERIFIED: system date]
**Domain:** SolidStart static routes, typed content rendering, dark-primary responsive UI [VERIFIED: .planning/phases/15-writing-routes-and-dark-ui/15-CONTEXT.md; VERIFIED: package.json]
**Confidence:** HIGH for repo architecture and route/static verification, MEDIUM for unknown-slug static-host behavior [VERIFIED: src/domain/routes.ts; VERIFIED: app.config.ts; CITED: https://docs.solidjs.com/solid-start/building-your-application/route-prerendering]

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

#### Route Surface

- Add `/writing` as a first-class top-level route and primary navigation item.
- Add static writing detail pages at `/writing/{slug}` for public writing entries only.
- Derive writing detail prerender paths from `writingDetailRoutes()` instead of duplicating slugs.
- Keep draft, hidden, archived-only, unpublished, and unknown slugs out of generated public detail pages.
- Unknown writing slugs should render a non-leaking not-found state with a path back to `/writing`.

#### Writing Index

- Use `publicWritingEntries()` as the source of truth and preserve the curated `displayOrder` from the writing domain helper.
- Make the first viewport the actual writing list, not a marketing landing page.
- Show title, summary, kind, publication/update date where available, topics, tags, and related project count or link hint.
- Do not add search, tag archives, pagination, RSS, comments, CMS, newsletter signup, or MDX parsing in this phase.

#### Writing Detail

- Render the typed body blocks directly from `sections`; do not introduce a Markdown parser.
- Use accessible article structure with headings, readable body text, stable text wrapping, and dark-first surfaces.
- Include a clear "Back to writing" path.
- Link to related selected project detail pages through `relatedProjectDetailPageProjects(entry)`.
- Keep reading content stable and low-motion; any reactive surface treatment should be limited to cards and non-essential affordances.

#### Project Cross-Links

- Add project-to-writing cross-links by deriving relationships from the writing registry, not by adding reciprocal fields to project records.
- Show a related writing section on selected project detail pages only when public writing references that project.
- Keep the project index focused on project grouping; no project index writing badges are required in this phase.

#### SEO And Release Boundary

- It is acceptable for `/writing` to use the existing route metadata pattern.
- Full writing detail metadata, JSON-LD, sitemap-specific assertions, and richer social discovery belong to Phase 16.
- Browser release gate expansion and release evidence label changes belong to Phase 17.
- This phase should still prove static generation and dark UI behavior for the new routes.

### the agent's Discretion

No explicit `## the agent's Discretion` section is present in `15-CONTEXT.md`. [VERIFIED: .planning/phases/15-writing-routes-and-dark-ui/15-CONTEXT.md]

### Deferred Ideas (OUT OF SCOPE)

- Phase 16: writing-specific detail metadata, JSON-LD, sitemap discovery requirements, and social sharing polish.
- Phase 17: browser release suite expansion, reduced-motion route coverage labels, release readiness evidence, and aggregate verification contract updates.
- Future only: RSS, search, tag archive pages, newsletter capture, comments, CMS/admin, MDX ingestion, dynamic OG images, and runtime GitHub/API calls.
</user_constraints>

## Summary

Phase 15 should be implemented as a repo-native route and rendering extension, not as a content-pipeline expansion. [VERIFIED: .planning/phases/15-writing-routes-and-dark-ui/15-CONTEXT.md] SolidStart already uses file-based routes, `app.config.ts` already passes `prerenderRoutes` into the static prerender config, and the writing domain already exposes `publicWritingEntries()`, `maybePublicWritingEntryBySlug()`, `writingDetailRoutes()`, and `relatedProjectDetailPageProjects()`. [VERIFIED: app.config.ts; VERIFIED: src/domain/writing.ts; CITED: https://docs.solidjs.com/solid-start/building-your-application/routing; CITED: https://docs.solidjs.com/solid-start/building-your-application/route-prerendering]

The safest plan is to add `/writing` to `siteRoutes`, compose `prerenderRoutes` from top-level routes, project detail routes, and writing detail routes, then add Solid route files under `src/routes/writing/`. [VERIFIED: src/domain/routes.ts; VERIFIED: src/routes/projects/index.tsx; VERIFIED: src/routes/projects/[slug].tsx] The planner must also budget for `scripts/verify-static.ts`, because current static verification treats non-project dynamic routes as top-level routes and will throw for `/writing/{slug}` unless writing detail handling is added. [VERIFIED: scripts/verify-static.ts]

**Primary recommendation:** Use existing domain helpers and shared dark-primary CSS, add only small pure helper(s) for project-to-writing lookup, and avoid new dependencies or metadata/release-gate expansion in this phase. [VERIFIED: .planning/phases/15-writing-routes-and-dark-ui/15-CONTEXT.md; VERIFIED: package.json; VERIFIED: src/styles/app.css]

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| ROUTE-01 | Visitor can open a stable `/writing` index listing public writing entries in curated or reverse-chronological order. | Add `/writing` to `siteRoutes` and `navigationRoutes`, render `publicWritingEntries()` in display order. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: src/domain/routes.ts; VERIFIED: src/domain/writing.ts] |
| ROUTE-02 | Visitor can open stable `/writing/{slug}` static detail routes for every public writing entry. | Add `src/routes/writing/[slug].tsx` and resolve `params.slug` through `maybePublicWritingEntryBySlug()`. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: src/domain/writing.ts; CITED: https://docs.solidjs.com/solid-start/building-your-application/routing] |
| ROUTE-03 | Clean static builds prerender `/writing` and every public writing detail route before hydration. | Extend `prerenderRoutes` with `writingDetailRoutes()` so `app.config.ts` prerenders the routes and `verify-static` checks body-before-hydration content. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: app.config.ts; VERIFIED: scripts/verify-static.ts] |
| ROUTE-04 | Hidden, draft, archived-only, or otherwise unpublished writing entries do not create public detail pages. | Keep `writingDetailRoutes()` based on `publicWritingEntries()` and add negative static-output checks for non-public fixture slugs when practical. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: src/domain/writing.ts; VERIFIED: src/domain/writing.test.ts] |
| READ-01 | Visitor can understand each writing entry's main idea, context, and relevance from the static detail page. | Render title, summary, date/status, topics/tags, and typed `sections` blocks directly from the registry. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: src/domain/writing.ts] |
| READ-02 | Writing index and detail pages preserve dark-primary responsive layout, accessible headings, readable body text, and stable text layout on desktop and mobile. | Reuse `page-intro`, `page-title`, `lead`, `body-copy`, `visual-surface`, `surface-link`, `chip`, `label-row`, and grid patterns; add writing-specific CSS only where needed for long text. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: src/styles/app.css; VERIFIED: AGENTS.md] |
| READ-03 | Writing detail pages provide clear paths back to the writing index and onward to related projects when relationships exist. | Include a back link to `/writing` and project links from `relatedProjectDetailPageProjects(entry)`. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: src/domain/writing.ts] |
| LINK-02 | Project detail pages can display related writing links derived from writing data without duplicating relationship data on project records. | Add a pure writing helper such as `publicWritingEntriesForProject(project)` and render it only in `src/routes/projects/[slug].tsx`. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: src/domain/writing.ts; VERIFIED: src/routes/projects/[slug].tsx] |
</phase_requirements>

## Project Constraints (from AGENTS.md)

- Read `AGENTS.md`, `AGENTS.bright-builds.md`, `standards-overrides.md`, and relevant pinned Bright Builds standards before planning or implementation. [VERIFIED: AGENTS.md; VERIFIED: AGENTS.bright-builds.md; CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/index.md]
- Keep the portfolio dark-primary, with Tailwind selector dark mode and `.dark` active on the root document. [VERIFIED: AGENTS.md; VERIFIED: src/styles/app.css; VERIFIED: scripts/verify-static.ts]
- Treat `bg-white`, `bg-stone-50`, and `text-zinc-950` as exceptions that need a clear local reason. [VERIFIED: AGENTS.md; VERIFIED: scripts/verify-visual-system.ts]
- Visual verification for UI changes must include desktop and mobile dark rendering, contrast/readability, and text-overlap checks. [VERIFIED: AGENTS.md; VERIFIED: tests/browser-release.playwright.ts]
- Prefer functional-core and imperative-shell structure: pure route/content helpers in `src/domain`, thin Solid route components in `src/routes`. [CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/architecture.md; VERIFIED: src/domain/writing.ts; VERIFIED: src/routes/projects/[slug].tsx]
- Pure and business logic must have unit tests, with Arrange/Act/Assert sections unless the structure is trivial. [CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/testing.md; VERIFIED: src/domain/writing.test.ts]
- Use Bun/TypeScript repo-owned scripts and do not add Python automation to this Bun-friendly TS repository. [CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/languages/typescript-javascript.md; VERIFIED: package.json]
- Preserve low-intrusion OpenLinks placement in footer/profile areas and do not promote OpenLinks into primary navigation for this phase. [VERIFIED: AGENTS.bright-builds.md; VERIFIED: src/components/SiteLayout.tsx; VERIFIED: openlinks-identity-presence skill]
- No local project skills were found under `.claude/skills` or `.agents/skills`. [VERIFIED: find .claude/skills .agents/skills]

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@solidjs/start` | `1.3.2`; npm latest `1.3.2`, modified 2026-06-12 | SolidStart app framework and file routes | Existing framework; official docs support file routes and static route prerendering. [VERIFIED: package.json; VERIFIED: npm registry; CITED: https://docs.solidjs.com/solid-start/building-your-application/routing; CITED: https://docs.solidjs.com/solid-start/building-your-application/route-prerendering] |
| `solid-js` | `1.9.13`; npm latest `1.9.13`, modified 2026-05-19 | Solid component rendering | Existing runtime for all route components. [VERIFIED: package.json; VERIFIED: npm registry; VERIFIED: src/routes/projects/index.tsx] |
| `@solidjs/router` | `0.16.1`; npm latest `0.16.1`, modified 2026-04-26 | `useParams()` for dynamic route slugs | Existing dynamic project route uses it, and SolidStart docs show dynamic segments with `useParams()`. [VERIFIED: package.json; VERIFIED: npm registry; VERIFIED: src/routes/projects/[slug].tsx; CITED: https://docs.solidjs.com/solid-start/building-your-application/routing] |
| `@solidjs/meta` | `0.29.4`; npm latest `0.29.4`, modified 2026-03-17 | Existing head metadata components | Phase 15 may use existing route metadata for `/writing`; writing detail metadata is Phase 16. [VERIFIED: package.json; VERIFIED: npm registry; VERIFIED: .planning/phases/15-writing-routes-and-dark-ui/15-CONTEXT.md] |
| `vinxi` | `0.5.11`; npm latest `0.5.11`, modified 2026-01-19 | Build/dev server behind SolidStart scripts | Existing `dev`, `build`, and `start` scripts call Vinxi. [VERIFIED: package.json; VERIFIED: npm registry] |
| `mystic-ui` | `github:pRizz/mystic-ui#d36017757708ed01ef2b3b47beb14f294726411c`; main still resolves to same SHA | Theme import and compatible UI primitives | Repo stack requires the exact GitHub SHA and `app.css` imports `mystic-ui/tailwind/theme.css`. [VERIFIED: package.json; VERIFIED: git ls-remote https://github.com/pRizz/mystic-ui.git refs/heads/main; VERIFIED: src/styles/app.css; VERIFIED: AGENTS.md] |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `tailwindcss` | Repo pin `3.4.19`; latest 3.x `3.4.19`; package latest `4.3.1` | Existing utility/CSS build | Keep Tailwind 3.x because repo stack says Mystic compatibility is Tailwind 3.x. [VERIFIED: package.json; VERIFIED: npm registry; VERIFIED: AGENTS.md] |
| `@biomejs/biome` | Repo pin `2.4.15`; npm latest `2.5.0`, modified 2026-06-12 | Formatting/linting | Use existing `bun run format:check` and `bun run check`; do not upgrade in Phase 15. [VERIFIED: package.json; VERIFIED: npm registry] |
| `vitest` | Repo pin `4.1.7`; npm latest `4.1.8`, modified 2026-06-12 | Unit tests for pure helpers | Add focused helper tests beside existing domain tests. [VERIFIED: package.json; VERIFIED: npm registry; VERIFIED: src/domain/writing.test.ts] |
| `@playwright/test` | `1.60.0`; npm latest `1.60.0`, modified 2026-06-13 | Browser release checks | Existing suite iterates `prerenderRoutes` for axe and dark layout checks. [VERIFIED: package.json; VERIFIED: npm registry; VERIFIED: tests/browser-release.playwright.ts] |
| `@axe-core/playwright` | `4.11.3`; npm latest `4.11.3`, modified 2026-06-12 | Accessibility scanning | Existing Playwright suite uses AxeBuilder for every prerender route. [VERIFIED: package.json; VERIFIED: npm registry; VERIFIED: tests/browser-release.playwright.ts] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Typed `sections` rendering | Markdown, MDX, Contentlayer, CMS | Explicitly out of scope and unnecessary for the existing registry. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: .planning/phases/15-writing-routes-and-dark-ui/15-CONTEXT.md] |
| `writingDetailRoutes()` in `prerenderRoutes` | Hand-written slug arrays in `app.config.ts` or verifier scripts | Duplicates route state and risks exposing stale/draft routes. [VERIFIED: src/domain/writing.ts; VERIFIED: app.config.ts; VERIFIED: scripts/verify-static.ts] |
| Existing shared CSS classes | A new component library or writing-only design system | Adds UI drift and conflicts with dark-primary local guidance. [VERIFIED: AGENTS.md; VERIFIED: src/styles/app.css] |

**Installation:**

```bash
# No new package install is required for Phase 15.
bun install
```

**Version verification:** `npm view` verified current registry versions on 2026-06-13; `git ls-remote` verified the Mystic UI SHA. [VERIFIED: npm registry; VERIFIED: git ls-remote https://github.com/pRizz/mystic-ui.git refs/heads/main]

## Architecture Patterns

### Recommended Project Structure

```text
src/
|-- domain/
|   |-- routes.ts             # Add top-level /writing and include writing detail routes in prerenderRoutes. [VERIFIED: src/domain/routes.ts]
|   |-- writing.ts            # Keep writing selectors, paths, and project-to-writing helper pure. [VERIFIED: src/domain/writing.ts]
|   `-- writing.test.ts       # Extend helper coverage with Arrange/Act/Assert tests. [VERIFIED: src/domain/writing.test.ts]
|-- routes/
|   |-- writing/
|   |   |-- index.tsx         # New writing index route. [CITED: https://docs.solidjs.com/solid-start/building-your-application/routing]
|   |   `-- [slug].tsx        # New dynamic writing detail route. [CITED: https://docs.solidjs.com/solid-start/building-your-application/routing]
|   `-- projects/[slug].tsx   # Add related writing section on selected project details only. [VERIFIED: src/routes/projects/[slug].tsx]
`-- styles/app.css            # Reuse shared dark classes; add focused writing readability classes only if needed. [VERIFIED: src/styles/app.css]
```

### Pattern 1: Data-Driven Route Registry

**What:** Extend `RouteId`, `siteRoutes`, and `prerenderRoutes` so navigation, static route generation, metadata helpers, sitemap helpers, static verification, and browser checks all share the same route source. [VERIFIED: src/domain/routes.ts; VERIFIED: app.config.ts; VERIFIED: scripts/verify-static.ts; VERIFIED: tests/browser-release.playwright.ts]

**When to use:** Use this for `/writing` and writing detail paths, because Phase 15 requires static route proof without hard-coded route lists. [VERIFIED: .planning/phases/15-writing-routes-and-dark-ui/15-CONTEXT.md]

**Example:**

```typescript
// Source: repo route pattern plus writing helper surface.
// [VERIFIED: src/domain/routes.ts; VERIFIED: src/domain/writing.ts]
import { projectDetailRoutes } from "./projects";
import { writingDetailRoutes } from "./writing";

export type RouteId = "home" | "about" | "projects" | "writing" | "contact";

export const prerenderRoutes = [
  ...siteRoutes.map((route) => route.path),
  ...projectDetailRoutes(),
  ...writingDetailRoutes(),
];
```

### Pattern 2: Dynamic Detail Route With Public-Only Lookup

**What:** Resolve the route slug through `maybePublicWritingEntryBySlug(params.slug ?? "")` and render a non-leaking fallback when absent. [VERIFIED: src/domain/writing.ts; VERIFIED: src/routes/projects/[slug].tsx]

**When to use:** Use this in `src/routes/writing/[slug].tsx` to prevent draft, hidden, archived, and unknown entries from rendering public content. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: src/domain/writing.ts]

**Example:**

```tsx
// Source: project detail route fallback pattern and SolidStart dynamic route docs.
// [VERIFIED: src/routes/projects/[slug].tsx; CITED: https://docs.solidjs.com/solid-start/building-your-application/routing]
const params = useParams();
const entry = () => maybePublicWritingEntryBySlug(params.slug ?? "");

return (
  <Show when={entry()} fallback={<WritingNotFound />}>
    {(selectedEntry) => <WritingArticle entry={selectedEntry()} />}
  </Show>
);
```

### Pattern 3: Typed Body Block Rendering

**What:** Render the `WritingBodyBlock` union directly as paragraph, list, callout, or link elements. [VERIFIED: src/domain/writing.ts]

**When to use:** Use this on writing detail pages because Markdown, MDX, parser pipelines, and runtime content dependencies are out of scope. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: .planning/phases/15-writing-routes-and-dark-ui/15-CONTEXT.md]

**Example:**

```tsx
// Source: WritingBodyBlock union in src/domain/writing.ts.
// [VERIFIED: src/domain/writing.ts]
function WritingBlock(props: { block: WritingBodyBlock }) {
  if (props.block.kind === "paragraph") {
    return <p class="writing-body-copy">{props.block.text}</p>;
  }

  if (props.block.kind === "list") {
    return (
      <ul class="writing-body-list">
        <For each={props.block.items}>{(item) => <li>{item}</li>}</For>
      </ul>
    );
  }

  if (props.block.kind === "callout") {
    return <p class="writing-callout visual-surface">{props.block.text}</p>;
  }

  return (
    <a class="text-link surface-link" href={props.block.href}>
      {props.block.label}
    </a>
  );
}
```

### Pattern 4: Project-to-Writing Cross-Link Helper

**What:** Add a pure helper that filters public writing by `relatedProjectSlugs` for a selected project slug. [VERIFIED: src/domain/writing.ts; VERIFIED: src/domain/projects.ts]

**When to use:** Use this in project detail pages instead of adding reciprocal writing fields to project records. [VERIFIED: .planning/phases/15-writing-routes-and-dark-ui/15-CONTEXT.md]

**Example:**

```typescript
// Source: existing writing helper style.
// [VERIFIED: src/domain/writing.ts]
export function publicWritingEntriesForProject(
  project: Pick<ProjectDetailPageProject, "slug">,
  entries: readonly WritingEntry[] = curatedWriting,
): readonly PublicWritingEntry[] {
  return publicWritingEntries(entries).filter((entry) =>
    entry.relatedProjectSlugs.includes(project.slug),
  );
}
```

### Anti-Patterns to Avoid

- **Adding route slugs in multiple files:** `app.config.ts`, `scripts/verify-static.ts`, tests, and route UI should consume `prerenderRoutes` and writing helpers instead. [VERIFIED: app.config.ts; VERIFIED: scripts/verify-static.ts; VERIFIED: src/domain/routes.ts]
- **Using empty arrays directly as `<Show when={relatedWriting()}>`:** Empty arrays are truthy, so use `relatedWriting().length > 0` for conditional rendering. [VERIFIED: Solid JSX behavior through existing `Show` usage in src/routes/projects/[slug].tsx]
- **Expanding release evidence labels now:** Phase 17 owns release-readiness label changes and browser release gate expansion. [VERIFIED: .planning/phases/15-writing-routes-and-dark-ui/15-CONTEXT.md; VERIFIED: scripts/release-readiness.ts]
- **Adding light-first classes:** The repo-local guidance and visual-system guard flag light-first classes. [VERIFIED: AGENTS.md; VERIFIED: scripts/verify-visual-system.ts]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Writing content parsing | Markdown/MDX parser, CMS, runtime content fetcher | Typed `sections` and `WritingBodyBlock` rendering | The registry already stores structured body blocks and parser pipelines are out of scope. [VERIFIED: src/domain/writing.ts; VERIFIED: .planning/REQUIREMENTS.md] |
| Static route discovery | Manual crawl or duplicated slug list | `writingDetailRoutes()` included in `prerenderRoutes` | SolidStart supports explicit prerender routes and the repo already centralizes prerender paths. [VERIFIED: src/domain/writing.ts; VERIFIED: app.config.ts; CITED: https://docs.solidjs.com/solid-start/building-your-application/route-prerendering] |
| Project cross-links | Reciprocal fields on project records | Pure helper derived from writing registry | Phase 15 explicitly requires deriving relationships from writing data. [VERIFIED: .planning/phases/15-writing-routes-and-dark-ui/15-CONTEXT.md] |
| Writing route UI system | New design system or nested card layout | Existing dark-primary surface, text, chip, grid, and link classes | The CSS already defines the reusable dark shell and text wrapping patterns. [VERIFIED: src/styles/app.css; VERIFIED: AGENTS.md] |
| Release-gate language | New release-readiness labels for writing coverage | Existing route-derived browser/static checks only | Phase 17 owns release-readiness label and aggregate release contract updates. [VERIFIED: .planning/phases/15-writing-routes-and-dark-ui/15-CONTEXT.md; VERIFIED: scripts/release-readiness.ts] |
| External content dependencies | Runtime GitHub, Notion, RSS, Substack, Gist, token-dependent APIs | Checked-in TypeScript writing registry | Requirements explicitly prohibit runtime APIs and external content dependencies for v1.3 writing. [VERIFIED: .planning/REQUIREMENTS.md] |

**Key insight:** The complexity in this phase is not content ingestion; it is keeping route, prerender, verification, and cross-link derivation attached to the existing typed domain surface. [VERIFIED: src/domain/writing.ts; VERIFIED: src/domain/routes.ts; VERIFIED: scripts/verify-static.ts]

## Common Pitfalls

### Pitfall 1: Adding `/writing` UI Without Route Registry Metadata

**What goes wrong:** `routeByPath("/writing")` falls back to the home route if `/writing` is not in `siteRoutes`. [VERIFIED: src/domain/routes.ts]

**Why it happens:** `routeByPath()` returns `siteRoutes[0]` when no exact path matches. [VERIFIED: src/domain/routes.ts]

**How to avoid:** Add a `writing` route object with label, title, description, heading, `staticCheckText`, and `nav: true` before the route component calls `routeByPath("/writing")`. [VERIFIED: src/domain/routes.ts; VERIFIED: src/routes/projects/index.tsx]

**Warning signs:** `/writing` static checks contain home metadata or home static text. [VERIFIED: scripts/verify-static.ts; VERIFIED: src/domain/seo.ts]

### Pitfall 2: `verify-static` Fails on Writing Detail Routes

**What goes wrong:** Current `verify-static` treats every non-project route as a top-level `SiteRoute`, so `/writing/{slug}` will fail `topLevelRouteForPath()` unless a writing-detail branch is added. [VERIFIED: scripts/verify-static.ts]

**Why it happens:** The only dynamic route branch today is `maybeProjectForDetailRoute(route)`. [VERIFIED: scripts/verify-static.ts]

**How to avoid:** Add `maybeWritingForDetailRoute(route)` and `writingDetailExpectedTexts(entry)` before the generic top-level route path; keep Phase 16 metadata/JSON-LD assertions out of the writing detail branch. [VERIFIED: scripts/verify-static.ts; VERIFIED: .planning/phases/15-writing-routes-and-dark-ui/15-CONTEXT.md]

**Warning signs:** `bun run verify:static` errors with `No top-level route definition found for /writing/...`. [VERIFIED: scripts/verify-static.ts]

### Pitfall 3: Leaking Draft or Hidden Writing Through Static Output

**What goes wrong:** A draft, hidden, archived, or unknown entry can get a generated HTML file if a route list is duplicated or filtered incorrectly. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: src/domain/writing.ts]

**Why it happens:** Static prerendering trusts the configured route list. [VERIFIED: app.config.ts; CITED: https://docs.solidjs.com/solid-start/building-your-application/route-prerendering]

**How to avoid:** Use only `writingDetailRoutes()` for detail route generation and add unit/static checks that public writing routes equal helper output. [VERIFIED: src/domain/writing.ts; VERIFIED: src/domain/writing.test.ts]

**Warning signs:** `.output/public/writing/<draft-slug>/index.html` exists after `bun run build`. [VERIFIED: scripts/verify-static.ts]

### Pitfall 4: Expanding Phase 16 or Phase 17 Scope Accidentally

**What goes wrong:** The plan can drift into writing detail metadata, JSON-LD, richer sitemap assertions, social previews, or release-readiness evidence labels. [VERIFIED: .planning/phases/15-writing-routes-and-dark-ui/15-CONTEXT.md]

**Why it happens:** `prerenderRoutes` and `sitemapXml()` are already coupled, and browser checks already iterate all prerender routes. [VERIFIED: src/domain/seo.ts; VERIFIED: tests/browser-release.playwright.ts]

**How to avoid:** Let route-derived checks cover new HTML, axe, and layout behavior, but do not add writing-specific JSON-LD, metadata assertions, release labels, or docs wording in Phase 15. [VERIFIED: .planning/phases/15-writing-routes-and-dark-ui/15-CONTEXT.md]

**Warning signs:** Edits touch `metadataForProject()`-style writing detail metadata, `BlogPosting`, `docs/release-readiness.md`, or `releaseReadinessEvidenceLabels()`. [VERIFIED: src/domain/seo.ts; VERIFIED: scripts/release-readiness.ts; VERIFIED: docs/release-readiness.md]

### Pitfall 5: Unsafe or Unvalidated Link Body Blocks

**What goes wrong:** Future `kind: "link"` body blocks can render unsafe or malformed hrefs if validation only checks for non-empty strings. [VERIFIED: src/domain/writing.ts; VERIFIED: src/domain/writing-validation.ts]

**Why it happens:** `WritingBodyBlock` includes link blocks, and current `hasBlockContent()` validates only label and href presence for links. [VERIFIED: src/domain/writing.ts; VERIFIED: src/domain/writing-validation.ts]

**How to avoid:** Either render only known-safe href patterns or extend writing validation with an allow-list for internal paths and HTTPS URLs before route rendering depends on link blocks. [VERIFIED: src/domain/writing-validation.ts; CITED: https://owasp.org/www-project-application-security-verification-standard/]

**Warning signs:** A writing entry link block contains `javascript:`, `data:`, or an unreviewed external protocol. [VERIFIED: src/domain/writing.ts; CITED: https://owasp.org/www-project-application-security-verification-standard/]

## Code Examples

Verified patterns from official and repo sources:

### SolidStart File Route and Dynamic Param

```tsx
// Source: SolidStart routing docs.
// [CITED: https://docs.solidjs.com/solid-start/building-your-application/routing]
// src/routes/writing/[slug].tsx maps to /writing/:slug.
import { useParams } from "@solidjs/router";

export default function WritingDetail() {
  const params = useParams();
  return <div>{params.slug}</div>;
}
```

### Explicit Static Prerender Routes

```typescript
// Source: current app.config.ts and SolidStart route prerendering docs.
// [VERIFIED: app.config.ts; CITED: https://docs.solidjs.com/solid-start/building-your-application/route-prerendering]
export default defineConfig({
  server: {
    preset: "static",
    prerender: {
      crawlLinks: false,
      routes: [...prerenderRoutes],
    },
  },
});
```

### Static Verifier Writing Branch

```typescript
// Source: current verify-static dynamic project branch.
// [VERIFIED: scripts/verify-static.ts; VERIFIED: src/domain/writing.ts]
function maybeWritingForDetailRoute(route: string): PublicWritingEntry | null {
  const detailRoutePrefix = "/writing/";

  if (!route.startsWith(detailRoutePrefix)) {
    return null;
  }

  return maybePublicWritingEntryBySlug(route.slice(detailRoutePrefix.length));
}
```

### Project Detail Related Writing Section

```tsx
// Source: existing project detail aside pattern.
// [VERIFIED: src/routes/projects/[slug].tsx; VERIFIED: src/domain/writing.ts]
const relatedWriting = () => publicWritingEntriesForProject(selectedProject());

<Show when={relatedWriting().length > 0}>
  <section class="project-detail-panel visual-surface" aria-labelledby="related-writing">
    <h2 id="related-writing" class="card-title">Related writing</h2>
    <nav class="link-list" aria-label={`${selectedProject().name} related writing`}>
      <For each={relatedWriting()}>
        {(entry) => (
          <a class="text-link surface-link" href={writingDetailPath(entry)}>
            {entry.title}
          </a>
        )}
      </For>
    </nav>
  </section>
</Show>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Crawling links to discover static pages | Explicit route list through `server.prerender.routes` | SolidStart docs updated 2026-04-28 show explicit routes and `crawlLinks` as options | Use `writingDetailRoutes()` in `prerenderRoutes`; do not depend on crawling. [CITED: https://docs.solidjs.com/solid-start/building-your-application/route-prerendering; VERIFIED: app.config.ts] |
| Blog engine with Markdown/MDX parser | Typed checked-in writing registry | Phase 14 completed before Phase 15 | Render `sections` directly and keep content validation in TypeScript. [VERIFIED: .planning/STATE.md; VERIFIED: src/domain/writing.ts] |
| Route-specific release gate lists | Route-derived verification loops | Existing browser and static verifiers derive route coverage from `prerenderRoutes` | Adding writing routes expands route-derived checks without Phase 17 release label edits. [VERIFIED: tests/browser-release.playwright.ts; VERIFIED: scripts/verify-static.ts] |

**Deprecated/outdated:**

- `src/routes/projects.tsx` appears in `scripts/verify-visual-system.ts` but the live project index route is `src/routes/projects/index.tsx`; do not model new writing verification on that stale path list without updating it deliberately. [VERIFIED: scripts/verify-visual-system.ts; VERIFIED: rg --files src/routes]
- Floating Mystic UI branches are not acceptable for this repo; the package is pinned to a SHA and the current main SHA matches the pin. [VERIFIED: package.json; VERIFIED: git ls-remote https://github.com/pRizz/mystic-ui.git refs/heads/main; VERIFIED: AGENTS.md]

## Assumptions Log

> List all claims tagged `[ASSUMED]` in this research. The planner and discuss-phase use this section to identify decisions that need user confirmation before execution.

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|

**If this table is empty:** All claims in this research were verified or cited; no user confirmation is needed. [VERIFIED: this document]

## Open Questions

1. **Should local Bun be upgraded before execution?** [VERIFIED: package.json; VERIFIED: bun --version]
   - What we know: `package.json` pins `bun@1.3.14`, while local `bun --version` reports `1.3.9`. [VERIFIED: package.json; VERIFIED: bun --version]
   - What's unclear: Whether the older local Bun will fail any Phase 15 verification command. [VERIFIED: no Phase 15 implementation commands were run during research]
   - Recommendation: Planner should use repo scripts as-is and include "upgrade Bun to 1.3.14 or rerun with pinned CI Bun if Bun version drift causes failure" as a contingency, not as Phase 15 feature work. [VERIFIED: package.json; VERIFIED: .planning/phases/15-writing-routes-and-dark-ui/15-CONTEXT.md]

2. **How much static verification should Phase 15 add for sitemap side effects?** [VERIFIED: src/domain/seo.ts; VERIFIED: .planning/phases/15-writing-routes-and-dark-ui/15-CONTEXT.md]
   - What we know: `sitemapXml()` defaults to `prerenderRoutes`, so writing routes may enter sitemap output automatically when added to `prerenderRoutes`. [VERIFIED: src/domain/seo.ts; VERIFIED: src/domain/routes.ts]
   - What's unclear: Whether Phase 15 should add explicit sitemap inclusion/exclusion assertions or leave those for Phase 16. [VERIFIED: .planning/phases/15-writing-routes-and-dark-ui/15-CONTEXT.md]
   - Recommendation: Do not add writing-specific sitemap assertions in Phase 15; allow existing sitemap equality checks to pass and defer dedicated sitemap discovery assertions to Phase 16. [VERIFIED: .planning/phases/15-writing-routes-and-dark-ui/15-CONTEXT.md; VERIFIED: scripts/verify-static.ts]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Bun | Repo scripts and package manager | Yes, with version drift | Local `1.3.9`; repo pin `1.3.14` | Use repo scripts first; upgrade Bun to `1.3.14` if version drift causes command failure. [VERIFIED: bun --version; VERIFIED: package.json] |
| Node.js | TypeScript/npm tooling compatibility | Yes | `v24.13.0` | None needed. [VERIFIED: node --version] |
| npm registry access | Version verification | Yes | npm `11.6.2` | Use checked-in pins if network is unavailable during execution. [VERIFIED: npm --version; VERIFIED: npm view commands] |
| `node_modules` | Local scripts and binaries | Yes | Installed locally | Run `bun install` if dependencies drift. [VERIFIED: test -d node_modules; VERIFIED: node_modules/.bin listing] |
| Vitest | Unit tests | Yes | Installed CLI reports `vitest/4.1.7` | Use `bun run test` through package script. [VERIFIED: bun run vitest --version; VERIFIED: package.json] |
| Playwright | Browser route/a11y/layout checks | Yes | CLI `1.60.0` | Run `bun run install:browser` if browser cache is missing. [VERIFIED: bunx playwright --version; VERIFIED: package.json] |
| Playwright Chromium | `bun run verify:browser` | Yes | Chromium cache `chromium-1223` and headless shell cache present | Run `bun run install:browser` if cache becomes missing. [VERIFIED: bunx playwright install --dry-run chromium; VERIFIED: test -d ~/Library/Caches/ms-playwright/chromium-1223] |

**Missing dependencies with no fallback:**

- None found during research. [VERIFIED: environment availability commands]

**Missing dependencies with fallback:**

- Bun local version differs from the repo pin; fallback is to upgrade Bun or rely on CI/clean-builder pin if local commands fail. [VERIFIED: bun --version; VERIFIED: package.json]

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|------------------|
| V2 Authentication | No | No auth or login surface is in Phase 15. [VERIFIED: .planning/REQUIREMENTS.md; CITED: https://owasp.org/www-project-application-security-verification-standard/] |
| V3 Session Management | No | No session state is in Phase 15. [VERIFIED: .planning/REQUIREMENTS.md; CITED: https://owasp.org/www-project-application-security-verification-standard/] |
| V4 Access Control | Yes, content-publication boundary | Use `publicWritingEntries()` and `writingDetailRoutes()` to keep non-public writing out of generated routes. [VERIFIED: src/domain/writing.ts; VERIFIED: .planning/REQUIREMENTS.md; CITED: https://owasp.org/www-project-application-security-verification-standard/] |
| V5 Input Validation / Encoding | Yes | Keep typed registry validation, render text as JSX text nodes, and add or confirm an href allow-list before rendering link body blocks. [VERIFIED: src/domain/writing-validation.ts; VERIFIED: src/domain/writing.ts; CITED: https://owasp.org/www-project-application-security-verification-standard/] |
| V6 Cryptography | No | No cryptography or secrets are introduced in Phase 15. [VERIFIED: .planning/REQUIREMENTS.md; CITED: https://owasp.org/www-project-application-security-verification-standard/] |

### Known Threat Patterns for SolidStart Static Writing Routes

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Draft/hidden content disclosure through prerender output | Information Disclosure | Generate detail routes only from `writingDetailRoutes()` and verify non-public slugs do not produce static HTML. [VERIFIED: src/domain/writing.ts; VERIFIED: scripts/verify-static.ts] |
| Unsafe authored links in writing body blocks | Tampering / XSS-adjacent navigation risk | Validate link `href` values with an allow-list before rendering `kind: "link"` blocks. [VERIFIED: src/domain/writing.ts; VERIFIED: src/domain/writing-validation.ts; CITED: https://owasp.org/www-project-application-security-verification-standard/] |
| Runtime API or token leakage | Information Disclosure | Keep writing content checked in and preserve no-GitHub-runtime verification. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: scripts/verify-no-github-runtime.ts; VERIFIED: scripts/verify-static.ts] |

## Sources

### Primary (HIGH confidence)

- `15-CONTEXT.md` - Phase 15 locked decisions, implementation guidance, verification guidance, and deferred work. [VERIFIED: .planning/phases/15-writing-routes-and-dark-ui/15-CONTEXT.md]
- `REQUIREMENTS.md`, `ROADMAP.md`, `STATE.md` - v1.3 requirement mapping, Phase 15 scope, and prior Phase 14 completion context. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: .planning/ROADMAP.md; VERIFIED: .planning/STATE.md]
- `AGENTS.md`, `AGENTS.bright-builds.md`, `standards-overrides.md` - repo-local dark-primary guidance, Bright Builds workflow, standards sidecar, and lack of active overrides. [VERIFIED: AGENTS.md; VERIFIED: AGENTS.bright-builds.md; VERIFIED: standards-overrides.md]
- Bright Builds canonical standards at commit `05f8d7a6c9c2e157ec4f922a05273e72dab97676` - architecture, code shape, verification, testing, and TypeScript rules. [CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/index.md]
- `src/domain/writing.ts`, `src/domain/routes.ts`, `src/routes/projects/index.tsx`, `src/routes/projects/[slug].tsx`, `src/styles/app.css`, `scripts/verify-static.ts` - existing patterns and implementation targets. [VERIFIED: listed source files]
- SolidStart official docs - file routes, dynamic segments, `<FileRoutes />`, `useParams()`, and static route prerendering. [CITED: https://docs.solidjs.com/solid-start/building-your-application/routing; CITED: https://docs.solidjs.com/solid-start/building-your-application/route-prerendering; CITED: https://docs.solidjs.com/solid-start/reference/config/define-config]
- npm registry - current package versions and publish modification timestamps. [VERIFIED: npm view commands]
- OWASP ASVS official project page - security verification category framing. [CITED: https://owasp.org/www-project-application-security-verification-standard/]

### Secondary (MEDIUM confidence)

- None used. [VERIFIED: research process]

### Tertiary (LOW confidence)

- None used. [VERIFIED: research process]

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - existing package pins were verified against `package.json`, npm registry, and the Mystic UI Git SHA. [VERIFIED: package.json; VERIFIED: npm registry; VERIFIED: git ls-remote https://github.com/pRizz/mystic-ui.git refs/heads/main]
- Architecture: HIGH - route, writing, project detail, static build, and browser verification patterns are already present in repo code. [VERIFIED: src/domain/routes.ts; VERIFIED: src/domain/writing.ts; VERIFIED: src/routes/projects/[slug].tsx; VERIFIED: scripts/verify-static.ts; VERIFIED: tests/browser-release.playwright.ts]
- Pitfalls: HIGH for static verifier and route registry risks, MEDIUM for direct-host unknown-slug behavior because static host fallback behavior depends on deployment configuration outside this phase's code. [VERIFIED: scripts/verify-static.ts; VERIFIED: app.config.ts; CITED: https://docs.solidjs.com/solid-start/building-your-application/route-prerendering]

**Research date:** 2026-06-13 [VERIFIED: system date]
**Valid until:** 2026-07-13 for repo-internal patterns; 2026-06-20 for npm "latest version" facts because frontend package versions are fast-moving. [VERIFIED: npm registry timestamps]
