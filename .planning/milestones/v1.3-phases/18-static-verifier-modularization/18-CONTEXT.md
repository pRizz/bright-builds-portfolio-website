---
generated_by: gsd-discuss-phase
lifecycle_mode: yolo
phase_lifecycle_id: 18-2026-06-16T00-44-32
generated_at: 2026-06-16T00:44:32.234Z
---

# Phase 18: Static Verifier Modularization - Context

**Gathered:** 2026-06-16
**Status:** Ready for planning
**Mode:** Yolo

<domain>

## Phase Boundary

Phase 18 closes the v1.3 milestone audit's non-blocking maintenance debt by splitting the oversized static verifier into focused, repo-owned TypeScript modules or named helpers while preserving the existing `bun run verify:static` CLI contract and aggregate release gate.

This phase should not change visitor-facing routes, writing content, project content, metadata semantics, JSON-LD semantics, sitemap behavior, release-readiness claims, browser coverage, OpenLinks placement, package scripts, dependencies, or deployment assumptions. The work is a maintainability refactor with proof that generated-output assertion coverage remains intact.

</domain>

<decisions>

## Implementation Decisions

### Refactor Shape

- **D-01:** Keep `scripts/verify-static.ts` as the executable CLI entrypoint, but make it a thin orchestrator under the Bright Builds large-file refactor trigger.
- **D-02:** Move reusable assertion logic into focused repo-owned TypeScript modules under `scripts/`, not into new dependencies, generated files, Python helpers, or hidden inline scripts.
- **D-03:** Prefer concern-based boundaries: static output discovery/route HTML, route expected text, project detail assertions, writing assertions, metadata/JSON-LD assertions, sitemap/robots/assets assertions, and shared HTML assertion utilities.
- **D-04:** Preserve the current success message shape and `verify:static` package-script contract so existing clean-builder and aggregate verification flows keep working.

### Coverage Preservation

- **D-05:** Preserve all existing helper-derived checks. Assertions should continue to derive routes, writing entries, project detail pages, metadata, JSON-LD, sitemap XML, robots text, and related links from `src/domain/*` helpers rather than copied route or slug lists.
- **D-06:** Keep writing route coverage intact for `/writing` and public `/writing/{slug}` pages, including pre-hydration body content, metadata, `BlogPosting` JSON-LD, writing index `ItemList` JSON-LD, sitemap inclusion/exclusion, non-public/unknown route exclusion, related project links, and forbidden runtime residue.
- **D-07:** Keep project detail coverage intact for selected `/projects/{slug}` pages, including story content, action links, GitHub metadata facts, `SoftwareSourceCode` JSON-LD, sitemap inclusion, and unselected route exclusion.
- **D-08:** Keep site-wide checks intact for dark root HTML, shell landmarks, OpenLinks footer/profile presence, top-level route metadata, `Person` JSON-LD with OpenLinks `sameAs`, static assets, PNG dimensions, remote runtime visual asset bans, reduced-motion CSS, robots output, and forbidden template/runtime residue.

### Tests And Verification

- **D-09:** Add focused tests or fixture-backed checks for any new pure helper modules where behavior can be tested without building `.output/public`.
- **D-10:** If a helper remains tightly coupled to generated HTML files, prove preservation through `bun run build`, `bun run verify:static`, and the full aggregate `bun run verify` instead of inventing brittle unit fixtures.
- **D-11:** Include regression guards for the split preserving writing route coverage, project detail coverage, metadata/JSON-LD checks, sitemap inclusion/exclusion, unsafe href guards, and the static verifier success output.
- **D-12:** End verification with `bun run verify:static` and `bun run verify`; because Phase 18 affects the aggregate release gate, do not mark the phase passed without the full repo-native verification evidence.

### Scope Control

- **D-13:** Do not update release evidence labels or release-readiness prose unless the refactor uncovers an inaccurate existing claim. The intent is to keep release claims stable.
- **D-14:** Do not alter OpenLinks placement or promotion. Existing visible footer/about/contact links and `Person.sameAs`/writing JSON-LD identity hints remain the right low-intrusion posture.
- **D-15:** Do not broaden browser tests or UI checks unless a verifier split accidentally exposes a missing coverage gap; Phase 18 is not a new UI or accessibility feature.

### the agent's Discretion

- The planner may choose exact module names and grouping as long as `scripts/verify-static.ts` becomes a small orchestrator and the resulting modules have clear ownership.
- The planner may decide whether to move constants with the assertions that consume them or into a shared constants module, provided imports remain readable and there is no circular dependency.
- The planner may leave very small orchestration-only helpers in `scripts/verify-static.ts` if moving them would make the entrypoint harder to follow.

</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Scope And Audit Debt

- `.planning/ROADMAP.md` - Phase 18 goal, MAINT-01 requirement mapping, dependency on Phase 17, success criteria, and the explicit no-behavior-change verification boundary.
- `.planning/REQUIREMENTS.md` - MAINT-01 maintenance requirement and v1.3 out-of-scope exclusions.
- `.planning/PROJECT.md` - Current v1.3 state, clean-builder gate, static portfolio constraints, and key decisions for writing/release coverage.
- `.planning/v1.3-MILESTONE-AUDIT.md` - Source of the non-blocking tech debt: `scripts/verify-static.ts` is large and owns many cross-phase generated-output assertions.
- `.planning/research/PITFALLS.md` - Pitfall 8, verifier bloat and brittle exact-text checks.

### Prior Phase Decisions

