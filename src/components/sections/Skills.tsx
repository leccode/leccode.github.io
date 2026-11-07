import { skillGroups } from "@/data/skills";
import { Section } from "@/components/ui/Section";
import { TagList } from "@/components/ui/Tag";

export function Skills() {
  return (
    <Section
      id="skills"
      title="Skills"
      lede="Full-stack engineering with clean architecture at its core."
    >
      <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
        {skillGroups.map((group) => (
          <div
            key={group.title}
            className="bg-surface-strong/80 p-6 backdrop-blur-md sm:p-8"
          >
            <h3 className="text-lg font-medium">{group.title}</h3>
            <p className="mt-1 mb-6 text-sm text-muted">{group.summary}</p>
            <TagList items={group.items} />
          </div>
        ))}
      </div>
    </Section>
  );
}
