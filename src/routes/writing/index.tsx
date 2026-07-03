import { createMemo, createSignal, For, Show } from "solid-js";
import { DiscoveryFilterControls } from "../../components/DiscoveryFilterControls";
import { ReactiveSurface } from "../../components/ReactiveSurface";
import { RouteHead } from "../../components/RouteHead";
import { TopicChipList } from "../../components/TopicChip";
import {
  type ContentFacetGroup,
  contentFacetGroupsForKind,
  searchContentReferences,
} from "../../domain/content-search";
import { writingFeedMetadata } from "../../domain/feed";
import { routeByPath } from "../../domain/routes";
import {
  jsonLdScriptContent,
  metadataForRoute,
  personJsonLd,
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
const writingFeed = writingFeedMetadata();
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
      <RouteHead
        metadata={metadata}
        alternateLinks={[
          {
            rel: "alternate",
            type: "application/rss+xml",
            title: "Bright Builds writing feed",
            href: writingFeed.feedUrl,
          },
        ]}
      />
      <script type="application/ld+json">{jsonLdScriptContent(personJsonLdValue)}</script>
      <script type="application/ld+json">{jsonLdScriptContent(writingItemListJsonLdValue)}</script>

      <section class="page-intro">
        <p class="eyebrow">Notes and essays</p>
        <h1 class="page-title">Writing</h1>
        <p class="lead">
          Curated notes on agentic engineering, open systems, identity, and practical web software.
        </p>
        <nav class="link-list" aria-label="Writing subscription">
          {/* biome-ignore format: preserve plan-mandated RSS anchor text */}
          <a class="text-link surface-link" href="/feed.xml">RSS feed</a>
        </nav>
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
  const entry = props.entry;
  const actionLabel = entry.kind === "note" ? "Read note" : "Read essay";
  const detailPath = writingDetailPath(entry);
  const kindLabel = entry.kind === "note" ? "Note" : "Essay";
  const maybeDateLabel = writingDateLabel(entry);
  const relatedProjects = relatedProjectDetailPageProjects(entry);

  return (
    <article class="writing-card project-anchor-card interactive-surface reactive-card">
      <div class="card-header">
        <div>
          <h2 class="card-title">
            <a class="project-anchor-link" href={detailPath}>
              {entry.title}
            </a>
          </h2>
          <p class="card-meta">{kindLabel}</p>
        </div>
        <span class="tier-pill">{kindLabel}</span>
      </div>

      <p class="card-copy">{entry.summary}</p>

      <ul class="label-row" aria-label={`${entry.title} metadata`}>
        <li class="chip">{kindLabel}</li>
        <Show when={maybeDateLabel}>{(dateLabel) => <li class="chip">{dateLabel()}</li>}</Show>
      </ul>

      <TopicChipList
        labels={[...entry.topics, ...entry.tags]}
        ariaLabel={`${entry.title} topics and tags`}
      />

      <Show when={relatedProjects.length > 0}>
        <p class="card-meta">
          {relatedProjects.length === 1
            ? "1 related project"
            : `${relatedProjects.length} related projects`}
        </p>
      </Show>

      <div class="link-list">
        <a class="text-link surface-link" href={detailPath}>
          {actionLabel}
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

function writingDateLabel(entry: PublicWritingEntry): string | null {
  if (entry.maybePublishedOn) {
    return `Published ${dateFormatter.format(new Date(`${entry.maybePublishedOn}T00:00:00Z`))}`;
  }

  if (entry.maybeUpdatedOn) {
    return `Updated ${dateFormatter.format(new Date(`${entry.maybeUpdatedOn}T00:00:00Z`))}`;
  }

  return null;
}
