import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

import { peterProfile } from "../src/domain/profile";
import type { ProjectStory } from "../src/domain/projects";
import {
  currentFocusProjects,
  homeProjects,
  projectAnchorHref,
  visibleProjects,
} from "../src/domain/projects";
import type { SiteRoute } from "../src/domain/routes";
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
  forbiddenTextPatterns?: readonly ForbiddenTextPattern[];
};

type ForbiddenTextPattern = {
  label: string;
  pattern: RegExp;
};

const candidateOutputRoots = ["dist", ".output/public"];
const staleStandaloneRepoHrefs = [
  "https://github.com/pRizz/openlinks",
  "https://github.com/pRizz/win3bitcoin",
  "https://github.com/pRizz/open-bitcoin",
] as const;
const generatedOutputForbiddenPatterns = [
  ...staleStandaloneRepoHrefs.map((href) => ({
    label: href,
    pattern: new RegExp(`${escapeRegExp(href)}(?=["'/?#])`),
  })),
  { label: "Selected works", pattern: /Selected works/i },
  { label: "Creative Director", pattern: /Creative Director/i },
  { label: "Awwwards", pattern: /Awwwards/i },
  { label: "Lorem ipsum", pattern: /Lorem ipsum/i },
  { label: "fake case study", pattern: /fake case study/i },
  { label: "skill bar", pattern: /skill bar/i },
  { label: "api.github.com", pattern: /api\.github\.com/i },
  { label: "github.com/graphql", pattern: /github\.com\/graphql/i },
  { label: "@octokit/", pattern: /@octokit\//i },
  { label: "GITHUB_TOKEN", pattern: /GITHUB_TOKEN/ },
  { label: "VITE_*GITHUB*TOKEN", pattern: /VITE_[A-Z0-9_]*GITHUB[A-Z0-9_]*TOKEN/i },
] as const satisfies readonly ForbiddenTextPattern[];

export const expectedRoutes: StaticRouteCheck[] = prerenderRoutes.map((route) => ({
  route,
  expectedTexts: [
    routeByPath(route).staticCheckText,
    "OpenLinks profile",
    ...expectedTextsForRoute(route),
  ],
  forbiddenTextPatterns: generatedOutputForbiddenPatterns,
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

function routeHtmlPath(root: string, route: string): string {
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

function readRouteHtml(root: string, route: string): string {
  return readFileSync(routeHtmlPath(root, route), "utf8");
}

function assertRouteHtml(root: string, check: StaticRouteCheck): void {
  const htmlPath = routeHtmlPath(root, check.route);
  const html = readFileSync(htmlPath, "utf8");
  const bodyBeforeHydration = preHydrationBody(html);

  for (const expectedText of check.expectedTexts) {
    assertHtmlContains(
      bodyBeforeHydration,
      expectedText,
      `Static body for ${check.route} before hydration`,
    );
  }

  assertForbiddenTextAbsent(root, htmlPath, html, check.forbiddenTextPatterns ?? []);
}

function preHydrationBody(html: string): string {
  const bodyStart = html.indexOf("<body");
  const maybeHydrationStart = html.indexOf("<script>window.manifest");

  if (bodyStart === -1) {
    return html;
  }

  if (maybeHydrationStart === -1) {
    return html.slice(bodyStart);
  }

  return html.slice(bodyStart, maybeHydrationStart);
}

function expectedTextsForRoute(route: string): readonly string[] {
  if (route === "/") {
    return [
      "Browse projects",
      "Now building",
      ...currentFocusProjects().map((project) => project.name),
      ...homeProjects().flatMap((project) => [
        project.name,
        project.oneLine,
        project.story.whyItMatters,
      ]),
    ];
  }

  if (route === "/projects") {
    return [
      "Flagship",
      "Supporting",
      "Lab / Prototype",
      "Writing",
      "Archive",
      "Some reviewed repositories stay hidden or excluded from the public portfolio until they have enough authored context.",
      "Hidden or excluded reviewed records:",
      ...writingGroupExpectedTexts(),
      ...visibleProjects().flatMap((project) => [
        project.name,
        project.oneLine,
        `id="${project.slug}"`,
        `href="${projectAnchorHref(project)}"`,
      ]),
    ];
  }

  if (route === "/about") {
    return [
      "Agentic engineering",
      "Open source",
      "Bitcoin and decentralized systems",
      "Web tooling",
      "Creative experiments",
    ];
  }

  if (route === "/contact") {
    return [
      "GitHub is the best place to start for code and collaboration. OpenLinks is Peter's identity hub for current links.",
    ];
  }

  return [];
}

function writingGroupExpectedTexts(): readonly string[] {
  const projects = writingProjects();

  if (projects.length === 0) {
    return [
      "No reviewed projects in this group yet",
      "This section only shows entries from the curated registry after they have enough authored context.",
    ];
  }

  return projects.flatMap((project) => [project.name, project.oneLine]);
}

function writingProjects(
  projects: readonly ProjectStory[] = visibleProjects(),
): readonly ProjectStory[] {
  return projects.filter(
    (project) =>
      project.links.some((link) => link.kind === "article") ||
      project.tags.includes("writing") ||
      project.themes.includes("Writing"),
  );
}

function assertOutputFile(root: string, path: string): string {
  const outputPath = join(root, path);

  if (existsSync(outputPath) && statSync(outputPath).isFile()) {
    return outputPath;
  }

  throw new Error(`Missing static output file: ${path}`);
}

function assertOutputTextEquals(root: string, path: string, expected: string): void {
  const outputPath = assertOutputFile(root, path);
  const actual = readFileSync(outputPath, "utf8");

  if (actual === expected) {
    return;
  }

  throw new Error(`Static output file ${path} drifted from the pure helper output.`);
}

function assertPngDimensions(root: string, path: string, width: number, height: number): void {
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

function assertMetadataForRoute(route: SiteRoute, html: string): void {
  const metadata = metadataForRoute(route);
  const image = metadata.openGraph.image;

  assertHtmlMatches(
    html,
    new RegExp(`<title[^>]*>${escapeRegExp(escapeHtmlText(metadata.title))}</title>`),
    `${route.path} title`,
  );
  assertHtmlContains(
    html,
    `name="description" content="${escapeHtmlAttribute(metadata.description)}"`,
    `${route.path} meta description`,
  );
  assertHtmlContains(
    html,
    `rel="canonical" href="${escapeHtmlAttribute(metadata.canonical)}"`,
    `${route.path} canonical`,
  );
  assertHtmlContains(
    html,
    `property="og:title" content="${escapeHtmlAttribute(metadata.openGraph.title)}"`,
    `${route.path} og:title`,
  );
  assertHtmlContains(
    html,
    `property="og:description" content="${escapeHtmlAttribute(metadata.openGraph.description)}"`,
    `${route.path} og:description`,
  );
  assertHtmlContains(
    html,
    `property="og:url" content="${escapeHtmlAttribute(metadata.openGraph.url)}"`,
    `${route.path} og:url`,
  );
  assertHtmlContains(
    html,
    `property="og:type" content="${metadata.openGraph.type}"`,
    `${route.path} og:type`,
  );
  assertHtmlContains(html, `property="og:image" content="${image.url}"`, `${route.path} og:image`);
  assertHtmlContains(
    html,
    `property="og:image:width" content="${image.width.toString()}"`,
    `${route.path} og:image:width`,
  );
  assertHtmlContains(
    html,
    `property="og:image:height" content="${image.height.toString()}"`,
    `${route.path} og:image:height`,
  );
  assertHtmlContains(
    html,
    `property="og:image:alt" content="${escapeHtmlAttribute(image.alt)}"`,
    `${route.path} og:image:alt`,
  );
  assertHtmlContains(
    html,
    `name="twitter:card" content="${metadata.twitter.card}"`,
    `${route.path} twitter:card`,
  );
  assertHtmlContains(
    html,
    `name="twitter:title" content="${escapeHtmlAttribute(metadata.twitter.title)}"`,
    `${route.path} twitter:title`,
  );
  assertHtmlContains(
    html,
    `name="twitter:description" content="${escapeHtmlAttribute(metadata.twitter.description)}"`,
    `${route.path} twitter:description`,
  );
  assertHtmlContains(
    html,
    `name="twitter:image" content="${metadata.twitter.image.url}"`,
    `${route.path} twitter:image`,
  );
  assertHtmlContains(
    html,
    `name="twitter:image:alt" content="${escapeHtmlAttribute(metadata.twitter.image.alt)}"`,
    `${route.path} twitter:image:alt`,
  );
}

function assertJsonLdContains(html: string, expectedTexts: readonly string[]): void {
  const jsonLdScripts = [
    ...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs),
  ]
    .map((match) => match[1])
    .join("\n");

  if (!jsonLdScripts) {
    throw new Error("Generated HTML did not contain JSON-LD script content.");
  }

  for (const expectedText of expectedTexts) {
    assertHtmlContains(jsonLdScripts, expectedText, "JSON-LD script content");
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function escapeHtmlText(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeHtmlAttribute(value: string): string {
  return escapeHtmlText(value).replace(/"/g, "&quot;");
}

function assertHtmlContains(html: string, expectedText: string, context: string): void {
  if (html.includes(expectedText)) {
    return;
  }

  throw new Error(`${context} did not contain expected text: ${expectedText}`);
}

function assertHtmlMatches(html: string, pattern: RegExp, context: string): void {
  if (pattern.test(html)) {
    return;
  }

  throw new Error(`${context} did not match expected pattern: ${pattern}`);
}

function assertForbiddenTextAbsent(
  root: string,
  path: string,
  html: string,
  patterns: readonly ForbiddenTextPattern[],
): void {
  for (const { label, pattern } of patterns) {
    if (pattern.test(html)) {
      throw new Error(`Static HTML for ${relative(root, path)} contained forbidden text: ${label}`);
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

for (const htmlPath of outputHtmlFiles) {
  assertForbiddenTextAbsent(
    outputRoot,
    htmlPath,
    readFileSync(htmlPath, "utf8"),
    generatedOutputForbiddenPatterns,
  );
}

console.log(
  `Verified ${expectedRoutes.length} prerendered routes, metadata, JSON-LD, assets, sitemap, and robots in ${outputRoot}.`,
);
