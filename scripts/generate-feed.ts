import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

import { rssFeedXml } from "../src/domain/feed";

const outputPath = "public/feed.xml";
const expected = rssFeedXml();
const checkMode = process.argv.includes("--check");

if (checkMode) {
  try {
    const actual = await readFile(outputPath, "utf8");

    if (actual !== expected) {
      throw new Error("Feed output is out of date. Run bun run generate:feed.");
    }
  } catch (cause) {
    throw new Error("Feed output is out of date. Run bun run generate:feed.", { cause });
  }

  console.info("Feed output is current.");
} else {
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, expected, "utf8");
  console.info("Wrote public/feed.xml");
}
