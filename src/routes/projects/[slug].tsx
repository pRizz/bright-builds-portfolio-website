import { Link as HeadLink, Meta, Title } from "@solidjs/meta";
import { useParams } from "@solidjs/router";
import { For, Show } from "solid-js";
import { TopicChipList } from "../../components/TopicChip";
import {
  gitHubMetadataFactsForProject,
  maybeGitHubHomepageLinkForProject,
  maybeGitHubMetadataForProject,
} from "../../domain/github-metadata";
import type { ProjectDetailPageProject, ProjectStory } from "../../domain/projects";
import {
  maybeProjectDetailPageProjectBySlug,
  projectLinkDisplayLabel,
} from "../../domain/projects";
import {
  jsonLdScriptContent,
  metadataForFallbackPage,
  metadataForProject,
  type PageMetadata,
  projectJsonLd,
  siteAssetLinks,
} from "../../domain/seo";
import {
  type PublicThemeEntry,
  publicThemeEntriesForProject,
  themeDetailPath,
} from "../../domain/themes";
import {
  type PublicWritingEntry,
  publicWritingEntriesForProject,
  writingDetailPath,
} from "../../domain/writing";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "long",
  timeZone: "UTC",
  year: "numeric",
});
const projectFallbackMetadata = metadataForFallbackPage({
  title: "No reviewed project story here | Projects | Bright Builds",
  description: "Return to the curated project index to browse reviewed work.",
  canonicalPath: "/projects",
});

export default function ProjectDetail() {
  const params = useParams();
  const project = () => maybeProjectDetailPageProjectBySlug(params.slug ?? "");
  const metadata = () => {
    const maybeProject = project();
    return maybeProject ? metadataForProject(maybeProject) : projectFallbackMetadata;
  };

  return (
    <>
      <ProjectHead metadata={metadata()} />
      <Show when={project()} fallback={<ProjectFallback />}>
        {(selectedProject) => (
          <>
            <script type="application/ld+json">
              {jsonLdScriptContent(projectJsonLd(selectedProject()))}
            </script>

            <article class="content-section">
              <div class="page-intro project-detail-hero">
                <a class="text-link detail-back-link" href="/projects">
                  Project index
                </a>
                <p class="eyebrow">Project story</p>
                <h1 class="page-title">{selectedProject().name}</h1>
                <p class="lead">{selectedProject().detail.intro}</p>
                <ul class="detail-status-row" aria-label={`${selectedProject().name} status`}>
                  <li class="tier-pill">{selectedProject().role}</li>
                  <li class="tier-pill">{selectedProject().tier}</li>
                  <li class="tier-pill">
                    {selectedProject().status} / {selectedProject().maturity}
                  </li>
                </ul>
              </div>

              <div class="project-detail-layout">
                <section class="project-detail-story visual-surface" aria-labelledby="storyline">
                  <h2 id="storyline" class="card-title">
                    Storyline
                  </h2>
                  <div class="story-stack project-detail-stack">
                    <p>
                      <span class="story-label">Problem</span>
                      {selectedProject().story.problem}
                    </p>
                    <p>
                      <span class="story-label">Approach</span>
                      {selectedProject().story.approach}
                    </p>
                    <p>
                      <span class="story-label">Why it matters</span>
                      {selectedProject().story.whyItMatters}
                    </p>
                    <p>
                      <span class="story-label">Technical shape</span>
                      {selectedProject().detail.technicalShape}
                    </p>
                    <p>
                      <span class="story-label">Current status</span>
                      {selectedProject().detail.currentStatus}
                    </p>
                    <p>
                      <span class="story-label">Collaboration angle</span>
                      {selectedProject().detail.collaborationAngle}
                    </p>
                  </div>
                </section>

                <aside
                  class="project-detail-aside"
                  aria-label={`${selectedProject().name} facts and actions`}
                >
                  <section
                    class="project-detail-panel visual-surface"
                    aria-labelledby="proof-points"
                  >
                    <h2 id="proof-points" class="card-title">
                      Proof points
                    </h2>
                    <ul class="label-row" aria-label={`${selectedProject().name} proof points`}>
                      <For each={selectedProject().detail.proofPoints}>
                        {(point) => <li class="chip">{point}</li>}
                      </For>
                    </ul>
                  </section>

                  <section
                    class="project-detail-panel visual-surface"
                    aria-labelledby="project-facts"
                  >
                    <h2 id="project-facts" class="card-title">
                      Project facts
                    </h2>
                    <GitHubMetadataRow project={selectedProject()} />
                    <ul class="label-row" aria-label={`${selectedProject().name} source type`}>
                      <li class="chip">{selectedProject().sourceType}</li>
                    </ul>
                    <TopicChipList
                      labels={[...selectedProject().themes, ...selectedProject().tags]}
                      ariaLabel={`${selectedProject().name} topics and tags`}
                    />
                  </section>

                  <section
                    class="project-detail-panel visual-surface"
                    aria-labelledby="project-actions"
                  >
                    <h2 id="project-actions" class="card-title">
                      Project actions
                    </h2>
                    <p class="card-copy">
                      Use these links to inspect the source, try the live surface when one exists,
                      or return to the full project index.
                    </p>
                    <nav class="link-list" aria-label={`${selectedProject().name} project actions`}>
                      <a class="text-link surface-link" href="/projects">
                        Project index
                      </a>
                      <For each={selectedProject().links}>
                        {(link) => (
                          <a
                            class="text-link surface-link"
                            href={link.href}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            {projectLinkDisplayLabel(link)}
                          </a>
                        )}
                      </For>
                      <Show when={maybeGitHubHomepageLinkForProject(selectedProject())}>
                        {(link) => (
                          <a
                            class="text-link surface-link"
                            href={link().href}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            {projectLinkDisplayLabel(link())}
                          </a>
                        )}
                      </Show>
                    </nav>
                  </section>

                  <RelatedWritingPanel project={selectedProject()} />
                  <RelatedThemesPanel project={selectedProject()} />
                </aside>
              </div>
            </article>
          </>
        )}
      </Show>
    </>
  );
}

