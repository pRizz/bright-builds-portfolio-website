import { createHash } from "node:crypto";
import { Resvg } from "@resvg/resvg-js";

import {
  SOCIAL_PREVIEW_DIMENSIONS,
  type SocialPreviewTarget,
} from "../../src/domain/social-previews";
import { socialPreviewFontPath } from "./config";
import { renderSocialPreviewSvg } from "./template";

export type RenderedSocialPreview = {
  target: SocialPreviewTarget;
  png: Buffer;
  pixels: Buffer;
  dimensions: { width: number; height: number };
  sha256: string;
};

export function renderSocialPreviewTarget(target: SocialPreviewTarget): RenderedSocialPreview {
  const svg = renderSocialPreviewSvg(target);
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: SOCIAL_PREVIEW_DIMENSIONS.width,
    },
    font: {
      fontFiles: [socialPreviewFontPath],
      loadSystemFonts: false,
      defaultFontFamily: "Inter",
    },
  });
  const rendered = resvg.render();
  const png = rendered.asPng();

  return {
    target,
    png,
    pixels: rendered.pixels,
    dimensions: {
      width: SOCIAL_PREVIEW_DIMENSIONS.width,
      height: SOCIAL_PREVIEW_DIMENSIONS.height,
    },
    sha256: createHash("sha256").update(png).digest("hex"),
  };
}
