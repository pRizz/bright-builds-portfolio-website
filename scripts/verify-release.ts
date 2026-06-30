import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";

import {
  automatedReleaseReadinessEvidenceLabels,
  externalLinkFindingsForRoutes,
  releaseReadinessDocumentFindings,
} from "./release-readiness";
import { maxSocialPreviewPngBytes, maxTotalSocialPreviewPngBytes } from "./social-previews/config";

export type ReleaseTextFile = {
  kind: "text";
  path: string;
  text: string;
  byteLength: number;
};

export type ReleaseBinaryFile = {
  kind: "binary";
  path: string;
  byteLength: number;
};

export type ReleaseFile = ReleaseTextFile | ReleaseBinaryFile;

export type StaticReleaseRoute = {
  path: string;
  route: string;
  html: string;
};

export type ReleaseFinding = {
  path: string;
  route?: string;
  label: string;
  message: string;
};

export type ReleaseBudgetThresholds = {
  routeHtmlBytes: number;
  totalJsBytes: number;
  totalCssBytes: number;
  socialOgImageBytes: number;
  generatedSocialPreviewImageBytes: number;
  totalGeneratedSocialPreviewBytes: number;
};

export type ReleaseBudgetReport = {
  routeHtmlBytes: Map<string, number>;
  totalJsBytes: number;
  totalCssBytes: number;
  assetBytes: Map<string, number>;
  generatedSocialPreviewPngBytes: Map<string, number>;
  totalGeneratedSocialPreviewPngBytes: number;
};

type ForbiddenOutputPattern = {
  label: string;
  pattern: RegExp;
};

const staticOutputRoot = ".output/public";
const textOutputExtensions = new Set([".html", ".js", ".css", ".json", ".txt", ".svg", ".xml"]);

export const releaseBudgetThresholds = {
  routeHtmlBytes: 75 * 1024,
  totalJsBytes: 170 * 1024,
  totalCssBytes: 100 * 1024,
  socialOgImageBytes: 250 * 1024,
  generatedSocialPreviewImageBytes: maxSocialPreviewPngBytes,
  totalGeneratedSocialPreviewBytes: maxTotalSocialPreviewPngBytes,
} as const satisfies ReleaseBudgetThresholds;

const forbiddenOutputPatterns: readonly ForbiddenOutputPattern[] = [
  { label: "api.github.com", pattern: /api\.github\.com/gi },
  { label: "github.com/graphql", pattern: /github\.com\/graphql/gi },
  {
    label: "GitHub client dependency",
    pattern: new RegExp(`${"@"}octokit/`, "gi"),
  },
  { label: "GITHUB_TOKEN", pattern: /\bGITHUB_TOKEN\b/g },
  { label: "GITHUB_METADATA_TOKEN", pattern: /\bGITHUB_METADATA_TOKEN\b/g },
  {
    label: "VITE_[A-Z0-9_]*GITHUB[A-Z0-9_]*TOKEN",
    pattern: /\bVITE_[A-Z0-9_]*GITHUB[A-Z0-9_]*TOKEN\b/gi,
  },
  {
    label: "PUBLIC_[A-Z0-9_]*GITHUB[A-Z0-9_]*TOKEN",
    pattern: /\bPUBLIC_[A-Z0-9_]*GITHUB[A-Z0-9_]*TOKEN\b/gi,
  },
  {
    label: "SOLID_PUBLIC_[A-Z0-9_]*GITHUB[A-Z0-9_]*TOKEN",
    pattern: /\bSOLID_PUBLIC_[A-Z0-9_]*GITHUB[A-Z0-9_]*TOKEN\b/gi,
  },
  {
    label: "github_pat_ token-like value",
    pattern: /\bgithub_pat_[A-Za-z0-9_]{20,}\b/g,
  },
  {
    label: "gh[pousr]_ token-like value",
    pattern: /\bgh[pousr]_[A-Za-z0-9]{20,}\b/g,
  },
];

export function forbiddenBuiltOutputFindings(
  files: readonly Pick<ReleaseTextFile, "path" | "text">[],
): readonly ReleaseFinding[] {
  const findings: ReleaseFinding[] = [];

  for (const file of files) {
    for (const forbidden of forbiddenOutputPatterns) {
      const matches = [...file.text.matchAll(forbidden.pattern)];

      for (const _match of matches) {
        findings.push({
          path: file.path,
          label: forbidden.label,
          message: `Built output contains forbidden ${forbidden.label}; value redacted.`,
        });
      }
    }
  }

  return findings;
}

