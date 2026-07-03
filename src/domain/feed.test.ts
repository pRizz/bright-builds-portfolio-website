import { describe, expect, it } from "vitest";
import {
  escapeXmlAttribute,
  escapeXmlText,
  rssDateFromIsoDate,
  rssFeedXml,
  type WritingFeedItem,
  writingFeedItems,
  writingFeedMetadata,
} from "./feed";
import { peterProfile } from "./profile";
import { canonicalTopicsForLabels } from "./topics";
import { curatedWriting, publicWritingEntries, type WritingEntry } from "./writing";

describe("writing feed items", () => {
  it("defaults to current public dated writing entries", () => {
    // Arrange
    const expectedSlugs = publicWritingEntries(curatedWriting)
      .filter((entry) => entry.maybeUpdatedOn ?? entry.maybePublishedOn)
      .map((entry) => entry.slug);

    // Act
    const feedItems = writingFeedItems();

    // Assert
    expect(feedItems.map((item) => item.slug)).toEqual(expectedSlugs);
  });

  it("excludes undated published, draft, hidden, and archived writing", () => {
    // Arrange
    const entries = [
      makeWritingEntry({
        slug: "dated-published",
        status: "published",
        maybePublishedOn: "2026-06-03",
      }),
      makeWritingEntry({
        slug: "undated-published",
        status: "published",
        maybePublishedOn: undefined,
        maybeUpdatedOn: undefined,
      }),
      makeWritingEntry({
        slug: "draft-writing",
        status: "draft",
        maybePublishedOn: "2026-06-04",
      }),
      makeWritingEntry({
        slug: "hidden-writing",
        status: "hidden",
        maybePublishedOn: "2026-06-05",
      }),
      makeWritingEntry({
        slug: "archived-writing",
        status: "archived",
        maybePublishedOn: "2026-06-06",
      }),
    ];

    // Act
    const feedItems = writingFeedItems(entries);

    // Assert
    expect(feedItems.map((item) => item.slug)).toEqual(["dated-published"]);
  });

  it("uses the absolute canonical writing URL as the stable item id", () => {
    // Arrange
    const entry = makeWritingEntry({ slug: "stable-id-entry" });

    // Act
    const [feedItem] = writingFeedItems([entry]);

    // Assert
    expect(feedItem).toMatchObject({
      canonicalUrl: `${peterProfile.canonicalOrigin}/writing/stable-id-entry`,
      id: `${peterProfile.canonicalOrigin}/writing/stable-id-entry`,
    } satisfies Partial<WritingFeedItem>);
  });

  it("prefers the checked-in update date before the published date", () => {
    // Arrange
    const entry = makeWritingEntry({
      maybePublishedOn: "2026-06-03",
      maybeUpdatedOn: "2026-06-10",
    });

    // Act
    const [feedItem] = writingFeedItems([entry]);

    // Assert
    expect(feedItem.feedDate).toBe("2026-06-10");
  });

  it("sorts by feed date descending, displayOrder ascending, and slug ascending", () => {
    // Arrange
    const entries = [
      makeWritingEntry({
        slug: "same-date-second",
        maybePublishedOn: "2026-06-10",
        displayOrder: 20,
      }),
      makeWritingEntry({
        slug: "older-first",
        maybePublishedOn: "2026-06-03",
        displayOrder: 1,
      }),
      makeWritingEntry({
        slug: "same-date-alpha",
        maybePublishedOn: "2026-06-10",
        displayOrder: 10,
      }),
      makeWritingEntry({
        slug: "same-date-beta",
        maybePublishedOn: "2026-06-10",
        displayOrder: 10,
      }),
      makeWritingEntry({
        slug: "newest",
        maybeUpdatedOn: "2026-06-12",
        displayOrder: 50,
      }),
    ];

    // Act
    const feedItems = writingFeedItems(entries);

    // Assert
    expect(feedItems.map((item) => item.slug)).toEqual([
      "newest",
      "same-date-alpha",
      "same-date-beta",
      "same-date-second",
      "older-first",
    ]);
  });

  it("derives feed categories from canonical public topic labels", () => {
    // Arrange
    const entry = makeWritingEntry({
      topics: ["Agentic engineering", "Unsupported private label"],
      tags: ["ai", "developer-tools", "unknown-tag"],
    });
    const expectedCategories = canonicalTopicsForLabels([...entry.topics, ...entry.tags]).map(
      (topic) => topic.label,
    );

    // Act
    const [feedItem] = writingFeedItems([entry]);

    // Assert
    expect(feedItem.categories).toEqual(expectedCategories);
    expect(feedItem.categories).toEqual(["AI", "Agentic engineering", "Developer tooling"]);
  });
});

describe("writing feed metadata", () => {
  it("returns the canonical Bright Builds writing feed metadata", () => {
    // Arrange
    const profile = peterProfile;

    // Act
    const metadata = writingFeedMetadata(profile);

    // Assert
    expect(metadata).toEqual({
      title: "Bright Builds writing feed",
      description:
        "Writing from Peter Ryszkiewicz on agentic engineering, open systems, identity, and practical web software.",
      siteUrl: peterProfile.canonicalOrigin,
      feedUrl: `${peterProfile.canonicalOrigin}/feed.xml`,
      language: "en-US",
    });
  });
});

describe("RSS feed dates", () => {
  it("formats checked-in ISO dates as UTC RSS dates", () => {
    // Arrange
    const isoDate = "2026-06-03";

    // Act
    const rssDate = rssDateFromIsoDate(isoDate);

    // Assert
    expect(rssDate).toBe("Wed, 03 Jun 2026 00:00:00 GMT");
    expect(rssDate).toBe(new Date("2026-06-03T00:00:00Z").toUTCString());
  });

  it("throws for impossible and malformed checked-in feed dates", () => {
    // Arrange
    const invalidDates = ["2026-02-31", "not-a-date"];

    // Act
    const parseInvalidDates = invalidDates.map(
      (invalidDate) => () => rssDateFromIsoDate(invalidDate),
    );

    // Assert
    expect(parseInvalidDates[0]).toThrow("Invalid feed date: 2026-02-31");
    expect(parseInvalidDates[1]).toThrow("Invalid feed date: not-a-date");
  });
});

