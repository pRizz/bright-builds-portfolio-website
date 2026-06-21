import type { SocialPreviewTarget } from "../../src/domain/social-previews";
import { socialPreviewManifestVersion } from "./config";

export type SocialPreviewManifestEntry = {
  routePath: string;
  assetPath: string;
  dimensions: { width: 1200; height: 630 };
  byteSize: number;
  sourceFingerprint: string;
  sha256: string;
};

export type SocialPreviewManifest = {
  version: 1;
  entries: readonly SocialPreviewManifestEntry[];
};

export type SocialPreviewManifestInput = {
  target: SocialPreviewTarget;
  png: Buffer;
  dimensions: { width: number; height: number };
  sha256: string;
};

export function socialPreviewManifestForRenderedPreviews(
  rendered: readonly SocialPreviewManifestInput[],
): SocialPreviewManifest {
  const entries = rendered.map((preview) => ({
    routePath: preview.target.routePath,
    assetPath: preview.target.assetPath,
    dimensions: {
      width: preview.dimensions.width as 1200,
      height: preview.dimensions.height as 630,
    },
    byteSize: preview.png.length,
    sourceFingerprint: preview.target.sourceFingerprint,
    sha256: preview.sha256,
  }));

  return {
    version: socialPreviewManifestVersion,
    entries: [...entries].sort((left, right) => left.assetPath.localeCompare(right.assetPath)),
  };
}

export function serializeSocialPreviewManifest(manifest: SocialPreviewManifest): string {
  return `${JSON.stringify(stableManifest(manifest), null, 2)}\n`;
}

function stableManifest(manifest: SocialPreviewManifest): SocialPreviewManifest {
  return {
    version: socialPreviewManifestVersion,
    entries: [...manifest.entries]
      .sort((left, right) => left.assetPath.localeCompare(right.assetPath))
      .map((entry) => ({
        routePath: entry.routePath,
        assetPath: entry.assetPath,
        dimensions: {
          width: entry.dimensions.width,
          height: entry.dimensions.height,
        },
        byteSize: entry.byteSize,
        sourceFingerprint: entry.sourceFingerprint,
        sha256: entry.sha256,
      })),
  };
}
