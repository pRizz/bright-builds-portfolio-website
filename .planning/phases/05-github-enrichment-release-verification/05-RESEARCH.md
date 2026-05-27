# Phase 05: GitHub Enrichment & Release Verification - Research

**Researched:** 2026-05-27 [VERIFIED: current session date]  
**Domain:** Static GitHub metadata snapshots, SolidStart static output verification, token-safe Bun/TypeScript release checks [VERIFIED: 05-CONTEXT.md]  
**Confidence:** HIGH [VERIFIED: GitHub docs, Bun docs, Vite docs, npm registry, codebase inspection]

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

[VERIFIED: .planning/phases/05-github-enrichment-release-verification/05-CONTEXT.md]

## Implementation Decisions

### Static GitHub Metadata Contract

- **D-01:** GitHub metadata is advisory enrichment attached to curated records, not a source of truth. Authored copy, curation tier, ordering, inclusion, and flagship placement remain controlled by `src/domain/projects.ts`.
- **D-02:** Use a checked-in static snapshot as the runtime data source. The optional refresh path may fetch GitHub metadata at manual/build-prep time, but the built visitor experience must work from checked-in data when GitHub is unavailable.
- **D-03:** Prefer native Bun/TypeScript `fetch` for the sync script instead of adding Octokit or another dependency unless implementation proves the native API path is insufficient.
- **D-04:** Snapshot data should include only public repository metadata needed by the UI: stars, forks, primary language, topics, pushed date, archived/fork/template flags, homepage URL, repository URL, and sync timestamp/status.
- **D-05:** Missing, private, moved, or rate-limited repositories should not break the site. The snapshot should represent unavailable metadata explicitly enough for scripts to report it, while route rendering simply omits unavailable enrichment.

### Enrichment Presentation

- **D-06:** Show GitHub metadata only as secondary project-card context where it improves scanning. Do not let stars, forks, topics, or pushed dates displace problem/approach/why-it-matters copy.
- **D-07:** Keep metadata labels compact and dark-primary. They should inherit the existing chip/surface/link visual language and must not introduce a light-first exception.
- **D-08:** Homepage URLs from GitHub metadata can enrich a project only when they are present and non-empty; they must not replace curated `live`, `docs`, or `repo` links.
- **D-09:** Topic/language data may be displayed or used in verification, but curated themes and tags remain the meaningful portfolio taxonomy.

### Token and Runtime Safety

- **D-10:** Sync scripts may read server/local environment variables, but no visitor-bundled `src/` code may read token variables or import GitHub API clients.
- **D-11:** Public token names such as `VITE_*GITHUB*TOKEN`, `PUBLIC_*GITHUB*TOKEN`, and `SOLID_PUBLIC_*GITHUB*TOKEN` are forbidden in source paths that can influence the frontend bundle and in generated production output.
- **D-12:** Release verification should scan built HTML, JS, CSS, and static assets for forbidden GitHub API endpoints, GitHub client libraries, token names, and token-like output.
- **D-13:** Planning and docs may explain which non-public environment variable the sync script accepts, but must not include token values or encourage browser-exposed token prefixes.

### Release Verification Surface

- **D-14:** Add a repo-owned release verification entrypoint that composes existing checks rather than hand-maintaining an untracked release checklist.
- **D-15:** Release checks should cover pure unit behavior, curation validity, no runtime GitHub API dependency, static output metadata, token safety, reduced-motion/static visual invariants, primary internal links/anchors, static asset locality, basic accessibility semantics, and practical performance/SEO budgets.
- **D-16:** Keep routine verification dependency-light. Prefer Bun scripts and static-output checks already aligned with `bun run verify`; browser evidence may use local browser automation in verification notes when needed, but do not add Playwright, axe, or Lighthouse dependencies unless the plan proves they are necessary and maintainable.
- **D-17:** Browser and accessibility claims should be evidence-based. At minimum, Phase 5 verification must run the production build and release verifier, and it should record any manual/browser evidence that cannot be encoded safely in a routine script.

### Documentation and Release Readiness

- **D-18:** Update project docs with local setup, build/release commands, deployment assumptions, curation maintenance rules, and the optional GitHub metadata refresh flow.
- **D-19:** Documentation should preserve the existing static/no-runtime-GitHub boundary and explain that enrichment is optional.
- **D-20:** Fix any small planning-drift found while completing Phase 5 when it is directly related to release readiness, such as the Phase 4 `2/3` vs `3/3` roadmap mismatch.

### the agent's Discretion

- The agent may choose exact file names and helper boundaries for the snapshot/parser/sync implementation, provided pure domain behavior stays under `src/domain/` and side-effecting fetch/write behavior stays in `scripts/`.
- The agent may choose the exact project-card metadata layout as long as it stays secondary, dark-primary, responsive, and static before hydration.
- The agent may choose practical release budgets and accessibility heuristics based on the current static output, then document residual risks where a heavier external suite would be needed later.

### Deferred Ideas (OUT OF SCOPE)

[VERIFIED: .planning/phases/05-github-enrichment-release-verification/05-CONTEXT.md]

