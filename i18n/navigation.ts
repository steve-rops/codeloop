import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Locale-aware replacements for the `next/link` and `next/navigation` exports.
 * Import these instead of the Next.js originals: they prefix hrefs with the
 * active locale on the way out, and strip it from `usePathname` on the way in,
 * so route matching stays written in plain paths ("/work", not "/en/work").
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
