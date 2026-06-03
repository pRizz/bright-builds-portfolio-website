---
generated_by: gsd-phase-researcher
lifecycle_mode: yolo
phase_lifecycle_id: 13-2026-06-03T01-38-02
generated_at: 2026-06-03T01:44:39Z
---

# Phase 13: Project Page Release Coverage - Research

<user_constraints>

## User Constraints (from CONTEXT.md)

Copied verbatim from `.planning/phases/13-project-page-release-coverage/13-CONTEXT.md`. [VERIFIED: .planning/phases/13-project-page-release-coverage/13-CONTEXT.md]

### Locked Decisions

### Static Release Coverage

- **D-01:** Keep `projectDetailRoutes()` / `prerenderRoutes` as the canonical source for selected project detail route coverage. Do not introduce a second manually maintained project route list in release checks.
- **D-02:** Preserve the Phase 12 static verifier behavior that checks generated project detail HTML for story text, project metadata, project JSON-LD, sitemap inclusion, local social preview mapping, and forbidden runtime GitHub/template residue.
- **D-03:** If static verification needs changes, make them explicit regression guards around the existing generated HTML contract rather than new production behavior.

### Browser Release Coverage

- **D-04:** Extend browser release checks so selected project detail routes are visibly included in axe coverage, desktop and mobile dark layout overflow/overlap checks, keyboard reachability, and reduced-motion behavior.
- **D-05:** Use representative selected detail routes from `projectDetailRoutes()` for browser-only checks that would be too expensive or redundant across every project, while keeping route selection derived from the project registry.
- **D-06:** Keep dark-primary expectations strict: browser layout checks must continue to assert the root `.dark` class, no horizontal overflow, and no obvious text/control overlap on desktop and mobile.
- **D-07:** Keyboard coverage must prove a user can reach at least one selected project detail route from the release-critical navigation flow and can reach release-critical links on a project detail page, including the project index/back path and project action links.
- **D-08:** Reduced-motion coverage should exercise a project detail route as well as the home route so project-page interactive surfaces do not regain decorative hover or pointer motion when `prefers-reduced-motion: reduce` is active.

### Release Readiness Documentation and Evidence

- **D-09:** `docs/release-readiness.md` must explicitly name project detail route coverage in the aggregate release gate and the clean-builder command sequence `bun run install:browser && bun run verify`.
- **D-10:** Release-readiness checks should fail if the documentation stops mentioning project detail route coverage, including static metadata/JSON-LD/sitemap coverage and browser axe/layout/keyboard/reduced-motion coverage.
- **D-11:** Release evidence labels emitted by `bun run verify:release` should include project detail route coverage so release output communicates that the clean-builder gate covered this surface.
- **D-12:** Preview and production smoke-check guidance should include at least one selected `/projects/{slug}` route, not only `/projects` anchors.

### Clean-Builder Gate

- **D-13:** Keep `bun run verify` as the aggregate release gate and `bun run install:browser && bun run verify` as the clean-builder command sequence.
- **D-14:** Do not introduce network-dependent browser/link checks into local release verification. External links remain policy-checked locally and smoke-checked manually per existing release-readiness guidance.
- **D-15:** Verification for this phase must include the repo-native aggregate gate after implementation; focused tests are useful during execution but not sufficient for final completion.

### the agent's Discretion

- The agent may choose the exact representative detail route for browser checks, but it should come from `projectDetailRoutes()` and should fail loudly if no project detail routes are selected.
- The agent may split release-readiness helpers or browser helper functions if it reduces duplication or keeps files below the Bright Builds refactor triggers without broad unrelated rewrites.

### Deferred Ideas (OUT OF SCOPE)

- Project-specific raster Open Graph image generation remains deferred to future `OG-01` / `OG-02` style work.
- Browser-provider hosted audits or Lighthouse CI remain optional extra evidence, not required local release gates for this phase.
- Additional project detail routes for supporting/lab/archive projects remain out of scope; route selection stays flagship/detail-authored only.

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
| --- | --- | --- |
| VERIFY-02 | Static verification checks generated project detail HTML for expected story text, metadata, JSON-LD, sitemap inclusion, and forbidden runtime GitHub residue. | Phase 12 already extended `scripts/verify-static.ts` to derive expected routes from `prerenderRoutes`, check project detail story text, metadata, project JSON-LD, sitemap inclusion/exclusion, local social image mapping, and forbidden runtime GitHub/template residue; Phase 13 should preserve this and treat any edits as regression guards. [VERIFIED: scripts/verify-static.ts] [VERIFIED: .planning/phases/12-project-metadata-sharing/12-VERIFICATION.md] |
| VERIFY-03 | Browser release checks include project detail routes for axe, dark desktop/mobile layout, keyboard reachability, and reduced-motion behavior. | `tests/browser-release.playwright.ts` already loops over `prerenderRoutes` for axe and layout checks, so planning should add representative project-detail coverage to the keyboard and reduced-motion tests without duplicating the full route matrix. [VERIFIED: tests/browser-release.playwright.ts] |
| VERIFY-04 | Release-readiness documentation and checks identify project detail route coverage as part of `bun run install:browser && bun run verify`. | `docs/release-readiness.md`, `scripts/release-readiness.ts`, `scripts/release-readiness.test.ts`, and `scripts/verify-release.test.ts` are the release-readiness contract surfaces that currently name the clean-builder command but do not yet require project detail route coverage wording or evidence labels. [VERIFIED: docs/release-readiness.md] [VERIFIED: scripts/release-readiness.ts] [VERIFIED: scripts/release-readiness.test.ts] [VERIFIED: scripts/verify-release.test.ts] |

