import { existsSync, readFileSync } from "node:fs";

import { peterProfile } from "../src/domain/profile";
import { projectDetailRoutes } from "../src/domain/projects";
import { themeDetailRoutes } from "../src/domain/themes";
import { writingDetailRoutes } from "../src/domain/writing";
import type { ReleaseFinding, StaticReleaseRoute } from "./verify-release";

export type ExternalLinkPolicy = {
  origin: string;
  liveCheck: "manual-release";
  reason: string;
  examples: readonly string[];
};

type RequiredDocumentFact = {
  label: string;
  pattern: RegExp;
  expectedDescription: string;
};

export const externalLinkPolicies = [
  {
    origin: "https://github.com",
    liveCheck: "manual-release",
    reason:
      "GitHub can rate-limit or interstitial third-party requests, so local release checks verify policy coverage and humans smoke-check primary paths before deploy.",
    examples: ["https://github.com/pRizz"],
  },
  {
    origin: "https://openlinks.us",
    liveCheck: "manual-release",
    reason:
      "OpenLinks is Peter's identity hub and must stay discoverable without making local verification depend on a live network request.",
    examples: ["https://openlinks.us/"],
  },
  {
    origin: "https://www.brightbuilds.us",
    liveCheck: "manual-release",
    reason:
      "The canonical production origin is smoke-checked after deploy; local static checks verify generated canonical metadata before deploy.",
    examples: ["https://www.brightbuilds.us/"],
  },
  {
    origin: "https://freetheworld.ai",
    liveCheck: "manual-release",
    reason:
      "Curated project live links are manually checked because third-party availability should not block deterministic local release verification.",
    examples: ["https://freetheworld.ai/"],
  },
  {
    origin: "https://win3bitco.in",
    liveCheck: "manual-release",
    reason:
      "Curated project live links are manually checked because third-party availability should not block deterministic local release verification.",
    examples: ["https://win3bitco.in/"],
  },
  {
    origin: "https://prizz.github.io",
    liveCheck: "manual-release",
    reason:
      "GitHub Pages project links are manually checked because hosted docs and demos can be intermittently unavailable outside this repo.",
    examples: ["https://prizz.github.io/mystic-ui/"],
  },
] as const satisfies readonly ExternalLinkPolicy[];

const requiredPrimaryExternalHrefs = peterProfile.links
  .filter((link) => link.kind === "code" || link.kind === "identity")
  .map((link) => link.href);

const sensitiveQueryKeyPatterns = [
  /token/i,
  /secret/i,
  /credential/i,
  /^key$/i,
  /api[-_]?key/i,
  /auth/i,
] as const;

const releaseReadinessDocumentPath = "docs/release-readiness.md";

