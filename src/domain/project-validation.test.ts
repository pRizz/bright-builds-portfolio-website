import { describe, expect, it } from "vitest";
import { validateProject, validateProjectRegistry } from "./project-validation";
import { curatedProjects, type ProjectStory } from "./projects";

describe("project curation validation", () => {
  it("rejects a home project with blank one-line copy", () => {
    // Arrange
    const project = makeHomeProject({ oneLine: " " });

    // Act
    const issues = validateProject(project);

    // Assert
    expect(issues).toContainEqual(
      expect.objectContaining({
        severity: "error",
        code: "flagship_missing_authored_copy",
        slug: "test-project",
      }),
    );
  });

  it("rejects a home project with blank curation reason", () => {
    // Arrange
    const project = makeHomeProject({ curationReason: " " });

    // Act
    const issues = validateProject(project);

    // Assert
    expect(issues).toContainEqual(
      expect.objectContaining({
        severity: "error",
        code: "flagship_missing_curation_reason",
        slug: "test-project",
      }),
    );
  });

  it("rejects a home project with no useful links", () => {
    // Arrange
    const project = makeHomeProject({ links: [] as unknown as ProjectStory["links"] });

    // Act
    const issues = validateProject(project);

    // Assert
    expect(issues).toContainEqual(
      expect.objectContaining({
        severity: "error",
        code: "flagship_missing_useful_link",
        slug: "test-project",
      }),
    );
  });

  it("rejects a home fork without promoted-fork original work", () => {
    // Arrange
    const project = makeHomeProject({
      sourceType: "fork",
      originalWork: { kind: "original" },
    });

    // Act
    const issues = validateProject(project);

    // Assert
    expect(issues).toContainEqual(
      expect.objectContaining({
        severity: "error",
        code: "flagship_blocked_source_type",
        slug: "test-project",
      }),
    );
  });

  it("rejects a home project with a blocked non-fork source type", () => {
    // Arrange
    const project = makeHomeProject({
      sourceType: "playground",
      originalWork: { kind: "original" },
    });

    // Act
    const issues = validateProject(project);

    // Assert
    expect(issues).toContainEqual(
      expect.objectContaining({
        severity: "error",
        code: "flagship_blocked_source_type",
        slug: "test-project",
      }),
    );
  });

  it("rejects a home project without reviewed original-work status", () => {
    // Arrange
    const project = makeHomeProject({
      originalWork: { kind: "unreviewed", reason: "Needs source review" },
    });

    // Act
    const issues = validateProject(project);

    // Assert
    expect(issues).toContainEqual(
      expect.objectContaining({
        severity: "error",
        code: "flagship_missing_original_work_status",
        slug: "test-project",
      }),
    );
  });

  it("rejects a home promoted fork with a blank promotion reason", () => {
    // Arrange
    const project = makeHomeProject({
      sourceType: "fork",
      originalWork: { kind: "promoted-fork", promotionReason: " " },
    });

    // Act
    const issues = validateProject(project);

    // Assert
    expect(issues).toContainEqual(
      expect.objectContaining({
        severity: "error",
        code: "flagship_requires_promotion_reason",
        slug: "test-project",
      }),
    );
  });

  it("rejects archived or hidden home projects", () => {
    // Arrange
    const project = makeHomeProject({ status: "hidden" });

    // Act
    const issues = validateProject(project);

    // Assert
    expect(issues).toContainEqual(
      expect.objectContaining({
        severity: "error",
        code: "flagship_archived_or_hidden",
        slug: "test-project",
      }),
    );
  });

  it("warns when non-home projects have blank curation reasons", () => {
    // Arrange
    const project = makeSupportingProject({ curationReason: " " });

    // Act
    const issues = validateProject(project);

    // Assert
    expect(issues).toContainEqual(
      expect.objectContaining({
        severity: "warning",
        code: "non_home_missing_curation_reason",
        slug: "test-project",
      }),
    );
  });

  it("warns when non-home projects have blank one-line copy", () => {
    // Arrange
    const project = makeSupportingProject({ oneLine: " " });

    // Act
    const issues = validateProject(project);

    // Assert
    expect(issues).toContainEqual(
      expect.objectContaining({
        severity: "warning",
        code: "non_home_missing_authored_copy",
        slug: "test-project",
      }),
    );
  });

  it("warns when hidden projects are included in the project index", () => {
    // Arrange
    const project = makeSupportingProject({
      placement: "hidden",
      tier: "excluded",
      includeInProjectIndex: true,
    });

    // Act
    const issues = validateProject(project);

    // Assert
    expect(issues).toContainEqual(
      expect.objectContaining({
        severity: "warning",
        code: "hidden_project_included_in_index",
        slug: "test-project",
      }),
    );
  });

  it("rejects duplicate display order values in the registry", () => {
    // Arrange
    const projects = [
      makeSupportingProject({ slug: "first-project", displayOrder: 200 }),
      makeSupportingProject({ slug: "second-project", displayOrder: 200 }),
    ];

    // Act
    const result = validateProjectRegistry(projects);

    // Assert
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        severity: "error",
        code: "duplicate_display_order",
        slug: "second-project",
      }),
    );
  });

  it("accepts the checked-in curated project registry without hard errors", () => {
    // Arrange
    const projects = curatedProjects;

    // Act
    const result = validateProjectRegistry(projects);

    // Assert
    expect(result.errors).toHaveLength(0);
  });
});

function makeHomeProject(overrides: Partial<ProjectStory> = {}): ProjectStory {
  const baseProject: ProjectStory = curatedProjects[0];

  return {
    ...baseProject,
    slug: "test-project",
    displayOrder: 999,
    ...overrides,
  };
}

function makeSupportingProject(overrides: Partial<ProjectStory> = {}): ProjectStory {
  return makeHomeProject({
    placement: "supporting",
    tier: "supporting",
    includeOnHome: false,
    sourceType: "original",
    originalWork: { kind: "original" },
    ...overrides,
  });
}
