# Phase 14: Writing Domain Foundation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-06-03T13:56:52.315Z
**Phase:** 14-Writing Domain Foundation
**Mode:** Yolo
**Areas discussed:** Writing Registry Shape, Public Eligibility and Paths, Body Content Model, Project Relationships, Validation and Tests

## Writing Registry Shape

| Option | Description | Selected |
| --- | --- | --- |
| Typed checked-in registry | Match the existing project domain model with authored TypeScript records and pure helpers. | yes |
| Markdown or MDX files | Add a content parser pipeline for authoring and route generation. | |
| External CMS/feed/runtime fetch | Pull writing from a remote content source or API. | |

**User's choice:** Typed checked-in registry.
**Notes:** Selected because v1.3 requirements explicitly exclude runtime APIs, CMS, MDX, and external content dependencies.

## Public Eligibility and Paths

| Option | Description | Selected |
| --- | --- | --- |
| Explicit public selectors and route helpers | Derive public entries and `/writing/{slug}` paths from eligibility helpers. | yes |
| Let route code filter raw records | Push publication filtering into UI or route modules. | |
| Expose every checked-in record | Treat hidden or draft entries as public because they are in source. | |

**User's choice:** Explicit public selectors and route helpers.
**Notes:** Keeps draft/hidden exclusion testable before route work exists.

## Body Content Model

| Option | Description | Selected |
| --- | --- | --- |
| Small typed block model | Store simple headings, paragraphs, lists, and links as typed data. | yes |
| Plain HTML strings | Store render-ready markup in data records. | |
| Generic publishing model | Design a broad blog engine before the first curated notes exist. | |

**User's choice:** Small typed block model.
**Notes:** Keeps Phase 14 focused on trusted data and avoids parser or CMS scope.

## Project Relationships

| Option | Description | Selected |
| --- | --- | --- |
| Writing owns related project slugs | Store cross-links on writing entries and derive project-side links later. | yes |
| Duplicate relationship arrays on projects | Store writing references on project records too. | |
| Allow any project slug | Permit references to public index anchors, hidden projects, or unsupported records. | |

**User's choice:** Writing owns related project slugs.
**Notes:** Selected project detail pages are the correct target because Phase 15 promises movement between notes and related project stories.

## Validation and Tests

| Option | Description | Selected |
| --- | --- | --- |
| Structured validation plus Vitest | Validate eligibility, slugs, required fields, paths, and related project integrity with focused unit tests. | yes |
| Rely on TypeScript only | Let type errors catch all invalid records. | |
| Defer validation to route rendering | Discover bad data when pages are built. | |

**User's choice:** Structured validation plus Vitest.
**Notes:** Follows existing project curation validation and Bright Builds testing expectations.

## the agent's Discretion

- Exact helper names and block type names may be chosen during planning/execution if they follow existing domain style.
- Seed entries may be minimal as long as they are authored, curated, and sufficient to test the model.

## Deferred Ideas

- Route UI, project-page related-writing UI, metadata, JSON-LD, sitemap behavior, browser checks, release docs, RSS, search, comments, newsletter, CMS/admin, MDX, and dynamic OG images.
