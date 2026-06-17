import { renderToString } from "solid-js/web";
import { describe, expect, it, vi } from "vitest";

import { curatedThemes } from "../src/domain/themes";

let mockedSlug = "agentic-engineering";

vi.mock("@solidjs/router", () => ({
  useParams: () => ({ slug: mockedSlug }),
}));

const { default: ThemeDetail } = await import("../src/routes/themes/[slug]");

describe("theme detail route rendering", () => {
  it("renders public theme detail content and related work", () => {
    // Arrange
    mockedSlug = "agentic-engineering";
    const maybeTheme = curatedThemes.find((theme) => theme.slug === mockedSlug);

    if (!maybeTheme) {
      throw new Error("Expected the agentic engineering theme fixture to exist.");
    }

    // Act
    const html = renderToString(() => ThemeDetail());

    // Assert
    expect(html).toContain("Agentic engineering");
    expect(html).toContain(maybeTheme.summary);
    expect(html).toContain(maybeTheme.audience);
    expect(html).toContain("Why it matters");
    expect(html).toContain("Audience");
    expect(html).toContain("Proof points");
    for (const proofPoint of maybeTheme.proofPoints) {
      expect(html).toContain(proofPoint);
    }
    expect(html).toContain("Related projects");
    expect(html).toContain("Related writing");
    expect(html).toContain("Project details");
    expect(html).toContain("Read note");
  });

  it("renders a generic fallback for unknown theme slugs without leaking theme data", () => {
    // Arrange
    mockedSlug = "unknown-theme-slug";
    const forbiddenFallbackText = [
      "unknown-theme-slug",
      "agentic-engineering",
      "Agentic engineering",
      "open-identity",
      "Open identity",
      "draft",
      "hidden",
      "unsupported",
      "archived",
      "collaborationAngle",
      "OpenLinks profile",
      "Project details",
      "Read note",
      "Read essay",
    ];

    // Act
    const html = renderToString(() => ThemeDetail());

    // Assert
    expect(html).toContain("No public theme here");
    expect(html).toContain("Browse theme paths");
    expect(html).toContain('href="/themes"');
    for (const forbiddenText of forbiddenFallbackText) {
      expect(html).not.toContain(forbiddenText);
    }
  });
});
