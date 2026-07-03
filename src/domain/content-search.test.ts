import { describe, expect, it } from "vitest";
import {
  CONTENT_SEARCH_WEIGHTS,
  contentFacetGroupsForKind,
  normalizeContentSearchQuery,
  searchContentReferences,
} from "./content-search";
import {
  publicContentReferences,
  type PublicContentReference,
  type TopicRecord,
  type TopicSourceLabel,
} from "./topics";

const topicAi: TopicRecord = {
  slug: "ai",
  label: "AI",
  aliases: ["ai"],
  displayOrder: 10,
};

const topicOpenWeb: TopicRecord = {
  slug: "open-web",
  label: "Open web",
  aliases: ["open-web"],
  displayOrder: 20,
};

const topicConcept: TopicRecord = {
  slug: "concept",
  label: "Concept",
  aliases: ["concept"],
  displayOrder: 30,
};

describe("content search query normalization", () => {
  it("normalizes punctuation, case, and whitespace into lowercase tokens", () => {
    // Arrange
    const query = "  Open-Web, AI!!  ";

    // Act
    const tokens = normalizeContentSearchQuery(query);

    // Assert
    expect(tokens).toEqual(["open", "web", "ai"]);
  });
});

describe("content search facets", () => {
  it("derives project topic, tier, status, and source facet groups", () => {
    // Arrange
    const references = [
      projectReference({
        slug: "original-ai",
        canonicalTopics: [topicAi],
        projectTier: "flagship",
        projectStatus: "building",
        projectSourceType: "original",
      }),
      projectReference({
        slug: "fork-open-web",
        canonicalTopics: [topicOpenWeb],
        projectTier: "supporting",
        projectStatus: "maintained",
        projectSourceType: "fork",
      }),
      projectReference({
        slug: "playground-ai",
        canonicalTopics: [topicAi],
        projectTier: "lab",
        projectStatus: "paused",
        projectSourceType: "playground",
      }),
    ];

    // Act
    const groups = contentFacetGroupsForKind("project", references);

    // Assert
    expect(groups.map(({ id, label }) => ({ id, label }))).toEqual([
      { id: "topics", label: "Topics" },
      { id: "project-tier", label: "Tier" },
      { id: "project-status", label: "Status" },
      { id: "project-source", label: "Source" },
    ]);
    expect(facetIdsForGroup(groups, "topics")).toEqual(["topic:ai", "topic:open-web"]);
    expect(facetIdsForGroup(groups, "project-tier")).toEqual([
      "project-tier:flagship",
      "project-tier:supporting",
      "project-tier:lab",
    ]);
    expect(facetIdsForGroup(groups, "project-status")).toEqual([
      "project-status:building",
      "project-status:maintained",
      "project-status:paused",
    ]);
    expect(facetIdsForGroup(groups, "project-source")).toEqual([
      "project-source:original",
      "project-source:fork",
      "project-source:playground",
    ]);
    expect(facetForId(groups, "topic:ai")?.count).toBe(2);
  });

  it("humanizes project source labels without leaking raw taxonomy copy", () => {
    // Arrange
    const references = [
      projectReference({ slug: "original", projectSourceType: "original" }),
      projectReference({ slug: "fork", projectSourceType: "fork" }),
      projectReference({ slug: "playground", projectSourceType: "playground" }),
    ];

    // Act
    const sourceLabels = labelsForGroup(contentFacetGroupsForKind("project", references), "project-source");

    // Assert
    expect(sourceLabels).toEqual([
      "Original",
      "Fork / promoted work",
      "Prototype / playground",
    ]);
    expect(sourceLabels).not.toEqual(expect.arrayContaining(["original", "fork", "playground"]));
  });

  it("derives writing kind, topic, tag, and year facet groups", () => {
    // Arrange
    const references = [
      writingReference({
        slug: "owned-surface-note",
        canonicalTopics: [topicOpenWeb],
        writingKind: "note",
        maybePublishedOn: "2026-06-03",
        maybeUpdatedOn: "2026-06-04",
        sourceLabels: [
          sourceLabel("writing-topic", "Open web", "writing", "owned-surface-note"),
          sourceLabel("writing-tag", "identity", "writing", "owned-surface-note"),
        ],
      }),
      writingReference({
        slug: "ai-essay",
        canonicalTopics: [topicAi],
        writingKind: "essay",
        maybePublishedOn: "2025-12-01",
        sourceLabels: [
          sourceLabel("writing-topic", "AI", "writing", "ai-essay"),
          sourceLabel("writing-tag", "open-web", "writing", "ai-essay"),
        ],
      }),
    ];

    // Act
    const groups = contentFacetGroupsForKind("writing", references);

    // Assert
    expect(groups.map(({ id, label }) => ({ id, label }))).toEqual([
      { id: "writing-kind", label: "Kind" },
      { id: "topics", label: "Topics" },
      { id: "writing-tag", label: "Tags" },
      { id: "writing-year", label: "Year" },
    ]);
    expect(facetIdsForGroup(groups, "writing-kind")).toEqual([
      "writing-kind:note",
      "writing-kind:essay",
    ]);
    expect(facetIdsForGroup(groups, "topics")).toEqual(["topic:open-web", "topic:ai"]);
    expect(facetForId(groups, "writing-tag:identity")).toMatchObject({
      id: "writing-tag:identity",
      label: "identity",
    });
    expect(facetForId(groups, "writing-year:published:2026")).toMatchObject({
      id: "writing-year:published:2026",
      label: "Published 2026",
    });
    expect(facetForId(groups, "writing-year:updated:2026")).toMatchObject({
      id: "writing-year:updated:2026",
      label: "Updated 2026",
    });
  });
});