- `.planning/phases/14-writing-domain-foundation/14-CONTEXT.md` - Writing registry, helper-derived routes, related selected-project contracts, and validation source of truth.
- `.planning/phases/15-writing-routes-and-dark-ui/15-CONTEXT.md` - Writing route/static UI behavior and helper-derived static output coverage.
- `.planning/phases/16-writing-metadata-and-structured-data/16-CONTEXT.md` - Writing metadata, `BlogPosting`/`ItemList` JSON-LD, sitemap, social fallback, and OpenLinks identity decisions.
- `.planning/phases/17-writing-verification-and-release-contract/17-CONTEXT.md` - Static, browser, release-readiness, evidence-label, and aggregate verification contracts that Phase 18 must preserve.

### Existing Verification Code

- `scripts/verify-static.ts` - Current oversized static verifier and the primary refactor target.
- `package.json` - `verify:static` and aggregate `verify` package scripts that must keep working.
- `scripts/verify-release.ts` - Release verifier and evidence-label output that the aggregate gate still runs.
- `scripts/verify-release.test.ts` - Current release evidence label regression tests.
- `scripts/release-readiness.ts` - Release-readiness facts and labels that should remain stable unless an existing claim is wrong.
- `scripts/release-readiness.test.ts` - Document fact and evidence-label guard tests.
- `docs/release-readiness.md` - Human release contract; only touch if the refactor uncovers stale release wording.

### Domain And Route Sources Of Truth

- `src/domain/routes.ts` - `prerenderRoutes` and top-level route metadata source.
- `src/domain/projects.ts` - Project detail route, story, action-link, and selected project helper source.
- `src/domain/writing.ts` - Public writing route, related project, and non-public exclusion helper source.
- `src/domain/seo.ts` - Metadata, JSON-LD, sitemap, robots, social fallback, and `Person.sameAs` helpers.
- `src/domain/github-metadata.ts` - GitHub metadata facts consumed by generated-output assertions.

### Standards And Identity Guidance

- `AGENTS.md` - Repo-local dark-primary and GSD workflow requirements.
- `AGENTS.bright-builds.md` - Bright Builds sync-first, verification, TypeScript, testing, code-shape, and OpenLinks guidance.
- `standards-overrides.md` - No active local exceptions beyond the placeholder table.
- `standards/core/architecture.md` - Keep assertion decisions in pure data-in/data-out helpers where practical.
- `standards/core/code-shape.md` - Split oversized functions/files, use shallow control flow, and keep nullable names explicit.
- `standards/core/testing.md` - Unit test pure helper behavior with focused Arrange/Act/Assert tests.
- `standards/core/verification.md` - Run repo-native verification before commit and prefer aggregate/owned commands.
- `standards/languages/typescript-javascript.md` - Keep repo-owned automation in TypeScript/Bun and avoid new Python scripts.
- `openlinks-identity-presence` skill - Preserve subtle visible OpenLinks placement and metadata hints without repetitive promotion.

</canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- `expectedRoutes` already derives from `prerenderRoutes`, so route coverage can stay centralized after the split.
- `metadataForRoute`, `metadataForProject`, `metadataForWritingEntry`, `projectJsonLd`, `writingBlogPostingJsonLd`, `writingItemListJsonLd`, `sitemapXml`, and `robotsTxt` provide pure expected values.
- `maybeProjectDetailPageProjectBySlug`, `projectDetailRoutes`, `maybePublicWritingEntryBySlug`, `publicWritingEntries`, and `writingDetailRoutes` provide route and exclusion sources of truth.
- Existing assertion helpers such as `assertHtmlContains`, `assertHtmlMatches`, `assertJsonLdContains`, `assertOutputTextEquals`, and `routeHtmlPath` are natural candidates for shared verifier utilities.

### Established Patterns

- Verification scripts are TypeScript files run through Bun from package scripts.
- The repo prefers pure helper tests for business logic and generated-output verification for `.output/public` facts.
- Static verification checks generated HTML before hydration and fails on forbidden visitor-runtime residue.
- Release claims are guarded separately by release-readiness and release verifier tests; Phase 18 should not duplicate that ownership.

### Integration Points

- `scripts/verify-static.ts` should import the new modules and execute route, asset, sitemap, robots, remote-asset, reduced-motion, and forbidden-output checks in a clear order.
- New files should live under a small `scripts/verify-static/` module folder or similarly explicit script-owned namespace.
- Unit tests can import pure helpers from those new modules if they do not execute the full CLI on import.
- `bun run verify:static` must still run the CLI entrypoint against the latest production build output.

</code_context>

<specifics>

## Specific Ideas

- A good split is likely: shared HTML/output utilities, route expected-text helpers, route HTML assertions, metadata/JSON-LD assertions, sitemap/robots/assets assertions, and the top-level CLI orchestrator.
- The refactor should make future writing/project assertion additions local to one module instead of extending a single thousand-line script.
- Preserve the existing terminal summary phrase that names `writing route coverage`; it is part of the release evidence humans currently inspect.
- Prefer moving code as-is first, then simplifying imports and names, so the behavior-preservation diff is easy to review.

</specifics>

<deferred>

## Deferred Ideas

- Richer per-route verifier fixture architecture can wait unless needed to prove this split.
- New release labels, new browser flows, live external-link crawling, hosted audits, RSS/search/tag coverage, CMS/admin support, and dynamic OG image checks remain out of scope.

</deferred>

---

*Phase: 18-static-verifier-modularization*
*Context gathered: 2026-06-16*