const requiredReleaseReadinessDocumentFacts = [
  {
    label: "aggregate release command",
    pattern: /```bash\s*bun run verify\s*```/m,
    expectedDescription: "bun run verify",
  },
  {
    label: "production build command",
    pattern: /## Static Output[\s\S]*```bash\s*bun run build\s*```/m,
    expectedDescription: "bun run build",
  },
  {
    label: "static output directory",
    pattern: /The static host must serve `\.output\/public` as the site root\./,
    expectedDescription: ".output/public",
  },
  {
    label: "offline freshness report command",
    pattern: /## Freshness Reports[\s\S]*```bash\s*bun run report:freshness\s*```/m,
    expectedDescription: "bun run report:freshness",
  },
  {
    label: "reviewed static evidence boundary",
    pattern: /## Freshness Reports[\s\S]*reviewed static evidence[\s\S]*## Automated Gates/m,
    expectedDescription: "reviewed static evidence",
  },
  {
    label: "live GitHub boundary",
    pattern:
      /## Freshness Reports[\s\S]*does not prove current live GitHub state[\s\S]*## Automated Gates/m,
    expectedDescription: "does not prove current live GitHub state",
  },
  {
    label: "live external-link boundary",
    pattern:
      /## Freshness Reports[\s\S]*does not crawl live external links[\s\S]*## Automated Gates/m,
    expectedDescription: "does not crawl live external links",
  },
  {
    label: "social crawler boundary",
    pattern:
      /## Freshness Reports[\s\S]*does not run hosted social crawler validation[\s\S]*## Automated Gates/m,
    expectedDescription: "does not run hosted social crawler validation",
  },
  {
    label: "manual smoke severity",
    pattern: /## Freshness Reports[\s\S]*manual smoke[\s\S]*## Automated Gates/m,
    expectedDescription: "manual smoke",
  },
  {
    label: "Cloudflare Pages",
    pattern:
      /## Cloudflare Pages[\s\S]*Cloudflare Pages should serve the generated static artifact directly\./,
    expectedDescription: "Cloudflare Pages",
  },
  {
    label: "Bun version pin",
    pattern: /\| Bun environment variable \| `BUN_VERSION=1\.3\.14` \|/,
    expectedDescription: "BUN_VERSION=1.3.14",
  },
  {
    label: "Node version pin",
    pattern: /\| Node environment variable \| `NODE_VERSION=22\.16\.0` \|/,
    expectedDescription: "NODE_VERSION=22.16.0",
  },
  {
    label: "Playwright Chromium provisioning command",
    pattern:
      /install the browser dependency explicitly before the aggregate gate:[\s\S]*```bash\s*bun run install:browser && bun run verify\s*```/m,
    expectedDescription: "bun run install:browser",
  },
  {
    label: "clean-builder browser provisioning before aggregate verify",
    pattern:
      /Use `bun run install:browser && bun run verify` as the clean-builder command sequence when the deployment should block on the full release gate\./,
    expectedDescription: "bun run install:browser && bun run verify",
  },
  {
    label: "browser release gate",
    pattern:
      /## Automated Gates[\s\S]*### Browser and Accessibility[\s\S]*`bun run verify:browser` runs/,
    expectedDescription: "bun run verify:browser",
  },
  {
    label: "project helper surface gate",
    pattern: /## Primary Release Gate[\s\S]*- `bun run verify:project-helper-surface`/,
    expectedDescription: "bun run verify:project-helper-surface",
  },
  {
    label: "social preview verification gate",
    pattern: /## Primary Release Gate[\s\S]*- `bun run verify:social-previews`/,
    expectedDescription: "bun run verify:social-previews",
  },
  {
    label: "social preview generation command",
    pattern: /## Social Preview Assets[\s\S]*```bash\s*bun run generate:social-previews\s*```/m,
    expectedDescription: "bun run generate:social-previews",
  },
  {
    label: "social preview read-only check command",
    pattern: /## Social Preview Assets[\s\S]*```bash\s*bun run verify:social-previews\s*```/m,
    expectedDescription: "bun run verify:social-previews",
  },
  {
    label: "generated preview manifest",
    pattern:
      /## Social Preview Assets[\s\S]*`generate:social-previews` writes reviewed checked-in PNGs[\s\S]*`public\/social\/generated\/manifest\.json`/,
    expectedDescription: "public/social/generated/manifest.json",
  },
  {
    label: "social preview check before build",
    pattern:
      /`verify:social-previews` is read-only check mode and runs before `bun run build` inside `bun run verify`\./,
    expectedDescription: "verify:social-previews before bun run build",
  },
  {
    label: "static output generated preview manifest",
    pattern:
      /`bun run verify:static` checks generated HTML social image metadata, Twitter image parity, JSON-LD image parity, local PNG existence, image dimensions, and `\.output\/public\/social\/generated\/manifest\.json` consistency/,
    expectedDescription: ".output/public/social/generated/manifest.json",
  },
  {
    label: "generated social preview total budget",
    pattern: /## Social Preview Assets[\s\S]*generated social preview PNG total/,
    expectedDescription: "generated social preview PNG total",
  },
  {
    label: "manual social-card smoke check",
    pattern: /### Manual social-card smoke check/,
    expectedDescription: "Manual social-card smoke check",
  },
  {
    label: "manual social-card verification boundary",
    pattern:
      /hosted social-card validation, current live GitHub state, live external-link reachability, and preview\/production smoke checks are not part of `bun run verify`/,
    expectedDescription: "not part of `bun run verify`",
  },
  {
    label: "static metadata gate",
    pattern: /### SEO and Static Metadata[\s\S]*`bun run verify:static` checks/,
    expectedDescription: "bun run verify:static",
  },
  {
    label: "release verifier gate",
    pattern:
      /### Performance and Best Practices[\s\S]*`bun run verify:release` enforces deterministic static output budgets/,
    expectedDescription: "bun run verify:release",
  },
  {
    label: "project detail route coverage",
    pattern: /This primary release gate includes project detail route coverage/,
    expectedDescription: "project detail route coverage",
  },
  {
    label: "project detail static coverage",
    pattern:
      /The project detail route coverage contract combines project detail metadata, JSON-LD, and sitemap coverage/,
    expectedDescription: "project detail metadata, JSON-LD, and sitemap coverage",
  },
  {
    label: "project detail browser coverage",
    pattern:
      /with project detail axe, layout, representative keyboard, and representative reduced-motion coverage/,
    expectedDescription:
      "project detail axe, layout, representative keyboard, and representative reduced-motion coverage",
  },
  {
    label: "writing route coverage",
    pattern: /This primary release gate includes[\s\S]*writing route coverage/,
    expectedDescription: "writing route coverage",
  },
  {
    label: "writing static coverage",
    pattern:
      /The writing route coverage contract combines writing metadata, JSON-LD, sitemap, related-project link, and forbidden runtime residue coverage/,
    expectedDescription:
      "writing metadata, JSON-LD, sitemap, related-project link, and forbidden runtime residue coverage",
  },
  {
    label: "writing browser coverage",
    pattern:
      /with writing axe, layout, representative keyboard, and representative reduced-motion coverage/,
    expectedDescription:
      "writing axe, layout, representative keyboard, and representative reduced-motion coverage",
  },
  {
    label: "theme route coverage",
    pattern: /This primary release gate includes[\s\S]*theme route coverage/,
    expectedDescription: "theme route coverage",
  },
  {
    label: "theme static coverage",
    pattern:
      /The theme route coverage contract combines theme metadata, JSON-LD, sitemap, related project links, related writing links, collaboration links, and forbidden runtime residue coverage/,
    expectedDescription:
      "theme metadata, JSON-LD, sitemap, related project links, related writing links, collaboration links, and forbidden runtime residue coverage",
  },
  {
    label: "theme browser coverage",
    pattern:
      /with theme axe, desktop\/mobile dark layout, representative keyboard, and representative reduced-motion coverage/,
    expectedDescription:
      "theme axe, desktop/mobile dark layout, representative keyboard, and representative reduced-motion coverage",
  },
  {
    label: "selected project smoke route",
    pattern: new RegExp(
      `Confirm the selected project detail route \`${escapedRegExpText(
        representativeProjectDetailRoute(),
      )}\``,
    ),
    expectedDescription: representativeProjectDetailRoute(),
  },
  {
    label: "selected writing smoke route",
    pattern: new RegExp(
      `the public writing detail route \`${escapedRegExpText(representativeWritingDetailRoute())}\``,
    ),
    expectedDescription: representativeWritingDetailRoute(),
  },
  {
    label: "representative theme smoke route",
    pattern: new RegExp(
      `the public theme detail route \`${escapedRegExpText(representativeThemeDetailRoute())}\``,
    ),
    expectedDescription: representativeThemeDetailRoute(),
  },
  {
    label: "manual external-link smoke check",
    pattern: /Manual external-link smoke check before release:/,
    expectedDescription: "Manual external-link smoke check",
  },
  {
    label: "freshness severity boundary",
    pattern:
      /## Freshness Reports[\s\S]*`release blocker`[\s\S]*`needs review`[\s\S]*`manual smoke`[\s\S]*only deterministic local blockers fail local release gates[\s\S]*## Automated Gates/m,
    expectedDescription: "release blocker, needs review, manual smoke",
  },
  {
    label: "OpenLinks low-intrusion posture",
    pattern:
      /OpenLinks remains identity\/external-link policy context and is not a primary route CTA or brand replacement\./,
    expectedDescription: "not a primary route CTA or brand replacement",
  },
  {
    label: "preview deployment",
    pattern: /## Preview Deployment Checklist[\s\S]*Before creating a preview deployment:/,
    expectedDescription: "preview deployment",
  },
  {
    label: "post-deploy smoke check",
    pattern:
      /Post-deploy smoke check:[\s\S]*Use this post-deploy smoke check after the production deployment:/,
    expectedDescription: "post-deploy smoke check",
  },
  {
    label: "public token prefix warning",
    pattern: /Do not use VITE_, PUBLIC_, or SOLID_PUBLIC_ prefixes for GitHub tokens\./,
    expectedDescription: "Do not use VITE_",
  },
] as const satisfies readonly RequiredDocumentFact[];

