import {
  curatedTopics,
  maybeTopicRecordForLabel,
  normalizeTopicLabelKey,
  type PublicContentReference,
  publicContentReferences,
  type TopicRecord,
  type TopicReferenceSources,
  type TopicSourceKind,
  type TopicSourceLabel,
  topicSourceLabels,
} from "./topics";

export type TopicCurationIssueSeverity = "error" | "warning";
export type TopicCurationErrorCode =
  | "duplicate_topic_slug"
  | "invalid_topic_slug"
  | "empty_topic_label"
  | "duplicate_topic_display_order"
  | "colliding_topic_label"
  | "unsupported_topic_source_kind"
  | "unmapped_public_label"
  | "public_reference_without_topic"
  | "non_public_reference"
  | "duplicate_public_reference";
export type TopicCurationWarningCode = never;
export type TopicCurationIssueCode = TopicCurationErrorCode | TopicCurationWarningCode;

export type TopicCurationIssue = {
  severity: TopicCurationIssueSeverity;
  code: TopicCurationIssueCode;
  slug: string;
  message: string;
  maybeTopicSlug?: string;
  maybeLabel?: string;
  maybeSourceKind?: string;
  maybeSourceSlug?: string;
  maybeReferenceKind?: PublicContentReference["kind"];
  maybeReferenceSlug?: string;
  maybeCanonicalPath?: string;
};

export type TopicRegistryValidation = {
  issues: readonly TopicCurationIssue[];
  errors: readonly TopicCurationIssue[];
  warnings: readonly TopicCurationIssue[];
};

type TopicValidationSources = TopicReferenceSources & {
  sourceLabels?: readonly TopicSourceLabel[];
  publicReferences?: readonly PublicContentReference[];
};

const topicSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const supportedTopicSourceKinds = new Set<TopicSourceKind>([
  "project-theme",
  "project-tag",
  "writing-topic",
  "writing-tag",
  "theme-title",
]);

export function validateTopicRecord(topic: TopicRecord): readonly TopicCurationIssue[] {
  const issues: TopicCurationIssue[] = [];

  if (!topicSlugPattern.test(topic.slug)) {
    issues.push(
      error({
        slug: topic.slug,
        code: "invalid_topic_slug",
        message: "Topic slug must be lowercase hyphenated text.",
        maybeTopicSlug: topic.slug,
      }),
    );
  }

  if (!topic.label.trim()) {
    issues.push(
      error({
        slug: topic.slug,
        code: "empty_topic_label",
        message: "Topic label must not be empty.",
        maybeTopicSlug: topic.slug,
        maybeLabel: topic.label,
      }),
    );
  }

  for (const alias of topic.aliases) {
    if (alias.trim()) {
      continue;
    }

    issues.push(
      error({
        slug: topic.slug,
        code: "empty_topic_label",
        message: "Topic aliases must not be empty.",
        maybeTopicSlug: topic.slug,
        maybeLabel: alias,
      }),
    );
  }

  return issues;
}

export function validateTopicRegistry(
  topics: readonly TopicRecord[] = curatedTopics,
  sources: TopicReferenceSources = {},
): TopicRegistryValidation {
  const validationSources: TopicValidationSources = { ...sources, topics };
  const selectorSourceLabels = topicSourceLabels(validationSources);
  const sourceLabels = [...selectorSourceLabels, ...injectedSourceLabels(sources)];
  const selectorReferences = publicContentReferences(validationSources);
  const maybeReferences = injectedPublicReferences(sources);
  const references = maybeReferences
    ? [...selectorReferences, ...maybeReferences]
    : selectorReferences;

  const issues = [
    ...topics.flatMap(validateTopicRecord),
    ...duplicateTopicSlugIssues(topics),
    ...duplicateDisplayOrderIssues(topics),
    ...collidingTopicLabelIssues(topics),
    ...unsupportedSourceKindIssues(sourceLabels),
    ...unmappedPublicLabelIssues(sourceLabels, topics),
    ...publicReferenceWithoutTopicIssues(references),
    ...duplicatePublicReferenceIssues(references),
    ...nonPublicReferenceIssues(maybeReferences ?? [], selectorReferences),
  ];

  return {
    issues,
    errors: issues.filter((issue) => issue.severity === "error"),
    warnings: issues.filter((issue) => issue.severity === "warning"),
  };
}

