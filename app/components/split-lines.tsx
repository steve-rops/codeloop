"use client";

import SplitType from "split-type";
import { useEffect, useRef, type ElementType, type ReactNode } from "react";

type SplitLinesProps = {
  as?: ElementType;
  className?: string;
  /** Seconds before the first line moves — used to sit behind the preloader. */
  base?: number;
  /** Seconds between consecutive lines. */
  step?: number;
  children: ReactNode;
};

/**
 * Headline that reveals a line at a time, each one rising out of its own mask.
 *
 * The split has to happen in the browser because line breaks depend on the
 * measured width, and it has to happen *after* the webfont swaps in or the
 * breaks get computed against the fallback's metrics and shift under the mask.
 * Must be rendered inside a `<Reveal>`; that's what starts the motion.
 */
export function SplitLines({
  as: Tag = "span",
  className = "",
  base = 0,
  step = 0.08,
  children,
}: SplitLinesProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let split: SplitType | null = null;

    const build = () => {
      if (cancelled) return;

      split = new SplitType(el, { types: "lines", tagName: "span" });

      split.lines?.forEach((line, index) => {
        // SplitType gives us the lines; the mask around each one is ours, and
        // it's what turns a fade into text climbing into place.
        const mask = document.createElement("span");
        mask.className = "mask";
        line.replaceWith(mask);
        mask.appendChild(line);

        line.classList.add("a-up");
        line.style.setProperty("--d", `${(base + index * step).toFixed(3)}s`);
      });
    };

    const teardown = () => {
      // Reverting restores the original markup wholesale, which takes our mask
      // wrappers with it — they live inside the element being restored.
      split?.revert();
      split = null;
    };

    void document.fonts.ready.then(build);

    let timer: number | undefined;
    const onResize = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        teardown();
        // Once the reveal has played, the split has no job left, and
        // re-running it would replay the animation mid-resize. Leave the text
        // plain so it just reflows.
        if (!el.closest(".is-inview")) build();
      }, 200);
    };

    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.removeEventListener("resize", onResize);
      teardown();
    };
  }, [base, step]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
