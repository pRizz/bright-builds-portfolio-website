# Phase 18: Static Verifier Modularization - Research

**Researched:** 2026-06-16  
**Domain:** Bun/TypeScript static-output verifier refactor  
**Confidence:** HIGH [VERIFIED: `.planning/phases/18-static-verifier-modularization/18-CONTEXT.md`, `scripts/verify-static.ts`, `package.json`, Bright Builds standards, and `bun run verify:static`]

<user_constraints>

## User Constraints (from CONTEXT.md)

Source for this section: `.planning/phases/18-static-verifier-modularization/18-CONTEXT.md`. [VERIFIED: source read]

### Locked Decisions

## Implementation Decisions

### Refactor Shape

- **D-01:** Keep `scripts/verify-static.ts` as the executable CLI entrypoint, but make it a thin orchestrator under the Bright Builds large-file refactor trigger.
- **D-02:** Move reusable assertion logic into focused repo-owned TypeScript modules under `scripts/`, not into new dependencies, generated files, Python helpers, or hidden inline scripts.
- **D-03:** Prefer concern-based boundaries: static output discovery/route HTML, route expected text, project detail assertions, writing assertions, metadata/JSON-LD assertions, sitemap/robots/assets assertions, and shared HTML assertion utilities.
- **D-04:** Preserve the current success message shape and `verify:static` package-script contract so existing clean-builder and aggregate verification flows keep working.

### Coverage Preservation

- **D-05:** Preserve all existing helper-derived checks. Assertions should continue to derive routes, writing entries, project detail pages, metadata, JSON-LD, sitemap XML, robots text, and related links from `src/domain/*` helpers rather than copied route or slug lists.
- **D-06:** Keep writing route coverage intact for `/writing` and public `/writing/{slug}` pages, including pre-hydration body content, metadata, `BlogPosting` JSON-LD, writing index `ItemList` JSON-LD, sitemap inclusion/exclusion, non-public/unknown route exclusion, related project links, and forbidden runtime residue.
- **D-07:** Keep project detail coverage intact for selected `/projects/{slug}` pages, including story content, action links, GitHub metadata facts, `SoftwareSourceCode` JSON-LD, sitemap inclusion, and unselected route exclusion.
- **D-08:** Keep site-wide checks intact for dark root HTML, shell landmarks, OpenLinks footer/profile presence, top-level route metadata, `Person` JSON-LD with OpenLinks `sameAs`, static assets, PNG dimensions, remote runtime visual asset bans, reduced-motion CSS, robots output, and forbidden template/runtime residue.

### Tests And Verification

- **D-09:** Add focused tests or fixture-backed checks for any new pure helper modules where behavior can be tested without building `.output/public`.
- **D-10:** If a helper remains tightly coupled to generated HTML files, prove preservation through `bun run build`, `bun run verify:static`, and the full aggregate `bun run verify` instead of inventing brittle unit fixtures.
- **D-11:** Include regression guards for the split preserving writing route coverage, project detail coverage, metadata/JSON-LD checks, sitemap inclusion/exclusion, unsafe href guards, and the static verifier success output.
- **D-12:** End verification with `bun run verify:static` and `bun run verify`; because Phase 18 affects the aggregate release gate, do not mark the phase passed without the full repo-native verification evidence.

### Scope Control

- **D-13:** Do not update release evidence labels or release-readiness prose unless the refactor uncovers an inaccurate existing claim. The intent is to keep release claims stable.
- **D-14:** Do not alter OpenLinks placement or promotion. Existing visible footer/about/contact links and `Person.sameAs`/writing JSON-LD identity hints remain the right low-intrusion posture.
- **D-15:** Do not broaden browser tests or UI checks unless a verifier split accidentally exposes a missing coverage gap; Phase 18 is not a new UI or accessibility feature.

### the agent's Discretion

- The planner may choose exact module names and grouping as long as `scripts/verify-static.ts` becomes a small orchestrator and the resulting modules have clear ownership.
- The planner may decide whether to move constants with the assertions that consume them or into a shared constants module, provided imports remain readable and there is no circular dependency.
- The planner may leave very small orchestration-only helpers in `scripts/verify-static.ts` if moving them would make the entrypoint harder to follow.

### Deferred Ideas (OUT OF SCOPE)

- Richer per-route verifier fixture architecture can wait unless needed to prove this split.
- New release labels, new browser flows, live external-link crawling, hosted audits, RSS/search/tag coverage, CMS/admin support, and dynamic OG image checks remain out of scope.

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| MAINT-01 | Static verification is split into focused, repo-owned TypeScript modules or helpers so writing and project generated-output assertions remain maintainable while preserving existing `verify:static` and aggregate release coverage. [VERIFIED: `.planning/REQUIREMENTS.md`] | Use the import-safe `scripts/verify-static/` module split, preserve helper-derived route/content/metadata coverage, add focused Vitest tests for pure helpers, and verify with `bun run build`, `bun run verify:static`, and `bun run verify`. [VERIFIED: `.planning/phases/18-static-verifier-modularization/18-CONTEXT.md`, `scripts/verify-static.ts`, `package.json`] |

</phase_requirements>

## Summary

Phase 18 is a maintenance refactor, not a feature phase: the existing generated-output contract already passes and must be preserved while `scripts/verify-static.ts` is reduced from a 1,180-line mixed helper/CLI file into a thin Bun entrypoint plus focused TypeScript modules under `scripts/`. [VERIFIED: `wc -l scripts/verify-static.ts`, `.planning/v1.3-MILESTONE-AUDIT.md`, `bun run verify:static`]

