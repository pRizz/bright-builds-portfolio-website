# Phase 28: Verification and Release Contract - Research

**Researched:** 2026-06-22
**Domain:** Bun/TypeScript static release verification, social preview metadata contracts, release evidence truthfulness
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

Source: copied verbatim from `.planning/phases/28-verification-and-release-contract/28-CONTEXT.md`. [VERIFIED: .planning/phases/28-verification-and-release-contract/28-CONTEXT.md]

### Locked Decisions

## Implementation Decisions

### Aggregate Verification Contract
- **D-01:** Keep `bun run verify` as the clean-builder release command after `bun run install:browser`; do not replace it with a second aggregate command.
- **D-02:** Ensure deterministic social preview verification runs before the production build so stale generated PNGs or manifest drift fail before static HTML is produced.
- **D-03:** Preserve the local-only release boundary: aggregate verification must not call dynamic Open Graph endpoints, server functions, live GitHub APIs, hosted crawler validators, live external-link reachability checks, or deployed-site smoke checks.
- **D-04:** Add explicit guards or tests proving that visitor-facing runtime code still does not fetch GitHub metadata and that release verification does not depend on live external services.
- **D-05:** Prefer repo-owned scripts and existing package scripts over hand-rolled shell chains. Keep scripts Bun/TypeScript-native and avoid new Python automation.

### Unit and Helper Coverage
- **D-06:** Treat pure helper tests as the primary regression guard for route-derived social preview target selection, public-only filtering, asset-path uniqueness, source-fingerprint stability, manifest freshness finding classification, metadata image selection, JSON-LD image parity, and offline freshness severity classification.
- **D-07:** Add narrowly scoped Vitest coverage only where existing tests do not already prove a Phase 28 requirement. Do not duplicate route-to-image maps that should be derived from helpers.
- **D-08:** Keep Arrange/Act/Assert comments in non-trivial unit tests, matching the repo standard.
- **D-09:** If an existing test already covers a requirement, make Phase 28 strengthen that test's assertion or document it in release evidence rather than adding redundant broad tests.

### Static Output Verification
- **D-10:** Expand static output verification over `.output/public` to check every covered route's generated HTML for canonical `og:image`, `og:image:type`, dimensions, alt text, Twitter image parity, JSON-LD image parity where applicable, local asset existence, manifest consistency, and forbidden runtime residue.
- **D-11:** Covered routes remain helper-derived from `socialPreviewTargets()` and route helpers. Do not introduce a manually maintained route-to-image fixture list for static verification.
- **D-12:** Generic routes such as `/`, `/about`, `/contact`, not-found/fallback surfaces, and future non-covered routes must continue to use the checked-in fallback social image until a future phase scopes route-specific previews for them.
- **D-13:** Static output checks may require a successful production build and should fail with clear instructions when `.output/public` is missing.

### Budgets and Evidence Labels
- **D-14:** Release verification should enforce both per-image and total generated social preview asset budgets using the same constants or manifest data that generation/check mode owns.
- **D-15:** Automated evidence labels must describe only checks that actually run locally. Labels must not imply Cloudflare deployment, preview URL validation, hosted social-card validation, current live GitHub state, or live external-link reachability.
- **D-16:** Keep freshness report outputs classified as `release blocker`, `needs review`, and `manual smoke`; only deterministic local blockers may fail release gates.
- **D-17:** If release verification surfaces manual smoke labels, they must be clearly separated from automated pass/fail evidence.

### Release-Readiness Documentation
- **D-18:** Update release-readiness docs to explain the social preview generation flow, social preview check mode, freshness report, static verification, release verification, and manual social-card smoke checks.
- **D-19:** Preserve the documented clean-builder sequence `bun run install:browser && bun run verify`.
- **D-20:** Document that hosted crawler validation, deployed preview/production smoke checks, current live GitHub state, and live external-link reachability are manual or explicit opt-in activities, not part of `bun run verify`.
- **D-21:** Preserve the existing low-intrusion OpenLinks identity posture. Release and metadata docs may mention identity verification only as an existing metadata/body-link contract; do not add prominent OpenLinks promotion or make it a primary brand CTA.

### the agent's Discretion
- Exact helper names, assertion grouping, evidence label wording, and whether release budgets are checked in `verify-release.ts` or a small helper module are delegated to planning and implementation.
- Exact release-readiness section ordering is delegated to implementation, as long as the clean-builder command, deterministic local evidence, and manual smoke boundaries are easy to scan.

### Deferred Ideas (OUT OF SCOPE)

## Deferred Ideas

