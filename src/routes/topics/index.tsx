import { Link as HeadLink, Meta, Title } from "@solidjs/meta";
import { For, Show } from "solid-js";
import { ReactiveSurface } from "../../components/ReactiveSurface";
import { routeByPath } from "../../domain/routes";
import {
  jsonLdScriptContent,
  metadataForRoute,
  personJsonLd,
  siteAssetLinks,
  topicItemListJsonLd,
} from "../../domain/seo";
import { type PublicTopic, publicTopics, topicDetailPath } from "../../domain/topics";

const route = routeByPath("/topics");
const metadata = metadataForRoute(route);
const topics = publicTopics();
const topicItemListJsonLdValue = topicItemListJsonLd(topics);
const personJsonLdValue = personJsonLd();

export default function Topics() {
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
      <script type="application/ld+json">{jsonLdScriptContent(topicItemListJsonLdValue)}</script>
      <script type="application/ld+json">{jsonLdScriptContent(personJsonLdValue)}</script>

      <section class="page-intro">
        <p class="eyebrow">Topic discovery</p>
        <h1 class="page-title">Topics</h1>
        <p class="lead">
          Browse the public labels that connect Peter's projects, writing, and theme paths.
        </p>
      </section>

      <Show
        when={topics.length > 0}
        fallback={
          <div class="empty-state visual-surface">
            <h2 class="card-title">No public topics yet</h2>
            <p class="body-copy">
              Public topics will appear here after reviewed project, writing, or theme labels map to
              canonical topics.
            </p>
          </div>
        }
      >
        <ReactiveSurface class="theme-grid">
          <For each={topics}>{(topic) => <TopicCard topic={topic} />}</For>
        </ReactiveSurface>
      </Show>
    </>
  );
}

function TopicCard(props: { topic: PublicTopic }) {
  return (
    <article class="theme-card interactive-surface reactive-card">
      <h2 class="theme-title">
        <a class="project-anchor-link" href={topicDetailPath(props.topic)}>
          {props.topic.label}
        </a>
      </h2>
      <p class="card-copy">{topicSummary(props.topic)}</p>
      <ul class="label-row" aria-label={`${props.topic.label} public reference counts`}>
        <li class="tier-pill">{referenceCountLabel(props.topic.references.length, "reference")}</li>
        <For each={topicKindCountLabels(props.topic)}>
          {(label) => <li class="chip">{label}</li>}
        </For>
      </ul>
      <div class="link-list">
        <a class="text-link surface-link" href={topicDetailPath(props.topic)}>
          Explore topic
        </a>
      </div>
    </article>
  );
}

function topicSummary(topic: PublicTopic): string {
  return `${topic.label} connects ${referenceCountLabel(
    topic.references.length,
    "public reference",
  )} across Peter's projects, writing, and theme paths.`;
}

function topicKindCountLabels(topic: PublicTopic): readonly string[] {
  const projectCount = topic.references.filter((reference) => reference.kind === "project").length;
  const writingCount = topic.references.filter((reference) => reference.kind === "writing").length;
  const themeCount = topic.references.filter((reference) => reference.kind === "theme").length;

  return [
    ...(projectCount > 0 ? [referenceCountLabel(projectCount, "project")] : []),
    ...(writingCount > 0 ? [referenceCountLabel(writingCount, "writing item")] : []),
    ...(themeCount > 0 ? [referenceCountLabel(themeCount, "theme path")] : []),
  ];
}

function referenceCountLabel(count: number, singular: string): string {
  return `${count} ${count === 1 ? singular : `${singular}s`}`;
}
