# Phase 8: Content Helper Surface Cleanup - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-31T23:03:14.542Z
**Phase:** 8-Content Helper Surface Cleanup
**Mode:** Yolo
**Areas discussed:** Helper ownership, Runtime guardrails, Maintainer update path

---

## Helper Ownership

| Option | Description | Selected |
|--------|-------------|----------|
| Remove stale aliases | Treat `curatedProjects` plus selector helpers as the intentional surface and remove `projectSeeds` if unused. | x |
| Keep and document aliases | Leave `projectSeeds` and `primaryProjectLink` exported with comments explaining legacy compatibility. | |
| Rename ambiguous helpers | Replace vague helper names with explicit selector names when a first-link selector is still useful. | x |

**User's choice:** Auto-selected the root-cause cleanup path: remove meaningless seed aliases and keep or rename only helpers with clear semantics.
**Notes:** The phase goal explicitly calls out `projectSeeds` and `primaryProjectLink`; current search found `projectSeeds` only defined in `src/domain/projects.ts`, while `primaryProjectLink` is also only defined there.

---

## Runtime Guardrails

| Option | Description | Selected |
|--------|-------------|----------|
| Add a source import guard | Scan visitor-runtime source for forbidden legacy helper imports and fail release verification. | x |
| Rely on TypeScript export failures | Remove exports and rely on compile failures alone. | |
| Use a lint plugin | Add or configure a general dependency-restriction lint rule. | |

**User's choice:** Auto-selected a small repo-owned guard because it gives a clear maintainer-facing error without adding dependencies.
**Notes:** Existing `scripts/verify-no-github-runtime.ts` shows the preferred deterministic scan style.

---

## Maintainer Update Path

| Option | Description | Selected |
|--------|-------------|----------|
| Document selector APIs near the data module | Put supported helper intent where maintainers edit curated project data. | x |
| Put all guidance in README only | Keep source terse and explain data updates in a general maintainer doc. | |
| Skip documentation and rely on tests | Let tests define the supported API implicitly. | |

**User's choice:** Auto-selected close-to-code documentation plus behavior/import tests.
**Notes:** This satisfies DATA-01 and DATA-03 while keeping the visitor UI unchanged.

---

## the agent's Discretion

- Exact replacement naming for `primaryProjectLink`, if a first-link selector remains useful.
- Exact verifier file name and forbidden-import implementation.
- Exact documentation placement, provided the supported selector API is discoverable.

## Deferred Ideas

None.
