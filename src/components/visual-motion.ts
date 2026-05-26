export type DecorativeMotionGateInput = {
  prefersReducedMotion: boolean;
  hasFinePointer: boolean;
  isLargeViewport: boolean;
  isPageVisible: boolean;
  maybeSaveData?: boolean;
};

export const decorativeMotionMediaQueries = {
  reducedMotion: "(prefers-reduced-motion: reduce)",
  finePointer: "(pointer: fine)",
  largeViewport: "(min-width: 641px)",
} as const;

export function canRunDecorativeMotion(input: DecorativeMotionGateInput): boolean {
  return (
    !input.prefersReducedMotion &&
    input.hasFinePointer &&
    input.isLargeViewport &&
    input.isPageVisible &&
    input.maybeSaveData !== true
  );
}
