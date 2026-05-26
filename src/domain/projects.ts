export type ProjectPlacement = "home" | "supporting" | "lab" | "archive" | "hidden";
export type ProjectTier = "flagship" | "supporting" | "lab" | "archive" | "excluded";
export type ProjectSourceType =
  | "original"
  | "fork"
  | "repro"
  | "playground"
  | "generated"
  | "profile"
  | "support"
  | "concept";
export type ProjectMaturity = "active" | "stable" | "prototype" | "paused" | "archived";
export type ProjectStatus = "building" | "maintained" | "paused" | "archived" | "hidden";
export type ProjectLinkKind = "repo" | "live" | "docs" | "article" | "related";

export type ProjectLink = {
  label: string;
  href: string;
  kind: ProjectLinkKind;
};

export type ProjectOriginalWork =
  | { kind: "original" }
  | { kind: "promoted-fork"; promotionReason: string }
  | { kind: "not-original"; reason: string }
  | { kind: "unreviewed"; reason: string };

type LegacyRouteProjectFields = {
  repo: string;
  href: string;
  summary: string;
  featured: boolean;
};

export type ProjectStory = LegacyRouteProjectFields & {
  slug: string;
  name: string;
  aliases: readonly string[];
  placement: ProjectPlacement;
  tier: ProjectTier;
  sourceType: ProjectSourceType;
  maturity: ProjectMaturity;
  status: ProjectStatus;
  includeOnHome: boolean;
  includeInProjectIndex: boolean;
  displayOrder: number;
  themes: readonly string[];
  tags: readonly string[];
  role: string;
  oneLine: string;
  curationReason: string;
  originalWork: ProjectOriginalWork;
  links: readonly [ProjectLink, ...ProjectLink[]];
};

export type HomeProjectStory = ProjectStory & {
  placement: "home";
  tier: "flagship";
  includeOnHome: true;
  includeInProjectIndex: true;
};

