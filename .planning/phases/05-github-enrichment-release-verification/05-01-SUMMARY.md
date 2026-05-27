---
phase: 05-github-enrichment-release-verification
plan: 01
subsystem: domain
tags: [github-metadata, static-snapshot, enrichment, vitest, typescript]

requires:
  - phase: 02-curated-content-model
    provides: Authoritative curated ProjectStory registry and curation validation
  - phase: 03-portfolio-surfaces-seo
    provides: Static portfolio route and SEO surfaces for curated projects
provides:
  - Checked-in GitHub metadata snapshot runtime fallback
  - Pure repository URL parser and GitHub metadata types
  - Direct-repo-only metadata enrichment helpers
  - Compact GitHub metadata fact and homepage-link derivation helpers
affects: [05-github-enrichment-release-verification, project-cards, release-verification]

tech-stack:
  added: []
  patterns:
    - Static JSON snapshot imported into pure domain helpers
    - Available/unavailable discriminated GitHub metadata union
    - Advisory enrichment keyed only from direct curated repo links

key-files:
  created:
    - src/domain/github-metadata.snapshot.json
    - src/domain/github-metadata.ts
    - src/domain/github-metadata.test.ts
  modified:
    - src/domain/github-metadata.ts
    - src/domain/github-metadata.test.ts

key-decisions:
  - "GitHub enrichment matches only canonical direct repo links from curated projects; related links never enrich records."
  - "Unavailable snapshot entries return null so rendering can omit enrichment without throwing."
  - "Homepage enrichment returns a ProjectLink only when the GitHub homepage URL is non-empty and not already covered by curated live, docs, or repo links."

patterns-established:
  - "Snapshot fallback: src/domain/github-metadata.snapshot.json is the checked-in runtime source and starts empty by design."
  - "Metadata facts: stars, forks, language, updated month/year, true-only flags, and filtered topics are produced as static text facts."
  - "Curated authority: metadata helpers never mutate or assign placement, tier, display order, authored copy, curation reason, or curated links."

requirements-completed: [GH-02, GH-03, VER-01]
generated_by: gsd-execute-plan
lifecycle_mode: yolo
phase_lifecycle_id: 5-2026-05-27T11-26-21
generated_at: 2026-05-27T12:26:28Z

duration: 8min
completed: 2026-05-27
---

# Phase 05 Plan 01: GitHub Metadata Runtime Contract Summary

**Static GitHub metadata snapshot contract with pure direct-repo enrichment helpers and Vitest coverage**

## Performance

- **Duration:** 8 min
- **Started:** 2026-05-27T12:18:09Z
- **Completed:** 2026-05-27T12:26:28Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Added a checked-in empty snapshot fallback with `schemaVersion`, `syncedAt`, and `repositories`.
- Added pure domain types and helpers for GitHub repository URL parsing, metadata lookup, compact fact formatting, and optional homepage-link derivation.
- Added focused Vitest coverage for parser behavior, unavailable fallback, direct-repo-only enrichment, related-link exclusion, duplicate homepage omission, and curated topic filtering.

## Task Commits

Each TDD task was committed through RED and GREEN commits:

1. **Task 1 RED: Snapshot/parser tests** - `24c0d1c` (test)
2. **Task 1 GREEN: Snapshot/parser implementation** - `1cf65a1` (feat)
3. **Task 2 RED: Enrichment-helper tests** - `7f83a91` (test)
4. **Task 2 GREEN: Enrichment-helper implementation** - `3b8ddb4` (feat)

## Files Created/Modified

- `src/domain/github-metadata.snapshot.json` - Checked-in static runtime fallback for GitHub metadata.
- `src/domain/github-metadata.ts` - Pure metadata contracts, URL parser, lookup, fact formatting, topic filtering, and homepage-link derivation.
- `src/domain/github-metadata.test.ts` - Vitest coverage for parser, fallback, direct-repo-only enrichment, and curated-authority boundaries.

## Decisions Made

- Matched enrichment by canonical repository URL parsed from direct `kind: "repo"` links, preserving curated registry authority and avoiding related-source bleed-through.
- Returned `null` for unavailable, missing, invalid, or duplicate enrichment paths so downstream rendering can omit optional metadata calmly.
- Returned a `ProjectLink | null` from homepage derivation so the route layer can reuse existing curated-link rendering semantics without replacing authored links.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- TypeScript widens numeric JSON imports, so `GitHubMetadataSnapshot.schemaVersion` is typed as `number` while the checked-in snapshot and tests still enforce runtime value `1`.
- Biome required import ordering after the Task 2 RED commit; imports were reordered before the GREEN commit and verified with `bun run check`.

## Known Stubs

| File | Line | Reason |
|------|------|--------|
| `src/domain/github-metadata.snapshot.json` | 4 | `repositories: []` is the intentional checked-in empty runtime fallback required by this plan. A later sync plan can populate it with public GitHub metadata. |

## Verification

- `bun run test -- src/domain/github-metadata.test.ts src/domain/project-validation.test.ts src/domain/portfolio-surfaces.test.ts && bun run typecheck`
- `bun run verify`
- Task acceptance `rg` checks passed for snapshot keys, required exports, parser tests, direct-repo-only tests, compact fact labels, curated-authority non-mutation, and forbidden runtime GitHub/token patterns.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Ready for Plan 05-02 to add the optional metadata sync/rendering path on top of the static contract without changing curated project authority.

## Self-Check: PASSED

- Verified created files exist: `src/domain/github-metadata.snapshot.json`, `src/domain/github-metadata.ts`, `src/domain/github-metadata.test.ts`, and this summary.
- Verified task commits exist in git history: `24c0d1c`, `1cf65a1`, `7f83a91`, and `3b8ddb4`.

---
*Phase: 05-github-enrichment-release-verification*
*Completed: 2026-05-27*
