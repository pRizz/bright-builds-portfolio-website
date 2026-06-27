import {
  type ProjectSourceType,
  type ProjectStatus,
  type ProjectStory,
  projectStoryHref,
  publicProjectIndexProjects,
} from "./projects";
import { publicThemeEntries, type ThemeRecord, type ThemeStatus, themeDetailPath } from "./themes";
import {
  publicWritingEntries,
  type WritingEntry,
  type WritingKind,
  writingDetailPath,
} from "./writing";

export type TopicRecord = {
  slug: string;
  label: string;
  aliases: readonly string[];
  displayOrder: number;
};

export type TopicReferenceSources = {
  projects?: readonly ProjectStory[];
  writingEntries?: readonly WritingEntry[];
  themes?: readonly ThemeRecord[];
  topics?: readonly TopicRecord[];
};

export type TopicSourceKind =
  | "project-theme"
  | "project-tag"
  | "writing-topic"
  | "writing-tag"
  | "theme-title";

export type TopicSourceLabel = {
  kind: TopicSourceKind;
  label: string;
  sourceKind: PublicContentReference["kind"];
  sourceSlug: string;
  sourceTitle: string;
};

type PublicContentReferenceBase = {
  slug: string;
  title: string;
  summary: string;
  canonicalPath: string;
  canonicalTopics: readonly TopicRecord[];
  sourceLabels: readonly TopicSourceLabel[];
  displayOrder: number;
};

export type PublicContentReference =
  | (PublicContentReferenceBase & {
      kind: "project";
      projectStatus: ProjectStatus;
      projectSourceType: ProjectSourceType;
    })
  | (PublicContentReferenceBase & {
      kind: "writing";
      writingKind: WritingKind;
      maybePublishedOn?: string;
    })
  | (PublicContentReferenceBase & {
      kind: "theme";
      themeStatus: ThemeStatus;
    });

export type PublicTopic = TopicRecord & {
  canonicalPath: string;
  references: readonly PublicContentReference[];
};

export const curatedTopics = [
  { slug: "ai", label: "AI", aliases: ["ai"], displayOrder: 10 },
  {
    slug: "agentic-engineering",
    label: "Agentic engineering",
    aliases: ["agents", "coordination"],
    displayOrder: 20,
  },
  { slug: "bitcoin", label: "Bitcoin", aliases: ["bitcoin", "proof-of-work"], displayOrder: 30 },
  {
    slug: "cryptography",
    label: "Cryptography",
    aliases: ["cryptography", "addresses"],
    displayOrder: 40,
  },
  {
    slug: "design-systems",
    label: "Design systems",
    aliases: ["design-systems", "tailwind", "ui"],
    displayOrder: 50,
  },
  {
    slug: "developer-tooling",
    label: "Developer tooling",
    aliases: ["developer-tools", "cloud", "supporting-infrastructure"],
    displayOrder: 60,
  },
  { slug: "finance", label: "Finance", aliases: ["finance", "proposal"], displayOrder: 70 },
  {
    slug: "identity",
    label: "Identity",
    aliases: ["identity", "profiles", "Open identity"],
    displayOrder: 80,
  },
  { slug: "math", label: "Math", aliases: ["math", "representation"], displayOrder: 90 },
  {
    slug: "open-systems",
    label: "Open systems",
    aliases: ["open-systems", "open-source", "concept"],
    displayOrder: 100,
  },
  { slug: "open-web", label: "Open web", aliases: ["open-web", "websites"], displayOrder: 110 },
  { slug: "solidjs", label: "SolidJS", aliases: ["solidjs"], displayOrder: 120 },
  {
    slug: "web-experiments",
    label: "Web experiments",
    aliases: ["web-experiments", "experiment", "webgpu"],
    displayOrder: 130,
  },
] as const satisfies readonly TopicRecord[];