export function topicCurationErrors(
  topics: readonly TopicRecord[] = curatedTopics,
  sources: TopicReferenceSources = {},
): readonly TopicCurationIssue[] {
  return validateTopicRegistry(topics, sources).errors;
}

export function topicCurationWarnings(
  topics: readonly TopicRecord[] = curatedTopics,
  sources: TopicReferenceSources = {},
): readonly TopicCurationIssue[] {
  return validateTopicRegistry(topics, sources).warnings;
}

export function assertValidCuratedTopics(
  topics: readonly TopicRecord[] = curatedTopics,
  sources: TopicReferenceSources = {},
): void {
  const errors = topicCurationErrors(topics, sources);

  if (errors.length === 0) {
    return;
  }

  throw new Error(
    errors.map((issue) => `${issue.code}: ${issue.slug}: ${issue.message}`).join("\n"),
  );
}

function injectedSourceLabels(sources: TopicReferenceSources): readonly TopicSourceLabel[] {
  return (sources as TopicValidationSources).sourceLabels ?? [];
}

function injectedPublicReferences(
  sources: TopicReferenceSources,
): readonly PublicContentReference[] | null {
  return (sources as TopicValidationSources).publicReferences ?? null;
}

function duplicateTopicSlugIssues(topics: readonly TopicRecord[]): readonly TopicCurationIssue[] {
  const issues: TopicCurationIssue[] = [];
  const seenSlugs = new Set<string>();

  for (const topic of topics) {
    if (seenSlugs.has(topic.slug)) {
      issues.push(
        error({
          slug: topic.slug,
          code: "duplicate_topic_slug",
          message: `Topic slug ${topic.slug} is duplicated.`,
          maybeTopicSlug: topic.slug,
        }),
      );
      continue;
    }

    seenSlugs.add(topic.slug);
  }

  return issues;
}

function duplicateDisplayOrderIssues(
  topics: readonly TopicRecord[],
): readonly TopicCurationIssue[] {
  const issues: TopicCurationIssue[] = [];
  const seenSlugsByDisplayOrder = new Map<number, string>();

  for (const topic of topics) {
    const maybeSeenSlug = seenSlugsByDisplayOrder.get(topic.displayOrder);

    if (maybeSeenSlug) {
      issues.push(
        error({
          slug: topic.slug,
          code: "duplicate_topic_display_order",
          message: `Display order ${topic.displayOrder} duplicates ${maybeSeenSlug}.`,
          maybeTopicSlug: maybeSeenSlug,
        }),
      );
      continue;
    }

    seenSlugsByDisplayOrder.set(topic.displayOrder, topic.slug);
  }

  return issues;
}

function collidingTopicLabelIssues(topics: readonly TopicRecord[]): readonly TopicCurationIssue[] {
  const issues: TopicCurationIssue[] = [];
  const ownersByLabelKey = new Map<string, { slug: string; label: string }>();

  for (const topic of topics) {
    for (const label of topicLabels(topic)) {
      const labelKey = normalizeTopicLabelKey(label);

      if (!labelKey) {
        continue;
      }

      const maybeOwner = ownersByLabelKey.get(labelKey);

      if (maybeOwner && maybeOwner.slug !== topic.slug) {
        issues.push(
          error({
            slug: topic.slug,
            code: "colliding_topic_label",
            message: `Topic label "${label}" collides with ${maybeOwner.slug}.`,
            maybeTopicSlug: maybeOwner.slug,
            maybeLabel: label,
          }),
        );
        continue;
      }

      ownersByLabelKey.set(labelKey, { slug: topic.slug, label });
    }
  }

  return issues;
}

function unsupportedSourceKindIssues(
  sourceLabels: readonly TopicSourceLabel[],
): readonly TopicCurationIssue[] {
  return sourceLabels.flatMap((sourceLabel) => {
    const sourceKind = String(sourceLabel.kind);

    if (supportedTopicSourceKinds.has(sourceKind as TopicSourceKind)) {
      return [];
    }

    return [
      error({
        slug: sourceLabel.sourceSlug,
        code: "unsupported_topic_source_kind",
        message: `Unsupported topic source kind: ${sourceKind}.`,
        maybeLabel: sourceLabel.label,
        maybeSourceKind: sourceKind,
        maybeSourceSlug: sourceLabel.sourceSlug,
      }),
    ];
  });
}