The safest architecture is to follow the repo's existing `scripts/verify-release.ts` pattern: export pure scanners/assertion helpers from import-safe modules, keep filesystem/build-output I/O in explicit verifier functions, and call the top-level runner only behind `if (import.meta.main)` in the CLI entrypoint. [VERIFIED: `scripts/verify-release.ts`, `scripts/verify-project-helper-surface.ts`, `standards/core/architecture.md`]

**Primary recommendation:** move code mostly as-is into concern-based modules first, add focused tests for pure expected-text/assertion helpers and success output, then rely on `bun run build && bun run verify:static && bun run verify` for generated `.output/public` preservation. [VERIFIED: `.planning/phases/18-static-verifier-modularization/18-CONTEXT.md`, `scripts/verify-static.ts`, `package.json`]

## Project Constraints (from AGENTS.md)

| Directive | Planning Impact |
| --- | --- |
| Read repo-local `AGENTS.md`, `AGENTS.bright-builds.md`, `standards-overrides.md`, and relevant standards before plan/review/implementation/audit work. [VERIFIED: `AGENTS.md`, `AGENTS.bright-builds.md`] | Planning should cite these files and avoid approaches that contradict Bright Builds standards. [VERIFIED: `AGENTS.md`] |
| Use GSD planning artifacts and do not make direct repo edits outside a GSD workflow unless explicitly bypassed. [VERIFIED: `AGENTS.md`] | Implementation should run through the Phase 18 plan/execution path; this research only writes `18-RESEARCH.md`. [VERIFIED: user output request, `AGENTS.md`] |
| Default UI is dark-primary and visual verification for UI changes needs desktop/mobile dark checks. [VERIFIED: `AGENTS.md`] | Phase 18 should not change UI; if it accidentally touches UI or metadata placement, preserve dark/OpenLinks behavior and run the existing aggregate gate. [VERIFIED: `.planning/phases/18-static-verifier-modularization/18-CONTEXT.md`, `AGENTS.md`] |
| TypeScript/JavaScript automation should stay Bun/TS; do not add Python scripts in this Bun-friendly repo. [VERIFIED: `standards/languages/typescript-javascript.md`] | New verifier modules and tests should be `.ts` files under `scripts/` and run through Bun/Vitest. [VERIFIED: `package.json`, `standards/languages/typescript-javascript.md`] |
| Prefer functional core / imperative shell; pure logic should be unit-tested. [VERIFIED: `standards/core/architecture.md`, `standards/core/testing.md`] | Extract import-safe pure helpers for expected texts, HTML escaping, route classification, and output-summary formatting where practical. [VERIFIED: `scripts/verify-static.ts`, `standards/core/architecture.md`] |
| Split oversized files around coherent responsibilities when files exceed the Bright Builds refactor trigger. [VERIFIED: `standards/core/code-shape.md`] | `scripts/verify-static.ts` is 1,180 lines, above the roughly 628-line file trigger, so the planner should require a module split. [VERIFIED: `wc -l scripts/verify-static.ts`, `standards/core/code-shape.md`] |
| Run repo-native verification before done and prefer aggregate owned commands. [VERIFIED: `standards/core/verification.md`] | The phase gate should end with `bun run verify:static` and `bun run verify`, not isolated low-level checks only. [VERIFIED: `.planning/phases/18-static-verifier-modularization/18-CONTEXT.md`, `package.json`] |
| OpenLinks placement should remain low-intrusion and visible link first, metadata second. [VERIFIED: `AGENTS.bright-builds.md`, `openlinks-identity-presence` skill] | Do not change footer/about/contact OpenLinks placement or `Person.sameAs`; preserve existing assertions only. [VERIFIED: `.planning/phases/18-static-verifier-modularization/18-CONTEXT.md`, `scripts/verify-static.ts`] |

## Standard Stack

### Core

| Library / Runtime | Version | Purpose | Why Standard |
| --- | --- | --- | --- |
| Bun | Pinned `packageManager: "bun@1.3.14"`; local binary `1.3.9` during research. [VERIFIED: `package.json`, `bun --version`, `bun pm pkg get packageManager`] | Runs repo-owned scripts such as `verify:static` and `verify`. [VERIFIED: `package.json`] | Existing repo script surface is Bun-based; Phase 18 must keep `bun run scripts/verify-static.ts`. [VERIFIED: `package.json`, `.planning/phases/18-static-verifier-modularization/18-CONTEXT.md`] |
| TypeScript | Pinned and installed `6.0.3`; npm registry current `6.0.3`, modified 2026-04-16. [VERIFIED: `package.json`, `node_modules/.bin/tsc --version`, `npm view typescript version time.modified`] | Typechecks `scripts/**/*` under strict TS settings. [VERIFIED: `tsconfig.json`] | New verifier modules should stay in TypeScript and remain covered by `bun run typecheck`. [VERIFIED: `package.json`, `tsconfig.json`] |
| Node built-ins | Node `v24.13.0` available; `node:fs` and `node:path` are already used by verifier scripts. [VERIFIED: `node --version`, `scripts/verify-static.ts`, `scripts/verify-release.ts`] | File traversal, static-output reads, path normalization. [VERIFIED: `scripts/verify-static.ts`] | No new file-walking dependency is needed for this refactor. [VERIFIED: `scripts/verify-static.ts`, `package.json`] |
| Vitest | Pinned/installed `4.1.7`; npm registry current `4.1.9`, modified 2026-06-15. [VERIFIED: `package.json`, `node_modules/.bin/vitest --version`, `npm view vitest version time.modified`] | Focused unit tests for import-safe pure helper modules. [VERIFIED: existing `*.test.ts` files, `package.json`] | Existing script/domain tests use Vitest with Arrange/Act/Assert comments. [VERIFIED: `scripts/project-helper-surface.test.ts`, `src/domain/writing-metadata.test.ts`] |
| Biome | Pinned/installed `2.4.15`; npm registry current `2.5.0`, modified 2026-06-12. [VERIFIED: `package.json`, `node_modules/.bin/biome --version`, `npm view @biomejs/biome version time.modified`] | Format/lint/check `scripts`, `src`, and `tests`. [VERIFIED: `package.json`] | Do not change formatter/linter stack for this phase; `bun run verify` already includes format/check. [VERIFIED: `package.json`, `.planning/phases/18-static-verifier-modularization/18-CONTEXT.md`] |

