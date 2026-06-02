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

export type ProjectStoryDetails = {
  problem: string;
  approach: string;
  whyItMatters: string;
};

export type ProjectDetailStory = {
  intro: string;
  technicalShape: string;
  proofPoints: readonly [string, ...string[]];
  currentStatus: string;
  collaborationAngle: string;
};

export type ProjectOriginalWork =
  | { kind: "original" }
  | { kind: "promoted-fork"; promotionReason: string }
  | { kind: "not-original"; reason: string }
  | { kind: "unreviewed"; reason: string };

export type ProjectStory = {
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
  story: ProjectStoryDetails;
  detail?: ProjectDetailStory;
  curationReason: string;
  originalWork: ProjectOriginalWork;
  links: readonly [ProjectLink, ...ProjectLink[]];
};

const currentFocusProjectSlugs = [
  "openlinks",
  "free-the-world",
  "win3bitcoin",
  "open-bitcoin",
  "opencode-cloud",
] as const;

export type HomeProjectStory = ProjectStory & {
  placement: "home";
  tier: "flagship";
  includeOnHome: true;
  includeInProjectIndex: true;
};

export type ProjectDetailPageProject = ProjectStory & {
  tier: "flagship";
  includeInProjectIndex: true;
  detail: ProjectDetailStory;
};

