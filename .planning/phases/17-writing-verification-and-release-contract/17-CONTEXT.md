---
generated_by: gsd-discuss-phase
lifecycle_mode: yolo
phase_lifecycle_id: 17-2026-06-14T18-47-38
generated_at: 2026-06-14T18:47:38.999Z
---

# Phase 17: Writing Verification and Release Contract - Context

**Gathered:** 2026-06-14
**Status:** Ready for planning
**Mode:** Yolo

<domain>

## Phase Boundary

Phase 17 closes the v1.3 writing milestone by proving that the already-built writing routes, writing metadata, structured data, sitemap behavior, cross-links, browser accessibility coverage, and release-readiness documentation are part of the aggregate release gate.

This phase should expand automated verification and release-contract evidence only. It should not add new writing content, redesign the writing UI, create RSS/search/tag archives, add CMS/admin behavior, add runtime content fetching, create dynamic Open Graph image routes, or claim hosted/manual checks as automated coverage.

</domain>

<decisions>

## Implementation Decisions

### Static Verification Contract

- **D-01:** Keep static writing checks helper-derived. Verification should read public writing entries, writing routes, metadata helpers, JSON-LD helpers, sitemap helpers, and related-project helpers instead of duplicating slugs or route lists.
- **D-02:** `bun run verify:static` should prove generated writing HTML includes expected body content, route-specific metadata, `BlogPosting` JSON-LD, writing index `ItemList` JSON-LD, sitemap inclusion for public writing routes, sitemap exclusion for draft/hidden/unknown writing routes, related project links, and forbidden runtime/template residue.
- **D-03:** If some Phase 16 static checks already prove the requirement, Phase 17 should tighten naming, documentation, tests, or release labels rather than rewriting the verifier.

### Browser Release Coverage

- **D-04:** Browser release checks should keep exhaustive axe and desktop/mobile dark layout coverage over `prerenderRoutes`, which now includes `/writing` and every public writing detail route.
- **D-05:** Keyboard coverage should explicitly reach the writing navigation path, at least one public writing detail route, the back-to-writing path from a writing detail route, and a related project path from writing when one exists.
- **D-06:** Reduced-motion coverage should include a representative writing surface in addition to home and project detail surfaces, proving decorative hover/pointer behavior stays disabled under reduced motion.
- **D-07:** Browser checks should remain deterministic and local. Do not introduce live external-link crawling, hosted audits, screenshot baselines, or network-dependent checks in this phase.

### Release Readiness And Evidence Labels

- **D-08:** `docs/release-readiness.md` should explicitly describe writing route coverage as part of `bun run install:browser && bun run verify`.
- **D-09:** Release-readiness document guards in `scripts/release-readiness.ts` should require the writing coverage facts that the docs claim.
- **D-10:** Release evidence labels should name only automated checks that actually run. A `writing route coverage` label is appropriate only after static, browser, and release-readiness checks verify the writing surface through existing scripts.
- **D-11:** The aggregate `bun run verify` script does not need a new package script if writing coverage is added to existing `verify:static`, `verify:browser`, and `verify:release` checks already included in the aggregate gate.

### OpenLinks Identity Presence

- **D-12:** Preserve the existing low-intrusion OpenLinks placement through visible footer/about/contact links and `Person.sameAs` metadata. Writing verification may assert that metadata still includes OpenLinks, but should not add another visible OpenLinks call to action to writing pages.
- **D-13:** Release docs should keep Bright Builds and writing-route release coverage primary; OpenLinks should remain identity infrastructure, not the release-contract headline.

### Verification Scope

- **D-14:** Add focused unit coverage for any pure release-readiness or verifier helper changes, following Arrange/Act/Assert comments.
- **D-15:** Run repo-native verification in the order required for this TypeScript/Bun project, ending with `bun run install:browser && bun run verify` or a documented equivalent when Chromium is already installed.

### the agent's Discretion

- The planner may choose exact representative writing routes from `writingDetailRoutes()` or `publicWritingEntries()`, provided the checks fail clearly if no public writing route exists.
- The planner may choose whether to make release evidence labels centralized in `release-readiness.ts` or asserted through `verify-release.ts`, as long as the label output remains truthful and tests cover it.
- The planner may leave already-sufficient Phase 16 static verifier assertions in place and focus implementation on missing browser/release-contract surfaces.

</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Milestone Scope

- `.planning/ROADMAP.md` - Phase 17 goal, VERIFY-01 through VERIFY-04 success criteria, and dependency on Phase 16 metadata completion.
- `.planning/REQUIREMENTS.md` - Verification requirements and out-of-scope exclusions for live external link checks, CMS/admin, feeds, search, runtime content fetches, and dynamic OG routes.
- `.planning/PROJECT.md` - Current v1.3 state, release gate expectations, static portfolio constraints, and prior milestone decisions.
- `AGENTS.md` - Repo-local dark-primary UI rule, visual verification requirements, and GSD workflow requirements.
- `AGENTS.bright-builds.md` - Bright Builds sync-first, verification, TypeScript, testing, code-shape, and OpenLinks guidance.
- `standards-overrides.md` - No active local exceptions beyond the placeholder table.

### Prior Phase Decisions

