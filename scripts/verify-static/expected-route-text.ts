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
import type { PublicThemeEntry } from "../../src/domain/themes";
import {
  collaborationActionsForTheme,
  maybePublicThemeEntryBySlug,
  publicThemeEntries,
  publicThemeEntriesForProject,
  publicThemeEntriesForWritingEntry,
  relatedProjectDetailPageProjectsForTheme,
  relatedWritingEntriesForTheme,
  themeDetailPath,
} from "../../src/domain/themes";
import type { PublicContentReference, PublicTopic } from "../../src/domain/topics";
import { maybePublicTopicBySlug, publicTopics, topicDetailPath } from "../../src/domain/topics";
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
      ...relatedThemeExpectedTextsForProject(maybeProject),
    ];
  }

  const maybeWriting = maybeWritingForDetailRoute(route);

  if (maybeWriting) {
    return writingDetailExpectedTexts(maybeWriting);
  }

  const maybeTheme = maybeThemeForDetailRoute(route);

  if (maybeTheme) {
    return themeDetailExpectedTexts(maybeTheme);
  }

  const maybeTopic = maybeTopicForDetailRoute(route);

  if (maybeTopic) {
    return topicDetailExpectedTexts(maybeTopic);
  }

  if (route === "/") {
    return [
      routeStaticCheckText(route),
      "Browse projects",
      "RSS feed",
      'href="/feed.xml"',
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
      "RSS feed",
      'href="/feed.xml"',
      "Narrow writing",
      "Search public writing",
      `${publicWritingEntries().length} of ${publicWritingEntries().length} public writing entries shown`,
      "Kind",
      "Topics",
      "Tags",
      "Year",
      "Reset filters",
      ...publicWritingEntries().flatMap(writingIndexEntryExpectedTexts),
    ];
  }

  if (route === "/themes") {
    return [
      routeStaticCheckText(route),
      "Theme paths",
      "Themes",
      "Curated routes through Peter's work, connecting durable ideas to selected projects, public writing, and proof points.",
      ...publicThemeEntries().flatMap(themeIndexEntryExpectedTexts),
    ];
  }

  if (route === "/topics") {
    return [
      routeStaticCheckText(route),
      "Topic discovery",
      "Topics",
      "Browse the public labels that connect Peter's projects, writing, and theme paths.",
      ...publicTopics().flatMap(topicIndexEntryExpectedTexts),
    ];
  }

  if (route === "/projects") {
    return [
      routeStaticCheckText(route),
      "Narrow projects",
      "Search public projects",
      `${publicProjectIndexProjects().length} of ${publicProjectIndexProjects().length} public projects shown`,
      "Topics",
      "Tier",
      "Status",
      "Source",
      "Reset filters",
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

export function maybeThemeForDetailRoute(route: string): PublicThemeEntry | null {
  const detailRoutePrefix = "/themes/";

  if (!route.startsWith(detailRoutePrefix)) {
    return null;
  }

  return maybePublicThemeEntryBySlug(route.slice(detailRoutePrefix.length));
}

export function maybeTopicForDetailRoute(route: string): PublicTopic | null {
  const detailRoutePrefix = "/topics/";

  if (!route.startsWith(detailRoutePrefix)) {
    return null;
  }

  return maybePublicTopicBySlug(route.slice(detailRoutePrefix.length));
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
    ...relatedThemeExpectedTextsForWriting(entry),
  ];
}

export function themeIndexEntryExpectedTexts(theme: PublicThemeEntry): readonly string[] {
  const relatedProjects = relatedProjectDetailPageProjectsForTheme(theme);
  const relatedWriting = relatedWritingEntriesForTheme(theme);

  return [
    theme.title,
    theme.summary,
    theme.audience,
    `href="${escapeHtmlAttribute(themeDetailPath(theme))}"`,
    "Explore theme",
    themeRelatedProjectCountText(relatedProjects.length),
    ...themeWritingKindCountTexts(relatedWriting),
  ];
}

export function themeDetailExpectedTexts(theme: PublicThemeEntry): readonly string[] {
  return [
    "Back to themes",
    "Theme path",
    theme.title,
    theme.summary,
    theme.audience,
    "Why it matters",
    "Audience",
    "Proof points",
    ...theme.proofPoints,
    "Collaboration starting points",
    "Where to start",
    theme.collaborationAngle,
    ...collaborationActionsForTheme(theme).flatMap(collaborationActionExpectedTexts),
    "Related projects",
    ...relatedProjectDetailPageProjectsForTheme(theme).flatMap((project) => [
      project.name,
      project.oneLine,
      "Project details",
      `href="${escapeHtmlAttribute(projectDetailPath(project))}"`,
    ]),
    "Related writing",
    ...relatedWritingEntriesForTheme(theme).flatMap((entry) => [
      entry.title,
      entry.summary,
      writingActionLabel(entry),
      `href="${escapeHtmlAttribute(writingDetailPath(entry))}"`,
    ]),
  ];
}

export function topicIndexEntryExpectedTexts(topic: PublicTopic): readonly string[] {
  return [
    topic.label,
    topicSummary(topic),
    referenceCountLabel(topic.references.length, "reference"),
    ...topicKindCountLabels(topic),
    "Explore topic",
    `href="${escapeHtmlAttribute(topicDetailPath(topic))}"`,
  ];
}

export function topicDetailExpectedTexts(topic: PublicTopic): readonly string[] {
  const projects = referencesForKind(topic, "project");
  const writing = referencesForKind(topic, "writing");
  const themes = referencesForKind(topic, "theme");

  return [
    "Back to topics",
    "Topic",
    topic.label,
    topicSummary(topic),
    "Public discovery path",
    "Canonical label",
    "Scope",
    ...topicReferenceSectionExpectedTexts("Projects", projects),
    ...topicReferenceSectionExpectedTexts("Writing", writing),
    ...topicReferenceSectionExpectedTexts("Theme paths", themes),
  ];
}

export function relatedThemeExpectedTextsForProject(
  project: ProjectDetailPageProject,
): readonly string[] {
  return relatedThemeExpectedTexts(publicThemeEntriesForProject(project));
}

export function relatedThemeExpectedTextsForWriting(entry: PublicWritingEntry): readonly string[] {
  return relatedThemeExpectedTexts(publicThemeEntriesForWritingEntry(entry));
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

function themeRelatedProjectCountText(count: number): string {
  return count === 1 ? "1 related project" : `${count} related projects`;
}

function themeWritingKindCountTexts(
  entries: readonly Pick<PublicWritingEntry, "kind">[],
): readonly string[] {
  let noteCount = 0;
  let essayCount = 0;

  for (const entry of entries) {
    if (entry.kind === "note") {
      noteCount += 1;
      continue;
    }

    essayCount += 1;
  }

  return [
    ...(noteCount > 0 ? [themeWritingKindCountText(noteCount, "note")] : []),
    ...(essayCount > 0 ? [themeWritingKindCountText(essayCount, "essay")] : []),
  ];
}

function themeWritingKindCountText(count: number, kind: "note" | "essay"): string {
  return count === 1 ? `1 related ${kind}` : `${count} related ${kind}s`;
}

function collaborationActionExpectedTexts(
  action: ReturnType<typeof collaborationActionsForTheme>[number],
): readonly string[] {
  return [
    action.label,
    `href="${escapeHtmlAttribute(action.href)}"`,
    ...(action.external
      ? [
          'target="_blank"',
          `rel="${escapeHtmlAttribute(action.maybeRel ?? "noopener noreferrer")}"`,
        ]
      : []),
  ];
}

function relatedThemeExpectedTexts(themes: readonly PublicThemeEntry[]): readonly string[] {
  if (themes.length === 0) {
    return [];
  }

  return [
    "Related theme paths",
    ...themes.flatMap((theme) => [
      theme.title,
      theme.summary,
      "Explore theme",
      `href="${escapeHtmlAttribute(themeDetailPath(theme))}"`,
    ]),
  ];
}

function topicSummary(topic: PublicTopic): string {
  return `${topic.label} connects ${referenceCountLabel(
    topic.references.length,
    "public reference",
  )} across Peter's projects, writing, and theme paths.`;
}

function topicKindCountLabels(topic: PublicTopic): readonly string[] {
  const projectCount = topic.references.filter((reference) => reference.kind === "project").length;
  const writingCount = topic.references.filter((reference) => reference.kind === "writing").length;
  const themeCount = topic.references.filter((reference) => reference.kind === "theme").length;

  return [
    ...(projectCount > 0 ? [referenceCountLabel(projectCount, "project")] : []),
    ...(writingCount > 0 ? [referenceCountLabel(writingCount, "writing item")] : []),
    ...(themeCount > 0 ? [referenceCountLabel(themeCount, "theme path")] : []),
  ];
}

function topicReferenceExpectedTexts(reference: PublicContentReference): readonly string[] {
  return [
    reference.title,
    reference.summary,
    referenceKindLabel(reference),
    referenceActionLabel(reference),
    `href="${escapeHtmlAttribute(reference.canonicalPath)}"`,
    ...reference.canonicalTopics.map((topic) => topic.label),
  ];
}

function topicReferenceSectionExpectedTexts(
  heading: "Projects" | "Writing" | "Theme paths",
  references: readonly PublicContentReference[],
): readonly string[] {
  if (references.length === 0) {
    return [];
  }

  return [heading, ...references.flatMap(topicReferenceExpectedTexts)];
}

function referencesForKind<TKind extends PublicContentReference["kind"]>(
  topic: PublicTopic,
  kind: TKind,
): readonly Extract<PublicContentReference, { kind: TKind }>[] {
  return topic.references.filter(
    (reference): reference is Extract<PublicContentReference, { kind: TKind }> =>
      reference.kind === kind,
  );
}

function referenceKindLabel(reference: PublicContentReference): string {
  if (reference.kind === "project") {
    return "Project";
  }

  if (reference.kind === "writing") {
    return reference.writingKind === "note" ? "Note" : "Essay";
  }

  return "Theme path";
}

function referenceActionLabel(
  reference: PublicContentReference,
): "Open project" | "Read note" | "Read essay" | "Explore theme" {
  if (reference.kind === "project") {
    return "Open project";
  }

  if (reference.kind === "writing") {
    return reference.writingKind === "note" ? "Read note" : "Read essay";
  }

  return "Explore theme";
}

function referenceCountLabel(count: number, singular: string): string {
  return `${count} ${count === 1 ? singular : `${singular}s`}`;
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
