import { Link as HeadLink, Meta, Title } from "@solidjs/meta";
import { For } from "solid-js";
import { peterProfile } from "../domain/profile";
import {
  currentFocusProjects,
  homeProjects,
  projectAnchorHref,
  projectLinkDisplayLabel,
} from "../domain/projects";
import { routeByPath } from "../domain/routes";
import { jsonLdScriptContent, metadataForRoute, personJsonLd, siteAssetLinks } from "../domain/seo";

const route = routeByPath("/");
const metadata = metadataForRoute(route);
const jsonLd = personJsonLd();
const identityCopy =
  "Peter Ryszkiewicz / pRizz builds practical software through Bright Builds across AI, Bitcoin, open systems, developer tooling, and practical web experiments.";

export default function Home() {
  const projects = homeProjects();
  const focusProjects = currentFocusProjects();

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
      <script type="application/ld+json">{jsonLdScriptContent(jsonLd)}</script>

      <section class="visual-stage hero-grid">
        <div class="brand-material" aria-hidden="true" />
        <div class="page-intro visual-stage-content">
          <p class="eyebrow">
            {peterProfile.handle} / {peterProfile.company}
          </p>
          <h1 class="page-title">{peterProfile.name}</h1>
          <p class="lead">{identityCopy}</p>
          <a class="primary-action interactive-surface" href="/projects">
            Browse projects
          </a>
        </div>

        <aside class="focus-panel visual-surface visual-stage-content">
          <h2 class="panel-title">Now building</h2>
          <ul class="focus-list" aria-label="Current project focus">
            <For each={focusProjects}>
              {(project) => (
                <li>
                  <a class="focus-row interactive-surface" href={projectAnchorHref(project)}>
                    <span class="story-label">
                      {project.status} / {project.maturity}
                    </span>
                    <span class="focus-row-title">{project.name}</span>
                    <span class="focus-row-copy">{project.oneLine}</span>
                  </a>
                </li>
              )}
            </For>
          </ul>
        </aside>
      </section>

      <section class="content-section">
        <div class="section-heading-row">
          <div>
            <h2 class="section-title">Featured project stories</h2>
            <p class="section-copy">
              Flagship work selected from the curated registry, with authored context instead of a
              raw repository mirror.
            </p>
          </div>
        </div>

        <div class="story-grid">
          <For each={projects}>
            {(project) => {
              return (
                <article class="story-card interactive-surface">
                  <div class="card-header">
                    <div>
                      <h3 class="card-title">{project.name}</h3>
                      <p class="card-meta">{project.role}</p>
                    </div>
                    <span class="tier-pill">
                      {project.status} / {project.maturity}
                    </span>
                  </div>
                  <p class="card-copy">{project.oneLine}</p>

                  <div class="story-stack">
                    <p>
                      <span class="story-label">Problem</span>
                      {project.story.problem}
                    </p>
                    <p>
                      <span class="story-label">Approach</span>
                      {project.story.approach}
                    </p>
                    <p>
                      <span class="story-label">Why it matters</span>
                      {project.story.whyItMatters}
                    </p>
                  </div>

                  <ul class="tag-list" aria-label={`${project.name} themes and tags`}>
                    <For each={[...project.themes, ...project.tags]}>
                      {(label) => <li class="chip">{label}</li>}
                    </For>
                  </ul>

                  <div class="story-links">
                    <a class="text-link surface-link" href={projectAnchorHref(project)}>
                      Project details
                    </a>
                    <For each={project.links}>
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
                </article>
              );
            }}
          </For>
        </div>
      </section>
    </>
  );
}
