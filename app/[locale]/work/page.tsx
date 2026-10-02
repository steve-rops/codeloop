import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/app/components/page-header";
import { PillButton } from "@/app/components/pill-button";
import { Reveal } from "@/app/components/reveal";
import { stagger } from "@/app/lib/motion";
import { italic } from "@/app/lib/rich";
import { WorkGallery } from "@/app/components/work-gallery";
import { PROJECTS } from "@/app/lib/projects";

export async function generateMetadata(
  props: PageProps<"/[locale]/work">,
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "metadata.work" });

  return { title: t("title"), description: t("description") };
}

export default function WorkPage() {
  const t = useTranslations("workPage");

  return (
    <main>
      <PageHeader
        eyebrow={t("eyebrow", {
          count: String(PROJECTS.length).padStart(2, "0"),
        })}
        title={t.rich("title", italic)}
        intro={t("intro")}
      />

      <section className="pb-[6vw]">
        <WorkGallery projects={PROJECTS} />
      </section>

      <Reveal as="section" className="gutter pt-[4vw]">
        <div className="flex h-px">
          <span className="a-fill-w bg-ink block h-full" />
        </div>

        <div className="col-8 items-end pt-[3vw]">
          <h2 className="t-ml col-span-5 max-md:col-span-4">
            <span className="mask">
              <span className="a-up block" style={stagger(1, 0.08)}>
                {t("ctaLine1")}
              </span>
            </span>
            <span className="mask">
              <span className="a-up block" style={stagger(2, 0.08)}>
                {t.rich("ctaLine2", italic)}
              </span>
            </span>
          </h2>

          <div className="col-span-3 max-md:col-span-4 max-md:mt-[4vw]">
            <p className="t-p a-fade-up mb-[2vw]" style={stagger(3, 0.08)}>
              {t("ctaBody")}
            </p>
            <span className="a-fade-up block" style={stagger(4, 0.08)}>
              <PillButton href="/new">{t("cta")}</PillButton>
            </span>
          </div>
        </div>
      </Reveal>
    </main>
  );
}
