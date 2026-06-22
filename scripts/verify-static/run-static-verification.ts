import { relative } from "node:path";

import { expectedRoutes } from "./expected-route-text";
import { assertRouteMetadataAndJsonLd } from "./metadata-jsonld-verifier";
import { cssFiles, findStaticOutputRoot, htmlFiles, readRouteHtml } from "./output";
import { assertRouteHtml } from "./route-html-verifier";
import { assertSitemapAssetsAndRobots } from "./sitemap-assets-verifier";

export function staticVerificationSummary(options: {
  routeCount: number;
  outputRoot: string;
}): string {
  return `Verified ${options.routeCount} prerendered routes, metadata, JSON-LD, writing route coverage, theme route coverage, social preview manifest, assets, sitemap, and robots in ${options.outputRoot}.`;
}

export function runStaticVerification(): void {
  const outputRoot = findStaticOutputRoot();
  const outputHtmlFiles = htmlFiles(outputRoot);
  const outputCssFiles = cssFiles(outputRoot);

  assertNoUnexpectedHtmlRoutes(outputRoot, outputHtmlFiles);

  for (const check of expectedRoutes) {
    assertRouteHtml(outputRoot, check);
    assertRouteMetadataAndJsonLd(outputRoot, check.route, readRouteHtml(outputRoot, check.route));
  }

  assertSitemapAssetsAndRobots(outputRoot, outputHtmlFiles, outputCssFiles);

  console.log(
    staticVerificationSummary({
      routeCount: expectedRoutes.length,
      outputRoot,
    }),
  );
}

export function assertNoUnexpectedHtmlRoutes(
  outputRoot: string,
  outputHtmlFiles: readonly string[],
): void {
  const expectedRoutePaths = new Set(expectedRoutes.map((check) => check.route));
  const unexpectedRoutes = outputHtmlFiles
    .map((file) => routeForOutputHtml(outputRoot, file))
    .filter((route) => !expectedRoutePaths.has(route))
    .sort();

  if (unexpectedRoutes.length === 0) {
    return;
  }

  throw new Error(
    `Unexpected prerendered HTML route in static output: ${unexpectedRoutes.join(", ")}`,
  );
}

function routeForOutputHtml(outputRoot: string, htmlPath: string): string {
  const relativePath = relative(outputRoot, htmlPath).replaceAll("\\", "/");

  if (relativePath === "index.html") {
    return "/";
  }

  if (relativePath.endsWith("/index.html")) {
    return `/${relativePath.slice(0, -"/index.html".length)}`;
  }

  if (relativePath.endsWith(".html")) {
    return `/${relativePath.slice(0, -".html".length)}`;
  }

  return `/${relativePath}`;
}
