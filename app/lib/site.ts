// The address shown around the site, and the inbox form submissions land in.
// The contact page prints it from the catalogue (`contactPage.details.email`),
// so a change here needs the same change in messages/*.json.
export const CONTACT_EMAIL = "topsstefanos@gmail.com";

export const SITE_NAME = "codeloop";

export const GITHUB_URL = "https://github.com/steve-rops/";

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
