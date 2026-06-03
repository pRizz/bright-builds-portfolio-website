# Domain Pitfalls: v1.3 Writing & Notes Surface

**Project:** Bright Builds Portfolio Website
**Domain:** Curated static writing and notes routes in an existing SolidStart static portfolio
**Researched:** 2026-06-03
**Overall confidence:** HIGH for repo integration risks; MEDIUM for exact phase names because the roadmap has not been written yet.

## Context

v1.3 is not a greenfield blog. It adds a curated writing surface to a portfolio that already has typed project data, deterministic project route helpers, static metadata helpers, sitemap generation, browser release checks, and a clean-builder gate of `bun run install:browser && bun run verify`.

The safest roadmap shape is the same one that worked in v1.2: first build the typed domain and route helper surface, then render the UI, then wire metadata/link graph/structured data, then expand release verification and documentation. Most hazards come from adding writing as a parallel mini-system instead of extending the existing helper-driven static architecture.

## Critical Pitfalls

### Pitfall 1: Content Drift From Split Writing Sources

**Recommended phase:** v1.3 Phase 1 - Writing Domain Foundation

**What goes wrong:** Note titles, summaries, slugs, dates, body copy, related projects, route metadata, sitemap entries, and verifier expectations get stored in separate places. A note can render while its canonical URL, JSON-LD, sitemap entry, or related project links are stale.

**Why it happens:** The implementation starts with route components or ad hoc Markdown pages before defining a typed checked-in writing registry and supported selectors.

**Consequences:** Roadmap requirements become hard to verify, content maintenance becomes brittle, and release checks either miss drift or lock onto duplicated exact text.

**Warning signs:**

- Manual `/writing/...` arrays appear in route files, SEO helpers, browser tests, release docs, or verifiers.
- Route components define their own note title, description, or related project links.
- Writing content can be edited without TypeScript seeing missing slugs, empty summaries, or invalid related projects.
- Draft or placeholder notes can reach `prerenderRoutes`.

**Prevention:**

- Add one typed checked-in writing registry, likely `src/domain/writing.ts`, with curated published entries only exposed through selectors.
- Encode required fields in types: slug, title, summary, published date, note kind, body/sections, tags/themes, and related project slugs.
- Keep draft or hidden states unrepresentable in public selectors, or explicitly filtered by a selector such as `publishedWritingEntries()`.
- Derive `/writing` index content, `/writing/{slug}` route params, metadata, JSON-LD, sitemap coverage, and verifier expectations from the same helpers.

**Detection:**

- Unit tests fail when a related project slug does not resolve or when a published note lacks required content.
- Static verification fails when a generated writing route does not contain its registry title/summary before hydration.
- Code review finds only one source of truth for each published writing entry.

### Pitfall 2: Route Duplication and Prerender Holes

**Recommended phase:** v1.3 Phase 1 - Writing Domain Foundation

**What goes wrong:** `/writing` exists but individual note pages are not prerendered, or verifiers check a different set of routes than SolidStart emits. Internal links can point to pages that are absent from `.output/public`.

**Why it happens:** The current route source of truth is `prerenderRoutes` in `src/domain/routes.ts`, backed by project helpers. Writing routes will drift if they are bolted on through local arrays in tests, route components, or release docs.

**Consequences:** The static artifact can pass partial checks while missing note HTML, sitemap entries, or browser coverage for `/writing/{slug}`.

**Warning signs:**

- A helper such as `writingDetailRoutes()` does not exist before route components are added.
- `routeByPath()` silently falls back to home for `/writing`.
- `app.config.ts`, `scripts/verify-static.ts`, and `tests/browser-release.playwright.ts` each build their own writing route list.
- The sitemap includes `/writing` but not each selected note route.

**Prevention:**

- Introduce route helpers such as `writingIndexPath`, `writingDetailPath(entry)`, `writingDetailRoutes()`, and `maybeWritingEntryBySlug()`.
- Add the writing index and detail routes to `prerenderRoutes` through those helpers.
- Make static verification read the same route helpers instead of enumerating notes manually.
- Keep project links using `projectStoryHref()` and writing links using the new writing helper boundary.

