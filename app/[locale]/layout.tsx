import type { Metadata, Viewport } from "next";
import { Archivo, Instrument_Serif } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Cursor } from "@/app/components/cursor";
import { JsonLd } from "@/app/components/json-ld";
import { PageTransition } from "@/app/components/page-transition";
import { Preloader } from "@/app/components/preloader";
import { SiteFooter } from "@/app/components/site-footer";
import { SiteNav } from "@/app/components/site-nav";
import { SmoothScroll } from "@/app/components/smooth-scroll";
import {
  FOUNDER_ID,
  pageMetadata,
  pageUrl,
  STUDIO_ID,
  WEBSITE_ID,
} from "@/app/lib/seo";
import { SERVICE_TYPES, SERVICES } from "@/app/lib/services";
import {
  BASE_COUNTRY,
  BASE_LOCALITY,
  BASE_REGION,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  FOUNDER_NAME,
  OPENING_HOURS,
  SITE_NAME,
  SITE_URL,
  SOCIAL_LINKS,
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

  // Search Console and Bing accept a meta tag as proof of ownership; set the
  // codes in the environment and they are printed, leave them unset and the
  // tags are left out. (Google is also verified by the HTML file in public/.)
  const verification = {
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    }),
    ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION && {
      other: { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION },
    }),
  };

  // The home page's metadata doubles as the site-wide default; every other
  // page overrides the title, description, canonical and share card.
  return {
    metadataBase: new URL(SITE_URL),
    applicationName: SITE_NAME,
    authors: [{ name: FOUNDER_NAME, url: pageUrl(locale, "/about") }],
    creator: FOUNDER_NAME,
    publisher: SITE_NAME,
    formatDetection: { telephone: false, email: false, address: false },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    ...(Object.keys(verification).length > 0 && { verification }),
    ...pageMetadata({
      locale,
      title: t("title"),
      description: t("description"),
    }),
  };
}

export const viewport: Viewport = { themeColor: "#fafafa" };

/**
 * The namespaces that client components translate. Only these cross the
 * boundary: the provider would otherwise serialise the whole catalogue into
 * every page, which on the Greek tree was more than half of the HTML.
 * A client component that picks up a new namespace has to be added here.
 */
const CLIENT_NAMESPACES = [
  "nav", // SiteNav, MobileNav
  "localeSwitcher", // LocaleSwitcher
  "engagements", // Engagements
  "form", // ContactForm, BriefWizard
  "errors", // ContactForm, BriefWizard
  "brief", // BriefWizard
] as const;

function pick<T extends Record<string, unknown>>(
  messages: T,
  keys: readonly (keyof T)[],
) {
  return Object.fromEntries(keys.map((key) => [key, messages[key]])) as T;
}

/**
 * The studio, the person behind it and the site as schema.org entities. Pages
 * that describe something more specific (a case study, a service, the work
 * index) point back at these by `@id` rather than restating them.
 */
async function siteGraph(locale: string) {
  const meta = await getTranslations({ locale, namespace: "metadata.home" });
  const about = await getTranslations({ locale, namespace: "aboutPage" });
  const services = await getTranslations({ locale, namespace: "services" });
  const sameAs = SOCIAL_LINKS.map((link) => link.href);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": STUDIO_ID,
        name: SITE_NAME,
        url: pageUrl(locale),
        description: meta("description"),
        email: CONTACT_EMAIL,
        telephone: CONTACT_PHONE,
        logo: `${SITE_URL}/icon-512.png`,
        image: `${SITE_URL}/icon-512.png`,
        address: {
          "@type": "PostalAddress",
          addressLocality: BASE_LOCALITY,
          addressRegion: BASE_REGION,
          addressCountry: BASE_COUNTRY,
        },
        areaServed: [
          { "@type": "Country", name: "Greece" },
          { "@type": "Place", name: "Worldwide" },
        ],
        knowsLanguage: [...routing.locales],
        founder: { "@id": FOUNDER_ID },
        foundingDate: about("facts.since.value"),
        sameAs,
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: OPENING_HOURS.days,
          opens: OPENING_HOURS.opens,
          closes: OPENING_HOURS.closes,
        },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "sales",
          email: CONTACT_EMAIL,
          telephone: CONTACT_PHONE,
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
              "@id": `${SITE_URL}/#service-${service}`,
              name: services(`items.${service}.title`),
              description: services(`items.${service}.desc`),
              serviceType: SERVICE_TYPES[service],
              url: pageUrl(locale, `/services/${service}`),
              provider: { "@id": STUDIO_ID },
              areaServed: [
                { "@type": "Country", name: "Greece" },
                { "@type": "Place", name: "Worldwide" },
              ],
            },
          })),
        },
      },
      {
        "@type": "Person",
        "@id": FOUNDER_ID,
        name: FOUNDER_NAME,
        jobTitle: SERVICE_TYPES.design + " & " + SERVICE_TYPES.development,
        url: pageUrl(locale, "/about"),
        email: CONTACT_EMAIL,
        worksFor: { "@id": STUDIO_ID },
        knowsLanguage: [...routing.locales],
        sameAs,
        address: {
          "@type": "PostalAddress",
          addressLocality: BASE_LOCALITY,
          addressCountry: BASE_COUNTRY,
        },
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: SITE_NAME,
        url: pageUrl(locale),
        description: meta("description"),
        inLanguage: [...routing.locales],
        publisher: { "@id": STUDIO_ID },
      },
    ],
  };
}

export default async function LocaleLayout(props: LayoutProps<"/[locale]">) {
  const { locale } = await props.params;

  // `[locale]` sits at the root, so it catches every unmatched path too — an
  // unknown segment is a 404 rather than a page rendered in a made-up language.
  if (!hasLocale(routing.locales, locale)) notFound();

  const messages = await getMessages({ locale });

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
        {/* The nav, the wizard and the forms are client components that
            translate, so the locale and their messages cross the boundary. */}
        <NextIntlClientProvider messages={pick(messages, CLIENT_NAMESPACES)}>
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
