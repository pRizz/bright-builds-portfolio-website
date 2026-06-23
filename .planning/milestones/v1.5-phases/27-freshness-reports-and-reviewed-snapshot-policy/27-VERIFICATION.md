---
phase: 27-freshness-reports-and-reviewed-snapshot-policy
verified: 2026-06-22T13:05:38Z
status: passed
score: "7/7 must-haves verified"
generated_by: gsd-verifier
lifecycle_mode: yolo
phase_lifecycle_id: 27-2026-06-22T11-58-43
generated_at: 2026-06-22T13:05:38Z
lifecycle_validated: true
overrides_applied: 0
---

# Phase 27: Freshness Reports and Reviewed Snapshot Policy Verification Report

**Phase Goal:** Maintainers can review offline freshness evidence without mutating source data or weakening the static release contract.
**Verified:** 2026-06-22T13:05:38Z
**Status:** passed
**Re-verification:** No - initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Maintainer can run an offline freshness report summarizing generated media drift, GitHub metadata snapshot age and unavailable records, primary link policy coverage, HTTPS issues, and manual smoke targets. | VERIFIED | `package.json:19` defines `report:freshness`; `scripts/generate-freshness-report.ts:37-49` wires social preview and external-link evidence; `:67` reads `github-metadata.snapshot.json`; `:88-110` emits manual smoke findings. `bun run report:freshness` exited 0 and printed release blocker, needs review, and manual smoke sections. |
| 2 | Freshness findings are grouped into exactly `release blocker`, `needs review`, and `manual smoke` severities. | VERIFIED | `scripts/freshness/report.ts:3` defines the exact severity union and `:28` fixes the order. `formatFreshnessReport()` iterates that order at `:50-56`; tests assert the order at `scripts/freshness/freshness.test.ts:211-219`. |
| 3 | Freshness reports do not mutate curated project, writing, theme, profile, GitHub metadata, generated social preview source data, PNGs, or manifests. | VERIFIED | `scripts/generate-freshness-report.ts` imports only `readFileSync` from `node:fs` at `:1`; no forbidden write/network/sync strings were found outside tests. `scripts/social-previews/check-input.ts:25-43` builds read-only check input; generator writes remain isolated in `scripts/generate-social-previews.ts:68-96` and are not imported by the report shell. |
| 4 | Optional live freshness checks, if present, run only through explicit maintainer commands outside `bun run verify`. | VERIFIED | No `freshness:live` or `smoke:hosted` script exists. `package.json:32` keeps `verify` deterministic and excludes `report:freshness`, sync, hosted smoke, and network strings; the inline package guard passed. |
| 5 | Freshness documentation distinguishes reviewed static evidence from hosted crawler validation, live external-link reachability, and current live GitHub state. | VERIFIED | `docs/release-readiness.md:48-60` defines Freshness Reports, says the report is reviewed static evidence, and says it does not prove current live GitHub state, crawl live external links, or run hosted social crawler validation. |
| 6 | Release-readiness document tests enforce the freshness report section and reviewed-static versus live/manual boundary. | VERIFIED | `scripts/release-readiness.ts:99-127` adds required document facts; `scripts/release-readiness.test.ts:161-214` removes each required phrase and expects a finding. Targeted Vitest run passed: 2 files, 37 tests. |
| 7 | Aggregate verify tests prove `bun run verify` does not invoke report, live, hosted, sync, or network command strings. | VERIFIED | `scripts/release-readiness.test.ts:574-597` asserts the exact aggregate verify script and excludes `report:freshness`, `freshness:live`, `smoke:hosted`, `sync:github-metadata`, `api.github.com`, and `github.com/graphql`. |

