import { describe, expect, it } from "vitest";
import { peterProfile } from "./profile";
import {
  curatedProjects,
  maybeProjectDetailPageProjectBySlug,
  type ProjectStory,
  projectDetailPageProjects,
  projectDetailPath,
  projectDetailRoutes,
  projectStoryHref,
} from "./projects";
import { prerenderRoutes } from "./routes";
import { jsonLdScriptContent, metadataForProject, projectJsonLd, sitemapXml } from "./seo";
import { maybeSocialPreviewTargetForRoutePath } from "./social-previews";

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

  it("derives visitor story links for selected and unselected projects", () => {
    // Arrange
    const selectedProject = projectDetailPageProjects()[0];
    const unselectedProject = curatedProjects.find((project) => project.slug === "open-bitcoin");

    // Act
    const selectedHref = projectStoryHref(selectedProject);
    const unselectedHref = unselectedProject ? projectStoryHref(unselectedProject) : null;

    // Assert
    expect(selectedHref).toBe(projectDetailPath(selectedProject));
    expect(unselectedHref).toBe("/projects#open-bitcoin");
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

  it("derives route-aware share metadata for every detail project", () => {
    // Arrange
    const projects = projectDetailPageProjects();

    // Act
    const metadataRecords = projects.map((project) => ({
      project,
      metadata: metadataForProject(project, peterProfile),
      target: socialPreviewTargetForRoutePath(projectDetailPath(project)),
    }));

    // Assert
    for (const { project, metadata, target } of metadataRecords) {
      expect(metadata.title).toBe(`${project.name} | Project Story | Bright Builds`);
      expect(metadata.description).toBe(project.oneLine);
      expect(metadata.canonical).toBe(
        `${peterProfile.canonicalOrigin}${projectDetailPath(project)}`,
      );
      expect(metadata.openGraph).toMatchObject({
        title: metadata.title,
        description: metadata.description,
        url: metadata.canonical,
        type: "website",
      });
      expect(metadata.openGraph.image).toEqual({
        url: `${peterProfile.canonicalOrigin}${target.assetPath}`,
        width: target.dimensions.width,
        height: target.dimensions.height,
        alt: target.alt,
        mimeType: "image/png",
      });
      expect(metadata.twitter).toMatchObject({
        card: "summary_large_image",
        title: metadata.title,
        description: metadata.description,
        image: metadata.openGraph.image,
      });
    }
  });

  it("keeps project JSON-LD image values in parity with share metadata", () => {
    // Arrange
    const projects = projectDetailPageProjects();

    // Act
    const records = projects.map((project) => ({
      jsonLd: projectJsonLd(project, peterProfile),
      metadata: metadataForProject(project, peterProfile),
    }));

    // Assert
    for (const { jsonLd, metadata } of records) {
      expect(jsonLd.image).toBe(metadata.openGraph.image.url);
      expect(metadata.twitter.image).toEqual(metadata.openGraph.image);
    }
  });

  it("includes selected project detail routes and excludes unselected public projects in the default sitemap", () => {
    // Arrange
    const selectedRoutes = projectDetailRoutes();

    // Act
    const sitemap = sitemapXml(undefined, peterProfile);

    // Assert
    for (const route of selectedRoutes) {
      expect(sitemap).toContain(`<loc>${peterProfile.canonicalOrigin}${route}</loc>`);
    }
    expect(sitemap).not.toContain(
      `<loc>${peterProfile.canonicalOrigin}/projects/open-bitcoin</loc>`,
    );
  });

  it("serializes project JSON-LD safely for values containing angle brackets", () => {
    // Arrange
    const project = {
      ...projectDetailPageProjects()[0],
      name: "OpenLinks <profile>",
    };

    // Act
    const content = jsonLdScriptContent(projectJsonLd(project, peterProfile));

    // Assert
    expect(content).not.toContain("<");
    expect(content).toContain("\\u003c");
  });
});

function makeProject(baseProject: ProjectStory, overrides: Partial<ProjectStory>): ProjectStory {
  return {
    ...baseProject,
    ...overrides,
  };
}

function socialPreviewTargetForRoutePath(routePath: string) {
  const maybeTarget = maybeSocialPreviewTargetForRoutePath(routePath);

  expect(maybeTarget).not.toBeNull();

  if (!maybeTarget) {
    throw new Error(`Expected social preview target for ${routePath}`);
  }

  return maybeTarget;
}
