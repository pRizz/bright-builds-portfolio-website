import { describe, expect, it } from "vitest";
import {
  projectHelperSurfaceFindingsForFiles,
  projectHelperSurfaceFindingsForSource,
} from "./verify-project-helper-surface";

describe("project helper surface import scanner", () => {
  it("allows documented project registry, selector, and type imports", () => {
    // Arrange
    const source = [
      'import { curatedProjects, homeProjects, publicProjectIndexProjects, type ProjectStory } from "../domain/projects";',
      "const projects: readonly ProjectStory[] = publicProjectIndexProjects(curatedProjects);",
      "homeProjects(projects);",
    ].join("\n");

    // Act
    const findings = projectHelperSurfaceFindingsForSource("src/routes/projects.tsx", source);

    // Assert
    expect(findings).toEqual([]);
  });

  it("reports forbidden named imports with file, line, import name, and message", () => {
    // Arrange
    const source = [
      "const beforeImport = true;",
      'import { projectSeeds, primaryProjectLink } from "../domain/projects";',
    ].join("\n");

    // Act
    const findings = projectHelperSurfaceFindingsForSource("src/routes/index.tsx", source);

    // Assert
    expect(findings).toHaveLength(2);
    expect(findings).toEqual([
      expect.objectContaining({
        file: "src/routes/index.tsx",
        line: 2,
        importName: "projectSeeds",
      }),
      expect.objectContaining({
        file: "src/routes/index.tsx",
        line: 2,
        importName: "primaryProjectLink",
      }),
    ]);
    expect(findings.map((finding) => finding.message).join("\n")).toContain(
      "legacy project helper",
    );
  });

  it("reports aliased forbidden named imports by original import name", () => {
    // Arrange
    const source =
      'import { projectSeeds as seeds, featuredProjects as homeStories } from "../domain/projects";';

    // Act
    const findings = projectHelperSurfaceFindingsForSource(
      "src/components/ProjectList.tsx",
      source,
    );

    // Assert
    expect(findings).toEqual([
      expect.objectContaining({
        file: "src/components/ProjectList.tsx",
        line: 1,
        importName: "projectSeeds",
      }),
      expect.objectContaining({
        file: "src/components/ProjectList.tsx",
        line: 1,
        importName: "featuredProjects",
      }),
    ]);
  });

  it("reports namespace imports from the projects domain module", () => {
    // Arrange
    const source = 'import * as projectHelpers from "../domain/projects";';

    // Act
    const findings = projectHelperSurfaceFindingsForSource("src/routes/projects.tsx", source);

    // Assert
    expect(findings).toEqual([
      expect.objectContaining({
        file: "src/routes/projects.tsx",
        line: 1,
        importName: "*",
      }),
    ]);
  });

  it("reports re-exports of forbidden project helper names", () => {
    // Arrange
    const source =
      'export { featuredProjects, primaryProjectLink as primaryLink } from "../domain/projects";';

    // Act
    const findings = projectHelperSurfaceFindingsForSource("src/domain/project-surface.ts", source);

    // Assert
    expect(findings).toEqual([
      expect.objectContaining({
        file: "src/domain/project-surface.ts",
        line: 1,
        importName: "featuredProjects",
      }),
      expect.objectContaining({
        file: "src/domain/project-surface.ts",
        line: 1,
        importName: "primaryProjectLink",
      }),
    ]);
  });

  it("excludes tests, declaration files, generated output, and the projects module itself", () => {
    // Arrange
    const source = 'import { projectSeeds } from "../domain/projects";';
    const files = [
      { filePath: "src/routes/projects.test.tsx", source },
      { filePath: "scripts/project-helper-surface.test.ts", source },
      { filePath: "src/generated/project-surface.ts", source },
      { filePath: "scripts/generated/project-surface.ts", source },
      { filePath: "src/domain/projects.ts", source },
      { filePath: "src/domain/projects.d.ts", source },
    ];

    // Act
    const findings = projectHelperSurfaceFindingsForFiles(files);

    // Assert
    expect(findings).toEqual([]);
  });
});
