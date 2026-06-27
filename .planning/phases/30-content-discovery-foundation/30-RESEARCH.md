# Phase 30: Content Discovery Foundation - Research

**Researched:** 2026-06-26
**Domain:** Static TypeScript content discovery, canonical topics, public-only references
**Confidence:** HIGH

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions

Source for this subsection: [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md]

#### Topic Identity and Normalization

- **D-01:** Add an explicit canonical topic contract, expected as a small `TopicRecord`-style registry plus alias/label matching helpers, instead of deriving route identities directly from raw project themes/tags, writing topics/tags, or theme titles.
- **D-02:** Canonical topic slugs should be lowercase hyphenated stable URL identifiers. Display labels should preserve authored casing for visitor-facing copy, such as `AI`, `SolidJS`, and `Open web`.
- **D-03:** Raw source labels from public project themes/tags, writing topics/tags, and public theme records should normalize through the canonical topic contract. Unknown labels should not automatically become public topic routes.
- **D-04:** Topic identity must remain distinct from theme pages. Public theme records can contribute topic labels and references, but themes are narrative paths and should not become the only topic authority.
- **D-05:** Canonical topic ordering should be deterministic and curated enough for later `/topics` and filter surfaces. Exact display ordering can be explicit in the topic registry or derived from a stable public reference count plus label sort if that keeps the helper simpler.

#### Public Content Reference Contract

- **D-06:** Expose a discriminated `PublicContentReference`-style envelope for public projects, writing, and themes rather than passing full registry records to downstream discovery consumers.
- **D-07:** The envelope should expose only safe shared fields needed by later phases: `kind`, `slug`, `title`, `summary`, `canonicalPath`, normalized canonical topics, original public labels where useful, deterministic `displayOrder`, and optional safe facets such as writing kind/date or project status/source type.
- **D-08:** Public references must compose existing public selectors and path helpers: `publicProjectIndexProjects()` or selected detail helpers where appropriate, `publicWritingEntries()`, `publicThemeEntries()`, `projectStoryHref()` or detail paths, `writingDetailPath()`, and `themeDetailPath()`.
- **D-09:** Downstream phases may add per-consumer payload builders for feeds, related work, or social previews only when those surfaces need stricter shapes. Phase 30 should make the common public reference contract strong enough that consumers do not re-implement visibility checks.

#### Non-Leaking Lookup and Fallback Behavior

- **D-10:** Visitor-facing lookup helpers should follow the repo's existing `maybe...` naming and return `null` for unknown, malformed, private, draft, hidden, archived, unsupported, or otherwise non-public topics/references.
- **D-11:** Public helper return values must not let visitor-facing routes distinguish "unknown" from "hidden" or "archived." Detailed reasons belong only in curation validation findings and tests.
- **D-12:** Do not create generic fallback topic objects for unknown topic slugs. Later route work should be able to render a non-leaking not-found/fallback surface from `null`, not a synthetic public topic.
- **D-13:** Internal curation checks may fail fast or return detailed structured findings, but runtime public helpers should stay pure and side-effect free.

#### Validation and Curation Gate

- **D-14:** Add a topic/discovery validation module, expected as `src/domain/topic-validation.ts` or similar, with structured findings consistent with project, writing, theme, and social-preview validation patterns.
- **D-15:** Validation should fail for duplicate canonical topic slugs, duplicate or colliding labels/aliases, invalid slugs, empty labels, unsupported source kinds, public references with no canonical topic mapping, and topic references that resolve hidden, draft, archived, unsupported, unselected, or otherwise non-public records.
- **D-16:** Validation should distinguish curation mistakes clearly enough for maintainers to fix the correct topic, project, writing, or theme record, but those diagnostic reasons should not be part of visitor-facing lookup helpers.
- **D-17:** Wire discovery/topic validation into `scripts/verify-curation.ts` beside project, writing, and theme validation once the validator is stable.
- **D-18:** Add focused Vitest coverage for canonical topic derivation, alias normalization, label collision detection, public reference filtering, nullable lookup behavior, hidden-content exclusion, deterministic ordering, and checked-in registry validity.

#### Phase Boundary and Deferrals

- **D-19:** Phase 30 should add pure domain helpers, curation validation, and unit tests only. It may include route-safe path helpers such as `topicDetailPath(topic)` so Phase 31 can consume them without duplicating URL rules.
- **D-20:** Defer actual `/topics` routes, static HTML, metadata, sitemap entries, linked chips, filtering/search controls, feed XML/autodiscovery, related-work ranking/panels, social-preview manifests/assets, browser checks, and release-evidence label updates to Phases 31-36.

### the agent's Discretion

Source for this subsection: [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md]

- Exact TypeScript type names, helper names, issue-code names, and fixture builders are delegated to implementation as long as nullable lookups use `maybe...`, public helpers are pure data-in/data-out functions, and tests preserve Arrange/Act/Assert structure.
- The planner may decide whether canonical topics live in one `topics.ts` module or a `discovery.ts` module with topic exports, provided downstream consumers have one obvious import surface.
- The planner may choose a conservative initial canonical topic set derived from existing public labels, as long as every public source label is either mapped intentionally or rejected by validation with an actionable finding.

### Deferred Ideas (OUT OF SCOPE)

Source for this subsection: [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md]