export function internalLinkFindings(
  routes: readonly StaticReleaseRoute[],
  assetPaths: ReadonlySet<string>,
): readonly ReleaseFinding[] {
  const routeByPath = new Map(routes.map((route) => [normalizedRoutePath(route.route), route]));
  const findings: ReleaseFinding[] = [];

  for (const route of routes) {
    for (const href of anchorHrefsForHtml(route.html)) {
      const maybeInternalLink = maybeInternalLinkTarget(href, route.route);

      if (!maybeInternalLink) {
        continue;
      }

      if (assetPaths.has(maybeInternalLink.assetPath)) {
        continue;
      }

      const targetRoute = routeByPath.get(maybeInternalLink.route);

      if (!targetRoute) {
        findings.push({
          path: route.path,
          route: route.route,
          label: "internal link missing route",
          message: `Internal link ${href} points at missing route ${maybeInternalLink.route}.`,
        });
        continue;
      }

      if (!maybeInternalLink.anchor) {
        continue;
      }

      if (routeHasAnchor(targetRoute.html, maybeInternalLink.anchor)) {
        continue;
      }

      findings.push({
        path: route.path,
        route: route.route,
        label: "internal link missing anchor",
        message: `Internal link ${href} points at missing anchor ${maybeInternalLink.anchor}.`,
      });
    }
  }

  return findings;
}

export function budgetReportForFiles(files: readonly ReleaseFile[]): ReleaseBudgetReport {
  const routeHtmlBytes = new Map<string, number>();
  const assetBytes = new Map<string, number>();
  const generatedSocialPreviewPngBytes = new Map<string, number>();
  let totalJsBytes = 0;
  let totalCssBytes = 0;
  let totalGeneratedSocialPreviewPngBytes = 0;

  for (const file of files) {
    if (file.path.endsWith(".html")) {
      routeHtmlBytes.set(routeForHtmlPath(file.path), file.byteLength);
    }

    if (isClientAssetPath(file.path) && file.path.endsWith(".js")) {
      totalJsBytes += file.byteLength;
    }

    if (isClientAssetPath(file.path) && file.path.endsWith(".css")) {
      totalCssBytes += file.byteLength;
    }

    if (file.path === "social/bright-builds-og.png") {
      assetBytes.set(file.path, file.byteLength);
    }

    if (isGeneratedSocialPreviewPngPath(file.path)) {
      generatedSocialPreviewPngBytes.set(file.path, file.byteLength);
      totalGeneratedSocialPreviewPngBytes += file.byteLength;
    }
  }

  return {
    routeHtmlBytes,
    totalJsBytes,
    totalCssBytes,
    assetBytes,
    generatedSocialPreviewPngBytes,
    totalGeneratedSocialPreviewPngBytes,
  };
}

