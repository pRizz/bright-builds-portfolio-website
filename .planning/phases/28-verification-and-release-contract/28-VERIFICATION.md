---
phase: 28-verification-and-release-contract
verified: 2026-06-22T16:55:40Z
status: passed
score: "5/5 must-haves verified"
generated_by: gsd-verifier
lifecycle_mode: yolo
phase_lifecycle_id: 28-2026-06-22T15-45-43
generated_at: 2026-06-22T16:55:40Z
lifecycle_validated: true
overrides_applied: 0
---

# Phase 28: Verification and Release Contract Verification Report

**Phase Goal:** The local release gate proves the static social preview, metadata, freshness, and evidence contracts without overclaiming manual or live-network checks.
**Verified:** 2026-06-22T16:55:40Z
**Status:** passed
**Re-verification:** No - initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
| --- | --- | --- | --- |
| 1 | Unit tests cover social preview target derivation, public-only filtering, path uniqueness, fingerprint stability, manifest freshness checks, metadata image selection, JSON-LD image parity, and offline freshness finding classification. | VERIFIED | `bun run test` passed 249 tests across 22 files. Focused Phase 28/supporting coverage passed 129 tests across `src/domain/social-previews.test.ts`, `scripts/social-previews/social-previews.test.ts`, metadata/JSON-LD tests, freshness tests, and release/static verifier tests. |
| 2 | `bun run verify` includes deterministic social preview verification before production build and avoids dynamic OG endpoints, server functions, visitor-runtime GitHub fetches, and live external-link release gates. | VERIFIED | `package.json` has `verify:social-previews` before `build`; release-readiness tests assert exact order and exclude generate/freshness/sync/hosted/network command strings. `bun run verify:no-github-runtime` passed. Source route scan found only static Solid routes, no API route files. |
| 3 | Static output verification checks every covered route's generated HTML, social image metadata, JSON-LD image field, local asset existence, dimensions, manifest consistency, and forbidden runtime residue. | VERIFIED | Fresh `bun run build` prerendered 16 routes. `bun run verify:static` passed and reported metadata, JSON-LD, route coverage, social preview manifest, assets, sitemap, and robots. Manifest assertions compare route path, asset path, dimensions, source fingerprint, byte size, and SHA-256 against copied PNG bytes. |
| 4 | Release verification enforces per-image and total social preview asset budgets and reports only automated evidence labels that actually run locally. | VERIFIED | `bun run verify:release` passed, listed fallback plus all 13 generated PNGs, and reported `generated social preview PNG total: 736.0 KB` under the 1 MiB budget. Evidence labels include `generated social preview asset budgets` and exclude hosted/live/manual claims. |
| 5 | Release-readiness docs explain the generation, verification, freshness report, and manual social-card smoke-check flow while preserving `bun run install:browser && bun run verify`. | VERIFIED | `docs/release-readiness.md` includes exact generation/check commands, static manifest verification, release budgets, freshness boundaries, manual social-card smoke, and clean-builder command. `releaseReadinessDocumentFindings()` tests guard these facts. |

**Score:** 5/5 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
| --- | --- | --- | --- |
| `scripts/verify-static/metadata-jsonld-verifier.ts` | Manifest-aware route metadata, JSON-LD, local PNG, and generated manifest assertions | VERIFIED | Imports social preview helpers, reads `social/generated/manifest.json`, validates covered route entries, and compares copied PNG byte size/SHA. |
| `scripts/verify-static/run-static-verification.ts` | Static verifier summary and route orchestration | VERIFIED | Runs expected route checks, rejects unexpected HTML routes, and names `social preview manifest` coverage. |
| `scripts/verify-static.test.ts` | Import-safe static verifier regression tests | VERIFIED | Covers valid/missing/mismatched manifest entries, byte/SHA drift, unexpected `/stale` route, fallback behavior, and helper-derived route coverage. |
| `scripts/social-previews/config.ts` | Shared generated preview budget constants | VERIFIED | Exports `maxSocialPreviewPngBytes` and `maxTotalSocialPreviewPngBytes`. |
| `scripts/verify-release.ts` | Release budget report, local evidence labels, output residue checks | VERIFIED | Measures `social/generated/**/*.png`, enforces per-image and total generated preview budgets, and scans built output for GitHub/token residue. |
| `scripts/verify-release.test.ts` | Release budget and evidence-label coverage | VERIFIED | Tests generated preview budget reports/violations, local-only evidence labels, and forbidden runtime GitHub/token scanner behavior. |
| `docs/release-readiness.md` | Human release contract and manual smoke boundaries | VERIFIED | Documents generation, read-only verification, static/release checks, freshness report, manual social-card smoke, and clean-builder command. |
| `scripts/release-readiness.ts` | Required document facts and release/manual label helpers | VERIFIED | Enforces release-readiness document facts and external-link policy, including protocol-relative external-link rejection. |
| `scripts/release-readiness.test.ts` | Doc-fact and aggregate verify contract tests | VERIFIED | Tests missing doc facts, exact aggregate order, forbidden live/network strings, and low-intrusion OpenLinks posture. |

