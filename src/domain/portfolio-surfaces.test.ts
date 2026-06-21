import { describe, expect, it } from "vitest";
import { peterProfile } from "./profile";
import {
  currentFocusProjects,
  hiddenExcludedProjects,
  homeProjects,
  type ProjectStory,
  projectAnchorHref,
  projectDetailPageProjects,
  projectDetailPath,
  projectDetailRoutes,
  projectLinkDisplayLabel,
  projectStoryHref,
  projectsByPlacement,
  visibleProjects,
} from "./projects";
import { prerenderRoutes, routeByPath, sitemapRoutes, siteRoutes } from "./routes";
import {
  jsonLdScriptContent,
  metadataForProject,
  metadataForRoute,
  personJsonLd,
  projectItemListJsonLd,
  projectJsonLd,
  robotsTxt,
  sitemapXml,
} from "./seo";
import {
  SOCIAL_PREVIEW_FALLBACK_IMAGE,
  maybeSocialPreviewTargetForRoutePath,
} from "./social-previews";
import { themeDetailRoutes } from "./themes";
import { writingDetailRoutes } from "./writing";

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

  it("routes selected project story links to details while preserving unselected anchors", () => {
    // Arrange
    const projects = visibleProjects();
    const detailSlugs = new Set(projectDetailPageProjects(projects).map((project) => project.slug));

    // Act
    const hrefs = projects.map((project) => projectStoryHref(project, projects));

    // Assert
    expect(hrefs).toEqual(
      projects.map((project) =>
        detailSlugs.has(project.slug) ? projectDetailPath(project) : projectAnchorHref(project),
      ),
    );
  });

  it("keeps hidden or excluded records out of public project surfaces", () => {
    // Arrange
    const baseProject: ProjectStory = homeProjects()[0];
    const publicProject = makeProjectFixture(baseProject, {
      slug: "public-supporting",
      placement: "supporting",
      tier: "supporting",
      status: "maintained",
      includeOnHome: false,
      includeInProjectIndex: true,
      displayOrder: 10,
    });
    const draftProject = makeProjectFixture(baseProject, {
      slug: "private-draft",
      placement: "supporting",
      tier: "supporting",
      status: "maintained",
      includeOnHome: false,
      includeInProjectIndex: false,
      displayOrder: 20,
    });
    const excludedTierProject = makeProjectFixture(baseProject, {
      slug: "excluded-public-placement",
      placement: "supporting",
      tier: "excluded",
      status: "maintained",
      includeOnHome: false,
      includeInProjectIndex: true,
      displayOrder: 30,
    });
    const hiddenStatusProject = makeProjectFixture(baseProject, {
      slug: "hidden-public-placement",
      placement: "lab",
      tier: "lab",
      status: "hidden",
      includeOnHome: false,
      includeInProjectIndex: true,
      displayOrder: 40,
    });
    const projects = [publicProject, draftProject, excludedTierProject, hiddenStatusProject];

    // Act
    const visibleProjectList = visibleProjects(projects);
    const supportingProjects = projectsByPlacement("supporting", visibleProjectList);
    const hiddenExcludedProjectList = hiddenExcludedProjects(projects);

    // Assert
    expect(visibleProjectList.map((project) => project.slug)).toEqual(["public-supporting"]);
    expect(supportingProjects.map((project) => project.slug)).toEqual(["public-supporting"]);
    expect(hiddenExcludedProjectList.map((project) => project.slug)).toEqual([
      "private-draft",
      "excluded-public-placement",
      "hidden-public-placement",
    ]);
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

describe("portfolio SEO surfaces", () => {
  it("derives complete route metadata with canonical social preview fields", () => {
    // Arrange
    const routes = siteRoutes;

    // Act
    const metadataRecords = routes.map((route) => ({
      metadata: metadataForRoute(route, peterProfile),
      expectedImage:
        maybeSocialPreviewTargetForRoutePath(route.path) ?? SOCIAL_PREVIEW_FALLBACK_IMAGE,
    }));

    // Assert
    for (const { metadata, expectedImage } of metadataRecords) {
      expect(metadata.title).not.toHaveLength(0);
      expect(metadata.description).not.toHaveLength(0);
      expect(metadata.canonical.startsWith("https://www.brightbuilds.us")).toBe(true);
      expect(metadata.openGraph.title).toBe(metadata.title);
      expect(metadata.openGraph.description).toBe(metadata.description);
      expect(metadata.openGraph.url).toBe(metadata.canonical);
      expect(metadata.openGraph.type).toBe("website");
      expect(metadata.openGraph.image).toEqual({
        url: `${peterProfile.canonicalOrigin}${expectedImage.assetPath}`,
        width: expectedImage.dimensions.width,
        height: expectedImage.dimensions.height,
        alt: expectedImage.alt,
        mimeType: "image/png",
      });
      expect(metadata.twitter.card).toBe("summary_large_image");
      expect(metadata.twitter.title).toBe(metadata.title);
      expect(metadata.twitter.description).toBe(metadata.description);
      expect(metadata.twitter.image).toEqual(metadata.openGraph.image);
    }
  });

  it("uses generated social previews for covered route-family indexes", () => {
    // Arrange
    const coveredRoutePaths = ["/projects", "/writing", "/themes"];

    // Act
    const records = coveredRoutePaths.map((routePath) => ({
      metadata: metadataForRoute(routeByPath(routePath), peterProfile),
      target: socialPreviewTargetForRoutePath(routePath),
    }));

    // Assert
    for (const { metadata, target } of records) {
      expect(metadata.openGraph.image.url).toBe(
        `${peterProfile.canonicalOrigin}${target.assetPath}`,
      );
      expect(metadata.openGraph.image.mimeType).toBe("image/png");
      expect(metadata.twitter.image).toEqual(metadata.openGraph.image);
    }
  });

  it("includes GitHub and OpenLinks in Person sameAs JSON-LD", () => {
    // Arrange
    const expectedSameAs = ["https://github.com/pRizz", "https://openlinks.us/"];

    // Act
    const jsonLd = personJsonLd(peterProfile);

    // Assert
    expect(jsonLd.sameAs).toEqual(expect.arrayContaining(expectedSameAs));
  });

  it("creates ordered SoftwareSourceCode ItemList JSON-LD for visible project anchors", () => {
    // Arrange
    const projects = visibleProjects();
    const detailSlugs = new Set(projectDetailPageProjects(projects).map((project) => project.slug));

    // Act
    const jsonLd = projectItemListJsonLd(projects, peterProfile);

    // Assert
    expect(jsonLd["@type"]).toBe("ItemList");
    expect(jsonLd.itemListElement).toHaveLength(projects.length);
    for (const [index, element] of jsonLd.itemListElement.entries()) {
      const project = projects[index];

      expect(element["@type"]).toBe("ListItem");
      expect(element.position).toBe(index + 1);
      expect(element.item).toMatchObject({
        "@type": "SoftwareSourceCode",
        name: project.name,
        description: project.oneLine,
        url: `${peterProfile.canonicalOrigin}${
          detailSlugs.has(project.slug) ? projectDetailPath(project) : `/projects#${project.slug}`
        }`,
        sameAs: project.links.map((link) => link.href),
      });
    }
  });

  it("derives project detail metadata from curated project data", () => {
    // Arrange
    const project = projectDetailPageProjects()[0];

    // Act
    const metadata = metadataForProject(project, peterProfile);

    // Assert
    expect(metadata.title).toBe(`${project.name} | Project Story | Bright Builds`);
    expect(metadata.description).toBe(project.oneLine);
    expect(metadata.canonical).toBe(`${peterProfile.canonicalOrigin}${projectDetailPath(project)}`);
    expect(metadata.openGraph.url).toBe(metadata.canonical);
    expect(metadata.twitter.image).toEqual(metadata.openGraph.image);
  });

  it("creates SoftwareSourceCode JSON-LD for selected project stories with creator identity", () => {
    // Arrange
    const project = projectDetailPageProjects()[0];
    const expectedSameAs = ["https://github.com/pRizz", "https://openlinks.us/"];

    // Act
    const jsonLd = projectJsonLd(project, peterProfile);

    // Assert
    expect(jsonLd).toMatchObject({
      "@context": "https://schema.org",
      "@type": "SoftwareSourceCode",
      name: project.name,
      description: project.oneLine,
      url: `${peterProfile.canonicalOrigin}${projectDetailPath(project)}`,
      sameAs: project.links.map((link) => link.href),
      keywords: [...project.themes, ...project.tags].join(", "),
    });
    expect(jsonLd.creator.sameAs).toEqual(expect.arrayContaining(expectedSameAs));
    expect(jsonLd.about).toEqual(
      expect.arrayContaining([
        project.story.problem,
        project.story.approach,
        project.story.whyItMatters,
        project.detail.technicalShape,
        project.detail.currentStatus,
        project.detail.collaborationAngle,
        ...project.detail.proofPoints,
      ]),
    );
  });

  it("derives sitemap XML and robots text from route and profile data", () => {
    // Arrange
    const routes = siteRoutes;
    const allPrerenderRoutes = prerenderRoutes;
    const themeRoutes = themeDetailRoutes();

    // Act
    const sitemap = sitemapXml(undefined, peterProfile);
    const robots = robotsTxt(peterProfile);

    // Assert
    expect(prerenderRoutes).toEqual([
      ...routes.map((route) => route.path),
      ...projectDetailRoutes(),
      ...writingDetailRoutes(),
      ...themeRoutes,
    ]);
    expect(sitemapRoutes).toEqual([
      ...routes.map((route) => route.path),
      ...projectDetailRoutes(),
      ...writingDetailRoutes(),
      ...themeRoutes,
    ]);
    for (const path of sitemapRoutes) {
      const routePath = path === "/" ? "" : path;
      expect(sitemap).toContain(`<loc>${peterProfile.canonicalOrigin}${routePath}</loc>`);
    }
    expect(sitemap).toContain("<loc>https://www.brightbuilds.us/themes</loc>");
    for (const path of themeRoutes) {
      expect(allPrerenderRoutes).toContain(path);
      expect(sitemap).toContain(`<loc>${peterProfile.canonicalOrigin}${path}</loc>`);
    }
    expect(robots).toBe(
      "User-agent: *\nAllow: /\nSitemap: https://www.brightbuilds.us/sitemap.xml",
    );
  });

  it("serializes JSON-LD safely for script tags", () => {
    // Arrange
    const value = {
      "@context": "https://schema.org",
      name: "Peter <pRizz>",
    };

    // Act
    const content = jsonLdScriptContent(value);

    // Assert
    expect(content).not.toContain("<");
    expect(content).toContain("\\u003c");
  });
});

function makeProjectFixture(
  baseProject: ProjectStory,
  overrides: Partial<ProjectStory>,
): ProjectStory {
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
