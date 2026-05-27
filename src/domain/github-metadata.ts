import snapshotData from "./github-metadata.snapshot.json";
import type { ProjectLink, ProjectStory } from "./projects";

export type GitHubRepositoryMetadata =
  | {
      status: "available";
      slug: string;
      owner: string;
      repo: string;
      repositoryUrl: string;
      homepageUrl: string | null;
      stars: number;
      forks: number;
      primaryLanguage: string | null;
      topics: readonly string[];
      pushedAt: string | null;
      isArchived: boolean;
      isFork: boolean;
      isTemplate: boolean;
      syncedAt: string;
    }
  | {
      status: "unavailable";
      slug: string;
      owner: string;
      repo: string;
      repositoryUrl: string;
      reason: "missing" | "private" | "moved" | "rate-limited" | "error";
      httpStatus?: number;
      message: string;
      syncedAt: string;
    };

export type GitHubMetadataSnapshot = {
  schemaVersion: number;
  syncedAt: string;
  repositories: readonly GitHubRepositoryMetadata[];
};

export type GitHubMetadataFact = {
  label: "Stars" | "Forks" | "Language" | "Updated" | "Archived" | "Fork" | "Template" | "Topic";
  value: string;
};

export type ParsedGitHubRepositoryUrl = {
  owner: string;
  repo: string;
  repositoryUrl: string;
};

export const gitHubMetadataSnapshot: GitHubMetadataSnapshot = snapshotData;

type AvailableGitHubRepositoryMetadata = Extract<GitHubRepositoryMetadata, { status: "available" }>;

export function parseGitHubRepositoryUrl(value: string): ParsedGitHubRepositoryUrl | null {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(value);
  } catch {
    return null;
  }

  if (parsedUrl.hostname.toLowerCase() !== "github.com") {
    return null;
  }

  if (parsedUrl.protocol !== "https:") {
    return null;
  }

  const pathSegments = parsedUrl.pathname.split("/").filter(Boolean);

  if (pathSegments.length !== 2) {
    return null;
  }

  const [owner, repo] = pathSegments;

  if (!owner || !repo) {
    return null;
  }

  return {
    owner,
    repo,
    repositoryUrl: `https://github.com/${owner}/${repo}`,
  };
}

export function maybeGitHubMetadataForProject(
  project: ProjectStory,
  snapshot: GitHubMetadataSnapshot = gitHubMetadataSnapshot,
): AvailableGitHubRepositoryMetadata | null {
  const maybeRepository = maybeDirectRepositoryForProject(project);

  if (!maybeRepository) {
    return null;
  }

  const maybeMetadata = snapshot.repositories.find(
    (metadata) => metadata.repositoryUrl === maybeRepository.repositoryUrl,
  );

  if (!maybeMetadata || maybeMetadata.status !== "available") {
    return null;
  }

  return maybeMetadata;
}

export function gitHubMetadataFactsForProject(
  project: ProjectStory,
  snapshot: GitHubMetadataSnapshot = gitHubMetadataSnapshot,
): readonly GitHubMetadataFact[] {
  const maybeMetadata = maybeGitHubMetadataForProject(project, snapshot);

  if (!maybeMetadata) {
    return [];
  }

  const facts: GitHubMetadataFact[] = [
    { label: "Stars", value: formatCount(maybeMetadata.stars) },
    { label: "Forks", value: formatCount(maybeMetadata.forks) },
  ];

  if (maybeMetadata.primaryLanguage) {
    facts.push({ label: "Language", value: maybeMetadata.primaryLanguage });
  }

  const maybeUpdatedFact = maybeUpdatedLabel(maybeMetadata.pushedAt);

  if (maybeUpdatedFact) {
    facts.push({ label: "Updated", value: maybeUpdatedFact });
  }

  if (maybeMetadata.isArchived) {
    facts.push({ label: "Archived", value: "Archived" });
  }

  if (maybeMetadata.isFork) {
    facts.push({ label: "Fork", value: "Fork" });
  }

  if (maybeMetadata.isTemplate) {
    facts.push({ label: "Template", value: "Template" });
  }

  for (const topic of metadataTopicsForProject(project, maybeMetadata)) {
    facts.push({ label: "Topic", value: topic });
  }

  return facts;
}

export function maybeGitHubHomepageLinkForProject(
  project: ProjectStory,
  snapshot: GitHubMetadataSnapshot = gitHubMetadataSnapshot,
): ProjectLink | null {
  const maybeMetadata = maybeGitHubMetadataForProject(project, snapshot);

  if (!maybeMetadata?.homepageUrl?.trim()) {
    return null;
  }

  const maybeHomepageComparableUrl = maybeComparableUrl(maybeMetadata.homepageUrl);

  if (!maybeHomepageComparableUrl) {
    return null;
  }

  const duplicatesCuratedLink = project.links.some((link) => {
    if (link.kind !== "live" && link.kind !== "docs" && link.kind !== "repo") {
      return false;
    }

    return maybeComparableUrl(link.href) === maybeHomepageComparableUrl;
  });

  if (duplicatesCuratedLink) {
    return null;
  }

  return {
    label: maybeMetadata.homepageUrl.includes("docs") ? "Live docs" : "Live site",
    href: maybeMetadata.homepageUrl.trim(),
    kind: "live",
  };
}

function maybeDirectRepositoryForProject(project: ProjectStory): ParsedGitHubRepositoryUrl | null {
  for (const link of project.links) {
    if (link.kind !== "repo") {
      continue;
    }

    const maybeRepository = parseGitHubRepositoryUrl(link.href);

    if (maybeRepository) {
      return maybeRepository;
    }
  }

  return null;
}

function formatCount(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function maybeUpdatedLabel(maybePushedAt: string | null): string | null {
  if (!maybePushedAt) {
    return null;
  }

  const date = new Date(maybePushedAt);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const maybeMonth = monthNames[date.getUTCMonth()];

  if (!maybeMonth) {
    return null;
  }

  return `Updated ${maybeMonth} ${date.getUTCFullYear()}`;
}

function metadataTopicsForProject(
  project: ProjectStory,
  metadata: AvailableGitHubRepositoryMetadata,
): readonly string[] {
  const curatedLabels = new Set([...project.themes, ...project.tags].map(normalizedLabel));
  const seenTopics = new Set<string>();
  const topics: string[] = [];

  for (const topic of metadata.topics) {
    const normalizedTopic = normalizedLabel(topic);

    if (!normalizedTopic || curatedLabels.has(normalizedTopic) || seenTopics.has(normalizedTopic)) {
      continue;
    }

    seenTopics.add(normalizedTopic);
    topics.push(topic.trim());

    if (topics.length === 3) {
      break;
    }
  }

  return topics;
}

function normalizedLabel(value: string): string {
  return value.trim().toLowerCase();
}

function maybeComparableUrl(value: string): string | null {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(value);
  } catch {
    return null;
  }

  const path = parsedUrl.pathname.replace(/\/+$/, "");
  const port = parsedUrl.port ? `:${parsedUrl.port}` : "";

  return `${parsedUrl.protocol}//${parsedUrl.hostname.toLowerCase()}${port}${path}`;
}

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;
