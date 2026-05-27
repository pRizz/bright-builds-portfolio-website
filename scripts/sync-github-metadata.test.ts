import { describe, expect, it } from "vitest";
import type { GitHubRepositoryMetadata } from "../src/domain/github-metadata";
import type { ProjectStory } from "../src/domain/projects";
import {
  directRepositoryTargetsForProjects,
  maybeNextUrlFromLinkHeader,
  repositoryMetadataFromGitHubJson,
  unavailableRepositoryMetadataFromResponse,
} from "./sync-github-metadata";

describe("GitHub metadata sync pagination parser", () => {
  it('extracts the rel="next" URL from a GitHub Link header', () => {
    // Arrange
    const linkHeader =
      '<https://api.github.com/repos/pRizz/open-links/topics?page=2>; rel="next", ' +
      '<https://api.github.com/repos/pRizz/open-links/topics?page=4>; rel="last"';

    // Act
    const maybeNextUrl = maybeNextUrlFromLinkHeader(linkHeader);

    // Assert
    expect(maybeNextUrl).toBe("https://api.github.com/repos/pRizz/open-links/topics?page=2");
  });

  it("stops when no next link exists", () => {
    // Arrange
    const linkHeader =
      '<https://api.github.com/repos/pRizz/open-links/topics?page=1>; rel="prev", ' +
      '<https://api.github.com/repos/pRizz/open-links/topics?page=4>; rel="last"';

    // Act
    const maybeNextUrl = maybeNextUrlFromLinkHeader(linkHeader);

    // Assert
    expect(maybeNextUrl).toBeNull();
  });
});

describe("GitHub metadata sync repository mapping", () => {
  it("maps GitHub repository JSON to available snapshot fields", () => {
    // Arrange
    const target = {
      slug: "openlinks",
      owner: "pRizz",
      repo: "open-links",
      repositoryUrl: "https://github.com/pRizz/open-links",
    };
    const repositoryJson = {
      stargazers_count: 42,
      forks_count: 7,
      language: "TypeScript",
      topics: ["identity"],
      pushed_at: "2026-05-20T12:30:00Z",
      archived: false,
      fork: false,
      is_template: true,
      homepage: "https://openlinks.us/",
      html_url: "https://github.com/pRizz/open-links",
    };

    // Act
    const metadata = repositoryMetadataFromGitHubJson({
      target,
      repositoryJson,
      topics: ["identity", "solidjs"],
      syncedAt: "2026-05-27T12:00:00.000Z",
    });

    // Assert
    expect(metadata).toEqual({
      status: "available",
      slug: "openlinks",
      owner: "pRizz",
      repo: "open-links",
      repositoryUrl: "https://github.com/pRizz/open-links",
      homepageUrl: "https://openlinks.us/",
      stars: 42,
      forks: 7,
      primaryLanguage: "TypeScript",
      topics: ["identity", "solidjs"],
      pushedAt: "2026-05-20T12:30:00Z",
      isArchived: false,
      isFork: false,
      isTemplate: true,
      syncedAt: "2026-05-27T12:00:00.000Z",
    } satisfies GitHubRepositoryMetadata);
  });

  it.each([
    { status: 404, reason: "missing" },
    { status: 403, reason: "rate-limited" },
    { status: 301, reason: "moved" },
    { status: 302, reason: "moved" },
    { status: 500, reason: "error" },
  ] as const)('maps HTTP $status to status: "unavailable" with reason $reason', ({
    status,
    reason,
  }) => {
    // Arrange
    const response = new Response(`GitHub error ${status}`, { status });

    // Act
    const metadata = unavailableRepositoryMetadataFromResponse({
      target: {
        slug: "openlinks",
        owner: "pRizz",
        repo: "open-links",
        repositoryUrl: "https://github.com/pRizz/open-links",
      },
      response,
      syncedAt: "2026-05-27T12:00:00.000Z",
    });

    // Assert
    expect(metadata).toMatchObject({
      status: "unavailable",
      reason,
      httpStatus: status,
    });
  });
});

describe("GitHub metadata sync curated repository selection", () => {
  it('selects direct kind: "repo" project links and ignores kind: "related" links', () => {
    // Arrange
    const projects = [
      projectFixture({
        slug: "openlinks",
        links: [
          { label: "Source", href: "https://github.com/pRizz/open-links", kind: "repo" },
          {
            label: "Related source",
            href: "https://github.com/pRizz/related-open-links",
            kind: "related",
          },
        ],
      }),
      projectFixture({
        slug: "open-bitcoin",
        links: [
          {
            label: "Related source",
            href: "https://github.com/pRizz/open-bitcoin-web-miner",
            kind: "related",
          },
        ],
      }),
    ];

    // Act
    const targets = directRepositoryTargetsForProjects(projects);

    // Assert
    expect(targets).toEqual([
      {
        slug: "openlinks",
        owner: "pRizz",
        repo: "open-links",
        repositoryUrl: "https://github.com/pRizz/open-links",
      },
    ]);
  });
});

function projectFixture(overrides: Pick<ProjectStory, "slug" | "links">): ProjectStory {
  return {
    slug: overrides.slug,
    name: overrides.slug,
    aliases: [],
    placement: "supporting",
    tier: "supporting",
    sourceType: "original",
    maturity: "active",
    status: "building",
    includeOnHome: false,
    includeInProjectIndex: true,
    displayOrder: 1,
    themes: [],
    tags: [],
    role: "Creator",
    oneLine: "Test project",
    story: {
      problem: "Problem",
      approach: "Approach",
      whyItMatters: "Why it matters",
    },
    curationReason: "Test fixture",
    originalWork: { kind: "original" },
    links: overrides.links,
  };
}