/**
 * Maintainer-facing project data surface.
 *
 * `curatedProjects` is the authoritative checked-in registry. Supported selector
 * exports are `homeProjects`, `visibleProjects`, `publicProjectIndexProjects`,
 * `hiddenExcludedProjects`, `currentFocusProjects`, `projectDetailPageProjects`,
 * `maybeProjectDetailPageProjectBySlug`, `projectsByPlacement`, `writingProjects`,
 * `projectDetailPath`, `projectDetailRoutes`, `projectAnchorHref`, and
 * `projectLinkDisplayLabel`.
 */
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
    story: {
      problem: "Personal identity is scattered across profiles, badges, and owned sites.",
      approach:
        "Package identity links and verification hints into a portable OpenLinks surface that other sites can reference.",
      whyItMatters:
        "It gives collaborators one stable place to verify Peter's current web presence.",
    },
    detail: {
      intro:
        "OpenLinks is Peter's portable identity layer for linking owned web surfaces, profile references, and verification hints without making any single platform authoritative.",
      technicalShape:
        "Static web surfaces and metadata conventions make the identity profile easy to inspect, link, and reuse from other owned sites.",
      proofPoints: [
        "Live public identity surface at openlinks.us.",
        "Source is reviewed as original OpenLinks work.",
        "Bright Builds already uses OpenLinks as a low-intrusion identity signal.",
      ],
      currentStatus: "Active and building.",
      collaborationAngle:
        "Useful for collaborators interested in owned identity, rel=me style verification, and portable profile surfaces.",
    },
    curationReason: "Central identity project with a live public surface and verified source repo.",
    originalWork: { kind: "original" },
    links: [
      { label: "Source", href: "https://github.com/pRizz/open-links", kind: "repo" },
      { label: "Live site", href: "https://openlinks.us/", kind: "live" },
    ],
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
    story: {
      problem: "Useful AI coordination work often gets trapped inside closed workflows.",
      approach:
        "Explore open-source software and agent workflows that keep human agency at the center.",
      whyItMatters:
        "It frames Peter's AI work around practical freedom, not novelty for its own sake.",
    },
    detail: {
      intro:
        "Free The World is the open-source agency thread in Peter's work: practical AI and coordination systems that should remain inspectable and user-directed.",
      technicalShape:
        "The project is presented as an open software surface with room for agent workflows, coordination experiments, and supporting public artifacts.",
      proofPoints: [
        "Live public surface at freetheworld.ai.",
        "Source is reviewed as original work.",
        "Connects the portfolio's AI theme to the broader open-systems thesis.",
      ],
      currentStatus: "Active and building.",
      collaborationAngle:
        "Useful for collaborators interested in open AI workflows, human agency, and practical coordination tools.",
    },
    curationReason:
      "Represents Peter's open-source agency and AI coordination thesis with a live public surface.",
    originalWork: { kind: "original" },
    links: [
      { label: "Source", href: "https://github.com/pRizz/free-the-world", kind: "repo" },
      { label: "Live site", href: "https://freetheworld.ai/", kind: "live" },
    ],
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
    story: {
      problem: "Bitcoin proof-of-work is hard to make tangible in the browser.",
      approach:
        "Use an open web mining experiment to turn everyday hardware into a visible proof-of-work playground.",
      whyItMatters:
        "It connects Bitcoin mechanics with an inspectable web experiment people can try.",
    },
    detail: {
      intro:
        "Win3Bitco.in makes Bitcoin proof-of-work feel concrete by turning browser hardware into an inspectable mining experiment.",
      technicalShape:
        "The project pairs an open web interface with the verified open-bitcoin-web-miner source to make proof-of-work mechanics visible.",
      proofPoints: [
        "Live experiment at win3bitco.in.",
        "Source is reviewed as original Bitcoin/web work.",
        "Shows a clear bridge between Bitcoin mechanics and practical web experimentation.",
      ],
      currentStatus: "Maintained and available as a public experiment.",
      collaborationAngle:
        "Useful for collaborators interested in Bitcoin education, browser-based compute, WebGPU-style experiments, and proof-of-work interfaces.",
    },
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
    story: {
      problem: "Agentic development tools are still too tied to one local machine.",
      approach:
        "Prototype a cloud-hostable workbench for running opencode-style workflows in reproducible environments.",
      whyItMatters:
        "It points toward practical agent infrastructure that teams can share and audit.",
    },
    detail: {
      intro:
        "opencode-cloud explores how agentic development workflows can move from a single local machine into reproducible cloud workspaces.",
      technicalShape:
        "The project is a cloud-hostable workbench prototype for running opencode-style development tools in shared, inspectable environments.",
      proofPoints: [
        "Source is reviewed as original developer tooling work.",
        "Directly supports the portfolio's agentic engineering theme.",
        "Provides a concrete infrastructure angle beyond UI-only agent demos.",
      ],
      currentStatus: "Prototype and building.",
      collaborationAngle:
        "Useful for collaborators interested in agent infrastructure, reproducible developer environments, and cloud-hosted coding workflows.",
    },
    curationReason:
      "Shows practical developer tooling work around agentic engineering and reproducible cloud environments.",
    originalWork: { kind: "original" },
    links: [{ label: "Source", href: "https://github.com/pRizz/opencode-cloud", kind: "repo" }],
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
    story: {
      problem:
        "Interesting Bitcoin-adjacent math ideas often stay disconnected from usable software.",
      approach: "Turn Zeckendorf representation into a focused computational experiment.",
      whyItMatters:
        "It shows Peter's interest in mathematical tools that can become practical systems.",
    },
    detail: {
      intro:
        "Zeckendorf is a focused computational thread around representation, number systems, and Bitcoin-adjacent mathematical software.",
      technicalShape:
        "The project turns Zeckendorf representation into an inspectable software experiment rather than leaving it as a detached math note.",
      proofPoints: [
        "Source is reviewed as original mathematical software work.",
        "Connects the portfolio's Bitcoin and math themes.",
        "Provides a concrete example of Peter turning abstract concepts into practical experiments.",
      ],
      currentStatus: "Prototype and building.",
      collaborationAngle:
        "Useful for collaborators interested in mathematical software, representation systems, and Bitcoin-adjacent computational experiments.",
    },
    curationReason:
      "Connects Peter's Bitcoin/open-systems interests with a focused computational experiment.",
    originalWork: { kind: "original" },
    links: [{ label: "Source", href: "https://github.com/pRizz/zeckendorf", kind: "repo" }],
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
    story: {
      problem:
        "SolidJS projects need design primitives that fit the local stack without React adapters.",
      approach:
        "Maintain a Peter-owned Mystic UI fork and consume it through a pinned SolidJS and Tailwind setup.",
      whyItMatters:
        "It keeps the portfolio interface stack aligned with the tools Peter actually uses.",
    },
    detail: {
      intro:
        "Mystic UI is the SolidJS design-system thread behind this portfolio's local interface choices.",
      technicalShape:
        "The project is consumed through a pinned GitHub dependency and Tailwind/SolidJS setup, keeping component primitives aligned with the site's actual stack.",
      proofPoints: [
        "Source is reviewed as a Peter-maintained fork.",
        "This portfolio consumes Mystic UI through an exact pinned commit.",
        "Live docs are available for the maintained UI surface.",
      ],
      currentStatus: "Maintained as a Peter-owned SolidJS UI stack.",
      collaborationAngle:
        "Useful for collaborators interested in SolidJS components, Tailwind-compatible primitives, and practical design-system maintenance.",
    },
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
    story: {
      problem:
        "The Open Bitcoin narrative needs a reviewed place without inventing a standalone source.",
      approach:
        "Connect it to the related Win3Bitco.in source and live site while keeping the role as curation.",
      whyItMatters:
        "It preserves the Bitcoin open-web thread without overstating the project's maturity.",
    },
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
    story: {
      problem:
        "OpenLinks identity surfaces need supporting site experiments around owned-web presence.",
      approach:
        "Use supporting site work to explore identity websites without promoting it as the flagship.",
      whyItMatters:
        "It keeps the OpenLinks infrastructure story visible while preserving flagship focus.",
    },
    curationReason: "Reviewed as OpenLinks supporting infrastructure, not a flagship story.",
    originalWork: { kind: "original" },
    links: [{ label: "Source", href: "https://github.com/pRizz/open-links-sites", kind: "repo" }],
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
    story: {
      problem: "Bitcoin finance proposal ideas need a reviewed lab slot instead of home placement.",
      approach:
        "Keep the proposal as creator-owned lab work connected to the Bitcoin finance theme.",
      whyItMatters:
        "It shows the Bitcoin thread while keeping speculative proposal work clearly labeled.",
    },
    curationReason: "Relevant to the Bitcoin/open-systems thread but not home placement.",
    originalWork: { kind: "original" },
    links: [
      { label: "Source", href: "https://github.com/pRizz/bitcoin-bond-proposal", kind: "repo" },
    ],
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
    story: {
      problem:
        "Bitcoin address-generation experiments can be useful but should not crowd flagship work.",
      approach:
        "Present the vanity address finder as reviewed lab work with its source link and paused status.",
      whyItMatters:
        "It supports the Bitcoin experimentation thread without overstating active development.",
    },
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
  },
] as const satisfies readonly ProjectStory[];