export function externalLinkFindingsForRoutes(
  routes: readonly StaticReleaseRoute[],
): readonly ReleaseFinding[] {
  const findings: ReleaseFinding[] = [];
  const anchorHrefs = new Set(uniqueExternalAnchorHrefsForRoutes(routes));
  const policiesByOrigin = new Map<string, ExternalLinkPolicy>(
    externalLinkPolicies.map((policy) => [policy.origin, policy]),
  );

  for (const requiredHref of requiredPrimaryExternalHrefs) {
    if (anchorHrefs.has(requiredHref)) {
      continue;
    }

    findings.push({
      path: ".output/public",
      label: "primary external link presence",
      message: `Static routes are missing primary external link presence for ${requiredHref}.`,
    });
  }

  for (const href of uniqueExternalAnchorHrefsForRoutes(routes)) {
    const maybeUrl = maybeExternalHttpUrl(href);

    if (!maybeUrl) {
      continue;
    }

    if (maybeUrl.protocol !== "https:") {
      findings.push({
        path: ".output/public",
        label: "external link protocol",
        message: `External link ${redactedExternalTarget(maybeUrl)} must use HTTPS.`,
      });
    }

    if (!policiesByOrigin.has(maybeUrl.origin)) {
      findings.push({
        path: ".output/public",
        label: "external link policy coverage",
        message: `External link ${redactedExternalTarget(
          maybeUrl,
        )} is not covered by release external-link policy.`,
      });
    }

    for (const key of maybeUrl.searchParams.keys()) {
      if (!isSensitiveQueryKey(key)) {
        continue;
      }

      findings.push({
        path: ".output/public",
        label: "external link sensitive query",
        message: `External link ${redactedExternalTarget(
          maybeUrl,
        )} uses sensitive query key ${key}; value redacted.`,
      });
    }
  }

  return findings;
}

