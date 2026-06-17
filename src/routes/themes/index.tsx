import { Link as HeadLink, Meta, Title } from "@solidjs/meta";
import { For, Show } from "solid-js";
import { ReactiveSurface } from "../../components/ReactiveSurface";
import { routeByPath } from "../../domain/routes";
import {
  jsonLdScriptContent,
  metadataForRoute,
  personJsonLd,
  siteAssetLinks,
} from "../../domain/seo";
import {
  type PublicThemeEntry,
  publicThemeEntries,
  relatedProjectDetailPageProjectsForTheme,
  relatedWritingEntriesForTheme,
  themeDetailPath,
} from "../../domain/themes";

type WritingKindEntry = {
  kind: "note" | "essay";
};

const route = routeByPath("/themes");
const metadata = metadataForRoute(route);
const themes = publicThemeEntries();
const personJsonLdValue = personJsonLd();

export default function Themes() {
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

      <section class="page-intro">
        <p class="eyebrow">Theme paths</p>
        <h1 class="page-title">Themes</h1>
        <p class="lead">
          Curated routes through Peter's work, connecting durable ideas to selected projects, public
          writing, and proof points.
        </p>
      </section>

      <Show
        when={themes.length > 0}
        fallback={
          <div class="empty-state visual-surface">
            <h2 class="card-title">No public themes yet</h2>
            <p class="body-copy">
              Theme paths will appear here after public theme records are added to the curated theme
              registry.
            </p>
          </div>
        }
      >
        <ReactiveSurface class="theme-grid">
          <For each={themes}>
            {(theme) => (
              <article class="theme-card interactive-surface reactive-card">
                <h2 class="theme-title">
                  <a class="project-anchor-link" href={themeDetailPath(theme)}>
                    {theme.title}
                  </a>
                </h2>

                <p class="card-copy">{theme.summary}</p>

                <ul class="label-row" aria-label={`${theme.title} audience`}>
                  <li class="tier-pill">{theme.audience}</li>
                </ul>

                <ul class="label-row" aria-label={`${theme.title} related work`}>
                  <For each={themeRelationshipLabels(theme)}>
                    {(label) => <li class="chip">{label}</li>}
                  </For>
                </ul>

                <div class="link-list">
                  <a class="text-link surface-link" href={themeDetailPath(theme)}>
                    Explore theme
                  </a>
                </div>
              </article>
            )}
          </For>
        </ReactiveSurface>
      </Show>
    </>
  );
}

function relationshipCountLabel(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

function writingKindCountLabels(entries: readonly WritingKindEntry[]): readonly string[] {
  let noteCount = 0;
  let essayCount = 0;

  for (const entry of entries) {
    if (entry.kind === "note") {
      noteCount += 1;
      continue;
    }

    essayCount += 1;
  }

  return [
    ...(noteCount > 0 ? [relationshipCountLabel(noteCount, "related note", "related notes")] : []),
    ...(essayCount > 0
      ? [relationshipCountLabel(essayCount, "related essay", "related essays")]
      : []),
  ];
}

function themeRelationshipLabels(theme: PublicThemeEntry): readonly string[] {
  const relatedProjects = relatedProjectDetailPageProjectsForTheme(theme);
  const relatedWriting = relatedWritingEntriesForTheme(theme);

  return [
    relationshipCountLabel(relatedProjects.length, "related project", "related projects"),
    ...writingKindCountLabels(relatedWriting),
  ];
}
