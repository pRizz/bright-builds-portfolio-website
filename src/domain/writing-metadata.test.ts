import { describe, expect, it } from "vitest";
import { peterProfile } from "./profile";
import { routeByPath } from "./routes";
import {
  jsonLdScriptContent,
  metadataForRoute,
  metadataForTheme,
  metadataForWritingEntry,
  personJsonLd,
  sitemapXml,
  themeCollectionPageJsonLd,
  themeItemListJsonLd,
  writingBlogPostingJsonLd,
  writingItemListJsonLd,
} from "./seo";
import { maybeSocialPreviewTargetForRoutePath } from "./social-previews";
import {
  type PublicThemeEntry,
  publicThemeEntries,
  type ThemeRecord,
  themeDetailPath,
  themeDetailRoutes,
} from "./themes";
import {
  type PublicWritingEntry,
  publicWritingEntries,
  type WritingEntry,
  writingDetailPath,
  writingDetailRoutes,
} from "./writing";

describe("writing metadata", () => {
  it("derives writing detail metadata from a public writing entry", () => {
    // Arrange
    const entry = publicWritingEntries()[0];

    // Act
    const metadata = metadataForWritingEntry(entry, peterProfile);

    // Assert
    expect(metadata.title).toBe(`${entry.title} | Writing | Bright Builds`);
    expect(metadata.description).toBe(entry.summary);
    expect(metadata.canonical).toBe(`${peterProfile.canonicalOrigin}${writingDetailPath(entry)}`);
    expect(metadata.openGraph).toMatchObject({
      title: metadata.title,
      description: entry.summary,
      url: metadata.canonical,
      type: "article",
    });
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      title: metadata.title,
      description: entry.summary,
    });
  });

  it("derives route-aware share metadata for public writing entries", () => {
    // Arrange
    const entries = publicWritingEntries();

    // Act
    const records = entries.map((entry) => ({
      metadata: metadataForWritingEntry(entry, peterProfile),
      target: socialPreviewTargetForRoutePath(writingDetailPath(entry)),
    }));

    // Assert
    for (const { metadata, target } of records) {
      expect(metadata.openGraph.image).toEqual({
        url: `${peterProfile.canonicalOrigin}${target.assetPath}`,
        width: target.dimensions.width,
        height: target.dimensions.height,
        alt: target.alt,
        mimeType: "image/png",
      });
      expect(metadata.twitter.image).toEqual(metadata.openGraph.image);
    }
  });

  it("adds article dates and tags only when writing data provides them", () => {
    // Arrange
    const datedEntry = makePublicWritingEntry({
      maybePublishedOn: "2026-06-03",
      maybeUpdatedOn: "2026-06-10",
      topics: ["Agentic engineering"],
      tags: ["ai", "developer-tools"],
    });
    const undatedEntry = makePublicWritingEntry({
      maybePublishedOn: undefined,
      maybeUpdatedOn: undefined,
      topics: ["Open web"],
      tags: [],
    });

    // Act
    const datedMetadata = metadataForWritingEntry(datedEntry, peterProfile);
    const undatedMetadata = metadataForWritingEntry(undatedEntry, peterProfile);

    // Assert
    expect(datedMetadata.article).toEqual({
      maybePublishedTime: "2026-06-03",
      maybeModifiedTime: "2026-06-10",
      tags: ["Agentic engineering", "ai", "developer-tools"],
    });
    expect(undatedMetadata.article).toEqual({
      tags: ["Open web"],
    });
  });

  it("keeps the writing index metadata as route-level website metadata", () => {
    // Arrange
    const route = routeByPath("/writing");
    const target = socialPreviewTargetForRoutePath(route.path);

    // Act
    const metadata = metadataForRoute(route, peterProfile);

    // Assert
    expect(metadata.title).toBe("Writing | Peter Ryszkiewicz");
    expect(metadata.canonical).toBe(`${peterProfile.canonicalOrigin}/writing`);
    expect(metadata.openGraph.type).toBe("website");
    expect(metadata.openGraph.image).toEqual({
      url: `${peterProfile.canonicalOrigin}${target.assetPath}`,
      width: target.dimensions.width,
      height: target.dimensions.height,
      alt: target.alt,
      mimeType: "image/png",
    });
    expect(metadata.twitter.card).toBe("summary_large_image");
  });
});

