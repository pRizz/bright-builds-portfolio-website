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
