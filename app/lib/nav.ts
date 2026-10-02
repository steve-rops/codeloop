import { PROJECTS } from "./projects";

export type NavLink = {
  href: string;
  /** Key under the `nav` namespace that holds this link's label. */
  label: "services" | "work" | "contact";
  // Path prefix that marks this link as the current page. Hash links point at a
  // section of "/", so their match never fires — that's intentional. Written
  // without a locale prefix, because `usePathname` from `i18n/navigation`
  // hands back the path with the locale already stripped.
  match: string;
  // Rendered as a superscript tally beside the label, so the nav says how much
  // is behind each link rather than just naming it.
  count?: number;
};

export const NAV_LINKS: NavLink[] = [
  { href: "/#services", label: "services", match: "/services" },
  { href: "/work", label: "work", match: "/work", count: PROJECTS.length },
  { href: "/contact", label: "contact", match: "/contact" },
];
