import { validateProjectRegistry } from "../src/domain/project-validation";
import { curatedProjects } from "../src/domain/projects";
import { curatedWriting } from "../src/domain/writing";
import { validateWritingRegistry } from "../src/domain/writing-validation";

const projectResult = validateProjectRegistry(curatedProjects);
const writingResult = validateWritingRegistry(curatedWriting);
const warningCount = projectResult.warnings.length + writingResult.warnings.length;

for (const warning of projectResult.warnings) {
  console.warn(`[curation warning] ${warning.slug}: ${warning.code} - ${warning.message}`);
}

for (const warning of writingResult.warnings) {
  console.warn(`[curation warning] writing/${warning.slug}: ${warning.code} - ${warning.message}`);
}

if (projectResult.errors.length + writingResult.errors.length > 0) {
  for (const error of projectResult.errors) {
    console.error(`[curation error] ${error.slug}: ${error.code} - ${error.message}`);
  }

  for (const error of writingResult.errors) {
    console.error(`[curation error] writing/${error.slug}: ${error.code} - ${error.message}`);
  }

  process.exit(1);
}

console.log(
  `Curated registries valid: ${curatedProjects.length} projects, ${curatedWriting.length} writing entries, ${warningCount} warnings.`,
);
