import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join, relative } from "node:path";
import ts from "typescript";

export type ProjectHelperSurfaceSourceFile = {
  filePath: string;
  source: string;
};

export type ProjectHelperSurfaceFinding = {
  file: string;
  line: number;
  importName: string;
  message: string;
};

export type ProjectHelperSurfaceVerificationResult = {
  scannedFileCount: number;
  guardedFileCount: number;
  findings: readonly ProjectHelperSurfaceFinding[];
};

const sourceRoots = ["src", "scripts"] as const;
const sourceExtensions = new Set([".ts", ".tsx"]);
const generatedDirectorySegments = new Set([
  ".output",
  ".vinxi",
  "build",
  "coverage",
  "dist",
  "generated",
  "node_modules",
]);
const forbiddenProjectHelperExports = new Set([
  "projectSeeds",
  "primaryProjectLink",
  "featuredProjects",
]);
const projectsModulePath = "src/domain/projects";

export function projectHelperSurfaceFindingsForSource(
  filePath: string,
  source: string,
): readonly ProjectHelperSurfaceFinding[] {
  if (!isGuardedSourcePath(filePath)) {
    return [];
  }

  const sourceFile = ts.createSourceFile(
    filePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    scriptKindForPath(filePath),
  );
  const findings: ProjectHelperSurfaceFinding[] = [];

  for (const statement of sourceFile.statements) {
    if (ts.isImportDeclaration(statement)) {
      findings.push(...findingsForImportDeclaration(filePath, sourceFile, statement));
      continue;
    }

    if (ts.isExportDeclaration(statement)) {
      findings.push(...findingsForExportDeclaration(filePath, sourceFile, statement));
    }
  }

  return findings;
}

export function projectHelperSurfaceFindingsForFiles(
  files: readonly ProjectHelperSurfaceSourceFile[],
): readonly ProjectHelperSurfaceFinding[] {
  return files.flatMap((file) =>
    projectHelperSurfaceFindingsForSource(file.filePath, file.source),
  );
}

export function runProjectHelperSurfaceVerification(
  files: readonly ProjectHelperSurfaceSourceFile[],
): ProjectHelperSurfaceVerificationResult {
  const guardedFiles = files.filter((file) => isGuardedSourcePath(file.filePath));

  return {
    scannedFileCount: files.length,
    guardedFileCount: guardedFiles.length,
    findings: projectHelperSurfaceFindingsForFiles(guardedFiles),
  };
}

function findingsForImportDeclaration(
  filePath: string,
  sourceFile: ts.SourceFile,
  statement: ts.ImportDeclaration,
): readonly ProjectHelperSurfaceFinding[] {
  const moduleName = moduleSpecifierText(statement.moduleSpecifier);

  if (!moduleName || !isProjectsModuleImport(filePath, moduleName)) {
    return [];
  }

  const maybeNamedBindings = statement.importClause?.namedBindings;

  if (!maybeNamedBindings) {
    return [];
  }

  if (ts.isNamespaceImport(maybeNamedBindings)) {
    return [
      findingForNode(filePath, sourceFile, maybeNamedBindings, "*", "Namespace import"),
    ];
  }

  return maybeNamedBindings.elements.flatMap((specifier) => {
    const importName = specifier.propertyName?.text ?? specifier.name.text;

    if (!forbiddenProjectHelperExports.has(importName)) {
      return [];
    }

    return [findingForNode(filePath, sourceFile, specifier, importName, "Forbidden import")];
  });
}

function findingsForExportDeclaration(
  filePath: string,
  sourceFile: ts.SourceFile,
  statement: ts.ExportDeclaration,
): readonly ProjectHelperSurfaceFinding[] {
  const moduleName = statement.moduleSpecifier
    ? moduleSpecifierText(statement.moduleSpecifier)
    : null;

  if (!moduleName || !isProjectsModuleImport(filePath, moduleName)) {
    return [];
  }

  const maybeExportClause = statement.exportClause;

  if (!maybeExportClause) {
    return [findingForNode(filePath, sourceFile, statement, "*", "Export star")];
  }

  if (ts.isNamespaceExport(maybeExportClause)) {
    return [findingForNode(filePath, sourceFile, maybeExportClause, "*", "Namespace export")];
  }

  return maybeExportClause.elements.flatMap((specifier) => {
    const importName = specifier.propertyName?.text ?? specifier.name.text;

    if (!forbiddenProjectHelperExports.has(importName)) {
      return [];
    }

    return [findingForNode(filePath, sourceFile, specifier, importName, "Forbidden re-export")];
  });
}

