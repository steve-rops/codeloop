import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { PROJECTS } from "../lib/projects";
import { ProjectCard } from "./project-card";
import { Reveal } from "./reveal";
import { stagger } from "../lib/motion";
import { italic } from "../lib/rich";

export function Work() {
  const t = useTranslations("workSection");
  const featured = PROJECTS.slice(0, 4);

  return (
    <section
      id="work"
      className="relative mx-[1vw] scroll-mt-[var(--nav-h)] pt-[var(--section-y)]"
    >
      <Reveal className="relative mb-[var(--block-y)] px-[1vw]">
        <div className="flex items-baseline justify-between gap-[var(--stack-y)]">
          <span className="mask">
            <span className="a-up t-xs block text-muted">{t("eyebrow")}</span>
          </span>

          <span className="mask">
            <Link
              href="/work"
              className="link a-up t-xs"
              style={stagger(1, 0.07)}
            >
              {t("allWork")}
            </Link>
          </span>
        </div>
      </Reveal>

      <div className="relative grid grid-cols-2 max-md:grid-cols-1">
        {featured.map((project, index) => (
          <ProjectCard
            key={project.slug}
            project={project}
            index={index}
            // Rules run outward from the centre line, so each row of the grid
            // closes from both sides at once.
            ruleFrom={index % 2 === 0 ? "right" : "left"}
          />
        ))}
      </div>
    </section>
  );
}
