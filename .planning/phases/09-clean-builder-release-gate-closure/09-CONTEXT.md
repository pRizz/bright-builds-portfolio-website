---
generated_by: gsd-discuss-phase
lifecycle_mode: yolo
phase_lifecycle_id: 09-2026-06-01T00-46-43
generated_at: 2026-06-01T00:46:43.210Z
---

# Phase 9: Clean Builder Release Gate Closure - Context

**Gathered:** 2026-06-01
**Status:** Ready for planning
**Mode:** Yolo

<domain>

## Phase Boundary

This phase closes the v1.1 milestone audit gap around clean-builder release verification. It must make the aggregate release gate runnable and understandable from a clean builder environment, with explicit Playwright/Chromium provisioning and complete release gate documentation.

This phase does not add new portfolio product features, new visual surfaces, or a CI provider migration. It tightens the release contract that already exists.

</domain>

<decisions>

## Implementation Decisions

### Browser Provisioning Contract

- **D-01:** Prefer a repo-owned script command for browser provisioning, then document that command in the release contract. The exact implementation can be chosen during planning, but maintainers should not have to infer `bunx playwright install chromium` from a Playwright error message.
- **D-02:** Do not hide browser installation inside a broad lifecycle hook such as `postinstall`. Keep provisioning explicit so local installs stay fast and deployment/build commands remain auditable.
- **D-03:** The clean-builder path should work for both local fresh machines and Cloudflare/static release builders. If Cloudflare needs an explicit command sequence, document that sequence next to the build command.

### Aggregate Gate Documentation

- **D-04:** Keep `bun run verify` as the single aggregate release gate.
- **D-05:** The release-readiness document must name every gate that materially contributes to `bun run verify`, including `verify:browser`, `verify:static`, `verify:release`, and `verify:project-helper-surface`.
- **D-06:** The README should remain a concise maintainer entrypoint. It should mention the browser provisioning prerequisite and helper-surface guard without duplicating the full release checklist.

### Regression Guard

- **D-07:** Extend the existing release-readiness document contract instead of adding a separate checker. `scripts/release-readiness.ts` and its tests already validate required document facts, so the new browser provisioning and helper-surface facts should fail focused tests if omitted.
- **D-08:** Verification for this phase must include focused release-readiness tests plus the aggregate `bun run verify`, because the original gap is specifically about the aggregate clean-builder release flow.

### the agent's Discretion

- The planner may choose the exact script name for browser provisioning, as long as it is discoverable from `package.json`, referenced from release docs, and avoids lifecycle hooks.
- The planner may decide whether the Cloudflare build command is documented as a single shell command or as separate setup/build steps, provided the release path is clear enough for a clean builder.

</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Scope and Audit

- `.planning/ROADMAP.md` — Phase 9 goal, requirements, and success criteria.
- `.planning/REQUIREMENTS.md` — `BROW-01`, `GATE-04`, `REL-03`, and `REL-04` are reopened and mapped to Phase 9.
- `.planning/v1.1-MILESTONE-AUDIT.md` — Source of the clean-builder Playwright provisioning gap and helper-surface documentation debt.

### Existing Release Contract

- `package.json` — Current script wiring for `verify`, `verify:browser`, `verify:static`, `verify:release`, and `verify:project-helper-surface`.
- `docs/release-readiness.md` — Maintainer-facing release contract and Cloudflare/static deployment checklist.
- `README.md` — Concise release command documentation for maintainers.
- `scripts/release-readiness.ts` — Pure release-readiness document and external-link policy helpers.
- `scripts/release-readiness.test.ts` — Focused tests for release-readiness document facts and policy behavior.
- `scripts/verify-release.ts` — Integrates release-readiness findings into post-build verification.
- `scripts/verify-release.test.ts` — Tests release verifier evidence labels and release checks.

### Browser Gate

- `playwright.config.ts` — Browser release check projects and static web server configuration.
- `tests/browser-release.playwright.ts` — Axe, dark layout, keyboard, and reduced-motion browser release checks.
- `scripts/serve-static-output.ts` — Static server used by the browser gate.
- `.planning/phases/06-browser-accessibility-release-automation/06-01-SUMMARY.md` — Records the original missing Chromium cache observation and install command.

</canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- `scripts/release-readiness.ts`: Existing document fact checker should be extended for the new required facts instead of adding a second release-doc scanner.
- `scripts/release-readiness.test.ts`: Existing tests can assert that the checked-in release document mentions the browser provisioning command and helper-surface guard.
- `package.json`: Existing script surface is the right place to expose an explicit browser provisioning command.

### Established Patterns

- Release checks use Bun-run TypeScript scripts and Vitest tests, not ad hoc shell or Python.
- `bun run verify` is the repo-owned aggregate release command and should stay the command maintainers use before release.
- Release-readiness documentation is treated as a checked artifact; missing required facts should produce test/verifier failures.

### Integration Points

- Browser provisioning must connect `package.json` scripts, `docs/release-readiness.md`, and the Cloudflare/static deployment checklist.
- Helper-surface visibility must connect the existing `verify:project-helper-surface` package script to README/release-readiness documentation and the release-readiness document contract.
- Final validation should prove `bun run verify` still runs through browser, static, release, and helper-surface gates.

</code_context>

<specifics>

## Specific Ideas

- Use the Phase 6 observed command, `bunx playwright install chromium`, as the baseline unless planning finds a cleaner Playwright-supported Bun command.
- Prefer explicit phrasing that a clean machine or clean builder must provision Chromium before running the aggregate gate.
- Avoid implying live external-link reachability is automated; that remains an intentional manual smoke-check policy from Phase 7.

</specifics>

<deferred>

## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 09-clean-builder-release-gate-closure*
*Context gathered: 2026-06-01*
