# Requirements: Bright Builds Portfolio Website v1.5

**Defined:** 2026-06-21
**Milestone:** v1.5 Static Shareability & Freshness
**Core Value:** Help visitors quickly understand what Peter builds, why it matters, and which projects are worth exploring or collaborating on.

## v1.5 Requirements

Requirements for the static shareability and freshness milestone. Each requirement maps to exactly one roadmap phase.

### Share Data

- [x] **SHARE-01**: Maintainer can ask a pure social preview helper for all public share targets covering `/projects`, selected project detail routes, `/writing`, public writing detail routes, `/themes`, and public theme detail routes.
- [x] **SHARE-02**: Hidden, draft, unsupported, archived, unselected, or otherwise non-public project, writing, and theme records do not create public social preview targets.
- [x] **SHARE-03**: Each social preview target includes route path, local asset path, title, description, route kind or kicker, labels, route-specific alt text, dimensions, and a stable source fingerprint.
- [x] **SHARE-04**: Social preview validation fails for duplicate routes or asset paths, missing required text, non-local asset paths, unsafe path characters, unsupported route kinds, and text that cannot fit the template rules.
- [x] **SHARE-05**: Generic routes outside the v1.5 share target set keep the checked-in fallback social image instead of requiring route-specific generated images.

### Image Generation

- [x] **IMAGE-01**: Maintainer can run a Bun/TypeScript command that deterministically generates 1200x630 PNG social preview images for every social preview target.
- [x] **IMAGE-02**: Generated images use checked-in template inputs, fonts, and local assets without network fetches, runtime services, host-font dependence, timestamps, randomness, secrets, or visitor-runtime code.
- [x] **IMAGE-03**: Generated image output is confined to a managed static asset directory and does not delete or overwrite unrelated public assets such as the fallback social image.
- [x] **IMAGE-04**: The generator writes a timestamp-free manifest with route path, asset path, dimensions, byte size, source fingerprint, and file checksum for every generated preview.
- [x] **IMAGE-05**: Image generation check mode fails for missing, stale, wrong-dimension, oversized, blank, orphaned, or non-deterministically regenerated social preview assets.

### Metadata and Structured Data

- [ ] **META-01**: Project, writing, theme, and route-family index metadata select route-specific social preview images from the same social preview helper used by the generator.
- [ ] **META-02**: Generated HTML exposes absolute canonical `og:image`, `og:image:type`, `og:image:width`, `og:image:height`, `og:image:alt`, `twitter:image`, and `twitter:image:alt` values for every covered share route before hydration.
- [ ] **META-03**: Project, writing, and theme JSON-LD `image` values use the same route-specific social preview asset as the corresponding Open Graph and Twitter metadata.
- [ ] **META-04**: Home, about, contact, and other generic routes continue to use the checked-in fallback social image until a future milestone deliberately scopes route-specific images for them.
- [ ] **META-05**: Route components do not hard-code social image metadata; metadata and structured data continue to derive from domain helpers.

### Freshness Reports

- [x] **FRESH-01**: Maintainer can run an offline freshness report that summarizes generated media drift, GitHub metadata snapshot age and unavailable records, primary link policy coverage, HTTPS issues, and manual smoke targets.
- [x] **FRESH-02**: Freshness findings are grouped into `release blocker`, `needs review`, and `manual smoke` severities so deterministic blockers are separated from report-only maintenance reminders.
- [x] **FRESH-03**: Freshness reports do not mutate curated project, writing, theme, profile, GitHub metadata, or generated social preview source data.
- [x] **FRESH-04**: Optional live freshness checks, if added, run only through explicit maintainer commands and are not part of `bun run verify`.
- [x] **FRESH-05**: Freshness documentation distinguishes reviewed static evidence from hosted crawler validation, live external-link reachability, and current live GitHub state.

### Verification and Release Contract

- [ ] **VERIFY-01**: Unit tests cover social preview target derivation, public-only filtering, path uniqueness, fingerprint stability, manifest freshness checks, metadata image selection, JSON-LD image parity, and offline freshness finding classification.
- [ ] **VERIFY-02**: The aggregate `bun run verify` gate includes deterministic social preview verification before production build and still avoids dynamic OG endpoints, server functions, visitor-runtime GitHub fetches, and live external-link release gates.
- [ ] **VERIFY-03**: Static output verification checks every covered route's generated HTML, social image metadata, JSON-LD image field, local asset existence, dimensions, manifest consistency, and forbidden runtime residue.
- [ ] **VERIFY-04**: Release verification enforces per-image and total social preview asset budgets and reports only automated evidence labels that actually run locally.
- [ ] **VERIFY-05**: Release-readiness docs explain the generation, verification, freshness report, and manual social-card smoke-check flow while preserving the clean-builder release command `bun run install:browser && bun run verify`.

