---
phase: 31
slug: static-topic-routes
status: approved
shadcn_initialized: false
preset: none
created: 2026-06-30
generated_by: gsd-ui-phase
lifecycle_mode: yolo
phase_lifecycle_id: 31-2026-06-30T22-33-56
generated_at: 2026-06-30T22:50:24.000Z
---

# Phase 31 - UI Design Contract

> Visual and interaction contract for static topic discovery routes. Generated for the GSD chain and verified against the repo-local dark-primary guidance and existing route patterns.

## Design System

| Property | Value |
| --- | --- |
| Tool | none |
| Preset | not applicable |
| Component library | Existing Solid route components and Mystic/Tailwind theme CSS |
| Icon library | none for this phase |
| Font | Existing Inter/system stack from `src/styles/app.css` |

## Route Surfaces

| Surface | Contract |
| --- | --- |
| `/topics` intro | Use `.page-intro`, `.eyebrow`, `.page-title`, and `.lead`; first viewport should immediately signal topic discovery. |
| `/topics` cards | Use existing card/surface classes, preferably `.theme-grid` plus `.theme-card` or `.project-anchor-card`; no nested cards. |
| `/topics/{slug}` intro | Use `.page-intro` plus a back link to `/topics`; show topic label and public reference counts before detailed groups. |
| Topic reference groups | Group by Projects, Writing, and Theme paths; use existing `.writing-related-grid`, `.surface-card`, `.project-anchor-card`, `.card-title`, `.card-copy`, `.link-list`, and `.surface-link`. |
| Unknown topic fallback | Use one non-leaking fallback page with copy directing visitors back to `/topics`; do not explain whether the slug is unknown, hidden, archived, private, or unsupported. |
| Product chrome | Preserve current header/footer. OpenLinks remains the footer identity link and Person sameAs metadata only. |

## Spacing Scale

Use existing CSS spacing. New route-specific classes may be added only when existing classes cannot express the layout.

| Token | Value | Usage |
| --- | --- | --- |
| xs | 4px | Inline label gaps and compact count text |
| sm | 8px | Chip gaps and dense card subgroups |
| md | 16px | Card internals and default stack gaps |
| lg | 24px | Card padding and panel padding |
| xl | 32px | Route section gaps |
| 2xl | 48px | Major discovery group breaks |
| 3xl | 64px | Page-level spacing where existing `.site-main` and section classes already provide it |

Exceptions: none.

## Typography

| Role | Size | Weight | Line Height |
| --- | --- | --- | --- |
| Body | 16px | 400 | 1.5 |
| Label | 14px | 600 | 1.4 |
| Card heading | 20px | 600 | 1.25 |
| Page title | 36px | 600 | 1.15 |

Do not scale font size with viewport width. Keep letter spacing at normal values and use existing uppercase eyebrow styling only where already established.

## Color

| Role | Value | Usage |
| --- | --- | --- |
| Dominant background | `#050608` | Page shell and dark root background |
| Secondary surfaces | `#18181b` / `#0d1117` gradients | Cards, panels, and visual surfaces |
| Text | `#f4f4f5`, `#e5e7eb`, `#d4d4d8` | Headings, body copy, metadata |
| Accent | Emerald/cyan from existing classes | Links, focus rings, selected affordances, active topic links |
| Warning accent | Amber from existing notice classes | Only if an informational notice is needed |

Accent reserved for topic links, focus rings, count pills, and primary route actions. Do not introduce a new one-note palette or light-first classes.

## Copywriting Contract

| Element | Copy |
| --- | --- |
| Topic index eyebrow | `Topic discovery` |
| Topic index H1 | `Topics` |
| Topic index lead | `Browse the public labels that connect Peter's projects, writing, and theme paths.` |
| Topic detail back link | `Back to topics` |
| Project group heading | `Projects` |
| Writing group heading | `Writing` |
| Theme group heading | `Theme paths` |
| Topic detail CTA | `Open project`, `Read note`, `Read essay`, or `Explore theme` based on content kind |
| Empty/fallback heading | `No public topic here` |
| Empty/fallback body | `Browse public topics to find a safe route through Peter's projects, writing, and theme paths.` |

Use concise labels. Avoid explaining implementation, keyboard shortcuts, static generation, or metadata behavior in the UI.

## Interaction Contract

- Topic links are normal anchors and must be keyboard reachable.
- Linked topic chips should keep chip visual density but add `.surface-link`-quality focus behavior or equivalent visible `focus-visible` styling.
- Unresolved labels stay inert `.chip` elements with no click handler and no fake `href`.
- Touch targets for linked chips and CTAs should be at least the existing `min-h-11` pattern where practical.
- Reduced motion should require no additional JS; any new hover lift must be covered by existing reduced-motion CSS selectors.

## Responsive Layout Contract

- Use `grid-template-columns: repeat(auto-fit, minmax(min(100%, ...), 1fr))` patterns already present in `app.css`.
- Cards, chips, and count rows must use `min-width: 0` and `overflow-wrap: anywhere` either through existing classes or targeted additions.
- Mobile must show route intro, counts, and at least the first topic/reference card without horizontal overflow or overlapping text.
- Do not add decorative orbs, bokeh, card-in-card page sections, or hero marketing layouts.

## Registry Safety

| Registry | Blocks Used | Safety Gate |
| --- | --- | --- |
| shadcn official | none | not required |
| third-party registries | none | not allowed in this phase |

No new UI packages, icon packages, generated SVG illustrations, or remote visual assets are needed.

## Verification Contract

- Unit tests prove topic route helper behavior, topic metadata, topic JSON-LD, and linked-chip resolution.
- Static verification proves pre-hydration topic route text, topic links, metadata, JSON-LD, sitemap coverage, fallback source, and unknown-route exclusion.
- Browser verification covers `/topics` and a representative topic detail route through axe and desktop/mobile dark layout. Keyboard focus should reach `/topics`, at least one topic detail route, and topic chips from a public surface.
- Reduced-motion verification should include a representative topic detail route if topic cards or linked chips use hover transitions.

## Checker Sign-Off

- [x] Dimension 1 Copywriting: PASS
- [x] Dimension 2 Visuals: PASS
- [x] Dimension 3 Color: PASS
- [x] Dimension 4 Typography: PASS
- [x] Dimension 5 Spacing: PASS
- [x] Dimension 6 Registry Safety: PASS

**Approval:** approved 2026-06-30
