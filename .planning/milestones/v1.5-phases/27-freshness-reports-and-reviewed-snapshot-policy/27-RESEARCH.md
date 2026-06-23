# Phase 27: Freshness Reports and Reviewed Snapshot Policy - Research

**Researched:** 2026-06-22  
**Domain:** Bun/TypeScript offline release evidence, generated social preview freshness, checked-in GitHub metadata snapshots, and static external-link policy reporting. [VERIFIED: .planning/phases/27-freshness-reports-and-reviewed-snapshot-policy/27-CONTEXT.md] [VERIFIED: package.json]  
**Confidence:** HIGH for local architecture and integration points; MEDIUM for discretionary threshold and command-name recommendations. [VERIFIED: scripts/social-previews/check.ts] [VERIFIED: scripts/release-readiness.ts] [ASSUMED]

<user_constraints>
## User Constraints (from CONTEXT.md)

Copied verbatim from `.planning/phases/27-freshness-reports-and-reviewed-snapshot-policy/27-CONTEXT.md`. [VERIFIED: .planning/phases/27-freshness-reports-and-reviewed-snapshot-policy/27-CONTEXT.md]

### Locked Decisions
## Implementation Decisions

### Offline Report Scope
- **D-01:** Add a read-only offline freshness report as the Phase 27 baseline. The report may print to stdout and may write only to an explicit report/output path if implementation chooses a durable artifact; it must not rewrite source data, snapshots, generated PNGs, manifests, or curated registries.
- **D-02:** The report should summarize generated media drift, GitHub metadata snapshot age, unavailable GitHub metadata records, external-link policy coverage, HTTPS issues, sensitive external query keys, and manual smoke targets.
- **D-03:** Prefer pure finding/classification helpers with a thin Bun/TypeScript command shell. Compose existing social preview, GitHub metadata, release-readiness, and static output helper surfaces instead of copying route lists or reimplementing release checks.
- **D-04:** If the report depends on built static output, it should say so clearly and fail/report cleanly when `.output/public` is missing rather than silently implying hosted evidence.

### Severity Taxonomy
- **D-05:** Use exactly these report severities: `release blocker`, `needs review`, and `manual smoke`.
- **D-06:** Classify deterministic local contract defects as `release blocker`, including generated social preview drift, missing/unreadable manifest, stale fingerprint, checksum drift, wrong dimensions, oversized or blank PNGs, orphaned managed PNGs, nondeterministic rendering, external HTTPS policy failures, sensitive external query keys, and missing required primary external-link/policy coverage.
- **D-07:** Classify reviewed static maintenance signals as `needs review`, including old GitHub metadata snapshot age and checked-in unavailable GitHub metadata records.
- **D-08:** Classify hosted, networked, or current-live-state checks as `manual smoke`, including external-link reachability, social crawler validation, preview/production route smoke checks, and current live GitHub state.
- **D-09:** Do not let report-only `needs review` or `manual smoke` findings become hidden hard release gates in Phase 27.

### Reviewed GitHub Snapshot Policy
- **D-10:** Read `src/domain/github-metadata.snapshot.json` offline and report snapshot age from `syncedAt`.
- **D-11:** Report unavailable records with enough reviewed context for maintainers: `slug`, `repositoryUrl`, `reason`, `httpStatus` when present, `message`, and `syncedAt`.
- **D-12:** Malformed or unreadable checked-in snapshot data may be a `release blocker`; stale-but-readable snapshot age and unavailable repository entries are `needs review`.
- **D-13:** Do not call `scripts/sync-github-metadata.ts` from the offline freshness report. That script remains the explicit mutating/networked refresh path.
- **D-14:** Current live GitHub state belongs only to manual smoke or an explicit opt-in live command outside `bun run verify`.

### Live and Manual Check Boundary
- **D-15:** Keep `bun run verify` deterministic and local. Phase 27 must not add networked external-link reachability, hosted crawler, social debugger, GitHub live-state, or deployed-site checks to the aggregate verifier.
- **D-16:** The freshness report should emit or document a manual smoke matrix derived from existing route/link policy data where practical, instead of duplicating stale checklist copies.
- **D-17:** Optional live freshness checks may be planned only as explicit maintainer commands such as `bun run freshness:live` or `bun run smoke:hosted`, and only if they are clearly documented as advisory and excluded from `bun run verify`.
- **D-18:** Add a guard in tests or verification if needed to prove optional live commands are not invoked by `package.json` `verify`.

### the agent's Discretion
- Exact report command name, output format, helper names, age threshold constants, and whether to write a generated report artifact are delegated to planning/implementation, as long as the result is deterministic by default, read-only for source data, and easy to test.
- Exact manual smoke matrix formatting is delegated to implementation. Prefer clear maintainer output over broad generality.

### Deferred Ideas (OUT OF SCOPE)
## Deferred Ideas

