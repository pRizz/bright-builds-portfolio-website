import { readFileSync } from "node:fs";

import { escapeXmlText, rssFeedXml, writingFeedItems } from "../../src/domain/feed";
import { peterProfile } from "../../src/domain/profile";
import { curatedWriting, type WritingEntry, writingDetailPath } from "../../src/domain/writing";
import { assertOutputFile, assertOutputTextEquals } from "./output";

const forbiddenFeedTexts = [
  `${peterProfile.canonicalOrigin}/projects/`,
  `${peterProfile.canonicalOrigin}/themes/`,
  "api.github.com",
  "github.com/graphql",
  "application/feed+json",
  "application/atom+xml",
  "newsletter",
  "subscription",
  "substack",
  "buttondown",
  "mailchimp",
  "websub",
  "webmention",
] as const;
const writingEntries: readonly WritingEntry[] = curatedWriting;

export function assertFeedStaticOutput(outputRoot: string): void {
  assertOutputTextEquals(outputRoot, "feed.xml", rssFeedXml());

  const feedXml = readFileSync(assertOutputFile(outputRoot, "feed.xml"), "utf8");

  if (feedXml.trim().length === 0) {
    throw new Error("Static feed output was empty.");
  }

  for (const item of writingFeedItems()) {
    assertFeedIncludes(feedXml, item.canonicalUrl, `${item.slug} canonical URL`);
    assertFeedIncludes(feedXml, escapeXmlText(item.title), `${item.slug} title`);
    assertFeedIncludes(feedXml, escapeXmlText(item.summary), `${item.slug} summary`);
  }

  for (const entry of writingEntries) {
    if (entry.status === "published" && (entry.maybePublishedOn || entry.maybeUpdatedOn)) {
      continue;
    }

    assertFeedExcludes(
      feedXml,
      `${peterProfile.canonicalOrigin}${writingDetailPath(entry)}`,
      `${entry.slug} non-feed writing URL`,
    );
  }

  for (const forbiddenText of forbiddenFeedTexts) {
    assertFeedExcludes(feedXml, forbiddenText, forbiddenText);
  }
}

function assertFeedIncludes(feedXml: string, expectedText: string, context: string): void {
  if (feedXml.includes(expectedText)) {
    return;
  }

  throw new Error(`Static feed output did not include ${context}: ${expectedText}`);
}

function assertFeedExcludes(feedXml: string, forbiddenText: string, context: string): void {
  if (!feedXml.includes(forbiddenText)) {
    return;
  }

  throw new Error(`Static feed output included forbidden ${context}: ${forbiddenText}`);
}
