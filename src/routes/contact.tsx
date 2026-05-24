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

      <section class="max-w-3xl">
        <p class="mb-4 font-medium text-emerald-800 text-sm uppercase tracking-[0.12em]">
          Collaboration
        </p>
        <h1 class="text-balance font-semibold text-4xl text-zinc-950 leading-tight">
          {route.heading}
        </h1>
        <p class="mt-6 text-lg text-zinc-700 leading-8">{route.staticCheckText}</p>
      </section>

      <section class="mt-10 grid gap-4 sm:grid-cols-3">
        <For each={peterProfile.links}>
          {(link) => (
            <a
              class="rounded-lg border border-zinc-950/10 bg-white p-5 shadow-sm transition hover:border-emerald-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
              href={link.href}
              rel={link.maybeRel}
              target="_blank"
            >
              <span class="block font-semibold text-zinc-950">{link.label}</span>
              <span class="mt-2 block break-words text-sm text-zinc-600">{link.href}</span>
            </a>
          )}
        </For>
      </section>
    </>
  );
}
