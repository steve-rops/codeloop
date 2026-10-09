import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Faq, type FaqItem } from "@/app/components/faq";
import { JsonLd } from "@/app/components/json-ld";
import { PillButton } from "@/app/components/pill-button";
import { ProjectCard } from "@/app/components/project-card";
import { Reveal } from "@/app/components/reveal";
import { messagesList } from "@/app/lib/messages-list";
import { delay, stagger } from "@/app/lib/motion";
import { PROJECTS } from "@/app/lib/projects";
import {
  breadcrumbList,
  faqEntities,
  pageMetadata,
  pageUrl,
  STUDIO_ID,
  webPage,
} from "@/app/lib/seo";
import { isService, SERVICE_CATEGORIES, SERVICE_TYPES, SERVICES } from "@/app/lib/services";
import { SITE_NAME, SITE_URL } from "@/app/lib/site";

export function generateStaticParams() {
  return SERVICES.map((service) => ({ service }));
}

export async function generateMetadata(
  props: PageProps<"/[locale]/services/[service]">,
): Promise<Metadata> {
  const { locale, service } = await props.params;
  if (!isService(service)) {
    const t = await getTranslations({ locale, namespace: "metadata.project" });
    return { title: t("notFound") };
  }

  const t = await getTranslations({
    locale,
    namespace: `metadata.service.${service}`,
  });

  return pageMetadata({
    locale,
    path: `/services/${service}`,
    title: t("title"),
    description: t("description"),
  });
}

