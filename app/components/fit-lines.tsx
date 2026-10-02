"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type FitLinesProps = {
  className?: string;
  /** Classes for the ground drawn behind each line (tint, blur). */
  groundClassName?: string;
  children: ReactNode;
};

type Strip = { top: number; height: number; width: number };

/**
 * A ground that hugs each line of its text.
 *
 * A background on the block itself is one rectangle: once the text wraps, it
 * runs as wide as the longest line, so a short line sits on a ground reaching
 * well past its last word. Nothing in CSS draws a block's background per
 * line, so this measures where the browser broke the text and lays one strip
 * behind each line, ending where that line's type ends.
 */
export function FitLines({
  className = "",
  groundClassName = "",
  children,
}: FitLinesProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [strips, setStrips] = useState<Strip[]>([]);

  useEffect(() => {
    const el = ref.current;
    const text = textRef.current;
    if (!el || !text) return;

    const fit = () => {
      // Text nodes only: a range over the whole subtree also reports the
      // boxes of the elements inside it, and a block child's box is the full
      // width of the container, not the width of its type.
      const range = document.createRange();
      const walker = document.createTreeWalker(text, NodeFilter.SHOW_TEXT);
      const rects: DOMRect[] = [];
      while (walker.nextNode()) {
        range.selectNodeContents(walker.currentNode);
        for (const r of range.getClientRects()) {
          if (r.width > 0) rects.push(r);
        }
      }
      rects.sort((a, b) => a.top - b.top);
      if (!rects.length) return setStrips([]);

      // Group fragments into lines by their top. The children may be mid
      // reveal (translated vertically), so only positions relative to each
      // other are trusted; the bands themselves come from the block's height.
      const left = el.getBoundingClientRect().left;
      const rights: number[] = [];
      let lineTop = -Infinity;
      for (const r of rects) {
        if (r.top - lineTop > r.height / 2) {
          lineTop = r.top;
          rights.push(r.right);
        } else {
          rights[rights.length - 1] = Math.max(rights[rights.length - 1], r.right);
        }
      }

      // Rounded so neighbouring strips share an edge rather than overlapping
      // or leaving a hairline between them.
      const lineH = el.clientHeight / rights.length;
      setStrips(
        rights.map((right, i) => {
          const top = Math.round(i * lineH);
          return {
            top,
            height: Math.round((i + 1) * lineH) - top,
            width: Math.ceil(right - left),
          };
        }),
      );
    };

    const observer = new ResizeObserver(fit);
    observer.observe(el);
    void document.fonts.ready.then(fit);

    return () => observer.disconnect();
  }, []);

  return (
    <span ref={ref} className={`relative ${className}`}>
      {strips.map((s, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`absolute left-0 ${groundClassName}`}
          style={{ top: s.top, height: s.height, width: s.width }}
        />
      ))}
      {/* Positioned so it paints over the strips that come before it. */}
      <span ref={textRef} className="relative block">
        {children}
      </span>
    </span>
  );
}
