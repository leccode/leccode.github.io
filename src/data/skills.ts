export type SkillGroup = {
  title: string;
  summary: string;
  items: readonly string[];
};

export const skillGroups: readonly SkillGroup[] = [
  {
    title: "Frontend",
    summary: "Responsive, accessible interfaces.",
    items: ["Next.js", "React", "TypeScript", "Blazor", "Tailwind CSS"],
  },
  {
    title: "Backend & data",
    summary: "Scalable APIs and solid data layers.",
    items: [
      ".NET / C#",
      "Rust",
      "Node.js",
      "Python",
      "REST",
      "SQL Server",
      "PostgreSQL",
    ],
  },
  {
    title: "Tools & practice",
    summary: "Clean code that ships and lasts.",
    items: [
      "Git",
      "Linux",
      "Docker",
      "AWS",
      "Arduino",
      "Embedded",
      "SOLID",
      "Clean Architecture",
      "Agile",
    ],
  },
];