export default async function ServicePage(
  props: PageProps<"/[locale]/services/[service]">,
) {
  const { locale, service } = await props.params;
  if (!isService(service)) notFound();

  const t = await getTranslations({ locale, namespace: "servicePage" });
  const s = await getTranslations({ locale, namespace: `services.items.${service}` });
  const all = await getTranslations({ locale, namespace: "services.items" });
  const meta = await getTranslations({ locale, namespace: `metadata.service.${service}` });
  const nav = await getTranslations({ locale, namespace: "nav" });

  const deliverables = messagesList(s.raw("deliverables"));
  const process = messagesList(s.raw("process"));
  const goodFor = messagesList(s.raw("goodFor"));
  const faq = messagesList<FaqItem>(s.raw("faq"));
  const related = PROJECTS.filter((project) =>
    SERVICE_CATEGORIES[service].includes(project.category),
  ).slice(0, 2);
  const others = SERVICES.filter((other) => other !== service);
  const path = `/services/${service}`;
  const url = pageUrl(locale, path);

  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            webPage({
              locale,
              path,
              name: meta("title"),
              description: meta("description"),
              extra: { mainEntity: { "@id": `${SITE_URL}/#service-${service}` } },
            }),
            // The same node the studio's offer catalogue lists, said in full
            // here on the page that is about it.
            {
              "@type": "Service",
              "@id": `${SITE_URL}/#service-${service}`,
              name: s("title"),
              description: meta("description"),
              serviceType: SERVICE_TYPES[service],
              url,
              provider: { "@id": STUDIO_ID },
              areaServed: [
                { "@type": "Country", name: "Greece" },
                { "@type": "Place", name: "Worldwide" },
              ],
              availableLanguage: ["en", "el"],
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: t("deliverables"),
                itemListElement: deliverables.map((item) => ({
                  "@type": "Offer",
                  itemOffered: { "@type": "Service", name: item },
                })),
              },
            },
            { "@type": "FAQPage", "@id": `${url}#faq`, mainEntity: faqEntities(faq) },
            breadcrumbList([
              { name: SITE_NAME, item: pageUrl(locale) },
              { name: nav("services"), item: pageUrl(locale, "/services") },
              { name: s("title"), item: url },
            ]),
          ],
        }}
      />

      <Reveal as="header" className="gutter pt-[calc(var(--nav-h)+7vw)] pb-[5vw]">
        <span className="mask">
          <Link href="/services" className="link a-up t-xs" style={delay(0.1)}>
            {t("back")}
          </Link>
        </span>

        {/* The heading is the page's full, searchable name; the short name
            in the catalogue is for the nav, the cards and the breadcrumb. */}
        <h1 className="t-l mt-[4vw] w-[80%] max-md:w-full">
          <span className="mask">
            <span className="a-up block" style={delay(0.3)}>
              {meta("title")}
            </span>
          </span>
        </h1>

        <div className="col-8 mt-[3vw]">
          <p className="t-s a-fade-up col-span-3 max-md:col-span-4" style={delay(0.4)}>
            {s("desc")}
          </p>
          <p className="t-p a-fade-up col-span-4 col-start-5 max-md:col-span-4 max-md:col-start-1" style={delay(0.5)}>
            {s("intro")}
          </p>
        </div>
      </Reveal>

      <Reveal as="section" className="gutter col-8 border-hairline gap-y-[8vw] border-y py-[5vw] max-md:py-[10vw]">
        <div className="col-span-3 max-md:col-span-4">
          <span className="mask">
            <span className="a-up t-xs block text-muted">{t("deliverables")}</span>
          </span>
          <ul className="mt-[2vw] max-md:mt-4">
            {deliverables.map((item, index) => (
              <li key={item} className="border-hairline t-p a-fade-up border-b py-[1vw] last:border-0 max-md:py-3" style={stagger(index + 1, 0.05)}>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-4 col-start-5 max-md:col-span-4 max-md:col-start-1">
          <span className="mask">
            <span className="a-up t-xs block text-muted" style={stagger(1, 0.06)}>
              {t("process")}
            </span>
          </span>
          <ol className="mt-[2vw] max-md:mt-4">
            {process.map((step, index) => (
              <li key={step} className="border-hairline flex gap-[1.5vw] border-b py-[1.6vw] last:border-0 max-md:gap-4 max-md:py-4">
                <span className="t-xxs shrink-0 text-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="t-p a-fade-up" style={stagger(index + 2, 0.06)}>
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>

      <Reveal as="section" className="gutter col-8 pt-[8vw] max-md:pt-[14vw]">
        <div className="col-span-3 max-md:col-span-4">
          <span className="mask">
            <span className="a-up t-xs block text-muted">{t("goodFor")}</span>
          </span>
        </div>
        <ul className="col-span-5 max-md:col-span-4 max-md:mt-4">
          {goodFor.map((item, index) => (
            <li key={item} className="border-hairline t-s a-fade-up border-b py-[1.2vw] last:border-0 max-md:py-3" style={stagger(index + 1, 0.05)}>
              {item}
            </li>
          ))}
        </ul>
      </Reveal>

      {related.length > 0 ? (
        <section className="relative mx-[1vw] pt-[var(--section-y)]">
          <Reveal className="relative mb-[var(--block-y)] px-[1vw]">
            <div className="flex items-baseline justify-between">
              <span className="mask">
                <span className="a-up t-xs block text-muted">{t("work")}</span>
              </span>
              <span className="mask">
                <Link href="/work" className="link a-up t-xs" style={stagger(1, 0.07)}>
                  {t("allWork")}
                </Link>
              </span>
            </div>
          </Reveal>
          <div className="relative grid grid-cols-2 max-md:grid-cols-1">
            {related.map((project, index) => (
              <ProjectCard
                key={project.slug}
                project={project}
                index={index}
                ruleFrom={index % 2 === 0 ? "right" : "left"}
              />
            ))}
          </div>
        </section>
      ) : null}

      <Faq items={faq} eyebrow={t("faq")} />

      <Reveal as="section" className="gutter pt-[var(--section-y)]">
        <div className="flex h-px">
          <span className="a-fill-w bg-ink block h-full" />
        </div>
        <div className="col-8 items-end pt-[4vw] max-md:pt-8">
          <div className="col-span-5 max-md:col-span-4">
            <p className="t-xxs mb-[1vw] text-muted">{t("otherServices")}</p>
            <ul className="flex flex-col">
              {others.map((other, index) => (
                <li key={other} className="mask">
                  <Link href={`/services/${other}`} className="a-up t-ml block" style={stagger(index + 1, 0.08)}>
                    {all(`${other}.title`)} &#8594;
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <span className="a-fade-up col-span-3 max-md:col-span-4 max-md:mt-6 md:justify-self-end" style={stagger(3, 0.08)}>
            <PillButton href="/new">{t("cta")}</PillButton>
          </span>
        </div>
      </Reveal>
    </main>
  );
}
