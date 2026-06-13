import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

import {
  gitHubMetadataFactsForProject,
  maybeGitHubHomepageLinkForProject,
  maybeGitHubMetadataForProject,
} from "../src/domain/github-metadata";
import { peterProfile } from "../src/domain/profile";
import type { ProjectDetailPageProject, ProjectStory } from "../src/domain/projects";
import {
  currentFocusProjects,
  homeProjects,
  maybeProjectDetailPageProjectBySlug,
  projectDetailPath,
  projectDetailRoutes,
  projectLinkDisplayLabel,
  projectStoryHref,
  publicProjectIndexProjects,
  writingProjects,
} from "../src/domain/projects";
import type { SiteRoute } from "../src/domain/routes";
import { prerenderRoutes, routeByPath } from "../src/domain/routes";
import type { PageMetadata } from "../src/domain/seo";
import {
  metadataForProject,
  metadataForRoute,
  personJsonLd,
  projectItemListJsonLd,
  projectJsonLd,
  robotsTxt,
  sitemapXml,
} from "../src/domain/seo";
import type { PublicWritingEntry, WritingBodyBlock, WritingEntry } from "../src/domain/writing";
import {
  curatedWriting,
  maybePublicWritingEntryBySlug,
  publicWritingEntries,
  relatedProjectDetailPageProjects,
  writingDetailPath,
  writingDetailRoutes,
} from "../src/domain/writing";

type StaticRouteCheck = {
  route: string;
  expectedTexts: readonly string[];
  forbiddenTextPatterns?: readonly ForbiddenTextPattern[];
};

type ForbiddenTextPattern = {
  label: string;
  pattern: RegExp;
};

