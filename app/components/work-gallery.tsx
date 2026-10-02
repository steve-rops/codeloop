import type { Project } from "../lib/projects";
import { ProjectCard } from "./project-card";

export function WorkGallery({ projects }: { projects: Project[] }) {
  return (
    <div className="mx-[1vw]">
      {/* Row gap on top of each card's own padding, so a row ends before the
          next begins instead of the panels stacking flush. */}
      <div className="grid grid-cols-2 gap-y-[3vw] max-md:grid-cols-1 max-md:gap-y-[6vw]">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.slug}
            project={project}
            index={index}
            ruleFrom={index % 2 === 0 ? "right" : "left"}
            height="var(--card-h-sm)"
          />
        ))}
      </div>
    </div>
  );
}
