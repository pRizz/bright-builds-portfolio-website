import { expectedRoutes } from "./expected-route-text";
import { assertRouteMetadataAndJsonLd } from "./metadata-jsonld-verifier";
import { cssFiles, findStaticOutputRoot, htmlFiles, readRouteHtml } from "./output";
import { assertRouteHtml } from "./route-html-verifier";
import { assertSitemapAssetsAndRobots } from "./sitemap-assets-verifier";

export function staticVerificationSummary(options: {
  routeCount: number;
  outputRoot: string;
}): string {
  return `Verified ${options.routeCount} prerendered routes, metadata, JSON-LD, writing route coverage, theme route coverage, assets, sitemap, and robots in ${options.outputRoot}.`;
}

export function runStaticVerification(): void {
  const outputRoot = findStaticOutputRoot();
  const outputHtmlFiles = htmlFiles(outputRoot);
  const outputCssFiles = cssFiles(outputRoot);

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
