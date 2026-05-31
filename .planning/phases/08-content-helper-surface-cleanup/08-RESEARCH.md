# Phase 8: Content Helper Surface Cleanup - Research

**Researched:** 2026-05-31  
**Domain:** TypeScript content-domain API cleanup, import-surface verification, curated portfolio data guardrails  
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

The following content is copied verbatim from `.planning/phases/08-content-helper-surface-cleanup/08-CONTEXT.md`; provenance for this block is `[VERIFIED: .planning/phases/08-content-helper-surface-cleanup/08-CONTEXT.md]`.

### Locked Decisions
### Helper Ownership
- **D-01:** Treat `curatedProjects` as the authoritative checked-in registry and selector functions such as `homeProjects`, `publicProjectIndexProjects`, `visibleProjects`, `hiddenExcludedProjects`, `currentFocusProjects`, `projectsByPlacement`, `writingProjects`, `projectAnchorHref`, and `projectLinkDisplayLabel` as the supported maintainer-facing API.
- **D-02:** Remove or deprecate seed-era aliases that add no meaning. `projectSeeds` should not remain a runtime-facing export unless a test fixture explicitly needs that legacy name, and current code does not show a fixture-only consumer.
- **D-03:** Replace ambiguous link helpers with an intentionally named selector if they are still useful. `primaryProjectLink` should either become a documented selector with explicit semantics or be replaced by a name that tells maintainers why the first link is selected.

### Runtime Guardrails
- **D-04:** Add an import-surface guard that fails if `src/routes/**/*.tsx`, `src/components/**/*.tsx`, or other visitor-runtime source imports `projectSeeds` or other legacy helper names from `src/domain/projects`.
- **D-05:** Keep build-time scripts allowed to import the authoritative registry and supported selector APIs, but they should not use seed-era aliases.
- **D-06:** Prefer a small repo-owned Bun/TypeScript verifier over a new dependency. The verifier should be deterministic, path-scoped, and wired into `bun run verify`.

### Maintainer Update Path
- **D-07:** Document the supported curated project selector API close to the data module or in an existing maintainer-facing document so future project data edits use the intentional surface.
- **D-08:** Add unit coverage for helper export behavior and import guard behavior. Tests should prove existing curated project behavior remains unchanged while seed-era helper dependencies are blocked.
- **D-09:** Keep runtime portfolio routes on selector APIs; do not broaden the public UI or add new project content in this phase.

### the agent's Discretion
- The exact replacement name for `primaryProjectLink`, if the implementation keeps a first-link selector.
- Whether the import guard lives in a new script or an existing verifier, as long as `bun run verify` fails on forbidden runtime imports.
- Whether documentation is a TSDoc block in `src/domain/projects.ts`, a short README section, or both, as long as maintainers can find the supported selector contract.

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| DATA-01 | Maintainer can tell whether seed-era helpers such as `projectSeeds` and `primaryProjectLink` are intentional exported fixtures or removable implementation leftovers. | `projectSeeds` and `primaryProjectLink` are only defined in `src/domain/projects.ts` and only referenced by planning artifacts outside source, so treat them as removable leftovers unless implementation discovers a hidden fixture need. `[VERIFIED: rg projectSeeds primaryProjectLink]` |
| DATA-02 | Maintainer can rely on tests or import checks proving runtime portfolio surfaces use intentional curated project selector APIs instead of orphaned helper exports. | Runtime routes already import selectors such as `homeProjects`, `currentFocusProjects`, `publicProjectIndexProjects`, `projectsByPlacement`, and `projectLinkDisplayLabel`; add a repo-owned verifier to keep that import surface intentional. `[VERIFIED: src/routes/index.tsx; src/routes/projects.tsx; package.json]` |
| DATA-03 | Maintainer can update curated project data without reintroducing undocumented seed-era helper dependencies. | Document the supported selector contract in `src/domain/projects.ts`, update unit tests, and wire the import guard into `bun run verify` before build/release checks. `[VERIFIED: src/domain/projects.ts; src/domain/foundation.test.ts; src/domain/portfolio-surfaces.test.ts; package.json]` |
</phase_requirements>

## Summary

Phase 8 is an internal TypeScript/API cleanup with no product-content expansion and no new runtime dependency need. `[VERIFIED: .planning/ROADMAP.md; .planning/phases/08-content-helper-surface-cleanup/08-CONTEXT.md]`