</phase_requirements>

## Summary

Phase 13 is a verification-contract phase, not a production UI or metadata phase. [VERIFIED: .planning/phases/13-project-page-release-coverage/13-CONTEXT.md] The right plan is to preserve the Phase 12 static verifier, extend browser representative coverage for project detail keyboard and reduced-motion behavior, and make release-readiness docs/checks/evidence labels explicitly name project detail route coverage. [VERIFIED: scripts/verify-static.ts] [VERIFIED: tests/browser-release.playwright.ts] [VERIFIED: scripts/release-readiness.ts]

The canonical route source is already in place: `projectDetailRoutes()` derives selected `/projects/{slug}` paths from the curated project registry, and `prerenderRoutes` combines top-level routes with those selected project detail routes. [VERIFIED: src/domain/projects.ts] [VERIFIED: src/domain/routes.ts] The browser suite already scans every prerendered route for axe violations and desktop/mobile dark layout findings, which means Phase 13 should avoid a second route list and target only the representative browser behaviors that are still home-only. [VERIFIED: tests/browser-release.playwright.ts]

**Primary recommendation:** create one focused plan that updates browser representative project-detail checks, release-readiness facts/evidence labels, release-readiness documentation, and focused unit/browser verification before the final `bun run verify` aggregate gate. [VERIFIED: package.json] [VERIFIED: .planning/phases/13-project-page-release-coverage/13-CONTEXT.md]

**Confidence:** HIGH for implementation targets because all target files and current behavior were read locally; MEDIUM for environment parity because local Bun is `1.3.9` while the project pin is `bun@1.3.14`. [VERIFIED: package.json] [VERIFIED: bash command `bun --version`]

## Project Constraints (from AGENTS.md)

- Read `AGENTS.md`, `AGENTS.bright-builds.md`, `standards-overrides.md`, and the pinned canonical standards pages before plan, review, implementation, or audit work. [VERIFIED: AGENTS.md] [VERIFIED: AGENTS.bright-builds.md] [CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/index.md]
- Keep the portfolio dark-primary, keep `.dark` active on the root document, and treat light-first utility classes as exceptions needing local reason. [VERIFIED: AGENTS.md]
- UI verification must include desktop and mobile dark rendering, contrast/readability, and text-overlap checks. [VERIFIED: AGENTS.md]
- Do not make direct repo edits outside a GSD workflow unless explicitly bypassed by the user. [VERIFIED: AGENTS.md]
- Prefer functional core / imperative shell, pure data-in/data-out helpers, and unit tests for pure/business logic. [CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/architecture.md] [CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/testing.md]
- Prefix nullable internal TypeScript names with `maybe`, prefer early returns, and treat functions over roughly 161 lines and files over roughly 628 lines as refactor triggers. [CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/code-shape.md] [CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/languages/typescript-javascript.md]
- Unit tests must test one concern and clearly delineate Arrange, Act, Assert unless the structure is trivial. [CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/testing.md]
- Use Bun for this existing TS/Solid project and keep repo-owned automation in TS/JS rather than adding Python scripts. [VERIFIED: package.json] [CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/languages/typescript-javascript.md]
- Use the OpenLinks identity placement bias conservatively: visible link first, metadata second, and do not make OpenLinks more prominent than the host project. [VERIFIED: AGENTS.bright-builds.md] [VERIFIED: /Users/peterryszkiewicz/.codex/skills/openlinks-identity-presence/SKILL.md]
- No active local standards overrides are recorded beyond placeholder rows. [VERIFIED: standards-overrides.md]

## Standard Stack

### Core

| Tool / Library | Project Pin | Registry Latest / Modified | Purpose | Planning Guidance |
| --- | --- | --- | --- | --- |
| Bun | `packageManager: "bun@1.3.14"` | local installed `1.3.9`; runtime registry not applicable | Package manager and script runner for release gates. | Do not change the package-manager contract; note that the local runner is below the project pin when interpreting local results. [VERIFIED: package.json] [VERIFIED: bash command `bun --version`] |
| `@playwright/test` | `1.60.0` | `1.60.0`, modified `2026-06-02T06:46:32.490Z` | Browser release checks and local static server orchestration. | Use existing Playwright projects and helpers; do not add another browser framework. [VERIFIED: package.json] [VERIFIED: npm registry] [VERIFIED: playwright.config.ts] |
| `@axe-core/playwright` | `4.11.3` | `4.11.3`, modified `2026-06-02T15:16:27.662Z` | Axe accessibility scans inside Playwright. | Keep axe coverage in `tests/browser-release.playwright.ts`; selected project detail routes are already included through `prerenderRoutes`. [VERIFIED: package.json] [VERIFIED: npm registry] [VERIFIED: tests/browser-release.playwright.ts] |
| Vitest | `4.1.7` | `4.1.8`, modified `2026-06-01T09:45:01.761Z` | Unit tests for release-readiness and verifier helpers. | Use existing pinned Vitest; do not upgrade during this phase. [VERIFIED: package.json] [VERIFIED: npm registry] |
| Biome | `2.4.15` | `2.4.16`, modified `2026-05-27T13:41:35.665Z` | Formatting and lint/check gate. | Use existing repo scripts; do not upgrade during this phase. [VERIFIED: package.json] [VERIFIED: npm registry] |
| TypeScript | `6.0.3` | `6.0.3`, modified `2026-04-16T23:38:28.092Z` | Typechecking for source, scripts, and tests. | Keep helper changes typed and run `bun run typecheck` through the aggregate gate. [VERIFIED: package.json] [VERIFIED: npm registry] |

