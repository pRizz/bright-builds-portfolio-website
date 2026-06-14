# Phase 17: Writing Verification and Release Contract - Research

**Researched:** 2026-06-14 [VERIFIED: system date]
**Domain:** Static release verification, browser accessibility release checks, release-readiness contract, and evidence labeling for SolidStart writing routes [VERIFIED: .planning/ROADMAP.md; .planning/phases/17-writing-verification-and-release-contract/17-CONTEXT.md]
**Confidence:** HIGH [VERIFIED: source audit plus `bun run build && bun run verify:static`, `bun run verify:browser`, `bun run verify:release`, and targeted Vitest commands]

<user_constraints>

## User Constraints (from CONTEXT.md)

Source: `.planning/phases/17-writing-verification-and-release-contract/17-CONTEXT.md` [VERIFIED: file read]

### Locked Decisions

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

### Deferred Ideas (OUT OF SCOPE)

- Rich per-writing raster OG images remain future work.
- RSS/Atom, search, tag archives, comments, newsletter capture, CMS/admin, MDX ingestion, and runtime content integrations remain future or out of scope.
- Live external-link reachability automation remains out of scope; manual smoke checks stay documented.

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| VERIFY-01 | Static verification checks generated writing HTML for expected content, metadata, JSON-LD, sitemap inclusion and exclusion, related-project links, and forbidden runtime API residue. | `scripts/verify-static.ts` already derives expected writing text, metadata, `BlogPosting`, `ItemList`, sitemap inclusion/exclusion, related links, and forbidden residue from writing/SEO helpers, and `bun run build && bun run verify:static` passed for 13 routes including `/writing` and two writing detail routes. [VERIFIED: scripts/verify-static.ts; src/domain/writing.ts; src/domain/seo.ts; command output] |
| VERIFY-02 | Browser release checks include writing routes for axe, dark desktop and mobile layout, keyboard reachability, and reduced-motion behavior where relevant. | Axe and desktop/mobile dark layout already iterate `prerenderRoutes`, which includes writing routes, but explicit keyboard and reduced-motion scenarios still use project-centric representative routes. [VERIFIED: tests/browser-release.playwright.ts; src/domain/routes.ts; `bun run verify:browser` output] |
| VERIFY-03 | Release-readiness docs and checks identify writing route coverage as part of `bun run install:browser && bun run verify`. | `docs/release-readiness.md` and `scripts/release-readiness.ts` currently require project-detail coverage facts but do not require writing-route coverage facts. [VERIFIED: docs/release-readiness.md; scripts/release-readiness.ts; rg output] |
| VERIFY-04 | The aggregate `bun run verify` gate passes with writing routes included and release evidence labels name only automated writing coverage. | `package.json` aggregate `verify` already runs build, browser, static, and release gates, and `bun run verify:release` scanned writing route HTML, but current labels omit writing route coverage. [VERIFIED: package.json; `bun run verify:release` output] |

</phase_requirements>

## Summary

Phase 17 should be a release-contract closure phase, not a writing-feature phase. Static writing verification is already materially implemented in `scripts/verify-static.ts`: it derives route expectations from `publicWritingEntries()`, `writingDetailRoutes()`, `metadataForWritingEntry()`, `writingBlogPostingJsonLd()`, `writingItemListJsonLd()`, `sitemapXml()`, and related-project helpers, and the current built verifier passed against 13 prerendered routes. [VERIFIED: scripts/verify-static.ts; src/domain/writing.ts; src/domain/seo.ts; `bun run build && bun run verify:static` output]

The remaining work is precise. Browser release checks need explicit writing keyboard reachability and one representative writing reduced-motion surface, because current explicit scenarios cover home/project paths while route-wide axe/layout already includes writing. Release-readiness docs, document guards, and evidence labels need writing-route facts so `bun run install:browser && bun run verify` names what it actually proves without claiming hosted audits, live link crawling, screenshot baselines, or manual checks as automation. [VERIFIED: tests/browser-release.playwright.ts; docs/release-readiness.md; scripts/release-readiness.ts; scripts/verify-release.ts; scripts/verify-release.test.ts]

**Primary recommendation:** Plan one narrow implementation pass that adds helper-derived browser writing scenarios, release-readiness writing facts, truthful evidence-label tests, and at most a static verifier success-message label; do not refactor static verification or add dependencies. [VERIFIED: 17-CONTEXT.md; scripts/verify-static.ts; package.json; command outputs]

## Project Constraints (from AGENTS.md)

