# Phase 24: Social Image Data Contract - Research

**Researched:** 2026-06-21 [VERIFIED: system current date]
**Domain:** Pure TypeScript domain contract for route-derived static social preview targets [VERIFIED: .planning/ROADMAP.md]
**Confidence:** HIGH [VERIFIED: codebase inspection of `src/domain/projects.ts`, `src/domain/writing.ts`, `src/domain/themes.ts`, `src/domain/routes.ts`, and `src/domain/seo.ts`]

<user_constraints>
## User Constraints (from CONTEXT.md)

The following content is copied from `.planning/phases/24-social-image-data-contract/24-CONTEXT.md`. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md]

### Locked Decisions

### Route Coverage and Public Filtering
- **D-01:** Add a pure domain module, expected as `src/domain/social-previews.ts`, as the single source of truth for v1.5 share targets.
- **D-02:** The target helper must cover `/projects`, every `projectDetailRoutes()` selected detail route, `/writing`, every `writingDetailRoutes()` public detail route, `/themes`, and every `themeDetailRoutes()` public detail route.
- **D-03:** Target derivation must compose existing helpers instead of duplicating route arrays: `routeByPath` or `siteRoutes` for route-family index records, `projectDetailPageProjects` and `projectDetailPath` for selected project detail pages, `publicWritingEntries` and `writingDetailPath` for writing, and `publicThemeEntries` and `themeDetailPath` for themes.
- **D-04:** Hidden, draft, unsupported, archived, excluded, unselected, no-detail, and otherwise non-public records must be filtered by the existing public helpers. The social preview module should not invent broader visibility rules.

### Target Shape
- **D-05:** Expose a typed `SocialPreviewTarget`-style record with route path, local asset path, title, description, route kind or kicker, labels, route-specific alt text, dimensions, and stable source fingerprint.
- **D-06:** Use explicit route kinds for the contract, expected as `projects-index`, `project`, `writing-index`, `writing`, `themes-index`, and `theme`. Unsupported kinds should fail validation.
- **D-07:** Keep labels short and route-derived. Project targets can use themes/tags/status, writing targets can use kind/topics/tags, theme targets can use audience/proof-point framing, and index targets can use route labels from `siteRoutes`.
- **D-08:** Alt text must be route-specific and descriptive enough to stand on its own in metadata. It must not reuse one generic portfolio fallback string for covered routes.

### Asset Paths and Fingerprints
- **D-09:** Covered-route asset paths should be local, absolute web paths under `/social/generated/`, grouped by route family, for example `/social/generated/projects/openlinks-{digest}.png`, `/social/generated/writing/{slug}-{digest}.png`, and `/social/generated/themes/{slug}-{digest}.png`.
- **D-10:** Use a short deterministic digest derived from the route source payload for cache busting and drift detection. The same source data should produce the same fingerprint and path, while title/description/label/alt changes should change the fingerprint.
- **D-11:** The fingerprint payload should be stable and sorted before hashing so target output does not depend on object insertion order or runtime randomness.
- **D-12:** This phase should not write PNGs or manifests. It should only define the expected paths and fingerprints that Phase 25 will generate from.

### Text Budgets and Validation
- **D-13:** Validation should reject duplicate route paths, duplicate asset paths, missing required text, unsupported route kinds, non-local or non-generated asset paths for covered targets, unsafe path characters, wrong dimensions, and text that exceeds template budgets.
- **D-14:** Use conservative template budgets in the domain contract now so generation cannot silently crop later: non-empty title, description, kicker, labels, and alt text; bounded labels; bounded description; bounded title; and a maximum unbroken-token length to catch impossible wrapping.
- **D-15:** Keep dimensions fixed at 1200x630 for every covered target unless a later implementation phase discovers a compelling crawler/template reason and updates all metadata and verification together.
- **D-16:** Validation should return structured findings suitable for unit tests and future report/verifier consumption, rather than throwing from normal list helpers.

### Fallback Behavior
- **D-17:** Generic routes outside the Phase 24 target set, including `/`, `/about`, `/contact`, unknown route fallbacks, and future non-covered generic routes, keep the checked-in fallback `/social/bright-builds-og.png`.
- **D-18:** The contract may expose a named fallback social image value for later SEO integration, but fallback routes should not be included in the route-specific target list.
- **D-19:** OpenLinks remains low-intrusion identity context. Only OpenLinks-specific routes should produce OpenLinks-specific labels or copy; the generic fallback and unrelated route targets should keep Bright Builds/Peter Ryszkiewicz as the primary brand.

### the agent's Discretion
- Exact TypeScript type names, helper names, finding-code names, and budget constants are delegated to implementation as long as they remain clear, exported where tests need them, and aligned with existing `maybe` naming and functional-core patterns.
- Exact digest length is delegated to implementation, with a preference for a short readable hex digest that is long enough to avoid practical collisions in this small route set.

### Deferred Ideas (OUT OF SCOPE)

