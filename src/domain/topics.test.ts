import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { ProjectStory } from "./projects";
import type { ThemeRecord } from "./themes";
import {
  canonicalTopicsForLabels,
  curatedTopics,
  maybePublicTopicBySlug,
  maybeTopicRecordForLabel,
  publicContentReferences,
  publicTopics,
  type TopicRecord,
  topicDetailPath,
} from "./topics";
import type { WritingEntry } from "./writing";

describe("canonical topic registry", () => {
  it("returns canonical public topics with references in display order", () => {
    // Arrange
    const expectedSlugs = [
      "ai",
      "agentic-engineering",
      "bitcoin",
      "cryptography",
      "design-systems",
      "developer-tooling",
      "finance",
      "identity",
      "math",
      "open-systems",
      "open-web",
      "solidjs",
      "web-experiments",
    ];

    // Act
    const topics = publicTopics();

    // Assert
    expect(topics.map((topic) => topic.slug)).toEqual(expectedSlugs);
    expect(topics.every((topic) => topic.references.length > 0)).toBe(true);
  });

  it("normalizes labels and aliases to canonical topic records", () => {
    // Arrange
    const labels = ["ai", "AI", "developer-tools", "Open identity", "missing-topic"];

    // Act
    const maybeTopics = labels.map((label) => maybeTopicRecordForLabel(label));

    // Assert
    expect(maybeTopics.map((topic) => topic?.slug ?? null)).toEqual([
      "ai",
      "ai",
      "developer-tooling",
      "identity",
      null,
    ]);
  });

  it("derives canonical topics for labels without duplicating aliases", () => {
    // Arrange
    const labels = ["AI", "ai", "developer-tools", "Developer tooling", "unknown"];

    // Act
    const topics = canonicalTopicsForLabels(labels);

    // Assert
    expect(topics.map((topic) => topic.slug)).toEqual(["ai", "developer-tooling"]);
  });

  it("derives topic detail paths from canonical slugs", () => {
    // Arrange
    const topic = { slug: "agentic-engineering" };

    // Act
    const path = topicDetailPath(topic);

    // Assert
    expect(path).toBe("/topics/agentic-engineering");
  });
});

describe("public content references", () => {
  it("filters hidden, draft, archived, unsupported, excluded, and unselected-looking content", () => {
    // Arrange
    const publicProject = makeProjectStory({
      slug: "public-project",
      displayOrder: 30,
      themes: ["AI"],
      tags: ["developer-tools"],
    });
    const hiddenProject = makeProjectStory({
      slug: "hidden-project",
      placement: "hidden",
      status: "hidden",
      displayOrder: 10,
      themes: ["AI"],
    });
    const archivedProject = makeProjectStory({
      slug: "selected-looking-archived",
      status: "archived",
      maturity: "archived",
      displayOrder: 20,
      themes: ["Bitcoin"],
    });
    const excludedProject = makeProjectStory({
      slug: "excluded-project",
      tier: "excluded",
      displayOrder: 40,
      themes: ["Open web"],
    });
    const publicWriting = makeWritingEntry({
      slug: "public-writing",
      status: "published",
      displayOrder: 15,
      topics: ["Open web"],
      tags: ["identity"],
    });
    const draftWriting = makeWritingEntry({
      slug: "draft-writing",
      status: "draft",
      displayOrder: 5,
      topics: ["AI"],
    });
    const hiddenWriting = makeWritingEntry({
      slug: "hidden-writing",
      status: "hidden",
      displayOrder: 6,
      topics: ["AI"],
    });
    const archivedWriting = makeWritingEntry({
      slug: "archived-writing",
      status: "archived",
      displayOrder: 7,
      topics: ["AI"],
    });
    const publicTheme = makeThemeRecord({
      slug: "public-theme",
      status: "public",
      displayOrder: 25,
      title: "Agentic engineering",
    });
    const unsupportedTheme = makeThemeRecord({
      slug: "unsupported-theme",
      status: "unsupported",
      displayOrder: 8,
      title: "AI",
    });
    const archivedTheme = makeThemeRecord({
      slug: "archived-theme",
      status: "archived",
      displayOrder: 9,
      title: "Bitcoin",
    });

    // Act
    const references = publicContentReferences({
      projects: [hiddenProject, archivedProject, publicProject, excludedProject],
      writingEntries: [draftWriting, hiddenWriting, archivedWriting, publicWriting],
      themes: [unsupportedTheme, archivedTheme, publicTheme],
    });

    // Assert
    expect(references.map((reference) => `${reference.kind}:${reference.slug}`)).toEqual([
      "writing:public-writing",
      "theme:public-theme",
      "project:public-project",
    ]);
  });

  it("exposes only safe public reference fields and facets", () => {
    // Arrange
    const project = makeProjectStory({ slug: "safe-project", themes: ["AI"] });
    const writing = makeWritingEntry({ slug: "safe-writing", topics: ["Open web"] });
    const theme = makeThemeRecord({ slug: "safe-theme", title: "Open identity" });

    // Act
    const references = publicContentReferences({
      projects: [project],
      writingEntries: [writing],
      themes: [theme],
    });

    // Assert
    expect(references).toEqual([
      expect.objectContaining({
        kind: "project",
        slug: "safe-project",
        projectStatus: "building",
        projectSourceType: "original",
      }),
      expect.objectContaining({
        kind: "theme",
        slug: "safe-theme",
        themeStatus: "public",
      }),
      expect.objectContaining({
        kind: "writing",
        slug: "safe-writing",
        writingKind: "note",
        maybePublishedOn: "2026-06-03",
      }),
    ]);
    expect(references.flatMap((reference) => Object.keys(reference))).not.toEqual(
      expect.arrayContaining(["reason", "statusReason", "hidden", "draft", "archived"]),
    );
  });

  it("sorts references by display order, kind, and slug", () => {
    // Arrange
    const projects = [
      makeProjectStory({ slug: "z-project", displayOrder: 10, themes: ["AI"] }),
      makeProjectStory({ slug: "a-project", displayOrder: 10, themes: ["AI"] }),
    ];
    const writingEntries = [
      makeWritingEntry({ slug: "a-writing", displayOrder: 10, topics: ["AI"] }),
    ];
    const themes = [makeThemeRecord({ slug: "m-theme", displayOrder: 10, title: "AI" })];

    // Act
    const references = publicContentReferences({ projects, writingEntries, themes });

    // Assert
    expect(references.map((reference) => `${reference.kind}:${reference.slug}`)).toEqual([
      "project:a-project",
      "project:z-project",
      "theme:m-theme",
      "writing:a-writing",
    ]);
  });
});

