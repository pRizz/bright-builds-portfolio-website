import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { projectDetailRoutes } from "../src/domain/projects";
import { prerenderRoutes } from "../src/domain/routes";
import { publicThemeEntries, themeDetailRoutes } from "../src/domain/themes";
import { publicWritingEntries, writingDetailRoutes } from "../src/domain/writing";
import { generatedOutputForbiddenPatterns } from "./verify-static/config";
import {
  expectedRoutes,
  maybeProjectForDetailRoute,
  maybeThemeForDetailRoute,
  maybeWritingForDetailRoute,
} from "./verify-static/expected-route-text";
import {
  assertForbiddenTextAbsent,
  escapeHtmlAttribute,
  escapeHtmlText,
  preHydrationBody,
} from "./verify-static/html-assertions";
import { staticVerificationSummary } from "./verify-static/run-static-verification";
import {
  assertNoPrerenderedThemeRoute,
  assertNoPrerenderedWritingRoute,
  assertNoRemoteRuntimeVisualAssets,
  assertReducedMotionCss,
  assertSitemapAssetsAndRobots,
  assertSitemapProjectDetailCoverage,
  assertSitemapWritingCoverage,
  assertThemeFallbackSource,
  assertWritingFallbackMetadataSource,
} from "./verify-static/sitemap-assets-verifier";

