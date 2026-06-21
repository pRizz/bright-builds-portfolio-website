import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

import {
  type SocialPreviewTarget,
  type SocialPreviewValidationFinding,
  socialPreviewTargets,
  validateSocialPreviewTargets,
} from "../src/domain/social-previews";
import {
  type SocialPreviewCheckFinding,
  type SocialPreviewFileMetadata,
  socialPreviewCheckFindings,
} from "./social-previews/check";
import { maxSocialPreviewPngBytes, socialPreviewManifestPath } from "./social-previews/config";
import {
  type SocialPreviewManifest,
  serializeSocialPreviewManifest,
  socialPreviewManifestForRenderedPreviews,
} from "./social-previews/manifest";
import {
  assetPathForGeneratedSocialPreviewFilePath,
  generatedSocialPreviewFilePathForAssetPath,
  managedSocialPreviewPngFiles,
} from "./social-previews/paths";
import { renderSocialPreviewTarget } from "./social-previews/render";

const usage = "Usage: bun run scripts/generate-social-previews.ts [--check]";
const pngSignature = "89504e470d0a1a0a";

type Mode = "generate" | "check";

function main(): boolean {
  const maybeMode = parseMode(process.argv.slice(2));

  if (!maybeMode) {
    console.error(usage);
    return false;
  }

  const targets = socialPreviewTargets();
  const validationFindings = validateSocialPreviewTargets(targets);

  if (validationFindings.length > 0) {
    printValidationFindings(validationFindings);
    return false;
  }

  if (maybeMode === "check") {
    return checkSocialPreviews(targets);
  }

  generateSocialPreviews(targets);
  return true;
}

function parseMode(args: readonly string[]): Mode | null {
  if (args.length === 0) {
    return "generate";
  }

  if (args.length === 1 && args[0] === "--check") {
    return "check";
  }

  return null;
}

function generateSocialPreviews(targets: readonly SocialPreviewTarget[]): void {
  const renderedPreviews = targets.map(renderSocialPreviewTarget);
  const expectedAssetPaths = new Set(targets.map((target) => target.assetPath));

  for (const preview of renderedPreviews) {
    const filePath = generatedSocialPreviewFilePathForAssetPath(preview.target.assetPath);
    mkdirSync(dirname(filePath), { recursive: true });

    if (!existsSync(filePath) || !readFileSync(filePath).equals(preview.png)) {
      writeFileSync(filePath, preview.png);
    }
  }

  for (const managedPngFilePath of managedSocialPreviewPngFiles()) {
    const assetPath = assetPathForGeneratedSocialPreviewFilePath(managedPngFilePath);

    if (!expectedAssetPaths.has(assetPath)) {
      rmSync(managedPngFilePath);
    }
  }

  const manifest = socialPreviewManifestForRenderedPreviews(renderedPreviews);
  const serializedManifest = serializeSocialPreviewManifest(manifest);
  mkdirSync(dirname(socialPreviewManifestPath), { recursive: true });

  if (
    !existsSync(socialPreviewManifestPath) ||
    readFileSync(socialPreviewManifestPath, "utf8") !== serializedManifest
  ) {
    writeFileSync(socialPreviewManifestPath, serializedManifest);
  }

  console.log(
    `Generated ${renderedPreviews.length} social preview PNGs and ${socialPreviewManifestPath}.`,
  );
}

function checkSocialPreviews(targets: readonly SocialPreviewTarget[]): boolean {
  const firstRenderedPreviews = targets.map(renderSocialPreviewTarget);
  const secondRenderHashes = new Map(
    targets.map((target) => [target.assetPath, renderSocialPreviewTarget(target).sha256]),
  );
  const expectedManifest = socialPreviewManifestForRenderedPreviews(firstRenderedPreviews);
  const actualManifest = readActualManifest();
  const actualFiles = firstRenderedPreviews.map((preview) => fileMetadataForTarget(preview.target));
  const expectedAssetPaths = new Set(targets.map((target) => target.assetPath));
  const orphanManagedPngAssetPaths = managedSocialPreviewPngFiles()
    .map(assetPathForGeneratedSocialPreviewFilePath)
    .filter((assetPath) => !expectedAssetPaths.has(assetPath));
  const findings = socialPreviewCheckFindings({
    targetValidationFindings: [],
    expectedManifest,
    actualManifest,
    expectedRenderedPreviews: firstRenderedPreviews,
    secondRenderHashes,
    actualFiles,
    orphanManagedPngAssetPaths,
    maxBytes: maxSocialPreviewPngBytes,
  });

  if (findings.length > 0) {
    printCheckFindings(findings);
    return false;
  }

  console.log(
    `Verified ${firstRenderedPreviews.length} deterministic social preview PNGs and manifest entries.`,
  );
  return true;
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

function printValidationFindings(
  validationFindings: readonly SocialPreviewValidationFinding[],
): void {
  for (const finding of validationFindings) {
    console.error(
      `[social previews error] target-validation ${finding.routePath}: ${finding.message}`,
    );
  }
}

function printCheckFindings(findings: readonly SocialPreviewCheckFinding[]): void {
  for (const finding of findings) {
    console.error(
      `[social previews error] ${finding.code} ${finding.routePath ?? "-"} ${
        finding.assetPath ?? "-"
      }: ${finding.message}`,
    );
  }
}

if (!main()) {
  process.exitCode = 1;
}
