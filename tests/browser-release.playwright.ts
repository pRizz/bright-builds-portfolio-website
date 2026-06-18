import AxeBuilder from "@axe-core/playwright";
import { expect, type Locator, type Page, test } from "@playwright/test";
import {
  projectDetailPageProjects,
  projectDetailPath,
  projectDetailRoutes,
} from "../src/domain/projects";
import { prerenderRoutes } from "../src/domain/routes";
import {
  collaborationActionsForTheme,
  publicThemeEntries,
  publicThemeEntriesForProject,
  publicThemeEntriesForWritingEntry,
  relatedProjectDetailPageProjectsForTheme,
  relatedWritingEntriesForTheme,
  themeDetailPath,
  themeDetailRoutes,
} from "../src/domain/themes";
import {
  publicWritingEntries,
  relatedProjectDetailPageProjects,
  writingDetailPath,
  writingDetailRoutes,
} from "../src/domain/writing";

type LayoutFinding = {
  label: string;
  detail: string;
};

type FocusSnapshot = {
  href: string | null;
  label: string;
  visible: boolean;
};

type AxeViolation = {
  id: string;
  impact?: string | null;
  nodes: readonly {
    target: unknown;
    failureSummary?: string;
  }[];
};

const layoutProjects = new Set(["chromium-desktop", "chromium-mobile"]);
const reducedMotionProject = "chromium-reduced-motion";
const maxKeyboardTabs = 40;
const reducedMotionHoverSelectors = [
  ".interactive-surface",
  ".reactive-card",
  ".surface-link",
  ".focus-row",
  ".story-card",
  ".project-anchor-card",
  ".theme-card",
  ".contact-card",
] as const;
const projectActionLabels = [
  "Open source",
  "Live site",
  "Live docs",
  "Docs",
  "Article",
  "Related source",
] as const;

