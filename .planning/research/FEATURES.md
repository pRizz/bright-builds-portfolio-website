# Feature Research: v1.3 Writing & Notes Surface

**Milestone:** v1.3 Writing & Notes Surface
**Researched:** 2026-06-03
**Scope:** Expected behavior for adding a curated static writing/notes surface to the existing SolidStart portfolio.
**Overall confidence:** HIGH for local integration patterns; MEDIUM for search/discovery conventions.

## Executive Recommendation

Build v1.3 as a small curated writing graph, not a generic blog engine. The first release should add a typed checked-in writing registry, a `/writing` index, static `/writing/{slug}` detail routes, project-to-note and note-to-project links derived from slugs, and the same metadata/sitemap/release verification discipline already proven for project story pages.

Keep the implementation static and repo-owned. Use pure domain helpers for note selection, path derivation, cross-link derivation, metadata, JSON-LD, and sitemap coverage. Route components should only render those helpers. Do not introduce a CMS, MDX pipeline, comments, newsletter tooling, runtime feeds, or dynamic social-image endpoints in v1.3.

## Table Stakes

Features users should expect from the v1.3 writing surface. Missing these would make the surface feel unfinished or weaken the release contract.

| Category | Feature | Why Expected | Complexity | Notes |
| --- | --- | --- | --- | --- |
| Content model | Typed checked-in writing registry | Matches the existing curated project model and keeps authored copy authoritative. | Medium | Prefer `src/domain/writing.ts` with exported selectors, route helpers, and validation-friendly types. |
| Content model | Public/draft/hidden distinction | Prevents unfinished notes from leaking into routes, sitemap, index, or project pages. | Low | Public note routes should be explicit and derived from one selector. |
| Content model | Stable unique slugs and display order/date | Required for deterministic static routes and repeatable sitemap output. | Low | Use lower-case URL slugs; validate duplicates. |
| Content model | Required title, summary, published date, tags/themes, and body blocks | Note cards, metadata, JSON-LD, and static verification all need non-empty authored data. | Medium | Body can be typed sections/blocks; avoid MDX dependency for v1.3. |
| Content model | Related project slugs | Enables bidirectional project/note links without duplicated href strings. | Medium | Reject references to missing, hidden, or excluded projects. |
| Writing index | `/writing` route in top-level navigation | A new top-level surface must be discoverable without knowing the URL. | Low | Add a concise route label such as `Writing`; keep existing dark-primary shell. |
| Writing index | Scannable note cards | Visitors should understand what each note is about before opening it. | Medium | Cards need title, summary, date/updated date when applicable, themes/tags, and related projects. |
| Writing index | Curated positioning copy | The portfolio already says "curated, not mirrored"; writing should make the same promise. | Low | Avoid promising a frequent blog cadence. |
| Writing index | At least one public entry | Empty writing surfaces feel like placeholder content. | Medium | If content is not ready, defer the route rather than shipping an empty index. |
| Note detail routes | Static `/writing/{slug}` pages | Direct links, SEO, and sharing must work before hydration. | Medium | Derive from `writingNoteRoutes()` and include in `prerenderRoutes`. |
| Note detail routes | Readable note layout | A detail page should include H1, summary, date, author, tags/themes, body, and next actions. | Medium | Keep typography dense and readable in dark mode. |
| Note detail routes | Back path to `/writing` | Visitors need a stable way back to the writing index. | Low | Also link to related projects when present. |
| Note detail routes | Safe missing-slug fallback | Hidden/draft/missing notes should not look like broken app state. | Low | Existing project route fallback is a good model. |
| Project cross-links | Note-to-project links | Notes should show what built work they relate to. | Medium | Use `projectStoryHref(project)` so selected projects route to `/projects/{slug}` and unselected public projects route to anchors. |
| Project cross-links | Project-to-note links | Project pages should expose related thinking without manual duplicate lists. | Medium | Derive notes for a project from `relatedProjectSlugs` on public notes. |
| Project cross-links | No links to hidden content | Public pages must not expose hidden project or note slugs. | Low | Add pure tests and curation validation. |
| Metadata/discovery | Route-specific metadata for `/writing` and each note | The existing site treats SEO metadata as a release requirement. | Medium | Titles, descriptions, canonical URLs, OG/Twitter fields, and local social preview fallback. |
| Metadata/discovery | `Blog`/`ItemList` JSON-LD on `/writing` | Search and machines should understand the index as a writing collection. | Medium | Keep it static and derived from public notes. |
| Metadata/discovery | `BlogPosting` JSON-LD on note pages | Notes are authored posts; schema should include headline, author, URL, dates, keywords, and related topics. | Medium | Google supports `Article`, `NewsArticle`, and `BlogPosting`; use `BlogPosting` for this notes surface. |
| Metadata/discovery | Sitemap coverage | Public writing routes must be crawlable and release-verifiable. | Low | Include `/writing` and public note routes; exclude drafts/hidden notes. |
| Verification | Pure unit tests for selectors and helpers | Route, metadata, sitemap, and links should derive from one domain surface. | Medium | Mirror the project detail tests. |
| Verification | Curation validation for notes | Broken content references and empty public notes are content bugs. | Medium | Extend or add a writing-specific verifier. |
| Verification | Static HTML verification before hydration | The release gate should prove note content and metadata exist in `.output/public`. | Medium | Add expected texts for `/writing` and every note route. |
| Verification | Browser release coverage | New routes must pass axe, desktop/mobile dark layout, keyboard reachability, and reduced-motion checks. | Medium | Existing `prerenderRoutes` loop should cover most route checks once writing routes are included. |
| Verification | Release-readiness facts | Release docs and evidence labels should name writing route coverage explicitly. | Low | Add representative writing smoke route and checked document facts. |

