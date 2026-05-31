import { describe, expect, it } from "vitest";

import {
  externalLinkFindingsForRoutes,
  releaseReadinessDocumentFindings,
  releaseReadinessEvidenceLabels,
} from "./release-readiness";
import type { StaticReleaseRoute } from "./verify-release";

describe("release-readiness external link policy", () => {
  it("accepts covered HTTPS external links", () => {
    // Arrange
    const routes = [
      routeFixture(
        "/",
        [
          '<a href="https://github.com/pRizz">GitHub</a>',
          '<a href="https://openlinks.us/">OpenLinks</a>',
          '<a href="https://www.brightbuilds.us/">Bright Builds</a>',
          '<a href="https://freetheworld.ai/">Free the World</a>',
          '<a href="https://win3bitco.in/">Win3 Bitcoin</a>',
          '<a href="https://prizz.github.io/mystic-ui/">Mystic UI</a>',
        ].join(""),
      ),
    ];

    // Act
    const findings = externalLinkFindingsForRoutes(routes);

    // Assert
    expect(findings).toEqual([]);
  });

  it("rejects uncovered origins, non-HTTPS links, and missing primary links", () => {
    // Arrange
    const routes = [
      routeFixture(
        "/",
        [
          '<a href="http://github.com/pRizz">GitHub</a>',
          '<a href="https://docs.example.com/openlinks">Docs</a>',
        ].join(""),
      ),
    ];

    // Act
    const findings = externalLinkFindingsForRoutes(routes);

    // Assert
    expect(findings.map((finding) => finding.label)).toEqual([
      "primary external link presence",
      "primary external link presence",
      "external link protocol",
      "external link policy coverage",
      "external link policy coverage",
    ]);
  });

  it("reports sensitive query keys without leaking values", () => {
    // Arrange
    const secretValue = "github_pat_11AABBCCDDEEFF0011223344556677889900aabbcc";
    const routes = [
      routeFixture(
        "/",
        [
          '<a href="https://github.com/pRizz">GitHub</a>',
          '<a href="https://openlinks.us/">OpenLinks</a>',
          `<a href="https://openlinks.us/?access_token=${secretValue}">Unsafe</a>`,
        ].join(""),
      ),
    ];

    // Act
    const findings = externalLinkFindingsForRoutes(routes);
    const messages = findings.map((finding) => finding.message).join("\n");

    // Assert
    expect(findings.map((finding) => finding.label)).toEqual(["external link sensitive query"]);
    expect(messages).toContain("access_token");
    expect(messages).not.toContain(secretValue);
  });
});

describe("release-readiness document contract", () => {
  it("accepts the checked-in release-readiness document", () => {
    // Arrange
    const documentPath = "docs/release-readiness.md";

    // Act
    const findings = releaseReadinessDocumentFindings(documentPath);

    // Assert
    expect(findings).toEqual([]);
  });

  it("reports missing release-readiness facts", () => {
    // Arrange
    const missingDocumentPath = "docs/not-a-release-readiness-file.md";

    // Act
    const findings = releaseReadinessDocumentFindings(missingDocumentPath);

    // Assert
    expect(findings).toEqual([
      {
        path: missingDocumentPath,
        label: "release-readiness document",
        message: "Release-readiness document is missing.",
      },
    ]);
  });

  it("names release-readiness evidence covered by the aggregate gate", () => {
    // Arrange
    const expectedLabels = [
      "SEO/static metadata",
      "static performance budgets",
      "external link policy",
      "Cloudflare/static deployment",
      "preview and deploy smoke checks",
    ];

    // Act
    const labels = releaseReadinessEvidenceLabels();

    // Assert
    expect(labels).toEqual(expectedLabels);
  });
});

function routeFixture(route: string, html: string): StaticReleaseRoute {
  return {
    path: route === "/" ? "index.html" : `${route.slice(1)}/index.html`,
    route,
    html,
  };
}
