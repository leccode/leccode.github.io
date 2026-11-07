import { education, experience } from "@/data/profile";
import { Section } from "@/components/ui/Section";
import { Tag, TagList } from "@/components/ui/Tag";
import { ArrowUpRightIcon } from "@/components/ui/Icons";

const statusTone = {
  "In progress": "signal",
  Paused: "default",
  Completed: "accent",
} as const;

export function Profile() {
  return (
    <Section
      id="profile"
      title="Profile"
      lede="Research and engineering, side by side."
    >
      <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <div>
          <h3 className="mb-2 text-sm font-medium text-muted">Education</h3>
          <ol className="divide-y divide-line border-y border-line">
            {education.map((item) => (
              <li
                key={item.degree}
                className="grid gap-3 py-7 sm:grid-cols-[1fr_auto] sm:gap-6"
              >
                <div>
                  <h4 className="text-lg font-medium">{item.degree}</h4>
                  <p className="text-sm text-muted">{item.institution}</p>
                  <p className="mt-3 max-w-prose text-pretty">{item.summary}</p>
                  {item.tags && (
                    <div className="mt-4">
                      <TagList items={item.tags} />
                    </div>
                  )}
                  {item.link && (
                    <a
                      href={item.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-link mt-4 inline-flex items-center gap-1 text-sm"
                    >
                      {item.link.label}
                      <ArrowUpRightIcon width={14} height={14} />
                    </a>
                  )}
                </div>
                <div className="sm:pt-1">
                  <Tag tone={statusTone[item.status]}>{item.status}</Tag>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <aside
          aria-labelledby="experience-title"
          className="panel h-fit rounded-2xl p-6 sm:p-8 lg:sticky lg:top-24"
        >
          <h3 id="experience-title" className="text-sm font-medium text-muted">
            Experience
          </h3>
          <p className="mt-3 text-2xl font-semibold tracking-tight">
            {experience.years} in production
          </p>
          <p className="mt-3 text-pretty text-muted">{experience.summary}</p>
          <ul className="mt-6 space-y-3">
            {experience.domains.map((domain) => (
              <li key={domain} className="flex items-center gap-3">
                <span
                  className="size-1.5 rounded-full bg-accent"
                  aria-hidden="true"
                />
                {domain}
              </li>
            ))}
          </ul>
          <p className="mt-6 border-t border-line pt-6 text-sm text-muted">
            {experience.current}
          </p>
        </aside>
      </div>
    </Section>
  );
}
