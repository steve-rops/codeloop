/**
 * A single "the page is open" signal.
 *
 * Above-the-fold reveals are in view the instant they mount, which on a cold
 * load is while the preloader is still covering them — they would play out
 * behind the panel and be over by the time it lifted. Rather than hard-coding
 * delays that only line up on a first visit (and are wrong on every client-side
 * navigation after it), everything waits on this.
 */
let ready = false;
const waiting = new Set<() => void>();

export function isReady() {
  return ready;
}

export function markReady() {
  if (ready) return;
  ready = true;
  for (const listener of waiting) listener();
  waiting.clear();
}

export function onReady(listener: () => void) {
  if (ready) {
    listener();
    return () => {};
  }

  waiting.add(listener);
  return () => {
    waiting.delete(listener);
  };
}

// Nothing on the page should be able to stay hidden because an opening
// animation failed to report in.
if (typeof window !== "undefined") {
  window.setTimeout(markReady, 4000);
}
