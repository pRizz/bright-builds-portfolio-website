import type { JSX } from "solid-js";
import { For } from "solid-js";
import { peterProfile } from "../domain/profile";
import { navigationRoutes } from "../domain/routes";

type SiteLayoutProps = {
  children: JSX.Element;
};

export function SiteLayout(props: SiteLayoutProps) {
  return (
    <div class="min-h-screen bg-stone-50 text-zinc-950">
      <a class="skip-link" href="#content">
        Skip to content
      </a>

      <header class="border-zinc-950/10 border-b bg-stone-50/90 backdrop-blur">
        <div class="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <a class="font-semibold text-lg tracking-normal" href="/">
            {peterProfile.name}
          </a>
          <nav aria-label="Primary navigation">
            <ul class="flex flex-wrap items-center gap-2">
              <For each={navigationRoutes}>
                {(route) => (
                  <li>
                    <a
                      class="rounded-md px-3 py-2 text-sm text-zinc-700 transition hover:bg-emerald-100 hover:text-zinc-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
                      href={route.path}
                    >
                      {route.label}
                    </a>
                  </li>
                )}
              </For>
            </ul>
          </nav>
        </div>
      </header>

      <main id="content" class="mx-auto w-full max-w-6xl px-5 py-12 sm:py-16">
        {props.children}
      </main>

      <footer class="border-zinc-950/10 border-t">
        <div class="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-6 text-sm text-zinc-600">
          <p>Bright Builds portfolio foundation.</p>
          <a
            class="font-medium text-emerald-800 hover:text-zinc-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
            href="https://openlinks.us/"
            rel="me noopener noreferrer"
            target="_blank"
          >
            OpenLinks
          </a>
        </div>
      </footer>
    </div>
  );
}
