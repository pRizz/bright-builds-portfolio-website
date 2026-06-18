---
phase: 21
phase_slug: collaboration-pathways-and-cross-links
verified: 2026-06-18T00:26:57Z
status: passed
score: "5/5 must-haves verified"
generated_by: gsd-verifier
lifecycle_mode: yolo
phase_lifecycle_id: 21-2026-06-17T22-54-40
generated_at: 2026-06-18T00:26:57Z
lifecycle_validated: true
overrides_applied: 0
requirements_evidence:
  - id: SYNTH-02
    status: passed
    evidence:
      - "src/domain/themes.ts:145 assembles collaborationActionsForTheme from selected project, source/live, and public writing helpers."
      - "src/routes/themes/[slug].tsx:44 and :89 render helper-derived collaboration actions on public theme detail pages."
      - "tests/theme-detail-route.test.tsx:15 verifies project, source/live, and writing links on a public theme route."
  - id: SYNTH-03
    status: passed
    evidence:
      - "src/domain/themes.ts:127 and :136 expose publicThemeEntriesForProject and publicThemeEntriesForWritingEntry."
      - "src/routes/projects/[slug].tsx:243 and :310 render related theme paths as a secondary project aside panel."
      - "src/routes/writing/[slug].tsx:165 renders related theme paths after related projects."
  - id: COLLAB-01
    status: passed
    evidence:
      - "src/routes/themes/[slug].tsx:121 renders Collaboration starting points and :126 renders Where to start with theme.collaborationAngle."
      - "src/domain/themes.ts:152 includes project story, reviewed source/live, and writing actions; :162 falls back to /contact only when no actions resolve."
      - "scripts/verify-static/expected-route-text.ts:275 requires collaboration panel text and action hrefs in static HTML."
  - id: COLLAB-02
    status: passed
    evidence:
      - "src/domain/themes.ts:150-155 derives actions from existing project and writing registries, and :213 uses checked-in GitHub homepage metadata."
      - "src/routes/themes/[slug].tsx:133-138 renders action hrefs with external target/rel safety from helper data."
      - "No runtime fetch, token, or live reachability logic was found in Phase 21 source paths."
  - id: COLLAB-03
    status: passed
    evidence:
      - "src/components/SiteLayout.tsx:47 keeps the low-intrusion footer OpenLinks profile link with rel=\"me noopener noreferrer\"."
      - "src/domain/themes.test.ts:436 proves agentic theme actions do not add a generic OpenLinks profile action."
      - "tests/theme-detail-route.test.tsx:50 verifies the public agentic theme route does not contain OpenLinks profile."
gaps: []
human_verification: []
---

# Phase 21: Collaboration Pathways and Cross-Links Verification Report

**Phase Goal:** Visitors can move from theme paths into related projects, writing, and useful collaboration starting points without making identity links the primary call to action.
**Verified:** 2026-06-18T00:26:57Z
**Status:** passed
**Re-verification:** No - initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
| --- | --- | --- | --- |
| 1 | Visitor can move from theme detail pages to related selected project stories and public writing entries through helper-derived relationships. | VERIFIED | `collaborationActionsForTheme()` builds project story and writing actions in `src/domain/themes.ts:145`; theme detail route calls it at `src/routes/themes/[slug].tsx:44` and renders anchors at `:130`. |
| 2 | Visitor can find related theme links on project and writing surfaces where those links clarify the graph without overwhelming the main narrative. | VERIFIED | Project detail renders `RelatedThemesPanel` after related writing at `src/routes/projects/[slug].tsx:243`; writing detail renders related themes after related projects at `src/routes/writing/[slug].tsx:165`. |
| 3 | Visitor can identify a useful collaboration starting point for each theme, including source/live/writing and practical next actions when available. | VERIFIED | Theme panel renders `Collaboration starting points`, `Where to start`, and theme `collaborationAngle` at `src/routes/themes/[slug].tsx:121-128`; helper includes project story, source, live surface, writing, and `/contact` fallback at `src/domain/themes.ts:152-169`. |
| 4 | Theme collaboration panels use existing curated project, writing, profile, GitHub, and OpenLinks data without unreviewed external-link sources or live reachability claims. | VERIFIED | Helper uses curated project/writing registries and checked-in GitHub metadata at `src/domain/themes.ts:147-155` and `:213`; no `fetch(`, token, or reachability code found in Phase 21 source paths. |
| 5 | OpenLinks remains discoverable as a low-intrusion identity hub and does not become the primary theme CTA. | VERIFIED | Footer link remains low-intrusion in `src/components/SiteLayout.tsx:47-54`; tests reject generic `OpenLinks profile` on the agentic theme route at `tests/theme-detail-route.test.tsx:50`. |

