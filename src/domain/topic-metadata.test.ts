import { describe, expect, it } from "vitest";
import { peterProfile } from "./profile";
import {
  jsonLdScriptContent,
  metadataForRoute,
  metadataForTopic,
  personJsonLd,
  topicCollectionPageJsonLd,
  topicItemListJsonLd,
} from "./seo";
import { SOCIAL_PREVIEW_FALLBACK_IMAGE } from "./social-previews";
import { publicTopics, topicDetailPath } from "./topics";

describe("topic metadata", () => {
  it("derives topic detail metadata from a public topic", () => {
    // Arrange
    const topic = publicTopics()[0];

    // Act
    const metadata = metadataForTopic(topic, peterProfile);

    // Assert
    expect(metadata.title).toBe(`${topic.label} | Topics | Bright Builds`);
    expect(metadata.description).toContain(topic.label);
    expect(metadata.description).toContain("public references");
    expect(metadata.canonical).toBe(`${peterProfile.canonicalOrigin}${topicDetailPath(topic)}`);
    expect(metadata.openGraph).toMatchObject({
      title: metadata.title,
      description: metadata.description,
      url: metadata.canonical,
      type: "website",
    });
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description,
    });
  });

  it("uses the fallback social image contract for topic routes", () => {
    // Arrange
    const topic = publicTopics()[0];
    const expectedImage = SOCIAL_PREVIEW_FALLBACK_IMAGE;

    // Act
    const metadata = metadataForTopic(topic, peterProfile);
    const indexMetadata = metadataForRoute(
      {
        id: "topics",
        path: "/topics",
        label: "Topics",
        title: "Topics | Peter Ryszkiewicz",
        description:
          "Public topics connecting Peter Ryszkiewicz's projects, writing, and theme paths through safe static discovery routes.",
        heading: "Topics",
        staticCheckText:
          "Browse the public labels that connect Peter's projects, writing, and theme paths.",
        nav: true,
      },
      peterProfile,
    );

    // Assert
    expect(metadata.openGraph.image).toEqual({
      url: `${peterProfile.canonicalOrigin}${expectedImage.assetPath}`,
      width: expectedImage.dimensions.width,
      height: expectedImage.dimensions.height,
      alt: expectedImage.alt,
      mimeType: "image/png",
    });
    expect(metadata.twitter.image).toEqual(metadata.openGraph.image);
    expect(indexMetadata.openGraph.image).toEqual(metadata.openGraph.image);
  });

  it("creates ordered topic ItemList JSON-LD for public topics", () => {
    // Arrange
    const topics = publicTopics();

    // Act
    const jsonLd = topicItemListJsonLd(topics, peterProfile);

    // Assert
    expect(jsonLd["@type"]).toBe("ItemList");
    expect(jsonLd.itemListElement).toHaveLength(topics.length);
    for (const [index, topic] of topics.entries()) {
      expect(jsonLd.itemListElement[index]).toMatchObject({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "CollectionPage",
          name: topic.label,
          url: `${peterProfile.canonicalOrigin}${topicDetailPath(topic)}`,
        },
      });
    }
  });

  it("creates topic CollectionPage JSON-LD with public references and identity", () => {
    // Arrange
    const topic = publicTopics()[0];
    const canonical = `${peterProfile.canonicalOrigin}${topicDetailPath(topic)}`;

    // Act
    const jsonLd = topicCollectionPageJsonLd(topic, peterProfile);

    // Assert
    expect(jsonLd).toMatchObject({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: topic.label,
      url: canonical,
      mainEntityOfPage: canonical,
      creator: personJsonLd(peterProfile),
    });
    expect(jsonLd.creator.sameAs).toEqual(
      expect.arrayContaining(["https://github.com/pRizz", "https://openlinks.us/"]),
    );
    expect(jsonLd.hasPart).toHaveLength(topic.references.length);
    expect(jsonLd.hasPart.map((part) => part.url)).toEqual(
      topic.references.map(
        (reference) => `${peterProfile.canonicalOrigin}${reference.canonicalPath}`,
      ),
    );
  });

  it("serializes topic CollectionPage JSON-LD safely for script tags", () => {
    // Arrange
    const topic = {
      ...publicTopics()[0],
      label: "Topic <schema>",
    };

    // Act
    const content = jsonLdScriptContent(topicCollectionPageJsonLd(topic, peterProfile));

    // Assert
    expect(content).not.toContain("<");
    expect(content).toContain("\\u003c");
  });
});
