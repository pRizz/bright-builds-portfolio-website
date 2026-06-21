import type { Profile } from "./profile";
import { peterProfile, profileSameAsLinks } from "./profile";
import type { ProjectDetailPageProject, ProjectStory } from "./projects";
import {
  projectDetailPageProjects,
  projectDetailPath,
  publicProjectIndexProjects,
} from "./projects";
import type { SiteRoute } from "./routes";
import { sitemapRoutes } from "./routes";
import {
  maybeSocialPreviewTargetForRoutePath,
  SOCIAL_PREVIEW_FALLBACK_IMAGE,
} from "./social-previews";
import type { PublicThemeEntry } from "./themes";
import {
  publicThemeEntries,
  relatedProjectDetailPageProjectsForTheme,
  relatedWritingEntriesForTheme,
  themeDetailPath,
} from "./themes";
import type { PublicWritingEntry, WritingBodyBlock } from "./writing";
import { publicWritingEntries, writingDetailPath } from "./writing";

export type SocialImageMetadata = {
  url: string;
  width: number;
  height: number;
  alt: string;
  mimeType: "image/png";
};

export type SiteAssetLink = {
  rel: "icon" | "apple-touch-icon";
  href: string;
  type?: string;
  sizes?: string;
};

export type PageMetadata = {
  title: string;
  description: string;
  canonical: string;
  openGraph: {
    title: string;
    description: string;
    url: string;
    type: "website" | "article";
    image: SocialImageMetadata;
  };
  twitter: {
    card: "summary_large_image";
    title: string;
    description: string;
    image: SocialImageMetadata;
  };
  article?: {
    maybePublishedTime?: string;
    maybeModifiedTime?: string;
    tags: readonly string[];
  };
};

export type PersonJsonLd = {
  "@context": "https://schema.org";
  "@type": "Person";
  name: string;
  alternateName: string;
  url: string;
  sameAs: string[];
  worksFor: {
    "@type": "Organization";
    name: string;
  };
};

export type ProjectItemListJsonLd = {
  "@context": "https://schema.org";
  "@type": "ItemList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    item: {
      "@type": "SoftwareSourceCode";
      name: string;
      description: string;
      url: string;
      sameAs: string[];
    };
  }>;
};

export type ProjectJsonLd = {
  "@context": "https://schema.org";
  "@type": "SoftwareSourceCode";
  name: string;
  description: string;
  url: string;
  image: string;
  sameAs: string[];
  keywords: string;
  creator: PersonJsonLd;
  about: string[];
};

export type WritingBlogPostingJsonLd = {
  "@context": "https://schema.org";
  "@type": "BlogPosting";
  headline: string;
  name: string;
  description: string;
  url: string;
  mainEntityOfPage: string;
  image: string;
  author: PersonJsonLd;
  creator: PersonJsonLd;
  datePublished?: string;
  dateModified?: string;
  keywords: readonly string[];
  about: readonly string[];
  articleBody: string;
};

type WritingBlogPostingItemJsonLd = Omit<WritingBlogPostingJsonLd, "@context" | "articleBody">;

export type WritingItemListJsonLd = {
  "@context": "https://schema.org";
  "@type": "ItemList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    item: WritingBlogPostingItemJsonLd;
  }>;
};

export type ThemeItemListJsonLd = {
  "@context": "https://schema.org";
  "@type": "ItemList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    item: {
      "@type": "CollectionPage";
      name: string;
      description: string;
      url: string;
    };
  }>;
};

type ThemeProjectPartJsonLd = {
  "@type": "SoftwareSourceCode";
  name: string;
  description: string;
  url: string;
  sameAs: string[];
};

export type ThemeCollectionPageJsonLd = {
  "@context": "https://schema.org";
  "@type": "CollectionPage";
  name: string;
  description: string;
  url: string;
  mainEntityOfPage: string;
  image: string;
  creator: PersonJsonLd;
  keywords: readonly string[];
  about: readonly string[];
  mentions: readonly string[];
  hasPart: Array<ThemeProjectPartJsonLd | WritingBlogPostingItemJsonLd>;
};

export const siteAssetLinks = [
  {
    rel: "icon",
    href: "/favicon.svg",
    type: "image/svg+xml",
  },
  {
    rel: "icon",
    href: "/icon-192.png",
    type: "image/png",
    sizes: "192x192",
  },
  {
    rel: "apple-touch-icon",
    href: "/apple-touch-icon.png",
    sizes: "180x180",
  },
] as const satisfies readonly SiteAssetLink[];

