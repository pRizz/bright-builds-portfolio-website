import { existsSync } from "node:fs";
import { join } from "node:path";

import { peterProfile } from "../../src/domain/profile";
import type { ProjectDetailPageProject } from "../../src/domain/projects";
import { projectDetailPath, publicProjectIndexProjects } from "../../src/domain/projects";
import type { SiteRoute } from "../../src/domain/routes";
import type { PageMetadata } from "../../src/domain/seo";
import {
  metadataForProject,
  metadataForRoute,
  metadataForWritingEntry,
  personJsonLd,
  projectItemListJsonLd,
  projectJsonLd,
  writingBlogPostingJsonLd,
  writingItemListJsonLd,
} from "../../src/domain/seo";
import type { PublicWritingEntry } from "../../src/domain/writing";
import { publicWritingEntries, writingDetailPath } from "../../src/domain/writing";
import {
  maybeProjectForDetailRoute,
  maybeThemeForDetailRoute,
  maybeWritingForDetailRoute,
  projectIndexItemPath,
  topLevelRouteForPath,
} from "./expected-route-text";
import {
  assertHtmlContains,
  assertHtmlMatches,
  assertJsonLdContains,
  escapeHtmlAttribute,
  escapeHtmlText,
  escapeRegExp,
} from "./html-assertions";

export function assertRouteMetadataAndJsonLd(
  outputRoot: string,
  routePath: string,
  html: string,
): void {
  const maybeProject = maybeProjectForDetailRoute(routePath);

  if (maybeProject) {
    assertMetadataForProject(outputRoot, maybeProject, html);
    assertProjectJsonLd(maybeProject, html);
    return;
  }

  const maybeWriting = maybeWritingForDetailRoute(routePath);

  if (maybeWriting) {
    assertMetadataForWritingEntry(outputRoot, maybeWriting, html);
    assertWritingBlogPostingJsonLd(maybeWriting, html);
    return;
  }

  const maybeTheme = maybeThemeForDetailRoute(routePath);

  // Phase 20 boundary: if (maybeTheme) { return; }
  if (maybeTheme) {
    return;
  }

  const route = topLevelRouteForPath(routePath);

  assertMetadataForRoute(outputRoot, route, html);
  assertJsonLdContains(html, [
    "Person",
    peterProfile.name,
    "https://github.com/pRizz",
    "https://openlinks.us/",
    JSON.stringify(personJsonLd()),
  ]);

  if (routePath === "/projects") {
    assertJsonLdContains(html, [
      "ItemList",
      JSON.stringify(projectItemListJsonLd()),
      ...publicProjectIndexProjects().map(
        (project) => `${peterProfile.canonicalOrigin}${projectIndexItemPath(project)}`,
      ),
    ]);
  }

  if (routePath === "/writing") {
    assertJsonLdContains(html, [
      "ItemList",
      JSON.stringify(writingItemListJsonLd()),
      ...publicWritingEntries().map(
        (entry) => `${peterProfile.canonicalOrigin}${writingDetailPath(entry)}`,
      ),
    ]);
  }
}

export function assertMetadataForRoute(outputRoot: string, route: SiteRoute, html: string): void {
  assertMetadata(outputRoot, route.path, metadataForRoute(route), html);
}

export function assertMetadataForProject(
  outputRoot: string,
  project: ProjectDetailPageProject,
  html: string,
): void {
  assertMetadata(outputRoot, projectDetailPath(project), metadataForProject(project), html);
}

export function assertMetadataForWritingEntry(
  outputRoot: string,
  entry: PublicWritingEntry,
  html: string,
): void {
  const metadata = metadataForWritingEntry(entry);
  assertMetadata(outputRoot, writingDetailPath(entry), metadata, html);

  if (!metadata.article) {
    throw new Error(`Writing metadata for ${entry.slug} did not include article fields.`);
  }

  if (metadata.article.maybePublishedTime) {
    assertHtmlContains(
      html,
      `property="article:published_time" content="${escapeHtmlAttribute(
        metadata.article.maybePublishedTime,
      )}"`,
      `${entry.slug} article:published_time`,
    );
  }

  if (metadata.article.maybeModifiedTime) {
    assertHtmlContains(
      html,
      `property="article:modified_time" content="${escapeHtmlAttribute(
        metadata.article.maybeModifiedTime,
      )}"`,
      `${entry.slug} article:modified_time`,
    );
  }

  for (const tag of metadata.article.tags) {
    assertHtmlContains(
      html,
      `property="article:tag" content="${escapeHtmlAttribute(tag)}"`,
      `${entry.slug} article:tag ${tag}`,
    );
  }
}