### Key Link Verification

| From | To | Via | Status | Details |
| --- | --- | --- | --- | --- |
| `metadata-jsonld-verifier.ts` | `.output/public/social/generated/manifest.json` | Reads `social/generated/manifest.json` under `outputRoot` for covered routes | WIRED | Manual check verified `socialPreviewManifestOutputPath` and `readSocialPreviewManifest()`; `cmp` confirmed public and output manifests match after build. |
| `metadata-jsonld-verifier.ts` | `src/domain/social-previews.ts` | `maybeSocialPreviewTargetForRoutePath(routePath)` | WIRED | Covered-route manifest requirement is conditional on helper-derived social preview targets. |
| `metadata-jsonld-verifier.ts` | `scripts/verify-static/output.ts` | `assertPngDimensions()` | WIRED | Static metadata image checks still assert local PNG dimensions before manifest byte/SHA comparison. |
| `run-static-verification.ts` | `expectedRoutes` and route HTML | `assertRouteHtml()` plus `assertRouteMetadataAndJsonLd()` | WIRED | `verify:static` checks all 16 expected prerendered routes and rejects unexpected HTML routes. |
| `verify-release.ts` | `scripts/social-previews/config.ts` | Shared per-image and total generated preview budgets | WIRED | Release thresholds use `maxSocialPreviewPngBytes` and `maxTotalSocialPreviewPngBytes`. |
| `verify-release.ts` | `.output/public/social/generated/**/*.png` | `releaseFiles()` to `budgetReportForFiles()` | WIRED | Release output listed all 13 generated PNGs and aggregate total. |
| `verify-release.ts` | `scripts/release-readiness.ts` | `automatedReleaseReadinessEvidenceLabels()` | WIRED | Release evidence labels extend only local automated labels; manual/live labels stay separate. |
| `release-readiness.ts` | `docs/release-readiness.md` | `requiredReleaseReadinessDocumentFacts` | WIRED | Doc fact tests remove required phrases and assert findings. |
| `release-readiness.test.ts` | `package.json` | Reads `packageJson.scripts.verify` and asserts exact order/exclusions | WIRED | Manual check verified this despite the gsd-tools literal pattern false negative. |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
| --- | --- | --- | --- | --- |
| `metadata-jsonld-verifier.ts` | social preview target and manifest entry | `maybeSocialPreviewTargetForRoutePath(routePath)` plus copied static manifest and PNG bytes | Yes | FLOWING |
| `run-static-verification.ts` | expected route list | `expectedRoutes`, `htmlFiles(outputRoot)`, route HTML readers | Yes | FLOWING |
| `verify-release.ts` | generated preview budget maps and totals | Real `.output/public` files from `releaseFiles(staticOutputRoot)` | Yes | FLOWING |
| `release-readiness.ts` | required document facts | Reads `docs/release-readiness.md` and checks compiled regex facts | Yes | FLOWING |
| `release-readiness.test.ts` | aggregate verify script | Reads `package.json` at test time | Yes | FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
| --- | --- | --- | --- |
| Focused Phase 28 and supporting unit coverage | `bun run test scripts/verify-static.test.ts scripts/verify-release.test.ts scripts/release-readiness.test.ts src/domain/social-previews.test.ts scripts/social-previews/social-previews.test.ts src/domain/project-detail-routes.test.ts src/domain/writing-metadata.test.ts src/domain/portfolio-surfaces.test.ts scripts/freshness/freshness.test.ts` | 9 files, 129 tests passed | PASS |
| Full Vitest suite | `bun run test` | 22 files, 249 tests passed | PASS |
| TypeScript typecheck | `bun run typecheck` | `tsc --noEmit` passed | PASS |
| Formatting/lint aggregate | `bun run check` and `bun run format:check` | Biome checked 93 files with no fixes | PASS |
| Social preview check mode | `bun run verify:social-previews` | Verified 13 deterministic PNGs and manifest entries | PASS |
| No visitor-runtime GitHub fetch/token surface | `bun run verify:no-github-runtime` | No API, Octokit, or browser token mechanisms found in `src/` | PASS |
| Static build | `bun run build` | Generated `.output/public`, prerendered 16 routes | PASS |
| Static verifier | `bun run verify:static` | Verified 16 routes, metadata, JSON-LD, manifest, assets, sitemap, robots | PASS |
| Release verifier | `bun run verify:release` | Budgets passed; generated preview total 736.0 KB; evidence labels local-only | PASS |
| Browser release checks | `bun run verify:browser` | 83 passed, 19 skipped by configured matrix | PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
| --- | --- | --- | --- | --- |
| VERIFY-01 | 28-01, 28-02 | Unit tests cover target derivation, public filtering, uniqueness, fingerprints, manifest freshness, metadata selection, JSON-LD parity, freshness classification | SATISFIED | Full Vitest suite passed; relevant test files cover each named area. |
| VERIFY-02 | 28-02, 28-03 | Aggregate verify includes social preview check before build and avoids dynamic/live/network gates | SATISFIED | `package.json` exact script and release-readiness tests verify order/exclusions; no API route files found; no runtime GitHub verifier passed. |
| VERIFY-03 | 28-01 | Static output verification checks generated HTML, social metadata, JSON-LD image, local asset, dimensions, manifest consistency, forbidden residue | SATISFIED | `verify:static` passed after fresh build; code verifies manifest route/path/dimensions/fingerprint/byteSize/SHA against copied PNGs. |
| VERIFY-04 | 28-02, 28-03 | Release verification enforces per-image/total social preview budgets and truthful automated evidence labels | SATISFIED | `verify:release` passed with all generated image rows and aggregate total; tests assert labels avoid hosted/live/manual claims. |
| VERIFY-05 | 28-03 | Release-readiness docs explain generation, verification, freshness, manual social-card smoke, clean-builder command | SATISFIED | Docs contain required flow and command; doc-fact tests guard removal. |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
| --- | --- | --- | --- | --- |
| None | - | - | - | Stub scan found only expected CLI `console.log` output and null guards; no TODO/placeholder/stub implementation affecting the phase goal. |

### Human Verification Required

None for Phase 28 goal achievement. Hosted social-card validation, deployed preview/production smoke checks, current live GitHub state, and live external-link reachability are intentionally documented as manual or opt-in release work outside `bun run verify`; the phase requirement is that these boundaries are truthful and guarded.

### Gaps Summary

No blocking gaps found. The three code-review warnings in `28-REVIEW.md` are resolved in code and tests:

- Protocol-relative external links now produce external-link policy/protocol findings.
- Static verification rejects unexpected prerendered HTML routes.
- Static social-preview manifest checks compare copied PNG byte size and SHA-256 in addition to route path, asset path, dimensions, and source fingerprint.

Disconfirmation checks looked for misleading success paths: tests that only used fixtures, evidence labels that overclaimed live/manual work, and review warnings that were documented but not actually wired. The fresh build plus `verify:static`, `verify:release`, package-script tests, and code inspection covered those failure modes.

---

_Verified: 2026-06-22T16:55:40Z_
_Verifier: the agent (gsd-verifier)_