- Rendering SVG/PNG previews, adding `@resvg/resvg-js`, writing generated assets, and creating the image manifest are Phase 25 work.
- Wiring Open Graph, Twitter, and JSON-LD image references to generated assets is Phase 26 work.
- Freshness reports and reviewed snapshot policy are Phase 27 work.
- Aggregate release verification and release-readiness documentation updates are Phase 28 work.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SHARE-01 | Maintainer can ask a pure social preview helper for all public share targets covering `/projects`, selected project detail routes, `/writing`, public writing detail routes, `/themes`, and public theme detail routes. [VERIFIED: .planning/REQUIREMENTS.md] | Use `socialPreviewTargets()` in `src/domain/social-previews.ts`, composed from `routeByPath` or `siteRoutes`, `projectDetailPageProjects` plus `projectDetailPath`, `publicWritingEntries` plus `writingDetailPath`, and `publicThemeEntries` plus `themeDetailPath`. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md and codebase inspection] |
| SHARE-02 | Hidden, draft, unsupported, archived, unselected, or otherwise non-public project, writing, and theme records do not create public social preview targets. [VERIFIED: .planning/REQUIREMENTS.md] | Reuse existing public selectors instead of adding visibility rules. Current tests already prove project, writing, and theme exclusion behavior. [VERIFIED: `src/domain/project-detail-routes.test.ts`, `src/domain/writing.test.ts`, `src/domain/themes.test.ts`] |
| SHARE-03 | Each social preview target includes route path, local asset path, title, description, route kind or kicker, labels, route-specific alt text, dimensions, and a stable source fingerprint. [VERIFIED: .planning/REQUIREMENTS.md] | Define an exported discriminated `SocialPreviewTarget` record plus constants for dimensions, fallback image, route kinds, and text budgets. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md] |
| SHARE-04 | Social preview validation fails for duplicate routes or asset paths, missing required text, non-local asset paths, unsafe path characters, unsupported route kinds, and text that cannot fit the template rules. [VERIFIED: .planning/REQUIREMENTS.md] | Implement `validateSocialPreviewTargets()` as a pure finding-returning helper, not a throwing list helper. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md] |
| SHARE-05 | Generic routes outside the v1.5 share target set keep the checked-in fallback social image instead of requiring route-specific generated images. [VERIFIED: .planning/REQUIREMENTS.md] | Export the fallback image contract, but keep `/`, `/about`, `/contact`, unknown route fallbacks, and future generic routes out of `socialPreviewTargets()`. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md and `src/domain/seo.ts`] |
</phase_requirements>

## Summary

Phase 24 should add one pure TypeScript domain module, `src/domain/social-previews.ts`, that derives social preview targets from existing public route helpers and returns deterministic data only. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md] The current route helpers already expose the exact visibility boundaries needed for the phase: selected project detail pages, published writing entries, public themes, and top-level route records. [VERIFIED: `src/domain/projects.ts`, `src/domain/writing.ts`, `src/domain/themes.ts`, `src/domain/routes.ts`]

The current data set produces 13 Phase 24 covered targets: 3 route-family index routes, 6 selected project detail routes, 2 public writing detail routes, and 2 public theme detail routes. [VERIFIED: local Bun probe over domain helpers on 2026-06-21] The longest current title is 37 characters, the longest current description is 129 characters, and the longest current unbroken token across preview title/description source data is 16 characters. [VERIFIED: local Bun probe over domain helpers on 2026-06-21]

Do not add an image renderer, manifest writer, metadata rewiring, freshness report, release gate, or external dependency in this phase. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md] The phase should make later work possible by exposing stable target paths, source fingerprints, dimensions, route-specific alt text, and structured validation findings. [VERIFIED: .planning/REQUIREMENTS.md]

**Primary recommendation:** Build `src/domain/social-previews.ts` plus `src/domain/social-previews.test.ts`; export pure target derivation, fallback image data, text budget constants, deterministic source fingerprints, and structured validation findings. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md and codebase inspection]

## Project Constraints (from AGENTS.md)

