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

      <section class="max-w-3xl">
        <p class="mb-4 font-medium text-emerald-800 text-sm uppercase tracking-[0.12em]">Profile</p>
        <h1 class="text-balance font-semibold text-4xl text-zinc-950 leading-tight">
          {route.heading}
        </h1>
        <p class="mt-6 text-lg text-zinc-700 leading-8">{route.staticCheckText}</p>
        <p class="mt-4 text-zinc-700 leading-7">{peterProfile.summary}</p>
      </section>

      <section class="mt-10">
        <h2 class="font-semibold text-2xl text-zinc-950">Working themes</h2>
        <ul class="mt-4 grid gap-3 sm:grid-cols-2">
          <For each={peterProfile.focusAreas}>
            {(area) => (
              <li class="rounded-lg border border-zinc-950/10 bg-white px-4 py-3 text-zinc-700 shadow-sm">
                {area}
              </li>
            )}
          </For>
        </ul>
      </section>
    </>
  );
}
