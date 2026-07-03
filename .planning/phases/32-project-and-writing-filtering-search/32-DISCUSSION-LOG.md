# Phase 32: Project and Writing Filtering/Search - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-03T01:12:38.240Z
**Phase:** 32 - Project and Writing Filtering/Search
**Mode:** Yolo
**Areas discussed:** Deterministic search/filter model, Project index facets, Writing index facets, In-page control state, Verification strategy

## Deterministic Search/Filter Model

| Option | Description | Selected |
|--------|-------------|----------|
| Shared pure reference scorer over `PublicContentReference` | Reuses the Phase 30 public-only envelope, keeps one normalization/matching/scoring contract, and is easy to test without a new dependency. | yes |
| Separate project and writing filter helpers | Preserves current route data shapes, but risks duplicate normalization and scoring drift. | no |
| Search-document adapter layer | Adds explicit weighted search documents, but is more abstraction than the current corpus needs. | no |
| Pinned local fuzzy library | Supports fuzzy/prefix search, but adds dependency and bundle surface for behavior not required in this phase. | no |

**Yolo choice:** Shared pure reference scorer over `PublicContentReference`.
**Notes:** The recommendation preserves Phase 30 public eligibility and keeps route components from duplicating hidden-content guards.

## Project Index Facets

| Option | Description | Selected |
|--------|-------------|----------|
| Canonical topics plus tier/status/source facets, grouped cards | Maps to public project data, preserves existing sections and cards, and fully addresses FIND-01. | yes |
| Topic/search-first with metadata as searchable text | Low visual weight, but weaker for status/tier/source discovery. | no |
| Full metadata facet panel and flat results | Maximum slicing, but too noisy for the current visitor-facing index and loses current hierarchy. | no |

**Yolo choice:** Canonical topics plus visitor-friendly tier, status, and source facets while preserving grouped project cards.
**Notes:** `placement` remains presentation-only. Source labels need readable visitor copy rather than raw internal taxonomy.

## Writing Index Facets

| Option | Description | Selected |
|--------|-------------|----------|
| Faceted form above unchanged writing cards | Explicit kind/topic/tag/date filters, visible labels, counts, reset, and default static cards. | yes |
| Search-first compact chip toolbar | Compact, but weaker screen-reader grouping and less clear facet hierarchy. | no |
| Desktop facet rail with mobile disclosure | Scales for a much larger corpus, but is overbuilt for current writing volume. | no |

**Yolo choice:** Faceted form above unchanged writing cards.
**Notes:** Date labels should derive only from checked-in published/updated dates.

## In-Page Control State

| Option | Description | Selected |
|--------|-------------|----------|
| Hybrid native controls, in-memory state | SEO-safe, preserves static defaults, supports labels, counts, reset, empty state, keyboard, dark styling, and mobile wrapping. | yes |
| Toggle-chip toolbar, in-memory state | Visually compact, but creates more focus stops and ARIA/button-state work. | no |
| Hash-fragment state | Non-query bookmarkability, but adds parsing/history/scroll edge cases not required here. | no |
| Query-param faceted state | Durable sharing, but conflicts with FIND-05 and risks crawlable faceted URL explosion. | no |

**Yolo choice:** Hybrid native controls with in-memory state.
**Notes:** Result counts should be announced with a polite status pattern. Reset should be explicit.

## Verification Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Balanced layered split by assertion type | Pure model in Vitest, static HTML proof, Playwright interaction/a11y coverage, and aggregate `bun run verify`. | yes |
| Unit/static-first with narrow browser smoke | Fast, but under-proves FIND-04 until later phases. | no |
| Browser-release-heavy coverage | Strong user-path proof, but slower and harder to diagnose pure logic failures. | no |
| Add a Solid DOM component-test layer | Could focus route/control behavior, but adds tooling churn and does not replace browser layout/a11y checks. | no |

**Yolo choice:** Balanced layered split by assertion type.
**Notes:** 32-01 owns pure model tests, 32-02 owns project UI/static checks, and 32-03 owns writing UI plus browser coverage and final aggregate verification.

## the agent's Discretion

- Exact helper/module names.
- Exact score weights and facet label copy.
- Control primitive selection as long as labels, keyboard access, focus, dark readability, counts, reset, empty states, mobile wrapping, and no URL facet state are preserved.

## Deferred Ideas

- Query/hash/persistent filter sharing.
- Fuzzy search, autocomplete, hosted search, semantic search, or AI search.
- Feed output, related-work panels, social-preview assets, and milestone-wide release evidence work.
