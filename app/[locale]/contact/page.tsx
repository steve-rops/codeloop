import type { Metadata } from "next";
import { useLocale, useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { ContactForm } from "@/app/components/contact-form";
import { PageHeader } from "@/app/components/page-header";
import { PillButton } from "@/app/components/pill-button";
import { Reveal } from "@/app/components/reveal";
import { stagger } from "@/app/lib/motion";
import { italic } from "@/app/lib/rich";
import { JsonLd } from "@/app/components/json-ld";
import { breadcrumbList, pageMetadata, pageUrl, webPage } from "@/app/lib/seo";
import { SITE_NAME } from "@/app/lib/site";

export async function generateMetadata(
  props: PageProps<"/[locale]/contact">,
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "metadata.contact" });

  return pageMetadata({
    locale,
    path: "/contact",
    title: t("title"),
    description: t("description"),
  });
}

// The rows are fixed; only their copy is translated, so the keys live here and
// the label/value pairs come out of the catalogue.
const DETAILS = ["email", "response", "based"] as const;

export default function ContactPage() {
  const t = useTranslations("contactPage");
  const meta = useTranslations("metadata.contact");
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
              path: "/contact",
              type: "ContactPage",
              name: meta("title"),
              description: meta("description"),
            }),
            breadcrumbList([
              { name: SITE_NAME, item: pageUrl(locale) },
              { name: nav("contact"), item: pageUrl(locale, "/contact") },
            ]),
          ],
        }}
      />
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t.rich("title", italic)}
        intro={t("intro")}
      />

      <Reveal as="section" className="gutter col-8 gap-y-[5vw] pb-[6vw]">
        <div className="col-span-4 max-md:col-span-4">
          <span className="mask">
            <span className="a-up t-xs block text-muted">{t("step01")}</span>
          </span>
          <div className="a-fade-up mt-[2.5vw]" style={stagger(1, 0.08)}>
            <ContactForm />
          </div>
        </div>

        <div className="col-span-3 col-start-6 max-md:col-span-4 max-md:col-start-1">
          <span className="mask">
            <span className="a-up t-xs block text-muted" style={stagger(1, 0.06)}>
              {t("step02")}
            </span>
          </span>

          <dl className="mt-[2.5vw]">
            {DETAILS.map((detail, index) => (
              <div key={detail} className="border-hairline border-b py-[1.2vw] max-md:py-4">
                <dt className="t-xxs mb-[0.5vw] text-muted">
                  {t(`details.${detail}.label`)}
                </dt>
                <dd className="mask">
                  <span
                    className="a-up t-s block"
                    style={stagger(index + 2, 0.06)}
                  >
                    {t(`details.${detail}.value`)}
                  </span>
                </dd>
              </div>
            ))}
          </dl>

          <div className="theme-sand a-fade-up mt-[3vw] p-[2vw] max-md:p-6" style={stagger(5, 0.06)}>
            <p className="t-s mb-[1vw]">{t.rich("brief.title", italic)}</p>
            <p className="t-p mb-[2vw]">{t("brief.body")}</p>
            <PillButton href="/new">{t("brief.cta")}</PillButton>
          </div>
        </div>
      </Reveal>
    </main>
  );
}