test.describe("browser release checks", () => {
  for (const route of prerenderRoutes) {
    test(`axe has no violations on ${route}`, async ({ page }, testInfo) => {
      // Arrange
      await page.goto(route);

      // Act
      const results = await new AxeBuilder({ page }).analyze();
      const violations = axeViolationSummaries(results.violations);

      // Assert
      expect(violations, `${testInfo.project.name} ${route} axe violations`).toEqual([]);
    });

    test(`dark layout has no overflow or obvious overlap on ${route}`, async ({
      page,
    }, testInfo) => {
      test.skip(
        !layoutProjects.has(testInfo.project.name),
        "dark layout coverage runs on desktop and mobile projects",
      );

      // Arrange
      await page.goto(route);

      // Act
      const findings = await layoutFindingsForPage(page);

      // Assert
      expect(findings, `${testInfo.project.name} ${route} layout findings`).toEqual([]);
    });
  }

  test("keyboard focus reaches release-critical paths", async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name === reducedMotionProject,
      "keyboard focus coverage runs on desktop and mobile projects",
    );

    // Arrange
    const detailRoute = representativeProjectDetailRouteWithRelatedThemes();
    const writingRoute = representativeWritingDetailRouteWithRelatedThemes();
    const relatedProjectRoute = representativeWritingRelatedProjectRoute();
    const themeRoute = representativeThemeDetailRoute();
    const relatedThemeProjectRoute = representativeThemeRelatedProjectRoute();
    const relatedThemeWritingRoute = representativeThemeRelatedWritingRoute();
    const themeExternalCollaborationHref = representativeThemeExternalCollaborationHref();
    const projectRelatedThemeRoute = representativeProjectRelatedThemeRoute();
    const writingRelatedThemeRoute = representativeWritingRelatedThemeRoute();
    await page.goto("/");

    // Act
    const focusedTargets = await keyboardFocusTargets(page);

    // Assert
    expect(visibleFocusFailures(focusedTargets), "focused elements must be visible").toEqual([]);
    expect(hasFocusedInternalPath(focusedTargets, "/"), "focus reaches Home nav").toBe(true);
    expect(hasFocusedInternalPath(focusedTargets, "/about"), "focus reaches About nav").toBe(true);
    expect(hasFocusedInternalPath(focusedTargets, "/projects"), "focus reaches Projects nav").toBe(
      true,
    );
    expect(hasFocusedInternalPath(focusedTargets, "/writing"), "focus reaches Writing nav").toBe(
      true,
    );
    expect(hasFocusedInternalPath(focusedTargets, "/themes"), "focus reaches Themes nav").toBe(
      true,
    );
    expect(hasFocusedInternalPath(focusedTargets, "/contact"), "focus reaches Contact nav").toBe(
      true,
    );
    expect(
      hasFocusedProjectAnchor(focusedTargets),
      "focus reaches at least one project anchor link",
    ).toBe(true);
    expect(
      hasFocusedInternalPath(focusedTargets, detailRoute),
      "focus reaches selected project detail route",
    ).toBe(true);
    expect(
      hasFocusedExternalOrigin(focusedTargets, "https://openlinks.us"),
      "focus reaches OpenLinks collaboration path",
    ).toBe(true);

    await page.goto(detailRoute);
    const detailFocusedTargets = await keyboardFocusTargets(page);

    expect(
      visibleFocusFailures(detailFocusedTargets),
      "detail focused elements must be visible",
    ).toEqual([]);
    expect(
      hasFocusedInternalPath(detailFocusedTargets, "/projects"),
      "focus reaches Project index from selected project detail route",
    ).toBe(true);
    expect(
      hasFocusedProjectActionLink(detailFocusedTargets),
      "focus reaches at least one selected project action link",
    ).toBe(true);
    expect(
      hasFocusedInternalPath(detailFocusedTargets, projectRelatedThemeRoute),
      "focus reaches related theme route from selected project detail route",
    ).toBe(true);

    await page.goto("/writing");
    const writingFocusedTargets = await keyboardFocusTargets(page);

    expect(
      visibleFocusFailures(writingFocusedTargets),
      "writing focused elements must be visible",
    ).toEqual([]);
    expect(
      hasFocusedInternalPath(writingFocusedTargets, writingRoute),
      "focus reaches public writing detail route",
    ).toBe(true);

    await page.goto(writingRoute);
    const writingDetailFocusedTargets = await keyboardFocusTargets(page);

    expect(
      visibleFocusFailures(writingDetailFocusedTargets),
      "writing detail focused elements must be visible",
    ).toEqual([]);
    expect(
      hasFocusedInternalPath(writingDetailFocusedTargets, "/writing"),
      "focus reaches Writing index from writing detail route",
    ).toBe(true);
    expect(
      hasFocusedInternalPath(writingDetailFocusedTargets, relatedProjectRoute),
      "focus reaches related project route from writing detail route",
    ).toBe(true);
    expect(
      hasFocusedInternalPath(writingDetailFocusedTargets, writingRelatedThemeRoute),
      "focus reaches related theme route from writing detail route",
    ).toBe(true);

    await page.goto("/themes");
    const themeFocusedTargets = await keyboardFocusTargets(page);

    expect(
      visibleFocusFailures(themeFocusedTargets),
      "theme focused elements must be visible",
    ).toEqual([]);
    expect(
      hasFocusedInternalPath(themeFocusedTargets, themeRoute),
      "focus reaches public theme detail route",
    ).toBe(true);

    await page.goto(themeRoute);
    const themeDetailFocusedTargets = await keyboardFocusTargets(page);

    expect(
      visibleFocusFailures(themeDetailFocusedTargets),
      "theme detail focused elements must be visible",
    ).toEqual([]);
    expect(
      hasFocusedInternalPath(themeDetailFocusedTargets, "/themes"),
      "focus reaches Themes index from theme detail route",
    ).toBe(true);
    expect(
      hasFocusedInternalPath(themeDetailFocusedTargets, relatedThemeProjectRoute),
      "focus reaches related project route from theme detail route",
    ).toBe(true);
    expect(
      hasFocusedInternalPath(themeDetailFocusedTargets, relatedThemeWritingRoute),
      "focus reaches related writing route from theme detail route",
    ).toBe(true);
    expect(
      hasFocusedHref(themeDetailFocusedTargets, themeExternalCollaborationHref),
      "focus reaches external collaboration action from theme detail route",
    ).toBe(true);
  });

  test("reduced-motion disables decorative hover and pointer motion", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== reducedMotionProject,
      "reduced-motion behavior runs on the reduced-motion project",
    );

    // Arrange
    const routes = [
      "/",
      representativeProjectDetailRoute(),
      representativeWritingDetailRoute(),
      "/themes",
      representativeThemeDetailRoute(),
    ] as const;

    // Act
    for (const route of routes) {
      await assertReducedMotionStableOnRoute(page, route);
    }
  });
});

