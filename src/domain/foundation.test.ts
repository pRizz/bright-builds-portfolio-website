import { describe, expect, it } from "vitest";
import { peterProfile, profileLinksByKind, profileSameAsLinks } from "./profile";
import { featuredProjects, projectSeeds } from "./projects";
import { navigationRoutes, prerenderRoutes, routeByPath } from "./routes";
import { metadataForRoute, personJsonLd } from "./seo";

describe("foundation route registry", () => {
  it("defines the current prerender route set", () => {
    // Arrange
    const expectedRoutes = ["/", "/about", "/projects", "/contact"];

    // Act
    const routes = prerenderRoutes;

    // Assert
    expect(routes).toEqual(expectedRoutes);
    expect(navigationRoutes).toHaveLength(expectedRoutes.length);
  });
});

describe("profile identity", () => {
  it("includes GitHub and OpenLinks identity links", () => {
    // Arrange
    const expectedSameAs = ["https://github.com/pRizz", "https://openlinks.us/"];

    // Act
    const codeLinks = profileLinksByKind(peterProfile, "code");
    const sameAsLinks = profileSameAsLinks(peterProfile);

    // Assert
    expect(codeLinks[0]?.href).toBe("https://github.com/pRizz");
    expect(sameAsLinks).toEqual(expect.arrayContaining(expectedSameAs));
  });
});

describe("project seeds", () => {
  it("selects only explicitly featured curated projects", () => {
    // Arrange
    const allProjects = projectSeeds;

    // Act
    const projects = featuredProjects(allProjects);

    // Assert
    expect(projects.map((project) => project.slug)).toEqual(["mystic-ui", "openlinks"]);
    expect(projects.every((project) => project.featured && project.tier === "featured")).toBe(true);
  });
});

describe("SEO derivation", () => {
  it("creates canonical metadata for a route", () => {
    // Arrange
    const route = routeByPath("/projects");

    // Act
    const metadata = metadataForRoute(route, peterProfile);

    // Assert
    expect(metadata.title).toBe("Projects | Peter Ryszkiewicz");
    expect(metadata.canonical).toBe("https://www.brightbuilds.us/projects");
    expect(metadata.openGraph.url).toBe(metadata.canonical);
  });

  it("creates person JSON-LD from profile identity links", () => {
    // Arrange
    const profile = peterProfile;

    // Act
    const jsonLd = personJsonLd(profile);

    // Assert
    expect(jsonLd.name).toBe("Peter Ryszkiewicz");
    expect(jsonLd.sameAs).toEqual(
      expect.arrayContaining(["https://github.com/pRizz", "https://openlinks.us/"]),
    );
  });
});
