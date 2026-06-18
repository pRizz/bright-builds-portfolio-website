# Phase 23: Theme Verification and Release Contract - Research

**Researched:** 2026-06-18 [VERIFIED: phase context generated_at 2026-06-18T04:28:20.067Z]
**Domain:** SolidStart static release verification, Playwright/axe browser checks, repo-owned TypeScript release contracts [VERIFIED: package.json; VERIFIED: playwright.config.ts; VERIFIED: scripts/verify-release.ts]
**Confidence:** HIGH [VERIFIED: repo source inspection; VERIFIED: npm registry version checks; CITED: Playwright docs; CITED: SolidStart docs]

<user_constraints>
## User Constraints (from CONTEXT.md)

Source for this entire section: `.planning/phases/23-theme-verification-and-release-contract/23-CONTEXT.md`. [VERIFIED: 23-CONTEXT.md]

### Locked Decisions

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

### Deferred Ideas (OUT OF SCOPE)

- Screenshot/visual-regression baselines can be considered later if visual drift becomes release-critical and CI rendering is stable enough.
- A parsed JSON-LD assertion framework can be added later if string/attribute JSON-LD checks become brittle as structured data grows.
- A non-mutating pre-build static-metadata drift check can be considered later if stale `public/sitemap.xml` or `public/robots.txt` recurs often enough to justify a separate script.
- Hosted Lighthouse, live external-link crawling, dynamic OG image generation, CMS/admin, search/filtering, analytics, comments/newsletter, and runtime content fetches remain future or out of scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| VERIFY-01 | Static verification checks generated theme HTML for expected content, metadata, structured data, sitemap inclusion and exclusion, related project links, related writing links, collaboration links, and forbidden runtime API residue. [VERIFIED: .planning/REQUIREMENTS.md] | Existing `scripts/verify-static/*` modules already derive route text, metadata, JSON-LD, sitemap, fallback, social fallback, and residue checks from helpers; plan should preserve and label this coverage. [VERIFIED: scripts/verify-static/expected-route-text.ts; VERIFIED: scripts/verify-static/metadata-jsonld-verifier.ts; VERIFIED: scripts/verify-static/sitemap-assets-verifier.ts] |
| VERIFY-02 | Browser release checks include theme routes for axe, dark desktop and mobile layout, keyboard reachability, reduced-motion behavior where relevant, and text-overlap risk. [VERIFIED: .planning/REQUIREMENTS.md] | Existing Playwright tests loop axe and layout over `prerenderRoutes` and include representative theme keyboard/reduced-motion flows; plan should avoid screenshot baselines or exhaustive per-theme interaction expansion unless a required path is missing. [VERIFIED: tests/browser-release.playwright.ts; CITED: https://playwright.dev/docs/accessibility-testing] |
| VERIFY-03 | Release-readiness docs and checks identify theme route coverage as part of `bun run install:browser && bun run verify`. [VERIFIED: .planning/REQUIREMENTS.md] | `scripts/release-readiness.ts` already enforces checked-in doc facts for project/writing release coverage and is the correct extension point for theme route/static/browser coverage plus a helper-derived representative theme smoke route. [VERIFIED: scripts/release-readiness.ts; VERIFIED: scripts/release-readiness.test.ts] |
| VERIFY-04 | The aggregate `bun run verify` gate passes with theme routes included and release evidence labels name only automated theme coverage that actually runs. [VERIFIED: .planning/REQUIREMENTS.md] | `package.json` currently defines `verify:release` but `verify` stops after `verify:static`; plan must append `verify:release` last and update evidence labels/tests without labeling manual or hosted checks as automated evidence. [VERIFIED: package.json; VERIFIED: scripts/verify-release.ts; VERIFIED: scripts/verify-release.test.ts] |
</phase_requirements>

## Summary

Phase 23 should be planned as a release-contract alignment phase, not a new theme feature phase. [VERIFIED: 23-CONTEXT.md] The theme route static verifier already checks `/themes` and public `/themes/{slug}` routes through `prerenderRoutes`, `publicThemeEntries()`, `themeDetailRoutes()`, metadata helpers, JSON-LD helpers, sitemap helpers, fallback-source checks, social fallback asset checks, and forbidden output patterns. [VERIFIED: scripts/verify-static/expected-route-text.ts; VERIFIED: scripts/verify-static/metadata-jsonld-verifier.ts; VERIFIED: scripts/verify-static/sitemap-assets-verifier.ts; VERIFIED: src/domain/routes.ts; VERIFIED: src/domain/themes.ts; VERIFIED: src/domain/seo.ts]

The largest concrete implementation gap is script truth: `README.md` and `docs/release-readiness.md` describe `verify:release` as part of the aggregate gate, while `package.json` currently leaves `verify:release` outside `bun run verify`. [VERIFIED: README.md; VERIFIED: docs/release-readiness.md; VERIFIED: package.json] The second gap is release-readiness naming: the checked-in document facts and evidence labels cover project and writing route coverage but not theme route coverage yet. [VERIFIED: scripts/release-readiness.ts; VERIFIED: scripts/release-readiness.test.ts; VERIFIED: scripts/verify-release.test.ts]

Browser coverage already matches the intended shape: Playwright/axe scans all `prerenderRoutes`, desktop/mobile projects run dark layout overflow and overlap checks, and representative keyboard/reduced-motion flows include theme index, theme detail, related project, related writing, and an external collaboration action. [VERIFIED: tests/browser-release.playwright.ts; VERIFIED: playwright.config.ts] Because Playwright's own accessibility guidance says automated accessibility scans catch only some accessibility problems and should not replace manual assessment, release wording must avoid claims like full WCAG certification, hosted audit completion, or manual review as automated evidence. [CITED: https://playwright.dev/docs/accessibility-testing]

**Primary recommendation:** Add the theme release contract by extending existing helper-derived release/static/browser checks, appending `bun run verify:release` last in `package.json`, and updating docs/tests/evidence labels to say only what the automated local gates actually run. [VERIFIED: 23-CONTEXT.md; VERIFIED: package.json; VERIFIED: scripts/release-readiness.ts; VERIFIED: tests/browser-release.playwright.ts]

## Project Constraints (from AGENTS.md)

| Constraint | Planning Impact |
|------------|-----------------|
| Read `AGENTS.md`, `AGENTS.bright-builds.md`, `standards-overrides.md`, and relevant standards pages before plan/review/implementation/audit work. [VERIFIED: AGENTS.md; VERIFIED: AGENTS.bright-builds.md] | Planner should cite these sources and keep tasks aligned with functional-core/imperative-shell, code-shape, testing, verification, and TS/JS standards. [VERIFIED: standards/core/architecture.md; VERIFIED: standards/core/code-shape.md; VERIFIED: standards/core/testing.md; VERIFIED: standards/core/verification.md; VERIFIED: standards/languages/typescript-javascript.md] |
| The portfolio is dark-primary; default user-facing UI should render in dark mode with `.dark` active on the root document. [VERIFIED: AGENTS.md] | Browser verification must preserve desktop and mobile dark rendering and overlap/readability checks; Phase 23 should not add light-first UI work. [VERIFIED: tests/browser-release.playwright.ts; VERIFIED: playwright.config.ts] |
| Visual verification for UI changes must include desktop and mobile dark rendering, contrast/readability, and text-overlap checks. [VERIFIED: AGENTS.md] | Existing route-derived layout checks are the standard coverage surface; add only narrow checks if a Phase 23 requirement path is unproven. [VERIFIED: tests/browser-release.playwright.ts] |
| Use GSD planning artifacts and commit planning docs as repo history. [VERIFIED: AGENTS.md; VERIFIED: .planning/config.json] | This research artifact must be written and, because `commit_docs` is true, should be committed as a planning doc. [VERIFIED: gsd init phase-op 23] |
| Prefer functional core / imperative shell and pure data-in/data-out helper logic for business decisions. [VERIFIED: AGENTS.bright-builds.md; VERIFIED: standards/core/architecture.md; VERIFIED: standards/languages/typescript-javascript.md] | Keep new release facts in import-safe helpers such as `releaseReadinessDocumentFindings()` and `releaseReadinessEvidenceLabels()`, with CLI orchestration thin. [VERIFIED: scripts/release-readiness.ts; VERIFIED: scripts/verify-release.ts] |
| Unit test pure code and business logic with focused Arrange/Act/Assert tests. [VERIFIED: standards/core/testing.md] | Add focused Vitest coverage for missing theme doc facts, evidence labels, and any script-composition helper; avoid broad snapshot-style tests. [VERIFIED: scripts/release-readiness.test.ts; VERIFIED: scripts/verify-release.test.ts; VERIFIED: scripts/verify-static.test.ts] |
| In this Bun-friendly TS repo, do not add Python automation; use Bun/repo-owned TypeScript scripts. [VERIFIED: standards/languages/typescript-javascript.md; VERIFIED: package.json] | Phase 23 should edit TypeScript scripts/tests and package scripts only; no new Python or shell verification layers. [VERIFIED: package.json; VERIFIED: scripts/verify-release.ts] |
| OpenLinks must stay low-intrusion in footer/about/contact/profile/metadata surfaces and must not displace the Bright Builds brand or primary CTAs. [VERIFIED: AGENTS.bright-builds.md; VERIFIED: CONTRIBUTING.md; VERIFIED: openlinks-identity-presence skill] | Release wording may mention existing external-link policy coverage for OpenLinks but must not promote OpenLinks as the primary theme CTA or claim live reachability. [VERIFIED: 23-CONTEXT.md; VERIFIED: docs/release-readiness.md] |

Project skills check: `.claude/skills/` and `.agents/skills/` do not exist in this repo, so there are no project-local skill patterns to incorporate. [VERIFIED: filesystem find]

## Standard Stack

### Core

| Library / Tool | Repo Version | Registry / Local Verification | Purpose | Why Standard |
|----------------|--------------|-------------------------------|---------|--------------|
| Bun | `packageManager: "bun@1.3.14"`; local binary `1.3.9` [VERIFIED: package.json; VERIFIED: `bun --version`] | Bun site advertised install `1.3.14` on 2026-06-18; local mismatch is an environment risk, not a Phase 23 dependency change. [CITED: https://bun.com/; VERIFIED: local command] | Package scripts and TypeScript script execution. [VERIFIED: package.json] | Repo standardizes on Bun scripts, and Bun docs support running `package.json` scripts with `bun run`. [VERIFIED: package.json; CITED: https://bun.com/docs/quickstart] |
| SolidStart / SolidJS | `@solidjs/start@1.3.2`, `solid-js@1.9.13`, `vinxi@0.5.11` [VERIFIED: package.json] | Registry latest matches repo for `@solidjs/start`, `solid-js`, and `vinxi` as checked; modified timestamps were 2026-06-12, 2026-05-19, and 2026-01-19 respectively. [VERIFIED: npm registry] | Static route generation and app framework. [VERIFIED: app.config.ts; VERIFIED: package.json] | SolidStart docs define route pre-rendering as SSG that produces static HTML during build, and this repo feeds `prerenderRoutes` into the config. [CITED: https://docs.solidjs.com/solid-start/building-your-application/route-prerendering; VERIFIED: app.config.ts] |
| `@solidjs/meta` | `0.29.4` [VERIFIED: package.json] | Registry latest `0.29.4`, modified 2026-03-17. [VERIFIED: npm registry] | Route metadata rendered into static HTML. [VERIFIED: src/domain/seo.ts; VERIFIED: scripts/verify-static/metadata-jsonld-verifier.ts] | SolidStart docs recommend `@solidjs/meta` for route-specific head metadata. [CITED: https://docs.solidjs.com/solid-start/building-your-application/head-and-metadata] |
| Repo-owned static verifier | `scripts/verify-static.ts` plus `scripts/verify-static/*` [VERIFIED: package.json; VERIFIED: scripts/verify-static.ts] | Current summary names writing route coverage but not theme route coverage. [VERIFIED: scripts/verify-static/run-static-verification.ts; VERIFIED: scripts/verify-static.test.ts] | Proves built static HTML, metadata, JSON-LD, sitemap/assets/robots, route text, fallback safety, and forbidden residue. [VERIFIED: scripts/verify-static/expected-route-text.ts; VERIFIED: scripts/verify-static/metadata-jsonld-verifier.ts; VERIFIED: scripts/verify-static/sitemap-assets-verifier.ts] | Existing helper-derived modules already satisfy most VERIFY-01 behavior without new dependencies. [VERIFIED: scripts/verify-static.test.ts] |
| Repo-owned release verifier | `scripts/verify-release.ts` and `scripts/release-readiness.ts` [VERIFIED: package.json] | `verify:release` exists but is not in aggregate `verify`. [VERIFIED: package.json] | Enforces release budgets, semantic/accessibility hooks, internal/external link policy, forbidden output residue, doc facts, and evidence labels. [VERIFIED: scripts/verify-release.ts; VERIFIED: scripts/release-readiness.ts] | Existing release-readiness tests already guard doc facts and evidence labels for project/writing coverage, so themes should extend the same contract. [VERIFIED: scripts/release-readiness.test.ts; VERIFIED: scripts/verify-release.test.ts] |

### Supporting

| Library / Tool | Repo Version | Registry / Local Verification | Purpose | When to Use |
|----------------|--------------|-------------------------------|---------|-------------|
| `@playwright/test` | `1.60.0` [VERIFIED: package.json; VERIFIED: `bunx playwright --version`] | Registry latest `1.61.0`, modified 2026-06-18. [VERIFIED: npm registry] | Browser release checks over built static output. [VERIFIED: playwright.config.ts; VERIFIED: tests/browser-release.playwright.ts] | Use for route-derived axe/layout checks and representative keyboard/reduced-motion flows; do not add screenshot baselines in Phase 23. [VERIFIED: 23-CONTEXT.md; CITED: https://playwright.dev/docs/test-projects] |
| `@axe-core/playwright` | `4.11.3` [VERIFIED: package.json] | Registry latest `4.11.3`, modified 2026-06-15. [VERIFIED: npm registry] | Automated accessibility scans inside Playwright. [VERIFIED: tests/browser-release.playwright.ts] | Use `new AxeBuilder({ page }).analyze()` for automated detectable issues, while docs must avoid claiming complete accessibility certification. [VERIFIED: tests/browser-release.playwright.ts; CITED: https://playwright.dev/docs/accessibility-testing; CITED: https://github.com/dequelabs/axe-core-npm/blob/develop/packages/playwright/README.md] |
| Vitest | `4.1.7` [VERIFIED: package.json; VERIFIED: `bunx vitest --version`] | Registry latest `4.1.9`, modified 2026-06-15. [VERIFIED: npm registry] | Unit tests for pure verifier helper behavior. [VERIFIED: vitest.config.ts; VERIFIED: scripts/release-readiness.test.ts] | Use for narrow helper and package-script contract tests if implementation extracts script composition into testable code. [VERIFIED: standards/core/testing.md; VERIFIED: scripts/verify-static.test.ts] |
| Biome | `2.4.15` [VERIFIED: package.json; VERIFIED: `bunx biome --version`] | Registry latest `2.5.0`, modified 2026-06-12. [VERIFIED: npm registry] | Formatting and lint/check in aggregate gate. [VERIFIED: package.json] | Keep `format:check` and `check` first in aggregate `verify`; do not replace with ad hoc lint commands. [VERIFIED: package.json; VERIFIED: standards/core/verification.md] |
| TypeScript | `6.0.3` [VERIFIED: package.json] | Registry latest `6.0.3`, modified 2026-06-17. [VERIFIED: npm registry] | Strict type checking for app/scripts/tests. [VERIFIED: tsconfig.json; VERIFIED: package.json] | Keep `bun run typecheck` in aggregate gate before tests/build/browser/static/release. [VERIFIED: package.json] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Helper-derived route lists | Copied theme slug arrays in tests/scripts | Reject copied lists because Phase 23 decisions require registry-derived full parity and existing helpers already derive public theme routes. [VERIFIED: 23-CONTEXT.md; VERIFIED: src/domain/themes.ts; VERIFIED: scripts/verify-static.test.ts] |
| String/attribute JSON-LD assertions | Parsed JSON-LD framework | Defer parsed JSON-LD unless current `CollectionPage` checks become brittle; existing checks already assert type, URL, profile sameAs, collaboration angle, and `hasPart` URLs. [VERIFIED: 23-CONTEXT.md; VERIFIED: scripts/verify-static/metadata-jsonld-verifier.ts] |
| Local external-link policy | Live HTTP crawling | Reject live crawling for this phase because docs and context intentionally keep live external checks manual and deterministic local gates token-safe. [VERIFIED: docs/release-readiness.md; VERIFIED: 23-CONTEXT.md; VERIFIED: scripts/release-readiness.ts] |
| Existing Playwright/axe checks | Screenshot baselines or exhaustive interaction matrix | Defer screenshot baselines and exhaustive matrices because existing route-derived and representative checks prove required paths and context identifies flake/maintenance cost. [VERIFIED: 23-CONTEXT.md; VERIFIED: tests/browser-release.playwright.ts] |
| Existing release-readiness doc | Separate theme release document | Reject a separate document because Phase 23 decisions require extending the existing release-readiness contract. [VERIFIED: 23-CONTEXT.md; VERIFIED: docs/release-readiness.md] |

**Installation:**
```bash
bun install
```

No new dependency installation is recommended for Phase 23. [VERIFIED: package.json; VERIFIED: 23-CONTEXT.md]

## Architecture Patterns

### Recommended Project Structure

```text
package.json                         # aggregate verify script ownership [VERIFIED: package.json]
README.md                            # developer-facing release gate summary [VERIFIED: README.md]
docs/release-readiness.md            # release contract checked by code [VERIFIED: docs/release-readiness.md]
scripts/
  release-readiness.ts               # code-owned document facts, external-link policy, evidence labels [VERIFIED: scripts/release-readiness.ts]
  verify-release.ts                  # post-build release verifier shell and pure exported checks [VERIFIED: scripts/verify-release.ts]
  verify-release.test.ts             # evidence/semantic/budget/link tests [VERIFIED: scripts/verify-release.test.ts]
  release-readiness.test.ts          # release doc fact and label tests [VERIFIED: scripts/release-readiness.test.ts]
  verify-static/
    run-static-verification.ts       # static verifier summary/orchestration [VERIFIED: scripts/verify-static/run-static-verification.ts]
    expected-route-text.ts           # helper-derived route text/cross-link assertions [VERIFIED: scripts/verify-static/expected-route-text.ts]
    metadata-jsonld-verifier.ts      # route metadata and JSON-LD assertions [VERIFIED: scripts/verify-static/metadata-jsonld-verifier.ts]
    sitemap-assets-verifier.ts       # sitemap/assets/fallback/residue assertions [VERIFIED: scripts/verify-static/sitemap-assets-verifier.ts]
tests/
  browser-release.playwright.ts      # route-derived axe/layout and representative flow checks [VERIFIED: tests/browser-release.playwright.ts]
src/domain/
  routes.ts                          # `prerenderRoutes` / `sitemapRoutes` source of truth [VERIFIED: src/domain/routes.ts]
  themes.ts                          # public theme helpers and collaboration actions [VERIFIED: src/domain/themes.ts]
  seo.ts                             # metadata, JSON-LD, sitemap, robots, social fallback helpers [VERIFIED: src/domain/seo.ts]
```

### Pattern 1: Helper-Derived Static Verification

**What:** Static route checks should derive expected theme routes and assertions from `prerenderRoutes`, `publicThemeEntries()`, `themeDetailRoutes()`, `metadataForTheme()`, and `themeCollectionPageJsonLd()`. [VERIFIED: scripts/verify-static/expected-route-text.ts; VERIFIED: scripts/verify-static/metadata-jsonld-verifier.ts; VERIFIED: scripts/verify-static/sitemap-assets-verifier.ts]

**When to use:** Use this pattern for VERIFY-01 and for any static summary wording update. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: scripts/verify-static/run-static-verification.ts]

**Example:**
```ts
// Source: scripts/verify-static/expected-route-text.ts [VERIFIED: scripts/verify-static/expected-route-text.ts]
export const expectedRoutes: StaticRouteCheck[] = prerenderRoutes.map((route) => ({
  route,
  expectedTexts: ["OpenLinks profile", ...expectedTextsForRoute(route)],
  forbiddenTextPatterns: generatedOutputForbiddenPatterns,
}));
```

### Pattern 2: Release-Readiness Facts as Code-Owned Contract

**What:** `scripts/release-readiness.ts` stores required documentation facts and checks `docs/release-readiness.md` for exact strings. [VERIFIED: scripts/release-readiness.ts]

**When to use:** Use this pattern for VERIFY-03 by adding theme route coverage, theme static coverage, theme browser coverage, and a helper-derived representative theme smoke route. [VERIFIED: 23-CONTEXT.md; VERIFIED: scripts/release-readiness.ts]

**Example:**
```ts
// Source pattern: scripts/release-readiness.ts and tests/browser-release.playwright.ts
// [VERIFIED: scripts/release-readiness.ts; VERIFIED: tests/browser-release.playwright.ts]
import { themeDetailRoutes } from "../src/domain/themes";

function representativeThemeDetailRoute(): string {
  const maybeRoute = themeDetailRoutes()[0];

  if (!maybeRoute) {
    throw new Error("Expected at least one public theme detail route for release coverage.");
  }

  return maybeRoute;
}
```

### Pattern 3: Route-Derived Browser Coverage With Representative Interaction Paths

**What:** Browser tests iterate all `prerenderRoutes` for axe and layout checks, then use representative helpers for keyboard/reduced-motion flows. [VERIFIED: tests/browser-release.playwright.ts]

**When to use:** Preserve this pattern for VERIFY-02; add assertions only if a Phase 23 path is not already covered. [VERIFIED: 23-CONTEXT.md; VERIFIED: tests/browser-release.playwright.ts]

**Example:**
```ts
// Source: tests/browser-release.playwright.ts [VERIFIED: tests/browser-release.playwright.ts]
for (const route of prerenderRoutes) {
  test(`axe has no violations on ${route}`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).analyze();
    expect(axeViolationSummaries(results.violations)).toEqual([]);
  });
}
```

### Pattern 4: Aggregate Gate Ends With Release Verification

**What:** `verify` is a non-mutating aggregate script; Phase 23 should append `bun run verify:release` after `bun run verify:static`. [VERIFIED: package.json; VERIFIED: 23-CONTEXT.md]

**When to use:** Use this pattern for VERIFY-04. [VERIFIED: .planning/REQUIREMENTS.md]

**Example:**
```json
{
  "scripts": {
    "verify": "bun run format:check && bun run check && bun run typecheck && bun run test && bun run verify:curation && bun run verify:no-github-runtime && bun run verify:project-helper-surface && bun run verify:visual-system && bun run build && bun run verify:browser && bun run verify:static && bun run verify:release"
  }
}
```

The example updates the existing script composition and does not add `generate:static-metadata`, preserving the non-mutating gate decision. [VERIFIED: package.json; VERIFIED: 23-CONTEXT.md]

### Anti-Patterns to Avoid

- **Duplicated theme route lists:** Use `prerenderRoutes`, `sitemapRoutes`, `publicThemeEntries()`, and `themeDetailRoutes()` instead of copying slugs. [VERIFIED: src/domain/routes.ts; VERIFIED: src/domain/themes.ts; VERIFIED: 23-CONTEXT.md]
- **Release labels that overclaim:** Do not label manual external-link smoke checks, preview deployment checks, post-deploy checks, hosted audits, or WCAG certification as automated evidence. [VERIFIED: 23-CONTEXT.md; CITED: https://playwright.dev/docs/accessibility-testing]
- **Mutating verification:** Do not run `generate:static-metadata` inside `verify`; stale generated artifacts should fail. [VERIFIED: 23-CONTEXT.md; VERIFIED: package.json]
- **New crawler or external network checks:** Keep external-link verification policy-based and local. [VERIFIED: docs/release-readiness.md; VERIFIED: scripts/release-readiness.ts]
- **Broad refactor of `verify-release.ts`:** `scripts/verify-release.ts` is exactly 628 lines, which matches the Bright Builds file-size refactor trigger, but Phase 23 can avoid expanding it by placing theme facts in `release-readiness.ts`. [VERIFIED: wc -l; VERIFIED: standards/core/code-shape.md; VERIFIED: scripts/release-readiness.ts]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Theme route parity | Copied arrays of `/themes/{slug}` paths | `themeDetailRoutes()` and `prerenderRoutes` | Helper-derived routes are already the domain contract and prevent drift when public themes change. [VERIFIED: src/domain/themes.ts; VERIFIED: src/domain/routes.ts; VERIFIED: scripts/verify-static.test.ts] |
| Automated accessibility scan engine | Custom DOM accessibility scanner | `@axe-core/playwright` inside Playwright | Playwright docs use `@axe-core/playwright` for accessibility scans and warn that automated checks are partial evidence. [CITED: https://playwright.dev/docs/accessibility-testing; VERIFIED: tests/browser-release.playwright.ts] |
| Static metadata and JSON-LD verification | New generic parser framework | Existing `assertMetadata*`, `assertJsonLdContains`, and theme `CollectionPage` assertions | Current assertions already cover title, description, canonical, OG/Twitter, local social fallback, profile sameAs, collaboration angle, and related part URLs. [VERIFIED: scripts/verify-static/metadata-jsonld-verifier.ts] |
| External-link release checks | Live HTTP crawler | `externalLinkFindingsForRoutes()` policy checks plus manual checklist prose | Local release gate intentionally avoids network flake and token exposure while checking HTTPS, covered origins, primary links, and sensitive query keys. [VERIFIED: docs/release-readiness.md; VERIFIED: scripts/release-readiness.ts] |
| Release documentation | Separate theme release doc | Existing `docs/release-readiness.md` enforced by `releaseReadinessDocumentFindings()` | Phase decisions require extending the existing release-readiness contract. [VERIFIED: 23-CONTEXT.md; VERIFIED: scripts/release-readiness.ts] |
| Script orchestration | New shell/Python wrapper | Existing Bun `package.json` scripts | Repo package scripts already define narrow and aggregate gates, and Bright Builds TS guidance prohibits new Python automation in Bun-friendly repos. [VERIFIED: package.json; VERIFIED: standards/languages/typescript-javascript.md] |

**Key insight:** The hard part is not discovering how to verify theme routes; the hard part is keeping all release claims truthful and derived from the same route/helper surfaces that already exist. [VERIFIED: 23-CONTEXT.md; VERIFIED: package.json; VERIFIED: scripts/verify-static/*; VERIFIED: tests/browser-release.playwright.ts]

## Common Pitfalls

### Pitfall 1: Aggregate Gate Truth Gap

**What goes wrong:** Docs say `bun run verify` runs release verification, but `package.json` does not. [VERIFIED: README.md; VERIFIED: docs/release-readiness.md; VERIFIED: package.json]
**Why it happens:** `verify:release` is available as a narrow script, but the aggregate command stops after `verify:static`. [VERIFIED: package.json]
**How to avoid:** Append `&& bun run verify:release` after `verify:static` and add a test or review check that guards the aggregate script string. [VERIFIED: 23-CONTEXT.md; VERIFIED: package.json]
**Warning signs:** README/release-readiness prose names `verify:release` in the aggregate gate while `package.json` does not. [VERIFIED: rg output; VERIFIED: package.json]

### Pitfall 2: Evidence Labels Overclaim Manual or Hosted Work

**What goes wrong:** Release output implies live link checks, hosted audits, manual review, or WCAG certification ran automatically. [VERIFIED: 23-CONTEXT.md]
**Why it happens:** Evidence labels are short strings and can blur automated local checks with manual checklist prose. [VERIFIED: scripts/release-readiness.ts; VERIFIED: docs/release-readiness.md]
**How to avoid:** Add only a theme route coverage label if static/browser/release checks actually run, and keep manual external-link smoke checks and deploy checks in prose. [VERIFIED: 23-CONTEXT.md; VERIFIED: scripts/release-readiness.ts]
**Warning signs:** Labels contain terms such as `hosted audit`, `external suite`, `network`, `live link`, `WCAG certification`, or `manual review`. [VERIFIED: scripts/verify-release.test.ts; CITED: https://playwright.dev/docs/accessibility-testing]

### Pitfall 3: Route Drift From Copied Slugs

**What goes wrong:** Static/browser/release docs prove a hard-coded theme route while public theme helpers expose different routes. [VERIFIED: 23-CONTEXT.md; VERIFIED: src/domain/themes.ts]
**Why it happens:** Tests or docs copy route strings instead of deriving them. [VERIFIED: scripts/release-readiness.ts currently derives project/writing representative routes; VERIFIED: tests/browser-release.playwright.ts derives theme representative routes]
**How to avoid:** Derive representative theme smoke route from `themeDetailRoutes()[0]` and derive exhaustive coverage from `prerenderRoutes`. [VERIFIED: tests/browser-release.playwright.ts; VERIFIED: src/domain/routes.ts]
**Warning signs:** New code contains literal `/themes/agentic-engineering` outside docs smoke-path prose or focused fixtures. [VERIFIED: src/domain/themes.ts; VERIFIED: 23-CONTEXT.md]

### Pitfall 4: Mutating Verify Masks Stale Generated Output

**What goes wrong:** `verify` silently regenerates sitemap/robots/static metadata and hides drift. [VERIFIED: 23-CONTEXT.md]
**Why it happens:** It is tempting to add `generate:static-metadata` before static checks. [VERIFIED: package.json; VERIFIED: 23-CONTEXT.md]
**How to avoid:** Keep `verify` non-mutating and let `verify:static` or release checks fail on stale `public/sitemap.xml`, `robots.txt`, or `.output/public` content. [VERIFIED: scripts/verify-static/sitemap-assets-verifier.ts; VERIFIED: 23-CONTEXT.md]
**Warning signs:** `verify` script includes `generate:static-metadata` or other write commands. [VERIFIED: package.json]

### Pitfall 5: Expanding Browser Coverage Into Flaky Baselines

**What goes wrong:** Screenshot baselines or exhaustive interaction matrices make the release gate slow/flaky without proving additional Phase 23 requirements. [VERIFIED: 23-CONTEXT.md]
**Why it happens:** Visual verification can be mistaken for screenshot regression. [VERIFIED: AGENTS.md; VERIFIED: 23-CONTEXT.md]
**How to avoid:** Keep current Playwright route-derived axe/layout checks and representative keyboard/reduced-motion checks; add targeted assertions only for missing required paths. [VERIFIED: tests/browser-release.playwright.ts]
**Warning signs:** New golden images, screenshot comparison thresholds, or per-theme keyboard matrix loops appear in this phase. [VERIFIED: 23-CONTEXT.md]

### Pitfall 6: Local Tool Version Mismatch

**What goes wrong:** Planner assumes local clean-builder evidence uses `bun@1.3.14`, but local `bun --version` reports `1.3.9`. [VERIFIED: package.json; VERIFIED: local command]
**Why it happens:** `packageManager` and Cloudflare docs pin a target version, while the developer machine can have an older Bun binary. [VERIFIED: package.json; VERIFIED: docs/release-readiness.md; VERIFIED: local command]
**How to avoid:** Document the mismatch and either upgrade local Bun before final proof or clearly report that proof ran with local Bun `1.3.9` while CI/Cloudflare should pin `1.3.14`. [VERIFIED: local command; VERIFIED: docs/release-readiness.md]
**Warning signs:** Final evidence says exact clean-builder command passed without stating the Bun version used. [VERIFIED: package.json; VERIFIED: local command]

## Code Examples

Verified patterns from local sources:

### Add Theme Release Facts

```ts
// Source pattern: scripts/release-readiness.ts [VERIFIED: scripts/release-readiness.ts]
const requiredReleaseReadinessDocumentFacts = [
  { label: "theme route coverage", text: "theme route coverage" },
  {
    label: "theme static coverage",
    text: "theme metadata, JSON-LD, sitemap, related project links, related writing links, collaboration links, and forbidden runtime residue coverage",
  },
  {
    label: "theme browser coverage",
    text: "theme axe, desktop/mobile dark layout, representative keyboard, and representative reduced-motion coverage",
  },
  { label: "representative theme smoke route", text: representativeThemeDetailRoute() },
];
```

The exact strings can differ, but they must be present in `docs/release-readiness.md` and guarded by focused tests. [VERIFIED: 23-CONTEXT.md; VERIFIED: scripts/release-readiness.test.ts]

### Add Theme Evidence Label

```ts
// Source pattern: scripts/release-readiness.ts [VERIFIED: scripts/release-readiness.ts]
export function releaseReadinessEvidenceLabels(): readonly string[] {
  return [
    "SEO/static metadata",
    "project detail route coverage",
    "writing route coverage",
    "theme route coverage",
    "static performance budgets",
    "external link policy",
    "Cloudflare/static deployment",
    "preview and deploy smoke checks",
  ];
}
```

The `theme route coverage` label should be included only after the aggregate gate actually runs static/browser/release checks that include theme coverage. [VERIFIED: 23-CONTEXT.md; VERIFIED: package.json; VERIFIED: tests/browser-release.playwright.ts]

### Static Summary Wording

```ts
// Source: scripts/verify-static/run-static-verification.ts [VERIFIED: scripts/verify-static/run-static-verification.ts]
export function staticVerificationSummary(options: {
  routeCount: number;
  outputRoot: string;
}): string {
  return `Verified ${options.routeCount} prerendered routes, metadata, JSON-LD, writing route coverage, theme route coverage, assets, sitemap, and robots in ${options.outputRoot}.`;
}
```

Add or update the matching Vitest expectation if summary wording changes. [VERIFIED: scripts/verify-static.test.ts]

### Aggregate Gate Script

```json
{
  "verify": "bun run format:check && bun run check && bun run typecheck && bun run test && bun run verify:curation && bun run verify:no-github-runtime && bun run verify:project-helper-surface && bun run verify:visual-system && bun run build && bun run verify:browser && bun run verify:static && bun run verify:release"
}
```

The release verifier should run last because it reads `.output/public` and the checked-in release-readiness document after build/browser/static checks. [VERIFIED: package.json; VERIFIED: scripts/verify-release.ts; VERIFIED: 23-CONTEXT.md]

## State of the Art

| Old Approach | Current Approach | When Changed / Verified | Impact |
|--------------|------------------|-------------------------|--------|
| Runtime/server discovery of pages | SolidStart route pre-rendering with explicit route lists | SolidStart docs currently describe SSG as build-time static HTML generation and support `prerender.routes`. [CITED: https://docs.solidjs.com/solid-start/building-your-application/route-prerendering] | Use `prerenderRoutes` as source of truth and verify generated `.output/public` files. [VERIFIED: app.config.ts; VERIFIED: src/domain/routes.ts] |
| Metadata checked manually in browser | `@solidjs/meta` plus static verifier assertions | SolidStart docs currently recommend `@solidjs/meta` for head customization. [CITED: https://docs.solidjs.com/solid-start/building-your-application/head-and-metadata] | Keep metadata facts helper-derived and assert them in built HTML. [VERIFIED: src/domain/seo.ts; VERIFIED: scripts/verify-static/metadata-jsonld-verifier.ts] |
| Accessibility confidence from one page or manual notes | Playwright projects plus axe scans, layout checks, keyboard checks, reduced-motion checks | Playwright docs support projects for multiple configurations and `@axe-core/playwright` scans, while warning automated checks are partial. [CITED: https://playwright.dev/docs/test-projects; CITED: https://playwright.dev/docs/accessibility-testing] | Keep evidence wording precise and avoid full-certification claims. [VERIFIED: 23-CONTEXT.md; VERIFIED: tests/browser-release.playwright.ts] |
| Live external-link crawling in local release gates | Deterministic external-link policy plus manual smoke checklist | Current release docs and verifier use policy coverage instead of live crawls. [VERIFIED: docs/release-readiness.md; VERIFIED: scripts/release-readiness.ts] | Avoid network-dependent verification and keep manual live checks out of automated labels. [VERIFIED: 23-CONTEXT.md] |
| Browser install hidden inside aggregate verify | Explicit `bun run install:browser` before `bun run verify` | Playwright CLI docs define `playwright install chromium`, and Phase 23 decisions keep it explicit. [CITED: https://playwright.dev/docs/test-cli; VERIFIED: 23-CONTEXT.md; VERIFIED: package.json] | Clean builders must provision Chromium before aggregate verification. [VERIFIED: docs/release-readiness.md] |

**Deprecated/outdated for this phase:**

- Live external-link reachability as an automated local gate is out of scope. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: 23-CONTEXT.md]
- Dynamic OG routes, runtime image generation, CMS/admin, search/filtering, analytics, newsletter, comments, and runtime content fetches are out of scope. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: 23-CONTEXT.md]
- Screenshot baselines and exhaustive interaction matrices are deferred unless existing checks cannot prove a required route path. [VERIFIED: 23-CONTEXT.md]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `Valid until: 2026-07-18` is a 30-day stability estimate for repo-local architecture and version research. [ASSUMED] | Metadata | Planner may treat stale dependency/tool facts as current after package releases or repo changes. |

All implementation recommendations in this research were verified from local repo files, tool output, npm registry checks, or cited official documentation; only the validity-window estimate is assumed. [VERIFIED: source review]

## Open Questions

1. **Should `CONTRIBUTING.md` release wording be updated too?** [VERIFIED: CONTRIBUTING.md]
   - What we know: `CONTRIBUTING.md` says to run `bun run verify` before release and `verify:release` for post-build release verification only. [VERIFIED: CONTRIBUTING.md]
   - What's unclear: Phase 23 focus names `README.md` and `docs/release-readiness.md`, not `CONTRIBUTING.md`. [VERIFIED: user prompt]
   - Recommendation: Treat `CONTRIBUTING.md` as optional cleanup only if the planner wants every docs surface to reflect `verify:release` inside aggregate `verify`; do not expand the phase if README and release-readiness docs satisfy VERIFY-03. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: 23-CONTEXT.md]

2. **Should local Bun be upgraded before final proof?** [VERIFIED: local command; VERIFIED: package.json]
   - What we know: Local Bun is `1.3.9`, while `package.json`, README badges, and Cloudflare settings pin `1.3.14`. [VERIFIED: `bun --version`; VERIFIED: package.json; VERIFIED: README.md; VERIFIED: docs/release-readiness.md]
   - What's unclear: The executor may be able to pass verification locally with `1.3.9`, but the clean-builder release contract names `1.3.14`. [VERIFIED: local command; VERIFIED: docs/release-readiness.md]
   - Recommendation: Planner should require final evidence to state the Bun version used; upgrade local Bun only if verification fails or exact clean-builder parity is required by the user. [VERIFIED: package.json; VERIFIED: local command]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Bun | All package scripts and TypeScript script execution | Yes, wrong version versus repo pin [VERIFIED: `command -v bun`; VERIFIED: `bun --version`; VERIFIED: package.json] | Local `1.3.9`; repo pin `1.3.14` [VERIFIED: local command; VERIFIED: package.json] | Use local for planning/research; for final proof, report version or upgrade to repo pin. [VERIFIED: docs/release-readiness.md] |
| Node | Tool compatibility and npm registry checks | Yes [VERIFIED: `command -v node`] | `v24.13.0` [VERIFIED: `node --version`] | None needed. [VERIFIED: local command] |
| npm | Registry version verification | Yes [VERIFIED: `command -v npm`] | Available on PATH [VERIFIED: local command] | Use `npm view` only for research/version checks; implementation should use Bun scripts. [VERIFIED: standards/languages/typescript-javascript.md] |
| node_modules | Local script/test execution | Yes [VERIFIED: filesystem test] | Repo lock installed [VERIFIED: node_modules existence; VERIFIED: bun.lock] | Run `bun install` if dependency resolution fails. [VERIFIED: package.json] |
| Playwright test runner | `bun run verify:browser` | Yes [VERIFIED: `bunx playwright --version`] | `1.60.0` [VERIFIED: local command; VERIFIED: package.json] | None for current repo; do not upgrade in Phase 23 unless tests require it. [VERIFIED: package.json] |
| Playwright Chromium browser | Browser checks on clean/local builder | Present locally [VERIFIED: `bunx playwright install chromium --dry-run`; VERIFIED: filesystem test for chromium-1223] | Chromium v1223 / Chrome for Testing 148.0.7778.96 [VERIFIED: dry-run output] | If missing, run `bun run install:browser` before `bun run verify`. [VERIFIED: package.json; CITED: https://playwright.dev/docs/test-cli] |
| Static output `.output/public` | `verify:browser`, `verify:static`, `verify:release` | Exists but may be stale [VERIFIED: filesystem find] | Current local build output includes theme index/detail files. [VERIFIED: filesystem find] | Always run fresh `bun run build` through aggregate `verify` before final evidence. [VERIFIED: package.json; VERIFIED: docs/release-readiness.md] |

**Missing dependencies with no fallback:**

- None found for planning or local execution. [VERIFIED: environment probes]

**Missing dependencies with fallback:**

- Local Bun does not match repo pin; fallback is to run with local Bun and report the version, or upgrade before final proof. [VERIFIED: local command; VERIFIED: package.json]

## Security Domain

Security enforcement is enabled by default because `.planning/config.json` does not set `security_enforcement: false`. [VERIFIED: .planning/config.json; VERIFIED: GSD researcher instructions]

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | The v1.4 scope excludes auth-backed CMS/admin/backend editor work. [VERIFIED: .planning/REQUIREMENTS.md] |
| V3 Session Management | No | The static portfolio phase has no visitor sessions. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: app.config.ts] |
| V4 Access Control | Yes, for public/static content gating | Use public helper selectors and static verifier non-public route exclusion for hidden/draft/unsupported/archived themes. [VERIFIED: src/domain/themes.ts; VERIFIED: scripts/verify-static/sitemap-assets-verifier.ts] |
| V5 Input Validation | Yes | Use existing forbidden href patterns, external-link policy checks, sensitive query key checks, internal link checks, and helper-derived route validation. [VERIFIED: scripts/verify-static/config.ts; VERIFIED: scripts/release-readiness.ts; VERIFIED: scripts/verify-release.ts] |
| V6 Cryptography | No | No cryptographic feature is in Phase 23 scope; token-like output scanning remains a release safety check. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: scripts/verify-release.ts] |

### Known Threat Patterns for This Stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| GitHub token or API residue in built output | Information Disclosure | Keep `verify:no-github-runtime`, static forbidden patterns, and release forbidden output scanning in aggregate verification. [VERIFIED: package.json; VERIFIED: scripts/verify-static/config.ts; VERIFIED: scripts/verify-release.ts] |
| Non-public theme route leakage | Information Disclosure | Verify no static output and no sitemap entries for unknown/non-public theme paths. [VERIFIED: scripts/verify-static/sitemap-assets-verifier.ts; VERIFIED: src/domain/themes.ts] |
| Unsafe generated links such as `javascript:` or `data:` | Tampering / XSS risk | Use generated output forbidden patterns and release internal/external link checks. [VERIFIED: scripts/verify-static/config.ts; VERIFIED: scripts/verify-release.ts] |
| Sensitive query keys in external links | Information Disclosure | Use `externalLinkFindingsForRoutes()` sensitive query key detection with redacted messages. [VERIFIED: scripts/release-readiness.ts; VERIFIED: scripts/release-readiness.test.ts] |
| Overstated automated accessibility/security evidence | Repudiation / Process Integrity | Evidence labels must name only automated local gates and docs must keep manual/hosted checks as prose. [VERIFIED: 23-CONTEXT.md; CITED: https://playwright.dev/docs/accessibility-testing] |

## Sources

### Primary (HIGH Confidence)

- `.planning/phases/23-theme-verification-and-release-contract/23-CONTEXT.md` - Phase 23 decisions, boundaries, deferred ideas, and implementation targets. [VERIFIED: local file read]
- `.planning/REQUIREMENTS.md` - VERIFY-01 through VERIFY-04 and v1.4 exclusions. [VERIFIED: local file read]
- `.planning/ROADMAP.md` - Phase goal and success criteria. [VERIFIED: local file read]
- `.planning/STATE.md` - Phase continuity and prior phase completion state. [VERIFIED: local file read]
- `AGENTS.md`, `AGENTS.bright-builds.md`, `standards-overrides.md`, `standards/core/*.md`, `standards/languages/typescript-javascript.md` - repo and Bright Builds constraints. [VERIFIED: local file read]
- `package.json` - scripts and pinned dependencies. [VERIFIED: local file read]
- `scripts/verify-static/*`, `scripts/verify-release.ts`, `scripts/release-readiness.ts`, related tests, `tests/browser-release.playwright.ts` - current implementation patterns. [VERIFIED: local file read]
- `src/domain/routes.ts`, `src/domain/themes.ts`, `src/domain/seo.ts` - route, theme, metadata, JSON-LD, sitemap, and social fallback helpers. [VERIFIED: local file read]
- npm registry via `npm view` - current/latest versions and modified timestamps for core packages. [VERIFIED: npm registry]

### Secondary (MEDIUM Confidence)

- Playwright accessibility docs - axe usage and automated accessibility disclaimer. [CITED: https://playwright.dev/docs/accessibility-testing]
- Playwright projects docs - multi-project configuration for desktop/mobile/reduced-motion style runs. [CITED: https://playwright.dev/docs/test-projects]
- Playwright web server docs - config-managed local web server for tests. [CITED: https://playwright.dev/docs/test-webserver]
- Playwright CLI docs - `playwright install chromium` and `--dry-run`. [CITED: https://playwright.dev/docs/test-cli]
- Deque `@axe-core/playwright` README - `AxeBuilder` usage with Playwright. [CITED: https://github.com/dequelabs/axe-core-npm/blob/develop/packages/playwright/README.md]
- SolidStart route pre-rendering docs - SSG route list behavior. [CITED: https://docs.solidjs.com/solid-start/building-your-application/route-prerendering]
- SolidStart head/metadata docs - `@solidjs/meta` route metadata. [CITED: https://docs.solidjs.com/solid-start/building-your-application/head-and-metadata]
- Bun quickstart/docs - `bun run` package script execution. [CITED: https://bun.com/docs/quickstart]

### Tertiary (LOW Confidence)

- None used for recommendations. [VERIFIED: source review]

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - dependencies and scripts are in `package.json`, local tools were probed, and package versions were checked against npm registry. [VERIFIED: package.json; VERIFIED: local commands; VERIFIED: npm registry]
- Architecture: HIGH - current repo modules already implement the relevant static, browser, release, and doc-check patterns. [VERIFIED: scripts/verify-static/*; VERIFIED: scripts/release-readiness.ts; VERIFIED: tests/browser-release.playwright.ts]
- Pitfalls: HIGH - each pitfall maps to a concrete file mismatch, phase decision, or official doc limitation. [VERIFIED: 23-CONTEXT.md; VERIFIED: package.json; CITED: https://playwright.dev/docs/accessibility-testing]
- Environment: MEDIUM-HIGH - tools were probed locally, but final execution may run after environment changes. [VERIFIED: local commands]
- Security: MEDIUM-HIGH - phase is static/release-verification only, and threat patterns map to existing local guards. [VERIFIED: .planning/REQUIREMENTS.md; VERIFIED: scripts/verify-release.ts]

**Research date:** 2026-06-18 [VERIFIED: phase context date]
**Valid until:** 2026-07-18 for repo-local architecture; re-check npm/tool versions before dependency changes. [VERIFIED: npm registry; ASSUMED: 30-day stability estimate]
