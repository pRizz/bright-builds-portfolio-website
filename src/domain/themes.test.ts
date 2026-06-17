import { describe, expect, it } from "vitest";
import type { ProjectStory } from "./projects";
import * as themeSurface from "./themes";
import {
  collaborationActionsForTheme,
  curatedThemes,
  maybePublicThemeEntryBySlug,
  publicThemeEntries,
  publicThemeEntriesForProject,
  publicThemeEntriesForWritingEntry,
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
      "publicThemeEntriesForProject",
      "publicThemeEntriesForWritingEntry",
      "collaborationActionsForTheme",
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

  it("returns only public themes for a project in display order", () => {
    // Arrange
    const project = { slug: "openlinks" };
    const themes = [
      makeThemeRecord({
        slug: "draft-theme",
        status: "draft",
        displayOrder: 1,
        relatedProjectSlugs: ["openlinks"],
      }),
      makeThemeRecord({
        slug: "public-later",
        status: "public",
        displayOrder: 30,
        relatedProjectSlugs: ["openlinks"],
      }),
      makeThemeRecord({
        slug: "public-unrelated",
        status: "public",
        displayOrder: 5,
        relatedProjectSlugs: ["free-the-world"],
      }),
      makeThemeRecord({
        slug: "public-earlier",
        status: "public",
        displayOrder: 20,
        relatedProjectSlugs: ["openlinks"],
      }),
      makeThemeRecord({
        slug: "hidden-theme",
        status: "hidden",
        displayOrder: 10,
        relatedProjectSlugs: ["openlinks"],
      }),
      makeThemeRecord({
        slug: "unsupported-theme",
        status: "unsupported",
        displayOrder: 40,
        relatedProjectSlugs: ["openlinks"],
      }),
      makeThemeRecord({
        slug: "archived-theme",
        status: "archived",
        displayOrder: 50,
        relatedProjectSlugs: ["openlinks"],
      }),
    ];

    // Act
    const publicSlugs = publicThemeEntriesForProject(project, themes).map((theme) => theme.slug);

    // Assert
    expect(publicSlugs).toEqual(["public-earlier", "public-later"]);
  });

  it("returns only public themes for a writing entry in display order", () => {
    // Arrange
    const entry = { slug: "portable-identity-and-owned-surfaces" };
    const themes = [
      makeThemeRecord({
        slug: "draft-theme",
        status: "draft",
        displayOrder: 1,
        relatedWritingSlugs: ["portable-identity-and-owned-surfaces"],
      }),
      makeThemeRecord({
        slug: "public-later",
        status: "public",
        displayOrder: 30,
        relatedWritingSlugs: ["portable-identity-and-owned-surfaces"],
      }),
      makeThemeRecord({
        slug: "public-unrelated",
        status: "public",
        displayOrder: 5,
        relatedWritingSlugs: ["agentic-engineering-workflows"],
      }),
      makeThemeRecord({
        slug: "public-earlier",
        status: "public",
        displayOrder: 20,
        relatedWritingSlugs: ["portable-identity-and-owned-surfaces"],
      }),
      makeThemeRecord({
        slug: "hidden-theme",
        status: "hidden",
        displayOrder: 10,
        relatedWritingSlugs: ["portable-identity-and-owned-surfaces"],
      }),
      makeThemeRecord({
        slug: "unsupported-theme",
        status: "unsupported",
        displayOrder: 40,
        relatedWritingSlugs: ["portable-identity-and-owned-surfaces"],
      }),
      makeThemeRecord({
        slug: "archived-theme",
        status: "archived",
        displayOrder: 50,
        relatedWritingSlugs: ["portable-identity-and-owned-surfaces"],
      }),
    ];

    // Act
    const publicSlugs = publicThemeEntriesForWritingEntry(entry, themes).map((theme) => theme.slug);

    // Assert
    expect(publicSlugs).toEqual(["public-earlier", "public-later"]);
  });

  it("returns no reciprocal themes for unreferenced project and writing records", () => {
    // Arrange
    const project = { slug: "unreferenced-project" };
    const entry = { slug: "unreferenced-writing" };
    const themes = [
      makeThemeRecord({
        slug: "public-theme",
        status: "public",
        relatedProjectSlugs: ["openlinks"],
        relatedWritingSlugs: ["portable-identity-and-owned-surfaces"],
      }),
      makeThemeRecord({
        slug: "draft-theme",
        status: "draft",
        relatedProjectSlugs: ["unreferenced-project"],
        relatedWritingSlugs: ["unreferenced-writing"],
      }),
      makeThemeRecord({
        slug: "hidden-theme",
        status: "hidden",
        relatedProjectSlugs: ["unreferenced-project"],
        relatedWritingSlugs: ["unreferenced-writing"],
      }),
      makeThemeRecord({
        slug: "unsupported-theme",
        status: "unsupported",
        relatedProjectSlugs: ["unreferenced-project"],
        relatedWritingSlugs: ["unreferenced-writing"],
      }),
      makeThemeRecord({
        slug: "archived-theme",
        status: "archived",
        relatedProjectSlugs: ["unreferenced-project"],
        relatedWritingSlugs: ["unreferenced-writing"],
      }),
    ];

    // Act
    const projectThemes = publicThemeEntriesForProject(project, themes);
    const writingThemes = publicThemeEntriesForWritingEntry(entry, themes);

    // Assert
    expect(projectThemes).toEqual([]);
    expect(writingThemes).toEqual([]);
  });
});

