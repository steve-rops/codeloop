import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import {
  MAINTENANCE_HTML,
  MAINTENANCE_MODE,
  MAINTENANCE_RETRY_AFTER,
} from "./app/lib/maintenance";
import { routing } from "./i18n/routing";

// Next 16 renamed the `middleware` convention to `proxy`; this is still
// next-intl's middleware, just under the filename Next now looks for. It
// negotiates the locale on unprefixed requests and redirects to /en or /el.
const intl = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  // While the site is down for maintenance every page answers with the holding
  // page. A 503 with Retry-After, rather than a 200 or a redirect, is what tells
  // search engines the outage is temporary and keeps the pages indexed. Files
  // with an extension never reach here (see the matcher), so the icons, robots
  // and sitemap keep being served as normal.
  if (MAINTENANCE_MODE) {
    return new Response(MAINTENANCE_HTML, {
      status: 503,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Retry-After": String(MAINTENANCE_RETRY_AFTER),
        "Cache-Control": "no-store",
      },
    });
  }

  return intl(request);
}

export const config = {
  // Everything except API routes, Next internals, and files with an extension
  // (favicon.ico, robots.txt, sitemap.xml, llms.txt, the hero footage, and so on).
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