describe("public topic lookup", () => {
  it("returns null for missing, malformed, and unreferenced public topics", () => {
    // Arrange
    const unreferencedTopic: TopicRecord = {
      slug: "unreferenced-topic",
      label: "Unreferenced topic",
      aliases: [],
      displayOrder: 999,
    };
    const sources = {
      projects: [],
      writingEntries: [],
      themes: [],
      topics: [...curatedTopics, unreferencedTopic],
    };

    // Act
    const maybeMissingTopic = maybePublicTopicBySlug("missing-topic", sources);
    const maybeMalformedTopic = maybePublicTopicBySlug("../ai", sources);
    const maybeUnreferencedTopic = maybePublicTopicBySlug("unreferenced-topic", sources);

    // Assert
    expect(maybeMissingTopic).toBeNull();
    expect(maybeMalformedTopic).toBeNull();
    expect(maybeUnreferencedTopic).toBeNull();
  });

  it("returns a public topic envelope without diagnostic fields", () => {
    // Arrange
    const topicSlug = "ai";

    // Act
    const maybeTopic = maybePublicTopicBySlug(topicSlug);

    // Assert
    expect(maybeTopic).toMatchObject({
      slug: "ai",
      label: "AI",
      canonicalPath: "/topics/ai",
    });
    expect(maybeTopic?.references.length).toBeGreaterThan(0);
    expect(Object.keys(maybeTopic ?? {})).not.toEqual(
      expect.arrayContaining(["reason", "statusReason", "hiddenReason", "draftReason"]),
    );
  });

  it("sorts canonical public topics deterministically for fixture sources", () => {
    // Arrange
    const topics: readonly TopicRecord[] = [
      { slug: "z-topic", label: "Z topic", aliases: [], displayOrder: 20 },
      { slug: "beta-topic", label: "Beta topic", aliases: ["Beta"], displayOrder: 10 },
      { slug: "alpha-topic", label: "Alpha topic", aliases: ["Alpha"], displayOrder: 10 },
    ];
    const projects = [
      makeProjectStory({
        slug: "topic-source",
        themes: ["Z topic", "Beta", "Alpha"],
        tags: [],
      }),
    ];

    // Act
    const topicsWithReferences = publicTopics({ projects, writingEntries: [], themes: [], topics });

    // Assert
    expect(topicsWithReferences.map((topic) => topic.slug)).toEqual([
      "alpha-topic",
      "beta-topic",
      "z-topic",
    ]);
  });
});

describe("topic helper scope", () => {
  it("stays free of runtime content, route, feed, browser, and social-preview wiring", () => {
    // Arrange
    const source = readFileSync("src/domain/topics.ts", "utf8");

    // Act
    const forbiddenRuntimeMatches = source.match(
      /github|cms|search|feed|\.\/routes|social-preview|playwright|browser/i,
    );

    // Assert
    expect(forbiddenRuntimeMatches).toBeNull();
  });
});

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
    themes: ["AI"],
    tags: ["ai"],
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
    curationReason: "Included for topic helper tests.",
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

function makeThemeRecord(overrides: Partial<ThemeRecord> = {}): ThemeRecord {
  return {
    slug: "base-theme",
    title: "AI",
    summary: "Base summary for a theme path.",
    status: "public",
    displayOrder: 10,
    audience: "Builders evaluating a test theme path.",
    proofPoints: ["A concrete proof point for the theme path."],
    collaborationAngle: "A practical collaboration angle for the theme path.",
    relatedProjectSlugs: ["base-project"],
    relatedWritingSlugs: ["base-writing-entry"],
    ...overrides,
  };
}