### Supporting

| Surface | Current Role | Planning Guidance |
| --- | --- | --- |
| `projectDetailRoutes()` | Derives selected detail paths from curated project records. | Use this for any representative route selection and fail loudly if it returns no route. [VERIFIED: src/domain/projects.ts] |
| `prerenderRoutes` | Combines top-level routes with selected detail routes. | Keep exhaustive static/browser axe/layout route loops on this route set. [VERIFIED: src/domain/routes.ts] [VERIFIED: tests/browser-release.playwright.ts] |
| `releaseReadinessDocumentFindings()` | Enforces required text facts in `docs/release-readiness.md`. | Add project-detail coverage facts here rather than relying on documentation review only. [VERIFIED: scripts/release-readiness.ts] |
| `releaseEvidenceLabels()` | Emits labels from `verify-release` output by composing local labels with release-readiness labels. | Include project detail route coverage through `releaseReadinessEvidenceLabels()`. [VERIFIED: scripts/verify-release.ts] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
| --- | --- | --- |
| `projectDetailRoutes()` / `prerenderRoutes` | A hand-written route list in browser/release docs tests | Reject because Phase 13 explicitly forbids a second manually maintained project route list. [VERIFIED: .planning/phases/13-project-page-release-coverage/13-CONTEXT.md] |
| Existing Playwright/axe suite | Lighthouse CI or hosted browser-provider audit | Reject for this phase because hosted audits are explicitly deferred and not required local gates. [VERIFIED: .planning/phases/13-project-page-release-coverage/13-CONTEXT.md] |
| Existing external-link policy checks | Live HTTP crawling in local verification | Reject because local release verification must stay deterministic and network-independent. [VERIFIED: .planning/phases/13-project-page-release-coverage/13-CONTEXT.md] [VERIFIED: docs/release-readiness.md] |

**Installation:** no new dependencies should be installed for this phase. [VERIFIED: .planning/phases/13-project-page-release-coverage/13-CONTEXT.md] If Chromium is absent on a clean builder, use the existing command. [VERIFIED: package.json]

```bash
bun run install:browser
```

## Architecture Patterns

### Recommended Project Structure

```text
tests/
└── browser-release.playwright.ts      # project-detail browser release behavior
scripts/
├── release-readiness.ts               # pure release document facts and evidence labels
├── release-readiness.test.ts          # Vitest contract tests for release docs/labels
├── verify-release.ts                  # imperative release verifier entrypoint
└── verify-release.test.ts             # Vitest evidence-label/semantic verifier tests
docs/
└── release-readiness.md               # clean-builder and smoke-check guidance
src/domain/
├── projects.ts                        # selected project detail route source
└── routes.ts                          # prerender route composition
```

This structure matches the current codebase ownership boundaries and avoids new production UI or metadata files. [VERIFIED: tests/browser-release.playwright.ts] [VERIFIED: scripts/release-readiness.ts] [VERIFIED: docs/release-readiness.md] [VERIFIED: src/domain/projects.ts] [VERIFIED: src/domain/routes.ts]

### Pattern 1: Derived Representative Project Route

**What:** choose a representative project detail route by reading `projectDetailRoutes()` and throwing if none exists. [VERIFIED: src/domain/projects.ts]  
**When to use:** use for keyboard and reduced-motion browser checks where testing every project would duplicate the existing `prerenderRoutes` axe/layout matrix. [VERIFIED: tests/browser-release.playwright.ts] [VERIFIED: .planning/phases/13-project-page-release-coverage/13-CONTEXT.md]

```ts
// Pattern derived from the existing project route helper contract. [VERIFIED: src/domain/projects.ts]
function representativeProjectDetailRoute(): string {
  const maybeRoute = projectDetailRoutes()[0];

  if (!maybeRoute) {
    throw new Error("Expected at least one selected project detail route for release coverage.");
  }

  return maybeRoute;
}
```

### Pattern 2: Browser Behavior Helpers Stay Local to Playwright

**What:** keep DOM probing helpers such as focus target collection, layout findings, and reduced-motion pointer checks inside `tests/browser-release.playwright.ts`. [VERIFIED: tests/browser-release.playwright.ts]  
**When to use:** add small helpers only when they reduce duplication between home and representative project detail behavior checks. [VERIFIED: .planning/phases/13-project-page-release-coverage/13-CONTEXT.md]

