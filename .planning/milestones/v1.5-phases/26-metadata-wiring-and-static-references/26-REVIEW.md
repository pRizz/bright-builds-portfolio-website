---
phase: 26-metadata-wiring-and-static-references
reviewed: 2026-06-21T22:35:41Z
generated_at: 2026-06-21T22:35:41Z
generated_by: gsd-code-reviewer
lifecycle_mode: yolo
phase_lifecycle_id: 26-2026-06-21T21-29-16
depth: standard
files_reviewed: 18
files_reviewed_list:
  - src/domain/sha256.ts
  - src/domain/seo.ts
  - src/domain/social-previews.ts
  - src/domain/project-detail-routes.test.ts
  - src/domain/writing-metadata.test.ts
  - src/domain/portfolio-surfaces.test.ts
  - src/domain/foundation.test.ts
  - src/routes/index.tsx
  - src/routes/about.tsx
  - src/routes/contact.tsx
  - src/routes/projects/index.tsx
  - src/routes/projects/[slug].tsx
  - src/routes/writing/index.tsx
  - src/routes/writing/[slug].tsx
  - src/routes/themes/index.tsx
  - src/routes/themes/[slug].tsx
  - scripts/verify-static/metadata-jsonld-verifier.ts
  - scripts/verify-static.test.ts
findings:
  critical: 0
  warning: 1
  info: 0
  total: 1
status: issues_found
---

# Phase 26: Code Review Report

**Reviewed:** 2026-06-21T22:35:41Z
**Depth:** standard
**Files Reviewed:** 18
**Status:** issues_found

## Summary

Reviewed the Phase 26 metadata wiring, route head rendering, domain tests, and static verification updates against `AGENTS.md`, `AGENTS.bright-builds.md`, `standards/core/architecture.md`, `standards/core/code-shape.md`, `standards/core/testing.md`, `standards/core/verification.md`, `standards/languages/typescript-javascript.md`, and the OpenLinks identity guidance. The main covered route metadata path is helper-derived and verified, OpenLinks remains low-intrusion through visible/about links and `Person.sameAs`, and the static verifier now checks route-correct generated assets for prerendered pages.

One fallback-path issue remains: dynamic unknown-slug surfaces do not consistently emit the generic fallback social image metadata required by Phase 26 decision D-04.

## Warnings

### WR-01: Unknown slug fallback metadata does not use the generic fallback social image

**File:** `src/routes/themes/[slug].tsx:275`
**Issue:** `themeFallbackMetadata()` builds the unknown-theme fallback from `metadataForRoute(routeByPath("/themes"))`. After Phase 26, `/themes` is a covered social-preview target, so this fallback emits the generated themes-index image (`/social/generated/themes/index-...png`) instead of `/social/bright-builds-og.png`. The other dynamic fallbacks are also incomplete for this contract: `src/routes/projects/[slug].tsx:47` renders the project-not-found body without head/social metadata, and `src/routes/writing/[slug].tsx:37` renders only title and description. This conflicts with the phase context decision that not-found/fallback surfaces stay on the fallback social image, and static verification does not catch it because unknown slugs are not prerendered.

**Fix:**
Add a domain-owned fallback metadata helper or extend the existing metadata helper with an explicit fallback-image mode, then use it in all dynamic route fallbacks and add focused tests.

```ts
// Example shape in src/domain/seo.ts
export function metadataForFallbackPage(input: {
  title: string;
  description: string;
  canonicalPath: string;
  profile?: Profile;
}): PageMetadata {
  const profile = input.profile ?? peterProfile;
  const canonical = `${profile.canonicalOrigin}${input.canonicalPath}`;
  const image = socialImageForFallback(profile);

  return {
    title: input.title,
    description: input.description,
    canonical,
    openGraph: {
      title: input.title,
      description: input.description,
      url: canonical,
      type: "website",
      image,
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      image,
    },
  };
}
```

Then render the same full head block used by valid detail routes for project, writing, and theme fallback branches. Add tests that assert unknown-slug fallback metadata uses `SOCIAL_PREVIEW_FALLBACK_IMAGE.assetPath` and includes `og:image:type`.

## Verification

- `bun run test src/domain/project-detail-routes.test.ts src/domain/writing-metadata.test.ts src/domain/portfolio-surfaces.test.ts src/domain/foundation.test.ts scripts/verify-static.test.ts` - passed, 64 tests.
- `bun run typecheck` - passed.
- `bun run format:check` - passed.
- `bun run check` - passed.
- `bun run verify:static` - passed against existing `.output/public`, 16 prerendered routes.
- `bun run verify:social-previews` - passed, 13 deterministic social preview PNGs and manifest entries.
- Targeted SHA-256 comparison against Node `crypto` for empty, ASCII, Unicode, and longer inputs - passed.

## Residual Risk

No browser visual pass was run during this review because Phase 26 is metadata/static-reference focused and the scoped changes do not alter visible layout except existing fallback branches. The warning above is not covered by current static verification because unknown dynamic slugs are intentionally not prerendered.

---

_Reviewed: 2026-06-21T22:35:41Z_
_Reviewer: the agent (gsd-code-reviewer)_
_Depth: standard_
