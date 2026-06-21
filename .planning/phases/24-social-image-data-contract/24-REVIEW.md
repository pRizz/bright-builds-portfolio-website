---
phase: 24-social-image-data-contract
reviewed: 2026-06-21T14:52:27Z
depth: standard
files_reviewed: 2
files_reviewed_list:
  - src/domain/social-previews.ts
  - src/domain/social-previews.test.ts
findings:
  critical: 0
  warning: 3
  info: 0
  total: 3
status: issues_found
---

# Phase 24: Code Review Report

**Reviewed:** 2026-06-21T14:52:27Z
**Depth:** standard
**Files Reviewed:** 2
**Status:** issues_found

## Summary

Reviewed `src/domain/social-previews.ts` and `src/domain/social-previews.test.ts` against the Phase 24 plan, context, research, repo-local `AGENTS.md`, `AGENTS.bright-builds.md`, `standards-overrides.md`, and the relevant Bright Builds architecture, code-shape, testing, verification, and TypeScript standards.

The module is pure and composes the intended public route helpers, but three Phase 24 contract gaps remain: the default target set currently fails its own text-budget validator, the exported fingerprint helper still depends on nested object insertion order, and asset validation accepts non-canonical slug shapes that the plan said should be rejected.

Verification run during review:

- `bun run test src/domain/social-previews.test.ts` passed.
- `bun run typecheck` passed.
- `bun run check` passed.
- A direct `validateSocialPreviewTargets()` probe returned 3 default findings, all `text-too-long` on `alt`.

## Warnings

### WR-01: Default Targets Fail Their Own Alt-Text Budget

**File:** `src/domain/social-previews.ts:180`
**Issue:** The current route-specific alt templates can exceed `SOCIAL_PREVIEW_TEXT_BUDGETS.maxAltCharacters` for checked-in content. A direct call to `validateSocialPreviewTargets()` returned `text-too-long` findings for `/projects/win3bitcoin` (`alt` length 190), `/writing/portable-identity-and-owned-surfaces` (`alt` length 202), and `/themes/agentic-engineering` (`alt` length 191). That means the default Phase 24 target inventory does not satisfy its own validation contract, and later generator or release verification consumers would inherit failing targets. The same template pattern appears at lines 195 and 214.
**Fix:**
```typescript
// Keep route-specific alt text, but reduce repeated boilerplate so current
// source content fits the exported budget.
alt: `Social preview for ${project.name}: ${project.oneLine}`,
alt: `Social preview for ${entry.title}: ${entry.summary}`,
alt: `Social preview for ${theme.title}: ${theme.summary}`,
```

Also add a regression assertion so future content changes cannot silently exceed the contract:

```typescript
expect(validateSocialPreviewTargets()).toEqual([]);
```

### WR-02: Fingerprints Depend On Nested Dimensions Object Insertion Order

**File:** `src/domain/social-previews.ts:130`
**Issue:** `sourceFingerprintForSocialPreviewPayload()` normalizes top-level key order and sorts labels, but it passes `payload.dimensions` through directly. Two semantically identical payloads with `{ width: 1200, height: 630 }` and `{ height: 630, width: 1200 }` produce different fingerprints (`28507596c463` vs. `6809a7c6f2b3` in a review probe). Phase 24 D-11 requires stable hashing that does not depend on object insertion order.
**Fix:**
```typescript
const stablePayload = {
  alt: payload.alt,
  description: payload.description,
  dimensions: {
    width: payload.dimensions.width,
    height: payload.dimensions.height,
  },
  kicker: payload.kicker,
  kind: payload.kind,
  labels: [...payload.labels].sort(),
  routePath: payload.routePath,
  title: payload.title,
};
```

Add a test case that a payload with reordered `dimensions` produces the same fingerprint.

### WR-03: Asset Validation Accepts Non-Canonical Slug Shapes

**File:** `src/domain/social-previews.ts:101`
**Issue:** The validator pattern allows any run of lowercase letters, digits, and dashes before the fingerprint, so paths such as `/social/generated/projects/bad--slug-123456789abc.png` pass validation with no findings. The Phase 24 plan says slug segments must match `^[a-z0-9]+(?:-[a-z0-9]+)*$|^index$` and that future source slugs that fail this shape should be caught by validation.
**Fix:**
```typescript
const generatedAssetPathPattern =
  /^\/social\/generated\/(projects|writing|themes)\/(?:index|[a-z0-9]+(?:-[a-z0-9]+)*)-[a-f0-9]{12}\.png$/;
```

Add validation fixture coverage for a leading dash, trailing dash, and consecutive dash slug segment.

---

_Reviewed: 2026-06-21T14:52:27Z_
_Reviewer: the agent (gsd-code-reviewer)_
_Depth: standard_
