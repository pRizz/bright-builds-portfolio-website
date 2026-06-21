# Phase 21: Collaboration Pathways and Cross-Links - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-06-17T22:54:40.939Z
**Phase:** 21-Collaboration Pathways and Cross-Links
**Mode:** Yolo
**Areas discussed:** Theme collaboration panels, Helper-derived relationship graph, Project and writing cross-links, OpenLinks placement, Dark UI and accessibility, Verification boundary

---

## Theme Collaboration Panels

| Option | Description | Selected |
| --- | --- | --- |
| Compact starting-point panel | Add one helper-derived panel on theme detail pages using collaboration angle, related projects, writing, and reviewed source/live links. | yes |
| Prominent primary CTA block | Make collaboration the hero action on every theme page. | |
| External resource directory | Add new freeform links outside existing curated data. | |

**User's choice:** Auto-selected compact starting-point panel.
**Notes:** This matches COLLAB-01 and COLLAB-02 while preserving static curated data and avoiding unreviewed external links.

---

## Helper-Derived Relationship Graph

| Option | Description | Selected |
| --- | --- | --- |
| Pure reciprocal helpers | Extend theme domain helpers so project and writing pages can ask which public themes reference them. | yes |
| Route-local filtering | Let each route filter `curatedThemes` directly. | |
| Denormalized theme copies | Duplicate relationship display content into project and writing records. | |

**User's choice:** Auto-selected pure reciprocal helpers.
**Notes:** This keeps project and writing registries authoritative and aligns with the existing functional-core/domain-helper pattern.

---

## Project and Writing Cross-Links

| Option | Description | Selected |
| --- | --- | --- |
| Secondary detail-page panels | Show related themes only on project and writing detail pages, near existing related-content surfaces. | yes |
| Broad index tags | Add related theme chips to home, project index, and writing index cards. | |
| Navigation expansion | Add theme-specific nav or global cross-link menus. | |

**User's choice:** Auto-selected secondary detail-page panels.
**Notes:** This satisfies SYNTH-03 without overwhelming primary project or writing narratives.

---

## OpenLinks Placement

| Option | Description | Selected |
| --- | --- | --- |
| Preserve low-intrusion identity placement | Keep OpenLinks discoverable through existing footer/profile/contact data and only surface it naturally through the OpenLinks project/theme. | yes |
| Make OpenLinks a primary theme CTA | Use OpenLinks as the main collaboration action on theme pages. | |
| Duplicate OpenLinks links across every panel | Repeat the identity link in all collaboration surfaces. | |

**User's choice:** Auto-selected low-intrusion identity placement.
**Notes:** This follows AGENTS.bright-builds.md and the OpenLinks identity-presence skill.

---

## Dark UI and Accessibility

| Option | Description | Selected |
| --- | --- | --- |
| Existing dark panel/list primitives | Reuse current panels, link lists, chips, focus rings, and responsive wrapping, adding only narrow CSS if needed. | yes |
| New card-heavy visual module | Create a new decorative collaboration component style. | |
| Light-first exception | Introduce light utility classes for new surfaces. | |

**User's choice:** Auto-selected existing dark panel/list primitives.
**Notes:** This preserves the dark-primary repo guidance and reduces risk of text overflow or visual inconsistency.

---

## Verification Boundary

| Option | Description | Selected |
| --- | --- | --- |
| Focused helper, route, and visual checks | Test reciprocal helpers and changed route surfaces, then run repo-native verification with desktop/mobile dark checks for affected pages. | yes |
| Phase 22/23 metadata and release assertions now | Add sitemap, JSON-LD, social-preview, and release evidence checks in this phase. | |
| Manual-only visual review | Rely on informal inspection without automated coverage. | |

**User's choice:** Auto-selected focused helper, route, and visual checks.
**Notes:** This keeps Phase 21 inside its boundary while preparing the collaboration behavior for later metadata and release-contract phases.

---

## the agent's Discretion

- Exact helper names and panel component boundaries.
- Exact section headings and destination-specific action labels.
- Narrow CSS additions if existing dark-primary classes are insufficient.

## Deferred Ideas

- Theme metadata, structured data, sitemap behavior, and social-preview fallback verification.
- Theme release-contract labels, release-readiness documentation, and aggregate release evidence expansion.
- Search/filter/tag archive discovery, CMS/admin tooling, analytics, newsletter/comments, live reachability checks, runtime content fetches, and dynamic OG images.
