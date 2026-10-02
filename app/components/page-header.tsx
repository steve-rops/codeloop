import type { ReactNode } from "react";
import { Reveal } from "./reveal";
import { delay } from "../lib/motion";

/**
 * Shared opening block for the interior pages. Mirrors the home hero's
 * choreography at a smaller scale — eyebrow, then the title line by line, then
 * the intro fading up underneath — so arriving on any page feels like the same
 * site opening rather than a different one loading.
 */
export function PageHeader({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <Reveal
      as="header"
      className="gutter pt-[calc(var(--nav-h)+6vw)] pb-[4vw] max-md:pt-[calc(var(--nav-h)+12vw)] max-md:pb-12"
    >
      <span className="mask">
        <span className="a-up t-xs block text-muted" style={delay(0.1)}>
          {eyebrow}
        </span>
      </span>

      <h1 className="t-l mt-[1.5vw] w-[80%] max-md:mt-4 max-md:w-full">
        <span className="mask">
          <span className="a-up block" style={delay(0.2)}>
            {title}
          </span>
        </span>
      </h1>

      {intro ? (
        <p
          className="t-p a-fade-up mt-[2.5vw] w-[30vw] max-md:mt-7 max-md:w-full"
          style={delay(0.4)}
        >
          {intro}
        </p>
      ) : null}

      {children}
    </Reveal>
  );
}