**Detection:**

- `bun run build && bun run verify:static` proves `.output/public/writing/index.html` and every selected note HTML file exists.
- `bun run verify:release` internal-link checks fail on missing note routes or anchors.
- Sitemap equality checks derive from `sitemapXml(prerenderRoutes)`.

### Pitfall 3: SEO, JSON-LD, and Sitemap Mismatch

**Recommended phase:** v1.3 Phase 3 - Writing Metadata and Structured Data

**What goes wrong:** Writing routes render visible content but reuse generic route metadata, omit article structured data, use the wrong canonical URL, or diverge from sitemap coverage.

**Why it happens:** `src/domain/seo.ts` already has separate pure helpers for top-level routes and project detail routes. Writing needs the same treatment rather than reusing `metadataForRoute()` or embedding metadata in route components.

**Consequences:** Sharing previews and search metadata become weaker than the visible page, and release evidence can overstate static SEO coverage.

**Warning signs:**

- `/writing/{slug}` uses the same title or description as `/writing`.
- JSON-LD checks only assert that some `application/ld+json` script exists.
- Sitemap checks list writing routes separately from canonical metadata helpers.
- Release docs claim writing metadata coverage before `verify:static` proves it.

**Prevention:**

- Add pure helpers such as `metadataForWritingEntry()`, `writingJsonLd()`, and, if useful, `writingItemListJsonLd()`.
- Keep canonical URLs, Open Graph, Twitter metadata, JSON-LD URL fields, and sitemap paths derived from the same writing route helpers.
- Prefer the existing static social preview fallback unless the milestone explicitly adds checked-in raster writing images; do not add dynamic OG/server rendering.
- In static verification, assert helper-derived metadata and parse or compare JSON-LD content for each writing route.

**Detection:**

- Unit tests cover writing metadata helper output for the index and at least one detail note.
- `verify:static` fails if a writing route lacks route-specific title, description, canonical, OG/Twitter tags, JSON-LD, or sitemap coverage.
- Release-readiness docs name only the exact automated coverage that exists.

### Pitfall 4: Broken Project and Note Link Integrity

**Recommended phase:** v1.3 Phase 1 for relationship invariants; v1.3 Phase 2 for rendered navigation

**What goes wrong:** Notes point to hidden or nonexistent projects, project pages list notes that do not exist, or project-to-note and note-to-project links disagree.

**Why it happens:** Bidirectional relationships are tempting to store on both sides. That makes drift likely unless one side is authoritative and the other is derived.

**Consequences:** Visitors cannot move cleanly between thinking and work, internal link checks become noisy, and hidden/excluded project records can leak through writing content.

**Warning signs:**

- Projects gain raw `relatedWritingSlugs` while notes also carry raw `relatedProjectSlugs` with no consistency test.
- UI maps project slugs to `/projects#slug` manually instead of using `projectStoryHref()`.
- Writing links use `ProjectLinkKind: "article"` for local notes even though note routes have their own registry.
- Internal link verifier failures are fixed by weakening link checks.

**Prevention:**

- Make one side authoritative, preferably note entries with `relatedProjectSlugs`, then derive project-to-note lists with a helper.
- Validate every related project slug against `publicProjectIndexProjects()` unless there is an explicit reviewed reason to allow a hidden record.
- Render project destinations with `projectStoryHref()` so selected project detail pages and project-index anchors keep the v1.2 behavior.
- Add unit tests for note-to-project and project-to-note helper behavior, including a project with no notes.

**Detection:**

- Unit tests fail for unresolved, hidden, duplicate, or self-contradictory relationships.
- `verify:release` fails on missing internal note/project routes or anchors.
- Browser keyboard checks can reach `/writing`, at least one note, a related project, and back.

### Pitfall 5: Accidental Runtime Dependencies or Server Assumptions

**Recommended phase:** v1.3 Phase 1 for data shape; v1.3 Phase 3 for metadata; v1.3 Phase 4 for guards

