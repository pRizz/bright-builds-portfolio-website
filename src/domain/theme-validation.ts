import {
  curatedProjects,
  maybeProjectDetailPageProjectBySlug,
  type ProjectStory,
} from "./projects";
import { curatedThemes, type ThemeRecord, type ThemeStatus } from "./themes";
import { curatedWriting, maybePublicWritingEntryBySlug, type WritingEntry } from "./writing";

export type ThemeCurationIssueSeverity = "error" | "warning";
export type ThemeCurationErrorCode =
  | "duplicate_slug"
  | "invalid_slug"
  | "duplicate_display_order"
  | "unsupported_status"
  | "missing_title"
  | "missing_summary"
  | "missing_audience"
  | "missing_proof_points"
  | "missing_collaboration_angle"
  | "missing_related_projects"
  | "missing_related_writing"
  | "unsupported_related_project"
  | "unpublished_related_writing";
export type ThemeCurationWarningCode = never;
export type ThemeCurationIssueCode = ThemeCurationErrorCode | ThemeCurationWarningCode;

export type ThemeCurationIssue = {
  severity: ThemeCurationIssueSeverity;
  code: ThemeCurationIssueCode;
  slug: string;
  message: string;
  maybeRelatedProjectSlug?: string;
  maybeRelatedWritingSlug?: string;
};

export type ThemeRegistryValidation = {
  issues: readonly ThemeCurationIssue[];
  errors: readonly ThemeCurationIssue[];
  warnings: readonly ThemeCurationIssue[];
};

const themeSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const supportedThemeStatuses = new Set<ThemeStatus>([
  "public",
  "draft",
  "hidden",
  "unsupported",
  "archived",
]);

export function validateThemeEntry(
  theme: ThemeRecord,
  projects: readonly ProjectStory[] = curatedProjects,
  writingEntries: readonly WritingEntry[] = curatedWriting,
): readonly ThemeCurationIssue[] {
  const issues: ThemeCurationIssue[] = [];

  if (!themeSlugPattern.test(theme.slug)) {
    issues.push(error(theme, "invalid_slug", "Theme slug must be lowercase hyphenated text."));
  }

  if (!supportedThemeStatuses.has(theme.status)) {
    issues.push(
      error(
        theme,
        "unsupported_status",
        "Theme status must be public, draft, hidden, unsupported, or archived.",
      ),
    );
  }

  if (!theme.title.trim()) {
    issues.push(error(theme, "missing_title", "Theme entries need a title."));
  }

  if (!theme.summary.trim()) {
    issues.push(error(theme, "missing_summary", "Theme entries need a summary."));
  }

  if (!theme.audience.trim()) {
    issues.push(error(theme, "missing_audience", "Theme entries need an audience."));
  }

  if (theme.proofPoints.length === 0 || theme.proofPoints.every((point) => !point.trim())) {
    issues.push(error(theme, "missing_proof_points", "Theme entries need proof points."));
  }

  if (!theme.collaborationAngle.trim()) {
    issues.push(
      error(theme, "missing_collaboration_angle", "Theme entries need a collaboration angle."),
    );
  }

  if (theme.relatedProjectSlugs.length === 0) {
    issues.push(
      error(theme, "missing_related_projects", "Theme entries need related project slugs."),
    );
  }

  if (theme.relatedWritingSlugs.length === 0) {
    issues.push(
      error(theme, "missing_related_writing", "Theme entries need related writing slugs."),
    );
  }

  issues.push(...relatedProjectIssues(theme, projects));
  issues.push(...relatedWritingIssues(theme, writingEntries));

  return issues;
}

export function validateThemeRegistry(
  themes: readonly ThemeRecord[] = curatedThemes,
  projects: readonly ProjectStory[] = curatedProjects,
  writingEntries: readonly WritingEntry[] = curatedWriting,
): ThemeRegistryValidation {
  const issues = [
    ...themes.flatMap((theme) => validateThemeEntry(theme, projects, writingEntries)),
    ...duplicateSlugIssues(themes),
    ...duplicateDisplayOrderIssues(themes),
  ];

  return {
    issues,
    errors: issues.filter((issue) => issue.severity === "error"),
    warnings: issues.filter((issue) => issue.severity === "warning"),
  };
}

