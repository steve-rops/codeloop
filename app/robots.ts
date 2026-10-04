import type { MetadataRoute } from "next";
import { SITE_URL } from "./lib/site";

// Everything is public, to search crawlers and AI crawlers alike; /llms.txt is
// the plain-text summary written for the latter.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
