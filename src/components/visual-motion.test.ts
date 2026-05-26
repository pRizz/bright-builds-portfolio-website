import { describe, expect, it } from "vitest";
import { canRunDecorativeMotion, decorativeMotionMediaQueries } from "./visual-motion";

const enabledInput = {
  prefersReducedMotion: false,
  hasFinePointer: true,
  isLargeViewport: true,
  isPageVisible: true,
  maybeSaveData: false,
};

describe("decorative motion gate", () => {
  it("allows decorative motion only when every capability gate is enabled", () => {
    // Arrange
    const input = enabledInput;

    // Act
    const canRun = canRunDecorativeMotion(input);

    // Assert
    expect(canRun).toBe(true);
  });

  it.each([
    ["reduced motion", { prefersReducedMotion: true }],
    ["coarse pointer", { hasFinePointer: false }],
    ["small viewport", { isLargeViewport: false }],
    ["hidden tab", { isPageVisible: false }],
    ["save-data", { maybeSaveData: true }],
  ])("blocks decorative motion for %s", (_condition, override) => {
    // Arrange
    const input = { ...enabledInput, ...override };

    // Act
    const canRun = canRunDecorativeMotion(input);

    // Assert
    expect(canRun).toBe(false);
  });

  it("exposes exact media queries for browser capability checks", () => {
    // Arrange
    const expectedQueries = {
      reducedMotion: "(prefers-reduced-motion: reduce)",
      finePointer: "(pointer: fine)",
      largeViewport: "(min-width: 641px)",
    };

    // Act
    const queries = decorativeMotionMediaQueries;

    // Assert
    expect(queries).toEqual(expectedQueries);
  });
});
