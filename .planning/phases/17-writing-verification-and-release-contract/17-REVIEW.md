---
phase: 17-writing-verification-and-release-contract
reviewed: 2026-06-14T19:25:04Z
depth: standard
files_reviewed: 6
files_reviewed_list:
  - tests/browser-release.playwright.ts
  - docs/release-readiness.md
  - scripts/release-readiness.ts
  - scripts/release-readiness.test.ts
  - scripts/verify-release.test.ts
  - scripts/verify-static.ts
findings:
  critical: 0
  warning: 0
  info: 0
  total: 0
status: clean
---

# Phase 17: Code Review Report

**Reviewed:** 2026-06-14T19:25:04Z
**Depth:** standard
**Files Reviewed:** 6
**Status:** clean after fixes

## Summary

Reviewed the Phase 17 release-readiness document, release helper, static verifier, browser release suite, and related tests. This review was informed by `AGENTS.md` repo-local release and dark-primary guidance, `AGENTS.bright-builds.md`, `standards-overrides.md`, the Bright Builds architecture/code-shape/testing/verification/TypeScript standards, and OpenLinks identity-presence guidance.

The static verifier wording is scoped to local static output. Initial review found two warning-level correctness gaps; both were fixed before phase verification.

## Warnings

### WR-01: Primary GitHub Presence Check Accepts Any GitHub Link - RESOLVED

**File:** `scripts/release-readiness.ts:64`
**Issue:** `requiredPrimaryExternalHrefs` uses `https://github.com/` for the primary GitHub requirement. Because project source links such as `https://github.com/pRizz/open-links` contain that substring, `externalLinkFindingsForRoutes` can pass even if the actual primary profile/contact link `https://github.com/pRizz` is removed. That makes the "primary GitHub and OpenLinks paths must remain present" release fact weaker than the document claims.
**Fix:**
```ts
import { peterProfile } from "../src/domain/profile";

const requiredPrimaryExternalHrefs = peterProfile.links
  .filter((link) => link.kind === "code" || link.kind === "identity")
  .map((link) => link.href);
```
Add a regression test where the only GitHub URL is a project repository link and assert that `primary external link presence` is reported for the missing profile URL.

**Resolution:** `scripts/release-readiness.ts` now derives required primary code and identity links from `peterProfile.links`, and `scripts/release-readiness.test.ts` rejects a fixture where only a project repository GitHub link remains.

### WR-02: Browser Coverage Contract Overclaims Detail Route Breadth - RESOLVED

**File:** `tests/browser-release.playwright.ts:93-95`
**Issue:** The keyboard test chooses one `representativeWritingDetailRoute()`, and the reduced-motion route list later uses one representative project detail route plus one representative writing detail route. Current data has two public writing detail routes and six project detail routes, while `docs/release-readiness.md:55` and the required fact in `scripts/release-readiness.ts:108-110` say writing/project detail browser coverage includes axe, layout, keyboard, and reduced-motion coverage for public/selected detail routes. Axe and layout run across `prerenderRoutes`; keyboard and reduced-motion do not.
**Fix:** Either broaden the Playwright checks to iterate the full detail route sets, or narrow the release-readiness wording and required fact to representative smoke coverage. For example:
```ts
const routes = ["/", ...projectDetailRoutes(), "/writing", ...writingDetailRoutes()] as const;

for (const route of routes) {
  await assertReducedMotionStableOnRoute(page, route);
}
```
If the intended contract is representative coverage, update `docs/release-readiness.md`, `requiredReleaseReadinessDocumentFacts`, and the document-contract tests to say that keyboard and reduced-motion are representative detail-route smoke checks.

**Resolution:** The release-readiness document and required facts now distinguish exhaustive axe/layout coverage from representative keyboard and reduced-motion checks for selected project and public writing detail routes.

---

_Reviewed: 2026-06-14T19:25:04Z_
_Reviewer: the agent (gsd-code-reviewer)_
_Depth: standard_
