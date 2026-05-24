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
    title: "Peter Ryszkiewicz | Bright Builds",
    description:
      "Portfolio foundation for Peter Ryszkiewicz, pRizz, and the Bright Builds project ecosystem.",
    heading: "Peter Ryszkiewicz",
    staticCheckText: "Practical software for AI tools, Bitcoin, open systems, and web experiments.",
    nav: true,
  },
  {
    id: "about",
    path: "/about",
    label: "About",
    title: "About Peter Ryszkiewicz | Bright Builds",
    description:
      "A concise profile for Peter Ryszkiewicz, the builder behind pRizz and Bright Builds.",
    heading: "About Peter",
    staticCheckText:
      "I build with a bias toward useful tools, open systems, and resilient defaults.",
    nav: true,
  },
  {
    id: "projects",
    path: "/projects",
    label: "Projects",
    title: "Projects | Peter Ryszkiewicz",
    description:
      "A static-first shell for curated Peter Ryszkiewicz projects before full GitHub enrichment.",
    heading: "Curated Project Seeds",
    staticCheckText:
      "This initial set is deliberately curated, not a raw mirror of every repository.",
    nav: true,
  },
  {
    id: "contact",
    path: "/contact",
    label: "Contact",
    title: "Contact | Peter Ryszkiewicz",
    description:
      "Primary collaboration links for Peter Ryszkiewicz, including GitHub and OpenLinks.",
    heading: "Contact and Collaboration",
    staticCheckText: "The best starting point is GitHub, with OpenLinks as the identity hub.",
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