**Score:** 5/5 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
| --- | --- | --- | --- |
| `src/domain/themes.ts` | Reciprocal public theme helpers and collaboration action helper | VERIFIED | Exports `publicThemeEntriesForProject`, `publicThemeEntriesForWritingEntry`, and `collaborationActionsForTheme`; gsd artifact/key-link checks passed. |
| `src/domain/themes.test.ts` | Focused helper/action tests | VERIFIED | Covers public-only filtering, display order, action order, OpenLinks posture, contact fallback, and deduplication. |
| `src/routes/themes/[slug].tsx` | Theme collaboration panel | VERIFIED | Public route gates through `maybePublicThemeEntryBySlug`; panel renders helper-derived anchors with `target`/`rel` safety. |
| `src/routes/projects/[slug].tsx` | Selected project related-theme panel | VERIFIED | Uses `publicThemeEntriesForProject()` and `themeDetailPath(theme)` in a secondary aside panel. |
| `src/routes/writing/[slug].tsx` | Public writing related-theme section | VERIFIED | Uses `publicThemeEntriesForWritingEntry()` and `themeDetailPath(theme)` after related projects. |
| `tests/theme-detail-route.test.tsx` | SSR theme collaboration/fallback assertions | VERIFIED | Proves public collaboration links and unknown-route non-leakage. |
| `tests/collaboration-route-links.test.tsx` | SSR project/writing reciprocal link assertions | VERIFIED | Proves related theme links, omission for unrelated projects, and writing placement after related projects. |
| `scripts/verify-static/expected-route-text.ts` | Static HTML expected text coverage | VERIFIED | Expected text derives from Phase 21 helpers for theme, project, and writing routes. |
| `tests/browser-release.playwright.ts` | Browser keyboard/dark layout coverage | VERIFIED | Helper-derived keyboard focus targets cover theme collaboration and reciprocal theme links; orchestrator reported full browser verify passed. |

### Key Link Verification

| From | To | Via | Status | Details |
| --- | --- | --- | --- | --- |
| `src/domain/themes.ts` | `src/domain/projects.ts` | `projectDetailPath`, selected project records, reviewed project links | VERIFIED | gsd key-link check passed; source uses imports at lines 2-9 and action generation at lines 196-219. |
| `src/domain/themes.ts` | `src/domain/writing.ts` | `writingDetailPath`, public writing records | VERIFIED | gsd key-link check passed; writing action generated at lines 258-265. |
| `src/domain/themes.ts` | `src/domain/github-metadata.ts` | `maybeGitHubHomepageLinkForProject()` | VERIFIED | gsd key-link check passed; homepage metadata used at line 213. |
| `src/routes/themes/[slug].tsx` | `src/domain/themes.ts` | `collaborationActionsForTheme(theme)` | VERIFIED | Import and call at lines 4-11 and 44; anchors rendered at lines 130-140. |
| `src/routes/projects/[slug].tsx` | `src/domain/themes.ts` | `publicThemeEntriesForProject(project)`, `themeDetailPath(theme)` | VERIFIED | Import at lines 20-24; panel at lines 310-340. |
| `src/routes/writing/[slug].tsx` | `src/domain/themes.ts` | `publicThemeEntriesForWritingEntry(entry)`, `themeDetailPath(theme)` | VERIFIED | Import at lines 11-15; section at lines 165-186. |
| `scripts/verify-static/expected-route-text.ts` | `src/domain/themes.ts` | Phase 21 helper-derived expected text | VERIFIED | Imports at lines 15-25; theme/project/writing expectations at lines 275-315 and 420-434. |
| `tests/browser-release.playwright.ts` | Built static route server | Playwright keyboard focus traversal | VERIFIED | Focus checks for theme/project/writing collaboration links at lines 101-238 and helper representatives at lines 306-368. |