**What goes wrong:** Writing introduces runtime `fetch`, filesystem reads in visitor paths, GitHub/API usage, public tokens, server-only SolidStart behavior, remote images, or dynamic OG endpoints.

**Why it happens:** Blog-style implementations often reach for Markdown loaders, CMS clients, dynamic image generation, or runtime content APIs. This project explicitly targets static output with curated checked-in content and no visitor-runtime API calls.

**Consequences:** Static deploy assumptions weaken, Cloudflare Pages output can depend on server behavior, release builds can leak token-like data, and the no-runtime-GitHub contract regresses.

**Warning signs:**

- Route components or domain modules import `node:fs`, `node:path`, `@octokit/*`, or remote content clients.
- Writing pages call `fetch()` for note content, repo data, images, or social previews.
- New API routes or server functions appear just to serve notes or OG images.
- Public environment variable prefixes such as `VITE_`, `PUBLIC_`, or `SOLID_PUBLIC_` are used for content or GitHub data.
- Built HTML contains remote `<img src>` or CSS `url(https://...)`.

**Prevention:**

- Keep published writing as checked-in TypeScript data or static assets consumed through pure domain helpers.
- Keep filesystem work, if any, inside build/script-only paths and outside visitor-rendered domain modules.
- Preserve `verify:no-github-runtime`, forbidden built-output scans, token redaction, and remote visual asset checks.
- Do not add dynamic OG/server rendering in v1.3; reuse the checked-in social preview fallback unless static generated assets become a separate scoped phase.

**Detection:**

- `bun run verify:no-github-runtime` and `bun run verify:release` fail on visitor-runtime GitHub/API/token patterns.
- Static output verification fails on remote runtime visual assets.
- Build output can be served from `.output/public` without a backend.

### Pitfall 6: Dark-Primary Readability and Text Layout Regressions

**Recommended phase:** v1.3 Phase 2 - Writing Routes and UI

**What goes wrong:** Long titles, tags, code snippets, note excerpts, project names, or dense prose overflow on mobile, overlap other elements, or fall back to light-first styling.

**Why it happens:** The existing browser release suite checks route accessibility and obvious dark-layout issues, but writing introduces article-specific surfaces that may include longer text than project cards.

**Consequences:** The site stops feeling polished, dark-primary defaults regress, and accessibility checks can pass while real reading ergonomics are poor.

**Warning signs:**

- Light-first classes such as `bg-white`, `bg-stone-50`, or `text-zinc-950` appear in writing UI without a clear reason.
- Note cards use fixed heights with unconstrained titles or excerpts.
- Article content includes `pre`, `code`, blockquotes, or long URLs that are not covered by layout checks.
- The Playwright layout candidate list is not updated if new article elements need overlap/overflow coverage.

**Prevention:**

- Use dark-first shell, surface, text, link, chip, and focus classes consistent with the existing site.
- Set stable responsive constraints for note cards and article content: readable max width, wrapping for long words/links, scroll or wrap behavior for code-like content, and no nested cards.
- Include a representative long-title/long-link note in test data or fixtures.
- Ensure `/writing` and representative `/writing/{slug}` routes are in `prerenderRoutes` so axe, desktop layout, mobile layout, keyboard, and reduced-motion checks include them.

**Detection:**

- `bun run verify:browser` covers writing routes on desktop, mobile, and reduced-motion projects.
- Layout checks fail on horizontal overflow or obvious overlap.
- Manual review of generated dark pages confirms readable prose, visible focus states, and no text collisions.

### Pitfall 7: Release Overclaiming

**Recommended phase:** v1.3 Phase 4 - Writing Release Coverage

**What goes wrong:** Release docs or evidence labels claim writing route coverage, live link checking, hosted audits, or exhaustive browser behavior that the automation does not actually prove.

**Why it happens:** v1.2 added explicit project-detail release labels and exact release-readiness facts. Copying that language for writing before adding the matching checks would make the release contract less honest.

**Consequences:** The roadmap may mark requirements complete without evidence, and future audits can pass prose that is disconnected from the actual gates.

**Warning signs:**

