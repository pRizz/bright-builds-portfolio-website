---
phase: 28-verification-and-release-contract
reviewed: 2026-06-22T16:43:45Z
depth: standard
files_reviewed: 9
files_reviewed_list:
  - docs/release-readiness.md
  - scripts/release-readiness.ts
  - scripts/release-readiness.test.ts
  - scripts/social-previews/config.ts
  - scripts/verify-release.ts
  - scripts/verify-release.test.ts
  - scripts/verify-static/metadata-jsonld-verifier.ts
  - scripts/verify-static/run-static-verification.ts
  - scripts/verify-static.test.ts
findings:
  critical: 0
  warning: 3
  info: 0
  total: 3
status: issues_found
---

# Phase 28: Code Review Report

**Reviewed:** 2026-06-22T16:43:45Z
**Depth:** standard
**Files Reviewed:** 9
**Status:** issues_found

## Summary

Reviewed the Phase 28 release-readiness docs, release/static verifiers, social preview config, and related tests. This review was informed by `AGENTS.md`, `AGENTS.bright-builds.md`, `standards-overrides.md`, `standards/core/architecture.md`, `standards/core/code-shape.md`, `standards/core/verification.md`, `standards/core/testing.md`, `standards/languages/typescript-javascript.md`, and the low-intrusion OpenLinks guidance.

No critical issues were found. The warnings below are release-contract gaps: they can let local verification overstate external-link policy coverage or static artifact freshness.

## Warnings

### WR-01: Protocol-relative external links bypass release external-link policy

**File:** `scripts/release-readiness.ts:489`
**Issue:** `uniqueExternalAnchorHrefsForRoutes` only returns hrefs that start with an explicit URI scheme. A protocol-relative external link such as `<a href="//docs.example.com/openlinks">` is excluded here, and `scripts/verify-release.ts:569` also treats `href.startsWith("//")` as neither internal nor reportable. That means a generated external anchor can bypass the HTTPS requirement, allowed-origin policy, and sensitive-query scan entirely.
**Fix:** Treat `//...` as an external href and reject it as a protocol-policy violation, or normalize it for origin/query checks while still reporting that explicit `https://` is required. Add a regression test next to the existing uncovered-origin test.

```ts
function isExternalHref(href: string): boolean {
  return /^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith("//");
}

function maybeExternalHttpUrl(href: string): URL | null {
  try {
    const normalizedHref = href.startsWith("//") ? `https:${href}` : href;
    const url = new URL(normalizedHref);
    return url.protocol === "http:" || url.protocol === "https:" ? url : null;
  } catch {
    return null;
  }
}
```

### WR-02: Static verification does not reject stale extra HTML routes

**File:** `scripts/verify-static/run-static-verification.ts:16`
**Issue:** `runStaticVerification` collects every HTML file in `.output/public`, but it only verifies routes from `expectedRoutes`. Extra prerendered HTML left in `.output/public` is scanned for broad asset/text issues by `assertSitemapAssetsAndRobots`, but it is not rejected for being outside `prerenderRoutes` or absent from the sitemap. If the build output is not fully cleaned, a stale route can ship even though `verify:static` reports only the expected route count.
**Fix:** Add a route-set assertion that converts `outputHtmlFiles` to route paths, compares them to `expectedRoutes`, and fails on unexpected HTML routes unless explicitly allowlisted. Add a temp-output test with an extra `stale/index.html`.

```ts
const expectedRoutePaths = new Set(expectedRoutes.map((check) => check.route));
const actualRoutePaths = new Set(outputHtmlFiles.map((path) => routeForOutputHtml(outputRoot, path)));

for (const route of actualRoutePaths) {
  if (!expectedRoutePaths.has(route)) {
    throw new Error(`Unexpected prerendered HTML route in static output: ${route}`);
  }
}
```

### WR-03: Static social-preview manifest check ignores copied PNG byte and SHA drift

**File:** `scripts/verify-static/metadata-jsonld-verifier.ts:311`
**Issue:** `assertSocialPreviewManifestMatchesTarget` validates `routePath`, `assetPath`, dimensions, and `sourceFingerprint`, but it never compares the manifest `byteSize` or `sha256` fields with the actual copied PNG in `.output/public`. `isSocialPreviewManifestEntry` type-checks those fields at `scripts/verify-static/metadata-jsonld-verifier.ts:403`, but a corrupted or stale copied PNG with the right dimensions can still pass `verify:static`, even though the release docs claim static manifest consistency.
**Fix:** Read the copied PNG for the manifest entry, compare `byteSize` and `sha256`, and add tests for mismatched SHA/byte size. Also consider rejecting extra manifest entries so the static artifact exactly matches current generated targets.

```ts
const pngPath = join(outputRoot, maybeEntry.assetPath.replace(/^\//, ""));
const png = readFileSync(pngPath);
const sha256 = createHash("sha256").update(png).digest("hex");

if (maybeEntry.byteSize !== png.length || maybeEntry.sha256 !== sha256) {
  throw new Error(`Social preview manifest entry for ${target.routePath} does not match copied PNG bytes.`);
}
```

---

_Reviewed: 2026-06-22T16:43:45Z_
_Reviewer: the agent (gsd-code-reviewer)_
_Depth: standard_