describe("theme collaboration actions", () => {
  it("assembles collaboration actions in project story, source, live, and writing order", () => {
    // Arrange
    const theme = makeThemeRecord({
      relatedProjectSlugs: ["selected-project"],
      relatedWritingSlugs: ["related-note", "related-essay"],
    });
    const projects = [
      makeProjectStory({
        slug: "selected-project",
        links: [
          {
            label: "Source",
            href: "https://github.com/pRizz/selected-project",
            kind: "repo",
          },
          { label: "Live site", href: "https://selected.example/", kind: "live" },
        ],
      }),
    ];
    const entries = [
      makeWritingEntry({ slug: "related-note", kind: "note" }),
      makeWritingEntry({ slug: "related-essay", kind: "essay" }),
    ];

    // Act
    const actions = collaborationActionsForTheme(theme, projects, entries);

    // Assert
    expect(actions).toEqual([
      {
        kind: "project-story",
        label: "Project story",
        href: "/projects/selected-project",
        external: false,
        maybeProjectSlug: "selected-project",
      },
      {
        kind: "source",
        label: "Source",
        href: "https://github.com/pRizz/selected-project",
        external: true,
        maybeRel: "noopener noreferrer",
        maybeProjectSlug: "selected-project",
      },
      {
        kind: "live-surface",
        label: "Live surface",
        href: "https://selected.example/",
        external: true,
        maybeRel: "noopener noreferrer",
        maybeProjectSlug: "selected-project",
      },
      {
        kind: "writing",
        label: "Read note",
        href: "/writing/related-note",
        external: false,
        maybeWritingSlug: "related-note",
      },
      {
        kind: "writing",
        label: "Read essay",
        href: "/writing/related-essay",
        external: false,
        maybeWritingSlug: "related-essay",
      },
    ]);
  });

  it("does not add a generic OpenLinks profile action for unrelated themes", () => {
    // Arrange
    const agenticTheme = curatedThemes[0];
    const openIdentityTheme = curatedThemes[1];

    // Act
    const agenticActions = collaborationActionsForTheme(agenticTheme);
    const openIdentityActions = collaborationActionsForTheme(openIdentityTheme);
    const maybeOpenLinksLiveAction = openIdentityActions.find(
      (action) => action.href === "https://openlinks.us/",
    );

    // Assert
    expect(agenticActions.map((action) => action.href)).not.toContain("https://openlinks.us/");
    expect(agenticActions.map((action) => action.label)).not.toContain("OpenLinks profile");
    expect(maybeOpenLinksLiveAction).toMatchObject({
      kind: "live-surface",
      label: "Live surface",
      external: true,
      maybeRel: "noopener noreferrer",
      maybeProjectSlug: "openlinks",
    });
  });

  it("uses Contact path only when no project, source, live, or writing actions resolve", () => {
    // Arrange
    const theme = makeThemeRecord({
      relatedProjectSlugs: ["missing-project"],
      relatedWritingSlugs: ["missing-writing"],
    });

    // Act
    const actions = collaborationActionsForTheme(theme, [], []);

    // Assert
    expect(actions).toEqual([
      {
        kind: "contact-path",
        label: "Contact path",
        href: "/contact",
        external: false,
      },
    ]);
  });

  it("deduplicates collaboration actions by href while keeping the first action", () => {
    // Arrange
    const theme = makeThemeRecord({
      relatedProjectSlugs: ["duplicate-project"],
      relatedWritingSlugs: ["duplicate-writing"],
    });
    const projects = [
      makeProjectStory({
        slug: "duplicate-project",
        links: [
          { label: "Source", href: "https://duplicate.example/", kind: "repo" },
          { label: "Live site", href: "https://duplicate.example/", kind: "live" },
        ],
      }),
    ];
    const entries = [makeWritingEntry({ slug: "duplicate-writing" })];

    // Act
    const actions = collaborationActionsForTheme(theme, projects, entries);

    // Assert
    expect(actions.filter((action) => action.href === "https://duplicate.example/")).toEqual([
      {
        kind: "source",
        label: "Source",
        href: "https://duplicate.example/",
        external: true,
        maybeRel: "noopener noreferrer",
        maybeProjectSlug: "duplicate-project",
      },
    ]);
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

function makeProjectStory(overrides: Partial<ProjectStory> = {}): ProjectStory {
  return {
    slug: "base-project",
    name: "Base project",
    aliases: [],
    placement: "home",
    tier: "flagship",
    sourceType: "original",
    maturity: "active",
    status: "building",
    includeOnHome: true,
    includeInProjectIndex: true,
    displayOrder: 10,
    themes: ["Testing"],
    tags: ["test"],
    role: "Creator",
    oneLine: "Base project summary.",
    story: {
      problem: "A test project problem.",
      approach: "A test project approach.",
      whyItMatters: "A test project rationale.",
    },
    detail: {
      intro: "A selected project detail intro.",
      technicalShape: "A selected project technical shape.",
      proofPoints: ["A selected project proof point."],
      currentStatus: "Building.",
      collaborationAngle: "A selected project collaboration angle.",
    },
    curationReason: "Included for helper tests.",
    originalWork: { kind: "original" },
    links: [{ label: "Source", href: "https://github.com/pRizz/base-project", kind: "repo" }],
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
