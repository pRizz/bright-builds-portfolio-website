import { Link as HeadLink, Meta, Title } from "@solidjs/meta";
import { For, Show } from "solid-js";
import { ReactiveSurface } from "../../components/ReactiveSurface";
import { routeByPath } from "../../domain/routes";
import {
  jsonLdScriptContent,
  metadataForRoute,
  personJsonLd,
  siteAssetLinks,
  writingItemListJsonLd,
} from "../../domain/seo";
import {
  type PublicWritingEntry,
  publicWritingEntries,
  relatedProjectDetailPageProjects,
  writingDetailPath,
} from "../../domain/writing";

const route = routeByPath("/writing");
const metadata = metadataForRoute(route);
const writingEntries = publicWritingEntries();
const personJsonLdValue = personJsonLd();
const writingItemListJsonLdValue = writingItemListJsonLd(writingEntries);
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "long",
  timeZone: "UTC",
  year: "numeric",
});

export default function Writing() {
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
      <Meta property="og:image:width" content={metadata.openGraph.image.width.toString()} />
      <Meta property="og:image:height" content={metadata.openGraph.image.height.toString()} />
      <Meta property="og:image:alt" content={metadata.openGraph.image.alt} />
      <Meta name="twitter:card" content={metadata.twitter.card} />
      <Meta name="twitter:title" content={metadata.twitter.title} />
      <Meta name="twitter:description" content={metadata.twitter.description} />
      <Meta name="twitter:image" content={metadata.twitter.image.url} />
      <Meta name="twitter:image:alt" content={metadata.twitter.image.alt} />
      <script type="application/ld+json">{jsonLdScriptContent(personJsonLdValue)}</script>
      <script type="application/ld+json">{jsonLdScriptContent(writingItemListJsonLdValue)}</script>

      <section class="page-intro">
        <p class="eyebrow">Notes and essays</p>
        <h1 class="page-title">Writing</h1>
        <p class="lead">
          Curated notes on agentic engineering, open systems, identity, and practical web software.
        </p>
      </section>

      <Show
        when={writingEntries.length > 0}
        fallback={
          <div class="empty-state visual-surface">
            <h2 class="card-title">No public writing yet</h2>
            <p class="body-copy">
              Published notes will appear here after they are added to the curated writing registry.
            </p>
          </div>
        }
      >
        <ReactiveSurface class="writing-list">
          <For each={writingEntries}>
            {(entry) => {
              const maybeDateLabel = writingDateLabel(entry);
              const relatedProjects = relatedProjectDetailPageProjects(entry);

              return (
                <article class="writing-card project-anchor-card interactive-surface reactive-card">
                  <div class="card-header">
                    <div>
                      <h2 class="card-title">
                        <a class="project-anchor-link" href={writingDetailPath(entry)}>
                          {entry.title}
                        </a>
                      </h2>
                      <p class="card-meta">{writingKindLabel(entry)}</p>
                    </div>
                    <span class="tier-pill">{writingKindLabel(entry)}</span>
                  </div>

                  <p class="card-copy">{entry.summary}</p>

                  <ul class="label-row" aria-label={`${entry.title} metadata`}>
                    <li class="chip">{writingKindLabel(entry)}</li>
                    <Show when={maybeDateLabel}>
                      {(dateLabel) => <li class="chip">{dateLabel()}</li>}
                    </Show>
                  </ul>

                  <ul class="label-row" aria-label={`${entry.title} topics and tags`}>
                    <For each={[...entry.topics, ...entry.tags]}>
                      {(label) => <li class="chip">{label}</li>}
                    </For>
                  </ul>

                  <Show when={relatedProjects.length > 0}>
                    <p class="card-meta">
                      {relatedProjects.length === 1
                        ? "1 related project"
                        : `${relatedProjects.length} related projects`}
                    </p>
                  </Show>

                  <div class="link-list">
                    <a class="text-link surface-link" href={writingDetailPath(entry)}>
                      {writingActionLabel(entry)}
                    </a>
                  </div>
                </article>
              );
            }}
          </For>
        </ReactiveSurface>
      </Show>
    </>
  );
}

function writingKindLabel(entry: Pick<PublicWritingEntry, "kind">): "Note" | "Essay" {
  return entry.kind === "note" ? "Note" : "Essay";
}

function writingActionLabel(entry: Pick<PublicWritingEntry, "kind">): "Read note" | "Read essay" {
  return entry.kind === "note" ? "Read note" : "Read essay";
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