- Read `AGENTS.md`, `AGENTS.bright-builds.md`, `standards-overrides.md`, and relevant standards pages before planning or implementation work. [VERIFIED: AGENTS.md and AGENTS.bright-builds.md]
- Follow functional-core / imperative-shell architecture for business logic; pure business rules belong in data-in/data-out functions while I/O stays in thin adapters. [VERIFIED: standards/core/architecture.md]
- Make illegal states unrepresentable where TypeScript makes that practical. [VERIFIED: standards/core/architecture.md]
- Prefer early returns and guard clauses over nested conditionals. [VERIFIED: standards/core/code-shape.md]
- Prefix internal nullable or optional names with `maybe`, including functions and bindings that can return `null` or `undefined`. [VERIFIED: standards/core/code-shape.md and standards/languages/typescript-javascript.md]
- Treat functions over roughly 161 lines and files over roughly 628 lines as refactor triggers, not hard caps. [VERIFIED: AGENTS.bright-builds.md and standards/core/code-shape.md]
- In Bun-friendly TypeScript repositories, do not add new Python scripts for repo-owned automation. [VERIFIED: standards/languages/typescript-javascript.md]
- Prefer Bun-owned package and script surfaces for this repo. [VERIFIED: package.json and standards/languages/typescript-javascript.md]
- Pure code and business logic must have unit tests; unit tests should cover one concern and delineate Arrange, Act, Assert unless the structure is trivial. [VERIFIED: standards/core/testing.md]
- Before committing, run relevant repo-native verification and do not commit if it fails. [VERIFIED: standards/core/verification.md]
- The site is dark-primary, but Phase 24 should not change UI rendering. [VERIFIED: AGENTS.md and .planning/phases/24-social-image-data-contract/24-CONTEXT.md]
- OpenLinks should remain a low-intrusion identity context and should not replace the Bright Builds/Peter Ryszkiewicz primary brand. [VERIFIED: AGENTS.bright-builds.md, openlinks-identity-presence skill, and .planning/phases/24-social-image-data-contract/24-CONTEXT.md]
- No `.claude/skills/` or `.agents/skills/` project skill directory was found in this repo. [VERIFIED: local `test -d .claude/skills` and `test -d .agents/skills` checks]

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| TypeScript | `6.0.3` in `package.json`; npm registry latest was `6.0.3` with `time.modified = 2026-06-18T13:43:46.502Z`. [VERIFIED: package.json and `npm view typescript version time.modified`] | Define the `SocialPreviewTarget` contract, route-kind union, finding-code union, and helper signatures. [VERIFIED: .planning/REQUIREMENTS.md] | The repo has strict TypeScript enabled and includes `src/**/*`, `scripts/**/*`, and `tests/**/*` in `tsconfig.json`. [VERIFIED: tsconfig.json] |
| Bun | `packageManager` is `bun@1.3.14`; local CLI is `1.3.9`. [VERIFIED: package.json and `bun --version`] | Run TypeScript tests and local probes through the existing repo script surface. [VERIFIED: package.json] | The repo's scripts use `bun run`, and Bright Builds TypeScript guidance prefers Bun for this repo shape. [VERIFIED: package.json and standards/languages/typescript-javascript.md] |
| Vitest | `4.1.7` in `package.json`; npm registry latest was `4.1.9` with `time.modified = 2026-06-15T08:53:15.265Z`. [VERIFIED: package.json and `npm view vitest version time.modified`] | Unit-test pure target derivation, validation findings, path rules, and fingerprint stability. [VERIFIED: standards/core/testing.md and existing `src/domain/*.test.ts`] | Existing domain tests use Vitest and Arrange/Act/Assert comments. [VERIFIED: `src/domain/project-detail-routes.test.ts`, `src/domain/writing.test.ts`, `src/domain/themes.test.ts`] |
| Biome | `2.4.15` in `package.json`; npm registry latest was `2.5.0` with `time.modified = 2026-06-12T12:07:00.520Z`. [VERIFIED: package.json and `npm view @biomejs/biome version time.modified`] | Format and lint the added TypeScript test and domain module. [VERIFIED: package.json scripts] | The repo's `format`, `format:check`, `lint`, and `check` scripts use Biome. [VERIFIED: package.json] |
| `node:crypto` through Bun | Built-in module; a local Bun command successfully imported `createHash` from `node:crypto` and produced a SHA-256 hex digest. [VERIFIED: local Bun probe] | Produce deterministic source fingerprints without adding a hashing dependency. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md] | Node documents `crypto.createHash()` for hash digests, and Bun's local runtime executed the same import path. [CITED: https://nodejs.org/api/crypto.html#cryptocreatehashalgorithm-options] [VERIFIED: local Bun probe] |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| SolidStart / SolidJS | `@solidjs/start@1.3.2`, `solid-js@1.9.13`, `@solidjs/router@0.16.1` in `package.json`; npm registry latest matched those three values on 2026-06-21. [VERIFIED: package.json and `npm view @solidjs/start`, `npm view solid-js`, `npm view @solidjs/router`] | Existing app framework and route build surface. [VERIFIED: package.json] | Phase 24 should not import Solid or route components; keep the social preview module framework-free. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md and standards/core/architecture.md] |
| `@solidjs/meta` | `0.29.4` in `package.json`; npm registry latest was `0.29.4` with `time.modified = 2026-03-17T19:41:59.132Z`. [VERIFIED: package.json and `npm view @solidjs/meta version time.modified`] | Existing metadata rendering dependency for later Phase 26 work. [VERIFIED: package.json and `src/domain/seo.ts`] | Do not touch metadata wiring in Phase 24 except to expose fallback/target data for later consumption. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md] |
| Existing domain helpers | Repo-owned TypeScript modules. [VERIFIED: `src/domain/projects.ts`, `src/domain/writing.ts`, `src/domain/themes.ts`, `src/domain/routes.ts`] | Compose public share target inventory. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md] | Use these as the only source for route-family index, project detail, writing detail, and theme detail targets. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Existing TypeScript types and pure validators. [VERIFIED: package.json and standards/languages/typescript-javascript.md] | Add `zod` or another schema library. [VERIFIED: package.json has no `zod` dependency] | Do not add a dependency for checked-in typed data and pure internal validation in Phase 24; the planner should add targeted TypeScript validation helpers instead. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md] |
| Composing `projectDetailPageProjects`, `publicWritingEntries`, `publicThemeEntries`, and `siteRoutes`. [VERIFIED: codebase inspection] | Maintain a separate social-preview route array. [VERIFIED: .planning/research/SUMMARY.md warns against duplicated route lists] | A second route list can drift from prerendering, sitemap, and public visibility helpers; use helper-derived targets instead. [VERIFIED: .planning/research/ARCHITECTURE.md] |
| `node:crypto` SHA-256 digest. [VERIFIED: local Bun probe and Node docs] | Custom checksum, random IDs, dates, or git commit strings. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md forbids runtime randomness and requires source-derived digest] | Custom or environment-derived identifiers break deterministic source fingerprints; use stable normalized payload plus SHA-256. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md] |
| Pure data contract only. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md] | Add `@resvg/resvg-js` and write PNGs. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md deferred ideas] | Raster generation and manifests are Phase 25; adding them in Phase 24 would violate the phase boundary. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md] |

**Installation:**

```bash
# Phase 24 should add no packages. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md]
```

**Version verification:** Recommended stack versions above were checked with `npm view` where a package exists, and built-in `node:crypto` was checked with a local Bun import probe. [VERIFIED: npm registry commands and local Bun probe]

