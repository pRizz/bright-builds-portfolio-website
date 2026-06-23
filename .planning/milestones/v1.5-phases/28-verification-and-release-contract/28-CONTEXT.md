---
generated_by: gsd-discuss-phase
lifecycle_mode: yolo
phase_lifecycle_id: 28-2026-06-22T15-45-43
generated_at: 2026-06-22T15:45:43.487Z
---

# Phase 28: Verification and Release Contract - Context

**Gathered:** 2026-06-22
**Status:** Ready for planning
**Mode:** Yolo

<domain>
## Phase Boundary

Phase 28 expands the deterministic local release contract for the completed v1.5 social preview, metadata, and freshness work. It must prove generated assets, route metadata, JSON-LD parity, static output, budgets, and evidence labels through local checks and release-readiness documentation without adding dynamic Open Graph endpoints, server functions, visitor-runtime GitHub fetches, hosted crawler automation, or live external-link release gates.

</domain>

<decisions>
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

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Scope
- `.planning/ROADMAP.md` - Phase 28 goal, Phase 27 dependency, VERIFY-01 through VERIFY-05 requirements, and success criteria.
- `.planning/REQUIREMENTS.md` - v1.5 verification and release contract requirements plus out-of-scope live/networked checks.
- `.planning/PROJECT.md` - Static portfolio constraints, release evidence truthfulness, clean-builder verification contract, OpenLinks posture, and current milestone decisions.
- `.planning/STATE.md` - Current v1.5 progress and Phase 27 completion context.

### Prior v1.5 Decisions
- `.planning/phases/24-social-image-data-contract/24-CONTEXT.md` - Social preview target derivation, public filtering, fallback behavior, asset path, fingerprint, dimensions, and validation decisions.
- `.planning/phases/25-deterministic-static-image-generation/25-CONTEXT.md` - Deterministic PNG generator, manifest, check mode, managed output directory, and aggregate verification boundaries.
- `.planning/phases/26-metadata-wiring-and-static-references/26-CONTEXT.md` - Route-aware metadata image selection, Open Graph/Twitter fields, JSON-LD image parity, static verification integration, and generic fallback preservation.
- `.planning/phases/27-freshness-reports-and-reviewed-snapshot-policy/27-CONTEXT.md` - Offline freshness report, severity taxonomy, reviewed GitHub snapshot policy, and manual/live check boundaries.

### Existing Code Contracts
- `package.json` - Current aggregate verification order and release-related scripts.
- `src/domain/social-previews.ts` - Source of truth for covered social preview routes, generated asset paths, fallback image, dimensions, fingerprints, and validation findings.
- `src/domain/social-previews.test.ts` - Existing social preview target derivation, filtering, uniqueness, fingerprint, and validation tests.
- `src/domain/seo.ts` - Metadata and JSON-LD helpers that select route-specific or fallback social images.
- `src/domain/portfolio-surfaces.test.ts` - Route-family metadata coverage and generated social preview expectations.
- `src/domain/project-detail-routes.test.ts` - Project detail metadata and JSON-LD image parity expectations.
- `src/domain/writing-metadata.test.ts` - Writing and theme metadata plus JSON-LD image parity expectations.
- `scripts/social-previews/check.ts` - Pure generated media drift finding logic.
- `scripts/social-previews/check-input.ts` - Filesystem input collection for social preview check mode.
- `scripts/social-previews/config.ts` - Managed social preview output paths, manifest path, dimensions, and image budget constants.
- `scripts/social-previews/manifest.ts` - Timestamp-free generated social preview manifest contract.
- `scripts/social-previews/social-previews.test.ts` - Existing manifest and social preview check coverage.
- `scripts/freshness/report.ts` - Offline freshness report classification and summary logic.
- `scripts/freshness/freshness.test.ts` - Existing freshness severity and reporting coverage.
- `scripts/verify-static/run-static-verification.ts` - Static output verification orchestration.
- `scripts/verify-static/metadata-jsonld-verifier.ts` - Generated HTML metadata and JSON-LD verification surface.
- `scripts/verify-static/output.ts` - Static output asset assertions and PNG dimension helpers.
- `scripts/verify-release.ts` - Release evidence labels and asset budget verification.
- `scripts/verify-release.test.ts` - Release evidence and budget tests.
- `scripts/release-readiness.ts` - Automated evidence labels, manual checklist labels, and external-link policy helpers.
- `scripts/release-readiness.test.ts` - Release-readiness policy and label coverage.
- `docs/release-readiness.md` - Current release documentation, manual smoke checklist, and clean-builder command.

