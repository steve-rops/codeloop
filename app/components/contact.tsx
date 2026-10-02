import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ContactForm } from "./contact-form";
import { Reveal } from "./reveal";
import { stagger } from "../lib/motion";
import { italic } from "../lib/rich";

export function Contact() {
  const t = useTranslations("contactSection");

  return (
    <Reveal
      as="section"
      id="contact"
      className="gutter scroll-mt-[var(--nav-h)] pt-[var(--section-y)]"
    >
      <div className="col-8 gap-y-[var(--block-y)]">
        <div className="col-span-3 max-md:col-span-4">
          <span className="mask">
            <span className="a-up t-xs block text-muted">{t("eyebrow")}</span>
          </span>

          <h2 className="t-ml mt-[var(--stack-y)]">
            <span className="mask">
              <span className="a-up block" style={stagger(1, 0.08)}>
                {t("titleLine1")}
              </span>
            </span>
            <span className="mask">
              <span className="a-up block" style={stagger(2, 0.08)}>
                {t.rich("titleLine2", italic)}
              </span>
            </span>
          </h2>

          <p
            className="t-p a-fade-up mt-[var(--block-y)] max-w-[26vw] max-md:max-w-none"
            style={stagger(3, 0.08)}
          >
            {t.rich("body", {
              ...italic,
              brief: (chunks) => (
                <Link href="/new" className="link-body">
                  {chunks}
                </Link>
              ),
            })}
          </p>
        </div>

        <div
          className="a-fade-up col-span-4 col-start-5 max-md:col-span-4 max-md:col-start-1"
          style={stagger(4, 0.08)}
        >
          <ContactForm compact />
        </div>
      </div>
    </Reveal>
  );
}
