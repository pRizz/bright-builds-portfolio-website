---
phase: 15-writing-routes-and-dark-ui
plan: 04
subsystem: static-browser-verification
tags: [solidstart, writing, static-output, playwright, accessibility]

requires:
  - phase: 15-writing-routes-and-dark-ui
    provides: /writing route UI, writing detail UI, and project related-writing links from 15-02 and 15-03
provides:
  - "Static verifier coverage for /writing, public writing details, related project links, and project related-writing links"
  - "Generated output guards for unsafe javascript: and data: hrefs"
  - "Static output exclusion checks for non-public and unknown writing detail routes"
  - "Route-derived browser verification evidence for writing routes across desktop, mobile, and reduced-motion projects"
affects:
  - 16-writing-metadata-and-structured-data
  - 17-writing-verification-and-release-contract

tech-stack:
  added: []
  patterns:
    - "Static verifier dynamic-route branches for writing details before top-level metadata assertions"
    - "Route-derived browser verification remains driven by prerenderRoutes"
    - "Narrow document-title and sitewide Person JSON-LD fixes for writing details without BlogPosting or writing-specific JSON-LD scope"

key-files:
  created:
    - .planning/phases/15-writing-routes-and-dark-ui/15-04-SUMMARY.md
  modified:
    - scripts/verify-static.ts
    - src/routes/writing/index.tsx
    - src/routes/writing/[slug].tsx
    - public/sitemap.xml

key-decisions:
  - "Writing static verification filters project related-writing checks from publicWritingEntries() instead of importing a reciprocal project field."
  - "Writing detail pages are skipped from existing top-level metadata and Person JSON-LD assertions until Phase 16 owns full writing metadata scope."
  - "The known browser title blocker was fixed with Title and description meta on writing details; the aggregate release JSON-LD gate was satisfied with existing sitewide Person JSON-LD, leaving BlogPosting, writing-specific JSON-LD, dynamic OG, and release labels deferred."

patterns-established:
  - "Use maybeWritingForDetailRoute(route) to keep writing detail static checks separate from top-level route metadata checks."
  - "Use assertNoPrerenderedWritingRoute(root, route) to prove non-public and unknown writing slugs do not emit public static HTML."

requirements-completed:
  - ROUTE-01
  - ROUTE-02
  - ROUTE-03
  - ROUTE-04
  - READ-01
  - READ-02
  - READ-03
  - LINK-02
generated_by: gsd-execute-plan
lifecycle_mode: yolo
phase_lifecycle_id: 15-2026-06-13T16-56-50
generated_at: 2026-06-13T18:23:57Z

duration: 13 min
completed: 2026-06-13
---

# Phase 15 Plan 04: Writing Verification Summary

**Writing routes are now proven through static HTML assertions, unsafe href guards, and route-derived Playwright browser checks**

## Performance

- **Duration:** 13 min
- **Started:** 2026-06-13T18:10:40Z
- **Completed:** 2026-06-13T18:23:57Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- Added static verifier coverage for `/writing`, `/writing/agentic-engineering-workflows`, `/writing/portable-identity-and-owned-surfaces`, related project links on writing details, and related writing links on selected project pages.
- Added generated HTML guards for `href="javascript:` and `href="data:` while preserving the existing GitHub/token/template-residue forbidden output checks.
- Added static output coverage for every `writingDetailRoutes()` path and exclusion checks for non-published writing entries plus `/writing/unknown-writing-slug`.
- Confirmed route-derived Playwright axe/layout coverage now passes for all 13 prerendered routes, including the new writing routes.
- Fixed the known writing detail document-title axe blocker with narrow `Title` and description meta only.

## Task Commits

Each task was committed atomically:

1. **Task 1: Add static verifier coverage for writing routes and cross-links** - `e8e5eef` (fix)
2. **Task 2: Run route-derived browser and aggregate verification evidence** - `e797f1b` (fix)

## Files Created/Modified

