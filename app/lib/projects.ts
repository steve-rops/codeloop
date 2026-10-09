import type { Locale } from "@/i18n/routing";

// Structure only. Everything a reader sees — the client's name, titles,
// summaries, the write-ups, tags, and the result labels and figures — lives in
// `messages/*.json` under `projects.<slug>`, because all of it needs to exist in
// both languages. What can't go in a catalogue (links, screenshots) is keyed by
// locale here instead.
export type Category = "ecommerce" | "saas" | "brand" | "webapp";

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
    stack: ["Next.js", "Sanity CMS", "TypeScript", "Tailwind", "GitHub"],
    url: {
      en: "https://www.marvelcarsrentals.gr/en",
      el: "https://www.marvelcarsrentals.gr/el",
    },
    image: {
      en: "/work/marvelcars-en.webp",
      el: "/work/marvelcars-en.webp",
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
