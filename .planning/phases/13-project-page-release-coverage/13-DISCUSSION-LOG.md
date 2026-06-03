# Phase 13: Project Page Release Coverage - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-06-03T01:40:37Z
**Phase:** 13-Project Page Release Coverage
**Mode:** Yolo
**Areas discussed:** Static release coverage, Browser release coverage, Release readiness documentation and evidence, Clean-builder gate

---

## Static Release Coverage

| Option | Description | Selected |
| --- | --- | --- |
| Preserve and pin existing exhaustive static verifier coverage | Keep Phase 12 static checks as the exhaustive project detail route guard and add only missing regression evidence if needed. | yes |
| Rebuild static coverage from a new route list | Create a separate project-detail release route list for static checks. | |
| Move static coverage into browser tests | Rely on browser rendering for project detail route story, metadata, and JSON-LD checks. | |

**User's choice:** Auto-selected the recommended preservation path.
**Notes:** Phase 12 already verified generated project detail HTML for story text, metadata, JSON-LD, sitemap inclusion/exclusion, local social preview mapping, and forbidden runtime residue. Phase 13 should not duplicate that logic in a second route list.

---

## Browser Release Coverage

| Option | Description | Selected |
| --- | --- | --- |
| Registry-derived representative detail route checks | Use `projectDetailRoutes()` to include selected detail routes in browser keyboard and reduced-motion checks while existing route loops keep axe/layout broad. | yes |
| Every detail route for every browser behavior | Exercise each project detail page for axe, layout, keyboard, and reduced motion. Strongest but slower and redundant. | |
| Keep browser checks top-level only | Leave keyboard and reduced-motion checks on `/` because static checks already inspect detail routes. | |

**User's choice:** Auto-selected registry-derived representative browser checks.
**Notes:** Existing Playwright tests already loop over `prerenderRoutes` for axe and dark desktop/mobile layout. The missing coverage is keyboard reachability and reduced-motion behavior on detail routes.

---

## Release Readiness Documentation and Evidence

| Option | Description | Selected |
| --- | --- | --- |
| Make docs/checks name project detail route coverage | Add required release-readiness facts and evidence labels so docs and release output mention detail route static/browser coverage. | yes |
| Rely on existing route-agnostic release docs | Keep current wording because `prerenderRoutes` technically includes detail routes. | |
| Add a separate manual release checklist only | Document the coverage but do not make release checks enforce the wording. | |

**User's choice:** Auto-selected enforced docs/checks.
**Notes:** Phase 13 explicitly requires release-readiness docs and checks to identify project detail route coverage as part of `bun run install:browser && bun run verify`.

---

## Clean-Builder Gate

| Option | Description | Selected |
| --- | --- | --- |
| Keep existing aggregate gate and verify it passes | Preserve `bun run install:browser && bun run verify` as the clean-builder path and run repo-native verification after implementation. | yes |
| Add new release command aliases | Introduce a project-detail-specific release command. | |
| Add live network checks | Crawl live project and external links during local release verification. | |

**User's choice:** Auto-selected the existing aggregate gate.
**Notes:** Local release checks must stay deterministic and token-safe. External links remain policy-checked locally and smoke-checked manually.

---

## the agent's Discretion

- The agent may choose the smallest helper shape that keeps representative browser project route coverage clear and derived from `projectDetailRoutes()`.
- The agent may split helper functions if it reduces meaningful duplication without unrelated refactors.

## Deferred Ideas

- Per-project raster social previews.
- Hosted Lighthouse/browser-provider release audits.
- Detail routes for non-flagship or unselected projects.
