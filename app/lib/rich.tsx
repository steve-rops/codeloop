import type { ReactNode } from "react";

/**
 * Shared rich-text tags for `t.rich(...)`.
 *
 * The copy carries its own emphasis — `<i>` marks the single word in a line
 * that drops into the serif — so translators can move that word to wherever it
 * falls naturally in their language instead of it being pinned to a position by
 * the JSX.
 */
export const italic = {
  i: (chunks: ReactNode) => <span className="t-italic">{chunks}</span>,
};
