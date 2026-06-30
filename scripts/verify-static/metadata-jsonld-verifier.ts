import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { peterProfile } from "../../src/domain/profile";
import type { ProjectDetailPageProject } from "../../src/domain/projects";
import { projectDetailPath, publicProjectIndexProjects } from "../../src/domain/projects";
import type { SiteRoute } from "../../src/domain/routes";
import type { PageMetadata } from "../../src/domain/seo";
import {
  metadataForProject,
  metadataForRoute,
  metadataForTheme,
  metadataForTopic,
  metadataForWritingEntry,
  personJsonLd,
  projectItemListJsonLd,
  projectJsonLd,
  themeCollectionPageJsonLd,
  themeItemListJsonLd,
  topicCollectionPageJsonLd,
  topicItemListJsonLd,
  writingBlogPostingJsonLd,
  writingItemListJsonLd,
} from "../../src/domain/seo";
import {
  maybeSocialPreviewTargetForRoutePath,
  SOCIAL_PREVIEW_FALLBACK_IMAGE,
  type SocialPreviewTarget,
} from "../../src/domain/social-previews";
import type { PublicThemeEntry } from "../../src/domain/themes";
import { publicThemeEntries, themeDetailPath } from "../../src/domain/themes";
import { publicTopics } from "../../src/domain/topics";
import type { PublicWritingEntry } from "../../src/domain/writing";
import { publicWritingEntries, writingDetailPath } from "../../src/domain/writing";
import type {
  SocialPreviewManifest,
  SocialPreviewManifestEntry,
} from "../social-previews/manifest";
import {
  maybeProjectForDetailRoute,
  maybeThemeForDetailRoute,
  maybeTopicForDetailRoute,
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
import { assertPngDimensions } from "./output";

const socialPreviewManifestOutputPath = "social/generated/manifest.json";

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

  if (maybeTheme) {
    assertMetadataForTheme(outputRoot, maybeTheme, html);
    assertThemeCollectionPageJsonLd(maybeTheme, html);
    return;
  }

  const maybeTopic = maybeTopicForDetailRoute(routePath);

  if (maybeTopic) {
    assertMetadata(outputRoot, maybeTopic.canonicalPath, metadataForTopic(maybeTopic), html);
    assertTopicCollectionPageJsonLd(maybeTopic, html);
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

  if (routePath === "/themes") {
    assertJsonLdContains(html, [
      "ItemList",
      JSON.stringify(themeItemListJsonLd()),
      ...publicThemeEntries().map(
        (theme) => `${peterProfile.canonicalOrigin}${themeDetailPath(theme)}`,
      ),
    ]);
  }

  if (routePath === "/topics") {
    assertJsonLdContains(html, [
      "ItemList",
      JSON.stringify(topicItemListJsonLd()),
      ...publicTopics().map((topic) => `${peterProfile.canonicalOrigin}${topic.canonicalPath}`),
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

export function assertMetadataForTheme(
  outputRoot: string,
  theme: PublicThemeEntry,
  html: string,
): void {
  assertMetadata(outputRoot, themeDetailPath(theme), metadataForTheme(theme), html);
}

function assertTopicCollectionPageJsonLd(
  topic: ReturnType<typeof publicTopics>[number],
  html: string,
): void {
  const jsonLd = topicCollectionPageJsonLd(topic);

  assertJsonLdContains(html, [
    "CollectionPage",
    JSON.stringify(jsonLd),
    topic.label,
    ...topic.references.map(
      (reference) => `${peterProfile.canonicalOrigin}${reference.canonicalPath}`,
    ),
  ]);
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
    `property="og:image:type" content="${image.mimeType}"`,
    `${path} og:image:type`,
  );
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
  assertMetadataImageMapsToLocalAsset(outputRoot, path, image.url);
  assertMetadataImageMapsToLocalAsset(outputRoot, path, metadata.twitter.image.url);
}

export function assertMetadataImageMapsToLocalAsset(
  outputRoot: string,
  routePath: string,
  imageUrl: string,
): void {
  const url = new URL(imageUrl);

  if (url.origin !== peterProfile.canonicalOrigin) {
    throw new Error(`Metadata image URL is not canonical: ${imageUrl}`);
  }

  const maybeTarget = maybeSocialPreviewTargetForRoutePath(routePath);
  const expectedImage = maybeTarget ?? SOCIAL_PREVIEW_FALLBACK_IMAGE;

  if (url.pathname !== expectedImage.assetPath) {
    throw new Error(
      `Metadata image URL ${imageUrl} does not match the expected social preview for ${routePath}: ${expectedImage.assetPath}.`,
    );
  }

  assertPngDimensions(
    outputRoot,
    expectedImage.assetPath.replace(/^\//, ""),
    expectedImage.dimensions.width,
    expectedImage.dimensions.height,
  );

  if (maybeTarget) {
    assertSocialPreviewManifestMatchesTarget(outputRoot, maybeTarget);
  }
}

function assertSocialPreviewManifestMatchesTarget(
  outputRoot: string,
  target: SocialPreviewTarget,
): void {
  const manifest = readSocialPreviewManifest(outputRoot, target.routePath);
  const maybeEntry = manifest.entries.find((entry) => entry.routePath === target.routePath);

  if (!maybeEntry) {
    throw new Error(
      `Social preview manifest entry for ${target.routePath} does not match routePath: expected entry with routePath ${target.routePath}.`,
    );
  }

  assertManifestFieldMatchesTarget(target, "assetPath", maybeEntry.assetPath);
  assertManifestFieldMatchesTarget(target, "dimensions.width", maybeEntry.dimensions.width);
  assertManifestFieldMatchesTarget(target, "dimensions.height", maybeEntry.dimensions.height);
  assertManifestFieldMatchesTarget(target, "sourceFingerprint", maybeEntry.sourceFingerprint);
  assertManifestEntryMatchesCopiedPng(outputRoot, target, maybeEntry);
}

function readSocialPreviewManifest(outputRoot: string, routePath: string): SocialPreviewManifest {
  const outputPath = join(outputRoot, socialPreviewManifestOutputPath);

  if (!existsSync(outputPath)) {
    throw new Error(
      `Missing social preview manifest in static output for ${routePath}: ${socialPreviewManifestOutputPath}`,
    );
  }

  const parsedManifest: unknown = JSON.parse(readFileSync(outputPath, "utf8"));

  if (isSocialPreviewManifest(parsedManifest)) {
    return parsedManifest;
  }

  throw new Error(
    `Social preview manifest in static output for ${routePath} is invalid: expected version 1 with entries.`,
  );
}

function assertManifestFieldMatchesTarget(
  target: SocialPreviewTarget,
  field: "assetPath" | "dimensions.width" | "dimensions.height" | "sourceFingerprint",
  actual: string | number,
): void {
  const expected = manifestTargetValue(target, field);

  if (actual === expected) {
    return;
  }

  throw new Error(
    `Social preview manifest entry for ${target.routePath} does not match ${field}: expected ${expected}, received ${actual}.`,
  );
}

function manifestTargetValue(
  target: SocialPreviewTarget,
  field: "assetPath" | "dimensions.width" | "dimensions.height" | "sourceFingerprint",
): string | number {
  if (field === "assetPath") {
    return target.assetPath;
  }

  if (field === "dimensions.width") {
    return target.dimensions.width;
  }

  if (field === "dimensions.height") {
    return target.dimensions.height;
  }

  return target.sourceFingerprint;
}

function assertManifestEntryMatchesCopiedPng(
  outputRoot: string,
  target: SocialPreviewTarget,
  entry: SocialPreviewManifestEntry,
): void {
  const pngBytes = readFileSync(join(outputRoot, entry.assetPath.replace(/^\//, "")));
  const copiedPngSha256 = createHash("sha256").update(pngBytes).digest("hex");

  if (entry.byteSize !== pngBytes.length) {
    throw new Error(
      `Social preview manifest entry for ${target.routePath} does not match byteSize: expected copied PNG byteSize ${pngBytes.length}, received ${entry.byteSize}.`,
    );
  }

  if (entry.sha256 !== copiedPngSha256) {
    throw new Error(
      `Social preview manifest entry for ${target.routePath} does not match sha256: expected copied PNG sha256 ${copiedPngSha256}, received ${entry.sha256}.`,
    );
  }
}

function isSocialPreviewManifest(value: unknown): value is SocialPreviewManifest {
  if (!isRecord(value) || value.version !== 1 || !Array.isArray(value.entries)) {
    return false;
  }

  return value.entries.every(isSocialPreviewManifestEntry);
}

function isSocialPreviewManifestEntry(value: unknown): value is SocialPreviewManifestEntry {
  if (!isRecord(value) || !isRecord(value.dimensions)) {
    return false;
  }

  return (
    typeof value.routePath === "string" &&
    typeof value.assetPath === "string" &&
    typeof value.dimensions.width === "number" &&
    typeof value.dimensions.height === "number" &&
    typeof value.byteSize === "number" &&
    typeof value.sourceFingerprint === "string" &&
    typeof value.sha256 === "string"
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
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
    expectedJsonLd.image,
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
    expectedJsonLd.image,
    maybeProfileSameAsUrl,
    "https://openlinks.us/",
  ]);
}

export function assertThemeCollectionPageJsonLd(theme: PublicThemeEntry, html: string): void {
  const expectedJsonLd = themeCollectionPageJsonLd(theme);
  const maybeProfileSameAsUrl = expectedJsonLd.creator.sameAs[0];

  if (!maybeProfileSameAsUrl) {
    throw new Error(`Theme JSON-LD for ${theme.slug} did not include a profile sameAs URL.`);
  }

  assertJsonLdContains(html, [
    "CollectionPage",
    expectedJsonLd.name,
    expectedJsonLd.description,
    expectedJsonLd.url,
    expectedJsonLd.mainEntityOfPage,
    expectedJsonLd.image,
    maybeProfileSameAsUrl,
    "https://openlinks.us/",
    theme.collaborationAngle,
    ...expectedJsonLd.hasPart.map((part) => part.url),
  ]);
}
