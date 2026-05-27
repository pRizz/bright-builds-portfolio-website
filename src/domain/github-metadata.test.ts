import { describe, expect, it } from "vitest";
import {
  type GitHubMetadataSnapshot,
  type GitHubRepositoryMetadata,
  gitHubMetadataFactsForProject,
  gitHubMetadataSnapshot,
  maybeGitHubHomepageLinkForProject,
  maybeGitHubMetadataForProject,
  parseGitHubRepositoryUrl,
} from "./github-metadata";
import { curatedProjects, type ProjectLink, type ProjectStory } from "./projects";

describe("GitHub metadata snapshot contract", () => {
  it("imports a valid empty snapshot without runtime dependencies", () => {
    // Arrange
    const snapshot = gitHubMetadataSnapshot;

    // Act
    const keys = Object.keys(snapshot).sort();

    // Assert
    expect(keys).toEqual(["repositories", "schemaVersion", "syncedAt"]);
    expect(snapshot).toMatchObject({
      schemaVersion: 1,
      syncedAt: "1970-01-01T00:00:00.000Z",
      repositories: [],
    });
  });
});

describe("GitHub repository URL parser", () => {
  it("parses a canonical GitHub repository URL", () => {
    // Act
    const result = parseGitHubRepositoryUrl("https://github.com/pRizz/open-links");

    // Assert
    expect(result).toEqual({
      owner: "pRizz",
      repo: "open-links",
      repositoryUrl: "https://github.com/pRizz/open-links",
    });
  });

  it("rejects non-GitHub URLs, profile URLs, and malformed URLs", () => {
    // Arrange
    const urls = ["https://example.com/pRizz/open-links", "https://github.com/pRizz", "not a url"];

    // Act
    const results = urls.map((url) => parseGitHubRepositoryUrl(url));

    // Assert
    expect(results).toEqual([null, null, null]);
  });
});