### Supporting

| Library / Tool | Version | Purpose | When to Use |
| --- | --- | --- | --- |
| SolidStart / Vinxi | `@solidjs/start@1.3.2`, `vinxi@0.5.11`; both match npm registry current versions during research. [VERIFIED: `package.json`, `npm view @solidjs/start version time.modified`, `npm view vinxi version time.modified`] | Build `.output/public` before static verification. [VERIFIED: `package.json`, `.output/public` audit] | Use only through the existing `bun run build`; do not add new prerender tooling. [VERIFIED: `package.json`, `.planning/phases/18-static-verifier-modularization/18-CONTEXT.md`] |
| Solid domain helpers | `src/domain/routes.ts`, `projects.ts`, `writing.ts`, `seo.ts`. [VERIFIED: source reads] | Source of truth for routes, expected content, metadata, JSON-LD, sitemap, and robots expectations. [VERIFIED: `scripts/verify-static.ts`, domain source files] | All verifier modules should keep deriving expected values from these helpers rather than copying slugs or route arrays. [VERIFIED: `.planning/phases/18-static-verifier-modularization/18-CONTEXT.md`, `scripts/verify-static.ts`] |
| Playwright | Pinned/installed `@playwright/test@1.60.0`; npm registry current `1.61.0`, modified 2026-06-15. [VERIFIED: `package.json`, `node_modules/.bin/playwright --version`, `npm view @playwright/test version time.modified`] | Browser release gate inside `bun run verify`. [VERIFIED: `package.json`] | Do not broaden browser coverage unless refactor exposes a missing verifier coverage gap. [VERIFIED: `.planning/phases/18-static-verifier-modularization/18-CONTEXT.md`] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
| --- | --- | --- |
| Repo-owned TypeScript modules under `scripts/verify-static/` [VERIFIED: phase decisions] | New assertion/test dependency [ASSUMED] | Out of scope because D-02 forbids new dependencies and current helpers are simple enough to move. [VERIFIED: `.planning/phases/18-static-verifier-modularization/18-CONTEXT.md`, `scripts/verify-static.ts`] |
| Vitest tests for pure modules [VERIFIED: `package.json`] | Generated-output fixtures for every route [ASSUMED] | D-10 says build-backed checks are preferred for helpers tightly coupled to `.output/public`; broad fixtures risk duplicating generated HTML and slugs. [VERIFIED: `.planning/phases/18-static-verifier-modularization/18-CONTEXT.md`] |
| `import.meta.main` CLI runner pattern [VERIFIED: `scripts/verify-release.ts`] | Top-level execution in every module [ASSUMED] | Top-level execution makes helper modules unsafe to import from Vitest and repeats the current entrypoint problem. [VERIFIED: `scripts/verify-static.ts`, `scripts/verify-release.ts`] |

**Installation:**

```bash
# No new packages for Phase 18.
# Use the existing repo install state; if dependencies drift, run the repo's normal Bun install path.
```

**Version verification:** Package versions above were checked against `package.json`, installed binaries, and `npm view` where applicable. [VERIFIED: npm registry commands, local binary probes]

## Architecture Patterns

### Recommended Project Structure

```text
scripts/
├── verify-static.ts                         # Thin CLI entrypoint; calls runStaticVerification()
└── verify-static/
    ├── config.ts                            # Output root, source paths, forbidden pattern constants
    ├── output.ts                            # htmlFiles(), cssFiles(), routeHtmlPath(), assertOutputFile()
    ├── html-assertions.ts                   # escape/assert/preHydrationBody/jsonLd helpers
    ├── expected-route-text.ts               # expectedRoutes and helper-derived expected text
    ├── route-html-verifier.ts               # shell, pre-hydration, GitHub metadata, forbidden residue
    ├── metadata-jsonld-verifier.ts          # route/project/writing metadata and JSON-LD checks
    ├── sitemap-assets-verifier.ts           # sitemap, robots, PNG, remote asset, reduced-motion checks
    └── run-static-verification.ts           # Orchestration and result summary string
scripts/
└── verify-static.test.ts                    # Focused Vitest tests for pure/import-safe helpers
```

