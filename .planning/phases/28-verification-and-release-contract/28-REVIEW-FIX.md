---
phase: 28-verification-and-release-contract
fixed_at: 2026-06-22T16:49:51Z
review_path: .planning/phases/28-verification-and-release-contract/28-REVIEW.md
iteration: 1
findings_in_scope: 3
fixed: 3
skipped: 0
status: all_fixed
---

# Phase 28: Code Review Fix Report

**Fixed at:** 2026-06-22T16:49:51Z
**Source review:** `.planning/phases/28-verification-and-release-contract/28-REVIEW.md`
**Iteration:** 1

**Summary:**
- Findings in scope: 3
- Fixed: 3
- Skipped: 0

## Fixed Issues

### WR-01: Protocol-relative external links bypass release external-link policy

**Files modified:** `scripts/release-readiness.ts`, `scripts/release-readiness.test.ts`
**Commit:** 2117667
**Applied fix:** Treated `//...` anchors as external hrefs, normalized them for origin and sensitive-query checks, and kept them as protocol-policy findings that require explicit HTTPS. Added regression coverage for protocol-relative external links.

### WR-02: Static verification does not reject stale extra HTML routes

**Files modified:** `scripts/verify-static/run-static-verification.ts`, `scripts/verify-static.test.ts`
**Commit:** 2117667
**Applied fix:** Added an expected-route set assertion that maps generated HTML files back to route paths and fails on unexpected prerendered HTML. Added temp-output regression coverage for a stale `/stale` route.

### WR-03: Static social-preview manifest check ignores copied PNG byte and SHA drift

**Files modified:** `scripts/verify-static/metadata-jsonld-verifier.ts`, `scripts/verify-static.test.ts`
**Commit:** 2117667
**Applied fix:** Compared each covered route manifest entry's `byteSize` and `sha256` to the copied PNG bytes in `.output/public`. Added regression coverage for mismatched byte size and SHA values.

**Verification:**
- `bun run format` passed.
- `bun run check` passed.
- `bun run typecheck` passed.
- `bun run test scripts/release-readiness.test.ts scripts/verify-static.test.ts scripts/verify-release.test.ts` passed, 63 tests.
- `bun run build` passed, prerendering 16 routes.
- `bun run verify:static` passed.
- `bun run verify:release` passed.

---

_Fixed: 2026-06-22T16:49:51Z_
_Fixer: the agent_
_Iteration: 1_
