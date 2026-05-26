import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

type ForbiddenPattern = {
  label: string;
  pattern: RegExp;
};

type Finding = {
  file: string;
  line: number;
  label: string;
  text: string;
};

const sourceRoot = "src";
const sourceExtensions = new Set([".ts", ".tsx"]);
const forbiddenPatterns: readonly ForbiddenPattern[] = [
  { label: "api.github.com", pattern: /api\.github\.com/g },
  { label: "github.com/graphql", pattern: /github\.com\/graphql/g },
  { label: "api.github.com/graphql", pattern: /api\.github\.com\/graphql/g },
  {
    label: "@octokit/ import",
    pattern: /(?:from\s+|import\s*\(\s*|import\s+)["']@octokit\//g,
  },
  { label: "GITHUB_TOKEN", pattern: /\bGITHUB_TOKEN\b/g },
  { label: "VITE_*GITHUB*TOKEN", pattern: /\bVITE_[A-Z0-9_]*GITHUB[A-Z0-9_]*TOKEN\b/g },
  { label: "PUBLIC_*GITHUB*TOKEN", pattern: /\bPUBLIC_[A-Z0-9_]*GITHUB[A-Z0-9_]*TOKEN\b/g },
  {
    label: "SOLID_PUBLIC_*GITHUB*TOKEN",
    pattern: /\bSOLID_PUBLIC_[A-Z0-9_]*GITHUB[A-Z0-9_]*TOKEN\b/g,
  },
];

function sourceFiles(root: string): string[] {
  if (!existsSync(root)) {
    return [];
  }

  const entries = readdirSync(root);
  const files: string[] = [];

  for (const entry of entries) {
    const path = join(root, entry);
    const stats = statSync(path);

    if (stats.isDirectory()) {
      files.push(...sourceFiles(path));
      continue;
    }

    if (sourceExtensions.has(extensionFor(entry))) {
      files.push(path);
    }
  }

  return files;
}

function extensionFor(path: string): string {
  const dotIndex = path.lastIndexOf(".");

  if (dotIndex === -1) {
    return "";
  }

  return path.slice(dotIndex);
}

function findingsForFile(path: string): readonly Finding[] {
  const source = readFileSync(path, "utf8");
  const findings: Finding[] = [];

  for (const forbidden of forbiddenPatterns) {
    for (const match of source.matchAll(forbidden.pattern)) {
      findings.push({
        file: path,
        line: lineNumberForIndex(source, match.index ?? 0),
        label: forbidden.label,
        text: match[0],
      });
    }
  }

  return findings;
}

function lineNumberForIndex(source: string, index: number): number {
  return source.slice(0, index).split("\n").length;
}

const findings = sourceFiles(sourceRoot).flatMap((file) => findingsForFile(file));

if (findings.length > 0) {
  for (const finding of findings) {
    console.error(
      `[github runtime error] ${relative(".", finding.file)}:${finding.line} ` +
        `${finding.label} - ${finding.text}`,
    );
  }

  process.exit(1);
}

console.log(
  `No visitor-runtime GitHub API, Octokit, or browser token mechanisms found in ${sourceRoot}/.`,
);
