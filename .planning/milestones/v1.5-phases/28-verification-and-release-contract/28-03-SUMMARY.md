---
phase: 28-verification-and-release-contract
plan: 03
subsystem: verification
tags: [bun, typescript, vitest, release-readiness, social-previews]

requires:
  - phase: 27-freshness-reports-and-reviewed-snapshot-policy
    provides: Offline freshness report severity taxonomy and manual smoke boundary.
  - phase: 28-verification-and-release-contract
    provides: Social preview static verification and generated preview release budget contracts from plans 28-01 and 28-02.
provides:
  - Release-readiness documentation for social preview generation, read-only verification, static output checks, release budgets, freshness reports, and manual social-card smoke checks.
  - Executable release-readiness document facts for generated social preview manifests, budget wording, manual/live boundaries, clean-builder sequence, and low-intrusion OpenLinks posture.
  - Aggregate verify script tests proving deterministic social preview checks run before build and that live/networked generation, sync, hosted, and browser install steps stay outside `bun run verify`.
affects: [release-verification, social-previews, freshness-reports, release-docs]

tech-stack:
  added: []
  patterns:
    - Required release documentation facts are enforced through focused Vitest fixture-removal tests.
    - Aggregate release command boundaries are tested as exact script text plus explicit order and exclusion assertions.

key-files:
  created:
    - .planning/phases/28-verification-and-release-contract/28-03-SUMMARY.md
  modified:
    - docs/release-readiness.md
    - scripts/release-readiness.ts
    - scripts/release-readiness.test.ts

key-decisions:
  - "Keep social-card crawler validation, live GitHub state, live external-link reachability, and preview/production smoke checks as manual or explicit opt-in work outside `bun run verify`."
  - "Treat OpenLinks only as identity/external-link policy context in release docs, not as a primary route CTA or brand replacement."
  - "Leave `package.json` unchanged and guard the existing aggregate verify contract from tests."

patterns-established:
  - "Release-readiness docs now have a dedicated Social Preview Assets section with exact generation and read-only verification commands."
  - "Doc-fact tests remove key phrases from temporary fixtures to prove missing release-contract claims are reported."
  - "Aggregate verify tests check exact order and forbidden live/network command strings without changing the package script."

requirements-completed: [VERIFY-02, VERIFY-04, VERIFY-05]
generated_by: gsd-execute-plan
lifecycle_mode: yolo
phase_lifecycle_id: 28-2026-06-22T15-45-43
generated_at: 2026-06-22T16:34:48Z

duration: 6 min
completed: 2026-06-22
---

# Phase 28 Plan 03: Release Readiness Contract Summary

**Release-readiness docs and tests now guard static social preview generation, deterministic local verification, manual social-card boundaries, and aggregate verify ordering.**

## Performance

- **Duration:** 6 min
- **Started:** 2026-06-22T16:28:56Z
- **Completed:** 2026-06-22T16:34:48Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Added `## Social Preview Assets` to `docs/release-readiness.md` with exact `bun run generate:social-previews`, `bun run verify:social-previews`, and clean-builder release context.
- Added required document facts for generated preview manifests, `.output/public/social/generated/manifest.json`, `generated social preview PNG total`, manual social-card smoke checks, freshness severities, and low-intrusion OpenLinks posture.
- Strengthened aggregate verify tests for exact script text, `verify:social-previews` before `build`, release verification as the final segment, and exclusion of generation, freshness, sync, hosted, HTTP, and fetch-style network command strings.

## Task Commits

Each task was committed atomically:

1. **Task 1: Add social preview release-readiness facts and docs**
   - `8ae033e` test: add failing release-readiness doc fact tests
   - `970a2b8` feat: document social preview release readiness
2. **Task 2: Strengthen aggregate verify order and boundary guards**
   - `40b5862` test: guard aggregate release script boundaries

**Plan metadata:** pending summary commit

## Files Created/Modified

- `docs/release-readiness.md` - Documents social preview generation/check mode, static manifest verification, generated preview budgets, manual social-card smoke checks, and OpenLinks posture.
- `scripts/release-readiness.ts` - Adds required document facts for social preview release claims and manual/live boundary wording.
- `scripts/release-readiness.test.ts` - Adds fixture-removal doc-fact coverage and aggregate verify order/exclusion assertions.
- `.planning/phases/28-verification-and-release-contract/28-03-SUMMARY.md` - Execution summary for this plan.

## Decisions Made

- Kept `package.json` unchanged because the existing aggregate script already matched the planned release contract.
- Kept manual social-card, hosted crawler, current live GitHub state, live external-link reachability, and preview/production smoke wording outside automated release evidence.
- Preserved OpenLinks as low-intrusion identity/external-link policy context only.

## Deviations from Plan

None - plan scope executed as written.

## Issues Encountered

- Task 2's added assertions passed immediately instead of producing a RED failure because `package.json` already satisfied the planned aggregate verify ordering and exclusions. The task was completed as a test-only guard commit with no package script changes.
- An acceptance-check `rg` command initially used an unsafe shell pattern containing backticks, which triggered an unintended `bun run verify` command substitution. The aggregate verify completed successfully, then the malformed `rg` failed; the acceptance check was rerun with safe quoting and passed.
- `.planning/config.json` was dirty before and after this plan. It was outside the owned file set and was left unstaged.

## User Setup Required

None - no external service configuration required.

## Verification

Passed:

```bash
bun run test scripts/release-readiness.test.ts
bun run test scripts/verify-release.test.ts scripts/release-readiness.test.ts
bun run build
bun run verify:release
```

Additional Task 1/2 checks passed before commits:

```bash
bun run format:check
bun run check
bun run typecheck
```

`bun run verify:release` reported 16 scanned route HTML files, 38 text assets, 13 generated social preview PNG rows, and `generated social preview PNG total: 736.0 KB`.

## Next Phase Readiness

Plan 28-03 is complete. The orchestrator can now update shared phase state and roadmap artifacts after aggregating wave results.

## Self-Check: PASSED

- Found `.planning/phases/28-verification-and-release-contract/28-03-SUMMARY.md`.
- Found task commits `8ae033e`, `970a2b8`, and `40b5862` in git history.
- Confirmed `.planning/config.json` remained unstaged because it is outside this plan's owned files.

---
*Phase: 28-verification-and-release-contract*
*Completed: 2026-06-22*
