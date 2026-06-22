# Phase 28: Verification and Release Contract - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-06-22T15:45:43.487Z
**Phase:** 28-verification-and-release-contract
**Mode:** Yolo
**Areas discussed:** Aggregate verification contract, Unit and helper coverage, Static output verification, Budgets and evidence labels, Release-readiness documentation

---

## Aggregate Verification Contract

| Option | Description | Selected |
| --- | --- | --- |
| Keep deterministic local aggregate gate | Preserve `bun run install:browser && bun run verify`, run social preview checks before build, and guard against live/networked release dependencies. | yes |
| Split release verification into a new manual command | Keep `verify` narrower and ask maintainers to remember a separate social/freshness release gate. | |
| Add hosted/live checks to release verification | Include social crawler, live link, deployed-site, or current GitHub checks in the aggregate gate. | |

**User's choice:** Keep deterministic local aggregate gate.
**Notes:** Selected because v1.5 requires truthful local release evidence without weakening the static deployment contract or introducing flaky live dependencies.

---

## Unit and Helper Coverage

| Option | Description | Selected |
| --- | --- | --- |
| Strengthen pure helper tests where gaps remain | Use focused Vitest coverage for social target derivation, manifest findings, metadata image selection, JSON-LD parity, and freshness classification. | yes |
| Add broad end-to-end-only tests | Rely mainly on browser/static output checks and skip pure helper regression coverage. | |
| Duplicate route fixtures in tests | Hand-maintain expected route/image maps for verification. | |

**User's choice:** Strengthen pure helper tests where gaps remain.
**Notes:** Selected because existing phases already use functional-core helpers and route-derived contracts; tests should verify behavior without creating drift-prone copied route lists.

---

## Static Output Verification

| Option | Description | Selected |
| --- | --- | --- |
| Verify generated HTML against helper and manifest contracts | Check covered-route Open Graph, Twitter, JSON-LD image parity, local asset existence, dimensions, manifest consistency, and forbidden runtime residue in `.output/public`. | yes |
| Trust unit metadata tests only | Skip deeper static HTML verification after build. | |
| Verify only asset existence | Check that PNG files exist but not whether rendered route HTML references them correctly. | |

**User's choice:** Verify generated HTML against helper and manifest contracts.
**Notes:** Selected because Phase 28 needs release proof that static output exposes the intended social image metadata before hydration.

---

## Budgets and Evidence Labels

| Option | Description | Selected |
| --- | --- | --- |
| Enforce generated image budgets and truthful labels | Check per-image and total PNG budgets, and report only automated labels that actually run locally. | yes |
| Budget by convention only | Document size expectations without failing release verification. | |
| Merge manual smoke labels into automated evidence | Show preview, deployed, crawler, or live-link labels as if they were locally verified. | |

**User's choice:** Enforce generated image budgets and truthful labels.
**Notes:** Selected because release evidence must stay reviewable and honest: local checks can fail gates, while hosted/live checks stay manual or explicit opt-in work.

---

## Release-Readiness Documentation

| Option | Description | Selected |
| --- | --- | --- |
| Update docs around generation, verify, freshness, and manual smoke | Explain the clean-builder flow, social preview generation/check mode, freshness report, static/release verification, and manual social-card smoke checks. | yes |
| Leave docs unchanged | Rely on scripts and test names to communicate the release flow. | |
| Promote OpenLinks in release docs | Use the release work to add more prominent OpenLinks branding. | |

**User's choice:** Update docs around generation, verify, freshness, and manual smoke.
**Notes:** Selected with OpenLinks skill guidance applied: preserve existing low-intrusion identity placement and metadata posture, but do not make OpenLinks a primary release-docs CTA.

---

## the agent's Discretion

- Exact helper names and module boundaries.
- Exact grouping of test assertions, provided tests stay focused and derived from domain helpers.
- Exact release evidence label wording, provided labels do not overclaim manual/live checks.
- Exact docs section order and phrasing.

## Deferred Ideas

- Route-specific generic-page previews.
- Hosted social-card validator automation.
- Scheduled GitHub metadata refreshes and live external-link reports.
- Public freshness dashboard, CMS/admin workflows, search/filtering, newsletters, and runtime content features.