- Route-specific previews for home, about, contact, and other generic routes remain `SOCIAL-FUTURE-01`.
- Hosted social-card validator automation remains `SOCIAL-FUTURE-02`.
- Scheduled GitHub metadata refreshes and live external-link reports remain future freshness work.
- Public freshness dashboard, CMS/admin workflows, search/filtering, newsletters, and runtime content features remain out of v1.5 scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| VERIFY-01 | Unit tests cover social preview target derivation, public-only filtering, path uniqueness, fingerprint stability, manifest freshness checks, metadata image selection, JSON-LD image parity, and offline freshness finding classification. [VERIFIED: .planning/REQUIREMENTS.md] | Existing Vitest coverage already spans these areas, but Phase 28 should strengthen exact assertions around manifest/static verifier integration and release budget labels instead of adding duplicate route maps. [VERIFIED: src/domain/social-previews.test.ts; scripts/social-previews/social-previews.test.ts; src/domain/project-detail-routes.test.ts; src/domain/writing-metadata.test.ts; scripts/freshness/freshness.test.ts; scripts/verify-release.test.ts] |
| VERIFY-02 | `bun run verify` includes deterministic social preview verification before production build and avoids dynamic OG endpoints, server functions, visitor-runtime GitHub fetches, and live external-link release gates. [VERIFIED: .planning/REQUIREMENTS.md] | The current `verify` script already runs `verify:social-previews` before `build` and excludes `report:freshness`, `sync:github-metadata`, `freshness:live`, and `smoke:hosted`; Phase 28 should keep and test that order. [VERIFIED: package.json; scripts/release-readiness.test.ts] |
| VERIFY-03 | Static output verification checks every covered route's generated HTML, social image metadata, JSON-LD image field, local asset existence, dimensions, manifest consistency, and forbidden runtime residue. [VERIFIED: .planning/REQUIREMENTS.md] | Static verification already iterates helper-derived `expectedRoutes`, validates metadata, JSON-LD image parity, local asset existence, PNG dimensions, and forbidden residue; manifest consistency is the main missing static-verifier-specific check. [VERIFIED: scripts/verify-static/run-static-verification.ts; scripts/verify-static/metadata-jsonld-verifier.ts; scripts/verify-static/sitemap-assets-verifier.ts; scripts/verify-static.test.ts] |
| VERIFY-04 | Release verification enforces per-image and total social preview asset budgets and reports only automated evidence labels that actually run locally. [VERIFIED: .planning/REQUIREMENTS.md] | `verify-release.ts` currently budgets route HTML, total JS, total CSS, and only `social/bright-builds-og.png`; generated preview PNG per-image and aggregate budgets are not first-class release-budget checks yet. [VERIFIED: scripts/verify-release.ts; scripts/verify-release.test.ts; public/social/generated/manifest.json] |
| VERIFY-05 | Release-readiness docs explain generation, verification, freshness report, and manual social-card smoke flow while preserving `bun run install:browser && bun run verify`. [VERIFIED: .planning/REQUIREMENTS.md] | The current docs already document the aggregate gate, freshness report, static/browser/release checks, and clean-builder command; Phase 28 should add explicit social preview generation/check/static social-card smoke guidance and wire tests for those required facts. [VERIFIED: docs/release-readiness.md; scripts/release-readiness.ts; scripts/release-readiness.test.ts] |
</phase_requirements>

## Summary

Phase 28 should be a contract-tightening phase, not a new feature phase: the route-derived social preview data contract, deterministic PNG generation, route-aware metadata, JSON-LD parity, and offline freshness report already exist in the codebase. [VERIFIED: src/domain/social-previews.ts; scripts/generate-social-previews.ts; src/domain/seo.ts; scripts/generate-freshness-report.ts] The planner should direct work toward closing the remaining release-gate gaps: static verifier manifest consistency, generated-image release budgets, stronger evidence-label wording, and release-readiness documentation for social-card manual smoke checks. [VERIFIED: scripts/verify-static/metadata-jsonld-verifier.ts; scripts/verify-release.ts; docs/release-readiness.md]

The current local checks are healthy for the surfaces researched here: `bun run verify:social-previews` verified 13 deterministic social preview PNGs and manifest entries, targeted Vitest coverage passed 109 tests across 8 files, `bun run verify:static` verified 16 prerendered routes, `bun run verify:release` passed, and `bun run report:freshness` had no release blockers. [VERIFIED: local command output 2026-06-22] The freshness report still emits one `needs review` GitHub unavailable-record finding and manual smoke prompts, which is expected review evidence rather than a hidden hard release gate. [VERIFIED: local command output 2026-06-22; scripts/freshness/report.ts]

**Primary recommendation:** Extend the existing Bun/TypeScript helper stack: add manifest-aware static-output assertions, generated social preview per-image and total budgets, and doc/evidence-label guard tests without adding dependencies, live network checks, dynamic OG endpoints, or manual route maps. [VERIFIED: package.json; scripts/verify-static/run-static-verification.ts; scripts/verify-release.ts; .planning/phases/28-verification-and-release-contract/28-CONTEXT.md]

## Project Constraints (from AGENTS.md)

- Read repo-local instructions, `AGENTS.bright-builds.md`, `standards-overrides.md`, and relevant standards before planning, review, implementation, or audit work. [VERIFIED: AGENTS.md; AGENTS.bright-builds.md; standards/index.md]
- Use GSD workflow artifacts for planning and execution; direct repo edits outside GSD are disallowed unless explicitly bypassed. [VERIFIED: AGENTS.md]
- The site is dark-primary; UI changes need desktop and mobile dark rendering, contrast/readability, and text-overlap verification. [VERIFIED: AGENTS.md]
- Prefer repo-native verification entrypoints and do not commit if relevant checks fail. [VERIFIED: standards/core/verification.md]
- Keep business logic as functional core with thin imperative shells, and unit-test pure/business logic. [VERIFIED: standards/core/architecture.md; standards/core/testing.md]
- TypeScript/Bun automation should stay Bun/TypeScript-native; do not add new Python scripts for repo-owned automation. [VERIFIED: standards/languages/typescript-javascript.md]
- Unit tests should be focused and use Arrange/Act/Assert comments when the structure is non-trivial. [VERIFIED: standards/core/testing.md]
- OpenLinks should remain low-intrusion in footer/about/profile/docs/metadata surfaces and must not replace the host brand or primary CTA. [VERIFIED: AGENTS.bright-builds.md; /Users/peterryszkiewicz/.codex/skills/openlinks-identity-presence/SKILL.md; /Users/peterryszkiewicz/.codex/skills/openlinks-identity-presence/references/surface-patterns.md]
- No project-local skills were found under `.claude/skills` or `.agents/skills`. [VERIFIED: `find .claude/skills .agents/skills -maxdepth 2 -name SKILL.md`]

## Standard Stack

### Core

