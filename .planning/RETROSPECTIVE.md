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

## Cross-Milestone Trends

### Process Evolution

| Milestone | Sessions | Phases | Key Change |
|-----------|----------|--------|------------|
| v1.0 | 1 cycle | 6 | Established GSD phase flow, strict release verification, and milestone archival. |

### Cumulative Quality

| Milestone | Tests | Coverage | Zero-Dep Additions |
|-----------|-------|----------|-------------------|
| v1.0 | 63 Vitest tests | Requirements 38/38 | Static, curation, no-runtime-GitHub, visual-system, and release verification scripts. |

### Top Lessons (Verified Across Milestones)

1. Static portfolios still need release gates for metadata, accessibility hooks, links, assets, and token safety.
2. Curated content and generated metadata should remain separate so automation cannot override editorial judgment.
