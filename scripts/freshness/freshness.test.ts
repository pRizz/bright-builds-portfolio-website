import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import type { SocialPreviewCheckFindingCode } from "../social-previews/check";
import {
  githubSnapshotFreshness,
  maybeParseGitHubMetadataSnapshot,
  snapshotStaleAfterDays,
} from "./github-snapshot";
import {
  type FreshnessFinding,
  findingsBySeverity,
  formatFreshnessReport,
  freshnessFindingsForReleaseFindings,
  freshnessReport,
  freshnessSeverityOrder,
  hasReleaseBlockerFindings,
} from "./report";
import { freshnessFindingsForSocialPreviewChecks } from "./social-previews";
import { readStaticOutputRoutesForFreshness } from "./static-output";

describe("freshness report severity mapping", () => {
  it("maps every social preview check code to generated media release blockers", () => {
    // Arrange
    const codes: readonly SocialPreviewCheckFindingCode[] = [
      "target-validation",
      "missing-file",
      "stale-fingerprint",
      "checksum-drift",
      "manifest-drift",
      "wrong-dimensions",
      "oversized-file",
      "blank-image",
      "orphan-managed-png",
      "nondeterministic-render",
    ];

    // Act
    const findings = freshnessFindingsForSocialPreviewChecks(
      codes.map((code) => ({
        code,
        message: `${code} message`,
        routePath: "/projects/example",
        assetPath: "/social/generated/example.png",
      })),
    );

    // Assert
    expect(findings.map((finding) => finding.severity)).toEqual(codes.map(() => "release blocker"));
    expect(findings.map((finding) => finding.area)).toEqual(codes.map(() => "generated media"));
    expect(findings.map((finding) => finding.code)).toEqual(codes);
  });

  it("maps external-link policy findings to external link release blockers", () => {
    // Arrange
    const labels = [
      "primary external link presence",
      "external link protocol",
      "external link policy coverage",
      "external link sensitive query",
    ];

    // Act
    const findings = freshnessFindingsForReleaseFindings(
      labels.map((label) => ({
        path: ".output/public/index.html",
        route: "/",
        label,
        message: `${label} failed.`,
      })),
    );

    // Assert
    expect(findings.map((finding) => finding.severity)).toEqual(
      labels.map(() => "release blocker"),
    );
    expect(findings.map((finding) => finding.area)).toEqual(labels.map(() => "external links"));
    expect(findings.map((finding) => finding.code)).toEqual(labels);
  });

  it("reports stale snapshots and unavailable GitHub records as needs review", () => {
    // Arrange
    const snapshot = maybeParseGitHubMetadataSnapshot({
      schemaVersion: 1,
      syncedAt: "2026-04-01T00:00:00.000Z",
      repositories: [
        availableRepositoryFixture("openlinks"),
        {
          status: "unavailable",
          slug: "btc-vanity-address-finder",
          owner: "pRizz",
          repo: "btc-vanity-address-finder",
          repositoryUrl: "https://github.com/pRizz/btc-vanity-address-finder",
          reason: "missing",
          httpStatus: 404,
          message: "Not found.",
          syncedAt: "2026-04-01T00:00:00.000Z",
        },
      ],
    });

    if (!snapshot) {
      throw new Error("Expected snapshot fixture to parse.");
    }

    // Act
    const result = githubSnapshotFreshness({
      snapshot,
      now: new Date("2026-06-01T00:00:00.000Z"),
    });
    const ageFinding = result.findings.find((finding) => finding.code === "github-snapshot-age");
    const unavailableFinding = result.findings.find(
      (finding) => finding.code === "github-unavailable-record",
    );

    // Assert
    expect(snapshotStaleAfterDays).toBe(30);
    expect(ageFinding?.severity).toBe("needs review");
    expect(unavailableFinding).toMatchObject({
      severity: "needs review",
      area: "GitHub snapshot",
      slug: "btc-vanity-address-finder",
      repositoryUrl: "https://github.com/pRizz/btc-vanity-address-finder",
      reason: "missing",
      httpStatus: 404,
      syncedAt: "2026-04-01T00:00:00.000Z",
    });
  });

  it("reports curated GitHub repository links missing from the snapshot as needs review", () => {
    // Arrange
    const snapshot = maybeParseGitHubMetadataSnapshot({
      schemaVersion: 1,
      syncedAt: "2026-06-01T00:00:00.000Z",
      repositories: [availableRepositoryFixture("openlinks")],
    });

    if (!snapshot) {
      throw new Error("Expected snapshot fixture to parse.");
    }

    // Act
    const result = githubSnapshotFreshness({
      snapshot,
      expectedRepositoryUrls: [
        "https://github.com/pRizz/openlinks",
        "https://github.com/pRizz/missing-curated-repo",
      ],
      now: new Date("2026-06-02T00:00:00.000Z"),
    });
    const missingFinding = result.findings.find(
      (finding) => finding.code === "github-snapshot-missing-record",
    );

    // Assert
    expect(missingFinding).toMatchObject({
      severity: "needs review",
      area: "GitHub snapshot",
      repositoryUrl: "https://github.com/pRizz/missing-curated-repo",
    });
  });

  it("reports malformed snapshots as blockers and live GitHub state as manual smoke", () => {
    // Arrange
    const snapshot = maybeParseGitHubMetadataSnapshot({ schemaVersion: 1, repositories: [] });

    // Act
    const result = githubSnapshotFreshness({ snapshot });
    const groupedFindings = findingsBySeverity(result.findings);

    // Assert
    expect(snapshot).toBeNull();
    expect(groupedFindings["release blocker"]).toEqual([
      expect.objectContaining({
        code: "github-snapshot-invalid",
        severity: "release blocker",
      }),
    ]);
    expect(groupedFindings["manual smoke"]).toEqual([
      expect.objectContaining({
        code: "current live GitHub state",
        severity: "manual smoke",
      }),
    ]);
  });

  it("formats report groups in severity order and only blockers affect exit status", () => {
    // Arrange
    const findings: readonly FreshnessFinding[] = [
      {
        severity: "manual smoke",
        area: "deployment",
        code: "external-link reachability",
        message: "Review live links manually.",
      },
      {
        severity: "needs review",
        area: "GitHub snapshot",
        code: "github-snapshot-age",
        message: "Snapshot is stale.",
      },
    ];

    // Act
    const report = freshnessReport({ findings });
    const formattedReport = formatFreshnessReport(report);

    // Assert
    expect(freshnessSeverityOrder).toEqual(["release blocker", "needs review", "manual smoke"]);
    expect(formattedReport.indexOf("release blocker")).toBeLessThan(
      formattedReport.indexOf("needs review"),
    );
    expect(formattedReport.indexOf("needs review")).toBeLessThan(
      formattedReport.indexOf("manual smoke"),
    );
    expect(formattedReport).toContain("external-link reachability");
    expect(hasReleaseBlockerFindings(report.findings)).toBe(false);
  });
});