This structure matches the concern boundaries locked in D-03 while keeping script-owned code under `scripts/`. [VERIFIED: `.planning/phases/18-static-verifier-modularization/18-CONTEXT.md`, `scripts/verify-static.ts`]

### Pattern 1: Thin CLI, Import-Safe Modules

**What:** Keep `scripts/verify-static.ts` as an executable entrypoint that imports a runner and executes only when Bun runs the file directly. [VERIFIED: `package.json`, `scripts/verify-release.ts`]

**When to use:** Use this for Phase 18 so Vitest can import helper modules without reading `.output/public` at import time. [VERIFIED: `scripts/verify-static.ts`, `scripts/verify-release.ts`]

**Example:**

```typescript
import { runStaticVerification } from "./verify-static/run-static-verification";

if (import.meta.main) {
  runStaticVerification();
}
```

Source: existing `import.meta.main` script pattern in `scripts/verify-release.ts` and `scripts/verify-project-helper-surface.ts`. [VERIFIED: source audit]

### Pattern 2: Functional Core With Imperative Output Shell

**What:** Keep string classification, route expected-text construction, HTML escaping, JSON-LD extraction, success-summary formatting, and pattern checks as pure functions; keep `readFileSync`, `existsSync`, and `.output/public` traversal in output adapters. [VERIFIED: `scripts/verify-static.ts`, `standards/core/architecture.md`]

**When to use:** Use pure helper exports for Vitest tests and use build-backed verification for checks whose truth depends on actual generated files. [VERIFIED: `.planning/phases/18-static-verifier-modularization/18-CONTEXT.md`, `standards/core/testing.md`]

**Example:**

```typescript
export function staticVerificationSummary(options: {
  routeCount: number;
  outputRoot: string;
}): string {
  return (
    `Verified ${options.routeCount} prerendered routes, metadata, JSON-LD, ` +
    `writing route coverage, assets, sitemap, and robots in ${options.outputRoot}.`
  );
}
```

Source: current success message in `scripts/verify-static.ts`. [VERIFIED: `scripts/verify-static.ts`, `bun run verify:static`]

### Pattern 3: Helper-Derived Expected Values

**What:** Expected route text, metadata, JSON-LD, sitemap inclusion/exclusion, and related links should continue to be derived from `prerenderRoutes`, `projectDetailRoutes()`, `publicWritingEntries()`, `writingDetailRoutes()`, `metadataFor*()`, `projectJsonLd()`, `writingBlogPostingJsonLd()`, `writingItemListJsonLd()`, `sitemapXml()`, and `robotsTxt()`. [VERIFIED: `scripts/verify-static.ts`, domain source files]

**When to use:** Use this for every extracted assertion module; do not introduce hard-coded writing slug lists or selected project route lists. [VERIFIED: `.planning/phases/18-static-verifier-modularization/18-CONTEXT.md`, `.planning/research/PITFALLS.md`]

**Example:**

```typescript
export const expectedRoutes: StaticRouteCheck[] = prerenderRoutes.map((route) => ({
  route,
  expectedTexts: ["OpenLinks profile", ...expectedTextsForRoute(route)],
  forbiddenTextPatterns: generatedOutputForbiddenPatterns,
}));
```

Source: current route coverage construction. [VERIFIED: `scripts/verify-static.ts`]

### Anti-Patterns to Avoid

- **Top-level verifier execution in extracted modules:** It would make modules unsafe to import from focused tests and preserve the current monolithic side-effect problem. [VERIFIED: `scripts/verify-static.ts`, `scripts/verify-release.ts`, `standards/core/architecture.md`]
- **Copied route or slug fixtures:** It would reintroduce the content drift and route duplication risks documented for v1.3. [VERIFIED: `.planning/research/PITFALLS.md`, `.planning/phases/18-static-verifier-modularization/18-CONTEXT.md`]
- **Changing package scripts or release labels while refactoring:** D-04 and D-13 lock the CLI contract and release wording unless an existing claim is inaccurate. [VERIFIED: `.planning/phases/18-static-verifier-modularization/18-CONTEXT.md`, `package.json`] 
- **Splitting by chronology instead of concern:** A file named by phase history would not help future maintainers find writing/project/metadata assertions. [VERIFIED: `.planning/phases/18-static-verifier-modularization/18-CONTEXT.md`, `standards/core/code-shape.md`]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
| --- | --- | --- | --- |
| Route inventory | Manual arrays of `/writing/*` or `/projects/*` routes. [VERIFIED: `.planning/research/PITFALLS.md`] | `prerenderRoutes`, `projectDetailRoutes()`, `writingDetailRoutes()`. [VERIFIED: `src/domain/routes.ts`, `src/domain/projects.ts`, `src/domain/writing.ts`] | Domain helpers already encode public/selected eligibility and prevent hidden/unselected leaks. [VERIFIED: domain source files, milestone audit] |
| Metadata/JSON-LD expectations | Hand-copied title, canonical, Open Graph, Twitter, or schema values. [VERIFIED: current verifier avoids this for metadata] | `metadataForRoute`, `metadataForProject`, `metadataForWritingEntry`, `personJsonLd`, `projectJsonLd`, `writingBlogPostingJsonLd`, `writingItemListJsonLd`. [VERIFIED: `src/domain/seo.ts`, `scripts/verify-static.ts`] | The static verifier should detect generated-output drift from pure helper output. [VERIFIED: `.planning/phases/18-static-verifier-modularization/18-CONTEXT.md`] |
| CLI/test runner surface | New command framework or custom fixture runner. [ASSUMED] | Existing `bun run verify:static`, `bun run test`, and `if (import.meta.main)` script pattern. [VERIFIED: `package.json`, `scripts/verify-release.ts`] | Package scripts already define the release gate, and D-04 forbids changing the CLI contract. [VERIFIED: `package.json`, phase context] |
| File traversal | New glob dependency for `.output/public`. [ASSUMED] | Existing `node:fs`/`node:path` recursive helpers moved into `output.ts`. [VERIFIED: `scripts/verify-static.ts`, `scripts/verify-release.ts`] | Current implementation already recursively finds HTML/CSS files with built-ins. [VERIFIED: `scripts/verify-static.ts`] |
| OpenLinks/identity assertions | New promotion or metadata placement logic. [VERIFIED: phase context forbids altering placement] | Preserve current footer/about/contact and `Person.sameAs` checks. [VERIFIED: `scripts/verify-static.ts`, `openlinks-identity-presence` skill] | Phase 18 is no-behavior-change and OpenLinks should stay low-intrusion. [VERIFIED: phase context, skill read] |