const staticOutputRoot = ".output/public";
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
  { label: 'href="javascript:', pattern: /href=["']javascript:/i },
  { label: 'href="data:', pattern: /href=["']data:/i },
  { label: "api.github.com", pattern: /api\.github\.com/i },
  { label: "github.com/graphql", pattern: /github\.com\/graphql/i },
  { label: "@octokit/", pattern: /@octokit\//i },
  { label: "GITHUB_TOKEN", pattern: /GITHUB_TOKEN/ },
  { label: "VITE_*GITHUB*TOKEN", pattern: /VITE_[A-Z0-9_]*GITHUB[A-Z0-9_]*TOKEN/i },
  { label: "No GitHub metadata yet", pattern: /No GitHub metadata yet/i },
  {
    label: "GitHub metadata refresh failed",
    pattern: /GitHub metadata refresh failed/i,
  },
] as const satisfies readonly ForbiddenTextPattern[];

const writingDateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "long",
  timeZone: "UTC",
  year: "numeric",
});

export const expectedRoutes: StaticRouteCheck[] = prerenderRoutes.map((route) => ({
  route,
  expectedTexts: ["OpenLinks profile", ...expectedTextsForRoute(route)],
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

function cssFiles(root: string): string[] {
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

function routeHtmlCandidates(root: string, route: string): string[] {
  if (route === "/") {
    return [join(root, "index.html")];
  }

  const routeSegment = route.replace(/^\//, "");

  return [join(root, routeSegment, "index.html"), join(root, `${routeSegment}.html`)];
}

function findStaticOutputRoot(): string {
  const staticHtmlFiles = htmlFiles(staticOutputRoot);

  if (staticHtmlFiles.length > 0) {
    return staticOutputRoot;
  }

  throw new Error(`No static HTML output found in ${staticOutputRoot}. Run bun run build first.`);
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

  assertPhase04ShellHtml(check.route, html, bodyBeforeHydration);

  for (const expectedText of check.expectedTexts) {
    assertHtmlContains(
      bodyBeforeHydration,
      expectedText,
      `Static body for ${check.route} before hydration`,
    );
  }

  assertGitHubMetadataEnrichmentHtml(check.route, bodyBeforeHydration);
  assertForbiddenTextAbsent(root, htmlPath, html, check.forbiddenTextPatterns ?? []);
}

function assertPhase04ShellHtml(route: string, html: string, bodyBeforeHydration: string): void {
  assertHtmlMatches(html, /<html[^>]+class="[^"]*\bdark\b[^"]*"/, `${route} dark root`);
  assertHtmlContains(bodyBeforeHydration, "site-shell", `${route} static site-shell`);
  assertHtmlContains(
    bodyBeforeHydration,
    '<main id="content" class="site-main">',
    `${route} static main landmark`,
  );

  if (route === "/") {
    assertHtmlContains(bodyBeforeHydration, "brand-material", "home local visual hook");
    assertHtmlContains(bodyBeforeHydration, "Peter Ryszkiewicz", "home identity copy");
    assertHtmlContains(bodyBeforeHydration, "Browse projects", "home project CTA");
    assertHtmlContains(bodyBeforeHydration, "Now building", "home focus panel");
    assertHtmlContains(
      bodyBeforeHydration,
      "Flagship work selected from the curated registry",
      "home flagship story text",
    );
  }

  if (route === "/about") {
    assertHtmlContains(
      bodyBeforeHydration,
      "OpenLinks identity hub",
      "about OpenLinks profile placement",
    );
  }

  if (route === "/contact") {
    assertHtmlContains(bodyBeforeHydration, "OpenLinks", "contact OpenLinks profile placement");
    assertHtmlContains(bodyBeforeHydration, "https://openlinks.us/", "contact OpenLinks URL");
  }

  assertHtmlContains(bodyBeforeHydration, "OpenLinks profile", `${route} footer OpenLinks profile`);
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
  const maybeProject = maybeProjectForDetailRoute(route);

  if (maybeProject) {
    const relatedWritingExpectedTexts = relatedWritingExpectedTextsForProject(maybeProject);

    return [
      "Project story",
      maybeProject.name,
      maybeProject.detail.intro,
      "Storyline",
      "Technical shape",
      maybeProject.detail.technicalShape,
      "Problem",
      maybeProject.story.problem,
      "Approach",
      maybeProject.story.approach,
      "Why it matters",
      maybeProject.story.whyItMatters,
      "Current status",
      maybeProject.detail.currentStatus,
      "Collaboration angle",
      maybeProject.detail.collaborationAngle,
      "Proof points",
      ...maybeProject.detail.proofPoints,
      "Project facts",
      "GitHub repository metadata",
      "Project actions",
      "Project index",
      "Use these links to inspect the source, try the live surface when one exists, or return to the full project index.",
      ...projectActionLinkExpectedTexts(maybeProject),
      ...relatedWritingExpectedTexts,
    ];
  }

  const maybeWriting = maybeWritingForDetailRoute(route);

  if (maybeWriting) {
    return writingDetailExpectedTexts(maybeWriting);
  }

  if (route === "/") {
    return [
      routeStaticCheckText(route),
      "Browse projects",
      "Now building",
      ...currentFocusProjects().map((project) => project.name),
      ...homeProjects().flatMap((project) => [
        project.name,
        project.oneLine,
        project.story.whyItMatters,
        `href="${projectStoryHref(project)}"`,
      ]),
    ];
  }

  if (route === "/writing") {
    return [
      routeStaticCheckText(route),
      "Notes and essays",
      "Writing",
      "Curated notes on agentic engineering, open systems, identity, and practical web software.",
      ...publicWritingEntries().flatMap(writingIndexEntryExpectedTexts),
    ];
  }

  if (route === "/projects") {
    return [
      routeStaticCheckText(route),
      "Flagship",
      "Supporting",
      "Lab / Prototype",
      "Writing",
      "Archive",
      "Some reviewed repositories stay hidden or excluded from the public portfolio until they have enough authored context.",
      "Hidden or excluded reviewed records:",
      ...writingGroupExpectedTexts(),
      ...publicProjectIndexProjects().flatMap((project) => [
        project.name,
        project.oneLine,
        `id="${project.slug}"`,
        `href="${projectStoryHref(project)}"`,
      ]),
    ];
  }

  if (route === "/about") {
    return [
      routeStaticCheckText(route),
      "Agentic engineering",
      "Open source",
      "Bitcoin and decentralized systems",
      "Web tooling",
      "Creative experiments",
    ];
  }

  if (route === "/contact") {
    return [
      routeStaticCheckText(route),
      "GitHub is the best place to start for code and collaboration. OpenLinks is Peter's identity hub for current links.",
    ];
  }

  return [];
}

function projectActionLinkExpectedTexts(project: ProjectStory): readonly string[] {
  const maybeHomepageLink = maybeGitHubHomepageLinkForProject(project);

  return [
    ...project.links.flatMap((link) => [
      `href="${escapeHtmlAttribute(link.href)}"`,
      projectLinkDisplayLabel(link),
    ]),
    ...(maybeHomepageLink
      ? [
          `href="${escapeHtmlAttribute(maybeHomepageLink.href)}"`,
          projectLinkDisplayLabel(maybeHomepageLink),
        ]
      : []),
  ];
}

function maybeProjectForDetailRoute(route: string): ProjectDetailPageProject | null {
  const detailRoutePrefix = "/projects/";

  if (!route.startsWith(detailRoutePrefix)) {
    return null;
  }

  return maybeProjectDetailPageProjectBySlug(route.slice(detailRoutePrefix.length));
}

function maybeWritingForDetailRoute(route: string): PublicWritingEntry | null {
  const detailRoutePrefix = "/writing/";

  if (!route.startsWith(detailRoutePrefix)) {
    return null;
  }

  return maybePublicWritingEntryBySlug(route.slice(detailRoutePrefix.length));
}

function routeStaticCheckText(route: string): string {
  return topLevelRouteForPath(route).staticCheckText;
}

function topLevelRouteForPath(path: string): SiteRoute {
  const routeDefinition = routeByPath(path);

  if (routeDefinition.path !== path) {
    throw new Error(`No top-level route definition found for ${path}.`);
  }

  return routeDefinition;
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

function writingIndexEntryExpectedTexts(entry: PublicWritingEntry): readonly string[] {
  const relatedProjects = relatedProjectDetailPageProjects(entry);

  return [
    entry.title,
    entry.summary,
    `href="${escapeHtmlAttribute(writingDetailPath(entry))}"`,
    writingActionLabel(entry),
    ...writingVisibleDateExpectedText(entry),
    ...entry.topics,
    ...entry.tags,
    ...(relatedProjects.length > 0 ? [relatedProjectCountText(relatedProjects.length)] : []),
  ];
}

function writingDetailExpectedTexts(entry: PublicWritingEntry): readonly string[] {
  return [
    "Back to writing",
    writingKindLabel(entry),
    entry.title,
    entry.summary,
    ...writingVisibleDateExpectedText(entry),
    ...entry.sections.flatMap((section) => [
      section.heading,
      ...section.blocks.flatMap(writingBodyBlockExpectedTexts),
    ]),
    ...relatedProjectDetailPageProjects(entry).flatMap((project) => [
      project.name,
      project.oneLine,
      "Project details",
      `href="${escapeHtmlAttribute(projectDetailPath(project))}"`,
    ]),
  ];
}

function writingBodyBlockExpectedTexts(block: WritingBodyBlock): readonly string[] {
  if (block.kind === "paragraph" || block.kind === "callout") {
    return [block.text];
  }

  if (block.kind === "list") {
    return [...block.items];
  }

  return [block.label, `href="${escapeHtmlAttribute(block.href)}"`];
}

function relatedWritingExpectedTextsForProject(
  project: ProjectDetailPageProject,
): readonly string[] {
  const relatedWritingEntries = publicWritingEntries().filter((entry) =>
    entry.relatedProjectSlugs.includes(project.slug),
  );

  if (relatedWritingEntries.length === 0) {
    return [];
  }

  return [
    "Related writing",
    ...relatedWritingEntries.flatMap((entry) => [
      entry.title,
      entry.summary,
      writingActionLabel(entry),
      `href="${escapeHtmlAttribute(writingDetailPath(entry))}"`,
    ]),
  ];
}

function relatedProjectCountText(count: number): string {
  return count === 1 ? "1 related project" : `${count} related projects`;
}

function writingKindLabel(entry: Pick<PublicWritingEntry, "kind">): "Note" | "Essay" {
  return entry.kind === "note" ? "Note" : "Essay";
}

function writingActionLabel(entry: Pick<PublicWritingEntry, "kind">): "Read note" | "Read essay" {
  return entry.kind === "note" ? "Read note" : "Read essay";
}

function writingVisibleDateExpectedText(entry: PublicWritingEntry): readonly string[] {
  const maybeDateLabel = writingDateLabel(entry);

  return maybeDateLabel ? [maybeDateLabel] : [];
}

function writingDateLabel(entry: PublicWritingEntry): string | null {
  if (entry.maybePublishedOn) {
    return `Published ${writingDateFormatter.format(new Date(`${entry.maybePublishedOn}T00:00:00Z`))}`;
  }

  if (entry.maybeUpdatedOn) {
    return `Updated ${writingDateFormatter.format(new Date(`${entry.maybeUpdatedOn}T00:00:00Z`))}`;
  }

  return null;
}

function assertGitHubMetadataEnrichmentHtml(route: string, bodyBeforeHydration: string): void {
  const maybeProject = maybeProjectForDetailRoute(route);

  if (maybeProject) {
    if (maybeGitHubMetadataForProject(maybeProject)) {
      assertGitHubMetadataFactsHtml(maybeProject, bodyBeforeHydration, "project detail");
    }

    return;
  }

  if (route === "/") {
    assertHomeGitHubMetadataHtml(bodyBeforeHydration);
    return;
  }

  if (route === "/projects") {
    assertProjectIndexGitHubMetadataHtml(bodyBeforeHydration);
  }
}

function assertHomeGitHubMetadataHtml(bodyBeforeHydration: string): void {
  const projects = homeProjects();

  for (const [index, project] of projects.entries()) {
    if (!maybeGitHubMetadataForProject(project)) {
      continue;
    }

    const segment = htmlSegmentForProject({
      html: bodyBeforeHydration,
      startMarker: homeProjectCardMarker(project),
      maybeEndMarker: maybeHomeProjectCardMarker(projects[index + 1]),
      context: `home GitHub repository metadata for ${project.slug}`,
    });

    assertGitHubMetadataFactsHtml(project, segment, "home");

    const maybeHomepageLink = maybeGitHubHomepageLinkForProject(project);

    if (maybeHomepageLink) {
      assertHtmlContains(
        segment,
        `href="${escapeHtmlAttribute(maybeHomepageLink.href)}"`,
        `home GitHub homepage link for ${project.slug}`,
      );
      assertHtmlContains(
        segment,
        projectLinkDisplayLabel(maybeHomepageLink),
        `home GitHub homepage link label for ${project.slug}`,
      );
    }
  }
}

function assertProjectIndexGitHubMetadataHtml(bodyBeforeHydration: string): void {
  const projects = publicProjectIndexProjects();

  for (const [index, project] of projects.entries()) {
    if (!maybeGitHubMetadataForProject(project)) {
      continue;
    }

    const segment = htmlSegmentForProject({
      html: bodyBeforeHydration,
      startMarker: projectIndexCardMarker(project),
      maybeEndMarker: maybeProjectIndexCardMarker(projects[index + 1]),
      context: `project index GitHub repository metadata for ${project.slug}`,
    });

    assertGitHubMetadataFactsHtml(project, segment, "project index");
  }
}

function assertGitHubMetadataFactsHtml(
  project: ProjectStory,
  html: string,
  routeLabel: string,
): void {
  assertHtmlContains(
    html,
    'aria-label="GitHub repository metadata"',
    `${routeLabel} metadata row for ${project.slug}`,
  );

  for (const fact of gitHubMetadataFactsForProject(project)) {
    assertHtmlContains(
      html,
      escapeHtmlText(fact.label),
      `${routeLabel} metadata fact label for ${project.slug}`,
    );
    assertHtmlContains(
      html,
      escapeHtmlText(fact.value),
      `${routeLabel} metadata fact value for ${project.slug}`,
    );
  }
}

function htmlSegmentForProject(options: {
  html: string;
  startMarker: string;
  maybeEndMarker: string | null;
  context: string;
}): string {
  const start = options.html.indexOf(options.startMarker);

  if (start === -1) {
    throw new Error(`${options.context} missing start marker: ${options.startMarker}`);
  }

  const end =
    options.maybeEndMarker === null
      ? -1
      : options.html.indexOf(options.maybeEndMarker, start + options.startMarker.length);

  return options.html.slice(start, end === -1 ? options.html.length : end);
}

function homeProjectCardMarker(project: ProjectStory): string {
  return `<h3 class="card-title">${escapeHtmlText(project.name)}</h3>`;
}

function maybeHomeProjectCardMarker(maybeProject: ProjectStory | undefined): string | null {
  return maybeProject ? homeProjectCardMarker(maybeProject) : null;
}

function projectIndexCardMarker(project: ProjectStory): string {
  return `id="${escapeHtmlAttribute(project.slug)}"`;
}

function maybeProjectIndexCardMarker(maybeProject: ProjectStory | undefined): string | null {
  return maybeProject ? projectIndexCardMarker(maybeProject) : null;
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
  assertMetadata(route.path, metadataForRoute(route), html);
}

function assertMetadataForProject(project: ProjectDetailPageProject, html: string): void {
  assertMetadata(projectDetailPath(project), metadataForProject(project), html);
}

function assertMetadata(path: string, metadata: PageMetadata, html: string): void {
  const image = metadata.openGraph.image;

  assertHtmlMatches(
    html,
    new RegExp(`<title[^>]*>${escapeRegExp(escapeHtmlText(metadata.title))}</title>`),
    `${path} title`,
  );
  assertHtmlContains(
    html,
    `name="description" content="${escapeHtmlAttribute(metadata.description)}"`,
    `${path} meta description`,
  );
  assertHtmlContains(
    html,
    `rel="canonical" href="${escapeHtmlAttribute(metadata.canonical)}"`,
    `${path} canonical`,
  );
  assertHtmlContains(
    html,
    `property="og:title" content="${escapeHtmlAttribute(metadata.openGraph.title)}"`,
    `${path} og:title`,
  );
  assertHtmlContains(
    html,
    `property="og:description" content="${escapeHtmlAttribute(metadata.openGraph.description)}"`,
    `${path} og:description`,
  );
  assertHtmlContains(
    html,
    `property="og:url" content="${escapeHtmlAttribute(metadata.openGraph.url)}"`,
    `${path} og:url`,
  );
  assertHtmlContains(
    html,
    `property="og:type" content="${metadata.openGraph.type}"`,
    `${path} og:type`,
  );
  assertHtmlContains(html, `property="og:image" content="${image.url}"`, `${path} og:image`);
  assertHtmlContains(
    html,
    `property="og:image:width" content="${image.width.toString()}"`,
    `${path} og:image:width`,
  );
  assertHtmlContains(
    html,
    `property="og:image:height" content="${image.height.toString()}"`,
    `${path} og:image:height`,
  );
  assertHtmlContains(
    html,
    `property="og:image:alt" content="${escapeHtmlAttribute(image.alt)}"`,
    `${path} og:image:alt`,
  );
  assertHtmlContains(
    html,
    `name="twitter:card" content="${metadata.twitter.card}"`,
    `${path} twitter:card`,
  );
  assertHtmlContains(
    html,
    `name="twitter:title" content="${escapeHtmlAttribute(metadata.twitter.title)}"`,
    `${path} twitter:title`,
  );
  assertHtmlContains(
    html,
    `name="twitter:description" content="${escapeHtmlAttribute(metadata.twitter.description)}"`,
    `${path} twitter:description`,
  );
  assertHtmlContains(
    html,
    `name="twitter:image" content="${metadata.twitter.image.url}"`,
    `${path} twitter:image`,
  );
  assertHtmlContains(
    html,
    `name="twitter:image:alt" content="${escapeHtmlAttribute(metadata.twitter.image.alt)}"`,
    `${path} twitter:image:alt`,
  );
  assertMetadataImageMapsToLocalAsset(image.url);
  assertMetadataImageMapsToLocalAsset(metadata.twitter.image.url);
}

function assertProjectJsonLd(project: ProjectDetailPageProject, html: string): void {
  const expectedJsonLd = projectJsonLd(project);
  const maybeProfileSameAsUrl = expectedJsonLd.creator.sameAs[0];

  if (!maybeProfileSameAsUrl) {
    throw new Error(`Project JSON-LD for ${project.slug} did not include a profile sameAs URL.`);
  }

  assertJsonLdContains(html, [
    "SoftwareSourceCode",
    expectedJsonLd.name,
    expectedJsonLd.url,
    maybeProfileSameAsUrl,
  ]);
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

function assertMetadataImageMapsToLocalAsset(imageUrl: string): void {
  const url = new URL(imageUrl);

  if (url.origin !== peterProfile.canonicalOrigin) {
    throw new Error(`Metadata image URL is not canonical: ${imageUrl}`);
  }

  const assetPath = url.pathname.replace(/^\//, "");

  if (assetPath !== "social/bright-builds-og.png") {
    throw new Error(
      `Metadata image URL ${imageUrl} does not map to the project social preview fallback.`,
    );
  }

  if (!existsSync(join(staticOutputRoot, assetPath))) {
    throw new Error(`Metadata image URL ${imageUrl} does not map to a checked-in output asset.`);
  }
}

function assertSitemapProjectDetailCoverage(root: string): void {
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

function assertWritingDetailRouteCoverage(root: string): void {
  for (const route of writingDetailRoutes()) {
    routeHtmlPath(root, route);
  }
}

function assertNoPrerenderedWritingRoute(root: string, route: string): void {
  const maybeOutputPath = routeHtmlCandidates(root, route).find((path) => existsSync(path));

  if (!maybeOutputPath) {
    return;
  }

  throw new Error(
    `Unexpected static writing output for ${route}: ${relative(root, maybeOutputPath)}`,
  );
}

function assertNoPrerenderedWritingEntry(root: string, entry: WritingEntry): void {
  assertNoPrerenderedWritingRoute(root, writingDetailPath(entry));
}

function assertNoRemoteRuntimeVisualAssets(root: string, paths: readonly string[]): void {
  const remoteAssetPatterns = [
    { label: "remote asset <img src>", pattern: /<img\b[^>]+\bsrc=["']https?:\/\//gi },
    { label: "remote asset <source srcset>", pattern: /<source\b[^>]+\bsrcset=["']https?:\/\//gi },
    { label: "remote asset <video src>", pattern: /<video\b[^>]+\bsrc=["']https?:\/\//gi },
    { label: "remote asset <audio src>", pattern: /<audio\b[^>]+\bsrc=["']https?:\/\//gi },
    { label: "remote asset CSS url()", pattern: /url\(\s*["']?https?:\/\//gi },
  ] as const satisfies readonly ForbiddenTextPattern[];

  for (const path of paths) {
    const source = readFileSync(path, "utf8");

    for (const { label, pattern } of remoteAssetPatterns) {
      if (pattern.test(source)) {
        throw new Error(`${relative(root, path)} contains forbidden ${label}.`);
      }
    }
  }
}

function assertReducedMotionCss(root: string): void {
  const emittedCssFiles = cssFiles(root);
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

const outputRoot = findStaticOutputRoot();
const outputHtmlFiles = htmlFiles(outputRoot);
const outputCssFiles = cssFiles(outputRoot);

for (const check of expectedRoutes) {
  assertRouteHtml(outputRoot, check);
  const html = readRouteHtml(outputRoot, check.route);
  const maybeProject = maybeProjectForDetailRoute(check.route);

  if (maybeProject) {
    assertMetadataForProject(maybeProject, html);
    assertProjectJsonLd(maybeProject, html);
    continue;
  }

  const maybeWriting = maybeWritingForDetailRoute(check.route);

  if (maybeWriting) {
    continue;
  }

  const route = topLevelRouteForPath(check.route);

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
      ...publicProjectIndexProjects().map(
        (project) => `${peterProfile.canonicalOrigin}${projectIndexItemPath(project)}`,
      ),
    ]);
  }
}

function projectIndexItemPath(project: ProjectStory): string {
  return projectStoryHref(project);
}

assertWritingDetailRouteCoverage(outputRoot);
assertNoRemoteRuntimeVisualAssets(outputRoot, [...outputHtmlFiles, ...outputCssFiles]);
assertReducedMotionCss(outputRoot);

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
for (const entry of curatedWriting) {
  if (entry.status === "published") {
    continue;
  }

  assertNoPrerenderedWritingEntry(outputRoot, entry);
}
assertNoPrerenderedWritingRoute(outputRoot, "/writing/unknown-writing-slug");
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
