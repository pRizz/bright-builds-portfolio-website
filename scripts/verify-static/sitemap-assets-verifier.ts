import { existsSync, readFileSync } from "node:fs";
import { relative } from "node:path";

import { peterProfile } from "../../src/domain/profile";
import { projectDetailRoutes } from "../../src/domain/projects";
import { robotsTxt, sitemapXml } from "../../src/domain/seo";
import { themeDetailRoutes } from "../../src/domain/themes";
import type { WritingEntry } from "../../src/domain/writing";
import { curatedWriting, writingDetailPath, writingDetailRoutes } from "../../src/domain/writing";
import {
  generatedOutputForbiddenPatterns,
  themeDetailRouteSourcePath,
  writingDetailRouteSourcePath,
} from "./config";
import { assertForbiddenTextAbsent, assertHtmlContains } from "./html-assertions";
import {
  assertOutputFile,
  assertOutputTextEquals,
  assertPngDimensions,
  cssFiles,
  routeHtmlCandidates,
  routeHtmlPath,
} from "./output";

export function assertSitemapAssetsAndRobots(
  outputRoot: string,
  outputHtmlFiles: readonly string[],
  outputCssFiles: readonly string[],
): void {
  assertWritingDetailRouteCoverage(outputRoot);
  assertThemeDetailRouteCoverage(outputRoot);
  assertNoRemoteRuntimeVisualAssets(outputRoot, [...outputHtmlFiles, ...outputCssFiles]);
  assertReducedMotionCss(outputRoot, outputCssFiles);

  for (const assetPath of [
    "sitemap.xml",
    "robots.txt",
    "favicon.svg",
    "icon-192.png",
    "apple-touch-icon.png",
    "social/bright-builds-og.png",
  ]) {
    assertOutputFile(outputRoot, assetPath);
  }

  assertPngDimensions(outputRoot, "social/bright-builds-og.png", 1200, 630);
  assertPngDimensions(outputRoot, "icon-192.png", 192, 192);
  assertPngDimensions(outputRoot, "apple-touch-icon.png", 180, 180);
  assertOutputTextEquals(outputRoot, "sitemap.xml", sitemapXml());
  assertSitemapProjectDetailCoverage(outputRoot);
  assertSitemapWritingCoverage(outputRoot);

  for (const entry of curatedWriting) {
    if (entry.status === "published") {
      continue;
    }

    assertNoPrerenderedWritingEntry(outputRoot, entry);
  }

  assertNoPrerenderedWritingRoute(outputRoot, "/writing/unknown-writing-slug");
  assertNoPrerenderedThemeRoute(outputRoot, "/themes/unknown-theme-slug");
  assertWritingFallbackMetadataSource();
  assertThemeFallbackSource();
  assertOutputTextEquals(outputRoot, "robots.txt", robotsTxt());
  assertAllOutputForbiddenTextAbsent(outputRoot, outputHtmlFiles);
}

export function assertSitemapProjectDetailCoverage(root: string): void {
  const sitemapPath = assertOutputFile(root, "sitemap.xml");
  const sitemap = readFileSync(sitemapPath, "utf8");

  for (const route of projectDetailRoutes()) {
    assertHtmlContains(
      sitemap,
      `<loc>${peterProfile.canonicalOrigin}${route}</loc>`,
      `sitemap detail route ${route}`,
    );
  }

  if (sitemap.includes(`<loc>${peterProfile.canonicalOrigin}/projects/open-bitcoin</loc>`)) {
    throw new Error("sitemap.xml included unselected detail route /projects/open-bitcoin.");
  }
}

export function assertSitemapWritingCoverage(root: string): void {
  const sitemapPath = assertOutputFile(root, "sitemap.xml");
  const sitemap = readFileSync(sitemapPath, "utf8");

  assertHtmlContains(
    sitemap,
    `<loc>${peterProfile.canonicalOrigin}/writing</loc>`,
    "sitemap writing index route",
  );

  for (const route of writingDetailRoutes()) {
    assertHtmlContains(
      sitemap,
      `<loc>${peterProfile.canonicalOrigin}${route}</loc>`,
      `sitemap writing detail route ${route}`,
    );
  }

  for (const entry of curatedWriting) {
    if (entry.status === "published") {
      continue;
    }

    const route = writingDetailPath(entry);

    if (sitemap.includes(`<loc>${peterProfile.canonicalOrigin}${route}</loc>`)) {
      throw new Error(`sitemap.xml included non-public writing route ${route}.`);
    }
  }

  if (sitemap.includes(`<loc>${peterProfile.canonicalOrigin}/writing/unknown-writing-slug</loc>`)) {
    throw new Error("sitemap.xml included unknown writing route /writing/unknown-writing-slug.");
  }
}