## Differentiators

Features that would make this writing surface feel specific to Peter's portfolio rather than a commodity blog.

| Category | Feature | Value Proposition | Complexity | v1.3 Recommendation |
| --- | --- | --- | --- | --- |
| Content model | Notes as project context | Turns writing into connective tissue for AI, Bitcoin, open systems, and tooling projects. | Medium | Build now through `relatedProjectSlugs`. |
| Content model | Authored "why this note exists" framing | Helps readers understand whether a note is a field note, design rationale, technical explainer, or collaboration prompt. | Low | Add a short `context` or `takeaway` field if the first entries need it. |
| Writing index | Theme-forward grouping | Makes a small curated set feel intentional instead of sparse. | Low | Group or label by themes; avoid heavy filters. |
| Note detail routes | Concise project/action panel | Turns reading into a path toward collaboration or source inspection. | Medium | Include related projects and selected external references, if any. |
| Project cross-links | Derived "related writing" panels on project story pages | Gives project pages more depth without bloating the project registry copy. | Medium | Build for selected project detail pages first; defer project-index card note counts unless needed. |
| Metadata/discovery | JSON-LD that ties author identity to OpenLinks/GitHub and related projects | Reinforces the existing identity graph and project graph. | Medium | Build now using existing `personJsonLd()` and note `about` data. |
| Verification | Cross-link integrity tests | Prevents the writing graph from rotting as notes/projects change. | Low | Build now; it is cheap and aligned with current project route tests. |

## Anti-Features

Features to explicitly avoid in v1.3.

| Anti-Feature | Why Avoid | What to Do Instead |
| --- | --- | --- |
| CMS/admin editing | Adds authentication, backend, editorial workflow, and deployment complexity that conflicts with the static portfolio target. | Keep notes as checked-in typed data. |
| MDX/Markdown pipeline | Useful eventually, but adds parser/rendering/dependency surface before the writing content proves it needs rich authoring. | Use typed body blocks for prose, lists, callouts, links, and optional plain code blocks. |
| Dynamic OG image endpoint | Requires server behavior or a build pipeline expansion not needed for v1.3. | Reuse the deterministic local social preview fallback. |
| Comments, likes, reactions, or webmentions | Adds moderation, spam, privacy, and external dependency concerns. | Use contact/project links for collaboration. |
| Newsletter signup | Pulls in third-party forms and product scope unrelated to the static writing launch. | Defer until there is a real publishing cadence. |
| Search, pagination, and tag archive pages | Overbuilt for a small curated note set. | Keep one index with clear cards and theme labels. |
| RSS/Atom feed | Static feeds are possible, but they are not required until there is enough publishing cadence to subscribe to. | Defer; keep sitemap and note metadata correct first. |
| Runtime GitHub/content API calls | Violates the established no visitor-runtime GitHub/content dependency. | Use checked-in content and static snapshots only. |
| Auto-importing every README, issue, gist, or repo note | Reintroduces the raw mirror problem already rejected for projects. | Curate a small set of original notes with authored summaries. |
| Light-mode-first writing templates | Conflicts with repo-local dark-primary guidance. | Use existing dark-first surface, text, link, chip, focus, and layout primitives. |

## Requirement Categories

Use these categories when turning research into roadmap requirements.

### CONTENT: Typed Writing Registry

- Public writing content should live in a repo-owned typed registry, likely `src/domain/writing.ts`.
- Public note records should include at minimum: `slug`, `title`, `summary`, `publishedAt`, optional `updatedAt`, `themes`, `tags`, `status`, `displayOrder` or sort key, `body`, and `relatedProjectSlugs`.
- Body shape should be typed and small. Recommended v1.3 blocks: paragraph, list, callout, link/reference, and optional plain code. Defer full rich text.
- Helper exports should be explicit and tested, mirroring project helpers: `publicWritingNotes()`, `writingNoteRoutes()`, `writingNotePath(note)`, `maybeWritingNoteBySlug(slug)`, `writingNotesForProject(project)`, and a display/sort helper if needed.
- Validation should reject duplicate slugs, duplicate display order if used, empty public fields, invalid dates, empty public body, and related project slugs that cannot render publicly.

### INDEX: `/writing` Index

