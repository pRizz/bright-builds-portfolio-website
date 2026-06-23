---
phase: 25-deterministic-static-image-generation
verified: 2026-06-21T17:09:04Z
status: passed
score: "5/5 must-haves verified"
generated_by: gsd-verifier
lifecycle_mode: yolo
phase_lifecycle_id: 25-2026-06-21T16-03-23
generated_at: 2026-06-21T17:09:04Z
lifecycle_validated: true
overrides_applied: 0
---

# Phase 25: Deterministic Static Image Generation Verification Report

**Phase Goal:** Maintainers can deterministically generate and verify static PNG social preview assets from the social preview contract.
**Verified:** 2026-06-21T17:09:04Z
**Status:** passed
**Re-verification:** No - initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
| --- | --- | --- | --- |
| 1 | Maintainer can run a Bun/TypeScript command that generates a 1200x630 PNG for every social preview target. | VERIFIED | `bun run generate:social-previews` printed `Generated 13 social preview PNGs and public/social/generated/manifest.json.` The generated PNG count is exactly 13 and each manifest entry records 1200x630 dimensions. |
| 2 | Generated images use checked-in templates, fonts, and local assets without network fetches, runtime services, host fonts, timestamps, randomness, secrets, or visitor-runtime code. | VERIFIED | Renderer uses `fontFiles: [socialPreviewFontPath]`, `loadSystemFonts: false`, and checked-in `InterVariable.ttf`; scope guards returned no forbidden fetch, remote URL, clock, random, environment, dynamic OG, or API-route patterns. |
| 3 | Generated assets and timestamp-free manifest stay confined to `public/social/generated/` without deleting or overwriting fallback or unrelated public assets. | VERIFIED | Generated files are only under `public/social/generated/`; `test -f public/social/bright-builds-og.png` passed after generation and verification. |
| 4 | Image generation check mode fails for freshness categories and passes for the committed output. | VERIFIED | `bun run verify:social-previews` passed after committed output and after a repeated generation. The check helper covers target validation, missing files, stale fingerprints, checksum drift, manifest drift, wrong dimensions, oversized files, blank renders, orphan managed PNGs, and nondeterministic rerenders. |
| 5 | Aggregate verification runs social preview verification before production build. | VERIFIED | `package.json` contains `bun run verify:visual-system && bun run verify:social-previews && bun run build`; `bun run verify` passed end to end. |

**Score:** 5/5 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
| --- | --- | --- | --- |
| `scripts/social-previews/assets/fonts/InterVariable.ttf` | Checked-in deterministic Inter font input | VERIFIED | File exists and SHA-256 matched `4989b125924991b90d05b2d16e0e388c48f7d5bb8b30539bbf9c755278d0ccaf`. |
| `scripts/social-previews/render.ts` | Resvg adapter using checked-in font and disabled system fonts | VERIFIED | Exports `renderSocialPreviewTarget` and configures checked-in Inter with `loadSystemFonts: false`. |
| `scripts/generate-social-previews.ts` | Bun/TypeScript generate/check CLI | VERIFIED | Imports `socialPreviewTargets()`, `validateSocialPreviewTargets()`, managed path helpers, renderer, manifest helpers, and check helpers. |
| `package.json` | Generate/check scripts and aggregate verify ordering | VERIFIED | `generate:social-previews`, `verify:social-previews`, and the before-build aggregate verify insertion exist. |
| `public/social/generated/manifest.json` | Sorted timestamp-free manifest for 13 generated previews | VERIFIED | Manifest version is 1, has 13 entries, required fields only, SHA-256 values, 12-character source fingerprints, and no timestamp keys. |
| `public/social/generated/` | Generated PNGs for project, writing, and theme targets | VERIFIED | Exactly 13 PNG files exist under managed project, writing, and theme directories. |

### Key Link Verification

| From | To | Via | Status | Details |
| --- | --- | --- | --- | --- |
| `scripts/generate-social-previews.ts` | `src/domain/social-previews.ts` | `socialPreviewTargets()` and `validateSocialPreviewTargets()` | WIRED | CLI derives target set from the Phase 24 contract and validates before writing/checking. |
| `scripts/generate-social-previews.ts` | `scripts/social-previews/paths.ts` | managed path resolution and orphan scan | WIRED | CLI writes expected PNG paths and removes only orphan managed PNGs. |
| `scripts/generate-social-previews.ts` | `scripts/social-previews/manifest.ts` | stable manifest construction and serialization | WIRED | CLI writes `public/social/generated/manifest.json` from rendered previews through the stable serializer. |
| `public/social/generated/manifest.json` | `src/domain/social-previews.ts` | manifest path equality probe | WIRED | Bun probe compared manifest asset paths to `socialPreviewTargets().map((target) => target.assetPath)` and exited 0. |
| `package.json` | `scripts/generate-social-previews.ts` | package scripts | WIRED | `generate:social-previews` and `verify:social-previews` call the CLI in generate and read-only check modes. |