export function budgetViolationsForReport(
  report: ReleaseBudgetReport,
  thresholds: ReleaseBudgetThresholds,
): readonly ReleaseFinding[] {
  const findings: ReleaseFinding[] = [];

  for (const [route, byteLength] of report.routeHtmlBytes) {
    if (byteLength <= thresholds.routeHtmlBytes) {
      continue;
    }

    findings.push({
      path: route,
      route,
      label: "route HTML budget",
      message: `${route} HTML is ${formatBytes(byteLength)}; limit is ${formatBytes(
        thresholds.routeHtmlBytes,
      )}.`,
    });
  }

  if (report.totalJsBytes > thresholds.totalJsBytes) {
    findings.push({
      path: ".output/public",
      label: "client JS budget",
      message: `Client JS is ${formatBytes(report.totalJsBytes)}; limit is ${formatBytes(
        thresholds.totalJsBytes,
      )}.`,
    });
  }

  if (report.totalCssBytes > thresholds.totalCssBytes) {
    findings.push({
      path: ".output/public",
      label: "CSS budget",
      message: `CSS is ${formatBytes(report.totalCssBytes)}; limit is ${formatBytes(
        thresholds.totalCssBytes,
      )}.`,
    });
  }

  const socialOgImageBytes = report.assetBytes.get("social/bright-builds-og.png");

  if (socialOgImageBytes === undefined) {
    findings.push({
      path: "social/bright-builds-og.png",
      label: "social/bright-builds-og.png budget",
      message: "social/bright-builds-og.png is missing from static output.",
    });
  } else if (socialOgImageBytes > thresholds.socialOgImageBytes) {
    findings.push({
      path: "social/bright-builds-og.png",
      label: "social/bright-builds-og.png budget",
      message: `social/bright-builds-og.png is ${formatBytes(
        socialOgImageBytes,
      )}; limit is ${formatBytes(thresholds.socialOgImageBytes)}.`,
    });
  }

  for (const [path, byteLength] of [...report.generatedSocialPreviewPngBytes].sort()) {
    if (byteLength <= thresholds.generatedSocialPreviewImageBytes) {
      continue;
    }

    findings.push({
      path,
      label: "generated social preview image budget",
      message: `${path} is ${formatBytes(byteLength)}; limit is ${formatBytes(
        thresholds.generatedSocialPreviewImageBytes,
      )}.`,
    });
  }

  if (report.totalGeneratedSocialPreviewPngBytes > thresholds.totalGeneratedSocialPreviewBytes) {
    findings.push({
      path: "social/generated",
      label: "generated social preview total budget",
      message: `Generated social preview PNG total is ${formatBytes(
        report.totalGeneratedSocialPreviewPngBytes,
      )}; limit is ${formatBytes(thresholds.totalGeneratedSocialPreviewBytes)}.`,
    });
  }

  return findings;
}

