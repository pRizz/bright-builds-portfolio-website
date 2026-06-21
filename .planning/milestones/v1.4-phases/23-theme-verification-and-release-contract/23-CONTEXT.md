---
generated_by: gsd-discuss-phase
lifecycle_mode: yolo
phase_lifecycle_id: 23-2026-06-18T04-28-20
generated_at: 2026-06-18T04:28:20.067Z
---

# Phase 23: Theme Verification and Release Contract - Context

**Gathered:** 2026-06-18
**Status:** Ready for planning
**Mode:** Yolo

<domain>

## Phase Boundary

Phase 23 turns the completed theme-route, collaboration, metadata, structured-data, sitemap, browser, and release-readiness work into one truthful release contract. The aggregate release gate must prove theme coverage through checks that actually run locally: generated static HTML assertions, sitemap inclusion/exclusion, forbidden runtime residue checks, Playwright/axe browser coverage, release-readiness document checks, release evidence labels, and a clean `bun run install:browser && bun run verify` result.

This phase should not add new theme content, new theme routes, new collaboration capabilities, live external-link crawling, hosted Lighthouse claims, dynamic Open Graph routes, runtime image generation, CMS/admin tooling, search/filtering, analytics, newsletter, comments, or network-dependent verification.

</domain>

<decisions>

## Implementation Decisions

### Static Verification Contract

- **D-01:** Use registry-derived full theme parity as the static verification target. Static checks should prove `/themes` and every public `/themes/{slug}` route from helper output, not copied route lists.
- **D-02:** Static verification should prove visible theme content, route-specific metadata, JSON-LD, sitemap inclusion/exclusion, related selected-project links, related public-writing links, collaboration action links, fallback/non-public route safety, checked-in social fallback use, and forbidden runtime API/token residue.
- **D-03:** Prefer helper-derived string/attribute assertions already used by `scripts/verify-static` before adding a more complex parsed JSON-LD framework. Parsed JSON-LD can be introduced only if it clearly reduces brittleness for the current theme `CollectionPage` contract.
- **D-04:** Keep unknown, hidden, draft, unsupported, archived, and otherwise non-public theme paths excluded from static output and sitemap output. Fallback source checks should stay generic and non-leaking.

### Browser Release Coverage

- **D-05:** Keep browser coverage route-derived where it already works: all `prerenderRoutes` should receive axe scans and desktop/mobile dark layout overflow/overlap checks.
- **D-06:** Keep keyboard and reduced-motion checks representative rather than exhaustive per theme slug. They should exercise release-critical theme flows: theme nav, theme detail route, related project route, related writing route, and external collaboration action.
- **D-07:** Evidence wording must say exactly what runs: automated axe checks, desktop/mobile dark layout overflow/overlap checks, representative keyboard focus checks, and representative reduced-motion checks. Do not claim complete WCAG certification, visual-regression baselines, hosted audits, or manual review as automated evidence.
- **D-08:** Do not add screenshot baselines or an exhaustive interaction matrix in this phase unless existing checks cannot prove a required Phase 23 route path. Those approaches add flake and maintenance cost beyond the current release contract.

### Release-Readiness Docs and Evidence Labels

- **D-09:** Extend the existing release-readiness contract for theme coverage instead of creating a separate theme release document.
- **D-10:** `scripts/release-readiness.ts` should require the checked-in release-readiness document to name theme route coverage, theme static coverage, theme browser coverage, and a representative public theme smoke route.
- **D-11:** Release evidence labels should include only automated local evidence. Add a theme route coverage label if the corresponding static/browser/release checks actually run. Keep manual external-link smoke checks, preview deployment checks, post-deploy checks, and hosted audits as manual checklist prose, not automated evidence labels.
- **D-12:** Keep OpenLinks low-intrusion in release wording. The release contract may mention policy coverage for existing external links, but should not turn OpenLinks into a primary theme CTA or claim live reachability.

### Aggregate Gate and Verification Ordering

- **D-13:** Add `bun run verify:release` to the aggregate `bun run verify` script and run it last after formatting, Biome, typecheck, tests, curation, no-runtime-GitHub, helper-surface, visual-system, build, browser checks, and static verification.
- **D-14:** Keep `bun run install:browser` as the explicit clean-builder prerequisite before `bun run verify`; do not hide browser installation inside `verify`.
- **D-15:** Keep `verify` non-mutating. Do not add `generate:static-metadata` to `verify`; stale `public/sitemap.xml` or `robots.txt` should fail through existing generated-output/static checks rather than being silently rewritten.
- **D-16:** Narrow commands should remain available for iteration: `verify:static`, `verify:browser`, and `verify:release` should each retain their own clear ownership.

