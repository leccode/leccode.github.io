/**
 * ✏️  Edit this file to update the site.
 * Everything on the home page (text, projects, education, code windows) reads from here.
 * Articles live in /content/articles/*.md.
 */

export type Category = "Full-stack" | "Frontend";

export type ProjectLink = {
  label: string;
  href: string;
  icon?: "github" | "youtube";
};

export type Project = {
  title: string;
  description: string;
  tags: string[];
  category: Category;
  links: ProjectLink[];
  status?: "Featured" | "In progress";
  /** OKLCH hue (0–360) used to generate the project's cover art */
  hue: number;
};

export type Tech = { name: string; icon: string };
export type StackGroup = { title: string; items: Tech[] };

export type Education = {
  degree: string;
  institution: string;
  status: "In progress" | "Paused" | "Completed";
  summary: string;
  link?: { label: string; href: string };
  tags?: string[];
};

export const site = {
  name: "Constantine Lekkos",
  initials: "CL",
  brand: { name: "ecco", tld: ".dev" },
  role: "Software Engineer",
  roles: [
    "Software Engineer",
    "Biomedical Engineer",
    ".NET & TypeScript Developer",
  ],
  headline: {
    line1: ["Production", "software,"],
    accent: "informed",
    line2: ["by", "industry standards."],
  },
  tagline: "Software engineer building production systems.",
  description: "Software engineer building production systems.",
  bio: "I’m a software engineer and biomedical engineer, and I care about how technology solves hard problems in science and industry. For over four years I’ve built backend and full-stack systems across fintech, healthcare and various domains, with .NET/C#, Blazor and modern JavaScript.",
  now: [
    "Engineering software for a clinic",
    "MPhil research on mechanistic neural networks",
  ],
  location: "Athens, Greece",
  timezone: "Europe/Athens",
  email: "costas.lekkos@gmail.com",
  url: "https://leccode.github.io",
  available: true,
  socials: [
    { label: "GitHub", href: "https://github.com/leccode", icon: "github" },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/constantine-lekkos/",
      icon: "linkedin",
    },
  ] as const,
  stats: [
    { label: "Experienced years", value: 4, suffix: "+" },
    { label: "University programmes", value: 3, suffix: "" },
    { label: "Industries served", value: 2, suffix: "" },
  ],
  experience: {
    summary:
      "Backend and full-stack production systems with clean REST APIs and web apps, built for real-world load.",
    domains: ["Banking & investment", "Healthcare"],
    current: "Currently engineering software for a clinic.",
  },
  /** Tech stack. `icon` is a skillicons.dev id; icons are downloaded at build time. */
  stack: [
    {
      title: "Languages",
      items: [
        { name: "C#", icon: "cs" },
        { name: "JavaScript", icon: "js" },
        { name: "TypeScript", icon: "ts" },
        { name: "Python", icon: "py" },
        { name: "HTML", icon: "html" },
        { name: "CSS", icon: "css" },
      ],
    },
    {
      title: "Frameworks & runtimes",
      items: [
        { name: ".NET", icon: "dotnet" },
        { name: "Node.js", icon: "nodejs" },
        { name: "NestJS", icon: "nestjs" },
        { name: "React", icon: "react" },
        { name: "Next.js", icon: "nextjs" },
        { name: "Angular", icon: "angular" },
        { name: "Tailwind CSS", icon: "tailwind" },
      ],
    },
    {
      title: "Data & tools",
      items: [
        { name: "PostgreSQL", icon: "postgres" },
        { name: "MongoDB", icon: "mongodb" },
        { name: "Linux", icon: "linux" },
        { name: "Git", icon: "git" },
      ],
    },
  ] satisfies StackGroup[],
  /** Shown as text under the icons. */
  alsoStack: [
    "SQL Server",
    "Blazor",
    "REST APIs",
    "Clean Architecture",
    "SOLID",
  ],
  projects: [
    {
      title: "DNA/RNA Knowledgebase",
      description:
        "A dashboard to store, browse and manage nucleic acid sequences.",
      tags: [".NET", "C#", "SQL Server", "Vue.js"],
      category: "Full-stack",
      status: "Featured",
      hue: 160,
      links: [
        {
          label: "Backend",
          href: "https://github.com/leccode/nucleic-acids-api",
          icon: "github",
        },
        {
          label: "Frontend",
          href: "https://github.com/leccode/nucleic-acids-ui",
          icon: "github",
        },
      ],
    },
    {
      title: "GitHub Dashboard",
      description: "Explore any GitHub profile through the public API.",
      tags: ["React", "Tailwind CSS", "shadcn/ui"],
      category: "Frontend",
      hue: 265,
      links: [
        {
          label: "Code",
          href: "https://github.com/leccode/github-dashboard",
          icon: "github",
        },
      ],
    },
    {
      title: "Feedback Platform",
      description: "A platform that users suggest and vote for features.",
      tags: ["Next.js", "PostgreSQL"],
      category: "Full-stack",
      hue: 30,
      links: [
        {
          label: "Code",
          href: "https://github.com/leccode/feedback-fusion",
          icon: "github",
        },
        {
          label: "Guided Tutorial",
          href: "https://www.youtube.com/watch?v=gXkEupunl2A",
          icon: "youtube",
        },
      ],
    },
  ] satisfies Project[],
  education: [
    {
      degree: "MSc, Microsystems & Nanodevices",
      institution: "National Technical University of Athens (NTUA)",
      status: "Paused",
      summary:
        "Quantum mechanics, nanobiotechnology and quantum computing. Resuming in 2027.",
    },
    {
      degree: "MPhil, Computer Science & Informatics",
      institution: "Harokopio University of Athens (HUA)",
      status: "In progress",
      summary:
        "Mechanistic neural networks, quantum computing and hardware for bioinformatics.",
    },
    {
      degree: "Diploma (MEng), Biomedical Engineering",
      institution: "University of West Attica (UNIWA)",
      status: "Completed",
      summary:
        "Thesis: a medicinal plant classification system for dermatological treatment, with NKUA Pharmacy.",
      link: {
        label: "Read the thesis",
        href: "https://polynoe.lib.uniwa.gr/xmlui/handle/11400/11684",
      },
      tags: [".NET", "C#", "SQL Server", "Angular", "Python", "Fuzzy logic"],
    },
  ] satisfies Education[],
};

/** Flat list of every icon technology, used by the marquee and the icon download. */
export const allTech = site.stack.flatMap((g) => g.items);

/* ---------- Code shown in the hero code window ---------- */

export type CodeFile = {
  name: string;
  lang: "ts" | "tsx" | "bash" | "py" | "cs";
  code: string;
};

export const heroFiles: CodeFile[] = [
  {
    name: "about.ts",
    lang: "ts",
    code: `type Engineer = {
  name: string;
  roles: string[];
  research: string[];
};

export const me: Engineer = {
  name: "${site.name}",
  roles: ["software engineer", "biomedical engineer"],
  research: [
    "mechanistic neural networks",
    "quantum computing",
    "hardware for bioinformatics"],
};

export async function solve(problem: Problem) {
  const model = await understand(problem.science);
  return ship(
    model,
    { architecture: "clean", load: "real-world" }
  );
}`,
  },
];

export const heroOutput = [
  "$ npm run build",
  "▲ Next.js · compiled successfully",
  "✓ Generated static pages",
  `→ live at ${site.url.replace("https://", "")}`,
];
