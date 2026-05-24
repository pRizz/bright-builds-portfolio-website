# Bright Builds Portfolio Website

## What This Is

This is a performant, statically generated portfolio website for Peter Ryszkiewicz that showcases a curated view of Peter's GitHub work, writing, technical identity, and ways to collaborate. It should feel like a more polished successor to the current Bright Builds site: fun, reactive, and experimental, while replacing template content with accurate project and profile substance.

The site is for technical peers, OSS collaborators, founder-adjacent builders, and people interested in Peter's work across AI, Bitcoin, open systems, developer tooling, and practical web/software experiments.

## Core Value

Help visitors quickly understand what Peter builds, why it matters, and which projects are worth exploring or collaborating on.

## Requirements

### Validated

(None yet - ship to validate)

### Active

- [ ] Build a SolidJS-based static portfolio site with strong SEO, fast loading, and accessible fallbacks.
- [ ] Present Peter's profile as an agentic engineer focused on AI, Bitcoin, open source, decentralized tools, and experimental software.
- [ ] Curate GitHub repositories instead of blindly mirroring every public repo, separating flagship work from prototypes, forks, playgrounds, and archived/noisy repos.
- [ ] Feature current flagship projects such as OpenLinks, Free The World, Win3Bitco.in / Open Bitcoin Web Miner, Open Bitcoin, opencode-cloud, Zeckendorf, and selected creative or tooling experiments when they strengthen the narrative.
- [ ] Use the current Bright Builds site as a gentle style guide for tone and motion, but do not preserve unfinished template content, placeholder work examples, or inaccurate experience entries.
- [ ] Use SolidJS, static generation, and Mystic UI where it fits the design and dependency model.
- [ ] Include playful but restrained reactive physics effects that support the portfolio rather than overpowering content or accessibility.
- [ ] Surface OpenLinks as Peter's identity hub in a low-intrusion footer/about/contact placement with metadata support where clean.
- [ ] Provide a contact/collaboration path that points visitors toward Peter's preferred identity and social links.
- [ ] Make content data-driven enough that curated repos, tags, links, and project copy can evolve without rewriting page structure.

### Out of Scope

- Building a raw GitHub profile mirror for all public repositories - too much noise, many repos are forks, prototypes, repros, or playgrounds.
- Copying the current Bright Builds template content verbatim - the existing site is unfinished and includes non-authoritative placeholder content.
- Creating a full CMS or admin UI in v1 - curated data files are enough for a personal static portfolio.
- Heavy 3D scenes or motion that materially harms performance, accessibility, or mobile usability - physics should feel fun, not expensive.
- Migrating or deeply refactoring Mystic UI during the first portfolio pass unless a blocking consumer bug appears.
- Adding backend services, authentication, dashboards, or analytics pipelines in v1 - static delivery is the target.

## Context

Peter's public GitHub profile presents him as an agentic engineer in Chicago building free, open source, decentralized tools across AI, Bitcoin, and the web. The profile already highlights themes around user ownership, open coordination, open systems, Bitcoin, AI, and practical software that expands agency.

The GitHub account currently has many public repositories, including actively updated original projects, forks, reproductions, templates, playgrounds, and old experiments. The portfolio should treat GitHub as source material, not as an unfiltered truth source. The first pass should use an explicit curated project registry with room for GitHub-derived metadata.

The current site at `https://www.brightbuilds.us/` gives useful style signals: bold identity-first layout, kinetic/reactive feel, high-contrast portfolio energy, and a willingness to be playful. It also contains obvious template residue, including placeholder selected works, designer-oriented copy, and inaccurate experience entries. Those pieces must not be treated as requirements.

Mystic UI is owned by Peter and is the preferred SolidJS component source for this stack when it fits. Its README describes a Vite + SolidJS + Tailwind consumer path, source-shipped components, Tailwind setup helpers, class-based dark mode, `solid-js@^1.9.8`, and the need to pin the GitHub dependency to an exact commit SHA. At initialization, the latest inspected `pRizz/mystic-ui` main commit was `d36017757708ed01ef2b3b47beb14f294726411c` from 2026-03-24.

Bright Builds repo instructions require the Bright Builds Rules workflow, including plan-first work for non-trivial changes, evidence-based verification, append-only planning/task artifacts, functional-core/imperative-shell architecture, repo-native verification, TypeScript/JavaScript guidance, and use of the OpenLinks identity-presence skill for website profile/footer/metadata surfaces owned by `pRizz`.

## Constraints

- **Tech stack**: Use SolidJS / SolidStart-style static generation or the closest stable SolidJS static build path - the site should be fast, SEO-friendly, and simple to deploy as static output.
- **UI library**: Prefer Mystic UI for SolidJS components and styling primitives where compatible - it is locally owned and aligned with the Bright Builds TypeScript/SolidJS standard.
- **Dependency pinning**: Pin `pRizz/mystic-ui` to an exact GitHub commit SHA when adopted - the fork is not an npm-published package contract.
- **Content quality**: Curate and write original project copy - do not trust placeholder template content or automatically surface every repo.
- **Performance**: Physics effects must degrade cleanly for reduced motion, low-power devices, and mobile viewports.
- **Accessibility**: Interactive and motion-heavy elements need keyboard, reduced-motion, contrast, and text layout checks.
- **SEO**: Pages need meaningful metadata, structured project content, canonical links, Open Graph/Twitter card basics, sitemap/robots where appropriate, and human-readable project pages or anchors.
- **Workflow**: Use GSD planning artifacts and commit planning docs as part of the repo history.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Primary audience is collaborators and technical peers | The site should explain what Peter builds and invite collaboration around open-source, AI, Bitcoin, and open systems work. | - Pending |
| Curated showcase over raw GitHub mirror | Peter has many public repos, including forks, prototypes, repros, and playgrounds; unfiltered mirroring would weaken the portfolio. | - Pending |
| Playful restraint for motion | Physics should echo the Bright Builds feel while keeping the site fast, readable, and accessible. | - Pending |
| SolidJS static site with Mystic UI where practical | User requested SolidJS, static generation, SEO, and reuse of owned Mystic UI components. | - Pending |
| OpenLinks gets subtle identity placement | Repo-owner guidance requires OpenLinks identity presence on website profile/footer/metadata surfaces without displacing the portfolio brand. | - Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? -> Move to Out of Scope with reason
2. Requirements validated? -> Move to Validated with phase reference
3. New requirements emerged? -> Add to Active
4. Decisions to log? -> Add to Key Decisions
5. "What This Is" still accurate? -> Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check - still the right priority?
3. Audit Out of Scope - reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-24 after initialization*