export function semanticFindingsForRoute(route: StaticReleaseRoute): readonly ReleaseFinding[] {
  const findings: ReleaseFinding[] = [];
  const mainCount = countMatches(route.html, /<main\b/gi);
  const h1Count = countMatches(route.html, /<h1\b/gi);

  if (mainCount !== 1) {
    findings.push({
      path: route.path,
      route: route.route,
      label: "one main landmark",
      message: `${route.route} rendered ${mainCount} main landmarks; expected one main landmark.`,
    });
  }

  if (h1Count !== 1) {
    findings.push({
      path: route.path,
      route: route.route,
      label: "one h1 per route",
      message: `${route.route} rendered ${h1Count} h1 elements; expected one h1 per route.`,
    });
  }

  if (!/<a\b[^>]*href=["']#content["'][^>]*>[\s\S]*?skip/gi.test(route.html)) {
    findings.push({
      path: route.path,
      route: route.route,
      label: "skip link",
      message: `${route.route} is missing a skip link to #content.`,
    });
  }

  if (!/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>/gi.test(route.html)) {
    findings.push({
      path: route.path,
      route: route.route,
      label: "JSON-LD",
      message: `${route.route} is missing JSON-LD structured data.`,
    });
  }

  if (/No GitHub metadata yet|GitHub metadata refresh failed/gi.test(route.html)) {
    findings.push({
      path: route.path,
      route: route.route,
      label: "visitor-facing GitHub metadata maintenance error copy",
      message: `${route.route} includes GitHub metadata maintenance error copy.`,
    });
  }

  return findings;
}

export function accessibilityFindingsForRoute(
  route: StaticReleaseRoute,
  cssText: string,
): readonly ReleaseFinding[] {
  const findings: ReleaseFinding[] = [];

  for (const image of imageTagsForHtml(route.html)) {
    const maybeAlt = attributeValueForTag(image, "alt");

    if (maybeAlt?.trim()) {
      continue;
    }

    findings.push({
      path: route.path,
      route: route.route,
      label: "image alt",
      message: `${route.route} includes an img without a non-empty alt attribute.`,
    });
  }

  if (!/:focus-visible\b/.test(cssText)) {
    findings.push({
      path: "emitted CSS",
      route: route.route,
      label: "focus-visible",
      message: "Emitted CSS is missing focus-visible hooks for keyboard-visible states.",
    });
  }

  if (!/:(?:focus|focus-within)\b/.test(cssText)) {
    findings.push({
      path: "emitted CSS",
      route: route.route,
      label: "focus state",
      message: "Emitted CSS is missing focus state hooks for links, buttons, or skip link.",
    });
  }

  if (!/prefers-reduced-motion/.test(cssText)) {
    findings.push({
      path: "emitted CSS",
      route: route.route,
      label: "reduced-motion",
      message: "Emitted CSS is missing reduced-motion output.",
    });
  }

  if (!/(?:reactive-surface|interactive-surface)/.test(cssText)) {
    findings.push({
      path: "emitted CSS",
      route: route.route,
      label: "interactive motion surfaces",
      message: "Emitted CSS is missing interactive motion surfaces hooks.",
    });
  }

  return findings;
}

export function releaseEvidenceLabels(): readonly string[] {
  const readinessLabels = automatedReleaseReadinessEvidenceLabels();

  return [
    "contrast/readability",
    "focus-visible",
    "focus state",
    "image alt",
    "interactive motion surfaces",
    "reduced-motion",
    ...readinessLabels.flatMap((label) =>
      label === "external link policy"
        ? ["generated social preview asset budgets", label]
        : [label],
    ),
  ];
}

function runReleaseVerification(): void {
  const files = releaseFiles(staticOutputRoot);
  const textFiles = files.filter((file): file is ReleaseTextFile => file.kind === "text");
  const routes = staticReleaseRoutes(textFiles);

  if (routes.length === 0) {
    throw new Error(`No .output/public HTML exists. Run bun run build first.`);
  }

  const cssText = textFiles
    .filter((file) => file.path.endsWith(".css"))
    .map((file) => file.text)
    .join("\n");
  const assetPaths = new Set(files.map((file) => file.path));
  const report = budgetReportForFiles(files);
  const findings = [
    ...forbiddenBuiltOutputFindings(textFiles),
    ...internalLinkFindings(routes, assetPaths),
    ...externalLinkFindingsForRoutes(routes),
    ...remoteRuntimeVisualAssetFindings(textFiles),
    ...budgetViolationsForReport(report, releaseBudgetThresholds),
    ...routes.flatMap((route) => semanticFindingsForRoute(route)),
    ...routes.flatMap((route) => accessibilityFindingsForRoute(route, cssText)),
    ...releaseReadinessDocumentFindings(),
  ];

  printBudgetReport(report);
  console.log(`Release evidence labels: ${releaseEvidenceLabels().join(", ")}`);

  if (findings.length > 0) {
    for (const finding of findings) {
      console.error(
        `[release verification error] ${finding.path} ${finding.label}: ${finding.message}`,
      );
    }

    process.exit(1);
  }

  console.log(
    `Release verifier scanned ${routes.length} route HTML files and ${textFiles.length} text assets in ${staticOutputRoot}.`,
  );
  console.log("Release verification passed");
}

function releaseFiles(root: string): readonly ReleaseFile[] {
  if (!existsSync(root)) {
    throw new Error(`Missing ${root}. Run bun run build first.`);
  }

  return collectReleaseFiles(root, root);
}

function collectReleaseFiles(root: string, currentPath: string): readonly ReleaseFile[] {
  const files: ReleaseFile[] = [];

  for (const entry of readdirSync(currentPath)) {
    const absolutePath = join(currentPath, entry);
    const stats = statSync(absolutePath);

    if (stats.isDirectory()) {
      files.push(...collectReleaseFiles(root, absolutePath));
      continue;
    }

    const path = relative(root, absolutePath);
    const extension = extname(entry);

    if (textOutputExtensions.has(extension)) {
      const text = readFileSync(absolutePath, "utf8");
      files.push({
        kind: "text",
        path,
        text,
        byteLength: Buffer.byteLength(text),
      });
      continue;
    }

    files.push({
      kind: "binary",
      path,
      byteLength: stats.size,
    });
  }

  return files;
}

function staticReleaseRoutes(textFiles: readonly ReleaseTextFile[]): readonly StaticReleaseRoute[] {
  return textFiles
    .filter((file) => file.path.endsWith(".html"))
    .map((file) => ({
      path: file.path,
      route: routeForHtmlPath(file.path),
      html: file.text,
    }));
}

function isClientAssetPath(path: string): boolean {
  return path.startsWith("_build/");
}

function isGeneratedSocialPreviewPngPath(path: string): boolean {
  return path.startsWith("social/generated/") && path.endsWith(".png");
}

function routeForHtmlPath(path: string): string {
  if (path === "index.html") {
    return "/";
  }

  if (path.endsWith("/index.html")) {
    return normalizedRoutePath(`/${path.slice(0, -"/index.html".length)}`);
  }

  if (path.endsWith(".html")) {
    return normalizedRoutePath(`/${path.slice(0, -".html".length)}`);
  }

  return normalizedRoutePath(`/${path}`);
}

function anchorHrefsForHtml(html: string): readonly string[] {
  return [...html.matchAll(/<a\b[^>]*\bhref\s*=\s*["']([^"']+)["'][^>]*>/gi)].map(
    (match) => match[1],
  );
}

function maybeInternalLinkTarget(
  href: string,
  currentRoute: string,
): { route: string; anchor: string | null; assetPath: string } | null {
  if (!href || /^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith("//")) {
    return null;
  }

  const [pathAndQuery, maybeAnchor = ""] = href.split("#");
  const [rawPath = ""] = pathAndQuery.split("?");
  const route = normalizedRoutePath(rawPath || currentRoute);
  const assetPath = route.replace(/^\//, "");
  const anchor = maybeAnchor ? decodeURIComponent(maybeAnchor) : null;

  return {
    route,
    anchor,
    assetPath,
  };
}

function normalizedRoutePath(path: string): string {
  const withLeadingSlash = path.startsWith("/") ? path : `/${path}`;
  const withoutTrailingSlash =
    withLeadingSlash.length > 1 ? withLeadingSlash.replace(/\/+$/, "") : withLeadingSlash;

  return withoutTrailingSlash || "/";
}

function routeHasAnchor(html: string, anchor: string): boolean {
  const escapedAnchor = escapeRegExp(escapeHtmlAttribute(anchor));
  const idPattern = new RegExp(`\\bid=["']${escapedAnchor}["']`, "i");
  const namePattern = new RegExp(`\\bname=["']${escapedAnchor}["']`, "i");

  return idPattern.test(html) || namePattern.test(html);
}

function remoteRuntimeVisualAssetFindings(
  files: readonly ReleaseTextFile[],
): readonly ReleaseFinding[] {
  const findings: ReleaseFinding[] = [];

  for (const file of files) {
    if (/<img\b[^>]*\bsrc=["']https?:\/\//i.test(file.text)) {
      findings.push({
        path: file.path,
        label: "remote runtime visual assets",
        message: "Static output includes a remote img src.",
      });
    }

    if (/url\(\s*["']?https?:\/\//i.test(file.text)) {
      findings.push({
        path: file.path,
        label: "remote runtime visual assets",
        message: "Static output includes a remote CSS or SVG url().",
      });
    }
  }

  return findings;
}

function imageTagsForHtml(html: string): readonly string[] {
  return [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);
}

function attributeValueForTag(tag: string, attributeName: string): string | null {
  const pattern = new RegExp(`\\b${escapeRegExp(attributeName)}\\s*=\\s*["']([^"']*)["']`, "i");
  const maybeMatch = tag.match(pattern);

  return maybeMatch?.[1] ?? null;
}

function countMatches(value: string, pattern: RegExp): number {
  return [...value.matchAll(pattern)].length;
}

function printBudgetReport(report: ReleaseBudgetReport): void {
  console.log("Release static budgets:");

  for (const [route, byteLength] of [...report.routeHtmlBytes].sort()) {
    console.log(`- route HTML ${route}: ${formatBytes(byteLength)}`);
  }

  console.log(`- total client JS: ${formatBytes(report.totalJsBytes)}`);
  console.log(`- total CSS: ${formatBytes(report.totalCssBytes)}`);

  const socialOgImageBytes = report.assetBytes.get("social/bright-builds-og.png");
  const socialOgImageLabel =
    socialOgImageBytes === undefined ? "missing" : formatBytes(socialOgImageBytes);

  console.log(`- social/bright-builds-og.png: ${socialOgImageLabel}`);

  for (const [path, byteLength] of [...report.generatedSocialPreviewPngBytes].sort()) {
    console.log(`- ${path}: ${formatBytes(byteLength)}`);
  }

  console.log(
    `- generated social preview PNG total: ${formatBytes(
      report.totalGeneratedSocialPreviewPngBytes,
    )}`,
  );
}

function formatBytes(byteLength: number): string {
  return `${(byteLength / 1024).toFixed(1)} KB`;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function escapeHtmlAttribute(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

if (import.meta.main) {
  runReleaseVerification();
}
