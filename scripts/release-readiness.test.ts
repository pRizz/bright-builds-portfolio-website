import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { themeDetailRoutes } from "../src/domain/themes";
import { writingDetailRoutes } from "../src/domain/writing";
import {
  automatedReleaseReadinessEvidenceLabels,
  externalLinkFindingsForRoutes,
  manualReleaseChecklistLabels,
  releaseReadinessDocumentFindings,
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

  it("rejects protocol-relative external links", () => {
    // Arrange
    const routes = [
      routeFixture(
        "/",
        [
          '<a href="https://github.com/pRizz">GitHub</a>',
          '<a href="https://openlinks.us/">OpenLinks</a>',
          '<a href="//docs.example.com/openlinks">Docs</a>',
        ].join(""),
      ),
    ];

    // Act
    const findings = externalLinkFindingsForRoutes(routes);

    // Assert
    expect(findings.map((finding) => finding.label)).toEqual([
      "external link protocol",
      "external link policy coverage",
    ]);
    expect(findings.map((finding) => finding.message).join("\n")).toContain(
      "https://docs.example.com/openlinks",
    );
  });

  it("requires primary GitHub profile presence, not only project repository links", () => {
    // Arrange
    const routes = [
      routeFixture(
        "/",
        [
          '<a href="https://github.com/pRizz/openlinks">Project source</a>',
          '<a href="https://openlinks.us/">OpenLinks</a>',
        ].join(""),
      ),
    ];

    // Act
    const findings = externalLinkFindingsForRoutes(routes);
    const messages = findings.map((finding) => finding.message).join("\n");

    // Assert
    expect(findings.map((finding) => finding.label)).toEqual(["primary external link presence"]);
    expect(messages).toContain("https://github.com/pRizz");
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

  it("reports missing Playwright Chromium provisioning guidance", () => {
    // Arrange
    const fixture = releaseDocumentFixtureWithout("bun run install:browser");

    try {
      // Act
      const findings = releaseReadinessDocumentFindings(fixture.path);
      const messages = findings.map((finding) => finding.message).join("\n");

      // Assert
      expect(findings.map((finding) => finding.label)).toContain("release-readiness document");
      expect(messages).toContain(
        "Release-readiness document is missing Playwright Chromium provisioning command: bun run install:browser.",
      );
    } finally {
      fixture.cleanup();
    }
  });

  it("reports missing offline freshness report guidance", () => {
    // Arrange
    const fixture = releaseDocumentFixtureWithout("bun run report:freshness");

    try {
      // Act
      const findings = releaseReadinessDocumentFindings(fixture.path);
      const messages = findings.map((finding) => finding.message).join("\n");

      // Assert
      expect(findings.map((finding) => finding.label)).toContain("release-readiness document");
      expect(messages).toContain(
        "Release-readiness document is missing offline freshness report command: bun run report:freshness.",
      );
    } finally {
      fixture.cleanup();
    }
  });

  it("reports missing reviewed static evidence guidance", () => {
    // Arrange
    const fixture = releaseDocumentFixtureWithout("reviewed static evidence");

    try {
      // Act
      const findings = releaseReadinessDocumentFindings(fixture.path);
      const messages = findings.map((finding) => finding.message).join("\n");

      // Assert
      expect(findings.map((finding) => finding.label)).toContain("release-readiness document");
      expect(messages).toContain(
        "Release-readiness document is missing reviewed static evidence boundary: reviewed static evidence.",
      );
    } finally {
      fixture.cleanup();
    }
  });

  it("reports missing freshness report live and manual smoke boundaries", () => {
    // Arrange
    const removals = [
      [
        "does not prove current live GitHub state",
        "Release-readiness document is missing live GitHub boundary: does not prove current live GitHub state.",
      ],
      [
        "does not crawl live external links",
        "Release-readiness document is missing live external-link boundary: does not crawl live external links.",
      ],
      [
        "does not run hosted social crawler validation",
        "Release-readiness document is missing social crawler boundary: does not run hosted social crawler validation.",
      ],
      [
        "manual smoke",
        "Release-readiness document is missing manual smoke severity: manual smoke.",
      ],
    ] as const;

    for (const [textToRemove, expectedMessage] of removals) {
      const fixture = releaseDocumentFixtureWithout(textToRemove);

      try {
        // Act
        const findings = releaseReadinessDocumentFindings(fixture.path);
        const messages = findings.map((finding) => finding.message).join("\n");

        // Assert
        expect(findings.map((finding) => finding.label)).toContain("release-readiness document");
        expect(messages).toContain(expectedMessage);
      } finally {
        fixture.cleanup();
      }
    }
  });

  it("rejects negated release facts even when the required command names appear", () => {
    // Arrange
    const fixture = releaseDocumentFixtureWithReplacements([
      [
        "```bash\nbun run verify\n```",
        "Do not treat a bare mention of bun run verify as release evidence.",
      ],
      ["`bun run verify:browser` runs", "`bun run verify:browser` does not run"],
    ]);

    try {
      // Act
      const findings = releaseReadinessDocumentFindings(fixture.path);
      const messages = findings.map((finding) => finding.message).join("\n");

      // Assert
      expect(messages).toContain(
        "Release-readiness document is missing aggregate release command: bun run verify.",
      );
      expect(messages).toContain(
        "Release-readiness document is missing browser release gate: bun run verify:browser.",
      );
    } finally {
      fixture.cleanup();
    }
  });

  it("reports missing project helper surface gate guidance", () => {
    // Arrange
    const fixture = releaseDocumentFixtureWithout("bun run verify:project-helper-surface");

    try {
      // Act
      const findings = releaseReadinessDocumentFindings(fixture.path);
      const messages = findings.map((finding) => finding.message).join("\n");

      // Assert
      expect(findings.map((finding) => finding.label)).toContain("release-readiness document");
      expect(messages).toContain(
        "Release-readiness document is missing project helper surface gate: bun run verify:project-helper-surface.",
      );
    } finally {
      fixture.cleanup();
    }
  });

  it("reports missing social preview verification gate guidance", () => {
    // Arrange
    const fixture = releaseDocumentFixtureWithout("bun run verify:social-previews");

    try {
      // Act
      const findings = releaseReadinessDocumentFindings(fixture.path);
      const messages = findings.map((finding) => finding.message).join("\n");

      // Assert
      expect(findings.map((finding) => finding.label)).toContain("release-readiness document");
      expect(messages).toContain(
        "Release-readiness document is missing social preview verification gate: bun run verify:social-previews.",
      );
    } finally {
      fixture.cleanup();
    }
  });

  it("reports missing social preview generation guidance", () => {
    // Arrange
    const fixture = releaseDocumentFixtureWithout("bun run generate:social-previews");

    try {
      // Act
      const findings = releaseReadinessDocumentFindings(fixture.path);
      const messages = findings.map((finding) => finding.message).join("\n");

      // Assert
      expect(findings.map((finding) => finding.label)).toContain("release-readiness document");
      expect(messages).toContain(
        "Release-readiness document is missing social preview generation command: bun run generate:social-previews.",
      );
    } finally {
      fixture.cleanup();
    }
  });

  it("reports missing generated social preview manifest and budget guidance", () => {
    // Arrange
    const removals = [
      [
        "public/social/generated/manifest.json",
        "Release-readiness document is missing generated preview manifest: public/social/generated/manifest.json.",
      ],
      [
        ".output/public/social/generated/manifest.json",
        "Release-readiness document is missing static output generated preview manifest: .output/public/social/generated/manifest.json.",
      ],
      [
        "generated social preview PNG total",
        "Release-readiness document is missing generated social preview total budget: generated social preview PNG total.",
      ],
    ] as const;

    for (const [textToRemove, expectedMessage] of removals) {
      const fixture = releaseDocumentFixtureWithout(textToRemove);

      try {
        // Act
        const findings = releaseReadinessDocumentFindings(fixture.path);
        const messages = findings.map((finding) => finding.message).join("\n");

        // Assert
        expect(findings.map((finding) => finding.label)).toContain("release-readiness document");
        expect(messages).toContain(expectedMessage);
      } finally {
        fixture.cleanup();
      }
    }
  });

  it("reports missing manual social-card smoke guidance", () => {
    // Arrange
    const removals = [
      [
        "Manual social-card smoke check",
        "Release-readiness document is missing manual social-card smoke check: Manual social-card smoke check.",
      ],
      [
        "hosted social-card validation, current live GitHub state, live external-link reachability, and preview/production smoke checks are not part of `bun run verify`",
        "Release-readiness document is missing manual social-card verification boundary: not part of `bun run verify`.",
      ],
    ] as const;

    for (const [textToRemove, expectedMessage] of removals) {
      const fixture = releaseDocumentFixtureWithout(textToRemove);

      try {
        // Act
        const findings = releaseReadinessDocumentFindings(fixture.path);
        const messages = findings.map((finding) => finding.message).join("\n");

        // Assert
        expect(findings.map((finding) => finding.label)).toContain("release-readiness document");
        expect(messages).toContain(expectedMessage);
      } finally {
        fixture.cleanup();
      }
    }
  });

  it("reports missing low-intrusion OpenLinks posture", () => {
    // Arrange
    const fixture = releaseDocumentFixtureWithout("not a primary route CTA or brand replacement");

    try {
      // Act
      const findings = releaseReadinessDocumentFindings(fixture.path);
      const messages = findings.map((finding) => finding.message).join("\n");

      // Assert
      expect(findings.map((finding) => finding.label)).toContain("release-readiness document");
      expect(messages).toContain(
        "Release-readiness document is missing OpenLinks low-intrusion posture: not a primary route CTA or brand replacement.",
      );
    } finally {
      fixture.cleanup();
    }
  });

  it("reports missing project detail route coverage guidance", () => {
    // Arrange
    const fixture = releaseDocumentFixtureWithout("project detail route coverage");

    try {
      // Act
      const findings = releaseReadinessDocumentFindings(fixture.path);
      const messages = findings.map((finding) => finding.message).join("\n");

      // Assert
      expect(findings.map((finding) => finding.label)).toContain("release-readiness document");
      expect(messages).toContain(
        "Release-readiness document is missing project detail route coverage: project detail route coverage.",
      );
    } finally {
      fixture.cleanup();
    }
  });

  it("reports missing project detail static coverage guidance", () => {
    // Arrange
    const fixture = releaseDocumentFixtureWithout(
      "project detail metadata, JSON-LD, and sitemap coverage",
    );

    try {
      // Act
      const findings = releaseReadinessDocumentFindings(fixture.path);
      const messages = findings.map((finding) => finding.message).join("\n");

      // Assert
      expect(findings.map((finding) => finding.label)).toContain("release-readiness document");
      expect(messages).toContain(
        "Release-readiness document is missing project detail static coverage: project detail metadata, JSON-LD, and sitemap coverage.",
      );
    } finally {
      fixture.cleanup();
    }
  });

  it("reports missing project detail browser coverage guidance", () => {
    // Arrange
    const fixture = releaseDocumentFixtureWithout(
      "project detail axe, layout, representative keyboard, and representative reduced-motion coverage",
    );

    try {
      // Act
      const findings = releaseReadinessDocumentFindings(fixture.path);
      const messages = findings.map((finding) => finding.message).join("\n");

      // Assert
      expect(findings.map((finding) => finding.label)).toContain("release-readiness document");
      expect(messages).toContain(
        "Release-readiness document is missing project detail browser coverage: project detail axe, layout, representative keyboard, and representative reduced-motion coverage.",
      );
    } finally {
      fixture.cleanup();
    }
  });

  it("reports missing selected project smoke route guidance", () => {
    // Arrange
    const fixture = releaseDocumentFixtureWithout("/projects/openlinks");

    try {
      // Act
      const findings = releaseReadinessDocumentFindings(fixture.path);
      const messages = findings.map((finding) => finding.message).join("\n");

      // Assert
      expect(findings.map((finding) => finding.label)).toContain("release-readiness document");
      expect(messages).toContain(
        "Release-readiness document is missing selected project smoke route: /projects/openlinks.",
      );
    } finally {
      fixture.cleanup();
    }
  });

  it("reports missing writing route coverage guidance", () => {
    // Arrange
    const fixture = releaseDocumentFixtureWithout("writing route coverage");

    try {
      // Act
      const findings = releaseReadinessDocumentFindings(fixture.path);
      const messages = findings.map((finding) => finding.message).join("\n");

      // Assert
      expect(findings.map((finding) => finding.label)).toContain("release-readiness document");
      expect(messages).toContain(
        "Release-readiness document is missing writing route coverage: writing route coverage.",
      );
    } finally {
      fixture.cleanup();
    }
  });

  it("reports missing writing static coverage guidance", () => {
    // Arrange
    const fixture = releaseDocumentFixtureWithout(
      "writing metadata, JSON-LD, sitemap, related-project link, and forbidden runtime residue coverage",
    );

    try {
      // Act
      const findings = releaseReadinessDocumentFindings(fixture.path);
      const messages = findings.map((finding) => finding.message).join("\n");

      // Assert
      expect(findings.map((finding) => finding.label)).toContain("release-readiness document");
      expect(messages).toContain(
        "Release-readiness document is missing writing static coverage: writing metadata, JSON-LD, sitemap, related-project link, and forbidden runtime residue coverage.",
      );
    } finally {
      fixture.cleanup();
    }
  });

  it("reports missing writing browser coverage guidance", () => {
    // Arrange
    const fixture = releaseDocumentFixtureWithout(
      "writing axe, layout, representative keyboard, and representative reduced-motion coverage",
    );

    try {
      // Act
      const findings = releaseReadinessDocumentFindings(fixture.path);
      const messages = findings.map((finding) => finding.message).join("\n");

      // Assert
      expect(findings.map((finding) => finding.label)).toContain("release-readiness document");
      expect(messages).toContain(
        "Release-readiness document is missing writing browser coverage: writing axe, layout, representative keyboard, and representative reduced-motion coverage.",
      );
    } finally {
      fixture.cleanup();
    }
  });

  it("reports missing selected writing smoke route guidance", () => {
    // Arrange
    const fixture = releaseDocumentFixtureWithout(representativeWritingDetailRoute());

    try {
      // Act
      const findings = releaseReadinessDocumentFindings(fixture.path);
      const messages = findings.map((finding) => finding.message).join("\n");

      // Assert
      expect(findings.map((finding) => finding.label)).toContain("release-readiness document");
      expect(messages).toContain(
        `Release-readiness document is missing selected writing smoke route: ${representativeWritingDetailRoute()}.`,
      );
    } finally {
      fixture.cleanup();
    }
  });

  it("reports missing theme route coverage guidance", () => {
    // Arrange
    const fixture = releaseDocumentFixtureWithout("theme route coverage");

    try {
      // Act
      const findings = releaseReadinessDocumentFindings(fixture.path);
      const messages = findings.map((finding) => finding.message).join("\n");

      // Assert
      expect(findings.map((finding) => finding.label)).toContain("release-readiness document");
      expect(messages).toContain(
        "Release-readiness document is missing theme route coverage: theme route coverage.",
      );
    } finally {
      fixture.cleanup();
    }
  });

  it("reports missing theme static coverage guidance", () => {
    // Arrange
    const fixture = releaseDocumentFixtureWithout(
      "theme metadata, JSON-LD, sitemap, related project links, related writing links, collaboration links, and forbidden runtime residue coverage",
    );

    try {
      // Act
      const findings = releaseReadinessDocumentFindings(fixture.path);
      const messages = findings.map((finding) => finding.message).join("\n");

      // Assert
      expect(findings.map((finding) => finding.label)).toContain("release-readiness document");
      expect(messages).toContain(
        "Release-readiness document is missing theme static coverage: theme metadata, JSON-LD, sitemap, related project links, related writing links, collaboration links, and forbidden runtime residue coverage.",
      );
    } finally {
      fixture.cleanup();
    }
  });

  it("reports missing theme browser coverage guidance", () => {
    // Arrange
    const fixture = releaseDocumentFixtureWithout(
      "theme axe, desktop/mobile dark layout, representative keyboard, and representative reduced-motion coverage",
    );

    try {
      // Act
      const findings = releaseReadinessDocumentFindings(fixture.path);
      const messages = findings.map((finding) => finding.message).join("\n");

      // Assert
      expect(findings.map((finding) => finding.label)).toContain("release-readiness document");
      expect(messages).toContain(
        "Release-readiness document is missing theme browser coverage: theme axe, desktop/mobile dark layout, representative keyboard, and representative reduced-motion coverage.",
      );
    } finally {
      fixture.cleanup();
    }
  });

  it("reports missing representative theme smoke route guidance", () => {
    // Arrange
    const fixture = releaseDocumentFixtureWithout(representativeThemeDetailRoute());

    try {
      // Act
      const findings = releaseReadinessDocumentFindings(fixture.path);
      const messages = findings.map((finding) => finding.message).join("\n");

      // Assert
      expect(findings.map((finding) => finding.label)).toContain("release-readiness document");
      expect(messages).toContain(
        `Release-readiness document is missing representative theme smoke route: ${representativeThemeDetailRoute()}.`,
      );
    } finally {
      fixture.cleanup();
    }
  });

  it("names automated release-readiness evidence covered by the aggregate gate", () => {
    // Arrange
    const expectedLabels = [
      "SEO/static metadata",
      "project detail route coverage",
      "writing route coverage",
      "theme route coverage",
      "static performance budgets",
      "external link policy",
    ];

    // Act
    const labels = automatedReleaseReadinessEvidenceLabels();

    // Assert
    expect(labels).toEqual(expectedLabels);
  });

  it("keeps manual release checklist labels separate from automated evidence", () => {
    // Arrange
    const expectedLabels = ["Cloudflare/static deployment", "preview and deploy smoke checks"];

    // Act
    const labels = manualReleaseChecklistLabels();

    // Assert
    expect(labels).toEqual(expectedLabels);
  });
});

describe("aggregate release script contract", () => {
  it("runs release verification last without hidden mutation or browser install steps", () => {
    // Arrange
    const expectedVerifyScript =
      "bun run format:check && bun run check && bun run typecheck && bun run test && bun run verify:curation && bun run verify:no-github-runtime && bun run verify:project-helper-surface && bun run verify:visual-system && bun run verify:social-previews && bun run build && bun run verify:browser && bun run verify:static && bun run verify:release";
    const forbiddenVerifySteps = [
      "bun run generate:static-metadata",
      "bun run generate:social-previews",
      "bun run install:browser",
      "report:freshness",
      "freshness:live",
      "smoke:hosted",
      "sync:github-metadata",
      "scripts/sync-github-metadata.ts",
      "https://",
      "http://",
      "api.github.com",
      "github.com/graphql",
      "curl",
      "wget",
      "fetch",
    ];
    const packageJson = JSON.parse(readFileSync("package.json", "utf8")) as {
      scripts: Record<string, string>;
    };

    // Act
    const verifyScript = packageJson.scripts.verify;
    const socialPreviewCheckIndex = verifyScript.indexOf("bun run verify:social-previews");
    const buildIndex = verifyScript.indexOf("bun run build");
    const browserIndex = verifyScript.indexOf("bun run verify:browser");
    const staticIndex = verifyScript.indexOf("bun run verify:static");
    const releaseIndex = verifyScript.indexOf("bun run verify:release");
    const verifySegments = verifyScript.split(" && ");

    // Assert
    expect(verifyScript).toBe(expectedVerifyScript);
    expect(socialPreviewCheckIndex).toBeLessThan(buildIndex);
    expect(buildIndex).toBeLessThan(browserIndex);
    expect(staticIndex).toBeLessThan(releaseIndex);
    expect(verifySegments.at(-1)).toBe("bun run verify:release");
    expect(verifyScript).toContain("bun run verify:no-github-runtime");
    expect(packageJson.scripts["report:freshness"]).toBe(
      "bun run scripts/generate-freshness-report.ts",
    );
    for (const forbiddenStep of forbiddenVerifySteps) {
      expect(verifyScript).not.toContain(forbiddenStep);
    }
  });
});

function routeFixture(route: string, html: string): StaticReleaseRoute {
  return {
    path: route === "/" ? "index.html" : `${route.slice(1)}/index.html`,
    route,
    html,
  };
}

function releaseDocumentFixtureWithout(textToRemove: string) {
  const directoryPath = mkdtempSync(join(tmpdir(), "release-readiness-"));
  const documentPath = join(directoryPath, "release-readiness.md");
  const documentText = readFileSync("docs/release-readiness.md", "utf8").replaceAll(
    textToRemove,
    "",
  );

  writeFileSync(documentPath, documentText);

  return {
    path: documentPath,
    cleanup: () => rmSync(directoryPath, { recursive: true, force: true }),
  };
}

function releaseDocumentFixtureWithReplacements(
  replacements: readonly (readonly [string, string])[],
) {
  const directoryPath = mkdtempSync(join(tmpdir(), "release-readiness-"));
  const documentPath = join(directoryPath, "release-readiness.md");
  let documentText = readFileSync("docs/release-readiness.md", "utf8");

  for (const [from, to] of replacements) {
    documentText = documentText.replaceAll(from, to);
  }

  writeFileSync(documentPath, documentText);

  return {
    path: documentPath,
    cleanup: () => rmSync(directoryPath, { recursive: true, force: true }),
  };
}

function representativeWritingDetailRoute(): string {
  const maybeRoute = writingDetailRoutes()[0];

  if (!maybeRoute) {
    throw new Error("Expected at least one public writing detail route for release coverage.");
  }

  return maybeRoute;
}

function representativeThemeDetailRoute(): string {
  const maybeRoute = themeDetailRoutes()[0];

  if (!maybeRoute) {
    throw new Error("Expected at least one public theme detail route for release coverage.");
  }

  return maybeRoute;
}
