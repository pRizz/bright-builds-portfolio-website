import { describe, expect, it } from "vitest";
import { curatedProjects, type ProjectStory } from "./projects";
import { curatedThemes, type ThemeRecord } from "./themes";
import { curatedWriting, type WritingEntry } from "./writing";
import {
  assertValidCuratedThemes,
  themeCurationErrors,
  themeCurationWarnings,
  validateThemeEntry,
  validateThemeRegistry,
} from "./theme-validation";

describe("theme curation validation", () => {
  it("rejects duplicate theme slugs on the second entry", () => {
    // Arrange
    const themes = [
      makeThemeRecord({ slug: "duplicate-theme", displayOrder: 1 }),
      makeThemeRecord({ slug: "duplicate-theme", displayOrder: 2 }),
    ];

    // Act
    const result = validateThemeRegistry(themes);

    // Assert
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        severity: "error",
        code: "duplicate_slug",
        slug: "duplicate-theme",
      }),
    );
  });

  it("rejects malformed theme slugs", () => {
    // Arrange
    const theme = makeThemeRecord({ slug: "Bad Slug" });

    // Act
    const issues = validateThemeEntry(theme);

    // Assert
    expect(issues).toContainEqual(
      expect.objectContaining({
        severity: "error",
        code: "invalid_slug",
        slug: "Bad Slug",
      }),
    );
  });

  it("rejects duplicate display orders on the second theme", () => {
    // Arrange
    const themes = [
      makeThemeRecord({ slug: "first-theme", displayOrder: 50 }),
      makeThemeRecord({ slug: "second-theme", displayOrder: 50 }),
    ];

    // Act
    const result = validateThemeRegistry(themes);

    // Assert
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        severity: "error",
        code: "duplicate_display_order",
        slug: "second-theme",
      }),
    );
  });

  it("rejects unsupported status values", () => {
    // Arrange
    const theme = makeThemeRecord({
      status: "deprecated" as unknown as ThemeRecord["status"],
    });

    // Act
    const issues = validateThemeEntry(theme);

    // Assert
    expect(issues).toContainEqual(
      expect.objectContaining({
        severity: "error",
        code: "unsupported_status",
        slug: "test-theme",
      }),
    );
  });

  it("rejects missing required theme text and relationship fields", () => {
    // Arrange
    const theme = makeThemeRecord({
      title: " ",
      summary: " ",
      audience: " ",
      proofPoints: [" "] as unknown as ThemeRecord["proofPoints"],
      collaborationAngle: " ",
      relatedProjectSlugs: [] as unknown as ThemeRecord["relatedProjectSlugs"],
      relatedWritingSlugs: [] as unknown as ThemeRecord["relatedWritingSlugs"],
    });

    // Act
    const issues = validateThemeEntry(theme);
    const codes = issues.map((issue) => issue.code);

    // Assert
    expect(codes).toEqual(
      expect.arrayContaining([
        "missing_title",
        "missing_summary",
        "missing_audience",
        "missing_proof_points",
        "missing_collaboration_angle",
        "missing_related_projects",
        "missing_related_writing",
      ]),
    );
  });

  it("rejects empty proof point arrays", () => {
    // Arrange
    const theme = makeThemeRecord({
      proofPoints: [] as unknown as ThemeRecord["proofPoints"],
    });

    // Act
    const issues = validateThemeEntry(theme);

    // Assert
    expect(issues).toContainEqual(
      expect.objectContaining({
        severity: "error",
        code: "missing_proof_points",
        slug: "test-theme",
      }),
    );
  });

  it("rejects related project slugs that are not selected project detail pages", () => {
    // Arrange
    const hiddenProject = makeHiddenProject("hidden-project");
    const theme = makeThemeRecord({
      relatedProjectSlugs: ["missing-project", "open-bitcoin", "hidden-project"],
    });

    // Act
    const issues = validateThemeEntry(theme, [...curatedProjects, hiddenProject]);
    const relatedProjectSlugs = issues
      .filter((issue) => issue.code === "unsupported_related_project")
      .map((issue) => issue.maybeRelatedProjectSlug);

    // Assert
    expect(relatedProjectSlugs).toEqual(["missing-project", "open-bitcoin", "hidden-project"]);
  });

  it("rejects related writing slugs that are not public writing entries", () => {
    // Arrange
    const writingEntries = [
      ...curatedWriting,
      makeWritingEntry({ slug: "draft-writing", status: "draft" }),
      makeWritingEntry({ slug: "hidden-writing", status: "hidden" }),
      makeWritingEntry({ slug: "archived-writing", status: "archived" }),
    ];
    const theme = makeThemeRecord({
      relatedWritingSlugs: [
        "missing-writing",
        "draft-writing",
        "hidden-writing",
        "archived-writing",
      ],
    });

    // Act
    const issues = validateThemeEntry(theme, curatedProjects, writingEntries);
    const relatedWritingSlugs = issues
      .filter((issue) => issue.code === "unpublished_related_writing")
      .map((issue) => issue.maybeRelatedWritingSlug);

    // Assert
    expect(relatedWritingSlugs).toEqual([
      "missing-writing",
      "draft-writing",
      "hidden-writing",
      "archived-writing",
    ]);
  });

  it("accepts the checked-in curated theme registry without hard errors", () => {
    // Arrange
    const themes = curatedThemes;

    // Act
    const result = validateThemeRegistry(themes);

    // Assert
    expect(result.errors).toHaveLength(0);
  });

  it("returns error and warning slices from registry validation", () => {
    // Arrange
    const themes = [makeThemeRecord({ slug: "Bad Slug" })];

    // Act
    const errors = themeCurationErrors(themes);
    const warnings = themeCurationWarnings(themes);

    // Assert
    expect(errors).toEqual([
      expect.objectContaining({
        severity: "error",
        code: "invalid_slug",
        slug: "Bad Slug",
      }),
    ]);
    expect(warnings).toEqual([]);
  });

  it("throws formatted error lines for invalid theme relationships", () => {
    // Arrange
    const themes = [makeThemeRecord({ relatedWritingSlugs: ["missing-writing"] })];

    // Act
    const act = () => assertValidCuratedThemes(themes);

    // Assert
    expect(act).toThrow(
      /unpublished_related_writing: test-theme: Related writing "missing-writing" must resolve to a public writing entry./,
    );
  });
});

function makeThemeRecord(overrides: Partial<ThemeRecord> = {}): ThemeRecord {
  return {
    slug: "test-theme",
    title: "Test theme",
    summary: "A test theme path.",
    status: "public",
    displayOrder: 999,
    audience: "Builders using a test theme.",
    proofPoints: ["Test proof point."],
    collaborationAngle: "A test collaboration angle.",
    relatedProjectSlugs: ["openlinks"],
    relatedWritingSlugs: ["portable-identity-and-owned-surfaces"],
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
