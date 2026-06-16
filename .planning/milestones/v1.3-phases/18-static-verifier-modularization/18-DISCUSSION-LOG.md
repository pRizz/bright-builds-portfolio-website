# Phase 18: Static Verifier Modularization - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-06-16T00:44:32.234Z
**Phase:** 18-static-verifier-modularization
**Mode:** Yolo
**Areas discussed:** Refactor shape, Coverage preservation, Tests and verification, Scope control

---

## Refactor Shape

| Option | Description | Selected |
| --- | --- | --- |
| Thin CLI plus focused modules | Keep `scripts/verify-static.ts` as the entrypoint and move assertion logic into concern-based TypeScript modules. | yes |
| Rename package script or CLI | Change `verify:static` invocation or script location. | |
| Defer split and only add comments | Leave the oversized file mostly intact. | |

**User's choice:** Auto-selected thin CLI plus focused modules.
**Notes:** This directly addresses MAINT-01 and the milestone audit tech debt while preserving the package script contract.

---

## Coverage Preservation

| Option | Description | Selected |
| --- | --- | --- |
| Preserve helper-derived coverage exactly | Move checks without changing generated-output semantics, route sources, metadata helpers, or release claims. | yes |
| Rewrite checks around hand-authored fixtures | Use fixtures as the new source of truth for generated output. | |
| Narrow static checks during refactor | Temporarily drop harder checks and rely on the aggregate gate. | |

**User's choice:** Auto-selected preserve helper-derived coverage exactly.
**Notes:** Phase 18 is a maintainability refactor; writing, project, metadata, JSON-LD, sitemap, asset, robots, unsafe href, OpenLinks identity, and forbidden-runtime checks must stay wired.

---

## Tests And Verification

| Option | Description | Selected |
| --- | --- | --- |
| Focused helper tests plus full static/aggregate gates | Unit-test new pure helpers where practical, then prove generated output with `bun run verify:static` and `bun run verify`. | yes |
| Full fixture rewrite before moving code | Build a large fixture harness before splitting modules. | |
| Static gate only | Rely only on `verify:static` without testing reusable pure helpers. | |

**User's choice:** Auto-selected focused helper tests plus full static/aggregate gates.
**Notes:** The split should add regression guards for the new helper seams without replacing the generated-output proof that already protects the site.

---

## Scope Control

| Option | Description | Selected |
| --- | --- | --- |
| Maintenance-only refactor | Avoid visitor-facing changes, dependency changes, package-script churn, release-label churn, and duplicate OpenLinks promotion. | yes |
| Broaden release docs and labels | Update release wording even if automation semantics are unchanged. | |
| Fold in new UI/browser coverage | Expand browser or UI behavior while touching verification code. | |

**User's choice:** Auto-selected maintenance-only refactor.
**Notes:** Existing low-intrusion OpenLinks footer/about/contact and metadata presence should be preserved, not made more prominent.

---

## the agent's Discretion

- Choose exact module names and grouping.
- Decide which helpers are pure enough for unit tests versus generated-output verification.
- Leave tiny entrypoint-only glue in `scripts/verify-static.ts` if that keeps the orchestrator clearer.

## Deferred Ideas

- Richer fixture architecture for all generated-output assertions.
- New release evidence labels, new browser flows, live external-link crawling, hosted audits, RSS/search/tag checks, CMS/admin, and dynamic OG image checks.