- `scripts/verify-static.ts` - Adds writing route/detail expected text helpers, unsafe href forbidden patterns, writing detail route coverage, non-public writing route exclusion, and project related-writing expected text checks.
- `src/routes/writing/index.tsx` - Adds existing top-level Person JSON-LD pattern for `/writing` so top-level static metadata assertions continue to apply.
- `src/routes/writing/[slug].tsx` - Adds non-empty document titles, description meta, and existing sitewide Person JSON-LD for public writing details.
- `public/sitemap.xml` - Regenerated from the existing `sitemapXml()` helper after writing routes entered `prerenderRoutes`.
- `.planning/phases/15-writing-routes-and-dark-ui/15-04-SUMMARY.md` - Execution summary and self-check record.

## Decisions Made

- Kept writing detail verification content-focused in Phase 15: static body text, hrefs, and related content are asserted, while full writing metadata, BlogPosting JSON-LD, and dynamic social sharing stay deferred.
- Kept project related-writing verifier behavior derived from `publicWritingEntries()` and `relatedProjectSlugs`, matching the one-way domain relationship model.
- Treated the checked-in sitemap as generated static metadata and regenerated it from the existing helper instead of adding writing-specific sitemap assertions.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed static verifier helper initialization order**
- **Found during:** Task 1 (`bun run verify:static`)
- **Issue:** `expectedRoutes` is built at module initialization, but the new writing date formatter was initially declared below helper calls that needed it.
- **Fix:** Moved the UTC writing date formatter above `expectedRoutes`.
- **Files modified:** `scripts/verify-static.ts`
- **Verification:** `bun run verify:static` progressed past writing index/detail expected text checks.
- **Committed in:** `e8e5eef`

**2. [Rule 1 - Bug] Added existing top-level Person JSON-LD pattern to /writing**
- **Found during:** Task 1 (`bun run verify:static`)
- **Issue:** `/writing` is a top-level route, and the existing top-level verifier contract expects Person JSON-LD. The route had metadata but no Person JSON-LD.
- **Fix:** Added `personJsonLd()` through the existing `jsonLdScriptContent()` pattern used by other top-level routes.
- **Files modified:** `src/routes/writing/index.tsx`
- **Verification:** `bun run verify:static` progressed to the sitemap equality check.
- **Committed in:** `e8e5eef`

**3. [Rule 3 - Blocking] Regenerated stale helper-derived sitemap output**
- **Found during:** Task 1 (`bun run verify:static`)
- **Issue:** `public/sitemap.xml` was stale after writing routes entered `prerenderRoutes`, so the existing `assertOutputTextEquals(outputRoot, "sitemap.xml", sitemapXml())` check failed.
- **Fix:** Ran `bun run generate:static-metadata` and committed the regenerated sitemap output.
- **Files modified:** `public/sitemap.xml`
- **Verification:** `bun run build` copied the regenerated sitemap into `.output/public`, and `bun run verify:static` passed.
- **Committed in:** `e8e5eef`

**4. [Rule 1 - Accessibility Bug] Added document titles to writing detail routes**
- **Found during:** Task 2 (`bun run verify:browser`)
- **Issue:** Axe reported `document-title` violations on both public writing detail routes across desktop, mobile, and reduced-motion projects.
- **Fix:** Added route-local `Title` plus description `Meta` from the public writing entry title and summary.
- **Files modified:** `src/routes/writing/[slug].tsx`
- **Verification:** `bun run verify:browser` passed with 68 passed and 16 skipped.
- **Committed in:** `e797f1b`

**5. [Rule 3 - Blocking] Added sitewide Person JSON-LD to writing detail routes**
- **Found during:** Orchestrator-level aggregate `bun run verify` after plan execution.
- **Issue:** `bun run verify:release` requires every generated route to contain a JSON-LD script, and the newly generated writing detail routes had none.
- **Fix:** Reused the existing `personJsonLd()` and `jsonLdScriptContent()` pattern on writing detail pages. This satisfies the sitewide release semantic gate without adding `BlogPosting`, writing-specific JSON-LD, dynamic OG, release evidence labels, or Phase 16 sitemap assertions.
- **Files modified:** `src/routes/writing/[slug].tsx`
- **Verification:** Re-run aggregate verification after this summary update.
- **Committed in:** `68de224`

---

**Total deviations:** 5 auto-fixed (3 Rule 1 bugs, 2 Rule 3 blockers)
**Impact on plan:** All fixes were required to complete Phase 15 verification. No BlogPosting, writing-specific JSON-LD, release-readiness label changes, dynamic OG images, or broader Phase 16/17 scope were added.

