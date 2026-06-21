import { type ProjectStory, projectDetailPageProjects, projectDetailPath } from "./projects";
import { routeByPath } from "./routes";
import { sha256Hex } from "./sha256";
import { publicThemeEntries, type ThemeRecord, themeDetailPath } from "./themes";
import { publicWritingEntries, type WritingEntry, writingDetailPath } from "./writing";

export const SOCIAL_PREVIEW_DIMENSIONS = { width: 1200, height: 630 } as const;

export const SOCIAL_PREVIEW_TEXT_BUDGETS = {
  maxTitleCharacters: 72,
  maxDescriptionCharacters: 160,
  maxLabels: 4,
  maxLabelCharacters: 32,
  maxUnbrokenTokenCharacters: 28,
  maxAltCharacters: 180,
} as const;

export const SOCIAL_PREVIEW_FALLBACK_IMAGE = {
  assetPath: "/social/bright-builds-og.png",
  alt: "Peter Ryszkiewicz / pRizz and Bright Builds portfolio focus on AI, Bitcoin, open systems, and developer tooling.",
  dimensions: SOCIAL_PREVIEW_DIMENSIONS,
} as const;

export type SocialPreviewRouteKind =
  | "projects-index"
  | "project"
  | "writing-index"
  | "writing"
  | "themes-index"
  | "theme";

export type SocialPreviewTarget = {
  routePath: string;
  assetPath: string;
  title: string;
  description: string;
  kind: SocialPreviewRouteKind;
  kicker: string;
  labels: readonly string[];
  alt: string;
  dimensions: typeof SOCIAL_PREVIEW_DIMENSIONS;
  sourceFingerprint: string;
};

export type SocialPreviewTargetSources = {
  projects?: readonly ProjectStory[];
  writingEntries?: readonly WritingEntry[];
  themes?: readonly ThemeRecord[];
};

export type SocialPreviewSourcePayload = Omit<
  SocialPreviewTarget,
  "assetPath" | "sourceFingerprint"
>;

export type SocialPreviewValidationFindingCode =
  | "duplicate-route-path"
  | "duplicate-asset-path"
  | "missing-required-text"
  | "unsupported-route-kind"
  | "non-local-asset-path"
  | "non-generated-asset-path"
  | "unsafe-asset-path"
  | "wrong-dimensions"
  | "text-too-long"
  | "too-many-labels"
  | "unbroken-token-too-long";

type TextField = "title" | "description" | "kicker" | "alt";

type SocialPreviewValidationFindingField =
  | TextField
  | "routePath"
  | "assetPath"
  | "kind"
  | "labels"
  | "dimensions";

export type SocialPreviewValidationFinding = {
  code: SocialPreviewValidationFindingCode;
  routePath: string;
  message: string;
  assetPath?: string;
  field?: SocialPreviewValidationFindingField;
  value?: string | number;
};

type SocialPreviewProject = ReturnType<typeof projectDetailPageProjects>[number];
type PublicSocialPreviewWritingEntry = ReturnType<typeof publicWritingEntries>[number];
type PublicSocialPreviewThemeEntry = ReturnType<typeof publicThemeEntries>[number];

const socialPreviewRouteKinds = [
  "projects-index",
  "project",
  "writing-index",
  "writing",
  "themes-index",
  "theme",
] as const satisfies readonly SocialPreviewRouteKind[];

const generatedAssetPathPattern =
  /^\/social\/generated\/(projects|writing|themes)\/(?:index|[a-z0-9]+(?:-[a-z0-9]+)*)-[a-f0-9]{12}\.png$/;

export function socialPreviewTargets(
  sources: SocialPreviewTargetSources = {},
): readonly SocialPreviewTarget[] {
  const projects = projectDetailPageProjects(sources.projects);
  const writingEntries = publicWritingEntries(sources.writingEntries);
  const themes = publicThemeEntries(sources.themes);

  return [
    indexTargetForRoute(routeByPath("/projects"), "projects-index"),
    ...projects.map(targetForProject),
    indexTargetForRoute(routeByPath("/writing"), "writing-index"),
    ...writingEntries.map(targetForWriting),
    indexTargetForRoute(routeByPath("/themes"), "themes-index"),
    ...themes.map(targetForTheme),
  ];
}

export function maybeSocialPreviewTargetForRoutePath(
  routePath: string,
): SocialPreviewTarget | null {
  return socialPreviewTargets().find((target) => target.routePath === routePath) ?? null;
}

export function sourceFingerprintForSocialPreviewPayload(
  payload: SocialPreviewSourcePayload,
): string {
  const stablePayload = {
    alt: payload.alt,
    description: payload.description,
    dimensions: {
      width: payload.dimensions.width,
      height: payload.dimensions.height,
    },
    kicker: payload.kicker,
    kind: payload.kind,
    labels: [...payload.labels].sort(),
    routePath: payload.routePath,
    title: payload.title,
  };

  return sha256Hex(JSON.stringify(stablePayload)).slice(0, 12);
}

