import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { peterProfile } from "../src/domain/profile";
import { homeProjects, visibleProjects } from "../src/domain/projects";
import { prerenderRoutes, routeByPath } from "../src/domain/routes";

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
