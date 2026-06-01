import { existsSync, readFileSync } from "node:fs";

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

const requiredPrimaryExternalHrefs = ["https://github.com/", "https://openlinks.us/"] as const;

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
  { label: "manual external-link smoke check", text: "Manual external-link smoke check" },
  { label: "preview deployment", text: "preview deployment" },
  { label: "post-deploy smoke check", text: "post-deploy smoke check" },
  { label: "public token prefix warning", text: "Do not use VITE_" },
] as const satisfies readonly RequiredDocumentFact[];

export function externalLinkFindingsForRoutes(
  routes: readonly StaticReleaseRoute[],
): readonly ReleaseFinding[] {
  const findings: ReleaseFinding[] = [];
  const combinedHtml = routes.map((route) => route.html).join("\n");
  const policiesByOrigin = new Map<string, ExternalLinkPolicy>(
    externalLinkPolicies.map((policy) => [policy.origin, policy]),
  );

  for (const requiredHref of requiredPrimaryExternalHrefs) {
    if (combinedHtml.includes(requiredHref)) {
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
  const findings: ReleaseFinding[] = [];

  for (const fact of requiredReleaseReadinessDocumentFacts) {
    if (documentText.includes(fact.text)) {
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
    "static performance budgets",
    "external link policy",
    "Cloudflare/static deployment",
    "preview and deploy smoke checks",
  ];
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