describe("content search filtering", () => {
  it("matches selected facets with OR inside a group and AND across groups", () => {
    // Arrange
    const references = [
      projectReference({
        slug: "ai-flagship-building",
        canonicalTopics: [topicAi],
        projectTier: "flagship",
        projectStatus: "building",
      }),
      projectReference({
        slug: "web-flagship-building",
        canonicalTopics: [topicOpenWeb],
        projectTier: "flagship",
        projectStatus: "building",
      }),
      projectReference({
        slug: "ai-lab-building",
        canonicalTopics: [topicAi],
        projectTier: "lab",
        projectStatus: "building",
      }),
      projectReference({
        slug: "ai-flagship-maintained",
        canonicalTopics: [topicAi],
        projectTier: "flagship",
        projectStatus: "maintained",
      }),
    ];

    // Act
    const summary = searchContentReferences({
      references,
      kind: "project",
      selectedFacetIds: [
        "topic:ai",
        "topic:open-web",
        "project-tier:flagship",
        "project-status:building",
      ],
    });

    // Assert
    expect(summary.results.map(({ reference }) => reference.slug)).toEqual([
      "ai-flagship-building",
      "web-flagship-building",
    ]);
    expect(summary.active).toBe(true);
    expect(summary.totalCount).toBe(4);
    expect(summary.visibleCount).toBe(2);
  });

  it("orders query matches by public field weight", () => {
    // Arrange
    const references = [
      projectReference({
        slug: "summary-match",
        title: "Summary only",
        summary: "Concept appears only in the summary.",
        displayOrder: 10,
      }),
      projectReference({
        slug: "source-label-match",
        title: "Source label only",
        sourceLabels: [sourceLabel("project-tag", "Concept tag", "project", "source-label-match")],
        displayOrder: 20,
      }),
      projectReference({
        slug: "facet-match",
        title: "Facet only",
        projectSourceType: "concept",
        displayOrder: 30,
      }),
      projectReference({
        slug: "canonical-topic-match",
        title: "Topic only",
        canonicalTopics: [topicConcept],
        displayOrder: 40,
      }),
      projectReference({
        slug: "title-match",
        title: "Concept title",
        displayOrder: 50,
      }),
    ];

    // Act
    const summary = searchContentReferences({ references, kind: "project", query: "concept" });

    // Assert
    expect(summary.results.map(({ reference, score }) => [reference.slug, score])).toEqual([
      ["title-match", CONTENT_SEARCH_WEIGHTS.title],
      ["canonical-topic-match", CONTENT_SEARCH_WEIGHTS.canonicalTopic],
      ["facet-match", CONTENT_SEARCH_WEIGHTS.publicFacet],
      ["source-label-match", CONTENT_SEARCH_WEIGHTS.sourceLabel],
      ["summary-match", CONTENT_SEARCH_WEIGHTS.summary],
    ]);
  });

  it("tie-breaks equal-score results by display order and slug", () => {
    // Arrange
    const references = [
      projectReference({ slug: "z-match", title: "AI match", displayOrder: 20 }),
      projectReference({ slug: "b-match", title: "AI match", displayOrder: 10 }),
      projectReference({ slug: "a-match", title: "AI match", displayOrder: 10 }),
    ];

    // Act
    const summary = searchContentReferences({ references, kind: "project", query: "ai" });

    // Assert
    expect(summary.results.map(({ reference }) => reference.slug)).toEqual([
      "a-match",
      "b-match",
      "z-match",
    ]);
  });

  it("returns all references in public display order when inactive", () => {
    // Arrange
    const references = [
      projectReference({ slug: "late-project", displayOrder: 30 }),
      writingReference({ slug: "wrong-kind", displayOrder: 5 }),
      projectReference({ slug: "early-project", displayOrder: 10 }),
      projectReference({ slug: "middle-project", displayOrder: 20 }),
    ];

    // Act
    const summary = searchContentReferences({ references, kind: "project" });

    // Assert
    expect(summary.active).toBe(false);
    expect(summary.totalCount).toBe(3);
    expect(summary.visibleCount).toBe(3);
    expect(summary.results.map(({ reference, score }) => [reference.slug, score])).toEqual([
      ["early-project", 0],
      ["middle-project", 0],
      ["late-project", 0],
    ]);
  });

  it("uses public content references by default", () => {
    // Arrange
    const expectedWritingSlugs = publicContentReferences()
      .filter((reference) => reference.kind === "writing")
      .map((reference) => reference.slug);

    // Act
    const summary = searchContentReferences({ kind: "writing" });
    const facetGroups = contentFacetGroupsForKind("writing");

    // Assert
    expect(summary.results.map(({ reference }) => reference.slug)).toEqual(expectedWritingSlugs);
    expect(summary.totalCount).toBe(expectedWritingSlugs.length);
    expect(facetGroups.map((group) => group.id)).toEqual([
      "writing-kind",
      "topics",
      "writing-tag",
      "writing-year",
    ]);
  });
});

