import { type ProjectStory, projectDetailPageProjects, projectDetailPath } from "./projects";
import { routeByPath } from "./routes";
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
const sha256InitialHashValues = [
  0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
] as const;
const sha256RoundConstants = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
] as const;

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

function sha256Hex(input: string): string {
  const messageBytes = new TextEncoder().encode(input);
  const bitLength = messageBytes.length * 8;
  const paddedLength = Math.ceil((messageBytes.length + 9) / 64) * 64;
  const paddedBytes = new Uint8Array(paddedLength);
  const words = new Uint32Array(64);
  const hash: number[] = [...sha256InitialHashValues];

  paddedBytes.set(messageBytes);
  paddedBytes[messageBytes.length] = 0x80;

  for (let index = 0; index < 8; index += 1) {
    paddedBytes[paddedLength - 1 - index] = (bitLength / 2 ** (8 * index)) & 0xff;
  }

  for (let chunkOffset = 0; chunkOffset < paddedBytes.length; chunkOffset += 64) {
    for (let index = 0; index < 16; index += 1) {
      const byteOffset = chunkOffset + index * 4;
      words[index] =
        ((paddedBytes[byteOffset] ?? 0) << 24) |
        ((paddedBytes[byteOffset + 1] ?? 0) << 16) |
        ((paddedBytes[byteOffset + 2] ?? 0) << 8) |
        (paddedBytes[byteOffset + 3] ?? 0);
    }

    for (let index = 16; index < 64; index += 1) {
      const smallSigma0 =
        rotateRight(words[index - 15] ?? 0, 7) ^
        rotateRight(words[index - 15] ?? 0, 18) ^
        ((words[index - 15] ?? 0) >>> 3);
      const smallSigma1 =
        rotateRight(words[index - 2] ?? 0, 17) ^
        rotateRight(words[index - 2] ?? 0, 19) ^
        ((words[index - 2] ?? 0) >>> 10);

      words[index] =
        ((words[index - 16] ?? 0) + smallSigma0 + (words[index - 7] ?? 0) + smallSigma1) >>> 0;
    }

    const workingHash: number[] = [...hash];

    for (let index = 0; index < 64; index += 1) {
      const bigSigma1 =
        rotateRight(workingHash[4] ?? 0, 6) ^
        rotateRight(workingHash[4] ?? 0, 11) ^
        rotateRight(workingHash[4] ?? 0, 25);
      const choice =
        ((workingHash[4] ?? 0) & (workingHash[5] ?? 0)) ^
        (~(workingHash[4] ?? 0) & (workingHash[6] ?? 0));
      const temp1 =
        ((workingHash[7] ?? 0) +
          bigSigma1 +
          choice +
          (sha256RoundConstants[index] ?? 0) +
          (words[index] ?? 0)) >>>
        0;
      const bigSigma0 =
        rotateRight(workingHash[0] ?? 0, 2) ^
        rotateRight(workingHash[0] ?? 0, 13) ^
        rotateRight(workingHash[0] ?? 0, 22);
      const majority =
        ((workingHash[0] ?? 0) & (workingHash[1] ?? 0)) ^
        ((workingHash[0] ?? 0) & (workingHash[2] ?? 0)) ^
        ((workingHash[1] ?? 0) & (workingHash[2] ?? 0));
      const temp2 = (bigSigma0 + majority) >>> 0;

      workingHash[7] = workingHash[6] ?? 0;
      workingHash[6] = workingHash[5] ?? 0;
      workingHash[5] = workingHash[4] ?? 0;
      workingHash[4] = ((workingHash[3] ?? 0) + temp1) >>> 0;
      workingHash[3] = workingHash[2] ?? 0;
      workingHash[2] = workingHash[1] ?? 0;
      workingHash[1] = workingHash[0] ?? 0;
      workingHash[0] = (temp1 + temp2) >>> 0;
    }

    for (let index = 0; index < hash.length; index += 1) {
      hash[index] = ((hash[index] ?? 0) + (workingHash[index] ?? 0)) >>> 0;
    }
  }

  return hash.map((value) => value.toString(16).padStart(8, "0")).join("");
}

function rotateRight(value: number, bits: number): number {
  return (value >>> bits) | (value << (32 - bits));
}
