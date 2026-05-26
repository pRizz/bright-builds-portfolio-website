---
phase: 04-visual-system-motion
reviewed: 2026-05-26T19:07:40Z
depth: standard
files_reviewed: 12
files_reviewed_list:
  - package.json
  - scripts/verify-static.ts
  - scripts/verify-visual-system.ts
  - src/components/SiteLayout.tsx
  - src/components/ReactiveSurface.tsx
  - src/components/visual-motion.ts
  - src/components/visual-motion.test.ts
  - src/routes/index.tsx
  - src/routes/projects.tsx
  - src/routes/about.tsx
  - src/routes/contact.tsx
  - src/styles/app.css
findings:
  critical: 0
  warning: 3
  info: 0
  total: 3
status: issues_found
---

# Phase 04: Code Review Report

**Reviewed:** 2026-05-26T19:07:40Z
**Depth:** standard
**Files Reviewed:** 12
**Status:** issues_found

## Summary

Reviewed the Phase 04 visual-system and motion source files against the repo-local dark-primary guidance, `AGENTS.bright-builds.md`, `standards-overrides.md`, the pinned Bright Builds standards for architecture, code shape, verification, testing, and TypeScript/JavaScript, plus the OpenLinks low-intrusion placement guidance. No project-local skills were present under `.claude/skills/` or `.agents/skills/`.

Runtime source is generally scoped correctly to UI/component layers, and OpenLinks remains low-intrusion. The main concerns are an incomplete reduced-motion CSS fallback and two verifier assumptions that can let regressions through or block valid content.

## Warnings

### WR-01: Reduced-motion fallback does not override all hover/focus motion

**File:** `/Users/peterryszkiewicz/Repos/bright-builds-portfolio-website/src/styles/app.css:570`
**Issue:** The reduced-motion/coarse/small-viewport fallback only resets `.reactive-surface::before`, `.reactive-card::before`, and `.reactive-card` transforms. It does not match the higher-specificity hover/focus pseudo-element rules at lines 207-209 and 403-406, so reactive highlights can still become visible on hover/focus. It also leaves non-reactive lift selectors from lines 361-377, such as `.interactive-surface`, `.surface-link`, `.theme-card`, and `.contact-card`, able to translate under `prefers-reduced-motion: reduce`.
**Fix:**
```css
@media (prefers-reduced-motion: reduce), (pointer: coarse), (max-width: 640px) {
  .reactive-surface::before,
  .reactive-surface:hover::before,
  .reactive-surface:focus-within::before,
  .reactive-card::before,
  .reactive-card:hover::before,
  .reactive-card:focus-within::before,
  .reactive-card:focus-visible::before {
    opacity: 0;
  }

  .interactive-surface:hover,
  .interactive-surface:focus-within,
  .reactive-card:hover,
  .reactive-card:focus-within,
  .reactive-card:focus-visible,
  .surface-link:hover,
  .surface-link:focus-visible,
  .focus-row:hover,
  .focus-row:focus-visible,
  .story-card:hover,
  .story-card:focus-within,
  .project-anchor-card:hover,
  .project-anchor-card:focus-within,
  .theme-card:hover,
  .theme-card:focus-within,
  .contact-card:hover,
  .contact-card:focus-visible {
    transform: none;
  }
}
```

### WR-02: Domain-boundary verifier scans strings and comments as code identifiers

**File:** `/Users/peterryszkiewicz/Repos/bright-builds-portfolio-website/scripts/verify-visual-system.ts:84`
**Issue:** `forbiddenDomainIdentifiers` uses raw regexes over entire domain source files. That treats normal curated content strings or comments containing words like `window`, `document`, or `navigator` as forbidden DOM coupling, even though they are not code identifiers. This can create false positives in this content-heavy portfolio registry and conflicts with the verifier's intent to scan code identifiers.
**Fix:**
```ts
import * as ts from "typescript";

const forbiddenDomainIdentifierNames = new Set([
  "window",
  "document",
  "navigator",
  "matchMedia",
  "requestAnimationFrame",
  "addEventListener",
  "ReactiveSurface",
  "onCleanup",
]);

function findingsForForbiddenIdentifiers(file: string, source: string): Finding[] {
  const sourceFile = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const findings: Finding[] = [];

  const visit = (node: ts.Node) => {
    if (ts.isIdentifier(node) && forbiddenDomainIdentifierNames.has(node.text)) {
      const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
      findings.push({ file, line: line + 1, label: `${node.text} identifier`, text: node.text });
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
  return findings;
}
```

### WR-03: Cleanup verifier can pass when listener or frame cleanup regresses

**File:** `/Users/peterryszkiewicz/Repos/bright-builds-portfolio-website/scripts/verify-visual-system.ts:202`
**Issue:** `assertReactiveSurfaceCleanup` only checks that broad tokens such as `removeEventListener`, `cancelAnimationFrame`, and `onCleanup` appear somewhere in `ReactiveSurface.tsx`. A regression could add another listener, remove a specific cleanup pairing, or leave the tokens in unrelated code and still pass. That weakens the Phase 04 cleanup guard for pointer listeners and animation frames.
**Fix:**
```ts
const requiredCleanupPairs = [
  {
    add: 'element.addEventListener("pointermove", handlePointerMove)',
    remove: 'element.removeEventListener("pointermove", handlePointerMove)',
  },
  {
    add: 'document.addEventListener("visibilitychange", handleVisibilityChange)',
    remove: 'document.removeEventListener("visibilitychange", handleVisibilityChange)',
  },
  {
    add: "requestAnimationFrame(writePointerProperties)",
    remove: "cancelAnimationFrame(maybeFrame)",
  },
] as const;

for (const pair of requiredCleanupPairs) {
  if (!source.includes(pair.add) || !source.includes(pair.remove)) {
    throw new Error(`ReactiveSurface missing cleanup pair for ${pair.add}`);
  }
}
```

For a sturdier version, parse the file with the TypeScript compiler API and assert `addEventListener` and `removeEventListener` calls use the same target, event name, and handler.

---

## Verification Run

- `bun run test -- src/components/visual-motion.test.ts` passed: 1 file, 7 tests.
- `bun run verify:visual-system` passed, which also demonstrates why WR-02 and WR-03 need stronger assertions: the current guard passes despite the review findings above.

_Reviewed: 2026-05-26T19:07:40Z_
_Reviewer: the agent (gsd-code-reviewer)_
_Depth: standard_
