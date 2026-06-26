# Feature Landscape

**Domain:** Static-first content discovery, filtering, feeds, related-work navigation, and generic-route share polish for the Bright Builds Portfolio Website v1.6 milestone
**Researched:** 2026-06-26
**Overall confidence:** HIGH for local scope and static-first feature ordering; MEDIUM for exact feed-reader and crawler behavior across third-party clients.

## Table Stakes

Features users expect. Missing = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Canonical discovery term registry | Projects already expose `themes`/`tags`, writing exposes `topics`/`tags`, and themes expose curated route concepts. Visitors now need those visible labels to become navigable, not decorative. | Medium | Create a pure domain layer that normalizes term labels, slugs, aliases, description copy, and public counts across public projects, published writing, and public themes. Do not let hidden, draft, archived, unsupported, or excluded records leak into discovery terms. |
| Static `/topics` index | A corpus with projects, writing, and theme paths needs a top-level "browse by idea" entry point separate from the existing type-based indexes. | Medium | Render a dark-primary topic index from the term registry with counts by content type, short descriptions, and links to topic pages. Include metadata, JSON-LD `ItemList`, sitemap inclusion, social preview coverage, and static output verification. |
| Static `/topics/{slug}` pages | Topic/detail pages are the durable crawlable discovery surface for users and search engines; they also avoid relying on JavaScript-only filters for discovery. | Medium-High | Each topic page should show related projects, writing, themes, and collaboration paths sorted by existing display order or a simple curated weight. Unknown topic slugs must fall back without exposing unsupported content. |
| Label chips link to canonical topic pages | Existing chips on home, project, writing, and theme surfaces should create paths into the corpus. | Medium | Convert only canonical public labels to links. Preserve text-only chips for labels intentionally not promoted to discovery routes, or validate that every public label has a canonical term. |
| Project index filtering | The project index has enough flagship, supporting, lab, status, theme, and tag distinctions that visitors need a faster way to narrow it. | Medium | Prefer static, client-local controls over a full search subsystem: segmented controls, checkbox/toggle filters, or a small metadata-only text filter. Filtering should use already-rendered or checked-in data and no visitor-runtime fetches. |
| Writing index filtering | Writing already has kind, topic, tag, and date metadata; visitors should be able to find notes by subject without scanning a long list. | Medium | Mirror the project filter pattern where practical. Include kind/topic/tag filters, reset behavior, visible result counts, empty state copy, keyboard support, and browser coverage. |
| Accessible filter state and result feedback | Filter/search UI is interactive; it must work for keyboard and assistive-technology users, not just pointer users. | Medium | Controls need labels, focus-visible states, stable tab order, no text overlap, and status text for result counts or empty states. WCAG 2.2 supports multiple ways to locate pages and requires programmatically determinable status messages. |
| No crawlable faceted URL explosion | Static topic pages are valuable; arbitrary filter combinations are not. | Medium | Do not generate URLs for every filter combination. If filter state needs shareability, prefer URL fragments or a tiny whitelisted set of canonical topic routes. Google's faceted-navigation guidance flags parameter combinations as a crawl risk. |
| Static RSS feed | Writing and site updates should be subscribable without a backend, API route, newsletter service, or hosted feed platform. | Medium | Build a deterministic RSS 2.0 feed at `/feed.xml` or `/writing/feed.xml`. Include channel title/link/description, absolute item links, stable GUIDs, dates where available, categories from topics/tags, and summaries. Prefer writing-first unless explicit site-update records with dates exist. |
| Feed autodiscovery and visible feed links | Feed readers discover feeds through HTML `link rel="alternate"` tags; humans need a visible subscribe path. | Low-Medium | Add feed autodiscovery on home and writing pages at minimum, plus a low-intrusion visible "Feed" link in writing/footer chrome. Keep OpenLinks secondary to Bright Builds content journeys. |
| Feed validation and static output checks | Invalid XML silently breaks feed readers. | Medium | Add pure feed helpers plus tests for escaping, required fields, absolute URLs, date formatting, category mapping, stable ordering, and no draft/hidden content. Static verification should confirm the feed file exists in output and the autodiscovery href matches it. |
| Related-work graph helper | Related work already exists in several pairwise helpers; v1.6 needs one visitor-facing graph so pages do not become dead ends. | Medium-High | Centralize relationships across project themes/tags, writing topics/tags, theme `relatedProjectSlugs`, theme `relatedWritingSlugs`, and existing writing-project links. Return reason labels such as `same topic`, `related writing`, or `theme path` so UI copy is explainable. |
| Stronger related-work panels on detail pages | Project, writing, and theme detail pages should offer next steps across content types without repeating the same manual card logic everywhere. | Medium | Extend existing related writing/theme panels into a consistent "Related work" or "Continue exploring" surface. Keep cards compact, dark-primary, and static. Avoid nested cards. |
| Discovery paths on generic pages | Home, about, and contact should guide visitors into topics, projects, writing, and themes rather than only linking to broad indexes. | Low-Medium | Add a small set of curated "start here" links or topic shortcuts where they clarify the visitor journey. Do not turn generic pages into dashboards. |
| Generic-route social previews | v1.5 deliberately left generic routes on the fallback image; v1.6 should polish share cards where differentiated cards help sharing. | Medium | Add route-specific social preview targets for `/`, `/about`, `/contact`, and new discovery/feed-adjacent route pages where useful. Reuse the existing deterministic social preview generator, manifest, metadata, JSON-LD parity, budgets, and static verification pattern. |
| Discovery metadata and structured data | New public discovery routes must be as crawlable and shareable as existing project/writing/theme pages. | Medium | Topic index/detail pages should have route metadata, canonical URLs, Open Graph/Twitter image references, JSON-LD `ItemList`/`CollectionPage` as appropriate, sitemap entries, and static HTML verification before hydration. |
| Release evidence stays local and truthful | The repo already distinguishes local automated evidence from hosted/manual checks. v1.6 should preserve that contract. | Low-Medium | Extend `bun run verify` only with deterministic local checks: term validation, topic route output, filter browser checks, feed validity, related-work coverage, generic social previews, and no visitor-runtime network dependencies. Hosted feed-reader checks and live crawler validation remain manual. |

