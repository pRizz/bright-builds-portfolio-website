# Phase 26: Metadata Wiring and Static References - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-06-21T21:31:28.459Z
**Phase:** 26-Metadata Wiring and Static References
**Mode:** Yolo
**Areas discussed:** Metadata image resolution, Open Graph and Twitter output, structured data image parity, static verification

---

## Metadata Image Resolution

| Option | Description | Selected |
|--------|-------------|----------|
| Helper-derived route lookup | Resolve covered routes through `maybeSocialPreviewTargetForRoutePath()` and generic routes through the fallback image. | yes |
| Hand-authored route map | Maintain a separate route-to-image table. | |
| Route-file hard-coding | Put generated image paths directly in Solid route components. | |

**User's choice:** Auto-selected helper-derived route lookup.
**Notes:** This follows Phase 24/25 decisions and prevents drift between generator, metadata, and verification.

---

## Open Graph and Twitter Output

| Option | Description | Selected |
|--------|-------------|----------|
| Route-specific generated PNG metadata for covered routes | Use canonical generated PNG URLs, dimensions, alt text, and `image/png` type before hydration. | yes |
| Keep fallback everywhere | Preserve current behavior and ignore generated route assets. | |
| Add dynamic OG endpoint | Generate social cards at request time. | |

**User's choice:** Auto-selected route-specific generated PNG metadata for covered routes.
**Notes:** Dynamic endpoints are explicitly out of scope for v1.5.

---

## Structured Data Image Parity

| Option | Description | Selected |
|--------|-------------|----------|
| Match detail JSON-LD images to page metadata | Project, writing, and theme detail JSON-LD use the same image asset as Open Graph and Twitter metadata. | yes |
| JSON-LD keeps fallback | Only Open Graph/Twitter use generated images. | |
| Add images broadly to every ItemList item | Expand every structured-data list item beyond the scoped detail requirements. | |

**User's choice:** Auto-selected detail JSON-LD parity with page metadata.
**Notes:** The requirement is detail record parity; index ItemList expansion is not necessary for this phase unless existing schema fields require it.

---

## Static Verification

| Option | Description | Selected |
|--------|-------------|----------|
| Update verifier to enforce generated assets for covered routes and fallback for generic routes | Keep canonical origin and local asset checks while adding route-aware expected image behavior. | yes |
| Loosen verifier image checks | Avoid failures by accepting any local social image. | |
| Defer verifier updates to Phase 28 | Implement metadata now and wait for later verification. | |

**User's choice:** Auto-selected route-aware static verification.
**Notes:** Phase 26 success criteria include generated HTML metadata, so verifier coverage belongs in this phase.

---

## the agent's Discretion

- Exact helper names and small type reshapes.
- Whether to extract shared head-tag rendering.

## Deferred Ideas

- Freshness reporting stays in Phase 27.
- Release evidence labels and budget expansion stay in Phase 28.
- Generic route-specific previews for home/about/contact stay future work.
