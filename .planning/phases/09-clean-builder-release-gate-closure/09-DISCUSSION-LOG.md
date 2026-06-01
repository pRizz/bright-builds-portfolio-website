# Phase 9: Clean Builder Release Gate Closure - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-01T00:46:43.210Z
**Phase:** 09-clean-builder-release-gate-closure
**Mode:** Yolo
**Areas discussed:** Browser Provisioning Contract, Aggregate Gate Documentation, Regression Guard

---

## Browser Provisioning Contract

| Option | Description | Selected |
|--------|-------------|----------|
| Explicit package script | Add a discoverable script around Playwright Chromium provisioning and document it for clean builders. | ✓ |
| Documentation only | Mention `bunx playwright install chromium` in docs without adding a package script. | |
| Postinstall hook | Install browsers automatically during dependency install. | |

**User's choice:** Auto-selected explicit package script.
**Notes:** The phase goal is release confidence, so the provisioning step should be auditable and repeatable. A lifecycle hook would hide cost and behavior from normal installs.

---

## Aggregate Gate Documentation

| Option | Description | Selected |
|--------|-------------|----------|
| Complete gate list | Name browser, static, release, and helper-surface gates in release docs and README. | ✓ |
| Release docs only | Keep README concise and update only the release-readiness page. | |
| Package scripts only | Rely on `package.json` as the source of truth. | |

**User's choice:** Auto-selected complete gate list.
**Notes:** README should stay concise, but it must not omit facts needed to understand why `bun run verify` blocks a release.

---

## Regression Guard

| Option | Description | Selected |
|--------|-------------|----------|
| Extend release-readiness contract | Add required facts to `scripts/release-readiness.ts` and focused tests. | ✓ |
| Add a separate docs checker | Create another verifier for browser provisioning docs. | |
| Manual review only | Document the facts without executable checks. | |

**User's choice:** Auto-selected extending the release-readiness contract.
**Notes:** Phase 7 already established checked release documentation, so this phase should reuse that surface and avoid another verifier.

---

## the agent's Discretion

- Planner may choose the exact package script name.
- Planner may choose the final Cloudflare command presentation, as long as clean-builder provisioning is explicit.

## Deferred Ideas

None.
