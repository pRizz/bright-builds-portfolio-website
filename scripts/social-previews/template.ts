import type { SocialPreviewTarget } from "../../src/domain/social-previews";

const svgWidth = 1200;
const svgHeight = 630;
const safeMargin = 72;
const maxLabels = 4;
const svgNamespace = ["http", "://www.w3.org/2000/svg"].join("");

const palette = {
  accentText: "#6ee7b7",
  background: "#07111f",
  border: "#2fd6a3",
  mutedText: "#8aa0b8",
  primaryText: "#f7fbff",
  secondaryText: "#b8c7d9",
  surface: "#0f1f2e",
} as const;

export function renderSocialPreviewSvg(target: SocialPreviewTarget): string {
  const titleLines = wrappedSvgTextLines(target.title, {
    maxCharactersPerLine: 26,
    maxLines: 2,
  });
  const descriptionLines = wrappedSvgTextLines(target.description, {
    maxCharactersPerLine: 54,
    maxLines: 3,
  });
  const labelChips = target.labels.slice(0, maxLabels);

  return [
    `<svg xmlns="${svgNamespace}" role="img" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">`,
    `  <title>${escapeSvgText(target.alt)}</title>`,
    `  <rect width="${svgWidth}" height="${svgHeight}" fill="${palette.background}" />`,
    `  <rect x="32" y="32" width="1136" height="566" rx="28" fill="${palette.surface}" stroke="${palette.border}" stroke-width="2" opacity="0.92" />`,
    `  <circle cx="1060" cy="126" r="76" fill="${palette.border}" opacity="0.12" />`,
    `  <circle cx="986" cy="522" r="118" fill="${palette.accentText}" opacity="0.08" />`,
    `  <text x="${safeMargin}" y="112" fill="${palette.accentText}" font-family="Inter" font-size="26" font-weight="700">${escapeSvgText(target.kicker.toUpperCase())}</text>`,
    ...titleLines.map(
      (line, index) =>
        `  <text x="${safeMargin}" y="${204 + index * 74}" fill="${palette.primaryText}" font-family="Inter" font-size="64" font-weight="800">${escapeSvgText(line)}</text>`,
    ),
    ...descriptionLines.map(
      (line, index) =>
        `  <text x="${safeMargin}" y="${378 + index * 44}" fill="${palette.secondaryText}" font-family="Inter" font-size="34" font-weight="500">${escapeSvgText(line)}</text>`,
    ),
    ...labelChips.map((label, index) => renderLabelChip(label, index)),
    `  <text x="${safeMargin}" y="552" fill="${palette.mutedText}" font-family="Inter" font-size="24" font-weight="600">Bright Builds / Peter Ryszkiewicz</text>`,
    "</svg>",
  ].join("\n");
}

export function escapeSvgText(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function wrappedSvgTextLines(
  value: string,
  options: { maxLines: number; maxCharactersPerLine: number },
): readonly string[] {
  const words = value.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const segments = splitLongWord(word, options.maxCharactersPerLine);

    for (const segment of segments) {
      const maybeNextLine = currentLine ? `${currentLine} ${segment}` : segment;

      if (maybeNextLine.length <= options.maxCharactersPerLine) {
        currentLine = maybeNextLine;
        continue;
      }

      if (currentLine) {
        lines.push(currentLine);
      }

      currentLine = segment;

      if (lines.length === options.maxLines) {
        return lines;
      }
    }
  }

  if (currentLine && lines.length < options.maxLines) {
    lines.push(currentLine);
  }

  return lines;
}

function splitLongWord(word: string, maxCharactersPerLine: number): readonly string[] {
  if (word.length <= maxCharactersPerLine) {
    return [word];
  }

  const segments: string[] = [];

  for (let index = 0; index < word.length; index += maxCharactersPerLine) {
    segments.push(word.slice(index, index + maxCharactersPerLine));
  }

  return segments;
}

function renderLabelChip(label: string, index: number): string {
  const x = safeMargin + index * 222;
  const width = Math.min(196, Math.max(96, label.length * 12 + 42));

  return [
    `  <rect x="${x}" y="472" width="${width}" height="44" rx="22" fill="${palette.background}" stroke="${palette.border}" stroke-width="1" opacity="0.86" />`,
    `  <text x="${x + 21}" y="501" fill="${palette.accentText}" font-family="Inter" font-size="20" font-weight="700">${escapeSvgText(label)}</text>`,
  ].join("\n");
}
