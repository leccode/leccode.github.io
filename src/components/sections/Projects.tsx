import { projects, type Project } from "@/data/projects";
import { cn } from "@/lib/cn";
import { Section } from "@/components/ui/Section";
import { Tag, TagList } from "@/components/ui/Tag";
import {
  ArrowUpRightIcon,
  GitHubIcon,
  YouTubeIcon,
} from "@/components/ui/Icons";

const linkIcons = {
  github: GitHubIcon,
  youtube: YouTubeIcon,
} as const;

function ProjectCard({
  project,
  featured,
}: {
  project: Project;
  featured: boolean;
}) {
  return (
    <article
      className={cn(
        "panel flex flex-col rounded-2xl p-6 transition-colors hover:border-accent/50 sm:p-8",
        featured &&
          "lg:col-span-2 lg:grid lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-10",
      )}
    >
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h3
            className={cn(
              "font-semibold tracking-tight",
              featured ? "text-2xl sm:text-3xl" : "text-xl",
            )}
          >
            {project.title}
          </h3>
          {project.status && (
            <Tag tone={project.status === "Featured" ? "accent" : "signal"}>
              {project.status}
            </Tag>
          )}
        </div>
        <p className="mt-3 max-w-prose text-pretty text-muted">
          {project.summary}
        </p>
      </div>

      <div className="mt-6 flex flex-1 flex-col justify-end gap-6 lg:mt-0">
        <TagList items={project.tags} />
        {project.links.length > 0 && (
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {project.links.map((link) => {
              const Icon = linkIcons[link.icon ?? "github"];
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
                  >
                    <Icon width={16} height={16} />
                    {link.label}
                    <ArrowUpRightIcon width={14} height={14} />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </article>
  );
}

export function Projects() {
  return (
    <Section
      id="projects"
      title="Projects"
      lede="Selected work, from research tools to product ideas."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.title}
            project={project}
            featured={index === 0}
          />
        ))}
      </div>
    </Section>
  );
}
