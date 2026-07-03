---
phase: 33-writing-first-static-feed
verified: 2026-07-03T15:49:05Z
status: passed
score: "5/5 must-haves verified"
generated_by: gsd-verifier
lifecycle_mode: yolo
phase_lifecycle_id: 33-2026-07-03T14-09-00
generated_at: 2026-07-03T15:49:05Z
lifecycle_validated: true
overrides_applied: 0
---

# Phase 33: Writing-First Static Feed Verification Report

**Phase Goal:** Subscribers and feed readers can consume a deterministic static writing-first feed while site pages expose low-intrusion subscription affordances.
**Verified:** 2026-07-03T15:49:05Z
**Status:** passed
**Re-verification:** No - initial verification

Material guidance used: `AGENTS.md`, `AGENTS.bright-builds.md`, `standards-overrides.md`, `standards/index.md`, `standards/core/architecture.md`, `standards/core/code-shape.md`, `standards/core/frontend-ui.md`, `standards/core/verification.md`, `standards/core/testing.md`, `standards/languages/typescript-javascript.md`, and the OpenLinks identity placement skill. No project-local skills were found under `.claude/skills/` or `.agents/skills/`.

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Visitor or feed reader can request a valid static writing-first RSS feed at `/feed.xml`. | VERIFIED | `public/feed.xml` exists, `.output/public/feed.xml` exists, `cmp` showed source and built output match, and `bun run verify:static` asserts built `feed.xml` equals `rssFeedXml()`. |
| 2 | Feed entries use stable canonical IDs, absolute links, checked-in dates, public categories, summaries, and deterministic ordering. | VERIFIED | `src/domain/feed.ts` sets `id` to `canonicalUrl`, builds URLs from `peterProfile.canonicalOrigin` plus `writingDetailPath()`, uses `maybeUpdatedOn ?? maybePublishedOn`, maps categories through `canonicalTopicsForLabels()`, and sorts by date, `displayOrder`, then slug. Direct import check returned 2 items, stable IDs, absolute writing URLs, public categories, and stable XML. |
| 3 | Feed generation excludes draft, hidden, archived, undated, unsupported, or invented project/theme update records. | VERIFIED | `writingFeedItems()` starts from `publicWritingEntries()` and excludes undated entries. `feed.test.ts` covers draft, hidden, archived, and undated fixtures. `scripts/verify-static/feed-verifier.ts` excludes non-feed writing URLs, project URLs, theme URLs, alternate feed formats, subscription markers, and runtime API markers. |
| 4 | Home and writing pages expose feed autodiscovery metadata and a visible low-intrusion feed link. | VERIFIED | `src/entry-server.tsx` emits one RSS alternate link using `writingFeedMetadata()`. Generated `/` and `/writing` HTML each contain one absolute RSS autodiscovery link and one `<a class="text-link surface-link" href="/feed.xml">RSS feed</a>`. Browser release tests verify the RSS links are visible and keyboard reachable. |
| 5 | Feed generation is deterministic, local, and does not mutate source data unexpectedly during ordinary build or verification. | VERIFIED | `scripts/generate-feed.ts` writes only `public/feed.xml` outside check mode and `verify:feed` fails on drift without rewriting. `package.json` runs `verify:feed` before `build` in aggregate `verify`; `bun run verify` passed. |

