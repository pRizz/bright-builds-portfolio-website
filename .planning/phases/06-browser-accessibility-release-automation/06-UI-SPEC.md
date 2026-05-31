---
phase: 6
slug: browser-accessibility-release-automation
status: approved
shadcn_initialized: false
preset: none
created: 2026-05-31
---

# Phase 6 — UI Design Contract

> Visual and interaction contract for browser release checks. This phase does not add visitor-facing UI; it codifies how the existing dark-primary portfolio UI is verified.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | none |
| Preset | not applicable |
| Component library | Mystic UI available through existing app setup; Phase 6 should not add UI components |
| Icon library | none for this phase |
| Font | Existing system sans stack in `src/styles/app.css` |

---

## Spacing Scale

Declared values for verification tolerances and expected layout behavior:

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Browser overlap tolerance and outline offset checks |
| sm | 8px | Compact element spacing |
| md | 16px | Default element spacing |
| lg | 24px | Section padding |
| xl | 32px | Layout gaps |
| 2xl | 48px | Major section breaks |
| 3xl | 64px | Page-level spacing |

Exceptions: Browser tests may use a 1px horizontal-overflow tolerance for fractional rendering.

---

## Typography

| Role | Size | Weight | Line Height |
|------|------|--------|-------------|
| Body | 16px | 400 | 1.5 |
| Label | 14px | 600 | 1.4 |
| Heading | 20px | 600 | 1.25 |
| Display | 36px | 600 | 1.15 |

---

## Color

| Role | Value | Usage |
|------|-------|-------|
| Dominant (60%) | `#050608` | Root background |
| Secondary (30%) | `#18181b` / `#0d1117` | Cards, surfaces, site shell bands |
| Accent (10%) | `#6ee7b7` / `#67e8f9` | Focus rings, links, selected accents |
| Destructive | not applicable | Phase 6 adds no destructive UI |

Accent reserved for: links, focus-visible rings, chip accents, and existing dark-primary visual treatments.

---

## Copywriting Contract

| Element | Copy |
|---------|------|
| Primary CTA | Existing portfolio CTAs only; Phase 6 adds no new visitor-facing CTA |
| Empty state heading | Existing project empty-state copy only |
| Empty state body | Existing project empty-state copy only |
| Error state | Browser test failures should include route, project, condition, and element label |
| Destructive confirmation | not applicable |

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official | none | not required |
| third-party visual blocks | none | do not add |

---

## Checker Sign-Off

- [x] Dimension 1 Copywriting: PASS
- [x] Dimension 2 Visuals: PASS
- [x] Dimension 3 Color: PASS
- [x] Dimension 4 Typography: PASS
- [x] Dimension 5 Spacing: PASS
- [x] Dimension 6 Registry Safety: PASS

**Approval:** approved 2026-05-31