function unmappedPublicLabelIssues(
  sourceLabels: readonly TopicSourceLabel[],
  topics: readonly TopicRecord[],
): readonly TopicCurationIssue[] {
  return sourceLabels.flatMap((sourceLabel) => {
    const maybeTopic = maybeTopicRecordForLabel(sourceLabel.label, topics);

    if (maybeTopic) {
      return [];
    }

    return [
      error({
        slug: sourceLabel.sourceSlug,
        code: "unmapped_public_label",
        message: `Public label "${sourceLabel.label}" does not map to a canonical topic.`,
        maybeLabel: sourceLabel.label,
        maybeSourceKind: sourceLabel.kind,
        maybeSourceSlug: sourceLabel.sourceSlug,
      }),
    ];
  });
}

function publicReferenceWithoutTopicIssues(
  references: readonly PublicContentReference[],
): readonly TopicCurationIssue[] {
  return references.flatMap((reference) => {
    if (reference.canonicalTopics.length > 0) {
      return [];
    }

    return [
      referenceError(
        reference,
        "public_reference_without_topic",
        `Public ${reference.kind} reference ${reference.slug} has no canonical topics.`,
      ),
    ];
  });
}

function duplicatePublicReferenceIssues(
  references: readonly PublicContentReference[],
): readonly TopicCurationIssue[] {
  return [...duplicateReferenceKeyIssues(references), ...duplicateCanonicalPathIssues(references)];
}

function duplicateReferenceKeyIssues(
  references: readonly PublicContentReference[],
): readonly TopicCurationIssue[] {
  const issues: TopicCurationIssue[] = [];
  const seenReferenceKeys = new Set<string>();

  for (const reference of references) {
    const key = referenceKey(reference);

    if (seenReferenceKeys.has(key)) {
      issues.push(
        referenceError(
          reference,
          "duplicate_public_reference",
          `Public reference ${key} is duplicated.`,
        ),
      );
      continue;
    }

    seenReferenceKeys.add(key);
  }

  return issues;
}

function duplicateCanonicalPathIssues(
  references: readonly PublicContentReference[],
): readonly TopicCurationIssue[] {
  const issues: TopicCurationIssue[] = [];
  const seenReferenceSlugsByCanonicalPath = new Map<string, string>();

  for (const reference of references) {
    const maybeSeenSlug = seenReferenceSlugsByCanonicalPath.get(reference.canonicalPath);

    if (maybeSeenSlug) {
      issues.push(
        referenceError(
          reference,
          "duplicate_public_reference",
          `Canonical path ${reference.canonicalPath} duplicates ${maybeSeenSlug}.`,
        ),
      );
      continue;
    }

    seenReferenceSlugsByCanonicalPath.set(reference.canonicalPath, reference.slug);
  }

  return issues;
}

function nonPublicReferenceIssues(
  references: readonly PublicContentReference[],
  selectorReferences: readonly PublicContentReference[],
): readonly TopicCurationIssue[] {
  const publicReferenceKeys = new Set(selectorReferences.map(referenceKey));

  return references.flatMap((reference) => {
    if (publicReferenceKeys.has(referenceKey(reference))) {
      return [];
    }

    return [
      referenceError(
        reference,
        "non_public_reference",
        `Public reference ${reference.kind}:${reference.slug} is not present in public selectors.`,
      ),
    ];
  });
}

function topicLabels(topic: TopicRecord): readonly string[] {
  return [topic.slug, topic.label, ...topic.aliases];
}

function referenceKey(reference: Pick<PublicContentReference, "kind" | "slug">): string {
  return `${reference.kind}:${reference.slug}`;
}

function referenceError(
  reference: PublicContentReference,
  code: TopicCurationErrorCode,
  message: string,
): TopicCurationIssue {
  return error({
    slug: reference.slug,
    code,
    message,
    maybeReferenceKind: reference.kind,
    maybeReferenceSlug: reference.slug,
    maybeCanonicalPath: reference.canonicalPath,
  });
}

function error(issue: Omit<TopicCurationIssue, "severity">): TopicCurationIssue {
  return { severity: "error", ...issue };
}
