# Phase 12: Project Metadata & Sharing - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-06-02T21:20:49Z
**Phase:** 12-Project Metadata & Sharing
**Mode:** Yolo
**Areas discussed:** Project Metadata, Structured Data, Sitemap and Sharing Assets, Verification

---

## Project Metadata

| Option | Description | Selected |
|--------|-------------|----------|
| Curated data first | Derive project title, description, canonical, Open Graph, and Twitter metadata from selected project records and profile origin. | yes |
| GitHub metadata first | Derive share metadata primarily from checked-in GitHub snapshot facts. | |
| Route filesystem first | Derive metadata from generated route files or route scanning. | |

**User's choice:** Curated data first (recommended default).
**Notes:** Existing project decisions reject raw GitHub mirroring and runtime GitHub dependencies. GitHub facts can enrich visible project pages, but authored curated data remains the metadata authority.

---

## Structured Data

| Option | Description | Selected |
|--------|-------------|----------|
| Dedicated project JSON-LD | Add a pure project JSON-LD helper and render it on each selected detail route before hydration. | yes |
| Reuse ItemList only | Depend on `/projects` ItemList JSON-LD to represent project details. | |
| Skip until release phase | Leave detail JSON-LD absent until Phase 13 release coverage. | |

**User's choice:** Dedicated project JSON-LD (recommended default).
**Notes:** Phase 12 owns `META-02`, so project detail pages should emit their own structured data now. The helper should use curated data and existing profile `sameAs` identity links where appropriate.

---

## Sitemap and Sharing Assets

| Option | Description | Selected |
|--------|-------------|----------|
| First-class route sitemap plus static fallback image | Make selected detail routes part of the default sitemap output and document/verify the checked-in social image fallback. | yes |
| Generate new per-project images | Add project-specific raster image generation in this phase. | |
| Dynamic OG endpoint | Add runtime/server-rendered Open Graph image support. | |

**User's choice:** First-class route sitemap plus static fallback image (recommended default).
**Notes:** The roadmap allows deterministic project-specific social preview support or a documented static fallback. Dynamic OG endpoints are out of scope for static deployment, and richer per-project image generation is already deferred to future social-image requirements.

---

## Verification

| Option | Description | Selected |
|--------|-------------|----------|
| Pure helper tests plus static/release verification | Add focused unit tests, static output assertions, sitemap checks, social asset checks, and remove the release verifier JSON-LD exception. | yes |
| Static verifier only | Rely on generated output checks without pure helper tests. | |
| Unit tests only | Leave generated HTML and release verifier behavior to Phase 13. | |

**User's choice:** Pure helper tests plus static/release verification (recommended default).
**Notes:** Phase 12 should prove metadata and structured data before hydration. Phase 13 can broaden release documentation and browser route coverage, but this phase should close the current metadata-specific verification gap.

---

## the agent's Discretion

- Exact JSON-LD type details and helper names may be selected during planning as long as they fit the existing `src/domain/seo.ts` style and static software/project page intent.
- The implementation may keep the existing checked-in social image as the documented static fallback if adding project-specific assets would create unnecessary complexity.

## Deferred Ideas

- Rich per-project raster Open Graph image generation.
- Visitor-visible social previews that vary by project theme.
- Release-readiness documentation and browser route coverage expansion.
