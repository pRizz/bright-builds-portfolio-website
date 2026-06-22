---
generated_by: gsd-discuss-phase
lifecycle_mode: yolo
phase_lifecycle_id: 27-2026-06-22T11-58-43
generated_at: 2026-06-22T12:03:51.513Z
---

# Phase 27: Freshness Reports and Reviewed Snapshot Policy - Context

**Gathered:** 2026-06-22
**Status:** Ready for planning
**Mode:** Yolo

<domain>
## Phase Boundary

Phase 27 adds maintainer-facing offline freshness evidence for generated social previews, checked-in GitHub metadata, external-link policy coverage, HTTPS policy, and manual smoke targets. It must not mutate curated project, writing, theme, profile, GitHub snapshot, or generated social preview source data, and it must not add live network checks to `bun run verify`.

</domain>

<decisions>
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

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Scope
- `.planning/ROADMAP.md` - Phase 27 goal, dependency on Phase 26, requirements, and success criteria.
- `.planning/REQUIREMENTS.md` - FRESH-01 through FRESH-05 acceptance requirements and v1.5 out-of-scope boundaries.
- `.planning/PROJECT.md` - Static portfolio constraints, GitHub metadata decisions, release evidence truthfulness, and freshness-before-live-gates decision.
- `.planning/STATE.md` - Current milestone state and Phase 26 completion context.

### Prior v1.5 Decisions
- `.planning/phases/24-social-image-data-contract/24-CONTEXT.md` - Social preview target contract, validation findings, fallback behavior, and generated asset path rules.
- `.planning/phases/25-deterministic-static-image-generation/25-CONTEXT.md` - Deterministic generator/check mode, manifest, managed output directory, and aggregate verification boundaries.
- `.planning/phases/26-metadata-wiring-and-static-references/26-CONTEXT.md` - Route-aware metadata image resolution, JSON-LD image parity, static verification integration, and fallback preservation.

### Existing Code Contracts
- `scripts/social-previews/check.ts` - Pure generated media drift finding codes that the freshness report can classify.
- `scripts/social-previews/manifest.ts` - Timestamp-free generated social preview manifest shape.
- `scripts/social-previews/config.ts` - Managed generated social preview directory, manifest path, and PNG budget constants.
- `scripts/social-previews/paths.ts` - Managed generated social preview file path guards.
- `scripts/generate-social-previews.ts` - Existing mutating generator/check command; freshness report should not call its generate path.
- `src/domain/social-previews.ts` - Social preview targets, fallback image, dimensions, fingerprints, and target validation findings.
- `src/domain/github-metadata.ts` - Checked-in GitHub metadata snapshot types, parser helpers, and advisory metadata accessors.
- `src/domain/github-metadata.snapshot.json` - Current reviewed GitHub metadata snapshot and unavailable-record data.
- `scripts/sync-github-metadata.ts` - Explicit networked/mutating snapshot refresh path to keep separate from offline freshness reporting.
- `scripts/release-readiness.ts` - External-link policy coverage, HTTPS/sensitive query findings, release-readiness docs checks, and manual checklist labels.
- `scripts/verify-release.ts` - Deterministic release verifier and evidence-label boundaries.
- `docs/release-readiness.md` - Current local gate, manual external-link policy, preview/prod smoke checks, Cloudflare settings, and no-runtime-token expectations.
- `package.json` - Current aggregate `verify` script and existing social preview/GitHub metadata scripts.

### External Guidance Used During Discussion
- `https://docs.solidjs.com/solid-start/building-your-application/route-prerendering` - Static prerendering model; report must not imply server/runtime evidence.
- `https://developers.cloudflare.com/pages/configuration/build-configuration/` - Static build output contract context.
- `https://docs.github.com/en/rest/using-the-rest-api/best-practices-for-using-the-rest-api?apiVersion=2026-03-10` - GitHub API best practices supporting explicit, opt-in live checks rather than casual polling.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `socialPreviewCheckFindings()` already returns pure finding codes for target validation, missing files, stale fingerprints, checksum drift, manifest drift, dimensions, size, blank images, orphaned managed PNGs, and nondeterminism.
- `gitHubMetadataSnapshot` already exposes top-level and per-repository `syncedAt` timestamps plus `available`/`unavailable` records.
- `externalLinkFindingsForRoutes()` already identifies external HTTPS, sensitive query, primary-link presence, and policy-coverage release findings from built route HTML.
- `externalLinkPolicies`, `automatedReleaseReadinessEvidenceLabels()`, and `manualReleaseChecklistLabels()` already encode release evidence and manual-check boundaries.
- `docs/release-readiness.md` already contains manual external-link, preview deployment, and production smoke paths that the freshness report or docs can align with.

### Established Patterns
- Domain/report logic should be pure data-in/data-out and covered by Vitest.
- Scripts should stay thin Bun/TypeScript shells around pure helpers.
- Existing release verification is deterministic and local; live external checks are manual by design.
- Existing v1.5 social preview code separates generator write mode from check/finding logic.

### Integration Points
- Add focused report helpers near `scripts/` or `scripts/freshness/` and tests near the helper module.
- Add a package script for the offline report, for example `report:freshness` or `verify:freshness-report`, but do not wire optional live checks into `bun run verify`.
- Update `docs/release-readiness.md` to distinguish offline freshness evidence from hosted crawler validation, live external-link reachability, and current live GitHub state.
- Phase 28 can decide whether and how the aggregate release contract consumes the offline report after Phase 27 proves the report model.

</code_context>

<specifics>
## Specific Ideas

- Treat the current GitHub snapshot as reviewed static evidence, not proof of current GitHub state.
- Make the report useful in review by grouping findings by severity first, then source area.
- When in doubt, classify network-dependent evidence as `manual smoke` and leave the deterministic local gate truthful.

</specifics>

<deferred>
## Deferred Ideas

- Scheduled GitHub metadata refreshes in CI remain `FRESH-FUTURE-01`.
- Scheduled live external-link reachability reports remain `FRESH-FUTURE-02`.
- Freshness trend tracking over time remains `FRESH-FUTURE-03`.
- Hosted social-card validator automation remains `SOCIAL-FUTURE-02`.

</deferred>

---

*Phase: 27-freshness-reports-and-reviewed-snapshot-policy*
*Context gathered: 2026-06-22*
