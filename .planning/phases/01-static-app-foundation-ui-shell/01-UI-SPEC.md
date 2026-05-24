---
generated_by: gsd-ui-phase
lifecycle_mode: yolo
phase_lifecycle_id: 01-2026-05-24T18-46-59
generated_at: 2026-05-24T18:52:00.000Z
status: complete
---

# Phase 1 UI Spec: Static App Foundation & UI Shell

## Scope

Phase 1 UI is a proof shell, not the final portfolio design. It should provide semantic, accessible base routes that prove the app, layout, navigation, theme CSS, and static output.

## Required Routes

- `/` - identity/home placeholder explaining that the portfolio shell is live.
- `/projects` - placeholder for the future curated project registry.
- `/about` - placeholder for Peter/Bright Builds context.
- `/contact` - placeholder for collaboration and identity links.

## Layout Requirements

- Use a single shared layout with header/nav, main content, and footer.
- Use real anchors for navigation.
- Keep content readable without JavaScript motion.
- Avoid final project cards, complex physics, or visual effects in this phase.
- Reserve final color/motion polish for Phase 4.

## Visual Direction

- Use a restrained, high-contrast foundation that can evolve toward the Bright Builds style.
- Include a subtle Mystic/Tailwind proof element if practical, but do not depend on Mystic internals for layout.
- Keep border radii at or below 8px for utility surfaces unless a later design contract decides otherwise.

## Accessibility Requirements

- Each route has one clear `h1`.
- Navigation links have visible focus states.
- Text must not overlap or depend on hover-only reveal.
- Footer includes a low-intrusion OpenLinks identity link when contact/profile data is available.

## Verification

- Static HTML for each base route contains the route title/content.
- The app can be navigated by links.
- `prefers-reduced-motion` is not required yet because Phase 1 does not implement motion.
