import { siteConfig } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { ArrowUpRightIcon } from "@/components/ui/Icons";
import { CodeWindow } from "@/components/hero/CodeWindow";

export function Hero() {
  return (
    <section id="home" aria-labelledby="home-title">
      <Container className="grid min-h-[calc(100svh-4rem)] items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div className="min-w-0">
          <p className="panel inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm text-muted">
            <span className="relative flex size-2" aria-hidden="true">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-signal opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-signal" />
            </span>
            Open to new projects
          </p>

          <h1
            id="home-title"
            className="mt-6 text-[clamp(2.75rem,8vw,5.25rem)] leading-[1.02] font-semibold tracking-[-0.035em] text-balance"
          >
            {siteConfig.name}
          </h1>

          <p className="mt-6 max-w-xl text-lg text-pretty text-muted sm:text-xl">
            Software engineer building production systems. Biomedical engineer
            researching mechanistic neural networks.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <ButtonLink href="/#projects">View projects</ButtonLink>
            <ButtonLink href={`mailto:${siteConfig.email}`} variant="secondary">
              Email me
              <ArrowUpRightIcon width={16} height={16} />
            </ButtonLink>
            <SocialLinks className="ml-1" />
          </div>
        </div>

        <div className="min-w-0">
          <CodeWindow />
        </div>
      </Container>
    </section>
  );
}
