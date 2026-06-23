import { describe, expect, it } from "vitest";
import { type ProjectStory, projectDetailPath, projectDetailRoutes } from "./projects";
import {
  maybeSocialPreviewTargetForRoutePath,
  SOCIAL_PREVIEW_DIMENSIONS,
  SOCIAL_PREVIEW_FALLBACK_IMAGE,
  SOCIAL_PREVIEW_TEXT_BUDGETS,
  socialPreviewTargets,
  sourceFingerprintForSocialPreviewPayload,
  validateSocialPreviewTargets,
} from "./social-previews";
import { type ThemeRecord, themeDetailPath, themeDetailRoutes } from "./themes";
import { type WritingEntry, writingDetailPath, writingDetailRoutes } from "./writing";

describe("social preview target contract", () => {
  it("derives the default target route paths from existing public route helpers", () => {
    // Arrange
    const expectedRoutePaths = [
      "/projects",
      ...projectDetailRoutes(),
      "/writing",
      ...writingDetailRoutes(),
      "/themes",
      ...themeDetailRoutes(),
    ];

    // Act
    const routePaths = socialPreviewTargets().map((target) => target.routePath);

    // Assert
    expect(routePaths).toEqual(expectedRoutePaths);
  });

  it("filters fixture records through existing public project, writing, and theme selectors", () => {
    // Arrange
    const selectedProject = makeProjectStory({ slug: "selected-detail", displayOrder: 10 });
    const hiddenProject = makeProjectStory({
      slug: "hidden-detail",
      placement: "hidden",
      status: "hidden",
      includeInProjectIndex: false,
      displayOrder: 20,
    });
    const excludedProject = makeProjectStory({
      slug: "excluded-detail",
      tier: "excluded",
      displayOrder: 30,
    });
    const noDetailProject = makeProjectStory({
      slug: "no-detail",
      detail: undefined,
      displayOrder: 40,
    });
    const unselectedProject = makeProjectStory({
      slug: "supporting-detail",
      tier: "supporting",
      displayOrder: 50,
    });
    const archivedStatusProject = makeProjectStory({
      slug: "archived-status-detail",
      status: "archived",
      displayOrder: 60,
    });
    const archivedMaturityProject = makeProjectStory({
      slug: "archived-maturity-detail",
      maturity: "archived",
      displayOrder: 70,
    });
    const publicWriting = makeWritingEntry({ slug: "public-note", displayOrder: 10 });
    const draftWriting = makeWritingEntry({
      slug: "draft-note",
      status: "draft",
      displayOrder: 20,
    });
    const hiddenWriting = makeWritingEntry({
      slug: "hidden-note",
      status: "hidden",
      displayOrder: 30,
    });
    const archivedWriting = makeWritingEntry({
      slug: "archived-note",
      status: "archived",
      displayOrder: 40,
    });
    const publicTheme = makeThemeRecord({ slug: "public-theme", displayOrder: 10 });
    const draftTheme = makeThemeRecord({
      slug: "draft-theme",
      status: "draft",
      displayOrder: 20,
    });
    const hiddenTheme = makeThemeRecord({
      slug: "hidden-theme",
      status: "hidden",
      displayOrder: 30,
    });
    const unsupportedTheme = makeThemeRecord({
      slug: "unsupported-theme",
      status: "unsupported",
      displayOrder: 40,
    });
    const archivedTheme = makeThemeRecord({
      slug: "archived-theme",
      status: "archived",
      displayOrder: 50,
    });

    // Act
    const routePaths = socialPreviewTargets({
      projects: [
        selectedProject,
        hiddenProject,
        excludedProject,
        noDetailProject,
        unselectedProject,
        archivedStatusProject,
        archivedMaturityProject,
      ],
      writingEntries: [publicWriting, draftWriting, hiddenWriting, archivedWriting],
      themes: [publicTheme, draftTheme, hiddenTheme, unsupportedTheme, archivedTheme],
    }).map((target) => target.routePath);

    // Assert
    expect(routePaths).toEqual([
      "/projects",
      projectDetailPath(selectedProject),
      "/writing",
      writingDetailPath(publicWriting),
      "/themes",
      themeDetailPath(publicTheme),
    ]);
    expect(routePaths).not.toContain(projectDetailPath(hiddenProject));
    expect(routePaths).not.toContain(projectDetailPath(excludedProject));
    expect(routePaths).not.toContain(projectDetailPath(noDetailProject));
    expect(routePaths).not.toContain(projectDetailPath(unselectedProject));
    expect(routePaths).not.toContain(projectDetailPath(archivedStatusProject));
    expect(routePaths).not.toContain(projectDetailPath(archivedMaturityProject));
    expect(routePaths).not.toContain(writingDetailPath(draftWriting));
    expect(routePaths).not.toContain(writingDetailPath(hiddenWriting));
    expect(routePaths).not.toContain(writingDetailPath(archivedWriting));
    expect(routePaths).not.toContain(themeDetailPath(draftTheme));
    expect(routePaths).not.toContain(themeDetailPath(hiddenTheme));
    expect(routePaths).not.toContain(themeDetailPath(unsupportedTheme));
    expect(routePaths).not.toContain(themeDetailPath(archivedTheme));
  });

  it("provides complete route-specific target data for every covered target", () => {
    // Arrange
    // Mirrors the unescaped family contract: /social/generated/(projects|writing|themes).
    const generatedAssetPathPattern =
      /^\/social\/generated\/(projects|writing|themes)\/[a-z0-9-]+-[a-f0-9]{12}\.png$/;
    const sourceFingerprintPattern = /^[a-f0-9]{12}$/;

    // Act
    const targets = socialPreviewTargets();

    // Assert
    for (const target of targets) {
      expect(target.assetPath).toMatch(generatedAssetPathPattern);
      expect(target.dimensions).toEqual(SOCIAL_PREVIEW_DIMENSIONS);
      expect(target.sourceFingerprint).toMatch(sourceFingerprintPattern);
      expect(target.assetPath).toContain(target.sourceFingerprint);
      expect(target.title.trim()).not.toHaveLength(0);
      expect(target.description.trim()).not.toHaveLength(0);
      expect(target.kicker.trim()).not.toHaveLength(0);
      expect(target.alt.trim()).not.toHaveLength(0);
      expect(target.alt).not.toBe(SOCIAL_PREVIEW_FALLBACK_IMAGE.alt);
      expect(target.labels.length).toBeGreaterThanOrEqual(1);
      expect(target.labels.length).toBeLessThanOrEqual(SOCIAL_PREVIEW_TEXT_BUDGETS.maxLabels);
      for (const label of target.labels) {
        expect(label.trim()).not.toHaveLength(0);
      }
    }
  });

  it("keeps default social preview targets valid", () => {
    // Arrange
    const targets = socialPreviewTargets();

    // Act
    const findings = validateSocialPreviewTargets(targets);

    // Assert
    expect(findings).toEqual([]);
  });

  it("keeps generic routes on the fallback image contract", () => {
    // Arrange
    const genericRoutes = ["/", "/about", "/contact", "/unknown"];

    // Act
    const maybeTargets = genericRoutes.map((routePath) =>
      maybeSocialPreviewTargetForRoutePath(routePath),
    );

    // Assert
    expect(SOCIAL_PREVIEW_FALLBACK_IMAGE).toMatchObject({
      assetPath: "/social/bright-builds-og.png",
      dimensions: SOCIAL_PREVIEW_DIMENSIONS,
    });
    expect(SOCIAL_PREVIEW_FALLBACK_IMAGE.alt.trim()).not.toHaveLength(0);
    expect(maybeTargets).toEqual([null, null, null, null]);
  });

  it("hashes normalized social preview payloads into stable source fingerprints", () => {
    // Arrange
    const payload = {
      routePath: "/projects/example",
      title: "Example project",
      description: "A concise example project summary.",
      kind: "project" as const,
      kicker: "Project Story",
      labels: ["AI", "Bright Builds", "testing"],
      alt: "Social preview for Example project, a Bright Builds project story.",
      dimensions: SOCIAL_PREVIEW_DIMENSIONS,
    };
    const reorderedLabelsPayload = {
      ...payload,
      labels: ["testing", "AI", "Bright Builds"],
    };
    const reorderedDimensionsPayload = {
      ...payload,
      dimensions: {
        height: SOCIAL_PREVIEW_DIMENSIONS.height,
        width: SOCIAL_PREVIEW_DIMENSIONS.width,
      },
    };

    // Act
    const fingerprint = sourceFingerprintForSocialPreviewPayload(payload);
    const reorderedLabelsFingerprint =
      sourceFingerprintForSocialPreviewPayload(reorderedLabelsPayload);
    const reorderedDimensionsFingerprint = sourceFingerprintForSocialPreviewPayload(
      reorderedDimensionsPayload,
    );
    const titleFingerprint = sourceFingerprintForSocialPreviewPayload({
      ...payload,
      title: "Changed project",
    });
    const descriptionFingerprint = sourceFingerprintForSocialPreviewPayload({
      ...payload,
      description: "Changed description.",
    });
    const labelsFingerprint = sourceFingerprintForSocialPreviewPayload({
      ...payload,
      labels: ["AI", "Bright Builds", "changed"],
    });
    const altFingerprint = sourceFingerprintForSocialPreviewPayload({
      ...payload,
      alt: "Changed route-specific alt text.",
    });

    // Assert
    expect(fingerprint).toMatch(/^[a-f0-9]{12}$/);
    expect(reorderedLabelsFingerprint).toBe(fingerprint);
    expect(reorderedDimensionsFingerprint).toBe(fingerprint);
    expect(titleFingerprint).not.toBe(fingerprint);
    expect(descriptionFingerprint).not.toBe(fingerprint);
    expect(labelsFingerprint).not.toBe(fingerprint);
    expect(altFingerprint).not.toBe(fingerprint);
  });

  it("returns structured validation findings for all required finding codes", () => {
    // Arrange
    const baseTarget = socialPreviewTargets()[0];

    if (!baseTarget) {
      throw new Error("Expected at least one social preview target for validation fixtures.");
    }

    const longUnbrokenToken = "x".repeat(
      SOCIAL_PREVIEW_TEXT_BUDGETS.maxUnbrokenTokenCharacters + 1,
    );
    const invalidTargets = [
      baseTarget,
      { ...baseTarget },
      {
        ...baseTarget,
        routePath: "/missing-text",
        assetPath: "/social/generated/projects/missing-text-123456789abc.png",
        title: " ",
        description: " ",
        kicker: " ",
        labels: [" "],
        alt: " ",
      },
      {
        ...baseTarget,
        routePath: "/unsupported-kind",
        assetPath: "/social/generated/projects/unsupported-kind-123456789abc.png",
        kind: "home" as never,
      },
      {
        ...baseTarget,
        routePath: "/remote-asset",
        assetPath: "https://example.com/social/generated/projects/remote-asset-123456789abc.png",
      },
      {
        ...baseTarget,
        routePath: "/non-generated",
        assetPath: "/social/manual/non-generated-123456789abc.png",
      },
      {
        ...baseTarget,
        routePath: "/unsafe-asset",
        assetPath: "/social/generated/projects/../unsafe-asset-123456789abc.png",
      },
      {
        ...baseTarget,
        routePath: "/wrong-dimensions",
        assetPath: "/social/generated/projects/wrong-dimensions-123456789abc.png",
        dimensions: { width: 600, height: 315 } as never,
      },
      {
        ...baseTarget,
        routePath: "/text-too-long",
        assetPath: "/social/generated/projects/text-too-long-123456789abc.png",
        title: "T".repeat(SOCIAL_PREVIEW_TEXT_BUDGETS.maxTitleCharacters + 1),
        description: "D".repeat(SOCIAL_PREVIEW_TEXT_BUDGETS.maxDescriptionCharacters + 1),
        alt: "A".repeat(SOCIAL_PREVIEW_TEXT_BUDGETS.maxAltCharacters + 1),
      },
      {
        ...baseTarget,
        routePath: "/too-many-labels",
        assetPath: "/social/generated/projects/too-many-labels-123456789abc.png",
        labels: ["one", "two", "three", "four", "five"],
      },
      {
        ...baseTarget,
        routePath: "/unbroken-token-too-long",
        assetPath: "/social/generated/projects/unbroken-token-too-long-123456789abc.png",
        title: longUnbrokenToken,
      },
    ];
    const expectedCodes = [
      "duplicate-route-path",
      "duplicate-asset-path",
      "missing-required-text",
      "unsupported-route-kind",
      "non-local-asset-path",
      "non-generated-asset-path",
      "unsafe-asset-path",
      "wrong-dimensions",
      "text-too-long",
      "too-many-labels",
      "unbroken-token-too-long",
    ] as const;

    // Act
    const findings = validateSocialPreviewTargets(invalidTargets);
    const codes = new Set(findings.map((finding) => finding.code));

    // Assert
    expect(findings).toEqual(
      expect.arrayContaining(
        expectedCodes.map((code) =>
          expect.objectContaining({
            code,
            routePath: expect.any(String),
            message: expect.any(String),
          }),
        ),
      ),
    );
    for (const code of expectedCodes) {
      expect(codes.has(code)).toBe(true);
    }
  });

  it("rejects non-canonical generated asset slug shapes", () => {
    // Arrange
    const baseTarget = socialPreviewTargets()[0];

    if (!baseTarget) {
      throw new Error("Expected at least one social preview target for asset path fixtures.");
    }

    const targets = [
      {
        ...baseTarget,
        routePath: "/leading-dash",
        assetPath: "/social/generated/projects/-bad-slug-123456789abc.png",
      },
      {
        ...baseTarget,
        routePath: "/trailing-dash",
        assetPath: "/social/generated/projects/bad-slug--123456789abc.png",
      },
      {
        ...baseTarget,
        routePath: "/consecutive-dash",
        assetPath: "/social/generated/projects/bad--slug-123456789abc.png",
      },
    ];

    // Act
    const findings = validateSocialPreviewTargets(targets);

    // Assert
    expect(findings).toEqual(
      expect.arrayContaining(
        targets.map((target) =>
          expect.objectContaining({
            code: "unsafe-asset-path",
            routePath: target.routePath,
            assetPath: target.assetPath,
            field: "assetPath",
          }),
        ),
      ),
    );
  });
});

