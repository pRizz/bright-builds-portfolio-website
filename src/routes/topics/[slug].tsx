import { Link as HeadLink, Meta, Title } from "@solidjs/meta";
import { useParams } from "@solidjs/router";
import { For, Show } from "solid-js";
import { TopicChip } from "../../components/TopicChip";
import {
  jsonLdScriptContent,
  metadataForFallbackPage,
  metadataForTopic,
  type PageMetadata,
  siteAssetLinks,
  topicCollectionPageJsonLd,
} from "../../domain/seo";
import {
  maybePublicTopicBySlug,
  type PublicContentReference,
  type PublicTopic,
} from "../../domain/topics";

const topicFallbackMetadata = metadataForFallbackPage({
  title: "No public topic here | Topics | Bright Builds",
  description:
    "Browse public topics to find a safe route through Peter's projects, writing, and theme paths.",
  canonicalPath: "/topics",
});

export default function TopicDetail() {
  const params = useParams();
  const topic = () => maybePublicTopicBySlug(params.slug ?? "");

  return (
    <Show when={topic()} fallback={<TopicFallback />}>
      {(selectedTopic) => <TopicArticle topic={selectedTopic()} />}
    </Show>
  );
}

function TopicFallback() {
  return (
    <>
      <TopicHead metadata={topicFallbackMetadata} />
      <section class="page-intro">
        <p class="eyebrow">Topic</p>
        <h1 class="page-title">No public topic here</h1>
        <p class="lead">
          Browse public topics to find a safe route through Peter's projects, writing, and theme
          paths.
        </p>
        <a class="primary-action interactive-surface" href="/topics">
          Browse topics
        </a>
      </section>
    </>
  );
}

function TopicArticle(props: { topic: PublicTopic }) {
  const topic = props.topic;
  const metadata = metadataForTopic(topic);
  const jsonLd = topicCollectionPageJsonLd(topic);
  const projects = referencesForKind(topic, "project");
  const writing = referencesForKind(topic, "writing");
  const themes = referencesForKind(topic, "theme");

  return (
    <article class="content-section">
      <TopicHead metadata={metadata} jsonLd={jsonLd} />
      <div class="page-intro">
        <a class="text-link detail-back-link" href="/topics">
          Back to topics
        </a>
        <p class="eyebrow">Topic</p>
        <h1 class="page-title">{topic.label}</h1>
        <p class="lead">{topicSummary(topic)}</p>
        <ul class="detail-status-row" aria-label={`${topic.label} public reference counts`}>
          <li class="tier-pill">{referenceCountLabel(topic.references.length, "reference")}</li>
          <li class="chip">{referenceCountLabel(projects.length, "project")}</li>
          <li class="chip">{referenceCountLabel(writing.length, "writing item")}</li>
          <li class="chip">{referenceCountLabel(themes.length, "theme path")}</li>
        </ul>
      </div>

      <div class="project-detail-layout">
        <section class="project-detail-story visual-surface" aria-labelledby="topic-overview">
          <h2 id="topic-overview" class="card-title">
            Public discovery path
          </h2>
          <div class="story-stack project-detail-stack">
            <p>
              <span class="story-label">Canonical label</span>
              {topic.label}
            </p>
            <p>
              <span class="story-label">Scope</span>
              Public projects, writing, and theme paths that already expose this canonical label.
            </p>
            <ul class="label-row" aria-label={`${topic.label} canonical labels`}>
              <li>
                <TopicChip label={topic.label} currentSlug={topic.slug} />
              </li>
            </ul>
          </div>
        </section>

        <aside class="project-detail-aside" aria-label={`${topic.label} public references`}>
          <ReferencePanel title="Projects" references={projects} currentSlug={topic.slug} />
          <ReferencePanel title="Writing" references={writing} currentSlug={topic.slug} />
          <ReferencePanel title="Theme paths" references={themes} currentSlug={topic.slug} />
        </aside>
      </div>
    </article>
  );
}

