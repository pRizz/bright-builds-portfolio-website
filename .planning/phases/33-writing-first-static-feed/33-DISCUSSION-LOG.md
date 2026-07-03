# Phase 33: Writing-First Static Feed - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-03T14:09:00.956Z
**Phase:** 33-Writing-First Static Feed
**Mode:** Yolo
**Areas discussed:** Feed item model and eligibility, RSS serialization and escaping, static output and build integration, autodiscovery and visible links, verification strategy

## Feed Item Model and Eligibility

| Option | Description | Selected |
| --- | --- | --- |
| Public dated writing only | Use `publicWritingEntries()` and include only public entries with checked-in dates. | ✓ |
| Site activity feed | Include projects, themes, and invented updates. | |
| Raw writing registry mirror | Serialize every writing record and let downstream filters handle visibility. | |

**User's choice:** Public dated writing only (yolo recommended default).
**Notes:** This aligns with FEED-01 through FEED-03, the Phase 30 public reference contract, and the static-first scope guard.

## RSS Serialization and Escaping

| Option | Description | Selected |
| --- | --- | --- |
| Repo-owned pure RSS serializer | Add a small TypeScript serializer with explicit XML escaping and focused tests. | ✓ |
| External feed dependency | Add a package to serialize RSS. | |
| Route-owned XML strings | Build XML in route/head code. | |

**User's choice:** Repo-owned pure RSS serializer (yolo recommended default).
**Notes:** The current feed needs are narrow, and pure domain serialization keeps escaping, ordering, IDs, and dates easy to unit test.

## Static Output and Build Integration

| Option | Description | Selected |
| --- | --- | --- |
| Deterministic static generation with check mode | Generate `/feed.xml` from checked-in data and verify drift/output locally. | ✓ |
| Runtime endpoint | Serve feed XML through a dynamic route. | |
| Manual checked-in XML only | Hand-edit the feed file without generation checks. | |

**User's choice:** Deterministic static generation with check mode (yolo recommended default).
**Notes:** This preserves static deployment and keeps ordinary verification from mutating curated source data unexpectedly.

## Autodiscovery and Visible Links

| Option | Description | Selected |
| --- | --- | --- |
| Low-intrusion RSS affordance | Add head autodiscovery plus compact visible links on home and writing pages. | ✓ |
| Primary subscription CTA | Promote RSS as a main hero action. | |
| Hidden autodiscovery only | Add head metadata but no visible subscription path. | |

**User's choice:** Low-intrusion RSS affordance (yolo recommended default).
**Notes:** The feed should be discoverable for feed readers and humans without competing with Bright Builds, projects, writing, or OpenLinks placement.

## Verification Strategy

| Option | Description | Selected |
| --- | --- | --- |
| Layered focused plus aggregate verification | Test pure feed logic, verify built output/head metadata, then run `bun run verify`. | ✓ |
| Browser-only validation | Rely on page checks without asserting XML correctness. | |
| Manual feed reader checks as local gate | Require hosted/live feed-reader validation before local completion. | |

**User's choice:** Layered focused plus aggregate verification (yolo recommended default).
**Notes:** Hosted feed-reader checks remain manual smoke work for release readiness rather than a deterministic local gate.

## the agent's Discretion

- Exact helper/type names, feed title wording, and RSS channel copy.
- Whether generated `feed.xml` is checked in under `public/` or emitted by a build-adjacent script, provided check-mode verification prevents drift.
- Exact visible feed link placement after checking home and writing layout density.

## Deferred Ideas

- JSON Feed, Atom, topic-specific feeds, project/theme/site-update feeds, newsletter signup, WebSub, webmentions, comments, analytics, CMS/admin/editor workflows, and dynamic feed endpoints.
