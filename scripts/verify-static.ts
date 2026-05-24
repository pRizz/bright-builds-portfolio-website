import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { prerenderRoutes, routeByPath } from "../src/domain/routes";

type StaticRouteCheck = {
  route: string;
  expectedText: string;
};

const candidateOutputRoots = ["dist", ".output/public"];
export const expectedRoutes: StaticRouteCheck[] = prerenderRoutes.map((route) => ({
  route,
  expectedText: routeByPath(route).staticCheckText,
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

  if (!html.includes(check.expectedText)) {
    throw new Error(
      `Static HTML for ${check.route} did not contain expected text: ${check.expectedText}`,
    );
  }
}

const outputRoot = findStaticOutputRoot();

for (const check of expectedRoutes) {
  assertRouteHtml(outputRoot, check);
}

console.log(`Verified ${expectedRoutes.length} prerendered routes in ${outputRoot}.`);