export const curatedProjects = [
  {
    slug: "openlinks",
    name: "OpenLinks",
    aliases: ["open-links"],
    placement: "home",
    tier: "flagship",
    sourceType: "original",
    maturity: "active",
    status: "building",
    includeOnHome: true,
    includeInProjectIndex: true,
    displayOrder: 10,
    themes: ["Open web", "Identity"],
    tags: ["identity", "open-web", "profiles"],
    role: "Creator",
    oneLine: "Portable identity and link presence for owned web surfaces.",
    curationReason: "Central identity project with a live public surface and verified source repo.",
    originalWork: { kind: "original" },
    links: [
      { label: "Source", href: "https://github.com/pRizz/open-links", kind: "repo" },
      { label: "Live site", href: "https://openlinks.us/", kind: "live" },
    ],
    repo: "pRizz/open-links",
    href: "https://github.com/pRizz/open-links",
    summary: "Portable identity and link presence for owned web surfaces.",
    featured: true,
  },
  {
    slug: "free-the-world",
    name: "Free The World",
    aliases: [],
    placement: "home",
    tier: "flagship",
    sourceType: "original",
    maturity: "active",
    status: "building",
    includeOnHome: true,
    includeInProjectIndex: true,
    displayOrder: 20,
    themes: ["AI", "Open systems"],
    tags: ["ai", "coordination", "open-source"],
    role: "Creator",
    oneLine:
      "Free software and AI coordination work aimed at practical human agency beyond closed platforms.",
    curationReason:
      "Represents Peter's open-source agency and AI coordination thesis with a live public surface.",
    originalWork: { kind: "original" },
    links: [
      { label: "Source", href: "https://github.com/pRizz/free-the-world", kind: "repo" },
      { label: "Live site", href: "https://freetheworld.ai/", kind: "live" },
    ],
    repo: "pRizz/free-the-world",
    href: "https://github.com/pRizz/free-the-world",
    summary:
      "Free software and AI coordination work aimed at practical human agency beyond closed platforms.",
    featured: true,
  },
  {
    slug: "win3bitcoin",
    name: "Win3Bitco.in / Open Bitcoin Web Miner",
    aliases: ["open-bitcoin-web-miner", "Open Bitcoin Web Miner"],
    placement: "home",
    tier: "flagship",
    sourceType: "original",
    maturity: "active",
    status: "maintained",
    includeOnHome: true,
    includeInProjectIndex: true,
    displayOrder: 30,
    themes: ["Bitcoin", "Web experiments"],
    tags: ["bitcoin", "proof-of-work", "webgpu"],
    role: "Creator",
    oneLine:
      "Browser-based Bitcoin mining experiment that turns open web hardware into a proof-of-work playground.",
    curationReason:
      "Combines Bitcoin, open web experimentation, and a live surface backed by the verified open-bitcoin-web-miner repo.",
    originalWork: { kind: "original" },
    links: [
      {
        label: "Source",
        href: "https://github.com/pRizz/open-bitcoin-web-miner",
        kind: "repo",
      },
      { label: "Live site", href: "https://win3bitco.in/", kind: "live" },
    ],
    repo: "pRizz/open-bitcoin-web-miner",
    href: "https://github.com/pRizz/open-bitcoin-web-miner",
    summary:
      "Browser-based Bitcoin mining experiment that turns open web hardware into a proof-of-work playground.",
    featured: true,
  },
  {
    slug: "opencode-cloud",
    name: "opencode-cloud",
    aliases: [],
    placement: "home",
    tier: "flagship",
    sourceType: "original",
    maturity: "prototype",
    status: "building",
    includeOnHome: true,
    includeInProjectIndex: true,
    displayOrder: 40,
    themes: ["Developer tooling", "Agentic engineering"],
    tags: ["developer-tools", "agents", "cloud"],
    role: "Creator",
    oneLine:
      "Cloud-hostable opencode workbench for running agentic development tools outside a local-only setup.",
    curationReason:
      "Shows practical developer tooling work around agentic engineering and reproducible cloud environments.",
    originalWork: { kind: "original" },
    links: [{ label: "Source", href: "https://github.com/pRizz/opencode-cloud", kind: "repo" }],
    repo: "pRizz/opencode-cloud",
    href: "https://github.com/pRizz/opencode-cloud",
    summary:
      "Cloud-hostable opencode workbench for running agentic development tools outside a local-only setup.",
    featured: true,
  },
  {
    slug: "zeckendorf",
    name: "Zeckendorf",
    aliases: [],
    placement: "home",
    tier: "flagship",
    sourceType: "original",
    maturity: "prototype",
    status: "building",
    includeOnHome: true,
    includeInProjectIndex: true,
    displayOrder: 50,
    themes: ["Bitcoin", "Math"],
    tags: ["bitcoin", "math", "representation"],
    role: "Creator",
    oneLine:
      "Mathematical and Bitcoin-adjacent exploration of Zeckendorf representation as practical software.",
    curationReason:
      "Connects Peter's Bitcoin/open-systems interests with a focused computational experiment.",
    originalWork: { kind: "original" },
    links: [{ label: "Source", href: "https://github.com/pRizz/zeckendorf", kind: "repo" }],
    repo: "pRizz/zeckendorf",
    href: "https://github.com/pRizz/zeckendorf",
    summary:
      "Mathematical and Bitcoin-adjacent exploration of Zeckendorf representation as practical software.",
    featured: true,
  },
  {
    slug: "mystic-ui",
    name: "Mystic UI",
    aliases: [],
    placement: "home",
    tier: "flagship",
    sourceType: "fork",
    maturity: "active",
    status: "maintained",
    includeOnHome: true,
    includeInProjectIndex: true,
    displayOrder: 60,
    themes: ["SolidJS", "Design systems"],
    tags: ["solidjs", "tailwind", "ui"],
    role: "Maintainer",
    oneLine:
      "SolidJS component and styling primitives that anchor the portfolio's local design system.",
    curationReason:
      "Strategically important because Peter maintains the fork and this portfolio consumes it through a pinned commit.",
    originalWork: {
      kind: "promoted-fork",
      promotionReason: "Peter-owned SolidJS UI stack used by this portfolio",
    },
    links: [
      { label: "Source", href: "https://github.com/pRizz/mystic-ui", kind: "repo" },
      { label: "Live docs", href: "https://prizz.github.io/mystic-ui/", kind: "live" },
    ],
    repo: "pRizz/mystic-ui",
    href: "https://github.com/pRizz/mystic-ui",
    summary:
      "SolidJS component and styling primitives that anchor the portfolio's local design system.",
    featured: true,
  },
  {
    slug: "open-bitcoin",
    name: "Open Bitcoin",
    aliases: ["Open Bitcoin", "Win3Bitco.in"],
    placement: "supporting",
    tier: "supporting",
    sourceType: "concept",
    maturity: "prototype",
    status: "paused",
    includeOnHome: false,
    includeInProjectIndex: true,
    displayOrder: 110,
    themes: ["Bitcoin", "Open systems"],
    tags: ["bitcoin", "concept", "open-web"],
    role: "Curator",
    oneLine:
      "Broader Open Bitcoin story connected to Win3Bitco.in until a separate source is verified.",
    curationReason:
      "Included to preserve the named narrative without inventing a pRizz/open-bitcoin repository.",
    originalWork: { kind: "unreviewed", reason: "No standalone source repo verified" },
    links: [
      {
        label: "Related source",
        href: "https://github.com/pRizz/open-bitcoin-web-miner",
        kind: "related",
      },
      { label: "Live site", href: "https://win3bitco.in/", kind: "live" },
    ],
    repo: "pRizz/open-bitcoin-web-miner",
    href: "https://github.com/pRizz/open-bitcoin-web-miner",
    summary:
      "Broader Open Bitcoin story connected to Win3Bitco.in until a separate source is verified.",
    featured: false,
  },
  {
    slug: "open-links-sites",
    name: "OpenLinks Sites",
    aliases: [],
    placement: "supporting",
    tier: "supporting",
    sourceType: "support",
    maturity: "prototype",
    status: "paused",
    includeOnHome: false,
    includeInProjectIndex: true,
    displayOrder: 120,
    themes: ["Open web", "Identity"],
    tags: ["identity", "websites", "supporting-infrastructure"],
    role: "Creator",
    oneLine: "Supporting site experiments around OpenLinks identity surfaces.",
    curationReason: "Reviewed as OpenLinks supporting infrastructure, not a flagship story.",
    originalWork: { kind: "original" },
    links: [{ label: "Source", href: "https://github.com/pRizz/open-links-sites", kind: "repo" }],
    repo: "pRizz/open-links-sites",
    href: "https://github.com/pRizz/open-links-sites",
    summary: "Supporting site experiments around OpenLinks identity surfaces.",
    featured: false,
  },
  {
    slug: "bitcoin-bond-proposal",
    name: "Bitcoin Bond Proposal",
    aliases: [],
    placement: "lab",
    tier: "lab",
    sourceType: "original",
    maturity: "prototype",
    status: "paused",
    includeOnHome: false,
    includeInProjectIndex: true,
    displayOrder: 130,
    themes: ["Bitcoin", "Finance"],
    tags: ["bitcoin", "finance", "proposal"],
    role: "Creator",
    oneLine: "Bitcoin finance proposal experiment captured as reviewed lab work.",
    curationReason: "Relevant to the Bitcoin/open-systems thread but not home placement.",
    originalWork: { kind: "original" },
    links: [
      { label: "Source", href: "https://github.com/pRizz/bitcoin-bond-proposal", kind: "repo" },
    ],
    repo: "pRizz/bitcoin-bond-proposal",
    href: "https://github.com/pRizz/bitcoin-bond-proposal",
    summary: "Bitcoin finance proposal experiment captured as reviewed lab work.",
    featured: false,
  },
  {
    slug: "btc-vanity-address-finder",
    name: "BTC Vanity Address Finder",
    aliases: [],
    placement: "lab",
    tier: "lab",
    sourceType: "original",
    maturity: "prototype",
    status: "paused",
    includeOnHome: false,
    includeInProjectIndex: true,
    displayOrder: 140,
    themes: ["Bitcoin", "Cryptography"],
    tags: ["bitcoin", "addresses", "experiment"],
    role: "Creator",
    oneLine: "Bitcoin address-generation experiment kept as reviewed lab work.",
    curationReason:
      "Useful supporting Bitcoin experiment that should not displace flagship project stories.",
    originalWork: { kind: "original" },
    links: [
      {
        label: "Source",
        href: "https://github.com/pRizz/btc-vanity-address-finder",
        kind: "repo",
      },
    ],
    repo: "pRizz/btc-vanity-address-finder",
    href: "https://github.com/pRizz/btc-vanity-address-finder",
    summary: "Bitcoin address-generation experiment kept as reviewed lab work.",
    featured: false,
  },
] as const satisfies readonly ProjectStory[];

