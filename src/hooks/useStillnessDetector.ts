import { useEffect, useRef } from "react";

export const useStillnessDetector = (
  onStillness: () => void,
  onMovement: () => void,
  timeoutMs: number = 25000
) => {
  const stillTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isStillRef = useRef(false);
  const suppressUntilRef = useRef<number>(0);

  useEffect(() => {
    let isMounted = true;

    const startStillnessTimer = () => {
      // Clear any existing timer
      if (stillTimeoutRef.current) {
        clearTimeout(stillTimeoutRef.current);
      }

      // Set a new timer for stillness
      stillTimeoutRef.current = setTimeout(() => {
        if (isMounted && !isStillRef.current) {
          isStillRef.current = true;
          suppressUntilRef.current = Date.now() + 2000; // longer grace period to ignore synthetic activity
          console.log("[Stillness] 25 seconds of inactivity detected!");
          onStillness();
        }
      }, timeoutMs);
    };

    // Start the initial timer
    startStillnessTimer();

    // Activity listeners
    const handleActivity = (type: string) => {
      if (suppressUntilRef.current && Date.now() < suppressUntilRef.current) {
        // Ignore synthetic or immediate activity right after activation
        return;
      }
      if (isStillRef.current) {
        console.log(`[Stillness] activity while still: ${type}`);
        // Transition out of stillness only on real activity
        onMovement();
        isStillRef.current = false;
      }
      startStillnessTimer();
    };
    const handleMouseMove = () => handleActivity("mousemove");
    const handleKeyDown = () => handleActivity("keydown");
    const handleClick = () => handleActivity("click");
    const handleTouchMove = () => handleActivity("touchmove");
    // Reduce noisy events that may cause premature dismissal

    // Add listeners
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("keydown", handleKeyDown, { passive: true });
    window.addEventListener("click", handleClick, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    // Removed pointermove and wheel listeners to avoid synthetic noise

    // Cleanup
    return () => {
      isMounted = false;
      if (stillTimeoutRef.current) {
        clearTimeout(stillTimeoutRef.current);
      }
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("touchmove", handleTouchMove);
      // No pointermove/wheel to remove (not added)
    };
  }, [onStillness, onMovement, timeoutMs]);
};
