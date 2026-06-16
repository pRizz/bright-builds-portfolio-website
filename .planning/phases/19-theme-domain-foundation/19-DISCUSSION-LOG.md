# Phase 19: Theme Domain Foundation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-06-16T14:48:45.850Z
**Phase:** 19-theme-domain-foundation
**Mode:** Yolo
**Areas discussed:** Theme record shape, Public helper and path contracts, Relationship resolution, Validation and curation gate

---

## Theme Record Shape

| Option | Description | Selected |
| --- | --- | --- |
| Lean `ThemeRecord` plus resolved selectors | Use a small checked-in theme record with theme-specific copy and slug relationships resolved from source registries. | yes |
| Evidence-annotated theme record | Attach proof points directly to supporting project/writing slugs for stronger provenance. | |
| Denormalized theme page model | Copy all display fragments into theme records for easiest UI consumption. | |

**User's choice:** Auto-selected lean `ThemeRecord` plus resolved selectors.
**Notes:** This keeps Phase 19 a static domain foundation and avoids building a second project/writing content layer.

---

## Public Helper and Path Contracts

| Option | Description | Selected |
| --- | --- | --- |
| Mirror project/writing helper surface | Add `curatedThemes`, public selectors, `maybe...BySlug`, `themeDetailPath()`, and `themeDetailRoutes()`. | yes |
| Normalized public theme view | Return public entries with pre-resolved display records. | |
| Central content route registry | Reshape route ownership across project, writing, and theme surfaces. | |
| Raw registry plus validator only | Add data and validation without public helper contracts. | |

**User's choice:** Auto-selected mirror project/writing helper surface.
**Notes:** This best matches existing route derivation and lets Phase 20 consume stable route helpers without copying slugs.

---

## Relationship Resolution

| Option | Description | Selected |
| --- | --- | --- |
| Slug-only theme records with helper-resolved display data | Store related project and writing slugs only; resolve through existing public helpers. | yes |
| Duplicate project/writing display fragments on theme records | Copy project/writing card text into each theme record. | |
| Slug-only relations plus optional theme-local relationship metadata | Store slug relations with extra relationship annotations. | |

**User's choice:** Auto-selected slug-only theme records with helper-resolved display data.
**Notes:** This satisfies THEME-04 by keeping project and writing registries authoritative. Invalid project/writing relationships should fail validation, while display helpers should still filter defensively.

---

## Validation and Curation Gate

| Option | Description | Selected |
| --- | --- | --- |
| Theme-local validator with explicit issue codes | Match current project/writing validators with precise issue codes and no new dependency. | yes |
| Shared curation validation utilities | Refactor duplicate validator logic into shared utilities. | |
| Schema parser plus custom relation checks | Add a schema/parser dependency for boundary validation. | |

**User's choice:** Auto-selected theme-local validator with explicit issue codes.
**Notes:** Phase 19 should wire theme validation into `scripts/verify-curation.ts` beside project and writing validation, with tests for issue-code coverage.

---

## the agent's Discretion

- Exact helper names, type names, status labels, and validation code names may be chosen during planning if they remain consistent with existing project/writing domain patterns.
- Initial theme seed content may be small as long as it is accurate, non-placeholder, and exercises project and writing relationships.

## Deferred Ideas

- Theme route UI belongs to Phase 20.
- Collaboration panels and cross-links belong to Phase 21.
- Metadata, structured data, sitemap behavior, and social preview support belong to Phase 22.
- Static/browser/release verification belongs to Phase 23.
