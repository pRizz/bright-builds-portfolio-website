---
phase: 31-static-topic-routes
plan: 02
subsystem: topic-metadata
tags: [typescript, solidstart, metadata, json-ld, accessibility]
provides:
  - Reusable safe topic chip component
  - Canonical topic links across project, writing, theme, and topic surfaces
  - Topic route metadata helper
  - Topic ItemList and CollectionPage JSON-LD helpers
affects:
  - 32-filtering-search
  - 34-related-work
  - 35-social-previews
tech-stack:
  added: []
  patterns:
    - Linked chips resolve through `maybeTopicRecordForLabel()`
    - Metadata and JSON-LD derive from public topic records
    - Unsupported labels stay visually inert and non-leaking
key-files:
  created:
    - src/components/TopicChip.tsx
    - src/domain/topic-metadata.test.ts
  modified:
    - src/domain/seo.ts
    - src/routes/projects/index.tsx
    - src/routes/projects/[slug].tsx
    - src/routes/writing/index.tsx
    - src/routes/writing/[slug].tsx
    - src/routes/themes/index.tsx
    - src/routes/themes/[slug].tsx
    - src/routes/topics/index.tsx
    - src/routes/topics/[slug].tsx
    - src/styles/app.css
key-decisions:
  - "Topic chips never fabricate routes by slugifying raw labels."
  - "Unsupported labels remain inert chips with no disabled state, tooltip, or reason-specific copy."
  - "Topic metadata keeps the existing fallback social image contract until generated topic previews are scoped."
requirements-completed: [DISC-03, DISC-05]
generated_by: gsd-execute-plan
lifecycle_mode: yolo
phase_lifecycle_id: 31-2026-06-30T22-33-56
generated_at: 2026-06-30T23:10:00Z
duration: 6 min
completed: 2026-06-30
---

# Phase 31 Plan 02: Topic Chips and Metadata Summary

**Safe canonical topic chip links plus helper-derived metadata and JSON-LD for topic routes.**

## Performance

- **Duration:** 6 min
- **Started:** 2026-06-30T23:04:00Z
- **Completed:** 2026-06-30T23:10:00Z
- **Tasks:** 3
- **Files modified:** 12

## Accomplishments

- Added `src/components/TopicChip.tsx` with `TopicChip` and `TopicChipList`, resolving linkability through `maybeTopicRecordForLabel()`.
- Replaced raw project, writing, theme, and topic label rows with safe topic chips where labels are intended as public topic labels.
- Added topic route metadata helpers and JSON-LD helpers in `src/domain/seo.ts`.
- Added `src/domain/topic-metadata.test.ts` coverage for topic metadata, fallback social image parity, ItemList ordering, CollectionPage parts, and Person sameAs preservation.
- Wired `/topics` to topic ItemList JSON-LD and topic detail pages to `metadataForTopic()` plus `topicCollectionPageJsonLd()`.

## Task Commits

This summary restores GSD execution bookkeeping for work already shipped in one phase commit:

1. **Task 1: Add reusable safe topic chip rendering** - `9862d53`
2. **Task 2: Replace raw public label chips with safe topic chips** - `9862d53`
3. **Task 3: Add topic metadata and JSON-LD helpers** - `9862d53`

## Files Created/Modified

- `src/components/TopicChip.tsx` - Renders canonical topic links only for validated public topic labels.
- `src/domain/seo.ts` - Adds `metadataForTopic()`, `topicItemListJsonLd()`, and `topicCollectionPageJsonLd()`.
- `src/domain/topic-metadata.test.ts` - Covers metadata and structured-data behavior for topic routes.
- `src/routes/projects/index.tsx` - Uses safe topic chips for project labels.
- `src/routes/projects/[slug].tsx` - Uses safe topic chips on project detail surfaces.
- `src/routes/writing/index.tsx` - Uses safe topic chips for writing labels.
- `src/routes/writing/[slug].tsx` - Uses safe topic chips on writing detail surfaces.
- `src/routes/themes/index.tsx` - Preserves theme route patterns while allowing public topic labels to resolve safely.
- `src/routes/themes/[slug].tsx` - Preserves inert non-topic metadata while supporting safe topic labels.
- `src/routes/topics/index.tsx` - Emits topic ItemList JSON-LD.
- `src/routes/topics/[slug].tsx` - Emits public topic metadata and CollectionPage JSON-LD.
- `src/styles/app.css` - Styles linked topic chips with dark-first hover and focus-visible states.

## Decisions Made

- Made chip linkability a component concern so route files do not duplicate label resolution logic.
- Kept non-topic metadata chips inert, including source type, status, maturity, dates, counts, and other facet chips.
- Preserved the existing low-intrusion OpenLinks footer and Person metadata placement without adding topic-specific OpenLinks CTAs.

## Verification

- `bun run test src/domain/topic-metadata.test.ts`
- `bun run typecheck`
- Final aggregate verification is recorded in `31-VERIFICATION.md` and passed through `bun run verify`.

## Deviations from Plan

The implementation work had already been committed as `9862d53` before this summary artifact was restored, so task-level commits are represented by that single phase commit. No source code was changed while writing this summary.

## Issues Encountered

None.

## User Setup Required

None.

## Next Phase Readiness

Plan 03 can verify static output, metadata, sitemap coverage, browser behavior, and release gates using the topic chip and metadata helpers added here.

## Self-Check: PASSED

- Found all created and modified plan files.
- Found shipped implementation commit `9862d53`.
- Confirmed Phase 31 verification passed in `31-VERIFICATION.md`.

***
*Phase: 31-static-topic-routes*
*Completed: 2026-06-30*