export function normalizeTopicLabelKey(label: string): string {
  return label
    .trim()
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function topicSourceLabels(
  sources: TopicReferenceSources = {},
): readonly TopicSourceLabel[] {
  const projects = publicProjectIndexProjects(sources.projects);
  const writingEntries = publicWritingEntries(sources.writingEntries);
  const themes = publicThemeEntries(sources.themes);

  return [
    ...projects.flatMap(sourceLabelsForProject),
    ...writingEntries.flatMap(sourceLabelsForWriting),
    ...themes.map(sourceLabelForTheme),
  ];
}

export function maybeTopicRecordBySlug(
  slug: string,
  topics: readonly TopicRecord[] = curatedTopics,
): TopicRecord | null {
  return topics.find((topic) => topic.slug === slug) ?? null;
}

export function maybeTopicRecordForLabel(
  label: string,
  topics: readonly TopicRecord[] = curatedTopics,
): TopicRecord | null {
  const labelKey = normalizeTopicLabelKey(label);

  if (!labelKey) {
    return null;
  }

  return topics.find((topic) => topicLabelKeys(topic).includes(labelKey)) ?? null;
}

export function canonicalTopicsForLabels(
  labels: readonly string[],
  topics: readonly TopicRecord[] = curatedTopics,
): readonly TopicRecord[] {
  const canonicalSlugs = new Set(
    labels.flatMap((label) => {
      const maybeTopic = maybeTopicRecordForLabel(label, topics);
      return maybeTopic ? [maybeTopic.slug] : [];
    }),
  );

  return sortTopics(topics).filter((topic) => canonicalSlugs.has(topic.slug));
}

export function topicDetailPath(topic: Pick<TopicRecord, "slug">): string {
  return `/topics/${topic.slug}`;
}

export function publicContentReferences(
  sources: TopicReferenceSources = {},
): readonly PublicContentReference[] {
  const projects = publicProjectIndexProjects(sources.projects);
  const writingEntries = publicWritingEntries(sources.writingEntries);
  const themes = publicThemeEntries(sources.themes);
  const topics = topicsForSources(sources);

  return sortReferences([
    ...projects.map((project) => referenceForProject(project, sources.projects, topics)),
    ...writingEntries.map((entry) => referenceForWriting(entry, topics)),
    ...themes.map((theme) => referenceForTheme(theme, topics)),
  ]);
}

export function publicContentReferencesForTopic(
  topic: Pick<TopicRecord, "slug">,
  sources: TopicReferenceSources = {},
): readonly PublicContentReference[] {
  const maybeTopic = maybeTopicRecordBySlug(topic.slug, topicsForSources(sources));

  if (!maybeTopic) {
    return [];
  }

  return publicContentReferences(sources).filter((reference) =>
    reference.canonicalTopics.some((canonicalTopic) => canonicalTopic.slug === maybeTopic.slug),
  );
}

export function publicTopics(sources: TopicReferenceSources = {}): readonly PublicTopic[] {
  const references = publicContentReferences(sources);

  return sortTopics(topicsForSources(sources)).flatMap((topic) => {
    const topicReferences = references.filter((reference) =>
      reference.canonicalTopics.some((canonicalTopic) => canonicalTopic.slug === topic.slug),
    );

    if (topicReferences.length === 0) {
      return [];
    }

    return [
      {
        ...topic,
        canonicalPath: topicDetailPath(topic),
        references: topicReferences,
      },
    ];
  });
}

export function maybePublicTopicBySlug(
  slug: string,
  sources: TopicReferenceSources = {},
): PublicTopic | null {
  return publicTopics(sources).find((topic) => topic.slug === slug) ?? null;
}

function topicsForSources(sources: TopicReferenceSources): readonly TopicRecord[] {
  return sources.topics ?? curatedTopics;
}

function topicLabelKeys(topic: TopicRecord): readonly string[] {
  return [topic.slug, topic.label, ...topic.aliases].map(normalizeTopicLabelKey);
}

function sourceLabelsForProject(project: ProjectStory): readonly TopicSourceLabel[] {
  return [
    ...project.themes.map((label) =>
      sourceLabel("project-theme", label, "project", project.slug, project.name),
    ),
    ...project.tags.map((label) =>
      sourceLabel("project-tag", label, "project", project.slug, project.name),
    ),
  ];
}

function sourceLabelsForWriting(entry: WritingEntry): readonly TopicSourceLabel[] {
  return [
    ...entry.topics.map((label) =>
      sourceLabel("writing-topic", label, "writing", entry.slug, entry.title),
    ),
    ...entry.tags.map((label) =>
      sourceLabel("writing-tag", label, "writing", entry.slug, entry.title),
    ),
  ];
}

function sourceLabelForTheme(theme: ThemeRecord): TopicSourceLabel {
  return sourceLabel("theme-title", theme.title, "theme", theme.slug, theme.title);
}

function sourceLabel(
  kind: TopicSourceKind,
  label: string,
  sourceKind: PublicContentReference["kind"],
  sourceSlug: string,
  sourceTitle: string,
): TopicSourceLabel {
  return { kind, label, sourceKind, sourceSlug, sourceTitle };
}

function referenceForProject(
  project: ProjectStory,
  projects: readonly ProjectStory[] | undefined,
  topics: readonly TopicRecord[],
): PublicContentReference {
  const sourceLabels = sourceLabelsForProject(project);

  return {
    kind: "project",
    slug: project.slug,
    title: project.name,
    summary: project.oneLine,
    canonicalPath: projectStoryHref(project, projects),
    canonicalTopics: canonicalTopicsForLabels(
      sourceLabels.map((label) => label.label),
      topics,
    ),
    sourceLabels,
    displayOrder: project.displayOrder,
    projectStatus: project.status,
    projectSourceType: project.sourceType,
  };
}

function referenceForWriting(
  entry: WritingEntry,
  topics: readonly TopicRecord[],
): PublicContentReference {
  const sourceLabels = sourceLabelsForWriting(entry);

  return {
    kind: "writing",
    slug: entry.slug,
    title: entry.title,
    summary: entry.summary,
    canonicalPath: writingDetailPath(entry),
    canonicalTopics: canonicalTopicsForLabels(
      sourceLabels.map((label) => label.label),
      topics,
    ),
    sourceLabels,
    displayOrder: entry.displayOrder,
    writingKind: entry.kind,
    maybePublishedOn: entry.maybePublishedOn,
  };
}

function referenceForTheme(
  theme: ThemeRecord,
  topics: readonly TopicRecord[],
): PublicContentReference {
  const sourceLabels = [sourceLabelForTheme(theme)];

  return {
    kind: "theme",
    slug: theme.slug,
    title: theme.title,
    summary: theme.summary,
    canonicalPath: themeDetailPath(theme),
    canonicalTopics: canonicalTopicsForLabels(
      sourceLabels.map((label) => label.label),
      topics,
    ),
    sourceLabels,
    displayOrder: theme.displayOrder,
    themeStatus: theme.status,
  };
}

function sortTopics<TTopic extends TopicRecord>(topics: readonly TTopic[]): readonly TTopic[] {
  return [...topics].sort(
    (left, right) =>
      left.displayOrder - right.displayOrder || left.label.localeCompare(right.label),
  );
}

function sortReferences(
  references: readonly PublicContentReference[],
): readonly PublicContentReference[] {
  return [...references].sort(
    (left, right) =>
      left.displayOrder - right.displayOrder ||
      left.kind.localeCompare(right.kind) ||
      left.slug.localeCompare(right.slug),
  );
}