### Data-Flow Trace

| Artifact | Data Variable | Source | Produces Real Data | Status |
| --- | --- | --- | --- | --- |
| `src/domain/social-previews.ts` | `SocialPreviewTarget[]` | Checked-in route, project, writing, and theme registries | Yes - 13 current public targets. | FLOWING |
| `scripts/social-previews/template.ts` | SVG text and layout | `SocialPreviewTarget` route-specific title, description, kicker, labels, and alt text | Yes - renderer smoke test returns nonblank 1200x630 PNG bytes. | FLOWING |
| `scripts/generate-social-previews.ts` | rendered previews | `renderSocialPreviewTarget(target)` | Yes - 13 PNGs written and verified. | FLOWING |
| `public/social/generated/manifest.json` | manifest entries | rendered previews plus target fingerprints | Yes - 13 entries match target asset paths and file checksums. | FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
| --- | --- | --- | --- |
| Generate current social previews | `bun run generate:social-previews` | Generated 13 PNGs and manifest | PASS |
| Verify committed social previews | `bun run verify:social-previews` | Verified 13 deterministic PNGs and manifest entries | PASS |
| Prove repeated generation is stable | `bun run generate:social-previews && bun run verify:social-previews && git diff --exit-code -- public/social/generated` | No generated-output diff | PASS |
| Manifest paths equal target paths | Bun probe importing `socialPreviewTargets()` and reading manifest | Target paths and manifest paths matched exactly | PASS |
| Focused helper tests | `bun run test scripts/social-previews/social-previews.test.ts` | 1 file passed, 9 tests passed | PASS |
| Full release gate | `bun run verify` | format, check, typecheck, unit, curation, no-runtime, helper-surface, visual-system, social-preview, build, browser, static, and release checks passed | PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
| --- | --- | --- | --- | --- |
| IMAGE-01 | `25-02-PLAN.md`, `25-03-PLAN.md` | Maintainer can run a Bun/TypeScript command that deterministically generates 1200x630 PNG previews for every target. | SATISFIED | `generate:social-previews` exists and generated exactly 13 target PNGs. |
| IMAGE-02 | `25-01-PLAN.md`, `25-03-PLAN.md` | Generated images use checked-in local inputs without network/runtime/host-font/time/random/secret dependencies. | SATISFIED | Checked-in Inter font, local SVG template, disabled system fonts, and source guards verified. |
| IMAGE-03 | `25-02-PLAN.md`, `25-03-PLAN.md` | Generated output is confined to managed static asset directory and leaves unrelated public assets alone. | SATISFIED | All generated files are under `public/social/generated/`; fallback image remains present. |
| IMAGE-04 | `25-01-PLAN.md`, `25-02-PLAN.md`, `25-03-PLAN.md` | Generator writes timestamp-free manifest with route path, asset path, dimensions, byte size, fingerprint, and checksum. | SATISFIED | Manifest version 1 has 13 entries with required fields and no timestamp keys. |
| IMAGE-05 | `25-01-PLAN.md`, `25-02-PLAN.md`, `25-03-PLAN.md` | Check mode detects stale/missing/wrong/oversized/blank/orphan/nondeterministic outputs. | SATISFIED | Check helper codes are covered by Vitest and `verify:social-previews` passes for committed output. |

No orphaned Phase 25 requirement IDs were found. `.planning/REQUIREMENTS.md` maps IMAGE-01 through IMAGE-05 to Phase 25, and all five are marked complete.

### Anti-Patterns Found

No blocking anti-patterns found. Source guards found no dynamic OG/API routes, runtime endpoint additions, visitor UI changes, network fetches, remote URLs, clocks, randomness, or environment reads in the social preview generation path.

### Human Verification Required

No human verification required for this deterministic generated-asset phase. Hosted social crawler smoke checks remain later release/manual concerns and are not required to prove Phase 25.

### Gaps Summary

No gaps found. Phase goal achieved. Ready for Phase 26 metadata wiring to reference the reviewed static generated assets.

---

_Verified: 2026-06-21T17:09:04Z_
_Verifier: the agent (gsd-verifier)_
