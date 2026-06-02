import { Link as HeadLink, Meta, Title } from "@solidjs/meta";
import { For, Show } from "solid-js";
import { ReactiveSurface } from "../../components/ReactiveSurface";
import {
  gitHubMetadataFactsForProject,
  maybeGitHubHomepageLinkForProject,
  maybeGitHubMetadataForProject,
} from "../../domain/github-metadata";
import type { ProjectStory } from "../../domain/projects";
import {
  curatedProjects,
  hiddenExcludedProjects,
  projectLinkDisplayLabel,
  projectsByPlacement,
  publicProjectIndexProjects,
  writingProjects,
} from "../../domain/projects";
import { routeByPath } from "../../domain/routes";
import {
  jsonLdScriptContent,
  metadataForRoute,
  personJsonLd,
  projectItemListJsonLd,
  siteAssetLinks,
} from "../../domain/seo";

const route = routeByPath("/projects");
const metadata = metadataForRoute(route);
const publicProjectList = publicProjectIndexProjects();
const flagshipProjects = projectsByPlacement("home", publicProjectList);
const supportingProjects = projectsByPlacement("supporting", publicProjectList);
const labProjects = projectsByPlacement("lab", publicProjectList);
const writingProjectList = writingProjects(publicProjectList);
const archiveProjects = projectsByPlacement("archive", publicProjectList);
const allCuratedProjects: readonly ProjectStory[] = curatedProjects;
const hiddenExcludedProjectList = hiddenExcludedProjects(allCuratedProjects);
const projectGroups = [
  { label: "Flagship", projects: flagshipProjects, variant: "flagship" },
  { label: "Supporting", projects: supportingProjects, variant: "compact" },
  { label: "Lab / Prototype", projects: labProjects, variant: "compact" },
  { label: "Writing", projects: writingProjectList, variant: "compact" },
  { label: "Archive", projects: archiveProjects, variant: "compact" },
] as const;
const personJsonLdValue = personJsonLd();
const itemListJsonLdValue = projectItemListJsonLd(publicProjectList);

export default function Projects() {
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
      <script type="application/ld+json">{jsonLdScriptContent(personJsonLdValue)}</script>
      <script type="application/ld+json">{jsonLdScriptContent(itemListJsonLdValue)}</script>

      <section class="page-intro">
        <p class="eyebrow">Curated, not mirrored</p>
        <h1 class="page-title">{route.heading}</h1>
        <p class="lead">{route.staticCheckText}</p>
        <div class="notice-panel visual-surface">
          <p class="body-copy">
            Some reviewed repositories stay hidden or excluded from the public portfolio until they
            have enough authored context.
          </p>
          <p class="story-label">
            Hidden or excluded reviewed records: {hiddenExcludedProjectList.length}
          </p>
        </div>
      </section>

      <div class="project-list">
        <For each={projectGroups}>
          {(group) => (
            <ProjectSection label={group.label} projects={group.projects} variant={group.variant} />
          )}
        </For>
      </div>
    </>
  );
}

type ProjectSectionProps = {
  label: string;
  projects: readonly ProjectStory[];
  variant: "flagship" | "compact";
};

function ProjectSection(props: ProjectSectionProps) {
  const sectionId = `${props.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-projects`;

  return (
    <section class="project-section" aria-labelledby={sectionId}>
      <div class="project-section-header">
        <h2 id={sectionId} class="section-title">
          {props.label}
        </h2>
        <span class="story-label">{props.projects.length} reviewed</span>
      </div>

      {props.projects.length > 0 ? (
        <ReactiveSurface class="project-section-grid">
          <For each={props.projects}>
            {(project) => <ProjectCard project={project} variant={props.variant} />}
          </For>
        </ReactiveSurface>
      ) : (
        <div class="empty-state visual-surface">
          <h3 class="card-title">No reviewed projects in this group yet</h3>
          <p class="body-copy">
            This section only shows entries from the curated registry after they have enough
            authored context.
          </p>
        </div>
      )}
    </section>
  );
}

type ProjectCardProps = {
  project: ProjectStory;
  variant: "flagship" | "compact";
};

function ProjectCard(props: ProjectCardProps) {
  return (
    <article id={props.project.slug} class="project-anchor-card interactive-surface reactive-card">
      <div class="card-header">
        <div>
          <h3 class="card-title">
            <a class="project-anchor-link" href={`/projects#${props.project.slug}`}>
              {props.project.name}
            </a>
          </h3>
          <p class="card-meta">{props.project.role}</p>
        </div>
        <span class="tier-pill">
          {props.project.status} / {props.project.maturity}
        </span>
      </div>

      <p class="card-copy">{props.project.oneLine}</p>

      {props.variant === "flagship" ? (
        <div class="story-stack">
          <p>
            <span class="story-label">Problem</span>
            {props.project.story.problem}
          </p>
          <p>
            <span class="story-label">Approach</span>
            {props.project.story.approach}
          </p>
          <p>
            <span class="story-label">Why it matters</span>
            {props.project.story.whyItMatters}
          </p>
        </div>
      ) : null}

      <GitHubMetadataRow project={props.project} />

      <ul class="label-row" aria-label={`${props.project.name} labels`}>
        <li class="chip">{props.project.tier}</li>
        <li class="chip">{props.project.placement}</li>
        <For each={[...props.project.themes, ...props.project.tags]}>
          {(label) => <li class="chip">{label}</li>}
        </For>
      </ul>

      <div class="link-list">
        <For each={props.project.links}>
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
        <Show when={maybeGitHubHomepageLinkForProject(props.project)}>
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
      </div>
    </article>
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
