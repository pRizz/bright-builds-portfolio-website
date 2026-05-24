# Domain Pitfalls: Bright Builds Portfolio Website

**Domain:** personal developer portfolio with curated GitHub data, static generation, Mystic UI, and restrained motion\
**Researched:** 2026-05-24\
**Overall confidence:** HIGH for GitHub/API, static-generation, env-var, SEO, accessibility, and Mystic UI setup risks; MEDIUM for audience/content risks because they depend on editorial judgment.

## Phase Map

Use these phase labels when turning risks into roadmap work:

| Phase | Purpose |
| --- | --- |
| Phase 1: Foundation | Solid/static stack setup, package manager, Mystic UI dependency pinning, project conventions |
| Phase 2: Content Model | Curated project registry, repo taxonomy, source-of-truth project copy, validation |
| Phase 3: GitHub Data Pipeline | Build-time GitHub enrichment, snapshots, pagination, fallbacks, no runtime API dependency |
| Phase 4: Information Architecture and SEO | Homepage/project structure, audience narrative, metadata, sitemap/robots, OpenLinks placement |
| Phase 5: UI and Motion | Mystic UI composition, responsive layout, physics effects, reduced-motion and mobile behavior |
| Phase 6: Release Verification | Production build inspection, accessibility/performance/SEO checks, deployment sanity |

## Critical Pitfalls

### 1. Shipping Unfinished Template Residue

**What goes wrong:** The new site inherits the current Bright Builds site's placeholder work examples, designer-oriented copy, or inaccurate experience entries.\
**Warning signs:** Copy says "designer" or generic agency language; project cards cannot be traced to Peter's current GitHub/profile sources; placeholder images or fake case studies remain; review focuses on visual polish before content accuracy.\
**Prevention strategy:** Treat the existing site as a style reference only. Create a content acceptance checklist requiring every visible claim, project, role, and link to come from `.planning/PROJECT.md`, Peter's GitHub profile README, or an explicit curated registry entry. Add a release check that searches for placeholder terms and validates all project links.\
**Phase to address:** Phase 2 and Phase 4; re-check in Phase 6.\
**Confidence:** MEDIUM, based on project context and current profile sources.

### 2. Building a Raw GitHub Mirror Instead of a Portfolio

**What goes wrong:** The portfolio blindly surfaces public repositories and makes noisy forks, repros, templates, and playgrounds compete with flagship work. This weakens the story for technical peers and collaborators.\
**Warning signs:** UI maps directly over `/users/pRizz/repos`; cards are sorted only by `pushed_at`, stars, or language; forks and prototypes are not explicitly excluded or labeled; no manual display order; all repo descriptions come from GitHub. Current GitHub data shows `pRizz` has 256 public repos, and the first 100 owner repos sorted by recent push included 50 forks.\
**Prevention strategy:** Make `projects` a hand-curated registry, not an API response. Require fields such as `status`, `audienceValue`, `displayTier`, `displayOrder`, `sourceRepo`, `maybeLiveUrl`, `tags`, `curationReason`, and `excludeFromFeatured`. Use GitHub only to enrich curated records with non-authoritative metadata such as stars, primary language, pushed date, and topics. Add validation that blocks featured projects without original copy and a curation reason.\
**Phase to address:** Phase 2 before any GitHub automation; Phase 3 may only enrich curated entries.\
**Confidence:** HIGH, based on current GitHub API observation and project requirements.

### 3. Depending on the Live GitHub API at Runtime

**What goes wrong:** The static portfolio becomes slow, flaky, or rate-limited because browsers fetch GitHub data on page load. GitHub REST API unauthenticated requests are rate-limited, repository lists are paginated, and `pRizz` has more repos than one max-size page.\
**Warning signs:** Components call `fetch("https://api.github.com/...")`; cards render loading states for portfolio-critical content; production pages fail when GitHub is unavailable; API errors appear in browser devtools; repo data differs between visitors; pagination is missing.\
**Prevention strategy:** Fetch GitHub data at build time using a Node/Bun script or static loader. Page output should be complete static HTML/JSON with a committed or generated snapshot containing `fetchedAt`, source URLs, and fallback values. Paginate explicitly, cache with ETags where practical, and fail soft to the last snapshot rather than failing page rendering. Never make live GitHub availability part of the visitor path.\
**Phase to address:** Phase 3, with Phase 6 verifying production output works offline from GitHub.\
**Confidence:** HIGH, based on GitHub REST API docs and observed repo count.

