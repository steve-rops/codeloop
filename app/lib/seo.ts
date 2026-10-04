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

/**
 * Everything a page's `generateMetadata` returns: the title and description,
 * a canonical with its hreflang alternates, and the share card. Next replaces
 * `openGraph` and `twitter` wholesale between segments rather than merging
 * them, so each page builds the full objects here instead of inheriting half.
 *
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

  return {
    title,
    description,
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
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
      title,
      description,
      ...(image && { images: [image] }),
    },
  };
}
