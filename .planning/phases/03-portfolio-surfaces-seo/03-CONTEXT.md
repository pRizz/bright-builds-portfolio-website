---
generated_by: gsd-discuss-phase
lifecycle_mode: yolo
phase_lifecycle_id: 3-2026-05-26T10-37-25
generated_at: 2026-05-26T10:37:25.810Z
---

# Phase 3: Portfolio Surfaces & SEO - Context

**Gathered:** 2026-05-26
**Status:** Ready for planning
**Mode:** Yolo

<domain>

## Phase Boundary

Phase 3 turns the Phase 2 curated registry into visitor-facing portfolio and metadata
surfaces. Visitors should immediately understand Peter Ryszkiewicz / pRizz, Bright Builds,
the AI/Bitcoin/open-systems/developer-tooling focus, the flagship project stories, and the
collaboration/contact path. Static HTML should contain meaningful page metadata, structured
data, sitemap/robots support, icon/social preview assets, and no template residue before
hydration.

This phase does not add the polished Bright Builds motion system, advanced visual effects,
optional GitHub metadata refresh, release-wide browser/a11y/performance suite, search, CMS,
analytics, or backend services. Those remain in later phases.

</domain>

<decisions>

## Implementation Decisions

### Identity and Narrative Surfaces

- **D-01:** Make the home page identity-first: Peter Ryszkiewicz / pRizz, Bright Builds, and
  the focus on AI, Bitcoin, open systems, developer tooling, and practical experiments should be
  visible in the first content block.
- **D-02:** Use authored profile data as the source for headline, summary, focus areas, and
  collaboration links. Do not introduce generic skill bars, fake experience entries, or copied
  Bright Builds template copy.
- **D-03:** The about surface should explain the connective themes across agentic engineering,
  open source, Bitcoin/decentralized systems, web tooling, and creative experiments with concise
  editorial copy rather than a resume-style page.
- **D-04:** Keep the current dark-primary rule. New UI should use shared dark-first classes and
  avoid light-first utility exceptions unless a specific element requires them.

### Project Story Presentation

- **D-05:** Use the Phase 2 curated registry as the authoritative source for project surfaces.
  Home should feature 4-6 flagship stories; `/projects` should separate flagship, supporting,
  lab/prototype, archive, and hidden/excluded work through placement and labels.
- **D-06:** Each flagship presentation should show problem, approach, role, status/maturity,
  why-it-matters copy, themes/tags, and useful links when the registry has enough data.
- **D-07:** Use stable project anchors on `/projects` in Phase 3 instead of creating separate
  per-project routes. The anchor URL format should be `/projects#${project.slug}` and each
  anchor target needs a meaningful heading and metadata text. Separate project routes can be
  reconsidered after richer detail copy or per-project OG images are ready.
- **D-08:** Include a concise current-focus surface for active bets such as OpenLinks, Free The
  World, Win3Bitco.in / Open Bitcoin Web Miner, Open Bitcoin, and opencode-cloud when content is
  available from the registry. Keep it editorial and useful, not a raw repo mirror.

### Collaboration and OpenLinks Identity

- **D-09:** Make contact/collaboration paths easy to find through the contact route and footer,
  prioritizing GitHub and OpenLinks while keeping Bright Builds as the host brand.
- **D-10:** Follow the OpenLinks identity-presence guidance in subtle/standard mode: visible
  footer/about/contact placement first, `rel="me noopener noreferrer"` on self-owned identity
  links, and JSON-LD `Person.sameAs` where the site already emits structured data.
- **D-11:** Do not make OpenLinks the primary site CTA or repeat it aggressively in nearby
  surfaces. It should read as Peter's identity hub and a featured project, not as the whole
  portfolio brand.

### Static SEO and Metadata

- **D-12:** Keep metadata derivation in pure TypeScript modules. Route titles, descriptions,
  canonical URLs, Open Graph basics, Twitter card basics, JSON-LD, sitemap entries, and robots
  output should derive from route/profile/project data rather than duplicated literals in every
  route component.
- **D-13:** Emit JSON-LD for Peter as a `Person`, and add project structured data or an
  `ItemList` for curated project surfaces where enough data exists.
- **D-14:** Add `sitemap.xml`, `robots.txt`, favicon/touch/icon assets, and one useful static
  social preview asset for the current site. Keep Phase 3 to one strong preview asset; per-project
  OG generation belongs to a later phase.
- **D-15:** Extend static verification so generated HTML proves route-specific metadata and
  meaningful identity/project content exist before hydration.

### the agent's Discretion

- Exact route component boundaries, local component names, CSS class names, and helper names are
  up to the agent as long as pure domain modules stay framework-free.
- The agent may decide whether the flagship and current-focus presentations are separate
  components or route-local sections.
- The agent may choose the exact social preview asset implementation, provided it is checked in,
  referenced by metadata, and works in static output.
- The agent may add focused unit tests and static verification checks where they give the best
  regression protection for Phase 3.

</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Planning

- `.planning/PROJECT.md` - project vision, constraints, key decisions, and evolution rules.
- `.planning/REQUIREMENTS.md` - Phase 3 requirements `PROF-01`, `PROF-02`, `PROF-03`,
  `PROF-04`, `CUR-04`, `EXP-01`, `EXP-02`, `EXP-03`, `EXP-04`, `SEO-01`, `SEO-02`, `SEO-03`,
  `SEO-04`, and `SEO-05`.