## Architecture Patterns

### Recommended Project Structure

```text
src/
├── domain/
│   ├── social-previews.ts       # Pure target derivation, fallback constants, fingerprints, validation findings. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md]
│   └── social-previews.test.ts  # Unit tests for route coverage, filtering, validation, and digest stability. [VERIFIED: standards/core/testing.md]
└── domain/
    ├── projects.ts              # Existing selected project detail helper source. [VERIFIED: src/domain/projects.ts]
    ├── writing.ts               # Existing public writing helper source. [VERIFIED: src/domain/writing.ts]
    ├── themes.ts                # Existing public theme helper source. [VERIFIED: src/domain/themes.ts]
    └── routes.ts                # Existing top-level route source. [VERIFIED: src/domain/routes.ts]
```

Do not add `scripts/` files, generated images, manifests, or public assets in this phase. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md]

### Pattern 1: Functional-Core Social Preview Module

**What:** Keep all target derivation and validation as pure data-in/data-out functions. [VERIFIED: standards/core/architecture.md]

**When to use:** Use this pattern for `socialPreviewTargets()`, `socialPreviewTargetForRoutePath()`, `validateSocialPreviewTargets()`, `socialPreviewFallbackImage`, and `sourceFingerprintForSocialPreviewTarget()`. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md]

**Example:**

```typescript
// Source: repo pattern from src/domain/projects.ts, src/domain/writing.ts,
// src/domain/themes.ts, and Bright Builds functional-core standard.
export type SocialPreviewRouteKind =
  | "projects-index"
  | "project"
  | "writing-index"
  | "writing"
  | "themes-index"
  | "theme";

export type SocialPreviewTarget = {
  routePath: string;
  assetPath: string;
  title: string;
  description: string;
  kind: SocialPreviewRouteKind;
  kicker: string;
  labels: readonly string[];
  alt: string;
  dimensions: {
    width: 1200;
    height: 630;
  };
  sourceFingerprint: string;
};
```

### Pattern 2: Compose Existing Public Helpers

**What:** Build the list from existing route-family helpers and selectors, then sort deterministically in route-family order. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md]

**When to use:** Use this for default target derivation and for test fixtures that pass alternative project/writing/theme arrays into existing selectors. [VERIFIED: existing helper signatures in `src/domain/projects.ts`, `src/domain/writing.ts`, and `src/domain/themes.ts`]

**Example:**

```typescript
// Source: src/domain/routes.ts, src/domain/projects.ts, src/domain/writing.ts,
// src/domain/themes.ts.
export function socialPreviewTargets(): readonly SocialPreviewTarget[] {
  return [
    targetForIndexRoute(routeByPath("/projects"), "projects-index"),
    ...projectDetailPageProjects().map(targetForProject),
    targetForIndexRoute(routeByPath("/writing"), "writing-index"),
    ...publicWritingEntries().map(targetForWriting),
    targetForIndexRoute(routeByPath("/themes"), "themes-index"),
    ...publicThemeEntries().map(targetForTheme),
  ];
}
```

### Pattern 3: Stable Source Payload Before Hashing

**What:** Create a normalized payload with fixed key order and sorted label arrays, stringify that payload, then hash it with SHA-256 and truncate the hex digest for filenames. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md and local Bun `node:crypto` probe]

**When to use:** Use this for `sourceFingerprint` and digest-backed `assetPath`. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md]

**Example:**

```typescript
// Source: Node crypto docs and local Bun createHash probe.
import { createHash } from "node:crypto";

function socialPreviewFingerprint(payload: SocialPreviewSourcePayload): string {
  const stablePayload = {
    alt: payload.alt,
    description: payload.description,
    dimensions: payload.dimensions,
    kicker: payload.kicker,
    kind: payload.kind,
    labels: [...payload.labels].sort(),
    routePath: payload.routePath,
    title: payload.title,
  };

  return createHash("sha256")
    .update(JSON.stringify(stablePayload))
    .digest("hex")
    .slice(0, 12);
}
```

### Pattern 4: Validation Returns Findings

**What:** Return a structured list of validation findings rather than throwing from the normal list helper. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md]

**When to use:** Use this for duplicate route/asset checks, required text, unsupported kind, wrong dimensions, unsafe paths, and text budget violations. [VERIFIED: .planning/REQUIREMENTS.md]

**Example:**

```typescript
// Source: Phase 24 context D-13 and D-16.
export type SocialPreviewValidationFinding = {
  code: SocialPreviewValidationFindingCode;
  routePath: string;
  message: string;
};

export function validateSocialPreviewTargets(
  targets: readonly SocialPreviewTarget[] = socialPreviewTargets(),
): readonly SocialPreviewValidationFinding[] {
  return [
    ...duplicateRouteFindings(targets),
    ...duplicateAssetFindings(targets),
    ...targets.flatMap(validateSocialPreviewTarget),
  ];
}
```

### Recommended Text Budgets

Use these Phase 24 constants unless implementation tests reveal a tighter Phase 25 template need. [VERIFIED: local Bun data probe and .planning/phases/24-social-image-data-contract/24-CONTEXT.md]

