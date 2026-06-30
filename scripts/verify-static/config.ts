import { escapeRegExp } from "./html-assertions";
import type { ForbiddenTextPattern } from "./types";

export const staticOutputRoot = ".output/public";
export const projectDetailRouteSourcePath = "src/routes/projects/[slug].tsx";
export const writingDetailRouteSourcePath = "src/routes/writing/[slug].tsx";
export const themeDetailRouteSourcePath = "src/routes/themes/[slug].tsx";
export const topicDetailRouteSourcePath = "src/routes/topics/[slug].tsx";

const staleStandaloneRepoHrefs = [
  "https://github.com/pRizz/openlinks",
  "https://github.com/pRizz/win3bitcoin",
  "https://github.com/pRizz/open-bitcoin",
] as const;

export const generatedOutputForbiddenPatterns = [
  ...staleStandaloneRepoHrefs.map((href) => ({
    label: href,
    pattern: new RegExp(`${escapeRegExp(href)}(?=["'/?#])`),
  })),
  { label: "Selected works", pattern: /Selected works/i },
  { label: "Creative Director", pattern: /Creative Director/i },
  { label: "Awwwards", pattern: /Awwwards/i },
  { label: "Lorem ipsum", pattern: /Lorem ipsum/i },
  { label: "fake case study", pattern: /fake case study/i },
  { label: "skill bar", pattern: /skill bar/i },
  { label: 'href="javascript:', pattern: /href=["']\s*javascript:/i },
  { label: 'href="data:', pattern: /href=["']\s*data:/i },
  { label: "api.github.com", pattern: /api\.github\.com/i },
  { label: "github.com/graphql", pattern: /github\.com\/graphql/i },
  { label: "@octokit/", pattern: /@octokit\//i },
  { label: "GITHUB_TOKEN", pattern: /GITHUB_TOKEN/ },
  { label: "VITE_*GITHUB*TOKEN", pattern: /VITE_[A-Z0-9_]*GITHUB[A-Z0-9_]*TOKEN/i },
  { label: "No GitHub metadata yet", pattern: /No GitHub metadata yet/i },
  {
    label: "GitHub metadata refresh failed",
    pattern: /GitHub metadata refresh failed/i,
  },
] as const satisfies readonly ForbiddenTextPattern[];

export const writingDateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "long",
  timeZone: "UTC",
  year: "numeric",
});