describe("theme metadata", () => {
  it("derives theme detail metadata from a public theme entry", () => {
    // Arrange
    const theme = publicThemeEntries()[0];

    // Act
    const metadata = metadataForTheme(theme, peterProfile);

    // Assert
    expect(metadata.title).toBe(`${theme.title} | Themes | Bright Builds`);
    expect(metadata.description).toBe(theme.summary);
    expect(metadata.canonical).toBe(`${peterProfile.canonicalOrigin}${themeDetailPath(theme)}`);
    expect(metadata.openGraph).toMatchObject({
      title: metadata.title,
      description: theme.summary,
      url: metadata.canonical,
      type: "website",
    });
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      title: metadata.title,
      description: theme.summary,
    });
  });

  it("derives route-aware share metadata for public theme entries", () => {
    // Arrange
    const themes = publicThemeEntries();

    // Act
    const records = themes.map((theme) => ({
      metadata: metadataForTheme(theme, peterProfile),
      target: socialPreviewTargetForRoutePath(themeDetailPath(theme)),
    }));

    // Assert
    for (const { metadata, target } of records) {
      expect(metadata.openGraph.image).toEqual({
        url: `${peterProfile.canonicalOrigin}${target.assetPath}`,
        width: target.dimensions.width,
        height: target.dimensions.height,
        alt: target.alt,
        mimeType: "image/png",
      });
      expect(metadata.twitter.image).toEqual(metadata.openGraph.image);
    }
  });

  it("creates ordered theme ItemList JSON-LD for public entries only", () => {
    // Arrange
    const fixtures = [
      makeThemeRecord({ slug: "draft-theme", status: "draft", displayOrder: 1 }),
      makeThemeRecord({ slug: "public-later", title: "Public later", displayOrder: 30 }),
      makeThemeRecord({ slug: "public-earlier", title: "Public earlier", displayOrder: 20 }),
      makeThemeRecord({ slug: "hidden-theme", status: "hidden", displayOrder: 10 }),
    ];
    const themes = publicThemeEntries(fixtures);

    // Act
    const jsonLd = themeItemListJsonLd(themes, peterProfile);

    // Assert
    expect(jsonLd["@type"]).toBe("ItemList");
    expect(jsonLd.itemListElement).toHaveLength(2);
    expect(jsonLd.itemListElement.map((element) => element.position)).toEqual([1, 2]);
    expect(jsonLd.itemListElement.map((element) => element.item)).toEqual([
      expect.objectContaining({
        "@type": "CollectionPage",
        name: "Public earlier",
        description: "Base summary for a theme path.",
        url: `${peterProfile.canonicalOrigin}/themes/public-earlier`,
      }),
      expect.objectContaining({
        "@type": "CollectionPage",
        name: "Public later",
        description: "Base summary for a theme path.",
        url: `${peterProfile.canonicalOrigin}/themes/public-later`,
      }),
    ]);
  });

  it("creates CollectionPage JSON-LD from helper-derived theme relationships", () => {
    // Arrange
    const theme = publicThemeEntries()[0];
    const canonical = `${peterProfile.canonicalOrigin}${themeDetailPath(theme)}`;
    const metadata = metadataForTheme(theme, peterProfile);

    // Act
    const jsonLd = themeCollectionPageJsonLd(theme, peterProfile);

    // Assert
    expect(jsonLd).toMatchObject({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: theme.title,
      description: theme.summary,
      url: canonical,
      mainEntityOfPage: canonical,
      image: metadata.openGraph.image.url,
      creator: personJsonLd(peterProfile),
    });
    expect(jsonLd.keywords).toContain(theme.title);
    expect(jsonLd.about).toEqual([
      theme.summary,
      theme.audience,
      theme.collaborationAngle,
      ...theme.proofPoints,
    ]);
    expect(jsonLd.mentions).toContain(theme.collaborationAngle);
    expect(jsonLd.hasPart).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          "@type": "SoftwareSourceCode",
          url: `${peterProfile.canonicalOrigin}/projects/opencode-cloud`,
        }),
        expect.objectContaining({
          "@type": "BlogPosting",
          url: `${peterProfile.canonicalOrigin}/writing/agentic-engineering-workflows`,
        }),
      ]),
    );
  });

  it("serializes theme CollectionPage JSON-LD safely for script tags", () => {
    // Arrange
    const theme = makePublicThemeEntry({
      title: "Theme <schema>",
    });

    // Act
    const content = jsonLdScriptContent(themeCollectionPageJsonLd(theme, peterProfile));

    // Assert
    expect(content).not.toContain("<");
    expect(content).toContain("\\u003c");
  });

  it("derives sitemap theme coverage from public theme routes only", () => {
    // Arrange
    const fixtures = [
      makeThemeRecord({ slug: "public-theme", status: "public", displayOrder: 10 }),
      makeThemeRecord({ slug: "draft-theme", status: "draft", displayOrder: 20 }),
      makeThemeRecord({ slug: "hidden-theme", status: "hidden", displayOrder: 30 }),
      makeThemeRecord({ slug: "unsupported-theme", status: "unsupported", displayOrder: 40 }),
      makeThemeRecord({ slug: "archived-theme", status: "archived", displayOrder: 50 }),
    ];

    // Act
    const sitemap = sitemapXml(["/themes", ...themeDetailRoutes(fixtures)], peterProfile);

    // Assert
    expect(sitemap).toContain(`<loc>${peterProfile.canonicalOrigin}/themes</loc>`);
    expect(sitemap).toContain(`<loc>${peterProfile.canonicalOrigin}/themes/public-theme</loc>`);
    expect(sitemap).not.toContain(`<loc>${peterProfile.canonicalOrigin}/themes/draft-theme</loc>`);
    expect(sitemap).not.toContain(`<loc>${peterProfile.canonicalOrigin}/themes/hidden-theme</loc>`);
    expect(sitemap).not.toContain(
      `<loc>${peterProfile.canonicalOrigin}/themes/unsupported-theme</loc>`,
    );
    expect(sitemap).not.toContain(
      `<loc>${peterProfile.canonicalOrigin}/themes/archived-theme</loc>`,
    );
    expect(sitemap).not.toContain(
      `<loc>${peterProfile.canonicalOrigin}/themes/unknown-theme</loc>`,
    );
  });
});