### 4. Exposing Secrets Through Frontend Environment Variables

**What goes wrong:** A GitHub token intended for build-time data fetching leaks into client JavaScript because it is named with a frontend-exposed prefix or used inside browser code.\
**Warning signs:** Variables named `VITE_GITHUB_TOKEN`, `VITE_GH_TOKEN`, or similar; `import.meta.env` used in components that ship to the browser; GitHub API requests with authorization headers appear in browser devtools; source maps include token-adjacent code.\
**Prevention strategy:** Keep secrets in build/server-only environment variables without a `VITE_` prefix. Put GitHub ingestion in an isolated build script, not in components. Add a simple verification step that greps built assets and source for forbidden token names before release. If SolidStart server functions are used later, document which code executes only during build/server rendering.\
**Phase to address:** Phase 1 defines env conventions; Phase 3 implements ingestion; Phase 6 verifies built assets.\
**Confidence:** HIGH, based on Vite/Solid environment-variable docs.

### 5. Weak SEO Because Content Only Exists After Hydration

**What goes wrong:** The site looks good locally but ships thin HTML, duplicate metadata, weak social previews, or missing crawlable project content. The result is poor search/social presentation for the exact portfolio pages meant to introduce Peter's work.\
**Warning signs:** Built HTML has an empty app root for key content; every route has the same title/description; project detail content exists only in client state; no canonical URL, sitemap, robots file, or Open Graph/Twitter card basics; project sections have no stable URLs or IDs.\
**Prevention strategy:** Use static generation/prerendering for the homepage and any project routes/anchors. Centralize metadata generation from typed content records. Add canonical URLs, route-specific titles/descriptions, Open Graph image metadata, sitemap, and robots output. In verification, inspect built HTML directly instead of trusting dev-server hydration.\
**Phase to address:** Phase 4, with Phase 6 validating built output.\
**Confidence:** HIGH, based on SolidStart static deployment docs and Google Search Central guidance.

### 6. Motion and Physics Undermine Accessibility or Performance

**What goes wrong:** Physics effects overpower the content, burn CPU/GPU on mobile, cause layout instability, or ignore reduced-motion preferences. A playful portfolio becomes harder to read and less accessible.\
**Warning signs:** Animation is required to reveal content; `prefers-reduced-motion` has no visible effect; pointer-only interactions block keyboard users; canvas/particle loops run while offscreen; mobile scroll stutters; text overlaps during animation; Core Web Vitals regress, especially INP or CLS.\
**Prevention strategy:** Build a motion controller early with reduced-motion, mobile, and low-power fallbacks. Keep motion decorative and non-essential. Use bounded particle counts, `requestAnimationFrame` cleanup, viewport pausing, and transform/opacity animations where possible. Add Playwright or browser checks for reduced motion, keyboard navigation, mobile screenshots, and production Lighthouse/PageSpeed-style metrics before release.\
**Phase to address:** Phase 5, with Phase 6 as a hard release gate.\
**Confidence:** HIGH, based on WCAG, MDN reduced-motion guidance, and web.dev Core Web Vitals docs.

### 7. Mystic UI GitHub Dependency Drift

**What goes wrong:** A floating GitHub dependency or unsupported import path makes builds non-reproducible. Mystic UI is source-shipped and its README defines a narrower supported consumer surface than the whole repository.\
**Warning signs:** Dependency uses `github:pRizz/mystic-ui` without a commit SHA; imports reach into workspace internals such as `@mystic-ui/tailwind`; Panda components are consumed from the package; Solid is below `1.9.8`; Tailwind/theme setup diverges from README; dark mode does not use the expected class-based mode.\
**Prevention strategy:** Pin Mystic UI to exact commit `d36017757708ed01ef2b3b47beb14f294726411c` unless deliberately refreshed. Use only the README-supported Vite + SolidJS + Tailwind surface: root exports, `mystic-ui/tailwind/setup`, `mystic-ui/tailwind/theme.css`, Solid `^1.9.8`, class-based dark mode, and the documented `skipLibCheck` compatibility setting. Add a small build smoke test that imports at least one Mystic component.\
**Phase to address:** Phase 1; revisit only in a deliberate dependency refresh task.\
**Confidence:** HIGH, based on Mystic UI README and current `git ls-remote` HEAD.

