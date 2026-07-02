---
gsd_state_version: 1.0
milestone: v1.6
milestone_name: Content Discovery & Feeds
current_phase: 32
current_phase_name: project and writing filtering/search
current_plan: Not started
status: planning
stopped_at: Phase 31 complete; ready to discuss Phase 32
last_updated: "2026-07-02T21:18:27.775Z"
last_activity: 2026-07-02
progress:
  total_phases: 7
  completed_phases: 2
  total_plans: 4
  completed_plans: 4
  percent: 100
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-06-26)

**Core value:** Help visitors quickly understand what Peter builds, why it matters, and which projects are worth exploring or collaborating on.
**Current focus:** Phase 32 — Project and Writing Filtering/Search

## Current Position

Phase: 32 (Project and Writing Filtering/Search) — READY TO PLAN
Plan: Not started
Current Phase: 32
Current Phase Name: project and writing filtering/search
Current Plan: Not started
Total Phases: 7
Total Plans in Phase: 3
Status: Ready to plan
Last activity: 2026-07-02

Progress: 2/7 phases complete, 4/16 plans complete

## Recently Completed

v1.5 Static Shareability & Freshness shipped on 2026-06-23 with 6/6 phases, 12/12 plans, 25/25 requirements, and a passed audit. Archives live under `.planning/milestones/`.

## Current Milestone

v1.6 Content Discovery & Feeds

**Goal:** Help visitors navigate the now-substantial project, writing, and theme corpus through static discovery paths, lightweight search/filtering, syndication, and stronger related-work journeys without weakening the static deployment model.

**Roadmap progress:** Created with 7 phases, 16 plans, and 27/27 v1 requirements mapped exactly once.
**Current phase:** 32
**Next action:** Discuss and plan Phase 32 — Project and Writing Filtering/Search.

## Performance Metrics

**Velocity:** v1.0 14 plans, v1.1 4, v1.2 4, v1.3 10, v1.4 12, v1.5 12, v1.6 planned 16.
**Recent trend:** The portfolio now has project, writing, theme, static social preview, freshness, and release-evidence surfaces with shared static release gates and helper-derived route coverage.
**Phase 24 Plan 01:** 11 min, 2 tasks, 2 files, completed 2026-06-21.
**Phase 26:** 2/2 plans completed 2026-06-21. Route-aware metadata now points covered routes to generated social preview assets while generic and unknown-slug fallback pages keep the checked-in fallback image.
**Phase 27:** 2/2 plans completed 2026-06-22. Maintainers can run `bun run report:freshness` for offline reviewed static evidence without mutating source data or adding live checks to `bun run verify`.
**Phase 28:** 3/3 plans completed 2026-06-22. The local release gate now proves generated social previews, metadata references, static output, release budgets, and truthful evidence labels without overclaiming hosted or manual checks.
**Phase 29:** 1/1 plan completed 2026-06-23. Archived project status and maturity records are excluded from public project/detail/social-preview selectors through the shared project predicate, with targeted and aggregate verification passing.
**Phase 30 Plan 01:** 12 min, 3 tasks, 5 files, completed 2026-06-27. Canonical topic/reference helpers and topic curation validation now gate public discovery inputs.

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Theme paths synthesize existing project and writing surfaces before CMS/admin, analytics, comments/newsletter, dynamic Open Graph endpoints, or runtime content fetches.
- OpenLinks remains a subtle identity hub in footer/profile/contact/metadata surfaces; social preview work should not make OpenLinks the primary route CTA or visual brand.
- Theme route coverage is now part of static, browser, release-readiness, evidence-label, and aggregate verification.
- Manual external-link, preview, post-deploy, hosted Lighthouse, and Cloudflare checks remain release checklist obligations rather than automated local evidence.
- v1.5 should prefer deterministic static social preview assets over dynamic OG endpoints or server runtime image generation.
- v1.5 uses the research-recommended five-phase shape: social image data contract, deterministic static generation, metadata wiring, freshness reports, and verification/release contract.
- [Phase 24-social-image-data-contract]: Social preview targets derive from existing public project, writing, theme, and route helpers.
- [Phase 24-social-image-data-contract]: Generated social asset paths use SHA-256 source fingerprints truncated to 12 lowercase hex characters.
- [Phase 24-social-image-data-contract]: Generic routes stay on the fallback social image and are excluded from route-specific targets.
- [Phase 24-social-image-data-contract]: Validation returns structured findings instead of throwing from normal target listing.
- [Phase 25]: Use @resvg/resvg-js@2.6.2 with checked-in Inter font inputs and disabled system fonts for deterministic social preview PNG rendering. — This avoids runtime services, host-font drift, remote fonts, timestamps, and network inputs.
- [Phase 25]: Keep social preview check helpers pure and pass filesystem metadata in from the CLI. — Pure finding helpers are unit-testable and keep write/process-exit behavior isolated to the generator command.
- [Phase 26]: Keep route social image selection helper-derived. Covered routes use generated social preview assets through `PageMetadata`, dynamic unknown-slug fallbacks use `metadataForFallbackPage()`, and static verification checks route-correct local PNG references.
- [Phase 27]: Keep freshness reporting read-only and offline. `report:freshness` groups findings into `release blocker`, `needs review`, and `manual smoke`, while live GitHub state, hosted crawler validation, and external-link reachability stay explicit manual smoke work outside `bun run verify`.
- [v1.6]: Prioritize static content discovery, feed output, related-work navigation, and generic-route share polish before CMS/admin/editor workflows or live external-link automation.
- [v1.6]: Keep OpenLinks discoverable as a low-intrusion identity surface; discovery, feed, and source/maintainer disclosure work should keep Bright Builds and content journeys primary.
- [v1.6 roadmap]: Use the research-recommended seven-phase shape starting at Phase 30, with all 27 v1.6 requirements mapped exactly once and static-first scope preserved.
- [Phase 30-content-discovery-foundation]: Canonical topics live in src/domain/topics.ts as the single public discovery import surface.
- [Phase 30-content-discovery-foundation]: Public references compose existing project, writing, and theme public selectors before exposing safe envelopes.
- [Phase 30-content-discovery-foundation]: Topic diagnostics stay in src/domain/topic-validation.ts while visitor-facing helpers return public data or null.
- [Phase 30-content-discovery-foundation]: verify:curation now treats topic validation as part of the aggregate registry gate.

### Pending Todos

None.

### Blockers/Concerns

None.

## Session Continuity

Last session: 2026-06-30T22:54:39.142Z
Stopped at: Phase 31 complete; ready to discuss Phase 32
Resume file: None
Next action: discuss and plan Phase 32 - Project and Writing Filtering/Search
