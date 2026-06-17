# Phase 20: theme-routes-and-dark-ui - Research

**Researched:** 2026-06-17 [VERIFIED: system current_date]
**Domain:** SolidStart static theme routes, dark-primary Tailwind UI, public-only content gating [VERIFIED: .planning/ROADMAP.md; .planning/phases/20-theme-routes-and-dark-ui/20-CONTEXT.md]
**Confidence:** HIGH [VERIFIED: official SolidStart/Tailwind/WCAG docs; local codebase inspection; npm registry probes]

<user_constraints>
## User Constraints (from CONTEXT.md)

Source for all copied text in this block: [VERIFIED: .planning/phases/20-theme-routes-and-dark-ui/20-CONTEXT.md].

### Locked Decisions

## Implementation Decisions

### Theme Index Presentation

- **D-01:** Build `/themes` as a responsive card-grid index, not a dense link list or grouped guide. Use `publicThemeEntries()` as the only source of public theme records and `themeDetailPath()` for every detail link.
- **D-02:** Keep index cards as curated entry points with the theme title, summary, audience, a small set of helper-derived relationship counts or labels, and a descriptive "Explore theme" style link. Avoid turning cards into mini detail pages or duplicating related project/writing copy.
- **D-03:** Add a `Themes` navigation route if needed by the existing `siteRoutes`/`navigationRoutes` pattern. Keep the label short and consistent with the existing Home/About/Projects/Writing/Contact nav.

### Theme Detail Synthesis

- **D-04:** Build each `/themes/{slug}` page as a theme-specific hybrid hub: a `page-intro` for the main idea, focused sections for why the theme matters/audience/proof points, and related project/writing cards resolved from Phase 19 helpers.
- **D-05:** Related projects and writing must render display content from existing project and writing records through `relatedProjectDetailPageProjectsForTheme()` and `relatedWritingEntriesForTheme()`. Do not denormalize or copy project/writing descriptions into theme route components.
- **D-06:** Do not add Phase 21 collaboration panels, new external action sources, or primary OpenLinks CTAs in this phase. Treat `collaborationAngle` as reserved context for the next phase unless the planner finds a clearly non-CTA, low-prominence note is required to explain the theme.
- **D-07:** Keep the detail page semantic: one H1, descriptive section headings, card/list structures with real anchors, and no whole-card click traps that weaken link text or keyboard behavior.

### Static Route and Fallback Safety

- **D-08:** Use the domain allowlist approach. Import `themeDetailRoutes()` into `src/domain/routes.ts` and include `/themes` plus every public theme detail route in `prerenderRoutes`.
- **D-09:** Keep `crawlLinks: false`; do not switch to crawler-derived prerendering. Generated static routes should come from pure helper output, not from whatever links happen to render in the DOM.
- **D-10:** Gate detail route rendering with `maybePublicThemeEntryBySlug()`. Unknown, draft, hidden, unsupported, archived, or otherwise non-public slugs should all get the same generic fallback.
- **D-11:** The fallback must not echo the raw slug, status, private registry fields, or any content from non-public theme records. It should direct visitors back to `/themes`.

### Dark Responsive UI

- **D-12:** Reuse the existing dark-primary visual system first: `page-intro`, `page-title`, `lead`, `visual-surface`, `interactive-surface`, `reactive-card`, `theme-card`, `project-anchor-card`, `surface-card`, `chip`, `tier-pill`, `label-row`, `link-list`, and related writing/project grid patterns.
- **D-13:** Add only small route-specific CSS when existing classes cannot provide stable grid/layout behavior. Do not introduce new UI dependencies, new motion libraries, or a broad visual-system refactor.
- **D-14:** Preserve the existing reduced-motion/coarse-pointer/mobile guards. Any hover/focus treatment must degrade cleanly under `prefers-reduced-motion`, coarse pointer, and mobile viewport conditions.
- **D-15:** The implementation must explicitly protect text wrapping and readability on desktop and mobile dark rendering. Long titles, proof points, chips, and links should not overflow or overlap.

### Metadata Boundary

- **D-16:** Phase 20 may add the minimal route registry fields needed for the `/themes` index to fit existing app routing/navigation patterns. Full route-specific theme metadata, Open Graph/Twitter tags, JSON-LD, sitemap behavior, and social-preview verification belong to Phase 22.
- **D-17:** Do not claim hosted/live or release-contract coverage in this phase. Verification should prove the new route/UI behavior introduced here, and later phases will expand release evidence.

### the agent's Discretion

- The planner may decide whether theme route card rendering should live directly in route files or in a small local component, as long as the abstraction is justified by repeated markup and stays within the existing Solid/Tailwind style.
- The planner may choose exact copy for index/deep-link labels, fallback copy, and section labels, provided the copy is concise, original, dark-primary, and avoids placeholder/template language.
- The planner may decide whether to add focused tests around `prerenderRoutes`, route helper inclusion, rendered fallback text, static build output, or component behavior, but the tests must be tied to Phase 20 requirements rather than Phase 22/23 metadata/release scope.

### Deferred Ideas (OUT OF SCOPE)

## Deferred Ideas