export function releaseReadinessDocumentFindings(
  documentPath = releaseReadinessDocumentPath,
): readonly ReleaseFinding[] {
  if (!existsSync(documentPath)) {
    return [
      {
        path: documentPath,
        label: "release-readiness document",
        message: "Release-readiness document is missing.",
      },
    ];
  }

  const documentText = readFileSync(documentPath, "utf8");
  const normalizedDocumentText = documentText.replace(/\\_/g, "_");
  const findings: ReleaseFinding[] = [];

  for (const fact of requiredReleaseReadinessDocumentFacts) {
    if (fact.pattern.test(normalizedDocumentText)) {
      continue;
    }

    findings.push({
      path: documentPath,
      label: "release-readiness document",
      message: `Release-readiness document is missing ${fact.label}: ${fact.expectedDescription}.`,
    });
  }

  return findings;
}

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

function representativeProjectDetailRoute(): string {
  const maybeRoute = projectDetailRoutes()[0];

  if (!maybeRoute) {
    throw new Error("Expected at least one selected project detail route for release coverage.");
  }

  return maybeRoute;
}

function representativeWritingDetailRoute(): string {
  const maybeRoute = writingDetailRoutes()[0];

  if (!maybeRoute) {
    throw new Error("Expected at least one public writing detail route for release coverage.");
  }

  return maybeRoute;
}

function representativeThemeDetailRoute(): string {
  const maybeRoute = themeDetailRoutes()[0];

  if (!maybeRoute) {
    throw new Error("Expected at least one public theme detail route for release coverage.");
  }

  return maybeRoute;
}

function escapedRegExpText(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function uniqueExternalAnchorHrefsForRoutes(
  routes: readonly StaticReleaseRoute[],
): readonly string[] {
  return [
    ...new Set(
      routes.flatMap((route) =>
        [...route.html.matchAll(/<a\b[^>]*\bhref\s*=\s*["']([^"']+)["'][^>]*>/gi)]
          .map((match) => match[1])
          .filter((href) => /^[a-z][a-z0-9+.-]*:/i.test(href)),
      ),
    ),
  ].sort();
}

function maybeExternalHttpUrl(href: string): URL | null {
  try {
    const url = new URL(href);

    if (url.protocol === "http:" || url.protocol === "https:") {
      return url;
    }

    return null;
  } catch {
    return null;
  }
}

function isSensitiveQueryKey(key: string): boolean {
  return sensitiveQueryKeyPatterns.some((pattern) => pattern.test(key));
}

function redactedExternalTarget(url: URL): string {
  return `${url.origin}${url.pathname}`;
}
