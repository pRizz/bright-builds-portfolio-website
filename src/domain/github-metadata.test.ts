import { describe, expect, it } from "vitest";
import { gitHubMetadataSnapshot, parseGitHubRepositoryUrl } from "./github-metadata";

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
    // Arrange
    const url = "https://github.com/pRizz/open-links";

    // Act
    const result = parseGitHubRepositoryUrl(url);

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