- Scheduled GitHub metadata refreshes in CI remain `FRESH-FUTURE-01`.
- Scheduled live external-link reachability reports remain `FRESH-FUTURE-02`.
- Freshness trend tracking over time remains `FRESH-FUTURE-03`.
- Hosted social-card validator automation remains `SOCIAL-FUTURE-02`.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FRESH-01 | Maintainer can run an offline freshness report that summarizes generated media drift, GitHub metadata snapshot age and unavailable records, primary link policy coverage, HTTPS issues, and manual smoke targets. | Use existing `socialPreviewCheckFindings()`, `gitHubMetadataSnapshot` data, `externalLinkFindingsForRoutes()`, `externalLinkPolicies`, and `manualReleaseChecklistLabels()` as input sources. [VERIFIED: .planning/REQUIREMENTS.md] [VERIFIED: scripts/social-previews/check.ts] [VERIFIED: src/domain/github-metadata.ts] [VERIFIED: scripts/release-readiness.ts] |
| FRESH-02 | Freshness findings are grouped into `release blocker`, `needs review`, and `manual smoke` severities so deterministic blockers are separated from report-only maintenance reminders. | Add a pure classifier that maps existing finding codes and snapshot/manual facts into exactly the three locked severities. [VERIFIED: .planning/REQUIREMENTS.md] [VERIFIED: .planning/phases/27-freshness-reports-and-reviewed-snapshot-policy/27-CONTEXT.md] |
| FRESH-03 | Freshness reports do not mutate curated project, writing, theme, profile, GitHub metadata, or generated social preview source data. | Keep the command as a thin read-only shell, do not import or call `syncGitHubMetadata()` or generator write mode, and add source/behavior tests for the no-mutation boundary. [VERIFIED: .planning/REQUIREMENTS.md] [VERIFIED: scripts/sync-github-metadata.ts] [VERIFIED: scripts/generate-social-previews.ts] |
| FRESH-04 | Optional live freshness checks, if added, run only through explicit maintainer commands and are not part of `bun run verify`. | Recommend no live command in Phase 27 baseline; if one is later added, test `package.json` so `verify` excludes `freshness:live`, `smoke:hosted`, and the networked sync path. [VERIFIED: .planning/REQUIREMENTS.md] [VERIFIED: package.json] [ASSUMED] |
| FRESH-05 | Freshness documentation distinguishes reviewed static evidence from hosted crawler validation, live external-link reachability, and current live GitHub state. | Update `docs/release-readiness.md` and its document-contract tests to name offline reviewed evidence separately from manual hosted/live checks. [VERIFIED: .planning/REQUIREMENTS.md] [VERIFIED: docs/release-readiness.md] [VERIFIED: scripts/release-readiness.test.ts] |
</phase_requirements>

## Project Constraints (from AGENTS.md)

- Use `AGENTS.md` as the repo-local instruction entrypoint, then `AGENTS.bright-builds.md`, `standards-overrides.md` when present, and relevant `standards/` pages. [VERIFIED: AGENTS.md] [VERIFIED: AGENTS.bright-builds.md] [VERIFIED: standards-overrides.md]
- Use GSD planning artifacts and keep workflow state in sync; this research file is the requested GSD artifact for Phase 27. [VERIFIED: AGENTS.md] [VERIFIED: .planning/config.json]
- Prefer functional core / imperative shell: pure data-in/data-out helpers for report findings and a thin Bun script for filesystem, clock, stdout, and exit-code handling. [VERIFIED: AGENTS.bright-builds.md] [VERIFIED: standards/core/architecture.md]
- Parse boundary data into domain types and make illegal states unrepresentable where practical; this applies to JSON snapshot parsing and the fixed severity union. [VERIFIED: standards/core/architecture.md] [VERIFIED: standards/languages/typescript-javascript.md]
- Keep TypeScript/Bun as the script surface; do not add Python scripts to this Bun-friendly repository. [VERIFIED: standards/languages/typescript-javascript.md] [VERIFIED: package.json]
- Prefer composition and plain functions over class inheritance for local business logic. [VERIFIED: standards/languages/typescript-javascript.md]
- Prefix internal nullable values and functions with `maybe` when the value can be `null` or `undefined`. [VERIFIED: standards/core/code-shape.md] [VERIFIED: standards/languages/typescript-javascript.md]
- Use early returns and split large functions when the report workflow starts mixing unrelated concerns. [VERIFIED: standards/core/code-shape.md]
- Unit-test pure code and business logic with focused Arrange, Act, Assert structure. [VERIFIED: standards/core/testing.md] [VERIFIED: scripts/social-previews/social-previews.test.ts]
- Run relevant repo-native verification before commit; the repo aggregate is `bun run verify`, and focused runs can use `bun run test`, `bun run typecheck`, `bun run check`, and targeted Vitest files. [VERIFIED: standards/core/verification.md] [VERIFIED: package.json]
- The portfolio is dark-primary and UI visual verification must include desktop/mobile dark rendering when UI changes occur; Phase 27 is script/docs only unless implementation adds UI, so no browser visual work is required for the baseline report. [VERIFIED: AGENTS.md] [VERIFIED: .planning/phases/27-freshness-reports-and-reviewed-snapshot-policy/27-CONTEXT.md]
- OpenLinks must remain low-intrusion identity context; freshness docs should not make OpenLinks the primary brand or CTA. [VERIFIED: AGENTS.bright-builds.md] [VERIFIED: /Users/peterryszkiewicz/.codex/skills/openlinks-identity-presence/SKILL.md]
- No project-local skill directories were found under `.claude/skills/` or `.agents/skills/`. [VERIFIED: find .claude/skills .agents/skills]

## Summary

Phase 27 should be planned as a small offline reporting layer, not a new verifier, crawler, or GitHub refresh workflow. [VERIFIED: .planning/phases/27-freshness-reports-and-reviewed-snapshot-policy/27-CONTEXT.md] The repo already has nearly all raw evidence sources: social preview drift codes, a timestamp-free generated manifest, a checked-in GitHub metadata snapshot, external-link policy findings over built HTML, automated evidence labels, and manual checklist labels. [VERIFIED: scripts/social-previews/check.ts] [VERIFIED: public/social/generated/manifest.json] [VERIFIED: src/domain/github-metadata.snapshot.json] [VERIFIED: scripts/release-readiness.ts]

The main implementation work is to create a pure freshness finding/classification core, extract or expose the small read-only input adapters needed by that core, and add a thin Bun command that prints a grouped report to stdout. [VERIFIED: standards/core/architecture.md] [VERIFIED: package.json] The report may depend on `.output/public` for external-link policy evidence, but it must say that clearly and report missing static output rather than implying hosted evidence was checked. [VERIFIED: .planning/phases/27-freshness-reports-and-reviewed-snapshot-policy/27-CONTEXT.md] [VERIFIED: docs/release-readiness.md]

