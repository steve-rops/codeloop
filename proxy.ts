import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Next 16 renamed the `middleware` convention to `proxy`; this is still
// next-intl's middleware, just under the filename Next now looks for. It
// negotiates the locale on unprefixed requests and redirects to /en or /el.
export default createMiddleware(routing);

export const config = {
  // Everything except API routes, Next internals, and files with an extension
  // (favicon.ico, robots.txt, sitemap.xml, llms.txt, the hero footage, and so on).
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