**Key insight:** The implementation should modularize verifier ownership, not invent new verifier semantics. [VERIFIED: `.planning/phases/18-static-verifier-modularization/18-CONTEXT.md`, `.planning/v1.3-MILESTONE-AUDIT.md`]

## Runtime State Inventory

| Category | Items Found | Action Required |
| --- | --- | --- |
| Stored data | None: Phase 18 does not rename persisted identifiers and the site content sources are checked-in TypeScript domain files. [VERIFIED: phase context, `src/domain/*.ts`] | No data migration. [VERIFIED: phase context] |
| Live service config | None found for this refactor: `verify:static` reads local `.output/public` and checked-in source files, not external service configuration. [VERIFIED: `scripts/verify-static.ts`, `package.json`] | No service config update. [VERIFIED: source audit] |
| OS-registered state | None found: no launchd/systemd/pm2/task scheduler state is involved in the static verifier script. [VERIFIED: source audit, package scripts] | No OS re-registration. [VERIFIED: source audit] |
| Secrets/env vars | No new secrets/env vars are required; existing verifier forbids GitHub token/runtime residue in generated output. [VERIFIED: `scripts/verify-static.ts`, `scripts/verify-no-github-runtime.ts`] | Preserve forbidden token checks; do not add env-dependent verifier behavior. [VERIFIED: phase context, source audit] |
| Build artifacts | `.output/public` currently exists and is the generated artifact scanned by `verify:static`; implementation must rebuild before final static verification. [VERIFIED: `.output/public` file audit, `bun run verify:static`] | Run `bun run build` before `bun run verify:static` and `bun run verify`. [VERIFIED: package scripts, phase context] |

**Nothing found in category:** Stored data, live service config, OS-registered state, and secret/env var migration are not applicable beyond preserving existing generated-output residue checks. [VERIFIED: source audit]

## Common Pitfalls

### Pitfall 1: Import-Time `.output/public` Reads

**What goes wrong:** Tests import a helper module and it immediately calls `findStaticOutputRoot()`, reads generated HTML, or throws if `.output/public` is stale. [VERIFIED: current top-level execution in `scripts/verify-static.ts`]  
**Why it happens:** Current helper definitions and top-level execution live in the same file. [VERIFIED: `scripts/verify-static.ts`]  
**How to avoid:** Move execution into `runStaticVerification()` and guard the CLI with `if (import.meta.main)`. [VERIFIED: `scripts/verify-release.ts`, `scripts/verify-project-helper-surface.ts`]  
**Warning signs:** A new module has `const outputRoot = ...` or `for (const check of expectedRoutes)` at module scope. [VERIFIED: current anti-pattern in `scripts/verify-static.ts`]

### Pitfall 2: Lost Global Forbidden-Output Scan

**What goes wrong:** The refactor verifies only `expectedRoutes` and stops scanning every emitted HTML file for forbidden template/runtime residue. [VERIFIED: current full-output loop in `scripts/verify-static.ts`]  
**Why it happens:** Route assertions and all-output assertions are adjacent today and can be separated incorrectly. [VERIFIED: `scripts/verify-static.ts`]  
**How to avoid:** Keep a dedicated all-output assertion in `sitemap-assets-verifier.ts` or `route-html-verifier.ts` that loops over `outputHtmlFiles`. [VERIFIED: current loop in `scripts/verify-static.ts`]  
**Warning signs:** `assertForbiddenTextAbsent` appears only inside per-route assertions after the split. [VERIFIED: `scripts/verify-static.ts`]

### Pitfall 3: Route Coverage Becomes Fixture-Driven

**What goes wrong:** Tests pass because fixture slugs are hard-coded, while new public writing/project routes are missed. [VERIFIED: `.planning/research/PITFALLS.md`]  
**Why it happens:** Refactor tests may snapshot the current two writing slugs or six project detail slugs instead of deriving from helpers. [VERIFIED: domain tests and phase context]  
**How to avoid:** Tests should assert helper behavior at the function boundary and build-backed verification should prove the full helper-derived route set. [VERIFIED: `.planning/phases/18-static-verifier-modularization/18-CONTEXT.md`, `src/domain/writing.test.ts`]  
**Warning signs:** New `verify-static` tests contain `agentic-engineering-workflows` or `portable-identity-and-owned-surfaces` unless testing a domain helper fixture deliberately. [VERIFIED: Phase 17 plan guard, current source audit]

