---
phase: 03-portfolio-surfaces-seo
plan: 02
subsystem: portfolio-surfaces
tags: [solidjs, tailwind, seo, json-ld, openlinks, dark-ui]

requires:
  - phase: 03-portfolio-surfaces-seo
    provides: Plan 01 pure project story selectors, route metadata, asset links, and JSON-LD helpers.
provides:
  - Identity-first home route with current-focus links and six flagship project story cards.
  - Grouped project index with stable `/projects#slug` anchors, Writing empty state, hidden/excluded aggregate note, and ItemList JSON-LD.
  - About and contact routes with editorial theme/collaboration surfaces, low-intrusion OpenLinks placement, and Person JSON-LD.
  - Dark-first route, card, link, contact, anchor, reduced-motion, and mobile nav primitives.
affects: [03-03-static-seo-assets, phase-4-visual-system-motion, static-verification, route-head-rendering]

tech-stack:
  added: []
  patterns:
    - Solid route components consume pure `src/domain/*` helpers for content, metadata, assets, and structured data.
    - Project grouping derives from registry placement selectors plus data-driven writing evidence.
    - Optional head asset attributes are rendered only when present to avoid invalid static HTML attributes.

key-files:
  created: []
  modified:
    - src/components/SiteLayout.tsx
    - src/domain/routes.ts
    - src/routes/index.tsx
    - src/routes/projects.tsx
    - src/routes/about.tsx
    - src/routes/contact.tsx
    - src/styles/app.css

key-decisions:
  - "Project details remain stable `/projects#slug` anchors; no blog routes, per-project routes, content collections, or runtime GitHub calls were added."
  - "OpenLinks stays low-intrusion in footer/about/contact and Person.sameAs metadata while Bright Builds remains the host brand."
  - "Writing and hidden/excluded distinctions derive from the curated registry; hidden/excluded records are represented only as an aggregate note/count."

patterns-established:
  - "Every visitor route now emits route metadata, social image metadata, asset links, and JSON-LD through Plan 01 helpers."
  - "`/projects` sections use `ProjectSection` and `ProjectCard` route-local components with stable card anchors and empty states."
  - "Mobile nav rows use 44px targets and explicit row gaps to satisfy the Phase 3 touch/overlap contract."

requirements-completed: [PROF-01, PROF-02, PROF-03, PROF-04, CUR-04, EXP-01, EXP-02, EXP-03, EXP-04, SEO-01, SEO-03, SEO-05]
generated_by: gsd-execute-plan
lifecycle_mode: yolo
phase_lifecycle_id: 3-2026-05-26T10-37-25
generated_at: 2026-05-26T12:07:48Z

duration: 17min
completed: 2026-05-26
---

# Phase 03 Plan 02: Portfolio Surfaces Summary

**Dark-first Solid route surfaces rendering curated project stories, grouped anchors, collaboration links, and shared SEO metadata.**

## Performance

- **Duration:** 17 min
- **Started:** 2026-05-26T11:51:09Z
- **Completed:** 2026-05-26T12:07:48Z
- **Tasks:** 3
- **Files modified:** 7

## Accomplishments

- Rebuilt the home route around Peter Ryszkiewicz / pRizz, Bright Builds, the required identity copy, current-focus links, and six curated flagship story cards.
- Replaced the flat project list with Flagship, Supporting, Lab / Prototype, Writing, and Archive sections, stable anchors, approved empty states, and an aggregate hidden/excluded note.
- Replaced the about focus list with five editorial theme cards and upgraded contact cards with GitHub-first collaboration copy.
- Added full route metadata/social tags, asset links, Person JSON-LD, and project ItemList JSON-LD on the relevant routes.
- Added dark-first card/link/anchor/contact/theme CSS, reduced-motion handling, and mobile nav touch-target fixes.

## Task Commits

Each planned task was committed atomically:

1. **Task 1: Render identity-first home, current focus, and low-intrusion footer** - `cb3e26c` (feat)
2. **Task 2: Render grouped project index with stable anchors and ItemList JSON-LD** - `7642577` (feat)
3. **Task 3: Render about themes and contact collaboration surfaces** - `437983c` (feat)

Additional verification fix:

4. **Plan-level visual fix: Correct mobile nav wrapping** - `3210917` (fix)

## Files Created/Modified

