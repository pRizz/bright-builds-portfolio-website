import { type JSX, onCleanup, onMount } from "solid-js";
import { canRunDecorativeMotion, decorativeMotionMediaQueries } from "./visual-motion";

type ReactiveSurfaceProps = {
  children: JSX.Element;
  class?: string;
};

type NavigatorWithMaybeConnection = Navigator & {
  connection?: {
    saveData?: boolean;
  };
};

export function ReactiveSurface(props: ReactiveSurfaceProps): JSX.Element {
  let maybeElement: HTMLDivElement | undefined;

  onMount(() => {
    const element = maybeElement;

    if (!element) {
      return;
    }

    const maybeSaveData = (navigator as NavigatorWithMaybeConnection).connection?.saveData;
    const canRunMotion = canRunDecorativeMotion({
      prefersReducedMotion: matchMedia(decorativeMotionMediaQueries.reducedMotion).matches,
      hasFinePointer: matchMedia(decorativeMotionMediaQueries.finePointer).matches,
      isLargeViewport: matchMedia(decorativeMotionMediaQueries.largeViewport).matches,
      isPageVisible: document.visibilityState === "visible",
      maybeSaveData,
    });

    if (!canRunMotion) {
      return;
    }

    let maybeFrame: number | null = null;
    let pointerX = 50;
    let pointerY = 50;

    const cancelFrame = () => {
      if (maybeFrame === null) {
        return;
      }

      cancelAnimationFrame(maybeFrame);
      maybeFrame = null;
    };

    const writePointerProperties = () => {
      maybeFrame = null;
      element.style.setProperty("--pointer-x", `${pointerX}%`);
      element.style.setProperty("--pointer-y", `${pointerY}%`);
    };

    const queuePointerWrite = () => {
      if (maybeFrame !== null) {
        return;
      }

      maybeFrame = requestAnimationFrame(writePointerProperties);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();

      if (rect.width <= 0 || rect.height <= 0) {
        return;
      }

      pointerX = clampPercentage(((event.clientX - rect.left) / rect.width) * 100);
      pointerY = clampPercentage(((event.clientY - rect.top) / rect.height) * 100);
      queuePointerWrite();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        return;
      }

      cancelFrame();
    };

    element.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    onCleanup(() => {
      element.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      cancelFrame();
    });
  });

  return (
    <div
      ref={(element) => {
        maybeElement = element;
      }}
      class={`reactive-surface ${props.class ?? ""}`}
    >
      {props.children}
    </div>
  );
}

function clampPercentage(value: number): number {
  if (value < 0) {
    return 0;
  }

  if (value > 100) {
    return 100;
  }

  return value;
}
