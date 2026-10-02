"use client";

import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "../lib/use-media-query";

/**
 * A label that rides the pointer, naming what a hover will do.
 *
 * Elements opt in with `data-cursor="View"`. Position is written straight to
 * the node's transform in the listener rather than through state, because
 * routing every mousemove through a render makes the label lag the pointer by a
 * frame or two — which is exactly the thing you notice.
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  // Pointer labels are meaningless without a pointer, and on touch they would
  // just be a box stuck in a corner.
  const enabled = useMediaQuery("(pointer: fine)");

  useEffect(() => {
    if (!enabled) return;

    const onMove = (event: PointerEvent) => {
      const node = ref.current;
      if (node) {
        node.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      }

      const target = event.target as Element | null;
      const host = target?.closest<HTMLElement>("[data-cursor]");
      setLabel(host?.dataset.cursor ?? null);
    };

    const onLeave = () => setLabel(null);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none fixed top-0 left-0 z-[1000] border border-ink bg-dark px-1.5 pt-[3px] pb-1 text-paper transition-opacity duration-300 ease-linear ${
        label ? "opacity-100" : "opacity-0"
      }`}
    >
      <span className="mask">
        <span className="t-xs block">{label ?? ""}</span>
      </span>
    </div>
  );
}
