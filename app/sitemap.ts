import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { PROJECTS } from "./lib/projects";
import { languageAlternates, pageUrl } from "./lib/seo";
import { SITE_URL } from "./lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { path: string; priority: number; image?: string }[] = [
    { path: "", priority: 1 },
    { path: "/work", priority: 0.9 },
    ...PROJECTS.map((project) => ({
      path: `/work/${project.slug}`,
      priority: 0.8,
      image: project.image?.en,
    })),
    { path: "/contact", priority: 0.7 },
    { path: "/new", priority: 0.7 },
  ];

  // One entry per page per language, each listing its translations.
  return pages.flatMap(({ path, priority, image }) =>
    routing.locales.map((locale) => ({
      url: pageUrl(locale, path),
      changeFrequency: "monthly" as const,
      priority,
      alternates: { languages: languageAlternates(path) },
      ...(image && { images: [`${SITE_URL}${image}`] }),
    })),
  );
}
