# Feature Research: v1.2 Project Story Pages

**Milestone:** v1.2 Project Story Pages
**Researched:** 2026-06-01
**Scope:** Expected behavior for static project detail pages added to the existing portfolio.

## Table Stakes

### Project Detail Routes

- Each selected project has a stable, human-readable URL.
- Static project pages render before hydration and can be linked directly.
- Project cards link to detail pages instead of only anchoring within `/projects`.
- Missing or hidden project slugs do not create public pages.

### Project Story Content

- Each detail page answers what the project is, why it matters, how it works at a high level, current status, and where to go next.
- Authored copy remains the source of truth; GitHub metadata may enrich facts but cannot replace narrative.
- Status, maturity, role, themes, tags, and links remain visible without crowding the story.
- Collaboration angle is explicit enough for a technical visitor to know why they might reach out or inspect the repo.

### Metadata and Sharing

- Each project page has a specific title, description, canonical URL, Open Graph/Twitter metadata, and sitemap entry.
- Project detail structured data uses appropriate static schema, likely `SoftwareSourceCode` for repo-backed work.
- Social previews are project-specific where practical, but static and deterministic.

### Navigation and Discovery

- Home featured cards and project index cards move visitors from overview to project detail pages.
- Project detail pages provide a path back to the project index and to the project source/live links.
- The project index remains useful as a scannable overview.

### Verification

- Static verification checks that every public project route exists and contains expected project story text.
- Browser checks include project detail routes in desktop/mobile dark layout, axe, reduced-motion, and keyboard coverage.
- Release checks keep static budgets realistic as route count grows.

## Differentiators

- Detail pages can feel like concise technical case-study pages without becoming marketing fluff.
- Project-specific social cards can highlight theme/status/name without dynamic server rendering.
- The current "curated, not mirrored" positioning can become more concrete by explaining why each project is included.

## Deferred

- Dedicated writing or notes surface.
- CMS/admin editing.
- Dynamic OG image endpoints.
- Detail pages for every public repository.
- Automated live link reachability beyond the existing release policy.
- Visitor-runtime GitHub API calls.

## Requirement Categories

Recommended v1.2 requirement categories:

- `ROUTE`: static project route generation and routing behavior.
- `STORY`: authored detail-page content model and rendering.
- `META`: metadata, structured data, sitemap, and social previews.
- `NAV`: home/project-index navigation to and from detail routes.
- `VERIFY`: static, browser, release, and curation verification coverage.