function findingForNode(
  filePath: string,
  sourceFile: ts.SourceFile,
  node: ts.Node,
  importName: string,
  kind: string,
): ProjectHelperSurfaceFinding {
  return {
    file: toPosixPath(filePath),
    line: sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1,
    importName,
    message:
      `${kind} of legacy project helper "${importName}" from src/domain/projects. ` +
      "Use curatedProjects or supported selector exports instead.",
  };
}

function moduleSpecifierText(moduleSpecifier: ts.Expression): string | null {
  if (!ts.isStringLiteralLike(moduleSpecifier)) {
    return null;
  }

  return moduleSpecifier.text;
}

function isProjectsModuleImport(filePath: string, moduleName: string): boolean {
  if (!moduleName.startsWith(".") && !moduleName.startsWith("/")) {
    return normalizeModulePath(moduleName) === projectsModulePath;
  }

  const importerDirectory = dirname(toPosixPath(filePath));
  const resolvedModulePath = normalizeModulePath(join(importerDirectory, moduleName));

  return resolvedModulePath === projectsModulePath;
}

function normalizeModulePath(path: string): string {
  const normalized = toPosixPath(path).replace(/\/index$/, "");
  return normalized.replace(/\.(?:ts|tsx|js|jsx)$/, "");
}

function isGuardedSourcePath(filePath: string): boolean {
  const normalized = toPosixPath(filePath);
  const extension = extname(normalized);

  if (!sourceExtensions.has(extension)) {
    return false;
  }

  if (!normalized.startsWith("src/") && !normalized.startsWith("scripts/")) {
    return false;
  }

  if (normalized === "src/domain/projects.ts") {
    return false;
  }

  if (
    normalized.endsWith(".d.ts") ||
    normalized.endsWith(".test.ts") ||
    normalized.endsWith(".test.tsx")
  ) {
    return false;
  }

  return !normalized
    .split("/")
    .some((segment) => generatedDirectorySegments.has(segment));
}

function scriptKindForPath(filePath: string): ts.ScriptKind {
  return filePath.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
}

function sourceFilesForRoots(roots: readonly string[]): readonly ProjectHelperSurfaceSourceFile[] {
  return roots.flatMap((root) => sourceFilesForDirectory(root));
}

function sourceFilesForDirectory(directory: string): readonly ProjectHelperSurfaceSourceFile[] {
  if (!existsSync(directory)) {
    return [];
  }

  const files: ProjectHelperSurfaceSourceFile[] = [];

  for (const entry of readdirSync(directory)) {
    const filePath = join(directory, entry);
    const normalizedPath = toPosixPath(filePath);

    if (normalizedPath.split("/").some((segment) => generatedDirectorySegments.has(segment))) {
      continue;
    }

    const stats = statSync(filePath);

    if (stats.isDirectory()) {
      files.push(...sourceFilesForDirectory(filePath));
      continue;
    }

    if (!sourceExtensions.has(extname(filePath))) {
      continue;
    }

    files.push({
      filePath: normalizedPath,
      source: readFileSync(filePath, "utf8"),
    });
  }

  return files;
}

function toPosixPath(path: string): string {
  return path.replace(/\\/g, "/");
}

if (import.meta.main) {
  const result = runProjectHelperSurfaceVerification(sourceFilesForRoots(sourceRoots));

  if (result.findings.length > 0) {
    for (const finding of result.findings) {
      console.error(
        `[project helper surface error] ${relative(".", finding.file)}:${finding.line} ` +
          `${finding.importName} - ${finding.message}`,
      );
    }

    process.exit(1);
  }

  console.log(
    `Project helper surface verifier scanned ${result.guardedFileCount} guarded source files ` +
      `from ${sourceRoots.join(", ")}.`,
  );
  console.log("Project helper surface verification passed");
}
