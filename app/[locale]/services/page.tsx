import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { JsonLd } from "@/app/components/json-ld";
import { PageHeader } from "@/app/components/page-header";
import { PillButton } from "@/app/components/pill-button";
import { Reveal } from "@/app/components/reveal";
import { stagger } from "@/app/lib/motion";
import { italic } from "@/app/lib/rich";
import { breadcrumbList, pageMetadata, pageUrl, webPage } from "@/app/lib/seo";
import { SERVICES } from "@/app/lib/services";
import { SITE_NAME, SITE_URL } from "@/app/lib/site";

export async function generateMetadata(
  props: PageProps<"/[locale]/services">,
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "metadata.services" });

  return pageMetadata({
    locale,
    path: "/services",
    title: t("title"),
    description: t("description"),
  });
}

export default async function ServicesPage(
  props: PageProps<"/[locale]/services">,
) {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "servicesPage" });
  const s = await getTranslations({ locale, namespace: "services" });
  const meta = await getTranslations({ locale, namespace: "metadata.services" });
  const nav = await getTranslations({ locale, namespace: "nav" });

  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            webPage({
              locale,
              path: "/services",
              type: "CollectionPage",
              name: meta("title"),
              description: meta("description"),
              extra: {
                mainEntity: {
                  "@type": "ItemList",
                  itemListElement: SERVICES.map((service, index) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    name: s(`items.${service}.title`),
                    url: pageUrl(locale, `/services/${service}`),
                    item: { "@id": `${SITE_URL}/#service-${service}` },
                  })),
                },
              },
            }),
            breadcrumbList([
              { name: SITE_NAME, item: pageUrl(locale) },
              { name: nav("services"), item: pageUrl(locale, "/services") },
            ]),
          ],
        }}
      />
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t.rich("title", italic)}
        intro={t("intro")}
      />

      <section className="gutter">
        <div className="flex h-px">
          <span className="bg-ink block h-full w-full" />
        </div>
        {SERVICES.map((service, index) => (
          <Reveal as="article" key={service} className="border-hairline border-b">
            <Link
              href={`/services/${service}`}
              data-cursor={s("more")}
              className="col-8 py-[var(--section-y)] max-md:py-[10vw]"
            >
              <span className="mask col-span-1">
                <span className="a-up t-xs block text-muted">
                  ({String(index + 1).padStart(2, "0")})
                </span>
              </span>

              <div className="col-span-3 max-md:col-span-4">
                <h2 className="t-ml">
                  <span className="mask">
                    <span className="a-up block" style={stagger(1, 0.06)}>
                      {s(`items.${service}.title`)}
                    </span>
                  </span>
                </h2>
                <p className="t-s a-fade-up mt-[var(--stack-y)] text-muted" style={stagger(2, 0.06)}>
                  {s(`items.${service}.desc`)}
                </p>
              </div>

              <div className="col-span-4 max-md:col-span-4 max-md:mt-[var(--block-y)]">
                <p className="t-p a-fade-up" style={stagger(3, 0.06)}>
                  {s(`items.${service}.intro`)}
                </p>
                <span className="link a-fade-up t-xs mt-[var(--block-y)] inline-block" style={stagger(4, 0.06)}>
                  {s("more")}
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </section>

      <Reveal as="section" className="gutter pt-[var(--section-y)]">
        <div className="col-8 items-end">
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
