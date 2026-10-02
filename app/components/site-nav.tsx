"use client";

import { useLenis } from "lenis/react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "../lib/nav";
import { isReady, onReady } from "../lib/ready";
import { LocaleSwitcher } from "./locale-switcher";
import { LoopMark } from "./loop-mark";
import { MobileNav } from "./mobile-nav";
import { PillButton } from "./pill-button";
import { stagger } from "../lib/motion";

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [ready, setReady] = useState(isReady);
  // Locale-stripped, so `link.match` stays written as a plain path.
  const pathname = usePathname();
  const t = useTranslations("nav");

  // Reading scroll off Lenis rather than the window keeps this in step with the
  // interpolated position, so the bar's background lands on the same frame the
  // page appears to move.
  useLenis(({ scroll }) => setScrolled(scroll > 12));

  // The bar drops in on the same signal as the hero, so they arrive together.
  useEffect(() => onReady(() => setReady(true)), []);

  return (
    <header className="fixed inset-x-0 top-0 z-[100] h-[var(--nav-h)]">
      {/* The bar's ground is a layer of its own rather than a background on the
          header, because `backdrop-filter` makes an element the containing
          block for its fixed descendants — and the mobile panel is one. On the
          header itself, the panel would be trapped inside the 55px bar the
          moment the page is scrolled far enough for the blur to come in. */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 -z-10 transition-colors duration-500 ease-quart ${
          scrolled
            ? "bg-paper/92 shadow-[0_1px_0_rgba(42,42,42,0.12)] backdrop-blur-sm"
            : "bg-transparent"
        }`}
      />

      <div
        className={`mx-[var(--gutter)] flex h-full items-center justify-between ${
          ready ? "is-inview" : ""
        }`}
      >
        <Link href="/" className="relative z-[2] flex items-center gap-2">
          <span className="mask">
            <span className="a-up flex items-center gap-1.5">
              <LoopMark id="nav" />
              <span className="t-xs">codeloop</span>
            </span>
          </span>
          <span className="mask max-sm:hidden">
            <span
              className="a-up t-xs block text-muted"
              style={stagger(1, 0.06)}
            >
              {t("tagline")}
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-[2vw] max-md:hidden">
          {NAV_LINKS.map((link, index) => {
            const active = pathname.startsWith(link.match);
            return (
              <span key={link.href} className="mask">
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  data-active={active}
                  className="link a-up t-xs"
                  style={stagger(index + 2, 0.06)}
                >
                  {t(link.label)}
                  {link.count ? (
                    <span className="t-xxs text-muted ml-0.5 align-top">
                      {String(link.count).padStart(2, "0")}
                    </span>
                  ) : null}
                </Link>
              </span>
            );
          })}

          <span className="mask">
            <span
              className="a-up block"
              style={stagger(NAV_LINKS.length + 2, 0.06)}
            >
              <LocaleSwitcher />
            </span>
          </span>

          <span className="mask">
            <span
              className="a-up block"
              style={stagger(NAV_LINKS.length + 3, 0.06)}
            >
              <PillButton href="/new">{t("cta")}</PillButton>
            </span>
          </span>
        </nav>

        <MobileNav />
      </div>
    </header>
  );
}
