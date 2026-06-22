import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

import type { StaticReleaseRoute } from "../verify-release";
import type { FreshnessFinding } from "./report";

export type StaticOutputFreshnessRoutes = {
  routes: readonly StaticReleaseRoute[];
  findings: readonly FreshnessFinding[];
};

const defaultStaticOutputRoot = ".output/public";
const missingStaticOutputMessage =
  "Missing .output/public. Run bun run build before bun run report:freshness.";

export function readStaticOutputRoutesForFreshness(
  root = defaultStaticOutputRoot,
): StaticOutputFreshnessRoutes {
  if (!existsSync(root)) {
    return staticOutputMissing(root);
  }

  const routes = staticReleaseRoutes(root);

  if (routes.length === 0) {
    return staticOutputMissing(root);
  }

  return {
    routes,
    findings: [],
  };
}

function staticOutputMissing(root: string): StaticOutputFreshnessRoutes {
  return {
    routes: [],
    findings: [
      {
        severity: "release blocker",
        area: "static output",
        code: "static-output-missing",
        path: root,
        message: missingStaticOutputMessage,
      },
    ],
  };
}

function staticReleaseRoutes(root: string): readonly StaticReleaseRoute[] {
  return htmlFiles(root, root).map((path) => ({
    path,
    route: routeForHtmlPath(path),
    html: readFileSync(join(root, path), "utf8"),
  }));
}

function htmlFiles(root: string, currentPath: string): readonly string[] {
  const files: string[] = [];

  for (const entry of readdirSync(currentPath)) {
    const absolutePath = join(currentPath, entry);
    const stats = statSync(absolutePath);

    if (stats.isDirectory()) {
      files.push(...htmlFiles(root, absolutePath));
      continue;
    }

    const path = relative(root, absolutePath);

    if (path.endsWith(".html")) {
      files.push(path);
    }
  }

  return files.sort((left, right) => left.localeCompare(right));
}

function routeForHtmlPath(path: string): string {
  if (path === "index.html") {
    return "/";
  }

  if (path.endsWith("/index.html")) {
    return normalizedRoutePath(`/${path.slice(0, -"/index.html".length)}`);
  }

  return normalizedRoutePath(`/${path.slice(0, -".html".length)}`);
}

function normalizedRoutePath(path: string): string {
  const withLeadingSlash = path.startsWith("/") ? path : `/${path}`;
  const withoutTrailingSlash =
    withLeadingSlash.length > 1 ? withLeadingSlash.replace(/\/+$/, "") : withLeadingSlash;

  return withoutTrailingSlash || "/";
}
