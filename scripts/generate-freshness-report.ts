import { readFileSync } from "node:fs";

import { parseGitHubRepositoryUrl } from "../src/domain/github-metadata";
import { curatedProjects } from "../src/domain/projects";
import { socialPreviewTargets, validateSocialPreviewTargets } from "../src/domain/social-previews";
import {
  githubSnapshotFreshness,
  maybeParseGitHubMetadataSnapshot,
} from "./freshness/github-snapshot";
import {
  type FreshnessFinding,
  formatFreshnessReport,
  freshnessFindingsForReleaseFindings,
  freshnessReport,
  hasReleaseBlockerFindings,
} from "./freshness/report";
import { freshnessFindingsForSocialPreviewChecks } from "./freshness/social-previews";
import { readStaticOutputRoutesForFreshness } from "./freshness/static-output";
import {
  externalLinkFindingsForRoutes,
  externalLinkPolicies,
  manualReleaseChecklistLabels,
} from "./release-readiness";
import { socialPreviewCheckFindings } from "./social-previews/check";
import { socialPreviewCheckInput } from "./social-previews/check-input";

const gitHubSnapshotPath = "src/domain/github-metadata.snapshot.json";
const currentLiveGitHubStateLabel = "current live GitHub state";

const maybeSnapshot = maybeReadGitHubMetadataSnapshot();
const gitHubFreshness = githubSnapshotFreshness({
  snapshot: maybeSnapshot,
  expectedRepositoryUrls: expectedGitHubRepositoryUrlsForFreshness(),
  sourcePath: gitHubSnapshotPath,
  currentLiveStateLabel: currentLiveGitHubStateLabel,
});
const socialPreviewCheckTargets = socialPreviewTargets();
const socialPreviewValidationFindings = validateSocialPreviewTargets(socialPreviewCheckTargets);
const socialPreviewFindings = freshnessFindingsForSocialPreviewChecks(
  socialPreviewCheckFindings(
    socialPreviewCheckInput({
      targets: socialPreviewCheckTargets,
      targetValidationFindings: socialPreviewValidationFindings,
    }),
  ),
);
const staticOutput = readStaticOutputRoutesForFreshness();
const externalLinkFindings = freshnessFindingsForReleaseFindings(
  externalLinkFindingsForRoutes(staticOutput.routes),
);
const report = freshnessReport({
  findings: [
    ...staticOutput.findings,
    ...socialPreviewFindings,
    ...gitHubFreshness.findings,
    ...externalLinkFindings,
    ...manualSmokeFindings(),
  ],
});

console.log(formatFreshnessReport(report));

process.exitCode = hasReleaseBlockerFindings(report.findings) ? 1 : 0;

function maybeReadGitHubMetadataSnapshot() {
  try {
    return maybeParseGitHubMetadataSnapshot(JSON.parse(readFileSync(gitHubSnapshotPath, "utf8")));
  } catch {
    return null;
  }
}

function expectedGitHubRepositoryUrlsForFreshness(): readonly string[] {
  return [
    ...new Set(
      curatedProjects.flatMap((project) =>
        project.links
          .filter((link) => link.kind === "repo")
          .map((link) => parseGitHubRepositoryUrl(link.href)?.repositoryUrl)
          .filter((maybeUrl): maybeUrl is string => typeof maybeUrl === "string"),
      ),
    ),
  ].sort((left, right) => left.localeCompare(right));
}

function manualSmokeFindings(): readonly FreshnessFinding[] {
  return [
    ...externalLinkPolicies.map(
      (policy) =>
        ({
          severity: "manual smoke",
          area: "external links",
          code: "external-link reachability",
          message: `Manually smoke-check ${policy.origin} links such as ${policy.examples.join(
            ", ",
          )}.`,
        }) satisfies FreshnessFinding,
    ),
    {
      severity: "manual smoke",
      area: "generated media",
      code: "social crawler validation",
      message:
        "Run hosted social preview debuggers against preview or production URLs outside this offline report.",
    },
    {
      severity: "manual smoke",
      area: "deployment",
      code: "preview and production route smoke checks",
      message: manualReleaseChecklistLabels().join(", "),
    },
  ];
}
