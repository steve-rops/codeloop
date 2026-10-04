import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import * as rootParams from "next/root-params";
import { routing } from "./routing";

/**
 * Resolves the locale and its messages for every server render.
 *
 * `locale` only arrives here when a call site names one explicitly, e.g.
 * `getTranslations({locale: "el"})`. Otherwise it is read back off the
 * `[locale]` root param rather than off the request — which is what keeps these
 * pages prerenderable instead of forcing every one of them dynamic. The
 * `requestLocale` param the older guides use is deprecated in favour of this.
 */
export default getRequestConfig(async ({ locale }) => {
  if (!locale) {
    // The segment is effectively a catch-all, so anything that isn't a locale
    // we support (/wp-login, /en-GB, junk) lands here as a 404.
    const paramValue = await rootParams.locale();
    if (!hasLocale(routing.locales, paramValue)) notFound();
    locale = paramValue;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
