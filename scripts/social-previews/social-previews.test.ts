import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  SOCIAL_PREVIEW_DIMENSIONS,
  type SocialPreviewTarget,
} from "../../src/domain/social-previews";
import {
  assetPathForGeneratedSocialPreviewFilePath,
  generatedSocialPreviewFilePathForAssetPath,
  managedSocialPreviewPngFiles,
} from "./paths";
import {
  serializeSocialPreviewManifest,
  socialPreviewManifestForRenderedPreviews,
} from "./manifest";
import {
  escapeSvgText,
  renderSocialPreviewSvg,
  wrappedSvgTextLines,
} from "./template";

const baseTarget = {
  routePath: "/projects/example",
  assetPath: "/social/generated/projects/example-123456789abc.png",
  title: "Example & <Project>",
  description: "A deterministic preview for practical software work.",
  kind: "project",
  kicker: "Project Story",
  labels: ["AI", "Open tools"],
  alt: `Social preview "Example" & <Project>`,
  dimensions: SOCIAL_PREVIEW_DIMENSIONS,
  sourceFingerprint: "123456789abc",
} as const satisfies SocialPreviewTarget;

describe("social preview generation helpers", () => {
  it("escapes SVG text and wraps long content deterministically", () => {
    // Arrange
    const unsafeText = `Bright & <builds> "quote" 'single'`;

    // Act
    const escapedText = escapeSvgText(unsafeText);
    const wrappedLines = wrappedSvgTextLines("alpha beta gamma delta", {
      maxCharactersPerLine: 10,
      maxLines: 2,
    });

    // Assert
    expect(escapedText).toBe(
      "Bright &amp; &lt;builds&gt; &quot;quote&quot; &apos;single&apos;",
    );
    expect(wrappedLines).toEqual(["alpha beta", "gamma"]);
  });

  it("renders a dark-primary scoped SVG template from target data", () => {
    // Arrange
    const target = baseTarget;

    // Act
    const svg = renderSocialPreviewSvg(target);

    // Assert
    expect(svg).toContain('role="img"');
    expect(svg).toContain('width="1200"');
    expect(svg).toContain('height="630"');
    expect(svg).toContain("#07111f");
    expect(svg).toContain("#0f1f2e");
    expect(svg).toContain("#2fd6a3");
    expect(svg).toContain("#f7fbff");
    expect(svg).toContain("Bright Builds / Peter Ryszkiewicz");
    expect(svg).toContain("Example &amp; &lt;Project&gt;");
    expect(svg).toContain("Social preview &quot;Example&quot; &amp; &lt;Project&gt;");
    expect(svg).not.toContain("OpenLinks profile");
    expect(svg).not.toMatch(/fetch\(|Date|Math\.random|process\.env|@import/);
  });

  it("guards generated social preview paths inside the managed directory", () => {
    // Arrange
    const assetPath = "/social/generated/projects/example-123456789abc.png";
    const rejectedAssetPaths = [
      "/social/bright-builds-og.png",
      "/favicon.svg",
      "https://example.com/image.png",
      "/social/generated/../bright-builds-og.png",
      "/social/generated/projects/example.svg",
    ];

    // Act
    const filePath = generatedSocialPreviewFilePathForAssetPath(assetPath);
    const roundTripAssetPath = assetPathForGeneratedSocialPreviewFilePath(filePath);

    // Assert
    expect(filePath).toBe("public/social/generated/projects/example-123456789abc.png");
    expect(roundTripAssetPath).toBe(assetPath);
    for (const rejectedAssetPath of rejectedAssetPaths) {
      expect(() => generatedSocialPreviewFilePathForAssetPath(rejectedAssetPath)).toThrow();
    }
  });

  it("lists managed PNG files in stable order", () => {
    // Arrange
    const root = mkdtempSync(join(tmpdir(), "social-preview-paths-"));
    const firstPath = join(root, "writing", "b.png");
    const secondPath = join(root, "projects", "a.png");
    mkdirSync(join(root, "writing"));
    mkdirSync(join(root, "projects"));
    writeFileSync(firstPath, "");
    writeFileSync(secondPath, "");
    writeFileSync(join(root, "ignored.svg"), "");

    try {
      // Act
      const files = managedSocialPreviewPngFiles(root);

      // Assert
      expect(files).toEqual(
        [secondPath, firstPath].sort((left, right) => left.localeCompare(right)),
      );
    } finally {
      rmSync(root, { force: true, recursive: true });
    }
  });

  it("builds a sorted timestamp-free manifest with stable JSON", () => {
    // Arrange
    const firstTarget = {
      ...baseTarget,
      routePath: "/writing/example",
      assetPath: "/social/generated/writing/example-abcdef123456.png",
      sourceFingerprint: "abcdef123456",
    } satisfies SocialPreviewTarget;
    const secondTarget = baseTarget;
    const rendered = [
      {
        target: firstTarget,
        png: Buffer.from("first"),
        dimensions: SOCIAL_PREVIEW_DIMENSIONS,
        sha256: "f".repeat(64),
      },
      {
        target: secondTarget,
        png: Buffer.from("second"),
        dimensions: SOCIAL_PREVIEW_DIMENSIONS,
        sha256: "a".repeat(64),
      },
    ];

    // Act
    const manifest = socialPreviewManifestForRenderedPreviews(rendered);
    const serialized = serializeSocialPreviewManifest(manifest);

    // Assert
    expect(manifest.entries.map((entry) => entry.assetPath)).toEqual([
      secondTarget.assetPath,
      firstTarget.assetPath,
    ]);
    expect(serialized.endsWith("\n")).toBe(true);
    expect(serialized).toContain('"version": 1');
    expect(serialized).toContain('"routePath"');
    expect(serialized).toContain('"sourceFingerprint"');
    expect(serialized).not.toMatch(/generatedAt|createdAt|timestamp|commit|cwd/);
  });
});
