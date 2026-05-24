import type { Profile } from "./profile";
import { peterProfile, profileSameAsLinks } from "./profile";
import type { SiteRoute } from "./routes";

export type PageMetadata = {
  title: string;
  description: string;
  canonical: string;
  openGraph: {
    title: string;
    description: string;
    url: string;
    type: "website";
  };
  twitter: {
    card: "summary_large_image";
    title: string;
    description: string;
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

export function metadataForRoute(route: SiteRoute, profile: Profile = peterProfile): PageMetadata {
  const canonical = `${profile.canonicalOrigin}${route.path === "/" ? "" : route.path}`;

  return {
    title: route.title,
    description: route.description,
    canonical,
    openGraph: {
      title: route.title,
      description: route.description,
      url: canonical,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: route.title,
      description: route.description,
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
