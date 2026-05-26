---
phase: 03-portfolio-surfaces-seo
reviewed: 2026-05-26T12:42:07Z
depth: standard
files_reviewed: 16
files_reviewed_list:
  - package.json
  - public/favicon.svg
  - scripts/generate-static-metadata.ts
  - scripts/verify-static.ts
  - src/components/SiteLayout.tsx
  - src/domain/foundation.test.ts
  - src/domain/portfolio-surfaces.test.ts
  - src/domain/projects.ts
  - src/domain/routes.ts
  - src/domain/seo.ts
  - src/routes/about.tsx
  - src/routes/contact.tsx
  - src/routes/index.tsx
  - src/routes/projects.tsx
  - src/styles/app.css
findings:
  critical: 0
  warning: 4
  info: 1
  total: 5
status: issues_found
---

# Phase 03: Code Review Report

**Reviewed:** 2026-05-26T12:42:07Z
**Depth:** standard
**Files Reviewed:** 16
**Status:** issues_found

## Summary

Reviewed the Phase 03 portfolio surfaces, pure SEO/domain helpers, static metadata generator, static verifier, favicon, tests, and dark-primary CSS. The implementation is generally structured around the repo's pure-domain and static-output contracts, but I found one current social metadata correctness issue, two verification/curation blind spots, one dark-mode contrast failure visible from code, and one dead assertion in the SEO unit test.

Material guidance applied: repo-local dark-primary rules in `AGENTS.md`, the Bright Builds sidecar and `standards-overrides.md`, the OpenLinks low-intrusion identity placement skill, and the pinned Bright Builds standards for architecture, code shape, verification, testing, and TypeScript/JavaScript at `https://github.com/bright-builds-llc/bright-builds-rules/tree/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards`.

## Warnings

### WR-01: Social preview image metadata uses a relative URL

**File:** `src/domain/seo.ts:70`
**Issue:** `socialImage.url` is `/social/bright-builds-og.png`, and every route emits that value as `og:image` and `twitter:image`. Social crawlers commonly require an absolute image URL, so the generated static HTML can have complete-looking tags while cards fail to render the preview image off-site.
**Fix:**
```ts
const socialImagePath = "/social/bright-builds-og.png";

function socialImageMetadata(profile: Profile): SocialImageMetadata {
  return {
    url: `${profile.canonicalOrigin}${socialImagePath}`,
    width: 1200,
    height: 630,
    alt: "Peter Ryszkiewicz / pRizz and Bright Builds portfolio focus on AI, Bitcoin, open systems, and developer tooling.",
  };
}

export function metadataForRoute(route: SiteRoute, profile: Profile = peterProfile): PageMetadata {
  const canonical = `${profile.canonicalOrigin}${route.path === "/" ? "" : route.path}`;
  const image = socialImageMetadata(profile);

  return {
    title: route.title,
    description: route.description,
    canonical,
    openGraph: { title: route.title, description: route.description, url: canonical, type: "website", image },
    twitter: { card: "summary_large_image", title: route.title, description: route.description, image },
  };
}
```
Also update `portfolio-surfaces.test.ts` and `verify-static.ts` to assert the absolute URL.

### WR-02: Hidden/excluded project records can still render in public groups

**File:** `src/routes/projects.tsx:21`
**Issue:** The public project groups are built from `projectsByPlacement(...)`, which defaults to the full `curatedProjects` registry. The hidden/excluded count checks `includeInProjectIndex === false`, `tier === "excluded"`, and `status === "hidden"`, but those same records would still render if they kept a public placement such as `"supporting"` or `"lab"`. That violates the Phase 03 contract that hidden/excluded records appear only as aggregate context.
**Fix:**
```ts
const publicProjects = visibleProjects().filter(
  (project) =>
    project.placement !== "hidden" &&
    project.tier !== "excluded" &&
    project.status !== "hidden",
);

const flagshipProjects = projectsByPlacement("home", publicProjects);
const supportingProjects = projectsByPlacement("supporting", publicProjects);
const labProjects = projectsByPlacement("lab", publicProjects);
const archiveProjects = projectsByPlacement("archive", publicProjects);
```
Add a focused test fixture with a non-hidden placement plus `includeInProjectIndex: false` or `tier: "excluded"` to prove it never renders as a public card.

### WR-03: Static verifier can validate a stale output tree

**File:** `scripts/verify-static.ts:33`
**Issue:** `findStaticOutputRoot()` chooses the first candidate root with any HTML, and `dist` is checked before `.output/public`. If a stale `dist/` directory is left behind, `bun run verify:static` can validate old HTML instead of the latest SolidStart output, masking metadata, route, or asset regressions from the current build.
**Fix:**
```ts
function findStaticOutputRoot(): string {
  const rootsWithHtml = candidateOutputRoots.filter((root) => htmlFiles(root).length > 0);

  if (rootsWithHtml.length === 1) {
    return rootsWithHtml[0];
  }

  if (rootsWithHtml.length > 1) {
    throw new Error(
      `Multiple static HTML output roots found: ${rootsWithHtml.join(", ")}. Remove stale outputs or set one explicit output root.`,
    );
  }

  throw new Error(
    `No static HTML output found. Checked: ${candidateOutputRoots.join(", ")}. Run bun run build first.`,
  );
}
```
Alternatively, make the expected SolidStart output root explicit and fail when that root is missing.

### WR-04: Card metadata contrast is below the dark-mode accessibility contract

**File:** `src/styles/app.css:240`
**Issue:** `.card-meta` uses `text-zinc-500` on dark card surfaces. Tailwind `zinc-500` (`#71717a`) against the intended card background (`#18181b`) is about 3.67:1, below the WCAG AA 4.5:1 target for 14px text. Role labels such as `Creator` and `Maintainer` are therefore under-contrast on the dark-primary UI.
**Fix:**
```css
.card-meta {
  @apply mt-1 text-sm text-zinc-400;
}
```
`text-zinc-400` gives roughly 6.9:1 on the same surface and keeps the muted hierarchy.

## Info

### IN-01: SEO test contains a no-op assertion

**File:** `src/domain/portfolio-surfaces.test.ts:97`
**Issue:** `expectedMetaProperties` is defined inside the test and then asserted against the same literal array, so that assertion cannot fail and does not prove any metadata behavior. This weakens the test's signal around the social metadata contract.
**Fix:** Remove the assertion or replace it with behavior checks, for example:
```ts
expect(metadata.openGraph.image.url).toBe(
  `${peterProfile.canonicalOrigin}/social/bright-builds-og.png`,
);
expect(metadata.twitter.card).toBe("summary_large_image");
```

***

_Reviewed: 2026-05-26T12:42:07Z_
_Reviewer: the agent (gsd-code-reviewer)_
_Depth: standard_
