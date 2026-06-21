# Phase 21: Collaboration Pathways and Cross-Links - Research

**Researched:** 2026-06-17
**Domain:** SolidStart static portfolio relationship helpers, dark-primary cross-link UI, and collaboration paths
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

## Implementation Decisions

### Theme Collaboration Panels

- **D-01:** Add a collaboration starting-point panel to public theme detail pages. The panel should use each theme's `collaborationAngle`, related selected project records, public writing records, and existing curated project/profile links to explain how a visitor can inspect or engage with the work.
- **D-02:** The panel should be a compact action surface, not a marketing hero or primary OpenLinks CTA. Recommended order: theme-specific collaboration angle, related project story links, reviewed source/live links when available, related writing links, and a low-intrusion identity/contact fallback only when useful.
- **D-03:** Prefer existing reviewed project link data and existing GitHub metadata helpers over new external-link fields. Do not introduce unreviewed URL sources, live-reachability claims, dynamic network checks, or token-dependent runtime behavior.
- **D-04:** Use concise action labels that describe the destination, such as `Project story`, `Source`, `Live surface`, `Read note`, `Read essay`, or `Contact path`. Avoid vague labels such as `Learn more` when a more specific label is available.

### Helper-Derived Relationship Graph

- **D-05:** Add pure domain helpers for theme relationship lookups instead of hand-filtering records inside route components. Helpers should answer "which public themes reference this project?" and "which public themes reference this writing entry?" from `curatedThemes`.
- **D-06:** Reciprocal helpers must return only public theme entries and should preserve theme display order. They should defensively return an empty list for unreferenced records without leaking draft, hidden, unsupported, or archived themes.
- **D-07:** Keep project and writing registries authoritative. Theme links may reference project and writing records, but must not duplicate authored project or writing copy beyond small labels and summaries already available through existing helpers.

### Project and Writing Cross-Links

- **D-08:** Add related theme links to selected project detail pages when public themes reference that project. Place them as a secondary panel near existing related writing/project facts, so the project narrative remains primary.
- **D-09:** Add related theme links to public writing detail pages when public themes reference that writing entry. Place them after the article body and related projects, so the writing remains primary.
- **D-10:** Cross-links should use stable `themeDetailPath()` links, existing dark-primary link/list styling, and short theme title/summary text. Do not add related theme links to broad index cards, homepage project cards, or navigation in this phase.

### OpenLinks Placement

- **D-11:** Preserve OpenLinks as a low-intrusion identity hub. The existing footer/profile/contact metadata placement is already the default placement; Phase 21 should not make OpenLinks the primary theme CTA.
- **D-12:** The `open-identity` theme may naturally include OpenLinks as a related project and reviewed live/source surface, but general theme collaboration panels should prioritize the theme's related projects, writing, and GitHub/source surfaces first.
- **D-13:** If the implementation introduces any new visible OpenLinks link, it must use the existing profile data where practical and include appropriate `rel="me noopener noreferrer"` semantics. Prefer not adding a duplicate OpenLinks link when the existing footer/contact placement already satisfies discoverability.

### Dark UI and Accessibility

- **D-14:** Reuse the current dark-primary surfaces: `project-detail-panel`, `visual-surface`, `link-list`, `surface-link`, `chip`, `tier-pill`, and existing theme/project/writing card patterns. Add only narrow CSS when needed for stable layout.
- **D-15:** Avoid building decorative cards inside other cards for new collaboration UI. Prefer compact grouped link rows or lists inside panels so the new surfaces remain scan-friendly and do not add nested visual noise.
- **D-16:** Keep keyboard reachability, descriptive link text, focus visibility, reduced-motion behavior, and desktop/mobile dark text wrapping explicit in verification.

### Verification Boundary

- **D-17:** Add focused unit tests for reciprocal theme helpers and any collaboration-link assembly helpers.
- **D-18:** Add route/component/static tests proving public theme detail pages expose collaboration pathways, project detail pages expose related theme links, and writing detail pages expose related theme links.
- **D-19:** Run visual/browser verification for desktop and mobile dark rendering on at least one theme detail route plus representative project and writing detail surfaces affected by the new links. Keep Phase 22/23 metadata and release-contract assertions out of this phase.

### the agent's Discretion

- The planner may decide exact helper names, link grouping structure, and panel placement as long as helpers stay pure, nullable values use `maybe...` names, and route components remain thin shells.
- The planner may choose whether collaboration action assembly lives in `src/domain/themes.ts` or a small adjacent module, provided it stays data-in/data-out and is covered by focused tests.
- The executor may choose exact section headings and CTA labels, provided they are destination-specific, concise, dark-primary, and do not over-promote OpenLinks.

### Deferred Ideas (OUT OF SCOPE)

- Theme metadata, JSON-LD, sitemap inclusion/exclusion, Open Graph/Twitter tags, and social-preview fallback behavior belong to Phase 22.
- Browser release-suite expansion, release-readiness documentation, aggregate evidence labels, and release-contract checks belong to Phase 23.
- Search, filters, tag archives, CMS/admin, comments/newsletter, analytics, live external-link reachability, runtime content fetches, and dynamic OG images remain future or out of scope.
</user_constraints>

## Project Constraints (from AGENTS.md)

