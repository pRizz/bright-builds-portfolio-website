import { type Profile, peterProfile } from "./profile";
import { canonicalTopicsForLabels } from "./topics";
import { publicWritingEntries, type WritingEntry, writingDetailPath } from "./writing";

export type WritingFeedItem = {
  id: string;
  title: string;
  summary: string;
  canonicalUrl: string;
  feedDate: string;
  displayOrder: number;
  slug: string;
  categories: readonly string[];
};

export type WritingFeedMetadata = {
  title: string;
  description: string;
  siteUrl: string;
  feedUrl: string;
  language: "en-US";
};

export function writingFeedMetadata(
  profile: Pick<Profile, "canonicalOrigin" | "name" | "company"> = peterProfile,
): WritingFeedMetadata {
  return {
    title: "Bright Builds writing feed",
    description:
      "Writing from Peter Ryszkiewicz on agentic engineering, open systems, identity, and practical web software.",
    siteUrl: profile.canonicalOrigin,
    feedUrl: `${profile.canonicalOrigin}/feed.xml`,
    language: "en-US",
  };
}

export function writingFeedItems(
  entries: readonly WritingEntry[] = publicWritingEntries(),
  profile: Pick<Profile, "canonicalOrigin"> = peterProfile,
): readonly WritingFeedItem[] {
  return sortFeedItems(
    publicWritingEntries(entries).flatMap((entry) => {
      const maybeFeedDate = entry.maybeUpdatedOn ?? entry.maybePublishedOn;

      if (!maybeFeedDate) {
        return [];
      }

      const canonicalUrl = `${profile.canonicalOrigin}${writingDetailPath(entry)}`;

      return [
        {
          id: canonicalUrl,
          title: entry.title,
          summary: entry.summary,
          canonicalUrl,
          feedDate: maybeFeedDate,
          displayOrder: entry.displayOrder,
          slug: entry.slug,
          categories: canonicalTopicsForLabels([...entry.topics, ...entry.tags]).map(
            (topic) => topic.label,
          ),
        },
      ];
    }),
  );
}

export function escapeXmlText(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function escapeXmlAttribute(value: string): string {
  return escapeXmlText(value).replace(/"/g, "&quot;");
}

export function rssDateFromIsoDate(value: string): string {
  const date = new Date(`${value}T00:00:00Z`);

  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw new Error(`Invalid feed date: ${value}`);
  }

  return date.toUTCString();
}

export function rssFeedXml(
  input: { metadata?: WritingFeedMetadata; items?: readonly WritingFeedItem[] } = {},
): string {
  const metadata = input.metadata ?? writingFeedMetadata();
  const items = input.items ?? writingFeedItems();

  return `${[
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    "  <channel>",
    `    <title>${escapeXmlText(metadata.title)}</title>`,
    `    <link>${escapeXmlText(metadata.siteUrl)}</link>`,
    `    <description>${escapeXmlText(metadata.description)}</description>`,
    `    <language>${escapeXmlText(metadata.language)}</language>`,
    ...items.flatMap(rssItemXmlLines),
    "  </channel>",
    "</rss>",
  ].join("\n")}\n`;
}

function sortFeedItems(items: readonly WritingFeedItem[]): readonly WritingFeedItem[] {
  return [...items].sort(
    (left, right) =>
      right.feedDate.localeCompare(left.feedDate) ||
      left.displayOrder - right.displayOrder ||
      left.slug.localeCompare(right.slug),
  );
}

function rssItemXmlLines(item: WritingFeedItem): readonly string[] {
  return [
    "    <item>",
    `      <title>${escapeXmlText(item.title)}</title>`,
    `      <link>${escapeXmlText(item.canonicalUrl)}</link>`,
    `      <guid isPermaLink="true">${escapeXmlText(item.id)}</guid>`,
    `      <pubDate>${rssDateFromIsoDate(item.feedDate)}</pubDate>`,
    `      <description>${escapeXmlText(item.summary)}</description>`,
    ...item.categories.map((category) => `      <category>${escapeXmlText(category)}</category>`),
    "    </item>",
  ];
}
