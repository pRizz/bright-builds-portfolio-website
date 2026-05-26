import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { peterProfile } from "../src/domain/profile";
import {
  currentFocusProjects,
  homeProjects,
  projectAnchorHref,
  visibleProjects,
} from "../src/domain/projects";
import { prerenderRoutes, routeByPath } from "../src/domain/routes";
import {
  metadataForRoute,
  personJsonLd,
  projectItemListJsonLd,
  robotsTxt,
  sitemapXml,
} from "../src/domain/seo";

type StaticRouteCheck = {
  route: string;
  expectedTexts: readonly string[];
  forbiddenTextPatterns?: readonly RegExp[];
};

const candidateOutputRoots = ["dist", ".output/public"];
const staleStandaloneRepoHrefs = [
  "https://github.com/pRizz/openlinks",
  "https://github.com/pRizz/win3bitcoin",
  "https://github.com/pRizz/open-bitcoin",
] as const;
const staleStandaloneRepoHrefPatterns = staleStandaloneRepoHrefs.map(
  (href) => new RegExp(`${escapeRegExp(href)}(?=["'/?#])`),
);

export const expectedRoutes: StaticRouteCheck[] = prerenderRoutes.map((route) => ({
  route,
  expectedTexts: [routeByPath(route).staticCheckText, ...expectedTextsForRoute(route)],
  forbiddenTextPatterns: staleStandaloneRepoHrefPatterns,
}));

function htmlFiles(root: string): string[] {
  if (!existsSync(root)) {
    return [];
  }

  const entries = readdirSync(root);
  const files: string[] = [];

  for (const entry of entries) {
    const path = join(root, entry);
    const stats = statSync(path);

    if (stats.isDirectory()) {
      files.push(...htmlFiles(path));
      continue;
    }

    if (entry.endsWith(".html")) {
      files.push(path);
    }
  }

  return files;
}

function routeHtmlCandidates(root: string, route: string): string[] {
  if (route === "/") {
    return [join(root, "index.html")];
  }

  const routeSegment = route.replace(/^\//, "");

  return [join(root, routeSegment, "index.html"), join(root, `${routeSegment}.html`)];
}

function findStaticOutputRoot(): string {
  const maybeRoot = candidateOutputRoots.find((root) => htmlFiles(root).length > 0);

  if (!maybeRoot) {
    throw new Error(
      `No static HTML output found. Checked: ${candidateOutputRoots.join(", ")}. Run bun run build first.`,
    );
  }

  return maybeRoot;
}

function assertRouteHtml(root: string, check: StaticRouteCheck): void {
  const maybeHtmlPath = routeHtmlCandidates(root, check.route).find((path) => existsSync(path));

  if (!maybeHtmlPath) {
    throw new Error(
      `Missing prerendered HTML for ${check.route}. Tried: ${routeHtmlCandidates(root, check.route)
        .map((path) => relative(root, path))
        .join(", ")}`,
    );
  }

  const html = readFileSync(maybeHtmlPath, "utf8");

  for (const expectedText of check.expectedTexts) {
    if (!html.includes(expectedText)) {
      throw new Error(
        `Static HTML for ${check.route} did not contain expected text: ${expectedText}`,
      );
    }
  }

  assertForbiddenTextAbsent(root, maybeHtmlPath, html, check.forbiddenTextPatterns ?? []);
}

function expectedTextsForRoute(route: string): readonly string[] {
  if (route === "/") {
    return [
      peterProfile.name,
      peterProfile.handle,
      ...homeProjects().flatMap((project) => [project.name, project.oneLine]),
    ];
  }

  if (route === "/projects") {
    return visibleProjects().flatMap((project) => [project.name, project.oneLine]);
  }

  return [];
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function assertForbiddenTextAbsent(
  root: string,
  path: string,
  html: string,
  patterns: readonly RegExp[],
): void {
  for (const pattern of patterns) {
    if (pattern.test(html)) {
      throw new Error(
        `Static HTML for ${relative(root, path)} contained forbidden text pattern: ${pattern}`,
      );
    }
  }
}

const outputRoot = findStaticOutputRoot();
const outputHtmlFiles = htmlFiles(outputRoot);

for (const check of expectedRoutes) {
  assertRouteHtml(outputRoot, check);
  const html = readRouteHtml(outputRoot, check.route);
  const route = routeByPath(check.route);

  assertMetadataForRoute(route, html);
  assertJsonLdContains(html, [
    "Person",
    peterProfile.name,
    "https://github.com/pRizz",
    "https://openlinks.us/",
    JSON.stringify(personJsonLd()),
  ]);

  if (check.route === "/projects") {
    assertJsonLdContains(html, [
      "ItemList",
      JSON.stringify(projectItemListJsonLd()),
      ...visibleProjects().map(
        (project) => `${peterProfile.canonicalOrigin}${projectAnchorHref(project)}`,
      ),
    ]);
  }
}

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
assertOutputTextEquals(outputRoot, "robots.txt", robotsTxt());

for (const route of prerenderRoutes) {
  const metadata = metadataForRoute(routeByPath(route));
  console.log(`Checked metadata contract for ${metadata.canonical}.`);
}

for (const htmlPath of outputHtmlFiles) {
  assertForbiddenTextAbsent(
    outputRoot,
    htmlPath,
    readFileSync(htmlPath, "utf8"),
    staleStandaloneRepoHrefPatterns,
  );
}

console.log(`Verified ${expectedRoutes.length} prerendered routes in ${outputRoot}.`);
