export type Education = {
  degree: string;
  institution: string;
  status: "In progress" | "Paused" | "Completed";
  summary: string;
  link?: { label: string; href: string };
  tags?: readonly string[];
};

export const education: readonly Education[] = [
  {
    degree: "MPhil, Computer Science & Informatics",
    institution: "Harokopio University of Athens (HUA)",
    status: "In progress",
    summary:
      "Mechanistic neural networks, quantum computing and hardware for bioinformatics.",
  },
  {
    degree: "MSc, Microsystems & Nanodevices",
    institution: "National Technical University of Athens (NTUA)",
    status: "Paused",
    summary:
      "Quantum mechanics, nanobiotechnology and quantum computing. Resuming in 2027.",
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
];

export const experience = {
  years: "4+ years",
  summary:
    "Backend and full-stack production systems with clean REST APIs, built for real-world load.",
  domains: ["Banking & investment", "Healthcare"],
  current: "Currently engineering software for a clinic.",
} as const;
