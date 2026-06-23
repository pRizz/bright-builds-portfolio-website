# Milestones

## v1.5 Static Shareability & Freshness (Shipped: 2026-06-23)

**Phases completed:** 6 phases, 12 plans, 26 tasks
**Audit:** passed — 25/25 requirements satisfied, 0 blockers
**Archives:** `milestones/v1.5-ROADMAP.md`, `milestones/v1.5-REQUIREMENTS.md`, `milestones/v1.5-MILESTONE-AUDIT.md`, `milestones/v1.5-phases/`

**Stats:**

- 125 files changed
- 17,091 insertions and 1,295 deletions from `v1.4..65c7942`
- Git range: `eacc1ca` (`docs: start milestone v1.5 Static Shareability & Freshness`) -> `65c7942` (`docs(v1.5): update milestone audit`)
- Timeline: 2026-06-21 to 2026-06-23

**Key accomplishments:**

- Route-derived social preview contract with fallback data, 12-character SHA-256 fingerprints, and structured validation findings
- Deterministic local social preview renderer core with checked-in font inputs, stable manifest helpers, and pure freshness checks
- Bun social preview generator CLI with read-only freshness checks and aggregate verify wiring
- Checked-in deterministic social preview PNGs and manifest with full repo verification passing
- Route-aware SEO image metadata with generated social previews, fallback preservation, and JSON-LD parity
- Helper-derived social image MIME tags with route-aware static asset and JSON-LD parity verification
- Read-only freshness report for generated media, GitHub snapshot review, static output policy, and manual smoke prompts
- Release-readiness freshness guidance with tested reviewed-static and live/manual smoke boundaries
- Static verification now proves helper-covered social preview metadata agrees with copied generated manifest entries.
- Release verification now measures generated social preview PNG budgets from static output and reports truthful local evidence labels.
- Release-readiness docs and tests now guard static social preview generation, deterministic local verification, manual social-card boundaries, and aggregate verify ordering.
- Archived project records are now rejected by the shared public project selector before they can become detail routes or social preview targets.

---

## v1.4 Theme Paths & Collaboration Surface (Shipped: 2026-06-20)

**Phases completed:** 5 phases, 12 plans, 24 tasks
**Audit:** passed — 23/23 requirements satisfied, 0 blockers
**Archives:** `milestones/v1.4-ROADMAP.md`, `milestones/v1.4-REQUIREMENTS.md`, `milestones/v1.4-MILESTONE-AUDIT.md`, `milestones/v1.4-phases/`

**Key accomplishments:**

- Typed theme registry and curation validation for public theme paths backed by selected projects and public writing
- Helper-derived theme prerender routes with a separate Phase 20 sitemap route boundary
- Dark-primary public theme index and gated theme detail routes over the Phase 19 theme helpers
- Theme route render coverage plus helper-derived static verification for public theme HTML and unknown-route absence
- Helper-derived Playwright coverage for theme keyboard focus and reduced-motion route checks
- Pure theme relationship and collaboration action helpers for downstream route surfaces
- Helper-derived theme collaboration panel with SSR coverage and browser-check-compatible metadata loading
- Helper-derived related theme links on project and writing detail routes with SSR coverage
- Static and browser verification for helper-derived collaboration panels and reciprocal theme links
- Theme routes now expose static crawler metadata, structured data, sitemap entries, and social-preview fallback verification.
- Theme route coverage is now enforced in release-readiness checks, automated evidence labels, docs, and the aggregate verify gate.
- Static verification now prints and tests explicit theme route coverage evidence while preserving helper-derived generated-output checks.

---

## v1.3 Writing & Notes Surface (Shipped: 2026-06-16)

**Phases completed:** 5 phases, 10 plans, 18 tasks
**Audit:** tech_debt — 23/23 requirements satisfied after Phase 18 closed the non-blocking static verifier maintenance item
**Archives:** `milestones/v1.3-ROADMAP.md`, `milestones/v1.3-REQUIREMENTS.md`, `milestones/v1.3-MILESTONE-AUDIT.md`, `milestones/v1.3-phases/`

**Key accomplishments:**

