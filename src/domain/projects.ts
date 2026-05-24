export type ProjectTier = "featured" | "supporting" | "lab";

export type ProjectRecord = {
  slug: string;
  name: string;
  repo: string;
  href: string;
  summary: string;
  tier: ProjectTier;
  featured: boolean;
  displayOrder: number;
  themes: readonly string[];
};

export const projectSeeds = [
  {
    slug: "mystic-ui",
    name: "Mystic UI",
    repo: "pRizz/mystic-ui",
    href: "https://github.com/pRizz/mystic-ui",
    summary:
      "SolidJS component and styling primitives that can anchor this portfolio without adding a second design system.",
    tier: "featured",
    featured: true,
    displayOrder: 10,
    themes: ["SolidJS", "Design systems", "Frontend infrastructure"],
  },
  {
    slug: "openlinks",
    name: "OpenLinks",
    repo: "pRizz/openlinks",
    href: "https://github.com/pRizz/openlinks",
    summary:
      "Identity and link presence work that keeps profile surfaces portable across owned websites and services.",
    tier: "featured",
    featured: true,
    displayOrder: 20,
    themes: ["Identity", "Open web", "Profiles"],
  },
  {
    slug: "win3bitcoin",
    name: "Win3Bitco.in",
    repo: "pRizz/win3bitcoin",
    href: "https://github.com/pRizz/win3bitcoin",
    summary:
      "Bitcoin-oriented web experimentation that belongs in the reviewed project set before final curation.",
    tier: "supporting",
    featured: false,
    displayOrder: 30,
    themes: ["Bitcoin", "Web experiments"],
  },
] as const satisfies readonly ProjectRecord[];

export function featuredProjects(
  projects: readonly ProjectRecord[] = projectSeeds,
): ProjectRecord[] {
  return [...projects]
    .filter((project) => project.featured && project.tier === "featured")
    .sort((left, right) => left.displayOrder - right.displayOrder);
}