function ProjectHead(props: { metadata: PageMetadata }) {
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
    </>
  );
}

function ProjectFallback() {
  return (
    <section class="page-intro">
      <p class="eyebrow">Project not found</p>
      <h1 class="page-title">No reviewed project story here</h1>
      <p class="lead">Return to the curated project index to browse reviewed work.</p>
      <a class="primary-action interactive-surface" href="/projects">
        Browse projects
      </a>
    </section>
  );
}

function GitHubMetadataRow(props: { project: ProjectStory }) {
  return (
    <Show when={maybeGitHubMetadataForProject(props.project)}>
      <dl class="github-meta-row" aria-label="GitHub repository metadata">
        <For each={gitHubMetadataFactsForProject(props.project)}>
          {(fact) => (
            <div class="github-meta-chip">
              <dt class="github-meta-label">{fact.label}</dt>
              <dd class="github-meta-value">{fact.value}</dd>
            </div>
          )}
        </For>
      </dl>
    </Show>
  );
}

function RelatedWritingPanel(props: { project: ProjectDetailPageProject }) {
  const relatedWriting = () => publicWritingEntriesForProject(props.project);

  return (
    <Show when={relatedWriting().length > 0}>
      <section class="project-detail-panel visual-surface" aria-labelledby="related-writing">
        <h2 id="related-writing" class="card-title">
          Related writing
        </h2>
        <div class="writing-related-grid">
          <For each={relatedWriting()}>
            {(entry) => {
              const maybeDateLabel = writingDateLabel(entry);

              return (
                <article class="surface-card">
                  <h3 class="card-title">{entry.title}</h3>
                  <ul class="label-row" aria-label={`${entry.title} metadata`}>
                    <li class="chip">{writingKindLabel(entry)}</li>
                    <Show when={maybeDateLabel}>
                      {(dateLabel) => <li class="chip">{dateLabel()}</li>}
                    </Show>
                  </ul>
                  <p class="card-copy">{entry.summary}</p>
                  <div class="link-list">
                    <a class="text-link surface-link" href={writingDetailPath(entry)}>
                      {writingActionLabel(entry)}
                    </a>
                  </div>
                </article>
              );
            }}
          </For>
        </div>
      </section>
    </Show>
  );
}

function RelatedThemesPanel(props: { project: ProjectDetailPageProject }) {
  const relatedThemes = () => publicThemeEntriesForProject(props.project);

  return (
    <Show when={relatedThemes().length > 0}>
      <section
        class="project-detail-panel visual-surface"
        aria-labelledby="project-related-theme-paths"
      >
        <h2 id="project-related-theme-paths" class="card-title">
          Related theme paths
        </h2>
        <div class="writing-related-grid">
          <For each={relatedThemes()}>
            {(theme: PublicThemeEntry) => (
              <article class="surface-card">
                <h3 class="card-title">{theme.title}</h3>
                <p class="card-copy">{theme.summary}</p>
                <div class="link-list">
                  <a class="text-link surface-link" href={themeDetailPath(theme)}>
                    Explore theme
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

function writingDateLabel(entry: PublicWritingEntry): string | null {
  if (entry.maybePublishedOn) {
    return `Published ${dateFormatter.format(new Date(`${entry.maybePublishedOn}T00:00:00Z`))}`;
  }

  if (entry.maybeUpdatedOn) {
    return `Updated ${dateFormatter.format(new Date(`${entry.maybeUpdatedOn}T00:00:00Z`))}`;
  }

  return null;
}