- Read `AGENTS.md`, `AGENTS.bright-builds.md`, `standards-overrides.md`, and relevant pinned Bright Builds standards before planning or implementation. [VERIFIED: AGENTS.md; AGENTS.bright-builds.md; CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/index.md]
- The site is dark-primary; default user-facing UI should render with Tailwind selector dark mode and `.dark` active on the root document. [VERIFIED: AGENTS.md]
- Light-first classes such as `bg-white`, `bg-stone-50`, and `text-zinc-950` are exceptions that need a local reason. [VERIFIED: AGENTS.md]
- UI visual verification must include desktop and mobile dark rendering, contrast/readability, and text-overlap checks. [VERIFIED: AGENTS.md]
- Repo-changing work should stay inside GSD workflow artifacts unless the user explicitly bypasses that workflow. [VERIFIED: AGENTS.md]
- TypeScript/Bun repo work should use existing Bun scripts and avoid adding Python automation. [CITED: Bright Builds TypeScript/JavaScript standard; VERIFIED: package.json]
- Pure release-readiness or verifier helper changes need focused unit tests with Arrange/Act/Assert structure. [CITED: Bright Builds testing standard; VERIFIED: 17-CONTEXT.md]
- Prefer functional-core/imperative-shell patterns; keep release facts and labels as pure helper outputs and filesystem or browser work in thin shells. [CITED: Bright Builds architecture standard; VERIFIED: scripts/release-readiness.ts; scripts/verify-release.ts]
- Internal nullable names should use `maybe...`, and existing code already follows this in writing and verifier helpers. [CITED: Bright Builds code-shape and TypeScript standards; VERIFIED: src/domain/writing.ts; scripts/verify-static.ts]
- No active local standards override is defined beyond the placeholder table. [VERIFIED: standards-overrides.md]
- Owner-specific OpenLinks guidance requires low-intrusion visible placement plus metadata support; this phase should preserve footer/about/contact links and `Person.sameAs` without adding a writing-page CTA. [VERIFIED: AGENTS.bright-builds.md; VERIFIED: openlinks-identity-presence skill; VERIFIED: src/domain/profile.ts; scripts/verify-static.ts]
- No project-local skill files were found under `.claude/skills/` or `.agents/skills/`. [VERIFIED: `find .claude/skills .agents/skills -maxdepth 2 -type f -name SKILL.md`]

## Standard Stack

### Core

| Library / Tool | Repo Version | Registry / Runtime Check | Purpose | Why Standard |
|---|---:|---|---|---|
| Bun | `packageManager: bun@1.3.14` | Local `bun --version` is `1.3.9`; npm `bun` package latest is `1.3.14` modified 2026-05-13. [VERIFIED: package.json; command output; npm registry] | Runs repo scripts and aggregate release gate. | The repo standardizes on Bun scripts, and Phase 17 should use existing script entrypoints. [VERIFIED: package.json; CITED: Bright Builds TypeScript/JavaScript standard] |
| SolidStart / Vinxi | `@solidjs/start@1.3.2`, `vinxi@0.5.11` | npm latest matches repo pins as of research. [VERIFIED: package.json; npm registry] | Builds the static `.output/public` artifact. | Existing build generated `.output/public` and prerendered 13 routes. [VERIFIED: `bun run build` output] |
| Playwright | `@playwright/test@1.60.0` | npm latest matches repo pin; CLI reported `Version 1.60.0`. [VERIFIED: package.json; npm registry; command output] | Browser release checks for route coverage, keyboard, reduced motion, and layout. | Existing `verify:browser` runs checked-in Playwright projects over static output. [VERIFIED: package.json; playwright.config.ts; `bun run verify:browser` output] |
| axe Playwright | `@axe-core/playwright@4.11.3` | npm latest matches repo pin. [VERIFIED: package.json; npm registry] | Accessibility scans in browser release checks. | Existing browser tests run axe on every `prerenderRoutes` route. [VERIFIED: tests/browser-release.playwright.ts] |
| Vitest | `vitest@4.1.7` | npm latest is `4.1.8` modified 2026-06-12; repo pins `4.1.7`. [VERIFIED: package.json; npm registry] | Unit tests for pure release-readiness and release-verifier helpers. | Existing tests passed 21/21 for release readiness and release verifier helpers. [VERIFIED: `bun run test scripts/release-readiness.test.ts scripts/verify-release.test.ts` output] |
| Biome | `@biomejs/biome@2.4.15` | npm latest is `2.5.0` modified 2026-06-12; repo pins `2.4.15`. [VERIFIED: package.json; npm registry] | Formatting and lint/check coverage. | Aggregate `bun run verify` includes `format:check` and `check`. [VERIFIED: package.json] |
| TypeScript | `typescript@6.0.3` | npm latest matches repo pin. [VERIFIED: package.json; npm registry] | Static type checking. | Aggregate `bun run verify` includes `typecheck`. [VERIFIED: package.json] |

### Supporting

