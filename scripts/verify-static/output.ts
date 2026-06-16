import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

import { staticOutputRoot } from "./config";

export function htmlFiles(root: string): string[] {
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

export function cssFiles(root: string): string[] {
  if (!existsSync(root)) {
    return [];
  }

  const entries = readdirSync(root);
  const files: string[] = [];

  for (const entry of entries) {
    const path = join(root, entry);
    const stats = statSync(path);

    if (stats.isDirectory()) {
      files.push(...cssFiles(path));
      continue;
    }

    if (entry.endsWith(".css")) {
      files.push(path);
    }
  }

  return files;
}

export function routeHtmlCandidates(root: string, route: string): string[] {
  if (route === "/") {
    return [join(root, "index.html")];
  }

  const routeSegment = route.replace(/^\//, "");

  return [join(root, routeSegment, "index.html"), join(root, `${routeSegment}.html`)];
}

export function findStaticOutputRoot(): string {
  const staticHtmlFiles = htmlFiles(staticOutputRoot);

  if (staticHtmlFiles.length > 0) {
    return staticOutputRoot;
  }

  throw new Error(`No static HTML output found in ${staticOutputRoot}. Run bun run build first.`);
}

export function routeHtmlPath(root: string, route: string): string {
  const maybeHtmlPath = routeHtmlCandidates(root, route).find((path) => existsSync(path));

  if (maybeHtmlPath) {
    return maybeHtmlPath;
  }

  throw new Error(
    `Missing prerendered HTML for ${route}. Tried: ${routeHtmlCandidates(root, route)
      .map((path) => relative(root, path))
      .join(", ")}`,
  );
}

export function readRouteHtml(root: string, route: string): string {
  return readFileSync(routeHtmlPath(root, route), "utf8");
}

export function assertOutputFile(root: string, path: string): string {
  const outputPath = join(root, path);

  if (existsSync(outputPath) && statSync(outputPath).isFile()) {
    return outputPath;
  }

  throw new Error(`Missing static output file: ${path}`);
}

export function assertOutputTextEquals(root: string, path: string, expected: string): void {
  const outputPath = assertOutputFile(root, path);
  const actual = readFileSync(outputPath, "utf8");

  if (actual === expected) {
    return;
  }

  throw new Error(`Static output file ${path} drifted from the pure helper output.`);
}

export function assertPngDimensions(
  root: string,
  path: string,
  width: number,
  height: number,
): void {
  const outputPath = assertOutputFile(root, path);
  const data = readFileSync(outputPath);
  const pngSignature = "89504e470d0a1a0a";

  if (data.length < 24 || data.subarray(0, 8).toString("hex") !== pngSignature) {
    throw new Error(`Static output file ${path} is not a PNG.`);
  }

  const actualWidth = data.readUInt32BE(16);
  const actualHeight = data.readUInt32BE(20);

  if (actualWidth === width && actualHeight === height) {
    return;
  }

  throw new Error(
    `Static output file ${path} was ${actualWidth}x${actualHeight}; expected ${width}x${height}.`,
  );
}
