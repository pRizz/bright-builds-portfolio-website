---
phase: 05-github-enrichment-release-verification
reviewed: 2026-05-27T13:31:53Z
depth: standard
files_reviewed: 14
files_reviewed_list:
  - CONTRIBUTING.md
  - README.md
  - package.json
  - scripts/sync-github-metadata.test.ts
  - scripts/sync-github-metadata.ts
  - scripts/verify-release.test.ts
  - scripts/verify-release.ts
  - scripts/verify-static.ts
  - src/domain/github-metadata.snapshot.json
  - src/domain/github-metadata.test.ts
  - src/domain/github-metadata.ts
  - src/routes/index.tsx
  - src/routes/projects.tsx
  - src/styles/app.css
findings:
  critical: 2
  warning: 0
  info: 0
  total: 2
finding_counts:
  critical: 2
  warning: 0
  info: 0
  total: 2
status: issues_found
---

# Phase 05: Code Review Report

**Reviewed:** 2026-05-27T13:31:53Z
**Depth:** standard
**Files Reviewed:** 14
**Status:** issues_found

## Summary

Reviewed the listed documentation, package scripts, GitHub metadata sync/enrichment code, release verification scripts, route rendering, snapshot data, tests, and CSS at standard depth. This review used the repo-local `AGENTS.md`, `AGENTS.bright-builds.md`, `standards-overrides.md`, the pinned Bright Builds standards for architecture, code shape, verification, testing, TypeScript/JavaScript, and the OpenLinks placement guidance required by the repo.

Automated checks run during review:

- `bun run typecheck` passed.
- `bun run test` passed: 7 files, 62 tests.

## Critical Issues

### CR-01: Secret Scanner Prints Matched Token Values

**File:** `scripts/verify-release.ts:106`
**Issue:** `forbiddenBuiltOutputFindings` includes `match[0]` in the finding message. `runReleaseVerification` later prints that message to stderr, so if built output contains a real GitHub token, the release verifier copies the secret into local or CI logs. That turns a detector into an additional leak path.
**Fix:**

```ts
findings.push({
  path: file.path,
  label: forbidden.label,
  message: `Built output contains forbidden ${forbidden.label}; value redacted.`,
});
```

Add a regression test that passes a token-like value and asserts the label is reported while the raw token is absent from every finding message.

### CR-02: GitHub Homepage Metadata Can Render Unsafe Hrefs

**File:** `src/domain/github-metadata.ts:167`
**Issue:** `maybeGitHubHomepageLinkForProject` parses the GitHub `homepageUrl` only for duplicate comparison, then returns the original trimmed value as `href`. Because the sync script stores GitHub API `homepage` strings without protocol allowlisting, a future snapshot could render `javascript:`, `data:`, or another unsafe scheme into the home/projects link lists.
**Fix:**

```ts
function maybeHttpUrl(value: string): URL | null {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(value);
  } catch {
    return null;
  }

  if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") {
    return null;
  }

  return parsedUrl;
}
```

Use that allowlist before creating the returned `ProjectLink`, return the normalized safe URL string, and add tests for `javascript:`, `data:`, and valid HTTPS homepage values.

---

_Reviewed: 2026-05-27T13:31:53Z_
_Reviewer: the agent (gsd-code-reviewer)_
_Depth: standard_
