import { relative } from "node:path";

import type { ForbiddenTextPattern } from "./types";

export function preHydrationBody(html: string): string {
  const bodyStart = html.indexOf("<body");
  const maybeHydrationStart = html.indexOf("<script>window.manifest");

  if (bodyStart === -1) {
    return html;
  }

  if (maybeHydrationStart === -1) {
    return html.slice(bodyStart);
  }

  return html.slice(bodyStart, maybeHydrationStart);
}

export function assertJsonLdContains(html: string, expectedTexts: readonly string[]): void {
  const jsonLdScripts = [
    ...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs),
  ]
    .map((match) => match[1])
    .join("\n");

  if (!jsonLdScripts) {
    throw new Error("Generated HTML did not contain JSON-LD script content.");
  }

  for (const expectedText of expectedTexts) {
    assertHtmlContains(jsonLdScripts, expectedText, "JSON-LD script content");
  }
}

export function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function escapeHtmlText(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function escapeHtmlAttribute(value: string): string {
  return escapeHtmlText(value).replace(/"/g, "&quot;");
}

export function assertHtmlContains(html: string, expectedText: string, context: string): void {
  if (html.includes(expectedText)) {
    return;
  }

  throw new Error(`${context} did not contain expected text: ${expectedText}`);
}

export function assertHtmlMatches(html: string, pattern: RegExp, context: string): void {
  if (pattern.test(html)) {
    return;
  }

  throw new Error(`${context} did not match expected pattern: ${pattern}`);
}

export function assertForbiddenTextAbsent(
  root: string,
  path: string,
  html: string,
  patterns: readonly ForbiddenTextPattern[],
): void {
  for (const { label, pattern } of patterns) {
    pattern.lastIndex = 0;

    if (pattern.test(html)) {
      throw new Error(`Static HTML for ${relative(root, path)} contained forbidden text: ${label}`);
    }
  }
}