The source audit found `projectSeeds` and `primaryProjectLink` only as exports in `src/domain/projects.ts`; no `src/routes`, `src/components`, `scripts`, or tests consume either helper today. `[VERIFIED: rg projectSeeds primaryProjectLink]`

`featuredProjects` is also an alias that delegates directly to `homeProjects`, and its only current consumer is the compatibility test in `src/domain/foundation.test.ts`. `[VERIFIED: src/domain/projects.ts; src/domain/foundation.test.ts; rg featuredProjects]`

**Primary recommendation:** remove `projectSeeds` and `primaryProjectLink`, remove or explicitly deprecate `featuredProjects` as a legacy compatibility alias, document the supported selector surface in `src/domain/projects.ts`, and add a TypeScript AST import guard wired into `bun run verify`. `[VERIFIED: .planning/phases/08-content-helper-surface-cleanup/08-CONTEXT.md; package.json; TypeScript docs https://www.typescriptlang.org/dev/typescript-vfs/]`

## Project Constraints (from AGENTS.md)

- Prefer `AGENTS.md` over legacy `CLAUDE.md`; this repo has `AGENTS.md`, `AGENTS.bright-builds.md`, and `standards-overrides.md`. `[VERIFIED: AGENTS.md; AGENTS.bright-builds.md; standards-overrides.md]`
- Before planning, review repo-local instructions, Bright Builds sidecar rules, standards overrides, and relevant pinned canonical standards pages. `[VERIFIED: AGENTS.md; AGENTS.bright-builds.md; fetched bright-builds-rules commit 05f8d7a6c9c2e157ec4f922a05273e72dab97676]`
- Use GSD planning artifacts and commit planning docs as part of repo history. `[VERIFIED: AGENTS.md; .planning/config.json commit_docs=true]`
- For TypeScript/JavaScript work, prefer Bun, respect existing lockfiles, run format/lint/typecheck/build/tests when relevant, use `camelCase`, prefix nullable internal values with `maybe`, and minimize nesting with early returns. `[VERIFIED: AGENTS.md; AGENTS.bright-builds.md; Bright Builds TypeScript standard]`
- Keep business logic in pure data-in/data-out functions and keep imperative I/O in thin shells. `[CITED: Bright Builds architecture standard at https://github.com/bright-builds-llc/bright-builds-rules/blob/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/architecture.md]`
- Unit tests for pure/business logic must be focused and should use Arrange, Act, Assert structure. `[CITED: Bright Builds testing standard at https://github.com/bright-builds-llc/bright-builds-rules/blob/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/testing.md]`
- Prefer repo-owned verification entrypoints and do not commit with failing relevant checks. `[CITED: Bright Builds verification standard at https://github.com/bright-builds-llc/bright-builds-rules/blob/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/verification.md]`
- Repo-local UI guidance is dark-primary, but Phase 8 should not change visitor-facing UI. `[VERIFIED: AGENTS.md; .planning/phases/08-content-helper-surface-cleanup/08-CONTEXT.md]`
- No `.claude/skills/` or `.agents/skills/` project skill directories were present. `[VERIFIED: find .claude/skills .agents/skills -maxdepth 2 -type f -name SKILL.md]`
- `standards-overrides.md` contains only the placeholder table and no active Phase 8 exception. `[VERIFIED: standards-overrides.md]`

## Standard Stack

### Core

| Library / Tool | Version | Purpose | Why Standard |
|----------------|---------|---------|--------------|
| Bun | package pin `1.3.14`; local CLI `1.3.9` | Run repo scripts and verifier commands | `package.json` sets `packageManager` to Bun and every verification script is invoked through `bun run`. `[VERIFIED: package.json; bun --version]` |
| TypeScript | `6.0.3`, published 2026-04-16 | Strict typechecking and AST parsing for the import guard | The repo already depends on TypeScript, `tsconfig.json` includes `src`, `scripts`, and `tests`, and official TypeScript docs expose compiler API entrypoints. `[VERIFIED: package.json; tsconfig.json; npm view typescript; CITED: https://www.typescriptlang.org/dev/typescript-vfs/]` |
| Vitest | `4.1.7`, published 2026-05-20 | Unit tests for selector behavior and import-guard pure functions | Existing domain and script tests use Vitest, and `bun run test` maps to `vitest run`. `[VERIFIED: package.json; src/domain/*.test.ts; scripts/*.test.ts; npm view vitest]` |
| Biome | pinned `2.4.15`, published 2026-05-09; registry latest `2.4.16` as of 2026-05-31 | Formatting and linting | Existing `format`, `format:check`, `lint`, and `check` scripts use Biome; do not upgrade during this cleanup unless a tool bug blocks the phase. `[VERIFIED: package.json; biome.json; npm view @biomejs/biome]` |