| Library / Tool | Version | Purpose | Why Standard |
|---|---:|---|---|
| Bun | Pinned `bun@1.3.14`; local binary `1.3.9` | Runs repo scripts and aggregate verification. [VERIFIED: package.json; `bun --version`] | Existing repo contract uses Bun scripts and clean-builder command `bun run install:browser && bun run verify`. [VERIFIED: package.json; docs/release-readiness.md] |
| TypeScript | `6.0.3` | Typechecks source and scripts. [VERIFIED: package.json; npm registry] | Verification helpers are TypeScript modules with pure functions and thin CLIs. [VERIFIED: scripts/verify-release.ts; scripts/verify-static/run-static-verification.ts; scripts/generate-social-previews.ts] |
| Vitest | Pinned `4.1.7`; npm latest checked as `4.1.9` | Unit tests for domain and script helper contracts. [VERIFIED: package.json; npm registry] | Existing Phase 28-adjacent tests are Vitest files and targeted run passed 109 tests. [VERIFIED: `rg --files tests src scripts`; local command output 2026-06-22] |
| Playwright | Pinned/local `@playwright/test@1.60.0`; npm latest checked as `1.61.0` | Browser/accessibility release gate. [VERIFIED: package.json; `node_modules/.bin/playwright --version`; npm registry] | Existing aggregate `verify` runs `verify:browser` after `build`; clean builders provision Chromium through `install:browser`. [VERIFIED: package.json; docs/release-readiness.md] |
| Biome | Pinned `2.4.15`; npm latest checked as `2.5.0` | Formatting and linting. [VERIFIED: package.json; npm registry] | Aggregate verification starts with `format:check` and `check` before type/test/release gates. [VERIFIED: package.json] |
| SolidStart/Vinxi static build | `@solidjs/start@1.3.2`, `vinxi@0.5.11` | Produces `.output/public` static artifact. [VERIFIED: package.json; app.config.ts] | `app.config.ts` uses `server.preset = "static"` and `prerender.routes = [...prerenderRoutes]`. [VERIFIED: app.config.ts] |

### Supporting

| Library / Tool | Version | Purpose | When to Use |
|---|---:|---|---|
| `@resvg/resvg-js` | `2.6.2` | Deterministic SVG-to-PNG renderer for generated social previews. [VERIFIED: package.json; npm registry; scripts/social-previews/render.ts] | Keep using existing renderer through `verify:social-previews`; Phase 28 should not replace it. [VERIFIED: scripts/generate-social-previews.ts; scripts/social-previews/check.ts] |
| Node/Bun built-ins | Node local `v24.13.0` | File traversal, hashing, path safety, and static output checks. [VERIFIED: `node --version`; scripts/verify-release.ts; scripts/social-previews/check-input.ts] | Use built-ins for release verification and SHA-256 checks; do not add generic filesystem or crypto dependencies. [VERIFIED: scripts/verify-release.ts; scripts/social-previews/check-input.ts] |
| Existing social preview helpers | Source modules | Target derivation, fallback metadata, manifest, check findings, path guards, and budgets. [VERIFIED: src/domain/social-previews.ts; scripts/social-previews/config.ts; scripts/social-previews/manifest.ts; scripts/social-previews/paths.ts; scripts/social-previews/check.ts] | Use these as the source of truth for static and release verification. [VERIFIED: .planning/phases/28-verification-and-release-contract/28-CONTEXT.md] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|---|---|---|
| Existing Bun/TypeScript scripts | New shell/Python verifier | Rejected because repo standards require Bun/TypeScript-native automation and repo-owned scripts over ad hoc shell chains. [VERIFIED: standards/languages/typescript-javascript.md; .planning/phases/28-verification-and-release-contract/28-CONTEXT.md] |
| Static generated PNGs | Dynamic OG endpoints or server image generation | Rejected because v1.5 explicitly keeps social preview generation static and local. [VERIFIED: .planning/REQUIREMENTS.md; .planning/phases/25-deterministic-static-image-generation/25-CONTEXT.md] |
| Helper-derived expected routes | Manual route-to-image fixtures | Rejected because covered routes must derive from `socialPreviewTargets()` and route helpers. [VERIFIED: .planning/phases/28-verification-and-release-contract/28-CONTEXT.md; scripts/verify-static/expected-route-text.ts] |
| Offline report/manual smoke prompts | Live external-link or hosted crawler release gates | Rejected because local release evidence must not overclaim networked checks. [VERIFIED: .planning/REQUIREMENTS.md; scripts/generate-freshness-report.ts; docs/release-readiness.md] |

**Installation:**

No new packages should be planned for Phase 28. [VERIFIED: package.json; .planning/phases/28-verification-and-release-contract/28-CONTEXT.md]

```bash
bun install
```

Use the repo's existing dependency install/bootstrap path when dependencies are missing; keep `bun run install:browser && bun run verify` as the clean-builder release command. [VERIFIED: package.json; docs/release-readiness.md]

**Version verification:** Package versions were checked from `package.json`; npm registry checks were run for `vitest`, `@playwright/test`, `@biomejs/biome`, `typescript`, `@resvg/resvg-js`, and `@solidjs/start`. [VERIFIED: package.json; npm registry] The registry has newer versions for Vitest, Playwright, and Biome than the repo pins, but Phase 28 should not include dependency upgrades because the phase is a release-contract tightening task. [VERIFIED: npm registry; .planning/phases/28-verification-and-release-contract/28-CONTEXT.md]

## Architecture Patterns

### Recommended Project Structure

Keep the existing structure and add only small helper modules where they reduce duplication. [VERIFIED: scripts/verify-static/metadata-jsonld-verifier.ts; scripts/verify-release.ts; standards/core/code-shape.md]

