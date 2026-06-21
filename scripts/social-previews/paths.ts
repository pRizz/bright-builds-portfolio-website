import { existsSync, readdirSync, statSync } from "node:fs";
import { isAbsolute, join, relative, sep } from "node:path";

import { managedSocialPreviewDirectory } from "./config";

const generatedAssetPathPrefix = "/social/generated/";

export function generatedSocialPreviewFilePathForAssetPath(assetPath: string): string {
  if (!assetPath.startsWith(generatedAssetPathPrefix) || assetPath.startsWith("//")) {
    throw new Error(`Social preview asset path must be under ${generatedAssetPathPrefix}`);
  }

  if (!assetPath.endsWith(".png")) {
    throw new Error(`Social preview asset path must end with .png: ${assetPath}`);
  }

  const filePath = join("public", assetPath.replace(/^\//, ""));
  assertManagedSocialPreviewFilePath(filePath);

  return filePath;
}

export function assetPathForGeneratedSocialPreviewFilePath(filePath: string): string {
  assertManagedSocialPreviewFilePath(filePath);

  if (!filePath.endsWith(".png")) {
    throw new Error(`Managed social preview file must be a PNG: ${filePath}`);
  }

  const relativePath = relative("public", filePath).split(sep).join("/");

  return `/${relativePath}`;
}

export function managedSocialPreviewPngFiles(
  root = managedSocialPreviewDirectory,
): readonly string[] {
  if (!existsSync(root)) {
    return [];
  }

  return filesUnderDirectory(root)
    .filter((filePath) => filePath.endsWith(".png"))
    .sort((left, right) => left.localeCompare(right));
}

function filesUnderDirectory(directory: string): readonly string[] {
  const files: string[] = [];

  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry);
    const stats = statSync(path);

    if (stats.isDirectory()) {
      files.push(...filesUnderDirectory(path));
      continue;
    }

    if (stats.isFile()) {
      files.push(path);
    }
  }

  return files;
}

function assertManagedSocialPreviewFilePath(filePath: string): void {
  const relativeToManagedRoot = relative(managedSocialPreviewDirectory, filePath);

  if (relativeToManagedRoot.startsWith("..") || isAbsolute(relativeToManagedRoot)) {
    throw new Error(`Social preview file escaped managed directory: ${filePath}`);
  }
}
