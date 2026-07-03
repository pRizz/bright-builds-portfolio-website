---
generated_by: gsd-phase-researcher
lifecycle_mode: yolo
phase_lifecycle_id: 33-2026-07-03T14-09-00
generated_at: 2026-07-03T14:28:00.000Z
---

# Phase 33: Writing-First Static Feed - Research

**Researched:** 2026-07-03 [VERIFIED: system current date]
**Domain:** Static RSS 2.0 feed generation, SolidStart static assets, feed autodiscovery, deterministic content verification [VERIFIED: `.planning/ROADMAP.md`] [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`]
**Confidence:** HIGH [VERIFIED: local code inspection] [CITED: https://www.rssboard.org/rss-specification] [CITED: https://docs.solidjs.com/solid-start/building-your-application/static-assets]

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions

Source for this subsection: [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`]

#### Feed Item Model and Eligibility

- **D-01:** Build a small pure feed item model from `publicWritingEntries()` instead of generating feed XML directly from route components or raw curated registries.
- **D-02:** The v1 feed is writing-first only. Include public writing entries with checked-in `maybePublishedOn` or `maybeUpdatedOn`; exclude draft, hidden, archived, undated, unsupported, project-only, theme-only, and invented update records.
- **D-03:** Stable feed IDs should derive from the canonical absolute writing URL or a deterministic tag-style identifier tied to the canonical writing path. Do not use timestamps, build times, array indexes, or generated asset fingerprints as feed IDs.
- **D-04:** Feed ordering should be deterministic by checked-in published/updated date descending, with `displayOrder` and slug as stable tie breakers if needed.
- **D-05:** Feed categories should use safe public labels from writing topics/tags after the canonical topic contract has filtered public eligibility. Do not expose hidden or unsupported discovery labels through feed categories.

#### RSS Serialization and Escaping

- **D-06:** Add a repo-owned RSS 2.0 serializer as pure TypeScript, likely in a new `src/domain/feed.ts`, with explicit XML escaping for titles, summaries, links, categories, IDs, and descriptions.
- **D-07:** Feed-level metadata should use the existing profile/site identity: Bright Builds/Peter Ryszkiewicz, the canonical origin from `peterProfile`, a concise writing-focused description, and the canonical feed URL.
- **D-08:** Feed item descriptions should use existing writing summaries by default. Do not serialize full article bodies in v1 unless planning finds that it is trivial and does not bloat or complicate escaping.
- **D-09:** Date output should be derived from checked-in ISO dates and serialized in a feed-reader-compatible UTC format. Invalid dates should fail curation or focused feed tests before static output generation.
- **D-10:** Keep feed generation deterministic and side-effect free at the domain layer; filesystem writes belong in a thin static-output script/build hook.

#### Static Output and Build Integration

- **D-11:** Emit `/feed.xml` as a static asset in the built output without adding a runtime endpoint. The implementation can generate `public/feed.xml` before build or copy generated XML into `.output/public/feed.xml`, but the source of truth should remain checked-in writing data and pure helper output.
- **D-12:** Ordinary build or verification should not mutate curated source data. If a generated `public/feed.xml` file is checked in, provide a check mode that fails on drift rather than silently rewriting during verification.
- **D-13:** Extend static verification to assert that `.output/public/feed.xml` exists, is non-empty, includes only public dated writing entries, includes absolute canonical links, and excludes draft/hidden/archived/undated fixtures.
- **D-14:** Extend release verification only as far as needed to prove the local static feed output and absence of runtime feed/content dependencies. Hosted feed-reader validation remains manual smoke work for Phase 36/release docs.

#### Autodiscovery and Visible Links

- **D-15:** Add `<link rel="alternate" type="application/rss+xml" ...>` feed autodiscovery metadata to home and writing pages using the shared head pattern where practical.
- **D-16:** Add visible low-intrusion feed links on home and writing surfaces. Prefer compact text/icon link placement near existing page intro, footer-adjacent discovery copy, or writing controls rather than a primary CTA.
- **D-17:** Feed links should keep Bright Builds/projects/writing navigation primary and preserve existing low-intrusion OpenLinks placement. Do not make OpenLinks or feed subscription compete with the main project/story CTAs.
- **D-18:** The visible feed link should use ordinary anchor semantics, dark-primary focus/readability, and mobile-safe wrapping. No custom subscription modal or JavaScript-only interaction is in scope.

#### Verification Strategy

- **D-19:** Plan 33-01 should focus on pure feed item derivation, RSS serialization, XML escaping, ordering, eligibility, date handling, and unit tests.
- **D-20:** Plan 33-02 should wire static `/feed.xml` output, home/writing autodiscovery metadata, visible feed links, static verification, and any focused browser/static checks needed for dark/mobile/readability.
- **D-21:** Add focused Vitest coverage for feed eligibility, ordering, stable IDs, escaping, categories, absolute URLs, and exclusion of non-public or undated entries.
- **D-22:** Run the repo-owned aggregate verification after implementation: `bun run verify`. Use narrower scripts during development where useful, but do not mark the phase passed until aggregate verification is clean.

### the agent's Discretion

Source for this subsection: [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`]

- Exact type names, helper names, RSS channel copy, feed title wording, and whether generated `feed.xml` is checked in under `public/` or emitted by a build-adjacent script are delegated to implementation as long as deterministic static output and check-mode verification are preserved.
- The planner may decide whether feed metadata lives in `src/domain/feed.ts` or a narrower module next to SEO helpers, provided the route/UI layer does not own feed serialization logic.
- The planner may decide the smallest practical visible feed-link placement on home and writing pages after checking existing layout density and dark/mobile wrapping.

### Deferred Ideas (OUT OF SCOPE)

Source for this subsection: [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`]

- JSON Feed, Atom, topic-specific feeds, and project/theme/site-update feeds belong to future work after the writing-first feed proves useful.
- Newsletter signup, WebSub, webmentions, comments, analytics, CMS/admin/editor workflows, and dynamic feed endpoints remain out of scope for v1.6.
- Related-work ranking and panels belong to Phase 34.
- Generic and topic social preview assets belong to Phase 35.
- Milestone-wide release evidence expansion, hosted feed-reader smoke labels, and final release-readiness wording belong to Phase 36.

