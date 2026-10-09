import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { stagger } from "../lib/motion";
import { SERVICES } from "../lib/services";
import { Reveal } from "./reveal";
import { SplitLines } from "./split-lines";

export function Services() {
  const t = useTranslations("services");

  return (
    <section
      id="services"
      className="gutter scroll-mt-[var(--nav-h)] pt-[var(--section-y)]"
    >
      <Reveal className=" space-y-4 gap-y-[var(--block-y)]">
        {/* Rule and eyebrow are one unit — the label hangs off the edge, so
            they cannot be separated by the grid's row gap. */}
        <div className="col-span-8">
          <span className="mask mt-[var(--stack-y)] block">
            <span className="a-up t-xs block text-muted">{t("eyebrow")}</span>
          </span>
        </div>

        <h2 className="t-l ">
          <span className="mask">
            <span className="a-up block" style={stagger(1, 0.08)}>
              {t("titleLine1")}
            </span>
          </span>
        </h2>

        <div className="col-span-3 col-start-6 max-md:col-span-4 max-md:col-start-1">
          {/* Length here depends on the viewport, so the lines are measured in
              the browser rather than hand-broken. */}
          <p className="t-p mb-[var(--block-y)]">
            <SplitLines base={0.2} step={0.07}>
              {t("body")}
            </SplitLines>
          </p>
        </div>
      </Reveal>

      {/* Each row is a link to the service's own page, so the section is also
          the hub those pages hang off. */}
      <ul className="mt-[var(--block-y)]">
        {SERVICES.map((service, index) => (
          <Reveal as="li" key={service} className="block">
            <div className="flex h-px">
              <span className="a-fill-w bg-ink block h-full" />
            </div>

            <Link
              href={`/services/${service}`}
              data-cursor={t("more")}
              className="col-8 items-baseline py-[var(--row-y)]"
            >
              <span className="mask col-span-1">
                <span className="a-up t-xs block text-muted">
                  ({String(index + 1).padStart(2, "0")})
                </span>
              </span>

              <h3 className="t-m col-span-4 max-md:col-span-3">
                <span className="mask">
                  <span className="a-up block" style={stagger(1, 0.06)}>
                    {t(`items.${service}.title`)}
                  </span>
                </span>
              </h3>

              <p
                className="t-p a-fade-up col-span-3 max-md:hidden"
                style={stagger(2, 0.06)}
              >
                {t(`items.${service}.desc`)}
              </p>
            </Link>
          </Reveal>
        ))}
        <div className="flex h-px">
          <span className="bg-ink block h-full w-full" />
        </div>
      </ul>
    </section>
  );
}