export function metadataForRoute(route: SiteRoute, profile: Profile = peterProfile): PageMetadata {
  const routePath = route.path;
  const canonical = `${profile.canonicalOrigin}${routePath === "/" ? "" : routePath}`;
  const socialImage = socialImageForRoutePath(routePath, profile);

  return {
    title: route.title,
    description: route.description,
    canonical,
    openGraph: {
      title: route.title,
      description: route.description,
      url: canonical,
      type: "website",
      image: socialImage,
    },
    twitter: {
      card: "summary_large_image",
      title: route.title,
      description: route.description,
      image: socialImage,
    },
  };
}

export function metadataForProject(
  project: ProjectStory,
  profile: Profile = peterProfile,
): PageMetadata {
  const routePath = projectDetailPath(project);
  const canonical = `${profile.canonicalOrigin}${routePath}`;
  const title = `${project.name} | Project Story | Bright Builds`;
  const description = project.oneLine;
  const socialImage = socialImageForRoutePath(routePath, profile);

  return {
    title,
    description,
    canonical,
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      image: socialImage,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      image: socialImage,
    },
  };
}

export function metadataForWritingEntry(
  entry: PublicWritingEntry,
  profile: Profile = peterProfile,
): PageMetadata {
  const routePath = writingDetailPath(entry);
  const canonical = `${profile.canonicalOrigin}${routePath}`;
  const title = `${entry.title} | Writing | Bright Builds`;
  const description = entry.summary;
  const socialImage = socialImageForRoutePath(routePath, profile);

  return {
    title,
    description,
    canonical,
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
      image: socialImage,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      image: socialImage,
    },
    article: {
      ...(entry.maybePublishedOn ? { maybePublishedTime: entry.maybePublishedOn } : {}),
      ...(entry.maybeUpdatedOn ? { maybeModifiedTime: entry.maybeUpdatedOn } : {}),
      tags: [...entry.topics, ...entry.tags],
    },
  };
}

export function metadataForTheme(
  theme: PublicThemeEntry,
  profile: Profile = peterProfile,
): PageMetadata {
  const routePath = themeDetailPath(theme);
  const canonical = `${profile.canonicalOrigin}${routePath}`;
  const title = `${theme.title} | Themes | Bright Builds`;
  const description = theme.summary;
  const socialImage = socialImageForRoutePath(routePath, profile);

  return {
    title,
    description,
    canonical,
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      image: socialImage,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      image: socialImage,
    },
  };
}

export function personJsonLd(profile: Profile = peterProfile): PersonJsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    alternateName: profile.handle,
    url: profile.canonicalOrigin,
    sameAs: profileSameAsLinks(profile),
    worksFor: {
      "@type": "Organization",
      name: profile.company,
    },
  };
}

