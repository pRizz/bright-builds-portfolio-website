import type { ReleaseFinding } from "../verify-release";

export type FreshnessSeverity = "release blocker" | "needs review" | "manual smoke";

export type FreshnessFinding = {
  severity: FreshnessSeverity;
  area: string;
  code: string;
  message: string;
  routePath?: string;
  assetPath?: string;
  path?: string;
  slug?: string;
  repositoryUrl?: string;
  reason?: string;
  httpStatus?: number;
  syncedAt?: string;
};

export type FreshnessReport = {
  findings: readonly FreshnessFinding[];
};

export type FreshnessReportInput = {
  findings: readonly FreshnessFinding[];
};

export const freshnessSeverityOrder = ["release blocker", "needs review", "manual smoke"] as const;

export function freshnessReport(input: FreshnessReportInput): FreshnessReport {
  return {
    findings: [...input.findings],
  };
}

export function findingsBySeverity(
  findings: readonly FreshnessFinding[],
): Record<FreshnessSeverity, readonly FreshnessFinding[]> {
  return {
    "release blocker": findings.filter((finding) => finding.severity === "release blocker"),
    "needs review": findings.filter((finding) => finding.severity === "needs review"),
    "manual smoke": findings.filter((finding) => finding.severity === "manual smoke"),
  };
}

export function hasReleaseBlockerFindings(findings: readonly FreshnessFinding[]): boolean {
  return findings.some((finding) => finding.severity === "release blocker");
}

export function formatFreshnessReport(report: FreshnessReport): string {
  const lines = ["Freshness report"];
  const groupedFindings = findingsBySeverity(report.findings);

  for (const severity of freshnessSeverityOrder) {
    lines.push("", severity);

    const findings = groupedFindings[severity];

    if (findings.length === 0) {
      lines.push("- None");
      continue;
    }

    for (const finding of findings) {
      lines.push(`- ${formatFreshnessFinding(finding)}`);
    }
  }

  return `${lines.join("\n")}\n`;
}

export function freshnessFindingsForReleaseFindings(
  findings: readonly ReleaseFinding[],
  area = "external links",
): readonly FreshnessFinding[] {
  return findings.map((finding) => ({
    severity: "release blocker",
    area,
    code: finding.label,
    message: finding.message,
    path: finding.path,
    routePath: finding.route,
  }));
}

function formatFreshnessFinding(finding: FreshnessFinding): string {
  const location = freshnessFindingLocation(finding);
  const prefix = location
    ? `[${finding.area}] ${finding.code} ${location}`
    : `[${finding.area}] ${finding.code}`;

  return `${prefix}: ${finding.message}`;
}

function freshnessFindingLocation(finding: FreshnessFinding): string {
  const parts = [
    finding.routePath,
    finding.assetPath,
    finding.path,
    finding.slug,
    finding.repositoryUrl,
  ].filter((part): part is string => typeof part === "string" && part.length > 0);

  if (parts.length === 0) {
    return "";
  }

  return `(${parts.join(", ")})`;
}
