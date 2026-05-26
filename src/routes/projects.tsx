import { Link as HeadLink, Meta, Title } from "@solidjs/meta";
import { For } from "solid-js";
import { primaryProjectLink, visibleProjects } from "../domain/projects";
import { routeByPath } from "../domain/routes";
import { metadataForRoute } from "../domain/seo";

const route = routeByPath("/projects");
const metadata = metadataForRoute(route);

export default function Projects() {
  const projects = visibleProjects();

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
        <For each={projects}>
          {(project) => {
            const primaryLink = primaryProjectLink(project);

            return (
              <article class="project-card">
                <div class="card-header">
                  <div>
                    <h2 class="card-title">{project.name}</h2>
                    <p class="card-meta">
                      {project.role} / {project.status} / {project.maturity}
                    </p>
                  </div>
                  <span class="tier-pill">{project.tier}</span>
                </div>
                <p class="card-copy">{project.oneLine}</p>
                <ul class="tag-list">
                  <For each={project.themes}>{(theme) => <li class="chip">{theme}</li>}</For>
                  <For each={project.tags}>{(tag) => <li class="chip">{tag}</li>}</For>
                </ul>
                <a
                  class="text-link mt-5 inline-flex text-sm"
                  href={primaryLink.href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {primaryLink.label}
                </a>
              </article>
            );
          }}
        </For>
      </section>

      <section class="notice-panel">
        <h2 class="panel-title">Reviewed project count</h2>
        <p class="body-copy">
          {projects.length} curated project stories are visible in the current index, with
          supporting and lab work kept separate from home flagship placement.
        </p>
      </section>
    </>
  );
}
