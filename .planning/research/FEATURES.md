# Feature Landscape

**Domain:** Personal technical portfolio for curated GitHub work, writing, identity links, and a playful reactive experience\
**Project:** Bright Builds Portfolio Website\
**Researched:** 2026-05-24\
**Overall confidence:** MEDIUM-HIGH

## Research Basis

This feature research used the project brief, orchestrator-provided GitHub/profile scan, current portfolio guidance, GitHub repository/profile documentation, and Bright Builds/OpenLinks local rules.

Confidence is HIGH for GitHub metadata fields and curation mechanisms because GitHub docs verify repository/profile concepts. Confidence is MEDIUM for portfolio feature expectations because current third-party portfolio guidance agrees on the broad pattern but is not canonical.

## Table Stakes

Features visitors expect. Missing = the site feels unfinished or fails its core job.

| Feature | Why Expected | Complexity | Notes |
| --- | --- | --- | --- |
| Identity-first hero and positioning | Visitors should immediately understand who Peter is, what he builds, and why they should keep reading. | Low | Use specific positioning: agentic engineer building open systems across AI, Bitcoin, developer tooling, and practical web software. Avoid generic "full-stack developer" copy. |
| Curated flagship projects | The project brief explicitly rejects a raw GitHub mirror, and current portfolio guidance favors a small set of strong projects over large grids. | Medium | Home page should show roughly 4-6 flagship items, not 256 public repos. Each card needs a one-liner, theme, maturity/status, primary links, and why it matters. |
| Project story/detail surface | Flagship projects need context beyond repo stats. | Medium | Each flagship should support problem, approach, hard/interesting part, Peter's role, status, results/traction when known, GitHub link, live/demo link, and related writing. Can be full pages or strong anchors in v1. |
| Explicit repo curation registry | GitHub is source material, not the source of truth. | Medium | Use a local data file with manual curation fields. GitHub API data can hydrate stats, but manual `curationTier`, `sourceType`, and `flagshipEligible` should decide placement. |
| GitHub-derived metadata with last-updated signal | Visitors expect proof that work is real and current, but stale or noisy data can hurt trust. | Medium | Pull or snapshot stars, forks, primary language, topics, pushed date, archived/fork/template flags, and README/demo availability for curated repos only. Show "last verified" if data is not live. |
| Writing/notes section | Writing demonstrates technical judgment and makes the site more than a visual repo index. | Low-Medium | Include curated posts, essays, proposals, or repo-backed docs. Prioritize writing tied to OpenLinks, Bitcoin/open systems, AI agents, tooling opinions, and postmortem-style project notes. |
| Contact and identity links | A portfolio must provide a collaboration path. | Low | Include GitHub and preferred identity/social/contact links. OpenLinks should be a subtle footer/about/contact identity hub, not the primary brand. |
| About/themes section | Visitors need a compact narrative that connects the projects. | Low | Organize expertise by domains: AI/agents, Bitcoin/decentralized systems, open web/tools, creative experiments. Avoid fake skill percentages. |
| SEO/social metadata basics | The site should be statically discoverable and shareable. | Medium | Per-page title/description, canonical URL, Open Graph/Twitter card fields, sitemap/robots, meaningful headings, image alt text, and project-specific metadata. |
| Accessibility and reduced-motion support | Motion-heavy portfolios are common failure points. | Medium | All content must be readable without animation. Physics effects need reduced-motion fallback, keyboard-safe interactions, contrast checks, and no text occlusion. |
| Responsive performance | Technical peers will judge implementation quality. | Medium | Fast static delivery, optimized assets, no heavy 3D by default, stable mobile layout, lazy-loaded non-critical media, and no blocking GitHub calls at runtime for core content. |

## Differentiators

Features that are not required, but fit this portfolio and can make it memorable.