**Score:** 7/7 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `scripts/freshness/report.ts` | Pure report model, severity grouping, formatting, release blocker predicate | VERIFIED | GSD artifact check passed; exports severity union, order, grouping, formatting, release-finding mapper, and blocker predicate. |
| `scripts/freshness/github-snapshot.ts` | Offline snapshot parser, age summary, unavailable/missing record findings | VERIFIED | GSD artifact check passed; parses boundary JSON at `:41`, defines 30-day threshold at `:7`, and emits age/unavailable/missing/invalid findings. |
| `scripts/freshness/social-previews.ts` | Social preview check finding adapter | VERIFIED | GSD artifact check passed; all social preview finding codes map to generated media release blockers at `:7-17`. |
| `scripts/freshness/static-output.ts` | Read-only `.output/public` route loader and missing-output blocker | VERIFIED | GSD artifact check passed; reads HTML with `readFileSync` and emits `static-output-missing` with build guidance. |
| `scripts/social-previews/check-input.ts` | Shared read-only social preview check input builder | VERIFIED | GSD artifact check passed; reads manifest, generated PNG metadata, render hashes, and orphan path data without writing. |
| `scripts/generate-freshness-report.ts` | Thin Bun stdout report shell and release-blocker exit code | VERIFIED | GSD artifact check passed; composes social, GitHub, static-output, external-link, and manual-smoke evidence and sets `process.exitCode` from release blockers. |
| `package.json` | `report:freshness` script while leaving aggregate verify free of report/live/sync wiring | VERIFIED | GSD artifact check passed; `report:freshness` at `:19`, aggregate `verify` at `:32` excludes report and live/sync commands. |
| `docs/release-readiness.md` | Maintainer freshness report instructions and manual/live boundary | VERIFIED | GSD artifact check passed; Freshness Reports section at `:48-60`. |
| `scripts/release-readiness.ts` | Required document facts for freshness report policy | VERIFIED | GSD artifact check passed; required facts at `:99-127`, document checker at `:352`. |
| `scripts/release-readiness.test.ts` | Doc-contract and aggregate verify exclusion tests | VERIFIED | GSD artifact check passed; negative doc fact tests and aggregate script exclusions are active. |

**Artifacts:** 10/10 verified

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `scripts/generate-freshness-report.ts` | `scripts/social-previews/check-input.ts` | `socialPreviewTargets()`, `validateSocialPreviewTargets()`, `socialPreviewCheckInput()`, `socialPreviewCheckFindings()` | WIRED | GSD key-link check verified pattern; source lines `:37-43` show the call chain. |
| `scripts/generate-freshness-report.ts` | `src/domain/github-metadata.snapshot.json` | `readFileSync` + `JSON.parse` + `maybeParseGitHubMetadataSnapshot` | WIRED | GSD key-link check verified pattern; source lines `:27` and `:67`. |
| `scripts/generate-freshness-report.ts` | `scripts/release-readiness.ts` | `externalLinkFindingsForRoutes()`, `externalLinkPolicies`, `manualReleaseChecklistLabels()` | WIRED | GSD key-link check verified pattern; source lines `:20-22`, `:49`, and `:88-110`. |
| `package.json` | `scripts/generate-freshness-report.ts` | `report:freshness` script only, no aggregate `verify` wiring | WIRED | GSD key-link check verified; package guard command exited 0. |
| `scripts/release-readiness.ts` | `docs/release-readiness.md` | `requiredReleaseReadinessDocumentFacts` patterns for freshness report language | WIRED | GSD key-link check verified; facts at `scripts/release-readiness.ts:99-127`. |
| `scripts/release-readiness.test.ts` | `package.json` | Aggregate release script contract assertions | WIRED | GSD key-link check verified; assertions at `scripts/release-readiness.test.ts:574-597`. |

**Wiring:** 6/6 connections verified

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| `scripts/generate-freshness-report.ts` | `socialPreviewFindings` | `socialPreviewTargets()` plus `socialPreviewCheckInput()` reading generated files and manifest | Yes - uses current target registry, local rendered hashes, PNG metadata, and manifest | FLOWING |
| `scripts/generate-freshness-report.ts` | `gitHubFreshness` | `readFileSync("src/domain/github-metadata.snapshot.json")` -> parser -> `githubSnapshotFreshness()` | Yes - current run reported checked-in unavailable record `btc-vanity-address-finder` | FLOWING |
| `scripts/generate-freshness-report.ts` | `externalLinkFindings` | `readStaticOutputRoutesForFreshness()` -> `.output/public` route HTML -> `externalLinkFindingsForRoutes()` | Yes - `.output/public` currently has 16 HTML files and report emitted no external-link blockers | FLOWING |
| `scripts/release-readiness.ts` | `findings` | `releaseReadinessDocumentFindings()` reads `docs/release-readiness.md` and applies required fact regexes | Yes - checked-in doc returns no findings; fixture removal tests prove failures | FLOWING |
| `scripts/release-readiness.test.ts` | `verifyScript` | Parsed `package.json` scripts | Yes - tests assert exact aggregate script and exclusion list | FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Offline report command runs after static output exists | `bun run report:freshness` | Exited 0; printed `release blocker - None`, one GitHub unavailable `needs review`, and manual smoke prompts | PASS |
| Package script boundary excludes advisory/live/sync/network checks from `verify` | Inline `node -e` package guard | Printed `verify script exclusions pass` | PASS |
| Phase-linked tests prove classifier, docs, and verify boundary behavior | `bun run test scripts/freshness/freshness.test.ts scripts/release-readiness.test.ts` | 2 files passed, 37 tests passed | PASS |
| TypeScript compiles | `bun run typecheck` | Exited 0 | PASS |
| Biome check passes | `bun run check` | Checked 93 files, no fixes applied | PASS |