```text
src/domain/
├── social-previews.ts       # route-derived social preview target contract [VERIFIED: src/domain/social-previews.ts]
└── seo.ts                   # route-aware metadata and JSON-LD image parity [VERIFIED: src/domain/seo.ts]

scripts/social-previews/
├── config.ts                # image budget and managed path constants [VERIFIED: scripts/social-previews/config.ts]
├── manifest.ts              # timestamp-free manifest contract [VERIFIED: scripts/social-previews/manifest.ts]
├── check.ts                 # pure generated-media finding logic [VERIFIED: scripts/social-previews/check.ts]
└── check-input.ts           # filesystem adapter for check mode [VERIFIED: scripts/social-previews/check-input.ts]

scripts/verify-static/
├── run-static-verification.ts       # static output orchestration [VERIFIED: scripts/verify-static/run-static-verification.ts]
├── metadata-jsonld-verifier.ts      # metadata and JSON-LD assertions [VERIFIED: scripts/verify-static/metadata-jsonld-verifier.ts]
└── output.ts                       # local file and PNG assertions [VERIFIED: scripts/verify-static/output.ts]

scripts/
├── verify-release.ts         # release budgets, residue, evidence labels [VERIFIED: scripts/verify-release.ts]
└── release-readiness.ts      # doc facts and automated/manual labels [VERIFIED: scripts/release-readiness.ts]
```

### Pattern 1: Functional Core, Imperative Shell

**What:** Keep classification, budget, manifest, and evidence-label decisions in pure functions; keep filesystem reads, process exits, and console output in thin CLI shells. [VERIFIED: standards/core/architecture.md; scripts/social-previews/check.ts; scripts/generate-social-previews.ts]

**When to use:** Use this for generated preview budget calculations, manifest consistency checks, release evidence labels, and doc-fact checks. [VERIFIED: scripts/verify-release.ts; scripts/release-readiness.ts; scripts/social-previews/check.ts]

**Example:**

```ts
// Source: scripts/social-previews/check.ts and scripts/generate-social-previews.ts
const findings = socialPreviewCheckFindings(checkInput);

if (findings.length > 0) {
  printCheckFindings(findings);
  return false;
}
```

### Pattern 2: Helper-Derived Route Coverage

**What:** Static and release verification should derive covered social preview routes from `socialPreviewTargets()` and static output routes from `prerenderRoutes` / `expectedRoutes`. [VERIFIED: src/domain/social-previews.ts; scripts/verify-static/expected-route-text.ts; scripts/verify-static.test.ts]

**When to use:** Use this whenever Phase 28 needs route-to-image expectations, manifest consistency, or per-route HTML checks. [VERIFIED: .planning/phases/28-verification-and-release-contract/28-CONTEXT.md]

**Example:**

```ts
// Source: scripts/verify-static/expected-route-text.ts
export const expectedRoutes: StaticRouteCheck[] = prerenderRoutes.map((route) => ({
  route,
  expectedTexts: ["OpenLinks profile", ...expectedTextsForRoute(route)],
  forbiddenTextPatterns: generatedOutputForbiddenPatterns,
}));
```

### Pattern 3: Manifest-Aware Static Verification

**What:** Static verification should assert that each covered route's HTML references the same asset path, dimensions, and local PNG represented in `public/social/generated/manifest.json` and copied into `.output/public/social/generated/manifest.json`. [VERIFIED: public/social/generated/manifest.json; local `cmp` command output 2026-06-22; .planning/phases/28-verification-and-release-contract/28-CONTEXT.md]

**When to use:** Add this around `assertMetadataImageMapsToLocalAsset()` or a nearby helper so every covered route's metadata/JSON-LD image is checked against both the target helper and manifest entry. [VERIFIED: scripts/verify-static/metadata-jsonld-verifier.ts]

**Recommended shape:**

```ts
// Source pattern: scripts/verify-static/metadata-jsonld-verifier.ts + scripts/social-previews/manifest.ts
const maybeTarget = maybeSocialPreviewTargetForRoutePath(routePath);

if (maybeTarget) {
  const manifestEntry = manifestEntryByRoutePath.get(routePath);
  assertManifestEntryMatchesTarget(manifestEntry, maybeTarget);
}
```

### Pattern 4: Release Budgets From the Same Social Preview Constants

**What:** Release verification should use `maxSocialPreviewPngBytes` for per-image generated PNG checks and add an explicit total generated preview budget from the same social preview config module. [VERIFIED: scripts/social-previews/config.ts; scripts/verify-release.ts; .planning/phases/28-verification-and-release-contract/28-CONTEXT.md]

**When to use:** Extend `budgetReportForFiles()` and `budgetViolationsForReport()` so generated preview PNGs appear in `assetBytes` or a dedicated social preview budget collection. [VERIFIED: scripts/verify-release.ts]

**Current baseline:** There are 13 generated PNGs totaling 753,663 bytes, and all individual files are under the existing 250 KiB per-image limit. [VERIFIED: `find public/social/generated -type f -name '*.png' -exec stat`; public/social/generated/manifest.json]

## Current Coverage And Gaps

