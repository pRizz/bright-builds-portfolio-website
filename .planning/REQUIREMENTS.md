# Requirements: Bright Builds Portfolio Website

**Defined:** 2026-05-24\
**Core Value:** Help visitors quickly understand what Peter builds, why it matters, and which projects are worth exploring or collaborating on.

## v1 Requirements

Requirements for the first public portfolio release. Each maps to roadmap phases.

### Foundation

- [x] **FOUND-01**: Developer can run, build, typecheck, format-check, lint/check, and test the site through documented Bun package scripts.
- [x] **FOUND-02**: The app builds as a SolidJS / SolidStart static-first website with prerendered HTML for all indexable routes.
- [x] **FOUND-03**: The app uses Tailwind CSS 3.x and pins Mystic UI to exact GitHub commit `d36017757708ed01ef2b3b47beb14f294726411c` when Mystic UI is adopted.
- [x] **FOUND-04**: The app exposes route, project, profile, and SEO derivation through pure TypeScript modules that can be unit tested without DOM, network, or framework runtime.

### Visual Baseline

- [x] **DARK-01**: The site is dark-primary by repo rule and default rendering, with `.dark` active on the root document, dark-first reusable styling for the current shell, and desktop/mobile readability verification.

### Profile and Narrative

- [x] **PROF-01**: Visitor can immediately identify Peter Ryszkiewicz / pRizz, the Bright Builds context, and the portfolio's focus on AI, Bitcoin, open systems, developer tooling, and practical experiments.
- [x] **PROF-02**: Visitor can read an about/themes section that connects Peter's work across agentic engineering, open source, Bitcoin/decentralized systems, web tooling, and creative experiments.
- [x] **PROF-03**: Visitor can find current collaboration/contact paths, including GitHub and a low-intrusion OpenLinks identity hub placement.
- [x] **PROF-04**: Visitor does not see unfinished template residue, fake case studies, generic skill bars, or inaccurate placeholder experience/content from the current Bright Builds site.

### Project Curation

- [x] **CUR-01**: Developer can define curated projects in a typed local registry with explicit curation tier, source type, maturity, inclusion flags, display order, themes, tags, role, links, and authored one-line copy.
- [x] **CUR-02**: The registry prevents or flags invalid flagship states, including home-page projects without authored copy, curation reason, original-work status, useful links, or maturity/status information.
- [x] **CUR-03**: Forks, repros, playgrounds, generated/profile/support repos, and unreviewed prototypes are excluded from flagship/home placement by default unless explicitly promoted with a documented reason.
- [x] **CUR-04**: Visitor can distinguish flagship, supporting, experiment/lab, writing, archived, and excluded/project-hidden work through clear data-driven labels or placement.
- [x] **CUR-05**: Developer can maintain an initial curated set that reviews OpenLinks, Free The World, Win3Bitco.in / Open Bitcoin Web Miner, Open Bitcoin, opencode-cloud, Zeckendorf, Mystic UI, and selected supporting experiments without surfacing all public GitHub repos.

### Portfolio Experience

- [x] **EXP-01**: Visitor can browse 4-6 flagship project presentations with manually written problem, approach, role, status, key links, and why-it-matters copy.
- [x] **EXP-02**: Visitor can browse a project index or equivalent project surface that separates flagship/supporting work from lab/prototype/archive items.
- [x] **EXP-03**: Visitor can open project detail surfaces or stable project anchors with meaningful URLs, headings, metadata, links, and related project/writing context.
- [x] **EXP-04**: Visitor can discover a concise "now building" or current-focus surface for active bets such as OpenLinks, Free The World, Win3Bitco.in / Open Bitcoin Web Miner, Open Bitcoin, and opencode-cloud when content is ready.
- [ ] **EXP-05**: Visitor can navigate the site on desktop and mobile without text overlap, layout jumps, or hover-only access to important content.

### Visual System and Motion

- [ ] **MOTION-01**: Visitor sees a polished visual design that takes gentle inspiration from `https://www.brightbuilds.us/` without copying its unfinished template content.
- [ ] **MOTION-02**: Visitor can experience restrained reactive/physics effects around non-essential visual elements or project interactions on capable devices.
- [ ] **MOTION-03**: Visitor with `prefers-reduced-motion: reduce`, keyboard navigation, coarse pointer, small viewport, hidden tab, or low-power conditions can still use the full site without non-essential motion.
- [ ] **MOTION-04**: Developer can verify motion cleanup so animation loops, listeners, and observers stop when routes/effects unmount or become inactive.
- [ ] **MOTION-05**: The visual layer uses local adapters around Mystic UI or motion utilities so the domain model and core content do not depend on UI-library internals.

### SEO and Metadata

- [x] **SEO-01**: Each indexable route has static, route-specific title, description, canonical URL, Open Graph basics, and Twitter card basics.
- [x] **SEO-02**: The site emits or maintains `sitemap.xml`, `robots.txt`, favicon/touch/icon assets, and at least one useful social preview image.
- [x] **SEO-03**: The site includes structured data for Peter as a `Person` and for flagship project detail surfaces where enough data exists.
- [x] **SEO-04**: Production build verification proves meaningful content and metadata exist in generated HTML before client hydration.
- [x] **SEO-05**: OpenLinks appears as a visible identity link and, when cleanly supported, as `rel="me"` and/or JSON-LD `sameAs` metadata without becoming the primary portfolio brand.

### GitHub Data

