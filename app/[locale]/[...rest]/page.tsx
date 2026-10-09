import { notFound } from "next/navigation";

// Catches every path under a locale that no page claims, so the 404 is the
// localised one in `../not-found.tsx` inside the site's chrome rather than
// Next's bare default. Rendered on demand; there is nothing to prerender.
export default function CatchAll() {
  notFound();
}