- `docs/release-readiness.md` says "writing route coverage" but `scripts/release-readiness.ts` does not require that fact.
- Evidence labels mention writing while Playwright only checks project routes.
- Preview or production smoke paths still name only `/projects/openlinks`.
- Documentation implies local checks crawl live third-party writing links.

**Prevention:**

- Update release evidence labels only after static, browser, and release checks actually cover writing.
- Phrase evidence precisely: for example, "writing metadata, JSON-LD, and sitemap coverage" or "representative writing keyboard path" rather than broad hosted claims.
- Keep external link checks policy-based and manual-release, matching the current contract.
- Guard deploy-critical release-readiness facts with focused tests or `releaseReadinessDocumentFindings()`.

**Detection:**

- `bun run verify:release` emits evidence labels that match implemented checks.
- Release-readiness document verification fails if required writing coverage facts are missing after Phase 4.
- Milestone audit can trace every writing release claim to an automated or explicitly manual check.

### Pitfall 8: Verifier Bloat and Brittle Exact-Text Checks

**Recommended phase:** v1.3 Phase 4 - Writing Release Coverage, with groundwork in earlier phases

**What goes wrong:** Writing coverage gets appended to already-large verifier files until maintenance becomes slow and copy edits break unrelated release checks.

**Why it happens:** `scripts/verify-static.ts` is already 870 lines and was flagged in the v1.2 audit as above the Bright Builds file-size refactor trigger. Adding route-specific writing assertions inline will worsen the problem.

**Consequences:** Verification stays technically passing but becomes hard to reason about, and future phases will hesitate to improve checks because every addition touches a large script.

**Warning signs:**

- New writing expected text is added through more route-specific `if (route === ...)` blocks.
- Static verifier copies note titles/summaries instead of reading the writing registry.
- Release-readiness exact-text assertions fail on harmless Markdown formatting changes.
- `verify-static` and `verify-release` both duplicate the same writing coverage logic.

**Prevention:**

- Split verifier logic by concern when writing coverage expands the file: route HTML, metadata, JSON-LD, assets, writing routes, and project routes are natural boundaries.
- Prefer data-derived assertions from domain helpers over hand-copied expected strings.
- Keep exact-text checks for deploy-critical documentation facts only.
- Add small pure helper tests for writing route/SEO/link behavior so static verification can remain focused on generated output.

**Detection:**

- File-length review stays visible during Phase 4 planning.
- The final diff shows writing verifier additions grouped in named helpers or modules, not one long procedural block.
- Copy-only note edits do not require editing release scripts unless metadata or route behavior changed.

## Moderate Pitfalls

### Pitfall 9: Writing Becomes an Uncurated Content Dump

**Recommended phase:** v1.3 Phase 1 - Writing Domain Foundation

**What goes wrong:** The site mirrors every draft, repo README, old note, or generated artifact instead of presenting a small curated writing surface.

**Warning signs:** Entries lack a curation reason, summary, publication status, or relation to the portfolio themes. The index sorts by whatever was imported rather than deliberate display order or published date.

**Prevention:** Keep v1.3 scoped to a small published set. Require each public note to have original copy, a clear summary, tags/themes, publication date, and optional related projects. Do not add CMS/admin tooling.

### Pitfall 10: Dates and Update Semantics Are Ambiguous

**Recommended phase:** v1.3 Phase 1 - Writing Domain Foundation; v1.3 Phase 3 - Metadata

**What goes wrong:** Published, updated, and reviewed dates drift or are rendered inconsistently between visible UI and JSON-LD.

**Warning signs:** Dates are free-form strings in components, omitted from metadata helpers, or formatted differently per route.

**Prevention:** Store date fields in one typed shape, decide whether `updatedAt` is optional, and expose formatting helpers for UI and structured data.

### Pitfall 11: OpenLinks Identity Becomes Too Prominent

**Recommended phase:** v1.3 Phase 2 - Writing Routes and UI; v1.3 Phase 3 - Metadata

**What goes wrong:** Writing pages repeat OpenLinks promotion in article chrome or note metadata in a way that competes with Bright Builds and the note content.

**Warning signs:** Every note has a prominent OpenLinks CTA, or writing JSON-LD duplicates identity metadata beyond what the existing profile helpers already provide.