## Differentiators

Features that set product apart. Not expected, but valued.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| "Start with a theme" discovery hub | Turns a static portfolio into a guided map of Peter's work by idea, not just by content type. | Medium | Add curated topic groups such as Agentic engineering, Bitcoin, Open identity, Open systems, Developer tooling, SolidJS, and Web experiments. Keep it browsable and content-rich, not a marketing hero. |
| Related-work reason labels | Visitors trust recommendations more when the site explains why items are connected. | Medium | Show concise labels like `shares Bitcoin`, `mentioned by this note`, `part of Open identity`, or `same collaboration path`. Derive from the graph helper, not handwritten route copy. |
| "Continue exploring" next-step rail | Reduces dead ends after someone reads one project or note. | Medium | Use the related-work graph to recommend 2-4 next steps, with one primary cross-type jump when available. Keep ordering deterministic and tested. |
| JSON Feed companion | JSON Feed is easier to generate and inspect in TypeScript and supports modern feed metadata such as icons and featured images. | Low-Medium | Defer unless RSS helpers are already clean. If added, generate from the same feed item model as RSS and expose it as a companion `/feed.json`, not as a replacement for RSS. |
| Site update feed backed by explicit update records | Lets subscribers follow notable project/theme/page additions, not only writing. | Medium | Build only if a checked-in `updates` registry exists with explicit dates, titles, summaries, route links, and content kinds. Do not infer noisy updates from git history or GitHub activity. |
| Topic-specific feed links | Useful for visitors who care only about AI, Bitcoin, identity, or SolidJS. | Medium | Future-friendly if the feed model is topic-aware. Do not ship until canonical topics and the base feed are stable. |
| Local metadata quick filter | A small text box over project/writing cards can feel fast without a full search engine. | Low-Medium | Keep it metadata-only over titles, summaries, labels, and roles. It should work after static render and should not create a search index artifact, worker, or network dependency. |
| Static discovery preview gallery | Maintainers can visually inspect generic-route and topic social cards in one local artifact. | Low-Medium | Build only if it reuses the v1.5 social-preview gallery/check concepts. Keep it maintainer-facing, not public navigation. |
| Breadcrumb JSON-LD on detail/discovery pages | Helps represent the corpus hierarchy from home to content type to topic/detail. | Low-Medium | Valuable after routes stabilize. Schema.org defines `BreadcrumbList`; use it only where visible or logical breadcrumbs exist. |

