import {
  curatedProjects,
  maybeProjectDetailPageProjectBySlug,
  type ProjectDetailPageProject,
  type ProjectStory,
} from "./projects";
import {
  curatedWriting,
  maybePublicWritingEntryBySlug,
  type PublicWritingEntry,
  type WritingEntry,
} from "./writing";

export type ThemeStatus = "public" | "draft" | "hidden" | "unsupported" | "archived";
export type NonEmptyThemeList = readonly [string, ...string[]];

export type ThemeRecord = {
  slug: string;
  title: string;
  summary: string;
  status: ThemeStatus;
  displayOrder: number;
  audience: string;
  proofPoints: NonEmptyThemeList;
  collaborationAngle: string;
  relatedProjectSlugs: NonEmptyThemeList;
  relatedWritingSlugs: NonEmptyThemeList;
};

export type PublicThemeEntry = ThemeRecord & {
  status: "public";
};

/**
 * Maintainer-facing theme data surface.
 *
 * `curatedThemes` is the authoritative checked-in registry. Supported runtime
 * helper exports are `curatedThemes`, `publicThemeEntries`,
 * `maybePublicThemeEntryBySlug`, `themeDetailPath`, `themeDetailRoutes`,
 * `relatedProjectDetailPageProjectsForTheme`, and `relatedWritingEntriesForTheme`.
 */
export const curatedThemes = [
  {
    slug: "agentic-engineering",
    title: "Agentic engineering",
    summary:
      "Inspectable AI-assisted development workflows that keep decisions, implementation, and verification tied to repo-owned evidence.",
    status: "public",
    displayOrder: 10,
    audience:
      "Builders who want agent workflows that stay reviewable, testable, and useful outside a single local machine.",
    proofPoints: [
      "Connects cloud-hostable agent workbench experiments with public workflow notes.",
      "Emphasizes planning artifacts, pure domain helpers, and repeatable verification as collaboration anchors.",
    ],
    collaborationAngle:
      "A starting point for collaborators interested in agent infrastructure, reproducible developer environments, and evidence-driven AI-assisted software work.",
    relatedProjectSlugs: ["opencode-cloud", "free-the-world"],
    relatedWritingSlugs: ["agentic-engineering-workflows"],
  },
  {
    slug: "open-identity",
    title: "Open identity",
    summary:
      "Owned identity surfaces and portable links that make current web presence easier to inspect without centering one platform.",
    status: "public",
    displayOrder: 20,
    audience:
      "Collaborators who care about durable personal identity, rel=me style signals, and owned web surfaces.",
    proofPoints: [
      "Connects OpenLinks source and live identity work with the published owned-surface note.",
      "Keeps OpenLinks as an identity hub while leaving Bright Builds, projects, and writing as the primary context.",
    ],
    collaborationAngle:
      "A starting point for collaborators interested in open web identity, verification hints, and low-friction profile surfaces.",
    relatedProjectSlugs: ["openlinks"],
    relatedWritingSlugs: ["portable-identity-and-owned-surfaces"],
  },
] as const satisfies readonly ThemeRecord[];

export function publicThemeEntries(
  themes: readonly ThemeRecord[] = curatedThemes,
): readonly PublicThemeEntry[] {
  return sortThemes(themes.filter(isPublicThemeEntry));
}

export function maybePublicThemeEntryBySlug(
  slug: string,
  themes: readonly ThemeRecord[] = curatedThemes,
): PublicThemeEntry | null {
  return publicThemeEntries(themes).find((theme) => theme.slug === slug) ?? null;
}

export function themeDetailPath(theme: Pick<ThemeRecord, "slug">): string {
  return `/themes/${theme.slug}`;
}

export function themeDetailRoutes(
  themes: readonly ThemeRecord[] = curatedThemes,
): readonly string[] {
  return publicThemeEntries(themes).map(themeDetailPath);
}

export function relatedProjectDetailPageProjectsForTheme(
  theme: Pick<ThemeRecord, "relatedProjectSlugs">,
  projects: readonly ProjectStory[] = curatedProjects,
): readonly ProjectDetailPageProject[] {
  return theme.relatedProjectSlugs.flatMap((slug) => {
    const maybeProject = maybeProjectDetailPageProjectBySlug(slug, projects);
    return maybeProject ? [maybeProject] : [];
  });
}

export function relatedWritingEntriesForTheme(
  theme: Pick<ThemeRecord, "relatedWritingSlugs">,
  entries: readonly WritingEntry[] = curatedWriting,
): readonly PublicWritingEntry[] {
  return theme.relatedWritingSlugs.flatMap((slug) => {
    const maybeEntry = maybePublicWritingEntryBySlug(slug, entries);
    return maybeEntry ? [maybeEntry] : [];
  });
}

function isPublicThemeEntry(theme: ThemeRecord): theme is PublicThemeEntry {
  return theme.status === "public";
}

function sortThemes<TTheme extends ThemeRecord>(themes: readonly TTheme[]): readonly TTheme[] {
  return [...themes].sort((left, right) => left.displayOrder - right.displayOrder);
}