</user_constraints>

## Project Constraints (from AGENTS.md)

- Use `AGENTS.md` as the repo-local instruction entrypoint, then read `AGENTS.bright-builds.md`, `standards-overrides.md`, and task-relevant managed standards before plan/research/implementation work. [VERIFIED: `AGENTS.md`] [VERIFIED: `AGENTS.bright-builds.md`]
- The portfolio is dark-primary; UI changes require desktop and mobile dark rendering, contrast/readability, and text-overlap checks. [VERIFIED: `AGENTS.md`]
- Keep new user-facing UI dark-first and avoid light-first utility classes unless there is a local reason. [VERIFIED: `AGENTS.md`] [VERIFIED: `standards/core/frontend-ui.md`]
- Keep business logic in pure data-in/data-out TypeScript helpers, with filesystem/build effects isolated in thin scripts. [VERIFIED: `standards/core/architecture.md`] [VERIFIED: `standards/languages/typescript-javascript.md`]
- Use shallow control flow and `maybe...` naming for nullable internal values. [VERIFIED: `standards/core/code-shape.md`] [VERIFIED: `standards/languages/typescript-javascript.md`]
- Unit tests for pure business logic are mandatory, should test one concern, and should use clear Arrange/Act/Assert structure when non-trivial. [VERIFIED: `standards/core/testing.md`]
- Use Bun/repo-owned scripts for TypeScript automation and do not add new Python scripts to this Bun-friendly TypeScript repo. [VERIFIED: `standards/languages/typescript-javascript.md`] [VERIFIED: `package.json`]
- Prefer repo-owned verification entrypoints and run relevant checks before committing. [VERIFIED: `standards/core/verification.md`] [VERIFIED: `package.json`]
- Keep OpenLinks visible but low-intrusion; do not let feed subscription or OpenLinks compete with Bright Builds, projects, writing, or collaboration CTAs. [VERIFIED: `AGENTS.bright-builds.md`] [VERIFIED: `/Users/peterryszkiewicz/.codex/skills/openlinks-identity-presence/SKILL.md`] [VERIFIED: `src/components/SiteLayout.tsx`]
- GSD planning docs should be written and committed when `commit_docs` is enabled. [VERIFIED: `AGENTS.md`] [VERIFIED: `.planning/config.json`] [VERIFIED: gsd init phase-op 33]
- No project-local skills exist under `.claude/skills` or `.agents/skills`. [VERIFIED: `find .claude/skills .agents/skills -maxdepth 2 -type f -name SKILL.md`]
- `standards-overrides.md` contains no active local exception for this phase beyond placeholder rows. [VERIFIED: `standards-overrides.md`]

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FEED-01 | Visitor or feed reader can subscribe to a valid static writing-first feed at `/feed.xml`. [VERIFIED: `.planning/REQUIREMENTS.md`] | Generate RSS 2.0 XML from pure helpers, publish it as `public/feed.xml`, and assert `.output/public/feed.xml` after `bun run build`. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`] [CITED: https://docs.solidjs.com/solid-start/building-your-application/static-assets] |
| FEED-02 | Feed entries use stable canonical IDs, absolute links, checked-in dates, public categories, summaries, and deterministic ordering. [VERIFIED: `.planning/REQUIREMENTS.md`] | Derive item IDs/links from `peterProfile.canonicalOrigin` plus `writingDetailPath()`, dates from checked-in `maybePublishedOn`/`maybeUpdatedOn`, summaries from writing entries, and categories from canonical public topic labels. [VERIFIED: `src/domain/profile.ts`] [VERIFIED: `src/domain/writing.ts`] [VERIFIED: `src/domain/topics.ts`] |
| FEED-03 | Feed generation excludes draft, hidden, archived, undated, unsupported, or invented project/theme update records. [VERIFIED: `.planning/REQUIREMENTS.md`] | Start from `publicWritingEntries()` and add a feed-date guard; do not consume project/theme registries as feed item sources. [VERIFIED: `src/domain/writing.ts`] [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`] |
| FEED-04 | Home and writing surfaces expose feed autodiscovery metadata and a visible low-intrusion feed link. [VERIFIED: `.planning/REQUIREMENTS.md`] | Add one RSS autodiscovery `<link>` in page heads and compact ordinary anchors on `/` and `/writing`. [CITED: https://www.rssboard.org/rss-autodiscovery] [VERIFIED: `src/routes/index.tsx`] [VERIFIED: `src/routes/writing/index.tsx`] |
| FEED-05 | Feed generation is deterministic, local, and does not mutate source data unexpectedly during ordinary build or verification. [VERIFIED: `.planning/REQUIREMENTS.md`] | Keep XML generation pure, use a separate generation script for `public/feed.xml`, and add check mode to fail on drift before build/static verification. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`] [VERIFIED: `scripts/generate-static-metadata.ts`] |

</phase_requirements>

## Summary

Phase 33 should be planned as two narrow changes: first add a pure `src/domain/feed.ts` helper surface with feed item derivation, XML escaping, RSS 2.0 serialization, stable IDs, date handling, category filtering, and Vitest coverage; then add static output and UI/head wiring through a thin script, `public/feed.xml`, home/writing autodiscovery links, visible feed anchors, and static/release/browser verification. [VERIFIED: `.planning/ROADMAP.md`] [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`] [VERIFIED: `src/domain/writing.ts`] [VERIFIED: `scripts/verify-static/run-static-verification.ts`]

The repo already has the important primitives: public writing selectors, canonical writing paths, canonical origin/profile data, canonical public topic/reference helpers, Solid Meta head management, static public assets, and static output verification over `.output/public`. [VERIFIED: `src/domain/writing.ts`] [VERIFIED: `src/domain/profile.ts`] [VERIFIED: `src/domain/topics.ts`] [VERIFIED: `src/components/RouteHead.tsx`] [VERIFIED: `src/app.tsx`] [VERIFIED: `scripts/verify-static/output.ts`]

