# Phase 29: Archived Project Public Filter Guard - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-06-23T02:40:50.170Z
**Phase:** 29-Archived Project Public Filter Guard
**Mode:** Yolo
**Areas discussed:** Source Filter Contract, Regression Coverage, Downstream Flow

---

## Source Filter Contract

| Option | Description | Selected |
| --- | --- | --- |
| Fix shared project selector | Reject archived project status and maturity in `src/domain/projects.ts`, letting existing route and preview helpers inherit the behavior. | yes |
| Add guard in social preview helper only | Stop archived projects in `socialPreviewTargets()` while leaving project detail routes unchanged. | |
| Change curated data only | Avoid code changes because current default data has no archived selected detail project. | |

**User's choice:** Auto-selected recommended default: fix the shared project selector.
**Notes:** This directly closes `INT-01` and avoids a parallel visibility contract.

---

## Regression Coverage

| Option | Description | Selected |
| --- | --- | --- |
| Cover archived status and maturity fixtures | Add selected-looking archived project fixtures to project route and social preview tests. | yes |
| Cover status only | Test only `status: "archived"`. | |
| Rely on current hidden/excluded tests | Leave archived project cases implicit. | |

**User's choice:** Auto-selected recommended default: cover both archived status and archived maturity.
**Notes:** The audit named both fields, so both should be explicit regression guards.

---

## Downstream Flow

| Option | Description | Selected |
| --- | --- | --- |
| Preserve helper-derived downstream flow | Let `projectDetailPageProjects()` drive route, social preview, metadata, static, and release verification behavior. | yes |
| Add duplicate downstream filters | Add additional archive checks in each consumer. | |
| Rewrite social preview target derivation | Rework target construction beyond the audit gap. | |

**User's choice:** Auto-selected recommended default: preserve helper-derived downstream flow.
**Notes:** Phase 24 already locked the route-helper-derived social preview contract.

---

## the agent's Discretion

- Exact helper names and test grouping are delegated to implementation.
- Exact targeted verification command is delegated to implementation, but it should include project detail and social preview tests before the aggregate verification gate.

## Deferred Ideas

None.