- `/topics` index and `/topics/{slug}` detail route rendering belong to Phase 31.
- Topic-linked chips across project, writing, theme, and topic pages belong to Phase 31.
- Topic metadata, structured data, sitemap coverage, and static HTML crawler verification belong to Phase 31.
- Project and writing filtering/search UI belongs to Phase 32.
- Static writing-first feed output and autodiscovery belong to Phase 33.
- Centralized related-work ranking and panels belong to Phase 34.
- Generic and topic social preview assets belong to Phase 35.
- Milestone-wide static/browser/release evidence expansion belongs to Phase 36.

</user_constraints>

## Project Constraints (from AGENTS.md)

- Use `AGENTS.md` as the repo-local instruction entrypoint, read `AGENTS.bright-builds.md`, read `standards-overrides.md` when present, and load task-relevant standards before planning or implementation. [VERIFIED: AGENTS.md] [VERIFIED: AGENTS.bright-builds.md]
- Repo-local UI is dark-primary, and UI changes require desktop and mobile dark rendering checks; Phase 30 is domain/test/script-only, so no new UI visual checks are required in this phase. [VERIFIED: AGENTS.md] [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md]
- GSD planning artifacts are required, and planning docs should be committed as repo history when `commit_docs` is enabled. [VERIFIED: AGENTS.md] [VERIFIED: .planning/config.json] [VERIFIED: gsd init phase-op 30]
- Keep business logic in pure data-in/data-out TypeScript helpers, with I/O limited to thin script shells. [VERIFIED: standards/core/architecture.md] [VERIFIED: standards/languages/typescript-javascript.md]
- Nullable public lookups should use `maybe...` naming and return `null` for normal absence. [VERIFIED: standards/core/code-shape.md] [VERIFIED: standards/languages/typescript-javascript.md] [VERIFIED: src/domain/writing.ts] [VERIFIED: src/domain/themes.ts]
- Unit tests for pure domain logic are mandatory, focused on one concern, and should use clear Arrange/Act/Assert sections. [VERIFIED: standards/core/testing.md] [VERIFIED: src/domain/writing-validation.test.ts] [VERIFIED: src/domain/theme-validation.test.ts]
- Use repo-owned Bun scripts and avoid adding new Python automation in this Bun-friendly TypeScript repository. [VERIFIED: standards/languages/typescript-javascript.md] [VERIFIED: package.json]
- Prefer repo-owned aggregate and targeted verification commands before commits. [VERIFIED: standards/core/verification.md] [VERIFIED: package.json]
- No project-local skills were installed under `.claude/skills` or `.agents/skills`. [VERIFIED: find .claude/skills .agents/skills -maxdepth 2 -name SKILL.md]
- `standards-overrides.md` contains only placeholder override rows and no active local exception for this phase. [VERIFIED: standards-overrides.md]

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| DISC-04 | Unknown, private, draft, archived, or unsupported topic inputs do not expose hidden content and use non-leaking fallback behavior. [VERIFIED: .planning/REQUIREMENTS.md] | Use a canonical topic registry, public-only reference envelope, `maybe...` nullable lookup helpers, and validator-only diagnostic reasons. [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md] [VERIFIED: src/domain/projects.ts] [VERIFIED: src/domain/writing.ts] [VERIFIED: src/domain/themes.ts] |

</phase_requirements>

## Summary

Phase 30 should be planned as a domain-foundation change: add one topic/discovery helper surface, one matching validation module, focused Vitest tests, and curation-script wiring. [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md] The implementation should not add routes, UI, feed output, related-work panels, generated social-preview assets, browser tests, or runtime content fetching. [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md] [VERIFIED: .planning/REQUIREMENTS.md]

The existing codebase already has the patterns this phase needs: project, writing, and theme registries live in `src/domain`; public selectors filter non-public records; nullable lookups return `null`; validators return structured findings; and `scripts/verify-curation.ts` aggregates registry validation. [VERIFIED: src/domain/projects.ts] [VERIFIED: src/domain/writing.ts] [VERIFIED: src/domain/themes.ts] [VERIFIED: src/domain/project-validation.ts] [VERIFIED: src/domain/writing-validation.ts] [VERIFIED: src/domain/theme-validation.ts] [VERIFIED: scripts/verify-curation.ts]

**Primary recommendation:** Use `src/domain/topics.ts` as the single public discovery import surface and `src/domain/topic-validation.ts` as the curation gate; derive all public references by composing existing public selectors instead of adding consumer-specific indexes. [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md] [VERIFIED: src/domain/social-previews.ts]

## Standard Stack

### Core

