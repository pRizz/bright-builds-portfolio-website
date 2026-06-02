import { Link as HeadLink, Meta, Title } from "@solidjs/meta";
import { useParams } from "@solidjs/router";
import { For, Show } from "solid-js";
import {
  gitHubMetadataFactsForProject,
  maybeGitHubHomepageLinkForProject,
  maybeGitHubMetadataForProject,
} from "../../domain/github-metadata";
import type { ProjectStory } from "../../domain/projects";
import {
  maybeProjectDetailPageProjectBySlug,
  projectLinkDisplayLabel,
} from "../../domain/projects";
import { metadataForProject, siteAssetLinks } from "../../domain/seo";

export default function ProjectDetail() {
  const params = useParams();
  const project = () => maybeProjectDetailPageProjectBySlug(params.slug ?? "");
  const metadata = () => {
    const maybeProject = project();
    return maybeProject ? metadataForProject(maybeProject) : null;
  };

  return (
    <Show
      when={project()}
      fallback={
        <section class="page-intro">
          <p class="eyebrow">Project not found</p>
          <h1 class="page-title">No reviewed project story here</h1>
          <p class="lead">Return to the curated project index to browse reviewed work.</p>
          <a class="primary-action interactive-surface" href="/projects">
            Browse projects
          </a>
        </section>
      }
    >
      {(selectedProject) => (
        <>
          <Show when={metadata()}>
            {(pageMetadata) => (
              <>
                <Title>{pageMetadata().title}</Title>
                <Meta name="description" content={pageMetadata().description} />
                <HeadLink rel="canonical" href={pageMetadata().canonical} />
                <For each={siteAssetLinks}>
                  {(asset) => {
                    if (asset.rel === "apple-touch-icon") {
                      return <HeadLink rel={asset.rel} href={asset.href} sizes={asset.sizes} />;
                    }

                    if ("sizes" in asset) {
                      return (
                        <HeadLink
                          rel={asset.rel}
                          href={asset.href}
                          type={asset.type}
                          sizes={asset.sizes}
                        />
                      );
                    }

                    return <HeadLink rel={asset.rel} href={asset.href} type={asset.type} />;
                  }}
                </For>
                <Meta property="og:title" content={pageMetadata().openGraph.title} />
                <Meta property="og:description" content={pageMetadata().openGraph.description} />
                <Meta property="og:url" content={pageMetadata().openGraph.url} />
                <Meta property="og:type" content={pageMetadata().openGraph.type} />
                <Meta property="og:image" content={pageMetadata().openGraph.image.url} />
                <Meta
                  property="og:image:width"
                  content={pageMetadata().openGraph.image.width.toString()}
                />
                <Meta
                  property="og:image:height"
                  content={pageMetadata().openGraph.image.height.toString()}
                />
                <Meta property="og:image:alt" content={pageMetadata().openGraph.image.alt} />
                <Meta name="twitter:card" content={pageMetadata().twitter.card} />
                <Meta name="twitter:title" content={pageMetadata().twitter.title} />
                <Meta name="twitter:description" content={pageMetadata().twitter.description} />
                <Meta name="twitter:image" content={pageMetadata().twitter.image.url} />
                <Meta name="twitter:image:alt" content={pageMetadata().twitter.image.alt} />
              </>
            )}
          </Show>

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
                <section class="project-detail-panel visual-surface" aria-labelledby="proof-points">
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
                  <ul class="label-row" aria-label={`${selectedProject().name} labels`}>
                    <For
                      each={[
                        ...selectedProject().themes,
                        ...selectedProject().tags,
                        selectedProject().sourceType,
                      ]}
                    >
                      {(label) => <li class="chip">{label}</li>}
                    </For>
                  </ul>
                </section>

                <section
                  class="project-detail-panel visual-surface"
                  aria-labelledby="project-actions"
                >
                  <h2 id="project-actions" class="card-title">
                    Project actions
                  </h2>
                  <p class="card-copy">
                    Use these links to inspect the source, try the live surface when one exists, or
                    return to the full project index.
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
              </aside>
            </div>
          </article>
        </>
      )}
    </Show>
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
