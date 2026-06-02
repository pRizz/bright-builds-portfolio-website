import { Link as HeadLink, Meta, Title } from "@solidjs/meta";
import { useParams } from "@solidjs/router";
import { For, Show } from "solid-js";
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
            <div class="page-intro">
              <p class="eyebrow">Project story</p>
              <h1 class="page-title">{selectedProject().name}</h1>
              <p class="lead">{selectedProject().detail.intro}</p>
            </div>

            <div class="project-anchor-card visual-surface">
              <div class="card-header">
                <div>
                  <h2 class="card-title">Technical shape</h2>
                  <p class="card-meta">{selectedProject().role}</p>
                </div>
                <span class="tier-pill">
                  {selectedProject().status} / {selectedProject().maturity}
                </span>
              </div>

              <p class="card-copy">{selectedProject().detail.technicalShape}</p>

              <div class="story-stack">
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
                  <span class="story-label">Current status</span>
                  {selectedProject().detail.currentStatus}
                </p>
                <p>
                  <span class="story-label">Collaboration angle</span>
                  {selectedProject().detail.collaborationAngle}
                </p>
              </div>

              <ul class="label-row" aria-label={`${selectedProject().name} proof points`}>
                <For each={selectedProject().detail.proofPoints}>
                  {(point) => <li class="chip">{point}</li>}
                </For>
              </ul>

              <div class="link-list">
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
              </div>
            </div>
          </article>
        </>
      )}
    </Show>
  );
}