| Budget | Recommended Value | Evidence |
|--------|-------------------|----------|
| `SOCIAL_PREVIEW_WIDTH` | `1200` | Locked dimension. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md] |
| `SOCIAL_PREVIEW_HEIGHT` | `630` | Locked dimension. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md] |
| `MAX_TITLE_CHARS` | `72` | Current max source title is 37 characters, so 72 leaves growth headroom while catching extreme titles. [VERIFIED: local Bun data probe] |
| `MAX_DESCRIPTION_CHARS` | `160` | Current max source description is 129 characters, so 160 catches excessive summaries before rendering. [VERIFIED: local Bun data probe] |
| `MAX_LABELS` | `4` | The locked context requires bounded labels, and current labels can be selected from route-derived arrays. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md] |
| `MAX_LABEL_CHARS` | `32` | Current route labels and typical tags fit below this threshold in the covered data. [VERIFIED: local domain data inspection] |
| `MAX_UNBROKEN_TOKEN_CHARS` | `28` | Current max unbroken token across preview title/description source data is 16 characters. [VERIFIED: local Bun data probe] |
| `MAX_ALT_CHARS` | `180` | Alt text must be route-specific and metadata-friendly, and Open Graph structured image metadata supports alt text. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md] [CITED: https://ogp.me/] |

### Anti-Patterns to Avoid

- **Parallel route list:** Do not maintain a hand-authored social route array because `prerenderRoutes`, `sitemapRoutes`, and existing static verifier helpers already derive route coverage from domain helpers. [VERIFIED: `src/domain/routes.ts`, `scripts/verify-static/expected-route-text.ts`, and .planning/research/ARCHITECTURE.md]
- **New visibility rules:** Do not reimplement project/writing/theme public filtering inside `social-previews.ts`; compose existing public selectors. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md]
- **Fallback as target:** Do not include `/`, `/about`, `/contact`, or unknown-route fallbacks in `socialPreviewTargets()`. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md]
- **Throwing normal target listing:** Do not make `socialPreviewTargets()` throw for validation failures; use a separate validation function that returns findings. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md]
- **Renderer creep:** Do not add `@resvg/resvg-js`, image files, manifest files, font files, or generator scripts in Phase 24. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Public route discovery | A bespoke social preview slug array. [VERIFIED: .planning/research/SUMMARY.md] | `siteRoutes` or `routeByPath`, `projectDetailPageProjects`, `projectDetailPath`, `publicWritingEntries`, `writingDetailPath`, `publicThemeEntries`, and `themeDetailPath`. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md] | Existing helpers already encode route ordering and public filtering. [VERIFIED: source inspection and existing tests] |
| Visibility filtering | New hidden/draft/archive checks in social preview code. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md] | Existing selectors and helper tests. [VERIFIED: `src/domain/project-detail-routes.test.ts`, `src/domain/writing.test.ts`, `src/domain/themes.test.ts`] | Duplicated filtering can leak hidden or unselected records when domain rules change. [VERIFIED: .planning/research/ARCHITECTURE.md] |
| Fingerprint algorithm | A custom checksum or random/date/git-derived identifier. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md] | `node:crypto` SHA-256 over a stable source payload. [VERIFIED: local Bun probe] [CITED: https://nodejs.org/api/crypto.html#cryptocreatehashalgorithm-options] | The fingerprint must change with source text and stay stable for identical source data. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md] |
| Social image generation | SVG/PNG rendering or manifest writing. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md] | Phase 25 generator. [VERIFIED: .planning/ROADMAP.md] | Phase 24 owns the data contract only. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md] |
| Metadata rewiring | Route component edits or `seo.ts` fallback replacement. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md] | Phase 26 metadata integration. [VERIFIED: .planning/ROADMAP.md] | The current singleton fallback is a later integration point, not a Phase 24 deliverable. [VERIFIED: .planning/ROADMAP.md and `src/domain/seo.ts`] |

**Key insight:** The hard part is not discovering social routes; the hard part is preventing future generator, metadata, and verifier code from inventing their own route/image maps. [VERIFIED: .planning/research/SUMMARY.md and .planning/research/ARCHITECTURE.md]

## Common Pitfalls

### Pitfall 1: Route Drift From Duplicated Lists

**What goes wrong:** A generated image, metadata record, or verifier check uses a route list that differs from prerendering or sitemap coverage. [VERIFIED: .planning/research/ARCHITECTURE.md]

**Why it happens:** A helper is implemented from copied slugs instead of composing `projectDetailRoutes()`, `writingDetailRoutes()`, `themeDetailRoutes()`, and `siteRoutes`. [VERIFIED: .planning/research/SUMMARY.md]

**How to avoid:** Test `socialPreviewTargets().map((target) => target.routePath)` against the expected helper-derived route list. [VERIFIED: existing route coverage pattern in `scripts/verify-static.test.ts`]

**Warning signs:** New arrays named like `socialRoutes`, `projectSocialSlugs`, or `shareTargets` appear with hard-coded slugs outside tests. [VERIFIED: no such arrays in current `rg` scan]

### Pitfall 2: Hidden Content Leakage

**What goes wrong:** Draft, hidden, unsupported, archived, excluded, unselected, or no-detail records get public generated asset paths. [VERIFIED: .planning/REQUIREMENTS.md]

**Why it happens:** Social preview code bypasses public selectors and loops over `curatedProjects`, `curatedWriting`, or `curatedThemes` directly. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md]

**How to avoid:** Use fixture tests that include non-public records and assert only public/selectable records produce targets. [VERIFIED: existing fixture style in `src/domain/project-detail-routes.test.ts`, `src/domain/writing.test.ts`, `src/domain/themes.test.ts`]

**Warning signs:** `social-previews.ts` imports `curatedWriting` or `curatedThemes` for target listing instead of `publicWritingEntries()` or `publicThemeEntries()`. [VERIFIED: current helper names in source files]

