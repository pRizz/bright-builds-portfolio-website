# Phase 02: Curated Content Model - Research

**Researched:** 2026-05-25
**Domain:** TypeScript static content registry, curation validation, SolidStart static verification, no-runtime-GitHub boundary
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

The following constraints are copied from `.planning/phases/02-curated-content-model/02-CONTEXT.md`. [VERIFIED: .planning/phases/02-curated-content-model/02-CONTEXT.md]

### Locked Decisions

#### Registry taxonomy and data shape

- **D-01:** Model publishable work as curated project stories, not raw GitHub repositories. A
  project story may have one or more source links and aliases.
- **D-02:** Use a type-first TypeScript registry with discriminated placement or curation state
  instead of adding a schema/parser dependency in Phase 2.
- **D-03:** The registry must carry explicit placement/curation tier, source type, maturity,
  inclusion flags, display order, themes, tags, role, useful links, status, authored one-line
  copy, and curation reason.
- **D-04:** Make flagship/home placement a stricter state than supporting/lab/archive placement.
  Flagship records must not be representable as vague repo stubs.
- **D-05:** Keep GitHub-derived fields advisory and optional. GitHub metadata may enrich a
  curated record later, but it cannot decide placement, ordering, or whether a project is
  flagship.

#### Validation and invalid-state prevention

- **D-06:** Implement pure validation functions that return structured errors and warnings,
  then cover those rules with Vitest.
- **D-07:** Treat missing flagship/home authored copy, curation reason, useful links,
  original-work status, or maturity/status as hard validation errors.
- **D-08:** Treat forks, repros, playgrounds, generated/profile/support repos, unreviewed
  prototypes, and archived work as excluded from flagship/home by default unless explicitly
  promoted with a documented reason.
- **D-09:** Warnings are acceptable for lower-tier review signals, but `bun run verify` should
  fail on hard curation errors.
- **D-10:** Do not add Zod or another parser for the checked-in TypeScript registry in this
  phase. Reserve schema parsing for future boundary inputs such as optional GitHub snapshots.

#### Initial curated set

- **D-11:** Include the named Phase 2 review set as explicit project-story records: OpenLinks,
  Free The World, Win3Bitco.in / Open Bitcoin Web Miner, Open Bitcoin, opencode-cloud,
  Zeckendorf, Mystic UI, and selected supporting experiments.
- **D-12:** Represent aliases carefully: `open-links` is the OpenLinks source repo, and
  `open-bitcoin-web-miner` is the concrete repo behind Win3Bitco.in / Open Bitcoin Web Miner.
  Do not invent a `pRizz/open-bitcoin` repo unless a real source link exists.
- **D-13:** Mystic UI may be included as strategically important even though GitHub marks the
  repo as a fork; that promotion requires an explicit curation reason.
- **D-14:** The initial registry should provide enough authored copy and review metadata for
  later pages to select 4-6 flagship presentations, while keeping noisier public repos hidden,
  archived, or lab/supporting by default.

#### Static GitHub boundary

- **D-15:** Visitor-critical portfolio content must render from checked-in TypeScript data or
  checked-in static snapshots, never from live browser/runtime GitHub API calls.
- **D-16:** Add a source/runtime guard that allows normal GitHub links but blocks visitor-path
  GitHub API mechanisms such as `fetch` to `api.github.com`, GitHub GraphQL endpoints,
  `@octokit/*`, and browser-exposed GitHub token names in `src/`.
- **D-17:** Extend static verification so generated HTML proves key curated registry/profile
  content exists before hydration.
- **D-18:** Leave optional GitHub metadata refresh scripts and richer snapshots to Phase 5.

#### OpenLinks identity presence

- **D-19:** Keep OpenLinks low-intrusion and discoverable. It belongs as a curated project story
  and identity link, with visible footer/about/contact/profile placement and metadata only
  where existing surfaces support it cleanly.
- **D-20:** Do not let OpenLinks displace the Bright Builds portfolio brand or become repetitive
  in nearby UI surfaces.

### the agent's Discretion

- The agent may choose exact TypeScript file boundaries as long as pure curation logic remains
  testable without DOM, network, or Solid runtime dependencies.
- The agent may choose exact validation issue names and selector helper names, provided errors
  and warnings are structured enough for tests and scripts to assert.
- The agent may choose which supporting experiments to include beyond the named set, but must
  keep the selection explicitly reviewed and must not surface every public repo.

### Deferred Ideas (OUT OF SCOPE)

- Zod/schema parsing for JSON, Markdown, or generated snapshot boundary inputs.
- Optional GitHub metadata refresh, pagination, token-safe environment handling, and checked-in
  snapshot generation.
