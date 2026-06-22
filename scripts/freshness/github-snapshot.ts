import type {
  GitHubMetadataSnapshot,
  GitHubRepositoryMetadata,
} from "../../src/domain/github-metadata";
import type { FreshnessFinding } from "./report";

export const snapshotStaleAfterDays = 30;

const millisecondsPerDay = 24 * 60 * 60 * 1000;

type UnavailableGitHubRepositoryMetadata = Extract<
  GitHubRepositoryMetadata,
  { status: "unavailable" }
>;

type AvailableGitHubRepositoryMetadata = Extract<GitHubRepositoryMetadata, { status: "available" }>;

type UnavailableReason = UnavailableGitHubRepositoryMetadata["reason"];

type GitHubSnapshotFreshnessInput = {
  snapshot: GitHubMetadataSnapshot | null;
  now?: Date;
  sourcePath?: string;
  currentLiveStateLabel?: string;
};

export type GitHubSnapshotSummary = {
  sourcePath: string;
  syncedAt: string | null;
  ageDays: number | null;
  availableCount: number;
  unavailableCount: number;
};

export type GitHubSnapshotFreshness = {
  summary: GitHubSnapshotSummary;
  findings: readonly FreshnessFinding[];
};

export function maybeParseGitHubMetadataSnapshot(value: unknown): GitHubMetadataSnapshot | null {
  if (!isRecord(value) || value.schemaVersion !== 1 || typeof value.syncedAt !== "string") {
    return null;
  }

  if (!Array.isArray(value.repositories)) {
    return null;
  }

  const repositories: GitHubRepositoryMetadata[] = [];

  for (const repository of value.repositories) {
    const maybeRepository = maybeParseGitHubRepositoryMetadata(repository);

    if (!maybeRepository) {
      return null;
    }

    repositories.push(maybeRepository);
  }

  return {
    schemaVersion: value.schemaVersion,
    syncedAt: value.syncedAt,
    repositories,
  };
}

export function githubSnapshotFreshness(
  input: GitHubSnapshotFreshnessInput,
): GitHubSnapshotFreshness {
  const sourcePath = input.sourcePath ?? "src/domain/github-metadata.snapshot.json";
  const currentLiveStateLabel = input.currentLiveStateLabel ?? "current live GitHub state";

  if (!input.snapshot) {
    return {
      summary: {
        sourcePath,
        syncedAt: null,
        ageDays: null,
        availableCount: 0,
        unavailableCount: 0,
      },
      findings: [
        {
          severity: "release blocker",
          area: "GitHub snapshot",
          code: "github-snapshot-invalid",
          path: sourcePath,
          message: `GitHub snapshot is missing, unreadable, or malformed at ${sourcePath}.`,
        },
        currentLiveGitHubStateFinding(sourcePath, currentLiveStateLabel),
      ],
    };
  }

  const syncedAtDate = new Date(input.snapshot.syncedAt);

  if (Number.isNaN(syncedAtDate.getTime())) {
    return {
      summary: {
        sourcePath,
        syncedAt: input.snapshot.syncedAt,
        ageDays: null,
        availableCount: availableRepositories(input.snapshot).length,
        unavailableCount: unavailableRepositories(input.snapshot).length,
      },
      findings: [
        {
          severity: "release blocker",
          area: "GitHub snapshot",
          code: "github-snapshot-invalid",
          path: sourcePath,
          syncedAt: input.snapshot.syncedAt,
          message: `GitHub snapshot syncedAt is not a valid timestamp: ${input.snapshot.syncedAt}.`,
        },
        currentLiveGitHubStateFinding(sourcePath, currentLiveStateLabel),
      ],
    };
  }

  const now = input.now ?? new Date();
  const ageDays = Math.max(
    0,
    Math.floor((now.getTime() - syncedAtDate.getTime()) / millisecondsPerDay),
  );
  const unavailable = unavailableRepositories(input.snapshot);
  const findings: FreshnessFinding[] = [];

  if (ageDays > snapshotStaleAfterDays) {
    findings.push({
      severity: "needs review",
      area: "GitHub snapshot",
      code: "github-snapshot-age",
      path: sourcePath,
      syncedAt: input.snapshot.syncedAt,
      message: `GitHub snapshot is ${ageDays} days old; review snapshots older than ${snapshotStaleAfterDays} days.`,
    });
  }

  for (const repository of unavailable) {
    findings.push({
      severity: "needs review",
      area: "GitHub snapshot",
      code: "github-unavailable-record",
      path: sourcePath,
      slug: repository.slug,
      repositoryUrl: repository.repositoryUrl,
      reason: repository.reason,
      httpStatus: repository.httpStatus,
      syncedAt: repository.syncedAt,
      message: `${repository.slug} was unavailable during snapshot sync: ${repository.message}`,
    });
  }

  findings.push(currentLiveGitHubStateFinding(sourcePath, currentLiveStateLabel));

  return {
    summary: {
      sourcePath,
      syncedAt: input.snapshot.syncedAt,
      ageDays,
      availableCount: availableRepositories(input.snapshot).length,
      unavailableCount: unavailable.length,
    },
    findings,
  };
}