### Verification Evidence

- **D-17:** The final proof for the phase should include the exact clean-builder release sequence `bun run install:browser && bun run verify` or a clear note if browser installation is already satisfied locally.
- **D-18:** If browser binaries are missing, run `bun run install:browser` before the aggregate gate rather than skipping browser verification.
- **D-19:** If aggregate verification fails, fix the failing gate before commit/push. Do not finalize Phase 23 on partial static-only or test-only evidence.

### the agent's Discretion

- The planner may decide whether to add small helper functions in release-readiness or verify-static modules to avoid duplicated route labels, provided the result stays simple and testable.
- The planner may choose exact label strings as long as they distinguish project, writing, and theme coverage and avoid overclaiming manual or hosted evidence.
- The executor may add focused tests around release-readiness facts, evidence labels, verify script composition, static summary wording, or browser route coverage when those tests directly guard Phase 23 requirements.

</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Milestone Scope

- `.planning/ROADMAP.md` - Phase 23 goal, VERIFY-01 through VERIFY-04 success criteria, dependency on Phase 22, and release-contract boundary.
- `.planning/REQUIREMENTS.md` - Verification requirements plus v1.4 out-of-scope exclusions for live link checks, dynamic OG routes, runtime fetches, CMS/admin, analytics, newsletter, comments, search, and prominent OpenLinks promotion.
- `.planning/PROJECT.md` - Current release gate facts, v1.4 milestone status, static portfolio constraints, and prior release-readiness decisions.
- `.planning/STATE.md` - Phase 23 continuity state and Phase 22 completion note.

### Prior Phase Decisions

- `.planning/phases/19-theme-domain-foundation/19-CONTEXT.md` - Theme registry, public selectors, route helpers, relationship validation, and Phase 23 deferral.
- `.planning/phases/20-theme-routes-and-dark-ui/20-CONTEXT.md` - Theme route UI, public-only route derivation, fallback safety, dark-primary browser expectations, and Phase 23 release boundary.
- `.planning/phases/21-collaboration-pathways-and-cross-links/21-CONTEXT.md` - Collaboration actions, reciprocal theme links, OpenLinks low-intrusion boundary, and Phase 23 browser/release deferral.
- `.planning/phases/22-theme-metadata-and-structured-data/22-CONTEXT.md` - Theme metadata, JSON-LD, sitemap, social fallback, static verification, and Phase 23 release-contract deferral.

### Existing Code Patterns

- `package.json` - Aggregate `verify` script and narrow verification scripts.
- `README.md` - Release command guidance and aggregate gate description.
- `docs/release-readiness.md` - Local release contract, clean-builder command, browser/static/release coverage wording, external-link policy, and deploy checklist.
- `scripts/verify-static/run-static-verification.ts` - Static verifier summary and orchestration.
- `scripts/verify-static/expected-route-text.ts` - Helper-derived visible content, project, writing, theme, cross-link, and collaboration expected text checks.
- `scripts/verify-static/metadata-jsonld-verifier.ts` - Static metadata and JSON-LD route assertions, including theme `CollectionPage` coverage.
- `scripts/verify-static/sitemap-assets-verifier.ts` - Sitemap, generated asset, theme route inclusion/exclusion, fallback source, forbidden residue, and reduced-motion CSS checks.
- `scripts/verify-static.test.ts` - Static verifier summary and contract wording tests.
- `scripts/verify-release.ts` - Release budgets, semantic checks, internal/external link policy, release-readiness document checks, and evidence label output.
- `scripts/verify-release.test.ts` - Release verifier label, accessibility, semantic, budget, and policy tests.
- `scripts/release-readiness.ts` - Required release-readiness document facts, external-link policies, and evidence labels.
- `scripts/release-readiness.test.ts` - Tests that guard required release-readiness facts and evidence label wording.
- `tests/browser-release.playwright.ts` - Route-derived axe/layout coverage plus representative keyboard and reduced-motion checks for project, writing, and theme routes.
- `src/domain/routes.ts` - `prerenderRoutes` and `sitemapRoutes` source of truth.
- `src/domain/themes.ts` - Public theme entries, detail paths, related project/writing helpers, reciprocal theme helpers, and collaboration actions.
- `src/domain/seo.ts` - Theme metadata, theme item-list JSON-LD, theme collection-page JSON-LD, sitemap, robots, and social fallback helpers.

### Standards And Skills