### Supporting

| Library / Tool | Version | Purpose | When to Use |
|----------------|---------|---------|-------------|
| SolidJS / SolidStart | `solid-js@1.9.13`, `@solidjs/start@1.3.2` | Existing static portfolio framework | Do not change for Phase 8; only preserve route behavior that already consumes project selectors. `[VERIFIED: package.json; src/routes/index.tsx; src/routes/projects.tsx; npm view solid-js; npm view @solidjs/start]` |
| Node.js / npm | local Node `v24.13.0`, npm `11.6.2` | Registry verification and ecosystem tooling fallback | Available locally for research and dependency metadata; implementation should still use Bun scripts. `[VERIFIED: node --version; npm --version; package.json]` |
| ripgrep | local `15.1.0` | Source audits during implementation and review | Use for fast usage checks, but do not rely on grep alone for the import guard. `[VERIFIED: rg --version; TypeScript docs https://www.typescriptlang.org/dev/typescript-vfs/]` |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| TypeScript compiler API import guard | Regex-only scan like `verify-no-github-runtime.ts` | Regex is adequate for broad forbidden strings, but imports can be multiline, aliased, type-only, or namespace-based; TypeScript AST parsing is more precise without adding a dependency. `[VERIFIED: scripts/verify-no-github-runtime.ts; CITED: https://www.typescriptlang.org/dev/typescript-vfs/]` |
| New ESLint rule/plugin | ESLint or a custom lint plugin | The repo uses Biome rather than ESLint, and adding ESLint just for this guard would add toolchain surface that the phase decisions explicitly avoid. `[VERIFIED: package.json; .planning/phases/08-content-helper-surface-cleanup/08-CONTEXT.md]` |
| Documentation-only cleanup | TSDoc/README without verifier | Documentation alone would not satisfy DATA-02 because `bun run verify` would not fail when runtime code imports a legacy helper. `[VERIFIED: .planning/REQUIREMENTS.md; package.json]` |

**Installation:** no new packages should be installed for this phase. `[VERIFIED: .planning/phases/08-content-helper-surface-cleanup/08-CONTEXT.md; package.json]`

**Version verification commands run:** `npm view typescript version time.modified --json`, `npm view vitest version time.modified --json`, `npm view @biomejs/biome version time.modified --json`, `npm view @types/bun version time.modified --json`, `npm view solid-js version time.modified --json`, and `npm view @solidjs/start version time.modified --json`. `[VERIFIED: npm registry]`

## Architecture Patterns

### Recommended Project Structure

```text
src/domain/
├── projects.ts                     # authoritative registry, supported selector docs, no orphaned aliases
├── foundation.test.ts              # registry/API compatibility assertions
└── portfolio-surfaces.test.ts      # selector behavior and visitor-facing data behavior
scripts/
├── verify-project-helper-surface.ts      # AST import guard with exported pure functions plus CLI shell
└── project-helper-surface.test.ts        # guard behavior tests using source-string fixtures
package.json                       # add verify:project-helper-surface and wire into verify
```

This structure matches the existing split between pure domain helpers and repo-owned verifier scripts. `[VERIFIED: src/domain/projects.ts; scripts/verify-release.ts; scripts/release-readiness.test.ts]`

### Pattern 1: Authoritative Registry Plus Named Selectors

**What:** keep `curatedProjects` as the checked-in data source and expose only named selectors that describe visitor or maintainer intent. `[VERIFIED: .planning/phases/08-content-helper-surface-cleanup/08-CONTEXT.md; src/domain/projects.ts]`

**When to use:** any route, SEO helper, static verifier, or build-time script that needs curated project records should import `curatedProjects` or a supported selector rather than an alias. `[VERIFIED: src/routes/index.tsx; src/routes/projects.tsx; scripts/verify-static.ts; src/domain/seo.ts]`

**Example:**

```ts
// Source: src/routes/projects.tsx and src/domain/projects.ts
import {
  curatedProjects,
  hiddenExcludedProjects,
  projectsByPlacement,
  publicProjectIndexProjects,
} from "../domain/projects";

const publicProjectList = publicProjectIndexProjects();
const flagshipProjects = projectsByPlacement("home", publicProjectList);
const hiddenExcludedProjectList = hiddenExcludedProjects(curatedProjects);
```

