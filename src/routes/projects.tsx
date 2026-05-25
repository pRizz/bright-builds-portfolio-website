import { Link as HeadLink, Meta, Title } from "@solidjs/meta";
import { For } from "solid-js";
import { featuredProjects, projectSeeds } from "../domain/projects";
import { routeByPath } from "../domain/routes";
import { metadataForRoute } from "../domain/seo";

const route = routeByPath("/projects");
const metadata = metadataForRoute(route);

export default function Projects() {
  const featured = featuredProjects();

  return (
    <>
      <Title>{metadata.title}</Title>
      <Meta name="description" content={metadata.description} />
      <HeadLink rel="canonical" href={metadata.canonical} />

      <section class="page-intro">
        <p class="eyebrow">Curated, not mirrored</p>
        <h1 class="page-title">{route.heading}</h1>
        <p class="lead">{route.staticCheckText}</p>
      </section>

      <section class="project-list">
        <For each={featured}>
          {(project) => (
            <article class="project-card">
              <div class="card-header">
                <div>
                  <h2 class="card-title">{project.name}</h2>
                  <p class="card-meta">{project.repo}</p>
                </div>
                <span class="tier-pill">{project.tier}</span>
              </div>
              <p class="card-copy">{project.summary}</p>
              <ul class="tag-list">
                <For each={project.themes}>{(theme) => <li class="chip">{theme}</li>}</For>
              </ul>
              <a
                class="text-link mt-5 inline-flex text-sm"
                href={project.href}
                rel="noopener noreferrer"
                target="_blank"
              >
                Open repository
              </a>
            </article>
          )}
        </For>
      </section>

      <section class="notice-panel">
        <h2 class="panel-title">Reviewed seed count</h2>
        <p class="body-copy">
          {projectSeeds.length} seed records exist in the Phase 1 registry. Full inclusion,
          exclusion, and flagship curation rules land in Phase 2.
        </p>
      </section>
    </>
  );
}
