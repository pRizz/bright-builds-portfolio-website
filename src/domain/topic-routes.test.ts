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
import { publicTopics, topicDetailPath, topicDetailRoutes } from "./topics";
import { writingDetailRoutes } from "./writing";

describe("topic route registry", () => {
  it("registers Topics as a normal top-level navigation route", () => {
    // Arrange
    const expectedRoute = {
      id: "topics",
      path: "/topics",
      label: "Topics",
      title: "Topics | Peter Ryszkiewicz",
      description:
        "Public topics connecting Peter Ryszkiewicz's projects, writing, and theme paths through safe static discovery routes.",
      heading: "Topics",
      staticCheckText:
        "Browse the public labels that connect Peter's projects, writing, and theme paths.",
      nav: true,
    };
    const expectedLabels = ["Home", "About", "Projects", "Writing", "Themes", "Topics", "Contact"];

    // Act
    const route = routeByPath("/topics");
    const labels = navigationRoutes.map((navigationRoute) => navigationRoute.label);

    // Assert
    expect(route).toEqual(expectedRoute);
    expect(labels).toEqual(expectedLabels);
  });

  it("derives topic detail routes from public topics", () => {
    // Arrange
    const topics = publicTopics();

    // Act
    const routes = topicDetailRoutes();

    // Assert
    expect(routes).toEqual(topics.map(topicDetailPath));
    expect(routes).not.toContain("/topics/unknown-topic");
  });

  it("derives prerender routes from site, project, writing, theme, and topic helpers", () => {
    // Arrange
    const expectedRoutes = [
      ...siteRoutes.map((route) => route.path),
      ...projectDetailRoutes(),
      ...writingDetailRoutes(),
      ...themeDetailRoutes(),
      ...topicDetailRoutes(),
    ];

    // Act
    const routes = prerenderRoutes;

    // Assert
    expect(routes).toEqual(expectedRoutes);
    expect(routes).toContain("/topics");
    for (const route of topicDetailRoutes()) {
      expect(routes).toContain(route);
    }
    expect(routes).not.toContain("/topics/unknown-topic");
  });

  it("includes topic index and detail routes in sitemap routes", () => {
    // Arrange
    const expectedRoutes = [
      ...siteRoutes.map((route) => route.path),
      ...projectDetailRoutes(),
      ...writingDetailRoutes(),
      ...themeDetailRoutes(),
      ...topicDetailRoutes(),
    ];

    // Act
    const routes = sitemapRoutes;

    // Assert
    expect(routes).toEqual(expectedRoutes);
    expect(routes).toContain("/topics");
    for (const route of topicDetailRoutes()) {
      expect(routes).toContain(route);
    }
    expect(routes).not.toContain("/topics/unknown-topic");
  });
});
