import {
  type PublicContentReference,
  publicContentReferences,
  type TopicRecord,
  type TopicSourceLabel,
} from "./topics";

export type ContentSearchKind = "project" | "writing";

export type ContentFacetGroupId =
  | "topics"
  | "project-tier"
  | "project-status"
  | "project-source"
  | "writing-kind"
  | "writing-tag"
  | "writing-year";

export type ContentFacet = {
  id: string;
  groupId: ContentFacetGroupId;
  label: string;
  count: number;
};

export type ContentFacetGroup = {
  id: ContentFacetGroupId;
  label: string;
  facets: readonly ContentFacet[];
};

export type ContentSearchInput = {
  references?: readonly PublicContentReference[];
  kind: ContentSearchKind;
  query?: string;
  selectedFacetIds?: readonly string[];
};

export type ContentSearchResult = {
  reference: PublicContentReference;
  score: number;
  matchedFacetIds: readonly string[];
};

export type ContentSearchSummary = {
  active: boolean;
  totalCount: number;
  visibleCount: number;
  results: readonly ContentSearchResult[];
};

export const CONTENT_SEARCH_WEIGHTS = {
  title: 100,
  canonicalTopic: 70,
  publicFacet: 55,
  sourceLabel: 40,
  summary: 20,
} as const;

type ContentFacetDefinition = {
  id: string;
  groupId: ContentFacetGroupId;
  label: string;
};

type ContentFacetGroupDefinition = {
  id: ContentFacetGroupId;
  label: string;
};

const PROJECT_FACET_GROUPS = [
  { id: "topics", label: "Topics" },
  { id: "project-tier", label: "Tier" },
  { id: "project-status", label: "Status" },
  { id: "project-source", label: "Source" },
] as const satisfies readonly ContentFacetGroupDefinition[];

const WRITING_FACET_GROUPS = [
  { id: "writing-kind", label: "Kind" },
  { id: "topics", label: "Topics" },
  { id: "writing-tag", label: "Tags" },
  { id: "writing-year", label: "Year" },
] as const satisfies readonly ContentFacetGroupDefinition[];

const PROJECT_TIER_LABELS = {
  flagship: "Flagship",
  supporting: "Supporting",
  lab: "Lab / Prototype",
  archive: "Archive",
} as const;

const PROJECT_STATUS_LABELS = {
  building: "Building",
  maintained: "Maintained",
  paused: "Paused",
} as const;

const PROJECT_SOURCE_LABELS = {
  original: "Original",
  fork: "Fork / promoted work",
  repro: "Reproduction / reference",
  playground: "Prototype / playground",
  generated: "Generated experiment",
  profile: "Profile / identity",
  support: "Supporting infrastructure",
  concept: "Concept / proposal",
} as const;

const WRITING_KIND_LABELS = {
  note: "Note",
  essay: "Essay",
} as const;