The planner should keep `bun run verify` unchanged in Phase 27 unless a narrow guard test must be updated. [VERIFIED: package.json] Freshness age and unavailable GitHub records are reviewed maintenance signals, not release gates. [VERIFIED: .planning/phases/27-freshness-reports-and-reviewed-snapshot-policy/27-CONTEXT.md] Optional live checks should remain deferred unless the implementation has a concrete maintainer command that is explicitly advisory and excluded from `verify`. [VERIFIED: .planning/REQUIREMENTS.md] [CITED: https://docs.github.com/en/rest/using-the-rest-api/best-practices-for-using-the-rest-api?apiVersion=2026-03-10]

**Primary recommendation:** Add `scripts/freshness/` pure helpers plus `scripts/generate-freshness-report.ts`, expose only read-only shared adapters from existing social-preview/static-output code, add `report:freshness`, keep it out of `bun run verify`, and update release-readiness docs/tests to define the reviewed-static versus live/manual boundary. [VERIFIED: package.json] [VERIFIED: scripts/social-previews/check.ts] [VERIFIED: scripts/release-readiness.ts] [ASSUMED]

## Standard Stack

### Core

| Library / Tool | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Bun | `packageManager: bun@1.3.14`; local CLI `1.3.9` | Run TypeScript scripts and package scripts. | Existing repo script surface is Bun, and Phase 27 should add a Bun/TypeScript command instead of another runtime. [VERIFIED: package.json] [VERIFIED: bun --version] |
| TypeScript | `6.0.3` | Strict typed report helpers and fixed severity unions. | Existing repo version; `npm view typescript version` returned `6.0.3` on 2026-06-22. [VERIFIED: package.json] [VERIFIED: npm view typescript] |
| Vitest | pinned `4.1.7`; latest `4.1.9` | Focused unit tests for pure classifiers and no-verify wiring guards. | Existing repo test framework; do not upgrade during this phase because dependency work is out of scope. [VERIFIED: package.json] [VERIFIED: vitest --version] [VERIFIED: npm view vitest] |
| Biome | pinned `2.4.15`; latest `2.5.0` | Format and lint checks. | Existing repo formatter/linter; keep current pin to avoid unrelated lockfile churn. [VERIFIED: package.json] [VERIFIED: biome --version] [VERIFIED: npm view @biomejs/biome] |
| Node filesystem APIs | Node local `v24.13.0` | Read `.output/public`, JSON snapshots, manifests, and package scripts from the Bun command shell. | Existing scripts already use `node:fs`, `node:path`, and `node:crypto`. [VERIFIED: node --version] [VERIFIED: scripts/generate-social-previews.ts] [VERIFIED: scripts/verify-release.ts] |

### Supporting

| Library / Tool | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@resvg/resvg-js` | `2.6.2` | Read-only rerendering input for existing social preview drift checks. | Use indirectly through existing `renderSocialPreviewTarget()` only if the report includes generated media drift in the same way `verify:social-previews` does. [VERIFIED: package.json] [VERIFIED: scripts/social-previews/social-previews.test.ts] [VERIFIED: npm view @resvg/resvg-js] |
| Existing release-readiness helpers | repo-owned | External-link policy, HTTPS, sensitive query, automated labels, manual labels. | Reuse directly for built-output policy coverage and manual smoke targets. [VERIFIED: scripts/release-readiness.ts] |
| Existing GitHub metadata snapshot types | repo-owned | Offline snapshot age and unavailable records. | Use for advisory reviewed evidence; add runtime parsing for malformed/unreadable snapshot handling. [VERIFIED: src/domain/github-metadata.ts] [VERIFIED: src/domain/github-metadata.snapshot.json] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Bun/TypeScript report command | Python, shell, or Node-only script | Rejected because repo standards prohibit new Python scripts in Bun-friendly TS repos and existing scripts are Bun/TS. [VERIFIED: standards/languages/typescript-javascript.md] [VERIFIED: package.json] |
| Existing social preview check helpers | Rebuild a separate image drift checker | Rejected because `socialPreviewCheckFindings()` already returns the exact deterministic drift categories Phase 27 must classify. [VERIFIED: scripts/social-previews/check.ts] [VERIFIED: .planning/phases/27-freshness-reports-and-reviewed-snapshot-policy/27-CONTEXT.md] |
| Existing external-link policy helper | Live external-link crawler | Rejected for Phase 27 because live reachability is manual smoke or future scheduled reporting, not a local gate. [VERIFIED: .planning/REQUIREMENTS.md] [VERIFIED: docs/release-readiness.md] |
| Checked-in snapshot parser | Calling `sync:github-metadata` | Rejected because the offline report must not call the networked/mutating sync script. [VERIFIED: .planning/phases/27-freshness-reports-and-reviewed-snapshot-policy/27-CONTEXT.md] [VERIFIED: scripts/sync-github-metadata.ts] |
| Stdout report | Checked-in generated report artifact | Prefer stdout only for Phase 27 because it avoids artifact churn and still satisfies maintainer review. [VERIFIED: .planning/phases/27-freshness-reports-and-reviewed-snapshot-policy/27-CONTEXT.md] [ASSUMED] |

**Installation:**

No new packages are recommended for Phase 27. [VERIFIED: package.json] If implementation discovers a real need, revisit the stack explicitly instead of adding dependency drift inside the phase. [VERIFIED: AGENTS.md]

```bash
# no install required
```

**Version verification:** Current package data was checked against npm on 2026-06-22. [VERIFIED: npm view typescript] [VERIFIED: npm view vitest] [VERIFIED: npm view @biomejs/biome] [VERIFIED: npm view @resvg/resvg-js] `typescript@6.0.3` is current, `vitest@4.1.7` is not latest because `4.1.9` exists, and `@biomejs/biome@2.4.15` is not latest because `2.5.0` exists. [VERIFIED: npm view typescript] [VERIFIED: npm view vitest] [VERIFIED: npm view @biomejs/biome] The planner should keep existing pins unless Phase 27 is deliberately expanded into dependency maintenance. [ASSUMED]

## Architecture Patterns

### Recommended Project Structure

```text
scripts/
+-- freshness/
|   +-- report.ts              # Pure finding model, severity classifier, grouping, formatting.
|   +-- github-snapshot.ts     # Pure parser/age/unavailable-record findings.
|   +-- social-previews.ts     # Adapter from social preview check findings to freshness findings.
|   +-- freshness.test.ts      # Vitest coverage for classifier/report helpers.
+-- generate-freshness-report.ts # Thin Bun shell: read files, build inputs, print, set exit code.
+-- social-previews/
|   +-- check-input.ts         # Extracted read-only input builder shared by report and generator check.
+-- static-output.ts           # Optional extracted `.output/public` route reader shared by release/report code.
```

This structure follows existing script-helper placement and avoids placing maintainer-only report logic in route components or public domain UI modules. [VERIFIED: scripts/social-previews/check.ts] [VERIFIED: scripts/social-previews/social-previews.test.ts] [VERIFIED: scripts/verify-release.ts]

### Pattern 1: Pure Finding Model

**What:** Represent report rows as typed data with a fixed severity union and machine-readable codes. [VERIFIED: .planning/phases/27-freshness-reports-and-reviewed-snapshot-policy/27-CONTEXT.md]  
**When to use:** Use for every freshness source so stdout formatting, tests, and future docs do not duplicate classification rules. [VERIFIED: standards/core/architecture.md]  
**Example:**

```ts
// Source: Phase 27 decisions and existing ReleaseFinding/SocialPreviewCheckFinding shapes.
// [VERIFIED: .planning/phases/27-freshness-reports-and-reviewed-snapshot-policy/27-CONTEXT.md]
// [VERIFIED: scripts/verify-release.ts]
// [VERIFIED: scripts/social-previews/check.ts]
export type FreshnessSeverity = "release blocker" | "needs review" | "manual smoke";

export type FreshnessFinding = {
  severity: FreshnessSeverity;
  area: "generated media" | "github snapshot" | "external links" | "manual smoke";
  code: string;
  message: string;
  routePath?: string;
  assetPath?: string;
  repositoryUrl?: string;
};
```

### Pattern 2: Boundary Parsers for Snapshot JSON

**What:** Read `src/domain/github-metadata.snapshot.json` in the script shell and parse it into `GitHubMetadataSnapshot` with a small runtime guard before calculating age and unavailable records. [VERIFIED: src/domain/github-metadata.ts] [VERIFIED: standards/core/architecture.md]  
**When to use:** Use when the report must classify malformed or unreadable snapshots as `release blocker` instead of relying on TypeScript's JSON import cast. [VERIFIED: .planning/phases/27-freshness-reports-and-reviewed-snapshot-policy/27-CONTEXT.md]  
**Example:**

```ts
// Source: Existing snapshot type and Phase 27 malformed snapshot policy.
// [VERIFIED: src/domain/github-metadata.ts]
// [VERIFIED: .planning/phases/27-freshness-reports-and-reviewed-snapshot-policy/27-CONTEXT.md]
export function maybeParseGitHubMetadataSnapshot(value: unknown): GitHubMetadataSnapshot | null {
  if (!isRecord(value) || value.schemaVersion !== 1 || typeof value.syncedAt !== "string") {
    return null;
  }

  if (!Array.isArray(value.repositories)) {
    return null;
  }

  return value as GitHubMetadataSnapshot;
}
```

### Pattern 3: Thin Script Shell

**What:** Keep file reads, current clock, stdout, and process exit in `scripts/generate-freshness-report.ts`; pass typed inputs to pure helpers. [VERIFIED: standards/core/architecture.md] [VERIFIED: scripts/generate-social-previews.ts]  
**When to use:** Use for the report command, because FRESH-03 depends on the script being read-only and easy to inspect. [VERIFIED: .planning/REQUIREMENTS.md]  
**Example:**

```ts
// Source: Existing Bun script shape in generate-social-previews.ts.
// [VERIFIED: scripts/generate-social-previews.ts]
import { freshnessReport } from "./freshness/report";

const report = freshnessReport({
  asOf: new Date(),
  // read-only inputs collected by the shell
});

printFreshnessReport(report);
process.exitCode = report.findings.some((finding) => finding.severity === "release blocker") ? 1 : 0;
```

### Pattern 4: Severity Grouping Before Areas

**What:** Sort and print findings by `release blocker`, then `needs review`, then `manual smoke`, with source area inside each group. [VERIFIED: .planning/phases/27-freshness-reports-and-reviewed-snapshot-policy/27-CONTEXT.md]  
**When to use:** Use for stdout so maintainers can see deterministic blockers separately from advisory and manual items. [VERIFIED: .planning/REQUIREMENTS.md]  
**Example output shape:**

```text
Freshness report

release blocker
- generated media / checksum-drift / /projects/openlinks

needs review
- github snapshot / snapshot-age / syncedAt 2026-05-27T12:48:17.905Z
- github snapshot / unavailable-record / btc-vanity-address-finder

manual smoke
- external links / live reachability / https://github.com
- hosted previews / social crawler validation / covered routes use local PNG metadata
```

The example uses the current checked-in unavailable snapshot record and current severity taxonomy. [VERIFIED: src/domain/github-metadata.snapshot.json] [VERIFIED: .planning/phases/27-freshness-reports-and-reviewed-snapshot-policy/27-CONTEXT.md]

### Anti-Patterns to Avoid

- **Calling mutating scripts from the report:** Do not call `scripts/sync-github-metadata.ts` or generator write mode; those paths can write snapshots, PNGs, manifests, or remove managed PNGs. [VERIFIED: scripts/sync-github-metadata.ts] [VERIFIED: scripts/generate-social-previews.ts]
- **Hard-coding route arrays:** Use `socialPreviewTargets()`, built static route discovery, and release-readiness helpers instead of copied route lists. [VERIFIED: src/domain/social-previews.ts] [VERIFIED: scripts/release-readiness.ts]
- **Turning age into a hidden release gate:** Old-but-readable snapshots and unavailable records are `needs review` by decision, not `release blocker`. [VERIFIED: .planning/phases/27-freshness-reports-and-reviewed-snapshot-policy/27-CONTEXT.md]
- **Reporting live evidence from local files:** Static HTML proves reviewed local metadata, not hosted crawler behavior, live link reachability, or current GitHub state. [VERIFIED: docs/release-readiness.md] [VERIFIED: .planning/REQUIREMENTS.md]
- **Adding a public freshness dashboard:** Maintainer freshness reporting is out of scope for visitor-facing product UI. [VERIFIED: .planning/REQUIREMENTS.md]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Generated social preview drift | A second manifest/checksum/dimension scanner | `socialPreviewCheckFindings()` plus extracted read-only check input collection | Existing helper already covers target validation, missing files, stale fingerprints, checksum drift, manifest drift, dimensions, size, blank image, orphan PNGs, and nondeterminism. [VERIFIED: scripts/social-previews/check.ts] |
| External link policy and HTTPS checks | A new crawler or regex policy table | `externalLinkFindingsForRoutes()` and `externalLinkPolicies` | Existing helper already detects missing primary links, non-HTTPS URLs, uncovered origins, and sensitive query keys with redacted output. [VERIFIED: scripts/release-readiness.ts] |
| GitHub metadata refresh | Inline REST calls from the report | Existing `sync:github-metadata` command remains separate and explicit | Phase 27 requires offline reviewed snapshot evidence; GitHub docs also warn against casual polling and require careful rate-limit handling for API clients. [VERIFIED: .planning/phases/27-freshness-reports-and-reviewed-snapshot-policy/27-CONTEXT.md] [CITED: https://docs.github.com/en/rest/using-the-rest-api/best-practices-for-using-the-rest-api?apiVersion=2026-03-10] |
| Manual smoke checklist | A stale hand-copied checklist in the report | Derive from `externalLinkPolicies`, `manualReleaseChecklistLabels()`, and current static routes | Existing docs and helper labels already encode manual boundary language and representative smoke coverage. [VERIFIED: scripts/release-readiness.ts] [VERIFIED: docs/release-readiness.md] |
| Snapshot age math | A date library | `Date.parse`, injected `asOf`, and day-difference helper | The phase only needs ISO timestamp readability and age bucketing, so adding a date dependency would be unnecessary churn. [VERIFIED: src/domain/github-metadata.snapshot.json] [VERIFIED: package.json] [ASSUMED] |

**Key insight:** This phase is a classifier and evidence presentation layer over existing deterministic checks, not a new source of truth. [VERIFIED: .planning/phases/27-freshness-reports-and-reviewed-snapshot-policy/27-CONTEXT.md] Custom live checks, copied route maps, and mutating refresh paths would weaken the static release contract the milestone is trying to clarify. [VERIFIED: .planning/REQUIREMENTS.md]

## Common Pitfalls

### Pitfall 1: Report Accidentally Mutates Source Evidence

**What goes wrong:** The report rewrites `github-metadata.snapshot.json`, regenerates PNGs, removes orphaned PNGs, or writes a report artifact without an explicit output path. [VERIFIED: scripts/sync-github-metadata.ts] [VERIFIED: scripts/generate-social-previews.ts]  
**Why it happens:** The existing generator script contains both generate and check modes, and the sync script writes snapshots after network fetches. [VERIFIED: scripts/generate-social-previews.ts] [VERIFIED: scripts/sync-github-metadata.ts]  
**How to avoid:** Extract read-only input builders and import pure helpers only; test that the report script does not import sync or call generator write mode. [VERIFIED: standards/core/architecture.md] [VERIFIED: scripts/social-previews/social-previews.test.ts]  
**Warning signs:** `writeFileSync`, `rmSync`, `mkdirSync`, `syncGitHubMetadata`, `generateSocialPreviews`, or `process.exit(1)` appears in the pure helper. [VERIFIED: scripts/social-previews/social-previews.test.ts]

### Pitfall 2: Hidden Release Gates for Advisory Findings

**What goes wrong:** A stale snapshot age or unavailable repo makes `bun run verify` fail even though Phase 27 only requires reviewed evidence. [VERIFIED: .planning/phases/27-freshness-reports-and-reviewed-snapshot-policy/27-CONTEXT.md]  
**Why it happens:** The report mixes release blockers with `needs review` findings and then treats all findings as process failures. [VERIFIED: .planning/REQUIREMENTS.md]  
**How to avoid:** Exit nonzero only for `release blocker` findings in the standalone report, and do not wire the report into `verify` during Phase 27. [VERIFIED: package.json] [ASSUMED]  
**Warning signs:** `package.json` `verify` contains `report:freshness`, `freshness:live`, `smoke:hosted`, or `sync:github-metadata`. [VERIFIED: package.json]

### Pitfall 3: Static Evidence Overclaims Live State

**What goes wrong:** Docs or report copy says external links, social crawlers, hosted previews, or GitHub facts are live-current when the report only read checked-in files. [VERIFIED: docs/release-readiness.md] [VERIFIED: src/domain/github-metadata.snapshot.json]  
**Why it happens:** Maintainer reports can look authoritative unless they distinguish reviewed static evidence from live checks. [VERIFIED: .planning/REQUIREMENTS.md]  
**How to avoid:** Use `manual smoke` severity for hosted/network/current-live-state checks and update release-readiness docs with explicit language. [VERIFIED: .planning/phases/27-freshness-reports-and-reviewed-snapshot-policy/27-CONTEXT.md]  
**Warning signs:** Phrases like "GitHub metadata is current", "links are reachable", or "social platforms validated" appear in automated evidence labels. [VERIFIED: scripts/verify-release.test.ts]

### Pitfall 4: Missing `.output/public` Produces Misleading Link Findings

**What goes wrong:** The report claims link policy coverage without a current static build, or silently skips the link portion. [VERIFIED: .planning/phases/27-freshness-reports-and-reviewed-snapshot-policy/27-CONTEXT.md]  
**Why it happens:** External-link policy findings are computed from built static route HTML, not from source components. [VERIFIED: scripts/release-readiness.ts] [VERIFIED: scripts/verify-release.ts]  
**How to avoid:** Treat missing or empty `.output/public` as a clear local prerequisite finding with "run `bun run build` first" guidance. [VERIFIED: scripts/verify-release.ts] [VERIFIED: docs/release-readiness.md]  
**Warning signs:** The report has external-link sections but no static route count, build path, or missing-output message. [VERIFIED: scripts/verify-release.ts]

### Pitfall 5: Manual Smoke Matrix Becomes Stale

**What goes wrong:** Release docs and the report drift apart on which routes, origins, or hosted checks maintainers should smoke-test. [VERIFIED: docs/release-readiness.md] [VERIFIED: scripts/release-readiness.ts]  
**Why it happens:** The existing release docs include concrete representative routes and manual origins, while code also has helper-derived route/policy data. [VERIFIED: docs/release-readiness.md] [VERIFIED: scripts/release-readiness.ts]  
**How to avoid:** Derive smoke entries from `externalLinkPolicies`, current static routes, and existing manual checklist labels where practical; keep prose docs as policy explanation, not the only data source. [VERIFIED: scripts/release-readiness.ts] [ASSUMED]  
**Warning signs:** A new markdown-only checklist repeats origin lists or route paths already available from helpers. [VERIFIED: scripts/release-readiness.ts]

## Code Examples

Verified patterns from local sources:

### Classify Existing Social Preview Findings

```ts
// Source: scripts/social-previews/check.ts finding codes.
// [VERIFIED: scripts/social-previews/check.ts]
const socialPreviewReleaseBlockerCodes = new Set([
  "target-validation",
  "missing-file",
  "stale-fingerprint",
  "checksum-drift",
  "manifest-drift",
  "wrong-dimensions",
  "oversized-file",
  "blank-image",
  "orphan-managed-png",
  "nondeterministic-render",
]);
```

### Report Unavailable Snapshot Records

```ts
// Source: src/domain/github-metadata.ts and snapshot JSON.
// [VERIFIED: src/domain/github-metadata.ts]
// [VERIFIED: src/domain/github-metadata.snapshot.json]
const unavailableRecords = snapshot.repositories.filter(
  (metadata) => metadata.status === "unavailable",
);
```

The current checked-in snapshot contains 9 repository records: 8 available and 1 unavailable. [VERIFIED: src/domain/github-metadata.snapshot.json] The unavailable record is `btc-vanity-address-finder`, repository URL `https://github.com/pRizz/btc-vanity-address-finder`, reason `missing`, HTTP status `404`, and synced timestamp `2026-05-27T12:48:17.905Z`. [VERIFIED: src/domain/github-metadata.snapshot.json]

### Reuse External-Link Policy Findings

```ts
// Source: scripts/release-readiness.ts.
// [VERIFIED: scripts/release-readiness.ts]
const findings = externalLinkFindingsForRoutes(staticRoutes).map((finding) => ({
  severity: "release blocker" as const,
  area: "external links" as const,
  code: finding.label,
  message: finding.message,
  routePath: finding.route,
}));
```

### Guard `verify` Against Live Commands

```ts
// Source: scripts/release-readiness.test.ts package script guard pattern.
// [VERIFIED: scripts/release-readiness.test.ts]
const packageJson = JSON.parse(readFileSync("package.json", "utf8")) as {
  scripts: Record<string, string>;
};

expect(packageJson.scripts.verify).not.toContain("freshness:live");
expect(packageJson.scripts.verify).not.toContain("smoke:hosted");
expect(packageJson.scripts.verify).not.toContain("sync:github-metadata");
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Dynamic Open Graph endpoints or runtime image generation | Checked-in generated 1200x630 PNGs plus timestamp-free manifest | Phase 25 completed 2026-06-21 | Freshness can be verified from local files and manifest data. [VERIFIED: .planning/ROADMAP.md] [VERIFIED: public/social/generated/manifest.json] |
| Fallback image for all routes | Covered project/writing/theme routes use route-specific generated metadata, generic routes keep fallback | Phase 26 completed 2026-06-21 | Freshness report should include generated media drift for covered routes and avoid generic-route image expansion. [VERIFIED: .planning/ROADMAP.md] [VERIFIED: .planning/phases/26-metadata-wiring-and-static-references/26-CONTEXT.md] |
| Live external-link checks as release confidence | Deterministic policy coverage plus manual smoke checklist | Existing v1.4/v1.5 release-readiness pattern | Local verification avoids third-party network flake while still surfacing policy defects. [VERIFIED: docs/release-readiness.md] [VERIFIED: scripts/release-readiness.ts] |
| Runtime GitHub fetches in visitor paths | Checked-in GitHub metadata snapshot plus explicit sync script | Existing project decision before v1.5 | Freshness report must describe reviewed static snapshot state, not current live GitHub state. [VERIFIED: src/domain/github-metadata.ts] [VERIFIED: scripts/sync-github-metadata.ts] |

**Deprecated/outdated:**

- Adding live external-link reachability or hosted crawler validation inside `bun run verify` is out of scope for v1.5. [VERIFIED: .planning/REQUIREMENTS.md]
- Adding a public freshness dashboard route is out of scope for v1.5. [VERIFIED: .planning/REQUIREMENTS.md]
- Adding runtime GitHub calls, raw GitHub mirroring, or automated mutation of curated records from freshness reports is out of scope for v1.5. [VERIFIED: .planning/REQUIREMENTS.md]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Use `report:freshness` as the package script name. | Summary / Standard Stack | Low risk; planner can choose another name because Phase 27 delegates command naming. |
| A2 | Prefer stdout-only report output in Phase 27 and skip durable report artifacts unless implementation discovers a strong need. | Standard Stack / Alternatives | Low risk; durable output is allowed if explicit, but default artifact writing increases mutation/churn risk. |
| A3 | Use a 30-day default `needs review` threshold for readable GitHub snapshot age. | Don't Hand-Roll / Open Questions | Medium risk; threshold affects maintainer noise but not release blocking. |
| A4 | Keep the standalone freshness report out of `bun run verify` in Phase 27. | Common Pitfalls | Medium risk; Phase 28 may choose to consume deterministic parts, but Phase 27 decisions say report-only advisory findings must not become hidden hard gates. |

## Open Questions (RESOLVED)

1. **What snapshot age threshold should produce `needs review`? — RESOLVED**
   What we know: The current snapshot `syncedAt` is `2026-05-27T12:48:17.905Z`, which is about 25.7 days old as of `2026-06-22T00:00:00-05:00`. [VERIFIED: src/domain/github-metadata.snapshot.json]  
   Resolution: Use 30 days as the named snapshot-age threshold and classify stale-but-readable snapshot age as `needs review`, never `release blocker`. This is captured in Plan 27-01 as `snapshotStaleAfterDays = 30`. [RESOLVED: .planning/phases/27-freshness-reports-and-reviewed-snapshot-policy/27-01-PLAN.md]

2. **Should static output route reading be extracted from `verify-release.ts`? — RESOLVED**
   What we know: `verify-release.ts` already has private `releaseFiles()` and `staticReleaseRoutes()` helpers, and `externalLinkFindingsForRoutes()` accepts parsed route HTML. [VERIFIED: scripts/verify-release.ts] [VERIFIED: scripts/release-readiness.ts]  
   Resolution: Add a narrow read-only helper at `scripts/freshness/static-output.ts` for the freshness report. It reads `.output/public` route HTML and feeds existing release-readiness policy helpers; it does not mutate output and does not edit `verify-release.ts` in Phase 27. [RESOLVED: .planning/phases/27-freshness-reports-and-reviewed-snapshot-policy/27-01-PLAN.md]

3. **Should optional live commands be added now? — RESOLVED**
   What we know: Phase 27 allows optional live commands only if explicit, advisory, and outside `bun run verify`. [VERIFIED: .planning/phases/27-freshness-reports-and-reviewed-snapshot-policy/27-CONTEXT.md]  
   Resolution: Do not add `freshness:live`, `smoke:hosted`, or other optional live commands in Phase 27. Emit manual smoke targets and document the boundary; keep all live/network/current-state work outside `bun run verify`. [RESOLVED: .planning/phases/27-freshness-reports-and-reviewed-snapshot-policy/27-01-PLAN.md] [RESOLVED: .planning/phases/27-freshness-reports-and-reviewed-snapshot-policy/27-02-PLAN.md]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Bun CLI | Run report, tests, repo scripts | yes | local `1.3.9`; package pin `1.3.14` | Use local for implementation; keep release docs/package pin at `1.3.14`. [VERIFIED: bun --version] [VERIFIED: package.json] |
| Node.js | npm checks and Node built-ins used by scripts | yes | `v24.13.0` | Bun remains the script runner. [VERIFIED: node --version] [VERIFIED: package.json] |
| npm | Registry version verification | yes | `11.6.2` | Use checked-in pins if registry unavailable during implementation. [VERIFIED: npm --version] |
| TypeScript compiler | Typecheck changed helpers | yes | `6.0.3` | None needed. [VERIFIED: bun run tsc --version] |
| Vitest | Unit tests | yes | `4.1.7` | None needed. [VERIFIED: bun run vitest --version] |
| Biome | Format/lint/check | yes | `2.4.15` | None needed. [VERIFIED: bun run biome --version] |
| `.output/public` static output | External-link policy portion of report | yes in current workspace | 15 `index.html` route files found | Report must still handle missing output cleanly. [VERIFIED: find .output/public -name index.html] [VERIFIED: .planning/phases/27-freshness-reports-and-reviewed-snapshot-policy/27-CONTEXT.md] |
| Network | Optional live checks only | not required | network available in research session | Keep offline baseline; do not require network for `report:freshness`. [VERIFIED: .planning/REQUIREMENTS.md] |
| GitHub token | Optional metadata sync only | not required | not checked | Offline report must not require `GITHUB_METADATA_TOKEN`. [VERIFIED: docs/release-readiness.md] [VERIFIED: scripts/sync-github-metadata.ts] |

**Missing dependencies with no fallback:** None found for the offline Phase 27 baseline. [VERIFIED: package.json] [VERIFIED: bun --version]

**Missing dependencies with fallback:**

- Local Bun is older than the package pin (`1.3.9` local versus `1.3.14` in `package.json`), but existing local commands are runnable and release/CI docs already pin `1.3.14`. [VERIFIED: bun --version] [VERIFIED: package.json] [VERIFIED: docs/release-readiness.md]

## Security Domain

Security enforcement is enabled by default because `.planning/config.json` has no explicit `security_enforcement: false`. [VERIFIED: .planning/config.json] OWASP lists ASVS 5.0.0 as the latest stable version on its project page; this table uses the GSD planning-template category labels while mapping controls to the local static-report phase. [CITED: https://owasp.org/www-project-application-security-verification-standard/] [VERIFIED: .planning/config.json]

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | No auth/session/user accounts are added by Phase 27. [VERIFIED: .planning/REQUIREMENTS.md] |
| V3 Session Management | no | No sessions or cookies are added by Phase 27. [VERIFIED: .planning/REQUIREMENTS.md] |
| V4 Access Control | no | No protected visitor or maintainer service is added; report is local CLI only. [VERIFIED: .planning/phases/27-freshness-reports-and-reviewed-snapshot-policy/27-CONTEXT.md] |
| V5 Input Validation | yes | Parse snapshot JSON and static-output inputs at boundaries; preserve redaction for sensitive query keys. [VERIFIED: standards/core/architecture.md] [VERIFIED: scripts/release-readiness.ts] |
| V6 Cryptography | yes, limited | Do not add new crypto; reuse existing SHA-256/fingerprint/checksum surfaces and never hand-roll token handling. [VERIFIED: src/domain/sha256.ts] [VERIFIED: scripts/social-previews/check.ts] [VERIFIED: scripts/verify-release.ts] |

### Known Threat Patterns for Freshness Reporting

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Secret leakage in report output from external query strings | Information Disclosure | Reuse `redactedExternalTarget()` behavior and report sensitive query key names without values. [VERIFIED: scripts/release-readiness.ts] |
| Report mutates reviewed static evidence | Tampering | Keep report shell read-only by default; only write to an explicit output path if implementation deliberately adds one. [VERIFIED: .planning/phases/27-freshness-reports-and-reviewed-snapshot-policy/27-CONTEXT.md] |
| Live GitHub or external-link state presented as local proof | Spoofing / Information Integrity | Put hosted/network/current-live checks in `manual smoke` severity and document the distinction. [VERIFIED: .planning/phases/27-freshness-reports-and-reviewed-snapshot-policy/27-CONTEXT.md] |
| Malformed snapshot silently accepted by TypeScript casts | Tampering / Integrity | Add runtime snapshot parser/guard and classify malformed or unreadable snapshot as `release blocker`. [VERIFIED: src/domain/github-metadata.ts] [VERIFIED: .planning/phases/27-freshness-reports-and-reviewed-snapshot-policy/27-CONTEXT.md] |

## Validation Architecture

Skipped because `workflow.nyquist_validation` is `false` in `.planning/config.json`. [VERIFIED: .planning/config.json]

## Sources

### Primary (HIGH confidence)

- `.planning/phases/27-freshness-reports-and-reviewed-snapshot-policy/27-CONTEXT.md` - locked phase decisions, severity taxonomy, offline/live boundaries, deferred work.
- `.planning/ROADMAP.md` - Phase 27 goal, dependency on Phase 26, success criteria.
- `.planning/REQUIREMENTS.md` - FRESH-01 through FRESH-05 and v1.5 out-of-scope boundaries.
- `AGENTS.md`, `AGENTS.bright-builds.md`, `standards/` pages, and `standards-overrides.md` - repo workflow, Bright Builds standards, TypeScript/Bun constraints, testing and verification rules.
- `/Users/peterryszkiewicz/.codex/skills/openlinks-identity-presence/SKILL.md` - low-intrusion OpenLinks placement guardrails for docs/metadata-adjacent work.
- `scripts/social-previews/check.ts`, `scripts/social-previews/manifest.ts`, `scripts/social-previews/config.ts`, `scripts/social-previews/paths.ts`, and `scripts/generate-social-previews.ts` - generated media drift and manifest contracts.
- `src/domain/social-previews.ts` and `public/social/generated/manifest.json` - current target and generated asset contract.
- `src/domain/github-metadata.ts`, `src/domain/github-metadata.snapshot.json`, and `scripts/sync-github-metadata.ts` - reviewed snapshot types, current data, and explicit mutating refresh path.
- `scripts/release-readiness.ts`, `scripts/verify-release.ts`, `docs/release-readiness.md`, and `package.json` - external-link policy, manual checklist boundaries, release evidence labels, and aggregate verifier.
- `scripts/social-previews/social-previews.test.ts`, `scripts/release-readiness.test.ts`, `scripts/verify-release.test.ts`, `src/domain/github-metadata.test.ts`, and `vitest.config.ts` - existing test placement and patterns.
- npm registry via `npm view` - package latest/pinned versions for TypeScript, Vitest, Biome, `@types/bun`, `@resvg/resvg-js`, and `@solidjs/start`.

### Secondary (MEDIUM confidence)

- GitHub REST API best practices page - supports keeping any live GitHub interaction explicit, serialized, authenticated where needed, rate-limit aware, and outside the offline report. [CITED: https://docs.github.com/en/rest/using-the-rest-api/best-practices-for-using-the-rest-api?apiVersion=2026-03-10]
- OWASP ASVS project page - confirms ASVS latest stable version context for the security section. [CITED: https://owasp.org/www-project-application-security-verification-standard/]

### Tertiary (LOW confidence)

- Researcher recommendations for `report:freshness`, stdout-only default, 30-day snapshot age threshold, and omitting live commands in Phase 27 are intentionally logged as assumptions. [ASSUMED]

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - no new dependencies are needed, and local/package/npm versions were verified. [VERIFIED: package.json] [VERIFIED: npm view typescript] [VERIFIED: npm view vitest] [VERIFIED: npm view @biomejs/biome]
- Architecture: HIGH - existing helper surfaces and tests strongly match the functional-core/thin-shell pattern. [VERIFIED: standards/core/architecture.md] [VERIFIED: scripts/social-previews/check.ts] [VERIFIED: scripts/release-readiness.ts]
- Pitfalls: HIGH - phase decisions explicitly identify mutation, live-gate, severity, and documentation boundary risks. [VERIFIED: .planning/phases/27-freshness-reports-and-reviewed-snapshot-policy/27-CONTEXT.md]
- Thresholds/command naming: MEDIUM - delegated by user decisions and therefore recommended but not locked. [VERIFIED: .planning/phases/27-freshness-reports-and-reviewed-snapshot-policy/27-CONTEXT.md] [ASSUMED]
- Security: MEDIUM - local threat patterns are clear, while ASVS category names in the GSD template do not exactly match the current OWASP ASVS 5.0 chapter model. [CITED: https://owasp.org/www-project-application-security-verification-standard/]

**Research date:** 2026-06-22  
**Valid until:** 2026-07-22 for local architecture decisions; refresh npm/GitHub/OWASP current-source checks after 2026-06-29 if planning is delayed. [ASSUMED]
