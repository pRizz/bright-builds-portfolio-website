# Phase 24: Social Image Data Contract - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-21T14:02:37.233Z
**Phase:** 24-Social Image Data Contract
**Mode:** Yolo
**Areas discussed:** Route coverage and public filtering, target shape, asset paths and fingerprints, text budgets and validation, fallback behavior

---

## Route Coverage and Public Filtering

| Option | Description | Selected |
| --- | --- | --- |
| Compose existing public route helpers | Derive share targets from existing route/domain helpers so visibility stays centralized. | yes |
| Maintain a separate social image route list | Hand-author covered route paths specifically for social images. | |
| Include all visible index projects and content records | Broaden target generation beyond selected/public detail routes. | |

**User's choice:** Compose existing public route helpers.
**Notes:** Selected as the recommended default because Phase 24's goal is one route-derived contract and the repo already has public helper surfaces for projects, writing, themes, routes, sitemap, and prerendering.

---

## Target Shape

| Option | Description | Selected |
| --- | --- | --- |
| Typed target records with explicit fields | Export a route-target contract containing path, asset, text, labels, alt, dimensions, and fingerprint. | yes |
| Reuse existing `PageMetadata` as the target | Avoid a new target type by adapting SEO metadata directly. | |
| Minimal path-only target list | Derive just routes and image paths now, leaving text fields for the generator. | |

**User's choice:** Typed target records with explicit fields.
**Notes:** Selected because later generation, metadata, freshness, and verification phases all need the same data and cannot safely reconstruct it independently.

---

## Asset Paths and Fingerprints

| Option | Description | Selected |
| --- | --- | --- |
| Digest-backed generated paths under `/social/generated/` | Group assets by family and include a deterministic digest from route source data. | yes |
| Slug-only paths under `/social/` | Use durable readable paths without cache-busting digests. | |
| Manifest-only fingerprints | Keep stable image paths and store drift information only in a manifest. | |

**User's choice:** Digest-backed generated paths under `/social/generated/`.
**Notes:** Selected from v1.5 research because it gives crawler cache busting and deterministic drift evidence without runtime services or a hand-maintained asset map.

---

## Text Budgets and Validation

| Option | Description | Selected |
| --- | --- | --- |
| Validate conservative template budgets in Phase 24 | Reject text/path/duplicate/kind/dimension issues before image generation exists. | yes |
| Defer text validation to the generator | Let Phase 25 decide whether text fits once rendering exists. | |
| Only validate required fields and duplicates | Keep Phase 24 minimal and accept possible clipping risk later. | |

**User's choice:** Validate conservative template budgets in Phase 24.
**Notes:** Selected because SHARE-04 explicitly requires rejecting text that cannot fit template rules. Exact constant names and budgets remain implementation discretion.

---

## Fallback Behavior

| Option | Description | Selected |
| --- | --- | --- |
| Keep generic routes on the checked-in fallback | Exclude generic routes from target list and preserve `/social/bright-builds-og.png`. | yes |
| Generate route-specific images for all top-level routes | Include home/about/contact in Phase 24 targets. | |
| Treat fallback as a normal generated target | Move fallback into the generated image set. | |

**User's choice:** Keep generic routes on the checked-in fallback.
**Notes:** Selected because SHARE-05 requires generic routes outside the v1.5 share target set to keep the checked-in fallback image.

---

## the agent's Discretion

- Exact TypeScript type names, helper names, finding-code names, budget constants, and digest length.
- Whether fallback is exposed as a named constant or helper, as long as fallback routes are not included in route-specific target lists.

## Deferred Ideas

- Static PNG generation and manifest writing are deferred to Phase 25.
- Metadata and JSON-LD image wiring are deferred to Phase 26.
- Freshness reporting is deferred to Phase 27.
- Aggregate release verification and documentation updates are deferred to Phase 28.
