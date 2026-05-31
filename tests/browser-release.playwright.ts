import AxeBuilder from "@axe-core/playwright";
import { expect, type Locator, type Page, test } from "@playwright/test";
import { prerenderRoutes } from "../src/domain/routes";

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
    expect(hasFocusedInternalPath(focusedTargets, "/contact"), "focus reaches Contact nav").toBe(
      true,
    );
    expect(
      hasFocusedProjectAnchor(focusedTargets),
      "focus reaches at least one project anchor link",
    ).toBe(true);
    expect(
      hasFocusedExternalOrigin(focusedTargets, "https://openlinks.us"),
      "focus reaches OpenLinks collaboration path",
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
    await page.goto("/");
    const hoverTarget = page
      .locator(
        [
          ".interactive-surface",
          ".reactive-card",
          ".surface-link",
          ".focus-row",
          ".story-card",
          ".project-anchor-card",
          ".theme-card",
          ".contact-card",
        ].join(", "),
      )
      .first();
    const reactiveSurface = page.locator(".reactive-surface").first();

    // Act
    await hoverTarget.hover();
    const transform = await hoverTarget.evaluate((element) => getComputedStyle(element).transform);
    const beforePointerVars = await inlinePointerVars(reactiveSurface);
    const box = await reactiveSurface.boundingBox();

    if (!box) {
      throw new Error("Expected .reactive-surface to have a browser-visible bounding box.");
    }

    await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.2);
    await page.waitForTimeout(100);
    const afterPointerVars = await inlinePointerVars(reactiveSurface);

    // Assert
    expect(transform, "reduced-motion hover transform").toBe("none");
    expect(afterPointerVars, "reduced-motion pointer CSS vars").toEqual(beforePointerVars);
  });
});

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
