import { spawnSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import type {
  GitHubMetadataSnapshot,
  GitHubRepositoryMetadata,
} from "../src/domain/github-metadata";
import { parseGitHubRepositoryUrl } from "../src/domain/github-metadata";
import { curatedProjects, type ProjectStory } from "../src/domain/projects";

type GitHubRepositoryTarget = {
  slug: string;
  owner: string;
  repo: string;
  repositoryUrl: string;
};

type RepositoryMetadataFromJsonOptions = {
  target: GitHubRepositoryTarget;
  repositoryJson: Record<string, unknown>;
  topics: readonly string[];
  syncedAt: string;
};

type UnavailableMetadataOptions = {
  target: GitHubRepositoryTarget;
  response: Response;
  syncedAt: string;
  maybeMessage?: string;
};

type SyncOptions = {
  maybeToken?: string;
  syncedAt?: string;
};

type TopicFetchResult =
  | { status: "available"; topics: readonly string[] }
  | { status: "unavailable"; metadata: GitHubRepositoryMetadata };

const snapshotPath = "src/domain/github-metadata.snapshot.json";
const githubApiVersion = "2026-03-10";

export function directRepositoryTargetsForProjects(
  projects: readonly ProjectStory[],
): readonly GitHubRepositoryTarget[] {
  const seenRepositoryUrls = new Set<string>();
  const targets: GitHubRepositoryTarget[] = [];

  for (const project of projects) {
    const maybeRepoLink = project.links.find((link) => link.kind === "repo");

    if (!maybeRepoLink) {
      continue;
    }

    const maybeRepository = parseGitHubRepositoryUrl(maybeRepoLink.href);

    if (!maybeRepository || seenRepositoryUrls.has(maybeRepository.repositoryUrl)) {
      continue;
    }

    seenRepositoryUrls.add(maybeRepository.repositoryUrl);
    targets.push({
      slug: project.slug,
      ...maybeRepository,
    });
  }

  return targets;
}

export function maybeNextUrlFromLinkHeader(maybeLinkHeader: string | null): string | null {
  if (!maybeLinkHeader) {
    return null;
  }

  for (const linkPart of maybeLinkHeader.split(",")) {
    const match = linkPart.match(/<([^>]+)>;\s*rel="next"/);

    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
}

export function repositoryMetadataFromGitHubJson(
  options: RepositoryMetadataFromJsonOptions,
): GitHubRepositoryMetadata {
  return {
    status: "available",
    slug: options.target.slug,
    owner: options.target.owner,
    repo: options.target.repo,
    repositoryUrl: options.target.repositoryUrl,
    homepageUrl: maybeString(options.repositoryJson.homepage),
    stars: integerValue(options.repositoryJson.stargazers_count),
    forks: integerValue(options.repositoryJson.forks_count),
    primaryLanguage: maybeString(options.repositoryJson.language),
    topics: options.topics.map((topic) => topic.trim()).filter(Boolean),
    pushedAt: maybeString(options.repositoryJson.pushed_at),
    isArchived: booleanValue(options.repositoryJson.archived),
    isFork: booleanValue(options.repositoryJson.fork),
    isTemplate: booleanValue(options.repositoryJson.is_template),
    syncedAt: options.syncedAt,
  };
}

export function unavailableRepositoryMetadataFromResponse(
  options: UnavailableMetadataOptions,
): GitHubRepositoryMetadata {
  return {
    status: "unavailable",
    slug: options.target.slug,
    owner: options.target.owner,
    repo: options.target.repo,
    repositoryUrl: options.target.repositoryUrl,
    reason: unavailableReasonForStatus(options.response.status),
    httpStatus: options.response.status,
    message:
      options.maybeMessage ??
      `GitHub returned ${options.response.status} while syncing ${options.target.owner}/${options.target.repo}.`,
    syncedAt: options.syncedAt,
  };
}

export async function syncGitHubMetadata(
  projects: readonly ProjectStory[] = curatedProjects,
  options: SyncOptions = {},
): Promise<GitHubMetadataSnapshot> {
  const syncedAt = options.syncedAt ?? new Date().toISOString();
  const repositories: GitHubRepositoryMetadata[] = [];

  for (const target of directRepositoryTargetsForProjects(projects)) {
    repositories.push(await syncRepositoryMetadata(target, options.maybeToken, syncedAt));
  }

  return {
    schemaVersion: 1,
    syncedAt,
    repositories,
  };
}

async function syncRepositoryMetadata(
  target: GitHubRepositoryTarget,
  maybeToken: string | undefined,
  syncedAt: string,
): Promise<GitHubRepositoryMetadata> {
  const response = await fetchGitHubJson(repositoryApiUrl(target), maybeToken);

  if (!response.ok) {
    return unavailableRepositoryMetadataFromResponse({ target, response, syncedAt });
  }

  const repositoryJson = await readResponseJson(response);
  const topicResult = await fetchRepositoryTopics(target, maybeToken, syncedAt);

  if (topicResult.status === "unavailable") {
    return topicResult.metadata;
  }

  return repositoryMetadataFromGitHubJson({
    target,
    repositoryJson,
    topics: topicResult.topics,
    syncedAt,
  });
}

async function fetchRepositoryTopics(
  target: GitHubRepositoryTarget,
  maybeToken: string | undefined,
  syncedAt: string,
): Promise<TopicFetchResult> {
  let maybeNextUrl: string | null = `${repositoryApiUrl(target)}/topics?per_page=100`;
  const topics: string[] = [];

  while (maybeNextUrl) {
    const response = await fetchGitHubJson(maybeNextUrl, maybeToken);

    if (!response.ok) {
      return {
        status: "unavailable",
        metadata: unavailableRepositoryMetadataFromResponse({ target, response, syncedAt }),
      };
    }

    const json = await readResponseJson(response);
    topics.push(...topicNamesFromJson(json));
    maybeNextUrl = maybeNextUrlFromLinkHeader(response.headers.get("link"));
  }

  return { status: "available", topics };
}

async function fetchGitHubJson(url: string, maybeToken: string | undefined): Promise<Response> {
  const headers = new Headers({
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": githubApiVersion,
  });

  if (maybeToken) {
    headers.set("Authorization", `Bearer ${maybeToken}`);
  }

  return fetch(url, {
    headers,
    redirect: "manual",
  });
}

async function readResponseJson(response: Response): Promise<Record<string, unknown>> {
  const value = await response.json();

  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return {};
}

function repositoryApiUrl(target: GitHubRepositoryTarget): string {
  return `https://api.github.com/repos/${target.owner}/${target.repo}`;
}

function topicNamesFromJson(json: Record<string, unknown>): readonly string[] {
  const maybeNames = json.names;

  if (!Array.isArray(maybeNames)) {
    return [];
  }

  return maybeNames.filter((name): name is string => typeof name === "string");
}

function unavailableReasonForStatus(
  status: number,
): Extract<GitHubRepositoryMetadata, { status: "unavailable" }>["reason"] {
  if (status === 404) {
    return "missing";
  }

  if (status === 403 || status === 429) {
    return "rate-limited";
  }

  if (status >= 300 && status < 400) {
    return "moved";
  }

  return "error";
}

function maybeString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  return trimmed ? trimmed : null;
}

function integerValue(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.trunc(value));
}