| Library / Surface | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| TypeScript domain modules in `src/domain` | Repo-owned | Canonical topic registry, normalization helpers, public reference envelope, route-safe topic path helper. [VERIFIED: src/domain/projects.ts] [VERIFIED: src/domain/writing.ts] [VERIFIED: src/domain/themes.ts] | Existing public content helpers are pure TypeScript domain functions with optional fixture arrays. [VERIFIED: src/domain/writing.ts] [VERIFIED: src/domain/themes.ts] |
| `src/domain/topics.ts` | New repo file | One public topic/reference helper surface for downstream routes, filters, feeds, related work, and previews. [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md] | The phase requires one canonical topic/reference contract instead of separate discovery indexes. [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md] |
| `src/domain/topic-validation.ts` | New repo file | Structured topic/discovery curation findings and registry validation. [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md] | Existing validation modules use local typed issue shapes, registry validation results, and curation-script aggregation. [VERIFIED: src/domain/project-validation.ts] [VERIFIED: src/domain/writing-validation.ts] [VERIFIED: src/domain/theme-validation.ts] |
| Vitest | Repo pin `4.1.7`; registry latest `4.1.9` as of npm query. [VERIFIED: package.json] [VERIFIED: npm view vitest version] | Focused unit tests for pure topic and validator behavior. [VERIFIED: package.json] | Existing domain validation and helper tests use Vitest with Arrange/Act/Assert sections. [VERIFIED: src/domain/writing-validation.test.ts] [VERIFIED: src/domain/theme-validation.test.ts] |
| Bun scripts | `packageManager: bun@1.3.14`; local Bun `1.3.9`. [VERIFIED: package.json] [VERIFIED: bun --version] | Run targeted tests, curation validation, typecheck, and aggregate verification. [VERIFIED: package.json] | Repo scripts are Bun-owned and TypeScript scripts are run through `bun run`. [VERIFIED: package.json] [VERIFIED: standards/languages/typescript-javascript.md] |
| TypeScript compiler | Repo pin `6.0.3`; registry latest `6.0.3` as of npm query. [VERIFIED: package.json] [VERIFIED: npm view typescript version] | Typecheck discriminated unions and helper signatures. [VERIFIED: package.json] | TypeScript is the existing language for domain registries and validation modules. [VERIFIED: src/domain/projects.ts] [VERIFIED: src/domain/writing-validation.ts] |

### Supporting