## Issues Encountered

- First `bun run verify:static` run failed on a verifier helper initialization bug; fixed before commit.
- Second `bun run verify:static` run failed because `/writing` lacked the existing top-level Person JSON-LD pattern; fixed narrowly.
- Third `bun run verify:static` run failed because the checked-in sitemap was stale; regenerated from the existing helper.
- First `bun run verify:browser` run failed on writing detail `document-title` axe violations; fixed with narrow detail title/description meta.
- Orchestrator-level `bun run verify` failed on `verify:release` because the newly generated writing detail routes lacked a JSON-LD script; fixed with the existing sitewide Person JSON-LD pattern.

No remaining issues.

## Known Stubs

None. Stub scan found only local verifier accumulator arrays and nullable guard logic in `scripts/verify-static.ts`; no UI-facing placeholders, TODO/FIXME markers, mock data, or hardcoded empty values were introduced.

## Authentication Gates

None.

## Verification

- `bun run format:check` - passed.
- `bun run check` - passed.
- `bun run typecheck` - passed.
- `bun run test` - passed, 12 files and 123 tests.
- `bun run build` - passed, prerendered 13 routes including `/writing`, `/writing/agentic-engineering-workflows`, and `/writing/portable-identity-and-owned-surfaces`.
- `bun run verify:static` - passed, verified 13 prerendered routes, metadata, JSON-LD, assets, sitemap, and robots in `.output/public`.
- `bun run verify:browser` - passed, 68 passed and 16 skipped across desktop, mobile, and reduced-motion projects.
- Task 1 acceptance `rg` checks - passed for required writing helpers/usages, unsafe href patterns, writing expected copy, and absence of prohibited Phase 16/17 terms.
- Static file checks passed:
  - `.output/public/writing/index.html`
  - `.output/public/writing/agentic-engineering-workflows/index.html`
  - `.output/public/writing/portable-identity-and-owned-surfaces/index.html`

## Visual Evidence

Playwright CLI inspected `http://127.0.0.1:4173` after `bun run build` and `bun run serve:static`. Screenshots were captured for local inspection and removed before commit.

| Route | Viewport | Horizontal overflow | Text/control overlap | Contrast/readability | Focus rings | Reduced-motion-only regression |
| --- | --- | --- | --- | --- | --- | --- |
| `/writing` | `1280x900` | No | No | Readable dark UI | Present | No; `verify:browser` reduced-motion project passed |
| `/writing` | `390x844` | No | No | Readable dark UI | Present | No; `verify:browser` reduced-motion project passed |
| `/writing/agentic-engineering-workflows` | `1280x900` | No | No | Readable dark UI | Present | No; `verify:browser` reduced-motion project passed |
| `/writing/agentic-engineering-workflows` | `390x844` | No | No | Readable dark UI | Present | No; `verify:browser` reduced-motion project passed |
| `/projects/openlinks` | `1280x900` | No | No | Readable dark UI | Present | No; `verify:browser` reduced-motion project passed |
| `/projects/openlinks` | `390x844` | No | No | Readable dark UI | Present | No; `verify:browser` reduced-motion project passed |

DOM evidence from the Playwright pass also confirmed `.dark` on the root document, non-empty page titles, expected H1 values, no horizontal overflow, and focus-ring CSS signals for every listed route and viewport.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Phase 15 route/UI verification is complete. Phase 16 can add full writing metadata, structured data, and sitemap discovery assertions on top of the now-proven static route output without changing the Phase 15 body rendering or relationship model.

## Self-Check: PASSED

- Found summary file `.planning/phases/15-writing-routes-and-dark-ui/15-04-SUMMARY.md`.
- Found task commits `e8e5eef` and `e797f1b` in git history.
- Confirmed summary evidence includes `/writing`, `/writing/agentic-engineering-workflows`, `/projects/openlinks`, `1280x900`, and `390x844`.
- Confirmed `.planning/STATE.md`, `.planning/ROADMAP.md`, and `.planning/REQUIREMENTS.md` are unchanged; only orchestrator-owned `.planning/config.json` remains dirty and unstaged.

---
*Phase: 15-writing-routes-and-dark-ui*
*Completed: 2026-06-13*