- Typed writing registry with published-only selectors, `/writing/{slug}` path helpers, and selected-project relationship resolution
- Structured writing curation validation with curation-gate integration
- Writing route registry contracts with public project cross-links and unsafe authored-link validation
- Static writing index and detail routes with direct typed body rendering and dark-primary readability CSS
- Selected project detail pages now show public related writing from the writing registry without adding reciprocal project fields
- Writing routes are now proven through static HTML assertions, unsafe href guards, and route-derived Playwright browser checks
- Pure writing metadata and structured-data helpers
- Generated writing metadata and static verifier coverage
- Writing route coverage now runs through the existing browser, static, release-readiness, and release evidence gates
- Static verifier split into import-safe concern modules while preserving generated-output release coverage

---

## v1.2 Project Story Pages (Shipped: 2026-06-03)

**Phases completed:** 4 phases, 4 plans, 9 tasks
**Audit:** passed — 19/19 requirements satisfied, 0 blockers
**Archives:** `milestones/v1.2-ROADMAP.md`, `milestones/v1.2-REQUIREMENTS.md`, `milestones/v1.2-MILESTONE-AUDIT.md`

**Key accomplishments:**

- Selected curated projects now have typed detail story data, deterministic `/projects/{slug}` paths, and prerendered static route foundations.
- Project detail pages now read as project stories, and selected cards route visitors into those pages while unselected records keep stable anchors.
- Selected project detail routes now ship route-specific sharing metadata, SoftwareSourceCode JSON-LD, sitemap entries, and release checks backed by static curated data.
- Project detail route coverage is now explicit across browser checks, release-readiness docs, release evidence labels, and the aggregate clean-builder gate.

______________________________________________________________________

## v1.1 Release Confidence (Shipped: 2026-06-01)

**Phases completed:** 4 phases, 4 plans, 13 tasks

**Key accomplishments:**

- Playwright and axe browser release checks now validate the built static portfolio across dark desktop/mobile layout, keyboard reachability, reduced motion, and route accessibility.
- The release gate now has a checked release-readiness contract covering static metadata, browser/a11y, performance budgets, external-link policy, Cloudflare Pages deployment assumptions, and preview/deploy smoke checks.
- Curated project data now has a documented selector API, no seed-era helper exports, and a checked AST import guard in the aggregate release gate.
- Clean-builder release guidance now provisions Playwright Chromium explicitly and the release-readiness verifier guards the documented gate contract.

______________________________________________________________________

## v1.0 MVP (Shipped: 2026-05-27)

**Phases completed:** 6 phases, 14 plans, 40 tasks
**Audit:** tech_debt — 38/38 requirements satisfied, 0 blockers, 3 non-blocking debt items
**Archives:** `milestones/v1.0-ROADMAP.md`, `milestones/v1.0-REQUIREMENTS.md`, `milestones/v1.0-MILESTONE-AUDIT.md`

**Key accomplishments:**

- SolidStart static shell with Bun scripts, Tailwind 3, pinned Mystic UI, and semantic base routes
- Framework-free route, profile, project, and SEO modules with Vitest coverage and static HTML verification
- Dark-primary repo guidance and polished dark-first route shell
- Typed curated project stories with pure flagship validation and selector-driven route rendering
- Bun verification gates for curated registry validity, no visitor-runtime GitHub mechanisms, and prerendered curated content
- Typed project story details plus pure SEO, JSON-LD, sitemap, robots, and social metadata helpers for Phase 3 route surfaces.
- Dark-first Solid route surfaces rendering curated project stories, grouped anchors, collaboration links, and shared SEO metadata.
- Static SEO assets, generated sitemap/robots files, and deterministic build-output verification for the Phase 3 portfolio surfaces
- Dark-primary Bright Builds visual primitives with local brand material, stable responsive surfaces, and preserved Phase 03 route semantics
- Pure reduced-motion capability gates plus a cleanup-safe Solid pointer surface for restrained project/card polish
- Dependency-free source/static visual guards plus browser evidence for dark responsive layout, reduced motion, focus access, and cleanup isolation
- Static GitHub metadata snapshot contract with pure direct-repo enrichment helpers and Vitest coverage
- Native GitHub REST snapshot refresh with compact static project-card enrichment and pre-hydration verification
- Dependency-free static release gate with token-safety checks, safe release docs, and browser evidence for final ship readiness

**Carried-forward debt:**

- Convert recorded browser/accessibility evidence into checked-in repeatable automation if the next milestone needs stronger release gates.
- Decide whether live external-link reachability should be automated.
- Clean up or document seed-era helper exports that are not part of runtime wiring.

______________________________________________________________________
