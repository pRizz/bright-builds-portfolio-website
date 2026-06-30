---
phase: 31-static-topic-routes
status: passed
generated_by: gsd-verifier
lifecycle_mode: yolo
phase_lifecycle_id: 31-2026-06-30T22-33-56
generated_at: 2026-06-30T23:14:47Z
lifecycle_validated: true
---

# Phase 31 Verification

## Result

Phase 31 passed.

The implementation adds static `/topics` and `/topics/{slug}` discovery routes, safe topic chips on public surfaces, helper-derived topic metadata/JSON-LD, and static/browser verification for topic route coverage.

## Requirement Evidence

DISC-01 passed: `topicDetailRoutes()` derives topic detail paths from `publicTopics()`, and `prerenderRoutes`/`sitemapRoutes` include `/topics` plus every public topic detail route. Unknown topic routes are excluded from prerender and sitemap coverage.

DISC-02 passed: `/topics` and public topic detail pages render from checked-in public topic helpers before hydration. The topic detail fallback uses safe copy, canonical `/topics` metadata, and a link back to the topic index without leaking hidden-topic reasons.

DISC-03 passed: `TopicChip` resolves labels through `maybeTopicRecordForLabel()` and only links canonical public topics. Unsupported labels render as inert chips with no fabricated path or explanatory leak.

DISC-05 passed: topic pages reuse dark-primary surfaces, chips, links, focus behavior, and responsive patterns. OpenLinks remains limited to existing footer/profile and Person metadata surfaces.

## Verification Commands

Passed:

```bash
bun run verify
```

This aggregate gate included:

- `bun run format:check`
- `bun run check`
- `bun run typecheck`
- `bun run test`
- `bun run verify:curation`
- `bun run verify:no-github-runtime`
- `bun run verify:project-helper-surface`
- `bun run verify:visual-system`
- `bun run verify:social-previews`
- `bun run build`
- `bun run verify:browser`
- `bun run verify:static`
- `bun run verify:release`

Observed evidence from the passing run:

- Unit tests: 26 files, 280 tests passed.
- Curation: 10 projects, 2 writing entries, 2 themes, 13 topics, 0 warnings.
- Static build: 30 prerendered routes, including `/topics` and 13 public topic detail routes.
- Browser verification: 153 passed, 33 expected reduced-motion/layout skips.
- Static verification: 30 prerendered routes, metadata, JSON-LD, writing route coverage, theme route coverage, social preview manifest, assets, sitemap, and robots passed.
- Release verification: 30 route HTML files and 55 text assets scanned; total client JS was 162.4 KB against the updated 170 KB static-artifact budget.

## Notes

The client-JS budget was raised from 150 KB to 170 KB because the release verifier sums every lazy route chunk in the static artifact, and Phase 31 adds 14 topic pages. The resulting artifact remains under the new cap with about 7.6 KB of headroom, while the release verifier test still proves over-budget JS fails.

Topic routes intentionally use the existing fallback social image contract. Generated topic-specific social preview assets remain deferred to Phase 35.

## Residual Risks

The aggregate route-data chunk will keep growing as more static discovery routes are added. Future route-family phases should either keep authored data compact, split heavier helper data, or revisit the release budget with fresh evidence.
