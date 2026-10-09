import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { SITE_NAME, SITE_URL } from "./site";

const OG_LOCALES: Record<Locale, string> = { en: "en_US", el: "el_GR" };

/** Absolute URL of a page, from its locale and its unprefixed path ("/work"). */
export function pageUrl(locale: string, path = "") {
  return `${SITE_URL}/${locale}${path}`;
}

/** The same page in every language, keyed by hreflang, plus `x-default`. */
export function languageAlternates(path = "") {
  return {
    ...Object.fromEntries(
      routing.locales.map((locale) => [locale, pageUrl(locale, path)]),
    ),
    "x-default": pageUrl(routing.defaultLocale, path),
  };
}

// Stable identifiers for the entities every page's structured data points
// back at, so a crawler sees one studio and one site rather than a copy per page.
export const STUDIO_ID = `${SITE_URL}/#studio`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const FOUNDER_ID = `${SITE_URL}/#founder`;

/**
 * Everything a page's `generateMetadata` returns: the title and description,
 * a canonical with its hreflang alternates, and the share card. Next replaces
 * `openGraph` and `twitter` wholesale between segments rather than merging
 * them, so each page builds the full objects here instead of inheriting half.
 *
 * `title` is the page's own name; the studio's is appended to it everywhere
 * except the home page, whose title in the catalogue already leads with it.
 * Without `image` the card falls back to `app/[locale]/opengraph-image.tsx`.
 */
export function pageMetadata({
  locale,
  path = "",
  title,
  description,
  image,
}: {
  locale: string;
  path?: string;
  title: string;
  description: string;
  image?: { url: string; alt: string };
}): Metadata {
  const url = pageUrl(locale, path);
  const fullTitle = path === "" ? title : `${title} — ${SITE_NAME}`;

  return {
    title: fullTitle,
    description,
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      url,
      locale: OG_LOCALES[locale as Locale],
      alternateLocale: routing.locales
        .filter((other) => other !== locale)
        .map((other) => OG_LOCALES[other]),
      ...(image && { images: [image] }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      ...(image && { images: [image] }),
    },
  };
}

type Crumb = { name: string; item: string };

/** A schema.org breadcrumb trail; the first crumb should be the home page. */
export function breadcrumbList(crumbs: Crumb[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      ...crumb,
    })),
  };
}

/**
 * The schema.org node for a page itself. Case studies and the work index add
 * their own, more specific nodes alongside it; this one ties the page to the
 * site and the studio and names its language, which is what lets a crawler
 * treat /en/x and /el/x as one page in two languages.
 */
export function webPage({
  locale,
  path = "",
  name,
  description,
  type = "WebPage",
  extra = {},
}: {
  locale: string;
  path?: string;
  name: string;
  description: string;
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage" | "FAQPage";
  extra?: Record<string, unknown>;
}) {
  const url = pageUrl(locale, path);

  return {
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    inLanguage: locale,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": STUDIO_ID },
    ...extra,
  };
}

/** Question-and-answer pairs as schema.org expects them inside an FAQPage. */
export function faqEntities(items: { q: string; a: string }[]) {
  return items.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  }));
}