- Scheduled GitHub metadata refresh in CI remains v2 scope unless Phase 5 implementation finds a low-risk docs-only mention. Manual/local refresh is enough for v1.
- Per-project Open Graph image generation remains v2 scope.
- Heavy Playwright/axe/Lighthouse dependency adoption is deferred unless implementation proves the current static/release verifier cannot meet v1 release-readiness evidence.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| GH-02 | Developer can optionally refresh GitHub metadata for curated repos at build/manual-sync time, with pagination, token-safe environment handling, and static snapshot fallback. [VERIFIED: .planning/REQUIREMENTS.md] | Use `scripts/sync-github-metadata.ts` with Bun native `fetch`, a checked-in JSON snapshot, optional non-public token env, repository fetches, and paginated topics fetches. [CITED: https://bun.com/docs/runtime/networking/fetch] [CITED: https://docs.github.com/en/rest/repos/repos?apiVersion=2026-03-10] |
| GH-03 | GitHub metadata such as stars, forks, language, topics, pushed date, archived/fork/template flags, and homepage URLs enriches curated records without overriding manual copy or curation decisions. [VERIFIED: .planning/REQUIREMENTS.md] | Keep manual authority in `ProjectStory`; add pure helpers that return optional `available` enrichment and never mutate authored fields. [VERIFIED: src/domain/projects.ts] |
| GH-04 | Build/release verification checks that frontend bundles do not expose GitHub tokens or `VITE_*` token names. [VERIFIED: .planning/REQUIREMENTS.md] | Extend source and built-output scanners for API endpoints, GitHub clients, public token env names, the sync token env name, and token-like values. [CITED: https://vite.dev/guide/env-and-mode] |
| VER-01 | Unit tests cover pure curation, route derivation, metadata derivation, project ordering, and invalid-state prevention. [VERIFIED: .planning/REQUIREMENTS.md] | Existing Vitest tests cover curation, routes, SEO, and motion gates; add focused tests for metadata parsing, enrichment omission, and curated-authority boundaries. [VERIFIED: src/domain/project-validation.test.ts] [VERIFIED: src/domain/portfolio-surfaces.test.ts] |
| VER-02 | Browser checks cover home, project index/detail or anchors, about/contact/footer, mobile and desktop viewports, keyboard navigation, and reduced-motion behavior. [VERIFIED: .planning/REQUIREMENTS.md] | Phase 04 already recorded local Chrome CDP evidence; Phase 05 should rerun/record equivalent release evidence after enrichment. [VERIFIED: .planning/phases/04-visual-system-motion/04-03-SUMMARY.md] |
| VER-03 | Accessibility checks catch obvious issues in semantic structure, color contrast, focus states, links, images, and interactive motion surfaces. [VERIFIED: .planning/REQUIREMENTS.md] | Add static semantic/focus/link/image heuristics to `verify:release` and record browser evidence for visual contrast/focus where static checks are insufficient. [VERIFIED: scripts/verify-static.ts] [ASSUMED: dependency-light accessibility heuristic design] |
| VER-04 | Performance/SEO release checks verify static output, no critical runtime GitHub dependency, acceptable Lighthouse-style scores, no layout instability, and no broken primary links. [VERIFIED: .planning/REQUIREMENTS.md] | Use existing static metadata checks plus release budgets over generated HTML/CSS/JS/assets and internal-link/anchor checks; keep Lighthouse-style budgets as static proxies because heavy Lighthouse dependency is deferred. [VERIFIED: scripts/verify-static.ts] [ASSUMED: static budget thresholds] |
| VER-05 | Project docs record local setup, build/deploy assumptions, curation maintenance rules, and how to refresh GitHub metadata if the optional sync exists. [VERIFIED: .planning/REQUIREMENTS.md] | Update `README.md` and `CONTRIBUTING.md` outside managed blocks with setup, `bun run verify`, `bun run sync:github-metadata`, token guidance, static deployment assumptions, and curated-authority rules. [VERIFIED: README.md] [VERIFIED: CONTRIBUTING.md] |
</phase_requirements>

## Summary

Phase 5 should preserve the existing curated-content architecture: the typed registry in `src/domain/projects.ts` remains authoritative for story, placement, ordering, and links, while GitHub data is optional static enrichment. [VERIFIED: 05-CONTEXT.md] [VERIFIED: src/domain/projects.ts] The implementation should add a checked-in snapshot and pure parser/enrichment helpers under `src/domain/`, then keep all network and filesystem behavior in Bun scripts under `scripts/`. [VERIFIED: AGENTS.bright-builds.md] [CITED: https://bun.com/docs/runtime/networking/fetch]

The best API path is GitHub REST with native Bun `fetch`, not Octokit. [VERIFIED: 05-CONTEXT.md] [CITED: https://bun.com/docs/runtime/networking/fetch] The repository endpoint provides the project-level fields Phase 5 needs, and the topics endpoint documents `page` and `per_page` pagination, so a small repo-owned pagination helper is enough. [CITED: https://docs.github.com/en/rest/repos/repos?apiVersion=2026-03-10] [CITED: https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api] Unauthenticated GitHub REST requests are allowed for public data but limited to 60/hour, while authenticated token requests get a 5,000/hour personal rate limit. [CITED: https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api]

Release verification should remain dependency-light and build on `bun run verify`. [VERIFIED: package.json] It should add `verify:release` after `verify:static`, scanning `.output/public` for GitHub API/runtime/client/token leaks, checking internal links and anchors, enforcing project-defined static budgets, and recording browser evidence for claims that a static script cannot honestly prove. [VERIFIED: scripts/verify-static.ts] [VERIFIED: 05-CONTEXT.md] Vite explicitly exposes `VITE_*` values to client-side code and warns not to put sensitive information there, so public token prefix scanning is a hard requirement. [CITED: https://vite.dev/guide/env-and-mode]

**Primary recommendation:** Implement a checked-in `src/domain/github-metadata.snapshot.json`, pure `src/domain/github-metadata.ts` helpers, a side-effecting `scripts/sync-github-metadata.ts`, and a dependency-free `scripts/verify-release.ts` wired into `bun run verify` after the production build. [VERIFIED: codebase structure] [VERIFIED: 05-CONTEXT.md]

## Project Constraints (from AGENTS.md)

- Prefer `AGENTS.md` as repo-local instructions, then `AGENTS.bright-builds.md`, then `standards-overrides.md`, then canonical standards. [VERIFIED: AGENTS.md] [VERIFIED: AGENTS.bright-builds.md]
- The portfolio is dark-primary, `.dark` is active by default, and light-first classes such as `bg-white`, `bg-stone-50`, and `text-zinc-950` need a clear local reason. [VERIFIED: AGENTS.md]
- UI verification must include desktop and mobile dark rendering, contrast/readability, and text-overlap checks. [VERIFIED: AGENTS.md]
- Use GSD artifacts and do not directly edit implementation files outside the GSD workflow unless explicitly bypassed; this research writes only the research artifact. [VERIFIED: AGENTS.md]
- Business logic should follow functional-core/imperative-shell: pure data-in/data-out logic in domain modules, I/O in thin scripts/adapters. [VERIFIED: standards/core/architecture.md]
- Parse boundary input into domain types and make illegal states unrepresentable when practical. [VERIFIED: standards/core/architecture.md]
- Prefix internal nullable/optional values with `maybe`. [VERIFIED: standards/core/code-shape.md] [VERIFIED: standards/languages/typescript-javascript.md]
- Do not add Python scripts to this Bun-friendly TypeScript repository. [VERIFIED: standards/languages/typescript-javascript.md]
- Unit-test pure/business logic and use Arrange/Act/Assert sections unless trivially obvious. [VERIFIED: standards/core/testing.md]
- Prefer repo-owned verification entrypoints and run relevant verification before committing. [VERIFIED: standards/core/verification.md]
- Owner-specific OpenLinks guidance applies to docs, website chrome, profile/about/footer, and metadata surfaces; OpenLinks should remain low-intrusion and not replace the host brand. [VERIFIED: AGENTS.bright-builds.md] [VERIFIED: openlinks-identity-presence skill]
- No project-local `.claude/skills/` or `.agents/skills/` skills were found. [VERIFIED: `find .claude/skills .agents/skills -maxdepth 2 -type f -name SKILL.md`]

## Standard Stack

### Core

| Library / Surface | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Bun | `packageManager: bun@1.3.14`; local probe found `1.3.9` | Run TypeScript scripts, tests, and package scripts. [VERIFIED: package.json] [VERIFIED: environment probe] | Repo already uses Bun scripts and Bun native `fetch`; avoid adding a second automation runtime. [VERIFIED: package.json] [CITED: https://bun.com/docs/runtime/networking/fetch] |
| Native `fetch` | Bun runtime API | Fetch GitHub REST endpoints from `scripts/sync-github-metadata.ts`. [CITED: https://bun.com/docs/runtime/networking/fetch] | Bun documents WHATWG `fetch` and generally recommends it over `node:http`. [CITED: https://bun.com/docs/runtime/networking/fetch] |
| GitHub REST API | Header examples use `X-GitHub-Api-Version: 2026-03-10` | Public repository metadata and paginated repository topics. [CITED: https://docs.github.com/en/rest/repos/repos?apiVersion=2026-03-10] | REST maps directly to the required snapshot fields and avoids Octokit. [VERIFIED: 05-CONTEXT.md] [CITED: https://docs.github.com/en/rest/repos/repos?apiVersion=2026-03-10] |
| TypeScript | `6.0.3` | Snapshot types, parsers, verifiers, and tests. [VERIFIED: package.json] [VERIFIED: npm registry] | Existing repo is strict TypeScript with `resolveJsonModule` enabled. [VERIFIED: tsconfig.json] |
| Vitest | `4.1.7` | Unit tests for pure metadata parsing/enrichment and release helper functions. [VERIFIED: package.json] [VERIFIED: npm registry] | Existing tests use Vitest for pure domain behavior. [VERIFIED: src/domain/project-validation.test.ts] [VERIFIED: src/domain/portfolio-surfaces.test.ts] |
| Biome | `2.4.15` | Formatting/lint checks for `src` and `scripts`. [VERIFIED: package.json] [VERIFIED: npm registry] | Existing `bun run verify` starts with Biome format/check commands. [VERIFIED: package.json] |
| SolidStart / SolidJS | `@solidjs/start@1.3.2`, `solid-js@1.9.13` | Render enriched project cards into prerendered static routes. [VERIFIED: package.json] [VERIFIED: npm registry] | Existing static preset prerenders `prerenderRoutes`. [VERIFIED: app.config.ts] |
| Tailwind CSS | `3.4.19` pinned; latest npm package is `4.3.0` | Dark-primary visual classes and compact metadata chips. [VERIFIED: package.json] [VERIFIED: npm registry] | Repo/Mystic contract already requires Tailwind 3.x rather than latest Tailwind 4.x. [VERIFIED: AGENTS.md] |

### Supporting

| Surface | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `scripts/verify-static.ts` | repo-owned | Existing generated HTML, metadata, JSON-LD, asset, reduced-motion, and no-runtime-GitHub checks. [VERIFIED: scripts/verify-static.ts] | Keep as the post-build static verifier; add release-only checks in a separate script to avoid overloading it. [VERIFIED: package.json] |
| `scripts/verify-no-github-runtime.ts` | repo-owned | Scans `src/` for GitHub API endpoints, Octokit imports, and public/browser token patterns. [VERIFIED: scripts/verify-no-github-runtime.ts] | Keep source-bundle boundary checks before build. [VERIFIED: package.json] |
| `scripts/verify-visual-system.ts` | repo-owned | Scans visual/motion/domain boundaries and forbidden visual dependencies. [VERIFIED: scripts/verify-visual-system.ts] | Keep before build in `bun run verify`; Phase 5 release verifier should not replace it. [VERIFIED: package.json] |
| Local Chrome app | installed | Manual/browser evidence for desktop, mobile, keyboard, and reduced-motion release claims. [VERIFIED: environment probe] | Use for recorded evidence when a dependency-free static script cannot prove the behavior. [VERIFIED: 04-03-SUMMARY.md] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Native Bun `fetch` | Octokit | Octokit has pagination helpers, but Phase 5 locked preference says not to add it unless native fetch is insufficient; official docs expose enough REST behavior for this scope. [VERIFIED: 05-CONTEXT.md] [CITED: https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api] |
| GitHub REST | GitHub GraphQL | GraphQL could batch lookups, but REST repository plus topics endpoints match the requested fields and keep the sync script simpler. [CITED: https://docs.github.com/en/rest/repos/repos?apiVersion=2026-03-10] |
| Static verification heuristics | Playwright, axe, Lighthouse CI | Heavy browser/accessibility/performance dependencies are explicitly deferred unless needed; Phase 04 already used local Chrome CDP evidence without adding packages. [VERIFIED: 05-CONTEXT.md] [VERIFIED: 04-03-SUMMARY.md] |
| Checked-in JSON snapshot | Runtime API calls from the browser | Browser API calls would violate GH-01/GH-04 and the no-runtime-GitHub boundary. [VERIFIED: .planning/REQUIREMENTS.md] [VERIFIED: scripts/verify-no-github-runtime.ts] |

**Installation:**

```bash
bun install
```

No new npm packages are recommended for Phase 5 planning. [VERIFIED: 05-CONTEXT.md] [VERIFIED: package.json]

**Version verification:**

| Package | Repo Pin | Registry Result | Publish / Modified Evidence |
|---------|----------|-----------------|-----------------------------|
| `@solidjs/start` | `1.3.2` | `1.3.2` | `npm view @solidjs/start version time.modified` returned `2026-02-24T21:13:42.737Z`. [VERIFIED: npm registry] |
| `solid-js` | `1.9.13` | `1.9.13` | `npm view solid-js version time.modified` returned `2026-05-19T17:38:41.300Z`. [VERIFIED: npm registry] |
| `@solidjs/router` | `0.16.1` | `0.16.1` | `npm view @solidjs/router version time.modified` returned `2026-04-26T06:23:54.512Z`. [VERIFIED: npm registry] |
| `vinxi` | `0.5.11` | `0.5.11` | `npm view vinxi version time.modified` returned `2026-01-19T20:25:28.406Z`. [VERIFIED: npm registry] |
| `vitest` | `4.1.7` | `4.1.7` | `npm view vitest version time.modified` returned `2026-05-20T07:19:42.501Z`. [VERIFIED: npm registry] |
| `@biomejs/biome` | `2.4.15` | `2.4.15` | `npm view @biomejs/biome version time.modified` returned `2026-05-09T17:08:11.291Z`. [VERIFIED: npm registry] |
| `typescript` | `6.0.3` | `6.0.3` | `npm view typescript version time.modified` returned `2026-04-16T23:38:28.092Z`. [VERIFIED: npm registry] |
| `vite` | `8.0.14` | `8.0.14` | `npm view vite version time.modified` returned `2026-05-21T07:16:03.512Z`. [VERIFIED: npm registry] |
| `tailwindcss` | `3.4.19` | Latest package is `4.3.0`; pinned 3.4.19 exists | `npm view tailwindcss@3.4.19 version 'time[3.4.19]'` returned `2025-12-10T18:40:42.410Z`. [VERIFIED: npm registry] |
| `mystic-ui` | `github:pRizz/mystic-ui#d360177...` | GitHub `main` still resolves to `d360177...` | `git ls-remote https://github.com/pRizz/mystic-ui refs/heads/main` returned the pinned SHA. [VERIFIED: GitHub ls-remote] |

## Architecture Patterns

### Recommended Project Structure

```text
src/domain/
|-- github-metadata.ts              # Pure snapshot types, parsers, target derivation, enrichment helpers. [VERIFIED: standards/core/architecture.md]
|-- github-metadata.snapshot.json   # Checked-in public metadata runtime source. [VERIFIED: 05-CONTEXT.md]
|-- github-metadata.test.ts         # Focused Vitest tests for parser/enrichment boundaries. [VERIFIED: package.json]
`-- projects.ts                     # Existing authoritative curated registry; do not move authority here. [VERIFIED: src/domain/projects.ts]

scripts/
|-- sync-github-metadata.ts         # Imperative shell: env, GitHub fetch, pagination, write snapshot, logs. [CITED: https://bun.com/docs/runtime/networking/fetch]
|-- verify-github-metadata.ts       # Optional pre-build snapshot/curation drift verifier if needed. [ASSUMED: helper split recommendation]
`-- verify-release.ts               # Post-build output/token/link/budget/a11y heuristic verifier. [VERIFIED: 05-CONTEXT.md]

logs/
`-- github-metadata/                # Gitignored summaries/details for sync runs. [VERIFIED: .gitignore]
```

### Pattern 1: Curated Authority, Advisory Enrichment

**What:** Derive GitHub lookup targets from curated project records but never let GitHub data decide inclusion, ordering, tiers, tags, themes, or authored copy. [VERIFIED: 05-CONTEXT.md] [VERIFIED: src/domain/projects.ts]

**When to use:** Use for every UI and verification path that combines `ProjectStory` with GitHub metadata. [VERIFIED: 05-CONTEXT.md]

**Example:**

```typescript
// Source: repo pattern from src/domain/projects.ts plus Phase 5 context.
export type GitHubRepoTarget = {
  projectSlug: string;
  owner: string;
  repo: string;
  href: string;
};

export function githubRepoTargetsForProjects(
  projects: readonly ProjectStory[],
): readonly GitHubRepoTarget[] {
  return projects.flatMap((project) => {
    const maybeRepoLink = project.links.find((link) => link.kind === "repo");

    if (!maybeRepoLink) {
      return [];
    }

    const maybeTarget = maybeGitHubRepoTarget(project.slug, maybeRepoLink.href);
    return maybeTarget ? [maybeTarget] : [];
  });
}
```

### Pattern 2: Discriminated Snapshot States

**What:** Store each repo entry as either `available` or `unavailable`, with explicit unavailable reasons for `missing`, `private`, `moved`, `rate-limited`, and `error`. [VERIFIED: 05-CONTEXT.md]

**When to use:** Use for render fallback, sync reports, and tests that prove unavailable GitHub metadata cannot break project cards. [VERIFIED: 05-CONTEXT.md]

**Example:**

```typescript
// Source: Bright Builds "make illegal states unrepresentable" standard.
export type GitHubRepoSnapshotEntry =
  | {
      status: "available";
      projectSlug: string;
      owner: string;
      repo: string;
      htmlUrl: string;
      stars: number;
      forks: number;
      primaryLanguage: string | null;
      topics: readonly string[];
      pushedAt: string | null;
      archived: boolean;
      fork: boolean;
      template: boolean;
      homepageUrl: string | null;
      syncedAt: string;
    }
  | {
      status: "unavailable";
      projectSlug: string;
      owner: string;
      repo: string;
      reason: "missing" | "private" | "moved" | "rate-limited" | "error";
      httpStatus?: number;
      message: string;
      syncedAt: string;
    };
```

### Pattern 3: Thin GitHub REST Shell

**What:** Keep request construction, optional auth header, status mapping, pagination, logging, and file writes in `scripts/sync-github-metadata.ts`. [VERIFIED: standards/core/architecture.md] [CITED: https://bun.com/docs/runtime/networking/fetch]

**When to use:** Use only in manual/build-prep sync commands, never route rendering. [VERIFIED: 05-CONTEXT.md]

**Example:**

```typescript
// Source: GitHub REST docs and Bun fetch docs.
const githubHeaders = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2026-03-10",
  ...(maybeToken ? { Authorization: `Bearer ${maybeToken}` } : {}),
};

const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
  headers: githubHeaders,
  redirect: "manual",
});
```

### Pattern 4: Release Verifier as Post-Build Proof

**What:** Add `scripts/verify-release.ts` to inspect `.output/public` after `bun run build` and after `verify:static`. [VERIFIED: package.json] [VERIFIED: scripts/verify-static.ts]

**When to use:** Run at the end of aggregate `bun run verify` so it can inspect built HTML, JS, CSS, SVG, XML, and text output. [VERIFIED: package.json]

**Checks to plan:**

- Scan generated text assets for `api.github.com`, `github.com/graphql`, `@octokit/`, public token env names, the chosen sync token env name, and token-like values. [VERIFIED: 05-CONTEXT.md] [CITED: https://vite.dev/guide/env-and-mode]
- Verify all root-relative internal links in generated HTML point to existing generated routes, static assets, or anchors. [VERIFIED: scripts/verify-static.ts]
- Verify generated routes keep one `h1`, a `<main id="content">`, a skip link to `#content`, visible route metadata, and no image without `alt` when `<img>` appears. [ASSUMED: dependency-light accessibility heuristic design]
- Enforce static budgets against current output, with project-defined thresholds documented in the script. [ASSUMED: project budget thresholds]
- Print a concise release summary and write detailed logs to a gitignored `logs/` path. [VERIFIED: standards/core/code-shape.md] [VERIFIED: .gitignore]

### Suggested Plan Boundaries

1. **Snapshot and domain helpers:** Add snapshot schema, parser, target derivation, enrichment helpers, unit tests, and initial checked-in snapshot. [VERIFIED: src/domain/projects.ts] [VERIFIED: standards/core/testing.md]
2. **Sync and UI enrichment:** Add Bun sync script with optional token, GitHub REST fetches, pagination, unavailable states, logs, package script, and compact project-card rendering. [CITED: https://docs.github.com/en/rest/repos/repos?apiVersion=2026-03-10] [VERIFIED: src/routes/projects.tsx]
3. **Release verifier and docs:** Add post-build release verifier, wire into `bun run verify`, update README/CONTRIBUTING outside managed blocks, rerun production build, and record browser/release evidence. [VERIFIED: package.json] [VERIFIED: README.md] [VERIFIED: CONTRIBUTING.md]

### Anti-Patterns to Avoid

- **GitHub mirror drift:** Do not call `/users/{owner}/repos` to discover portfolio content, because the curated registry is the authority. [VERIFIED: 05-CONTEXT.md]
- **Runtime GitHub dependency:** Do not import GitHub clients or call GitHub API endpoints from `src/` route/component code. [VERIFIED: scripts/verify-no-github-runtime.ts]
- **Public token prefixes:** Do not use `VITE_*GITHUB*TOKEN`, `PUBLIC_*GITHUB*TOKEN`, or `SOLID_PUBLIC_*GITHUB*TOKEN` anywhere that can influence client output. [VERIFIED: 05-CONTEXT.md] [CITED: https://vite.dev/guide/env-and-mode]
- **Metadata takeover:** Do not replace curated `live`, `docs`, or `repo` links with GitHub `homepage`. [VERIFIED: 05-CONTEXT.md]
- **New Python helper:** Do not add Python scripts for sync or release verification. [VERIFIED: standards/languages/typescript-javascript.md]
- **Heavy verifier dependencies by default:** Do not add Playwright, axe, or Lighthouse in routine verification unless a specific v1 release claim cannot be proven otherwise. [VERIFIED: 05-CONTEXT.md]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Runtime project curation | Repo discovery or ranking from GitHub stars/topics | Existing `curatedProjects` registry plus pure enrichment helpers | Curation authority is locked to authored registry data. [VERIFIED: 05-CONTEXT.md] [VERIFIED: src/domain/projects.ts] |
| GitHub HTTP stack | Custom TCP/HTTP client or shelling out to `curl` in scripts | Bun native `fetch` | Bun documents `fetch` for HTTP/HTTPS and this repo is Bun-first. [CITED: https://bun.com/docs/runtime/networking/fetch] [VERIFIED: package.json] |
| GitHub pagination package | New Octokit dependency just for pagination | Small `Link` header pagination helper for the topics endpoint | Octokit is deferred and GitHub documents pagination through response `link` headers. [VERIFIED: 05-CONTEXT.md] [CITED: https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api] |
| Visitor token security | Browser env/token policy by convention | Source scanner plus built-output release scanner | Vite bundles `VITE_*` values into client code, so scripts must enforce the boundary. [CITED: https://vite.dev/guide/env-and-mode] |
| Accessibility/performance release score | Fake Lighthouse/axe score without those tools | Static heuristics plus documented manual/browser evidence | Heavy tools are deferred, so claims must be scoped to what dependency-free checks can prove. [VERIFIED: 05-CONTEXT.md] [VERIFIED: 04-03-SUMMARY.md] |
| Secret scanning completeness | Claim exhaustive secret detection with regexes | Conservative local output scan plus residual-risk docs | GitHub secret scanning is broader than a local regex scan; Phase 5 verifier should be a release guard, not a full secret-scanning product. [CITED: https://docs.github.com/en/code-security/concepts/secret-security/about-secret-scanning] |

**Key insight:** The complex part is not fetching GitHub data; the complex part is preserving the static curated boundary while making unavailable metadata, token handling, and release claims explicit. [VERIFIED: 05-CONTEXT.md] [VERIFIED: codebase inspection]

## Common Pitfalls

### Pitfall 1: Letting GitHub Metadata Override Curation

**What goes wrong:** Stars, topics, repo homepage, or archived flags start changing placement, copy, or links. [VERIFIED: 05-CONTEXT.md]  
**Why it happens:** Enrichment helpers return merged `ProjectStory` objects instead of separate optional metadata. [ASSUMED: architecture risk]  
**How to avoid:** Return `{ project, maybeGithubMetadata }` or `maybeGithubMetadataForProject(project)` without mutating `ProjectStory`. [VERIFIED: standards/core/architecture.md]  
**Warning signs:** Tests assert copied stars/topic fields but do not assert that `oneLine`, `themes`, `tags`, `links`, and `displayOrder` stay unchanged. [ASSUMED: test design risk]

### Pitfall 2: Accidental Browser Token Exposure

**What goes wrong:** A sync token name or value appears in bundled JS or static HTML. [VERIFIED: 05-CONTEXT.md]  
**Why it happens:** Vite exposes `VITE_*` variables to client-side source code after bundling. [CITED: https://vite.dev/guide/env-and-mode]  
**How to avoid:** Use a non-public script-only env name, read it only in `scripts/`, keep token names out of `src/`, and scan `.output/public`. [VERIFIED: 05-CONTEXT.md]  
**Warning signs:** `src/` references `process.env`, `import.meta.env`, `GITHUB_TOKEN`, `VITE_`, `PUBLIC_`, or `SOLID_PUBLIC_` token names. [VERIFIED: scripts/verify-no-github-runtime.ts]

### Pitfall 3: Treating 404 as Only "Missing"

**What goes wrong:** Private or permission-limited repositories are reported as nonexistent. [ASSUMED: GitHub API status interpretation risk]  
**Why it happens:** GitHub auth/permissions can affect endpoint access, and the phase explicitly names private repositories as a separate unavailability state. [VERIFIED: 05-CONTEXT.md] [CITED: https://docs.github.com/en/rest/authentication/authenticating-to-the-rest-api]  
**How to avoid:** Store `reason: "missing" | "private" | "moved" | "rate-limited" | "error"` with HTTP status and message, and keep render fallback identical for all unavailable entries. [VERIFIED: 05-CONTEXT.md]  
**Warning signs:** The snapshot only stores `null` for failures or throws during render when metadata is absent. [ASSUMED: implementation risk]

### Pitfall 4: Hidden Redirects Mask Moved Repositories

**What goes wrong:** A moved repo silently enriches from the redirected target while the curated registry still contains a stale link. [ASSUMED: fetch redirect risk]  
**Why it happens:** Fetch follows redirects by default in the WHATWG model, and GitHub repository docs include moved status behavior. [CITED: https://bun.com/docs/runtime/networking/fetch] [CITED: https://docs.github.com/en/rest/repos/repos?apiVersion=2026-03-10]  
**How to avoid:** Use `redirect: "manual"` for repository lookups and represent redirects as `unavailable` or `moved` until the curated link is fixed. [ASSUMED: recommended implementation detail]  
**Warning signs:** Sync logs show final URLs different from curated `repo` links but no curation issue is raised. [ASSUMED: implementation risk]

### Pitfall 5: Pagination Requirement Gets Missed

**What goes wrong:** Topics are fetched only from the first page or the sync script has no generic pagination path. [VERIFIED: GH-02 requirement]  
**Why it happens:** The repository endpoint is not a paginated list, but the topics endpoint exposes `page` and `per_page`. [CITED: https://docs.github.com/en/rest/repos/repos?apiVersion=2026-03-10]  
**How to avoid:** Add a small `fetchPaginatedJson` helper and use it for repository topics even when most repos fit in one page. [CITED: https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api]  
**Warning signs:** Code has no test for multiple `Link` pages or no parser for the `link` header. [ASSUMED: test design risk]

### Pitfall 6: Overclaiming Accessibility or Performance

**What goes wrong:** The release verifier claims axe/Lighthouse-grade results without running axe or Lighthouse. [VERIFIED: 05-CONTEXT.md]  
**Why it happens:** Static heuristics can catch obvious issues but cannot compute actual color contrast, layout instability, or full keyboard UX with the same fidelity as browser tools. [ASSUMED: verification limitation]  
**How to avoid:** Name checks as "static release heuristics", record browser evidence separately, and document residual risks. [VERIFIED: 05-CONTEXT.md]  
**Warning signs:** Verification output says "WCAG pass" or "Lighthouse score pass" without adding and running those tools. [ASSUMED: reporting risk]

## Code Examples

Verified patterns from official sources and repo standards:

### GitHub REST Request With Optional Token

```typescript
// Source: Bun fetch docs; GitHub REST examples recommend Accept and API-version headers.
type GitHubFetchOptions = {
  owner: string;
  repo: string;
  maybeToken?: string;
};

async function fetchRepository(options: GitHubFetchOptions): Promise<Response> {
  const headers = new Headers({
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2026-03-10",
  });

  if (options.maybeToken) {
    headers.set("Authorization", `Bearer ${options.maybeToken}`);
  }

  return fetch(`https://api.github.com/repos/${options.owner}/${options.repo}`, {
    headers,
    redirect: "manual",
  });
}
```

### Snapshot Fallback Rendering

```typescript
// Source: Phase 5 D-05 and existing Solid route pattern.
const maybeMetadata = maybeGithubMetadataForProject(props.project, githubMetadataSnapshot);

<Show when={maybeMetadata}>
  {(metadata) => (
    <ul class="github-meta-row" aria-label={`${props.project.name} GitHub metadata`}>
      <li class="chip">{metadata().stars.toLocaleString("en-US")} stars</li>
      <li class="chip">{metadata().forks.toLocaleString("en-US")} forks</li>
      <li class="chip">{metadata().primaryLanguage ?? "Language unavailable"}</li>
    </ul>
  )}
</Show>;
```

### Built Output Token Guard

```typescript
// Source: Vite env exposure docs and existing verify-no-github-runtime patterns.
const forbiddenBuiltOutputPatterns = [
  { label: "api.github.com", pattern: /api\.github\.com/i },
  { label: "github.com/graphql", pattern: /github\.com\/graphql/i },
  { label: "@octokit/", pattern: /@octokit\//i },
  { label: "GITHUB_TOKEN", pattern: /\bGITHUB_TOKEN\b/ },
  { label: "VITE GitHub token env", pattern: /\bVITE_[A-Z0-9_]*GITHUB[A-Z0-9_]*TOKEN\b/i },
  { label: "PUBLIC GitHub token env", pattern: /\bPUBLIC_[A-Z0-9_]*GITHUB[A-Z0-9_]*TOKEN\b/i },
  { label: "Solid public GitHub token env", pattern: /\bSOLID_PUBLIC_[A-Z0-9_]*GITHUB[A-Z0-9_]*TOKEN\b/i },
  { label: "GitHub token-like value", pattern: /\b(?:github_pat_|gh[pousr]_)[A-Za-z0-9_]{20,}\b/ },
] as const;
```

The `github_pat_` and `gh[pousr]_` token-like pattern is a local heuristic and should be documented as non-exhaustive. [ASSUMED]

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Browser/runtime GitHub API calls for portfolio data | Checked-in static snapshot with optional manual/build-prep sync | Locked for Phase 5 by 2026-05-27 context | Keeps release static, reliable, and token-safe. [VERIFIED: 05-CONTEXT.md] |
| Octokit by default for GitHub API scripts | Native Bun/TypeScript `fetch` first | Locked for Phase 5 by 2026-05-27 context | Avoids new dependency unless native fetch proves insufficient. [VERIFIED: 05-CONTEXT.md] [CITED: https://bun.com/docs/runtime/networking/fetch] |
| Heavy E2E/accessibility/performance dependencies for routine checks | Dependency-free static verifier plus recorded local browser evidence | Established in Phase 04 and continued by Phase 5 context | Preserves fast `bun run verify` while being honest about manual/browser evidence. [VERIFIED: 04-03-SUMMARY.md] [VERIFIED: 05-CONTEXT.md] |
| Vite public env names used casually | Public token prefix names forbidden in source and built output | Required by Phase 5 and supported by Vite docs | Prevents token names/values from entering client bundles. [VERIFIED: 05-CONTEXT.md] [CITED: https://vite.dev/guide/env-and-mode] |

**Deprecated/outdated:**

- Runtime GitHub data fetching for core portfolio rendering is out of scope for v1. [VERIFIED: .planning/REQUIREMENTS.md]
- Scheduled GitHub metadata refresh in CI is deferred to v2. [VERIFIED: 05-CONTEXT.md]
- Per-project Open Graph image generation is deferred to v2. [VERIFIED: 05-CONTEXT.md]
- Heavy Playwright/axe/Lighthouse dependencies are deferred unless Phase 5 proves they are necessary. [VERIFIED: 05-CONTEXT.md]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Static accessibility heuristics can satisfy v1 routine verification when paired with browser evidence. | Phase Requirements, Architecture Patterns, Common Pitfalls | Planner may need to add a browser/accessibility package if static checks are judged insufficient. |
| A2 | Project-defined static budgets such as route HTML <= 75 KB, total uncompressed client JS <= 150 KB, CSS <= 100 KB, and social image <= 250 KB are reasonable v1 thresholds based on current `.output/public` sizes. | Architecture Patterns, Common Pitfalls | Too-tight budgets can fail after metadata; too-loose budgets reduce release value. |
| A3 | The exact sync token env name should be `GITHUB_METADATA_TOKEN` unless implementation chooses a shorter non-public name. | Architecture Patterns, Open Questions | Docs/verifiers must agree on the name; changing later is small but must stay out of `src/`. |
| A4 | `github_pat_` and `gh[pousr]_` regexes are useful token-like output heuristics but are not exhaustive secret scanning. | Code Examples, Security Domain | False negatives are possible; do not claim complete secret scanning. |
| A5 | Treating moved repository redirects as unavailable until curated links are fixed is preferable to silently following redirects. | Common Pitfalls | If GitHub redirect behavior changes or users prefer transparent redirects, sync reporting may need adjustment. |

## Open Questions

1. **Should `open-bitcoin` receive GitHub enrichment from its `related` source link?**
   - What we know: `open-bitcoin` has a `kind: "related"` link to `open-bitcoin-web-miner`, not a `kind: "repo"` source. [VERIFIED: src/domain/projects.ts]
   - What's unclear: Whether related-source enrichment would confuse visitors by duplicating another project's metadata. [ASSUMED]
   - Recommendation: Enrich only `kind: "repo"` links in v1 and omit metadata for records without a direct repo link. [VERIFIED: 05-CONTEXT.md]

2. **What exact token env name should docs and scripts use?**
   - What we know: Public prefixes `VITE_*`, `PUBLIC_*`, and `SOLID_PUBLIC_*` are forbidden, and Vite exposes `VITE_*` variables to client code. [VERIFIED: 05-CONTEXT.md] [CITED: https://vite.dev/guide/env-and-mode]
   - What's unclear: The final non-public local env variable name is discretionary. [VERIFIED: 05-CONTEXT.md]
   - Recommendation: Use `GITHUB_METADATA_TOKEN`, document it as optional, and include that literal in built-output forbidden patterns. [ASSUMED]

3. **Should release verification launch a browser automatically?**
   - What we know: Phase 5 forbids adding Playwright/axe/Lighthouse unless necessary, while allowing browser evidence in verification notes. [VERIFIED: 05-CONTEXT.md]
   - What's unclear: Whether local CDP automation should become a checked-in script or remain manual evidence. [ASSUMED]
   - Recommendation: Keep routine `verify:release` static and dependency-free; record browser evidence in the Phase 5 summary. [VERIFIED: 04-03-SUMMARY.md] [VERIFIED: 05-CONTEXT.md]

4. **Should release budgets be hard fail or warning first?**
   - What we know: Current generated output includes about 30 KB projects HTML, 63 KB CSS chunks, 23-30 KB core JS chunks, and a 101 KB social PNG. [VERIFIED: `.output/public` size probe]
   - What's unclear: Exact acceptable v1 performance budget is discretionary. [VERIFIED: 05-CONTEXT.md]
   - Recommendation: Hard-fail obviously regressive static budgets and print measured sizes in the release summary. [ASSUMED]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Bun | Script/test/build execution | Yes | Local `1.3.9`; repo pins `1.3.14` | Upgrade local Bun or run with existing version if scripts pass. [VERIFIED: environment probe] [VERIFIED: package.json] |
| Node | Tool compatibility for npm registry checks and Vite ecosystem | Yes | `v24.13.0` | Bun handles repo scripts; Node remains available. [VERIFIED: environment probe] |
| npm | Registry version verification | Yes | `11.6.2` | Not needed for routine repo scripts. [VERIFIED: environment probe] |
| git | Commit/repo checks and Mystic SHA verification | Yes | `2.53.0` | None needed. [VERIFIED: environment probe] |
| curl | Optional manual API probing | Yes | `8.7.1` | Use Bun `fetch` script instead. [VERIFIED: environment probe] |
| Google Chrome | Manual/browser release evidence | Yes | Installed at `/Applications/Google Chrome.app` | Static verifier covers routine checks; browser evidence can be manual. [VERIFIED: environment probe] |
| GitHub REST network access | Optional metadata refresh | Yes enough for npm/GitHub docs and `git ls-remote` probes | Public internet reachable during research | Checked-in snapshot fallback keeps site build/render independent from GitHub availability. [VERIFIED: npm registry] [VERIFIED: GitHub ls-remote] |
| GitHub metadata token | Optional higher rate limit | Unknown | Not probed by design | Unauthenticated public-data requests allow 60/hour; snapshot fallback remains available. [CITED: https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api] |

**Missing dependencies with no fallback:**

- None found for planning. [VERIFIED: environment probe]

**Missing dependencies with fallback:**

- Local Bun version is older than `packageManager` pin; planner should either include a local Bun upgrade note or rely on verification to prove `1.3.9` still passes. [VERIFIED: environment probe] [VERIFIED: package.json]
- Optional GitHub token availability is unknown; sync should work unauthenticated for the current curated set and fall back to the checked-in snapshot when rate-limited/unavailable. [CITED: https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api] [VERIFIED: 05-CONTEXT.md]

## Security Domain

Security enforcement is enabled by default because `.planning/config.json` does not set `security_enforcement: false`. [VERIFIED: .planning/config.json]

### Applicable ASVS Categories

OWASP ASVS 5.0.0 is the latest stable ASVS release listed by OWASP, and ASVS is a basis for testing web application technical security controls. [CITED: https://owasp.org/www-project-application-security-verification-standard/]

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No for visitor site; Yes only for optional local GitHub API token handling | No app authentication; script-only optional PAT read from local/server env, never `src/`. [VERIFIED: 05-CONTEXT.md] |
| V3 Session Management | No | Static public site has no sessions. [VERIFIED: .planning/REQUIREMENTS.md] |
| V4 Access Control | No for visitor runtime | No protected resources or roles exist in v1. [VERIFIED: .planning/REQUIREMENTS.md] |
| V5 Input Validation | Yes | Parse GitHub API JSON, repo URLs, dates, numeric counts, topics, and homepage URLs at the script/domain boundary. [VERIFIED: standards/core/architecture.md] |
| V6 Cryptography | Yes only as "do not hand-roll" | Do not implement crypto; protect tokens by not bundling/logging them and by scanning output. [VERIFIED: 05-CONTEXT.md] |

### Known Threat Patterns for Static GitHub Enrichment

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| GitHub token value or token env name appears in built JS/HTML/CSS/assets | Information Disclosure | Script-only non-public token env; `verify:no-github-runtime`; post-build `verify:release` scan of `.output/public`; no token values in docs. [VERIFIED: 05-CONTEXT.md] [CITED: https://vite.dev/guide/env-and-mode] |
| Runtime GitHub API endpoint or client library ships to visitors | Information Disclosure / Reliability | Source scanner and built-output scanner forbid `api.github.com`, `github.com/graphql`, and GitHub client library strings. [VERIFIED: scripts/verify-no-github-runtime.ts] |
| Untrusted GitHub strings alter markup or links | Tampering / XSS | Parse to typed snapshot, render strings as text, restrict homepage URL enrichment to non-empty valid URLs, and never use raw HTML from GitHub. [VERIFIED: standards/core/architecture.md] [ASSUMED: implementation detail] |
| Rate limit or GitHub outage breaks build/render | Denial of Service | Checked-in snapshot is runtime source; sync failure records unavailable status and does not block rendering unless strict mode is intentionally used. [VERIFIED: 05-CONTEXT.md] [CITED: https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api] |
| Metadata changes misrepresent curated work | Integrity / Repudiation | Preserve manual fields as authority; unit-test no override of `oneLine`, `themes`, `tags`, `links`, placement, or ordering. [VERIFIED: 05-CONTEXT.md] |

## Sources

### Primary (HIGH confidence)

- `.planning/phases/05-github-enrichment-release-verification/05-CONTEXT.md` - Locked Phase 5 decisions, discretion, and deferred scope. [VERIFIED]
- `.planning/REQUIREMENTS.md` - GH-02, GH-03, GH-04, VER-01, VER-02, VER-03, VER-04, VER-05. [VERIFIED]
- `.planning/ROADMAP.md` - Phase 5 goal and success criteria. [VERIFIED]
- `.planning/STATE.md` - Prior decisions and Phase 4 readiness. [VERIFIED]
- `AGENTS.md`, `AGENTS.bright-builds.md`, `standards-overrides.md`, and canonical Bright Builds standards pages - repo and standards constraints. [VERIFIED]
- `package.json`, `tsconfig.json`, `app.config.ts`, `src/domain/projects.ts`, `src/domain/project-validation.ts`, `src/domain/seo.ts`, `src/routes/projects.tsx`, `scripts/verify-no-github-runtime.ts`, `scripts/verify-static.ts`, `scripts/verify-visual-system.ts`, `README.md`, `CONTRIBUTING.md` - existing code and docs surfaces. [VERIFIED]
- GitHub REST repository docs: `https://docs.github.com/en/rest/repos/repos?apiVersion=2026-03-10` - repository fields and topics endpoint pagination parameters. [CITED]
- GitHub REST pagination docs: `https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api` - `link` header pagination model and Octokit alternative context. [CITED]
- GitHub REST rate-limit docs: `https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api` - unauthenticated and authenticated primary rate limits. [CITED]
- GitHub REST authentication docs: `https://docs.github.com/en/rest/authentication/authenticating-to-the-rest-api` - personal access token guidance and security warning. [CITED]
- Vite env docs: `https://vite.dev/guide/env-and-mode` - `VITE_*` client exposure and secret warning. [CITED]
- Bun fetch docs: `https://bun.com/docs/runtime/networking/fetch` - native fetch recommendation and API. [CITED]
- Bun environment docs: `https://bun.com/docs/runtime/environment-variables` - Bun `.env` loading and `process.env`. [CITED]
- OWASP ASVS project page: `https://owasp.org/www-project-application-security-verification-standard/` - ASVS purpose and 5.0.0 latest stable release. [CITED]
- npm registry probes via `npm view` - current/pinned package versions and modified timestamps. [VERIFIED]

### Secondary (MEDIUM confidence)

- GitHub secret scanning overview: `https://docs.github.com/en/code-security/concepts/secret-security/about-secret-scanning` - secret scanning scope and alert/remediation context. [CITED]
- Phase 04 summary: `.planning/phases/04-visual-system-motion/04-03-SUMMARY.md` - local Chrome CDP browser evidence pattern and dependency-light verification precedent. [VERIFIED]

### Tertiary (LOW confidence)

- Local token-like regex exactness for GitHub tokens is a heuristic and must not be treated as exhaustive secret scanning. [ASSUMED]
- Static performance and accessibility budget thresholds are project-defined recommendations based on current output sizes. [ASSUMED]

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - Uses existing pinned packages, npm registry checks, and official GitHub/Bun/Vite docs. [VERIFIED: package.json] [VERIFIED: npm registry] [CITED: official docs]
- Architecture: HIGH - Matches locked context and existing functional-core/imperative-shell repo pattern. [VERIFIED: 05-CONTEXT.md] [VERIFIED: standards/core/architecture.md]
- Pitfalls: MEDIUM-HIGH - Token/env and API limits are verified; budget/accessibility heuristic limits are documented as assumptions. [CITED: https://vite.dev/guide/env-and-mode] [CITED: https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api] [ASSUMED]

**Research date:** 2026-05-27 [VERIFIED: current session date]  
**Valid until:** 2026-06-26 for stack/API assumptions; re-check GitHub/Vite/Bun docs before planning if the phase starts later. [ASSUMED]