**Primary recommendation:** Generate a checked-in `public/feed.xml` from a pure `rssFeedXml()` helper using a `scripts/generate-feed.ts` script with `--check`, add `verify:feed` before `bun run build` in `bun run verify`, and make `verify:static` prove `.output/public/feed.xml` exactly matches helper output after build. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`] [CITED: https://docs.solidjs.com/solid-start/building-your-application/static-assets] [VERIFIED: `package.json`]

## Standard Stack

### Core

| Library / Surface | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| RSS 2.0 | Current RSS Board spec is version 2.0.11, published 2009-03-30. [CITED: https://www.rssboard.org/rss-specification] | Feed XML format for `/feed.xml`. [VERIFIED: `.planning/REQUIREMENTS.md`] | RSS 2.0 is the locked v1 feed format and supports `channel`, `item`, `category`, `pubDate`, and `guid`. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`] [CITED: https://www.rssboard.org/rss-specification] |
| XML 1.0 | Fifth Edition W3C Recommendation. [CITED: https://www.w3.org/TR/xml/] | Well-formed document rules and escaping context for RSS. [CITED: https://www.rssboard.org/rss-specification] | RSS 2.0 documents must conform to XML 1.0, so feed text must be XML-escaped at serialization. [CITED: https://www.rssboard.org/rss-specification] [CITED: https://www.w3.org/TR/xml/] |
| `src/domain/feed.ts` | New repo-owned TypeScript module. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`] | Feed item model, eligibility, date normalization, categories, XML escaping, and RSS serialization. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`] | Bright Builds standards require pure functional core logic, and context locks feed serialization out of route components. [VERIFIED: `standards/core/architecture.md`] [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`] |
| Existing writing helpers | Repo-owned `src/domain/writing.ts`. [VERIFIED: `src/domain/writing.ts`] | Source public writing entries and canonical writing paths. [VERIFIED: `src/domain/writing.ts`] | `publicWritingEntries()` filters to published writing and `writingDetailPath()` returns `/writing/{slug}`. [VERIFIED: `src/domain/writing.ts`] |
| Existing profile/site identity | Repo-owned `src/domain/profile.ts` and `src/domain/seo.ts`. [VERIFIED: `src/domain/profile.ts`] [VERIFIED: `src/domain/seo.ts`] | Canonical origin, person/company identity, and feed-level metadata inputs. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`] | Existing metadata already builds absolute canonical URLs from `peterProfile.canonicalOrigin`. [VERIFIED: `src/domain/seo.ts`] |
| Existing topic helpers | Repo-owned `src/domain/topics.ts`. [VERIFIED: `src/domain/topics.ts`] | Public category labels for feed items. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`] | Phase 30/31 established canonical public topic filtering so downstream consumers do not expose unsupported labels. [VERIFIED: `.planning/STATE.md`] [VERIFIED: `src/domain/topics.ts`] |
| Solid Meta / `RouteHead` | `@solidjs/meta@0.29.4` repo pin; `RouteHead` repo component. [VERIFIED: `package.json`] [VERIFIED: `src/components/RouteHead.tsx`] [VERIFIED: npm registry] | Home/writing feed autodiscovery head links. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`] | SolidStart docs use `@solidjs/meta` for route head tags, and the repo already wraps routes in `MetaProvider`. [CITED: https://docs.solidjs.com/solid-start/building-your-application/head-and-metadata] [VERIFIED: `src/app.tsx`] |
| SolidStart public assets | `@solidjs/start@1.3.2` repo pin. [VERIFIED: `package.json`] [VERIFIED: npm registry] | Serve `public/feed.xml` at `/feed.xml` and copy it to `.output/public/feed.xml` during static build. [CITED: https://docs.solidjs.com/solid-start/building-your-application/static-assets] | SolidStart public assets are served at exact paths relative to `/public`, which fits a stable feed URL. [CITED: https://docs.solidjs.com/solid-start/building-your-application/static-assets] |

### Supporting

| Library / Surface | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Bun scripts | `packageManager: bun@1.3.14`; local Bun observed `1.3.9`. [VERIFIED: `package.json`] [VERIFIED: `bun --version`] | Run generator/check scripts, tests, build, and aggregate verification. [VERIFIED: `package.json`] | Add `generate:feed` and `verify:feed`; keep scripts TypeScript/Bun-owned. [VERIFIED: `standards/languages/typescript-javascript.md`] |
| Vitest | Repo pin `4.1.7`; latest observed `4.1.9`. [VERIFIED: `package.json`] [VERIFIED: npm registry] | Unit coverage for eligibility, ordering, IDs, escaping, dates, and categories. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`] | Use focused tests in `src/domain/feed.test.ts` before output wiring. [VERIFIED: `standards/core/testing.md`] |
| Static verifier | Repo-owned `scripts/verify-static/*`. [VERIFIED: `scripts/verify-static/run-static-verification.ts`] | Built-output proof for `.output/public/feed.xml`, metadata autodiscovery, and hidden-content exclusion. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`] | Extend after `public/feed.xml` and page links exist. [VERIFIED: `scripts/verify-static/output.ts`] |
| Playwright + axe | `@playwright/test@1.60.0`, `@axe-core/playwright@4.11.3` repo pins. [VERIFIED: `package.json`] [VERIFIED: npm registry] | Browser proof for visible feed link focus/readability/wrapping if existing route loops do not already cover the link. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`] [VERIFIED: `tests/browser-release.playwright.ts`] | Add only targeted assertions; do not expand live feed-reader checks. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`] |
| Release verifier | Repo-owned `scripts/verify-release.ts`. [VERIFIED: `scripts/verify-release.ts`] | Local output scan for forbidden runtime dependencies and static file budgets. [VERIFIED: `scripts/verify-release.ts`] | Extend only as needed to keep release evidence truthful for static feed output. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Repo-owned RSS serializer | `feed@5.2.1`. [VERIFIED: npm registry] | The phase explicitly locks a small repo-owned RSS 2.0 serializer, and adding a dependency would widen the dependency surface for simple XML output. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`] [VERIFIED: `package.json`] |
| Checked-in `public/feed.xml` plus drift check | Generate only inside `bun run build`. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`] | Build-only generation can hide drift and make ordinary build mutate output; checked-in static asset plus `--check` preserves deterministic review. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`] |
| RSS 2.0 only | Atom or JSON Feed companions. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`] | Companions are deferred and would add autodiscovery choices and validation scope. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`] |
| Feed summaries only | Full article bodies. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`] | Full bodies add escaping and size complexity; context defaults to summaries for v1. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`] |
| Static asset | Runtime SolidStart API route. [VERIFIED: `.planning/REQUIREMENTS.md`] | Runtime feed endpoints are out of scope and would weaken static deployment verification. [VERIFIED: `.planning/REQUIREMENTS.md`] [VERIFIED: `.planning/ROADMAP.md`] |

**Installation:**
```bash
# No new packages for Phase 33.
```

**Version verification:** Keep existing repo pins; this phase is not a dependency-update phase. [VERIFIED: `package.json`] [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`]

| Package | Repo Pin | Latest Observed | Repo Pin Published | Recommendation |
|---------|----------|-----------------|--------------------|----------------|
| `@solidjs/start` | `1.3.2` | `1.3.2` stable; `2.0.0-alpha.3` exists. [VERIFIED: npm registry] | 2026-02-24T21:13:42.558Z [VERIFIED: npm registry] | Keep repo pin; no framework migration. [VERIFIED: `package.json`] |
| `solid-js` | `1.9.13` | `1.9.14` [VERIFIED: npm registry] | 2026-05-15T17:36:58.458Z [VERIFIED: npm registry] | Keep repo pin; no Solid runtime update. [VERIFIED: `package.json`] |
| `@solidjs/meta` | `0.29.4` | `0.29.4` [VERIFIED: npm registry] | 2024-05-15T15:14:56.977Z [VERIFIED: npm registry] | Use existing `HeadLink`/`MetaProvider` setup. [VERIFIED: `src/app.tsx`] |
| `vinxi` | `0.5.11` | `0.5.11` [VERIFIED: npm registry] | 2026-01-19T20:25:28.292Z [VERIFIED: npm registry] | Keep existing SolidStart build path. [VERIFIED: `app.config.ts`] |
| `vite` | `8.0.14` | `8.1.3` [VERIFIED: npm registry] | 2026-05-21T07:16:03.179Z [VERIFIED: npm registry] | No Vite change needed. [VERIFIED: `package.json`] |
| `vite-plugin-solid` | `2.11.12` | `2.11.12` [VERIFIED: npm registry] | 2026-04-05T21:58:20.558Z [VERIFIED: npm registry] | No plugin change needed. [VERIFIED: `package.json`] |
| `typescript` | `6.0.3` | `6.0.3` [VERIFIED: npm registry] | 2026-04-16T23:38:27.905Z [VERIFIED: npm registry] | Use current typecheck. [VERIFIED: `package.json`] |
| `vitest` | `4.1.7` | `4.1.9` [VERIFIED: npm registry] | 2026-05-20T07:19:42.142Z [VERIFIED: npm registry] | Use existing test runner. [VERIFIED: `package.json`] |
| `@biomejs/biome` | `2.4.15` | `2.5.2` [VERIFIED: npm registry] | 2026-05-09T17:08:10.962Z [VERIFIED: npm registry] | Use existing format/lint scripts. [VERIFIED: `package.json`] |
| `@playwright/test` | `1.60.0` | `1.61.1` [VERIFIED: npm registry] | 2026-05-11T19:09:45.394Z [VERIFIED: npm registry] | Use existing browser release suite. [VERIFIED: `tests/browser-release.playwright.ts`] |
| `@axe-core/playwright` | `4.11.3` | `4.12.1` [VERIFIED: npm registry] | 2026-04-30T11:05:25.824Z [VERIFIED: npm registry] | Use existing axe integration. [VERIFIED: `tests/browser-release.playwright.ts`] |

## Architecture Patterns

### Recommended Project Structure

```text
src/domain/
├── feed.ts                 # pure feed item model, RSS metadata, XML escaping, serializer
└── feed.test.ts            # focused Vitest coverage for eligibility, ordering, dates, IDs, escaping

scripts/
├── generate-feed.ts        # thin write/check shell for public/feed.xml
└── verify-static/
    ├── feed-verifier.ts    # built-output assertions for .output/public/feed.xml
    └── run-static-verification.ts

public/
└── feed.xml                # generated, reviewed, stable public feed asset
```

This structure follows the repo pattern of pure domain helpers plus thin Bun script shells and built-output static verification. [VERIFIED: `src/domain/seo.ts`] [VERIFIED: `scripts/generate-static-metadata.ts`] [VERIFIED: `scripts/verify-static/run-static-verification.ts`] [VERIFIED: `standards/core/architecture.md`]

### Pattern 1: Pure Feed Item Derivation

**What:** Add a feed-specific internal model that contains only RSS-ready fields: `id`, `title`, `summary`, `canonicalUrl`, `feedDate`, `categories`, and `slug`. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`]

**When to use:** Use this model between `publicWritingEntries()` and RSS serialization so route components and raw registries never own feed rules. [VERIFIED: `src/domain/writing.ts`] [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`]

**Example:**
```ts
// Source: Phase 33 context + existing writing/profile/topic helpers.
export type WritingFeedItem = {
  id: string;
  title: string;
  summary: string;
  canonicalUrl: string;
  feedDate: string;
  categories: readonly string[];
  slug: string;
};

export function writingFeedItems(
  entries: readonly PublicWritingEntry[] = publicWritingEntries(),
  profile: Pick<Profile, "canonicalOrigin"> = peterProfile,
): readonly WritingFeedItem[] {
  return sortFeedItems(
    entries.flatMap((entry) => {
      const maybeFeedDate = entry.maybeUpdatedOn ?? entry.maybePublishedOn;

      if (!maybeFeedDate) {
        return [];
      }

      const canonicalUrl = `${profile.canonicalOrigin}${writingDetailPath(entry)}`;

      return [
        {
          id: canonicalUrl,
          title: entry.title,
          summary: entry.summary,
          canonicalUrl,
          feedDate: maybeFeedDate,
          categories: publicFeedCategoriesForWriting(entry),
          slug: entry.slug,
        },
      ];
    }),
  );
}
```

### Pattern 2: Deterministic Date and Ordering Rules

**What:** Use checked-in date strings only; select the item feed date from `maybeUpdatedOn ?? maybePublishedOn`, parse it as UTC midnight, serialize it with `Date.prototype.toUTCString()`, and sort descending by that date with `displayOrder` and slug tie-breakers. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`] [VERIFIED: `src/domain/writing-validation.ts`] [CITED: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toUTCString]

**When to use:** Use this for `<pubDate>` and feed ordering; do not use `Date.now()`, build start time, filesystem mtime, array index, or generated asset fingerprint. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`]

**Example:**
```ts
// Source: RSS pubDate guidance + existing writing date validation pattern.
export function rssDateFromIsoDate(value: string): string {
  const date = new Date(`${value}T00:00:00Z`);

  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw new Error(`Invalid feed date: ${value}`);
  }

  return date.toUTCString();
}
```

### Pattern 3: Narrow RSS 2.0 Serializer

**What:** Serialize exactly one `<rss version="2.0">` document with one `<channel>`, channel `title`, `link`, and `description`, plus item `title`, `link`, `guid`, `pubDate`, `description`, and zero or more `category` values. [CITED: https://www.rssboard.org/rss-specification] [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`]

**When to use:** Use this serializer only for this feed; do not build a generic XML builder, HTML body serializer, Atom namespace system, or feed parser. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`]

**Example:**
```ts
// Source: RSS 2.0 spec + XML 1.0 well-formedness rules.
export function escapeXmlText(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function escapeXmlAttribute(value: string): string {
  return escapeXmlText(value).replace(/"/g, "&quot;");
}

export function rssItemXml(item: WritingFeedItem): string {
  return [
    "    <item>",
    `      <title>${escapeXmlText(item.title)}</title>`,
    `      <link>${escapeXmlText(item.canonicalUrl)}</link>`,
    `      <guid isPermaLink="true">${escapeXmlText(item.id)}</guid>`,
    `      <pubDate>${rssDateFromIsoDate(item.feedDate)}</pubDate>`,
    `      <description>${escapeXmlText(item.summary)}</description>`,
    ...item.categories.map(
      (category) => `      <category>${escapeXmlText(category)}</category>`,
    ),
    "    </item>",
  ].join("\n");
}
```

### Pattern 4: Checked-In Static Asset With Drift Check

**What:** Generate `public/feed.xml` from `rssFeedXml()` through a Bun script, and support `--check` to compare file contents without rewriting. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`] [VERIFIED: `scripts/generate-static-metadata.ts`]

**When to use:** Run `bun run generate:feed` when writing data changes and `bun run verify:feed` in aggregate verification before `bun run build`. [VERIFIED: `package.json`] [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`]

**Example:**
```ts
// Source: existing generate-static-metadata script pattern.
const outputPath = "public/feed.xml";
const expected = rssFeedXml();
const checkMode = process.argv.includes("--check");

if (checkMode) {
  const actual = await maybeReadText(outputPath);

  if (actual !== expected) {
    throw new Error(`${outputPath} drifted from rssFeedXml(). Run bun run generate:feed.`);
  }
} else {
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, expected, "utf8");
}
```

### Pattern 5: Feed Autodiscovery and Visible Links

**What:** Add one head link with `rel="alternate"`, `type="application/rss+xml"`, an absolute `href`, and a short title on home and writing pages. [CITED: https://www.rssboard.org/rss-autodiscovery] [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`]

**When to use:** Use `HeadLink` from `@solidjs/meta`; extend `RouteHead` with optional alternate feed links for `/writing`, and use the same helper in the home head or move home to `RouteHead` if that reduces duplication. [VERIFIED: `src/components/RouteHead.tsx`] [VERIFIED: `src/routes/index.tsx`] [CITED: https://docs.solidjs.com/solid-meta/reference/meta/link]

**Example:**
```tsx
// Source: RSS autodiscovery spec + existing RouteHead pattern.
<HeadLink
  rel="alternate"
  type="application/rss+xml"
  title="Bright Builds writing feed"
  href={`${peterProfile.canonicalOrigin}/feed.xml`}
/>
```

### Anti-Patterns to Avoid

- **Generating feed XML inside route components:** This mixes serialization with UI and contradicts the pure helper decision. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`]
- **Using raw `curatedWriting` directly for feed output:** This can include draft, hidden, archived, or undated records unless every caller repeats visibility logic. [VERIFIED: `src/domain/writing.ts`] [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`]
- **Using build time for channel or item dates:** This makes the feed drift on every build and violates deterministic output. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`]
- **Adding `/feed.xml` to `prerenderRoutes`:** The feed is a static XML asset, not an HTML route. [VERIFIED: `app.config.ts`] [CITED: https://docs.solidjs.com/solid-start/building-your-application/static-assets]
- **Adding a custom subscription modal:** The phase locks ordinary anchor semantics and excludes JavaScript-only subscription interaction. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Public eligibility | New feed-only status predicates over raw registries. | `publicWritingEntries()` plus a feed-date guard. [VERIFIED: `src/domain/writing.ts`] | The writing helper already filters published entries; feed-specific duplication can leak drafts/hidden/archived records. [VERIFIED: `src/domain/writing.ts`] [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`] |
| Canonical URL construction | String literals or hard-coded production host. | `peterProfile.canonicalOrigin` and `writingDetailPath()`. [VERIFIED: `src/domain/profile.ts`] [VERIFIED: `src/domain/writing.ts`] | Existing SEO helpers already derive absolute canonical URLs from the profile origin. [VERIFIED: `src/domain/seo.ts`] |
| Category filtering | Raw tags/topics or slugified unsupported labels. | Canonical public topic helpers from `src/domain/topics.ts`. [VERIFIED: `src/domain/topics.ts`] | The phase requires safe public labels after the canonical topic contract has filtered eligibility. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`] |
| General XML parser or validator | In-repo XML parser, DTD handling, or XXE-sensitive parser config. | Narrow serializer plus unit/static string checks. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`] | Phase 33 generates XML and does not need to parse untrusted XML. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`] [CITED: https://raw.githubusercontent.com/OWASP/ASVS/master/5.0/en/0x10-V1-Encoding-and-Sanitization.md] |
| Runtime feed endpoint | SolidStart API route or server handler. | Static `public/feed.xml`. [VERIFIED: `.planning/REQUIREMENTS.md`] [CITED: https://docs.solidjs.com/solid-start/building-your-application/static-assets] | Runtime feed endpoints are explicitly out of scope for v1.6. [VERIFIED: `.planning/REQUIREMENTS.md`] |
| Hosted feed-reader validation | Live external feed reader checks in local gates. | Local static verification plus Phase 36 manual smoke wording. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`] | Local gates must stay deterministic and not depend on live hosted services. [VERIFIED: `.planning/PROJECT.md`] [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`] |

**Key insight:** The hard part is not RSS syntax; it is keeping feed eligibility, dates, IDs, output, and verification deterministic across source data, `public/feed.xml`, built `.output/public/feed.xml`, home/writing head metadata, and visible links. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`] [VERIFIED: `scripts/verify-static/output.ts`]

## Common Pitfalls

### Pitfall 1: Feed Drift From Build-Time Values
**What goes wrong:** The feed changes on every build because channel dates, item IDs, or generated fields use `Date.now()`, build timestamps, array indexes, or asset fingerprints. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`]
**Why it happens:** RSS examples often include dynamic `lastBuildDate`, but this project requires deterministic static output. [CITED: https://www.rssboard.org/rss-specification] [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`]
**How to avoid:** Use only checked-in writing dates and canonical paths/URLs for item identity and dates. [VERIFIED: `src/domain/writing.ts`] [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`]
**Warning signs:** `new Date()` with no input, `Date.now()`, `Math.random()`, array index GUIDs, or generated asset paths inside `feed.ts`. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`]

### Pitfall 2: Invalid XML From Partial Escaping
**What goes wrong:** A title, summary, URL, category, or GUID with `&`, `<`, `>`, or quotes breaks XML or changes document structure. [CITED: https://www.w3.org/TR/xml/] [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`]
**Why it happens:** HTML escaping helpers are similar but not automatically applied to custom RSS string assembly. [VERIFIED: `scripts/verify-static/html-assertions.ts`]
**How to avoid:** Put XML text/attribute escaping in `src/domain/feed.ts`, test each special character, and use the helper for every dynamic XML value. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`] [CITED: https://raw.githubusercontent.com/OWASP/ASVS/master/5.0/en/0x10-V1-Encoding-and-Sanitization.md]
**Warning signs:** Template strings that interpolate `entry.title`, `entry.summary`, `canonicalUrl`, or `category` directly into XML. [VERIFIED: `src/domain/writing.ts`]

### Pitfall 3: Hidden or Unsupported Labels Become Public Categories
**What goes wrong:** Feed categories expose tags/topics that public topic helpers would reject. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`]
**Why it happens:** Writing entries have raw `topics` and `tags`, while Phase 30/31 made canonical topics the public discovery contract. [VERIFIED: `src/domain/writing.ts`] [VERIFIED: `src/domain/topics.ts`]
**How to avoid:** Resolve labels through the canonical topic contract and serialize public display labels only. [VERIFIED: `src/domain/topics.ts`] [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`]
**Warning signs:** `categories: [...entry.topics, ...entry.tags]` without canonical filtering. [VERIFIED: `src/domain/writing.ts`]

### Pitfall 4: Static Asset Exists in Source But Not Built Output
**What goes wrong:** `/feed.xml` works locally by source assumption but is missing from `.output/public`. [VERIFIED: `scripts/verify-static/output.ts`]
**Why it happens:** Static asset copying is a build behavior and must be verified after `bun run build`. [CITED: https://docs.solidjs.com/solid-start/building-your-application/static-assets] [VERIFIED: `package.json`]
**How to avoid:** Extend `verify:static` to assert `.output/public/feed.xml` exists, is non-empty, and equals `rssFeedXml()`. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`] [VERIFIED: `scripts/verify-static/output.ts`]
**Warning signs:** Tests only inspect `public/feed.xml` or domain output and never inspect `.output/public/feed.xml`. [VERIFIED: `scripts/verify-static/run-static-verification.ts`]

### Pitfall 5: Autodiscovery Link Is Present But Not Feed-Reader Friendly
**What goes wrong:** Some clients miss the feed because `rel`, `type`, or `href` do not match RSS autodiscovery expectations. [CITED: https://www.rssboard.org/rss-autodiscovery]
**Why it happens:** General link tags allow many variants, but RSS autodiscovery specifies lowercase `alternate`, `application/rss+xml`, and a feed URL. [CITED: https://www.rssboard.org/rss-autodiscovery]
**How to avoid:** Use one absolute feed URL in home and writing heads: `${peterProfile.canonicalOrigin}/feed.xml`. [CITED: https://www.rssboard.org/rss-autodiscovery] [VERIFIED: `src/domain/profile.ts`]
**Warning signs:** Relative autodiscovery `href`, uppercase MIME type, multiple feed format links, or no static check for the head tag. [CITED: https://www.rssboard.org/rss-autodiscovery]

## Code Examples

Verified patterns from official and repo sources:

### Feed Metadata Helper

```ts
// Source: existing profile metadata pattern + RSS channel required elements.
export type FeedMetadata = {
  title: string;
  description: string;
  siteUrl: string;
  feedUrl: string;
};

export function writingFeedMetadata(profile: Profile = peterProfile): FeedMetadata {
  return {
    title: "Bright Builds writing",
    description:
      "Writing from Peter Ryszkiewicz on agentic engineering, open systems, identity, and practical web software.",
    siteUrl: profile.canonicalOrigin,
    feedUrl: `${profile.canonicalOrigin}/feed.xml`,
  };
}
```

### Static Verification Hook

```ts
// Source: scripts/verify-static/output.ts assertion helpers.
export function assertFeedOutput(root: string): void {
  assertOutputTextEquals(root, "feed.xml", rssFeedXml());

  const feedPath = assertOutputFile(root, "feed.xml");
  const feedXml = readFileSync(feedPath, "utf8");

  if (feedXml.trim().length === 0) {
    throw new Error("Static feed output was empty.");
  }
}
```

### Low-Intrusion Visible Link

```tsx
// Source: Phase 33 context + existing dark-primary text-link/surface-link classes.
<a class="text-link surface-link" href="/feed.xml">
  RSS feed
</a>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Runtime feed route for static content | Checked-in static XML asset with drift-check generation. [VERIFIED: `.planning/REQUIREMENTS.md`] [CITED: https://docs.solidjs.com/solid-start/building-your-application/static-assets] | Project static-first decisions predate Phase 33 and v1.6 excludes runtime endpoints. [VERIFIED: `.planning/PROJECT.md`] [VERIFIED: `.planning/REQUIREMENTS.md`] | Plan `public/feed.xml`, `verify:feed`, and built-output checks instead of server code. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`] |
| Feed IDs from timestamps or counters | Canonical URL or deterministic tag-style ID. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`] | Locked in Phase 33 context. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`] | Feed readers avoid duplicate churn when builds rerun. [CITED: https://www.rssboard.org/rss-specification] |
| Multiple feed formats in autodiscovery | One RSS 2.0 autodiscovery link. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`] [CITED: https://www.rssboard.org/rss-autodiscovery] | Locked for v1 feed scope. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`] | Avoids subscription-choice clutter and keeps JSON Feed/Atom deferred. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`] |
| Full-body feed content | Summary-only feed descriptions. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`] | Locked by v1 default unless trivial. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`] | Smaller XML and simpler escaping surface. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`] |

**Deprecated/outdated:**
- Floating or generated item identifiers are not acceptable for this phase because stable IDs must derive from canonical writing paths/URLs. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`]
- Runtime feed endpoints are out of scope for v1.6. [VERIFIED: `.planning/REQUIREMENTS.md`]
- Atom, JSON Feed, topic feeds, project feeds, and theme update feeds are deferred. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|

All claims in this research were verified or cited; no user-confirmation assumptions are being passed to planning. [VERIFIED: source review in this file]

## Open Questions (RESOLVED)

1. **Should `pubDate` prefer updated date over published date when both exist?**
   - What we know: Feed entries may include `maybePublishedOn` or `maybeUpdatedOn`, and ordering should use checked-in published/updated date descending. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`]
   - What's unclear: RSS 2.0 has `pubDate` but no native updated field without an extension namespace. [CITED: https://www.rssboard.org/rss-specification]
   - RESOLVED: Use `maybeUpdatedOn ?? maybePublishedOn` as the v1 `feedDate` and `<pubDate>`, document the behavior in tests, and avoid extension namespaces until Atom/JSON Feed or richer update semantics are scoped. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`]

2. **Should `public/feed.xml` be checked in or generated after build?**
   - What we know: Context allows either `public/feed.xml` before build or copying generated XML into `.output/public/feed.xml`, provided output is deterministic and check-mode verification exists. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`]
   - What's unclear: There is no existing feed generator convention in the repo. [VERIFIED: `rg feed src scripts package.json`]
   - RESOLVED: Check in `public/feed.xml` and verify drift with `verify:feed`; SolidStart public assets provide stable exact-path serving for `/feed.xml`. [CITED: https://docs.solidjs.com/solid-start/building-your-application/static-assets] [VERIFIED: `public/sitemap.xml`]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Bun | Scripts, tests, build, verification. [VERIFIED: `package.json`] | ✓ | Local `1.3.9`; repo packageManager `1.3.14`. [VERIFIED: `bun --version`] [VERIFIED: `package.json`] | Use local Bun for planning/execution; upgrade local Bun only if repo scripts fail due version drift. [VERIFIED: `.planning/PROJECT.md`] |
| Node.js | Tool compatibility and npm registry checks. [VERIFIED: `AGENTS.md`] | ✓ | `v24.13.0`. [VERIFIED: `node --version`] | Bun scripts remain primary. [VERIFIED: `package.json`] |
| npm registry access | Version verification. [VERIFIED: npm registry] | ✓ | npm CLI `11.6.2`. [VERIFIED: `npm --version`] | Use repo pins if registry is unavailable during implementation. [VERIFIED: `package.json`] |
| Playwright CLI | Browser release checks if feed links need UI assertions. [VERIFIED: `tests/browser-release.playwright.ts`] | ✓ | `1.60.0`. [VERIFIED: `bun x playwright --version`] | Run `bun run install:browser` if Chromium is missing on a clean builder. [VERIFIED: `docs/release-readiness.md`] |
| Biome | Format/lint checks. [VERIFIED: `package.json`] | ✓ | `2.4.15`. [VERIFIED: `bun run biome --version`] | Use `bun run format:check`/`bun run check`; no alternate formatter needed. [VERIFIED: `package.json`] |
| TypeScript compiler | Typecheck feed helpers/scripts. [VERIFIED: `package.json`] | ✓ | `6.0.3`. [VERIFIED: `bun run tsc --version`] | None needed. [VERIFIED: `package.json`] |
| Vitest | Unit tests. [VERIFIED: `package.json`] | ✓ | `4.1.7`. [VERIFIED: `bun run vitest --version`] | None needed. [VERIFIED: `package.json`] |

**Missing dependencies with no fallback:**
- None found for local Phase 33 implementation. [VERIFIED: environment probes]

**Missing dependencies with fallback:**
- Local Bun is older than the repo `packageManager` pin, but prior repo state documents full aggregate verification as passing and no Phase 33 dependency update is required. [VERIFIED: `bun --version`] [VERIFIED: `package.json`] [VERIFIED: `.planning/PROJECT.md`]

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V1 Encoding and Sanitization | yes | XML text/attribute escaping must be applied at serialization, close to RSS output. [CITED: https://raw.githubusercontent.com/OWASP/ASVS/master/5.0/en/0x10-V1-Encoding-and-Sanitization.md] [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`] |
| V2 Validation and Business Logic | yes | Feed eligibility and date validation must enforce the public-writing-only business rule. [CITED: https://raw.githubusercontent.com/OWASP/ASVS/master/5.0/en/0x11-V2-Validation-and-Business-Logic.md] [VERIFIED: `src/domain/writing.ts`] |
| Authentication / Session Management | no | Phase 33 adds a public static XML asset and public links only. [VERIFIED: `.planning/REQUIREMENTS.md`] |
| Access Control | limited | Public selector composition prevents hidden/draft/archived writing from entering feed output. [VERIFIED: `src/domain/writing.ts`] [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`] |
| Cryptography | no | Phase 33 does not add signatures, encryption, password storage, or token handling. [VERIFIED: `.planning/REQUIREMENTS.md`] |
| File and Resource Safety | yes | `scripts/generate-feed.ts` should write only `public/feed.xml` and `--check` should avoid mutation. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`] |

### Known Threat Patterns for Static RSS Feed

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| XML injection through authored title/summary/category/link text | Tampering | Escape XML text/attribute content in the serializer and test special characters. [CITED: https://www.w3.org/TR/xml/] [CITED: https://raw.githubusercontent.com/OWASP/ASVS/master/5.0/en/0x10-V1-Encoding-and-Sanitization.md] |
| Hidden content disclosure through raw registry iteration | Information Disclosure | Derive from `publicWritingEntries()` and reject undated items. [VERIFIED: `src/domain/writing.ts`] [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`] |
| Feed churn / reader duplicate spam through unstable GUIDs | Repudiation / Integrity | Use canonical absolute URLs or deterministic tag-style IDs, never timestamps/indexes. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`] [CITED: https://www.rssboard.org/rss-specification] |
| Local verification mutates source unexpectedly | Tampering | Use generator check mode and compare built output to pure helper output. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`] [VERIFIED: `scripts/verify-static/output.ts`] |
| Runtime dependency accidentally introduced | Denial of Service / Information Disclosure | Keep feed static; extend release/static checks for no runtime feed/content APIs. [VERIFIED: `.planning/REQUIREMENTS.md`] [VERIFIED: `scripts/verify-release.ts`] |

## Sources

### Primary (HIGH confidence)
- `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md` - Locked Phase 33 decisions, scope, plan split, and verification requirements. [VERIFIED: file read]
- `.planning/REQUIREMENTS.md` - FEED-01 through FEED-05 and v1.6 out-of-scope constraints. [VERIFIED: file read]
- `.planning/ROADMAP.md` - Phase 33 goal, success criteria, and two-plan split. [VERIFIED: file read]
- `.planning/STATE.md` and `.planning/PROJECT.md` - Current milestone state, Phase 30/32 completion context, static-first release contract. [VERIFIED: file read]
- `AGENTS.md`, `AGENTS.bright-builds.md`, `standards-overrides.md`, and task-relevant `standards/` pages - Repo workflow, dark-primary UI, TypeScript/Bun, testing, verification, architecture, and OpenLinks guidance. [VERIFIED: file read]
- `src/domain/writing.ts`, `src/domain/topics.ts`, `src/domain/profile.ts`, `src/domain/seo.ts`, `src/components/RouteHead.tsx`, `src/routes/index.tsx`, `src/routes/writing/index.tsx`, `src/app.tsx` - Existing source integration points. [VERIFIED: code inspection]
- `scripts/verify-static/*`, `scripts/verify-release.ts`, `scripts/generate-static-metadata.ts`, `tests/browser-release.playwright.ts`, `package.json` - Existing static, release, script, and browser verification patterns. [VERIFIED: code inspection]
- RSS Advisory Board RSS 2.0 specification - Required RSS structure, items, categories, pubDate, GUID, XML basis. [CITED: https://www.rssboard.org/rss-specification]
- RSS Advisory Board RSS Autodiscovery - Head link relationship, MIME type, and absolute feed URL guidance. [CITED: https://www.rssboard.org/rss-autodiscovery]
- SolidStart static assets docs - Public directory exact-path static serving and stable public URLs. [CITED: https://docs.solidjs.com/solid-start/building-your-application/static-assets]
- SolidStart head metadata and Solid Meta Link docs - `@solidjs/meta` route head and `Link` component behavior. [CITED: https://docs.solidjs.com/solid-start/building-your-application/head-and-metadata] [CITED: https://docs.solidjs.com/solid-meta/reference/meta/link]
- OWASP ASVS 5.0 project and V1/V2 chapters - Security control mapping for encoding, validation, and business logic. [CITED: https://owasp.org/www-project-application-security-verification-standard/] [CITED: https://raw.githubusercontent.com/OWASP/ASVS/master/5.0/en/0x10-V1-Encoding-and-Sanitization.md] [CITED: https://raw.githubusercontent.com/OWASP/ASVS/master/5.0/en/0x11-V2-Validation-and-Business-Logic.md]

### Secondary (MEDIUM confidence)
- npm registry queries for repo package pins and latest observed versions. [VERIFIED: npm registry]
- MDN `Date.prototype.toUTCString()` reference for UTC string formatting behavior. [CITED: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toUTCString]

### Tertiary (LOW confidence)
- None used. [VERIFIED: source review in this file]

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - No new packages are recommended; all repo pins and current docs were verified. [VERIFIED: `package.json`] [VERIFIED: npm registry] [CITED: https://www.rssboard.org/rss-specification]
- Architecture: HIGH - Existing repo patterns directly match the phase shape: pure domain helpers, thin scripts, static assets, and built-output verification. [VERIFIED: `src/domain/seo.ts`] [VERIFIED: `scripts/generate-static-metadata.ts`] [VERIFIED: `scripts/verify-static/output.ts`]
- Pitfalls: HIGH - Pitfalls come from locked context, RSS/XML specs, and existing static/release verifier behavior. [VERIFIED: `.planning/phases/33-writing-first-static-feed/33-CONTEXT.md`] [CITED: https://www.rssboard.org/rss-specification] [CITED: https://www.w3.org/TR/xml/]
- UI/autodiscovery: HIGH - RSS autodiscovery and Solid Meta head patterns were verified in official docs and existing code. [CITED: https://www.rssboard.org/rss-autodiscovery] [CITED: https://docs.solidjs.com/solid-meta/reference/meta/link] [VERIFIED: `src/components/RouteHead.tsx`]

**Research date:** 2026-07-03 [VERIFIED: system current date]
**Valid until:** 2026-08-02 for repo architecture and RSS guidance; re-check npm/SolidStart versions after 30 days or before dependency changes. [VERIFIED: npm registry] [CITED: https://docs.solidjs.com/solid-start/building-your-application/static-assets]

## RESEARCH COMPLETE