### Pitfall 4: Release Evidence Wording Drifts

**What goes wrong:** Static verifier output no longer includes `writing route coverage`, or release docs/labels are edited without a behavior change. [VERIFIED: Phase 17 verification and current CLI output]  
**Why it happens:** Success message formatting is easy to treat as incidental during a file split. [VERIFIED: `scripts/verify-static.ts`, `bun run verify:static`]  
**How to avoid:** Extract and unit-test `staticVerificationSummary()` or an equivalent pure helper, then confirm `bun run verify:static` output. [VERIFIED: phase context D-11, current output]  
**Warning signs:** `rg -n 'writing route coverage' scripts/verify-static.ts scripts/verify-static` finds no success-output path. [VERIFIED: current source audit]

### Pitfall 5: Exact Text Brittleness Expands

**What goes wrong:** Copy-only content edits start requiring verifier code edits because expected strings are copied instead of derived. [VERIFIED: `.planning/research/PITFALLS.md`]  
**Why it happens:** Moving code into modules can make it tempting to freeze route-specific text in named fixtures. [ASSUMED]  
**How to avoid:** Keep expected body text functions reading route/domain helpers and avoid route-specific copies except structural labels already verified today. [VERIFIED: `scripts/verify-static.ts`]  
**Warning signs:** New modules export arrays of titles, slugs, summaries, or project proof points independent of `src/domain/*`. [VERIFIED: phase context D-05]

### Pitfall 6: Over-Splitting Into Tiny Circular Modules

**What goes wrong:** Module count grows while ownership becomes harder to follow, or shared constants create circular imports. [VERIFIED: phase discretion warns about grouping/circular imports]  
**Why it happens:** Every helper is extracted mechanically instead of grouping by verifier concern. [ASSUMED]  
**How to avoid:** Use 6-8 concern modules and keep shared low-level utilities dependency-free. [VERIFIED: phase context D-03, D-03 specifics]  
**Warning signs:** `config.ts` imports route assertion modules, or utility modules import high-level verifiers. [VERIFIED: standards architecture guidance]

## Code Examples

Verified patterns from project sources:

### Import-Safe Runner

```typescript
// Source: scripts/verify-release.ts pattern
export function runStaticVerification(): void {
  const outputRoot = findStaticOutputRoot();
  const result = verifyStaticOutput(outputRoot);

  console.log(staticVerificationSummary(result));
}
```

The runner owns I/O and logging, while lower-level helpers can remain testable. [VERIFIED: `scripts/verify-release.ts`, `standards/core/architecture.md`]

### Focused Unit Test For Summary Contract

```typescript
import { describe, expect, it } from "vitest";
import { staticVerificationSummary } from "./verify-static/run-static-verification";

describe("static verifier summary", () => {
  it("preserves writing route coverage evidence wording", () => {
    // Arrange
    const result = { routeCount: 13, outputRoot: ".output/public" };

    // Act
    const summary = staticVerificationSummary(result);

    // Assert
    expect(summary).toBe(
      "Verified 13 prerendered routes, metadata, JSON-LD, writing route coverage, assets, sitemap, and robots in .output/public.",
    );
  });
});
```

This test shape follows existing Vitest imports and Arrange/Act/Assert project style. [VERIFIED: `scripts/project-helper-surface.test.ts`, `standards/core/testing.md`]

### Helper-Derived Writing Expected Text

```typescript
export function writingDetailExpectedTexts(entry: PublicWritingEntry): readonly string[] {
  return [
    "Back to writing",
    writingKindLabel(entry),
    entry.title,
    entry.summary,
    ...writingVisibleDateExpectedText(entry),
    ...entry.sections.flatMap((section) => [
      section.heading,
      ...section.blocks.flatMap(writingBodyBlockExpectedTexts),
    ]),
    ...relatedProjectDetailPageProjects(entry).flatMap((project) => [
      project.name,
      project.oneLine,
      "Project details",
      `href="${escapeHtmlAttribute(projectDetailPath(project))}"`,
    ]),
  ];
}
```

Source: existing helper-derived writing assertions. [VERIFIED: `scripts/verify-static.ts`]

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
| --- | --- | --- | --- |
| One monolithic `verify-static.ts` owns file walking, expected route text, metadata/JSON-LD checks, asset checks, sitemap/robots checks, and top-level CLI execution. [VERIFIED: `scripts/verify-static.ts`] | Thin CLI plus import-safe concern modules under `scripts/verify-static/`, modeled after existing `verify-release.ts`. [VERIFIED: `scripts/verify-release.ts`, phase context] | Phase 18 cleanup after v1.3 audit on 2026-06-15. [VERIFIED: `.planning/v1.3-MILESTONE-AUDIT.md`, roadmap] | Maintainers can evolve writing/project assertions locally without extending a 1,180-line script. [VERIFIED: audit, `wc -l`] |
| Route/static verifier tests would require building or importing the full CLI. [VERIFIED: current top-level execution] | Pure helper modules can be tested in Vitest; generated-output facts remain build-backed. [VERIFIED: phase context D-09/D-10] | Phase 18 plan. [VERIFIED: roadmap] | Tests can cover expected route text, unsafe href guards, summary text, and sitemap inclusion/exclusion without brittle HTML snapshots. [VERIFIED: phase context, source audit] |
| Writing route release evidence was added to the static verifier success output in Phase 17. [VERIFIED: Phase 17 verification, current CLI output] | Preserve that wording and only relocate the implementation. [VERIFIED: phase context D-04/D-13] | Phase 18. [VERIFIED: roadmap] | Release-readiness claims remain stable and truthful. [VERIFIED: `scripts/release-readiness.ts`, `scripts/verify-release.test.ts`] |

