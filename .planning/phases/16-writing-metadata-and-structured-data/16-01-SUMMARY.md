---
phase: 16-writing-metadata-and-structured-data
plan: 01
subsystem: seo-domain
tags: [solidstart, seo, writing, json-ld, vitest]

requires:
  - phase: 15-writing-routes-and-dark-ui
    provides: public writing routes, writing registry helpers, and route shell rendering
provides:
  - "metadataForWritingEntry(entry) with article-flavored Open Graph and Twitter metadata"
  - "BlogPosting JSON-LD helper derived from public writing entries and person identity"
  - "Writing ItemList JSON-LD helper derived from public writing entry order"
  - "Focused unit coverage for writing metadata, JSON-LD, sitemap, and script escaping"
affects:
  - 16-writing-metadata-and-structured-data
  - 17-writing-verification-and-release-contract

tech-stack:
  added: []
  patterns:
    - "Pure SEO/domain helper functions for route components to consume"
    - "TDD coverage for helper contracts before route integration"

key-files:
  created:
    - .planning/phases/16-writing-metadata-and-structured-data/16-01-SUMMARY.md
    - src/domain/writing-metadata.test.ts
  modified:
    - src/domain/seo.ts

key-decisions:
  - "Writing detail metadata reuses the existing checked-in social fallback image instead of adding per-entry assets."
  - "BlogPosting author and creator both reuse personJsonLd() so OpenLinks remains a centralized identity signal."
  - "Writing JSON-LD intentionally omits unsupported publisher, comment, feed, and rating fields."

patterns-established:
  - "Writing article metadata is derived from PublicWritingEntry plus Profile only."
  - "Writing structured data flattens authored sections and link labels without exposing link URLs in articleBody."

requirements-completed:
  - META-01
  - META-02
  - META-03
  - META-04
generated_by: gsd-execute-plan
lifecycle_mode: yolo
phase_lifecycle_id: 16-2026-06-14T15-12-27
generated_at: 2026-06-14T15:56:03Z

duration: 4 min
completed: 2026-06-14
---

# Phase 16 Plan 01: SEO Domain Helpers Summary

**Pure writing metadata and structured-data helpers**

## Accomplishments

- Added `metadataForWritingEntry()` with writing-detail canonical URLs, `og:type="article"`, article date/tag metadata, Twitter card data, and the shared social fallback image.
- Added `writingBlogPostingJsonLd()` with headline/name, description, canonical URL, author/creator identity, optional dates, keywords/about labels, image, and flattened article body text.
- Added `writingItemListJsonLd()` for ordered public writing discovery metadata on `/writing`.
- Added focused Vitest coverage for writing detail metadata, writing index metadata preservation, BlogPosting JSON-LD, ItemList JSON-LD, sitemap route filtering, and JSON-LD escaping.

## Task Commits

Intermediate RED/GREEN commits were deferred by the strict wrapper policy. The wrapper will create one final phase commit only after phase verification and lifecycle checks pass.

## Files Created/Modified

- `.planning/phases/16-writing-metadata-and-structured-data/16-01-SUMMARY.md` - Execution summary and self-check record.
- `src/domain/seo.ts` - Adds writing metadata and JSON-LD helper exports.
- `src/domain/writing-metadata.test.ts` - Covers writing metadata, JSON-LD, sitemap filtering, and safe JSON-LD serialization.

## Verification

- `bun run test src/domain/writing-metadata.test.ts` - passed, 9 tests
- `bun run typecheck` - passed
- `bun run test` - passed, 13 files / 136 tests

## Next Phase Readiness

Ready for 16-02. Route components and static verification can now consume helper-derived metadata and structured data without duplicating writing metadata decisions.

## Self-Check: PASSED

- Found summary file and modified source/test files.
- Confirmed helper contracts are covered by focused tests and the full unit suite.
- Confirmed no intermediate task commits are claimed before the wrapper final verification gate.

---
*Phase: 16-writing-metadata-and-structured-data*
*Completed: 2026-06-14*