describe("freshness report IO boundaries", () => {
  it("reports missing static output as an actionable release blocker", () => {
    // Arrange
    const missingRoot = join(tmpdir(), `missing-static-output-${Date.now()}`);

    // Act
    const result = readStaticOutputRoutesForFreshness(missingRoot);

    // Assert
    expect(result.routes).toEqual([]);
    expect(result.findings).toEqual([
      {
        severity: "release blocker",
        area: "static output",
        code: "static-output-missing",
        path: missingRoot,
        message: "Missing .output/public. Run bun run build before bun run report:freshness.",
      },
    ]);
  });

  it("loads static HTML routes without requiring live requests", () => {
    // Arrange
    const root = mkdtempSync(join(tmpdir(), "freshness-static-output-"));
    const projectDirectory = join(root, "projects", "openlinks");
    writeFileSync(join(root, "index.html"), "<main>Home</main>");
    writeFileSync(join(root, "about.html"), "<main>About</main>");
    mkdirSync(projectDirectory, { recursive: true });
    writeFileSync(join(projectDirectory, "index.html"), "<main>OpenLinks</main>");

    try {
      // Act
      const result = readStaticOutputRoutesForFreshness(root);

      // Assert
      expect(result.findings).toEqual([]);
      expect(result.routes.map((route) => route.route)).toEqual([
        "/about",
        "/",
        "/projects/openlinks",
      ]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("keeps the report shell read-only and outside aggregate verify", () => {
    // Arrange
    const reportSource = readFileSync("scripts/generate-freshness-report.ts", "utf8");
    const packageJson = JSON.parse(readFileSync("package.json", "utf8")) as {
      scripts: Record<string, string>;
    };
    const forbiddenReportSourceFragments = [
      "writeFileSync",
      "rmSync",
      "mkdirSync",
      "syncGitHubMetadata",
      "generateSocialPreviews",
      "fetch(",
      "@octokit",
      "GITHUB_METADATA_TOKEN",
    ];

    // Act
    const verifyScript = packageJson.scripts.verify;

    // Assert
    expect(reportSource).toContain("readFileSync");
    expect(reportSource).toContain("external-link reachability");
    expect(reportSource).toContain("social crawler validation");
    expect(reportSource).toContain("current live GitHub state");
    for (const fragment of forbiddenReportSourceFragments) {
      expect(reportSource).not.toContain(fragment);
    }
    expect(packageJson.scripts["report:freshness"]).toBe(
      "bun run scripts/generate-freshness-report.ts",
    );
    expect(verifyScript).not.toContain("report:freshness");
    expect(verifyScript).not.toContain("freshness:live");
    expect(verifyScript).not.toContain("smoke:hosted");
    expect(verifyScript).not.toContain("sync:github-metadata");
  });
});

function availableRepositoryFixture(slug: string) {
  return {
    status: "available",
    slug,
    owner: "pRizz",
    repo: slug,
    repositoryUrl: `https://github.com/pRizz/${slug}`,
    homepageUrl: null,
    stars: 1,
    forks: 0,
    primaryLanguage: "TypeScript",
    topics: ["solidjs"],
    pushedAt: "2026-03-01T00:00:00.000Z",
    isArchived: false,
    isFork: false,
    isTemplate: false,
    syncedAt: "2026-04-01T00:00:00.000Z",
  };
}