export const projectSeeds = curatedProjects;

export function homeProjects(
  projects: readonly ProjectStory[] = curatedProjects,
): readonly HomeProjectStory[] {
  return sortProjects(projects.filter(isHomeProjectStory));
}

export function featuredProjects(
  projects: readonly ProjectStory[] = curatedProjects,
): readonly HomeProjectStory[] {
  return homeProjects(projects);
}

export function visibleProjects(
  projects: readonly ProjectStory[] = curatedProjects,
): readonly ProjectStory[] {
  return sortProjects(projects.filter((project) => project.includeInProjectIndex));
}

export function projectsByPlacement(
  placement: ProjectPlacement,
  projects: readonly ProjectStory[] = curatedProjects,
): readonly ProjectStory[] {
  return sortProjects(projects.filter((project) => project.placement === placement));
}

export function primaryProjectLink(project: ProjectStory): ProjectLink {
  return project.links[0];
}

function isHomeProjectStory(project: ProjectStory): project is HomeProjectStory {
  return (
    project.placement === "home" &&
    project.tier === "flagship" &&
    project.includeOnHome &&
    project.includeInProjectIndex
  );
}

function sortProjects<TProject extends ProjectStory>(
  projects: readonly TProject[],
): readonly TProject[] {
  return [...projects].sort((left, right) => left.displayOrder - right.displayOrder);
}