function assertMetadata(
  outputRoot: string,
  path: string,
  metadata: PageMetadata,
  html: string,
): void {
  const image = metadata.openGraph.image;

  assertHtmlMatches(
    html,
    new RegExp(`<title[^>]*>${escapeRegExp(escapeHtmlText(metadata.title))}</title>`),
    `${path} title`,
  );
  assertHtmlContains(
    html,
    `name="description" content="${escapeHtmlAttribute(metadata.description)}"`,
    `${path} meta description`,
  );
  assertHtmlContains(
    html,
    `rel="canonical" href="${escapeHtmlAttribute(metadata.canonical)}"`,
    `${path} canonical`,
  );
  assertHtmlContains(
    html,
    `property="og:title" content="${escapeHtmlAttribute(metadata.openGraph.title)}"`,
    `${path} og:title`,
  );
  assertHtmlContains(
    html,
    `property="og:description" content="${escapeHtmlAttribute(metadata.openGraph.description)}"`,
    `${path} og:description`,
  );
  assertHtmlContains(
    html,
    `property="og:url" content="${escapeHtmlAttribute(metadata.openGraph.url)}"`,
    `${path} og:url`,
  );
  assertHtmlContains(
    html,
    `property="og:type" content="${metadata.openGraph.type}"`,
    `${path} og:type`,
  );
  assertHtmlContains(html, `property="og:image" content="${image.url}"`, `${path} og:image`);
  assertHtmlContains(
    html,
    `property="og:image:width" content="${image.width.toString()}"`,
    `${path} og:image:width`,
  );
  assertHtmlContains(
    html,
    `property="og:image:height" content="${image.height.toString()}"`,
    `${path} og:image:height`,
  );
  assertHtmlContains(
    html,
    `property="og:image:alt" content="${escapeHtmlAttribute(image.alt)}"`,
    `${path} og:image:alt`,
  );
  assertHtmlContains(
    html,
    `name="twitter:card" content="${metadata.twitter.card}"`,
    `${path} twitter:card`,
  );
  assertHtmlContains(
    html,
    `name="twitter:title" content="${escapeHtmlAttribute(metadata.twitter.title)}"`,
    `${path} twitter:title`,
  );
  assertHtmlContains(
    html,
    `name="twitter:description" content="${escapeHtmlAttribute(metadata.twitter.description)}"`,
    `${path} twitter:description`,
  );
  assertHtmlContains(
    html,
    `name="twitter:image" content="${metadata.twitter.image.url}"`,
    `${path} twitter:image`,
  );
  assertHtmlContains(
    html,
    `name="twitter:image:alt" content="${escapeHtmlAttribute(metadata.twitter.image.alt)}"`,
    `${path} twitter:image:alt`,
  );
  assertMetadataImageMapsToLocalAsset(outputRoot, image.url);
  assertMetadataImageMapsToLocalAsset(outputRoot, metadata.twitter.image.url);
}

export function assertMetadataImageMapsToLocalAsset(outputRoot: string, imageUrl: string): void {
  const url = new URL(imageUrl);

  if (url.origin !== peterProfile.canonicalOrigin) {
    throw new Error(`Metadata image URL is not canonical: ${imageUrl}`);
  }

  const assetPath = url.pathname.replace(/^\//, "");

  if (assetPath !== "social/bright-builds-og.png") {
    throw new Error(
      `Metadata image URL ${imageUrl} does not map to the project social preview fallback.`,
    );
  }

  if (!existsSync(join(outputRoot, assetPath))) {
    throw new Error(`Metadata image URL ${imageUrl} does not map to a checked-in output asset.`);
  }
}

export function assertProjectJsonLd(project: ProjectDetailPageProject, html: string): void {
  const expectedJsonLd = projectJsonLd(project);
  const maybeProfileSameAsUrl = expectedJsonLd.creator.sameAs[0];

  if (!maybeProfileSameAsUrl) {
    throw new Error(`Project JSON-LD for ${project.slug} did not include a profile sameAs URL.`);
  }

  assertJsonLdContains(html, [
    "SoftwareSourceCode",
    expectedJsonLd.name,
    expectedJsonLd.url,
    maybeProfileSameAsUrl,
  ]);
}

export function assertWritingBlogPostingJsonLd(entry: PublicWritingEntry, html: string): void {
  const expectedJsonLd = writingBlogPostingJsonLd(entry);
  const maybeProfileSameAsUrl = expectedJsonLd.author.sameAs[0];

  if (!maybeProfileSameAsUrl) {
    throw new Error(`Writing JSON-LD for ${entry.slug} did not include a profile sameAs URL.`);
  }

  assertJsonLdContains(html, [
    "BlogPosting",
    expectedJsonLd.headline,
    expectedJsonLd.description,
    expectedJsonLd.url,
    maybeProfileSameAsUrl,
    "https://openlinks.us/",
  ]);
}
