"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { onReady } from "../lib/ready";

/** Same break as the hero scrim: below it the copy runs the full width. */
const NARROW = "(max-width: 914px)";

const FOOTAGE = {
  /** 960px wide, lower bitrate: a phone shows a centre crop of this anyway. */
  narrow: "/code-loop-bg-720.mp4",
  wide: "/code-loop-bg.mp4",
};

/**
 * Full-bleed footage behind the opening copy.
 *
 * The first frame is served as a real image rather than as the video's poster:
 * it is the page's largest contentful paint, so it gets a responsive srcset
 * and a preload hint in the head, neither of which a `poster` attribute can
 * carry. The footage itself has no `src` until the opening sequence releases
 * the page — before that it would only be competing with the fonts and
 * scripts for the connection, under a panel nobody can see through. Once it
 * is actually playing it fades up over the still, which is the same picture.
 *
 * Muted + inline is what buys autoplay on iOS; the footage carries no
 * information, so it stays out of the accessibility tree and the tab order.
 */
export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(
    () =>
      onReady(() => {
        const video = ref.current;
        if (!video) return;
        video.src = window.matchMedia(NARROW).matches
          ? FOOTAGE.narrow
          : FOOTAGE.wide;
        // Autoplay can be refused (data saver, battery mode); the still stays.
        video.play().catch(() => {});
      }),
    [],
  );

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
      <Image
        src="/code-loop-poster.jpg"
        alt=""
        fill
        sizes="100vw"
        preload
        className="object-cover"
      />
      <video
        ref={ref}
        preload="none"
        loop
        muted
        playsInline
        tabIndex={-1}
        onPlaying={() => setPlaying(true)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          playing ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
