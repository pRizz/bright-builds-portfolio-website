import { describe, expect, it } from "vitest";
import * as themeSurface from "./themes";
import {
  curatedThemes,
  maybePublicThemeEntryBySlug,
  publicThemeEntries,
  relatedProjectDetailPageProjectsForTheme,
  relatedWritingEntriesForTheme,
  type ThemeRecord,
  themeDetailPath,
  themeDetailRoutes,
} from "./themes";
import type { WritingEntry } from "./writing";

describe("curated theme registry", () => {
  it("defines the initial authored theme entries in display order", () => {
    // Arrange
    const expectedSlugs = ["agentic-engineering", "open-identity"];

    // Act
    const slugs = curatedThemes.map((theme) => theme.slug);

    // Assert
    expect(slugs).toEqual(expectedSlugs);
  });

  it("contains complete checked-in theme summaries and relationship anchors", () => {
    // Arrange
    const themes = curatedThemes;

    // Act
    const completenessChecks = themes.map((theme) => ({
      hasTitle: theme.title.trim().length > 0,
      hasSummary: theme.summary.trim().length > 0,
      hasAudience: theme.audience.trim().length > 0,
      hasProofPoints: theme.proofPoints.length > 0,
      hasCollaborationAngle: theme.collaborationAngle.trim().length > 0,
      hasRelatedProjects: theme.relatedProjectSlugs.length > 0,
      hasRelatedWriting: theme.relatedWritingSlugs.length > 0,
    }));

    // Assert
    expect(completenessChecks).toEqual(
      themes.map(() => ({
        hasTitle: true,
        hasSummary: true,
        hasAudience: true,
        hasProofPoints: true,
        hasCollaborationAngle: true,
        hasRelatedProjects: true,
        hasRelatedWriting: true,
      })),
    );
  });

  it("exposes only the supported curated theme registry surface", () => {
    // Arrange
    const supportedExports = [
      "curatedThemes",
      "publicThemeEntries",
      "maybePublicThemeEntryBySlug",
      "themeDetailPath",
      "themeDetailRoutes",
      "relatedProjectDetailPageProjectsForTheme",
      "relatedWritingEntriesForTheme",
    ];
    const legacyExports = [
      "themeSeeds",
      "featuredThemes",
      "themeRouteSlugs",
      "themeDetailRouteSlugs",
    ];

    // Act
    const missingSupportedExports = supportedExports.filter((name) => !(name in themeSurface));
    const exposedLegacyExports = legacyExports.filter((name) => name in themeSurface);

    // Assert
    expect(missingSupportedExports).toEqual([]);
    expect(exposedLegacyExports).toEqual([]);
  });
});

describe("theme public helper surface", () => {
  it("returns only public themes sorted by display order", () => {
    // Arrange
    const themes = [
      makeThemeRecord({ slug: "draft-theme", status: "draft", displayOrder: 1 }),
      makeThemeRecord({ slug: "public-later", status: "public", displayOrder: 30 }),
      makeThemeRecord({ slug: "public-earlier", status: "public", displayOrder: 20 }),
      makeThemeRecord({ slug: "hidden-theme", status: "hidden", displayOrder: 10 }),
      makeThemeRecord({ slug: "unsupported-theme", status: "unsupported", displayOrder: 40 }),
      makeThemeRecord({ slug: "archived-theme", status: "archived", displayOrder: 50 }),
    ];

    // Act
    const publicSlugs = publicThemeEntries(themes).map((theme) => theme.slug);

    // Assert
    expect(publicSlugs).toEqual(["public-earlier", "public-later"]);
  });

  it("resolves public themes by slug and returns null for non-public or unknown themes", () => {
    // Arrange
    const themes = [
      makeThemeRecord({ slug: "public-slug", status: "public" }),
      makeThemeRecord({ slug: "draft-slug", status: "draft" }),
      makeThemeRecord({ slug: "hidden-slug", status: "hidden" }),
      makeThemeRecord({ slug: "unsupported-slug", status: "unsupported" }),
      makeThemeRecord({ slug: "archived-slug", status: "archived" }),
    ];

    // Act
    const publicTheme = maybePublicThemeEntryBySlug("public-slug", themes);
    const maybeDraftTheme = maybePublicThemeEntryBySlug("draft-slug", themes);
    const maybeHiddenTheme = maybePublicThemeEntryBySlug("hidden-slug", themes);
    const maybeUnsupportedTheme = maybePublicThemeEntryBySlug("unsupported-slug", themes);
    const maybeArchivedTheme = maybePublicThemeEntryBySlug("archived-slug", themes);
    const maybeUnknownTheme = maybePublicThemeEntryBySlug("unknown-slug", themes);

    // Assert
    expect(publicTheme?.slug).toBe("public-slug");
    expect(maybeDraftTheme).toBeNull();
    expect(maybeHiddenTheme).toBeNull();
    expect(maybeUnsupportedTheme).toBeNull();
    expect(maybeArchivedTheme).toBeNull();
    expect(maybeUnknownTheme).toBeNull();
  });

  it("derives theme detail paths and public theme detail route strings", () => {
    // Arrange
    const publicTheme = makeThemeRecord({
      slug: "public-slug",
      status: "public",
      displayOrder: 20,
    });
    const draftTheme = makeThemeRecord({
      slug: "draft-slug",
      status: "draft",
      displayOrder: 10,
    });

    // Act
    const path = themeDetailPath(publicTheme);
    const routes = themeDetailRoutes([draftTheme, publicTheme]);

    // Assert
    expect(path).toBe("/themes/public-slug");
    expect(routes).toEqual(["/themes/public-slug"]);
    expect(themeDetailPath({ slug: "agentic-engineering" })).toBe("/themes/agentic-engineering");
    expect(themeDetailRoutes()).toEqual(["/themes/agentic-engineering", "/themes/open-identity"]);
  });

  it("resolves related selected project detail page records only", () => {
    // Arrange
    const theme = makeThemeRecord({
      relatedProjectSlugs: ["openlinks", "open-bitcoin", "unknown-project"],
    });

    // Act
    const projectSlugs = relatedProjectDetailPageProjectsForTheme(theme).map(
      (project) => project.slug,
    );
    const defaultProjectSlugs = relatedProjectDetailPageProjectsForTheme(curatedThemes[0]).map(
      (project) => project.slug,
    );

    // Assert
    expect(projectSlugs).toEqual(["openlinks"]);
    expect(defaultProjectSlugs).toEqual(["opencode-cloud", "free-the-world"]);
  });

  it("resolves public writing records only", () => {
    // Arrange
    const theme = makeThemeRecord({
      relatedWritingSlugs: [
        "published-writing",
        "draft-writing",
        "hidden-writing",
        "archived-writing",
        "unknown-writing",
      ],
    });
    const entries = [
      makeWritingEntry({ slug: "published-writing", status: "published" }),
      makeWritingEntry({ slug: "draft-writing", status: "draft" }),
      makeWritingEntry({ slug: "hidden-writing", status: "hidden" }),
      makeWritingEntry({ slug: "archived-writing", status: "archived" }),
    ];

    // Act
    const writingSlugs = relatedWritingEntriesForTheme(theme, entries).map((entry) => entry.slug);
    const defaultWritingSlugs = relatedWritingEntriesForTheme(curatedThemes[0]).map(
      (entry) => entry.slug,
    );

    // Assert
    expect(writingSlugs).toEqual(["published-writing"]);
    expect(defaultWritingSlugs).toEqual(["agentic-engineering-workflows"]);
  });
});

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

function makeWritingEntry(overrides: Partial<WritingEntry> = {}): WritingEntry {
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