| Helper Surface | Version | Purpose | When to Use |
|---|---:|---|---|
| `src/domain/writing.ts` | repo-owned | Public writing entries, route helpers, nullable lookup, and related-project helpers. [VERIFIED: src/domain/writing.ts] | Use for all representative writing route selection and static expectations. [VERIFIED: 17-CONTEXT.md] |
| `src/domain/seo.ts` | repo-owned | Writing metadata, `BlogPosting`, `ItemList`, sitemap, robots, and `Person.sameAs`. [VERIFIED: src/domain/seo.ts] | Use for static verifier expectations and OpenLinks metadata preservation. [VERIFIED: scripts/verify-static.ts] |
| `src/domain/routes.ts` | repo-owned | `siteRoutes`, `prerenderRoutes`, navigation routes, and route lookup. [VERIFIED: src/domain/routes.ts] | Keep axe/layout checks derived from `prerenderRoutes`. [VERIFIED: tests/browser-release.playwright.ts] |
| `scripts/release-readiness.ts` | repo-owned | Release-readiness document facts, external-link policy, and evidence labels. [VERIFIED: scripts/release-readiness.ts] | Add writing document facts and central evidence label changes here. [VERIFIED: 17-CONTEXT.md] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|---|---|---|
| Existing helper-derived static verifier | Duplicated slug arrays or expected route lists | Rejected because locked decisions require writing checks to read public writing entries, writing routes, metadata helpers, JSON-LD helpers, sitemap helpers, and related-project helpers. [VERIFIED: 17-CONTEXT.md] |
| Existing Playwright + axe suite | Screenshot baselines or hosted browser audits | Rejected because browser checks must stay deterministic and local, with no screenshot baselines or hosted audits in this phase. [VERIFIED: 17-CONTEXT.md] |
| Existing external-link policy checker | Live external-link crawler | Rejected because live external-link reachability automation is explicitly out of scope and manual smoke checks stay documented. [VERIFIED: REQUIREMENTS.md; 17-CONTEXT.md; docs/release-readiness.md] |
| Existing release labels | New package script for writing | Rejected because the aggregate `verify` script already includes `verify:browser`, `verify:static`, and `verify:release`; no new package script is needed. [VERIFIED: package.json; 17-CONTEXT.md] |

**Installation:**

```bash
# No new packages. Keep the existing package.json and bun.lock dependency surface.
```

**Version verification:** Registry checks were run for the existing verification stack. Playwright, axe Playwright, SolidStart, Vinxi, TypeScript, and Bun package pins match registry latest; Vitest and Biome have newer registry versions, but Phase 17 should not plan upgrades because this phase is release-contract coverage, not dependency maintenance. [VERIFIED: npm registry; package.json; 17-CONTEXT.md]

## Current Coverage Audit

| Requirement | Already Covered | Precise Remaining Gap |
|---|---|---|
| VERIFY-01 | Generated writing body content, detail route existence, route-specific metadata, article metadata tags, `BlogPosting` JSON-LD, writing index `ItemList` JSON-LD, sitemap include/exclude behavior, related project links, unknown writing route exclusion, OpenLinks `sameAs`, remote visual asset bans, and runtime/template residue checks are already in `scripts/verify-static.ts`. [VERIFIED: scripts/verify-static.ts] | Static verifier success output is generic: `Verified 13 prerendered routes, metadata, JSON-LD, assets, sitemap, and robots...`; it does not explicitly name writing route coverage. [VERIFIED: `bun run build && bun run verify:static` output] |
| VERIFY-02 | Axe and dark desktop/mobile layout coverage already loop over `prerenderRoutes`, and `prerenderRoutes` includes `/writing` plus public writing detail routes. [VERIFIED: tests/browser-release.playwright.ts; src/domain/routes.ts; `bun run verify:browser` output] | Keyboard coverage does not explicitly assert `/writing`, a public writing detail route, detail-to-`/writing`, or related project navigation from writing. Reduced-motion coverage checks only `/` and a representative project detail route. [VERIFIED: tests/browser-release.playwright.ts] |
| VERIFY-03 | The docs already describe `bun run install:browser && bun run verify`, static output, browser gate, static gate, release gate, Cloudflare Pages, and manual external-link smoke checks. [VERIFIED: docs/release-readiness.md] | Docs and `requiredReleaseReadinessDocumentFacts` only name project-detail route coverage; they do not require writing route coverage, writing static metadata/JSON-LD/sitemap/link coverage, writing browser coverage, or a representative writing smoke route. [VERIFIED: docs/release-readiness.md; scripts/release-readiness.ts] |
| VERIFY-04 | `package.json` aggregate `verify` already runs format/check/type/test/curation/no-runtime/helper-surface/visual/build/browser/static/release, and release verifier scans writing route HTML after build. [VERIFIED: package.json; `bun run verify:release` output] | `releaseReadinessEvidenceLabels()` and `releaseEvidenceLabels()` omit `writing route coverage`, and current tests assert that omission as the exact expected list. [VERIFIED: scripts/release-readiness.ts; scripts/release-readiness.test.ts; scripts/verify-release.test.ts; `bun run verify:release` output] |

## Architecture Patterns

### Recommended Project Structure

```text
scripts/
  release-readiness.ts       # pure release facts, external-link policy, evidence labels
  release-readiness.test.ts  # unit tests for required doc facts and label truthfulness
  verify-release.ts          # static output scanner and evidence-label printing
  verify-release.test.ts     # unit tests for release scanner and labels
  verify-static.ts           # existing generated-output verifier; avoid broad rewrites
tests/
  browser-release.playwright.ts # route-wide axe/layout plus representative keyboard/reduced-motion flows
docs/
  release-readiness.md       # human release contract that guards must enforce
src/domain/
  writing.ts                 # public writing route source of truth
  seo.ts                     # metadata, JSON-LD, sitemap, OpenLinks sameAs source of truth
  routes.ts                  # prerender route source of truth
```