- Use `AGENTS.md` as the repo-local instruction entrypoint, then `AGENTS.bright-builds.md`, `standards-overrides.md`, and relevant `standards/` pages before planning or implementation. [VERIFIED: AGENTS.md] [VERIFIED: AGENTS.bright-builds.md]
- Keep the portfolio dark-primary: `.dark` on the root document, Tailwind selector dark mode, and avoid light-first utilities such as `bg-white`, `bg-stone-50`, and `text-zinc-950` without a local reason. [VERIFIED: AGENTS.md] [VERIFIED: src/styles/app.css]
- UI verification for this phase must include desktop and mobile dark rendering, contrast/readability, and text-overlap checks. [VERIFIED: AGENTS.md] [VERIFIED: tests/browser-release.playwright.ts]
- Keep business rules in pure data-in/data-out helpers and keep route components as thin Solid shells. [VERIFIED: standards/core/architecture.md] [VERIFIED: standards/languages/typescript-javascript.md]
- Prefix nullable or optional internal values and functions with `maybe...`; this applies to helper return values such as `maybePublicThemeEntryBySlug` and local nullish bindings. [VERIFIED: standards/core/code-shape.md] [VERIFIED: standards/languages/typescript-javascript.md] [VERIFIED: src/domain/themes.ts]
- Unit tests for pure helper behavior should use focused Arrange, Act, Assert structure and one concern per test. [VERIFIED: standards/core/testing.md] [VERIFIED: src/domain/themes.test.ts]
- Prefer repo-owned verification entrypoints and Bun scripts; the repo has `bun run verify`, plus narrower scripts such as `bun run test`, `bun run verify:static`, and `bun run verify:browser`. [VERIFIED: standards/core/verification.md] [VERIFIED: package.json]
- Do not add Python automation to this Bun-friendly TypeScript repository for this phase. [VERIFIED: standards/languages/typescript-javascript.md]
- Owner-specific OpenLinks guidance says to use low-intrusion footer/about/profile placement, keep visible links first, avoid repetitive promotion, and keep host project CTAs primary. [VERIFIED: AGENTS.bright-builds.md] [VERIFIED: openlinks-identity-presence SKILL.md] [VERIFIED: openlinks-identity-presence/references/surface-patterns.md]
- No project-local `.claude/skills` or `.agents/skills` were found. [VERIFIED: `find .claude/skills .agents/skills -maxdepth 2 -type f -name SKILL.md`]

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SYNTH-02 | Visitor can move from theme detail pages to related selected project stories and public writing entries using helper-derived relationships. | Existing `relatedProjectDetailPageProjectsForTheme()`, `relatedWritingEntriesForTheme()`, `projectDetailPath()`, and `writingDetailPath()` already support this flow; Phase 21 should preserve and extend helper use rather than filter inside JSX. [VERIFIED: .planning/REQUIREMENTS.md] [VERIFIED: src/domain/themes.ts] [VERIFIED: src/routes/themes/[slug].tsx] |
| SYNTH-03 | Project and writing surfaces can show related theme links where those links clarify the existing content graph without overwhelming the primary project or writing narrative. | New reciprocal helpers should resolve public theme entries by project slug or writing slug, then project and writing detail routes should render secondary panels using `themeDetailPath()`. [VERIFIED: .planning/REQUIREMENTS.md] [VERIFIED: src/domain/themes.ts] [VERIFIED: src/routes/projects/[slug].tsx] [VERIFIED: src/routes/writing/[slug].tsx] |
| COLLAB-01 | Visitor can identify a useful collaboration starting point for each theme, including reviewed source links, live surfaces, relevant writing, and practical next actions when available. | Theme records already include `collaborationAngle`; project records already include reviewed `links`; GitHub metadata helpers can derive non-duplicate homepage links; writing records already expose public detail paths and kind labels. [VERIFIED: .planning/REQUIREMENTS.md] [VERIFIED: src/domain/themes.ts] [VERIFIED: src/domain/projects.ts] [VERIFIED: src/domain/github-metadata.ts] [VERIFIED: src/domain/writing.ts] |
| COLLAB-02 | Theme collaboration panels use existing curated project, writing, profile, GitHub, and OpenLinks data instead of introducing unreviewed external-link sources or live reachability claims. | Use existing project links, `maybeGitHubHomepageLinkForProject()`, `peterProfile.links`, and current footer/about/contact OpenLinks placements; do not add URL fields to theme records. [VERIFIED: .planning/REQUIREMENTS.md] [VERIFIED: src/domain/github-metadata.ts] [VERIFIED: src/domain/profile.ts] [VERIFIED: src/components/SiteLayout.tsx] [VERIFIED: src/routes/about.tsx] [VERIFIED: src/routes/contact.tsx] |
| COLLAB-03 | OpenLinks remains a low-intrusion identity hub in footer, profile, contact, or metadata surfaces and does not become the primary theme CTA unless explicitly requested later. | Existing footer, About, Contact, profile, and sameAs data already expose OpenLinks; Phase 21 should not add a generic OpenLinks primary CTA. [VERIFIED: .planning/REQUIREMENTS.md] [VERIFIED: src/components/SiteLayout.tsx] [VERIFIED: src/routes/about.tsx] [VERIFIED: src/routes/contact.tsx] [VERIFIED: src/domain/profile.ts] |
</phase_requirements>

## Summary

Phase 21 should be implemented as a small domain-helper and route-surface extension, not as a new content model, metadata phase, link checker, or discovery system. [VERIFIED: .planning/phases/21-collaboration-pathways-and-cross-links/21-CONTEXT.md] The existing project, writing, theme, profile, GitHub metadata, and static verification surfaces already provide the data needed for helper-derived collaboration pathways. [VERIFIED: src/domain/themes.ts] [VERIFIED: src/domain/projects.ts] [VERIFIED: src/domain/writing.ts] [VERIFIED: src/domain/github-metadata.ts] [VERIFIED: src/domain/profile.ts]