### Pattern 2: Pure Scanner Core, CLI Shell

**What:** export scanner functions that return findings, then keep filesystem reads, console output, and `process.exit(1)` inside an `if (import.meta.main)` shell. `[VERIFIED: scripts/verify-release.ts; scripts/verify-release.test.ts]`

**When to use:** the import guard needs unit tests without triggering the CLI exit path. `[VERIFIED: scripts/verify-release.ts; scripts/verify-release.test.ts]`

**Example:**

```ts
// Source: scripts/verify-release.ts pattern
export function projectHelperSurfaceFindingsForSource(
  filePath: string,
  source: string,
): readonly ProjectHelperSurfaceFinding[] {
  // Pure AST scan lives here.
  return [];
}

if (import.meta.main) {
  runProjectHelperSurfaceVerification();
}
```

### Pattern 3: AST Import Detection Instead of Text Matching

**What:** parse `.ts` and `.tsx` files with the TypeScript compiler API, inspect `ImportDeclaration` and `ExportDeclaration`, and report forbidden named imports from `src/domain/projects`. `[CITED: https://www.typescriptlang.org/dev/typescript-vfs/; VERIFIED: package.json typescript@6.0.3]`

**When to use:** import guards must handle aliases, multiline imports, type-only imports, and namespace imports deterministically. `[VERIFIED: TypeScript compiler API availability; ASSUMED: namespace import bypass risk from standard ES module semantics]`

**Example:**

```ts
// Source: TypeScript compiler API docs and repo script style
import ts from "typescript";

const forbiddenProjectHelperExports = new Set([
  "projectSeeds",
  "primaryProjectLink",
  "featuredProjects",
]);

function importedBindingName(specifier: ts.ImportSpecifier): string {
  return specifier.propertyName?.text ?? specifier.name.text;
}
```

### Anti-Patterns to Avoid

- **Leaving alias ambiguity in place:** `projectSeeds = curatedProjects` and `primaryProjectLink(project) = project.links[0]` add no documented meaning today. `[VERIFIED: src/domain/projects.ts; rg projectSeeds primaryProjectLink]`
- **Regex-only import parsing:** regex can miss alias, multiline, namespace, or re-export shapes that the TypeScript parser can identify. `[CITED: https://www.typescriptlang.org/dev/typescript-vfs/; VERIFIED: scripts/verify-no-github-runtime.ts]`
- **Scanning planning docs, tests, or generated output as runtime source:** planning files intentionally contain legacy helper names, and tests should be able to contain fixture strings for the guard. `[VERIFIED: rg projectSeeds primaryProjectLink; .gitignore]`
- **Changing curated behavior while cleaning exports:** home ordering, focus ordering, visibility filtering, anchors, labels, and JSON-LD inputs already have tests and should remain stable. `[VERIFIED: src/domain/foundation.test.ts; src/domain/portfolio-surfaces.test.ts]`

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Import syntax parsing | Ad hoc regex parser for `import { ... }` blocks | TypeScript compiler API from existing `typescript` dependency | It handles TypeScript/TSX syntax and gives structured import/export nodes without a new dependency. `[CITED: https://www.typescriptlang.org/dev/typescript-vfs/; VERIFIED: package.json]` |
| Curated project filtering | Duplicate route-local filters for placement, hidden status, or sorting | Existing selectors in `src/domain/projects.ts` | Current routes already centralize behavior through selectors and tests verify the expected output. `[VERIFIED: src/routes/index.tsx; src/routes/projects.tsx; src/domain/portfolio-surfaces.test.ts]` |
| Verifier test harness | Top-level script that exits during import | Export pure functions and gate CLI execution behind `if (import.meta.main)` | Existing tested scripts use this pattern to make verifier logic unit-testable. `[VERIFIED: scripts/verify-release.ts; scripts/verify-release.test.ts]` |
| External dependency enforcement | New ESLint/plugin stack | Repo-owned Bun/TypeScript script | Phase decisions prefer a small deterministic verifier and the repo currently uses Biome, not ESLint. `[VERIFIED: .planning/phases/08-content-helper-surface-cleanup/08-CONTEXT.md; package.json]` |

