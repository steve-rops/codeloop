import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { Project } from "../lib/projects";
import { Media } from "./media";
import { Reveal } from "./reveal";
import { stagger } from "../lib/motion";
import { messagesList } from "../lib/messages-list";

type ProjectCardProps = {
  project: Project;
  index: number;
  /** Which way the rule under the artwork draws itself in. */
  ruleFrom?: "left" | "right";
  /** Height of the visual slot. Defaults to the shared `--card-h` step. */
  height?: string;
};

/**
 * One entry in the work grid.
 *
 * Each card owns its own observer rather than inheriting the section's, so a
 * two-column grid reveals as you reach each row instead of firing everything
 * the moment the section's top edge appears. Inside a card the order is
 * deliberate: artwork first, then the tags rippling across, then the name — the
 * same order you'd read it in.
 *
 * The whole entry sits on its own bordered, blurred sheet (`.project-panel`),
 * because four plates butted together at the same scale read as one continuous
 * piece of artwork; the border and the gap are what say "four projects".
 */
export function ProjectCard({
  project,
  index,
  ruleFrom = "left",
  height = "var(--card-h)",
}: ProjectCardProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations("projectPage");
  const p = useTranslations(`projects.${project.slug}`);
  const tags = messagesList(p.raw("tags"));

  return (
    <Reveal as="article" className="group flex flex-col p-[1vw]">
      <Link
        href={`/work/${project.slug}`}
        data-cursor={t("viewCase")}
        className="project-panel flex h-full flex-col"
      >
        <div className="relative overflow-hidden rounded-[3px]" style={{ height }}>
          <div className="ease-circ h-full transition-transform duration-1000 group-hover:scale-[1.03]">
            <Media
              seed={project.slug}
              src={project.image?.[locale]}
              alt={t("imageAlt", { client: p("client") })}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="h-full w-full"
            />
          </div>

          {/* Sits outside the scaling layer so it holds still on hover, and
              waits for the artwork to settle before it arrives. */}
          {project.status === "development" ? (
            <span
              className="a-fade-up t-xxs bg-ink text-paper absolute bottom-3 left-3 rounded-full px-3 py-1.5"
              style={stagger(0, 0, 0.6)}
            >
              {t("inDevelopment")}
            </span>
          ) : null}
        </div>

        {/* Hairline drawn between the artwork and its caption, running outward
            from the grid's centre so a row closes from both sides. Inside the
            panel it also does the job the old foot rule did: it keeps the plate
            from bleeding straight into the type. */}
        <div
          className={`mt-[var(--stack-y)] flex h-px ${ruleFrom === "right" ? "justify-end" : "justify-start"}`}
        >
          <span className="a-fill-w bg-ink block h-full" style={stagger(0, 0, 0.35)} />
        </div>

        <div className="mt-[var(--stack-y)] flex flex-col items-start">
          <div className="flex w-full items-start justify-between">
            <div className="flex flex-wrap">
              {tags.map((tag, tagIndex) => (
                <span key={tagIndex} className="mask">
                  <span
                    className="a-up t-xs flex items-center"
                    style={stagger(tagIndex, 0.05, 0.1)}
                  >
                    {tagIndex > 0 ? (
                      <span className="mx-1 text-muted">&#8212;</span>
                    ) : null}
                    {tag}
                  </span>
                </span>
              ))}
            </div>

            <span className="mask shrink-0 pl-[1vw]">
              <span
                className="a-up t-xs block text-muted"
                style={stagger(tags.length, 0.05, 0.1)}
              >
                {String(index + 1).padStart(2, "0")} / {project.year}
              </span>
            </span>
          </div>

          <span className="mask mt-[var(--stack-y)]">
            <span className="a-up t-m block" style={stagger(1, 0.06, 0.2)}>
              {p("client")}
            </span>
          </span>
        </div>
      </Link>
    </Reveal>
  );
}
