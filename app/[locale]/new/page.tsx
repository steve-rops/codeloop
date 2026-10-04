import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { BriefWizard } from "@/app/components/brief-wizard";
import { PageHeader } from "@/app/components/page-header";
import { italic } from "@/app/lib/rich";
import { pageMetadata } from "@/app/lib/seo";

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

  return (
    <main>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t.rich("title", italic)}
        intro={t("intro")}
      />
      <BriefWizard />
    </main>
  );
}