```ts
// Pattern derived from the existing browser release helper style. [VERIFIED: tests/browser-release.playwright.ts]
async function assertReducedMotionStableOnRoute(page: Page, route: string): Promise<void> {
  await page.goto(route);
  const hoverTarget = page.locator(".interactive-surface, .surface-link").first();
  await hoverTarget.hover();
  expect(await hoverTarget.evaluate((element) => getComputedStyle(element).transform)).toBe("none");
}
```

### Pattern 3: Release-Readiness Facts as Pure Data

**What:** keep documentation-required facts and evidence labels as pure values/functions in `scripts/release-readiness.ts`. [VERIFIED: scripts/release-readiness.ts]  
**When to use:** add facts for project detail static metadata/JSON-LD/sitemap coverage, browser axe/layout/keyboard/reduced-motion coverage, clean-builder coverage, and a representative selected route. [VERIFIED: .planning/phases/13-project-page-release-coverage/13-CONTEXT.md]

```ts
// Pattern follows the existing RequiredDocumentFact array. [VERIFIED: scripts/release-readiness.ts]
const requiredProjectDetailRoute = projectDetailRoutes()[0];
const requiredProjectDetailFacts = [
  { label: "project detail route coverage", text: "project detail route coverage" },
  { label: "representative project smoke route", text: requiredProjectDetailRoute },
] as const;
```

### Anti-Patterns to Avoid

- **Second route list:** do not create a manual list of project paths in tests or docs helpers because Phase 13 locks `projectDetailRoutes()` / `prerenderRoutes` as canonical. [VERIFIED: .planning/phases/13-project-page-release-coverage/13-CONTEXT.md]
- **Browser matrix bloat:** do not add nested loops that retest keyboard/reduced-motion behavior across every selected project because axe/layout already loop every `prerenderRoutes` entry. [VERIFIED: tests/browser-release.playwright.ts]
- **Product churn:** do not add project UI, metadata fields, runtime GitHub behavior, or per-project OG images because those are explicitly out of scope. [VERIFIED: .planning/phases/13-project-page-release-coverage/13-CONTEXT.md]
- **Network-dependent verification:** do not introduce live external-link crawling into local verification because current release policy is local deterministic checking plus manual smoke checks. [VERIFIED: .planning/phases/13-project-page-release-coverage/13-CONTEXT.md] [VERIFIED: docs/release-readiness.md]

## Implementation Targets

| Target | Current State | Recommended Change |
| --- | --- | --- |
| `tests/browser-release.playwright.ts` | Axe and layout tests already loop over all `prerenderRoutes`; keyboard and reduced-motion tests currently exercise the home route flow only. [VERIFIED: tests/browser-release.playwright.ts] | Import `projectDetailRoutes`, derive one representative selected route, assert keyboard focus reaches that detail route from home/navigation flow, assert keyboard focus reaches the detail page `Project index` link and at least one project action link, and run reduced-motion checks against both `/` and the representative detail route. [VERIFIED: .planning/phases/13-project-page-release-coverage/13-CONTEXT.md] |
| `scripts/release-readiness.ts` | Required document facts include the aggregate command, clean-builder command, browser/static/release gates, manual smoke checks, and token warning. [VERIFIED: scripts/release-readiness.ts] | Add required facts for project detail route coverage, static metadata/JSON-LD/sitemap coverage, browser axe/layout/keyboard/reduced-motion coverage, and at least one selected detail path derived from `projectDetailRoutes()`. [VERIFIED: .planning/phases/13-project-page-release-coverage/13-CONTEXT.md] |
| `scripts/release-readiness.ts` | Evidence labels currently name SEO/static metadata, static budgets, external link policy, Cloudflare/static deployment, and preview/deploy smoke checks. [VERIFIED: scripts/release-readiness.ts] | Add a project-detail release coverage evidence label so `bun run verify:release` output communicates that this surface is covered. [VERIFIED: .planning/phases/13-project-page-release-coverage/13-CONTEXT.md] [VERIFIED: scripts/verify-release.ts] |
| `docs/release-readiness.md` | The document names browser/static/release gates and the clean-builder sequence but does not explicitly name project detail route coverage or a selected `/projects/{slug}` smoke path. [VERIFIED: docs/release-readiness.md] | Name project detail route coverage under the aggregate gate, `verify:static`, `verify:browser`, clean-builder, preview checklist, production checklist, and post-deploy smoke guidance. [VERIFIED: .planning/phases/13-project-page-release-coverage/13-CONTEXT.md] |
| `scripts/release-readiness.test.ts` | Tests pin current required doc facts and current evidence labels. [VERIFIED: scripts/release-readiness.test.ts] | Add negative tests that remove project detail route coverage facts and assert findings, plus update evidence label expectations. [VERIFIED: scripts/release-readiness.test.ts] |
| `scripts/verify-release.test.ts` | Tests assert release evidence labels do not overclaim external suite coverage. [VERIFIED: scripts/verify-release.test.ts] | Update expected release evidence labels to include project detail route coverage without claiming hosted audits. [VERIFIED: scripts/verify-release.test.ts] |
| `scripts/verify-static.ts` | Already verifies selected detail route story text, metadata, JSON-LD, sitemap inclusion/exclusion, local social image mapping, dark root, reduced-motion CSS, and forbidden output residue. [VERIFIED: scripts/verify-static.ts] | Prefer no change unless a focused regression guard is needed; do not add production behavior. [VERIFIED: .planning/phases/13-project-page-release-coverage/13-CONTEXT.md] |