The planning priority is to add pure reciprocal theme helpers and, if useful, one pure collaboration-link assembly helper. Route files should only consume helper output and render compact secondary panels using current dark-primary classes. [VERIFIED: standards/core/architecture.md] [VERIFIED: src/routes/themes/[slug].tsx] [VERIFIED: src/routes/projects/[slug].tsx] [VERIFIED: src/routes/writing/[slug].tsx]

Verification should stay focused on the Phase 21 behaviors: helper tests, SSR/static route rendering assertions, static expected text updates, and representative browser coverage for dark desktop/mobile layout and keyboard reachability. [VERIFIED: .planning/phases/21-collaboration-pathways-and-cross-links/21-CONTEXT.md] [VERIFIED: src/domain/themes.test.ts] [VERIFIED: tests/theme-detail-route.test.tsx] [VERIFIED: scripts/verify-static/expected-route-text.ts] [VERIFIED: tests/browser-release.playwright.ts]

**Primary recommendation:** Add pure helpers in `src/domain/themes.ts` for reciprocal public-theme lookup and collaboration action assembly, then render secondary panels in the three detail route shells with existing `project-detail-panel`, `visual-surface`, `link-list`, `surface-link`, `chip`, and `tier-pill` classes. [VERIFIED: src/domain/themes.ts] [VERIFIED: src/styles/app.css]

## Standard Stack

### Core

