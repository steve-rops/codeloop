import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
};

// Points at ./i18n/request.ts by default, which is where the request-scoped
// locale and messages are resolved.
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
