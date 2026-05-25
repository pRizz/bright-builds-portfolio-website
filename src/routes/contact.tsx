import { Link as HeadLink, Meta, Title } from "@solidjs/meta";
import { For } from "solid-js";
import { peterProfile } from "../domain/profile";
import { routeByPath } from "../domain/routes";
import { metadataForRoute } from "../domain/seo";

const route = routeByPath("/contact");
const metadata = metadataForRoute(route);

export default function Contact() {
  return (
    <>
      <Title>{metadata.title}</Title>
      <Meta name="description" content={metadata.description} />
      <HeadLink rel="canonical" href={metadata.canonical} />

      <section class="page-intro">
        <p class="eyebrow">Collaboration</p>
        <h1 class="page-title">{route.heading}</h1>
        <p class="lead">{route.staticCheckText}</p>
      </section>

      <section class="contact-grid">
        <For each={peterProfile.links}>
          {(link) => (
            <a class="contact-card" href={link.href} rel={link.maybeRel} target="_blank">
              <span class="contact-label">{link.label}</span>
              <span class="contact-url">{link.href}</span>
            </a>
          )}
        </For>
      </section>
    </>
  );
}
