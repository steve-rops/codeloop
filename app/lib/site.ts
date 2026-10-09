// The address shown around the site, and the inbox form submissions land in.
// The contact page prints it from the catalogue (`contactPage.details.email`),
// so a change here needs the same change in messages/*.json.
export const CONTACT_EMAIL = "topsstefanos@gmail.com";

export const SITE_NAME = "codeloop";

// Who runs the studio. Named in the structured data as the founder and on the
// studio page; the catalogues carry the localised spelling for the copy.
export const FOUNDER_NAME = "Stefanos Topsidis";

// E.164, so it validates as a schema.org `telephone`; the footer links it via
// WhatsApp rather than tel:, which is how clients actually reach it.
export const CONTACT_PHONE = "+306909417500";
export const WHATSAPP_URL = `https://wa.me/${CONTACT_PHONE.replace("+", "")}`;

// Where the studio is based. The copy says "remote, worldwide" everywhere, but
// a business with no place at all is a weak entity for a search engine; the
// city gives it one without pretending there is an office to visit.
export const BASE_LOCALITY = "Athens";
export const BASE_REGION = "Attica";
export const BASE_COUNTRY = "GR";

// Opening hours as the footer prints them, in schema.org's shape.
export const OPENING_HOURS = {
  days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  opens: "09:00",
  closes: "18:00",
};

export const GITHUB_URL = "https://github.com/steve-rops/";

// Public profiles, linked from the footer and listed as `sameAs` in the
// structured data so search engines tie them to this entity. Add LinkedIn,
// Instagram, X and so on here as `{ label, href }` and both update together.
export const SOCIAL_LINKS: { label: string; href: string }[] = [
  { label: "GitHub", href: GITHUB_URL },
];

// The production origin, without a trailing slash. Canonicals, hreflang, the
// sitemap, the share cards and the structured data are all built on it, so set
// NEXT_PUBLIC_SITE_URL wherever the site is deployed. On Vercel the project's
// production domain is picked up when the variable is missing.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/+$/, "");
