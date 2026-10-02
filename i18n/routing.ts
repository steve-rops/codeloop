import { defineRouting } from "next-intl/routing";

/**
 * Single source of truth for which locales exist and how they appear in the
 * URL. `localePrefix: "always"` means English is spelled out too — /en/work,
 * /el/work — so no locale is the silent default and every path says which
 * language it is in.
 */
export const routing = defineRouting({
  locales: ["en", "el"],
  defaultLocale: "en",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];

// Rendered by the locale switcher; the endonym rather than the English name,
// because a language picker should be readable to the person switching to it.
export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  el: "Ελληνικά",
};
