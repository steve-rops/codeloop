"use client";

import { useEffect, useRef, useState } from "react";

const LOOP_TEXT =
  '</> {} () => const loop = () => { return <Code /> }; import { useLoop } from "codeloop"; npm install codeloop ⚡ ⌘ ';

const LOOP_PATH =
  "M 100 50 C 130 5, 190 5, 190 50 C 190 95, 130 95, 100 50 C 70 5, 10 5, 10 50 C 10 95, 70 95, 100 50 Z";

/** Drift speed of the snippet along the path, in viewBox units per second. */
const SPEED = 12;

const TEXT_PROPS = {
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  fontSize: 4.4,
  fill: "url(#loop-fill-hero)",
  fontWeight: 600,
  letterSpacing: 0.3,
} as const;

type Metrics = { tile: number; copies: number };

/**
 * Decorative loop that carries the code snippet endlessly around its own path.
 *
 * The studio's one piece of surviving iconography, moved onto the dark band
 * where it has room to run. It is the only place the cyan/violet accent appears
 * at any size, which is what keeps it a signature rather than a theme.
 */
export function HeroLoop() {
  const rulerRef = useRef<SVGTextElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  // The snippet only scrolls seamlessly if it slides by exactly one repetition,
  // so measure the rendered width of a single copy rather than guessing it from
  // font metrics (the emoji don't share the monospace advance).
  useEffect(() => {
    let cancelled = false;

    const measure = () => {
      const ruler = rulerRef.current;
      const path = pathRef.current;
      if (cancelled || !ruler || !path) return;

      const tile = ruler.getComputedTextLength();
      if (!tile) return;

      // Cover the visible path plus the one tile the animation slides through,
      // so the tail of the string never opens a gap.
      const copies = Math.ceil(path.getTotalLength() / tile) + 2;
      setMetrics({ tile, copies });
    };

    measure();
    // Advances change when the web font swaps in over the fallback.
    document.fonts.ready.then(measure);

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const animated = metrics !== null && !reducedMotion;

  return (
    <svg
      viewBox="0 0 200 100"
      width="980"
      height="490"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-1 m-auto h-auto w-[74%] max-w-none opacity-95 max-md:w-[124%]"
    >
      <defs>
        <path ref={pathRef} id="loop-path-hero" fill="none" d={LOOP_PATH} />
        <linearGradient id="loop-fill-hero" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>
      </defs>
      <use
        href="#loop-path-hero"
        fill="none"
        stroke="url(#loop-fill-hero)"
        strokeOpacity="0.3"
        strokeWidth="1.2"
      />
      {/* Off-path copy used purely to measure one repetition. */}
      <text ref={rulerRef} visibility="hidden" {...TEXT_PROPS}>
        {LOOP_TEXT}
      </text>
      <text {...TEXT_PROPS}>
        <textPath
          href="#loop-path-hero"
          startOffset={animated ? -metrics.tile : 0}
        >
          {LOOP_TEXT.repeat(metrics?.copies ?? 2)}
          {animated ? (
            <animate
              attributeName="startOffset"
              from={-metrics.tile}
              to={0}
              dur={`${metrics.tile / SPEED}s`}
              repeatCount="indefinite"
            />
          ) : null}
        </textPath>
      </text>
    </svg>
  );
}
