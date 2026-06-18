import { MetaProvider } from "@solidjs/meta";
import { renderToString } from "solid-js/web";
import { describe, expect, it, vi } from "vitest";

import { curatedThemes } from "../src/domain/themes";

let mockedSlug = "agentic-engineering";

vi.mock("@solidjs/router", () => ({
  useParams: () => ({ slug: mockedSlug }),
}));

const { default: ThemeDetail } = await import("../src/routes/themes/[slug]");

function renderThemeDetail(): string {
  return renderToString(() => (
    <MetaProvider>
      <ThemeDetail />
    </MetaProvider>
  ));
}

describe("theme detail route rendering", () => {
  it("renders collaboration starting points on public theme detail routes", () => {
    // Arrange
    mockedSlug = "agentic-engineering";
    const maybeTheme = curatedThemes.find((theme) => theme.slug === mockedSlug);

    if (!maybeTheme) {
      throw new Error("Expected the agentic engineering theme fixture to exist.");
    }

    // Act
    const html = renderThemeDetail();

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
    expect(html).toContain("Collaboration starting points");
    expect(html).toContain("Where to start");
    expect(html).toContain(maybeTheme.collaborationAngle);
    expect(html).toContain("Project story");
    expect(html).toContain("Source");
    expect(html).toContain("Live surface");
    expect(html).toContain("Read note");
    expect(html).toContain('href="/projects/opencode-cloud"');
    expect(html).toContain("https://github.com/pRizz/opencode-cloud");
    expect(html).toContain('href="/writing/agentic-engineering-workflows"');
    expect(html).not.toContain("OpenLinks profile");
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
      "Collaboration starting points",
      "Where to start",
      "OpenLinks profile",
      "Project story",
      "Source",
      "Live surface",
      "Contact path",
      "No collaboration paths yet",
      "Project details",
      "Read note",
      "Read essay",
    ];

    // Act
    const html = renderThemeDetail();

    // Assert
    expect(html).toContain("No public theme here");
    expect(html).toContain("Browse theme paths");
    expect(html).toContain('href="/themes"');
    for (const forbiddenText of forbiddenFallbackText) {
      expect(html).not.toContain(forbiddenText);
    }
  });
});