describe("writing structured data", () => {
  it("creates BlogPosting JSON-LD from writing entry content and profile identity", () => {
    // Arrange
    const entry = makePublicWritingEntry({
      slug: "entry-with-body",
      title: "Entry with body",
      summary: "Summary for a complete writing entry.",
      maybePublishedOn: "2026-06-03",
      maybeUpdatedOn: "2026-06-10",
      topics: ["Agentic engineering"],
      tags: ["ai", "developer-tools"],
      sections: [
        {
          heading: "Working thesis",
          blocks: [
            { kind: "paragraph", text: "Paragraph body text." },
            { kind: "list", items: ["First list item.", "Second list item."] },
            { kind: "callout", text: "Callout body text." },
            { kind: "link", label: "Project note", href: "https://example.com/project-note" },
          ],
        },
      ],
    });
    const canonical = `${peterProfile.canonicalOrigin}${writingDetailPath(entry)}`;
    const expectedLabels = ["Agentic engineering", "ai", "developer-tools"];
    const metadata = metadataForWritingEntry(entry, peterProfile);

    // Act
    const jsonLd = writingBlogPostingJsonLd(entry, peterProfile);

    // Assert
    expect(jsonLd).toMatchObject({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: entry.title,
      name: entry.title,
      description: entry.summary,
      url: canonical,
      mainEntityOfPage: canonical,
      datePublished: "2026-06-03",
      dateModified: "2026-06-10",
      image: metadata.openGraph.image.url,
      keywords: expectedLabels,
      about: expectedLabels,
    });
    expect(jsonLd.author).toEqual(personJsonLd(peterProfile));
    expect(jsonLd.creator).toEqual(personJsonLd(peterProfile));
    expect(jsonLd.articleBody).toContain("Working thesis");
    expect(jsonLd.articleBody).toContain("Paragraph body text.");
    expect(jsonLd.articleBody).toContain("First list item.");
    expect(jsonLd.articleBody).toContain("Second list item.");
    expect(jsonLd.articleBody).toContain("Callout body text.");
    expect(jsonLd.articleBody).toContain("Project note");
    expect(jsonLd.articleBody).not.toContain("https://example.com/project-note");
  });

  it("omits unsupported BlogPosting fields and absent dates", () => {
    // Arrange
    const entry = makePublicWritingEntry({
      maybePublishedOn: undefined,
      maybeUpdatedOn: undefined,
    });

    // Act
    const jsonLd = writingBlogPostingJsonLd(entry, peterProfile);

    // Assert
    expect(jsonLd).not.toHaveProperty("datePublished");
    expect(jsonLd).not.toHaveProperty("dateModified");
    expect(jsonLd).not.toHaveProperty("publisher");
    expect(jsonLd).not.toHaveProperty("comment");
    expect(jsonLd).not.toHaveProperty("commentCount");
    expect(jsonLd).not.toHaveProperty("isAccessibleForFree");
    expect(jsonLd).not.toHaveProperty("hasPart");
    expect(jsonLd).not.toHaveProperty("aggregateRating");
  });

  it("serializes writing BlogPosting JSON-LD safely for script tags", () => {
    // Arrange
    const entry = makePublicWritingEntry({
      title: "Writing <schema>",
    });

    // Act
    const content = jsonLdScriptContent(writingBlogPostingJsonLd(entry, peterProfile));

    // Assert
    expect(content).not.toContain("<");
    expect(content).toContain("\\u003c");
  });

  it("creates ordered writing ItemList JSON-LD for public entries only", () => {
    // Arrange
    const fixtures = [
      makeWritingEntry({ slug: "draft-entry", status: "draft", displayOrder: 1 }),
      makeWritingEntry({ slug: "published-later", title: "Published later", displayOrder: 30 }),
      makeWritingEntry({
        slug: "published-earlier",
        title: "Published earlier",
        displayOrder: 20,
      }),
      makeWritingEntry({ slug: "hidden-entry", status: "hidden", displayOrder: 10 }),
    ];
    const entries = publicWritingEntries(fixtures);

    // Act
    const jsonLd = writingItemListJsonLd(entries, peterProfile);

    // Assert
    expect(jsonLd["@type"]).toBe("ItemList");
    expect(jsonLd.itemListElement).toHaveLength(2);
    expect(jsonLd.itemListElement.map((element) => element.position)).toEqual([1, 2]);
    expect(jsonLd.itemListElement.map((element) => element.item)).toEqual([
      expect.objectContaining({
        "@type": "BlogPosting",
        headline: "Published earlier",
        name: "Published earlier",
        description: "Base summary for a writing entry.",
        url: `${peterProfile.canonicalOrigin}/writing/published-earlier`,
      }),
      expect.objectContaining({
        "@type": "BlogPosting",
        headline: "Published later",
        name: "Published later",
        description: "Base summary for a writing entry.",
        url: `${peterProfile.canonicalOrigin}/writing/published-later`,
      }),
    ]);
  });

  it("keeps public writing JSON-LD images in parity with share metadata", () => {
    // Arrange
    const entries = publicWritingEntries();

    // Act
    const itemListJsonLd = writingItemListJsonLd(entries, peterProfile);
    const blogPostingRecords = entries.map((entry) => ({
      entry,
      jsonLd: writingBlogPostingJsonLd(entry, peterProfile),
      metadata: metadataForWritingEntry(entry, peterProfile),
    }));

    // Assert
    for (const { entry, jsonLd, metadata } of blogPostingRecords) {
      expect(jsonLd.image).toBe(metadata.openGraph.image.url);

      const maybeItem = itemListJsonLd.itemListElement.find(
        (element) =>
          element.item.url === `${peterProfile.canonicalOrigin}${writingDetailPath(entry)}`,
      );

      expect(maybeItem?.item.image).toBe(metadata.openGraph.image.url);
    }
  });

  it("derives sitemap writing coverage from public writing routes only", () => {
    // Arrange
    const fixtures = [
      makeWritingEntry({ slug: "public-entry", status: "published", displayOrder: 10 }),
      makeWritingEntry({ slug: "draft-entry", status: "draft", displayOrder: 20 }),
      makeWritingEntry({ slug: "hidden-entry", status: "hidden", displayOrder: 30 }),
      makeWritingEntry({ slug: "archived-entry", status: "archived", displayOrder: 40 }),
    ];

    // Act
    const sitemap = sitemapXml(["/writing", ...writingDetailRoutes(fixtures)], peterProfile);

    // Assert
    expect(sitemap).toContain(`<loc>${peterProfile.canonicalOrigin}/writing</loc>`);
    expect(sitemap).toContain(`<loc>${peterProfile.canonicalOrigin}/writing/public-entry</loc>`);
    expect(sitemap).not.toContain(`<loc>${peterProfile.canonicalOrigin}/writing/draft-entry</loc>`);
    expect(sitemap).not.toContain(
      `<loc>${peterProfile.canonicalOrigin}/writing/hidden-entry</loc>`,
    );
    expect(sitemap).not.toContain(
      `<loc>${peterProfile.canonicalOrigin}/writing/archived-entry</loc>`,
    );
    expect(sitemap).not.toContain(
      `<loc>${peterProfile.canonicalOrigin}/writing/unknown-entry</loc>`,
    );
  });
});

