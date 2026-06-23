---
gsd_state_version: 1.0
milestone: v1.5
milestone_name: Static Shareability & Freshness
current_phase: null
current_phase_name: Not started
current_plan: Not started
status: milestone_complete
stopped_at: v1.5 archived; ready for next milestone planning
last_updated: "2026-06-23T19:51:09.645Z"
last_activity: 2026-06-23
progress:
  total_phases: 0
  completed_phases: 0
  total_plans: 0
  completed_plans: 0
  percent: 0
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-06-23)

**Core value:** Help visitors quickly understand what Peter builds, why it matters, and which projects are worth exploring or collaborating on.
**Current focus:** Planning next milestone

## Current Position

Phase: None
Plan: None
Current Phase: Not started
Current Phase Name: Not started
Current Plan: Not started
Total Phases: 0
Total Plans in Phase: 0
Status: v1.5 milestone complete; ready for next milestone planning
Last activity: 2026-06-23

Progress: No active milestone

## Recently Completed

v1.5 Static Shareability & Freshness shipped on 2026-06-23 with 6/6 phases, 12/12 plans, 25/25 requirements, and a passed audit. Archives live under `.planning/milestones/`.

## Current Milestone

No active milestone is defined.

**Goal:** Define the next milestone through `/gsd-new-milestone`.

**Roadmap progress:** No active phases.
**Next action:** `/gsd-new-milestone`

## Performance Metrics

**Velocity:** v1.0 14 plans, v1.1 4, v1.2 4, v1.3 10, v1.4 12, v1.5 12.
**Recent trend:** The portfolio now has project, writing, theme, static social preview, freshness, and release-evidence surfaces with shared static release gates and helper-derived route coverage.
**Phase 24 Plan 01:** 11 min, 2 tasks, 2 files, completed 2026-06-21.
**Phase 26:** 2/2 plans completed 2026-06-21. Route-aware metadata now points covered routes to generated social preview assets while generic and unknown-slug fallback pages keep the checked-in fallback image.
**Phase 27:** 2/2 plans completed 2026-06-22. Maintainers can run `bun run report:freshness` for offline reviewed static evidence without mutating source data or adding live checks to `bun run verify`.
**Phase 28:** 3/3 plans completed 2026-06-22. The local release gate now proves generated social previews, metadata references, static output, release budgets, and truthful evidence labels without overclaiming hosted or manual checks.
**Phase 29:** 1/1 plan completed 2026-06-23. Archived project status and maturity records are excluded from public project/detail/social-preview selectors through the shared project predicate, with targeted and aggregate verification passing.

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

### Pending Todos

None.

### Blockers/Concerns

None.

## Session Continuity

Last session: 2026-06-23T02:42:43.561Z
Stopped at: v1.5 archived; ready for next milestone planning
Resume file: .planning/PROJECT.md
Next action: /gsd-new-milestone
