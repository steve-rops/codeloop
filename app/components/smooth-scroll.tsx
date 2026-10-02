"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";

/**
 * Lenis holds its own scroll position independently of the document, so a
 * client-side route change has to be told to reset — otherwise the incoming
 * page opens partway down the outgoing one's scroll.
 */
function ResetOnNavigate() {
  const lenis = useLenis();
  const pathname = usePathname();

  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true });
  }, [lenis, pathname]);

  return null;
}

/**
 * Inertial scrolling for the whole document.
 *
 * The reveal animations are tuned against this: their 1.5s easings read as
 * deliberate under Lenis's glide and as sluggish under a raw wheel event, so
 * the two are a pair rather than independent choices. Lenis honours
 * `prefers-reduced-motion` on its own (it drops to a 1:1 lerp), and `anchors`
 * lets it own in-page jumps rather than leaving native `scroll-behavior` to
 * fight it over the same gesture.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.1,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        // Touch devices already have inertia in hardware; smoothing it a second
        // time makes the page feel detached from the finger.
        syncTouch: false,
        anchors: { offset: -60 },
      }}
    >
      <ResetOnNavigate />
      {children}
    </ReactLenis>
  );
}