export function projectItemListJsonLd(
  projects: readonly ProjectStory[] = publicProjectIndexProjects(),
  profile: Profile = peterProfile,
): ProjectItemListJsonLd {
  const projectDetailSlugs = new Set(
    projectDetailPageProjects(projects).map((project) => project.slug),
  );

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: publicProjectIndexProjects(projects).map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "SoftwareSourceCode",
        name: project.name,
        description: project.oneLine,
        url: `${profile.canonicalOrigin}${
          projectDetailSlugs.has(project.slug)
            ? projectDetailPath(project)
            : `/projects#${project.slug}`
        }`,
        sameAs: project.links.map((link) => link.href),
      },
    })),
  };
}

export function projectJsonLd(
  project: ProjectDetailPageProject,
  profile: Profile = peterProfile,
): ProjectJsonLd {
  const routePath = projectDetailPath(project);
  const canonical = `${profile.canonicalOrigin}${routePath}`;

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.name,
    description: project.oneLine,
    url: canonical,
    image: socialImageForRoutePath(routePath, profile).url,
    sameAs: project.links.map((link) => link.href),
    keywords: [...project.themes, ...project.tags].join(", "),
    creator: personJsonLd(profile),
    about: [
      project.story.problem,
      project.story.approach,
      project.story.whyItMatters,
      project.detail.intro,
      project.detail.technicalShape,
      project.detail.currentStatus,
      project.detail.collaborationAngle,
      ...project.detail.proofPoints,
    ],
  };
}

export function writingBlogPostingJsonLd(
  entry: PublicWritingEntry,
  profile: Profile = peterProfile,
): WritingBlogPostingJsonLd {
  return {
    "@context": "https://schema.org",
    ...writingBlogPostingItemJsonLd(entry, profile),
    articleBody: writingArticleBodyText(entry),
  };
}

export function writingItemListJsonLd(
  entries: readonly PublicWritingEntry[] = publicWritingEntries(),
  profile: Profile = peterProfile,
): WritingItemListJsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: entries.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: writingBlogPostingItemJsonLd(entry, profile),
    })),
  };
}

export function themeItemListJsonLd(
  themes: readonly PublicThemeEntry[] = publicThemeEntries(),
  profile: Profile = peterProfile,
): ThemeItemListJsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: themes.map((theme, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "CollectionPage",
        name: theme.title,
        description: theme.summary,
        url: `${profile.canonicalOrigin}${themeDetailPath(theme)}`,
      },
    })),
  };
}

export function themeCollectionPageJsonLd(
  theme: PublicThemeEntry,
  profile: Profile = peterProfile,
): ThemeCollectionPageJsonLd {
  const routePath = themeDetailPath(theme);
  const canonical = `${profile.canonicalOrigin}${routePath}`;
  const relatedProjects = relatedProjectDetailPageProjectsForTheme(theme);
  const relatedWriting = relatedWritingEntriesForTheme(theme);
  const labels = [theme.title, theme.audience, ...theme.proofPoints];

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: theme.title,
    description: theme.summary,
    url: canonical,
    mainEntityOfPage: canonical,
    image: socialImageForRoutePath(routePath, profile).url,
    creator: personJsonLd(profile),
    keywords: labels,
    about: [theme.summary, theme.audience, theme.collaborationAngle, ...theme.proofPoints],
    mentions: [theme.collaborationAngle, ...theme.proofPoints],
    hasPart: [
      ...relatedProjects.map((project) => ({
        "@type": "SoftwareSourceCode" as const,
        name: project.name,
        description: project.oneLine,
        url: `${profile.canonicalOrigin}${projectDetailPath(project)}`,
        sameAs: project.links.map((link) => link.href),
      })),
      ...relatedWriting.map((entry) => writingBlogPostingItemJsonLd(entry, profile)),
    ],
  };
}

export function sitemapXml(
  paths: readonly string[] = sitemapRoutes,
  profile: Profile = peterProfile,
): string {
  const urls = paths
    .map((routePath) => {
      const path = routePath === "/" ? "" : routePath;
      return `  <url><loc>${profile.canonicalOrigin}${path}</loc></url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
}

export function robotsTxt(profile: Profile = peterProfile): string {
  return `User-agent: *\nAllow: /\nSitemap: ${profile.canonicalOrigin}/sitemap.xml`;
}

export function jsonLdScriptContent(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function socialImageForRoutePath(routePath: string, profile: Profile): SocialImageMetadata {
  const maybeTarget = maybeSocialPreviewTargetForRoutePath(routePath);
  const image = maybeTarget ?? SOCIAL_PREVIEW_FALLBACK_IMAGE;

  return {
    url: `${profile.canonicalOrigin}${image.assetPath}`,
    width: image.dimensions.width,
    height: image.dimensions.height,
    alt: image.alt,
    mimeType: "image/png",
  };
}

function writingBlogPostingItemJsonLd(
  entry: PublicWritingEntry,
  profile: Profile,
): WritingBlogPostingItemJsonLd {
  const routePath = writingDetailPath(entry);
  const canonical = `${profile.canonicalOrigin}${routePath}`;
  const identity = personJsonLd(profile);
  const labels = [...entry.topics, ...entry.tags];

  return {
    "@type": "BlogPosting",
    headline: entry.title,
    name: entry.title,
    description: entry.summary,
    url: canonical,
    mainEntityOfPage: canonical,
    image: socialImageForRoutePath(routePath, profile).url,
    author: identity,
    creator: identity,
    ...(entry.maybePublishedOn ? { datePublished: entry.maybePublishedOn } : {}),
    ...(entry.maybeUpdatedOn ? { dateModified: entry.maybeUpdatedOn } : {}),
    keywords: labels,
    about: labels,
  };
}

function writingArticleBodyText(entry: PublicWritingEntry): string {
  return entry.sections
    .flatMap((section) => [
      section.heading,
      ...section.blocks.flatMap((block) => writingBodyBlockText(block)),
    ])
    .join("\n\n");
}

function writingBodyBlockText(block: WritingBodyBlock): readonly string[] {
  if (block.kind === "paragraph" || block.kind === "callout") {
    return [block.text];
  }

  if (block.kind === "list") {
    return [...block.items];
  }

  return [block.label];
}
