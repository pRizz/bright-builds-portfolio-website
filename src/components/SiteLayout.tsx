import type { JSX } from "solid-js";
import { For } from "solid-js";
import { peterProfile } from "../domain/profile";
import { navigationRoutes } from "../domain/routes";

type SiteLayoutProps = {
  children: JSX.Element;
};

export function SiteLayout(props: SiteLayoutProps) {
  return (
    <div class="site-shell">
      <a class="skip-link" href="#content">
        Skip to content
      </a>

      <header class="site-header">
        <div class="site-header-inner">
          <a class="brand-link" href="/">
            {peterProfile.name}
          </a>
          <nav aria-label="Primary navigation">
            <ul class="nav-list">
              <For each={navigationRoutes}>
                {(route) => (
                  <li>
                    <a class="nav-link" href={route.path}>
                      {route.label}
                    </a>
                  </li>
                )}
              </For>
            </ul>
          </nav>
        </div>
      </header>

      <main id="content" class="site-main">
        {props.children}
      </main>

      <footer class="site-footer">
        <div class="site-footer-inner">
          <p>Bright Builds portfolio foundation.</p>
          <a
            class="footer-link"
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