describe("RSS XML escaping", () => {
  it("escapes XML text for item titles, descriptions, links, GUIDs, and categories", () => {
    // Arrange
    const item = makeWritingFeedItem({
      title: "Title & <signal>",
      summary: "Summary > body & detail",
      canonicalUrl: "https://example.test/writing/a?x=1&y=<two>",
      id: "https://example.test/writing/a?guid=<two>&stable=true",
      categories: ["AI & agents", "Open <web>"],
    });

    // Act
    const escapedText = escapeXmlText("A & B < C > D");
    const feedXml = rssFeedXml({ items: [item] });

    // Assert
    expect(escapedText).toBe("A &amp; B &lt; C &gt; D");
    expect(feedXml).toContain("<title>Title &amp; &lt;signal&gt;</title>");
    expect(feedXml).toContain("<description>Summary &gt; body &amp; detail</description>");
    expect(feedXml).toContain("<link>https://example.test/writing/a?x=1&amp;y=&lt;two&gt;</link>");
    expect(feedXml).toContain(
      '<guid isPermaLink="true">https://example.test/writing/a?guid=&lt;two&gt;&amp;stable=true</guid>',
    );
    expect(feedXml).toContain("<category>AI &amp; agents</category>");
    expect(feedXml).toContain("<category>Open &lt;web&gt;</category>");
  });

  it("escapes XML attributes for future attribute-safe values", () => {
    // Arrange
    const attributeValue = 'A & "B" < C > D';

    // Act
    const escapedAttribute = escapeXmlAttribute(attributeValue);

    // Assert
    expect(escapedAttribute).toBe("A &amp; &quot;B&quot; &lt; C &gt; D");
  });
});

describe("RSS feed XML", () => {
  it("emits a deterministic RSS 2.0 channel with item fields", () => {
    // Arrange
    const metadata = writingFeedMetadata({
      canonicalOrigin: "https://example.test",
      name: "Peter Ryszkiewicz",
      company: "Bright Builds",
    });
    const item = makeWritingFeedItem({
      title: "Feed item",
      summary: "Feed summary.",
      canonicalUrl: "https://example.test/writing/feed-item",
      id: "https://example.test/writing/feed-item",
      feedDate: "2026-06-03",
      categories: ["AI"],
    });

    // Act
    const feedXml = rssFeedXml({ metadata, items: [item] });

    // Assert
    expect(feedXml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(feedXml).toContain('<rss version="2.0">');
    expect(feedXml).toContain("<channel>");
    expect(feedXml).toContain("<title>Bright Builds writing feed</title>");
    expect(feedXml).toContain("<link>https://example.test</link>");
    expect(feedXml).toContain(
      "<description>Writing from Peter Ryszkiewicz on agentic engineering, open systems, identity, and practical web software.</description>",
    );
    expect(feedXml).toContain("<language>en-US</language>");
    expect(feedXml).toContain("<item>");
    expect(feedXml).toContain("<title>Feed item</title>");
    expect(feedXml).toContain("<link>https://example.test/writing/feed-item</link>");
    expect(feedXml).toContain(
      '<guid isPermaLink="true">https://example.test/writing/feed-item</guid>',
    );
    expect(feedXml).toContain("<pubDate>Wed, 03 Jun 2026 00:00:00 GMT</pubDate>");
    expect(feedXml).toContain("<description>Feed summary.</description>");
    expect(feedXml).toContain("<category>AI</category>");
  });

  it("uses writing summaries instead of section body text", () => {
    // Arrange
    const entry = makeWritingEntry({
      slug: "summary-only",
      title: "Summary only",
      summary: "This summary belongs in the feed.",
      sections: [
        {
          heading: "Body section",
          blocks: [{ kind: "paragraph", text: "Full body text should stay out of RSS." }],
        },
      ],
    });
    const [item] = writingFeedItems([entry]);

    // Act
    const feedXml = rssFeedXml({ items: [item] });

    // Assert
    expect(feedXml).toContain("<description>This summary belongs in the feed.</description>");
    expect(feedXml).not.toContain("Full body text should stay out of RSS.");
  });

  it("serializes current checked-in public writing entries stably", () => {
    // Arrange
    const firstItems = writingFeedItems();

    // Act
    const firstFeedXml = rssFeedXml({ items: firstItems });
    const secondFeedXml = rssFeedXml({ items: writingFeedItems() });

    // Assert
    expect(firstFeedXml).toBe(secondFeedXml);
  });
});

function makeWritingEntry(overrides: Partial<WritingEntry> = {}): WritingEntry {
  return {
    slug: "base-writing-entry",
    title: "Base writing entry",
    summary: "Base summary for a writing entry.",
    status: "published",
    kind: "note",
    maybePublishedOn: "2026-06-03",
    displayOrder: 10,
    topics: ["AI"],
    tags: ["ai"],
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

function makeWritingFeedItem(overrides: Partial<WritingFeedItem> = {}): WritingFeedItem {
  return {
    id: "https://example.test/writing/base-writing-entry",
    title: "Base writing feed item",
    summary: "Base writing feed summary.",
    canonicalUrl: "https://example.test/writing/base-writing-entry",
    feedDate: "2026-06-03",
    displayOrder: 10,
    slug: "base-writing-entry",
    categories: ["AI"],
    ...overrides,
  };
}
