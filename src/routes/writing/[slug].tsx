import { Link as HeadLink, Meta, Title } from "@solidjs/meta";
import { useParams } from "@solidjs/router";
import { For, Show } from "solid-js";
import { projectDetailPath } from "../../domain/projects";
import {
  jsonLdScriptContent,
  metadataForWritingEntry,
  siteAssetLinks,
  writingBlogPostingJsonLd,
} from "../../domain/seo";
import {
  maybePublicWritingEntryBySlug,
  type PublicWritingEntry,
  relatedProjectDetailPageProjects,
  type WritingBodyBlock,
} from "../../domain/writing";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "long",
  timeZone: "UTC",
  year: "numeric",
});

export default function WritingDetail() {
  const params = useParams();
  const entry = () => maybePublicWritingEntryBySlug(params.slug ?? "");

  return (
    <Show
      when={entry()}
      fallback={
        <>
          <Title>No public writing here | Writing | Bright Builds</Title>
          <Meta
            name="description"
            content="Return to the writing index to browse published notes."
          />
          <section class="page-intro">
            <p class="eyebrow">Writing</p>
            <h1 class="page-title">No public writing here</h1>
            <p class="lead">Return to the writing index to browse published notes.</p>
            <a class="primary-action interactive-surface" href="/writing">
              Browse writing
            </a>
          </section>
        </>
      }
    >
      {(selectedEntry) => <WritingArticle entry={selectedEntry()} />}
    </Show>
  );
}

function WritingArticle(props: { entry: PublicWritingEntry }) {
  const entry = props.entry;
  const metadata = metadataForWritingEntry(entry);
  const articleMetadata = metadata.article;
  const jsonLd = writingBlogPostingJsonLd(entry);
  const maybeDateLabel = writingDateLabel(entry);
  const relatedProjects = relatedProjectDetailPageProjects(entry);

  return (
    <article class="writing-article">
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
      <Meta property="og:image:width" content={metadata.openGraph.image.width.toString()} />
      <Meta property="og:image:height" content={metadata.openGraph.image.height.toString()} />
      <Meta property="og:image:alt" content={metadata.openGraph.image.alt} />
      <Meta name="twitter:card" content={metadata.twitter.card} />
      <Meta name="twitter:title" content={metadata.twitter.title} />
      <Meta name="twitter:description" content={metadata.twitter.description} />
      <Meta name="twitter:image" content={metadata.twitter.image.url} />
      <Meta name="twitter:image:alt" content={metadata.twitter.image.alt} />
      <Show when={articleMetadata?.maybePublishedTime}>
        {(publishedTime) => <Meta property="article:published_time" content={publishedTime()} />}
      </Show>
      <Show when={articleMetadata?.maybeModifiedTime}>
        {(modifiedTime) => <Meta property="article:modified_time" content={modifiedTime()} />}
      </Show>
      <For each={articleMetadata?.tags ?? []}>
        {(tag) => <Meta property="article:tag" content={tag} />}
      </For>
      <script type="application/ld+json">{jsonLdScriptContent(jsonLd)}</script>

      <div class="page-intro">
        <a class="text-link detail-back-link" href="/writing">
          Back to writing
        </a>
        <p class="eyebrow">{writingKindLabel(entry)}</p>
        <h1 class="page-title">{entry.title}</h1>
        <p class="lead">{entry.summary}</p>
        <ul class="detail-status-row" aria-label={`${entry.title} metadata`}>
          <li class="tier-pill">{writingKindLabel(entry)}</li>
          <Show when={maybeDateLabel}>{(dateLabel) => <li class="chip">{dateLabel()}</li>}</Show>
          <For each={[...entry.topics, ...entry.tags]}>
            {(label) => <li class="chip">{label}</li>}
          </For>
        </ul>
      </div>

      <div class="writing-body">
        <For each={entry.sections}>
          {(section) => (
            <section class="writing-section" aria-labelledby={writingSectionId(section.heading)}>
              <h2 id={writingSectionId(section.heading)} class="section-title">
                {section.heading}
              </h2>
              <For each={section.blocks}>{(block) => <WritingBlock block={block} />}</For>
            </section>
          )}
        </For>
      </div>

      <Show when={relatedProjects.length > 0}>
        <section class="content-section" aria-labelledby="related-projects">
          <h2 id="related-projects" class="section-title">
            Related projects
          </h2>
          <div class="writing-related-grid">
            <For each={relatedProjects}>
              {(project) => (
                <article class="project-anchor-card interactive-surface reactive-card">
                  <h3 class="card-title">{project.name}</h3>
                  <p class="card-copy">{project.oneLine}</p>
                  <div class="link-list">
                    <a class="text-link surface-link" href={projectDetailPath(project)}>
                      Project details
                    </a>
                  </div>
                </article>
              )}
            </For>
          </div>
        </section>
      </Show>
    </article>
  );
}

function WritingBlock(props: { block: WritingBodyBlock }) {
  if (props.block.kind === "paragraph") {
    return <p class="writing-body-copy">{props.block.text}</p>;
  }

  if (props.block.kind === "list") {
    return (
      <ul class="writing-body-list">
        <For each={props.block.items}>{(item) => <li>{item}</li>}</For>
      </ul>
    );
  }

  if (props.block.kind === "callout") {
    return <p class="writing-callout notice-panel visual-surface">{props.block.text}</p>;
  }

  const isExternalLink = props.block.href.startsWith("https://");

  return (
    <a
      class="text-link surface-link"
      href={props.block.href}
      rel={isExternalLink ? "noopener noreferrer" : undefined}
      target={isExternalLink ? "_blank" : undefined}
    >
      {props.block.label}
    </a>
  );
}

function writingKindLabel(entry: Pick<PublicWritingEntry, "kind">): "Note" | "Essay" {
  return entry.kind === "note" ? "Note" : "Essay";
}

function writingDateLabel(entry: PublicWritingEntry): string | null {
  if (entry.maybePublishedOn) {
    return `Published ${dateFormatter.format(new Date(`${entry.maybePublishedOn}T00:00:00Z`))}`;
  }

  if (entry.maybeUpdatedOn) {
    return `Updated ${dateFormatter.format(new Date(`${entry.maybeUpdatedOn}T00:00:00Z`))}`;
  }

  return null;
}

function writingSectionId(heading: string): string {
  return `writing-${heading.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}