User-provided automated evidence also recorded `bun run test` passing 22 files / 238 tests, `bun run build` generating `.output/public`, and code review status clean with 0 findings.

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| FRESH-01 | 27-01, 27-02 | Maintainer can run an offline freshness report summarizing generated media drift, GitHub metadata snapshot age/unavailable records, primary link policy coverage, HTTPS issues, and manual smoke targets. | SATISFIED | `report:freshness` exists and ran successfully; CLI composes social preview, GitHub snapshot, external-link policy, static-output, and manual smoke sources. |
| FRESH-02 | 27-01 | Freshness findings are grouped into `release blocker`, `needs review`, and `manual smoke`. | SATISFIED | Severity union/order in `scripts/freshness/report.ts`; formatter and tests prove exact order. |
| FRESH-03 | 27-01 | Freshness reports do not mutate curated data, GitHub metadata, generated social preview source data, PNGs, or manifests. | SATISFIED | Report shell has no write/remove/mkdir/fetch/sync/token strings outside tests; mutating social preview generator remains separate. |
| FRESH-04 | 27-01, 27-02 | Optional live freshness checks, if added, run only through explicit maintainer commands and are not part of `bun run verify`. | SATISFIED | No live freshness commands added; aggregate verify exclusion test and package guard passed. |
| FRESH-05 | 27-02 | Freshness docs distinguish reviewed static evidence from hosted crawler validation, live external-link reachability, and current live GitHub state. | SATISFIED | `docs/release-readiness.md:48-60` contains the required boundary language and tests enforce it. |

**Coverage:** 5/5 requirements satisfied

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| None | - | - | - | No blocker or warning anti-patterns found. Scanner hits were intentional parser `return null` branches, CLI stdout logging, and test-only temporary fixture writes/removals. |

### Test Quality Audit

| Test File | Linked Req | Active | Skipped | Circular | Assertion Level | Verdict |
|-----------|------------|--------|---------|----------|-----------------|---------|
| `scripts/freshness/freshness.test.ts` | FRESH-01, FRESH-02, FRESH-03, FRESH-04 | Active | 0 | No | Value and behavioral assertions for severity mapping, malformed snapshot handling, missing static output, read-only shell strings, and verify exclusions | PASS |
| `scripts/release-readiness.test.ts` | FRESH-04, FRESH-05 | Active | 0 | No | Value and negative-contract assertions for required docs facts and aggregate verify exclusion strings | PASS |

Disabled tests on requirements: 0.
Circular patterns detected: 0. Temporary fixture writes create input documents or HTML route fixtures only; expected values are independent strings/assertions, not generated by the system under test.
Insufficient assertions: 0.

### Human Verification Required

None. This is a non-UI offline CLI/docs phase, and all required behaviors were verified programmatically. The report's own `manual smoke` findings are maintainer release prompts, not additional verification blockers for Phase 27.

### Gaps Summary

No gaps found. Phase goal achieved. Ready to proceed.

## Verification Metadata

**Verification approach:** Goal-backward from ROADMAP success criteria, with PLAN frontmatter must-haves merged as added detail.
**Must-haves source:** ROADMAP Phase 27 success criteria plus 27-01/27-02 PLAN frontmatter.
**Previous verification:** None found.
**Lifecycle provenance:** Validated. CONTEXT, PLAN, SUMMARY, and this VERIFICATION artifact use lifecycle mode `yolo` and lifecycle id `27-2026-06-22T11-58-43`.
**Project guidance applied:** `AGENTS.md`, `AGENTS.bright-builds.md`, `standards-overrides.md`, and relevant Bright Builds architecture, testing, verification, and TypeScript/JavaScript standards.
**Project skills:** No `.claude/skills/` or `.agents/skills/` skill indexes found.
**Automated checks:** 9 passed, 0 failed.
**Human checks required:** 0.

---
*Verified: 2026-06-22T13:05:38Z*
*Verifier: the agent (gsd-verifier)*
