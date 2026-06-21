import type {
  SocialPreviewTarget,
  SocialPreviewValidationFinding,
} from "../../src/domain/social-previews";
import {
  type SocialPreviewManifest,
  type SocialPreviewManifestEntry,
  serializeSocialPreviewManifest,
} from "./manifest";

export type SocialPreviewCheckFindingCode =
  | "target-validation"
  | "missing-file"
  | "stale-fingerprint"
  | "checksum-drift"
  | "manifest-drift"
  | "wrong-dimensions"
  | "oversized-file"
  | "blank-image"
  | "orphan-managed-png"
  | "nondeterministic-render";

export type SocialPreviewCheckFinding = {
  code: SocialPreviewCheckFindingCode;
  message: string;
  routePath?: string;
  assetPath?: string;
};

export type SocialPreviewFileMetadata = {
  assetPath: string;
  exists: boolean;
  byteSize?: number;
  sha256?: string;
  dimensions?: { width: number; height: number };
};

export type SocialPreviewRenderedCheck = {
  target: SocialPreviewTarget;
  png: Buffer;
  pixels: Buffer;
  dimensions: { width: number; height: number };
  sha256: string;
};

export type SocialPreviewCheckInput = {
  targetValidationFindings: readonly SocialPreviewValidationFinding[];
  expectedManifest: SocialPreviewManifest;
  actualManifest: SocialPreviewManifest | null;
  expectedRenderedPreviews: readonly SocialPreviewRenderedCheck[];
  secondRenderHashes: ReadonlyMap<string, string>;
  actualFiles: readonly SocialPreviewFileMetadata[];
  orphanManagedPngAssetPaths: readonly string[];
  maxBytes: number;
};

export function isBlankRenderedImage(pixels: Buffer): boolean {
  if (pixels.length === 0) {
    return true;
  }

  const firstPixel = pixelKey(pixels, 0);

  for (let index = 4; index < pixels.length; index += 4) {
    if (pixelKey(pixels, index) !== firstPixel) {
      return false;
    }
  }

  return true;
}

export function socialPreviewCheckFindings(
  input: SocialPreviewCheckInput,
): readonly SocialPreviewCheckFinding[] {
  return [
    ...targetValidationCheckFindings(input.targetValidationFindings),
    ...missingFileFindings(input.expectedRenderedPreviews, input.actualFiles),
    ...manifestDriftFindings(input.expectedManifest, input.actualManifest),
    ...staleFingerprintFindings(input.expectedManifest, input.actualManifest),
    ...checksumDriftFindings(input.expectedRenderedPreviews, input.actualFiles),
    ...wrongDimensionFindings(input.expectedRenderedPreviews, input.actualFiles),
    ...oversizedFileFindings(input.actualFiles, input.maxBytes),
    ...blankImageFindings(input.expectedRenderedPreviews),
    ...orphanManagedPngFindings(input.orphanManagedPngAssetPaths),
    ...nondeterministicRenderFindings(input.expectedRenderedPreviews, input.secondRenderHashes),
  ];
}

function targetValidationCheckFindings(
  findings: readonly SocialPreviewValidationFinding[],
): readonly SocialPreviewCheckFinding[] {
  return findings.map((finding) => ({
    code: "target-validation",
    routePath: finding.routePath,
    assetPath: finding.assetPath,
    message: finding.message,
  }));
}

function missingFileFindings(
  renderedPreviews: readonly SocialPreviewRenderedCheck[],
  actualFiles: readonly SocialPreviewFileMetadata[],
): readonly SocialPreviewCheckFinding[] {
  const actualFileByAssetPath = fileMetadataByAssetPath(actualFiles);

  return renderedPreviews
    .filter((preview) => !actualFileByAssetPath.get(preview.target.assetPath)?.exists)
    .map((preview) => ({
      code: "missing-file",
      routePath: preview.target.routePath,
      assetPath: preview.target.assetPath,
      message: `Missing generated social preview PNG for ${preview.target.routePath}.`,
    }));
}

function manifestDriftFindings(
  expectedManifest: SocialPreviewManifest,
  actualManifest: SocialPreviewManifest | null,
): readonly SocialPreviewCheckFinding[] {
  if (!actualManifest) {
    return [
      {
        code: "manifest-drift",
        message: "Missing or unreadable social preview manifest.",
      },
    ];
  }

  if (
    serializeSocialPreviewManifest(actualManifest) ===
    serializeSocialPreviewManifest(expectedManifest)
  ) {
    return [];
  }

  return [
    {
      code: "manifest-drift",
      message: "Social preview manifest differs from the current rendered targets.",
    },
  ];
}

function staleFingerprintFindings(
  expectedManifest: SocialPreviewManifest,
  actualManifest: SocialPreviewManifest | null,
): readonly SocialPreviewCheckFinding[] {
  if (!actualManifest) {
    return [];
  }

  const expectedByAssetPath = manifestEntriesByAssetPath(expectedManifest);
  const findings: SocialPreviewCheckFinding[] = [];

  for (const actualEntry of actualManifest.entries) {
    const maybeExpectedEntry = expectedByAssetPath.get(actualEntry.assetPath);

    if (
      !maybeExpectedEntry ||
      maybeExpectedEntry.sourceFingerprint === actualEntry.sourceFingerprint
    ) {
      continue;
    }

    findings.push({
      code: "stale-fingerprint",
      routePath: maybeExpectedEntry.routePath,
      assetPath: actualEntry.assetPath,
      message: `Social preview source fingerprint is stale for ${actualEntry.assetPath}.`,
    });
  }

  return findings;
}

