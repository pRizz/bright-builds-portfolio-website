import { Link as HeadLink, Meta, Title } from "@solidjs/meta";
import { For } from "solid-js";
import { peterProfile } from "../domain/profile";
import { featuredProjects } from "../domain/projects";
import { routeByPath } from "../domain/routes";
import { metadataForRoute, personJsonLd } from "../domain/seo";

const route = routeByPath("/");
const metadata = metadataForRoute(route);
const jsonLd = personJsonLd();

export default function Home() {
  const projects = featuredProjects();

  return (
    <>
      <Title>{metadata.title}</Title>
      <Meta name="description" content={metadata.description} />
      <HeadLink rel="canonical" href={metadata.canonical} />
      <Meta property="og:title" content={metadata.openGraph.title} />
      <Meta property="og:description" content={metadata.openGraph.description} />
      <Meta property="og:url" content={metadata.openGraph.url} />
      <Meta property="og:type" content={metadata.openGraph.type} />
      <Meta name="twitter:card" content={metadata.twitter.card} />
      <Meta name="twitter:title" content={metadata.twitter.title} />
      <Meta name="twitter:description" content={metadata.twitter.description} />
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>

      <section class="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
        <div class="max-w-3xl">
          <p class="mb-4 font-medium text-emerald-800 text-sm uppercase tracking-[0.12em]">
            {peterProfile.handle} / {peterProfile.company}
          </p>
          <h1 class="text-balance font-semibold text-4xl text-zinc-950 leading-tight sm:text-6xl">
            {route.heading}
          </h1>
          <p class="mt-6 max-w-2xl text-lg text-zinc-700 leading-8">{route.staticCheckText}</p>
        </div>

        <aside class="border-zinc-950/10 border-l-4 border-l-amber-700 bg-white px-5 py-4 shadow-sm">
          <h2 class="font-semibold text-zinc-950">Current focus</h2>
          <ul class="mt-3 grid gap-2 text-sm text-zinc-700">
            <For each={peterProfile.focusAreas}>{(area) => <li>{area}</li>}</For>
          </ul>
        </aside>
      </section>

      <section class="mt-14">
        <div class="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 class="font-semibold text-2xl text-zinc-950">Featured seeds</h2>
            <p class="mt-2 max-w-2xl text-zinc-700">
              This shell starts with a small reviewed set. The next phase expands the registry and
              keeps prototypes out of flagship placement unless they are intentionally promoted.
            </p>
          </div>
          <a
            class="inline-flex rounded-md bg-zinc-950 px-4 py-2 font-medium text-sm text-white transition hover:bg-emerald-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
            href="/projects"
          >
            View projects
          </a>
        </div>

        <div class="mt-6 grid gap-4 sm:grid-cols-2">
          <For each={projects}>
            {(project) => (
              <article class="rounded-lg border border-zinc-950/10 bg-white p-5 shadow-sm">
                <h3 class="font-semibold text-lg text-zinc-950">{project.name}</h3>
                <p class="mt-3 text-sm text-zinc-700 leading-6">{project.summary}</p>
                <a
                  class="mt-4 inline-flex font-medium text-emerald-800 text-sm hover:text-zinc-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
                  href={project.href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {project.repo}
                </a>
              </article>
            )}
          </For>
        </div>
      </section>
    </>
  );
}