### Data-Flow Trace

| Artifact | Data Variable | Source | Produces Real Data | Status |
| --- | --- | --- | --- | --- |
| `src/routes/themes/[slug].tsx` | `collaborationActions` | `maybePublicThemeEntryBySlug(params.slug)` -> `collaborationActionsForTheme(theme)` -> curated project/writing/GitHub metadata | Yes | FLOWING |
| `src/routes/projects/[slug].tsx` | `relatedThemes()` | selected project route slug -> `publicThemeEntriesForProject(props.project)` -> `curatedThemes` public filter | Yes | FLOWING |
| `src/routes/writing/[slug].tsx` | `relatedThemes` | public writing slug -> `publicThemeEntriesForWritingEntry(entry)` -> `curatedThemes` public filter | Yes | FLOWING |
| `scripts/verify-static/expected-route-text.ts` | expected collaboration/related theme text | prerender route -> same public domain helpers used by route surfaces | Yes | FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
| --- | --- | --- | --- |
| Helper and SSR/static expected-text behavior | `bun run test src/domain/themes.test.ts tests/theme-detail-route.test.tsx tests/collaboration-route-links.test.tsx scripts/verify-static.test.ts` | 4 files passed, 32 tests passed | PASS |
| Full release browser/static verification | Orchestrator-provided evidence: `bun run verify` | Passed: 83 Playwright checks, 19 intended reduced-motion layout skips, static route verification passed for 16 prerendered routes/metadata/JSON-LD/assets/sitemap/robots | PASS |
| Code review | `.planning/phases/21-collaboration-pathways-and-cross-links/21-REVIEW.md` | status: clean; critical 0, warning 0, info 0 | PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
| --- | --- | --- | --- | --- |
| SYNTH-02 | 21-01, 21-02, 21-04 | Theme detail pages link to selected project stories and public writing through helper-derived relationships. | SATISFIED | Domain helper at `src/domain/themes.ts:145`; route render at `src/routes/themes/[slug].tsx:44` and SSR/static tests. |
| SYNTH-03 | 21-01, 21-03, 21-04 | Project and writing surfaces show related theme links without overwhelming primary narrative. | SATISFIED | Secondary project panel at `src/routes/projects/[slug].tsx:243-244`; writing section after related projects at `src/routes/writing/[slug].tsx:142-186`. |
| COLLAB-01 | 21-01, 21-02, 21-04 | Visitors can identify useful collaboration starting points for each theme. | SATISFIED | `Collaboration starting points`, `Where to start`, helper-derived source/live/writing links, and contact fallback are implemented and tested. |
| COLLAB-02 | 21-01, 21-02, 21-04 | Collaboration panels use existing curated data, not unreviewed link sources or live reachability claims. | SATISFIED | Helpers consume existing project/writing/GitHub data; no runtime fetch/live check/token pattern found in Phase 21 source paths. |
| COLLAB-03 | 21-01, 21-02, 21-03, 21-04 | OpenLinks stays low-intrusion and not the primary theme CTA. | SATISFIED | Footer/profile identity link remains; generic theme CTA is absent and guarded by tests. |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
| --- | --- | --- | --- | --- |
| None | - | - | - | Stub scan found only normal nullable/empty helper returns in helper/test/static verification code, not user-visible placeholder behavior. |

### Human Verification Required

None. The phase goal is covered by source inspection, SSR/static checks, targeted tests, and the orchestrator-provided browser verification for dark desktop/mobile layout, keyboard focus, axe, reduced motion, and text-overlap checks.

### Gaps Summary

No blockers found. The phase goal is achieved: theme detail pages expose practical collaboration pathways into project stories, source/live surfaces, and writing; project and writing detail pages reciprocally expose related theme paths; and OpenLinks remains a low-intrusion identity surface rather than a generic primary theme CTA.

---

_Verified: 2026-06-18T00:26:57Z_
_Verifier: the agent (gsd-verifier)_