| Feature | Value Proposition | Complexity | Notes |
| --- | --- | --- | --- |
| Playful reactive physics layer | Carries over the current Bright Builds kinetic feel while signaling taste and technical range. | Medium-High | Use restrained interactions around project chips, background particles, or hover/touch responses. Must degrade cleanly and never compete with reading. |
| Project constellation by theme | Helps visitors explore breadth without turning the home page into a repo dump. | Medium | Map curated work across themes like AI, Bitcoin, open systems, web, tooling, and creative experiments. Useful as an index/filter layer after flagship cards. |
| "Now building" collaboration module | Makes the portfolio feel alive and points collaborators toward current work. | Low-Medium | Small section for current active bets: OpenLinks, Free The World, Win3Bitco.in/Open Bitcoin Web Miner, Open Bitcoin, opencode-cloud. Include collaboration asks only when real. |
| Curation transparency badges | Builds trust by labeling work honestly. | Low-Medium | Badges like `Flagship`, `Active`, `Prototype`, `Experiment`, `Fork contribution`, `Archived`, `Writing`, `Tooling opinion`. These should come from schema fields, not ad hoc labels. |
| Tiny experiments lab | Preserves playful breadth without weakening the flagship narrative. | Medium | Separate lane for small demos, creative tools, old experiments, and prototypes. Never mix with flagship work. |
| Opinionated `/uses` or tooling page | Technical peers often value concrete tool opinions. | Low | `my-tooling-opinions` can become a supporting content surface if copy is current and concise. |
| OpenLinks identity metadata | Reinforces Peter's identity hub and owned open-web theme. | Low | Add visible footer/about link first. Add `rel="me"` and JSON-LD only if the implementation already has clean head metadata support. |
| Project lineage/related-work links | Explains groups of repos without overpromoting every subrepo. | Medium | Example: treat `zeckendorf`, `zeckendorf-webapp`, and `zeckendorf-spiral` as related artifacts under one story rather than three competing flagship cards. |

## Anti-Features

Features to explicitly not build.

| Anti-Feature | Why Avoid | What to Do Instead |
| --- | --- | --- |
| Raw public GitHub mirror | 256 public repos include forks, repros, playgrounds, generated/support repos, and prototypes. A mirror dilutes trust. | Use a curated registry and an optional secondary project index. Default unclassified repos to hidden. |
| Star-count or recency-only ranking | Stars and pushed dates are useful signals but do not equal portfolio relevance. | Rank manually with `displayOrder`, `curationTier`, and narrative fit. Show stats as supporting metadata. |
| Forks as flagship work | Forks usually communicate upstream interest, not original work, unless there is a substantial maintained derivative. | Exclude forks from flagship by default. Allow only with explicit `forkShowcaseReason` and copy that explains Peter's contribution. |
| Repros/playgrounds/prototypes in flagship slots | These are valuable engineering artifacts but weak first impressions. | Put them in `experiment`, `lab`, or `excluded` tiers with honest labels. |
| Generated stats/profile/support repos as projects | They are infrastructure for profile presentation, not portfolio evidence. | Keep hidden or mention only in implementation notes if relevant. |
| Placeholder/coming-soon/template content | Current Bright Builds site has template residue; repeating that would undermine credibility. | Hide unready sections. Ship fewer complete sections. |
| Skill bars and giant tech-logo walls | They add fake precision and visual noise. | Use domain clusters and let projects prove the stack. |
| Heavy 3D or motion-first layout | It risks performance, accessibility, and content clarity. | Use small, optional reactive flourishes with reduced-motion fallbacks. |
| Overprominent OpenLinks promotion | The portfolio brand should remain Bright Builds/Peter. | Place OpenLinks as a subtle identity hub in footer/about/contact and metadata. |
| Auto-generated project copy without review | README/API descriptions may be stale, vague, or misleading. | Use manually written one-liners and project stories; GitHub descriptions are hints only. |

## Repo Curation Rules

These rules should become data/schema and rendering logic.

