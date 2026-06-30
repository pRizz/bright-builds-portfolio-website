import { Link as HeadLink, Meta, Title } from "@solidjs/meta";
import { useParams } from "@solidjs/router";
import { For, Show } from "solid-js";
import { TopicChip } from "../../components/TopicChip";
import { projectDetailPath } from "../../domain/projects";
import {
  jsonLdScriptContent,
  metadataForFallbackPage,
  metadataForTheme,
  type PageMetadata,
  siteAssetLinks,
  themeCollectionPageJsonLd,
} from "../../domain/seo";
import {
  collaborationActionsForTheme,
  maybePublicThemeEntryBySlug,
  type PublicThemeEntry,
  relatedProjectDetailPageProjectsForTheme,
  relatedWritingEntriesForTheme,
  type ThemeCollaborationAction,
} from "../../domain/themes";
import { type PublicWritingEntry, writingDetailPath } from "../../domain/writing";

type RelatedProjectEntry = ReturnType<typeof relatedProjectDetailPageProjectsForTheme>[number];
const fallbackMetadata = metadataForFallbackPage({
  title: "No public theme here | Themes | Bright Builds",
  description: "Browse public theme paths to find a route through Peter's work.",
  canonicalPath: "/themes",
});

export default function ThemeDetail() {
  const params = useParams();
  const theme = () => maybePublicThemeEntryBySlug(params.slug ?? "");

  return (
    <Show when={theme()} fallback={<ThemeFallback />}>
      {(selectedTheme) => <ThemeArticle theme={selectedTheme()} />}
    </Show>
  );
}

function ThemeFallback() {
  return (
    <>
      <ThemeHead metadata={fallbackMetadata} />
      <section class="page-intro">
        <p class="eyebrow">Theme path</p>
        <h1 class="page-title">No public theme here</h1>
        <p class="lead">
          No public theme here. Browse theme paths to find a public route through Peter&apos;s work.
        </p>
        <a class="primary-action interactive-surface" href="/themes">
          Browse theme paths
        </a>
      </section>
    </>
  );
}

function ThemeArticle(props: { theme: PublicThemeEntry }) {
  const theme = props.theme;
  const metadata = metadataForTheme(theme);
  const jsonLd = themeCollectionPageJsonLd(theme);
  const collaborationActions = collaborationActionsForTheme(theme);
  const relatedProjects = relatedProjectDetailPageProjectsForTheme(theme);
  const relatedWriting = relatedWritingEntriesForTheme(theme);

  return (
    <article class="content-section">
      <ThemeHead metadata={metadata} jsonLd={jsonLd} />
      <div class="page-intro">
        <a class="text-link detail-back-link" href="/themes">
          Back to themes
        </a>
        <p class="eyebrow">Theme path</p>
        <h1 class="page-title">{theme.title}</h1>
        <p class="lead">{theme.summary}</p>
        <ul class="detail-status-row" aria-label={`${theme.title} audience`}>
          <li>
            <TopicChip label={theme.title} />
          </li>
          <li class="tier-pill">{theme.audience}</li>
        </ul>
      </div>

      <div class="project-detail-layout">
        <section class="project-detail-story visual-surface" aria-labelledby="why-it-matters">
          <h2 id="why-it-matters" class="card-title">
            Why it matters
          </h2>
          <div class="story-stack project-detail-stack">
            <p>{theme.summary}</p>

            <section aria-labelledby="theme-audience">
              <h3 id="theme-audience" class="story-label">
                Audience
              </h3>
              <p>{theme.audience}</p>
            </section>

            <section aria-labelledby="theme-proof-points">
              <h3 id="theme-proof-points" class="story-label">
                Proof points
              </h3>
              <ul class="label-row" aria-label={`${theme.title} proof points`}>
                <For each={theme.proofPoints}>{(point) => <li class="chip">{point}</li>}</For>
              </ul>
            </section>
          </div>
        </section>

        <aside class="project-detail-aside" aria-label={`${theme.title} related work`}>
          <ThemeCollaborationPanel theme={theme} actions={collaborationActions} />
          <RelatedProjectsPanel projects={relatedProjects} />
          <RelatedWritingPanel entries={relatedWriting} />
        </aside>
      </div>
    </article>
  );
}

function ThemeHead(props: { metadata: PageMetadata; jsonLd?: unknown }) {
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

function ThemeCollaborationPanel(props: {
  theme: PublicThemeEntry;
  actions: readonly ThemeCollaborationAction[];
}) {
  return (
    <section
      class="project-detail-panel visual-surface"
      aria-labelledby="collaboration-starting-points"
    >
      <Show
        when={props.actions.length > 0}
        fallback={
          <>
            <h2 id="collaboration-starting-points" class="card-title">
              No collaboration paths yet
            </h2>
            <p class="card-copy">
              When reviewed project, source, live, or writing links are available for this theme,
              they will appear here.
            </p>
          </>
        }
      >
        <h2 id="collaboration-starting-points" class="card-title">
          Collaboration starting points
        </h2>
        <div class="story-stack project-detail-stack">
          <p>
            <span class="story-label">Where to start</span>
            {props.theme.collaborationAngle}
          </p>
        </div>
        <nav class="link-list" aria-label={`${props.theme.title} collaboration starting points`}>
          <For each={props.actions}>
            {(action) => (
              <a
                class="text-link surface-link"
                href={action.href}
                target={action.external ? "_blank" : undefined}
                rel={action.maybeRel ?? (action.external ? "noopener noreferrer" : undefined)}
              >
                {action.label}
              </a>
            )}
          </For>
        </nav>
      </Show>
    </section>
  );
}

function RelatedProjectsPanel(props: { projects: readonly RelatedProjectEntry[] }) {
  return (
    <Show when={props.projects.length > 0}>
      <section class="project-detail-panel visual-surface" aria-labelledby="related-projects">
        <h2 id="related-projects" class="card-title">
          Related projects
        </h2>
        <div class="writing-related-grid">
          <For each={props.projects}>
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
  );
}

function RelatedWritingPanel(props: { entries: readonly PublicWritingEntry[] }) {
  return (
    <Show when={props.entries.length > 0}>
      <section class="project-detail-panel visual-surface" aria-labelledby="related-writing">
        <h2 id="related-writing" class="card-title">
          Related writing
        </h2>
        <div class="writing-related-grid">
          <For each={props.entries}>
            {(entry) => (
              <article class="surface-card">
                <h3 class="card-title">{entry.title}</h3>
                <ul class="label-row" aria-label={`${entry.title} metadata`}>
                  <li class="chip">{writingKindLabel(entry)}</li>
                </ul>
                <p class="card-copy">{entry.summary}</p>
                <div class="link-list">
                  <a class="text-link surface-link" href={writingDetailPath(entry)}>
                    {writingActionLabel(entry)}
                  </a>
                </div>
              </article>
            )}
          </For>
        </div>
      </section>
    </Show>
  );
}

function writingKindLabel(entry: Pick<PublicWritingEntry, "kind">): "Note" | "Essay" {
  return entry.kind === "note" ? "Note" : "Essay";
}

function writingActionLabel(entry: Pick<PublicWritingEntry, "kind">): "Read note" | "Read essay" {
  return entry.kind === "note" ? "Read note" : "Read essay";
}
