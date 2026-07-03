import { describe, expect, it } from "vitest";
import { type WritingFeedItem, writingFeedItems, writingFeedMetadata } from "./feed";
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
