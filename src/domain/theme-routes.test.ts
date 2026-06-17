import { describe, expect, it } from "vitest";
import { projectDetailRoutes } from "./projects";
import {
  navigationRoutes,
  prerenderRoutes,
  routeByPath,
  sitemapRoutes,
  siteRoutes,
} from "./routes";
import { themeDetailRoutes } from "./themes";
import { writingDetailRoutes } from "./writing";

describe("theme route registry", () => {
  it("registers Themes as a normal top-level navigation route", () => {
    // Arrange
    const expectedRoute = {
      id: "themes",
      path: "/themes",
      label: "Themes",
      title: "Themes | Peter Ryszkiewicz",
      description:
        "Curated routes through Peter Ryszkiewicz's work, connecting durable ideas to selected projects, public writing, and proof points.",
      heading: "Themes",
      staticCheckText:
        "Curated routes through Peter's work connect durable ideas to selected projects, public writing, and proof points.",
      nav: true,
    };
    const expectedLabels = ["Home", "About", "Projects", "Writing", "Themes", "Contact"];

    // Act
    const route = routeByPath("/themes");
    const labels = navigationRoutes.map((navigationRoute) => navigationRoute.label);

    // Assert
    expect(route).toEqual(expectedRoute);
    expect(labels).toEqual(expectedLabels);
  });

  it("derives prerender routes from site, project, writing, and theme helpers", () => {
    // Arrange
    const expectedRoutes = [
      ...siteRoutes.map((route) => route.path),
      ...projectDetailRoutes(),
      ...writingDetailRoutes(),
      ...themeDetailRoutes(),
    ];

    // Act
    const routes = prerenderRoutes;

    // Assert
    expect(routes).toEqual(expectedRoutes);
    expect(routes).toContain("/themes");
    for (const route of themeDetailRoutes()) {
      expect(routes).toContain(route);
    }
  });

  it("keeps Phase 20 sitemap routes on the pre-theme public boundary", () => {
    // Arrange
    const expectedRoutes = [
      ...siteRoutes.filter((route) => route.id !== "themes").map((route) => route.path),
      ...projectDetailRoutes(),
      ...writingDetailRoutes(),
    ];
    const themeRoutes = themeDetailRoutes();

    // Act
    const routes = sitemapRoutes;

    // Assert
    expect(routes).toEqual(expectedRoutes);
    expect(routes).not.toContain("/themes");
    for (const route of themeRoutes) {
      expect(routes).not.toContain(route);
    }
  });
});