### Core Rule

Manual curation is authoritative. GitHub metadata is evidence used to warn, hydrate, and audit, not to decide flagship placement by itself.

### Flagship Eligibility

A repo can be `flagship` only when all are true:

| Rule | Schema Field(s) |
| --- | --- |
| It is original work, or a fork with substantial explained original contribution. | `sourceType`, `flagshipEligible`, `forkShowcaseReason` |
| It supports the target narrative: AI agents, Bitcoin/open systems, open web, developer tooling, or practical experiments. | `themes`, `audience`, `narrativeFit` |
| It has a clear visitor-facing explanation. | `oneLine`, `problem`, `interestingPart`, `role`, `status` |
| It has enough proof to inspect. | `repoUrl`, `demoUrl`, `caseStudyUrl`, `readmeQuality`, `hasRunnableDemo` |
| It is not obviously stale unless historical status is intentional. | `maturity`, `lastMeaningfulUpdate`, `statusNote` |
| It is explicitly ordered into the home surface. | `curationTier`, `includeInHome`, `displayOrder` |

### Default Exclusion Rules

Default to `excluded` or `lab` unless manually promoted.

| Signal | Default Handling | Schema Field(s) |
| --- | --- | --- |
| `fork: true` / `isFork: true` | Exclude from flagship. Allow supporting mention only with explicit contribution note. | `repoSignals.isFork`, `sourceType`, `forkShowcaseReason` |
| `archived: true` / `isArchived: true` | Exclude from home unless included as historical work. | `repoSignals.isArchived`, `maturity`, `statusNote` |
| `is_template: true` / `isTemplate: true` | Exclude from flagship unless the template itself is a product. | `repoSignals.isTemplate`, `sourceType` |
| Name contains `repro`, `playground`, `sandbox`, `test`, `demo`, `alpha`, `template`, `stats` | Route to `lab` or `excluded` until manually reviewed. | `nameSignals`, `curationTier`, `exclusionReason` |
| Generated/profile/support repo | Exclude from project lists. | `sourceType: "generated" | "profile" | "support"` |
| No useful README, demo, or one-line explanation | Do not surface as flagship. | `readmeQuality`, `oneLine`, `hasRunnableDemo` |
| Activity only from dependency updates or fork syncs | Do not treat as active original work. | `activityMeaning`, `lastMeaningfulUpdate` |

### Recommended Project Schema Fields

```ts
type ProjectCurationTier =
  | "flagship"
  | "supporting"
  | "experiment"
  | "writing"
  | "archive"
  | "excluded";

type ProjectSourceType =
  | "original"
  | "fork"
  | "contribution"
  | "generated"
  | "profile"
  | "support"
  | "repro"
  | "playground"
  | "prototype";

type CuratedProject = {
  id: string;
  title: string;
  repoName?: string;
  repoUrl?: string;
  demoUrl?: string;
  caseStudyUrl?: string;
  curationTier: ProjectCurationTier;
  sourceType: ProjectSourceType;
  flagshipEligible: boolean;
  includeInHome: boolean;
  includeInIndex: boolean;
  displayOrder?: number;
  themes: string[];
  tags: string[];
  audience: string[];
  oneLine: string;
  problem?: string;
  interestingPart?: string;
  result?: string;
  role: "owner" | "maintainer" | "contributor" | "fork-maintainer";
  maturity: "active" | "usable" | "prototype" | "repro" | "playground" | "archived";
  statusNote?: string;
  forkShowcaseReason?: string;
  exclusionReason?: string;
  readmeQuality: "strong" | "adequate" | "thin" | "missing";
  hasRunnableDemo: boolean;
  repoSignals?: {
    isFork: boolean;
    isArchived: boolean;
    isTemplate: boolean;
    isMirror?: boolean;
    isDisabled?: boolean;
    stars: number;
    forks: number;
    primaryLanguage?: string;
    topics: string[];
    pushedAt?: string;
    createdAt?: string;
    license?: string;
  };
};
```

