import { describe, expect, it } from "vitest";
import { peterProfile, profileLinksByKind, profileSameAsLinks } from "./profile";
import * as projectSurface from "./projects";
import { curatedProjects, homeProjects, projectDetailRoutes } from "./projects";
import {
  navigationRoutes,
  prerenderRoutes,
  routeByPath,
  sitemapRoutes,
  siteRoutes,
} from "./routes";
import { metadataForFallbackPage, metadataForRoute, personJsonLd } from "./seo";
import { SOCIAL_PREVIEW_FALLBACK_IMAGE } from "./social-previews";
import { themeDetailRoutes } from "./themes";
import { writingDetailRoutes } from "./writing";

describe("foundation route registry", () => {
  it("defines the current prerender route set with detail pages", () => {
    // Arrange
    const expectedRoutes = [
      ...siteRoutes.map((route) => route.path),
      ...projectDetailRoutes(),
      ...writingDetailRoutes(),
      ...themeDetailRoutes(),
    ];
    const expectedSitemapRoutes = [
      ...siteRoutes.map((route) => route.path),
      ...projectDetailRoutes(),
      ...writingDetailRoutes(),
      ...themeDetailRoutes(),
    ];

    // Act
    const routes = prerenderRoutes;
    const publicSitemapRoutes = sitemapRoutes;

    // Assert
    expect(routes).toEqual(expectedRoutes);
    expect(publicSitemapRoutes).toEqual(expectedSitemapRoutes);
    expect(navigationRoutes).toHaveLength(siteRoutes.length);
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

describe("curated project stories", () => {
  it("selects the current home project stories in display order", () => {
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
    const projects = homeProjects();

    // Assert
    expect(projects.map((project) => project.slug)).toEqual(expectedSlugs);
  });

  it("contains the reviewed Phase 2 project story set", () => {
    // Arrange
    const expectedSlugs = [
      "openlinks",
      "free-the-world",
      "win3bitcoin",
      "open-bitcoin",
      "opencode-cloud",
      "zeckendorf",
      "mystic-ui",
      "open-links-sites",
      "bitcoin-bond-proposal",
      "btc-vanity-address-finder",
    ];

    // Act
    const slugs = curatedProjects.map((project) => project.slug);

    // Assert
    expect(slugs).toEqual(expect.arrayContaining(expectedSlugs));
  });

  it("uses reviewed source links instead of stale or invented repository links", () => {
    // Arrange
    const hrefs = curatedProjects.reduce<string[]>((allHrefs, project) => {
      allHrefs.push(...project.links.map((link) => link.href));
      return allHrefs;
    }, []);

    // Assert
    expect(hrefs.some((href) => href.includes("pRizz/openlinks"))).toBe(false);
    expect(hrefs.some((href) => href.includes("pRizz/win3bitcoin"))).toBe(false);
    expect(
      hrefs.some(
        (href) =>
          href === "https://github.com/pRizz/open-bitcoin" ||
          href.startsWith("https://github.com/pRizz/open-bitcoin/"),
      ),
    ).toBe(false);
  });

  it("exposes only the supported curated project helper surface", () => {
    // Arrange
    const supportedExports = [
      "curatedProjects",
      "homeProjects",
      "visibleProjects",
      "publicProjectIndexProjects",
      "hiddenExcludedProjects",
      "currentFocusProjects",
      "projectDetailPageProjects",
      "maybeProjectDetailPageProjectBySlug",
      "projectsByPlacement",
      "writingProjects",
      "projectDetailPath",
      "projectDetailRoutes",
      "projectStoryHref",
      "projectAnchorHref",
      "projectLinkDisplayLabel",
    ];
    const legacyExports = ["projectSeeds", "primaryProjectLink", "featuredProjects"];

    // Act
    const missingSupportedExports = supportedExports.filter((name) => !(name in projectSurface));
    const exposedLegacyExports = legacyExports.filter((name) => name in projectSurface);

    // Assert
    expect(missingSupportedExports).toEqual([]);
    expect(exposedLegacyExports).toEqual([]);
  });
});

describe("SEO derivation", () => {
  it("creates canonical metadata for a route", () => {
    // Arrange
    const route = routeByPath("/projects");

    // Act
    const metadata = metadataForRoute(route, peterProfile);

    // Assert
    expect(metadata.title).toBe("Curated Projects | Peter Ryszkiewicz");
    expect(metadata.canonical).toBe("https://www.brightbuilds.us/projects");
    expect(metadata.openGraph.url).toBe(metadata.canonical);
  });

  it("keeps generic route metadata on the fallback social preview", () => {
    // Arrange
    const genericRoutes = [routeByPath("/"), routeByPath("/about"), routeByPath("/contact")];

    // Act
    const metadataRecords = genericRoutes.map((route) => metadataForRoute(route, peterProfile));

    // Assert
    for (const metadata of metadataRecords) {
      expect(metadata.openGraph.image).toEqual({
        url: `${peterProfile.canonicalOrigin}${SOCIAL_PREVIEW_FALLBACK_IMAGE.assetPath}`,
        width: SOCIAL_PREVIEW_FALLBACK_IMAGE.dimensions.width,
        height: SOCIAL_PREVIEW_FALLBACK_IMAGE.dimensions.height,
        alt: SOCIAL_PREVIEW_FALLBACK_IMAGE.alt,
        mimeType: "image/png",
      });
      expect(metadata.twitter.image).toEqual(metadata.openGraph.image);
    }
  });

  it("keeps dynamic fallback metadata on the generic social preview", () => {
    // Arrange
    const fallbackPages = [
      {
        title: "No reviewed project story here | Projects | Bright Builds",
        description: "Return to the curated project index to browse reviewed work.",
        canonicalPath: "/projects",
      },
      {
        title: "No public writing here | Writing | Bright Builds",
        description: "Return to the writing index to browse published notes.",
        canonicalPath: "/writing",
      },
      {
        title: "No public theme here | Themes | Bright Builds",
        description: "Browse public theme paths to find a route through Peter's work.",
        canonicalPath: "/themes",
      },
    ];

    // Act
    const metadataRecords = fallbackPages.map((page) => ({
      page,
      metadata: metadataForFallbackPage({ ...page, maybeProfile: peterProfile }),
    }));

    // Assert
    for (const { page, metadata } of metadataRecords) {
      expect(metadata.title).toBe(page.title);
      expect(metadata.description).toBe(page.description);
      expect(metadata.canonical).toBe(`${peterProfile.canonicalOrigin}${page.canonicalPath}`);
      expect(metadata.openGraph).toMatchObject({
        title: page.title,
        description: page.description,
        url: metadata.canonical,
        type: "website",
      });
      expect(metadata.openGraph.image).toEqual({
        url: `${peterProfile.canonicalOrigin}${SOCIAL_PREVIEW_FALLBACK_IMAGE.assetPath}`,
        width: SOCIAL_PREVIEW_FALLBACK_IMAGE.dimensions.width,
        height: SOCIAL_PREVIEW_FALLBACK_IMAGE.dimensions.height,
        alt: SOCIAL_PREVIEW_FALLBACK_IMAGE.alt,
        mimeType: "image/png",
      });
      expect(metadata.openGraph.image.mimeType).toBe("image/png");
      expect(metadata.twitter).toMatchObject({
        card: "summary_large_image",
        title: page.title,
        description: page.description,
        image: metadata.openGraph.image,
      });
    }
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
