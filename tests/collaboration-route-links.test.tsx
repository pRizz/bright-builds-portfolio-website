import { MetaProvider } from "@solidjs/meta";
import { renderToString } from "solid-js/web";
import { describe, expect, it, vi } from "vitest";

let mockedSlug = "openlinks";

vi.mock("@solidjs/router", () => ({
  useParams: () => ({ slug: mockedSlug }),
}));

const { default: ProjectDetail } = await import("../src/routes/projects/[slug]");
const { default: WritingDetail } = await import("../src/routes/writing/[slug]");

describe("collaboration route links", () => {
  it("renders related theme links on a selected project detail route", () => {
    // Arrange
    mockedSlug = "openlinks";

    // Act
    const html = renderProjectDetailRoute();

    // Assert
    expect(html).toContain("Related theme paths");
    expect(html).toContain("Open identity");
    expect(html).toContain('href="/themes/open-identity"');
    expect(html).toContain("Explore theme");
  });

  it("omits related theme links for selected projects without public theme references", () => {
    // Arrange
    mockedSlug = "win3bitcoin";

    // Act
    const html = renderProjectDetailRoute();

    // Assert
    expect(html).not.toContain("Related theme paths");
  });

  it("renders related theme links after related projects on a writing detail route", () => {
    // Arrange
    mockedSlug = "portable-identity-and-owned-surfaces";

    // Act
    const html = renderWritingDetailRoute();
    const relatedProjectIndex = html.indexOf("Related projects");
    const relatedThemeIndex = html.indexOf("Related theme paths");

    // Assert
    expect(relatedProjectIndex).toBeGreaterThanOrEqual(0);
    expect(relatedProjectIndex).toBeLessThan(relatedThemeIndex);
    expect(html).toContain("Open identity");
    expect(html).toContain('href="/themes/open-identity"');
    expect(html).toContain("Explore theme");
  });
});

function renderProjectDetailRoute(): string {
  return renderToString(() => (
    <MetaProvider>
      <ProjectDetail />
    </MetaProvider>
  ));
}

function renderWritingDetailRoute(): string {
  return renderToString(() => (
    <MetaProvider>
      <WritingDetail />
    </MetaProvider>
  ));
}