**Prevention:** Preserve the current low-intrusion footer/about/profile placement and reuse existing profile `sameAs` helpers where structured data needs creator identity.

## Phase-Specific Warnings

| Recommended v1.3 phase | Likely pitfall | Mitigation |
| --- | --- | --- |
| Phase 1 - Writing Domain Foundation | Content drift, route duplication, invalid relationships, uncurated entries | Create typed registry, route helpers, selectors, relationship validators, and unit tests before UI expansion. |
| Phase 2 - Writing Routes and UI | Dark readability, mobile overflow, keyboard gaps, project/note navigation holes | Render `/writing` and `/writing/{slug}` from helpers; use dark-first responsive article/card patterns; include writing routes in browser coverage. |
| Phase 3 - Writing Metadata and Structured Data | SEO/JSON-LD/canonical/sitemap mismatch; dynamic OG temptation | Add pure writing metadata and JSON-LD helpers; keep static social fallback; verify generated static HTML against helpers. |
| Phase 4 - Writing Release Coverage | Release overclaiming, verifier bloat, accidental runtime dependencies | Extend static/browser/release checks and docs with exact, truthful coverage labels; split verifier concerns if writing additions make scripts harder to maintain. |

## Roadmap Implications

1. Build the writing domain and route helper surface first. It prevents most downstream drift and gives later phases a reliable source of truth.
2. Add UI second, once link destinations and content selectors are stable. This keeps browser checks meaningful and avoids rewriting article links later.
3. Add metadata and structured data after routes and content are stable. This keeps canonical URLs, JSON-LD, and sitemap entries aligned with the final helper names.
4. Expand release coverage last, but plan its shape early. The release phase should prove writing coverage without turning the current verifier scripts into larger catch-all files.

## Sources

- `.planning/PROJECT.md` - v1.3 scope, constraints, active requirements, and release gate.
- `.planning/RETROSPECTIVE.md` - v1.0-v1.2 patterns and lessons around helper-derived routes, static verification, release labels, and verifier growth.
- `.planning/milestones/v1.2-MILESTONE-AUDIT.md` - passed v1.2 integration model and flagged `verify-static` file-size concern.
- `src/domain/projects.ts` - curated project registry, project detail selectors, route helpers, and existing writing-project grouping.
- `src/domain/routes.ts` - current `siteRoutes`, `prerenderRoutes`, navigation routes, and top-level route lookup behavior.
- `src/domain/seo.ts` - current pure metadata, JSON-LD, sitemap, robots, and static social image helpers.
- `scripts/verify-static.ts` - generated HTML, metadata, JSON-LD, sitemap, asset, dark-root, and forbidden residue checks.
- `scripts/verify-release.ts` and `scripts/release-readiness.ts` - release budgets, internal/external link policy, runtime dependency guards, evidence labels, and release-readiness doc checks.
- `tests/browser-release.playwright.ts` - axe, desktop/mobile layout, keyboard, and reduced-motion release coverage pattern.
- `docs/release-readiness.md` - clean-builder release command, static output contract, manual external-link policy, and deploy smoke checklist.
- `AGENTS.md`, `AGENTS.bright-builds.md`, and `standards-overrides.md` - repo-local dark-primary guidance and Bright Builds workflow requirements.
- Bright Builds canonical standards at commit `05f8d7a6c9c2e157ec4f922a05273e72dab97676`: standards index, architecture, code shape, verification, testing, and TypeScript/JavaScript guidance.

## Gaps and Follow-Up Research Flags

- Confirm exact writing content shape during requirements: short notes, essays, external article references, or mixed note kinds may need different type fields.
- Decide whether writing details should use separate routes only, anchors only, or both. The current target says `/writing/{slug}` routes, so roadmap should default to routes.
- Decide whether code snippets are in scope for v1.3. If yes, UI and verifier work should explicitly cover `pre`/`code` overflow and dark styling.
- If Phase 4 touches `scripts/verify-static.ts`, plan a maintenance split rather than treating verifier size as unrelated cleanup.
