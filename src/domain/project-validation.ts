import type { ProjectLink, ProjectSourceType, ProjectStory } from "./projects";

export type CurationIssueSeverity = "error" | "warning";
export type CurationErrorCode =
  | "flagship_missing_authored_copy"
  | "flagship_missing_curation_reason"
  | "flagship_missing_useful_link"
  | "flagship_missing_original_work_status"
  | "flagship_missing_maturity"
  | "flagship_missing_status"
  | "flagship_blocked_source_type"
  | "flagship_archived_or_hidden"
  | "flagship_requires_promotion_reason"
  | "duplicate_display_order";
export type CurationWarningCode =
  | "non_home_missing_authored_copy"
  | "non_home_missing_curation_reason"
  | "hidden_project_included_in_index";
export type CurationIssueCode = CurationErrorCode | CurationWarningCode;

export type CurationIssue = {
  severity: CurationIssueSeverity;
  code: CurationIssueCode;
  slug: string;
  message: string;
};

export type ProjectRegistryValidation = {
  issues: readonly CurationIssue[];
  errors: readonly CurationIssue[];
  warnings: readonly CurationIssue[];
};

const blockedFlagshipSourceTypes = new Set<ProjectSourceType>([
  "repro",
  "playground",
  "generated",
  "profile",
  "support",
]);

export function validateProject(project: ProjectStory): readonly CurationIssue[] {
  const issues: CurationIssue[] = [];

  if (!isHomeFlagship(project)) {
    return validateNonHomeProject(project);
  }

  if (!project.oneLine.trim()) {
    issues.push(
      error(project, "flagship_missing_authored_copy", "Home projects need one-line copy."),
    );
  }

  if (!project.curationReason.trim()) {
    issues.push(
      error(project, "flagship_missing_curation_reason", "Home projects need a curation reason."),
    );
  }

  if (!hasUsefulLink(project.links)) {
    issues.push(
      error(project, "flagship_missing_useful_link", "Home projects need a useful link."),
    );
  }

  if (!hasReviewedOriginalWork(project)) {
    issues.push(
      error(
        project,
        "flagship_missing_original_work_status",
        "Home projects need reviewed original-work status.",
      ),
    );
  }

  if (!project.maturity) {
    issues.push(error(project, "flagship_missing_maturity", "Home projects need maturity."));
  }

  if (!project.status) {
    issues.push(error(project, "flagship_missing_status", "Home projects need status."));
  }

  if (
    project.maturity === "archived" ||
    project.status === "archived" ||
    project.status === "hidden"
  ) {
    issues.push(
      error(
        project,
        "flagship_archived_or_hidden",
        "Archived or hidden work cannot be home flagship.",
      ),
    );
  }

  if (blockedFlagshipSourceTypes.has(project.sourceType)) {
    issues.push(
      error(
        project,
        "flagship_blocked_source_type",
        "This source type is blocked from home flagship.",
      ),
    );
  }

  if (project.sourceType === "fork") {
    issues.push(...validateFlagshipFork(project));
  }

  return issues;
}

export function validateProjectRegistry(
  projects: readonly ProjectStory[],
): ProjectRegistryValidation {
  const issues = [
    ...projects.flatMap((project) => validateProject(project)),
    ...duplicateDisplayOrderIssues(projects),
  ];

  return {
    issues,
    errors: issues.filter((issue) => issue.severity === "error"),
    warnings: issues.filter((issue) => issue.severity === "warning"),
  };
}

export function curationErrors(projects: readonly ProjectStory[]): readonly CurationIssue[] {
  return validateProjectRegistry(projects).errors;
}

export function curationWarnings(projects: readonly ProjectStory[]): readonly CurationIssue[] {
  return validateProjectRegistry(projects).warnings;
}

export function assertValidCuratedProjects(projects: readonly ProjectStory[]): void {
  const errors = curationErrors(projects);

  if (errors.length === 0) {
    return;
  }

  throw new Error(
    errors.map((issue) => `${issue.code}: ${issue.slug}: ${issue.message}`).join("\n"),
  );
}

function validateNonHomeProject(project: ProjectStory): readonly CurationIssue[] {
  const issues: CurationIssue[] = [];

  if (!project.oneLine.trim()) {
    issues.push(
      warning(
        project,
        "non_home_missing_authored_copy",
        "Non-home projects should have one-line copy.",
      ),
    );
  }

  if (!project.curationReason.trim()) {
    issues.push(
      warning(
        project,
        "non_home_missing_curation_reason",
        "Non-home projects should have curation reasons.",
      ),
    );
  }

  if (project.placement === "hidden" && project.includeInProjectIndex) {
    issues.push(
      warning(
        project,
        "hidden_project_included_in_index",
        "Hidden projects should not be in the index.",
      ),
    );
  }

  return issues;
}

function validateFlagshipFork(project: ProjectStory): readonly CurationIssue[] {
  const maybeOriginalWork = project.originalWork;

  if (maybeOriginalWork?.kind !== "promoted-fork") {
    return [
      error(
        project,
        "flagship_blocked_source_type",
        "Forks need explicit promoted-fork status before home flagship placement.",
      ),
    ];
  }

  if (!maybeOriginalWork.promotionReason.trim()) {
    return [
      error(
        project,
        "flagship_requires_promotion_reason",
        "Promoted forks need a non-empty promotion reason.",
      ),
    ];
  }

  return [];
}

function duplicateDisplayOrderIssues(projects: readonly ProjectStory[]): readonly CurationIssue[] {
  const issues: CurationIssue[] = [];
  const seenSlugsByDisplayOrder = new Map<number, string>();

  for (const project of projects) {
    const maybeSeenSlug = seenSlugsByDisplayOrder.get(project.displayOrder);

    if (maybeSeenSlug) {
      issues.push(
        error(
          project,
          "duplicate_display_order",
          `Display order ${project.displayOrder} duplicates ${maybeSeenSlug}.`,
        ),
      );
      continue;
    }

    seenSlugsByDisplayOrder.set(project.displayOrder, project.slug);
  }

  return issues;
}

function hasUsefulLink(links: readonly ProjectLink[]): boolean {
  return links.some((link) => link.label.trim() !== "" && link.href.trim() !== "");
}

function hasReviewedOriginalWork(project: ProjectStory): boolean {
  const maybeOriginalWork = project.originalWork;
  return Boolean(maybeOriginalWork && maybeOriginalWork.kind !== "unreviewed");
}

function isHomeFlagship(project: ProjectStory): boolean {
  return project.placement === "home" && project.tier === "flagship" && project.includeOnHome;
}

function error(project: ProjectStory, code: CurationErrorCode, message: string): CurationIssue {
  return { severity: "error", code, slug: project.slug, message };
}

function warning(project: ProjectStory, code: CurationWarningCode, message: string): CurationIssue {
  return { severity: "warning", code, slug: project.slug, message };
}
