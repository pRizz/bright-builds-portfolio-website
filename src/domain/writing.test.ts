import { describe, expect, it } from "vitest";
import { curatedWriting } from "./writing";
import * as writingSurface from "./writing";

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
    const supportedExports = ["curatedWriting"];
    const legacyExports = ["writingSeeds", "featuredWriting", "primaryWritingEntry"];

    // Act
    const missingSupportedExports = supportedExports.filter((name) => !(name in writingSurface));
    const exposedLegacyExports = legacyExports.filter((name) => name in writingSurface);

    // Assert
    expect(missingSupportedExports).toEqual([]);
    expect(exposedLegacyExports).toEqual([]);
  });
});
