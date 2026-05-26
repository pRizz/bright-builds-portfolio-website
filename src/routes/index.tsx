import { Link as HeadLink, Meta, Title } from "@solidjs/meta";
import { For } from "solid-js";
import { peterProfile } from "../domain/profile";
import { homeProjects, primaryProjectLink } from "../domain/projects";
import { routeByPath } from "../domain/routes";
import { metadataForRoute, personJsonLd } from "../domain/seo";

const route = routeByPath("/");
const metadata = metadataForRoute(route);
const jsonLd = personJsonLd();

export default function Home() {
  const projects = homeProjects();

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

      <section class="hero-grid">
        <div class="page-intro">
          <p class="eyebrow">
            {peterProfile.handle} / {peterProfile.company}
          </p>
          <h1 class="page-title">{route.heading}</h1>
          <p class="lead">{route.staticCheckText}</p>
        </div>

        <aside class="focus-panel">
          <h2 class="panel-title">Current focus</h2>
          <ul class="focus-list">
            <For each={peterProfile.focusAreas}>{(area) => <li>{area}</li>}</For>
          </ul>
        </aside>
      </section>

      <section class="content-section">
        <div class="section-heading-row">
          <div>
            <h2 class="section-title">Featured project stories</h2>
            <p class="section-copy">
              A curated home set with authored copy, curation reasons, maturity, status, and useful
              links for each flagship placement.
            </p>
          </div>
          <a class="primary-action" href="/projects">
            View projects
          </a>
        </div>

        <div class="card-grid">
          <For each={projects}>
            {(project) => {
              const primaryLink = primaryProjectLink(project);

              return (
                <article class="project-card">
                  <h3 class="card-title">{project.name}</h3>
                  <p class="card-meta">{project.role}</p>
                  <p class="card-copy">{project.oneLine}</p>
                  <a
                    class="text-link mt-4 inline-flex text-sm"
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
        </div>
      </section>
    </>
  );
}
