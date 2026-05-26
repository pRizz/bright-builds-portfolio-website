import { Link as HeadLink, Meta, Title } from "@solidjs/meta";
import { For } from "solid-js";
import { peterProfile } from "../domain/profile";
import { routeByPath } from "../domain/routes";
import { jsonLdScriptContent, metadataForRoute, personJsonLd, siteAssetLinks } from "../domain/seo";

const route = routeByPath("/contact");
const metadata = metadataForRoute(route);
const personJsonLdValue = personJsonLd();
const contactCopy =
  "GitHub is the best place to start for code and collaboration. OpenLinks is Peter's identity hub for current links.";

export default function Contact() {
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
        <p class="eyebrow">Collaboration</p>
        <h1 class="page-title">{route.heading}</h1>
        <p class="lead">{route.staticCheckText}</p>
        <p class="contact-copy">{contactCopy}</p>
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