This matches the current repo layout and should not require new directories. [VERIFIED: package.json; listed source files]

### Pattern 1: Helper-Derived Static Expectations

**What:** Static verification should compare generated HTML and sitemap output against pure domain and SEO helpers instead of copied slugs or copied metadata strings. [VERIFIED: scripts/verify-static.ts; 17-CONTEXT.md]

**When to use:** Use this for VERIFY-01 and any static verifier message tightening. [VERIFIED: REQUIREMENTS.md; 17-CONTEXT.md]

**Example:**

```ts
// Source: scripts/verify-static.ts and src/domain/writing.ts [VERIFIED]
for (const route of writingDetailRoutes()) {
  routeHtmlPath(outputRoot, route);
}

for (const entry of publicWritingEntries()) {
  assertMetadataForWritingEntry(entry, readRouteHtml(outputRoot, writingDetailPath(entry)));
  assertWritingBlogPostingJsonLd(entry, readRouteHtml(outputRoot, writingDetailPath(entry)));
}
```

### Pattern 2: Exhaustive Route Loops Plus Representative Flows

**What:** Keep exhaustive axe/layout loops over `prerenderRoutes`, then add explicit keyboard and reduced-motion scenarios for release-critical flows. [VERIFIED: tests/browser-release.playwright.ts; 17-CONTEXT.md]

**When to use:** Use this for VERIFY-02. [VERIFIED: REQUIREMENTS.md]

**Example:**

```ts
// Source pattern: tests/browser-release.playwright.ts; helper source: src/domain/writing.ts [VERIFIED]
function representativeWritingDetailRoute(): string {
  const maybeRoute = writingDetailRoutes()[0];

  if (!maybeRoute) {
    throw new Error("Expected at least one public writing detail route for release coverage.");
  }

  return maybeRoute;
}
```

### Pattern 3: Required-Facts Release Document Guard

**What:** Store release-readiness claims as required text facts and test them by removing a fact from a temporary document fixture. [VERIFIED: scripts/release-readiness.ts; scripts/release-readiness.test.ts]

**When to use:** Use this for VERIFY-03 so docs cannot claim less than the release contract. [VERIFIED: 17-CONTEXT.md]

**Example:**

```ts
// Source pattern: scripts/release-readiness.ts [VERIFIED]
const requiredReleaseReadinessDocumentFacts = [
  { label: "writing route coverage", text: "writing route coverage" },
  {
    label: "writing browser coverage",
    text: "writing axe, layout, keyboard, and reduced-motion coverage",
  },
];
```

### Pattern 4: Centralized Truthful Evidence Labels

**What:** Keep labels centralized in `releaseReadinessEvidenceLabels()` and inherited by `releaseEvidenceLabels()`. [VERIFIED: scripts/release-readiness.ts; scripts/verify-release.ts]

**When to use:** Use this for VERIFY-04 after static, browser, and release-readiness checks actually enforce writing coverage. [VERIFIED: 17-CONTEXT.md]

**Example:**

```ts
// Source pattern: scripts/release-readiness.ts and scripts/verify-release.ts [VERIFIED]
export function releaseReadinessEvidenceLabels(): readonly string[] {
  return [
    "SEO/static metadata",
    "project detail route coverage",
    "writing route coverage",
    "static performance budgets",
    "external link policy",
    "Cloudflare/static deployment",
    "preview and deploy smoke checks",
  ];
}
```

### Anti-Patterns to Avoid

