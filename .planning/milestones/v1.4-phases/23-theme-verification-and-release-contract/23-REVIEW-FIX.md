---
phase: 23-theme-verification-and-release-contract
fixed_at: 2026-06-18T05:47:43Z
review_path: .planning/phases/23-theme-verification-and-release-contract/23-REVIEW.md
iteration: 1
findings_in_scope: 2
fixed: 2
skipped: 0
status: all_fixed
---

# Phase 23: Code Review Fix Report

**Fixed at:** 2026-06-18T05:47:43Z
**Source review:** `.planning/phases/23-theme-verification-and-release-contract/23-REVIEW.md`
**Iteration:** 1

**Summary:**
- Findings in scope: 2
- Fixed: 2
- Skipped: 0

## Fixed Issues

### WR-01: Release Document Contract Can Pass Negated Or Misleading Claims

**Files modified:** `scripts/release-readiness.ts`, `scripts/release-readiness.test.ts`
**Commit:** 22d8082
**Applied fix:** Replaced loose required-fact substring checks with positive release-readiness document regex contracts, kept missing-fact messages stable, and added a regression fixture proving negated mentions of `bun run verify` and `bun run verify:browser` fail.

### WR-02: Release Evidence Labels Include Manual Deployment And Smoke Checks

**Files modified:** `scripts/release-readiness.ts`, `scripts/release-readiness.test.ts`, `scripts/verify-release.ts`, `scripts/verify-release.test.ts`
**Commit:** 9855427
**Applied fix:** Split automated release-readiness evidence labels from manual release checklist labels, updated the release verifier to print only automated evidence labels, and adjusted tests so manual deployment and smoke-check obligations remain separate.

---

_Fixed: 2026-06-18T05:47:43Z_
_Fixer: the agent (gsd-code-fixer)_
_Iteration: 1_
