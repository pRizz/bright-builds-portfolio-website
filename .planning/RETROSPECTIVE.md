# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1.0 — MVP

**Shipped:** 2026-05-27  
**Phases:** 6 | **Plans:** 14 | **Recorded Tasks:** 40

### What Was Built

- SolidStart static portfolio foundation with Bun scripts, Tailwind 3, pinned Mystic UI, pure domain helpers, and prerender verification.
- Dark-primary route shell and visual system with local brand material, stable responsive layouts, focus styling, and reduced-motion/coarse-pointer fallbacks.
- Authoritative curated project/profile registry that keeps GitHub advisory and blocks visitor-runtime GitHub calls.
- Identity, project, about, contact, OpenLinks, SEO, JSON-LD, sitemap, robots, icon, and social-preview surfaces rendered before hydration.
- Optional static GitHub metadata snapshot enrichment with native sync, safe homepage-link handling, and pre-hydration static verification.
- Dependency-free release verifier and docs covering setup, deploy assumptions, curation maintenance, metadata refresh, token safety, and recorded browser evidence.

### What Worked

- Pure domain modules made route rendering, SEO, curation, metadata enrichment, and release verification easy to test without a browser.
- GSD phase artifacts gave enough context to catch planning drift and verify each phase against roadmap requirements before archiving.
- The aggregate `bun run verify` became a useful release gate by composing static, visual, curation, no-runtime-GitHub, and release checks.
- Code review before Phase 5 completion caught two real security issues: token-value logging in release findings and unsafe metadata-derived homepage links.

### What Was Inefficient

- Browser evidence was gathered through one-off local Chrome CDP scripts rather than a checked-in browser test runner.
- Some early verification artifacts used older frontmatter-only requirement references, which required audit normalization alongside newer requirements tables.
- ROADMAP and STATE milestone completion needed manual cleanup after CLI updates missed some current document shapes.

### Patterns Established

- Keep authored portfolio content authoritative; GitHub metadata is advisory, static, and direct-repo-only.
- Place OpenLinks as a low-intrusion identity signal in footer/about/contact and metadata rather than a primary brand surface.
- Keep decorative motion UI-only, capability-gated, cleanup-verified, and disabled for reduced motion, coarse pointer, small viewport, hidden tab, or save-data conditions.
- Verify static output from generated `.output/public`, not only source files or build logs.
- Redact secret-like matches in verification output so scanners do not become leak paths.

### Key Lessons

1. Release checks that scan for secrets must report labels and file paths without echoing matched secret values.
2. Metadata from third-party APIs must be protocol-allowlisted before becoming rendered links, even when stored in a checked-in snapshot.
3. Milestone audits need to support old and new verification artifact shapes during a project’s first GSD cycle.
4. Recorded browser evidence is useful, but repeatable checked-in browser automation should be considered once release gates become recurring.

### Cost Observations

- Model mix: GSD subagents handled research, planning, execution, review, and verification; main-thread work focused on orchestration, fixes, and final archival.
- Sessions: One milestone cycle with several autonomous phase runs.
- Notable: The strict push wrapper kept code, docs, verification, and planning artifacts synchronized before archiving.

---

## Milestone: v1.1 — Release Confidence

**Shipped:** 2026-06-01

**Phases:** 4 | **Plans:** 4 | **Recorded Tasks:** 13

### What Was Built

- Repeatable Playwright and axe browser release checks for dark desktop/mobile rendering, keyboard reachability, reduced motion, and route accessibility.
- Release-readiness documentation and verification covering static metadata, browser/a11y, performance budgets, external-link policy, Cloudflare Pages assumptions, and preview/deploy smoke expectations.
- Curated project helper-surface cleanup that removed seed-era helper aliases, documented the supported selector API, and added an AST import guard to the aggregate release gate.
- Clean-builder browser provisioning through explicit `bun run install:browser` guidance and verifier coverage for the release contract.

### What Worked

- The milestone audit caught a real release-readiness gap before archival, and Phase 9 closed it with documentation, script, and verifier changes.
- Keeping v1.1 scoped to release confidence avoided product expansion while improving the repeatability of the shipped v1.0 site.
- The aggregate `bun run verify` gate now represents the real release path more honestly by including the helper-surface guard, static release checks, build, and browser automation.
- A focused integration audit after drift cleanup confirmed 15/15 requirements and 8/8 user flows before completion.

### What Was Inefficient

- Summary frontmatter still referenced reassigned requirements after Phase 9 took ownership, which caused non-blocking audit drift.
- The milestone completion tool updated structured `STATE.md` fields but missed some prose sections, so final state cleanup was manual.
- Clean-builder browser provisioning was implicit until the audit forced it into the release contract.

### Patterns Established

- Requirement reassignment should update phase summary frontmatter at the same time as the roadmap and audit.
- Browser release automation should name its environment prerequisites explicitly instead of hiding them in broad verification commands.
- Release-readiness docs should be guarded by tests or focused verifiers when they encode deploy-critical facts.
- Keep phase directories available after archival when they still provide useful release evidence and traceability.

### Key Lessons

1. Clean-builder browser provisioning is a release requirement, not just local developer setup.
2. Milestone audits should cross-check summary frontmatter ownership after gap-closure phases.
3. Aggregate release docs need to list material sub-gates so future cleanup cannot silently remove them.

### Cost Observations

- Model mix: GSD agents handled audit and integration validation; main-thread work handled metadata cleanup, archival, and publication.
- Sessions: One v1.1 gap-closure cycle after the v1.0 retrospective.
- Notable: Keeping archival separate from active requirement deletion made the milestone completion safer to review and commit.

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Sessions | Phases | Key Change |
|-----------|----------|--------|------------|
| v1.0 | 1 cycle | 6 | Established GSD phase flow, strict release verification, and milestone archival. |
| v1.1 | 1 cycle | 4 | Converted release confidence debt into repeatable browser/deploy/helper-surface gates. |

### Cumulative Quality

| Milestone | Tests | Coverage | Zero-Dep Additions |
|-----------|-------|----------|-------------------|
| v1.0 | 63 Vitest tests | Requirements 38/38 | Static, curation, no-runtime-GitHub, visual-system, and release verification scripts. |
| v1.1 | 77 Vitest tests + 23 Playwright checks passing | Requirements 15/15 | Browser/a11y release tests, project helper-surface import guard, and clean-builder release-readiness checks. |

### Top Lessons (Verified Across Milestones)

1. Static portfolios still need release gates for metadata, accessibility hooks, links, assets, browser provisioning, and token safety.
2. Curated content and generated metadata should remain separate so automation cannot override editorial judgment.
3. Requirement ownership metadata is part of milestone truth and needs the same cleanup attention as roadmap prose.
