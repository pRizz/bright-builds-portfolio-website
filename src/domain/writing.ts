export type WritingStatus = "published" | "draft" | "hidden" | "archived";
export type WritingKind = "note" | "essay";

export type WritingBodyBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "list"; items: readonly [string, ...string[]] }
  | { kind: "callout"; text: string }
  | { kind: "link"; label: string; href: string };

export type WritingSection = {
  heading: string;
  blocks: readonly [WritingBodyBlock, ...WritingBodyBlock[]];
};

export type WritingEntry = {
  slug: string;
  title: string;
  summary: string;
  status: WritingStatus;
  kind: WritingKind;
  maybePublishedOn?: string;
  maybeUpdatedOn?: string;
  displayOrder: number;
  topics: readonly [string, ...string[]];
  tags: readonly string[];
  relatedProjectSlugs: readonly string[];
  sections: readonly [WritingSection, ...WritingSection[]];
};

export type PublicWritingEntry = WritingEntry & {
  status: "published";
};

/**
 * Maintainer-facing writing data surface.
 *
 * `curatedWriting` is the authoritative checked-in registry. Supported runtime
 * helper exports are `curatedWriting`, `publicWritingEntries`,
 * `maybePublicWritingEntryBySlug`, `writingDetailPath`, `writingDetailRoutes`,
 * and `relatedProjectDetailPageProjects`.
 */
export const curatedWriting = [
  {
    slug: "agentic-engineering-workflows",
    title: "Agentic engineering workflows",
    summary:
      "Notes on keeping AI-assisted development inspectable, tested, and tied to repo-owned evidence.",
    status: "published",
    kind: "note",
    maybePublishedOn: "2026-06-03",
    displayOrder: 10,
    topics: ["Agentic engineering"],
    tags: ["ai", "developer-tools"],
    relatedProjectSlugs: ["opencode-cloud", "free-the-world"],
    sections: [
      {
        heading: "Working thesis",
        blocks: [
          {
            kind: "paragraph",
            text: "Agentic engineering works best when agents produce small, reviewable changes against a shared contract instead of treating automation as a black box.",
          },
          {
            kind: "list",
            items: [
              "Keep decisions in planning artifacts.",
              "Prefer pure domain helpers before UI wiring.",
              "Treat verification output as the source of release confidence.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "portable-identity-and-owned-surfaces",
    title: "Portable identity and owned surfaces",
    summary:
      "A note on why owned web identity should stay visible, low-friction, and independent of any single social platform.",
    status: "published",
    kind: "note",
    maybePublishedOn: "2026-06-03",
    displayOrder: 20,
    topics: ["Open web"],
    tags: ["identity", "open-web"],
    relatedProjectSlugs: ["openlinks"],
    sections: [
      {
        heading: "Identity should be inspectable",
        blocks: [
          {
            kind: "paragraph",
            text: "Owned web surfaces make identity easier to verify because the canonical signal is not trapped inside a single platform profile.",
          },
          {
            kind: "callout",
            text: "OpenLinks should stay a low-intrusion identity signal, not the main portfolio call to action.",
          },
        ],
      },
    ],
  },
] as const satisfies readonly WritingEntry[];
