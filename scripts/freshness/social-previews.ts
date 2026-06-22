import type {
  SocialPreviewCheckFinding,
  SocialPreviewCheckFindingCode,
} from "../social-previews/check";
import type { FreshnessFinding } from "./report";

const socialPreviewFindingAreas = {
  "target-validation": "generated media",
  "missing-file": "generated media",
  "stale-fingerprint": "generated media",
  "checksum-drift": "generated media",
  "manifest-drift": "generated media",
  "wrong-dimensions": "generated media",
  "oversized-file": "generated media",
  "blank-image": "generated media",
  "orphan-managed-png": "generated media",
  "nondeterministic-render": "generated media",
} as const satisfies Record<SocialPreviewCheckFindingCode, "generated media">;

export function freshnessFindingsForSocialPreviewChecks(
  findings: readonly SocialPreviewCheckFinding[],
): readonly FreshnessFinding[] {
  return findings.map((finding) => ({
    severity: "release blocker",
    area: socialPreviewFindingAreas[finding.code],
    code: finding.code,
    message: finding.message,
    routePath: finding.routePath,
    assetPath: finding.assetPath,
  }));
}
