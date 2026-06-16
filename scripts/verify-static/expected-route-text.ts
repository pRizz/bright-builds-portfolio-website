import { maybeGitHubHomepageLinkForProject } from "../../src/domain/github-metadata";
import type { ProjectDetailPageProject, ProjectStory } from "../../src/domain/projects";
import {
  currentFocusProjects,
  homeProjects,
  maybeProjectDetailPageProjectBySlug,
  projectDetailPath,
  projectLinkDisplayLabel,
  projectStoryHref,
  publicProjectIndexProjects,
  writingProjects,
} from "../../src/domain/projects";
import type { SiteRoute } from "../../src/domain/routes";
import { prerenderRoutes, routeByPath } from "../../src/domain/routes";
import type { PublicWritingEntry, WritingBodyBlock } from "../../src/domain/writing";
import {
  maybePublicWritingEntryBySlug,
  publicWritingEntries,
  relatedProjectDetailPageProjects,
  writingDetailPath,
} from "../../src/domain/writing";
import { generatedOutputForbiddenPatterns, writingDateFormatter } from "./config";
import { escapeHtmlAttribute } from "./html-assertions";
import type { StaticRouteCheck } from "./types";

export const expectedRoutes: StaticRouteCheck[] = prerenderRoutes.map((route) => ({
  route,
  expectedTexts: ["OpenLinks profile", ...expectedTextsForRoute(route)],
  forbiddenTextPatterns: generatedOutputForbiddenPatterns,
}));

export function expectedTextsForRoute(route: string): readonly string[] {
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

export function projectActionLinkExpectedTexts(project: ProjectStory): readonly string[] {
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

export function maybeProjectForDetailRoute(route: string): ProjectDetailPageProject | null {
  const detailRoutePrefix = "/projects/";

  if (!route.startsWith(detailRoutePrefix)) {
    return null;
  }

  return maybeProjectDetailPageProjectBySlug(route.slice(detailRoutePrefix.length));
}

export function maybeWritingForDetailRoute(route: string): PublicWritingEntry | null {
  const detailRoutePrefix = "/writing/";

  if (!route.startsWith(detailRoutePrefix)) {
    return null;
  }

  return maybePublicWritingEntryBySlug(route.slice(detailRoutePrefix.length));
}

export function topLevelRouteForPath(path: string): SiteRoute {
  const routeDefinition = routeByPath(path);

  if (routeDefinition.path !== path) {
    throw new Error(`No top-level route definition found for ${path}.`);
  }

  return routeDefinition;
}

export function writingIndexEntryExpectedTexts(entry: PublicWritingEntry): readonly string[] {
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

export function writingDetailExpectedTexts(entry: PublicWritingEntry): readonly string[] {
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

export function relatedWritingExpectedTextsForProject(
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

export function projectIndexItemPath(project: ProjectStory): string {
  return projectStoryHref(project);
}

function routeStaticCheckText(route: string): string {
  return topLevelRouteForPath(route).staticCheckText;
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

function writingBodyBlockExpectedTexts(block: WritingBodyBlock): readonly string[] {
  if (block.kind === "paragraph" || block.kind === "callout") {
    return [block.text];
  }

  if (block.kind === "list") {
    return [...block.items];
  }

  return [block.label, `href="${escapeHtmlAttribute(block.href)}"`];
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
