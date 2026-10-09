import { useTranslations } from "next-intl";
import { PillButton } from "./pill-button";
import { Reveal } from "./reveal";
import { FitLines } from "./fit-lines";
import { delay } from "../lib/motion";
import { italic } from "../lib/rich";

/**
 * Opening screen.
 *
 * The section holds the full viewport at every size, with the loop footage
 * running full-bleed behind the copy — so the first thing on screen is the
 * mark moving, not a band of it further down the page.
 *
 * Everything here is on a fixed clock rather than a scroll trigger, since it is
 * already in view at mount. The delays are measured from the moment the opening
 * sequence releases, so they hold on a cold load and on a client navigation
 * alike. The headline arrives line by line out of its masks; the subheading and
 * description follow underneath it.
 */
export function Hero() {
  const t = useTranslations("hero");

  return (
    <Reveal
      as="section"
      id="top"
      className="relative flex min-h-svh flex-col justify-center overflow-hidden pt-[calc(var(--nav-h)+6vw)] pb-[6vw]"
    >
      {/* Muted + inline is what buys autoplay on iOS; the footage carries no
          information, so it stays out of the accessibility tree and the tab
          order entirely. */}
      {/* The poster is the first frame, so the screen is painted at once and
          the footage takes over from the same picture; `metadata` keeps the
          browser from pulling the whole file before it has decided to play. */}
      <video
        src="/code-loop-bg.mp4"
        poster="/code-loop-poster.jpg"
        preload="metadata"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        tabIndex={-1}
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
      />
      {/* The footage is near-paper on the left where the type sits, but it
          breathes — glyphs drift through the headline and take the contrast
          with them. The scrim tints and blurs the backdrop under the copy so
          the type reads against a settled ground, and dissolves to the right
          where the footage is the whole point. */}
      <div
        aria-hidden="true"
        className=" pointer-events-none absolute inset-0 z-0"
      />

      <div className="px-4 md:px-16 relative z-10 space-y-4 gap-y-[var(--block-y)]">
        <h1 className=" t-xl col-span-8 w-[86%] max-md:w-full">
          <FitLines
            className="mask"
            groundClassName="bg-white/10 w-fit backdrop-blur-sm"
          >
            <span className="a-up w-fit block" style={delay(0.1)}>
              {t("line1")}
            </span>
          </FitLines>{" "}
          <FitLines
            className="mask"
            groundClassName="bg-white/10 w-fit backdrop-blur-sm"
          >
            <span className="a-up w-fit block t-ml" style={delay(0.19)}>
              {t("line2")}
            </span>
          </FitLines>
        </h1>

        {/* Labels, not a second heading — they sat at `t-s`, the same step as
            the lead across the grid, which read as two competing subheads. */}
        {/* <div className="col-span-2 flex flex-col items-start gap-[0.4em] max-md:col-span-4">
          <span className="mask">
            <span className="a-up t-xs block" style={delay(0.4)}>
              {t("role")}
            </span>
          </span>
          <span className="mask">
            <span className="a-up t-xs block text-muted" style={delay(0.45)}>
              {t("location")}
            </span>
          </span>
        </div> */}

        <div className="relative col-start-5 col-end-8 max-md:col-span-4 max-md:col-start-1">
          {/* Sits behind its own column's copy, not behind the section: the
              patch is a descendant of the z-10 content, so it clears the
              footage while staying under the text it is there to hold up. */}

          <h2
            className="t-s a-fade-up mb-[var(--stack-y)] max-w-108 "
            style={delay(0.5)}
          >
            {t.rich("lead", italic)}
          </h2>
          <div className="a-fade-up" style={delay(0.6)}>
            <PillButton href="/new">{t("cta")}</PillButton>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
