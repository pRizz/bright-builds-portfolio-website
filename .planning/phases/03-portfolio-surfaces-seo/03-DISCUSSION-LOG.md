# Phase 3: Portfolio Surfaces & SEO - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-26T10:37:25.810Z
**Phase:** 3-Portfolio Surfaces & SEO
**Mode:** Yolo
**Areas discussed:** Identity and narrative surfaces, Project story presentation,
Collaboration and OpenLinks identity, Static SEO and metadata

---

## Identity and Narrative Surfaces

| Option | Description | Selected |
|--------|-------------|----------|
| Identity-first portfolio | Lead with Peter Ryszkiewicz / pRizz, Bright Builds, and the AI/Bitcoin/open-systems/developer-tooling focus. | yes |
| Project-first grid | Lead with project cards and let profile context appear later. | |
| Generic capability page | Use skills/services style copy first. | |

**User's choice:** Auto-selected identity-first portfolio.
**Notes:** This best satisfies `PROF-01` and avoids template residue from the current Bright Builds
site.

---

## Project Story Presentation

| Option | Description | Selected |
|--------|-------------|----------|
| Flagship plus grouped index | Feature 4-6 flagship stories on home and group the project index by curated placement/tier. | yes |
| Flat curated list | Show every visible project in one list with lightweight labels only. | |
| Full project routes immediately | Add separate static routes for each project in Phase 3. | |

**User's choice:** Auto-selected flagship plus grouped index.
**Notes:** Stable `/projects#${project.slug}` anchors are the Phase 3 deep-link target; separate
project routes and per-project OG images are deferred until richer detail content exists.

---

## Collaboration and OpenLinks Identity

| Option | Description | Selected |
|--------|-------------|----------|
| Subtle visible identity placement | Keep OpenLinks in footer/about/contact/profile surfaces with `rel="me"` and JSON-LD sameAs support. | yes |
| Header-level promotion | Put OpenLinks in primary navigation or the main hero CTA. | |
| Metadata only | Add JSON-LD only without a clear visible link. | |

**User's choice:** Auto-selected subtle visible identity placement.
**Notes:** This follows the OpenLinks identity-presence skill and keeps Bright Builds as the host
brand.

---

## Static SEO and Metadata

| Option | Description | Selected |
|--------|-------------|----------|
| Pure metadata registry | Derive route metadata, JSON-LD, sitemap, robots, and social preview references from pure domain data. | yes |
| Route-local literals | Keep metadata hard-coded in every route component. | |
| Runtime metadata generation | Use dynamic runtime/server behavior for metadata. | |

**User's choice:** Auto-selected pure metadata registry.
**Notes:** This preserves the existing functional-core seam and supports generated static HTML
verification before hydration.

## the agent's Discretion

- Exact component boundaries, CSS helper names, and social preview asset implementation.
- Exact grouping labels for project placements, as long as flagship/supporting/lab/archive/hidden
  distinctions remain clear.
- Exact test split between unit tests and static-output assertions.

## Deferred Ideas

- Separate project routes and per-project OG images.
- Archive search/filtering.
- Optional GitHub metadata refresh.
- Phase 4 motion and visual-system polish.
