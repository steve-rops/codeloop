import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Media } from "@/app/components/media";
import { PillButton } from "@/app/components/pill-button";
import { Reveal } from "@/app/components/reveal";
import { delay, stagger } from "@/app/lib/motion";
import { messagesList } from "@/app/lib/messages-list";
import { getProject, PROJECTS } from "@/app/lib/projects";
import { breadcrumbList, pageMetadata, pageUrl, STUDIO_ID, webPage } from "@/app/lib/seo";
import { SITE_NAME, SITE_URL } from "@/app/lib/site";
import { JsonLd } from "@/app/components/json-ld";
import type { Locale } from "@/i18n/routing";

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata(
  props: PageProps<"/[locale]/work/[slug]">,
): Promise<Metadata> {
  const { locale, slug } = await props.params;
  const t = await getTranslations({ locale, namespace: "metadata.project" });
  const project = getProject(slug);

  if (!project) return { title: t("notFound") };

  const p = await getTranslations({ locale, namespace: `projects.${slug}` });
  const page = await getTranslations({ locale, namespace: "projectPage" });

  const image = project.image?.[locale as Locale];

  return pageMetadata({
    locale,
    path: `/work/${slug}`,
    title: t("title", { client: p("client") }),
    description: p("summary"),
    image: image
      ? { url: image, alt: page("imageAlt", { client: p("client") }) }
      : undefined,
  });
}

