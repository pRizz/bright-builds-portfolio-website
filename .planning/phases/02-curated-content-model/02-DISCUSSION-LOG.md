# Phase 2: Curated Content Model - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-05-25T23:35:00.330Z
**Phase:** 2-Curated Content Model
**Mode:** Yolo
**Areas discussed:** Registry taxonomy and data shape, validation and invalid-state prevention,
initial curated project set, static GitHub boundary, OpenLinks identity presence

---

## Registry taxonomy and data shape

| Option | Description | Selected |
|--------|-------------|----------|
| Discriminated placement union in TypeScript | Makes invalid flagship states hard to express with no new dependency. | ✓ |
| Split registries by surface | Author-friendly, but risks duplicated fields and drift. | |
| Unified registry plus validation parser | Strong for future boundary parsing, but adds dependency surface now. | |
| Repo-signal-first catalog with curation overrides | Useful for audits, but pulls the model toward a GitHub mirror. | |

**User's choice:** Auto-selected the type-first discriminated/project-story model.
**Notes:** The existing repo already has pure TypeScript domain modules and Vitest coverage. The
selected approach keeps curation authoritative while allowing future advisory GitHub metadata.

---

## Validation and invalid-state prevention

| Option | Description | Selected |
|--------|-------------|----------|
| Type-first domain model plus pure validation report | Fits checked-in TS registry, emits structured errors/warnings, easy to test. | ✓ |
| Zod schema parser plus refinements | Better for untrusted JSON/snapshot inputs, but unnecessary for TS literals now. | |
| Vitest-only invariant suite | Smallest change, but no reusable validation report. | |
| Standalone content audit script | Good maintainer output, but should import shared pure logic to avoid duplication. | |

**User's choice:** Auto-selected pure validation functions plus Vitest coverage.
**Notes:** Hard curation errors should fail verification. Lower-tier review warnings may exist, but
flagship/home invalid states must block.

---

## Initial curated project set

| Option | Description | Selected |
|--------|-------------|----------|
| Flat curated project records | Minimal evolution, but weak for aliases and multi-repo stories. | |
| Project story records with source links | Supports aliases, repo families, and editorial flagship slots. | ✓ |
| Candidate review queue plus publishable registry | Makes review explicit, but adds another content state. | |
| Curated allowlist with static GitHub snapshot | Useful evidence, but pulls Phase 5 sync concerns forward. | |

**User's choice:** Auto-selected project story records with source links.
**Notes:** Public repo facts were checked with GitHub CLI for the named set. `open-links`,
`free-the-world`, `open-bitcoin-web-miner`, `opencode-cloud`, and `zeckendorf` are original public
repos; `mystic-ui` is a fork but strategically relevant. Win3Bitco.in / Open Bitcoin Web Miner
should be represented through the real `open-bitcoin-web-miner` source link.

---

## Static GitHub boundary

| Option | Description | Selected |
|--------|-------------|----------|
| Extend `verify:static` into a registry-to-HTML contract | Proves visitor-critical content appears in generated HTML. | ✓ |
| Add a source/runtime boundary guard | Blocks visitor-path GitHub API mechanisms while allowing normal links. | ✓ |
| Define optional metadata snapshot type only | Keeps Phase 5 clean, but does not prove rendering by itself. | |
| Playwright network-denial smoke test | Strong browser proof, but heavier than needed in Phase 2. | |

**User's choice:** Auto-selected layered static verification: HTML proof plus source/runtime guard.
**Notes:** Browser Playwright checks remain deferred until richer client behavior exists.

---

## OpenLinks identity presence

| Option | Description | Selected |
|--------|-------------|----------|
| Low-intrusion footer/about/profile/contact placement | Discoverable without displacing the host brand. | ✓ |
| Metadata-only identity hint | Useful but insufficient when visible placement is available. | |
| Prominent OpenLinks marketing placement | Too aggressive for this portfolio unless explicitly requested. | |

**User's choice:** Auto-selected subtle/standard OpenLinks placement.
**Notes:** Follow the OpenLinks guidance: visible link first, metadata second, avoid repetition, and
keep Bright Builds as the primary portfolio brand.

---

## the agent's Discretion

- Exact TypeScript file boundaries for the registry, selectors, validation helpers, and tests.
- Exact validation issue names and helper function names.
- Selected supporting experiments beyond the named project review set, provided they remain
  explicit and curated.

## Deferred Ideas

- Zod/schema parsing for non-TypeScript inputs.
- Optional GitHub metadata refresh and checked-in snapshots.
- Playwright network-denial tests.
- Project search/filtering.
- Per-project OG image generation and rich detail pages.
