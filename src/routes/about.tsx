import { Link as HeadLink, Meta, Title } from "@solidjs/meta";
import { For } from "solid-js";
import { peterProfile } from "../domain/profile";
import { routeByPath } from "../domain/routes";
import { jsonLdScriptContent, metadataForRoute, personJsonLd, siteAssetLinks } from "../domain/seo";

const route = routeByPath("/about");
const metadata = metadataForRoute(route);
const personJsonLdValue = personJsonLd();
const themes = [
  {
    title: "Agentic engineering",
    body: "Peter treats agentic engineering as practical developer tooling, from opencode-cloud to workflow experiments that keep work reproducible, inspectable, and useful.",
  },
  {
    title: "Open source",
    body: "The portfolio favors reviewed public source, authored context, and useful links over an unfiltered repository mirror, so collaboration starts from concrete work.",
  },
  {
    title: "Bitcoin and decentralized systems",
    body: "Bitcoin work spans Win3Bitco.in / Open Bitcoin Web Miner, Open Bitcoin, Zeckendorf, and lab experiments around finance, addresses, proof-of-work, and open systems.",
  },
  {
    title: "Web tooling",
    body: "Bright Builds uses SolidStart, Mystic UI, Tailwind, and static route contracts to keep the web surface fast, inspectable, and aligned with Peter's own tools.",
  },
  {
    title: "Creative experiments",
    body: "Lab and prototype work stays visible when it has authored context, letting practical web experiments complement flagship systems without overstating maturity.",
  },
] as const;

export default function About() {
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

      <section class="page-intro">
        <p class="eyebrow">Profile</p>
        <h1 class="page-title">{route.heading}</h1>
        <p class="lead">{peterProfile.summary}</p>
        <p class="body-copy">{route.staticCheckText}</p>
        <div class="profile-link-row">
          <a
            class="text-link"
            href="https://openlinks.us/"
            rel="me noopener noreferrer"
            target="_blank"
          >
            OpenLinks identity hub
          </a>
        </div>
      </section>

      <section class="content-section">
        <h2 class="section-title">Working themes</h2>
        <ul class="theme-grid" aria-label="Working themes">
          <For each={themes}>
            {(theme) => (
              <li class="theme-card">
                <h3 class="theme-title">{theme.title}</h3>
                <p class="body-copy">{theme.body}</p>
              </li>
            )}
          </For>
        </ul>
      </section>
    </>
  );
}
