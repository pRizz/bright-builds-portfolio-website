# Phase 25: Deterministic Static Image Generation - Research

**Researched:** 2026-06-21 [VERIFIED: environment current_date]
**Domain:** Bun/TypeScript deterministic SVG-to-PNG generation, static asset manifests, and check-mode verification for social preview PNGs. [VERIFIED: .planning/ROADMAP.md and .planning/phases/25-deterministic-static-image-generation/25-CONTEXT.md]
**Confidence:** HIGH for repo architecture and check strategy; MEDIUM-HIGH for `@resvg/resvg-js` runtime behavior until the dependency is installed and rendered in this checkout. [VERIFIED: codebase inspection, npm registry checks, and @resvg/resvg-js README]

<user_constraints>
## User Constraints (from CONTEXT.md)

The following content is copied verbatim from `.planning/phases/25-deterministic-static-image-generation/25-CONTEXT.md`. [VERIFIED: .planning/phases/25-deterministic-static-image-generation/25-CONTEXT.md]

### Locked Decisions

### Renderer and Template Inputs
- **D-01:** Use a Bun/TypeScript generator script, expected as `scripts/generate-social-previews.ts`, rather than a browser screenshot workflow, dynamic OG endpoint, Python script, hosted service, or visitor-runtime generator.
- **D-02:** Add `@resvg/resvg-js@2.6.2` as the narrow SVG-to-PNG dev dependency recommended by the milestone research.
- **D-03:** Render repo-owned SVG templates to PNG with deterministic template data from `socialPreviewTargets()`.
- **D-04:** Template inputs must be checked in and local. Do not fetch remote images, remote fonts, screenshots, current time, randomness, secrets, runtime services, or host fonts.
- **D-05:** Keep the visual system dark-primary, readable at thumbnail size, and route-aware without adding OpenLinks prominence beyond route-specific OpenLinks content.

### Generated Asset Ownership
- **D-06:** Generated PNGs must write only under `public/social/generated/` using the asset paths already returned by the Phase 24 social preview contract.
- **D-07:** Managed cleanup may remove stale files inside `public/social/generated/` but must never delete or overwrite `public/social/bright-builds-og.png`, icons, sitemap, robots, or unrelated public assets.
- **D-08:** Generated route-family paths and source fingerprints remain helper-derived. Do not add a hand-authored route-to-image map or copied route array.
- **D-09:** Generated PNG files should be checked in so static deploys serve already-reviewed assets and do not rasterize at visitor runtime.

### Manifest and Check Mode
- **D-10:** Write a timestamp-free manifest, expected under `public/social/generated/`, with route path, asset path, dimensions, byte size, source fingerprint, and SHA-256 file checksum for every generated preview.
- **D-11:** The manifest should be deterministically sorted by route or asset path so repeated generation produces stable diffs.
- **D-12:** Add a check mode, expected as `bun run verify:social-previews`, that fails for missing images, stale fingerprints, wrong dimensions, oversized files, blank images, orphaned managed PNGs, manifest drift, and non-deterministic regeneration.
- **D-13:** Add or reuse unit tests for pure manifest/check logic. Keep filesystem and rasterization in a thin script shell.

### Integration With Existing Verification
- **D-14:** Add package scripts for `generate:social-previews` and `verify:social-previews`.
- **D-15:** Wire deterministic social preview verification into the aggregate `bun run verify` before production build.
- **D-16:** Reuse `validateSocialPreviewTargets()` before rendering so data-contract failures stop generation early.
- **D-17:** Keep Phase 26 metadata wiring out of scope. Existing route metadata may still point at the fallback until the next phase changes it.

### the agent's Discretion
- Exact SVG composition, helper names, manifest filename, finding code names, and layout math are delegated to implementation as long as the output is deterministic, readable, local, and covered by tests.
- A contact sheet or review artifact is optional only if it stays cheap and does not distract from the required manifest/check mode.

### Deferred Ideas (OUT OF SCOPE)

- Route-specific Open Graph, Twitter, and JSON-LD metadata wiring is Phase 26.
- Freshness reports over generated media and curated data are Phase 27.
- Expanded release-readiness documentation, release evidence labels, and aggregate static metadata verification are Phase 28 unless needed as a narrow Phase 25 script hook.
- Public gallery/review UI for social cards is future work unless a cheap local-only artifact falls out naturally.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| IMAGE-01 | Maintainer can run a Bun/TypeScript command that deterministically generates 1200x630 PNG social preview images for every social preview target. [VERIFIED: .planning/REQUIREMENTS.md] | Add `scripts/generate-social-previews.ts`, consume `socialPreviewTargets()`, render each target through `@resvg/resvg-js@2.6.2`, and assert every render is 1200x630. [VERIFIED: 25-CONTEXT.md, src/domain/social-previews.ts, npm registry, and @resvg/resvg-js README] |
| IMAGE-02 | Generated images use checked-in template inputs, fonts, and local assets without network fetches, runtime services, host-font dependence, timestamps, randomness, secrets, or visitor-runtime code. [VERIFIED: .planning/REQUIREMENTS.md] | Use repo-owned SVG template functions, a committed font file plus license, `loadSystemFonts: false`, no `fetch`, no `Date`, no `Math.random`, no secret reads, and no route/runtime imports. [VERIFIED: 25-CONTEXT.md and @resvg/resvg-js README] |
| IMAGE-03 | Generated image output is confined to a managed static asset directory and does not delete or overwrite unrelated public assets such as the fallback social image. [VERIFIED: .planning/REQUIREMENTS.md] | Resolve target asset paths into `public/social/generated/`, guard path traversal with `relative()`, and clean only stale managed PNGs under that directory. [VERIFIED: 25-CONTEXT.md and src/domain/social-previews.ts] |
| IMAGE-04 | The generator writes a timestamp-free manifest with route path, asset path, dimensions, byte size, source fingerprint, and file checksum for every generated preview. [VERIFIED: .planning/REQUIREMENTS.md] | Write `public/social/generated/manifest.json` sorted by `assetPath` and store SHA-256 file checksums computed with `node:crypto`. [VERIFIED: 25-CONTEXT.md and Node crypto docs] |
| IMAGE-05 | Image generation check mode fails for missing, stale, wrong-dimension, oversized, blank, orphaned, or non-deterministically regenerated social preview assets. [VERIFIED: .planning/REQUIREMENTS.md] | Make `bun run verify:social-previews` read-only, re-render expected PNGs in memory, compare file hashes and manifest entries, inspect PNG headers, check byte budgets, detect single-color or transparent rendered pixels, list orphan managed PNGs, and render twice per target to detect same-run nondeterminism. [VERIFIED: 25-CONTEXT.md, scripts/verify-static/output.ts, @resvg/resvg-js type definitions, and local codebase inspection] |
</phase_requirements>