function projectReference(
  overrides: Partial<Extract<PublicContentReference, { kind: "project" }>> = {},
): Extract<PublicContentReference, { kind: "project" }> {
  const slug = overrides.slug ?? "base-project";

  return {
    kind: "project",
    slug,
    title: "Base project",
    summary: "Base project summary.",
    canonicalPath: `/projects/${slug}`,
    canonicalTopics: [topicAi],
    sourceLabels: [sourceLabel("project-theme", "AI", "project", slug)],
    displayOrder: 10,
    projectTier: "flagship",
    projectStatus: "building",
    projectSourceType: "original",
    ...overrides,
  };
}

function writingReference(
  overrides: Partial<Extract<PublicContentReference, { kind: "writing" }>> = {},
): Extract<PublicContentReference, { kind: "writing" }> {
  const slug = overrides.slug ?? "base-writing";

  return {
    kind: "writing",
    slug,
    title: "Base writing",
    summary: "Base writing summary.",
    canonicalPath: `/writing/${slug}`,
    canonicalTopics: [topicAi],
    sourceLabels: [
      sourceLabel("writing-topic", "AI", "writing", slug),
      sourceLabel("writing-tag", "ai", "writing", slug),
    ],
    displayOrder: 10,
    writingKind: "note",
    maybePublishedOn: "2026-06-03",
    ...overrides,
  };
}

function sourceLabel(
  kind: TopicSourceLabel["kind"],
  label: string,
  sourceKind: PublicContentReference["kind"],
  sourceSlug: string,
): TopicSourceLabel {
  return {
    kind,
    label,
    sourceKind,
    sourceSlug,
    sourceTitle: sourceSlug,
  };
}

function facetIdsForGroup(
  groups: ReturnType<typeof contentFacetGroupsForKind>,
  groupId: string,
): readonly string[] {
  return groups.find((group) => group.id === groupId)?.facets.map((facet) => facet.id) ?? [];
}

function labelsForGroup(
  groups: ReturnType<typeof contentFacetGroupsForKind>,
  groupId: string,
): readonly string[] {
  return groups.find((group) => group.id === groupId)?.facets.map((facet) => facet.label) ?? [];
}

function facetForId(
  groups: ReturnType<typeof contentFacetGroupsForKind>,
  facetId: string,
):
  | {
      id: string;
      label: string;
      count: number;
    }
  | undefined {
  return groups.flatMap((group) => group.facets).find((facet) => facet.id === facetId);
}
