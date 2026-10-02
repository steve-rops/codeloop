import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Reveal } from "./reveal";
import { stagger } from "../lib/motion";
import { italic } from "../lib/rich";
import { CONTACT_EMAIL } from "../lib/site";

const CONTACT = [
  { label: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
  { label: "+44 20 7946 0112", href: "tel:+442079460112" },
];

const SOCIAL = [
  { label: "GitHub", href: "https://github.com" },
  { label: "Dribbble", href: "https://dribbble.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
];

// Both point at the contact page for now; the labels are translated, the
// destinations are not.
const LEGAL = ["privacy", "terms"] as const;

export function SiteFooter() {
  const t = useTranslations("footer");

  return (
    <Reveal
      as="footer"
      className="theme-dark mt-[var(--section-y)] px-[var(--gutter)] pt-[var(--block-y)] pb-[2vw]"
    >
      <Link
        href="/new"
        data-cursor={t("ctaCursor")}
        className="block border-b border-current/20 pb-[var(--block-y)]"
      >
        <h2 className="t-l">
          <span className="mask">
            <span className="a-up block">{t("ctaLine1")}</span>
          </span>
          <span className="mask">
            <span className="a-up block" style={stagger(1, 0.08)}>
              {t.rich("ctaLine2", italic)}
            </span>
          </span>
        </h2>
      </Link>

      <div className="col-8 mt-[var(--block-y)] gap-y-[var(--block-y)]">
        <div className="col-span-2 max-md:col-span-2">
          <span className="mask">
            <span className="a-up t-xs block opacity-60">{t("contact")}</span>
          </span>
          <ul className="mt-[var(--stack-y)] flex flex-col gap-1">
            {CONTACT.map((item, index) => (
              <li key={item.href} className="mask">
                <a
                  href={item.href}
                  className="link a-up t-xs"
                  style={stagger(index + 1, 0.05)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-2 max-md:col-span-2">
          <span className="mask">
            <span className="a-up t-xs block opacity-60" style={stagger(1, 0.05)}>
              {t("studio")}
            </span>
          </span>
          <address className="t-xs a-fade-up mt-[var(--stack-y)] leading-[1.6] not-italic opacity-80">
            {t("addressLine1")}
            <br />
            {t("addressLine2")}
            <br />
            {t("addressLine3")}
          </address>
        </div>

        <div className="col-span-2 col-start-6 max-md:col-span-2 max-md:col-start-3">
          <span className="mask">
            <span className="a-up t-xs block opacity-60" style={stagger(2, 0.05)}>
              {t("elsewhere")}
            </span>
          </span>
          <ul className="mt-[var(--stack-y)] flex flex-col gap-1">
            {SOCIAL.map((item, index) => (
              <li key={item.href} className="mask">
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="link a-up t-xs"
                  style={stagger(index + 3, 0.05)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-[var(--block-y)] flex h-px">
        <span className="a-fill-w block h-full bg-current opacity-25" />
      </div>

      <div className="t-xxs mt-[var(--stack-y)] flex items-center justify-between opacity-60">
        {/* Passed as a string: as a number ICU would group it into "2,026". */}
        <span>{t("copyright", { year: String(new Date().getFullYear()) })}</span>
        <div className="flex gap-[1.5vw]">
          {LEGAL.map((item) => (
            <Link key={item} href="/contact" className="link t-xxs">
              {t(item)}
            </Link>
          ))}
          <a href="#top" className="link t-xxs">
            {t("backToTop")}
          </a>
        </div>
      </div>
    </Reveal>
  );
}
