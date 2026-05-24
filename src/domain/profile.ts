export type ProfileLinkKind = "code" | "identity" | "contact" | "site";

export type ProfileLink = {
  label: string;
  href: string;
  kind: ProfileLinkKind;
  maybeRel?: string;
};

export type Profile = {
  name: string;
  handle: string;
  company: string;
  canonicalOrigin: string;
  summary: string;
  focusAreas: readonly string[];
  links: readonly ProfileLink[];
};

export const peterProfile = {
  name: "Peter Ryszkiewicz",
  handle: "pRizz",
  company: "Bright Builds",
  canonicalOrigin: "https://www.brightbuilds.us",
  summary:
    "Peter Ryszkiewicz builds practical software across AI tooling, Bitcoin, open systems, developer experience, and web experiments.",
  focusAreas: [
    "AI tools",
    "Bitcoin",
    "Open systems",
    "Developer tooling",
    "Practical web experiments",
  ],
  links: [
    {
      label: "GitHub",
      href: "https://github.com/pRizz",
      kind: "code",
      maybeRel: "me noopener noreferrer",
    },
    {
      label: "OpenLinks",
      href: "https://openlinks.us/",
      kind: "identity",
      maybeRel: "me noopener noreferrer",
    },
    {
      label: "Bright Builds",
      href: "https://www.brightbuilds.us/",
      kind: "site",
      maybeRel: "noopener noreferrer",
    },
  ],
} as const satisfies Profile;

export function profileLinksByKind(
  profile: Profile,
  kind: ProfileLinkKind,
): readonly ProfileLink[] {
  return profile.links.filter((link) => link.kind === kind);
}

export function profileSameAsLinks(profile: Profile): string[] {
  return profile.links.filter((link) => link.maybeRel?.includes("me")).map((link) => link.href);
}
