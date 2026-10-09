import type { Metadata } from "next";
import { useLocale, useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { BriefWizard } from "@/app/components/brief-wizard";
import { PageHeader } from "@/app/components/page-header";
import { italic } from "@/app/lib/rich";
import { JsonLd } from "@/app/components/json-ld";
import { breadcrumbList, pageMetadata, pageUrl, webPage } from "@/app/lib/seo";
import { SITE_NAME } from "@/app/lib/site";

export async function generateMetadata(
  props: PageProps<"/[locale]/new">,
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "metadata.new" });

  return pageMetadata({
    locale,
    path: "/new",
    title: t("title"),
    description: t("description"),
  });
}

export default function NewProjectPage() {
  const t = useTranslations("newPage");
  const meta = useTranslations("metadata.new");
  const nav = useTranslations("nav");
  const locale = useLocale();

  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            webPage({
              locale,
              path: "/new",
              name: meta("title"),
              description: meta("description"),
            }),
            breadcrumbList([
              { name: SITE_NAME, item: pageUrl(locale) },
              { name: nav("cta"), item: pageUrl(locale, "/new") },
            ]),
          ],
        }}
      />
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t.rich("title", italic)}
        intro={t("intro")}
      />
      <BriefWizard />
    </main>
  );
}