function representativeProjectDetailRoute(): string {
  const maybeRoute = projectDetailRoutes()[0];

  if (!maybeRoute) {
    throw new Error("Expected at least one selected project detail route for release coverage.");
  }

  return maybeRoute;
}

function representativeProjectDetailRouteWithRelatedThemes(): string {
  return projectDetailPath(representativeProjectWithRelatedThemes());
}

function representativeWritingDetailRoute(): string {
  const maybeRoute = writingDetailRoutes()[0];

  if (!maybeRoute) {
    throw new Error("Expected at least one public writing detail route for release coverage.");
  }

  return maybeRoute;
}

function representativeWritingDetailRouteWithRelatedThemes(): string {
  return writingDetailPath(representativeWritingWithRelatedThemes());
}

function representativeWritingRelatedProjectRoute(): string {
  for (const entry of publicWritingEntries()) {
    const maybeProject = relatedProjectDetailPageProjects(entry)[0];

    if (maybeProject) {
      return projectDetailPath(maybeProject);
    }
  }

  throw new Error(
    "Expected at least one public writing entry with a related project detail route for release coverage.",
  );
}

function representativeThemeExternalCollaborationHref(): string {
  for (const theme of publicThemeEntries()) {
    const maybeAction = collaborationActionsForTheme(theme).find((action) => action.external);

    if (maybeAction) {
      return maybeAction.href;
    }
  }

  throw new Error(
    "Expected at least one public theme with an external collaboration action for browser coverage.",
  );
}

function representativeProjectRelatedThemeRoute(): string {
  const project = representativeProjectWithRelatedThemes();
  const maybeTheme = publicThemeEntriesForProject(project)[0];

  if (!maybeTheme) {
    throw new Error(
      "Expected at least one selected project with a related public theme route for browser coverage.",
    );
  }

  return themeDetailPath(maybeTheme);
}

function representativeWritingRelatedThemeRoute(): string {
  const entry = representativeWritingWithRelatedThemes();
  const maybeTheme = publicThemeEntriesForWritingEntry(entry)[0];

  if (!maybeTheme) {
    throw new Error(
      "Expected at least one public writing entry with a related public theme route for browser coverage.",
    );
  }

  return themeDetailPath(maybeTheme);
}

function representativeProjectWithRelatedThemes() {
  for (const project of projectDetailPageProjects()) {
    if (publicThemeEntriesForProject(project).length > 0) {
      return project;
    }
  }

  throw new Error(
    "Expected at least one selected project with related public themes for browser coverage.",
  );
}

function representativeWritingWithRelatedThemes() {
  for (const entry of publicWritingEntries()) {
    if (publicThemeEntriesForWritingEntry(entry).length > 0) {
      return entry;
    }
  }

  throw new Error(
    "Expected at least one public writing entry with related public themes for browser coverage.",
  );
}

function representativeThemeDetailRoute(): string {
  const maybeRoute = themeDetailRoutes()[0];

  if (!maybeRoute) {
    throw new Error("Expected at least one public theme detail route for release coverage.");
  }

  return maybeRoute;
}

function representativeThemeRelatedProjectRoute(): string {
  for (const theme of publicThemeEntries()) {
    const maybeProject = relatedProjectDetailPageProjectsForTheme(theme)[0];

    if (maybeProject) {
      return projectDetailPath(maybeProject);
    }
  }

  throw new Error(
    "Expected at least one public theme with a related selected project detail route for release coverage.",
  );
}

function representativeThemeRelatedWritingRoute(): string {
  for (const theme of publicThemeEntries()) {
    const maybeEntry = relatedWritingEntriesForTheme(theme)[0];

    if (maybeEntry) {
      return writingDetailPath(maybeEntry);
    }
  }

  throw new Error(
    "Expected at least one public theme with a related public writing route for release coverage.",
  );
}

