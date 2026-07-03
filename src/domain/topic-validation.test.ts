import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { ProjectStory } from "./projects";
import {
  assertValidCuratedTopics,
  topicCurationErrors,
  topicCurationWarnings,
  validateTopicRecord,
  validateTopicRegistry,
} from "./topic-validation";
import type { PublicContentReference, TopicRecord, TopicReferenceSources } from "./topics";
import { curatedTopics } from "./topics";

describe("topic record validation", () => {
  it("rejects duplicate and malformed topic records with stable issue codes", () => {
    // Arrange
    const topics = [
      makeTopicRecord({ slug: "valid-topic", displayOrder: 10 }),
      makeTopicRecord({ slug: "valid-topic", displayOrder: 20 }),
      makeTopicRecord({ slug: "Bad Slug", displayOrder: 20 }),
    ];

    // Act
    const result = validateTopicRegistry(topics, emptySources());

    // Assert
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          severity: "error",
          code: "duplicate_topic_slug",
          slug: "valid-topic",
        }),
        expect.objectContaining({
          severity: "error",
          code: "invalid_topic_slug",
          slug: "Bad Slug",
        }),
        expect.objectContaining({
          severity: "error",
          code: "duplicate_topic_display_order",
          slug: "Bad Slug",
        }),
      ]),
    );
  });

  it("rejects empty topic labels and aliases", () => {
    // Arrange
    const topic = makeTopicRecord({
      slug: "empty-labels",
      label: " ",
      aliases: ["valid", " "],
    });

    // Act
    const issues = validateTopicRecord(topic);

    // Assert
    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "empty_topic_label",
          slug: "empty-labels",
          maybeLabel: " ",
        }),
      ]),
    );
  });

  it("detects colliding normalized slugs, labels, and aliases", () => {
    // Arrange
    const topics = [
      makeTopicRecord({
        slug: "ai",
        label: "AI",
        aliases: [],
        displayOrder: 10,
      }),
      makeTopicRecord({
        slug: "agentic-ai",
        label: "Agentic AI",
        aliases: ["ai"],
        displayOrder: 20,
      }),
    ];

    // Act
    const result = validateTopicRegistry(topics, emptySources());

    // Assert
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        severity: "error",
        code: "colliding_topic_label",
        slug: "agentic-ai",
        maybeTopicSlug: "ai",
        maybeLabel: "ai",
      }),
    );
  });
});

describe("topic source and reference validation", () => {
  it("rejects unsupported source kinds and unmapped public labels", () => {
    // Arrange
    const topic = makeTopicRecord({ slug: "ai", label: "AI", aliases: [], displayOrder: 10 });
    const project = makeProjectStory({ slug: "public-project", themes: ["Unknown label"] });
    const sources = {
      projects: [project],
      writingEntries: [],
      themes: [],
      sourceLabels: [
        {
          kind: "unsupported-kind",
          label: "AI",
          sourceKind: "project",
          sourceSlug: "public-project",
          sourceTitle: "Public project",
        },
      ],
    } as unknown as TopicReferenceSources;

    // Act
    const result = validateTopicRegistry([topic], sources);

    // Assert
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "unsupported_topic_source_kind",
          maybeSourceKind: "unsupported-kind",
          maybeSourceSlug: "public-project",
        }),
        expect.objectContaining({
          code: "unmapped_public_label",
          maybeLabel: "Unknown label",
          maybeSourceSlug: "public-project",
        }),
      ]),
    );
  });

  it("rejects public references without canonical topics", () => {
    // Arrange
    const topics = [makeTopicRecord({ slug: "ai", label: "AI", aliases: [], displayOrder: 10 })];
    const project = makeProjectStory({
      slug: "unmapped-project",
      themes: ["Unmapped topic"],
      tags: [],
    });

    // Act
    const result = validateTopicRegistry(topics, {
      projects: [project],
      writingEntries: [],
      themes: [],
    });

    // Assert
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "public_reference_without_topic",
          maybeReferenceKind: "project",
          maybeReferenceSlug: "unmapped-project",
        }),
      ]),
    );
  });

  it("rejects duplicate public references by kind and canonical path", () => {
    // Arrange
    const topic = makeTopicRecord({ slug: "ai", label: "AI", aliases: [], displayOrder: 10 });
    const reference = makeProjectReference({ slug: "duplicate-project", canonicalTopics: [topic] });
    const duplicateReference = makeProjectReference({
      slug: "duplicate-project",
      canonicalPath: reference.canonicalPath,
      canonicalTopics: [topic],
    });
    const sources = {
      projects: [],
      writingEntries: [],
      themes: [],
      publicReferences: [reference, duplicateReference],
    } as unknown as TopicReferenceSources;

    // Act
    const result = validateTopicRegistry([topic], sources);

    // Assert
    expect(result.errors.filter((issue) => issue.code === "duplicate_public_reference")).toEqual([
      expect.objectContaining({
        maybeReferenceKind: "project",
        maybeReferenceSlug: "duplicate-project",
      }),
      expect.objectContaining({
        maybeCanonicalPath: "/projects/duplicate-project",
      }),
    ]);
  });

  it("rejects non-public reference fixtures that are absent from public selector output", () => {
    // Arrange
    const topic = makeTopicRecord({ slug: "ai", label: "AI", aliases: [], displayOrder: 10 });
    const hiddenProject = makeProjectStory({
      slug: "hidden-project",
      status: "hidden",
      placement: "hidden",
      includeInProjectIndex: false,
    });
    const hiddenReference = makeProjectReference({
      slug: "hidden-project",
      canonicalTopics: [topic],
    });
    const sources = {
      projects: [hiddenProject],
      writingEntries: [],
      themes: [],
      publicReferences: [hiddenReference],
    } as unknown as TopicReferenceSources;

    // Act
    const result = validateTopicRegistry([topic], sources);

    // Assert
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        code: "non_public_reference",
        maybeReferenceKind: "project",
        maybeReferenceSlug: "hidden-project",
        maybeCanonicalPath: "/projects/hidden-project",
      }),
    );
  });
});