- **Duplicating writing slugs in tests or docs guards:** It will drift from `publicWritingEntries()` and `writingDetailRoutes()`. [VERIFIED: 17-CONTEXT.md; src/domain/writing.ts]
- **Claiming hosted or live-link coverage in labels:** Existing tests explicitly reject labels containing `hosted audit`, `network`, or `live link`. [VERIFIED: scripts/verify-release.test.ts]
- **Replacing route-wide loops with hand-picked route lists:** Current browser axe/layout coverage intentionally derives from `prerenderRoutes`. [VERIFIED: tests/browser-release.playwright.ts; src/domain/routes.ts]
- **Adding a new package script for writing coverage:** The aggregate `verify` script already includes browser, static, and release checks. [VERIFIED: package.json; 17-CONTEXT.md]
- **Broadly refactoring `scripts/verify-static.ts`:** The file is 1180 lines and already passes the writing static requirement; Phase 17 should not turn a label or assertion-tightening task into a large verifier refactor. [VERIFIED: `wc -l`; `bun run build && bun run verify:static` output]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---|---|---|---|
| Writing route selection | A copied array of `/writing/...` strings | `writingDetailRoutes()` or `publicWritingEntries()` | It preserves public/draft filtering and fails with the domain source of truth. [VERIFIED: src/domain/writing.ts; 17-CONTEXT.md] |
| Writing metadata expectations | Literal title/canonical/OG/Twitter strings duplicated in checks | `metadataForWritingEntry()` and `metadataForRoute()` | Existing static verifier already uses these helpers for route-specific checks. [VERIFIED: scripts/verify-static.ts; src/domain/seo.ts] |
| Writing JSON-LD expectations | Ad hoc JSON string matching | `writingBlogPostingJsonLd()` and `writingItemListJsonLd()` | Phase 16 helpers own the expected `BlogPosting` and writing index `ItemList` shapes. [VERIFIED: src/domain/seo.ts; scripts/verify-static.ts] |
| Sitemap coverage | Manual XML snippets only | `sitemapXml()` plus explicit include/exclude assertions | Existing verifier checks helper equality and public/non-public writing route behavior. [VERIFIED: scripts/verify-static.ts] |
| Browser accessibility | Custom DOM crawler or screenshot diff | Playwright + axe and current layout helper | Existing `verify:browser` is deterministic and local. [VERIFIED: tests/browser-release.playwright.ts; playwright.config.ts] |
| External-link release confidence | Live crawler | `externalLinkPolicies` plus documented manual smoke checks | Live external-link automation is out of scope and non-deterministic. [VERIFIED: REQUIREMENTS.md; scripts/release-readiness.ts; docs/release-readiness.md] |
| Evidence labels | Scattered strings in multiple scripts | `releaseReadinessEvidenceLabels()` and `releaseEvidenceLabels()` | Current release output and tests already centralize labels. [VERIFIED: scripts/release-readiness.ts; scripts/verify-release.ts; scripts/verify-release.test.ts] |

**Key insight:** Phase 17 should connect existing helper-derived proof to explicit release evidence; custom route lists, live crawlers, screenshot baselines, or new scripts would increase drift and overclaiming risk. [VERIFIED: 17-CONTEXT.md; package.json; current verifier files]

## Common Pitfalls

### Pitfall 1: Treating Axe/Layout Coverage As Complete Browser Coverage

**What goes wrong:** The route-wide loop proves axe and layout for writing routes, but keyboard and reduced-motion assertions can still miss writing-specific navigation. [VERIFIED: tests/browser-release.playwright.ts]

**Why it happens:** `prerenderRoutes` loops are exhaustive, while keyboard and reduced-motion tests use representative routes. [VERIFIED: tests/browser-release.playwright.ts; src/domain/routes.ts]

**How to avoid:** Keep the loops, then add helper-derived representative writing keyboard and reduced-motion flows. [VERIFIED: 17-CONTEXT.md]

**Warning signs:** Browser tests still import only `projectDetailRoutes` and not `writingDetailRoutes` or `publicWritingEntries`. [VERIFIED: tests/browser-release.playwright.ts]

### Pitfall 2: Overclaiming Release Evidence

**What goes wrong:** Labels such as `writing route coverage` become misleading if docs guards, static checks, and browser checks do not all enforce writing behavior. [VERIFIED: 17-CONTEXT.md]

**Why it happens:** Evidence labels are human-readable summaries and can drift from the scripts that actually run. [VERIFIED: scripts/release-readiness.ts; scripts/verify-release.ts]

**How to avoid:** Add the label only after adding browser writing scenarios and release-readiness required facts, then update both release-readiness and release-verifier tests. [VERIFIED: 17-CONTEXT.md; scripts/release-readiness.test.ts; scripts/verify-release.test.ts]

**Warning signs:** `bun run verify:release` output names writing coverage before tests enforce writing docs/browser coverage. [VERIFIED: `bun run verify:release` output; 17-CONTEXT.md]

### Pitfall 3: Letting Docs Drift From Guards

**What goes wrong:** `docs/release-readiness.md` can mention writing coverage without `releaseReadinessDocumentFindings()` requiring the same claims. [VERIFIED: docs/release-readiness.md; scripts/release-readiness.ts]

**Why it happens:** The docs are Markdown while the guard is a required string list. [VERIFIED: scripts/release-readiness.ts]

**How to avoid:** Add exact writing facts to docs and guard tests in the same task. [VERIFIED: scripts/release-readiness.test.ts]

**Warning signs:** Unit tests do not include fixture-removal cases for writing route coverage, writing static coverage, writing browser coverage, or a representative writing route. [VERIFIED: scripts/release-readiness.test.ts]

### Pitfall 4: Duplicating Writing Route Data

**What goes wrong:** A hard-coded `/writing/...` fixture can keep passing after writing data changes or public entries change order. [VERIFIED: src/domain/writing.ts; scripts/verify-static.ts]

**Why it happens:** Tests and docs often need representative paths, but the domain already has route helpers. [VERIFIED: src/domain/writing.ts]

**How to avoid:** Use `writingDetailRoutes()[0]` or `publicWritingEntries()[0]` and throw a clear error when no public writing route exists. [VERIFIED: 17-CONTEXT.md]

**Warning signs:** New code repeats `agentic-engineering-workflows` outside docs smoke-check prose instead of deriving it. [VERIFIED: src/domain/writing.ts]

### Pitfall 5: Turning Static Verifier Output Into a Refactor

