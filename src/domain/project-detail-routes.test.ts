import { describe, expect, it } from "vitest";
import { peterProfile } from "./profile";
import {
  curatedProjects,
  maybeProjectDetailPageProjectBySlug,
  type ProjectStory,
  projectDetailPageProjects,
  projectDetailPath,
  projectDetailRoutes,
} from "./projects";
import { prerenderRoutes } from "./routes";
import { metadataForProject } from "./seo";

describe("project detail route derivation", () => {
  it("selects curated flagship projects with authored detail stories", () => {
    // Arrange
    const expectedSlugs = [
      "openlinks",
      "free-the-world",
      "win3bitcoin",
      "opencode-cloud",
      "zeckendorf",
      "mystic-ui",
    ];

    // Act
    const projects = projectDetailPageProjects();

    // Assert
    expect(projects.map((project) => project.slug)).toEqual(expectedSlugs);
    for (const project of projects) {
      expect(project.detail.intro.trim()).not.toHaveLength(0);
      expect(project.detail.technicalShape.trim()).not.toHaveLength(0);
      expect(project.detail.currentStatus.trim()).not.toHaveLength(0);
      expect(project.detail.collaborationAngle.trim()).not.toHaveLength(0);
      expect(project.detail.proofPoints.length).toBeGreaterThan(0);
    }
  });

  it("derives stable project detail paths and prerender routes", () => {
    // Arrange
    const projects = projectDetailPageProjects();

    // Act
    const paths = projects.map(projectDetailPath);

    // Assert
    expect(projectDetailRoutes()).toEqual(paths);
    expect(paths).toEqual(projects.map((project) => `/projects/${project.slug}`));
    expect(prerenderRoutes).toEqual(expect.arrayContaining(paths));
  });

  it("resolves selected projects by slug and rejects unselected public projects", () => {
    // Arrange
    const selectedSlug = "openlinks";
    const unselectedSlug = "open-bitcoin";

    // Act
    const selectedProject = maybeProjectDetailPageProjectBySlug(selectedSlug);
    const unselectedProject = maybeProjectDetailPageProjectBySlug(unselectedSlug);

    // Assert
    expect(selectedProject?.slug).toBe(selectedSlug);
    expect(unselectedProject).toBeNull();
  });

  it("keeps hidden, excluded, and unselected projects out of detail routes", () => {
    // Arrange
    const baseProject = curatedProjects[0];
    const visibleDetailProject = makeProject(baseProject, {
      slug: "visible-detail",
      displayOrder: 1,
      detail: baseProject.detail,
    });
    const hiddenDetailProject = makeProject(baseProject, {
      slug: "hidden-detail",
      placement: "hidden",
      tier: "excluded",
      status: "hidden",
      includeOnHome: false,
      includeInProjectIndex: false,
      displayOrder: 2,
      detail: baseProject.detail,
    });
    const noDetailProject = makeProject(baseProject, {
      slug: "no-detail",
      displayOrder: 3,
      detail: undefined,
    });

    // Act
    const routes = projectDetailRoutes([
      visibleDetailProject,
      hiddenDetailProject,
      noDetailProject,
    ]);

    // Assert
    expect(routes).toEqual(["/projects/visible-detail"]);
  });

  it("derives canonical project metadata from detail path", () => {
    // Arrange
    const project = projectDetailPageProjects()[0];

    // Act
    const metadata = metadataForProject(project, peterProfile);

    // Assert
    expect(metadata.canonical).toBe(`${peterProfile.canonicalOrigin}${projectDetailPath(project)}`);
    expect(metadata.openGraph.url).toBe(metadata.canonical);
    expect(metadata.description).toBe(project.oneLine);
  });
});

function makeProject(baseProject: ProjectStory, overrides: Partial<ProjectStory>): ProjectStory {
  return {
    ...baseProject,
    ...overrides,
  };
}
