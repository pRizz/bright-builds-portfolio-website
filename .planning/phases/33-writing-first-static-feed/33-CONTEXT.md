---
generated_by: gsd-discuss-phase
lifecycle_mode: yolo
phase_lifecycle_id: 33-2026-07-03T14-09-00
generated_at: 2026-07-03T14:09:00.956Z
---

# Phase 33: Writing-First Static Feed - Context

**Gathered:** 2026-07-03
**Status:** Ready for planning
**Mode:** Yolo

<domain>

## Phase Boundary

Phase 33 publishes a deterministic static writing-first RSS feed at `/feed.xml` and exposes low-intrusion subscription affordances on home and writing surfaces. Feed entries should come from checked-in public writing records, use stable canonical IDs and absolute links, include checked-in dates, public categories, summaries, and deterministic ordering, and exclude draft, hidden, archived, undated, unsupported, or invented project/theme update records.

This phase should not add Atom or JSON Feed companions, topic-specific feeds, newsletter signup, WebSub, webmentions, runtime feed endpoints, dynamic content APIs, CMS/admin behavior, live hosted feed-reader checks, project/theme update records, or milestone-wide evidence label expansion beyond what is required to prove the new feed surface. Those belong to later phases if deliberately scoped.

</domain>

<decisions>

## Implementation Decisions

### Feed Item Model and Eligibility

- **D-01:** Build a small pure feed item model from `publicWritingEntries()` instead of generating feed XML directly from route components or raw curated registries.
- **D-02:** The v1 feed is writing-first only. Include public writing entries with checked-in `maybePublishedOn` or `maybeUpdatedOn`; exclude draft, hidden, archived, undated, unsupported, project-only, theme-only, and invented update records.
- **D-03:** Stable feed IDs should derive from the canonical absolute writing URL or a deterministic tag-style identifier tied to the canonical writing path. Do not use timestamps, build times, array indexes, or generated asset fingerprints as feed IDs.
- **D-04:** Feed ordering should be deterministic by checked-in published/updated date descending, with `displayOrder` and slug as stable tie breakers if needed.
- **D-05:** Feed categories should use safe public labels from writing topics/tags after the canonical topic contract has filtered public eligibility. Do not expose hidden or unsupported discovery labels through feed categories.

### RSS Serialization and Escaping

- **D-06:** Add a repo-owned RSS 2.0 serializer as pure TypeScript, likely in a new `src/domain/feed.ts`, with explicit XML escaping for titles, summaries, links, categories, IDs, and descriptions.
- **D-07:** Feed-level metadata should use the existing profile/site identity: Bright Builds/Peter Ryszkiewicz, the canonical origin from `peterProfile`, a concise writing-focused description, and the canonical feed URL.
- **D-08:** Feed item descriptions should use existing writing summaries by default. Do not serialize full article bodies in v1 unless planning finds that it is trivial and does not bloat or complicate escaping.
- **D-09:** Date output should be derived from checked-in ISO dates and serialized in a feed-reader-compatible UTC format. Invalid dates should fail curation or focused feed tests before static output generation.
- **D-10:** Keep feed generation deterministic and side-effect free at the domain layer; filesystem writes belong in a thin static-output script/build hook.

### Static Output and Build Integration

- **D-11:** Emit `/feed.xml` as a static asset in the built output without adding a runtime endpoint. The implementation can generate `public/feed.xml` before build or copy generated XML into `.output/public/feed.xml`, but the source of truth should remain checked-in writing data and pure helper output.
- **D-12:** Ordinary build or verification should not mutate curated source data. If a generated `public/feed.xml` file is checked in, provide a check mode that fails on drift rather than silently rewriting during verification.
- **D-13:** Extend static verification to assert that `.output/public/feed.xml` exists, is non-empty, includes only public dated writing entries, includes absolute canonical links, and excludes draft/hidden/archived/undated fixtures.
- **D-14:** Extend release verification only as far as needed to prove the local static feed output and absence of runtime feed/content dependencies. Hosted feed-reader validation remains manual smoke work for Phase 36/release docs.

### Autodiscovery and Visible Links

