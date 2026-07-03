---
phase: 33-writing-first-static-feed
plan: 02
subsystem: content-discovery
tags: [rss, feed, static-output, solidstart, verification]
requires:
  - phase: 33-01-writing-feed-domain
    provides: pure RSS feed item, metadata, XML escaping, and serialization helpers
provides:
  - Checked-in static `/feed.xml` generated from the RSS domain helper
  - Aggregate `verify:feed` drift check before static build
  - RSS autodiscovery metadata and visible low-intrusion RSS links
  - Static, browser, and release verification coverage for feed output and links
affects: [33-writing-first-static-feed, static-feed-output, release-verification]
tech-stack:
  added: []
  patterns:
    - Explicit checked-in static asset generation with a read-only `--check` verifier
    - Static feed output verification against the pure RSS serializer
    - Browser coverage for keyboard-reachable low-intrusion RSS links
key-files:
  created:
    - scripts/generate-feed.ts
    - public/feed.xml
    - scripts/verify-static/feed-verifier.ts
  modified:
    - package.json
    - src/entry-server.tsx
    - src/routes/index.tsx
    - src/routes/writing/index.tsx
    - scripts/verify-static/run-static-verification.ts
    - scripts/verify-static/metadata-jsonld-verifier.ts
    - scripts/verify-static/expected-route-text.ts
    - scripts/verify-static.test.ts
    - scripts/verify-release.ts
    - scripts/verify-release.test.ts
    - scripts/release-readiness.test.ts
    - tests/browser-release.playwright.ts
key-decisions:
  - "Keep `/feed.xml` as a checked-in public asset generated from `rssFeedXml()` instead of adding a runtime endpoint."
  - "Run `verify:feed` before `build` in aggregate verification so drift is caught before static output is produced."
  - "Expose the RSS alternate link from the server document using `writingFeedMetadata()` so the static document head has one source of truth."
patterns-established:
  - "Feed static verification compares `.output/public/feed.xml` byte-for-byte with `rssFeedXml()`."
  - "Release verification scans XML static assets for forbidden runtime/API/token leakage."
  - "Visible RSS links are verified through both static route text checks and keyboard-reachable browser checks."
requirements-completed: [FEED-01, FEED-04, FEED-05]
generated_by: gsd-execute-plan
lifecycle_mode: yolo
phase_lifecycle_id: 33-2026-07-03T14-09-00
generated_at: 2026-07-03T15:38:00Z
duration: 29 min
completed: 2026-07-03
---

# Phase 33 Plan 02: Static Feed Output Summary

**Static RSS feed output with drift checks, autodiscovery metadata, visible feed links, and release-grade verification**

## Performance

- **Duration:** 29 min
- **Started:** 2026-07-03T15:10:00Z
- **Completed:** 2026-07-03T15:39:00Z
- **Tasks:** 3
- **Files modified:** 16

## Accomplishments

- Added `scripts/generate-feed.ts` and checked in `public/feed.xml` generated from `rssFeedXml()`.
- Added `generate:feed` and `verify:feed`, with aggregate `bun run verify` running the drift check before `bun run build`.
- Exposed visible `RSS feed` links on the home and writing pages while keeping the placement low-intrusion.
- Added server-rendered RSS autodiscovery metadata sourced from `writingFeedMetadata()`.
- Added static, browser, and release verification for feed XML output, autodiscovery metadata, visible links, XML scanning, and the narrow release budget headroom.

## Task Commits

Each task was committed atomically:

1. **Task 1: static feed generator and drift check** - `9bd304e` (feat)
2. **Task 2: visible RSS links and autodiscovery wiring** - `7a6226c` (feat)
3. **Task 3: static/browser/release verification** - `93b6318` (test)
4. **Deviation fix: source-of-truth autodiscovery metadata** - `018ccbd` (fix)

## Files Created/Modified

