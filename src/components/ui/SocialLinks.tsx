import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/cn";
import { GitHubIcon, LinkedInIcon } from "./Icons";

const links = [
  { label: "GitHub", href: siteConfig.socials.github, Icon: GitHubIcon },
  { label: "LinkedIn", href: siteConfig.socials.linkedin, Icon: LinkedInIcon },
] as const;

export function SocialLinks({ className }: { className?: string }) {
  return (
    <ul className={cn("flex items-center gap-2", className)}>
      {links.map(({ label, href, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="grid size-10 place-items-center rounded-full text-muted transition-colors hover:bg-surface hover:text-fg"
          >
            <Icon />
          </a>
        </li>
      ))}
    </ul>
  );
}
