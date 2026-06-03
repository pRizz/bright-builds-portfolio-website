import {
  curatedProjects,
  maybeProjectDetailPageProjectBySlug,
  type ProjectStory,
} from "./projects";
import { curatedWriting, type WritingBodyBlock, type WritingEntry } from "./writing";

export type WritingCurationIssueSeverity = "error" | "warning";
export type WritingCurationErrorCode =
  | "duplicate_slug"
  | "invalid_slug"
  | "duplicate_display_order"
  | "missing_title"
  | "missing_summary"
  | "missing_tags_or_topics"
  | "missing_body"
  | "empty_section_heading"
  | "empty_body_block"
  | "invalid_date"
  | "unsupported_related_project";
export type WritingCurationWarningCode = never;
export type WritingCurationIssueCode = WritingCurationErrorCode | WritingCurationWarningCode;

export type WritingCurationIssue = {
  severity: WritingCurationIssueSeverity;
  code: WritingCurationIssueCode;
  slug: string;
  message: string;
  maybeRelatedProjectSlug?: string;
};

export type WritingRegistryValidation = {
  issues: readonly WritingCurationIssue[];
  errors: readonly WritingCurationIssue[];
  warnings: readonly WritingCurationIssue[];
};

const writingSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const writingDatePattern = /^\d{4}-\d{2}-\d{2}$/;

export function validateWritingEntry(
  entry: WritingEntry,
  projects: readonly ProjectStory[] = curatedProjects,
): readonly WritingCurationIssue[] {
  const issues: WritingCurationIssue[] = [];

  if (!writingSlugPattern.test(entry.slug)) {
    issues.push(error(entry, "invalid_slug", "Writing slug must be lowercase hyphenated text."));
  }

  if (!entry.title.trim()) {
    issues.push(error(entry, "missing_title", "Writing entries need a title."));
  }

  if (!entry.summary.trim()) {
    issues.push(error(entry, "missing_summary", "Writing entries need a summary."));
  }

  if (entry.topics.length === 0 && entry.tags.length === 0) {
    issues.push(
      error(entry, "missing_tags_or_topics", "Writing entries need at least one topic or tag."),
    );
  }

  issues.push(...dateIssues(entry));
  issues.push(...bodyIssues(entry));
  issues.push(...relatedProjectIssues(entry, projects));

  return issues;
}

export function validateWritingRegistry(
  entries: readonly WritingEntry[] = curatedWriting,
  projects: readonly ProjectStory[] = curatedProjects,
): WritingRegistryValidation {
  const issues = [
    ...entries.flatMap((entry) => validateWritingEntry(entry, projects)),
    ...duplicateSlugIssues(entries),
    ...duplicateDisplayOrderIssues(entries),
  ];

  return {
    issues,
    errors: issues.filter((issue) => issue.severity === "error"),
    warnings: issues.filter((issue) => issue.severity === "warning"),
  };
}

export function writingCurationErrors(
  entries: readonly WritingEntry[] = curatedWriting,
  projects: readonly ProjectStory[] = curatedProjects,
): readonly WritingCurationIssue[] {
  return validateWritingRegistry(entries, projects).errors;
}

export function writingCurationWarnings(
  entries: readonly WritingEntry[] = curatedWriting,
  projects: readonly ProjectStory[] = curatedProjects,
): readonly WritingCurationIssue[] {
  return validateWritingRegistry(entries, projects).warnings;
}

export function assertValidCuratedWriting(
  entries: readonly WritingEntry[] = curatedWriting,
  projects: readonly ProjectStory[] = curatedProjects,
): void {
  const errors = writingCurationErrors(entries, projects);

  if (errors.length === 0) {
    return;
  }

  throw new Error(
    errors.map((issue) => `${issue.code}: ${issue.slug}: ${issue.message}`).join("\n"),
  );
}