- `scripts/generate-feed.ts` - Generates or checks `public/feed.xml` from `rssFeedXml()`.
- `public/feed.xml` - Checked-in static RSS 2.0 writing feed.
- `package.json` - Adds feed generation/check scripts and aggregate verification ordering.
- `src/entry-server.tsx` - Emits RSS autodiscovery metadata from `writingFeedMetadata()`.
- `src/routes/index.tsx` - Adds a low-intrusion home `RSS feed` link.
- `src/routes/writing/index.tsx` - Adds a low-intrusion writing index `RSS feed` link.
- `scripts/verify-static/feed-verifier.ts` - Verifies built feed XML against the pure RSS helper and excludes forbidden feed content.
- `scripts/verify-static/run-static-verification.ts` - Includes feed XML in the static verification summary and gate.
- `scripts/verify-static/metadata-jsonld-verifier.ts` - Verifies RSS autodiscovery metadata.
- `scripts/verify-static/expected-route-text.ts` - Verifies visible RSS links in static HTML.
- `scripts/verify-static.test.ts` - Covers feed verifier behavior and static summary text.
- `scripts/verify-release.ts` - Scans built XML text assets and keeps feed-related client JS headroom explicit.
- `scripts/verify-release.test.ts` - Covers the narrow feed-link client JS budget headroom.
- `scripts/release-readiness.test.ts` - Updates aggregate verify script contract coverage for `verify:feed`.
- `tests/browser-release.playwright.ts` - Verifies `RSS feed` links are visible and keyboard reachable on home and writing.

## Verification

- `bun run generate:feed` - passed.
- `bun run verify:feed` - passed.
- `bun run typecheck` - passed.
- `bun run build` - passed.
- `bun run verify:static` - passed, including feed XML verification.
- `bun run verify:browser` - passed, 162 passed and 33 skipped, including RSS link keyboard/visibility coverage plus desktop/mobile dark overlap checks.
- `bun run verify:release` - passed, with XML text scanning and static budgets.
- `bun run verify` - passed.
- After `018ccbd`, reran `bun run typecheck && bun run build && bun run verify:static && bun run verify:browser && bun run verify:release` - passed.

## Decisions Made

- Kept feed generation explicit and checked-in rather than implicit in `build`, preserving a clear drift contract.
- Used the server document for the RSS alternate link so static prerendered pages include stable feed autodiscovery metadata.
- Derived server-document feed metadata from `writingFeedMetadata()` to avoid duplicated canonical feed strings.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Server-document RSS autodiscovery needed helper-derived metadata**
- **Found during:** Plan completion audit after Task 3.
- **Issue:** The executor moved autodiscovery into `src/entry-server.tsx` for static document-head output, but initially hardcoded the feed title and canonical URL instead of using the feed metadata helper.
- **Fix:** Imported `writingFeedMetadata()` in `src/entry-server.tsx` and used its title/feed URL in the RSS alternate link.
- **Files modified:** `src/entry-server.tsx`
- **Verification:** `bun run typecheck && bun run build && bun run verify:static && bun run verify:browser && bun run verify:release`
- **Committed in:** `018ccbd`

**2. [Rule 3 - Blocking] Release budgets needed feed-link headroom**
- **Found during:** Task 3 release verification.
- **Issue:** The valid feed link/static output change affected the measured client JS budget.
- **Fix:** Added a 512-byte client JS headroom with a focused release verifier test and kept XML text scanning explicit.
- **Files modified:** `scripts/verify-release.ts`, `scripts/verify-release.test.ts`
- **Verification:** `bun run verify:release` and `bun run verify`
- **Committed in:** `93b6318`

***

**Total deviations:** 2 auto-fixed (2 blocking).
**Impact on plan:** Both fixes were required to preserve the planned source-of-truth and release verification contracts. No runtime endpoint, dependency, external service, or extra visible placement was added.

## Issues Encountered

- The executor completed the implementation commits but did not return a final completion signal or write this summary before being shut down. Spot checks confirmed the code commits and verification edits were present, so the orchestrator completed the summary and state updates inline.

## Known Stubs

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Phase 34 can build related-work graph surfaces on top of the existing project, writing, theme, topic, and feed-discovery foundations without adding runtime content dependencies.

## Orchestrator-Owned State

The executor did not update `.planning/STATE.md`, `.planning/ROADMAP.md`, or `.planning/REQUIREMENTS.md`. Those updates remain orchestrator-owned after phase verification.

## Self-Check: PASSED

- Confirmed `scripts/generate-feed.ts` exists.
- Confirmed `public/feed.xml` exists.
- Confirmed `scripts/verify-static/feed-verifier.ts` exists.
- Confirmed task commits `9bd304e`, `7a6226c`, `93b6318`, and `018ccbd` exist in git history.
- Confirmed `bun run verify` passed after feed output, link, verifier, and release-budget changes.

*Phase: 33-writing-first-static-feed*
*Completed: 2026-07-03*