- [x] **GH-01**: The site does not require live browser/runtime GitHub API calls to render complete portfolio content.
- [ ] **GH-02**: Developer can optionally refresh GitHub metadata for curated repos at build/manual-sync time, with pagination, token-safe environment handling, and static snapshot fallback.
- [ ] **GH-03**: GitHub metadata such as stars, forks, language, topics, pushed date, archived/fork/template flags, and homepage URLs enriches curated records without overriding manual copy or curation decisions.
- [ ] **GH-04**: Build/release verification checks that frontend bundles do not expose GitHub tokens or `VITE_*` token names.

### Verification and Release

- [ ] **VER-01**: Unit tests cover pure curation, route derivation, metadata derivation, project ordering, and invalid-state prevention.
- [ ] **VER-02**: Browser checks cover home, project index/detail or anchors, about/contact/footer, mobile and desktop viewports, keyboard navigation, and reduced-motion behavior.
- [ ] **VER-03**: Accessibility checks catch obvious issues in semantic structure, color contrast, focus states, links, images, and interactive motion surfaces.
- [ ] **VER-04**: Performance/SEO release checks verify static output, no critical runtime GitHub dependency, acceptable Lighthouse-style scores, no layout instability, and no broken primary links.
- [ ] **VER-05**: Project docs record local setup, build/deploy assumptions, curation maintenance rules, and how to refresh GitHub metadata if the optional sync exists.

## v2 Requirements

Deferred to future releases. Tracked but not in the current roadmap.

### Content and Publishing

- **PUB-01**: Developer can add a lightweight writing/blog system with standalone posts.
- **PUB-02**: Developer can generate per-project Open Graph images from project data.
- **PUB-03**: Developer can publish a `/uses` or tooling-opinions page from curated writing.
- **PUB-04**: Developer can use a CMS/admin UI for project copy when static data files become painful.

### Discovery and Automation

- **DISC-01**: Visitor can search or deeply filter a larger project archive.
- **DISC-02**: Developer can run scheduled GitHub metadata refresh in CI with reviewed diffs.
- **DISC-03**: Developer can run automated broken-link and media freshness reports on a schedule.
- **DISC-04**: Developer can expose richer project lineage graphs or constellation interactions after the flagship taxonomy is trusted.

### Visual Expansion

- **VIS-01**: Visitor can opt into more advanced 3D or WebGPU experiments if they prove useful and accessible.
- **VIS-02**: Developer can add theme variants or seasonal visual treatments without changing content structure.

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Raw public GitHub mirror | Many public repos are forks, prototypes, repros, playgrounds, generated/profile repos, or support artifacts. |
| Runtime GitHub API dependency for core content | Static portfolio content must be fast, reliable, and complete without GitHub availability or browser tokens. |
| Copying current Bright Builds content verbatim | The existing site contains unfinished template content and non-authoritative placeholders. |
| Full CMS/admin UI | One maintainer can use typed data files for v1; CMS work would delay the core portfolio. |
| Heavy motion-first or 3D-first experience | Motion is a differentiator, not the product; content, accessibility, and speed are higher priority. |
| Backend services, authentication, dashboards, or analytics pipelines | The first release is a static public portfolio. |
| Unreviewed forks/prototypes as flagship work | They can be valuable but need explicit context before public promotion. |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 | Complete |
| FOUND-02 | Phase 1 | Complete |
| FOUND-03 | Phase 1 | Complete |
| FOUND-04 | Phase 1 | Complete |
| DARK-01 | Phase 01.1 | Complete |
| PROF-01 | Phase 3 | Complete |
| PROF-02 | Phase 3 | Complete |
| PROF-03 | Phase 3 | Complete |
| PROF-04 | Phase 3 | Complete |
| CUR-01 | Phase 2 | Complete |
| CUR-02 | Phase 2 | Complete |
| CUR-03 | Phase 2 | Complete |
| CUR-04 | Phase 3 | Complete |
| CUR-05 | Phase 2 | Complete |
| EXP-01 | Phase 3 | Complete |
| EXP-02 | Phase 3 | Complete |
| EXP-03 | Phase 3 | Complete |
| EXP-04 | Phase 3 | Complete |
| EXP-05 | Phase 4 | Pending |
| MOTION-01 | Phase 4 | Pending |
| MOTION-02 | Phase 4 | Pending |
| MOTION-03 | Phase 4 | Pending |
| MOTION-04 | Phase 4 | Pending |
| MOTION-05 | Phase 4 | Pending |
| SEO-01 | Phase 3 | Complete |
| SEO-02 | Phase 3 | Complete |
| SEO-03 | Phase 3 | Complete |
| SEO-04 | Phase 3 | Complete |
| SEO-05 | Phase 3 | Complete |
| GH-01 | Phase 2 | Complete |
| GH-02 | Phase 5 | Pending |
| GH-03 | Phase 5 | Pending |
| GH-04 | Phase 5 | Pending |
| VER-01 | Phase 5 | Pending |
| VER-02 | Phase 5 | Pending |
| VER-03 | Phase 5 | Pending |
| VER-04 | Phase 5 | Pending |
| VER-05 | Phase 5 | Pending |

**Coverage:**

- v1 requirements: 38 total
- Mapped to phases: 38
- Unmapped: 0
- Duplicate mappings: 0

______________________________________________________________________

*Requirements defined: 2026-05-24*\
*Last updated: 2026-05-25 after Phase 01.1 completion*
