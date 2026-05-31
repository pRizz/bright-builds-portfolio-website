# Phase 6: Browser & Accessibility Release Automation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-31T21:25:32.082Z
**Phase:** 6-Browser & Accessibility Release Automation
**Mode:** Yolo
**Areas discussed:** Browser Runner, Route and Viewport Coverage, Reduced Motion, Keyboard and Accessibility

---

## Browser Runner

| Option | Description | Selected |
|--------|-------------|----------|
| Playwright test runner | Checked-in browser specs with desktop/mobile projects, webServer support, and CI-friendly reporting. | yes |
| Ad hoc CLI screenshots | Quick local evidence but weak repeatability and harder failure reporting. | |
| Static-only heuristics | Fast and dependency-light but cannot prove keyboard traversal or rendered layout behavior. | |

**User's choice:** Auto-selected Playwright test runner.
**Notes:** The phase explicitly asks for repeatable browser release checks against shipped static output.

---

## Route and Viewport Coverage

| Option | Description | Selected |
|--------|-------------|----------|
| Route registry driven | Import `prerenderRoutes` from `src/domain/routes.ts` so coverage follows the static route source of truth. | yes |
| Hardcoded route list | Simpler but can drift as route registry changes. | |
| One route smoke test | Fast but misses core portfolio surfaces and does not satisfy Phase 6. | |

**User's choice:** Auto-selected route registry driven coverage.
**Notes:** Desktop and mobile dark rendering are required by repo-local guidance.

---

## Reduced Motion

| Option | Description | Selected |
|--------|-------------|----------|
| Browser-emulated reduced motion | Use Playwright `reducedMotion: "reduce"` and assert emitted hover/pointer behavior is static. | yes |
| Unit tests only | Existing unit tests cover the motion gate but do not prove rendered browser behavior. | |
| Manual inspection | Not repeatable enough for release automation. | |

**User's choice:** Auto-selected browser-emulated reduced motion.
**Notes:** Existing `ReactiveSurface` and CSS reduced-motion rules provide concrete browser-observable hooks.

---

## Keyboard and Accessibility

| Option | Description | Selected |
|--------|-------------|----------|
| Tab traversal plus axe | Real keyboard traversal for focus reachability plus route-scoped axe scans for accessibility violations. | yes |
| DOM-only focus checks | Cheaper but can miss hidden, skipped, or unreachable focus targets. | |
| Axe only | Useful for accessibility but does not prove the portfolio-specific keyboard paths. | |

**User's choice:** Auto-selected Tab traversal plus axe.
**Notes:** Failures must report clearly with route/project context and actionable labels.

---

## the agent's Discretion

- Helper function names and exact file organization.
- Layout overlap tolerance and diagnostic wording.
- Static server implementation details that do not change the observable release command contract.

## Deferred Ideas

- Lighthouse/performance gates, external-link policy, Cloudflare readiness, and aggregate release contract expansion are deferred to Phase 7.