## Candidate Tiers

Initial tiers based on project brief and orchestrator-provided GitHub/profile scan. Treat this as a starting registry draft, not a final truth source.

### Tier 1: Flagship Candidates

These should get the strongest copy review first.

| Candidate | Why | Curation Notes |
| --- | --- | --- |
| `open-links` | Directly supports identity/open-web theme and OpenLinks placement. | Likely flagship. Needs crisp product story and preferred identity URL. |
| `free-the-world` | Aligns with decentralized/open systems narrative. | Likely flagship if repo has enough inspectable substance. |
| `open-bitcoin-web-miner` / Win3Bitco.in | Strong Bitcoin + experimental web hook. | Likely flagship; explain practical status and constraints honestly. |
| `open-bitcoin` | Matches stated roadmap and Bitcoin/open systems theme. | Flagship only if current enough; otherwise "now building" or roadmap item. |
| `opencode-cloud` | Agentic/devtooling relevance. | Likely flagship/supporting depending maturity and demo/readme quality. |
| `zeckendorf` | Distinct math/Bitcoin-adjacent or technical-depth story. | Prefer one flagship story with related subprojects rather than many cards. |

### Tier 2: Supporting Proof

Good secondary project index or related-work material after review.

| Candidate | Why | Curation Notes |
| --- | --- | --- |
| `zeckendorf-webapp`, `zeckendorf-spiral` | Related artifacts around `zeckendorf`. | Attach to the main Zeckendorf story. |
| `mystic-ui` | Owned SolidJS component library aligned with this site's stack. | Supporting/tooling proof; avoid making the portfolio about the UI library unless it is polished. |
| `SVG-Navigator---Chrome-Extension` | Browser/tooling experiment with concrete utility. | Supporting or experiment depending quality/current install path. |
| `nanocurrency-node` | Shows protocol/open-source depth. | Supporting if original/substantial; otherwise archive. |
| `top-revenue-per-employee` | Data/product analysis angle. | Supporting content or writing, not flagship unless it has strong narrative. |
| `free-open-distilled-models` | AI/open models theme. | Supporting if maintained and clearly scoped. |
| `open-emoji-picker`, `av-denoiser`, `broadcast` | Practical small tools. | Good lab/supporting items with concise descriptions. |
| `bitcoin-bond-proposal`, `simple-market-maker` | Bitcoin/finance experiments. | Supporting/writing if they are proposals or prototypes. Label maturity clearly. |
| `my-tooling-opinions` | Writing/opinion surface. | Better as `/uses` or writing item than project card. |

### Tier 3: Lab / Experiments

Use for playful breadth with honest labels:

- Small demos, one-off tools, visual experiments, old prototypes, and learning artifacts.
- Include only 3-5 at a time.
- Each needs a one-sentence description and a visible `Experiment` or `Prototype` label.
- No experiment should appear before flagship work.

### Excluded by Default

| Category | Examples | Reason |
| --- | --- | --- |
| Forks | `OrcaSlicer`, `hermes-agent`, `liquid-dom`, `cadquery`, `build123d`, `vlc`, `ublock`, `go2rtc`, `solid-start` | Useful GitHub activity, weak flagship signal unless substantial original fork work is documented. |
| Repros/playgrounds | `solid-start-alpha-kobalte-hydration-repro`, `solid-start-dev-overlay-sourcemap-repro`, `animated-svg-playground` | Useful debugging artifacts but not front-page proof. |
| Generated/profile/support | `github-stats`, `pRizz`, `open-links-sites` | Site/profile infrastructure, not portfolio projects. |

## Feature Dependencies