| Area | Existing Coverage | Planning Gap |
|---|---|---|
| Social preview targets | `socialPreviewTargets()` covers `/projects`, selected project detail routes, `/writing`, public writing detail routes, `/themes`, and public theme detail routes; tests cover public filtering, uniqueness, fingerprint stability, fallback behavior, and validation codes. [VERIFIED: src/domain/social-previews.ts; src/domain/social-previews.test.ts] | Do not add duplicate broad tests; strengthen only where Phase 28 needs release/static verifier proof. [VERIFIED: .planning/phases/28-verification-and-release-contract/28-CONTEXT.md] |
| Generated media check mode | `verify:social-previews` detects validation, missing files, stale fingerprint, checksum drift, manifest drift, dimensions, oversize, blank image, orphan PNGs, and nondeterminism. [VERIFIED: scripts/social-previews/check.ts; scripts/social-previews/social-previews.test.ts; local command output 2026-06-22] | Surface the same manifest facts in static output verification so built HTML and copied manifest agree. [VERIFIED: scripts/verify-static/metadata-jsonld-verifier.ts; public/social/generated/manifest.json] |
| Metadata and JSON-LD parity | Domain tests cover project, writing, and theme metadata/image parity; static verifier checks `og:image`, MIME, dimensions, alt text, Twitter image, local PNG existence, and JSON-LD text presence. [VERIFIED: src/domain/project-detail-routes.test.ts; src/domain/writing-metadata.test.ts; scripts/verify-static/metadata-jsonld-verifier.ts] | Add explicit static-verifier checks that generated route images also match manifest entries, not only target helper paths and PNG headers. [VERIFIED: scripts/verify-static/metadata-jsonld-verifier.ts; scripts/social-previews/manifest.ts] |
| Aggregate verify order | Current `verify` runs `verify:social-previews` before `build`, then browser/static/release verification. [VERIFIED: package.json] | Preserve and assert the order in release-readiness tests while keeping report/live/sync scripts out of `verify`. [VERIFIED: scripts/release-readiness.test.ts] |
| Release budgets | `verify-release.ts` budgets route HTML, client JS, CSS, and the fallback social image. [VERIFIED: scripts/verify-release.ts] | Add generated social preview per-image and total budgets, budget output, and tests. [VERIFIED: scripts/verify-release.ts; scripts/verify-release.test.ts] |
| Evidence labels | Automated labels currently include local accessibility, metadata, route coverage, static budgets, and external-link policy only. [VERIFIED: scripts/verify-release.ts; scripts/release-readiness.ts; local command output 2026-06-22] | Add social preview/static social metadata evidence wording only if backed by checks that actually run locally. [VERIFIED: .planning/phases/28-verification-and-release-contract/28-CONTEXT.md] |
| Release docs | Docs preserve `bun run install:browser && bun run verify`, static output, freshness report, automated gates, external-link policy, and manual deploy smoke checks. [VERIFIED: docs/release-readiness.md] | Add explicit generation/check/static social-card smoke flow and update doc-fact tests. [VERIFIED: docs/release-readiness.md; scripts/release-readiness.ts] |

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---|---|---|---|
| Route coverage | Manual arrays of `/projects/...`, `/writing/...`, or `/themes/...` routes | `socialPreviewTargets()`, `prerenderRoutes`, and `expectedRoutes` | Existing helpers already encode public filtering and static route coverage. [VERIFIED: src/domain/social-previews.ts; scripts/verify-static/expected-route-text.ts] |
| Manifest comparison | Ad hoc string scans of manifest JSON | `SocialPreviewManifest`, `serializeSocialPreviewManifest()`, and a small parsed-manifest helper | Existing manifest serialization is stable and timestamp-free. [VERIFIED: scripts/social-previews/manifest.ts] |
| Static image dimensions | New PNG parser | Existing `assertPngDimensions()` and social preview check metadata | The repo already has a PNG header dimension assertion used by static verification. [VERIFIED: scripts/verify-static/output.ts; scripts/social-previews/check-input.ts] |
| Runtime share images | Dynamic OG routes, edge functions, hosted screenshot services, or server rasterization | Checked-in generated PNGs under `public/social/generated/` | v1.5 requires static/local deterministic assets and excludes dynamic OG endpoints. [VERIFIED: .planning/REQUIREMENTS.md; scripts/generate-social-previews.ts] |
| External-link confidence | Live HTTP crawler in `bun run verify` | Policy checks plus manual smoke labels/docs | Live external checks are out of scope for local release gates. [VERIFIED: .planning/REQUIREMENTS.md; scripts/release-readiness.ts; docs/release-readiness.md] |
| Release command orchestration | A new aggregate command or shell chain | Existing `bun run verify` and repo-owned scripts | Phase 28 locks `bun run verify` as the aggregate gate. [VERIFIED: .planning/phases/28-verification-and-release-contract/28-CONTEXT.md; package.json] |
| Repo-owned automation language | Python helper scripts | Bun/TypeScript scripts | Bright Builds TS guidance forbids new Python automation in Bun-friendly JS/TS repos without a durable compatibility reason. [VERIFIED: standards/languages/typescript-javascript.md] |

**Key insight:** The risky work is not implementing new social preview logic; it is preventing the release gate from drifting into duplicated route maps, stale manifest checks, and overclaimed manual/network evidence. [VERIFIED: .planning/phases/28-verification-and-release-contract/28-CONTEXT.md; scripts/verify-static/metadata-jsonld-verifier.ts; scripts/verify-release.ts]

## Common Pitfalls

### Pitfall 1: Budgeting Only the Fallback Social Image

**What goes wrong:** Release verification reports a social image budget while ignoring the generated route-specific preview PNGs. [VERIFIED: scripts/verify-release.ts]

**Why it happens:** `budgetReportForFiles()` currently records only `social/bright-builds-og.png` in `assetBytes`. [VERIFIED: scripts/verify-release.ts]

**How to avoid:** Include every `social/generated/**/*.png` in release budget collection and enforce both per-image and total generated preview thresholds. [VERIFIED: scripts/social-previews/config.ts; public/social/generated/manifest.json]

**Warning signs:** `verify:release` output prints only `social/bright-builds-og.png` and does not list generated social preview totals. [VERIFIED: local `bun run verify:release` output 2026-06-22]

### Pitfall 2: Checking Metadata Without Manifest Consistency

**What goes wrong:** Static HTML can reference a helper-derived local PNG while the copied manifest is stale or missing matching route/fingerprint/checksum facts. [VERIFIED: scripts/verify-static/metadata-jsonld-verifier.ts; scripts/social-previews/manifest.ts]