function makeProjectStory(overrides: Partial<ProjectStory>): ProjectStory {
  return {
    slug: "base-project",
    name: "Base project",
    aliases: [],
    placement: "home",
    tier: "flagship",
    sourceType: "original",
    maturity: "active",
    status: "building",
    includeOnHome: true,
    includeInProjectIndex: true,
    displayOrder: 10,
    themes: ["Testing"],
    tags: ["test"],
    role: "Creator",
    oneLine: "Base project summary.",
    story: {
      problem: "A test project problem.",
      approach: "A test project approach.",
      whyItMatters: "A test project rationale.",
    },
    detail: {
      intro: "A selected project detail intro.",
      technicalShape: "A selected project technical shape.",
      proofPoints: ["A selected project proof point."],
      currentStatus: "Building.",
      collaborationAngle: "A selected project collaboration angle.",
    },
    curationReason: "Included for social preview tests.",
    originalWork: { kind: "original" },
    links: [{ label: "Source", href: "https://github.com/pRizz/base-project", kind: "repo" }],
    ...overrides,
  };
}

function makeWritingEntry(overrides: Partial<WritingEntry>): WritingEntry {
  return {
    slug: "base-writing-entry",
    title: "Base writing entry",
    summary: "Base summary for a writing entry.",
    status: "published",
    kind: "note",
    maybePublishedOn: "2026-06-03",
    displayOrder: 10,
    topics: ["Testing"],
    tags: ["test"],
    relatedProjectSlugs: [],
    sections: [
      {
        heading: "Base section",
        blocks: [{ kind: "paragraph", text: "Base paragraph body." }],
      },
    ],
    ...overrides,
  };
}

function makeThemeRecord(overrides: Partial<ThemeRecord>): ThemeRecord {
  return {
    slug: "base-theme",
    title: "Base theme",
    summary: "Base summary for a theme path.",
    status: "public",
    displayOrder: 10,
    audience: "Builders evaluating a test theme path.",
    proofPoints: ["A concrete proof point for the theme path."],
    collaborationAngle: "A practical collaboration angle for the theme path.",
    relatedProjectSlugs: ["base-project"],
    relatedWritingSlugs: ["base-writing-entry"],
    ...overrides,
  };
}
