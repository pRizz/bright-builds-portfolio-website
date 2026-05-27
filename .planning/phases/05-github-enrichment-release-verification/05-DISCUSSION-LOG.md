# Phase 5: GitHub Enrichment & Release Verification - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-05-27T11:27:35.371Z
**Phase:** 5-GitHub Enrichment & Release Verification
**Mode:** Yolo
**Areas discussed:** Static GitHub Metadata Contract, Enrichment Presentation, Token and Runtime Safety, Release Verification Surface, Documentation and Release Readiness

---

## Static GitHub Metadata Contract

| Option | Description | Selected |
|--------|-------------|----------|
| Checked-in static snapshot | Fetch metadata only during manual/build-prep sync and render from checked-in data. | yes |
| Runtime GitHub API | Fetch from the browser or server while visitors load the portfolio. | |
| No metadata enrichment | Skip GitHub enrichment and rely only on authored copy. | |

**User's choice:** Checked-in static snapshot.
**Notes:** Auto-selected because prior phases locked the no-runtime-GitHub boundary and Phase 5 explicitly scopes optional static enrichment.

---

## Enrichment Presentation

| Option | Description | Selected |
|--------|-------------|----------|
| Secondary compact metadata | Show stats and repo facts as secondary project-card context without changing curated ordering/copy. | yes |
| Metadata-driven ranking | Let stars, forks, or pushed dates influence flagship placement or order. | |
| Hidden-only metadata | Keep metadata available only in snapshot/script output, not visible in the UI. | |

**User's choice:** Secondary compact metadata.
**Notes:** Auto-selected because GH-03 asks metadata to enrich curated records without overriding authored copy or curation decisions.

---

## Token and Runtime Safety

| Option | Description | Selected |
|--------|-------------|----------|
| Non-public script token only | Allow local sync scripts to read non-public env vars while forbidding browser token names in source/output. | yes |
| Public Vite token | Use a `VITE_*` token prefix so client code can call GitHub directly. | |
| No token support | Only unauthenticated GitHub requests. | |

**User's choice:** Non-public script token only.
**Notes:** Auto-selected because optional authenticated refresh is useful, but frontend token exposure is explicitly forbidden.

---

## Release Verification Surface

| Option | Description | Selected |
|--------|-------------|----------|
| Repo-owned Bun release verifier | Extend existing static/source/unit checks with a release verifier for token safety, accessibility heuristics, links, assets, and budgets. | yes |
| Add heavy external suites now | Adopt Playwright, axe, and Lighthouse dependencies for routine release checks. | |
| Manual checklist only | Document checks without a runnable release gate. | |

**User's choice:** Repo-owned Bun release verifier.
**Notes:** Auto-selected to match existing dependency-light verification and preserve a runnable release command. Manual/browser evidence can still be recorded for gaps that are unsafe to encode in a routine script.

---

## Documentation and Release Readiness

| Option | Description | Selected |
|--------|-------------|----------|
| Update README and contributor docs | Document setup, build/deploy assumptions, curation, metadata refresh, and release verification. | yes |
| Planning docs only | Keep release workflow knowledge in `.planning/` artifacts. | |
| Defer docs | Ship implementation without public maintenance notes. | |

**User's choice:** Update README and contributor docs.
**Notes:** Auto-selected because VER-05 requires project docs, not only planning artifacts.

---

## the agent's Discretion

- Exact metadata helper names, snapshot file format, release budget thresholds, and project-card metadata layout are left to implementation judgment.

## Deferred Ideas

- Scheduled CI metadata refresh.
- Per-project generated social preview images.
- Heavy Playwright/axe/Lighthouse dependency adoption unless proven necessary.
