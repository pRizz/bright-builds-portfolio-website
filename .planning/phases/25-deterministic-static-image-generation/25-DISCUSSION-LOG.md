# Phase 25: Deterministic Static Image Generation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-06-21T16:05:18.226Z
**Phase:** 25-Deterministic Static Image Generation
**Mode:** Yolo
**Areas discussed:** Renderer and template inputs, generated asset ownership, manifest and check mode, integration with existing verification

---

## Renderer and Template Inputs

| Option | Description | Selected |
| --- | --- | --- |
| Bun TypeScript SVG templates with `@resvg/resvg-js@2.6.2` | Narrow local SVG-to-PNG renderer recommended by milestone research; avoids browser screenshot nondeterminism. | yes |
| Browser screenshot generation | Uses Playwright screenshots but risks host/browser antialiasing drift and broadens the stack. | |
| Dynamic OG/runtime generation | Adds server/runtime behavior and violates the static deployment boundary. | |

**User's choice:** Auto-selected the research-backed local SVG-to-PNG renderer.
**Notes:** Keep all renderer inputs checked in and local. No remote fonts, remote images, clocks, randomness, secrets, host fonts, or visitor-runtime generation.

---

## Generated Asset Ownership

| Option | Description | Selected |
| --- | --- | --- |
| Managed `public/social/generated/` output from Phase 24 asset paths | Uses `socialPreviewTargets()` as the only route-image source and confines cleanup to the generated directory. | yes |
| Hand-maintained route-to-image map | Easier initially but duplicates route state and is explicitly out of scope. | |
| Replace fallback image during generation | Would risk deleting or overwriting unrelated public assets and break generic-route fallback behavior. | |

**User's choice:** Auto-selected managed generated output derived from the existing contract.
**Notes:** Generated PNGs should be checked in. The fallback `public/social/bright-builds-og.png` remains owned outside this managed directory.

---

## Manifest and Check Mode

| Option | Description | Selected |
| --- | --- | --- |
| Timestamp-free manifest plus strict check mode | Records route path, asset path, dimensions, byte size, source fingerprint, and file checksum; check mode catches drift and stale assets. | yes |
| PNGs only with no manifest | Leaves freshness and review evidence weak. | |
| Manifest with generated timestamps | Makes repeated generation noisy and undermines deterministic diffs. | |

**User's choice:** Auto-selected deterministic manifest and strict check mode.
**Notes:** Check mode should fail for missing, stale, wrong-dimension, oversized, blank, orphaned, or non-deterministically regenerated assets.

---

## Integration With Existing Verification

| Option | Description | Selected |
| --- | --- | --- |
| Add `generate:social-previews` and `verify:social-previews`, then wire check mode before build in `bun run verify` | Gives maintainers explicit commands and protects aggregate verification before static build. | yes |
| Keep social preview checks manual only | Would not satisfy Phase 25 check-mode success criteria. | |
| Fold metadata wiring into this phase | Would cross into Phase 26 and widen the blast radius. | |

**User's choice:** Auto-selected explicit package scripts and aggregate verify integration.
**Notes:** Keep Phase 26 metadata wiring deferred. Existing fallback metadata can remain until route-specific metadata wiring is deliberately scoped.

---

## the agent's Discretion

- Exact SVG layout and template helper structure.
- Exact manifest filename and finding-code naming.
- Whether to add a cheap local contact sheet or review artifact after required generator/check behavior passes.

## Deferred Ideas

- Route-specific metadata and JSON-LD image wiring.
- Freshness reports over generated media.
- Broader release-readiness documentation and evidence-label expansion.