- `src/routes/index.tsx` - Identity-first home, current-focus panel, flagship story cards, shared metadata, and Person JSON-LD.
- `src/components/SiteLayout.tsx` - Bright Builds host-brand footer copy and low-intrusion OpenLinks profile link.
- `src/routes/projects.tsx` - Grouped project index, stable anchors, Writing empty state, hidden/excluded aggregate note, and ItemList JSON-LD.
- `src/routes/about.tsx` - Profile summary, five editorial theme cards, OpenLinks identity hub link, and Person JSON-LD.
- `src/routes/contact.tsx` - GitHub-first collaboration copy and profile-data contact cards with shared metadata.
- `src/styles/app.css` - Dark-first route primitives, anchor cards, theme/contact styles, reduced-motion guard, and mobile nav touch targets.
- `src/domain/routes.ts` - Home static verification text aligned with the required first-block identity copy.

## Decisions Made

- Followed the Phase 3 anchor strategy and did not add per-project routes, blog routes, content collections, CMS work, search/filtering, motion-heavy features, dependencies, or runtime GitHub enrichment.
- Kept OpenLinks discoverable in footer/about/contact and metadata, but not in the header or primary CTA.
- Kept Writing as a data-driven grouping from existing curated evidence; with the current registry it renders the approved empty state.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Aligned home static verification text with required identity copy**
- **Found during:** Task 1 (Render identity-first home, current focus, and low-intrusion footer)
- **Issue:** `verify:static` still checked the old home `staticCheckText`, while the plan required the exact first-block copy with "practical web experiments."
- **Fix:** Updated `src/domain/routes.ts` so the pure route contract and rendered home copy match.
- **Files modified:** `src/domain/routes.ts`
- **Verification:** `bun run format:check && bun run check && bun run typecheck && bun run test && bun run build && bun run verify:static`
- **Committed in:** `cb3e26c`

**2. [Rule 1 - Bug] Avoided invalid undefined head attributes**
- **Found during:** Task 1 generated HTML review
- **Issue:** Rendering optional `siteAssetLinks` attributes directly produced `type="undefined"` or `sizes="undefined"` in static HTML.
- **Fix:** Rendered asset links with conditional branches that omit absent optional attributes, then reused that pattern on the later routes.
- **Files modified:** `src/routes/index.tsx`, `src/routes/projects.tsx`, `src/routes/about.tsx`, `src/routes/contact.tsx`
- **Verification:** Static HTML grep for `sizes="undefined"` and `type="undefined"` returned no matches.
- **Committed in:** `cb3e26c`, `7642577`, `437983c`

**3. [Rule 1 - Bug] Fixed mobile nav row overlap and touch target size**
- **Found during:** Plan-level browser verification at 320px width
- **Issue:** The wrapped header nav had a fractional row overlap and nav links were below the 44px touch-target contract.
- **Fix:** Added 44px minimum targets to brand/nav links and explicit vertical row gap for wrapped nav rows.
- **Files modified:** `src/styles/app.css`
- **Verification:** Chrome DevTools 320px mobile check reported no overlaps, no horizontal overflow, and 44px nav link rectangles.
- **Committed in:** `3210917`

---

**Total deviations:** 3 auto-fixed (2 bugs, 1 blocking issue)
**Impact on plan:** All fixes were required for verification, static correctness, or the approved UI contract. No architecture or scope change.

## Issues Encountered

None beyond the auto-fixed issues above.

## Verification

- Task acceptance greps for required home, project, about, contact, OpenLinks, JSON-LD, grouping, hidden/excluded, no-blog, no-runtime-GitHub, and forbidden light/template text checks.
- `bun run format:check`
- `bun run check`
- `bun run typecheck`
- `bun run test`
- `bun run build`
- `bun run verify:static`
- `bun run verify`
- Chrome DevTools static preview at `http://127.0.0.1:4173/`:
  - Desktop 1440x900 dark checks for `/`, `/projects`, `/about`, and `/contact`.
  - Mobile 390x844 dark checks for `/`, `/projects`, and `/contact`.
  - Mobile 320x844 minimum-width checks for `/projects` and `/contact`.
  - Verified `.dark` root, `#050608` body background, no horizontal overflow, no clipped text, no detected incoherent text overlap, and contact URL wrapping.

## Known Stubs

None. Stub-pattern scan found no placeholder, TODO/FIXME, empty hardcoded UI data, or unwired mock data in files touched by this plan.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Phase 03 plan 03 can add static SEO assets and extended verification against the route metadata already emitted by the visitor-facing routes. No blockers remain.

## Self-Check: PASSED

- Verified summary and touched source files exist.
- Verified task commits exist: `cb3e26c`, `7642577`, `437983c`, `3210917`.
- Verified final static server session was stopped after browser checks.

---
*Phase: 03-portfolio-surfaces-seo*
*Completed: 2026-05-26*