export default async function ProjectPage(
  props: PageProps<"/[locale]/work/[slug]">,
) {
  const { locale: param, slug } = await props.params;
  const locale = param as Locale;
  const project = getProject(slug);

  if (!project) notFound();

  const t = await getTranslations({ locale, namespace: "projectPage" });
  const c = await getTranslations({ locale, namespace: "categories" });
  const p = await getTranslations({ locale, namespace: `projects.${slug}` });
  const all = await getTranslations({ locale, namespace: "projects" });

  const approach = messagesList(p.raw("approach"));
  // A build still in progress has no figures to report, and no `results` key
  // in the catalogues to read.
  const inDevelopment = project.status === "development";
  const results = inDevelopment
    ? []
    : messagesList<{ label: string; value: string }>(p.raw("results"));

  // The second-phase section is only there for projects that shipped one, so
  // the sections are numbered as they render rather than in the catalogues.
  const screens = project.system?.screens ?? [];
  const number = (position: number) => String(position).padStart(2, "0");
  const label = (position: number, text: string) =>
    `${number(position)} \u2014 ${text}`;
  const resultsPosition = screens.length > 0 ? 4 : 3;

  const index = PROJECTS.findIndex((entry) => entry.slug === project.slug);
  const next = PROJECTS[(index + 1) % PROJECTS.length];

  const nav = await getTranslations({ locale, namespace: "nav" });
  const url = pageUrl(locale, `/work/${slug}`);
  const image = project.image?.[locale];

  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            webPage({
              locale,
              path: `/work/${slug}`,
              name: p("title"),
              description: p("summary"),
              extra: { mainEntity: { "@id": `${url}#case-study` } },
            }),
            {
              "@type": "CreativeWork",
              "@id": `${url}#case-study`,
              name: p("client"),
              headline: p("title"),
              description: p("summary"),
              abstract: p("challenge"),
              url,
              mainEntityOfPage: { "@id": `${url}#webpage` },
              inLanguage: locale,
              dateCreated: String(project.year),
              genre: c(project.category),
              keywords: [...messagesList(p.raw("tags")), ...project.stack].join(
                ", ",
              ),
              creativeWorkStatus: inDevelopment ? "Draft" : "Published",
              creator: { "@id": STUDIO_ID },
              ...(image && { image: `${SITE_URL}${image}` }),
              ...(project.url && { sameAs: project.url[locale] }),
            },
            breadcrumbList([
              { name: SITE_NAME, item: pageUrl(locale) },
              { name: nav("work"), item: pageUrl(locale, "/work") },
              { name: p("client"), item: url },
            ]),
          ],
        }}
      />
      <Reveal as="header" className="gutter pt-[calc(var(--nav-h)+7vw)] pb-[5vw]">
        <span className="mask">
          <Link href="/work" className="link a-up t-xs" style={delay(0.1)}>
            {t("back")}
          </Link>
        </span>

        <span className="mask mt-[4vw] block">
          <span className="a-up t-xs block text-muted" style={delay(0.2)}>
            {p("client")} &#183; {c(project.category)} &#183; {project.year}
            {inDevelopment ? (
              <>
                {" "}
                &#183; <span className="text-ink">{t("inDevelopment")}</span>
              </>
            ) : null}
          </span>
        </span>

        <h1 className="t-l mt-[2vw] w-[80%] max-md:w-full">
          <span className="mask">
            <span className="a-up block" style={delay(0.3)}>
              {p("title")}
            </span>
          </span>
        </h1>

        <p
          className="t-p a-fade-up mt-[3vw] w-[32vw] max-md:w-full"
          style={delay(0.5)}
        >
          {p("summary")}
        </p>
      </Reveal>

      <Reveal className="gutter">
        <Media
          seed={project.slug}
          src={project.image?.[locale]}
          alt={t("imageAlt", { client: p("client") })}
          preload
          motion="rise"
          className="h-[42vw] w-full max-md:h-[70vw]"
        />
      </Reveal>

      <Reveal as="section" className="gutter col-8 border-hairline mt-[6vw] border-y py-[3vw] max-md:mt-[10vw] max-md:py-[6vw]">
        {[
          { label: t("role"), value: p("role") },
          { label: t("duration"), value: p("duration") },
          { label: t("stack"), value: project.stack.join(", ") },
          ...(project.url
            ? [
                {
                  label: t("website"),
                  value: new URL(project.url[locale]).hostname.replace(/^www\./, ""),
                  href: project.url[locale],
                },
              ]
            : []),
        ].map((item: { label: string; value: string; href?: string }, itemIndex) => (
          <div key={item.label} className="col-span-2 max-md:col-span-4 max-md:mb-4">
            <p className="t-xxs mb-[1vw] text-muted">{item.label}</p>
            <span className="mask">
              <span className="a-up t-xs block" style={stagger(itemIndex, 0.06)}>
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link"
                  >
                    {item.value} &#8599;
                  </a>
                ) : (
                  item.value
                )}
              </span>
            </span>
          </div>
        ))}
      </Reveal>

      <Reveal as="section" className="gutter col-8 gap-y-[12vw] pt-[10vw] max-md:pt-[16vw]">
        <div className="col-span-3 max-md:col-span-4">
          <span className="mask">
            <span className="a-up t-xs block text-muted">{label(1, t("problem"))}</span>
          </span>
          <p className="t-p a-fade-up mt-[2vw] max-md:mt-4" style={stagger(1, 0.08)}>
            {p("challenge")}
          </p>
        </div>

        <div className="col-span-4 col-start-5 max-md:col-span-4 max-md:col-start-1">
          <span className="mask">
            <span className="a-up t-xs block text-muted" style={stagger(1, 0.06)}>
              {label(2, t("approach"))}
            </span>
          </span>
          <ol className="mt-[2vw] max-md:mt-4">
            {approach.map((step, stepIndex) => (
              <li
                key={step}
                className="border-hairline flex gap-[1.5vw] border-b py-[1.6vw] last:border-0 max-md:gap-4 max-md:py-4"
              >
                <span className="t-xxs shrink-0 text-muted">
                  {String(stepIndex + 1).padStart(2, "0")}
                </span>
                <span
                  className="t-p a-fade-up"
                  style={stagger(stepIndex + 2, 0.06)}
                >
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>

      {screens.length > 0 ? (
        <Reveal as="section" className="gutter pt-[10vw] max-md:pt-[16vw]">
          <span className="mask">
            <span className="a-up t-xs block text-muted">
              {label(3, p("system.label"))}
            </span>
          </span>

          {screens.length === 1 ? (
            /* A lone shot (a phone collage, taller than it is wide) takes the
               right half at its own proportions, with the write-up beside it,
               so the section reads as one spread rather than a page of text
               followed by a tall image. */
            <div className="col-8 mt-[2vw] gap-y-[3vw] max-md:mt-4 max-md:gap-y-8">
              <div className="col-span-4 max-md:col-span-4">
                <h2 className="t-m">
                  <span className="mask">
                    <span className="a-up block" style={stagger(1, 0.08)}>
                      {p("system.title")}
                    </span>
                  </span>
                </h2>
                <p
                  className="t-p a-fade-up mt-[3vw] max-w-[36ch] max-md:mt-4 max-md:max-w-none"
                  style={stagger(2, 0.08)}
                >
                  {p("system.body")}
                </p>
              </div>
              {screens.map((screen) => {
                const caption = p(`system.screens.${screen.id}`);
                return (
                  <figure
                    key={screen.id}
                    className="col-span-3 col-start-6 max-md:col-span-4 max-md:col-start-1"
                  >
                    <Media
                      seed={`${project.slug}-${screen.id}`}
                      src={screen.image?.[locale]}
                      alt={caption}
                      sizes="(max-width: 768px) 100vw, 40vw"
                      className="aspect-[707/1000] w-full"
                    />
                    <figcaption className="mt-[1vw] flex gap-[1.5vw] max-md:mt-3 max-md:gap-4">
                      <span className="t-xxs shrink-0 text-muted">
                        {number(1)}
                      </span>
                      <span
                        className="t-xs a-fade-up text-muted"
                        style={stagger(3, 0.06)}
                      >
                        {caption}
                      </span>
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          ) : (
            <>
              <div className="col-8 mt-[2vw] max-md:mt-4">
                <h2 className="t-m col-span-4 max-md:col-span-4">
                  <span className="mask">
                    <span className="a-up block" style={stagger(1, 0.08)}>
                      {p("system.title")}
                    </span>
                  </span>
                </h2>
                <p
                  className="t-p a-fade-up col-span-3 col-start-6 max-md:col-span-4 max-md:col-start-1 max-md:mt-4"
                  style={stagger(2, 0.08)}
                >
                  {p("system.body")}
                </p>
              </div>

              {/* The first shot runs the full width like the cover; the rest
                  pair up. Each slot falls back to a plate until its screenshot
                  exists. */}
              <div className="col-8 mt-[4vw] gap-y-[3vw] max-md:mt-8 max-md:gap-y-8">
                {screens.map((screen, screenIndex) => {
                  const caption = p(`system.screens.${screen.id}`);
                  const wide = screenIndex === 0;
                  return (
                    <figure
                      key={screen.id}
                      className={`${wide ? "col-span-8" : "col-span-4"} max-md:col-span-4`}
                    >
                      <Media
                        seed={`${project.slug}-${screen.id}`}
                        src={screen.image?.[locale]}
                        alt={caption}
                        sizes={wide ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
                        className={`w-full ${wide ? "h-[42vw] max-md:h-[70vw]" : "h-[26vw] max-md:h-[70vw]"}`}
                      />
                      <figcaption className="mt-[1vw] flex gap-[1.5vw] max-md:mt-3 max-md:gap-4">
                        <span className="t-xxs shrink-0 text-muted">
                          {number(screenIndex + 1)}
                        </span>
                        <span
                          className="t-xs a-fade-up text-muted"
                          style={stagger(screenIndex + 3, 0.06)}
                        >
                          {caption}
                        </span>
                      </figcaption>
                    </figure>
                  );
                })}
              </div>
            </>
          )}
        </Reveal>
      ) : null}

      {results.length > 0 ? (
        <Reveal as="section" className="gutter pt-[10vw] max-md:pt-[16vw]">
          <span className="mask">
            <span className="a-up t-xs block text-muted">
              {label(resultsPosition, t("results"))}
            </span>
          </span>

          <div className="col-8 mt-[3vw] max-md:mt-6">
            {results.map((result, resultIndex) => (
              <div
                key={result.label}
                className="border-hairline col-span-2 border-t pt-[2vw] max-md:col-span-4 max-md:mb-8 max-md:pt-4"
              >
                <span className="mask">
                  <span
                    className="a-up t-ml block"
                    style={stagger(resultIndex, 0.08)}
                  >
                    {result.value}
                  </span>
                </span>
                <p className="t-xs mt-[1vw] text-muted">{result.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      ) : null}

      <Reveal as="section" className="gutter pt-[12vw] max-md:pt-[20vw]">
        <div className="flex h-px">
          <span className="a-fill-w bg-ink block h-full" />
        </div>

        <div className="flex flex-wrap items-end justify-between gap-[2vw] pt-[4vw] max-md:gap-6 max-md:pt-8">
          <div>
            <p className="t-xxs mb-[1vw] text-muted">{t("nextProject")}</p>
            <Link href={`/work/${next.slug}`} data-cursor={t("viewCase")}>
              <h2 className="t-ml">
                <span className="mask">
                  <span className="a-up block" style={stagger(1, 0.08)}>
                    {all(`${next.slug}.client`)} &#8594;
                  </span>
                </span>
              </h2>
            </Link>
          </div>

          <span className="a-fade-up block" style={stagger(2, 0.08)}>
            <PillButton href="/new">{t("cta")}</PillButton>
          </span>
        </div>
      </Reveal>
    </main>
  );
}