**What goes wrong:** A generic success message invites a broad rewrite even though the assertions already cover writing. [VERIFIED: scripts/verify-static.ts; command output]

**Why it happens:** The static verifier is large and contains many historical release checks. [VERIFIED: `wc -l scripts/verify-static.ts`]

**How to avoid:** Limit static verifier work to a message/label or a small assertion-tightening patch unless a real failing gap appears. [VERIFIED: 17-CONTEXT.md; `bun run build && bun run verify:static` output]

**Warning signs:** A plan proposes splitting `verify-static.ts` before addressing browser/docs/labels. [VERIFIED: current gap audit]

## Code Examples

### Representative Writing Route Helper

```ts
// Source pattern: tests/browser-release.playwright.ts and src/domain/writing.ts [VERIFIED]
function representativeWritingDetailRoute(): string {
  const maybeRoute = writingDetailRoutes()[0];

  if (!maybeRoute) {
    throw new Error("Expected at least one public writing detail route for release coverage.");
  }

  return maybeRoute;
}
```

### Keyboard Writing Flow Shape

```ts
// Source pattern: tests/browser-release.playwright.ts; route/link facts from src/routes/writing [VERIFIED]
expect(hasFocusedInternalPath(focusedTargets, "/writing"), "focus reaches Writing nav").toBe(true);

await page.goto("/writing");
const writingFocusedTargets = await keyboardFocusTargets(page);
expect(hasFocusedInternalPath(writingFocusedTargets, representativeWritingDetailRoute())).toBe(true);

await page.goto(representativeWritingDetailRoute());
const detailFocusedTargets = await keyboardFocusTargets(page);
expect(hasFocusedInternalPath(detailFocusedTargets, "/writing")).toBe(true);
expect(hasFocusedInternalPath(detailFocusedTargets, representativeRelatedProjectRoute())).toBe(true);
```

### Release-Readiness Fact Test

```ts
// Source pattern: scripts/release-readiness.test.ts [VERIFIED]
it("reports missing writing route coverage guidance", () => {
  // Arrange
  const fixture = releaseDocumentFixtureWithout("writing route coverage");

  try {
    // Act
    const findings = releaseReadinessDocumentFindings(fixture.path);
    const messages = findings.map((finding) => finding.message).join("\n");

    // Assert
    expect(messages).toContain(
      "Release-readiness document is missing writing route coverage: writing route coverage.",
    );
  } finally {
    fixture.cleanup();
  }
});
```

### Truthful Label Guard

```ts
// Source pattern: scripts/verify-release.test.ts [VERIFIED]
const labels = releaseEvidenceLabels();
const joinedLabels = labels.join(" ");

expect(labels).toContain("writing route coverage");
expect(joinedLabels).not.toContain("hosted audit");
expect(joinedLabels).not.toContain("network");
expect(joinedLabels).not.toContain("live link");
```

## State of the Art

| Old / Insufficient Approach | Current Phase 17 Approach | When Changed / Evidence | Impact |
|---|---|---|---|
| Static verifier proves generic routes without writing-specific route proof. | Static verifier now imports writing helpers and checks public writing details, metadata, JSON-LD, sitemap include/exclude behavior, and related projects. | Present before Phase 17 planning; `bun run build && bun run verify:static` passed. [VERIFIED: scripts/verify-static.ts; command output] | VERIFY-01 needs little or no assertion work. [VERIFIED: gap audit] |
| Browser suite proves only project-centric keyboard and reduced-motion paths. | Phase 17 should keep route-wide axe/layout and add explicit writing representative paths. | Current browser suite passes 68 tests but explicit scenarios are project-centric. [VERIFIED: `bun run verify:browser` output; tests/browser-release.playwright.ts] | VERIFY-02 is the main code-test gap. [VERIFIED: gap audit] |
| Release docs and labels name project detail coverage only. | Phase 17 should add writing route coverage facts and label only after scripts enforce them. | Current docs and labels omit writing coverage. [VERIFIED: docs/release-readiness.md; scripts/release-readiness.ts; `bun run verify:release` output] | VERIFY-03 and VERIFY-04 are release-contract gaps. [VERIFIED: gap audit] |

**Deprecated/outdated for this phase:**

- Live external-link crawling is out of scope and should remain manual smoke-check documentation. [VERIFIED: REQUIREMENTS.md; 17-CONTEXT.md; docs/release-readiness.md]
- Screenshot baselines and hosted audits are out of scope for browser release checks. [VERIFIED: 17-CONTEXT.md]
- A new `verify:writing` package script is unnecessary because `verify` already aggregates build, browser, static, and release checks. [VERIFIED: package.json; 17-CONTEXT.md]

## Minimal Plan Structure

Use one plan for the phase unless the planner wants to split docs and browser work for review convenience. The work is tightly coupled and can be verified through the existing aggregate gate. [VERIFIED: package.json; current gap audit]

