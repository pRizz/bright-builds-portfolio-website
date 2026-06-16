import { readFileSync } from "node:fs";

import {
  gitHubMetadataFactsForProject,
  maybeGitHubHomepageLinkForProject,
  maybeGitHubMetadataForProject,
} from "../../src/domain/github-metadata";
import type { ProjectStory } from "../../src/domain/projects";
import {
  homeProjects,
  projectLinkDisplayLabel,
  publicProjectIndexProjects,
} from "../../src/domain/projects";
import { maybeProjectForDetailRoute } from "./expected-route-text";
import {
  assertForbiddenTextAbsent,
  assertHtmlContains,
  assertHtmlMatches,
  escapeHtmlAttribute,
  escapeHtmlText,
  preHydrationBody,
} from "./html-assertions";
import { routeHtmlPath } from "./output";
import type { StaticRouteCheck } from "./types";

export function assertRouteHtml(root: string, check: StaticRouteCheck): void {
  const htmlPath = routeHtmlPath(root, check.route);
  const html = readFileSync(htmlPath, "utf8");
  const bodyBeforeHydration = preHydrationBody(html);

  assertPhase04ShellHtml(check.route, html, bodyBeforeHydration);

  for (const expectedText of check.expectedTexts) {
    assertHtmlContains(
      bodyBeforeHydration,
      expectedText,
      `Static body for ${check.route} before hydration`,
    );
  }

  assertGitHubMetadataEnrichmentHtml(check.route, bodyBeforeHydration);
  assertForbiddenTextAbsent(root, htmlPath, html, check.forbiddenTextPatterns ?? []);
}

export function assertPhase04ShellHtml(
  route: string,
  html: string,
  bodyBeforeHydration: string,
): void {
  assertHtmlMatches(html, /<html[^>]+class="[^"]*\bdark\b[^"]*"/, `${route} dark root`);
  assertHtmlContains(bodyBeforeHydration, "site-shell", `${route} static site-shell`);
  assertHtmlContains(
    bodyBeforeHydration,
    '<main id="content" class="site-main">',
    `${route} static main landmark`,
  );

  if (route === "/") {
    assertHtmlContains(bodyBeforeHydration, "brand-material", "home local visual hook");
    assertHtmlContains(bodyBeforeHydration, "Peter Ryszkiewicz", "home identity copy");
    assertHtmlContains(bodyBeforeHydration, "Browse projects", "home project CTA");
    assertHtmlContains(bodyBeforeHydration, "Now building", "home focus panel");
    assertHtmlContains(
      bodyBeforeHydration,
      "Flagship work selected from the curated registry",
      "home flagship story text",
    );
  }

  if (route === "/about") {
    assertHtmlContains(
      bodyBeforeHydration,
      "OpenLinks identity hub",
      "about OpenLinks profile placement",
    );
  }

  if (route === "/contact") {
    assertHtmlContains(bodyBeforeHydration, "OpenLinks", "contact OpenLinks profile placement");
    assertHtmlContains(bodyBeforeHydration, "https://openlinks.us/", "contact OpenLinks URL");
  }

  assertHtmlContains(bodyBeforeHydration, "OpenLinks profile", `${route} footer OpenLinks profile`);
}

export function assertGitHubMetadataEnrichmentHtml(
  route: string,
  bodyBeforeHydration: string,
): void {
  const maybeProject = maybeProjectForDetailRoute(route);

  if (maybeProject) {
    if (maybeGitHubMetadataForProject(maybeProject)) {
      assertGitHubMetadataFactsHtml(maybeProject, bodyBeforeHydration, "project detail");
    }

    return;
  }

  if (route === "/") {
    assertHomeGitHubMetadataHtml(bodyBeforeHydration);
    return;
  }

  if (route === "/projects") {
    assertProjectIndexGitHubMetadataHtml(bodyBeforeHydration);
  }
}

function assertHomeGitHubMetadataHtml(bodyBeforeHydration: string): void {
  const projects = homeProjects();

  for (const [index, project] of projects.entries()) {
    if (!maybeGitHubMetadataForProject(project)) {
      continue;
    }

    const segment = htmlSegmentForProject({
      html: bodyBeforeHydration,
      startMarker: homeProjectCardMarker(project),
      maybeEndMarker: maybeHomeProjectCardMarker(projects[index + 1]),
      context: `home GitHub repository metadata for ${project.slug}`,
    });

    assertGitHubMetadataFactsHtml(project, segment, "home");

    const maybeHomepageLink = maybeGitHubHomepageLinkForProject(project);

    if (maybeHomepageLink) {
      assertHtmlContains(
        segment,
        `href="${escapeHtmlAttribute(maybeHomepageLink.href)}"`,
        `home GitHub homepage link for ${project.slug}`,
      );
      assertHtmlContains(
        segment,
        projectLinkDisplayLabel(maybeHomepageLink),
        `home GitHub homepage link label for ${project.slug}`,
      );
    }
  }
}

function assertProjectIndexGitHubMetadataHtml(bodyBeforeHydration: string): void {
  const projects = publicProjectIndexProjects();

  for (const [index, project] of projects.entries()) {
    if (!maybeGitHubMetadataForProject(project)) {
      continue;
    }

    const segment = htmlSegmentForProject({
      html: bodyBeforeHydration,
      startMarker: projectIndexCardMarker(project),
      maybeEndMarker: maybeProjectIndexCardMarker(projects[index + 1]),
      context: `project index GitHub repository metadata for ${project.slug}`,
    });

    assertGitHubMetadataFactsHtml(project, segment, "project index");
  }
}

function assertGitHubMetadataFactsHtml(
  project: ProjectStory,
  html: string,
  routeLabel: string,
): void {
  assertHtmlContains(
    html,
    'aria-label="GitHub repository metadata"',
    `${routeLabel} metadata row for ${project.slug}`,
  );

  for (const fact of gitHubMetadataFactsForProject(project)) {
    assertHtmlContains(
      html,
      escapeHtmlText(fact.label),
      `${routeLabel} metadata fact label for ${project.slug}`,
    );
    assertHtmlContains(
      html,
      escapeHtmlText(fact.value),
      `${routeLabel} metadata fact value for ${project.slug}`,
    );
  }
}

function htmlSegmentForProject(options: {
  html: string;
  startMarker: string;
  maybeEndMarker: string | null;
  context: string;
}): string {
  const start = options.html.indexOf(options.startMarker);

  if (start === -1) {
    throw new Error(`${options.context} missing start marker: ${options.startMarker}`);
  }

  const end =
    options.maybeEndMarker === null
      ? -1
      : options.html.indexOf(options.maybeEndMarker, start + options.startMarker.length);

  return options.html.slice(start, end === -1 ? options.html.length : end);
}

function homeProjectCardMarker(project: ProjectStory): string {
  return `<h3 class="card-title">${escapeHtmlText(project.name)}</h3>`;
}

function maybeHomeProjectCardMarker(maybeProject: ProjectStory | undefined): string | null {
  return maybeProject ? homeProjectCardMarker(maybeProject) : null;
}

function projectIndexCardMarker(project: ProjectStory): string {
  return `id="${escapeHtmlAttribute(project.slug)}"`;
}

function maybeProjectIndexCardMarker(maybeProject: ProjectStory | undefined): string | null {
  return maybeProject ? projectIndexCardMarker(maybeProject) : null;
}