describe("GitHub metadata enrichment", () => {
  it('uses only direct links where kind === "repo" for enrichment', () => {
    // Arrange
    const project = projectBySlug("openlinks");
    const metadata = availableMetadata({
      slug: project.slug,
      owner: "pRizz",
      repo: "open-links",
      repositoryUrl: "https://github.com/pRizz/open-links",
    });
    const snapshot = snapshotWith(metadata);

    // Act
    const result = maybeGitHubMetadataForProject(project, snapshot);

    // Assert
    expect(result).toBe(metadata);
  });

  it("omits unavailable metadata without throwing", () => {
    // Arrange
    const project = projectBySlug("openlinks");
    const unavailableMetadata: GitHubRepositoryMetadata = {
      status: "unavailable",
      slug: project.slug,
      owner: "pRizz",
      repo: "open-links",
      repositoryUrl: "https://github.com/pRizz/open-links",
      reason: "rate-limited",
      httpStatus: 403,
      message: "Rate limited during snapshot sync",
      syncedAt: "2026-05-27T00:00:00.000Z",
    };
    const snapshot = snapshotWith(unavailableMetadata);

    // Act
    const result = maybeGitHubMetadataForProject(project, snapshot);

    // Assert
    expect(result).toBeNull();
  });

  it("does not use related links for enrichment", () => {
    // Arrange
    const project = projectBySlug("open-bitcoin");
    const relatedOnlyLinks: readonly ProjectLink[] = [
      {
        label: "Related source",
        href: "https://github.com/pRizz/open-bitcoin-web-miner",
        kind: "related",
      },
    ];
    const metadata = availableMetadata({
      slug: project.slug,
      owner: "pRizz",
      repo: "open-bitcoin-web-miner",
      repositoryUrl: relatedOnlyLinks[0].href,
    });
    const snapshot = snapshotWith(metadata);

    // Act
    const result = maybeGitHubMetadataForProject(project, snapshot);

    // Assert
    expect(result).toBeNull();
  });

  it("formats compact facts and removes duplicate curated topics", () => {
    // Arrange
    const project = projectBySlug("openlinks");
    const snapshot = snapshotWith(
      availableMetadata({
        slug: project.slug,
        repositoryUrl: "https://github.com/pRizz/open-links",
        stars: 1234,
        forks: 56,
        primaryLanguage: "TypeScript",
        pushedAt: "2026-05-18T12:30:00.000Z",
        isArchived: true,
        isFork: true,
        isTemplate: true,
        topics: ["identity", "solidjs", "open-web", "agentic-engineering", "portfolio", "tooling"],
      }),
    );

    // Act
    const facts = gitHubMetadataFactsForProject(project, snapshot);

    // Assert
    expect(facts).toEqual([
      { label: "Stars", value: "1,234" },
      { label: "Forks", value: "56" },
      { label: "Language", value: "TypeScript" },
      { label: "Updated", value: "Updated May 2026" },
      { label: "Archived", value: "Archived" },
      { label: "Fork", value: "Fork" },
      { label: "Template", value: "Template" },
      { label: "Topic", value: "solidjs" },
      { label: "Topic", value: "agentic-engineering" },
      { label: "Topic", value: "portfolio" },
    ]);
  });

  it("returns null for duplicate curated homepage links", () => {
    // Arrange
    const baseProject = projectBySlug("openlinks");
    const duplicateCases: readonly ProjectStory[] = [
      withLinks(baseProject, [
        { label: "Live site", href: "https://openlinks.us/", kind: "live" },
        { label: "Source", href: "https://github.com/pRizz/open-links", kind: "repo" },
      ]),
      withLinks(baseProject, [
        { label: "Docs", href: "https://openlinks.us/", kind: "docs" },
        { label: "Source", href: "https://github.com/pRizz/open-links", kind: "repo" },
      ]),
      withLinks(baseProject, [
        { label: "Source", href: "https://openlinks.us/", kind: "repo" },
        { label: "Canonical source", href: "https://github.com/pRizz/open-links", kind: "repo" },
      ]),
    ];
    const snapshot = snapshotWith(
      availableMetadata({
        slug: baseProject.slug,
        repositoryUrl: "https://github.com/pRizz/open-links",
        homepageUrl: "https://openlinks.us",
      }),
    );

    // Act
    const results = duplicateCases.map((project) =>
      maybeGitHubHomepageLinkForProject(project, snapshot),
    );

    // Assert
    expect(results).toEqual([null, null, null]);
  });
});

type AvailableGitHubRepositoryMetadata = Extract<GitHubRepositoryMetadata, { status: "available" }>;

function projectBySlug(slug: string): ProjectStory {
  const maybeProject = curatedProjects.find((project) => project.slug === slug);

  if (!maybeProject) {
    throw new Error(`Missing project fixture: ${slug}`);
  }

  return maybeProject;
}

function availableMetadata(
  overrides: Partial<AvailableGitHubRepositoryMetadata> = {},
): AvailableGitHubRepositoryMetadata {
  return {
    status: "available",
    slug: "openlinks",
    owner: "pRizz",
    repo: "open-links",
    repositoryUrl: "https://github.com/pRizz/open-links",
    homepageUrl: null,
    stars: 0,
    forks: 0,
    primaryLanguage: null,
    topics: [],
    pushedAt: null,
    isArchived: false,
    isFork: false,
    isTemplate: false,
    syncedAt: "2026-05-27T00:00:00.000Z",
    ...overrides,
  };
}

function snapshotWith(
  ...repositories: readonly GitHubRepositoryMetadata[]
): GitHubMetadataSnapshot {
  return {
    schemaVersion: 1,
    syncedAt: "2026-05-27T00:00:00.000Z",
    repositories,
  };
}

function withLinks(
  project: ProjectStory,
  links: readonly [ProjectLink, ...ProjectLink[]],
): ProjectStory {
  return {
    ...project,
    links,
  };
}