- `AGENTS.md` - Repo-local dark-primary guidance and visual verification requirement.
- `AGENTS.bright-builds.md` - Bright Builds workflow, TypeScript, testing, verification, code-shape, and OpenLinks guidance.
- `standards/core/architecture.md` - Keep release decisions in pure helpers where practical and orchestration thin.
- `standards/core/code-shape.md` - Keep control flow shallow and use `maybe...` names for nullable values.
- `standards/core/testing.md` - Unit test pure release/static helper behavior with focused Arrange/Act/Assert tests.
- `standards/core/verification.md` - Run repo-native verification before commit and do not commit on failing checks.
- `standards/languages/typescript-javascript.md` - Use Bun/repo scripts, keep TS helper logic data-in/data-out, and avoid new Python automation.
- `openlinks-identity-presence` skill - Keep OpenLinks discoverable as identity metadata/footer/profile context without making it primary theme promotion.

</canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- `expectedRoutes` already derives generated route checks from `prerenderRoutes`, which includes `/themes` and public theme detail routes.
- `themeDetailExpectedTexts()` and related helper functions in `scripts/verify-static/expected-route-text.ts` already assert theme page body content, related project links, related writing links, and collaboration action links from domain helpers.
- `assertMetadataForTheme()` and `assertThemeCollectionPageJsonLd()` already validate theme metadata and structured data against `metadataForTheme()` and `themeCollectionPageJsonLd()`.
- `assertSitemapThemeCoverage()` and `assertThemeDetailRouteCoverage()` already prove theme sitemap inclusion/exclusion and public detail output coverage.
- `tests/browser-release.playwright.ts` already loops axe/layout checks over all `prerenderRoutes` and includes representative theme keyboard/reduced-motion paths.
- `releaseReadinessDocumentFindings()` and `releaseReadinessEvidenceLabels()` are the right extension points for doc facts and evidence label truth.

### Established Patterns

- Static output checks are helper-derived and local; they should not call network services or live external destinations.
- Release-readiness checks are code-owned facts enforced against `docs/release-readiness.md`.
- Browser checks use Playwright projects for desktop/mobile/reduced-motion differences and keep route scans deterministic.
- External link policy verification checks generated anchors against a local policy instead of crawling live destinations.
- Generated sitemap and robots files are checked-in public artifacts, regenerated intentionally, and verified non-mutatingly by the release/static gates.

### Integration Points

- Update `package.json` so `bun run verify` runs `bun run verify:release` after `bun run verify:static`.
- Update `scripts/release-readiness.ts` with theme route required facts, representative theme route helper, and theme evidence label.
- Update `scripts/release-readiness.test.ts` to guard missing theme route coverage, theme static coverage, theme browser coverage, representative theme smoke route, and evidence labels.
- Update `scripts/verify-release.test.ts` if release evidence labels change.
- Update `scripts/verify-static/run-static-verification.ts` and `scripts/verify-static.test.ts` if summary wording should explicitly name theme route coverage.
- Update `docs/release-readiness.md` and `README.md` so clean-builder and aggregate gate wording matches the package script.
- Run the full clean-builder release command sequence before finalizing.

</code_context>

<specifics>

## Specific Ideas

- The current `README.md` and release-readiness docs describe `verify:release` as part of the aggregate gate, but the current `package.json` `verify` script stops after `verify:static`. Phase 23 should close that truth gap.
- Theme route coverage should appear alongside project detail route coverage and writing route coverage in docs and labels.
- A representative theme smoke route should come from `themeDetailRoutes()[0]` to avoid hard-coded public slugs.
- Evidence labels should name automated local facts such as `theme route coverage`; manual external-link smoke checks and deploy checks should remain checklist items only.
- Keep verification non-mutating so stale generated metadata remains visible as a failure.

</specifics>

<deferred>

## Deferred Ideas

- Screenshot/visual-regression baselines can be considered later if visual drift becomes release-critical and CI rendering is stable enough.
- A parsed JSON-LD assertion framework can be added later if string/attribute JSON-LD checks become brittle as structured data grows.
- A non-mutating pre-build static-metadata drift check can be considered later if stale `public/sitemap.xml` or `public/robots.txt` recurs often enough to justify a separate script.
- Hosted Lighthouse, live external-link crawling, dynamic OG image generation, CMS/admin, search/filtering, analytics, comments/newsletter, and runtime content fetches remain future or out of scope.

</deferred>

---

*Phase: 23-theme-verification-and-release-contract*
*Context gathered: 2026-06-18*