async function assertReducedMotionStableOnRoute(page: Page, route: string): Promise<void> {
  await page.goto(route);
  const hoverTarget = await firstVisibleLocator(page, reducedMotionHoverSelectors.join(", "));

  await hoverTarget.hover();
  const transform = await hoverTarget.evaluate((element) => getComputedStyle(element).transform);
  const maybeReactiveSurface = await maybeFirstVisibleLocator(page, ".reactive-surface");

  expect(transform, `${route} reduced-motion hover transform`).toBe("none");

  if (!maybeReactiveSurface) {
    return;
  }

  const beforePointerVars = await inlinePointerVars(maybeReactiveSurface);
  const box = await maybeReactiveSurface.boundingBox();

  if (!box) {
    throw new Error(
      `Expected .reactive-surface to have a browser-visible bounding box on ${route}.`,
    );
  }

  await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.2);
  await page.waitForTimeout(100);
  const afterPointerVars = await inlinePointerVars(maybeReactiveSurface);

  expect(afterPointerVars, `${route} reduced-motion pointer CSS vars`).toEqual(beforePointerVars);
}

function axeViolationSummaries(violations: readonly AxeViolation[]): readonly string[] {
  return violations.map((violation) => {
    const firstNode = violation.nodes[0];
    const target = firstNode ? formatAxeTarget(firstNode.target) : "unknown target";
    const failure = firstNode?.failureSummary?.replace(/\s+/g, " ").trim() ?? "no summary";

    return `${violation.id} (${violation.impact ?? "unknown impact"}) at ${target}: ${failure}`;
  });
}

function formatAxeTarget(target: unknown): string {
  if (Array.isArray(target)) {
    return target.map((part) => String(part)).join(" ");
  }

  return String(target);
}

async function layoutFindingsForPage(page: Page): Promise<readonly LayoutFinding[]> {
  return page.evaluate(() => {
    type LayoutCandidate = {
      element: HTMLElement;
      label: string;
      rect: DOMRect;
    };

    const findings: LayoutFinding[] = [];
    const overflowTolerance = 1;
    const overlapTolerance = 4;
    const documentWidth = Math.max(document.body.scrollWidth, document.documentElement.scrollWidth);
    const viewportWidth = document.documentElement.clientWidth;

    if (!document.documentElement.classList.contains("dark")) {
      findings.push({
        label: "dark root",
        detail: "Root document is missing the .dark class.",
      });
    }

    if (documentWidth > viewportWidth + overflowTolerance) {
      findings.push({
        label: "horizontal overflow",
        detail: `Document width ${documentWidth}px exceeds viewport ${viewportWidth}px.`,
      });
    }

    const candidates = visibleLayoutCandidates();

    for (let index = 0; index < candidates.length; index += 1) {
      const first = candidates[index];

      for (const second of candidates.slice(index + 1)) {
        if (
          first.element.contains(second.element) ||
          second.element.contains(first.element) ||
          !rectsOverlap(first.rect, second.rect, overlapTolerance)
        ) {
          continue;
        }

        findings.push({
          label: "obvious overlap",
          detail: `${first.label} overlaps ${second.label}.`,
        });
      }
    }

    function visibleLayoutCandidates(): readonly LayoutCandidate[] {
      const selectors = [
        "header a",
        "footer a",
        "main a",
        "main button",
        "main h1",
        "main h2",
        "main h3",
        "main li",
        "main p",
      ];

      return Array.from(document.querySelectorAll<HTMLElement>(selectors.join(", ")))
        .map((element) => ({
          element,
          label: elementLabel(element),
          rect: element.getBoundingClientRect(),
        }))
        .filter((candidate) => {
          const style = getComputedStyle(candidate.element);

          return (
            candidate.rect.width > 0 &&
            candidate.rect.height > 0 &&
            style.display !== "none" &&
            style.visibility !== "hidden"
          );
        });
    }

    function rectsOverlap(first: DOMRect, second: DOMRect, tolerance: number): boolean {
      const horizontalOverlap =
        Math.min(first.right, second.right) - Math.max(first.left, second.left);
      const verticalOverlap =
        Math.min(first.bottom, second.bottom) - Math.max(first.top, second.top);

      return horizontalOverlap > tolerance && verticalOverlap > tolerance;
    }

    function elementLabel(element: HTMLElement): string {
      const tag = element.tagName.toLowerCase();
      const id = element.id ? `#${element.id}` : "";
      const text = (element.innerText || element.textContent || "").replace(/\s+/g, " ").trim();
      const maybeText = text ? ` "${text.slice(0, 72)}"` : "";

      return `${tag}${id}${maybeText}`;
    }

    return findings;
  });
}

