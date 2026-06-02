import { describe, expect, it } from "vitest";
import {
  accessibilityFindingsForRoute,
  budgetReportForFiles,
  budgetViolationsForReport,
  forbiddenBuiltOutputFindings,
  internalLinkFindings,
  releaseBudgetThresholds,
  releaseEvidenceLabels,
  type StaticReleaseRoute,
  semanticFindingsForRoute,
} from "./verify-release";

describe("release verifier forbidden output scanner", () => {
  it("catches GitHub runtime, client, environment, and token-like values", () => {
    // Arrange
    const forbiddenValues = [
      "api.github.com",
      "github.com/graphql",
      `@${"octokit/"}`,
      "GITHUB_TOKEN",
      "GITHUB_METADATA_TOKEN",
      "VITE_PRIVATE_GITHUB_TOKEN",
      "PUBLIC_GITHUB_METADATA_TOKEN",
      "SOLID_PUBLIC_GITHUB_ACCESS_TOKEN",
      "github_pat_11AABBCCDDEEFF0011223344556677889900aabbcc",
      "ghp_1234567890abcdefghijklmnopqrstuvwxyzABCD",
      "gho_1234567890abcdefghijklmnopqrstuvwxyzABCD",
      "ghu_1234567890abcdefghijklmnopqrstuvwxyzABCD",
      "ghs_1234567890abcdefghijklmnopqrstuvwxyzABCD",
      "ghr_1234567890abcdefghijklmnopqrstuvwxyzABCD",
    ];

    // Act
    const findings = forbiddenBuiltOutputFindings(
      forbiddenValues.map((text, index) => ({
        path: `asset-${index}.js`,
        text: `leaked ${text}`,
      })),
    );

    // Assert
    expect(findings.map((finding) => finding.label)).toEqual([
      "api.github.com",
      "github.com/graphql",
      "GitHub client dependency",
      "GITHUB_TOKEN",
      "GITHUB_METADATA_TOKEN",
      "VITE_[A-Z0-9_]*GITHUB[A-Z0-9_]*TOKEN",
      "PUBLIC_[A-Z0-9_]*GITHUB[A-Z0-9_]*TOKEN",
      "SOLID_PUBLIC_[A-Z0-9_]*GITHUB[A-Z0-9_]*TOKEN",
      "github_pat_ token-like value",
      "gh[pousr]_ token-like value",
      "gh[pousr]_ token-like value",
      "gh[pousr]_ token-like value",
      "gh[pousr]_ token-like value",
      "gh[pousr]_ token-like value",
    ]);
    expect(findings.map((finding) => finding.message).join("\n")).not.toContain(
      "github_pat_11AABBCCDDEEFF0011223344556677889900aabbcc",
    );
    expect(findings.map((finding) => finding.message).join("\n")).not.toContain(
      "ghp_1234567890abcdefghijklmnopqrstuvwxyzABCD",
    );
  });
});

describe("release verifier internal link checker", () => {
  it("accepts links whose route file and target anchor exist", () => {
    // Arrange
    const routes: readonly StaticReleaseRoute[] = [
      routeFixture(
        "/",
        '<a id="top"></a><a href="/projects#openlinks">Projects</a><a href="#top">Top</a>',
      ),
      routeFixture("/projects", '<section id="openlinks">OpenLinks</section>'),
    ];

    // Act
    const findings = internalLinkFindings(routes, new Set());

    // Assert
    expect(findings).toEqual([]);
  });

  it("rejects links to missing routes and missing anchor targets", () => {
    // Arrange
    const routes: readonly StaticReleaseRoute[] = [
      routeFixture(
        "/",
        '<a href="/missing">Missing</a><a href="/projects#missing-anchor">Broken</a>',
      ),
      routeFixture("/projects", '<section id="openlinks">OpenLinks</section>'),
    ];

    // Act
    const findings = internalLinkFindings(routes, new Set());

    // Assert
    expect(findings.map((finding) => finding.label)).toEqual([
      "internal link missing route",
      "internal link missing anchor",
    ]);
  });
});

