import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";

import type {
  SocialPreviewTarget,
  SocialPreviewValidationFinding,
} from "../../src/domain/social-previews";
import type { SocialPreviewCheckInput, SocialPreviewFileMetadata } from "./check";
import { maxSocialPreviewPngBytes, socialPreviewManifestPath } from "./config";
import { type SocialPreviewManifest, socialPreviewManifestForRenderedPreviews } from "./manifest";
import {
  assetPathForGeneratedSocialPreviewFilePath,
  generatedSocialPreviewFilePathForAssetPath,
  managedSocialPreviewPngFiles,
} from "./paths";
import { renderSocialPreviewTarget } from "./render";

const pngSignature = "89504e470d0a1a0a";

type SocialPreviewCheckInputOptions = {
  targets: readonly SocialPreviewTarget[];
  targetValidationFindings: readonly SocialPreviewValidationFinding[];
};

export function socialPreviewCheckInput(
  options: SocialPreviewCheckInputOptions,
): SocialPreviewCheckInput {
  const firstRenderedPreviews = options.targets.map(renderSocialPreviewTarget);
  const secondRenderHashes = new Map(
    options.targets.map((target) => [target.assetPath, renderSocialPreviewTarget(target).sha256]),
  );
  const expectedManifest = socialPreviewManifestForRenderedPreviews(firstRenderedPreviews);
  const actualManifest = readActualManifest();
  const actualFiles = firstRenderedPreviews.map((preview) => fileMetadataForTarget(preview.target));
  const expectedAssetPaths = new Set(options.targets.map((target) => target.assetPath));
  const orphanManagedPngAssetPaths = managedSocialPreviewPngFiles()
    .map(assetPathForGeneratedSocialPreviewFilePath)
    .filter((assetPath) => !expectedAssetPaths.has(assetPath));

  return {
    targetValidationFindings: options.targetValidationFindings,
    expectedManifest,
    actualManifest,
    expectedRenderedPreviews: firstRenderedPreviews,
    secondRenderHashes,
    actualFiles,
    orphanManagedPngAssetPaths,
    maxBytes: maxSocialPreviewPngBytes,
  };
}

function fileMetadataForTarget(target: SocialPreviewTarget): SocialPreviewFileMetadata {
  const filePath = generatedSocialPreviewFilePathForAssetPath(target.assetPath);

  if (!existsSync(filePath)) {
    return {
      assetPath: target.assetPath,
      exists: false,
    };
  }

  const data = readFileSync(filePath);
  const stats = statSync(filePath);

  return {
    assetPath: target.assetPath,
    exists: true,
    byteSize: stats.size,
    sha256: createHash("sha256").update(data).digest("hex"),
    dimensions: pngDimensions(data) ?? { width: 0, height: 0 },
  };
}

function readActualManifest(): SocialPreviewManifest | null {
  if (!existsSync(socialPreviewManifestPath)) {
    return null;
  }

  try {
    const parsedManifest: unknown = JSON.parse(readFileSync(socialPreviewManifestPath, "utf8"));

    if (isSocialPreviewManifest(parsedManifest)) {
      return parsedManifest;
    }
  } catch {
    return null;
  }

  return null;
}

function isSocialPreviewManifest(value: unknown): value is SocialPreviewManifest {
  if (!isRecord(value) || value.version !== 1 || !Array.isArray(value.entries)) {
    return false;
  }

  return value.entries.every(isSocialPreviewManifestEntry);
}

function isSocialPreviewManifestEntry(value: unknown): boolean {
  if (!isRecord(value) || !isRecord(value.dimensions)) {
    return false;
  }

  return (
    typeof value.routePath === "string" &&
    typeof value.assetPath === "string" &&
    value.dimensions.width === 1200 &&
    value.dimensions.height === 630 &&
    typeof value.byteSize === "number" &&
    typeof value.sourceFingerprint === "string" &&
    typeof value.sha256 === "string"
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function pngDimensions(data: Buffer): { width: number; height: number } | null {
  if (data.length < 24 || data.subarray(0, 8).toString("hex") !== pngSignature) {
    return null;
  }

  return {
    width: data.readUInt32BE(16),
    height: data.readUInt32BE(20),
  };
}
