"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LoopMark } from "./loop-mark";

type Phase = "idle" | "covering" | "clearing";

/** The panel must finish covering before the new page is allowed to show. */
const MIN_COVER_MS = 650;
/** Length of the clip-and-slide in each direction — matches the CSS below. */
const SLIDE_MS = 1000;
/** If a navigation never lands, the panel gets out of the way regardless. */
const STUCK_MS = 3000;

/**
 * Full-screen panel that slides up over the outgoing page and keeps going,
 * peeling off the top to expose the incoming one.
 *
 * The two halves are asymmetric on purpose: covering is a pure slide (the clip
 * snaps open with no transition, so the panel arrives as a solid sheet), while
 * clearing animates the clip and the transform together, so the panel appears
 * to be pulled off rather than to simply leave.
 */
export function PageTransition() {
  const [phase, setPhase] = useState<Phase>("idle");
  const pathname = usePathname();
  const previousPath = useRef(pathname);
  const coverStarted = useRef(0);

  // Links navigate normally; we only need to know a navigation began. Capture
  // phase so we still hear the click if something downstream stops propagation.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;

      const anchor = (event.target as Element | null)?.closest("a");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download"))
        return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      // In-page anchors and re-clicks of the current route never change the
      // pathname, so the panel would cover and have nothing to wait for.
      if (url.pathname === window.location.pathname) return;

      coverStarted.current = performance.now();
      setPhase("covering");
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    if (pathname === previousPath.current) return;
    previousPath.current = pathname;

    if (phase !== "covering") return;

    // A fast navigation can land before the panel has finished arriving; hold
    // it there for the remainder rather than cutting the slide in half.
    const elapsed = performance.now() - coverStarted.current;
    const hold = Math.max(0, MIN_COVER_MS - elapsed);

    const timer = window.setTimeout(() => setPhase("clearing"), hold);
    return () => window.clearTimeout(timer);
  }, [pathname, phase]);

  useEffect(() => {
    if (phase === "idle") return;

    const timer = window.setTimeout(
      () => setPhase("idle"),
      phase === "clearing" ? SLIDE_MS : STUCK_MS,
    );

    return () => window.clearTimeout(timer);
  }, [phase]);

  return (
    <div
      aria-hidden="true"
      data-phase={phase}
      className="page-transition theme-dark pointer-events-none fixed inset-0 z-[998] flex items-center justify-center"
    >
      <LoopMark id="transition" />
    </div>
  );
}
