---
gsd_state_version: 1.0
milestone: v1.4
milestone_name: Theme Paths & Collaboration Surface
current_phase: 19
current_phase_name: Theme Domain Foundation
current_plan: null
status: ready_for_phase
stopped_at: Milestone v1.4 initialized; ready to discuss or plan Phase 19
last_updated: "2026-06-16T14:32:32.188Z"
last_activity: 2026-06-16
progress:
  total_phases: 5
  completed_phases: 0
  total_plans: 0
  completed_plans: 0
  percent: 0
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-06-16)

**Core value:** Help visitors quickly understand what Peter builds, why it matters, and which projects are worth exploring or collaborating on.
**Current focus:** Phase 19 — Theme Domain Foundation

## Current Position

Current Phase: 19
Current Phase Name: Theme Domain Foundation
Current Plan: —
Total Phases: 5
Total Plans in Phase: —
Phase: 19 (Theme Domain Foundation) — NOT STARTED
Plan: —
Status: Milestone v1.4 initialized — ready to discuss or plan Phase 19
Last activity: 2026-06-16

Progress: [░░░░░░░░░░] 0%

## Performance Metrics

**Velocity:**

- v1.0 plans completed: 14
- v1.1 plans completed: 4
- v1.2 plans completed: 4
- v1.3 plans completed: 10
- Active milestone plans completed: 0
- Active milestone plan count: 0 planned

**By Phase:**

- Phase 19: Theme Domain Foundation — Not started
- Phase 20: Theme Routes and Dark UI — Pending
- Phase 21: Collaboration Pathways and Cross-Links — Pending
- Phase 22: Theme Metadata and Structured Data — Pending
- Phase 23: Theme Verification and Release Contract — Pending

**Recent Trend:**

- Last completed work: Phase 18 modularized the static verifier while preserving writing/project generated-output coverage and the aggregate clean-builder gate on 2026-06-16.
- Trend: v1.4 starts from strong project and writing surfaces; the next product step is a synthesis layer that helps visitors choose a theme path and collaboration entry point.

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [v1.1 roadmap]: Use three coarse phases derived from the active requirements: browser/a11y automation, release/deploy gates, and content-helper cleanup.
- [v1.1 scope]: Keep product expansion out of this milestone; no blog, per-project pages, richer OG generation, analytics, CMS/admin, or new motion polish.
- [Phase 6]: Convert recorded browser/accessibility evidence into checked-in repeatable verification before expanding the aggregate release gate.
- [Phase 7]: Own the release-readiness contract for SEO, performance, external links, Cloudflare/static deployment assumptions, and the aggregate verify command.
- [Phase 8]: Resolve seed-era helper ambiguity after the release gate contract is in place.
- [Phase 08-content-helper-surface-cleanup]: Removed projectSeeds, primaryProjectLink, and featuredProjects as stale curated project helper aliases.
- [Phase 08-content-helper-surface-cleanup]: Added a dependency-free TypeScript AST guard to enforce the supported src/domain/projects import surface.
- [Phase 09-clean-builder-release-gate-closure]: Added explicit `bun run install:browser` provisioning and release-readiness document guards for clean builders.
- [v1.2 milestone]: Project Story Pages are the next product milestone; writing/notes, CMS/admin, and dynamic OG/server rendering stay deferred.
- [Phase 10]: Selected detail pages are controlled by typed curated project `detail` data; Phase 11 owns navigation/UI and Phase 12 owns JSON-LD/sitemap sharing completion.
- [Phase 11]: Selected project navigation uses `projectStoryHref()` so detail-ready projects route to `/projects/{slug}` while unselected public projects keep project-index anchors.
- [Phase 12]: Project detail sharing metadata stays static, deriving JSON-LD, sitemap coverage, and social preview fallback from curated project/profile data.
- [Phase 13]: Project detail release coverage derives from `projectDetailRoutes()` and `prerenderRoutes()` so static, browser, release-readiness, and evidence-label checks stay connected.
- [v1.3 milestone]: Add a curated static writing and notes surface before richer social-image generation or CMS/admin tooling.
- [v1.3 roadmap]: Use four coarse phases: writing domain foundation, writing routes and dark UI, writing metadata and structured data, and writing verification and release contract.
- [Phase 14]: Writing domain data stays in typed checked-in TypeScript with pure helpers and curation validation before any public route, metadata, sitemap, or UI consumption.
- [Phase 18]: Static verification stays behind the existing `verify:static` CLI while generated-output assertions live in focused import-safe TypeScript modules.
- [v1.4 milestone]: Theme paths synthesize existing project and writing surfaces before CMS/admin, analytics, comments/newsletter, or dynamic Open Graph work.
- [v1.4 scope]: Keep OpenLinks as a subtle identity hub in footer/profile/contact/metadata surfaces; theme collaboration panels should not turn OpenLinks into the primary CTA.

### Pending Todos

None yet.

### Blockers/Concerns

None.

## Session Continuity

Last session: 2026-06-16T14:32:32.188Z
Stopped at: Milestone v1.4 initialized; ready to discuss or plan Phase 19
Resume file: .planning/ROADMAP.md
Next action: run `/gsd-discuss-phase 19` or `/gsd-plan-phase 19`