**Key insight:** the cleanup is about making the module boundary explicit, not about inventing a broader data framework. `[VERIFIED: .planning/ROADMAP.md; .planning/phases/08-content-helper-surface-cleanup/08-CONTEXT.md]`

## Runtime State Inventory

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | None in repo-owned source or config; only `node_modules` type declarations mentioned SQLite during a broad file scan. `[VERIFIED: find . -maxdepth 4 ... *.db *.sqlite; rg projectSeeds primaryProjectLink]` | No data migration; code edit only. `[VERIFIED: src/domain/projects.ts]` |
| Live service config | None in source-controlled service config for these helper names; `.github/workflows/bright-builds-auto-update.yml` exists but does not reference the helper names. `[VERIFIED: find . -maxdepth 4 *.yml *.yaml *.toml *.json *.md; rg projectSeeds primaryProjectLink]` | No live-service patch for Phase 8. `[VERIFIED: rg projectSeeds primaryProjectLink]` |
| OS-registered state | None found in repo configuration for `pm2`, `systemd`, `launchd`, or scheduler-like references to these helper names. `[VERIFIED: rg DATABASE REDIS CLOUDFLARE WORKER PM2 systemd launchd PROJECT_SEEDS PRIMARY_PROJECT_LINK projectSeeds primaryProjectLink]` | No OS re-registration. `[VERIFIED: same rg audit]` |
| Secrets/env vars | `.gitignore` excludes `.env` and `.env.*`; no source-controlled env or secret file containing helper names was found. `[VERIFIED: .gitignore; find . -maxdepth 4 .env* *secret*; rg PROJECT_SEEDS PRIMARY_PROJECT_LINK]` | No secret key rename. `[VERIFIED: same env audit]` |
| Build artifacts | `.output` and `.vinxi` are generated and gitignored; no helper-name occurrences were found in `.output` or `.vinxi`. `[VERIFIED: .gitignore; find generated dirs; rg projectSeeds primaryProjectLink featuredProjects .output .vinxi]` | Rebuild after code changes through existing `bun run build`; no artifact migration. `[VERIFIED: package.json]` |

**Nothing found in runtime state categories:** after source updates, the remaining risk is stale generated output until `bun run build` refreshes `.output`, not persisted external data. `[VERIFIED: .gitignore; package.json; rg .output .vinxi]`

## Common Pitfalls

### Pitfall 1: Treating Alias Removal as Behavior Cleanup

**What goes wrong:** removing aliases accidentally changes selector behavior or route output. `[VERIFIED: src/domain/projects.ts; src/routes/index.tsx; src/routes/projects.tsx]`

**Why it happens:** the data registry and selector helpers live in the same file, so export cleanup can drift into filtering/sorting edits. `[VERIFIED: src/domain/projects.ts]`

**How to avoid:** keep edits scoped to exports/docs/guard wiring and rerun focused domain tests. `[VERIFIED: src/domain/foundation.test.ts; src/domain/portfolio-surfaces.test.ts; package.json]`

**Warning signs:** diffs change `displayOrder`, `includeOnHome`, `includeInProjectIndex`, `currentFocusProjectSlugs`, or selector predicates. `[VERIFIED: src/domain/projects.ts]`

### Pitfall 2: Import Guard False Positives

**What goes wrong:** the guard fails on planning docs, generated output, or tests that intentionally mention legacy names. `[VERIFIED: rg projectSeeds primaryProjectLink; .gitignore]`

**Why it happens:** a broad text scan does not know which files are runtime or verifier source. `[VERIFIED: scripts/verify-no-github-runtime.ts]`

**How to avoid:** scan `src/**/*.ts(x)` and `scripts/**/*.ts`, exclude `*.test.ts`, exclude `src/domain/projects.ts`, and resolve imports to `src/domain/projects`. `[VERIFIED: tsconfig.json; src/domain/projects.ts; scripts/*.test.ts]`

**Warning signs:** failures point at `.planning/`, `.output/`, `.vinxi/`, or a `*.test.ts` fixture. `[VERIFIED: .gitignore; find generated dirs]`

### Pitfall 3: Namespace Import Bypass

**What goes wrong:** `import * as projects from "../domain/projects"` can hide `projects.projectSeeds` from a named-import-only guard. `[ASSUMED]`

**Why it happens:** namespace imports defer the accessed member to later property expressions. `[ASSUMED]`

**How to avoid:** fail namespace imports from `src/domain/projects` in guarded runtime/script files and require named imports of supported selectors. `[VERIFIED: current source uses named imports from projects module]`

