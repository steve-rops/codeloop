import { PROJECTS } from "./projects";

export type NavLink = {
  href: string;
  /** Key under the `nav` namespace that holds this link's label. */
  label: "services" | "work" | "about" | "contact";
  // Path prefix that marks this link as the current page. Written without a
  // locale prefix, because `usePathname` from `i18n/navigation` hands back the
  // path with the locale already stripped.
  match: string;
  // Rendered as a superscript tally beside the label, so the nav says how much
  // is behind each link rather than just naming it.
  count?: number;
};

// Every page a visitor can reach from the header. The footer repeats the same
// list, so each page has at least two internal links pointing at it.
export const NAV_LINKS: NavLink[] = [
  { href: "/services", label: "services", match: "/services" },
  { href: "/work", label: "work", match: "/work", count: PROJECTS.length },
  { href: "/about", label: "about", match: "/about" },
  { href: "/contact", label: "contact", match: "/contact" },
];