function duplicateSlugIssues(entries: readonly WritingEntry[]): readonly WritingCurationIssue[] {
  const issues: WritingCurationIssue[] = [];
  const seenSlugs = new Set<string>();

  for (const entry of entries) {
    if (seenSlugs.has(entry.slug)) {
      issues.push(error(entry, "duplicate_slug", `Writing slug ${entry.slug} is duplicated.`));
      continue;
    }

    seenSlugs.add(entry.slug);
  }

  return issues;
}

function duplicateDisplayOrderIssues(
  entries: readonly WritingEntry[],
): readonly WritingCurationIssue[] {
  const issues: WritingCurationIssue[] = [];
  const seenSlugsByDisplayOrder = new Map<number, string>();

  for (const entry of entries) {
    const maybeSeenSlug = seenSlugsByDisplayOrder.get(entry.displayOrder);

    if (maybeSeenSlug) {
      issues.push(
        error(
          entry,
          "duplicate_display_order",
          `Display order ${entry.displayOrder} duplicates ${maybeSeenSlug}.`,
        ),
      );
      continue;
    }

    seenSlugsByDisplayOrder.set(entry.displayOrder, entry.slug);
  }

  return issues;
}

function dateIssues(entry: WritingEntry): readonly WritingCurationIssue[] {
  const issues: WritingCurationIssue[] = [];

  if (entry.maybePublishedOn && !writingDatePattern.test(entry.maybePublishedOn)) {
    issues.push(error(entry, "invalid_date", "maybePublishedOn must match YYYY-MM-DD."));
  }

  if (entry.maybeUpdatedOn && !writingDatePattern.test(entry.maybeUpdatedOn)) {
    issues.push(error(entry, "invalid_date", "maybeUpdatedOn must match YYYY-MM-DD."));
  }

  return issues;
}

function bodyIssues(entry: WritingEntry): readonly WritingCurationIssue[] {
  const issues: WritingCurationIssue[] = [];
  let hasNonEmptyBodyBlock = false;

  if (entry.sections.length === 0) {
    return [error(entry, "missing_body", "Writing entries need at least one body section.")];
  }

  for (const section of entry.sections) {
    if (!section.heading.trim()) {
      issues.push(error(entry, "empty_section_heading", "Writing sections need headings."));
    }

    if (section.blocks.length === 0) {
      continue;
    }

    for (const block of section.blocks) {
      if (hasBlockContent(block)) {
        hasNonEmptyBodyBlock = true;
      } else {
        issues.push(error(entry, "empty_body_block", "Writing body blocks need content."));
      }
    }
  }

  if (!hasNonEmptyBodyBlock) {
    issues.push(error(entry, "missing_body", "Writing entries need non-empty body content."));
  }

  return issues;
}

function hasBlockContent(block: WritingBodyBlock): boolean {
  if (block.kind === "paragraph" || block.kind === "callout") {
    return block.text.trim().length > 0;
  }

  if (block.kind === "list") {
    return block.items.length > 0 && block.items.every((item) => item.trim().length > 0);
  }

  return block.label.trim().length > 0 && block.href.trim().length > 0;
}

function relatedProjectIssues(
  entry: WritingEntry,
  projects: readonly ProjectStory[],
): readonly WritingCurationIssue[] {
  return entry.relatedProjectSlugs.flatMap((slug) => {
    const maybeProject = maybeProjectDetailPageProjectBySlug(slug, projects);

    if (maybeProject) {
      return [];
    }

    return [
      error(
        entry,
        "unsupported_related_project",
        `Related project "${slug}" must resolve to a selected project detail page.`,
        slug,
      ),
    ];
  });
}

function error(
  entry: Pick<WritingEntry, "slug">,
  code: WritingCurationErrorCode,
  message: string,
  maybeRelatedProjectSlug?: string,
): WritingCurationIssue {
  return {
    severity: "error",
    code,
    slug: entry.slug,
    message,
    maybeRelatedProjectSlug,
  };
}