## Summary

Phase 25 should implement a deterministic local asset pipeline, not metadata wiring or a dynamic image service. [VERIFIED: 25-CONTEXT.md] The current Phase 24 contract already returns 13 valid targets with 1200x630 dimensions, `/social/generated/{projects|writing|themes}/...-{fingerprint}.png` asset paths, route-specific text, and source fingerprints. [VERIFIED: local Bun probe over src/domain/social-previews.ts on 2026-06-21] The generator should treat that helper as the only route/image inventory. [VERIFIED: 25-CONTEXT.md and .planning/research/PITFALLS.md]

Use `@resvg/resvg-js@2.6.2` as the only new renderer dependency, render repo-owned SVG strings to PNG, load only committed font files with `loadSystemFonts: false`, and write generated PNGs plus `public/social/generated/manifest.json`. [VERIFIED: 25-CONTEXT.md, npm registry, and @resvg/resvg-js README] Keep pure logic in `scripts/social-previews/*` helpers and the file/render effects in `scripts/generate-social-previews.ts`. [VERIFIED: standards/core/architecture.md and 25-CONTEXT.md]

Check mode must be stricter than manifest comparison alone. [VERIFIED: IMAGE-05] It should re-render current targets in memory, compare PNG bytes/checksums against checked-in files and the timestamp-free manifest, inspect dimensions, detect oversized/blank outputs, fail on orphan managed PNGs, and render twice to catch same-run nondeterminism. [VERIFIED: 25-CONTEXT.md, scripts/verify-static/output.ts, @resvg/resvg-js type definitions, and Node crypto docs]

**Primary recommendation:** Build one generation/check script with a pure manifest/check core under `scripts/social-previews/`, commit local SVG/font/template inputs and generated `public/social/generated/*` outputs, add `generate:social-previews` and `verify:social-previews`, and wire `verify:social-previews` into `bun run verify` before `bun run build`. [VERIFIED: 25-CONTEXT.md and package.json]

## Project Constraints (from AGENTS.md)

