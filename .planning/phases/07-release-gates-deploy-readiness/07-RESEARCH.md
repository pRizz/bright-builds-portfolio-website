---
phase: 07-release-gates-deploy-readiness
generated_by: gsd-phase-researcher
lifecycle_mode: yolo
phase_lifecycle_id: 7-2026-05-31T22-21-18
generated_at: 2026-05-31T22:23:06.258Z
---

# Phase 7: Release Gates & Deploy Readiness Research

## Existing Release Surface

- `bun run verify` already runs formatting, Biome, typecheck, Vitest, curation checks, no visitor-runtime GitHub usage, visual-system checks, `bun run build`, `verify:browser`, `verify:static`, and `verify:release`.
- `scripts/verify-static.ts` already covers route HTML, route metadata, canonical links, OG/Twitter basics, sitemap, robots, JSON-LD, local social image assets, no remote visual assets, and reduced-motion CSS output.
- `scripts/verify-release.ts` already covers token-like output leaks, internal links/anchors, static output budgets, one `main`, one `h1`, skip link, JSON-LD presence, image alt, focus/reduced-motion CSS hooks, and primary external link presence.
- Phase 6 added Playwright/axe browser automation and integrated it into `bun run verify`.

## Gaps to Close

1. External-link verification is present but too implicit: it only checks required GitHub/OpenLinks href presence.
2. Deployment assumptions are documented lightly in `README.md`, but there is no checked release-readiness contract or verifier guard for Cloudflare/static settings.
3. `scripts/verify-release.ts` is already over the Bright Builds file-length refactor trigger, so new release policy logic should live in a smaller helper module.
4. `README.md` does not yet describe the new `verify:browser` gate or a release checklist that includes preview/deploy smoke checks.

## Recommended Approach

- Add `scripts/release-readiness.ts` with pure data-in/data-out helpers for:
  - external anchor extraction and policy coverage,
  - HTTPS and sensitive query-key checks,
  - required primary external link presence,
  - checked-in release-readiness document validation,
  - release-readiness evidence labels.
- Add focused Vitest coverage in `scripts/release-readiness.test.ts`.
- Update `scripts/verify-release.ts` to import the helper instead of carrying external-link policy logic inline.
- Add `docs/release-readiness.md` with Cloudflare Pages/static deployment assumptions, external-link policy, and preview/deploy checklist.
- Update `README.md` to point maintainers to the release-readiness document and mention `verify:browser`.

## Verification Plan

- `bun run format`
- `bun run check`
- `bun run typecheck`
- `bun run test`
- `bun run build`
- `bun run verify:release`
- `bun run verify`

## Standards Applied

- Bright Builds local guidance: preserve dark-primary and visual verification requirements.
- Bright Builds verification standard: use repo-owned aggregate verification.
- Bright Builds code-shape standard: split release-readiness logic out of the already-large release verifier.
- TypeScript standard: keep new automation in Bun/TypeScript, not Python.

***

*Research generated for Phase 7 planning.*