describe("checked-in topic registry validation", () => {
  it("accepts the checked-in curated topic registry without hard errors", () => {
    // Arrange
    const topics = curatedTopics;

    // Act
    const result = validateTopicRegistry(topics);

    // Assert
    expect(result.errors).toHaveLength(0);
  });

  it("returns error and warning slices from registry validation", () => {
    // Arrange
    const topics = [makeTopicRecord({ slug: "Bad Slug" })];

    // Act
    const errors = topicCurationErrors(topics, emptySources());
    const warnings = topicCurationWarnings(topics, emptySources());

    // Assert
    expect(errors).toEqual([
      expect.objectContaining({
        severity: "error",
        code: "invalid_topic_slug",
        slug: "Bad Slug",
      }),
    ]);
    expect(warnings).toEqual([]);
  });

  it("throws formatted topic validation errors", () => {
    // Arrange
    const topics = [makeTopicRecord({ slug: "Bad Slug" })];

    // Act
    const act = () => assertValidCuratedTopics(topics, emptySources());

    // Assert
    expect(act).toThrow(/invalid_topic_slug: Bad Slug:/);
  });
});

describe("aggregate curation gate integration", () => {
  it("wires topic validation into verify-curation warning and error aggregation", () => {
    // Arrange
    const source = readFileSync("scripts/verify-curation.ts", "utf8");

    // Act
    const hasTopicRegistryImport = source.includes("curatedTopics");
    const hasTopicValidatorImport = source.includes("validateTopicRegistry");
    const hasTopicResult = source.includes("const topicResult = validateTopicRegistry");
    const hasWarningAggregation = source.includes("topicResult.warnings.length");
    const hasErrorAggregation = source.includes("topicResult.errors.length");
    const hasTopicSuccessCount = source.includes(`$${"{curatedTopics.length}"} topics`);

    // Assert
    expect({
      hasTopicRegistryImport,
      hasTopicValidatorImport,
      hasTopicResult,
      hasWarningAggregation,
      hasErrorAggregation,
      hasTopicSuccessCount,
    }).toEqual({
      hasTopicRegistryImport: true,
      hasTopicValidatorImport: true,
      hasTopicResult: true,
      hasWarningAggregation: true,
      hasErrorAggregation: true,
      hasTopicSuccessCount: true,
    });
  });
});

function emptySources(): TopicReferenceSources {
  return { projects: [], writingEntries: [], themes: [] };
}

function makeTopicRecord(overrides: Partial<TopicRecord> = {}): TopicRecord {
  return {
    slug: "test-topic",
    label: "Test topic",
    aliases: ["testing"],
    displayOrder: 999,
    ...overrides,
  };
}

function makeProjectReference(
  overrides: Partial<Extract<PublicContentReference, { kind: "project" }>> = {},
): Extract<PublicContentReference, { kind: "project" }> {
  const topic = makeTopicRecord({ slug: "ai", label: "AI", aliases: [], displayOrder: 10 });
  const slug = overrides.slug ?? "test-project";

  return {
    kind: "project",
    slug,
    title: "Test project",
    summary: "A test project reference.",
    canonicalPath: `/projects/${slug}`,
    canonicalTopics: [topic],
    sourceLabels: [
      {
        kind: "project-theme",
        label: "AI",
        sourceKind: "project",
        sourceSlug: slug,
        sourceTitle: "Test project",
      },
    ],
    displayOrder: 10,
    projectTier: "flagship",
    projectStatus: "building",
    projectSourceType: "original",
    ...overrides,
  };
}

function makeProjectStory(overrides: Partial<ProjectStory> = {}): ProjectStory {
  return {
    slug: "test-project",
    name: "Test project",
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
    oneLine: "Test project summary.",
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
    curationReason: "Included for topic validation tests.",
    originalWork: { kind: "original" },
    links: [{ label: "Source", href: "https://github.com/pRizz/test-project", kind: "repo" }],
    ...overrides,
  };
}