describe("release verifier static budgets", () => {
  it("reports route HTML, JS, CSS, and named asset sizes with threshold failures", () => {
    // Arrange
    const files = [
      textFile("index.html", "h".repeat(76 * 1024)),
      textFile("_build/app.js", "j".repeat(90 * 1024)),
      textFile("_build/vendor.js", "v".repeat(61 * 1024)),
      textFile("_build/app.css", "c".repeat(101 * 1024)),
      binaryFile("social/bright-builds-og.png", 251 * 1024),
    ];

    // Act
    const report = budgetReportForFiles(files);
    const violations = budgetViolationsForReport(report, releaseBudgetThresholds);

    // Assert
    expect(report.routeHtmlBytes).toEqual(new Map([["/", 76 * 1024]]));
    expect(report.totalJsBytes).toBe(151 * 1024);
    expect(report.totalCssBytes).toBe(101 * 1024);
    expect(report.assetBytes.get("social/bright-builds-og.png")).toBe(251 * 1024);
    expect(violations.map((violation) => violation.label)).toEqual([
      "route HTML budget",
      "client JS budget",
      "CSS budget",
      "social/bright-builds-og.png budget",
    ]);
  });
});

describe("release verifier semantic checker", () => {
  it("requires one main, one h1, a skip link, JSON-LD, and no maintenance error copy", () => {
    // Arrange
    const html = [
      '<a class="skip-link" href="#content">Skip to content</a>',
      '<main id="content"><h1>Bright Builds</h1></main>',
      '<script type="application/ld+json">{"@type":"Person"}</script>',
    ].join("");

    // Act
    const validFindings = semanticFindingsForRoute(routeFixture("/", html));
    const invalidFindings = semanticFindingsForRoute(
      routeFixture("/projects", "<h1>One</h1><h1>Two</h1><p>GitHub metadata refresh failed.</p>"),
    );

    // Assert
    expect(validFindings).toEqual([]);
    expect(invalidFindings.map((finding) => finding.label)).toEqual([
      "one main landmark",
      "one h1 per route",
      "skip link",
      "JSON-LD",
      "visitor-facing GitHub metadata maintenance error copy",
    ]);
  });

  it("defers JSON-LD checks for project detail foundation routes", () => {
    // Arrange
    const html = [
      '<a class="skip-link" href="#content">Skip to content</a>',
      '<main id="content"><h1>OpenLinks</h1></main>',
    ].join("");

    // Act
    const findings = semanticFindingsForRoute(routeFixture("/projects/openlinks", html));

    // Assert
    expect(findings).toEqual([]);
  });
});

describe("release verifier accessibility and release evidence labels", () => {
  it("flags image alt gaps and missing focus-visible or focus state hooks", () => {
    // Arrange
    const route = routeFixture("/", '<img src="/brand.png" alt=""><img src="/missing.png">');

    // Act
    const findings = accessibilityFindingsForRoute(route, ".surface-link:hover { color: white; }");

    // Assert
    expect(findings.map((finding) => finding.label)).toEqual([
      "image alt",
      "image alt",
      "focus-visible",
      "focus state",
      "reduced-motion",
      "interactive motion surfaces",
    ]);
  });

  it("emits scoped browser-evidence labels without claiming external suite coverage", () => {
    // Arrange
    const route = routeFixture("/", '<img src="/brand.png" alt="Bright Builds preview">');
    const css = [
      ".skip-link:focus { outline: 2px solid currentColor; }",
      ".surface-link:focus-visible { outline: 2px solid currentColor; }",
      ".primary-link:focus { outline: 2px solid currentColor; }",
      ".reactive-surface { --pointer-x: 50%; }",
      ".interactive-surface { border-color: currentColor; }",
      "@media (prefers-reduced-motion: reduce) { * { animation: none; } }",
    ].join("\n");

    // Act
    const findings = accessibilityFindingsForRoute(route, css);
    const labels = releaseEvidenceLabels();

    // Assert
    expect(findings).toEqual([]);
    expect(labels).toEqual([
      "contrast/readability",
      "focus-visible",
      "focus state",
      "image alt",
      "interactive motion surfaces",
      "reduced-motion",
      "SEO/static metadata",
      "static performance budgets",
      "external link policy",
      "Cloudflare/static deployment",
      "preview and deploy smoke checks",
    ]);
    expect(labels.join(" ")).not.toContain("external suite");
  });
});

function routeFixture(route: string, html: string): StaticReleaseRoute {
  return {
    path: route === "/" ? "index.html" : `${route.slice(1)}/index.html`,
    route,
    html,
  };
}

function textFile(path: string, text: string) {
  return {
    kind: "text" as const,
    path,
    text,
    byteLength: Buffer.byteLength(text),
  };
}

function binaryFile(path: string, byteLength: number) {
  return {
    kind: "binary" as const,
    path,
    byteLength,
  };
}