### 8. Mismatched Portfolio Audience and Narrative

**What goes wrong:** The site optimizes for a generic visual portfolio instead of explaining why Peter's AI, Bitcoin, open-source, decentralized tooling, and practical experiments matter to collaborators.\
**Warning signs:** First viewport does not say what Peter builds; projects are grouped only by technology; OpenLinks, Free The World, Win3Bitco.in/Open Bitcoin Web Miner, Open Bitcoin, opencode-cloud, and Zeckendorf are missing or buried; contact path is generic; OpenLinks is either absent or promoted so aggressively that it competes with the portfolio.\
**Prevention strategy:** Write an audience/narrative brief before layout work. Make the first screen identity-first, then use project tiers that answer "why this matters" for technical peers, OSS collaborators, and founder-adjacent builders. Place OpenLinks as a low-intrusion identity hub in footer/about/contact and metadata surfaces using the repo's OpenLinks guidance.\
**Phase to address:** Phase 4 before final UI composition; verify in Phase 6 with a narrative walkthrough.\
**Confidence:** MEDIUM, based on project requirements and Peter's current GitHub profile README.

## Moderate Pitfalls

### 9. Curated Data Becomes Stale

**What goes wrong:** Static curated records drift away from current project status, causing dead links, outdated screenshots, or old "current project" claims.\
**Warning signs:** No `lastReviewed` field; no owner for project copy; screenshots lack dates; build-time GitHub data updates but curated copy never does; featured projects still include paused work.\
**Prevention strategy:** Add `lastReviewed`, `sourceOfTruth`, and `reviewNotes` fields to curated project records. Build a report that flags featured projects not reviewed in the last 90 days, dead live URLs, and GitHub repos with large status changes. Keep the site static, but make freshness visible to maintainers.\
**Phase to address:** Phase 2 for schema; Phase 3 for reports; Phase 6 for release review.\
**Confidence:** MEDIUM.

### 10. GitHub Metrics Distort Project Value

**What goes wrong:** Stars, pushed dates, language percentages, or contribution graphs become the main ranking signal even when they do not match the portfolio story. Low-star but strategically important projects get buried.\
**Warning signs:** "Most starred" and "recently updated" sections dominate; inactive but important projects lack explanation; forks with recent updates appear above original work; language badges substitute for value propositions.\
**Prevention strategy:** Use editorial tiers first and metrics second. Present GitHub metadata as supporting proof, not ranking logic. Include short project copy explaining audience value, maturity, and collaboration status.\
**Phase to address:** Phase 2 and Phase 4.\
**Confidence:** MEDIUM.

### 11. Layout Instability From Dynamic Cards and Media

**What goes wrong:** Repo cards, badges, screenshots, or animated sections shift during load and damage perceived quality and CLS.\
**Warning signs:** Cards grow after language badges load; screenshots have no fixed dimensions; external badge images define layout; grid columns reflow during hydration; hover states resize cards.\
**Prevention strategy:** Define stable dimensions with `aspect-ratio`, fixed media slots, reserved badge rows, and bounded text lengths. Prefer local optimized screenshots over runtime external images for primary visuals. Verify desktop and mobile screenshots from production build.\
**Phase to address:** Phase 5; verify in Phase 6.\
**Confidence:** HIGH, based on web.dev CLS guidance and frontend layout standards.

### 12. Overbuilding a CMS, Backend, or Analytics Pipeline

**What goes wrong:** The project spends v1 complexity on admin UI, backend services, auth, or analytics instead of shipping a fast static portfolio.\
**Warning signs:** Database schema discussions before curated JSON/TS data exists; admin dashboard planned for one maintainer; runtime server required only to edit project copy; analytics events expand into product telemetry.\
**Prevention strategy:** Use typed data files and build-time validation for v1. Defer CMS/admin/backend work until a real maintenance pain appears after launch. Keep analytics out of v1 unless there is a specific, privacy-conscious question to answer.\
**Phase to address:** Phase 1 and Phase 2 scope guard; revisit only after launch.\
**Confidence:** HIGH, based on project out-of-scope requirements.

## Minor Pitfalls

### 13. Screenshots and External Assets Decay

