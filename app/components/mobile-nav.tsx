"use client";

import { useLenis } from "lenis/react";
import { useTranslations } from "next-intl";
import { usePathname as useFullPathname } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "../lib/nav";
import { LocaleSwitcher } from "./locale-switcher";
import { PillButton } from "./pill-button";
import { stagger } from "../lib/motion";
import { CONTACT_EMAIL } from "../lib/site";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  // The full path, locale prefix included: switching language from inside the
  // open panel is a navigation too, and the panel should close behind it.
  const [routeAtRender, setRouteAtRender] = useState(useFullPathname());
  const pathname = useFullPathname();
  const lenis = useLenis();
  const t = useTranslations("nav");

  // Close on navigation — the panel would otherwise sit over the new page.
  // Adjusted during render rather than in an effect, so the closed panel is
  // what gets committed instead of an open one that then flickers shut.
  if (routeAtRender !== pathname) {
    setRouteAtRender(pathname);
    setOpen(false);
  }

  // The panel is a full-height overlay; letting the page scroll underneath it
  // means closing the menu drops you somewhere you never chose to be.
  useEffect(() => {
    if (!lenis) return;
    if (open) lenis.stop();
    else lenis.start();
    return () => lenis.start();
  }, [lenis, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="t-xs relative z-[2] cursor-pointer uppercase"
      >
        {open ? t("menuClose") : t("menuOpen")}
      </button>

      {/* The panel is always mounted so its links can animate in and out; the
          `is-inview` flip is what drives them, not a mount. */}
      <div
        id="mobile-menu"
        inert={!open}
        className={`theme-sand fixed inset-0 z-[1] flex flex-col justify-between px-[var(--gutter)] pt-[calc(var(--nav-h)+6vw)] pb-[8vw] transition-[clip-path] duration-700 ease-mask ${
          open ? "is-inview" : ""
        }`}
        style={{ clipPath: open ? "inset(0 0 0 0)" : "inset(0 0 100% 0)" }}
      >
        <div className="flex flex-col gap-[8vw]">
          <nav className="flex flex-col gap-[3vw]">
            {NAV_LINKS.map((link, index) => (
              <span key={link.href} className="mask">
                <Link
                  href={link.href}
                  className="a-up t-ml block"
                  style={stagger(index, 0.06, 0.15)}
                >
                  {t(link.label)}
                  {link.count ? (
                    <span className="t-xs ml-1 align-top">
                      {String(link.count).padStart(2, "0")}
                    </span>
                  ) : null}
                </Link>
              </span>
            ))}
          </nav>

          <span className="mask">
            <span
              className="a-up block"
              style={stagger(NAV_LINKS.length, 0.06, 0.15)}
            >
              <PillButton href="/new">{t("cta")}</PillButton>
            </span>
          </span>
        </div>

        <div className="flex flex-col gap-[4vw]">
          <span className="mask">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="link a-up t-s block"
              style={stagger(NAV_LINKS.length + 1, 0.06, 0.15)}
            >
              {CONTACT_EMAIL}
            </a>
          </span>
          <span className="mask">
            <span
              className="a-up block"
              style={stagger(NAV_LINKS.length + 2, 0.06, 0.15)}
            >
              <LocaleSwitcher />
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