### Pitfall 3: Unstable Fingerprints

**What goes wrong:** The same source data produces different fingerprints or paths after object insertion order changes. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md]

**Why it happens:** Code hashes raw objects, unsorted labels, or runtime-derived values. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md]

**How to avoid:** Hash a normalized payload with fixed keys and sorted labels, and test stability by passing equivalent payloads in different object orders. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md]

**Warning signs:** The fingerprint payload includes `Date`, `Math.random`, filesystem stats, git commit strings, or unsorted object spread output. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md]

### Pitfall 4: Fallback Routes Accidentally Become Generated Targets

**What goes wrong:** Home, about, contact, unknown fallback pages, or future generic routes are forced into `/social/generated/`. [VERIFIED: .planning/REQUIREMENTS.md]

**Why it happens:** Code uses every `siteRoutes` record instead of explicitly selecting only `/projects`, `/writing`, and `/themes` index routes. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md]

**How to avoid:** Include an explicit `genericSocialPreviewFallback` export and a test proving generic routes are not in `socialPreviewTargets()`. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md]

**Warning signs:** `socialPreviewTargets()` includes route kinds for `home`, `about`, or `contact`. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md]

### Pitfall 5: OpenLinks Over-Promotion

**What goes wrong:** Generic or unrelated social targets make OpenLinks the primary brand. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md]

**Why it happens:** Labels or alt text are copied from profile identity metadata instead of route-specific project/writing/theme context. [VERIFIED: openlinks-identity-presence skill and `src/domain/profile.ts`]

**How to avoid:** Allow OpenLinks-specific copy only when the route subject is the OpenLinks project or open-identity writing/theme context; otherwise use Bright Builds/Peter Ryszkiewicz plus route-specific content. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md and `src/domain/themes.test.ts`]

**Warning signs:** All targets contain `OpenLinks`, or the generic fallback alt text is reused for covered routes. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md]

## Code Examples

Verified patterns from official or repo-owned sources. [VERIFIED: codebase inspection and cited docs]

### Route Inventory Derivation

```typescript
// Source: src/domain/routes.ts plus Phase 24 D-02 and D-03.
function expectedSocialPreviewRoutePaths(): readonly string[] {
  return [
    "/projects",
    ...projectDetailPageProjects().map(projectDetailPath),
    "/writing",
    ...publicWritingEntries().map(writingDetailPath),
    "/themes",
    ...publicThemeEntries().map(themeDetailPath),
  ];
}
```

### Target Lookup By Route

```typescript
// Source: repo maybe-naming standard and route lookup patterns in projects/writing/themes.
export function maybeSocialPreviewTargetForRoutePath(
  routePath: string,
): SocialPreviewTarget | null {
  return socialPreviewTargets().find((target) => target.routePath === routePath) ?? null;
}
```

### Validation Test Shape

```typescript
// Source: existing Vitest Arrange/Act/Assert tests in src/domain/*.test.ts.
it("rejects duplicate social preview routes", () => {
  // Arrange
  const target = socialPreviewTargets()[0];

  // Act
  const findings = validateSocialPreviewTargets([target, target]);

  // Assert
  expect(findings).toContainEqual(
    expect.objectContaining({
      code: "duplicate-route-path",
      routePath: target.routePath,
    }),
  );
});
```

### Local Asset Path Rule

