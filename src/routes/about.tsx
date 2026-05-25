import { Link as HeadLink, Meta, Title } from "@solidjs/meta";
import { For } from "solid-js";
import { peterProfile } from "../domain/profile";
import { routeByPath } from "../domain/routes";
import { metadataForRoute } from "../domain/seo";

const route = routeByPath("/about");
const metadata = metadataForRoute(route);

export default function About() {
  return (
    <>
      <Title>{metadata.title}</Title>
      <Meta name="description" content={metadata.description} />
      <HeadLink rel="canonical" href={metadata.canonical} />

      <section class="page-intro">
        <p class="eyebrow">Profile</p>
        <h1 class="page-title">{route.heading}</h1>
        <p class="lead">{route.staticCheckText}</p>
        <p class="body-copy">{peterProfile.summary}</p>
      </section>

      <section class="content-section">
        <h2 class="section-title">Working themes</h2>
        <ul class="theme-grid">
          <For each={peterProfile.focusAreas}>{(area) => <li class="theme-item">{area}</li>}</For>
        </ul>
      </section>
    </>
  );
}