```text
Curated project registry -> Flagship cards
Curated project registry -> Project detail/case study pages
Curated project registry -> Project constellation/filter index
GitHub metadata adapter -> Repo warning flags -> Curation audit
Manual project copy -> SEO/social metadata -> Shareable project pages
Identity link registry -> Contact section -> Footer/OpenLinks metadata
Motion preference detection -> Reactive physics layer
Writing registry -> Writing section -> Related project links
```

## MVP Recommendation

Prioritize:

1. Identity-first home page with clear positioning and collaboration/contact paths.
1. Curated flagship registry with 4-6 projects and hard exclusion defaults for forks, repros, playgrounds, generated repos, and prototypes.
1. Project cards plus lightweight detail sections using manually written problem/approach/role/status copy.
1. Footer/about/contact identity links with subtle OpenLinks placement.
1. Reduced-motion-safe reactive flourish that supports the brand without blocking content.

Defer:

- Full live GitHub sync: start with a static/snapshotted metadata file so runtime performance and curation quality stay predictable.
- Large project index: add after flagship taxonomy is trusted.
- Full CMS/admin: curated data files are enough for v1.
- Heavy 3D scenes: not worth the accessibility/performance tradeoff for the first pass.

## Phase Notes

| Phase Topic | Feature Risk | Recommendation |
| --- | --- | --- |
| Data model | Invalid curation states can leak noisy repos into the home page. | Make `curationTier`, `sourceType`, `flagshipEligible`, and `includeInHome` explicit. Default unclassified repos to excluded. |
| Content writing | Auto-derived copy can sound generic or stale. | Require manual one-liners and problem/approach/status fields for flagship work. |
| GitHub integration | Live API dependencies can slow or break a static portfolio. | Build static first; hydrate/snapshot metadata during build only if needed. |
| Motion design | Playful effects can overpower the portfolio. | Gate by reduced-motion preference and keep all content usable without animation. |
| Identity/contact | OpenLinks can distract if promoted too aggressively. | Use footer/about/contact placement and optional metadata, following the low-intrusion OpenLinks skill. |

## Sources

- HIGH: Project brief in `.planning/PROJECT.md` and orchestrator-provided GitHub/profile scan, 2026-05-24.
- HIGH: GitHub Docs, "About your profile" - profile README, personal info, contribution activity, pinned items, and public profile elements. https://docs.github.com/en/account-and-profile/concepts/personal-profile
- HIGH: GitHub Docs, "REST API endpoints for repositories" - repository fields include `fork`, `is_template`, `topics`, `archived`, `pushed_at`, stars/forks, homepage, language, and visibility. https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28
- HIGH: GitHub Docs, "Searching for repositories" - repository search qualifiers include `fork`, `pushed`, `topic`, `template`, `archived`, and owner/user filters. https://docs.github.com/en/search-github/searching-on-github/searching-for-repositories
- HIGH: GitHub Docs, "Classifying your repository with topics" - topics classify repository purpose, subject area, community, and language. https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics
- HIGH: GitHub Docs, "About READMEs" - READMEs should explain what a project does, why it is useful, how to get started, where to get help, and who maintains it. https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes
- HIGH: Local OpenLinks identity-presence skill - recommends low-intrusion footer/about/profile placement, visible link first, optional `rel="me"`/JSON-LD where clean.
- MEDIUM: ShowProof, "What to Include in a Developer Portfolio: The 2026 Checklist" - clear positioning, contact path, live/current GitHub signals, at least one deep project case study, and ruthless curation. https://showproof.io/guides/what-to-include-in-developer-portfolio/
- MEDIUM: ShowProof, "Developer Portfolio: The Complete Guide (2026)" - favors three to four featured projects with case studies, live/demo and GitHub links, and no oversized project grid. https://showproof.io/guides/developer-portfolio/
- MEDIUM: CalmOps, "Portfolio Website Best Practices: Complete Guide for Developers in 2026" - common sections include hero, about, projects, skills, contact, SEO, accessibility, and concise project selection. https://calmops.com/content-creation/portfolio-website-complete-guide-2026/