export function normalizeContentSearchQuery(query: string): readonly string[] {
  return query
    .trim()
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

export function contentFacetGroupsForKind(
  kind: ContentSearchKind,
  references: readonly PublicContentReference[] = publicContentReferences(),
): readonly ContentFacetGroup[] {
  const groupDefinitions = facetGroupDefinitionsForKind(kind);
  const facetCounts = countFacets(references.filter((reference) => reference.kind === kind));

  return groupDefinitions.map((group) => ({
    id: group.id,
    label: group.label,
    facets: [...facetCounts.values()].filter((facet) => facet.groupId === group.id),
  }));
}

export function searchContentReferences(input: ContentSearchInput): ContentSearchSummary {
  const references = input.references ?? publicContentReferences();
  const kindReferences = references.filter((reference) => reference.kind === input.kind);
  const queryTokens = normalizeContentSearchQuery(input.query ?? "");
  const knownFacets = countFacets(kindReferences);
  const selectedFacetsByGroup = groupSelectedFacetIds(input.selectedFacetIds ?? [], knownFacets);
  const active = queryTokens.length > 0 || selectedFacetsByGroup.size > 0;
  const results = kindReferences.flatMap((reference) => {
    const referenceFacets = facetsForReference(reference);

    if (!matchesSelectedFacets(referenceFacets, selectedFacetsByGroup)) {
      return [];
    }

    const maybeScore = scoreReference(reference, referenceFacets, queryTokens);

    if (maybeScore === null) {
      return [];
    }

    return [
      {
        reference,
        score: maybeScore,
        matchedFacetIds: referenceFacets.map((facet) => facet.id),
      },
    ];
  });

  return {
    active,
    totalCount: kindReferences.length,
    visibleCount: results.length,
    results: results.sort(compareResults),
  };
}

function facetGroupDefinitionsForKind(
  kind: ContentSearchKind,
): readonly ContentFacetGroupDefinition[] {
  if (kind === "project") {
    return PROJECT_FACET_GROUPS;
  }

  return WRITING_FACET_GROUPS;
}

function countFacets(references: readonly PublicContentReference[]): Map<string, ContentFacet> {
  const facetsById = new Map<string, ContentFacet>();

  for (const reference of references) {
    const seenReferenceFacetIds = new Set<string>();

    for (const facet of facetsForReference(reference)) {
      if (seenReferenceFacetIds.has(facet.id)) {
        continue;
      }

      seenReferenceFacetIds.add(facet.id);
      const maybeExistingFacet = facetsById.get(facet.id);

      if (maybeExistingFacet) {
        facetsById.set(facet.id, {
          ...maybeExistingFacet,
          count: maybeExistingFacet.count + 1,
        });
        continue;
      }

      facetsById.set(facet.id, {
        id: facet.id,
        groupId: facet.groupId,
        label: facet.label,
        count: 1,
      });
    }
  }

  return facetsById;
}

function facetsForReference(reference: PublicContentReference): readonly ContentFacetDefinition[] {
  if (reference.kind === "project") {
    return [
      ...topicFacets(reference.canonicalTopics),
      ...maybeProjectTierFacet(reference.projectTier),
      ...maybeProjectStatusFacet(reference.projectStatus),
      projectSourceFacet(reference.projectSourceType),
    ];
  }

  if (reference.kind === "writing") {
    return [
      writingKindFacet(reference.writingKind),
      ...topicFacets(reference.canonicalTopics),
      ...writingTagFacets(reference.sourceLabels),
      ...writingYearFacets(reference),
    ];
  }

  return [];
}

function topicFacets(topics: readonly TopicRecord[]): readonly ContentFacetDefinition[] {
  return topics.map((topic) => ({
    id: `topic:${topic.slug}`,
    groupId: "topics",
    label: topic.label,
  }));
}

function maybeProjectTierFacet(
  tier: Extract<PublicContentReference, { kind: "project" }>["projectTier"],
): readonly ContentFacetDefinition[] {
  const maybeLabel = PROJECT_TIER_LABELS[tier as keyof typeof PROJECT_TIER_LABELS];

  if (!maybeLabel) {
    return [];
  }

  return [
    {
      id: `project-tier:${tier}`,
      groupId: "project-tier",
      label: maybeLabel,
    },
  ];
}

function maybeProjectStatusFacet(
  status: Extract<PublicContentReference, { kind: "project" }>["projectStatus"],
): readonly ContentFacetDefinition[] {
  const maybeLabel = PROJECT_STATUS_LABELS[status as keyof typeof PROJECT_STATUS_LABELS];

  if (!maybeLabel) {
    return [];
  }

  return [
    {
      id: `project-status:${status}`,
      groupId: "project-status",
      label: maybeLabel,
    },
  ];
}

function projectSourceFacet(
  sourceType: Extract<PublicContentReference, { kind: "project" }>["projectSourceType"],
): ContentFacetDefinition {
  return {
    id: `project-source:${sourceType}`,
    groupId: "project-source",
    label: PROJECT_SOURCE_LABELS[sourceType],
  };
}

function writingKindFacet(
  writingKind: Extract<PublicContentReference, { kind: "writing" }>["writingKind"],
): ContentFacetDefinition {
  return {
    id: `writing-kind:${writingKind}`,
    groupId: "writing-kind",
    label: WRITING_KIND_LABELS[writingKind],
  };
}

function writingTagFacets(labels: readonly TopicSourceLabel[]): readonly ContentFacetDefinition[] {
  return labels.flatMap((label) => {
    if (label.kind !== "writing-tag") {
      return [];
    }

    const facetKey = facetValueKey(label.label);

    if (!facetKey) {
      return [];
    }

    return [
      {
        id: `writing-tag:${facetKey}`,
        groupId: "writing-tag",
        label: label.label,
      },
    ];
  });
}

function writingYearFacets(
  reference: Extract<PublicContentReference, { kind: "writing" }>,
): readonly ContentFacetDefinition[] {
  return [
    ...maybeWritingYearFacet("published", reference.maybePublishedOn),
    ...maybeWritingYearFacet("updated", reference.maybeUpdatedOn),
  ];
}

function maybeWritingYearFacet(
  kind: "published" | "updated",
  maybeDate: string | undefined,
): readonly ContentFacetDefinition[] {
  const maybeYear = maybeDate?.slice(0, 4);

  if (!maybeYear || !/^\d{4}$/.test(maybeYear)) {
    return [];
  }

  const year = maybeYear;
  const label = kind === "published" ? `Published ${year}` : `Updated ${year}`;

  return [
    {
      id: `writing-year:${kind}:${maybeYear}`,
      groupId: "writing-year",
      label,
    },
  ];
}

function facetValueKey(value: string): string {
  return normalizeContentSearchQuery(value).join("-");
}

function groupSelectedFacetIds(
  selectedFacetIds: readonly string[],
  knownFacets: ReadonlyMap<string, ContentFacet>,
): Map<ContentFacetGroupId, Set<string>> {
  const selectedFacetsByGroup = new Map<ContentFacetGroupId, Set<string>>();

  for (const selectedFacetId of selectedFacetIds) {
    const maybeFacet = knownFacets.get(selectedFacetId);

    if (!maybeFacet) {
      continue;
    }

    const selectedGroup = selectedFacetsByGroup.get(maybeFacet.groupId) ?? new Set<string>();
    selectedGroup.add(selectedFacetId);
    selectedFacetsByGroup.set(maybeFacet.groupId, selectedGroup);
  }

  return selectedFacetsByGroup;
}

function matchesSelectedFacets(
  referenceFacets: readonly ContentFacetDefinition[],
  selectedFacetsByGroup: ReadonlyMap<ContentFacetGroupId, ReadonlySet<string>>,
): boolean {
  for (const [groupId, selectedFacetIds] of selectedFacetsByGroup.entries()) {
    const hasSelectedFacetForGroup = referenceFacets.some(
      (facet) => facet.groupId === groupId && selectedFacetIds.has(facet.id),
    );

    if (!hasSelectedFacetForGroup) {
      return false;
    }
  }

  return true;
}

function scoreReference(
  reference: PublicContentReference,
  referenceFacets: readonly ContentFacetDefinition[],
  queryTokens: readonly string[],
): number | null {
  if (queryTokens.length === 0) {
    return 0;
  }

  let score = 0;

  for (const queryToken of queryTokens) {
    const tokenScore = scoreToken(reference, referenceFacets, queryToken);

    if (tokenScore === 0) {
      return null;
    }

    score += tokenScore;
  }

  return score;
}

function scoreToken(
  reference: PublicContentReference,
  referenceFacets: readonly ContentFacetDefinition[],
  queryToken: string,
): number {
  return Math.max(
    scoreField([reference.title], queryToken, 100),
    scoreField(
      reference.canonicalTopics.flatMap((topic) => [topic.label, topic.slug]),
      queryToken,
      70,
    ),
    scoreField(
      referenceFacets.flatMap((facet) => [facet.label, facet.id]),
      queryToken,
      55,
    ),
    scoreField(
      reference.sourceLabels.map((label) => label.label),
      queryToken,
      40,
    ),
    scoreField([reference.summary], queryToken, 20),
  );
}

function scoreField(values: readonly string[], queryToken: string, weight: number): number {
  const matches = values.some((value) =>
    normalizeContentSearchQuery(value).some((fieldToken) => fieldToken.startsWith(queryToken)),
  );

  if (matches) {
    return weight;
  }

  return 0;
}

function compareResults(left: ContentSearchResult, right: ContentSearchResult): number {
  return (
    right.score - left.score ||
    left.reference.displayOrder - right.reference.displayOrder ||
    left.reference.kind.localeCompare(right.reference.kind) ||
    left.reference.slug.localeCompare(right.reference.slug)
  );
}