**Deprecated/outdated:**

- Adding more route-specific `if` blocks directly to `scripts/verify-static.ts` is the debt this phase closes. [VERIFIED: `.planning/research/PITFALLS.md`, `.planning/v1.3-MILESTONE-AUDIT.md`]
- Adding Python or hidden inline scripts for verifier helpers is forbidden for this Bun-friendly repo. [VERIFIED: `standards/languages/typescript-javascript.md`, phase context D-02]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
| --- | --- | --- | --- |
| A1 | A 6-8 file concern split is the right granularity; exact module names remain planner discretion. [ASSUMED] | Architecture Patterns | Low: phase context explicitly allows planner discretion on module names/grouping. [VERIFIED: phase context] |
| A2 | No new dependency is needed for HTML parsing or file globbing. [ASSUMED] | Standard Stack / Don't Hand-Roll | Low: existing verifier already passes with built-in string/file helpers, but implementation can revisit if a concrete gap appears. [VERIFIED: `scripts/verify-static.ts`, `bun run verify:static`] |

## Open Questions (RESOLVED)

1. **RESOLVED: Should the planner require a test that invokes the CLI process and asserts stdout?**  
   - What we know: D-11 requires a guard for static verifier success output, and a pure summary helper test is cheaper. [VERIFIED: phase context]  
   - Outcome: Use a pure `staticVerificationSummary()` unit test for stable evidence wording and verify process stdout through `bun run verify:static` during phase verification. Do not add a separate process-spawning unit test unless implementation later proves the pure seam insufficient. [VERIFIED: phase context D-10/D-12]

2. **RESOLVED: Should local Bun be upgraded before implementation?**  
   - What we know: `package.json` pins `bun@1.3.14`, while local `bun --version` returned `1.3.9`. [VERIFIED: package/local probes]  
   - Outcome: Do not change repo files or block implementation on a local Bun upgrade. Use the existing local Bun if verification passes; if a command fails due to the version mismatch, document that blocker and align the local tool to the package pin outside the code diff. [VERIFIED: `package.json`, `docs/release-readiness.md`]

3. **RESOLVED: Should release-readiness docs be touched if the refactor finds stale wording?**  
   - What we know: D-13 says do not update release claims unless an existing claim is inaccurate. [VERIFIED: phase context]  
   - Outcome: Default to no docs or release-label edits. Only patch release-readiness prose or label tests if the refactor reveals an actual inaccuracy, and keep that patch focused and test-backed. [VERIFIED: phase context, `scripts/release-readiness.test.ts`]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
| --- | --- | --- | --- | --- |
| Bun CLI | `bun run build`, `bun run verify:static`, `bun run verify` [VERIFIED: `package.json`] | Yes, but local version differs from package pin. [VERIFIED: `bun --version`, `package.json`] | Local `1.3.9`; package pin `1.3.14`. [VERIFIED: local probe, package] | Use existing local Bun if commands pass; align to `1.3.14` if failures appear. [VERIFIED: docs release pin] |
| Node | package tooling compatibility [VERIFIED: package scripts and installed binaries] | Yes. [VERIFIED: `node --version`] | `v24.13.0`. [VERIFIED: local probe] | None needed. [VERIFIED: local probe] |
| node_modules | Vitest/Biome/Playwright/TypeScript binaries [VERIFIED: package scripts] | Yes. [VERIFIED: `test -d node_modules`] | Installed per lock state. [VERIFIED: binary probes] | Run Bun install if missing. [VERIFIED: package manager pin] |
| TypeScript | `bun run typecheck` [VERIFIED: `package.json`] | Yes. [VERIFIED: `node_modules/.bin/tsc --version`] | `6.0.3`. [VERIFIED: local probe] | None needed. [VERIFIED: local probe] |
| Vitest | focused helper tests [VERIFIED: `package.json`] | Yes. [VERIFIED: `node_modules/.bin/vitest --version`] | `4.1.7`. [VERIFIED: local probe] | None needed. [VERIFIED: local probe] |
| Biome | format/check/lint portion of aggregate gate [VERIFIED: `package.json`] | Yes. [VERIFIED: `node_modules/.bin/biome --version`] | `2.4.15`. [VERIFIED: local probe] | None needed. [VERIFIED: local probe] |
| Playwright Chromium | `bun run verify` browser gate [VERIFIED: `package.json`] | Playwright installed and Chromium cache directories exist. [VERIFIED: binary probe and cache audit] | Playwright `1.60.0`; Chromium caches present. [VERIFIED: local probes] | Run `bun run install:browser` if browser gate fails on missing browser. [VERIFIED: package script, release docs] |
| Generated static output | `bun run verify:static` [VERIFIED: `scripts/verify-static.ts`] | Yes, current `.output/public/index.html` exists. [VERIFIED: file audit] | Generated artifact, not versioned. [VERIFIED: file audit] | Run `bun run build` before final verification. [VERIFIED: phase context D-10/D-12] |

