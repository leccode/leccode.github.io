export type ProjectLink = {
  label: string;
  href: string;
  icon?: "github" | "youtube";
};

export type Project = {
  title: string;
  summary: string;
  tags: readonly string[];
  links: readonly ProjectLink[];
  status?: "Featured" | "In progress";
};

export const projects: readonly Project[] = [
  {
    title: "DNA/RNA Knowledgebase",
    summary: "A dashboard to store, browse and manage nucleic acid sequences.",
    tags: [".NET", "C#", "SQL Server", "Vue.js"],
    links: [
      {
        label: "Backend",
        href: "https://github.com/leccode/nucleic-acids-api",
      },
      {
        label: "Frontend",
        href: "https://github.com/leccode/nucleic-acids-ui",
      },
    ],
    status: "Featured",
  },
  {
    title: "GitHub Dashboard",
    summary: "Explore any GitHub profile through the public API.",
    tags: ["React", "Vite", "shadcn/ui", "Tailwind CSS"],
    links: [
      { label: "Code", href: "https://github.com/leccode/github-dashboard" },
    ],
  },
  {
    title: "Feedback Platform",
    summary: "A platform that users suggest and vote for features.",
    tags: ["Next.js", "PostgreSQL", "Prisma ORM", "shadcn/ui", "Clerk Auth"],
    links: [
      { label: "Code", href: "https://github.com/leccode/feedback-fusion" },
      {
        label: "Guided Tutorial",
        href: "https://www.youtube.com/watch?v=gXkEupunl2A",
        icon: "youtube",
      },
    ],
  },
  {
    title: "Gamified Learning Platform",
    summary: "Learn a new tech stack by playing through it.",
    tags: ["Next.js", "PostgreSQL", "Drizzle", "shadcn/ui"],
    links: [],
    status: "In progress",
  },
];
