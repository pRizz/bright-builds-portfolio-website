import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

import {
  type SocialPreviewTarget,
  type SocialPreviewValidationFinding,
  socialPreviewTargets,
  validateSocialPreviewTargets,
} from "../src/domain/social-previews";
import {
  type SocialPreviewCheckFinding,
  socialPreviewCheckFindings,
} from "./social-previews/check";
import { socialPreviewCheckInput } from "./social-previews/check-input";
import { socialPreviewManifestPath } from "./social-previews/config";
import {
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
  const checkInput = socialPreviewCheckInput({
    targets,
    targetValidationFindings: [],
  });
  const findings = socialPreviewCheckFindings(checkInput);

  if (findings.length > 0) {
    printCheckFindings(findings);
    return false;
  }

  console.log(
    `Verified ${checkInput.expectedRenderedPreviews.length} deterministic social preview PNGs and manifest entries.`,
  );
  return true;
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
