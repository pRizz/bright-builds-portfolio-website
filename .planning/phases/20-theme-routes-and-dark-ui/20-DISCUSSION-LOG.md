# Phase 20: Theme Routes and Dark UI - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-06-17T16:16:59.817Z
**Phase:** 20-Theme Routes and Dark UI
**Mode:** Yolo
**Areas discussed:** Theme index presentation, Theme detail synthesis layout, Static route and fallback safety, Dark responsive UI and motion behavior

---

## Theme Index Presentation

| Option | Description | Selected |
| --- | --- | --- |
| Dense Link List | Fastest to scan and simplest keyboard path, but weaker as a curated public surface. | |
| Responsive Card Grid | Matches `/writing` cards and `/about` theme-card patterns, uses existing dark-primary surfaces, and gives each theme enough room for summary/audience/relationship cues. | Yes |
| Grouped Guide | Strong narrative path, but needs a stable grouping taxonomy not present in `ThemeRecord`. | |

**User's choice:** Auto-selected `Responsive Card Grid` as the recommended advisor path.
**Notes:** The selected route should derive records from `publicThemeEntries()` and links from `themeDetailPath()` so non-public themes do not leak.

---

## Theme Detail Synthesis Layout

| Option | Description | Selected |
| --- | --- | --- |
| Project-detail-style synthesis shell | Consistent with project detail pages, but can make theme pages feel too much like project pages. | |
| Article-first theme essay | Strong narrative flow, but weaker as a portfolio navigation hub. | |
| Theme-specific hybrid hub | Best fit for synthesis: intro, why-it-matters/audience/proof sections, related project cards, related writing cards, and no collaboration CTA. | Yes |
| Minimal registry-rendered detail | Lowest implementation surface, but may not satisfy the synthesis goal. | |

**User's choice:** Auto-selected `Theme-specific hybrid hub` as the recommended advisor path.
**Notes:** The route should resolve related content from existing helpers and keep `collaborationAngle` from becoming a Phase 20 collaboration panel.

---

## Static Route and Fallback Safety

| Option | Description | Selected |
| --- | --- | --- |
| Domain allowlist plus generic 404 detail fallback | Reuses `prerenderRoutes`, derives detail routes from `themeDetailRoutes()`, gates pages with `maybePublicThemeEntryBySlug()`, and gives all misses the same generic fallback. | Yes |
| Crawl-derived prerendering from theme index links | Less manifest wiring, but fragile because DOM links become the publication source. | |
| Separate manual public theme route allowlist | Strong editorial gate, but duplicates `curatedThemes` status and invites drift. | |
| Dedicated catch-all or `/404` route for theme misses | Cleaner status semantics, but adds route/provider behavior outside the current pattern. | |

**User's choice:** Auto-selected `Domain allowlist plus generic 404 detail fallback` as the recommended advisor path.
**Notes:** Keep `crawlLinks: false`. The fallback must not echo the raw slug, status, or private registry content.

---

## Dark Responsive UI and Motion Behavior

| Option | Description | Selected |
| --- | --- | --- |
| Reuse existing shared dark UI classes in route markup | Aligns with repo-local dark-primary guidance, preserves existing reduced-motion/coarse-pointer guards, and avoids dependency churn. | Yes |
| Add small Solid route components backed by current classes | Can reduce repetition, but may over-abstract with only two current public themes. | |
| Refactor shared CSS into stronger theme-page tokens/utilities | Could centralize polish, but touches global CSS and raises regression risk. | |
| Use Mystic/motion primitives for richer interactive cards | More expressive, but increases hydration, mobile, and accessibility risk. | |

**User's choice:** Auto-selected `Reuse existing shared dark UI classes in route markup` as the recommended advisor path.
**Notes:** Add only small CSS where needed. Preserve stable text wrapping, accessible headings, keyboard focus, and desktop/mobile dark readability.

---

## the agent's Discretion

- Exact route helper/component boundaries.
- Exact index/detail/fallback copy.
- Exact tests needed to prove Phase 20 route/UI behavior without taking over Phase 22 or Phase 23 scope.

## Deferred Ideas

- Phase 21: collaboration panels, practical next actions, and theme-aware project/writing cross-links.
- Phase 22: theme metadata, JSON-LD, sitemap, and social-preview contracts.
- Phase 23: release-browser and release-readiness coverage labels for theme routes.
