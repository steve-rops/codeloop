import Image from "next/image";
import type { CSSProperties } from "react";

/**
 * Stand-in artwork.
 *
 * The reveal animations are built around images, so the layout needs something
 * with real weight in those slots to be judged honestly — a grey box would make
 * every `fadeRotate` look like a bug. These are drawn from the site palette so
 * the placeholders read as a deliberate treatment rather than as missing
 * assets, and each one is picked deterministically from its seed so a project
 * keeps the same plate across renders and routes.
 */
const PLATES: CSSProperties[] = [
  // Sand duotone cut by a hard diagonal band.
  {
    backgroundColor: "#b6b1a6",
    backgroundImage: [
      "linear-gradient(118deg, transparent 0 37%, rgba(42,42,42,0.9) 37% 45%, transparent 45%)",
      "radial-gradient(95% 85% at 18% 12%, #ece7de 0%, #b6b1a6 58%, #77766d 100%)",
    ].join(","),
  },
  // A single sand disc held against near-black.
  {
    backgroundColor: "#161616",
    backgroundImage: [
      "radial-gradient(circle at 63% 46%, #ccc4b9 0 21%, transparent 21.5%)",
      "linear-gradient(200deg, #121212 0%, #313130 100%)",
    ].join(","),
  },
  // Ruled paper with a dark wedge driven in from the right.
  {
    backgroundColor: "#e4dfd6",
    backgroundImage: [
      "linear-gradient(253deg, rgba(30,30,30,0.94) 0 28%, transparent 28%)",
      "repeating-linear-gradient(0deg, rgba(42,42,42,0.12) 0 1px, transparent 1px 13px)",
      "linear-gradient(180deg, #fbfaf8 0%, #d8d2c8 100%)",
    ].join(","),
  },
  // The one plate carrying the studio's accent, for slots on dark ground.
  {
    backgroundColor: "#101014",
    backgroundImage: [
      "radial-gradient(58% 70% at 78% 20%, rgba(34,211,238,0.55) 0%, rgba(34,211,238,0) 62%)",
      "radial-gradient(64% 74% at 16% 84%, rgba(192,132,252,0.5) 0%, rgba(192,132,252,0) 64%)",
      "linear-gradient(160deg, #0e0e12 0%, #26262b 100%)",
    ].join(","),
  },
  // Sage, ringed like a contour map.
  {
    backgroundColor: "#9aa197",
    backgroundImage: [
      "repeating-radial-gradient(circle at 70% 38%, rgba(28,28,28,0.22) 0 1px, transparent 1px 21px)",
      "linear-gradient(215deg, #d6d0c6 0%, #9aa197 52%, #4e5b52 100%)",
    ].join(","),
  },
  // Warm grey split by a shaft of light.
  {
    backgroundColor: "#8e8d86",
    backgroundImage: [
      "linear-gradient(90deg, transparent 0 57%, rgba(250,250,250,0.72) 57% 67%, transparent 67%)",
      "linear-gradient(135deg, #c2beb5 0%, #8e8d86 48%, #3f3f3c 100%)",
    ].join(","),
  },
];

/** Stable index from a seed, so a project's plate never shuffles between pages. */
function plateFor(seed: string): CSSProperties {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }
  return PLATES[hash % PLATES.length];
}

type MediaProps = {
  seed: string;
  /** Utility classes for the mask — this is where the slot's height belongs. */
  className?: string;
  /** Which reveal the artwork runs. Images cant in; some panels rise instead. */
  motion?: "rotate" | "rise";
  /**
   * Pins a specific plate instead of deriving one. Only for slots where
   * something is layered on top and the contrast has to be known in advance.
   */
  plate?: number;
  style?: CSSProperties;
  /** Real artwork. When set it replaces the plate but keeps the same reveal. */
  src?: string;
  alt?: string;
  /** Rendered width hint for `next/image`, so the srcset isn't sized to 100vw. */
  sizes?: string;
  /** For the one image that is the page's main visual. */
  preload?: boolean;
};

export function Media({
  seed,
  className = "",
  motion = "rotate",
  plate,
  style,
  src,
  alt = "",
  sizes = "100vw",
  preload = false,
}: MediaProps) {
  const reveal = motion === "rotate" ? "a-fade-rotate" : "a-up-img";

  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      {src ? (
        <div className={`relative h-full w-full ${reveal}`}>
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            preload={preload}
            className="object-cover object-top"
          />
        </div>
      ) : (
        <div
          aria-hidden="true"
          className={`h-full w-full ${reveal}`}
          style={plate === undefined ? plateFor(seed) : PLATES[plate % PLATES.length]}
        />
      )}
    </div>
  );
}
