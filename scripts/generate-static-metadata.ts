import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

import { robotsTxt, sitemapXml } from "../src/domain/seo";

type GeneratedStaticFile = {
  path: string;
  contents: string;
};

const generatedFiles = [
  {
    path: "public/sitemap.xml",
    contents: sitemapXml(),
  },
  {
    path: "public/robots.txt",
    contents: robotsTxt(),
  },
] as const satisfies readonly GeneratedStaticFile[];

for (const file of generatedFiles) {
  await mkdir(dirname(file.path), { recursive: true });
  await writeFile(file.path, file.contents, "utf8");
  console.info(`Wrote ${file.path}`);
}