**Score:** 5/5 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/domain/feed.ts` | Pure feed item model, metadata, date validation, XML escaping, and RSS serialization | VERIFIED | Exists and substantive. Imports only profile, writing, and topic domain helpers; no filesystem writes, network calls, runtime endpoints, feed packages, `Date.now()`, `Math.random()`, or dynamic `lastBuildDate`. |
| `src/domain/feed.test.ts` | Focused feed eligibility, ordering, ID, category, date, escaping, and deterministic serialization tests | VERIFIED | `bun run test src/domain/feed.test.ts` passed 14 tests. Tests include Arrange/Act/Assert structure for non-trivial cases. |
| `scripts/generate-feed.ts` | Bun generator and `--check` drift guard for `public/feed.xml` | VERIFIED | Uses `rssFeedXml()`, exact output path `public/feed.xml`, writes only in normal mode, and check mode reports `Feed output is out of date. Run bun run generate:feed.` on drift. |
| `public/feed.xml` | Checked-in static RSS asset served at `/feed.xml` | VERIFIED | Non-empty RSS 2.0 XML with channel, two writing items, GUIDs, pubDates, descriptions, and public categories. Matches `.output/public/feed.xml`. |
| `package.json` | `generate:feed`, `verify:feed`, and aggregate `verify` wiring before build | VERIFIED | Scripts exist; aggregate `verify` orders `verify:social-previews && verify:feed && build`. `bun run verify` passed. |
| `src/entry-server.tsx` | Actual RSS autodiscovery provider | VERIFIED | Emits the document-level RSS alternate link from `writingFeedMetadata()`. This supersedes the planned `RouteHead` alternate-link prop while preserving the roadmap outcome. |
| `src/components/RouteHead.tsx` | Planned optional RSS alternate-link support | INFO | Not extended for RSS. The final implementation moved autodiscovery to `src/entry-server.tsx`, and static verification proves `/` and `/writing` still expose exactly one RSS link. No goal-blocking gap found. |
| `src/routes/index.tsx` | Home visible low-intrusion RSS link | VERIFIED | Renders `<a class="text-link surface-link" href="/feed.xml">RSS feed</a>` after the primary project action. Generated home HTML contains the link. |
| `src/routes/writing/index.tsx` | Writing visible low-intrusion RSS link | VERIFIED | Renders `<a class="text-link surface-link" href="/feed.xml">RSS feed</a>` in the writing intro before filters. Generated writing HTML contains the link. |
| `scripts/verify-static/feed-verifier.ts` | Built-output feed XML, eligibility, and leak verification | VERIFIED | Compares built `feed.xml` to `rssFeedXml()`, checks non-empty output, includes every feed item title/summary/canonical URL, and excludes non-public or unsupported feed content. |
| `scripts/verify-static/run-static-verification.ts` | Static verifier includes feed XML | VERIFIED | Calls `assertFeedStaticOutput(outputRoot)` and summary includes `feed XML`. |
| `scripts/verify-static/metadata-jsonld-verifier.ts` | Static verifier checks home/writing autodiscovery metadata | VERIFIED | Uses `writingFeedMetadata().feedUrl` and asserts exactly one RSS alternate link on `/` and `/writing`. |
| `scripts/verify-static/expected-route-text.ts` | Static verifier checks visible RSS anchors | VERIFIED | Requires `RSS feed` and `href="/feed.xml"` in `/` and `/writing` static HTML. |
| `tests/browser-release.playwright.ts` | Browser visibility and keyboard coverage for RSS links | VERIFIED | Test `RSS feed links are visible and keyboard reachable on home and writing` passed in aggregate browser verification. |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `src/domain/feed.ts` | `src/domain/writing.ts` | `publicWritingEntries()` and `writingDetailPath()` | WIRED | Import and usage found; feed entries derive from public writing and canonical writing paths. |
| `src/domain/feed.ts` | `src/domain/profile.ts` | `peterProfile.canonicalOrigin` | WIRED | Import and usage found; metadata and feed item links use the canonical origin. |
| `src/domain/feed.ts` | `src/domain/topics.ts` | `canonicalTopicsForLabels()` | WIRED | Import and usage found; categories are public canonical topic labels. |
| `scripts/generate-feed.ts` | `src/domain/feed.ts` | `rssFeedXml()` | WIRED | Generator and check mode use the pure serializer output. |
| `public/feed.xml` | `.output/public/feed.xml` | SolidStart public asset copy and static verifier | WIRED | `bun run build` produced `.output/public/feed.xml`; source and built XML match. |
| `src/entry-server.tsx` | `src/domain/feed.ts` | `writingFeedMetadata().feedUrl` | WIRED | Server document emits feed autodiscovery from the feed metadata helper. This is the actual implementation in place of the planned route-level `RouteHead` extension. |
| `scripts/verify-static/run-static-verification.ts` | `scripts/verify-static/feed-verifier.ts` | `assertFeedStaticOutput(outputRoot)` | WIRED | Import and call found; `bun run verify:static` passed. |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| `src/domain/feed.ts` | `writingFeedItems()` | `publicWritingEntries(curatedWriting)`, `writingDetailPath()`, `peterProfile.canonicalOrigin`, and `canonicalTopicsForLabels()` | Yes - direct Bun import returned 2 public writing feed items with absolute canonical IDs and public categories. | FLOWING |
| `src/domain/feed.ts` | `rssFeedXml()` | `writingFeedMetadata()` plus `writingFeedItems()` | Yes - output is stable across repeated calls and has RSS 2.0 channel/item fields. | FLOWING |
| `scripts/generate-feed.ts` and `public/feed.xml` | `expected` | `rssFeedXml()` | Yes - `bun run verify:feed` passed and `public/feed.xml` matches `.output/public/feed.xml`. | FLOWING |
| `src/entry-server.tsx` | `writingFeed` | `writingFeedMetadata()` | Yes - generated home and writing HTML contain the absolute feed URL and RSS metadata. | FLOWING |
| `src/routes/index.tsx` and `src/routes/writing/index.tsx` | visible RSS anchor | Static JSX anchor to `/feed.xml` | Yes - static HTML and Playwright both find the visible `RSS feed` link. | FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Feed drift guard is current | `bun run verify:feed` | `Feed output is current.` | PASS |
| Focused feed unit tests pass | `bun run test src/domain/feed.test.ts` | 1 file passed, 14 tests passed | PASS |
| TypeScript accepts changed surfaces | `bun run typecheck` | `tsc --noEmit` exited 0 | PASS |
| Built feed/static metadata verification passes | `bun run verify:static` | Verified 30 prerendered routes including feed XML | PASS |
| Release verifier scans XML and budgets | `bun run verify:release` | Scanned 30 route HTML files and 57 text assets; release verification passed | PASS |
| Browser RSS links and dark/mobile/focus coverage pass | `bun run verify:browser` | 162 passed, 33 expected skips | PASS |
| Aggregate repository gate passes | `bun run verify` | format, check, typecheck, 306 tests, curation, no-runtime fetch guard, build, browser, static, and release all passed | PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| `FEED-01` | `33-02-PLAN.md` | Visitor or feed reader can subscribe to a valid static writing-first feed at `/feed.xml`. | SATISFIED | `public/feed.xml` and `.output/public/feed.xml` exist, are non-empty, match `rssFeedXml()`, and contain RSS 2.0 writing items. |
| `FEED-02` | `33-01-PLAN.md` | Feed entries use stable canonical IDs, absolute links, checked-in dates, public categories, summaries, and deterministic ordering. | SATISFIED | `writingFeedItems()` implements canonical URL IDs, absolute links, checked-in date preference, canonical public categories, summaries, and deterministic sort; tests and direct import check passed. |
| `FEED-03` | `33-01-PLAN.md` | Feed generation excludes draft, hidden, archived, undated, unsupported, or invented project/theme update records. | SATISFIED | Feed items derive from `publicWritingEntries()` plus a date guard; tests cover non-public/undated fixtures; static verifier excludes non-feed writing, project, theme, subscription, alternate-format, and runtime API markers. |
| `FEED-04` | `33-02-PLAN.md` | Home and writing surfaces expose feed autodiscovery metadata and a visible low-intrusion feed link. | SATISFIED | Generated `/` and `/writing` HTML each contain one RSS alternate link and one `RSS feed` anchor with `text-link surface-link`; Playwright verifies visibility and keyboard reachability. |
| `FEED-05` | `33-02-PLAN.md` | Feed generation is deterministic, local, and does not mutate source data unexpectedly during ordinary build or verification. | SATISFIED | `verify:feed` check mode compares without rewriting, aggregate `verify` runs it before build, and `rssFeedXml()` omits dynamic build-time values. |

All five Phase 33 requirement IDs from plan frontmatter are present in `.planning/REQUIREMENTS.md` and mapped to Phase 33. No Phase 33 requirements are orphaned.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| None | - | - | - | No placeholders, TODO/FIXME markers, stub returns, runtime feed endpoints, feed/XML dependencies, `Date.now()`, `Math.random()`, dynamic `lastBuildDate`, project/theme feed sources, or runtime content fetches were found in the feed implementation. Normal guard-clause `return []` / `return null` paths and script `console.log` output were not classified as stubs. |
| `src/components/RouteHead.tsx` | 5 | Planned provider not used for RSS autodiscovery | INFO | Plan 33-02 expected `RouteHead` alternate-link support, but the implemented source of truth is document-level `src/entry-server.tsx`. Since static verification proves exactly one correct home/writing RSS link from `writingFeedMetadata()`, this is a non-blocking implementation deviation. |

### Human Verification Required

None for Phase 33. The user-facing RSS links are covered by static HTML assertions and Playwright visibility, focus, axe, desktop/mobile dark layout, and reduced-motion projects. Hosted feed-reader smoke testing is explicitly deferred to the release evidence phase and was not claimed here.

### Gaps Summary

No goal-blocking gaps found. The phase delivers a deterministic checked-in RSS feed, validates drift before build, copies the feed into static output, exposes RSS autodiscovery plus visible home/writing feed links, and proves the behavior through unit, static, browser, release, and aggregate verification.

_Verified: 2026-07-03T15:49:05Z_
_Verifier: the agent (gsd-verifier)_