function checksumDriftFindings(
  renderedPreviews: readonly SocialPreviewRenderedCheck[],
  actualFiles: readonly SocialPreviewFileMetadata[],
): readonly SocialPreviewCheckFinding[] {
  const actualFileByAssetPath = fileMetadataByAssetPath(actualFiles);
  const findings: SocialPreviewCheckFinding[] = [];

  for (const preview of renderedPreviews) {
    const maybeActualFile = actualFileByAssetPath.get(preview.target.assetPath);

    if (!maybeActualFile?.exists || maybeActualFile.sha256 === preview.sha256) {
      continue;
    }

    findings.push({
      code: "checksum-drift",
      routePath: preview.target.routePath,
      assetPath: preview.target.assetPath,
      message: `Generated social preview PNG is stale for ${preview.target.routePath}.`,
    });
  }

  return findings;
}

function wrongDimensionFindings(
  renderedPreviews: readonly SocialPreviewRenderedCheck[],
  actualFiles: readonly SocialPreviewFileMetadata[],
): readonly SocialPreviewCheckFinding[] {
  const actualFileByAssetPath = fileMetadataByAssetPath(actualFiles);
  const findings: SocialPreviewCheckFinding[] = [];

  for (const preview of renderedPreviews) {
    const maybeActualFile = actualFileByAssetPath.get(preview.target.assetPath);

    if (
      !maybeActualFile?.dimensions ||
      (maybeActualFile.dimensions.width === preview.dimensions.width &&
        maybeActualFile.dimensions.height === preview.dimensions.height)
    ) {
      continue;
    }

    findings.push({
      code: "wrong-dimensions",
      routePath: preview.target.routePath,
      assetPath: preview.target.assetPath,
      message: `Generated social preview dimensions are ${maybeActualFile.dimensions.width}x${maybeActualFile.dimensions.height}, expected ${preview.dimensions.width}x${preview.dimensions.height}.`,
    });
  }

  return findings;
}

function oversizedFileFindings(
  actualFiles: readonly SocialPreviewFileMetadata[],
  maxBytes: number,
): readonly SocialPreviewCheckFinding[] {
  return actualFiles
    .filter((file) => file.exists && file.byteSize !== undefined && file.byteSize > maxBytes)
    .map((file) => ({
      code: "oversized-file",
      assetPath: file.assetPath,
      message: `Generated social preview PNG is ${file.byteSize} bytes; limit is ${maxBytes} bytes.`,
    }));
}

function blankImageFindings(
  renderedPreviews: readonly SocialPreviewRenderedCheck[],
): readonly SocialPreviewCheckFinding[] {
  return renderedPreviews
    .filter((preview) => isBlankRenderedImage(preview.pixels))
    .map((preview) => ({
      code: "blank-image",
      routePath: preview.target.routePath,
      assetPath: preview.target.assetPath,
      message: `Generated social preview render is blank for ${preview.target.routePath}.`,
    }));
}

function orphanManagedPngFindings(
  assetPaths: readonly string[],
): readonly SocialPreviewCheckFinding[] {
  return [...assetPaths]
    .sort((left, right) => left.localeCompare(right))
    .map((assetPath) => ({
      code: "orphan-managed-png",
      assetPath,
      message: `Managed social preview PNG is not represented by current targets: ${assetPath}.`,
    }));
}

function nondeterministicRenderFindings(
  renderedPreviews: readonly SocialPreviewRenderedCheck[],
  secondRenderHashes: ReadonlyMap<string, string>,
): readonly SocialPreviewCheckFinding[] {
  const findings: SocialPreviewCheckFinding[] = [];

  for (const preview of renderedPreviews) {
    const maybeSecondHash = secondRenderHashes.get(preview.target.assetPath);

    if (!maybeSecondHash || maybeSecondHash === preview.sha256) {
      continue;
    }

    findings.push({
      code: "nondeterministic-render",
      routePath: preview.target.routePath,
      assetPath: preview.target.assetPath,
      message: `Social preview render is nondeterministic for ${preview.target.routePath}.`,
    });
  }

  return findings;
}

function fileMetadataByAssetPath(
  files: readonly SocialPreviewFileMetadata[],
): ReadonlyMap<string, SocialPreviewFileMetadata> {
  return new Map(files.map((file) => [file.assetPath, file]));
}

function manifestEntriesByAssetPath(
  manifest: SocialPreviewManifest,
): ReadonlyMap<string, SocialPreviewManifestEntry> {
  return new Map(manifest.entries.map((entry) => [entry.assetPath, entry]));
}

function pixelKey(pixels: Buffer, index: number): string {
  return `${pixels[index] ?? 0},${pixels[index + 1] ?? 0},${pixels[index + 2] ?? 0},${
    pixels[index + 3] ?? 0
  }`;
}