export function themeCurationErrors(
  themes: readonly ThemeRecord[] = curatedThemes,
  projects: readonly ProjectStory[] = curatedProjects,
  writingEntries: readonly WritingEntry[] = curatedWriting,
): readonly ThemeCurationIssue[] {
  return validateThemeRegistry(themes, projects, writingEntries).errors;
}

export function themeCurationWarnings(
  themes: readonly ThemeRecord[] = curatedThemes,
  projects: readonly ProjectStory[] = curatedProjects,
  writingEntries: readonly WritingEntry[] = curatedWriting,
): readonly ThemeCurationIssue[] {
  return validateThemeRegistry(themes, projects, writingEntries).warnings;
}

export function assertValidCuratedThemes(
  themes: readonly ThemeRecord[] = curatedThemes,
  projects: readonly ProjectStory[] = curatedProjects,
  writingEntries: readonly WritingEntry[] = curatedWriting,
): void {
  const errors = themeCurationErrors(themes, projects, writingEntries);

  if (errors.length === 0) {
    return;
  }

  throw new Error(
    errors.map((issue) => `${issue.code}: ${issue.slug}: ${issue.message}`).join("\n"),
  );
}

function duplicateSlugIssues(themes: readonly ThemeRecord[]): readonly ThemeCurationIssue[] {
  const issues: ThemeCurationIssue[] = [];
  const seenSlugs = new Set<string>();

  for (const theme of themes) {
    if (seenSlugs.has(theme.slug)) {
      issues.push(error(theme, "duplicate_slug", `Theme slug ${theme.slug} is duplicated.`));
      continue;
    }

    seenSlugs.add(theme.slug);
  }

  return issues;
}

function duplicateDisplayOrderIssues(
  themes: readonly ThemeRecord[],
): readonly ThemeCurationIssue[] {
  const issues: ThemeCurationIssue[] = [];
  const seenSlugsByDisplayOrder = new Map<number, string>();

  for (const theme of themes) {
    const maybeSeenSlug = seenSlugsByDisplayOrder.get(theme.displayOrder);

    if (maybeSeenSlug) {
      issues.push(
        error(
          theme,
          "duplicate_display_order",
          `Display order ${theme.displayOrder} duplicates ${maybeSeenSlug}.`,
        ),
      );
      continue;
    }

    seenSlugsByDisplayOrder.set(theme.displayOrder, theme.slug);
  }

  return issues;
}

function relatedProjectIssues(
  theme: ThemeRecord,
  projects: readonly ProjectStory[],
): readonly ThemeCurationIssue[] {
  return theme.relatedProjectSlugs.flatMap((slug) => {
    const maybeProject = maybeProjectDetailPageProjectBySlug(slug, projects);

    if (maybeProject) {
      return [];
    }

    return [
      error(
        theme,
        "unsupported_related_project",
        `Related project "${slug}" must resolve to a selected project detail page.`,
        slug,
      ),
    ];
  });
}

function relatedWritingIssues(
  theme: ThemeRecord,
  writingEntries: readonly WritingEntry[],
): readonly ThemeCurationIssue[] {
  return theme.relatedWritingSlugs.flatMap((slug) => {
    const maybeEntry = maybePublicWritingEntryBySlug(slug, writingEntries);

    if (maybeEntry) {
      return [];
    }

    return [
      error(
        theme,
        "unpublished_related_writing",
        `Related writing "${slug}" must resolve to a public writing entry.`,
        undefined,
        slug,
      ),
    ];
  });
}

function error(
  theme: Pick<ThemeRecord, "slug">,
  code: ThemeCurationErrorCode,
  message: string,
  maybeRelatedProjectSlug?: string,
  maybeRelatedWritingSlug?: string,
): ThemeCurationIssue {
  return {
    severity: "error",
    code,
    slug: theme.slug,
    message,
    maybeRelatedProjectSlug,
    maybeRelatedWritingSlug,
  };
}
