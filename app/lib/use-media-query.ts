"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Subscribes to a media query without a state-setting effect.
 *
 * The server has no viewport to measure, so it always reports `false` and the
 * real answer arrives on the first client render — which `useSyncExternalStore`
 * reconciles without a hydration mismatch, and without the extra render pass an
 * effect-plus-setState would cost.
 */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
