export const siteConfig = {
  name: "Constantine Lekkos",
  brand: "ecco.dev",
  role: "Software Engineer",
  url: "https://leccode.github.io",
  description:
    "Software engineer building production systems and biomedical engineer researching physics-informed neural networks.",
  email: "costas.lekkos@gmail.com",
  socials: {
    github: "https://github.com/leccode",
    linkedin: "https://www.linkedin.com/in/constantine-lekkos/",
  },
} as const;

export type NavLink = { label: string; href: string };

export const mainNav: NavLink[] = [
  { label: "Profile", href: "/#profile" },
  { label: "Skills", href: "/#skills" },
  { label: "Projects", href: "/#projects" },
  { label: "Blog", href: "/blog/" },
  { label: "About", href: "/about/" },
  { label: "Contact", href: "/#contact" },
];

export const footerNav: NavLink[] = [
  { label: "About", href: "/about/" },
  { label: "Blog", href: "/blog/" },
  { label: "Privacy", href: "/privacy/" },
];

export function isExternalHref(href: string): boolean {
  return /^(https?:|mailto:)/.test(href);
}