- Theme collaboration panels, practical next-action CTAs, reviewed source/live-surface action grouping, and theme-aware project/writing cross-links belong to Phase 21.
- Route-specific theme metadata, JSON-LD, sitemap entries/exclusions, Open Graph/Twitter tags, and social-preview fallback verification belong to Phase 22.
- Browser release-suite expansion, release-readiness documentation, and automated evidence labels for theme coverage belong to Phase 23.
- Search, filters, tag archives, CMS/admin, comments/newsletter, analytics, live external-link reachability, runtime content fetches, and dynamic OG images remain future or out of scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| ROUTE-01 | Visitor can open a stable `/themes` index listing public theme paths as curated entry points into Peter's work. [VERIFIED: .planning/REQUIREMENTS.md] | Use a SolidStart file route at `src/routes/themes/index.tsx`, feed it only from `publicThemeEntries()`, and link with `themeDetailPath()`. [VERIFIED: src/domain/themes.ts; SolidStart routing docs] |
| ROUTE-02 | Visitor can open stable `/themes/{slug}` static detail routes for every public theme path. [VERIFIED: .planning/REQUIREMENTS.md] | Add `src/routes/themes/[slug].tsx`, read the dynamic segment with `useParams()`, and render public theme detail content after `maybePublicThemeEntryBySlug()` succeeds. [VERIFIED: src/routes/writing/[slug].tsx; src/domain/themes.ts; SolidStart routing docs] |
| ROUTE-03 | Clean static builds prerender `/themes` and every public theme detail route before hydration. [VERIFIED: .planning/REQUIREMENTS.md] | Import `themeDetailRoutes()` into `src/domain/routes.ts`; keep `app.config.ts` using `routes: [...prerenderRoutes]` and `crawlLinks: false`. [VERIFIED: app.config.ts; src/domain/routes.ts; SolidStart route prerendering docs] |
| ROUTE-04 | Hidden, unsupported, or invalid theme records do not create public detail pages or leak private content through fallback routes. [VERIFIED: .planning/REQUIREMENTS.md] | Derive static route strings only from `themeDetailRoutes()` and use one generic detail fallback that does not echo params or non-public record data. [VERIFIED: src/domain/themes.ts; src/routes/writing/[slug].tsx; 20-UI-SPEC.md] |
| SYNTH-01 | Visitor can understand each theme's main idea, why it matters, representative proof points, and connection to Peter's projects and writing from the static theme detail page. [VERIFIED: .planning/REQUIREMENTS.md] | Render `summary`, `audience`, `proofPoints`, related selected project cards, and related public writing cards from Phase 19 helpers. [VERIFIED: src/domain/themes.ts; src/routes/projects/[slug].tsx; src/routes/writing/[slug].tsx] |
| SYNTH-04 | Theme index and detail pages preserve the dark-primary responsive interface, accessible headings, readable text hierarchy, keyboard reachability, and stable text wrapping on desktop and mobile. [VERIFIED: .planning/REQUIREMENTS.md] | Reuse existing dark classes, 44px target link classes, heading structure, `overflow-wrap` rules, and Playwright/axe layout checks. [VERIFIED: src/styles/app.css; tests/browser-release.playwright.ts; W3C headings and reflow docs] |
</phase_requirements>

## Summary

Phase 20 should be planned as a narrow route/UI integration over the Phase 19 theme domain helpers, not as a new content system, metadata release, or collaboration CTA phase. [VERIFIED: 20-CONTEXT.md; 19-01-SUMMARY.md] The implementation surface is `src/domain/routes.ts`, `src/routes/themes/index.tsx`, `src/routes/themes/[slug].tsx`, and at most small selectors in `src/styles/app.css` if existing grid classes cannot express the design. [VERIFIED: 20-CONTEXT.md; src/domain/routes.ts; src/styles/app.css]