1. **Baseline and static verifier label check:** Record that `bun run build && bun run verify:static` already proves VERIFY-01; optionally update the final static verifier success message to mention writing coverage without changing assertion architecture. [VERIFIED: command output; scripts/verify-static.ts; 17-CONTEXT.md]
2. **Browser writing scenarios:** Import writing helpers, add a clear-failing representative writing detail helper, assert keyboard focus reaches `/writing`, a public writing detail route, back-to-writing, and a related project route when present; include one representative writing route in reduced-motion checks. [VERIFIED: tests/browser-release.playwright.ts; src/domain/writing.ts; src/routes/writing/[slug].tsx]
3. **Release-readiness docs and guard facts:** Update `docs/release-readiness.md` to describe writing route coverage under the primary gate, static output, browser gate, preview smoke path, and production smoke path; add matching `requiredReleaseReadinessDocumentFacts` and fixture-removal tests. [VERIFIED: docs/release-readiness.md; scripts/release-readiness.ts; scripts/release-readiness.test.ts]
4. **Evidence labels:** Add `writing route coverage` to centralized release-readiness labels after the checks exist, then update `verify-release` label expectations and anti-overclaim assertions. [VERIFIED: scripts/release-readiness.ts; scripts/verify-release.ts; scripts/verify-release.test.ts]
5. **Verification:** Run targeted helper tests, build/static/release/browser checks, then the aggregate gate or documented clean-builder equivalent. [VERIFIED: package.json; 17-CONTEXT.md]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|---|---|---:|---|---|
| Bun | All repo scripts and aggregate verification | Yes | Local `1.3.9`; repo pin `1.3.14`; npm latest `1.3.14`. [VERIFIED: command output; package.json; npm registry] | Use `BUN_VERSION=1.3.14` on clean builder as docs require. [VERIFIED: docs/release-readiness.md] |
| Node | Ecosystem CLI compatibility | Yes | `v24.13.0` locally; docs pin Cloudflare `NODE_VERSION=22.16.0`. [VERIFIED: command output; docs/release-readiness.md] | Keep using Bun scripts; do not plan Node-specific automation. [VERIFIED: package.json] |
| Playwright CLI / Chromium | Browser release checks | Yes | Playwright `1.60.0`; `bun run verify:browser` passed. [VERIFIED: command output] | `bun run install:browser` provisions Chromium on clean builders. [VERIFIED: package.json; docs/release-readiness.md] |
| Git | Optional research-doc commit | Yes | `git version 2.53.0`. [VERIFIED: command output] | None needed. [VERIFIED: command output] |

**Missing dependencies with no fallback:**

- None found for Phase 17 research and expected verification. [VERIFIED: command outputs]

**Missing dependencies with fallback:**

- Local Bun is older than the repo pin, but the clean-builder docs already specify `BUN_VERSION=1.3.14`; existing targeted tests, build, static verifier, browser verifier, and release verifier ran successfully with local Bun `1.3.9`. [VERIFIED: command outputs; docs/release-readiness.md]

## Security Domain

Config does not explicitly set `security_enforcement: false`, so this research includes the security domain. [VERIFIED: .planning/config.json]

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---|---:|---|
| V2 Authentication | No | Phase 17 does not add authentication, CMS/admin, or runtime editor behavior. [VERIFIED: REQUIREMENTS.md; 17-CONTEXT.md] |
| V3 Session Management | No | Static release verification has no session state. [VERIFIED: package.json; scripts/verify-release.ts] |
| V4 Access Control | No | Hidden/draft writing exposure is covered by static route/sitemap exclusion and domain helpers, not an access-control system. [VERIFIED: scripts/verify-static.ts; src/domain/writing.ts] |
| V5 Input Validation | Yes | External anchors are checked for HTTPS, policy coverage, and sensitive query keys; built output is scanned for forbidden runtime/token residue. [VERIFIED: scripts/release-readiness.ts; scripts/verify-release.ts] |
| V6 Cryptography | No | Phase 17 does not add crypto or token generation. [VERIFIED: REQUIREMENTS.md; 17-CONTEXT.md] |

### Known Threat Patterns for This Stack

| Pattern | STRIDE | Standard Mitigation |
|---|---|---|
| Public token leakage in generated output | Information Disclosure | Keep forbidden output patterns for `GITHUB_TOKEN`, public GitHub token prefixes, and token-like values in release/static verifiers. [VERIFIED: scripts/verify-static.ts; scripts/verify-release.ts] |
| Runtime GitHub API dependency leaking into static output | Information Disclosure / Reliability | Keep `api.github.com`, `github.com/graphql`, and `@octokit/` output bans. [VERIFIED: scripts/verify-static.ts; scripts/verify-release.ts] |
| Unsafe generated anchor protocols | Tampering / XSS-adjacent navigation risk | Keep static verifier bans for `href="javascript:` and `href="data:`. [VERIFIED: scripts/verify-static.ts] |
| Non-HTTPS or uncovered external origins | Spoofing / Tampering | Keep `externalLinkFindingsForRoutes()` policy checks instead of live crawling. [VERIFIED: scripts/release-readiness.ts] |
| Overstated release evidence | Repudiation / Process Integrity | Keep tests that reject labels claiming hosted audit, network, or live-link automation. [VERIFIED: scripts/verify-release.test.ts] |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|---|---|---|
| A1 | The validity window is 7 days for registry/runtime-version details and 30 days for repo-internal architecture findings if Phase 17 source files do not change. [ASSUMED] | Metadata | Planner may rely on stale package/version context if dependency pins or release scripts change sooner. |

