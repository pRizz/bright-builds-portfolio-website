# Pitfalls Research: v1.2 Project Story Pages

**Milestone:** v1.2 Project Story Pages
**Researched:** 2026-06-01
**Scope:** Common mistakes when adding static project story pages to the existing portfolio.

## Pitfalls and Prevention

| Pitfall | Risk | Prevention |
| --- | --- | --- |
| Building a page for every repo | Dilutes curation and recreates a noisy GitHub mirror. | Select flagship/supporting projects only; keep hidden/excluded records hidden. |
| Splitting content authority | Markdown, JSON, and TypeScript sources can drift. | Keep v1.2 content in the typed curated registry unless a later milestone proves markdown is needed. |
| Client-only project pages | SEO and static sharing suffer if details render only after hydration. | Verify generated `.output/public/projects/{slug}/index.html` contains story text before hydration. |
| Anchor and route drift | Existing `/projects#slug` links can break or compete with new detail routes. | Add a deliberate helper for project detail URLs and update callers consistently. |
| Metadata duplication | Route metadata, sitemap, JSON-LD, and cards can disagree. | Derive all project metadata from shared pure helpers. |
| Oversized social previews | Per-project OG work can bloat assets or require server rendering. | Prefer static checked assets/cards; keep dynamic generation out of v1.2. |
| Weak visual verification | More pages can introduce dark-mode contrast, overflow, or text overlap regressions. | Include project routes in `prerenderRoutes` so Playwright checks cover them. |
| Release budget fragility | Total HTML size grows with route count. | Use per-route budgets and update aggregate expectations only when justified. |
| Over-marketing the copy | Project pages can become vague case studies instead of useful technical context. | Require problem, approach, technical shape, status, links, and collaboration angle. |
| Reintroducing GitHub runtime dependency | Detail pages may tempt live repo fetches. | Keep GitHub metadata snapshot-only and preserve no-runtime-GitHub verification. |

## Phase-Level Guardrails

- Route/content foundation should include tests before page rendering expands.
- UI implementation should verify desktop and mobile dark layouts, not only unit behavior.
- Metadata/social work should update generator scripts and static verification together.
- Release-gate work should prove clean-builder verification still starts with `bun run install:browser && bun run verify`.