The static route contract should stay allowlist-based: `/themes` comes from `siteRoutes`, detail pages come from `themeDetailRoutes()`, and `app.config.ts` keeps `crawlLinks: false`. [VERIFIED: app.config.ts; src/domain/themes.ts; src/domain/routes.ts] SolidStart documents route pre-rendering through an explicit `routes` option and also documents `crawlLinks`, so the local config is aligned with the official static-generation path. [CITED: https://docs.solidjs.com/solid-start/building-your-application/route-prerendering]

The UI plan should reuse existing dark-primary classes and route patterns from writing/project pages. [VERIFIED: src/routes/writing/index.tsx; src/routes/writing/[slug].tsx; src/routes/projects/[slug].tsx; src/styles/app.css] The risky pieces are content leakage from unknown/non-public slugs, accidental Phase 21/22 scope creep, and insufficient desktop/mobile dark layout verification. [VERIFIED: 20-CONTEXT.md; 20-UI-SPEC.md; tests/browser-release.playwright.ts]

**Primary recommendation:** Add `/themes` and `/themes/[slug]` using Phase 19 helpers, route-derived prerender inclusion, generic non-leaking fallback, and existing dark responsive card/detail patterns; do not add dependencies or Phase 21/22/23 surfaces. [VERIFIED: 20-CONTEXT.md; 20-UI-SPEC.md; src/domain/themes.ts]

## Project Constraints (from AGENTS.md)

- Read and honor `AGENTS.md`, `AGENTS.bright-builds.md`, `standards-overrides.md`, and relevant standards pages before planning or implementation. [VERIFIED: AGENTS.md; AGENTS.bright-builds.md]
- The site is dark-primary; user-facing UI should render dark by default with Tailwind `darkMode: "selector"` and `.dark` active on the root document. [VERIFIED: AGENTS.md; tailwind.config.ts; src/entry-server.tsx]
- Light-first utility classes such as `bg-white`, `bg-stone-50`, and `text-zinc-950` are exceptions requiring a clear local reason. [VERIFIED: AGENTS.md]
- UI verification must include desktop and mobile dark rendering, contrast/readability, and text-overlap checks. [VERIFIED: AGENTS.md]
- Use GSD planning artifacts and commit planning docs as part of repo history. [VERIFIED: AGENTS.md; .planning/config.json]
- Prefer functional core / imperative shell and keep domain decisions in pure data-in/data-out helpers. [VERIFIED: standards/core/architecture.md]
- Use shallow control flow and `maybe...` naming for nullable internal values. [VERIFIED: standards/core/code-shape.md; standards/languages/typescript-javascript.md]
- Unit tests for pure or business logic must be focused and arranged with Arrange/Act/Assert when non-trivial. [VERIFIED: standards/core/testing.md]
- Prefer repo-native verification commands before commit, especially aggregate or owned commands. [VERIFIED: standards/core/verification.md; package.json]
- Do not add Python scripts to this Bun-friendly TypeScript repository. [VERIFIED: standards/languages/typescript-javascript.md]
- Use Mystic UI for SolidJS UI choices where compatible, and pin `pRizz/mystic-ui` to an exact GitHub SHA. [VERIFIED: standards/languages/typescript-javascript.md; package.json]
- OpenLinks should stay low-intrusion in footer/about/profile/metadata surfaces and must not displace the host brand or primary CTA. [VERIFIED: AGENTS.bright-builds.md; openlinks-identity-presence skill]
- No project-local `.claude/skills/` or `.agents/skills/` directories were found. [VERIFIED: `rg --files .claude/skills .agents/skills`]
- `standards-overrides.md` contains only placeholder rows, so no active repo-specific standards exception was found. [VERIFIED: standards-overrides.md]

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Bun | project pin `1.3.14`; local `1.3.9` | Package manager and script runner | The repo declares `packageManager: "bun@1.3.14"` and all verification scripts use `bun run`; local Bun is available but older than the pin. [VERIFIED: package.json; `bun --version`] |
| SolidStart | `@solidjs/start@1.3.2` | Static-capable Solid meta-framework | The repo uses `defineConfig()` and SolidStart file routes, and npm registry reports `1.3.2` as current with `time.modified` 2026-06-12. [VERIFIED: package.json; npm registry; CITED: https://docs.solidjs.com/solid-start/reference/config/define-config] |
| SolidJS | `solid-js@1.9.13` | Component runtime | The repo pin matches npm registry current version `1.9.13` with `time.modified` 2026-05-19. [VERIFIED: package.json; npm registry] |
| Solid Router | `@solidjs/router@0.16.1` | Dynamic params and app routing | The repo uses `Router`, `FileRoutes`, and `useParams()`, and npm registry reports `0.16.1` as current with `time.modified` 2026-04-26. [VERIFIED: src/app.tsx; src/routes/writing/[slug].tsx; npm registry; CITED: https://docs.solidjs.com/solid-router/concepts/path-parameters] |
| Solid Meta | `@solidjs/meta@0.29.4` | Existing route metadata shell | The repo already uses `Title`, `Meta`, and `HeadLink`, and npm registry reports `0.29.4` as current with `time.modified` 2026-03-17. [VERIFIED: src/routes/writing/index.tsx; package.json; npm registry] |
| Vinxi | `vinxi@0.5.11` | SolidStart build/dev command implementation | The repo scripts call `vinxi dev/build/start`, and npm registry reports `0.5.11` as current with `time.modified` 2026-01-19. [VERIFIED: package.json; npm registry] |
| Tailwind CSS | `tailwindcss@3.4.19` | Utility CSS and local component classes | The repo intentionally pins Tailwind 3 and configures `darkMode: "selector"` through Mystic; npm latest is `4.3.1`, but the Phase 20 UI spec forbids changing UI dependencies or broad styling infrastructure. [VERIFIED: tailwind.config.ts; 20-UI-SPEC.md; npm registry; CITED: https://v3.tailwindcss.com/docs/dark-mode] |
| Mystic UI | `github:pRizz/mystic-ui#d36017757708ed01ef2b3b47beb14f294726411c` | Tailwind setup and compatible Solid UI primitives | The package is pinned to an exact GitHub commit and `git ls-remote` reports the same SHA on `main`; Phase 20 should not change this dependency. [VERIFIED: package.json; git ls-remote; 20-UI-SPEC.md] |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| TypeScript | `6.0.3` | Static typing and `tsc --noEmit` | Keep route/domain additions type-safe; npm registry reports `6.0.3` as current with `time.modified` 2026-06-17. [VERIFIED: package.json; npm registry] |
| Biome | repo pin `2.4.15`; npm latest `2.5.0` | Formatting and lint checks | Use existing `bun run format:check`, `bun run check`, and no version change in this phase. [VERIFIED: package.json; npm registry] |
| Vitest | repo pin `4.1.7`; npm latest `4.1.9` | Focused unit/module tests | Use for route registry helper tests, fallback/component tests, and static verifier helper tests if added. [VERIFIED: package.json; scripts/verify-static.test.ts; npm registry] |
| Playwright | repo pin `@playwright/test@1.60.0`; npm latest `1.61.0` | Browser layout, axe, keyboard, reduced-motion checks | Use existing browser release test structure for focused Phase 20 route coverage only if planner chooses browser tests in this phase. [VERIFIED: package.json; tests/browser-release.playwright.ts; npm registry] |
| axe Playwright | `@axe-core/playwright@4.11.3` | Accessibility scanning | Existing browser tests already use `AxeBuilder`, and npm registry reports `4.11.3` as current with `time.modified` 2026-06-15. [VERIFIED: tests/browser-release.playwright.ts; npm registry] |
| Repo verification scripts | current repo scripts | Static output, visual-system, curation, release guards | Prefer updating focused existing helpers instead of creating ad hoc verification commands. [VERIFIED: package.json; scripts/verify-static/expected-route-text.ts; scripts/verify-visual-system.ts] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| SolidStart file routes | Manual route config or catch-all route | File routes match the existing app and official SolidStart routing docs; a catch-all would increase leakage risk and route ambiguity for this phase. [VERIFIED: src/app.tsx; CITED: https://docs.solidjs.com/solid-start/building-your-application/routing] |
| Explicit `prerenderRoutes` allowlist | `crawlLinks: true` | Explicit routes prevent hidden DOM links or future accidental links from deciding public output; SolidStart supports both, but Phase 20 locks `crawlLinks: false`. [VERIFIED: app.config.ts; 20-CONTEXT.md; CITED: https://docs.solidjs.com/solid-start/building-your-application/route-prerendering] |
| Local typed registry helpers | CMS, MDX, parser pipeline, runtime content fetch | Requirements explicitly exclude CMS, MDX, parser pipelines, runtime content fetches, and new external content sources. [VERIFIED: .planning/REQUIREMENTS.md; 20-CONTEXT.md] |
| Existing dark CSS classes | New UI library, icons, or motion dependency | UI spec says no new UI dependencies or icon package for Phase 20, and `verify:visual-system` guards forbidden motion dependencies. [VERIFIED: 20-UI-SPEC.md; scripts/verify-visual-system.ts] |

**Installation:**

```bash
# No install command should be planned for Phase 20.
# Use the existing lockfile and package pins.
bun install
```

The planner should not add dependencies for Phase 20. [VERIFIED: 20-CONTEXT.md; 20-UI-SPEC.md]

**Version verification:** `npm view` was run on `@solidjs/start`, `solid-js`, `@solidjs/router`, `@solidjs/meta`, `vinxi`, `tailwindcss`, `@biomejs/biome`, `vitest`, `@playwright/test`, `@axe-core/playwright`, `typescript`, `vite`, and `vite-plugin-solid`; `git ls-remote` was run for `pRizz/mystic-ui`. [VERIFIED: npm registry; git ls-remote] The repo pins are appropriate for this phase because the task is route/UI implementation, not dependency modernization. [VERIFIED: 20-CONTEXT.md; package.json]

## Architecture Patterns

### Recommended Project Structure

```text
src/
|-- domain/
|   |-- routes.ts          # Add "themes" route and derive theme detail prerender routes. [VERIFIED: src/domain/routes.ts]
|   `-- themes.ts          # Existing Phase 19 public theme helper source. [VERIFIED: src/domain/themes.ts]
|-- routes/
|   `-- themes/
|       |-- index.tsx      # New /themes card-grid index. [VERIFIED: SolidStart file routes docs]
|       `-- [slug].tsx     # New /themes/{slug} gated detail route. [VERIFIED: SolidStart dynamic route docs]
|-- styles/
|   `-- app.css            # Small route-specific CSS only if reused classes are insufficient. [VERIFIED: 20-CONTEXT.md; src/styles/app.css]
scripts/
`-- verify-static/
    `-- expected-route-text.ts # Add theme expected text only if Phase 20 expands static verifier coverage. [VERIFIED: scripts/verify-static/expected-route-text.ts]
```

### Pattern 1: Explicit Route Registry Allowlist

**What:** Add `themes` to `RouteId` and `siteRoutes`, import `themeDetailRoutes()`, and extend `prerenderRoutes` with `...themeDetailRoutes()`. [VERIFIED: src/domain/routes.ts; src/domain/themes.ts]

**When to use:** Use this for all public static route exposure in Phase 20. [VERIFIED: 20-CONTEXT.md]

**Example:**

```typescript
// Source: src/domain/routes.ts + src/domain/themes.ts [VERIFIED: codebase grep]
import { projectDetailRoutes } from "./projects";
import { themeDetailRoutes } from "./themes";
import { writingDetailRoutes } from "./writing";

export type RouteId = "home" | "about" | "projects" | "writing" | "themes" | "contact";

export const prerenderRoutes = [
  ...siteRoutes.map((route) => route.path),
  ...projectDetailRoutes(),
  ...writingDetailRoutes(),
  ...themeDetailRoutes(),
];
```

### Pattern 2: Index as Curated Public Card Grid

**What:** Compute `const themeEntries = publicThemeEntries()` at module scope and render cards with real links from `themeDetailPath(theme)`. [VERIFIED: src/routes/writing/index.tsx; src/domain/themes.ts]

**When to use:** Use this for `/themes`; avoid filters, search, pagination, and mini-detail duplication. [VERIFIED: 20-CONTEXT.md; .planning/REQUIREMENTS.md]

**Example:**

```tsx
// Source: src/routes/writing/index.tsx adapted to src/domain/themes.ts [VERIFIED: codebase grep]
<ReactiveSurface class="writing-list">
  <For each={publicThemeEntries()}>
    {(theme) => (
      <article class="theme-card interactive-surface reactive-card">
        <h2 class="card-title">{theme.title}</h2>
        <p class="card-copy">{theme.summary}</p>
        <ul class="label-row" aria-label={`${theme.title} theme details`}>
          <li class="chip">{theme.audience}</li>
        </ul>
        <div class="link-list">
          <a class="text-link surface-link" href={themeDetailPath(theme)}>
            Explore theme
          </a>
        </div>
      </article>
    )}
  </For>
</ReactiveSurface>
```

### Pattern 3: Detail Route Gate With Generic Fallback

**What:** Read `params.slug`, call `maybePublicThemeEntryBySlug(params.slug ?? "")`, and render one generic fallback for null. [VERIFIED: src/routes/writing/[slug].tsx; src/domain/themes.ts]

**When to use:** Use this for `/themes/[slug]` to cover unknown, hidden, draft, unsupported, and archived records without leaking slug/status/content. [VERIFIED: 20-CONTEXT.md; 20-UI-SPEC.md]

**Example:**

```tsx
// Source: src/routes/writing/[slug].tsx adapted to src/domain/themes.ts [VERIFIED: codebase grep]
export default function ThemeDetail() {
  const params = useParams();
  const theme = () => maybePublicThemeEntryBySlug(params.slug ?? "");

  return (
    <Show when={theme()} fallback={<ThemeFallback />}>
      {(selectedTheme) => <ThemeArticle theme={selectedTheme()} />}
    </Show>
  );
}
```

### Pattern 4: Relationship Rendering Through Existing Records

**What:** Resolve related selected project detail records and public writing records inside the detail route using `relatedProjectDetailPageProjectsForTheme(theme)` and `relatedWritingEntriesForTheme(theme)`. [VERIFIED: src/domain/themes.ts]

**When to use:** Use this anywhere Phase 20 renders related content; never copy project/writing descriptions into the theme registry or route constants. [VERIFIED: 20-CONTEXT.md; 19-01-SUMMARY.md]

**Example:**

```tsx
// Source: src/routes/projects/[slug].tsx + src/domain/themes.ts [VERIFIED: codebase grep]
<section class="content-section" aria-labelledby="related-writing">
  <h2 id="related-writing" class="section-title">Related writing</h2>
  <div class="writing-related-grid">
    <For each={relatedWritingEntriesForTheme(theme)}>
      {(entry) => (
        <article class="surface-card">
          <h3 class="card-title">{entry.title}</h3>
          <p class="card-copy">{entry.summary}</p>
          <a class="text-link surface-link" href={writingDetailPath(entry)}>
            {entry.kind === "note" ? "Read note" : "Read essay"}
          </a>
        </article>
      )}
    </For>
  </div>
</section>
```

### Anti-Patterns to Avoid

- **Route strings copied by hand:** Use `themeDetailRoutes()` and `themeDetailPath()` instead of duplicating slugs in routes or tests. [VERIFIED: src/domain/themes.ts; 20-CONTEXT.md]
- **Crawler-derived public output:** Keep `crawlLinks: false`; route output should come from helpers, not DOM links. [VERIFIED: app.config.ts; 20-CONTEXT.md]
- **Fallback data leakage:** Do not render `params.slug`, private statuses, or any non-public theme fields in fallback UI or metadata. [VERIFIED: 20-CONTEXT.md; 20-UI-SPEC.md]
- **Whole-card click traps:** Use real anchors with descriptive labels like `Explore theme`, `Project details`, and `Read note`. [VERIFIED: 20-UI-SPEC.md; src/routes/writing/index.tsx]
- **Broad CSS or dependency refactor:** Reuse the dark-primary CSS classes and avoid new UI/motion/icon packages. [VERIFIED: 20-UI-SPEC.md; scripts/verify-visual-system.ts]
- **Phase 21/22/23 scope creep:** Do not add collaboration panels, theme metadata/JSON-LD/sitemap, social previews, release labels, or browser-suite expansion beyond focused Phase 20 proof. [VERIFIED: 20-CONTEXT.md; .planning/ROADMAP.md]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Static route discovery | A custom crawler, glob, or local route array | `themeDetailRoutes()` in `prerenderRoutes` | Phase 19 already defines public route helpers, and SolidStart supports explicit `prerender.routes`. [VERIFIED: src/domain/themes.ts; CITED: https://docs.solidjs.com/solid-start/building-your-application/route-prerendering] |
| Theme content source | CMS, MDX, parser pipeline, runtime fetch | Checked-in `curatedThemes` via pure helpers | Requirements exclude CMS/MDX/runtime content fetches and Phase 19 validated typed theme data. [VERIFIED: .planning/REQUIREMENTS.md; 19-01-SUMMARY.md] |
| Public eligibility logic | Ad hoc status checks in route components | `publicThemeEntries()` and `maybePublicThemeEntryBySlug()` | Central helpers already filter public records and sort by `displayOrder`. [VERIFIED: src/domain/themes.ts; src/domain/themes.test.ts] |
| Related project/writing display | Copied descriptions or denormalized cards | Existing project/writing records from relationship helpers | Theme requirements keep project and writing registries authoritative. [VERIFIED: .planning/REQUIREMENTS.md; src/domain/themes.ts] |
| Motion and hover effects | New JS animation library or physics helper | Existing `ReactiveSurface` and CSS guards | The visual-system guard bans common motion dependencies and existing `ReactiveSurface` already gates reduced motion/coarse pointer/mobile. [VERIFIED: scripts/verify-visual-system.ts; src/components/ReactiveSurface.tsx; src/styles/app.css] |
| Accessibility scanning | Custom DOM scanner from scratch | Existing Playwright + axe patterns | Browser release tests already run axe, dark layout overflow/overlap, keyboard focus, and reduced-motion checks. [VERIFIED: tests/browser-release.playwright.ts] |

**Key insight:** The hard problem is not generating a route file; it is preserving the public-only helper contract across prerender output, route fallback, and pre-hydration content. [VERIFIED: 20-CONTEXT.md; src/domain/themes.ts; app.config.ts]

## Common Pitfalls

### Pitfall 1: Static Route Inclusion Without Domain Allowlist

**What goes wrong:** A planner adds `/themes` UI but forgets to include `themeDetailRoutes()` in `prerenderRoutes`, so public detail pages are not generated before hydration. [VERIFIED: app.config.ts; src/domain/routes.ts]

**Why it happens:** File-based dynamic routes can render in dev, but static generation still needs explicit routes when `crawlLinks` is false. [VERIFIED: app.config.ts; CITED: https://docs.solidjs.com/solid-start/building-your-application/route-prerendering]

**How to avoid:** Add a focused test similar to `foundation.test.ts` that expects `prerenderRoutes` to equal site routes plus project, writing, and theme detail routes. [VERIFIED: src/domain/foundation.test.ts; src/domain/themes.test.ts]

**Warning signs:** The build has `src/routes/themes/[slug].tsx` but no `.output/public/themes/{slug}/index.html` for public themes. [VERIFIED: scripts/verify-static/output.ts; app.config.ts]

### Pitfall 2: Non-Public Theme Leakage Through Fallback

**What goes wrong:** The fallback renders the requested slug, status, or fields from `curatedThemes` while trying to explain why a route is unavailable. [VERIFIED: 20-CONTEXT.md; 20-UI-SPEC.md]

**Why it happens:** Developers often look up raw records first and then decide eligibility in the component. [VERIFIED: src/domain/themes.ts shows separate public lookup helper]

**How to avoid:** Call only `maybePublicThemeEntryBySlug()` in the route and make fallback copy static: `No public theme here. Browse theme paths to find a public route through Peter's work.` [VERIFIED: 20-UI-SPEC.md]

**Warning signs:** Tests search fallback HTML and find the unknown slug, `draft`, `hidden`, `unsupported`, `archived`, or non-public theme text. [VERIFIED: 20-UI-SPEC.md]

### Pitfall 3: Duplicating Related Project or Writing Copy

**What goes wrong:** Theme routes become a second source of project/writing descriptions, which can drift from authoritative records. [VERIFIED: .planning/REQUIREMENTS.md; 20-CONTEXT.md]

**Why it happens:** It is tempting to make theme cards self-contained. [VERIFIED: 20-CONTEXT.md]

**How to avoid:** Render related cards from `relatedProjectDetailPageProjectsForTheme()` and `relatedWritingEntriesForTheme()` only. [VERIFIED: src/domain/themes.ts]

**Warning signs:** New theme route files include hard-coded project names, project descriptions, writing summaries, or copied URL lists that already exist in `projects.ts` or `writing.ts`. [VERIFIED: src/domain/projects.ts; src/domain/writing.ts]

### Pitfall 4: Metadata or Release Scope Creep

**What goes wrong:** Phase 20 starts adding route-specific theme metadata, JSON-LD, sitemap behavior, social previews, release-readiness labels, or expanded browser release contracts. [VERIFIED: 20-CONTEXT.md; .planning/ROADMAP.md]

**Why it happens:** Existing writing/project routes include metadata and release checks from later milestone phases. [VERIFIED: src/routes/writing/index.tsx; scripts/verify-release.test.ts]

**How to avoid:** Add only minimal route registry fields needed for the existing `/themes` route shell, and defer full theme metadata/static sitemap/release evidence to Phases 22 and 23. [VERIFIED: 20-CONTEXT.md; .planning/ROADMAP.md]

**Warning signs:** Phase 20 diffs touch `src/domain/seo.ts`, sitemap generation, release evidence labels, or social preview assets without a direct route/UI necessity. [VERIFIED: 20-CONTEXT.md; src/domain/seo.ts; scripts/verify-release.test.ts]

### Pitfall 5: Dark UI Breakage From New Layout CSS

**What goes wrong:** New theme grids overflow on mobile, long chips overlap, or light-first utilities break the dark-primary interface. [VERIFIED: AGENTS.md; 20-UI-SPEC.md]

**Why it happens:** Theme proof points and audience strings are longer than simple nav labels or status pills. [VERIFIED: src/domain/themes.ts]

**How to avoid:** Reuse `overflow-wrap: anywhere`, `min-width: 0`, `label-row`, `chip`, `tier-pill`, and `repeat(auto-fit, minmax(min(100%, 20rem), 1fr))` patterns. [VERIFIED: src/styles/app.css; 20-UI-SPEC.md]

**Warning signs:** Playwright layout checks report horizontal overflow or obvious overlap on `/themes` or `/themes/{slug}`. [VERIFIED: tests/browser-release.playwright.ts]

## Code Examples

Verified patterns from official and local sources:

### SolidStart Dynamic Route With Params

```tsx
// Source: SolidStart routing docs and existing writing detail route [CITED: https://docs.solidjs.com/solid-start/building-your-application/routing] [VERIFIED: src/routes/writing/[slug].tsx]
import { useParams } from "@solidjs/router";

export default function ThemeDetail() {
  const params = useParams();
  const maybeTheme = () => maybePublicThemeEntryBySlug(params.slug ?? "");

  return (
    <Show when={maybeTheme()} fallback={<ThemeFallback />}>
      {(theme) => <ThemeArticle theme={theme()} />}
    </Show>
  );
}
```

### Optional 404 Status for Generic Fallback

```tsx
// Source: SolidStart HttpStatusCode docs [CITED: https://docs.solidjs.com/solid-start/reference/server/http-status-code]
import { HttpStatusCode } from "@solidjs/start";

function ThemeFallback() {
  return (
    <>
      <HttpStatusCode code={404} text="Not Found" />
      <section class="page-intro">
        <p class="eyebrow">Theme path</p>
        <h1 class="page-title">No public theme here</h1>
        <p class="lead">
          No public theme here. Browse theme paths to find a public route through Peter's work.
        </p>
        <a class="primary-action interactive-surface" href="/themes">
          Browse theme paths
        </a>
      </section>
    </>
  );
}
```

### Static Verification Text Derivation

```typescript
// Source: scripts/verify-static/expected-route-text.ts adapted to src/domain/themes.ts [VERIFIED: codebase grep]
export function maybeThemeForDetailRoute(route: string): PublicThemeEntry | null {
  const detailRoutePrefix = "/themes/";

  if (!route.startsWith(detailRoutePrefix)) {
    return null;
  }

  return maybePublicThemeEntryBySlug(route.slice(detailRoutePrefix.length));
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Tailwind `darkMode: "class"` | Tailwind v3.4.1+ `darkMode: "selector"` | Tailwind docs state the selector strategy replaced the class strategy in v3.4.1. [CITED: https://v3.tailwindcss.com/docs/dark-mode] | Keep the repo's `darkMode: "selector"` and `.dark` root. [VERIFIED: tailwind.config.ts; src/entry-server.tsx] |
| Link crawling for all prerendered pages | Explicit `prerender.routes` allowlist | SolidStart documents both explicit routes and `crawlLinks`; Phase 20 locks explicit routes with `crawlLinks: false`. [CITED: https://docs.solidjs.com/solid-start/building-your-application/route-prerendering] [VERIFIED: 20-CONTEXT.md] | Static output should be helper-derived and public-only. [VERIFIED: src/domain/themes.ts; app.config.ts] |
| Dense topic/tag archive | Curated theme entry points | v1.4 requirements define curated theme paths and explicitly exclude search/filter/tag archive UI. [VERIFIED: .planning/REQUIREMENTS.md] | `/themes` should explain routes through Peter's work, not become a faceted discovery UI. [VERIFIED: 20-CONTEXT.md] |
| Browser-only accessibility confidence | Static plus Playwright/axe/readability checks | Existing release tests run axe, dark layout, keyboard, and reduced-motion checks. [VERIFIED: tests/browser-release.playwright.ts] | Phase 20 should add focused evidence for changed routes, not overclaim full Phase 23 release coverage. [VERIFIED: 20-CONTEXT.md] |

**Deprecated/outdated:**

- `crawlLinks: true` for this phase is out of scope because the user locked `crawlLinks: false`. [VERIFIED: 20-CONTEXT.md]
- Tailwind v4 adoption is out of scope because the repo/UI spec require Tailwind 3 with Mystic setup for this milestone. [VERIFIED: 20-UI-SPEC.md; package.json]
- New icon, UI, or motion packages are out of scope because Phase 20 UI spec says none are needed. [VERIFIED: 20-UI-SPEC.md]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| - | No `[ASSUMED]` claims were used. | All sections | No user confirmation is needed for assumed research facts. [VERIFIED: this document review] |

## Open Questions

1. **Should fallback set an explicit 404 status?** [CITED: https://docs.solidjs.com/solid-start/reference/server/http-status-code]
   - What we know: SolidStart provides `HttpStatusCode` to set server response status, and existing project/writing fallbacks currently render generic copy without an explicit status component. [CITED: https://docs.solidjs.com/solid-start/reference/server/http-status-code] [VERIFIED: src/routes/projects/[slug].tsx; src/routes/writing/[slug].tsx]
   - What's unclear: The Phase 20 context requires generic fallback behavior but does not explicitly require an HTTP 404 status. [VERIFIED: 20-CONTEXT.md]
   - Recommendation: Use `HttpStatusCode code={404}` only if it works cleanly with the static build and existing route tests; otherwise match the existing writing/project fallback pattern and focus on non-leaking copy. [VERIFIED: src/routes/writing/[slug].tsx; app.config.ts]

2. **How much browser test expansion belongs in Phase 20?** [VERIFIED: 20-CONTEXT.md]
   - What we know: Phase 23 owns full browser release-suite expansion, while Phase 20 may add focused verification directly needed for route/UI behavior. [VERIFIED: 20-CONTEXT.md; .planning/ROADMAP.md]
   - What's unclear: The planner must choose between focused Vitest/static verifier checks and limited Playwright route inclusion for desktop/mobile dark rendering. [VERIFIED: 20-CONTEXT.md]
   - Recommendation: Plan focused unit/static tests first, and add a small browser route sample only if route UI cannot be credibly verified through existing browser loops after `prerenderRoutes` includes themes. [VERIFIED: tests/browser-release.playwright.ts; scripts/verify-static/expected-route-text.ts]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Bun | All repo scripts and build | yes | local `1.3.9`; package pin `1.3.14` | Use local Bun for planning/test runs if scripts pass; install `1.3.14` before clean-builder parity if mismatch causes failures. [VERIFIED: `bun --version`; package.json] |
| Node.js | npm probes and ecosystem tooling | yes | `v24.13.0` | None needed. [VERIFIED: `node --version`] |
| npm | Registry version verification | yes | `11.6.2` | Not needed during implementation unless re-checking package metadata. [VERIFIED: `npm --version`] |
| Git | Commit docs and SHA verification | yes | `2.53.0` | None needed. [VERIFIED: `git --version`] |
| node_modules | Local script execution | yes | present | Run `bun install` if dependency resolution fails. [VERIFIED: `test -d node_modules`] |
| Playwright CLI | Browser verification | yes | `1.60.0` | Run `bun run install:browser` if Chromium binary is missing. [VERIFIED: `bunx playwright --version`; package.json] |
| Playwright browser cache | Browser verification | yes | cache directory present | `bun run install:browser`. [VERIFIED: `test -d ~/Library/Caches/ms-playwright`; package.json] |

**Missing dependencies with no fallback:**

- None found. [VERIFIED: environment probes above]

**Missing dependencies with fallback:**

- Local Bun is older than the repo package-manager pin; fallback is to run with local Bun during planning and install Bun `1.3.14` only if verification fails or clean-builder parity is required. [VERIFIED: `bun --version`; package.json]

## Security Domain

Security enforcement is enabled because `.planning/config.json` does not set `security_enforcement` to `false`. [VERIFIED: .planning/config.json]

### Applicable ASVS Categories

The table uses the GSD-requested V2-V6 labels; OWASP's official ASVS project identifies 5.0.0 as the latest stable version from May 2025. [CITED: https://owasp.org/www-project-application-security-verification-standard/]

| ASVS Category | Applies | Standard Control |
|---------------|---------|------------------|
| V2 Authentication | no | Phase 20 adds public static routes and no login/authentication surface. [VERIFIED: .planning/REQUIREMENTS.md; 20-CONTEXT.md] |
| V3 Session Management | no | Phase 20 adds no sessions, cookies, or account state. [VERIFIED: .planning/REQUIREMENTS.md; 20-CONTEXT.md] |
| V4 Access Control | yes | Treat public theme eligibility as static authorization: only `publicThemeEntries()` and `themeDetailRoutes()` may create public route output. [VERIFIED: src/domain/themes.ts; 20-CONTEXT.md] |
| V5 Input Validation | yes | Treat `params.slug` as untrusted input and resolve it only through `maybePublicThemeEntryBySlug()`. [VERIFIED: src/routes/writing/[slug].tsx; src/domain/themes.ts; CITED: https://docs.solidjs.com/solid-router/concepts/path-parameters] |
| V6 Cryptography | no | Phase 20 adds no cryptography, secrets, tokens, or encrypted storage. [VERIFIED: .planning/REQUIREMENTS.md; 20-CONTEXT.md] |

### Known Threat Patterns for SolidStart Static Theme Routes

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Non-public content exposure through dynamic route fallback | Information Disclosure | Use `maybePublicThemeEntryBySlug()` and static fallback copy that does not echo slugs/status/private fields. [VERIFIED: 20-CONTEXT.md; 20-UI-SPEC.md] |
| Public route expansion by accidental DOM links | Information Disclosure | Keep `crawlLinks: false` and derive `prerenderRoutes` from helper output only. [VERIFIED: app.config.ts; src/domain/themes.ts] |
| Runtime token or GitHub API residue in static output | Information Disclosure | Preserve existing forbidden pattern checks and do not add runtime content fetches. [VERIFIED: scripts/verify-static/config.ts; scripts/verify-release.test.ts; .planning/REQUIREMENTS.md] |
| Misleading external action or OpenLinks primary CTA | Spoofing / Trust Boundary Confusion | Keep OpenLinks in existing low-intrusion footer/profile/contact placement and defer collaboration panels to Phase 21. [VERIFIED: SiteLayout.tsx; openlinks-identity-presence skill; 20-CONTEXT.md] |

## Sources

### Primary (HIGH confidence)

- `.planning/phases/20-theme-routes-and-dark-ui/20-CONTEXT.md` - locked decisions, discretion, deferred boundaries, route helper requirements. [VERIFIED: file read]
- `.planning/phases/20-theme-routes-and-dark-ui/20-UI-SPEC.md` - UI contract, copy, interaction, fallback, verification requirements. [VERIFIED: file read]
- `.planning/REQUIREMENTS.md`, `.planning/ROADMAP.md`, `.planning/STATE.md`, `.planning/PROJECT.md` - milestone scope, requirement mapping, history, and static portfolio constraints. [VERIFIED: file reads]
- `AGENTS.md`, `AGENTS.bright-builds.md`, `standards-overrides.md`, `standards/core/*.md`, `standards/languages/typescript-javascript.md` - repo and Bright Builds constraints. [VERIFIED: file reads]
- `src/domain/themes.ts`, `src/domain/routes.ts`, `app.config.ts`, `src/routes/writing/index.tsx`, `src/routes/writing/[slug].tsx`, `src/routes/projects/[slug].tsx`, `src/components/SiteLayout.tsx`, `src/styles/app.css` - implementation contracts and patterns. [VERIFIED: codebase grep/read]
- `scripts/verify-static/*`, `scripts/verify-visual-system.ts`, `tests/browser-release.playwright.ts`, `package.json` - verification and dependency contracts. [VERIFIED: codebase grep/read]
- npm registry probes for current package versions and modification times. [VERIFIED: npm registry]
- `git ls-remote https://github.com/pRizz/mystic-ui.git refs/heads/main` - Mystic UI commit pin check. [VERIFIED: git ls-remote]

### Primary Documentation (HIGH confidence)

- SolidStart route prerendering: `https://docs.solidjs.com/solid-start/building-your-application/route-prerendering`. [CITED: official docs]
- SolidStart routing and dynamic route files: `https://docs.solidjs.com/solid-start/building-your-application/routing`. [CITED: official docs]
- Solid Router path parameters: `https://docs.solidjs.com/solid-router/concepts/path-parameters`. [CITED: official docs]
- SolidStart `HttpStatusCode`: `https://docs.solidjs.com/solid-start/reference/server/http-status-code`. [CITED: official docs]
- Tailwind v3 dark mode selector strategy: `https://v3.tailwindcss.com/docs/dark-mode`. [CITED: official docs]
- Tailwind v3 responsive breakpoints: `https://v3.tailwindcss.com/docs/responsive-design`. [CITED: official docs]
- MDN `prefers-reduced-motion`: `https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion`. [CITED: official docs]
- WCAG reflow understanding: `https://www.w3.org/WAI/WCAG21/Understanding/reflow.html`. [CITED: official docs]
- WAI headings tutorial: `https://www.w3.org/WAI/tutorials/page-structure/headings/`. [CITED: official docs]
- OWASP ASVS project page: `https://owasp.org/www-project-application-security-verification-standard/`. [CITED: official docs]

### Secondary (MEDIUM confidence)

- None used. [VERIFIED: source review]

### Tertiary (LOW confidence)

- None used. [VERIFIED: source review]

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - package pins were read from `package.json`, current package metadata was checked via npm, and Mystic SHA was checked through Git. [VERIFIED: package.json; npm registry; git ls-remote]
- Architecture: HIGH - implementation patterns are already present in project/writing routes and Phase 19 helper contracts. [VERIFIED: src/routes/writing/index.tsx; src/routes/writing/[slug].tsx; src/routes/projects/[slug].tsx; src/domain/themes.ts]
- Pitfalls: HIGH - pitfalls are derived from locked user decisions, UI spec verification contract, and existing static/browser verifier behavior. [VERIFIED: 20-CONTEXT.md; 20-UI-SPEC.md; scripts/verify-static/expected-route-text.ts; tests/browser-release.playwright.ts]

**Research date:** 2026-06-17 [VERIFIED: system current_date]
**Valid until:** 2026-07-17 for local route/UI planning, or sooner if SolidStart/Tailwind/Mystic dependency pins change. [VERIFIED: package.json; npm registry]