- `.planning/phases/14-writing-domain-foundation/14-CONTEXT.md` - Writing registry, public selector, route helper, validation, and related selected-project contracts.
- `.planning/phases/15-writing-routes-and-dark-ui/15-CONTEXT.md` - Writing route/UI behavior, dark-primary verification needs, and Phase 17 release-boundary deferrals.
- `.planning/phases/16-writing-metadata-and-structured-data/16-CONTEXT.md` - Writing metadata, `BlogPosting`/`ItemList` JSON-LD, sitemap, social fallback, and Phase 17 release-contract deferrals.

### Existing Verification And Release Code

- `package.json` - Aggregate `bun run verify` command and included verification scripts.
- `scripts/verify-static.ts` - Generated HTML, metadata, JSON-LD, sitemap, asset, reduced-motion CSS, and forbidden output checks.
- `tests/browser-release.playwright.ts` - Axe, dark desktop/mobile layout, keyboard, and reduced-motion browser release checks.
- `scripts/release-readiness.ts` - External-link policy, release-readiness document guard facts, and release evidence labels.
- `scripts/release-readiness.test.ts` - Unit coverage for release-readiness document guards and evidence labels.
- `scripts/verify-release.ts` - Static release output budgets, semantic checks, accessibility hooks, forbidden runtime output, and evidence-label output.
- `scripts/verify-release.test.ts` - Unit coverage for release verifier behavior and evidence labels.
- `docs/release-readiness.md` - Human release contract and clean-builder guidance.

### Writing And Metadata Helpers

- `src/domain/writing.ts` - Public writing entries, nullable lookup, `writingDetailPath`, `writingDetailRoutes`, and related project helper surface.
- `src/domain/seo.ts` - Writing metadata, writing `BlogPosting` JSON-LD, writing `ItemList` JSON-LD, sitemap, robots, and shared social fallback helpers.
- `src/domain/routes.ts` - Top-level and prerender route derivation including writing routes.
- `src/routes/writing/index.tsx` - Writing index route, metadata, JSON-LD, and list UI.
- `src/routes/writing/[slug].tsx` - Writing detail route, article metadata, JSON-LD, back link, body rendering, and related project links.
- `src/routes/projects/[slug].tsx` - Related writing panel on selected project detail pages.

### Standards And Identity Guidance

- Bright Builds canonical standards `standards/core/architecture.md` - Keep verification decisions and route derivation in pure helpers where practical.
- Bright Builds canonical standards `standards/core/code-shape.md` - Use shallow control flow and `maybe...` names for nullable values.
- Bright Builds canonical standards `standards/core/testing.md` - Unit test pure release-readiness and verifier behavior.
- Bright Builds canonical standards `standards/core/verification.md` - Sync before substantive work and run repo-native checks before commit.
- Bright Builds canonical standards `standards/languages/typescript-javascript.md` - Use Bun/repo scripts and avoid new Python automation.
- `openlinks-identity-presence` skill - Preserve subtle visible OpenLinks placement and metadata hints without repetitive promotion.

</canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- `prerenderRoutes` already includes `/writing` and public writing detail routes, making route-wide axe/layout/static checks naturally include writing.
- `publicWritingEntries()`, `maybePublicWritingEntryBySlug()`, `writingDetailPath()`, and `writingDetailRoutes()` provide the correct route and entry source of truth.
- `metadataForWritingEntry()`, `writingBlogPostingJsonLd()`, `writingItemListJsonLd()`, and `sitemapXml()` provide pure expected values for static verification.
- `releaseReadinessDocumentFindings()` already guards doc claims through a small required-facts list.
- `releaseReadinessEvidenceLabels()` and `releaseEvidenceLabels()` already centralize the evidence-label output that should gain truthful writing coverage.

### Established Patterns

- Static verifier checks generated output against pure domain/SEO helper output, then reports a concise success message.
- Browser release tests use `prerenderRoutes` for exhaustive axe and layout coverage, with representative explicit paths for keyboard and reduced-motion workflows.
- Release-readiness facts are tested by removing required text from a temporary document fixture.
- Release checks avoid live network dependency and treat external links through policy coverage plus manual smoke-check docs.

### Integration Points

- `tests/browser-release.playwright.ts` should import writing route helpers and add representative writing keyboard/reduced-motion coverage.
- `scripts/release-readiness.ts` should import a representative writing route helper and require writing release-contract facts in the docs.
- `scripts/release-readiness.test.ts` and `scripts/verify-release.test.ts` should cover the new writing evidence labels and required doc facts.
- `docs/release-readiness.md` should update primary gate, static output, automated gate, Cloudflare, preview, and production smoke guidance with writing route coverage.
- `scripts/verify-static.ts` may only need message/label or assertion tightening because Phase 16 already added substantial writing static verification.

</code_context>

<specifics>

## Specific Ideas

- Reuse the first public writing detail route as the representative browser path, but fail clearly if no public writing route exists.
- Keyboard flow should prove Home -> Writing nav, writing index -> detail, detail -> back to `/writing`, and detail -> related project when available.
- Release-readiness docs should describe writing coverage in the same style as project detail route coverage.
- Evidence labels should avoid terms like "hosted audit", "network", or "live link" unless those checks actually run.

</specifics>

<deferred>

## Deferred Ideas

- Rich per-writing raster OG images remain future work.
- RSS/Atom, search, tag archives, comments, newsletter capture, CMS/admin, MDX ingestion, and runtime content integrations remain future or out of scope.
- Live external-link reachability automation remains out of scope; manual smoke checks stay documented.

</deferred>

---

*Phase: 17-writing-verification-and-release-contract*
*Context gathered: 2026-06-14*