export function validateSocialPreviewTargets(
  targets: readonly SocialPreviewTarget[] = socialPreviewTargets(),
): readonly SocialPreviewValidationFinding[] {
  return [
    ...duplicateRoutePathFindings(targets),
    ...duplicateAssetPathFindings(targets),
    ...targets.flatMap(validateSocialPreviewTarget),
  ];
}

function indexTargetForRoute(
  route: ReturnType<typeof routeByPath>,
  kind: "projects-index" | "writing-index" | "themes-index",
): SocialPreviewTarget {
  const payload: SocialPreviewSourcePayload = {
    routePath: route.path,
    title: route.heading,
    description: route.description,
    kind,
    kicker: route.label,
    labels: [route.label, "Bright Builds"],
    alt: `Social preview for ${route.heading}: ${route.description}`,
    dimensions: SOCIAL_PREVIEW_DIMENSIONS,
  };

  return targetFromPayload(payload, "index");
}

function targetForProject(project: SocialPreviewProject): SocialPreviewTarget {
  const payload: SocialPreviewSourcePayload = {
    routePath: projectDetailPath(project),
    title: project.name,
    description: project.oneLine,
    kind: "project",
    kicker: "Project Story",
    labels: compactLabels([...project.themes, ...project.tags, project.status]),
    alt: `Social preview for ${project.name}: ${project.oneLine}`,
    dimensions: SOCIAL_PREVIEW_DIMENSIONS,
  };

  return targetFromPayload(payload, project.slug);
}

function targetForWriting(entry: PublicSocialPreviewWritingEntry): SocialPreviewTarget {
  const payload: SocialPreviewSourcePayload = {
    routePath: writingDetailPath(entry),
    title: entry.title,
    description: entry.summary,
    kind: "writing",
    kicker: entry.kind === "essay" ? "Essay" : "Note",
    labels: compactLabels([entry.kind, ...entry.topics, ...entry.tags]),
    alt: `Social preview for ${entry.title}: ${entry.summary}`,
    dimensions: SOCIAL_PREVIEW_DIMENSIONS,
  };

  return targetFromPayload(payload, entry.slug);
}

function targetForTheme(theme: PublicSocialPreviewThemeEntry): SocialPreviewTarget {
  const payload: SocialPreviewSourcePayload = {
    routePath: themeDetailPath(theme),
    title: theme.title,
    description: theme.summary,
    kind: "theme",
    kicker: "Theme",
    labels: compactLabels([
      "Theme",
      `${theme.relatedProjectSlugs.length} projects`,
      `${theme.relatedWritingSlugs.length} writing links`,
    ]),
    alt: `Social preview for ${theme.title}: ${theme.summary}`,
    dimensions: SOCIAL_PREVIEW_DIMENSIONS,
  };

  return targetFromPayload(payload, theme.slug);
}

function targetFromPayload(
  payload: SocialPreviewSourcePayload,
  slugSegment: string,
): SocialPreviewTarget {
  const sourceFingerprint = sourceFingerprintForSocialPreviewPayload(payload);

  return {
    ...payload,
    assetPath: socialPreviewAssetPath(payload.kind, slugSegment, sourceFingerprint),
    sourceFingerprint,
  };
}

function socialPreviewAssetPath(
  kind: SocialPreviewRouteKind,
  slugSegment: string,
  sourceFingerprint: string,
): string {
  return `/social/generated/${assetFamilyForKind(kind)}/${slugSegment}-${sourceFingerprint}.png`;
}

function assetFamilyForKind(kind: SocialPreviewRouteKind): "projects" | "writing" | "themes" {
  if (kind === "projects-index" || kind === "project") {
    return "projects";
  }

  if (kind === "writing-index" || kind === "writing") {
    return "writing";
  }

  return "themes";
}

function compactLabels(labels: readonly string[]): readonly string[] {
  const seenLabels = new Set<string>();
  const compactedLabels: string[] = [];

  for (const label of labels) {
    const trimmedLabel = label.trim();

    if (!trimmedLabel) {
      continue;
    }

    const labelKey = trimmedLabel.toLocaleLowerCase();

    if (seenLabels.has(labelKey)) {
      continue;
    }

    seenLabels.add(labelKey);
    compactedLabels.push(trimmedLabel);

    if (compactedLabels.length === SOCIAL_PREVIEW_TEXT_BUDGETS.maxLabels) {
      return compactedLabels;
    }
  }

  return compactedLabels;
}

