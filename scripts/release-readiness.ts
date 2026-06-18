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
  text: string;
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
  { label: "aggregate release command", text: "bun run verify" },
  { label: "production build command", text: "bun run build" },
  { label: "static output directory", text: ".output/public" },
  { label: "Cloudflare Pages", text: "Cloudflare Pages" },
  { label: "Bun version pin", text: "BUN_VERSION=1.3.14" },
  { label: "Node version pin", text: "NODE_VERSION=22.16.0" },
  { label: "Playwright Chromium provisioning command", text: "bun run install:browser" },
  {
    label: "clean-builder browser provisioning before aggregate verify",
    text: "bun run install:browser && bun run verify",
  },
  { label: "browser release gate", text: "bun run verify:browser" },
  { label: "project helper surface gate", text: "bun run verify:project-helper-surface" },
  { label: "static metadata gate", text: "bun run verify:static" },
  { label: "release verifier gate", text: "bun run verify:release" },
  { label: "project detail route coverage", text: "project detail route coverage" },
  {
    label: "project detail static coverage",
    text: "project detail metadata, JSON-LD, and sitemap coverage",
  },
  {
    label: "project detail browser coverage",
    text: "project detail axe, layout, representative keyboard, and representative reduced-motion coverage",
  },
  { label: "writing route coverage", text: "writing route coverage" },
  {
    label: "writing static coverage",
    text: "writing metadata, JSON-LD, sitemap, related-project link, and forbidden runtime residue coverage",
  },
  {
    label: "writing browser coverage",
    text: "writing axe, layout, representative keyboard, and representative reduced-motion coverage",
  },
  { label: "theme route coverage", text: "theme route coverage" },
  {
    label: "theme static coverage",
    text: "theme metadata, JSON-LD, sitemap, related project links, related writing links, collaboration links, and forbidden runtime residue coverage",
  },
  {
    label: "theme browser coverage",
    text: "theme axe, desktop/mobile dark layout, representative keyboard, and representative reduced-motion coverage",
  },
  { label: "selected project smoke route", text: representativeProjectDetailRoute() },
  { label: "selected writing smoke route", text: representativeWritingDetailRoute() },
  { label: "representative theme smoke route", text: representativeThemeDetailRoute() },
  { label: "manual external-link smoke check", text: "Manual external-link smoke check" },
  { label: "preview deployment", text: "preview deployment" },
  { label: "post-deploy smoke check", text: "post-deploy smoke check" },
  { label: "public token prefix warning", text: "Do not use VITE_" },
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
    if (normalizedDocumentText.includes(fact.text)) {
      continue;
    }

    findings.push({
      path: documentPath,
      label: "release-readiness document",
      message: `Release-readiness document is missing ${fact.label}: ${fact.text}.`,
    });
  }

  return findings;
}

export function releaseReadinessEvidenceLabels(): readonly string[] {
  return [
    "SEO/static metadata",
    "project detail route coverage",
    "writing route coverage",
    "theme route coverage",
    "static performance budgets",
    "external link policy",
    "Cloudflare/static deployment",
    "preview and deploy smoke checks",
  ];
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
