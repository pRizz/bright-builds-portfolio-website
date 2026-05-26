import { validateProjectRegistry } from "../src/domain/project-validation";
import { curatedProjects } from "../src/domain/projects";

const result = validateProjectRegistry(curatedProjects);

for (const warning of result.warnings) {
  console.warn(`[curation warning] ${warning.slug}: ${warning.code} - ${warning.message}`);
}

if (result.errors.length > 0) {
  for (const error of result.errors) {
    console.error(`[curation error] ${error.slug}: ${error.code} - ${error.message}`);
  }

  process.exit(1);
}

console.log(
  `Curated registry valid: ${curatedProjects.length} projects, ${result.warnings.length} warnings.`,
);