async function firstVisibleLocator(page: Page, selector: string): Promise<Locator> {
  const maybeLocator = await maybeFirstVisibleLocator(page, selector);

  if (!maybeLocator) {
    throw new Error(`Expected a visible reduced-motion hover target for selector ${selector}.`);
  }

  return maybeLocator;
}

async function maybeFirstVisibleLocator(page: Page, selector: string): Promise<Locator | null> {
  const locator = page.locator(selector);
  const count = await locator.count();

  for (let index = 0; index < count; index += 1) {
    const candidate = locator.nth(index);

    if (await candidate.isVisible()) {
      return candidate;
    }
  }

  return null;
}

async function keyboardFocusTargets(page: Page): Promise<readonly FocusSnapshot[]> {
  const targets: FocusSnapshot[] = [];

  for (let index = 0; index < maxKeyboardTabs; index += 1) {
    await page.keyboard.press("Tab");
    const maybeSnapshot = await page.evaluate(() => {
      function elementLabel(element: HTMLElement): string {
        const tag = element.tagName.toLowerCase();
        const text = (element.innerText || element.textContent || "").replace(/\s+/g, " ").trim();
        const maybeText = text ? ` "${text.slice(0, 72)}"` : "";

        return `${tag}${maybeText}`;
      }

      const maybeElement = document.activeElement;

      if (!(maybeElement instanceof HTMLElement) || maybeElement === document.body) {
        return null;
      }

      const rect = maybeElement.getBoundingClientRect();
      const style = getComputedStyle(maybeElement);
      const href = maybeElement instanceof HTMLAnchorElement ? maybeElement.href : null;

      return {
        href,
        label: elementLabel(maybeElement),
        visible:
          rect.width > 0 &&
          rect.height > 0 &&
          style.display !== "none" &&
          style.visibility !== "hidden",
      };
    });

    if (maybeSnapshot) {
      targets.push(maybeSnapshot);
    }
  }

  return targets;
}

function visibleFocusFailures(focusedTargets: readonly FocusSnapshot[]): readonly string[] {
  return focusedTargets
    .filter((target) => !target.visible)
    .map((target) => `${target.label} (${target.href ?? "no href"})`);
}

function hasFocusedInternalPath(
  focusedTargets: readonly FocusSnapshot[],
  expectedPath: string,
): boolean {
  return focusedTargets.some((target) => {
    if (!target.href) {
      return false;
    }

    const url = new URL(target.href);

    return url.origin === "http://127.0.0.1:4173" && url.pathname === expectedPath;
  });
}

function hasFocusedHref(focusedTargets: readonly FocusSnapshot[], expectedHref: string): boolean {
  return focusedTargets.some((target) => target.href === expectedHref);
}

function hasFocusedProjectAnchor(focusedTargets: readonly FocusSnapshot[]): boolean {
  return focusedTargets.some((target) => {
    if (!target.href) {
      return false;
    }

    const url = new URL(target.href);

    return (
      url.origin === "http://127.0.0.1:4173" && url.pathname === "/projects" && url.hash.length > 1
    );
  });
}

function hasFocusedProjectActionLink(focusedTargets: readonly FocusSnapshot[]): boolean {
  return focusedTargets.some((target) => {
    if (!target.href) {
      return false;
    }

    const url = new URL(target.href);

    if (url.origin === "http://127.0.0.1:4173") {
      return false;
    }

    return projectActionLabels.some((label) => target.label.includes(label));
  });
}

function hasFocusedExternalOrigin(
  focusedTargets: readonly FocusSnapshot[],
  expectedOrigin: string,
): boolean {
  return focusedTargets.some((target) => {
    if (!target.href) {
      return false;
    }

    return new URL(target.href).origin === expectedOrigin;
  });
}

async function inlinePointerVars(locator: Locator) {
  return locator.evaluate((element) => {
    const htmlElement = element as HTMLElement;

    return {
      pointerX: htmlElement.style.getPropertyValue("--pointer-x"),
      pointerY: htmlElement.style.getPropertyValue("--pointer-y"),
    };
  });
}
