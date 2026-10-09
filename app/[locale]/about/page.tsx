import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/app/components/json-ld";
import { PageHeader } from "@/app/components/page-header";
import { PillButton } from "@/app/components/pill-button";
import { Reveal } from "@/app/components/reveal";
import { messagesList } from "@/app/lib/messages-list";
import { stagger } from "@/app/lib/motion";
import { italic } from "@/app/lib/rich";
import { breadcrumbList, FOUNDER_ID, pageMetadata, pageUrl, STUDIO_ID, webPage } from "@/app/lib/seo";
import { SITE_NAME } from "@/app/lib/site";

export async function generateMetadata(
  props: PageProps<"/[locale]/about">,
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "metadata.about" });

  return pageMetadata({
    locale,
    path: "/about",
    title: t("title"),
    description: t("description"),
  });
}

// Fixed rows; the labels and values are translated.
const FACTS = ["based", "clients", "languages", "since", "response"] as const;

export default async function AboutPage(props: PageProps<"/[locale]/about">) {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "aboutPage" });
  const meta = await getTranslations({ locale, namespace: "metadata.about" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  const principles = messagesList<{ title: string; body: string }>(t.raw("principles"));

  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            webPage({
              locale,
              path: "/about",
              type: "AboutPage",
              name: meta("title"),
              description: meta("description"),
              extra: {
                mainEntity: { "@id": STUDIO_ID },
                mentions: { "@id": FOUNDER_ID },
              },
            }),
            breadcrumbList([
              { name: SITE_NAME, item: pageUrl(locale) },
              { name: nav("about"), item: pageUrl(locale, "/about") },
            ]),
          ],
        }}
      />
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t.rich("title", italic)}
        intro={t("intro")}
      />

      <Reveal as="section" className="gutter col-8 border-hairline border-y py-[5vw] max-md:py-[10vw]">
        <div className="col-span-3 max-md:col-span-4">
          <span className="mask">
            <span className="a-up t-xs block text-muted">{t("whoTitle")}</span>
          </span>
        </div>
        <p className="t-p a-fade-up col-span-4 col-start-5 max-md:col-span-4 max-md:col-start-1 max-md:mt-4" style={stagger(1, 0.08)}>
          {t("whoBody")}
        </p>
      </Reveal>

      <section className="gutter pt-[var(--section-y)]">
        <Reveal className="mb-[var(--block-y)]">
          <span className="mask block">
            <span className="a-up t-xs block text-muted">{t("howTitle")}</span>
          </span>
        </Reveal>
        <ul>
          {principles.map((principle, index) => (
            <Reveal as="li" key={principle.title} className="block">
              <div className="flex h-px">
                <span className="a-fill-w bg-ink block h-full" />
              </div>
              <div className="col-8 items-baseline py-[var(--row-y)]">
                <span className="mask col-span-1">
                  <span className="a-up t-xs block text-muted">
                    ({String(index + 1).padStart(2, "0")})
                  </span>
                </span>
                <h2 className="t-m col-span-4 max-md:col-span-3">
                  <span className="mask">
                    <span className="a-up block" style={stagger(1, 0.06)}>
                      {principle.title}
                    </span>
                  </span>
                </h2>
                <p className="t-p a-fade-up col-span-3 max-md:col-span-4 max-md:mt-2" style={stagger(2, 0.06)}>
                  {principle.body}
                </p>
              </div>
            </Reveal>
          ))}
          <div className="flex h-px">
            <span className="bg-ink block h-full w-full" />
          </div>
        </ul>
      </section>

      <Reveal as="section" className="gutter col-8 gap-y-[8vw] pt-[var(--section-y)]">
        <div className="col-span-3 max-md:col-span-4">
          <span className="mask">
            <span className="a-up t-xs block text-muted">{t("stackTitle")}</span>
          </span>
          <p className="t-p a-fade-up mt-[2vw] max-md:mt-4" style={stagger(1, 0.08)}>
            {t("stackBody")}
          </p>
        </div>

        <div className="col-span-4 col-start-5 max-md:col-span-4 max-md:col-start-1">
          <span className="mask">
            <span className="a-up t-xs block text-muted" style={stagger(1, 0.06)}>
              {t("factsTitle")}
            </span>
          </span>
          <dl className="mt-[2vw] max-md:mt-4">
            {FACTS.map((fact, index) => (
              <div key={fact} className="border-hairline flex items-baseline justify-between gap-4 border-b py-[1.2vw] last:border-0 max-md:py-3">
                <dt className="t-xxs text-muted">{t(`facts.${fact}.label`)}</dt>
                <dd className="mask">
                  <span className="a-up t-s block text-right" style={stagger(index + 2, 0.06)}>
                    {t(`facts.${fact}.value`)}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Reveal>

      <Reveal as="section" className="gutter pt-[var(--section-y)]">
        <div className="flex h-px">
          <span className="a-fill-w bg-ink block h-full" />
        </div>
        <div className="col-8 items-end pt-[4vw] max-md:pt-8">
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
          <div className="col-span-3 max-md:col-span-4 max-md:mt-6">
            <p className="t-p a-fade-up mb-[2vw]" style={stagger(3, 0.08)}>
              {t("ctaBody")}
            </p>
            <span className="a-fade-up block" style={stagger(4, 0.08)}>
              <PillButton href="/work">{t("cta")}</PillButton>
            </span>
          </div>
        </div>
      </Reveal>
    </main>
  );
}
