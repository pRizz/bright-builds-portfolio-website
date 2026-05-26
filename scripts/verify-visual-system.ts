import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";

type Finding = {
  file: string;
  line: number;
  label: string;
  text: string;
};

type PatternCheck = {
  label: string;
  pattern: RegExp;
};

const sourceExtensions = new Set([".ts", ".tsx", ".css"]);
const domainRoot = "src/domain";
const reactiveSurfacePath = "src/components/ReactiveSurface.tsx";
const visualPatternFiles = [
  "src/styles/app.css",
  "src/components/SiteLayout.tsx",
  "src/routes/index.tsx",
  "src/routes/projects.tsx",
  "src/routes/about.tsx",
  "src/routes/contact.tsx",
] as const;
const forbiddenMotionDependencies = [
  "motion",
  "gsap",
  "three",
  "matter-js",
  "rapier",
  "@react-three/fiber",
  "@solid-primitives/spring",
] as const;
const requiredReactiveSurfaceTokens = [
  "onCleanup",
  "removeEventListener",
  "cancelAnimationFrame",
  "visibilitychange",
  "canRunDecorativeMotion",
  "matchMedia",
] as const;
const forbiddenReactiveSurfacePatterns: readonly PatternCheck[] = [
  { label: "setInterval", pattern: /\bsetInterval\b/g },
  { label: "setTimeout", pattern: /\bsetTimeout\b/g },
  { label: "ResizeObserver", pattern: /\bResizeObserver\b/g },
  { label: "MutationObserver", pattern: /\bMutationObserver\b/g },
  { label: "IntersectionObserver", pattern: /\bIntersectionObserver\b/g },
  { label: 'from "motion"', pattern: /from\s+["']motion["']/g },
  { label: "gsap", pattern: /\bgsap\b/g },
  { label: "three", pattern: /\bthree\b/g },
  { label: "matter-js", pattern: /\bmatter-js\b/g },
  { label: "rapier", pattern: /\brapier\b/g },
];
const forbiddenVisualPatterns: readonly PatternCheck[] = [
  { label: "gradient-orb", pattern: /\bgradient-orb\b/g },
  { label: "bokeh", pattern: /\bbokeh\b/g },
  { label: "blur-3xl", pattern: /\bblur-3xl\b/g },
  { label: "from-purple", pattern: /\bfrom-purple\b/g },
  { label: "via-purple", pattern: /\bvia-purple\b/g },
  { label: "to-purple", pattern: /\bto-purple\b/g },
  { label: "bg-white", pattern: /\bbg-white\b/g },
  { label: "bg-stone-50", pattern: /\bbg-stone-50\b/g },
  { label: "text-zinc-950", pattern: /\btext-zinc-950\b/g },
  { label: "letter-spacing: -", pattern: /letter-spacing\s*:\s*-/g },
  { label: 'remote CSS url("http', pattern: /url\(\s*["']http/gi },
];
const forbiddenDomainImports: readonly PatternCheck[] = [
  {
    label: "solid-js import",
    pattern: /(?:import|export)\s+[^;]*?\sfrom\s+["']solid-js(?:\/[^"']*)?["']/g,
  },
  {
    label: "mystic-ui import",
    pattern: /(?:import|export)\s+[^;]*?\sfrom\s+["']mystic-ui(?:\/[^"']*)?["']/g,
  },
  {
    label: "component import",
    pattern:
      /(?:import|export)\s+[^;]*?\sfrom\s+["'][^"']*(?:src\/components|\.\.?\/components)[^"']*["']/g,
  },
];
const forbiddenDomainIdentifiers: readonly PatternCheck[] = [
  { label: "window identifier", pattern: /\bwindow\b/g },
  { label: "document identifier", pattern: /\bdocument\b/g },
  { label: "navigator identifier", pattern: /\bnavigator\b/g },
  { label: "matchMedia identifier", pattern: /\bmatchMedia\b/g },
  { label: "requestAnimationFrame identifier", pattern: /\brequestAnimationFrame\b/g },
  { label: "addEventListener identifier", pattern: /\baddEventListener\b/g },
  { label: "ReactiveSurface identifier", pattern: /\bReactiveSurface\b/g },
  { label: "visual-motion identifier", pattern: /\bvisual-motion\b/g },
  { label: "onCleanup identifier", pattern: /\bonCleanup\b/g },
];

function sourceFiles(root: string): string[] {
  if (!existsSync(root)) {
    return [];
  }

  const files: string[] = [];

  for (const entry of readdirSync(root)) {
    const path = join(root, entry);
    const stats = statSync(path);

    if (stats.isDirectory()) {
      files.push(...sourceFiles(path));
      continue;
    }

    if (sourceExtensions.has(extname(entry))) {
      files.push(path);
    }
  }

  return files;
}

function findingsForPatterns(
  file: string,
  source: string,
  checks: readonly PatternCheck[],
): Finding[] {
  const findings: Finding[] = [];

  for (const check of checks) {
    for (const match of source.matchAll(check.pattern)) {
      findings.push({
        file,
        line: lineNumberForIndex(source, match.index ?? 0),
        label: check.label,
        text: match[0],
      });
    }
  }

  return findings;
}

function lineNumberForIndex(source: string, index: number): number {
  return source.slice(0, index).split("\n").length;
}

function assertNoFindings(findings: readonly Finding[], prefix: string): void {
  if (findings.length === 0) {
    return;
  }

  for (const finding of findings) {
    console.error(
      `[${prefix}] ${relative(".", finding.file)}:${finding.line} ${finding.label} - ${finding.text}`,
    );
  }

  process.exit(1);
}

function assertPackageHasNoMotionDependencies(): void {
  const packageJson = JSON.parse(readFileSync("package.json", "utf8")) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };
  const dependencies = {
    ...(packageJson.dependencies ?? {}),
    ...(packageJson.devDependencies ?? {}),
  };
  const forbiddenDependencies = Object.keys(dependencies).filter(
    (name) =>
      forbiddenMotionDependencies.some((forbiddenName) => name === forbiddenName) ||
      name.toLowerCase().includes("webgpu"),
  );

  if (forbiddenDependencies.length === 0) {
    return;
  }

  for (const dependency of forbiddenDependencies) {
    console.error(
      `[visual dependency error] package.json includes forbidden runtime visual dependency: ${dependency}`,
    );
  }

  process.exit(1);
}

function assertDomainBoundary(): number {
  const files = sourceFiles(domainRoot);
  const findings = files.flatMap((file) => {
    const source = readFileSync(file, "utf8");
    return [
      ...findingsForPatterns(file, source, forbiddenDomainImports),
      ...findingsForPatterns(file, source, forbiddenDomainIdentifiers),
    ];
  });

  assertNoFindings(findings, "domain visual boundary error");

  return files.length;
}

function assertReactiveSurfaceCleanup(): void {
  if (!existsSync(reactiveSurfacePath)) {
    return;
  }

  const source = readFileSync(reactiveSurfacePath, "utf8");
  const missingTokens = requiredReactiveSurfaceTokens.filter((token) => !source.includes(token));

  if (missingTokens.length > 0) {
    for (const token of missingTokens) {
      console.error(
        `[reactive cleanup error] ${reactiveSurfacePath} is missing required cleanup/gate token: ${token}`,
      );
    }

    process.exit(1);
  }

  assertNoFindings(
    findingsForPatterns(reactiveSurfacePath, source, forbiddenReactiveSurfacePatterns),
    "reactive cleanup error",
  );
}

function assertNoForbiddenVisualPatterns(): void {
  const findings = visualPatternFiles.flatMap((file) => {
    if (!existsSync(file)) {
      return [];
    }

    return findingsForPatterns(file, readFileSync(file, "utf8"), forbiddenVisualPatterns);
  });

  assertNoFindings(findings, "visual pattern error");
}

const domainFileCount = assertDomainBoundary();
assertPackageHasNoMotionDependencies();
assertReactiveSurfaceCleanup();
assertNoForbiddenVisualPatterns();

console.log(
  [
    `Visual-system guard passed for ${domainFileCount} src/domain files.`,
    "Motion dependency check passed.",
    "ReactiveSurface cleanup guard passed.",
    "Forbidden visual-pattern check passed.",
  ].join(" "),
);