**Missing dependencies with no fallback:** None found during research. [VERIFIED: environment probes]

**Missing dependencies with fallback:** Local Bun is behind the package pin; fallback is to use the existing binary if checks pass or align local Bun to `1.3.14` if commands fail. [VERIFIED: `bun --version`, `package.json`]

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
| --- | --- | --- |
| V2 Authentication | No. [VERIFIED: phase scope and source audit] | No auth surface in this refactor. [VERIFIED: source audit] |
| V3 Session Management | No. [VERIFIED: phase scope and source audit] | No session surface in this refactor. [VERIFIED: source audit] |
| V4 Access Control | No. [VERIFIED: phase scope and source audit] | Static verifier checks generated public output only. [VERIFIED: `scripts/verify-static.ts`] |
| V5 Input Validation | Yes, for generated HTML/CSS/XML/text and checked-in domain outputs consumed as verifier input. [VERIFIED: `scripts/verify-static.ts`] | Preserve escaping helpers, forbidden href checks, route path checks, sitemap equality, and metadata local-asset mapping. [VERIFIED: `scripts/verify-static.ts`] |
| V6 Cryptography | No. [VERIFIED: source audit] | No crypto implementation; do not add one. [VERIFIED: source audit] |

### Known Threat Patterns for Static Verifier Refactors

| Pattern | STRIDE | Standard Mitigation |
| --- | --- | --- |
| Generated output contains unsafe `javascript:` or `data:` hrefs. [VERIFIED: current forbidden patterns] | Tampering / XSS risk. [ASSUMED] | Preserve forbidden href checks across all emitted HTML. [VERIFIED: `scripts/verify-static.ts`] |
| Runtime GitHub/token residue appears in visitor output. [VERIFIED: current verifier patterns] | Information disclosure. [VERIFIED: `scripts/verify-static.ts`, `scripts/verify-no-github-runtime.ts`] | Preserve GitHub API, Octokit, `GITHUB_TOKEN`, and public token-prefix scans. [VERIFIED: source audit] |
| Metadata image points at a remote or non-canonical asset. [VERIFIED: current metadata image assertion] | Spoofing / integrity drift. [ASSUMED] | Preserve canonical-origin and `social/bright-builds-og.png` local-asset checks. [VERIFIED: `scripts/verify-static.ts`] |
| Release gate claims coverage that no longer runs. [VERIFIED: release evidence tests] | Repudiation / auditability risk. [ASSUMED] | Preserve success output and release evidence label tests; do not broaden claims. [VERIFIED: phase context, `scripts/verify-release.test.ts`] |

## Sources

### Primary (HIGH confidence)

- `.planning/phases/18-static-verifier-modularization/18-CONTEXT.md` - locked scope, decisions, coverage preservation, verification requirements, and deferred ideas. [VERIFIED: source read]
- `.planning/REQUIREMENTS.md` - MAINT-01 requirement and v1.3 out-of-scope limits. [VERIFIED: source read]
- `.planning/ROADMAP.md` - Phase 18 goal, dependency, success criteria, and MAINT-01 mapping. [VERIFIED: source read]
- `.planning/v1.3-MILESTONE-AUDIT.md` - source audit debt and prior verification evidence. [VERIFIED: source read]
- `scripts/verify-static.ts` - current verifier responsibilities, helper-derived assertions, top-level execution, and success message. [VERIFIED: source read and `bun run verify:static`]
- `package.json` - `verify:static`, `verify`, build/test/typecheck/format scripts, and pinned package versions. [VERIFIED: source read]
- `src/domain/routes.ts`, `src/domain/projects.ts`, `src/domain/writing.ts`, `src/domain/seo.ts` - route/content/metadata source of truth. [VERIFIED: source read]
- `AGENTS.md`, `AGENTS.bright-builds.md`, `standards/core/*.md`, `standards/languages/typescript-javascript.md`, `standards-overrides.md` - repo workflow and Bright Builds standards. [VERIFIED: source read]

### Secondary (MEDIUM confidence)

- `npm view` registry checks for `typescript`, `vitest`, `@biomejs/biome`, `@playwright/test`, `@types/bun`, `@solidjs/start`, `solid-js`, `@solidjs/router`, `@solidjs/meta`, and `vinxi`. [VERIFIED: npm registry]
- Local environment probes for Bun, Node, TypeScript, Vitest, Biome, Playwright, Chromium cache, and `.output/public`. [VERIFIED: shell probes]

### Tertiary (LOW confidence)

- No unverified web-search-only sources were used. [VERIFIED: research log]

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH for "use existing stack/no new deps" because package scripts and phase decisions lock this. [VERIFIED: package, phase context]  
- Architecture: HIGH for import-safe concern modules because local scripts already use this pattern and Bright Builds standards require functional core/imperative shell plus oversized-file splits. [VERIFIED: `scripts/verify-release.ts`, standards]  
- Pitfalls: HIGH for import-time side effects, route duplication, release wording drift, and verifier bloat because they are visible in current source and planning artifacts. [VERIFIED: `scripts/verify-static.ts`, `.planning/research/PITFALLS.md`, audit]  
- Environment: MEDIUM-HIGH because local probes are current but another executor may have a different Bun/Playwright browser state. [VERIFIED: shell probes]

**Research date:** 2026-06-16  
**Valid until:** 2026-06-23 for local tool availability; 2026-07-16 for the repo architecture recommendation. [ASSUMED]