function makePublicWritingEntry(
  overrides: Partial<Omit<WritingEntry, "status">>,
): PublicWritingEntry {
  return {
    slug: "public-writing-entry",
    title: "Public writing entry",
    summary: "Public summary for a writing entry.",
    status: "published",
    kind: "note",
    displayOrder: 10,
    topics: ["Testing"],
    tags: ["test"],
    relatedProjectSlugs: [],
    sections: [
      {
        heading: "Public section",
        blocks: [{ kind: "paragraph", text: "Public paragraph body." }],
      },
    ],
    ...overrides,
  };
}

function makePublicThemeEntry(overrides: Partial<Omit<ThemeRecord, "status">>): PublicThemeEntry {
  return {
    ...makeThemeRecord(overrides),
    status: "public",
  };
}

function makeThemeRecord(overrides: Partial<ThemeRecord> = {}): ThemeRecord {
  return {
    slug: "base-theme",
    title: "Base theme",
    summary: "Base summary for a theme path.",
    status: "public",
    displayOrder: 10,
    audience: "Builders evaluating a test theme path.",
    proofPoints: ["A concrete proof point for the theme path."],
    collaborationAngle: "A practical collaboration angle for the theme path.",
    relatedProjectSlugs: ["openlinks"],
    relatedWritingSlugs: ["portable-identity-and-owned-surfaces"],
    ...overrides,
  };
}

function makeWritingEntry(overrides: Partial<WritingEntry>): WritingEntry {
  return {
    slug: "base-writing-entry",
    title: "Base writing entry",
    summary: "Base summary for a writing entry.",
    status: "published",
    kind: "note",
    maybePublishedOn: "2026-06-03",
    displayOrder: 10,
    topics: ["Testing"],
    tags: ["test"],
    relatedProjectSlugs: [],
    sections: [
      {
        heading: "Base section",
        blocks: [{ kind: "paragraph", text: "Base paragraph body." }],
      },
    ],
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