| Library / Surface | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Biome | Repo pin `2.4.15`; registry latest `2.5.1` as of npm query. [VERIFIED: package.json] [VERIFIED: npm view @biomejs/biome version] | Formatting and linting for changed TS/tests/scripts. [VERIFIED: package.json] | Run through `bun run format:check` or `bun run check` as part of repo-native verification. [VERIFIED: package.json] |
| SolidStart / Solid route stack | `@solidjs/start@1.3.2`, `solid-js@1.9.13`, `@solidjs/router@0.16.1`, `vinxi@0.5.11`. [VERIFIED: package.json] [VERIFIED: npm view @solidjs/start version] [VERIFIED: npm view solid-js version] [VERIFIED: npm view @solidjs/router version] [VERIFIED: npm view vinxi version] | Later phases will consume topic routes and metadata; Phase 30 should only expose route-safe path helpers. [VERIFIED: .planning/ROADMAP.md] [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md] | Do not edit route files in Phase 30 unless a path helper needs export coverage. [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md] |
| Existing project/writing/theme selectors | Repo-owned | Source of public project, writing, and theme records. [VERIFIED: src/domain/projects.ts] [VERIFIED: src/domain/writing.ts] [VERIFIED: src/domain/themes.ts] | Use for every public reference; do not bypass them with raw curated arrays in public helpers. [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md] [VERIFIED: src/domain/social-previews.ts] |
| `scripts/verify-curation.ts` | Repo-owned | Aggregate project, writing, theme, and topic/discovery validation. [VERIFIED: scripts/verify-curation.ts] | Extend after topic validator has stable result shape. [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `src/domain/topics.ts` | `src/domain/discovery.ts` | The phase context permits either, but `topics.ts` names the canonical concept directly and gives downstream consumers one obvious import surface. [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md] |
| TypeScript literal records and validators | Zod or another schema library | Existing registry validators are repo-owned TypeScript modules, and `package.json` does not currently include Zod. [VERIFIED: src/domain/writing-validation.ts] [VERIFIED: src/domain/theme-validation.ts] [VERIFIED: package.json] |
| Canonical topic registry | Raw slugification of every tag/theme/topic string | Raw labels must normalize through canonical topics and unknown labels must not automatically become public routes. [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md] |
| Public selector composition | Consumer-specific route/filter/feed/preview indexes | Phase 30 requires one public-only reference contract and downstream consumers should not re-implement visibility checks. [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md] |

**Installation:**
```bash
# No new packages for Phase 30.
```

**Version verification:** Package versions were checked with `npm view`, and local runner availability was checked with `bun --version`, `bun run vitest --version`, `bun run biome --version`, `bun run tsc --version`, and `bun run scripts/verify-curation.ts`. [VERIFIED: npm registry] [VERIFIED: package.json]

| Package | Repo Pin | Latest Observed | Repo Pin Published | Notes |
|---------|----------|-----------------|--------------------|-------|
| `typescript` | `6.0.3` | `6.0.3` | `2026-04-16T23:38:27.905Z` | Use existing pin. [VERIFIED: npm registry] |
| `vitest` | `4.1.7` | `4.1.9` | `2026-05-20T07:19:42.142Z` | Use existing repo pin; this phase is not a dependency update. [VERIFIED: npm registry] [VERIFIED: package.json] |
| `@biomejs/biome` | `2.4.15` | `2.5.1` | `2026-05-09T17:08:10.962Z` | Use existing repo pin; this phase is not a dependency update. [VERIFIED: npm registry] [VERIFIED: package.json] |
| `@types/bun` | `1.3.14` | `1.3.14` | `2026-05-13T05:15:33.890Z` | Matches package manifest. [VERIFIED: npm registry] [VERIFIED: package.json] |
| `solid-js` | `1.9.13` | `1.9.13` | `2026-05-15T17:36:58.458Z` | No Solid runtime changes needed in Phase 30. [VERIFIED: npm registry] [VERIFIED: package.json] |
| `@solidjs/start` | `1.3.2` | `1.3.2` | `2026-02-24T21:13:42.558Z` | Later route phases consume this stack. [VERIFIED: npm registry] [VERIFIED: package.json] |
| `@solidjs/router` | `0.16.1` | `0.16.1` | `2026-03-17T23:16:42.276Z` | Later route phases consume this stack. [VERIFIED: npm registry] [VERIFIED: package.json] |
| `vinxi` | `0.5.11` | `0.5.11` | `2026-01-19T20:25:28.292Z` | No build-stack changes needed in Phase 30. [VERIFIED: npm registry] [VERIFIED: package.json] |

## Architecture Patterns

### Recommended Project Structure

```text
src/domain/
├── topics.ts                  # canonical topics, normalization, public references, nullable lookup helpers
├── topic-validation.ts        # structured curation findings for topic/reference integrity
├── topics.test.ts             # pure helper tests for public references and lookup behavior
└── topic-validation.test.ts   # validation issue-code tests and checked-in registry validity

scripts/
└── verify-curation.ts         # aggregate topic validation beside project, writing, and theme validation
```

This structure matches the existing domain and validation module pattern. [VERIFIED: src/domain/writing.ts] [VERIFIED: src/domain/writing-validation.ts] [VERIFIED: src/domain/themes.ts] [VERIFIED: src/domain/theme-validation.ts] [VERIFIED: scripts/verify-curation.ts]

### Pattern 1: Canonical Topic Registry

**What:** Define `TopicRecord` values with stable lowercase hyphenated slugs, authored display labels, aliases, and deterministic display order. [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md]

**When to use:** Use this registry for every topic route eligibility check, label-chip decision, filter/feed category derivation, related-work shared-topic fallback, and topic social-preview target in later phases. [VERIFIED: .planning/ROADMAP.md] [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md]

**Example:**
```ts
// Source: Phase 30 context + existing registry shape.
export type TopicRecord = {
  slug: string;
  label: string;
  aliases: readonly string[];
  displayOrder: number;
};

export const curatedTopics = [
  {
    slug: "agentic-engineering",
    label: "Agentic engineering",
    aliases: ["agents", "developer-tools"],
    displayOrder: 10,
  },
] as const satisfies readonly TopicRecord[];
```

### Pattern 2: Public-Only Reference Envelope

**What:** Export a discriminated `PublicContentReference` union with only safe shared fields, not full registry records. [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md]

**When to use:** Use this envelope whenever downstream consumers need public content lists for topics, filtering, feeds, related-work fallbacks, or previews. [VERIFIED: .planning/ROADMAP.md] [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md]

**Example:**
```ts
// Source: Phase 30 public reference contract.
export type PublicContentReference =
  | {
      kind: "project";
      slug: string;
      title: string;
      summary: string;
      canonicalPath: string;
      canonicalTopics: readonly TopicRecord[];
      sourceLabels: readonly string[];
      displayOrder: number;
      status: ProjectStory["status"];
      sourceType: ProjectStory["sourceType"];
    }
  | {
      kind: "writing";
      slug: string;
      title: string;
      summary: string;
      canonicalPath: string;
      canonicalTopics: readonly TopicRecord[];
      sourceLabels: readonly string[];
      displayOrder: number;
      writingKind: WritingEntry["kind"];
      maybePublishedOn?: string;
    }
  | {
      kind: "theme";
      slug: string;
      title: string;
      summary: string;
      canonicalPath: string;
      canonicalTopics: readonly TopicRecord[];
      sourceLabels: readonly string[];
      displayOrder: number;
    };
```

### Pattern 3: Compose Existing Public Selectors

**What:** Build public references by calling `publicProjectIndexProjects()`, `publicWritingEntries()`, and `publicThemeEntries()` before mapping to the envelope. [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md] [VERIFIED: src/domain/projects.ts] [VERIFIED: src/domain/writing.ts] [VERIFIED: src/domain/themes.ts]

**When to use:** Use this for both default checked-in data and fixture-driven tests, mirroring `socialPreviewTargets({ projects, writingEntries, themes })`. [VERIFIED: src/domain/social-previews.ts] [VERIFIED: src/domain/social-previews.test.ts]

**Example:**
```ts
// Source: socialPreviewTargets() composition pattern.
export function publicContentReferences(
  sources: TopicReferenceSources = {},
): readonly PublicContentReference[] {
  const projects = publicProjectIndexProjects(sources.projects);
  const writingEntries = publicWritingEntries(sources.writingEntries);
  const themes = publicThemeEntries(sources.themes);

  return [
    ...projects.map(referenceForProject),
    ...writingEntries.map(referenceForWriting),
    ...themes.map(referenceForTheme),
  ].sort(comparePublicContentReferences);
}
```

### Pattern 4: Non-Leaking Nullable Lookup

**What:** Public lookup helpers should return `null` for malformed, unknown, hidden, draft, archived, unsupported, or unmapped inputs. [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md]

**When to use:** Use this for future `/topics/{slug}` route loading and label-chip link decisions, so visitor-facing code cannot distinguish unknown content from hidden content. [VERIFIED: .planning/REQUIREMENTS.md] [VERIFIED: .planning/ROADMAP.md]

**Example:**
```ts
// Source: existing maybePublicWritingEntryBySlug() and maybePublicThemeEntryBySlug() patterns.
export function maybePublicTopicBySlug(
  slug: string,
  sources: TopicReferenceSources = {},
): PublicTopic | null {
  const maybeTopic = maybeTopicRecordBySlug(slug);

  if (!maybeTopic) {
    return null;
  }

  const references = publicContentReferencesForTopic(maybeTopic, sources);

  if (references.length === 0) {
    return null;
  }

  return {
    ...maybeTopic,
    canonicalPath: topicDetailPath(maybeTopic),
    references,
  };
}
```

### Pattern 5: Validator-Only Reasons

**What:** Diagnostics about duplicate labels, hidden references, unsupported source kinds, and unmapped public labels belong in `topic-validation.ts`, not in public helper return values. [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md]

**When to use:** Use structured validation findings for maintainers and tests, while keeping runtime helpers side-effect free and non-diagnostic. [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md] [VERIFIED: src/domain/writing-validation.ts] [VERIFIED: src/domain/theme-validation.ts]

**Recommended issue codes:**

| Code | Trigger | Source |
|------|---------|--------|
| `duplicate_topic_slug` | Second `TopicRecord.slug` repeats a prior slug. | [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md] |
| `invalid_topic_slug` | Topic slug is not lowercase hyphenated text. | [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md] [VERIFIED: src/domain/writing-validation.ts] |
| `empty_topic_label` | Topic label or alias trims to empty. | [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md] |
| `duplicate_topic_display_order` | Two canonical topics share display order. | [VERIFIED: src/domain/theme-validation.ts] |
| `colliding_topic_label` | A label/alias normalizes to more than one canonical topic. | [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md] |
| `unsupported_topic_source_kind` | A source label has a non-whitelisted kind. | [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md] |
| `unmapped_public_label` | A public source label does not map to a canonical topic. | [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md] |
| `non_public_reference` | A topic/reference relation resolves only through hidden, draft, archived, unsupported, unselected, or otherwise non-public content. | [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md] |
| `duplicate_public_reference` | The same `kind + slug` or `canonicalPath` appears twice in reference output. | [VERIFIED: src/domain/social-previews.ts] |

### Current Public Label Audit

The current public source corpus contains 10 public project-index records, 2 public writing entries, and 2 public themes. [VERIFIED: bun label-audit command] Public topic validation should require every label below to be intentionally mapped or intentionally rejected with an actionable finding. [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md]

| Source | Current Public Labels |
|--------|-----------------------|
| Project themes | `AI`, `Agentic engineering`, `Bitcoin`, `Cryptography`, `Design systems`, `Developer tooling`, `Finance`, `Identity`, `Math`, `Open systems`, `Open web`, `SolidJS`, `Web experiments`. [VERIFIED: bun label-audit command] |
| Project tags | `addresses`, `agents`, `ai`, `bitcoin`, `cloud`, `concept`, `coordination`, `developer-tools`, `experiment`, `finance`, `identity`, `math`, `open-source`, `open-web`, `profiles`, `proof-of-work`, `proposal`, `representation`, `solidjs`, `supporting-infrastructure`, `tailwind`, `ui`, `webgpu`, `websites`. [VERIFIED: bun label-audit command] |
| Writing topics | `Agentic engineering`, `Open web`. [VERIFIED: bun label-audit command] |
| Writing tags | `ai`, `developer-tools`, `identity`, `open-web`. [VERIFIED: bun label-audit command] |
| Theme titles | `Agentic engineering`, `Open identity`. [VERIFIED: bun label-audit command] |

### Anti-Patterns to Avoid

- **Raw tag routes:** Do not slugify every raw label into a route; unknown labels must not automatically become public topic routes. [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md]
- **Consumer-local visibility guards:** Do not make route, filter, feed, related-work, or preview helpers each decide what is public. [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md] [VERIFIED: .planning/milestones/v1.5-phases/29-archived-project-public-filter-guard/29-CONTEXT.md]
- **Synthetic fallback topics:** Do not return generic topic objects for unknown slugs; return `null`. [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md]
- **Diagnostic public helpers:** Do not return hidden-vs-unknown reasons from visitor-facing helpers. [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md]
- **Theme/topic conflation:** Do not use theme records as the only topic authority. [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md]
- **New runtime content dependencies:** Do not add GitHub, CMS, search-service, feed, or content API fetches for visitor discovery data. [VERIFIED: .planning/REQUIREMENTS.md]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Public content eligibility | Per-consumer `if status !== hidden` guards | Existing public selectors plus the new public reference envelope | Existing selectors already encode public project, writing, and theme eligibility. [VERIFIED: src/domain/projects.ts] [VERIFIED: src/domain/writing.ts] [VERIFIED: src/domain/themes.ts] |
| Topic route identity | Ad hoc `slugify(label)` calls in routes/UI | Canonical `TopicRecord.slug` and alias matching helpers | Raw source labels must normalize through the canonical contract. [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md] |
| Hidden-content fallback | "hidden", "draft", or "archived" reason objects in public helpers | `maybe...` helpers returning `null` | Public routes must not distinguish unknown from hidden or archived content. [VERIFIED: .planning/REQUIREMENTS.md] [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md] |
| Registry validation abstraction | A broad generic validation framework | Local `topic-validation.ts` with typed findings | Existing project, writing, theme, and social-preview validators are local modules with structured findings. [VERIFIED: src/domain/project-validation.ts] [VERIFIED: src/domain/writing-validation.ts] [VERIFIED: src/domain/theme-validation.ts] [VERIFIED: src/domain/social-previews.ts] |
| Test runner/script surface | New Python or external automation | Vitest and Bun scripts already in `package.json` | Repo standards forbid new Python scripts in Bun-friendly TypeScript repositories. [VERIFIED: standards/languages/typescript-javascript.md] [VERIFIED: package.json] |
| Static route/feed/search output | `/topics` files, feed XML, search UI, browser checks | Defer to Phases 31-36 | Phase 30 is pure domain helpers, validation, and tests only. [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md] |

**Key insight:** The hard part is not building a list of topics; it is proving every downstream consumer receives the same already-public, already-normalized references and cannot learn whether a missing input is hidden or unknown. [VERIFIED: .planning/REQUIREMENTS.md] [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md]

## Common Pitfalls

### Pitfall 1: Raw Labels Become Public Routes

**What goes wrong:** A later route or chip helper turns every project tag, writing tag, or theme title into `/topics/{slug}`. [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md]

**Why it happens:** Source registries contain visitor-facing labels, but those labels are not the canonical topic authority. [VERIFIED: src/domain/projects.ts] [VERIFIED: src/domain/writing.ts] [VERIFIED: src/domain/themes.ts]

**How to avoid:** Require every raw public label to resolve through `TopicRecord` aliases and fail validation for unmapped labels. [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md]

**Warning signs:** Tests assert route paths from raw tags or topic-chip code imports `curatedProjects`, `curatedWriting`, or `curatedThemes` directly. [VERIFIED: src/domain/routes.ts] [VERIFIED: src/domain/social-previews.ts]

### Pitfall 2: Public Helper Leaks Diagnostic Reasons

**What goes wrong:** Visitor routes can display or infer "archived topic", "draft writing", or "hidden project" instead of a generic not-found fallback. [VERIFIED: .planning/REQUIREMENTS.md]

**Why it happens:** Validation findings and public lookup results get merged into one API. [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md]

**How to avoid:** Keep detailed reasons in `validateTopicRegistry()` and return `null` from public `maybe...` lookup helpers. [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md]

**Warning signs:** A public helper returns a union such as `{ kind: "hidden" }`, `{ reason: "draft" }`, or a synthetic fallback topic. [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md]

### Pitfall 3: Duplicate Alias Collisions Are Detected Too Late

**What goes wrong:** Two canonical topics claim the same label after case/slug normalization, so chips, filters, and feeds disagree about a label's target. [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md]

**Why it happens:** Labels preserve display casing, while matching needs a normalized key. [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md]

**How to avoid:** Build one normalized alias map during validation and fail on the second claimant. [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md]

**Warning signs:** `AI` and `ai`, `Open web` and `open-web`, or `Developer tooling` and `developer-tools` appear in multiple topic records. [VERIFIED: bun label-audit command]

### Pitfall 4: Full Registry Records Leak Into Downstream Consumers

**What goes wrong:** Feed, related-work, or preview helpers receive full project/writing/theme records and accidentally use non-public fields or bypass public filtering. [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md]

**Why it happens:** Full records are convenient, but the phase requires a public reference envelope. [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md]

**How to avoid:** Export `PublicContentReference` records with only shared safe fields and optional safe facets. [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md]

**Warning signs:** Downstream code imports `curatedProjects`, `curatedWriting`, or `curatedThemes` when a `publicContentReferences()` helper exists. [VERIFIED: src/domain/social-previews.ts]

### Pitfall 5: Validator Uses Raw Curated Arrays Instead Of Public Selectors

**What goes wrong:** A hidden, draft, archived, unsupported, or unselected record can satisfy a topic/reference check. [VERIFIED: .planning/REQUIREMENTS.md]

**Why it happens:** Validation checks relationship existence against all curated data instead of the public helper output. [VERIFIED: src/domain/theme-validation.ts] [VERIFIED: src/domain/writing-validation.ts]

**How to avoid:** Public reference validation should compare topic references to `publicProjectIndexProjects()`, `publicWritingEntries()`, and `publicThemeEntries()` output. [VERIFIED: src/domain/projects.ts] [VERIFIED: src/domain/writing.ts] [VERIFIED: src/domain/themes.ts]

**Warning signs:** Tests with hidden/draft/archived fixtures pass when they should produce topic validation errors. [VERIFIED: src/domain/social-previews.test.ts] [VERIFIED: src/domain/theme-validation.test.ts]

## Code Examples

Verified patterns from official/local sources:

### Existing Public Selector Composition

```ts
// Source: src/domain/social-previews.ts
export function socialPreviewTargets(
  sources: SocialPreviewTargetSources = {},
): readonly SocialPreviewTarget[] {
  const projects = projectDetailPageProjects(sources.projects);
  const writingEntries = publicWritingEntries(sources.writingEntries);
  const themes = publicThemeEntries(sources.themes);

  return [
    indexTargetForRoute(routeByPath("/projects"), "projects-index"),
    ...projects.map(targetForProject),
    indexTargetForRoute(routeByPath("/writing"), "writing-index"),
    ...writingEntries.map(targetForWriting),
    indexTargetForRoute(routeByPath("/themes"), "themes-index"),
    ...themes.map(targetForTheme),
  ];
}
```

### Existing Nullable Lookup Style

```ts
// Source: src/domain/writing.ts
export function maybePublicWritingEntryBySlug(
  slug: string,
  entries: readonly WritingEntry[] = curatedWriting,
): PublicWritingEntry | null {
  return publicWritingEntries(entries).find((entry) => entry.slug === slug) ?? null;
}
```

### Existing Structured Validation Result

```ts
// Source: src/domain/theme-validation.ts
export function validateThemeRegistry(
  themes: readonly ThemeRecord[] = curatedThemes,
  projects: readonly ProjectStory[] = curatedProjects,
  writingEntries: readonly WritingEntry[] = curatedWriting,
): ThemeRegistryValidation {
  const issues = [
    ...themes.flatMap((theme) => validateThemeEntry(theme, projects, writingEntries)),
    ...duplicateSlugIssues(themes),
    ...duplicateDisplayOrderIssues(themes),
  ];

  return {
    issues,
    errors: issues.filter((issue) => issue.severity === "error"),
    warnings: issues.filter((issue) => issue.severity === "warning"),
  };
}
```

### Existing Curation Script Shape

```ts
// Source: scripts/verify-curation.ts
const projectResult = validateProjectRegistry(curatedProjects);
const writingResult = validateWritingRegistry(curatedWriting);
const themeResult = validateThemeRegistry(curatedThemes);
```

Phase 30 should add `topicResult = validateTopicRegistry(...)`, print topic warnings/errors with a `topic/` or `discovery/` prefix, and include topic errors in the exit condition. [VERIFIED: scripts/verify-curation.ts] [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md]

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Writing routes from ad hoc or future content sources | Checked-in `curatedWriting`, `publicWritingEntries()`, nullable lookup, and writing validation | Phase 14 | Discovery should follow the writing-domain pattern. [VERIFIED: .planning/milestones/v1.3-phases/14-writing-domain-foundation/14-CONTEXT.md] [VERIFIED: src/domain/writing.ts] |
| Theme relationships as future UI-only links | Checked-in `curatedThemes`, public theme selectors, relationship resolution, and theme validation | Phase 19 | Topics should stay distinct from themes but reuse theme public selector patterns. [VERIFIED: .planning/milestones/v1.4-phases/19-theme-domain-foundation/19-CONTEXT.md] [VERIFIED: src/domain/themes.ts] |
| Social previews deriving route targets independently | `socialPreviewTargets()` composes public project, writing, theme, and route helpers | Phase 24 | Discovery references should compose existing helpers instead of duplicating visibility rules. [VERIFIED: .planning/milestones/v1.5-phases/24-social-image-data-contract/24-CONTEXT.md] [VERIFIED: src/domain/social-previews.ts] |
| Archived projects leaking through selected-looking public flows | Shared public project predicate excludes archived `status` and `maturity` records | Phase 29 | Topic references must rely on public selectors to preserve the archive guard. [VERIFIED: .planning/milestones/v1.5-phases/29-archived-project-public-filter-guard/29-CONTEXT.md] [VERIFIED: src/domain/projects.ts] |

**Deprecated/outdated:**

- Maintaining separate topic/filter/feed/preview indexes is out of scope for Phase 30 and contradicts the one-reference-contract decision. [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md]
- Adding Contentlayer, MDX, CMS data, hosted search, runtime GitHub/content fetches, or dynamic route data endpoints is out of scope for v1.6 static discovery. [VERIFIED: .planning/REQUIREMENTS.md]

## Assumptions Log

> List all claims tagged `[ASSUMED]` in this research. The planner and discuss-phase use this section to identify decisions that need user confirmation before execution.

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| - | None | - | - |

**If this table is empty:** All claims in this research were verified or cited; no user confirmation is needed before planning. [VERIFIED: sources listed below]

## Open Questions

1. **Exact semantic alias grouping**
   - What we know: Every current public project theme/tag, writing topic/tag, and theme title must map intentionally or fail validation. [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md] [VERIFIED: bun label-audit command]
   - What's unclear: The user has not locked whether lower-level tags such as `addresses`, `proposal`, `concept`, or `supporting-infrastructure` should become separate canonical topics or aliases of broader topics. [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md]
   - Recommendation: Plan a conservative initial registry and let `validateTopicRegistry()` fail until every public source label is explicitly represented by a slug, label, or alias. [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Bun | Repo scripts and TypeScript script execution | Yes | Local `1.3.9`; packageManager pin `1.3.14` | No fallback for repo-owned scripts; use `bun run`. [VERIFIED: bun --version] [VERIFIED: package.json] |
| Node | Tool compatibility and npm registry queries | Yes | `v24.13.0` | Bun remains the repo script runner. [VERIFIED: node --version] [VERIFIED: package.json] |
| npm | Version research only | Yes | `11.6.2` | Not required for implementation. [VERIFIED: npm --version] |
| Vitest | Targeted domain tests | Yes through Bun | `vitest/4.1.7 darwin-arm64 node-v24.13.0` | No fallback; use `bun run vitest ...` or `bun run test`. [VERIFIED: bun run vitest --version] [VERIFIED: package.json] |
| Biome | Format/lint checks | Yes through Bun | `2.4.15` | No fallback needed. [VERIFIED: bun run biome --version] [VERIFIED: package.json] |
| TypeScript compiler | Typecheck | Yes through Bun | `6.0.3` | No fallback needed. [VERIFIED: bun run tsc --version] [VERIFIED: package.json] |
| Curation verifier | Existing registry gate | Yes | Current output: `10 projects, 2 writing entries, 2 themes, 0 warnings` | Extend with topic validation. [VERIFIED: bun run scripts/verify-curation.ts] |

**Missing dependencies with no fallback:**
- None found for Phase 30 research and planned implementation. [VERIFIED: Environment Availability commands]

**Missing dependencies with fallback:**
- Local Bun is older than the packageManager pin, but current curation and tool version probes ran successfully with local Bun `1.3.9`. [VERIFIED: bun --version] [VERIFIED: bun run scripts/verify-curation.ts]

## Security Domain

Security enforcement is enabled by default because `.planning/config.json` does not set `security_enforcement` to `false`. [VERIFIED: .planning/config.json]

OWASP ASVS provides a basis for testing web application technical security controls and secure development requirements. [CITED: https://owasp.org/www-project-application-security-verification-standard/]

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | Phase 30 has no authentication surface. [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md] |
| V3 Session Management | No | Phase 30 has no session state. [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md] |
| V4 Access Control | Yes | Public selector composition and non-leaking `null` fallbacks prevent hidden/draft/archived content exposure. [VERIFIED: .planning/REQUIREMENTS.md] [VERIFIED: src/domain/projects.ts] [VERIFIED: src/domain/writing.ts] [VERIFIED: src/domain/themes.ts] |
| V5 Input Validation | Yes | Topic slug, label, alias, source-kind, and source-label validation should reject malformed or unsupported inputs before route generation. [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md] |
| V6 Cryptography | No | Phase 30 does not add hashing, tokens, encryption, or signing. [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md] |

### Known Threat Patterns for Static Discovery

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Hidden content disclosure through topic lookup | Information Disclosure | Build public references only from existing public selectors and return `null` for unknown/non-public inputs. [VERIFIED: .planning/REQUIREMENTS.md] [VERIFIED: src/domain/projects.ts] [VERIFIED: src/domain/writing.ts] [VERIFIED: src/domain/themes.ts] |
| Topic slug enumeration reveals private status | Information Disclosure | Do not expose diagnostic reasons from public helpers; keep reasons in curation validation only. [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md] |
| Alias collision sends visitors to wrong topic | Tampering | Validate duplicate/colliding labels and aliases before static routes are generated. [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md] |
| Runtime content fetch accidentally bypasses checked-in selectors | Information Disclosure | Keep helpers pure and reject visitor-runtime GitHub, CMS, search-service, feed, or content API dependencies. [VERIFIED: .planning/REQUIREMENTS.md] [VERIFIED: standards/core/architecture.md] |

## Sources

### Primary (HIGH confidence)

- `.planning/phases/30-content-discovery-foundation/30-CONTEXT.md` - locked phase decisions, deferrals, and implementation constraints.
- `.planning/REQUIREMENTS.md` - DISC-04 requirement and static-first v1.6 exclusions.
- `.planning/ROADMAP.md` - Phase 30 success criteria and downstream phase boundaries.
- `.planning/STATE.md` - current milestone state and Phase 29 public-filter history.
- `AGENTS.md`, `AGENTS.bright-builds.md`, `standards-overrides.md` - repo-local instructions, Bright Builds workflow, and local exception state.
- `standards/core/architecture.md`, `standards/core/code-shape.md`, `standards/core/testing.md`, `standards/core/verification.md`, `standards/languages/typescript-javascript.md` - applicable architecture, naming, test, verification, and TypeScript/Bun rules.
- `src/domain/projects.ts`, `src/domain/writing.ts`, `src/domain/themes.ts`, `src/domain/social-previews.ts` - existing public selector and helper composition patterns.
- `src/domain/project-validation.ts`, `src/domain/writing-validation.ts`, `src/domain/theme-validation.ts`, `scripts/verify-curation.ts` - structured validation and aggregate curation gate patterns.
- `src/domain/*.test.ts`, `scripts/*test.ts` - Vitest test style and fixture patterns.
- `package.json` - repo script and dependency surface.
- npm registry queries - package latest and publish/version verification.

### Secondary (MEDIUM confidence)

- OWASP ASVS project page - ASVS purpose and current 5.0.0 publication context. [CITED: https://owasp.org/www-project-application-security-verification-standard/]

### Tertiary (LOW confidence)

- None.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - The phase uses existing repo-owned TypeScript, Bun, Vitest, Biome, and curation-script surfaces verified locally and in `package.json`. [VERIFIED: package.json] [VERIFIED: Environment Availability commands]
- Architecture: HIGH - The recommendation directly mirrors existing project, writing, theme, and social-preview domain patterns. [VERIFIED: src/domain/projects.ts] [VERIFIED: src/domain/writing.ts] [VERIFIED: src/domain/themes.ts] [VERIFIED: src/domain/social-previews.ts]
- Pitfalls: HIGH - The pitfalls are derived from locked Phase 30 decisions, v1.6 requirements, and prior Phase 24/29 visibility lessons. [VERIFIED: .planning/phases/30-content-discovery-foundation/30-CONTEXT.md] [VERIFIED: .planning/milestones/v1.5-phases/24-social-image-data-contract/24-CONTEXT.md] [VERIFIED: .planning/milestones/v1.5-phases/29-archived-project-public-filter-guard/29-CONTEXT.md]

**Research date:** 2026-06-26
**Valid until:** 2026-07-26 for codebase architecture; re-check npm package versions if a plan proposes dependency updates. [VERIFIED: npm registry]