## Anti-Features

Features to explicitly NOT build.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| CMS, admin UI, or content editor | The project is still intentionally checked-in and curated. CMS/admin work would add auth, workflow, validation, hosting, and security scope before content files become painful. | Keep typed local registries and add better validation/reporting around them. |
| Full-text search index subsystem | The corpus is not yet large enough to justify Pagefind/Lunr/FlexSearch-style indexing, workers, generated search bundles, stemming, ranking, and result templates. | Ship canonical topic pages plus lightweight metadata filters over checked-in public content. Revisit full-text search when the corpus size makes scanning/filtering insufficient. |
| Hosted search, semantic search, embeddings, or AI recommendations | These introduce network dependencies, privacy concerns, opaque ranking, build/runtime complexity, and non-deterministic results. | Use deterministic local relationship scoring and explicit curated topic metadata. |
| Visitor-runtime content fetches | Runtime JSON, GitHub, feed, or search fetches weaken the static deployment model and can fail independently of the deployed HTML. | Render discovery content statically and embed only the minimal metadata needed for local filter interactions. |
| Runtime feed generation or `/api/feed` endpoints | Feed output does not need a server path and should work on static hosting. | Generate XML/JSON feed files during static metadata generation or build verification. |
| Crawled filter-combination routes | Arbitrary query-param or path-based facet combinations create duplicate/thin pages and crawl traps. | Create only curated `/topics/{slug}` pages and keep transient filter state client-local or fragment-based. |
| Automatically publishing every raw tag as a topic route | Raw labels may be duplicates, too narrow, typo-prone, or not meaningful as public entry points. | Normalize labels through a canonical discovery registry with validation for aliases, public counts, and hidden-content exclusion. |
| Raw GitHub mirror discovery | GitHub remains advisory source material, not the visitor-facing corpus. Mirroring all repos would reintroduce forks, prototypes, repros, archived work, and noise. | Use existing curated public project selectors and static GitHub snapshot facts only where already reviewed. |
| Network/link freshness gates in `bun run verify` | Live checks are useful but flaky and external-service dependent. They can turn deterministic releases into network debugging. | Keep offline reports and manual smoke lists; use explicit strict/live commands only outside the aggregate local release gate. |
| Newsletter, comments, reactions, WebSub hub, webmentions, or analytics | These are publishing/community systems, not navigation of the current corpus. They add moderation, privacy, delivery, or service scope. | Use static feeds, contact links, and existing collaboration paths. |
| Heavy graph visualization | A large interactive network diagram can become slow, inaccessible, and less useful than clear grouped lists. | Use compact related-work cards, reason labels, and curated topic groups. |
| Infinite scroll or hiding core content behind JavaScript | Static output, accessibility, and crawlability are stronger when the full public corpus is in HTML. | Render the content list statically, then progressively enhance with local filtering. |
| Prominent OpenLinks promotion in discovery routes | OpenLinks is an identity hub, not the primary portfolio journey. | Keep OpenLinks visible in footer/profile/contact/metadata while Bright Builds topics, projects, writing, and collaboration paths remain primary. |

## Feature Dependencies

```text
Existing public selectors
  -> canonical discovery term registry
  -> term validation and hidden-content exclusion
  -> /topics index and /topics/{slug} route helpers
  -> sitemap, metadata, JSON-LD, social preview targets, and static verification

Canonical discovery term registry
  -> linked chips on project/writing/theme/home surfaces
  -> project index filters
  -> writing index filters
  -> topic-aware related-work reason labels

Public writing entries with explicit dates
  -> feed item model
  -> RSS XML generation
  -> optional JSON Feed companion
  -> feed autodiscovery links and visible feed link
  -> feed validity/static output verification

Theme and writing relationship helpers
  -> shared related-work graph helper
  -> related-work panels on project, writing, theme, and topic pages
  -> "continue exploring" next-step surfaces
  -> browser and static route coverage

Generic route metadata
  -> generic-route social preview targets for /, /about, /contact, and topic index
  -> existing social preview generator/manifest
  -> metadata and JSON-LD image parity
  -> release image budgets and static output checks

Future full-text search index
  requires rendered-content extraction, generated index budgets, search UI ranking rules,
  no-runtime-network guards, and accessibility testing. It should not block v1.6.

Future CMS/admin work
  requires content ownership, authentication, editing workflow, preview workflow,
  schema migrations, and deployment permissions. It is explicitly outside v1.6.

Future live/network freshness gates
  require a policy decision about flake tolerance, credentials, retry behavior,
  and whether failures can block release. Keep v1.6 local and deterministic.
```