**Why it happens:** `verify:social-previews` owns manifest drift checks, while `verify:static` currently focuses on generated HTML, local PNG existence, dimensions, JSON-LD, sitemap, robots, assets, and forbidden residue. [VERIFIED: scripts/social-previews/check.ts; scripts/verify-static/run-static-verification.ts]

**How to avoid:** Add a static verifier assertion that loads `.output/public/social/generated/manifest.json`, finds the covered route entry, and compares route path, asset path, dimensions, and source fingerprint to `maybeSocialPreviewTargetForRoutePath()`. [VERIFIED: public/social/generated/manifest.json; src/domain/social-previews.ts]

**Warning signs:** `assertMetadataImageMapsToLocalAsset()` passes without reading any manifest data. [VERIFIED: scripts/verify-static/metadata-jsonld-verifier.ts]

### Pitfall 3: Overclaiming Manual Or Live Evidence

**What goes wrong:** Evidence labels imply Cloudflare deploys, hosted crawler validation, current GitHub state, or live external-link reachability ran locally. [VERIFIED: .planning/phases/28-verification-and-release-contract/28-CONTEXT.md]

**Why it happens:** Manual smoke labels and automated evidence labels can blur if they share output or wording. [VERIFIED: scripts/release-readiness.ts; scripts/verify-release.ts]

**How to avoid:** Keep automated evidence labels separate from `manualReleaseChecklistLabels()` and add negative tests for terms like hosted, live link, Cloudflare deployment, preview validation, and current live GitHub state in automated labels. [VERIFIED: scripts/release-readiness.test.ts; scripts/verify-release.test.ts]

**Warning signs:** `releaseEvidenceLabels()` contains `network`, `live link`, `Cloudflare`, `hosted`, or `preview` terminology. [VERIFIED: scripts/verify-release.test.ts]

### Pitfall 4: Treating SolidStart Static Internals As Forbidden Server Functions

**What goes wrong:** A guard can incorrectly fail on SolidStart's static build internals such as `src/entry-server.tsx` or `app.config.ts` even though the configured preset is static. [VERIFIED: src/entry-server.tsx; app.config.ts]

**Why it happens:** Searching for the string `server` is too broad in a SolidStart repo. [VERIFIED: `rg "server" app.config.ts src/entry-server.tsx`]

**How to avoid:** Guard against custom API routes, dynamic OG endpoints, runtime GitHub fetches, and public token mechanisms, while allowing SolidStart's static SSR/prerender entrypoint. [VERIFIED: scripts/verify-no-github-runtime.ts; app.config.ts]

**Warning signs:** Tests fail solely because `@solidjs/start/server` exists, even though `server.preset` is `"static"`. [VERIFIED: src/entry-server.tsx; app.config.ts]

### Pitfall 5: Duplicating Existing Unit Coverage

**What goes wrong:** Phase 28 adds broad tests that repeat existing target, metadata, JSON-LD, and freshness tests without improving release confidence. [VERIFIED: src/domain/social-previews.test.ts; src/domain/project-detail-routes.test.ts; src/domain/writing-metadata.test.ts; scripts/freshness/freshness.test.ts]

**Why it happens:** VERIFY-01 names many behaviors that are already covered from Phases 24-27. [VERIFIED: .planning/REQUIREMENTS.md; existing test files]

**How to avoid:** Add focused tests only for new Phase 28 behavior: manifest-aware static checks, generated social preview release budgets, aggregate verify order guards if strengthened, evidence label/doc fact updates, and manual smoke boundary wording. [VERIFIED: scripts/verify-static.test.ts; scripts/verify-release.test.ts; scripts/release-readiness.test.ts]

**Warning signs:** A test hard-codes all current generated asset paths instead of deriving them from `socialPreviewTargets()` or the manifest. [VERIFIED: .planning/phases/28-verification-and-release-contract/28-CONTEXT.md]

## Code Examples

Verified patterns from local sources:

### Manifest-Aware Static Route Check

```ts
// Source: scripts/verify-static/metadata-jsonld-verifier.ts and scripts/social-previews/manifest.ts
const maybeTarget = maybeSocialPreviewTargetForRoutePath(routePath);
const expectedImage = maybeTarget ?? SOCIAL_PREVIEW_FALLBACK_IMAGE;

if (maybeTarget) {
  const maybeManifestEntry = manifestEntryByRoutePath.get(routePath);

  if (!maybeManifestEntry || maybeManifestEntry.assetPath !== maybeTarget.assetPath) {
    throw new Error(`Social preview manifest did not match ${routePath}.`);
  }
}
```

### Generated Social Preview Budget Shape

```ts
// Source: scripts/verify-release.ts and scripts/social-previews/config.ts
if (file.path.startsWith("social/generated/") && file.path.endsWith(".png")) {
  generatedSocialPreviewBytes.set(file.path, file.byteLength);
}
```

### Aggregate Verify Order Guard

