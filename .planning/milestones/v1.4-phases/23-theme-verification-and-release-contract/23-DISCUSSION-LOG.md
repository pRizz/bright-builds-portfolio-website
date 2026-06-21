# Phase 23: Theme Verification and Release Contract - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-06-18T04:28:20.067Z
**Phase:** 23-Theme Verification and Release Contract
**Mode:** Yolo with advisor research
**Areas discussed:** Static verification contract, Browser release coverage, Release-readiness documentation and evidence labels, Aggregate gate and verification ordering

---

## Static Verification Contract

| Option | Description | Selected |
| --- | --- | --- |
| Registry-derived full theme parity | Prove `/themes` and every public theme detail route, metadata, JSON-LD, sitemap inclusion/exclusion, related links, collaboration actions, forbidden runtime residue, docs, and labels from helper output. | Yes |
| SEO/discovery-only theme contract | Cover only title, description, canonical, OG/Twitter, ItemList, CollectionPage, sitemap, and social fallback. |  |
| Release-gate labeling contract | Focus on command/docs/evidence truth and rely on existing static/browser checks. |  |
| Parsed JSON-LD theme contract | Validate structured data by parsed shape rather than string/attribute checks. |  |

**User's choice:** Auto-selected recommended option: registry-derived full theme parity.
**Notes:** This best matches VERIFY-01 and avoids false confidence around theme collaboration and cross-link paths. Parsed JSON-LD can remain optional unless it reduces current brittleness.

---

## Browser Release Coverage

| Option | Description | Selected |
| --- | --- | --- |
| Route-derived axe/layout, representative keyboard/motion | All prerendered routes receive axe and desktop/mobile layout checks; keyboard and reduced-motion stay representative for release-critical flows. | Yes |
| Explicit browser coverage manifest | Add a manifest to make route-group coverage machine-checkable. |  |
| Exhaustive theme interaction matrix | Run keyboard/motion interaction checks for every theme slug. |  |
| Screenshot/visual regression baselines | Add pixel baseline checks for dark layout and overlap risk. |  |

**User's choice:** Auto-selected recommended option: route-derived axe/layout with representative keyboard and reduced-motion.
**Notes:** This matches the existing Playwright suite and keeps labels truthful without adding high-flake visual baselines or exhaustive tab traversal.

---

## Release-Readiness Documentation and Evidence Labels

| Option | Description | Selected |
| --- | --- | --- |
| Extend current release contract and include `verify:release` in `verify` | Align docs, package scripts, release-readiness facts, and evidence labels around the local aggregate gate. | Yes |
| Fold release-readiness document checks into `verify:static` | Keep release verifier optional and move docs checks near static verification. |  |
| Generate coverage labels from route/domain helpers | Dynamically build labels from route helpers and coverage groups. |  |

**User's choice:** Auto-selected recommended option: extend the current release contract and include `verify:release` in `verify`.
**Notes:** This closes the current mismatch where release docs describe `verify:release` as part of the aggregate gate while the package script does not run it yet.

---

## Aggregate Gate and Verification Ordering

| Option | Description | Selected |
| --- | --- | --- |
| Add `verify:release` to aggregate, run it last | Keep narrow commands focused, then run release verifier after build, browser checks, and static verification. | Yes |
| Keep `verify:release` separate from aggregate | Preserve a faster aggregate but leave release-readiness separate. |  |
| Put `generate:static-metadata` inside `verify` before build | Make `verify` refresh generated public metadata before building. |  |
| Add a non-mutating static-metadata drift check | Add a separate pre-build guard for stale sitemap/robots drift. |  |

**User's choice:** Auto-selected recommended option: add `verify:release` to aggregate and run it last.
**Notes:** `verify` should stay non-mutating. Stale generated metadata should fail visibly instead of being silently rewritten.

---

## the agent's Discretion

- Exact label strings may be chosen by the planner/executor as long as they distinguish automated theme static/browser/release coverage from manual deploy or live-link checks.
- Small helper extraction is allowed in release-readiness/static-verifier modules only when it reduces real duplication.
- Additional focused tests should guard changed release facts and evidence wording.

## Deferred Ideas

- Screenshot baselines.
- Exhaustive per-theme keyboard/motion matrices.
- Parsed JSON-LD assertion framework.
- Separate static-metadata drift script.