```typescript
// Source: Phase 24 D-09 and D-13.
const generatedSocialAssetPathPattern =
  /^\/social\/generated\/(?:projects|writing|themes)\/[a-z0-9-]+-[a-f0-9]{12}\.png$/;

function isSafeGeneratedSocialAssetPath(assetPath: string): boolean {
  return generatedSocialAssetPathPattern.test(assetPath);
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| One fallback image for every route. [VERIFIED: `src/domain/seo.ts`] | Route-specific static social preview targets for project, writing, theme, and selected route-family indexes, with fallback retained for generic routes. [VERIFIED: .planning/ROADMAP.md and .planning/REQUIREMENTS.md] | v1.5 Phase 24 planning, 2026-06-21. [VERIFIED: .planning/STATE.md] | Later metadata and generator work can map covered routes to generated assets without changing route components first. [VERIFIED: .planning/research/ARCHITECTURE.md] |
| Hand-edited route PNGs or route-to-image maps. [VERIFIED: .planning/REQUIREMENTS.md Out of Scope] | Pure route-derived target contract and deterministic digest paths. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md] | v1.5 research, 2026-06-21. [VERIFIED: .planning/research/SUMMARY.md] | The image set stays tied to public route helpers and can be checked for drift. [VERIFIED: .planning/research/SUMMARY.md] |
| Dynamic Open Graph endpoints or runtime image generation. [VERIFIED: .planning/REQUIREMENTS.md Out of Scope] | Static pre-generated assets with metadata fields available before hydration. [VERIFIED: .planning/REQUIREMENTS.md and Open Graph protocol docs] | v1.5 research, 2026-06-21. [VERIFIED: .planning/research/SUMMARY.md] | The portfolio keeps a static deployment contract. [VERIFIED: .planning/PROJECT.md embedded in AGENTS.md] |

**Deprecated/outdated:**

- Treating `social/bright-builds-og.png` as the only acceptable metadata asset is current code behavior but becomes an integration target for Phase 26, not a Phase 24 change. [VERIFIED: `src/domain/seo.ts`, `scripts/verify-static/metadata-jsonld-verifier.ts`, and .planning/ROADMAP.md]
- Adding route-specific social images through route component code would violate the existing domain-helper architecture. [VERIFIED: .planning/research/ARCHITECTURE.md and standards/core/architecture.md]

## Assumptions Log

The implementation guidance is verified or cited; the STRIDE labels in the security table are planner-facing threat-model classifications rather than repo facts. [VERIFIED: source review and command outputs from 2026-06-21]

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Public asset path injection is classified as Tampering. [ASSUMED] | Security Domain | Low; mitigation still stands because SHARE-04 requires unsafe path validation. [VERIFIED: .planning/REQUIREMENTS.md] |
| A2 | Hidden/draft target exposure is classified as Information Disclosure. [ASSUMED] | Security Domain | Low; mitigation still stands because SHARE-02 requires non-public records to be excluded. [VERIFIED: .planning/REQUIREMENTS.md] |
| A3 | Duplicate route or asset collisions are classified as Tampering / Denial of Service. [ASSUMED] | Security Domain | Low; mitigation still stands because SHARE-04 requires duplicate rejection. [VERIFIED: .planning/REQUIREMENTS.md] |
| A4 | Reused route alt text is classified as Information Disclosure / Spoofing of content context. [ASSUMED] | Security Domain | Low; mitigation still stands because D-08 requires route-specific alt text. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md] |

## Open Questions

1. **Should exact text budgets be relaxed or tightened after the Phase 25 visual template exists?** [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md delegates exact budget constants]
   - What we know: Phase 24 must define conservative budgets, and current source data fits the recommended budgets. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md and local Bun data probe]
   - What's unclear: The final SVG/PNG template may require stricter limits. [VERIFIED: Phase 25 owns rendering in .planning/ROADMAP.md]
   - Recommendation: Implement the recommended constants now, export them, and make Phase 25 update the same constants if visual generation proves a tighter bound. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md]

2. **Should digest length be 10, 12, or 16 hex characters?** [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md delegates exact digest length]
   - What we know: The current route set has 13 covered targets. [VERIFIED: local Bun data probe]
   - What's unclear: The user did not lock a specific digest length. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md]
   - Recommendation: Use 12 hex characters for readable filenames and test that identical source payloads produce identical fingerprints. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md]

3. **Should validation findings include severity now?** [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md requires structured findings but does not specify severity]
   - What we know: Phase 24 findings must support unit tests and future report/verifier consumption. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md]
   - What's unclear: Later verifier/report phases may want severity fields. [VERIFIED: .planning/ROADMAP.md]
   - Recommendation: Keep Phase 24 findings minimal with `code`, `routePath`, `message`, and maybe `assetPath`; add severity later only when report/release consumers need it. [VERIFIED: standards/core/code-shape.md and .planning/ROADMAP.md]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Bun CLI | Running existing repo scripts and local TypeScript tests. [VERIFIED: package.json] | Yes. [VERIFIED: `bun --version`] | Local `1.3.9`; package pin `1.3.14`. [VERIFIED: `bun --version` and package.json] | Use local `1.3.9` for Phase 24 unit tests; planner may flag full release verification if a strict Bun pin check appears later. [VERIFIED: package.json and local command] |
| Node CLI | Tool compatibility and npm registry checks. [VERIFIED: standards/languages/typescript-javascript.md] | Yes. [VERIFIED: `node --version`] | `v24.13.0`. [VERIFIED: `node --version`] | Bun can run repo TypeScript scripts where supported. [VERIFIED: package.json] |
| npm CLI | Package version verification. [VERIFIED: npm view commands] | Yes. [VERIFIED: `npm --version`] | `11.6.2`. [VERIFIED: `npm --version`] | Registry checks are not needed during implementation unless adding/updating packages. [VERIFIED: no new packages recommended] |
| `node:crypto` in Bun | Source fingerprints. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md] | Yes. [VERIFIED: local Bun import probe] | Built-in. [VERIFIED: local Bun import probe] | If unavailable, use Node's `node:crypto` through the same import path. [CITED: https://nodejs.org/api/crypto.html#cryptocreatehashalgorithm-options] |
| Vitest | Unit tests. [VERIFIED: package.json scripts] | Available as repo dependency. [VERIFIED: package.json] | Repo `4.1.7`; npm latest `4.1.9`. [VERIFIED: package.json and `npm view vitest version`] | Use existing repo version; do not update for Phase 24. [VERIFIED: no dependency update required] |
| Biome | Format/lint verification. [VERIFIED: package.json scripts] | Available as repo dependency. [VERIFIED: package.json] | Repo `2.4.15`; npm latest `2.5.0`. [VERIFIED: package.json and `npm view @biomejs/biome version`] | Use existing repo version; do not update for Phase 24. [VERIFIED: no dependency update required] |

**Missing dependencies with no fallback:**

- None found for Phase 24. [VERIFIED: environment commands and no-new-dependency recommendation]

**Missing dependencies with fallback:**

- Local Bun is older than the repo package-manager pin, but Phase 24 can still run pure TypeScript unit tests with the available local Bun. [VERIFIED: `bun --version`, package.json, and local Bun import probe]

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|------------------|
| V2 Authentication | No. [VERIFIED: Phase 24 has no auth, user accounts, or session requirements in .planning/REQUIREMENTS.md] | No control needed. [VERIFIED: .planning/REQUIREMENTS.md] |
| V3 Session Management | No. [VERIFIED: Phase 24 is a pure domain data contract] | No control needed. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md] |
| V4 Access Control | Limited. [VERIFIED: public filtering is a Phase 24 requirement] | Compose existing public selectors and test non-public exclusions. [VERIFIED: SHARE-02 and existing domain tests] |
| V5 Input Validation | Yes. [VERIFIED: SHARE-04 requires validation failures for unsafe paths, missing text, unsupported kinds, and text-fit violations] | Use TypeScript route-kind unions, pure validation findings, local path regex checks, text budget constants, and duplicate detection. [VERIFIED: .planning/REQUIREMENTS.md] |
| V6 Cryptography | Limited and non-security. [VERIFIED: fingerprint is for cache busting/drift, not authentication or integrity security] | Use `node:crypto` SHA-256 for deterministic non-secret fingerprints; do not hand-roll hashes. [VERIFIED: local Bun probe] [CITED: https://nodejs.org/api/crypto.html#cryptocreatehashalgorithm-options] |

### Known Threat Patterns for This Stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Public asset path injection through unsafe slugs or asset paths. [VERIFIED: SHARE-04] | Tampering. [ASSUMED] | Validate absolute local paths under `/social/generated/` and reject path traversal, protocol URLs, query strings, fragments, spaces, and unsupported characters. [VERIFIED: .planning/REQUIREMENTS.md] |
| Hidden/draft content exposure through generated target inventory. [VERIFIED: SHARE-02] | Information Disclosure. [ASSUMED] | Compose public selectors and test fixtures with non-public records. [VERIFIED: existing domain test patterns] |
| Duplicate route or asset path collision. [VERIFIED: SHARE-04] | Tampering / Denial of Service. [ASSUMED] | Return structured duplicate findings from validation and fail unit tests for collisions. [VERIFIED: .planning/REQUIREMENTS.md] |
| Metadata alt text reused across unrelated covered routes. [VERIFIED: D-08] | Information Disclosure / Spoofing of content context. [ASSUMED] | Generate route-specific alt text from route title/kicker/content and test that covered routes do not reuse the generic fallback alt string. [VERIFIED: .planning/phases/24-social-image-data-contract/24-CONTEXT.md] |

## Sources

### Primary (HIGH confidence)

- `.planning/phases/24-social-image-data-contract/24-CONTEXT.md` - locked user decisions, phase boundary, deferred scope, helper names, target shape, fallback behavior, and validation requirements. [VERIFIED: file read]
- `.planning/REQUIREMENTS.md` - SHARE-01 through SHARE-05 acceptance requirements and v1.5 out-of-scope boundaries. [VERIFIED: file read]
- `.planning/ROADMAP.md` - Phase 24 goal, dependencies, success criteria, and later phase boundaries. [VERIFIED: file read]
- `.planning/STATE.md` - current milestone state and recent decisions. [VERIFIED: file read]
- `.planning/research/SUMMARY.md`, `.planning/research/FEATURES.md`, `.planning/research/ARCHITECTURE.md` - milestone-level architecture direction and watch-outs. [VERIFIED: file read]
- `AGENTS.md`, `AGENTS.bright-builds.md`, `standards/core/architecture.md`, `standards/core/code-shape.md`, `standards/core/testing.md`, `standards/core/verification.md`, `standards/languages/typescript-javascript.md` - repo workflow and Bright Builds standards. [VERIFIED: file read]
- `src/domain/projects.ts`, `src/domain/writing.ts`, `src/domain/themes.ts`, `src/domain/routes.ts`, `src/domain/seo.ts` - existing public route, visibility, fallback metadata, and helper surfaces. [VERIFIED: file read]
- `src/domain/project-detail-routes.test.ts`, `src/domain/writing.test.ts`, `src/domain/themes.test.ts`, `src/domain/writing-metadata.test.ts`, `src/domain/portfolio-surfaces.test.ts`, `scripts/verify-static.test.ts` - current test patterns and verified helper behavior. [VERIFIED: file read]
- Node.js crypto docs - `crypto.createHash()` hash digest support. [CITED: https://nodejs.org/api/crypto.html#cryptocreatehashalgorithm-options]
- Open Graph protocol docs - `og:image`, width, height, type, and alt structured properties. [CITED: https://ogp.me/]
- OWASP ASVS project page - ASVS is a web application security verification standard and latest stable project download source. [CITED: https://owasp.org/www-project-application-security-verification-standard/]

### Secondary (MEDIUM confidence)

- npm registry version checks for TypeScript, Vitest, Biome, SolidStart, SolidJS, router, meta, Vite, Vinxi, Playwright, and `@types/bun`. [VERIFIED: `npm view ... version time.modified` commands]
- Local environment probes for Bun, Node, npm, and Bun `node:crypto` import support. [VERIFIED: local commands on 2026-06-21]

### Tertiary (LOW confidence)

- None. [VERIFIED: research source list]

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - Phase 24 adds no dependency, and current package versions plus local tool availability were verified. [VERIFIED: package.json, npm registry commands, and local environment probes]
- Architecture: HIGH - Required helper names, existing public filtering behavior, and functional-core standards were verified in the repo. [VERIFIED: source files and standards files]
- Pitfalls: HIGH - Pitfalls are derived from locked context decisions, milestone research, and current singleton fallback code. [VERIFIED: CONTEXT.md, research files, and `src/domain/seo.ts`]

**Research date:** 2026-06-21 [VERIFIED: system current date]
**Valid until:** 2026-07-21 for Phase 24 code-only planning, unless route helper names or milestone decisions change first. [VERIFIED: codebase-specific scope]
