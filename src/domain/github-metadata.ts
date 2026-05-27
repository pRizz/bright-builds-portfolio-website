import type { ProjectStory } from "./projects";
import snapshotData from "./github-metadata.snapshot.json";

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
  _project: ProjectStory,
  _snapshot: GitHubMetadataSnapshot = gitHubMetadataSnapshot,
): GitHubRepositoryMetadata | null {
  return null;
}

export function gitHubMetadataFactsForProject(
  _project: ProjectStory,
  _snapshot: GitHubMetadataSnapshot = gitHubMetadataSnapshot,
): readonly GitHubMetadataFact[] {
  return [];
}

export function maybeGitHubHomepageLinkForProject(
  _project: ProjectStory,
  _snapshot: GitHubMetadataSnapshot = gitHubMetadataSnapshot,
): string | null {
  return null;
}