describe("static verifier import-safe helpers", () => {
  it("preserves writing route coverage evidence wording", () => {
    // Arrange
    const result = { routeCount: 13, outputRoot: ".output/public" };

    // Act
    const summary = staticVerificationSummary(result);

    // Assert
    expect(summary).toBe(
      "Verified 13 prerendered routes, metadata, JSON-LD, writing route coverage, assets, sitemap, and robots in .output/public.",
    );
  });

  it("imports the CLI without running generated output verification", async () => {
    // Arrange
    const importCli = () => import("./verify-static");

    // Act
    const cliModule = await importCli();

    // Assert
    expect(Object.keys(cliModule)).toEqual([]);
  });

  it("returns body content before the Solid manifest script", () => {
    // Arrange
    const htmlWithManifest =
      "<html><body><main>before</main><script>window.manifest = {}</script><main>after</main></body></html>";
    const htmlWithoutManifest = "<html><body><main>body only</main></body></html>";
    const htmlWithoutBody = "<main>fragment</main>";

    // Act
    const beforeManifest = preHydrationBody(htmlWithManifest);
    const wholeBody = preHydrationBody(htmlWithoutManifest);
    const fallback = preHydrationBody(htmlWithoutBody);

    // Assert
    expect(beforeManifest).toContain("<body><main>before</main>");
    expect(beforeManifest).not.toContain("after");
    expect(wholeBody).toBe("<body><main>body only</main></body></html>");
    expect(fallback).toBe(htmlWithoutBody);
  });

  it("preserves text and attribute escaping behavior", () => {
    // Arrange
    const text = "Bright & <builds>";
    const attribute = '"Bright" & <builds>';

    // Act
    const escapedText = escapeHtmlText(text);
    const escapedAttribute = escapeHtmlAttribute(attribute);

    // Assert
    expect(escapedText).toBe("Bright &amp; &lt;builds&gt;");
    expect(escapedAttribute).toBe("&quot;Bright&quot; &amp; &lt;builds&gt;");
  });

  it("rejects unsafe generated href patterns", () => {
    // Arrange
    const root = ".output/public";
    const htmlPath = ".output/public/index.html";
    const unsafeHtml = '<a href="javascript:alert(1)">bad</a><a href="data:text/html,bad">bad</a>';

    // Act
    const assertUnsafeHtml = () =>
      assertForbiddenTextAbsent(root, htmlPath, unsafeHtml, generatedOutputForbiddenPatterns);

    // Assert
    expect(assertUnsafeHtml).toThrow(/href="javascript:/);
  });

  it("rejects whitespace-prefixed unsafe generated href patterns", () => {
    // Arrange
    const root = ".output/public";
    const htmlPath = ".output/public/index.html";
    const unsafeJavaScriptHtml = '<a href=" javascript:alert(1)">bad</a>';
    const unsafeDataHtml = '<a href=" data:text/html,bad">bad</a>';

    // Act
    const assertUnsafeJavaScriptHtml = () =>
      assertForbiddenTextAbsent(
        root,
        htmlPath,
        unsafeJavaScriptHtml,
        generatedOutputForbiddenPatterns,
      );
    const assertUnsafeDataHtml = () =>
      assertForbiddenTextAbsent(root, htmlPath, unsafeDataHtml, generatedOutputForbiddenPatterns);

    // Assert
    expect(assertUnsafeJavaScriptHtml).toThrow(/href="javascript:/);
    expect(assertUnsafeDataHtml).toThrow(/href="data:/);
  });

  it("rejects remote image candidates inside mixed srcset values", () => {
    // Arrange
    const tempRoot = mkdtempSync(join(tmpdir(), "verify-static-assets-"));
    const htmlPath = join(tempRoot, "index.html");
    writeFileSync(
      htmlPath,
      '<img src="/local.png" srcset="/local.png 1x, https://cdn.example.com/image.png 2x">',
    );

    // Act
    const assertRemoteAssets = () => assertNoRemoteRuntimeVisualAssets(tempRoot, [htmlPath]);

    // Assert
    try {
      expect(assertRemoteAssets).toThrow(/remote asset image\/source srcset/);
    } finally {
      rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it("derives expected route coverage from domain helpers", () => {
    // Arrange
    const routes = expectedRoutes.map((check) => check.route);

    // Act
    const projectRoutes = projectDetailRoutes();
    const writingRoutes = writingDetailRoutes();

    // Assert
    expect(routes).toEqual(prerenderRoutes);
    expect(projectRoutes.length).toBeGreaterThan(0);
    expect(writingRoutes.length).toBeGreaterThan(0);
    for (const route of [...projectRoutes, ...writingRoutes]) {
      expect(routes).toContain(route);
    }
  });

  it("derives writing index and detail text from writing helpers", () => {
    // Arrange
    const writingIndex = expectedRoutes.find((check) => check.route === "/writing");
    const writingRoutes = writingDetailRoutes();

    // Act
    const publicEntries = publicWritingEntries();

    // Assert
    expect(writingIndex).toBeDefined();
    for (const entry of publicEntries) {
      expect(writingIndex?.expectedTexts).toContain(entry.title);
      expect(writingIndex?.expectedTexts).toContain(entry.summary);
    }

    for (const route of writingRoutes) {
      const maybeEntry = maybeWritingForDetailRoute(route);
      const maybeCheck = expectedRoutes.find((check) => check.route === route);

      expect(maybeEntry).not.toBeNull();
      expect(maybeCheck?.expectedTexts).toContain(maybeEntry?.title);
      expect(maybeCheck?.expectedTexts).toContain(maybeEntry?.summary);
    }
  });

  it("derives theme index and detail text from theme helpers", () => {
    // Arrange
    const themeIndex = expectedRoutes.find((check) => check.route === "/themes");
    const routes = themeDetailRoutes();

    // Act
    const publicEntries = publicThemeEntries();
    const checks = routes.map((route) => ({
      route,
      maybeTheme: maybeThemeForDetailRoute(route),
      maybeCheck: expectedRoutes.find((check) => check.route === route),
    }));

    // Assert
    expect(themeIndex).toBeDefined();
    for (const theme of publicEntries) {
      expect(themeIndex?.expectedTexts).toContain(theme.title);
      expect(themeIndex?.expectedTexts).toContain(theme.summary);
    }

    for (const { maybeCheck, maybeTheme } of checks) {
      expect(maybeTheme).not.toBeNull();

      if (!maybeTheme) {
        throw new Error("Expected public theme route helper to resolve a theme.");
      }

      expect(maybeCheck?.expectedTexts).toContain(maybeTheme.title);
      expect(maybeCheck?.expectedTexts).toContain(maybeTheme.summary);
      expect(maybeCheck?.expectedTexts).toContain("Related projects");
      expect(maybeCheck?.expectedTexts).toContain("Related writing");
    }
  });

  it("derives project detail text from project helpers", () => {
    // Arrange
    const routes = projectDetailRoutes();

    // Act
    const checks = routes.map((route) => ({
      route,
      maybeProject: maybeProjectForDetailRoute(route),
      maybeCheck: expectedRoutes.find((check) => check.route === route),
    }));

    // Assert
    for (const { maybeCheck, maybeProject } of checks) {
      expect(maybeProject).not.toBeNull();
      expect(maybeCheck?.expectedTexts).toContain(maybeProject?.name);
      expect(maybeCheck?.expectedTexts).toContain(maybeProject?.detail.intro);
      expect(maybeCheck?.expectedTexts).toContain("Project actions");
    }
  });

  it("keeps sitemap and asset verifier checks callable", () => {
    // Arrange
    const verifierExports = [
      assertSitemapAssetsAndRobots,
      assertSitemapProjectDetailCoverage,
      assertSitemapWritingCoverage,
      assertNoPrerenderedThemeRoute,
      assertNoPrerenderedWritingRoute,
      assertThemeFallbackSource,
      assertWritingFallbackMetadataSource,
      assertNoRemoteRuntimeVisualAssets,
      assertReducedMotionCss,
    ];

    // Act
    const exportTypes = verifierExports.map((verifierExport) => typeof verifierExport);

    // Assert
    expect(exportTypes).toEqual(verifierExports.map(() => "function"));
  });
});
