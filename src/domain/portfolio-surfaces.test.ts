import { describe, expect, it } from "vitest";
import {
  currentFocusProjects,
  homeProjects,
  projectAnchorHref,
  projectLinkDisplayLabel,
  visibleProjects,
} from "./projects";

describe("portfolio project surfaces", () => {
  it("returns exactly six flagship stories with complete story details", () => {
    // Arrange
    const expectedFlagshipCount = 6;

    // Act
    const projects = homeProjects();

    // Assert
    expect(projects).toHaveLength(expectedFlagshipCount);
    for (const project of projects) {
      expect(project.story.problem).not.toHaveLength(0);
      expect(project.story.approach).not.toHaveLength(0);
      expect(project.story.whyItMatters).not.toHaveLength(0);
    }
  });

  it("returns the reviewed current-focus projects in display order", () => {
    // Arrange
    const expectedFocusSlugOrder =
      "openlinks free-the-world win3bitcoin open-bitcoin opencode-cloud";
    const expectedSlugs = expectedFocusSlugOrder.split(" ");

    // Act
    const projects = currentFocusProjects();

    // Assert
    expect(projects.map((project) => project.slug)).toEqual(expectedSlugs);
  });

  it("builds stable project anchor hrefs for visible projects", () => {
    // Arrange
    const projects = visibleProjects();

    // Act
    const hrefs = projects.map((project) => projectAnchorHref(project));

    // Assert
    expect(hrefs).toEqual(projects.map((project) => `/projects#${project.slug}`));
  });

  it("derives visitor-facing project link labels", () => {
    // Arrange
    const links = [
      { label: "Source", href: "https://github.com/pRizz/open-links", kind: "repo" },
      { label: "Live site", href: "https://openlinks.us/", kind: "live" },
      { label: "Live docs", href: "https://prizz.github.io/mystic-ui/", kind: "live" },
      { label: "Docs", href: "https://example.com/docs", kind: "docs" },
      { label: "Article", href: "https://example.com/article", kind: "article" },
      {
        label: "Related source",
        href: "https://github.com/pRizz/open-bitcoin-web-miner",
        kind: "related",
      },
      { label: "Project notes", href: "https://example.com/notes", kind: "article" },
    ] as const;

    // Act
    const labels = links.map((link) => projectLinkDisplayLabel(link));

    // Assert
    expect(labels).toEqual([
      "Open source",
      "Live site",
      "Live docs",
      "Docs",
      "Article",
      "Related source",
      "Project notes",
    ]);
  });
});
