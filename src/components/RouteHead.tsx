import { Link as HeadLink, Meta, Title } from "@solidjs/meta";
import { For } from "solid-js";
import { type PageMetadata, siteAssetLinks } from "../domain/seo";

type RouteHeadProps = {
  metadata: PageMetadata;
};

export function RouteHead(props: RouteHeadProps) {
  return (
    <>
      <Title>{props.metadata.title}</Title>
      <Meta name="description" content={props.metadata.description} />
      <HeadLink rel="canonical" href={props.metadata.canonical} />
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
      <Meta property="og:title" content={props.metadata.openGraph.title} />
      <Meta property="og:description" content={props.metadata.openGraph.description} />
      <Meta property="og:url" content={props.metadata.openGraph.url} />
      <Meta property="og:type" content={props.metadata.openGraph.type} />
      <Meta property="og:image" content={props.metadata.openGraph.image.url} />
      <Meta property="og:image:type" content={props.metadata.openGraph.image.mimeType} />
      <Meta property="og:image:width" content={props.metadata.openGraph.image.width.toString()} />
      <Meta property="og:image:height" content={props.metadata.openGraph.image.height.toString()} />
      <Meta property="og:image:alt" content={props.metadata.openGraph.image.alt} />
      <Meta name="twitter:card" content={props.metadata.twitter.card} />
      <Meta name="twitter:title" content={props.metadata.twitter.title} />
      <Meta name="twitter:description" content={props.metadata.twitter.description} />
      <Meta name="twitter:image" content={props.metadata.twitter.image.url} />
      <Meta name="twitter:image:alt" content={props.metadata.twitter.image.alt} />
    </>
  );
}