function duplicateRoutePathFindings(
  targets: readonly SocialPreviewTarget[],
): readonly SocialPreviewValidationFinding[] {
  const seenRoutePaths = new Set<string>();
  const findings: SocialPreviewValidationFinding[] = [];

  for (const target of targets) {
    if (!seenRoutePaths.has(target.routePath)) {
      seenRoutePaths.add(target.routePath);
      continue;
    }

    findings.push({
      code: "duplicate-route-path",
      routePath: target.routePath,
      message: `Duplicate social preview route path: ${target.routePath}`,
      field: "routePath",
      value: target.routePath,
    });
  }

  return findings;
}

function duplicateAssetPathFindings(
  targets: readonly SocialPreviewTarget[],
): readonly SocialPreviewValidationFinding[] {
  const seenAssetPaths = new Set<string>();
  const findings: SocialPreviewValidationFinding[] = [];

  for (const target of targets) {
    if (!seenAssetPaths.has(target.assetPath)) {
      seenAssetPaths.add(target.assetPath);
      continue;
    }

    findings.push({
      code: "duplicate-asset-path",
      routePath: target.routePath,
      message: `Duplicate social preview asset path: ${target.assetPath}`,
      assetPath: target.assetPath,
      field: "assetPath",
      value: target.assetPath,
    });
  }

  return findings;
}

function validateSocialPreviewTarget(
  target: SocialPreviewTarget,
): readonly SocialPreviewValidationFinding[] {
  return [
    ...missingRequiredTextFindings(target),
    ...unsupportedKindFindings(target),
    ...nonLocalAssetPathFindings(target),
    ...nonGeneratedAssetPathFindings(target),
    ...unsafeAssetPathFindings(target),
    ...dimensionFindings(target),
    ...textBudgetFindings(target),
    ...unbrokenTokenFindings(target),
  ];
}

function missingRequiredTextFindings(
  target: SocialPreviewTarget,
): readonly SocialPreviewValidationFinding[] {
  const findings: SocialPreviewValidationFinding[] = [];

  for (const field of ["title", "description", "kicker", "alt"] as const) {
    if (target[field].trim()) {
      continue;
    }

    findings.push({
      code: "missing-required-text",
      routePath: target.routePath,
      message: `Missing required social preview ${field}.`,
      field,
    });
  }

  if (target.labels.length === 0) {
    findings.push({
      code: "missing-required-text",
      routePath: target.routePath,
      message: "Missing required social preview labels.",
      field: "labels",
    });
  }

  for (const label of target.labels) {
    if (label.trim()) {
      continue;
    }

    findings.push({
      code: "missing-required-text",
      routePath: target.routePath,
      message: "Social preview label must not be empty.",
      field: "labels",
      value: label,
    });
  }

  return findings;
}

function unsupportedKindFindings(
  target: SocialPreviewTarget,
): readonly SocialPreviewValidationFinding[] {
  const kind = String(target.kind);

  if (isSocialPreviewRouteKind(kind)) {
    return [];
  }

  return [
    {
      code: "unsupported-route-kind",
      routePath: target.routePath,
      message: `Unsupported social preview route kind: ${kind}`,
      field: "kind",
      value: kind,
    },
  ];
}

function nonLocalAssetPathFindings(
  target: SocialPreviewTarget,
): readonly SocialPreviewValidationFinding[] {
  if (target.assetPath.startsWith("/") && !target.assetPath.startsWith("//")) {
    return [];
  }

  return [
    {
      code: "non-local-asset-path",
      routePath: target.routePath,
      message: `Social preview asset path must be an absolute local path: ${target.assetPath}`,
      assetPath: target.assetPath,
      field: "assetPath",
      value: target.assetPath,
    },
  ];
}

function nonGeneratedAssetPathFindings(
  target: SocialPreviewTarget,
): readonly SocialPreviewValidationFinding[] {
  if (target.assetPath.startsWith("/social/generated/")) {
    return [];
  }

  return [
    {
      code: "non-generated-asset-path",
      routePath: target.routePath,
      message: `Social preview asset path must be under /social/generated/: ${target.assetPath}`,
      assetPath: target.assetPath,
      field: "assetPath",
      value: target.assetPath,
    },
  ];
}

function unsafeAssetPathFindings(
  target: SocialPreviewTarget,
): readonly SocialPreviewValidationFinding[] {
  if (generatedAssetPathPattern.test(target.assetPath)) {
    return [];
  }

  return [
    {
      code: "unsafe-asset-path",
      routePath: target.routePath,
      message: `Social preview asset path is unsafe: ${target.assetPath}`,
      assetPath: target.assetPath,
      field: "assetPath",
      value: target.assetPath,
    },
  ];
}