## Recommended Plan Shape

1. **Task 1: Browser representative project detail coverage.** Update `tests/browser-release.playwright.ts` so keyboard and reduced-motion behavior include a route derived from `projectDetailRoutes()` while preserving the existing exhaustive axe/layout loops over `prerenderRoutes`. [VERIFIED: tests/browser-release.playwright.ts] [VERIFIED: src/domain/projects.ts]
2. **Task 2: Release-readiness document contract.** Update `scripts/release-readiness.ts`, `scripts/release-readiness.test.ts`, and `docs/release-readiness.md` so project detail route coverage is a required document fact and a release evidence label. [VERIFIED: scripts/release-readiness.ts] [VERIFIED: docs/release-readiness.md]
3. **Task 3: Release verifier evidence tests and aggregate gate.** Update `scripts/verify-release.test.ts` for the new evidence label and run focused tests, browser/static/release checks, and final `bun run verify`. [VERIFIED: scripts/verify-release.test.ts] [VERIFIED: package.json]

This should be one plan because the changed surfaces are tightly coupled by the release-readiness contract and the aggregate gate. [VERIFIED: .planning/phases/13-project-page-release-coverage/13-CONTEXT.md]

## Verification Commands

Use focused checks during execution, then finish with the aggregate gate. [VERIFIED: .planning/phases/13-project-page-release-coverage/13-CONTEXT.md] [VERIFIED: package.json]

```bash
bun run format:check
bun run check
bun run typecheck
bun run test -- scripts/release-readiness.test.ts scripts/verify-release.test.ts
bun run build
bun run verify:browser
bun run verify:static
bun run verify:release
bun run verify
```

For a true clean-builder verification, use the documented provisioning command before the aggregate gate. [VERIFIED: docs/release-readiness.md] [VERIFIED: package.json]

```bash
bun run install:browser && bun run verify
```

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
| --- | --- | --- | --- |
| Selected project route discovery | A second array of selected project paths | `projectDetailRoutes()` and `prerenderRoutes` | Route selection is already typed and tested in the domain layer. [VERIFIED: src/domain/projects.ts] [VERIFIED: src/domain/routes.ts] |
| Accessibility checks | Custom accessibility scanner | `@axe-core/playwright` in the existing Playwright suite | Axe is already installed and wired into browser release checks. [VERIFIED: package.json] [VERIFIED: tests/browser-release.playwright.ts] |
| Layout overlap checks | A new screenshot diff system | Existing `layoutFindingsForPage()` browser helper | The helper already checks `.dark`, horizontal overflow, and obvious overlap on desktop and mobile projects. [VERIFIED: tests/browser-release.playwright.ts] |
| Release document enforcement | Manual-only documentation review | `releaseReadinessDocumentFindings()` and Vitest tests | The release-readiness contract already fails on missing required facts. [VERIFIED: scripts/release-readiness.ts] [VERIFIED: scripts/release-readiness.test.ts] |
| External link confidence | Live network crawling from local verification | Existing external-link policy plus manual smoke guidance | Phase 13 explicitly forbids network-dependent local link checks. [VERIFIED: .planning/phases/13-project-page-release-coverage/13-CONTEXT.md] [VERIFIED: docs/release-readiness.md] |

**Key insight:** Phase 13 should make existing release evidence more explicit; it should not invent new release infrastructure. [VERIFIED: .planning/phases/13-project-page-release-coverage/13-CONTEXT.md]

## Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Representative route selection silently returns nothing | Browser tests could pass without project detail coverage if route selection is not guarded. | Throw immediately when `projectDetailRoutes()[0]` is absent. [VERIFIED: .planning/phases/13-project-page-release-coverage/13-CONTEXT.md] |
| Keyboard focus helper limit is too low for project detail pages | Project action links might be reachable but missed by the test after `maxKeyboardTabs = 40`. | Increase the cap only if needed or add a targeted helper that stops after required route/action links are observed. [VERIFIED: tests/browser-release.playwright.ts] |
| Reduced-motion test assumes `.reactive-surface` exists on every route | A project detail route could fail for missing test fixture rather than motion regression. | Reuse the existing fail-loud behavior only after confirming the route has a visible motion surface, or adapt the helper to assert the relevant project-page `.surface-link` and shell reactive surface separately. [VERIFIED: tests/browser-release.playwright.ts] [VERIFIED: src/routes/projects/[slug].tsx] |
| Documentation facts become too generic | The release-readiness check could pass while omitting static metadata/JSON-LD/sitemap or browser keyboard/reduced-motion details. | Add separate required facts for static project-detail coverage and browser project-detail coverage. [VERIFIED: .planning/phases/13-project-page-release-coverage/13-CONTEXT.md] |
| Documentation facts become too route-specific | Future selected route changes could require doc updates even when coverage remains valid. | Derive any required representative path from `projectDetailRoutes()` in the checker and document one current selected example in the docs. [VERIFIED: src/domain/projects.ts] |
| Large verifier files keep growing | `scripts/verify-static.ts` has 870 lines and `scripts/verify-release.ts` has 628 lines, which touch Bright Builds file-size refactor triggers. | Avoid broad splits unless the Phase 13 edit meaningfully worsens readability; prefer editing `release-readiness.ts` and tests for this phase. [VERIFIED: bash command `wc -l`] [CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/core/code-shape.md] |
| Local Bun differs from project pin | Local verification may not perfectly match a clean builder pinned to Bun `1.3.14`. | Keep docs and Cloudflare settings pinned to `BUN_VERSION=1.3.14`; report local Bun `1.3.9` if verification behavior differs. [VERIFIED: package.json] [VERIFIED: docs/release-readiness.md] [VERIFIED: bash command `bun --version`] |

