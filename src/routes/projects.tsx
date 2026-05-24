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

      <section class="max-w-3xl">
        <p class="mb-4 font-medium text-emerald-800 text-sm uppercase tracking-[0.12em]">
          Curated, not mirrored
        </p>
        <h1 class="text-balance font-semibold text-4xl text-zinc-950 leading-tight">
          {route.heading}
        </h1>
        <p class="mt-6 text-lg text-zinc-700 leading-8">{route.staticCheckText}</p>
      </section>

      <section class="mt-10 grid gap-4">
        <For each={featured}>
          {(project) => (
            <article class="rounded-lg border border-zinc-950/10 bg-white p-5 shadow-sm">
              <div class="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 class="font-semibold text-xl text-zinc-950">{project.name}</h2>
                  <p class="mt-1 text-sm text-zinc-500">{project.repo}</p>
                </div>
                <span class="rounded-full bg-emerald-100 px-3 py-1 font-medium text-emerald-900 text-xs">
                  {project.tier}
                </span>
              </div>
              <p class="mt-4 max-w-3xl text-zinc-700 leading-7">{project.summary}</p>
              <ul class="mt-4 flex flex-wrap gap-2">
                <For each={project.themes}>
                  {(theme) => (
                    <li class="rounded-full bg-stone-100 px-3 py-1 text-sm text-zinc-700">
                      {theme}
                    </li>
                  )}
                </For>
              </ul>
              <a
                class="mt-5 inline-flex font-medium text-emerald-800 text-sm hover:text-zinc-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
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

      <section class="mt-10 border-amber-700 border-l-4 bg-white p-5 shadow-sm">
        <h2 class="font-semibold text-lg text-zinc-950">Reviewed seed count</h2>
        <p class="mt-2 text-zinc-700">
          {projectSeeds.length} seed records exist in the Phase 1 registry. Full inclusion,
          exclusion, and flagship curation rules land in Phase 2.
        </p>
      </section>
    </>
  );
}
