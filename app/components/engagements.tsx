"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Reveal } from "./reveal";
import { stagger } from "../lib/motion";
import { messagesList } from "../lib/messages-list";

// Three fixed offers; the names, durations, tags and bullet lists all live in
// `engagements.items` so they can differ per language.
const ENGAGEMENTS = ["discovery", "build", "partner"] as const;

/**
 * Expandable list.
 *
 * The rows animate open on a `grid-template-rows` ratio rather than a measured
 * pixel height, so the body can be any length and still ease rather than snap.
 * The toggle's label rolls in its own mask, which keeps the row's height fixed
 * while the words change.
 */
export function Engagements() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const t = useTranslations("engagements");

  return (
    <section className="gutter pt-[var(--section-y)]">
      <Reveal className="mb-[var(--block-y)]">
        <span className="mask block">
          <span className="a-up t-xs block text-muted">{t("eyebrow")}</span>
        </span>
      </Reveal>

      <ul>
        {ENGAGEMENTS.map((item, index) => {
          const open = openIndex === index;
          const includes = messagesList(t.raw(`items.${item}.includes`));

          return (
            <Reveal as="li" key={item} className="block">
              <div className="flex h-px">
                <span className="a-fill-w bg-ink block h-full" />
              </div>

              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : index)}
                aria-expanded={open}
                className="col-8 w-full cursor-pointer items-baseline py-[var(--row-y)] text-left"
              >
                <span className="mask col-span-4 max-md:col-span-3">
                  <span className="a-up t-m block">
                    {t(`items.${item}.name`)}
                  </span>
                </span>

                <span className="mask col-span-2 max-md:hidden">
                  <span
                    className="a-up t-xs block text-muted"
                    style={stagger(1, 0.06)}
                  >
                    {t(`items.${item}.tags`)}
                  </span>
                </span>

                <span className="col-span-2 flex items-baseline justify-between max-md:col-span-1">
                  <span className="mask max-md:hidden">
                    <span
                      className="a-up t-xs block text-muted"
                      style={stagger(2, 0.06)}
                    >
                      {t(`items.${item}.duration`)}
                    </span>
                  </span>

                  {/* Both labels are always rendered, stacked; the pair slides so
                      the row never changes height as the words swap. */}
                  <span className="mask relative block h-[16px] w-24 shrink-0">
                    <span
                      className="ease-mask block transition-transform duration-500"
                      style={{
                        transform: open ? "translateY(-16px)" : "translateY(0)",
                      }}
                    >
                      <span className="t-xs block h-[16px] leading-[16px]">
                        {t("more")}
                      </span>
                      <span className="t-xs block h-[16px] leading-[16px]">
                        {t("less")}
                      </span>
                    </span>
                  </span>
                </span>
              </button>

              <div
                className="ease-mask grid transition-[grid-template-rows] duration-700"
                style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <div className="col-8 pb-[var(--row-y)]">
                    <p className="t-p col-span-3 col-start-1 max-md:col-span-4">
                      {t(`items.${item}.body`)}
                    </p>
                    <ul className="col-span-3 col-start-5 max-md:col-span-4 max-md:col-start-1 max-md:mt-[var(--block-y)]">
                      {includes.map((line) => (
                        <li
                          key={line}
                          className="t-xs border-hairline text-muted border-b py-[var(--tight-y)]"
                        >
                          {line}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}

        <div className="flex h-px">
          <span className="bg-ink block h-full w-full" />
        </div>
      </ul>
    </section>
  );
}