- **D-15:** Add `<link rel="alternate" type="application/rss+xml" ...>` feed autodiscovery metadata to home and writing pages using the shared head pattern where practical.
- **D-16:** Add visible low-intrusion feed links on home and writing surfaces. Prefer compact text/icon link placement near existing page intro, footer-adjacent discovery copy, or writing controls rather than a primary CTA.
- **D-17:** Feed links should keep Bright Builds/projects/writing navigation primary and preserve existing low-intrusion OpenLinks placement. Do not make OpenLinks or feed subscription compete with the main project/story CTAs.
- **D-18:** The visible feed link should use ordinary anchor semantics, dark-primary focus/readability, and mobile-safe wrapping. No custom subscription modal or JavaScript-only interaction is in scope.

### Verification Strategy

- **D-19:** Plan 33-01 should focus on pure feed item derivation, RSS serialization, XML escaping, ordering, eligibility, date handling, and unit tests.
- **D-20:** Plan 33-02 should wire static `/feed.xml` output, home/writing autodiscovery metadata, visible feed links, static verification, and any focused browser/static checks needed for dark/mobile/readability.
- **D-21:** Add focused Vitest coverage for feed eligibility, ordering, stable IDs, escaping, categories, absolute URLs, and exclusion of non-public or undated entries.
- **D-22:** Run the repo-owned aggregate verification after implementation: `bun run verify`. Use narrower scripts during development where useful, but do not mark the phase passed until aggregate verification is clean.

### the agent's Discretion

- Exact type names, helper names, RSS channel copy, feed title wording, and whether generated `feed.xml` is checked in under `public/` or emitted by a build-adjacent script are delegated to implementation as long as deterministic static output and check-mode verification are preserved.
- The planner may decide whether feed metadata lives in `src/domain/feed.ts` or a narrower module next to SEO helpers, provided the route/UI layer does not own feed serialization logic.
- The planner may decide the smallest practical visible feed-link placement on home and writing pages after checking existing layout density and dark/mobile wrapping.

</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Scope

- `.planning/ROADMAP.md` - Phase 33 goal, FEED-01 through FEED-05 requirement mapping, plan split, dependencies, and later-phase boundaries.
- `.planning/REQUIREMENTS.md` - Feed requirements, static-first constraints, and v1.6 out-of-scope exclusions.
- `.planning/PROJECT.md` - Current v1.6 state, curated checked-in content authority, static deployment constraints, and OpenLinks low-intrusion decision.
- `.planning/STATE.md` - Current phase position and recent Phase 30-32 decisions affecting feed work.
- `.planning/phases/30-content-discovery-foundation/30-CONTEXT.md` - Locked public topic/reference contract and feed deferral.
- `.planning/phases/31-static-topic-routes/31-CONTEXT.md` - Locked topic route/chip/autodiscovery-adjacent metadata patterns and OpenLinks scope.
- `.planning/phases/32-project-and-writing-filtering-search/32-CONTEXT.md` - Locked in-memory discovery behavior, writing index layout, and static/SEO safety decisions.
- `AGENTS.md` - Repo-local dark-primary UI guidance, Bright Builds workflow requirements, and GSD artifact requirements.
- `AGENTS.bright-builds.md` - Bright Builds baseline workflow, TypeScript, verification, testing, frontend, code-shape, and OpenLinks guidance.
- `standards-overrides.md` - No active local exceptions beyond the placeholder table.

### Existing Domain and UI Contracts

- `src/domain/writing.ts` - Public writing selectors, checked-in dates, topics/tags, nullable lookup, and writing detail route helpers.
- `src/domain/topics.ts` - `PublicContentReference`, canonical topic helpers, public references, and hidden-content exclusion surface.
- `src/domain/routes.ts` - Static route registry, prerender routes, sitemap routes, and route metadata source.
- `src/domain/seo.ts` - Existing profile/canonical-origin helpers, route metadata, writing JSON-LD, sitemap, robots, and XML-like static asset patterns.
- `src/components/RouteHead.tsx` - Shared route head pattern for metadata and asset links.
- `src/routes/index.tsx` - Home head and intro layout that needs feed autodiscovery and a low-intrusion feed link.
- `src/routes/writing/index.tsx` - Writing index head, filter controls, card layout, and topic chip patterns that need autodiscovery and visible feed link placement.
- `src/styles/app.css` - Dark-primary surfaces, links, focus, responsive wrapping, and reduced-motion rules.