## Future Requirements

Deferred beyond v1.5. Tracked here so static shareability stays focused and deterministic.

### Social Preview Expansion

- **SOCIAL-FUTURE-01**: Maintainer can generate route-specific previews for home, about, contact, and future generic routes when those pages need differentiated social cards.
- **SOCIAL-FUTURE-02**: Maintainer can run platform-specific social-card validator automation after the project deliberately accepts those hosted-service dependencies.
- **SOCIAL-FUTURE-03**: Maintainer can publish a private or local review gallery for all generated social cards if visual review needs outgrow manifest diffs.

### Freshness Automation

- **FRESH-FUTURE-01**: Maintainer can run scheduled GitHub metadata refreshes in CI with reviewed diffs and conditional requests.
- **FRESH-FUTURE-02**: Maintainer can run scheduled live external-link reachability reports if release needs justify the network and flake surface.
- **FRESH-FUTURE-03**: Maintainer can track freshness trends over time without turning maintenance reports into public product UI.

### Content Operations

- **CONTENT-FUTURE-01**: Maintainer can use CMS/admin/editor workflows after checked-in curated data becomes painful.
- **CONTENT-FUTURE-02**: Visitor can subscribe to RSS, Atom, newsletter, or other update surfaces after there is a clear publishing cadence and collaboration need.
- **CONTENT-FUTURE-03**: Visitor can search, filter, paginate, or browse tag archives if project, writing, or theme volume grows enough to require it.

## Out of Scope

Explicitly excluded from v1.5 to prevent scope creep.

| Feature | Reason |
| --- | --- |
| Dynamic Open Graph endpoints, API routes, edge/serverless functions, or runtime image generation | The portfolio remains a static deployment; social images should be generated before release and served as files. |
| Remote screenshot services, remote fonts, remote images, or visitor-runtime image/data fetches | Share previews must be deterministic, local, and token-safe. |
| Live external-link release gates, social-platform debugger automation, or hosted crawler validation inside `bun run verify` | Third-party network checks are flaky and should remain manual/report-only until deliberately accepted. |
| Runtime GitHub fetches, raw GitHub mirroring, or automated mutation of curated records from freshness reports | GitHub metadata remains advisory, checked in, and reviewed by maintainers. |
| CMS, admin UI, authentication, databases, comments, reactions, webmentions, newsletter backend, analytics, search, filters, pagination, or tag archives | These are content operations or discovery expansions, not required for static shareability. |
| Public freshness dashboard route | Freshness is maintainer evidence, not visitor-facing product content. |
| Hand-edited route PNGs or manually maintained route-to-image maps | Generated images must derive from route helpers and remain verifiable. |
| More prominent OpenLinks branding or primary CTA changes | OpenLinks stays discoverable as low-intrusion identity context while Bright Builds and route-specific content remain primary. |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
| --- | --- | --- |
| SHARE-01 | Phase 24 | Complete |
| SHARE-02 | Phase 24 | Complete |
| SHARE-03 | Phase 24 | Complete |
| SHARE-04 | Phase 24 | Complete |
| SHARE-05 | Phase 24 | Complete |
| IMAGE-01 | Phase 25 | Complete |
| IMAGE-02 | Phase 25 | Complete |
| IMAGE-03 | Phase 25 | Complete |
| IMAGE-04 | Phase 25 | Complete |
| IMAGE-05 | Phase 25 | Complete |
| META-01 | Phase 26 | Complete |
| META-02 | Phase 26 | Complete |
| META-03 | Phase 26 | Complete |
| META-04 | Phase 26 | Complete |
| META-05 | Phase 26 | Complete |
| FRESH-01 | Phase 27 | Complete |
| FRESH-02 | Phase 27 | Complete |
| FRESH-03 | Phase 27 | Complete |
| FRESH-04 | Phase 27 | Complete |
| FRESH-05 | Phase 27 | Complete |
| VERIFY-01 | Phase 28 | Pending |
| VERIFY-02 | Phase 28 | Pending |
| VERIFY-03 | Phase 28 | Pending |
| VERIFY-04 | Phase 28 | Pending |
| VERIFY-05 | Phase 28 | Pending |

**Coverage:**

- v1.5 requirements: 25 total
- Mapped to phases: 25
- Unmapped: 0

______________________________________________________________________

*Requirements defined: 2026-06-21*
*Last updated: 2026-06-21 after roadmap creation*
