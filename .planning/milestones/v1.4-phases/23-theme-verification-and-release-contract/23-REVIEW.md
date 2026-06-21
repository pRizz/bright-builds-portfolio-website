---
phase: 23-theme-verification-and-release-contract
reviewed: 2026-06-18T05:37:56Z
depth: standard
files_reviewed: 9
files_reviewed_list:
  - package.json
  - scripts/release-readiness.ts
  - scripts/release-readiness.test.ts
  - scripts/verify-release.test.ts
  - scripts/verify-static/run-static-verification.ts
  - scripts/verify-static.test.ts
  - docs/release-readiness.md
  - README.md
  - CONTRIBUTING.md
findings:
  critical: 0
  warning: 2
  info: 0
  total: 2
status: issues_found
---

# Phase 23: Code Review Report

**Reviewed:** 2026-06-18T05:37:56Z
**Depth:** standard
**Files Reviewed:** 9
**Status:** issues_found

## Summary

Reviewed the release-readiness script, package release scripts, static verifier test coverage, release documentation, README, and contribution guidance. The package scripts and targeted tests are internally consistent, and the post-build static/release verifiers pass against the current `.output/public` artifact.

Review context loaded: `AGENTS.md`, `AGENTS.bright-builds.md`, `standards-overrides.md`, `standards/index.md`, `standards/core/architecture.md`, `standards/core/code-shape.md`, `standards/core/verification.md`, `standards/core/testing.md`, and `standards/languages/typescript-javascript.md`. No repo-local `.claude/skills/` or `.agents/skills/` directories were present.

The remaining concerns are release-contract truthfulness issues: the docs verifier can pass misleading documentation because it only looks for substrings, and the emitted release evidence labels still mix automated local checks with manual deployment/smoke-check obligations.

Verification performed during review:

- `bun run test -- scripts/release-readiness.test.ts scripts/verify-release.test.ts scripts/verify-static.test.ts`
- `bun run typecheck`
- `bun run format:check`
- `bun run check`
- `bun run verify:static`
- `bun run verify:release`

## Warnings

### WR-01: Release Document Contract Can Pass Negated Or Misleading Claims

**File:** `scripts/release-readiness.ts:214`
**Issue:** `releaseReadinessDocumentFindings` treats each required release-readiness fact as present whenever `normalizedDocumentText.includes(fact.text)` is true. That means a document can say a required gate is *not* run, or mention a required route only as a warning or historical note, and the release verifier still accepts it. For a release-contract check, plain substring presence is too weak and can overclaim automated evidence from misleading docs.
**Fix:** Replace loose string facts with section-aware or pattern-based positive assertions, and add a regression fixture that includes the required words in a negated sentence and still fails.

```ts
type RequiredDocumentFact = {
  label: string;
  pattern: RegExp;
  expectedDescription: string;
};

const requiredReleaseReadinessDocumentFacts = [
  {
    label: "aggregate release command",
    pattern: /```bash\s*bun run verify\s*```/m,
    expectedDescription: "a bash command block containing bun run verify",
  },
  {
    label: "browser release gate",
    pattern: /## Automated Gates[\s\S]*### Browser and Accessibility[\s\S]*`bun run verify:browser` runs/m,
    expectedDescription: "positive Browser and Accessibility gate guidance",
  },
] as const satisfies readonly RequiredDocumentFact[];
```

### WR-02: Release Evidence Labels Include Manual Deployment And Smoke Checks

**File:** `scripts/release-readiness.ts:229`
**Issue:** `releaseReadinessEvidenceLabels()` returns `"Cloudflare/static deployment"` and `"preview and deploy smoke checks"`, and `verify:release` prints them as release evidence labels after a local-only verifier run. Those items are manual/deployment checklist obligations in `docs/release-readiness.md`, not automated evidence produced by `bun run verify:release`. This blurs the boundary the docs otherwise try to preserve between local deterministic gates and manual preview/production checks.
**Fix:** Split automated labels from manual checklist labels, and update `scripts/release-readiness.test.ts:417` so it no longer says these manual items are "covered by the aggregate gate."

```ts
export function automatedReleaseReadinessEvidenceLabels(): readonly string[] {
  return [
    "SEO/static metadata",
    "project detail route coverage",
    "writing route coverage",
    "theme route coverage",
    "static performance budgets",
    "external link policy",
  ];
}

export function manualReleaseChecklistLabels(): readonly string[] {
  return ["Cloudflare/static deployment", "preview and deploy smoke checks"];
}
```

---

_Reviewed: 2026-06-18T05:37:56Z_
_Reviewer: the agent (gsd-code-reviewer)_
_Depth: standard_
