import Link from "next/link";
import { footerNav, siteConfig } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { SocialLinks } from "@/components/ui/SocialLinks";

export function Footer() {
  // Static export: the year is set at build time. Every deploy refreshes it.
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <Container className="flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          © {year} {siteConfig.name}
        </p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <nav aria-label="Footer">
            <ul className="flex gap-5">
              {footerNav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-fg"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <SocialLinks className="-mr-2" />
        </div>
      </Container>
    </footer>
  );
}