## Common Pitfalls

### Pitfall 1: Treating Static Coverage as Missing

**What goes wrong:** the planner adds duplicate static checks even though Phase 12 already verifies project detail story text, metadata, JSON-LD, sitemap inclusion/exclusion, social preview mapping, and forbidden residue. [VERIFIED: scripts/verify-static.ts]  
**Why it happens:** VERIFY-02 is still pending in `.planning/REQUIREMENTS.md`, but Phase 12 implementation created most of the static verifier behavior before Phase 13 planning. [VERIFIED: .planning/REQUIREMENTS.md] [VERIFIED: .planning/phases/12-project-metadata-sharing/12-VERIFICATION.md]  
**How to avoid:** plan to preserve and validate the existing `verify:static` behavior unless an explicit regression guard is missing. [VERIFIED: .planning/phases/13-project-page-release-coverage/13-CONTEXT.md]  
**Warning sign:** a task proposes new production SEO, JSON-LD, sitemap, or social preview code. [VERIFIED: .planning/phases/13-project-page-release-coverage/13-CONTEXT.md]

### Pitfall 2: Overclaiming Browser Coverage

**What goes wrong:** release evidence says project detail routes are covered while keyboard and reduced-motion still only exercise `/`. [VERIFIED: tests/browser-release.playwright.ts]  
**Why it happens:** axe/layout loops over `prerenderRoutes`, but current keyboard and reduced-motion tests are standalone home-route tests. [VERIFIED: tests/browser-release.playwright.ts]  
**How to avoid:** add representative project detail route assertions before changing release evidence labels. [VERIFIED: .planning/phases/13-project-page-release-coverage/13-CONTEXT.md]  
**Warning sign:** `releaseReadinessEvidenceLabels()` changes without a corresponding Playwright test change. [VERIFIED: scripts/release-readiness.ts] [VERIFIED: tests/browser-release.playwright.ts]

### Pitfall 3: Turning Manual Smoke Checks Into Local Network Gates

**What goes wrong:** local verification starts crawling GitHub, OpenLinks, or project live URLs. [VERIFIED: docs/release-readiness.md]  
**Why it happens:** release-readiness docs include manual external-link smoke checks, which can be mistaken for automation requirements. [VERIFIED: docs/release-readiness.md]  
**How to avoid:** keep external link coverage policy-based in `scripts/release-readiness.ts` and leave live checks in manual preview/production guidance. [VERIFIED: scripts/release-readiness.ts] [VERIFIED: .planning/phases/13-project-page-release-coverage/13-CONTEXT.md]  
**Warning sign:** a new test uses `fetch`, HTTP status checks, or third-party browser navigation as a local gate. [VERIFIED: .planning/phases/13-project-page-release-coverage/13-CONTEXT.md]

### Pitfall 4: Weak Release-Readiness Text Facts

**What goes wrong:** a broad phrase such as "browser checks" satisfies the doc guard even if project detail route coverage disappears. [VERIFIED: scripts/release-readiness.ts]  
**Why it happens:** `releaseReadinessDocumentFindings()` currently checks exact text inclusion, so fact labels and strings must be chosen carefully. [VERIFIED: scripts/release-readiness.ts]  
**How to avoid:** require exact phrases for project detail route coverage, static metadata/JSON-LD/sitemap coverage, browser axe/layout/keyboard/reduced-motion coverage, and the representative selected route. [VERIFIED: .planning/phases/13-project-page-release-coverage/13-CONTEXT.md]  
**Warning sign:** docs mention `/projects` anchors but not a `/projects/{slug}` route. [VERIFIED: docs/release-readiness.md] [VERIFIED: .planning/phases/13-project-page-release-coverage/13-CONTEXT.md]

## Code Examples

### Representative Route Guard

```ts
// Source pattern: selected routes are derived from projectDetailRoutes(). [VERIFIED: src/domain/projects.ts]
function representativeProjectDetailRoute(): string {
  const maybeRoute = projectDetailRoutes()[0];

  if (!maybeRoute) {
    throw new Error("Expected at least one selected project detail route for release coverage.");
  }

  return maybeRoute;
}
```

### Keyboard Coverage Shape