### Standards and Identity Guidance
- `AGENTS.md` - Repo-local dark-primary, visual verification, GSD workflow, and Bright Builds Rules entrypoint.
- `AGENTS.bright-builds.md` - Verification, TypeScript/Solid, OpenLinks, and repo workflow guidance.
- `standards/core/verification.md` - Repo-native verification and clean pre-commit expectations.
- `standards/core/testing.md` - Unit-test and Arrange/Act/Assert expectations.
- `standards/languages/typescript-javascript.md` - Bun/TypeScript scripting, helper, and maybe-null naming guidance.
- `openlinks-identity-presence` skill guidance - Keep OpenLinks as low-intrusion visible identity/metadata context, not a primary brand or repeated promotion.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `socialPreviewTargets()`, `maybeSocialPreviewTargetForRoutePath()`, `validateSocialPreviewTargets()`, `SOCIAL_PREVIEW_DIMENSIONS`, and `SOCIAL_PREVIEW_FALLBACK_IMAGE` already define the route and image contract Phase 28 should verify.
- `socialPreviewCheckFindings()` already classifies generated media and manifest drift for missing files, stale fingerprints, checksum drift, dimensions, size, blank images, orphaned managed PNGs, and nondeterminism.
- `buildSocialPreviewManifest()` and serialized manifest helpers already provide stable route/asset/fingerprint/checksum data for verification.
- `metadataForRoute`, `metadataForProject`, `metadataForWritingEntry`, and `metadataForTheme` already centralize route-aware metadata selection.
- Static verification already has modular verifiers for metadata/JSON-LD, route HTML, sitemap/assets, and static output files.
- `verify-release.ts`, `release-readiness.ts`, and their tests already encode release evidence and budget patterns.
- `freshnessReport()` and related helpers already distinguish deterministic blockers from reviewed/static maintenance signals and manual smoke work.

### Established Patterns
- Pure domain/helper logic is tested with Vitest; CLI scripts stay thin Bun/TypeScript shells around pure functions.
- Static verification derives expected values from route/domain helpers rather than copied route fixtures.
- Release evidence labels are intentionally truthful: local automated evidence is separated from manual preview, deployed, Cloudflare, hosted crawler, and live-link checks.
- Visitor-facing data remains checked-in and static; no runtime GitHub fetches or server image generation are allowed.
- Tests should stay focused and include Arrange/Act/Assert sections when non-trivial.

### Integration Points
- Strengthen unit tests in `src/domain/*`, `scripts/social-previews/*`, `scripts/freshness/*`, and release/static verifier tests where Phase 28 requirements are not already covered.
- Expand `scripts/verify-static/metadata-jsonld-verifier.ts` or adjacent helpers so `.output/public` proves covered-route HTML metadata and JSON-LD image parity against generated assets and manifest data.
- Expand `scripts/verify-release.ts` and `scripts/verify-release.test.ts` for per-image and total social preview budget enforcement plus truthful evidence labels.
- Update `docs/release-readiness.md` and any docs checks in `scripts/release-readiness.ts` so maintainers can follow generation, verification, freshness, and manual social-card smoke flow.
- Keep `package.json` `verify` deterministic and local, with `verify:social-previews` before `build`.

</code_context>

<specifics>
## Specific Ideas

- Treat Phase 28 as a contract-tightening and release-evidence phase, not a new route/content/image generation phase.
- Prefer helper-derived assertions that compare static HTML output against the same manifest and route helpers used by generation and metadata.
- Keep manual smoke work visible in docs and labels, but never let labels imply those hosted/live checks ran locally.
- Preserve the OpenLinks identity link/metadata posture already present in the site; this phase verifies release truthfulness rather than changing brand placement.

</specifics>

<deferred>
## Deferred Ideas

- Route-specific previews for home, about, contact, and other generic routes remain `SOCIAL-FUTURE-01`.
- Hosted social-card validator automation remains `SOCIAL-FUTURE-02`.
- Scheduled GitHub metadata refreshes and live external-link reports remain future freshness work.
- Public freshness dashboard, CMS/admin workflows, search/filtering, newsletters, and runtime content features remain out of v1.5 scope.

</deferred>

---

*Phase: 28-verification-and-release-contract*
*Context gathered: 2026-06-22*
