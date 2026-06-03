import { describe, expect, it } from "vitest";
import * as writingSurface from "./writing";
import {
  curatedWriting,
  maybePublicWritingEntryBySlug,
  publicWritingEntries,
  relatedProjectDetailPageProjects,
  type WritingEntry,
  writingDetailPath,
  writingDetailRoutes,
} from "./writing";

describe("curated writing registry", () => {
  it("defines the initial authored writing entries in display order", () => {
    // Arrange
    const expectedSlugs = ["agentic-engineering-workflows", "portable-identity-and-owned-surfaces"];

    // Act
    const slugs = curatedWriting.map((entry) => entry.slug);

    // Assert
    expect(slugs).toEqual(expectedSlugs);
  });

  it("contains complete checked-in writing entry summaries and sections", () => {
    // Arrange
    const entries = curatedWriting;

    // Act
    const completenessChecks = entries.map((entry) => ({
      hasTitle: entry.title.trim().length > 0,
      hasSummary: entry.summary.trim().length > 0,
      hasTopics: entry.topics.length > 0,
      hasSections: entry.sections.length > 0,
    }));

    // Assert
    expect(completenessChecks).toEqual(
      entries.map(() => ({
        hasTitle: true,
        hasSummary: true,
        hasTopics: true,
        hasSections: true,
      })),
    );
  });

  it("exposes only the supported curated writing registry surface", () => {
    // Arrange
    const supportedExports = [
      "curatedWriting",
      "publicWritingEntries",
      "maybePublicWritingEntryBySlug",
      "writingDetailPath",
      "writingDetailRoutes",
      "relatedProjectDetailPageProjects",
    ];
    const legacyExports = ["writingSeeds", "featuredWriting", "primaryWritingEntry"];

    // Act
    const missingSupportedExports = supportedExports.filter((name) => !(name in writingSurface));
    const exposedLegacyExports = legacyExports.filter((name) => name in writingSurface);

    // Assert
    expect(missingSupportedExports).toEqual([]);
    expect(exposedLegacyExports).toEqual([]);
  });
});

describe("writing public helper surface", () => {
  it("returns only published writing entries sorted by display order", () => {
    // Arrange
    const entries = [
      makeWritingEntry({ slug: "draft-entry", status: "draft", displayOrder: 1 }),
      makeWritingEntry({ slug: "published-later", status: "published", displayOrder: 30 }),
      makeWritingEntry({ slug: "published-earlier", status: "published", displayOrder: 20 }),
      makeWritingEntry({ slug: "hidden-entry", status: "hidden", displayOrder: 10 }),
      makeWritingEntry({ slug: "archived-entry", status: "archived", displayOrder: 40 }),
    ];

    // Act
    const publicSlugs = publicWritingEntries(entries).map((entry) => entry.slug);

    // Assert
    expect(publicSlugs).toEqual(["published-earlier", "published-later"]);
  });

  it("resolves public writing by slug and returns null for non-public or unknown entries", () => {
    // Arrange
    const entries = [
      makeWritingEntry({ slug: "public-slug", status: "published" }),
      makeWritingEntry({ slug: "draft-slug", status: "draft" }),
      makeWritingEntry({ slug: "hidden-slug", status: "hidden" }),
      makeWritingEntry({ slug: "archived-slug", status: "archived" }),
    ];

    // Act
    const publicEntry = maybePublicWritingEntryBySlug("public-slug", entries);
    const maybeDraftEntry = maybePublicWritingEntryBySlug("draft-slug", entries);
    const maybeHiddenEntry = maybePublicWritingEntryBySlug("hidden-slug", entries);
    const maybeArchivedEntry = maybePublicWritingEntryBySlug("archived-slug", entries);
    const maybeUnknownEntry = maybePublicWritingEntryBySlug("unknown-slug", entries);

    // Assert
    expect(publicEntry?.slug).toBe("public-slug");
    expect(maybeDraftEntry).toBeNull();
    expect(maybeHiddenEntry).toBeNull();
    expect(maybeArchivedEntry).toBeNull();
    expect(maybeUnknownEntry).toBeNull();
  });

  it("derives writing detail paths and public writing routes", () => {
    // Arrange
    const publicEntry = makeWritingEntry({
      slug: "public-slug",
      status: "published",
      displayOrder: 20,
    });
    const draftEntry = makeWritingEntry({
      slug: "draft-slug",
      status: "draft",
      displayOrder: 10,
    });

    // Act
    const path = writingDetailPath(publicEntry);
    const routes = writingDetailRoutes([draftEntry, publicEntry]);

    // Assert
    expect(path).toBe("/writing/public-slug");
    expect(routes).toEqual(["/writing/public-slug"]);
    expect(writingDetailRoutes()).toEqual([
      "/writing/agentic-engineering-workflows",
      "/writing/portable-identity-and-owned-surfaces",
    ]);
  });

  it("resolves related selected project detail pages only", () => {
    // Arrange
    const entry = makeWritingEntry({
      relatedProjectSlugs: ["openlinks", "open-bitcoin", "unknown-project"],
    });

    // Act
    const projectSlugs = relatedProjectDetailPageProjects(entry).map((project) => project.slug);
    const defaultProjectSlugs = relatedProjectDetailPageProjects(curatedWriting[0]).map(
      (project) => project.slug,
    );

    // Assert
    expect(projectSlugs).toEqual(["openlinks"]);
    expect(defaultProjectSlugs).toEqual(["opencode-cloud", "free-the-world"]);
  });
});

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
