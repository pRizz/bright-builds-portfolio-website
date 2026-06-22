# Phase 27: Freshness Reports and Reviewed Snapshot Policy - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-06-22T12:03:51Z
**Phase:** 27-Freshness Reports and Reviewed Snapshot Policy
**Mode:** Yolo
**Areas discussed:** Offline report scope, Severity taxonomy, Reviewed GitHub snapshot policy, Live and manual check boundary

---

## Offline Report Scope

| Option | Description | Selected |
| --- | --- | --- |
| Offline static evidence report only | Deterministic no-network report over generated media, GitHub snapshot age/unavailable records, external policy/HTTPS findings, and manual smoke targets. | x |
| Offline report model + optional generated report artifact | Review-friendly artifact allowed only in an explicit report/output path. |  |
| Offline report + explicit live supplement | Optional future command for current external state, never part of `bun run verify`. |  |

**User's choice:** Auto-selected offline static evidence report as the Phase 27 baseline.
**Notes:** The report must be read-only for source data and should compose existing pure helper surfaces rather than duplicate release logic.

---

## Severity Taxonomy

| Option | Description | Selected |
| --- | --- | --- |
| Gate-aligned evidence taxonomy | Deterministic local defects are `release blocker`, advisory static maintenance is `needs review`, live/hosted validation is `manual smoke`. | x |
| Threshold-driven freshness policy | Stronger age/SLO rules for snapshot freshness, with greater risk of noisy gates. |  |
| Report-only taxonomy | Safest against over-gating but weakens the usefulness of `release blocker`. |  |
| Dual-axis taxonomy | Separates severity from evidence mode, but adds terminology and model complexity. |  |

**User's choice:** Auto-selected gate-aligned evidence taxonomy.
**Notes:** Report-only `needs review` and `manual smoke` findings should not become hidden hard release gates in Phase 27.

---

## Reviewed GitHub Snapshot Policy

| Option | Description | Selected |
| --- | --- | --- |
| Offline advisory age report from checked-in snapshot | Reads `syncedAt` and unavailable records without network or mutation. | x |
| Strict freshness gate for age or unavailable records | Forces maintenance but turns advisory GitHub facts into blockers. |  |
| Separate reviewed-ack policy | Explicit accepted exceptions, but extra state and process. |  |
| Explicit live GitHub compare command | Useful optional live check, outside offline report and `bun run verify`. |  |

**User's choice:** Auto-selected offline advisory age report from the checked-in snapshot.
**Notes:** Malformed snapshots may block; old-but-readable snapshots and unavailable records are `needs review`. `scripts/sync-github-metadata.ts` remains the explicit networked/mutating refresh path.

---

## Live and Manual Check Boundary

| Option | Description | Selected |
| --- | --- | --- |
| Offline freshness report emits manual smoke matrix | Keeps `bun run verify` deterministic and reports hosted/live targets as manual smoke. | x |
| Separate opt-in live freshness command | Explicit command for live checks, advisory only and excluded from verify. |  |
| Hosted Playwright smoke command | Deployed URL validation with browser tooling, but environment-dependent. |  |
| Scheduled/manual crawler or Lighthouse CI | Useful future monitoring, heavier than Phase 27. |  |

**User's choice:** Auto-selected offline report with manual smoke matrix.
**Notes:** Optional live commands may be planned only if clearly named, advisory, and guarded against inclusion in `package.json` `verify`.

---

## the agent's Discretion

- Exact report command name, output format, helper/module names, and age thresholds are delegated to implementation.
- Exact manual smoke matrix formatting is delegated to implementation.
- Whether to write a report artifact is delegated to planning, provided writes are confined to an explicit report/output path.

## Deferred Ideas

- Scheduled GitHub metadata refreshes.
- Scheduled live external-link reachability reports.
- Freshness trend tracking.
- Hosted social-card validator automation.