```ts
// Source pattern: keyboardFocusTargets already captures href, label, and visibility. [VERIFIED: tests/browser-release.playwright.ts]
test("keyboard focus reaches project detail release-critical paths", async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name === reducedMotionProject,
    "keyboard focus coverage runs on desktop and mobile projects",
  );

  const detailRoute = representativeProjectDetailRoute();
  await page.goto("/");
  expect(hasFocusedInternalPath(await keyboardFocusTargets(page), detailRoute)).toBe(true);

  await page.goto(detailRoute);
  const focusedTargets = await keyboardFocusTargets(page);
  expect(hasFocusedInternalPath(focusedTargets, "/projects")).toBe(true);
  expect(hasFocusedExternalProjectAction(focusedTargets)).toBe(true);
});
```

### Release-Readiness Fact Shape

```ts
// Source pattern: requiredReleaseReadinessDocumentFacts is an exact-text contract. [VERIFIED: scripts/release-readiness.ts]
const requiredProjectDetailRoute = representativeProjectDetailRoute();
const requiredReleaseReadinessDocumentFacts = [
  { label: "project detail route coverage", text: "project detail route coverage" },
  {
    label: "project detail static coverage",
    text: "project detail metadata, JSON-LD, and sitemap coverage",
  },
  {
    label: "project detail browser coverage",
    text: "project detail axe, layout, keyboard, and reduced-motion coverage",
  },
  { label: "selected project smoke route", text: requiredProjectDetailRoute },
] as const;
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
| --- | --- | --- | --- |
| Project detail JSON-LD exception in release verification | Every route must include JSON-LD, including project detail routes | Phase 12 | Phase 13 should not reintroduce any project-detail structured-data exception. [VERIFIED: .planning/phases/12-project-metadata-sharing/12-01-SUMMARY.md] [VERIFIED: scripts/verify-release.ts] |
| Top-level-only release documentation | Release docs should name selected project detail routes and at least one `/projects/{slug}` smoke path | Phase 13 target | Planner should update docs and document-fact tests together. [VERIFIED: .planning/phases/13-project-page-release-coverage/13-CONTEXT.md] |
| Home-only keyboard/reduced-motion browser evidence | Representative selected project detail route coverage for keyboard and reduced motion | Phase 13 target | Browser release output can honestly support project detail release evidence labels after the Playwright changes. [VERIFIED: tests/browser-release.playwright.ts] [VERIFIED: .planning/phases/13-project-page-release-coverage/13-CONTEXT.md] |

**Deprecated/outdated for this phase:** runtime GitHub behavior, per-project raster OG image generation, hosted audits as required gates, and live external-link crawling are all out of scope. [VERIFIED: .planning/phases/13-project-page-release-coverage/13-CONTEXT.md]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
| --- | --- | --- | --- | --- |
| Bun | All repo scripts and aggregate gate | Yes | local `1.3.9`; project pin `1.3.14` | Keep project docs/pin at `1.3.14`; report local mismatch if verification differs. [VERIFIED: bash command `bun --version`] [VERIFIED: package.json] |
| Node | Tool compatibility for TS/Vite ecosystem | Yes | `v24.13.0` local; Cloudflare docs pin `22.16.0` | Use Bun scripts; do not change deploy docs unless implementation proves a mismatch. [VERIFIED: bash command `node --version`] [VERIFIED: docs/release-readiness.md] |
| Playwright CLI | `bun run verify:browser` | Yes | `1.60.0` | Use `bun run install:browser` if browser binaries are missing. [VERIFIED: bash command `bunx playwright --version`] [VERIFIED: package.json] |
| Playwright Chromium | Browser release checks | Provisionable | dry-run target `chromium-1223` and `chromium_headless_shell-1223` | Existing `bun run install:browser` provisions Chromium. [VERIFIED: bash command `bunx playwright install --dry-run chromium`] [VERIFIED: package.json] |
| npm registry access | Version research only | Yes | npm returned package metadata | Not needed for implementation because no dependency changes are planned. [VERIFIED: npm registry] |

**Missing dependencies with no fallback:** none found during research. [VERIFIED: bash command checks]

**Missing dependencies with fallback:** local Bun is below the project pin, but the clean-builder docs already pin `BUN_VERSION=1.3.14`. [VERIFIED: bash command `bun --version`] [VERIFIED: docs/release-readiness.md]

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
| --- | --- | --- |
| V2 Authentication | No | No auth surfaces are touched by Phase 13. [VERIFIED: .planning/phases/13-project-page-release-coverage/13-CONTEXT.md] |
| V3 Session Management | No | No session surfaces are touched by Phase 13. [VERIFIED: .planning/phases/13-project-page-release-coverage/13-CONTEXT.md] |
| V4 Access Control | No | The site is static output and Phase 13 changes release verification/docs only. [VERIFIED: docs/release-readiness.md] |
| V5 Input Validation | Yes | External link policy rejects non-HTTPS links, uncovered origins, and sensitive query keys in generated output. [VERIFIED: scripts/release-readiness.ts] |
| V6 Cryptography | No | No cryptographic code is touched by Phase 13. [VERIFIED: .planning/phases/13-project-page-release-coverage/13-CONTEXT.md] |

### Known Threat Patterns

| Pattern | STRIDE | Standard Mitigation |
| --- | --- | --- |
| Token-like output in static assets | Information Disclosure | `verify-release` scans built text output for GitHub API endpoints, token env names, and token-like values with redacted failure messages. [VERIFIED: scripts/verify-release.ts] [VERIFIED: scripts/verify-release.test.ts] |
| Sensitive external-link query keys | Information Disclosure | `externalLinkFindingsForRoutes()` rejects sensitive query keys and redacts target values. [VERIFIED: scripts/release-readiness.ts] [VERIFIED: scripts/release-readiness.test.ts] |
| Runtime GitHub/API dependency leakage | Information Disclosure / Reliability | `verify:static`, `verify:release`, and `verify:no-github-runtime` are part of the aggregate `bun run verify` gate. [VERIFIED: scripts/verify-static.ts] [VERIFIED: scripts/verify-release.ts] [VERIFIED: package.json] |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
| --- | --- | --- | --- |
| None | All research claims were verified from local files, npm registry metadata, shell probes, or cited Bright Builds standards at the pinned commit. | All | No user confirmation needed before planning. [VERIFIED: local research commands] |

## Open Questions (RESOLVED)

1. **RESOLVED:** Final execution must run the repo-native aggregate gate `bun run verify`; `bun run install:browser && bun run verify` remains the documented clean-builder sequence and should be used when Chromium provisioning is being validated explicitly. Phase 13 requires final `bun run verify`, and docs require `bun run install:browser && bun run verify` for clean builders. [VERIFIED: .planning/phases/13-project-page-release-coverage/13-CONTEXT.md] [VERIFIED: package.json] [VERIFIED: docs/release-readiness.md]
2. **RESOLVED:** Release checks must derive the representative selected project detail route from `projectDetailRoutes()` while the release-readiness docs name the current representative smoke route `/projects/openlinks`. `projectDetailRoutes()[0]` currently resolves to `/projects/openlinks`. [VERIFIED: src/domain/projects.ts] [VERIFIED: .planning/phases/13-project-page-release-coverage/13-CONTEXT.md]

## Sources

### Primary (HIGH confidence)

- `.planning/phases/13-project-page-release-coverage/13-CONTEXT.md` - locked Phase 13 decisions, boundaries, discretion, and deferrals. [VERIFIED: file read]
- `.planning/ROADMAP.md` - Phase 13 goal, dependency, requirements, and success criteria. [VERIFIED: file read]
- `.planning/REQUIREMENTS.md` - VERIFY-02, VERIFY-03, and VERIFY-04 definitions. [VERIFIED: file read]
- `.planning/STATE.md` - current phase state and milestone history. [VERIFIED: file read]
- `.planning/phases/12-project-metadata-sharing/12-CONTEXT.md`, `12-01-SUMMARY.md`, and `12-VERIFICATION.md` - dependency decisions, implementation summary, and verification evidence. [VERIFIED: file read]
- `AGENTS.md`, `AGENTS.bright-builds.md`, `standards-overrides.md`, and `bright-builds-rules.audit.md` - repo-local and managed Bright Builds rules. [VERIFIED: file read]
- `src/domain/projects.ts`, `src/domain/routes.ts`, `src/domain/project-detail-routes.test.ts`, `src/routes/projects/[slug].tsx` - selected route and project detail route implementation. [VERIFIED: file read]
- `tests/browser-release.playwright.ts`, `playwright.config.ts` - browser release suite and project matrix. [VERIFIED: file read]
- `scripts/verify-static.ts`, `scripts/verify-release.ts`, `scripts/release-readiness.ts`, `scripts/release-readiness.test.ts`, `scripts/verify-release.test.ts` - static/release/readiness verifier contracts. [VERIFIED: file read]
- `docs/release-readiness.md`, `package.json` - clean-builder guidance and repo scripts. [VERIFIED: file read]
- Bright Builds canonical standards at commit `05f8d7a6c9c2e157ec4f922a05273e72dab97676`: standards index, architecture, code shape, verification, testing, operability, and TypeScript/JavaScript pages. [CITED: https://raw.githubusercontent.com/bright-builds-llc/bright-builds-rules/05f8d7a6c9c2e157ec4f922a05273e72dab97676/standards/index.md]
- npm registry metadata for `@playwright/test`, `@axe-core/playwright`, `vitest`, `@biomejs/biome`, and `typescript`. [VERIFIED: npm registry]

### Secondary (MEDIUM confidence)

- Shell probes for local environment versions and Playwright dry-run install targets. [VERIFIED: bash commands]

### Tertiary (LOW confidence)

- None. [VERIFIED: research source log]

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH for existing package pins and registry metadata; MEDIUM for local clean-builder parity because local Bun differs from the project pin. [VERIFIED: package.json] [VERIFIED: npm registry] [VERIFIED: bash command `bun --version`]
- Architecture: HIGH because the target helper patterns are already present in local scripts/tests. [VERIFIED: tests/browser-release.playwright.ts] [VERIFIED: scripts/release-readiness.ts]
- Pitfalls: HIGH because they follow directly from locked Phase 13 decisions and current file gaps. [VERIFIED: .planning/phases/13-project-page-release-coverage/13-CONTEXT.md] [VERIFIED: rg audit]

**Research date:** 2026-06-03 [VERIFIED: bash command `date -u`]  
**Valid until:** 2026-06-10 for environment/package currency; local file findings remain valid until Phase 13 implementation changes the referenced files. [VERIFIED: npm registry] [VERIFIED: git status]