export function homeProjects(
  projects: readonly ProjectStory[] = curatedProjects,
): readonly HomeProjectStory[] {
  return sortProjects(projects.filter(isHomeProjectStory));
}

export function visibleProjects(
  projects: readonly ProjectStory[] = curatedProjects,
): readonly ProjectStory[] {
  return publicProjectIndexProjects(projects);
}

export function publicProjectIndexProjects(
  projects: readonly ProjectStory[] = curatedProjects,
): readonly ProjectStory[] {
  return sortProjects(projects.filter(isPublicProjectIndexProject));
}

export function hiddenExcludedProjects(
  projects: readonly ProjectStory[] = curatedProjects,
): readonly ProjectStory[] {
  return sortProjects(projects.filter((project) => !isPublicProjectIndexProject(project)));
}

export function currentFocusProjects(
  projects: readonly ProjectStory[] = curatedProjects,
): readonly ProjectStory[] {
  return currentFocusProjectSlugs.flatMap((slug) => {
    const maybeProject = projects.find((project) => project.slug === slug);
    return maybeProject ? [maybeProject] : [];
  });
}

export function projectDetailPageProjects(
  projects: readonly ProjectStory[] = curatedProjects,
): readonly ProjectDetailPageProject[] {
  return sortProjects(projects.filter(isProjectDetailPageProject));
}

export function maybeProjectDetailPageProjectBySlug(
  slug: string,
  projects: readonly ProjectStory[] = curatedProjects,
): ProjectDetailPageProject | null {
  return projectDetailPageProjects(projects).find((project) => project.slug === slug) ?? null;
}

export function projectsByPlacement(
  placement: ProjectPlacement,
  projects: readonly ProjectStory[] = publicProjectIndexProjects(),
): readonly ProjectStory[] {
  return sortProjects(projects.filter((project) => project.placement === placement));
}

export function writingProjects(
  projects: readonly ProjectStory[] = publicProjectIndexProjects(),
): readonly ProjectStory[] {
  return sortProjects(
    projects.filter(
      (project) =>
        project.links.some((link) => link.kind === "article") ||
        project.tags.includes("writing") ||
        project.themes.includes("Writing"),
    ),
  );
}

export function projectAnchorHref(project: ProjectStory): string {
  return `/projects#${project.slug}`;
}

export function projectDetailPath(project: Pick<ProjectStory, "slug">): string {
  return `/projects/${project.slug}`;
}

export function projectDetailRoutes(
  projects: readonly ProjectStory[] = curatedProjects,
): readonly string[] {
  return projectDetailPageProjects(projects).map(projectDetailPath);
}

export function projectLinkDisplayLabel(link: ProjectLink): string {
  if (link.kind === "repo") {
    return "Open source";
  }

  if (
    link.label === "Live site" ||
    link.label === "Live docs" ||
    link.label === "Docs" ||
    link.label === "Article" ||
    link.label === "Related source"
  ) {
    return link.label;
  }

  return link.label;
}

function isHomeProjectStory(project: ProjectStory): project is HomeProjectStory {
  return (
    project.placement === "home" &&
    project.tier === "flagship" &&
    project.includeOnHome &&
    project.includeInProjectIndex
  );
}

function isPublicProjectIndexProject(project: ProjectStory): boolean {
  return (
    project.includeInProjectIndex &&
    project.placement !== "hidden" &&
    project.tier !== "excluded" &&
    project.status !== "hidden"
  );
}

function isProjectDetailPageProject(project: ProjectStory): project is ProjectDetailPageProject {
  return (
    isPublicProjectIndexProject(project) &&
    project.tier === "flagship" &&
    project.detail !== undefined &&
    project.detail.proofPoints.length > 0
  );
}

function sortProjects<TProject extends ProjectStory>(
  projects: readonly TProject[],
): readonly TProject[] {
  return [...projects].sort((left, right) => left.displayOrder - right.displayOrder);
}