**What goes wrong:** Project visuals break, become outdated, or rely on external services that change unexpectedly.\
**Warning signs:** Primary project media is hotlinked from GitHub raw URLs, badge services, or live apps; screenshots do not match current copy; missing alt text; dark-mode-only images appear invisible in some contexts.\
**Prevention strategy:** Store optimized local screenshots for primary project cards, with descriptive alt text and capture dates. Use external badges only as secondary decoration. Add a release checklist item to inspect visual assets in light/dark and mobile contexts.\
**Phase to address:** Phase 5 and Phase 6.\
**Confidence:** MEDIUM.

### 14. Tags and Taxonomy Become Too Clever

**What goes wrong:** The portfolio invents an over-complex taxonomy that visitors must learn before understanding the projects.\
**Warning signs:** Too many tags per card; internal process categories show up in the UI; filtering controls are more prominent than project explanations; users can hide all flagship projects accidentally.\
**Prevention strategy:** Keep public categories simple: flagship, active, experimental, archive/prototype if shown at all. Use richer internal metadata for curation and validation, not for every visible chip.\
**Phase to address:** Phase 2 and Phase 4.\
**Confidence:** MEDIUM.

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
| --- | --- | --- |
| Phase 1: Foundation | Floating Mystic UI dependency or wrong consumer setup | Pin exact commit, follow README-supported Tailwind surface, smoke-test imports |
| Phase 2: Content Model | GitHub mirror replaces curated portfolio | Require manual registry fields, validation, tiers, and explicit exclusion reasons |
| Phase 3: GitHub Data Pipeline | Runtime API dependency, pagination bugs, token leakage | Build-time ingestion only, private env vars, pagination tests, stale snapshot fallback |
| Phase 4: IA and SEO | Client-only content and generic metadata | Prerender key pages, typed metadata builder, sitemap/robots/canonical checks |
| Phase 5: UI and Motion | Motion harms accessibility/performance or layout stability | Reduced-motion provider, mobile caps, stable dimensions, non-essential animation |
| Phase 6: Release Verification | Local dev looks fine but production output is thin or broken | Inspect built HTML/assets, run accessibility/performance/SEO checks, test with GitHub unavailable |

## Recommended Roadmap Gates

- **Before UI build:** approve curated project registry shape and flagship project list.
- **Before GitHub automation:** prove every displayed project has human-authored copy and a curation reason.
- **Before motion polish:** implement reduced-motion behavior and mobile performance limits.
- **Before release:** inspect production HTML for meaningful content/metadata, verify no frontend token exposure, run link/media checks, and test the site with GitHub API unavailable.

## Sources

- Local project brief: `.planning/PROJECT.md` (HIGH)
- Local workflow rules: `AGENTS.md`, `AGENTS.bright-builds.md`, `standards-overrides.md`, Bright Builds standards index, architecture, verification, and TypeScript/JavaScript pages at commit `05f8d7a6c9c2e157ec4f922a05273e72dab97676` (HIGH)
- GitHub REST API rate limits: https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api (HIGH)
- GitHub REST repository/user endpoints and pagination behavior: https://docs.github.com/en/rest/repos/repos and https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api (HIGH)
- Observed current `pRizz` GitHub data via `https://api.github.com/users/pRizz` and `https://api.github.com/users/pRizz/repos?per_page=100&type=owner&sort=pushed&direction=desc` on 2026-05-24 (HIGH for counts at time of research)
- Mystic UI README and current HEAD: https://github.com/pRizz/mystic-ui/blob/main/README.md and `git ls-remote https://github.com/pRizz/mystic-ui.git HEAD` on 2026-05-24 (HIGH)
- Vite environment variables: https://vite.dev/guide/env-and-mode (HIGH)
- SolidStart static deployment/static output docs: https://docs.solidjs.com/solid-start/building-your-application/static-deployment (HIGH)
- Google Search Central JavaScript SEO and metadata guidance: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics and https://developers.google.com/search/docs/appearance/title-link (HIGH)
- WCAG 2.2 Understanding Animation from Interactions: https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html (HIGH)
- MDN `prefers-reduced-motion`: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion (HIGH)
- web.dev Core Web Vitals INP and CLS guidance: https://web.dev/articles/inp and https://web.dev/articles/cls (HIGH)
