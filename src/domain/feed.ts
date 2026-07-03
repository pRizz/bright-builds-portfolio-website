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

function sortFeedItems(items: readonly WritingFeedItem[]): readonly WritingFeedItem[] {
  return [...items].sort(
    (left, right) =>
      right.feedDate.localeCompare(left.feedDate) ||
      left.displayOrder - right.displayOrder ||
      left.slug.localeCompare(right.slug),
  );
}
