"use client";

import { useLenis } from "lenis/react";
import { useEffect, useState } from "react";
import { markReady } from "../lib/ready";
import { useMediaQuery } from "../lib/use-media-query";
import { LoopMark } from "./loop-mark";

/** How long the counter takes to run, before any wait on real assets. */
const COUNT_MS = 1000;
/** Matches the clip-path wipe below; the panel unmounts once it has cleared. */
const WIPE_MS = 750;

/**
 * First-load panel: a counter runs to 100, then the whole sheet clips upward off
 * the screen rather than fading, so the page underneath is uncovered by a moving
 * edge. The hero's own delays are set to start under the tail of that wipe,
 * which is what makes the two read as one continuous opening rather than as a
 * loading screen followed by a page.
 */
export function Preloader() {
  const [progress, setProgress] = useState(0);
  const [wiping, setWiping] = useState(false);
  const [done, setDone] = useState(false);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const lenis = useLenis();

  useEffect(() => {
    // Nothing to open if the opening is not going to move; release the page
    // immediately so the reveals it gates are not left waiting.
    if (reduced) {
      markReady();
      return;
    }

    let frame = 0;
    let assetsReady = false;
    const started = performance.now();

    const loaded =
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            window.addEventListener("load", () => resolve(), { once: true });
          });

    void Promise.all([document.fonts.ready, loaded]).then(() => {
      assetsReady = true;
    });

    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / COUNT_MS);
      const eased = 1 - Math.pow(1 - t, 3);
      // The counter stalls just short of 100 until the page is genuinely ready,
      // so it never claims to be finished while a font is still swapping.
      const value = assetsReady ? eased * 100 : Math.min(eased * 100, 96);

      setProgress(Math.round(value));

      if (value >= 100) {
        setWiping(true);
        return;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduced]);

  // Scrolling while the panel is up would land you mid-page with the hero
  // reveal already spent.
  useEffect(() => {
    if (!lenis) return;
    if (reduced || done || wiping) lenis.start();
    else lenis.stop();
  }, [lenis, reduced, done, wiping]);

  useEffect(() => {
    if (!wiping) return;

    // Released as the wipe *starts*, not when it ends: the hero should already
    // be climbing into place as the panel clears it, so the two read as one
    // movement instead of a handoff.
    markReady();

    const timer = window.setTimeout(() => setDone(true), WIPE_MS);
    return () => window.clearTimeout(timer);
  }, [wiping]);

  if (reduced || done) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[999] flex items-center justify-center bg-sage transition-[clip-path] duration-750 ease-inout"
      style={{ clipPath: wiping ? "inset(0 0 100% 0)" : "inset(0 0 0 0)" }}
    >
      <div className="flex items-center select-none">
        <LoopMark id="preloader" />
        <span className="t-xs ml-1 tracking-[-0.4px]">codeloop</span>

        {/* Ink on a faint track: a light bar on this ground would read as an
            empty rule rather than as progress. */}
        <span className="bg-ink/20 mx-3 h-px w-16 overflow-hidden">
          <span
            className="bg-ink block h-px origin-left"
            style={{ transform: `scaleX(${progress / 100})` }}
          />
        </span>

        <span className="block h-4 w-11 overflow-hidden">
          <span className="t-xs block h-4 tabular-nums">{progress}</span>
        </span>
      </div>
    </div>
  );
}
