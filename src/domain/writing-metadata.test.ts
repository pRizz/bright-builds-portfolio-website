import { describe, expect, it } from "vitest";
import { peterProfile } from "./profile";
import { routeByPath } from "./routes";
import {
  jsonLdScriptContent,
  metadataForRoute,
  metadataForWritingEntry,
  personJsonLd,
  sitemapXml,
  writingBlogPostingJsonLd,
  writingItemListJsonLd,
} from "./seo";
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

  it("reuses the checked-in social fallback for writing detail sharing", () => {
    // Arrange
    const entry = publicWritingEntries()[0];
    const expectedSocialImageUrl = `${peterProfile.canonicalOrigin}/social/bright-builds-og.png`;

    // Act
    const metadata = metadataForWritingEntry(entry, peterProfile);

    // Assert
    expect(metadata.openGraph.image).toMatchObject({
      url: expectedSocialImageUrl,
      width: 1200,
      height: 630,
    });
    expect(metadata.openGraph.image.alt).not.toHaveLength(0);
    expect(metadata.twitter.image).toEqual(metadata.openGraph.image);
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

    // Act
    const metadata = metadataForRoute(route, peterProfile);

    // Assert
    expect(metadata.title).toBe("Writing | Peter Ryszkiewicz");
    expect(metadata.canonical).toBe(`${peterProfile.canonicalOrigin}/writing`);
    expect(metadata.openGraph.type).toBe("website");
    expect(metadata.openGraph.image).toMatchObject({
      url: `${peterProfile.canonicalOrigin}/social/bright-builds-og.png`,
      width: 1200,
      height: 630,
    });
    expect(metadata.twitter.card).toBe("summary_large_image");
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
      image: `${peterProfile.canonicalOrigin}/social/bright-builds-og.png`,
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
