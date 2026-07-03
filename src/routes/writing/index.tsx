import { Link as HeadLink, Meta, Title } from "@solidjs/meta";
import { createMemo, createSignal, For, Show } from "solid-js";
import { DiscoveryFilterControls } from "../../components/DiscoveryFilterControls";
import { ReactiveSurface } from "../../components/ReactiveSurface";
import { TopicChipList } from "../../components/TopicChip";
import {
  type ContentFacetGroup,
  contentFacetGroupsForKind,
  searchContentReferences,
} from "../../domain/content-search";
import { routeByPath } from "../../domain/routes";
import {
  jsonLdScriptContent,
  metadataForRoute,
  personJsonLd,
  siteAssetLinks,
  writingItemListJsonLd,
} from "../../domain/seo";
import { publicContentReferences } from "../../domain/topics";
import {
  type PublicWritingEntry,
  publicWritingEntries,
  relatedProjectDetailPageProjects,
  writingDetailPath,
} from "../../domain/writing";

const route = routeByPath("/writing");
const metadata = metadataForRoute(route);
const writingEntries = publicWritingEntries();
const publicReferences = publicContentReferences();
const writingFacetGroups: readonly ContentFacetGroup[] = contentFacetGroupsForKind(
  "writing",
  publicReferences,
);
const writingBySlug = new Map(writingEntries.map((entry) => [entry.slug, entry]));
const personJsonLdValue = personJsonLd();
const writingItemListJsonLdValue = writingItemListJsonLd(writingEntries);
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "long",
  timeZone: "UTC",
  year: "numeric",
});

export default function Writing() {
  const [query, setQuery] = createSignal("");
  const [selectedFacetIds, setSelectedFacetIds] = createSignal<readonly string[]>([]);
  const writingSearch = createMemo(() =>
    searchContentReferences({
      references: publicReferences,
      kind: "writing",
      query: query(),
      selectedFacetIds: selectedFacetIds(),
    }),
  );
  const filteredWritingEntries = createMemo(() =>
    writingSearch().results.flatMap((result) => {
      const maybeEntry = writingBySlug.get(result.reference.slug);
      return maybeEntry ? [maybeEntry] : [];
    }),
  );
  const visibleWritingEntries = createMemo(() =>
    writingSearch().active ? filteredWritingEntries() : writingEntries,
  );

  function toggleFacet(facetId: string) {
    setSelectedFacetIds((currentFacetIds) => {
      if (currentFacetIds.includes(facetId)) {
        return currentFacetIds.filter((selectedFacetId) => selectedFacetId !== facetId);
      }

      return [...currentFacetIds, facetId];
    });
  }

  function resetFilters() {
    setQuery("");
    setSelectedFacetIds([]);
  }

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
      <script type="application/ld+json">{jsonLdScriptContent(personJsonLdValue)}</script>
      <script type="application/ld+json">{jsonLdScriptContent(writingItemListJsonLdValue)}</script>

      <section class="page-intro">
        <p class="eyebrow">Notes and essays</p>
        <h1 class="page-title">Writing</h1>
        <p class="lead">
          Curated notes on agentic engineering, open systems, identity, and practical web software.
        </p>
      </section>

      <DiscoveryFilterControls
        surfaceId="writing-filters"
        heading="Narrow writing"
        searchLabel="Search public writing"
        searchValue={query()}
        facetGroups={writingFacetGroups}
        selectedFacetIds={selectedFacetIds()}
        countStatus={`${writingSearch().visibleCount} of ${writingSearch().totalCount} public writing entries shown`}
        resetDisabled={!writingSearch().active}
        onSearchInput={setQuery}
        onFacetToggle={toggleFacet}
        onReset={resetFilters}
      />

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
        <Show
          when={writingSearch().active && visibleWritingEntries().length === 0}
          fallback={
            <ReactiveSurface class="writing-list">
              <For each={visibleWritingEntries()}>{(entry) => <WritingCard entry={entry} />}</For>
            </ReactiveSurface>
          }
        >
          <WritingEmptyState onReset={resetFilters} />
        </Show>
      </Show>
    </>
  );
}

function WritingCard(props: { entry: PublicWritingEntry }) {
  const maybeDateLabel = writingDateLabel(props.entry);
  const relatedProjects = relatedProjectDetailPageProjects(props.entry);

  return (
    <article class="writing-card project-anchor-card interactive-surface reactive-card">
      <div class="card-header">
        <div>
          <h2 class="card-title">
            <a class="project-anchor-link" href={writingDetailPath(props.entry)}>
              {props.entry.title}
            </a>
          </h2>
          <p class="card-meta">{writingKindLabel(props.entry)}</p>
        </div>
        <span class="tier-pill">{writingKindLabel(props.entry)}</span>
      </div>

      <p class="card-copy">{props.entry.summary}</p>

      <ul class="label-row" aria-label={`${props.entry.title} metadata`}>
        <li class="chip">{writingKindLabel(props.entry)}</li>
        <Show when={maybeDateLabel}>{(dateLabel) => <li class="chip">{dateLabel()}</li>}</Show>
      </ul>

      <TopicChipList
        labels={[...props.entry.topics, ...props.entry.tags]}
        ariaLabel={`${props.entry.title} topics and tags`}
      />

      <Show when={relatedProjects.length > 0}>
        <p class="card-meta">
          {relatedProjects.length === 1
            ? "1 related project"
            : `${relatedProjects.length} related projects`}
        </p>
      </Show>

      <div class="link-list">
        <a class="text-link surface-link" href={writingDetailPath(props.entry)}>
          {writingActionLabel(props.entry)}
        </a>
      </div>
    </article>
  );
}

function WritingEmptyState(props: { onReset: () => void }) {
  return (
    <div class="empty-state visual-surface">
      <h2 class="card-title">No public writing matches these filters</h2>
      <p class="body-copy">Clear filters to return to all public notes and essays.</p>
      <button type="button" class="filter-reset" onClick={props.onReset}>
        Reset filters
      </button>
    </div>
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
