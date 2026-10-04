import type { Metadata, Viewport } from "next";
import { Archivo, Instrument_Serif } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Cursor } from "@/app/components/cursor";
import { JsonLd } from "@/app/components/json-ld";
import { PageTransition } from "@/app/components/page-transition";
import { Preloader } from "@/app/components/preloader";
import { SiteFooter } from "@/app/components/site-footer";
import { SiteNav } from "@/app/components/site-nav";
import { SmoothScroll } from "@/app/components/smooth-scroll";
import { pageMetadata, pageUrl } from "@/app/lib/seo";
import {
  CONTACT_EMAIL,
  GITHUB_URL,
  SITE_NAME,
  SITE_URL,
} from "@/app/lib/site";
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

  // The home page's metadata doubles as the site-wide default; every other
  // page overrides the title, description, canonical and share card.
  return {
    metadataBase: new URL(SITE_URL),
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    ...pageMetadata({
      locale,
      title: t("title"),
      description: t("description"),
    }),
  };
}

export const viewport: Viewport = { themeColor: "#fafafa" };

const SERVICES = ["design", "development", "brand"] as const;

/**
 * The studio and the site as schema.org entities. Pages that describe
 * something more specific (a case study, the work index) point back at these
 * by `@id` rather than restating them.
 */
async function siteGraph(locale: string) {
  const meta = await getTranslations({ locale, namespace: "metadata.home" });
  const services = await getTranslations({ locale, namespace: "services" });

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": `${SITE_URL}/#studio`,
        name: SITE_NAME,
        url: pageUrl(locale),
        description: meta("description"),
        email: CONTACT_EMAIL,
        logo: `${SITE_URL}/icon-512.png`,
        image: `${SITE_URL}/icon-512.png`,
        areaServed: "Worldwide",
        knowsLanguage: [...routing.locales],
        sameAs: [GITHUB_URL],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "sales",
          email: CONTACT_EMAIL,
          url: pageUrl(locale, "/contact"),
          availableLanguage: [...routing.locales],
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: services("titleLine1"),
          itemListElement: SERVICES.map((service) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: services(`items.${service}.title`),
              description: services(`items.${service}.desc`),
              provider: { "@id": `${SITE_URL}/#studio` },
            },
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: pageUrl(locale),
        description: meta("description"),
        inLanguage: locale,
        publisher: { "@id": `${SITE_URL}/#studio` },
      },
    ],
  };
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
        <JsonLd data={await siteGraph(locale)} />
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
