import type { CSSProperties } from "react";

/**
 * Stagger offsets for the reveal primitives.
 *
 * These are plain functions rather than part of the `Reveal` client component
 * because most of what they style is server-rendered — a server component
 * cannot call across the client boundary, and there is no reason for arithmetic
 * over two numbers to ship to the browser at all.
 */

/**
 * Per-item offset for a staggered group. 0.05s is tight enough to read as one
 * movement with a ripple through it rather than as a queue of separate ones.
 */
export function stagger(index: number, step = 0.05, base = 0): CSSProperties {
  return { "--d": `${(base + index * step).toFixed(3)}s` } as CSSProperties;
}

/** Fixed offset, for elements that wait on something rather than on a sibling. */
export function delay(seconds: number): CSSProperties {
  return { "--d": `${seconds}s` } as CSSProperties;
}