### Verification Surfaces

- `package.json` - Repo-owned scripts, especially `test`, `build`, `verify:static`, `verify:release`, and aggregate `verify`.
- `scripts/verify-static/run-static-verification.ts` - Static verification entrypoint to extend for feed output.
- `scripts/verify-static/output.ts` - Built-output file reading helpers.
- `scripts/verify-static/metadata-jsonld-verifier.ts` - Static metadata/head verification patterns.
- `scripts/verify-static/sitemap-assets-verifier.ts` - Static asset and sitemap verification patterns.
- `scripts/verify-release.ts` - Release evidence and budget checks that should remain truthful and local.
- `tests/browser-release.playwright.ts` - Dark desktop/mobile, focus, axe, and overlap checks to extend only if visible feed link coverage is not already exercised by existing home/writing route loops.

### Standards

- `standards/core/frontend-ui.md` - Dark default, public source/identity disclosure, and OpenLinks low-intrusion product chrome.
- `standards/core/architecture.md` - Keep feed eligibility and serialization in pure data-in/data-out helpers.
- `standards/core/code-shape.md` - Use shallow control flow and `maybe...` naming for nullable values.
- `standards/core/testing.md` - Unit test pure feed logic with focused Arrange/Act/Assert tests.
- `standards/core/verification.md` - Run repo-native checks before commit and prefer aggregate/owned commands.
- `standards/languages/typescript-javascript.md` - Keep TypeScript business logic pure, use Bun/repo scripts, and avoid new Python automation.

</canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- `publicWritingEntries()`, `writingDetailPath()`, and checked-in `maybePublishedOn` / `maybeUpdatedOn` fields in `src/domain/writing.ts` provide the feed source, canonical paths, and date inputs.
- `peterProfile.canonicalOrigin` and existing metadata helpers in `src/domain/seo.ts` provide absolute URL construction and site identity.
- `jsonLdScriptContent()` and existing metadata tests show how the repo handles safe serialization for static head content; feed XML needs its own XML escaping coverage.
- `RouteHead` centralizes most head metadata for non-home routes, while `src/routes/index.tsx` currently renders head tags inline.
- The writing page already has compact dark-primary filter and card surfaces where a subtle feed link can be added without changing route purpose.

### Established Patterns

- Pure domain helpers own public eligibility and deterministic data transforms; route components consume ready-to-render data.
- Static output verification reads `.output/public` after `bun run build`.
- Curation validation catches bad checked-in content before release gates.
- Visitor-facing surfaces do not fetch GitHub, CMS, search-service, feed, or content data at runtime.
- OpenLinks remains a subtle identity surface in stable chrome and metadata, not a primary CTA.

### Integration Points

- Add a feed domain helper and focused tests before adding static output wiring.
- Add or extend a script so static feed XML is generated/checkable as part of the build/verification flow.
- Add feed autodiscovery metadata through `RouteHead` where possible and a small home-specific head addition where needed.
- Add visible feed links to home and writing surfaces using existing dark-primary link/button classes.
- Extend static/release verification once feed output exists.

</code_context>

<specifics>

## Specific Ideas

- Treat `/feed.xml` as a syndication surface for writing, not a site activity log.
- Prefer concise feed items with summaries, canonical links, public categories, and stable IDs.
- Keep visible subscription affordances small and practical: "RSS feed" or "Subscribe via RSS" should be discoverable without competing with project or writing CTAs.
- Keep feed-reader, hosted, and live external validation out of local automated evidence until a later release contract explicitly scopes it.

</specifics>

<deferred>

## Deferred Ideas

- JSON Feed, Atom, topic-specific feeds, and project/theme/site-update feeds belong to future work after the writing-first feed proves useful.
- Newsletter signup, WebSub, webmentions, comments, analytics, CMS/admin/editor workflows, and dynamic feed endpoints remain out of scope for v1.6.
- Related-work ranking and panels belong to Phase 34.
- Generic and topic social preview assets belong to Phase 35.
- Milestone-wide release evidence expansion, hosted feed-reader smoke labels, and final release-readiness wording belong to Phase 36.

</deferred>

***

*Phase: 33-writing-first-static-feed*
*Context gathered: 2026-07-03*