- Playwright network-denial tests for GitHub API calls.
- Search/filtering across a larger project archive.
- Per-project OG image generation and richer project detail pages.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CUR-01 | Developer can define curated projects in a typed local registry with explicit curation tier, source type, maturity, inclusion flags, display order, themes, tags, role, links, and authored one-line copy. [VERIFIED: .planning/REQUIREMENTS.md] | Use a TypeScript discriminated-union registry with `as const satisfies`, non-empty link tuples for useful links, explicit selector helpers, and no new parser dependency. [CITED: https://www.typescriptlang.org/docs/handbook/2/narrowing.html] [CITED: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html] |
| CUR-02 | The registry prevents or flags invalid flagship states, including home-page projects without authored copy, curation reason, original-work status, useful links, or maturity/status information. [VERIFIED: .planning/REQUIREMENTS.md] | Add pure validation functions that return structured `errors` and `warnings`, then call the hard-error assertion from a Bun verification script. [VERIFIED: src/domain/foundation.test.ts] [VERIFIED: package.json] |
| CUR-03 | Forks, repros, playgrounds, generated/profile/support repos, and unreviewed prototypes are excluded from flagship/home placement by default unless explicitly promoted with a documented reason. [VERIFIED: .planning/REQUIREMENTS.md] | Encode source/review state separately from placement and validate excluded source types before home/flagship selection. [VERIFIED: .planning/phases/02-curated-content-model/02-CONTEXT.md] |
| CUR-05 | Developer can maintain an initial curated set that reviews OpenLinks, Free The World, Win3Bitco.in / Open Bitcoin Web Miner, Open Bitcoin, opencode-cloud, Zeckendorf, Mystic UI, and selected supporting experiments without surfacing all public GitHub repos. [VERIFIED: .planning/REQUIREMENTS.md] | Use explicit project-story records and source aliases; verified live source repos include `pRizz/open-links`, `pRizz/free-the-world`, `pRizz/open-bitcoin-web-miner`, `pRizz/opencode-cloud`, `pRizz/zeckendorf`, and `pRizz/mystic-ui`; `pRizz/openlinks`, `pRizz/win3bitcoin`, and `pRizz/open-bitcoin` returned no repository. [VERIFIED: GitHub CLI/API, 2026-05-25] |
| GH-01 | The site does not require live browser/runtime GitHub API calls to render complete portfolio content. [VERIFIED: .planning/REQUIREMENTS.md] | Keep GitHub metadata advisory and checked in later; add a `src/` source guard for GitHub API endpoints, Octokit imports, and browser-visible token names; extend static HTML verification after `bun run build`. [VERIFIED: .planning/phases/02-curated-content-model/02-CONTEXT.md] [CITED: https://docs.github.com/en/graphql/guides/forming-calls-with-graphql] |
</phase_requirements>

## Project Constraints (from AGENTS.md)

- Use `AGENTS.md` as the repo-local entrypoint, then `AGENTS.bright-builds.md`, `standards-overrides.md`, and relevant pinned Bright Builds standards. [VERIFIED: AGENTS.md] [VERIFIED: AGENTS.bright-builds.md]
- Keep the site dark-primary by default; avoid light-first UI work unless there is a clear local reason. [VERIFIED: AGENTS.md]
- Do not make direct repo edits outside GSD workflow unless explicitly bypassed; this research was produced inside the requested GSD phase research flow. [VERIFIED: AGENTS.md] [VERIFIED: .planning/config.json]
- Use SolidJS/SolidStart static generation, Tailwind 3.x, and pinned Mystic UI as the established project stack; Phase 2 should not churn the framework or UI stack. [VERIFIED: AGENTS.md] [VERIFIED: package.json]
- Curate original project copy and do not automatically surface every public GitHub repo. [VERIFIED: AGENTS.md] [VERIFIED: .planning/PROJECT.md]
- Keep pure route, project, profile, and SEO derivation testable without DOM, network, or framework runtime dependencies. [VERIFIED: .planning/REQUIREMENTS.md] [VERIFIED: src/domain/foundation.test.ts]
- Follow Bright Builds functional-core guidance: business rules should be pure data-in/data-out functions, and side effects should stay in thin shells. [CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/architecture.md]
- Make illegal states unrepresentable where practical; for TypeScript, use tagged unions, branded types, parsers/factories when useful, and `maybe...` names for nullish internal values. [CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/architecture.md] [CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/languages/typescript-javascript.md]
- Unit-test pure business logic with focused Arrange/Act/Assert tests. [CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/testing.md]
- Prefer repo-owned verification entrypoints; `bun run verify` is the aggregate gate in this repo. [VERIFIED: package.json] [CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/verification.md]
- Do not add new Python scripts to this Bun-friendly TypeScript repository. [CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/languages/typescript-javascript.md]
- Keep OpenLinks low-intrusion: footer/about/profile placement first, visible link before metadata, no repeated aggressive promotion. [VERIFIED: AGENTS.bright-builds.md] [VERIFIED: /Users/peterryszkiewicz/.codex/skills/openlinks-identity-presence/SKILL.md]

## Summary

Phase 2 should evolve the current seed registry into an authoritative TypeScript content domain, not a GitHub repository mirror. [VERIFIED: .planning/phases/02-curated-content-model/02-CONTEXT.md] The right plan is to preserve the existing pure-domain pattern, add a richer discriminated curation model, split pure validation from rendering, and make `bun run verify` fail on hard curation errors. [VERIFIED: src/domain/projects.ts] [VERIFIED: src/domain/foundation.test.ts] [VERIFIED: package.json]

The current source has two important content corrections for planning: `pRizz/openlinks` and `pRizz/win3bitcoin` in `src/domain/projects.ts` are not live repositories, while `pRizz/open-links` and `pRizz/open-bitcoin-web-miner` are live and match the Phase 2 alias decisions. [VERIFIED: src/domain/projects.ts] [VERIFIED: GitHub CLI/API, 2026-05-25] Mystic UI is a GitHub fork and therefore needs an explicit promotion reason if selected for home/flagship placement. [VERIFIED: GitHub CLI/API, 2026-05-25] [VERIFIED: .planning/phases/02-curated-content-model/02-CONTEXT.md]

**Primary recommendation:** Implement a type-first curated project registry plus pure validation, add a `verify:curation` and `verify:no-github-runtime` script, update `verify` to run both before build/static verification, and render a minimal set of curated names/copy into current static routes so `verify-static` proves content exists before hydration. [VERIFIED: package.json] [CITED: https://docs.solidjs.com/solid-start/building-your-application/route-prerendering]

## Standard Stack

### Core

| Library / Tool | Version | Purpose | Why Standard |
|----------------|---------|---------|--------------|
| TypeScript | 6.0.3; npm modified 2026-04-16 [VERIFIED: npm registry] | Type-first registry, discriminated unions, `satisfies`, compile-time shape checks | Already installed and supports the `satisfies` pattern used by the current registry. [VERIFIED: package.json] [CITED: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html] |
| Vitest | 4.1.7; npm modified 2026-05-20 [VERIFIED: npm registry] | Pure domain tests for selector and validation rules | Already used by `src/domain/foundation.test.ts`; supports table-driven tests for validation cases. [VERIFIED: src/domain/foundation.test.ts] [CITED: https://vitest.dev/api/] |
| Bun | `packageManager` pins 1.3.14; local executable is 1.3.9 [VERIFIED: package.json] [VERIFIED: local `bun --version`] | Script runner for `test`, `build`, and aggregate `verify` | Repo-native script surface; do not add another runner for Phase 2. [VERIFIED: package.json] |
| SolidStart | `@solidjs/start` 1.3.2; npm modified 2026-02-24 [VERIFIED: npm registry] | Static prerendered route output | Current `app.config.ts` uses `server.preset = "static"` and explicit prerender routes. [VERIFIED: app.config.ts] [CITED: https://docs.solidjs.com/solid-start/building-your-application/route-prerendering] |
| Biome | 2.4.15; npm modified 2026-05-09 [VERIFIED: npm registry] | Existing format/lint/check gate | Already wired into `format:check`, `lint`, and `check`; keep new TS scripts inside the existing checked paths. [VERIFIED: package.json] |

### Supporting

| Library / Tool | Version | Purpose | When to Use |
|----------------|---------|---------|-------------|
| `@solidjs/meta` | 0.29.4; npm modified 2026-03-17 [VERIFIED: npm registry] | Existing route metadata primitives | Phase 2 should preserve current metadata behavior; richer SEO belongs to Phase 3. [VERIFIED: src/routes/index.tsx] [CITED: https://docs.solidjs.com/solid-start/building-your-application/head-and-metadata] |
| GitHub CLI | 2.87.3 local [VERIFIED: local `gh --version`] | Developer-side repository fact checking during planning | Use only for research or future Phase 5 sync work; do not introduce visitor-runtime GitHub API use. [VERIFIED: .planning/phases/02-curated-content-model/02-CONTEXT.md] |
| ripgrep | 15.1.0 local [VERIFIED: local `rg --version`] | Fast source audit for forbidden GitHub runtime patterns | Useful for planning and verification diagnosis; repo-owned guard script should be deterministic. [VERIFIED: local `rg --version`] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| TypeScript-only registry validation | Zod or another parser | Explicitly deferred for Phase 2; useful later for JSON/GitHub snapshot boundaries, but unnecessary for checked-in TS literals now. [VERIFIED: .planning/phases/02-curated-content-model/02-CONTEXT.md] |
| Checked-in curated data | Runtime GitHub REST/GraphQL calls | Violates GH-01 and adds availability/rate-limit/token risk to visitor-critical rendering. [VERIFIED: .planning/REQUIREMENTS.md] [CITED: https://docs.github.com/en/graphql/guides/forming-calls-with-graphql] |
| Minimal static route proof | Browser network-denial test | Browser denial tests are explicitly deferred; source and static-output guards are enough for Phase 2. [VERIFIED: .planning/phases/02-curated-content-model/02-CONTEXT.md] |
| Local TS verification scripts | New Python scripts | Bright Builds TypeScript standard forbids new Python automation in Bun-friendly TS repos without a concrete compatibility reason. [CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/languages/typescript-javascript.md] |

**Installation:**

```bash
# No new runtime or dev packages are recommended for Phase 2.
bun install
```

**Version verification commands run:**

```bash
npm view typescript version time.modified --json
npm view vitest version time.modified --json
npm view @biomejs/biome version time.modified --json
npm view @solidjs/start version time.modified --json
npm view solid-js version time.modified --json
npm view @solidjs/router version time.modified --json
npm view @solidjs/meta version time.modified --json
npm view vinxi version time.modified --json
npm view vite version time.modified --json
npm view vite-plugin-solid version time.modified --json
npm view @types/bun version time.modified --json
```

## Architecture Patterns

### Recommended Project Structure

```text
src/domain/
├── projects.ts              # Public project types, curated registry, and selector exports.
├── project-validation.ts    # Pure curation validation, issue codes, and assertion helpers.
├── foundation.test.ts       # Existing foundation tests; keep passing while imports migrate.
└── project-validation.test.ts # Focused Phase 2 validation and selector tests.

scripts/
├── verify-static.ts         # Extend to assert curated/profile text in generated HTML.
├── verify-curation.ts       # Fails on hard registry validation errors, prints warnings.
└── verify-no-github-runtime.ts # Scans src for forbidden visitor-path GitHub API/token patterns.
```

This structure keeps the current `src/domain/projects.ts` import surface stable while preventing validation logic from being buried inside route components. [VERIFIED: src/routes/index.tsx] [VERIFIED: src/routes/projects.tsx] [CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/architecture.md]

### Pattern 1: Type-First Curated Project Stories

**What:** Model the registry as project stories with explicit curation, source, review, placement, copy, and link fields. [VERIFIED: .planning/phases/02-curated-content-model/02-CONTEXT.md]

**When to use:** Use for every publishable portfolio item, even if the item has no one-to-one GitHub repo. [VERIFIED: .planning/phases/02-curated-content-model/02-CONTEXT.md]

**Example:**

```typescript
// Source: TypeScript discriminated unions and `satisfies`
// https://www.typescriptlang.org/docs/handbook/2/narrowing.html
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html
export type ProjectPlacement = "home" | "supporting" | "lab" | "archive" | "hidden";
export type SourceType =
  | "original"
  | "fork"
  | "repro"
  | "playground"
  | "generated"
  | "profile"
  | "support"
  | "concept";

export type ProjectLink = {
  label: string;
  href: string;
  kind: "repo" | "live" | "docs" | "article" | "related";
};

type BaseProject = {
  slug: string;
  name: string;
  sourceType: SourceType;
  maturity: "active" | "stable" | "prototype" | "paused" | "archived";
  status: "building" | "maintained" | "paused" | "archived" | "hidden";
  displayOrder: number;
  themes: readonly string[];
  tags: readonly string[];
  role: string;
  links: readonly ProjectLink[];
};

export type HomeProject = BaseProject & {
  placement: "home";
  tier: "flagship";
  oneLine: string;
  curationReason: string;
  originalWork:
    | { kind: "original" }
    | { kind: "promoted-fork"; promotionReason: string };
  links: readonly [ProjectLink, ...ProjectLink[]];
};

export type SupportingProject = BaseProject & {
  placement: "supporting" | "lab" | "archive" | "hidden";
  tier: "supporting" | "lab" | "archive" | "excluded";
  oneLine?: string;
  curationReason?: string;
  originalWork?: { kind: "original" | "fork" | "unreviewed" };
};

export type CuratedProject = HomeProject | SupportingProject;

export const curatedProjects = [
  {
    slug: "openlinks",
    name: "OpenLinks",
    placement: "home",
    tier: "flagship",
    sourceType: "original",
    maturity: "active",
    status: "building",
    displayOrder: 10,
    themes: ["Open web", "Identity"],
    tags: ["profiles", "static-sites"],
    role: "Creator",
    oneLine: "Portable identity and link presence for owned web surfaces.",
    curationReason: "Core identity project with a live public surface.",
    originalWork: { kind: "original" },
    links: [
      { label: "Source", href: "https://github.com/pRizz/open-links", kind: "repo" },
      { label: "Live", href: "https://openlinks.us/", kind: "live" },
    ],
  },
] as const satisfies readonly CuratedProject[];
```

### Pattern 2: Pure Structured Validation

**What:** Return machine-assertable issue objects from pure validation functions, then have a tiny script fail on hard errors. [VERIFIED: .planning/phases/02-curated-content-model/02-CONTEXT.md]

**When to use:** Use for home/flagship rule enforcement, lower-tier warnings, display-order uniqueness, and source-type promotion checks. [VERIFIED: .planning/REQUIREMENTS.md]

**Example:**

```typescript
// Source: current repo pure-domain test style and Bright Builds functional-core guidance.
// src/domain/foundation.test.ts
// https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/architecture.md
export type CurationIssueSeverity = "error" | "warning";
export type CurationIssueCode =
  | "flagship_missing_authored_copy"
  | "flagship_missing_curation_reason"
  | "flagship_missing_useful_link"
  | "flagship_missing_original_work_status"
  | "flagship_blocked_source_type"
  | "duplicate_display_order";

export type CurationIssue = {
  severity: CurationIssueSeverity;
  code: CurationIssueCode;
  slug: string;
  message: string;
};

export function validateProject(project: CuratedProject): readonly CurationIssue[] {
  const issues: CurationIssue[] = [];

  if (project.placement !== "home") {
    return issues;
  }

  if (!project.oneLine.trim()) {
    issues.push({
      severity: "error",
      code: "flagship_missing_authored_copy",
      slug: project.slug,
      message: "Home projects need authored one-line copy.",
    });
  }

  return issues;
}
```

### Pattern 3: Selectors That Enforce Placement Defaults

**What:** Route components should call selectors such as `homeProjects()`, `visibleProjects()`, and `projectsByPlacement()` instead of filtering ad hoc in JSX. [VERIFIED: src/routes/index.tsx] [VERIFIED: src/routes/projects.tsx]

**When to use:** Use for home, project index, static verification, and future metadata derivation. [VERIFIED: .planning/ROADMAP.md]

**Example:**

```typescript
// Source: current `featuredProjects` selector pattern in src/domain/projects.ts.
export function homeProjects(
  projects: readonly CuratedProject[] = curatedProjects,
): readonly HomeProject[] {
  return projects
    .filter((project): project is HomeProject => project.placement === "home")
    .sort((left, right) => left.displayOrder - right.displayOrder);
}
```

### Pattern 4: Repo-Owned Runtime GitHub Guard

**What:** Add a Bun-run TypeScript script that scans `src/` for forbidden GitHub API mechanisms while allowing normal `https://github.com/...` links. [VERIFIED: .planning/phases/02-curated-content-model/02-CONTEXT.md]

**When to use:** Run before build in `bun run verify`; optionally scan generated client JS after build if the script can do so without false positives from its own pattern strings. [VERIFIED: package.json]

**Example:**

```typescript
// Source: current verify-static.ts recursive file-walk style.
// scripts/verify-static.ts
const forbiddenRuntimePatterns = [
  { label: "GitHub REST API endpoint", pattern: /api\.github\.com/ },
  { label: "GitHub GraphQL endpoint", pattern: /github\.com\/graphql|api\.github\.com\/graphql/ },
  { label: "Octokit runtime import", pattern: /from\s+["']@octokit\/|import\s*\(["']@octokit\// },
  { label: "browser-exposed GitHub token", pattern: /VITE_.*GITHUB.*TOKEN|PUBLIC_.*GITHUB.*TOKEN/ },
] as const;
```

### Anti-Patterns to Avoid

- **Raw repo mirror:** Do not generate the registry by listing all public repositories; the project explicitly excludes a raw GitHub mirror. [VERIFIED: .planning/REQUIREMENTS.md]
- **Flagship-by-boolean only:** Do not model flagship with `featured: true` alone; current `ProjectRecord` allows vague stubs and does not encode copy, originality, maturity, status, or curation reason. [VERIFIED: src/domain/projects.ts] [VERIFIED: .planning/REQUIREMENTS.md]
- **Runtime API enrichment:** Do not call GitHub REST, GraphQL, or Octokit from route components or client-side code for visitor-critical content. [VERIFIED: .planning/phases/02-curated-content-model/02-CONTEXT.md] [CITED: https://docs.github.com/en/graphql/guides/forming-calls-with-graphql]
- **Stringly typed placement:** Do not scatter placement checks in route JSX; put curation behavior in selectors and validation. [VERIFIED: src/routes/index.tsx] [VERIFIED: src/routes/projects.tsx]
- **Over-promoting OpenLinks:** Keep OpenLinks as one curated project story plus existing identity placement; do not repeat it aggressively in adjacent UI surfaces. [VERIFIED: AGENTS.bright-builds.md] [VERIFIED: /Users/peterryszkiewicz/.codex/skills/openlinks-identity-presence/SKILL.md]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Runtime repo discovery | A public-GitHub crawler or repo mirror in the app | Checked-in `curatedProjects` records | The phase requires editorial selection and static content independence from live GitHub. [VERIFIED: .planning/REQUIREMENTS.md] |
| Parser/schema dependency for checked-in TS literals | Zod/Joi/custom JSON parser in Phase 2 | TypeScript unions, `satisfies`, and pure validators | Parser dependencies are deferred to future boundary inputs; the registry is source code in this phase. [VERIFIED: .planning/phases/02-curated-content-model/02-CONTEXT.md] [CITED: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html] |
| UI-side curation checks | Per-route `if` statements deciding what is flagship | Pure selectors and validation helpers under `src/domain/` | Keeps business rules testable without DOM/Solid runtime. [VERIFIED: src/domain/foundation.test.ts] [CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/architecture.md] |
| Browser network proof | Playwright network-denial suite | Source guard plus static HTML verification | Browser denial tests are explicitly deferred; Phase 2 should stay deterministic and local. [VERIFIED: .planning/phases/02-curated-content-model/02-CONTEXT.md] |
| GitHub token handling | Browser-exposed `VITE_GITHUB_TOKEN` or client token checks | No visitor-path token use in Phase 2 | GitHub enrichment and token-safe refresh are Phase 5 work. [VERIFIED: .planning/ROADMAP.md] |

**Key insight:** The hard problem is not fetching GitHub data; it is preserving editorial authority, preventing invalid flagship states, and proving the static app does not depend on GitHub at visitor runtime. [VERIFIED: .planning/REQUIREMENTS.md] [VERIFIED: .planning/phases/02-curated-content-model/02-CONTEXT.md]

## Runtime State Inventory

This phase refactors the current seed project model and corrects stale source strings, so runtime state was audited explicitly. [VERIFIED: src/domain/projects.ts] [VERIFIED: repo searches on 2026-05-25]

| Category | Items Found | Action Required |
|----------|-------------|-----------------|
| Stored data | None. No `.env`, SQLite, DB, Redis, or datastore files were found in the repo scan, and the portfolio currently uses checked-in TypeScript data. [VERIFIED: `find`/`rg` audit, 2026-05-25] | No data migration. Code edit only. |
| Live service config | None in repo. No `wrangler.toml`, `netlify.toml`, or `vercel.json` files were found; Phase 2 does not require external dashboard configuration. [VERIFIED: `find` audit, 2026-05-25] [VERIFIED: .planning/ROADMAP.md] | None for Phase 2. |
| OS-registered state | None found. Repo scan found no `pm2`, `launchd`, `systemd`, plist, cron, or Task Scheduler registration references outside dependencies. [VERIFIED: `rg` audit, 2026-05-25] | None. |
| Secrets/env vars | None found. Repo scan found no GitHub token env var names, SOPS keys, or database/secret env vars outside dependencies. [VERIFIED: `rg` audit, 2026-05-25] | Add guard against future browser-exposed GitHub token names in `src/`. |
| Build artifacts | `.output`, `.vinxi`, `node_modules`, and `bun.lock` exist; source-string changes will require rerunning `bun run build` before `verify-static`. [VERIFIED: `find` audit, 2026-05-25] [VERIFIED: package.json] | Regenerate static output through `bun run verify`; do not manually edit artifacts. |

**Nothing found in category:** Stored data, live service config, OS-registered state, and secrets/env vars are all explicitly empty for Phase 2 based on the local audits above. [VERIFIED: `find`/`rg` audits, 2026-05-25]

## Common Pitfalls

### Pitfall 1: TypeScript Shape Checks Do Not Prove Editorial Quality

**What goes wrong:** A record can type-check while `oneLine` or `curationReason` is an empty or generic string. [VERIFIED: TypeScript registry approach in src/domain/projects.ts]

**Why it happens:** TypeScript can require a `string` field but cannot know whether the copy is meaningful without domain validation. [CITED: https://www.typescriptlang.org/docs/handbook/2/narrowing.html]

**How to avoid:** Use required fields for flagship records and pure validators that trim strings, enforce non-empty useful links, and return hard errors for missing flagship copy. [VERIFIED: .planning/phases/02-curated-content-model/02-CONTEXT.md]

**Warning signs:** Tests only assert array length or ordering and do not assert validation issue codes. [VERIFIED: src/domain/foundation.test.ts]

### Pitfall 2: Confusing Source Type With Placement

**What goes wrong:** A fork, support repo, prototype, or generated repo becomes home-visible because it has a good summary or `featured: true`. [VERIFIED: src/domain/projects.ts]

**Why it happens:** Current `ProjectRecord` has `tier`, `featured`, and `displayOrder`, but no source review state, original-work status, maturity, status, or promotion reason. [VERIFIED: src/domain/projects.ts]

**How to avoid:** Model `sourceType`, `originalWork`, `maturity`, `status`, and `placement` separately, then validate blocked source types before selectors return home projects. [VERIFIED: .planning/REQUIREMENTS.md]

**Warning signs:** Selector logic says only `project.featured && project.tier === "featured"`. [VERIFIED: src/domain/projects.ts]

### Pitfall 3: Treating Repo Names As Project Names

**What goes wrong:** The model invents or links to repo names that do not exist, such as current `pRizz/openlinks`, current `pRizz/win3bitcoin`, or a hypothetical `pRizz/open-bitcoin`. [VERIFIED: src/domain/projects.ts] [VERIFIED: GitHub CLI/API, 2026-05-25]

**Why it happens:** Portfolio stories and GitHub repositories have different naming lifecycles. [VERIFIED: .planning/phases/02-curated-content-model/02-CONTEXT.md]

**How to avoid:** Keep story `slug`, display `name`, `aliases`, and `links` separate; allow an Open Bitcoin story to exist only with verified links or as explicitly non-flagship until its source is confirmed. [VERIFIED: .planning/phases/02-curated-content-model/02-CONTEXT.md]

**Warning signs:** A source link is generated from `slug` instead of stored as an explicit reviewed link. [VERIFIED: current model uses direct `repo`/`href`, not aliases, in src/domain/projects.ts]

### Pitfall 4: Source Scan Allows Normal Links But Misses Built Client Code

**What goes wrong:** A guard blocks ordinary GitHub profile/repo links or only scans source while a dependency/client bundle introduces a runtime API call. [VERIFIED: .planning/phases/02-curated-content-model/02-CONTEXT.md]

**Why it happens:** `https://github.com/...` links are allowed, while `api.github.com`, GitHub GraphQL, Octokit, and browser token names are forbidden only in visitor paths. [VERIFIED: .planning/phases/02-curated-content-model/02-CONTEXT.md] [CITED: https://docs.github.com/en/graphql/guides/forming-calls-with-graphql]

**How to avoid:** Scan `src/` for forbidden mechanisms before build and, if practical, scan generated client JS after build with an allowlist that excludes the guard script's own pattern strings. [VERIFIED: package.json]

**Warning signs:** A verification script flags every `github.com` link or ignores `@octokit/*` imports. [VERIFIED: current source contains normal GitHub links in src/domain/profile.ts and src/domain/projects.ts]

### Pitfall 5: Static Verification Stays Too Generic

**What goes wrong:** `verify-static` passes because route shell text exists, but no curated project copy is present in generated HTML. [VERIFIED: scripts/verify-static.ts]

**Why it happens:** Current static checks use route-level `staticCheckText`, not curated project names or authored copy. [VERIFIED: scripts/verify-static.ts] [VERIFIED: src/domain/routes.ts]

**How to avoid:** Import curated selectors into `verify-static.ts` and assert that home/project HTML contains key project names and one-line copy before hydration. [CITED: https://docs.solidjs.com/solid-start/building-your-application/route-prerendering]

**Warning signs:** The static verification expected text can pass even if `homeProjects()` is empty. [VERIFIED: scripts/verify-static.ts]

## Code Examples

Verified patterns from official and local sources:

### Validation Test Table

```typescript
// Source: Vitest table tests and repo Arrange/Act/Assert style.
// https://vitest.dev/api/
// src/domain/foundation.test.ts
import { describe, expect, it } from "vitest";
import { validateProject } from "./project-validation";

describe("project curation validation", () => {
  it.each([
    ["missing authored copy", { oneLine: " " }, "flagship_missing_authored_copy"],
    ["missing curation reason", { curationReason: " " }, "flagship_missing_curation_reason"],
  ])("rejects a home project with %s", (_label, override, expectedCode) => {
    // Arrange
    const project = makeHomeProject(override);

    // Act
    const issues = validateProject(project);

    // Assert
    expect(issues).toContainEqual(expect.objectContaining({ code: expectedCode }));
  });
});
```

### Curation Verification Script Shape

```typescript
// Source: existing Bun script pattern in package.json and pure validation decision in CONTEXT.md.
import { curatedProjects } from "../src/domain/projects";
import { validateProjectRegistry } from "../src/domain/project-validation";

const result = validateProjectRegistry(curatedProjects);

for (const warning of result.warnings) {
  console.warn(`[curation warning] ${warning.slug}: ${warning.message}`);
}

if (result.errors.length > 0) {
  for (const error of result.errors) {
    console.error(`[curation error] ${error.slug}: ${error.message}`);
  }

  process.exit(1);
}
```

### Static HTML Curated Content Check

```typescript
// Source: existing scripts/verify-static.ts route assertion style and SolidStart SSG docs.
// https://docs.solidjs.com/solid-start/building-your-application/route-prerendering
import { homeProjects } from "../src/domain/projects";

const expectedHomeTexts = homeProjects().flatMap((project) => [project.name, project.oneLine]);

for (const expectedText of expectedHomeTexts) {
  if (!homeHtml.includes(expectedText)) {
    throw new Error(`Home HTML is missing curated project text: ${expectedText}`);
  }
}
```

## Initial Curated Set Facts

| Project Story | Verified Source Facts | Planning Guidance |
|---------------|-----------------------|-------------------|
| OpenLinks | `pRizz/open-links` exists, is not a fork, is not archived, has homepage `https://openlinks.us/`; `pRizz/openlinks` returned 404. [VERIFIED: GitHub CLI/API, 2026-05-25] | Keep display story as "OpenLinks"; use `open-links` as source alias/repo link; current seed link must be corrected. [VERIFIED: src/domain/projects.ts] |
| Free The World | `pRizz/free-the-world` exists, is not a fork, is not archived, and has homepage `https://freetheworld.ai/`. [VERIFIED: GitHub CLI/API, 2026-05-25] | Good candidate for flagship if authored copy, maturity/status, and curation reason are supplied. [ASSUMED] |
| Win3Bitco.in / Open Bitcoin Web Miner | `pRizz/open-bitcoin-web-miner` exists, is not a fork, is not archived, has homepage `https://win3bitco.in/`, and has GitHub topics `bitcoin`, `gpu-mining`, `mining`; `pRizz/win3bitcoin` returned 404. [VERIFIED: GitHub CLI/API, 2026-05-25] | Use the repo name as a source alias and the public site/project name in display copy. [VERIFIED: .planning/phases/02-curated-content-model/02-CONTEXT.md] |
| Open Bitcoin | `pRizz/open-bitcoin` returned 404, and GitHub search for `open bitcoin user:pRizz` found only `pRizz/open-bitcoin-web-miner`. [VERIFIED: GitHub CLI/API, 2026-05-25] | Represent as an explicit project story only with verified non-repo links or keep non-flagship until source/identity is clarified. [VERIFIED: .planning/phases/02-curated-content-model/02-CONTEXT.md] |
| opencode-cloud | `pRizz/opencode-cloud` exists, is not a fork, is not archived, and describes cloud opencode/web UI container scripts. [VERIFIED: GitHub CLI/API, 2026-05-25] | Include as curated work with source type `original` and developer-tooling tags if authored copy is supplied. [ASSUMED] |
| Zeckendorf | `pRizz/zeckendorf` exists, is not a fork, is not archived. [VERIFIED: GitHub CLI/API, 2026-05-25] | Include in reviewed set; choose flagship/supporting/lab based on authored narrative and maturity. [ASSUMED] |
| Mystic UI | `pRizz/mystic-ui` exists, is a fork, is not archived, and has homepage `https://prizz.github.io/mystic-ui/`. [VERIFIED: GitHub CLI/API, 2026-05-25] | May be flagship only with explicit fork promotion reason; otherwise supporting/strategic infrastructure is safer. [VERIFIED: .planning/phases/02-curated-content-model/02-CONTEXT.md] |
| Selected supporting experiments | GitHub search found related candidates such as `pRizz/open-links-sites`, `pRizz/bitcoin-bond-proposal`, and `pRizz/btc-vanity-address-finder`. [VERIFIED: GitHub CLI search, 2026-05-25] | Include only if manually reviewed with curation reasons; do not import a broad repo list. [VERIFIED: .planning/REQUIREMENTS.md] |

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Boolean `featured` seed records | Discriminated project-story registry with placement, source review, maturity/status, links, and validation | Phase 2 planning decision, 2026-05-25 [VERIFIED: .planning/phases/02-curated-content-model/02-CONTEXT.md] | Prevents vague repo stubs from becoming flagship by accident. [VERIFIED: .planning/REQUIREMENTS.md] |
| Runtime GitHub-driven portfolio content | Static checked-in registry; optional GitHub snapshots deferred to Phase 5 | Roadmap created 2026-05-24 and Phase 2 context 2026-05-25 [VERIFIED: .planning/ROADMAP.md] [VERIFIED: .planning/phases/02-curated-content-model/02-CONTEXT.md] | Visitor-critical content stays complete without GitHub availability or browser tokens. [VERIFIED: .planning/REQUIREMENTS.md] |
| String-only repo identity | Separate story slug/name, aliases, and explicit source links | Phase 2 alias decision, 2026-05-25 [VERIFIED: .planning/phases/02-curated-content-model/02-CONTEXT.md] | Fixes current `openlinks`/`win3bitcoin` 404 source links and supports non-repo project stories. [VERIFIED: src/domain/projects.ts] [VERIFIED: GitHub CLI/API, 2026-05-25] |
| Static route text proof only | Static route plus curated content proof | Phase 2 D-17 [VERIFIED: .planning/phases/02-curated-content-model/02-CONTEXT.md] | `verify-static` can prove key content appears before hydration, not just shell text. [VERIFIED: scripts/verify-static.ts] |

**Deprecated/outdated:**

- `pRizz/openlinks` as a source repo is outdated for this project; use `pRizz/open-links`. [VERIFIED: src/domain/projects.ts] [VERIFIED: GitHub CLI/API, 2026-05-25]
- `pRizz/win3bitcoin` as a source repo is outdated for this project; use `pRizz/open-bitcoin-web-miner`. [VERIFIED: src/domain/projects.ts] [VERIFIED: GitHub CLI/API, 2026-05-25]
- `featured: boolean` plus `tier: "featured"` is too weak for Phase 2 flagship rules. [VERIFIED: src/domain/projects.ts] [VERIFIED: .planning/REQUIREMENTS.md]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Free The World, opencode-cloud, and Zeckendorf are good candidates for visible curated placement if authored copy and maturity/status fields are supplied. | Initial Curated Set Facts | Planner may over-promote a project before editorial review. |
| A2 | The suggested supporting experiments beyond the named set are editorially suitable after review. | Initial Curated Set Facts | Planner may include a repo that the user would rather hide. |

## Open Questions (RESOLVED)

1. **What is the authoritative source for the Open Bitcoin project story?** [VERIFIED: GitHub CLI/API, 2026-05-25]
   - What we know: `pRizz/open-bitcoin` was not found, and `open-bitcoin-web-miner` is the verified repo behind Win3Bitco.in / Open Bitcoin Web Miner. [VERIFIED: GitHub CLI/API, 2026-05-25]
   - What's unclear: Whether "Open Bitcoin" should be a separate story, an alias of the web miner, or a non-flagship concept record. [VERIFIED: .planning/phases/02-curated-content-model/02-CONTEXT.md]
   - Recommendation: Include an explicit Open Bitcoin record only if it has verified links or mark it non-home until the user clarifies. [ASSUMED]
   - RESOLVED: Plan 02-01 records Open Bitcoin as a supporting non-home concept story linked to `pRizz/open-bitcoin-web-miner` and `https://win3bitco.in/`; it does not invent a standalone `pRizz/open-bitcoin` repository. [VERIFIED: .planning/phases/02-curated-content-model/02-01-PLAN.md]

2. **Should project slugs preserve current public-ish names or normalize to repo names?** [VERIFIED: src/domain/projects.ts]
   - What we know: Current tests expect `openlinks`, but the source repo is `open-links`. [VERIFIED: src/domain/foundation.test.ts] [VERIFIED: GitHub CLI/API, 2026-05-25]
   - What's unclear: Whether future project routes will prefer story slugs like `openlinks` or source-like slugs like `open-links`. [VERIFIED: .planning/ROADMAP.md]
   - Recommendation: Keep story slugs stable and human-facing; put repo names in `aliases`/`links`. [ASSUMED]
   - RESOLVED: Plan 02-01 keeps human-facing story slugs such as `openlinks` and `win3bitcoin`, while repo names live in aliases and source links. [VERIFIED: .planning/phases/02-curated-content-model/02-01-PLAN.md]

3. **Which 4-6 records should be home/flagship in the initial set?** [VERIFIED: .planning/phases/02-curated-content-model/02-CONTEXT.md]
   - What we know: The registry should support enough reviewed records for later pages to select 4-6 flagship presentations. [VERIFIED: .planning/phases/02-curated-content-model/02-CONTEXT.md]
   - What's unclear: Final editorial ranking and one-line copy. [ASSUMED]
   - Recommendation: Plan for validation and candidate records first; keep any uncertain records as supporting/lab with warnings until copy and curation reasons are explicit. [VERIFIED: .planning/REQUIREMENTS.md]
   - RESOLVED: Plan 02-01 selects six home/flagship records for the initial pass: OpenLinks, Free The World, Win3Bitco.in / Open Bitcoin Web Miner, opencode-cloud, Zeckendorf, and Mystic UI. Supporting/lab records remain visible in the project index but out of home placement. [VERIFIED: .planning/phases/02-curated-content-model/02-01-PLAN.md]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Bun | `bun run verify`, test/build/scripts | yes | local 1.3.9; packageManager pin 1.3.14 [VERIFIED: local `bun --version`] [VERIFIED: package.json] | Upgrade local Bun if version mismatch causes script/build failure. |
| Node.js | npm registry checks and some ecosystem CLIs | yes | v24.13.0 [VERIFIED: local `node --version`] | Bun remains repo runner; Node is support tooling. |
| npm | Package version verification | yes | 11.6.2 [VERIFIED: local `npm --version`] | Use `bun pm`/lockfile state if npm registry is unavailable. |
| Git | Commit and repo status | yes | 2.53.0 [VERIFIED: local `git --version`] | None needed. |
| GitHub CLI | Developer-side repo fact checks | yes | 2.87.3 [VERIFIED: local `gh --version`] | Use public GitHub REST URLs or manual source links; implementation must not require `gh`. |
| ripgrep | Source audit and diagnosis | yes | 15.1.0 [VERIFIED: local `rg --version`] | Repo-owned TS scanner can replace shell grep for verification. |

**Missing dependencies with no fallback:**

- None found for Phase 2 research or planned local implementation. [VERIFIED: environment probes, 2026-05-25]

**Missing dependencies with fallback:**

- Local Bun is older than the packageManager pin; fallback is to upgrade Bun or rely on CI/tooling pinned to `bun@1.3.14` if a local-only failure appears. [VERIFIED: package.json] [VERIFIED: local `bun --version`]

## Security Domain

Security enforcement is enabled by default because `.planning/config.json` does not set `security_enforcement: false`. [VERIFIED: .planning/config.json]

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|------------------|
| V2 Authentication | no | No authentication is in Phase 2 scope. [VERIFIED: .planning/ROADMAP.md] |
| V3 Session Management | no | No sessions are in Phase 2 scope. [VERIFIED: .planning/ROADMAP.md] |
| V4 Access Control | no | Static public portfolio content has no privileged user paths in Phase 2. [VERIFIED: .planning/ROADMAP.md] |
| V5 Input Validation | yes | Validate checked-in curation data with pure TypeScript validation before build/static verification. [VERIFIED: .planning/REQUIREMENTS.md] |
| V6 Cryptography | no | No cryptography implementation is in Phase 2 scope; GitHub tokens must not exist in visitor-path `src/` code. [VERIFIED: .planning/phases/02-curated-content-model/02-CONTEXT.md] |

The OWASP ASVS project defines security verification requirements for web application controls; this phase maps only the categories relevant to a static content registry. [CITED: https://owasp.org/www-project-application-security-verification-standard/]

### Known Threat Patterns for Static TypeScript Content

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Browser-exposed GitHub token name such as `VITE_GITHUB_TOKEN` | Information Disclosure | Source guard fails `src/` if browser-visible GitHub token names appear. [VERIFIED: .planning/phases/02-curated-content-model/02-CONTEXT.md] |
| Runtime dependency on `api.github.com` or GitHub GraphQL | Denial of Service | Render visitor-critical content from checked-in data and block GitHub API endpoints in visitor source. [VERIFIED: .planning/REQUIREMENTS.md] [CITED: https://docs.github.com/en/graphql/guides/forming-calls-with-graphql] |
| Invalid or misleading flagship curation | Spoofing / Integrity | Structured validation blocks unreviewed or unsupported source types from home placement unless documented. [VERIFIED: .planning/REQUIREMENTS.md] |
| Unsafe future content rendering | Tampering | Keep Phase 2 content as typed fields rendered through current JSX text nodes; do not introduce raw HTML rendering. [VERIFIED: src/routes/index.tsx] [VERIFIED: src/routes/projects.tsx] |

## Sources

### Primary (HIGH confidence)

- `.planning/phases/02-curated-content-model/02-CONTEXT.md` - locked decisions, deferred scope, source alias constraints, no-runtime-GitHub boundary. [VERIFIED]
- `.planning/REQUIREMENTS.md` - Phase 2 requirement IDs and descriptions. [VERIFIED]
- `.planning/ROADMAP.md` - Phase 2 success criteria and later-phase boundaries. [VERIFIED]
- `.planning/STATE.md` - current project state and prior decisions. [VERIFIED]
- `AGENTS.md`, `AGENTS.bright-builds.md`, `standards-overrides.md` - repo-local guidance, Bright Builds rules, OpenLinks owner guidance. [VERIFIED]
- `src/domain/projects.ts`, `src/domain/profile.ts`, `src/domain/foundation.test.ts`, `scripts/verify-static.ts` - existing seed model, profile identity model, pure-domain tests, static verification pattern. [VERIFIED]
- Bright Builds standards at pinned commit `05f8d7a6c9c2e157ec4f922a05273e72dab97676` - architecture, code shape, verification, testing, TypeScript/JavaScript guidance. [CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/index.md]
- TypeScript docs - narrowing/discriminated unions and `satisfies`. [CITED: https://www.typescriptlang.org/docs/handbook/2/narrowing.html] [CITED: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html]
- SolidStart docs - route prerendering, config, metadata. [CITED: https://docs.solidjs.com/solid-start/building-your-application/route-prerendering] [CITED: https://docs.solidjs.com/solid-start/reference/config/define-config] [CITED: https://docs.solidjs.com/solid-start/building-your-application/head-and-metadata]
- Vitest docs - table-driven tests. [CITED: https://vitest.dev/api/]
- GitHub docs - REST repository endpoint and GraphQL endpoint. [CITED: https://docs.github.com/en/rest/repos/repos#get-a-repository] [CITED: https://docs.github.com/en/graphql/guides/forming-calls-with-graphql]
- npm registry - current package versions and publish modified timestamps. [VERIFIED: npm registry, 2026-05-25]
- GitHub CLI/API - selected `pRizz/*` repository existence, fork/archive/homepage fields, and search results. [VERIFIED: GitHub CLI/API, 2026-05-25]

### Secondary (MEDIUM confidence)

- OpenLinks identity presence global skill - low-intrusion website/profile/footer placement guidance. [VERIFIED: /Users/peterryszkiewicz/.codex/skills/openlinks-identity-presence/SKILL.md]

### Tertiary (LOW confidence)

- None. Recommendations tagged `[ASSUMED]` are listed in the Assumptions Log. [VERIFIED: this document]

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - existing package scripts and npm registry versions were verified; no new dependency is recommended. [VERIFIED: package.json] [VERIFIED: npm registry]
- Architecture: HIGH - matches locked Phase 2 decisions, current pure-domain module pattern, and pinned Bright Builds functional-core standards. [VERIFIED: .planning/phases/02-curated-content-model/02-CONTEXT.md] [CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/architecture.md]
- Pitfalls: HIGH - each pitfall is grounded in current source, locked decisions, official docs, or verified GitHub repo facts. [VERIFIED: src/domain/projects.ts] [VERIFIED: GitHub CLI/API, 2026-05-25]
- Initial curated set: MEDIUM-HIGH - repository existence and fork/archive facts are verified, but editorial placement and final authored copy remain user/editorial decisions. [VERIFIED: GitHub CLI/API, 2026-05-25] [ASSUMED]

**Research date:** 2026-05-25
**Valid until:** 2026-06-24 for TypeScript/local architecture guidance; re-check GitHub repo facts and npm versions within 7 days before implementation if the plan depends on current repository metadata. [ASSUMED]
