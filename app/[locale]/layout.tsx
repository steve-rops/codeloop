import type { Metadata } from "next";
import { Archivo, Instrument_Serif } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Cursor } from "@/app/components/cursor";
import { PageTransition } from "@/app/components/page-transition";
import { Preloader } from "@/app/components/preloader";
import { SiteFooter } from "@/app/components/site-footer";
import { SiteNav } from "@/app/components/site-nav";
import { SmoothScroll } from "@/app/components/smooth-scroll";
import "../globals.css";

// Grotesk for everything structural, set in caps and tracked tight. The full
// weight range matters: body copy sits at 300, which most free grotesks skip.
//
// NOTE: Archivo ships no Greek subset, so /el falls back to a system grotesk
// for anything set in it. Swapping to a Greek-capable face is a type decision,
// not a translation one, so it is left alone here.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

// Loaded italic-only, because that is the only way it is ever used — as a single
// serif word dropped into an uppercase line.
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});

// Prerender both language trees at build time rather than negotiating them per
// request; the proxy still handles anything that arrives without a prefix.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(
  props: LayoutProps<"/[locale]">,
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "metadata.home" });

  return { title: t("title"), description: t("description") };
}

export default async function LocaleLayout(props: LayoutProps<"/[locale]">) {
  const { locale } = await props.params;

  // `[locale]` sits at the root, so it catches every unmatched path too — an
  // unknown segment is a 404 rather than a page rendered in a made-up language.
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    // No `scroll-smooth` here on purpose: Lenis owns in-page anchors, and a
    // native smooth scroll running underneath it fights the same gesture.
    <html
      lang={locale}
      className={`${archivo.variable} ${instrumentSerif.variable} antialiased`}
    >
      <body className="font-sans">
        {/* The reveals hide their subjects until an observer fires; with no JS
            that never happens, so unhide everything up front. */}
        <noscript>
          <style>{`.a-up,.a-down,.a-fade-up,.a-fade-rotate,.a-up-img{opacity:1;transform:none}.a-fill-w{width:100%}.a-fill-h{height:100%}`}</style>
        </noscript>
        {/* The nav, the wizard and the filters are all client components that
            translate, so the locale and messages have to cross the boundary. */}
        <NextIntlClientProvider>
          <SmoothScroll>
            <Preloader />
            <PageTransition />
            <Cursor />
            <SiteNav />
            {props.children}
            <SiteFooter />
          </SmoothScroll>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
