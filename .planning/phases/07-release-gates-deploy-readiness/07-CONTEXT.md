---
generated_by: gsd-discuss-phase
lifecycle_mode: yolo
phase_lifecycle_id: 7-2026-05-31T22-21-18
generated_at: 2026-05-31T22:23:06.258Z
---

# Phase 7: Release Gates & Deploy Readiness - Context

**Gathered:** 2026-05-31
**Status:** Ready for planning
**Mode:** yolo recommended answers

<domain>
## Phase Boundary

Phase 7 hardens the release-readiness contract for the already shipped static portfolio. It does not add new visitor-facing product scope.

This phase owns GATE-02, GATE-03, GATE-04, REL-01, REL-02, REL-03, and REL-04:

- SEO/static metadata checks must remain route-registry-driven and covered by the aggregate release command.
- Performance/best-practices coverage should stay realistic for a static site and avoid adding heavy tooling when current budget checks provide a durable local equivalent.
- External-link validation should be explicit and token-safe. Live network reachability should be manual release smoke-check policy, not a fragile local gate that fails on third-party blocking or rate limits.
- Cloudflare/static deployment assumptions need checked-in documentation and verifier coverage.
- The one command maintainers should trust remains `bun run verify`.

</domain>

<decisions>
## Implementation Decisions

### Release Contract Shape
- Keep `bun run verify` as the aggregate release command.
- Do not add a second primary release command for this phase unless it is a helper script called by the existing aggregate path.
- Make `verify:release` own the release-readiness contract that is not already covered by `verify:static` and `verify:browser`.

### SEO and Static Metadata
- Keep route-specific title, description, canonical, OG/Twitter, sitemap, robots, local social image, and JSON-LD checks in `scripts/verify-static.ts`.
- Phase 7 should make the aggregate contract explicit rather than duplicating all metadata assertions in a second verifier.

### Performance and Best-Practices Gate
- Use the existing post-build static budget checks as the local performance equivalent for now.
- Document that Lighthouse or hosted audit tools are optional release evidence, not a blocking local dependency for v1.1.
- Keep budgets deterministic and static-output based so releases do not depend on network or hosted tooling.

### External Links
- Validate external links by policy coverage, HTTPS enforcement, sensitive query-key rejection, and required primary link presence.
- Do not perform live HTTP requests in `bun run verify`; release docs should require manual smoke checks for external destinations.
- Allow unreachable or intermittently blocked third-party links when they are documented as manual-release links and covered by policy.

### Deployment Readiness
- Add a checked-in release-readiness document covering Cloudflare Pages/static deployment assumptions.
- The document must include build command, static output directory, package/runtime pins, environment expectations, preview deploy checks, post-deploy smoke checks, and token-safety guidance.
- The release verifier should fail if this document is missing required deployment or external-link policy facts.

### OpenLinks
- OpenLinks remains low-intrusion and discoverable through existing footer/about/contact/metadata surfaces.
- Do not add extra OpenLinks promotion in this phase beyond preserving policy coverage for `https://openlinks.us/`.
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Repo Instructions
- `AGENTS.md` - local dark-primary, verification, and GSD workflow guidance.
- `AGENTS.bright-builds.md` - Bright Builds workflow defaults and owner-specific OpenLinks guidance.
- `standards-overrides.md` - local exceptions placeholder; no active exception.

### Planning Scope
- `.planning/PROJECT.md` - v1.1 release confidence goal and constraints.
- `.planning/REQUIREMENTS.md` - Phase 7 requirement IDs.
- `.planning/ROADMAP.md` - Phase 7 goal, dependencies, and success criteria.
- `.planning/STATE.md` - current milestone position after Phase 6.
- `.planning/phases/06-browser-accessibility-release-automation/06-01-SUMMARY.md` - browser gate added in prior phase.
- `.planning/phases/06-browser-accessibility-release-automation/06-VERIFICATION.md` - Phase 6 proof and readiness for Phase 7.

### Code and Verification Surfaces
- `package.json` - aggregate verification command and script names.
- `scripts/verify-static.ts` - SEO/static metadata and generated asset checks.
- `scripts/verify-release.ts` - post-build release budget, semantic, accessibility, link, and token-safety checks.
- `scripts/verify-release.test.ts` - current unit coverage for release verifier behavior.
- `tests/browser-release.playwright.ts` - browser/accessibility gate included by the aggregate release command.
- `README.md` - current local setup, release, and static deployment docs.
- `CONTRIBUTING.md` - managed contribution defaults plus portfolio curation/token-safety notes.
</canonical_refs>

<specifics>
## Specific Ideas

- Prefer a small `scripts/release-readiness.ts` helper module over making `scripts/verify-release.ts` larger.
- External-link policy should cover current generated external origins such as GitHub, OpenLinks, Bright Builds, Free the World, win3bitco.in, and pRizz GitHub Pages links.
- Verifier error messages must not print token values from query strings.
- Documentation verification should look for exact release facts rather than vague prose.
</specifics>

<deferred>
## Deferred Ideas

- CI-hosted Lighthouse or live URL audits remain future work unless a later phase chooses to make hosted checks reliable.
- New project pages, richer OG image generation, analytics, CMS/admin, and additional visual polish remain out of scope for v1.1 Phase 7.
</deferred>

***

*Phase: 07-release-gates-deploy-readiness*
*Context gathered: 2026-05-31 via yolo discuss*
