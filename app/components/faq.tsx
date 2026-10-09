import { useTranslations } from "next-intl";
import { messagesList } from "../lib/messages-list";
import { stagger } from "../lib/motion";
import { italic } from "../lib/rich";
import { Reveal } from "./reveal";

export type FaqItem = { q: string; a: string };

/**
 * Questions and answers as native disclosure widgets.
 *
 * `<details>` rather than the engagements' scripted rows on purpose: every
 * answer is in the HTML whether or not it is open, which is what a crawler or
 * a language model reads, and the widget works before hydration and with no
 * JS at all. The page that renders this also emits the same pairs as FAQPage
 * structured data, so the two never drift.
 */
export function Faq({
  items,
  eyebrow,
  title,
}: {
  items: FaqItem[];
  eyebrow?: string;
  title?: React.ReactNode;
}) {
  return (
    <section id="faq" className="gutter scroll-mt-[var(--nav-h)] pt-[var(--section-y)]">
      {eyebrow || title ? (
        <Reveal className="col-8 mb-[var(--block-y)]">
          <div className="col-span-8">
            {eyebrow ? (
              <span className="mask block">
                <span className="a-up t-xs block text-muted">{eyebrow}</span>
              </span>
            ) : null}
            {title ? (
              <h2 className="t-l mt-[var(--stack-y)]">
                <span className="mask">
                  <span className="a-up block" style={stagger(1, 0.08)}>
                    {title}
                  </span>
                </span>
              </h2>
            ) : null}
          </div>
        </Reveal>
      ) : null}

      <Reveal as="div" className="block">
        <div className="flex h-px">
          <span className="a-fill-w bg-ink block h-full" />
        </div>
        {items.map((item, index) => (
          <details
            key={item.q}
            className="faq-item border-hairline group border-b"
            open={index === 0}
          >
            <summary className="col-8 cursor-pointer list-none items-baseline py-[var(--row-y)] [&::-webkit-details-marker]:hidden">
              <span className="t-xs col-span-1 text-muted">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="t-s col-span-6 max-md:col-span-3">{item.q}</h3>
              <span
                aria-hidden="true"
                className="t-xs col-span-1 text-right transition-transform duration-500 ease-mask group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <div className="col-8 pb-[var(--row-y)]">
              <p className="t-p col-span-5 col-start-2 max-md:col-span-4 max-md:col-start-1">
                {item.a}
              </p>
            </div>
          </details>
        ))}
      </Reveal>
    </section>
  );
}

/** The home page's questions, read out of the catalogue in page order. */
export function HomeFaq() {
  const t = useTranslations("faq");
  const items = messagesList<FaqItem>(t.raw("items"));

  return (
    <Faq
      items={items}
      eyebrow={t("eyebrow")}
      title={
        <>
          {t("titleLine1")}
          <br />
          {t.rich("titleLine2", italic)}
        </>
      }
    />
  );
}