- `/writing` should be a top-level route with metadata and a navigation entry.
- The first screen should make the surface obvious as Peter's curated writing/notes, not a generic blog archive.
- The index should render before hydration and show cards for all public notes in deterministic order.
- Each card should show title, summary, date/update signal, theme/tag chips, and related project names when present.
- The index should include links to note detail routes, and those hrefs should be derived from writing helpers.
- Do not ship an empty index. If the first curated notes are not ready, the milestone should pause rather than publish placeholder copy.

### NOTE: `/writing/{slug}` Detail Routes

- Each public note needs a stable static route at `/writing/{slug}`.
- Note pages should include H1, summary/dek, date metadata, author identity, body content, tags/themes, related projects, and a path back to `/writing`.
- The body should render readable semantic HTML before hydration.
- Missing, draft, hidden, or invalid slugs should show a friendly "note not found" fallback with a link back to `/writing`.
- Detail pages should keep motion minimal; the reading experience should prioritize text clarity, dark contrast, and mobile layout stability.

### LINKS: Project Cross-Links

- Store cross-links by slug, not by duplicated URL strings.
- Notes should link to related projects using the project helper boundary so selected detail-ready projects go to `/projects/{slug}` and unselected public projects go to `/projects#slug`.
- Selected project detail pages should show a "Related writing" panel when one or more public notes reference the project.
- Public project index cards can stay unchanged in v1.3 unless implementation proves a small "related notes" link is useful without clutter.
- Cross-link integrity should be tested both directions: every note project reference resolves, and every project page panel only contains public notes.

### META: Metadata And Discovery

- Add `/writing` to `siteRoutes` and include writing routes in `prerenderRoutes`.
- Add metadata helpers for the writing index and note pages. Note metadata should use note title, summary, canonical URL, OG/Twitter fields, and the local social preview fallback.
- Add writing JSON-LD helpers. Recommended shapes:
  - `/writing`: `Blog` or `ItemList` for public notes.
  - `/writing/{slug}`: `BlogPosting` with `headline`, `description`, `author`, `datePublished`, optional `dateModified`, `url`, `keywords`, `image`, and `about`.
- Reuse `personJsonLd()` for author identity so GitHub/OpenLinks identity stays consistent.
- Sitemap output should include `/writing` and every public note route, and exclude drafts/hidden notes.
- External reference links inside notes should be HTTPS and covered by release external-link policy if new origins are introduced.

### VERIFY: Static, Browser, And Release Coverage

- Unit tests should cover writing selectors, route paths, missing-slug behavior, cross-link derivation, metadata, JSON-LD serialization, and sitemap inclusion/exclusion.
- Curation verification should check writing registry invariants alongside project curation or in a dedicated `verify:writing` step included by `bun run verify`.
- `scripts/verify-static.ts` should assert pre-hydration body text, metadata, JSON-LD, sitemap output, dark shell, and forbidden runtime/template residue for `/writing` and every public note route.
- `tests/browser-release.playwright.ts` should cover writing routes through `prerenderRoutes`; keyboard release checks should explicitly reach the Writing nav and a representative note route.
- Reduced-motion checks should include either `/writing` or a representative note route if interactive surfaces are present there.
- `docs/release-readiness.md`, release-readiness tests, and evidence labels should name writing route coverage and include a representative `/writing/{slug}` smoke route.
- The release command remains `bun run install:browser && bun run verify` on clean builders.

## MVP Recommendation

Prioritize:

1. **CONTENT:** typed writing registry, validation, and route/cross-link helpers.
2. **INDEX + NOTE:** `/writing` index and static note detail routes rendered from helpers.
3. **LINKS:** derived note-to-project and selected project-to-note panels.
4. **META:** route metadata, `BlogPosting` JSON-LD, sitemap coverage.
5. **VERIFY:** unit, static, browser, and release-readiness coverage in the existing aggregate gate.

Defer:

- RSS/Atom, search, pagination, CMS/admin, comments, newsletter, dynamic OG images, MDX, syntax highlighting beyond plain code blocks, and project-index note-count badges.

## Sources

- Local project context: `.planning/PROJECT.md`, `.planning/MILESTONES.md`, `.planning/RETROSPECTIVE.md`.
- Existing route/domain/test patterns: `src/domain/projects.ts`, `src/domain/routes.ts`, `src/domain/seo.ts`, `src/routes/index.tsx`, `src/routes/projects/index.tsx`, `src/routes/projects/[slug].tsx`, `tests/browser-release.playwright.ts`, `scripts/verify-static.ts`, `scripts/verify-release.ts`, `scripts/release-readiness.ts`.
- Bright Builds standards loaded from pinned commit `05f8d7a6c9c2e157ec4f922a05273e72dab97676`: architecture, verification, testing, and TypeScript/JavaScript guidance.
- SolidStart official docs: route prerendering for static HTML/SSG and route-specific metadata via `@solidjs/meta` (`https://docs.solidjs.com/solid-start/building-your-application/route-prerendering`, `https://docs.solidjs.com/solid-start/building-your-application/head-and-metadata`).
- Google Search Central Article structured data guidance and Schema.org `Blog`/`BlogPosting` vocabulary (`https://developers.google.com/search/docs/appearance/structured-data/article`, `https://schema.org/Blog`, `https://schema.org/BlogPosting`).
