"use client";

import dynamic from "next/dynamic";
import { useMediaQuery } from "../lib/use-media-query";

// Never server-rendered and never fetched on a touch screen: the label is
// pointer-only, so the code for it is as well.
const CursorLabel = dynamic(
  () => import("./cursor-label").then((m) => m.CursorLabel),
  { ssr: false },
);

export function Cursor() {
  const enabled = useMediaQuery("(pointer: fine)");
  return enabled ? <CursorLabel /> : null;
}