function dimensionFindings(target: SocialPreviewTarget): readonly SocialPreviewValidationFinding[] {
  if (
    target.dimensions.width === SOCIAL_PREVIEW_DIMENSIONS.width &&
    target.dimensions.height === SOCIAL_PREVIEW_DIMENSIONS.height
  ) {
    return [];
  }

  return [
    {
      code: "wrong-dimensions",
      routePath: target.routePath,
      message: `Social preview dimensions must be ${SOCIAL_PREVIEW_DIMENSIONS.width}x${SOCIAL_PREVIEW_DIMENSIONS.height}.`,
      field: "dimensions",
      value: `${target.dimensions.width}x${target.dimensions.height}`,
    },
  ];
}

function textBudgetFindings(
  target: SocialPreviewTarget,
): readonly SocialPreviewValidationFinding[] {
  return [
    ...textFieldBudgetFindings(target, "title", SOCIAL_PREVIEW_TEXT_BUDGETS.maxTitleCharacters),
    ...textFieldBudgetFindings(
      target,
      "description",
      SOCIAL_PREVIEW_TEXT_BUDGETS.maxDescriptionCharacters,
    ),
    ...labelBudgetFindings(target),
    ...textFieldBudgetFindings(target, "alt", SOCIAL_PREVIEW_TEXT_BUDGETS.maxAltCharacters),
  ];
}

function textFieldBudgetFindings(
  target: SocialPreviewTarget,
  field: TextField,
  maxCharacters: number,
): readonly SocialPreviewValidationFinding[] {
  const value = target[field];

  if (value.length <= maxCharacters) {
    return [];
  }

  return [
    {
      code: "text-too-long",
      routePath: target.routePath,
      message: `Social preview ${field} exceeds ${maxCharacters} characters.`,
      field,
      value: value.length,
    },
  ];
}

function labelBudgetFindings(
  target: SocialPreviewTarget,
): readonly SocialPreviewValidationFinding[] {
  const findings: SocialPreviewValidationFinding[] = [];

  if (target.labels.length > SOCIAL_PREVIEW_TEXT_BUDGETS.maxLabels) {
    findings.push({
      code: "too-many-labels",
      routePath: target.routePath,
      message: `Social preview labels exceed ${SOCIAL_PREVIEW_TEXT_BUDGETS.maxLabels} labels.`,
      field: "labels",
      value: target.labels.length,
    });
  }

  for (const label of target.labels) {
    if (label.length <= SOCIAL_PREVIEW_TEXT_BUDGETS.maxLabelCharacters) {
      continue;
    }

    findings.push({
      code: "text-too-long",
      routePath: target.routePath,
      message: `Social preview label exceeds ${SOCIAL_PREVIEW_TEXT_BUDGETS.maxLabelCharacters} characters.`,
      field: "labels",
      value: label.length,
    });
  }

  return findings;
}

function unbrokenTokenFindings(
  target: SocialPreviewTarget,
): readonly SocialPreviewValidationFinding[] {
  return [
    ...unbrokenTokenFindingsForField(target, "title"),
    ...unbrokenTokenFindingsForField(target, "description"),
    ...unbrokenTokenFindingsForField(target, "kicker"),
    ...unbrokenTokenFindingsForField(target, "alt"),
    ...target.labels.flatMap((label) => unbrokenTokenFindingsForLabel(target, label)),
  ];
}

function unbrokenTokenFindingsForField(
  target: SocialPreviewTarget,
  field: TextField,
): readonly SocialPreviewValidationFinding[] {
  const tooLongToken = firstTooLongToken(target[field]);

  if (!tooLongToken) {
    return [];
  }

  return [
    {
      code: "unbroken-token-too-long",
      routePath: target.routePath,
      message: `Social preview ${field} has an unbroken token over ${SOCIAL_PREVIEW_TEXT_BUDGETS.maxUnbrokenTokenCharacters} characters.`,
      field,
      value: tooLongToken,
    },
  ];
}

function unbrokenTokenFindingsForLabel(
  target: SocialPreviewTarget,
  label: string,
): readonly SocialPreviewValidationFinding[] {
  const tooLongToken = firstTooLongToken(label);

  if (!tooLongToken) {
    return [];
  }

  return [
    {
      code: "unbroken-token-too-long",
      routePath: target.routePath,
      message: `Social preview label has an unbroken token over ${SOCIAL_PREVIEW_TEXT_BUDGETS.maxUnbrokenTokenCharacters} characters.`,
      field: "labels",
      value: tooLongToken,
    },
  ];
}

function firstTooLongToken(value: string): string | null {
  const text = value.trim();

  if (!text) {
    return null;
  }

  return (
    text
      .split(/\s+/)
      .find((token) => token.length > SOCIAL_PREVIEW_TEXT_BUDGETS.maxUnbrokenTokenCharacters) ??
    null
  );
}

function isSocialPreviewRouteKind(kind: string): kind is SocialPreviewRouteKind {
  return (socialPreviewRouteKinds as readonly string[]).includes(kind);
}