- `.planning/ROADMAP.md` - Phase 3 goal and success criteria.
- `.planning/STATE.md` - current project state and prior decisions.

### Prior Phase Context

- `.planning/phases/01-static-app-foundation-ui-shell/01-CONTEXT.md` - SolidStart, Bun, Tailwind,
  Mystic, and pure-core decisions.
- `.planning/phases/01.1-dark-primary-visual-rule-and-shell-refactor/01.1-CONTEXT.md` -
  dark-primary shell and visual-rule decisions.
- `.planning/phases/02-curated-content-model/02-CONTEXT.md` - curated registry, validation,
  static GitHub boundary, and OpenLinks decisions.

### Existing Source

- `src/domain/projects.ts` - curated project registry, placement/tier taxonomy, source links,
  selectors, and project ordering.
- `src/domain/profile.ts` - Peter profile, focus areas, links, and OpenLinks `rel="me"` behavior.
- `src/domain/routes.ts` - route registry and prerender route list.
- `src/domain/seo.ts` - pure route metadata and `Person` JSON-LD derivation.
- `src/components/SiteLayout.tsx` - nav, footer, OpenLinks footer placement, and layout shell.
- `src/routes/index.tsx` - current home route and metadata pattern.
- `src/routes/about.tsx` - current about route.
- `src/routes/projects.tsx` - current project index route.
- `src/routes/contact.tsx` - current contact route.
- `src/styles/app.css` - shared dark-first component classes.
- `scripts/verify-static.ts` - generated static HTML verification to extend.

### Instructions and Standards

- `AGENTS.md` - repo-local dark-primary guidance, Bright Builds rules, GSD workflow enforcement,
  and generated project stack notes.
- `AGENTS.bright-builds.md` - Bright Builds workflow defaults and owner-specific OpenLinks
  guidance.
- `standards-overrides.md` - repo-specific exceptions file.
- Bright Builds canonical standards at commit `05f8d7a6c9c2e157ec4f922a05273e72dab97676`:
  `standards/core/architecture.md`, `standards/core/code-shape.md`,
  `standards/core/verification.md`, `standards/core/testing.md`, and
  `standards/languages/typescript-javascript.md`.
- `/Users/peterryszkiewicz/.codex/skills/openlinks-identity-presence/SKILL.md` - OpenLinks
  footer/about/contact/metadata placement rules.

</canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- `src/domain/projects.ts`: authoritative registry already carries names, slugs, placement,
  tier, maturity, status, themes, tags, role, one-line copy, curation reasons, original-work
  state, and useful links. Phase 3 can add richer display fields only when necessary.
- `src/domain/profile.ts`: already has name, handle, company, canonical origin, summary, focus
  areas, GitHub/OpenLinks/Bright Builds links, and sameAs helpers.
- `src/domain/seo.ts`: already centralizes route metadata and `Person` JSON-LD; extend this
  instead of duplicating head logic.
- `src/domain/routes.ts`: already centralizes route metadata and prerender routes; sitemap and
  metadata checks should derive from it.
- `scripts/verify-static.ts`: already checks route HTML and curated project content after build;
  extend it for metadata, sitemap/robots, and social preview assertions.

### Established Patterns

- Pure domain modules live in `src/domain/` and should not depend on DOM, network, Solid runtime,
  or UI-library internals.
- Route components import metadata helpers and emit `<Title>`, `<Meta>`, canonical link, and
  structured data directly.
- Shared CSS component classes live in `src/styles/app.css`; the repo is dark-primary by default.
- Bun scripts are the repo-native verification surface, with `bun run verify` as the aggregate
  gate.

### Integration Points

- Home route should continue to render from `homeProjects()` or an equivalent selector.
- Project index should group `visibleProjects()` or placement-specific selectors into readable
  sections with stable anchors.
- Contact/about/footer should reuse `peterProfile.links` and preserve OpenLinks as visible
  identity metadata.
- Static assets should live in the framework-supported public/static asset path and be referenced
  by metadata helpers.

</code_context>

<specifics>

## Specific Ideas

- The site should read as a polished portfolio for an agentic engineer, not as a generic
  "designer portfolio" template.
- OpenLinks has two roles: it is a flagship project story and Peter's low-intrusion identity hub.
  Those roles should be discoverable but not repetitive.
- Use anchors for project story deep links in Phase 3 so the implementation can deliver useful
  static URLs without taking on a route explosion before richer per-project content exists.
- Keep visual polish restrained in this phase. Improve hierarchy and semantics, but leave
  reactive/physics-heavy polish to Phase 4.

</specifics>

<deferred>

## Deferred Ideas

- Separate per-project routes and per-project Open Graph images.
- Search/filtering across a larger project archive.
- Optional GitHub metadata refresh, static snapshots, and token-safe sync tooling.
- Advanced Bright Builds reactive physics, motion cleanup checks, and visual-system polish.
- Full release browser/a11y/performance suite beyond the focused Phase 3 static and smoke checks.

</deferred>

---

*Phase: 03-portfolio-surfaces-seo*
*Context gathered: 2026-05-26*
