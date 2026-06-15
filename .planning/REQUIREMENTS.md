# Requirements: Bright Builds Portfolio Website v1.3

**Defined:** 2026-06-03
**Milestone:** v1.3 Writing & Notes Surface
**Core Value:** Help visitors quickly understand what Peter builds, why it matters, and which projects are worth exploring or collaborating on.

## v1.3 Requirements

Requirements for the writing and notes milestone. Each requirement maps to exactly one roadmap phase.

### Content Model

- [x] **WRITE-01**: Maintainer can define curated writing or note entries in a typed checked-in registry without adding runtime APIs, CMS, MDX, or external content dependencies.
- [x] **WRITE-02**: Maintainer can mark writing entries as published or hidden/draft so only selected public entries create public static routes.
- [x] **WRITE-03**: Maintainer can author entry title, summary, date or status, tags or topics, body sections or blocks, and optional related project slugs in a structure that validation can verify.
- [x] **WRITE-04**: Unit tests cover writing eligibility, slug and path derivation, public/draft exclusion, required field validation, and related project slug integrity.

### Writing Routes

- [x] **ROUTE-01**: Visitor can open a stable `/writing` index listing public writing entries in curated or reverse-chronological order.
- [x] **ROUTE-02**: Visitor can open stable `/writing/{slug}` static detail routes for every public writing entry.
- [x] **ROUTE-03**: Clean static builds prerender `/writing` and every public writing detail route before hydration.
- [x] **ROUTE-04**: Hidden, draft, archived-only, or otherwise unpublished writing entries do not create public detail pages.

### Reading Experience

- [x] **READ-01**: Visitor can understand each writing entry's main idea, context, and relevance from the static detail page.
- [x] **READ-02**: Writing index and detail pages preserve dark-primary responsive layout, accessible headings, readable body text, and stable text layout on desktop and mobile.
- [x] **READ-03**: Writing detail pages provide clear paths back to the writing index and onward to related projects when relationships exist.

### Project Cross-Links

- [x] **LINK-01**: Writing entries can reference related selected project slugs through typed data.
- [x] **LINK-02**: Project detail pages can display related writing links derived from writing data without duplicating relationship data on project records.
- [x] **LINK-03**: Verification fails when a writing entry references an unknown, hidden, or unsupported project slug.

### Metadata and Discovery

- [x] **META-01**: `/writing` and each writing detail route have route-specific title, description, canonical URL, Open Graph, and Twitter metadata derived from writing and profile data.
- [x] **META-02**: Writing detail routes render static `BlogPosting` JSON-LD and the writing index renders appropriate collection or `ItemList` JSON-LD before hydration.
- [x] **META-03**: Generated sitemap output includes public writing routes and excludes draft or hidden writing routes.
- [x] **META-04**: Writing routes use the checked-in static social preview fallback or documented deterministic support without runtime image generation.

### Verification

- [x] **VERIFY-01**: Static verification checks generated writing HTML for expected content, metadata, JSON-LD, sitemap inclusion and exclusion, related-project links, and forbidden runtime API residue.
- [x] **VERIFY-02**: Browser release checks include writing routes for axe, dark desktop and mobile layout, keyboard reachability, and reduced-motion behavior where relevant.
- [x] **VERIFY-03**: Release-readiness docs and checks identify writing route coverage as part of `bun run install:browser && bun run verify`.
- [x] **VERIFY-04**: The aggregate `bun run verify` gate passes with writing routes included and release evidence labels name only automated writing coverage.

### Maintenance Cleanup

- [ ] **MAINT-01**: Static verification is split into focused, repo-owned TypeScript modules or helpers so writing and project generated-output assertions remain maintainable while preserving existing `verify:static` and aggregate release coverage.

## Future Requirements

Deferred beyond v1.3. Tracked here so the current milestone can explicitly avoid building a generic blog engine.

### Social Images

- **OG-01**: Maintainer can generate richer project and writing raster Open Graph images from deterministic templates.
- **OG-02**: Visitor-visible social previews can vary by content theme without manual image editing.

### Content Operations

- **CMS-01**: Maintainer can draft, edit, and publish writing through a CMS or admin surface.
- **CMS-02**: Maintainer can preview unpublished writing before it is published to static output.

### Writing Enhancements

- **WRITE-FUTURE-01**: Visitor can subscribe to an RSS or Atom feed of public writing.
- **WRITE-FUTURE-02**: Visitor can search, filter, paginate, or browse tag archive pages if the writing set grows.
- **WRITE-FUTURE-03**: Visitor can comment, subscribe, or otherwise opt into a newsletter only after there is a clear collaboration need.

## Out of Scope

Explicitly excluded from v1.3 to prevent scope creep.

| Feature | Reason |
| --- | --- |
| CMS, admin UI, database, or auth-backed editor | Typed checked-in content is enough for v1.3 and preserves the static deployment model. |
| Markdown, MDX, Contentlayer, or parser pipelines | No new content dependencies are needed; typed registry keeps validation, routing, and metadata simple. |
| RSS, Atom, search, pagination, and tag archive pages | The first writing set should be curated and small; discovery expansion can wait until volume requires it. |
| Comments, likes, reactions, webmentions, newsletter backend, or analytics stack | These are not core to the portfolio reading path and add operational surface. |
| Dynamic Open Graph image routes or server endpoints | Static deployment remains the target; v1.3 can reuse the checked-in social preview fallback. |
| Runtime GitHub, Gist, Notion, Substack, RSS, or token-dependent content fetches | Visitor paths must stay static, deterministic, and token-safe. |
| Generic blog/archive engine or mirrored external writing | v1.3 is a curated writing graph tied to project stories, not a volume publishing platform. |
| Live external link reachability automation | Existing policy and static verification are sufficient unless a future release gate expands link checks. |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
| --- | --- | --- |
| WRITE-01 | Phase 14 | Complete |
| WRITE-02 | Phase 14 | Complete |
| WRITE-03 | Phase 14 | Complete |
| WRITE-04 | Phase 14 | Complete |
| ROUTE-01 | Phase 15 | Complete |
| ROUTE-02 | Phase 15 | Complete |
| ROUTE-03 | Phase 15 | Complete |
| ROUTE-04 | Phase 15 | Complete |
| READ-01 | Phase 15 | Complete |
| READ-02 | Phase 15 | Complete |
| READ-03 | Phase 15 | Complete |
| LINK-01 | Phase 14 | Complete |
| LINK-02 | Phase 15 | Complete |
| LINK-03 | Phase 14 | Complete |
| META-01 | Phase 16 | Complete |
| META-02 | Phase 16 | Complete |
| META-03 | Phase 16 | Complete |
| META-04 | Phase 16 | Complete |
| VERIFY-01 | Phase 17 | Complete |
| VERIFY-02 | Phase 17 | Complete |
| VERIFY-03 | Phase 17 | Complete |
| VERIFY-04 | Phase 17 | Complete |
| MAINT-01 | Phase 18 | Pending |

**Coverage:**

- v1.3 requirements: 23 total
- Mapped to phases: 23
- Unmapped: 0

______________________________________________________________________

*Requirements defined: 2026-06-03*
*Last updated: 2026-06-15 after milestone audit tech-debt planning*