## Open Questions

1. **Should the static verifier success message explicitly name writing route coverage?** [VERIFIED: command output]
   - What we know: Static assertions already prove the writing static contract and pass. [VERIFIED: scripts/verify-static.ts; `bun run build && bun run verify:static` output]
   - What's unclear: The phase could satisfy VERIFY-01 through existing assertions plus release labels, or add a tiny success-message wording change for clearer terminal evidence. [VERIFIED: 17-CONTEXT.md]
   - Recommendation: Treat this as a small optional task after browser/docs/labels, not a verifier rewrite. [VERIFIED: current gap audit]

## Verification Commands

Use these commands to verify completed Phase 17 work. [VERIFIED: package.json; command outputs]

```bash
bun run test scripts/release-readiness.test.ts scripts/verify-release.test.ts
bun run build
bun run verify:browser
bun run verify:static
bun run verify:release
bun run install:browser && bun run verify
```

Current baseline results during research:

- `bun run test scripts/release-readiness.test.ts scripts/verify-release.test.ts` passed 2 files and 21 tests. [VERIFIED: command output]
- `bun run build && bun run verify:static` passed and reported 13 prerendered routes. [VERIFIED: command output]
- `bun run verify:browser` passed 68 tests with 16 skipped project-scope skips. [VERIFIED: command output]
- `bun run verify:release` passed and scanned 13 route HTML files and 33 text assets, including writing routes. [VERIFIED: command output]

## Sources

### Primary (HIGH confidence)

- `.planning/phases/17-writing-verification-and-release-contract/17-CONTEXT.md` - locked decisions, discretion, deferred scope, canonical refs. [VERIFIED: file read]
- `.planning/ROADMAP.md` - Phase 17 goal and success criteria. [VERIFIED: file read]
- `.planning/REQUIREMENTS.md` - VERIFY-01 through VERIFY-04 and out-of-scope exclusions. [VERIFIED: file read]
- `.planning/STATE.md` - current Phase 17 planning state. [VERIFIED: file read]
- `AGENTS.md`, `AGENTS.bright-builds.md`, `standards-overrides.md` - repo-local and Bright Builds instructions. [VERIFIED: file read]
- `package.json` - package manager, scripts, and dependency pins. [VERIFIED: file read]
- `scripts/verify-static.ts` - static output verifier and writing coverage. [VERIFIED: file read]
- `tests/browser-release.playwright.ts` and `playwright.config.ts` - browser release coverage and projects. [VERIFIED: file read]
- `scripts/release-readiness.ts`, `scripts/release-readiness.test.ts`, `scripts/verify-release.ts`, `scripts/verify-release.test.ts` - docs guards, release output scanning, labels, and tests. [VERIFIED: file read]
- `docs/release-readiness.md` - current release contract. [VERIFIED: file read]
- `src/domain/writing.ts`, `src/domain/seo.ts`, `src/domain/routes.ts` - helper-derived writing, metadata, JSON-LD, sitemap, and route source of truth. [VERIFIED: file read]
- Command outputs for targeted tests, build/static verification, browser verification, release verification, runtime versions, and npm registry checks. [VERIFIED: command output]

### Standards and Skills (HIGH confidence)

- Bright Builds standards index at pinned commit `05f8d7a6c9c2e157ec4f922a05273e72dab97676`: `https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/index.md`. [CITED: raw.githubusercontent.com]
- Bright Builds architecture, code-shape, verification, testing, and TypeScript/JavaScript standards at the same pinned commit. [CITED: raw.githubusercontent.com]
- OpenLinks identity presence skill plus `identity-defaults.md` and `surface-patterns.md`. [VERIFIED: local skill files]

### Secondary (MEDIUM confidence)

- npm registry package version and modification metadata for Bun package, Playwright, axe Playwright, Vitest, Biome, TypeScript, SolidStart, and Vinxi. [VERIFIED: npm registry]

### Tertiary (LOW confidence)

- None. [VERIFIED: all findings above are source-backed]

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - package pins, runtime versions, registry versions, and current script behavior were verified. [VERIFIED: package.json; command outputs; npm registry]
- Architecture: HIGH - patterns are already established in current source files and constrained by locked decisions. [VERIFIED: scripts/verify-static.ts; tests/browser-release.playwright.ts; scripts/release-readiness.ts; 17-CONTEXT.md]
- Pitfalls: HIGH - gaps were confirmed by source search and successful baseline command runs. [VERIFIED: rg outputs; command outputs]

**Research date:** 2026-06-14 [VERIFIED: system date]
**Valid until:** 2026-06-21 for registry/runtime-version details and 2026-07-14 for repo-internal architecture findings if Phase 17 source files do not change. [ASSUMED]
