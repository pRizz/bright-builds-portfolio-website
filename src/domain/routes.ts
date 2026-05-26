export type RouteId = "home" | "about" | "projects" | "contact";

export type SiteRoute = {
  id: RouteId;
  path: string;
  label: string;
  title: string;
  description: string;
  heading: string;
  staticCheckText: string;
  nav: boolean;
};

export const siteRoutes = [
  {
    id: "home",
    path: "/",
    label: "Home",
    title: "Peter Ryszkiewicz / pRizz | Bright Builds",
    description:
      "Portfolio for Peter Ryszkiewicz / pRizz, an agentic engineer building across AI, Bitcoin, open systems, developer tooling, and practical web experiments.",
    heading: "Peter Ryszkiewicz",
    staticCheckText:
      "Peter Ryszkiewicz / pRizz builds practical software through Bright Builds across AI, Bitcoin, open systems, developer tooling, and practical web experiments.",
    nav: true,
  },
  {
    id: "about",
    path: "/about",
    label: "About",
    title: "About Peter Ryszkiewicz / pRizz | Bright Builds",
    description:
      "Themes behind Peter Ryszkiewicz's work across agentic engineering, open source, Bitcoin, web tooling, and creative experiments.",
    heading: "About Peter",
    staticCheckText:
      "Agentic engineering, open source, Bitcoin, web tooling, and creative experiments are the connective tissue.",
    nav: true,
  },
  {
    id: "projects",
    path: "/projects",
    label: "Projects",
    title: "Curated Projects | Peter Ryszkiewicz",
    description:
      "Flagship, supporting, lab, and archived project stories curated from Peter Ryszkiewicz's work without mirroring every repository.",
    heading: "Curated Projects",
    staticCheckText:
      "Flagship, supporting, lab, and archive work are separated by reviewed registry placement.",
    nav: true,
  },
  {
    id: "contact",
    path: "/contact",
    label: "Contact",
    title: "Contact Peter Ryszkiewicz / pRizz | Bright Builds",
    description:
      "Collaboration links for Peter Ryszkiewicz, with GitHub first and OpenLinks as a low-intrusion identity hub.",
    heading: "Contact and Collaboration",
    staticCheckText:
      "Start with GitHub, or use OpenLinks to verify Peter's current identity links.",
    nav: true,
  },
] as const satisfies readonly SiteRoute[];

export const prerenderRoutes = siteRoutes.map((route) => route.path);

export const navigationRoutes = siteRoutes.filter((route) => route.nav);

export function routeByPath(path: string): SiteRoute {
  const maybeRoute = siteRoutes.find((route) => route.path === path);

  if (maybeRoute) {
    return maybeRoute;
  }

  return siteRoutes[0];
}
