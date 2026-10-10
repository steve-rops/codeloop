import type { Locale } from "@/i18n/routing";

// Structure only. Everything a reader sees — the client's name, titles,
// summaries, the write-ups, tags, and the result labels and figures — lives in
// `messages/*.json` under `projects.<slug>`, because all of it needs to exist in
// both languages. What can't go in a catalogue (links, screenshots) is keyed by
// locale here instead.
export type Category = "ecommerce" | "saas" | "brand" | "webapp";

/** One screenshot of an internal tool. The caption lives in the catalogues
 * under `projects.<slug>.system.screens.<id>`. */
export type Screen = {
  id: string;
  /** Shot under `public/`, taken of the app in each language. Until one is
   * taken the slot shows a plate, so the section can ship before the shots. */
  image?: Record<Locale, string>;
};

export type Project = {
  slug: string;
  year: number;
  category: Category;
  /** Product names, likewise left untranslated. */
  stack: string[];
  /** The live site in each language, linked from the case study. */
  url?: Record<Locale, string>;
  /** Cover shot under `public/`, taken of the site in each language. Without
   * one the card falls back to a plate. */
  image?: Record<Locale, string>;
  /** Set while the build is still in progress: the card and the case study
   * carry an "under development" mark, and the results section, which has
   * nothing honest to report yet, is left out. */
  status?: "development";
  /** A second phase shipped later under the same domain, such as an internal
   * tool the client runs the business from. Its write-up lives under
   * `projects.<slug>.system` in both catalogues; only the screenshots are keyed
   * here. The case study gets an extra numbered section when this is set. */
  system?: { screens: Screen[] };
};

// Shipped work. Add new case studies here and under `projects.<slug>` in both
// message catalogues; the nav count, the work grid and the "next project" loop
// all derive from this list.
export const PROJECTS: Project[] = [
  {
    // https://www.marvelcarsrentals.gr — luxury car rental, Athens Riviera.
    slug: "Marvelcars",
    year: 2025,
    category: "webapp",
    stack: ["Next.js", "Sanity CMS", "Supabase", "TypeScript", "Tailwind", "GitHub"],
    url: {
      en: "https://www.marvelcarsrentals.gr/en",
      el: "https://www.marvelcarsrentals.gr/el",
    },
    image: {
      en: "/work/marvelcars-en.webp",
      el: "/work/marvelcars-en.webp",
    },
    // The booking management system the team runs the fleet from, added
    // after launch under the same domain. One shot, a collage of the app's
    // screens; the tool is Greek-only, so both locales share it.
    system: {
      screens: [
        {
          id: "overview",
          image: {
            en: "/work/marvelcars-booking-el.webp",
            el: "/work/marvelcars-booking-el.webp",
          },
        },
      ],
    },
  },
  {
    // https://s-karatheodoris.gr — cultural association of Nea Vyssa, Evros.
    slug: "Karatheodoris",
    year: 2025,
    category: "webapp",
    stack: ["Next.js", "Sanity CMS", "TypeScript", "Tailwind", "GitHub"],
    url: {
      en: "https://s-karatheodoris.gr/en",
      el: "https://s-karatheodoris.gr",
    },
    image: {
      en: "/work/karatheodoris-en.webp",
      el: "/work/karatheodoris-el.webp",
    },
  },
  {
    // https://dkexecutive.com — luxury chauffeured transfers and tours, Athens.
    slug: "DKExecutive",
    year: 2026,
    category: "webapp",
    stack: ["Next.js", "TypeScript", "Tailwind", "Google Maps API", "GitHub"],
    url: {
      en: "https://dkexecutive.com/en",
      el: "https://dkexecutive.com/el",
    },
    image: {
      en: "/work/dkexecutive-en.webp",
      el: "/work/dkexecutive-en.webp",
    },
  },
  {
    // https://www.principal-catering.gr — wedding hall and catering, Orestiada, Evros.
    slug: "Principal",
    year: 2025,
    category: "webapp",
    stack: ["Next.js", "TypeScript", "Tailwind", "GitHub"],
    url: {
      en: "https://www.principal-catering.gr/en",
      el: "https://www.principal-catering.gr/el",
    },
    image: {
      en: "/work/principal-en.webp",
      el: "/work/principal-en.webp",
    },
  },
  {
    // https://evresis.vercel.app — real estate agency, Orestiada, Evros.
    // Preview deployment; swap the URLs for the client's domain at launch and
    // add `results` to both catalogues when dropping `status`.
    slug: "Evresis",
    year: 2026,
    category: "webapp",
    stack: ["Next.js", "Sanity CMS", "TypeScript", "Tailwind", "Mapbox", "GitHub"],
    url: {
      en: "https://evresis.vercel.app/en",
      el: "https://evresis.vercel.app/el",
    },
    image: {
      en: "/work/evresis-en.webp",
      el: "/work/evresis-en.webp",
    },
    status: "development",
  },
];

export function getProject(slug: string) {
  return PROJECTS.find((project) => project.slug === slug);
}
