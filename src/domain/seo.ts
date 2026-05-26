import type { Profile } from "./profile";
import { peterProfile, profileSameAsLinks } from "./profile";
import type { ProjectStory } from "./projects";
import { publicProjectIndexProjects } from "./projects";
import type { SiteRoute } from "./routes";
import { siteRoutes } from "./routes";

export type SocialImageMetadata = {
  url: string;
  width: number;
  height: number;
  alt: string;
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
    type: "website";
    image: SocialImageMetadata;
  };
  twitter: {
    card: "summary_large_image";
    title: string;
    description: string;
    image: SocialImageMetadata;
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

const socialImagePath = "/social/bright-builds-og.png";
const socialImageSize = {
  width: 1200,
  height: 630,
  alt: "Peter Ryszkiewicz / pRizz and Bright Builds portfolio focus on AI, Bitcoin, open systems, and developer tooling.",
} as const;

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
  const canonical = `${profile.canonicalOrigin}${route.path === "/" ? "" : route.path}`;
  const socialImage = socialImageForProfile(profile);

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
        url: `${profile.canonicalOrigin}/projects#${project.slug}`,
        sameAs: project.links.map((link) => link.href),
      },
    })),
  };
}

export function sitemapXml(
  routes: readonly SiteRoute[] = siteRoutes,
  profile: Profile = peterProfile,
): string {
  const urls = routes
    .map((route) => {
      const path = route.path === "/" ? "" : route.path;
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

function socialImageForProfile(profile: Profile): SocialImageMetadata {
  return {
    url: `${profile.canonicalOrigin}${socialImagePath}`,
    ...socialImageSize,
  };
}