function booleanValue(value: unknown): boolean {
  return value === true;
}

async function writeSnapshot(snapshot: GitHubMetadataSnapshot): Promise<boolean> {
  const nextContents = formattedSnapshotContents(`${JSON.stringify(snapshot, null, 2)}\n`);
  const maybeExistingContents = await maybeReadFile(snapshotPath);

  await mkdir(dirname(snapshotPath), { recursive: true });
  await writeFile(snapshotPath, nextContents, "utf8");

  return maybeExistingContents !== nextContents;
}

function formattedSnapshotContents(contents: string): string {
  const result = spawnSync("bun", ["run", "biome", "format", "--stdin-file-path", snapshotPath], {
    encoding: "utf8",
    input: contents,
  });

  if (result.status !== 0) {
    throw new Error(`Failed to format GitHub metadata snapshot:\n${result.stderr}`);
  }

  return result.stdout;
}

async function maybeReadFile(path: string): Promise<string | null> {
  try {
    return await readFile(path, "utf8");
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return null;
    }

    throw error;
  }
}

function printSummary(snapshot: GitHubMetadataSnapshot, changed: boolean): void {
  const available = snapshot.repositories.filter((metadata) => metadata.status === "available");
  const unavailable = snapshot.repositories.filter((metadata) => metadata.status === "unavailable");

  console.info(
    `GitHub metadata snapshot ${changed ? "changed" : "unchanged"}: ` +
      `${available.length} available, ${unavailable.length} unavailable, ` +
      `${snapshot.repositories.length} total.`,
  );

  for (const metadata of unavailable) {
    console.warn(
      `[github metadata unavailable] ${metadata.slug}: ${metadata.reason} (${metadata.httpStatus ?? "no status"})`,
    );
  }
}

if (import.meta.main) {
  const strict = process.argv.includes("--strict");
  const snapshot = await syncGitHubMetadata(curatedProjects, {
    maybeToken: process.env.GITHUB_METADATA_TOKEN,
  });
  const changed = await writeSnapshot(snapshot);

  printSummary(snapshot, changed);

  if (strict && snapshot.repositories.some((metadata) => metadata.status === "unavailable")) {
    process.exit(1);
  }
}