function TopicHead(props: { metadata: PageMetadata; jsonLd?: unknown }) {
  const metadata = props.metadata;

  return (
    <>
      <Title>{metadata.title}</Title>
      <Meta name="description" content={metadata.description} />
      <HeadLink rel="canonical" href={metadata.canonical} />
      <For each={siteAssetLinks}>
        {(asset) => {
          if (asset.rel === "apple-touch-icon") {
            return <HeadLink rel={asset.rel} href={asset.href} sizes={asset.sizes} />;
          }

          if ("sizes" in asset) {
            return (
              <HeadLink rel={asset.rel} href={asset.href} type={asset.type} sizes={asset.sizes} />
            );
          }

          return <HeadLink rel={asset.rel} href={asset.href} type={asset.type} />;
        }}
      </For>
      <Meta property="og:title" content={metadata.openGraph.title} />
      <Meta property="og:description" content={metadata.openGraph.description} />
      <Meta property="og:url" content={metadata.openGraph.url} />
      <Meta property="og:type" content={metadata.openGraph.type} />
      <Meta property="og:image" content={metadata.openGraph.image.url} />
      <Meta property="og:image:type" content={metadata.openGraph.image.mimeType} />
      <Meta property="og:image:width" content={metadata.openGraph.image.width.toString()} />
      <Meta property="og:image:height" content={metadata.openGraph.image.height.toString()} />
      <Meta property="og:image:alt" content={metadata.openGraph.image.alt} />
      <Meta name="twitter:card" content={metadata.twitter.card} />
      <Meta name="twitter:title" content={metadata.twitter.title} />
      <Meta name="twitter:description" content={metadata.twitter.description} />
      <Meta name="twitter:image" content={metadata.twitter.image.url} />
      <Meta name="twitter:image:alt" content={metadata.twitter.image.alt} />
      <Show when={props.jsonLd}>
        {(jsonLd) => <script type="application/ld+json">{jsonLdScriptContent(jsonLd())}</script>}
      </Show>
    </>
  );
}

function ReferencePanel(props: {
  title: "Projects" | "Writing" | "Theme paths";
  references: readonly PublicContentReference[];
  currentSlug: string;
}) {
  return (
    <Show when={props.references.length > 0}>
      <section class="project-detail-panel visual-surface" aria-labelledby={sectionId(props.title)}>
        <h2 id={sectionId(props.title)} class="card-title">
          {props.title}
        </h2>
        <div class="writing-related-grid">
          <For each={props.references}>
            {(reference) => <ReferenceCard reference={reference} currentSlug={props.currentSlug} />}
          </For>
        </div>
      </section>
    </Show>
  );
}

function ReferenceCard(props: { reference: PublicContentReference; currentSlug: string }) {
  return (
    <article class="surface-card">
      <h3 class="card-title">{props.reference.title}</h3>
      <ul class="label-row" aria-label={`${props.reference.title} labels`}>
        <li class="tier-pill">{referenceKindLabel(props.reference)}</li>
        <For each={props.reference.canonicalTopics}>
          {(topic) => (
            <li>
              <TopicChip label={topic.label} currentSlug={props.currentSlug} />
            </li>
          )}
        </For>
      </ul>
      <p class="card-copy">{props.reference.summary}</p>
      <div class="link-list">
        <a class="text-link surface-link" href={props.reference.canonicalPath}>
          {referenceActionLabel(props.reference)}
        </a>
      </div>
    </article>
  );
}

function referencesForKind<TKind extends PublicContentReference["kind"]>(
  topic: PublicTopic,
  kind: TKind,
): readonly Extract<PublicContentReference, { kind: TKind }>[] {
  return topic.references.filter(
    (reference): reference is Extract<PublicContentReference, { kind: TKind }> =>
      reference.kind === kind,
  );
}

function topicSummary(topic: PublicTopic): string {
  return `${topic.label} connects ${referenceCountLabel(
    topic.references.length,
    "public reference",
  )} across Peter's projects, writing, and theme paths.`;
}

function referenceKindLabel(reference: PublicContentReference): string {
  if (reference.kind === "project") {
    return "Project";
  }

  if (reference.kind === "writing") {
    return reference.writingKind === "note" ? "Note" : "Essay";
  }

  return "Theme path";
}

function referenceActionLabel(
  reference: PublicContentReference,
): "Open project" | "Read note" | "Read essay" | "Explore theme" {
  if (reference.kind === "project") {
    return "Open project";
  }

  if (reference.kind === "writing") {
    return reference.writingKind === "note" ? "Read note" : "Read essay";
  }

  return "Explore theme";
}

function referenceCountLabel(count: number, singular: string): string {
  return `${count} ${count === 1 ? singular : `${singular}s`}`;
}

function sectionId(title: string): string {
  return `topic-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}