- Planning and implementation work must load `AGENTS.md`, `AGENTS.bright-builds.md`, `standards-overrides.md`, and relevant standards pages first. [VERIFIED: AGENTS.md and AGENTS.bright-builds.md]
- Business logic should use functional core / imperative shell; pure decisions belong in data-in/data-out functions while filesystem, renderer, and process exits stay in thin shells. [VERIFIED: standards/core/architecture.md]
- Pure code and business logic must have focused unit tests with Arrange, Act, Assert structure unless a test is trivial. [VERIFIED: standards/core/testing.md]
- Internal nullable or optional names should use the `maybe` prefix. [VERIFIED: standards/core/code-shape.md and standards/languages/typescript-javascript.md]
- Prefer early returns over nested conditionals. [VERIFIED: standards/core/code-shape.md]
- Treat functions over roughly 161 lines and files over roughly 628 lines as refactor triggers. [VERIFIED: AGENTS.bright-builds.md and standards/core/code-shape.md]
- In this Bun-friendly TypeScript repository, do not add new Python scripts for repo-owned automation. [VERIFIED: standards/languages/typescript-javascript.md]
- Prefer Bun-owned package and script surfaces for repo automation. [VERIFIED: package.json and standards/languages/typescript-javascript.md]
- Before committing, run relevant repo-native verification and do not commit if it fails. [VERIFIED: standards/core/verification.md]
- The portfolio is dark-primary; user-facing visuals should preserve dark rendering, contrast/readability, and text-overlap safeguards. [VERIFIED: AGENTS.md]
- OpenLinks must remain low-intrusion identity context, not the primary brand for unrelated Bright Builds routes. [VERIFIED: AGENTS.bright-builds.md, openlinks-identity-presence skill, and 25-CONTEXT.md]
- GSD planning artifacts should be written and committed as part of repo history when `commit_docs` is enabled. [VERIFIED: AGENTS.md and .planning/config.json]
- No `.claude/skills/` or `.agents/skills/` project skill directory exists in this checkout. [VERIFIED: local `ls .claude/skills` and `ls .agents/skills` commands]

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Bun | `packageManager` pins `bun@1.3.14`; local CLI is `1.3.9`. [VERIFIED: package.json and `bun --version`] | Run TypeScript generator, tests, and package scripts. [VERIFIED: package.json] | Existing repo scripts use `bun run`, and Bright Builds TS standards prefer Bun for this repo shape. [VERIFIED: package.json and standards/languages/typescript-javascript.md] |
| TypeScript | `6.0.3` in `package.json`. [VERIFIED: package.json] | Type pure manifest/check helpers, renderer inputs, and generator options. [VERIFIED: tsconfig.json] | The repo is strict TypeScript and includes `src`, `scripts`, and `tests` in typechecking. [VERIFIED: tsconfig.json] |
| `@resvg/resvg-js` | Use `2.6.2`; npm `latest` is `2.6.2`, published 2024-03-26, with `next` pointing at `2.7.0-alpha.2`. [VERIFIED: `npm view @resvg/resvg-js version time dist-tags --json`] | Convert deterministic SVG strings to PNG buffers. [VERIFIED: @resvg/resvg-js README] | The locked decision requires this narrow renderer, and its README documents SVG-to-PNG rendering, custom font files, `loadSystemFonts: false`, Bun compatibility, and prebuilt native packages. [VERIFIED: 25-CONTEXT.md and CITED: https://github.com/thx/resvg-js] |
| `node:crypto` | Built-in through Bun/Node. [VERIFIED: local Bun probe and Node crypto docs] | Compute SHA-256 manifest checksums and compare rendered/file bytes. [VERIFIED: 25-CONTEXT.md] | The repo already uses `createHash("sha256")` for source fingerprints, and Node documents `crypto.createHash()`. [VERIFIED: src/domain/social-previews.ts and CITED: https://nodejs.org/api/crypto.html#cryptocreatehashalgorithm-options] |
| Checked-in Inter font asset | Commit an exact TTF or OTF file plus license under a repo-owned social preview asset folder; do not rely on host fonts. [VERIFIED: 25-CONTEXT.md and src/styles/app.css] | Make text layout deterministic while matching the site's existing `Inter` font-family intent. [VERIFIED: src/styles/app.css] | Inter is already named by site CSS, and official Inter sources identify the font as free/open source under SIL OFL 1.1. [VERIFIED: src/styles/app.css and CITED: https://github.com/rsms/inter] |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Vitest | `4.1.7` in `package.json`. [VERIFIED: package.json] | Unit-test pure template, escaping, wrapping, manifest, stale/orphan, and check finding logic. [VERIFIED: package.json and standards/core/testing.md] | Use for `scripts/social-previews/*.test.ts` or an equivalent focused test file. [VERIFIED: existing Vitest tests in src/domain and scripts] |
| Biome | `2.4.15` in `package.json`. [VERIFIED: package.json] | Format/lint TypeScript scripts and tests. [VERIFIED: package.json scripts] | Existing `format:check` and `check` scripts cover `scripts` and `src`. [VERIFIED: package.json] |
| `assertPngDimensions()` pattern | Existing helper in `scripts/verify-static/output.ts`. [VERIFIED: scripts/verify-static/output.ts] | Inspect PNG signature and IHDR width/height without adding an image-size dependency. [VERIFIED: scripts/verify-static/output.ts] | Reuse directly with a suitable root/path or extract a shared `pngDimensionsForFile()` helper if the generator needs path-only checks. [VERIFIED: codebase inspection] |
| `validateSocialPreviewTargets()` | Existing pure helper. [VERIFIED: src/domain/social-previews.ts] | Fail generation early on target contract violations. [VERIFIED: 25-CONTEXT.md] | Call before any render or cleanup. [VERIFIED: D-16 in 25-CONTEXT.md] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `@resvg/resvg-js@2.6.2`. [VERIFIED: 25-CONTEXT.md] | Browser screenshots via Playwright. [VERIFIED: .planning/research/STACK.md] | Rejected by locked decision D-01 and more sensitive to browser/OS/font antialiasing drift. [VERIFIED: 25-CONTEXT.md and .planning/research/PITFALLS.md] |
| Repo-owned SVG template strings. [VERIFIED: 25-CONTEXT.md] | Dynamic OG endpoint or visitor-runtime renderer. [VERIFIED: .planning/REQUIREMENTS.md Out of Scope] | Rejected because the portfolio remains static and generated PNGs should be checked in before deploy. [VERIFIED: .planning/REQUIREMENTS.md and 25-CONTEXT.md] |
| Checked-in font file with `loadSystemFonts: false`. [VERIFIED: 25-CONTEXT.md and @resvg/resvg-js README] | Host fonts, Google Fonts, or package-manager font files in `node_modules`. [VERIFIED: 25-CONTEXT.md] | Rejected because D-04 requires local checked-in template inputs and forbids host fonts or remote fonts. [VERIFIED: 25-CONTEXT.md] |
| `node:crypto` SHA-256. [VERIFIED: src/domain/social-previews.ts and Node docs] | Custom hashes or timestamps. [VERIFIED: 25-CONTEXT.md] | Rejected because manifest checksums must be deterministic and timestamp-free. [VERIFIED: 25-CONTEXT.md] |
| Existing PNG header parser pattern. [VERIFIED: scripts/verify-static/output.ts] | Add `sharp` or a PNG decoder only for dimensions. [VERIFIED: .planning/research/STACK.md] | Rejected because dimensions can be checked from the PNG header already and `sharp` is broader than the phase needs. [VERIFIED: scripts/verify-static/output.ts and .planning/research/STACK.md] |

**Installation:**

```bash
bun add -d @resvg/resvg-js@2.6.2
```

The implementation must also commit the exact font file and license used by the renderer; the generator must not download fonts during generation or verification. [VERIFIED: 25-CONTEXT.md]

**Version verification:** `npm view @resvg/resvg-js version time dist-tags license repository --json` returned `latest: 2.6.2`, `next: 2.7.0-alpha.2`, license `MPL-2.0`, and repository `github.com/yisibl/resvg-js` metadata on 2026-06-21. [VERIFIED: npm registry command]

## Architecture Patterns

### Recommended Project Structure

```text
scripts/
├── generate-social-previews.ts        # Thin CLI shell for generate and --check. [VERIFIED: 25-CONTEXT.md]
└── social-previews/
    ├── config.ts                      # Managed dir, manifest path, per-image budget, font/template paths. [VERIFIED: 25-CONTEXT.md]
    ├── paths.ts                       # Asset-path to public-file resolution and managed-dir guards. [VERIFIED: IMAGE-03]
    ├── template.ts                    # Pure SVG construction, escaping, wrapping, and layout constants. [VERIFIED: standards/core/architecture.md]
    ├── render.ts                      # Narrow Resvg adapter returning PNG bytes, dimensions, pixels, and hash. [VERIFIED: @resvg/resvg-js type definitions]
    ├── manifest.ts                    # Pure manifest entry creation, sorting, JSON serialization, and drift comparison. [VERIFIED: IMAGE-04 and D-13]
    └── check.ts                       # Pure check findings for missing/stale/oversized/blank/orphan/nondeterministic cases. [VERIFIED: IMAGE-05 and D-13]
src/
└── domain/
    └── social-previews.ts             # Existing Phase 24 source of truth for targets. [VERIFIED: src/domain/social-previews.ts]
public/
└── social/
    ├── bright-builds-og.png           # Existing fallback, outside managed cleanup. [VERIFIED: public/social/bright-builds-og.png]
    └── generated/
        ├── manifest.json              # Timestamp-free sorted manifest. [VERIFIED: IMAGE-04]
        ├── projects/*.png             # Generated project/index previews. [VERIFIED: src/domain/social-previews.ts]
        ├── writing/*.png              # Generated writing/index previews. [VERIFIED: src/domain/social-previews.ts]
        └── themes/*.png               # Generated theme/index previews. [VERIFIED: src/domain/social-previews.ts]
```

### Pattern 1: Functional Core, Imperative Shell

**What:** Keep target validation, SVG template generation, manifest shaping, path guarding, and check findings as pure functions; keep file reads/writes, renderer calls, cleanup, and `process.exit()` in `scripts/generate-social-previews.ts` or tiny adapters. [VERIFIED: standards/core/architecture.md and 25-CONTEXT.md]

**When to use:** Use this for every rule that can be tested without rasterization or the filesystem, especially manifest drift, orphan detection, byte-budget findings, route sorting, and SVG escaping. [VERIFIED: D-13 in 25-CONTEXT.md]

**Example:**

```typescript
// Source: standards/core/architecture.md and Phase 25 D-13.
export function socialPreviewManifestEntries(
  renderedPreviews: readonly RenderedSocialPreview[],
): readonly SocialPreviewManifestEntry[] {
  return [...renderedPreviews]
    .map((preview) => ({
      routePath: preview.target.routePath,
      assetPath: preview.target.assetPath,
      width: preview.dimensions.width,
      height: preview.dimensions.height,
      byteSize: preview.png.length,
      sourceFingerprint: preview.target.sourceFingerprint,
      sha256: preview.sha256,
    }))
    .sort((left, right) => left.assetPath.localeCompare(right.assetPath));
}
```

### Pattern 2: Deterministic SVG Template Input

**What:** Build one pure SVG string from `SocialPreviewTarget` data, fixed colors, fixed dimensions, escaped text, deterministic line wrapping, and local font family names. [VERIFIED: src/domain/social-previews.ts and 25-CONTEXT.md]

**When to use:** Use it before `Resvg` so the renderer gets a complete SVG without external CSS, remote images, clocks, or random values. [VERIFIED: D-04 in 25-CONTEXT.md]

**Example:**

```typescript
// Source: @resvg/resvg-js README and Phase 25 D-04.
const resvg = new Resvg(svg, {
  fitTo: { mode: "width", value: SOCIAL_PREVIEW_DIMENSIONS.width },
  font: {
    fontFiles: [socialPreviewFontPath],
    loadSystemFonts: false,
    defaultFontFamily: "Inter",
  },
});

const rendered = resvg.render();
const png = rendered.asPng();
```

### Pattern 3: Generate and Check Share the Same Rendering Path

**What:** `generate` and `--check` should call the same `renderSocialPreviewTarget()` and `manifestForRenderedPreviews()` helpers so check mode proves the real generator, not a parallel implementation. [VERIFIED: D-12 and D-13 in 25-CONTEXT.md]

**When to use:** Use this for missing, stale, manifest drift, wrong-dimension, oversized, blank, orphan, and non-determinism checks. [VERIFIED: IMAGE-05]

**Example:**

```typescript
// Source: Phase 25 D-12.
const firstRender = renderSocialPreviewTarget(target);
const secondRender = renderSocialPreviewTarget(target);

if (firstRender.sha256 !== secondRender.sha256) {
  return {
    code: "nondeterministic-render",
    routePath: target.routePath,
    assetPath: target.assetPath,
  };
}
```

### Pattern 4: Managed Directory Guard

**What:** Convert a target asset path into a `public/social/generated/...` file path only after checking that the resolved path stays under the managed directory. [VERIFIED: IMAGE-03]

**When to use:** Use this before writes, reads, cleanup, and orphan scans. [VERIFIED: D-06 and D-07 in 25-CONTEXT.md]

**Example:**

```typescript
// Source: Phase 25 D-06 and D-07.
export function generatedPublicFilePathForAssetPath(assetPath: string): string {
  const relativeAssetPath = assetPath.replace(/^\//, "");
  const filePath = join("public", relativeAssetPath);
  const managedRoot = join("public", "social", "generated");
  const relativeToManagedRoot = relative(managedRoot, filePath);

  if (relativeToManagedRoot.startsWith("..") || isAbsolute(relativeToManagedRoot)) {
    throw new Error(`Social preview asset escaped managed directory: ${assetPath}`);
  }

  return filePath;
}
```

### Anti-Patterns to Avoid

- **Manifest-only verification:** Comparing files to a committed manifest without re-rendering lets stale or hand-edited PNGs pass when the manifest is edited alongside them. [VERIFIED: IMAGE-05]
- **Cleanup above `public/social/generated/`:** Removing or globbing under `public/social/` can delete the fallback image, icons, sitemap, or robots files. [VERIFIED: D-07 in 25-CONTEXT.md and public file inventory]
- **Separate route-to-image maps:** Any copied route list can drift from `socialPreviewTargets()`. [VERIFIED: D-08 in 25-CONTEXT.md]
- **Build-time hidden mutation:** Running generation as an implicit part of `bun run build` would make builds mutate checked-in assets unpredictably. [VERIFIED: D-09 and D-15 in 25-CONTEXT.md]
- **Host-font fallback:** Omitting `fontFiles` or leaving `loadSystemFonts` enabled weakens deterministic layout across machines. [VERIFIED: D-04 in 25-CONTEXT.md and @resvg/resvg-js README]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| SVG-to-PNG rasterization. [VERIFIED: IMAGE-01] | A custom canvas, browser screenshot workflow, or homegrown PNG encoder. [VERIFIED: 25-CONTEXT.md] | `@resvg/resvg-js@2.6.2`. [VERIFIED: 25-CONTEXT.md and npm registry] | The renderer is locked, supports SVG-to-PNG, custom fonts, Bun, and prebuilt native packages. [CITED: https://github.com/thx/resvg-js] |
| Route/image inventory. [VERIFIED: D-08] | A hand-authored route-to-image map. [VERIFIED: .planning/REQUIREMENTS.md Out of Scope] | `socialPreviewTargets()`. [VERIFIED: src/domain/social-previews.ts] | The Phase 24 helper already covers public project, writing, theme, and index targets with source fingerprints. [VERIFIED: src/domain/social-previews.ts and local Bun probe] |
| Source and file checksums. [VERIFIED: IMAGE-04] | Custom checksum logic or timestamp IDs. [VERIFIED: D-10] | `createHash("sha256")` from `node:crypto`. [VERIFIED: Node docs and src/domain/social-previews.ts] | SHA-256 is already used by the domain contract and avoids custom hash bugs. [VERIFIED: src/domain/social-previews.ts] |
| Font layout determinism. [VERIFIED: D-04] | System font discovery, Google Fonts fetches, or CSS-only font names. [VERIFIED: 25-CONTEXT.md] | Checked-in font file plus `loadSystemFonts: false`. [VERIFIED: @resvg/resvg-js README] | Host fonts and remote fonts make text layout environment-dependent. [VERIFIED: .planning/research/PITFALLS.md] |
| PNG dimension checking. [VERIFIED: IMAGE-05] | A new image processing dependency just to read dimensions. [VERIFIED: package.json has no such dependency] | Existing PNG signature/IHDR parser pattern from `assertPngDimensions()`. [VERIFIED: scripts/verify-static/output.ts] | The repo already checks PNG dimensions without broad image-processing dependencies. [VERIFIED: scripts/verify-static/output.ts] |
| Cleanup safety. [VERIFIED: IMAGE-03] | Ad hoc `rm -rf public/social` or broad glob deletion. [VERIFIED: D-07] | Managed-root path guard plus orphan detection scoped to `public/social/generated/`. [VERIFIED: D-06 and D-07] | The fallback and unrelated public assets must survive generation. [VERIFIED: public file inventory and 25-CONTEXT.md] |

**Key insight:** The hard part is not drawing one image; it is making the generated binary set provably derived from the Phase 24 contract with no hidden runtime, font, route, manifest, or cleanup drift. [VERIFIED: .planning/research/SUMMARY.md and .planning/research/PITFALLS.md]

## Common Pitfalls

### Pitfall 1: Check Mode Trusts the Manifest Instead of the Renderer

**What goes wrong:** A stale or hand-edited PNG passes because the manifest was updated to match the stale file. [VERIFIED: IMAGE-05]

**Why it happens:** Check mode reads only `manifest.json` and file hashes instead of re-rendering expected output from `socialPreviewTargets()`. [VERIFIED: D-12]

**How to avoid:** In `--check`, call the same render path used by generation, compare rendered hash to checked-in file hash and manifest checksum, and compare target source fingerprints. [VERIFIED: 25-CONTEXT.md]

**Warning signs:** `verify:social-previews` never imports `@resvg/resvg-js` or the SVG template helpers. [VERIFIED: package.json currently has no verify:social-previews script]

### Pitfall 2: Cleanup Deletes the Fallback or Public Root Assets

**What goes wrong:** Regeneration removes `public/social/bright-builds-og.png`, icons, `sitemap.xml`, `robots.txt`, or unrelated future public assets. [VERIFIED: D-07 and public file inventory]

**Why it happens:** Cleanup globs from `public/social/` or `public/` instead of `public/social/generated/`. [VERIFIED: D-06 and D-07]

**How to avoid:** Make a single managed-root helper, list only `public/social/generated/**/*.png`, and test cleanup fixtures containing sibling fallback/icon files. [VERIFIED: IMAGE-03 and standards/core/testing.md]

**Warning signs:** Code calls `rmSync("public/social", ...)`, deletes extensions other than managed PNGs/manifest, or writes target paths that do not start with `/social/generated/`. [VERIFIED: 25-CONTEXT.md and src/domain/social-previews.ts]

### Pitfall 3: Host Fonts or Remote Assets Slip Into Rendering

**What goes wrong:** PNG text shifts across machines or generation depends on network availability. [VERIFIED: D-04 and .planning/research/PITFALLS.md]

**Why it happens:** `loadSystemFonts` remains enabled, the SVG references remote URLs, or template code fetches images/fonts. [VERIFIED: @resvg/resvg-js README and 25-CONTEXT.md]

**How to avoid:** Use a committed font file, set `loadSystemFonts: false`, keep SVG self-contained, and add static tests or `rg` checks for `fetch(`, `http`, `Date`, and `Math.random` in the social preview generator subtree. [VERIFIED: 25-CONTEXT.md]

**Warning signs:** Template code contains `fetch`, `https://`, `new Date`, `Date.now`, `Math.random`, `process.env`, or CSS `@import`. [VERIFIED: D-04]

### Pitfall 4: SVG Text Escaping Breaks XML or Drops Route Text

**What goes wrong:** A route title with `&`, `<`, `>`, quotes, slashes, or apostrophes breaks the SVG or disappears from the output. [VERIFIED: existing escaping tests in scripts/verify-static.test.ts and social preview route data]

**Why it happens:** Template strings interpolate raw route text into XML. [VERIFIED: codebase uses explicit HTML escaping helpers for verifier assertions]

**How to avoid:** Centralize XML text/attribute escaping and unit-test angle brackets, ampersands, quotes, and long labels. [VERIFIED: scripts/verify-static.test.ts pattern and standards/core/testing.md]

**Warning signs:** SVG template functions contain `${target.title}` directly in `<text>` or attributes without an escape helper. [VERIFIED: codebase inspection pattern]

### Pitfall 5: Generated Images Are Visually Nonblank but Content-Blank

**What goes wrong:** A dark gradient card renders, but route title/description/labels are missing. [VERIFIED: IMAGE-05 requires blank checks and IMAGE-02 requires template data]

**Why it happens:** Pixel nonblank checks catch only transparent or single-color images, not missing route text. [ASSUMED]

**How to avoid:** Combine a rendered-pixel blank check with unit tests proving `renderSocialPreviewSvg(target)` includes escaped title, description, kicker, and labels. [VERIFIED: D-03, D-12, and D-13]

**Warning signs:** The blank detector is the only test of image content. [VERIFIED: IMAGE-05]

### Pitfall 6: Manifest Sorting or Formatting Causes Diff Churn

**What goes wrong:** Repeated generation changes `manifest.json` ordering or whitespace without source changes. [VERIFIED: D-11]

**Why it happens:** Manifest entries preserve runtime discovery order, filesystem order, or object insertion differences. [VERIFIED: D-11 and .planning/research/PITFALLS.md]

**How to avoid:** Sort manifest entries by `assetPath`, serialize with stable key order, include a trailing newline, and omit timestamps. [VERIFIED: D-10 and D-11]

**Warning signs:** Manifest contains `generatedAt`, `createdAt`, git commit IDs, absolute filesystem paths, or unsorted object dumps. [VERIFIED: D-10]

### Pitfall 7: Aggregate Verify Builds Before Checking Generated Assets

**What goes wrong:** `bun run build` copies stale or missing `public/social/generated/*` into `.output/public` before social preview verification runs. [VERIFIED: D-15]

**Why it happens:** `verify:social-previews` is appended after `build` or left as a manual command only. [VERIFIED: package.json current verify script]

**How to avoid:** Insert `bun run verify:social-previews` before `bun run build` in `package.json` `verify`. [VERIFIED: D-15 and package.json]

**Warning signs:** `package.json` has `... && bun run build && ... && bun run verify:social-previews`. [VERIFIED: package.json current script shape]

### Pitfall 8: Native Renderer Install Is Assumed but Not Proven

**What goes wrong:** The plan passes tests around pure logic but fails when `@resvg/resvg-js` optional native package is installed or loaded on the target machine. [VERIFIED: npm optionalDependencies for @resvg/resvg-js@2.6.2]

**Why it happens:** `@resvg/resvg-js` uses platform-specific optional native packages, and this checkout does not have the dependency installed yet. [VERIFIED: `npm view @resvg/resvg-js@2.6.2 optionalDependencies --json` and `rg @resvg package.json bun.lock`]

**How to avoid:** Add the dependency early, run a tiny render smoke test through `bun run verify:social-previews`, and include clean-builder verification after lockfile update. [VERIFIED: @resvg/resvg-js README and 25-CONTEXT.md]

**Warning signs:** Planner defers all rasterization checks until the last task. [VERIFIED: environment audit]

## Code Examples

Verified patterns from repo-owned and official sources. [VERIFIED: source inspection and cited docs]

### Manifest Types

```typescript
// Source: IMAGE-04 and Phase 25 D-10.
export type SocialPreviewManifestEntry = {
  routePath: string;
  assetPath: string;
  dimensions: { width: 1200; height: 630 };
  byteSize: number;
  sourceFingerprint: string;
  sha256: string;
};

export type SocialPreviewManifest = {
  version: 1;
  entries: readonly SocialPreviewManifestEntry[];
};
```

### Resvg Rendering Adapter

```typescript
// Source: @resvg/resvg-js README and index.d.ts.
import { createHash } from "node:crypto";
import { Resvg } from "@resvg/resvg-js";

export function renderSocialPreviewPng(svg: string): RenderedPng {
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: 1200 },
    font: {
      fontFiles: [socialPreviewFontPath],
      loadSystemFonts: false,
      defaultFontFamily: "Inter",
    },
  });
  const rendered = resvg.render();
  const png = rendered.asPng();

  return {
    png,
    pixels: rendered.pixels,
    dimensions: { width: rendered.width, height: rendered.height },
    sha256: createHash("sha256").update(png).digest("hex"),
  };
}
```

### Blank Image Guard

```typescript
// Source: @resvg/resvg-js index.d.ts exposes RenderedImage.pixels.
export function isSingleColorOrTransparentRgba(pixels: Buffer): boolean {
  if (pixels.length === 0) {
    return true;
  }

  let maybeFirstVisiblePixel: string | null = null;

  for (let index = 0; index < pixels.length; index += 4) {
    const pixel = pixels.subarray(index, index + 4);

    if ((pixel[3] ?? 0) === 0) {
      continue;
    }

    const pixelSignature = pixel.toString("hex");

    if (!maybeFirstVisiblePixel) {
      maybeFirstVisiblePixel = pixelSignature;
      continue;
    }

    if (pixelSignature !== maybeFirstVisiblePixel) {
      return false;
    }
  }

  return true;
}
```

Implementation should name this around the actual finding semantics, for example `isBlankRenderedImage()`; the exact threshold for "content-blank" is a planner/implementation detail and should be tested against the real template. [ASSUMED]

### Check Mode Flow

```typescript
// Source: Phase 25 D-12 and D-16.
export function socialPreviewCheckFindings(inputs: SocialPreviewCheckInputs): readonly Finding[] {
  const validationFindings = validateSocialPreviewTargets(inputs.targets);

  if (validationFindings.length > 0) {
    return validationFindings.map(socialPreviewValidationFindingToCheckFinding);
  }

  return [
    ...missingFileFindings(inputs.expectedFiles),
    ...orphanManagedPngFindings(inputs.managedPngFiles, inputs.expectedFiles),
    ...renderDriftFindings(inputs.renderedPreviews, inputs.fileHashes),
    ...manifestDriftFindings(inputs.expectedManifest, inputs.actualManifest),
    ...dimensionFindings(inputs.renderedPreviews, inputs.fileDimensions),
    ...byteBudgetFindings(inputs.renderedPreviews, inputs.maxBytes),
    ...blankImageFindings(inputs.renderedPreviews),
    ...nondeterministicRenderFindings(inputs.firstRenderHashes, inputs.secondRenderHashes),
  ];
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Browser screenshot social-card generation. [VERIFIED: .planning/research/STACK.md] | Deterministic SVG templates rendered with `@resvg/resvg-js`. [VERIFIED: 25-CONTEXT.md] | Locked for Phase 25 on 2026-06-21. [VERIFIED: 25-CONTEXT.md] | Reduces OS/browser screenshot drift and keeps generation out of visitor runtime. [VERIFIED: .planning/research/PITFALLS.md] |
| One fallback social image for all routes. [VERIFIED: src/domain/seo.ts and scripts/verify-static/metadata-jsonld-verifier.ts] | Generated static assets for Phase 24 social preview targets while fallback remains for generic routes. [VERIFIED: .planning/REQUIREMENTS.md and 25-CONTEXT.md] | v1.5 Phase 24 and Phase 25. [VERIFIED: .planning/STATE.md] | Generated PNGs can exist before Phase 26 metadata starts pointing at them. [VERIFIED: D-17 in 25-CONTEXT.md] |
| Manifest as a timestamped build artifact. [ASSUMED] | Timestamp-free, sorted manifest with route path, asset path, dimensions, byte size, source fingerprint, and SHA-256. [VERIFIED: IMAGE-04 and D-10] | Phase 25 scope. [VERIFIED: .planning/ROADMAP.md] | Repeated generation should produce stable diffs. [VERIFIED: D-11] |

**Deprecated/outdated:**

- Do not use dynamic OG endpoints, API routes, hosted screenshot services, or runtime image generation for this phase. [VERIFIED: .planning/REQUIREMENTS.md Out of Scope and 25-CONTEXT.md]
- Do not make Phase 25 update `src/domain/seo.ts`, JSON-LD image fields, or static metadata assertions except for the narrow aggregate `verify:social-previews` hook. [VERIFIED: D-17 and deferred ideas in 25-CONTEXT.md]
- Do not keep treating `social/bright-builds-og.png` as the only possible social image after this milestone; that current verifier assumption is a Phase 26/28 integration target. [VERIFIED: src/domain/seo.ts, scripts/verify-static/metadata-jsonld-verifier.ts, and .planning/ROADMAP.md]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Pixel-level blank detection can treat fully transparent or single-color rendered output as blank; missing text over a nonblank background needs separate SVG/template tests. [ASSUMED] | Common Pitfalls and Code Examples | Medium; if the planner relies only on pixel checks, content-blank images could pass. |
| A2 | STRIDE labels in the Security Domain are threat-model classifications rather than repo facts. [ASSUMED] | Security Domain | Low; the mitigations are still required by IMAGE-02, IMAGE-03, and IMAGE-05. [VERIFIED: .planning/REQUIREMENTS.md] |
| A3 | A 250 KiB per-generated-PNG threshold is the right initial "oversized" budget for Phase 25 because the existing release verifier uses `250 * 1024` for the fallback social image. [ASSUMED] | Common Pitfalls and Validation | Medium; if visual output needs more bytes, the planner should make the budget explicit and update tests. [VERIFIED: scripts/verify-release.ts] |

## Open Questions (RESOLVED)

1. **Exact committed font file path and checksum**
   - RESOLVED: Use `scripts/social-previews/assets/fonts/InterVariable.ttf` for the renderer font input and `scripts/social-previews/assets/fonts/OFL.txt` for the checked-in license.
   - RESOLVED: The planned SHA-256 for `InterVariable.ttf` is `4989b125924991b90d05b2d16e0e388c48f7d5bb8b30539bbf9c755278d0ccaf`.
   - RESOLVED: The planned SHA-256 for `OFL.txt` is `262481e844521b326f5ecd053e59b98c8b2da78c8ee1bdbb6e8174305e54935a`.
   - Verification path: implementation must run `shasum -a 256` against both files and keep the renderer config pointed at `scripts/social-previews/assets/fonts/InterVariable.ttf` with `loadSystemFonts: false`.

2. **Native renderer clean-builder behavior**
   - RESOLVED: Add `@resvg/resvg-js@2.6.2` in the first implementation slice and include a renderer smoke test before full asset generation.
   - RESOLVED: The smoke test should call `renderSocialPreviewTarget(socialPreviewTargets()[0])`, assert `1200x630`, assert a non-empty PNG, assert a 64-character SHA-256, and assert the rendered pixels are nonblank.
   - Verification path: `bun run test scripts/social-previews/social-previews.test.ts`, `bun run verify:social-previews`, and the final aggregate `bun run verify` prove native loading in this checkout; clean-builder confidence is covered by the aggregate gate after lockfile update and by the committed generated assets.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Bun CLI | Generator and repo scripts. [VERIFIED: package.json] | Yes. [VERIFIED: `command -v bun`] | Local `1.3.9`; package pin `1.3.14`. [VERIFIED: `bun --version` and package.json] | Use local for research; planner should include clean-builder or upgraded-local verification because the pin is newer. [VERIFIED: .planning/research/STACK.md] |
| Node CLI | Tool compatibility and npm checks. [VERIFIED: standards/languages/typescript-javascript.md] | Yes. [VERIFIED: `command -v node`] | `v24.13.0`. [VERIFIED: `node --version`] | Bun runs repo TS scripts. [VERIFIED: package.json] |
| npm CLI | Registry version verification. [VERIFIED: npm view commands] | Yes. [VERIFIED: `command -v npm`] | `11.6.2`. [VERIFIED: `npm --version`] | Not needed during normal generation once `bun.lock` is updated. [VERIFIED: package.json] |
| `@resvg/resvg-js` | SVG-to-PNG rendering. [VERIFIED: 25-CONTEXT.md] | No. [VERIFIED: `rg @resvg package.json bun.lock` returned no matches] | Target `2.6.2`. [VERIFIED: npm registry] | No fallback; renderer is locked by user decision. [VERIFIED: D-02 in 25-CONTEXT.md] |
| Checked-in font asset | Deterministic text layout. [VERIFIED: D-04] | No committed font file found. [VERIFIED: file inventory and `rg font-family`] | Exact file TBD; Inter source/license verified. [VERIFIED: src/styles/app.css and Inter official sources] | No fallback; host fonts are forbidden. [VERIFIED: D-04] |
| `file` CLI | Optional manual PNG inspection. [VERIFIED: local command] | Yes. [VERIFIED: `command -v file`] | macOS system utility. [VERIFIED: `file public/social/bright-builds-og.png`] | Use script-level PNG header checks instead of relying on `file` in automation. [VERIFIED: scripts/verify-static/output.ts] |
| Managed output directory | Generated assets. [VERIFIED: D-06] | Not present yet. [VERIFIED: public file inventory] | `public/social/generated/`. [VERIFIED: D-06] | Generator should create it. [VERIFIED: IMAGE-01 and IMAGE-03] |

**Missing dependencies with no fallback:**

- `@resvg/resvg-js@2.6.2` must be added as a dev dependency. [VERIFIED: 25-CONTEXT.md and package scan]
- A checked-in font file and license must be added before deterministic text rendering can meet D-04. [VERIFIED: 25-CONTEXT.md and file inventory]

**Missing dependencies with fallback:**

- Local Bun is older than the `packageManager` pin, but the planner can still run narrow local checks and include a clean-builder or local Bun upgrade verification step. [VERIFIED: package.json, local `bun --version`, and .planning/research/STACK.md]

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|------------------|
| V2 Authentication | No. [VERIFIED: Phase 25 has no auth requirements in .planning/REQUIREMENTS.md] | No control needed. [VERIFIED: .planning/REQUIREMENTS.md] |
| V3 Session Management | No. [VERIFIED: Phase 25 is a maintainer script and static asset workflow] | No control needed. [VERIFIED: 25-CONTEXT.md] |
| V4 Access Control | Limited. [VERIFIED: generated public assets must derive only from public targets] | Reuse `socialPreviewTargets()` and `validateSocialPreviewTargets()` from Phase 24. [VERIFIED: src/domain/social-previews.ts and D-16] |
| V5 Input Validation | Yes. [VERIFIED: IMAGE-03 and IMAGE-05] | Validate target data, XML-escape template text, guard managed paths, inspect PNG dimensions, and fail on orphan/stale assets. [VERIFIED: src/domain/social-previews.ts and 25-CONTEXT.md] |
| V6 Cryptography | Limited and non-secret. [VERIFIED: IMAGE-04] | Use `node:crypto` SHA-256 for file checksums and deterministic comparison; do not hand-roll crypto. [VERIFIED: Node docs and src/domain/social-previews.ts] |

### Known Threat Patterns for This Stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Path traversal or broad cleanup deletes unrelated public assets. [VERIFIED: IMAGE-03] | Tampering. [ASSUMED] | Resolve paths under `public/social/generated/`, reject escaped paths, and test sibling fallback/icon files survive cleanup. [VERIFIED: D-06 and D-07] |
| Hidden or draft content becomes a checked-in generated PNG. [VERIFIED: SHARE-02 dependency and IMAGE-01] | Information Disclosure. [ASSUMED] | Consume only `socialPreviewTargets()` and run `validateSocialPreviewTargets()` before rendering. [VERIFIED: src/domain/social-previews.ts and D-16] |
| SVG/XML injection through route copy. [VERIFIED: target text is interpolated into templates] | Tampering. [ASSUMED] | Centralize XML text/attribute escaping and unit-test special characters. [VERIFIED: existing escaping test pattern in scripts/verify-static.test.ts] |
| Secret or live-service data enters generated images. [VERIFIED: IMAGE-02] | Information Disclosure. [ASSUMED] | Do not read `process.env`, call `fetch`, use GitHub APIs, or reference remote assets in generator/template code. [VERIFIED: D-04] |
| Native renderer supply-chain drift. [VERIFIED: @resvg/resvg-js optional native packages] | Tampering / Availability. [ASSUMED] | Pin exact package version, commit `bun.lock`, commit generated PNGs, and verify render output locally before build. [VERIFIED: npm registry and D-09] |

## Sources

### Primary (HIGH confidence)

- `.planning/phases/25-deterministic-static-image-generation/25-CONTEXT.md` - locked Phase 25 decisions, boundaries, manifest/check requirements, and deferred scope. [VERIFIED: file read]
- `.planning/REQUIREMENTS.md` - IMAGE-01 through IMAGE-05 and v1.5 out-of-scope requirements. [VERIFIED: file read]
- `.planning/ROADMAP.md` - Phase 25 goal, dependency on Phase 24, and success criteria. [VERIFIED: file read]
- `.planning/STATE.md` - current milestone state and Phase 24 completion context. [VERIFIED: file read]
- `.planning/phases/24-social-image-data-contract/24-CONTEXT.md` and `24-01-SUMMARY.md` - direct dependency decisions and implemented helper surface. [VERIFIED: file read]
- `.planning/research/SUMMARY.md`, `STACK.md`, `FEATURES.md`, `ARCHITECTURE.md`, and `PITFALLS.md` - milestone renderer, architecture, and pitfall guidance. [VERIFIED: file read]
- `src/domain/social-previews.ts` and `src/domain/social-previews.test.ts` - current target contract, validation, 1200x630 dimensions, asset path pattern, and tests. [VERIFIED: file read]
- `scripts/verify-static/output.ts`, `scripts/verify-static/*`, `scripts/verify-release.ts`, and related tests - existing PNG dimension, static verifier, fallback, and budget patterns. [VERIFIED: file read]
- `package.json`, `tsconfig.json`, `vitest.config.ts`, `src/styles/app.css`, and public file inventory - local scripts, toolchain, CSS font family, and public asset state. [VERIFIED: file read and local commands]
- `AGENTS.md`, `AGENTS.bright-builds.md`, `standards/core/architecture.md`, `standards/core/code-shape.md`, `standards/core/testing.md`, `standards/core/verification.md`, and `standards/languages/typescript-javascript.md` - repo workflow and Bright Builds standards. [VERIFIED: file read]
- `@resvg/resvg-js` README - SVG-to-PNG rendering, custom font file options, `loadSystemFonts: false`, Bun compatibility, and prebuilt native package notes. [CITED: https://github.com/thx/resvg-js]
- `@resvg/resvg-js` v2.6.2 type definitions - `Resvg`, `RenderedImage.asPng()`, `RenderedImage.pixels`, width, and height API surface. [CITED: https://raw.githubusercontent.com/thx/resvg-js/v2.6.2/index.d.ts]
- Node.js crypto docs - `crypto.createHash()` digest support. [CITED: https://nodejs.org/api/crypto.html#cryptocreatehashalgorithm-options]
- Inter official GitHub source - Inter license and OFL status. [CITED: https://github.com/rsms/inter]

### Secondary (MEDIUM confidence)

- npm registry checks for `@resvg/resvg-js`, `@fontsource/inter`, `@fontsource-variable/inter`, and `inter-ui` version/license context. [VERIFIED: `npm view ... --json` commands]
- Local environment probes for Bun, Node, npm, `file`, public asset dimensions, and social target count. [VERIFIED: local commands on 2026-06-21]

### Tertiary (LOW confidence)

- None used for implementation recommendations. [VERIFIED: source list]

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH for locked renderer/version and existing Bun/TypeScript/Vitest stack; MEDIUM-HIGH for native renderer execution until installed locally. [VERIFIED: 25-CONTEXT.md, package.json, npm registry, and @resvg/resvg-js README]
- Architecture: HIGH because it follows existing functional-core/script-shell repo patterns and Phase 24 helper contracts. [VERIFIED: standards/core/architecture.md and src/domain/social-previews.ts]
- Pitfalls: HIGH for repo-specific route, manifest, cleanup, and verifier risks; MEDIUM for exact blank-image pixel threshold. [VERIFIED: .planning/research/PITFALLS.md and Assumptions Log]

**Research date:** 2026-06-21 [VERIFIED: environment current_date]
**Valid until:** 2026-07-21 for repo-specific planning, or earlier if `@resvg/resvg-js` releases a new stable version, Phase 24 target shape changes, or the generated asset directory contract changes. [VERIFIED: npm registry current state and .planning/STATE.md]
