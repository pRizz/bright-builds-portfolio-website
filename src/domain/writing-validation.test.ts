import { describe, expect, it } from "vitest";
import { curatedProjects, type ProjectStory } from "./projects";
import { curatedWriting, type WritingBodyBlock, type WritingEntry } from "./writing";
import {
  assertValidCuratedWriting,
  validateWritingEntry,
  validateWritingRegistry,
} from "./writing-validation";

describe("writing curation validation", () => {
  it("rejects duplicate writing slugs on the second entry", () => {
    // Arrange
    const entries = [
      makeWritingEntry({ slug: "duplicate-writing", displayOrder: 1 }),
      makeWritingEntry({ slug: "duplicate-writing", displayOrder: 2 }),
    ];

    // Act
    const result = validateWritingRegistry(entries);

    // Assert
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        severity: "error",
        code: "duplicate_slug",
        slug: "duplicate-writing",
      }),
    );
  });

  it("rejects malformed writing slugs", () => {
    // Arrange
    const entry = makeWritingEntry({ slug: "Bad Slug" });

    // Act
    const issues = validateWritingEntry(entry);

    // Assert
    expect(issues).toContainEqual(
      expect.objectContaining({
        severity: "error",
        code: "invalid_slug",
        slug: "Bad Slug",
      }),
    );
  });

  it("rejects missing required writing fields and body content", () => {
    // Arrange
    const entry = makeWritingEntry({
      title: " ",
      summary: " ",
      topics: [] as unknown as WritingEntry["topics"],
      tags: [],
      sections: [] as unknown as WritingEntry["sections"],
    });

    // Act
    const issues = validateWritingEntry(entry);
    const codes = issues.map((issue) => issue.code);

    // Assert
    expect(codes).toEqual(
      expect.arrayContaining([
        "missing_title",
        "missing_summary",
        "missing_tags_or_topics",
        "missing_body",
      ]),
    );
  });

  it("rejects empty list body blocks", () => {
    // Arrange
    const entry = makeWritingEntry({
      sections: [
        {
          heading: "List section",
          blocks: [{ kind: "list", items: [] } as unknown as WritingBodyBlock],
        },
      ],
    });

    // Act
    const codes = validateWritingEntry(entry).map((issue) => issue.code);

    // Assert
    expect(codes).toEqual(expect.arrayContaining(["empty_body_block", "missing_body"]));
  });

  it("rejects related project slugs that are not selected project detail pages", () => {
    // Arrange
    const hiddenProject = makeHiddenProject("hidden-project");
    const entry = makeWritingEntry({
      relatedProjectSlugs: ["missing-project", "open-bitcoin", "hidden-project"],
    });

    // Act
    const issues = validateWritingEntry(entry, [...curatedProjects, hiddenProject]);
    const relatedProjectSlugs = issues
      .filter((issue) => issue.code === "unsupported_related_project")
      .map((issue) => issue.maybeRelatedProjectSlug);

    // Assert
    expect(relatedProjectSlugs).toEqual(["missing-project", "open-bitcoin", "hidden-project"]);
  });

  it("accepts the checked-in curated writing registry without hard errors", () => {
    // Arrange
    const entries = curatedWriting;

    // Act
    const result = validateWritingRegistry(entries);

    // Assert
    expect(result.errors).toHaveLength(0);
  });

  it("throws formatted error lines for invalid writing relationships", () => {
    // Arrange
    const entries = [makeWritingEntry({ relatedProjectSlugs: ["missing-project"] })];

    // Act
    const act = () => assertValidCuratedWriting(entries);

    // Assert
    expect(act).toThrow(/unsupported_related_project: test-writing:/);
  });
});

function makeWritingEntry(overrides: Partial<WritingEntry> = {}): WritingEntry {
  return {
    slug: "test-writing",
    title: "Test writing",
    summary: "A test writing entry.",
    status: "published",
    kind: "note",
    maybePublishedOn: "2026-06-03",
    displayOrder: 999,
    topics: ["Testing"],
    tags: ["test"],
    relatedProjectSlugs: [],
    sections: [
      {
        heading: "Test section",
        blocks: [{ kind: "paragraph", text: "Test body." }],
      },
    ],
    ...overrides,
  };
}

function makeHiddenProject(slug: string): ProjectStory {
  return {
    ...curatedProjects[0],
    slug,
    placement: "hidden",
    tier: "excluded",
    status: "hidden",
    includeOnHome: false,
    includeInProjectIndex: false,
    displayOrder: 999,
  };
}
