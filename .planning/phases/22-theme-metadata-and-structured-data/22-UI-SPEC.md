---
phase: 22
slug: theme-metadata-and-structured-data
status: approved
shadcn_initialized: false
preset: none
created: 2026-06-18
---

# Phase 22 - UI Design Contract

> Visual and interaction contract for frontend-adjacent metadata work. Generated inline after GSD UI subagents stalled, then verified by local workflow checks.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | none |
| Preset | not applicable |
| Component library | Mystic UI dependency remains available, but this phase should not add visual components |
| Icon library | lucide-solid remains available, but this phase should not add icons |
| Font | Existing site font stack from `src/styles/app.css` |

---

## Spacing Scale

Declared values (must be multiples of 4):

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Existing inline gaps only |
| sm | 8px | Existing compact spacing only |
| md | 16px | Existing default spacing only |
| lg | 24px | Existing section spacing only |
| xl | 32px | Existing layout gaps only |
| 2xl | 48px | Existing major section breaks only |
| 3xl | 64px | Existing page-level spacing only |

Exceptions: none. Phase 22 should not introduce spacing, layout, or card changes.

---

## Typography

| Role | Size | Weight | Line Height |
|------|------|--------|-------------|
| Body | existing `.body-copy` and route defaults | existing | existing |
| Label | existing `.eyebrow`, `.chip`, `.tier-pill` | existing | existing |
| Heading | existing `.card-title`, `.section-title` | existing | existing |
| Display | existing `.page-title` | existing | existing |

Phase 22 should not change typography scale. New visible fallback copy must fit existing `page-intro`, `page-title`, `lead`, and action-link patterns.

---

## Color

| Role | Value | Usage |
|------|-------|-------|
| Dominant (60%) | existing dark root/background tokens | Existing page shell and route surfaces |
| Secondary (30%) | existing visual-surface and panel tokens | Existing route panels only |
| Accent (10%) | existing link/focus tokens | Existing action links and focus rings only |
| Destructive | not applicable | No destructive actions in this phase |

Accent reserved for: existing links, focus indicators, and already defined interactive states. No new color tokens or palettes.

---

## Copywriting Contract

| Element | Copy |
|---------|------|
| Primary CTA | `Browse theme paths` for unknown or non-public theme fallback |
| Empty state heading | Existing `/themes` empty state remains `No public themes yet` |
| Empty state body | Existing `/themes` empty state body remains unchanged |
| Error state | `No public theme here` with a route back to `/themes`; do not echo requested slug |
| Destructive confirmation | Not applicable |

Metadata copy must describe the page subject directly:

- Theme index: existing `Themes | Peter Ryszkiewicz` route title and route description.
- Theme detail: `${theme.title} | Themes | Bright Builds`.
- Theme detail description: `theme.summary`.
- Social preview image alt: existing checked-in Bright Builds social image alt.

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official | none | not required |
| third-party registries | none | no registry use allowed |

No component registry, UI package, image-generation service, CMS, live link checker, or remote asset source should be added in this phase.

---

## Checker Sign-Off

- [x] Dimension 1 Copywriting: PASS
- [x] Dimension 2 Visuals: PASS
- [x] Dimension 3 Color: PASS
- [x] Dimension 4 Typography: PASS
- [x] Dimension 5 Spacing: PASS
- [x] Dimension 6 Registry Safety: PASS

**Approval:** approved 2026-06-18