export function assertWritingDetailRouteCoverage(root: string): void {
  for (const route of writingDetailRoutes()) {
    routeHtmlPath(root, route);
  }
}

export function assertThemeDetailRouteCoverage(root: string): void {
  for (const route of themeDetailRoutes()) {
    routeHtmlPath(root, route);
  }
}

export function assertNoPrerenderedWritingRoute(root: string, route: string): void {
  const maybeOutputPath = routeHtmlCandidates(root, route).find((path) => existsSync(path));

  if (!maybeOutputPath) {
    return;
  }

  throw new Error(
    `Unexpected static writing output for ${route}: ${relative(root, maybeOutputPath)}`,
  );
}

export function assertNoPrerenderedWritingEntry(root: string, entry: WritingEntry): void {
  assertNoPrerenderedWritingRoute(root, writingDetailPath(entry));
}

export function assertNoPrerenderedThemeRoute(root: string, route: string): void {
  const maybeOutputPath = routeHtmlCandidates(root, route).find((path) => existsSync(path));

  if (!maybeOutputPath) {
    return;
  }

  throw new Error(
    `Unexpected static theme output for ${route}: ${relative(root, maybeOutputPath)}`,
  );
}

export function assertWritingFallbackMetadataSource(): void {
  const source = readFileSync(writingDetailRouteSourcePath, "utf8");
  const context = "Writing detail unknown-slug fallback source";

  assertHtmlContains(
    source,
    "<Title>No public writing here | Writing | Bright Builds</Title>",
    context,
  );
  assertHtmlContains(source, 'name="description"', context);
  assertHtmlContains(
    source,
    'content="Return to the writing index to browse published notes."',
    context,
  );
  assertHtmlContains(source, "No public writing here", context);
  assertHtmlContains(source, "Browse writing", context);
}

export function assertThemeFallbackSource(): void {
  const source = readFileSync(themeDetailRouteSourcePath, "utf8");
  const context = "Theme detail unknown-slug fallback source";

  assertHtmlContains(source, 'maybePublicThemeEntryBySlug(params.slug ?? "")', context);
  assertHtmlContains(source, "No public theme here", context);
  assertHtmlContains(source, "Browse theme paths", context);
  assertHtmlContains(source, 'href="/themes"', context);
}

export function assertNoRemoteRuntimeVisualAssets(root: string, paths: readonly string[]): void {
  const remoteAssetPatterns = [
    { label: "remote asset <img src>", pattern: /<img\b[^>]+\bsrc=["']\s*https?:\/\//i },
    {
      label: "remote asset image/source srcset",
      pattern: /<(?:img|source)\b[^>]+\bsrcset=["'][^"']*https?:\/\//i,
    },
    { label: "remote asset <video src>", pattern: /<video\b[^>]+\bsrc=["']\s*https?:\/\//i },
    { label: "remote asset <audio src>", pattern: /<audio\b[^>]+\bsrc=["']\s*https?:\/\//i },
    { label: "remote asset CSS url()", pattern: /url\(\s*["']?https?:\/\//i },
  ] as const;

  for (const path of paths) {
    const source = readFileSync(path, "utf8");

    for (const { label, pattern } of remoteAssetPatterns) {
      if (pattern.test(source)) {
        throw new Error(`${relative(root, path)} contains forbidden ${label}.`);
      }
    }
  }
}

export function assertReducedMotionCss(
  root: string,
  emittedCssFiles: readonly string[] = cssFiles(root),
): void {
  const emittedCss = emittedCssFiles.map((path) => readFileSync(path, "utf8")).join("\n");

  if (!emittedCss.includes("prefers-reduced-motion")) {
    throw new Error("Emitted CSS did not include prefers-reduced-motion output.");
  }

  if (!/:root\s+\*/.test(emittedCss)) {
    throw new Error('Emitted CSS did not include the required ":root *" reduced-motion selector.');
  }

  if (!/transition-duration\s*:\s*\.?0?1ms/.test(emittedCss)) {
    throw new Error("Emitted CSS did not reduce transition durations for reduced motion.");
  }
}

function assertAllOutputForbiddenTextAbsent(
  outputRoot: string,
  outputHtmlFiles: readonly string[],
): void {
  for (const htmlPath of outputHtmlFiles) {
    assertForbiddenTextAbsent(
      outputRoot,
      htmlPath,
      readFileSync(htmlPath, "utf8"),
      generatedOutputForbiddenPatterns,
    );
  }
}
