"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LOCALE_LABELS, routing } from "@/i18n/routing";

/**
 * EN / EL toggle.
 *
 * `usePathname` here is the locale-aware one, so it hands back the path with
 * the prefix already stripped ("/work/relay-health", not "/en/work/…"). Feeding
 * that straight back to `Link` with an explicit `locale` is what keeps you on
 * the page you were reading rather than bouncing you to the other language's
 * home page.
 */
export function LocaleSwitcher({ className = "" }: { className?: string }) {
  const active = useLocale();
  const pathname = usePathname();
  const t = useTranslations("localeSwitcher");

  return (
    <div
      role="group"
      aria-label={t("label")}
      className={`flex items-center gap-1.5 ${className}`}
    >
      {routing.locales.map((locale, index) => (
        <span key={locale} className="flex items-center gap-1.5">
          {index > 0 ? (
            <span aria-hidden="true" className="text-muted opacity-40">
              /
            </span>
          ) : null}
          <Link
            href={pathname}
            locale={locale}
            hrefLang={locale}
            title={LOCALE_LABELS[locale]}
            aria-current={locale === active ? "true" : undefined}
            data-active={locale === active}
            className="link t-xs"
          >
            {t(locale)}
          </Link>
        </span>
      ))}
    </div>
  );
}