```ts
// Source: scripts/release-readiness.test.ts
expect(packageJson.scripts.verify).toBe(
  "bun run format:check && bun run check && bun run typecheck && bun run test && bun run verify:curation && bun run verify:no-github-runtime && bun run verify:project-helper-surface && bun run verify:visual-system && bun run verify:social-previews && bun run build && bun run verify:browser && bun run verify:static && bun run verify:release",
);
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|---|---|---|---|
| Generic fallback social image for most route metadata | Covered project, writing, theme, and route-family pages use generated static preview assets; generic pages keep fallback. [VERIFIED: .planning/PROJECT.md; src/domain/seo.ts] | Phase 26 completed 2026-06-21. [VERIFIED: .planning/STATE.md] | Static verification must distinguish covered generated images from generic fallback images. [VERIFIED: scripts/verify-static/metadata-jsonld-verifier.ts] |
| Social image generation outside release evidence | `verify:social-previews` runs before `build` in aggregate `verify`. [VERIFIED: package.json] | Phase 25/26 integration. [VERIFIED: .planning/STATE.md] | Stale generated previews fail before static HTML is built. [VERIFIED: package.json; local command output 2026-06-22] |
| Freshness as either live check or nothing | Offline freshness report classifies `release blocker`, `needs review`, and `manual smoke`. [VERIFIED: scripts/freshness/report.ts; scripts/generate-freshness-report.ts] | Phase 27 completed 2026-06-22. [VERIFIED: .planning/STATE.md] | Local release gates stay deterministic while maintainers still get review prompts. [VERIFIED: docs/release-readiness.md; local command output 2026-06-22] |
| Release labels mixed with manual obligations | Automated labels and manual checklist labels are separate helper outputs. [VERIFIED: scripts/release-readiness.ts] | v1.1 through Phase 27. [VERIFIED: .planning/PROJECT.md; scripts/release-readiness.ts] | Phase 28 should add social preview labels only where backed by local checks. [VERIFIED: .planning/phases/28-verification-and-release-contract/28-CONTEXT.md] |

**Deprecated/outdated:**

- Dynamic Open Graph endpoints, API routes, edge/serverless functions, and runtime image generation are out of scope for v1.5. [VERIFIED: .planning/REQUIREMENTS.md]
- Live external-link release gates and hosted social crawler validation inside `bun run verify` are out of scope for v1.5. [VERIFIED: .planning/REQUIREMENTS.md]
- Manually maintained route-to-image maps are out of scope for v1.5. [VERIFIED: .planning/REQUIREMENTS.md]
- Prominent OpenLinks branding or primary CTA changes are out of scope for v1.5. [VERIFIED: .planning/REQUIREMENTS.md; openlinks-identity-presence skill]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|---|---|---|

All claims in this research are sourced from local repository files, local command output, the npm registry version checks, or the loaded OpenLinks skill guidance; no `[ASSUMED]` claims are intentionally used. [VERIFIED: sources listed below]

## Open Questions

1. **Exact total generated social preview budget threshold**
   - What we know: 13 generated PNGs total 753,663 bytes and every current generated PNG is below 250 KiB. [VERIFIED: public/social/generated/manifest.json; local `find ... stat` output 2026-06-22]
   - What's unclear: The phase context requires a total budget but does not lock an exact total threshold. [VERIFIED: .planning/phases/28-verification-and-release-contract/28-CONTEXT.md]
   - Recommendation: Add an explicit `maxTotalSocialPreviewPngBytes` constant near `maxSocialPreviewPngBytes`, set it with documented headroom above the current 753,663-byte baseline, and test both per-image and total violations. [VERIFIED: scripts/social-previews/config.ts; scripts/verify-release.ts]

2. **Where to house manifest static checks**
   - What we know: `metadata-jsonld-verifier.ts` already owns route metadata/image local asset assertions, while `manifest.ts` owns stable manifest shape. [VERIFIED: scripts/verify-static/metadata-jsonld-verifier.ts; scripts/social-previews/manifest.ts]
   - What's unclear: The exact helper name/module split is delegated to implementation. [VERIFIED: .planning/phases/28-verification-and-release-contract/28-CONTEXT.md]
   - Recommendation: Keep manifest assertions adjacent to `assertMetadataImageMapsToLocalAsset()` unless the helper grows enough to justify a small `social-preview-manifest-verifier.ts`. [VERIFIED: scripts/verify-static/metadata-jsonld-verifier.ts; standards/core/code-shape.md]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|---|---|---:|---|---|
| Bun | All package scripts and clean-builder release command | Yes | Local `1.3.9`; repo pin `1.3.14` | Use repo-pinned `BUN_VERSION=1.3.14` on builders; do not change release contract because local binary is older. [VERIFIED: `bun --version`; package.json; docs/release-readiness.md] |
| Node.js | Tool compatibility and npm registry/version checks | Yes | `v24.13.0` | None needed. [VERIFIED: `node --version`] |
| `node_modules` | Local script/test execution | Yes | Present | Run `bun install` if missing on another machine. [VERIFIED: local `test -d node_modules`] |
| Playwright CLI | `verify:browser` | Yes | `1.60.0` | Run `bun run install:browser` if browser binaries are missing. [VERIFIED: `node_modules/.bin/playwright --version`; docs/release-readiness.md] |
| Playwright Chromium cache | Browser release gate | Yes | Multiple local Chromium cache dirs present | Clean builders must run `bun run install:browser`. [VERIFIED: local cache check; docs/release-readiness.md] |
| `.output/public` | `verify:static`, `verify:release`, `report:freshness` | Yes | 16 prerendered routes present | Run `bun run build` first if missing. [VERIFIED: local `.output/public` check; scripts/verify-static/output.ts; scripts/freshness/static-output.ts] |

**Missing dependencies with no fallback:**

- None found for Phase 28 research. [VERIFIED: local environment checks 2026-06-22]

**Missing dependencies with fallback:**

- Local Bun is older than the repo pin; the builder fallback is to pin `BUN_VERSION=1.3.14` as already documented. [VERIFIED: `bun --version`; docs/release-readiness.md]

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---|---|---|
| V2 Authentication | No | The phase does not add authentication or user accounts. [VERIFIED: .planning/REQUIREMENTS.md] |
| V3 Session Management | No | The phase does not add sessions, cookies, or login state. [VERIFIED: .planning/REQUIREMENTS.md] |
| V4 Access Control | No | The phase does not add protected resources or authorization decisions. [VERIFIED: .planning/REQUIREMENTS.md] |
| V5 Input Validation | Yes | Parse and validate boundary inputs such as manifest JSON, static HTML, URLs, external link policy coverage, and generated asset paths before trusting them. [VERIFIED: scripts/social-previews/check-input.ts; scripts/release-readiness.ts; scripts/verify-static/metadata-jsonld-verifier.ts] |
| V6 Cryptography | Yes | Use Node/Bun built-in SHA-256 for fingerprints and checksums; do not hand-roll hashing. [VERIFIED: src/domain/sha256.ts; scripts/social-previews/check-input.ts] |

### Known Threat Patterns for Static Verification Stack

| Pattern | STRIDE | Standard Mitigation |
|---|---|---|
| Visitor-runtime GitHub token or API residue in built output | Information Disclosure | `verify:no-github-runtime`, forbidden output scanners, and release verifier token-like pattern checks. [VERIFIED: scripts/verify-no-github-runtime.ts; scripts/verify-release.ts; scripts/verify-static/config.ts] |
| Remote runtime visual assets or remote fonts in static output | Information Disclosure / Reliability | Static verifier and release verifier reject remote `<img>`, `srcset`, media `src`, and CSS/SVG `url()` patterns. [VERIFIED: scripts/verify-static/sitemap-assets-verifier.ts; scripts/verify-release.ts] |
| Unsafe generated links such as `javascript:` or `data:` | Tampering / XSS | Static verifier rejects unsafe href patterns. [VERIFIED: scripts/verify-static/config.ts; scripts/verify-static.test.ts] |
| Manifest or PNG checksum drift | Tampering | Social preview check mode compares expected rendered outputs, manifest serialization, checksums, dimensions, blank images, orphans, and nondeterminism. [VERIFIED: scripts/social-previews/check.ts; scripts/social-previews/social-previews.test.ts] |
| Overclaimed live/network evidence | Repudiation | Separate automated evidence labels from manual checklist labels and test forbidden wording. [VERIFIED: scripts/release-readiness.ts; scripts/verify-release.test.ts] |

## Verification Commands To Plan

Run these during implementation and before completing Phase 28: [VERIFIED: package.json; local command output 2026-06-22]

```bash
bun run verify:social-previews
bun run test -- scripts/verify-static.test.ts scripts/verify-release.test.ts scripts/release-readiness.test.ts scripts/freshness/freshness.test.ts src/domain/social-previews.test.ts src/domain/project-detail-routes.test.ts src/domain/writing-metadata.test.ts src/domain/portfolio-surfaces.test.ts
bun run build
bun run verify:static
bun run verify:release
bun run report:freshness
```

Use full aggregate verification before declaring the phase complete: [VERIFIED: docs/release-readiness.md]

```bash
bun run install:browser && bun run verify
```

## Sources

### Primary (HIGH confidence)

- `.planning/phases/28-verification-and-release-contract/28-CONTEXT.md` - locked Phase 28 decisions, discretion, deferred scope, code context. [VERIFIED: file read]
- `.planning/REQUIREMENTS.md` - VERIFY-01 through VERIFY-05 and v1.5 out-of-scope boundaries. [VERIFIED: file read]
- `package.json` - aggregate verify order and script surface. [VERIFIED: file read]
- `src/domain/social-previews.ts` and `src/domain/social-previews.test.ts` - route target, fallback, fingerprint, validation, and public filtering contracts. [VERIFIED: file read]
- `src/domain/seo.ts`, `src/domain/project-detail-routes.test.ts`, `src/domain/writing-metadata.test.ts`, `src/domain/portfolio-surfaces.test.ts` - metadata and JSON-LD image parity. [VERIFIED: file read]
- `scripts/social-previews/*` - deterministic manifest, check mode, path guards, renderer config, and generated media findings. [VERIFIED: file read]
- `scripts/verify-static/*` and `scripts/verify-static.test.ts` - static output metadata, JSON-LD, sitemap, assets, residue, and route coverage. [VERIFIED: file read]
- `scripts/verify-release.ts`, `scripts/verify-release.test.ts`, `scripts/release-readiness.ts`, `scripts/release-readiness.test.ts` - release budgets, evidence labels, external-link policy, and docs facts. [VERIFIED: file read]
- `scripts/freshness/*` and `scripts/generate-freshness-report.ts` - offline freshness report classification and manual smoke boundary. [VERIFIED: file read]
- `docs/release-readiness.md` - current release-readiness documentation and clean-builder sequence. [VERIFIED: file read]
- `AGENTS.md`, `AGENTS.bright-builds.md`, `standards/*`, OpenLinks skill files - repo constraints, verification/testing standards, and low-intrusion identity posture. [VERIFIED: file read]

### Secondary (MEDIUM confidence)

- npm registry checks for package latest versions: `vitest`, `@playwright/test`, `@biomejs/biome`, `typescript`, `@resvg/resvg-js`, `@solidjs/start`. [VERIFIED: npm registry]

### Tertiary (LOW confidence)

- None. [VERIFIED: source review]

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - Phase 28 should use existing repo-pinned scripts and packages, and versions were verified from `package.json`, local binaries, and npm registry checks. [VERIFIED: package.json; local command output; npm registry]
- Architecture: HIGH - Existing code already follows functional-core/imperative-shell and helper-derived route patterns. [VERIFIED: standards/core/architecture.md; scripts/social-previews/check.ts; scripts/verify-static/expected-route-text.ts]
- Pitfalls: HIGH - Gaps were identified from current code and local verifier output, not inferred from general ecosystem knowledge. [VERIFIED: scripts/verify-release.ts; scripts/verify-static/metadata-jsonld-verifier.ts; local command output 2026-06-22]

**Research date:** 2026-06-22
**Valid until:** 2026-07-22 for local repo architecture; re-check package registry and local script output if dependency or verification scripts change. [VERIFIED: package.json; .planning/config.json]