| Library / Surface | Version | Purpose | Why Standard |
|---|---:|---|---|
| Bun scripts | `packageManager: bun@1.3.14`; local `bun --version` is `1.3.9` | Run build, tests, and verification scripts | Existing package manager and script runner; planner should not switch package managers in this phase. [VERIFIED: package.json] [VERIFIED: `bun --version`] |
| SolidStart / Solid | `@solidjs/start@1.3.2`, `solid-js@1.9.13`, `@solidjs/router@0.16.1` | Static route shell and route params | Existing framework stack; current theme/project/writing detail routes use Solid `useParams`, `<Show>`, and `<For>`. [VERIFIED: package.json] [VERIFIED: src/routes/themes/[slug].tsx] [CITED: https://docs.solidjs.com/concepts/control-flow/conditional-rendering] [CITED: https://docs.solidjs.com/concepts/control-flow/list-rendering] |
| TypeScript domain modules | `typescript@6.0.3` | Pure relationship helpers and typed registries | Existing domain records and helpers are data-in/data-out TypeScript functions under `src/domain`. [VERIFIED: package.json] [VERIFIED: src/domain/themes.ts] |
| Tailwind + Mystic UI theme CSS | `tailwindcss@3.4.19`, `mystic-ui` pinned to `github:pRizz/mystic-ui#d36017757708ed01ef2b3b47beb14f294726411c` | Dark-primary classes and existing component style primitives | The site imports `mystic-ui/tailwind/theme.css` and owns shared dark surfaces in `src/styles/app.css`; do not add another UI kit. [VERIFIED: package.json] [VERIFIED: src/styles/app.css] |

### Supporting

| Library / Surface | Version | Purpose | When to Use |
|---|---:|---|---|
| Vitest | `4.1.7` pinned; npm latest checked as `4.1.9` on 2026-06-17 | Unit and SSR render tests | Use for reciprocal helper tests, collaboration-link helper tests, and route rendering tests. [VERIFIED: package.json] [VERIFIED: npm registry] [VERIFIED: src/domain/themes.test.ts] [VERIFIED: tests/theme-detail-route.test.tsx] |
| Playwright + axe | `@playwright/test@1.60.0`, `@axe-core/playwright@4.11.3`; local Playwright CLI `1.60.0` | Browser release checks | Use for representative dark desktop/mobile, axe, keyboard, and reduced-motion checks after UI changes. [VERIFIED: package.json] [VERIFIED: `bunx playwright --version`] [VERIFIED: tests/browser-release.playwright.ts] |
| Biome | `@biomejs/biome@2.4.15`; npm latest checked as `2.5.0` on 2026-06-17 | Formatting and linting | Use existing `bun run format:check`, `bun run check`, and aggregate `bun run verify` paths. [VERIFIED: package.json] [VERIFIED: npm registry] |
| Static verification scripts | Repo-owned TypeScript scripts | Generated HTML checks | Update expected route text for collaboration and reciprocal theme panels; keep metadata and JSON-LD assertions for Phase 22. [VERIFIED: scripts/verify-static/expected-route-text.ts] [VERIFIED: scripts/verify-static/run-static-verification.ts] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|---|---|---|
| Pure helpers in `src/domain/themes.ts` | Inline `.filter()` calls in route components | Inline filtering would violate the locked helper-derived graph decision and make leakage tests harder. [VERIFIED: 21-CONTEXT.md] [VERIFIED: standards/core/architecture.md] |
| Existing project/profile/GitHub data | New URL fields on theme records | New URL fields would create unreviewed link sources and duplicate authoritative project/profile data. [VERIFIED: 21-CONTEXT.md] [VERIFIED: src/domain/projects.ts] [VERIFIED: src/domain/profile.ts] |
| Current dark-primary classes | New card system or UI library | New visual primitives would add design-system churn and risk nested-card noise. [VERIFIED: AGENTS.md] [VERIFIED: src/styles/app.css] |
| Existing tests and static verifier | New test framework | Existing Vitest, static verifier, Playwright, and axe coverage already match the phase. [VERIFIED: package.json] [VERIFIED: tests/browser-release.playwright.ts] |

**Installation:**

No new package install is recommended for Phase 21. [VERIFIED: package.json] If local verification fails because Bun `1.3.9` is older than the pinned `bun@1.3.14`, resolve the toolchain mismatch before aggregate verification rather than changing project dependencies. [VERIFIED: package.json] [VERIFIED: `bun --version`]

**Version verification:**

Registry checks were run with `npm view ... version time.modified --json` on 2026-06-17. [VERIFIED: npm registry] Current registry versions matched the pinned versions for `@solidjs/start`, `solid-js`, `@solidjs/router`, `@solidjs/meta`, `@axe-core/playwright`, `typescript`, and `vinxi`; registry versions were newer than pins for `vitest`, `@playwright/test`, `@biomejs/biome`, and `tailwindcss`. [VERIFIED: npm registry] Do not upgrade those packages as part of Phase 21 because the phase scope is behavior/UI wiring, not dependency maintenance. [VERIFIED: 21-CONTEXT.md]

## Architecture Patterns

### Recommended Project Structure

```text
src/
+-- domain/
|   +-- themes.ts              # Add reciprocal public-theme helpers and optional collaboration action assembly.
|   +-- themes.test.ts         # Add focused helper tests.
|   +-- projects.ts            # Use existing project links and project detail paths; do not duplicate content.
|   +-- writing.ts             # Use existing public writing selectors and writing detail paths.
+-- routes/
|   +-- themes/[slug].tsx      # Render collaboration starting-point panel.
|   +-- projects/[slug].tsx    # Render secondary related-theme panel.
|   +-- writing/[slug].tsx     # Render related-theme panel after body and related projects.
tests/
+-- theme-detail-route.test.tsx # Extend or add sibling SSR route tests for project/writing detail links.
scripts/verify-static/
+-- expected-route-text.ts      # Add generated HTML expected text for Phase 21 panels only.
```

This structure follows the existing domain-helper and thin-route pattern. [VERIFIED: src/domain/themes.ts] [VERIFIED: src/routes/themes/[slug].tsx] [VERIFIED: scripts/verify-static/expected-route-text.ts]

### Pattern 1: Reciprocal Public-Theme Helpers

**What:** Add helpers that accept a project-like or writing-like object and return public theme entries whose slug relationships include that record. [VERIFIED: 21-CONTEXT.md]

**When to use:** Project and writing detail routes need small secondary theme panels without knowing how themes are filtered, sorted, or hidden. [VERIFIED: src/routes/projects/[slug].tsx] [VERIFIED: src/routes/writing/[slug].tsx]

**Example:**

```ts
// Source: existing src/domain/themes.ts helper style.
export function publicThemeEntriesForProject(
  project: Pick<ProjectDetailPageProject, "slug">,
  themes: readonly ThemeRecord[] = curatedThemes,
): readonly PublicThemeEntry[] {
  return publicThemeEntries(themes).filter((theme) =>
    theme.relatedProjectSlugs.includes(project.slug),
  );
}

export function publicThemeEntriesForWritingEntry(
  entry: Pick<PublicWritingEntry, "slug">,
  themes: readonly ThemeRecord[] = curatedThemes,
): readonly PublicThemeEntry[] {
  return publicThemeEntries(themes).filter((theme) =>
    theme.relatedWritingSlugs.includes(entry.slug),
  );
}
```

The helpers should call `publicThemeEntries()` so draft, hidden, unsupported, and archived themes are filtered out and display order is preserved. [VERIFIED: src/domain/themes.ts] [VERIFIED: src/domain/themes.test.ts]

### Pattern 2: Collaboration Action Assembly as Pure Data

**What:** Build a typed list of theme collaboration actions from a public theme, related selected projects, related public writing, existing project links, optional GitHub homepage links, and existing profile/contact data. [VERIFIED: 21-CONTEXT.md] [VERIFIED: src/domain/github-metadata.ts] [VERIFIED: src/domain/profile.ts]

**When to use:** Theme detail UI needs one compact panel with destination-specific links while keeping route JSX simple and testable. [VERIFIED: src/routes/themes/[slug].tsx]

**Example:**

```ts
type ThemeCollaborationAction = {
  label: "Project story" | "Source" | "Live surface" | "Read note" | "Read essay" | "Contact path";
  href: string;
  external: boolean;
  maybeRel?: string;
};

export function collaborationActionsForTheme(
  theme: PublicThemeEntry,
): readonly ThemeCollaborationAction[] {
  const projects = relatedProjectDetailPageProjectsForTheme(theme);
  const writing = relatedWritingEntriesForTheme(theme);

  return [
    ...projects.map((project) => ({
      label: "Project story" as const,
      href: projectDetailPath(project),
      external: false,
    })),
    ...projects.flatMap(projectCollaborationLinks),
    ...writing.map((entry) => ({
      label: entry.kind === "note" ? ("Read note" as const) : ("Read essay" as const),
      href: writingDetailPath(entry),
      external: false,
    })),
  ];
}
```

The exact helper name is discretionary, but it should remain data-in/data-out and covered by focused tests. [VERIFIED: 21-CONTEXT.md] [VERIFIED: standards/languages/typescript-javascript.md]

### Pattern 3: Route Components Render, They Do Not Decide

**What:** Route components should retrieve one selected record, call domain helpers, and render semantic sections with Solid `<Show>` and `<For>`. [VERIFIED: src/routes/themes/[slug].tsx] [CITED: https://docs.solidjs.com/concepts/control-flow/conditional-rendering] [CITED: https://docs.solidjs.com/concepts/control-flow/list-rendering]

**When to use:** All Phase 21 panels live on existing detail routes and should avoid route-local filtering or relationship logic. [VERIFIED: 21-CONTEXT.md]

**Example:**

```tsx
function RelatedThemesPanel(props: { themes: readonly PublicThemeEntry[] }) {
  return (
    <Show when={props.themes.length > 0}>
      <section class="project-detail-panel visual-surface" aria-labelledby="related-themes">
        <h2 id="related-themes" class="card-title">Related themes</h2>
        <div class="link-list">
          <For each={props.themes}>
            {(theme) => (
              <a class="text-link surface-link" href={themeDetailPath(theme)}>
                {theme.title}
              </a>
            )}
          </For>
        </div>
      </section>
    </Show>
  );
}
```

Use unique heading IDs per route/panel to avoid duplicate `aria-labelledby` targets as panels are added. [VERIFIED: src/routes/projects/[slug].tsx] [VERIFIED: src/routes/writing/[slug].tsx]

### Anti-Patterns to Avoid

- **Filtering themes inside route JSX:** This hides business rules in the shell and bypasses helper tests. [VERIFIED: standards/core/architecture.md] [VERIFIED: 21-CONTEXT.md]
- **Adding theme URL fields:** Theme records should stay slug relationships over authoritative project and writing registries. [VERIFIED: 21-CONTEXT.md] [VERIFIED: src/domain/themes.ts]
- **Promoting OpenLinks as the default theme CTA:** Existing footer/about/contact/profile placements already make OpenLinks discoverable. [VERIFIED: src/components/SiteLayout.tsx] [VERIFIED: src/routes/about.tsx] [VERIFIED: src/routes/contact.tsx] [VERIFIED: openlinks-identity-presence/references/surface-patterns.md]
- **Adding Phase 22/23 assertions:** Metadata, JSON-LD, sitemap, social preview, release labels, and broader release-contract work are explicitly deferred. [VERIFIED: 21-CONTEXT.md] [VERIFIED: .planning/ROADMAP.md]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---|---|---|---|
| Relationship graph | Graph store, tag cloud, search/filter index, route-local filters | `curatedThemes` plus pure helpers | Public filtering and display order are already centralized in `publicThemeEntries()`. [VERIFIED: src/domain/themes.ts] |
| Project source/live links | New theme-level URLs or link reachability checks | `ProjectStory.links`, `projectLinkDisplayLabel()`, and `maybeGitHubHomepageLinkForProject()` | Existing helpers use reviewed project links and avoid duplicate homepage links. [VERIFIED: src/domain/projects.ts] [VERIFIED: src/domain/github-metadata.ts] |
| Contact/identity fallback | New hard-coded OpenLinks CTA on every theme | Existing footer/about/contact/profile data; internal `/contact` path only when useful | OpenLinks is already discoverable and should remain secondary. [VERIFIED: src/components/SiteLayout.tsx] [VERIFIED: src/domain/profile.ts] [VERIFIED: 21-CONTEXT.md] |
| UI primitives | New card system, modal, carousel, or nested-card pattern | `project-detail-panel`, `visual-surface`, `link-list`, `surface-link`, `chip`, `tier-pill` | Existing CSS already handles dark surfaces, focus rings, responsive wrapping, reduced motion, and 8px radii. [VERIFIED: src/styles/app.css] |
| Static generated checks | New browser-only assertions for all content | Extend `scripts/verify-static/expected-route-text.ts` for generated HTML content | The static verifier already checks prerendered body text before hydration for each route. [VERIFIED: scripts/verify-static/expected-route-text.ts] [VERIFIED: scripts/verify-static/route-html-verifier.ts] |

**Key insight:** Phase 21 is a graph projection problem over checked-in typed registries, not a data-ingestion or link-discovery problem. [VERIFIED: .planning/REQUIREMENTS.md] [VERIFIED: src/domain/themes.ts]

## Common Pitfalls

### Pitfall 1: Hidden Theme Leakage

**What goes wrong:** Reciprocal project or writing theme links accidentally include draft, hidden, unsupported, or archived theme records. [VERIFIED: 21-CONTEXT.md]

**Why it happens:** Helpers filter `curatedThemes` directly instead of calling `publicThemeEntries()`. [VERIFIED: src/domain/themes.ts]

**How to avoid:** Implement reciprocal helpers in terms of `publicThemeEntries(themes)` and test draft, hidden, unsupported, archived, and missing-reference cases. [VERIFIED: src/domain/themes.test.ts]

**Warning signs:** Tests mention `curatedThemes.filter` in route components or expected output contains non-public fixture slugs. [VERIFIED: tests/theme-detail-route.test.tsx]

### Pitfall 2: Duplicating Project or Writing Copy in Themes

**What goes wrong:** Theme collaboration UI repeats long project or writing descriptions, making project/writing registries non-authoritative. [VERIFIED: 21-CONTEXT.md]

**Why it happens:** Collaboration actions are authored as new copy instead of resolving `ProjectStory` and `PublicWritingEntry` records. [VERIFIED: src/domain/projects.ts] [VERIFIED: src/domain/writing.ts]

**How to avoid:** Use project `name`, `oneLine`, `links`, and writing `title`, `summary`, `kind`; keep theme-only copy limited to `collaborationAngle`. [VERIFIED: src/domain/themes.ts] [VERIFIED: src/domain/projects.ts] [VERIFIED: src/domain/writing.ts]

**Warning signs:** New fields appear on `ThemeRecord` for URLs, project titles, writing titles, or duplicated summaries. [VERIFIED: src/domain/themes.ts]

### Pitfall 3: OpenLinks CTA Creep

**What goes wrong:** OpenLinks becomes a prominent repeated CTA across every theme panel. [VERIFIED: 21-CONTEXT.md]

**Why it happens:** "collaboration" gets treated as identity promotion instead of project/source/writing entry points. [VERIFIED: openlinks-identity-presence/references/surface-patterns.md]

**How to avoid:** Prefer project story, source/live, and writing actions first; rely on existing footer/about/contact/profile OpenLinks placement unless a specific theme naturally references OpenLinks as a project. [VERIFIED: src/components/SiteLayout.tsx] [VERIFIED: src/routes/about.tsx] [VERIFIED: src/routes/contact.tsx] [VERIFIED: src/domain/themes.ts]

**Warning signs:** Generic theme panels contain `OpenLinks profile` as a primary or repeated link. [VERIFIED: tests/theme-detail-route.test.tsx]

### Pitfall 4: External Link Safety Regression

**What goes wrong:** New external source/live links open with `target="_blank"` but omit `rel="noopener noreferrer"` or `rel="me noopener noreferrer"` where identity semantics apply. [CITED: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/noopener]

**Why it happens:** Collaboration action rendering treats external and internal links identically. [VERIFIED: src/routes/projects/[slug].tsx]

**How to avoid:** Carry `external` and `maybeRel` on action data or derive rel/target in one render helper; preserve `me` only for identity links from profile data. [VERIFIED: src/domain/profile.ts] [VERIFIED: src/routes/contact.tsx]

**Warning signs:** New JSX contains `target="_blank"` without `rel`, or hard-coded OpenLinks rel semantics outside profile/identity paths. [VERIFIED: src/routes/projects/[slug].tsx] [VERIFIED: src/domain/profile.ts]

### Pitfall 5: Verification Scope Creep

**What goes wrong:** Phase 21 tests start asserting theme metadata, JSON-LD, sitemap behavior, release evidence labels, or live URL reachability. [VERIFIED: 21-CONTEXT.md]

**Why it happens:** Static verification already contains metadata and sitemap modules, so it is easy to modify adjacent Phase 22/23 areas while adding expected text. [VERIFIED: scripts/verify-static/run-static-verification.ts] [VERIFIED: scripts/verify-static/metadata-jsonld-verifier.ts]

**How to avoid:** Update route text/static body expectations only for collaboration and cross-link content; leave metadata, JSON-LD, sitemap, and release contract expansion to later phases. [VERIFIED: .planning/ROADMAP.md]

**Warning signs:** Phase 21 diff changes `metadata-jsonld-verifier.ts`, sitemap logic, social image logic, or release-readiness evidence labels. [VERIFIED: 21-CONTEXT.md]

## Code Examples

### Focused Helper Test

```ts
it("returns only public themes for a project in display order", () => {
  // Arrange
  const themes = [
    makeThemeRecord({ slug: "draft-theme", status: "draft", displayOrder: 1 }),
    makeThemeRecord({ slug: "public-later", status: "public", displayOrder: 30 }),
    makeThemeRecord({ slug: "public-earlier", status: "public", displayOrder: 20 }),
    makeThemeRecord({ slug: "hidden-theme", status: "hidden", displayOrder: 10 }),
  ];
  const project = { slug: "openlinks" } as ProjectDetailPageProject;

  // Act
  const slugs = publicThemeEntriesForProject(project, themes).map((theme) => theme.slug);

  // Assert
  expect(slugs).toEqual(["public-earlier", "public-later"]);
});
```

This follows the existing `themes.test.ts` Arrange, Act, Assert style. [VERIFIED: src/domain/themes.test.ts] [VERIFIED: standards/core/testing.md]

### SSR Route Rendering Test

```ts
it("renders related theme links on a selected project detail route", () => {
  // Arrange
  mockedSlug = "openlinks";

  // Act
  const html = renderToString(() => ProjectDetail());

  // Assert
  expect(html).toContain("Related themes");
  expect(html).toContain("Open identity");
  expect(html).toContain('href="/themes/open-identity"');
});
```

The existing theme route test already uses `renderToString()` with a mocked router slug; project and writing route tests can use the same pattern if imported safely. [VERIFIED: tests/theme-detail-route.test.tsx]

### Static Expected Text Addition

```ts
export function themeDetailExpectedTexts(theme: PublicThemeEntry): readonly string[] {
  return [
    // existing Phase 20 expected text...
    "Collaboration starting points",
    theme.collaborationAngle,
    ...collaborationActionsForTheme(theme).flatMap((action) => [
      action.label,
      `href="${escapeHtmlAttribute(action.href)}"`,
    ]),
  ];
}
```

Static checks should verify generated body content before hydration while leaving Phase 22 metadata and JSON-LD untouched. [VERIFIED: scripts/verify-static/expected-route-text.ts] [VERIFIED: scripts/verify-static/route-html-verifier.ts] [VERIFIED: 21-CONTEXT.md]

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|---|---|---|---|
| Theme detail pages only showed related project and writing panels. | Phase 21 should add a collaboration starting-point panel and reciprocal related theme panels. | Phase 21 scope, 2026-06-17 | Visitors get clearer paths from themes to project stories, source/live surfaces, writing, and next actions. [VERIFIED: src/routes/themes/[slug].tsx] [VERIFIED: 21-CONTEXT.md] |
| Project and writing pages did not link back to themes. | Add helper-derived related theme links only on selected project detail and public writing detail pages. | Phase 21 scope, 2026-06-17 | Content graph becomes bidirectional without adding theme links to index cards, home cards, or nav. [VERIFIED: 21-CONTEXT.md] |
| Phase 20 static verifier checks theme route content and existing relationships. | Phase 21 should extend expected route text for collaboration/cross-link content only. | Phase 21 planning, 2026-06-17 | Keeps generated-output proof aligned with the actual phase boundary. [VERIFIED: scripts/verify-static/expected-route-text.ts] |

**Deprecated/outdated:**

- Do not use runtime GitHub, token-dependent fetches, live external reachability checks, search/filtering, CMS/admin, dynamic OG, or metadata work for Phase 21. [VERIFIED: .planning/REQUIREMENTS.md] [VERIFIED: 21-CONTEXT.md]
- Do not use Tailwind 4 migration work for this phase even though the npm registry reports `tailwindcss@4.3.1`; the project is pinned to Tailwind 3.4.19 and Mystic UI setup constraints are already captured. [VERIFIED: package.json] [VERIFIED: npm registry] [VERIFIED: AGENTS.md]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|---|---|---|

All claims in this research were verified against local project files, local command output, npm registry output, or cited official documentation; no `[ASSUMED]` claims are intentionally used. [VERIFIED: research session command output]

## Open Questions (RESOLVED)

1. **RESOLVED: Should every theme panel include an internal Contact path?**
   - What we know: Existing footer/about/contact/profile surfaces already expose OpenLinks and contact/identity paths. [VERIFIED: src/components/SiteLayout.tsx] [VERIFIED: src/routes/about.tsx] [VERIFIED: src/routes/contact.tsx]
   - What's unclear: The context allows a low-intrusion identity/contact fallback "only when useful", but does not require it for every theme. [VERIFIED: 21-CONTEXT.md]
   - Selected answer: Default to no generic OpenLinks link in theme collaboration panels; include an internal `/contact` "Contact path" only if the panel would otherwise lack a practical next action after project/writing/source links. [VERIFIED: openlinks-identity-presence/references/surface-patterns.md] [RESOLVED]

2. **RESOLVED: Should collaboration action assembly live in `themes.ts` or an adjacent module?**
   - What we know: Context explicitly leaves this to planner discretion if the helper remains pure and tested. [VERIFIED: 21-CONTEXT.md]
   - What's unclear: The final helper size may make `themes.ts` crowded if action assembly grows beyond reciprocal lookups. [VERIFIED: src/domain/themes.ts]
   - Selected answer: Start in `src/domain/themes.ts`; split to `src/domain/theme-collaboration.ts` only if the action types/helper tests become meaningfully separate. [VERIFIED: standards/core/code-shape.md] [RESOLVED]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|---|---|---:|---|---|
| Bun | Repo scripts and verification | Yes, but older than package pin | Local `1.3.9`; package pin `1.3.14` | Use existing Bun for planning; upgrade local Bun before final aggregate only if script execution or package-manager checks fail. [VERIFIED: `bun --version`] [VERIFIED: package.json] |
| Node | Tool compatibility and npm registry checks | Yes | `v24.13.0` | None needed. [VERIFIED: `node --version`] |
| node_modules | Local script execution | Yes | Present | If missing/stale during execution, run repo's Bun install path. [VERIFIED: `test -d node_modules`] |
| Playwright | Browser verification | Yes | CLI `1.60.0` | Run `bun run install:browser` if browser binaries are missing. [VERIFIED: `bunx playwright --version`] [VERIFIED: package.json] |
| ripgrep | Codebase search | Yes | `15.1.0` | Use `grep` only if missing. [VERIFIED: `rg --version`] |
| Git | Status/source control awareness | Yes | `2.53.0` | None needed; orchestrator will handle commits. [VERIFIED: `git --version`] |

**Missing dependencies with no fallback:**

- None found. [VERIFIED: environment audit commands]

**Missing dependencies with fallback:**

- Bun version mismatch only; local Bun is available but older than `packageManager`. [VERIFIED: `bun --version`] [VERIFIED: package.json]

## Security Domain

ASVS is enabled by default because `.planning/config.json` does not set `security_enforcement: false`. [VERIFIED: .planning/config.json] OWASP ASVS latest stable version is 5.0.0 dated May 2025, and ASVS defines security requirements for web applications and services. [CITED: https://github.com/OWASP/ASVS]

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---|---:|---|
| V2 Authentication | No | Phase 21 does not add authentication, accounts, or credentials. [VERIFIED: 21-CONTEXT.md] [VERIFIED: src/routes/themes/[slug].tsx] |
| V3 Session Management | No | Phase 21 does not add sessions, cookies, or authenticated state. [VERIFIED: 21-CONTEXT.md] |
| V4 Access Control | Limited | Use public selectors so hidden/draft/unsupported/archived theme data cannot appear on public project/writing/theme surfaces. [VERIFIED: src/domain/themes.ts] [VERIFIED: src/domain/themes.test.ts] |
| V5 Input Validation / ASVS 5.0 Encoding and Sanitization | Yes | Route params should continue through `maybe...BySlug` helpers; JSX text rendering should stay as text content; do not introduce raw HTML or untrusted URL sources. [VERIFIED: src/routes/themes/[slug].tsx] [VERIFIED: src/routes/projects/[slug].tsx] [VERIFIED: src/routes/writing/[slug].tsx] [CITED: https://github.com/OWASP/ASVS] |
| V6 Cryptography | No | Phase 21 does not add cryptography, secrets, or key handling. [VERIFIED: 21-CONTEXT.md] |

### Known Threat Patterns for SolidStart Static Cross-Links

| Pattern | STRIDE | Standard Mitigation |
|---|---|---|
| Draft/hidden content disclosure through reciprocal links | Information Disclosure | Derive links from `publicThemeEntries()` and public project/writing selectors only. [VERIFIED: src/domain/themes.ts] [VERIFIED: src/domain/projects.ts] [VERIFIED: src/domain/writing.ts] |
| Tabnabbing through external source/live links | Spoofing / Tampering | Add `rel="noopener noreferrer"` for external `target="_blank"` links; keep `rel="me noopener noreferrer"` only for identity links. [CITED: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/noopener] [VERIFIED: src/domain/profile.ts] |
| Runtime token/API leakage | Information Disclosure | Do not add runtime GitHub/API fetches; use checked-in metadata snapshot helpers only. [VERIFIED: .planning/REQUIREMENTS.md] [VERIFIED: src/domain/github-metadata.ts] [VERIFIED: scripts/verify-no-github-runtime.ts] |
| XSS through authored content rendering | Tampering | Render curated strings through JSX text nodes and avoid `innerHTML` or parser pipelines. [VERIFIED: src/routes/themes/[slug].tsx] [VERIFIED: src/routes/writing/[slug].tsx] [VERIFIED: .planning/REQUIREMENTS.md] |

## Sources

### Primary (HIGH confidence)

- `.planning/phases/21-collaboration-pathways-and-cross-links/21-CONTEXT.md` - locked decisions, discretion areas, deferred ideas, code context, and phase boundary. [VERIFIED: file read]
- `.planning/REQUIREMENTS.md` - SYNTH-02, SYNTH-03, COLLAB-01, COLLAB-02, COLLAB-03, and out-of-scope exclusions. [VERIFIED: file read]
- `.planning/ROADMAP.md` - Phase 21 success criteria and later Phase 22/23 boundaries. [VERIFIED: file read]
- `.planning/STATE.md` - Phase continuity and Phase 20 completion context. [VERIFIED: file read]
- `AGENTS.md`, `AGENTS.bright-builds.md`, `standards-overrides.md`, and `standards/` pages - repo constraints, dark-primary guidance, OpenLinks default, architecture, code shape, testing, verification, and TS/JS rules. [VERIFIED: file read]
- `src/domain/themes.ts`, `src/domain/projects.ts`, `src/domain/writing.ts`, `src/domain/github-metadata.ts`, `src/domain/profile.ts` - current typed registries and helper contracts. [VERIFIED: file read]
- `src/routes/themes/[slug].tsx`, `src/routes/projects/[slug].tsx`, `src/routes/writing/[slug].tsx`, `src/components/SiteLayout.tsx`, `src/routes/about.tsx`, `src/routes/contact.tsx`, `src/styles/app.css` - current UI and OpenLinks placement patterns. [VERIFIED: file read]
- `src/domain/themes.test.ts`, `tests/theme-detail-route.test.tsx`, `tests/browser-release.playwright.ts`, `scripts/verify-static/expected-route-text.ts`, `scripts/verify-static/route-html-verifier.ts` - existing test and generated-output verification patterns. [VERIFIED: file read]
- `package.json` plus npm registry checks for core dependencies - pinned versions and current registry versions. [VERIFIED: package.json] [VERIFIED: npm registry]
- OpenLinks identity-presence skill files - low-intrusion identity placement and visible-link-first guidance. [VERIFIED: openlinks-identity-presence SKILL.md] [VERIFIED: openlinks-identity-presence/references/surface-patterns.md]
- SolidJS official docs for `<Show>` and `<For>` control flow. [CITED: https://docs.solidjs.com/concepts/control-flow/conditional-rendering] [CITED: https://docs.solidjs.com/concepts/control-flow/list-rendering]
- OWASP ASVS official repository and MDN `rel="noopener"` documentation. [CITED: https://github.com/OWASP/ASVS] [CITED: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/noopener]

### Secondary (MEDIUM confidence)

- None. [VERIFIED: research source review]

### Tertiary (LOW confidence)

- None. [VERIFIED: research source review]

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - Current pins and package scripts are verified in `package.json`, registry versions were checked, and no new dependencies are required. [VERIFIED: package.json] [VERIFIED: npm registry]
- Architecture: HIGH - Locked decisions, existing domain helpers, route files, and standards all point to pure helper-derived relationships and thin route rendering. [VERIFIED: 21-CONTEXT.md] [VERIFIED: standards/core/architecture.md] [VERIFIED: src/domain/themes.ts]
- Pitfalls: HIGH - Pitfalls map directly to locked exclusions, existing verification guards, OpenLinks guidance, and current route/test patterns. [VERIFIED: 21-CONTEXT.md] [VERIFIED: scripts/verify-no-github-runtime.ts] [VERIFIED: openlinks-identity-presence/references/surface-patterns.md]

**Research date:** 2026-06-17
**Valid until:** 2026-07-17 for codebase architecture; dependency version observations should be rechecked after 2026-06-24 because registry/tool versions are fast-moving. [VERIFIED: npm registry]