**Warning signs:** a guarded file imports a projects namespace instead of specific helpers. `[VERIFIED: rg import from domain/projects]`

### Pitfall 4: Untestable CLI Verifier

**What goes wrong:** tests import a script and immediately trigger process exit. `[VERIFIED: scripts/verify-no-github-runtime.ts top-level exit path]`

**Why it happens:** scanner logic, filesystem traversal, logging, and exit behavior are all top-level. `[VERIFIED: scripts/verify-no-github-runtime.ts]`

**How to avoid:** follow `scripts/verify-release.ts`: export pure functions and put CLI execution behind `if (import.meta.main)`. `[VERIFIED: scripts/verify-release.ts; scripts/verify-release.test.ts]`

**Warning signs:** a new `scripts/*.test.ts` cannot import the verifier without stubbing `process.exit`. `[VERIFIED: scripts/verify-release.test.ts]`

## Code Examples

Verified patterns from local code and official sources follow.

### Supported Selector Documentation Block

```ts
// Source: src/domain/projects.ts plus Phase 8 CONTEXT.md
/**
 * Maintainer-facing project data surface.
 *
 * `curatedProjects` is the authoritative checked-in registry. Runtime routes,
 * SEO helpers, and release verifiers should use the named selectors below
 * instead of seed-era aliases.
 */
export const curatedProjects = [
  // ...
] as const satisfies readonly ProjectStory[];
```

### AST Guard Core

```ts
// Source: TypeScript compiler API docs and repo verifier style
import { readFileSync } from "node:fs";
import ts from "typescript";

const forbiddenProjectHelperExports = new Set([
  "projectSeeds",
  "primaryProjectLink",
  "featuredProjects",
]);

export function projectHelperSurfaceFindingsForSource(
  filePath: string,
  source: string,
): readonly ProjectHelperSurfaceFinding[] {
  const sourceFile = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true);
  const findings: ProjectHelperSurfaceFinding[] = [];

  ts.forEachChild(sourceFile, (node) => {
    if (!ts.isImportDeclaration(node) || !ts.isStringLiteral(node.moduleSpecifier)) {
      return;
    }

    if (!isProjectsModuleImport(filePath, node.moduleSpecifier.text)) {
      return;
    }

    const namedBindings = node.importClause?.namedBindings;

    if (namedBindings && ts.isNamespaceImport(namedBindings)) {
      findings.push(finding(filePath, node, "namespace import from project helpers"));
      return;
    }

    if (!namedBindings || !ts.isNamedImports(namedBindings)) {
      return;
    }

    for (const specifier of namedBindings.elements) {
      const importedName = specifier.propertyName?.text ?? specifier.name.text;

      if (forbiddenProjectHelperExports.has(importedName)) {
        findings.push(finding(filePath, specifier, importedName));
      }
    }
  });

  return findings;
}
```

### Export Surface Regression Test

