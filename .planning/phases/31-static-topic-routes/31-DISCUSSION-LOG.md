---
generated_by: gsd-discuss-phase
lifecycle_mode: yolo
phase_lifecycle_id: 31-2026-06-30T22-33-56
generated_at: 2026-06-30T22:33:56.035Z
---

# Phase 31: Static Topic Routes - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-06-30T22:33:56.035Z
**Phase:** 31-Static Topic Routes
**Mode:** Yolo
**Areas discussed:** Topic route shape and layout, topic linking across public surfaces, metadata and static discovery, fallback safety, verification and browser coverage, OpenLinks and product chrome

## Topic Route Shape and Layout

| Option | Description | Selected |
| --- | --- | --- |
| Static topic index plus detail pages | Build `/topics` and every public `/topics/{slug}` route from `publicTopics()` with pre-hydration content. | yes |
| Detail routes only | Link chips to topics without an index route. | |
| Index route only | Show a topic index without canonical detail pages. | |

**User's choice:** Static topic index plus detail pages.
**Notes:** Selected because Phase 31 maps to DISC-01 and DISC-02 and the roadmap requires both `/topics` and `/topics/{slug}`.

## Topic Linking Across Public Surfaces

| Option | Description | Selected |
| --- | --- | --- |
| Link only validated canonical labels | Use `maybeTopicRecordForLabel()` to decide whether a chip links to `/topics/{slug}`; unsupported labels stay inert. | yes |
| Link every raw label by slugifying it | Easier UI change, but would create unsupported public routes and leak raw label assumptions. | |
| Leave all chips inert | Avoids risk but fails DISC-03. | |

**User's choice:** Link only validated canonical labels.
**Notes:** Carries forward Phase 30's public-only topic contract and keeps unsupported labels non-leaking.

## Metadata and Static Discovery

| Option | Description | Selected |
| --- | --- | --- |
| Helper-derived metadata, JSON-LD, sitemap, and prerender routes | Extend `routes.ts` and `seo.ts` so route rendering and verification share topic helpers. | yes |
| Route-local metadata constants | Faster for one page, but would drift from sitemap/static verification. | |
| Defer metadata until preview polish | Would fail DISC-05 and crawler-readable static page requirements. | |

**User's choice:** Helper-derived metadata, JSON-LD, sitemap, and prerender routes.
**Notes:** Keeps the existing domain helper pattern used by projects, writing, themes, and static verification.

## Fallback Safety

| Option | Description | Selected |
| --- | --- | --- |
| One non-leaking fallback page | Unknown, unsupported, hidden, or non-public topic slugs render the same public fallback and canonicalize back to `/topics`. | yes |
| Reason-specific fallback pages | Gives maintainers more information, but would expose hidden-content distinctions to visitors. | |
| Generate placeholder topics | Would create synthetic public topics that Phase 30 explicitly rejected. | |

**User's choice:** One non-leaking fallback page.
**Notes:** Mirrors project, writing, and theme fallback behavior while preserving Phase 30's no-reason public lookup rule.

## Verification and Browser Coverage

| Option | Description | Selected |
| --- | --- | --- |
| Extend unit, static, sitemap, metadata, browser, and aggregate verification | Add focused tests and update existing route-driven browser/static gates. | yes |
| Unit tests only | Too weak for static crawler-readable output and route metadata. | |
| Browser-only smoke | Too weak for helper-derived route, sitemap, and hidden-content safety. | |

**User's choice:** Extend unit, static, sitemap, metadata, browser, and aggregate verification.
**Notes:** Required by DISC-05 and repo-local dark/mobile visual verification guidance.

## OpenLinks and Product Chrome

| Option | Description | Selected |
| --- | --- | --- |
| Preserve existing low-intrusion OpenLinks placement | Keep footer/profile/metadata identity discoverability, with topic pages focused on content discovery. | yes |
| Add topic-page OpenLinks CTAs | More promotion, but conflicts with the local product-chrome posture. | |
| Remove OpenLinks from topic metadata | Unnecessary because existing Person sameAs/footer identity is already stable and low intrusion. | |

**User's choice:** Preserve existing low-intrusion OpenLinks placement.
**Notes:** Follows Bright Builds sidecar guidance and the `openlinks-identity-presence` skill: visible footer link first, metadata second, no repetitive promotion.

## the agent's Discretion

- Exact component boundaries and helper names.
- Exact concise copy for topic summaries and count labels.
- Whether a topic-chip helper is a component or local rendering function.
- The smallest practical browser-check additions beyond route-loop coverage.

## Deferred Ideas

- Filtering/search controls.
- Static feed output.
- Centralized related-work ranking.
- Generated generic/topic social preview assets.
- Release evidence label expansion.
