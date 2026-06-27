# Phase 30: Content Discovery Foundation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-06-27T00:01:15.464Z
**Phase:** 30 - Content Discovery Foundation
**Mode:** Yolo
**Areas discussed:** Topic identity and normalization, Public content reference shape, Unknown and hidden-input fallback behavior, Validation and phase boundary

---

## Topic Identity and Normalization

| Option | Description | Selected |
| --- | --- | --- |
| Explicit `TopicRecord` registry plus alias map | Stable public slugs, curated display labels, casing preservation, strong collision tests. Adds manual curation and alias maintenance. | Yes |
| Derive-only normalized index from public labels | Smallest data surface and automatically follows current registries. Risks route churn, label instability, and surprising collision policy. |  |
| Public theme records as topic authority | Reuses public theme status and validation. Under-includes useful labels and conflates themes with discovery facets. |  |

**User's choice:** Auto-selected explicit canonical topic registry plus alias map.
**Notes:** Stable topic routes and leak prevention matter more than avoiding a small curated vocabulary. Themes can contribute labels but should not become the sole topic authority.

---

## Public Content Reference Shape

| Option | Description | Selected |
| --- | --- | --- |
| Topic-only registry | Simple topic API. Later consumers would still re-fetch records and risk re-implementing visibility. |  |
| Unified public reference envelope | Discriminated safe public reference for project, writing, and theme records with paths, labels, topics, and limited facets. | Yes |
| Full public records with flags | Fast for consumers but exposes too much registry shape and makes bypassing helpers easier. |  |
| Per-consumer DTO factories over common eligibility | Keeps each payload tight but can drift unless a shared reference contract stays strict. |  |

**User's choice:** Auto-selected unified `PublicContentReference`-style envelope.
**Notes:** Later filters, feeds, related-work helpers, and previews should consume safe references instead of full registry records or parallel visibility checks.

---

## Unknown and Hidden-Input Fallback Behavior

| Option | Description | Selected |
| --- | --- | --- |
| Null-only public lookup helpers | Matches existing `maybe...` helpers, treats unknown and non-public records as absent, prevents reason leakage. | Yes |
| Sanitized result union | Useful for internal diagnostics, but reason fields could leak into route copy or metadata if misused. |  |
| Throw or fail fast | Good for curation checks, poor visitor fallback behavior. |  |
| Generic fallback topic object | Simplifies rendering but risks soft-404 pages and hidden-reference confusion. |  |

**User's choice:** Auto-selected null-only visitor-facing lookup behavior with detailed reasons reserved for validation findings.
**Notes:** Unknown, malformed, draft, hidden, archived, unsupported, and private inputs should all resolve to `null` through public helpers.

---

## Validation and Phase Boundary

| Option | Description | Selected |
| --- | --- | --- |
| Validation-only foundation | Smallest scope and fits curation verification, but may under-spec later consumers. |  |
| Contract plus route-safe public reference model | Adds pure helpers, topic/reference validation, and safe paths without building route/UI/feed/preview surfaces. | Yes |
| Downstream dry-run adapters | Proves later consumers early but pulls future phase behavior into Phase 30. |  |
| Early end-to-end feature checks | Broadest proof but collapses Phases 31-36 and increases churn. |  |

**User's choice:** Auto-selected contract plus route-safe public reference model.
**Notes:** Phase 30 should include pure domain helpers, focused tests, and curation validation wired into `verify-curation.ts`. Route rendering, static HTML, metadata, sitemap, chips, filtering UI, RSS, related-work panels, social previews, browser checks, and release evidence stay in later phases.

---

## the agent's Discretion

- Exact helper/type names and validation code names.
- Whether the public discovery contract is implemented as `topics.ts`, `discovery.ts`, or a similarly obvious domain module.
- Initial canonical topic ordering method, provided it stays deterministic and validation catches unmapped public labels.

## Deferred Ideas

- Topic route pages, linked chips, filter/search UI, feeds, related-work panels, preview assets, browser checks, and release evidence updates are deferred to Phases 31-36.