function maybeParseGitHubRepositoryMetadata(value: unknown): GitHubRepositoryMetadata | null {
  if (!isRecord(value) || typeof value.status !== "string") {
    return null;
  }

  if (value.status === "available") {
    return maybeParseAvailableRepository(value);
  }

  if (value.status === "unavailable") {
    return maybeParseUnavailableRepository(value);
  }

  return null;
}

function maybeParseAvailableRepository(
  value: Record<string, unknown>,
): AvailableGitHubRepositoryMetadata | null {
  if (
    !hasStringFields(value, ["slug", "owner", "repo", "repositoryUrl", "syncedAt"]) ||
    !hasNumberFields(value, ["stars", "forks"]) ||
    !hasBooleanFields(value, ["isArchived", "isFork", "isTemplate"]) ||
    !isStringOrNull(value.homepageUrl) ||
    !isStringOrNull(value.primaryLanguage) ||
    !isStringOrNull(value.pushedAt) ||
    !isStringArray(value.topics)
  ) {
    return null;
  }

  return {
    status: "available",
    slug: value.slug,
    owner: value.owner,
    repo: value.repo,
    repositoryUrl: value.repositoryUrl,
    homepageUrl: value.homepageUrl,
    stars: value.stars,
    forks: value.forks,
    primaryLanguage: value.primaryLanguage,
    topics: value.topics,
    pushedAt: value.pushedAt,
    isArchived: value.isArchived,
    isFork: value.isFork,
    isTemplate: value.isTemplate,
    syncedAt: value.syncedAt,
  };
}

function maybeParseUnavailableRepository(
  value: Record<string, unknown>,
): UnavailableGitHubRepositoryMetadata | null {
  const maybeReason = maybeUnavailableReason(value.reason);

  if (
    !maybeReason ||
    !hasStringFields(value, ["slug", "owner", "repo", "repositoryUrl", "message", "syncedAt"])
  ) {
    return null;
  }

  if (value.httpStatus !== undefined && typeof value.httpStatus !== "number") {
    return null;
  }

  return {
    status: "unavailable",
    slug: value.slug,
    owner: value.owner,
    repo: value.repo,
    repositoryUrl: value.repositoryUrl,
    reason: maybeReason,
    httpStatus: value.httpStatus,
    message: value.message,
    syncedAt: value.syncedAt,
  };
}

function currentLiveGitHubStateFinding(
  sourcePath: string,
  currentLiveStateLabel: string,
): FreshnessFinding {
  return {
    severity: "manual smoke",
    area: "GitHub snapshot",
    code: currentLiveStateLabel,
    path: sourcePath,
    message:
      "Review live repository status or run an explicit maintainer sync outside this offline report.",
  };
}

function availableRepositories(
  snapshot: GitHubMetadataSnapshot,
): readonly AvailableGitHubRepositoryMetadata[] {
  return snapshot.repositories.filter(
    (repository): repository is AvailableGitHubRepositoryMetadata =>
      repository.status === "available",
  );
}

function unavailableRepositories(
  snapshot: GitHubMetadataSnapshot,
): readonly UnavailableGitHubRepositoryMetadata[] {
  return snapshot.repositories.filter(
    (repository): repository is UnavailableGitHubRepositoryMetadata =>
      repository.status === "unavailable",
  );
}

function maybeUnavailableReason(value: unknown): UnavailableReason | null {
  if (
    value === "missing" ||
    value === "private" ||
    value === "moved" ||
    value === "rate-limited" ||
    value === "error"
  ) {
    return value;
  }

  return null;
}

function hasStringFields<T extends string>(
  value: Record<string, unknown>,
  keys: readonly T[],
): value is Record<T, string> & Record<string, unknown> {
  return keys.every((key) => typeof value[key] === "string");
}

function hasNumberFields<T extends string>(
  value: Record<string, unknown>,
  keys: readonly T[],
): value is Record<T, number> & Record<string, unknown> {
  return keys.every((key) => typeof value[key] === "number");
}

function hasBooleanFields<T extends string>(
  value: Record<string, unknown>,
  keys: readonly T[],
): value is Record<T, boolean> & Record<string, unknown> {
  return keys.every((key) => typeof value[key] === "boolean");
}

function isStringOrNull(value: unknown): value is string | null {
  return typeof value === "string" || value === null;
}

function isStringArray(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
