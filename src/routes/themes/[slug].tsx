import { useParams } from "@solidjs/router";
import { For, Show } from "solid-js";
import { projectDetailPath } from "../../domain/projects";
import {
  maybePublicThemeEntryBySlug,
  type PublicThemeEntry,
  relatedProjectDetailPageProjectsForTheme,
  relatedWritingEntriesForTheme,
} from "../../domain/themes";
import { type PublicWritingEntry, writingDetailPath } from "../../domain/writing";

type RelatedProjectEntry = ReturnType<typeof relatedProjectDetailPageProjectsForTheme>[number];

export default function ThemeDetail() {
  const params = useParams();
  const theme = () => maybePublicThemeEntryBySlug(params.slug ?? "");

  return (
    <Show when={theme()} fallback={<ThemeFallback />}>
      {(selectedTheme) => <ThemeArticle theme={selectedTheme()} />}
    </Show>
  );
}

function ThemeFallback() {
  return (
    <section class="page-intro">
      <p class="eyebrow">Theme path</p>
      <h1 class="page-title">No public theme here</h1>
      <p class="lead">
        No public theme here. Browse theme paths to find a public route through Peter&apos;s work.
      </p>
      <a class="primary-action interactive-surface" href="/themes">
        Browse theme paths
      </a>
    </section>
  );
}

function ThemeArticle(props: { theme: PublicThemeEntry }) {
  const theme = props.theme;
  const relatedProjects = relatedProjectDetailPageProjectsForTheme(theme);
  const relatedWriting = relatedWritingEntriesForTheme(theme);

  return (
    <article class="content-section">
      <div class="page-intro">
        <a class="text-link detail-back-link" href="/themes">
          Back to themes
        </a>
        <p class="eyebrow">Theme path</p>
        <h1 class="page-title">{theme.title}</h1>
        <p class="lead">{theme.summary}</p>
        <ul class="detail-status-row" aria-label={`${theme.title} audience`}>
          <li class="tier-pill">{theme.audience}</li>
        </ul>
      </div>

      <div class="project-detail-layout">
        <section class="project-detail-story visual-surface" aria-labelledby="why-it-matters">
          <h2 id="why-it-matters" class="card-title">
            Why it matters
          </h2>
          <div class="story-stack project-detail-stack">
            <p>{theme.summary}</p>

            <section aria-labelledby="theme-audience">
              <h3 id="theme-audience" class="story-label">
                Audience
              </h3>
              <p>{theme.audience}</p>
            </section>

            <section aria-labelledby="theme-proof-points">
              <h3 id="theme-proof-points" class="story-label">
                Proof points
              </h3>
              <ul class="label-row" aria-label={`${theme.title} proof points`}>
                <For each={theme.proofPoints}>{(point) => <li class="chip">{point}</li>}</For>
              </ul>
            </section>
          </div>
        </section>

        <aside class="project-detail-aside" aria-label={`${theme.title} related work`}>
          <RelatedProjectsPanel projects={relatedProjects} />
          <RelatedWritingPanel entries={relatedWriting} />
        </aside>
      </div>
    </article>
  );
}

function RelatedProjectsPanel(props: { projects: readonly RelatedProjectEntry[] }) {
  return (
    <Show when={props.projects.length > 0}>
      <section class="project-detail-panel visual-surface" aria-labelledby="related-projects">
        <h2 id="related-projects" class="card-title">
          Related projects
        </h2>
        <div class="writing-related-grid">
          <For each={props.projects}>
            {(project) => (
              <article class="project-anchor-card interactive-surface reactive-card">
                <h3 class="card-title">{project.name}</h3>
                <p class="card-copy">{project.oneLine}</p>
                <div class="link-list">
                  <a class="text-link surface-link" href={projectDetailPath(project)}>
                    Project details
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

function RelatedWritingPanel(props: { entries: readonly PublicWritingEntry[] }) {
  return (
    <Show when={props.entries.length > 0}>
      <section class="project-detail-panel visual-surface" aria-labelledby="related-writing">
        <h2 id="related-writing" class="card-title">
          Related writing
        </h2>
        <div class="writing-related-grid">
          <For each={props.entries}>
            {(entry) => (
              <article class="surface-card">
                <h3 class="card-title">{entry.title}</h3>
                <ul class="label-row" aria-label={`${entry.title} metadata`}>
                  <li class="chip">{writingKindLabel(entry)}</li>
                </ul>
                <p class="card-copy">{entry.summary}</p>
                <div class="link-list">
                  <a class="text-link surface-link" href={writingDetailPath(entry)}>
                    {writingActionLabel(entry)}
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