```ts
// Source: Vitest patterns in src/domain/foundation.test.ts
import { describe, expect, it } from "vitest";
import * as projectSurface from "./projects";

describe("curated project helper surface", () => {
  it("does not expose seed-era helper aliases", () => {
    // Arrange
    const legacyExports = ["projectSeeds", "primaryProjectLink"];

    // Act
    const exposedLegacyExports = legacyExports.filter((name) => name in projectSurface);

    // Assert
    expect(exposedLegacyExports).toEqual([]);
  });
});
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Seed-era aliases such as `projectSeeds` | Authoritative `curatedProjects` plus named selectors | Phase 8 should make this explicit. `[VERIFIED: .planning/ROADMAP.md; src/domain/projects.ts]` | Maintainers can understand the intended data surface without reverse-engineering alias history. `[VERIFIED: .planning/REQUIREMENTS.md]` |
| Ambiguous first-link helper `primaryProjectLink` | No replacement unless a real consumer needs a first-link selector; if needed, name it after semantics. | Phase 8 discretion. `[VERIFIED: .planning/phases/08-content-helper-surface-cleanup/08-CONTEXT.md; rg primaryProjectLink]` | Avoids documenting unused helper behavior as public API. `[VERIFIED: rg primaryProjectLink]` |
| Regex-only source scanning for all problems | Regex for broad forbidden strings, TypeScript AST for import-surface contracts | Phase 8 should add this distinction. `[VERIFIED: scripts/verify-no-github-runtime.ts; CITED: https://www.typescriptlang.org/dev/typescript-vfs/]` | The guard can catch multiline and aliased imports without a new package. `[VERIFIED: package.json; TypeScript docs]` |

**Deprecated/outdated:**
- `projectSeeds`: removable alias of `curatedProjects` with no source consumer. `[VERIFIED: src/domain/projects.ts; rg projectSeeds]`
- `primaryProjectLink`: removable first-link helper with no source consumer. `[VERIFIED: src/domain/projects.ts; rg primaryProjectLink]`
- `featuredProjects`: compatibility alias candidate because it delegates to `homeProjects` and only current usage is a compatibility unit test. `[VERIFIED: src/domain/projects.ts; src/domain/foundation.test.ts; rg featuredProjects]`

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Namespace imports can bypass a named-import-only guard unless the scanner also blocks namespace imports or checks property access. | Common Pitfalls; Architecture Patterns | Guard might miss a future legacy helper dependency introduced through `projects.projectSeeds`. |
| A2 | Research should stay valid until 2026-06-30 unless dependency maintenance is added to the phase. | Metadata | Planner might rely on stale npm registry state if the phase expands into package upgrades. |

## Open Questions

1. **Should `featuredProjects` be removed in Phase 8 or retained as explicitly deprecated compatibility?**  
   - What we know: it delegates to `homeProjects` and only `src/domain/foundation.test.ts` imports it. `[VERIFIED: src/domain/projects.ts; src/domain/foundation.test.ts; rg featuredProjects]`  
   - What's unclear: the Phase 8 context names `projectSeeds` and `primaryProjectLink` directly, while `featuredProjects` is a second alias that adds no behavior but is not directly named in DATA-01. `[VERIFIED: .planning/phases/08-content-helper-surface-cleanup/08-CONTEXT.md; .planning/REQUIREMENTS.md]`  
   - Recommendation: remove it if the planner treats "seed-era aliases that add no meaning" broadly; otherwise mark it deprecated in TSDoc and include it in the import guard's forbidden runtime names. `[VERIFIED: .planning/phases/08-content-helper-surface-cleanup/08-CONTEXT.md]`

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Bun | Script execution and `bun run verify` | ✓, but below package pin | local `1.3.9`; package pin `1.3.14` | Use existing local Bun for planning/implementation; upgrade to `1.3.14` only if a command fails due version drift. `[VERIFIED: bun --version; package.json]` |
| TypeScript | Typecheck and AST import guard | ✓ | `6.0.3` | No fallback needed. `[VERIFIED: bun run typecheck --version; package.json]` |
| Vitest | Domain and verifier unit tests | ✓ | `4.1.7` | No fallback needed. `[VERIFIED: bunx --bun vitest --version; package.json]` |
| Biome | Format/lint/check | ✓ | installed `2.4.15`; registry latest `2.4.16` | Keep pinned version for this phase; upgrade only in a separate dependency-maintenance task. `[VERIFIED: bunx --bun biome --version; npm view @biomejs/biome]` |
| Node.js | Tool compatibility and npm registry queries | ✓ | `v24.13.0` | Implementation should still prefer Bun scripts. `[VERIFIED: node --version; package.json]` |
| ripgrep | Source audits | ✓ | `15.1.0` | Use TypeScript AST for enforceable import guard. `[VERIFIED: rg --version]` |

**Missing dependencies with no fallback:** none found. `[VERIFIED: environment commands above]`

**Missing dependencies with fallback:** local Bun is older than the package pin, but current repo commands resolved during research. `[VERIFIED: bun --version; package.json]`

## Security Domain

Security enforcement is enabled by default because `.planning/config.json` does not set `security_enforcement` to `false`. `[VERIFIED: .planning/config.json]`

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|------------------|
| V2 Authentication | no | Phase 8 does not add authentication or identity flows. `[VERIFIED: .planning/ROADMAP.md; OWASP ASVS category list https://devguide.owasp.org/en/03-requirements/05-asvs/]` |
| V3 Session Management | no | Phase 8 does not add sessions, cookies, or logged-in state. `[VERIFIED: .planning/ROADMAP.md; OWASP ASVS category list https://devguide.owasp.org/en/03-requirements/05-asvs/]` |
| V4 Access Control | no | Phase 8 does not add protected resources or authorization checks. `[VERIFIED: .planning/ROADMAP.md; OWASP ASVS category list https://devguide.owasp.org/en/03-requirements/05-asvs/]` |
| V5 Validation, Sanitization and Encoding | yes | Use typed project data, TypeScript AST parsing for import declarations, and existing static verification for rendered output. `[VERIFIED: src/domain/projects.ts; scripts/verify-static.ts; TypeScript docs https://www.typescriptlang.org/dev/typescript-vfs/; OWASP ASVS category list https://devguide.owasp.org/en/03-requirements/05-asvs/]` |
| V6 Stored Cryptography | no | Phase 8 does not introduce cryptographic storage or secret handling. `[VERIFIED: .planning/ROADMAP.md; Runtime State Inventory]` |

### Known Threat Patterns for TypeScript Static Portfolio Helper Cleanup

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Runtime visitor code imports orphaned seed-era helpers | Tampering | Fail `bun run verify` through the project-helper import guard. `[VERIFIED: .planning/REQUIREMENTS.md; package.json]` |
| Guard misses alias or namespace import form | Tampering | Parse imports with TypeScript AST and fail namespace imports from `src/domain/projects` in guarded files. `[CITED: https://www.typescriptlang.org/dev/typescript-vfs/; ASSUMED]` |
| Build-time scripts rely on old alias names after source cleanup | Tampering | Include non-test `scripts/**/*.ts` in the guard while still allowing `curatedProjects` and supported selectors. `[VERIFIED: .planning/phases/08-content-helper-surface-cleanup/08-CONTEXT.md; scripts/verify-static.ts]` |

## Sources

### Primary (HIGH confidence)
- `.planning/phases/08-content-helper-surface-cleanup/08-CONTEXT.md` - locked decisions, discretion areas, and deferred scope. `[VERIFIED: file read]`
- `.planning/REQUIREMENTS.md` - DATA-01, DATA-02, DATA-03 definitions and traceability. `[VERIFIED: file read]`
- `.planning/ROADMAP.md` - Phase 8 goal and success criteria. `[VERIFIED: file read]`
- `.planning/STATE.md` and `.planning/PROJECT.md` - milestone state and release-confidence context. `[VERIFIED: file read]`
- `AGENTS.md`, `AGENTS.bright-builds.md`, `standards-overrides.md` - repo instructions and Bright Builds workflow requirements. `[VERIFIED: file read]`
- `src/domain/projects.ts` - registry, selectors, and legacy exports. `[VERIFIED: file read]`
- `src/domain/foundation.test.ts`, `src/domain/portfolio-surfaces.test.ts`, `src/domain/project-validation.test.ts` - existing behavior coverage. `[VERIFIED: file read]`
- `scripts/verify-no-github-runtime.ts`, `scripts/verify-release.ts`, `scripts/verify-release.test.ts`, `scripts/release-readiness.test.ts` - verifier patterns. `[VERIFIED: file read]`
- `package.json`, `tsconfig.json`, `biome.json` - toolchain and aggregate verification contract. `[VERIFIED: file read]`
- npm registry queries for `typescript`, `vitest`, `@biomejs/biome`, `@types/bun`, `solid-js`, and `@solidjs/start`. `[VERIFIED: npm registry]`

### Secondary (MEDIUM confidence)
- TypeScript official developer docs for compiler API/VFS usage: `https://www.typescriptlang.org/dev/typescript-vfs/`. `[CITED: official docs]`
- TypeScript 5.5 release notes for ESM named import improvements: `https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-5.html`. `[CITED: official docs]`
- OWASP Developer Guide ASVS category overview: `https://devguide.owasp.org/en/03-requirements/05-asvs/`. `[CITED: OWASP docs]`

### Tertiary (LOW confidence)
- None. `[VERIFIED: research log]`

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - versions and local availability were verified from `package.json`, local CLIs, and npm registry queries. `[VERIFIED: package.json; npm registry; local version commands]`
- Architecture: HIGH - the recommended structure matches existing domain/test/script patterns. `[VERIFIED: src/domain/projects.ts; scripts/verify-release.ts; scripts/*.test.ts]`
- Pitfalls: MEDIUM-HIGH - most are directly visible from current code; namespace-import bypass risk is an assumption from JavaScript module behavior and should be covered by tests. `[VERIFIED: source audit; ASSUMED]`

**Research date:** 2026-05-31  
**Valid until:** 2026-06-30 for codebase-specific findings; recheck npm versions if dependency maintenance is added to the phase. `[ASSUMED]`