## MVP Recommendation

Prioritize:

1. **Canonical discovery foundation** - Normalize public terms across projects, writing, and themes; validate aliases, slugs, counts, and hidden-content exclusion.
2. **Static topic routes** - Ship `/topics` and `/topics/{slug}` with route helpers, metadata, JSON-LD, sitemap entries, social preview targets, and static verification.
3. **Project and writing filters** - Add dark-primary, accessible, local-only filtering on `/projects` and `/writing` using the same discovery term model.
4. **RSS feed** - Generate a valid static RSS feed from published writing first; add site updates only if explicit dated update records exist.
5. **Related-work paths** - Centralize related-work graph logic and add consistent next-step panels across project, writing, theme, and topic detail pages.
6. **Generic-route share polish** - Extend existing social preview generation to home, about, contact, and new discovery routes where differentiated cards help sharing.
7. **Verification contract** - Extend unit, static, browser, accessibility, release, and no-runtime-network checks so the new discovery/feed surfaces are proven locally.

Defer: CMS/admin/editor workflows, full-text search indexes, hosted/semantic search, per-topic feeds, JSON Feed unless it is nearly free after RSS, live-network freshness gates, analytics/newsletter/comments/webmentions, heavy graph visualization, and raw GitHub mirroring.

## Sources

- Local project scope and milestone context: `.planning/PROJECT.md`, `.planning/MILESTONES.md`, `.planning/STATE.md` - HIGH confidence.
- Local repo rules and standards: `AGENTS.md`, `AGENTS.bright-builds.md`, `standards/core/frontend-ui.md`, `standards/core/architecture.md`, `standards/core/verification.md`, `standards/core/testing.md`, `standards/languages/typescript-javascript.md` - HIGH confidence.
- Local domain surfaces inspected: `src/domain/projects.ts`, `src/domain/writing.ts`, `src/domain/themes.ts`, `src/domain/routes.ts`, `src/domain/seo.ts`, `src/domain/social-previews.ts`, `package.json` - HIGH confidence.
- RSS 2.0 Specification, RSS Advisory Board: `https://www.rssboard.org/rss-specification` - HIGH confidence for RSS required fields and item/category/GUID behavior.
- RFC 4287 Atom Syndication Format: `https://www.rfc-editor.org/rfc/rfc4287` - HIGH confidence for Atom requirements if Atom is chosen later.
- WHATWG HTML `rel="alternate"` feed autodiscovery behavior: `https://html.spec.whatwg.org/multipage/links.html#rel-alternate` - HIGH confidence.
- JSON Feed 1.1: `https://www.jsonfeed.org/version/1.1/` - MEDIUM confidence; useful companion format, but RSS remains the recommended v1.6 baseline.
- Schema.org `ItemList` and `BreadcrumbList`: `https://schema.org/ItemList`, `https://schema.org/BreadcrumbList` - MEDIUM-HIGH confidence for structured data shape.
- WCAG 2.2 and WAI-ARIA APG Disclosure pattern: `https://www.w3.org/TR/WCAG22/`, `https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/` - HIGH confidence for accessible navigation/filter requirements.
- Sitemaps protocol: `https://www.sitemaps.org/protocol.html` - HIGH confidence for static URL inclusion requirements.
- Google crawling guidance for faceted navigation URLs, last updated 2025-12-18: `https://developers.google.com/crawling/docs/faceted-navigation` - MEDIUM-HIGH confidence for avoiding crawlable filter-combination URLs.
